# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from time import time
from projects.models import media
from HR.models import Team
from clientRelationships.models import Contact, Contract, ConfigureTermsAndConditions
from finance.models import ExpenseSheet, Inventory
from organization.models import Division

def getAttachmentPath(instance , filename ):
    return 'marketing/attachment/%s_%s_%s' % (str(time()).replace('.', '_'),instance.user.username, filename)

class Tag(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 60,null = True)

class Contacts(models.Model):
    created = models.DateField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    referenceId = models.CharField(max_length = 20 , null = True , blank = True)
    name = models.CharField(max_length = 150 , null = True , blank = True)
    email = models.EmailField(null = True , blank = True)
    mobile = models.CharField(max_length = 20 , null = True , blank = True , unique = True)
    source = models.CharField(max_length = 20 , null = True , blank = True)
    notes = models.TextField(max_length=500 , null=True , blank = True) # keywords
    tags = models.ManyToManyField(Tag , related_name="contacts")
    pinCode = models.CharField(max_length = 10 , null = True)
    subscribe = models.BooleanField(default=False)
    about = models.TextField(max_length=4500 , null=True , blank = True)
    addrs = models.TextField(max_length=500 , null=True , blank = True)
    altNumber = models.CharField(max_length=20 , null=True , blank = True)
    altNumber2 = models.CharField(max_length=20 , null=True , blank = True)
    city = models.TextField(max_length=500 , null=True , blank = True)
    companyName = models.TextField(max_length=500 , null=True , blank = True)
    country = models.TextField(max_length=500 , null=True , blank = True)
    directNumber = models.CharField(max_length=20 , null=True , blank = True)
    lang = models.CharField(max_length=20 , null=True , blank = True)
    socialLink = models.TextField(max_length=300 , null=True , blank = True)
    state = models.TextField(max_length=500 , null=True , blank = True)
    website = models.TextField(max_length=100 , null=True , blank = True)


CAMPAIGN_STATUS = (
    ('created' , 'created'),
    ('started' , 'started'),
    ('closed' , 'closed')
)
CAMPAIGN_TYP = (
    ('email' , 'email'),
    ('sms' , 'sms'),
    ('call' , 'call')
)
class Campaign(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length = 150 , null = True , blank = True)
    status = models.CharField(choices = CAMPAIGN_STATUS , max_length = 15 , default = 'created')
    typ = models.CharField(choices = CAMPAIGN_TYP , max_length = 10 , null=True)
    msgBody = models.TextField(max_length = 1000 , null = True , blank = True)
    emailSubject = models.TextField(max_length = 1000 , null = True , blank = True)
    emailBody = models.TextField(max_length = 10000 , null = True , blank = True)
    directions = models.TextField(max_length = 10000 , null = True , blank = True)
    emailTemplate = models.CharField(max_length = 100 , null = True , blank = True)
    limitPerDay = models.FloatField(default = 10)
    team = models.ForeignKey(Team , related_name='campaignteam' , null = True)
    followUpText1 = models.TextField(max_length = 10000 , null= True)
    followUpText2 = models.TextField(max_length = 10000 , null= True)
    followUpText3 = models.TextField(max_length = 10000 , null= True)
    followUpText4 = models.TextField(max_length = 10000 , null= True)
    lead = models.ForeignKey(User , related_name='campaignlead' , null = True)

CAMPAIGN_ITEM_STATUS = (
    ('persuing', 'persuing'),
    ('interested', 'interested'),
    ('proposal', 'proposal'),
    ('converted', 'converted'),
)

class CallCampaignItem(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    contact = models.ForeignKey(Contacts , related_name="callcontacts",null=True)
    campaign = models.ForeignKey(Campaign , related_name="callitems",null=True)
    status = models.CharField(max_length = 100 , default = 'persuing' , choices = CAMPAIGN_ITEM_STATUS)
    attempted = models.BooleanField(default=False)
    attempt =  models.FloatField(null=False , default=0)
    followUp = models.BooleanField(default=False)
    followUpDate = models.DateTimeField(null = True)
    owner = models.ForeignKey(User , null = True , related_name='contactsApproaching')
    skipped = models.BooleanField(default = False)

class EmailCampaignItem(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    contact = models.ForeignKey(Contacts , related_name="emailcontacts",null=True)
    campaign = models.ForeignKey(Campaign , related_name="emailitems",null=True)
    # related to email campaign
    emailed = models.BooleanField(default=False)
    opened = models.BooleanField(default=False)
    openedTime = models.DateTimeField(null = True)
    key  = models.CharField(max_length = 100 , null = True , blank = True)
    read = models.BooleanField(default = False)
    slot = models.CharField(max_length = 10 , null= True)
    context = models.TextField(max_length = 1000 , null= True)

    subject1 = models.CharField(max_length = 300 , null= True)
    body1 = models.TextField(max_length = 10000 , null= True)

    subject2 = models.CharField(max_length = 300 , null= True)
    body2 = models.TextField(max_length = 10000 , null= True)

    subject3 = models.CharField(max_length = 300 , null= True)
    body3 = models.TextField(max_length = 10000 , null= True)

    subject4 = models.CharField(max_length = 300 , null= True)
    body4 = models.TextField(max_length = 10000 , null= True)

    subject5 = models.CharField(max_length = 300 , null= True)
    body5 = models.TextField(max_length = 10000 , null= True)
    level = models.CharField(max_length = 100 , null= True)


APPROVED_STATUS = (
    ('created' , 'created'),
    ('sent_for_approval' , 'sent_for_approval'),
    ('approved' , 'approved'),
    ('rejected','rejected'),
)

class TourPlan(models.Model):
    date = models.DateField(null = False)
    user = models.ForeignKey(User , related_name='tourplanner' , null = True)
    ta = models.FloatField(null=True , default=0)
    da = models.FloatField(null=True , default=0)
    amount = models.FloatField(null=True , default=0)
    approved = models.BooleanField(default = False)
    attachment = models.FileField(upload_to = getAttachmentPath ,  null = True)
    status = models.CharField(choices = APPROVED_STATUS , max_length = 15 , default = 'created')
    comment =  models.CharField(max_length = 1000 , null = True , blank = True)
    class Meta:
        unique_together = ('date', 'user')

TOUR_PLAN_STOP_STATUS = (
    ('assigned' , 'assigned'),
    ('ongoing' , 'ongoing'),
    ('postponed' , 'postponed'),
    ('completed' , 'completed'),
    ('upcoming' , 'upcoming'),
    ('cancelled' , 'cancelled'),
)

class TourPlanStop(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    division = models.ForeignKey(Division,related_name='divisionTourplanStop',null=True)

    tourplan = models.ForeignKey(TourPlan , related_name='TourPlan' , null = True)
    comments = models.TextField(max_length = 1000 , null = True,blank=True)
    assignedBy = models.ForeignKey(User , related_name='jobsCreated' , null = True)
    status = models.CharField(max_length = 20 , default = 'assigned' , choices = TOUR_PLAN_STOP_STATUS)

    timeslot = models.CharField(max_length = 10 , null= True)
    visit_date = models.DateField( null= True )

    is_postponded = models.BooleanField(default = False)

    name  =models.TextField(max_length=500 , null=True , blank = True)
    street  =models.TextField(max_length=500 , null=True , blank = True)
    pinCode = models.CharField(max_length = 10 , null = True)
    city = models.TextField(max_length=500 , null=True , blank = True)
    state = models.TextField(max_length=500 , null=True , blank = True)
    country = models.TextField(max_length=500 , null=True , blank = True)
    lat  =models.CharField(max_length=20 , null=True , blank = True)
    lon  =models.CharField(max_length=20 , null=True , blank = True)



class CampaignTracker(models.Model):
    campaignId = models.CharField(max_length = 10 , null= True)
    read = models.BooleanField(default = False)
    open = models.BooleanField(default = False)
    sent = models.BooleanField(default = False)
    to = models.CharField(max_length = 100 , null= True)
    slot = models.CharField(max_length = 10 , null= True)
    template = models.TextField(max_length = 500 , null= True)
    context = models.TextField(max_length = 1000 , null= True)
    name = models.CharField(max_length = 10 , null= True)
    subject = models.CharField(max_length = 10 , null= True)


LOG_TYP = (
    ('inbound' , 'inbound'),
    ('outbound' , 'smoutbounds'),
    ('emailSent' , 'emailSent'),
    ('emailRecieved' , 'emailRecieved'),
    ('smsSent' , 'smsSent'),
    ('smsRecieved' , 'smsRecieved'),
    ('followup' , 'followup'),
    ('comment' , 'comment'),
    ('closed' , 'closed'),
    ('converted' , 'converted')
)

def campaignItemSavePath(instance , filename):
    return 'marketing/recordings/%s_%s' % (str(time()).replace('.', '_'), filename)

class CampaignLogs(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User ,related_name="CampaignLogs", null = True)
    contact = models.ForeignKey(Contacts , related_name="CampaignLogs",null=True)
    campaign = models.ForeignKey(Campaign , related_name="CampaignLogs",null=True)
    followupDate = models.DateTimeField(null = True , blank = True)
    data = models.CharField(max_length = 1000 , null = True , blank = True)
    typ = models.CharField(choices = LOG_TYP , max_length = 20 , null=True)
    recording = models.FileField(null = True , upload_to = campaignItemSavePath)
    recording2 = models.FileField(null = True , upload_to = campaignItemSavePath)
