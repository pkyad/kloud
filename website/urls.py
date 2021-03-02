from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'page' , PageViewSet, base_name = 'page')
router.register(r'components' , ComponentsViewSet, base_name = 'components')
router.register(r'uielementemplate' , UIelementTemplateViewSet, base_name = 'uielementemplate')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'publish/$' , PublishAPIView.as_view() ),
    url(r'initializewebsitebuilder/$' , InitializewebsitebuilderAPIView.as_view() ),
    url(r'getFooterDetails/$' , GetFooterDetailsView.as_view() ),
]
