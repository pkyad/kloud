from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r'qPart' , QPartViewSet , base_name ='qPart')
router.register(r'question' , QuestionViewSet , base_name ='question')
router.register(r'paper' , PaperViewSet , base_name ='paper')
router.register(r'course' , CourseViewSet , base_name ='course')
router.register(r'enrollment' , EnrollmentViewSet , base_name ='enrollment')
router.register(r'book' , BookViewSet , base_name ='book')
router.register(r'bookLite' , BookLiteViewSet , base_name ='bookLite')
router.register(r'section' , SectionViewSet , base_name ='section')
router.register(r'sectionlite' , SectionliteViewSet , base_name ='sectionlite')
router.register(r'courseactivity' , CourseActivityViewSet , base_name ='courseactivity')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'generateQuesPaper/$' , DownloadQuesPaper.as_view() ),
    url(r'questionsAutoCreate/$' , QuestionsAutoCreate.as_view() ),
    url(r'generatePdf/$' , GeneratePdf.as_view() ),

]
