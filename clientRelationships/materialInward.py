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
# from organization.models import  Responsibility
from excel_response import ExcelResponse
from django.db.models.functions import Concat
from django.db.models import Value
import xlsxwriter
# from finanace.models import configureTermsAndConditions
# from clientRelationships.serializers import ContractSerializer,ContactSerializer,DealLiteSerializer
# from projects.models import project,Issues, ProjectObjective
# from projects.serializers import IssueSerializer
# from finance.models import Sale,SalesQty
# from finance.serializers import SaleSerializer,SalesQtySerializer
from mail.models import mailAttachment
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
    # print doc.contract
    # now = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
    # if(doc.contract.deal):
    #     id = doc.contract.deal.pk
    # elif(doc.contract.contact):
    #     id = doc.contract.contact.pk
    # else:
    #     id = doc.contract.pk
    # docID = '%s%s%s' % (id, now.year, doc.contract.pk)
    # try:
    #     passKey = '%s%s' % (str(doc.request.user.date_joined.year),doc.request.user.pk)  # also the user ID
    # except:
    #     passKey = docID


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
        # self.contract =  args[0].contract
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
        ima.drawHeight = 0.8*inch
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



def genMaterialIssueNote(response, ticket, request):
    story = []
    MARGIN_SIZE = 8 * mm
    PAGE_SIZE = A4

    pdf_doc = SimpleDocTemplate(response, pagesize=PAGE_SIZE,
                                leftMargin=MARGIN_SIZE, rightMargin=MARGIN_SIZE,
                                topMargin=2*MARGIN_SIZE, bottomMargin=3 * MARGIN_SIZE)
    pdf_doc.request = request
    styles = getSampleStyleSheet()
    styleN = styles['Normal']
    styleH = styles['Heading1']
    tableHeaderStyle = styles['Normal'].clone('tableHeaderStyle')
    tableHeaderStyle.textColor = colors.black
    tableHeaderStyle.fontSize = 7
    tableBodyStyle = styles['Normal'].clone('tableBodyStyle')
    story.append(Spacer(2.5, 0.75 * cm))
    story.append(Spacer(2.5, 0.75 * cm))
    header = "<para align='center'><font size='14' ><strong> Material Inward Note </strong> </font></para>"
    story.append(Paragraph(header, styleN))
    story.append(Spacer(2.5, 0.75 * cm))
    name = ''
    phone = ''
    email = ''
    city = ''
    state = ''
    address = ''
    country = ''
    pincode = ''
    warrantyStatus = ''
    tncBody = None
    bullts = ''
    termsObj = ConfigureTermsAndConditions.objects.filter(division = request.user.designation.division)
    if termsObj.count()>0:
        termsData = termsObj.first()
        if ticket.uniqueId is None:
            ticket.uniqueId = termsData.prefix + str(termsData.counter)
            termsData.counter = termsData.counter+1
            termsData.save()
            ticket.save()
        tncBody = termsData.body

    year = ticket.created.year
    nextYear = ticket.created.year + 1
    srno = str(ticket.uniqueId)
    if ticket.name is not None:
        name = ticket.name
    if ticket.phone is not None:
        phone = ticket.phone
    if ticket.email is not None:
        email = ticket.email
    if ticket.address is not None:
        address = ticket.address
    if ticket.country is not None:
        country = ticket.country
    if ticket.pincode is not None:
        pincode = ticket.pincode
    if ticket.state is not None:
        state = ticket.state
    if ticket.city is not None:
        city = ticket.city
    if ticket.warrantyStatus is not None:
        warrantyStatus = ticket.warrantyStatus


    utc_time = datetime.datetime.now()
    tz = pytz.timezone( 'Asia/Kolkata')
    utc_time =utc_time.replace(tzinfo=pytz.UTC)
    indian_time=utc_time.astimezone(tz)
    datecreated = str(indian_time.strftime("%d-%B-%Y"))

    summryParaSrc = """

    <font size='9'>
     <strong>MIN No: %s</strong><br/>
     Date : %s<br/><br/>
     <strong>Customer Details:</strong><br/>
    %s<br/>
    %s<br/>
     %s <br/>
     <strong> Address : </strong> %s<br/>
     %s %s %s - %s<br/>
     Warranty Type: %s
    </font>
    """ % (srno,datecreated,  name, phone , email, address, city, state, country, pincode, warrantyStatus )


    story.append(Paragraph(summryParaSrc, styleN))
    # story.append(Spacer(2.5, 0.5 * cm))
    pHeadSerialNo = Paragraph('<strong>Serial No</strong>', tableHeaderStyle)
    pHeadProd = Paragraph('<strong>Product</strong>', tableHeaderStyle)
    pHeadDesc = Paragraph('<strong>Complaint</strong>', tableHeaderStyle)
    data = [[pHeadSerialNo, pHeadProd,pHeadDesc]]
    product = ''
    serialNo = ''
    notes = ''
    if ticket.productSerial is not None:
        serialNo = ticket.productSerial
    if ticket.productName is not None:
        product = ticket.productName
    if ticket.notes is not None:
        notes = ticket.notes
    pBodySerialNo = Paragraph(serialNo, tableBodyStyle)
    pBodyProd =  Paragraph(product, tableBodyStyle)
    pBodyNote=  Paragraph(notes, tableBodyStyle)
    data.append([pBodySerialNo, pBodyProd,pBodyNote])
    story.append(Spacer(2.5, 0.75 * cm))
    t = Table(data)
    ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                     ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                     ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                     ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                     ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
                     ('BOX',(0,0),(-1,-1),0.25,colors.black),

                     # ('SPAN', (-3, -1), (-2, -1)),
                     # ('SPAN', (-2, -1), (-1, -1)),
                     # ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                     # ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                     # ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                     # ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                     # # ('BACKGROUND', (-2, -1), (-1, -1), themeColor),
                     # ('LINEABOVE', (0, -1), (-1, -1), 0.25, colors.gray),
                 ])
    t.setStyle(ts)

    story.append(t)
    story.append(Spacer(2.5, 0.75 * cm))




    if tncBody is not None:
        bullts += "<strong>Terms and Conditions:</strong> <br/>"
        for i , cond in enumerate(tncBody.split('||')):
            bullts += "<strong>%s.</strong> %s <br/>"%(i+1 , cond)
        story.append(Paragraph(bullts, styleN))

    # t._argW[0] = 8 * cm
    # t._argW[1] = 3 * cm
    # t._argW[2] = 3 * cm
    # t._argW[3] = 3 * cm
    # t._argW[4] = 3 * cm
    pdf_doc.build(story, onFirstPage=addPageNumber,
                  onLaterPages=addPageNumber, canvasmaker=PageNumCanvas)
