# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-03-15 05:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0022_auto_20210308_1157'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoiceqty',
            name='data',
            field=models.TextField(max_length=2000, null=True),
        ),
    ]