from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery import shared_task
from celery.utils.log import get_task_logger
import time

from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail , EmailMessage
from django.conf import settings as globalSettings
import datetime
from django.contrib.auth.models import User 
from .models import Division
import pytz

logger = get_task_logger(__name__)

@shared_task
def send_otp_email(to_email,name, otp):

    email_subject ="KloudERP OTP"
    to_email = to_email
    # to_email.append(to_email)
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


@shared_task
def send_division_welcome_email(to_email):
    try:
        email_subject ="Welcome to kloudERP"
        to_email = to_email
        # to_email.append(to_email)
        ctx = {
            'otp': 1234,
            'name' : 'Raj',
        }

        email_body = get_template('app.ERP.otp.html').render(ctx)
        # email_body = 'Hi'
        msg = EmailMessage(email_subject, email_body, to=to_email)
        msg.content_subtype = 'html'
        msg.send()
    except:
        pass

    return {'status':'ok'}   


@periodic_task(run_every=(crontab(hour="23", minute="50")))
def daily_user_acquisition():
    ctx = {}
    today = datetime.datetime.now(pytz.timezone('Asia/Kolkata')).date()
    # step 1 : getting new users 
    newUsers = len(User.objects.filter(date_joined__startswith = str(today)))

    # step 2 : getting user who used the platform today
    todayCount = len(User.objects.filter(profile__last_updated__startswith = str(today)))

    # step 3 : getting division who are using today
    divisionCount = len(Division.objects.filter(last_login__startswith = str(today)))


    ctx['newUsers'] = newUsers
    ctx['todayCount'] = todayCount
    ctx['divisionCount'] = divisionCount

    email_subject ="USER Update on %s"%(str(today))
    to_email = ['info@epsilonai.com']
    email_body = get_template('app.ERP.dailyUpdate.html').render(ctx)
    msg = EmailMessage(email_subject, email_body, to=to_email)
    msg.content_subtype = 'html'
    msg.send()

    return {'status':'ok'}