from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from HR.serializers import userSearchSerializer
from organization.serializers import DivisionSerializer
from ERP.models import service
from ERP.serializers import serviceSerializer
from ERP.serializers import serviceLiteSerializer
from rest_framework.response import Response
from fabric.api import *
import os
from django.conf import settings as globalSettings
import datetime
from django.contrib.auth.hashers import make_password,check_password
from django.core.exceptions import SuspiciousOperation
from django.db.models import Q,Count ,F,Sum
from django.db.models import CharField,FloatField, Value , Func, PositiveIntegerField
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage

class ProductsSerializer(serializers.ModelSerializer):
    total_quantity = serializers.SerializerMethodField()
    class Meta:
        model = Products
        fields = ('pk', 'created', 'part_no','description_1','description_2','replaced','customs_no','parent','weight','price','sheet','bar_code','custom','gst','total_quantity','division')
    def create(self,validated_data):
        user = self.context['request'].user
        divisionObj = user.designation.division
        obj = Products(**validated_data)
        obj.division = divisionObj
        obj.save()
        return obj
    def update (self, instance, validated_data):
        for key in ['part_no','description_1','description_2','replaced','customs_no','parent','weight','price','sheet','bar_code','custom','gst','total_quantity']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        user = self.context['request'].user
        divisionObj = user.designation.division
        instance.division = divisionObj
        instance.save()
        return instance


    def get_total_quantity(self , obj):
        qty = 0
        inventory = Inventory.objects.filter(product=obj.pk)
        qty = sum(i.qty for i in inventory)
        if qty>0:
            return qty
        else:
            return 0

class ProductSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSheet
        fields = ('pk','created','sheet','file_name')


class VendorSerializer(serializers.ModelSerializer):
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = Vendor
        fields = ('pk','created','name' ,'personName' , 'city','street','state','pincode','country','mobile','gst','email','division')

    def create(self,validated_data):
            user = self.context['request'].user
            divisionObj = user.designation.division
            obj = Vendor(**validated_data)
            obj.division = divisionObj
            obj.save()
            return obj


class ProjectsSerializer(serializers.ModelSerializer):
    service = serviceLiteSerializer(many = False , read_only = True)
    vendor = VendorSerializer(many = False , read_only = True)
    total_po = serializers.SerializerMethodField()
    total_material = serializers.SerializerMethodField()
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = Projects
        fields  = ('pk', 'created', 'title', 'service', 'date', 'responsible','machinemodel','comm_nr','quote_ref','enquiry_ref','approved1','approved2','approved1_user','approved2_user','approved1_date','approved2_date','status','revision','savedStatus','invoiceValue','insurance','freight','assessableValue','gst1','gst2','clearingCharges1','clearingCharges2','packing','vendor','exRate','poNumber','invoiceNumber','boeRefNumber','profitMargin','quoteRefNumber','quoteValidity','terms','termspo','delivery','paymentTerms','junkStatus','poDate','quoteDate','shipmentMode','shipmentDetails','weightValue','paymentTerms1','total_po','total_material','quoteNotes','poNotes','currency','grnDate','flag','division')

    def create(self , validated_data):
        p = Projects()
        user = self.context['request'].user
        divisionObj = user.designation.division
        if 'service' in self.context['request'].data:
            p.service = service.objects.get(pk=int(self.context['request'].data['service']))
        if 'title' in self.context['request'].data:
            p.title = self.context['request'].data['title']
        if 'machinemodel' in self.context['request'].data:
            p.machinemodel = self.context['request'].data['machinemodel']
        if 'comm_nr' in self.context['request'].data:
            p.comm_nr = self.context['request'].data['comm_nr']
        if 'quote_ref' in self.context['request'].data:
            p.quote_ref = self.context['request'].data['quote_ref']
        if 'enquiry_ref' in self.context['request'].data:
            p.enquiry_ref = self.context['request'].data['enquiry_ref']
        if 'date' in self.context['request'].data:
            p.date = self.context['request'].data['date']
        if 'revision' in self.context['request'].data:
            p.revision = self.context['request'].data['revision']
        if 'vendor' in self.context['request'].data:
            p.vendor = Vendor.objects.get(pk=int(self.context['request'].data['vendor']))
        if 'flag' in self.context['request'].data:
            p.flag = self.context['request'].data['flag']
        p.division = divisionObj
        p.save()
        if 'responsible' in self.context['request'].data:
            for i in self.context['request'].data['responsible']:
                p.responsible.add(User.objects.get(pk = i))
            p.save()
        return p

    def update (self, instance, validated_data):
        for key in ['title','status','approved2' ,'comm_nr', 'approved2_date','approved2_user','quote_ref','enquiry_ref','machinemodel','approved1','approved1_user','approved1_date','revision','savedStatus','invoiceValue','packing','insurance','freight','assessableValue','gst1','gst2','clearingCharges1','clearingCharges2','exRate','profitMargin','invoiceNumber','boeRefNumber','poNumber','quoteRefNumber','quoteValidity','terms','termspo','delivery','paymentTerms','junkStatus','poDate','quoteDate','shipmentMode','shipmentDetails','weightValue','paymentTerms1','total_po','total_material','quoteNotes','poNotes','currency','grnDate']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'responsible' in self.context['request'].data:
            instance.responsible.clear()
            for i in self.context['request'].data['responsible']:
                instance.responsible.add(User.objects.get(pk = i))
        if 'service' in self.context['request'].data:
            instance.service = service.objects.get(pk=int(self.context['request'].data['service']))
        if 'vendor' in self.context['request'].data:
            instance.vendor = Vendor.objects.get(pk=int(self.context['request'].data['vendor']))
        if 'date' in self.context['request'].data:
            instance.date = self.context['request'].data['date']

        instance.save()
        return instance
    def get_total_po(self , obj):
        bomObj = BoM.objects.filter(project=obj.pk)
        total = 0
        total= sum(i.landed_price * i.quantity2 for i in bomObj)
        if total>0:
            return round(total,2)
        else:
            return 0
    def get_total_material(self , obj):
        materialObj = MaterialIssueMain.objects.filter(project=obj.pk)
        total = 0
        for i in materialObj:
            matObj = i.materialIssue.all()
            total+= sum(j.price*j.qty for j in matObj)
        if total>0:
            return round(total,2)
        else:
            return 0

class BoMSerializer(serializers.ModelSerializer):
    products = ProductsSerializer(many = False , read_only = True)
    project =  ProjectsSerializer(many = False  , read_only =True)
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = BoM
        fields = ('pk','created','user' , 'products','project','quantity1','quantity2','price','landed_price','invoice_price','customer_price','gst','custom','customs_no',
        'division')

    def create(self, validated_data):
        user = self.context['request'].user
        divisionObj = user.designation.division
        b = BoM(**validated_data)
        b.division = divisionObj
        if 'products' in self.context['request'].data:
            b.products = Products.objects.get(pk=int(self.context['request'].data['products']))
            print b.products,'bbbbbbbbb'
        b.save()
        if 'project' in self.context['request'].data:
            b.project = Projects.objects.get(pk=int(self.context['request'].data['project']))
        b.quantity2 = int(self.context['request'].data['quantity1'])
        b.save()
        return b
    def update (self, instance, validated_data):
        for key in ['pk','created','user' , 'products','project','quantity1','quantity2','price','landed_price','invoice_price','customer_price','gst','custom','customs_no']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        return instance

class InventorySerializer(serializers.ModelSerializer):
    product = ProductsSerializer(many = False , read_only = True)
    project =  ProjectsSerializer(many = False  , read_only =True)
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = Inventory
        fields = ('pk','created','product','qty','rate','project','addedqty','division')
    def create(self, validated_data):
        user = self.context['request'].user
        divisionObj = user.designation.division
        b = Inventory(**validated_data)

        if 'product' in self.context['request'].data:
            b.product = Products.objects.get(pk=int(self.context['request'].data['product']))

        if 'project' in self.context['request'].data:
            b.project = Projects.objects.get(pk=int(self.context['request'].data['project']))

        b.division = divisionObj
        b.save()
        return b
    def update (self, instance, validated_data):
        for key in ['pk','created','product','qty','rate','project','addedqty','division']:
            user = self.context['request'].user
            divisionObj = user.designation.division
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.division = divisionObj
        instance.save()
        return instance

class MaterialIssueSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False , read_only =True )
    class Meta:
        model = MaterialIssue
        fields = ('pk','created','product','qty','price','division')
    def create(self, validated_data):
        user = self.context['request'].user
        divisionObj = user.designation.division
        print divisionObj,"materialissue...................mmmmmmmmmmmm"
        b = MaterialIssue(**validated_data)
        if 'product' in self.context['request'].data:
            b.product = Products.objects.get(pk=int(self.context['request'].data['product']))
        b.division = divisionObj
        b.save()
        return b


class MaterialIssueMainSerializer(serializers.ModelSerializer):
    materialIssue = MaterialIssueSerializer(many = True , read_only = True)
    project = ProjectsSerializer(many = False , read_only = True)
    user = userSearchSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False, read_only = True)
    class Meta:
        model = MaterialIssueMain
        fields = ('pk','created','project','materialIssue','user','division')
    def create(self, validated_data):
        b = MaterialIssueMain()
        user = self.context['request'].user
        divisionObj = user.designation.division
        if 'materialIssue' in self.context['request'].data:
            for i in self.context['request'].data['materialIssue']:
                materialIssue.add(MaterialIssue.objects.get(pk = i))
            b.save()
        if 'project' in self.context['request'].data:
            b.project = Projects.objects.get(pk=int(self.context['request'].data['project']))
        if 'user' in self.context['request'].data:
            b.user = User.objects.get(pk=int(self.context['request'].data['user']))
        b.division = divisionObj
        b.save()
        return b
    def update (self, instance, validated_data):
        for key in ['pk','created','project','materialIssue','user']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'materialIssue' in self.context['request'].data:
            for i in self.context['request'].data['materialIssue']:
                materialIssue.add(MaterialIssue.objects.get(pk = i))
            instance.save()
        if 'project' in self.context['request'].data:
            instance.project = Projects.objects.get(pk=int(self.context['request'].data['project']))
        if 'user' in self.context['request'].data:
            instance.user = User.objects.get(pk=int(self.context['request'].data['user']))
        instance.save()
        return instance

class StockCheckSerializer(serializers.ModelSerializer):
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = StockCheck
        fields = ('pk','date','inventory','count','status','false','division')

    def create(self, validated_data):
        s = StockCheck(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        s.division = divisionObj
        s.save()
        return s

class StockCheckLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockCheckLog
        fields = ('pk','product')

class StockSummaryReportSerializer(serializers.ModelSerializer):
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = StockSummaryReport
        fields = ('pk','created','dated','stockValue','division')
    def create(self,validated_data):
        stock = StockSummaryReport(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        stock.division = divisionObj
        stock.save()

class ProjectStockSummarySerializer(serializers.ModelSerializer):
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = ProjectStockSummary
        fields = ('pk','created','stockReport','value','title','comm_nr','flag','division')
    def create(self,validated_data):
        proj = ProjectStockSummary(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        proj.division = divisionObj
        proj.save()

class InvoiceSerializer(serializers.ModelSerializer):
    project = ProjectsSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False ,read_only = True)
    class Meta:
        model = Invoice
        fields = ('pk','created','invoiceNumber','invoiceDate','poNumber','insuranceNumber','transporter','lrNo','billName','shipName','billAddress','shipAddress','billGst','shipGst','billState','shipState','billCode','shipCode','isDetails','invoiceTerms','project','flag','division','comm_nr','packing',
        'lockInvoice','machinemodel')
    def create(self, validated_data):
        i = Invoice(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        i.division  = divisionObj
        if 'project' in self.context['request'].data:
            i.project = Projects.objects.get(pk=int(self.context['request'].data['project']))
        i.save()
        return i
    def update (self, instance, validated_data):
        for key in ['pk','created','invoiceNumber','invoiceDate','poNumber','insuranceNumber','transporter','lrNo','billName','shipName','billAddress','shipAddress','billGst','shipGst','billState','shipState','billCode','shipCode','isDetails','invoiceTerms','project','comm_nr','packing','lockInvoice','machinemodel']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'project' in self.context['request'].data:
            instance.project = Projects.objects.get(pk=int(self.context['request'].data['project']))
        instance.save()
        return instance

class InvoiceQtySerializer(serializers.ModelSerializer):
    # product = ProductsSerializer(many = False , read_only = True)
    invoice = InvoiceSerializer(many = False , read_only = True)
    class Meta:
        model = InvoiceQty
        fields = ('pk','created','product','invoice','customs_no','part_no','description_1','price','qty','taxableprice','cgst','cgstVal','sgst','sgstVal','igst','igstVal','total')
    def create(self, validated_data):
        i = InvoiceQty(**validated_data)
        if 'product' in self.context['request'].data:
            i.product = Products.objects.get(pk=int(self.context['request'].data['product']))
        if 'invoice' in self.context['request'].data:
            i.invoice = Invoice.objects.get(pk=int(self.context['request'].data['invoice']))
        i.save()
        return i
    def update (self, instance, validated_data):
        for key in ['pk','created','product','invoice','customs_no','part_no','description_1','price','qty','taxableprice','cgst','cgstVal','sgst','sgstVal','igst','igstVal','total']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'product' in self.context['request'].data:
            instance.product = Products.objects.get(pk=int(self.context['request'].data['product']))
        if 'invoice' in self.context['request'].data:
            instance.invoice = Invoice.objects.get(pk=int(self.context['request'].data['invoice']))
        instance.save()
        return instance

class DeliveryChallanSerializer(serializers.ModelSerializer):
    materialIssue = MaterialIssueMainSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model = DeliveryChallan
        fields = ('pk','created','materialIssue','customername','customeraddress','customergst','heading','challanNo','challanDate','deliveryThr','refNo','apprx','notes','flag','division')
    def create(self, validated_data):
        i = DeliveryChallan(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        i.division = divisionObj
        if 'materialIssue' in self.context['request'].data:
            i.materialIssue = MaterialIssueMain.objects.get(pk=int(self.context['request'].data['materialIssue']))
        i.save()
        return i
    def update (self, instance, validated_data):
        for key in ['pk','created','materialIssue','customername','customeraddress','customergst','heading','challanNo','challanDate','deliveryThr','refNo','apprx','notes']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'materialIssue' in self.context['request'].data:
            instance.materialIssue = MaterialIssueMain.objects.get(pk=int(self.context['request'].data['materialIssue']))
        instance.save()
        return instance

class StockCheckReportSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False,read_only = True)
    class Meta:
        model = StockCheckReport
        fields = ('pk','created','user','flag','division')
        read_only_fields = ('user',)
    def create(self , validated_data):
        s = StockCheckReport(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        s.user = user
        s.division = divisionObj
        s.save()
        return s


class StockCheckItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(many = False , read_only = True)
    stockReport = StockCheckReportSerializer(many = False , read_only = True)
    class Meta:
        model = StockCheckItem
        fields = ('pk','product','qty','matching','stockReport','flag')
    def create(self , validated_data):
        s = StockCheckItem(**validated_data)
        if 'product' in self.context['request'].data:
            s.product = Products.objects.get(pk=int(self.context['request'].data['product']))
            try:
                count = 0
                matobj = Inventory.objects.filter(product__id = self.context['request'].data['product'],project__flag = self.context['request'].data['flag'])
                count =  matobj.aggregate(total=Sum(F('qty'),output_field=PositiveIntegerField())).get('total',0)
                print self.context['request'].data['qty'] ,self.context['request'].data['flag'], count,'dddddddddddddd'
                if int(self.context['request'].data['qty']) == int(count):
                    s.matching = True
                else:
                    s.matching = False
                s.save()
            except:
                s.matching = False
        print s.matching
        if 'stockReport' in self.context['request'].data:
            s.stockReport = StockCheckReport.objects.get(pk=int(self.context['request'].data['stockReport']))
        s.save()
        return s
    def update (self, instance, validated_data):
        for key in ['pk','product','qty','matching','stockReport','flag']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'product' in self.context['request'].data:
            instance.product = Products.objects.get(pk=int(self.context['request'].data['product']))
            try:
                count = 0
                matobj = Inventory.objects.filter(product__id = self.context['request'].data['product'])
                count =  matobj.aggregate(total=Sum(F('qty'),output_field=PositiveIntegerField())).get('total',0)
                print self.context['request'].data['qty'] , count,'dddddddddddddd'
                if int(self.context['request'].data['qty']) == int(count):
                    instance.matching = True
                else:
                    instance.matching = False
            except:
                instance.matching = False
        if 'stockReport' in self.context['request'].data:
            instance.stockReport = StockCheckReport.objects.get(pk=int(self.context['request'].data['stockReport']))
        instance.save()
        return instance
class complaintManagementSerializer(serializers.ModelSerializer):
    customer = serviceLiteSerializer(many = False , read_only = True)
    registeredBy = userSearchSerializer(many = False , read_only = True)
    closedBy = userSearchSerializer(many = False , read_only = True)
    division = DivisionSerializer(many = False , read_only = True)
    class Meta:
        model  = ComplaintManagement
        fields = ('pk','date','customer','contact','complaintRef','machine','description','complaintType',
        'registeredBy',
        'errorCode','status','is_CloseApproved','serviceReportNo','closedBy','attr1','attr2','attr3','attr4','division','closedDate','RefurbishedBind',"machineRunning","comm_nr")
    def create(self, validated_data):
        obj = ComplaintManagement(**validated_data)
        user = self.context['request'].user
        divisionObj = user.designation.division
        data = self.context['request'].data
        if 'customer' in data:
            obj.customer = service.objects.get(pk = int(data['customer']))

        obj.registeredBy = user
        obj.division = divisionObj
        obj.save()

        # sending email
        customer = obj.customer.name
        machine = obj.machine
        errorCode = obj.errorCode
        date = obj.date
        registeredBy = obj.registeredBy.first_name
        description = obj.description
        to_email = ['raj@cioc.co.in']
        # users = User.objects.filter(designation__division = divisionObj)
        # for item in users:
        #     to_email.append(item.email)
        ctx = {
            'recieverName' : "Hi Sir/Ma'am",
            'customer':customer,
            'machine':machine,
            'errorCode':errorCode,
            'date':date,
            'registeredBy':registeredBy,
            'description':description,
            'obj': obj,
        }
        email_subject = 'New complaint : {0} - {1}'.format(customer,obj.comm_nr)
        email_body = get_template('app.importexport.complaint.notification.html').render(ctx)
        msg = EmailMessage(email_subject, email_body, to = to_email)
        msg.content_subtype = 'html'
        msg.send()
        return obj

    def update (self, instance, validated_data):
        user = self.context['request'].user
        divisionObj = user.designation.division
        for key in ['date','customer','contact','complaintRef','machine','description','complaintType','registeredBy',
        'errorCode','status','is_CloseApproved','serviceReportNo','closedBy','attr1','attr2','attr3','closedDate','RefurbishedBind',"machineRunning","comm_nr","attr4"]:
            try:
                setattr(instance,key,validated_data[key])
            except:
                pass
        data = self.context['request'].data
        if 'customer' in data:
            instance.customer = service.objects.get(pk = int(data['customer']))
            print(instance.customer)
        if 'registeredBy' in data:
            instance.registeredBy = User.objects.get(pk = int(data['registeredBy']))
        if 'closedBy' in data:
            instance.closedBy = User.objects.get(pk = int(data['closedBy']))

        instance.save()
        return instance
