from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery import shared_task
from celery.utils.log import get_task_logger
import time

from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail , EmailMessage
from django.conf import settings as globalSettings

logger = get_task_logger(__name__)

@shared_task
def send_otp_email(to_email,name, otp):

    email_subject ="KloudERP OTP"
    to_email = to_email
    to_email.append(to_email)
    ctx = {
        'otp': otp,
        'name' : name,
    }

    email_body = get_template('app.ERP.otp.html').render(ctx)
    # email_body = 'Hi'
    msg = EmailMessage(email_subject, email_body, to=to_email)
    msg.content_subtype = 'html'
    msg.send()
    return {'status':'ok'}

   


# A periodic task that will run every minute (the symbol "*" means every)
# @periodic_task(run_every=(crontab(hour="", minute="", day_of_week="*")))
# def task_example():
#     logger.info("Task started")
#     # add code
#     logger.info("Task finished")