from __future__ import unicode_literals

from django.contrib.auth.models import *
from django.db import models
import datetime
import django.utils.timezone
from django.db.models.signals import post_save , pre_delete
from django.dispatch import receiver
import requests
from django.conf import settings as globalSettings
# Create your models here.
from time import time

# Create your models here.

def getSampleImagePath(instance , filename):
    return 'website/images/%s_%s' % (str(time()).replace('.', '_'), filename)

class Page(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    url = models.CharField(max_length=250,null=False)
    title = models.CharField(max_length=250,null=True , default = 'No Title')
    description = models.TextField(max_length=1000,null=True)
    ogImage = models.FileField(upload_to = getSampleImagePath ,  null = True)
    user =  models.ForeignKey(User , related_name = 'pages' , null = True)
    enableChat = models.BooleanField(default=False)
class Components(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    component_type = models.CharField(max_length=250,null=True)
    data = models.TextField(max_length=10000,null=True)
    parent = models.ForeignKey(Page , related_name = 'components' , null = False)
    template = models.TextField(max_length=100000,null=False,default='')
    index = models.PositiveIntegerField(null = True)
CAT_CHOICES = (
    ('Contact Us' , 'Contact Us'),
    ('Introduction' , 'Introduction'),
    ('Image List' , 'Image List'),
    ('Info Section' , 'Info Section'),
    ('Testimonials' , 'Testimonials'),
    ('Widgets','Widgets'),
    ('Header','Header'),
    ('Footer','Footer'),
    ('Others','Others')
)

class UIelementTemplate(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    defaultData = models.TextField(max_length=10000,null=True)
    template = models.TextField(max_length=100000,null=True)
    css = models.TextField(max_length=100000,null=True)
    name = models.CharField(max_length=250,null=False)
    sampleImg = models.FileField(upload_to = getSampleImagePath ,  null = True)
    mobilePreview = models.FileField(upload_to = getSampleImagePath ,  null = True)
    live = models.BooleanField(default=False)
    templateCategory = models.CharField(choices = CAT_CHOICES , max_length = 200 , null = True)
    images = models.TextField(max_length=10000,null=True)
