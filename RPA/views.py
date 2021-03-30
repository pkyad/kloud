from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
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

class JobssViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Job.objects.all()
    serializer_class = JobssSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['process','queue','division']

class QueueViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['process','division']

class ProcessViewset(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['uri','division','name']
