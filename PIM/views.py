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
from django.db.models import Count
from rest_framework.request import Request

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
        user = self.request.user
        toReturn = calendar.objects.filter(user = user)
        if 'date' in self.request.GET:
            dated = self.request.GET['date']
            frmdate = datetime.strptime(str(dated), '%Y-%m-%d').strftime('%Y-%m-%d %H:%M:%S')
            frmdate = datetime.strptime(str(frmdate), '%Y-%m-%d %H:%M:%S')
            toDate = frmdate.replace(hour=23, minute=59, second=59, microsecond=999999)
            qs1 = calendar.objects.filter(when__range = (frmdate , toDate), user = user).order_by('when')
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
        if 'template' in request.data:
            fileDetails = '/media/'+ file.name
        else:
            fileDetails = globalSettings.SITE_ADDRESS + '/media/'+ file.name
        data = {'link':fileDetails,'height':height,'width':width,"name":file.name}
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
    filter_fields = ['uid','status','company','participants']
    def get_queryset(self):
        print "in get queryset"
        if 'uid' in self.request.GET and 'checkThread' in self.request.GET:
            print "in iff"
            threadObj = ChatThread.objects.filter(uid = self.request.GET['uid'])
            if threadObj.count()>0:
                if threadObj[0].status != 'started':
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            return threadObj
        # return ChatThread.objects.all()
        if 'companyHandelrs' in self.request.GET and 'checkThread' in self.request.GET:
            threadObj = ChatThread.objects.filter(company = self.request.GET['companyHandelrs'])
            if threadObj.count()>0:
                if threadObj[0].status != 'started':
                    raise ValidationError(detail={'PARAMS' : 'createCookie'})
            return threadObj

        # chatObj = ChatThread.objects.filter(participants =  self.request.user) | ChatThread.objects.filter( company = self.request.user.designation.division , participants = None).order_by('is_pin')
        # isOnSupport = False
        # try:
        #     isOnSupport = self.request.user.designation.team.isOnSupport
        # except:
        #     pass
        # if self.request.user.is_staff and isOnSupport:
        #     chatObj = ChatThread.objects.filter(company = self.request.user.designation.division).filter(Q(participants =  self.request.user)|Q(uid__isnull = False, receivedBy__isnull = False)).order_by('-updated')
        # else:
        chatObj = ChatThread.objects.filter(company = self.request.user.designation.division).filter(Q(participants =  self.request.user)|Q(receivedBy = self.request.user)).order_by('-updated')




        # chatObj = ChatThread.objects.filter(company = self.request.user.designation.division).filter(Q(participants =  self.request.user)|Q(participants__isnull = True)).order_by('-updated')
        # chatObj2 = allObj.filter(is_pin = False).order_by('-updated')
        # chatObj1 = allObj.filter(is_pin = True)
        # chatObj = chatObj1|chatObj2

        if 'search' in self.request.GET :
            chatObj = chatObj.filter(Q(participants__first_name__icontains = self.request.GET['search']) | Q(participants__last_name__icontains = self.request.GET['search']) |  Q(title__icontains = self.request.GET['search']) ).distinct()
        return chatObj

class createChatThreadAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        if 'user' and 'company' in request.data:
            chatThread = ChatThread.objects.get_or_create(company__id=request.data['company'],user__id = request.data['user'],title=request.data['title'])
            chatThread.save()
        if 'received' in request.data:
            chatThread = ChatThread.objects.get(id = int(request.data['id']))
            chatThread.participants.add(request.user)
            chatThread.participantscount = 1
            chatThread.save()
            return Response(ChatThreadsSerializer(chatThread, many=False).data, status = status.HTTP_200_OK)
        return Response({}, status = status.HTTP_200_OK)

class GetChatThreadsAPIView(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        frm = request.user
        if 'transfered' in request.GET:
            toRet = ChatThreadsSerializer(ChatThread.objects.filter(company = frm.designation.division, transferred = True, participantscount = 0), many = True).data
            return Response(toRet, status = status.HTTP_200_OK)
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
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, readOnly)
    # queryset = ChatMessage.objects.all()
    serializer_class = chatMessageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['created','user','thread']
    def get_queryset(self):
        qs1 = ChatMessage.objects.all().order_by('-created')
        # if 'mode' in self.request.GET:
        return qs1
        # else:
        #     msgs = []
        #     usrs = []
        #     # for msg in qs1:
        #     #     if msg.originator not in usrs or msg.read == False:
        #     #         msgs.append(msg)
        #     #         usrs.append(msg.originator)
        #     qs2 = ChatMessage.objects.filter(user = self.request.user).order_by('-created')
        #     usrs = []
        #     for msg in qs2:
        #         if msg.user not in usrs:
        #             msgs.append(msg)
        #             usrs.append(msg.user)
        #     return msgs[:300]

class chatMessageBetweenViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, readOnly)
    serializer_class = chatMessageSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['created','user','thread']

    def get_queryset(self):
        qs = ChatMessage.objects.all()
        if 'mode' in self.request.GET:
            return ChatMessage.objects.all().order_by('created')
        # reciepient = ChatThread.objects.get(pk = self.request.GET['other'])
        if 'other' in self.request.GET:
            qs = ChatMessage.objects.filter(thread__pk = int(self.request.GET['other']))

        if 'sorted'  in self.request.GET:
            return ChatMessage.objects.filter(thread__pk = int(self.request.GET['sorted'])).order_by('-created')
        # if "pk" in self.request.GET:
        #     pk = int(self.request.GET['pk'])
        #     qs1 = ChatMessage.objects.filter(thread= reciepient).filter(id__gt=pk)
        #     # qs2 = ChatMessage.objects.filter(user = self.request.user ).filter(id__gt=pk)
        # else:
        #     qs1 = ChatMessage.objects.filter(user= reciepient)
        #     # qs2 = ChatMessage.objects.filter(user = self.request.user )
        # # qs = qs1 | qs2
        # qs = qs1
        # for msg in qs:
        #     msg.read = True
        #     msg.save()
        return qs.order_by('created')[:150]


class GetChatMessages(APIView):
    permission_classes = (permissions.AllowAny ,)
    def get(self , request , format = None):
        offset = request.GET['offset']
        limit = request.GET['limit']
        chatObj = ChatMessage.objects.filter(thread__pk = int(request.GET['id'])).order_by('-created')
        allObj = []
        toRet = []
        chatObj = chatObj[offset:limit]
        for num in reversed(range(len(chatObj))):
            allObj.append(chatObj[num])
        toRet = chatMessageSerializer(allObj, many = True).data
        return Response(toRet, status = status.HTTP_200_OK)


class NoteBookViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    queryset = notebook.objects.all()
    serializer_class = NotebookFullSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent']

class NotesTitleViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
    serializer_class = NotesLiteSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title','parent']
    def get_queryset(self):
        division = self.request.user.designation.division
        notesObj = notebook.objects.filter(division = division)
        toReturn = notesObj.order_by('-created')

        return toReturn




class CreateNewChatAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def post(self , request , format = None):
        user = request.user
        div = user.designation.division
        c_id_list = [user.pk , int(request.data['participant'])]
        parents = ChatThread.objects.filter(company = div, is_personal = True)
        # parents = reduce(lambda p, id: parents.filter(participants=id), c_id_list, parents)
        parents = parents.filter(participants = int(user.pk)).filter( participants = int(request.data['participant']))
        serializer_context = {
        'request': Request(request),
        }
        if parents.count()>0:
            data  = ChatThreadsSerializer(parents.first(), context=serializer_context).data
        else:
            chatObj = ChatThread.objects.create(user = user, company = div, is_personal = True)
            for p in c_id_list:
                chatObj.participants.add( User.objects.get(pk = int(p)))
            chatObj.save()
            chatObj.participantscount = chatObj.participants.all().count()
            chatObj.save()
            data  = ChatThreadsSerializer(chatObj, context=serializer_context).data
        return Response(data,status=status.HTTP_200_OK)


class RemoveParticipantAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def post(self , request , format = None):
        user = request.user
        chatThreadObj = ChatThread.objects.get(pk = int(request.data['thread']))
        chatThreadObj.participants.remove(user)
        chatThreadObj.save()
        data  = ChatThreadsSerializer(ChatThread.objects.filter(participants =  self.request.user).first(), many=False).data
        return Response(data,status=status.HTTP_200_OK)


class ForwardMessageAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def post(self , request , format = None):
        data =  request.data
        if 'messageId' in data and 'threads' in data:
            chatObj = ChatMessage.objects.get(pk = int(data['messageId']))
            for i in data['threads']:
                ChatMessage.objects.create(user = request.user , thread = ChatThread.objects.get(pk = int(i)), message = chatObj.message, attachment = chatObj.attachment , fileType = chatObj.fileType , fileName = chatObj.fileName,fileSize = chatObj.fileSize, is_forwarded = True)
        return Response(data,status=status.HTTP_200_OK)

class readMessageAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated ,)
    def get(self , request , format = None):
        chatObj = ChatThread.objects.get(pk = request.GET['thread'])
        chatmsgs = chatObj.messages.filter(read=False ).exclude(user = request.user)
        for i in chatmsgs:
            msg = ChatMessage.objects.get(pk = i.pk)
            msg.read = True
            msg.save()
        print chatmsgs,len(chatmsgs),"i8989iujl"
        data =  []

        return Response(data,status=status.HTTP_200_OK)
