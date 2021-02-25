
from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from organization.serializers import *
import datetime
from django.core.exceptions import ObjectDoesNotExist , SuspiciousOperation
from django.core.mail import send_mail, EmailMessage
from django.conf import settings as globalSettings
from marketing.models import TourPlanStop
from ERP.send_push_message import send_push_message
from payroll.models import payroll
from chatbot.serializers import ActivitySerializer



class userProfileLiteSerializer(serializers.ModelSerializer):
    # to be used in the typehead tag search input, only a small set of fields is responded to reduce the bandwidth requirements
    class Meta:
        model = profile
        fields = ('displayPicture' , 'prefix' ,'pk','mobile','lat','lon','isDashboard','isManager','zoom_token')


class userLiteSerializer(serializers.ModelSerializer):
    profile = userProfileLiteSerializer(many=False , read_only=True)
    class Meta:
        model = User
        fields = ( 'pk', 'username' , 'first_name' , 'last_name'  ,'email', 'profile','displayPicture')

class userSearchSerializer(serializers.ModelSerializer):
    # to be used in the typehead tag search input, only a small set of fields is responded to reduce the bandwidth requirements
    profile = userProfileLiteSerializer(many=False , read_only=True)
    logo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ( 'pk', 'username' , 'first_name' , 'last_name' , 'profile' , 'designation', 'email' ,'logo','is_staff')
    def get_logo(self, obj):
        return globalSettings.BRAND_LOGO


class userSearchViewSerializer(serializers.ModelSerializer):
    mobile = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ( 'pk', 'username' , 'first_name' , 'last_name' , 'designation','email','mobile' )

    def get_mobile(self, obj):
        return obj.profile.mobile

class TeamSerializer(serializers.ModelSerializer):
    manager = userSearchSerializer(many=False , read_only=True)
    unit = UnitsLiteSerializer(many = False , read_only = True)
    class Meta:
        model = Team
        fields=('pk','created','manager','title','unit','isOnSupport')
    def create(self , validated_data):
        t = Team(**validated_data)
        t.manager = User.objects.get(pk = self.context['request'].data['manager'])
        if 'unit' in  self.context['request'].data:
            t.unit = Unit.objects.get(pk = self.context['request'].data['unit'])
        t.save()
        return t
    def update(self , instance , validated_data):
        for key in ['isOnSupport']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'manager' in self.context['request'].data:
            instance.manager=User.objects.get(pk=self.context['request'].data['manager'])
        if 'unit' in  self.context['request'].data:
            instance.unit = Unit.objects.get(pk = self.context['request'].data['unit'])
        instance.save()
        return instance





class userDesignationSerializer(serializers.ModelSerializer):
    unit = UnitsLiteSerializer(many = False , read_only = True)
    role = RoleSuperLiteSerializer(many = False , read_only = True)
    team = TeamSerializer(many = False , read_only = True)
    reportingTo = userSearchViewSerializer(many = False , read_only = True)
    hrApprover = userSearchViewSerializer(many = False , read_only = True)
    # apps = InstalledAppSerializer(many = True , read_only = True)
    class Meta:
        model = designation
        fields = ('pk' , 'user','reportingTo' ,'hrApprover', 'primaryApprover' , 'division','secondaryApprover' ,'unit' ,'role','team')
        read_only_fields=('user',)
        def create(self , validated_data):
            d = designation()
            d.user=User.objects.get(pk=self.context['request'].user)
            d.reportingTo=User.objects.get(pk=self.context['request'].data['reportingTo'])
            d.hrApprover=User.objects.get(pk=self.context['request'].data['hrApprover'])
            d.primaryApprover=User.objects.get(pk=self.context['request'].data['primaryApprover'])
            d.secondaryApprover=User.objects.get(pk=self.context['request'].data['secondaryApprover'])
            d.division=Division.objects.get(pk=self.context['request'].data['division'])
            d.unit=Unit.objects.get(pk=self.context['request'].data['unit'])

            d.role=Role.objects.get(pk=self.context['request'].data['role'])
            d.unit.division= self.context['request'].data['division']
            d.save()
            return d
    def update(self , instance , validated_data):
        for key in ['pk' , 'user', 'reportingTo' , 'hrApprover','primaryApprover' , 'secondaryApprover' ,'division' ,'unit' ,'role']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'division' in self.context['request'].data:
            instance.division=Division.objects.get(pk=self.context['request'].data['division'])
        if 'unit' in self.context['request'].data:
            instance.unit=Unit.objects.get(pk=self.context['request'].data['unit'])
        if 'role' in self.context['request'].data:
            instance.role=Role.objects.get(pk=self.context['request'].data['role'])
        if 'team' in self.context['request'].data:
            instance.team=Team.objects.get(pk=self.context['request'].data['team'])
        if 'hrApprover' in self.context['request'].data:
            instance.hrApprover=User.objects.get(pk=self.context['request'].data['hrApprover'])
        if 'reportingTo' in self.context['request'].data:
            instance.reportingTo=User.objects.get(pk=self.context['request'].data['reportingTo'])
        instance.save()
        return instance

class userDesignationLiteSerializer(serializers.ModelSerializer):
    user = userSearchSerializer(many=False , read_only=True)
    class Meta:
        model = designation
        fields = ('pk' , 'user')
        read_only_fields=('user',)


class TeamAllSerializer(serializers.ModelSerializer):
    manager = userSearchSerializer(many=False , read_only=True)
    members = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields=('pk','created','manager','title' , 'members','unit','isOnSupport')
    def get_members(self, obj):
        return userDesignationLiteSerializer(obj.teamName.all(),many=True).data


class userProfileSerializer(serializers.ModelSerializer):
    """ allow all the user """
    teamlead = serializers.SerializerMethodField()
    class Meta:
        model = profile
        fields = ( 'pk' , 'mobile' , 'displayPicture' , 'website' , 'prefix' , 'almaMater', 'pgUniversity' , 'docUniversity' ,'email','gender' , 'empID','teamlead','isDashboard','isManager','emergency','bloodGroup','married','localAddressStreet','localAddressCity' , 'localAddressPin' , 'localAddressState' , 'localAddressCountry', 'sipUserName' , 'sipExtension','onboarding','zoom_token')
        read_only_fields = ('website' , 'prefix' , 'almaMater', 'pgUniversity' , 'docUniversity' , 'sipUserName' , 'sipExtension' , 'sipPassword' )
    def get_teamlead(self, obj):
        toRet = {}
        teamObj = Team.objects.filter(manager = obj.user)
        if teamObj.count()>0:
            toRet = TeamAllSerializer(teamObj.first(), many = False).data
        return toRet


class userAllProfileSerializer(serializers.ModelSerializer):
    """ allow all the user """
    class Meta:
        model = profile
        fields = ( 'pk' , 'empID' , 'empType' , 'prefix' , 'gender' , 'married', 'dateOfBirth' , 'anivarsary' ,'localAddressStreet','localAddressCity' , 'localAddressPin' , 'localAddressState' , 'localAddressCountry' , 'sameAsLocal' , 'permanentAddressStreet' , 'permanentAddressCity' , 'permanentAddressPin' , 'permanentAddressState' , 'permanentAddressCountry' , 'bloodGroup' , 'mobile' , 'email' , 'emergency','website' ,'almaMater' , 'pgUniversity' , 'docUniversity' , 'fathersName' , 'mothersName' , 'wifesName' , 'childCSV', 'note1' , 'note2' , 'note3' , 'displayPicture' , 'TNCandBond' , 'resume' ,  'certificates', 'transcripts' , 'otherDocs', 'resignation','vehicleRegistration', 'appointmentAcceptance','pan', 'drivingLicense','cheque','passbook', 'sign', 'IDPhoto',  'sipUserName' , 'sipExtension' , 'sipPassword','job_type')

print "profile : " , profile
class userProfileAdminModeSerializer(serializers.ModelSerializer):
    """ Only admin """
    class Meta:
        model = profile
        fields = ( 'pk','empID', 'married', 'dateOfBirth' ,'displayPicture' , 'anivarsary' , 'permanentAddressStreet' , 'permanentAddressCity' , 'permanentAddressPin', 'permanentAddressState' , 'permanentAddressCountry','sameAsLocal',
        'localAddressStreet' , 'localAddressCity' , 'localAddressPin' , 'localAddressState' , 'localAddressCountry', 'prefix', 'gender' , 'email', 'mobile' , 'emergency' , 'website',
        'sign', 'IDPhoto' , 'TNCandBond' , 'resume' ,  'certificates', 'transcripts' , 'otherDocs' , 'almaMater' , 'pgUniversity' , 'docUniversity' , 'fathersName' , 'mothersName' , 'wifesName' , 'childCSV', 'resignation','vehicleRegistration', 'appointmentAcceptance','pan', 'drivingLicense','cheque','passbook',
        'note1' , 'note2' , 'note3', 'bloodGroup','empType','isDashboard', 'isManager')
    def update(self , instance , validated_data):
        u = self.context['request'].user
        print instance, 'profile'

        for key in ['empID','married', 'dateOfBirth' , 'displayPicture' ,'anivarsary' ,'permanentAddressStreet' , 'permanentAddressCity' , 'permanentAddressPin', 'permanentAddressState' , 'permanentAddressCountry','sameAsLocal',
        'localAddressStreet' , 'localAddressCity' , 'localAddressPin' , 'localAddressState' , 'localAddressCountry', 'prefix', 'gender' , 'email', 'mobile' , 'emergency' , 'website',
        'sign', 'IDPhoto' , 'TNCandBond' , 'resume' ,  'certificates', 'transcripts' , 'otherDocs' , 'almaMater' , 'pgUniversity' , 'docUniversity' , 'fathersName' , 'mothersName' , 'wifesName' , 'childCSV', 'resignation','vehicleRegistration', 'appointmentAcceptance','pan', 'drivingLicense','cheque','passbook',
        'note1' , 'note2' , 'note3', 'bloodGroup','empType','isDashboard', 'isManager']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass

        instance.save()
        instance.user.save()
        return instance


class payrollLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = payroll
        fields = ('pk','user', 'al','ml','adHocLeaves','joiningDate','lastWorkingDate','off','alHold','mlHold','adHocLeavesHold','pan','pfAccNo','pfUniNo','pfAmnt','esic','accountNumber','ifscCode','bankName',)



class userProfileViewSerializer(serializers.ModelSerializer):
    user = userSearchViewSerializer(many=False , read_only=True)
    alllocations = serializers.SerializerMethodField()
    total_distance = serializers.SerializerMethodField()
    totalTour = serializers.SerializerMethodField()
    class Meta:
        model = profile
        fields = ('pk','mobile','user','lat','lon','last_updated','location_track','job_type','displayPicture','battery_level','alllocations','total_distance','totalTour')
    def get_alllocations(self, obj):
        return ActivitySerializer(Activity.objects.filter(user = obj.user, created__contains = datetime.date.today()),many=True).data
    def get_total_distance(self, obj):
        total_distance = 0
        try:
            timesheetObj = TimeSheet.objects.get(date = datetime.date.today() , user = obj.user)
            total_distance = round(timesheetObj.distanceTravelled/1000,2)
        except:
            pass
        return total_distance
    def get_totalTour(self, obj):
        totalTour = TourPlanStop.objects.filter(tourplan__user = obj.user,tourplan__date = datetime.date.today() ).count()
        return totalTour

class userSerializer(serializers.ModelSerializer):
    profile = userProfileLiteSerializer(many=False , read_only=True)
    payroll = payrollLiteSerializer(many = False , read_only = True)
    logo = serializers.SerializerMethodField()
    designation = userDesignationSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('pk' , 'username' , 'email' , 'first_name' , 'last_name' , 'designation' ,'settings' , 'password' , 'is_superuser','is_active','profile','payroll','is_staff','logo')
        read_only_fields = ('designation' , 'profile' , 'settings', 'payroll' )
        extra_kwargs = {'password': {'write_only': True} }
    def create(self , validated_data):
        raise PermissionDenied(detail=None)
    def update (self, instance, validated_data):
        print self.context['request'].data, 'request'
        if 'is_staff' in self.context['request'].data:
            instance.is_staff = self.context['request'].data['is_staff']
        if 'is_active' in self.context['request'].data:
            instance.is_active = self.context['request'].data['is_active']
        instance.save()
        if 'oldPassword' in self.context['request'].data:
            user = self.context['request'].user
            if authenticate(username = user.username , password = self.context['request'].data['oldPassword']) is not None:
                user = User.objects.get(username = user.username)
                user.set_password(validated_data['password'])
                user.save()
            else :
                raise PermissionDenied(detail=None)
            return user
        else:
            return instance
    def get_logo(self, obj):
        return globalSettings.BRAND_LOGO

class userAdminSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'pk' , 'username' , 'email' , 'first_name' , 'last_name' , 'is_staff' ,'is_active','is_superuser', )
    def create(self , validated_data):
        user = User.objects.create(**validated_data)
        if 'email' in self.context['request'].data:
            user.email = self.context['request'].data['email']
        else:
            user.email = user.username + '@cioc.co.in'

        # ----------------------------- Send welcome mail here ---------------------------- #

        password = '123'
        user.set_password(password)
        user.save()
        designation = user.designation
        profile = user.profile
        if 'mobile' in self.context['request'].data:
            profile.mobile = self.context['request'].data['mobile']
            profile.save()
        if 'unit' in self.context['request'].data:
            designation.unit = Unit.objects.get(pk = int(self.context['request'].data['unit']))
        if 'role' in self.context['request'].data:
            designation.role = Role.objects.get(pk = int(self.context['request'].data['role']))
        if 'reportingTo' in self.context['request'].data:
            designation.reportingTo = User.objects.get(pk = int(self.context['request'].data['reportingTo']))
        try:
            designation.division = self.context['request'].user.designation.division
        except:
            pass
        designation.save()
        return user
    def update (self, instance, validated_data):
        user = self.context['request'].user
        if user.is_staff or user.is_superuser:
            u = User.objects.get(username = self.context['request'].data['username'])
            if (u.is_staff and user.is_superuser ) or user.is_superuser: # superuser can change password for everyone , staff can change for everyone but not fellow staffs
                if 'password' in self.context['request'].data:
                    u.set_password(self.context['request'].data['password'])
                u.first_name = validated_data['first_name']
                u.last_name = validated_data['last_name']
                u.is_active = validated_data['is_active']
                u.is_staff = validated_data['is_staff']
                u.email = validated_data['email']
                u.save()
            else:
                raise PermissionDenied(detail=None)
        try:
            return u
        except:
            raise PermissionDenied(detail=None)

class groupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url' , 'name')


class leaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ('pk','created','user','fromDate','toDate','days','approved','category','approvedBy','comment','approvedStage','approvedMatrix','status','leavesCount')
    def create(self , validated_data):
        if validated_data['fromDate'] < datetime.date.today():
            print 'lessssssssssss'
        elif datetime.date.today().isocalendar()[1] == validated_data['fromDate'].isocalendar()[1]:
            print 'sameeeeeeeeeee'
        elif validated_data['days'] > 15:
            print 'moreeeeeeeeeeee'
        payrollObj = payroll.objects.get(pk=int(self.context['request'].data['payroll']))
        if self.context['request'].data['category'] == 'ML':
            print 'mlllllllllllll',payrollObj.ml
            payrollObj.mlHold = payrollObj.mlHold + int(self.context['request'].data['holdDays'])
            payrollObj.mlCurrMonthLeaves = payrollObj.mlCurrMonthLeaves - int(self.context['request'].data['holdDays'])
        elif self.context['request'].data['category'] == 'AL':
            payrollObj.alHold = payrollObj.alHold + int(self.context['request'].data['holdDays'])
            payrollObj.alCurrMonthLeaves = payrollObj.alCurrMonthLeaves - int(self.context['request'].data['holdDays'])
        elif self.context['request'].data['category'] == 'casual':
            payrollObj.adHocLeavesHold = payrollObj.adHocLeavesHold + int(self.context['request'].data['holdDays'])
            payrollObj.adHocLeaves = payrollObj.adHocLeaves - int(self.context['request'].data['holdDays'])
        payrollObj.save()
        l = Leave(**validated_data)
        l.user = self.context['request'].user
        if validated_data['fromDate'] < datetime.date.today():
            l.approvedMatrix = 2
        elif datetime.date.today().isocalendar()[1] == validated_data['fromDate'].isocalendar()[1]:
            l.approvedMatrix = 2
        elif validated_data['days'] > 15:
            l.approvedMatrix = 2
        l.save()
        desigs = self.context['request'].user.managing.all()
        for d in desigs:
            try:
                send_push_message(desigs.profile.expoPushToken, 'New leave approval')
            except:
                pass
        return l

    def update(self , instance , validated_data):
        if instance.user.designation in self.context['request'].user.managing.all():
            print 'came'
            print validated_data
            print self.context['request'].data
            instance.approvedStage += 1
            appObj = instance.approvedBy.all()
            instance.approvedBy.clear()
            for i in appObj:
                instance.approvedBy.add(i.user)
            instance.approvedBy.add(self.context['request'].user)
            if instance.approvedStage == instance.approvedMatrix:
                print 'cameeeeeee'
                payrolobj = instance.user.payroll
                if self.context['request'].data['typ'] == 'approve':
                    print 'approveddddd'
                    instance.approved = True
                    instance.status = 'approved'
                    if instance.approved == True:
                        if instance.category == 'AL':
                            payrolobj.alHold = payrolobj.alHold - instance.leavesCount
                        elif instance.category == 'ML':
                            payrolobj.mlHold = payrolobj.mlHold - instance.leavesCount
                        elif instance.category == 'casual':
                            payrolobj.adHocLeavesHold = payrolobj.adHocLeavesHold - instance.leavesCount
                        payrolobj.save()
                elif self.context['request'].data['typ'] == 'reject':
                    instance.status = 'rejected'
                    if instance.category == 'AL':
                        payrolobj.alCurrMonthLeaves = payrolobj.alCurrMonthLeaves + instance.leavesCount
                        payrolobj.alHold = payrolobj.alHold - instance.leavesCount
                    elif instance.category == 'ML':
                        payrolobj.mlCurrMonthLeaves = payrolobj.mlCurrMonthLeaves + instance.leavesCount
                        payrolobj.mlHold = payrolobj.mlHold - instance.leavesCount
                    elif instance.category == 'casual':
                        payrolobj.adHocLeaves = payrolobj.adHocLeaves + instance.leavesCount
                        payrolobj.adHocLeavesHold = payrolobj.adHocLeavesHold + instance.leavesCount
                    payrolobj.save()
            instance.save()
            return instance
        else:
            raise SuspiciousOperation('Not Authorized')

class ProfileOrgChartsSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    class Meta:
        model = designation
        fields = ( 'user' , 'reportingTo','profile' )
        read_only_fields = ('profile',)
    def get_profile(self, obj):
        return obj.user.profile.pk


class ExitManagementSerializer(serializers.ModelSerializer):
    user = userSerializer(many=False , read_only=True)
    class Meta:
        model = ExitManagement
        fields = ('pk','user', 'created','security','it','hr','finance','started','managersApproval','superManagerApproval','securityApprovedDate','itApprovedDate','hrApprovedDate','financeApprovedDate','managerApprovedDate','superManagerApprovedDate','manager','superManager','lastWorkingDate','finalSettlment','resignation','notice','is_exited')
    def create(self , validated_data):
        ex = ExitManagement(**validated_data)
        if 'user' in self.context['request'].data:
            userObj = User.objects.get(pk=int(self.context['request'].data['user']))
            ex.user= userObj
            try:
                ex.manager = userObj.designation.reportingTo
                try:
                    ex.superManager = userObj.designation.reportingTo.designation.reportingTo
                except:
                    ex.superManager = userObj.designation.reportingTo
            except:
                pass
        ex.save()
        return ex


import os
from django.http import HttpResponse
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph , Spacer
from reportlab.lib import colors
from reportlab.lib.units import inch, cm, mm

def appraisalPDF(response , aprObj,uname, request):
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(response,pagesize=letter, topMargin=0.2*cm,leftMargin=1*cm,rightMargin=1*cm)
    doc.request = request
    elements = []
    headerDetails = Paragraph("""<para align='center'><font size ='15'><b>Appraisal Letter</b></font></para>""",styles['Normal'])
    elements.append(headerDetails)
    elements.append(Spacer(1, 30))
    details = Paragraph("""<para>Hi , <b>{0}</b> Your Appraisal Cycle Has Been Completed. Your Salary Structure Has Fallow By Below,<br/><br/>Final Salary : <font size ='12'><b>{1}</b></font><br/>HR Comment : {2}<br/></para>""".format(uname,aprObj.finalAmount,aprObj.hrCmt),styles['Normal'])
    elements.append(details)
    elements.append(Spacer(1, 30))
    hed = Paragraph("""<para align='center'><font size ='12'><b>Your Updated Employee Details</b></font></para>""",styles['Normal'])
    elements.append(hed)
    elements.append(Spacer(1, 15))

    detail31 = Paragraph("""<para align='center'><b>Designation Details</b></para>""" ,styles['Normal'])
    detail32 = Paragraph("""<para align='center'><b>Payroll Details</b></para>""" ,styles['Normal'])
    t2data=[detail31],[detail32]
    td2header=[t2data]
    t5=Table(td2header)
    t5.setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('BOX',(0,0),(-1,-1),0.25,colors.black),('INNERGRID', (0,0), (-1,-1), 0.25, colors.black)]))
    elements.append(t5)
    d1_a = Paragraph("""<para>Reporting To</para>""",styles['Normal'])
    try:
        d1_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.reportingTo.first_name),styles['Normal'])
    except:
        d1_b = Paragraph("""<para></para>""",styles['Normal'])
    d1_c = Paragraph("""<para>HRA</para>""",styles['Normal'])
    d1_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.hra),styles['Normal'])
    d1=[d1_a,d1_b,d1_c,d1_d]
    d2_a = Paragraph("""<para>HR Approver</para>""",styles['Normal'])
    try:
        d2_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.hrApprover.first_name),styles['Normal'])
    except:
        d2_b = Paragraph("""<para></para>""",styles['Normal'])
    d2_c = Paragraph("""<para>Special Allowance</para>""",styles['Normal'])
    d2_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.special),styles['Normal'])
    d2=[d2_a,d2_b,d2_c,d2_d]
    d3_a = Paragraph("""<para>Primary Approver</para>""",styles['Normal'])
    try:
        d3_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.primaryApprover.first_name),styles['Normal'])
    except:
        d3_b = Paragraph("""<para></para>""",styles['Normal'])
    d3_c = Paragraph("""<para>LTA</para>""",styles['Normal'])
    d3_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.lta),styles['Normal'])
    d3=[d3_a,d3_b,d3_c,d3_d]
    d4_a = Paragraph("""<para>Secondary Approver</para>""",styles['Normal'])
    try:
        d4_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.secondaryApprover.first_name),styles['Normal'])
    except:
        d4_b = Paragraph("""<para></para>""",styles['Normal'])
    d4_c = Paragraph("""<para>Basic</para>""",styles['Normal'])
    d4_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.basic),styles['Normal'])
    d4=[d4_a,d4_b,d4_c,d4_d]
    d5_a = Paragraph("""<para>Division</para>""",styles['Normal'])
    try:
        d5_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.division.name),styles['Normal'])
    except:
        d5_b = Paragraph("""<para></para>""",styles['Normal'])
    d5_c = Paragraph("""<para>TAX Slab</para>""",styles['Normal'])
    d5_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.taxSlab),styles['Normal'])
    d5=[d5_a,d5_b,d5_c,d5_d]
    d6_a = Paragraph("""<para>Unit</para>""",styles['Normal'])
    try:
        d6_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.unit.name),styles['Normal'])
    except:
        d6_b = Paragraph("""<para></para>""",styles['Normal'])
    d6_c = Paragraph("""<para>AD Hoc</para>""",styles['Normal'])
    d6_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.adHoc),styles['Normal'])
    d6=[d6_a,d6_b,d6_c,d6_d]
    d7_a = Paragraph("""<para>Department</para>""",styles['Normal'])
    try:
        d7_b = Paragraph("""<para>{0}</para>""".format('NA'),styles['Normal'])
    except:
        d7_b = Paragraph("""<para></para>""",styles['Normal'])
    d7_c = Paragraph("""<para>PF Amount</para>""",styles['Normal'])
    d7_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.pfAmnt),styles['Normal'])
    d7=[d7_a,d7_b,d7_c,d7_d]
    d8_a = Paragraph("""<para>Role</para>""",styles['Normal'])
    try:
        d8_b = Paragraph("""<para>{0}</para>""".format(aprObj.user.designation.role.name),styles['Normal'])
    except:
        d8_b = Paragraph("""<para></para>""",styles['Normal'])
    d8_c = Paragraph("""<para>Anual Leaves</para>""",styles['Normal'])
    d8_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.al),styles['Normal'])
    d8=[d8_a,d8_b,d8_c,d8_d]
    d9_a = Paragraph('',styles['Normal'])
    d9_b = Paragraph('',styles['Normal'])
    d9_c = Paragraph("""<para>Mediacl Leaves</para>""",styles['Normal'])
    d9_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.ml),styles['Normal'])
    d9=[d9_a,d9_b,d9_c,d9_d]
    d10_a = Paragraph('',styles['Normal'])
    d10_b = Paragraph('',styles['Normal'])
    d10_c = Paragraph("""<para>AD Hoc Leaves</para>""",styles['Normal'])
    d10_d = Paragraph("""<para>{0}</para>""".format(aprObj.user.payroll.adHocLeaves),styles['Normal'])
    d10=[d10_a,d10_b,d10_c,d10_d]

    td4header=[d1,d2,d3,d4,d5,d6,d7,d8,d9,d10]
    t6=Table(td4header)
    t6.setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('BOX',(0,0),(-1,-1),0.25,colors.black),('INNERGRID', (0,0), (-1,-1), 0.25, colors.black)]))
    elements.append(t6)

    doc.build(elements)
    print 'pdf doneeeeeeeee'


class AppraisalSerializer(serializers.ModelSerializer):
    empId = serializers.SerializerMethodField()
    class Meta:
        model = Appraisal
        fields=('pk','created','createdUser','user','userCmt','userAmount','manager','managerAmt','managerCmt','superManager','superManagerAmt','superManagerCmt','hr','hrCmt','finalAmount','status','empId')
        read_only_fields = ('createdUser',)
    def create(self , validated_data):
        toEmails = []
        ap = Appraisal(**validated_data)
        ap.createdUser = self.context['request'].user
        userObj = User.objects.get(pk=int(self.context['request'].data['user']))
        ap.user = userObj

        toEmails.append(str(ap.user.email))
        if ap.user.last_name:
            uName = str(ap.user.first_name) + ' ' + str(ap.user.last_name)
        else:
            uName = str(ap.user.first_name)
        if ap.createdUser.last_name:
            cuName = str(ap.createdUser.first_name) + ' ' + str(ap.createdUser.last_name) + ' (#' + str(ap.createdUser.profile.empID) + ')'
        else:
            cuName = str(ap.createdUser.first_name) + ' (#' + str(ap.createdUser.profile.empID) + ')'
        email_body = '''<div style="font-size:15px">
        Appraisal Cycle Has Been Started For <strong style="font-size:20px">{0}</strong> Having Employee Id <strong style="font-size:20px">#{1}</strong> Created By <strong>{2}.</strong>'''.format(uName,str(ap.user.profile.empID),cuName)

        try:
            ap.manager = userObj.designation.reportingTo
            toEmails.append(str(ap.manager.email))
            try:
                if userObj.designation.reportingTo.designation.reportingTo:
                    ap.superManager = userObj.designation.reportingTo.designation.reportingTo
                else:
                    ap.superManager = userObj.designation.reportingTo
            except:
                ap.superManager = userObj.designation.reportingTo

            toEmails.append(str(ap.superManager.email))
            if ap.manager.last_name:
                mName = str(ap.manager.first_name) + ' ' + str(ap.manager.last_name) + ' (#' + str(ap.manager.profile.empID) + ')'
            else:
                mName = str(ap.manager.first_name) + ' (#' + str(ap.manager.profile.empID) + ')'
            if ap.superManager.last_name:
                smName = str(ap.superManager.first_name) + ' ' + str(ap.superManager.last_name) + ' (#' + str(ap.superManager.profile.empID) + ')'
            else:
                smName = str(ap.superManager.first_name) + ' (#' + str(ap.superManager.profile.empID) + ')'
            email_body = email_body + '''<br><strong>Approvers :</strong><ul><li>{0}</li><li>{1}</li></ul>'''.format(mName,smName)
        except:
            pass
        try:
            ap.hr = userObj.designation.hrApprover

            toEmails.append(str(ap.hr.email))
            if ap.hr.last_name:
                hrName = str(ap.hr.first_name) + ' ' + str(ap.hr.last_name) + ' (#' + str(ap.hr.profile.empID) + ')'
            else:
                hrName = str(ap.hr.first_name) + ' (#' + str(ap.hr.profile.empID) + ')'
            email_body = email_body + '''<strong>HR Partner : </strong><ul><li>{0}</li></ul><br></div>'''.format(hrName)
        except:
            email_body = email_body + '</div>'

        toEmails = list(set(toEmails))
        print toEmails
        msg = EmailMessage('Employee Appraisal Cycle', email_body, to=toEmails)
        msg.content_subtype = 'html'
        msg.send()
        print 'email send successfully'
        ap.save()
        return ap
    def update(self , instance , validated_data):
        for key in ['userCmt' , 'userAmount', 'managerCmt' , 'managerAmt','superManagerCmt' , 'superManagerAmt' ,'hrCmt' ,'finalAmount' ,'status']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.save()
        if instance.status=='Completed':
            print 'saving logs and sending emailssss'
            payrollData = {}
            payrollObj = instance.user.payroll
            oldPayrollData = payrollObj.__dict__
            for key in ['hra' , 'special', 'lta' , 'basic','taxSlab' , 'adHoc' ,'pfAmnt' ,'al' ,'ml','adHocLeaves']:
                try:
                    payrollData[key] = oldPayrollData[key]
                    setattr(payrollObj , key , self.context['request'].data[key])
                except:
                    pass
            payrollObj.save()
            print payrollData

            #Designation Dataaa
            desigData = {}
            desigObj = instance.user.designation
            oldDesigData = desigObj.__dict__
            for key in ['reportingTo_id' , 'hrApprover_id', 'primaryApprover_id' , 'secondaryApprover_id','division_id' , 'unit_id' ,'role_id']:
                try:
                    desigData[key] = oldDesigData[key]
                    setattr(desigObj , key , self.context['request'].data[key])
                except:
                    setattr(desigObj , key , None)
            desigObj.save()
            print desigData

            #payrollLog Creationnnn
            payrollLogData = {'createdUser':instance.hr,'user':instance.user,'oldHra':payrollData['hra'],'newHra':payrollObj.hra,'oldspecial':payrollData['special'],'newspecial':payrollObj.special,'oldLta':payrollData['lta'],'newLta':payrollObj.lta,'oldBasic':payrollData['basic'],'newBasic':payrollObj.basic,'oldtaxSlab':payrollData['taxSlab'],'newtaxSlab':payrollObj.taxSlab,'oldadHoc':payrollData['adHoc'],'newadHoc':payrollObj.adHoc,'oldAl':payrollData['al'],'newAl':payrollObj.al,'oldml':payrollData['ml'],'newml':payrollObj.ml,'oldadHocLeav':payrollData['adHocLeaves'],'newadHocLeav':payrollObj.adHocLeaves,'oldpfAmount':payrollData['pfAmnt'],'newpfAmount':payrollObj.pfAmnt}
            print payrollLogData
            payrollLogObj = PayrollLogs.objects.create(**payrollLogData)

            #sending Emailss
            if instance.user.last_name:
                uName = str(instance.user.first_name) + ' ' + str(instance.user.last_name)
            else:
                uName = str(instance.user.first_name)
            email_body = '''<div style="font-size:15px">
            Appraisal Cycle Has Been Completed For <strong style="font-size:20px">{0}</strong> Having Employee Id <strong style="font-size:20px">#{1}. </strong>Finalised Salary Is <strong>{2}.</strong><br>{3}</div>'''.format(uName,str(instance.user.profile.empID),instance.finalAmount,instance.hrCmt)
            toEmails = []
            if instance.manager and str(instance.manager.email) not in toEmails:
                toEmails.append(str(instance.manager.email))
            if instance.superManager and str(instance.superManager.email) not in toEmails:
                toEmails.append(str(instance.superManager.email))
            if instance.hr and str(instance.hr.email) not in toEmails:
                toEmails.append(str(instance.hr.email))
            if payrollLogObj.oldBasic == payrollLogObj.newBasic:
                toEmails.append(str(instance.user.email))
            print toEmails
            msg = EmailMessage('Employee Appraisal Cycle Has Been Completed', email_body, to=toEmails)
            msg.content_subtype = 'html'
            msg.send()
            print 'email send successfully'

            if payrollLogObj.oldBasic != payrollLogObj.newBasic:
                email_body = '''<div style="font-size:15px">
                Your Appraisal Cycle Has Been Completed , Finalised Salary Is <strong>{0}.</strong><br>{1}<br><strong>Please Look In To The Fallowing Attachment</strong></div>'''.format(instance.finalAmount,instance.hrCmt)
                toEmails = [str(instance.user.email)]
                print toEmails

                response = HttpResponse(content_type='application/pdf')
                response['Content-Disposition'] = 'attachment;filename="appraisalLetter.pdf"'
                appraisalPDF(response , instance,'sai kiran pothuri' ,self.context['request'])
                f = open(os.path.join(globalSettings.BASE_DIR, 'media_root/appraisalLetter.pdf'), 'wb')
                f.write(response.content)
                f.close()

                msg = EmailMessage('Your Appraisal Cycle Has Been Completed', email_body, to=toEmails)
                msg.attach_file(os.path.join(globalSettings.MEDIA_ROOT,'appraisalLetter.pdf'))
                msg.content_subtype = 'html'
                msg.send()
                print 'email senddddddddddddd To User'

        return instance
    def get_empId(self, obj):
        return obj.user.profile.empID



class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ( 'pk', 'name' , 'description' , 'documentFile','created')
    def create(self,validated_data):
        Doc = Document(**validated_data)
        Doc.division =  self.context['request'].user.designation.division
        Doc.save()
        return Doc
