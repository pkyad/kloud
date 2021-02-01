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
class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ('title' , 'author' , 'contentWriter' , 'reviewer' , 'articleUrl','published','contents','content_type' )
    def get_queryset(self):
        divsn = self.request.user.designation.division
        articles = Article.objects.filter(contentWriter__designation__division=divsn)
        try:
            if 'status' in  self.request.GET:
                qs = articles.filter(status = self.request.GET['status']).order_by('-created')
            else:
                qs = articles.order_by('-created')
        except:
            traceback.print_exc(file=sys.stdout)
            qs = articles.order_by('-created')
        return qs

class ArticleSectionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ArticleSectionSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['header' ,'content']
    def get_queryset(self):
        qs = ArticleSection.objects.all()
        return qs


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny, )
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' ,'reviewer']
    def get_queryset(self):
        qs = Comment.objects.all().order_by('-pk')
        if 'isreviewer' in  self.request.GET:
            qs = qs.filter(reviewer = None)
        return qs
