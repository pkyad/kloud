from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from ERP.models import service
from organization.models import Division , Unit
from time import time
# from projects.models import *
# from projects.models import project
from clientRelationships.models import  Contact
# Create your models here.
# from projects.models import project

def getInvoicesPath(instance , filename ):
    return 'finance/invoices/%s_%s_%s' % (str(time()).replace('.', '_'),instance.user.username, filename)

def getInflowAttachmentsPath(instance , filename ):
    return 'finance/inflows/%s_%s_%s' % (str(time()).replace('.', '_'),instance.user.username, filename)

def getcontentDocsPath(instance , filename ):
    return 'finance/vendor/%s_%s_%s' % (str(time()).replace('.', '_'), instance.contactPerson, filename)

def getInvoiceUploadPath(instance,filename):
    return "finance/vendor/%s_%s__%s"% (str(time()).replace('.','_'),instance.approver, filename)

def getInventoryImagePath(instance,filename):
    return "finance/inventory/%s_%s"% (str(time()).replace('.','_'), filename)

def getPettyCashInvoicePath(instance , filename ):
    return 'projects/pettyExpense/%s_%s__%s__%s' % (str(time()).replace('.', '_'), instance.heading.title,instance.project.title, filename)

from organization.models import Unit , Division





class Account(models.Model):
    title = models.CharField(max_length = 100 , null = True , blank = True)
    created = models.DateTimeField(auto_now_add=True)
    number = models.BigIntegerField(null = True)
    ifsc = models.CharField(max_length = 15 , null = True,blank = True)
    bank = models.CharField(max_length = 50 , null = True,blank = True)
    bankAddress = models.TextField(max_length = 500 , null = True,blank = True)
    contactPerson = models.ForeignKey(User , null = True , related_name = 'accountsManaging')
    authorizedSignaturies = models.ManyToManyField(User , related_name = 'checkingAccounts',blank=True)
    personal = models.BooleanField(default = False) # if this account is personal account , in that case the authorized person will be the person to which this account belongs
    balance = models.FloatField(default = 0)
    unit = models.ForeignKey(Unit , related_name='costCenters' , null = True) # find out based on the head / contact person
    division = models.ForeignKey(Division , related_name='divisionAccount' , null = True)
    is_lock = models.BooleanField(default = False)
    heading = models.CharField( max_length = 20, default = 'income')
    group =  models.CharField(max_length = 100 , blank = True, null=True)


    def __unicode__(self):
        return '<Number : %s > , <bank : %s>' %(self.number , self.bank)


class CostCenter(models.Model):
    name = models.CharField(max_length = 100 , blank = False)
    created = models.DateTimeField(auto_now_add=True)
    unit = models.ForeignKey(Unit,related_name='userDesignationUnit',null=True)
    division = models.ForeignKey(Division , related_name='divisionCostCenter' , null = True)
    parent = models.ForeignKey("self" , null = True, related_name="children")


INFLOW_TYPES = (
    ('cash' , 'cash'),
    ('cheque' , 'cheque'),
    ('wire' , 'wire'),
)

CURRENCY_CHOICES = (
    ('INR' , 'INR'),
    ('USD' , 'USD'),
)

class Inflow(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    amount = models.PositiveIntegerField()
    toAcc = models.ForeignKey(Account , null = False , related_name = 'inflowCredits')
    referenceID = models.CharField(max_length = 30 , null = False)
    user = models.ForeignKey(User , related_name='inflowsTransacted' , null = False)
    service = models.ForeignKey(service , null = True, related_name="inflow")
    currency = models.CharField(max_length = 5 , choices = CURRENCY_CHOICES)
    dated = models.DateField(null = False)
    attachment = models.FileField(upload_to = getInflowAttachmentsPath ,  null = True)
    description = models.TextField(max_length = 200 , null = False) # describe the inflow
    verified = models.BooleanField(default = False)
    fromBank = models.CharField(max_length = 30 , null = True)
    chequeNo = models.CharField(max_length = 30 , null = True)
    mode = models.CharField(choices = INFLOW_TYPES , max_length = 20, default = 'cash')
    gstCollected = models.FloatField(default=0)
    division = models.ForeignKey(Division,related_name='divisionInflow',null=True)

STATUS_CHOICES = (
    ('SaleOrder' , 'SaleOrder'),
    ('Approved' , 'Approved'),
    ('Outstanding' , 'Outstanding'),
    ('Received' , 'Received'),
    ('Overdue' , 'Overdue'),
)
CASH_CHOICES = (
    ('cash','cash'),
    ('cheque','cheque'),
    ('card','card'),

)


class TermsAndConditions(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    body = models.TextField(max_length=3000 , null=True)
    heading = models.TextField(max_length=100 , null=True)
    default = models.BooleanField(default = False)
    division = models.ForeignKey(Division , related_name='tncs' , null = True)
    prefix = models.CharField(null = True , blank = True, max_length = 60)
    counter = models.PositiveIntegerField(default=1)
    typ = models.TextField(max_length=100 , null=True)

class Sale(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name='outBoundInvoiceUser' , null = True)
    status = models.CharField(default = 'SaleOrder' ,max_length = 30,choices = STATUS_CHOICES)
    isInvoice = models.BooleanField(default = False)
    received = models.BooleanField(default = False)
    cancelled = models.BooleanField(default = False)
    cancelledDate = models.DateField(null = True)
    receivedDate = models.DateField(null = True)
    poNumber = models.CharField(max_length = 50,null=True)
    name = models.CharField(max_length = 100 , null = True)
    personName = models.CharField(max_length = 50 , null = True)
    phone = models.CharField(max_length = 20 , null = True)
    email =  models.CharField(max_length = 50 , null = True)
    address = models.TextField(max_length=200 , null = True)
    pincode = models.CharField(max_length =10, null = True)
    state = models.CharField(max_length = 50, null = True)
    city =  models.CharField(max_length = 50, null = True)
    country =  models.CharField(max_length = 30, null = True)
    pin_status = models.CharField( max_length = 2, default = "1")
    deliveryDate = models.DateField(null = True)
    payDueDate = models.DateField(null = True)
    gstIn = models.CharField(max_length = 30 ,null = True)
    costcenter = models.ForeignKey(CostCenter , related_name='outBoundCostcenter' , null = True)
    bussinessunit =  models.ForeignKey(Unit, related_name='outBoundBusinessunit'  , null = True )
    recDate = models.DateField(null = True)
    total = models.FloatField(null = False, default = 0)
    totalGST = models.FloatField(null = False, default = 0)
    paidAmount = models.FloatField(null = False, default = 0)
    balanceAmount =  models.FloatField(null = False, default = 0)
    division = models.ForeignKey(Division,related_name='divisionOutBoundInvoice',null=True)
    isCash =  models.CharField(max_length = 30,choices = CASH_CHOICES, default = "cash")
    paymentImage = models.ImageField(upload_to = getInvoicesPath ,  null = True)
    paymentRef =  models.CharField(max_length = 100, null = True)
    parent = models.ForeignKey('self',blank = True , null = True)
    account = models.ForeignKey(Account , null = True , related_name = 'salesAccount')
    contact = models.ForeignKey(Contact , null = True , related_name = 'contact')
    terms = models.TextField(max_length=3000 , null = True, blank=True)
    termsandcondition = models.ForeignKey(TermsAndConditions,related_name='termsandcondition',null=True , on_delete=models.SET_NULL)
    serviceFor = models.CharField(max_length = 100 ,null = True)
    isPerforma = models.BooleanField(default = False)
    uniqueId = models.CharField(max_length = 100 ,null = True)
    sameasbilling =  models.BooleanField(default = False)
    billingAddress = models.TextField(max_length=200 , null = True)
    billingPincode = models.CharField(max_length = 50, null = True)
    billingState = models.CharField(max_length = 50, null = True)
    billingCity = models.CharField(max_length = 50, null = True)
    billingCountry = models.CharField(max_length = 50, null = True)



class SalesQty(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    outBound = models.ForeignKey(Sale , related_name='outBoundQty' , null = True)
    product = models.CharField(max_length = 100 , null = True)
    qty = models.PositiveIntegerField(default=1)
    price = models.FloatField(default=1)
    hsn =  models.CharField(max_length = 100 , null = True)
    taxPer = models.FloatField(null = True)
    tax = models.FloatField(null = True)
    total = models.FloatField(null = True)
    division = models.ForeignKey(Division,related_name='divisionOutBoundInvoiceQty',null=True)
    asset = models.CharField(max_length = 100 , null = True)
    addon = models.CharField(max_length = 100 , null = True)

TRANSACTION_TYPE = (
    ('debit' , 'debit'),
    ('credit' , 'credit'),
)


class Transaction(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    dated = models.DateField(null = True)
    type = models.CharField(choices = TRANSACTION_TYPE , null = True , max_length = 50 )
    narration = models.TextField(max_length = 500 , null = True)
    fromAcc = models.ForeignKey(Account , null = True , related_name = 'debits')

    toAcc = models.ForeignKey(Account , null = True , related_name = 'credits')
    #OR the below three fields
    account = models.CharField(max_length = 100 , null = True)
    ifsc = models.CharField(max_length = 100 , null = True)
    bankName = models.CharField(max_length = 100 , null = True)
    user = models.ForeignKey(User , related_name='transactions' , null = False)
    groupId = models.CharField(max_length = 100 , null = True)
    debit = models.FloatField(default=0)
    credit = models.FloatField(default=0)
    balance = models.FloatField(default=0)
    externalRecord = models.BooleanField(default = False)
    externalReferenceID = models.CharField(max_length = 500 , null = True)
    externalConfirmationID = models.CharField(max_length = 30 , null = True)
    api = models.CharField(max_length = 20 , null = True)
    apiCallParams = models.CharField(max_length = 1500 , null = True)
    division = models.ForeignKey(Division,related_name='divisionTransaction',null=True)
    outBound = models.ForeignKey(Sale,related_name='outbondTransaction',null=True)
    tds =  models.FloatField(default=0)
    def __unicode__(self):
        return '<from : %s > , <to : %s > ,  < user : %s>' %(self.fromAcc , self.toAcc  , self.user.username)

APPROVAL_CHOICES = (
    ('Yes' , 'Yes'),
    ('No' , 'No'),
    ('Pending' , 'Pending')
)
STAGE_CHOICES = (
    ('created' , 'created'),
    ('submitted' , 'submitted'),
    ('approved' , 'approved'),
    ('cancelled' , 'cancelled')
)


class ExpenseSheet(models.Model):
    user = models.ForeignKey(User , related_name='expenseGeneratedOrSubmitted' , null = False)
    created = models.DateTimeField(auto_now_add=True)
    approved = models.CharField(default = 'No' ,max_length = 5 ,choices = APPROVAL_CHOICES)
    stage = models.CharField(default = 'created' ,max_length = 20 ,choices = STAGE_CHOICES)
    approvalMatrix = models.PositiveSmallIntegerField(default=1)
    approvalStage = models.PositiveSmallIntegerField(default=0)
    dispensed = models.BooleanField(default = False)
    notes =  models.CharField(max_length = 30 , null = True)
    transaction = models.ForeignKey(Transaction , null = True , related_name = 'expenseSheet')
    submitted = models.BooleanField(default = False)
    totalDisbursed = models.FloatField(default=0)
    comment =  models.CharField(max_length = 1000 , null = True , blank = True)
    division = models.ForeignKey(Division,related_name='divisionExpenseSheet',null=True)
    class Meta:
        ordering = ('-pk', )

class ExpenseHeading(models.Model):
    title = models.CharField(max_length = 40 , null = False)

class Expense(models.Model):
    user = models.ForeignKey(User , related_name='invoiceGeneratedOrSubmitted' , null = False)
    created = models.DateTimeField(auto_now_add=True)
    code = models.CharField(max_length = 200,null=True)
    amount = models.PositiveIntegerField(null=False , default=0)
    currency = models.CharField(max_length = 5 , choices = CURRENCY_CHOICES , null = True)
    dated = models.DateField(null = True)
    attachment = models.FileField(upload_to = getInvoicesPath ,  null = True)
    sheet = models.ForeignKey(ExpenseSheet , related_name='invoices' , null = True)
    transaction = models.ForeignKey(Transaction , null = True , related_name = 'directInvoicePayments')
    description = models.TextField(max_length = 200 , null = False) # describe or justify the expense
    approved = models.BooleanField(default = False) # it is possible to have a sheet with some of the invoices rejected and if the sheet is approved the amount to be paid will be the sum of claims in the approved invoices only
    dispensed = models.BooleanField(default = False)
    gstVal = models.PositiveIntegerField(null=True , default=0)
    gstIN = models.CharField(max_length = 50,null=True)
    invNo =  models.CharField(max_length = 30 , null = True)
    invoiceAmount = models.PositiveIntegerField(null=False , default=0)
    division = models.ForeignKey(Division,related_name='divisionInvoice',null=True)
    def __unicode__(self):
        return ' <amount : %s > , <sheet : %s > , < user : %s >' %(self.amount , self.sheet , self.user.username)


class VendorProfile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    contactPerson = models.CharField(max_length = 100 , null = False)
    mobile = models.CharField(max_length = 12 , null = True)
    email = models.EmailField(null = True)
    paymentTerm = models.PositiveIntegerField(null=True , default=0)
    contentDocs =  models.FileField(upload_to = getcontentDocsPath ,  null = True , blank = True)
    service = models.ForeignKey(service , related_name='vendorprofiles' , null = False)
    bankName = models.CharField(max_length = 100 , null= True)
    accountNumber = models.PositiveIntegerField(null=True)
    ifscCode = models.CharField(max_length = 100 , null= True)
    division = models.ForeignKey(Division,related_name='divisionVendorProfile',null=True)


class VendorService(models.Model):
    vendorProfile = models.ForeignKey(VendorProfile , null = True , related_name='vendorservices')
    particular= models.CharField(max_length = 100 , null = False, unique = True)
    rate = models.PositiveIntegerField(null=True , default=0)
    division = models.ForeignKey(Division,related_name='divisionVendorService',null=True)

class Category(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length = 100 , null = True)
    theme_color = models.CharField(max_length = 100 , null = True)
    division = models.ForeignKey(Division,related_name='divisionCategory',null=True)

class Inventory(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length = 100 , null = True)
    value = models.CharField(max_length = 100 ,default = 0)
    qtyAdded = models.CharField(max_length = 100 ,default = 0)
    rate = models.FloatField(default=1)
    refurnished = models.CharField(max_length = 100 ,default = 0)
    refurnishedAdded = models.CharField(max_length = 100 ,default = 0)
    sellable = models.BooleanField(default = False)
    img1 =  models.ImageField(upload_to = getInventoryImagePath , null = True)
    img2 =  models.ImageField(upload_to = getInventoryImagePath , null = True)
    img3 =  models.ImageField(upload_to = getInventoryImagePath , null = True)
    description = models.TextField(max_length=1000 , null=True)
    category = models.ForeignKey(Category,related_name='categoryInventory',null=True)
    richtxtDesc = models.TextField(max_length=10000 , null=True)
    taxCode  = models.TextField(max_length = 500 , null = True )
    sku = models.CharField(max_length = 100 , null = True )
    buyingPrice = models.FloatField(default=1)#using as discount in product  creation
    division = models.ForeignKey(Division,related_name='divisionInventory',null=True)
    taxRate = models.FloatField(default=0)
    mrp = models.FloatField(default=0)
    stock = models.FloatField(default=0)
    customizationData = models.TextField(max_length=10000 , null=True)
    addonsData = models.TextField(max_length=10000 , null=True)

class InventoryLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    inventory =  models.ForeignKey(Inventory , related_name='inventorylog' , null = True)
    user = models.ForeignKey(User , related_name='inventoryUser' , null = False)
    value = models.CharField(max_length = 100 , default = 0)
    refurnished = models.CharField(max_length = 100 ,default = 0)
    division = models.ForeignKey(Division,related_name='divisionInventoryLog',null=True)





class Disbursal(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    date = models.DateField(null = True)
    disbursed = models.BooleanField(default = False)
    disbursalNote =  models.TextField(max_length=1000 , null=True)
    sourcePk =  models.CharField(max_length = 100 , null = True)
    source =  models.CharField(max_length = 100 , null = True)
    tallyed = models.BooleanField(default = False)
    narration =  models.TextField(max_length=200 , null=True)
    contactPerson = models.CharField(max_length = 100 , null = True)
    accountNumber =  models.CharField(max_length = 100 , null = True)
    bankName =  models.CharField(max_length = 100 , null = True)
    amount = models.FloatField(default= 0)
    ifscCode =  models.CharField(max_length = 100 , null = True)
    account = models.ForeignKey(Account , related_name = "companyAccount" , null=True)
    division = models.ForeignKey(Division,related_name='divisionDisbursal',null=True)



STATUS_CHOICES_INVOICE = (
    ('created' , 'created'),
    ('Sent' , 'Sent'),
    ('GRN' , 'GRN'),
    ('Approved' , 'Approved'),
    ('paid' , 'paid'),
    ('rejected' , 'rejected'),
    # ('NotReceivedAndArchived' , 'NotReceivedAndArchived'),
    # ('Reconciled' , 'Reconciled'),
)

TYPE_CHOICES = (
    ('INVOICE' , 'INVOICE'),
    ('EXPENSES' , 'EXPENSES'),
)


class InvoiceReceived(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name='invoiceUsers' , null = True)
    status = models.CharField(default = 'created' ,max_length = 30 ,choices = STATUS_CHOICES_INVOICE)
    companyName = models.CharField(max_length = 100 , null = True)
    personName = models.CharField(max_length = 100 , null = True)
    phone = models.CharField(max_length = 20 , null = True)
    email =  models.CharField(max_length = 50 , null = True)
    address = models.TextField(max_length=200 , null = True)
    pincode = models.CharField(max_length =10, null = True)
    state = models.CharField(max_length = 50, null = True)
    city =  models.CharField(max_length = 50, null = True)
    country =  models.CharField(max_length = 30, null = True)
    deliveryDate = models.DateField(null = True, blank=True)
    paymentDueDate = models.DateField(null = True)
    gstIn = models.CharField(max_length = 30 ,null = True)
    costcenter = models.ForeignKey(CostCenter , related_name='invoiceCostcenter' , null = True)
    accNo =  models.CharField(max_length = 30, null = True)
    ifsc = models.CharField(max_length = 30, null = True)
    bankName =  models.CharField(max_length = 30, null = True)
    invNo =  models.CharField(max_length = 50, null = True)
    account = models.ForeignKey(Account, related_name='invoiceAccount' , null = True)
    division = models.ForeignKey(Division,related_name='invoiceDivision',null=True)
    totalAmount = models.FloatField(default=0)
    balanceAmount = models.FloatField(default=0)
    paidAmount = models.FloatField(default=0)
    companyReference = models.ForeignKey(service,related_name='invoiceCompany',null=True)
    note = models.TextField(max_length=500 , null = True)
    invType =  models.CharField(default = 'INVOICE',choices = TYPE_CHOICES ,max_length = 30)
    title = models.CharField(max_length = 200 , null = True)
    uniqueId = models.CharField(max_length = 200 , null = True)


class InvoiceQty(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    invoice = models.ForeignKey(InvoiceReceived , related_name='parentInvoice' , null = True)
    product = models.CharField(max_length = 100 , null = True) #USED AS TITLE IF EXPENSES
    description = models.TextField(max_length = 200 , null = True) #REQUIRED IF EXPENSES
    price = models.FloatField(default=1)
    taxCode =  models.CharField(max_length = 100 , null = True)
    taxPer = models.FloatField(null = True)
    tax = models.FloatField(null = True)
    total = models.FloatField(null = True)
    receivedQty = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User , related_name='invoiceQtyUsers' , null = True)
    attachment = models.FileField(upload_to = getInvoicesPath ,  null = True) #REQUIRED IF EXPENSES
    data =  models.TextField(max_length = 2000 , null = True)

class Cart(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    contact = models.ForeignKey(Contact , related_name = 'carts' , null = True)
    product = models.ForeignKey(Inventory , related_name = 'carts' , null = True)
    qty = models.PositiveIntegerField(default=0)
    price = models.FloatField(default=1)
    total = models.FloatField(default=1)
    division = models.ForeignKey(Division,related_name='carts',null=True)
    addon = models.TextField(max_length=500 , null = True)
    customisation = models.TextField(max_length=500 , null = True)
    class Meta:
        unique_together = ('contact', 'product')
