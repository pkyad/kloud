# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from finance.models import  Inventory
from ERP.models import Unit , Division
from clientRelationships.models import Contact
from time import time
# Create your models here.
def getAssetUploadPath(instance , filename ):
    return 'ERP/asset/%s_%s' % (str(time()).replace('.', '_'),  filename)

class Checkin(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = 'assetsCheckedIn' , null = False)
    name = models.TextField(max_length = 200 , null = True)
    serialNo = models.CharField(max_length = 30 , null = True)
    warrantyTill  = models.DateField(null=True)
    manufacturedOn = models.DateField(null=True)
    poNumber = models.CharField(max_length = 20 , null = True)

    to = models.ForeignKey(User , related_name = 'assetsAlloted' , null = True)
    personName = models.CharField(max_length = 50 , null = True)
    email = models.CharField(max_length = 50 , null = True)
    phone =  models.CharField(max_length = 20 , null = True)
    address = models.TextField(max_length = 1500 , null = True)

    approvedBy = models.ForeignKey(User , related_name = 'approvedBy' , null = True)

    assignedBy = models.ForeignKey(User , related_name = 'assignedby' , null = True)
    assignedOn =  models.DateTimeField(null = True)

    returned = models.BooleanField(default = False)
    returnComment = models.CharField(max_length = 200 , null = True)

    checkout = models.BooleanField(default = False) # checkout means , removed from inventory ( writeoff )
    checkoutComment = models.TextField(max_length = 300 , null = True)

    originalPrice = models.FloatField(default=0)
    price = models.FloatField(default=0)

    reserved = models.BooleanField(default = False)
    reservedBy = models.ForeignKey(User , related_name='reservedItems' , null = True)

    unit = models.ForeignKey(Unit, related_name='checkins' , null = False,)
    division = models.ForeignKey(Division , null = False , related_name = "assets")
