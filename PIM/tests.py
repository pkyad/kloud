from django.test import TestCase

# Create your tests here.

import requests

requests.post('https://ws.epsilonai.com/notify',
    json={
        'topic': "service.login.1234",
        'args': ["dasdas" , "fsdfsd"]
    } , verify=False
)