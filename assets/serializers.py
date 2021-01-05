from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from HR.serializers import *
from organization.serializers import UnitsLiteSerializer
from clientRelationships.serializers import ContactLiteSerializer
import datetime

class CheckinSerializer(serializers.ModelSerializer):
    to = userSerializer(many=False,read_only=True)
    approvedBy = userSerializer(many=False,read_only=True)
    class Meta:
        model = Checkin
        fields = ('pk' , 'user','warrantyTill','manufacturedOn','poNumber','name','serialNo','to','approvedBy','checkout','returnComment','returned','price' , 'reserved','unit','assignedOn', 'personName', 'email', 'phone', 'address')
        read_only_fields=('user',)
    def create(self , validated_data):
        d = Checkin(**validated_data)
        d.user = self.context['request'].user
        d.asset = Asset.objects.get(pk=self.context['request'].data['asset'])
        if 'warehouse' in self.context['request'].data:
            d.unit = Unit.objects.get(pk=self.context['request'].data['warehouse'])
        d.save()
        return d

    def update(self ,instance, validated_data):
        for key in ['warrantyTill','manufacturedOn','poNumber','asset','serialNo','to','approvedBy','price','returnComment']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        data = self.context['request'].data

        if 'to' in data:
            if data['to'] == None:
                instance.to = None
            else:
                instance.to = User.objects.get(pk = int(data['to']))
                instance.assignedOn = datetime.datetime.now()
                instance.assignedBy = self.context['request'].user
        else:
            instance.personName = data['personName']
            instance.email = data['email']
            instance.phone = data['phone']
            instance.address = data['address']
            instance.assignedOn = datetime.datetime.now()
            instance.assignedBy = self.context['request'].user

        if 'approvedBy' in data:
            instance.approvedBy = User.objects.get(pk = int(data['approvedBy']))
        instance.save()
        return instance


class CheckinLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkin
        fields = ('pk' , 'asset','serialNo')
