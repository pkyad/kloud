# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-11 12:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payroll', '0002_auto_20210111_1226'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payroll',
            name='alCurrMonthLeaves',
            field=models.PositiveIntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='mlCurrMonthLeaves',
            field=models.PositiveIntegerField(default=0, null=True),
        ),
    ]