from __future__ import unicode_literals
from django.contrib.auth.models import User, Group
from time import time
from django.db import models
from website.models import Page
from django.utils import timezone
# Create your models here.

KEY_CHOICES = (
    ('hashed', 'hashed'),
    ('otp', 'otp')
)

class accountsKey(models.Model):
    user = models.ForeignKey(User , related_name='accountKey')
    activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField(default=timezone.now)
    keyType = models.CharField(max_length = 6 , default = 'hashed' , choices = KEY_CHOICES)



def getERPPictureUploadPath(instance , filename ):
    return 'ERP/pictureUploads/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

def getappMediauploadPath(instance , filename ):
    return 'ERP/appmedia/%s_%s' % (str(time()).replace('.', '_'), filename)

class GenericPincode(models.Model):
    state = models.CharField(max_length = 35, null = True)
    city =  models.CharField(max_length = 35, null = True)
    country =  models.CharField(max_length = 35, default="India")
    pincode = models.CharField( max_length = 7, null = True)
    pin_status = models.CharField( max_length = 2, default = "1")

class application(models.Model):
    # each application in a module will have an instance of this model
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 50 , null = False)
    icon = models.TextField(max_length = 500 , null = True )
    haveCss = models.BooleanField(default = True)
    haveJs = models.BooleanField(default = True)
    published = models.BooleanField(default = True)
    admin = models.BooleanField(default = False)
    # only selected users can assign access to the application to other user
    module = models.CharField(max_length = 500 , null = False)
    description = models.CharField(max_length = 500 , null = False)
    parent = models.ForeignKey("self" , null = True, related_name="children")
    displayName = models.CharField(max_length = 30 , null = True )
    stateAlias = models.CharField(max_length = 30 , null = True )
    url = models.CharField(max_length = 100 , null = True )
    index = models.PositiveIntegerField(default=0)
    android = models.BooleanField(default = False)
    windows = models.BooleanField(default = False)
    ios = models.BooleanField(default = False)
    mac = models.BooleanField(default = False)
    rating_five =  models.CharField(max_length = 30 , default="5" )
    rating_four =  models.CharField(max_length = 30 , default="4" )
    rating_three =  models.CharField(max_length = 30 , default="3" )
    rating_two =  models.CharField(max_length = 30 , default="2" )
    rating_one =  models.CharField(max_length = 30 , default="1" )
    appStoreUrl = models.TextField(max_length = 500 , null = True )
    playStoreUrl = models.TextField(max_length = 500 , null = True )
    inMenu = models.BooleanField(default = True)
    totalRatings = models.FloatField(null=True , default=0)
    def __unicode__(self):
        return self.name


class appSettingsField(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 250 , null = False )
    heading = models.CharField(max_length = 250 , null = True )
    app = models.ForeignKey(application , related_name='settings' , null = True)
    state=models.CharField(max_length=200, null = True)
    def __unicode__(self):
        return self.name
    class Meta:
        unique_together = ('name', 'app',)


class PublicApiKeys(models.Model):
    active = models.BooleanField(default = False)
    user = models.ForeignKey(User , related_name='publicApiKeysOwned') # the user who is authorized to use this api
    key = models.CharField(max_length = 30 , null = False)
    created = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(User , related_name = 'apiKeyAdministrator') # who kind of created it and can toggle active flag
    usageRemaining = models.PositiveIntegerField(default=0) # balance remaining
    app = models.ForeignKey(application , null = False)

class ApiUsage(models.Model): # to store the monthly api usage for the api
    api = models.ForeignKey(PublicApiKeys, related_name= 'usages')
    count = models.PositiveIntegerField(default=0)
    month = models.PositiveIntegerField(default=0) # assuming 0 for the month of January 2017 and 1 for february and so on

class permission(models.Model):
    app = models.ForeignKey(application , null=False , related_name="permissions")
    user = models.ForeignKey(User , related_name = "accessibleApps" , null=False)
    givenBy = models.ForeignKey(User , related_name = "approvedAccess" , null=False)
    created = models.DateTimeField(auto_now_add = True)
    def __unicode__(self):
        return self.app.name


MEDIA_TYPE_CHOICES = (
    ('onlineVideo' , 'onlineVideo'),
    ('video' , 'video'),
    ('image' , 'image'),
    ('onlineImage' , 'onlineImage'),
    ('doc' , 'doc'),
)

class media(models.Model):
    user = models.ForeignKey(User , related_name = 'serviceDocsUploaded' , null = False)
    created = models.DateTimeField(auto_now_add = True)
    link = models.TextField(null = True , max_length = 300) # can be youtube link or an image link
    attachment = models.FileField(upload_to = getERPPictureUploadPath , null = True ) # can be image , video or document
    mediaType = models.CharField(choices = MEDIA_TYPE_CHOICES , max_length = 10 , default = 'image')

class address(models.Model):
    street = models.CharField(max_length=300 , null = True , blank = True)
    city = models.CharField(max_length=100 , null = True , blank = True)
    state = models.CharField(max_length=50 , null = True , blank = True)
    pincode = models.PositiveIntegerField(null = True , blank = True)
    lat = models.CharField(max_length=15 ,null = True , blank = True)
    lon = models.CharField(max_length=15 ,null = True , blank = True)
    country = models.CharField(max_length = 50 , null = True , blank = True)

    def __unicode__(self):
        return '< street :%s>,<city :%s>,<state :%s>' %(self.street ,self.city, self.state)




class MenuItems(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 250 , null = False )
    icon = models.CharField(max_length = 250 , null = True )
    parent = models.ForeignKey(application , related_name='menuitems' , null = True)
    state = models.CharField(max_length=200, null = True)
    jsFileName = models.CharField(max_length=200, null = True)
    def __unicode__(self):
        return self.name


class applicationMedia(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    typ = models.CharField(max_length=200, null = True)
    attachment = models.FileField(upload_to = getappMediauploadPath , null = True )
    app =  models.ForeignKey(application , related_name='appMedia' , null = True)

class MobileapplicationMedia(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    typ = models.CharField(max_length=200, null = True)
    attachment = models.FileField(upload_to = getappMediauploadPath , null = True )
    app =  models.ForeignKey(application , related_name='mobileMedia' , null = True)

class ApplicationFeature(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length=200, null = False)
    enabled = models.BooleanField(default = True)
    parent =  models.ForeignKey(application , related_name='appFeatures' , null = True)

class Feedback(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length=200, null = True)
    star = models.FloatField(null=True , default=0)
    text = models.TextField(max_length = 2000 , null = True)
    app =  models.ForeignKey(application , related_name='feedbacks' , null = True)


def getdpPath(instance , filename):
    return 'org/LOGO/%s_%s' % (str(time()).replace('.', '_'), filename)

def getDivisionLogoAttachmentPath(instance , filename ):
    return 'org/LOGO/%s_%s' % (str(time()).replace('.', '_'), filename)

def getRolesLogoAttachmentPath(instance , filename ):
    return 'org/LOGO/%s_%s' % (str(time()).replace('.', '_'), filename)

def getogImageAttachmentPath(instance , filename ):
    return 'org/ogimages/%s_%s' % (str(time()).replace('.', '_'), filename)

# Create your models here.
class Division(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    name = models.CharField(max_length = 200 , null = True)
    website = models.CharField(max_length = 200 , null = True)
    logo = models.FileField(upload_to = getDivisionLogoAttachmentPath , null = True)
    pan = models.CharField(max_length = 200 , null = True , blank = True)
    cin = models.CharField(max_length = 200 , null = True , blank = True)
    l1 = models.CharField(max_length = 200 , null = True, blank = True)
    l2 = models.CharField(max_length = 200 , null = True, blank = True)
    subDomain = models.CharField(max_length = 200 , null = True, blank = True)
    simpleMode = models.BooleanField(default = True)
    upi = models.CharField(max_length = 200 , null = True)
    telephony = models.BooleanField(default = False)
    messaging = models.BooleanField(default = False)
    headerTemplate = models.TextField(max_length = 10000 , null = True, blank = True)
    headerData = models.TextField(max_length = 10000 , null = True, blank = True)
    footerData = models.TextField(max_length = 10000 , null = True, blank = True)
    footerTemplate = models.TextField(max_length = 10000 , null = True, blank = True)
    defaultOgWidth = models.CharField(max_length = 200 , null = True, blank = True)
    defaultOgHeight = models.CharField(max_length = 200 , null = True, blank = True)
    defaultDescription = models.TextField(max_length = 5000 , null = True, blank = True)
    defaultTitle = models.CharField(max_length = 200 , null = True, blank = True)
    defaultOgImage = models.FileField(upload_to = getogImageAttachmentPath , null = True)
    enableChatbot = models.BooleanField(default = False)
    footerCss = models.TextField(max_length = 10000 , null = True, blank = True)
    headerCss = models.TextField(max_length = 10000 , null = True, blank = True)
    windowColor = models.CharField(max_length = 20 , null = True, default='#e42a2a' )
    fontColor = models.CharField(max_length = 20 , null = True, default='#ffffff' )
    dp = models.ImageField(upload_to = getdpPath , null = True)
    mascotName = models.CharField(max_length = 50 , null = True )
    supportBubbleColor = models.CharField(max_length = 20 , null = True ,default='#e42a2a')
    iconColor = models.CharField(max_length = 20 , null = True ,default='#ffffff')
    userApiKey = models.CharField(max_length = 500 , null = True )
    firstMessage = models.TextField(max_length = 20000 , null = True ,blank=True , default='Hi, How can I help you')
    welcomeMessage = models.TextField(max_length = 20000 , null = True ,blank=True)
    chatIconPosition = models.TextField(max_length = 20000 , null = False ,default='right-bottom')
    chatIconType = models.TextField(max_length = 20000 , null = True ,blank=True)
    is_blink = models.BooleanField(default = False)
    support_icon = models.ImageField(upload_to = getdpPath , null = True)
    scriptVal = models.CharField(max_length = 220 , null = True ,blank=True)
    integrated_media = models.BooleanField(default = False)
    botMode = models.BooleanField(default = False)
    access_token = models.CharField(max_length = 220 , null = True ,blank=True)
    pageID = models.CharField(max_length = 50 , null = True ,blank=True)
    whatsappNumber = models.CharField(max_length = 50 , null = True ,blank=True)
    twillioAccountSID = models.CharField(max_length = 100 , null = True ,blank=True)
    trillioAuthToken = models.CharField(max_length = 100 , null = True ,blank=True)
    apiKey = models.CharField(max_length = 100 , null = True ,blank=True)
    uipathPass = models.CharField(max_length = 100 , null = True ,blank=True) # refresh token
    uipathUsername = models.CharField(max_length = 100 , null = True ,blank=True) # client_id
    uipathUrl = models.CharField(max_length = 100 , null = True ,blank=True)
    uipathTenent = models.CharField(max_length = 100 , null = True ,blank=True)
    botFailResponse = models.TextField(max_length = 500 , null = True)
    botAuto_response = models.TextField(max_length = 500 , null = True)
    supportEmailTo = models.CharField(max_length = 100 , null = True ,blank=True)
    ios_sdk_enabled = models.BooleanField(default = False)
    react_sdk_enabled = models.BooleanField(default = False)
    rest_sdk_enabled = models.BooleanField(default = False)
    android_sdk_enabled = models.BooleanField(default = False)
    uipathOrgId = models.TextField(max_length = 10 , null = True)
    gupshupAppName = models.TextField(max_length = 20 , null = True)

    locked = models.BooleanField(default=False)
    totalDue = models.PositiveIntegerField(default = 0)
    dueDate = models.DateTimeField(null = True)
    counter = models.PositiveIntegerField(default=1)
    hospUHIDCounter = models.PositiveIntegerField(default=1)
    hospPatientInCounter = models.PositiveIntegerField(default=1)
    hospPatientOutCounter = models.PositiveIntegerField(default=1)
    hospPatientInBillCounter = models.PositiveIntegerField(default=1)
    hospPatientOutBillCounter = models.PositiveIntegerField(default=1)
    hospPatientCounter = models.PositiveIntegerField(default=1)
    freeQuotaExcceded = models.BooleanField(default = False)
    enterpriseSubscriptionReq =  models.BooleanField(default = False)
    subscriptionExpiryDate =  models.DateField(null = True)
    whatsapp_test_number = models.CharField(max_length = 100 , null = True ,blank=True)
    pageType =  models.CharField(max_length = 100 , null = True ,blank=True)
    # address
    # themeColor
    # invoiceVersion

class service(models.Model): # contains other companies datails
    created = models.DateTimeField(auto_now_add = True)
    name = models.TextField(max_length = 700 , null = False)
    user = models.ForeignKey(User , related_name = 'servicesCreated' , null = False) # the responsible person for this service
    address = models.ForeignKey(address , null = True ,blank=True)
    mobile = models.CharField(max_length = 20 , null = True,blank=True)
    telephone = models.CharField(max_length = 20 , null = True,blank=True)
    about = models.TextField(max_length = 2000 , null = True,blank=True)
    cin = models.CharField(max_length = 100 , null = True,blank=True) # PAN number
    tin = models.CharField(max_length = 100 , null = True,blank=True) # tax identification number
    logo = models.CharField(max_length = 200 , null = True,blank=True) # image/svg link to the logo
    web = models.TextField(max_length = 100 , null = True,blank=True) # image/svg link to the logo
    doc  = models.ForeignKey(media , related_name = 'services' , null = True,blank=True)
    contactPerson = models.ForeignKey(User , related_name = 'servicesContactPerson' , null = True,blank=True)
    vendor = models.BooleanField(default = False)
    inUseBy = models.CharField(default = "CRM" , max_length = 20)
    owner =  models.ForeignKey(User , related_name = 'servicesOwned' , null = True) # the responsible person for this service
    bankName = models.CharField(max_length = 100 , null= True,blank=True)
    accountNumber = models.PositiveIntegerField(null=True,blank=True)
    ifscCode = models.CharField(max_length = 100 , null= True,blank=True)
    paymentTerm = models.PositiveIntegerField(null=True , default=0)
    division = models.ForeignKey(Division , null = True , related_name = "divisions")


    def __unicode__(self):
        return '< name :%s>,<user :%s>,<address :%s>' %(self.name ,self.user.username, self.address)


class InstalledApp(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey(Division , related_name='installations')
    app = models.ForeignKey(application , related_name= 'installations')
    configs = models.TextField(max_length=10000 , null=True , blank= True)
    addedBy = models.ForeignKey(User , related_name='installations')
    priceAsAdded = models.FloatField(default=0)
    class Meta:
        unique_together = ('app', 'parent',)

class Unit(models.Model):
    name = models.CharField(max_length = 200 , null = False)
    address = models.CharField(max_length = 400 , null = False , blank = True)
    city = models.CharField(max_length = 50, null = True , blank = True)
    state = models.CharField(max_length = 50, null = True , blank = True)
    country = models.CharField(max_length = 50, null = True , blank = True)
    pincode = models.CharField(max_length = 15 , null = True , blank = True)
    l1 = models.CharField(max_length = 200 , null = True)
    l2 = models.CharField(max_length = 200 , null = True)
    mobile = models.CharField(null=True , max_length=150)
    telephone = models.CharField(null=True , max_length=15)
    email = models.CharField(null=True , max_length=100)
    division = models.ForeignKey(Division , null = True , related_name = "units")
    parent = models.ForeignKey("self" , related_name="children" , null = True )
    areaCode = models.CharField(null=True , max_length=150 )
    gstin = models.CharField(max_length = 200 , null = True)
    warehouse = models.BooleanField(default = False)
    bankName = models.CharField(max_length = 200 , null = True)
    bankBranch = models.CharField(max_length = 200 , null = True)
    bankAccNumber = models.CharField(max_length = 200 , null = True)
    ifsc = models.CharField(max_length = 200 , null = True)
    swift = models.CharField(max_length = 200 , null = True)
    master = models.BooleanField(default = False)
    class Meta:
            unique_together = ('name', 'areaCode',)

class Role(models.Model):
    name = models.CharField(max_length = 200 , null = False)
    division = models.ForeignKey(Division , related_name="rolesdivisions" , null = True )
    permissions = models.ManyToManyField(application , related_name="applications"  )


class Registration(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    token = models.CharField(max_length = 50 , null = False)
    emailOTP = models.CharField(max_length = 6 , null = True)
    mobileOTP = models.CharField(max_length = 6 , null = True)
    email = models.CharField(max_length = 60 , null = True)
    mobile = models.CharField(max_length = 15 , null = True)


PRODUCT_META_TYPE_CHOICES = (
    ('HSN' , 'HSN'),
    ('SAC' , 'SAC')
)

class ProductMeta(models.Model):
    description = models.CharField(max_length = 500 , null = False)
    typ = models.CharField(max_length = 5 , default = 'HSN' , choices = PRODUCT_META_TYPE_CHOICES)
    code = models.PositiveIntegerField(null=False)
    taxRate = models.PositiveIntegerField(null = False)

class UserApp(models.Model):
    user = models.ForeignKey(User, related_name='menuapps' , null = False)
    app = models.ForeignKey(application , related_name='userApps' , null = False)
    index = models.PositiveIntegerField(default = 0)
    notificationCount = models.PositiveIntegerField(default = 0)
    locked = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
            unique_together = ('app', 'user',)


class UsageBilling(models.Model):
    date =  models.DateField(null = True)
    title = models.CharField(max_length = 500 , null = False)
    amount = models.FloatField(null=True , default=0)
    month = models.CharField(max_length = 50, null = True , blank = True)
    year = models.CharField(max_length = 50, null = True , blank = True)
    division = models.ForeignKey(Division , related_name="billingdivisions" , null = True )
    icon = models.CharField(max_length = 250, null = True)
    description = models.CharField(max_length = 250, null = True)
    app= models.ForeignKey(application , related_name='usagebillings' , null = True)

class LanguageTranslation(models.Model):
    key = models.CharField(max_length = 500 , null = True)
    value = models.TextField(max_length = 1000 , null = True )
    lang = models.CharField(max_length = 500 , null = True)




class CalendarSlots(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    slot =  models.CharField(max_length = 500 , null = True)
    day =  models.CharField(max_length = 500 , null = True)
    is_available = models.BooleanField(default=False)
    user =  models.ForeignKey(User, related_name='calendarSlotsUser' , null = True)


class OnlinePaymentDetails(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    payId = models.CharField(max_length = 50, null = True , blank = True) #combination of pk
    amount = models.FloatField(null=True , default=0)
    refId =  models.CharField(max_length = 50, null = True , blank = True)
    paymentGatewayType = models.CharField(max_length = 50, null = True , blank = True)
    is_success = models.BooleanField(default=False)
    source = models.CharField(max_length = 50, null = True , blank = True)
    chatUid = models.CharField(max_length = 50, null = True , blank = True)
    successUrl =  models.CharField(max_length = 200, null = True , blank = True)
    failureUrl =  models.CharField(max_length = 200, null = True , blank = True)
    email = models.CharField(max_length = 50, null = True , blank = True)
    cust_name = models.CharField(max_length = 50, null = True , blank = True)
    brand = models.CharField(max_length = 50, null = True , blank = True)
    mobile = models.CharField(max_length = 50, null = True , blank = True)
    initiateResponse = models.TextField(max_length = 10000 , null = True ,blank=True)
    successorfailureRes = models.TextField(max_length = 20000 , null = True ,blank=True)
    is_failure = models.BooleanField(default=False)


class AppVersioning(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    minVersion = models.CharField(max_length = 50, null = True , blank = True)
    latestVersion = models.CharField(max_length = 50, null = True , blank = True)
    enabled = models.BooleanField(default=False)
    app = models.ForeignKey(application , related_name='versions' , null = False)
    title = models.CharField(max_length = 50, null = True , blank = True)


class UsageTracker(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True)
    division = models.ForeignKey(Division , related_name="divisionUsage" , null = True )
    detail =  models.CharField(max_length = 50, null = True , blank = True)
    count = models.PositiveIntegerField(default = 0)
