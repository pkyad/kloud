# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-23 12:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0061_auto_20210222_0830'),
        ('finance', '0017_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='division',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='carts', to='ERP.Division'),
        ),
    ]