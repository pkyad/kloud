from __future__ import division
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery import shared_task
from celery.utils.log import get_task_logger
import time
from django.conf import settings as globalSettings
import datetime
from django.contrib.auth.models import User 
from .models import Division
import pytz
from .models import * 
import requests

logger = get_task_logger(__name__)

@periodic_task(run_every=(crontab(hour="*", minute="*")))
def assign_trigger_machine():
    jobObjs = Job.objects.select_related('division', 'process').filter(status = 'queued')

    for jobObj in jobObjs:
        divisionObj = jobObj.division

        # getting machines 
        machineList = divisionObj.rpa_machine.filter(env = jobObj.process.env).values_list('key', flat = True)
        machineFinalList = ','.join([str(item) for item in machineList ])
        print machineFinalList

        url = 'https://utils.klouderp.com/job?machines=' + str(machineFinalList)+'&jobId='+str(jobObj.pk)
        # url = 'https://utils.klouderp.com/job?machines=["0b5bab08-bcab-41f5-b4fb-b4614634529e"]&jobId='+str(jobObj.pk)   
        try:
            res = requests.get(url)
            data = res.json()
            print data, 'data'
            if data['success']:
                    machineObj = Machine.objects.get(key = data['machine'])
                    jobObj.machine = machineObj
                    jobObj.save()

        except:
            pass    


 

    return {'status':'ok'}

