from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'article' , ArticleViewSet , base_name ='article')
router.register(r'articleSection' , ArticleSectionViewSet , base_name ='articleSection')
router.register(r'comment' , CommentViewSet , base_name ='comment')


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'getCategories/$' , GetCategoriesAPI.as_view()),



]
