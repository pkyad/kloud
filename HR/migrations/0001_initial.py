# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-01-03 08:22
from __future__ import unicode_literals

import HR.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ERP', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Appraisal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateField(auto_now=True)),
                ('userCmt', models.TextField(null=True)),
                ('userAmount', models.PositiveIntegerField(null=True)),
                ('managerAmt', models.PositiveIntegerField(null=True)),
                ('managerCmt', models.TextField(null=True)),
                ('superManagerAmt', models.PositiveIntegerField(null=True)),
                ('superManagerCmt', models.TextField(null=True)),
                ('hrCmt', models.TextField(null=True)),
                ('finalAmount', models.PositiveIntegerField(null=True)),
                ('status', models.CharField(default=b'Created', max_length=25, null=True)),
                ('createdUser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appraisalCreated', to=settings.AUTH_USER_MODEL)),
                ('hr', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hrAppraisal', to=settings.AUTH_USER_MODEL)),
                ('manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='managerAppraisal', to=settings.AUTH_USER_MODEL)),
                ('superManager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='superManagerAppraisal', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appraisalUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='designation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('apps', models.ManyToManyField(blank=True, related_name='individualInstallations', to='ERP.InstalledApp')),
                ('division', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ERP.Division')),
                ('hrApprover', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hrTo', to=settings.AUTH_USER_MODEL)),
                ('primaryApprover', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='approving', to=settings.AUTH_USER_MODEL)),
                ('reportingTo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='managing', to=settings.AUTH_USER_MODEL)),
                ('role', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ERP.Role')),
                ('secondaryApprover', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='alsoApproving', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(blank=True, max_length=400)),
                ('description', models.CharField(blank=True, max_length=400)),
                ('documentFile', models.FileField(null=True, upload_to=HR.models.getDocuemtsPath)),
                ('division', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='divisionDocuments', to='ERP.Division')),
            ],
        ),
        migrations.CreateModel(
            name='ExitManagement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('security', models.BooleanField(default=False)),
                ('it', models.BooleanField(default=False)),
                ('hr', models.BooleanField(default=False)),
                ('finance', models.BooleanField(default=False)),
                ('started', models.BooleanField(default=False)),
                ('managersApproval', models.BooleanField(default=False)),
                ('superManagerApproval', models.BooleanField(default=False)),
                ('securityApprovedDate', models.DateTimeField(null=True)),
                ('itApprovedDate', models.DateTimeField(null=True)),
                ('hrApprovedDate', models.DateTimeField(null=True)),
                ('financeApprovedDate', models.DateTimeField(null=True)),
                ('managerApprovedDate', models.DateTimeField(null=True)),
                ('superManagerApprovedDate', models.DateTimeField(null=True)),
                ('comment', models.CharField(blank=True, max_length=1000, null=True)),
                ('finalSettlment', models.FileField(null=True, upload_to=HR.models.getOtherDocsPath)),
                ('resignation', models.FileField(null=True, upload_to=HR.models.getOtherDocsPath)),
                ('notice', models.FileField(null=True, upload_to=HR.models.getOtherDocsPath)),
                ('lastWorkingDate', models.DateField(auto_now=True)),
                ('is_exited', models.BooleanField(default=False)),
                ('manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='manager', to=settings.AUTH_USER_MODEL)),
                ('superManager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='superManager', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Leave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateField(auto_now=True)),
                ('fromDate', models.DateField(null=True)),
                ('toDate', models.DateField(null=True)),
                ('days', models.PositiveIntegerField(null=True)),
                ('leavesCount', models.PositiveIntegerField(null=True)),
                ('approved', models.BooleanField(default=False)),
                ('category', models.CharField(choices=[(b'AL', b'AL'), (b'ML', b'ML'), (b'casual', b'casual')], max_length=100)),
                ('status', models.CharField(choices=[(b'inProcess', b'inProcess'), (b'approved', b'approved'), (b'rejected', b'rejected'), (b'cancelled', b'cancelled')], default=b'inProcess', max_length=100)),
                ('comment', models.CharField(max_length=10000, null=True)),
                ('approvedStage', models.PositiveIntegerField(default=0, null=True)),
                ('approvedMatrix', models.PositiveIntegerField(default=1, null=True)),
                ('accounted', models.BooleanField(default=False)),
                ('approvedBy', models.ManyToManyField(blank=True, related_name='leaves', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='leavesAuthored', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('empID', models.PositiveIntegerField(null=True, unique=True)),
                ('empType', models.CharField(choices=[(b'full time', b'full time'), (b'part time', b'part time')], default=b'full time', max_length=40)),
                ('displayPicture', models.ImageField(upload_to=HR.models.getDisplayPicturePath)),
                ('dateOfBirth', models.DateField(null=True)),
                ('anivarsary', models.DateField(null=True)),
                ('married', models.BooleanField(default=False)),
                ('permanentAddressStreet', models.TextField(blank=True, max_length=100, null=True)),
                ('permanentAddressCity', models.CharField(blank=True, max_length=15, null=True)),
                ('permanentAddressPin', models.IntegerField(blank=True, null=True)),
                ('permanentAddressState', models.CharField(blank=True, max_length=20, null=True)),
                ('permanentAddressCountry', models.CharField(blank=True, max_length=20, null=True)),
                ('sameAsLocal', models.BooleanField(default=False)),
                ('localAddressStreet', models.TextField(max_length=100, null=True)),
                ('localAddressCity', models.CharField(max_length=15, null=True)),
                ('localAddressPin', models.IntegerField(null=True)),
                ('localAddressState', models.CharField(max_length=20, null=True)),
                ('localAddressCountry', models.CharField(max_length=20, null=True)),
                ('prefix', models.CharField(choices=[(b'NA', b'NA'), (b'Kumar', b'Kumar'), (b'Kumari', b'Kumari'), (b'Smt', b'Smt'), (b'Shri', b'Shri'), (b'Dr', b'Dr')], default=b'NA', max_length=4)),
                ('gender', models.CharField(choices=[(b'M', b'Male'), (b'F', b'Female'), (b'O', b'Other')], default=b'M', max_length=6)),
                ('email', models.EmailField(max_length=50)),
                ('mobile', models.CharField(max_length=14, null=True)),
                ('emergency', models.CharField(max_length=100, null=True)),
                ('website', models.URLField(blank=True, max_length=100, null=True)),
                ('sign', models.FileField(null=True, upload_to=HR.models.getSignaturesPath)),
                ('IDPhoto', models.FileField(null=True, upload_to=HR.models.getDisplayPicturePath)),
                ('TNCandBond', models.FileField(null=True, upload_to=HR.models.getTNCandBondPath)),
                ('resume', models.FileField(null=True, upload_to=HR.models.getResumePath)),
                ('certificates', models.FileField(null=True, upload_to=HR.models.getCertificatesPath)),
                ('transcripts', models.FileField(null=True, upload_to=HR.models.getTranscriptsPath)),
                ('otherDocs', models.FileField(blank=True, null=True, upload_to=HR.models.getOtherDocsPath)),
                ('resignation', models.FileField(blank=True, null=True, upload_to=HR.models.getResignationDocsPath)),
                ('vehicleRegistration', models.FileField(blank=True, null=True, upload_to=HR.models.getVehicleRegDocsPath)),
                ('appointmentAcceptance', models.FileField(blank=True, null=True, upload_to=HR.models.getAppointmentAcceptanceDocsPath)),
                ('pan', models.FileField(blank=True, null=True, upload_to=HR.models.getPANDocsPath)),
                ('drivingLicense', models.FileField(blank=True, null=True, upload_to=HR.models.getDrivingLicenseDocsPath)),
                ('cheque', models.FileField(blank=True, null=True, upload_to=HR.models.getChequeDocsPath)),
                ('passbook', models.FileField(blank=True, null=True, upload_to=HR.models.getPassbookDocsPath)),
                ('bloodGroup', models.CharField(max_length=20, null=True)),
                ('almaMater', models.CharField(max_length=100, null=True)),
                ('pgUniversity', models.CharField(blank=True, max_length=100, null=True)),
                ('docUniversity', models.CharField(blank=True, max_length=100, null=True)),
                ('fathersName', models.CharField(max_length=100, null=True)),
                ('mothersName', models.CharField(max_length=100, null=True)),
                ('wifesName', models.CharField(blank=True, max_length=100, null=True)),
                ('childCSV', models.CharField(blank=True, max_length=100, null=True)),
                ('note1', models.TextField(blank=True, max_length=500, null=True)),
                ('note2', models.TextField(blank=True, max_length=500, null=True)),
                ('note3', models.TextField(blank=True, max_length=500, null=True)),
                ('lat', models.FloatField(default=0)),
                ('lon', models.FloatField(default=0)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('location_track', models.BooleanField(default=False)),
                ('job_type', models.CharField(choices=[(b'Telecaller', b'Telecaller'), (b'Technician', b'Technician'), (b'Others', b'Others')], default=b'Others', max_length=20)),
                ('battery_level', models.FloatField(default=0)),
                ('expoPushToken', models.CharField(blank=True, max_length=300, null=True)),
                ('linkToken', models.CharField(blank=True, max_length=300, null=True)),
                ('contact', models.CharField(blank=True, max_length=100, null=True)),
                ('nextlat', models.FloatField(default=0)),
                ('nextlng', models.FloatField(default=0)),
                ('sipUserName', models.CharField(max_length=100, null=True)),
                ('sipExtension', models.CharField(max_length=100, null=True)),
                ('sipPassword', models.CharField(max_length=100, null=True)),
                ('isDashboard', models.BooleanField(default=False)),
                ('isManager', models.BooleanField(default=False)),
                ('adhar', models.CharField(blank=True, max_length=100, null=True)),
                ('onboarding', models.BooleanField(default=False)),
                ('apps', models.TextField(null=True)),
                ('zoom_token', models.TextField(null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=100)),
                ('manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='teamManager', to=settings.AUTH_USER_MODEL)),
                ('unit', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='teamUnit', to='ERP.Unit')),
            ],
        ),
        migrations.AddField(
            model_name='designation',
            name='team',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='teamName', to='HR.Team'),
        ),
        migrations.AddField(
            model_name='designation',
            name='unit',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ERP.Unit'),
        ),
        migrations.AddField(
            model_name='designation',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
