from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from gitweb.serializers import repoLiteSerializer, commitNotificationSerializer
from gitweb.models import commitNotification
from projects.serializers import projectLiteSerializer
from projects.models import project
import re
import datetime

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
        return m

class subTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = subTask
        fields = ('pk' , 'title' , 'status')
    def create(self , validated_data):
        st = subTask(**validated_data)
        st.task = task.objects.get(pk = self.context['request'].data['task'])
        st.user = self.context['request'].user
        st.save()
        return st
    def update(self , instance , validated_data):
        if 'title' in validated_data:
            instance.title = validated_data['title']
        if 'status' in validated_data:
            instance.status = validated_data['status']
        instance.save()
        return instance

class taskSerializer(serializers.ModelSerializer):
    subTasks = subTasksSerializer(many = True , read_only = True)
    files = mediaSerializer(many = True , read_only = True)
    project = projectLiteSerializer(many = False , read_only = True)
    class Meta:
        model = task
        fields = ( 'pk', 'title' , 'description' , 'files', 'followers', 'user' , 'created', 'dueDate', 'to', 'subTasks', 'project', 'personal' , 'completion', 'timeSpent', 'timerStartedAt')
        read_only_fields = ('user','followers',)
    def create(self , validated_data):
        t = task(**validated_data)

        mentions = re.findall("(?<![@\w])@(\w{1,25})", t.title)
        hashtags = re.findall("(?<=#)(.*?)(?=\))", t.title)

        try:
            t.to = User.objects.get(username = mentions[0])
            t.title = t.title.replace( '@'+ mentions[0] , '' )
        except:
            pass

        try:
            t.project = project.objects.get(pk = hashtags[0].split('(')[-1] )
            t.title = t.title.replace( '#'+ hashtags[0] + ')' , '' )
        except:
            pass



        req = self.context['request']
        t.user = req.user
        if t.to == None:
            t.to = req.user
        if 'project' in req.data:
            t.project = project.objects.get(pk = req.data['project'])
        t.save()

        if 'followers' in req.data:
            for u in req.data['followers']:
                t.followers.add(User.objects.get(pk=u))

        for i in range(int(req.data['filesCount'])):
            f = req.FILES['file' + str(i)]
            print dir(req.FILES['file' + str(i)])
            m = media(user = req.user , name = f.name , attachment = f)
            m.save()

            t.files.add(m)

        return t
    def update(self , instance , validated_data):
        data = self.context['request'].data
        if 'followers' in data:
            for u in data['followers']:
                instance.followers.add(User.objects.get(pk=u))
        if 'files' in data:
            for f in data['files']:
                instance.files.add(media.objects.get(pk = f))

        if 'completion' in validated_data:
            instance.completion = validated_data['completion']

        if 'timerStartedAt' in validated_data:
            instance.timerStartedAt = validated_data['timerStartedAt']

        if 'timeSpent' in validated_data:
            instance.timeSpent = validated_data['timeSpent']

        if 'filesCount' in data:
            for i in range(int(data['filesCount'])):
                f = self.context['request'].FILES['file' + str(i)]
                m = media(user = self.context['request'].user , name = f.name , attachment = f)
                m.save()
                instance.files.add(m)

        try:
            instance.dueDate = validated_data['dueDate']
        except:
            pass

        try:
            instance.title = validated_data['title']
        except:
            pass

        try:
            instance.description = validated_data['description']
        except:
            pass

        try:
            instance.to = validated_data['to']
        except:
            pass


        instance.save()
        return instance

class timelineItemSerializer(serializers.ModelSerializer):
    commit = commitNotificationSerializer(many = False , read_only = True)
    class Meta:
        model = timelineItem
        fields = ('pk','created' , 'user' , 'category' , 'text' , 'commit' , 'task')
        read_only_fields = ('user',)
    def create(self , validated_data):
        i = timelineItem(**validated_data)
        req = self.context['request']
        if i.category == 'git':
            i.commit = commitNotification.objects.get(pk = req.data['commit'])
        i.user = req.user
        i.save()
        return i
    def update(self , instance , validated_data):
        raise PermissionDenied({'NOT_ALLOWED'})
