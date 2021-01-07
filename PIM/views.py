from rest_framework import viewsets , permissions , serializers
from django.shortcuts import render
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from models import *
import json
from django.conf import settings as globalSettings
from rest_framework.response import Response
from rest_framework.views import APIView
from HR.serializers import userSearchSerializer
from django.db.models import Q,  Case, When
from  datetime import  datetime

class settingsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, isOwner, )
    queryset = settings.objects.all()
    serializer_class = settingsSerializer

class themeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = theme.objects.all()
    serializer_class = themeSerializer

class calendarViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = calendarSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['text' , 'originator' , 'data' , 'user', 'eventType']
    def get_queryset(self):
        dated = self.request.GET['date']
        frmdate = datetime.strptime(str(dated), '%Y-%m-%d').strftime('%Y-%m-%d %H:%M:%S')
        frmdate = datetime.strptime(str(frmdate), '%Y-%m-%d %H:%M:%S')
        toDate = frmdate.replace(hour=23, minute=59, second=59, microsecond=999999)
        qs1 = calendar.objects.filter(when__range = (frmdate , toDate)).order_by('when')
        qs2 = self.request.user.calendarItemsFollowing.filter(when__range = (frmdate , toDate)).order_by('when')

        toReturn = qs1 | qs2
        toReturn = toReturn.distinct()

        if 'clients__in' in self.request.GET:
            clients = json.loads(self.request.GET['clients__in'])
            toReturn = toReturn.filter(clients__in = clients)

        return toReturn

class notificationViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny , )
    serializer_class = notificationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['read']

    def get_queryset(self):
        print self.request.GET
        if 'user' in self.request.GET:
            user = User.objects.get(pk = int(self.request.GET['user']))
            return notification.objects.filter(Q(user = user)|Q(broadcast = True)).order_by('-created')
        if 'announcement' in self.request.GET:
            return notification.objects.filter(user = None).order_by('-created')
        elif 'alerts'  in self.request.GET:
            return notification.objects.filter(user = self.request.user).order_by('-created')
        else:
            return notification.objects.all().order_by('-created')


import os
from PIL import Image
import PIL
class SaveImageAPIView(APIView):
    def post(self , request , format = None):
        print request.FILES
        file = request.FILES['file']
        height = 40
        width = 40
        f = open(os.path.join(globalSettings.BASE_DIR, 'media_root/%s' %(file.name)), 'wb')
        f.write(file.read())
        f.close()
        im1 = Image.open(os.path.join(globalSettings.BASE_DIR, 'media_root/%s' %(file.name)))
        width, height = im1.size
        fileDetails = globalSettings.SITE_ADDRESS + '/media/'+ file.name
        data = {'link':fileDetails,'height':height,'width':width}
        return Response(data, status = status.HTTP_200_OK)
from datetime import datetime, date
class CalendarNotificationsAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        toSend = {}
        toSend['success'] = True
        now = datetime.now()
        print now, 'now'
        calenderObjs = calendar.objects.filter(when__gte = now)
        print calenderObjs
        for calenderObj in calenderObjs:
            diff = calenderObj.when - now
            minutes = round(diff.seconds/60)
            if minutes > 10 and minutes < 30:
                notiObjs = calenderObj.notifications.all()
                if notiObjs.count() == 0:
                    time = calenderObj.when.time()
                    admin = User.objects.filter(is_superuser=True)[0]
                    title = 'Call Followup at {}!'.format(str(time))
                    message = 'Call Followup at {}!'.format(str(time))
                    notificationObj = notification.objects.create(message = message,orginatedBy = admin, user = calenderObj.campaignItem.campaign.user, title = title)
                    notificationObj.save()

        return Response(toSend, status = status.HTTP_200_OK)

class CreateNotificationAPIView(APIView):
    def post(self, request, format=None):
        data = request.data
        user = User.objects.get(pk = int(data['user']))
        orginatedBy = request.user
        print data, 'data'
        if 'type' in data:
            if data['type'] == 'dataRequest':
                teamLead = user.designation.team.manager
                teamLeadMessage = "Hey %s, your team member %s requested data."%(teamLead.first_name, user.first_name)
                teleCallerMessage = "Hey %s, data request sent to your team lead."%(user.first_name)
                teamLeadNotification = notification.objects.create(user = teamLead, message = teamLeadMessage, title = 'New data request')
                teleCallerNotification = notification.objects.create(user = user, message = teleCallerMessage, title = 'Data request submitted')
                teleCallerNotification.save()
                teamLeadNotification.save()

        return Response({'success':True},status=status.HTTP_200_OK)

class ChatThreadsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ChatThreadsSerializer
    # queryset = ChatThread.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['uid','status','company']
    def get_queryset(self):
        print "in get queryset"
        if 'uid' in self.request.GET and 'checkThread' in self.request.GET:
            print "in iff"
            threadObj = ChatThread.objects.filter(uid = self.request.GET['uid'])
            if threadObj.count()>0:
                print 'sssssssssssssssssssss',threadObj[0].status
                if threadObj[0].status != 'started':
                    print 'nottttttttttttttt',threadObj[0].status
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            print 'tttttttttttttttt',threadObj
            return threadObj
        # return ChatThread.objects.all()
        if 'companyHandelrs' in self.request.GET and 'checkThread' in self.request.GET:
            threadObj = ChatThread.objects.filter(company = self.request.GET['companyHandelrs'])
            if threadObj.count()>0:
                print 'sssssssssssssssssssss',threadObj[0].status
                if threadObj[0].status != 'started':
                    print 'nottttttttttttttt',threadObj[0].status
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            print 'tttttttttttttttt',threadObj
            return threadObj
        return ChatThread.objects.filter(company= self.request.user.designation.division,title__isnull=False)

class GetChatThreadsAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        frm = request.user
        q1 =[]
        # q1 = chatMessage.objects.filter(user=frm).values_list('originator' ,  flat=True ).distinct() # recieved
        q2 = ChatMessage.objects.filter(user=frm).values_list('user' ,  flat=True ).distinct() # sent
        # q2 = ChatMessage.objects.all().values_list('user' ,  flat=True ).distinct() # sent


        ids = []
        for id in q1:
            if id not in ids:
                ids.append(id)

        for id in q2:
            if id not in ids:
                ids.append(id)

        preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(ids)])

        users = reversed ( User.objects.filter(Q(pk__in = q1) | Q(pk__in = q2)).order_by(preserved) )

        users = User.objects.all().exclude(pk = request.user.pk)



        if 'search' in request.GET:
            users = User.objects.filter(first_name__icontains= request.GET['search'] ).exclude(pk = frm.pk)

        myUsers = userSearchSerializer(users , many = True).data
        return Response(myUsers, status = status.HTTP_200_OK)

class chatMessageViewSet(viewsets.ModelViewSet):
    permission_classes = (isOwner, )
    # queryset = ChatMessage.objects.all()
    serializer_class = chatMessageSerializer
    def get_queryset(self):
        qs1 = ChatMessage.objects.filter(user = self.request.user).order_by('-created')
        if 'mode' in self.request.GET:
            return qs1
        else:
            msgs = []
            usrs = []
            # for msg in qs1:
            #     if msg.originator not in usrs or msg.read == False:
            #         msgs.append(msg)
            #         usrs.append(msg.originator)
            qs2 = ChatMessage.objects.filter(user = self.request.user).order_by('-created')
            usrs = []
            for msg in qs2:
                if msg.user not in usrs:
                    msgs.append(msg)
                    usrs.append(msg.user)
            return msgs[:300]

class chatMessageBetweenViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, readOnly)
    serializer_class = chatMessageSerializer
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        # reciepient = ChatThread.objects.get(pk = self.request.GET['other'])
        qs = ChatMessage.objects.filter(thread= self.request.GET['other'])
        # if "pk" in self.request.GET:
        #     pk = int(self.request.GET['pk'])
        #     qs1 = ChatMessage.objects.filter(thread= reciepient).filter(id__gt=pk)
        #     # qs2 = ChatMessage.objects.filter(user = self.request.user ).filter(id__gt=pk)
        # else:
        #     qs1 = ChatMessage.objects.filter(user= reciepient)
        #     # qs2 = ChatMessage.objects.filter(user = self.request.user )
        # # qs = qs1 | qs2
        # qs = qs1
        for msg in qs:
            msg.read = True
            msg.save()
        return qs.order_by('created')[:150]


class NoteBookViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = notebook.objects.all()
    serializer_class = NotebookFullSerializer


class NotesTitleViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = NotesLiteSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title']
    def get_queryset(self):
        division = self.request.user.designation.division
        notesObj = notebook.objects.filter(division = division)
        toReturn = notesObj.order_by('-created')

        return toReturn
