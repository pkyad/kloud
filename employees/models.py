from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

COMPLAINT_STATUS = (
    ('created','created'),
    ('resolved','resolved'),
)

class Complaints(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = "complaintFrom" , null=True)
    txt = models.TextField(max_length=500 , null=True)
    status = models.CharField(choices = COMPLAINT_STATUS , max_length = 10 ,default='created', null = True)

class SystemLog(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = "systemLogs" , null=True)
    title = models.CharField(max_length = 1000 , null = False)
    timeInSec = models.PositiveIntegerField(default = 10 )
    app = models.CharField(max_length = 300 , null = True)
    dated = models.DateField(auto_now_add = True , null = True)


class UserTourTracker(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name='UserTourTracker' , null = True)
    lat = models.FloatField(null=False , default=0)
    lng = models.FloatField(null=False , default=0)
