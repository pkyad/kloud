from ERP.models import *
from finance.models import *

def CreateUnit(val):
    if 'division_pk' in val:
        division = Division.objects.get(pk = val['division_pk'] )
        unitObj = Unit.objects.create(name = 'HQ' , address = 'Address Not Available' , city = 'NA' , state = 'NA' , country = 'NA' , pincode= 'NA' , division = division , areaCode= division.name + str(division.pk) )
        response = {'unit' : unitObj.pk}
        return response


def helperCreateUser(name,email):
    division = Division.objects.create(name = name,website = 'NA',pan = 'NA',cin = 'NA')
    unit = Unit.objects.create(name = 'HQ' , address = 'Address Not Available' , city = 'NA' , state = 'NA' , country = 'NA' , pincode= 'NA' , division = division ,  areaCode= division.name + str(division.pk) , email  = email )
    response = {'division' : division.pk , 'unit' : unit.pk}
    return response


def CreateBankAccount(div):
    division = Division.objects.get(pk = div)
    accountObj = Account.objects.filter(group='profit and loss', division = division)
    if len(accountObj)<=0:
        dataVal = [
        {'title':'Markup Income','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Retail Sales','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Service','heading':'income','group':'profit and loss','is_lock':False},
        {'title':'Cost of Goods Sold','heading':'sale','group':'profit and loss','is_lock':False},
        {'title':'Payroll Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Bank Service Charges','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Insurance','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Interest Expense','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Job Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Mileage Reimbursement','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Professional Fees','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Rent','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Repairs','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Tools and Misc.Equipment','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Uncategorized Expenses','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Utilities','heading':'expense','group':'profit and loss','is_lock':False},
        {'title':'Misc Income','heading':'otherIncome','group':'profit and loss','is_lock':False},
        ]
        for i in dataVal:
            obj = Account.objects.create(**i)
            obj.division = division
            obj.is_lock = True
            obj.save()
    return {'status':'created'}

    # http://localhost:8000/api/finance/accountLite/?personal=false&heading=income


def CreateCostCenter(div):
    division = Division.objects.get(pk = int(div))
    cost = CostCenter.objects.create(name = 'Default Cost Center', division = division)
    return {'pk':cost.pk}
