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
from notes.models import *
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
        date = obj.when
        diff = date - now
        remainingHours = int(math.floor(diff.seconds/(60*60)))
        toReturn = str(remainingHours) + ' Hours'
        if remainingHours == 0:
            remainingMinutes = int(math.floor(diff.seconds/(60)))
            toReturn = str(remainingMinutes)+' Minutes'
        return  toReturn
    def get_time(self,obj):
        # tz_IN = pytz.timezone('Asia/Kolkata')
        # date = obj.when.astimezone(tz_IN)
        return  str(obj.when.time()).split('.')[0][:-3]
    def create(self , validated_data):
        cal = calendar(**validated_data)
        cal.user = self.context['request'].user
        cal.save()
        if 'slot' in self.context['request'].data:
            hour = self.context['request'].data['slot'].split(':')[0]
            tempmin = self.context['request'].data['slot'].split(':')[1]
            min = tempmin.split(' ')[0]
            cal.when = cal.when.replace(hour=int(hour), minute=int(min))
            if 'duration' in self.context['request'].data:
                cal.end =  cal.when + datetime.timedelta(seconds=int(self.context['request'].data['duration']))
        if 'followers' in  self.context['request'].data:
            tagged = self.context['request'].data['followers']
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

        # CreateMeeting(cal)
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
    division = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ( 'pk', 'username' , 'first_name' , 'last_name' , 'profile' , 'designation', 'email' ,'logo','is_staff','last_login','division')
    def get_logo(self, obj):
        return globalSettings.BRAND_LOGO
    def get_division(self, obj):
        return obj.designation.division.pk


class chatMessageLiteSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(read_only=True,many=False)
    class Meta:
        model = ChatMessage
        fields = ('pk' , 'user','message','fileType','fileSize','fileName','attachment','uid')


class chatMessageSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(read_only=True,many=False)
    replyTo = chatMessageLiteSerializer(read_only=True,many=False)
    class Meta:
        model = ChatMessage
        fields = ('pk' , 'thread' ,'uid', 'attachment' , 'created' , 'read' , 'user','message','attachmentType','sentByAgent','responseTime','logs','delivered','read','is_hidden','fileType','fileSize','fileName','replyTo')
    def create(self , validated_data):
        im = ChatMessage.objects.create(**validated_data)
        im.user = self.context['request'].user
        im.save()
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
            im.fileSize =  "{:.2f}".format(im.attachment.size)
            im.fileName = im.attachment.name
        except:
            pass
        # if im.originator == im.user:
        #     im.delete()
        #     raise ParseError(detail=None)
        # else:
        if 'thread' in self.context['request'].data:
            im.thread = ChatThread.objects.get(pk=self.context['request'].data['thread'])
        if 'replyTo' in self.context['request'].data:
            im.replyTo = ChatMessage.objects.get(pk=self.context['request'].data['replyTo'])
        chatThread = im.thread
        if im.message is not None:
            chatThread.firstMessage = im.message
        else:
            chatThread.firstMessage = im.fileName
        chatThread.save()
        if chatThread.uid is not None:
            im.uid = chatThread.uid
        im.save()
        if im.attachment !=None and im.attachmentType == None:
            if im.fileType == 'image':
                im.attachmentType = 'image'
            else:
                im.attachmentType = 'application'
            im.save()
        return im


class ContactsSerializer(serializers.ModelSerializer):
    # tags = TagSerializer(many=True,read_only=True)
    # remaining = serializers.SerializerMethodField()
    class Meta:
        model = Contacts
        fields = ('pk' , 'created' , 'referenceId' , 'name', 'email', 'mobile' , 'source' , 'pinCode' , 'notes' , 'tags' ,'subscribe' , 'addrs', 'companyName', 'directNumber', 'altNumber', 'altNumber2', 'website', 'socialLink', 'city', 'state', 'country', 'about', 'lang' )
        read_only_fields=('subscribe', 'tags')
    def create(self , validated_data):
        if 'tags' in validated_data:
            del validated_data['tags']
        try:

            if not self.context['request'].user.is_authenticated and "apiKey" not in self.context['request'].data:
                return
            else:
                if self.context['request'].data["apiKey"] != "titan@1234":
                    return
        except:
            pass

        try:
            contatcObj = Contacts.objects.get(email=self.context['request'].data['email'])
            contatcObj.subscribe = True
            for key in [ 'referenceId' , 'name', 'email', 'mobile' , 'source' , 'pinCode' , 'notes' , 'tags' ,'subscribe' , 'addrs', 'companyName', 'directNumber', 'altNumber', 'altNumber2', 'website', 'socialLink', 'city', 'state', 'country', 'about', 'lang']:
                try:
                    setattr(contatcObj , key , validated_data[key])
                except:
                    pass
            contatcObj.save()
            print 'contact already thereeeeeeeee'
        except:
            contatcObj = Contacts(**validated_data)
            contatcObj.subscribe = True
            # contatcObj.creater = self.context['request'].user
            # contatcObj.save()

        if 'tags' in self.context['request'].data:
            for i in self.context['request'].data['tags']:
                contatcObj.tags.add(Tag.objects.get(pk = int(i)))
        if 'tagsTxt' in self.context['request'].data:
            for tagTxt in self.context['request'].data['tagsTxt'].split(','):
                t,nt = Tag.objects.get_or_create(name = tagTxt)
                contatcObj.tags.add(t)
        accountObj = Account.objects.create(title = self.context['request'].data['name'] , group ="Vendor Account")
        newContact = Contact.objects.create(mobile = contatcObj.mobile, user=self.context['request'].user)
        newContact.name = contatcObj.name
        newContact.email = contatcObj.email
        newContact.street = contatcObj.addrs
        newContact.city = contatcObj.city
        newContact.state = contatcObj.state
        newContact.country = contatcObj.country
        newContact.pincode = contatcObj.pinCode
        newContact.save()
        # contatcObj.contact_ref = newContact
        contatcObj.save()
        return contatcObj

    def update(self ,instance, validated_data):
        for key in [ 'referenceId' , 'name', 'email', 'mobile' , 'source' , 'pinCode' , 'notes' , 'tags' ,'subscribe' , 'addrs', 'companyName', 'directNumber', 'altNumber', 'altNumber2', 'website', 'socialLink', 'city', 'state', 'country', 'about', 'lang']:
            try:
                setattr(instance , key , validated_data[key])
                print key
            except:
                pass
        instance.save()
        instance.tags.clear()
        if 'tags' in self.context['request'].data:
            for i in self.context['request'].data['tags']:
                instance.tags.add(Tag.objects.get(pk = int(i)))
            if 'tagsTxt' in self.context['request'].data:
                for tagTxt in self.context['request'].data['tagsTxt'].split(','):
                    t,nt = Tag.objects.get_or_create(name = tagTxt)
                    instance.tags.add(t)
        if 'leadAdded' in self.context['request'].data:
            # instance.creater = self.context['request'].user
            instance.leadDate = date.today()

        # if instance.contact_ref == None:
        #     newContact = Contact.objects.create(mobile = instance.mobile, user=self.context['request'].user)
        # else:
        #     newContact = Contact.objects.get(pk = instance.contact_ref.pk)
        # newContact.name = instance.name
        # newContact.email = instance.email
        # newContact.mobile = instance.mobile
        # newContact.street = instance.addrs
        # newContact.city = instance.city
        # newContact.state = instance.state
        # newContact.country = instance.country
        # newContact.pincode = instance.pinCode
        # newContact.save()
        # instance.contact_ref = newContact
        instance.save()
        return instance

class ChatThreadsSerializer(serializers.ModelSerializer):
    participants = userSearchSerializer(read_only=True,many=True)
    visitor = ContactsSerializer(read_only=True,many=False)
    name = serializers.SerializerMethodField()
    lastmsg = serializers.SerializerMethodField()
    # agent_dp = serializers.SerializerMethodField()
    # companyName = serializers.SerializerMethodField()
    class Meta:
        model = ChatThread

        fields = ( 'pk' , 'created' , 'title', 'participants' , 'description','dp','lastActivity','isLate','visitor','uid','status','customerRating','customerFeedback','company','userDevice','location','userDeviceIp','firstResponseTime','typ','userAssignedTime','firstMessage','channel','transferred','fid','closedOn','closedBy','name','user','is_personal','lastmsg','is_pin')


    def create(self ,  validated_data):
        c = ChatThread(**validated_data)
        user = self.context['request'].user
        c.company = user.designation.division
        c.save()
        c.participants.add(user)
        if 'participants' in  self.context['request'].data:
            try:
                for p in self.context['request'].data['participants'].split(','):
                    c.participants.add( User.objects.get(pk = int(p)))
            except:
                for p in self.context['request'].data['participants']:
                    c.participants.add( User.objects.get(pk = int(p)))
        c.save()
        return c
    def update(self ,instance, validated_data):


        for key in ['status' , 'customerRating' , 'customerFeedback' , 'company','typ','isLate','location', 'participants','title',  'description','dp','is_pin','title','visitor']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'name' in  self.context['request'].data :
            instance.title =  self.context['request'].data['name']
        if 'visitor' in self.context['request'].data:
            v,visitorObj = Contacts.objects.get_or_create(mobile=self.context['request'].data['mobile'])
            print visitorObj,v,'"eeeeeeeeee"'
            if 'email' in self.context['request'].data:
                v.email = self.context['request'].data['email']
            if 'name' in self.context['request'].data:
                v.name = self.context['request'].data['name']
            if 'notes' in self.context['request'].data:
                v.notes = self.context['request'].data['notes']
            if 'addrs' in self.context['request'].data:
                v.addrs = self.context['request'].data['addrs']
            if 'pinCode' in self.context['request'].data:
                v.pinCode = self.context['request'].data['pinCode']
            v.save()
            instance.visitor = v
        if 'participants' in  self.context['request'].data:
            # instance.participants.clear()
            tagged = self.context['request'].data['participants']
            for tag in tagged:
                instance.participants.add( User.objects.get(pk = tag))
        instance.save()
        return instance
    def get_name(self , obj):
        name = None
        if obj.title is not None:
            name = obj.title
        elif obj.uid != None:
            if obj.visitor == None:
                name = obj.uid
            else:
                name = obj.vistor.name
        else:
            if obj.title == None:
                name = ''
                try:
                    if len(obj.participants.exclude(pk = self.context['request'].user.pk)) > 0:
                        name = obj.participants.exclude(pk = self.context['request'].user.pk)[0].first_name
                except:
                    pass
        # if obj.title == None:
        #     obj.title = ''
        return name
    def get_lastmsg(self , obj):

        return chatMessageSerializer(obj.messages.all().last(),many=False).data





class NotebookFullSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many=False , read_only=True)
    shares = userSearchSerializer(many=True , read_only=True)
    class Meta:
        model = notebook
        fields = ('created', 'title', 'source', 'shares', 'type', 'locked', 'user', 'pk')
        read_only_fields = ('shares' , )
    def create(self , validated_data):
        notesObj = notebook(**validated_data)
        user = self.context['request'].user
        notesObj.user = user
        notesObj.division = user.designation.division
        notesObj.save()
        return notesObj

    def update(self , instance, validated_data):
            if 'shares' in self.context['request'].data:
                instance.shares.clear()
                for sharedWith in self.context['request'].data['shares']:
                    instance.shares.add(User.objects.get(pk = sharedWith['pk']))
            if 'source' in self.context['request'].data:
                instance.source =  self.context['request'].data['source']
                instance.save()
            return instance



class NotesLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = notebook
        fields = ('pk', 'title')
