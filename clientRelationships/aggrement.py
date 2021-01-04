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
from excel_response import ExcelResponse
from django.db.models.functions import Concat
from django.db.models import Value
import xlsxwriter
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
        # try:
        #     passKey = '%s%s' % (str(self.req.user.date_joined.year),self.req.user.pk)  # also the user ID
        #     pSrc = '''
        #     <font size=9>
        #     <strong>On:</strong> %s<br/>
        #     <strong>#:</strong> %s<br/><br/>
        #     </font>
        #     ''' % ( datecreated, docID)
        # except:
        #     pSrc = '''
        #     <strong>On:</strong> %s<br/>
        #     <strong>Document ID:</strong> %s<br/><br/>
        #     </font>
        #     ''' % ( datecreated, docID)
        #
        # story = []
        # head = Paragraph(pSrc, styleN)
        # head.wrapOn(self.canv, 200 * mm, 50 * mm)
        # head.drawOn(self.canv, 0 * mm, -10 * mm)

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
    now = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
    # if(doc.contract.deal):
    #     id = doc.contract.deal.pk
    # elif(doc.contract.contact):
    #     id = doc.contract.contact.pk
    # else:
    #     id = doc.contract.pk
    # docID = '%s%s%s' % (id, now.year, doc.contract.pk)
    docID = '%s%s' % (id, now.year)
    # try:
    #     passKey = '%s%s' % (str(doc.request.user.date_joined.year),doc.request.user.pk)  # also the user ID
    # except:
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




class PageNumAllCanvas(canvas.Canvas):

    #----------------------------------------------------------------------
    def __init__(self, *args, **kwargs):
        """Constructor"""
        canvas.Canvas.__init__(self, *args, **kwargs)
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
        # settingsFields = application.objects.get(name='app.CRM').settings.all()
        self.setStrokeColor(themeColor)
        self.setFillColor(themeColor)
        # self.rect(0, 0, 1500, 70, fill=True)
        # print dir(self)
        compNameStyle = styleN.clone('footerCompanyName')
        compNameStyle.textColor = 'white'
        addStr = "<font size='10'>%s,%s %s %s %s</font>"%(self.unit.address , self.unit.city ,self.unit.pincode , self.unit.state, self.unit.country )
        contactwebStr = "<font size='10'>%s</font>"%(self.division.website )
        contactemailStr = "<font size='10'>%s</font>"%(self.unit.email )
        contactmobStr = "<font size='10'>%s</font>"%( self.unit.mobile )


        tableparaStyle = ParagraphStyle('parrafos',alignment = TA_CENTER,fontSize = 16, fontName="Times-Roman", textColor = 'white')
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
        ima.hAlign = 'CENTER'
        tab5 = Table([[ima]])
        tab5.wrapOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        tab5.drawOn(self, 1 * mm, self._pagesize[1] - 25 * mm)
        toHeading1  =  Paragraph("<para align='left'><strong>%s</strong></para>"%(self.division.name ), tableheaderparaStyle)
        toHeading2  = Paragraph( "<para align='left'><font size='7'>%s,%s %s %s %s</font></para>"%(self.unit.address , self.unit.city ,self.unit.pincode , self.unit.state, self.unit.country ) , tableheaderparaStyle)
        toHeading3  =  Paragraph("<para align='left'><font size='7'><strong>Tel : </strong>%s<br/><strong>e-mail : </strong>%s</font></para>"%(self.unit.mobile, self.unit.email ), tableheaderparaStyle)
        toHeading5  =  Paragraph("<para align='left'><font size='7'><strong>GST/UIN : </strong>%s <br/> <strong>Company's PAN : </strong>%s</font></para>"%(self.unit.gstin, self.division.pan ), tableheaderparaStyle)
        tableHeading = [[toHeading1 ]]
        tableHeading1 = [[toHeading2 , toHeading5]]
        tableHeading2 = [[toHeading3]]
        tabHeader = Table(tableHeading ,colWidths=[4*inch])
        tabHeader1 = Table(tableHeading1 , colWidths=[2*inch , 2*inch] )
        tabHeader2 = Table(tableHeading2 ,colWidths=[4*inch] )
        tabHeader.wrapOn(self, 1 * mm, self._pagesize[1] - 6 * mm)
        tabHeader.drawOn(self, 30 * mm, self._pagesize[1] - 6 * mm)
        tabHeader1.wrapOn(self, 1 * mm, self._pagesize[1] - 20 * mm)
        tabHeader1.drawOn(self, 30 * mm, self._pagesize[1] - 20 * mm)
        tabHeader2.wrapOn(self, 1 * mm, self._pagesize[1] - 27 * mm)
        tabHeader2.drawOn(self, 30 * mm, self._pagesize[1] - 27 * mm)
        # from svglib.svglib import svg2rlg
        # headerFilePath = globalSettings.INVOICE_HEADER
        # drawing = svg2rlg(os.path.join(globalSettings.BASE_DIR,
        #                                'static_shared', 'images', headerFilePath))
        # sx = sy = 0.16
        # if drawing.width>3000:
        #     sx = sy = 0.1
        # drawing.width, drawing.height = drawing.minWidth() * sx, drawing.height * sy
        # drawing.scale(sx, sy)
        # renderPDF.draw(drawing, self, 1 * mm, self._pagesize[1] - 25 * mm)

        #width = self._pagesize[0]
        # page = "Page %s of %s" % (, page_count)
        # self.setFont("Helvetica", 9)
        # self.drawRightString(195*mm, 272*mm, page)

def genAMCAggrement(response, contact, products, request):

    MARGIN_SIZE = 8 * mm
    PAGE_SIZE = A4

    pdf_doc = SimpleDocTemplate(response, pagesize=PAGE_SIZE,
                                leftMargin=MARGIN_SIZE, rightMargin=MARGIN_SIZE,
                                topMargin=4* MARGIN_SIZE, bottomMargin=3 * MARGIN_SIZE)



    pdf_doc.request = request

    tableHeaderStyle = styles['Normal'].clone('tableHeaderStyle')
    tableHeaderStyle.textColor = colors.black
    tableHeaderStyle.fontSize = 8

    today = datetime.date.today()
    month = today.strftime("%b")
    year = today.strftime("%y")
    noMonth = today.strftime("%m")

    if contact.notes is None:
        if noMonth>3:
            nextYear = int(year)+1
            annualYear = str(year)+'-'+ str(nextYear)
        else:
            prevYear = int(year)-1
            annualYear = str(prevYear)+'-'+ str(year)
        contact.notes = 'YA/'+str(month)+'/'+str(annualYear)+'/'+str(contact.pk)
    if contact.started is None:
        contact.started = today
    if contact.ended is None:
        contact.ended = contact.started + relativedelta(years=+1)
    contact.save()
    story = []
    story.append(Spacer(2.5, 0.5 * cm))
    para1 =  """
        <para align='center'><font size=20 >
        <strong>AMC  AGREEMENT  COPY</strong>
        </font></para>
    """
    val1 = Paragraph(para1, styleN)
    data1 =[[val1]]
    t1 = Table(data1, rowHeights=(10*mm))
    ts = TableStyle([
     ('VALIGN', (0, 1), (-1, -3), 'TOP'),
     ('VALIGN', (0, -2), (-1, -2), 'TOP'),
     ('VALIGN', (0, -1), (-1, -1), 'TOP'),
     ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
     ('BOX', (0, 0), (-1, 0), 1, colors.black),
     ])
    t1.setStyle(ts)
    story.append(t1)
    story.append(Spacer(2.5, 0.5 * cm))
    para2 =  """
        <para><font size=8 >
        <strong>Ref: AMC Agreement Copy:</strong>
        </font></para>
    """
    para3 =  """
        <para><font size=8 >
        <strong>Ref No:%s</strong>
        </font></para>
    """%(contact.notes)
    para4 =  """
        <para><font size=8 >
        <strong>%s</strong>
        </font></para>
    """%(today)
    val2 = Paragraph(para2, styleN)
    val3 = Paragraph(para3, styleN)
    val4 = Paragraph(para4, styleN)

    data2 =[[val2, val3, val4]]
    t2 = Table(data2)
    ts1 = TableStyle([
     ('VALIGN', (0, 1), (-1, -3), 'BOTTOM'),
     ('VALIGN', (0, -2), (-1, -2), 'BOTTOM'),
     ('VALIGN', (0, -1), (-1, -1), 'BOTTOM'),
     ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
     # ('BOX', (0, 0), (-1, 0), 1, colors.black),
     ])
    t2.setStyle(ts1)
    story.append(t2)
    para5 =  """
        <para ><font size=8 >
        <strong>%s<br/>%s, %s - %s</strong>
        </font></para>
    """%(contact.street,contact.city,contact.state,contact.pincode)
    para6 =  """
        <para><font size=8 >
        Contact person : %s
        </font></para>
    """%(contact.name)
    para7 =  """
        <para><font size=8 >
        Contact Number : %s
        </font></para>
    """%(contact.mobile)
    para8 =  """
        <para><font size=8 >
        Email : %s
        </font></para>
    """%(contact.email)
    val5 = Paragraph(para5, styleN)
    val6 = Paragraph(para6, styleN)
    val7 = Paragraph(para7, styleN)
    val8 = Paragraph(para8, styleN)
    data3 =[[val5, val6, '']]
    data3.append([val7, '', val8])
    t3 = Table(data3)
    t3.setStyle(ts1)
    story.append(t3)
    para9 =  """
        <para><font size=8 >
        Start Date : %s To : %s
        </font></para>
    """%(contact.started, contact.ended)
    para10 =  """
        <para><font size=8 >
        Subject to the payment clearance.
        </font></para>
    """
    val9 = Paragraph(para9, styleN)
    val10 = Paragraph(para10, styleN)
    data4 =[[val9, val10]]
    t4 = Table(data4)
    t4.setStyle(ts)
    story.append(t4)
    addressObj = []
    val11 = Paragraph('<strong>Product Description</strong>', tableHeaderStyle)
    val12 = Paragraph('<strong>Qty</strong>', tableHeaderStyle)
    val13 = Paragraph('<strong>Product</strong>', tableHeaderStyle)
    val14 = Paragraph('<strong>Product SL#</strong>', tableHeaderStyle)
    val14Services = Paragraph('<strong>Remaining Services</strong>', tableHeaderStyle)
    val14Ref = Paragraph('<strong></strong>', tableHeaderStyle)
    data5 =[[val11, val12, val13, val14, val14Services, val14Ref]]
    count = 0
    for i in products:
        count+=1
        val15 = Paragraph(str(i.inventory.name), tableHeaderStyle)
        val16 = Paragraph(str(i.qty), tableHeaderStyle)
        val17 = Paragraph(str(i.inventory.name), tableHeaderStyle)
        val18 = Paragraph(str(i.serialNo), tableHeaderStyle)
        remainingServices = 0
        remainingServices = TourPlanStop.objects.filter(contact__mobile = i.contact.mobile, comments = i.inventory.name).exclude(status="completed").count()
        val18services = Paragraph(str(remainingServices), tableHeaderStyle)
        val18Ref = Paragraph('('+str(count)+')', tableHeaderStyle)
        data5.append([val15, val16, val17, val18, val18services, val18Ref])
        if i.seperateAddress:
            addressObj.append({'count':count,'data':'Installed at ' + i.address + ' - ' + i.pincode})
        # else:
        #     addressObj.append({'count':count,'data':'Installed at billing address'})
    t5 = Table(data5)
    ts2 = TableStyle([
     ('VALIGN', (0, 1), (-1, -3), 'TOP'),
     ('VALIGN', (0, -2), (-1, -2), 'TOP'),
     ('VALIGN', (0, -1), (-1, -1), 'TOP'),
     ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
     ('BOX', (0, 0), (-1, 0), 1, colors.black),
     ('GRID', (0, 0), (-1, -1), 1, colors.black),
     ])
    t5.setStyle(ts2)
    story.append(t5)
    story.append(Spacer(2.5, 0.5 * cm))
    if len(addressObj)>0:
        paranote =  """
            <para><font size=8 >
            <strong>Note: </strong>
            </font></para>
        """
        valnote = Paragraph(paranote, styleN)
        story.append(valnote)
        addrData = []
        for i in addressObj:
            addCount = Paragraph('(' + str(i['count']) + ') :', tableHeaderStyle)
            addmsg = Paragraph(i['data'], tableHeaderStyle)
            addrData.append([addCount,addmsg])
        tAddr = Table(addrData,colWidths=[0.5*inch , 7.1*inch])
        story.append(tAddr)
        story.append(Spacer(2.5, 0.5 * cm))
    para11 =  """
        <para><font size=8 >
        <strong>Scope of Activities: </strong><br/>
        Telephonic support<br/>
        The Contract includes prevention Maintenance on a quarterly basis subject to our mutual convenience.<br/>
        Solving the reported UPSs complaints.<br/>
        This includes replacement of modules/components/pcbs Lobor at free of cost. <br/>
        Batteries and Wound Components Capacitors are excluding.<br/>
        A battery if needed will be supplied against PO at rates applicable at the time of  Supply.<br/>
        If the Battery is purchased form 3rd Party Installation and Calibration  Extra Charge will be applicable. <br/>
        <strong>AMC is Void If: </strong><br/>
        Damage or defect caused by transportation, accident, misuse, abuse improper usage or complete negligence.<br/>
        Damage or defect caused by fire, earthquake, flood or other natural disasters.<br/>
        Usage if equipment beyond the working conditions and environment as specified in the user or product manual.<br/>
        Damage or defects caused by alteration, modification, and conversion which are not authorized by OEM.<br/>
        Factory applied serial No. is altered, removed or defected from the product.<br/>
        Repairs carried out by other personnel other than the authorized Zigma Engineer or our Technician.<br/>
        Defects or damages due to any other external means or causes.<br/>
        The temperature in the location where the scheduled is installation /in use is greater than----<br/>
        35 deg. C (+/- deg.C) and input voltage is not maintained at the desired level +/- 15% volts.<br/>
        <strong>Response and Resulation Time </strong><br/>
        </font></para>
    """
    val19 = Paragraph(para11, styleN)
    story.append(val19)
    para12 =  """
        <para align="left"><font size=8 >
        Response time
        </font></para>
    """
    para13 =  """
        <para><font size=8 >
        <strong>Local :</strong> 3 Hours (Standby ups/modules to the customer place free of Cost) .
        </font></para>
    """
    para14 =  """
        <para align="left"><font size=8 >
        Resolution time
        </font></para>
    """
    para15 =  """
        <para><font size=8 >
        <strong>Remote :</strong> Within 24 Hours form the time of Call Log .
        </font></para>
    """
    para16 =  """
        <para align="left"><font size=8 >
        Repair resolution :
        </font></para>
    """
    para17 =  """
        <para><font size=8 >
        2 days form Pickup date : Reapir / Replacment .<br/>
        If UPS is not in repairable condition Same / Different make will get replace .<br/>
        Burnt Condition of UPS : Except normal Operational Brunts  if its due to site electrical / Grounding issues it will not cover under AMC .
        </font></para>
    """
    val20 = Paragraph(para12, styleN)
    val21 = Paragraph(para13, styleN)
    val22 = Paragraph(para14, styleN)
    val23 = Paragraph(para15, styleN)
    val24 = Paragraph(para16, styleN)
    val25 = Paragraph(para17, styleN)
    data6 = [[val20,val21]]
    data6.append([val22,val23])
    data6.append([val24,val25])
    t6 = Table(data6,colWidths=[1.1*inch , 6.5*inch])
    ts3 = TableStyle([
     ('VALIGN', (0, 1), (-1, -3), 'TOP'),
     ('VALIGN', (0, -2), (-1, -2), 'TOP'),
     ('VALIGN', (0, -1), (-1, -1), 'TOP'),
     ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
     # ('BOX', (0, 0), (-1, 0), 1, colors.black),
     ])
    t6.setStyle(ts3)
    story.append(t6)
    para18 =  """
        <para align="center"><font size=8 >
        <strong>Service Escallation Matrix</strong>
        </font></para>
    """
    val26 = Paragraph(para18, styleN)
    data7=[[val26]]
    t7 = Table(data7)
    t7.setStyle(ts)
    story.append(t7)
    levelList1 = [{
    'level' : 'Level 1',
    'name' : 'Mavitha , Sushma ',
    'role' : 'Service Coordinator',
    'mobile' : '9590137666 , 8747867241',
    'email' : 'amc@zigma- technologies.com , services@zigma- technologies.com',
    },
    {
    'level' : 'Level 2',
    'name' : 'Annaya',
    'role' : 'Manager Service Delivery',
    'mobile' : '7892763665',
    'email' : 'amc@zigma- technologies.com',
    },
    {
    'level' : 'Level 3',
    'name' : 'Yashvanth KG',
    'role' : 'Manager Operations',
    'mobile' : '9590137333',
    'email' : 'yashvanth@zigma-technologies.com',
    },
    ]
    val27 = Paragraph('<strong> Level </strong>', styleN)
    val28 = Paragraph('<strong> Name </strong>', styleN)
    val29 = Paragraph('<strong> Role </strong>', styleN)
    val30 = Paragraph('<strong> Contact Number </strong>', styleN)
    val31 = Paragraph('<strong> Enail ID </strong>', styleN)
    data8=[[val27 , val28 , val29 , val30 , val31]]
    for i in levelList1:
        val32 = Paragraph(str(i['level']), styleN)
        val33 = Paragraph(str(i['name']), styleN)
        val34 = Paragraph(str(i['role']), styleN)
        val35 = Paragraph(str(i['mobile']), styleN)
        val36 = Paragraph(str(i['email']), styleN)
        data8.append([val32 , val33 , val34 , val35 , val36])
    t8 = Table(data8)
    t8.setStyle(ts2)
    story.append(t8)
    para19 =  """
        <para align="center"><font size=8 >
        <strong>For Technical Support</strong>
        </font></para>
    """
    val26 = Paragraph(para19, styleN)
    data7=[[val26]]
    t9 = Table(data7)
    t9.setStyle(ts)
    story.append(t9)
    val37 = Paragraph('Level 1', styleN)
    val38 = Paragraph('Basavaraj', styleN)
    val39 = Paragraph('Senior Engineer', styleN)
    val40 = Paragraph('9342945123', styleN)
    val41 = Paragraph('services@zigma- technologies.com', styleN)
    data10 =[[val37 , val38 , val39 , val40 , val41]]
    t10 = Table(data10)
    t10.setStyle(ts2)
    story.append(t10)
    val42 = Paragraph('Level 2', styleN)
    val43 = Paragraph('Sunil', styleN)
    val44 = Paragraph('Manager Technical', styleN)
    val45 = Paragraph('9620148460', styleN)
    val46 = Paragraph('amc@zigma- technologies.com', styleN)
    data10 =[[val42 , val43 , val44 , val45 , val46]]
    t10 = Table(data10)
    t10.setStyle(ts2)
    story.append(t10)
    para20 =  """
        <para align="center"><font size=8 >
        We hope the above quote is in line with your requirement. <br/>
        Looking forward to your valuable purchase order and long term business relation. <br/>
        <strong> Thanking you and assuring you of the best of our services all the times</strong>
        </font></para>
    """
    val47 = Paragraph(para20, styleN)
    story.append(val47)
    pdf_doc.build(story,onFirstPage=addPageNumber,
                  onLaterPages=addPageNumber, canvasmaker=PageNumAllCanvas)
