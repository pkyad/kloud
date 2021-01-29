import requests
import json
from django.contrib.auth.models import User , Group
from datetime import datetime, date
# ------------------------------------------------Create Meeting -------------------------------------------
def  CreateMeeting(calendarObj):
    UserId = calendarObj.user.email
    Token = str(calendarObj.zoomcode)

    payload ={"topic": calendarObj.text,"start_time":str(calendarObj.when) ,"duration": calendarObj.duration,"timezone": "Asia/Calcutta","password": "","agenda":calendarObj.text}
    # print type(PARAMS)
    r = requests.post(url = "https://api.zoom.us/v2/users/"+UserId+"/meetings", headers = {"Authorization" : "Bearer " + Token,  'content-type': "application/json"} ,params = json.dumps(payload))
    # print json.loads(r.text)


# -------------------------------------------------List Of Meeting -------------------------------------------
def MeetingList():
    r = requests.get(url = "https://api.zoom.us/v2/users/"+UserId+"/meetings", headers = {"Authorization" : "Bearer " + Token })
    tokenobj=json.loads(r.text)
    print tokenobj


# -------------------------------------------------Delete Meeting -------------------------------------------
def DeleteMeeting():
    id = 96727776014
    r = requests.delete(url = "https://api.zoom.us/v2/meetings/"+str(id) , headers = {"Authorization" : "Bearer " + Token })
    print r
    print "Deleted Meeting meeting_id ="+str(id)


# --------------------------------------------------Get Meeting -------------------------------------------
def GetMeeting():
    id = 97914666740
    r = requests.get(url = "https://api.zoom.us/v2/meetings/"+str(id) , headers = {"Authorization" : "Bearer " + Token })
    tokenobj=json.loads(r.text)
    print tokenobj


# ---------------------------------------------------Update Meeting ----------------------------------------------------
def  UpdateMeeting():
    meeting_id = 92461114775

    payload ={"topic": "Demo2 EpsilonAI"}
    r = requests.patch(url = "https://api.zoom.us/v2/meetings/"+str(meeting_id), headers = {"Authorization" : "Bearer " + Token,  'content-type': "application/json"} ,data = json.dumps(payload))
    print r


if __name__ == '__main__':
    # UserId = "developer@epsilonai.com"
    # Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Ikp5cklhcm8zUVRLSGNNSF9KTmU4cmciLCJleHAiOjE2MDgwMzk3NTAsImlhdCI6MTYwODAzNDM1MH0.uGiXq77AwzcqDX8R4VNZOviNXefUK49Cp73Xz45CzSE"
    UserId = request.user.email
    Token = request.user.profile.zoom_token
    # CreateMeeting()
    #MeetingList()
    #DeleteMeeting()
    #GetMeeting()
    UpdateMeeting()
