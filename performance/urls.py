from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'timeSheet' , TimeSheetViewSet , base_name = 'timeSheet')
router.register(r'feedback' , FeedbackViewSet , base_name = 'feedback')



urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'projectContribution/$' , ProjectContributionAPIView.as_view()),
    url(r'updateAttendance/$' ,UpdateAttendanceAPIView.as_view() ),
    url(r'getAttendance/$' ,GetAttendanceAPIView.as_view() ),
    url(r'projectCost/$' ,ProjectCostAPIView.as_view() ),
]
