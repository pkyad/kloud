# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework import viewsets , permissions , serializers
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from .models import *
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from reportlab import *
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors, utils
from reportlab.platypus import Paragraph, Table, TableStyle, Image, Frame, Spacer, PageBreak, BaseDocTemplate, PageTemplate, SimpleDocTemplate, Flowable
from PIL import Image
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet, TA_CENTER
from reportlab.graphics import barcode, renderPDF
from reportlab.graphics.shapes import *
from reportlab.graphics.barcode.qr import QrCodeWidget
import pytz
from django.http import HttpResponse
from reportlab.graphics.barcode import code39, code128
from reportlab.graphics import barcode , renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.platypus.doctemplate import Indenter
from reportlab.platypus import Paragraph, Table, TableStyle, Image, Frame, Spacer, PageBreak, BaseDocTemplate, PageTemplate, SimpleDocTemplate, Flowable,ListFlowable
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from django.db.models import Q
from django.db.models import Sum, Count
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from clientRelationships.models import Contact
from marketing.models import TourPlan , TourPlanStop, Contacts
from django.db.models import F
# Create your views here.
from ERP.initializing import *

class CheckinViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = CheckinSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['serialNo','checkout','user' , 'unit','to', 'name']
    def get_queryset(self):
        checkinObj = Checkin.objects.all()
        toReturn = checkinObj

        params = self.request.GET

        if 'search' in params:
            toReturn = checkinObj.filter(name__icontains = params['search'])

        return toReturn



class CheckinCreationAPI(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def post(self, request, format=None):
        data = request.data

        try:
            unitObj = Unit.objects.get(pk = data['warehouse'])
            division = request.user.designation.division
        except:
            pass

        for i in data['serialNo']:
            checkinObj = Checkin.objects.create(name = data['name'], serialNo = i,  warrantyTill = data['warrantyTill'], manufacturedOn = data['manufacturedOn'], poNumber = data['poNumber'], price = data['price'], user = request.user, unit = unitObj, division = division)
        try:
            CreateUsageTracker(request.user.designation.division.pk, 'created new Asset')
        except:
            pass
        return Response(status = status.HTTP_200_OK)


class AssetsInsightAPI(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny , )
    def get(self, request, format=None):
        params = self.request.GET
        total_price = Checkin.objects.filter(unit__name = params['unit']).aggregate(Sum('price'))

        data = {'total_price': total_price}

        return Response(data, status=status.HTTP_200_OK)


class AssignedListAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self, request, format=None):
        today = datetime.datetime.today()
        yesterday = today - timedelta(days = 1)
        tommorow = today + timedelta(days = 1)
        data = []
        # for i in Asset.objects.filter(pk__in = Checkin.objects.filter(assignedBy = request.user, assignedOn__gt = yesterday,  assignedOn__lt = tommorow).values_list('asset', flat=True).distinct()):
        #     data.append({"name" :  i.name , "price":i.price, "prefix":i.prefix,  "count" : i.checkins.filter(assignedBy = request.user, assignedOn__gt = yesterday,  assignedOn__lt = tommorow ).count() })
        checkinObj = Checkin.objects.filter(assignedBy = request.user,  assignedOn__gt = yesterday,  assignedOn__lt = tommorow)
        data = CheckinLiteSerializer(checkinObj, many = True).data
        return Response(data, status=status.HTTP_200_OK)
