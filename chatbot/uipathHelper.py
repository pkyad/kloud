import requests
import json

def uiPathToken(username, password , tenant , url):
    # username=username
    # password=password
    # tenancy=tenant
    # PARAMS = {'tenancyName':tenancy,"usernameOrEmailAddress":username,"password":password}
    # print(PARAMS)
    # r = requests.post(url = url + "/api/Account/Authenticate",data=PARAMS)
    # print r.json()
    # tokenobj=json.loads(r.text)
    # tokenobj=tokenobj["result"]

    grant_type="refresh_token"
    client_id= username
    refresh_token= password
    PARAMS = {'refresh_token':refresh_token,"grant_type":grant_type,"client_id":client_id}
    print(PARAMS)
    r = requests.post(url = "https://account.uipath.com/oauth/token",data=PARAMS)
    print r , r.text
    tokenobj=json.loads(r.text)
    tokenobj=tokenobj["access_token"]



    return tokenobj

def ReleasekeyGet(session , name, tenant , url , orgID):
    print  url +  "odata/Releases"
    headers = {"Authorization" : "Bearer " + session , "X-UIPATH-TenantName":  tenant}
    if orgID is not None:
        headers["X-UIPATH-OrganizationUnitId"] = orgID

    rels = requests.get( url +  "odata/Releases" , headers = headers)
    resobj=json.loads(rels.text)
    print resobj
    relKey=resobj['value']
    print "relKey: " , relKey , '============' , name
    keys=[]
    for i in relKey:
        if i['ProcessKey'] == name:
            return i['Key']
