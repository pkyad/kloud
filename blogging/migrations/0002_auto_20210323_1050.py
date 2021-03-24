# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-03-23 10:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogging', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='metaTitle',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='article',
            name='scheduleTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
