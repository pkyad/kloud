from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from gitweb.serializers import repoLiteSerializer
from ERP.serializers import serviceSerializer,ServiceLiteSerializer
from ERP.models import service
from projects.models import *
from projects.serializers import projectLiteSerializer
from datetime import datetime
from HR.serializers import userSearchSerializer, userSerializer
from HR.models import designation
from clientRelationships.models import *
from django.db.models import Q, F , Sum , FloatField
from organization.serializers import *
from organization.serializers import UnitsLiteSerializer,DivisionSerializer
from organization.models import Division , Unit
from assets.serializers import CheckinLiteSerializer
from assets.models import *
from payroll.models import  Advances
from ERP.initializing import *

class TermsAndConditionsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsAndConditions
        fields = ('pk'  , 'created' , 'body', 'heading', 'default' , 'division' , 'prefix' , 'typ')



class TermsAndConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsAndConditions
        fields = ('pk' , 'created' , 'body', 'heading' , 'default', 'division','prefix' , 'typ')

    def create(self , validated_data):
        t = TermsAndConditions(**validated_data)
        t.division = self.context['request'].user.designation.division
        t.save()
        return t
    def update(self ,instance, validated_data):
        for key in ['body', 'heading' , 'prefix' , 'typ']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'default' in self.context['request'].data:
            if self.context['request'].data['default']:
                TermsAndConditions.objects.filter(division = self.context['request'].user.designation.division).update(default = False)

            instance.default = self.context['request'].data['default']

        instance.division = self.context['request'].user.designation.division
        instance.save()
        return instance

class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data



class AccountSerializer(serializers.ModelSerializer):
    contactPerson = userSearchSerializer(many=False,read_only=True)
    authorizedSignaturies = userSearchSerializer(many=True,read_only=True)
    totalExp = serializers.SerializerMethodField()
    class Meta:
        model = Account
        fields = ('pk', 'personal','title', 'created' , 'number' , 'ifsc' , 'bank'  , 'bankAddress' , 'contactPerson' , 'authorizedSignaturies','balance','totalExp','heading','group')
        read_only_fields = ('contactPerson','authorizedSignaturies','division')

    def create(self , validated_data):
        acc = Account(**validated_data)
        acc.contactPerson = self.context['request'].user
        try:
            acc.division = self.context['request'].user.designation.division
        except:
            pass
        acc.contactPerson.save()
        print acc,'98898988989'
        acc.save()
        if 'authorizedSignaturies' in self.context['request'].data:
            acc.authorizedSignaturies.add(User.objects.get(pk = self.context['request'].data['authorizedSignaturies']))
            # for u in self.context['request'].data['authorizedSignaturies']:
        try:
            CreateUsageTracker(self.context['request'].user.designation.division.pk, 'Created new account')
        except:
            pass
        acc.save()
        return acc

    def update(self ,instance, validated_data):
        for key in ['personal','title', 'number' , 'ifsc', 'bank' , 'bankAddress' , 'balance']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'contactPerson' in self.context['request'].data:
            instance.contactPerson = User.objects.get(pk=int(self.context['request'].data['contactPerson']))
        if 'addMoney' in self.context['request'].data:
            instance.balance += int(self.context['request'].data['addMoney'])
        instance.authorizedSignaturies.clear()
        if 'authorizedSignaturies' in self.context['request'].data:
            # instance.contactPerson = None
            # for idx,u in enumerate(self.context['request'].data['authorizedSignaturies']):
            #     if idx == 0:
            #         instance.contactPerson = User.objects.get(pk = int(u))
                instance.authorizedSignaturies.add(User.objects.get(pk = int(self.context['request'].data['authorizedSignaturies'])))
        instance.save()
        return instance
    def get_totalExp(self, obj):
        try:
            expTotal = ProjectPettyExpense.objects.filter(account=obj).aggregate(tot=Sum('amount'))
            expTotal = expTotal['tot'] if expTotal['tot'] else 0
            return expTotal
        except:
            return 0

class AccountLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('pk', 'title' , 'number', 'ifsc', 'bank','heading','group','balance','is_lock')

class CostCenterSerializer(serializers.ModelSerializer):
    unit = UnitsLiteSerializer(many=False,read_only=True)
    children = RecursiveField(many=True , read_only = True)
    class Meta:
        model = CostCenter
        fields = ('pk', 'name' , 'created','unit', 'children')
        read_only_fields = ('children',)
    def create(self , validated_data):
        cc = CostCenter(**validated_data)
        d = self.context['request'].data
        if 'parent' in d:
            cc.parent = CostCenter.objects.get(pk = d['parent'])
        cc.division = self.context['request'].user.designation.division

        cc.save()
        return cc
    def update(self ,instance, validated_data):
        instance.name = validated_data['name']
        instance.save()
        return instance

class CostCenterLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostCenter
        fields = ('pk', 'name' , 'created','unit')

class TransactionLiteSerializer(serializers.ModelSerializer):
    fromAcc = AccountLiteSerializer(many = False , read_only = True)
    toAcc = AccountLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Transaction
        fields = ('pk', 'created','fromAcc' , 'toAcc' , 'debit' , 'credit' , 'balance','tds')

class TransactionSerializer(serializers.ModelSerializer):
    fromAcc = AccountLiteSerializer(many = False , read_only = True)
    toAcc = AccountLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Transaction
        fields = ('pk', 'created','fromAcc' , 'toAcc' , 'user' , 'debit', 'credit' , 'balance', 'externalReferenceID', 'externalConfirmationID', 'api', 'apiCallParams','account','type','division','narration' , 'groupId' , 'dated','tds')
        read_only_fields = ('user',)
    def create(self , validated_data):
        tcs = Transaction(**validated_data)
        tcs.user = self.context['request'].user
        try:
            tcs.division = self.context['request'].user.designation.division
        except:
            pass
        if 'toAcc' in self.context['request'].data:
            toAc = Account.objects.get(pk=int(self.context['request'].data['toAcc']))
            toAc.balance += self.context['request'].data['amount']
            toAc.save()
            tcs.toAcc = toAc
            tcs.balance = toAc.balance
        if 'fromAcc' in self.context['request'].data:
            frmAc = Account.objects.get(pk=int(self.context['request'].data['fromAcc']))
            frmAc.balance -= self.context['request'].data['amount']
            frmAc.save()
            tcs.fromAcc = frmAc
        tcs.save()
        return tcs

class InflowSerializer(serializers.ModelSerializer):
    toAcc = AccountLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Inflow
        fields = ('pk', 'toAcc' , 'created' ,'amount', 'referenceID' , 'user', 'service', 'currency', 'dated', 'attachment', 'description', 'verified' , 'fromBank', 'chequeNo' , 'mode','gstCollected')
        read_only_fields = ('user' , 'amount')
    def create(self , validated_data):
        u = self.context['request'].user
        inf = Inflow(**validated_data)
        inf.user = u
        inf.save()
        return inf

class ExpenseLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('pk' , 'created' , 'amount' ,'attachment','description','code')

import os
from django.core.files import File
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('pk', 'user' , 'created' , 'code', 'amount' , 'currency' , 'dated' , 'attachment','sheet' ,'transaction', 'description','approved','dispensed','gstVal','gstIN','invNo','invoiceAmount','division')
        read_only_fields = ('user',)

    def create(self , validated_data):
        print 'came to create an Invoce'
        inv = Expense(**validated_data)
        inv.user = self.context['request'].user

        if 'scan' in self.context['request'].data:
            inv.attachment.save(self.context['request'].data['scan'], File(open(os.path.join(globalSettings.BASE_DIR , 'media_root' , self.context['request'].data['scan'] ))), save = False)

        try:
            tcs.division = self.context['request'].user.designation.division
        except:
            pass
        if 'sheet' in self.context['request'].data:
            inv.sheet = ExpenseSheet.objects.get(pk = self.context['request'].data['sheet'])
        if 'transaction' in self.context['request'].data:
            inv.transaction = Transaction.objects.get(pk = self.context['request'].data['transaction'])
        inv.save()

        return inv

    def update(self, instance, validated_data):
        # if the user is manager or something then he can update the approved flag
        reqData = self.context['request'].data
        for f in [ 'code', 'amount' , 'currency' , 'dated' , 'attachment' , 'description','approved','dispensed','gstVal','gstIN','invNo','invoiceAmount']:
            try:
                setattr(instance , f , validated_data.pop(f))
            except:
                print "Error while saving " , f
        if 'sheet' in reqData:
            print reqData['sheet'],'aaaaaaaaaaaaaaaaaaaaaaaaaaa'
            if reqData['sheet'] == None:
                instance.sheet = None
            else:
                instance.sheet = ExpenseSheet.objects.get(pk = reqData['sheet'])
        if 'transaction' in reqData:
            instance.transaction = Transaction.objects.get(pk = reqData['transaction'])
        instance.save()
        return instance

class ExpenseSheetSerializer(serializers.ModelSerializer):
    invoices = ExpenseSerializer(many = True , read_only = True)
    project = projectLiteSerializer(many = True , read_only = True)
    totalAmount = serializers.SerializerMethodField()
    unapproved = serializers.SerializerMethodField()
    typ = serializers.SerializerMethodField()
    class Meta:
        model = ExpenseSheet
        fields = ('pk','created','approved','approvalMatrix','approvalStage','dispensed','notes' , 'project','transaction','submitted','totalDisbursed','invoices','stage','user' ,'division','unapproved','totalAmount','typ')
        read_only_fields = ( 'project', 'user',)
    def create(self , validated_data):
        reqData = self.context['request'].data
        es = ExpenseSheet(**validated_data)
        es.user = self.context['request'].user
        try:
            es.division = self.context['request'].user.designation.division
        except:
            pass
        if 'transaction' in reqData:
            es.transaction = Transaction.objects.get(pk = int(reqData['transaction']))
        es.save()
        if 'projects' in reqData:
            projObj = project.objects.get(id = int(reqData['projects']))
            projObj.expenseSheets.add(es)
        return es
    def update(self , instance , validated_data):
        print 'came'
        reqData = self.context['request'].data
        for f in ['approved','approvalMatrix','approvalStage','dispensed','notes' , 'transaction','totalDisbursed','stage']:
            try:
                setattr(instance , f , validated_data.pop(f))
            except:
                print "Error while saving " , f

        if 'transaction' in reqData:
            instance.transaction = Transaction.objects.get(pk = int(reqData['transaction']))
        if instance.user == self.context['request'].user and 'submitted' in reqData:
            if not instance.submitted:
                instance.submitted = True
        instance.project.clear()
        if 'projects' in reqData:
            projObj = project.objects.get(id = int(reqData['projects']))
            projObj.expenseSheets.add(instance)
        instance.save()
        return instance
    def get_totalAmount(self , obj):
        tot = 0
        objData = obj.invoices.all().aggregate(tot=Sum('amount'))
        if objData['tot']!=None:
            tot = objData['tot']
        return tot
    def get_unapproved(self , obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        objData = Expense.objects.filter( sheet__isnull = True, user = user)
        return ExpenseSerializer(objData,many = True ).data
    def get_typ(self , obj):
        return 'EXPENSE SHEET'


class ExpenseSheetLiteSerializer(serializers.ModelSerializer):
    project = projectLiteSerializer(many = True , read_only = True)
    totAmount = serializers.SerializerMethodField()
    class Meta:
        model = ExpenseSheet
        fields = ('pk','created','notes' , 'project','stage','user','totAmount' )
    def get_totAmount(self , obj):
        tot = 0
        objData = obj.invoices.all().aggregate(tot=Sum('amount'))
        if objData['tot']!=None:
            tot = objData['tot']
        return tot

from ERP.serializers import serviceLiteSerializer

class VendorProfileLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = ('pk' , 'created' , 'paymentTerm'  )

class VendorProfileSerializer(serializers.ModelSerializer):
    service = serviceLiteSerializer(many = False , read_only = True)
    class Meta:
        model = VendorProfile
        fields = ('pk', 'service' , 'contactPerson', 'created' , 'email' , 'mobile' , 'paymentTerm' ,  'contentDocs', 'bankName', 'accountNumber','ifscCode','division' )
    def create(self , validated_data):
        v = VendorProfile(**validated_data)
        try:
            v.division = self.context['request'].user.designation.division
        except:
            pass
        if 'service' in self.context['request'].data:
            serviceObj = service.objects.get(pk=int(self.context['request'].data['service']))
            serviceObj.vendor = True
            serviceObj.save()
            v.service = serviceObj
        v.save()
        return v

class VendorServiceSerializer(serializers.ModelSerializer):
    vendorProfile = VendorProfileSerializer(many = False , read_only = True)
    class Meta:
        model = VendorService
        fields = ('pk', 'vendorProfile' , 'particular', 'rate','division' )
    def create(self , validated_data):
        i = VendorService(**validated_data)
        try:
            i.division = self.context['request'].user.designation.division
        except:
            pass
        if 'vendorProfile' in self.context['request'].data:
            i.vendorProfile = VendorProfile.objects.get(pk=int(self.context['request'].data['vendorProfile']))
        i.save()
        return i

class VendorServiceLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorService
        fields = ('pk' , 'particular', 'rate' )


class ExpenseHeadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHeading
        fields = ('pk', 'title')

class SaleSerializer(serializers.ModelSerializer):
    costcenter = CostCenterLiteSerializer(many = False , read_only = True)
    bussinessunit = UnitsLiteSerializer(many=False,read_only=True)
    tax = serializers.SerializerMethodField()
    class Meta:
        model = Sale
        fields=('pk','created','user','status','isInvoice','poNumber','name','personName','phone','email','address','pincode','state','city','country','pin_status','deliveryDate','payDueDate','gstIn','costcenter','bussinessunit','tax','recDate','total','totalGST','paidAmount','balanceAmount','cancelled','cancelledDate','division','isCash','paymentImage','paymentRef','isPerforma','sameasbilling','billingAddress','billingPincode','billingState','billingCity','billingCountry')
    def create(self , validated_data):
        obi = Sale(**validated_data)
        try:
            if self.context['request'].user:
               obi.user = self.context['request'].user
        except:
            pass
        try:
            obi.division = self.context['request'].user.designation.division
        except:
            pass
        if 'costcenter' in self.context['request'].data:
            ccObj = CostCenter.objects.get(pk=int(self.context['request'].data['costcenter']))
            obi.costcenter = ccObj
        if 'bussinessunit' in self.context['request'].data:
            unitObj = Unit.objects.get(pk=int(self.context['request'].data['bussinessunit']))
            obi.bussinessunit = unitObj
        obi.save()
        if 'project' in self.context['request'].data:
            projObj = project.objects.get(pk=int(self.context['request'].data['project']))
            projObj.ourBoundInvoices.add(obi)
            projObj.save()
        if 'invoiceQty' in self.context['request'].data:
            totalAmount = 0
            totalGST = 0
            for i in self.context['request'].data['invoiceQty']:
                amount  = 0
                gst = 0
                data = {'product' : i['product'],'price':i['price'],'qty' : i['qty'] ,'tax':i['tax'],'total':i['total'], 'outBound':obi}
                outbondQty = SalesQty(**data)
                amount = float(outbondQty.price) *  float(outbondQty.qty)
                gst = float(outbondQty.tax) *  float(outbondQty.qty)
                totalAmount+=amount
                totalGST+=gst
                try:
                    outbondQty.division = self.context['request'].user.designation.division
                except:
                    pass
                    if 'hsn' in i:
                        outbondQty.hsn = ProductMeta.objects.get(pk = i['hsn'])
                        outbondQty.save()
            obi.total = totalAmount
            obi.totalGST = totalGST
            obi.balanceAmount = totalAmount
        obi.save()
        try:
            CreateUsageTracker(self.context['request'].user.designation.division.pk, 'Created new sale')
        except:
            pass
        return obi
    def update(self ,instance, validated_data):
        for key in ['status','poNumber','name','personName','phone','email','address','pincode','state','city','country','pin_status','deliveryDate','payDueDate','gstIn','recDate','isInvoice','total','totalGST','paidAmount','balanceAmount','cancelled','cancelledDate','isCash','paymentImage','paymentRef','isPerforma','sameasbilling','billingAddress','billingPincode','billingState','billingCity','billingCountry']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'status' in validated_data:
            if instance.recDate == None and validated_data['status'] == 'Received':
                instance.recDate = datetime.now().date()
        if 'cancelled' in validated_data:
            instance.cancelledDate = datetime.datetime.now().date()

        instance.save()
        if 'invoiceQty' in self.context['request'].data:
            totalAmount = 0
            totalGST = 0
            for i in self.context['request'].data['invoiceQty']:
                amount  = 0
                gst = 0
                if 'pk' in i:
                    outbondQty = SalesQty.objects.get(pk = i['pk'])
                    outbondQty.product = i['product']
                    outbondQty.price = i['price']
                    outbondQty.qty = i['qty']
                    outbondQty.tax = i['tax']
                    outbondQty.total = i['total']
                    if 'hsn' in i:
                        outbondQty.hsn = ProductMeta.objects.get(pk = i['hsn'])
                    outbondQty.save()
                    amount = float(outbondQty.price) *  float(outbondQty.qty)
                    gst = float(outbondQty.tax) *  float(outbondQty.qty)
                    totalAmount+=amount
                    totalGST+=gst
                else:
                    data = {'product' : i['product'],'price':i['price'],'qty' : i['qty'] ,'tax':i['tax'],'total':i['total'], 'outBound':instance}
                    outbondQty = SalesQty(**data)
                    try:
                        outbondQty.division = self.context['request'].user.designation.division
                    except:
                        pass
                    if 'hsn' in i:
                        outbondQty.hsn = ProductMeta.objects.get(pk = i['hsn'])
                    amount = float(outbondQty.price) *  float(outbondQty.qty)
                    gst = float(outbondQty.tax) *  float(outbondQty.qty)
                    totalAmount+=amount
                    totalGST+=gst
                    outbondQty.save()
                instance.total = totalAmount
                instance.totalGST = totalGST
                instance.balanceAmount = totalAmount
        instance.save()
        return instance

    def get_tax(self , obj):
        objData = SalesQty.objects.filter(outBound=obj.pk).aggregate(tot=Sum(((F('total')*F('tax'))/100) ,output_field=FloatField()))
        tot = round(objData['tot']) if objData['tot'] else 0
        return tot

class SalesQtySerializer(serializers.ModelSerializer):
    assetItems = CheckinLiteSerializer(many = True , read_only = True)
    addonName = serializers.SerializerMethodField()
    addonPrice = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    class Meta:
        model = SalesQty
        fields=('pk','created','outBound','product','qty','price','hsn','tax','total', 'assetItems','division','addon' , 'asset','addonName','addonPrice','image','taxPer')
    def create(self , validated_data):
        obiq = SalesQty(**validated_data)
        try:
            obiq.division = self.context['request'].user.designation.division
        except:
            pass
        if 'outBound' in self.context['request'].data:
            obiq.outBound = Sale.objects.get(pk=int(self.context['request'].data['outBound']))
        if 'hsn' in self.context['request'].data:
            obiq.hsn = self.context['request'].data['hsn']
        if 'taxRate' in self.context['request'].data:
            obiq.taxPer = self.context['request'].data['taxRate']
        obiq.save()
        return obiq
    def update(self ,instance, validated_data):
        for key in ['product','qty','price','tax','total','taxPer']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'outBound' in self.context['request'].data:
            instance.outBound = Sale.objects.get(pk=int(self.context['request'].data['outBound']))
        if 'hsn' in self.context['request'].data:
            instance.hsn = self.context['request'].data['hsn']
        instance.save()
        return instance
    def get_addonName(self , obj):
        nameVal = ''
        if obj.addon is not None:
            nameVal = AssetAddon.objects.get(pk = int(obj.addon)).label
        return nameVal
    def get_addonPrice(self , obj):
        priceVal = 0
        if obj.addon is not None:
            priceVal = AssetAddon.objects.get(pk = int(obj.addon)).rate
        return priceVal
    def get_image(self , obj):
        dp = ''
        if obj.asset is not None:
            val = Asset.objects.get(pk = int(obj.asset)).dp
            dp = str(val)
        return dp


class SaleAllSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    invoiceqty = serializers.SerializerMethodField()
    costcenter = CostCenterLiteSerializer(many = False , read_only = True)
    account = AccountLiteSerializer(many = False , read_only = True)
    receivedAmount = serializers.SerializerMethodField()
    class Meta:
        model = Sale
        fields=('pk','created','user','status','isInvoice','poNumber','name','personName','phone','email','address','pincode','state','city','country','pin_status','deliveryDate','payDueDate','gstIn','total','tax','recDate','invoiceqty','parent','costcenter','balanceAmount' , 'paidAmount','account','contact','terms','termsandcondition','serviceFor','receivedAmount','isPerforma','sameasbilling','billingAddress','billingPincode','billingState','billingCity','billingCountry','cancelled')
    def get_total(self , obj):
        objData = SalesQty.objects.filter(outBound=obj.pk).aggregate(tot=Sum('total'))
        tot = objData['tot'] if objData['tot'] else 0
        return tot
    def get_tax(self , obj):
        objData = SalesQty.objects.filter(outBound=obj.pk).aggregate(tot=Sum(((F('total')*F('tax'))/100) ,output_field=FloatField()))
        tot = round(objData['tot']) if objData['tot'] else 0
        return tot
    def get_invoiceqty(self , obj):
        objData = SalesQtySerializer(SalesQty.objects.filter(outBound = obj), many =True).data
        return objData
    def get_receivedAmount(self , obj):
        objData = Sale.objects.filter(parent = obj)
        total = objData.aggregate(tot = Sum('paidAmount'))
        paid = 0
        if total['tot'] is not None:
            paid = total['tot']
        return paid

class SaleLiteSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    outBoundQty = SalesQtySerializer(many= True , read_only = True)
    class Meta:
        model = Sale
        fields=('pk','created','user','status','isInvoice','deliveryDate','payDueDate','gstIn','total','tax','recDate', 'outBoundQty','phone','email' ,'address','pincode','state','city','country','gstIn','isPerforma')

    def get_total(self , obj):
        objData = SalesQty.objects.filter(outBound=obj.pk).aggregate(tot=Sum('total'))
        tot = objData['tot'] if objData['tot'] else 0
        return tot
    def get_tax(self , obj):
        objData = SalesQty.objects.filter(outBound=obj.pk).aggregate(tot=Sum(((F('total')*F('tax'))/100) ,output_field=FloatField()))
        tot = round(objData['tot']) if objData['tot'] else 0
        return tot

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields=('pk','created','name','theme_color','products_count')
    def create(self , validated_data):
        cat = Category(**validated_data)
        try:
            cat.division = self.context['request'].user.designation.division
        except:
            pass
        cat.save()
        try:
            CreateUsageTracker(self.context['request'].user.designation.division.pk, 'Created new product category')
        except:
            pass
        return cat
    def get_products_count(self,obj):
        try:
            return obj.categoryInventory.all().count()
        except:
            return 0

class InventoryLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields=('pk','created','name','img1')

from PIL import Image
import PIL
class RateListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=False,read_only=True)
    cart = serializers.SerializerMethodField()
    cartId = serializers.SerializerMethodField()
    addon = serializers.SerializerMethodField()
    class Meta:
        model = Inventory
        fields=('pk','created','name','value','rate','qtyAdded','refurnished','refurnishedAdded','sellable','description','richtxtDesc','taxCode','img1','img2','img3','category','buyingPrice','sku','taxRate','mrp','division','cart','cartId','addonsData','customizationData','addon')
    def create(self , validated_data):
        inven = Inventory(**validated_data)
        try:
            inven.division = self.context['request'].user.designation.division
        except:
            pass
        if 'img1' in self.context['request'].data:
            fileName = self.context['request'].data['img1']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        if 'img2' in self.context['request'].data:
            fileName = self.context['request'].data['img2']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        if 'img3' in self.context['request'].data:
            fileName = self.context['request'].data['img3']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        if 'category' in self.context['request'].data:
            inven.category =  Category.objects.get(pk = int(self.context['request'].data['category']))
        inven.save()
        return inven
    def update(self ,instance, validated_data):
        for key in ['img1', 'img2' , 'img3' ,'description','richtxtDesc','sellable','category' , 'name' , 'rate','buyingPrice','sku','taxRate','taxCode','mrp','addonsData','customizationData']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        if 'value' in self.context['request'].data:
            instance.value = self.context['request'].data['value']
            instance.qtyAdded = self.context['request'].data['value']
        if 'img1' in self.context['request'].data:
            fileName = self.context['request'].data['img1']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        if 'img2' in self.context['request'].data:
            fileName = self.context['request'].data['img2']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        if 'img3' in self.context['request'].data:
            fileName = self.context['request'].data['img3']
            f =  open(os.path.join(globalSettings.BASE_DIR ,'static_shared','images','products',str(fileName)),"wb")

            f.write(fileName.read())
            f.close()
        instance.save()
        return instance
    def get_cart(self, obj):
        cart = 0
        print self.context
        try:
            val = self.context['data']
        except:
            val =  self.context['request'].GET
        if 'contact' in val and 'divId' in val :
            id = hash_fn.unhash(self.context['request'].GET['divId'])
            data = obj.carts.filter(division__id = id, contact__id = val['contact'])
            if data.count()>0:
                cart = data.first().qty
        return cart
    def get_cartId(self, obj):
        cart = None
        if 'contact' in self.context['request'].GET and 'divId' in self.context['request'].GET :
            id = hash_fn.unhash(self.context['request'].GET['divId'])
            data = obj.carts.filter(division__id = id, contact__id = self.context['request'].GET['contact'])
            if data.count()>0:
                cart = data.first().id
        return cart
    def get_addon(self, obj):
        addon = None
        if 'contact' in self.context['request'].GET and 'divId' in self.context['request'].GET :
            id = hash_fn.unhash(self.context['request'].GET['divId'])
            data = obj.carts.filter(division__id = id, contact__id = self.context['request'].GET['contact'])
            if data.count()>0:
                addon = data.first().addon
        return addon

class InventoryLogSerializer(serializers.ModelSerializer):
    inventory = RateListSerializer(many = False , read_only = True)
    class Meta:
        model = InventoryLog
        fields=('pk','created','inventory','user','value','refurnished','division')
        read_only_fields = ('user', )
    def create(self , validated_data):
        u = self.context['request'].user
        inv = InventoryLog(**validated_data)
        inv.user = u
        try:
            inv.division = self.context['request'].user.designation.division
        except:
            pass
        if 'inventory' in self.context['request'].data:
            inv.inventory = Inventory.objects.get(pk=int(self.context['request'].data['inventory']))
        inv.save()
        return inv


class ExpenseHeadingLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHeading
        fields = ('pk', 'title')





class DisbursalLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disbursal
        fields=('pk','date','sourcePk','source','amount','account','disbursed' , 'disbursalNote')


class DisbursalSerializer(serializers.ModelSerializer):
    account = AccountSerializer(many = False , read_only = True)
    class Meta:
        model = Disbursal
        fields=('pk','created','date','disbursed','disbursalNote','sourcePk','source','tallyed','narration','contactPerson','accountNumber','bankName','amount','ifscCode','account')
    def update(self , instance , validated_data):
        for key in ['disbursed','disbursalNote','account']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'account' in self.context['request'].data:
            instance.account = Account.objects.get(pk = int(self.context['request'].data['account']))
        instance.save()
        return instance


class InvoiceReceivedSerializer(serializers.ModelSerializer):
    userName = serializers.SerializerMethodField()
    class Meta:
        model = InvoiceReceived
        fields=('pk','created','user','companyName','personName','totalAmount','invType','title','status','userName')
    def create(self , validated_data):
        u = self.context['request'].user
        print u.first_name,'aaaaaaaaaaaaaaaaaaaaaaaaa'
        inv = InvoiceReceived(**validated_data)
        inv.user = u
        try:
            division = self.context['request'].user.designation.division
            inv.division = division
            inv.uniqueId = division.counter
            division.counter+=1
            division.save()
        except:
            pass
        inv.save()
        try:
            CreateUsageTracker(self.context['request'].user.designation.division.pk, 'Created new expense claims')
        except:
            pass
        return inv
    def update(self , instance , validated_data):
        for key in ['status']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        try:
            if instance.status == 'Approved' and instance.invType == 'EXPENSES':
                today = datetime.now().date()
                transObj = Disbursal.objects.create(sourcePk = instance.pk , amount = instance.totalAmount , date = today , source = 'EXPENSES', division = self.context['request'].user.designation.division)
                # transObj.accountNumber = purchaseObj.accNo
                # transObj.ifscCode = purchaseObj.ifsc
                # transObj.bankName = purchaseObj.bankName
                transObj.narration = 'Expenses ' + str(round(float(instance.totalAmount))) +' Rs , ' + str(transObj.date.strftime("%B")) + '-' + str(transObj.date.year)
                transObj.save()
                instance.paidAmount = float(instance.paidAmount) + float(instance.totalAmount)
                instance.balanceAmount = float(instance.totalAmount) - float(instance.paidAmount)
                instance.save()
        except:
            pass
        advObj = Advances.objects.filter(user = instance.user, settled = False, returnMethod = 'SALARY_ADVANCE')
        # advanceDeductiontot = advObj.aggregate(tot = Sum('amount'))
        # if advanceDeductiontot['tot'] is not None:
        #     pr.advanceDeduction = advanceDeductiontot['tot']
        advanceIds = ''
        totalAmount = instance.totalAmount
        for a in advObj:
            if totalAmount>0:
                # advanceIds + str(a.pk)+','
                if a.balance>instance.totalAmount:
                    a.balance = a.balance - totalAmount
                elif a.balance<instance.totalAmount:
                    totalAmount =  totalAmount - a.balance
                    a.balance = 0
                    a.settled = True
                elif a.balance==instance.totalAmount:
                    totalAmount = 0
                    a.balance = 0
                    a.settled = True
            a.save()
        return instance
    def get_userName(self, obj):
        name = None
        try:
            name = obj.user.first_name + ' ' + obj.user.last_name
        except:
            pass
        return name

class InvoiceQtySerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceQty
        fields=('pk','product','created','price','taxCode','taxPer','tax','total','receivedQty','description','attachment','invoice','data')
    def create(self , validated_data):
        u = self.context['request'].user
        inv = InvoiceQty(**validated_data)
        inv.user = u
        inv.save()
        if inv.invoice is not None:
            invoice = inv.invoice
            total = invoice.parentInvoice.aggregate(tot = Sum('total'))
            totalAmount = 0
            if total['tot'] is not None:
                totalAmount = total['tot']
            invoice.totalAmount = totalAmount
            invoice.balanceAmount = totalAmount - invoice.paidAmount
            invoice.save()
        return inv
    def update(self , instance , validated_data):
        for key in ['invoice','product','price','taxCode','taxPer','tax','total','receivedQty','description','attachment','invoice','data']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        if instance.invoice is not None:
            invoice = instance.invoice
            total = invoice.parentInvoice.aggregate(tot = Sum('total'))
            totalAmount = 0
            if total['tot'] is not None:
                totalAmount = total['tot']
            invoice.totalAmount = totalAmount
            invoice.balanceAmount = totalAmount - invoice.paidAmount
            invoice.save()
        instance.save()
        return instance

class InvoiceReceivedAllSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    companyReference = serviceSerializer(many = False , read_only = True)
    class Meta:
        model = InvoiceReceived
        fields=('pk','created','user','companyName','personName','phone','email','address' ,'state' , 'city' ,'country','pincode' , 'deliveryDate' , 'paymentDueDate' , 'costcenter' , 'accNo' , 'ifsc' , 'bankName' , 'account'  , 'totalAmount' , 'balanceAmount' , 'paidAmount' , 'companyReference' , 'note','products','invNo','gstIn','invType','title','status')
    def get_products(self, obj):
        return InvoiceQtySerializer(obj.parentInvoice, many = True).data


class CartSerializer(serializers.ModelSerializer):
    product = InventoryLiteSerializer(many = False , read_only = True)
    addonPrice = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields=('pk','created','contact','product','qty','price','total','division','addon','addonPrice')
    def create(self , validated_data):
        cart = Cart(**validated_data)
        # division = self.context['request'].user.designation.division
        if 'product' in self.context['request'].data:
            cart.product = Inventory.objects.get(pk = int(self.context['request'].data['product']))
        if 'divId' in self.context['request'].data:
            id = hash_fn.unhash(self.context['request'].data['divId'])
            cart.division = Division.objects.get(pk = int(id))
        # cart.division = division
        cart.price = cart.product.rate
        cart.total = cart.product.rate * cart.qty
        cart.save()
        return cart
    def update(self , instance , validated_data):
        instance.qty =  self.context['request'].data['qty']
        instance.total = instance.product.rate * instance.qty
        instance.save()
        return instance
    def get_addonPrice(self, obj):
        addonPrice = 0
        if obj.addon is not None:
            obj.addon  = json.loads(obj.addon)
            addonPrice = float(obj.qty) * float(obj.addon['price'])
        return addonPrice
