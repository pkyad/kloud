# this will contain functions that can be used to start any nlp related project

# (c) Pradeep
# License : GPL2

import sys
import os
import json
from chatterbot.comparisons import levenshtein_distance, jaccard_similarity
import re
import string
import random
from nltk.tag import StanfordNERTagger
from nltk.tokenize import word_tokenize
# this file defines the curpous data loader class and training
import jsonrpc
from simplejson import loads
from chatterbot.parsing import datetime_parsing
import datetime
from numberParser import parseNumber, parsePercentage
from helper import *
from django.conf import settings

if len(sys.argv)>1:
    DETAILED_RESULT = True
else:
    DETAILED_RESULT = False


DEBUG = False


#
# NER = StanfordNERTagger('/home/pradeep/stanford-ner-2018-10-16/classifiers/english.all.3class.distsim.crf.ser.gz',
#                '/home/pradeep/stanford-ner-2018-10-16/stanford-ner.jar',
#                encoding='utf-8')

NER = StanfordNERTagger(settings.SNERT_PATH_1 ,
               settings.SNERT_PATH_2,
               encoding='utf-8')
# os.environ['CLASSPATH'] = "/home/cioc/Documents/stanford-ner-2018-10-16/stanford-ner.jar"


def getMonthReplacement(month):
    if len(month) > 4:
        return month

    month = int(month.replace('-' , ''))


    months = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'July' , 'Aug' , 'Sept' , 'Oct' , 'Nov' , 'Dec']
    return ' ' + months[month-1] + ' '


def getDates(line):
    # i need to replace - with /
    year = re.findall(r"-[0-9]{2}\s" , line)
    if len(year)>0:
        line = line.replace(year[0] , year[0].replace('-' , '-20'))
    months = re.findall(r"-[0-9]+-" , line)
    if len(months)>0:
        line = line.replace(months[0] , getMonthReplacement(months[0]) )

    line = re.sub(r"\s*-\s*", "/", line)
    # print line
    dts = datetime_parsing(line)

    corrected = []
    for i, d in enumerate(dts):
        dtStr = d[0]
        prts = dtStr.split(' ')
        containsYear = False
        for p in prts:
            if isYear(p):
                containsYear = True

        if len(prts)>1 and i<= len(dts)-2 and dts[i+1][1].day == 1 and dts[i+1][1].month == 1:
            corrected.append({'index': i+1 , 'correction' : i, 'possiblePreserve': containsYear})

        lastCorrcted = False
        for c in corrected:
            if c['index'] == i-1:
                lastCorrcted = True
                correction = c['correction']
                break

        if i>0 and lastCorrcted and len(prts)==1 and d[1].day ==1 and d[1].month == 1:
            corrected.append({'index': i , 'correction' : correction,'possiblePreserve': containsYear})

    toDelete = []
    # print corrected
    for c in corrected:
        if isYear(dts[c['index']][0]): # just the year
            checkForDeletion = True
            base = dts[c['correction']][1]
            dts[c['index']] = ( dts[c['index']][0] , base.replace(year =dts[c['index']][1].year ))

        else:
            checkForDeletion = False

        if not c['possiblePreserve'] and  checkForDeletion and dts[c['index']-1][1].year == datetime.datetime.today().year:
            toDelete.append(c['correction'])

    for index in sorted(toDelete, reverse=True):
        del dts[index]

    return dts



def getLastPartByTag(words , tag , i):
    ind = i-1
    while ind >=0 and words[ind].pos != tag:
        ind -=1
    if ind == -1:
        return None
    endInd = ind
    while ind >= 0 and words[ind].pos == tag:
        ind -= 1
    val = ''
    # print ind , endInd +1
    for j in range(ind+1 , endInd +1):
        if words[j].net == 'O':
            val += words[j].text + ' '
    val = val.strip()
    # print val
    return val

def getNextPartByTag(words , tag , i):
    ind = i+1
    while ind < len(words) and words[ind].pos != tag:
        ind +=1
    if ind == len(words):
        return None
    startInd = ind

    while ind < len(words) and words[ind].pos == tag:
        ind += 1
    val = ''
    # print startInd , ind+1
    for j in range(startInd , ind):
        if words[j].net == 'O':
            val += words[j].text + ' '
    val = val.strip()
    # print val
    return val

def getNextEntityByTag(words , tag , i):
    ind = i+1
    while ind < len(words) and words[ind].net != tag:
        ind +=1
    if ind == len(words):
        return None
    startInd = ind

    while ind < len(words) and words[ind].net == tag:
        ind += 1
    val = ''
    # print startInd , ind+1
    for j in range(startInd , ind):
        val += words[j].text + ' '
    val = val.strip()
    # print val
    return val

def getLastEntityByTag(words , tag , i):
    ind = i-1
    while ind >=0 and words[ind].net != tag:
        ind -=1
    if ind == -1:
        return None
    endInd = ind
    while ind >= 0 and words[ind].net == tag:
        ind -= 1
    val = ''
    # print ind , endInd +1
    for j in range(ind+1 , endInd +1):
        val += words[j].text + ' '
    val = val.strip()
    # print val
    return val


def getNextSubPartBetweenTags(words , tagStart , tagEnd, i):
    ind = i+1
    # say there is a pattern NN, IN, NNS and so on and we want till NNS
    endInd = None
    startInd = None
    while ind < len(words) and words[ind].pos != tagStart:
        ind +=1
    startInd = ind
    ind += 1
    while ind < len(words) and words[ind].pos != tagEnd:
        ind +=1
    endInd = ind

    if startInd is None or endInd is None:
        return None

    # print startInd , endInd
    # print len(words)
    val = ''
    if abs(startInd-endInd-1)>7:
        return getNextPartByTag(words, 'NN', i)
    for j in range(startInd , endInd+1):
        try:
            # print j, words[j].pos, words[j].text
            if j == endInd:
                if words[j].pos in ['IN']:
                    continue
            if words[j].net == 'O':
                val += words[j].text + ' '
        except:
            pass
    val = val.strip()
    # print val
    return val

def getLastSubPartBetweenTags(words , tagStart , tagEnd, i):
    ind = i-1
    # say there is a pattern NN, IN, NNS and so on and we want till NNS
    endInd = None
    startInd = None
    while ind >=0 :
        if words[ind].pos == tagStart and words[ind].net== 'O':
            break
        ind -=1
    endInd = ind
    ind -=1
    while ind >=0 and words[ind].pos != tagEnd:
        ind -=1
    startInd = ind

    if startInd is None or endInd is None:
        return None

    if abs(startInd-endInd-1)>7:
        try:
            if getLastPartByTag(words, 'JJ', i) is not None :
                if getLastPartByTag(words, 'NN', i) is None:
                    tag = 'NNS'
                else:
                    tag = 'NN'
                return getLastSubPartBetweenTags(words, tag, 'JJ', i)
            else:
                return getNextPartByTag(words, 'NN', i)
        except:
            pass

    # print startInd , endInd
    tagsCollection = []
    for j in range(startInd , endInd+1):
        try:
            tagsCollection.append(words[j].pos)
        except:
            pass

    # print len(words)
    val = ''
    for j in range(startInd , endInd+1):
        try:
            # print j, words[j].pos, words[j].text
            if j == endInd and words[j].pos in ['IN']:
                continue
            if words[j].net == 'O':
                val += words[j].text + ' '
        except:
            pass
    val = val.strip()
    # print val
    return val


def parseLine(line, port=None):
    print "please wait..."
    if line is None:
        return

    if port == None:
        port = 8080

    stanfordNLP = jsonrpc.ServerProxy(jsonrpc.JsonRpc20(),
                         jsonrpc.TransportTcpIp(addr=("127.0.0.1", port)))



    # line = line.replace('INR ' , '$ ').replace('Rs. ' , '$ ')

    nlpRes = stanfordNLP.parse(line)
    result = loads(nlpRes)

    parsetree = result['sentences'][0]['parsetree']
    phraseTag = re.findall(r"([A-Za-z0-9_]+)" , parsetree)[1]

    locations = []
    miscs = []
    durations = []
    persons = []
    datafields = []
    words = []
    percents = []
    money = []
    emails = []
    if DEBUG:
        print 'words are : \n'
    for w in result['sentences'][0]['words']:
        w = Word(w[0] , w[1])
        if DEBUG:
            print w

        words.append(w)

    if DEBUG:
        print '\n\n'


    # get the percents here
    ind = -1
    for i, w in enumerate(words):
        if i <= ind:
            continue
        val = None
        if w.net == 'O' and w.pos == 'NNP' and '@' in w.text:
            for p in w.text.split(':'):
                if isEmail(p):
                    emails.append(p)
        for tag in ['PERCENT', 'MONEY']:
            if w.net == tag:
                ind = i
                if ind+1 != len(words):
                    while words[ind+1].net == tag:
                        ind += 1
                        if ind == len(words)-1:
                            break
                val = ''
                for j in range(i, ind+1):
                    val += words[j].text + ' '
                val = val.strip()
            if val is None:
                continue
            if tag == 'PERCENT':
                try:
                    val = parsePercentage(val)
                except:
                    pass
                percents.append(val)
            elif tag == 'MONEY':
                try:
                    val = parseNumber(val)
                except:
                    pass
                money.append(val)
            val = None


    NEs = NER.tag(word_tokenize(line))

    ind = -1
    if DEBUG:
        print 'Named entity tags are : \n', NEs, '\n\n'

    for i, ne in enumerate(NEs):
        if i <= ind:
            continue
        val = None
        for tag in ['MISC', 'LOCATION' , 'DURATION', 'PERSON', 'DATE', 'PERCENT']:
            if ne[1] == tag:
                ind = i
                if ind+1 != len(NEs):
                    while NEs[ind+1][1] == tag:
                        ind += 1
                        if ind == len(NEs)-1:
                            break
                val = ''
                for j in range(i, ind +1):
                    val += NEs[j][0] + ' '
                val = val.strip()
            if val is None:
                continue
            if tag == 'MISC':
                miscs.append(val)
            elif tag == 'LOCATION':
                locations.append(val)
            elif tag == 'DURATION':
                durations.append(val)
            elif tag == 'PERSON':
                persons.append(val)
            elif tag == 'PERCENT':
                percents.append(val)
            val = None
    try:
        dates = getDates(line)
    except:
        dates = []

    for d in dates:
        start = d[1]
        if 'week' in d[0]:
            # get the last date of that week
            end = start + datetime.timedelta(days = 6)
            type_ = 'week'
        elif 'year' in d[0]:
            end = start + datetime.timedelta(days = 365)
            type_ = 'year'
        elif 'today' in d[0]:
            end = None
            type_ = 'day'
        else:
            end = None
            type_ = 'day'

        dr = DateRange(start , end , type_)
        df = DataField('field' , val = dr , type_ = 'daterange')
        datafields.append(df)

    if DETAILED_RESULT:
        if len(money)>0:
            print 'Money : ', money , '\n\n'

        if len(persons)>0:
            print 'persons : ', persons , '\n\n'

        if len(locations)>0:
            print 'locations : ', locations , '\n\n'

        if len(percents)>0:
            print 'percents : ', percents , '\n\n'

        if len(durations)>0:
            print 'durations : ', durations , '\n\n'

        if len(miscs)>0:
            print 'miscs : ', miscs , '\n\n'

        if len(dates)>0:
            print 'dates : ', dates , '\n\n'
        if len(emails)>0:
            print 'emails : ', emails , '\n\n'

    cleanedTags = [] # currently unused
    for i, ne in enumerate(NEs):
        if i <= ind:
            continue
        tag = ne[1]
        ind = i
        val = ''
        if ind+1 < len(NEs):
            while NEs[ind+1][1] == tag:
                ind += 1
                if ind == len(NEs)-1:
                    break
        for j in range(i, ind +1):
            val += NEs[j][0] + ' '
        val = val.strip()
        cleanedTags.append((val , tag))

    # for w in words:
    #     print w


    return datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money


def getSentLabel(words , m, NET):

    # print m , NET
    # for w in words:
    #     print w

    prts = m.split(' ')
    label = None

    for w in words:
        wInd = words.index(w)
        if (wInd==len(words)-1):
            # print "Breaking"
            break
        # print w.text , w.text == prts[0] , w.text == prts[1]
        if w.text == prts[0]:
            # if len(prts)>1 and words[wInd+1].text == prts[1]:
            #     print "Found"
            # elif len(prts) ==1:
            #     print "found 2"
            # print w , words[wInd +1] , 'Found'
            i = 1
            while i<len(prts) and wInd+2 < len(words) and words[wInd+i].text == prts[i]:
                # print "Matched till " , prts[i]
                i+=1
            # print i
            if i >=1:
                # now i have the before and after tag of the money

                ltag = words[wInd-1].pos
                lltag = words[wInd-2].pos
                ntag = words[wInd+i].pos
                if wInd+2+i <= len(words)-1:
                    nntag = words[wInd+1+i].pos
                else:
                    nntag = None
                print 'Tags around are:', lltag , ltag , ntag, nntag
                if ltag =='VBD' and ntag == 'JJ' and nntag == 'IN':
                    # print 'eighth'
                    label = getNextPartByTag(words , 'NNP' , wInd)
                elif ltag in ['VBD'] and ntag != 'IN':
                    # print 'first'
                    label = getLastPartByTag(words, 'NN', wInd-1)
                    attr = getLastPartByTag(words, 'NNS', wInd-1)
                    if attr is not None:
                        if label is None:
                            label = ''
                        label += ' ' +attr

                elif ltag == 'IN' and lltag == 'NNS':
                    # print 'second'
                    p1 = getLastPartByTag(words, 'JJ', wInd-1)
                    if p1 is None:
                        p1 = ''
                    label = p1 + ' ' +getLastPartByTag(words, 'NNS', wInd-1)
                    # print label
                elif (ltag == 'IN' or (ltag == 'RB' and lltag == 'VB')) or (ltag == 'RB' and ntag == 'CC' and lltag == 'IN'):
                    # print 'third'
                    if words[wInd-3].pos == 'DT' and words[wInd-4].pos == 'IN' and getLastPartByTag(words, 'JJ', wInd) is not None:
                        label = getLastSubPartBetweenTags(words, 'NNS', 'JJ', wInd-1)
                    else:
                        label = getLastPartByTag(words , 'NN', wInd-1)
                elif ntag == 'IN':
                    # print 'forth'
                    # print words[wInd +3]
                    if nntag == 'DT' and words[wInd +i+1].net == 'DURATION':
                        # print "if"
                        label = getLastPartByTag(words, 'NN', wInd-1)
                    else:
                        # print "else"
                        if nntag in ['NNS', 'NN']:
                            # print 'second if'
                            label = getNextSubPartBetweenTags(words, nntag, 'NNS', wInd)
                        else:
                            # print 'second else' , 'hey'
                            label = getNextSubPartBetweenTags(words, 'NN', 'NNS', wInd)
                            # print 'label',  label
                        if label == '':
                            # print 'the label came empty'
                            if getLastPartByTag(words , 'JJ', wInd-1) is None:
                                label = getLastSubPartBetweenTags(words, 'NNS', 'NN', wInd-1)
                            else:
                                label = getLastSubPartBetweenTags(words, 'NN', 'JJ', wInd-1)
                elif ntag == 'NN' and nntag != 'IN':
                    # print 'fifth'
                    label = getNextPartByTag(words , 'NN', wInd)
                elif lltag == 'NN' and ltag == 'VBG':
                    # print 'ninth'
                    label = getLastSubPartBetweenTags(words , 'NN', 'NNS', wInd)
                elif lltag == 'NNS' and ltag == 'VBG':
                    # print 'tenth'
                    label = getLastSubPartBetweenTags(words , 'NNS', 'NNS', wInd)
                elif ntag == 'NN' and nntag == 'IN':
                    # print 'sixth'
                    # if
                    # label = getNextPartByTag(words , 'NN', wInd+2)
                    label = getNextSubPartBetweenTags(words , 'NN', 'NNS', wInd+3)
                elif ltag == 'TO' and lltag == 'RB':
                    # print 'seventh'
                    label = getLastPartByTag(words , 'NN', wInd)
                elif ltag == 'CC' and ntag == ',' and nntag == 'RB':
                    # print 'eleventh'
                    adjecentMoney = getLastEntityByTag(words , NET , wInd)
                    # print 'nearest money:', adjecentMoney
                    if adjecentMoney is not None:
                        label = getSentLabel(words, adjecentMoney, NET)

                elif nntag == '$': # means its like $1.1mill, $1.2 mill , $2.2 million in 2012,13,14 respectively
                    # print 'twelth'
                    adjecentMoney = getLastEntityByTag(words , NET , wInd)
                    # print 'nearest money:', adjecentMoney
                    if adjecentMoney is not None:
                        label = getSentLabel(words, adjecentMoney, NET)
                    if label is None:
                        adjecentMoney = getNextEntityByTag(words , NET , wInd)
                        # print 'nearest money:', adjecentMoney
                        if adjecentMoney is not None:
                            label = getSentLabel(words, adjecentMoney, NET)
                    if label is None:
                        # print 'in the if label is None'
                        label = getNextSubPartBetweenTags(words, 'NN', 'NNS', wInd)
                        # print 'label',  label
                        if label == '':
                            # print 'the label came empty again'
                            if getLastPartByTag(words , 'JJ', wInd-1) is None:
                                label = getLastSubPartBetweenTags(words, 'NNS', 'NN', wInd-1)
                            else:
                                label = getLastSubPartBetweenTags(words, 'NN', 'JJ', wInd-1)


    return label

def isEmail(s):
    match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', s)
    return match != None

def inMillion(m, decimals = 1):
    if m is None:
        return
    if decimals == 2:
        return '%.2f million'%(float(m)/float(1000000))
    elif decimals == 1:
        return '%.1f million'%(float(m)/float(1000000))
    else:
        return  '%s million'%(m/1000000)

def getYearRelatedValues(sent , parsedData = None):
    print 'getting year related values ', sent
    try:
        if parsedData is not None:
            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parsedData
        else:
            datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(sent)
    except:
        return None
    years = []
    yrSent = ''
    indxs = []
    for d in dates:
        dt = d[1]
        years.append(d[0])

        for i, w in enumerate(words):
            if w.text == d[0]:
                indxs.append(i)
                break

    case = 0
    if len(years) == 2:
        if getNextPartByTag(words, 'CC', indxs[0]) is not None and getLastPartByTag(words, 'CC', indxs[1]):
            # the end between the two years gets the pos of CC
            case = 1
        elif getNextPartByTag(words, 'VBD', indxs[0]) is not None:
            # it is the case when the sent is like data in 2014 was val1 and in 2015 it was , here the was get VBD pos tag
            case = 2
        else:
            case = 0
    elif len(years)==0:
        return None


    values = []
    typ = None
    if len(percents)!= 0:
        values = percents
        typ = 'PERCENT'
    elif len(money) != 0:
        values = money
        typ = 'MONEY'
    maps = []
    possible = False
    if len(values) == len(years):
        possible = True
        if case == 1:
            for i in range(len(years)):
                maps.append({'value': values[i], 'date' : dates[i][1] })

        elif case ==2:
            for i in range(len(years)):
                maps.append({'value': values[i] ,'date' : dates[i][1]})
    for i, w in enumerate(words):
        if w.text == years[0]:
            indx = i

    label = getSentLabel(words , str(maps[0]['value']) , typ)
    # label = getNextPartByTag(words , 'NN', 0)
    return {'label': label , 'maps' : maps, 'type': typ}

# def getPossibleLabel(words, index , direction):
from bson import json_util
import json

from utils import numerize

creditNotesItem = ['credited']
debitNotesItem = ['debited']
statementTerms = ['statement' , 'account' , 'password']

def parseSMS(line , sender):

    line = line.replace('UPI' , ' UPI')

    upiAddress = []
    print "Account numbers : " , re.findall(r"[0-9]*[Xx\*]*[0-9]*[Xx\*]+[0-9]{3,}",line)
    for upiadd in re.findall(r"([\w.-]*[@][\w]*)" , line):
        if len(upiadd)>1:
            upiAddress.append(upiadd)



    for uai, ua in enumerate(upiAddress):
        upiAddress[uai] = ua.split('-')[-1]

    print "UPI Address : " , upiAddress

    amounts =   re.findall(r"[rR][sS]\.?\s?[,\d]+\.?\d{0,2}|[iI][nN][rR]\.?\s*[,\d]+\.?\d{0,2}" , line)

    if len(amounts) == 0:
        try:
            amt = float(line.split(' ')[0])
            amounts.append(amt)
        except:
            print "error while getting the number"
            pass
    print "ammounts : " , amounts
    finalAmounts = []
    for am in amounts:
        am = re.sub('[A-Za-z,]+', '', am).strip()
        i = None
        for i, c in enumerate(am):
            if c.isdigit():
                print i
                break
        if i is not None:
            finalAmounts.append( float(am[i:]) )


    parts = line.replace('-' , ' ').replace(':' , ' ').replace('[A-Z][^A-Z]*' , ' ').split(' ')
    final = []
    try:
        final = df[df['keyword'].isin(parts)].entity.unique()
        print "enity : " , final
    except:

        sender = str(sender)

        if '-' in sender:
            sender = sender.split('-')[1]
        else:
            sender = sender[2:]

        i = 0
        senderID = [sender]
        while len(sender[:-1-i])>2:

            senderID.append(sender[:-1-i])
            i += 1
        try:
            final = df[df['keyword'].isin( senderID )].entity.unique()
            print "enity : " , final
        except:
            print "entity : "
            pass

    tagsListStr = "".join(final)

    if len(upiAddress)>0:
        print "Entity corrected : UPI"


    dates =  []
    try:
        dates =  getDates(line)
    except:
        pass

    print "dates : " , dates

    creditType = False
    debitType = False
    bankStatement = False
    if any(ext in line.lower() for ext in debitNotesItem) or 'ATM' in tagsListStr:
        if 'ATM' in tagsListStr:
            print "ATM transation type"
            debitType = True
        print "debit transaction type"

    if any(ext in line.lower() for ext in creditNotesItem):
        creditType = True
        print "credit transaction"


    if all( ext in line.lower() for ext in statementTerms ):
        print "bank statement inside"
        bankStatement = True

    return upiAddress ,finalAmounts , tagsListStr , final , bankStatement , debitType , creditType


def main():
    print 'Started'
    # line = "Satya Nadela on 20th Jan 2019 said that Microsoft will invest $ 100 million in charity this year which is 10% heigher then last year"
    line = "Can you help me to book a flight from Bengalore to New Delhi next monday for less then $ 10"

    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = parseLine(line)
    print locations
    print money
    print dates


    # upiAddress ,finalAmounts , tagsListStr , final , bankStatement , debitType , creditType =  parseSMS("Rs 1000 credited in yout account XXXX002", 'TD-HDFCBK')
    # list = []
    # day =  dates[0][0]
    # dates =dates[0][1]
    # print datafields[0]
    # values = {'datafields':datafields[0],'words':words,'percents':percents,'durations':durations,'persons':persons,'miscs':miscs,'locations_from':locations[0],'locations_to':locations[1],'cleanedTags':cleanedTags,'day':day,'dates':dates,'money':money[0],'upiAddress':upiAddress,'finalAmounts':finalAmounts,'tagsListStr':tagsListStr,'final':final,'bankStatement':bankStatement,'debitType':debitType,'creditType':creditType}
    # list.append(values)
    # print list
    # json.dumps(values, default=json_util.default)
    # print json.dumps(list)




if __name__ == '__main__':
	main()


def email():
    s = 'Hello lorem ipsum I am good with all the servers shubhamg199630@gmail.com to priya@yahoo.com, now lets talk about the meeting, mail the same to abcd@hotmail.com'
    e_com = re.findall('\S+@\S+', s)

    print e_com

if __name__ == '__main__':
	email()


def mobile():
    num = 'call me at 1233367777, or reach me at +919876543210, +91 1234567890'
    print num
    m_num = re.findall('[\+\d{12}]+[\+\d{10}]', num)
    print m_num

if __name__ == '__main__':
	mobile()
#
# def word(s):
#     print 'parsing all words'
#     wrd = re.findall(r'\w+', s)
#     print '', wrd
#
# if __name__ == '__main__':
# 	word()
