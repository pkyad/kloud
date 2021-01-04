# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User
# Create your models here.
from time import time

from ERP.models import *

VIEW_CHOICES = (
    ('Chart', 'Chart'),
    ('Report', 'Report'),
)
VIEW_GRAPHS = (
    ('Pie', 'Pie'),
    ('Bar', 'Bar'),
    ('Line', 'Line'),
    ('Doughnut', 'Doughnut'),
    ('Table', 'Table'),
)
class HomeChart(models.Model):
    name = models.CharField(max_length = 250, null = True)
    type = models.CharField(choices = VIEW_CHOICES, max_length = 30, default = 'Chart')
    index = models.PositiveIntegerField(null = True, default=1)
    chartType = models.CharField(choices = VIEW_GRAPHS, max_length = 30, default = 'Bar')
    enabled = models.BooleanField(default = False)
    configuration = models.CharField(max_length = 3000, null = True)
    query = models.TextField(null = True , max_length = 10000)
    division = models.ForeignKey(Division, related_name = 'activeDivision', null = True)

HOLIDAY_TYPE_CHOICES = (
    ('national' , 'national'),
    ('state' , 'state'),
    ('restricted' , 'restricted'),
)

class CompanyHolidays(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    date = models.DateField(null=True)
    typ = models.CharField(choices = HOLIDAY_TYPE_CHOICES , max_length = 20 , default = 'national')
    name = models.CharField(max_length = 50 , null = True)
    division =  models.ForeignKey(Division , related_name="holidaysdivisions" , null = True )
