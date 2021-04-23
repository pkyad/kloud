from django.conf.urls import include, url
from .views import *
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt


router = routers.DefaultRouter()
router.register(r'contacts' , ContactsViewSet , base_name = 'contacts')
router.register(r'tag' , TagViewSet , base_name = 'tag')
router.register(r'campaign' , CampaignViewSet , base_name = 'campaign')
router.register(r'emailcampaignItem' , EmailCampaignItemViewSet , base_name = 'emailcampaignItem')
router.register(r'callcampaignItem' , CallCampaignItemViewSet , base_name = 'callcampaignItem')
router.register(r'tourplan' , TourPlanViewSet , base_name ='tourPlan')
router.register(r'tourPlanStop' , TourPlanStopViewSet , base_name ='tourPlanStop')
router.register(r'campaigntrack' , CampaignTrackerViewSet , base_name ='campaigntrack')
router.register(r'campaignLogs' , CampaignLogsViewSet , base_name ='campaignLogs')



urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'getCampaignStats/$' , GetCampaignStatsAPIView.as_view()),
    url(r'bulkContacts/$' , BulkContactsAPIView.as_view()),
    url(r'contactsScraped/$' , ContactsScrapedAPIView.as_view()),
    url(r'sourceSuggest/$' , SourceSuggestAPIView.as_view()),
    url(r'inviteMail/$' , InvitationMailApi.as_view()),
    url(r'convertLead/$' , ConvertLeadApi.as_view()),
    url(r'getLastID/$' , GetLastIDApi.as_view()),
    url(r'getCountries/$' , GetCountriesApi.as_view()),
    url(r'getSources/$' , GetSourcesApi.as_view()),
    url(r'getContactsCount/$' , GetContactsCountApi.as_view()),
    url(r'addCampaign/$' , AddCampaign.as_view()),
    url(r'getNextEntry/$' , GetNextEntryApiView.as_view()),
    url(r'contactsBulkUpload/$' , ContactsBulkUploadAPIView.as_view()),
    url(r'plan/$' , CreatePlanAPI.as_view()),
    url(r'requestOtp/$' , RequestOtpAPI.as_view()),
    url(r'verifyOtp/$' , VerifyOtpAPI.as_view()),
    url(r'createInvoice/$' , CreateInvoiceAPI.as_view()),
    url(r'getVisit/$' , getVisitsAPI.as_view()),
    url(r'saveAudio/$' , addAudioAPI.as_view()),
    url(r'saveCall/$' , addCallAudioAPI.as_view()),
    url(r'checkAsset/$' , checkAssetAPI.as_view()),
    url(r'dashboard/$' , DashBoardAPI.as_view()),
    url(r'adminDashboarddetails/$' , AdminDashBoardAPI.as_view()),
    url(r'getAreaCode/$' , GetAreaCodeAPIView.as_view()),
    url(r'getlogs/$' , getAllLog.as_view()),
    url(r'getloaction/$' , getLocation.as_view()),
    url(r'bulkEmail/$' , BulkEmailAPIView.as_view()),

    url(r'getemailTemplates/$', GetEmailTemplatesAPI.as_view()),

    url(r'getStatus/$', GetTechStatusAPI.as_view()),
    url(r'getTechnicianInfo/$', GetTechincianInfoAPI.as_view()),
    url(r'getAllTechnicianInfo/$', GetAllTechincianInfoAPI.as_view()),
    # url(r'emailDataVerify/$', emailDataVerifyAPI.as_view()),

    url(r'uploadTemplates/$', UploadTemplatesAPI.as_view()),
    url(r'getCampaignDetails/$', getCampaignDetailsAPI.as_view()),

    url(r'searchChekin/$', searchChekinAPI.as_view()),

    url(r'campaignfollowup/$', FollowUpCampaignAPI.as_view()),
    url(r'correctContactDetails/$', CorrectContactDetailsView.as_view()),
    url(r'homepageDetails/$', homePageAPIView.as_view()),
    url(r'getPendingTask/$', GetPendingTasksAPIView.as_view()),
    url(r'genInvoice/$', GenerateInvoiceAPIView.as_view()),
    url(r'sendmailandpdf/$' , SendMailPDFAPIView.as_view()),
    url(r'getTodayInvoice/$' , GetTodayInvoiceIView.as_view()),
    url(r'callCustomer/$' , CallCustomerView.as_view()),
    url(r'callCurrentCustomer/$' , CallCurrentCustomerView.as_view()),
    url(r'fetchRecordings/$' , FetchRecordingsView.as_view()),
    url(r'sendCallReport/$' , SendCallReportAPI.as_view()),
    url(r'getEmailCampaignStats/$' , GetEmailCampaignStatsView.as_view()),
    url(r'sendTestMail/$' , SendTestMailAPIView.as_view()),
    url(r'servicereciept/$' , ServiceRecieptAPIView.as_view()),
    url(r'getOnlyContacts/$' , GetOnlyContactAPIView.as_view()),
    url(r'saveNextStop/$' , SaveNextStopAPIView.as_view()),
    url(r'getVisitDetails/$' , GetVisitDetailsAPIView.as_view()),
    url(r'getCount/$' , GetCountAPIView.as_view()),
    url(r'gsmCallRecording/$' , GSMCallRecordingAPIView.as_view()),
    url(r'deleteInvoice/$' , DeleteInvoiceAPI.as_view()),
    url(r'fetchSIPCalls/$' , FetchSIPCalls.as_view()),
    url(r'updatePlayTime/$' , UpdatePlayTime.as_view()),
    url(r'getCampDetails/$' , GetCampDetailsAPIView.as_view()),
    url(r'downloadDailyCallReport/$' , DownloadDailyCallReportAPIView.as_view()),
    url(r'sendNofctn/$' , SendNotfcnAPIView.as_view()),
    url(r'expenseSheetCreate/$' , createExpenseSheetAPIView.as_view()),
    url(r'downloadExpenses/$' , DownloadExpensesAPIView.as_view()),
    url(r'data_migration/$' , MarketingDataMigrationsAPIView.as_view()),
]
