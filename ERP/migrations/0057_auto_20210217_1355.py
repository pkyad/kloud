# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-17 13:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0056_auto_20210216_1035'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='subscriptionExpiryDate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='onlinepaymentdetails',
            name='failureUrl',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='onlinepaymentdetails',
            name='successUrl',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
