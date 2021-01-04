
from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'forumthread' , ForumThreadViewSet , base_name ='forumthread')
router.register(r'forumcomment' , ForumCommentViewSet , base_name ='forumcomment')

urlpatterns = [

]
