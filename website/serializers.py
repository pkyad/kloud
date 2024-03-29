from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from ERP.models import service
from marketing.models import  Contacts
from clientRelationships.models import Contact
import datetime
import pytz
import math

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('pk' , 'created','title','description','url','ogImage','user','enableChat','inFooter')
        read_only_fields=('user',)
    def create(self , validated_data):
        pageObj = Page(**validated_data)
        user = User.objects.get(pk = self.context['request'].user.pk)
        for k in ['blogs','categories','forum','details','accounts','enableChat','academy']:
            if pageObj.url == k:
                raise ValidationError(detail={'status' : 'Page url already existed'})

        pageObj.user = user
        pageObj.save()

        return pageObj
    def update(self, instance , validated_data):
        for key in ['title','description','url','ogImage','user','enableChat','inFooter']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass
        instance.user =  User.objects.get(pk = self.context['request'].user.pk)
        for k in ['blogs','categories','forum','details','accounts','enableChat','academy']:
            if instance.url == k:
                raise ValidationError(detail={'status' : 'Page url already existed'})

        instance.save()
        return instance
class ComponentsSerializer(serializers.ModelSerializer):
    parent =PageSerializer(many=False,read_only=True)
    class Meta:
        model = Components
        fields = ('pk' , 'created','component_type','data','parent','template' ,'index','css')
    def create(self , validated_data):
        compObj = Components(**validated_data)
        data = self.context['request'].data
        print data,"432434"
        if 'parent' in data:
            if data['parent'] != '':
                compObj.parent = Page.objects.get(pk = data['parent'])
        if 'uielement' in data:
            uielement =  UIelementTemplate.objects.get(pk = data['uielement'])
            compObj.component_type = uielement.name
            compObj.template = uielement.template
            compObj.data = uielement.defaultData
            compObj.css = uielement.css
        compObj.save()
        return compObj
    def update(self, instance , validated_data):

        data = self.context['request'].data
        if 'data' in data:
            instance.data = data['data']
        if 'index' in data:
            instance.index = data['index']
        instance.save()
        return instance


class UIelementTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UIelementTemplate
        fields = ('pk' , 'created','name','defaultData','sampleImg','template','mobilePreview','live','templateCategory','css','images' )
    def update(self, instance , validated_data):
        for key in ['name' , 'template','live','defaultData','templateCategory','mobilePreview','sampleImg','css','images']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass

        print instance.template,'0248993498949032490342890'
        data = self.context['request'].data
        if 'sampleImg' in data:
            instance.sampleImg = data['sampleImg']
        if 'mobilePreview' in data:
            instance.mobilePreview = data['mobilePreview']
        if 'images' in data:
            instance.images = data['images']
        instance.save()
        return instance
