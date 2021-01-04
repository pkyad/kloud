from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string
from HR.serializers import userSearchSerializer,userSerializer,userLiteSerializer

class ForumCommentSerializer(serializers.ModelSerializer):
    user = userLiteSerializer(many = False , read_only = True)

    class Meta:
        model = ForumComment
        fields = ('pk' , 'created' , 'parent', 'txt','user','verified')

        def create(self , validated_data):
            fc = ForumComment(**validated_data)
            if 'user' in  self.context['request'].data:
                user = userSearch.objects.get(pk = self.context['request'].data['user'])
                fc.user = user
            if 'parent' in  self.context['request'].data:
                parent = ForumThread.objects.get(pk = self.context['request'].data['parent'])
                fc.parent = parent
            fc.save()
            return fc

class ForumThreadSerializer(serializers.ModelSerializer):
    user = userLiteSerializer(many = False , read_only = True)
    forumthread = ForumCommentSerializer(many = True , read_only = True)
    class Meta:
        model = ForumThread
        fields = ('pk' , 'created' , 'updated', 'page', 'txt', 'attachment','user','verified','forumthread')
    def create(self , validated_data):
        f = ForumThread(**validated_data)
        if 'user' in  self.context['request'].data:
            user = userSearch.objects.get(pk = self.context['request'].data['user'])
            f.user = user
        f.save()
        return f
