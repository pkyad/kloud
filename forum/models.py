# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
from organization.models import Division
# Create your models here.
def getForumAttachmentPath(instance , filename ):
    return '/forum/%s_%s' % (str(time()).replace('.', '_'), filename)

def forumImages(instance , filename ):
    return 'forum/%s_%s' % (str(time()).replace('.', '_'), filename)

def forumCommentImages(instance , filename ):
    return 'forum/%s_%s' % (str(time()).replace('.', '_'), filename)


# class ForumThread(models.Model):
#     created = models.DateTimeField(auto_now_add = True)
#     updated = models.DateField(auto_now=True)
#     page = models.CharField(max_length = 100 , null = True)
#     txt =  models.TextField(null = True)
#     attachment = models.FileField(upload_to = getForumAttachmentPath , null = True)
#     user = models.ForeignKey(User , null = True , related_name='forumUser')
#     verified = models.BooleanField(default = False)
#
# class ForumComment(models.Model):
#     created = models.DateTimeField(auto_now_add = True)
#     parent = models.ForeignKey(ForumThread , null = True , related_name='forumthread')
#     txt =  models.TextField(null = True)
#     verified = models.BooleanField(default = False)
#     user = models.ForeignKey(User , null = True , related_name='commentedUser')


class ForumFiles(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    attachment =  models.FileField(upload_to=forumImages,null = True)
    typ = models.CharField(max_length = 150 , null = True , default="image")

class Forum(models.Model):
    title = models.CharField(max_length=250,null=True)
    description = models.CharField(max_length=5000,null=True)
    created = models.DateTimeField(auto_now_add = True)
    # category = models.ForeignKey(Catrgory , related_name='forumcategory', null = True)
    user=models.ForeignKey(User, related_name='forumuser',null=True)
    approved=models.BooleanField(default = False)
    views = models.PositiveIntegerField(default=0)
    url = models.CharField(max_length = 150 , null = True )
    reporters = models.ManyToManyField(User , related_name='forumreport', blank = True)
    tags = models.CharField(max_length = 150 , null = True )
    files = models.ManyToManyField(ForumFiles , related_name='forumfiles', blank = True)
    division =  models.ForeignKey(Division , related_name='forumdivision', null = True)

class ForumCommentFiles(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    attachment =  models.FileField(upload_to=forumCommentImages,null = True)
    typ = models.CharField(max_length = 150 , null = True , default="image")

class ForumComment(models.Model):
    content = models.TextField(max_length=250,null=True)
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User, related_name='forumusers',null=True)
    likes = models.ManyToManyField(User , related_name='forumlikes', blank = True)
    parent = models.ForeignKey(Forum , related_name='forumparent', null = False)
    approved= models.BooleanField(default = False)
    anonymousName = models.CharField(max_length=5000,null=True)
    anonymousEmail = models.CharField(max_length=5000,null=True)
    files = models.ManyToManyField(ForumCommentFiles , related_name='forumcommentfiles', blank = True)
