from ERP.models import *
from finance.models import *
from clientRelationships.models import *
from ERP.models import *
from website.models import *
import os
from django.conf import settings as globalSettings
from time import time
import shutil
import subprocess
from django.core.files import File
import json

def CreateUnit(val):
    if 'division_pk' in val:
        division = Division.objects.get(pk = val['division_pk'] )
        unitObj = Unit.objects.create(name = 'HQ' , address = 'Address Not Available' , city = 'NA' , state = 'NA' , country = 'NA' , pincode= 'NA' , division = division , areaCode= division.name + str(division.pk) )
        response = {'unit' : unitObj.pk}
        return response


def helperCreateUser(name,email):
    division = Division.objects.create(name = name,website = 'NA',pan = 'NA',cin = 'NA')
    unit = Unit.objects.create(name = 'HQ' , address = 'Address Not Available' , city = 'NA' , state = 'NA' , country = 'NA' , pincode= 'NA' , division = division ,  areaCode= division.name + str(division.pk) , email  = email )
    response = {'division' : division.pk , 'unit' : unit.pk}
    return response


def CreateBankAccount(div):
    division = Division.objects.get(pk = div)
    accountObj = Account.objects.filter(group='profit and loss', division = division)
    if len(accountObj)<=0:
        dataVal = [
        {'title':'Markup Income','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Retail Sales','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Service','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Cost of Goods Sold','heading':'sale','group':'profit and loss','is_lock':False},
        {'title':'Payroll Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Bank Service Charges','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Insurance','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Interest Expense','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Job Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Mileage Reimbursement','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Professional Fees','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Rent','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Repairs','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Tools and Misc.Equipment','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Uncategorized Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Utilities','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Misc Income','heading':'otherIncome','group':'profit and loss','is_lock':False},
        ]
        for i in dataVal:
            obj = Account.objects.create(**i)
            obj.division = division
            obj.is_lock = True
            obj.save()
    return {'status':'created'}

    # http://localhost:8000/api/finance/accountLite/?personal=false&heading=income


def CreateCostCenter(div):
    division = Division.objects.get(pk = int(div))
    cost = CostCenter.objects.create(name = 'Default Cost Center', division = division)
    return {'pk':cost.pk}


def CreateSalesTermsAndCondition(div):
    division = Division.objects.get(pk = int(div))
    termObj = TermsAndConditions.objects.create(heading = 'INVOICE' , prefix = 'INV' , typ = 'INVOICE' , body='' , division = division)
    termObj1 = TermsAndConditions.objects.create(heading = 'SALES ORDER' , prefix = 'SALE' , typ = 'SALES ORDER' , body='' , division = division)
    return {'status':'created'}

def CreateProducts(div):
    division = Division.objects.get(pk = int(div))
    catObj = Category.objects.create(name = 'Sample Category', division = division)
    prouducts = ['Product1' , 'Product2' , 'Product3']
    for i  in prouducts:
        prod = Inventory.objects.create(name = i, division = division , category = catObj, sku = i)
        from_path = os.path.join(globalSettings.BASE_DIR, 'static_shared' ,'images', 'newproduct.png')
        to_path = os.path.join(globalSettings.BASE_DIR,'media_root','finance','inventory')
        shutil.copy(from_path, to_path)
        prod.img1 = 'finance/inventory/newproduct.png'
        prod.img2 = 'finance/inventory/newproduct.png'
        prod.img3 = 'finance/inventory/newproduct.png'
        prod.save()
    return {'status':'created'}


def CreateContact(div, user):
    division = Division.objects.get(pk = int(div))
    user = User.objects.get(pk = int(user))
    termObj = CRMTermsAndConditions.objects.create(heading = 'INVOICE' , prefix = 'INV'  , body='' , division = division)
    addrObj = address.objects.create(street = 'NA' , city = 'NA' , country = 'NA' , pincode = 0, state = 'NA')
    serviceObj = service.objects.create(name = 'Sample Company' , user = user, address = addrObj, division = division)
    contactObj = Contact.objects.create(user = user, name = 'Sample Contact' ,company = serviceObj, division = division, email = 'NA' , mobile = 'NA' , street = 'NA' , city = 'NA' , pincode = 'NA' , state = 'NA' , country = 'NA')
    print contactObj.pk
    data = [{"currency":"INR","desc":"Sample Product1","quantity":"1","rate":"1","saleType":"Product","subtotal":1,"tax":18,"taxCode":85049090,"total":1.18,"totalTax":0.18,"type":"onetime"},{"currency":"INR","desc":"Sample Product1","quantity":"1","rate":"1","saleType":"Product","subtotal":1,"tax":18,"taxCode":85049090,"total":1.18,"totalTax":0.18,"type":"onetime"}]
    quote1 = Contract.objects.create(user = user, contact = contactObj, division = division, termsAndCondition = termObj, termsAndConditionTxts = termObj.body, data = json.dumps(data), uniqueId = 'INV', heading = 'INVOICE' , discount = 0, totalTax =  0.36 , grandTotal = 2.36)
    print quote1.contact.pk,'ssssssssss'

    return {'status':'created'}


def CreateUsageTracker(divisiom, appDetails):
    usageTrackObj, c = UsageTracker.objects.get_or_create(division = Division.objects.get(pk = int(divisiom)), detail = appDetails)
    usageTrackObj.count+=1
    usageTrackObj.save()
    return usageTrackObj.count


def CreatePage(user):
    page = Page.objects.create(user = user)
    page.save()
    return page
