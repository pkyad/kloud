var app = angular.module('app', ['ui.router','flash', 'ui.bootstrap','chart.js']);
var emptyFile = new File([""], "");
app.config(function($httpProvider,$stateProvider, $urlRouterProvider,$provide) {

   $httpProvider.defaults.xsrfCookieName = 'csrftoken';
   $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
   $httpProvider.defaults.withCredentials = true;

   $urlRouterProvider.otherwise('/companies');

});

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
   $rootScope.$state = $state;
   $rootScope.$stateParams = $stateParams;
   $rootScope.$on("$stateChangeError", console.log.bind(console));
}]);


app.directive('fileModel', ['$parse', function ($parse) {
         return {
            restrict: 'A',
            link: function(scope, element, attrs) {
               var model = $parse(attrs.fileModel);
               var modelSetter = model.assign;

               element.bind('change', function() {
                  scope.$apply(function() {
                     modelSetter(scope, element[0].files[0]);
                  });
               });
            }
         };
}]);

app.config(function($stateProvider) {

   $stateProvider
   .state('companies', {
      url: "/companies",
      templateUrl: '/static/ngTemplates/app.klouderp.companies.html',
      controller: 'businessManagement.kloudERP',
   })
   .state('details', {
      url: "/users/:id",
      templateUrl: '/static/ngTemplates/app.businessManagement.KloudERPdelails.html',
      controller: 'businessManagement.KloudERPdelails',
   })
   .state('apps', {
      url: "/apps",
      templateUrl: '/static/ngTemplates/app.organization.allApps.html',
      controller: 'businessManagement.apps',
   })
   .state('templates', {
      url: "/templates",
      templateUrl: '/static/ngTemplates/app.organization.allTemplates.html',
      controller: 'businessManagement.templates',
   })
   .state('HSNandSACcodes', {
      url: "/HSN-SAC",
      templateUrl: '/static/ngTemplates/app.configure.hsnsacCodes.form.html',
      controller: 'admin.settings.configure.hsnsac.form'
   })
   .state('holidays', {
      url: "/holidays",
      templateUrl: '/static/ngTemplates/app.settings.holidays.html',
      controller: 'admin.settings.configure.calendar.form'
   })
   .state('language', {
      url: "/language",
      templateUrl: '/static/ngTemplates/app.settings.language.html',
      controller: 'admin.settings.configure.language.form'
   })
   .state('version', {
      url: "/version",
      templateUrl: '/static/ngTemplates/app.settings.version.html',
      controller: 'admin.settings.configure.version.form'
   })
   .state('analytics', {
      url: "/analytics",
      templateUrl: '/static/ngTemplates/app.settings.analytics.html',
      controller: 'admin.settings.configure.analytics',
   })
   .state('appDetails', {
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.organization.appDetails.html',
      controller: 'businessManagement.appsDetails',
   })

   .state('usage', {
      url: "/companies/:company",
      templateUrl: '/static/ngTemplates/app.organization.usage.html',
      controller: 'businessManagement.usage',
   })



 });



app.controller('admin.settings.configure.analytics', function($scope, $state, $stateParams, $http, Flash, $uibModal) {
  $scope.fromDate  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  $scope.toDate = new Date()

  $scope.getAllDivision = function(){
    $http({
      method: 'GET',
      url: '/api/organization/divisions/'
    }).then(function(response) {
      $scope.allDivisions = response.data
      $scope.selectedDiv = $scope.allDivisions[0]
      $scope.getData()
    })
  }
  $scope.getAllDivision()

$scope.getData = function(){
  $http({
    method: 'GET',
    url: '/api/ERP/getAppUsageGraph/?div='+$scope.selectedDiv.pk+'&fromDate='+$scope.fromDate.toJSON().split('T')[0]+'&toDate='+$scope.toDate.toJSON().split('T')[0]
  }).
  then(function(response) {
    $scope.allCompanydata = response.data;
    new Chart(document.getElementById('admin-line-chart'), {
      type: 'line',
      data: {
        datasets: [{
          data:   $scope.allCompanydata.usage.data.data,
          borderColor: '#2490EF',
          label: $scope.allCompanydata.usage.name,
          fill: false
        },
      ],
      labels: $scope.allCompanydata.usage.data.labels
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
      }
    }
  });
  
  new Chart(document.getElementById('admin-main-line-chart'), {
    type: 'line',
    data: {
      datasets: [{
        data:   $scope.allCompanydata.division.data,
        borderColor: '#2490EF',
        label: '',
        fill: false
      },
    ],
    labels: $scope.allCompanydata.division.labels
  },
  options: {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
    }
  }
});

})

}

})


 app.controller('businessManagement.usage', function($scope, $state, $stateParams, $http, Flash, $uibModal) {
   $scope.page = 0;
   $scope.next = function() {
     $scope.page += 1;
     $scope.getAppDetails();
   }
   $scope.prev = function() {
     if ($scope.page == 0) {
       return;
     }
     $scope.page -= 1;
     $scope.getAppDetails();
   }
   $scope.getAppDetails = function(){
     $http({
       method: 'GET',
       url: '/api/ERP/usageTracker/?division=' + $state.params.company+'&limit=10&offset=' + 10 * $scope.page
     }).
     then(function(response) {
       $scope.allData = response.data.results;
     })
   }
   $scope.getAppDetails()
 })

 app.controller('businessManagement.kloudERP', function($scope, $state, $stateParams, $http, Flash, $uibModal) {

   $scope.searchForm = {
     searchValue: ''

   }
   $scope.limit = 9
   $scope.offset = 0
   $scope.getallCompanies = function() {
     var url = '/api/organization/divisions/?limit=' + $scope.limit + '&offset=' + $scope.offset
     if ($scope.searchForm.searchValue.length > 0) {
       url += '&name__icontains=' + $scope.searchForm.searchValue
     }
     $http({
       method: 'GET',
       url: url

     }).
     then(function(response) {
       $scope.divisions = response.data.results
       $scope.resPrev = response.data.previous
       $scope.resNext = response.data.next

       $scope.checkPerm();


     })
   }
   $scope.getallCompanies()


   $scope.checkPerm = function() {
     if ($scope.divisions && $scope.divisions.length == 1 && $state.is('workforceManagement.organization')) {
       $state.go('workforceManagement.organization.details', {
         id: $scope.divisions[0].pk
       })
     }
   }


   $scope.prev = function() {
     if ($scope.resPrev != null) {
       $scope.offset -= $scope.limit
       $scope.getallCompanies()
     }
   }
   $scope.next = function() {
     if ($scope.resNext != null) {
       $scope.offset += $scope.limit
       $scope.getallCompanies()
     }
   }
   $scope.viewDivision = function(data) {
     $state.go('workforceManagement.organization.details', {
       id: data.pk
     })
   }


   $scope.delete = function(data, idx) {
     $http({
       method: 'DELETE',
       url: '/api/organization/divisions/' + data.pk + '/'

     }).
     then(function(response) {
       Flash.create('success', 'Deleted....!!!')
       // $scope.divisions.splice(idx, 1)
       $scope.getallCompanies()
     })
   }
   $scope.createDivision = function(data) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.division.form.html',
       position: 'right',
       size: 'l',
       backdrop: true,
       resolve: {
         data: function() {
           if (data == undefined) {
             return data
           } else {
             return data
           }

         }

       },
       controller: function($scope, $state, $stateParams, $http, Flash, $uibModal, data, $uibModalInstance) {

         console.log(
           'dfdgdfgdfgdfg'
         );

         console.log($scope.tab);

         $scope.resetForm = function() {
           $scope.form = {
             'name': '',
             'email': '',
             'logo': emptyFile,
             'username': '',
             'userNumber': '',
           }
         }

         if (data != undefined) {
           $scope.mode = 'edit';
           $scope.form = data;
           $scope.form.logo = emptyFile;
         } else {
           $scope.mode = 'new';
           $scope.resetForm();
         }

         $scope.save = function() {
           console.log('entered');
           var f = $scope.form;
           var url = '/api/organization/divisions/';

           var fd = new FormData();
           if (f.logo != emptyFile && f.logo != null) {
             fd.append('logo', f.logo)
           }

           if (f.name.length == 0) {
             Flash.create('warning', 'Name, CIN and PAN are required')
             return
           }

           fd.append('name', f.name);
           fd.append('email', f.email);
           fd.append('username', f.username);
           fd.append('userNumber', f.userNumber);

           console.log(fd);
           if ($scope.mode == 'new') {
             var method = 'POST';
           } else {
             var method = 'PATCH';
             url += f.pk + '/'
           }


           $http({
             method: method,
             url: url,
             data: fd,
             transformRequest: angular.identity,
             headers: {
               'Content-Type': undefined
             }
           }).
           then(function(response) {
             $scope.form.pk = response.data.pk;
             Flash.create('success', 'Saved')
             if ($scope.mode == 'new') {
               $scope.resetForm();
             };
             $uibModalInstance.dismiss()
           })
         }
       }
     }).result.then(function() {
       $scope.getallCompanies();
     }, function() {
       $scope.getallCompanies();
     })
   }



 })

 app.controller('businessManagement.KloudERPdelails', function($scope, $http, $state, $uibModal, Flash) {

   $scope.fetchDivision = function() {
     $http({
       method: 'GET',
       url: '/api/organization/divisions/' + $state.params.id + '/'
     }).
     then(function(response) {
       $scope.data = response.data;
     })
   }
   $scope.delCompany = function() {
     $http({
       method: 'DELETE',
       url: '/api/organization/divisions/' + $state.params.id + '/'
     }).
     then(function(response) {
       Flash.create('success','Successfully Deleted......!!!!!')
     })
   }

   $scope.updateOrg = function() {
     dataToSend = {
       simpleMode: $scope.data.simpleMode,
       telephony: $scope.data.telephony,
       messaging: $scope.data.messaging,
       locked: $scope.data.locked,
       freeQuotaExcceded : $scope.data.freeQuotaExcceded
     }
     $http({
       method: 'PATCH',
       url: '/api/organization/divisions/' + $state.params.id + '/',
       data: dataToSend
     }).
     then(function(response) {
       Flash.create('success', 'Saved');
       // if (response.data.freeQuotaExcceded) {
         connection.session.publish(wamp_prefix+'service.division.' + $state.params.id, [response.data.freeQuotaExcceded], {}, {
           acknowledge: true
         }).
         then(function(publication) {
         },function(){
         });
       // }
     });
   }

   $scope.fetchDivision();
   // $scope.form = {
   //   file : emptyFile
   // }
   //
   // $scope.fileupload = function(file){
   //   $scope.file = file[0]
   //   console.log($scope.file);
   //   var fd = new FormData()
   //   fd.append('attachment',$scope.file)
   //   $http({
   //     method: 'POST',
   //     url: '/api/ERP/uploadBundle/',
   //     data: fd,
   //     transformRequest: angular.identity,
   //     headers: {
   //       'Content-Type': undefined
   //     }
   //   }).
   //   then(function(response) {
   //     Flash.create('success', "Uploaded")
   //   })
   // }
   //

   $scope.edit = function(indx) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.installedApp.form.html',
       size: 'lg',
       backdrop: true,
       resolve: {
         id: function() {
           return $state.params.id
         },
         install: function() {
           return $scope.data.installations[indx]
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, id, install) {

         $scope.form = {
           app: install.app,
           rate: install.priceAsAdded
         }

         $scope.appSearch = function(query) {
           return $http.get('/api/ERP/application/?limit=10&name__icontains=' + query).
           then(function(response) {
             return response.data.results;
           })
         };

         $scope.id = id;



         $scope.save = function() {
           var dataToSend = {
             app: $scope.form.app.pk,
             priceAsAdded: $scope.form.rate
           }
           $http({
             method: 'PATCH',
             url: '/api/organization/divisions/' + $scope.id + '/?action=addApplication',
             data: dataToSend
           }).
           then(function(response) {
             $uibModalInstance.dismiss(response.data)
           })
         }


       }
     }).result.then(function(d) {


       $scope.fetchDivision();
     }, function(r) {


       $scope.fetchDivision();
     });
   }


   $scope.addNewApp = function() {

     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.installedApp.form.html',
       size: 'lg',
       backdrop: true,
       resolve: {
         id: function() {
           return $state.params.id
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, id) {

         $scope.form = {
           app: null,
           rate: 0
         }

         $scope.appSearch = function(query) {
           return $http.get('/api/ERP/application/?limit=10&name__icontains=' + query).
           then(function(response) {
             return response.data.results;
           })
         };

         $scope.id = id;



         $scope.save = function() {
           var dataToSend = {
             app: $scope.form.app.pk,
             priceAsAdded: $scope.form.rate
           }
           $http({
             method: 'PATCH',
             url: '/api/organization/divisions/' + $scope.id + '/?action=addApplication',
             data: dataToSend
           }).
           then(function(response) {
             $uibModalInstance.dismiss(response.data)
           })
         }


       }
     }).result.then(function(d) {
       console.log({
         d
       });
       $scope.fetchDivision();
     }, function(r) {
       console.log({
         r
       });
       $scope.fetchDivision();
     });







   }




 })



app.controller('businessManagement.apps', function($scope, $http, $state) {

   $scope.searchForm = {
     search:''
   }
   $scope.limit = 10
   $scope.offset = 0
   $scope.form = {
     file : emptyFile
   }

   $scope.fileupload = function(file){
     $scope.file = file[0]
     console.log($scope.file);
     var fd = new FormData()
     fd.append('attachment',$scope.file)
     $http({
       method: 'POST',
       url: '/api/ERP/uploadBundle/',
       data: fd,
       transformRequest: angular.identity,
       headers: {
         'Content-Type': undefined
       }
     }).
     then(function(response) {
       Flash.create('success', "Uploaded")
     })
   }





   $scope.fetch = function() {
     var url = '/api/ERP/application/?limit='+$scope.limit+'&offset='+$scope.offset
     if ($scope.searchForm.search.length > 0) {
       url+= '&displayName__icontains='+$scope.searchForm.search
     }
     $http({
       method: 'GET',
       url:url
     }).
     then(function(response) {
       $scope.apps = response.data.results;
       $scope.resPrev = response.data.previous
       $scope.resNext = response.data.next
     })
   }

   $scope.fetch();

   $scope.prev = function(){
     if (  $scope.resPrev != null) {
       $scope.offset -= $scope.limit
       $scope.fetch();
     }
   }
   $scope.next = function(){
     if ($scope.resNext != null) {
       $scope.offset += $scope.limit
       $scope.fetch();
     }
   }

 });



app.controller('businessManagement.templates', function($scope, $http, $state, $uibModal, Flash,$timeout,$sce) {

   $scope.searchForm = {
     searchValue:''
   }
   $scope.limit = 10
   $scope.offset = 0



   $scope.createTemplate  = function(){
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.createTemplate.html',
       size: 'md',
       backdrop: true,
       resolve: {
         // app: function() {
         //   return app
         // }
       },
       controller: function($scope, $uibModalInstance, $rootScope, $http, Flash) {

         $scope.reset =  function(){
           $scope.form = {
             name:'',templateCategory:''
           }

         }
         $scope.reset()
         $scope.choices = ['Contact Us','Introduction','Image List','Info Section','Testimonials','Widgets','Header','Footer','Others']
         $scope.save = function(){
           var data =  {
             name:$scope.form.name,
             templateCategory:$scope.form.templateCategory
           }
           $http({
             method: 'POST',
             url:'/api/website/uielementemplate/',
             data:data
           }).
           then(function(response) {
             $scope.form.pk = response.data.pk
             window.open('/templateEditor/'+$scope.form.pk+'/','_blank')
             $uibModalInstance.dismiss()

           })


         }


         }
   })
 }

   $scope.fetchTemplates = function() {
     var url = '/api/website/uielementemplate/?limit='+$scope.limit+'&offset='+$scope.offset
     if ($scope.searchForm.searchValue.length > 0) {
       url += '&name__icontains='+$scope.searchForm.searchValue
     }
     $http({
       method: 'GET',
       url:url
     }).
     then(function(response) {
       $scope.templates = response.data.results;
       $scope.resPrev = response.data.previous
       $scope.resNext = response.data.next
     })
   }
   $scope.fetchTemplates();


     $scope.prev = function(){
       if (  $scope.resPrev != null) {
         $scope.offset -= $scope.limit
         $scope.fetchTemplates();
       }
     }
     $scope.next = function(){
       if ($scope.resNext != null) {
         $scope.offset += $scope.limit
         $scope.fetchTemplates();
       }
     }



   $scope.openTemplateEditor = function(template) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.templateEditor.html',
       size: 'xl',
       backdrop: true,
       placement: 'right',
       resolve: {
         template: function() {
           return template
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, template) {
         // $scope.editor1 = ace.edit('aceEditor');


         $scope.form = template
         $scope.uielement=  $sce.trustAsResourceUrl('/uielement/?id='+$scope.form.pk)
         $timeout(function() {
           var iFrame = document.getElementById('iFrame')
           $scope.editor1 = ace.edit('aceEditor');
           $scope.editor1.setTheme("ace/theme/XCode");
           $scope.editor1.getSession().setMode("ace/mode/html");
           $scope.editor1.getSession().setUseWorker(false);
           $scope.editor1.setHighlightActiveLine(false);
           $scope.editor1.setShowPrintMargin(false);
           ace.require("ace/ext/language_tools");
           $scope.editor1.setOptions({
             enableBasicAutocompletion: true,
             enableSnippets: true
           });
           $scope.editor1.setFontSize("14px");
           $scope.editor1.setBehavioursEnabled(true);
           if ($scope.form != undefined) {
             $scope.editor1.setValue($scope.form.template, -1);
           }
           $scope.show = false
           $scope.save = function() {
             var fd = new FormData()

             fd.append('name', $scope.form.name)
             fd.append('live', $scope.form.live)
             fd.append('template', $scope.editor1.getValue())
             fd.append('defaultData', $scope.editor2.getValue())
             if ($scope.form.mobilePreview != null && typeof($scope.form.mobilePreview) == 'object' ) {

               fd.append('mobilePreview', $scope.form.mobilePreview)
             }
             if ($scope.form.sampleImg != null && typeof($scope.form.sampleImg) == 'object' ) {

               fd.append('sampleImg', $scope.form.sampleImg)
             }

             $http({
               method: 'PATCH',
               url: '/api/website/uielementemplate/' + $scope.form.pk + '/',
               data: fd,
               transformRequest: angular.identity,
               headers: {
                 'Content-Type': undefined
               }
             }).
             then(function(response) {

               Flash.create('success', "Updated...!")
               iFrame.src=  $sce.trustAsResourceUrl('/uielement/?id='+response.data.pk)
               // $timeout (function(){
               //
               // },1000)
               console.log($scope.uielement,'903842483');
             })
           }
         },300)


         $timeout(function() {
           $scope.editor2 = ace.edit('aceEditor2');
           $scope.editor2.setTheme("ace/theme/XCode");
           $scope.editor2.getSession().setMode("ace/mode/html");
           $scope.editor2.getSession().setUseWorker(false);
           $scope.editor2.setHighlightActiveLine(false);
           $scope.editor2.setShowPrintMargin(false);
           ace.require("ace/ext/language_tools");
           $scope.editor2.setOptions({
             enableBasicAutocompletion: true,
             enableSnippets: true
           });
           $scope.editor2.setFontSize("14px");
           $scope.editor2.setBehavioursEnabled(true);
           if ($scope.form != undefined) {
             $scope.editor2.setValue($scope.form.defaultData, -1);
           }

         },300)





       }
     });
   }



 })


 app.controller("admin.settings.configure.hsnsac.form", function($scope, $state, $stateParams, $http, Flash, $uibModal,$rootScope) {
   $scope.resetForm = function(){
     $scope.form ={
       description:'',
       typ:'HSN',
       code:0,
       taxRate:0
     }

   }
   $scope.resetForm()

   $scope.save = function(){
     var dataTosend ={
       description:$scope.form.description,
       typ:$scope.form.typ,
       code:$scope.form.code,
       taxRate:$scope.form.taxRate
     }
     var method ='POST'
     var url ='/api/ERP/productMeta/'
     if ($scope.form.pk != undefined) {
       method = 'PATCH'
       url = '/api/ERP/productMeta/'+$scope.form.pk+'/'
     }
     $http({
       method:method,
       url:url,
       data:dataTosend
     }).then(function(response){
       Flash.create('success','Saved....!!!')
       $scope.alltaxCodes()
       $scope.resetForm()
     })
   }

   $scope.searchForm = {
     searchValue:''
   }
   $scope.limit = 15
   $scope.offset = 0
   $scope.alltaxCodes = function(){
     var url = '/api/ERP/productMeta/?limit='+$scope.limit+'&offset='+$scope.offset
     if ($scope.searchForm.searchValue.length > 0) {
       url +='&search='+$scope.searchForm.searchValue
     }
     $http({
       method:'GET',
       url:url
     }).then(function(response){
       $scope.codes = response.data.results
       $scope.prometaPrev = response.data.previous
       $scope.prometaNext = response.data.next
     })
   }
   $scope.alltaxCodes()


   $scope.previous =function(){
     if ($scope.prometaPrev != null) {
       $scope.offset -= $scope.limit
       $scope.alltaxCodes()
     }
   }
   $scope.next =function(){
     if ($scope.prometaNext != null) {
       $scope.offset += $scope.limit
       $scope.alltaxCodes()
     }
   }

   $scope.$on('editTaxcodes', function(event, input) {
     $scope.form  = input.data
   });


   $scope.editCodes = function(data,idx){
     $scope.codes.splice(idx,1)
     $rootScope.$broadcast('editTaxcodes', {data:data});

   }

   $scope.delTaxcodes = function(data,idx){
     $http({
       method:'DELETE',
       url:'/api/ERP/productMeta/'+data.pk+'/'
     }).then(function(response){
       Flash.create('success','Deleted....!!')
       $scope.codes.splice(idx,1)
     })
   }

})




app.controller('admin.settings.configure.calendar.form' , function($scope ,$uibModal, $stateParams , $http , $state , Flash , $filter,$rootScope){

   $scope.holiDayForm = {name : '' , typ : 'restricted' , date : new Date()}



   $scope.openHolidayForm = function(form) {

     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.HR.holiday.modal.html',
       size: 'md',
       backdrop: true,
       resolve : {
         form : function() {
           return $scope.holiDayForm;
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, form , $http, Flash, $interval, $timeout) {

         $scope.sampleNames = [
           'Leave policy',
           'Expense Claim policy',
           'Advance for travel policy',
         ]

         $scope.sampleNameIndex = 0;
         $interval(function() {
           $scope.sampleNameIndex += 1;
           if ($scope.sampleNameIndex > 2) {
             $scope.sampleNameIndex = 0;
           }
         }, 5000)

         $scope.holiDayForm = form;

         $timeout(function() {
           $('#holidayName').focus();
         },1000);

         $scope.saveHoliday = function() {
           if ($scope.holiDayForm.name == null || $scope.holiDayForm.name.length == 0) {
             Flash.create('warning', 'Please Mention The Name' );
             return
           }
           if ($scope.holiDayForm.date == null) {
             Flash.create('warning', 'Please Select The Date' );
             return
           }
           var url = '/api/organization/companyHoliday/'
           var method = 'POST';
           var dataToSend = {
             typ : $scope.holiDayForm.typ,
             name : $scope.holiDayForm.name,
           };
           if (typeof $scope.holiDayForm.date == 'object') {
             dataToSend.date = $scope.holiDayForm.date.toJSON().split('T')[0]
           }else {
             dataToSend.date = $scope.holiDayForm.date
           }

           var params = {}

           if ($state.is('businessManagement.KloudERP.holidays')) {
             params = {master : 'yes'}
           }


           if ($scope.holiDayForm.pk) {
             url += $scope.holiDayForm.pk + '/'
             method = 'PATCH'
           }
           console.log(dataToSend);
           $http({method : method , url : url , data : dataToSend , params : params}).
           then(function(response) {
             console.log(response.data);
             if ($scope.holiDayForm.pk) {
               Flash.create('success', 'Updated' );
             }else {

               Flash.create('success', 'Created' );
             }
             $scope.holiDayForm = {typ : 'national' , date : new Date()}
             $scope.allHolidays()
           })
         }


       },
     }).result.then(function() {
       $scope.allHolidays()
     }, function() {
       $scope.allHolidays()
     });


   }



   $scope.searchHoliday={
     searchValue:'',
     year : '2021'
   }

   $scope.allHolidays = function(){
     var url ='/api/organization/companyHoliday/?year=' + $scope.searchHoliday.year ;
     if ($scope.searchHoliday.searchValue.length > 0) {
       url += '&search='+$scope.searchHoliday.searchValue;
     }
     $http({
       method:'GET',
       url:url
     }).then(function(response){
       $scope.holidays = response.data
     })
   }
   $scope.allHolidays()

   $scope.editHolidays = function(data,idx){
     $scope.holidays.splice(idx,1)
     console.log(data,"490394039");

   }

 });




app.controller('admin.settings.configure.version.form', function($scope, $http, $state, $uibModal, Flash) {

$scope.search = {
  searchValue : '',
}

$scope.getAll = function(){
  var url = '/api/ERP/appversioning/'
  if ($scope.search.searchValue.length>0) {
    url+='?title__icontains='+$scope.search.searchValue
  }
  $http({
    method:'GET',
    url:url
  }).then(function(response){
    $scope.versions = response.data
  })

}
$scope.getAll()


  $scope.addVersioning = function(indx) {
    if (indx!=undefined) {
       data = $scope.versions[indx]
    }
    else{
      data = indx
    }
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.appversioning.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: function($scope, $uibModalInstance, $rootScope, $http, Flash, data) {
        $scope.form = {
          minVersion : '',
          latestVersion:'',
          enabled:false,
          title:''
        }
        if (data!=undefined) {
          $scope.form = data
        }
        $scope.save = function(){
          var dataToSend = $scope.form
          var method = 'POST'
          var url = '/api/ERP/appversioning/'
          if ($scope.form.pk) {
            method = 'PATCH'
            url+=$scope.form.pk+'/'
          }
          $http({
            method: method,
            url: url,
            data : dataToSend
          }).
          then(function(response) {
            Flash.create('success','Saved')
            if ($scope.form.pk) {
              $uibModalInstance.dismiss()
            }
            else{
              $uibModalInstance.dismiss(response.data)
            }
          })
        }
      }
    }).result.then(function() {

    }, function(returndata) {
      if (returndata!=undefined) {
        $scope.data.versions.push(returndata)
      }
    });
  }


  $scope.delete = function(indx){
    $http({
      method:'DELETE',
      url:'/api/ERP/appversioning/'+$scope.versions[indx].pk+'/'
    }).then(function(response){
      $scope.versions.splice(indx,1)
    })
  }


})

app.controller('admin.settings.configure.language.form', function($scope, $http, $state, $uibModal, Flash) {

  $scope.search = {
    searchValue:'',
  }

  $scope.page = 0;
  $scope.next = function() {
    $scope.page += 1;
    $scope.getAll();
  }
  $scope.prev = function() {
    if ($scope.page == 0) {
      return;
    }
    $scope.page -= 1;
    $scope.getAll();
  }

  $scope.getAll = function(){
    var url =  '/api/ERP/getAllEntries/?limit=10&offset=' + 10 * $scope.page;
    if ($scope.search.searchValue.length>0) {
      url+='&search='+$scope.search.searchValue
    }
    $http({
      method: 'GET',
      url: url,
    }).
    then(function(response) {
      $scope.data = response.data
    })
  }
  $scope.getAll()

  $scope.updateLang = function(data){
    $http({
      method: 'POST',
      url: '/api/ERP/createNewEntry/',
      data:{
        id : data.pk,
        value:data.value
      }
    }).
    then(function(response) {
    })
  }

  // $scope.updateLangEng = function(data, other){
  //   $http({
  //     method: 'POST',
  //     url: '/api/ERP/createNewEntry/',
  //     data:{
  //       id : data.pk,
  //       value:data.value.
  //       oldvalue : other.key
  //     }
  //   }).
  //   then(function(response) {
  //   })
  // }

  $scope.addLang = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.addnewentry.html',
      size: 'md',
      backdrop: true,
      controller: function($scope, $uibModalInstance, $rootScope, $http, Flash) {
        $scope.form = {
          text : ''
        }
        $scope.addNewEntry = function() {
            $http({
              method: 'POST',
              url: '/api/ERP/createNewEntry/',
              data:{
                text : $scope.form.text,
              }
            }).
            then(function(response) {
              if (response.data) {
                 $uibModalInstance.dismiss(response.data)
              }
            })
        }
      }
    }).result.then(function() {

    }, function(data) {
      if (data.created) {
        $scope.data.push(data.val)
      }
      else{
        Flash.create('warning' , 'Already Added')
        return
      }
    });
  }



})

app.controller('businessManagement.appsDetails', function($scope, $http, $state, $uibModal, Flash) {


   $scope.getApp  = function(){
     $http({
       method: 'GET',
       url: '/api/ERP/application/' + $state.params.id + '/'
     }).
     then(function(response) {
       $scope.data = response.data;
       $scope.mediaForm.medialist =  response.data.appMedia
       $scope.mobilemediaForm.medialist =  response.data.mobileMedia
     })

   }
   $scope.getApp()



   $scope.refreshs = function(){

     $scope.mobilemediaForm = {
       typ:'',attachment:emptyFile,medialist:[],name:''
     }

   }
   $scope.refreshs()

   $scope.uploadMobile = function(file){
     console.log(file,'WEqwer');
     $scope.files = file[0]
     var fd = new FormData()

     fd.append('attachment',$scope.files)
     fd.append('name',$scope.files.name)
     fd.append('app',$state.params.id)


     $http({
       method: 'POST',
       url: '/api/ERP/mobileapplicationmedia/',
       data: fd,
       transformRequest: angular.identity,
       headers: {
         'Content-Type': undefined
       }
     }).
     then(function(response) {

       Flash.create('success', "Created...!")
       $scope.mobilemediaForm.medialist.push(response.data)
     })
   }


$scope.delMobileMedia = function(indx){
  $http({
    method: 'DELETE',
    url: '/api/ERP/mobileapplicationmedia/'+$scope.mobilemediaForm.medialist[indx].pk+'/',

  }).
  then(function(response) {
    $scope.mobilemediaForm.medialist.splice(indx,1)
    Flash.create('success', "Deleted....!")
  })
}


   $scope.saveApp = function() {
     var fd = new FormData()

     fd.append('displayName', $scope.data.displayName)
     fd.append('description', $scope.data.description)
     fd.append('windows', $scope.data.windows)
     fd.append('android', $scope.data.android)
     fd.append('ios', $scope.data.ios)
     fd.append('mac', $scope.data.mac)
     fd.append('rating_one', $scope.data.rating_one)
     fd.append('rating_two', $scope.data.rating_two)
     fd.append('rating_three', $scope.data.rating_three)
     fd.append('rating_four', $scope.data.rating_four)
     fd.append('rating_five', $scope.data.rating_five)
     fd.append('inMenu', $scope.data.inMenu)
     fd.append('admin', $scope.data.admin)
     fd.append('totalRatings' , $scope.data.totalRatings)
     $http({
       method: 'PATCH',
       url: '/api/ERP/application/' + $state.params.id + '/',
       data: fd,
       transformRequest: angular.identity,
       headers: {
         'Content-Type': undefined
       }
     }).
     then(function(response) {
       Flash.create('success', "Updated...!")
     })
   }

   $scope.getappSettings = function() {
     $http({
       method: 'GET',
       url: '/api/ERP/appsettings/?app=' + $state.params.id
     }).
     then(function(response) {
       $scope.appsettings = response.data;
     })
   }
     $scope.getappSettings()
   $scope.getmenuItems = function() {
     $http({
       method: 'GET',
       url: '/api/ERP/menuitems/?parent=' + $state.params.id
     }).
     then(function(response) {
       $scope.menuitems = response.data;
     })
   }
   $scope.getmenuItems()

   $scope.delSettings = function(idx) {
     $http({
       method: 'DELETE',
       url: '/api/ERP/appsettings/' + $scope.appsettings[idx].pk + '/'
     }).
     then(function(response) {
       $scope.appsettings.splice(idx, 1)
       Flash.create('success', 'Deleted...!!!')
     })
   }
   $scope.delmenuItem = function(idx) {
     $http({
       method: 'DELETE',
       url: '/api/ERP/menuitems/' + $scope.menuitems[idx].pk + '/'
     }).
     then(function(response) {
       $scope.menuitems.splice(idx, 1)
       Flash.create('success', 'Deleted...!!!')
     })
   }


 // [{'name' : 'Purchase Orders Terms and Conditions' , 'state' :  'admin.termsandcondition
 // '}, {'name' : 'Sale Order / invoice Terms and Conditions' , 'state' :  'admin.salestermsandcondition'}, {'name' : 'CRM Documents Formats' , 'state' :  'admin.crmtermsandcondition'} , {'name' : 'Servicing / Ticketing Terms And Conditions' , 'state' :  'admin.termsandconditions'}]

   $scope.createAppsettings = function(app) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.createappsettings.html',
       size: 'md',
       backdrop: true,
       resolve: {
         app: function() {
           return app
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, $http, Flash, app) {
         $scope.app = app
         $scope.form = {
           heading: '',
           name: ''
         }
         if ($scope.app != undefined) {
           $scope.form.heading = $scope.app.heading
           $scope.form.name = $scope.app.name
           $scope.form.state = $scope.app.state
         }






         $scope.save = function() {
           var dataToSend = {
             heading: $scope.form.heading,
             name: $scope.form.name,
             state: $scope.form.state,
             app: $state.params.id
           }
           if ($scope.app == '' || $scope.app == undefined) {
             var method = 'POST'
             var url = '/api/ERP/appsettings/'
           } else {
             method = 'PATCH'
             var url = '/api/ERP/appsettings/' + $scope.app.pk + '/'
           }
           $http({
             method: method,
             url: url,
             data: dataToSend
           }).
           then(function(response) {
             $uibModalInstance.dismiss()
             Flash.create('success', 'Created....!!!')

           })
         }


       }
     }).result.then(function() {

     }, function() {
       $scope.getappSettings()
     });







   }
   $scope.createmenuItems = function(app) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.createmenuitems.html',
       size: 'md',
       backdrop: true,
       resolve: {
         app: function() {
           return app
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, $http, Flash, app) {
         $scope.app = app
         $scope.form = {
           icon: '',
           state:'',
           name: '',
           parent:'',
           jsFileName : ''
         }
         if ($scope.app != undefined) {
           $scope.form.icon = $scope.app.icon
           $scope.form.name = $scope.app.name
           $scope.form.state = $scope.app.state
           $scope.form.jsFileName = $scope.app.jsFileName
         }






         $scope.save = function() {
           var dataToSend = {
             icon: $scope.form.icon,
             state: $scope.form.state,
             name: $scope.form.name,
             parent: $state.params.id,
             jsFileName: $scope.form.jsFileName
           }
           if ($scope.app == '' || $scope.app == undefined) {
             var method = 'POST'
             var url = '/api/ERP/menuitems/'
           } else {
             method = 'PATCH'
             var url = '/api/ERP/menuitems/' + $scope.app.pk + '/'
           }
           $http({
             method: method,
             url: url,
             data: dataToSend
           }).
           then(function(response) {
             $uibModalInstance.dismiss()
             Flash.create('success', 'Created....!!!')

           })
         }


       }
     }).result.then(function() {

     }, function() {
       $scope.getmenuItems()
     });







   }
   $scope.createAppFeature = function(app) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.createappfeature.html',
       size: 'md',
       backdrop: true,
       resolve: {
         app: function() {
           return app
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, $http, Flash, app) {
         $scope.app = app
         $scope.form = {
           name:'',parent:'',enabled:true
         }
         if ($scope.app != undefined) {
           $scope.form.name = $scope.app.name
           $scope.form.enabled = $scope.app.enabled

         }






         $scope.save = function() {
           var dataToSend = {
             name: $scope.form.name,
             enabled: $scope.form.enabled,
             parent: $state.params.id,
           }
           if ($scope.app == '' || $scope.app == undefined) {
             var method = 'POST'
             var url = '/api/ERP/applicationfeature/'
           } else {
             method = 'PATCH'
             var url = '/api/ERP/applicationfeature/' + $scope.app.pk + '/'
           }
           $http({
             method: method,
             url: url,
             data: dataToSend
           }).
           then(function(response) {
             $uibModalInstance.dismiss()
             Flash.create('success', 'Created....!!!')

           })
         }


       }
     }).result.then(function() {

     }, function() {
       $scope.getAppfeatures()
     });







   }

   $scope.getAppfeatures = function(){

         $http({
           method: 'GET',
           url: '/api/ERP/applicationfeature/?parent=' + $state.params.id
         }).
         then(function(response) {
           $scope.appFeatures = response.data;
         })

   }
     $scope.getAppfeatures()

   $scope.deleteFeature = function(indx){
     $http({
       method: 'DELETE',
       url: '/api/ERP/applicationfeature/' + $scope.appFeatures[indx].pk + '/'
     }).
     then(function(response) {
       $scope.appFeatures.splice(indx,1)
       Flash.create('success','Deleted....!!!')
     })
   }

   $scope.refresh = function(){

     $scope.mediaForm = {
       typ:'',attachment:emptyFile,medialist:[],name:''
     }

   }
   $scope.refresh()

   $scope.fileupload = function(file){
     $scope.file = file[0]
     var fd = new FormData()

     fd.append('attachment',$scope.file)
     fd.append('name',$scope.file.name)
     fd.append('app',$state.params.id)


     $http({
       method: 'POST',
       url: '/api/ERP/applicationmedia/',
       data: fd,
       transformRequest: angular.identity,
       headers: {
         'Content-Type': undefined
       }
     }).
     then(function(response) {

       Flash.create('success', "Created...!")
       $scope.mediaForm.medialist.push(response.data)
     })
   }



   $scope.delMedia = function(indx){
     $http({
       method: 'DELETE',
       url: '/api/ERP/applicationmedia/'+$scope.mediaForm.medialist[indx].pk+'/',

     }).
     then(function(response) {
       $scope.mediaForm.medialist.splice(indx,1)
       Flash.create('success','Deleted...!!!')
     })
   }

   $scope.giveFeedback = function(feedback) {
     $uibModal.open({
       templateUrl: '/static/ngTemplates/app.organization.givefeedback.html',
       size: 'md',
       backdrop: true,
       resolve: {
         feedback: function() {
           return feedback
         }
       },
       controller: function($scope, $uibModalInstance, $rootScope, $http, Flash, feedback) {
         $scope.feedback = feedback
         $scope.form = {
           name: '',
           star:0,
           text: '',
           app:'',
         }
         if ($scope.feedback != undefined) {
           $scope.form.name = $scope.feedback.name
           $scope.form.star = $scope.feedback.star
           $scope.form.text = $scope.feedback.text
         }






         $scope.save = function() {
           if ($scope.form.star >5) {
             Flash.create('danger','Maximum rating is 5')
             return
           }
           var dataToSend = {
             name: $scope.form.name,
             star: $scope.form.star,
             text: $scope.form.text,
             app: $state.params.id,
           }
           if ($scope.feedback == '' || $scope.feedback == undefined) {
             var method = 'POST'
             var url = '/api/ERP/feedback/'
           } else {
             method = 'PATCH'
             var url = '/api/ERP/feedback/' + $scope.feedback.pk + '/'
           }
           $http({
             method: method,
             url: url,
             data: dataToSend
           }).
           then(function(response) {
             Flash.create('success', 'Created....!!!')
             $uibModalInstance.dismiss()


           })
         }


       }
     }).result.then(function() {

     }, function() {
       $scope.getApp()
     });

   }





   $scope.delFeedback = function(idx){
     $http({
       method: 'DELETE',
       url: '/api/ERP/feedback/'+$scope.data.feedback[idx].pk+'/',
     }).
     then(function(response) {
       $scope.data.feedback.splice(idx,1)
       Flash.create('success', 'Deleted....!!!')

     })
   }

 });

 app.filter('timeAgo' , function(){
   return function(input){
     if (input == null || input == "null" || input == "" || input == undefined) {
       return ""
     }
     t = new Date(input);
     var now = new Date();
     var diff = Math.floor((now - t)/60000)
     if (diff<60) {
       return diff+' Mins';
     }else if (diff>=60 && diff<60*24) {
       return Math.floor(diff/60)+' Hrs';
     }else if (diff>=60*24) {
       return Math.floor(diff/(60*24))+' Days';
     }
   }
 })
