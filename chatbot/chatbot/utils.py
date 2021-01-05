from chatterbot.parsing import datetime_parsing
from chatterbot.comparisons import levenshtein_distance
import re
import numpy as np
from heapq import nlargest
import operator
import sys
import json

if len(sys.argv)==4 and sys.argv[3] == 'true':
    DEBUG = True
else:
    DEBUG = False

non_decimal = re.compile(r'[^\d.]+')

def presentInSent(sent, label):
    sent = sent.lower()
    label = label.lower()
    count = 0
    labelParts = label.split(' ')
    for w in sent.split(' '):
        for w2 in labelParts:
            if w2 == w:
                count += 1

    if float(count)/float(len(labelParts))>0.5:
        return True
    else:
        return False

def isBulleted(textLines):
    text = textLines[0].text
    index = re.findall('\((.*?)\)' , text)
    # print index
    if len(index)==0:
        index = re.findall('\([.*?]\)' , text)
    if len(index)==1 and (len(index[0])<3 and text.index('(')<3 or ('.' in text and text.index('.')<3 and text.isupper())) and len(textLines)<3:

        toReturn = True
    else:
        if [ord(c) for c in text] == [226, 128, 162] or (text.startswith('Note ') and text[5].isdigit()):
            toReturn = True
        else:
            numeric = False
            try:
                float(text.replace('*', '').replace('+','').split('.')[0])
                numeric = True
            except:
                pass
            if (numeric or len(text)==1) and ('.' in text or (text.isdigit() and len(textLines) <3 )) and textLines[0].start<0.35 and not isYear(textLines[0].text)[0]:
                # print "Returning true from isBulleted", textLines[0].text
                toReturn = True
            else:
                toReturn = False
    if DEBUG:
        print "Returning " , toReturn , " For " , text
    return toReturn

def mode(valueList, nmodes):
  frequencies = {}

  for value in valueList:
    frequencies[value] = frequencies.get(value, 0) + 1

  return [x[0] for x in nlargest(nmodes,frequencies.iteritems(),operator.itemgetter(1))]

class Statement():
    def __init__(self , text):
        self.text = text

    def __repr__(self):
        return self.text

def getFloat(val, scale = 1):
    if len(val) == 0 or val == '.' or val.count('.')>1:
        return 0
    return float(val)


def numerize(val, scale = 1):
    # print val
    try:
        val = val.text
    except:
        pass

    if val is None:
        return None
    parts = val.split('(')
    if len(parts[0])>0:
        val = parts[0]
    if str(val).startswith('('):
        negative = True
    else:
        negative = False
    val = non_decimal.sub('', str(val))

    if '(' in val or negative:
        # print "in if"
        val = val.replace('(' , '').replace(')', '').replace('%','').replace(',', '')
        try:
            val = int(val)*-1*scale
        except:
            val = -1*getFloat(val, scale)
    else:
        cleaned = val.replace('%','').replace(',', '')
        try:
            val = int(cleaned)
            val = val*scale
        except:
            val = getFloat(val, scale)
    # print "Returning : " , val
    return val


def compareValue(val1 , val2):
    # print "Comparing value ", val1 , val2
    if val1 is None or val2 is None:
        return False

    if val1.text == val2.text:
        return True

    val1 = numerize(val1)
    val2 = numerize(val2)

    if val1 == val2:
        return True
    else:
        return False

def randomID():
    length = 20
    chars = string.ascii_letters + string.digits + '!@#$%^&*()'
    rnd = random.SystemRandom()
    return ''.join(rnd.choice(chars) for i in range(length))


def isTitle(line):
    if DEBUG:
        print '\n\n\nto test if its a title', line

    pos = line[0].boundingBox.topLeft()
    try:
        titleText = str(line[0].text.toUtf8())
    except:
        titleText = line[0].text

    if len(titleText)==0:
        return False
    if titleText.isupper() or (titleText[0].isupper() and '\\' not in titleText and len(titleText.split(' ')) < 8) and not titleText.endswith('.') and pos.x() < 200:

        if DEBUG:
            print "True"
        return True
    else:
        if DEBUG:
            print "False"
        return False


def compareSentance(sent1, sent2, ignoreNumbers = False):
    if sent1 is None or sent2 is None:
        return 0

    try:
        try:
            sent1 = str(sent1.text.toUtf8())
        except:
            try:
                sent1 = sent1.text.decode('utf-8')
            except:
                pass

    except:
        traceback.print_exc(file=sys.stdout)

    sent1 = str(sent1.encode('utf-8'))

    try:
        try:
            sent2 = str(sent2.text.toUtf8())
        except:
            try:
                sent2 = sent2.text.decode('utf-8')
            except:
                pass
    except:
        traceback.print_exc(file=sys.stdout)
    sent2 = str(sent2.encode('utf-8'))

    if ignoreNumbers:
        sent1 = ''.join([i for i in sent1 if not i.isdigit()])
        sent2 = ''.join([i for i in sent2 if not i.isdigit()])

    return levenshtein_distance(Statement(sent1), Statement(sent2))

changeHeaders = ['variance','change', 'vs']

def isYear(line):
    # print line

    relationDateRepr = False
    for c in changeHeaders:
        if c in line.lower():
            relationDateRepr = True

    try:
        dates = datetime_parsing(line)
    except:
        return False, None
    if len(dates)==1:
        dt = dates[0][1]
        if dt.day ==1 and dt.month ==1:
            return True, dt.year
        else:
            return False, None
    elif len(dates) == 2 and not relationDateRepr:
        for d in dates:
            dt = d[1]
            if dt.day ==1 and dt.month ==1:
                return True, dt.year
        return False, None
    else:
        return False , None


def calculateAdd(calInputs , expectedRes):
    # print calInputs , expectedRes
    simplifiedCI = []
    for ci in calInputs:
        # print ci
        sci = []
        for c in ci[1:]:
            if c is None:
                sci.append(0)
                continue
            sText = c.text
            sText = numerize(sText)
            if isinstance(c, np.int64 ):
                sci.append(c)
                continue
            elif isinstance(sText, str):
                sci.append(0)
                continue

            sci.append(sText)

        # print sci
        simplifiedCI.append(sci)
        # print sci
    simplifiedRes = []
    for er in expectedRes[1:]:
        if er is None:
            simplifiedRes.append(0)
            continue
        sText = er.text
        sText = numerize(sText)
        simplifiedRes.append(sText)
    s = np.zeros(len(simplifiedRes),dtype=float)

    for sci in simplifiedCI:
        print "adding : ",
        print sci
        ss = np.array(sci,dtype=float)
        s += np.array(sci,dtype=float)
    calculated = np.around(s , decimals=2)

    # print  simplifiedRes
    # print  np.around(calculated, decimals=2).tolist()

    return  calculated.tolist(), np.around(simplifiedRes-calculated, decimals=2).tolist()


def applyFormulae(rows,expectedRes, formulae , round = 2):
    print formulae
    p = re.compile('\d+')
    p2 = re.compile('\[([0-9_]+)\]')
    finds2 = p2.findall(formulae)

    finds = p.finditer(formulae)
    formulaeTrans = formulae.replace('','')
    added = 0
    for i, m in enumerate(finds):
        if m.group() in finds2:
            continue
        formulaeTrans = formulaeTrans[:m.start()+added]+'v'+ m.group() + formulaeTrans[added+m.start()+len(m.group()):]
        added += 1

        cleanedVals = []
        for j in rows[int(m.group())]:
            if j is None:
                cleanedVals.append(np.nan)
            else:
                try:
                    cleanedVals.append(numerize(j.text))
                except:
                    cleanedVals.append(np.nan)
        exec('v'+m.group()+'= np.array(cleanedVals)')
    exec('res = ' + formulaeTrans)

    simplifiedRes = []
    for er in expectedRes:
        if er is None:
            simplifiedRes.append(np.NaN)
            continue
        sText = er.text
        sText = numerize(sText)
        simplifiedRes.append(sText)

    res = np.around(res , decimals=round)
    return res.tolist() , np.around(simplifiedRes-res, decimals=round).tolist()

def getTableLableMappings():
    fStr = file("tableLabel.config.json").read()
    jObj = json.loads(fStr)
    return jObj

def getDates(line):
    # i need to replace - with /
    # line = "marizes information aboutstock options outstanding and exercisable at December 28, 2016:"
    line = re.sub(r"\s*,\s*", " ", line)
    line = re.sub(r"\s*-\s*", "/", line)
    line = ' '.join(re.findall(r"[^\W\d_]+|\d+" , line ))
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
