import django
import json
from helper import *
from nlpEngine import parseLine
from django.template import Context
from django.template import Template
from django.conf import settings
# optional if you just render str instead of template file
from django.template.loader import get_template
import sys

settings.configure(TEMPLATES=[{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    # if you want to render using template file
    'DIRS': ['/tmp/template_dirs']
}])
django.setup()

print sys.argv
DEBUG = len(sys.argv)> 1



from os import listdir
from os.path import isfile, join

onlyfiles = [f for f in listdir('configurations') if isfile(join('configurations', f))]
print onlyfiles

configs = []
for f in onlyfiles:
    configFile = open(os.path.join('configurations' , f), 'r')
    if f == 'faq.json':
        continue
    for config in json.loads(configFile.read()):
        configs.append(config)

context = {"step_id": 9 , "retry" : 0 , "retryID" : None}
def getMatch(config, inp):
    c1 = compareSentance(Statement(config["input"]),Statement(inp))
    # if DEBUG:
    #     print c1
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

def initialiseBlock(id , cntx):
    for config in configs:
        if config["id"] == id:
            if len(config['context_requirement']) >0 :
                for ctx_req in config['context_requirement']:
                    if ctx_req['key'] not in cntx:
                        cntx['step_id'] = ctx_req['retrieveStage']
                        if DEBUG:
                            print "not present , go to block " , cntx['step_id']
                        return initialiseBlock(cntx['step_id'] , cntx)

            print "AUTORESPONSE while initializing :", Template(config['auto_response']).render(Context(cntx)) # rendered response

            return cntx

def executeExternalRPACall(config):
    return True , "Thank you for your business."

def executeExternalRestCall(config):
    return True , "Thank you for your order."

def checkForSiblings(txt , ctx):
    if DEBUG:
        print ctx["step_id"]
    for config in configs:
        if config["id"] == ctx["step_id"]:
            for sibID in config['siblings']:
                for config2 in configs:
                    if config2["id"] == sibID:
                        # we just have to extract
                        if config2['rule'] == "process|extract|email":
                            ctx[config2['context_key']] = email(txt)
                            break
            return ctx


def getResponse(txt, ctx):
    print "INPUT:", txt
    if DEBUG:
        print ctx
    if len(txt) >= 2:
        for config in configs:
            if config["id"] == ctx["step_id"]:
                if DEBUG:
                    print "Will process block : " , config
                # initialiseBlock(ctx["step_id"])
                if 'process|extract|external' == config['rule']:
                    if len(config['context_requirement']) >0 :
                        for ctx_req in config['context_requirement']:
                            if DEBUG:
                                print "ctx_req : " , ctx_req['key']
                            if ctx_req['key'] not in ctx:
                                ctx['step_id'] = ctx_req['retrieveStage']
                                if DEBUG:
                                    print "not present , go to block " , ctx['step_id']
                                return initialiseBlock(ctx['step_id'] , ctx)
                            if DEBUG:
                                print "Key present : " , ctx_req['key']

                    # execute externalProcessDetails process

                    for negativeAfirmText in config['startover_variation']:
                        if compareSentance(Statement( txt),Statement(negativeAfirmText)) > 0.8:
                            # delete all keys unique = True and reinitialize the block
                            if DEBUG:
                                print "Denied : starting over"

                            for ctx_req in config['context_requirement']:
                                if ctx_req['unique']:
                                    ctx.pop(ctx_req['key'], None)
                            ctx['step_id'] = config['id']
                            return initialiseBlock(ctx['step_id'] , ctx)

                    if config['externalProcessDetails']['type'] == 'REST':
                        status , response = executeExternalRPACall(config)
                    elif config['externalProcessDetails']['type'] == 'RPA':
                        status , response = executeExternalRestCall(config)

                    print "AUTORESPONSE", response
                    print "-------------------" , status

                    if status:
                        if DEBUG:
                            print "successfully executed the response"
                        ctx['step_id'] = config['successNext']
                        return initialiseBlock(ctx['step_id'] , ctx)
                    return ctx

                if config['rule'] == 'process|extract|rawText':

                    ctx[config['context_key']] = txt

                    if config['response'] != None and len(config['response'])>0:
                        print "BOT response After Extract: " , Template(config['response']).render(Context(ctx))
                        print "-------------------"

                    step_id = config['successNext']
                    ctx["step_id"]=step_id
                    initialiseBlock(step_id , ctx)
                    return ctx


                if config['rule'] == 'process|extract|name':
                    # print ctx
                    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)
                    if len(persons)>0:
                        ctx[config['context_key']] = persons[0]
                    else:
                        if len(txt.split(' '))<3:
                            ctx[config['context_key']] = txt
                        else:
                            if config['failNext'] == None:
                                step_id = config['successNext']
                            else:
                                step_id = config['failNext']
                            if ctx['retryID'] == step_id and  ctx['retry']>1:
                                print "Failure : Transfering to human agent"
                                a = b

                            ctx = checkForSiblings(txt , ctx)
                            ctx["step_id"]=step_id
                            ctx['retryID'] = step_id
                            ctx['retry'] += 1


                            initialiseBlock(step_id , ctx)
                            return ctx

                    print "BOT response After Extract: " , Template(config['response']).render(Context(ctx))
                    print "-------------------"

                    ctx['retryID'] = None
                    ctx['retry'] = 0
                    step_id = config['successNext']
                    ctx["step_id"]=step_id
                    initialiseBlock(step_id , ctx)
                    return ctx

                if config['rule'] == 'process|extract|date':
                    # print ctx
                    # extract date , and check other conditions as well
                    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(txt)
                    if len(dates)>0:
                        ctx[config['context_key']] = dates[0][1]
                    else:
                        ctx[config['context_key']] = txt

                    print "BOT response : " , config['response']
                    print "-------------------"


                    step_id = config['successNext']
                    ctx["step_id"]=step_id
                    initialiseBlock(step_id , ctx)
                    return ctx

                if config['rule'] == 'process|extract|mobile':
                    if DEBUG:
                        print "Processing mobile number"
                        print "Got : " , getMobile(txt)
                    # extract date , and check other conditions as well
                    mobiles = getMobile(txt)
                    if  len(mobiles) != 1 or len(mobiles) == 0:


                        print "BOT Response : " , "Sorry I did not understand"
                        print "-------------------"

                        if config['failNext'] == None:
                            step_id = config['successNext']
                        else:
                            step_id = config['failNext']
                        if ctx['retryID'] == step_id and  ctx['retry']>1:
                            print "Failure : Transfering to human agent"
                            a = b

                        ctx = checkForSiblings(txt , ctx)
                        ctx["step_id"]=step_id
                        ctx['retryID'] = step_id
                        ctx['retry'] += 1


                        initialiseBlock(step_id , ctx)
                        return ctx

                    if DEBUG:
                        print "ctx : " , ctx
                    ctx[config['context_key']] = mobiles[0]
                    print "BOT response : " , config['response']
                    print "-------------------"


                    step_id = config['successNext']
                    ctx["step_id"]=step_id
                    initialiseBlock(step_id , ctx)

                    ctx['retryID'] = None
                    ctx['retry'] = 0

                    return ctx

                if config['rule'] == 'process|extract|email':
                    # print ctx
                    # extract date , and check other conditions as well
                    emails = email(txt)

                    if  len(emails) != 1 or len(emails) == 0:


                        print "BOT Response : " , "Sorry I did not understand"
                        print "-------------------"

                        if config['failNext'] == None:
                            step_id = config['successNext']
                        else:
                            step_id = config['failNext']

                        print "current context : " , ctx
                        if ctx['retryID'] == step_id and  ctx['retry']>1:
                            print "Failure : Transfering to human agent"
                            a = b

                        ctx = checkForSiblings(txt , ctx)
                        print "after checking sibling context : " , ctx
                        ctx["step_id"]=step_id
                        ctx['retryID'] = step_id
                        ctx['retry'] += 1


                        initialiseBlock(step_id , ctx)
                        return ctx

                    if DEBUG:
                        print "ctx : " , ctx

                    ctx[config['context_key']] = emails[0]
                    print "BOT response : " , config['response']
                    print "-------------------"


                    step_id = config['successNext']
                    ctx["step_id"]=step_id
                    initialiseBlock(step_id , ctx)
                    return ctx


                if config["type"] == 'FAQ':
                    matchedtemp = False
                    for configFaq in FAQFileconfigs:
                        if getMatch(configFaq, txt):
                            matchedtemp = True
                            if configFaq['response'] == "":
                                print "Please look at this page for more details", configFaq['url']
                                print "-------------------"
                            else:
                                print "BOT RESPONSE:", configFaq['response']
                                print "-------------------"
                    if not matchedtemp:
                        for conf in configs:
                            if conf["node"] == True:
                                for nodeVar in conf["nodeVariations"]:
                                    c1 = compareSentance(Statement( txt),Statement(nodeVar))
                                    print "confidence : " , c1
                                    if c1>0.65:

                                        for ctx_req in conf['context_requirement']:
                                            if ctx_req['unique']:
                                                ctx.pop(ctx_req['key'], None)

                                        step_id = conf["id"]
                                        print "BOT RESPONSE:", conf["nodeResponse"]
                                        print "-------------------"
                                        initialiseBlock(step_id , ctx)
                                        return ctx

                        print "BOT RESPONSE: Sorry I did not get it. Please call us on 9876543210"
                        print "-------------------"

                    return ctx



        # ctx["step_id"]=config['id']
    return ctx



if __name__ == '__main__':

    # context = getResponse("Can I connect power cord extension to the UPS?", context)
    # context = getResponse("what are the computers and laptops you have?", context)
    context = getResponse("Hi Can you help me to book a appointment ", context)
    context = getResponse("Do it for next monday 3PM", context)
    context = getResponse("Why you need this", context)
    context = getResponse("okay fine you win", context)
    context = getResponse("My name is Tina Gupta", context)
    context = getResponse("9876543210 and +913243456789", context)
    context = getResponse("Yes , go ahead", context)
    context = getResponse("9876543210", context)
    context = getResponse("Sure , go ahead", context)
    context = getResponse("Sure , go ahead", context)
    context = getResponse("Sure , go ahead", context)
    context = getResponse("Sure , go ahead", context)
    context = getResponse("Sure , go ahead", context)
    # context = getResponse("Do you work on sundays?", context)
    # context = getResponse("where is your office located?", context)
    # context = getResponse("Do you deliver products outside India?", context)
    # context = getResponse("I want computer accessories", context)
    # context = getResponse("I am looking for a wiFi router", context)
    # context = getResponse("tell me the details of solar hybrid power plants", context)
    # context = getResponse("what are the printers and scanners you have?", context)



    # context = getResponse("What is your working hours?", context)
    # context = getResponse("can you help me with my complaint", context)
    # context = getResponse("I bought a brand new toaster yesterday and today it is not working", context)
    # context = getResponse("My name is Tina Gupta", context)
    # context = getResponse("pradeep@gmail.com or abc@gmail.com", context)
    # context = getResponse("9876543210", context)
    # context = getResponse("No i want to edit", context)
    # context = getResponse("Its the fridge i want to get repaired", context)
    # context = getResponse("yes", context)
    # context = getResponse("can you help me with my complaint", context)
    # context = getResponse("My TV is not working", context)
    # context = getResponse("yes", context)



    print context
