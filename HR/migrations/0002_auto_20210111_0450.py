# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-11 04:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HR', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='apps',
            field=models.TextField(max_length=6000, null=True),
        ),
    ]
