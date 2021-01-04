from django.contrib.auth.models import User, Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets, permissions, serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from django.db.models import Q, F
from django.http import HttpResponse
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
# Create your views here.
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
import datetime
import calendar as pythonCal
import json
import pytz
import requests
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from django.db.models import Sum, Count
from dateutil.relativedelta import relativedelta
from excel_response import ExcelResponse
from django.db.models.functions import Concat
from django.db.models import Value
import xlsxwriter
from rest_framework import filters
from django.http import JsonResponse
from svglib.svglib import svg2rlg
from reportlab.lib.units import inch, cm

themeColor = colors.HexColor('#227daa')

styles = getSampleStyleSheet()
styleN = styles['Normal']
styleH = styles['Heading1']


def genExpense(response,tourplanObj, expenses, request):


    MARGIN_SIZE = 8 * mm
    PAGE_SIZE = A4

    pdf_doc = SimpleDocTemplate(response, pagesize=PAGE_SIZE,
                                leftMargin=MARGIN_SIZE, rightMargin=MARGIN_SIZE,
                                topMargin=4 * MARGIN_SIZE, bottomMargin=3 * MARGIN_SIZE)

    pdf_doc.expenses = expenses
    pdf_doc.request = request


    tableHeaderStyle = styles['Normal'].clone('tableHeaderStyle')
    # tableHeaderStyle.textColor = colors.white
    tableHeaderStyle.fontSize = 7
    story = []
    summryParaSrc = """
    <para  fontSize=14  align='center'>
    <strong>Expenses</strong><br/>
    </para>
    """
    story.append(Paragraph(summryParaSrc, styleN))
    story.append(Spacer(2.5, 0.5 * cm))
    summryParaSrc1 = """
    <para  fontSize=11  align='center'>
    <strong>%s</strong><br/>
    </para>
    """%(expenses.notes)
    story.append(Paragraph(summryParaSrc1, styleN))
    story.append(Spacer(2.5, 0.5 * cm))


    summryParaSrc2 = """
    <para  fontSize=11>
    %s %s<br/>
    Date : %s<br/>
    </para>
    """%(tourplanObj.tourplan.user.first_name, tourplanObj.tourplan.user.last_name, tourplanObj.tourplan.date)
    story.append(Paragraph(summryParaSrc2, styleN))
    story.append(Spacer(2.5, 0.5 * cm))

    pHeadParticular = Paragraph('<strong>Particulars</strong>', tableHeaderStyle)
    pHeadDescrptn = Paragraph('<strong>Description</strong>', tableHeaderStyle)
    pHeadAmount = Paragraph('<strong>Amount</strong>', tableHeaderStyle)
    data = [[pHeadParticular, pHeadDescrptn, pHeadAmount]]
    for i in expenses.invoices.all():
        pBodyParticular = Paragraph(str(i.code), tableHeaderStyle)
        pBodyDescrptn = Paragraph(str(i.description), tableHeaderStyle)
        pBodyAmount = Paragraph(str(i.amount), tableHeaderStyle)
        data.append([pBodyParticular, pBodyDescrptn, pBodyAmount])

    t = Table(data)
    ts = TableStyle([('ALIGN', (1, 1), (-3, -3), 'RIGHT'),
                 ('VALIGN', (0, 1), (-1, -3), 'TOP'),
                 ('VALIGN', (0, -2), (-1, -2), 'TOP'),
                 ('VALIGN', (0, -1), (-1, -1), 'TOP'),
                 ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                 # ('BACKGROUND', (0, 0), (-1, 0), themeColor),
                 # ('LINEABOVE', (0, 0), (-1, 0), 0.25, themeColor),
                 # ('LINEABOVE', (0, 1), (-1, 1), 0.25, themeColor),
                 # ('BACKGROUND', (-3, -1), (-1, -1), themeColor),
                 ('GRID', (0, 0), (-1, -1), 0.25, colors.gray),
                 ])
    t.setStyle(ts)
    story.append(t)


    pdf_doc.build(story)
