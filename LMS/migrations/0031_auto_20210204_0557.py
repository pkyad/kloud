# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-02-04 05:57
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('LMS', '0030_auto_20210204_0527'),
    ]

    operations = [
        # migrations.RemoveField(
        #     model_name='enrollment',
        #     name='accepted',
        # ),
        # migrations.AddField(
        #     model_name='enrollment',
        #     name='amountPaid',
        #     field=models.PositiveIntegerField(default=0),
        # ),
        # migrations.AddField(
        #     model_name='enrollment',
        #     name='amountPending',
        #     field=models.PositiveIntegerField(default=0),
        # ),
        # migrations.AlterField(
        #     model_name='courseactivty',
        #     name='time',
        #     field=models.DateTimeField(null=True),
        # ),
        # migrations.AlterField(
        #     model_name='enrollment',
        #     name='addedBy',
        #     field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lmsUsersAdded', to=settings.AUTH_USER_MODEL),
        # ),
        # migrations.AlterField(
        #     model_name='enrollment',
        #     name='user',
        #     field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clientRelationships.Contact'),
        # ),
    ]
