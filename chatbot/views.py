# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework import viewsets , permissions , serializers
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from .models import *
from django.db.models import Q
from rest_framework.views import APIView
from openpyxl import load_workbook
from io import BytesIO,StringIO
from openpyxl import Workbook
from django.http import HttpResponse
from openpyxl.writer.excel import save_virtual_workbook
from django.core.exceptions import ObjectDoesNotExist , SuspiciousOperation
from django.conf import settings as globalSettings
from rest_framework.renderers import JSONRenderer
import os
import json
import sys, traceback
from ERP.models import service, address
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import datetime
from marketing.models import Contacts
import getpass
# if getpass.getuser() == 'cioc-d2':
from talk import *
from PIM.models import *

# Create your views here.

def intentDesignerView(request , id):
    pk = hash_fn.unhash(id)
    if not request.user.is_authenticated():
        try:
            acc = ApiAccount.objects.get(apiKey = request.GET['apikey'])
        except:
            traceback.print_exc(file=sys.stdout)
            raise SuspiciousOperation('Expired')
        login(request , acc.user, backend='django.contrib.auth.backends.ModelBackend')

    nb = NodeBlock.objects.get(pk = pk)
    COMP_PROFILE_PK = nb.company.pk
    API_KEY = nb.company.apiKey
    COMPANY_PK = nb.company.pk

    return render(request, 'rsoDesignerMain.html' ,{"BRAND_NAME" : globalSettings.BRAND_NAME , "WS_SERVER"  : globalSettings.WAMP_SERVER, "ID" : pk  , 'COMPANY_PK' : COMPANY_PK , 'COMP_PROFILE_PK' : COMP_PROFILE_PK , 'API_KEY' : hash_fn.hash(COMPANY_PK) , "title" : nb.name})
class FAQViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['response','url', 'company', 'input_vatiations']
    def get_queryset(self):
        return FAQ.objects.all().order_by('-id')

class FAQInputVariationViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = FAQInputVariationSerializer
    queryset = FAQInputVariation.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent','txt']

class NodeSlectionsVariationsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NodeSlectionsVariationsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['txt','parent']
    def get_queryset(self):

        return NodeSlectionsVariations.objects.all()

class NodeBlockViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NodeBlockSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name', 'description','parent', 'type','company']
    def get_queryset(self):


        value = NodeBlock.objects.filter(company = self.request.user.designation.division.pk)
        if 'parent_none' in  self.request.GET:
            return value.filter(parent__isnull = True)
        else:
            return value
class ActionIntentInputVariationViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ActionIntentInputVariationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['txt','parent']
    def get_queryset(self):
        return ActionIntentInputVariation.objects.all()
class StartoverVariationsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = StartoverVariationsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['txt','parent']
    def get_queryset(self):
        return StartoverVariations.objects.all()

class ConnectionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ConnectionSerializer
    # queryset = Error.objects.all()
    filter_backends = [DjangoFilterBackend]
    def get_queryset(self):
        return Connection.objects.all()

class IntentLiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = IntentLiteSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name', 'description','parent', 'type','company']
    def get_queryset(self):

        value = NodeBlock.objects.filter(company = self.request.user.designation.division.pk)

        if 'parent_none' in  self.request.GET:
            return value.filter(parent__isnull = True)
        else:
            return value

galleryList = json.loads(open(os.path.join(globalSettings.BASE_DIR , 'chatbot' , 'gallery' , 'list.json')).read())

class GalleryAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request, format = None):
        return Response(galleryList , status =  status.HTTP_200_OK)


class CloneAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request, format = None):

        # http://localhost:8000/api/support/intentView/470/?full=1
        # , {
        #   "name": "COVID-19 Screening bot ",
        #   "file": "covid.json",
        #   "icon": "/static/images/covid.svg"
        # }

        # {
        #   "name": "Appointment",
        #   "file": "appointment.json",
        #   "icon": "/static/images/calendar.png"
        # },


        print "Cloning ........................"
        comp = request.user.designation.division

        structure = {}
        blocks = json.loads(open(os.path.join(globalSettings.BASE_DIR ,'chatbot', 'gallery' , request.GET['file'])).read())
        parent = None
        for b in blocks:
            print b

            nb = NodeBlock(**{"name" : b['name'] , "color" : b['color'] , 'label' : b['label'] , 'newx' : b['newx'] , 'newy' : b['newy'] ,'blockType' : b['blockType'] , 'icon' : b['icon'] , 'company' : comp   })
            nb.save()

            structure[str(b['pk'])] = nb
            if parent is None:
                parent = nb
            else:
                nb.parent = parent
                nb.save()

            for key in ['auto_response' , 'context_key' , 'custom_process_code', 'failResponse', 'nodeResponse', 'externalProcessType', 'endpoint', 'enabled', 'response', 'unique', 'needConfirmation', 'verify', 'pre_validation_code', 'validation_code', 'exampleInput', 'retry']:
                try:
                    setattr(nb , key , b[key])
                except:
                    pass

            nb.save()

            for vatiation in b['input_vatiations']:
                t = NodeBlockInputVariation(**{'txt' :  vatiation['txt'] , 'parent' : nb })
                t.save()

            for vatiation in b['action_intent_vatiations']:
                t = ActionIntentInputVariation(**{'txt' :  vatiation['txt'] , 'parent' : nb })
                t.save()

            for vatiation in b['node_variations_vatiations']:
                t = NodeSlectionsVariations(**{'txt' :  vatiation['txt'] , 'parent' : nb })
                t.save()
            for vatiation in b['startover_vatiations']:
                t = StartoverVariations(**{'txt' :  vatiation['txt'] , 'parent' : nb })
                t.save()

        for b in blocks:
            for c in b['connections']:
                con = Connection(callbackName = c['callbackName'] , condition = c['condition'] , parent =  structure[str(c['parent'])]   )

                if c['to'] is not None:
                    con.to = structure[str(c['to'])]
                con.save()

        return Response({"pk" : parent.pk , 'key' : hash_fn.hash(parent.pk) } , status =  status.HTTP_200_OK)
class IntentView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request , id, format = None):
        nodes = NodeBlock.objects.filter(Q(pk=id) | Q(parent__id=id))
        # print "id : " , id

        # for node in nodes:
        #     if node.connections.all().count()==0:
        #         Connection.objects.create(callbackName='next'  , parent = node)

        if 'full' in request.GET:
            toReturn = NodeBlockSerializer(nodes , many = True).data
        else:
            toReturn = NodeDesignerSerializer(nodes , many = True).data


        return Response(toReturn , status =  status.HTTP_200_OK)
    def post(self , request , id , format = None):
        print "id : " , id
        d = request.data
        nb = NodeBlock()
        nb.name = d['name']
        nb.blockType = d['blockType']
        nb.color = d['color']
        nb.newx = d['newx']
        nb.newy = d['newy']

        if 'type' in d:
            nb.type = d['type']

        if 'auto_response' in d:
            nb.auto_response = d['auto_response']
        if 'failResponse' in d:
            nb.failResponse = d['failResponse']
        if 'nodeResponse' in d:
            nb.nodeResponse = d['nodeResponse']
        if 'context_key' in d:
            nb.context_key = d['context_key']
        if 'exampleInput' in d:
            nb.exampleInput = d['exampleInput']
        if 'pre_validation_code' in d:
            nb.pre_validation_code = d['pre_validation_code']

        if d['blockType'] != 'start':
            nb.icon = d['icon']
            nb.label = d['label']
            nb.description = d['description']
            nb.parent = NodeBlock.objects.get(pk = d['parent'])
            nb.company = nb.parent.company
        else:
            nb.company = request.user.designation.division

        if 'custom_process_code' in d:
            nb.custom_process_code = d['custom_process_code']

        nb.save()

        if nb.type == 'FAQ':
            ns = NodeSlectionsVariations(parent = nb , txt = 'AN INPUT USER WILL NEVER ENTER IDEALLY')
            ns.save()

            resum = NodeBlock(color = "orange",label= "Resume",newy=549,newx=102, blockType="resume",parent=nb, company = nb.company )
            resum.save()


        if nb.blockType == 'askForPermission':
            for txts in ['ok' , 'fine' , 'sure' , 'please go ahead']:
                ni = NodeBlockInputVariation(txt = txts , parent = nb)
                ni.save()

            for txts in ['no' , 'leave it, i will come back' , 'no thanks' , 'stop']:
                ni = ActionIntentInputVariation(txt = txts, parent = nb)
                ni.save()

            for txts in ['can you change' , 'i want to edit' , 'revise' , 'please change']:
                ni = StartoverVariations(txt = txts, parent = nb)
                ni.save()


        for conn in d['connections']:
            connection = Connection(callbackName = conn['callbackName'] , parent = nb  )
            if 'condition' in conn:
                connection.condition = conn['condition']
            if 'to' in conn:
                connection.to = NodeBlock.objects.get(pk = conn['to'])
            if nb.type == 'FAQ':
                connection.to = resum
            connection.save()

        if 'connection' in d:
            conn = Connection.objects.get( pk = d['connection'] )
            conn.to = nb
            conn.save()


        toReturn = NodeDesignerSerializer( nb , many = False).data
        return Response(toReturn , status =  status.HTTP_200_OK)

    def delete(self , request , id , format = None):
        NodeBlock.objects.get(pk = id).delete()
        return Response({} , status =  status.HTTP_200_OK)

    def patch(self , request , id , format = None):
        print request.data
        if request.data['action'] == 'removeConnection' :
            conn = Connection.objects.get(pk = id)
            conn.to = None
            conn.save()
            return Response({} , status =  status.HTTP_200_OK)
        if request.data['action'] == 'addConnection' :
            conn = Connection.objects.get(pk = id)
            conn.to = NodeBlock.objects.get(pk = request.data['to'])
            conn.save()
            return Response({"to" : request.data['to']} , status =  status.HTTP_200_OK)

        if request.data['action'] == 'updatePosition' :
            for block in request.data['blocks']:
                nb = NodeBlock.objects.get(pk = block['id'])
                nb.newx = block['newx']
                nb.newy = block['newy']
                nb.save()

            return Response({} , status =  status.HTTP_200_OK)

class SaveSettingsAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request , format = None):
        try:
            profile = request.user.designation.division
        except:
            return Response({'reason' : 'profile_not_found' },status = status.HTTP_403_FORBIDDEN)


        if request.GET['type'] == 'uipath':
            return Response({'email' : profile.uipathUsername, 'tenant' : profile.uipathTenent ,'url' :  profile.uipathUrl , 'password' : profile.uipathPass , 'uipathOrgId' : profile.uipathOrgId },status = status.HTTP_200_OK)
        elif request.GET['type'] == 'web':
            return Response({'url' : profile.service.web ,  'apiKey' : profile.apiKey , 'host' : globalSettings.SITE_ADDRESS  }, status = status.HTTP_200_OK)
        elif request.GET['type'] == 'messenger':
            return Response({'access_token' : profile.access_token,'pageID' : profile.pageID}, status = status.HTTP_200_OK)
        elif request.GET['type'] == 'whatsapp':
            return Response({'twillioAccountSID' : profile.twillioAccountSID,'trillioAuthToken' : profile.trillioAuthToken,'whatsappNumber' : profile.whatsappNumber}, status = status.HTTP_200_OK)
        elif request.GET['type'] == 'buttonSetting':
            return Response({'ios_sdk_enabled' : profile.ios_sdk_enabled,'react_sdk_enabled' : profile.react_sdk_enabled,'rest_sdk_enabled' : profile.rest_sdk_enabled,'android_sdk_enabled' : profile.android_sdk_enabled}, status = status.HTTP_200_OK)
        elif request.GET['type'] == 'uiSettings':
            return Response(CustomerProfileSerializer(profile).data, status = status.HTTP_200_OK)
        elif request.GET['type'] == 'whatsappTest':
            return Response({ 'whatsapp_test_number' : profile.whatsapp_test_number   }, status = status.HTTP_200_OK)


    def post(self , request , format = None):
        custProfile = request.user.designation.division

        if request.data['type'] == 'uipath':
            d = request.data['data']
            token = uiPathToken( d['email'] , d['password'] , d['tenant'] ,  d['url'])
            custProfile.uipathUrl = d['url']
            custProfile.uipathPass = d['password']
            custProfile.uipathUsername = d['email']
            custProfile.uipathTenent = d['tenant']
            custProfile.uipathOrgId = d['uipathOrgId']
        elif request.data['type'] == 'messenger':
            d = request.data['data']
            custProfile.access_token = d['access_token']
            custProfile.pageID = d['pageID']
        elif request.data['type'] == 'whatsapp':
            d = request.data['data']
            custProfile.twillioAccountSID = d['twillioAccountSID']
            custProfile.trillioAuthToken = d['trillioAuthToken']
            custProfile.whatsappNumber = d['whatsappNumber']
        elif request.data['type'] == 'web':
            ser  = custProfile.service
            ser.web = request.data['data']['url']
            ser.save()
        elif request.data['type'] == 'ios':
            custProfile.ios_sdk_enabled = request.data['ios_sdk_enabled']
        elif request.data['type'] == 'react':
            custProfile.react_sdk_enabled = request.data['react_sdk_enabled']
        elif request.data['type'] == 'rest':
            custProfile.rest_sdk_enabled = request.data['rest_sdk_enabled']
        elif request.data['type'] == 'android':
            custProfile.android_sdk_enabled = request.data['android_sdk_enabled']
        elif request.data['type'] == 'whatsappTest':
            custProfile.whatsapp_test_number = request.data['whatsapp_test_number']

        custProfile.save()
        return Response({},status = status.HTTP_200_OK)

    def delete(self , request , format = None):
        custProfile = CustomerProfile.objects.get(service = request.user.servicesContactPerson.all()[0])
        custProfile.uipathUrl = None
        custProfile.uipathPass = None
        custProfile.uipathUsername = None
        custProfile.uipathTenent = None
        custProfile.save()
        return Response({},status = status.HTTP_200_OK)

class GetExampleInputView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        txt = ''
        nb = NodeBlock.objects.get(pk = request.GET['step'])
        if nb.exampleInput is None or len(nb.exampleInput) == 0:
            valid = False
        else:
            valid = True
            txt = nb.exampleInput

        if nb.blockType == 'giveChoices':
            valid = True
            txt = nb.connections.all()[0].condition
        elif nb.blockType == 'presentCatalog':
            valid = True
            txt = Category.objects.get(pk = nb.endpoint).categoryInventory.all().first().sku

        return JsonResponse({"valid" : valid , 'txt' : txt} ,status =200 )

class GetAPIKeyView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request, format = None):
        # support.cioc.in||EUJbqOw66BQWaO6mSvQBtfDyg1f8yLkcbBA2VxGqDg||cioc||socket.syrow.com
        key = '||'.join([ globalSettings.SITE_ADDRESS.split('//')[1],   CustomerProfile.objects.get(pk = 1).apiKey , globalSettings.WAMP_PREFIX[:-1] ,  'socket.cioc.in' ])
        return Response({"key" : key } , status =  status.HTTP_200_OK)


class SendAppLinkAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request, format = None):
        params = request.GET
        print params

        if params['device'] == 'android':
            msg = 'EpsilonAI app : https://apps.apple.com/us/app/inciocepsilonai/id1484441018'
            url = globalSettings.SMS_API_PREFIX + 'number=%s&message=%s'%(params['mob'] , msg)
            requests.get( url )
        elif params['device'] == 'ios':
            msg = 'EpsilonAI app : https://play.google.com/store/apps/details?id=in.cioc.epsilonai'
            url = globalSettings.SMS_API_PREFIX + 'number=%s&message=%s'%(params['mob'] , msg)
            requests.get( url )
        elif params['device'] == 'whatsappTest':

            msg = 'Hi '+ request.user.first_name +', Your whatsapp sandbox is ready to use. Reply here to talk to your bot.'

            client = Client(globalSettings.TWILLIO_SID , globalSettings.TWILLIO_AUTH_TOKEN )
            message = client.messages.create(
                                          body= msg ,
                                          from_='whatsapp:+%s'%(globalSettings.DEFAULT_WHATSAPP_NUMBER ),
                                          to='whatsapp:+%s'%(params['mob'])
                                      )




        return Response({} , status =  status.HTTP_200_OK)



from uipathHelper import *

class UIPathResourcesAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request , format = None):
        profile = request.user.designation.division

        token = uiPathToken(profile.uipathUsername, profile.uipathPass , profile.uipathTenent , profile.uipathUrl)
        print token

        headers = {"Authorization":"Bearer "+ token, "X-UIPATH-TenantName":profile.uipathTenent }

        if profile.uipathOrgId is not None:
            headers["X-UIPATH-OrganizationUnitId"] = profile.uipathOrgId

        if request.GET['type'] == 'process':
            print profile.uipathUrl +"/odata/Processes"
            res=requests.get(url=profile.uipathUrl +"/odata/Processes", headers= headers)
            return Response(res.json(),status = status.HTTP_200_OK)
        elif request.GET['type'] == 'environment':
            res=requests.get(url=profile.uipathUrl + "/odata/Environments", headers=headers)
            return Response(res.json(),status = status.HTTP_200_OK)
        elif request.GET['type'] == 'robots':
            res = requests.get(url=profile.uipathUrl + "/odata/Robots" , headers = headers)
            return Response(res.json(),status = status.HTTP_200_OK)

        elif request.GET['type'] == 'queues':
            res = requests.get(url=profile.uipathUrl + "/odata/QueueDefinitions" , headers = headers)
            return Response(res.json(),status = status.HTTP_200_OK)

# from chatbot.nlpEngine import parseLine
defaultCode = open(os.path.join(globalSettings.BASE_DIR , 'chatbot' , 'testRunner' , 'default.py'  )).read()
import subprocess

from fabric.api import local

class ExtractorTesterView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):

        txt = request.data['txt']
        logic = request.data['code']

        # print txt , logic
        runtimePath = os.path.join(globalSettings.BASE_DIR , 'chatbot' , 'testRunner' , request.user.username + '.runner.py'  )

        runtimeCode = open( runtimePath  , 'w' )
        runtimeCode.write(defaultCode.format(txt , logic))

        finalCmd = "bash "+ os.path.join(globalSettings.BASE_DIR , 'chatbot' , 'testRunner' ,  'runner.sh'  ) + " " + runtimePath
        # finalCmd = "python " + runtimePath
        print finalCmd
        os.system(finalCmd)



        return JsonResponse({"status" : None} ,status =200 )

regex = re.compile('^HTTP_')
def getChatterScript(request , fileid):
    obj = Division.objects.get(pk = hash_fn.unhash(fileid))
    pk = obj.pk
    serviceWebsite = obj.website
    browserHeader =  dict((regex.sub('', header), value) for (header, value) in request.META.items() if header.startswith('HTTP_'))

    # print "referer", browserHeader['REFERER']

    dataToSend = {"pk" : obj.pk ,'supportBubbleColor':obj.supportBubbleColor ,'iconColor':obj.iconColor, "windowColor" : obj.windowColor ,"fontColor":obj.fontColor,
        "custName" : obj.name , "chat":True , "callBack": False , "video":False ,"is_blink":obj.is_blink  ,
        "audio":False , "ticket":False , "serverAddress" : globalSettings.SITE_ADDRESS ,
        "wampServer" : globalSettings.WAMP_SERVER, "wampLongPoll" : globalSettings.WAMP_LONG_POLL ,"webrtcAddress": globalSettings.WEBRTC_ADDRESS,"wamp_prefix":globalSettings.WAMP_PREFIX,
        "chatIconPosition":obj.chatIconPosition,'chatIconType':obj.chatIconType,"integrated_media":obj.integrated_media , "botMode" : obj.botMode }
    if obj.dp:
        dataToSend["dp"] =  obj.dp.url
    if obj.name:
        dataToSend["name"] =  obj.name
    if obj.support_icon:
        dataToSend["support_icon"] =  obj.support_icon.url
    else:
        dataToSend["support_icon"] = ''


    if obj.firstMessage:

        dataToSend["firstMessage"] =  obj.firstMessage
        print obj.firstMessage

    if obj.welcomeMessage:
        dataToSend["welcomeMessage"] =  obj.welcomeMessage

    dataToSend['brandName'] = globalSettings.BRAND_NAME
    dataToSend['brandLink'] = globalSettings.BRAND_ACTIVATION_LINK

    if 'debugger' in request.GET:
        dataToSend['debugger']=1;
    else:
        dataToSend['debugger']=0;

    return render(request, 'chatter.js', dataToSend ,content_type="application/x-javascript")
    # if globalSettings.SITE_ADDRESS in browserHeader['REFERER'] or serviceWebsite in browserHeader['REFERER']:
    # else:
        # pass
        # return HttpResponse(request,'')
        # return render(request, 'chatter.js', dataToSend ,content_type="application/x-javascript")



class ChatThreadViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ChatThreadSerializer
    # queryset = ChatThread.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['uid','status','company']
    def get_queryset(self):
        print "in get queryset"
        if 'uid' in self.request.GET and 'checkThread' in self.request.GET:
            print "in iff"
            threadObj = ChatThread.objects.filter(uid = self.request.GET['uid'])
            if threadObj.count()>0:
                print 'sssssssssssssssssssss',threadObj[0].status
                if threadObj[0].status != 'started':
                    print 'nottttttttttttttt',threadObj[0].status
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            print 'tttttttttttttttt',threadObj
            return threadObj
        # return ChatThread.objects.all()
        if 'companyHandelrs' in self.request.GET and 'checkThread' in self.request.GET:
            threadObj = ChatThread.objects.filter(company = self.request.GET['companyHandelrs'])
            if threadObj.count()>0:
                print 'sssssssssssssssssssss',threadObj[0].status
                if threadObj[0].status != 'started':
                    print 'nottttttttttttttt',threadObj[0].status
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            print 'tttttttttttttttt',threadObj
            return threadObj
        return ChatThread.objects.all()

@csrf_exempt
def activityView(request):
    if request.method == 'POST':
        d = json.loads(request.body)
        act = Activity.objects.create(**d)
        return JsonResponse(ActivitySerializer(act , many = False).data , status = 201)
    elif request.method == 'PATCH':
        d = json.loads(request.body)
        if request.GET['act'] == 'undefined':
            return JsonResponse({})
        act = Activity.objects.get(pk = request.GET['act'])
        act.timeDuration = d['duration']
        act.save()
        return JsonResponse({})
    else:
        act = Activity.objects.filter(uid = request.GET['uid']).last()
        return JsonResponse(ActivitySerializer(act , many = False).data)


class SupportChatViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SupportChatSerializer
    # queryset = SupportChat.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['uid','user']
    exclude_fields = ['id']
    def get_queryset(self):
        supChatObj = ChatMessage.objects.all()
        u = self.request.user
        if u.is_anonymous():
            supChatObj = supChatObj.filter(is_hidden = False)
        if 'visitorReq' in self.request.GET:
            supChatObj = supChatObj.filter(is_hidden = False)
        if 'unDelMsg' in self.request.GET:
            values=[int(i) for i in ast.literal_eval(self.request.GET['values'])]
            print values , type(values)
            if u.is_anonymous():
                return ChatMessage.objects.filter(pk__in=values,is_hidden = False)
            if 'visitorReq' in self.request.GET:
                return ChatMessage.objects.filter(pk__in=values,is_hidden = False)
            return ChatMessage.objects.filter(pk__in=values)
        if 'user__isnull' in self.request.GET:
            return ChatMessage.objects.filter(user__isnull=True)
        if 'uid' in self.request.GET:
            return supChatObj.filter(uid = self.request.GET['uid'])
        if 'date' in self.request.GET:
            date = datetime.datetime.strptime(self.request.GET['date'], '%Y-%m-%d').date()
            return supChatObj.filter(created__startswith = date)
        else:
            return ChatMessage.objects.all()
        return ChatMessage.objects.all()


@csrf_exempt
def publicAPI(request , objectType):
    if objectType == 'chatThread':
        if request.method == 'PATCH':

            data = json.loads(request.body)
            chatThObj = ChatThread.objects.filter(uid = data['uid'])[0]
            if 'status' in data and data['status']=='closed':
                try:
                    now = datetime.datetime.now()
                except:
                    now = datetime.now()

                chatThObj.closedOn = now
                chatThObj.status = data['status']
                # if 'closedByUser' in data:
                #     pass
                # else:
                #     instance.closedBy = User.objects.get(pk=int(request.user.pk))

            if 'customerFeedback' in data:
                chatThObj.customerFeedback = data['customerFeedback']
                chatThObj.customerRating = data['customerRating']

            if 'email' in data and len(data['email'])>0:
                c , created = Contacts.objects.get_or_create(email = data['email'])
                chatThObj.visitor = c

            chatThObj.save()
            return JsonResponse({})

        elif request.method == 'POST':
            data = json.loads(request.body)
            c = ChatThread(uid =  data['uid'] )
            c.company = Division.objects.get(pk=data['company'])
            browserHeader =  dict((regex.sub('', header), value) for (header, value) in request.META.items() if header.startswith('HTTP_'))
            if browserHeader.get('USER_AGENT'):
                c.userDevice = browserHeader.get('USER_AGENT')
            if request.META.get('REMOTE_ADDR'):
                c.userDeviceIp = request.META.get('REMOTE_ADDR')
                try:
                    api1 = requests.request('GET',"http://api.ipstack.com/"+c.userDeviceIp+"?access_key=f6e584f19ad6fa9080e0434fb46ae508&format=1")
                    # api1=requests.request('GET',"http://api.ipstack.com/43.224.128.172?access_key=f6e584f19ad6fa9080e0434fb46ae508&format=1")
                    c.location=json.dumps(api1.json())
                except:
                    try:
                        api2 = requests.request('GET','http://ip-api.com/json/'+c.userDeviceIp)
                        # api2=requests.request('GET','http://ip-api.com/json/43.224.128.172')
                        c.location=json.dumps(api2.json())
                    except :
                        pass
            c.save()
            s = ChatMessage(uid = data['uid'])
            s.thread = c
            s.uid = c.uid
            if 'firstMessage' in data:
                s.message = data['firstMessage']
            s.save()
            return JsonResponse({"pk" : c.pk , "transferred" : c.transferred, "sentByAgent" : True}, status = 201)
        else:
            c = ChatThread.objects.filter(uid = request.GET['uid'] , status = 'started' ).last()
            return JsonResponse(PublicChatThreadSerializer(c , many = False ).data , safe=False)

    elif objectType == 'supportChat':

        if request.method == 'POST':

            try:
                data = json.loads(request.body)
            except:
                data = request.POST



            chatThObj = ChatThread.objects.filter(uid = data['uid'])[0]
            s = ChatMessage(uid = data['uid'])
            s.thread = chatThObj
            s.uid = chatThObj.uid

            if 'attachmentType' in data and data['attachmentType'] is not None:
                s.attachment = request.FILES['attachment']
                s.attachmentType = data['attachmentType']
            else:
                s.message = data['message']
            try:
                s.attachment = request.FILES['attachment']
                if s.attachment.name.endswith('.pdf'):
                    s.fileType = 'pdf'
                elif s.attachment.name.endswith('.png') or  s.attachment.name.endswith('.jpg') or  s.attachment.name.endswith('.jpeg'):
                    s.fileType = 'image'
                elif s.attachment.name.endswith('.doc') or  s.attachment.name.endswith('.docs') or s.attachment.name.endswith('.docx'):
                    s.fileType = 'word'
                elif s.attachment.name.endswith('.ppt') or  s.attachment.name.endswith('.pptx'):
                    s.fileType = 'ppt'
                elif s.attachment.name.endswith('.xlsx') or s.attachment.name.endswith('.xls'):
                    s.fileType = 'xl'
                s.fileSize ="{:.2f}".format(s.attachment.size)
                s.fileName = s.attachment.name
            except:
                pass


            s.save()

            if ChatMessage.objects.filter(uid = s.uid, user__isnull = True).count()==1 and s.user is None:

                attachUrl = None
                try:
                    attachUrl = self.context['request'].build_absolute_uri(s.attachment.url)
                except:
                    pass
                sJson = {
                    "attachment": attachUrl,
                    "attachmentType": s.attachmentType,
                    "created": "2019-05-30T11:00:53.253Z",
                    "is_hidden": s.is_hidden,
                    "logs": None,
                    "message": s.message,
                    "sentByAgent": s.sentByAgent,
                    "timeDate": "00:00 PM",
                    "uid": s.uid,
                    "sentfrom" : "system"
                }

                if not chatThObj.company.botMode:
                    requests.post(globalSettings.WAMP_POST_ENDPOINT,
                        json={
                        'topic': globalSettings.WAMP_PREFIX + 'service.support.agent',
                        'args': [ s.uid , "M" , sJson , chatThObj.company.pk , False , chatThObj.pk, chatThObj.company.name , chatThObj.company.pk ]
                        }
                    )
            print s.is_hidden
            print chatThObj.transferred
            print s.sentByAgent
            # after this point its all about robot response
            if s.is_hidden or chatThObj.transferred or s.user is not None:
                print "Returning : "
                return JsonResponse(SupportChatSerializer(s , many = False).data , safe=False)

            requests.post(globalSettings.WAMP_POST_ENDPOINT,
                json={
                'topic': globalSettings.WAMP_PREFIX + 'service.support.chat.' + s.uid ,
                'args': [ "T"]
                }
            )
            context = {"uid" : s.uid}
            empty = True
            for cntx in ChatContext.objects.filter(uid = s.uid):
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

            print "chatThObj[0].company : " , chatThObj.company
            if 'step_id' not in context:
                context['step_id'] = str(NodeBlock.objects.filter(company = chatThObj.company , type = 'FAQ')[0].id)


            if 'leadMagnetDefer' not in context:
                context['leadMagnetDefer'] = 0
            if 'leadMagnetSuccess' not in context:
                context['leadMagnetSuccess'] = "0"

            if 'retryID' not in context:
                context['retryID'] = None

            if 'retry' not in context:
                context['retry'] = 0

            context['chatThread'] = chatThObj
            if s.attachment != None:
                fileUrl = globalSettings.SITE_ADDRESS + s.attachment.url
            else:
                fileUrl = None

            context = getResponse(s.message, context, chatThObj.company , fil = fileUrl)
            print context
            print "BOT LOGIC ---------------------------------ENDS"
            return JsonResponse(SupportChatSerializer(s , many = False).data , safe=False , status = 201)
        if request.method == 'GET':
            msgs = ChatMessage.objects.filter(uid = request.GET['uid'],  is_hidden = False)
            return JsonResponse(SupportChatSerializer(msgs , many = True).data , safe=False)


    return

if getpass.getuser() == 'cioc-d2':
    from talk import initialiseBlock , saveContext

@csrf_exempt
def ExternalWindow(request):
    if request.method == 'GET':

        if 'mode' in request.GET and request.GET['mode'] == 'info':
            ct = ChatThread.objects.filter(uid = request.GET['uid'])
            if ct.count()==0:
                return JsonResponse({"status" : "not found"} , status = 404)
            else:
                ct = ct[0]
                toReturn = {"userDevice": ct.userDevice , "location" : ct.location , "ip" : ct.userDeviceIp}
                vists = Visitor.objects.filter(uid = request.GET['uid'])

                if vists.count()>0:
                    toReturn['email'] = vists[0].email
                    toReturn['name'] = vists[0].name
                    toReturn['phoneNumber'] = vists[0].phoneNumber
                    toReturn['notes'] = vists[0].notes

                return JsonResponse(toReturn , status = 200)

        cc = ChatContext.objects.filter(uid = request.GET['uid'] , key = request.GET['key'])
        if cc.count()==0:
            return JsonResponse({"status" : "not found"} , status = 404)
        else:
            return JsonResponse({"key" : cc[0].key , "value" : cc[0].value , "type" : cc[0].typ} , status = 200)
    else:
        if 'mode' in request.GET and request.GET['mode'] == 'save':
            cc , created = ChatContext.objects.get_or_create(uid = request.POST['uid'] , key =  request.POST['key'])

            cc.value = request.POST['value']
            cc.typ = request.POST['type']
            cc.save()

            return JsonResponse({"status" : "ok"} , status = 200)
        elif 'mode' in request.GET and request.GET['mode'] == 'file':

            createMessage( request.POST['uid'] , None , fileObj = request.FILES['fileObj']   )
            return JsonResponse({"status" : "ok"} , status = 200)
        elif 'mode' in request.GET and request.GET['mode'] == 'resume':
            print "Resuming the conversation"
            context = {"uid" :  request.POST['uid'] }
            empty = True
            for cntx in ChatContext.objects.filter(uid =  request.POST['uid'] ):
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


            context['chatThread'] = ChatThread.objects.filter(uid = request.POST['uid'] )[0]

            if 'leadMagnetDefer' not in context:
                context['leadMagnetDefer'] = 0
            if 'leadMagnetSuccess' not in context:
                context['leadMagnetSuccess'] = "0"


            if 'retryID' not in context:
                context['retryID'] = None

            if 'retry' not in context:
                context['retry'] = 0


            node = NodeBlock.objects.get(pk = context['rpa_callback_node'] )
            nxt = node.connections.filter(callbackName = 'success')[0]


            context["step_id"]= nxt.to_id
            saveContext('step_id' , 'int' , context)
            initialiseBlock(nxt.to , context)

            # remove rpa_callback_node

            return JsonResponse({"status" : "ok"} , status = 200)


        elif 'mode' in request.GET and request.GET['mode'] == 'reject':

            context = {"uid" :  request.POST['uid'] }
            empty = True
            for cntx in ChatContext.objects.filter(uid =  request.POST['uid'] ):
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


            context['chatThread'] = ChatThread.objects.filter(uid = request.POST['uid'] )[0]

            if 'leadMagnetDefer' not in context:
                context['leadMagnetDefer'] = 0
            if 'leadMagnetSuccess' not in context:
                context['leadMagnetSuccess'] = "0"


            if 'retryID' not in context:
                context['retryID'] = None

            if 'retry' not in context:
                context['retry'] = 0


            node = NodeBlock.objects.get(pk = context['rpa_callback_node'] )


            nxt = node.connections.filter(callbackName = 'failure')[0]
            context["step_id"]= nxt.to_id
            saveContext('step_id' , 'int' , context)
            initialiseBlock(nxt.to , context)
            return JsonResponse({"status" : "ok"} , status = 200)

        else:
            createMessage(request.POST['uid'] ,  request.POST['message'])
            return JsonResponse({"status" : "ok"} , status = 200)

class VariableContextViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = VariableContextSerializer
    queryset = VariableContext.objects.all()




class GetVariablesAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes=(permissions.AllowAny,)
    def get(self , request, format = None):
        data = request.GET
        chatObj = ChatContext.objects.filter(uid = data['uid'])
        otherObj = VariableContext.objects.filter(nodeBlock__id = data['id'])
        data = {'dynamicVariables' : VariableContextSerializer(otherObj, many = True).data , 'contextVariables' : ChatContextSerializer(chatObj, many = True).data}
        return JsonResponse(data , status = 200)
