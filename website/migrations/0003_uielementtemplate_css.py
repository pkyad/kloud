# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-02-10 08:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0002_page_enablechat'),
    ]

    operations = [
        migrations.AddField(
            model_name='uielementtemplate',
            name='css',
            field=models.TextField(max_length=100000, null=True),
        ),
    ]