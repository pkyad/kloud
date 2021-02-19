from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from django.conf import settings as globalSettings
from rest_framework.response import Response
import re
from PIL import Image
import os


class DivisionLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ('pk' , 'name' ,'website', 'logo', 'simpleMode', 'telephony', 'messaging')

class UnitsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ('pk' , 'name', 'city','division','state','country','master')

class appSerializer(serializers.ModelSerializer):
    class Meta:
        model = application
        fields = ('pk' , 'name' , 'description', 'icon', 'displayName')


class InstalledAppSerializer(serializers.ModelSerializer):
    app = appSerializer(many = False , read_only= True)
    class Meta:
        model = InstalledApp
        fields = ('pk' , 'app' , 'configs', 'addedBy' , 'priceAsAdded' , 'created' , 'updated')

class userSearchViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'pk' , 'first_name' , 'last_name','last_login'  )

import basehash
hash_fn = basehash.base36()

class DivisionSerializer(serializers.ModelSerializer):
    installations = InstalledAppSerializer(many = True , read_only = True)
    installationsCount = serializers.SerializerMethodField()
    users = serializers.SerializerMethodField()
    class Meta:
        model = Division
        fields = ('pk' , 'name','website','logo','pan','cin','l1','l2', 'installations', 'installationsCount', 'simpleMode', 'upi', 'telephony', 'messaging','headerTemplate','headerData','footerData','footerTemplate','defaultOgWidth','defaultOgHeight','defaultDescription','defaultTitle','defaultOgImage' , 'locked' , 'counter','enableChatbot','footerCss','headerCss','users','freeQuotaExcceded','subscriptionExpiryDate')
        read_only_fields=('contacts',)
    def get_installationsCount(self , obj):
        return obj.installations.all().count()
    def get_users(self , obj):
        # users = User.objects.filter(designation__division = obj.pk,is_superuser=False,is_staff=True)
        users = User.objects.filter(designation__division = obj.pk)
        count = users.count()
        lastlogin = userSearchViewSerializer(users.first(),many=False).data
        print lastlogin
        return{'users':count,'last_login':lastlogin['last_login']}
    def create(self , validated_data):
        d = Division(**validated_data)
        d.website = 'NA'
        d.pan = 'NA'
        d.cin = 'NA'

        d.save()

        data = self.context['request'].data
        if 'userNumber' in data :
            from ERP.initializing import *
            val = {'name': d.name, 'pk': d.pk, 'userNumber' : data['userNumber'] , 'email' :  data['email'], 'division_pk' : d.pk}
            res = CreateUnit(val)
            print res
            unit = Unit.objects.get(pk = int(res['unit']))
        if 'username' in data :
            u = User(is_staff = True , first_name = data['username'] , email = data['email'] , username=data['email'])
            u.set_password('123')
            u.save()

            designation = u.designation
            designation.division = d
            designation.unit = unit
            designation.save()

            profile = u.profile
            if 'userNumber' in data:
                profile.mobile = data['userNumber']
            profile.save()


        return d
    def update(self ,instance, validated_data):
        d = self.context['request'].data

        for key in ['name','website','logo','pan','cin','l1','l2', 'simpleMode', 'upi', 'telephony', 'messaging', 'locked','freeQuotaExcceded']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'action' in self.context['request'].GET:
            action = self.context['request'].GET['action']

            if action == 'addApplication':
                app, created = InstalledApp.objects.get_or_create(parent = instance , app = application.objects.get(pk = d['app']) , priceAsAdded = d['priceAsAdded'] , addedBy= self.context['request'].user)
                app.save()
                ua = UserApp(user = self.context['request'].user , app = application.objects.get(pk = d['app'])  )
                ua.save()

                # if instance.simpleMode == True:
                #     d = self.context['request'].user.designation
                #     d.apps.add(app)
                #     d.save()
        instance.save()
        return instance


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class UnitSuperLiteSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)
    class Meta:
        model = Unit
        fields = ( 'pk' , 'children', 'name' )

class UnitLiteSerializer(serializers.ModelSerializer):
    child_count = serializers.SerializerMethodField()
    class Meta:
        model = Unit
        fields = ( 'pk' , 'pincode','city','state','country' , 'parent', 'l1', 'name', 'child_count', 'l2' , 'mobile' ,'division', 'telephone','email', 'areaCode' , 'warehouse')
    def get_child_count(self, obj):
        return Unit.objects.filter(parent__in = [obj.pk]).count()

class UnitFullSerializer(serializers.ModelSerializer):
    children = UnitSuperLiteSerializer(many = True , read_only = True)
    class Meta:
        model = Unit
        fields = ( 'pk' , 'name' , 'pincode' , 'l1' , 'l2' , 'mobile','telephone','email', 'children', 'division','city','state','country','master' )

class UnitSerializer(serializers.ModelSerializer):
    division = DivisionLiteSerializer(many = False , read_only = True)
    parent = UnitLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Unit
        fields = ('pk' , 'name','address','pincode','l1','l2','mobile','telephone','email','division','parent', 'city','state','country' , 'areaCode','gstin', 'warehouse', 'bankName', 'bankBranch', 'bankAccNumber' , 'ifsc', 'swift','master')
        read_only_fields=('contacts','parent')
    def create(self , validated_data):
        d = Unit(**validated_data)
        d.division=Division.objects.get(pk=self.context['request'].data['division'])
        if 'parent' in self.context['request'].data:
            d.parent = Unit.objects.get(id=self.context['request'].data['parent'])
        d.save()

        return d

    def update(self ,instance, validated_data):
        for key in ['name','address','pincode','l1','l2','mobile','telephone','email','city','state','country' ,'parent','areaCode','gstin', 'warehouse', 'bankName', 'bankBranch', 'bankAccNumber' , 'ifsc', 'swift','master']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'division' in self.context['request'].data:
            instance.division=Division.objects.get(pk=self.context['request'].data['division'])

        if 'parent' in self.context['request'].data:
            instance.parent = Unit.objects.get(id=self.context['request'].data['parent'])
        instance.save()
        return instance
    def get_child_count(self, obj):
        return Unit.objects.filter(parent__in = [obj.pk]).count()





class applicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = application
        fields = ( 'pk', 'name', 'module' , 'description' , 'icon'  ,  'haveJs' , 'haveCss' , 'published')


class permissionSerializer(serializers.ModelSerializer):
    app = applicationSerializer(read_only = True, many = False)
    class Meta:
        model = permission
        fields = ( 'pk' , 'app' , 'user' )
    def create(self , validated_data):
        user = self.context['request'].user
        if not user.is_superuser and user not in app.owners.all():
            raise PermissionDenied(detail=None)
        u = validated_data['user']
        permission.objects.filter(user = u).all().delete()
        for a in self.context['request'].data['apps']:
            app = application.objects.get(pk = a)
            p = permission.objects.create(app =  app, user = u , givenBy = user)
        return p


class HomeChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeChart
        fields = ('pk', 'name', 'type', 'index', 'chartType', 'enabled', 'configuration', 'query', 'division')

class RoleSuperLiteSerializer(serializers.ModelSerializer):
    permissions = applicationSerializer(many = True , read_only = True)
    class Meta:
        model = Role
        fields = ('pk','name','division','permissions')


class RoleSerializer(serializers.ModelSerializer):
    permissions = applicationSerializer(many = True , read_only = True)
    reports = HomeChartSerializer(many=True , read_only=True)
    charts = HomeChartSerializer(many=True , read_only=True)
    class Meta:
        model = Role
        fields = ('pk','name','division','permissions', 'reports', 'charts')
    def create(self , validated_data):
        d = Role(**validated_data)
        d.save()
        d.division=Division.objects.get(pk=self.context['request'].data['division'])
        if 'permissions' in self.context['request'].data :
            for i in self.context['request'].data['permissions']:
                app = application.objects.get(pk = i['pk'])
                d.permissions.add(app)
        if 'reports' in self.context['request'].data:
            for i in self.context['request'].data['reports']:
                reports = homeChart.objects.get(pk = i['pk'])
                d.reports.add(reports)
        if 'charts' in self.context['request'].data:
            for i in self.context['request'].data['charts']:
                charts = homeChart.objects.get(pk = i['pk'])
                d.charts.add(charts)
        return d
    def update(self ,instance, validated_data):
        for key in ['name']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.division=Division.objects.get(pk=self.context['request'].data['division'])


        if 'permissions' in self.context['request'].data :
            instance.permissions.clear()
            for i in self.context['request'].data['permissions']:
                app = application.objects.get(pk = i['pk'])
                instance.permissions.add(app)
        if 'reports' in self.context['request'].data:
            instance.reports.clear()
            for p in self.context['request'].data['reports']:
                reports = homeChart.objects.get(pk = i['pk'])
                instance.reports.add(reports)
        if 'charts' in self.context['request'].data:
            instance.charts.clear()
            for p in self.context['request'].data['charts']:
                charts = homeChart.objects.get(pk = i['pk'])
                instance.charts.add(charts)
        instance.save()
        return instance

class CompanyHolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyHolidays
        fields = ('pk','created','date','typ','name')
    def create(self , validated_data):
        c = CompanyHolidays(**validated_data)
        if not ('master' in self.context['request'].GET and self.context['request'].user.is_superuser) :
            c.division =  self.context['request'].user.designation.division
        c.save()
        return c
