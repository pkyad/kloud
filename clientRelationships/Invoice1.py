from django.contrib.auth.models import User, Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets, permissions, serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from django.db.models import Q, F
from django.http import HttpResponse
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from ERP.models import service, appSettingsField,address
from HR.models import profile
# Create your views here.
from reportlab import *
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors, utils
from reportlab.platypus import Paragraph, Table, TableStyle, Image, Frame, Spacer, PageBreak, BaseDocTemplate, PageTemplate, SimpleDocTemplate, Flowable
from PIL import Image
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet, TA_CENTER
from reportlab.graphics import barcode, renderPDF
from reportlab.graphics.shapes import *
from reportlab.graphics.barcode.qr import QrCodeWidget
import datetime
import calendar as pythonCal
import json
import pytz
import requests
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from django.db.models import Sum, Count
from dateutil.relativedelta import relativedelta
from PIM.models import calendar
# from organization.models import  Responsibility
from excel_response import ExcelResponse
from django.db.models.functions import Concat
from django.db.models import Value
import xlsxwriter
from clientRelationships.serializers import ContractSerializer,ContactSerializer,DealLiteSerializer
from projects.models import project,Issues, ProjectObjective
from projects.serializers import IssueSerializer
from finance.models import Sale,SalesQty
from finance.serializers import SaleSerializer,SalesQtySerializer
from mail.models import mailAttachment
from ERP.models import GenericPincode
from rest_framework import filters
from django.http import JsonResponse
from svglib.svglib import svg2rlg
from reportlab.lib.units import inch, cm

themeColor = colors.HexColor('#227daa')

styles = getSampleStyleSheet()
styleN = styles['Normal']
styleH = styles['Heading1']


class FullPageImage(Flowable):
    def __init__(self, img):
        Flowable.__init__(self)
        self.image = img

    def draw(self):
        img = utils.ImageReader(self.image)

        iw, ih = img.getSize()
        aspect = ih / float(iw)
        width, self.height = PAGE_SIZE
        width -= 3.5 * cm
        self.canv.drawImage(os.path.join(BASE_DIR, self.image), -1 * MARGIN_SIZE +
                            1.5 * cm, -1 * self.height + 5 * cm, width, aspect * width)


class expanseReportHead(Flowable):

    def __init__(self, request, contract):
        Flowable.__init__(self)
        self.req = request
        self.contract = contract
    #----------------------------------------------------------------------

    def draw(self):
        """
        draw the floable
        """
        print self.contract.status
        now = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
        print self.contract.status
        if self.contract.status in ['quoted']:
            docTitle = 'QUOTATION'
        else:
            docTitle = 'TAX INVOICE'
        if(self.contract.deal):
            id = self.contract.deal.pk
        elif(self.contract.contact):
            id = self.contract.contact.pk
        else:
            id = self.contract.pk
        docID = '%s%s%s' % (id, now.year, self.contract.pk)
        utc_time = self.contract.created
        tz = pytz.timezone( 'Asia/Kolkata')
        utc_time =utc_time.replace(tzinfo=pytz.UTC) #replace method
        indian_time=utc_time.astimezone(tz)        #astimezone method
        datecreated = str(indian_time.strftime("%d-%B-%Y - %H:%M %S"))
        try:
            passKey = '%s%s' % (str(self.req.user.date_joined.year),self.req.user.pk)  # also the user ID
            pSrc = '''
            <font size=9>
            <strong>On:</strong> %s<br/>
            <strong>#:</strong> %s<br/><br/>
            </font>
            ''' % ( datecreated, docID)
        except:
            pSrc = '''
            <strong>On:</strong> %s<br/>
            <strong>Document ID:</strong> %s<br/><br/>
            </font>
            ''' % ( datecreated, docID)

        story = []
        head = Paragraph(pSrc, styleN)
        head.wrapOn(self.canv, 200 * mm, 50 * mm)
        head.drawOn(self.canv, 0 * mm, -10 * mm)

        # barcode_value = "1234567890"
        # barcode39 = barcode.createBarcodeDrawing('EAN13', value = barcode_value,barWidth=0.3*mm,barHeight=10*mm)
        #
        # barcode39.drawOn(self.canv,160*mm,0*mm)
        # self.canv.drawImage(os.path.join(BASE_DIR , 'logo.png') , 80*mm , 0*mm , 2*cm, 2*cm)


def addPageNumber(canvas, doc):
    """
    Add the page number
    """
    print doc.contract
    now = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
    if(doc.contract.deal):
        id = doc.contract.deal.pk
    elif(doc.contract.contact):
        id = doc.contract.contact.pk
    else:
        id = doc.contract.pk
    docID = '%s%s%s' % (id, now.year, doc.contract.pk)
    try:
        passKey = '%s%s' % (str(doc.request.user.date_joined.year),doc.request.user.pk)  # also the user ID
    except:
        passKey = docID


    # qrw = QrCodeWidget(
    #     'http://cioc.co.in/documents?id=%s&passkey=%s&app=crmInvoice' % (docID, passKey))
    # b = qrw.getBounds()
    #
    # w = b[2] - b[0]
    # h = b[3] - b[1]
    #
    # d = Drawing(60, 60, transform=[60. / w, 0, 0, 60. / h, 0, 0])
    d = Drawing(60, 60)
    # d.add(qrw)
    renderPDF.draw(d, canvas, 180 * mm, 270 * mm)

    pass

    # page_num = canvas.getPageNumber()
    # text = "<font size='8'>Page #%s</font>" % page_num
    # p = Paragraph(text , styleN)
    # p.wrapOn(canvas , 50*mm , 10*mm)
    # p.drawOn(canvas , 100*mm , 10*mm)


class PageNumCanvas(canvas.Canvas):

    #----------------------------------------------------------------------
    def __init__(self, *args, **kwargs):
        """Constructor"""
        canvas.Canvas.__init__(self, *args, **kwargs)
        print "dir : ---------", dir(self)
        print dir(args[0]) , "=============================" , args[0].__class__
        self.contract =  args[0].contract
        self.division =  args[0].division
        self.unit =  args[0].unit
        # print "contractId : " , contractId
        self.pages = []

    #----------------------------------------------------------------------
    def showPage(self):
        """
        On a page break, add information to the list
        """
        self.pages.append(dict(self.__dict__))
        self._startPage()

    #----------------------------------------------------------------------
    def save(self):
        """
        Add the page number to each page (page x of y)
        """
        page_count = len(self.pages)

        for page in self.pages:
            self.__dict__.update(page)
            # self.draw_page_number(page_count)
            self.drawLetterHeadFooter()
            canvas.Canvas.showPage(self)

        canvas.Canvas.save(self)

    #----------------------------------------------------------------------
    def draw_page_number(self, page_count):
        """
        Add the page number
        """

        text = "<font size='8'>Page #%s of %s</font>" % (
            self._pageNumber, page_count)
        p = Paragraph(text, styleN)
        p.wrapOn(self, 50 * mm, 10 * mm)
        p.drawOn(self, 100 * mm, 10 * mm)

    def drawLetterHeadFooter(self):
        if self.contract.termsAndCondition is not None and self.contract.termsAndCondition.themeColor is not None:
            themeColor = colors.HexColor(self.contract.termsAndCondition.themeColor)
        else:
            termsObj = CRMTermsAndConditions.objects.filter(division = self.division)
            if termsObj.count()>0:
                themeColor = colors.HexColor(termsObj.first().themeColor)
        settingsFields = application.objects.get(name='app.CRM').settings.all()
        self.setStrokeColor(themeColor)
        self.setFillColor(themeColor)
        self.rect(0, 0, 1500, 70, fill=True)
        # print dir(self)
        compNameStyle = styleN.clone('footerCompanyName')
        compNameStyle.textColor = 'white'
        print self.unit
        addStr = "<font size='10'>%s,%s %s %s %s</font>"%(self.unit.address , self.unit.city ,self.unit.pincode , self.unit.state, self.unit.country )
        contactwebStr = "<font size='10'>%s</font>"%(self.division.website )
        contactemailStr = "<font size='10'>%s</font>"%(self.unit.email )
        contactmobStr = "<font size='10'>%s</font>"%( self.unit.mobile )
        unitGSTINStr = "<font size='10'>%s</font>"%( self.unit.gstin )


        tableparaStyle = ParagraphStyle('parrafos',alignment = TA_CENTER,fontSize = 16, fontName="Times-Roman", textColor = 'white')
        p = Paragraph("<font size='13'>%s</font>"%(self.division.name), tableparaStyle)
        tab = Table([[p]])
        tab.wrapOn(self, 50 * mm, 10 * mm)
        tab.drawOn(self, 85 * mm, 18 * mm)
        p1 = Paragraph(addStr , tableparaStyle)
        tab1 = Table([[p1]])
        tab1.wrapOn(self, 200 * mm, 10 * mm)
        tab1.drawOn(self, 15 * mm, 10 * mm)
        web = Paragraph(contactwebStr , tableparaStyle)
        email = Paragraph(contactemailStr , tableparaStyle)
        mob = Paragraph(contactmobStr , tableparaStyle)
        gstin = Paragraph(unitGSTINStr , tableparaStyle)
        tab2 = Table([[gstin,web,email,mob]],colWidths=[2*inch, 2*inch, 2*inch , 2*inch])
        tab2.wrapOn(self, 200 * mm, 10 * mm)
        tab2.drawOn(self, 5 * mm, 4 * mm)
        tableheaderparaStyle = ParagraphStyle('parrafos',fontSize = 16, fontName="Times-Roman", textColor = 'black', leading = 10)
        from reportlab.platypus import Image
        imagePath = os.path.join(globalSettings.MEDIA_ROOT , str(self.division.logo))
        f = open(imagePath, 'rb')
        ima = Image(f)
        # ima.drawHeight = 0.8*inch
        ima.drawWidth = 2*inch
        ima.hAlign = 'RIGHT'
        tab5 = Table([[ima]])
        tab5.wrapOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        tab5.drawOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        # from svglib.svglib import svg2rlg
        #
        # if self.contract.status in ['billed', 'approved', 'recieved']:
        #     headerFilePath = globalSettings.INVOICE_HEADER
        # else:
        #     headerFilePath = globalSettings.QUOTE_HEADER
        #
        # drawing = svg2rlg(os.path.join(globalSettings.BASE_DIR,
        #                                'static_shared', 'images', headerFilePath))
        # sx = sy = 0.5
        # if drawing.width>3000:
        #     sx = sy = 0.18
        # drawing.width, drawing.height = drawing.minWidth() * sx, drawing.height * sy
        # drawing.scale(sx, sy)
        # renderPDF.draw(drawing, self, 1 * mm, self._pagesize[1] - 25 * mm)



        #width = self._pagesize[0]
        # page = "Page %s of %s" % (, page_count)
        # self.setFont("Helvetica", 9)
        # self.drawRightString(195*mm, 272*mm, page)

from num2words import num2words


def genInvoice(response, contract, request):
    divsn = request.user.designation.division
    unt  = request.user.designation.unit

    if contract.termsAndCondition is not None and contract.termsAndCondition.themeColor is not None:
        themeColor = colors.HexColor(contract.termsAndCondition.themeColor)
    else:
        termsObj = CRMTermsAndConditions.objects.filter(division = divsn)
        if termsObj.count()>0:
            themeColor = colors.HexColor(termsObj.first().themeColor)

    MARGIN_SIZE = 8 * mm
    PAGE_SIZE = A4

    pdf_doc = SimpleDocTemplate(response, pagesize=PAGE_SIZE,
                                leftMargin=MARGIN_SIZE, rightMargin=MARGIN_SIZE,
                                topMargin=4 * MARGIN_SIZE, bottomMargin=3 * MARGIN_SIZE)


    pdf_doc.contract = contract
    pdf_doc.request = request
    tableHeaderStyle = styles['Normal'].clone('tableHeaderStyle')
    tableHeaderStyle.textColor = colors.white
    tableHeaderStyle.fontSize = 7

    pHeadDetails = Paragraph('<strong>Details of Products & Services</strong>', tableHeaderStyle)
    pHeadTaxCode = Paragraph('<strong>HSN/<br/>SAC</strong>', tableHeaderStyle)
    pHeadQty = Paragraph('<strong>Qty</strong>', tableHeaderStyle)
    pHeadPrice = Paragraph('<strong>Rate</strong>', tableHeaderStyle)
    pHeadTotal = Paragraph('<strong>Total</strong>', tableHeaderStyle)
    pHeadTax = Paragraph('<strong>IGST </strong>', tableHeaderStyle)
    pHeadcgst = Paragraph('<strong>CGST </strong>', tableHeaderStyle)
    pHeadsgst = Paragraph('<strong>SGST </strong>', tableHeaderStyle)
    pHeadSubTotal = Paragraph('<strong>Sub Total</strong>', tableHeaderStyle)

    if contract.deal!= None:
        tin = contract.deal.company.tin
        stateName = contract.deal.company.address.state
    elif contract.contact!=None and contract.contact.company != None:
        tin = contract.contact.company.tin
        if contract.contact.company.address == None:
            stateName = contract.contact.state
        else:
            stateName = contract.contact.company.address.state
    else:
        tin = ''
        stateName = contract.contact.state

    try:
        stateCode = tin[:2]
    except:
        stateCode = ''

    try:
        stateValue = stateName[:2]
    except:
        stateValue = ''

    if contract.contact is not None:
        isGst = contract.contact.isGst
    else:
        isGst = True # should be a boolean in the company model

    if isGst == False:
        if stateCode == '29':
            data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                     pHeadQty, pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
        else:
            if stateValue =='KA':
                data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                         pHeadQty, pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
            else:
                data = [[pHeadDetails, pHeadTaxCode, pHeadPrice,
                    pHeadQty, pHeadTotal, pHeadTax, pHeadSubTotal]]
    else:
        data = [[pHeadDetails, pHeadPrice,
            pHeadQty, pHeadTotal, pHeadSubTotal]]


    totalQuant = 0
    totalTax = 0
    grandTotal = 0
    totalVal = 0
    tableBodyStyle = styles['Normal'].clone('tableBodyStyle')
    tableBodyStyle.fontSize = 7

    for i in json.loads(contract.data):
        print i
        print i['desc']
        pDescSrc = i['desc']
        totalQuant += int(i['quantity'])
        totalTax += float(i['totalTax'])
        grandTotal += float(i['subtotal'])
        tot = 0
        tot = int(i['quantity']) * float(i['rate'])
        totalVal+=float(tot)
        if 'saleType' in i:
            pBodyProd = Paragraph(i['saleType'], tableBodyStyle)
        else:
            pBodyProd = Paragraph('Service', tableBodyStyle)

        pBodyTitle = Paragraph(pDescSrc, tableBodyStyle)
        pBodyQty = Paragraph(str(i['quantity']), tableBodyStyle)
        pBodyPrice = Paragraph(str(i['rate']), tableBodyStyle)
        if 'taxCode' in i:
            taxCode = '%s(%s %%)' % (i['taxCode'], i['tax'])
        else:
            taxCode = ''

        pBodyTaxCode = Paragraph(taxCode, tableBodyStyle)
        pBodyTax = Paragraph(str(i['totalTax']), tableBodyStyle)

        sgst = round(i['totalTax']/2,2)
        pBodycgst = Paragraph(str(sgst), tableBodyStyle)
        pBodysgst = Paragraph(str(sgst), tableBodyStyle)

        pBodyTotal = Paragraph(str(round(tot,2)), tableBodyStyle)
        pBodySubTotal = Paragraph(str(round(i['subtotal'],2)), tableBodyStyle)
        if isGst == False:
            if stateCode == '29':
                data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                         pBodyQty, pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
            else:
                if stateValue =='KA':
                    data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                             pBodyQty, pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
                else:
                    data.append([ pBodyTitle, pBodyTaxCode, pBodyPrice,
                             pBodyQty, pBodyTotal, pBodyTax, pBodySubTotal])
        else:
            data.append([ pBodyTitle, pBodyPrice,
                     pBodyQty, pBodyTotal, pBodySubTotal])

    grandTotal = round(grandTotal,2)
    contract.grandTotal = grandTotal
    contract.totalTax = round(totalTax,2)
    contract.save()
    discount = contract.discount
    discoubtedPrice = grandTotal - discount
    discountText = 'Discount'

    if round(discount) == 0:
        discountText = ''
        discount = ''


    tableGrandStyle = tableHeaderStyle.clone('tableGrandStyle')
    tableGrandStyle.fontSize = 10

    print "stateCode : " , stateCode

    # if contract.coupon:
    wordData =  num2words(round(discoubtedPrice,2), lang='en_IN')
    if isGst == False:
        if stateCode == '29':
            totalTax1 = round(totalTax/2,2)
            try:
                discoubtedPrice = str(round(discoubtedPrice,2))
            except :
                discoubtedPrice =  str(round(discoubtedPrice,2))
            data += [[ '', '', '', '', Paragraph(str(round(totalVal,2)), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph(discountText, tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
        else:
            if stateValue =='KA':
                totalTax1 = round(totalTax/2,2)
                try:
                    discoubtedPrice = str(round(discoubtedPrice,2))
                except :
                    discoubtedPrice =  str(round(discoubtedPrice,2))
                data += [[ '', '', '', '', Paragraph(str(round(totalVal,2)), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph(discountText, tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
            else:
                try:
                    discoubtedPrice = str(round(discoubtedPrice,2))
                except :
                    discoubtedPrice =  str(round(discoubtedPrice,2))
                data += [[ '', '', '', '', Paragraph(str(round(totalVal,2)), tableBodyStyle),Paragraph(str(totalTax), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph(discountText, tableBodyStyle), '', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
    else:
        totalTax1 = round(totalTax/2,2)
        try:
            discoubtedPrice = str(round(discoubtedPrice,2))
        except :
            discoubtedPrice =  str(round(discoubtedPrice,2))
        data += [[ '', '', '', Paragraph(str(round(totalVal,2)), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                [ '', '','',  Paragraph(discountText, tableBodyStyle), Paragraph(str(discount), tableBodyStyle)],
                [ '', '','',   Paragraph('Grand Total (INR)', tableHeaderStyle), Paragraph(discoubtedPrice, tableGrandStyle)]]


    t = Table(data)
    if isGst == False:
        if stateCode == '29' or stateValue =='KA':
            ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                             ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                             ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                             ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                             ('SPAN', (-3, -1), (-2, -1)),
                             ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                             ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                             ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                             ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                             # ('BACKGROUND', (-3, -2), (-1, -2), colors.HexColor('#eeeeee')),
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (-3, -2), (-1, -2), 0.25, colors.gray),
                             ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             # ('LINEBELOW',(0,-1),(-1,-1),0.25,colors.gray),
                             ])
        else:
            ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                             ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                             ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                             ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                             ('SPAN', (-3, -1), (-2, -1)),
                             ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                             ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                             ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                             ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                             # ('BACKGROUND', (-2, -2), (-1, -2), colors.HexColor('#eeeeee')),
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (-2, -2), (-1, -2), 0.25, colors.gray),
                             ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             # ('LINEBELOW',(0,-1),(-1,-1),0.25,colors.gray),
                             ])
    else:
        ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                         ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                         ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                         ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                         # ('SPAN', (-3, -1), (-2, -1)),
                         # ('SPAN', (-2, -1), (-1, -1)),
                         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                         ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                         ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                         ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                         ('BACKGROUND', (-2, -1), (-1, -1), themeColor),
                         ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                         ])
    t.setStyle(ts)
    if isGst == False:
        if stateCode == '29' or stateValue =='KA':
            t._argW[0] = 6.4 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 1.2 * cm
            t._argW[4] = 2 * cm
            t._argW[5] = 1.5 * cm
            t._argW[6] = 2.0 * cm
            t._argW[7] = 2.1 * cm
        else:
            t._argW[0] = 6.5 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 1.2 * cm
            t._argW[4] = 2 * cm
            t._argW[5] = 1.5 * cm
            t._argW[6] = 2.3 * cm
    else:
            t._argW[0] = 7 * cm
            t._argW[1] = 2.4 * cm
            t._argW[2] = 2 * cm
            t._argW[3] = 2.5 * cm
            t._argW[4] = 3 * cm
            # t._argW[5] = 1.5 * cm


    story = []

    expHead = expanseReportHead(request, contract)
    try:
        if len(contract.termsAndCondition.heading)>0:
            story.append(Paragraph(contract.termsAndCondition.heading, styleH))
    except:
        if len(contract.heading)>0:
            story.append(Paragraph(contract.heading, styleH))
    story.append(Spacer(2.5, 1 * cm))
    story.append(expHead)
    story.append(Spacer(2.5, 0.75 * cm))
    adrs = None
    if contract.deal!=None:
        adrs = contract.deal.company.address
    elif contract.contact.company != None:
        adrs = contract.contact.company.address



    if contract.contact!=None and adrs is None:
        adrsStreet = contract.contact.street
        adrsCity= contract.contact.city
        adrsState= contract.contact.state
        adrsPincode = contract.contact.pincode
        adrsCountry = contract.contact.country
    elif adrs is None:
        adrsStreet = ""
        adrsCity = ""
        adrsState = ""
        adrsPincode = ""
        adrsCountry = ""
    else:
        adrsStreet = adrs.street
        adrsCity = adrs.city
        adrsState = adrs.state
        adrsPincode = adrs.pincode
        adrsCountry = adrs.country

    ph = 'NA'
    if adrsStreet == None:
        adrsStreet = ''
    if adrsCity == None:
        adrsCity = ''
    if adrsState == None:
        adrsState = ''
    if adrsPincode == None:
        adrsPincode = ''
    if adrsCountry == None:
        adrsCountry = ''
    # contract.deal.contacts.all()[0].name, contract.deal.company.name

    if contract.deal!=None:
        try:
            name=contract.deal.contacts.all()[0].name
        except:
            name=''
        companyName=contract.deal.company.name
        if contract.deal.company.mobile == None:
            ph = 'NA'
        else:
            ph = contract.deal.company.mobile
    elif contract.contact!=None:
        name = contract.contact.name
        if contract.contact.mobile == None:
            ph = 'NA'
        else:
            ph = contract.contact.mobile
        if contract.contact.company!= None:
            companyName=contract.contact.company.name
        else:
            companyName = ''

    else:
        name = ''
        companyName =''
    if contract.contact != None:
        name=contract.contact.name

    if tin==None or len(tin)<4:
        tin = 'NA'

    summryParaSrc = """

    <font size='9'>
    %s<br/>
    %s<br/>
    %s<br/>
    %s , %s , %s<br/>
    <strong>GSTIN:</strong>%s<br/><br/>
    <strong>Kind Attention:</strong>%s (Mobile # %s)<br/>
    </font>
    """ % (companyName, adrsStreet , adrsCity , adrsState , adrsPincode , adrsCountry , tin, name, ph)

    summryParaSrc1 = """

    <font size='9'>
    <strong>Amount Payable (in words) :</strong><br/>
    %s Only<br/>
    </font>
    """ % (wordData)

    story.append(Paragraph(summryParaSrc, styleN))
    story.append(t)
    story.append(Spacer(2.5, 0.5 * cm))
    if globalSettings.CRM_SEPERATE_TAX_DETAILS:
        story.append(Paragraph(summryParaSrc1, styleN))
        story.append(Spacer(2.5, 0.5 * cm))


    if contract.status in ['billed', 'approved', 'recieved']:

        summryParaSrc = "<font size='9'><strong>REGULATORY DETAILS:</strong></font> <br/>         <font size='9'>         <strong>CIN :</strong> %s<br/>         <strong>GSTIN :</strong> %s<br/>         <strong>PAN :</strong> %s<br/> <br/>        </font>"%( divsn.cin , unt.gstin , divsn.pan)


        story.append(Paragraph(summryParaSrc, styleN))

        summryParaSrc = "<font size='9'><strong>BANK DETAILS:</strong></font> <br/>         <font size='9'>         <strong>Name :</strong> %s<br/>         <strong>Bank :</strong> %s<br/>         <strong>IFSC :</strong> %s<br/>         <strong>Branch :</strong> %s<br/>         <strong>Account :</strong> %s<br/> <strong>SWIFT Code :</strong> %s<br/> <br/> </font>"%(divsn.name , unt.bankName , unt.ifsc , unt.bankBranch , unt.bankAccNumber , unt.swift)

        story.append(Paragraph(summryParaSrc, styleN))

    bullts = ""
    tncBody = None
    tncPara = "<font size='9'><strong>Terms and Conditions:</strong></font>"

    story.append(Paragraph(tncPara, styleN))

    if contract.termsAndConditionTxts is not None and len(contract.termsAndConditionTxts)>0:
        tncBody = contract.termsAndCondition.body
    elif contract.termsAndCondition is not None and contract.termsAndCondition.body is not None:
        tncBody = contract.termsAndConditionTxts
    else:
        termsObj = CRMTermsAndConditions.objects.filter(division = divsn)
        if termsObj.count()>0:
            tncBody = termsObj.first().body

    # print contract.termsAndConditionTxts, 'contract.termsAndConditionTxts'

    if tncBody is not None:
        for i , cond in enumerate(tncBody.split('||')):
            bullts += "<strong>%s.</strong> %s <br/>"%(i+1 , cond)
        story.append(Paragraph(bullts, styleN))
    # else:
    #     for i , cond in enumerate(tncBody.split('||')):
    #         bullts += "<strong>%s.</strong> %s <br/>"%(i+1 , cond)
    #     story.append(Paragraph(bullts, styleN))

    if contract.termsAndCondition is not None and contract.termsAndCondition.message is not None:

        para11 = '''
        <para align="left">
        <font size=9>
        %s
        </font>
        </para>
        '''% (contract.termsAndCondition.message)

        story.append(Spacer(2.5, 0.5 * cm))
        story.append(Paragraph(para11, styleN))

    genBy = '''
    <font size=9>
    <br/><br/><strong>Generated by:</strong> %s
    </font>
    ''' % ( '%s %s' % (request.user.first_name, request.user.last_name) )

    story.append(Paragraph(genBy, styleN))

    pdf_doc.build(story, onFirstPage=addPageNumber,
                  onLaterPages=addPageNumber, canvasmaker=PageNumCanvas)
