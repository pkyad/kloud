from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from HR.serializers import userSearchSerializer
from rest_framework.response import Response
from PIL import Image

class JobssSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('pk' , 'created' ,'updated', 'division', 'process', 'queue' , 'retryCount', 'status')
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
        if 'queue' in data:
            try:
                jObj.queue = Queue.objects.get(pk = int(data['queue']))
            except:
                pass
        jObj.save()
        return jObj
    def update(self,instance,validated_data):
        for key in [ 'process', 'queue' , 'retryCount', 'status']:
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
        if 'queue' in data:
            try:
                instance.queue = Queue.objects.get(pk = data['queue'])
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


class QueueSerializer(serializers.ModelSerializer):
    process = ProcessSerializer(many = False, read_only= True)
    class Meta:
        model = Queue
        fields = ('pk' , 'created' ,'updated', 'division', 'process', 'name')
        read_only_fields = ('division',)
    def create(self,validated_data):
        data = self.context['request'].data
        print data, 'data'
        processObj = Process.objects.get(pk = int(data['process']))
        divisionObj = self.context['request'].user.designation.division        
        obj = Queue.objects.create(name = data['name'], process = processObj,division = divisionObj)

        obj.save()
        return obj
    def update(self,instance,validated_data):
        for key in [ 'process', 'name' ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'process' in data:
            instance.process = Process.objects.get(pk = data['process'])

        instance.save()
        return instance