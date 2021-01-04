from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from HR.serializers import userSearchSerializer
from rest_framework.response import Response
import os
from datetime import datetime


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaints
        fields = ('pk','created','user','status','txt')

class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = ('pk','created','user','title','timeInSec' , 'app')

class UserTourTrackerSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()
    class Meta:
        model =  UserTourTracker
        fields=('lat','lng','time')
    def get_time(self, obj):
        return obj.created.strftime("%I:%M %p")