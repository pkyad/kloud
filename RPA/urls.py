from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'job' , JobssViewset , base_name ='jobs')
router.register(r'process' , ProcessViewset , base_name ='process')
router.register(r'machine' , MachineViewset , base_name ='machine')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'createJob/$' ,CreateJobAPIView.as_view() ),

]
