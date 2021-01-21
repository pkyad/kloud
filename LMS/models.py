from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from time import time
from clientRelationships.models import Contact
# Create your models here.
def getQAttachmentPath(instance , filename ):
    return 'lms/questions/%s_%s' % (str(time()).replace('.', '_'), filename)

def getCourseDPAttachmentPath(instance , filename ):
    return 'lms/DP/%s_%s' % (str(time()).replace('.', '_'), filename)

def getVideoPath(instance , filename ):
    return 'lms/videos/%s_%s' % (str(time()).replace('.', '_'), filename)


def getVideoThumbnailPath(instance , filename ):
    return 'lms/videoThumbnail/%s_%s' % (str(time()).replace('.', '_'), filename)

PART_TYPE_CHOICES = (
    ('text' , 'text'),
    ('image' , 'image'),
)


class Book(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    title = models.CharField(max_length = 100 , null = False)
    description = models.TextField(max_length=2000 , null = True)
    dp = models.FileField(upload_to = getCourseDPAttachmentPath , null = True)
    author = models.CharField(max_length = 100 , null = True)
    ISSN = models.CharField(max_length = 100 , null = True)
    volume = models.CharField(max_length = 100 , null = True)
    version = models.CharField(max_length = 100 , null = True)
    license = models.CharField(max_length = 100 , null = True)
    topic = models.CharField(max_length = 200 , null = True)
    subject = models.CharField(max_length = 200 , null = True)
    shortUrl = models.CharField(max_length = 100 , null = True , unique = True)

class Section(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    title = models.CharField(max_length = 100 , null = False)
    sequence = models.PositiveIntegerField(null = True)
    book = models.ForeignKey(Book , null = False , related_name='sections')
    shortUrl = models.CharField(max_length = 100 , null = True , unique = True)
    description = models.TextField(max_length=2000 , null = True)
    seoTitle = models.CharField(max_length = 100 , null = True , unique = True)
    parent = models.ForeignKey("self" , null = True, related_name="children")

    def get_absolute_url(self):
        return '/'+ self.shortUrl + '/'

QUESTION_LEVEL_CHOICES = (
    ("easy", "easy"),
    ("moderate", "moderate"),
    ("difficult", "difficult"),
)

QUESTION_STATUS_CHOICES = (
    ('submitted' , 'submitted'),
    ('reviewed' , 'reviewed'),
    ('approved' , 'approved'),
)


QUESTION_TYPE_CHOICES = (
    ("mcq", "Single Correct Choice"),
    ("mcc", "Multiple Correct Choices"),
    ("code", "Code"),
    ("upload", "Assignment Upload"),
    ("integer", "Answer in Integer"),
    ("string", "Answer in String"),
    ("float", "Answer in Float"),
)

class Paper(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    active = models.BooleanField(default = True)
    user = models.ForeignKey(User , null = False , related_name='papersAuthored')
    name = models.CharField(null = True , max_length = 100)
    description = models.TextField(null = True)
    timelimit = models.PositiveIntegerField(default= 0)
    contacts = models.ManyToManyField(Contact , related_name='papers' )
class Question(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    qtype = models.CharField(choices = QUESTION_TYPE_CHOICES , default = 'mcq' , null = False, max_length = 10)
    ques = models.TextField(max_length = 5000 , null = False)
    marks = models.PositiveIntegerField(null=True)
    paper = models.ForeignKey(Paper , null = True , related_name = 'questions')
    bookSection = models.ForeignKey(Section , null = True , related_name='questionss')
    isLatex = models.BooleanField(default = False)


class OptionsPart(models.Model):
    mode = models.CharField(choices = PART_TYPE_CHOICES , default = 'text' , null = False, max_length = 10)
    rtxt = models.TextField(max_length = 2000 , null = True)
    parent = models.ForeignKey(Question , related_name = 'options' , null = False)
    image = models.FileField(upload_to = getQAttachmentPath , null = True)
    sequence = models.PositiveIntegerField(null = True)
    answer = models.BooleanField(default = False)
    class Meta:
        ordering = ['sequence']


class QPart(models.Model):
    mode = models.CharField(choices = PART_TYPE_CHOICES , default = 'text' , null = False, max_length = 10)
    txt = models.TextField(max_length = 2000 , null = True)
    parent = models.ForeignKey(Question , related_name = 'parts' , null = False)
    image = models.FileField(upload_to = getQAttachmentPath , null = True)
    sequence = models.PositiveIntegerField(null = True)
    class Meta:
        ordering = ['sequence']


CORRECTION_CHOICES = (
    ('yes' , 'yes'),
    ('no' , 'no'),
    ('partial' , 'partial'),
)



STUDY_MATERIAL_TYPE = (
    ('file' , 'file'),
    ('presentation' , 'presentation'),
    ('video' , 'video'),
    ('quiz' , 'quiz'),
    ('notes' , 'notes'),
    ('announcement' , 'announcement'),
)

ENROLLMENT_STATUS_CHOICES = (
    ('open' , 'open'),
    ('onInvitation' , 'onInvitation'),
    ('admin' , 'admin'),
    ('onRequest' , 'onRequest'),
    ('closed' , 'closed'),
)

class Course(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    title = models.CharField(max_length = 100 , null = False)
    enrollmentStatus = models.CharField(choices = ENROLLMENT_STATUS_CHOICES , max_length = 20 , default = 'open')
    instructor = models.ForeignKey(User , related_name='lmsCoursesInstructing' , null = True)
    user = models.ForeignKey(User , related_name='courseCreated' , null = False)
    description = models.TextField(max_length=2000 , null = False)
    dp = models.FileField(upload_to = getCourseDPAttachmentPath , null = True)
    urlSuffix = models.CharField(max_length = 100 , null = True)
    sellingPrice = models.CharField(max_length = 100 , null = True)
    discount = models.CharField(max_length = 100 , null = True)
    contacts = models.ManyToManyField(Contact , related_name='students' )
    activeCourse = models.BooleanField(default = True)
    topic = models.CharField(max_length = 250 , null = True)

class Enrollment(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    course = models.ForeignKey(Course , null = False , related_name='enrollments')
    addedBy = models.ForeignKey(User , related_name='lmsUsersAdded')
    accepted = models.BooleanField(default = True)
    user = models.ForeignKey(User , null = False)
    active = models.BooleanField(default = True)

ACTIVITY_TYP_CHOICES = (
    ('video','video'),
    ('notes','notes'),
    ('file','file'),
    ('homework','homework'),
    ('quiz','quiz'),('class','class')
)

class CourseActivty(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    attachment = models.FileField(upload_to = getVideoPath , null = True)
    thumbnail = models.ImageField(upload_to = getVideoThumbnailPath , null = True)
    announcer = models.ForeignKey(User ,null = False , related_name ="announcements")
    typ = models.CharField(choices = ACTIVITY_TYP_CHOICES , max_length = 10 , null = True)
    paper = models.ForeignKey(Paper , null = True , related_name="paper")
    paperDueDate =  models.DateField(auto_now = False,null = True)
    time = models.DateTimeField(auto_now = False,null= True)
    venue =  models.CharField(max_length = 100 , null = True)
    txt =  models.TextField(null = True)
    meetingId = models.CharField(max_length = 100 , null = True)
    date = models.DateTimeField(auto_now = False,null= True)
    paper = models.ForeignKey(Paper , null = True , related_name="homeworkPaper")
    course = models.ForeignKey(Course , null = True , related_name='courseActivities')
    title =  models.CharField(max_length = 250 , null = True)
    description =  models.TextField(null = True)
    parent = models.ForeignKey("self" , null = True, related_name="activitychildren")
    daily = models.BooleanField(default = False)
    weekly = models.BooleanField(default = False)
    monthly = models.BooleanField(default = False)
