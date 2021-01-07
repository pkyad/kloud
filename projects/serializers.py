from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from gitweb.serializers import repoLiteSerializer
from HR.serializers import userSerializer
from finance.models import CostCenter , ExpenseSheet , Account , ExpenseHeading, Sale
from django.db.models import Sum
from datetime import datetime
from ERP.models import service

class mediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = media
        fields = ( 'pk', 'link' , 'attachment' , 'mediaType', 'name', 'user' , 'created')
        read_only_fields = ('fileName' ,'user',)
    def create(self , validated_data):
        m = media(**validated_data)
        m.name = validated_data['attachment'].name
        m.user = self.context['request'].user
        m.save()
        if 'tour' in self.context['request'].data:
            tourObj = TourPlanStop.objects.get(pk = self.context['request'].data['tour'])
            if self.context['request'].data['picType'] == 'beforePic':
                tourObj.beforePic.add(m)
            else:
                tourObj.afterPic.add(m)
            tourObj.save()
        return m

class projectCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = projectComment
        fields = ( 'user' , 'text' , 'media')

class CostCenterLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostCenter
        fields = ('pk', 'name'  )


class ProjectObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectObjective
        fields = ('pk', 'user' , 'details' , 'status' , 'targetDate', 'optional', 'parent' )
        read_only_fields = ('user' , )
    def create(self , validated_data):

        po = ProjectObjective(**validated_data)
        po.user = self.context['request'].user
        po.save()
        return po


class ExpenseHeadingLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseHeading
        fields = ('pk', 'title')

class AccountLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('pk', 'title' , 'number', 'ifsc', 'bank')

class OutBoundInvoiceLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ('pk', 'user' , 'status', 'isInvoice', 'poNumber','name','deliveryDate','payDueDate')

class projectSerializer(serializers.ModelSerializer):
    files = mediaSerializer(many = True , read_only = True)
    repos = repoLiteSerializer(many = True , read_only = True)
    comments = projectCommentSerializer(many = True , read_only = True)
    costCenter = CostCenterLiteSerializer(many = False , read_only = True)
    ourBoundInvoices = OutBoundInvoiceLiteSerializer(many = True , read_only = True)
    totalCost = serializers.SerializerMethodField()
    class Meta:
        model = project
        fields = ('pk','dueDate', 'created' , 'title' , 'description' , 'files' , 'team', 'comments', 'repos','user','costCenter','budget','projectClosed','ourBoundInvoices','totalCost','company')
        read_only_fields = ('user', 'team',)
    def create(self , validated_data):
        p = project(**validated_data)
        p.user = self.context['request'].user
        if 'costCenter' in self.context['request'].data:
            p.costCenter = CostCenter.objects.get(pk=int(self.context['request'].data['costCenter']))
        if 'company' in self.context['request'].data:
            p.company = service.objects.get(pk=int(self.context['request'].data['company']))
        p.save()
        if 'team' in self.context['request'].data:
            for u in self.context['request'].data['team']:
                p.team.add(User.objects.get(pk=u))
        if 'files' in self.context['request'].data:
            for f in self.context['request'].data['files']:
                p.files.add(media.objects.get(pk = f))
        p.save()
        return p
    def update(self, instance , validated_data):
        for key in ['dueDate' , 'title' , 'description','budget','projectClosed',]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                print "Error while saving " , key
                pass

        if 'files' in self.context['request'].data:
            instance.files.clear()
            for f in self.context['request'].data['files']:
                instance.files.add(media.objects.get(pk = f))
        if 'team' in self.context['request'].data:
            instance.team.clear()
            for u in self.context['request'].data['team']:
                instance.team.add(User.objects.get(pk=u))
        instance.save()
        return instance
    def get_totalCost(self, obj):
        try:
            expTotal = ProjectPettyExpense.objects.filter(project=obj).aggregate(tot=Sum('amount'))
            expTotal = expTotal['tot'] if expTotal['tot'] else 0
            return expTotal
        except:
            return 0


class projectLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = project
        fields = ('pk' , 'title', 'description','budget')


class timelineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = timelineItem
        fields = ('pk','created' , 'user' , 'category' , 'text' , 'project' )
        read_only_fields = ('user',)
    def create(self , validated_data):
        i = timelineItem(**validated_data)
        req = self.context['request']
        i.user = req.user
        i.save()
        return i
    def update(self , instance , validated_data):
        raise PermissionDenied({'NOT_ALLOWED'})


class IssueSerializer(serializers.ModelSerializer):
    project = projectLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Issues
        fields = ( 'pk', 'created','title', 'project', 'responsible', 'tentresdt', 'priority','status', 'result','resultComments','description','file')
        read_only_fields = ('responsible','project', )
    def create(self , validated_data):
        q = Issues(**validated_data)
        q.responsible = User.objects.get(pk=int(self.context['request'].data['responsible']))
        q.project = project.objects.get(pk=int(self.context['request'].data['project']))
        q.save()
        return q
