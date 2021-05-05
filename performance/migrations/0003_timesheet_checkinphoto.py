# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-05-04 09:50
from __future__ import unicode_literals

from django.db import migrations, models
import performance.models


class Migration(migrations.Migration):

    dependencies = [
        ('performance', '0002_timesheet_attendance_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='timesheet',
            name='checkinPhoto',
            field=models.FileField(null=True, upload_to=performance.models.getCheckinImagePath),
        ),
    ]
