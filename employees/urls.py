from django.conf.urls import include, url
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'complaints',ComplaintViewSet, base_name ='Complaints')
router.register(r'log',SystemLogViewSet, base_name ='systemLog')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'sendComplaintEmail/$' , sendComplaintEmailAPIView.as_view()),
    url(r'employeeDashboard/$' , DashboardDataEmployeeAPIView.as_view()),
    url(r'myApprovals/$' , MyApprovalsAPIView.as_view()),
    url(r'updateApprovals/$' , UpdateMyApprovalsAPIView.as_view()),
    url(r'systemLog/$' , SystemLogView),
    url(r'downloadUserProfile/$' , DownloadUserProfileApiView.as_view()),
    url(r'fetchAttendance/$' , FetchAttendanceAPIView.as_view()),
    url(r'getAttendance/$' , GetAttendanceAPIView.as_view()),


    # url(r'leaveApproval/$' , LeaveApprovalApi.as_view()),

]
