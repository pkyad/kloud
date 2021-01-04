# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets , permissions  #serializers
from django.shortcuts import render, redirect , get_object_or_404
from url_filter.integrations.drf import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from django.contrib.auth.models import User , Group
from rest_framework.exceptions import *
# from .serializers import *
from API.permissions import *
from .models import *
import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate , login , logout
from .serializers import *
from django.conf import settings as globalSettings
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from marketing.models import TourPlan
from HR.models import ExitManagement, Appraisal
from finance.models import *
from django.db.models import Sum, Count
from finance.serializers import InvoiceLiteSerializer

from reportlab import *
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import cm, mm
from reportlab.lib import colors , utils
from reportlab.platypus import Paragraph, Table, TableStyle, Image, Frame, Spacer, PageBreak, BaseDocTemplate, PageTemplate, SimpleDocTemplate, Flowable,ListItem,ListFlowable,NextPageTemplate
from PIL import Image
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet, TA_CENTER
from reportlab.graphics import barcode , renderPDF
from reportlab.graphics.shapes import *
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.lib.pagesizes import letter,A5,A4,A3,A2
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.enums import TA_LEFT, TA_CENTER,TA_RIGHT
from reportlab.lib.colors import *
from reportlab.lib.units import inch, cm
from pdfrw import PdfReader, PageMerge
from pdfrw.buildxobj import pagexobj
from pdfrw.toreportlab import makerl
height, width = A4

@csrf_exempt
def SystemLogView(request):
    print request.POST
    if request.POST['token'] == 'titan@1234':
        u = User.objects.get(pk = request.POST['user'] )
        syslog , new = SystemLog.objects.get_or_create(user = u , title =  request.POST['title'] )

        if not new:
            syslog.timeInSec += 10
        else:
            title = request.POST['title']
            syslog.app = title.split('-')[-1]

        syslog.save()

        print syslog.timeInSec , syslog.app

    return JsonResponse({})


class SystemLogViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SystemLogSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app' , 'title' , 'user' , 'dated']
    def get_queryset(self):
        q = SystemLog.objects.all().order_by('-timeInSec')
        return q

class ComplaintViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ComplaintSerializer
    queryset = Complaints.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['status']

##----------Attendance api---
import sys
import time
from zklib import zklib
from datetime import *
from zklib import zkconst
from operator import itemgetter
from performance.models import TimeSheet
import calendar
from dateutil.relativedelta import *
from django.db.models import Q
from HR.models import Leave, User, profile
import numpy as np


class FeatchAttendanceDataApi(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        print 'requestttttttttttt',request.GET
        monthNumber = int(str(request.GET['date']).split('-')[1])
        yearNumber = int(str(request.GET['date']).split('-')[0])
        lastDay = calendar.monthrange(yearNumber,monthNumber)[1]
        fstDay = date(yearNumber,monthNumber,1)
        userObj = User.objects.get(pk=int(request.GET['user']))

        print userObj
        toReturn = {'valList':[],'timeList':[],'leavetype':[]}
        for i in range(1,lastDay+1):
            dt = fstDay+relativedelta(days=i-1)

            try:
                timeObj = TimeSheet.objects.get(Q(checkIn__icontains=dt) | Q(checkOut__icontains=dt),user=userObj)


                if timeObj.checkIn and timeObj.checkOut:
                    hrs = timeObj.checkOut - timeObj.checkIn
                    toReturn['timeList'].append(str(hrs)[0:-3])
                    hrs = round(hrs.total_seconds()/3600,2)
                    toReturn['valList'].append(hrs)

                elif timeObj.checkIn or timeObj.checkOut:
                    toReturn['valList'].append(0)
                    toReturn['timeList'].append(str(0))

                else:
                    toReturn['valList'].append(-1)
                    toReturn['timeList'].append(str(' '))

            except:
                leavObj = Leave.objects.filter(user=userObj,fromDate__lte=dt,toDate__gte=dt)
                if leavObj.count()>0:
                    if leavObj[0].approved:
                        toReturn['valList'].append(-2)
                        toReturn['timeList'].append(str(' '))
                        toReturn['leavetype'].append(str(leavObj[0].category))
                    else:
                        toReturn['valList'].append(-1)
                        toReturn['timeList'].append(str(' '))
                else:
                    toReturn['valList'].append(-1)
                    toReturn['timeList'].append(str(' '))

#---------------------fetch data from machine ---------------------
        print toReturn
        return Response(toReturn,status=status.HTTP_200_OK)

# -------------------------------------------------------------------------
# fetch data from file
from io import BytesIO
class AttendanceDataCreationApi(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        # print '----------loading data came to views---------------------'

        for row in request.FILES['file'].read().split('\n'):

            if len(row)<5:
                continue

            d = ' '.join(row.split())
            prts = d.split(' ')
            print "pk : " , prts[0]
            print "dt : " , prts[1] + ' ' + prts[2]
            # 2018-11-16 13:40:15
            datetime_object = datetime.strptime( prts[1] + ' ' + prts[2]  , '%Y-%m-%d %H:%M:%S')
            print datetime_object



            u = User.objects.get(pk = prts[0])


            ts = TimeSheet.objects.filter(user = u , date = datetime_object.date())

            if ts.count()==0:
                timesheet= TimeSheet(user = u , date = datetime_object.date())
                timesheet.save()
            else:
                timesheet= ts[0]

            if timesheet.checkIn is None or int(datetime_object.strftime("%s"))*1000 < int(timesheet.checkIn.strftime("%s"))*1000 :
                timesheet.checkIn = datetime_object
            if timesheet.checkOut is None or int(datetime_object.strftime("%s"))*1000   > int(timesheet.checkOut.strftime("%s"))*1000:
                timesheet.checkOut= datetime_object

            timesheet.save()

        return Response( status = status.HTTP_200_OK)


##------------------------------- leave  approval -------------

class sendComplaintEmailAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self, request, format=None):
        print 'Send Complaint Emaillllllllll'
        userObj = User.objects.get(pk= request.data['pk'])
        managerObj = User.objects.get(pk= request.data['manPk'])
        managerId = managerObj.profile.email
        msg = request.data['txt']
        id = globalSettings.G_ADMIN
        email_subject =str('Complaint Email')
        ctx = {
            'fname': userObj.first_name,
            'lname': userObj.last_name,
            'reason':msg,
            'linkUrl': 'cioc.co.in',
            'linkText' : 'View Online',
            'sendersAddress' : '(C) CIOC FMCG Pvt Ltd',
            'sendersPhone' : '841101',
            'linkedinUrl' : 'https://www.linkedin.com/company/13440221/',
            'fbUrl' : 'facebook.com',
            'twitterUrl' : 'twitter.com',
        }
        email_body = get_template('app.employees.complaintEmail.html').render(ctx)
        msg = EmailMessage(email_subject, email_body,  to= [id,managerId])
        msg.content_subtype = 'html'
        msg.send()
        return Response({},status = status.HTTP_200_OK)



class DashboardDataEmployeeAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self, request, format=None):
        toRet = {}
        print ' Dashboard Data workforcemgmt'
        empFull = profile.objects.filter(empType='full time')
        empPart = profile.objects.filter(empType='part time')
        toRet['fullCount']=empFull.count()
        toRet['partCount']=empPart.count()
        return Response(toRet,status=status.HTTP_200_OK)


class MyApprovalsAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self, request, format=None):
        user = request.user
        data = []
        leavObj = Leave.objects.filter(user__designation__reportingTo = user, status='inProcess')
        for i in leavObj:
            val = {'pk' : i.pk , 'type':'leave' , 'title' : 'from '+str(i.fromDate)+' to ' +str(i.toDate)  ,'subtitle' : str(i.days) + ' days',
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        expenseSheetObj = ExpenseSheet.objects.filter(user__designation__reportingTo = user, stage='submitted')
        for i in expenseSheetObj:
            val = {'pk' : i.pk , 'type':'expenses' , 'title' : i.notes  ,'subtitle' : '',
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            invoice_total = 0
            invoices = Invoice.objects.filter(sheet = i)
            invoice_total = invoices.aggregate(Sum('amount'))
            val['invoice_total'] = invoice_total['amount__sum']
            val['invoices'] = InvoiceLiteSerializer(invoices,many=True).data
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        tourplanObj = TourPlan.objects.filter(approved=False, user__designation__reportingTo = user)
        for i in tourplanObj:
            val = {'pk' : i.pk , 'type':'tourplan' , 'title' : 'On '+str(i.date)  ,'subtitle' : '',
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        exitObj = ExitManagement.objects.filter(superManagerApproval=False, superManager = user)
        for i in exitObj:
            val = {'pk' : i.pk , 'type':'exitMangement' , 'title' : ''  ,'subtitle' : '',
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            dp = i.user.profile.displayPicture.url
            if dp == None:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        appraisalObj = Appraisal.objects.filter(status='Created', superManager = user)
        for i in appraisalObj:
            val = {'pk' : i.pk , 'type':'appraisal' , 'title' : ''  ,'subtitle' : '',
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        purchaseObj = PurchaseOrder.objects.filter(status='created',user__designation__reportingTo = user,isInvoice=False)
        for i in purchaseObj:
            amount_total = i.productorder.all().aggregate(Sum('total'))
            if amount_total['total__sum'] == None:
                total = 0
            else:
                total = amount_total['total__sum']
            val = {'pk' : i.pk , 'type':'purchaseOrder' , 'title' : total  ,'subtitle' : total,
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        purchaseInvObj = PurchaseOrder.objects.filter(status='created',user__designation__reportingTo = user,isInvoice=True)
        for i in purchaseInvObj:
            amount_total = i.productorder.all().aggregate(Sum('total'))
            if amount_total['total__sum'] == None:
                total = 0
            else:
                total = amount_total['total__sum']
            val = {'pk' : i.pk , 'type':'purchaseOrderInvoice' , 'title' : total  ,'subtitle' : total,
            'userName' : i.user.first_name + ' ' +i.user.last_name, 'userPk' : i.user.pk,'email':i.user.email,'mobile':i.user.profile.mobile }
            try:
                dp = i.user.profile.displayPicture.url
            except:
                dp = '/static/images/userIcon.png'
            val['dp'] = dp
            try:
                designation = i.user.profile.designation.role.name
            except:
                designation = ''
            val['designation'] = designation
            data.append(val)
        return Response({'data' :data},status=status.HTTP_200_OK)


class UpdateMyApprovalsAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self, request, format=None):
        print datetime.today()
        data = request.data
        if data['type'] == 'leave':
            leavObj = Leave.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                leavObj.status = 'approved'
            elif data['status'] == 'cancelled':
                leavObj.status = 'cancelled'
            elif data['status'] == 'inProcess':
                leavObj.status = 'inProcess'
            else:
                leavObj.status = 'rejected'
            if 'comment' in data:
                leavObj.comment = data['comment']
            leavObj.save()
        if data['type'] == 'tourplan':
            tourplanObj = TourPlan.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                tourplanObj.approved = True
            else:
                tourplanObj.approved = False
            if 'comment' in data:
                tourplanObj.comment = data['comment']
            tourplanObj.save()
        if data['type'] == 'exitMangement':
            exitObj = ExitManagement.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                exitObj.superManagerApproval = True
                exitObj.superManagerApprovedDate = datetime.today()
            if 'comment' in data:
                exitObj.comment = data['comment']
            exitObj.save()
        if data['type'] == 'appraisal':
            appraisalObj = Appraisal.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                appraisalObj.status = 'approved'
            else:
                appraisalObj.status = 'rejected'
            if 'comment' in data:
                appraisalObj.superManagerCmt = data['comment']
            appraisalObj.save()
        if data['type'] == 'expenses':
            appraisalObj = ExpenseSheet.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                appraisalObj.stage = 'approved'
            else:
                appraisalObj.stage = 'cancelled'
            if 'comment' in data:
                appraisalObj.comment = data['comment']
            appraisalObj.save()
        if data['type'] == 'purchaseOrder':
            purchaseObj = PurchaseOrder.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                purchaseObj.status = 'Approved'
            else:
                purchaseObj.status = 'rejected'
            purchaseObj.save()
        if data['type'] == 'purchaseOrderInvoice':
            purchaseInvObj = PurchaseOrder.objects.get(pk = data['pk'])
            if data['status'] == 'accepted':
                purchaseInvObj.status = 'Approved'
            else:
                purchaseInvObj.status = 'rejected'
            purchaseInvObj.save()
        return Response({'data' :data},status=status.HTTP_200_OK)

class DownloadUserProfileApiView(APIView):
    def get(self , request , format = None):
        userObj = User.objects.get(pk = request.GET['user'])
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment;filename="%s_%s.pdf"'%(userObj.first_name,userObj.pk)
        genUserProfilePDF(response , userObj , request)
        return response


class PDF_Flowable(Flowable):
    #----------------------------------------------------------------------
    def __init__(self,page):
        Flowable.__init__(self)
        self.page = page
    #----------------------------------------------------------------------
    def draw(self):
        """
        draw the line
        """
        canv = self.canv
        page = self.page
        canv.setPageSize((width, height))
        canv.doForm(makerl(canv, page))

def genUserProfilePDF(response , user , request):
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(response,pagesize=letter, topMargin=0.2*cm,leftMargin=0.1*cm,rightMargin=0.1*cm)
    doc.request = request
    elements = []

    p1 = Paragraph("<para alignment='center'fontSize=15  ><b> Goods Received Note </b></para>",styles['Normal'])
    elements.append(p1)
    elements.append(Spacer(1, 10))

    pages = PdfReader(globalSettings.BASE_DIR+ "/media_root/test.pdf").pages

    print len(pages), pages, 'pages'
    pagesArr = []
    for x in pages:
        print x, 'x'
        pagesArr.append(pagexobj(x))

    elements.append(PageBreak())
    for page in pagesArr:
        F = PDF_Flowable(page)
        print F, 'f'
        elements.append(F)
        elements.append(PageBreak())

    doc.build(elements)
