# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-13 13:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HR', '0005_team_isonsupport'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='lastState',
            field=models.CharField(max_length=200, null=True),
        ),
    ]