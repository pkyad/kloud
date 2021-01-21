from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'divisions' , DivisionViewSet , base_name = 'division')
router.register(r'unit' , UnitViewSet , base_name = 'unit')
router.register(r'unitLite' , UnitLiteViewSet , base_name = 'unitLite')
router.register(r'firstLevelUnit' , FirstLevelUnitViewSet , base_name = 'firstLevelUnit')
router.register(r'unitFull' , UnitFullViewSet , base_name = 'unitFull')
router.register(r'unitSuperLite' , UnitSuperliteViewSet , base_name = 'unitSuperLite')
router.register(r'role' , RoleViewSet , base_name = 'role')
router.register(r'companyHoliday' , CompanyHolidayViewSet , base_name = 'companyHoliday')
router.register(r'homeChart' , HomeChartViewSet , base_name = 'homeChart')
router.register(r'installedApp' , InstalledAppViewSet , base_name = 'installedApp')

urlpatterns = [
     url(r'^', include(router.urls)),
     url(r'saveSettings/$' , SaveSettingsAPIView.as_view() ),
     url(r'unitsBulkUpload/$' , UnitsBulkUploadAPIView.as_view()),
     url(r'updatePermission/$' , UpdatePermissionAPI.as_view()),
     url(r'updateReportsPermission/$', UpdateReportsPermissionAPI.as_view()),
     url(r'updateChartsPermission/$', UpdateChartsPermissionAPI.as_view()),
     url(r'dashboardData/$', DashboardDataAPI.as_view()),
     url(r'downloadChart/$', DownloadChart.as_view()),
     url(r'getMyDivision/$', GetMyDivision.as_view()),
     url(r'getheaderandfooter/$', Getheaderandfooter.as_view()),
     url(r'uninstallApp/$', UnInstallApp.as_view()),
     url(r'intallUserApp/$', InstallUserApp.as_view()),

 ]
