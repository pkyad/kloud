from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'job' , JobsViewSet , base_name = 'jobss')
router.register(r'applyJob' , JobApplicationViewSet , base_name = 'applyJob')
router.register(r'interview' , InterviewViewSet , base_name = 'interview')
urlpatterns = [
     url(r'^', include(router.urls)),
     url(r'jobsList/$' , JobsList.as_view()),
     url(r'onlinelink/$' , SendLinkAPIView.as_view() ),
     url(r'scheduleInterview/$' , ScheduleInterviewAPIView.as_view() ),
     url(r'inviteInterview/$' , InviteInterviewAPIView.as_view() ),
     url(r'downloadCallLeter/$' , DownloadCallLetter.as_view() ),
     url(r'sendCallLetter/$' , SendCallLetter.as_view() ),
     url(r'saveDetails/$' , SaveDetails.as_view() ),
     url(r'dashboardRecruit/$' , DashboardDataRecruitAPIView.as_view() ),
     url(r'jobupload/$' , JobUploadAPIView.as_view() ),
     url(r'getAllJobs/$' , GetAllJobsAPIVieww.as_view() ),

 ]
