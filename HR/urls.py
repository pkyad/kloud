from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'users' , UserViewSet , base_name = 'user')
router.register(r'groups' , GroupViewSet)
router.register(r'document' , DocumentViewSet , base_name = 'document')
router.register(r'usersAdminMode' , userAdminViewSet , base_name = 'userAdminMode')
router.register(r'userSearch' , UserSearchViewSet , base_name = 'userSearch')
router.register(r'userCreate' , userCreateViewSet , base_name = 'userCreate')
router.register(r'profile' , userProfileViewSet , base_name ='profile')
router.register(r'profileAdminMode' , userProfileAdminModeViewSet , base_name ='profileAdminMode')
router.register(r'designation' , userDesignationViewSet , base_name = 'designation')
router.register(r'leave' , leaveViewSet , base_name = 'leave')
router.register(r'appraisal' , AppraisalViewSet , base_name = 'appraisal')
router.register(r'exitManagement' , ExitManagementViewSet , base_name = 'exitManagement')
router.register(r'team' , TeamViewSet , base_name = 'team')
router.register(r'teamAll' , TeamAllViewSet , base_name = 'teamAll')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'leavesCal/$' , LeavesCalAPI.as_view()),
    url(r'profileOrgCharts/$' , OrgChartAPI.as_view()),
    url(r'sendDeboardEmail/$' ,sendDeboardingEmailAPIView.as_view() ),
    url(r'usersBulkUpload/$' ,UserBulkUploadAPIView.as_view() ),
    url(r'savelocation/$' ,SaveLocationAPIView.as_view() ),
    url(r'getUsersl/$' ,GetUsersAPIView.as_view() ),
    url(r'fetchall/$' ,fetchAllDetailsAPIView.as_view() ),
    url(r'myApps/$' ,GetMyAppsView.as_view() ),
    url(r'updatePayrollDesignationMasterAcc/$' ,UpdatepayrollDesignationMasterAccountAPI.as_view() ),
    url(r'passkey/$' , GeneratePassKey.as_view() ),
    url(r'addTeamMember/$' , AddTeamMemberAPIView.as_view()),
    url(r'getWelcomeDetails/$' , GetWelcomeDetailsAPIView.as_view()),
    url(r'myProfile/$' , myProfile , name="myprofile"),
    url(r'sendWelcomeKit/$' , sendWelcomeKite, name="sendWelcomeKite" ),
    url(r'appInstaller/$' , AppInstallerView.as_view(), name="appInstaller" ),
    url(r'updatePushToken/$' , UpdatePushTokenView.as_view(), name="updatePushToken" ),
    url(r'regNewUser/$' , RegNewUserView.as_view(), name="regNewUser" ),
]
