from django.db import models
from django.contrib.auth.models import User
from time import time

# Create your models here.
def getMailAttachmentPath(instance , filename ):
    return 'mail/attachments/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

class mailAttachment(models.Model):
    user = models.ForeignKey(User , related_name = 'mailAttachments' , null = False)
    attachment = models.FileField(upload_to = getMailAttachmentPath , null = True)
    created = models.DateTimeField(auto_now_add = True)
    contractid = models.PositiveIntegerField(null = True)

class proxyAccount(models.Model):
    passKey = models.CharField(max_length = 100 , null = True)
    user = models.ForeignKey(User , null = False , related_name='mailAccount')
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateField(auto_now=True)
    email = models.CharField(max_length = 100 , null = True)
    displayName = models.CharField(max_length = 100 , null = True)
    signature = models.TextField(max_length = 500 , null = True)
