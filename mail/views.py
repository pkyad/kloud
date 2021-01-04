from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.exceptions import *

import sys
import imaplib
import smtplib
import getpass
import email
import email.header
from email.message import Message
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email import encoders
import mimetypes

import datetime
import os
from os.path import basename
# For guessing MIME type based on file name extension
import mimetypes
import re
from django.conf import settings as globalSettings
from django.http import HttpResponse
# Create your views here.
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets , permissions , serializers, status
from rest_framework.decorators import api_view
from url_filter.integrations.drf import DjangoFilterBackend
from API.permissions import *
from .models import mailAttachment
from .serializers import *
from django.core.files.base import ContentFile
import time
from clientRelationships.models import Files, Contact, Activity
import json

reload(sys)
sys.setdefaultencoding('utf8')

list_response_pattern = re.compile(r'\((?P<flags>.*?)\) "(?P<delimiter>.*)" (?P<name>.*)')

def parse_list_response(line):
    flags, delimiter, mailbox_name = list_response_pattern.match(line).groups()
    mailbox_name = mailbox_name.strip('"')
    return (flags, delimiter, mailbox_name)

def getMailHeader(M , id):

    rv, data =  M.uid('FETCH', id, '(RFC822.HEADER FLAGS)')
    if rv == 'OK' and None not in data:
        msg = email.message_from_string(data[0][1])
        try:
            decode = email.header.decode_header(msg['Subject'])[0]
            subject = unicode(decode[0])
        except:
            subject = str(msg['subject'])
        try:
            decode = email.header.decode_header(msg['from'])[0]
            sender = unicode(decode[0])
        except:
            sender = str(msg['from'])
        return subject , msg['Date'] , sender , msg['to'] , data[0][0]
    else:
        return None , None , None , None , None


@api_view(['post'])
def sendMailView(request):
    """
    A view to to send a mail via SMTP
    """
    if 'account' in request.GET:
        acc = request.user.mailAccount.filter(pk = request.GET['account'] )
    elif 'account' in request.data:
        acc = request.user.mailAccount.get(pk = request.data['account'] )
    else:
        acc = request.user.mailAccount.all()[0]

    EMAIL_ACCOUNT = acc.email
    EMAIL_PASSWORD = acc.passKey
    toAddr = request.data['to']
    msg = MIMEMultipart()
    msg['From'] = "%s <%s>" %(acc.displayName , EMAIL_ACCOUNT)
    print toAddr,'lllllllllllllllll'
    msg['To'] = toAddr
    msg['Date'] = email.utils.formatdate(time.time())
    msg['Signed-by'] = globalSettings.EMAIL_HOST_SUFFIX
    if 'subject' in request.data:
        msg['Subject'] = request.data['subject']
    if 'cc' in request.data:
        msg['cc'] = request.data['cc']
        toAddr += ',' + request.data['cc']
    if 'bcc' in request.data:
        toAddr += ',' + request.data['bcc']
    msg.attach(MIMEText(request.data['body'].encode('utf-8'), 'html'))
    if 'attachments' in request.data:
        for pk in request.data['attachments'].split(','):
            filePath = mailAttachment.objects.get(pk = int(pk)).attachment.path
            filename = basename(filePath.split('_' + request.user.username + '_')[-1])
            with open(filePath, "rb") as fil:
                if filename.endswith('.pem'):
                    typeParts = ['application' , 'x-pem-file'];
                else:
                    typeParts = mimetypes.guess_type(filename)[0].split('/');
                part = MIMEBase(typeParts[0], typeParts[1])
                part.set_payload((fil).read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
                msg.attach(part)
            mailAttachment.objects.get(pk = pk).delete()
            os.remove(filePath)
    if 'attachmentTemplates' in request.data:
        for pk in request.data['attachmentTemplates'].split(','):
            if len(pk) == 0:
                continue
            filePath = Files.objects.get(pk = int(pk)).attachment.path
            filename = basename(filePath.split('_' + request.user.username + '_')[-1])
            with open(filePath, "rb") as fil:
                print "filename , " , filename
                if filename.endswith('.pem'):
                    typeParts = ['application' , 'x-pem-file'];
                else:
                    typeParts = mimetypes.guess_type(filename)[0].split('/');
                part = MIMEBase(typeParts[0], typeParts[1])
                part.set_payload((fil).read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
                msg.attach(part)

    S = smtplib.SMTP_SSL(globalSettings.EMAIL_SERVER_HOST, 465)
    # S.starttls()
    S.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
    text = msg.as_string()
    for address in toAddr.split(','):
        if len(address)==0:
            continue
        S.sendmail(EMAIL_ACCOUNT, address, text)

    M = imaplib.IMAP4_SSL(globalSettings.EMAIL_SERVER_HOST)
    M.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
    M.append('INBOX.Sent', '', imaplib.Time2Internaldate(time.time()), text)
    M.logout()
    S.quit()
    # activty
    if 'contact' in request.data:
        ContactObj = Contact.objects.get(pk = int(request.data['contact']))
        typ = 'mail'
        data = {"subject":request.data['subject']}
        data = json.dumps(data)
        actObj = Activity.objects.create(data = data , typ = typ , contact = ContactObj, user= request.user)
        if 'body' in request.data:
            body = request.data['body']
            actObj.data = data
            actObj.save()
    return Response({},status = status.HTTP_200_OK)

@api_view(['GET'])
def mailBoxView(request):
    """
    View to get the mailbox selected, ideally 10 at a time.
    """

    if 'account' in request.GET:
        acc = request.user.mailAccount.filter(pk = request.GET['account'] )
    else:
        acc = request.user.mailAccount.all()[0]

    EMAIL_ACCOUNT = acc.email
    EMAIL_PASSWORD = acc.passKey
    EMAIL_FOLDER = str(request.GET['folder'])
    try:
        page = int(request.GET['page'])
    except:
        page = 0
    try:
        query = str(request.GET['query']).replace('/' , '"')
    except:
        query = "ALL"
    M = imaplib.IMAP4_SSL(globalSettings.EMAIL_SERVER_HOST)
    try:
        rv, data = M.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
    except imaplib.IMAP4.error:
        print "LOGIN FAILED!!! "

    rv, data = M.select(EMAIL_FOLDER)
    if rv == 'OK':
        rv, data = M.uid('SEARCH', None, '(' + query + ')')
        if rv != 'OK':
            print "No messages found!"
        mailUIDs = data[0].split()
        content = []
        endIndex =  len(mailUIDs)-11 - page*10
        if endIndex<-1:
            endIndex = -1
        indexes = range(len(mailUIDs)-1 - page*10, endIndex , -1) # this generates from 8 to 0 as -1 in the middle does is not included in the list
        for index in indexes:
            num = mailUIDs[index]
            subject , date , sender , to , flags = getMailHeader(M , num)
            content.append({'uid' : num, 'subject' : subject , 'date' : date , 'sender' : sender , 'to' : to , 'flags':flags })
        return Response(content)
        M.close()
    else:
        print "ERROR: Unable to open mailbox ", rv
    M.logout()
from clientRelationships.models import Contact
from clientRelationships.serializers import ContactSerializer
def getMailBody(M , id , mode):
    rv, data = M.uid('FETCH', id, '(RFC822)')
    if rv == 'OK':
        attachments = list();
        msg = email.message_from_string(data[0][1])
        frm = msg['from']
        if '<' in frm:
            senderemail = frm.split('<')[1]
            senderemail = senderemail.replace('>', '')

        else:
            senderemail = frm

        contct =  Contact.objects.filter(email = senderemail)

        if contct.exists():
            jsonContct = ContactSerializer(contct[0]).data
        else:
            jsonContct = None

        body = None
        for part in msg.walk():
            if part.get_content_type()=='text/'+mode:
                body = part.get_payload(decode = True)
        if body is None:
            for part in msg.walk():
                if part.get_content_type()=='text/plain':
                    body = part.get_payload(decode = True)
        if body is None:
            for part in msg.walk():
                if part.get_content_type()=='text/mixed':
                    body = part.get_payload(decode = True)

        if msg.is_multipart() and mode == 'html' and body:
            for part in msg.walk():
                content_disposition = part.get("Content-Disposition", None);
                cid = part.get("Content-ID", None);
                if cid:
                    encoding = part.get("Content-Transfer-Encoding" , None)
                    contentType = part.get("Content-Type" , None)
                    parts = body.split('cid:' + cid.strip("<").strip(">"))
                    if len(parts) == 1:
                        body = parts[0]
                    else:
                        body = parts[0] + 'data:%s;%s,%s' %(contentType , encoding , part.get_payload(decode = False)) + parts[1]
                if content_disposition:
                    dispositions = content_disposition.strip().split(";")
                    if bool(content_disposition and dispositions[0].lower() == "attachment"):
                        attachments.append({'content_type' : part.get_content_type() ,'name' : part.get_filename()})
        try:
            return body , attachments , jsonContct
        except:
            return None , attachments , jsonContct

@api_view(['GET','PATCH'])
def emailView(request):
    """
    get a perticular mail
    """

    EMAIL_FOLDER = str(request.GET['folder'])
    uid = int(request.GET['uid'])


    if 'account' in request.GET:
        acc = request.user.mailAccount.filter(pk = request.GET['account'] )
    else:
        acc = request.user.mailAccount.all()[0]

    EMAIL_ACCOUNT = acc.email
    EMAIL_PASSWORD = acc.passKey

    M = imaplib.IMAP4_SSL(globalSettings.EMAIL_SERVER_HOST)
    try:
        rv, data = M.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
    except imaplib.IMAP4.error:
        print "LOGIN FAILED!!! "

    rv, data = M.select(EMAIL_FOLDER)
    if rv == 'OK':
        if request.method=='GET':
            body , attachments , jsonContct = getMailBody(M, uid , request.GET['mode'])
            return Response({'body' : body , 'uid' : uid  , 'folder' : EMAIL_FOLDER , 'attachments' : attachments , "contact" : jsonContct})
        elif request.method=='PATCH':
            if 'action' in request.GET:
                actionType = request.GET['action']
                if actionType == 'addFlag' or actionType == 'removeFlag':
                    if actionType =='addFlag' :
                        action = '+FLAGS'
                    elif actionType == 'removeFlag':
                        action = '-FLAGS'
                    rv , data = M.uid('STORE' , uid , action , '\\'+ request.GET['flag'])
                elif actionType == 'move':
                    rv , data = M.uid('COPY' , uid ,  str(request.GET['to']))
                    if rv == 'OK':
                        rv , data = M.uid('STORE', uid , '+FLAGS', '(\Deleted)')
                        M.expunge()
            else:
                M.close()
                M.logout()
        return Response(status = status.HTTP_200_OK)


def getFolders(M):
    fodlersStatus = []
    rv, mailboxes = M.list()
    if rv == 'OK':
        for folder in mailboxes:
            flag , delimiter , mailbox_name =  parse_list_response(folder)
            status =  M.status(mailbox_name, '(MESSAGES RECENT UIDNEXT UIDVALIDITY UNSEEN)')
            fodlersStatus.append(status)
        return fodlersStatus

@api_view(['GET'])
def foldersDetailsView(request):
    """
    get the folder details
    """

    if 'account' in request.GET:
        acc = request.user.mailAccount.filter(pk = request.GET['account'] )
    else:
        acc = request.user.mailAccount.all()[0]

    EMAIL_ACCOUNT = acc.email
    EMAIL_PASSWORD = acc.passKey

    M = imaplib.IMAP4_SSL(globalSettings.EMAIL_SERVER_HOST)
    try:
        rv, data = M.login(EMAIL_ACCOUNT, EMAIL_PASSWORD )
    except imaplib.IMAP4.error:
        print "LOGIN FAILED!!! "
    page = 0
    rv, data = M.select('INBOX')
    content = []
    if rv == 'OK':
        rv, data = M.uid('SEARCH', None, '(ALL)')

        if rv != 'OK':
            print "No messages found!"
        mailUIDs = data[0].split()

        endIndex =  len(mailUIDs)-11 - page*10
        if endIndex<-1:
            endIndex = -1
        indexes = range(len(mailUIDs)-1 - page*10, endIndex , -1) # this generates from 8 to 0 as -1 in the middle does is not included in the list
        for index in indexes:
            num = mailUIDs[index]
            subject , date , sender , to , flags = getMailHeader(M , num)
            content.append({'uid' : num, 'subject' : subject , 'date' : date , 'sender' : sender , 'to' : to , 'flags':flags })
    else:
        print "ERROR: Unable to open mailbox ", rv

    folders = getFolders(M)
    M.close()
    M.logout()

    return Response({"content" : content , "folders" : folders })

class mailAttachmentViewSet(viewsets.ModelViewSet):
    permission_classes = (isOwnerOrReadOnly,)
    serializer_class = mailAttachmentSerializer
    queryset = mailAttachment.objects.all()


@api_view(['GET' , 'POST'])
def mailAttachmentView(request):
    EMAIL_FOLDER = str(request.GET['folder'])
    uid = int(request.GET['uid'])

    if 'account' in request.GET:
        acc = request.user.mailAccount.filter(pk = request.GET['account'] )
    else:
        acc = request.user.mailAccount.all()[0]

    EMAIL_ACCOUNT = acc.email
    EMAIL_PASSWORD = acc.passKey


    M = imaplib.IMAP4_SSL(globalSettings.EMAIL_SERVER_HOST)
    try:
        rv, data = M.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
    except imaplib.IMAP4.error:
        print "LOGIN FAILED!!! "

    rv, data = M.select(EMAIL_FOLDER)
    if rv == 'OK':
        rv, data = M.uid('FETCH', uid, '(RFC822)')
        if rv == 'OK':
            msg = email.message_from_string(data[0][1])
            if msg.is_multipart():
                files = []
                for part in msg.walk():
                    content_disposition = part.get("Content-Disposition", None);
                    if content_disposition:
                        dispositions = content_disposition.strip().split(";")
                        if bool(content_disposition and dispositions[0].lower() == "attachment"):
                            if request.method == 'GET':
                                if part.get_filename() == request.GET['file']:
                                    cType = part.get("Content-Type" , None)
                                    if cType is not None:
                                        cType = cType.replace('\n' , '').replace('\r' , '')
                                    response = HttpResponse(content_type=  cType)
                                    response['Content-Disposition'] = 'attachment; filename=' + part.get_filename()
                                    response.write(part.get_payload(decode = True))
                                    return response
                            else:
                                f = ContentFile(part.get_payload(decode = True))
                                m = mailAttachment(user = request.user)
                                m.attachment.save(part.get_filename() , f)
                                m.save()
                                files.append(m.pk)
                d = mailAttachmentSerializer(mailAttachment.objects.filter(pk__in = files), many = True)
                return Response(d.data)

    return Response(status=status.HTTP_404_NOT_FOUND)

class proxyAccountViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = proxyAccountSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['user']
    def get_queryset(self):
        u = self.request.user
        if u.is_superuser:
            proxyAccount.objects.all()
        return proxyAccount.objects.filter(user = u)

class proxyAccountLiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = proxyAccountLiteSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['user']
    def get_queryset(self):
        u = self.request.user
        if u.is_superuser:
            proxyAccount.objects.all()
        return proxyAccount.objects.filter(user = u)
