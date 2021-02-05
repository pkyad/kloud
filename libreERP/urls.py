from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings as globalSettings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from HR.views import *
from marketing.views import *
from ERP.views import *
# from django.conf.urls.defaults import *
from HR.pages import *
from website.views import *
from finance.views import *
from chatbot.views import *
app_name="libreERP"


urlpatterns = [
    url(r'^$', storeHome , name ='storeHome'),
    url(r'^ERP', home , name ='ERP'),
    url(r'^api/', include('API.urls')),
    url(r'^django/', include(admin.site.urls)),
    url(r'^admin/', adminView , name ='adminView'),
    url(r'^welcome/', WelcomeView , name ='welcome'),
    url(r'^newuser/', NewUserView , name ='newuser'),
    url(r'^e-sign/', eSignView , name ='esign'),
    url(r'^login', loginView , name ='login'),
    url(r'^otpreg/', RegView , name ='otpreg'),
    url(r'^otplogin/(?P<id>\d+)', loginOTPView , name ='otplogin'),
    url(r'^logout/', logoutView , name ='logout'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^robots\.txt', include('robots.urls')),
    url(r'^generateOTP/', generateOTPView, name="generateOTP"),
    url(r'^(\w+)_(\d+).png', emailTracks.as_view()),
    url(r'^updateEmailOpen', OpenEmailUpdate.as_view()),
    url(r'^tlogin/', TokenLogin , name ='tlogin'),
    url(r'^whatsappHook/', WhatsappHookView , name ='whatsappHook'),
    url(r'^searchPeople/', SearchPeopleView , name ='searchPeople'),
    url(r'^integrate/zoom/', handleIntegration , name ='searchPeople'),
    url(r'^qrLogin/' , QrLoginView , name ='qrLogin'),
    url(r'makeOnlinePayment/$' , makeOnlinePayment , name = "makeOnlinePayment" ),
    url(r'^razorpayPaymentInitiate/', razorpayPaymentInitiate , name ='razorpayPaymentInitiate'),
    url(r'^razorpayPaymentResponse/', razorpayPaymentResponse , name ='razorpayPaymentResponse'),
    url(r'^page1/', page1 , name ='page1'),
    url(r'^page3/', page3 , name ='page3'),
    url(r'^page4/', page4 , name ='page4'),
    url(r'^page5/', page5 , name ='page5'),
    url(r'^page6/', page6 , name ='page6'),
    url(r'^page7/', page7 , name ='page7'),
    url(r'^page8/', page8 , name ='page8'),
    url(r'^page9/', page9 , name ='page9'),
    url(r'^page10/', page10 , name ='page10'),
    url(r'^page11/', page11 , name ='page11'),
    url(r'^carouselsection/', carouselsection , name ='carouselsection'),
    url(r'^aboutus', aboutus , name ='aboutus'),
    url(r'^contactus', contactus , name ='contactus'),
    url(r'^terms', termsofservices , name ='terms'),
    url(r'^blog', blog , name ='blog'),
    url(r'^academy/(?P<id>\d+)', academy , name ='academy'),
    url(r'^course/(?P<id>\d+)/(?P<urlSuffix>[\w|\W]+)', coursedetails , name ='coursedetails'),
    url(r'^articles/(?P<articleUrl>[\w|\W]+)', renderedArticleView , name ='blogs/(?P<articleUrl>[\w|\W]+)'),
    url(r'^privacypolicy', privacypolicy , name ='privacypolicy'),
    url(r'^careers', careers , name ='careers'),
    url(r'^career/(?P<id>\d+)', career , name ='career'),
    url(r'^apply', renderedModalView , name ='renderedModalView'),
    url(r'^pageeditor/(?P<id>\d+)', pageeditor , name ='pageeditor'),
    url(r'^uielement/', uielement , name ='uielement'),
    url(r'^renderheaderfooter/', renderheaderfooter , name ='renderheaderfooter'),
    url(r'^headerfooter/', headerfooter , name ='headerfooter'),
    url(r'^appdetails/', appdetails , name ='appdetails'),
    url(r'^productDetails/', ProductDetails , name ='ProductDetails'),
    url(r'^products/(?P<id>\d+)', getProducts , name ='products'),
    url(r'^preview/(?P<id>\d+)', preview , name ='preview'),
    url(r'^ngTemplates/(?P<filename>[\w|\W]+)', renderedStatic , name ='renderedStatic'),
    url(r'^templateEditor/(?P<pk>[\w|\W]+)/', templateEditorView , name ='templateEditor'),
    url(r'intentDesigner/(?P<id>[\w|\W]+)/' , intentDesignerView , name = "intentDesigner"),
    url(r'^script/chatter-(?P<fileid>[\w|\W]+).js', getChatterScript , name ='getChatterScript'),
    url(r'activities' , activityView , name = "activity"),
    url(r'^externalWindow/', ExternalWindow , name ='externalWindow'),
    url(r'^zoomAuthRedirect/', ZoomAuthRedirect , name ='zoomAuthRedirect'),
    url(r'^getPaymentLink/', GetPaymentLink , name ='getPaymentLink'),


    # url(r'extractorTester/$' , ExtractorTesterView.as_view() , name = "extractorTester"),

]


if globalSettings.DEBUG:
    urlpatterns +=static(globalSettings.STATIC_URL , document_root = globalSettings.STATIC_ROOT)
    urlpatterns +=static(globalSettings.MEDIA_URL , document_root = globalSettings.MEDIA_ROOT)

urlpatterns.append( url(r'^pages/(?P<url>[\w|\W]+)', renderpage , name ='pages/(?P<url>[\w|\W]+)'))
