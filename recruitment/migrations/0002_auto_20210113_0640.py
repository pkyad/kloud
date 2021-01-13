# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-13 06:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0011_merge_20210111_1745'),
        ('recruitment', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobs',
            name='division',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='jobdivision', to='ERP.Division'),
        ),
        migrations.AlterField(
            model_name='jobs',
            name='role',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
