# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-03 08:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import payroll.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Advances',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('typ', models.CharField(choices=[('advance', 'advance'), ('loan', 'loan')], max_length=30)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('reason', models.TextField(max_length=400, null=True)),
                ('amount', models.FloatField()),
                ('approved', models.BooleanField(default=False)),
                ('disbursed', models.BooleanField(default=False)),
                ('settled', models.BooleanField(default=False)),
                ('dateOfReturn', models.DateField(null=True)),
                ('tenure', models.PositiveIntegerField(default=1)),
                ('document', models.FileField(blank=True, null=True, upload_to=payroll.models.getDocsPath)),
                ('settlementDate', models.DateField(null=True)),
                ('returnBalance', models.FloatField(default=0, null=True)),
                ('modeOfReturn', models.CharField(choices=[('salary_deduct', 'salary_deduct'), ('cash', 'cash'), ('cheque', 'cheque'), ('online', 'online')], default='salary_deduct', max_length=30)),
                ('referenceNumber', models.CharField(max_length=50, null=True)),
                ('emiStartOffset', models.PositiveIntegerField(default=0)),
                ('emi', models.PositiveIntegerField(default=1)),
                ('invoice', models.FileField(blank=True, null=True, upload_to=payroll.models.getInvsPath)),
                ('invoiceAmt', models.FloatField(default=0, null=True)),
                ('loanStarted', models.BooleanField(default=False)),
                ('loanStartedDate', models.DateField(null=True)),
                ('approvers', models.ManyToManyField(blank=True, related_name='approvers', to=settings.AUTH_USER_MODEL)),
                ('settlementUser', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='settler', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Form16',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('year', models.CharField(max_length=100, null=True)),
                ('period', models.CharField(max_length=100, null=True)),
                ('file', models.FileField(blank=True, null=True, upload_to=payroll.models.getDocsPath)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='formUsers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ITDecaration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.CharField(max_length=100, null=True)),
                ('month', models.CharField(max_length=100, null=True)),
                ('title', models.CharField(max_length=1000, null=True)),
                ('group_name', models.CharField(max_length=100, null=True)),
                ('limit', models.FloatField(default=0)),
                ('amount', models.FloatField(default=0)),
                ('section', models.CharField(max_length=100, null=True)),
                ('polarity', models.IntegerField(default=0)),
                ('annualRent', models.FloatField(default=0)),
                ('muncipalTax', models.FloatField(default=0)),
                ('unrealizedTax', models.FloatField(default=0)),
                ('netAnnualValue', models.FloatField(default=0)),
                ('standardDeduction', models.FloatField(default=0)),
                ('interestOnLoan', models.FloatField(default=0)),
                ('eligibleAmount', models.FloatField(default=0)),
                ('tenantName', models.CharField(max_length=1000, null=True)),
                ('tenantPan', models.CharField(max_length=1000, null=True)),
                ('address', models.CharField(max_length=1000, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='itdeclarationUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MonthlyPayslip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('month', models.CharField(max_length=100)),
                ('year', models.CharField(max_length=100)),
                ('basicSalary', models.CharField(max_length=100)),
                ('hra', models.CharField(max_length=100)),
                ('special', models.PositiveIntegerField(null=True)),
                ('lta', models.PositiveIntegerField(null=True)),
                ('taxSlab', models.PositiveIntegerField(default=10)),
                ('adHoc', models.PositiveIntegerField(null=True)),
                ('conveyance', models.CharField(max_length=100)),
                ('convRemiburse', models.CharField(max_length=100)),
                ('medRemiburse', models.CharField(max_length=100)),
                ('empPF', models.CharField(max_length=100)),
                ('otherEarnings', models.CharField(max_length=100)),
                ('ta', models.CharField(max_length=100)),
                ('da', models.CharField(max_length=100)),
                ('spFund', models.CharField(max_length=100)),
                ('ptDeduction', models.CharField(max_length=100)),
                ('ioLoan', models.CharField(max_length=100)),
                ('otherDeductions', models.CharField(max_length=100)),
                ('totalEarnings', models.CharField(max_length=100)),
                ('totalDeduction', models.CharField(max_length=100)),
                ('netpay', models.CharField(max_length=100)),
                ('pfAmnt', models.PositiveIntegerField(default=0, null=True)),
                ('esicAmount', models.FloatField(default=0)),
                ('pTax', models.FloatField(default=0)),
                ('bonus', models.FloatField(default=0)),
                ('miscellaneous', models.FloatField(default=0)),
                ('earnings', models.FloatField(default=0)),
                ('deduction', models.FloatField(default=0)),
                ('contribution', models.FloatField(default=0)),
                ('pfAdmin', models.FloatField(default=0)),
                ('esicAdmin', models.FloatField(default=0)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='payslipUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='payroll',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateField(auto_now=True)),
                ('hra', models.PositiveIntegerField(null=True)),
                ('special', models.PositiveIntegerField(null=True)),
                ('lta', models.PositiveIntegerField(null=True)),
                ('basic', models.PositiveIntegerField(null=True)),
                ('PFUan', models.CharField(max_length=50, null=True)),
                ('pan', models.CharField(max_length=30, null=True)),
                ('taxSlab', models.PositiveIntegerField(default=10)),
                ('adHoc', models.PositiveIntegerField(null=True)),
                ('policyNumber', models.CharField(max_length=50, null=True)),
                ('provider', models.CharField(max_length=30, null=True)),
                ('amount', models.PositiveIntegerField(null=True)),
                ('noticePeriodRecovery', models.BooleanField(default=False)),
                ('al', models.PositiveIntegerField(null=True)),
                ('ml', models.PositiveIntegerField(null=True)),
                ('adHocLeaves', models.PositiveIntegerField(null=True)),
                ('joiningDate', models.DateField(null=True)),
                ('off', models.BooleanField(default=True)),
                ('accountNumber', models.CharField(max_length=40, null=True)),
                ('ifscCode', models.CharField(max_length=30, null=True)),
                ('bankName', models.CharField(max_length=30, null=True)),
                ('deboarded', models.BooleanField(default=False)),
                ('lastWorkingDate', models.DateField(null=True)),
                ('alHold', models.PositiveIntegerField(default=0)),
                ('mlHold', models.PositiveIntegerField(default=0)),
                ('adHocLeavesHold', models.PositiveIntegerField(default=0)),
                ('notice', models.PositiveIntegerField(default=0, null=True)),
                ('probation', models.PositiveIntegerField(default=0, null=True)),
                ('probationNotice', models.PositiveIntegerField(default=0, null=True)),
                ('pfAccNo', models.CharField(max_length=20, null=True)),
                ('pfUniNo', models.CharField(max_length=200, null=True)),
                ('pfAmnt', models.PositiveIntegerField(default=0, null=True)),
                ('esic', models.CharField(max_length=20, null=True)),
                ('esicAmount', models.FloatField(default=0)),
                ('pTax', models.FloatField(default=0)),
                ('bonus', models.FloatField(default=0)),
                ('pfAdmin', models.FloatField(default=0)),
                ('esicAdmin', models.FloatField(default=0)),
                ('ctc', models.FloatField(default=0)),
                ('activatePayroll', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payrollAuthored', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PayrollLogs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateField(auto_now=True)),
                ('oldHra', models.PositiveIntegerField(null=True)),
                ('newHra', models.PositiveIntegerField(null=True)),
                ('oldspecial', models.PositiveIntegerField(null=True)),
                ('newspecial', models.PositiveIntegerField(null=True)),
                ('oldLta', models.PositiveIntegerField(null=True)),
                ('newLta', models.PositiveIntegerField(null=True)),
                ('oldBasic', models.PositiveIntegerField(null=True)),
                ('newBasic', models.PositiveIntegerField(null=True)),
                ('oldtaxSlab', models.PositiveIntegerField(null=True)),
                ('newtaxSlab', models.PositiveIntegerField(null=True)),
                ('oldadHoc', models.PositiveIntegerField(null=True)),
                ('newadHoc', models.PositiveIntegerField(null=True)),
                ('oldAl', models.PositiveIntegerField(null=True)),
                ('newAl', models.PositiveIntegerField(null=True)),
                ('oldml', models.PositiveIntegerField(null=True)),
                ('newml', models.PositiveIntegerField(null=True)),
                ('oldadHocLeav', models.PositiveIntegerField(null=True)),
                ('newadHocLeav', models.PositiveIntegerField(null=True)),
                ('oldpfAmount', models.PositiveIntegerField(null=True)),
                ('newpfAmount', models.PositiveIntegerField(null=True)),
                ('createdUser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payrollLogsCreated', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userPayrollLogs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PayrollReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateField(auto_now=True)),
                ('month', models.PositiveIntegerField()),
                ('year', models.PositiveIntegerField()),
                ('total', models.PositiveIntegerField(null=True)),
                ('totalTDS', models.PositiveIntegerField(null=True)),
                ('status', models.CharField(choices=[('draft', 'draft'), ('final', 'final'), ('paid', 'paid')], default='draft', max_length=30)),
                ('dateOfProcessing', models.DateField(null=True)),
                ('pfReserved', models.FloatField(default=0)),
                ('payable', models.FloatField(default=0)),
                ('pfContribution', models.FloatField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payrollReportsCreated', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Payslip',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateField(auto_now=True)),
                ('month', models.PositiveIntegerField()),
                ('year', models.PositiveIntegerField()),
                ('days', models.PositiveIntegerField(default=0)),
                ('deffered', models.BooleanField(default=False)),
                ('miscellaneous', models.FloatField(default=0)),
                ('totalPayable', models.FloatField(default=0)),
                ('reimbursement', models.PositiveIntegerField(default=0)),
                ('grandTotal', models.FloatField(default=0)),
                ('amount', models.FloatField(default=0)),
                ('pfAmnt', models.FloatField(default=0)),
                ('pfAdmin', models.FloatField(default=0)),
                ('tds', models.FloatField(default=0)),
                ('report', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='payslips', to='payroll.PayrollReport')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payslipsUsers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='payslip',
            unique_together=set([('year', 'month', 'user')]),
        ),
        migrations.AlterUniqueTogether(
            name='payrollreport',
            unique_together=set([('year', 'month')]),
        ),
        migrations.AlterUniqueTogether(
            name='monthlypayslip',
            unique_together=set([('year', 'month', 'user')]),
        ),
    ]
