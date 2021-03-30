from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string
from HR.serializers import userSearchSerializer,userSerializer,userLiteSerializer

class notebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = notebook
        fields = ('pk' , 'user', 'created' , 'pages' , 'title','project')
        read_only_fields = ('pages' , )
    def create(self , validated_data):
        n = notebook.objects.create(**validated_data)
        n.user = self.context['request'].user
        if 'project' in self.context['request'].data:
            n.project = project.object.get(pk = self.context['request'].data['project'] )
        n.save()
        return n
    def update(self, instance, validated_data): # like the comment
        instance.title = validated_data['title']
        instance.save()
        return instance

# class pageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = page
#         fields = ('pk' , 'user', 'source' , 'parent' , 'title')
#     def create(self , validated_data):
#         p = page.objects.create(**validated_data)
#         p.user = self.context['request'].user
#         p.save()
#         return p
#     def update(self, instance, validated_data): # like the comment
#         instance.title = validated_data['title']
#         instance.source = validated_data['source']
#         instance.save()
#         return instances
