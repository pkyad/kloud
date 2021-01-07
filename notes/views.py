# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User , Group
from django.shortcuts import render
from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from API.permissions import *
from django.db.models import Q, F
from django.http import HttpResponse
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import datetime
import json
import pytz
import requests
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from .models import *
from .serializers import *
# import tempfile
# from backports import tempfile
# from subprocess import Popen, PIPE
import subprocess
import os


class notebookViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, isOwner,)
    serializer_class = notebookSerializer
    def get_queryset(self):
        return notebook.objects.filter(user = self.request.user ).order_by('-created')

# class pageViewSet(viewsets.ModelViewSet):
#     permission_classes = (permissions.IsAuthenticatedOrReadOnly, isOwner,)
#     serializer_class = pageSerializer
#     def get_queryset(self):
#         return page.objects.filter(user = self.request.user ).order_by('-created')
