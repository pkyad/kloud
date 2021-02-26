from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect , get_object_or_404
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
from django.core.exceptions import ObjectDoesNotExist , SuspiciousOperation
from django.views.decorators.csrf import csrf_exempt, csrf_protect
# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from ERP.models import *
from organization.models import CompanyHolidays
from clientRelationships.models import Contact, CustomerSession
from ERP.views import getApps
from django.db.models import Q
from django.http import JsonResponse
import random, string
from django.utils import timezone
from rest_framework.views import APIView
from datetime import date,timedelta,datetime
from dateutil.relativedelta import relativedelta
import calendar
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import json
from django.core.mail import send_mail , EmailMessage
from finance.models import Sale
from payroll.models import Payslip
from django.template.loader import render_to_string, get_template
from openpyxl import load_workbook
from io import BytesIO,StringIO
from performance.models import TimeSheet
from ERP.send_email import send_email
import os
# Create your views here.


class PageViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = PageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title' , 'url','user']
    def get_queryset(self):
        # divsn = self.request.user.designation.division
        # toReturn = Page.objects.filter(user__designation__division=divsn)
        divsn = self.request.user.designation.division
        toReturn = Page.objects.filter(user__designation__division=divsn)
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            toReturn = toReturn.filter(Q(title__icontains = val) | Q(url__icontains = val) | Q(description__icontains =  val))
            return toReturn
        return toReturn

class ComponentsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Components.objects.all().order_by('index')
    serializer_class = ComponentsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent' , 'component_type']

class UIelementTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = UIelementTemplateSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' , 'template','templateCategory','live','defaultData']
    def get_queryset(self):
        toReturn = UIelementTemplate.objects.all()
        divsn = self.request.user.designation.division
        if 'templateCategory' in self.request.GET:
            toReturn = toReturn.filter(live=True,templateCategory__icontains = self.request.GET['templateCategory'],defaultData__isnull=False)
        return toReturn



class InitializewebsitebuilderAPIView(APIView):

    def post(self , request , format = None):
        data = request.data
        division = Division.objects.get(pk = request.user.designation.division.pk)
        if 'title' in request.data :
            division.defaultTitle = data['title']
        if 'description' in request.data :
            division.defaultDescription = data['description']
        division.save()
        request.user.designation.division = division
        page = Page.objects.create(title= data['title'],description=data['description'],url=data['url'],user=request.user)
        page.save()
        return Response({'page':PageSerializer(page,many=False).data})


class PublishAPIView(APIView):
    def get(self , request , format = None):
        page = Page.objects.get(pk = request.GET['page'])
        components = Components.objects.filter(parent = page)
        data = ''
        for i in components:
            i.template = i.template.replace('$data' , 'data')
            data += i.template
        ctx = {'data':data, 'components' : components}
        pageContent = get_template('app.HR.page.html').render(ctx)
        print pageContent
        filePath = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'publishedPages' , ('%s_%s.html'% (1, page.url)))
        f = open(filePath, 'w')
        f.write(pageContent)
        f.close()
        return Response({})
