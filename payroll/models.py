# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
from finance.models import Account
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models.signals import post_save
# Create your models here.
from ERP.models import Division

def getDocsPath(instance , filename ):
    return 'payroll/advances/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user, filename)

def getInvsPath(instance , filename ):
    return 'payroll/advances/invoice/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user, filename)


class payroll(models.Model):
    user = models.ForeignKey(User , related_name = "payrollAuthored" , null=False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    hra = models.PositiveIntegerField(null = True)
    special = models.PositiveIntegerField(null = True)
    lta = models.PositiveIntegerField(null = True)
    basic = models.PositiveIntegerField(null = True)
    PFUan = models.CharField(max_length = 50,null = True)
    pan = models.CharField(max_length = 30 , null = True)
    taxSlab = models.PositiveIntegerField(default=10)
    adHoc = models.PositiveIntegerField(null = True)
    policyNumber = models.CharField(null = True , max_length = 50)
    provider = models.CharField(max_length = 30 , null = True)
    amount = models.PositiveIntegerField(null = True)
    noticePeriodRecovery = models.BooleanField(default=False)
    al = models.PositiveIntegerField(null = True)
    ml = models.PositiveIntegerField(null = True)
    alCurrMonthLeaves = models.PositiveIntegerField(null = True , default = 0)
    mlCurrMonthLeaves = models.PositiveIntegerField(null = True , default = 0)
    adHocLeaves = models.PositiveIntegerField(null = True)
    joiningDate = models.DateField(null = True)
    off = models.BooleanField(default=True)
    accountNumber = models.CharField(null = True , max_length = 40)
    ifscCode = models.CharField(max_length = 30 , null = True)
    bankName = models.CharField(max_length = 30 , null = True)
    deboarded = models.BooleanField(default = False)
    lastWorkingDate = models.DateField(null = True)
    alHold = models.PositiveIntegerField(default=0)
    mlHold = models.PositiveIntegerField(default=0)
    adHocLeavesHold = models.PositiveIntegerField(default=0)
    notice = models.PositiveIntegerField(null=True , default=0)
    probation = models.PositiveIntegerField(null=True , default=0)
    probationNotice = models.PositiveIntegerField(null=True , default=0)
    pfAccNo = models.CharField(max_length = 20 , null = True)
    pfUniNo = models.CharField(max_length = 200 , null = True)
    pfAmnt = models.PositiveIntegerField(null=True , default=0)
    esic = models.CharField(max_length = 20 , null = True)
    esicAmount = models.FloatField(null=False , default=0)
    pTax = models.FloatField(null=False , default=0)
    bonus = models.FloatField(null=False , default=0)
    pfAdmin = models.FloatField(null=False , default=0)
    esicAdmin = models.FloatField(null=False , default=0)
    ctc = models.FloatField(null=False , default=0)
    activatePayroll = models.BooleanField(default = False)
    isOwnHouse = models.BooleanField(default=False)
    isExtraIncome = models.BooleanField(default=False)
    isRentedHouse = models.BooleanField(default=False)
User.payroll = property(lambda u : payroll.objects.get_or_create(user = u)[0])

class PayrollLogs(models.Model):
    created = models.DateField(auto_now=True)
    createdUser = models.ForeignKey(User , related_name = "payrollLogsCreated")
    user = models.ForeignKey(User , related_name = "userPayrollLogs")
    oldHra =  models.PositiveIntegerField(null = True)
    newHra =  models.PositiveIntegerField(null = True)
    oldspecial =  models.PositiveIntegerField(null = True)
    newspecial =  models.PositiveIntegerField(null = True)
    oldLta =  models.PositiveIntegerField(null = True)
    newLta =  models.PositiveIntegerField(null = True)
    oldBasic =  models.PositiveIntegerField(null = True)
    newBasic =  models.PositiveIntegerField(null = True)
    oldtaxSlab =  models.PositiveIntegerField(null = True)
    newtaxSlab =  models.PositiveIntegerField(null = True)
    oldadHoc =  models.PositiveIntegerField(null = True)
    newadHoc =  models.PositiveIntegerField(null = True)
    oldAl =  models.PositiveIntegerField(null = True)
    newAl =  models.PositiveIntegerField(null = True)
    oldml =  models.PositiveIntegerField(null = True)
    newml =  models.PositiveIntegerField(null = True)
    oldadHocLeav =  models.PositiveIntegerField(null = True)
    newadHocLeav =  models.PositiveIntegerField(null = True)
    oldpfAmount =  models.PositiveIntegerField(null = True)
    newpfAmount =  models.PositiveIntegerField(null = True)


PAYROLL_REPORT_STATUS_CHOICE = (
    ('draft' , 'draft'),
    ('final' , 'final'),
    ('paid' , 'paid'),
)

class PayrollReport(models.Model):
    user = models.ForeignKey(User , related_name = "payrollReportsCreated" , null=False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    month = models.PositiveIntegerField(null = False)
    year = models.PositiveIntegerField(null = False)
    total = models.PositiveIntegerField(null = True)
    totalTDS = models.PositiveIntegerField(null = True)
    status = models.CharField(max_length = 30 , default = 'draft' , choices = PAYROLL_REPORT_STATUS_CHOICE)
    dateOfProcessing = models.DateField(null = True)
    pfReserved = models.FloatField(default = 0)
    payable = models.FloatField(default = 0)
    pfContribution = models.FloatField(default = 0)

    class Meta:
        unique_together = ('year', 'month',)

class Payslip(models.Model):
    user = models.ForeignKey(User , related_name = "payslipsUsers" , null=False)
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    month = models.PositiveIntegerField(null = False)
    year = models.PositiveIntegerField(null = False)
    report = models.ForeignKey(PayrollReport , related_name = "payslips" , null = True)
    days = models.PositiveIntegerField(default = 0)
    deffered = models.BooleanField(default = False)
    miscellaneous = models.FloatField(default=0)
    totalPayable = models.FloatField(default = 0)
    reimbursement = models.PositiveIntegerField(default = 0)
    grandTotal = models.FloatField(default = 0)
    amount = models.FloatField(default = 0)
    pfAmnt =  models.FloatField(default = 0)
    pfAdmin =  models.FloatField(default = 0)
    tds = models.FloatField(default = 0)
    advanceIds = models.CharField(max_length = 100 , null = True)
    advanceDeduction =  models.FloatField(default = 0)
    class Meta:
        unique_together = ('year', 'month', 'user')



ADVANCE_TYPE_CHOICE = (
    ('SALARY_ADVANCE' , 'SALARY_ADVANCE'),
    ('PROJECT_ADVANCE' , 'PPROJECT_ADVANCE'),

    )

class Advances(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name = "lender" , null=False)
    returnMethod = models.CharField(max_length = 30 , choices = ADVANCE_TYPE_CHOICE , default = 'SALARY_ADVANCE')
    amount =  models.FloatField(default = 0)
    balance =  models.FloatField(default = 0)
    settled = models.BooleanField(default = False)
    document = models.FileField(upload_to = getDocsPath ,  null = True , blank = True)
    dateOfReturn = models.DateField(null = True)
    reason = models.TextField(max_length=400 , null=True)
    division = models.ForeignKey(Division , related_name = 'advances' , null = True)

class MonthlyPayslip(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User , related_name = "payslipUser" , null=True)
    month = models.CharField(max_length = 100 , null = False)
    year = models.CharField(max_length = 100 , null = False)
    basicSalary = models.CharField(max_length = 100 , null = False)
    hra = models.CharField(max_length = 100 , null = False)
    special = models.PositiveIntegerField(null = True)
    lta = models.PositiveIntegerField(null = True)
    taxSlab = models.PositiveIntegerField(default=10)
    adHoc = models.PositiveIntegerField(null = True)
    conveyance = models.CharField(max_length = 100 , null = False)
    convRemiburse = models.CharField(max_length = 100 , null = False)
    medRemiburse = models.CharField(max_length = 100 , null = False)
    empPF = models.CharField(max_length = 100 , null = False)
    otherEarnings = models.CharField(max_length = 100 , null = False)
    ta = models.CharField(max_length = 100 , null = False)
    da = models.CharField(max_length = 100 , null = False)
    spFund = models.CharField(max_length = 100 , null = False)
    ptDeduction = models.CharField(max_length = 100 , null = False)
    ioLoan = models.CharField(max_length = 100 , null = False)
    otherDeductions = models.CharField(max_length = 100 , null = False)
    totalEarnings = models.CharField(max_length = 100 , null = False)
    totalDeduction = models.CharField(max_length = 100 , null = False)
    netpay = models.CharField(max_length = 100 , null = False)
    pfAmnt = models.PositiveIntegerField(null=True , default=0)
    esicAmount = models.FloatField(null=False , default=0)
    pTax = models.FloatField(null=False , default=0)
    bonus = models.FloatField(null=False , default=0)
    miscellaneous = models.FloatField(null=False , default=0)
    earnings = models.FloatField(null=False , default=0)
    deduction = models.FloatField(null=False , default=0)
    contribution = models.FloatField(null=False , default=0)
    pfAdmin = models.FloatField(null=False , default=0)
    esicAdmin = models.FloatField(null=False , default=0)

    class Meta:
        unique_together = ('year', 'month', 'user')


class ITDecaration(models.Model):
    user =  models.ForeignKey(User , related_name = "itdeclarationUser" , null=True)
    year = models.CharField(max_length = 100 , null = True)
    month = models.CharField(max_length = 100 , null = True)
    title = models.CharField(max_length = 1000 , null = True)
    group_name = models.CharField(max_length = 100 , null = True)
    limit = models.FloatField(null=False , default=0)
    amount = models.FloatField(null=False , default=0) # income/loss of let our property and total amount of all other
    section  = models.CharField(max_length = 100 , null = True)
    polarity = models.IntegerField(default = 0)
    annualRent = models.FloatField(null=False , default=0)
    muncipalTax = models.FloatField(null=False , default=0)
    unrealizedTax = models.FloatField(null=False , default=0)
    netAnnualValue = models.FloatField(null=False , default=0)
    standardDeduction = models.FloatField(null=False , default=0)
    interestOnLoan = models.FloatField(null=False , default=0)
    eligibleAmount =  models.FloatField(null=False , default=0)
    tenantName = models.CharField(max_length = 1000 , null = True) #tenant name for housepro / owner name for excemptn
    tenantPan = models.CharField(max_length = 1000 , null = True) #tenant pan for housepro / owner pan for excemptn
    address = models.CharField(max_length = 1000 , null = True)

# @receiver(signal=post_save, sender=ITDecaration)
# def model_post_save(sender, instance, created, **kwargs):
#     print 'kddddddddddddddd'
#     from itDeclarationCalc import *
#     CalculateItDeclaration(instance.year, instance.user)


class Form16(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user =  models.ForeignKey(User , related_name = "formUsers" , null=True)
    year = models.CharField(max_length = 100 , null = True)
    period = models.CharField(max_length = 100 , null = True)
    file = models.FileField(upload_to = getDocsPath ,  null = True , blank = True)
