# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-09 06:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0006_division_counter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='division',
            name='counter',
            field=models.PositiveIntegerField(default=1),
        ),
    ]