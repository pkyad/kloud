from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from organization.models import *
from website.models import Page
from PIM.serializers import *
from HR.serializers import userSearchSerializer
from organization.serializers import InstalledAppSerializer
from website.serializers import PageSerializer
from rest_framework.response import Response
from fabric.api import *
import os
from django.conf import settings as globalSettings


class ApplicationLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = application
        fields = ('pk' , 'name', 'module' , 'description' , 'icon' , 'displayName','stateAlias')


class addressSerializer(serializers.ModelSerializer):
    class Meta:
        model = address
        fields = ('pk' , 'street' , 'city' , 'state' , 'pincode', 'lat' , 'lon', 'country')

class ServiceLiteSerializer(serializers.ModelSerializer):
    address = addressSerializer(many = False, read_only = True)
    class Meta:
        model = service
        fields = ('pk' , 'created' ,'name' , 'address' , 'telephone' , 'logo' , 'web',)


class serviceSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many = False , read_only = True)
    address = addressSerializer(many = False, read_only = True)
    contactPerson = userSearchSerializer(many = False , read_only = True)
    contact_count = serializers.SerializerMethodField()
    class Meta:
        model = service
        fields = ('pk' , 'created' ,'name' , 'user' , 'cin' , 'tin' , 'address' , 'mobile' , 'telephone' , 'logo' , 'about', 'doc', 'web','contactPerson','vendor'  , 'bankName' , 'accountNumber' , 'ifscCode','paymentTerm','contact_count')

    def assignValues(self , instance , validated_data):
        if 'name' in validated_data:
            instance.name = validated_data['name']
        if 'cin' in validated_data:
            instance.cin = validated_data['cin']
        if 'tin' in validated_data:
            instance.tin = validated_data['tin']
        if 'mobile' in validated_data:
            instance.mobile = validated_data['mobile']
        if 'telephone' in validated_data:
            instance.telephone = validated_data['telephone']
        if 'logo' in validated_data:
            instance.logo = validated_data['logo']
        if 'about' in validated_data:
            instance.about = validated_data['about']
        if 'doc' in validated_data:
            instance.doc = validated_data['doc']
        if 'web' in validated_data:
            instance.web = validated_data['web']
        if 'accountNumber' in validated_data:
            instance.accountNumber = validated_data['accountNumber']
        if 'paymentTerm' in validated_data:
            instance.paymentTerm = validated_data['paymentTerm']
        if 'bankName' in validated_data:
            instance.bankName = validated_data['bankName']
        if 'ifscCode' in validated_data:
            instance.ifscCode = validated_data['ifscCode']
        if 'address' in self.context['request'].data and self.context['request'].data['address'] is not None:
            instance.address_id = int(self.context['request'].data['address'])
        if 'contactPerson' in self.context['request'].data and self.context['request'].data['contactPerson'] is not None:
            instance.contactPerson_id = int(self.context['request'].data['contactPerson'])
        instance.save()

    def create(self , validated_data):
        print validated_data
        s = service(name = validated_data['name'] )
        user =  self.context['request'].user
        s.user = user
        s.division = user.designation.division
        self.assignValues(s, validated_data)
        return s
    def update(self , instance , validated_data):
        self.assignValues(instance , validated_data)
        instance.save()
        return instance
    def get_contact_count(self , obj):
        return obj.contacts.all().count()

class serviceLiteSerializer(serializers.ModelSerializer):
    address = addressSerializer(many = False, read_only = True)
    class Meta:
        model = service
        fields = ('pk'  ,'name' , 'address' , 'mobile', 'cin' , 'tin','logo','web','telephone')


class applicationSerializer(serializers.ModelSerializer):
    appMedia = serializers.SerializerMethodField()
    mobileMedia = serializers.SerializerMethodField()
    usersCount = serializers.SerializerMethodField()
    is_app_installed = serializers.SerializerMethodField()
    class Meta:
        model = application
        fields = ( 'pk', 'name', 'module' , 'description' , 'icon'  ,  'haveJs' , 'haveCss' , 'published', 'displayName','stateAlias','appMedia','windows','ios','mac','android','rating_five','rating_four','rating_three','rating_two','rating_one','usersCount','appStoreUrl' , 'playStoreUrl','is_app_installed','mobileMedia')
    def update(self , instance , validated_data):
        for key in ['displayName' , 'description' , 'webpage','windows','ios','mac','android','rating_five','rating_four','rating_three','rating_two','rating_one']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'webpage' in self.context['request'].data:
            instance.webpage = Page.objects.get(pk=self.context['request'].data['webpage'])

        instance.save()
        return instance
    def get_appMedia(self , obj):

        return applicationMediaSerializer(obj.appMedia.all(),many=True).data
    def get_mobileMedia(self , obj):

        return MobileapplicationMediaSerializer(obj.mobileMedia.all(),many=True).data
    def get_usersCount(self , obj):
        apps = InstalledApp.objects.filter(app__pk=obj.pk).values_list('app__pk').distinct()
        userapp = UserApp.objects.filter(app__in = apps).values_list('user__pk').distinct()
        data = User.objects.filter(pk__in = userapp).count()

        return {'count':data,'appRating':4.3}
    def get_is_app_installed(self , obj):
        is_installed = False
        try:
            iObj = InstalledApp.objects.filter(app = obj, parent =  self.context['request'].user.designation.division )
            if iObj.count()>0:
                is_installed = True
        except:
            pass
        return is_installed

class applicationMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = applicationMedia
        fields = ( 'pk','created','app','typ','attachment')
    def create(self , validated_data):
        appMedia =  applicationMedia(**validated_data)
        if 'app' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['app'] )
            appMedia.app = appObj

        imgTyp = self.context['request'].data['name']
        if imgTyp.endswith('.jpg') or imgTyp.endswith('.jpeg') or  imgTyp.endswith('.png') or  imgTyp.endswith('.PNG') or imgTyp.endswith('.JPG') or imgTyp.endswith('.JPEG'):
            appMedia.typ= 'image'
        else:
            appMedia.typ= 'video'
        appMedia.save()
        return appMedia

class MobileapplicationMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MobileapplicationMedia
        fields = ( 'pk','created','app','typ','attachment')
    def create(self , validated_data):
        appMedia =  MobileapplicationMedia(**validated_data)
        if 'app' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['app'] )
            appMedia.app = appObj

        imgTyp = self.context['request'].data['name']
        if imgTyp.endswith('.jpg') or imgTyp.endswith('.jpeg') or  imgTyp.endswith('.png') or  imgTyp.endswith('.PNG') or imgTyp.endswith('.JPG') or imgTyp.endswith('.JPEG'):
            appMedia.typ= 'image'
        else:
            appMedia.typ= 'video'
        appMedia.save()
        return appMedia

class appSettingsLiteFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = appSettingsField
        fields = ('name','state' )


class appSettingsFieldSerializer(serializers.ModelSerializer):
    app = applicationSerializer(read_only =True ,many=False)
    class Meta:
        model = appSettingsField
        fields = ( 'pk', 'name', 'heading' , 'created' , 'app','state' )
    def create(self , validated_data):
        app =  appSettingsField(**validated_data)
        if 'app' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['app'] )
            app.app = appObj
        app.save()
        return app

class MenuItemsSerializer(serializers.ModelSerializer):
    parent = applicationSerializer(read_only =True ,many=False)
    class Meta:
        model = MenuItems
        fields = ( 'pk', 'name',  'icon' , 'parent','state','jsFileName' )
    def create(self , validated_data):
        app =  MenuItems(**validated_data)
        if 'parent' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['parent'] )
            app.parent = appObj
        app.save()
        return app

    def update(self , instance , validated_data):
        for key in ['name', 'icon' ,'state','jsFileName' ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'parent' in self.context['request'].data:
            instance.parent = application.objects.get(pk=  self.context['request'].data['parent'] )

        instance.save()
        return instance

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ( 'pk', 'created',  'star' , 'app','text','name' )
    def create(self , validated_data):
        feedback =  Feedback(**validated_data)
        if 'app' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['app'] )
            feedback.app = appObj

        feedback.save()
        return feedback



class UserAppSerializer(serializers.ModelSerializer):
    app = applicationSerializer(many=False,read_only=True)
    user = userSearchSerializer(many=False,read_only=True)
    usersCount = serializers.SerializerMethodField()
    class Meta:
        model = UserApp
        fields = ( 'pk', 'app',  'user' , 'index','notificationCount','locked','created','updated','usersCount' )
    def get_usersCount(self , obj):
        apps = InstalledApp.objects.filter(app__pk=obj.app.pk).values_list('app__pk').distinct()
        userapp = UserApp.objects.filter(app__in = apps).values_list('user__pk').distinct()
        data = User.objects.filter(pk__in = userapp).count()

        return data


class ApplicationFeatureSerializer(serializers.ModelSerializer):
    parent = applicationSerializer(read_only =True ,many=False)
    class Meta:
        model = ApplicationFeature
        fields = ( 'pk', 'name',  'created' , 'parent','enabled' )
    def create(self , validated_data):
        appFeature =  ApplicationFeature(**validated_data)
        if 'parent' in self.context['request'].data:
            appObj = application.objects.get(pk=  self.context['request'].data['parent'] )
            appFeature.parent = appObj
        appFeature.save()
        return appFeature
    def update(self , instance , validated_data):
        for key in ['name',  'created' , 'parent','enabled' ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'parent' in self.context['request'].data:
            instance.parent = application.objects.get(pk=  self.context['request'].data['parent'] )

        instance.save()
        return instance





class applicationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = application
        fields = ( 'pk', 'name', 'module' , 'description' , 'created' , 'icon', 'haveJs' , 'haveCss' , 'published', 'displayName','webpage')
    def create(self , validated_data):
        app =  application(**validated_data)
        app.module = module.objects.get(pk = self.context['request'].data['module']);
        parts = app.name.split('.')
        appName = parts[1]
        if len(parts)>=3:
            app.save()
            return app
        app.save()
        if len(app.name.split('.'))==2:
            with lcd(globalSettings.BASE_DIR):
                cmd = 'python manage.py startapp %s' %(appName)
                local(cmd)
        fileName = os.path.join(globalSettings.BASE_DIR , 'libreERP' , 'settings.py') # filepath for settings.py
        f = open(fileName , 'r')
        search = False
        lines = f.readlines()
        for l in lines:
            if l.find('INSTALLED_APPS') != -1:
                search = True
            if search:
                if l.find(')') != -1:
                    index = lines.index(l)
                    break
        lines.insert(index , ("\t'%s',# %s\n" %(appName , app.description)))
        f = open(fileName, "w")
        f.writelines(lines)
        f.close()
        os.makedirs(os.path.join(globalSettings.BASE_DIR ,appName,'static'))
        os.makedirs(os.path.join(globalSettings.BASE_DIR ,appName,'static', 'js'))
        os.makedirs(os.path.join(globalSettings.BASE_DIR ,appName,'static', 'css'))
        os.makedirs(os.path.join(globalSettings.BASE_DIR ,appName,'static', 'ngTemplates'))
        if app.haveJs:
            # create a JS file
            jsPath = os.path.join(globalSettings.BASE_DIR ,appName,'static', 'js' , ('%s.js' %(app.name)))
            f = open(jsPath, 'w')
            f.write('// you need to first configure the states for this app')
            f.close()
        if app.haveCss:
            #create a css file too
            jsPath = os.path.join(globalSettings.BASE_DIR ,appName,'static', 'css' , ('%s.css' %(app.name)))
            f = open(jsPath, 'w')
            f.write('/*here you can place all your app specific css class*/')
            f.close()
        app.save()
        return app

    def update (self, instance, validated_data):
        return instance

class permissionSerializer(serializers.ModelSerializer):
    app = applicationSerializer(read_only = True, many = False)
    class Meta:
        model = permission
        fields = ( 'pk' , 'app' , 'user' )
    def create(self , validated_data):
        user = self.context['request'].user
        if not user.is_superuser:
            raise PermissionDenied(detail=None)
        u = validated_data['user']
        permission.objects.filter(user = u).all().delete()
        for a in self.context['request'].data['apps']:
            app = application.objects.get(pk = a)
            p = permission.objects.create(app =  app, user = u , givenBy = user)
        return p

class GenericPincodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericPincode
        fields = ('pk' ,  'state' ,  'city' ,'country', 'pincode' , 'pin_status')

class ProductMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMeta
        fields = ('pk'  ,'description' , 'typ' , 'code' , 'taxRate')


class UserAppsSerializer(serializers.ModelSerializer):
    app = ApplicationLiteSerializer(many = False , read_only=True)
    class Meta:
        model = UserApp
        fields = ('pk'  ,'updated' , 'locked' , 'notificationCount' , 'index', 'app' , 'user')

class UserAppsLiteSerializer(serializers.ModelSerializer):
    app = ApplicationLiteSerializer(many = False , read_only=True)
    class Meta:
        model = UserApp
        fields = ('pk' ,'app' )

class UsageBillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageBilling
        fields = ('pk' , 'date', 'title', 'amount', 'month', 'year', 'division','app','icon','description' )

class CalendarSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarSlots
        fields = ('pk' , 'slot', 'day', 'is_available' )

class LanguageTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageTranslation
        fields = ('pk' , 'key', 'value', 'lang' )
