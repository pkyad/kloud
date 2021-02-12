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
# myobj = {'username' : 'ankiddrar','first_name' : 'Ankitra','last_name' : 'Kadam','email' : 'antddaka.rar@aaa.in','applist' : ['app.messenger', 'app.catalogmaker','app.sales','app.chatbot','app.website']}
#
# x = requests.post(url, json = myobj)
#
# #print the response text (the content of the requested file):
#
# print(x.text)
