# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-12 12:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0003_auto_20210203_1101'),
    ]

    operations = [
        migrations.AddField(
            model_name='nodeblock',
            name='saleConfig',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
    ]
