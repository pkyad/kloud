from django.conf.urls import include, url
from .views import *
from rest_framework import routers
from organization.views import DataMigrationsAPIView

router = routers.DefaultRouter()
router.register(r'contact' , ContactViewSet , base_name = 'contact')
router.register(r'contactAll' , ContactAllViewSet , base_name = 'contact')
router.register(r'contactLite' , ContactLiteViewSet , base_name = 'contactLite')
router.register(r'deal' , DealViewSet , base_name = 'deal')
router.register(r'dealLite' , DealLiteViewSet , base_name = 'dealLite')
router.register(r'contract' , ContractViewSet , base_name = 'contract')
router.register(r'activity' , ActivityViewSet , base_name = 'activity')
router.register(r'files' , FilesViewSet, base_name = 'files')
router.register(r'emailTemplate' , EmailTemplateViewSet, base_name = 'emailTemplate')
router.register(r'legalAgreement' , LegalAgreementViewSet, base_name = 'legalAgreement')
router.register(r'legalAgreementTerms' , LegalAgreementTermsViewSet, base_name = 'legalTermsAndConditions')
router.register(r'contractTracker' , ContractTrackerViewSet , base_name ='contractTracker')
router.register(r'crmtermsAndConditions' , CRMTermsAndConditionsViewSet , base_name ='crmtermsAndConditions')
router.register(r'registeredProducts' , RegisteredProductsViewSet , base_name ='registeredProducts')
router.register(r'serviceTicket' , ServiceTicketViewSet , base_name ='serviceTicket')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'downloadInvoice/$' , DownloadInvoice.as_view() ),
    url(r'sendNotification/$' , SendNotificationAPIView.as_view() ),
    url(r'clientHomeCal/$' , ClientHomeCalAPIView.as_view() ),
    url(r'reportHomeCal/$' , ReportHomeCalAPIView.as_view() ),
    url(r'sendEmail/$' , SendEmailAPIView.as_view() ),
    url(r'customerAccessData/$' , CustomerAccessAPIView.as_view() ),
    url(r'bulkContactsCreation/$' , BulkContactsAPIView.as_view()),
    url(r'bulkOpportunityCreation/$' , BulkOpportunityAPIView.as_view()),
    url(r'sendEmailAttach/$' , sendEmailAttachment.as_view() ),
    url(r'downloadOpportunity/$' , DownloadOpportunityAPIView.as_view() ),
    url(r'convertAsProject/$' , ConvertAsProject.as_view() ),
    url(r'createLegalAgreementTerms/$' , CreateLegalAgreementTerms.as_view() ),
    url(r'leagalAgreementDoc/$' , DownloadLegalAggrementAPIView.as_view() ),
    url(r'addContact/$' , AddContactAPIView.as_view()),
    url(r'addOpportunity/$' , AddOpportunityAPIView.as_view()),
    url(r'getUserTarget/$' , GetUserTargetView.as_view()),
    url(r'teamMembersStats/$' , TeamMembersStatsView.as_view()),
    url(r'chartData/$' , ChartDataView.as_view()),
    url(r'invoiceSettings/$' , InvoiceSettingsView.as_view()),
    url(r'createContact/$' , CreateContactView.as_view()),
    url(r'getBoardOptions/$' , GetBoardOptionsView.as_view()),
    url(r'saveDeal/$' , SaveDealView.as_view()),
    url(r'downloadAggrement/$' , DownloadAggrement.as_view()),
    url(r'dataMigrations/$' , DataMigrationsAPIView.as_view()),
    url(r'addProduct/$' , AddProductView.as_view()),
    url(r'downloadAllvisits/$' , DownloadAllVisitsAPIView.as_view()),
    url(r'fixDivision/$' , FixDivisionView.as_view()),
    url(r'materialIssue/$' , MaterialIssuedNoteAPIView.as_view()),
]
