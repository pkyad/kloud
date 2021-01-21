from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from API.permissions import *
from django.db.models import Q, F
from django.http import HttpResponse
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import datetime
import json
import pytz
import requests
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from .models import *
from .serializers import *
# import tempfile
# from backports import tempfile
# from subprocess import Popen, PIPE
import subprocess
import os

class SectionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = SectionSerializer
    # queryset = Section.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id','title' , 'book','parent']

    def get_queryset(self):
        toReturn = Section.objects.all()
        if 'parent' in self.request.GET:
            return toReturn.filter(parent__isnull = True)
        else:
            return toReturn

class SectionliteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = SectionLiteSerializer
    queryset = Section.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id','title' , 'book']

class BookViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title','author']
    def get_queryset(self):
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            return Book.objects.filter(Q(title__icontains = val) | Q(author__icontains = val) )
        return Book.objects.all()

class CourseActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = CourseActivitySerializer
    queryset = CourseActivty.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['typ','paper','course']

class BookLiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = BookLiteSerializer
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title']

class QPartViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = QPartSerializer
    queryset = QPart.objects.all()

class OptionsPartViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = OptionsPartSerializer
    queryset = OptionsPart.objects.all()

class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = QuestionSerializer
    queryset = Question.objects.all().order_by('-created')
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['paper','bookSection','qtype']
    def get_queryset(self):
        if 'name' in self.request.GET:
            return Question.objects.filter(ques__icontains = self.request.GET['name'])
        if 'paper' in self.request.GET:
            return Question.objects.filter(paper = int(self.request.GET['paper']))
        else:
            return Question.objects.all()

class DownloadQuesPaper(APIView):
    permission_classes = (permissions.AllowAny, )
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        p = Paper.objects.get(pk = request.GET.get('paper',None))
        print p.pk,'***************'
        print [i.ques.pk for i in p.questions.all()]
        quesPk = list(p.questions.all().values_list('ques',flat=True))
        print quesPk
        ques=Question.objects.filter(id__in = quesPk)
        tex_body = get_template('paper_latex_template.tex').render({"ques" : ques})
        content= str(tex_body.encode('utf-8')).replace('&quot;','"').replace('39;',"'")
        fN = '%s_%s'%(p.pk,datetime.datetime.now(pytz.timezone('Asia/Kolkata')).year)
        mediaDir = os.path.join(globalSettings.BASE_DIR,'media_root')
        flname = os.path.join(mediaDir,'texFiles', 'questionPaper%s.tex'%(fN))
        f = open(flname , 'wb')
        f.write(content)
        f.close()
        cmd = ['pdflatex','-output-directory', mediaDir, '-interaction', 'nonstopmode', flname]
        proc = subprocess.Popen(cmd)
        proc.communicate()
        try:
            os.remove(os.path.join(mediaDir, 'questionPaper%s.aux'%(fN)))
            os.remove(os.path.join(mediaDir, 'questionPaper%s.log'%(fN)))
        except:
            print 'error while deleting log filesssssss'

        try:
            pdfFile = os.path.join(mediaDir,'questionPaper%s.pdf'%(fN))
            with open(pdfFile, 'r') as f:
               file_data = f.read()
            response = HttpResponse(file_data, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="questionPaper%s.pdf"' %(fN)
        except:
            response = HttpResponse(content,content_type='text/plain')
            response['Content-Disposition'] = 'attachment; filename="questionPaper%s.txt"' %(fN)

        return response

def pdfsCreation(data,name,title,author,desc):
    tex_body = get_template('book_latex_template.tex').render({"ques" : data,'name':name,'title':title,'author':author,'desc':desc})
    content= str(tex_body.encode('utf-8')).replace('&quot;','"').replace('39;',"'").replace('&lt;strong&gt;',' ').replace('&lt;/strong&gt;',' ')
    mediaDir = os.path.join(globalSettings.BASE_DIR,'media_root')
    flname = os.path.join(mediaDir,'texFiles', '%s.tex'%(name))
    f = open(flname , 'wb')
    f.write(content)
    f.close()
    cmd = ['pdflatex','-output-directory', mediaDir, '-interaction', 'nonstopmode', flname]
    proc = subprocess.Popen(cmd)
    proc.communicate()
    try:
        os.remove(os.path.join(mediaDir, '%s.aux'%(name)))
        os.remove(os.path.join(mediaDir, '%s.log'%(name)))
    except:
        print 'error while deleting log filesssssss'
    return 1

class GeneratePdf(APIView):
    permission_classes = (permissions.AllowAny, )
    renderer_classes = (JSONRenderer,)
    def post(self , request , format = None):
        print request.GET,request.POST,request.data
        if 'bookId' in request.data:
            bookObj = Book.objects.get(pk=int(request.data['bookId']))
            allQuestion = Question.objects.none()
            sectionsObjs = bookObj.sections.all()
            sectionPdfCount = 0
            for sec in sectionsObjs:
                secQuestions = Question.objects.filter(bookSection=sec)
                try:
                    name = str(sec.shortUrl)
                    print name,'nameeeeeeeeeeeeeee'
                    if sec.description:
                        desc = sec.description
                    else:
                        desc = ''
                    c = pdfsCreation(secQuestions,name,sec.title,blogObj.author,desc)
                    sectionPdfCount += int(c)
                    allQuestion = allQuestion | secQuestions
                except:
                    print name,'Secion has errors'
            print 'sections pdf doneeeeeee total {0}'.format(sectionPdfCount)
            print allQuestion.count()
            try:
                name = str(blogObj.shortUrl)
                if bookObj.description:
                    desc = bookObj.description
                else:
                    desc = ''
                b = pdfsCreation(allQuestion,name,bookObj.title,blogObj.author,desc)
                print 'book pdf also Doneeeeeee'
            except:
                print 'error while generating Bookkkkkkkkk'

        return Response({}, status = status.HTTP_200_OK)

class PaperViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny, )
    serializer_class = PaperSerializer
    def get_queryset(self):
        if 'groupId' in self.request.GET:
            return Paper.objects.filter(group = int(self.request.GET['groupId']))
        if 'name' in self.request.GET:
            return Paper.objects.filter(name__icontains = str(self.request.GET['name']),active=True)

        if 'state' in self.request.GET :
            val = self.request.GET['state']
            if val == 'old':
                return Paper.objects.filter(active = False)
            if val == 'current':
                return Paper.objects.filter(active = True)
        else:
            return Paper.objects.all()


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['activeCourse']
    def get_queryset(self):
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            return Course.objects.filter(Q(title__icontains = val)|Q(enrollmentStatus = val))
        if 'state' in self.request.GET :
            val = self.request.GET['state']
            if val == 'old':
                return Course.objects.filter(activeCourse = False)
            if val == 'current':
                return Course.objects.filter(activeCourse = True)
        return Course.objects.all()

class EnrollmentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, isAdmin, )
    serializer_class = EnrollmentSerializer
    queryset = Enrollment.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['course']

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
import urllib2

class GetCourseactivitiesAPI(APIView):
    permission_classes = (permissions.AllowAny, )
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        if 'course' in request.GET:
            courseObj = Course.objects.get(pk = request.GET['course'])
            activities = courseObj.courseActivities.all()
            quiz = courseObj.courseActivities.all().filter(typ = 'quiz').count()
            data = {'course':CourseSerializer(courseObj,many=False).data,'activities':CourseActivitySerializer(activities,many=True).data,'quiz':quiz}
        return Response(data , status = status.HTTP_200_OK)


class QuestionsAutoCreate(APIView):
    permission_classes = (permissions.AllowAny, )
    renderer_classes = (JSONRenderer,)
    def get(self , request , format = None):
        print 'auto createeeeeeeeeeeee'
        baseDir = globalSettings.BASE_DIR
        bookData = []
        sectionData = []
        questionsData = []
        with open(str(baseDir)+'/book.json') as f:
            bookData = json.load(f)
        with open(str(baseDir)+'/section.json') as f:
            sectionData = json.load(f)
        with open(str(baseDir)+'/24tutors_questions.json') as f:
            questionsData = json.load(f)
        Book.objects.all().delete()
        Section.objects.all().delete()
        QPart.objects.all().delete()
        Question.objects.all().delete()

        bookCreateData = []
        for i in bookData:
            if i['dp']:
                bookObj = Book.objects.create(pk=i['pk'],title=i['title'],description=i['description'],author=i['author'],ISSN=i['ISSN'],volume=i['volume'],version=i['version'],license=i['license'])
                try:
                    file_name = i['dp'].split('/')[-1].split('_')[-1]
                    img_temp = NamedTemporaryFile(delete=True)
                    img_temp.write(urllib2.urlopen(i['dp']).read())
                    img_temp.flush()
                    bookObj.dp.save(file_name, File(img_temp))
                except:
                    pass
            else:
                bookCreateData.append(Book(pk=i['pk'],title=i['title'],description=i['description'],author=i['author'],ISSN=i['ISSN'],volume=i['volume'],version=i['version'],license=i['license']))

        Book.objects.bulk_create(bookCreateData)

        sectionCreateData = []
        for i in sectionData:
            if i['book']:
                bk = Book.objects.get(pk=i['book'])
                sectionCreateData.append(Section(pk=i['pk'],title=i['title'],shortUrl=i['shortUrl'],book=bk,sequence=i['sequence']))
        Section.objects.bulk_create(sectionCreateData)

        for i in questionsData:
            if i['user']:
                usr = User.objects.get(pk=i['user'])
                bookSection = None

                if i['bookSection']:
                    bookSection = Section.objects.get(pk=i['bookSection']['pk'])
                quesObj = Question.objects.create(pk=i['pk'],ques=i['ques'],status=i['status'],archived=i['archived'],level=i['level'],marks=i['marks'],qtype=i['qtype'],codeLang=i['codeLang'],typ=i['typ'],solutionVideoLink=i['solutionVideoLink'],objectiveAnswer=i['objectiveAnswer'],user=usr,bookSection=bookSection)

                try:
                    if i['solutionVideo']:
                        file_name = i['solutionVideo'].split('/')[-1].split('_')[-1]
                        img_temp = NamedTemporaryFile(delete=True)
                        img_temp.write(urllib2.urlopen(i['solutionVideo']).read())
                        img_temp.flush()
                        quesObj.solutionVideo.save(file_name, File(img_temp))
                except:
                    pass

                for j in i['quesParts']:
                    qpObj , created = QPart.objects.get_or_create(pk=j['pk'],mode=j['mode'],txt=j['txt'])
                    try:
                        if created and j['image']:
                            file_name = j['image'].split('/')[-1].split('_')[-1]
                            img_temp = NamedTemporaryFile(delete=True)
                            img_temp.write(urllib2.urlopen(j['image']).read())
                            img_temp.flush()
                            qpObj.image.save(file_name, File(img_temp))
                    except:
                        pass
                    quesObj.quesParts.add(qpObj)

                for j in i['optionsParts']:
                    qpObj , created = QPart.objects.get_or_create(pk=j['pk'],mode=j['mode'],txt=j['txt'])
                    try:
                        if created and j['image']:
                            file_name = j['image'].split('/')[-1].split('_')[-1]
                            img_temp = NamedTemporaryFile(delete=True)
                            img_temp.write(urllib2.urlopen(j['image']).read())
                            img_temp.flush()
                            qpObj.image.save(file_name, File(img_temp))
                    except:
                        pass
                    quesObj.optionsParts.add(qpObj)

                for j in i['solutionParts']:
                    qpObj , created = QPart.objects.get_or_create(pk=j['pk'],mode=j['mode'],txt=j['txt'])
                    try:
                        if created and j['image']:
                            file_name = j['image'].split('/')[-1].split('_')[-1]
                            img_temp = NamedTemporaryFile(delete=True)
                            img_temp.write(urllib2.urlopen(j['image']).read())
                            img_temp.flush()
                            qpObj.image.save(file_name, File(img_temp))
                    except:
                        pass
                    quesObj.solutionParts.add(qpObj)
                print 'quess createddddddddddd',i['pk']
        return Response([] , status = status.HTTP_200_OK)
