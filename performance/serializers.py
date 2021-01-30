from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from HR.serializers import userSearchSerializer
from rest_framework.response import Response
import os
from projects.serializers import projectLiteSerializer
from datetime import datetime

class TimeSheetLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSheet
        fields = ('pk','created','user','date','approved')



class TimeSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSheet
        fields = ('pk','created','user','date','approved','approvedBy','status' , 'checkIn' , 'checkOut','totaltime' , 'distanceTravelled','attendance_status')
        read_only_fields=('user', )
    def create(self , validated_data):
        t = TimeSheet(**validated_data)
        t.user = self.context['request'].user
        t.save()
        return t

    def update(self , instance , validated_data):
        print self.context['request'].data,validated_data
        if 'checkInTime' in self.context['request'].data:
            instance.checkIn = datetime.now()
            instance.save()
            return instance
        if 'checkOutTime' in self.context['request'].data:
            instance.checkOut = datetime.now()
            instance.save()
        if 'totaltime' in self.context['request'].data:
            instance.totaltime = self.context['request'].data['totaltime']
            instance.save()
            return instance
        if instance.status == 'submitted':
            if 'typ' in self.context['request'].data:
                if self.context['request'].data['typ'] == 'approved':
                    pass
                    instance.approved = True
                    instance.status = 'approved'
                elif self.context['request'].data['typ'] == 'created':
                    instance.status = 'created'
                instance.approvedBy.add(self.context['request'].user)

        if 'status' in self.context['request'].data:
            instance.status = 'submitted'
        if 'attendance_status' in self.context['request'].data:
            instance.attendance_status = self.context['request'].data['attendance_status']
        instance.save()
        return instance

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('pk','created','user','title','feed')
