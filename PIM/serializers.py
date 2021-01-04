from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from ERP.zoomapi import *
from ERP.models import service
from marketing.models import  Contacts
from clientRelationships.models import Contact
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

