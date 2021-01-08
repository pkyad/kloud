import requests
import json


headers = {
        "Cookie" :"csrftoken=c5OFi2Zj1WsOvPCZBtXS4th46jTWccbLPuKckFO98pjBtz5rdbJwct6y0YQHwdGw; sessionid=gmudui16mxf91ixcaux1jokdez3ev2v2",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'https://essgi.cioc.in',
        'X-CSRFToken': 'c5OFi2Zj1WsOvPCZBtXS4th46jTWccbLPuKckFO98pjBtz5rdbJwct6y0YQHwdGw'
      }

# getting customer data
masterSheetURL = 'https://bruderer.cioc.in/api/ERP/service/'
r = requests.get(masterSheetURL,headers=headers)
#
print r.json()
#
json_object = json.dumps(r.json(), indent = 4)
#
# # Writing to sample.json
with open("bruderer_service.json", "w") as outfile:
    outfile.write(json_object)

# getting vendor data
vendorData = 'https://bruderer.cioc.in/api/support/vendor/'
r = requests.get(vendorData,headers=headers)
print r.json()
#
#
json_object = json.dumps(r.json(), indent = 4)
#
# # Writing to sample.json
with open("bruderer_vendor.json", "w") as outfile:
    outfile.write(json_object)

# getting product data
productsURL = 'https://bruderer.cioc.in/api/support/products/'
productsData = requests.get(productsURL,headers=headers)
# print json.loads(str(productsData))
print productsData.json()
json_object = json.dumps(productsData.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_products.json", "w") as outfile:
    outfile.write(json_object)

# getting projects data
url = 'https://bruderer.cioc.in/api/support/projects/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_projects.json", "w") as outfile:
    outfile.write(json_object)

# getting BOM data
url = 'https://bruderer.cioc.in/api/support/bom/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_bom.json", "w") as outfile:
    outfile.write(json_object)

# getting Inventory data
url = 'https://bruderer.cioc.in/api/support/inventory/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
#
# # Writing to sample.json
with open("bruderer_inventory.json", "w") as outfile:
    outfile.write(json_object)

# getting material issue data
url = 'https://bruderer.cioc.in/api/support/materialqty/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_materialIssue.json", "w") as outfile:
    outfile.write(json_object)



# getting material issue main data
url = 'https://bruderer.cioc.in/api/support/material/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_materialIssueMain.json", "w") as outfile:
    outfile.write(json_object)


# getting stock summery report data
url = 'https://bruderer.cioc.in/api/support/stockSummaryReport/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_stockSummaryReport.json", "w") as outfile:
    outfile.write(json_object)

# getting projectStockSummary data
url = 'https://bruderer.cioc.in/api/support/projectStockSummary/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_projectStockSummary.json", "w") as outfile:
    outfile.write(json_object)

# getting invoice data
url = 'https://bruderer.cioc.in/api/support/invoice/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_invoice.json", "w") as outfile:
    outfile.write(json_object)

# getting invoice qty data
url = 'https://bruderer.cioc.in/api/support/invoiceQtyAll/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_invoiceQty.json", "w") as outfile:
    outfile.write(json_object)

# getting stock Check report data
url = 'https://bruderer.cioc.in/api/support/stockCheckReport/'
data = requests.get(url,headers=headers)
# print json.loads(str(productsData))
print data.json()
json_object = json.dumps(data.json(), indent = 4)
# #
# # Writing to sample.json
with open("bruderer_stockCheckReport.json", "w") as outfile:
    outfile.write(json_object)



# getting user data
userURL = 'https://bruderer.cioc.in/api/HR/users/'
userData = requests.get(userURL,headers=headers)
print userData.json()
#
#
json_object = json.dumps(userData.json(), indent = 4)
#
# # Writing to sample.json
with open("bruderer_user.json", "w") as outfile:
    outfile.write(json_object)
