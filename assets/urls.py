from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'checkin' , CheckinViewSet , base_name = 'checkin')



urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'createCheckin/$' , CheckinCreationAPI.as_view()),
    url(r'getAssets/$' , AssetsInsightAPI.as_view()),
    url(r'assignedList/$' , AssignedListAPIView.as_view()),

 ]
