from __future__ import unicode_literals
from django.contrib.auth.models import User, Group
from time import time
from django.db import models
from django.db import models
from ERP.models import Division

# Create your models here.


class Process(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length = 200 , null = False)
    division = models.ForeignKey(Division, related_name = 'rpa_processes', null = False)
    uri = models.CharField(max_length = 200 , null = False)
    argSchema = models.TextField(max_length= 20000 , null = True)
    env = models.CharField(max_length = 200 , null = False)



JOB_STATUS_CHOICES = (
    ('queued' , 'queued'),
    ('started' , 'started'),
    ('failed' , 'failed'),
    ('success' , 'success'),
    ('aborted' , 'aborted'),
)

class Job(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    division = models.ForeignKey(Division, related_name = 'rpa_jobs', null = False)
    process = models.ForeignKey(Process , null = True , related_name='processjobs')
    # queue = models.ForeignKey(Queue , related_name='jobs' , null = True)
    retryCount = models.PositiveIntegerField(default = 0)
    status = models.CharField(choices= JOB_STATUS_CHOICES , default='queued', max_length=50)


def getContextAttachment(instance , filename ):
    return 'RPA/%s_%s' % (str(time()).replace('.', '_'), filename)


class JobContext(models.Model):
    job = models.CharField(max_length = 50, null = True)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length = 50, null = True)
    value = models.CharField(max_length = 500, null = True)
    attachment = models.FileField(upload_to= getContextAttachment , null = True)
    typ =  models.CharField(max_length = 10, null = True)

LOG_LEVEL_CHOICES = (
    ('info' , 'info'),
    ('error' , 'error'),
    ('warn' , 'warn'),
)
class JobLog(models.Model):
    job = models.CharField(max_length = 50, null = True)
    created = models.DateTimeField(auto_now_add = True)
    level = models.CharField(choices=LOG_LEVEL_CHOICES , default='info' , max_length=50)
    data = models.TextField(max_length= 20000 , null = True)
