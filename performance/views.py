# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.shortcuts import render
from rest_framework import viewsets , permissions , serializers
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
import json
import pytz
from .models import *
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
from datetime import date,timedelta,datetime
import json
import pytz
import requests
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
# from openpyxl import load_workbook
from io import BytesIO
import re
from rest_framework import filters
from django.db.models import Q, Avg, Count, Min, Sum
from taskBoard.models import task
from HR.models import Leave
from organization.models import CompanyHolidays

# Create your views here.

class TimeSheetViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = TimeSheetSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['date','status' ,'user' , 'checkIn']
    def get_queryset(self):
        if 'today' in self.request.GET:
            today = date.today()
            return TimeSheet.objects.filter(date = today , user__pk = int(self.request.GET['user']))
        else:
            return TimeSheet.objects.all()


class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

class ProjectContributionAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self, request, format=None):
        team = []
        proj = project.objects.get(pk = request.GET['project'])
        for u in proj.team.all():

            tasksCompletion = task.objects.filter(user = u , project = proj  , completion__lt=100).aggregate(Sum('completion'))
            tasksCount = task.objects.filter(user = u , project = proj  , completion__lt=100).count()


            team.append({"user" : u.pk , "name" : u.first_name + ' ' + u.last_name ,  "tasksCompletion" : tasksCompletion['completion__sum'] , "tasksCount" : tasksCount })


        return Response(team,status=status.HTTP_200_OK)


class UpdateAttendanceAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated , isAdmin)
    def get(self, request, format=None):
        today = date.today()
        user = request.user
        checkinObj = TimeSheet.objects.filter(user = user,date = today).count()
        if checkinObj == 0:
            data = {'stage':'checkin'}
        else:
            data =  {'stage':'checkout'}
        return Response( data,status = status.HTTP_200_OK)
    def post(self, request, format=None):
        today = date.today()
        user = request.user
        data = request.data
        if data['stage'] == 'checkin':
            checkinObj = TimeSheet.objects.create(user = user,date = today)
            checkinObj.checkIn = datetime.today()
            checkinObj.checkinLat = data['checkinLat']
            checkinObj.checkinLon = data['checkinLon']
            checkinObj.save()
        if data['stage'] == 'checkout':
            checkinObj = TimeSheet.objects.get(user = user,date = today)
            checkinObj.checkOut = datetime.today()
            checkinObj.checkoutLat = data['checkoutLat']
            checkinObj.checkoutLon = data['checkoutLon']
            checkinObj.save()
            print checkinObj.checkoutLat
            checkinObj = TimeSheet.objects.get(user = user,date = today)
            diff =  checkinObj.checkOut - checkinObj.checkIn
            days, seconds = diff.days, diff.seconds
            hours = days * 24 + seconds // 3600
            minutes = (seconds % 3600) // 60
            seconds = seconds % 60
            checkinObj.totaltime = str(hours) + ':'+ str(minutes)+ ':'+ str(seconds)+':00'
            checkinObj.save()
        return Response(status = status.HTTP_200_OK)

import calendar
class GetAttendanceAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated , isAdmin)
    def get(self, request, format=None):
        user = request.user
        is_saturday = user.payroll.off
        month = request.GET['month']
        year = request.GET['year']
        today = datetime.today().replace(year=int(year),month=int(month),day=1)
        current_month_start = datetime.today().replace(year=int(year),month=int(month),day=1)
        current_month_end = current_month_start.replace(day=calendar.monthrange(current_month_start.year, current_month_start.month)[1])
        leavObj = Leave.objects.filter(fromDate__month = today.month, user=user).filter(fromDate__year = today.year)
        leaves =  leavObj.aggregate(Sum('days'))['days__sum']
        present = TimeSheet.objects.filter(date__year = today.year).filter(date__month = today.month, user=user).count()
        al = user.payroll.al
        ml = user.payroll.ml
        cl = user.payroll.adHocLeaves
        total_days = current_month_end.day
        absent = total_days - present
        companyObj = CompanyHolidays.objects.filter(date__year = today.year).filter(date__month = today.month)
        details = []
        for i in range(1,total_days+1):
            print i
            dated = date.today().replace(year=int(year),month=int(month),day=i)
            print dated
            if TimeSheet.objects.filter(date = dated,user=user).count()>0:
                timesheetObj = TimeSheet.objects.get(date = dated,user=user)
                status = "NA"
                if timesheetObj.checkOut == None:
                    checkout = None
                else:
                    checkout = timesheetObj.checkOut
                if timesheetObj.totaltime == None:
                    totaltime = None
                else:
                    totaltime = timesheetObj.totaltime
                    hours = totaltime.split(':')[0]
                    if int(hours)>8:
                        status = 'present'
                    else:
                        status = "halfday"
                val = {'checkIn':timesheetObj.checkIn,'checkOut':checkout,'totaltime':totaltime,'date':dated,'status':status}
            else:
                val = {'checkIn':None,'checkOut':None,'totaltime':None,'date':dated,'status':'absent'}
                for i in leavObj:
                    if i.fromDate<= dated <= i.toDate:
                        val = {'checkIn':None,'checkOut':None,'totaltime':None,'date':dated,'status':'absent'}
                if companyObj.filter(date = dated).count()>0:
                    val = {'checkIn':None,'checkOut':None,'totaltime':None,'date':dated,'status':'holiday'}
                if is_saturday == True:
                    if calendar.day_name[dated.weekday()] == 'Saturday':
                        val = {'checkIn':None,'checkOut':None,'totaltime':None,'date':dated,'status':'saturday'}
                if calendar.day_name[dated.weekday()] == 'Sunday':
                    print calendar.day_name[dated.weekday()], dated
                    val = {'checkIn':None,'checkOut':None,'totaltime':None,'date':dated,'status':'sunday'}
            details.append(val)
        data = {'leaves':leaves,'present':present,'total_days':total_days,'absent':absent,'details':details,'al':al,'ml':ml,'cl':cl}
        return Response(data)

class ProjectCostAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated , isAdmin)
    def get(self, request, format=None):
        users = []
        prj = project.objects.get(pk = request.GET['project'])
        for t in task.objects.filter(project = prj ).values('to').annotate(total = Sum('timeSpent')):
            user = User.objects.get(id = t['to'])
            users.append({"first_name" : user.first_name , "last_name" : user.last_name , "time" : t['total'] , "count" : task.objects.filter(project = prj , to = user).count()  })


        return Response(users)
