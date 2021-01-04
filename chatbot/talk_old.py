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
from support.uipathHelper import uiPathToken , ReleasekeyGet


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

def initialiseBlock(node , cntx):
    print "Init  ; Block" , node.pk , node.leadMagnetDefer ,  cntx['leadMagnetDefer']>= node.leadMagnetDefer, cntx['leadMagnetDefer']
    if node.type == 'FAQ' and node.leadMagnet and cntx['leadMagnetDefer']>= node.leadMagnetDefer:
        magnetSuccess = True
        for ctx_req in node.context_requirement.all():
            print "Context requiremtn : " , ctx_req.name , ctx_req.enabled
            if ctx_req.context_key not in cntx and ctx_req.enabled:
                cntx['step_id'] = str(ctx_req.pk)
                saveContext('step_id' , 'int' , cntx)
                cntx['leadMagnetStarted'] = "1"
                saveContext('leadMagnetStarted' , 'int' , cntx)
                magnetSuccess = False
                return initialiseBlock(ctx_req , cntx)
        print "magnetSuccess : " , magnetSuccess , cntx['leadMagnetSuccess']
        if magnetSuccess and cntx['leadMagnetSuccess'] == "0":
            return checkLeadMagnet(node , cntx , node.company, "leadMagnetStarted" in cntx and cntx['leadMagnetStarted'] == 1)
        elif cntx['leadMagnetSuccess'] == "1":
            createMessage(cntx['uid'] , node.auto_response )
            return cntx
    if node.type not in ['FAQ', 'general' ] and node.context_requirement.all().count() >0 :
        for ctx_req in node.context_requirement.all():
            if ctx_req.context_key not in cntx:
                cntx['step_id'] = str(ctx_req.pk)
                saveContext('step_id' , 'int' , cntx)
                if DEBUG:
                    print "not present , go to block 56 " , cntx['step_id']
                return initialiseBlock(ctx_req , cntx)
    print " node.parent : " ,  node.parent is not None
    print "node.needConfirmation , " , node.needConfirmation
    print node.externalProcessType == 'RESPONSE'
    responded = False
    if node.needConfirmation or node.parent is not None :
        renderedMessage = Template(node.auto_response).render(Context(cntx))
        print "AUTORESPONSE while initializing : auto response", renderedMessage# rendered response
        responded = True
        createMessage(cntx['uid'] , renderedMessage  )
    if node.externalProcessType == 'RESPONSE':
        renderedMessage = Template(node.nodeResponse).render(Context(cntx))
        print "AUTORESPONSE while initializing :", renderedMessage# rendered response
        createMessage(cntx['uid'] , renderedMessage  )
        responded = True

    print "at the end of the initialize block : ", cntx
    if node.externalProcessType == 'REST' and node.parent is None and not responded:
        print node.name , node.type
        if node.type == 'FAQ':
            if cntx['leadMagnetDefer']>= node.leadMagnetDefer:
                executeExternalRestCall(node , cntx)
        else:
            executeExternalRestCall(node , cntx)
        if node.type == 'FAQ':
            return
        defaultBlock = NodeBlock.objects.get(company = cntx['chatThread'].company , type = 'FAQ')
        cntx['step_id'] = str(defaultBlock.pk)
        saveContext('step_id' , 'int' , cntx)
        return initialiseBlock( defaultBlock , cntx)
    if node.parent is not None and node.parent.type == 'FAQ':
        return True


    if not responded and node.nodeResponse is not None:
        renderedMessage = Template(node.nodeResponse).render(Context(cntx))
        print "AUTORESPONSE while initializing at the end:", renderedMessage# rendered response
        createMessage(cntx['uid'] , renderedMessage  )

    return cntx

def executeExternalRPACall(config , ctx):

    custProfile = config.company
    value = uiPathToken(custProfile.uipathUsername, custProfile.uipathPass, custProfile.uipathTenent, custProfile.uipathUrl)

    robotIDs = [json.loads(config.uipathRobot)['Id']]


    releaseKey = ReleasekeyGet(value , config.uipathProcess + "_" + config.uipathEnvironment , custProfile.uipathTenent )
    print "releaseKey" , releaseKey
    Strategy="Specific"
    NoOfRobots= 0
    Source="Manual"
    PARAMS = {"startInfo":{"ReleaseKey":releaseKey,"Strategy":Strategy,"RobotIds":robotIDs,"NoOfRobots":NoOfRobots,"Source":Source}}
    print "request.data  : ", PARAMS

    PARAMS['startInfo']['InputArguments']= "{\"requestID\":\"%s\"}"%(ctx['uid'])

    print(PARAMS)
    s = requests.post(url = custProfile.uipathUrl + "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs",json=PARAMS,headers = {"Authorization" : "Bearer " + value , "X-UIPATH-TenantName":  custProfile.uipathTenent } )
    print s.json()
    if s.status_code>250:
        return False , "Opps.. I got an error while processing this"


    return True , "Please wait a moment while we process your request"

def executeExternalRestCall(config , ctx):
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
    servce = compProfile.service

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
                    createMessage(ctx['uid'] , generalReplySimArr[0].response )
                    defaultBlock = NodeBlock.objects.get(company = ctx['chatThread'].company , type = 'FAQ')
                    ctx['step_id'] = str(defaultBlock.pk)
                    saveContext('step_id' , 'int' , ctx)
                    ctx['leadMagnetDefer'] +=1
                    saveContext('leadMagnetDefer' , 'int' , ctx)
                    return initialiseBlock( defaultBlock , ctx)
            NB = NodeBlock.objects.get(pk = int(ctx['step_id']))
            if NB.parent is not None and  NB.parent.type == 'FAQ':
                return

            if compProfile.botFailResponse is not None:
                createMessage(ctx['uid'] ,compProfile.botFailResponse )
            else:
                createMessage(ctx['uid'] ,"Sorry I am not trained to answer this yet" )
            if compProfile.botAuto_response is not None:
                createMessage(ctx['uid'] ,compProfile.botAuto_response )
            return False
        if node.type == 'FAQ':
            createMessage(ctx['uid'] , "Okay , hang on.." )
            return transferSession(ctx)

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



        if node.context_requirement.all().count() >0 :
            if node.externalProcessType != 'RESPONSE':
                renderedResponse = Template(node.nodeResponse).render(Context(ctx))
                print "BOT response After Extract:  while transfering for the first time", renderedResponse
                createMessage(ctx['uid'] , renderedResponse )

            for ctx_req in node.context_requirement.all():
                if DEBUG:
                    print "ctx_req : " , ctx_req.context_key
                if ctx_req.context_key not in ctx:
                    ctx['step_id'] = str(ctx_req.pk)
                    saveContext('step_id' , 'int' , ctx)
                    if DEBUG:
                        print "not present , go to block 270" , ctx['step_id']

                    return initialiseBlock(ctx_req , ctx)
                if DEBUG:
                    print "Key present : " , ctx_req.context_key
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
    servce = compProfile.service
    if DEBUG:
        print ctx
    if (txt is None and fil is not None) or (txt is not None and len(txt) >= 2):
        config = NodeBlock.objects.get(pk = str(ctx["step_id"]))
        if DEBUG:
            print "Will process block : " , config.name , config.rule , config.type
        # initialiseBlock(ctx["step_id"])
        if 'process|extract|external' == config.rule:
            print "Processing : " , config.name
            if config.context_requirement.all().count() >0 :
                for ctx_req in config.context_requirement.all():
                    if DEBUG:
                        print "ctx_req : " , ctx_req.context_key
                    if ctx_req.context_key not in ctx:
                        ctx['step_id'] = str(ctx_req.pk)
                        saveContext('step_id' , 'int' , ctx)
                        if DEBUG:
                            print "not present , go to block 347" , ctx['step_id']
                        return initialiseBlock(ctx_req , ctx)
                    if DEBUG:
                        print "Key present : " , ctx_req.context_key

            # if not config.needConfirmation:
            #     defaultBlock = NodeBlock.objects.get(company = ctx['chatThread'].company , type = 'FAQ')
            #     ctx['step_id'] = str(defaultBlock.pk)
            #     saveContext('step_id' , 'int' , ctx)
            #     return initialiseBlock( defaultBlock , ctx)
            # else:
            #


            afirmSimArr = []
            for negativeAfirm in config.startover_vatiations.all():
                negativeAfirm.sim = compareSentance(Statement( txt),Statement(negativeAfirm.txt))
                if negativeAfirm.sim>0.8:
                    afirmSimArr.append(negativeAfirm)

            for positiveAffirm in config.input_vatiations.all():
                positiveAffirm.sim = compareSentance(Statement( txt),Statement(positiveAffirm.txt))
                if positiveAffirm.sim>0.8:
                    afirmSimArr.append(positiveAffirm)

            afirmSimArr.sort(key=lambda x: x.sim, reverse=True)

            for asa in afirmSimArr:
                print "sim arr : ", asa.txt , asa.sim

            if len(afirmSimArr)>0:
                res = afirmSimArr[0]

                print str(res.__class__) , res.sim
                if 'StartoverVariations' in str(res.__class__):
                    print "Denied : starting over"

                    for ctx_req in config.context_requirement.all():
                        if ctx_req.unique:
                            ctx.pop(ctx_req.context_key, None)
                            removeContext( ctx_req.context_key , ctx)
                            if ctx_req.verify:
                                ctx.pop(ctx_req.context_key + '_initiated', None)
                                removeContext( ctx_req.context_key + '_initiated', ctx)

                    ctx['step_id'] = config.pk
                    saveContext('step_id' , 'int' , ctx)
                    return initialiseBlock(config , ctx)
                else:
                    if config.externalProcessType == 'REST':
                        status , response = executeExternalRestCall(config, ctx)
                    elif config.externalProcessType == 'RPA':
                        status , response = executeExternalRPACall(config , ctx)
                        if status:
                            createMessage(ctx['uid'] , "Thanks , please wait while I process your request" )
                    if status:
                        if DEBUG:
                            print "successfully executed the response"
                        defaultBlock = NodeBlock.objects.filter(company = ctx['chatThread'].company , type = 'FAQ')[0]
                        ctx['step_id'] = str(defaultBlock.pk)
                        for ctx_req in config.context_requirement.all():
                            if ctx_req.unique:
                                ctx.pop(ctx_req.context_key, None)
                                removeContext( ctx_req.context_key , ctx)
                                if ctx_req.verify:
                                    ctx.pop(ctx_req.context_key + '_initiated', None)
                                    removeContext( ctx_req.context_key + '_initiated', ctx)
                        saveContext('step_id' , 'int' , ctx)
                        return initialiseBlock( defaultBlock , ctx)
                    return ctx

                # execute externalProcessDetails process
            return answerFAQandGeneral(txt , ctx , compProfile)
            # return createMessage(ctx['uid'] , config.failResponse )

        if config.rule == 'process|extract|rawText':

            ctx[config.context_key] = txt
            saveContext(config.context_key , 'str' , ctx)

            if config.nodeResponse != None and len(config.nodeResponse)>0:
                renderedResponse = Template(config.nodeResponse).render(Context(ctx))
                print "BOT response After Extract: " ,

                createMessage(ctx['uid'] , renderedResponse )

                print "-------------------"

            step_id = config.parent.pk
            ctx["step_id"]=step_id
            saveContext('step_id' , 'int' , ctx)
            initialiseBlock(config.parent , ctx)
            return ctx


        if config.rule == 'process|extract|name':
            # print ctx

            print "Processing name block ----------"

            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)
            if len(persons)>0:
                ctx[config.context_key] = persons[0]
                saveContext(config.context_key , 'str' , ctx)
            else:
                if len(txt.split(' '))<3:
                    ctx[config.context_key] = txt
                    saveContext(config.context_key , 'str' , ctx)
                else:
                    ctx , success = checkForSiblings(txt , ctx , config)
                    step_id = config.pk


                    if not success:
                        if answerFAQandGeneral(txt , ctx , compProfile):
                            return

                    if ctx['retryID'] == step_id and  ctx['retry']>1:
                        createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                        return transferSession(ctx)

                    createMessage(ctx['uid'] , config.failResponse  )

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

            createMessage(ctx['uid'] , renderedResponse )

            print "-------------------"

            ctx['retryID'] = None
            ctx['retry'] = 0
            step_id = str(config.parent.pk)
            ctx["step_id"]=step_id

            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            initialiseBlock(config.parent , ctx)
            return ctx

        if config.rule == 'process|extract|date':
            # print ctx
            # extract date , and check other conditions as well
            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)
            if len(dates)>0:
                ctx[config.context_key] = dates[0][1].strftime("%m-%d-%Y")
                saveContext(config.context_key , 'str' , ctx)
                print "BOT response : " , config.nodeResponse
                createMessage(ctx['uid'] , config.nodeResponse )
                print "-------------------"
            else:
                step_id = config.pk
                prevCtx = ctx
                ctx , success = checkForSiblings(txt , ctx, config)
                print " in date failure"

                # check for FAQ question or general reply block and see if can be answered
                if not success:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        print "retrning as I got the answer from FAQ and general block"
                        return

                print "Checking for retry attempts" , ctx['retryID'] == step_id , ctx['retry']>1
                if ctx['retryID'] == step_id and  ctx['retry']>1:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                ctx["step_id"]= step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1
                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                return ctx

            step_id = str(config.parent.pk)
            ctx["step_id"]=step_id
            saveContext('step_id' , 'int' , ctx)
            ctx['retryID'] = None
            ctx['retry'] = 0
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            print "Inside date extractor"
            initialiseBlock(config.parent , ctx)
            return ctx

        if config.rule == 'process|extract|mobile':

            if config.verify and config.context_key + '_initiated' in ctx and ctx[config.context_key + '_initiated'] == 1:
                exec(config.validation_code)
                if validate(txt , ctx):
                    step_id = str(config.parent.pk)
                    ctx["step_id"]=step_id
                    initialiseBlock(config.parent , ctx)

                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)
                    return ctx
                else:
                    ctx["step_id"]= config.pk
                    ctx['retryID'] = config.pk
                    ctx['retry'] += 1
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)
                    return ctx

            if DEBUG:
                print "Processing mobile number"
                print "Got : " , getMobile(txt)
            # extract date , and check other conditions as well
            mobiles = getMobile(txt)
            if  len(mobiles) == 0:
                ctx, success = checkForSiblings(txt , ctx, config)
                step_id = config.pk

                if not success:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        return


                if ctx['retryID'] == step_id and  ctx['retry']>1:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                print "BOT Response : " , config.failResponse
                createMessage(ctx['uid'] , config.failResponse )
                print "-------------------"

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1
                saveContext('retry' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)

                return ctx

            ctx[config.context_key] = mobiles[0]
            saveContext(config.context_key , 'str' , ctx)
            print "BOT response : " , config.nodeResponse
            createMessage(ctx['uid'] , config.nodeResponse )
            print "-------------------"

            if config.verify:
                exec(config.pre_validation_code)
                if initiate(ctx):
                    ctx[config.context_key + '_initiated'] = 1
                    saveContext(config.context_key + '_initiated' , 'int' , ctx)
                    return ctx
                else:
                    createMessage(ctx['uid'] , "I am unable to send you the OTP, please try again later. Thank you" )
                    return ctx


            step_id = str(config.parent.pk)
            ctx["step_id"]=step_id
            initialiseBlock(config.parent , ctx)

            ctx['retryID'] = None
            ctx['retry'] = 0
            saveContext('retry' , 'int' , ctx)
            saveContext('retryID' , 'int' , ctx)
            saveContext('step_id' , 'int' , ctx)

            return ctx

        if config.rule == 'process|extract|email':
            # print ctx
            # extract date , and check other conditions as well

            if config.verify and config.context_key + '_initiated' in ctx and ctx[config.context_key + '_initiated'] == 1:
                exec(config.validation_code)
                if validate(txt , ctx):
                    step_id = str(config.parent.pk)
                    ctx["step_id"]=step_id
                    initialiseBlock(config.parent , ctx)

                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)
                    return ctx
                else:
                    ctx["step_id"]= config.pk
                    ctx['retryID'] = config.pk
                    ctx['retry'] += 1
                    saveContext('retry' , 'int' , ctx)
                    saveContext('retryID' , 'int' , ctx)
                    saveContext('step_id' , 'int' , ctx)
                    return ctx


            emails = email(txt)
            step_id = None

            if len(emails)>0:
                ctx[config.context_key] = emails[0]
                saveContext(config.context_key , 'str' , ctx)
                print "BOT response : " , config.nodeResponse
                createMessage(ctx['uid'] , config.nodeResponse )
                print "-------------------"

            else:
                step_id = config.pk
                print "BOT Response : " , "Sorry I did not understand"
                print "-------------------"
                ctx , success = checkForSiblings(txt , ctx, config)

                if not success:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        return

                if ctx['retryID'] == step_id and  ctx['retry']>1:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1
                saveContext('retry' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                return ctx



            if config.verify:
                exec(config.pre_validation_code)
                if initiate(ctx):
                    ctx[config.context_key + '_initiated'] = 1
                    saveContext(config.context_key + '_initiated' , 'int' , ctx)
                    return ctx
                else:
                    createMessage(ctx['uid'] , "I am unable to send you the OTP, please try again later. Thank you" )
                    return ctx

            step_id = config.parent.pk
            ctx["step_id"]=step_id
            saveContext('step_id' , 'int' , ctx)
            initialiseBlock(config.parent , ctx)
            return ctx

        if config.rule == 'process|extract|custom':
            # print ctx
            # extract date , and check other conditions as well
            exec(config.custom_process_code)
            nlpResult = parseLine(txt)
            data  = extract(txt , nlpResult)

            step_id = None

            if data is not None:
                ctx[config.context_key] = data
                saveContext(config.context_key , 'str' , ctx)
                print "BOT response : " , config.nodeResponse
                createMessage(ctx['uid'] , config.nodeResponse )
                print "-------------------"

            else:
                step_id = config.pk
                print "BOT Response : " , "Sorry I did not understand"
                print "-------------------"
                ctx , success = checkForSiblings(txt , ctx, config)

                if not success:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        return

                if ctx['retryID'] == step_id and  ctx['retry']>1:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1
                saveContext('retry' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                return ctx


            step_id = config.parent.pk
            ctx["step_id"]=step_id
            saveContext('step_id' , 'int' , ctx)
            initialiseBlock(config.parent , ctx)
            return ctx

        if config.rule == 'process|extract|file':
            if file != None:
                ctx[config.context_key] = fil
                saveContext(config.context_key , 'str' , ctx)
                print "BOT response : " , config.nodeResponse
                createMessage(ctx['uid'] , config.nodeResponse )
            else:
                step_id = config.pk
                print "BOT Response : " , "No file recieved"
                print "-------------------"
                ctx , success = checkForSiblings(txt , ctx, config)

                if not success:
                    if answerFAQandGeneral(txt , ctx , compProfile):
                        return

                if ctx['retryID'] == step_id and  ctx['retry']>1:
                    createMessage(ctx['uid'] , "Please wait while I get my human assistant" )
                    return transferSession(ctx)

                createMessage(ctx['uid'] , config.failResponse  )

                ctx["step_id"]=step_id
                ctx['retryID'] = step_id
                ctx['retry'] += 1
                saveContext('retry' , 'int' , ctx)
                saveContext('step_id' , 'int' , ctx)
                saveContext('retryID' , 'int' , ctx)
                return ctx

            step_id = config.parent.pk
            ctx["step_id"]=step_id
            saveContext('step_id' , 'int' , ctx)
            initialiseBlock(config.parent , ctx)
            return ctx

        answerFAQandGeneral(txt , ctx , compProfile)



        # ctx["step_id"]=config['id']
    return ctx
