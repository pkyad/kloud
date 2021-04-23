from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'job' , JobssViewset , base_name ='jobs')
router.register(r'process' , ProcessViewset , base_name ='process')
router.register(r'machine' , MachineViewset , base_name ='machine')
router.register(r'jobContext' , JobContextViewset , base_name ='jobContext')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'createJob/$' ,CreateJobAPIView.as_view() ),
    url(r'isMachineExist/$' ,is_machine_exist, name = 'isMachineExist' ),
    url(r'getContext/$' ,get_context, name = 'getContext' ),
    url(r'setContext/$' ,set_context, name = 'setContext' ),   
    url(r'updateJobStatus/$' ,update_job_status, name = 'updateJobStatus' ),     

]
