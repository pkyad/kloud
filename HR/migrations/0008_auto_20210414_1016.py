# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-04-14 10:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HR', '0007_auto_20210323_1350'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='mobile',
            field=models.CharField(max_length=14, null=True, unique=True),
        ),
    ]
