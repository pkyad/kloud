# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-16 07:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0053_auto_20210212_1211'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='freeQuotaExcceded',
            field=models.BooleanField(default=False),
        ),
    ]
