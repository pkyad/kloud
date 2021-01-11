# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-09 06:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientRelationships', '0007_configuretermsandconditions'),
    ]

    operations = [
        migrations.AddField(
            model_name='crmtermsandconditions',
            name='canInvoice',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='crmtermsandconditions',
            name='canSupplyOrder',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='crmtermsandconditions',
            name='counter',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='crmtermsandconditions',
            name='prefix',
            field=models.CharField(blank=True, max_length=60, null=True),
        ),
    ]
