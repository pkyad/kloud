from django.db import models
from django.contrib.auth.models import User
from time import time
from marketing.models import   Contacts
from organization.models import Division
from django.db.models.signals import post_save , pre_delete
from django.dispatch import receiver
import json
import datetime
import requests
from django.conf import settings as globalSettings

# Create your models here.
def getThemeImageUploadPath(instance , filename ):
    return 'PIM/images/theme/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

PRESENCE_CHOICES = (
    ('NA' , 'NA'),
    ('Available' , 'Available'),
    ('Busy' , 'Busy'),
    ('Away' , 'Away'),
    ('On Leave' ,'On Leave'),
    ('In A Meeting' ,'In a meeting'),
)
class settings(models.Model):
    presence = models.TextField(max_length = 15 , choices = PRESENCE_CHOICES , null = False , default = 'NA')
    user = models.OneToOneField(User)

class theme(models.Model):
    main = models.TextField(max_length=10 , null = True)
    highlight = models.TextField(max_length=10 , null = True)
    background = models.TextField(max_length=10 , null = True)
    backgroundImg = models.ImageField(upload_to = getThemeImageUploadPath , null = True)
    parent = models.OneToOneField(settings , related_name = 'theme')

User.settings = property(lambda u : settings.objects.get_or_create(user = u)[0])
settings.theme = property(lambda s : theme.objects.get_or_create(parent = s)[0])

DOMAIN_CHOICES = (
    ('System' , 'System'),
    ('Administration' , 'Administration'),
    ('Application' , 'Application')
)

class notification(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    message = models.TextField(max_length = 300 , null=True)
    link = models.URLField(max_length = 100 , null = True)
    title = models.TextField(max_length = 250 , null = True)
    read = models.BooleanField(default = False)
    user = models.ForeignKey(User, null = True,related_name = 'notifications')
    domain = models.TextField(null = False , default = 'System' , choices = DOMAIN_CHOICES , max_length = 250)
    orginatedBy = models.ForeignKey(User, null = True, related_name = 'generatedNotifications')
    onHold = models.BooleanField(default = False)
    broadcast = models.BooleanField(default = False)

def getChatMessageAttachment(instance , filename ):
    return 'chat/%s_%s' % (str(time()).replace('.', '_'), filename)

def getChatThreadDP(instance , filename):
    return 'dp/%s_%s' % (str(time()).replace('.', '_'), filename)



CHAT_THREAD_TYPE = (
    ('whatsapp' , 'whatsapp'),
    ('fb' , 'fb'),
    ('sms' , 'sms'),
    ('web' , 'web'),
    ('user' , 'user'),
)


from marketing.models import Contacts

CHATTHREAD_STATUS_CHOICES = (
    ('started' , 'started'),
    ('closed' , 'closed'),
    ('reviewed' , 'reviewed'),
    ('resolved' , 'resolved'),
    ('archived' , 'archived'),
    ('escalatedL1' , 'escalatedL1'),
    ('escalatedL2' , 'escalatedL2'),
    ('missed' , 'missed'),
)
THREAD_CHANNEL_CHOICES = (
    ("self" , "self"),
    ("FB" , "FB"),
)

class ChatThread(models.Model):
    title = models.TextField(max_length = 40 , null=True)
    created = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User , related_name='chat_threads' , blank = True)
    description = models.TextField(max_length = 200 , blank = True , null = True)
    dp = models.FileField(upload_to = getChatThreadDP , null = True)

    lastActivity = models.DateTimeField(null = True, blank=True)
    isLate = models.BooleanField(default = False)
    visitor = models.ForeignKey(Contacts , related_name='chatThreads' , null = True)
    uid = models.CharField(max_length = 50 , null = True , unique = True)
    status = models.CharField(choices = CHATTHREAD_STATUS_CHOICES , max_length = 15 , default = 'started')
    customerRating = models.PositiveSmallIntegerField(null = True,blank=True)
    customerFeedback = models.CharField(max_length = 3000 , null = True,blank=True)
    company = models.ForeignKey(Division , related_name = 'chatThread' , null = True)
    userDevice = models.CharField(max_length = 200 , null = True , blank=True)
    location = models.CharField(max_length = 5000 , null = True , blank=True)
    userDeviceIp = models.CharField(max_length = 100 , null = True , blank=True)
    firstResponseTime = models.FloatField(null=True, blank=True)
    typ = models.CharField(max_length = 100 , null = True , blank=True)
    userAssignedTime = models.DateTimeField(null = True, blank=True)
    firstMessage = models.TextField(max_length = 2000 , null = True , blank=True)
    receivedBy = models.ManyToManyField(User , related_name = 'receivedBy' , blank = True)
    channel = models.CharField(choices = THREAD_CHANNEL_CHOICES , default = "self", max_length = 50)
    transferred = models.BooleanField(default = False)
    fid = models.CharField(max_length = 50 , null = True )
    closedOn = models.DateTimeField(null = True, blank=True)
    closedBy = models.ForeignKey(User , related_name = 'closedUser' , null = True, blank=True)
    user = models.ForeignKey(User , related_name='externalChatThreads' , null = True)
    is_personal =  models.BooleanField(default = False)


MSG_TYPE_CHOICES = (
    ('text' , 'text'),
    ('attachment' , 'attachment'),
    ('voice' , 'voice'),
    ('video' , 'video'),
    ('image' , 'image'),
    ('system' , 'system'),
    ('bot' , 'bot'),
)

def getSupportChatAttachment(instance , filename ):
    return 'support/chat/%s_%s' % (str(time()).replace('.', '_'), filename)

class ChatMessage(models.Model):
    thread = models.ForeignKey(ChatThread , related_name = 'messages' , null = True)
    created = models.DateTimeField(auto_now_add = True)
    uid = models.CharField(max_length = 50, null = True)
    attachment = models.FileField(upload_to = getSupportChatAttachment , null = True)
    user = models.ForeignKey(User , related_name = 'supportFile' , null = True)
    message = models.TextField(max_length = 5000 , null = True)
    attachmentType =  models.CharField(max_length = 50, null = True)
    sentByAgent = models.BooleanField(default = False)
    responseTime = models.FloatField(null=True, blank=True)
    logs = models.CharField(max_length = 500 , null = True ,blank = True)
    delivered = models.BooleanField(default = False)
    read = models.BooleanField(default = False)
    is_hidden = models.BooleanField(default = False)
    fileType = models.TextField(max_length = 10 , null=True)
    fileSize = models.TextField(max_length = 10 , null=True)
    fileName = models.TextField(max_length = 20 , null=True)
    replyTo = models.ForeignKey("self" , null = True, related_name="children")
    is_forwarded = models.BooleanField(default = False)

def getCalendarAttachment(instance , filename ):
    return 'calendar/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, instance.originator.username, filename)

def getOGImageAttachment(instance , filename ):
    return 'blogs/%s_%s' % (str(time()).replace('.', '_'), filename)

from clientRelationships.models import Contact
# from marketing.models import CampaignItem
class calendar(models.Model):
    TYPE_CHOICE = (
        ('Meeting' , 'Meeting'),
        ('Reminder' , 'Reminder'),
        ('ToDo' , 'ToDo'),
        ('EVENT' , 'EVENT'),
        ('Deadline' , 'Deadline'),
        ('Other' , 'Other'),
    )

    LEVEL_CHOICE = (
        ('Normal' , 'Normal'),
        ('Critical' , 'Critical'),
        ('Optional' , 'Optional'),
        ('Mandatory' , 'Mandatory'),
    )

    VISIBILITY_CHOICES = (
        ('personal' , 'personal'), # if only I can see
        ('public' , 'public'), # everyone can see
        ('management' , 'management'), # only access level higher to me can see
        ('friends' , 'friends'), # only fiends in the public can see
    )

    visibility = models.TextField(choices = VISIBILITY_CHOICES , default = 'personal' , max_length = 20)
    eventType = models.TextField(choices = TYPE_CHOICE , default = 'Other' , max_length = 11)
    originator = models.TextField(null = True , max_length = 20)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, null = True)
    text = models.TextField(max_length = 200 , null = True)
    when = models.DateTimeField(null = True)
    end = models.DateTimeField(null = True)
    duration = models.IntegerField(null = True)
    deleted = models.BooleanField(default = False)
    completed = models.BooleanField(default = False)
    canceled = models.BooleanField(default = False)
    level = models.TextField(choices = LEVEL_CHOICE , default = 'Normal' , max_length = 10)
    venue = models.TextField(max_length = 50 , null = True)
    attachment = models.FileField(upload_to = getCalendarAttachment , null = True)
    myNotes = models.TextField(max_length = 100 , blank = True)
    followers = models.ManyToManyField(User , related_name = 'calendarItemsFollowing' , blank = True)
    data = models.TextField(max_length = 200 , null = True)



class ChatContext(models.Model):
    uid = models.CharField(max_length = 50, null = True)
    key = models.CharField(max_length = 50, null = True)
    value = models.CharField(max_length = 500, null = True)
    typ =  models.CharField(max_length = 10, null = True)


@receiver(post_save, sender=ChatContext, dispatch_uid="server_post_save")
def pushContextToUI(sender, instance, **kwargs):
    if instance.key != 'step_id':
        return

    requests.post(globalSettings.WAMP_POST_ENDPOINT,
        json={
          'topic': globalSettings.WAMP_PREFIX + 'service.support.debugger.' + instance.uid ,
          'args': [ "STEP" , instance.value  ]
        }
    )



def saveContext(key , typ , ctx):
    p, created = ChatContext.objects.get_or_create(
        key= key,
        uid = ctx['uid'],
        typ = typ
    )
    p.value= str(ctx[key])
    p.save()

def removeContext(key , ctx):
    ChatContext.objects.filter(uid = ctx['uid'] , key = key).delete()

date_handler = lambda obj: (
    obj.isoformat()
    if isinstance(obj, (datetime.datetime, datetime.date))
    else None
)

def createMessage(uid, message , fileObj = None):
    sc = ChatMessage(uid = uid , message = message , sentByAgent = True, responseTime = 0 , is_hidden = False )


    attachmentUrl = None


    if fileObj is not None:
        print "Saving file"
        sc.attachment = fileObj

        ext = sc.attachment.url.split('.')[-1]
        if ext in ['jpg', 'jpeg' , 'png' , 'svg']:
            sc.attachmentType = 'image'
        elif ext in ['pdf']:
            sc.attachmentType = 'application'

        sc.save()
        attachmentUrl = globalSettings.SITE_ADDRESS + sc.attachment.url

    sc.save()

    print "After creating message -------------//----------------"
    userPk = None
    if sc.user is not None:
        userPk = sc.user.pk


    chatThObj = ChatThread.objects.filter(uid=uid)
    sJson = {
        "attachment": attachmentUrl,
        "attachmentType": None,
        "created": json.dumps(datetime.datetime.now(), default=date_handler).replace('"' , ''),
        "is_hidden": False,
        "logs": None,
        "message": sc.message,
        "sentByAgent": True,
        "timeDate": "00:00 PM",
        "uid": sc.uid,
        "sentfrom" : "system",
        "pk" : sc.pk,
        "user" : userPk,
    }

    try:
        logoAdd = globalSettings.SITE_ADDRESS + chatThObj[0].company.dp.url
    except:
        logoAdd = globalSettings.SITE_ADDRESS + '/static/images/img_avatar_card.png'

    if attachmentUrl is not None:

        requests.post(globalSettings.WAMP_POST_ENDPOINT,
            json={
              'topic': globalSettings.WAMP_PREFIX + 'service.support.chat.' + sc.uid ,
              'args': [ "MF" , {"filePk" : sc.pk } , {"agentDp" : logoAdd , "last_name" : chatThObj[0].company.name }, datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ') ]
            }
        )


    else:
        requests.post(globalSettings.WAMP_POST_ENDPOINT,
            json={
              'topic': globalSettings.WAMP_PREFIX + 'service.support.chat.' + sc.uid ,
              'args': [ "M" , sJson , {"agentDp" : logoAdd , "last_name" : chatThObj[0].company.name }, datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ') ]
            }
        )
