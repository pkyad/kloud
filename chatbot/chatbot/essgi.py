import json
from helper import *
# from nlpEngine import word

configFile = open('config.json', 'r')
configs = json.loads(configFile.read())

def getMatch(config, inp):
    c1 = compareSentance(Statement(config["input"]),Statement(inp))
    if c1 > 0.8:
        return True
    else:
        return False

def getResponse(txt):
    print "USER:", txt
    if len(txt) >= 2:
        matched = False
        for config in configs:
            if getMatch(config, txt):
                matched = True
                if config['response'] == "":
                    print "Please look at this page for more details", config['url']
                    print "-------------------"
                else:
                    print "BOT RESPONSE:", config['response']
                    print "-------------------"
        if not matched:
            print "Sorry i did not get it. Please call us on 9876543210"

if __name__ == '__main__':

    # getResponse("APC is a UPS or a stablizer?")
    # getResponse("What is APC")
    getResponse("Can I connect power cord extension to the UPS?")
    getResponse("what are the computers and laptops you have?")
    # getResponse("what are the printers and scanners you have?")
    # getResponse("I want computer accessories")
    # getResponse("wiFi router")
    # getResponse("pendrive")
    # getResponse("headphone")
    # getResponse("canon")
    # getResponse("keyboard")
    # getResponse("what is the difference between ups and battery?")
    # getResponse("smartphones")
    # getResponse("tablets")
    # getResponse("solar inverter")
    # getResponse("solar hybrid power plants")
    # getResponse("rooftop solar plant")
    # getResponse("computer repair")
    # getResponse("green energy")
    # getResponse("installation")
    # getResponse("battery repair")
    # getResponse("ups not working")
    # getResponse("service")
    # getResponse("request service")
    # getResponse("hp")
    # getResponse("Dell")
    # getResponse("Lenovo")
    # getResponse("not working")
    # getResponse("ups repair")
    # getResponse("canon warranty")
    # getResponse("UPS warranty")
    getResponse("ipdfj lornd jendd, ooufs")
    context = getResponse("will your team help with installation?", context)
    context = getResponse("I want to buy UPS warranty online", context)
    context = getResponse("where is your service center", context)
    context = getResponse("some text", context)
    context = getResponse("what are the computers and laptops you have?", context)


def word():
    m_num = re.findall('[\+\d{12}]+[\+\d{10}]', sentence1)
    e_com = re.findall('\S+@\S+', sentence1)
    print "Our team will contact you in the details provided", m_num, e_com


    # wrd = re.findall(r'\w+', sentence)
    # txt = wrd
    # for t in txt:
    # for config in configs:
    #     if getMatch(config, sentence1):
    #         if config['response'] == "":
    #             print "Please look at this page for more details", config['url']
    #             print "-------------------"
    #         else:
    #             print "BOT RESPONSE:", config['response']


        # if config["type"] == "Fail":
        #
        #         if config["response"] == None:
        #             print "Visit our site", config["url"]
        # # else:
        #     print "I cant understand"

if __name__ == '__main__':
    sentence1 = input("Type your enquiry here: ")
    word()
