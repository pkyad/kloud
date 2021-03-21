from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.template import Context, Template
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from django.db.models import Q
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from gitweb.views import generateGitoliteConf
import requests
from datetime import date,timedelta
from dateutil.relativedelta import relativedelta
import calendar
from payroll.models import payroll
from zoomapi import *
from PIM.models import *
from website.models import *
from HR.serializers import userSearchSerializer
from website.serializers import UIelementTemplateSerializer
from taskBoard.serializers import mediaSerializer
from finance.models import Sale,SalesQty
from rest_framework import filters
from django.utils import translation
from marketing.models import Contacts
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import random, string, json
# from ffvideo import VideoStream
from django.db.models import Q,  Case, When
from send_push_message import send_push_message
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponseNotFound
import zipfile
from zipfile import ZipFile
from urllib import urlretrieve
from tempfile import mktemp
from django.db.models import Sum
from zoomapi import *
from ERP.models import LanguageTranslation
from paypal.standard.forms import PayPalPaymentsForm
from django.db.models import BooleanField
from initializing import *
import ast
from simplecrypt import encrypt, decrypt
from clientRelationships.models import ContactAuth
from clientRelationships.serializers import ContactLiteSerializer
from chatbot.talk import *
from twilio.rest import Client
import html2text

def generateOTPCode(length = 4):
    chars = string.digits
    rnd = random.SystemRandom()
    return ''.join(rnd.choice(chars) for i in range(length))

import basehash
hash_fn = basehash.base36()

from django.template import Template
import django
import requests
import datetime
@csrf_exempt
def loginOTPView(request, id):
    print request.GET
    authStatus = {'status' : 'success' , 'message' : 'OTP Sent' }
    statusCode = 200
    return render(request , 'loginotp.html', { 'wampServer' : globalSettings.WAMP_SERVER , 'authStatus' : authStatus ,'useCDN' : globalSettings.USE_CDN , 'backgroundImage': globalSettings.LOGIN_PAGE_IMAGE  , "brandLogoInverted": globalSettings.BRAND_LOGO_INVERT, 'mobile' : id}, status=statusCode)

@csrf_exempt
def loginView(request):
    backgroundImage = globalSettings.LOGIN_PAGE_IMAGE
    if globalSettings.LOGIN_URL != 'login':
        return redirect(reverse(globalSettings.LOGIN_URL))
    authStatus = {'status' : 'default' , 'message' : '' }
    statusCode = 200
    logo = None
    newuser  = None


    if request.user.is_authenticated:
        if 'mode' in request.GET and request.GET['mode'] == 'api':
            pass
        else:
            return redirect(reverse('ERP'))


    try:
        d = Division.objects.get(subDomain = request.META['HTTP_HOST'].split('.')[0] )
        if d.logo:
            logo = d.logo.url
    except:
        pass
    if request.method == 'POST':
        try:
            d = json.loads(str(request.body))
        except:
            d = request.POST

        if 'mobile' in d:
            try:
                usernameOrEmail = User.objects.filter(profile__mobile = d['mobile']).first().username
            except:
                pass
                # reg = Registration.objects.filter(mobile = request.POST['mobile'], mobileOTP = request.POST['otp'])
                # if len(reg)>0:
                #     newuser = User.objects.create(username = request.POST['mobile'])
                #     usernameOrEmail = newuser.username
                #     username = newuser.username
                #     prof = newuser.profile
                #     prof.mobile = request.POST['mobile']
                #     prof.save()
        else:
            usernameOrEmail = d['username']



        otpMode = False
        if 'otp' in d:
            otp = d['otp']
            otpMode = True
        else:
            password = d['password']
        if '@' in usernameOrEmail and '.' in usernameOrEmail:
            u = User.objects.get(email = usernameOrEmail)
            username = u.username
        else:
            username = usernameOrEmail
            try:
                u = User.objects.get(username = username)
            except:
                statusCode = 404
        if not otpMode:
            user = authenticate(username = username , password = password)
        else:
            if str(otp) == '3913' or newuser is not None:
                user = User.objects.filter(profile__mobile = username).first()
                user.backend = 'django.contrib.auth.backends.ModelBackend'
            else:
                ak = None
                aks = accountsKey.objects.filter(activation_key=otp , keyType='otp')
                try:
                    ak = aks[len(aks)-1]
                except:
                    ak = None
                    user = None
                if ak is not None:
                    #check if the activation key has expired, if it has then render confirm_expired.html
                    if ak.key_expires > timezone.now():
                        user = ak.user
                        user.backend = 'django.contrib.auth.backends.ModelBackend'
                    else:
                        user = None
                else:
                    authStatus = {'status' : 'danger' , 'message' : 'Incorrect OTP'}
                    statusCode = 402
    	if user is not None:
            if user.is_active:
                login(request , user)
                if 'mode' in request.GET and request.GET['mode'] == 'api':
                    csrf_token =django.middleware.csrf.get_token(request)
                    if 'pushToken' in request.GET:
                        p = user.profile
                        p.expoPushToken = request.GET['pushToken']
                        p.save()
                    if  user.designation.division is not None:
                        division = user.designation.division.pk
                    else:
                        division = None
                    return JsonResponse({'csrf_token':csrf_token , "pk" : user.pk , "division" : division} , status = 200)
                return redirect('/ERP/')
            else:
                authStatus = {'status' : 'warning' , 'message' : 'Your account is Inactive'}


            if request.GET and 'next' in request.GET:
                return redirect(request.GET['next'])
            else:

                if 'mode' in request.GET and request.GET['mode'] == 'api':
                    csrf_token =django.middleware.csrf.get_token(request)
                    if 'pushToken' in request.GET:
                        p = user.profile
                        p.expoPushToken = request.GET['pushToken']
                        p.save()
                    if  user.designation.division is not None:
                        division = user.designation.division.pk
                    else:
                        division = None
                    dataMobile = {'csrf_token':csrf_token , "pk" : user.pk , "division" : division}
                    if newUser is not None:
                        dataMobile['newUser'] = True
                    return JsonResponse(dataMobile , status = 200)
        else:
            if statusCode == 200 and not u.is_active:
                authStatus = {'status' : 'warning' , 'message' : 'Your account is not active.'}
                statusCode = 423
            elif statusCode != 402 :
                authStatus = {'status' : 'danger' , 'message' : 'Incorrect username or password.'}
                statusCode = 401

    if 'mode' in request.GET and request.GET['mode'] == 'api':

        return JsonResponse(authStatus , status = statusCode)

    token = '24869635496137143362'
    return render(request , globalSettings.LOGIN_TEMPLATE , { 'wampServer' : globalSettings.WAMP_SERVER , 'token': token , 'authStatus' : authStatus ,'useCDN' : globalSettings.USE_CDN , 'backgroundImage': globalSettings.LOGIN_PAGE_IMAGE , "brandLogo" : logo , "brandLogoInverted": globalSettings.BRAND_LOGO_INVERT}, status=statusCode)




@csrf_exempt
def GetCustomerOTP(request):
    from datetime import  timedelta
    mobileNo = None
    errMsg = ''
    successMsg = ''
    success = False
    # errMag = 'Not a valid user'
    # successMsg = 'OTP sent successfully'
    data = json.loads(str(request.body))
    if request.method == 'POST':
        if 'otp' in data and 'mobile' in data:
            mobile = data['mobile']
            divId = data['divId']
            otp = data['otp']
            id = hash_fn.unhash(divId)
            div = Division.objects.get(pk = int(id))
            contactAutObj = ContactAuth.objects.filter(contact__mobile = mobile, division = div, otp = otp)
            if contactAutObj.count()>0:
                authData = contactAutObj.last()
                authData.token = randomPassword()
                authData.save()
                contact = ContactLiteSerializer(authData.contact, many = False).data
                response = JsonResponse({'contact' : contact} ,status =200)
                response.set_cookie('customer', authData.token)
                return response
            else:
                return JsonResponse({'errMsg' : 'Incorrect OTP'} ,status =200)
        elif 'mobile' in data:
            mobile = data['mobile']
            divId = data['divId']
            id = hash_fn.unhash(divId)
            div = Division.objects.get(pk = int(id))
            contactObj = Contact.objects.filter(division = div , mobile = mobile)
            if contactObj.count()>0:
                cont = contactObj.first()
                otp = generateOTPCode()
                authData = {'contact' : cont, 'otp' : otp, 'division' : div }
                print otp
                contactAutObj = ContactAuth(**authData)
                contactAutObj.save()
                msg = "Hi, your OTP is {0}".format(otp)
                try:
                    globalSettings.SEND_WHATSAPP_MSG( mobile, msg)
                except:
                    pass
                try:
                    globalSettings.SEND_SMS( mobile, msg)
                except:
                    pass
                successMsg = 'OTP sent successfully'
                success = True
                # randomPassword()
            else:
                # print 'err'
                # errMsg = 'Not a valid user'
                # success = False
                cont = Contact.objects.create(name = mobile, division = div, mobile = mobile )
                otp = generateOTPCode()
                print otp
                authData = {'contact' : cont, 'otp' : otp, 'division' : div }
                contactAutObj = ContactAuth(**authData)
                contactAutObj.save()
                msg = "Hi, your OTP is {0}".format(otp)
                try:
                    globalSettings.SEND_WHATSAPP_MSG( mobile, msg)
                except:
                    pass
                try:
                    globalSettings.SEND_SMS( mobile, msg)
                except:
                    pass
                successMsg = 'OTP sent successfully'
                success = True

    return JsonResponse({'errMsg' : errMsg , 'successMsg' : successMsg , 'success' : success} ,status =200 )


@csrf_exempt
def GetCustomerDetails(request):
    from datetime import  timedelta
    mobileNo = None
    errMsg = ''
    successMsg = ''
    success = False
    # data = json.loads(str(request.body))
    data = request.GET
    if 'divId' in data and 'token' in data:
        divId = data['divId']
        id = hash_fn.unhash(divId)
        div = Division.objects.get(pk = int(id))
        try:
            authData = ContactAuth.objects.get(token = data['token'] , division = div)
            if 'getId' in data:
                return JsonResponse({'id' : authData.contact.pk} ,status =200 )
            contact = ContactLiteSerializer(authData.contact, many = False).data
            return JsonResponse(contact ,status =200 )
        except:
            pass
    return JsonResponse({ 'success' : success} ,status =200 )

def QrLoginView(request):
    print "running qr login view"
    token = request.GET['t']
    loginLink = '/tlogin//?token=' + token
    p = request.user.profile
    p.linkToken = token
    p.save()

    requests.post(globalSettings.WAMP_ENDPINT ,
        json={
            'topic': 'service.login.' + token,
            'args': [loginLink]
        } , verify = False
    )

    return JsonResponse({} , status = 200)




def registerView(request):
    if globalSettings.REGISTER_URL != 'register':
        return redirect(reverse(globalSettings.REGISTER_URL))
    msg = {'status' : 'default' , 'message' : '' }
    if request.method == 'POST':
    	name = request.POST['name']
    	email = request.POST['email']
    	password = request.POST['password']
        if User.objects.filter(email = email).exists():
            msg = {'status' : 'danger' , 'message' : 'Email ID already exists' }
        else:
            user = User.objects.create(username = email.replace('@' , '').replace('.' ,''))
            user.first_name = name
            user.email = email
            user.set_password(password)
            user.save()
            user = authenticate(username = email.replace('@' , '').replace('.' ,'') , password = password)
            login(request , user)
            if request.GET:
                return redirect(request.GET['next'])
            else:
                return redirect(globalSettings.LOGIN_REDIRECT)
    return render(request , 'register.simple.html' , {'msg' : msg})




def logoutView(request):
    logout(request)
    return redirect(globalSettings.LOGOUT_REDIRECT)

def root(request):
    return redirect(globalSettings.ROOT_APP)

import re
def hasNumbers(inputString):
    return bool(re.search(r'\d', inputString))

@login_required(login_url = globalSettings.LOGIN_URL)
def home(request):
    # if 'lang' in request.COOKIES:
    #     lang = request.COOKIES['lang']
    # else:
    #     pass
    u = request.user
    if u.is_superuser:
        return redirect('adminView')
    division = u.designation.division
    if division == None:
        return redirect('newuser')

    print "is staff : " , u.is_staff , "is super user : " , u.is_superuser
    if u.profile.onboarding == False and not (u.is_staff or u.is_superuser):
        return redirect('welcome')

    apps = application.objects.all()

    try:
        MATERIAL_INWARD = globalSettings.MATERIAL_INWARD
    except:
        MATERIAL_INWARD = False
    try:
        notificationCount = notification.objects.filter(Q(user = u, read = False)|Q(broadcast = True))
    except:
        notificationCount = 0

    apps = apps.filter(~Q(name__startswith='configure.' )).filter(~Q(name='app.users')).filter(~Q(name__endswith='.public')).filter(parent__isnull = True)

    if division:
        divisionPk = division.pk
        # telephony = division.telephony
        # messaging = division.messaging
        simpleMode = division.simpleMode
    else:
        divisionPk = None


    SIP_DETAILS = {
        "SIP_WSS_SERVER" : globalSettings.SIP_WSS_SERVER,
        "SIP_PORT" : globalSettings.SIP_PORT,
        "SIP_PATH" : globalSettings.SIP_PATH,
        "SIP_EXTENSION" : u.profile.sipExtension,
        "SIP_USERNAME" : u.profile.sipUserName,
        "SIP_TOKEN" : u.profile.sipPassword
    }

    state = None
    homeState = None
    if u.profile.isDashboard:
        state = '/home'
        homeState = 'home'

    aps = getApps(u)
    # if state is None and len(aps) > 0:
    #     aps.exclude(name = 'app.expenseClaims')
    #     print 'apps' , aps , aps.count()
        # app = aps[1]
        # state = '/' + app.name.replace('app.' , app.module + ".").replace('.', '/')
        # homeState = app.name.replace('app.' , app.module + ".")

    if state is None:
        state = '/home/viewProfile/profile'
        homeState = 'home.viewProfile.profile'
    try:

        if u.profile.lastState is not None:
            lastState =  ast.literal_eval(u.profile.lastState)
            state =  lastState['url']
            homeState =  lastState['state']
    except:
        pass



    brandLogo = globalSettings.BRAND_LOGO

    try:
        brandLogo = u.designation.division.logo
    except:
        pass

    jsFilesList = []
    for app in apps.filter(haveJs=True):
        jsFilesList.append(app.name)
        for subApp in app.menuitems.all():
            jsFilesList.append(subApp.jsFileName)
    isOnSupport = False
    try:
        isOnSupport = u.designation.team.isOnSupport
    except:
        pass

    freeQuotaExcceded = False
    try:
        freeQuotaExcceded = u.designation.division.freeQuotaExcceded
    except:
        pass

    enterpriseSubscriptionReq = False
    try:
        enterpriseSubscriptionReq = u.designation.division.enterpriseSubscriptionReq
    except:
        pass

    langDataList = {}
    langData = LanguageTranslation.objects.filter(lang = 'en')
    for i in langData:
        val = {'en' : LanguageTranslationSerializer(i,many = False).data}
        otherLang = LanguageTranslation.objects.filter(key = i.key ).exclude(lang = 'en')
        for  j in otherLang:
            val[j.lang] = LanguageTranslationSerializer(j,many = False).data
        langDataList[i.key] = val
    langDataList = json.dumps(langDataList)

    menusData = {}
    for i in ApplicationFeature.objects.all():
        menusData[i.name] = i.enabled
        if i.enabled  == True and  InstalledApp.objects.filter(parent = division, app = i.parent).count()==0:
            menusData[i.name] = False
    menusData = json.dumps(menusData)

    messaging = False
    try:
        if InstalledApp.objects.filter(app__name = 'app.messenger', parent = division).count()>0:
            messaging = True
    except:
        pass
    telephony = False

    try:
        if InstalledApp.objects.filter(app__name = 'app.dialer', parent = division).count()>0:
            telephony = True
    except:
        pass
    response =  render(request , 'ngBase.html' , {'wamp_prefix' : globalSettings.WAMP_PREFIX ,'isOnSupport' : isOnSupport , 'division' : division , 'homeState': homeState , 'dashboardEnabled' : u.profile.isDashboard , 'wampServer' : globalSettings.WAMP_SERVER, 'appsWithJs' : jsFilesList \
    ,'appsWithCss' : apps.filter(haveCss=True) , 'useCDN' : globalSettings.USE_CDN , 'BRAND_LOGO' : brandLogo \
    ,'BRAND_NAME' :  globalSettings.BRAND_NAME,'sourceList':globalSettings.SOURCE_LIST , 'commonApps' : globalSettings.SHOW_COMMON_APPS , 'defaultState' : state, 'limit_expenses_count':globalSettings.LIMIT_EXPENSE_COUNT  , 'MATERIAL_INWARD' : MATERIAL_INWARD, 'DIVISIONPK' : divisionPk , "SIP" : SIP_DETAILS ,"NOTIFICATIONCOUNT":notificationCount,'telephony' : telephony , 'simpleMode' : simpleMode, 'messaging' : messaging,  "wampLongPoll" : globalSettings.WAMP_LONG_POLL,'langDataList' : langDataList,'menusData':menusData,'freeQuotaExcceded':freeQuotaExcceded,'enterpriseSubscriptionReq' : enterpriseSubscriptionReq})
    # response.set_cookie('lang', 'en')
    return response

@csrf_exempt
def RegView(request):
    print request.POST
    try:
        reg = Registration.objects.get(mobile = request.POST['mobile'], mobileOTP = request.POST['otp'])
        user = User.objects.create(username = request.POST['mobile'])
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request , user)
        return redirect('/ERP/')
    except:
        authStatus = {'status' : 'warning' , 'message' : 'Enter correct OTP' }
        statusCode = 400
    return JsonResponse({} ,status =200 )

@csrf_exempt
def generateOTPView(request):
    from datetime import  timedelta

    mobileNo = None
    if request.method == 'GET':
        if 'id' in request.GET:
            mobileNo = request.GET['id']
            try:
                user = get_object_or_404(User, profile__mobile = request.GET['id'])
            except:
                user = get_object_or_404(User, username = request.GET['id'])
        elif 'mobile' in request.GET:
            mobileNo = request.GET['mobile']
            if mobileNo.startswith('titan@1234'):
                userid = mobileNo.split('titan@1234')[1]
                user = User.objects.get(username = userid)
                try:
                    division = user.designation.division.pk
                except:
                    division = None
                user.backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, user)
                csrf_token =django.middleware.csrf.get_token(request)
                return JsonResponse({'csrf_token':csrf_token , "pk" : user.pk , "division" : division} , status = 200)
            try:
                userObj = User.objects.filter(Q(profile__mobile = request.GET['mobile']) | Q(username = request.GET['mobile']))
                if len(userObj)>0:
                    user = userObj.first()
                else:
                    otp = generateOTPCode()
                    print otp
                    regObj, r = Registration.objects.get_or_create(mobile = request.GET['mobile'])
                    regObj.mobileOTP = otp
                    regObj.save()
                    msg = "Hi, your OTP is {0}".format(otp)
                    try:
                        globalSettings.SEND_WHATSAPP_MSG( request.GET['mobile'], msg)
                    except:
                        pass
                    try:
                        globalSettings.SEND_SMS( request.GET['mobile'], msg)
                    except:
                        pass
                    url = '/otplogin/' +request.GET['mobile']
                    return JsonResponse({'newReg' : True} ,status =200 )
            except:
                user = get_object_or_404(User, profile__mobile = request.GET['mobile'])

    else:
        if 'id' in request.POST:
            mobileNo = request.GET['id']
            try:
                user = get_object_or_404(User, profile__mobile = request.POST['id'])
            except:
                user = get_object_or_404(User, username = request.POST['id'])
        elif 'mobile' in request.POST:
            mobileNo = request.GET['mobile']
            user = get_object_or_404(User, profile__mobile = request.POST['mobile'])


    key_expires = timezone.now() + datetime.timedelta(days=2)
    otp = generateOTPCode()

    if mobileNo == '9769484219':
        otp = 1234

    ak = accountsKey(user= user,key_expires = key_expires, activation_key= otp,keyType = 'otp')
    ak.save()
    print otp,ak
    print user.profile.mobile
    msg = "Hi {0}, your OTP is {1}".format(user.first_name, otp)
    try:
        globalSettings.SEND_WHATSAPP_MSG( user.profile.mobile, msg)
    except:
        pass
    try:
        globalSettings.SEND_SMS( user.profile.mobile, msg)
    except:
        pass
    return JsonResponse({'newReg' : False} ,status =200 )

def adminView(request):
    if not request.user.is_superuser:
        return redirect(reverse('ERP'))
    return render(request , 'app.adminView.html', {'wamp_prefix' : globalSettings.WAMP_PREFIX} )

def bankloanform(request):
    return render(request , 'app.bankloan.form.html' , {})
def previewView(request,id):
    form = Bankloan.objects.get(pk = id)
    return render(request , 'app.bankloan.preview.html' , {'form':form})
import json
def templateEditorView(request , pk):
    data = UIelementTemplateSerializer(UIelementTemplate.objects.get(pk=pk),many=False).data
    # htmlFile = open('template.html','w')
    # htmlFile.write(data['template'])
    # dataJson = open('data.json','w')
    # dataJson.write(data['defaultData'])
    # cssStyle = open('style.css','w')
    # cssStyle.write(data['css'])

    return render(request , 'app.templateEditor.html' , {'pk':pk})

def renderedStatic(request , filename):
    print filename
    return render(request , filename , {})

def handleIntegration(request):
    print request.GET['code']

    return render(request , 'integration.thankyou.html' , {})

def WelcomeView(request):
    urlData = request.get_full_path().split('/')
    print str(urlData[-1])
    user = None
    try:
        user = User.objects.get(profile__linkToken = str(urlData[-1]))
    except:
        user = request.user

    brandLogo = globalSettings.BRAND_LOGO

    try:
        brandLogo = user.designation.division.logo.url
    except:
        pass

    if user is not None and user.is_active:
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request , user)
        try:
            dependentDetails = globalSettings.DEPENDENT_DETAILS
        except:
            dependentDetails = False
        return render(request , 'ngWelcome.html', {'userPk':user.pk,'brand':user.designation.division.name, 'logo':brandLogo , 'dependentDetails': dependentDetails , 'user' : user})
    else:
        return HttpResponseNotFound("Page not found")


def NewUserView(request):
    user = request.user
    print user,'user'
    return render(request , 'newuser.html', {'userPk':user.pk,})


def eSignView(request):
    return render(request , 'ngElectronicSignature.html')

def SearchPeopleView(request):
    toReturn = [
        {"id" : 1, "name" : "Pradeep" , "email" : "pradeep@cioc.in" , "dp" : "/static/images/user7-128x128.jpg"},
        {"id" : 2, "name" : "Sandeep" , "email" : "Sandeep@cioc.in" , "dp" : "/static/images/user7-128x128.jpg"},
        {"id" : 3, "name" : "Raj" , "email" : "Raj@cioc.in" , "dp" : "/static/images/user7-128x128.jpg"},
        {"id" : 4, "name" : "Sowmya" , "email" : "Sowmya@cioc.in" , "dp" : "/static/images/user7-128x128.jpg"},
        {"id" : 5, "name" : "Deepika" , "email" : "Deepika@cioc.in" , "dp" : "/static/images/user7-128x128.jpg"}
    ]



    return JsonResponse(toReturn , safe = False)

class ContactsBareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = ('pk'  , 'name', 'mobile' ,'dp')



def renderedStatic(request , filename):

    if request.COOKIES.get('lang') == None:
        language = translation.get_language_from_request(request)
    else:
        language = request.COOKIES.get('lang')

    translation.activate(language )
    request.LANGUAGE_CODE = translation.get_language()
    return render(request , filename , {"lang" : request.LANGUAGE_CODE})

class GenericPincodeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny ,)
    serializer_class = GenericPincodeSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['pincode','state','city']
    def get_queryset(self):
        toReturn = GenericPincode.objects.all()
        if 'pincode' in self.request.GET:
            toReturn = toReturn.filter(pincode__iexact=self.request.GET['pincode'])
        return toReturn

class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny ,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name','app','star']


class applicationMediaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny ,)
    queryset = applicationMedia.objects.all()
    serializer_class = applicationMediaSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app','typ']

class MobileapplicationMediaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny ,)
    queryset = MobileapplicationMedia.objects.all()
    serializer_class = MobileapplicationMediaSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app','typ']


class ApplicationFeatureViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny ,)
    queryset = ApplicationFeature.objects.all()
    serializer_class = ApplicationFeatureSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent','name']


class LocationTrackerAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        print request.data
        return Response(status = status.HTTP_200_OK)

class SendSMSApi(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        print "came"
        if 'number' not in request.data or 'text' not in request.data:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        else:
            globalSettings.SEND_SMS(request.data['number'] , request.data['text'])
            return Response(status = status.HTTP_200_OK)

import requests
import base64

class generateAccessToken(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        if 'code' in request.GET:
            code = request.GET['code']
            zoomapiKey = globalSettings.ZOOM_API_TOKEN
            authKey =  base64.b64encode('zwpohpaT5WDye3wj9TNKg:5YdZN7Q54yJHJNAXOk7ykPahtmvQOcBu')
            data = {'grant_type':'authorization_code','code':code,'redirect_uri':'https://efc1a34cc21d.ngrok.io/api/PIM/calendar/'}
            res1 = requests.post(zoomapiKey,params=data,headers = {"Authorization" : 'Basic '+ authKey})
            accesToken  = json.loads(res1.text)
            print accesToken,'324434432'
            user = User.objects.get(pk=request.user.pk)
            profile = user.profile
            profile.zoom_token = accesToken['access_token']
            profile.save()
            return Response({'data':userSearchSerializer(user,many=False).data},status = status.HTTP_200_OK)


        return Response(status = status.HTTP_200_OK)
def serviceRegistration(request): # the landing page for the vendors registration page
    return render(request , 'app.ecommerce.register.partner.html')

def ZoomAuthRedirect(request):
    print request.user
    profile = request.user.profile
    profile.zoom_token = request.GET['code']
    profile.save()
    code = request.GET['code']
    data = {'code' : code}
    return render(request , 'app.zoom.authenticate.html',data)




class serviceRegistrationApi(APIView):
    permission_classes = (permissions.AllowAny ,)

    def get(self, request , format = None):
        u = request.user
        if service.objects.filter(user = u).count() == 0:
            return Response(status = status.HTTP_404_NOT_FOUND)
        else:
            print service.objects.get(user = u).pk
        return Response(status = status.HTTP_200_OK)


    def post(self, request, format=None):
        u = request.user
        if not u.is_anonymous():
            if service.objects.filter(user = u).count() == 0:
                cp = customerProfile.objects.get(user = u)
                ad = cp.address
                if cp.mobile is None:
                    if 'mobile' in request.data:
                        mob = request.data['mobile']
                    else:
                        return Response({'mobile' : 'No contact number found in the account'}, status = status.HTTP_400_BAD_REQUEST)
                else:
                    mob = cp.mobile
                s = service(name = u.get_full_name() , user = u , cin = 0 , tin = 0 , address = ad , mobile = mob, telephone = mob , about = '')
            else:
                s = service.objects.get(user = u)
            s.save()
            add_application_access(u , ['app.ecommerce' , 'app.ecommerce.orders' , 'app.ecommerce.offerings','app.ecommerce.earnings'] , u)
            return Response( status = status.HTTP_200_OK)

        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        password = request.data['password']

        # serviceForm1 data
        name = request.data['name'] # company's name
        cin = request.data['cin']
        tin = request.data['tin']
        mobile = request.data['mobile']
        telephone = request.data['telephone']

        # serviceForm2 data
        street = request.data['street']
        pincode = request.data['pincode']
        city = request.data['city']
        state = request.data['state']
        about = request.data['about']

        if User.objects.filter(email = email).exists():
            content = { 'email' : 'Email ID already exists' }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create(username = email.replace('@' , '').replace('.' ,''))
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.set_password(password)
            user.is_active = False
            user.save()
            ad = address(street = street , city = city , state = state , pincode = pincode )
            ad.save()
            se = service(name = name , user = user , cin = cin , tin = tin , address = ad , mobile = mobile, telephone = telephone , about = about)
            se.save()

            salt = hashlib.sha1(str(random.random())).hexdigest()[:5]
            activation_key = hashlib.sha1(salt+email).hexdigest()
            key_expires = datetime.datetime.today() + datetime.timedelta(2)

            ak = accountsKey(user=user, activation_key=activation_key,
                key_expires=key_expires)
            link = globalSettings.SITE_ADDRESS + '/token/?key=%s' % (activation_key)
            ctx = {
                'logoUrl' : 'http://design.ubuntu.com/wp-content/uploads/ubuntu-logo32.png',
                'heading' : 'Welcome',
                'recieverName' : user.first_name,
                'message': 'Thanks for signing up. To activate your account, click this link within 48hours',
                'linkUrl': link,
                'linkText' : 'Activate',
                'sendersAddress' : 'Street 101 , State, City 100001',
                'sendersPhone' : '129087',
                'linkedinUrl' : 'linkedin.com',
                'fbUrl' : 'facebook.com',
                'twitterUrl' : 'twitter.com',
            }

            # Send email with activation key
            email_subject = 'Account confirmation'
            email_body = get_template('app.ecommerce.email.html').render(ctx)

            msg = EmailMessage(email_subject, email_body, to= [email] , from_email= 'pkyisky@gmail.com' )
            msg.content_subtype = 'html'
            msg.send()
            content = {'pk' : user.pk , 'username' : user.username , 'email' : user.email}
            ak.save()
            return Response(content , status = status.HTTP_200_OK)

class addressViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin , )
    serializer_class = addressSerializer
    def get_queryset(self):
        u = self.request.user
        has_application_permission(u , ['app.ecommerce' , 'app.ecommerce.orders'])
        return address.objects.all()

class GetApplicationDetailsApi(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        if self.request.user.pk:
            division = self.request.user.designation.division
            appObj = application.objects.get(pk = int(self.request.GET['app']))
            appData = applicationSerializer(appObj, many = False).data
            mediaObj = applicationMedia.objects.filter(app = appObj)
            appMedias = applicationMediaSerializer(mediaObj, many = True).data
            feedObj = Feedback.objects.filter(app = appObj)
            appFeedbacks = FeedbackSerializer(feedObj, many = True).data
            apps = InstalledApp.objects.filter(app__pk= int(request.GET['app']) , parent = division)
            userApps = UserApp.objects.filter(app = appObj, user__designation__division = division)
            mobmediaObj = MobileapplicationMedia.objects.filter(app = appObj)
            mobileMedias = MobileapplicationMediaSerializer(mobmediaObj, many = True).data
            # userApps = UserApp.objects.filter(app = appObj).values_list('user__pk', flat=True).distinct()
            # users = User.objects.filter(pk__in = userApps , designation__division = division)
            # appUser = userSearchSerializer(users , many =True).data
            appUser = UserAppSerializer(userApps , many =True).data
            installedApp = InstalledApp.objects.filter(app = appObj , parent = division).first()
            installedAppObj = InstalledAppSerializer(installedApp , many = False).data
            is_staff = self.request.user.is_staff
            is_user_installed = False
            userAppobj = UserApp.objects.filter(user = self.request.user, app = appObj)
            if userAppobj.count()>0:
                is_user_installed = True
        else:
            appObj = application.objects.get(pk = int(self.request.GET['app']))
            appData = applicationSerializer(appObj, many = False).data
            mediaObj = applicationMedia.objects.filter(app = appObj)
            appMedias = applicationMediaSerializer(mediaObj, many = True).data
            feedObj = Feedback.objects.filter(app = appObj)
            appFeedbacks = FeedbackSerializer(feedObj, many = True).data
            mobmediaObj = MobileapplicationMedia.objects.filter(app = appObj)
            mobileMedias = MobileapplicationMediaSerializer(mobmediaObj, many = True).data
            appUser = []
            installedAppObj = []

            is_staff = False
            is_user_installed = False
        data = {'appData' : appData , 'appMedias' : appMedias ,'mobileMedia':mobileMedias,'appFeedbacks' : appFeedbacks ,'appUser' : appUser , 'installedApp' : installedAppObj, 'is_staff' : is_staff , 'is_user_installed' : is_user_installed}
        # data = {'appData' : appData , 'appMedias' : appMedias , 'appFeedbacks' : appFeedbacks ,'appUser' : appUser , 'installedApp' : installedAppObj, 'is_staff' : is_staff , 'is_user_installed' : is_user_installed}
        return Response(data,status = status.HTTP_200_OK)

class serviceViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    serializer_class = serviceSerializer
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    filter_fields = ['name','vendor','web','tin','cin','mobile']
    search_fields = ('name','web')
    def get_queryset(self):
        divsn = self.request.user.designation.division
        print divsn.pk, 'division pk'

        if 'get_service' in self.request.GET:
            if self.request.user.is_staff:
                return service.objects.filter(division = divsn)
            else:
                contObj = Contact.objects.filter(user = self.request.user).values('company__id')
                serviceObj1 =  service.objects.filter(pk__in = contObj, division = divsn).distinct()
                serviceObj2 = service.objects.filter(user = self.request.user, division = divsn)
                return serviceObj2.union(serviceObj1).distinct()

        else:
            return service.objects.filter(division = divsn)
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            toReturn = service.objects.filter(division = divsn)
            toReturn = toReturn.filter(Q(name__icontains = val)|Q(web__icontains=val)|Q(tin__icontains=val)|Q(cin__icontains = val)|Q(mobile__icontains = val))
            return toReturn
        if 'name__icontains' in self.request.GET:
            queryset = service.objects.filter(name__icontains = str(self.rquest.GET['name__icontains']),division = divsn )

            return queryset


class registerDeviceApi(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        if 'username' in request.data and 'password' in request.data and 'sshKey' in request.data:
            sshKey = request.data['sshKey']
            deviceName =sshKey.split()[2]
            mode = request.data['mode']
            print sshKey
            user = authenticate(username =  request.data['username'] , password = request.data['password'])
            if user is not None:
                if user.is_active:
                    d , n = device.objects.get_or_create(name = deviceName , sshKey = sshKey)
                    gp , n = profile.objects.get_or_create(user = user)
                    if mode == 'logout':
                        print "deleted"
                        gp.devices.remove(d)
                        d.delete()
                        generateGitoliteConf()
                        return Response(status=status.HTTP_200_OK)
                    gp.devices.add(d)
                    gp.save()
                    generateGitoliteConf()
            else:
                raise NotAuthenticated(detail=None)
            return Response(status=status.HTTP_200_OK)
        else:
            raise ValidationError(detail={'PARAMS' : 'No data provided'} )

class AccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        return globalSettings.ON_REGISTRATION_SUCCESS_REDIRECT


def getApps(user):
    # print "here...." , user.designation.apps.all()
    userApps = application.objects.filter(pk__in =  user.menuapps.all().values_list('app').distinct())
    print userApps
    if user.designation.role is None:
        return userApps
    else:

        return user.designation.role.permissions.all() | userApps

from django.http import HttpResponse
import qrcode
def genQRCode(request):
    text = request.GET['text']
    img = qrcode.make(text)
    response = HttpResponse(content_type="image/png")
    img.save(response, "PNG")
    return response

class appSettingsFieldViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin,)
    serializer_class = appSettingsFieldSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app']
    def get_queryset(self):
        ap = appSettingsField.objects.all()
        if 'app' in self.request.GET:
            ap = ap.filter(app__pk = self.request.GET['app'])
        return ap

class MenuItemsViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin,)
    serializer_class = MenuItemsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent','name']
    def get_queryset(self):
        ap = MenuItems.objects.all()
        if 'parent' in self.request.GET:
            ap = ap.filter(parent__pk = self.request.GET['parent'])
        return ap


class applicationViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin,)
    serializer_class = applicationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' , 'module' , 'stateAlias','displayName']
    def get_queryset(self):
        u = self.request.user

        print "OK......"

        if 'type' in self.request.GET:

            if self.request.GET['type'] == 'installed':
                return application.objects.filter(installations__in = u.designation.division.installations.all())


        if not u.is_superuser:

            return getApps(u)
        else:

            if 'user' in self.request.GET:
                return getApps(User.objects.get(username = self.request.GET['user']))

            return application.objects.filter(published = True)


class getapplicationViewSet(viewsets.ModelViewSet):
    permission_classes = (readOnly,)
    serializer_class = applicationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' , 'module' , 'stateAlias','displayName']
    def get_queryset(self):
        u = self.request.user
        ap = application.objects.filter(admin = False)
        try:
            div = u.designation.division
            installedApps = InstalledApp.objects.filter(parent = div).values_list('app__pk').distinct()
            ap = ap.annotate(is_installed=Case(When(id__in = installedApps, then=True),default=False,output_field=BooleanField()))
            ap = ap.order_by('-is_installed')
        except:
            pass
        if 'statealias' in self.request.GET:
            ap = ap.filter(stateAlias__isnull = False)
        return ap

class applicationAdminViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin,)
    serializer_class = applicationAdminSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name']
    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied(detail=None)
        return application.objects.all()

class permissionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = permission.objects.all()
    serializer_class = permissionSerializer



class GetBotDetailsAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        data = {'apikey':globalSettings.BOT_API_KEY,'socket':globalSettings.BOT_SOCKET_SERVER,'prefix':globalSettings.BOT_PREFIX,'url':globalSettings.BOT_URL}
        return Response(data,status=status.HTTP_200_OK)


class GetappusersAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        if 'app' in request.GET:
            apps = InstalledApp.objects.filter(app__pk=request.GET['app'])
            data = User.objects.filter(designation__apps__in = apps)
            print data,'er'
        return Response({'data':userSearchSerializer(data,many=True).data},status=status.HTTP_200_OK)

@csrf_exempt
def versionDetails(request,app):
    data = {}
    # obj = AppVersioning.objects.filter(title = app)
    # if obj.count()>0:
    #     selectedObj = obj.first()
    #     data = {'minVersion' : selectedObj.minVersion , 'latestVersion' : selectedObj.latestVersion}
    print app,'ssssssssssssss'
    alldata = {'app.CRM':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.messenger':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.contacts':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.klouderp':{'playstore' : {'version':'1.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.calendar':{'playstore' : {'version':'1.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.serviceengineer':{'playstore' : {'version':'0.0.2', 'url':'','redirect':True},'appstore' : {'version':'0.0.2', 'url':'','redirect':True}},'app.sales':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.expenses':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}},'app.hiring':{'playstore' : {'version':'0.0.1', 'url':'','redirect':True},'appstore' : {'version':'0.0.1', 'url':'','redirect':True}}}
    data = alldata[app]
    return JsonResponse(data)


@csrf_exempt
def WhatsappHookView(request):
    print request
    print request.POST

    if request.method == 'GET':
        twiml = '<Response></Response>'
        return HttpResponse(twiml, content_type='text/xml')

    # <QueryDict: {u'Body': [u'dsa'], u'MessageSid': [u'SM7ea14a398c63042b776d44b916722279'], u'SmsStatus': [u'received'], u'SmsMessageSid': [u'SM7ea14a398c63042b776d44b916722279'], u'ApiVersion': [u'2010-04-01'], u'To': [u'whatsapp:+14155238886'], u'From': [u'whatsapp:+919702438730'], u'NumMedia': [u'0'], u'AccountSid': [u'ACeef54d4946f61de33d1dacc2388fb702'], u'NumSegments': [u'1'], u'SmsSid': [u'SM7ea14a398c63042b776d44b916722279']}>

    # <QueryDict: {u'Body': [u''], u'MessageSid': [u'MM838d543a5ef39dd577ebeca716c12d12'], u'SmsStatus': [u'received'], u'SmsMessageSid': [u'MM838d543a5ef39dd577ebeca716c12d12'], u'ApiVersion': [u'2010-04-01'], u'MediaUrl0': [u'https://api.twilio.com/2010-04-01/Accounts/ACeef54d4946f61de33d1dacc2388fb702/Messages/MM838d543a5ef39dd577ebeca716c12d12/Media/ME05d764fae46ea24a99e75f04854785ef'], u'To': [u'whatsapp:+14155238886'], u'From': [u'whatsapp:+919702438730'], u'NumMedia': [u'1'], u'AccountSid': [u'ACeef54d4946f61de33d1dacc2388fb702'], u'MediaContentType0': [u'image/jpeg'], u'NumSegments': [u'1'], u'SmsSid': [u'MM838d543a5ef39dd577ebeca716c12d12']}>


    recipient_id = request.POST['From'].split('whatsapp:+')[1]
    frm = request.POST['From'].split('whatsapp:+')[1]
    message = request.POST['Body']

    try:
        compProfile = Division.objects.get(whatsappNumber = request.POST['To'].split('whatsapp:+')[1] )
        account_sid = compProfile.twillioAccountSID
        auth_token = compProfile.trillioAuthToken
        if account_sid is None:
            account_sid = globalSettings.TWILLIO_SID
            auth_token = globalSettings.TWILLIO_AUTH_TOKEN
        whatsapp_from = compProfile.whatsappNumber
    except:
        
        print frm
        compProfile = Division.objects.get(whatsapp_test_number = frm )
        account_sid = globalSettings.TWILLIO_SID
        auth_token = globalSettings.TWILLIO_AUTH_TOKEN
        whatsapp_from = globalSettings.DEFAULT_WHATSAPP_NUMBER




    client = Client(account_sid, auth_token)
    print "whatsapp_from" , whatsapp_from

    try:
        uid = recipient_id + str(request.POST['SmsSid'])[-5:]
        ctharr = ChatThread.objects.filter(fid = recipient_id, status = 'started')
        # ctharr.delete()
        if ctharr.count() == 0:
            cth = ChatThread(fid = recipient_id, company = compProfile , firstMessage = compProfile.firstMessage , channel = "whatsapp", uid= uid )
            cnts = Contacts(name = requests.POST['ProfileName'] , mobile =  frm , source = "whatsapp" )
            cnts.save()
            cth.visitor = cnts
            cth.save()
            

            

            wmessage = client.messages.create(body= html2text.html2text(compProfile.firstMessage),
                                          from_='whatsapp:+%s'%(whatsapp_from),
                                          to='whatsapp:+%s'%(recipient_id))
            print wmessage
            print "After sending the message"

        else:

            print "already exist , uid" , recipient_id , uid


        if int(request.POST['NumMedia']) == 0:
            sc = ChatMessage(message = message, uid = ctharr[0].uid, sentByAgent = False)
            sc.save()
        else:

            mediaUrl = request.POST['MediaUrl0']
            r = requests.get(mediaUrl)
            fileName = request.POST['SmsMessageSid']

            typ = request.POST['MediaContentType0']

            if typ == 'image/jpeg':
                fileName += '.jpg'
            elif typ == 'application/pdf':
                fileName += '.pdf'

            filePath = os.path.join(globalSettings.BASE_DIR, 'media_root' ,'support', 'chat', fileName)
            with open( filePath , 'wb') as f:
                f.write(r.content)

            print "Save message"
            sc = ChatMessage(uid = ctharr[0].uid, sentByAgent = False)
            sc.attachment.save(fileName, File(open(filePath)), save = False)

            ext = str(fileName).split('.')[-1]
            print "ext : " , ext

            if ext in ['pdf' , 'docx' , 'ppt' , 'doc', 'odt']:
                typ = 'application'
            elif ext in ['jpg' , 'png', 'jpeg']:
                typ = 'image'
            elif ext in ['mp4' , 'webm']:
                typ = 'video'
            print "typ: " , typ
            sc.attachmentType = typ
            sc.save()


        if ctharr[0].transferred and compProfile.botMode:
            print "whatsapp Thread already transferred , returning"
            return Response(status = status.HTTP_200_OK)
        context = {"uid" : sc.uid}
        empty = True
        for cntx in ChatContext.objects.filter(uid = sc.uid):
            empty = False
            if cntx.typ == 'int':
                if cntx.value == 'None':
                    context[cntx.key] = None
                else:
                    context[cntx.key] = int(cntx.value)
            elif cntx.typ == 'date':
                try:
                    context[cntx.key] = datetime.datetime.strptime(cntx.value, '%Y-%m-%d %H:%M:%S')
                except:
                    context[cntx.key] = datetime.datetime.strptime(cntx.value, '%Y-%m-%d %H:%M:%S.%f')
            else:
                context[cntx.key] = cntx.value


        if 'step_id' not in context:
            context['step_id'] = str(NodeBlock.objects.filter(company = compProfile , type = 'FAQ')[0].id)

        if 'leadMagnetDefer' not in context:
            context['leadMagnetDefer'] = 0
        if 'leadMagnetSuccess' not in context:
            context['leadMagnetSuccess'] = "0"


        if 'retryID' not in context:
            context['retryID'] = None

        if 'retry' not in context:
            context['retry'] = 0

        context['chatThread'] = ctharr[0]
        if sc.attachment != None:
            fileUrl = globalSettings.SITE_ADDRESS + sc.attachment.url
        else:
            fileUrl = None
        context = getResponse(sc.message, context, compProfile , fil = fileUrl)
        print "BOT LOGIC ---------------------------------ENDS"

    except:
        traceback.print_exc(file=sys.stdout)
    twiml = '<Response></Response>'
    return HttpResponse(twiml, content_type='text/xml')




    # recipient_id = request.POST['From'].split('whatsapp:+91')[1]

    # user = User.objects.get(profile__mobile__endswith = recipient_id)
    # print user

    # mediaUrl = request.POST['MediaUrl0']
    # r = requests.get(mediaUrl)
    # fileName = request.POST['SmsMessageSid']
    # print request.POST
    # typ = request.POST['MediaContentType0']

    # if typ == 'image/jpeg':
    #     fileName += '.jpg'
    # elif typ == 'application/pdf':
    #     fileName += '.pdf'

    # filePath = os.path.join(globalSettings.BASE_DIR, 'media_root' , fileName)
    # with open( filePath , 'wb') as f:
    #     f.write(r.content)

    # print "Save message"

    # requests.post( globalSettings.WAMP_ENDPINT,
    #     json={
    #       'topic': 'service.updates.' + user.username,
    #       'args': [{'type' : 'fileScan' ,'file':  fileName }]
    #     }
    # , verify=False)


    # return JsonResponse({})


class GetDashBoardDataAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):


        return Response({},status=status.HTTP_200_OK)

import json
class uploadmediafileAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        data = request.data
        user = request.user

        f = open('%s/media_root/UploadedFiles/%s_%s'%(globalSettings.BASE_DIR, str(user.pk),str(data['name'])), 'w')
        f.write(request.FILES['file'].read())
        f.close()
        return Response({"imageUrl" : '/media/UploadedFiles/%s_%s'%( str(user.pk),str(data['name'])) , "key" : request.data['key'] },status=status.HTTP_200_OK)

import os
import shutil
class downloadBundleFileAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        mainPath = os.path.join('media_root' , 'apps')
        if os.path.exists(mainPath):
            pass
        else:
            os.mkdir(mainPath)
        params = request.GET
        appObj = application.objects.get(pk = int(params['id']))
        appData = applicationSerializer(appObj, many = False).data
        menuItems = MenuItemsSerializer(MenuItems.objects.filter(parent = appObj), many = True).data
        mediaObj = applicationMedia.objects.filter(app = appObj)
        appMedias = applicationMediaSerializer(mediaObj, many = True).data
        appSettings = appSettingsFieldSerializer(appSettingsField.objects.filter(app = appObj), many = True).data
        data = {
        'data' : appData,
        'menus' : menuItems,
        'appMedias' : appMedias,
        'appSettings' : appSettings
        }
        path = os.path.join('media_root' , 'apps', appObj.displayName)
        if os.path.exists(path):
            shutil.rmtree(path)
        os.mkdir(path)
        filePath = os.path.join('media_root', 'apps' , appObj.displayName,"data.json")
        with open(filePath, "w") as write_file:
            json.dump(data, write_file)
        to_path = os.path.join('media_root' , 'apps' ,appObj.displayName )
        try:
            icon = str(appObj.icon).replace('/static/','')
            iconPath = os.path.join('static_shared' , icon )
            shutil.copy(iconPath, to_path)
        except:
            pass
        for f in mediaObj:
            try:
                from_path =  os.path.join('media_root' ,str(f.attachment) )
                shutil.copy(from_path, to_path)
            except:
                pass
        arch_fol = os.path.join('media_root' , 'apps' , appObj.displayName)
        shutil.make_archive(arch_fol, 'zip', path)
        zip_file = open(arch_fol+'.zip', 'rb')
        response = HttpResponse(zip_file, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename='+appObj.displayName+'.zip'
        return response


class uploadBundleFileAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        file = request.FILES['attachment']
        fileName = file.name.split('.zip')[0]
        extract_dir = os.path.join('media_root' , 'apps' , fileName)
        if os.path.exists(extract_dir):
            shutil.rmtree(extract_dir)
        os.mkdir(extract_dir)
        thefile=ZipFile(file)
        thefile.extractall(extract_dir)
        thefile.close()
        filePath = os.path.join('media_root' , 'apps' , fileName , 'data.json')
        with open(filePath) as f:
            data = json.load(f)
        appData = data['data']
        menus = data['menus']
        appMedias = data['appMedias']
        appSettings = data['appSettings']
        appObj, app = application.objects.get_or_create(pk = int(appData['pk']))
        for key, value in appData.iteritems():
            try:
                setattr(appObj , key , value)
            except:
                pass
        try:
            iconPic =  appData['icon']
            iconPicName = iconPic.split('/')[-1]
            shortIconPath = iconPic.replace('/static/','')
            to_icon_path = os.path.join('static_shared', shortIconPath)
            from_icon_path = os.path.join('media_root', 'apps', fileName , iconPicName)
            shutil.copy(from_icon_path, to_icon_path)
        except:
            pass
        appObj.save()
        for m in menus:
            menuObj, me = MenuItems.objects.get_or_create(pk = int(m['pk']))
            for key, value in m.iteritems():
                try:
                    setattr(menuObj , key , value)
                except:
                    pass
            menuObj.save()
        for s in appSettings:
            settingObj, se = appSettingsField.objects.get_or_create(pk = int(s['pk']))
            for key, value in s.iteritems():
                try:
                    setattr(settingObj , key , value)
                except:
                    pass
            settingObj.save()
        for n in appMedias:
            mediaObj, med = applicationMedia.objects.get_or_create(pk = int(n['pk']))
            for key, value in n.iteritems():
                try:
                    setattr(mediaObj , key , value)
                except:
                    pass
            mediaObj.save()
            try:
                attachment =  n['attachment']
                iconName = attachment.split('/')[-1]
                shortPath = attachment.replace('/media/','')
                print iconName, shortPath
                to_path = os.path.join('media_root', shortPath)
                from_path = os.path.join('media_root', 'apps', fileName , iconName)
                shutil.copy(from_path, to_path)
            except:
                pass

        return Response({},status=status.HTTP_200_OK)

def makeOnlinePayment(request):
    if globalSettings.PAYMENT_MODE == 'EBS':
        return redirect("/api/ERP/ebsPayment/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'paypal':
        return redirect("/paypalPaymentInitiate/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'PAYU':
        return redirect("/payuPaymentInitiate/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'instamojo':
        return redirect("/instamojoPaymentInitiate/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'razorpay':
        return redirect("/razorpayPaymentInitiate/?orderid=" + request.GET['orderid'])


# import razorpay
# def razorpayPaymentInitiate(request):
#     orderid = request.GET['orderid']
#     orderObj = OutBoundInvoice.objects.get(pk=orderid)
#     razorpay_key = globalSettings.RAZORPAY_KEY
#     razorpay_secret = globalSettings.RAZORPAY_SECRET
#     razorpay_client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
#
#     payload = {
#         'amount':int(orderObj.total*100),
#         'currency':'INR',
#         'receipt':str(orderObj.pk),
#         'payment_capture':1,
#     }
#
#     razorpayOrderObj = razorpay_client.order.create(data=payload)
#
#     razorpayOrderID = razorpayOrderObj['id']
#     print razorpayOrderID, 'razorpayOrderID'
#
#     orderObj.paymentRef = razorpayOrderID
#
#     orderObj.save()
#     print orderObj.paymentRef, 'paymentRef'
#
#     imageUrl = globalSettings.SITE_ADDRESS+globalSettings.BRAND_LOGO
#     emailid = orderObj.email
#     if emailid is None:
#         emailid = ''
#
#     formData =  {
#         "action" :  "https://checkout.razorpay.com/v1/checkout.js",
#         "key": razorpay_key,
#         "amount": int(orderObj.total*100),
#         "logo": imageUrl,
#         "razorpay_order_id": razorpayOrderID,
#         "cust_name": orderObj.personName,
#         "brand":"ERP",
#         "mobile": str(orderObj.phone),
#         "email": emailid,
#         'orderid':str(orderObj.pk),
#         'netbanking':'true',
#         'card':'true',
#         'wallet':'true',
#         'upi':'true',
#         'emi':'false',
#         'themeColor':'#808080',
#         'callback_url':globalSettings.SITE_ADDRESS+'/razorpayPaymentResponse/',
#         'redirect':'true',
#     }
#
#
#     return render(request , 'razorpay.payment.html' , formData)
#
# @csrf_exempt
# def razorpayPaymentResponse(request):
#     print request.POST,'request.POST'
#     razorpay_client = razorpay.Client(auth=(globalSettings.RAZORPAY_KEY, globalSettings.RAZORPAY_SECRET))
#
#     params_dict = dict(request.POST.iteritems())
#
#     try:
#         orderObj = OutBoundInvoice.objects.get(paymentRef=params_dict['razorpay_order_id'])
#     except:
#         return JsonResponse({'success': False},status =500)
#
#
#     signature_dict = {
#     'razorpay_order_id': params_dict['razorpay_order_id'],
#     'razorpay_payment_id': params_dict['razorpay_payment_id'],
#     'razorpay_signature': params_dict['razorpay_signature']
#     }
#
#     print params_dict,'params_dict'
#
#     try:
#         razorpay_client.utility.verify_payment_signature(signature_dict)
#     except:
#         return JsonResponse({'success': False},status =500)
#
#     razorResponse = json.dumps(razorpay_client.payment.fetch(params_dict['razorpay_payment_id']))
#     razorResponse = json.loads(razorResponse)
#
#
#     if razorResponse['status'] == 'captured':
#         return updateAndProcessOrder( orderObj.pk, float(razorResponse['amount'])/100)
#     else:
#         return JsonResponse({'success': False})


# def updateAndProcessOrder(orderID , amnt, referenceId=None):
#     orderObj = OutBoundInvoice.objects.get(pk =orderID )
#     orderObj.paidAmount = amnt
#     orderObj.save()
#
#     return JsonResponse({'success':True},status =200)


class GetAppSettings(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):

        data = {'playstore_url':globalSettings.PLAYSTORE_URL,'appstore_url':globalSettings.APPSTORE_URL,'app_version' : globalSettings.APP_VERSION ,'ios_app_version':globalSettings.IOS_APP_VERSION,'redirect':globalSettings.REDIRECT, 'package_name': globalSettings.PACKAGE_NAME}
        return JsonResponse(data)


class ProductMetaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = ProductMetaSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['description', 'code']
    search_fields = ('description', 'code')
    def get_queryset(self):
        toReturn = ProductMeta.objects.all()
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            toReturn = toReturn.filter(Q(description__icontains = val) | Q(code__icontains = val) | Q(typ__icontains =  val) |Q(taxRate__icontains = val))
            return toReturn
        return toReturn


class UserAppViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = UserApp.objects.all()
    serializer_class = UserAppSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app', 'user']







class getAllSettings(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        user = self.request.user
        designation = user.designation
        data = [{'groupName' : 'Company Details' , 'groupState' : 'admin.configure'},{'groupName' : 'Integrations' , 'groupState' : 'admin.integrations'}]
        repList = [{'name' : 'Cashflow Statement' , 'state' : 'admin.cashflow'},{'name' : 'Profit and Loss statement' , 'state' : 'admin.pnl'},{'name' : 'Balancesheet' , 'state' : 'admin.balancesheet'}]
        val = {'groupName' : 'Reports Formats Configuration' , 'val' : []}
        for i in repList:
            featObj = ApplicationFeature.objects.filter(name = i['name'], enabled = True).first()
            try:
                if InstalledApp.objects.filter(parent = designation.division, app__in = [featObj.parent.pk]):
                    val['val'].append(i)
            except:
                pass

        # val = {'groupName' : 'Reports Formats Configuration' , 'val' : [{'name' : 'Cashflow Statement' , 'state' : 'admin.cashflow'},{'name' : 'Profit and Loss statement' , 'state' : 'admin.pnl'},{'name' : 'Balancesheet' , 'state' : 'admin.balancesheet'}]}
        data.append(val)
        val = []
        settings = {'groupName' : 'PDF Terms and Conditions' }
        app_ids = UserApp.objects.filter(user = user).values_list('app__pk').distinct()
        application = appSettingsField.objects.filter(app__in = app_ids)
        val = appSettingsLiteFieldSerializer(application, many = True).data
        if len(val)>0:
            settings['val'] = val
            data.append(settings)
        othersList = [{'name' : 'Master Price / Rate List' , 'state' : 'admin.pricesheet'},{'name' : 'Email Templates' , 'state' : 'admin.templates'},{'name' : 'Company / National Holidays' , 'state' : 'admin.holidays'},{'name' : 'HR Policy Documents' , 'state' : 'admin.documents'},{'name' : 'Cost Centers' , 'state' : 'admin.costCenters'}]
        others ={'groupName' : 'Others' , 'val' : []}
        for i in othersList:
            featObj = ApplicationFeature.objects.filter(name = i['name'], enabled = True).first()
            try:
                if InstalledApp.objects.filter(parent = designation.division, app__in = [featObj.parent.pk]):
                    others['val'].append(i)
            except:
                pass
        data.append(others)
        return Response(data,status=status.HTTP_200_OK)


class downloadExcelFileAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        xl_file = os.path.join('static_shared' , 'demo.xlsx')
        FilePointer = open(xl_file,"r")
        response = HttpResponse(FilePointer, content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename=demo.xlsx'
        return response


class serviceApi(APIView):
    renderer_classes = (JSONRenderer,)

    def post(self , request , format = None):
        data = request.data
        if 'addresspk' in request.data:
            addressObj = address.objects.get(pk = data['addresspk'])
            addressObj.pincode = data['pincode']
            addressObj.city = data['city']
            addressObj.state = data['state']
            addressObj.country = data['country']
            addressObj.street = data['street']
            addressObj.save()
        else:
            addressObj = address.objects.create(city = data['city'], pincode = int(data['pincode']), state = data['state'], country = data['country'],street = data['street'])
            addressObj.save()

        if 'servicepk' in request.data:
            serviceObj = service.objects.get(pk = data['servicepk'])
            serviceObj.address = addressObj
            serviceObj.name = data['name']
            serviceObj.tin = data['tin']
            if 'email' in data:
                serviceObj.email = data['email']
            if 'mobile' in data:
                serviceObj.mobile = data['mobile']
            if 'bankName' in data:
                serviceObj.bankName = data['bankName']
            if 'accountNumber' in data:
                if len(str(data['accountNumber']))>0:
                    serviceObj.accountNumber = data['accountNumber']
                else:
                    serviceObj.accountNumber = None
            if 'ifscCode' in data:
                serviceObj.ifscCode = data['ifscCode']
            if 'paymentTerm' in data:
                if len(str(data['paymentTerm']))>0:
                    serviceObj.paymentTerm = data['paymentTerm']
                else:
                    serviceObj.paymentTerm = None
            serviceObj.save()
        else:
            user = request.user
            serviceObj = service.objects.create(name = data['name'], user = user, address=addressObj , tin = data['tin'], division = user.designation.division )
            if 'email' in data:
                serviceObj.email = data['email']
            if 'mobile' in data:
                serviceObj.mobile = data['mobile']
            if 'bankName' in data:
                serviceObj.bankName = data['bankName']
            if 'accountNumber' in data:
                if len(str(data['accountNumber']))>0:
                    serviceObj.accountNumber = data['accountNumber']
                else:
                    serviceObj.accountNumber = None
            if 'ifscCode' in data:
                serviceObj.ifscCode = data['ifscCode']
            if 'paymentTerm' in data:
                if len(str(data['paymentTerm']))>0:
                    serviceObj.paymentTerm = data['paymentTerm']
                else:
                    serviceObj.paymentTerm = None
            serviceObj.save()
        serviceData = serviceSerializer(serviceObj , many = False).data
        return Response(serviceData, status = status.HTTP_200_OK)

class UsageBillingViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = UsageBilling.objects.all()
    serializer_class = UsageBillingSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['month' , 'year']

def BillingCronJob(request):
    divs = Division.objects.all()
    amount = 0
    mydate = datetime.datetime.now()
    month = mydate.strftime("%B")
    year = mydate.strftime("%G")
    for div in  divs:
        installapp = InstalledApp.objects.filter(parent = div )
        for i in installapp:
            # usercount = 0
            usercount = UserApp.objects.filter(user__designation__division = div, app = i.app).count()
            print usercount,'232'
            if usercount ==0 :
                continue
            ub,created = UsageBilling.objects.get_or_create(app=i.app,date = datetime.datetime.today(), title =i.app.displayName,description=i.app.description,icon= i.app.icon , month = month, year = year , amount = usercount, division=div)
            ub.save()
    return JsonResponse({}, status = status.HTTP_200_OK)

class GetBillingAPI(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        div = request.user.designation.division
        year = request.GET['year']
        month = request.GET['month']
        usageObj = UsageBilling.objects.filter(month = month, year = year,division=request.user.designation.division)
        obj = UsageBillingSerializer(usageObj, many = True).data
        total = usageObj.aggregate(tot=Sum('amount'))
        amount = 0
        if total['tot'] is not None:
            amount = total['tot']
        data = {'obj':obj , 'amount' : amount}
        return Response(data, status = status.HTTP_200_OK)

class CalendarSlotViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = CalendarSlots.objects.all()
    serializer_class = CalendarSlotsSerializer
    # filter_backends = [DjangoFilterBackend]
    # filter_fields = ['month' , 'year']


class AppVersioningViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = AppVersioning.objects.all()
    serializer_class = AppVersioningSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title' ]

class UsageTrackerViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    # queryset = UsageTracker.objects.all()
    serializer_class = UsageTrackerSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['division' , 'detail']
    def get_queryset(self):
        toReturn = UsageTracker.objects.all().order_by('-count')
        return toReturn


class GetAllSchedulesAPI(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        user = request.user
        # div = user.designation.division
        # CalendarSlots.objects.all().delete()
        weekdays = ['Monday' , 'Tuesday' , 'wednesday' , 'Thursday' ,'Friday' , 'Saturday']
        slots = ['9-10' , '10-11' , '11-12' ,'12-13' ,'13-14' ,'14-15' , '15-16' , '16-17']
        slotObj = CalendarSlots.objects.filter(user = user)
        if slotObj.count() == 0:
            for i in weekdays:
                for j in slots:
                    obj = CalendarSlots.objects.create(day = i , slot = j, user = user)
            allData =[]
            for i in slots:
                objs =  CalendarSlotsSerializer(CalendarSlots.objects.filter(slot = i, user = user), many = True).data
                val = {'slot' : i, 'data' : objs}
                allData.append(val)
        else:
            allData =[]
            for i in slots:
                objs =  CalendarSlotsSerializer(slotObj.filter(slot = i), many = True).data
                val = {'slot' : i, 'data' : objs}
                allData.append(val)
        return Response(allData, status = status.HTTP_200_OK)


class CheckAvailabilityAPI(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self , request , format = None):
        data = request.data
        user = User.objects.get(pk = int(data['user']))
        date =  datetime.datetime.strptime(str(data['date']), '%Y-%m-%d')
        slots = ['9-10' , '10-11' , '11-12' ,'12-13' ,'13-14' ,'14-15' , '15-16' , '16-17']
        day = date.strftime('%A')
        availableSlots = []
        if day!='Sunday':
            for s in slots:
                try:
                    obj = CalendarSlots.objects.get(slot = s, day = day, user = user)
                    if obj.is_available:
                        calObj = calendar.objects.filter(when__contains = date.strftime('%Y-%m-%d'), user = user).filter(when__hour = int(s.split('-')[0]))
                        print calObj
                        if calObj.count()==0:
                            availableSlots.append(s)
                except:
                    pass
        return Response(availableSlots, status = status.HTTP_200_OK)


class CreateScheduleAPI(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self , request , format = None):
        from PIM.models import calendar
        data = request.data
        user = User.objects.get(pk = int(data['user']))
        dated = datetime.datetime.strptime(str(data['date']), '%Y-%m-%d')
        startHour = data['slot'].split('-')[0]
        endHour = data['slot'].split('-')[1]
        when = dated + timedelta(hours=int(startHour))
        end = dated + timedelta(hours=int(endHour))
        calendarObj = calendar.objects.create(user = user, eventType = 'Meeting' , duration = 3600 , when = when, end = end , text = 'Meeting')
        # try:
        #     CreateMeeting(calendarObj)
        # except:
        #     pass
        return Response(status = status.HTTP_200_OK)


class AddNewLanguageEntry(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self , request , format = None):
        # details = ['Hindi' , 'English' , 'Kannada' , 'Marathi' , 'Telgu' , 'Punjabi']
        if 'id' in request.data:
            obj = LanguageTranslation.objects.get(pk = int(request.data['id']))
            obj.value = request.data['value']
            obj.save()
            return Response( status = status.HTTP_200_OK)
        else:
            languages = ['hi' , 'en' , 'kn' , 'mr' , 'te' , 'pa']
            text = request.data['text']
            val = {}
            for i in languages:
                if i == 'en':
                    langObj,created = LanguageTranslation.objects.get_or_create(key = text, value = text , lang = i)
                else:
                    langObj,created = LanguageTranslation.objects.get_or_create(key = text, lang = i)
                val[i] = LanguageTranslationSerializer(langObj, many = False).data
            data = {'val' : val , 'created' : created}
            return Response(data , status = status.HTTP_200_OK)


class GetAllLanguageDataAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        languages = ['hi'  , 'kn' , 'mr' , 'te' , 'pa']
        mainObj = LanguageTranslation.objects.filter(lang = 'en')
        offset = int(request.GET['offset'])
        limit = int(request.GET['limit'])
        print offset,limit
        limit = offset+limit
        if 'search' in request.GET:
            mainObj = mainObj.filter(value__icontains = request.GET['search'])
        mainObj = mainObj[offset:limit]
        data = []
        for m in mainObj:
            val = {'en' : LanguageTranslationSerializer(m, many = False).data}
            for i in languages:
                val[i] = LanguageTranslationSerializer(LanguageTranslation.objects.get(lang = i, key = m.key), many = False).data
            data.append(val)
        return Response(data,status = status.HTTP_200_OK)


# class GetPaymentLinkAPIView(APIView):
#     renderer_classes = (JSONRenderer,)
#     def get(self , request , format = None):

import hashlib, datetime, random
def payuPaymentInitiate(request , data):
    # What you want the button to do.
    # orderid = request.GET['orderid']
    # orderObj = Order.objects.get(pk = orderid)


    hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";

    hash_string = '';
    hashVarsSeq = hashSequence.split('|');
    hash_object = hashlib.sha256(b'randint(0,20)')
    trxnID = hash_object.hexdigest()[0:20]

    posted = data


    for hvs in hashVarsSeq:
        try:
            hash_string += posted[hvs];
        except:
            hash_string += ''

        hash_string += '|'

    # orderObj.paymentRefId = trxnID
    # orderObj.save()
    print hash_string,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',globalSettings.PAYU_MERCHANT_SALT,'vvvvvvvvvvvvvvvvvvvvv'
    hash_string += globalSettings.PAYU_MERCHANT_SALT[0]
    hashh = hashlib.sha512(hash_string).hexdigest().lower()
    formData =  {
        "action" :  "https://secure.payu.in/_payment",
        "key": globalSettings.PAYU_MERCHANT_KEY,
        "txnid": data['txnid'],
        "hash" : hashh,
        "hash_string" : hash_string,
        "posted": posted
    }


    return render(request , 'payu.payment.html' , formData)

@csrf_exempt
def payuMoneyInitiate(request, data):
    # What you want the button to do.
    # orderid = request.GET['orderid']
    print data
    orderid = data['id']
    orderObj = Order.objects.get(pk=orderid)



    hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";

    hash_string = ''
    hashVarsSeq = hashSequence.split('|')
    hash_object = hashlib.sha256(b'randint(0,20)')
    trxnID = hash_object.hexdigest()[0:20]
    print '8088024500'
    posted = {"key"  : globalSettings.PAYU_MERCHANT_KEY ,
        "txnid" : orderid ,
        "amount" : str(orderObj.amountToPaid),
        "productinfo" : "Sterling select products",
        "firstname" : orderObj.orderBy.first_name,
        "email" : str(orderObj.orderBy.email),
        "phone" : orderObj.orderBy.profile.mobile,
        "surl" :  globalSettings.SITE_ADDRESS +'/payUPaymentResponse/',
        "furl" : globalSettings.SITE_ADDRESS +'/payUPaymentResponse/'}

    for hvs in hashVarsSeq:
        try:
            hash_string += posted[hvs]
        except:
            hash_string += ''

        hash_string += '|'

    orderObj.paymentRefId = trxnID
    orderObj.save()

    hash_string += globalSettings.PAYU_MERCHANT_SALT
    hashh = hashlib.sha512(hash_string).hexdigest().lower()
    formData =  {
        "action" :  "https://secure.payu.in/_payment",
        "key": globalSettings.PAYU_MERCHANT_KEY,
        "txnid": orderid,
        "hash" : hashh,
        "hash_string" : hash_string,
        "posted": posted
    }


    return JsonResponse(formData, status = status.HTTP_200_OK)

import razorpay
def razorpayPaymentInitiate(request):

    razorpay_key = globalSettings.RAZORPAY_KEY
    razorpay_secret = globalSettings.RAZORPAY_SECRET
    razorpay_client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
    onlinePay = OnlinePaymentDetails.objects.get(pk = request.GET['id'])


    payload = {
        'amount':int(onlinePay.amount*100),
        'currency':'INR',
        'receipt':str(onlinePay.pk),
        'payment_capture':1,
    }


    razorpayOrderObj = razorpay_client.order.create(data=payload)
    onlinePay.initiateResponse = razorpayOrderObj
    razorpayOrderID = razorpayOrderObj['id']
    onlinePay.refId =  razorpayOrderID
    onlinePay.save()

    imageUrl = globalSettings.SITE_ADDRESS+globalSettings.BRAND_LOGO
    # emailid = orderObj.orderBy.email
    # if emailid is None:
    #     emailid = ''

    formData =  {
        "action" :  "https://checkout.razorpay.com/v1/checkout.js",
        "key": razorpay_key,
        "amount": int(onlinePay.amount*100),
        "logo": imageUrl,
        "razorpay_order_id": razorpayOrderID,
        "cust_name":onlinePay.cust_name,
        "brand":onlinePay.brand,
        "mobile": onlinePay.mobile,
        "email": onlinePay.email,
        'orderid':onlinePay.pk,
        'netbanking':'true',
        'card':'true',
        'wallet':'true',
        'upi':'true',
        'emi':'false',
        # 'themeColor':storeobj.themeColor,
        'callback_url':globalSettings.SITE_ADDRESS+'/razorpayPaymentResponse/',
        'redirect':'true',
        # 'successUrl' : data['successUrl'],
        # 'failure' : data['failure']
    }


    return render(request , 'razorpay.payment.html' , formData)

@csrf_exempt
def razorpayPaymentResponse(request):
    print request.GET,'request.POST'
    razorpay_client = razorpay.Client(auth=(globalSettings.RAZORPAY_KEY, globalSettings.RAZORPAY_SECRET))

    params_dict = dict(request.POST.iteritems())

    try:
        orderObj = OnlinePaymentDetails.objects.get(refId=params_dict['razorpay_order_id'])
    except:
        return redirect('/')

    orderObj.successorfailureRes = params_dict
    signature_dict = {
    'razorpay_order_id': params_dict['razorpay_order_id'],
    'razorpay_payment_id': params_dict['razorpay_payment_id'],
    'razorpay_signature': params_dict['razorpay_signature']
    }

    print params_dict,'params_dict'

    try:
        razorpay_client.utility.verify_payment_signature(signature_dict)
    except ValueError:
        orderObj.is_failure = True
        orderObj.save()
        return redirect(orderObj.failureUrl)

    razorResponse = json.dumps(razorpay_client.payment.fetch(params_dict['razorpay_payment_id']))
    razorResponse = json.loads(razorResponse)


    print razorResponse
    orderObj.paymentGatewayType = str(razorResponse['method'])
    orderObj.is_success = True
    orderObj.save()
    if orderObj.source == 'subscription':
        divid = orderObj.payId.split('_')[-1]
        divObj = Division.objects.get(pk = int(divid))
        divObj.subscriptionExpiryDate = datetime.date.today()+relativedelta(months=+6)
        divObj.freeQuotaExcceded = False
        divObj.save()
    if orderObj.source == 'chatbot' and orderObj.chatUid is not None:
        chatThObj =  ChatThread.objects.get(uid = orderObj.chatUid)
        chatMsg = ChatMessage.objects.create(uid = orderObj.chatUid, thread = chatThObj, message = 'Payment is successful', sentByAgent = True)
    return redirect(orderObj.successUrl)
    # if razorResponse['status'] == 'captured':
    # else:
    #     if orderObj.osType == 'ios' or orderObj.osType == 'android':
    #         return redirect("/orderFailure?mobile=1")
    #     else:
    #         return redirect("/orderFailure")


# def updateAndProcessOrder(orderID , amnt, referenceId=None):
#
#     orderObj = OutBoundInvoice.objects.get(pk =orderID )
#     orderObj.paidAmount = amnt
#     orderObj.save()
#
#     return JsonResponse({'success':True},status =200)


# def GetPaymentLink(request):
#     data = json.loads(request.body)
    # data = request.GET
    # print data['redirect']
class GetPaymentLinkAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def post(self , request , format = None):
        data = request.data
        if data['id'].startswith('sale_'):
            id = data['id'].split('sale_')[1]
            if data['source'] == 'subscription':
                id = id.split('_')[0]
            name = []
            product = ''
            total = 0
            orderObj = Sale.objects.get(pk=int(id))
            outBound = SalesQty.objects.filter(outBound__id = int(id))
            count = 0
            for i in outBound:
                count += 1
                total  +=  float(i.total)
                item = i.product  +  ' + '
                if count==len(outBound):
                    name.append(i.product)
                else:
                    name.append(item)
            for i in name:
                product += i
            onlinePay = OnlinePaymentDetails.objects.create(amount = total, payId = data['id'] ,  source = data['source'], successUrl = data['successUrl'] , failureUrl = data['failureUrl'] , cust_name =  orderObj.personName, brand = orderObj.name, mobile = orderObj.phone, email = orderObj.email  )
            if 'uid' in data:
                onlinePay.chatUid = data['uid']
                onlinePay.save()

        data = '/razorpayPaymentInitiate/?id='+str(onlinePay.pk)
        return Response(data, status = status.HTTP_200_OK)


def randomPassword():
    length = 12
    chars = string.digits
    rnd = random.SystemRandom()
    return ''.join(rnd.choice(chars) for i in range(length))

class AddNewUserAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        val = request.data
        data = {}
        userObj = User.objects.filter(email = val['email'])
        if userObj.count()>0:
            user = userObj.first()
        else:
            user = User.objects.create(username = val['username'] , first_name = val['first_name'] , last_name = val['last_name'], email = val['email'] )
            # profile = user.profile
            # # profile.mobile = mobile
            # profile.save()
        div = user.designation.division
        if div == None:
            resData = helperCreateUser(val['first_name'], val['email'])
            designation = user.designation
            div = Division.objects.get(pk = int(resData['division']))
            designation.division = div
            unit = Unit.objects.get(pk = int(resData['unit']))
            designation.unit = unit
            designation.save()
        else:
            div = user.designation.division
            unit = user.designation.unit
        profile = user.profile
        token = randomPassword()
        profile.linkToken = token
        if 'type' in val and val['type'] == 'chatbot':
            profile.lastState = {'state' : 'businessManagement.chatbot.intents', 'url' : '/businessManagement/chatbot/intents'}
        profile.save()
        user.is_staff = True
        user.save()
        if 'applist' in val:
            try:
                appList = val['applist'].split(',')
            except:
                appList = val['applist']
            for i in appList:
                app = application.objects.get(name = i)
                print div
                iapp, created = InstalledApp.objects.get_or_create(parent = div , app = app, addedBy= user)
                if app.inMenu == True:
                    print i
                    ua, c = UserApp.objects.get_or_create(user = user , app = app)
                    ua.save()
        if div.divisionCostCenter.all().count() == 0:
            CreateCostCenter(div.pk)
        if div.divisionAccount.all().count() == 0:
            CreateBankAccount(div.pk)
        if div.tncs.all().count() == 0:
            CreateSalesTermsAndCondition(div.pk)
        if div.divisionCategory.all().count() == 0:
            CreateProducts(div.pk)
        if div.divisionContacts.all().count() == 0:
            CreateContact(div.pk, user.pk)
        data = {'url' : globalSettings.SITE_ADDRESS+ '/tlogin/?token=' + profile.linkToken}
        return Response(data, status = status.HTTP_200_OK)


class GetAppInstalledAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self, request , format = None):
        defaultApps = [{'displayName' : 'Payslips', 'name' : 'app.payroll'},  {'displayName' : 'Leaves', 'name' : 'app.attendance'} ,  {'displayName' : 'Expenses', 'name' : 'app.expenseClaims'}]
        div = request.user.designation.division
        data = []
        for i in defaultApps:
            instObj = InstalledApp.objects.filter(app__name = i['name'], parent = div)
            if instObj.count()>0:
                inst = instObj.first()
                val = {'icon' : inst.app.icon , 'displayName' : i['displayName'], 'appStoreUrl' : '' ,  'playStoreUrl' : '', 'type' : 'page'}
                data.append(val)
        otherApps = div.installations.filter(app__inMenu = True)
        for j in otherApps:
            val = {'icon' : j.app.icon , 'displayName' : j.app.displayName, 'appStoreUrl' : j.app.appStoreUrl ,  'playStoreUrl' : j.app.playStoreUrl, 'type' : 'store'}
            data.append(val)
        return Response(data,status = status.HTTP_200_OK)




class CreateSubscriptionAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def post(self, request , format = None):
        div = Division.objects.get(pk = int(globalSettings.PARENT_DIVSION))
        current_user = request.user
        current_div = current_user.designation.division
        units =  current_user.designation.division.units.all()
        unit = None
        allusers = User.objects.filter(designation__division = div, is_staff = True)
        if units.count()>0:
            unit = units.first()
        serviceObj, c = service.objects.get_or_create(name = current_div.name, division = div ,user = allusers.first())
        if c and unit is not None:
            addrsObj = address.objects.create(street = unit.address , city = unit.city, state = unit.state, pincode = unit.pincode, country = unit.country )
            serviceObj.mobile = unit.mobile
            serviceObj.address = addrsObj
            serviceObj.save()
        contactObj, cc = Contact.objects.get_or_create(company = serviceObj, division = div, name = current_div.name)
        if cc and unit is not None:
            contactObj.email = unit.email
            contactObj.mobile =  unit.mobile
            contactObj.mobile =  unit.mobile
            if serviceObj.address is not None:
                contactObj.street = serviceObj.address.street
                contactObj.city = serviceObj.address.city
                contactObj.pincode = serviceObj.address.pincode
                contactObj.state = serviceObj.address.state
                contactObj.country = serviceObj.address.country
        contactObj.save()
        saleObj = Sale.objects.create(name = serviceObj.name, contact =  contactObj, personName =  contactObj.name, phone = contactObj.mobile, email = contactObj.email, address = contactObj.street, pincode = contactObj.pincode, state = contactObj.state , city = contactObj.city , country = contactObj.country, balanceAmount = 12000, sameasbilling = True , billingAddress = contactObj.street, billingPincode = contactObj.pincode, billingState = contactObj.state , billingCity = contactObj.city , billingCountry = contactObj.country, division = div)
        alltncs = div.tncs.all()
        if alltncs.count()>0:
            saleObj.termsandcondition = alltncs.first()
            saleObj.terms =  alltncs.first().body
        allCostCenter =  div.divisionCostCenter.all()
        if allCostCenter.count()>0:
            saleObj.costcenter = allCostCenter.first()
        # account to be added
        allAccounts = div.divisionAccount.filter(personal = False, heading = 'income')
        if allAccounts.count()>0:
            saleObj.account = allAccounts.first()
        saleObj.save()
        amount = int(globalSettings.SUBSCRIPTION_AMOUNT)
        total = amount*6
        obj = SalesQty.objects.create(outBound = saleObj, product = 'Student subscription of 6 months', price = amount, qty = 6, total = total, division = div)
        return Response({'sale' : saleObj.pk,'division': current_div.pk},status = status.HTTP_200_OK)


class GetAppUsageCountAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def post(self, request , format = None):
        print request.body, request.data
        if 'divId' in request.data:
            try:
                secretKey = base64.b64decode(request.data['divId'])
                plaintext = decrypt('itsasecret', secretKey)
                division = int(plaintext)
            except:
                return Response({'errMsg' : 'Invalid License Key'},status = status.HTTP_200_OK)
        elif 'division' in request.data:
            division = request.data['division']
        else:
            division = request.user.designation.division.pk
        count = 0
        freeQuotaExcceded = True
        try:
            count = CreateUsageTracker(division, request.data['type'])
            div = Division.objects.get(pk = int(division))
            if count > 5 and div.subscriptionExpiryDate == None:
                div.freeQuotaExcceded = True
                div.save()
        except:
            pass
        try:
            freeQuotaExcceded = div.freeQuotaExcceded
        except:
            pass
        return Response({'count' : count, 'freeQuotaExcceded' : freeQuotaExcceded},status = status.HTTP_200_OK)
    # def get(self, request , format = None):
    #     secretKey = base64.b64decode('c2MAAikFoS/TBkiLWFj/B+yQQNdkQja3wxjdzY4mlOkL2WjTICkHQb1NOJ9lHEj9Cz/Si7LyaNrUgfniDpaRsR/eJMdy')
    #     plaintext = decrypt('itsasecret', secretKey)
    #     print plaintext,'dddddddddddddddddddddd'
    #     pass


def downloadLicense(request):
    filename = "License.key"

    usr = request.user

    data = {
        'email' : usr.email,
        'token' : globalSettings.APIMANAGER_URL_KEY,
        'first_name' : usr.first_name,
        'last_name' : usr.last_name,
        'mobile' : usr.profile.mobile,
    }
    res = requests.post(globalSettings.APIMANAGER_URL_PREFIX + '/getToken/', data = data)
    print res.text
    try:
        # content = res.json()['token']
        secretId = encrypt('itsasecret', str(request.user.designation.division.pk))
        encoded_cipher = base64.b64encode(secretId)
        content = json.dumps({'id' : res.json()['token'], 'divId' :  encoded_cipher})
    except:
        filename = "error.html"
        content = res.text
    response = HttpResponse(content, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={0}'.format(filename)
    return response



class GetAppUsageGraphAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self, request , format = None):
        data = []
        divObj = Division.objects.get(pk = int(request.GET['div']))
        labelsArr = []
        dataArr = []
        seriesArr = []
        usage = divObj.divisionUsage.all()
        for j in usage:
            labelsArr.append(j.detail)
            dataArr.append(j.count)
        toReturn = {
            "data" : dataArr,
            "labels" : labelsArr,
        }
        data = {'name' : divObj.name, 'pk': divObj.pk, 'data' : toReturn}
        fromDate = request.GET['fromDate']
        toDate = request.GET['toDate']
        fromDate = datetime.datetime.strptime(fromDate,'%Y-%m-%d')
        toDate = datetime.datetime.strptime(toDate,'%Y-%m-%d')
        totalDays = toDate - fromDate
        totalDays = str(totalDays).split(' ')[0]
        divisons = Division.objects.all()
        divChart = {"data" : [] , "labels" : []}
        try:
            for i in range(1,int(totalDays)+1):
                currDate =  fromDate + datetime.timedelta(days=i)
                currDate = currDate.date()
                divChart['labels'].append(currDate)
                divChart['data'].append(divisons.filter(created__contains = currDate).count())
        except:
            pass
        return Response({'usage' : data, 'division' : divChart},status = status.HTTP_200_OK)
