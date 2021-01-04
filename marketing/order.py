from django.contrib.auth.models import User, Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from marketing.models import TourPlan, TourPlanStop, Contacts
from finance.models import Sale,SalesQty
from assets.models import Asset, AssetAddon
asset = 1
addon = 1
print asset

orderObj ={
'contact' :'',
'tourPlan' :'',
'products':[{ 'qty' : 1 , 'asset' : '' , 'assetPk' : '', 'addonPk' : ''}],
'amc' : 'applicable'
}
# contact = Contacts.objects.get(pk = 1)
# tourplan = TourPlanStop.objects.get(pk = 1)

def genOrder(request):
    products = request.data['products']
    price = 0
    totalTax = 0
    print request.user
    contact = Contacts.objects.get(pk = request.data['contact'])
    tourplan = TourPlanStop.objects.get(pk = request.data['tourplan'])
    invoicePk = None
    try:
        invoicePk = tourplan.invoice.pk
    except:
        pass

    print invoicePk, 'invoicePk'
    dated = datetime.date.today()
    data = {'personName':contact.name,'phone' : contact.mobile , 'email': contact.email ,'address': contact.addrs , 'pincode': contact.pinCode  ,'state': contact.state ,'city':  contact.city,'country': contact.country , 'user' : request.user, 'recDate': dated }
    if invoicePk is not None:
        invObj = OutBoundInvoice.objects.get(pk=invoicePk)
        invObj.personName = data['personName']
        invObj.phone = data['phone']
        invObj.email = data['email']
        invObj.address = data['address']
        invObj.pincode = data['pincode']
        invObj.state = data['state']
        invObj.city = data['city']
        invObj.country = data['country']
        invObj.user = data['user']
        invObj.recDate = data['recDate']
        invObj.poNumber = invObj.pk
        invObj.save()

    else:
        invObj = OutBoundInvoice(**data)
        invObj.poNumber = invObj.pk
        invObj.save()

    try:
        ordetQtyMap = OutBoundInvoiceQty.objects.filter(outBound = invObj)
        for orderQty in ordetQtyMap:
            checkinObj = Checkin.objects.get(usedIn=orderQty)
            print checkinObj, 'checkinObj'
            checkinObj.checkout = False
            checkinObj.usedIn = None
            checkinObj.save()
        ordetQtyMap.delete()
    except:
        pass
    for i in products:
        if 'amc' in request.data:
            assetObj = Asset.objects.get(pk = i['asset'])
            checkinObj = Checkin.objects.filter(asset = assetObj, checkout = False, returned = False, to = request.user)
            for checkin in checkinObj:
                print checkin.price
            if request.data['amc'] == 'applicable':
                if condition:
                    pass
                if addonObj.typ == 'monthly':
                    times = 12
                if addonObj.typ == 'yearly':
                    times = 1
                if addonObj.typ == 'half-yearly':
                    times = 2
                if addonObj.typ == 'quarterly':
                    times = 4
                tot_times = times * addonObj.period
                for i in range(0, tot_times):
                    pass
                if assetObj.primary:
                    for j in range(int(i['quantity'])):
                        print j, 'jjjjjjj'
                        print checkinObj[j].price, 'checkinObj.price'
                        price+=checkinObj[j].price
                        taxRate = 0
                        if assetObj.taxPercentage is not None:
                            taxRate = assetObj.taxPercentage
                        taxPrice = (checkinObj[j].price*taxRate)/100
                        totalTax += taxPrice
                        price+=taxPrice
                        subtotal = checkinObj[j].price + taxPrice
                        outData = {'product' : assetObj.name , 'qty' : 1,'price' : checkinObj[j].price ,'tax':taxPrice, 'total' : subtotal , 'outBound' : invObj}
                        outObj = OutBoundInvoiceQty(**outData)
                        outObj.save()
                        try:
                            check = checkinObj[j]
                            check.checkout = True
                            check.name = contact.name
                            check.email = contact.email
                            check.phone = contact.mobile
                            check.address = contact.addrs
                            check.usedIn = outObj
                            check.save()
                        except:
                            print "Trying to add a non assigned asset in the invoice"
                            pass
                else:
                    for j in range(int(i['quantity'])):
                        print j, 'jjjjjjj'
                        print checkinObj[j].price, 'checkinObj.price'
                        price+=0
                        outData = {'product' : assetObj.name , 'qty' : 1,'price' : 0 ,'tax':0, 'total' : 0 , 'outBound' : invObj}
                        outObj = OutBoundInvoiceQty(**outData)
                        outObj.save()
                        try:
                            check = checkinObj[j]
                            check.checkout = True
                            check.name = contact.name
                            check.email = contact.email
                            check.phone = contact.mobile
                            check.address = contact.addrs
                            check.usedIn = outObj
                            check.save()
                        except:
                            print "Trying to add a non assigned asset in the invoice"
                            pass

            elif request.data['amc'] == 'notapplicable':

                print request.data['amc'],'request.data'
                for j in range(int(i['quantity'])):
                    print j, 'jjjjjjj'
                    print checkinObj[j].price, 'checkinObj.price'
                    price+=checkinObj[j].price

                    taxRate = 0
                    if assetObj.taxPercentage is not None:
                        taxRate = assetObj.taxPercentage
                    taxPrice = (checkinObj[j].price*taxRate)/100
                    totalTax += taxPrice
                    price+=taxPrice

                    subtotal = checkinObj[j].price + taxPrice
                    outData = {'product' : assetObj.name , 'qty' : 1,'price' : checkinObj[j].price ,'tax':taxPrice, 'total' :subtotal  , 'outBound' : invObj}
                    outObj = OutBoundInvoiceQty(**outData)
                    outObj.save()
                    try:
                        check = checkinObj[j]
                        check.checkout = True
                        check.name = contact.name
                        check.email = contact.email
                        check.phone = contact.mobile
                        check.address = contact.addrs
                        check.usedIn = outObj
                        check.save()
                    except:
                        print "Trying to add a non assigned asset in the invoice"
                        pass

    invObj.total = price
    invObj.totalGST = totalTax
    invObj.save()
    tourplan.invoice = invObj
    tourplan.save()
    data = OutBoundInvoiceLiteSerializer(invObj, many=False).data
