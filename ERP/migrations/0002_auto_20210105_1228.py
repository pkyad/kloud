# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-01-05 12:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='unit',
            name='mobile',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
