"""
Django settings for libreERP project.

Generated by 'django-admin startproject' using Django 1.8.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from django.contrib.messages import constants as messages

MESSAGE_TAGS = {
    messages.ERROR: 'danger',
    messages.SUCCESS: 'success'
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_APPS_ON_REGISTER = ['app.ecommerce' , 'app.ecommerce.orders' , 'app.ecommerce.offerings','app.ecommerce.earnings']
# the apps to which the user will be given access to upon registeration through public registeration site
DISABLED_APPS = ['app.social' , 'app.advances']

ON_REGISTRATION_SUCCESS_REDIRECT = '/ERP' # when signup using google the user will be redirected to this url
MATERIAL_INWARD = False
SITE_ADDRESS = 'http://localhost:8000' # the url prefix of the site
LIMIT_EXPENSE_COUNT= False
ROOT_APP = 'index' # the default app
ECOMMERCE_APP = {
    'ui': 'food', # the options can be food , rental, shop
    # food UI is like Fassos or Zomatto
    # rental UI is like zoomcar
    # shop UI is like Amazon
    'offtime':[23, 9],
}
PARENT_DIVSION = 2
LOGIN_PAGE_IMAGE = '/static/images/loginPage.png'
APIMANAGER_URL_PREFIX = 'https://api.epsilonai.com'
APIMANAGER_URL_KEY = '123456'
SUBSCRIPTION_AMOUNT = 1


CRM_SEPERATE_TAX_DETAILS = True
LOGIN_URL = 'login' # this can be 'login' or 'account_login'
REGISTER_URL = 'register' # this can be 'register' or 'account_signup'
INVOICE_TYPE = 'V3'
INVOICE_NUMBER_PREFIX = 'ZIGMA/20-21/'
CRM_OFFSET = 200
INVOICE_THEME_COLOR_V2 = '#1e73be'
IS_AGGREMENT = True
# DISABLED_APPS = ['app.projects' , 'app.profile' , 'app.CRM']

LOGIN_TEMPLATE = 'login.html'

# QUOTE_HEADER = 'dataforceHeader.svg'
QUOTE_HEADER = 'ApvCannonHeader.svg'
# QUOTE_HEADER = 'zigma.svg'

# INVOICE_HEADER = 'drawing-2111.svg'
INVOICE_HEADER = 'dataforceHeader.svg'
INVOICE_HEADER = 'ApvCannonHeader.svg'
# INVOICE_HEADER = 'zigma.svg'

PAYPAL_RECEIVER_EMAIL = 'dev.vigneshraj.s@gmail.com'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'apfwdssalfeag7)cp4jve5gfb%l8wbn4cyvym(tez^m@z1o#3f'

GITOLITE_KEY = '123' # the gitolite server push notification secret key, all git operations are
# computationaly heavy and can be used to overload with git operations. So the server will have
# to pass this key in the HTTP request

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

TRUSTED_DOMAINS = ['http://192.168.1.152','http://192.168.1.127', 'http://192.168.0.105','http://127.0.0.1','http://localhost','https://essgi.cioc.in']

SOURCE_LIST = ['OEM','WEBSITE','BNI']


LOGIN_REDIRECT = 'ERP' # the url to which the user will be redirected once successfully loggedin
# Options are : ERP , ecommerce , blogs , corporate

LOGOUT_REDIRECT = 'ERP' # similarly the url to which the user will be directed one logged out

USE_CDN = False # when turned on the application will use the cndjs.com and other similar
#content delivery network for css and jss libraries
# Application definition
BRAND_NAME = 'CIOC'

BRAND_LOGO = '/static/images/cioc_icon.svg'
BRAND_LOGO_INVERT = '/static/images/24_tutors_icon_invert.svg'

BRAND_LOGO_INVERT = '/static/images/eai.png'
BRAND_ACTIVATION_LINK = "https://cioc.in/"
SNERT_PATH_1 = '/home/cioc-d3/stanford-ner-2018-10-16/classifiers/english.all.3class.distsim.crf.ser.gz'
SNERT_PATH_2 = '/home/cioc-d3/stanford-ner-2018-10-16/stanford-ner.jar'

SMS_API_PREFIX = "https://api.msg91.com/api/sendhttp.php?authkey=297203Ayys3IDSG5e66328dP1&route=4&sender=TESTIN&country=91&mobiles=%s&message=%s"

# ZOOM_AUTH_API_TOKEN = "https://zoom.us/oauth/authorize?client_id=36PvaAvfQM6XeI0PbMZMzQ&response_type=code&redirect_uri=https://5187a883fbe6.ngrok.io"
# ZOOM_API_TOKEN = "https://zoom.us/oauth/token?grant_type=authorization_code&code=GepXDV2Ecx_WUtSuluLS0aQi5EsVIRRQw&redirect_uri=https://5187a883fbe6.ngrok.io"https://zoom.us/oauth/authorize?client_id=36PvaAvfQM6XeI0PbMZMzQ&response_type=code&redirect_uri=https%3A%2F%2F5187a883fbe6.ngrok.io
ZOOM_API_TOKEN = "https://zoom.us/oauth/token"
SHOW_COMMON_APPS = True
DEFAULT_STATE = '/businessManagement/clientRelationships'

TWILLIO_SID = 'ACeef54d4946f61de33d1dacc2388fb702'
TWILLIO_AUTH_TOKEN = '4ba9d3bddacb4e9d1ea84c17c6a7e4bc'
DEFAULT_WHATSAPP_NUMBER = '15128510366'

PAYMENT_MODE = 'razorpay' # options are EBS , paypal , paytm , PAYU , ccavenue,razorpay
WEBRTC_ADDRESS = 'https://socket.syrow.com'
WAMP_PREFIX = 'aassssddddddddddddddsss.'
RAZORPAY_KEY = 'rzp_live_UVCQtyXr9DpVJK'
RAZORPAY_SECRET = 'aOaFKukng2tSEld41cEebBBM'

MAP_API_KEY = 'AIzaSyBJO5IcouQ-yY2icc7TYaTNMcWc3B_-38Q'
SNERT_PATH_1 = '/home/cioc-d3/stanford-ner-2018-10-16/classifiers/english.all.3class.distsim.crf.ser.gz'
SNERT_PATH_2 = '/home/cioc-d3/stanford-ner-2018-10-16/stanford-ner.jar'

import requests
def SEND_SMS(number , txt):
    url = SMS_API_PREFIX%(number, txt)
    requests.get(url)

from twilio.rest import Client
def SEND_WHATSAPP_MSG(number , msg):
  return
  client = Client(TWILLIO_SID ,TWILLIO_AUTH_TOKEN )
  message = client.messages.create(body= msg ,from_='whatsapp:+%s'%(DEFAULT_WHATSAPP_NUMBER ),to='whatsapp:+91%s'%(number))

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'corsheaders',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'bootstrapform',
    'robots',
    'API', # uncategorised REST points
    'ERP', # permissions, overall management of the platform
    'HR', # people aspect of the platform
    'PIM', # personal information manager
    'mail', # mail application
    'blogging', # BM application
    'gitweb', # github.com local server with file browsing and diff viewer
    'taskBoard',
    'projects',
	'finance',# billing , invoicing , finance etc
	'clientRelationships',# CRM like sales force
	'employees',# employees details
	'payroll',# payroll
	'performance',# performance
	'recruitment',# recruitment
	'organization',# organization
	'assets',# assets
	'marketing',# Marketing Application
	'paypal.standard.ipn',
    'website',
    'importexport',
    'hospitalManagement',
    'LMS',
    'forum',
    'chatbot',
    'notes',
    # 'reports',
)


DEAL_BOARD = [
{
  'text': '',
  'cat': 'created'
},
{
  'icon': '/static/images/icons8-call-male-80_orange.png',
  'text': 'Contacting',
  'cat': 'contacted'
},
{
  'icon': '/static/images/icons8-note-taking-80.png',
  'text': 'Requirements',
  'cat': 'requirements'
},
{
  'icon': '/static/images/icons8-online-pricing-64.png',
  'text': 'Proposal',
  'cat': 'proposal'
},
{
  'icon': '/static/images/icons8-estimate-64.png',
  'text': 'Negotiation',
  'cat': 'negotiation'
}
]

DEAL_BOARD_OPTIONS = [{
    'indx': 1,
    'text': 'contacted',
    'display': 'Contacting'
  },
  {
    'indx': 2,
    'text': 'demo',
    'display': 'Demo / POC'
  },
  {
    'indx': 3,
    'text': 'requirements',
    'display': 'Requirements Hunt'
  },
  {
    'indx': 4,
    'text': 'proposal',
    'display': 'Proposal'
  },
  {
    'indx': 5,
    'text': 'negotiation',
    'display': 'Negotiation'
  }
]

RECRUITMENT_OPTIONS =  [
{
  'icon': 'fa-desktop',
  'text': 'Techical Interview',
  'cat': 'TechicalInterview'
},
{
  'icon': 'fa-user-circle-o ',
  'text': 'HR Interview',
  'cat': 'HRInterview'
},
{
  'icon': 'fa-bars ',
  'text': 'Negotiation',
  'cat': 'Negotiation'
},

]

SITE_ID = 1

ACCOUNT_ADAPTER = 'ERP.views.AccountAdapter'

SOCIALACCOUNT_PROVIDERS = \
        {'google':
            { 'SCOPE': ['profile', 'email'],
            'AUTH_PARAMS': { 'access_type': 'online' } },
        'facebook':
            {'METHOD': 'oauth2',
            'SCOPE': ['email', 'public_profile', 'user_friends'],
            'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
            'FIELDS': [
                'id',
                'email',
                'name',
                'first_name',
                'last_name',
                'verified',
                'locale',
                'timezone',
                'link',
                'gender',
                'updated_time'],
            'EXCHANGE_TOKEN': True,
            'LOCALE_FUNC': lambda request: 'en_US',
            'VERIFIED_EMAIL': False,
            'VERSION': 'v2.4'}
        }

ACCOUNT_USER_MODEL_USERNAME_FIELD = 'email'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'username'
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = False
GOOGLESTORE_LINK = 'https://play.google.com/store/apps/details?id='
PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=in.cioc.happypockets'
APPSTORE_URL = 'itms-apps://itunes.apple.com/us/app/id1484171093?mt=8'
APP_VERSION = '1.0.0'
IOS_APP_VERSION = '1.0.0'
REDIRECT = True
PACKAGE_NAME = 'com.cioc.klouderp'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
DEPENDENT_DETAILS = False

PAYU_MERCHANT_KEY = "gtKFFx",

PAYU_MERCHANT_SALT = "eCwWELxi",

# And add the PAYU_MODE to 'TEST' for testing and 'LIVE' for production.
PAYU_MODE = "TEST"


EXTERNAL_SITE = 'http://ionasterisk.cioc.in:8000'

RAZORPAY_KEY = 'rzp_live_UVCQtyXr9DpVJK'
RAZORPAY_SECRET = 'aOaFKukng2tSEld41cEebBBM'


CORS_ALLOW_HEADERS = (
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'X-CSRFToken'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'API.middleware.simple_middleware',
    'django.middleware.locale.LocaleMiddleware'
)

ROOT_URLCONF = 'libreERP.urls'

LOCALE_PATHS = (
    os.path.join(BASE_DIR , 'homepage', 'locale'), )


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'HR', 'templates'),
            os.path.join(BASE_DIR, 'libreERP', 'templates'),
            os.path.join(BASE_DIR, 'ecommerce', 'templates'),
            os.path.join(BASE_DIR, 'clientRelationships', 'templates'),
            os.path.join(BASE_DIR, 'ERP', 'templates'),
            os.path.join(BASE_DIR, 'LMS', 'templates'),
            os.path.join(BASE_DIR, 'ERP', 'vectors'),
            os.path.join(BASE_DIR, 'website', 'templates'),
            os.path.join(BASE_DIR, 'finance', 'templates'),
            os.path.join(BASE_DIR, 'importexport', 'templates'),

        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'libreERP.wsgi.application'


AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
)


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'erp.cioc.in',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'kloud_new',
        'USER': 'newuser',
        'PASSWORD': 'titan@1234',
        'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'zigma',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'klouderp',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'erp.cioc.in',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }

#
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'sdpl',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }
#
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'sdpl',
#         'USER': 'newuser',
#         'PASSWORD': 'titan@1234',
#         'HOST': '127.0.0.1',   # Or an IP Address that your DB is hosted on
#         'PORT': '3306',
#     }
# }


# AUTH_PROFILE_MODULE = 'HR.userProfile'
# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True
EMAIL_SERVER_HOST = 'email.cioc.in'

EMAIL_HOST_SUFFIX = 'cioc.in'

EMAIL_HOST = 'email.cioc.in'
EMAIL_HOST_USER = 'testmail@cioc.in'
EMAIL_HOST_PASSWORD = 'Titan@1234'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

G_ADMIN="bhrthkshr@gmail.com"

DEFAULT_FROM_EMAIL = 'testmail@cioc.in'
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'



STATIC_ROOT = (
    os.path.join(BASE_DIR , 'static_root')
)

STATICFILES_DIRS = (
   os.path.join(BASE_DIR , 'static_shared'),
)


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR , 'media_root')

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_METADATA_CLASS': 'rest_framework.metadata.SimpleMetadata',
    # 'DEFAULT_RENDERER_CLASSES': ('rest_framework.renderers.JSONRenderer',),
}

WAMP_SERVER = 'wss://ws.epsilonai.com/ws'
WAMP_ENDPINT = 'https://ws.epsilonai.com/notify'

CALL_RECORDING_PATH = 'http://ionasterisk.cioc.in:8000/api/ERP/cdr/'

SIP_WSS_SERVER = 'asterisk.cioc.in'
SIP_PATH = '/ws'
SIP_PORT = '2000'

WAMP_POST_ENDPOINT = 'http://13.235.115.86:8081/notify'
WAMP_LONG_POLL = 'https://ws.epsilonai.com/lp'

# SIP_WSS_SERVER = '49.206.31.189'
# SIP_PATH = '/ws'
# SIP_PORT = '2000'
