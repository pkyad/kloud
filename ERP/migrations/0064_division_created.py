# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-03-12 08:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0063_division_pagetype'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
