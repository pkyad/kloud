# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-04-19 08:02
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('RPA', '0002_job_process'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='queue',
            name='division',
        ),
        migrations.RemoveField(
            model_name='queue',
            name='process',
        ),
        migrations.RemoveField(
            model_name='job',
            name='queue',
        ),
        migrations.DeleteModel(
            name='Queue',
        ),
    ]
