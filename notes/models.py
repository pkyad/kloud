# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
# Create your models here.



class notebook(models.Model):
    user = models.ForeignKey(User , related_name = 'notebooks')
    created = models.DateTimeField(auto_now_add = True)
    title =  models.TextField(max_length = 500 , null=True)

class page(models.Model):
    user = models.ForeignKey(User , related_name = 'notebookPages')
    created = models.DateTimeField(auto_now_add = True)
    source = models.TextField(max_length = 1000000 , null = True)
    parent = models.ForeignKey(notebook , related_name= 'pages')
    title = models.TextField(max_length = 500 , null=True)
