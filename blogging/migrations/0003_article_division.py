# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-03-25 08:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0069_division_subscriptionexpirydate'),
        ('blogging', '0002_auto_20210323_1050'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='division',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='articles', to='ERP.Division'),
        ),
    ]