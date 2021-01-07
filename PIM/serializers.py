from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from ERP.zoomapi import *
from ERP.models import service
from HR.models import service
from marketing.models import  Contacts
from clientRelationships.models import Contact
from HR.serializers import *
import datetime
import pytz
import math

class serviceLiteCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = service
        fields = ('pk' , 'name' )
        read_only_fields = ( 'name',)


class ContactLiteSerializer(serializers.ModelSerializer):
    company = serviceLiteCompanySerializer(many = False , read_only = True)
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male')
        read_only_fields = ( 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male')


class themeSerializer(serializers.ModelSerializer):
    class Meta:
        model = theme
        fields = ( 'pk' , 'main' , 'highlight' , 'background' , 'backgroundImg')

class settingsSerializer(serializers.ModelSerializer):
    theme = themeSerializer(many = False , read_only = True)
    class Meta:
        model = settings
        fields = ('pk' , 'user', 'theme', 'presence')

class notificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = notification
        fields = ('pk' , 'message' ,'title','domain','onHold', 'link' , 'orginatedBy' , 'created' ,'updated' , 'read' , 'user','broadcast')
    def create(self , validated_data):
        notificationObj = notification(**validated_data)
        notificationObj.save()
        messageExpo = notificationObj.message
        if notificationObj.user is None:
            users = User.objects.all()
            for userObj in users:
                token = userObj.profile.expoPushToken
                print token,'token'
                if token is not None and len(token)>0:
                    try:
                        send_push_message(token,message)
                    except Exception as e:
                        pass

        return notificationObj
import json
class calendarSerializer(serializers.ModelSerializer):
    clients = ContactLiteSerializer(many = True , read_only = True)
    time = serializers.SerializerMethodField()
    remainingHours = serializers.SerializerMethodField()
    class Meta:
        model = calendar
        fields = ('pk' , 'eventType' , 'followers' ,'originator', 'duration' , 'created', 'updated', 'user' , 'text'  ,'when'  , 'deleted' , 'completed' , 'canceled' , 'level' , 'venue' , 'attachment' , 'myNotes', 'clients', 'data','time','remainingHours')
        read_only_fields = ('followers', 'user' , 'clients')
    def get_time(self,obj):
        tz_IN = pytz.timezone('Asia/Kolkata')
        date = obj.when.astimezone(tz_IN)
        return  str(date.time()).split('.')[0][:-3]
    def get_remainingHours(self,obj):
        tz_IN = pytz.timezone('Asia/Kolkata')
        now = datetime.datetime.now(tz_IN)
        date = obj.when.astimezone(tz_IN)
        diff = date - now
        remainingHours = int(math.floor(diff.seconds/(60*60)))
        toReturn = str(remainingHours) + ' Hours'
        if remainingHours == 0:
            remainingMinutes = int(math.floor(diff.seconds/(60)))
            toReturn = str(remainingMinutes)+' Minutes'
        return  toReturn
    def get_time(self,obj):
        tz_IN = pytz.timezone('Asia/Kolkata')
        date = obj.when.astimezone(tz_IN)
        return  str(date.time()).split('.')[0][:-3]
    def create(self , validated_data):
        cal = calendar(**validated_data)
        cal.user = self.context['request'].user
        cal.save()
        if 'followers' in  self.context['request'].data:
            tagged = self.context['request'].data['followers']
            print tagged,'aaaaaaaaaaaaaaaaaaaaaaaaaa'
            if not isinstance(tagged , list):
                for tag in tagged.split(','):
                    cal.followers.add( User.objects.get(pk = tag))
            else:
                for tag in tagged:
                    cal.followers.add( User.objects.get(pk = tag))

        if 'clients' in  self.context['request'].data:
            clients = self.context['request'].data['clients']
            for c in clients:
                cal.clients.add( Contact.objects.get(pk = c))
        if 'campainItem' in  self.context['request'].data:
            campainItem = self.context['request'].data['campainItem']
            cal.campaignItem = CampaignItem.objects.get(pk = int(campainItem))
        if 'orginatedBy' in  self.context['request'].data:
            orginatedBy = self.context['request'].data['orginatedBy']
            cal.orginatedBy = User.objects.get(pk = int(orginatedBy))
        if 'contacts' in  self.context['request'].data:
            contacts = self.context['request'].data['contacts']
            cal.contacts = Contacts.objects.get(pk = int(contacts))

        CreateMeeting(cal)
        cal.save()
        return cal
    def update(self, instance, validated_data): # like the comment
        for key in ['eventType', 'duration' , 'text' ,'when' , 'read' , 'deleted' , 'completed' , 'canceled' , 'level' , 'venue' , 'attachment' , 'myNotes', 'data','campaignItem','contacts','orginatedBy']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.followers.clear()
        if 'followers' in  self.context['request'].data:
            tagged = self.context['request'].data['followers']
            if not isinstance(tagged , list):
                for tag in tagged.split(','):
                    instance.followers.add( User.objects.get(pk = tag))
            else:
                for tag in tagged:
                    instance.followers.add( User.objects.get(pk = tag))
        instance.clients.clear()
        if 'clients' in  self.context['request'].data:
            clients = self.context['request'].data['clients']
            for c in clients:
                instance.clients.add(Contact.objects.get(pk = c))

        if 'campainItem' in  self.context['request'].data:
            campainItem = self.context['request'].data['campainItem']
            instance.campaignItem = CampaignItem.objects.get(pk = int(campainItem))
        if 'orginatedBy' in  self.context['request'].data:
            orginatedBy = self.context['request'].data['orginatedBy']
            instance.orginatedBy = User.objects.get(pk = int(orginatedBy))
        if 'contacts' in  self.context['request'].data:
            contacts = self.context['request'].data['contacts']
            instance.contacts = Contacts.objects.get(pk = int(contacts))
        instance.save()
        return instance

class userProfileLiteSerializer(serializers.ModelSerializer):
    # to be used in the typehead tag search input, only a small set of fields is responded to reduce the bandwidth requirements
    class Meta:
        model = profile
        fields = ('displayPicture' , 'prefix' ,'pk','mobile','lat','lon','isDashboard','isManager','zoom_token')
class userSearchSerializer(serializers.ModelSerializer):
    profile = userProfileLiteSerializer(many=False , read_only=True)
    logo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ( 'pk', 'username' , 'first_name' , 'last_name' , 'profile' , 'designation', 'email' ,'logo','is_staff','last_login')
    def get_logo(self, obj):
        return globalSettings.BRAND_LOGO

class chatMessageSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(read_only=True,many=False)
    class Meta:
        model = ChatMessage
        fields = ('pk' , 'thread' ,'uid', 'attachment' , 'created' , 'read' , 'user','message','attachmentType','sentByAgent','responseTime','logs','delivered','read','is_hidden','fileType','fileSize','fileName')
    def create(self , validated_data):
        im = ChatMessage.objects.create(**validated_data)
        im.user = self.context['request'].user
        try:
            im.attachment = self.context['request'].FILES['attachment']
        except:
            pass
        try:
            im.attachment = self.context['request'].FILES['attachment']
            if im.attachment.name.endswith('.pdf'):
                im.fileType = 'pdf'
            elif im.attachment.name.endswith('.png') or  im.attachment.name.endswith('.jpg') or  im.attachment.name.endswith('.jpeg'):
                im.fileType = 'image'
            elif im.attachment.name.endswith('.doc') or  im.attachment.name.endswith('.docs') or im.attachment.name.endswith('.docx'):
                im.fileType = 'word'
            elif im.attachment.name.endswith('.ppt') or  im.attachment.name.endswith('.pptx'):
                im.fileType = 'ppt'
            elif im.attachment.name.endswith('.xlsx') or im.attachment.name.endswith('.xls'):
                im.fileType = 'xl'
            im.fileSize =  im.attachment.size
            im.fileName = im.attachment.name
        except:
            pass
        # if im.originator == im.user:
        #     im.delete()
        #     raise ParseError(detail=None)
        # else:
        if 'user' in self.context['request'].data:
            im.thread = ChatThread.objects.get(pk=self.context['request'].data['user'])
        im.save()
        return im


class ChatThreadsSerializer(serializers.ModelSerializer):
    participants = userSearchSerializer(read_only=True,many=True)
    name = serializers.SerializerMethodField()
    # agent_dp = serializers.SerializerMethodField()
    # companyName = serializers.SerializerMethodField()
    class Meta:
        model = ChatThread
        fields = ( 'pk' , 'created' , 'title', 'participants' , 'description','dp','lastActivity','isLate','visitor','uid','status','customerRating','customerFeedback','company','userDevice','location','userDeviceIp','firstResponseTime','typ','userAssignedTime','firstMessage','receivedBy','channel','transferred','fid','closedOn','closedBy','name')
    def get_name(self , obj):
        if obj.uid != None:
            if obj.visitor == None:
                name = obj.uid
            else:
                name = obj.vistor.name
        else:
            if obj.title == None:
                name = obj.participants.exclude(pk = self.context['request'].user.pk)[0].first_name
            else:
                name = obj.title
        return name


    def create(self ,  validated_data):
        print validated_data
        c = ChatThread(**validated_data)
        c.save()
        c.company = Division.objects.get(pk=int(self.context['request'].data['company']))
        browserHeader =  dict((regex.sub('', header), value) for (header, value) in self.context['request'].META.items() if header.startswith('HTTP_'))
        print browserHeader.get('USER_AGENT') , self.context['request'].META.get('REMOTE_ADDR'),'@@@@@@@@@@@2'
        if browserHeader.get('USER_AGENT'):
            c.userDevice = browserHeader.get('USER_AGENT')
        if self.context['request'].META.get('REMOTE_ADDR'):
            c.userDeviceIp = self.context['request'].META.get('REMOTE_ADDR')
            try:
                api1 = requests.request('GET',"http://api.ipstack.com/"+c.userDeviceIp+"?access_key=f6e584f19ad6fa9080e0434fb46ae508&format=1")
                # api1=requests.request('GET',"http://api.ipstack.com/43.224.128.172?access_key=f6e584f19ad6fa9080e0434fb46ae508&format=1")
                c.location=json.dumps(api1.json())
            except:
                try:
                    api2 = requests.request('GET','http://ip-api.com/json/'+c.userDeviceIp)
                    # api2=requests.request('GET','http://ip-api.com/json/43.224.128.172')
                    c.location=json.dumps(api2.json())
                except :
                    pass
        c.save()
        return c
    def update(self ,instance, validated_data):
        if 'status' in self.context['request'].data and instance.status=='started':
            uidMsg = SupportChat.objects.filter(uid=instance.uid)
            if len(uidMsg)>0:
                instance.chatDuration = round((uidMsg[uidMsg.count()-1].created - uidMsg[0].created).total_seconds()/60.0 , 2)
        if 'status' in self.context['request'].data:
            if self.context['request'].data['status']=='reviewed':
                instance.reviewedOn = datetime.datetime.now()
                instance.reviewedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='closed':
                instance.closedOn = datetime.datetime.now()
                if 'closedByUser' in self.context['request'].data:
                    pass
                else:
                    instance.closedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='resolved':
                instance.resolvedOn = datetime.datetime.now()
                instance.resolvedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='archived':
                instance.archivedOn = datetime.datetime.now()
                instance.archivedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='escalatedL1':
                instance.escalatedL1On = datetime.datetime.now()
                instance.escalatedL1By = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='escalatedL2':
                instance.escalatedL2On = datetime.datetime.now()
                instance.escalatedL2By = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()

        for key in ['status' , 'customerRating' , 'customerFeedback' , 'company','typ','isLate','location', 'visitor','participants','title',  'description']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'visitor' in self.context['request'].data:
            instance.visitor = Visitor.objects.get(pk=int(self.context['request'].data['visitor']))
        if 'user' in self.context['request'].data:
            if instance.user is None:
                instance.userAssignedTime = datetime.datetime.now()
            instance.user = User.objects.get(pk=int(self.context['request'].data['user']))

        if 'patchMessagesAlso' in self.context['request'].data and 'user' in self.context['request'].data:
            uid = instance.uid
            Usr = User.objects.get(pk=int(self.context['request'].data['user']))
            chats = SupportChat.objects.filter(uid = uid, user = None)
            for c in chats:
                c.user = Usr
                c.save()

        if 'receivedBy' in self.context['request'].data:
            for u in self.context['request'].data['receivedBy']:
                u = User.objects.get(pk = int(u))
                instance.receivedBy.add(u)
        # if 'user' in self.context['request'].data and 'firstAssign' in self.context['request'].data:
        #     if instance.user is None:
        #         instance.user = User.objects.get(pk=int(self.context['request'].data['user']))
        #     else:
        #         raise ValidationError(detail={'PARAMS' : 'Already Taken'})
        if 'participants' in  self.context['request'].data:
            instance.participants.clear()
            tagged = self.context['request'].data['participants']
            for tag in tagged:
                instance.participants.add( User.objects.get(pk = tag))


        instance.save()

        if 'email' in self.context['request'].data:
            print 'getting email here' , self.context['request'].data['email']
            email = self.context['request'].data['email']
            uid = instance.uid
            vObj = Visitor.objects.filter(uid = uid)
            if len(vObj)>0:
                print 'hree'
                vObj[0].email = email
                vObj[0].save()
            else:
                v = Visitor.objects.create(uid = uid , email = email)
                # Visitor(uid = uid , email = email)
                v.save()

        return instance
