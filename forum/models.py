# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
# Create your models here.

def getForumAttachmentPath(instance , filename ):
    return '/forum/%s_%s' % (str(time()).replace('.', '_'), filename)


class ForumThread(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    page = models.CharField(max_length = 100 , null = True)
    txt =  models.TextField(null = True)
    attachment = models.FileField(upload_to = getForumAttachmentPath , null = True)
    user = models.ForeignKey(User , null = True , related_name='forumUser')
    verified = models.BooleanField(default = False)

class ForumComment(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    parent = models.ForeignKey(ForumThread , null = True , related_name='forumthread')
    txt =  models.TextField(null = True)
    verified = models.BooleanField(default = False)
    user = models.ForeignKey(User , null = True , related_name='commentedUser')
