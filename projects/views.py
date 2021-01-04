from django.shortcuts import render
from rest_framework import viewsets , permissions , serializers
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from .models import *
from performance.models import *
from taskBoard.models import task
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
from rest_framework.response import Response

# Create your views here.


class mediaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = mediaSerializer
    queryset = media.objects.all()

class projectCommentViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = projectCommentSerializer
    queryset = projectComment.objects.all()

class ProjectObjectiveViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ProjectObjectiveSerializer
    queryset = ProjectObjective.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['parent']


class projectViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = projectSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title','costCenter','projectClosed','ourBoundInvoices']
    def get_queryset(self):
        u = self.request.user
        if u.is_superuser:
            return project.objects.all()
        else:
            return u.projectsInitiated.all() | u.projectsInvolvedIn.all() | project.objects.filter(team = None)

class projectLiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated, permissions.DjangoModelPermissionsOrAnonReadOnly)
    serializer_class = projectLiteSerializer
    queryset = project.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['title']

class timelineItemViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = timelineItemSerializer
    queryset = timelineItem.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['project', 'category']

class IssueViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['project','responsible']
    def get_queryset(self):
        queryset = Issues.objects.all()
        if 'result' in self.request.GET:
            if self.request.GET['result'] == 'null':
                queryset = queryset.filter(result = None)
                print "only pending"

        return queryset


class DashboardDataProjectMgmtAPIView(APIView):
    renderer_classes = (JSONRenderer,)
    def get(self, request, format=None):
        toRet = {}
        print ' Dashboard Data ProjectMgmt'
        projectObj = project.objects.filter(projectClosed=False)
        teamCount = 0
        for i in projectObj:
            pTCount = i.team.all().count()
            teamCount += pTCount
        issue = Issues.objects.all()
        taskObj = task.objects.all()
        toRet['projectCount']=projectObj.count()
        toRet['issueCount']=issue.count()
        toRet['teamCount']=teamCount
        toRet['taskCount']=taskObj.count()
        return Response(toRet,status=status.HTTP_200_OK)
