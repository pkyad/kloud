from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'payslip' , payslipViewSet , base_name = 'payslip')
router.register(r'report' , payrollReportViewSet , base_name = 'report')
router.register(r'advances' , advancesViewSet , base_name = 'advances')
router.register(r'itDeclaration' , ITDeclarationViewSet , base_name ='itDeclaration')
router.register(r'form16' , Form16ViewSet , base_name ='form16')
router.register(r'payrollLogs' , PayrollLogsViewSet , base_name = 'payrollLogs')
router.register(r'payroll' , payrollViewSet , base_name = 'payroll')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'getPayslip/$' , GetPayslip.as_view() ),
    url(r'payslipsReport/$' , PayslipsReport.as_view() ),
    url(r'getReimbursement/$' ,GetReimbursement.as_view()  ),
    url(r'tdsReport/$' ,TDSslipsReport.as_view()  ),
    url(r'pfReport/$' ,PFslipsReport.as_view()  ),
    url(r'getPayMonthlyslip/$' ,GetPayMonthlyslip.as_view()  ),
    url(r'getMonth/$' ,GetAllMonths.as_view()  ),
    url(r'sendPayslips/$' ,SendPayslipEmailAPIView.as_view() ),
    url(r'getDisbursalSheet/$' ,GetDisbursalSheetAPI.as_view() ),
    url(r'sendDisbursalEmail/$' ,sendDisbursalEmailAPIView.as_view() ),
    url(r'advancesData/$' , AdvancesDataAPI.as_view()),
    url(r'sendLoanSettlementEmail/$' , sendLoanSettlementEmailAPIView.as_view()),
    url(r'allPaySlips/$' , AllPaySlipsAPIView.as_view()),
    url(r'getITDeclaration/$' , GetITDecarationAPIView.as_view()),
    url(r'getLimit/$' , GetLimitAPIView.as_view()),
    url(r'addITDeclaration/$' , AddITDeclarationAPIView.as_view()),
    url(r'savepayslip/$' , SavepayslipAPIView.as_view()),
    url(r'getAllPayroll/$' , GetAllPayrollAPIView.as_view()),
    url(r'reCaluclate/$' , ReCalculateAPIView.as_view()),
    url(r'getPayslipDetails/$' , GetPaySlipDetailsAPIView.as_view()),
]
