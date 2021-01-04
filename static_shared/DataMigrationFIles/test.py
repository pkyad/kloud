import requests
import json

url = 'https://essgi.cioc.in/api/clientRelationships/contact/?=&name__icontains=&limit=4'

headers = {
        "Cookie" :"csrftoken=GM6lsSL1zi6VadTB4AwIjCeXt6hUPplKOopDQnX4mXRUQbLcuVD7BSo11cRoC9HW; sessionid=ev5q6p1vyobiphrc16io5c2pej75cseq",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'https://essgi.cioc.in',
        'X-CSRFToken': 'GM6lsSL1zi6VadTB4AwIjCeXt6hUPplKOopDQnX4mXRUQbLcuVD7BSo11cRoC9HW'
      }

r = requests.get(url,headers=headers)


# print r.json()


# getting master sheet data
masterSheetURL = 'https://essgi.cioc.in/api/finance/inventory/'
r = requests.get(masterSheetURL,headers=headers)
# print r.json()
#
#
json_object = json.dumps(r.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_inventory.json", "w") as outfile:
    outfile.write(json_object)

# getting crm term and condition data
crmtermsAndConditionsURL = 'https://essgi.cioc.in/api/clientRelationships/crmtermsAndConditions/?division=2'
r = requests.get(crmtermsAndConditionsURL,headers=headers)
print r.json()
#
#
json_object = json.dumps(r.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_crmtermsAndConditions.json", "w") as outfile:
    outfile.write(json_object)

# getting companyData data
companyURL = 'https://essgi.cioc.in/api/ERP/service/'
companyData = requests.get(companyURL,headers=headers)
print companyData.json()
#
#
json_object = json.dumps(companyData.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_company.json", "w") as outfile:
    outfile.write(json_object)

# getting contact data
contactURL = 'https://essgi.cioc.in/api/clientRelationships/contact/'
contactData = requests.get(contactURL,headers=headers)
print contactData.json()
#
#
json_object = json.dumps(contactData.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_contacts.json", "w") as outfile:
    outfile.write(json_object)

# getting contact data
contractURL = 'https://essgi.cioc.in/api/clientRelationships/contract/'
contractData = requests.get(contractURL,headers=headers)
print contractData.json()
#
#
json_object = json.dumps(contractData.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_contracts.json", "w") as outfile:
    outfile.write(json_object)

# getting expense sheet data
expenseSheetURL = 'https://essgi.cioc.in/api/finance/expenseSheet/'
expenseSheetData = requests.get(expenseSheetURL,headers=headers)
print expenseSheetData.json()
#
#
json_object = json.dumps(expenseSheetData.json(), indent = 4)
#
# # Writing to sample.json
with open("expenseSheetData.json", "w") as outfile:
    outfile.write(json_object)

# getting expense sheet data
expenseURL = 'https://essgi.cioc.in/api/finance/invoices/'
expenseData = requests.get(expenseURL,headers=headers)
print expenseData.json()
#
#
json_object = json.dumps(expenseData.json(), indent = 4)
#
# # Writing to sample.json
with open("expenseData.json", "w") as outfile:
    outfile.write(json_object)

# getting expense sheet data
userURL = 'https://essgi.cioc.in/api/HR/users/'
userData = requests.get(userURL,headers=headers)
print userData.json()
#
#
json_object = json.dumps(userData.json(), indent = 4)
#
# # Writing to sample.json
with open("essgi_user.json", "w") as outfile:
    outfile.write(json_object)
