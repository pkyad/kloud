from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from  HR.serializers import userSearchSerializer, userSerializer
from finance.serializers import AccountSerializer
from finance.models import Disbursal
import datetime
from django.db.models import Q, Sum

class payrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = payroll
        fields = ('pk','user','created','updated','hra','special','lta','basic','taxSlab','adHoc','policyNumber','provider','amount','noticePeriodRecovery','al','ml','adHocLeaves','joiningDate','off','accountNumber','ifscCode','bankName','deboarded','lastWorkingDate','alHold','mlHold','adHocLeavesHold','notice','probation','probationNotice','pan','pfAccNo','pfUniNo','pfAmnt','esic','esicAmount','pTax','bonus','pfAdmin','esicAdmin','ctc','PFUan','activatePayroll','alCurrMonthLeaves','mlCurrMonthLeaves','isExtraIncome' ,'isOwnHouse')

    def update(self ,instance, validated_data):
        print validated_data,'-------vvvvvv'
        for key in ['hra','special','lta','basic','taxSlab','adHoc','policyNumber','provider','amount','noticePeriodRecovery','al','ml','adHocLeaves','joiningDate','off','accountNumber','ifscCode','bankName','deboarded','lastWorkingDate','alHold','mlHold','adHocLeavesHold','notice','probation','probationNotice','pan','pfAccNo','pfUniNo','pfAmnt','esic','pfAdmin','esicAdmin','activatePayroll','isExtraIncome' ,'isOwnHouse']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        return instance

class payrollLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = payroll
        fields = ('pk','user', 'al','ml','adHocLeaves','joiningDate','lastWorkingDate','off','alHold','mlHold','adHocLeavesHold','pan','pfAccNo','pfUniNo','pfAmnt','esic','accountNumber','ifscCode','bankName',)

class PayrollLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollLogs
        fields=('pk','created','createdUser','user','oldHra','newHra','oldspecial','newspecial','oldLta','newLta','oldBasic','newBasic','oldtaxSlab','newtaxSlab','oldadHoc','newadHoc','oldAl','newAl','oldml','newml','oldadHocLeav','newadHocLeav','oldpfAmount','newpfAmount')
        read_only_fields = ('createdUser',)


class payslipSerializer(serializers.ModelSerializer):
    user = userSerializer(many = False , read_only = True)
    class Meta:
        model = Payslip
        fields = ('pk','user','month' , 'year' , 'report' , 'days' , 'deffered', 'miscellaneous' , 'totalPayable' , 'reimbursement' , 'grandTotal','amount','pfAmnt','pfAdmin','tds')
    def create(self , validated_data):
        pr = Payslip(**validated_data)
        if 'user' in self.context['request'].data:
            pr.user= User.objects.get(pk=int(self.context['request'].data['user']))
        pr.save()
        advObj = Advances.objects.filter(user = pr.user, settled = False, returnMethod = 'SALARY_ADVANCE')
        advanceDeductiontot = advObj.aggregate(tot = Sum('amount'))
        if advanceDeductiontot['tot'] is not None:
            pr.advanceDeduction = advanceDeductiontot['tot']
        advanceIds = ''
        for a in advObj:
            advanceIds + str(a.pk)+','
            a.settled = True
            a.balance = 0
            a.save()
        pr.advanceIds = advanceIds
        pr.save()
        return pr
    def update(self , instance , validated_data):
        for key in ['month' , 'year' , 'report' , 'days' , 'deffered', 'miscellaneous' , 'totalPayable' , 'reimbursement' , 'grandTotal','amount','pfAmnt','pfAdmin','tds']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'user' in self.context['request'].data:
            instance.user= User.objects.get(pk=int(self.context['request'].data['user']))
        instance.save()
        return instance


class payslipLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = ('pk','user','month' , 'year' , 'report' , 'days' , 'deffered', 'miscellaneous' , 'totalPayable' , 'reimbursement' , 'grandTotal','amount','pfAmnt','pfAdmin')

class payrollReportSerializer(serializers.ModelSerializer):
    payslips = payslipSerializer(many=True , read_only=True)
    class Meta:
        model = PayrollReport
        fields = ('pk','user', 'created','updated','total','month','year','totalTDS','status','dateOfProcessing','payslips','pfReserved','payable' ,'pfContribution')
        read_only_fields = ('user',)

    def create(self , validated_data):
        pr = PayrollReport(**validated_data)
        pr.user = self.context['request'].user
        pr.save()
        return pr


class advancesSerializer(serializers.ModelSerializer):
    user = userSerializer(many = False , read_only = True)
    # settlementUser = userSearchSerializer(many = False , read_only = True)
    # approvers = userSearchSerializer(many = True , read_only = True)
    class Meta:
        model = Advances
        fields = ('pk','created' , 'returnMethod' , 'amount' , 'balance' , 'settled' , 'document' , 'dateOfReturn' , 'reason','user')
    def create(self , validated_data):
        adv = Advances(**validated_data)
        adv.user = User.objects.get(pk = self.context['request'].data['user'])
        adv.division =  self.context['request'].user.designation.division
        adv.balance = adv.amount
        adv.save()
        try:
            today = datetime.datetime.today()
            transObj = Disbursal.objects.create(sourcePk = adv.pk , amount = adv.amount , date = today , source = 'ADVANCED', division = self.context['request'].user.designation.division)
            transObj.narration = 'Advance ' + str(round(float(adv.amount))) +' Rs , ' + str(transObj.date.strftime("%B")) + '-' + str(transObj.date.year)
            transObj.save()
        except:
            pass
        return adv
    # def update(self , instance , validated_data):
    #     for key in [ 'returnMethod' , 'amount' , 'balance' , 'settled' , 'document' , 'dateOfReturn' , 'reason']:
    #         try:
    #             setattr(instance , key , validated_data[key])
    #         except:
    #             pass
    #     if 'approvers' in self.context['request'].data:
    #         instance.approvers.add(User.objects.get(pk = int(self.context['request'].data['approvers'])))
    #     if 'settlementUser' in self.context['request'].data:
    #         instance.settlementUser = User.objects.get(pk=int(self.context['request'].data['settlementUser']))
    #     instance.save()
    #     return instance


import datetime
def getCurrentYear():
    today = datetime.date.today()
    currentMonth = today.month
    currentYear= today.year
    if currentMonth>3:
        financialYear = str(currentYear)+ '-' +str(currentYear+1)
    else:
        financialYear = str(currentYear-1)+ '-' + str(currentYear)
    return financialYear

class ITDecarationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ITDecaration
        fields=('pk','title','amount','limit','group_name')
    def create(self , validated_data):
        i = ITDecaration(**validated_data)
        i.year = getCurrentYear()
        i.user = self.context['request'].user
        i.save()
        from itDeclarationCalc import *
        CalculateItDeclaration(i.year, i.user)
        return i
    def update(self , instance , validated_data):
        for key in ['amount']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        from itDeclarationCalc import *
        CalculateItDeclaration(instance.year, instance.user)
        instance.save()
        return instance


class ITDecarationAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = ITDecaration
        fields=('pk','title','amount','annualRent','muncipalTax','unrealizedTax','netAnnualValue','standardDeduction','interestOnLoan','tenantName','tenantPan','address','eligibleAmount')


class Form16Serializer(serializers.ModelSerializer):
    user = userSearchSerializer(many = False , read_only = True)
    class Meta:
        model = Form16
        fields=('pk','created','user','year','period','file')
    def create(self , validated_data):
        i = Form16(**validated_data)
        if 'user' in self.context['request'].data:
            i.user = User.objects.get( pk = int(self.context['request'].data['user']))
        i.save()
        return i
