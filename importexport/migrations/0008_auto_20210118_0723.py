# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-01-18 07:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('importexport', '0007_auto_20210113_0734'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaintmanagement',
            name='attr4',
            field=models.TextField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='products',
            name='part_no',
            field=models.CharField(max_length=60, null=True, unique=True),
        ),
    ]
