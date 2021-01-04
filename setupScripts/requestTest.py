import requests

endpoint = 'https://whm.klouderp.com:2087/json-api/addzonerecord?api.version=1&domain=klouderp.com&name=test2.klouderp.com&class=IN&ttl=14400&type=A&address=3.7.55.23'

res = requests.get(endpoint , headers = {'Authorization' : 'whm kloud:H5T3Y0C6ARTEVM7JX83GX3J5SVOEY97C'}, verify = False)

print res
print res.text

#
# # domain = "pradeepyadav.net"
# domain = "127.0.0.1:8000"
#
# csrf = "To3IoORNjW83pUxb4HXrj6cR8Zm6bL08HJ2cTc9NDAtn2k4sduURFgg7SitjvLcG"
# session = "5jti9lhjlckts4wk7uvnzenu79bjk8en"
#
# url = "http://" +domain+ "/api/HR/users/1/"
#
# jar = requests.cookies.RequestsCookieJar()
# jar.set('sessionid', session, domain=domain, path='/')
# jar.set('csrftoken', csrf, domain=domain, path='/')
#
# headerName = "X-CSRFToken"
#
# headers = {headerName: csrf }
#
# r = requests.patch(url , data = {'oldPassword':'indiaerp','password': 'indiaerp'}, cookies = jar , headers = headers)
# print r.text
#
