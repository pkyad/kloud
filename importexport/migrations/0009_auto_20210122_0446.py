# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-01-22 04:46
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ERP', '0012_auto_20210120_0847'),
        ('importexport', '0008_auto_20210118_0723'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='products',
            unique_together=set([('part_no', 'division')]),
        ),
    ]