from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'products' , ProductsViewSet , base_name = 'products')
router.register(r'vendor' , VendorViewSet , base_name = 'vendor')
router.register(r'productsheet' , ProductSheetViewSet , base_name = 'productsheet')
router.register(r'projects' , ProjectsViewSet , base_name = 'projects')
router.register(r'projectSearch' , ProjectSearchViewSet , base_name = 'projectSearch')
router.register(r'bom' , BoMViewSet , base_name = 'bom')
router.register(r'inventory' , InventoryViewSet , base_name = 'inventory')
router.register(r'materialqty' , MaterialIssueViewSet , base_name = 'materialIssue')
router.register(r'material' , MaterialIssueMainViewSet , base_name = 'materialIssuemain')
router.register(r'stockcheck' , StockCheckViewSet , base_name = 'stockcheck')
router.register(r'stockchecklog' , StockCheckLogViewSet , base_name = 'stockchecklog')
router.register(r'stockSummaryReport' , StockSummaryReportViewSet , base_name = 'stockSummaryReport')
router.register(r'projectStockSummary' , ProjectStockSummaryViewSet , base_name = 'projectStockSummary')
router.register(r'iminvoice' , IMInvoiceViewSet , base_name = 'invoice')
router.register(r'iminvoiceQty' , IMInvoiceQtyViewSet , base_name = 'invoiceQty')
router.register(r'deliveryChallan' , DeliveryChallanViewSet , base_name = 'deliveryChallan')
router.register(r'stockCheckReport' , StockCheckReportViewSet , base_name = 'stockCheckReport')
router.register(r'stockCheckItem' , StockCheckItemViewSet , base_name = 'stockCheckItem')
router.register(r'complaintManagement' , complaintManagementViewSet , base_name = 'complaintManagement')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'ProductsUpload/$' , ProductsUploadAPIView.as_view() ),
    url(r'ProductsUpdate/$' , ProductsUpdateAPIView.as_view() ),
    url(r'UploadSheet/$' , UploadSheetAPIView.as_view() ),
    url(r'POSlip/$' , GetPurchaseAPIView.as_view() ),
    url(r'landingDetail/$' , GetLandingAPIView.as_view() ),
    url(r'quotation/$' , QuotationAPIView.as_view() ),
    url(r'inventoryData/$' , ProductInventoryAPIView.as_view() ),
    url(r'order/$' , OrderAPIView.as_view() ),
    url(r'materialIssued/$' , MaterialIssuedNoteAPIView.as_view() ),
    url(r'grn/$' , GrnAPIView.as_view() ),
    url(r'sendEmail/$' , EmailApi.as_view() ),
    url(r'complaintEmail/$' , complaintEmailApi.as_view() ),
    url(r'calculate/$' , CalculateAPIView.as_view() ),
    url(r'getMaterial/$' , GetMaterialAPIView.as_view() ),
    url(r'projectStockConsumption/$' , DownloadProjectSCExcelReponse.as_view() ),
    url(r'createStockReportData/$' , CreateStockReportDataAPIView.as_view() ),
    url(r'downloadStockReport/$' , DownloadStockReportAPIView.as_view() ),
    url(r'downloadInvoiceReport/$' , DownloadInvoiceReportAPIView.as_view() ),
    url(r'stockDetial/$' , StockDownloadAPIView.as_view() ),
    url(r'getCmrList/$' , GetCmrListAPIView.as_view() ),
    url(r'productTable/$' , ProjectProductAPIView.as_view() ),
    url(r'cancelMaterial/$' , CancelMaterialAPIView.as_view() ),
    url(r'deliveryChallanDownload/$' , DeliveryChallanNoteAPIView.as_view() ),
    url(r'invoiceDownload/$' , InvoiceDownloadAPIView.as_view() ),
    url(r'stockCheck/$' , StockReportAPIView.as_view() ),
    url(r'stockSheet/$' , StockSheetAPIView.as_view() ),
    url(r'addInventory/$' , AddInventoryAPIView.as_view() ),
    url(r'addInvoiceQtys/$' , AddInvoiceQtysAPIView.as_view() ),
    url(r'bulkCreateInventory/$' , BulkCreateInventoryAPIView.as_view() ),
    url(r'purchasewiseReport/$' , PurchasewiseReportAPIView.as_view() ),
    url(r'consumptionewiseReport/$' , ConsumptionewiseReportAPIView.as_view() ),
    url(r'stockAvailableReport/$' , StockAvailableReportAPIView.as_view() ),
    url(r'getCommnr/$' , getProjObjViewset.as_view(), name="getCommnr" ),
    url(r'complaintPdf/$' , complaintPdf, name="complaintPdf"),
    url(r'customercomplaintReport/$' ,customercomplaintReport),
    url(r'datewiseinvoiceReport/$' ,datewiseInvoicereport),
    # url(r'importExportDataMigrations/$' , ImportExportDataMigrationsAPIView.as_view()),
    # url(r'stock/$' , StockAPIView.as_view() ),
]
