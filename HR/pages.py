from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect , get_object_or_404
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
from django.core.exceptions import ObjectDoesNotExist , SuspiciousOperation
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.views.decorators.cache import never_cache
from ERP.models import *
from LMS.models import *
from website.models import *
from recruitment.models import *
from blogging.models import *
from django.db.models import Q
from django.contrib.auth import authenticate , login , logout
from bs4 import BeautifulSoup
import json
from django.template import Context, Template
# Related to the REST Framework
from django.http import HttpResponse
import os

import basehash
hash_fn = basehash.base36()
def page1(request):
    context={}

    return render(request, 'app.HR.page1.html',context)

def storeHome(request):
    context={}
    firstApp =application.objects.all()[0]
    secondApp =application.objects.all()[1]
    data= application.objects.all()[2:]
    if request.user.is_authenticated() == True:
        login(request , request.user, backend='django.contrib.auth.backends.ModelBackend')
    # print request.user,'89498389838'
    # if secondApp.webpage is not None:
    #     secondApp.url = 'pages/'+secondApp.webpage.url
    # else:
    #     secondApp.url = '/'
    # if firstApp.webpage is not None:
    #     firstApp.url = 'pages/'+firstApp.webpage.url
    # else:
    #     firstApp.url = '/'
    # for k in data:
    #     if k.webpage is not None:
    #         k.url = 'pages/'+k.webpage.url
    #     else:
    #         k.url = '/'

    return render(request, 'app.HR.page2.html',{'data':data,'firstApp':firstApp,'secondApp':secondApp})

def page3(request):
    context={}
    return render(request, 'app.HR.page3.html',context)

def page4(request):
    context={}
    return render(request, 'app.HR.page4.html',context)

def page5(request):
    context={}
    return render(request, 'app.HR.page5.html',context)

def page6(request):
    context={}
    return render(request, 'app.HR.page6.html',context)

def page7(request):
    context={}
    return render(request, 'app.HR.page7.html',context)

def page8(request):
    context={}
    return render(request, 'app.HR.page8.html',context)

def page9(request):
    context={}
    return render(request, 'app.HR.page9.html',context)
def page11(request):
    context={}
    return render(request, 'app.HR.page11.html',context)
def page10(request):
    context={}
    return render(request, 'app.HR.videotutorials.html',context)
def contactus(request):
    context={}
    return render(request, 'app.HR.contactus.html',context)
def aboutus(request):
    context={}
    return render(request, 'app.HR.aboutus.html',context)

def carouselsection(request):
    context={}
    return render(request, 'app.HR.carouselsection.html',context)
def termsofservices(request):
    context={}
    return render(request, 'app.HR.termsofservices.html',context)
def privacypolicy(request):
    context={}
    return render(request, 'app.HR.privacypolicy.html',context)
def refundpolicy(request):
    context={}
    return render(request, 'app.HR.refundpolicy.html',context)

def pageeditor(request,id):
    page = Page.objects.get(pk = id)
    components = Components.objects.filter(parent = page).order_by('index')
    data = ''
    for indx, i in enumerate(components):

        i.template = i.template.replace('$data' , 'components[%s].data'%(indx))
        data += i.template
        print data
    API_KEY = ''
    if page.enableChat:

        API_KEY = hash_fn.hash(page.user.designation.division.pk)

    return render(request, 'app.HR.pageeditor.html',{'page':page,'data':data, 'components' : components,'API_KEY':API_KEY})

# def renderpage(request,url):
#     filePath = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'publishedPages' , ('%s_%s.html'% (1, url)))
#     print url,filePath,'4343243'
#     with open(filePath, 'r') as f:
#            fileContent = f.read()
#            app.HR.page.html
#     return HttpResponse(fileContent)


def renderpage(request,apiKey,url):
    print apiKey,"34342"
    page = Page.objects.get(url = url, user__designation__division = request.user.designation.division )
    components = Components.objects.filter(parent = page)
    data = ''
    for indx, i in enumerate(components):
        i.template = i.template.replace('$data' , 'components[%s].data'%(indx))

        i.dataTemplate = i.template
    

    API_KEY = apiKey
    return render(request, 'app.HR.page.html',{'components':components,'page':page,'API_KEY':API_KEY})


def uielement(request):
    component = UIelementTemplate.objects.get(pk = request.GET['id'])

    return render(request, 'app.HR.pageElement.html',{'data':component})


def headerfooter(request):
    data = Division.objects.get(pk = request.user.designation.division.pk)
    header=''
    footer=''
    c = Context({'data': data})
    if 'header' in request.GET:
        if data.headerData != None and  len(data.headerData) > 0:
            data.headerData = json.loads(data.headerData)
        if data.headerTemplate != None:
            h = Template(data.headerTemplate)
            header = h.render(c)
    if 'footer' in request.GET:
        if data.footerData != None and len(data.footerData) > 0:
            data.footerData = json.loads(data.footerData)
        if data.footerTemplate != None:
            f = Template(data.footerTemplate)
            footer = f.render(c)
    return render(request, 'app.HR.headerfooter.html',{'header':header,'footer':footer})

def renderheaderfooter(request):
    data = request.user.designation.division
    headerCss = data.headerCss
    footerCss = data.footerCss
    if data.headerData != None and  len(data.headerData) > 0:
        data.headerData = json.loads(data.headerData)

    if data.footerData != None and len(data.footerData) > 0:
        data.footerData = json.loads(data.footerData)
    header=''
    footer=''
    c = Context({'data': data})
    if data.headerTemplate != None:
        h = Template(data.headerTemplate)
        header = h.render(c)
    if data.footerTemplate != None:
        f = Template(data.footerTemplate)
        footer = f.render(c)
    return render(request, 'app.HR.headerandfooter.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss})

def appdetails(request):
    # app = application.objects.get(pk = request.GET['id'])
    # appMedia = app.appMedia.all()
    return render(request, 'app.HR.appdetails.html')


def ProductDetails(request):
    context={}
    return render(request, 'app.finance.inventory.productDetails.html',context)


import json
def careers(request):
    context={}

    finalData =  Jobs.objects.all()


    halfData = len(finalData)/2
    firstSec = finalData[:halfData]
    secondSec = finalData[halfData:len(finalData)]
    return render(request, 'app.HR.careers.html',{'firstSec':firstSec,'secondSec':secondSec})
def career(request,id):

    finalData =  Jobs.objects.get(pk = id)

    return render(request, 'app.HR.careersview.html',{'finalData':finalData})

def academy(request,id):
    context = {}
    return render(request, 'app.LMS.academy.courses.html',context)

def coursedetails(request,id,urlSuffix):
    idx = id
    context = {}
    return render(request, 'app.LMS.academy.coursesdetails.html',{'id':idx})


import math
@never_cache
def blog(request ):

    pageNumber = 1
    offset = pageNumber*6
    articlesAll = Article.objects.all()
    # totalCatg = Catrgory.objects.all()
    # for i in totalCatg:
    #     articlescount = Article.objects.filter(category = i).count()
    #     i.articlesCount = articlescount

    first_set =[]
    pageCount = math.floor(float(articlesAll.count())/float(5))
    pageNumbers = range(1, int(pageCount+1))

    print pageNumbers
    randPks = []
    if len(articlesAll) >0:
        for i in range(1,len(articlesAll),3):
            randPks.append(articlesAll[i])



    featuredblogs = articlesAll.filter(featuredContent = True)[:4]
    print featuredblogs,'49320842390'
    for i in featuredblogs:
        if i.contents.all().count()>0 and  i.contents.all()[0].content != None:
            i.introSectionImg = i.contents.all()[0].img
            print i.pk

    blogs = articlesAll[offset:offset+6]
    prevpage = 0
    nextpage = 0
    if pageNumber > 0:
        prevpage = pageNumber-1
    if len(blogs) > 0:
        nextpage = pageNumber+1
        print  nextpage ,'klsafkalsdkfldsfialsdf'
    else:
        nextpage = pageNumber
    if len(blogs) >0:
        for i in blogs:
            if i.contents.all().count()>0 and  i.contents.all()[0].content != None:
                i.introSectionTxt = i.contents.all()[0].content
                i.introSectionImg = i.contents.all()[0].img
                i.tagsArr = i.tags.split(',')
                i.tagsArr.pop(-1)

    currentPage = pageNumber+1
    if pageNumber!=0:
        currentPage = pageNumber



    return render(request,"app.HR.blogs.html" , {"blogs" : blogs,"featuredblogs":featuredblogs,"home" : False , "pageNumber" : pageNumber ,"prevpage":prevpage, "nextPage" : nextpage , "firstArticle" : featuredblogs[0] , "pageNumbers" : pageNumbers , "pageCount" : int(pageCount) , "currentPage" : currentPage,'totalCatg':[]})

from django.urls import resolve
def renderedArticleView(request , articleUrl):
    # print articleUrl,'2390resdsdasdasr219732'
    article = []
    article = Article.objects.get(articleUrl = articleUrl)
    print article.title,'23902rer19732'
    comments = Comment.objects.filter(article = article, verified=True)
    intro = article.contents.all()[0]


    blogs = Article.objects.all()
    restsec = article.contents.all()[1:]
    randPks = []
    randPkss = None
    data={}

    relatedArticles = article.category.articles.filter(~Q(pk= article.pk))
    for i in relatedArticles:
        if i.contents.all().count() >0:
            if i.contents.all()[0].img:
                i.blgimage =  i.contents.all()[0].img


    # return render(request , 'app.HR.articleView.html' , { "article" : article })
    return render(request , 'app.HR.articleView.html' , { "article" : article , "intro" : intro ,"restsec":restsec, "relatedArticles" : relatedArticles,"comments":comments,'blogs':blogs,'randPks':Article.objects.all().order_by('-created')[:5]})


def renderedModalView(request ):
    url = request.path
    print url,'aaaaaaaaaaaa'
    pk = url.split('/apply/')[1]

    finalData =  Jobs.objects.get(pk = pk)
    print finalData
    return render(request , 'app.HR.careers.apply.html', {"lang" : request.LANGUAGE_CODE,'finalData':finalData })
