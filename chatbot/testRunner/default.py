import os
import sys
print "Started"

helperPath = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) , 'chatbot')
sys.path.append(helperPath)


from nlpEngine import parseLine
from helper import *

txt = '{0}'

{1}

nlpResult = parseLine(txt)
data  = extract(txt , nlpResult)
print data
