# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-01-07 07:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0004_auto_20210107_0652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notebook',
            name='type',
            field=models.CharField(choices=[('private', 'private'), ('public', 'public')], default='private', max_length=40),
        ),
    ]
