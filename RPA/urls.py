from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

# router.register(r'article' , ArticleViewSet , base_name ='article')


urlpatterns = [
    url(r'^', include(router.urls)),


]
