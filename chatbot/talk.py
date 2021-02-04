import json
from chatbot.helper import *
from chatbot.nlpEngine import parseLine
from django.template import Context
from django.template import Template
from django.conf import settings as globalSettings
# optional if you just render str instead of template file
from django.template.loader import get_template
import sys
from .models import *
DEBUG = True
from os import listdir
from os.path import isfile, join
from .uipathHelper import uiPathToken , ReleasekeyGet
from PIM.models import *
import math, random
from finance.models import Category

def isSafe(code):
    for word in ['getcwd', 'open(' , 'open (' , 'import' , ' os ' , ' os' , 'os ' , ' open' , 'open ' , ' open ']:
        if word in code:
            print "\n\n --------------- UNSAFE CODE --------------------------------\n\n\n ----------------------- UNSAFE CODE---------------\n\n"
            return False
    return True


# function to generate OTP
def generateOTP() :

    # Declare a digits variable
    # which stores all digits
    digits = "0123456789"
    OTP = ""

   # length of password can be chaged
   # by changing value in range
    for i in range(4) :
        OTP += digits[int(math.floor(random.random() * 10))]

    return OTP


def getMatch(config, inp):
    c1 = compareSentance(Statement(config.txt),Statement(inp))
    if c1 > 0.8:
        return True
    else:
        return False

def getMobile(num):
    num = re.findall('[\+\d{12}]+[\+\d{10}]', num)
    return num

def email(se):
    se = re.findall('\S+@\S+', se)
    return se

def sendError(msg , typ , uid):
    requests.post(globalSettings.WAMP_POST_ENDPOINT,
        json={
          'topic': globalSettings.WAMP_PREFIX + 'service.support.debugger.' + uid ,
          'args': [ "ERROR" ,msg ,  typ ]
        }
    )

def executeExternalRPACall(config , ctx):



    print "config" , config , config.name
    custProfile = config.company
    print custProfile

    if custProfile.uipathUrl is None:
        sendError('You have not configured UiPath Orchestrator settings yet. Click here to configure now.' , 'UIPATHCONFIG' , ctx['uid'] )


    value = uiPathToken(custProfile.uipathUsername, custProfile.uipathPass, custProfile.uipathTenent, custProfile.uipathUrl)




    headers = {"Authorization" : "Bearer " + value , "X-UIPATH-TenantName":  custProfile.uipathTenent }
    if custProfile.uipathOrgId is not None:
        headers["X-UIPATH-OrganizationUnitId"] = custProfile.uipathOrgId

    if not config.uipathQueue:
        try:
            robotIDs = [json.loads(config.uipathRobot)['Id']]
        except:
            sendError('You have not selected the process and robot in Invoke UiPath Process. Click here to select' , 'CONFIG' , ctx['uid'] )

        print "Running on a perticular machine...........\n\n"
        releaseKey = ReleasekeyGet(value , config.uipathProcess , custProfile.uipathTenent ,  custProfile.uipathUrl , custProfile.uipathOrgId )
        PARAMS = {"startInfo":{"ReleaseKey":releaseKey,"Strategy":"Specific","RobotIds":robotIDs,"NoOfRobots":0,"Source":"Manual"}}
        PARAMS['startInfo']['InputArguments']= "{\"requestID\":\"%s\"}"%(ctx['uid'])

        s = requests.post(url = custProfile.uipathUrl + "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs",json=PARAMS,headers = headers )

    else:
        print "Adding a job in the queue...........\n\n"
        PARAMS = {
            "itemData": {
              "Name": config.uipathQueue,
              "Priority": "Normal",
              "SpecificContent": {
                  "requestID": ctx['uid'],
            }
          }
        }

        s = requests.post(url = custProfile.uipathUrl + "/odata/Queues/UiPathODataSvc.AddQueueItem()",json=PARAMS,headers = headers )


    print s.json()
    if s.status_code>250:
        return False , "Opps.. I got an error while processing this"


    return True , "Please wait a moment while we process your request"

import sys, traceback , os
EAI_open = open
EAI_sys = sys
EAI_os = os

def initialiseBlock(node , cntx):
    if node is None:
        print "Next block is None , returning , execution ended"
        return
    print "Init  ; Block" , node.pk ,node.name, node.leadMagnetDefer ,  cntx['leadMagnetDefer']>= node.leadMagnetDefer, cntx['leadMagnetDefer'] , node.blockType , '000000000000000000'


    if node.blockType == 'runPython':
        # EAI_open = open
        open = None
        os = None
        sys = None
        try:
            # print os , "os"
            # print sys , "sys"
            # print open , "open"

            if isSafe(node.custom_process_code):
                exec(node.custom_process_code)

            nxt = node.connections.filter(callbackName = 'success')[0]
        except:
            traceback.print_exc(file=sys.stdout)
            nxt = node.connections.filter(callbackName = 'failure')[0]
        cntx["step_id"]= nxt.to_id
        saveContext('step_id' , 'int' , cntx)

        initialiseBlock(nxt.to , cntx)
        return cntx

    elif node.blockType == 'giveChoices':
        if cntx['chatThread'].channel == 'whatsapp':
            renderedMessage = Template(node.auto_response).render(Context(cntx)) +'\n'
        else:
            renderedMessage = Template(node.auto_response).render(Context(cntx)) +'\n <br>'

        print "AUTORESPONSE while initializing :", renderedMessage# rendered response

        for indx, conn in enumerate( node.connections.all()):

            if cntx['chatThread'].channel == 'whatsapp':
                renderedMessage +=  str(indx + 1) +'. ' + conn.condition +'\n'
            else:
                renderedMessage +=  '<span onclick="optionTouched(%s)">'%("'"+ conn.condition +"'") +  str(indx + 1) +'. ' + conn.condition +'\n <br>' +'</span>'

        createMessage(cntx['uid'] , renderedMessage  )
    elif node.blockType == 'presentCatalog':
        print "Rendering the choices div on the screen.....\n\n---------\n"
        print node.endpoint , 'endpoint'

        scrollProds = '<div class="scrollView">'
        for prod in Category.objects.get(pk = node.endpoint).categoryInventory.all():
            print prod
            try:
                imgUrl = prod.img1.url
            except:
                imgUrl = '/static/images/icon.png'
            if  prod.description:
                description = prod.description
            else:
                description = 'No description'
        # for (let j = 0; j < productsArr.length; j++) {
            scrollProds += '<div class="prodView" onclick="selectCatalogProduct(\''+ prod.sku +'\')"><img src="'+ imgUrl +'"><br><span class="prodHeading">'+ prod.name +'</span><br><span class="prodSubHeading">MRP : '+ str(prod.rate)  +'</span></div>'
        # }
        scrollProds += '</div>'



        createMessage(cntx['uid'] , Template(node.auto_response).render(Context(cntx))  )
        createMessage(cntx['uid'] , scrollProds  )
    elif node.blockType == 'transfer':

        renderedMessage = Template(node.auto_response).render(Context(cntx))
        print "AUTORESPONSE while initializing :", renderedMessage# rendered response
        createMessage(cntx['uid'] , renderedMessage  )
        return transferSession(cntx)



    elif node.blockType == 'end':
        return cntx
    elif node.blockType == 'sendMessage':
        renderedMessage = Template(node.auto_response).render(Context(cntx))
        print "AUTORESPONSE while initializing :", renderedMessage# rendered response
        createMessage(cntx['uid'] , renderedMessage  )

        nxt = node.connections.all()[0]

        cntx["step_id"]= nxt.to_id
        saveContext('step_id' , 'int' , cntx)

        initialiseBlock(nxt.to , cntx)
        return cntx

    elif node.blockType == 'addCondition':
        ctx = cntx
        exec('condi=' + node.auto_response)

        nxt = node.connections.filter(condition = condi)[0]


        ctx["step_id"]= nxt.to_id
        saveContext('step_id' , 'int' , ctx)

        initialiseBlock(nxt.to , ctx)
        return ctx

    elif node.blockType == 'invokeUiPath':
        print "will invoke uipath"

        renderedMessage = Template(node.auto_response).render(Context(cntx))
        createMessage(cntx['uid'] , renderedMessage  )

        success , message = executeExternalRPACall(node , cntx)

        print "UIPath invokation result : " , success

        if success:
            cntx["rpa_callback_node"]= node.pk
            saveContext('rpa_callback_node' , 'int' , cntx)
            print "saving the calback node pk to " , node.pk
        else:
            nxt = node.connections.filter(callbackName = 'failure')[0]


            cntx["step_id"]= nxt.to_id
            saveContext('step_id' , 'int' , cntx)

            initialiseBlock(nxt.to , cntx)

        return cntx



    elif node.type == 'FAQ':
        renderedMessage = Template(node.auto_response).render(Context(cntx))
        createMessage(cntx['uid'] , renderedMessage  )
        nxt = node.connections.all()[0]

        cntx["step_id"]= nxt.to_id
        saveContext('step_id' , 'int' , cntx)

        initialiseBlock(nxt.to , cntx)
        return cntx

    elif node.blockType == 'resume':
        nxt = NodeBlock.objects.get(pk = cntx['resume_id'])
        cntx["step_id"]= nxt.pk
        saveContext('step_id' , 'int' , cntx)
         # either initialize it or skip it if retry count is higher than txt.retry

        print cntx

        initialiseBlock(nxt , cntx)
        return cntx

    else:


        if 'resume_id' in cntx and cntx['resume_id'] == str(node.pk):
            print "Increasing retry count"
            cntx['retry'] += 1
            saveContext('retry' , 'int' , cntx)

            if cntx['retry']>node.retry+1:
                nxt = node.connections.filter(callbackName = 'failure')[0]
                cntx["step_id"]= nxt.to_id
                cntx['resume_id'] = None
                saveContext('step_id' , 'int' , cntx)
                saveContext('resume_id' , 'int' , cntx)
                cntx['retry'] = 0
                saveContext('retry' , 'int' , cntx)
                initialiseBlock(nxt.to , cntx)
                return

        print cntx

        renderedMessage = Template(node.auto_response).render(Context(cntx))
        print "AUTORESPONSE while initializing :last ", renderedMessage# rendered response
        createMessage(cntx['uid'] , renderedMessage  )


    return cntx



def executeExternalRestCall(config , ctx):

    if isSafe(config.custom_process_code):
        exec(config.custom_process_code)
    return True , None

def checkForSiblings(txt , ctx, config):
    print "Checking for siblings"
    if DEBUG:
        print ctx["step_id"]
    extracted = False
    for config2 in config.parent.context_requirement.all():
        if config2.rule == "process|extract|email":
            emails =  email(txt)
            if len(emails)>0:
                ctx[config2.context_key] =emails[0]
                saveContext(config2.context_key , 'str' , ctx)
                print "BOT  : " , config2.nodeResponse
                createMessage(ctx['uid'] , config2.nodeResponse )
                return ctx , True
        if config2.rule == "process|extract|mobile":
            mobiles =  getMobile(txt)
            if len(mobiles)>0:
                ctx[config2.context_key] =mobiles[0]
                saveContext(config2.context_key , 'str' , ctx)
                print "BOT  : " , config2.nodeResponse
                createMessage(ctx['uid'] , config2.nodeResponse )
                return ctx , True
        if config2.rule == "process|extract|name":
            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)

            if len(persons)>0:
                ctx[config2.context_key] =persons[0]
                saveContext(config2.context_key , 'str' , ctx)
                print "BOT  : " , config2.nodeResponse

                renderedResponse = Template(config2.nodeResponse).render(Context(ctx))
                print "BOT response After Extract: ", renderedResponse

                createMessage(ctx['uid'] , renderedResponse )
                return ctx , True

    return ctx , extracted

def answerFAQandGeneral(txt , ctx, compProfile):
    print "Checking for general answers and node selection variations"
    servce = compProfile

    FAQFileconfigs = list(FAQInputVariation.objects.filter(parent__company = servce))

    matchedtemp = False

    FAQFileconfigsCompared = []
    for configFaq in FAQFileconfigs:
        configFaq.sim = compareSentance(Statement(configFaq.txt),Statement(txt))
        print "FAQ ----- " , configFaq.txt , "----------" , configFaq.sim
        if configFaq.sim>0.9:
            FAQFileconfigsCompared.append(configFaq)

    FAQFileconfigsCompared.sort(key=lambda x: x.sim, reverse=True)

    for toPrint in FAQFileconfigsCompared:
        print toPrint.txt , toPrint.sim


    if len(FAQFileconfigsCompared)>0:
        configFaq = FAQFileconfigsCompared[0]
        if configFaq.parent.response == "":
            msg = "Please look at this page for more details" + configFaq['url']
        else:
            msg = configFaq.parent.response

        createMessage(ctx['uid'] , msg )
        FAQBlock = NodeBlock.objects.get(company = compProfile , type = 'FAQ')
        if FAQBlock.leadMagnet and ctx['leadMagnetDefer']>= FAQBlock.leadMagnetDefer:
            for ctx_req in FAQBlock.context_requirement.all():
                if ctx_req.context_key not in ctx and ctx_req.enabled:
                    ctx['step_id'] = str(ctx_req.pk)
                    saveContext('step_id' , 'int' , ctx)
                    if DEBUG:
                        print "LEAD magnet: not present , go to block " , ctx['step_id']
                    return initialiseBlock(ctx_req , ctx)
        elif FAQBlock.leadMagnet:
            ctx['leadMagnetDefer'] +=1
            saveContext('leadMagnetDefer' , 'int' , ctx)
        return True
        # check for lead magnet


    print "FQA message failed."
    if not matchedtemp:
        print " Checking for node selections"

        nsvList = list(NodeSlectionsVariations.objects.filter(parent__company = compProfile))

        nsvListCompared = []
        for nsv in nsvList:
            nsv.sim = compareSentance(Statement(nsv.txt),Statement(txt))
            if nsv.sim>0.9:
                nsvListCompared.append(nsv)

        nsvListCompared.sort(key=lambda x: x.sim, reverse=True)

        print "nsvListCompared : " , nsvListCompared
        for toPrint in nsvListCompared:
            print toPrint.txt , toPrint.sim

        if len(nsvListCompared)>0:
            node = nsvListCompared[0].parent
            # createMessage(ctx['uid'] ,node.auto_response )
            # return True
        else:
            print "check for variations and corresponding response. If none matches reply the auto_response"
            nodes = NodeBlock.objects.filter(type = 'general')
            # node = NodeBlock.objects.filter(company = compProfile , type = 'general')[0]

            for node in nodes:
                generalReplySimArr = []
                for inp in node.input_vatiations.all():
                    inp.sim = compareSentance(Statement(inp.txt),Statement(txt))
                    if inp.sim>0.9:
                        generalReplySimArr.append(inp)

                generalReplySimArr.sort(key=lambda x: x.sim, reverse=True)
                print "generalReplySimArr : " , generalReplySimArr
                if len(generalReplySimArr)>0:
                    print "Inside If , 297"
                    createMessage(ctx['uid'] , generalReplySimArr[0].response )
                    return True
                else:
                    print "Inside else , 301---------------------------------------"
                    defaultBlock = NodeBlock.objects.get(company = ctx['chatThread'].company , type = 'FAQ')

                    if NodeBlock.objects.get(pk = ctx['step_id']).parent.type != 'FAQ':
                        ctx['resume_id'] = str(ctx['step_id'])
                        saveContext('resume_id' , 'int' , ctx)




                    print 'setting the resume ID to the current step and updating the current step as FAQ flow'
                    ctx['step_id'] = str(defaultBlock.pk)
                    saveContext('step_id' , 'int' , ctx)
                    ctx['leadMagnetDefer'] +=1
                    saveContext('leadMagnetDefer' , 'int' , ctx)
                    return initialiseBlock( defaultBlock , ctx)
            NB = NodeBlock.objects.get(pk = int(ctx['step_id']))
            if NB.parent is not None and  NB.parent.type == 'FAQ':
                return

            return False
        if node.type == 'FAQ':
            nxt = node.connections.filter(callbackName = 'success')[0]
            createMessage(ctx['uid'] , node.auto_response )

            ctx['retryID'] = None
            ctx['retry'] = 0
            print 'setting  step to : ' , str(node.pk)
            ctx['step_id'] = nxt.to_id

            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)
            print "Sending to next node from the FAQ block"
            initialiseBlock(nxt.to , ctx)
            return ctx

        if node.inheritedFrom is not None:
            ctx['step_id'] = str(node.inheritedFrom.pk)
            saveContext('step_id' , 'int' , ctx)
            print "------------------ Need the parent to be completed first"
            renderedResponse = Template(node.inheritedFrom.nodeResponse).render(Context(ctx))
            createMessage(ctx['uid'] , renderedResponse )
            initialiseBlock(node.inheritedFrom , ctx)
            return ctx


        for ctx_req in node.context_requirement.all():
            print "Checking : " , ctx_req.name
            if ctx_req.unique:
                ctx.pop(ctx_req.context_key , None)
                removeContext(ctx_req.context_key , ctx)
                if ctx_req.verify:
                    ctx.pop(ctx_req.context_key + '_initiated', None)
                    removeContext( ctx_req.context_key + '_initiated', ctx)

        step_id = str(node.pk)
        saveContext('step_id' , 'int' , ctx)


        if node.blockType  == 'start' :
            connections = node.connections.all()
            # this is for start block only
            print "Initializing the intent , at the start"
            renderedResponse = Template(node.auto_response).render(Context(ctx))
            createMessage(ctx['uid'] , renderedResponse )

            ctx['step_id'] = str(connections[0].to_id)
            print connections[0].to_id , 'connections[0].to_id' , connections[0].to.name
            saveContext('step_id' , 'int' , ctx)
            return initialiseBlock(connections[0].to , ctx)


        if node.nodeResponse is not None:
            renderedResponse = Template(node.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            return createMessage(ctx['uid'] , renderedResponse )

        print "All requirements gathered"
        print " context before intializing the step", ctx
        print "BOT RESPONSE:", node.nodeResponse
        ctx['step_id'] = str(node.pk)
        saveContext('step_id' , 'int' , ctx)
        print "------------------ FAQ Block ended-"
        initialiseBlock(node , ctx)
        return ctx

    return ctx

def transferSession(ctx):

    cth = ctx['chatThread']
    cth.transferred = True
    cth.save()

    if cth.channel == 'FB' or cth.channel == 'whatsapp':
        sc = SupportChat(message = "Bot transferred session", uid = cth.uid, sentByAgent = False , is_hidden = True)
        sc.save()
        return

    requests.post(globalSettings.WAMP_POST_ENDPOINT,
        json={
          'topic': globalSettings.WAMP_PREFIX + 'service.support.checkHeartBeat.' + ctx['uid'] ,
          'args': [ "changeBotMode" , ctx['uid'] , True ]
        }
    )

def checkLeadMagnet(node , ctx, compProfile, respond):
    print "Will check the lead magnet"
    FAQBlock = NodeBlock.objects.get(company = compProfile , type = 'FAQ')
    if FAQBlock.externalProcessType == 'REST':
        print "Executing custom code"
        print FAQBlock.custom_process_code
        exec(FAQBlock.custom_process_code)
    elif FAQBlock.externalProcessType == 'RPA':
        pass

    ctx['leadMagnetSuccess'] = "1"
    saveContext('leadMagnetSuccess' , 'str' , ctx)
    if respond:
        createMessage(ctx['uid'] , node.response )
    initialiseBlock(node , ctx)

def getResponse(txt, ctx , compProfile , fil = None):
    print "File : " , fil
    if txt is not None:
        txt = txt[0].lower() + txt[1:]
    servce = compProfile
    if DEBUG:
        print ctx
    if (txt is None and fil is not None) or (txt is not None and len(txt) >= 2):
        print ctx["step_id"] , "step_id"

        if ctx["step_id"] == None:
            return answerFAQandGeneral(txt , ctx , compProfile)

        config = NodeBlock.objects.get(pk = str(ctx["step_id"]))
        if DEBUG:
            print "Will process block : " , config.name , config.rule , config.type
        # initialiseBlock(ctx["step_id"])
        step_id = ctx['step_id']
        # all the block processing related code here
        print ctx
        if config.blockType == 'getName':

            print "Processing name block ----------"
            persons = []
            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)
            if len(persons)>0:
                ctx[config.context_key] = persons[0]
                saveContext(config.context_key , 'str' , ctx)
            else:
                if len(txt.split(' '))<3:
                    ctx[config.context_key] = txt
                    saveContext(config.context_key , 'str' , ctx)
                else:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        return

                    createMessage(ctx['uid'] , config.failResponse  )

                    if config.retry == 0:
                        ctx['retryID'] = None
                        ctx['retry'] = 0
                        nxt = config.connections.filter(callbackName = 'failure')[0]

                        ctx["step_id"]= nxt.to_id
                        saveContext('retry' , 'int' , ctx)
                        saveContext('retryID' , 'int' , ctx)
                        saveContext('step_id' , 'int' , ctx)

                        initialiseBlock(nxt.to , ctx)
                        return ctx



                    ctx["step_id"]=step_id
                    ctx['retryID'] = step_id
                    ctx['retry'] += 1

                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    # initialiseBlock(config.parent , ctx)
                    return ctx

            renderedResponse = Template(config.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            # move to success
            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            nxt = config.connections.filter(callbackName = 'success')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx

        if config.blockType == 'getEmail':

            print "Processing name block ----------"

            if config.verify and config.context_key + '_otp' in ctx and ctx[config.context_key + '_otp'] != '':
                if ctx[config.context_key + '_otp'] == txt:

                    # ctx[config.context_key + '__verified'] = '1'
                    # saveContext(config.context_key + '__verified' , 'str' , ctx)

                    renderedResponse = Template(config.nodeResponse).render(Context(ctx))
                    createMessage(ctx['uid'] , renderedResponse )

                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'success')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx
                else:

                    ctx[config.context_key + '_otp']= ''
                    saveContext(config.context_key + '_otp' , 'str' , ctx)

                    createMessage(ctx['uid'] , 'We could not verify the OTP' )
                    initialiseBlock(config , ctx)
                    return ctx


            emails = email(txt)

            if len(emails)>0:
                ctx[config.context_key] = emails[0]
                saveContext(config.context_key , 'str' , ctx)

                if config.verify:
                    otp = generateOTP()
                    print "otp" , otp
                    if isSafe(config.pre_validation_code):
                        exec(config.pre_validation_code)
                    sendOTP(ctx[config.context_key] , otp)
                    createMessage(ctx['uid'] , 'We have sent an OTP to your mobile number. Please enter OTP to proceed' )

                    ctx[config.context_key + '_otp']= otp
                    saveContext(config.context_key + '_otp' , 'str' , ctx)

                    return ctx



            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx

            if config.verify:
                if not config.context_key + '_otp' in ctx :
                    otp = generateOTP()
                    print "otp" , otp
                    if isSafe(config.pre_validation_code):
                        exec(config.pre_validation_code)
                    sendOTP(ctx[config.context_key] , otp)
                    createMessage(ctx['uid'] , 'We have sent an OTP to your mobile number. Please enter OTP to proceed' )

                    ctx[config.context_key + '_otp']= otp
                    saveContext(config.context_key + '_otp' , 'str' , ctx)

                    return
                else:
                    if ctx[config.context_key + '_otp'] == txt:

                        # ctx[config.context_key + '__verified'] = '1'
                        # saveContext(config.context_key + '__verified' , 'str' , ctx)

                        renderedResponse = Template(config.nodeResponse).render(Context(ctx))
                        createMessage(ctx['uid'] , renderedResponse )

                        ctx['retryID'] = None
                        ctx['retry'] = 0
                        nxt = config.connections.filter(callbackName = 'success')[0]

                        ctx["step_id"]= nxt.to_id
                        saveContext('retry' , 'int' , ctx)
                        saveContext('retryID' , 'int' , ctx)
                        saveContext('step_id' , 'int' , ctx)

                        initialiseBlock(nxt.to , ctx)
                        return ctx
                    else:
                        createMessage(ctx['uid'] , 'We could not verify the OTP' )
                        initialiseBlock(config , ctx)
                        return ctx




            renderedResponse = Template(config.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            # move to success
            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            nxt = config.connections.filter(callbackName = 'success')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx

        if config.blockType == 'presentCatalog':
            print '\n\n\n\n\n', config.endpoint
            # get the catalog and send it to user UI
            matches = Category.objects.get(pk = config.endpoint).categoryInventory.filter(sku = txt)

            if matches.count()>0:
                nxt = config.connections.filter(callbackName = 'success').first()
                prod = matches[0]
                try:
                    imgUrl = prod.img1.url
                except:
                    imgUrl = '/static/images/icon.png'
                if  prod.description:
                    description = prod.description
                else:
                    description = 'No description'

                prodDetailsDiv = '<div class="scrollView"><br> <span class="prodHeading"> Here are some more details about the product you selected </span> <br> <div class="prodView" onclick="openProductView(\''+ prod.sku +'\')"><img src="'+ imgUrl +'"><br><span class="prodHeading">'+ prod.name +'</span><br><span class="prodSubHeading">'+ description  +'</span><br><span class="prodSubHeading">MRP : '+ str(prod.rate) +'</span></div></div>'

                createMessage(ctx['uid'] , prodDetailsDiv )
                ctx[config.context_key] = txt
                saveContext(config.context_key  , 'str' , ctx)
            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                if ctx['retryID'] == step_id and  ctx['retry'] == config.retry:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0


            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)


            return ctx




        if config.blockType == 'getEmail':

            if config.verify and config.context_key + '_otp' in ctx and ctx[config.context_key + '_otp'] != '':
                if ctx[config.context_key + '_otp'] == txt:

                    # ctx[config.context_key + '__verified'] = '1'
                    # saveContext(config.context_key + '__verified' , 'str' , ctx)

                    renderedResponse = Template(config.nodeResponse).render(Context(ctx))
                    createMessage(ctx['uid'] , renderedResponse )

                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'success')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx
                else:
                    ctx[config.context_key + '_otp']= ''
                    saveContext(config.context_key + '_otp' , 'str' , ctx)

                    createMessage(ctx['uid'] , 'We could not verify the OTP' )
                    initialiseBlock(config , ctx)
                    return ctx





            print "Processing name block ----------"
            mobiles = getMobile(txt)

            if len(mobiles)>0:
                ctx[config.context_key] = mobiles[0]
                saveContext(config.context_key , 'str' , ctx)

                if config.verify:
                    otp = generateOTP()
                    print "otp" , otp
                    if isSafe(config.pre_validation_code):
                        exec(config.pre_validation_code)
                    sendOTP(ctx[config.context_key] , otp)
                    createMessage(ctx['uid'] , 'We have sent an OTP to your mobile number. Please enter OTP to proceed' )

                    ctx[config.context_key + '_otp']= otp
                    saveContext(config.context_key + '_otp' , 'str' , ctx)

                    return ctx





            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx


            # validation related code


            renderedResponse = Template(config.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            # move to success
            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            nxt = config.connections.filter(callbackName = 'success')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx

        if config.blockType == 'askForPermission':
            print "checking permission block result"

            nsvList = list(NodeBlockInputVariation.objects.filter(parent = config))

            nsvListCompared = []
            for nsv in nsvList:
                nsv.sim = compareSentance(Statement(nsv.txt),Statement(txt))
                print "checking for : " , nsv.txt , nsv.sim
                if nsv.sim>0.8:
                    nsvListCompared.append(nsv)

            nsvListCompared.sort(key=lambda x: x.sim, reverse=True)

            print "nsvListCompared : " , nsvListCompared
            for toPrint in nsvListCompared:
                print toPrint.txt , toPrint.sim

            if len(nsvListCompared)>0:
                print "confirmed ------------"
                nxt = config.connections.filter(callbackName = 'Confirmed')[0]



            nsvList = list(StartoverVariations.objects.filter(parent = config))
            print nsvList
            nsvListCompared = []
            for nsv in nsvList:
                nsv.sim = compareSentance(Statement(nsv.txt),Statement(txt))
                print "checking for : " , nsv.txt , nsv.sim
                if nsv.sim>0.8:
                    nsvListCompared.append(nsv)

            nsvListCompared.sort(key=lambda x: x.sim, reverse=True)

            print "nsvListCompared : " , nsvListCompared
            for toPrint in nsvListCompared:
                print toPrint.txt , toPrint.sim

            if len(nsvListCompared)>0:
                print "Start over ------------------"
                nxt = config.connections.filter(callbackName = 'Edit Details')[0]

            nsvList = list(ActionIntentInputVariation.objects.filter(parent = config))
            print nsvList
            nsvListCompared = []
            for nsv in nsvList:
                nsv.sim = compareSentance(Statement(nsv.txt),Statement(txt))
                print "checking for : " , nsv.txt , nsv.sim
                if nsv.sim>0.8:
                    nsvListCompared.append(nsv)

            nsvListCompared.sort(key=lambda x: x.sim, reverse=True)

            print "nsvListCompared : " , nsvListCompared
            for toPrint in nsvListCompared:
                print toPrint.txt , toPrint.sim

            if len(nsvListCompared)>0:
                print "Do not proceed ------------------"


                nxt = config.connections.filter(callbackName = 'Denied')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx


        if config.blockType == 'getInput':

            print "Processing name block ---------- getInput"
            if isSafe(config.custom_process_code):
                exec(config.custom_process_code)
            nlpResult = parseLine(txt)
            # nlpResult = None
            data  = extract(txt , nlpResult)

            if data is not None:
                ctx[config.context_key] = data
                saveContext(config.context_key , 'str' , ctx)
            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx

            renderedResponse = Template(config.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            # move to success
            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            nxt = config.connections.filter(callbackName = 'success')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx

        if config.blockType == 'getFile':


            if fil != None:
                ctx[config.context_key] = fil
                print "----------------------\n\n\n--------------------------------"
                print fil.__class__ , "saving file : " , fil
                print "----------------------\n\n\n--------------------------------"
                saveContext(config.context_key , 'file' , ctx)
            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                if ctx['retryID'] == step_id and  ctx['retry'] == config.retry:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx

            renderedResponse = Template(config.nodeResponse).render(Context(ctx))
            print "BOT response After Extract: ", renderedResponse
            # move to success
            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            nxt = config.connections.filter(callbackName = 'success')[0]

            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx

        if config.blockType == 'giveChoices':

            # check which is the closest match
            match = True


            choiceSimMatrix = []
            for inp in config.connections.all():
                inp.sim = compareSentance(Statement(inp.condition),Statement(txt))
                if inp.sim>0.9:
                    choiceSimMatrix.append(inp)

            choiceSimMatrix.sort(key=lambda x: x.sim, reverse=True)

            if len(choiceSimMatrix)>0:
                nxt = choiceSimMatrix[0]
                ctx[config.context_key] = txt
                saveContext(config.context_key  , 'str' , ctx)
            else:
                if answerFAQandGeneral(txt , ctx , compProfile):
                    return

                if ctx['retryID'] == step_id and  ctx['retry'] == config.retry:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                if config.retry == 0:
                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    nxt = config.connections.filter(callbackName = 'failure')[0]

                    ctx["step_id"]= nxt.to_id
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)

                    initialiseBlock(nxt.to , ctx)
                    return ctx

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1

                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                # initialiseBlock(config.parent , ctx)
                return ctx

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0


            ctx["step_id"]= nxt.to_id
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(nxt.to , ctx)
            return ctx


        answerFAQandGeneral(txt , ctx , compProfile)



        # ctx["step_id"]=config['id']
    return ctx
