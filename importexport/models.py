# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from ERP.models import service
from django.db import models
from django.contrib.auth.models import User, Group
from time import time
from organization.models import Division

def getUploadedProductSheets(instance , filename ):
    return 'support/product_sheets/%s__%s' % (str(time()).replace('.', '_'), filename)

PURCHASE_STATUS = (
('created' , 'created'),
('sent_for_approval' , 'sent_for_approval'),
('approved' , 'approved'),
('ongoing' , 'ongoing'),
('archieve' , 'archieve'),
)

STOCK__STATUS = (
('live' , 'live'),
('completed' , 'completed')
)

CURRENCY_CHOICE = (
('CHF' , 'CHF'),
('INR' , 'INR'),
('EUR' , 'EUR'),
('USD' , 'USD'),
('JPY' , 'JPY'),
('GBP' , 'GBP'),
('AUD' , 'AUD'),
('CAD' , 'CAD'),
('ZAR' , 'ZAR'),
)


class ProductSheet(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    sheet = models.FileField(null = True , upload_to = getUploadedProductSheets)
    file_name = models.CharField(max_length=50, null=True)



class Products(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    part_no = models.CharField(max_length=60, unique=True , null=True)
    description_1 = models.TextField(max_length=2000, null=True,blank =True)
    description_2 = models.TextField(max_length=2000, null=True,blank =True)
    weight = models.FloatField(null=True,blank =True)
    price = models.FloatField(null=True,blank =True)
    replaced = models.CharField(max_length=200, null=True)
    parent = models.ForeignKey('self', related_name='parentProduct', null=True)
    sheet = models.ForeignKey(ProductSheet, related_name='productsSheet', null=True)
    customs_no = models.PositiveIntegerField( null=True,blank =True,default=0)
    bar_code = models.CharField(max_length=50, null=True,blank =True)
    gst = models.FloatField(default = 18.0)
    custom = models.FloatField(default = 0.0)
    division = models.ForeignKey(Division, related_name = 'imProducts', null = True)
    class Meta:
        unique_together = ('part_no','division')


class Test(models.Model):
    created = models.DateTimeField(auto_now_add = True)

class Vendor(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length = 100 , null = True,)
    personName = models.CharField(max_length = 100 , null = True,)
    city = models.CharField(max_length = 100 , null = True,blank =True)
    street = models.CharField(max_length = 100 , null = True,blank =True)
    state = models.CharField(max_length = 100 , null = True,blank =True)
    pincode = models.CharField(max_length = 20 , null = True,blank =True)
    country = models.CharField(max_length = 20 , null = True,blank =True)
    mobile = models.CharField(max_length = 50 , null = True,blank =True)
    gst = models.CharField(max_length = 20 , null = True)
    email = models.EmailField(null = True)
    division = models.ForeignKey(Division, related_name = 'vendors', null = True)


class Projects(models.Model):
    created = models.DateTimeField(auto_now_add  = True )
    title = models.CharField(max_length = 200)
    service = models.ForeignKey(service , related_name = 'service' ,null = False)
    date = models.DateField(null = True)
    machinemodel = models.CharField(max_length = 20 , null = True , blank =True)
    comm_nr = models.CharField(max_length = 200 ,default='null', blank =True)
    quote_ref = models.CharField(max_length = 50 , null = True , blank =True)
    enquiry_ref = models.CharField(max_length = 50 , null = True , blank =True)
    responsible = models.ManyToManyField(User , related_name = 'managingService' , blank = True)
    approved1 = models.BooleanField(default = False)
    approved2 = models.BooleanField(default = False)
    approved1_user = models.ForeignKey(User , related_name='approveduser1' , null = True)
    approved2_user = models.ForeignKey(User , related_name='approveduser2' , null = True)
    approved1_date = models.DateField(null = True)
    approved2_date = models.DateField(null = True)
    status = models.CharField(choices = PURCHASE_STATUS , max_length = 100 , default = 'created')
    revision =  models.CharField( max_length = 20 , default=1)
    savedStatus = models.BooleanField(default = False)
    invoiceValue = models.FloatField(null = True)
    packing = models.FloatField(default = 0)
    insurance = models.FloatField(default = 0)
    freight = models.FloatField(default = 0)
    assessableValue = models.FloatField(default = 0)
    gst1 = models.FloatField(default = 0)
    gst2 = models.FloatField(default = 0)
    clearingCharges1 = models.FloatField(default = 0)
    clearingCharges2 = models.FloatField(default = 0)
    exRate = models.FloatField( default = 75)
    profitMargin =  models.FloatField( default = 0)
    poNumber =  models.CharField( max_length = 20 , null=True,blank=True)
    poDate = models.DateField(null = True)
    invoiceNumber = models.CharField( max_length = 50 , null=True,blank=True)
    boeRefNumber =  models.CharField( max_length = 20 , null=True,blank=True)
    quoteRefNumber = models.CharField( max_length = 20 , null=True,blank=True)
    quoteDate = models.DateField(null = True)
    vendor = models.ForeignKey(Vendor , related_name='vendor' , null = True)
    quoteValidity = models.CharField(max_length = 200, default = "30 days from quote date")
    terms = models.CharField(max_length = 200, default = "EX-WORKS, BRUDERER AG, Switzerland")
    termspo = models.CharField(max_length = 200, default = "EX-WORKS, BRUDERER AG, Switzerland")
    delivery = models.CharField(max_length = 200, default = "6 weeks from the date of receipt of PO and advance")
    paymentTerms = models.CharField(max_length = 200, default = "100% advance along with order")
    paymentTerms1  = models.CharField(max_length = 200, default = "100% advance along with order")
    junkStatus =  models.BooleanField(default = False)
    shipmentMode =  models.CharField(max_length = 200, default = "Road")
    shipmentDetails = models.CharField(max_length = 200, default = "Freight forwarder -")
    weightValue =  models.FloatField( default = 0)
    quoteNotes =  models.CharField(max_length = 500, null=True,blank=True)
    poNotes =  models.CharField(max_length = 500, null=True,blank=True)
    currency = models.CharField(choices = CURRENCY_CHOICE , max_length = 10 , default = 'CHF')
    grnDate = models.DateField(null = True)
    flag = models.BooleanField(default = False)
    division = models.ForeignKey(Division, related_name = 'projects', null = True)
    class Meta:
        unique_together = ('title', 'comm_nr','division')


class BoM(models.Model):
    created = models.DateTimeField(auto_now_add  = True )
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name='usersBoM' , null = False)
    project = models.ForeignKey(Projects , null = True)
    products = models.ForeignKey( Products , null = True)
    quantity1 = models.PositiveIntegerField(null=True , default=0)
    quantity2 = models.PositiveIntegerField(null=True , default=0)
    price = models.FloatField(null = True)
    landed_price = models.FloatField(null=True , default=0)
    invoice_price = models.FloatField(null=True , default=0)
    customer_price = models.FloatField(null=True , default=0)
    gst =  models.FloatField(null=True , default=0)
    custom = models.FloatField(null=True , default=0)
    customs_no = models.PositiveIntegerField(null=True , default=0)
    division = models.ForeignKey(Division, related_name = 'boms', null = True)

class Inventory(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    project =  models.ForeignKey(Projects , null = True)
    product = models.ForeignKey(Products , null = True)
    qty = models.PositiveIntegerField(null=True , default=0)
    addedqty = models.PositiveIntegerField(null=True , default=0)
    rate = models.FloatField(null = True)
    division = models.ForeignKey(Division, related_name = 'inventories', null = True)

class MaterialIssue(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey( Products , null = True)
    qty = models.PositiveIntegerField(null=True , default=0)
    price = models.FloatField(null = True)
    stock = models.CharField(max_length = 1000 , null = True , blank =True)
    division = models.ForeignKey(Division, related_name = 'materialIssues', null = True)

class MaterialIssueMain(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    materialIssue = models.ManyToManyField(MaterialIssue, related_name='materialqty')
    user =  models.ForeignKey(User , related_name='materialuser')
    project = models.ForeignKey(Projects , related_name='materialproject')
    division = models.ForeignKey(Division, related_name = 'materialIssueMain', null = True)


class StockCheck(models.Model):
    inventory =   models.ForeignKey( Inventory , null = True)
    date = models.DateField(null = True)
    count = models.PositiveIntegerField(null=True , default=0)
    status = models.CharField(choices = STOCK__STATUS , max_length = 10 , default = 'live')
    division = models.ForeignKey(Division, related_name = 'stockChecks', null = True)


class StockCheckLog(models.Model):
    product =  models.ForeignKey( StockCheck , null = True)

class StockSummaryReport(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    dated = models.DateField(null = True,unique=True)
    stockValue = models.FloatField(null = True,default=0)
    division = models.ForeignKey(Division, related_name = 'StockSummaryReports', null = True)


class ProjectStockSummary(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    stockReport = models.ForeignKey(StockSummaryReport , related_name='projectStockReport' , null = True)
    value = models.FloatField(null = True,default=0)
    title = models.CharField(max_length = 100 , null = True)
    comm_nr =  models.CharField(max_length = 100 , null = True)
    flag = models.BooleanField(default = False)
    division = models.ForeignKey(Division, related_name = 'projectStockSummaries', null = True)

class Invoice(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    invoiceNumber = models.CharField( max_length = 20 , null=True,blank=True)
    invoiceDate = models.DateField(null = True)
    poNumber =  models.CharField( max_length = 20 , null=True,blank=True)
    insuranceNumber =  models.CharField( max_length = 20 , null=True,blank=True)
    transporter =  models.CharField( max_length = 50 , null=True,blank=True)
    lrNo =  models.CharField( max_length = 50 , null=True,blank=True)
    billName = models.CharField( max_length = 50 , null=True,blank=True)
    shipName = models.CharField( max_length = 50 , null=True,blank=True)
    billAddress = models.CharField( max_length = 200 , null=True,blank=True)
    shipAddress = models.CharField( max_length = 200 , null=True,blank=True)
    billGst = models.CharField( max_length = 50 , null=True,blank=True)
    shipGst = models.CharField( max_length = 50 , null=True,blank=True)
    billState = models.CharField( max_length = 50 , null=True,blank=True)
    shipState = models.CharField( max_length = 50 , null=True,blank=True)
    billCode =  models.CharField( max_length = 20 , null=True,blank=True)
    shipCode =  models.CharField( max_length = 20 , null=True,blank=True)
    isDetails = models.BooleanField(default = False)
    invoiceTerms = models.CharField( max_length = 200 , null=True,blank=True)
    project = models.ForeignKey(Projects , null = True)
    flag = models.BooleanField(default = False)
    division = models.ForeignKey(Division, related_name = 'invoices', null = True)
    comm_nr = models.CharField(max_length = 100 , null=True,blank=True)
    packing = models.TextField(max_length=2000, null=True,blank =True)
    lockInvoice = models.BooleanField(default = False)
    machinemodel = models.CharField(max_length = 20 , null = True , blank =True)

class InvoiceQty(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey(Products , null = True)
    invoice = models.ForeignKey(Invoice , null = True)
    part_no = models.CharField( max_length = 20 , null=True,blank=True)
    description_1 = models.CharField( max_length = 200 , null=True,blank=True)
    customs_no = models.CharField( max_length = 20 , null=True,blank=True)
    price = models.FloatField(null = True,default=0)
    qty = models.PositiveIntegerField(null=True , default=0)
    taxableprice =  models.FloatField(null = True,default=0)
    cgst = models.FloatField(null = True,default=0)
    cgstVal = models.FloatField(null = True,default=0)
    sgst = models.FloatField(null = True,default=0)
    sgstVal = models.FloatField(null = True,default=0)
    igst = models.FloatField(null = True,default=0)
    igstVal = models.FloatField(null = True,default=0)
    total = models.FloatField(null = True,default=0)

class DeliveryChallan(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    materialIssue = models.ForeignKey(MaterialIssueMain , null = True)
    customername = models.CharField( max_length = 50 , null=True,blank=True)
    customeraddress = models.CharField( max_length = 200 , null=True,blank=True)
    customergst = models.CharField( max_length = 200 , null=True,blank=True)
    heading = models.CharField( max_length = 200 , null=True,blank=True)
    challanNo = models.CharField( max_length = 20 , null=True,blank=True)
    challanDate = models.DateField(null = True)
    deliveryThr = models.CharField( max_length = 50 , null=True,blank=True)
    refNo = models.CharField( max_length = 50 , null=True,blank=True)
    apprx = models.CharField( max_length = 50 , null=True,blank=True)
    notes = models.CharField(max_length = 500, null=True,blank=True)
    flag = models.BooleanField(default = False)
    division = models.ForeignKey(Division, related_name = 'deliveryChallans', null = True)


class StockCheckReport(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name='useradded' , null = True)
    flag = models.BooleanField(default = False)
    division = models.ForeignKey(Division, related_name = 'stockCheckReports', null = True)

class StockCheckItem(models.Model):
    product = models.ForeignKey( Products , null = True)
    qty = models.PositiveIntegerField(null=True , default=0)
    matching = models.BooleanField(default = False)
    stockReport = models.ForeignKey(StockCheckReport , related_name='stockreportDetails' , null = True)
    flag = models.BooleanField(default = False)


complaintTypeD = (
('Mechanical' , 'Mechanical' ),
('Electrical' , 'Electrical'),
('ElectroMechanical' , 'ElectroMechanical'),
('Other' , 'Other'),
)

Status = (
('Open' , 'Open'),
('Closed' , 'Closed'),
('Sent for closing approval' , 'Sent for closing approval'),
)



machineRunning = (
('Yes' , 'Yes'),
('No' , 'No')
)

RefurbishedBind = (
('Yes' , 'Yes'),
('No' , 'No')
)
class ComplaintManagement(models.Model):
    date = models.DateTimeField(auto_now_add=True , null = True)
    customer = models.ForeignKey(service ,related_name='lastnamee', null=True)
    contact = models.CharField(max_length = 100 , null = True ,blank=True)
    comm_nr = models.CharField(max_length = 100 , null = True)
    complaintRef = models.CharField( max_length = 50  , null=True , blank=True)
    machine = models.CharField( max_length = 50 , null=True , blank=True)
    description = models.TextField(max_length=2000, null=True,blank =True)
    complaintType = models.CharField(choices = complaintTypeD , max_length = 250 ,null = True)
    registeredBy =  models.ForeignKey(User , related_name='usernamee', null=True)
    errorCode = models.CharField( max_length = 50 , null=True )
    status = models.CharField(choices = Status , max_length=250 , null = True)
    is_CloseApproved = models.BooleanField(default=False)
    serviceReportNo = models.CharField( max_length = 50 , null=True , blank=True)
    closedBy = models.ForeignKey(User , related_name='closedByuser', null=True)
    attr1 = models.TextField(max_length=2000, null=True,blank=True)
    attr2 = models.TextField(max_length=2000, null=True,blank=True)
    attr3 = models.TextField(max_length=2000, null=True,blank=True)
    attr4 = models.TextField(max_length=2000, null=True,blank=True)
    division = models.ForeignKey(Division, related_name = 'complaints', null = True)
    machineRunning = models.CharField(choices = machineRunning , max_length = 20 ,null = True)
    closedDate = models.DateField(null = True)
    RefurbishedBind = models.CharField(choices = RefurbishedBind , max_length= 20 , null = True)
