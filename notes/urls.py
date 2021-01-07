
from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'notebook' , notebookViewSet , base_name ='notebook')
# router.register(r'page' , pageViewSet , base_name ='page')

urlpatterns = [

]
