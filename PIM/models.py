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
from ERP.zoomapi import *
import base64
from twilio.rest import Client

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
    try:
        return 'chat/%s_%s' % (str(time()).replace('.', '_'), filename)
    except:
        return 'chat/%s_%s' % (str(time.time()).replace('.', '_'), filename)


def getChatThreadDP(instance , filename):
    print "time" , time , dir(time)
    try:
        return 'dp/%s_%s' % (str(time()).replace('.', '_'), filename)
    except:
        return 'dp/%s_%s' % (str(time.time()).replace('.', '_'), filename)




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
    updated = models.DateTimeField(auto_now=True)
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
    is_pin = models.BooleanField(default = False)




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
    try:
        return 'support/chat/%s_%s' % (str(time()).replace('.', '_'), filename)
    except:
        return 'support/chat/%s_%s' % (str(time.time()).replace('.', '_'), filename)

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
    zoomcode = models.TextField(max_length = 5000 , null = True)
    division = models.ForeignKey(Division , related_name = 'calendardivision' , null = True)

import time
import subprocess
@receiver(post_save, sender=calendar, dispatch_uid="server_post_save")
def createMeeting(sender, instance, **kwargs):
    if instance.zoomcode == None:
        try:
            authKey =  base64.b64encode('NSibt8TRCC1jSvaXk1bfw:P6RQ5hC2JgYXNhjkFBjoqkaKBzxyTn3C')
            zoomapiKey = globalSettings.ZOOM_API_TOKEN
            # zoomapiKey =  'https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token='+authKey
            # res = requests.post(zoomapiKey,params=data,headers = {"Authorization" : 'Basic '+ authKey})
            # print res,'aaaaaaaaaaaaa'
            data = {'grant_type':'authorization_code','code':instance.user.profile.zoom_token,'redirect_uri':'https://6be19224e4bb.ngrok.io/zoomAuthRedirect/'}
            res1 = requests.post(zoomapiKey,params=data,headers = {"Authorization" : 'Basic '+ authKey})
            print res1.text
            accesToken  = json.loads(res1.text)
            instance.zoomcode = accesToken['access_token']
            CreateMeeting(instance)
        except:
            pass

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
    if isinstance(obj, (datetime, datetime.date))
    else None
)

def createMessage(uid, message , fileObj = None):
    print "Inside the models > create message"
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

    try:
        now = datetime.datetime.now()
    except:
        now = datetime.now()
    chatThObj = ChatThread.objects.filter(uid=uid)
    sJson = {
        "attachment": attachmentUrl,
        "attachmentType": None,
        "created": json.dumps(now, default=date_handler).replace('"' , ''),
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
              'args': [ "MF" , {"filePk" : sc.pk } , {"agentDp" : logoAdd , "last_name" : chatThObj[0].company.name }, datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ') ]
            }
        )


    else:
        print "----------------" , datetime
        requests.post(globalSettings.WAMP_POST_ENDPOINT,
            json={
              'topic': globalSettings.WAMP_PREFIX + 'service.support.chat.' + sc.uid ,
              'args': [ "M" , sc.pk , {"agentDp" : logoAdd , "last_name" : chatThObj[0].company.name }, datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ') ]
            }
        )



@receiver(post_save, sender=ChatMessage, dispatch_uid="server_post_save")
def pushMessageToUI(sender, instance, **kwargs):

    if instance.thread == None and instance.uid is not None:
        try:
            threadObj = ChatThread.objects.get(uid = instance.uid)
            instance.thread = threadObj
            instance.save()
        except:
            pass
        return

    print "saved ..............//......................." , instance.message
    # if not kwargs['created']:
    #     print kwargs
    #     print "returning because it might be an update"
    #     return

    try:
        attachmentUrl = instance.attachment.url
        attType = instance.attachmentType
    except:
        attachmentUrl = None
        attType = None
    toPush = { "pk" :	instance.pk,
        "created" :	instance.created.isoformat(),
        "uid" :	instance.uid,
        "attachment" :attachmentUrl,
        "user" :1,
        "message" :	instance.message,
        "attachmentType" :attType,
        "sentByAgent" :	False,
        "responseTime" :	None,
        "logs" :	None,
        "delivered" :	False,
        "read" :	False,
        "is_hidden" :	False
    }
    print toPush

    ct = ChatThread.objects.get(uid = instance.uid)
    print ct , "chatthread" , ct.pk
    print "instance.sentByAgent" , instance.sentByAgent , ct.transferred , ct.company.botMode , ct.channel
    if not instance.sentByAgent and ct.transferred and not ct.channel== 'self' :
        print "Sending it to the agent--------------------------------"
        res = requests.post(globalSettings.WAMP_POST_ENDPOINT,
            json={
              'topic': globalSettings.WAMP_PREFIX+ 'service.support.' + str(ct.company.pk),
              'args': [instance.uid, 'M', instance.pk, ct.company.pk , False, ct.pk , ct.company.name]
            }
        )
        
        print " posted to the agent " , res.text
        return

    if ct.channel == 'FB' and instance.sentByAgent:
        bot = Bot(ct.company.access_token)
        if instance.attachment == None:
            bot.send_text_message(ct.fid, instance.message)
        else:
            ext = instance.attachment.url.split('.')[-1]
            typ = instance.attachmentType

            if ext in ['pdf' , 'docx' , 'ppt' , 'doc', 'odt']:
                typ = 'file'

            print "instance.attachment.url" , instance.attachment.url
            print "typ : " , typ

            bot.send_raw({
                "recipient" : {"id":ct.fid},
              "message":{
                "attachment":{
                  "type":typ,
                  "payload":{
                    "is_reusable": True,
                    "url": globalSettings.SITE_ADDRESS + instance.attachment.url
                  }
                }
            }})

    if ct.channel == 'whatsapp-gupshup' and instance.sentByAgent:




        if instance.attachment == None:
            # bot.send_text_message(ct.fid, instance.message)

             # curl -X POST https://api.gupshup.io/sm/api/v1/msg \
             # -H 'Cache-Control: no-cache' \
             # -H 'Content-Type: application/x-www-form-urlencoded' \
             # -H 'apikey: 97fc389c7b1545eec5d1aaf49321aa17' \
             # -H 'cache-control: no-cache' \
             # -d 'channel=whatsapp&source=918209371323&destination=91&message=%7B%22type%22:%22text%22,%22text%22:%22%22%7D&src.name=EPSILON'

            headers = {
                'Cache-Control':'no-cache',
                'Content-Type':'application/x-www-form-urlencoded',
                'apikey':'97fc389c7b1545eec5d1aaf49321aa17',
            }
            data = {
                'channel' : 'whatsapp',
                'source' : '918209371323',
                'destination' : ct.fid,
                'message' : instance.message,
                'src.name' : 'EPSILON'
            }
            res = requests.post('https://api.gupshup.io/sm/api/v1/msg' , headers=headers , data = data)


        else:

             # curl -X POST https://api.gupshup.io/sm/api/v1/msg \
             # -H 'Cache-Control: no-cache' \
             # -H 'Content-Type: application/x-www-form-urlencoded' \
             # -H 'apikey: 97fc389c7b1545eec5d1aaf49321aa17' \
             # -H 'cache-control: no-cache' \
             # -d 'channel=whatsapp&source=918209371323&destination=916456565&message=%7B%22type%22:%22image%22,%22previewUrl%22:%22https://www.buildquickbots.com/whatsapp/media/sample/png/sample01.png%22,%22originalUrl%22:%22https://www.buildquickbots.com/whatsapp/media/sample/png/sample01.png%22,%22caption%22:%22fdsfdfsd%22,%22filename%22:%22Sample.png%22%7D&src.name=EPSILON'

            headers = {
                'Cache-Control':'no-cache',
                'Content-Type':'application/x-www-form-urlencoded',
                'apikey':'97fc389c7b1545eec5d1aaf49321aa17',
            }
            data = {
                'channel' : 'whatsapp',
                'source' : '918209371323',
                'destination' : ct.fid,
                'src.name' : 'EPSILON',
                'message' : {
                    'type': 'file',
                    'url': globalSettings.SITE_ADDRESS + instance.attachment.url,
                    'caption' : 'Attachment',
                    'filename' : instance.attachment.url.split('_')[-1]
                },
            }

            res = requests.post('https://api.gupshup.io/sm/api/v1/msg' , headers=headers , data = data)
            print '===================SENDING FILE TO GUPSHUP===========\n\n\n'
            print "data" , data

            print globalSettings.SITE_ADDRESS + instance.attachment.url
            print res.text
            print '===================SENDING FILE TO GUPSHUP===========\n\n\n'

            # ext = instance.attachment.url.split('.')[-1]
            # typ = instance.attachmentType
            #
            # if ext in ['pdf' , 'docx' , 'ppt' , 'doc', 'odt']:
            #     typ = 'file'
            #
            # print "instance.attachment.url" , instance.attachment.url
            # print "typ : " , typ
            #
            # bot.send_raw({
            #     "recipient" : {"id":ct.fid},
            #   "message":{
            #     "attachment":{
            #       "type":typ,
            #       "payload":{
            #         "is_reusable": True,
            #         "url": globalSettings.SITE_ADDRESS + instance.attachment.url
            #       }
            #     }
            # }})



    if ct.channel == 'whatsapp' and instance.sentByAgent:
        print "Publish on whatsapp "
        # Your Account Sid and Auth Token from twilio.com/console
        # DANGER! This is insecure. See http://twil.io/secure
        if ct.company.whatsappNumber is None:
            account_sid = globalSettings.TWILLIO_SID
            auth_token = globalSettings.TWILLIO_AUTH_TOKEN
            from_number = globalSettings.DEFAULT_WHATSAPP_NUMBER
        else:
            account_sid = ct.company.twillioAccountSID
            auth_token = ct.company.trillioAuthToken
            from_number = ct.company.whatsappNumber
            if account_sid is None:
                account_sid = globalSettings.TWILLIO_SID
                auth_token = globalSettings.TWILLIO_AUTH_TOKEN

        client = Client(account_sid, auth_token)
        print account_sid, auth_token
        print "instance.message" , instance.message , ct.fid
        if instance.attachment == None:
            print "plain text"

            message = client.messages.create(
                                          body= instance.message,
                                          from_='whatsapp:+%s'%(from_number),
                                          to='whatsapp:+%s'%(ct.fid.replace(' ', ''))
                                      )
        else:
            print "media message"
            message = client.messages.create(
                                          media_url= [ globalSettings.SITE_ADDRESS + instance.attachment.url],
                                          from_='whatsapp:+%s'%(from_number),
                                          to='whatsapp:+%s'%(ct.fid.replace(' ', ''))
                                      )

