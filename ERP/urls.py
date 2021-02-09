from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'application' , applicationViewSet , base_name = 'application')
router.register(r'applicationAdminMode' , applicationAdminViewSet , base_name = 'applicationAdminMode')
router.register(r'getapplication' , getapplicationViewSet , base_name = 'application')
router.register(r'permission' , permissionViewSet , base_name = 'access')
router.register(r'productMeta' , ProductMetaViewSet , base_name = 'productMeta')
router.register(r'address' , addressViewSet , base_name = 'address')
router.register(r'service' , serviceViewSet , base_name = 'service')
router.register(r'genericPincode' , GenericPincodeViewSet , base_name='genericPincode')
router.register(r'appsettings' , appSettingsFieldViewSet , base_name='genericPincode')
router.register(r'menuitems' , MenuItemsViewSet , base_name='menuitems')
router.register(r'applicationmedia' , applicationMediaViewSet , base_name='applicationmedia')
router.register(r'mobileapplicationmedia' , MobileapplicationMediaViewSet , base_name='mobileapplicationmedia')
router.register(r'feedback' , FeedbackViewSet , base_name='feedback')
router.register(r'applicationfeature' , ApplicationFeatureViewSet , base_name='applicationfeature')
router.register(r'usageBilling' , UsageBillingViewSet , base_name='usageBilling')
router.register(r'calendarSlot' , CalendarSlotViewSet , base_name='calendarSlot')
router.register(r'userapps' , UserAppViewSet , base_name='userapps')
router.register(r'appversioning' , AppVersioningViewSet , base_name='appversioning')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'registerDevice/$' , registerDeviceApi.as_view()),
    # url(r'serviceRegistration/$' , serviceRegistrationApi.as_view() ),
    url(r'sendSMS/$' , SendSMSApi.as_view()),
    url(r'locationTracker/$' , LocationTrackerAPI.as_view()),
    url(r'getBotDetails/$' , GetBotDetailsAPI.as_view()),
    url(r'qrcode/$' , genQRCode),
    url(r'uploadmediafile/$' , uploadmediafileAPI.as_view()),
    url(r'downloadBundle/$' , downloadBundleFileAPI.as_view()),
    url(r'uploadBundle/$' , uploadBundleFileAPI.as_view()),
    url(r'getappusers/$' , GetappusersAPI.as_view()),
    url(r'generateaccesstoken/$' , generateAccessToken.as_view()),
    url(r'getAppDetails/$' , GetApplicationDetailsApi.as_view()),
    url(r'getAppSettings/$' , GetAppSettings.as_view() ),
    url(r'getAllSettings/$' , getAllSettings.as_view() ),
    url(r'dowloadExcel/$' , downloadExcelFileAPI.as_view() ),
    url(r'serviceApi/$' , serviceApi.as_view()),
    url(r'createBilling/$' , BillingCronJob),
    url(r'getBilling/$' , GetBillingAPI.as_view()),
    url(r'getAllSchedule/$' , GetAllSchedulesAPI.as_view()),
    url(r'checkAvailability/$' , CheckAvailabilityAPI.as_view()),
    url(r'addSchedule/$' , CreateScheduleAPI.as_view()),
    url(r'createNewEntry/$' , AddNewLanguageEntry.as_view()),
    url(r'getAllEntries/$' , GetAllLanguageDataAPIView.as_view()),
    url(r'getPaymentLink/$' , GetPaymentLinkAPIView.as_view()),
    url(r'addNewUser/$' , AddNewUserAPIView.as_view()),


]
