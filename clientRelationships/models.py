from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from ERP.models import service
from time import time
from django.dispatch import receiver
from django.db.models.signals import pre_save
from datetime import datetime
import pytz
from organization.models import Division
from django.db.models.signals import post_save

# Create your models here.
def getClientRelationshipContactDP(instance , filename ):
    return 'clientRelationships/dp/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

def getClientRelationshipContract(instance , filename ):
    return 'clientRelationships/contracts/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

def getClientRelationshipTerms(instance , filename ):
    return 'clientRelationships/terms/%s_%s' % (str(time()).replace('.', '_'), filename)



class CRMTermsAndConditions(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    body = models.TextField(max_length=3000 , null=True)
    heading = models.TextField(max_length=100 , null=True)
    default = models.BooleanField(default = False)
    division = models.ForeignKey(Division , related_name='CRMtncs' , null = True)
    extraFieldOne = models.TextField(max_length=100 , null=True)
    extraFieldTwo = models.TextField(max_length=100 , null=True)
    isGst = models.BooleanField(default = False)
    companyPamphlet = models.FileField(upload_to= getClientRelationshipTerms , null = True)
    themeColor = models.CharField(null = True , blank = True, max_length = 60)
    message =  models.TextField(max_length=1000 , null=True)
    version = models.CharField(null = True , blank = True, max_length = 60)
    name = models.CharField(null = True , blank = True, max_length = 60)
    prefix = models.CharField(null = True , blank = True, max_length = 60)
    counter = models.PositiveIntegerField(default=1)
    canSupplyOrder =  models.BooleanField(default = False)
    canInvoice =  models.BooleanField(default = False)
    logo = models.FileField(upload_to= getClientRelationshipTerms , null = True)

CONTACTS_CHOICES = (
    ('b2b' , 'b2b'),
    ('student' , 'student')
)

class Contact(models.Model):
    user = models.ForeignKey(User , related_name = 'contacts' , null = True) # the user created it
    name = models.CharField(max_length = 100 , null = False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    company = models.ForeignKey(service , null = True , related_name='contacts')
    email = models.CharField(null = True , blank = True, max_length = 60)
    emailSecondary = models.CharField(null = True , blank = True, max_length = 60)
    mobile = models.CharField(max_length = 12 , null = True , blank = True)
    mobileSecondary = models.CharField(max_length = 12 , null = True , blank = True)
    designation = models.CharField(max_length = 30 , null = True , blank = True)
    notes = models.TextField(max_length=300 , null=True , blank = True)
    linkedin = models.CharField(max_length = 100 , null = True , blank = True)
    facebook = models.CharField(max_length = 100 , null = True, blank = True)
    dp = models.FileField(null = True , upload_to = getClientRelationshipContactDP)
    male = models.BooleanField(default = True)
    street = models.TextField(max_length = 500 , null = True , blank = True)
    city = models.CharField(max_length = 100 , null = True , blank = True)
    pincode = models.CharField(max_length = 100 , null = True, blank = True)
    state = models.CharField(max_length = 100 , null = True, blank = True)
    country = models.CharField(max_length = 100 , null = True, blank = True)
    isGst =  models.BooleanField(default = False)
    started = models.DateField(null = True)
    ended = models.DateField(null = True)
    division = models.ForeignKey(Division , related_name='divisionContacts' , null = True)
    typ = models.CharField(choices = CONTACTS_CHOICES , max_length = 50 , default = 'b2b')
    isFav =  models.BooleanField(default = False)

class CustomerSession(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    email = models.CharField(max_length = 50)
    otp = models.CharField(max_length = 5, null = True)
    sessionId = models.CharField(max_length = 35, null = True)
    contact = models.ForeignKey(Contact , related_name='customerSessions' , null = True)
    company = models.ForeignKey(service , related_name='customers' , null = True)
    typ = models.CharField(max_length = 15 , null = True)

CURRENCY_CHOICES = (
    ('INR' , 'INR'),
    ('USD' , 'USD')
)


DEAL_STATE_CHOICES = (
    ('created' , 'created'),
    ('contacted' , 'contacted'),
    ('demo' , 'demo'),
    ('requirements' , 'requirements'),
    ('proposal' , 'proposal'),
    ('negotiation' , 'negotiation'),
    ('conclusion' , 'conclusion'),
)


RESULT_CHOICES = (
    ('na' , 'na'),
    ('won' , 'won'),
    ('lost' , 'lost'),
)



class Deal(models.Model):
    user = models.ForeignKey(User , related_name = 'dealsCreated' , null = False) # the user created it
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 100 , null = False)
    updated = models.DateTimeField(auto_now=True)
    company = models.ForeignKey(service , null = False , related_name='deals')
    value = models.PositiveIntegerField(null=True , default=0)
    currency = models.CharField(choices = CURRENCY_CHOICES , max_length = 4 , default = 'INR')
    state = models.CharField(choices = DEAL_STATE_CHOICES , max_length = 13 , default = 'created')
    contacts = models.ForeignKey(Contact , related_name='deals' , blank = True)
    internalUsers = models.ManyToManyField(User , related_name='deals' , blank = True)
    probability = models.SmallIntegerField(default=100)
    closeDate = models.DateTimeField(null = True)
    active = models.BooleanField(default = True)
    result = models.CharField(choices = RESULT_CHOICES , max_length = 4 , default = 'na')
    doc = models.FileField(upload_to= getClientRelationshipContract , null = True)


def getClientRelationshipActivity(instance , filename ):
    return 'clientRelationships/activity/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)



CONTRACT_STATE_CHOICES = (
    ('cancelled' , 'cancelled'),
    ('quoted' , 'quoted'),
    ('approved' , 'approved'),
    ('inProgress' , 'inProgress'),
    ('billed' , 'billed'),
    ('oow' , 'oow'),
    ('received' , 'received'),
    ('dueElapsed' , 'dueElapsed'),
    ('lost' , 'lost'),
)



class Contract(models.Model): # invoices actually
    user = models.ForeignKey(User , related_name = 'contracts' , null = False) # the user created it
    created = models.DateTimeField(auto_now_add = True) # quoted date
    updated = models.DateTimeField(auto_now=True)
    value = models.FloatField(default=0)
    deal = models.ForeignKey(Deal , null = True , related_name='contracts')
    contact = models.ForeignKey(Contact , null = True , related_name='contracts')
    status = models.CharField(choices = CONTRACT_STATE_CHOICES , max_length=10 , default = 'quoted')
    dueDate = models.DateField(null = True)
    details = models.TextField(max_length=10000 , null=True)
    data = models.TextField(null = True , max_length = 20000)
    billedDate = models.DateTimeField(null = True)
    recievedDate = models.DateTimeField(null = True)
    archivedDate = models.DateTimeField(null = True)
    approvedDate = models.DateTimeField(null = True)
    grandTotal = models.FloatField(default=0)
    totalTax = models.FloatField(default=0)
    read = models.BooleanField(default = False)
    frm = models.ForeignKey(User , related_name = 'quotationsSent' , null = True)
    templateName = models.CharField(max_length = 100 , null = True)
    files = models.CharField(max_length = 5000 , null = True)
    trackingCode = models.CharField(max_length = 5000 , null = True)
    readDateAndTime = models.DateTimeField(null = True)
    termsAndCondition =  models.ForeignKey(CRMTermsAndConditions , null = True , related_name='termsandconditions', on_delete=models.SET_NULL)

    identifier =  models.CharField(max_length = 100 , null = True) # we need to take it from UNIT code

    termsAndConditionTxts = models.TextField(max_length = 10000 , null = True, blank = True)
    discount = models.FloatField(default=0)
    heading = models.CharField(max_length = 300 , null = True)
    division = models.ForeignKey(Division , related_name='quotations' , null = True)
    uniqueId =  models.CharField(max_length = 300 , null = True)


@receiver(pre_save, sender=Contract)
def model_pre_save(sender, instance, **kwargs):
    print instance.user
    try:
        instance._pre_save_instance = Contract.objects.get(pk=instance.pk)
    except Contract.DoesNotExist:
        instance._pre_save_instance = instance



@receiver(signal=post_save, sender=Contract)
def model_post_save(sender, instance, created, **kwargs):
    pre_save_instance = instance._pre_save_instance
    post_save_instance = instance
    contract = post_save_instance
    grandTotal = post_save_instance.grandTotal
    discount = post_save_instance.discount
    data = post_save_instance.data
    heading = post_save_instance.heading
    termsAndConditionTxts = post_save_instance.termsAndConditionTxts
    ContractTracker.objects.create(user = instance.user , grandTotal = grandTotal , contract = contract , discount = discount, data = data , termsAndConditionTxts = termsAndConditionTxts , heading = heading)


ACTIVITY_CHOICES = (
    ('call', 'call'),
    ('meeting', 'meeting'),
    ('mail', 'mail'),
    ('todo', 'todo'),
    ('note', 'note'),
    ('stateChange', 'stateChange'),
)

class Activity(models.Model):
    user = models.ForeignKey(User , related_name = 'activities' , null = False) # the user created it
    created = models.DateTimeField(auto_now_add = True)
    typ = models.CharField(choices = ACTIVITY_CHOICES , default = 'call', max_length =11 )
    data = models.CharField(max_length = 300 , null = False)
    deal = models.ForeignKey(Deal, related_name = 'activities' , null = True)
    contact = models.ForeignKey(Contact, related_name = 'activities' , null = True)
    notes = models.TextField(max_length= 5000 , null = True)
    doc = models.FileField(upload_to= getClientRelationshipActivity , null = True)
    contacts = models.ManyToManyField(Contact , related_name='activitiesMentioned', blank=True)
    internalUsers = models.ManyToManyField(User , related_name='activitiesMentioned', blank=True)

@receiver(pre_save, sender=Contract, dispatch_uid="update_contract_details")
def update_contract_details(sender, instance, **kwargs):
    print "setting the dates"
    if instance.status == 'billed':
        instance.billedDate = datetime.now(pytz.timezone('Asia/Kolkata'))
    elif instance.status == 'received':
        instance.recievedDate = datetime.now(pytz.timezone('Asia/Kolkata'))
    elif instance.status == 'cancelled':
        instance.archivedDate = datetime.now(pytz.timezone('Asia/Kolkata'))
    elif instance.status == 'approved':
        instance.approvedDate = datetime.now(pytz.timezone('Asia/Kolkata'))


def getFilesUpload(instance , filename ):
    return 'clientRelationships/files/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

class Files(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = 'crmfiles' , null = False)
    attachment = models.FileField(upload_to= getFilesUpload , null = True)
    version = models.CharField(max_length = 300 , null = True)
    title = models.CharField(max_length = 300 , null = True)
    description = models.CharField(max_length = 300 , null = True)
    filename = models.CharField(max_length = 300 , null = True)
    rawFiles = models.FileField(upload_to= getFilesUpload , null = True)

class EmailTemplate(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = 'templatesCreated' , null = False)
    title = models.CharField(max_length = 300 , null = True)
    description = models.CharField(max_length = 300 , null = True)
    template = models.TextField(max_length=2000 , null = False)
    files = models.ManyToManyField(Files , related_name='emailTemplates' , blank = True)
    creator =  models.BooleanField(default = False)

def getSignedContractPath(instance , filename ):
    return 'clientRelationships/contracts/%s_%s' % (str(time()).replace('.', '_'), filename)


class LegalAgreement(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    signed = models.BooleanField(default = False)
    signedOn = models.DateTimeField(null = True)
    title = models.CharField(default = "Information Technology Professional Services Agreement" , max_length = 1000)
    deal = models.OneToOneField(Deal , related_name='contract' )
    sent = models.BooleanField(default = False)
    sentOn = models.DateTimeField(null = True)
    signature = models.TextField(max_length=10000 , null = True)
    authrizer = models.ForeignKey(User , related_name='dealsSigned', null = True)
    witness1 = models.CharField(max_length = 1000, null = True , blank = True)
    witness2 = models.CharField(max_length = 1000, null = True , blank = True)
    effectiveDate = models.DateTimeField(null = True)
    effectiveDateEnd = models.DateTimeField(null = True)
    signedDoc = models.FileField(upload_to=getSignedContractPath , null = True)

AGREEMENT_TERM_CHOICES = (
    ('para' , 'para'),
    ('point' , 'point'),
    ('table' , 'table'),
)

class LegalAgreementTerms(models.Model):
    parent = models.ForeignKey(LegalAgreement , related_name='terms' , null = False)
    typ = models.CharField(default = 'para' , choices = AGREEMENT_TERM_CHOICES, max_length = 10)
    content = models.TextField(max_length=10000 , null = False)


class ContractTracker(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name = 'contractTrackerUser' , null = False)
    grandTotal =  models.FloatField(default=0)
    contract = models.ForeignKey(Contract , related_name = 'contractTrackerContract' , null = False)
    data = models.TextField(null = True , max_length = 20000)
    discount = models.FloatField(default=0)
    termsAndConditionTxts = models.TextField(max_length = 10000 , null = True, blank = True)
    heading = models.CharField(max_length = 300 , null = True)

class ConfigureTermsAndConditions(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    body = models.TextField(max_length=3000 , null=True)
    heading = models.TextField(max_length=100 , null=True)
    default = models.BooleanField(default = False)
    division = models.ForeignKey(Division , related_name='termsandconditions' , null = True)
    prefix = models.CharField(null = True , blank = True, max_length = 60)
    counter = models.PositiveIntegerField(default=1)


TICKET_CHOICES = (
    ('created' , 'created'),
    ('upcoming' , 'upcoming'),
    ('assigned' , 'assigned'),
    ('ongoing' , 'ongoing'),
    ('completed' , 'completed'),
    ('postponed' , 'postponed'),
    ('cancelled' , 'cancelled'),
)


class RegisteredProducts(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    contact = models.ForeignKey(Contact , related_name='products' , null = True)
    productName = models.TextField(max_length=400 , null = False)
    period = models.CharField(max_length=20 , null = False)
    totalServices = models.PositiveIntegerField(default = 1)
    serialNo = models.CharField(max_length=30 , null = False)
    notes = models.TextField(max_length=500 , null = False)
    seperateAddress = models.BooleanField(default=False)
    installationAddress = models.TextField(max_length=300 , null = False)
    pincode = models.CharField(max_length=20 , null = False)
    city = models.CharField(max_length=20 , null = False)
    state = models.CharField(max_length=20 , null = False)
    country = models.CharField(max_length=20 , null = False)
    startDate = models.DateField(null=True)


class ServiceTicket(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    closedOn = models.DateTimeField(null=True)
    preferredTimeSlot = models.CharField(max_length=20 , null = True)
    preferredDate = models.DateField(null = True)
    referenceContact = models.ForeignKey(Contact , related_name='tickets' , null = True)
    referenceAMC = models.ForeignKey(RegisteredProducts , related_name='tickets' , null = True)
    name = models.CharField(max_length=150 , null= True)
    phone = models.CharField(max_length=150 , null= True)
    email = models.CharField(max_length=150 , null= True)
    productName = models.CharField(max_length=150 , null= True)
    productSerial = models.CharField(max_length=150 , null= True)
    warrantyStatus = models.CharField(max_length=150 , null= True)
    notes = models.TextField(max_length=850 , null= True)
    address = models.TextField(max_length=550 , null= True)
    pincode = models.CharField(max_length=150 , null= True)
    city = models.CharField(max_length=150 , null= True)
    state = models.CharField(max_length=150 , null= True)
    country = models.CharField(max_length=150 , null= True)
    requireOnSiteVisit = models.BooleanField(default=False)
    engineer = models.ForeignKey(User , related_name='tickets' , null = True)
    status = models.CharField(max_length=50 , default='created' , choices=TICKET_CHOICES)
    postponeCount = models.PositiveIntegerField(default = 0)
    engineersNotes = models.TextField(max_length=850 , null= True)
    division =  models.ForeignKey(Division , related_name='tickets' , null = True)
    serviceType =  models.CharField(max_length=150 , null= True)
    uniqueId = models.CharField(max_length=150 , null= True)
