from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string
from HR.serializers import userSearchSerializer,userSerializer,userLiteSerializer
import json
import ast
from HR.models import profile

# class ForumCommentSerializer(serializers.ModelSerializer):
#     user = userLiteSerializer(many = False , read_only = True)
#
#     class Meta:
#         model = ForumComment
#         fields = ('pk' , 'created' , 'parent', 'txt','user','verified')
#
#         def create(self , validated_data):
#             fc = ForumComment(**validated_data)
#             if 'user' in  self.context['request'].data:
#                 user = userSearch.objects.get(pk = self.context['request'].data['user'])
#                 fc.user = user
#             if 'parent' in  self.context['request'].data:
#                 parent = ForumThread.objects.get(pk = self.context['request'].data['parent'])
#                 fc.parent = parent
#             fc.save()
#             return fc
#
# class ForumThreadSerializer(serializers.ModelSerializer):
#     user = userLiteSerializer(many = False , read_only = True)
#     forumthread = ForumCommentSerializer(many = True , read_only = True)
#     class Meta:
#         model = ForumThread
#         fields = ('pk' , 'created' , 'updated', 'page', 'txt', 'attachment','user','verified','forumthread')
#     def create(self , validated_data):
#         f = ForumThread(**validated_data)
#         if 'user' in  self.context['request'].data:
#             user = userSearch.objects.get(pk = self.context['request'].data['user'])
#             f.user = user
#         f.save()
#         return f



class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk','first_name','last_name')


class ProfileLiteSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(many=False , read_only=True)
    class Meta:
        model = profile
        fields = ('pk','postCount','user')


class ForumFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumFiles
        fields = ('pk','attachment','typ')


class ForumSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many=False , read_only=True)
    files = ForumFilesSerializer(many=True , read_only=True)
    commentCount = serializers.SerializerMethodField()
    tag = serializers.SerializerMethodField()
    class Meta:
        model = Forum
        fields = ('pk','title','description','created','user','approved','views','url','reporters','commentCount','files','tag')
    def get_commentCount(self , obj):
        return ForumComment.objects.filter(parent=obj).count()
    def get_tag(self , obj):
        try:
            return  ast.literal_eval(obj.tags)
        except:
            return []

class ForumCommentFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumCommentFiles
        fields = ('pk','attachment','typ')

class ForumCommentSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many=False , read_only=True)
    files = ForumCommentFilesSerializer(many=True , read_only=True)
    class Meta:
        model = ForumComment
        fields = ('pk','content','created','user','likes','parent','approved','anonymousName','anonymousEmail','files')
