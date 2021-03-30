# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
from ERP.models import Division
from projects.models import *
# Create your models here.

NOTEBOOK_TYPE_CHOICES = (
    ('private', 'private'),
    ('public', 'public'),
)

class notebook(models.Model):
    user = models.ForeignKey(User , related_name = 'notebooks')
    created = models.DateTimeField(auto_now_add = True)
    title =  models.TextField(max_length = 500 , null=True)
    division = models.ForeignKey(Division , related_name = 'notes')
    project = models.ForeignKey(project ,null=True, related_name = 'projectnotebook')
    source = models.TextField(max_length = 1000000 , null = True)
    shares = models.ManyToManyField(User , related_name = 'sharedNotes' , blank = True)
    type = models.CharField(max_length = 40 , choices = NOTEBOOK_TYPE_CHOICES, default = 'private')
    locked = models.BooleanField(default = False)
