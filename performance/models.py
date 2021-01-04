# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from projects.models import project
from django.contrib.auth.models import User
from datetime import datetime



# Create your models here.

STATUS_CHOICES = (
    ('created','created'),
    ('saved','saved'),
    ('submitted','submitted'),
    ('approved','approved')
)

class TimeSheet(models.Model):
    user = models.ForeignKey(User , related_name = "timeSheetCreated" , null=True)
    created = models.DateTimeField(auto_now_add = True)
    date = models.DateField(null=True)
    approved = models.BooleanField(default = False)
    approvedBy = models.ManyToManyField(User , related_name='times' , blank = True)
    status = models.CharField(choices = STATUS_CHOICES , max_length = 10 ,default='created', null = True)
    checkIn = models.DateTimeField(null = True)
    checkOut = models.DateTimeField(null = True)
    totaltime = models.CharField(max_length =30,null = True)
    checkinLat = models.FloatField(null=False , default=0)
    checkinLon = models.FloatField(null=False , default=0)
    checkoutLat = models.FloatField(null=False , default=0)
    checkoutLon = models.FloatField(null=False , default=0)
    distanceTravelled = models.FloatField(null=False , default=0)

    class Meta:
        unique_together = ('user', 'date',)


class Feedback(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = "feedbackUser" , null=True)
    title = models.CharField(max_length = 100 , null = True,blank=True)
    feed = models.TextField(max_length=500 , null=True)
