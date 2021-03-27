# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User
# Create your models here.
from time import time
from ERP.models import *


class Activity(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    uid =  models.CharField(max_length = 50, null = False)
    page = models.TextField(max_length = 550 , null = False)
    timeDuration = models.PositiveIntegerField(default=0) # In Seconds
    reference = models.TextField(null=True)
    user = models.ForeignKey(User , related_name='activitiesUser' , null = True)
    lat = models.FloatField(null=False , default=0)
    lng = models.FloatField(null=False , default=0)

class FAQ(models.Model):
    company = models.ForeignKey(Division , related_name = 'faqs' , null = False)
    response = models.TextField(max_length = 5000 , null = True ,blank = True)
    url = models.CharField(max_length = 100 , null = True)
    secondaryAnswer = models.BooleanField(default = False)
    parent = models.ForeignKey("self" , related_name="relatedQuestions", null = True)
    name = models.CharField(max_length = 100 , null = True)
    terminate = models.BooleanField(default = False)

class FAQInputVariation(models.Model):
    parent = models.ForeignKey(FAQ , null = False , related_name='input_vatiations')
    txt =  models.CharField(max_length = 500 , null = True)

BLOCK_EXECUTION_CHOICES = (
    ('RPA' , 'RPA'),
    ('REST' , 'REST'),
    ('APPOINTMENT' , 'APPOINTMENT'),
    ('LEAD' , 'LEAD'),
    ('EMAIL' , 'EMAIL'),
    ('RESPONSE' , 'RESPONSE')
)

EXECUTION_END_TYPE_CHOICE = (
    ('GET' , 'GET'),
    ('POST' , 'POST'),
    ('PATCH' , 'PATCH'),
    ('DELETE' , 'DELETE'),
    ('EXECUTE' , 'EXECUTE'), # for RPA three possible choices , execute is something which may return something to the user as well
    ('QUEUE' , 'QUEUE'),
    ('SCHEDULE' , 'SCHEDULE'),
)

TYPE_CHOICES = (
    ('extract' , 'extract'),
    ('process' , 'process'),
    ('general' , 'general'),
    ('product' , 'product'),
    ('FAQ' , 'FAQ'),
)

RULE_CHOICES = (
    ('process|extract|name' , 'process|extract|name'),
    ('process|extract|mobile' , 'process|extract|mobile'),
    ('process|extract|email' , 'process|extract|email'),
    ('process|extract|date' , 'process|extract|date'),
    ('process|extract|external' , 'process|extract|external'),
    ('process|extract|rawText' , 'process|extract|rawText'),
    ('process|reply' , 'process|reply'),
    ('process|extract|custom' , 'process|extract|custom'),
    ('process|extract|file' , 'process|extract|file')
)


class NodeBlock(models.Model):
    company = models.ForeignKey(Division , related_name = 'nodeIntents' , null = True)
    response = models.TextField(max_length = 3000 , null = True)
    auto_response = models.TextField(max_length = 3000 , null = True, blank = True)
    context_key = models.CharField(max_length = 500 , null = True,  blank = True)

    rule = models.CharField(max_length = 100 , null = True, choices = RULE_CHOICES)
    type = models.CharField(max_length = 50 , null = True, choices = TYPE_CHOICES)


    parent = models.ForeignKey("self" , related_name="context_requirement" , null = True)

    unique = models.BooleanField(default = False) # changed when parent is not null
    failResponse = models.TextField(max_length = 3000 , null = True,  blank = True) # in case the bot is not able to process current message , success next is same as parent
    name = models.CharField(max_length = 100 , null = True, blank = True)
    description = models.TextField(max_length = 3000 , null = True)

    requirementOrder = models.PositiveIntegerField(null = True)
    nodeResponse = models.TextField(max_length = 1000 , null = True,  blank = True)
    externalProcessType = models.CharField(max_length = 100 , null = True , choices = BLOCK_EXECUTION_CHOICES)
    endpoint = models.CharField(max_length = 100 , null = True) # wither the process name / rest URL
    uipathEnvironment = models.CharField(max_length = 100 , null = True) # wither the process name / rest URL
    uipathProcess = models.CharField(max_length = 100 , null = True) # wither the process name / rest URL
    uipathRobot = models.CharField(max_length = 1000 , null = True)
    uipathQueue = models.CharField(max_length = 1000 , null = True)
    custom_process_code = models.TextField(max_length = 5000 , null = True)
    verify = models.BooleanField(default = False) # if checked and type is to get email or mobile number , the bot will veryfy them with an OTP
    pre_validation_code = models.TextField(max_length = 1000 , null = True, blank = True)
    validation_code = models.TextField(max_length = 1000 , null = True, blank = True)
    # nextBlock = models.ForeignKey("self" , related_name="prevBlock" , null = True)
    leadMagnet = models.BooleanField(default = False) # if this is checked , we will add the name , email or mobile extract block automatically , this is applicable only in FAQ block and base block
    emailMagnet = models.BooleanField(default = False)
    mobileMagnet = models.BooleanField(default = False)
    nameMagnet = models.BooleanField(default = False)
    enabled = models.BooleanField(default = True) # mainly used for FAQ lead magnet mode
    leadMagnetDefer = models.PositiveIntegerField(default = 2)
    needConfirmation = models.BooleanField(default = False)
    inheritedFrom = models.ForeignKey("self" , related_name="subClasses" , null = True)

    # designer related fields
    newx = models.FloatField(null = True , default = 0)
    newy = models.FloatField(null = True , default = 0)
    label = models.CharField(max_length = 30 , null = True)
    icon = models.CharField(max_length = 30 , null = True)
    color = models.CharField(max_length = 30 , null = True)
    blockType = models.CharField(max_length = 30 , null = True)

    exampleInput = models.CharField(max_length = 500 , null = True)
    retry = models.PositiveIntegerField(default = 0)
    saleConfig = models.TextField(max_length = 1000 , null = True, blank = True)


class Connection(models.Model):
    callbackName = models.CharField(max_length = 300 , null = True)
    to = models.ForeignKey(NodeBlock , null = True , related_name='connectionSources' , on_delete=models.SET_NULL)
    parent = models.ForeignKey(NodeBlock , null = True , related_name='connections')
    condition = models.CharField(max_length = 300 , null = True)


class NodeBlockInputVariation(models.Model): # also the positive affirmation text variations
    parent = models.ForeignKey(NodeBlock , null = False , related_name='input_vatiations')
    txt =  models.CharField(max_length = 500 , null = True)
    response = models.TextField(max_length = 500 , null = True)
    init = models.BooleanField(default = False)

class ActionIntentInputVariation(models.Model): # not used as of now anywhere
    parent = models.ForeignKey(NodeBlock , null = False , related_name='action_intent_vatiations')
    txt =  models.CharField(max_length = 500 , null = True)

class NodeSlectionsVariations(models.Model):
    parent = models.ForeignKey(NodeBlock , null = False , related_name='node_variations_vatiations')
    txt =  models.CharField(max_length = 500 , null = True)

class StartoverVariations(models.Model):
    parent = models.ForeignKey(NodeBlock , null = False , related_name='startover_vatiations')
    txt =  models.CharField(max_length = 500 , null = True)

class VariableContext(models.Model):
    nodeBlock = models.ForeignKey(NodeBlock , null = False , related_name='variableContexts')
    key = models.CharField(max_length = 50, null = True)
    value = models.CharField(max_length = 500, null = True)
    typ =  models.CharField(max_length = 10, null = True)
    can_change = models.BooleanField(default = False)
