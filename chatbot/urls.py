from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
# router.register(r'divisions' , DivisionViewSet , base_name = 'division')
router.register(r'faq' , FAQViewSet , base_name = 'faq')
router.register(r'faqInpVariations' , FAQInputVariationViewSet , base_name = 'faqInpVariations')
router.register(r'intentsLite' , IntentLiteViewSet , base_name = 'intentsLite')
router.register(r'intents' , NodeBlockViewSet , base_name = 'intents')
router.register(r'nodeselectionsvariations' , NodeSlectionsVariationsViewSet , base_name = 'nodeslectionsvariations')
router.register(r'startovervariations' , StartoverVariationsViewSet , base_name = 'startovervariations')
router.register(r'actionintentinputvariation' , ActionIntentInputVariationViewSet , base_name = 'actionintentinputvariation')
router.register(r'connection' , ConnectionViewSet , base_name = 'connection')
router.register(r'chatThread' , ChatThreadViewSet , base_name = 'chatThread')
router.register(r'supportChat' , SupportChatViewSet , base_name = 'supportChat')
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'intentView/(?P<id>[\w|\W]+)/$' , IntentView.as_view() ),
    url(r'cloneGallery/$' , CloneAPIView.as_view() ),
    url(r'saveSettings/$' , SaveSettingsAPIView.as_view() ),
    url(r'getExampleInput/$' , GetExampleInputView.as_view() ),
    url(r'uipathResources/$' , UIPathResourcesAPIView.as_view()),
    url(r'gallery/$' , GalleryAPIView.as_view() ),
    url(r'publicFacing/(?P<objectType>[\w|\W]+)/$' , publicAPI ),

     # url(r'saveSettings/$' , SaveSettingsAPIView.as_view() ),

 ]
