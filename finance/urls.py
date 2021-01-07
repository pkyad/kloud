from django.conf.urls import include, url
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'account' , AccountViewSet , base_name ='account')
router.register(r'accountLite' , AccountLiteViewSet , base_name ='account')
router.register(r'costCenter' , CostCenterViewSet , base_name ='costCenter')
router.register(r'transaction' , TransactionViewSet , base_name ='transaction')
router.register(r'expenseSheet' , ExpenseSheetViewSet , base_name ='expenseSheet')
router.register(r'expenseSheetLite' , ExpenseSheetLiteViewSet , base_name ='expenseSheetLite')
router.register(r'expense' , ExpenseViewSet , base_name ='expense')
router.register(r'inflow' , InflowViewSet , base_name ='inflow')
router.register(r'termsAndConditions' , TermsAndConditionsViewSet, base_name = 'termsAndConditions')
router.register(r'vendorprofile' , VendorProfileViewSet , base_name ='vendorprofile')
router.register(r'vendorservice' , VendorServiceViewSet , base_name ='vendorservice')
# router.register(r'vendorinvoice' , VendorInvoiceViewSet , base_name ='vendorinvoice')
router.register(r'expenseHeading' , ExpenseHeadingViewSet , base_name ='expenseHeading')
router.register(r'sale' , SaleViewSet , base_name ='outBoundInvoice')
router.register(r'saleAll' , SaleAllViewSet , base_name ='outBoundInvoice')
router.register(r'salesQty' , SalesQtyViewSet , base_name ='outBoundInvoiceQty')
router.register(r'inventory' , RateListViewSet , base_name ='ratelist')
router.register(r'inventoryLog' , InventoryLogViewSet , base_name ='inventoryLog')
router.register(r'configureTermsAndConditions' , ConfigureTermsAndConditionsViewSet , base_name ='configureTermsAndConditions')
router.register(r'category' , CategoryViewSet , base_name ='category')
router.register(r'disbursal' , DisbursalViewSet , base_name ='disbursal')
router.register(r'disbursallite' , DisbursalliteViewSet , base_name ='disbursallite')
router.register(r'invoiceReceived' , InvoiceReceivedViewSet , base_name ='invoiceReceived')
router.register(r'invoiceReceivedAll' , InvoiceReceivedAllViewSet , base_name ='invoiceReceivedAll')

# router.register(r'outBoundInvoice' , OutBoundInvoiceViewSet , base_name ='outBoundInvoice')
# router.register(r'outBoundInvoiceAll' , OutBoundInvoiceAllViewSet , base_name ='outBoundInvoice')
# router.register(r'outBoundInvoiceQty' , OutBoundInvoiceQtyViewSet , base_name ='outBoundInvoiceQty')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'uplodInflowData/$' , UplodInflowDataAPI.as_view()),
    url(r'getExpenseData/$' , GetExpenseDataAPI.as_view()),
    url(r'expensesGraphData/$' , ExpensesGraphDataAPI.as_view()),
    url(r'monthsExpensesData/$' , MonthsExpensesDataAPI.as_view()),
    url(r'downloadExpenseSummary/$' , DownloadExpenseSummaryAPI.as_view()),
    url(r'grnDownload/$' , GrnAPIView.as_view()),
    url(r'invoiceDownload/$' , InvoiceAPIView.as_view()),
    url(r'poDownload/$' , PODownloadAPIView.as_view()),
    url(r'sendInvoice/$' , SendInvoiceAPIView.as_view()),
    url(r'average/$' , AverageAPIView.as_view()),
    url(r'invoiceSheet/$' , InvoiceSheetAPIView.as_view()),

    url(r'PaymentPage/$' , PaymentPageAPI.as_view()),
    # url(r'Payment/$' , PaymentAPI.as_view()),
    url(r'^paypal/', include('paypal.standard.ipn.urls')),
    url(r'paypalPaymentInitiate/$' , paypalPaymentInitiate , name = "paypalPaymentInitiate" ),
    url(r'paypal_return_view/$' , paypal_return_view , name = "paypal_return_view" ),
    url(r'paypal_cancel_view/$' , paypal_cancel_view , name = "paypal_cancel_view" ),

    # url(r'gstCalculation/$' , GstCalculationAPIView.as_view()),
    url(r'gstCalculation/$' , GstCalculationAPIView.as_view()),
    url(r'amountCalculation/$' , AmountCalculationAPIView.as_view()),
    url(r'getExpenses/$' , GetExpensesAPIView.as_view()),
    url(r'downloadExpenses/$' , DownloadExpensesAPIView.as_view()),
    url(r'downloadSheet/$' , DownloadSheetAPIView.as_view()),
    url(r'getTotalExpenses/$' , GetExpensesTotalAPIView.as_view()),
    url(r'createExpenses/$' , CreateExpensesAPIView.as_view()),
    url(r'downloadExpensesPdf/$' , DownloadExpensesPdfAPIView.as_view()),
    url(r'createOrder/$' , CreateOrderAPI.as_view()),
    url(r'allExpenses/$' , AllExpensesAPI.as_view()),
    url(r'purchaseOrderspreadSheet/$' , PurchaseOrderSpreadsheetAPI.as_view()),
    url(r'inboundInvoiceExcel/$' , InboundInvoiceExcelAPI.as_view()),
    url(r'invoicingSpreadsheet/$' , InvoicingSpreadsheetAPI.as_view()),
    url(r'PettyCashAccpdf/$' , PettyCashAccpdfAPI.as_view()),
    url(r'getOutBoundCount/$' , GetOutBoundCountAPI.as_view()),
    url(r'accountsSpreadSheet/$' , AccountsSpreadSheetAPI.as_view()),
    url(r'pettyCashJournal/$' , PettyCashJournalAPI.as_view()),
    url(r'gettTransactions/$' , GettTransactionsAPI.as_view()),
    url(r'getAccount/$' , GetAccountAPI.as_view()),
    url(r'cashFlow/$' , CashFlowAPI.as_view()),
    url(r'balanceSheet/$' , BalanceSheetAPI.as_view()),
    url(r'ProfitandLoss/$' , ProfitLossAPI.as_view()),
    url(r'cashFlowpdf/$' , CashFlowPdfAPI.as_view()),
    url(r'profitlossspdf/$' , ProfitLossPdfAPI.as_view()),
    url(r'balancesheetpdf/$' , BalanceSheetPdfAPI.as_view()),
    url(r'getAccountTransactions/$' , GetAccountTransactionsAPI.as_view()),
    url(r'getPettyCashData/$' , GetPettyCashDataAPI.as_view()),
    url(r'gstr3b/$' , GSTR3BAPI.as_view()),
    url(r'gstr3bPdf/$' , GSTR3BPdfAPI.as_view()),



    url(r'getCashFlow/$' , GetCashFlowAPI.as_view()),
    url(r'getBalanceSheet/$' , GetBalanceSheetAPI.as_view()),
    url(r'getVendorDetails/$' , GetVendorDetailsAPI.as_view()),

    url(r'PurchaseOrderPdf/$' , PurchaseOrderPDFAPI.as_view()),

    url(r'getallCount/$' , GetAllCountAPI.as_view()),
    url(r'createTransaction/$' , CreateTransactionsAPI.as_view()),
    url(r'fetchExpenses/$' , GetAllExpensesAPI.as_view()),
    url(r'expenseTransactionCreate/$' , CreateExpenseTransactionAPI.as_view()),
    url(r'salesTransactionCreate/$' , CreateSalesTransactionAPI.as_view()),
    url(r'outbondInvoiceDetails/$' , OuttbondInvoiceAPIView.as_view()),
    url(r'journal/$' , JournalAPIView.as_view()),
    url(r'expenseInvoice/$' , ExpenseInvoiceAPIView.as_view()),
    url(r'purchaseOrderInvoice/$' , PurchaseOrderInvoiceAPIView.as_view()),
    url(r'uploadTransactions/$' , UploadTransactionsAPIView.as_view()),
    url(r'getExpensesData/$' , GetExpensesDataAPIView.as_view()),
    url(r'getExpensesExcel/$' , GetExpensesExcelAPI.as_view()),
    url(r'getAllTour/$' , GetAllTourAPI.as_view()),
    url(r'getUpdatedInvoiceAmount/$' , GetUpdatedInvoiceAmountAPI.as_view()),
    url(r'getInventory/$' , GetInventoryAPI.as_view()),
    url(r'ProductsCatalog/$' , ProductsCatalogAPI.as_view()),
    url(r'getAccountTotal/$' , GetAccountsTotalAPIView.as_view()),
    url(r'saveInvoice/$' , SaveInvoiceReceived.as_view()),

]
