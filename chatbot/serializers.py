from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from django.conf import settings as globalSettings
from rest_framework.response import Response
import re
from PIL import Image
import os
from PIM.models import *

class NodeSlectionsVariationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeSlectionsVariations
        fields = ('pk', 'parent', 'txt')

class NodeBlockInputVariationLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeBlockInputVariation
        fields = ('pk', 'txt','response')

class ActionIntentInputVariationLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionIntentInputVariation
        fields = ('pk', 'txt')

class NodeSlectionsVariationsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeSlectionsVariations
        fields = ('pk', 'txt')

class StartoverVariationsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartoverVariations
        fields = ('pk', 'txt')
class ActionIntentInputVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionIntentInputVariation
        fields = ('pk', 'parent', 'txt')

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ('pk', 'callbackName', 'to' , 'parent', 'condition' )
class StartoverVariationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartoverVariations
        fields = ('pk', 'parent', 'txt')

class NodeDesignerSerializer(serializers.ModelSerializer):
    connections = ConnectionSerializer(many = True , read_only = True)
    class Meta:
        model = NodeBlock
        fields = ('id', 'name', 'description', 'color', 'label', 'newy', 'newx', 'type', 'connections', 'blockType' , 'parent', 'icon' , 'company' , 'auto_response' , 'context_key','saleConfig')

class NodeBlockLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeBlock
        fields = ('pk', 'auto_response','company', 'enabled', 'nodeResponse', 'failResponse', "name" , 'parent')
        read_only_fields = ('company' , )

import basehash
hash_fn = basehash.base36()

class IntentLiteSerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField()
    class Meta:
        model = NodeBlock
        fields = ('pk', 'name', 'type', 'key')
    def get_key(self , obj):
        key =  hash_fn.hash(obj.pk)
        print key
        return key


class NodeBlockSerializer(serializers.ModelSerializer):
    connections = ConnectionSerializer(many = True , read_only = True)
    input_vatiations = NodeBlockInputVariationLiteSerializer(many = True , read_only = True)
    action_intent_vatiations = ActionIntentInputVariationLiteSerializer(many = True , read_only = True)
    node_variations_vatiations = NodeSlectionsVariationsLiteSerializer(many = True , read_only = True)
    startover_vatiations = StartoverVariationsLiteSerializer(many = True , read_only = True)
    context_requirement = NodeBlockLiteSerializer(many = True , read_only = True)
    inheritedFrom = NodeBlockLiteSerializer(many = False , read_only = True)
    key = serializers.SerializerMethodField()

    class Meta:
        model = NodeBlock
        fields = ('pk', 'name', 'description', 'auto_response', 'rule', 'context_key', 'custom_process_code', 'type', 'failResponse', 'nodeResponse', 'externalProcessType', 'endpoint', 'input_vatiations', 'action_intent_vatiations', 'node_variations_vatiations', 'startover_vatiations','company','parent', 'uipathEnvironment', 'uipathProcess', 'uipathRobot', 'leadMagnet', 'emailMagnet', 'mobileMagnet', 'nameMagnet', 'leadMagnetDefer', 'enabled', 'context_requirement', 'response', 'unique', 'needConfirmation', 'verify', 'pre_validation_code', 'validation_code', 'inheritedFrom', 'connections', 'blockType' , 'parent', 'icon', 'exampleInput', 'retry' , 'newx' , 'newy' , 'color' , 'label', 'key', 'uipathQueue','saleConfig')
        read_only_fields = ('company' , )

    def get_key(self , obj):
        key =  hash_fn.hash(obj.pk)
        print key
        return key

    def create(self , validated_data):
        comp = CustomerProfile.objects.get(service__id = self.context['request'].data['company'] )
        nb = NodeBlock(**validated_data)
        nb.company = comp
        nb.save()

        if 'autoGen' in self.context['request'].GET:
            mobnb = NodeBlock(**{"auto_response" : "May I know your mobile number please" , "context_key" : "mobile", "rule" : "process|extract|mobile", "type" : "extract", "failResponse" : "In case we got disconnected I can reach out to your number to help you out with your requirement", "name" : "Mobile", "nodeResponse" : "thanks", "enabled" : False, "parent" : nb, "company" : comp })
            mobnb.save()
            mobnb = NodeBlock(**{"auto_response" : "may i have your name?" , "context_key" : "name", "rule" : "process|extract|name", "type" : "extract", "failResponse" : "Your name will be helpful in future commincations, can I have it ?", "name" : "Name", "nodeResponse" : "thanks {{name}}", "enabled" : False, "parent" : nb, "company" : comp })
            mobnb.save()
            mobnb = NodeBlock(**{"auto_response" : "And what will be your email ID" , "context_key" : "email", "rule" : "process|extract|email", "type" : "extract", "failResponse" : "We send personalized offers time to time over email. No spam, I promise", "name" : "Email ID", "nodeResponse" : "thank you very much", "enabled" : False, "parent" : nb, "company" : comp })
            mobnb.save()


        return nb

    def update(self ,instance, validated_data):

        print "In saving the intent"

        d = self.context['request'].data


        for key in ['name', 'description', 'auto_response', 'rule', 'context_key', 'custom_process_code', 'type', 'failResponse', 'nodeResponse', 'externalProcessType', 'endpoint', 'method', 'authentication','company','parent', 'uipathEnvironment', 'uipathProcess', 'uipathRobot', 'leadMagnet', 'emailMagnet', 'mobileMagnet', 'nameMagnet', 'leadMagnetDefer', 'enabled', 'context_requirement', 'response', 'unique', 'needConfirmation', 'verify', 'pre_validation_code', 'validation_code', 'exampleInput', 'retry' , 'uipathQueue','saleConfig']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass

        if 'uipathQueue' in d:
            instance.uipathQueue = d['uipathQueue']
            instance.uipathProcess = None
            instance.uipathRobot = None
        elif 'uipathProcess' in d:
            instance.uipathProcess = d['uipathProcess']
            instance.uipathRobot = d['uipathRobot']
            instance.uipathQueue = None

        if 'inheritedFrom' in d and  d['inheritedFrom'] is not None:
            instance.inheritedFrom =NodeBlock.objects.get(pk = d['inheritedFrom'] )
        instance.save()
        return instance

class FAQInputVariationLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQInputVariation
        fields = ( 'pk' ,'txt')

class FAQSerializer(serializers.ModelSerializer):
    input_vatiations = FAQInputVariationLiteSerializer(many = True , read_only = True)
    class Meta:
        model = FAQ
        fields = ( 'pk' , 'company','response' , 'url' ,'secondaryAnswer', 'parent', 'name', 'input_vatiations' , 'terminate')

    def create(self, validated_data):
        faq = FAQ(**validated_data)
        faq.save()
        d = self.context['request'].data
        if 'input_vatiations_arr' in d:
            for inpvar in d['input_vatiations_arr']:
                faqInput = FAQInputVariation(txt = inpvar['txt'] , parent = faq )
                faqInput.save()

        return faq



class FAQInputVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQInputVariation
        fields = ( 'pk' , 'parent','txt')


from PIM.models import ChatThread

class PublicChatThreadSerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()
    agent_dp = serializers.SerializerMethodField()
    companyName = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = ChatThread
        fields = ( 'pk' , 'uid', 'agent_name','agent_dp' , 'typ' , 'transferred' , 'user', 'companyName', 'participants')
    def get_agent_name(self , obj):
        users = obj.participants.all()
        if users.count()>0:
            user = users.first()
            return user.last_name
        else:
            return ''
    def get_agent_dp(self , obj):
        users = obj.participants.all()
        if users.count()>0:
            try:
                user = users.first()
                return user.profile.displayPicture.url
            except:
                return ''
        else:
            return ''
    def get_companyName(self , obj):
        try:
            return obj.company.name
        except :
            return ''
    def get_user(self , obj):
        users = obj.participants.all()
        if users.count()>0:
            return users.first().pk
        else:
            return None

class ChatThreadSerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()
    agent_dp = serializers.SerializerMethodField()
    companyName = serializers.SerializerMethodField()
    class Meta:
        model = ChatThread
        fields = ( 'pk' , 'created' , 'uid', 'status' , 'customerRating' , 'customerFeedback' ,
        'company','user','userDevice','userDeviceIp' ,'chatDuration' ,'firstResponseTime',
        'typ','reviewedOn',"reviewedBy",'closedOn','closedBy','resolvedBy','resolvedOn','archivedOn','archivedBy','escalatedL1On','escalatedL1By','escalatedL2On','escalatedL2By','location','agent_name','agent_dp','companyName','userAssignedTime','firstMessage','receivedBy', 'transferred', 'visitor')
        read_only_fields = ('receivedBy',)
    def get_agent_name(self , obj):
        users = obj.participants.all()
        if users.count()>0:
            user = users.first()
            return user.last_name
        else:
            return ''
    def get_agent_dp(self , obj):
        users = obj.participants.all()
        if users.count()>0:
            try:
                user = users.first()
                return user.profile.displayPicture.url
            except:
                return ''
        else:
            return ''
    def get_companyName(self , obj):
        try:
            return obj.company.name
        except :
            return ''

    def create(self ,  validated_data):
        print validated_data
        c = ChatThread(**validated_data)
        c.save()
        c.company = Division.objects.get(pk=int(self.context['request'].data['company']))
        browserHeader =  dict((regex.sub('', header), value) for (header, value) in self.context['request'].META.items() if header.startswith('HTTP_'))
        print browserHeader.get('USER_AGENT') , self.context['request'].META.get('REMOTE_ADDR'),'@@@@@@@@@@@2'
        if browserHeader.get('USER_AGENT'):
            c.userDevice = browserHeader.get('USER_AGENT')
        if self.context['request'].META.get('REMOTE_ADDR'):
            c.userDeviceIp = self.context['request'].META.get('REMOTE_ADDR')
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
        return c
    def update(self ,instance, validated_data):
        if 'status' in self.context['request'].data and instance.status=='started':
            uidMsg = SupportChat.objects.filter(uid=instance.uid)
            if len(uidMsg)>0:
                instance.chatDuration = round((uidMsg[uidMsg.count()-1].created - uidMsg[0].created).total_seconds()/60.0 , 2)
        if 'status' in self.context['request'].data:
            if self.context['request'].data['status']=='reviewed':
                instance.reviewedOn = datetime.datetime.now()
                instance.reviewedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='closed':
                instance.closedOn = datetime.datetime.now()
                if 'closedByUser' in self.context['request'].data:
                    pass
                else:
                    instance.closedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='resolved':
                instance.resolvedOn = datetime.datetime.now()
                instance.resolvedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='archived':
                instance.archivedOn = datetime.datetime.now()
                instance.archivedBy = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='escalatedL1':
                instance.escalatedL1On = datetime.datetime.now()
                instance.escalatedL1By = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()
            if self.context['request'].data['status']=='escalatedL2':
                instance.escalatedL2On = datetime.datetime.now()
                instance.escalatedL2By = User.objects.get(pk=int(self.context['request'].user.pk))
                instance.save()

        for key in ['status' , 'customerRating' , 'customerFeedback' , 'company','typ','isLate','location', 'visitor']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'visitor' in self.context['request'].data:
            instance.visitor = Visitor.objects.get(pk=int(self.context['request'].data['visitor']))
        if 'user' in self.context['request'].data:
            if instance.user is None:
                instance.userAssignedTime = datetime.datetime.now()
            instance.user = User.objects.get(pk=int(self.context['request'].data['user']))

        if 'patchMessagesAlso' in self.context['request'].data and 'user' in self.context['request'].data:
            uid = instance.uid
            Usr = User.objects.get(pk=int(self.context['request'].data['user']))
            chats = SupportChat.objects.filter(uid = uid, user = None)
            for c in chats:
                c.user = Usr
                c.save()

        if 'receivedBy' in self.context['request'].data:
            for u in self.context['request'].data['receivedBy']:
                u = User.objects.get(pk = int(u))
                instance.receivedBy.add(u)
        # if 'user' in self.context['request'].data and 'firstAssign' in self.context['request'].data:
        #     if instance.user is None:
        #         instance.user = User.objects.get(pk=int(self.context['request'].data['user']))
        #     else:
        #         raise ValidationError(detail={'PARAMS' : 'Already Taken'})

        instance.save()

        if 'email' in self.context['request'].data:
            print 'getting email here' , self.context['request'].data['email']
            email = self.context['request'].data['email']
            uid = instance.uid
            vObj = Visitor.objects.filter(uid = uid)
            if len(vObj)>0:
                print 'hree'
                vObj[0].email = email
                vObj[0].save()
            else:
                v = Visitor.objects.create(uid = uid , email = email)
                # Visitor(uid = uid , email = email)
                v.save()

        return instance

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ( 'pk' ,'uid', 'page', 'timeDuration','reference','lat','lng')
    def update(self ,instance, validated_data):
        for key in ['uid', 'page', 'timeDuration','reference']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'duration' in self.context['request'].data:
            instance.timeDuration += int(self.context['request'].data['duration'])
        instance.save()
        return instance



class SupportChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ( 'pk' , 'created' , 'uid', 'attachment' ,'user' ,'message' ,'attachmentType','sentByAgent','responseTime','logs','delivered' ,'read','is_hidden','thread')
    def create(self ,  validated_data):
        s = ChatMessage(**validated_data)
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

            if not chatThObj[0].company.botMode:
                requests.post(globalSettings.WAMP_POST_ENDPOINT,
                    json={
                      'topic': globalSettings.WAMP_PREFIX + 'service.support.agent',
                      'args': [ s.uid , "M" , sJson , chatThObj[0].company.pk , False , chatThObj[0].pk, chatThObj[0].company.name , chatThObj[0].company.pk ]
                    }
                )


        if s.is_hidden or chatThObj[0].transferred or s.sentByAgent:
            return s

        requests.post(globalSettings.WAMP_POST_ENDPOINT,
            json={
              'topic': globalSettings.WAMP_PREFIX + 'service.support.chat.' + s.uid ,
              'args': [ "T"]
            }
        )
        # context = {"uid" : s.uid}
        # empty = True
        # for cntx in ChatContext.objects.filter(uid = s.uid):
        #     empty = False
        #     if cntx.typ == 'int':
        #         if cntx.value == 'None':
        #             context[cntx.key] = None
        #         else:
        #             context[cntx.key] = int(cntx.value)
        #     elif cntx.typ == 'date':
        #         try:
        #             context[cntx.key] = datetime.datetime.strptime(cntx.value, '%Y-%m-%d %H:%M:%S')
        #         except:
        #             context[cntx.key] = datetime.datetime.strptime(cntx.value, '%Y-%m-%d %H:%M:%S.%f')
        #     else:
        #         context[cntx.key] = cntx.value

        # if 'step_id' not in context:
        #     context['step_id'] = str(NodeBlock.objects.filter(company = chatThObj[0].company , type = 'FAQ')[0].id)

        # if 'leadMagnetDefer' not in context:
        #     context['leadMagnetDefer'] = 0
        # if 'leadMagnetSuccess' not in context:
        #     context['leadMagnetSuccess'] = "0"

        # if 'retryID' not in context:
        #     context['retryID'] = None

        # if 'retry' not in context:
        #     context['retry'] = 0

        # context['chatThread'] = chatThObj[0]
        # if s.attachment != None:
        #     fileUrl = globalSettings.SITE_ADDRESS + s.attachment.url
        # else:
        #     fileUrl = None

        # context = getResponse(s.message, context, chatThObj[0].company , fil = fileUrl)
        return s


class VariableContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariableContext
        fields = ( 'pk' ,'typ', 'key', 'value','can_change','nodeBlock')

class ChatContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatContext
        fields = ( 'pk' ,'typ', 'key', 'value')
