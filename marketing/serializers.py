from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from HR.serializers import userSearchSerializer
from projects.serializers import mediaSerializer
from rest_framework.response import Response
from fabric.api import *
import os
import json
import operator
from django.db.models import Q
from django.conf import settings as globalSettings
from datetime import date,timedelta, datetime
from dateutil.relativedelta import relativedelta
from django.core.mail import send_mail , EmailMessage
from projects.models import media
from finance.serializers import SaleLiteSerializer
import pytz
from HR.serializers import TeamSerializer
from PIM.models import calendar
from finance.models import Account
from clientRelationships.models import Contact
from finance.serializers import ExpenseSheetSerializer



class CampaignLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignLogs
        fields = ('pk' , 'created' , 'user' , 'contact', 'campaign', 'data' , 'typ' , 'followupDate' , 'recording' , 'recording2')
    def create(self , validated_data):
        print self.context['request'].data,validated_data
        c = CampaignLogs(**validated_data)
        c.user = self.context['request'].user
        c.contact = Contacts.objects.get(pk = self.context['request'].data['contact'])
        if 'campaign' in self.context['request'].data:
            c.campaign = Campaign.objects.get(pk = self.context['request'].data['campaign'])
        c.save()
        return c

class TagSerializer(serializers.ModelSerializer):
    tagsCount = serializers.SerializerMethodField()
    class Meta:
        model = Tag
        fields = ('pk' , 'created' , 'name' ,'tagsCount')
    def get_tagsCount(self,obj):
        if 'request' not in self.context:
            return 0
        if 'fd' in self.context['request'].GET and len(self.context['request'].GET['fd']) > 0:
            fromDate = self.context['request'].GET['fd'].split('-')
            toDate = self.context['request'].GET['td'].split('-')
            print fromDate,toDate
            fd = date(int(fromDate[0]), int(fromDate[1]), int(fromDate[2]))
            td = date(int(toDate[0]), int(toDate[1]), int(toDate[2]))
            print fd,td,obj.contacts_set.filter(created__range=(fd,td))
            return obj.contacts_set.filter(created__range=(str(fd),str(td))).count()
        else:
            return obj.contacts.all().count()

class ContactsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True,read_only=True)
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
            contatcObj.save()

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
        contatcObj.contact_ref = newContact
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

        if instance.contact_ref == None:
            newContact = Contact.objects.create(mobile = instance.mobile, user=self.context['request'].user)
        else:
            newContact = Contact.objects.get(pk = instance.contact_ref.pk)
        newContact.name = instance.name
        newContact.email = instance.email
        newContact.mobile = instance.mobile
        newContact.street = instance.addrs
        newContact.city = instance.city
        newContact.state = instance.state
        newContact.country = instance.country
        newContact.pincode = instance.pinCode
        newContact.save()
        instance.contact_ref = newContact
        instance.save()
        return instance
    # def get_remaining(self,obj):
    #     from pytz import timezone
    #     if obj.slot!=None:
    #         slot = obj.slot.split(' ')[0]
    #         if obj.slot.split(' ')[1] == 'PM':
    #             slot = int(slot) + 12
    #         now = 0
    #         now = datetime.now(pytz.timezone('Asia/Kolkata'))
    #         dated = obj.date.strftime('%Y-%m-%dT%H:%M:%S.%f')
    #         dated = datetime.strptime(dated,'%Y-%m-%dT%H:%M:%S.%f')
    #         dated = dated.replace(hour = int(slot))
    #         dated = dated.replace(tzinfo=None)
    #         now = now.replace(tzinfo=None)
    #         remaining = dated - now
    #         return str(remaining)
    #     else:
    #         return 0

class ContactsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = ('pk' , 'created'  , 'name', 'email', 'mobile' , 'source' , 'pinCode'  , 'addrs', 'city', 'state', 'country')

class CampaignSerializer(serializers.ModelSerializer):
    itemCount = serializers.SerializerMethodField()
    intersted = serializers.SerializerMethodField()
    inProcess = serializers.SerializerMethodField()
    mailStats = serializers.SerializerMethodField()
    # totalTask = serializers.SerializerMethodField()
    team = TeamSerializer(many = False , read_only = True)
    class Meta:
        model = Campaign

        fields = ('pk' , 'created' ,'updated',  'name', 'status' , 'typ'  , 'msgBody' , 'emailSubject' , 'emailBody' , 'directions', 'itemCount',  'emailTemplate' , 'limitPerDay'  , 'team' , 'lead' , 'followUpText1','followUpText2','followUpText3','followUpText4','inProcess','intersted','mailStats')
    def create(self , validated_data):
        print self.context['request'].data,validated_data
        c = Campaign(**validated_data)
        # if 'participants' in self.context['request'].data:
        #     instance.participants.clear()
        #     for i in self.context['request'].data['participants']:
        #         c.participants.add(User.objects.get(pk = int(i)))
        c.save()
        if 'team' in self.context['request'].data:
            c.team = Team.objects.get(pk = int(self.context['request'].data['team']))
        c.save()
        return c
    def get_itemCount(self , obj):
        data =None
        if obj.typ =='email':
            data = obj.emailitems.all().count()
        if obj.typ =='call':
            data = obj.callitems.all().count()
        return data
    #
    def get_inProcess(self , obj):
        data =None
        if obj.typ=="call":
            data = obj.callitems.filter(attempted = True).count()
        return data
    #
    def get_intersted(self , obj):
        data =None
        if obj.typ=="call":
            data = obj.callitems.filter(status = 'interested').count()
        return data

    # def get_totalTask(self , obj):
    #     added =  obj.items.all().count()
    #     otherPk = Campaign.objects.filter(parent = obj).values_list('pk' , flat = True)
    #     other = CampaignItem.objects.filter(campaign__in = otherPk).count()
    #     total = int(added) + int(other)
    #     data = {'total' : total , 'assigned' : other ,'balance' : added }
    #     return data

    def update(self ,instance, validated_data):
        print validated_data,self.context['request'].data,instance.pk
        for key in ['name' , 'status' , 'typ' , 'msgBody' , 'emailSubject' , 'emailBody' , 'directions', 'emailTemplate', 'limitPerDay' , 'lead']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'team' in self.context['request'].data:
            instance.team = Team.objects.get(pk = int(self.context['request'].data['team']))

        if 'emailTemplate' not in self.context['request'].data:
            instance.emailTemplate = None
        else:
            instance.emailBody = None
        instance.save()


        return instance

    def get_mailStats(self , obj):
        if obj.typ=='email':
            qs = EmailCampaignItem.objects.filter(campaign = obj)
            total = qs.count()
            sent = qs.filter(emailed = True).count()
            opned = qs.filter(opened = True).count()
            clicked = 0

            if total ==0:
                return None

            if sent == 0:
                return {'total': total , 'sent' : sent , 'sentPercent':(sent/float(total))*100 , 'opened' : opned , 'openedPercent' : 0 , 'clicked' : clicked , 'clickedPercent' : 0 }
            else:
                return {'total': total , 'sent' : sent , 'sentPercent':(sent/float(total))*100 , 'opened' : opned , 'openedPercent' : (opned/float(sent))*100 , 'clicked' : clicked , 'clickedPercent' : (clicked/float(sent))*100 }

class CallCampaignItemSerializer(serializers.ModelSerializer):
    contact = ContactsSerializer(many=False,read_only=True)
    class Meta:
        model = CallCampaignItem
        fields = ('pk' , 'created','updated', 'contact','campaign','status','attempted','attempt','followUp','followUpDate','owner','skipped')

    def update(self ,instance, validated_data):
        for key in  ['contact','campaign','status','attempted','attempt','followUp','followUpDate','owner','skipped']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass

        print 'validated_data', validated_data
        instance.save()
        if 'followUp' in self.context['request'].data:
            if self.context['request'].data['followUp']:
                calendarObj = calendar.objects.create(when = instance.followUpDate,campaignItem = instance,orginatedBy = instance.campaign.lead,contacts = instance.contact)

                calendarObj.text = 'Follow up call for %s'%(instance.contact.name)
                calendarObj.save()

        instance.save()
        return instance


class EmailCampaignItemSerializer(serializers.ModelSerializer):
    contact = ContactsSerializer(many=False,read_only=True)
    class Meta:
        model = EmailCampaignItem
        fields = ('pk' , 'created','updated', 'contact','campaign','emailed','opened','openedTime','key','read','slot','context','subject1','body1','subject2','body2','subject3','body3','subject4','body4','subject5','body5','level')

    def update(self ,instance, validated_data):
        for key in  ['contact','campaign','emailed','opened','openedTime','key','read','slot','context','subject1','body1','subject2','body2','subject3','body3','subject4','body4','subject5','body5','level']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass

        instance.save()


        return instance

class  TourPlanSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many=False,read_only=True)
    class Meta:
        model =  TourPlan
        fields=('pk','date','user','ta','da','amount','approved','attachment','status')
    def create(self , validated_data):
        t = TourPlan(**validated_data)
        if 'user' in self.context['request'].data:
            t.user = User.objects.get(pk=int(self.context['request'].data['user']))
        t.save()
        return t

class  TourPlanStopSerializer(serializers.ModelSerializer):
    contact = ContactsSerializer(many=False,read_only=True)
    tourplan = TourPlanSerializer(many = False , read_only = True)
    beforePic = mediaSerializer(many = True , read_only = True)
    afterPic = mediaSerializer(many = True , read_only = True)
    expense = ExpenseSheetSerializer(many = False , read_only = True)
    logs = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    class Meta:
        model =  TourPlanStop
        fields=('pk','created','contact','timeslot','tourplan','comments','beforePic','afterPic','status','audio_files','call_audio_files','logs','general_comment','visitType','remaining','techStatus','techIncentive','expense','contract','serviceName')
    def create(self , validated_data):
        i = TourPlanStop(**validated_data)
        i.save()
        if 'contact' in self.context['request'].data:
            i.contact = Contacts.objects.get(pk=int(self.context['request'].data['contact']))
        if 'tourplan' in self.context['request'].data:
            i.tourplan = TourPlan.objects.get(pk=int(self.context['request'].data['tourplan']))
        try:
            i.division = self.context['request'].user.designation.division
        except:
            pass
        i.save()
        return i
    def update(self ,instance, validated_data):
        for key in ['timeslot','comments','beforePic','afterPic','general_comment','status','visitType','techStatus','techIncentive','serviceName']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        if 'contact' in self.context['request'].data:
            instance.contact = Contacts.objects.get(pk=int(self.context['request'].data['contact']))
        if 'tourplan' in self.context['request'].data:
            instance.tourplan = TourPlan.objects.get(pk=int(self.context['request'].data['tourplan']))
        if 'beforePic' in self.context['request'].data:
            instance.beforePic.clear()
            for m in self.context['request'].data['beforePic']:
                instance.beforePic.add(media.objects.get(pk = int(m)))
        if 'afterPic' in self.context['request'].data:
            instance.afterPic.clear()
            for m in self.context['request'].data['afterPic']:
                instance.afterPic.add(media.objects.get(pk = int(m)))
        if 'general_comment' in self.context['request'].data:
            logObj = Log.objects.create(txt = self.context['request'].data['general_comment'], type ='text' , plan = instance )
            logObj.save()
        if 'status' in self.context['request'].data:
            if self.context['request'].data['status'] == 'completed':
                contactObj = instance.contact
                if contactObj.contact_ref is None:
                    newContact = Contact.objects.create(name = contactObj.name , email = contactObj.email , mobile = mobile, street =  contactObj.addrs , city =  contactObj.city , state =  contactObj.state , country = contactObj.country, pincode =  contactObj.pinCode )
                    contactObj.contact_ref = newContact
                contactObj.save()
        instance.save()
        return instance
    def get_logs(self,obj):
        return LogSerializer(obj.TourPlanStop.all(), many = True).data
    def get_remaining(self,obj):
        from pytz import timezone
        slot = obj.timeslot.split(' ')[0]
        if obj.timeslot.split(' ')[1] == 'PM':
            slot = int(slot) + 12
        now = 0
        now = datetime.now(pytz.timezone('Asia/Kolkata'))
        dated = obj.tourplan.date.strftime('%Y-%m-%dT%H:%M:%S.%f')
        dated = datetime.strptime(dated,'%Y-%m-%dT%H:%M:%S.%f')
        dated = dated.replace(hour = int(slot))
        dated = dated.replace(tzinfo=None)
        now = now.replace(tzinfo=None)
        remaining = dated - now
        return str(remaining)


class  TourPlanStopLiteSerializer(serializers.ModelSerializer):
    contact = ContactsLiteSerializer(many=False,read_only=True)
    beforePic = mediaSerializer(many = True , read_only = True)
    afterPic = mediaSerializer(many = True , read_only = True)
    invoice = SaleLiteSerializer(many = False , read_only = True)
    tourplan = TourPlanSerializer(many = False , read_only = True)
    class Meta:
        model =  TourPlanStop
        fields=('pk','created','contact','timeslot','tourplan','comments','beforePic','afterPic', 'invoice' , 'visitType','status','techStatus','addrs' , 'pinCode' , 'city' , 'state' , 'country')

class  TourPlanLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model =  TourPlan
        fields=('pk','date','user')

class  TourPlanStopPendingSerializer(serializers.ModelSerializer):
    tourplan = TourPlanLiteSerializer(many = False , read_only = True)
    class Meta:
        model =  TourPlanStop
        fields=('pk','timeslot','tourplan','comments', 'visitType')


class CampaignTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model =  CampaignTracker
        fields=('pk','campaignId','read','sent','to','slot', 'template', 'context','open', 'name','subject')
