# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2021-01-15 08:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('LMS', '0008_question_islatex'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='activeCourse',
            field=models.BooleanField(default=True),
        ),
    ]