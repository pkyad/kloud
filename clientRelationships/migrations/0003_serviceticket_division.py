# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-05 09:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0001_initial'),
        ('clientRelationships', '0002_registeredproducts_serviceticket'),
    ]

    operations = [
        migrations.AddField(
            model_name='serviceticket',
            name='division',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='ERP.Division'),
        ),
    ]