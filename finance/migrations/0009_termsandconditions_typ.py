# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-09 08:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0008_sale_uniqueid'),
    ]

    operations = [
        migrations.AddField(
            model_name='termsandconditions',
            name='typ',
            field=models.TextField(max_length=100, null=True),
        ),
    ]