# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-03 08:22
from __future__ import unicode_literals

import ERP.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='accountsKey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activation_key', models.CharField(blank=True, max_length=40)),
                ('key_expires', models.DateTimeField(default=django.utils.timezone.now)),
                ('keyType', models.CharField(choices=[('hashed', 'hashed'), ('otp', 'otp')], default='hashed', max_length=6)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accountKey', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street', models.CharField(blank=True, max_length=300, null=True)),
                ('city', models.CharField(blank=True, max_length=100, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('pincode', models.PositiveIntegerField(blank=True, null=True)),
                ('lat', models.CharField(blank=True, max_length=15, null=True)),
                ('lon', models.CharField(blank=True, max_length=15, null=True)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ApiUsage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.PositiveIntegerField(default=0)),
                ('month', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='application',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=50)),
                ('icon', models.TextField(max_length=500, null=True)),
                ('haveCss', models.BooleanField(default=True)),
                ('haveJs', models.BooleanField(default=True)),
                ('published', models.BooleanField(default=True)),
                ('admin', models.BooleanField(default=False)),
                ('module', models.CharField(max_length=500)),
                ('description', models.CharField(max_length=500)),
                ('displayName', models.CharField(max_length=30, null=True)),
                ('stateAlias', models.CharField(max_length=30, null=True)),
                ('url', models.CharField(max_length=100, null=True)),
                ('index', models.PositiveIntegerField(default=0)),
                ('android', models.BooleanField(default=False)),
                ('windows', models.BooleanField(default=False)),
                ('ios', models.BooleanField(default=False)),
                ('mac', models.BooleanField(default=False)),
                ('rating_five', models.CharField(default='5', max_length=30)),
                ('rating_four', models.CharField(default='4', max_length=30)),
                ('rating_three', models.CharField(default='3', max_length=30)),
                ('rating_two', models.CharField(default='2', max_length=30)),
                ('rating_one', models.CharField(default='1', max_length=30)),
                ('appStoreUrl', models.TextField(max_length=500, null=True)),
                ('playStoreUrl', models.TextField(max_length=500, null=True)),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationFeature',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=200)),
                ('enabled', models.BooleanField(default=True)),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='appFeatures', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='applicationMedia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('typ', models.CharField(max_length=200, null=True)),
                ('attachment', models.FileField(null=True, upload_to=ERP.models.getappMediauploadPath)),
                ('app', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='appMedia', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='appSettingsField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('heading', models.CharField(max_length=250, null=True)),
                ('state', models.CharField(max_length=200, null=True)),
                ('app', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='settings', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='Division',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, null=True)),
                ('website', models.CharField(max_length=200, null=True)),
                ('logo', models.FileField(null=True, upload_to=ERP.models.getDivisionLogoAttachmentPath)),
                ('pan', models.CharField(blank=True, max_length=200, null=True)),
                ('cin', models.CharField(blank=True, max_length=200, null=True)),
                ('l1', models.CharField(blank=True, max_length=200, null=True)),
                ('l2', models.CharField(blank=True, max_length=200, null=True)),
                ('subDomain', models.CharField(blank=True, max_length=200, null=True)),
                ('simpleMode', models.BooleanField(default=True)),
                ('upi', models.CharField(max_length=200, null=True)),
                ('telephony', models.BooleanField(default=False)),
                ('messaging', models.BooleanField(default=False)),
                ('headerTemplate', models.TextField(blank=True, max_length=10000, null=True)),
                ('headerData', models.TextField(blank=True, max_length=10000, null=True)),
                ('footerData', models.TextField(blank=True, max_length=10000, null=True)),
                ('footerTemplate', models.TextField(blank=True, max_length=10000, null=True)),
                ('defaultOgWidth', models.CharField(blank=True, max_length=200, null=True)),
                ('defaultOgHeight', models.CharField(blank=True, max_length=200, null=True)),
                ('defaultDescription', models.TextField(blank=True, max_length=5000, null=True)),
                ('defaultTitle', models.CharField(blank=True, max_length=200, null=True)),
                ('defaultOgImage', models.FileField(null=True, upload_to=ERP.models.getogImageAttachmentPath)),
                ('windowColor', models.CharField(default='#e42a2a', max_length=20, null=True)),
                ('fontColor', models.CharField(default='#ffffff', max_length=20, null=True)),
                ('dp', models.ImageField(null=True, upload_to=ERP.models.getdpPath)),
                ('mascotName', models.CharField(max_length=50, null=True)),
                ('supportBubbleColor', models.CharField(default='#e42a2a', max_length=20, null=True)),
                ('iconColor', models.CharField(default='#ffffff', max_length=20, null=True)),
                ('userApiKey', models.CharField(max_length=500, null=True)),
                ('firstMessage', models.TextField(blank=True, default='Hi, How can I help you', max_length=20000, null=True)),
                ('welcomeMessage', models.TextField(blank=True, max_length=20000, null=True)),
                ('chatIconPosition', models.TextField(blank=True, max_length=20000, null=True)),
                ('chatIconType', models.TextField(blank=True, max_length=20000, null=True)),
                ('is_blink', models.BooleanField(default=False)),
                ('support_icon', models.ImageField(null=True, upload_to=ERP.models.getdpPath)),
                ('scriptVal', models.CharField(blank=True, max_length=220, null=True)),
                ('integrated_media', models.BooleanField(default=False)),
                ('botMode', models.BooleanField(default=False)),
                ('access_token', models.CharField(blank=True, max_length=220, null=True)),
                ('pageID', models.CharField(blank=True, max_length=50, null=True)),
                ('whatsappNumber', models.CharField(blank=True, max_length=50, null=True)),
                ('twillioAccountSID', models.CharField(blank=True, max_length=100, null=True)),
                ('trillioAuthToken', models.CharField(blank=True, max_length=100, null=True)),
                ('apiKey', models.CharField(blank=True, max_length=100, null=True)),
                ('uipathPass', models.CharField(blank=True, max_length=100, null=True)),
                ('uipathUsername', models.CharField(blank=True, max_length=100, null=True)),
                ('uipathUrl', models.CharField(blank=True, max_length=100, null=True)),
                ('uipathTenent', models.CharField(blank=True, max_length=100, null=True)),
                ('botFailResponse', models.TextField(max_length=500, null=True)),
                ('botAuto_response', models.TextField(max_length=500, null=True)),
                ('supportEmailTo', models.CharField(blank=True, max_length=100, null=True)),
                ('ios_sdk_enabled', models.BooleanField(default=False)),
                ('react_sdk_enabled', models.BooleanField(default=False)),
                ('rest_sdk_enabled', models.BooleanField(default=False)),
                ('android_sdk_enabled', models.BooleanField(default=False)),
                ('uipathOrgId', models.TextField(max_length=10, null=True)),
                ('gupshupAppName', models.TextField(max_length=20, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=200, null=True)),
                ('star', models.FloatField(default=0, null=True)),
                ('text', models.TextField(max_length=2000, null=True)),
                ('app', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='feedbacks', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='GenericPincode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state', models.CharField(max_length=35, null=True)),
                ('city', models.CharField(max_length=35, null=True)),
                ('country', models.CharField(default='India', max_length=35)),
                ('pincode', models.CharField(max_length=7, null=True)),
                ('pin_status', models.CharField(default='1', max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='InstalledApp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('configs', models.TextField(blank=True, max_length=10000, null=True)),
                ('priceAsAdded', models.FloatField(default=0)),
                ('addedBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='installations', to=settings.AUTH_USER_MODEL)),
                ('app', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='installations', to='ERP.application')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='installations', to='ERP.Division')),
            ],
        ),
        migrations.CreateModel(
            name='media',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('link', models.TextField(max_length=300, null=True)),
                ('attachment', models.FileField(null=True, upload_to=ERP.models.getERPPictureUploadPath)),
                ('mediaType', models.CharField(choices=[('onlineVideo', 'onlineVideo'), ('video', 'video'), ('image', 'image'), ('onlineImage', 'onlineImage'), ('doc', 'doc')], default='image', max_length=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='serviceDocsUploaded', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MenuItems',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('icon', models.CharField(max_length=250, null=True)),
                ('state', models.CharField(max_length=200, null=True)),
                ('jsFileName', models.CharField(max_length=200, null=True)),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='menuitems', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='permission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('app', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='permissions', to='ERP.application')),
                ('givenBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='approvedAccess', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accessibleApps', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProductMeta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=500)),
                ('typ', models.CharField(choices=[('HSN', 'HSN'), ('SAC', 'SAC')], default='HSN', max_length=5)),
                ('code', models.PositiveIntegerField()),
                ('taxRate', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='PublicApiKeys',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=False)),
                ('key', models.CharField(max_length=30)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('usageRemaining', models.PositiveIntegerField(default=0)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='apiKeyAdministrator', to=settings.AUTH_USER_MODEL)),
                ('app', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ERP.application')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='publicApiKeysOwned', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('token', models.CharField(max_length=50)),
                ('emailOTP', models.CharField(max_length=6, null=True)),
                ('mobileOTP', models.CharField(max_length=6, null=True)),
                ('email', models.CharField(max_length=60, null=True)),
                ('mobile', models.CharField(max_length=15, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('division', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rolesdivisions', to='ERP.Division')),
                ('permissions', models.ManyToManyField(related_name='applications', to='ERP.application')),
            ],
        ),
        migrations.CreateModel(
            name='service',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('mobile', models.CharField(blank=True, max_length=20, null=True)),
                ('telephone', models.CharField(blank=True, max_length=20, null=True)),
                ('about', models.TextField(blank=True, max_length=2000, null=True)),
                ('cin', models.CharField(blank=True, max_length=100, null=True)),
                ('tin', models.CharField(blank=True, max_length=100, null=True)),
                ('logo', models.CharField(blank=True, max_length=200, null=True)),
                ('web', models.TextField(blank=True, max_length=100, null=True)),
                ('vendor', models.BooleanField(default=False)),
                ('inUseBy', models.CharField(default='CRM', max_length=20)),
                ('bankName', models.CharField(max_length=100, null=True)),
                ('accountNumber', models.PositiveIntegerField(null=True)),
                ('ifscCode', models.CharField(max_length=100, null=True)),
                ('paymentTerm', models.PositiveIntegerField(default=0, null=True)),
                ('address', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ERP.address')),
                ('contactPerson', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='servicesContactPerson', to=settings.AUTH_USER_MODEL)),
                ('doc', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='services', to='ERP.media')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='servicesOwned', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='servicesCreated', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Unit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('address', models.CharField(blank=True, max_length=400)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
                ('pincode', models.CharField(blank=True, max_length=15, null=True)),
                ('l1', models.CharField(max_length=200, null=True)),
                ('l2', models.CharField(max_length=200, null=True)),
                ('mobile', models.CharField(max_length=15, null=True)),
                ('telephone', models.CharField(max_length=15, null=True)),
                ('email', models.CharField(max_length=100, null=True)),
                ('areaCode', models.CharField(max_length=150, null=True)),
                ('gstin', models.CharField(max_length=200, null=True)),
                ('warehouse', models.BooleanField(default=False)),
                ('bankName', models.CharField(max_length=200, null=True)),
                ('bankBranch', models.CharField(max_length=200, null=True)),
                ('bankAccNumber', models.CharField(max_length=200, null=True)),
                ('ifsc', models.CharField(max_length=200, null=True)),
                ('swift', models.CharField(max_length=200, null=True)),
                ('master', models.BooleanField(default=False)),
                ('division', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='units', to='ERP.Division')),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='ERP.Unit')),
            ],
        ),
        migrations.AddField(
            model_name='apiusage',
            name='api',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usages', to='ERP.PublicApiKeys'),
        ),
        migrations.AlterUniqueTogether(
            name='unit',
            unique_together=set([('name', 'areaCode')]),
        ),
        migrations.AlterUniqueTogether(
            name='installedapp',
            unique_together=set([('app', 'parent')]),
        ),
        migrations.AlterUniqueTogether(
            name='appsettingsfield',
            unique_together=set([('name', 'app')]),
        ),
    ]
