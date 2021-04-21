from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from HR.serializers import userSearchSerializer
from rest_framework.response import Response
from PIL import Image
import uuid

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ('pk' , 'created' ,'updated', 'division', 'name','key','env' )
        read_only_fields = ('division',)
    def create(self,validated_data):
        obj= Machine(**validated_data)
        obj.division = self.context['request'].user.designation.division
        obj.key = uuid.uuid4()
        obj.save()
        return obj
    def update(self,instance,validated_data):
        for key in [ 'name','env']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        return instance

class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        fields = ('pk' , 'created' ,'updated','name','uri','argSchema','env', 'division')
        read_only_fields = ('division',)
    def create(self,validated_data):
        jObj= Process(**validated_data)
        jObj.division = self.context['request'].user.designation.division
        jObj.save()
        data = self.context['request'].data
        jObj.save()
        return jObj
    def update(self,instance,validated_data):
        for key in [ 'name','uri','argSchema','env', 'division' ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass


        instance.save()
        return instance

class JobssSerializer(serializers.ModelSerializer):
    process = ProcessSerializer(many = False , read_only = True)
    class Meta:
        model = Job
        fields = ('pk' , 'created' ,'updated', 'division', 'process' , 'retryCount', 'status')
        read_only_fields = ('division',)
    def create(self,validated_data):
        jObj= Job(**validated_data)
        jObj.division = self.context['request'].user.designation.division
        jObj.save()
        data = self.context['request'].data
        if 'process' in data:
            try:
                jObj.process = Process.objects.get(pk = int(data['process']))
            except :
                pass
        jObj.save()
        return jObj
    def update(self,instance,validated_data):
        for key in [ 'process' , 'retryCount', 'status']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        data = self.context['request'].data
        if 'process' in data:
            try:
                instance.process = Process.objects.get(pk = int(data['process']))
            except :
                pass

        instance.save()
        return instance


class JobContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobContext
        fields = ('pk' , 'created' ,'updated', 'key', 'value' , 'typ', 'attachment')
