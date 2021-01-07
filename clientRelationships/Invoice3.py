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
global themeColor
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
        print self.contract.status,'A'
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


def addPageNumber(canvas, doc):
    """
    Add the page number
    """
    now = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
    docID = '%s%s' % (id, now.year)
    passKey = docID
    d = Drawing(60, 60)
    renderPDF.draw(d, canvas, 180 * mm, 270 * mm)
    pass



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
        # settingsFields = application.objects.get(name='app.CRM').settings.all()
        if self.contract.termsAndCondition is not None and self.contract.termsAndCondition.themeColor is not None:
            themeColor = colors.HexColor(self.contract.termsAndCondition.themeColor)
        else:
            termsObj = CRMTermsAndConditions.objects.filter(division = self.division)
            if termsObj.count()>0:
                themeColor = colors.HexColor(termsObj.first().themeColor)
        self.setStrokeColor(themeColor)
        self.setFillColor(themeColor)
        self.rect(0, 0, 1500, 3, fill=True)
        # d = Drawing(100,100)
        # d.add(Rect(0,68,1500,3, fillColor=themeColor,strokeWidth=0))
        # print dir(self)
        print self.unit,'aaaaaaaaaaaa'
        compNameStyle = styleN.clone('footerCompanyName')
        compNameStyle.textColor = 'white'
        addStr = "<font size='10'>%s,%s %s %s %s</font>"%(self.unit.address , self.unit.city ,self.unit.pincode , self.unit.state, self.unit.country )
        contactwebStr = "<font size='10'>%s</font>"%(self.division.website )
        contactemailStr = "<font size='10'>%s</font>"%(self.unit.email )
        contactmobStr = "<font size='10'>%s</font>"%( self.unit.mobile )


        tableparaStyle = ParagraphStyle('parrafos',alignment = TA_CENTER,fontSize = 16, fontName="Times-Roman", textColor = 'white')
        tableparaStyle2 = ParagraphStyle('parrafos',alignment = TA_CENTER,fontSize = 8, fontName="Times-Roman", textColor = 'black')
        p = Paragraph("<font size='13'>%s</font>"%(self.division.name), tableparaStyle)



        # tab = Table([[p]])
        # tab.wrapOn(self, 50 * mm, 10 * mm)
        # tab.drawOn(self, 85 * mm, 18 * mm)
        # p1 = Paragraph(addStr , tableparaStyle)
        # tab1 = Table([[p1]])
        # tab1.wrapOn(self, 200 * mm, 10 * mm)
        # tab1.drawOn(self, 15 * mm, 10 * mm)
        # web = Paragraph(contactwebStr , tableparaStyle)
        # email = Paragraph(contactemailStr , tableparaStyle)
        # mob = Paragraph(contactmobStr , tableparaStyle)
        # tab2 = Table([[web,email,mob]],colWidths=[2*inch , 3*inch , 2*inch])
        # tab2.wrapOn(self, 200 * mm, 10 * mm)
        # tab2.drawOn(self, 40 * mm, 4 * mm)

        tableheaderparaStyle = ParagraphStyle('parrafos',fontSize = 16, fontName="Times-Roman", textColor = 'black', leading = 10)
        from reportlab.platypus import Image
        imagePath = os.path.join(globalSettings.MEDIA_ROOT , str(self.division.logo))
        f = open(imagePath, 'rb')
        ima = Image(f)
        ima.drawHeight = 0.8*inch
        ima.drawWidth = 1*inch
        ima.hAlign = 'RIGHT'
        tab5 = Table([[ima]])
        tab5.wrapOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        tab5.drawOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        toHeading1  =  Paragraph("<para align='left'><strong>%s</strong></para>"%(self.division.name ), tableheaderparaStyle)
        toHeading2  = Paragraph( "<para align='left'><font size='7'>%s,%s %s %s %s</font></para>"%(self.unit.address , self.unit.city ,self.unit.pincode , self.unit.state, self.unit.country ) , tableheaderparaStyle)
        toHeading3  =  Paragraph("<para align='left'><font size='7'><strong>Tel : </strong>%s<br/><strong>e-mail : </strong>%s</font></para>"%(self.unit.mobile, self.unit.email ), tableheaderparaStyle)
        toHeading5  =  Paragraph("<para align='left'><font size='7'><strong>GST/UIN : </strong>%s <br/> <strong>Company's PAN : </strong>%s</font></para>"%(self.unit.gstin, self.division.pan ), tableheaderparaStyle)
        tableHeading = [[toHeading1 ]]
        tableHeading1 = [[toHeading2 ]]
        tableHeading2 = [[toHeading3 , toHeading5]]
        tabHeader = Table(tableHeading ,colWidths=[6*inch])
        tabHeader1 = Table(tableHeading1 ,colWidths=[6*inch])
        tabHeader2 = Table(tableHeading2 ,colWidths=[1.5*inch, 2*inch])
        tabHeader.wrapOn(self, 1 * mm, self._pagesize[1] - 6 * mm)
        tabHeader.drawOn(self, 30 * mm, self._pagesize[1] - 6 * mm)
        tabHeader1.wrapOn(self, 1 * mm, self._pagesize[1] - 13 * mm)
        tabHeader1.drawOn(self, 30 * mm, self._pagesize[1] - 13 * mm)
        tabHeader2.wrapOn(self, 1 * mm, self._pagesize[1] - 23 * mm)
        tabHeader2.drawOn(self, 30 * mm, self._pagesize[1] - 23 * mm)
        toData1  = Paragraph("<para><strong>QUOTE # </strong></para>", tableparaStyle2)
        toData2  = Paragraph("<para><strong>DATE </strong></para>", tableparaStyle2)
        toData3  = Paragraph("<para>%s</para>"%(self.contract.pk ), tableparaStyle2)
        toData4  = Paragraph("<para>%s</para>"%(self.contract.created.date() ), tableparaStyle2)
        toData5  = Paragraph("<para><strong>CUSTOMER ID </strong></para>", tableparaStyle2)
        toData6  = Paragraph("<para><strong>VALID UNTIL</strong></para>", tableparaStyle2)
        toData7  = Paragraph("<para>%s</para>"%(self.contract.dueDate ), tableparaStyle2)
        toData8  = Paragraph("<para>%s</para>"%(self.contract.contact.pk ), tableparaStyle2)
        tableDetails = [[toData1, toData2] , [toData3 , toData4], [toData5 , toData6], [toData8, toData7]]
        tab6 = Table(tableDetails , colWidths=[1.2*inch , 1.2*inch], rowHeights=(5*mm))
        tabs = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                         ('VALIGN', (0, 1), (-1, -3), 'BOTTOM'),
                         ('VALIGN', (0, -2), (-1, -2), 'BOTTOM'),
                         ('VALIGN', (0, -1), (-1, -1), 'BOTTOM'),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
                         ])
        tab6.setStyle(tabs)
        tab6.wrapOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        tab6.drawOn(self, 145 * mm, self._pagesize[1] - 25 * mm)

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
        isGst = False # should be a boolean in the company model

    if contract.termsAndCondition is not None:
        isGst = contract.termsAndCondition.isGst

    if isGst == True:
        if stateCode == '29':
            data = [[pHeadDetails, pHeadTaxCode,pHeadQty, pHeadPrice,
                      pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
        else:
            if stateValue =='KA':
                data = [[pHeadDetails, pHeadTaxCode, pHeadQty, pHeadPrice,
                         pHeadTotal, pHeadcgst, pHeadsgst, pHeadSubTotal]]
            else:
                data = [[pHeadDetails, pHeadTaxCode,pHeadQty, pHeadPrice,
                     pHeadTotal, pHeadTax, pHeadSubTotal]]
    else:
        data = [[pHeadDetails,pHeadQty, pHeadPrice,
             pHeadTotal, pHeadSubTotal]]
    if contract.termsAndCondition is not None:
        if contract.termsAndCondition.extraFieldOne and len(contract.termsAndCondition.extraFieldOne)>0:
            pHeadExtraFieldOne = Paragraph('<strong>'+str(contract.termsAndCondition.extraFieldOne)+'</strong>', tableHeaderStyle)
            data[0].insert(1, pHeadExtraFieldOne)
        if contract.termsAndCondition.extraFieldTwo and len(contract.termsAndCondition.extraFieldTwo)>0:
            pHeadExtraFieldTwo = Paragraph('<strong>'+str(contract.termsAndCondition.extraFieldTwo)+'</strong>', tableHeaderStyle)
            data[0].insert(2, pHeadExtraFieldTwo)


    totalQuant = 0
    totalTax = 0
    grandTotal = 0
    totalVal = 0
    tableBodyStyle = styles['Normal'].clone('tableBodyStyle')
    tableBodyStyle.fontSize = 7
    count=0
    for i in json.loads(contract.data):
        print i
        count+=1
        print i['desc']
        pDescSrc = i['desc']
        totalQuant += int(i['quantity'])
        totalTax += int(i['totalTax'])
        grandTotal += int(i['subtotal'])
        tot = 0
        tot = int(i['quantity']) * int(i['rate'])
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

        sgst = i['totalTax']/2
        pBodycgst = Paragraph(str(sgst), tableBodyStyle)
        pBodysgst = Paragraph(str(sgst), tableBodyStyle)

        pBodyTotal = Paragraph(str(tot), tableBodyStyle)
        pBodySubTotal = Paragraph(str(i['subtotal']), tableBodyStyle)
        if isGst == True:
            if stateCode == '29':
                data.append([ pBodyTitle, pBodyTaxCode, pBodyQty, pBodyPrice,
                          pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
            else:
                if stateValue =='KA':
                    data.append([ pBodyTitle, pBodyTaxCode,pBodyQty, pBodyPrice,
                              pBodyTotal, pBodycgst, pBodysgst, pBodySubTotal])
                else:
                    data.append([ pBodyTitle, pBodyTaxCode, pBodyQty, pBodyPrice,
                              pBodyTotal, pBodyTax, pBodySubTotal])
        else:
            data.append([ pBodyTitle,  pBodyQty, pBodyPrice,
                     pBodyTotal, pBodySubTotal])
        if contract.termsAndCondition is not None:
            if contract.termsAndCondition.extraFieldOne and len(contract.termsAndCondition.extraFieldOne)>0:
                pBodyExtraFieldOne = Paragraph(str(i['extraFieldOne']), tableBodyStyle)
                data[count].insert(1, pBodyExtraFieldOne)
            if contract.termsAndCondition.extraFieldTwo and len(contract.termsAndCondition.extraFieldTwo)>0:
                pBodyExtraFieldTwo = Paragraph(str(i['extraFieldTwo']), tableBodyStyle)
                data[count].insert(2, pBodyExtraFieldTwo)

    contract.grandTotal = grandTotal
    contract.totalTax = totalTax
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
    wordData =  num2words(round(discoubtedPrice), lang='en_IN')
    if isGst == True:
        if stateCode == '29':
            totalTax1 = totalTax/2
            try:
                discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
            except :
                discoubtedPrice =  str(round(discoubtedPrice))
            data += [[ '', '', '', '', Paragraph(str(int(totalVal)), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph(discountText, tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                    [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
        else:
            if stateValue =='KA':
                totalTax1 = totalTax/2
                try:
                    discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
                except :
                    discoubtedPrice =  str(round(discoubtedPrice))
                data += [[ '', '', '', '', Paragraph(str(int(totalVal)), tableBodyStyle),Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(totalTax1), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph(discountText, tableBodyStyle),'', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
            else:
                try:
                    discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
                except :
                    discoubtedPrice =  str(round(discoubtedPrice))
                data += [[ '', '', '', '', Paragraph(str(int(totalVal)), tableBodyStyle),Paragraph(str(totalTax), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph(discountText, tableBodyStyle), '', Paragraph(str(discount), tableBodyStyle)],
                        [ '', '', '', '',  Paragraph('Grand Total (INR)', tableHeaderStyle), '', Paragraph(discoubtedPrice, tableGrandStyle)]]
    else:
        totalTax1 = totalTax/2
        try:
            discoubtedPrice = str(round(discoubtedPrice)).split('.')[0]
        except :
            discoubtedPrice =  str(round(discoubtedPrice))
        data += [[ '', '', '', Paragraph(str(int(totalVal)), tableBodyStyle), Paragraph(str(grandTotal), tableBodyStyle)],
                [ '', '','',  Paragraph(discountText, tableBodyStyle), Paragraph(str(discount), tableBodyStyle)],
                [ '', '','',   Paragraph('Grand Total (INR)', tableHeaderStyle), Paragraph(discoubtedPrice, tableGrandStyle)]]
    if contract.termsAndCondition is not None:
        if contract.termsAndCondition.extraFieldOne and len(contract.termsAndCondition.extraFieldOne)>0:
            data[len(data)-3].insert(1, '')
            data[len(data)-2].insert(1, '')
            data[len(data)-1].insert(1, '')
        if contract.termsAndCondition.extraFieldTwo and len(contract.termsAndCondition.extraFieldTwo)>0:
            data[len(data)-3].insert(2, '')
            data[len(data)-2].insert(2, '')
            data[len(data)-1].insert(2, '')
    t = Table(data)
    if isGst == True:
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
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             ('GRID', (0, 0), (-1, -3), 0.2, colors.black),
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
                             ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                             # ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                             ('GRID', (0, 0), (-1, -3),0.2, colors.black),
                             ])
    else:
        ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                         ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                         ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                         ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                         ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                         ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                         ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                         ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                         # ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                         ('GRID', (0, 0), (-1, -3), 0.2, colors.black),
                         ])
    t.setStyle(ts)
    # if isGst == False:
    #     if stateCode == '29' or stateValue =='KA':
    #         t._argW[0] = 6.4 * cm
    #         t._argW[1] = 2.4 * cm
    #         t._argW[2] = 2 * cm
    #         t._argW[3] = 1.2 * cm
    #         t._argW[4] = 2 * cm
    #         t._argW[5] = 1.5 * cm
    #         t._argW[6] = 2.0 * cm
    #         t._argW[7] = 2.1 * cm
    #     else:
    #         t._argW[0] = 6.5 * cm
    #         t._argW[1] = 2.4 * cm
    #         t._argW[2] = 2 * cm
    #         t._argW[3] = 1.2 * cm
    #         t._argW[4] = 2 * cm
    #         t._argW[5] = 1.5 * cm
    #         t._argW[6] = 2.3 * cm
    # else:
    #         t._argW[0] = 7 * cm
    #         t._argW[1] = 2.4 * cm
    #         t._argW[2] = 2 * cm
    #         t._argW[3] = 2.5 * cm
    #         t._argW[4] = 3 * cm
            # t._argW[5] = 1.5 * cm


    story = []

    expHead = expanseReportHead(request, contract)
    # try:
    #     if len(contract.termsAndCondition.heading)>0:
    #         story.append(Paragraph(contract.termsAndCondition.heading, styleH))
    # except:
    #     if len(contract.heading)>0:
    #         story.append(Paragraph(contract.heading, styleH))
    # story.append(Spacer(2.5, 1 * cm))
    story.append(expHead)
    story.append(Spacer(2.5, 0.75 * cm))
    adrs = None
    if contract.deal!=None:
        adrs = contract.deal.company.address
    elif contract.contact.company != None:
        adrs = contract.contact.company.address
    # elif contract.contact!=None:
    #     print contract.contact.street,'llllllllllllllllllllllllllhhhhhhhhhhhhhh'
    #     adrs['street'] = contract.contact.street
    #     adrs['city']= contract.contact.city
    #     # adrs.state = contract.contact.state
    #     # adrs.pincode = contract.contact.pincode
    #     # adrs.country = contract.contact.country


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
    email = ''
    if contract.contact != None:
        name=contract.contact.name
        email = contract.contact.email
    if tin==None or len(tin)<4:
        tin = 'NA'
    if isGst == True:
        # summryParaSrc0 = """
        # <para align="left">
        # <font size='9'>
        # <strong>CUSTOMER INFO </strong><br/>
        # </font></para>
        # """

        summryParaSrc = """
        <font size='9'>
        <strong>CUSTOMER INFO </strong><br/>
        <strong>Name : </strong> %s <br/>
        <strong>Company Name :</strong> %s<br/>
        <strong> Street Address : </strong> %s<br/>
        <strong> City : </strong> %s - %s<br/>
        <strong> Phone/Email : </strong> %s / %s <br/>
        </font>
        """ % (name,companyName, adrsStreet , adrsCity  , adrsPincode , ph, email )


        para2 = Paragraph(summryParaSrc, styleN)
        para4 = Paragraph('<strong> Sub : </strong> '+ str(contract.heading), styleN)
        data2 =[['']]
        data3 = [[para2],[para4]]
    else:
        summryParaSrc0 = """

        <font size='9'>
        <strong>To,</strong><br/>
        </font>
        """

        summryParaSrc = """

        <font size='9'>
        <strong>%s</strong><br/>
        %s<br/>
        %s, %s  %s<br/>
        </font>
        """ % (companyName, adrsStreet , adrsCity , adrsState , adrsPincode  )
        summryParaSrc1 = """
        <para align="center">
        <font size='9'>
        Thank you for your inquiry ,we are pleased to quote you the following:
        </font></para>
        """
        para1 = Paragraph(summryParaSrc0, styleN)
        para2 = Paragraph(summryParaSrc, styleN)
        para3 = Paragraph('<strong> Dear Sir, </strong>', styleN)
        para4 = Paragraph('<strong> Sub : '+ str(contract.heading)+' </strong>', styleN)
        para5 = Paragraph(summryParaSrc1 , styleN)
        data2 =[[para1, para2]]
        data3 = [[para3],[para4],[para5]]

    t2 = Table(data2,colWidths=[1.1*inch , 6.5*inch])
    ts1 = TableStyle([
     ('VALIGN', (0, 0), (-1, -1), 'TOP'),
     ('VALIGN', (0, -2), (-1, -2), 'TOP'),
     ('VALIGN', (0, -1), (-1, -1), 'TOP'),
     ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
     # ('BOX', (0, 0), (-1, 0), 1, colors.black),
     ])
    t2.setStyle(ts1)
    story.append(t2)
    t3 = Table(data3)
    t3.setStyle(ts1)
    story.append(t3)
    story.append(Spacer(2.5, 0.5 * cm))
    # story.append(Paragraph(summryParaSrc, styleN))
    story.append(t)
    story.append(Spacer(2.5, 0.5 * cm))
    # if globalSettings.CRM_SEPERATE_TAX_DETAILS:
    #     story.append(Paragraph(summryParaSrc1, styleN))
    #     story.append(Spacer(2.5, 0.5 * cm))

    # divsn = request.user.designation.division
    # unt  = request.user.designation.unit

    # if contract.status in ['billed', 'approved', 'recieved']:
    #
    #     summryParaSrc = "<font size='9'><strong>REGULATORY DETAILS:</strong></font> <br/>         <font size='9'>         <strong>CIN :</strong> %s<br/>         <strong>GSTIN :</strong> %s<br/>         <strong>PAN :</strong> %s<br/> <br/>        </font>"%( divsn.cin , unt.gstin , divsn.pan)
    #
    #
    #     story.append(Paragraph(summryParaSrc, styleN))
    #
    #     summryParaSrc = "<font size='9'><strong>BANK DETAILS:</strong></font> <br/>         <font size='9'>         <strong>Name :</strong> %s<br/>         <strong>Bank :</strong> %s<br/>         <strong>IFSC :</strong> %s<br/>         <strong>Branch :</strong> %s<br/>         <strong>Account :</strong> %s<br/> <strong>SWIFT Code :</strong> %s<br/> <br/> </font>"%(divsn.name , unt.bankName , unt.ifsc , unt.bankBranch , unt.bankAccNumber , unt.swift)
    #
    #     story.append(Paragraph(summryParaSrc, styleN))

    bullts = ""
    tncBody = None
    tncPara = "<font size='9'><strong>Terms and Conditions:</strong></font>"

    story.append(Paragraph(tncPara, styleN))
    if contract.termsAndConditionTxts is not None and len(contract.termsAndConditionTxts)>0:
        tncBody = contract.termsAndConditionTxts
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
    story.append(Spacer(2.5, 0.5 * cm))
    # if isGst == True:
    #     para10 = '''
    #     <font size=9>
    #     This quotation is not a contract or a bill. It is our best guess at the total price for the service and goods described above. The customer will be billed after indicating acceptance of this quote. Payment will be due prior to the delivery of service and goods. Please fax or mail the signed PO to the address listed above.
    #     </font>
    #     '''
    #
    #     story.append(Paragraph(para10, styleN))
    #
    # else:
    #     para10 = '''
    #     <font size=9>
    #     We hope the above quote is in line with your requirement. <br/>
    #     Looking forward to your valuable purchase order and long term business relation.
    #     </font>
    #     '''
    #
    #     story.append(Paragraph(para10, styleN))
    #     para11 = '''
    #     <para align="center">
    #     <font size=9>
    #     <strong> Thanking you and assuring you of the best of our services all the times</strong>
    #     </font>
    #     </para>
    #     '''
    #
    #     story.append(Paragraph(para11, styleN))

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
    <br/><br/><strong>Generated by:</strong> <br/>%s %s <br/>%s
    </font>
    ''' % (request.user.first_name, request.user.last_name, request.user.profile.mobile)

    story.append(Paragraph(genBy, styleN))

    pdf_doc.build(story, onFirstPage=addPageNumber,
                  onLaterPages=addPageNumber, canvasmaker=PageNumCanvas)
