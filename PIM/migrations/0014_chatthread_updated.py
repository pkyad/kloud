# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-04 12:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PIM', '0013_chatthread_is_pin'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatthread',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]