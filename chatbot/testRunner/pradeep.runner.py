import os
import sys
print "Started"

helperPath = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) , 'chatbot')
sys.path.append(helperPath)


from nlpEngine import parseLine
from helper import *

txt = 'Karnataka'

def extract(txt , nlpResult):
    print "Inside the python code"
    # this is an example of transforming the message to standard codes like state codes
    mapings = [
        {'from' : 'Karnataka' , 'to' : 'KA'},
        {'from' : 'Maharashtra' , 'to' : 'MH'},
        {'from' : 'Tamilnadu' , 'to' : 'TN'},
    ]
    
    
    
    similarityArray = []
    for mapping in mapings:
        mapping['similarity'] = compareSentance(Statement(mapping['from']),Statement(txt))
        
        if mapping['similarity'] >0.9: # skip if its not 90% similar
            similarityArray.append(mapping)

    similarityArray.sort(key=lambda x: x['similarity'], reverse=True)

    for toPrint in similarityArray:
        print toPrint


    if len(similarityArray)>0:
        return similarityArray[0]['to']
    else:
        return None

nlpResult = parseLine(txt)
data  = extract(txt , nlpResult)
print data
