from django.test import TestCase
import re
# Create your tests here.

txt = "@test1 can you fix the issue of something #Automobile R&D(1)"

mentions = re.findall("(?<![@\w])@(\w{1,25})", txt)
hashtags = re.findall("(?<=#)(.*?)(?=\))", txt)

print result

print result
