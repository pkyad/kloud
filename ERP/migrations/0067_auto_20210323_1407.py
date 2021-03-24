# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-03-23 14:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0066_auto_20210322_0555'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='last_login',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        # migrations.AddField(
        #     model_name='division',
        #     name='subscriptionExpiryDate',
        #     field=models.DateField(null=True),
        # ),
        migrations.AlterField(
            model_name='onlinepaymentdetails',
            name='failureUrl',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
