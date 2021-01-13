from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
import random, string
from HR.serializers import userSearchSerializer,userSerializer,userLiteSerializer
from clientRelationships.models import *



class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class SectionLiteSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)
    class Meta:
        model = Section
        fields = ( 'pk' , 'children', 'title' )


class SectionSerializer(serializers.ModelSerializer):
    children = SectionLiteSerializer(many=True,read_only=True)
    class Meta:
        model = Section
        fields = ('pk' , 'title' , 'book','sequence' ,'parent','shortUrl','description','seoTitle','children')


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book

        fields = ('pk' , 'title' , 'description', 'dp', 'author', 'ISSN'  , 'volume', 'version', 'license' ,'topic','subject', )

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
    user = userSearchSerializer(many = False , read_only = True)
    class Meta:
        model = Paper
        fields = ('pk' , 'created' , 'updated', 'active' , 'user','name','timelimit','description')
        read_only_fields = ('user',)
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

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('pk' , 'created' , 'name', 'mobile', 'email' )

class CourseSerializer(serializers.ModelSerializer):
    instructor = userSearchSerializer(many = False , read_only = True)
    contacts = ContactSerializer(many = True , read_only = True)
    class Meta:
        model = Course

        fields = ('pk' , 'created' , 'updated', 'enrollmentStatus', 'instructor' , 'user' , 'description' , 'title'  ,'dp','urlSuffix','sellingPrice','discount','contacts')
        read_only_fields = ('user', 'TAs')
    def create(self , validated_data):
        c = Course(**validated_data)
        c.user = self.context['request'].user
        c.instructor = User.objects.get(pk = self.context['request'].data['instructor'])
        c.save()
        c.save()
        return c
    def update(self , instance , validated_data):
        for key in ['enrollmentStatus', 'description' , 'title' , 'enrollments' ,'user','dp','urlSuffix','sellingPrice','discount','contacts']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'instructor' in self.context['request'].data:
            instance.instructor = User.objects.get(pk =self.context['request'].data['instructor'])
        if 'contacts' in self.context['request'].data:
            instance.contacts.clear()
            for c in self.context['request'].data['contacts']:
                instance.contacts.add(Contact.objects.get(pk = c))
        instance.save()
        return instance




class CourseActivitySerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=False,read_only=True)
    paper = PaperSerializer(many=False,read_only=True)
    class Meta:
        model = CourseActivty
        fields = ('pk' , 'created' , 'course', 'attachment', 'thumbnail', 'announcer' , 'typ','paper','paperDueDate','time','venue','txt','meetingId','date','paper','course','title','description')
        read_only_fields = ('announcer',)
    def create(self , validated_data):
        e = CourseActivty(**validated_data)
        data = self.context['request'].data
        e.announcer = self.context['request'].user
        if 'paper' in data:
            paperObj =  Paper.objects.get(pk=data['paper'])
            e.paper = paperObj
        if 'course' in data:
            courseObj =  Course.objects.get(pk=data['course'])
            e.course = courseObj
        e.save()
        return e
