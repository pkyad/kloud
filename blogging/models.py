from __future__ import unicode_literals
from django.contrib.auth.models import User, Group
from time import time
from django.db import models
from django.db import models

# Create your models here.

def getSectionImagePath(instance , filename ):
    return 'articles/content/%s_%s' % (str(time()).replace('.', '_'), filename)
def getArticleImagePath(instance , filename ):
    return 'articles/content/%s' % ( filename)

LANG_CHOICES = (
    ('hi' , 'hi'),
    ('en' , 'en'),
)

CONTENT_SECTION_CHOICES = (
    ('html' , 'html'),
    ('image' , 'image'),
    ('video' , 'video'),
)

class ArticleSection(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    header = models.TextField(max_length= 700 , null = True)
    shortTitle = models.TextField(max_length= 700 , null = True) # also the image title in case of image post
    content = models.TextField(max_length=20000 , null = True)
    content_text =  models.TextField(max_length=20000 , null = True)
    img = models.ImageField(upload_to = getSectionImagePath , null = True)
    altTexts = models.CharField(max_length = 1000 , null = True ) # comma seperated values
    link = models.CharField(max_length = 200 , null = True)
    typ = models.CharField(choices = CONTENT_SECTION_CHOICES , default = 'html' , max_length = 20)
    imageTitle = models.CharField(max_length = 200 , null = True)
    index = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ('index', )

class InternalComment(models.Model):
    comment = models.CharField(max_length = 1000 , null = False)
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(User , related_name='articlesReviewComment' , null = False)

STATUS_CHOICES = (
    ('created' , 'created'),
    ('reviewed' , 'reviewed'),
    ('published' , 'published'),
    ('archived' , 'archived'),
    ('submitted' , 'submitted'),
)

class Article(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now=True , null = True)
    title = models.CharField(max_length = 1000 , null = False)
    articleUrl = models.CharField(max_length = 1000 , null = False)
    author = models.ForeignKey(User , related_name='articlesWritten' , null = True)
    contentWriter = models.ForeignKey(User , related_name='contents' , null = False)
    lang = models.CharField(max_length = 20 , null = False , default = 'hi' , choices = LANG_CHOICES)
    publishingChannel = models.CharField(max_length = 50 , null = True)
    featuredContent = models.BooleanField(default = False)
    sensitive = models.BooleanField(default = False)
    scheduleTime = models.DateTimeField(null = False)
    published = models.BooleanField(default = False)
    summary = models.TextField(max_length= 5000 , null = True , blank = True)
    tags = models.TextField(max_length= 1000 , null = True,blank = True)
    #seo section
    metaTitle =  models.CharField(max_length = 1000 , null = False)
    metaDescription =  models.CharField(max_length = 5000 , null = True, blank = True)
    keywords = models.TextField(max_length= 1000 , null = True , blank = True)
    qb1 = models.CharField(max_length = 700 , null = True , blank = True)
    qb2 = models.CharField(max_length = 700 , null = True, blank = True)
    qb3 = models.CharField(max_length = 700 , null = True, blank = True)
    qb4 = models.CharField(max_length = 700 , null = True, blank = True)
    qb5 = models.CharField(max_length = 700 , null = True, blank = True)
    qb6 = models.CharField(max_length = 700 , null = True, blank = True)
    qb7 = models.CharField(max_length = 700 , null = True, blank = True)
    contents = models.ManyToManyField(ArticleSection , blank = True)
    content_type = models.CharField(max_length = 10 , null = True)
    reviewer = models.ForeignKey(User , related_name='articlesReviewed' , null = True)
    reviewDatetime = models.DateTimeField(null = True)
    reviewComments = models.ManyToManyField(InternalComment , blank = True )
    status = models.CharField(choices = STATUS_CHOICES, null = False , default = 'created' , max_length = 20)
    read_time = models.PositiveIntegerField(blank=True,null=True)
    ogImg = models.ImageField(upload_to = getArticleImagePath , null = True)

    def get_absolute_url(self):
        return '/'+ self.articleUrl

class Comment(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    reviewer = models.ForeignKey(User , related_name='comment' , null = True)
    txt = models.CharField(max_length = 1000 , null = True)
    article = models.ForeignKey(Article , null = False)
    verified =  models.BooleanField(default = False)
    name = models.CharField(max_length = 250 , null = True)
    email = models.CharField(max_length = 250 , null = True)
