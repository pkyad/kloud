# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-29 13:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PIM', '0011_calendar_zoomcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calendar',
            name='zoomcode',
            field=models.TextField(max_length=5000, null=True),
        ),
    ]
