from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()


router.register(r'settings' , settingsViewSet , base_name = 'settings')
router.register(r'theme' , themeViewSet , base_name = 'theme')
router.register(r'notification' , notificationViewSet, base_name = 'notification')
router.register(r'calendar' , calendarViewSet , base_name = 'calendar')
router.register(r'chatMessage' , chatMessageViewSet, base_name = 'chatmessage')
router.register(r'chatMessageBetween' , chatMessageBetweenViewSet, base_name = 'chatbetween')
router.register(r'chatThreads' , ChatThreadsViewSet , base_name = 'chatThreads')
router.register(r'notes' , NoteBookViewSet , base_name = 'notes')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'saveImage/$' , SaveImageAPIView.as_view() ),
    url(r'genCalendarNotifications/$' , CalendarNotificationsAPIView.as_view() ),
    url(r'getChatThreads/$' , GetChatThreadsAPIView.as_view() ),
    url(r'createNotification/$' , CreateNotificationAPIView.as_view()),
]
