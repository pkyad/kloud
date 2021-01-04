from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string
from HR.serializers import userSearchSerializer,userSerializer,userLiteSerializer

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('pk' , 'title' , 'book','sequence' ,'shortUrl','description','seoTitle')


class BookSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many = True , read_only = True)
    class Meta:
        model = Book

        fields = ('pk' , 'title' , 'description', 'dp', 'author', 'ISSN'  , 'volume', 'version', 'license' ,'sections','topic','subject', )

    def create(self , validated_data):
        b = Book(**validated_data)
        b.save()
        return b

    def update(self , instance , validated_data):
        for key in ['title' , 'description', 'dp', 'author', 'ISSN'  , 'volume', 'version', 'license' ,'topic','subject', ]:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass

        instance.save()
        return instance

class QPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QPart
        fields = ('pk' , 'mode' , 'txt', 'image' ,'sequence')

class BookLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('pk'  , 'title', 'dp', 'author','volume')

class SectionLiteSerializer(serializers.ModelSerializer):
    book = BookLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Section
        fields = ('pk', 'title' , 'book' ,'shortUrl')

class QuestionSerializer(serializers.ModelSerializer):
    bookSection = SectionLiteSerializer(many = False , read_only = True)

    class Meta:
        model = Question

        fields = ('pk' , 'created' , 'updated',  'marks' , 'qtype','ques'  ,'bookSection', 'paper'   )
        read_only_fields = ('archived', 'approved', 'reviewed', 'forReview' , 'user')

    def create(self , validated_data):
        print '*****************'
        print validated_data,self.context['request'].data
        q = Question(**validated_data)
        if 'bookSection' in self.context['request'].data:
            q.bookSection = Section.objects.get(pk=self.context['request'].data['bookSection'])
        q.save()
        return q

    def update(self , instance , validated_data):
        if 'qPartToAdd' in self.context['request'].data:
            instance.quesParts.add(QPart.objects.get(pk = self.context['request'].data['qPartToAdd'] ))

        if 'qOptionToAdd' in self.context['request'].data:
            instance.optionsParts.add(QPart.objects.get(pk = self.context['request'].data['qOptionToAdd'] ))

        if 'qSolutionToAdd' in self.context['request'].data:
            instance.solutionParts.add(QPart.objects.get(pk = self.context['request'].data['qSolutionToAdd'] ))

        if 'ques' in validated_data:
            instance.ques = validated_data.pop('ques')
            instance.qtype = validated_data.pop('qtype')
            if 'objectiveAnswer' in validated_data:
                instance.objectiveAnswer = validated_data.pop('objectiveAnswer')
            if 'solutionVideoLink' in validated_data:
                instance.solutionVideoLink = validated_data.pop('solutionVideoLink')

        if 'solutionVideo' in validated_data:
            instance.solutionVideo = validated_data.pop('solutionVideo')

        if 'typ' in validated_data:
            instance.typ = validated_data.pop('typ')

        if instance.qtype not in ['mcq' , 'mcc']:
            instance.optionsParts.clear()

        instance.save()

        return instance

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ('pk' , 'created' , 'updated', 'active' , 'user','name','timelimit','description')
        read_only_fields = ('user', 'questions')
    def create(self , validated_data):
        m = Paper(**validated_data)
        m.user = self.context['request'].user
        if 'name' in self.context['request'].data:
            m.name = self.context['request'].data['name']
        if 'timelimit' in self.context['request'].data:
            m.timelimit = self.context['request'].data['timelimit']
        if 'description' in self.context['request'].data:
            m.description = self.context['request'].data['description']
        m.save()
        print self.context['request'].data['questions']
        for i in self.context['request'].data['questions']:
            i['ques']=Question.objects.get(id=i['ques'])

        m.save()
        return m

    def update(self , instance , validated_data):
        if 'questions' in self.context['request'].data:
            instance.questions.clear()
            for i in self.context['request'].data['questions']:
                i['ques']=Question.objects.get(id=i['ques'])
                pq = PaperQues(**i)
                pq.user = self.context['request'].user
                pq.save()
                instance.questions.add(pq)
        if 'name' in self.context['request'].data:
            instance.name = self.context['request'].data['name']
        if 'timelimit' in self.context['request'].data:
            instance.timelimit = self.context['request'].data['timelimit']
        if 'description' in self.context['request'].data:
            instance.description = self.context['request'].data['description']
        instance.save()
        return instance

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ('pk' , 'created' , 'course', 'addedBy', 'accepted', 'user' , 'active' )
        read_only_fields = ('addedBy',)
    def create(self , validated_data):
        e = Enrollment(**validated_data)
        e.addedBy = self.context['request'].user
        e.accepted = True
        e.save()
        return e

class CourseSerializer(serializers.ModelSerializer):
    enrollments = EnrollmentSerializer(many = True , read_only = True)
    instructor = userSearchSerializer(many = False , read_only = True)
    class Meta:
        model = Course

        fields = ('pk' , 'created' , 'updated', 'enrollmentStatus', 'instructor' , 'user' , 'description' , 'title' , 'enrollments' ,'dp','urlSuffix','sellingPrice','discount')
        read_only_fields = ('user', 'TAs')
    def create(self , validated_data):
        c = Course(**validated_data)
        c.user = self.context['request'].user
        c.instructor = User.objects.get(pk = self.context['request'].data['instructor'])
        c.save()
        c.save()
        return c
    def update(self , instance , validated_data):
        for key in ['enrollmentStatus', 'description' , 'title' , 'enrollments' ,'user','dp','urlSuffix','sellingPrice','discount']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'instructor' in self.context['request'].data:
            instance.instructor = User.objects.get(pk =self.context['request'].data['instructor'])
        instance.save()
        return instance
