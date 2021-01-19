from django.conf.urls import include, url
from .views import *
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt


router = routers.DefaultRouter()
router.register(r'forumfiles' , ForumFilesViewSet , base_name = 'forumfies')
router.register(r'forum' , ForumViewSet , base_name = 'forum')
router.register(r'forumCommentfies' , ForumCommentFilesViewSet , base_name = 'forumCommentfies')
router.register(r'forumComment' , ForumCommentViewSet , base_name = 'forumComment')



urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'forumapi/$' , ForumAPI.as_view()),
    url(r'getForums/$' , GetForumAPI.as_view()),
    url(r'forumcommentapi/$' , ForumCommentAPI.as_view()),
]
