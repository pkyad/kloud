from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from HR.serializers import userSearchSerializer

from ERP.serializers import serviceLiteSerializer , serviceSerializer , addressSerializer
from rest_framework.response import Response
from fabric.api import *
import os
from django.conf import settings as globalSettings
from django.db.models import Q, F , Sum
import datetime
from marketing.models import TourPlanStop
from LMS.models import Course
# from assets.serializers import ContactProductsSerializer

class userMinLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk' , 'username' , 'email' , 'first_name' , 'last_name' )

class ContactLiteSerializer(serializers.ModelSerializer):
    company = serviceSerializer(many = False , read_only = True)
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male','isGst')
        read_only_fields = ( 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male', 'city' , 'street' , 'pincode' , 'country' , 'state','typ')


class ContactSerializer(serializers.ModelSerializer):
    company = serviceSerializer(many = False , read_only = True)
    courseCount = serializers.SerializerMethodField()
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'created' , 'updated' , 'company', 'email' , 'emailSecondary', 'mobile' , 'mobileSecondary' , 'designation' , 'notes' , 'linkedin', 'facebook', 'dp', 'male' , 'city' , 'street' , 'pincode' , 'country' , 'state','isGst','courseCount','typ')
        read_only_fields = ('user', )
    def create(self , validated_data):
        c = Contact(**validated_data)
        c.user = self.context['request'].user
        if 'company' in self.context['request'].data:
            c.company_id = int(self.context['request'].data['company'])
        c.save()
        return c
    def update(self ,instance, validated_data):
        for key in ['name', 'email' , 'emailSecondary', 'mobile' , 'mobileSecondary' , 'designation' , 'notes' , 'linkedin', 'facebook', 'dp', 'male', 'city' , 'street' , 'pincode' , 'country' , 'state','isGst','typ']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'company' in self.context['request'].data :
            compID = self.context['request'].data['company']
            if compID == "null" or compID == "":
                instance.company = None
            else:
                instance.company_id = int(compID)
        instance.save()
        return instance
    def get_courseCount(self , obj):
        from LMS.serializers import CourseSerializer
        data = CourseSerializer(obj.students.all(),many=True).data
        return len(data)

class ContactAllSerializer(serializers.ModelSerializer):
    company = serviceSerializer(many = False , read_only = True)
    products = serializers.SerializerMethodField()
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male','isGst','products')
        read_only_fields = ( 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male', 'city' , 'street' , 'pincode' , 'country' , 'state')
    def get_products(self , obj):
        objData = ContactProductsSerializer(obj.productContact.all(), many = True).data
        return objData


class DealLiteSerializer(serializers.ModelSerializer):
    contacts = ContactLiteSerializer(many = True , read_only = True)
    paidAmount = serializers.SerializerMethodField()
    pendingAmount = serializers.SerializerMethodField()
    overDueAmount = serializers.SerializerMethodField()
    class Meta:
        model = Deal
        fields = ('pk' , 'user' , 'company','value', 'currency', 'contacts' , 'internalUsers' ,'closeDate' , 'active', 'name','paidAmount','pendingAmount','overDueAmount')
    def get_paidAmount(self , obj):
        try:
            pAmt = Contract.objects.filter(deal=obj.pk,status='received').aggregate(tot=Sum('value'))
            pAmt = pAmt['tot'] if pAmt['tot'] else 0
        except:
            pAmt = 0
        return pAmt
    def get_pendingAmount(self , obj):
        try:
            pendAmt = Contract.objects.filter(deal=obj.pk,status='billed').aggregate(tot=Sum('value'))
            pendAmt = pendAmt['tot'] if pendAmt['tot'] else 0
        except:
            pendAmt = 0
        return pendAmt
    def get_overDueAmount(self , obj):
        try:
            odAmt = Contract.objects.filter(deal=obj.pk,status='billed',dueDate__lt=datetime.date.today()).aggregate(tot=Sum('value'))
            odAmt = odAmt['tot'] if odAmt['tot'] else 0
        except:
            odAmt = 0
        return odAmt

class DealSerializer(serializers.ModelSerializer):
    company = serviceLiteSerializer(many = False , read_only = True)
    contacts = ContactLiteSerializer(many = True , read_only = True)
    user = userMinLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Deal
        fields = ('pk' , 'user' , 'created' , 'updated' , 'company','value', 'currency', 'state', 'contacts' , 'internalUsers' , 'requirements' , 'probability' , 'closeDate' , 'active', 'name', 'result', 'contracts' , 'doc', 'duePeriod' , 'duePenalty','rate','billingType','deliveryTime')
        read_only_fields = ('user','contracts', 'internalUsers',)
    def create(self , validated_data):
        d = Deal(**validated_data)
        d.user = self.context['request'].user
        if 'company' in self.context['request'].data:
            d.company_id = int(self.context['request'].data['company'])
        d.save()
        if 'internalUsers' in self.context['request'].data:
            for c in self.context['request'].data['internalUsers']:
                d.internalUsers.add(User.objects.get(pk = c))
        if 'contacts' in self.context['request'].data:
            for c in self.context['request'].data['contacts']:
                d.contacts.add(Contact.objects.get(pk = c))
        return d

    def update(self ,instance, validated_data):
        for key in ['user','value', 'currency', 'state','requirements' , 'probability' , 'closeDate' , 'active', 'name', 'result', 'value','rate','billingType','deliveryTime']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass

        if 'user' in self.context['request'].data:
            instance.user = User.objects.get(pk = self.context['request'].data['user'])

        if 'company' in self.context['request'].data:
            instance.company_id = int(self.context['request'].data['company'])
        instance.save()
        if 'internalUsers' in self.context['request'].data:
            instance.internalUsers.clear()
            for c in self.context['request'].data['internalUsers']:
                instance.internalUsers.add(User.objects.get(pk = c))
        if 'contacts' in self.context['request'].data:
            instance.contacts.clear()
            for c in self.context['request'].data['contacts']:
                instance.contacts.add(Contact.objects.get(pk = c))
        return instance



class CRMTermsAndConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CRMTermsAndConditions
        fields = ('pk'  , 'created' , 'body', 'heading', 'default' , 'division','extraFieldOne','extraFieldTwo','isGst','companyPamphlet','themeColor','message','version','name' , 'prefix' , 'counter' , 'canSupplyOrder' , 'canInvoice')
    def create(self , validated_data):
        t = CRMTermsAndConditions(**validated_data)
        t.division = self.context['request'].user.designation.division
        t.save()
        return t

class ContractSerializer(serializers.ModelSerializer):
    termsAndCondition = CRMTermsAndConditionsSerializer(many = False, read_only = True)
    contact = ContactSerializer(many = False, read_only = True)
    class Meta:
        model = Contract
        fields = ('pk'  ,'user' , 'created' , 'updated', 'value','deal', 'status', 'details' , 'data', 'dueDate','billedDate','recievedDate','archivedDate','approvedDate','grandTotal','totalTax','read','frm','templateName','files','trackingCode','readDateAndTime','contact','termsAndCondition' , 'termsAndConditionTxts' , 'discount', 'heading' ,'uniqueId')
        read_only_fields = ('user',)
    def create(self , validated_data):
        c = Contract(**validated_data)
        c.user = self.context['request'].user
        if 'deal' in self.context['request'].data:
            c.deal_id = int(self.context['request'].data['deal'])
        if 'contact' in self.context['request'].data:
            c.contact_id = int(self.context['request'].data['contact'])
        if 'termsAndCondition' in self.context['request'].data:
            termsObj =  CRMTermsAndConditions.objects.get(pk = int(self.context['request'].data['termsAndCondition']))
            c.termsAndCondition = termsObj
            try:
                c.uniqueId = termsObj.prefix + str(termsObj.counter)
                termsObj.counter = termsObj.counter + 1
                termsObj.save()
            except:
                pass
        c.division = self.context['request'].user.designation.division
        c.save()
        contract = c
        user = self.context['request'].user
        grandTotal = c.grandTotal
        discount = c.discount
        data = c.data
        termsAndConditionTxts = c.termsAndConditionTxts
        heading = c.heading
        contObj = ContractTracker.objects.create(user = user , grandTotal = grandTotal , contract = contract , discount = discount, data = data , termsAndConditionTxts = termsAndConditionTxts , heading = heading)
        # if 'tour' in self.context['request'].data:
        #     tourObj = TourPlanStop.objects.get(pk = int(self.context['request'].data['tour']))
        #     tourObj.contract = c
        #     tourObj.save()
        return c
    def update(self ,instance, validated_data):
        for key in ['user' , 'created' , 'updated', 'value','deal', 'status', 'details' , 'data', 'dueDate','billedDate','recievedDate','archivedDate','approvedDate','grandTotal','totalTax','read','frm','templateName','files','trackingCode','readDateAndTime','contact','termsAndCondition', 'termsAndConditionTxts' , 'discount', 'heading','uniqueId']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        instance.user = self.context['request'].user
        if 'deal' in self.context['request'].data:
            instance.deal_id = int(self.context['request'].data['deal'])
        if 'contact' in self.context['request'].data:
            instance.contact_id = int(self.context['request'].data['contact'])
        # if 'termsAndCondition' in self.context['request'].data:
        #     instance.termsAndCondition = int(self.context['request'].data['termsAndCondition'])
        instance.save()
        # if 'tour' in self.context['request'].data:
        #     print 'tttttttttttttttttttttttttttttttttttttttttttttttttttoooooooooooooooooooooooo'
        #     tourObj = TourPlanStop.objects.get(pk = int(self.context['request'].data['tour']))
        #     tourObj.contract = instance
        #     tourObj.save()
        return instance

class ActivitySerializer(serializers.ModelSerializer):
    contacts = ContactLiteSerializer(many = True , read_only = True)
    contact = ContactLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Activity
        fields = ('pk'  ,'user' , 'created' , 'typ' , 'data', 'deal', 'contact', 'notes', 'doc' , 'contacts' , 'internalUsers')
        read_only_fields = ('user','contacts' , 'internalUsers')
    def create(self , validated_data):
        a = Activity(**validated_data)
        a.user = self.context['request'].user
        if 'contact' in self.context['request'].data:
            a.contact = Contact.objects.get(pk=self.context['request'].data['contact'])
        a.save()
        if 'internalUsers' in self.context['request'].data:
            for c in self.context['request'].data['internalUsers']:
                a.internalUsers.add(User.objects.get(pk = c))
        if 'contacts' in self.context['request'].data:
            for c in self.context['request'].data['contacts']:
                a.contacts.add(Contact.objects.get(pk = c))
        return a


class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ('pk'  ,'user' , 'created' , 'version' , 'title', 'description', 'filename', 'attachment','rawFiles')



class EmailTemplateSerializer(serializers.ModelSerializer):
    files = FilesSerializer(many = True , read_only = True)
    class Meta:
        model = EmailTemplate
        fields = ('pk'  ,'user' , 'created' , 'title', 'description', 'template' , 'files' , 'creator' )
    def create(self , validated_data):
        d = EmailTemplate(**validated_data)
        d.save()
        if 'files' in self.context['request'].data:
            for c in self.context['request'].data['files']:
                d.files.add(Files.objects.get(pk = c))
        d.save()
        return d
    def update(self ,instance, validated_data):
        for key in ['user' , 'created' , 'title', 'description', 'template' , 'files' , 'creator' ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'files' in self.context['request'].data:
            instance.files.clear()
            for c in self.context['request'].data['files']:
                instance.files.add(Files.objects.get(pk = c))
        instance.save()
        return instance



class LegalAgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalAgreement
        fields = ('pk'  ,'created', 'signed' , 'signedOn', 'title', 'deal' , 'sent' , 'sentOn' , 'signature' , 'authrizer' , 'witness1' , 'witness2' , 'effectiveDate' , 'effectiveDateEnd' , 'signedDoc')

class LegalAgreementTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalAgreementTerms
        fields = ('pk'  ,'parent', 'typ' , 'content')

class ContractTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractTracker
        fields = ('pk'  ,'created', 'grandTotal' , 'contract' , 'data' , 'discount' , 'termsAndConditionTxts' , 'heading')

class ConfigureTermsAndConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigureTermsAndConditions
        fields = ('pk'  , 'created' , 'body', 'heading' , 'default','prefix')
    def create(self , validated_data):
        t = ConfigureTermsAndConditions(**validated_data)
        try:
            t.division = self.context['request'].user.designation.division
        except:
            pass
        t.save()
        return t

class RegisteredProductsSerializer(serializers.ModelSerializer):
    completedServices = serializers.SerializerMethodField()
    class Meta:
        model = RegisteredProducts
        fields = ('pk'  ,'productName', 'period' , 'totalServices' , 'installationAddress' , 'pincode' , 'city' , 'state' , 'country' , 'startDate','completedServices')
    def get_completedServices(self , obj):
        count = obj.tickets.filter(status = 'completed').count()
        return count


class ServiceTicketSerializer(serializers.ModelSerializer):
    engineer = userMinLiteSerializer(many = False , read_only = True)
    allInvoices = serializers.SerializerMethodField()
    class Meta:
        model = ServiceTicket
        fields = ('pk'  ,'name' , 'phone' , 'email' , 'productName' , 'productSerial' , 'notes' , 'address' , 'pincode', 'city' , 'state' , 'country' , 'requireOnSiteVisit','referenceContact','preferredDate','preferredTimeSlot','warrantyStatus' , 'engineer' , 'serviceType','status','allInvoices','uniqueId')
    def create(self , validated_data):
        t = ServiceTicket(**validated_data)
        t.division = self.context['request'].user.designation.division
        t.save()
        if self.context['request'].data['referenceContact'] == None:
            contactObj = Contact.objects.create(user = self.context['request'].user, name = t.name, mobile = t.phone, email = t.email, street = t.address , pincode = t.pincode , state = t.state, country = t.country )
            t.referenceContact = contactObj
            t.save()
        return t
    def update(self ,instance, validated_data):
        for key in ['name' , 'phone' , 'email' , 'productName' , 'productSerial' , 'notes' , 'address' , 'pincode', 'city' , 'state' , 'country' , 'requireOnSiteVisit','preferredDate','preferredTimeSlot' , 'status', 'serviceType','engineer','warrantyStatus' ,'uniqueId']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'engineer' in  self.context['request'].data:
            instance.engineer = User.objects.get(pk = int(self.context['request'].data['engineer']))
        instance.save()
        return instance
    def get_allInvoices(self , obj):
        allData = []
        lastDate =  datetime.datetime.now()
        if obj.closedOn is not None:
            lastDate = obj.closedOn
        if obj.referenceContact is not None:
            allData = Contract.objects.filter(created__range = [obj.created , lastDate], contact = obj.referenceContact).values('pk' , 'heading')
        return allData
