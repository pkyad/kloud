# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-01 06:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PIM', '0012_auto_20210129_1305'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatthread',
            name='is_pin',
            field=models.BooleanField(default=False),
        ),
    ]
