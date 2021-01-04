# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

# Create your tests here.

import requests


data = {
    'user'  : 54,
    'title' : 'Facebook - Mozzila Firefox',
    'token' : 'titan@1234'
}
res = requests.post('http://localhost:8000/api/employees/systemLog/' , data = data)

print res.text
