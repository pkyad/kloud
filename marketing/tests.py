# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
import requests
# Create your tests here.



#
# sid         = 'cioc51'
# key         = 'c9c3b834403869391f582cc288ef9f1d4aaf06a23f25620f'
# token       = '56849aaa4e89cc4dce38b0bc6c0c70dfccf249646a635800'
#
# data = {
#   'From': '9702438730',
#   'To': '8209371323',
#   'CallerId': '02248966707'
# }
#
# res = requests.post('https://'+ key +':'+  token +'@api.exotel.in/v1/Accounts/'+ sid +'/Calls/connect.json', data=data)
# print res
#
# print res.json()



res = requests.get('http://localhost:8000/generateExternalOTP/?mobile=9702438730')
print res.json()




print res.json()

res = requests.get('http://localhost:8000/verifyExternalOTP/?mobile=9702438730&otp=' + res.json()['otp'])



token =   res.json()['token']


res = requests.get('http://localhost:8000/getIM/?token=' + token)
print "contact list", res.json()



res = requests.get('http://localhost:8000/getIMsByNumber/?with=9769484219&token=' + token)
print "messages" , res.json()

res = requests.post('http://localhost:8000/sendExternalMessage/?from=9702438730&to=9769484219' , files = {'attach' : open('bni-2020-07-01_15.33.31.mp4' , 'r') })


print res.json()
