from django.db.models import Q, Sum
from payroll.models import ITDecaration
import datetime
from payroll.serializers import ITDecarationSerializer

def CalculateItDeclaration(year, user):

    itObj = ITDecaration.objects.filter(user = user, year = year)
    # monthList =  ['April' , 'May' , 'June' , 'July' , 'Aug' , 'Sept' , 'Oct' , 'Nov' , 'Dec' , 'Jan' , 'Feb' , 'March']
    # income Calculation
    totalCTC = 0
    totalCTCObj = itObj.filter(month__isnull = True, group_name = 'income').exclude(title="PF (Company)").aggregate(tot = Sum('amount'))
    pfAdmin = itObj.get(month__isnull = True, group_name = 'income', title="PF (Company)").amount
    if totalCTCObj['tot'] is not None:
        totalCTC = totalCTCObj['tot'] - pfAdmin

    #excemption calculation
    houseRent = 0
    lta = 0
    totalExcemption = 0
    excObj = itObj.filter(group_name = 'exemptions')
    houseRentObj = excObj.filter( title = 'House Rent Allowance Section 10 (13A)').aggregate(tot = Sum('amount'))
    if houseRentObj['tot'] is not None:
        houseRent = houseRentObj['tot']
    ltaObj = excObj.filter( title = 'Leave Travel Assistance Section 10(5)').aggregate(tot = Sum('amount'))
    if ltaObj['tot'] is not None:
        lta = ltaObj['tot']
    totalExcemption = houseRent + lta

    # income from other source calculation
    deduction = 0
    deductionSixAObj = itObj.filter(group_name = 'deductionvia', amount__gte = 0.0).aggregate(tot = Sum('amount'))
    if deductionSixAObj['tot'] is not None:
        deduction = deductionSixAObj['tot']

    # Income from other sources
    otherIncomes = 0
    otherIncomesObj =  itObj.filter(group_name = 'otherIncomes').aggregate(tot = Sum('amount'))
    if otherIncomesObj['tot'] is not None:
        otherIncomes = otherIncomesObj['tot']

    # Interest on housing Loan
    housingLoan = 0
    housingLoan =  itObj.filter(title = 'Housing Loan' , group_name = 'selfOccupied').last().amount

    #Income / Loss from let out property
    profitOrLoss = 0
    profitOrLossObj = itObj.filter(group_name = 'houseProperty').aggregate(tot = Sum('amount'))
    if profitOrLossObj['tot'] is not None:
        profitOrLoss = profitOrLossObj['tot']

    #Previous Employee Details
    prevEmpIncome = itObj.filter(group_name = 'previousEmployer' , title="Total Income").last().amount
    prevEmpTax = itObj.filter(group_name = 'previousEmployer' , title="Income Tax").last().amount
    # Total Taxable Income
    # Based on the total income your tax slab
    # Surcharge
    # health and eductaion Cess
    # totalTax


    total = float(totalCTC) - float(totalExcemption) - float(deduction) + float(otherIncomes) - float(housingLoan) + float(profitOrLoss)

    try:
        totalObj = itObj.get(group_name = 'FINAL TOTAL' , title = 'Total Taxable Income' , year = year)
        totalObj.amount = total
        totalObj.save()
    except:
        totalObj = ITDecaration.objects.create(group_name = 'FINAL TOTAL' , title = 'Total Taxable Income', amount = total , year = year ,user = user)

    tax = 0
    title = 'Based on the total income your tax slab is'
    if total<250000:
        tax = 0
        taxTitle = title+' 0%'
    if total>250000 and total<=500000:
        tax = (total*5)/100
        taxTitle = title+' 5%'
    if total>500000 and total<=750000:
        tax = (total*10)/100 + 12500
        taxTitle = title+' 10% + 12500'
    if total>750000 and total<=1000000:
        tax = (total*15)/100 + 37500
        taxTitle = title+' 15% + 37500'
    if total>1000000 and total<=1250000:
        tax = (total*20)/100 + 75000
        taxTitle = title+' 20% + 75000'
    if total>1250000 and total<=1500000:
        tax = (total*25)/100 + 125000
        taxTitle = title+' 25% + 125000'
    if total>1500000:
        tax = (total*30)/100 + 187500
        taxTitle = title+' 30% + 187500'


    try:
        taxObj = itObj.get(group_name = 'FINAL TOTAL' , title__icontains = title , year = year)
        taxObj.amount = tax
        taxObj.title = taxTitle
        taxObj.save()
    except:
        taxObj = ITDecaration.objects.create(group_name = 'FINAL TOTAL' , title = taxTitle, amount = tax , year = year ,user = user)


    healthTax = (tax*4)/100
    try:
        healthTaxObj = itObj.get(group_name = 'FINAL TOTAL' , title = 'Health and Eductaion Cess' , year = year)
        healthTaxObj.amount = healthTax
        healthTaxObj.save()
    except:
        healthTaxObj = ITDecaration.objects.create(group_name = 'FINAL TOTAL' , title = 'Health and Eductaion Cess', amount = healthTax , year = year ,user = user)


    totalTax = tax + healthTax
    try:
        totalTaxObj = itObj.get(group_name = 'FINAL TOTAL' , title = 'Total Tax' , year = year)
        totalTaxObj.amount = totalTax
        totalTaxObj.save()
    except:
        totalTaxObj = ITDecaration.objects.create(group_name = 'FINAL TOTAL' , title = 'Total Tax', amount = totalTax , year = year ,user = user)

    totalData =  ITDecarationSerializer(ITDecaration.objects.filter(group_name = 'FINAL TOTAL' , year = year ,user = user) , many = True).data


    return totalData




def calculateExcemption(year, user):
    monthsList = ['April' , 'May' , 'June' , 'July' , 'Aug' , 'Sept' , 'Oct' , 'Nov' , 'Dec' , 'Jan' , 'Feb' , 'March']
    excemptionObj = ITDecaration.objects.filter(user = user, year = year, group_name = 'exemptions')
    exctitleUniq = excemptionObj.values_list('title', flat = True).distinct()
    excallData = []
    currentMonth = datetime.date.today().month - 3
    if currentMonth<0:
        currentMonth = 12 + currentMonth
    for t in exctitleUniq:
        excmontlyData = {}
        count = 0
        for m in monthsList:
            count+=1
            val = excemptionObj.get(title = t, month = m)
            excmontlyData[m] = {'amount' : val.amount , 'pk' : val.pk}
            if count<currentMonth:
                excmontlyData[m]['canEdit'] = False
            else:
                excmontlyData[m]['canEdit'] = True
        excallData.append({'title' : t , 'data' : excmontlyData})
    excmontlyData ={}
    for j in monthsList:
        totaData = 0
        try:
            totaData = excemptionObj.get(month = j, title = 'House Rent Allowance Section 10 (13A)').amount +   excemptionObj.get(month = j, title = 'Leave Travel Assistance Section 10(5)').amount
            excmontlyData[j] = {'amount' : totaData }
        except:
            pass
    excallData.append({'title' : 'Total Exemptions' , 'data' : excmontlyData})
    data = { 'data' : excallData}
    return data
