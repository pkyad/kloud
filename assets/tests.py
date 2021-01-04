# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
import requests


# Create your tests here.
res = requests.get('http://localhost:8000/api/marketing/getVisit/?typ=Today&validUser=')
dataPk = res.json()['data']['new'][0]['pk']
print dataPk

res0 = requests.post('http://localhost:8000/api/marketing/verifyOtp/', data={'id':dataPk, 'typ':'verifystartOtp'})
print res0.json()


res1 = requests.post('http://localhost:8000/api/marketing/verifyOtp/', data={'id':dataPk, 'typ':'verifyendOtp'})
print res1.json()
