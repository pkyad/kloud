from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string, get_template
from django.template import RequestContext , Context
from django.conf import settings as globalSettings
from django.core.mail import send_mail , EmailMessage
from django.core import serializers
from django.http import HttpResponse ,StreamingHttpResponse
from django.utils import timezone
from django.db.models import Min , Sum , Avg
import mimetypes
import hashlib, datetime, random
from datetime import timedelta , date
from monthdelta import monthdelta
from time import time
import pytz
import math
import json

from StringIO import StringIO
import math
import requests
# related to the invoice generator
from PIL import Image

# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
# from .helper import *
from API.permissions import *
from .models import *
from django.core import serializers
from django.http import JsonResponse

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import StringIO
from django.core.exceptions import PermissionDenied,SuspiciousOperation
import random, string
from django.db.models import Q
from django.db.models import F ,Value,CharField,Prefetch

# Create your views here.


import sys, traceback

class MachineViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MachineSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['division']

    def get_queryset(self):
        divisionObj = self.request.user.designation.division
        toRet = divisionObj.rpa_machine.all().order_by('-pk')
        if 'search' in self.request.GET:
            toRet = toRet.filter(Q(name__icontains = self.request.GET['search']))
        return toRet



class JobssViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = JobssSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['process','division']

    def get_queryset(self):
        divisionObj = self.request.user.designation.division
        toRet = divisionObj.rpa_jobs.all().order_by('-pk')
        if 'search' in self.request.GET:
            toRet = toRet.filter(Q(process__name__icontains = self.request.GET['search']) | Q(status__icontains = self.request.GET['search']))
        return toRet

class JobContextViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = JobContextSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['job']
    def get_queryset(self):
        toRet = JobContext.objects.all()
        if 'search' in self.request.GET:
            toRet = toRet.filter(Q(key__icontains = self.request.GET['search']) | Q(value__icontains = self.request.GET['search']))
        return toRet


class ProcessViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Process.objects.all().order_by('-pk')
    serializer_class = ProcessSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['uri','division','name']
    def get_queryset(self):
        divisionObj = self.request.user.designation.division
        toRet = divisionObj.rpa_processes.all().order_by('-pk')
        if 'search' in self.request.GET:
            toRet = toRet.filter(Q(name__icontains = self.request.GET['search']) | Q(env__icontains = self.request.GET['search']))
        return toRet

class CreateJobAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny,)
    def post(self , request , format = None):
        data = request.data
        print type(data['processForm'])
        jobObj = Job.objects.create(division = request.user.designation.division , process = Process.objects.get(pk = int(data['process'])))
        for key, value in data['processForm'].items():
            val = data['processForm'][key]
            contObj = JobContext.objects.create(job = jobObj.pk, key = key, value = val['value'] ,  typ = val['type'])
        return Response( status =  status.HTTP_200_OK)

@csrf_exempt
def IsMachineExist(request):
    params = request.GET
    isExist = False

    try:
        obj = Machine.objects.get(key = params['key'])
        isExist = True
    except:
        pass

    return  JsonResponse({'isExist':isExist})   
