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

# Create your views here.
class ForumThreadViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = ForumThreadSerializer
    queryset = ForumThread.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['verified','user']

class ForumCommentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = ForumCommentSerializer
    queryset = ForumComment.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['verified','user']


class GetAccountsTotalAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def get(self , request , format = None):
        forumObj = ForumThread.objects.all()
        forumoabj1 = ForumThreadSerializer(forumObj, many = True).data
        for value in forumoabj1:
            postDataCount = 0
            postData = ForumComment.objects.filter(parent = value['pk'])
            postDataCount = postData.count()
            value['commentCount'] = postDataCount
            try:
                dataObj = postData.order_by('created').last()
                value['first_name'] = dataObj.user.first_name
                value['last_name'] = dataObj.user.last_name
                value['lstcomcreated'] = dataObj.created
            except:
                pass
            postData = sorted(posts1, key = lambda i: i['commentCount'],reverse=True)[:5]
            posts2 = list(Forum.objects.all().order_by('created').values('pk','title','description','category'))
            # to delete repeating post1 in post2
            deleteofpost2 = []
            for i in range(len(postData)):
                deleteofpost2.append(postData[i]["pk"])
            for i in range(len(deleteofpost2)):
                for j in range(len(deleteofpost2)):
                    try:
                        if posts2[j]['pk'] == deleteofpost2[i]:
                            del posts2[j]
                    except:
                        pass
        data = {'forumoabj1' : forumoabj1}
        return Response(data, status=status.HTTP_200_OK)
