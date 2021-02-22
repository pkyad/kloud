# from django.test import TestCase

# Create your tests here.

import json




# from zoomus import ZoomClient
#
# client = ZoomClient('d2hhckCSrKTvNBbKPJfKA', 'rWZGUb5vleGbHf7Phm7ITNPSBGFBuogI')
#
# user_list_response = client.user.list()
# print (user_list_response)
# user_list = json.loads(user_list_response.content)
#
# for user in user_list['users']:
#     user_id = user['id']
#     print(json.loads(client.meeting.list(user_id=user_id).content))



# import requests
#
# url = 'http://localhost:8000/api/ERP/addNewUser/'
# myobj = {'username' : 'neeluaa','first_name' : 'Neelu','last_name' : 'Singh','email' : 'neeluaa.s@aaa.in','applist' : ['app.messenger', 'app.catalogmaker','app.sales','app.chatbot','app.website'],'type':'chatbot'}
#
# x = requests.post(url, json = myobj)
#
# #print the response text (the content of the requested file):
#
# print(x.text)

from Crypto.Cipher import AES
import base64

obj = AES.new('This is a key123', AES.MODE_CBC, 'This is an IV456')
message = "The answer is no"
ciphertext = obj.encrypt(message)
encoded_cipher = base64.b64encode(ciphertext)
print encoded_cipher
data = obj.decrypt(encoded_cipher)
print data
