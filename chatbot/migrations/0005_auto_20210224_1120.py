# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-02-24 11:20
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chatbot', '0004_nodeblock_saleconfig'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='lat',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='activity',
            name='lng',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='activity',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activitiesUser', to=settings.AUTH_USER_MODEL),
        ),
    ]