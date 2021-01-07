from chatterbot.parsing import datetime_parsing
from chatterbot.comparisons import levenshtein_distance, jaccard_similarity

import sys
import os
import json
import re
import string
import random
from nltk.tag import StanfordNERTagger
from nltk.tokenize import word_tokenize
# this file defines the curpous data loader class and training
import jsonrpc
from simplejson import loads
# from chatterbot.parsing import datetime_parsing
import datetime

import pandas as pd
import numpy as np
from scipy import stats
import json
from scipy.ndimage.measurements import find_objects
import sys

SLIM_REPR_TEXTLINE = True  # while priting the table the textLine objects in each cell will look ugly and like a grabage , turn this on to return the text only for the __repr__ in the TextLine class object
DEBUG = False

# in case of a question or any statement from which we need to first get the elements
class Statement():
    def __init__(self , text):
        self.text = text

    def __repr__(self):
        return self.text

    def getKeys(self , input_ = None):
        if input_ is None:
            keys = re.findall(r"\[([A-Za-z0-9_]+)\]" , self.text)
        else:
            keys = re.findall(r"\[([A-Za-z0-9_]+)\]" , input_)
        return keys
    def getFormatText(self):
        return self.text

    def formatResponse(self, conxt = None):
        # print 'in formatResponse the data is ', conxt.data
        if conxt is not None:
            strng = self.getFormatText()
            # print self.getKeys()
            for d in conxt.data:
                if d.type == 'date':
                    valStr = d.value.strftime('%a, %d. %b %Y')
                else:
                    valStr = d.value
                if str(valStr.__class__).endswith('DateRange'):
                    valStr = valStr.start.strftime('%a, %d. %b %Y')
                # print d.name , valStr.__class__

                strng = strng.replace('[%s]'%(d.name) , valStr)
        return strng


def compareSentance(sent1, sent2):
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


    try:
        sent2 = str(sent2.encode('utf-8'))
    except:
        if sent2.text is None:
            sent2 = ""
        else:
            sent2 = str(sent2.text.encode('utf-8'))

    return levenshtein_distance(Statement(sent1), Statement(sent2))


def isYear(line):
    if len(datetime_parsing(line))==1:
        dt = datetime_parsing(line)[0][1]
        if dt.day ==1 and dt.month ==1:
            return True
        else:
            return False
    else:
        return False

class DateRange():
    def __init__(self , start ,end = None, type_ = 'day'):
        self.start = start
        self.end = end
        self.type = type_
        # for a day the end will be None and for things like week , month it will be the last date of that month and similarly for the year
    def __repr__(self):
        return '<type: %s , Start: %s , End: %s >' %(self.type , self.start , self.end)


class Word():
    def __init__(self , text , data):
        self.text = text
        self.lemma = data['Lemma']
        self.pos = data['PartOfSpeech']
        self.net = data['NamedEntityTag']

        # as of now i can get the date in the context from the dateparser and NERs from the stanfordNLP NER. The date details is also available in the data variable here but thats something i need to parse the format is 'Timex' : "<TIMEX3 tid=\"t2\" type=\"DATE\" value=\"XXXX-02-09\">9th


        # CC - Coordinating conjunction
        # CD - Cardinal number
        # DT - Determiner
        # EX - Existential there
        # FW - Foreign word
        # IN - Preposition or subordinating conjunction
        # JJ - Adjective
        # JJR - Adjective, comparative
        # JJS - Adjective, superlative
        # LS - List item marker
        # MD - Modal
        # NN - Noun, singular or mass
        # NNS - Noun, plural
        # NNP - Proper noun, singular
        # NNPS - Proper noun, plural
        # PDT - Predeterminer
        # POS - Possessive ending
        # PRP - Personal pronoun
        # PRP$ - Possessive pronoun (prolog version PRP-S)
        # RB - Adverb
        # RBR - Adverb, comparative
        # RBS - Adverb, superlative
        # RP - Particle
        # SYM - Symbol
        # TO - to
        # UH - Interjection
        # VB - Verb, base form
        # VBD - Verb, past tense
        # VBG - Verb, gerund or present participle
        # VBN - Verb, past participle
        # VBP - Verb, non-3rd person singular present
        # VBZ - Verb, 3rd person singular present
        # WDT - Wh-determiner
        # WP - Wh-pronoun
        # WP$ - Possessive wh-pronoun (prolog version WP-S)
        # WRB - Wh-adverb

    def __repr__(self):
        return '<word text: %s , pos: %s , net: %s>' %(self.text , self.pos , self.net)




# Clause level
# S - simple declarative clause, i.e. one that is not introduced by a (possible empty) subordinating conjunction or a wh-word and that does not exhibit subject-verb inversion.
# SBAR - Clause introduced by a (possibly empty) subordinating conjunction.
# SBARQ - Direct question introduced by a wh-word or a wh-phrase. Indirect questions and relative clauses should be bracketed as SBAR, not SBARQ.
# SINV - Inverted declarative sentence, i.e. one in which the subject follows the tensed verb or modal.
# SQ - Inverted yes/no question, or main clause of a wh-question, following the wh-phrase in SBARQ.


# Phrase Level
# ADJP - Adjective Phrase.
# ADVP - Adverb Phrase.
# CONJP - Conjunction Phrase.
# FRAG - Fragment.
# INTJ - Interjection. Corresponds approximately to the part-of-speech tag UH.
# LST - List marker. Includes surrounding punctuation.
# NAC - Not a Constituent; used to show the scope of certain prenominal modifiers within an NP.
# NP - Noun Phrase.
# NX - Used within certain complex NPs to mark the head of the NP. Corresponds very roughly to N-bar level but used quite differently.
# PP - Prepositional Phrase.
# PRN - Parenthetical.
# PRT - Particle. Category for words that should be tagged RP.
# QP - Quantifier Phrase (i.e. complex measure/amount phrase); used within NP.
# RRC - Reduced Relative Clause.
# UCP - Unlike Coordinated Phrase.
# VP - Vereb Phrase.
# WHADJP - Wh-adjective Phrase. Adjectival phrase containing a wh-adverb, as in how hot.
# WHAVP - Wh-adverb Phrase. Introduces a clause with an NP gap. May be null (containing the 0 complementizer) or lexical, containing a wh-adverb such as how or why.
# WHNP - Wh-noun Phrase. Introduces a clause with an NP gap. May be null (containing the 0 complementizer) or lexical, containing some wh-word, e.g. who, which book, whose daughter, none of which, or how many leopards.
# WHPP - Wh-prepositional Phrase. Prepositional phrase containing a wh-noun phrase (such as of which or by whose authority) that either introduces a PP gap or is contained by a WHNP.
# X - Unknown, uncertain, or unbracketable. X is often used for bracketing typos and in bracketing the...the-constructions.


class DataField(): # this also represent the relationship part
    def __init__(self , name , val = '', type_ = 'str'):
        self.name = name
        try:
            val = float(val)
            type_ = 'float'
        except:
            pass
        self.value = val
        self.type = type_
    def __repr__(self):
        if self.type == 'daterange':
            return 'Date range : %s' %(self.value)
        else:
            return '<Data key: %s , val: %s>' %(self.name , self.value)



if __name__ == '__main__':
    print isYear("2014(1)")
