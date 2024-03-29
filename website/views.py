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
from django.http import HttpResponse ,StreamingHttpResponse

# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from ERP.models import *
from organization.models import CompanyHolidays, Division
from clientRelationships.models import Contact, CustomerSession
from ERP.views import getApps
from django.db.models import Q
from django.http import JsonResponse
import random, string
from django.utils import timezone
from rest_framework.views import APIView
from datetime import date,timedelta,datetime
from dateutil.relativedelta import relativedelta
import calendar
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import json
from django.core.mail import send_mail , EmailMessage
from finance.models import Sale, Inventory, Category
from finance.serializers import RateListSerializer, CategorySerializer
from payroll.models import Payslip
from django.template.loader import render_to_string, get_template
from openpyxl import load_workbook
from io import BytesIO,StringIO
from performance.models import TimeSheet
from ERP.send_email import send_email
from blogging.models import *
from recruitment.models import *
from LMS.models import *
import os
from organization.serializers import DivisionSerializer, UnitFullSerializer
from clientRelationships.serializers import ContactLiteSerializer


# Create your views here.
import basehash
hash_fn = basehash.base36()
import re
regex = re.compile('^HTTP_')
def getCalendarScript(request , id):
    # id = hash_fn.unhash(id)
    dataToSend = {'id' : id,'siteurl' : globalSettings.SITE_ADDRESS}
    return render(request, 'calendar.js', dataToSend ,content_type="application/x-javascript")

class PageViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = PageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title' , 'url','user','inFooter']
    def get_queryset(self):
        # divsn = self.request.user.designation.division
        # toReturn = Page.objects.filter(user__designation__division=divsn)
        divsn = self.request.user.designation.division
        toReturn = Page.objects.filter(user__designation__division=divsn)
        if 'search' in self.request.GET:
            val = self.request.GET['search']
            toReturn = toReturn.filter(Q(title__icontains = val) | Q(url__icontains = val) | Q(description__icontains =  val))
            return toReturn
        return toReturn

class ComponentsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = Components.objects.all().order_by('index')
    serializer_class = ComponentsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent' , 'component_type']

class UIelementTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = UIelementTemplateSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' , 'template','templateCategory','live','defaultData']
    def get_queryset(self):
        toReturn = UIelementTemplate.objects.all()
        divsn = self.request.user.designation.division
        if 'templateCategory' in self.request.GET:
            toReturn = toReturn.filter(live=True,templateCategory__icontains = self.request.GET['templateCategory'],defaultData__isnull=False)
        return toReturn



class InitializewebsitebuilderAPIView(APIView):

    def post(self , request , format = None):
        Page.objects.all().delete()
        data = request.data
        division = Division.objects.get(pk = request.user.designation.division.pk)
        if 'defaultTitle' in request.data :
            division.defaultTitle = data['defaultTitle']
        if 'defaultDescription' in request.data :
            division.defaultDescription = data['defaultDescription']
        if 'url' in request.data :
            division.subDomain = data['url']
        if 'pageType' in request.data :
            division.pageType = data['pageType']
        if division.pageType == 'Services':
            division.headerTemplate = '<services-header></services-header>'
            division.footerTemplate = '<services-footer></services-footer>'
        elif division.pageType == 'Ecommerce' :
            pages = [{'title':'About us','url':'aboutus'},{'title':'Privacy and Policy','url':'privacypolicy'},{'title':'Terms and Conditions','url':'terms'}]
            for k in pages:
                page = Page.objects.create(title= k['title'],url=k['url'],description=k['title'],inFooter=True,user=request.user)
                page.save()
            division.headerTemplate = '<ecommerce-header></ecommerce-header>'
            division.footerTemplate = '<ecommerce-footer></ecommerce-footer>'
        elif division.pageType == 'LMS' or division.pageType == 'Agency':
            division.headerTemplate = '<agency-header></agency-header>'
            division.footerTemplate = '<agency-footer></agency-footer>'
        elif division.pageType == 'Blank' or division.pageType == 'Agency':
            division.headerTemplate = '<blank-header></blank-header>'
            # division.footerTemplate = '<agency-footer></agency-footer>'
        else:
            pass



        #   {% if divisionJson.pageType == 'LMS' or divisionJson.pageType == 'Agency' %}
        # <agency-footer></agency-footer>
        # {% elif divisionJson.pageType == 'Ecommerce' %}
        # <ecommerce-footer></ecommerce-footer>
        # {% elif divisionJson.pageType == 'Services'  %}
        # <services-footer></services-footer>
        # {% else %}
        division.save()
        page = Page.objects.create(title= data['defaultTitle'],description=data['defaultDescription'],user=request.user)
        page.save()
        return Response({'page':PageSerializer(page,many=False).data})


class PublishAPIView(APIView):
    def get(self , request , format = None):
        page = Page.objects.get(pk = request.GET['page'])
        components = Components.objects.filter(parent = page)
        data = ''
        for i in components:
            i.template = i.template.replace('$data' , 'data')
            data += i.template
        ctx = {'data':data, 'components' : components}
        pageContent = get_template('app.HR.page.html').render(ctx)
        print pageContent
        filePath = os.path.join(globalSettings.BASE_DIR , 'media_root' , 'publishedPages' , ('%s_%s.html'% (1, page.url)))
        f = open(filePath, 'w')
        f.write(pageContent)
        f.close()
        return Response({})

class GetFooterDetailsView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny,)
    def get(self , request , format = None):
        if 'divId' in self.request.GET and self.request.GET['divId'] !='undefined':
            id = hash_fn.unhash(self.request.GET['divId'])
            divObj = Division.objects.get(pk = int(id))
        else:
            divObj = request.user.designation.division
        obj = DivisionSerializer(divObj, many = False).data
        unitObj = divObj.units.all()
        if unitObj.count()>0:
            obj['unit'] = UnitFullSerializer(unitObj.first(), many = False).data
        return Response(obj)


class CheckDivisionUrlUsedView(APIView):
    def get(self , request , format = None):
        isValid = True
        if 'url' in request.GET:
            divObj = Division.objects.filter(subDomain = request.GET['url'])
            if divObj.count()>0:
                isValid = False
        return Response({'isValid' : isValid})

class UpdateContactView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny,)
    def post(self , request , format = None):
        data = request.data
        toRet = {}
        if 'pk' in data:
            cont = Contact.objects.get(pk = int(data['pk']))
            if 'name' in data:
                cont.name = data['name']
            if 'email' in data:
                cont.email = data['email']
            if 'mobile' in data:
                cont.mobile =  data['mobile']
            if 'street' in data:
                cont.street =  data['street']
            if 'pincode' in data:
                cont.pincode =  data['pincode']
            if 'city' in data:
                cont.city =  data['city']
            if 'country' in data:
                cont.country = data['country']
            if 'pincode' in data:
                cont.pincode = data['pincode']
            if 'state' in data:
                cont.state = data['state']
            cont.save()
            toRet = ContactLiteSerializer(cont, many = False).data
        return Response(toRet, status =  status.HTTP_200_OK)
    def get(self , request , format = None):
        toRet = {}
        if 'id' in request.GET:
            cont = Contact.objects.get(pk = int(request.GET['id']))
            toRet = ContactLiteSerializer(cont, many = False).data
        return Response(toRet, status =  status.HTTP_200_OK)

class GetProductsView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny,)
    def get(self , request , format = None):
        data = request.GET
        toRet = {}
        if 'id' in data:
            invData = Inventory.objects.get(pk = int(data['id']))
            toRet = RateListSerializer(invData, many = False, context = {"request": request}).data
            # toRet.context['request'] = request
        if 'category' in data:
            invData = Inventory.objects.filter(category__pk = int(data['category']))
            toRet = RateListSerializer(invData, many = True,  context = {"request": request}).data
            # toRet.context['request'] = request


        return Response(toRet, status =  status.HTTP_200_OK)


class GetCategoryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny,)
    def get(self , request , format = None):
        data = request.GET
        toRet = {}
        try:
            id = hash_fn.unhash(self.request.GET['divId'])
            divObj = Division.objects.get(pk = int(id))
        except:
            divObj = request.user.designation.division
        objs = Category.objects.filter(division = divObj)
        toRet = CategorySerializer(objs, many = True).data
        return Response(toRet, status =  status.HTTP_200_OK)




def rootSitemapView(request):
    domain = request.build_absolute_uri('/')[:-1]
    print domain,"088998098jkjh"
    stAddress = domain + str('/')
    priority='0.7'
    changefreq = 'weekly'
    sitemapsObjs = []
    ctx = {}
    staticDataUrls = ['','login','contactus','terms','refundpolicy','privacypolicy','careers']
    staticData = []
    for i in staticDataUrls:
        staticData.append({'loc':'{0}{1}'.format(stAddress,i),'changefreq':changefreq,'priority':priority})
        ctx['staticData'] = staticData

    articleObj = Article.objects.all()
    for i in articleObj:
        addr =  i.articleUrl
        details =  'articles/'+i.articleUrl
        print i.articleUrl, addr,"lll"
        staticData.append({'loc':'{0}{1}'.format(stAddress,addr),'changefreq':changefreq,'priority':priority})
        ctx['staticData'] = staticData
        staticData.append({'loc':'{0}{1}'.format(stAddress,details),'changefreq':changefreq,'priority':priority})
        print staticData,"0iostaticData"


    recObj = Jobs.objects.all()
    for i in recObj:
        addr =  'career/'+str(i.pk)
        staticData.append({'loc':'{0}{1}'.format(stAddress,addr),'changefreq':changefreq,'priority':priority})
        ctx['staticData'] = staticData

    accObj = Course.objects.all()
    for i in accObj:
        addr =  'academy/%s/%s'%(str(i.pk),str(i.urlSuffix))
        staticData.append({'loc':'{0}{1}'.format(stAddress,addr),'changefreq':changefreq,'priority':priority})
        ctx['staticData'] = staticData
    apps = application.objects.all()
    for i in apps:
        addr =  'app/%s'%(str(i.name))
        staticData.append({'loc':'{0}{1}'.format(stAddress,addr),'changefreq':changefreq,'priority':priority})
        ctx['staticData'] = staticData
    ctx = {"staticData": staticData}
    email_body = get_template('sitemap.klouderp.html').render(ctx)
    return HttpResponse(email_body, content_type='text/xml')
