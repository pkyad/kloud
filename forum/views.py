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
from django.http import JsonResponse

# Create your views here.
# class ForumThreadViewSet(viewsets.ModelViewSet):
#     permission_classes = (permissions.IsAuthenticated, isAdmin, )
#     serializer_class = ForumThreadSerializer
#     queryset = ForumThread.objects.all()
#     filter_backends = [DjangoFilterBackend]
#     filter_fields = ['verified','user']
#
# class ForumCommentViewSet(viewsets.ModelViewSet):
#     permission_classes = (permissions.IsAuthenticated, isAdmin, )
#     serializer_class = ForumCommentSerializer
#     queryset = ForumComment.objects.all()
#     filter_backends = [DjangoFilterBackend]
#     filter_fields = ['verified','user']
#
#
# class GetAccountsTotalAPIView(APIView):
#     permission_classes = (permissions.IsAuthenticated ,)
#     def get(self , request , format = None):
#         forumObj = ForumThread.objects.all()
#         forumoabj1 = ForumThreadSerializer(forumObj, many = True).data
#         for value in forumoabj1:
#             postDataCount = 0
#             postData = ForumComment.objects.filter(parent = value['pk'])
#             postDataCount = postData.count()
#             value['commentCount'] = postDataCount
#             try:
#                 dataObj = postData.order_by('created').last()
#                 value['first_name'] = dataObj.user.first_name
#                 value['last_name'] = dataObj.user.last_name
#                 value['lstcomcreated'] = dataObj.created
#             except:
#                 pass
#             postData = sorted(posts1, key = lambda i: i['commentCount'],reverse=True)[:5]
#             posts2 = list(Forum.objects.all().order_by('created').values('pk','title','description','category'))
#             # to delete repeating post1 in post2
#             deleteofpost2 = []
#             for i in range(len(postData)):
#                 deleteofpost2.append(postData[i]["pk"])
#             for i in range(len(deleteofpost2)):
#                 for j in range(len(deleteofpost2)):
#                     try:
#                         if posts2[j]['pk'] == deleteofpost2[i]:
#                             del posts2[j]
#                     except:
#                         pass
#         data = {'forumoabj1' : forumoabj1}
#         return Response(data, status=status.HTTP_200_OK)



class ForumFilesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    queryset = ForumFiles.objects.all()
    serializer_class = ForumFilesSerializer

class ForumViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    # filter_backends = [DjangoFilterBackend]
    # filter_fields = ['title']
    # def get_queryset(self):
    #     qs =  MarketPlace.objects.all()
    #     print qs
    #     return qs



class ForumCommentFilesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    queryset = ForumCommentFiles.objects.all()
    serializer_class = ForumCommentFilesSerializer

class ForumCommentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    queryset = ForumComment.objects.all()
    serializer_class = ForumCommentSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent']

class ForumAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self, request ,format=None):
        forumdata =request.data
        if 'id' in forumdata:
            forumobj=Forum.objects.get(pk = int(forumdata['id']))
            forumobj.title = forumdata['title']
            forumobj.description=forumdata['description']
            forumobj.tags=forumdata['tags']
            forumobj.save()
        else:
            forumobj=Forum.objects.create(title=forumdata['title'],description=forumdata['description'],tags=forumdata['tags'], division = request.user.designation.division)
            print self.request.user
            if self.request.user:
                forumobj.user = self.request.user
                profileObj = profile.objects.get(user = forumobj.user)
                count = profileObj.postCount
                count = count + 1
                profileObj.postCount=count
                profileObj.save()
        data = {"title":forumobj.title,"description":forumobj.description,"created":forumobj.created}
        if 'files' in forumdata:
            filesData = forumdata['files']
            for m in filesData:
                forumobj.files.add(ForumFiles.objects.get(pk = int(m)))
        if 'title' in request.data:
            non_url_safe = ['"', '#', '$', '%', '&', '+',
                    ',', '/', ':', ';', '=', '?',
                    '@', '[', '\\', ']', '^', '`',
                    '{', '|', '}', '~', "'","!","*","(",")","<",">"]
            def slugme( text):
                non_safe = [c for c in text if c in non_url_safe]
                if non_safe:
                    for c in non_safe:
                        text = text.replace(c, '-')
                text = u'-'.join(text.split())
                forumobj.url = text
            slugme(request.data['title'])
        forumobj.save()
        print forumobj.user,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        return JsonResponse(data , status =  status.HTTP_200_OK,safe=False)
    def get(self , request , format = None):
        data = {}
        if 'id' in request.GET:
            forumObj = Forum.objects.get(pk = int(request.GET['id']))
            forumdata = ForumSerializer(forumObj, many = False).data
            commentObj = ForumComment.objects.filter(parent__id = int(request.GET['id']))
            forumcommentdata = ForumCommentSerializer(commentObj, many = True).data
            profilObj = ProfileLiteSerializer(profile.objects.filter(user__designation__division = request.user.designation.division).order_by('postCount')[:10], many = True).data
            data = {'forumdata' : forumdata , 'forumcommentdata' : forumcommentdata , 'profilObj' : profilObj}
        return JsonResponse(data , status =  status.HTTP_200_OK,safe=False)

class GetForumAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self, request ,format=None):
        data = {}
        posts1 = list(Forum.objects.all().values('pk','title','description'))
        for value in posts1:
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
        posts2 = list(Forum.objects.all().order_by('created').values('pk','title','description'))
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

        for value in posts2:
            post2Data = ForumComment.objects.filter(parent = value['pk'])
            post2DataCount = post2Data.count()
            value['commentCount'] = post2DataCount
            try:
                dataObj = post2Data.order_by('created').last()
                value['first_name'] = dataObj.user.first_name
                value['last_name'] = dataObj.user.last_name
                value['lstcomcreated'] = dataObj.created
            except:
                pass
        print posts2,"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
        totalposts = Forum.objects.all().count()
        # forumarticles = Article.objects.all()[:4]
        # for i in forumarticles:
        #     if i.contents.all().count()>0:
                # i.introSectionImg = i.contents.all()[0].img
        data =  {'posts1':postData,'posts2':posts2,'totalposts':totalposts}
        return JsonResponse(data , status =  status.HTTP_200_OK,safe=False)



class ForumCommentAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)

    def post(self , request , format = None):
        forumcommentdata =  request.data
        if 'id' in forumcommentdata:
            forumcommentobj=ForumComment.objects.get(pk = int(forumcommentdata['id']))
            forumcommentobj.content=forumcommentdata['content']
            # parent=Forum.objects.get(pk=forumcommentdata['parent'])
        else:
            forumcommentobj=ForumComment.objects.create(content=forumcommentdata['content'],parent=Forum.objects.get(pk=forumcommentdata['parent']))
            if self.request.user.pk:
                forumcommentobj.user = self.request.user
        if 'files' in forumcommentdata:
            filesData = forumcommentdata['files']
            for m in filesData:
                forumcommentobj.files.add(ForumCommentFiles.objects.get(pk = int(m)))
            forumcommentobj.save()
        # data = {"content":forumcommentobj.content,"parent":forumcommentobj.parent.pk,"created":forumcommentobj.created}
            # data['user'] = forumcommentobj.user.username
            # Forum.objects.get(pk=request.data['parent'])
        # else:
        #     print("Error no parent in comment")
        # if self.request.user:
        #     forumcommentobj.user = self.request.user
        # else:
        #     forumcommentobj.anonymousName = request.data['anonymousName']
        #     forumcommentobj.anonymousEmail = request.data['anonymousEmail']
        forumcommentobj.save()
        data = ForumCommentSerializer(forumcommentobj, many = False).data
        return JsonResponse(data , status= status.HTTP_200_OK)
    def get(self , request , format = None):
        print 'aaaaaaaaaaaaaaaaaaaassssss',ForumComment.objects.all()
        data = list(ForumComment.objects.all().values('pk'))
        return JsonResponse(data , status= status.HTTP_200_OK,safe=False)
