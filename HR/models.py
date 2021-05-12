from django.db import models
from django.contrib.auth.models import User, Group
from time import time

import datetime
from allauth.socialaccount.signals import social_account_added
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib import admin
from ERP.models import *
from django.db.models.signals import post_save , pre_delete
# from marketing.models import Contacts
# from marketing.models import CampaignItem

def getSignaturesPath(instance , filename):
    return 'HR/images/Sign/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getDisplayPicturePath(instance , filename):
    return 'HR/images/DP/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

def getTNCandBondPath(instance , filename ):
    return 'HR/doc/TNCBond/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getResumePath(instance , filename ):
    return 'HR/doc/Resume/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getCertificatesPath(instance , filename ):
    return 'HR/doc/Cert/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getTranscriptsPath(instance , filename ):
    return 'HR/doc/Transcripts/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getOtherDocsPath(instance , filename ):
    return 'HR/doc/Others/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getResignationDocsPath(instance , filename):
    return 'HR/doc/resignation/%s_%s' % (str(time()).replace('.', '_'), filename)
def getVehicleRegDocsPath(instance , filename):
    return 'HR/doc/vehicleRegistration/%s_%s' % (str(time()).replace('.', '_'), filename)
def getAppointmentAcceptanceDocsPath(instance , filename):
    return 'HR/doc/appointmentAcceptance/%s_%s' % (str(time()).replace('.', '_'), filename)
def getPANDocsPath(instance , filename):
    return 'HR/doc/pan/%s_%s' % (str(time()).replace('.', '_'), filename)
def getDrivingLicenseDocsPath(instance , filename):
    return 'HR/doc/drivingLicense/%s_%s' % (str(time()).replace('.', '_'), filename)
def getChequeDocsPath(instance , filename):
    return 'HR/doc/cheque/%s_%s' % (str(time()).replace('.', '_'), filename)
def getPassbookDocsPath(instance , filename):
    return 'HR/doc/passbook/%s_%s' % (str(time()).replace('.', '_'), filename)
def getOtherDocsPath(instance , filename ):
    return 'HR/doc/Others/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getDocuemtsPath(instance , filename ):
    return 'HR/doc/Documents/%s_%s' % (str(time()).replace('.', '_'), filename)


class Document(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length=400, blank=True)
    description = models.CharField(max_length=400, blank=True)
    documentFile = models.FileField(upload_to = getDocuemtsPath ,  null = True)
    division = models.ForeignKey(Division,related_name='divisionDocuments',null=True)

    def __str__(self):
        return "%s" %( self.description)

admin.site.register(Document)

class profile(models.Model):
    user = models.OneToOneField(User)
    PREFIX_CHOICES = (
        ('NA' , 'NA'),
        ('Kumar' , 'Kumar'),
        ('Kumari' , 'Kumari'),
        ('Smt' , 'Smt'),
        ('Shri' ,'Shri'),
        ('Dr' ,'Dr'),
    )
    GENDER_CHOICES = (
        ('M' , 'Male'),
        ('F' , 'Female'),
        ('O' , 'Other'),
    )
    EMPLOYEE_TYPE_CHOICES = (
        ('full time' , 'full time'),
        ('part time' , 'part time'),
    )
    JOB_CHOICES = (
        ('Telecaller' , 'Telecaller'),
        ('Technician' , 'Technician'),
        ('Others' , 'Others'),
    )
    empID = models.PositiveIntegerField(unique = True , null = True)
    empType = models.CharField(choices = EMPLOYEE_TYPE_CHOICES , default = 'full time' , max_length = 40)
    displayPicture = models.ImageField(upload_to = getDisplayPicturePath)
    dateOfBirth = models.DateField( null= True )
    anivarsary = models.DateField( null= True )
    married = models.BooleanField(default = False)
    permanentAddressStreet = models.TextField(max_length = 100 , null= True , blank=True)
    permanentAddressCity = models.CharField(max_length = 15 , null= True , blank=True)
    permanentAddressPin = models.IntegerField(null= True ,  blank=True)
    permanentAddressState = models.CharField(max_length = 20 , null= True , blank=True)
    permanentAddressCountry = models.CharField(max_length = 20 , null= True , blank=True)
    sameAsLocal = models.BooleanField(default = False)
    localAddressStreet = models.TextField(max_length = 100 , null= True )
    localAddressCity = models.CharField(max_length = 15 , null= True )
    localAddressPin = models.IntegerField(null= True )
    localAddressState = models.CharField(max_length = 20 , null= True )
    localAddressCountry = models.CharField(max_length = 20 , null= True )
    prefix = models.CharField(choices = PREFIX_CHOICES , default = 'NA' , max_length = 4)
    gender = models.CharField(choices = GENDER_CHOICES , default = 'M' , max_length = 6)
    email = models.EmailField(max_length = 50)
    mobile = models.CharField(null = True , max_length = 14,unique = True)
    emergency = models.CharField(null = True , max_length = 100) # supposed to be a "name:number" format
    website = models.URLField(max_length = 100 , null = True , blank = True)
    sign = models.FileField(upload_to = getSignaturesPath ,  null = True)
    IDPhoto = models.FileField(upload_to = getDisplayPicturePath ,  null = True) # aadhar
    TNCandBond = models.FileField(upload_to = getTNCandBondPath ,  null = True)
    resume = models.FileField(upload_to = getResumePath ,  null = True)
    certificates = models.FileField(upload_to = getCertificatesPath ,  null = True)
    transcripts = models.FileField(upload_to = getTranscriptsPath ,  null = True)
    otherDocs = models.FileField(upload_to = getOtherDocsPath ,  null = True , blank = True)
    resignation = models.FileField(upload_to = getResignationDocsPath ,  null = True , blank = True)
    vehicleRegistration = models.FileField(upload_to = getVehicleRegDocsPath ,  null = True , blank = True)
    appointmentAcceptance = models.FileField(upload_to = getAppointmentAcceptanceDocsPath ,  null = True , blank = True)
    pan = models.FileField(upload_to = getPANDocsPath ,  null = True , blank = True)
    drivingLicense = models.FileField(upload_to = getDrivingLicenseDocsPath ,  null = True , blank = True)
    cheque = models.FileField(upload_to = getChequeDocsPath ,  null = True , blank = True)
    passbook = models.FileField(upload_to = getPassbookDocsPath ,  null = True , blank = True)
    bloodGroup = models.CharField(max_length = 20 , null = True)
    almaMater = models.CharField(max_length = 100 , null = True)
    pgUniversity = models.CharField(max_length = 100 , null = True , blank = True)
    docUniversity = models.CharField(max_length = 100 , null = True , blank = True)
    fathersName = models.CharField(max_length = 100 , null = True)
    mothersName = models.CharField(max_length = 100 , null = True)
    wifesName = models.CharField(max_length = 100 , null = True , blank = True)
    childCSV = models.CharField(max_length = 100 , null = True , blank = True)
    note1 = models.TextField(max_length = 500 , null = True , blank = True)
    note2 = models.TextField(max_length = 500 , null = True , blank = True)
    note3 = models.TextField(max_length = 500 , null = True , blank = True)
    lat = models.FloatField(null=False , default=0)
    lon = models.FloatField(null=False , default=0)
    last_updated = models.DateTimeField(auto_now=True)
    location_track = models.BooleanField(default=False)
    job_type = models.CharField(choices = JOB_CHOICES , default = 'Others' , max_length = 20)
    battery_level = models.FloatField(null=False , default=0)
    expoPushToken = models.CharField(null = True , max_length = 300, blank = True)
    linkToken = models.CharField(null = True , max_length = 300, blank = True)
    contact = models.CharField(null = True , max_length = 100, blank = True) # using as emergency contact
    nextlat = models.FloatField(null=False , default=0)
    nextlng = models.FloatField(null=False , default=0)
    sipUserName = models.CharField(null=True , max_length = 100)
    sipExtension = models.CharField(null=True , max_length = 100)
    sipPassword = models.CharField(null=True , max_length = 100)
    isDashboard = models.BooleanField(default=False)
    isManager = models.BooleanField(default=False)
    adhar = models.CharField(null = True , max_length = 100, blank = True)
    onboarding = models.BooleanField(default=False)
    apps = models.TextField(null = True , max_length=6000)
    zoom_token = models.TextField(null=True)
    postCount = models.PositiveIntegerField(default = 0)
    lastState = models.CharField(null=True , max_length = 200)
    newReg =  models.BooleanField(default=False)
    lang = models.CharField(null=True , max_length = 200)
    countryCode = models.CharField(null=True , max_length = 200)


User.profile = property(lambda u : profile.objects.get_or_create(user = u)[0])

class Team(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    manager = models.ForeignKey(User , related_name = "teamManager", null=True)
    title =  models.CharField(max_length = 100)
    unit = models.ForeignKey( Unit , null = True , related_name = "teamUnit" )
    isOnSupport = models.BooleanField(default=False)

class designation(models.Model):

    user = models.OneToOneField(User)
    division = models.ForeignKey( Division ,related_name='designations', null = True )
    unit = models.ForeignKey( Unit , null = True )
    role = models.ForeignKey( Role , null = True)
    hrApprover = models.ForeignKey(User , related_name = "hrTo" , null=True)
    reportingTo = models.ForeignKey(User , related_name = "managing" , null=True)
    primaryApprover = models.ForeignKey(User, related_name = "approving" , null=True)
    secondaryApprover = models.ForeignKey(User , related_name = "alsoApproving" , null=True)
    team = models.ForeignKey(Team , related_name = "teamName", null=True)




User.designation = property(lambda u : designation.objects.get_or_create(user = u)[0])


@receiver(user_signed_up, dispatch_uid="user_signed_up")
def user_signed_up_(request, user, **kwargs):
    user.username = user.email+str(user.pk)
    user.save()


LEAVES_CHOICES = (
    ('AL','AL'),
    ('ML','ML'),
    ('casual','casual')
)
STATUS_CHOICES = (
    ('inProcess','inProcess'),
    ('approved','approved'),
    ('rejected','rejected'),
    ('cancelled','cancelled')
)


class Leave(models.Model):
    user = models.ForeignKey(User , related_name = "leavesAuthored" , null=True)
    created = models.DateField(auto_now=True)
    fromDate = models.DateField( null= True )
    toDate = models.DateField( null= True )
    days = models.PositiveIntegerField(null = True)
    leavesCount = models.PositiveIntegerField(null = True)
    approved = models.BooleanField(default = False)
    category = models.CharField(choices = LEAVES_CHOICES , max_length = 100 , null = False)
    status = models.CharField(choices = STATUS_CHOICES , max_length = 100 , null = False ,default='inProcess')
    approvedBy = models.ManyToManyField(User , related_name='leaves' , blank = True)
    comment = models.CharField(max_length = 10000 , null = True)
    approvedStage = models.PositiveIntegerField(null = True,default=0)
    approvedMatrix = models.PositiveIntegerField(null = True,default=1)
    accounted = models.BooleanField(default = False)


class ExitManagement(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    user = models.OneToOneField(User)
    security = models.BooleanField(default = False)
    it = models.BooleanField(default = False)
    hr = models.BooleanField(default = False)
    finance = models.BooleanField(default = False)
    started = models.BooleanField(default = False)
    manager = models.ForeignKey(User , related_name = "manager" , null=True)
    superManager = models.ForeignKey(User , related_name = "superManager" , null=True)
    managersApproval = models.BooleanField(default = False)
    superManagerApproval = models.BooleanField(default = False)
    securityApprovedDate = models.DateTimeField(null = True)
    itApprovedDate = models.DateTimeField(null = True)
    hrApprovedDate = models.DateTimeField(null = True)
    financeApprovedDate = models.DateTimeField(null = True)
    managerApprovedDate = models.DateTimeField(null = True)
    superManagerApprovedDate = models.DateTimeField(null = True)
    comment =  models.CharField(max_length = 1000 , null = True , blank = True)
    finalSettlment = models.FileField(upload_to=getOtherDocsPath ,  null = True)
    resignation = models.FileField(upload_to=getOtherDocsPath ,  null = True)
    notice  = models.FileField(upload_to=getOtherDocsPath ,  null = True)
    lastWorkingDate = models.DateField(auto_now=True)
    is_exited =  models.BooleanField(default = False)

class Appraisal(models.Model):
    created = models.DateField(auto_now=True)
    createdUser = models.ForeignKey(User , related_name = "appraisalCreated")
    user = models.ForeignKey(User , related_name = "appraisalUser")
    userCmt = models.TextField(null = True)
    userAmount = models.PositiveIntegerField(null = True)
    manager = models.ForeignKey(User , related_name = "managerAppraisal" , null = True)
    managerAmt = models.PositiveIntegerField(null = True)
    managerCmt = models.TextField(null = True)
    superManager = models.ForeignKey(User , related_name = "superManagerAppraisal" , null = True)
    superManagerAmt = models.PositiveIntegerField(null = True)
    superManagerCmt = models.TextField(null = True)
    hr = models.ForeignKey(User , related_name = "hrAppraisal" , null = True)
    hrCmt = models.TextField(null = True)
    finalAmount = models.PositiveIntegerField(null = True)
    status = models.CharField(max_length = 25,default = 'Created',null = True)
