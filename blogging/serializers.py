from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from HR.serializers import userSearchSerializer
from rest_framework.response import Response
from PIL import Image


def flat( *nums ):
	'Build a tuple of ints from float or integer arguments. Useful because PIL crop and resize require integer points.'

	return tuple( int(round(n)) for n in nums )
class Size(object):
	def __init__(self, pair):
		self.width = float(pair[0])
		self.height = float(pair[1])
	@property
	def aspect_ratio(self):
		return self.width / self.height
	@property
	def size(self):
		return flat(self.width, self.height)

def cropped_thumbnail(img, size):
    '''
    Builds a thumbnail by cropping out a maximal region from the center of the original with
    the same aspect ratio as the target size, and then resizing. The result is a thumbnail which is
    always EXACTLY the requested size and with no aspect ratio distortion (although two edges, either
    top/bottom or left/right depending whether the image is too tall or too wide, may be trimmed off.)
    '''
    original = Size(img.size)
    target = Size(size)
    if target.aspect_ratio > original.aspect_ratio:
        # image is too tall: take some off the top and bottom
        scale_factor = target.width / original.width
        crop_size = Size( (original.width, target.height / scale_factor) )
        top_cut_line = (original.height - crop_size.height) / 2
        img = img.crop( flat(0, top_cut_line, crop_size.width, top_cut_line + crop_size.height) )
    elif target.aspect_ratio < original.aspect_ratio:
        # image is too wide: take some off the sides
        scale_factor = target.height / original.height
        crop_size = Size( (target.width/scale_factor, original.height) )
        side_cut_line = (original.width - crop_size.width) / 2
        img = img.crop( flat(side_cut_line, 0,  side_cut_line + crop_size.width, crop_size.height) )
    return img.resize(target.size, Image.ANTIALIAS)

import html2text
from io import StringIO

def generateImages(a):
    Picture = Image.open(a.img.path)
    Picture = cropped_thumbnail(Picture, (1200 , 675))
    extension = a.img.name.split('.')[-1]
    name = a.img.name.split('/')[-1].split('.')[0]
    print name , extension

    if extension == 'png':
        exten = 'PNG'
    else:
        exten = 'JPEG'
    Picture.save(  os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "." + extension ) , exten)


    # Small - 360*203.38 px
    #
    # Medium - 720*406.77 px
    #
    # Large - 1200*675 px (original size but minified version)
    #
    # Thumnail - 200*113 px
    Picture.thumbnail((720, 406.77), Image.ANTIALIAS)
    Picture.save( os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_medium." + extension ) , exten, optimize=True)

    Picture.thumbnail((360, 203.38), Image.ANTIALIAS)
    Picture.save( os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_small." + extension ) , exten, optimize=True)


    Picture.thumbnail((200, 113), Image.ANTIALIAS)
    Picture.save( os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_thumbnail." + extension ) , exten, optimize=True)

    path = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_thumbnail_c." + extension )
    path2 = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_small_c." + extension )
    path3 = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_medium_c." + extension )
    path4 =  os.path.join(globalSettings.BASE_DIR , 'media_root' , 'articles' , 'content' , name + "_c." + extension )


    os.system( 'convert %s -sampling-factor 4:2:0 -strip -quality 70 -interlace PNG -colorspace RGB %s'%( path.replace('_c' , '') , path.replace('.png', '.jpg') ) )
    os.system( 'convert %s -sampling-factor 4:2:0 -strip -quality 70 -interlace PNG -colorspace RGB %s'%( path2.replace('_c' , '') , path2.replace('.png', '.jpg') ) )
    os.system( 'convert %s -sampling-factor 4:2:0 -strip -quality 70 -interlace PNG -colorspace RGB %s'%( path3.replace('_c' , '') , path3.replace('.png', '.jpg') ) )
    os.system( 'convert %s -sampling-factor 4:2:0 -strip -quality 70 -interlace PNG -colorspace RGB %s'%( path4.replace('_c' , '') , path4.replace('.png', '.jpg') ) )

class ArticleSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleSection
        fields = ( 'pk', 'header' , 'shortTitle' , 'content' ,'img' , 'altTexts' , 'link'  , 'typ' , 'imageTitle' , 'index' )
    def create(self , validated_data):
        a = ArticleSection(**validated_data)
        if 'content' in  self.context['request'].data:
            if self.context['request'].data['content']!=None and self.context['request'].data['content'] != "":
                a.content_text = html2text.html2text(a.content)

        if (a.shortTitle == "null"):
          a.shortTitle = None
        if (a.altTexts == "null"):
          a.altTexts = None
        if (a.imageTitle == "null"):
          a.imageTitle = None
        if (a.content == "null"):
          a.content = None
        if (a.link == "null"):
          a.link = None
        if (a.header == "null"):
          a.header = None

        a.save()
        try:
            print "will do minification : " , 'skipMinification' not in self.context['request'].GET
            if 'skipMinification' not in self.context['request'].GET:
                generateImages(a)
        except:
            pass
        return a
    def update(self , instance , validated_data):
        fls = [ 'pk', 'header' , 'shortTitle' , 'content' ,'img' , 'altTexts' , 'link'  , 'typ' , 'imageTitle', 'index']
        for key in fls:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'content' in  self.context['request'].data:
            if self.context['request'].data['content']!=None and self.context['request'].data['content'] != "":
                instance.content_text = html2text.html2text(self.context['request'].data['content'])

        if 'clearImage' in self.context['request'].data:
            instance.img = None

        if (instance.shortTitle == "null"):
          instance.shortTitle = None
        if (instance.altTexts == "null"):
          instance.altTexts = None
        if (instance.imageTitle == "null"):
          instance.imageTitle = None
        if (instance.content == "null"):
          instance.content = None
        if (instance.link == "null"):
          instance.link = None

        instance.save()
        try:
            if 'skipMinification' not in self.context['request'].GET:
                generateImages(instance)
        except:
            pass
        instance.save()
        return instance



class ArticleSerializer(serializers.ModelSerializer):
    author = userSearchSerializer(many = False , read_only = True)
    contents = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ('pk','updated','created' , 'title' , 'articleUrl' , 'author' ,'contentWriter' , 'lang'  ,  'publishingChannel' , 'featuredContent' , 'sensitive' , 'scheduleTime' , 'published' , 'summary' , 'tags' , 'metaTitle' , 'metaDescription' , 'keywords' ,  'qb1' , 'qb2' , 'qb3' , 'qb4' , 'qb5' , 'qb6' , 'qb7' , 'content_type' , 'reviewer' , 'reviewDatetime'  , 'status' ,'contents' ,'read_time','ogImg','category')
        read_only_fields = ('contentWriter' , 'author' , 'contents','division' )
    def get_contents(self , obj):
        return ArticleSectionSerializer(obj.contents.all().order_by('index'),  many=True).data

    def create(self , validated_data):
        a = Article(**validated_data)

        a.contentWriter = self.context['request'].user
        a.division = self.context['request'].user.designation.division
        if 'author__id' in self.context['request'].data:
            a.author = User.objects.get(pk =self.context['request'].data['author__id'])

        # a.typ = Typ.objects.get(pk = self.context['request'].data['typ__id'])
        a.articleUrl = a.articleUrl

        a.save()

        for c in self.context['request'].data['contents__ids'].split(','):
            a.contents.add(ArticleSection.objects.get(pk = c))
        a.save()
        return a

    def update(self , instance , validated_data):
        print self.context,'llllllllllll'
        if 'action' in  self.context['request'].data:
            if self.context['request'].data['action']=='publish':
                instance.published = True
                instance.scheduleTime = datetime.datetime.now()
                instance.save()
            elif self.context['request'].data['action']=='unpublish':
                instance.published = False
                instance.save()
            return instance
        fls = ['title' , 'articleUrl' , 'lang' , 'publishingChannel' , 'featuredContent' , 'sensitive' , 'scheduleTime' , 'published' , 'summary' , 'tags' , 'metaTitle' , 'metaDescription' , 'keywords' , 'qb1' , 'qb2' , 'qb3' , 'qb4' , 'qb5' , 'qb6' , 'qb7' , 'contents' , 'reviewer' , 'reviewDatetime'  , 'status' , 'content_type','read_time','ogImg','category']
        for key in fls:
            try:
                if key in ['qb1' , 'qb2' , 'qb3' , 'qb4' , 'qb5' , 'qb6' , 'qb7'] and (validated_data[key] == "" or validated_data[key] is None):
                    validated_data[key] = None
                setattr(instance , key , validated_data[key])
            except:
                if key in ['qb1' , 'qb2' , 'qb3' , 'qb4' , 'qb5' , 'qb6' , 'qb7']:
                    setattr(instance , key , None)
                pass
        instance.contentWriter = self.context['request'].user
        instance.author = None
        if 'author__id' in self.context['request'].data:
            instance.author = User.objects.get(pk =self.context['request'].data['author__id'])
        # instance.typ = Typ.objects.get(pk = self.context['request'].data['typ__id'])
        instance.articleUrl = instance.articleUrl.replace('-' , ' ').strip().replace(' ' , '-')
        instance.contents.clear()
        instance.save()
        for c in self.context['request'].data['contents__ids'].split(','):
            instance.contents.add(ArticleSection.objects.get(pk = c))
        instance.save()
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    reviewer = userSearchSerializer(many = False , read_only = True)
    article = ArticleSerializer(many = False , read_only = True)
    class Meta:
        model = Comment
        fields = ( 'pk', 'created' , 'reviewer' , 'txt' , 'article' , 'verified' , 'name' , 'email' )
    def create(self , validated_data):
        a = Comment(**validated_data)
        if 'article' in self.context['request'].data:
            a.article = Article.objects.get(pk = self.context['request'].data['article'])
        a.save()
        return a
    def update(self , instance , validated_data):
        instance.verified = self.context['request'].data['verified']
        instance.reviewer = self.context['request'].user
        instance.save()
        return instance
