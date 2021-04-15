from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery import shared_task
from celery.utils.log import get_task_logger
import time

from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail , EmailMessage
from django.conf import settings as globalSettings
from .models import *

logger = get_task_logger(__name__)


@shared_task
def set_sip_credential(id):

    profileObj = profile.objects.get(pk = int(id))

    if profileObj.sipUserName is None:
        try:
            idVal = 100 + int(profileObj.user.pk)
            URL = 'https://'+globalSettings.SIP_WSS_SERVER +"/createAnEndpoint/?exten="+str(idVal)+"&username="+profileObj.mobile+str(divsn.pk)
            r = requests.get(url = URL)
            data = r.json()
            print data, 'datatata'
            profileObj.sipUserName = data['auths'][0]['username']
            profileObj.sipPassword = data['auths'][0]['password']
            profileObj.sipExtension = data['exten']
            profileObj.save()
    
        except:
            print 'issue in createAnEndpoint'
            pass
    return {'status':'ok'}
   


# A periodic task that will run every minute (the symbol "*" means every)
# @periodic_task(run_every=(crontab(hour="", minute="", day_of_week="*")))
# def task_example():
#     logger.info("Task started")
#     # add code
#     logger.info("Task finished")