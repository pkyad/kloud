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
from finance.models import Cart
from website.models import *
from recruitment.models import *
from finance.models import *
from blogging.models import *
from django.db.models import Q
from django.contrib.auth import authenticate , login , logout
from bs4 import BeautifulSoup
import json
from django.template import Context, Template
# Related to the REST Framework
from django.http import HttpResponse
import os
from LMS.serializers import CourseSerializer
from website.serializers import ComponentsSerializer

import basehash
hash_fn = basehash.base36()
def page1(request):
    context={}

    return render(request, 'app.HR.page1.html',context)

def storeHome(request):
    # return redirect('/login')
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
    components = Components.objects.filter(parent__isnull = True ).order_by('index')
    data = ''
    for indx, i in enumerate(components):

        i.template = i.template.replace('$data' , 'components[%s].data'%(indx))
        data += i.template
        print data
    # API_KEY = ''
    # if page.enableChat:
    #
    #     API_KEY = hash_fn.hash(page.user.designation.division.pk)
    return render(request, 'app.HR.ecommerce.html',{'data':data, 'components' : components})
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


import json
def pageeditor(request,id):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    page = Page.objects.get(pk = id)
    if request.user.designation.division.headerTemplate:
        header  = request.user.designation.division.headerTemplate
        headerCss  = request.user.designation.division.headerCss
    if request.user.designation.division.headerTemplate:
        footer  = request.user.designation.division.footerTemplate
        footerCss  = request.user.designation.division.footerCss
    try:
        div = request.user.designation.division
    except:
        pass
    components = Components.objects.filter(parent = page).order_by('index')
    data = ''

    for indx, i in enumerate(components):

        i.template = i.template.replace('$data' , 'components[%s].data'%(indx))

        data += i.template

        print header,'00900-'
    API_KEY = hash_fn.hash(page.user.designation.division.pk)

    return render(request, 'app.HR.pageeditor.html',{'page':page,'data':data, 'components' : components,'API_KEY':API_KEY,'header':header,'headerCss':headerCss,'footer':footer,'footerCss':footerCss,'divisionJson':div})

# def renderpage(request,url):
#     filePath = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'publishedPages' , ('%s_%s.html'% (1, url)))
#     print url,filePath,'4343243'
#     with open(filePath, 'r') as f:
#            fileContent = f.read()
#            app.HR.page.html
#     return HttpResponse(fileContent)

import json
def renderpage(request,apiKey,url):

    print url,apiKey,"34342"
    header =None
    footer = None
    headerCss = None
    footerCss = None
    showLms = False
    try:
        div = request.user.designation.division
    except:
        id = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(id))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss



    if url == None:
        page = Page.objects.get(url__isnull=True , user__designation__division = div )
        return redirect('/login')
    else:
        page = Page.objects.get(url = url, user__designation__division = div )
    components = Components.objects.filter(parent = page)
    data = ''
    for indx, i in enumerate(components):
        i.template = i.template.replace('$data' , 'components[%s].data'%(indx))
        i.dataTemplate = i.template
        # i.data = json.loads(json.dumps(i.data))


    # if page.enableChat:

    # API_KEY = hash_fn.hash(page.user.designation.division.pk)
    # division = page.user.designation.division
    return render(request,'app.HR.page.html',{'components':components,'page':page,'API_KEY':apiKey,'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'divisionJson':div,'showLms' : showLms})

def renderpageMain(request,apiKey):

    # print url,apiKey,"34342"
    header =None
    footer = None
    headerCss = None
    footerCss = None
    showLms = False
    try:
        div = request.user.designation.division
    except:
        id = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(id))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss



    page = Page.objects.get(url__isnull=True , user__designation__division = div )
    if div.pageType == 'LMS':
        showLms = True
        components = json.dumps(CourseSerializer(Course.objects.filter(division = div, activeCourse = True), many = True).data)
        return render(request,'app.HR.page.html',{'componentsData':components,'page':page,'API_KEY':apiKey,'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'divisionJson':div,'showLms' : showLms})

    products = Inventory.objects.all()[0:10]
    components = Components.objects.filter(parent = page)
    data = ''
    for indx, i in enumerate(components):
        i.template = i.template.replace('"$data"' , "'"+components[indx].data+"'")
        i.dataTemplate = i.template
        print i.data,"4k324kl3k4las;dflkasidfo"

    return render(request,'app.HR.page.html',{'components':components,'page':page,'API_KEY':apiKey,'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'divisionJson':div,'showLms' : showLms,'products':products})

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
    app = application.objects.get(pk = request.GET['id'])
    # appMedia = app.appMedia.all()
    return render(request, 'app.HR.appdetails.html',{'APP_NAME':app.name,'APP_ID':app.pk})
def appDetails(request,name):
    print name,'kllk'
    app = application.objects.get(name__iexact = name)
    # appMedia = app.appMedia.all()
    return render(request, 'app.HR.appdetails.html',{'APP_NAME':name,'APP_ID':app.pk})




def ProductDetails(request,apiKey,id):
    product = Inventory.objects.get(pk = id)
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        id = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(id))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    # div = hash_fn.hash(request.user.designation.division.pk)
    return render(request, 'app.finance.inventory.productDetails.html',{'product':product,'API_KEY':apiKey,'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss})

def Categories(request,apiKey,id):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    # div = hash_fn.hash(request.user.designation.division.pk)
    print id,'sssssssssssssssssssssssssssss'
    return render(request, 'app.ecommerce.categories.html',{'id':id,'API_KEY':apiKey,'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss})

def CheckoutView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    cartItems = len(Cart.objects.all())
    # div = hash_fn.hash(request.user.designation.division.pk)
    return render(request, 'app.ecommerce.checkout.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'API_KEY':apiKey,'cartItems':cartItems})


def CheckoutAddressView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    # div = hash_fn.hash(request.user.designation.division.pk)
    return render(request, 'app.ecommerce.address.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'API_KEY':apiKey})

def CheckoutPaymentView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    return render(request, 'app.ecommerce.payment.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'API_KEY':apiKey})

def OrderSuccessfulView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    orderid = request.GET['orderid']
    # division = hash_fn.hash(request.user.designation.division.pk)
    return render(request, 'app.ecommerce.orderSuccessful.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'orderid':orderid,'division':apiKey})

def OrderFailureView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    return render(request, 'app.ecommerce.orderFailure.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss})

def ProfileView(request,apiKey):
    header =None
    footer = None
    headerCss = None
    footerCss = None
    try:
        div = request.user.designation.division
    except:
        divId = hash_fn.unhash(apiKey)
        div = Division.objects.get(pk = int(divId))
    if div.headerTemplate:
        header  = div.headerTemplate
        headerCss  = div.headerCss
    if div.headerTemplate:
        footer  = div.footerTemplate
        footerCss  = div.footerCss
    return render(request, 'app.ecommerce.profile.html',{'header':header,'footer':footer,'headerCss':headerCss,'footerCss':footerCss,'API_KEY':apiKey})


import json
def careers(request):
    context={}

    finalData =  Jobs.objects.all()


    halfData = len(finalData)/2
    firstSec = finalData[:halfData]
    secondSec = finalData[halfData:len(finalData)]
    return render(request, 'app.HR.careers.html',{'firstSec':firstSec,'secondSec':secondSec})
def careersbyDivision(request,apiKey):
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
def Divisioncoursedetails(request,apiKey,id,urlSuffix):
    idx = id
    context = {}
    return render(request, 'app.LMS.academy.coursesdetails.html',{'id':idx})


import math
@never_cache
def blog(request ):

    pageNumber = 1
    offset = pageNumber*6
    articlesAll = Article.objects.filter(division = globalSettings.PARENT_DIVSION)

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
def Divisionblogs(request,apiKey ):

    pageNumber = 1
    offset = pageNumber*6
    articlesAll = Article.objects.filter(division = request.user.designation.division)

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
def DivisionblogDetails(request ,apiKey, articleUrl):
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
    if request.user.designation.division.pk:
        relatedArticles = Article.objects.filter(division = request.user.designation.division)[0:5]

    for i in relatedArticles:
        if i.contents.all().count() >0:
            if i.contents.all()[0].img:
                i.blgimage =  i.contents.all()[0].img


    # return render(request , 'app.HR.articleView.html' , { "article" : article })
    return render(request , 'app.HR.articleView.html' , { "article" : article , "intro" : intro ,"restsec":restsec, "relatedArticles" : relatedArticles,"comments":comments,'blogs':blogs,'randPks':Article.objects.all().order_by('-created')[:5]})
def renderedArticleView(request , articleUrl):
    # print articleUrl,'2390resdsdasdasr219732'
    article = []
    article = Article.objects.get(articleUrl = articleUrl)
    print article.title,'23902rer19732'
    comments = Comment.objects.filter(article = article, verified=True)
    intro = article.contents.all()[0]


    restsec = article.contents.all()[1:]
    randPkss = None
    data={}

    relatedArticles = Article.objects.filter(division = globalSettings.PARENT_DIVSION)[0:5]
    randPks = Article.objects.filter(division = globalSettings.PARENT_DIVSION).order_by('-created')[0:5]
    blogs = Article.objects.filter(division = globalSettings.PARENT_DIVSION)
    for i in relatedArticles:
        if i.contents.all().count() >0:
            if i.contents.all()[0].img:
                i.blgimage =  i.contents.all()[0].img


    # return render(request , 'app.HR.articleView.html' , { "article" : article })
    return render(request , 'app.HR.articleView.html' , { "article" : article , "intro" : intro ,"restsec":restsec, "relatedArticles" : relatedArticles,"comments":comments,'blogs':blogs,'randPks':randPks})


def renderedModalView(request ):
    url = request.path
    print url,'aaaaaaaaaaaa'
    pk = url.split('/apply/')[1]

    finalData =  Jobs.objects.get(pk = pk)
    print finalData
    return render(request , 'app.HR.careers.apply.html', {"lang" : request.LANGUAGE_CODE,'finalData':finalData })
