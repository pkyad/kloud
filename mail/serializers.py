from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string

def randomPassword():
    length = 20
    chars = string.ascii_letters + string.digits + '!@#$%^&*()'
    rnd = random.SystemRandom()
    return ''.join(rnd.choice(chars) for i in range(length))

class mailAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = mailAttachment
        fields = ('pk' , 'user' , 'attachment', 'created','contractid' )
    def create(self , validated_data):
        a = mailAttachment()
        a.user = self.context['request'].user
        a.attachment = validated_data.pop('attachment')
        a.save()
        return a

class proxyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = proxyAccount
        fields = ('pk' , 'user' , 'passKey', 'updated', 'email', 'displayName','signature')
    def create(self , validated_data):
        pa = proxyAccount(**validated_data)
        pa.save()
        return pa

class proxyAccountLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = proxyAccount
        fields = ('pk' ,  'email','signature')
