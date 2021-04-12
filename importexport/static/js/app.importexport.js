app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.importexport', {
      url: "/importexport",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.projects1.html',
          controller: 'businessManagement.importexport',
        }
      }
    })
    .state('businessManagement.importexport.projects', {
      url: "/projects",
      templateUrl: '/static/ngTemplates/app.newProjview.html',
      controller: 'businessManagement.importexport'
    })
    .state('businessManagement.importexport.viewProject1', {
      url: "/projects/view/:id/",
      templateUrl: '/static/ngTemplates/app.projects.service.item.html',
      controller: 'businessManagement.importexport'
    })
    .state('businessManagement.importexport.archieveProject', {
      url: "/projects/archieve",
      templateUrl: '/static/ngTemplates/app.projects.archieve.item.html',
      controller: 'businessManagement.importexport'
    })
    .state('businessManagement.importexport.junkProject', {
      url: "/projects/junk",
      templateUrl: '/static/ngTemplates/app.projects.junk.item.html',
      controller: 'businessManagement.importexport'
    })
    .state('businessManagement.importexport.projectView', {
      url: "/projects/projectView/:id/",
      templateUrl: '/static/ngTemplates/app.projects.service.view.html',
      controller: 'businessManagement.importexport.projects.service.view'
    })
    .state('businessManagement.importexport.junkprojectView', {
      url: "/projects/junkView/:id/",
      templateUrl: '/static/ngTemplates/app.projects.service.view.html',
      controller: 'businessManagement.importexport.projects.junk.explore'
    })
    .state('businessManagement.importexport.archiveprojectView', {
      url: "/projects/archiveView/:id/",
      templateUrl: '/static/ngTemplates/app.projects.service.view.html',
      controller: 'businessManagement.importexport.projects.archieve.explore'
    })

    .state('businessManagement.importexport.projectsNew', {
      url: "/projects/new",
      templateUrl: '/static/ngTemplates/app.projects.form.html',
      controller: 'businessManagement.importexport.projects.form'
    })
    .state('businessManagement.importexport.projectsEdit', {
      url: "/projects/edit/:id/",
      templateUrl: '/static/ngTemplates/app.projects.form.html',
      controller: 'businessManagement.importexport.projects.form'
    });
}) //----------------------------------------------project1-------------------------------------
app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.importexport.masterSheet', {
      url: "/masterSheet",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.masterSheet.html',
          controller: 'businessManagement.importexport.masterSheet',
        }
      }
    })
    .state('businessManagement.importexport.newmasterSheet', {
      url: "/masterSheet/new",
      templateUrl: '/static/ngTemplates/app.masterSheet.newProduct.html',
      controller: 'businessManagement.importexport.masterSheet.newProduct'
    })
    .state('businessManagement.importexport.editmasterSheet', {
      url: "/masterSheet/edit/:id/",
      templateUrl: '/static/ngTemplates/app.masterSheet.newProduct.html',
      controller: 'businessManagement.importexport.masterSheet.newProduct'
    })
}); //--------------------------------mastersheet------------------------------------------------
app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.importexport.inventory1', {
    url: "/inventory1",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.inventory1.html',
        controller: 'businessManagement.importexport.inventory1',
      }
    }
  })
}); //----------------------------------inventry1--------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.importexport.vendor', {
      url: "/vendor",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.vendor.html',
          controller: 'businessManagement.importexport.vendor',
        }
      }
    })
    .state('businessManagement.importexport.newVendor', {
      url: "/vendor/new",
      templateUrl: '/static/ngTemplates/app.vendor.form.html',
      controller: 'businessManagement.importexport.vendor.form'
    })
    .state('businessManagement.importexport.editVendor', {
      url: "/vendor/edit/:id/",
      templateUrl: '/static/ngTemplates/app.vendor.form.html',
      controller: 'businessManagement.importexport.vendor.form'
    });

})
//--------------------------------------vendor----------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.importexport.invoice', {
      url: "/invoice",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.invoice.html',
          controller: 'businessManagement.importexport.invoice',
        }
      }
    })
    .state('businessManagement.importexport.newInvoice', {
      url: "/invoice/new",
      templateUrl: '/static/ngTemplates/app.invoice.form.html',
      controller: 'businessManagement.importexport.invoice.form'
    })
    .state('businessManagement.importexport.editInvoice', {
      url: "/invoice/edit/:id/",
      templateUrl: '/static/ngTemplates/app.invoice.form.html',
      controller: 'businessManagement.importexport.invoice.form'
    })
    .state('businessManagement.importexport.viewInvoice', {
      url: "/invoice/view/:id/",
      templateUrl: '/static/ngTemplates/app.invoice.explore.html',
      controller: 'businessManagement.importexport.invoice.explore'
    })
}); //-----------------------------------invoices--------------------------------------------------
app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.importexport.deliveryChallan', {
      url: "/deliveryChallan",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.deliveryChallan.html',
          controller: 'businessManagement.importexport.deliveryChallan',
        }
      }
    })
    .state('businessManagement.importexport.viewDeliverychallan', {
      url: "/deliveryChallan/view/:id/",
      templateUrl: '/static/ngTemplates/app.deliveryChallan.explore.html',
      controller: 'businessManagement.importexport.deliveryChallan.explore'
    })
}); //-------------------------------deliverychallan------------------------------------------------
app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.importexport.stockReport', {
    url: "/stockReport",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.stockReport.html',
        controller: 'businessManagement.importexport.stockReport',
      }
    }
  })
}); //--------------------------------------stockreport----------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.importexport.report', {
    url: "/report",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.report.html',
        controller: 'businessManagement.importexport.report',
      }
    }
  })
}); //----------------------------report--------------------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.importexport.CMS', {
      url: "/CMS",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.CMS.html',
          controller: 'businessManagement.importexport.CMS',
        }
      }
    })
    .state('businessManagement.importexport.CMSView', {
      url: "/CMSView/:id/",
      templateUrl: '/static/ngTemplates/app.CMS.view.html',
      controller: 'businessManagement.importexport.CMSView'
    })
    .state('businessManagement.importexport.newCMS', {
      url: "/CMS/new",
      templateUrl: '/static/ngTemplates/app.CMS.form.html',
      controller: 'businessManagement.importexport.CMS.form'
    })
    .state('businessManagement.importexport.editCMS', {
      url: "/CMS/edit/:id/",
      templateUrl: '/static/ngTemplates/app.CMS.form.html',
      controller: 'businessManagement.importexport.CMS.form'
    })
}); //---------------------------------complaints-----------------------------------------------------

var projectsStepsData = [{
    indx: 1,
    text: 'created',
    display: 'Created'
  },
  {
    indx: 2,
    text: 'sent_for_approval',
    display: 'Sent For Approval'
  },
  {
    indx: 3,
    text: 'approved',
    display: 'Approved'
  },
  {
    indx: 4,
    text: 'ongoing',
    display: 'OnGoing'
  },
];
app.controller("businessManagement.importexport", function($rootScope, $scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, $permissions) {


  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()
  });

  if ($state.is('businessManagement.importexport.viewProject1')) {
    $scope.limit = 10
    $scope.offset = 0
    $scope.count = 0

    if($rootScope.formToggle.toggleMain){
      $scope.flagValue = 'True'
    }else{
      $scope.flagValue = 'False'
    }
    $scope.privious = function() {
      if ($scope.offset > 0) {
        $scope.offset -= $scope.limit
        $scope.fetchData()
      }
    }

    $scope.next = function() {
      if ($scope.offset < $scope.count) {
        $scope.offset += $scope.limit
        $scope.fetchData()
      }
    }
    $scope.search = {
      query: ''
    }
    $scope.fetchData = function() {
      let url = '/api/importexport/projects/?savedStatus=false&junkStatus=false&comm_nr=' + $stateParams.id + '&flag=' + $rootScope.formToggle.toggleMain + '&limit=' + $scope.limit + '&offset=' + $scope.offset
      if ($scope.search.query.length > 0) {
        url = url + '&title=' + $scope.search.query

      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.allData = response.data.results

        $scope.count = response.data.count
      })
    }
    $scope.fetchData()
    $scope.deleteProject = function(pk) {
      $http({
        method: 'DELETE',
        url: '/api/importexport/projects/' + pk + "/",
      }).then(function(response) {
        Flash.create("success", "Project deleted")
        $scope.fetchData();
      });
    }
    $scope.projectSearch = function(query) {
      return $http.get('/api/importexport/projectSearch/?search=' + query + '&flag='+ $scope.flagValue + '&comm_nr='+  $stateParams.id+'&type=poView').
      then(function(response) {
        return response.data;
      })
    };

  }
  if ($state.is('businessManagement.importexport.projects')) {
    $scope.limit = 5
    $scope.offset = 0
    $scope.count = 0

    $scope.search = {
      query: '',
      flag:false
    }

    if($rootScope.formToggle.toggleMain){
      $scope.search.flag = 'True'
    }else{
      $scope.search.flag = 'False'
    }

    $scope.privious = function() {
      if ($scope.offset > 0) {
        $scope.offset -= $scope.limit
        $scope.fetchData()
      }
    }

    $scope.next = function() {
      if ($scope.offset < $scope.count) {
        $scope.offset += $scope.limit
        $scope.fetchData()
      }
    }

    $scope.fetchData = function() {
      $scope.true = 'true'
      let url = '/api/importexport/getCommnr/?flag='+$scope.search.flag
      if ($scope.search.query.length > 0) {
        url = url + '&comm_nr=' + $scope.search.query
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.allData = response.data

        $scope.count = response.data.count
      })
    }
    $scope.fetchData()

    $scope.commSearch = function(query) {
      return $http.get('/api/importexport/getCommnr/?flag='+$scope.search.flag+'&comm_nr=' + query).
      then(function(response) {
        return response.data;
      })
    };


  }

  $scope.me = $users.get('mySelf');
  // $scope.cmrTableAction = function(idx, action) {
  //   console.log(idx, action);
  //   $scope.selectedData = $scope.cmrData.serializerData[idx]
  //   console.log($scope.selectedData);
  //   if (action == 'edit') {
  //     var title = 'Edit Project : ';
  //     var appType = 'projectEditor';
  //   } else if (action == 'details') {
  //     var title = 'Project Details : ';
  //     var appType = 'projectDetails';
  //   } else if (action == 'delete') {
  //     var dataSend = {
  //       junkStatus: true
  //     }
  //     console.log($scope.selectedData);
  //     $http({
  //       method: 'PATCH',
  //       data: dataSend,
  //       url: '/api/importexport/projects/' + $scope.selectedData.pk + '/'
  //     }).
  //     then(function(response) {
  //       Flash.create('success', 'Item Deleted');
  //     })
  //     $scope.cmrData.serializerData.splice(idx, 1)
  //     return;
  //   }
  //
  //   $scope.addTab({
  //     title: title + $scope.selectedData.title,
  //     cancel: true,
  //     app: appType,
  //     data: {
  //       pk: $scope.selectedData.pk,
  //       index: idx,
  //       cmData: $scope.selectedData
  //     },
  //     active: true
  //   })
  //
  // }

  //
  // $scope.tableActionArchieve = function(target, action, mode) {
  //   for (var i = 0; i < $scope.data.archieveData.length; i++) {
  //     if ($scope.data.archieveData[i].pk == parseInt(target)) {
  //       if (action == 'details') {
  //         var title = 'Details :';
  //         var appType = 'projectarchieveDetails';
  //       }
  //
  //       $scope.addTab({
  //         title: title + $scope.data.archieveData[i].title,
  //         cancel: true,
  //         app: appType,
  //         data: {
  //           pk: target,
  //           index: i
  //         },
  //         active: true
  //       })
  //     }
  //   }
  //
  // }
  // $scope.tableActionJunk = function(target, action, mode) {
  //   console.log("heeeeeeeerrrrrrrrrrrreeeeeeeee");
  //   for (var i = 0; i < $scope.data.junkData.length; i++) {
  //     if ($scope.data.junkData[i].pk == parseInt(target)) {
  //       if (action == 'details') {
  //         var title = 'Details :';
  //         var appType = 'projectjunkDetails';
  //       }
  //
  //       $scope.addTab({
  //         title: title + $scope.data.junkData[i].title,
  //         cancel: true,
  //         app: appType,
  //         data: {
  //           pk: target,
  //           index: i
  //         },
  //         active: true
  //       })
  //     }
  //   }
  //
  // }
  //
  //
  // $scope.tabs = [];
  // $scope.searchTabActive = {
  //   'active': true
  // };

  // $scope.closeTab = function(index) {
  //   $scope.tabs.splice(index, 1)
  //   if ($scope.tabs.length == 0) {
  //     $scope.searchTabActive.active = true;
  //   }
  // }
  //
  // $scope.addTab = function(input) {
  //   $scope.searchTabActive.active = false;
  //   alreadyOpen = false;
  //   for (var i = 0; i < $scope.tabs.length; i++) {
  //     if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
  //       $scope.tabs[i].active = true;
  //       alreadyOpen = true;
  //     } else {
  //       $scope.tabs[i].active = false;
  //     }
  //   }
  //   if (!alreadyOpen) {
  //     $scope.tabs.push(input)
  //   }
  // }

  if ($state.is('businessManagement.importexport.archieveProject')) {
    $scope.limit = 10
    $scope.offset = 0
    $scope.count = 0

    $scope.privious = function() {
      if ($scope.offset > 0) {
        $scope.offset -= $scope.limit
        $scope.fetchData()
      }
    }

    $scope.next = function() {
      if ($scope.offset < $scope.count) {
        $scope.offset += $scope.limit
        $scope.fetchData()
      }
    }
    $scope.search = {
      query: ''
    }
    $scope.fetchData = function() {
      $scope.true = 'true'
      let url = '/api/importexport/projects/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&savedStatus=' + $scope.true + '&status=ongoing&flag=' + $rootScope.formToggle.toggleMain
      if ($scope.search.query.length > 0) {
        url = url + '&title=' + $scope.search.query
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.allData = response.data.results
        $scope.count = response.data.count
        console.log($scope.allData, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      })
    }
    $scope.fetchData()

  }


  if ($state.is('businessManagement.importexport.junkProject')) {
    $scope.limit = 10
    $scope.offset = 0
    $scope.count = 0

    $scope.privious = function() {
      if ($scope.offset > 0) {
        $scope.offset -= $scope.limit
        $scope.fetchData()
      }
    }

    $scope.next = function() {
      if ($scope.offset < $scope.count) {
        $scope.offset += $scope.limit
        $scope.fetchData()
      }
    }
    $scope.search = {
      query: ''
    }
    $scope.fetchData = function() {
      $scope.true = 'true'
      let url = '/api/importexport/projects/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&junkStatus=true&flag=' + $rootScope.formToggle.toggleMain
      if ($scope.search.query.length > 0) {
        url = url + '&title=' + $scope.search.query
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.allData = response.data.results
        $scope.count = response.data.count
      })
    }
    $scope.fetchData()

  }

})

app.controller("businessManagement.importexport.projects.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $filter, $rootScope) {

  if ($state.is('businessManagement.importexport.projectsEdit')) {
    $http({
      url: '/api/importexport/projects/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data

      $scope.resetForm = function() {
        $scope.form = {
          vendor: '',
          title: '',
          responsible: [],
          date: '',
          service: '',
          machinemodel: '',
          comm_nr: '',
          customer_ref: '',
          flag: $rootScope.formToggle.toggleMain
        }
      }
      $rootScope.$on('customEvent', function(event, message) {
        $scope.form.flag = message
        console.log($scope.form.flag, 'jjjjjjjjjjjjjjj')
      });

      $scope.companySearch = function(query) {
        return $http.get('/api/ERP/service/?name__icontains=' + query).
        then(function(response) {
          return response.data;
        })
      };
      $scope.vendorSearch = function(query) {
        console.log('iiiiiiiinnnnnnnnnnnnn');
        return $http.get('/api/importexport/vendor/?name__icontains=' + query).
        then(function(response) {

          return response.data;
        })
      };

      $scope.showCreateCompanyBtn = false;
      $scope.companyExist = false;
      $scope.me = $users.get('mySelf');

      $scope.companySearch = function(query) {
        return $http.get('/api/ERP/service/?name__icontains=' + query).
        then(function(response) {
          return response.data;
        })
      };

      $scope.$watch('form.service', function(newValue, oldValue) {
        if (typeof newValue == "string" && newValue.length > 0) {
          $scope.showCreateCompanyBtn = true;
          $scope.companyExist = false;
          $scope.showCompanyForm = false;
        } else if (typeof newValue == "object") {
          $scope.companyExist = true;
        } else {
          $scope.showCreateCompanyBtn = false;
          $scope.showCompanyForm = false;
        }

        if (newValue == '') {
          $scope.showCreateCompanyBtn = false;
          $scope.showCompanyForm = false;
          $scope.companyExist = false;
        }

      });

      $scope.openCreateService = function(mode) {
        console.log(mode);
        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.projects.service.create.html',
          size: 'lg',
          backdrop: true,
          resolve: {
            data: function() {
              return $scope.form.service;
            }
          },
          controller: function($scope, data, $uibModalInstance) {
            // console.log(data);
            $scope.form = {}
            console.log(data, 'aaaaaaaaaaaaaaa');
            if (typeof data == 'object') {
              console.log("here");
              $scope.form = data



            } else {
              $scope.form.name = data
            }
            console.log($scope.form);
            //------------------------------------------------------------------------
            $scope.createCompany = function() {
              var method = 'POST'
              var addUrl = '/api/ERP/address/'
              var serviceUrl = '/api/ERP/service/'
              if ($scope.form.address.pk) {
                method = 'PATCH'
                addUrl = addUrl + $scope.form.address.pk + '/'
                serviceUrl = serviceUrl + data.pk + '/'
              }
              $http({
                method: method,
                url: addUrl,
                data: $scope.form.address
              }).
              then(function(response) {
                var dataToSend = {
                  name: $scope.form.name,
                  customerName: $scope.form.customerName,
                  email: $scope.form.email,
                  mobile: $scope.form.mobile,
                  about: $scope.form.about,
                  address: response.data.pk,
                  telephone: $scope.form.telephone,
                  cin: $scope.form.cin,
                  tin: $scope.form.tin,
                  logo: $scope.form.logo,
                  web: $scope.form.web,
                  gst: $scope.form.gst,
                };
                $http({
                  method: method,
                  url: serviceUrl,
                  data: dataToSend
                }).
                then(function(response) {
                  Flash.create('success', 'Saved');
                  $uibModalInstance.dismiss(response.data);
                });
              })
            }
          }, //----controller ends
        }).result.then(function(f) {
          $scope.fetchData();
        }, function(f) {
          if (typeof f == 'object') {
            $scope.form.service = f
          }
        });

      }
    })

    $scope.updateProjects = function() {
      console.log(typeof $scope.form.vendor, 'aaaaaaaa');
      if ($scope.form.service == '' || typeof $scope.form.service != 'object') {
        Flash.create('warning', 'Please Select Customer')
        return
      }
      if ($scope.form.vendor == '' || typeof $scope.form.vendor != 'object') {
        Flash.create('warning', 'Please Select Vendor')
        return
      }
      if ($scope.form.title == '') {
        Flash.create('warning', 'Please Add Title')
        return
      }
      if ($scope.form.date == '') {
        Flash.create('warning', 'Please Add Tentative Closing Date')
        return
      } else if (typeof $scope.form.date == 'object') {
        $scope.form.date = $scope.form.date.toJSON().split('T')[0]

      }
      if ($scope.form.comm_nr == '') {
        Flash.create('warning', 'Please Add comm_nr')
        return
      }


      var dataToSend = {
        service: $scope.form.service.pk,
        vendor: $scope.form.vendor.pk,
        title: $scope.form.title,
        responsible: $scope.form.responsible,
        date: $scope.form.date,
        machinemodel: $scope.form.machinemodel,
        comm_nr: $scope.form.comm_nr,
        quote_ref: $scope.form.quote_ref,
        enquiry_ref: $scope.form.enquiry_ref,
        flag: $scope.form.flag

      };

      $http({
        method: 'PATCH',
        url: '/api/importexport/projects/'+ $stateParams.id +'/',
        data: dataToSend,

      }).
      then(function(response) {
        Flash.create('success', 'Updated');
        if ($scope.mode == 'new') {
          $scope.resetForm()
        }
      });
    }
  }

  $scope.resetForm = function() {
    $scope.form = {
      vendor: '',
      title: '',
      responsible: [],
      date: '',
      service: '',
      machinemodel: '',
      comm_nr: '',
      customer_ref: '',
      flag: $rootScope.formToggle.toggleMain
    }
  }
  $rootScope.$on('customEvent', function(event, message) {
    $scope.form.flag = message
    console.log($scope.form.flag, 'jjjjjjjjjjjjjjj')
  });

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.vendorSearch = function(query) {
    console.log('iiiiiiiinnnnnnnnnnnnn');
    return $http.get('/api/importexport/vendor/?name__icontains=' + query).
    then(function(response) {

      return response.data;
    })
  };

  $scope.showCreateCompanyBtn = false;
  $scope.companyExist = false;
  $scope.me = $users.get('mySelf');

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.$watch('form.service', function(newValue, oldValue) {
    if (typeof newValue == "string" && newValue.length > 0) {
      $scope.showCreateCompanyBtn = true;
      $scope.companyExist = false;
      $scope.showCompanyForm = false;
    } else if (typeof newValue == "object") {
      $scope.companyExist = true;
    } else {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
    }

    if (newValue == '') {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
      $scope.companyExist = false;
    }

  });

  $scope.openCreateService = function(mode) {
    console.log(mode);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.projects.service.create.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.form.service;
        }
      },
      controller: function($scope, data, $uibModalInstance) {
        $scope.form = {}
        console.log(data, 'aaaaaaaaaaaaaaa');
        if (typeof data == 'object') {
          console.log("here");
          $scope.form = data



        } else {
          $scope.form.name = data
        }
        console.log($scope.form);
        //------------------------------------------------------------------------
        $scope.createCompany = function() {
          var method = 'POST'
          var addUrl = '/api/ERP/address/'
          var serviceUrl = '/api/ERP/service/'
          // if ($scope.form.address.pk) {
          //   method = 'PATCH'
          //   addUrl = addUrl + $scope.form.address.pk + '/'
          //   serviceUrl = serviceUrl + data.pk + '/'
          // }
          $http({
            method: method,
            url: addUrl,
            data: $scope.form.address
          }).
          then(function(response) {
            var dataToSend = {
              name: $scope.form.name,
              customerName: $scope.form.customerName,
              email: $scope.form.email,
              mobile: $scope.form.mobile,
              about: $scope.form.about,
              address: response.data.pk,
              telephone: $scope.form.telephone,
              cin: $scope.form.cin,
              tin: $scope.form.tin,
              logo: $scope.form.logo,
              web: $scope.form.web,
              gst: $scope.form.gst,
            };
            $http({
              method: method,
              url: serviceUrl,
              data: dataToSend
            }).
            then(function(response) {
              Flash.create('success', 'Saved');
              $uibModalInstance.dismiss(response.data);
            });
          })
        }
      }, //----controller ends
    }).result.then(function(f) {
      $scope.fetchData();
    }, function(f) {
      if (typeof f == 'object') {
        $scope.form.service = f
      }
    });

  }

  // -----------------------------------------------------------------------------
  if (typeof $scope.tab == 'undefined') {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.form = $scope.tab.data.cmData
  }

  $scope.createProjects = function() {
    console.log(typeof $scope.form.vendor, 'aaaaaaaa');
    if ($scope.form.service == '' || typeof $scope.form.service != 'object') {
      Flash.create('warning', 'Please Select Customer')
      return
    }
    if ($scope.form.vendor == '' || typeof $scope.form.vendor != 'object') {
      Flash.create('warning', 'Please Select Vendor')
      return
    }
    if ($scope.form.title == '') {
      Flash.create('warning', 'Please Add Title')
      return
    }
    if ($scope.form.date == '') {
      Flash.create('warning', 'Please Add Tentative Closing Date')
      return
    } else if (typeof $scope.form.date == 'object') {
      $scope.form.date = $scope.form.date.toJSON().split('T')[0]

    }
    if ($scope.form.comm_nr == '') {
      Flash.create('warning', 'Please Add comm_nr')
      return
    }

    var method = 'POST'
    var Url = '/api/importexport/projects/'
    var dataToSend = {
      service: $scope.form.service.pk,
      vendor: $scope.form.vendor.pk,
      title: $scope.form.title,
      responsible: $scope.form.responsible,
      date: $scope.form.date,
      machinemodel: $scope.form.machinemodel,
      comm_nr: $scope.form.comm_nr,
      quote_ref: $scope.form.quote_ref,
      enquiry_ref: $scope.form.enquiry_ref,
      flag: $scope.form.flag

    };

    $http({
      method: method,
      url: Url,
      data: dataToSend,
    }).
    then(function(response) {
      Flash.create('success', 'Project Created');
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    });
  }

})

app.controller("businessManagement.importexport.projects.service.item", function($scope, $state, $users, $stateParams, $http, Flash) {


})

app.controller("businessManagement.importexport.projects.service.view", function($scope, $state, $users, $stateParams, $http, Flash, $rootScope, $uibModal, $permissions) {
  if ($state.is('businessManagement.importexport.projectView')) {
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMM", $stateParams.id);
    $http({
      url: '/api/importexport/projects/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      $scope.permission = true



      $scope.projectSteps = {
        steps: projectsStepsData
      }

      if ($scope.tab == undefined) {} else {
        $scope.form = response.data;
      }


      $scope.updateStatus = function() {
        for (var i = 0; i < $scope.projectSteps.steps.length; i++) {
          if ($scope.projectSteps.steps[i].text == $scope.form.status) {
            $scope.form.selectedStatus = $scope.projectSteps.steps[i].indx;
            break;
          }
        }
      }
      $scope.updateStatus()

      $scope.me = $users.get('mySelf');
      $http.get('/api/HR/userSearch/').
      then(function(response) {
        $scope.persons = response.data;
        $scope.name = []

        function filterByPk(item) {
          if ($scope.form.responsible.includes(item.pk)) {
            $scope.name.push(item.first_name + item.last_name)
          }
        }
        $scope.persons.filter(filterByPk);
      })

      $scope.data = []
      $scope.showButton = true
      $scope.addTableRow = function(indx) {
        $scope.data.push({
          part_no: '',
          description_1: '',
          price: '',
          weight: 0,
          quantity1: 1,
          quotePrice: 0,
          inrPrice: 0,
          packing: 0,
          insurance: 0,
          freight: 0,
          gst: 0,
          gstVal: 0,
          cif: 0,
          custom: 0,
          customVal: 0,
          socialVal: 0,
          charge1: 0,
          charge2: 0,
          landed_price: 0,
          customs_no: 0,
          color: '#fff'
        });
        $scope.showButton = false
      }

      $scope.options = false
      $scope.showOption = function() {
        if ($scope.options == false) {
          $scope.options = true
        } else {
          $scope.options = false
        }
      }
      $scope.loader = false
      $scope.sheet = {
        product: emptyFile
      }
      if ($rootScope.formToggle.toggleMain) {
        $scope.flagValue = 'True'
      } else {
        $scope.flagValue = 'False'
      }
      $scope.uploadSheet = function() {
        console.log($scope.me, $scope.form.pk, 'hhhhhhhhhhhhhhhh');
        var projectPk = $scope.form.pk

        if ($scope.sheet.product == emptyFile) {
          Flash.create('warning', 'Please Select File');
          return
        } else {
          Flash.create('success', 'Sheet is Uploading, Please Wait');
          $scope.loader = true
        }

        var fd = new FormData();
        fd.append('excelFile', $scope.sheet.product);
        console.log(fd, 'sheeettt');

        $http({
          method: 'POST',
          url: '/api/importexport/UploadSheet/?projectpk=' + $scope.form.pk + '&userpk=' + $scope.me.pk + '&flag=' + $scope.flagValue,
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          $scope.sheet = {
            product: emptyFile
          };
          $scope.loader = false
          $scope.form.status = 'created'
          $scope.appendCount = response.data.count
          $scope.inCorrect = response.data.inCorrect
          $scope.inCorrectArr = response.data.incorrcetPartno
          $scope.notAdded = response.data.notAdded
          $scope.details = {
            count: $scope.appendCount,
            inCorrectArr: $scope.inCorrectArr,
            notAdded: $scope.notAdded,
          }

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.projects.details.addedproducts.modal.html',
            size: 'md',
            backdrop: true,
            resolve: {
              data: function() {
                return $scope.details;
              }
            },
            controller: function($scope, data, $uibModalInstance) {
              $scope.appendCount = data.count
              $scope.inCorrectArr = data.inCorrectArr
              $scope.notAdded = data.notAdded

              $uibModalInstance.dismiss();
            }
          })


          for (let i = 0; i < response.data.product.length; i++) {
            $scope.data.push({
              part_no: response.data.product[i].products.part_no,
              description_1: response.data.product[i].products.description_1,
              price: response.data.product[i].price,
              weight: response.data.product[i].products.weight,
              quantity1: response.data.product[i].quantity1,
              quotePrice: response.data.product[i].quotePrice,
              inrPrice: response.data.product[i].inrPrice,
              packing: response.data.product[i].packing,
              insurance: response.data.product[i].insurance,
              freight: response.data.product[i].freight,
              gst: response.data.product[i].gst,
              gstVal: response.data.product[i].gstVal,
              cif: response.data.product[i].cif,
              custom: response.data.product[i].custom,
              customVal: response.data.product[i].customVal,
              socialVal: response.data.product[i].socialVal,
              charge1: response.data.product[i].charge1,
              charge2: response.data.product[i].charge2,
              landed_price: response.data.product[i].landed_price,
              customs_no: response.data.product[i].customs_no
            });
            $scope.showButton = false

            $scope.data[$scope.data.length - 1].listPk = response.data.product[i].pk
            $scope.productpk.push(response.data.product[i]);
          }
          $scope.form.invoiceValue = $scope.form.invoiceValue + response.data.invoiceValue
          $scope.changeColor(response.data.productExist)


        })

      }

      $scope.change = function(query) {
        return $http.get('/api/importexport/products/?search=' + query).
        then(function(response) {
          return response.data;
        })
      };
      $scope.bomChange = function(query) {
        return $http.get('/api/importexport/bom/?limit=10&searchBom=' + query + '&project=' + $scope.form.pk).
        then(function(response) {
          return response.data.results;
        })
      };


      $scope.invoceSave = function() {
        console.log($scope.projects, "aaaaaa");
        $scope.form.invoiceValue = 0
        if ($scope.projects.length > 0) {
          for (var i = 0; i < $scope.projects.length; i++) {
            $scope.form.invoiceValue += ($scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2)))
          }
        }
        if ($scope.data.length > 0) {
          for (var i = 0; i < $scope.data.length; i++) {
            $scope.form.invoiceValue += ($scope.data[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[i].price) / 100 + $scope.data[i].price)))
          }
        }
        console.log($scope.form.invoiceValue, 'ddddddddd');
        var send = {
          invoiceValue: $scope.form.invoiceValue,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }


      $scope.projects = []

      $scope.changeQty = {
        partno: '',
        qty: 0,
        index: null
      }
      $scope.$watch('changeQty.partno', function(newValue, oldValue) {
        console.log(newValue, 'gggggggggggggg');
        if (typeof newValue == 'object' && newValue != 'undefined') {
          for (var i = 0; i < $scope.projects.length; i++) {
            if (newValue.pk == $scope.projects[i].pk) {
              $scope.projects[i].color = '#FFFF99'
              $scope.changeQty.qty = $scope.projects[i].quantity2
              $scope.changeQty.index = i
            }

          }
        } else {
          for (var i = 0; i < $scope.projects.length; i++) {
            $scope.projects[i].color = '#fff'
            $scope.changeQty.index = null
            $scope.changeQty.qty = 0
          }
        }

      }, true)
      $scope.updateQty = function() {
        if ($scope.changeQty.index == null) {
          Flash.create('warning', 'Select Product');
          return
        }
        $scope.projects[$scope.changeQty.index].quantity2 = $scope.changeQty.qty
        Flash.create('success', 'Qty Updated');
      }

      $scope.changeColor = function(arr) {
        console.log($scope.projects, $scope.data, 'existtttttttt');
        if ($scope.projects.length > 0) {
          for (let i = 0; i <= $scope.projects.length; i++) {
            if (arr.includes($scope.projects[i].pk)) {
              $scope.projects[i].color = '#FFFF99'
            }
          }
        }
        if ($scope.data.length > 0) {
          for (let i = 0; i <= $scope.data.length; i++) {
            if (arr.includes($scope.data[i].listPk)) {
              $scope.data[i].color = '#FFFF99'
            }
          }
        }
      }
      $scope.updateAll = function() {
        if ($scope.projects.length > 0) {
          console.log("EEEEEEEEEEEEEEEEE");

          for (var i = 0; i < $scope.projects.length; i++) {

            $scope.projects[i].quotePrice = parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2))
            $scope.projects[i].inrPrice = parseFloat(($scope.projects[i].quotePrice * $scope.form.exRate).toFixed(2))
            $scope.projects[i].packing = parseFloat(((($scope.form.packing / $scope.form.invoiceValue) * $scope.projects[i].inrPrice)).toFixed(2))
            $scope.projects[i].insurance = parseFloat(((($scope.form.insurance / $scope.form.invoiceValue) * $scope.projects[i].inrPrice)).toFixed(2))
            $scope.projects[i].freight = parseFloat(((($scope.form.freight / $scope.form.invoiceValue) * $scope.projects[i].inrPrice)).toFixed(2))
            $scope.projects[i].cif = parseFloat(($scope.projects[i].inrPrice + $scope.projects[i].packing + $scope.projects[i].insurance + $scope.projects[i].freight).toFixed(2))
            $scope.projects[i].customVal = parseFloat((($scope.projects[i].cif + (($scope.projects[i].cif * $scope.form.assessableValue) / 100)) * ($scope.projects[i].custom) / 100).toFixed(2))
            $scope.projects[i].socialVal = parseFloat(($scope.projects[i].customVal * 0.1).toFixed(2))
            $scope.projects[i].gstVal = parseFloat(($scope.projects[i].cif + $scope.projects[i].customVal + $scope.projects[i].socialVal) * ($scope.projects[i].gst) / 100).toFixed(2)
            $scope.projects[i].charge1 = parseFloat(($scope.projects[i].inrPrice * ($scope.form.clearingCharges1 / ($scope.form.invoiceValue * $scope.form.exRate))).toFixed(2))
            $scope.projects[i].charge2 = parseFloat(($scope.projects[i].inrPrice * ($scope.form.clearingCharges2 / ($scope.form.invoiceValue * $scope.form.exRate))).toFixed(2))
            $scope.projects[i].landed_price = (($scope.projects[i].cif + $scope.projects[i].customVal + $scope.projects[i].socialVal + $scope.projects[i].charge1 + $scope.projects[i].charge2).toFixed(2))
          }
        }
        if ($scope.data.length > 0) {
          console.log("FFFFFFFFFFFFFFFFFFFFFF");
          for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].quotePrice = parseFloat((($scope.form.profitMargin * $scope.data[i].price) / 100 + $scope.data[i].price).toFixed(2))
            $scope.data[i].inrPrice = parseFloat(($scope.data[i].quotePrice * $scope.form.exRate).toFixed(2))
            $scope.data[i].packing = parseFloat(((($scope.form.packing / $scope.form.invoiceValue) * $scope.data[i].inrPrice)).toFixed(2))
            $scope.data[i].insurance = parseFloat(((($scope.form.insurance / $scope.form.invoiceValue) * $scope.data[i].inrPrice)).toFixed(2))
            $scope.data[i].freight = parseFloat(((($scope.form.freight / $scope.form.invoiceValue) * $scope.data[i].inrPrice)).toFixed(2))
            $scope.data[i].cif = parseFloat(($scope.data[i].inrPrice + $scope.data[i].packing + $scope.data[i].insurance + $scope.data[i].freight).toFixed(2))
            $scope.data[i].customVal = parseFloat((($scope.data[i].cif + (($scope.data[i].cif * $scope.form.assessableValue) / 100)) * ($scope.data[i].custom) / 100).toFixed(2))
            $scope.data[i].socialVal = parseFloat(($scope.data[i].customVal * 0.1).toFixed(2))
            $scope.data[i].gstVal = parseFloat(($scope.data[i].cif + $scope.data[i].customVal + $scope.data[i].socialVal) * ($scope.data[i].gst) / 100).toFixed(2)
            $scope.data[i].charge1 = parseFloat(($scope.data[i].inrPrice * ($scope.form.clearingCharges1 / ($scope.form.invoiceValue * $scope.form.exRate))).toFixed(2))
            $scope.data[i].charge2 = parseFloat(($scope.data[i].inrPrice * ($scope.form.clearingCharges2 / ($scope.form.invoiceValue * $scope.form.exRate))).toFixed(2))
            $scope.data[i].landed_price = (($scope.data[i].cif + $scope.data[i].customVal + $scope.data[i].socialVal + $scope.data[i].charge1 + $scope.data[i].charge2).toFixed(2))
          }
        }
        $scope.invoceSave()
      }


      function sum(data) {
        if (data == $scope.materialIssue) {
          return data.map(function(m) {
            return m.qty * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        } else if (data == $scope.projects) {
          return data.map(function(m) {
            return m.quantity1 * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        }
      }


      $scope.materialIssue = []

      $scope.fetchMaterial = function() {
        $http({
          method: 'GET',
          url: '/api/importexport/material/?project=' + $scope.form.pk,
        }).
        then(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            for (var j = 0; j < response.data[i].materialIssue.length; j++) {
              $scope.materialIssue.push(response.data[i].materialIssue[j])
              $scope.materialSum = sum($scope.materialIssue)
            }
          }
        })
      }
      if ($scope.form.status == 'ongoing') {
        $scope.fetchMaterial()
      }


      $scope.fetchData = function() {
        $scope.data = []
        $http({
          method: 'GET',
          url: '/api/importexport/bom/?project=' + $scope.form.pk
        }).
        then(function(response) {
          $scope.projects = response.data
          $scope.purchaseSum = sum($scope.projects)
          var tot = 0
          var totweight = 0
          console.log($scope.purchaseSum, 'kkkkkkkkkkkkkkkkkk');
          $scope.form.invoiceValue = 0
          $scope.form.weightValue = 0
          for (var i = 0; i < $scope.projects.length; i++) {
            var totalprice = $scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2))
            tot += totalprice
            var weight = $scope.projects[i].products.weight * $scope.projects[i].quantity1
            totweight += weight
            console.log(totweight, 'aaaaaaaa');
          }
          $scope.form.invoiceValue = tot
          $scope.invoceSave()
          $scope.form.weightValue = totweight
          $scope.updateAll()
          $scope.showButton = true
          // $rootScope.allData =  $scope.projects

        })
      }



      $scope.productpk = []
      $scope.fetchData()
      $scope.$watch('projects', function(newValue, oldValue) {
        console.log(newValue, 'DDDDDDDDDDDDDDDDDDDD');
        // var cost = 0
        // var cost = $scope.form.invoiceValue
        for (var i = 0; i < newValue.length; i++) {
          if (typeof oldValue[i] == "undefined") {

          } else if (newValue[i].price != oldValue[i].price || newValue[i].quantity1 != oldValue[i].quantity1 || newValue[i].custom != oldValue[i].custom || newValue[i].gst != oldValue[i].gst || newValue[i].quantity2 != oldValue[i].quantity2 || newValue[i].landed_price !=
            oldValue[i].landed_price) {

            var dataSend = {
              quantity1: newValue[i].quantity1,
              price: newValue[i].price,
              custom: newValue[i].custom,
              gst: newValue[i].gst,
              landed_price: newValue[i].landed_price,
              quantity2: newValue[i].quantity2,

            }
            $http({
              method: 'PATCH',
              url: '/api/importexport/bom/' + newValue[i].pk + '/',
              data: dataSend
            }).
            then(function(response) {

            })
          }
        }
        $scope.updateAll()
      }, true)

      $scope.showbutton = false
      $scope.tableUpdate = function(newValue, oldValue) {
        var cost = 0
        var totweight = 0
        if (typeof newValue == 'undefined') {

        } else if (typeof newValue.part_no == 'object') {
          $scope.showButton = true
          if ($scope.data.length > 1) {
            for (var i = 0; i < $scope.data.length; i++) {
              if ($scope.data[i].pk == newValue.part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if ($scope.projects.length > 0) {
            for (var i = 0; i < $scope.projects.length; i++) {
              if ($scope.projects[i].products.pk == newValue.part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if (newValue.part_no.pk)
            $scope.data[$scope.data.length - 1] = newValue.part_no
          $scope.data[$scope.data.length - 1].quantity1 = 1
          var totalprice = $scope.data[$scope.data.length - 1].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[$scope.data.length - 1].price) / 100 + $scope.data[$scope.data.length - 1].price).toFixed(2))
          cost += totalprice
          $scope.form.invoiceValue += cost
          $scope.invoceSave()
          var weight = $scope.data[$scope.data.length - 1].weight * $scope.data[$scope.data.length - 1].quantity1
          totweight += weight
          $scope.form.weightValue += totweight
          $scope.updateAll()
          $scope.projectlist = []
          $scope.projectlist.push($scope.form.pk)
          var dataSend = {
            user: $scope.me.pk,
            products: $scope.data[$scope.data.length - 1].pk,
            project: $scope.form.pk,
            quantity1: 1,
            quantity2: 1,
            price: $scope.data[$scope.data.length - 1].price,
            landed_price: $scope.data[$scope.data.length - 1].landed_price,
            custom: $scope.data[$scope.data.length - 1].custom,
            gst: $scope.data[$scope.data.length - 1].gst,
            customs_no: $scope.data[$scope.data.length - 1].customs_no,

          }
          $http({
            method: 'POST',
            url: '/api/importexport/bom/',
            data: dataSend
          }).
          then(function(response) {
            $scope.data[$scope.data.length - 1].listPk = response.data.pk
            $scope.productpk.push(response.data);
            $scope.showbutton = true

            return
          })
        } else if (typeof $scope.data[$scope.data.length - 1].part_no == 'object') {
          if ($scope.data.length > 1) {
            for (var i = 0; i < $scope.data.length; i++) {
              if ($scope.data[i].pk == $scope.data[$scope.data.length - 1].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if ($scope.projects.length > 0) {
            for (var i = 0; i < $scope.projects.length; i++) {
              if ($scope.projects[i].products.pk == $scope.data[$scope.data.length - 1].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }

          $scope.showButton = true
          var cost = 0
          var totweight = 0
          cost = $scope.form.invoiceValue
          totweight = $scope.form.weightValue
          $scope.data[$scope.data.length - 1] = $scope.data[$scope.data.length - 1].part_no
          $scope.data[$scope.data.length - 1].quantity1 = 1
          var totalprice = $scope.data[$scope.data.length - 1].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[$scope.data.length - 1].price) / 100 + $scope.data[$scope.data.length - 1].price).toFixed(2))
          cost += totalprice
          $scope.form.invoiceValue = cost
          $scope.invoceSave()
          var weight = $scope.data[$scope.data.length - 1].weight * $scope.data[$scope.data.length - 1].quantity1
          totweight += weight
          $scope.form.weightValue = totweight
          $scope.updateAll()
          $scope.projectlist = []
          $scope.projectlist.push($scope.form.pk)
          var dataSend = {
            user: $scope.me.pk,
            products: $scope.data[$scope.data.length - 1].pk,
            project: $scope.form.pk,
            quantity1: 1,
            quantity2: 1,
            price: $scope.data[$scope.data.length - 1].price,
            landed_price: $scope.data[$scope.data.length - 1].landed_price,
            custom: $scope.data[$scope.data.length - 1].custom,
            gst: $scope.data[$scope.data.length - 1].gst,
            customs_no: $scope.data[$scope.data.length - 1].customs_no,

          }
          $http({
            method: 'POST',
            url: '/api/importexport/bom/',
            data: dataSend
          }).
          then(function(response) {
            $scope.data[$scope.data.length - 1].listPk = response.data.pk
            $scope.productpk.push(response.data);
            return
          })
        } else {

          var cost = $scope.form.invoiceValue
          var totweight = $scope.form.weightValue
          for (var i = 0; i < newValue.length; i++) {
            if (newValue[i].listPk) {
              if (newValue[i].quantity1 == '') {
                var newQty = 0
              } else {
                var newQty = newValue[i].quantity1
              }
              if (oldValue[i].quantity1 == '') {
                var oldQty = 0
              } else {
                var oldQty = oldValue[i].quantity1
              }

              var oldtotalprice = oldQty * parseFloat((($scope.form.profitMargin * oldValue[i].price) / 100 + oldValue[i].price).toFixed(2))
              cost -= oldtotalprice
              var totalprice = newQty * parseFloat((($scope.form.profitMargin * newValue[i].price) / 100 + newValue[i].price).toFixed(2))
              cost += totalprice



              var oldtotalweight = oldValue[i].weight * oldQty
              totweight -= oldtotalweight

              var newtotweight = newValue[i].weight * newQty
              totweight += newtotweight




              if (newValue[i].quantity1 != oldValue[i].quantity1 || newValue[i].landed_price != oldValue[i].landed_price || newValue[i].custom != oldValue[i].custom || newValue[i].gst != oldValue[i].gst) {

                $scope.updateAll()
                var dataSend = {
                  quantity1: newValue[i].quantity1,
                  quantity2: newValue[i].quantity1,
                  price: newValue[i].price,
                  landed_price: newValue[i].landed_price,
                  custom: newValue[i].custom,
                  gst: newValue[i].gst,
                  customs_no: newValue[i].customs_no,
                }
                $http({
                  method: 'PATCH',
                  url: '/api/importexport/bom/' + newValue[i].listPk + '/',
                  data: dataSend
                }).
                then(function(response) {
                  $scope.form.invoiceValue = cost
                  $scope.form.weightValue = totweight

                })
              }
            }
          }
          $scope.form.invoiceValue = cost
          $scope.form.weightValue = totweight
          $scope.invoceSave()
          return
        }
      }
      $scope.$watch('data', function(newValue, oldValue) {
        console.log($scope.data, 'yyyyyyyyyy');
        var cost = 0
        var totweight = 0
        if (typeof newValue[0] == 'undefined') {

        } else if (typeof newValue[0].part_no == 'object') {
          $scope.showButton = true
          if ($scope.data.length > 1) {
            for (var i = 0; i < $scope.data.length; i++) {
              if ($scope.data[i].pk == newValue[0].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if ($scope.projects.length > 0) {
            for (var i = 0; i < $scope.projects.length; i++) {
              if ($scope.projects[i].products.pk == newValue[0].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if (newValue[0].part_no.pk)
            $scope.data[$scope.data.length - 1] = newValue[0].part_no
          $scope.data[$scope.data.length - 1].quantity1 = 1
          var totalprice = $scope.data[$scope.data.length - 1].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[$scope.data.length - 1].price) / 100 + $scope.data[$scope.data.length - 1].price).toFixed(2))
          cost += totalprice
          $scope.form.invoiceValue += cost
          $scope.invoceSave()
          var weight = $scope.data[$scope.data.length - 1].weight * $scope.data[$scope.data.length - 1].quantity1
          totweight += weight
          $scope.form.weightValue += totweight
          $scope.updateAll()
          $scope.projectlist = []
          $scope.projectlist.push($scope.form.pk)
          var dataSend = {
            user: $scope.me.pk,
            products: $scope.data[$scope.data.length - 1].pk,
            project: $scope.form.pk,
            quantity1: 1,
            quantity2: 1,
            price: $scope.data[$scope.data.length - 1].price,
            landed_price: $scope.data[$scope.data.length - 1].landed_price,
            custom: $scope.data[$scope.data.length - 1].custom,
            gst: $scope.data[$scope.data.length - 1].gst,
            customs_no: $scope.data[$scope.data.length - 1].customs_no,

          }
          $http({
            method: 'POST',
            url: '/api/importexport/bom/',
            data: dataSend
          }).
          then(function(response) {
            $scope.data[$scope.data.length - 1].listPk = response.data.pk
            $scope.productpk.push(response.data);
            $scope.showbutton = true

            return
          })
        } else if (typeof $scope.data[$scope.data.length - 1].part_no == 'object') {
          if ($scope.data.length > 1) {
            for (var i = 0; i < $scope.data.length; i++) {
              if ($scope.data[i].pk == $scope.data[$scope.data.length - 1].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }
          if ($scope.projects.length > 0) {
            for (var i = 0; i < $scope.projects.length; i++) {
              if ($scope.projects[i].products.pk == $scope.data[$scope.data.length - 1].part_no.pk) {
                Flash.create('danger', 'Product already added');
                return
              }
            }
          }

          $scope.showButton = true
          var cost = 0
          var totweight = 0
          cost = $scope.form.invoiceValue
          totweight = $scope.form.weightValue
          $scope.data[$scope.data.length - 1] = $scope.data[$scope.data.length - 1].part_no
          $scope.data[$scope.data.length - 1].quantity1 = 1
          var totalprice = $scope.data[$scope.data.length - 1].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[$scope.data.length - 1].price) / 100 + $scope.data[$scope.data.length - 1].price).toFixed(2))
          cost += totalprice
          $scope.form.invoiceValue = cost
          $scope.invoceSave()
          var weight = $scope.data[$scope.data.length - 1].weight * $scope.data[$scope.data.length - 1].quantity1
          totweight += weight
          $scope.form.weightValue = totweight
          $scope.updateAll()
          $scope.projectlist = []
          $scope.projectlist.push($scope.form.pk)
          var dataSend = {
            user: $scope.me.pk,
            products: $scope.data[$scope.data.length - 1].pk,
            project: $scope.form.pk,
            quantity1: 1,
            quantity2: 1,
            price: $scope.data[$scope.data.length - 1].price,
            landed_price: $scope.data[$scope.data.length - 1].landed_price,
            custom: $scope.data[$scope.data.length - 1].custom,
            gst: $scope.data[$scope.data.length - 1].gst,
            customs_no: $scope.data[$scope.data.length - 1].customs_no,

          }
          $http({
            method: 'POST',
            url: '/api/importexport/bom/',
            data: dataSend
          }).
          then(function(response) {
            $scope.data[$scope.data.length - 1].listPk = response.data.pk
            $scope.productpk.push(response.data);
            return
          })
        } else {

          var cost = $scope.form.invoiceValue
          var totweight = $scope.form.weightValue
          for (var i = 0; i < newValue.length; i++) {
            if (newValue[i].listPk) {
              if (newValue[i].quantity1 == '') {
                var newQty = 0
              } else {
                var newQty = newValue[i].quantity1
              }
              if (oldValue[i].quantity1 == '') {
                var oldQty = 0
              } else {
                var oldQty = oldValue[i].quantity1
              }

              var oldtotalprice = oldQty * parseFloat((($scope.form.profitMargin * oldValue[i].price) / 100 + oldValue[i].price).toFixed(2))
              cost -= oldtotalprice
              var totalprice = newQty * parseFloat((($scope.form.profitMargin * newValue[i].price) / 100 + newValue[i].price).toFixed(2))
              cost += totalprice



              var oldtotalweight = oldValue[i].weight * oldQty
              totweight -= oldtotalweight

              var newtotweight = newValue[i].weight * newQty
              totweight += newtotweight




              if (newValue[i].quantity1 != oldValue[i].quantity1 || newValue[i].landed_price != oldValue[i].landed_price || newValue[i].custom != oldValue[i].custom || newValue[i].gst != oldValue[i].gst) {

                $scope.updateAll()
                var dataSend = {
                  quantity1: newValue[i].quantity1,
                  quantity2: newValue[i].quantity1,
                  price: newValue[i].price,
                  landed_price: newValue[i].landed_price,
                  custom: newValue[i].custom,
                  gst: newValue[i].gst,
                  customs_no: newValue[i].customs_no,
                }
                $http({
                  method: 'PATCH',
                  url: '/api/importexport/bom/' + newValue[i].listPk + '/',
                  data: dataSend
                }).
                then(function(response) {
                  $scope.form.invoiceValue = cost
                  $scope.form.weightValue = totweight

                })
              }
            }
          }
          $scope.form.invoiceValue = cost
          $scope.form.weightValue = totweight
          $scope.invoceSave()
          return
        }
      }, true)



      $scope.deleteTable = function(val, index) {
        if (val != undefined) {
          $http({
            method: 'DELETE',
            url: '/api/importexport/bom/' + val + '/'
          }).
          then(function(response) {
            $scope.data = []
            $scope.fetchData()
            Flash.create('success', 'Deleted');

            return
          })

        } else {
          $scope.data = []
          $scope.fetchData()

          return
        }
      };

      $scope.deleteData = function(pk, index, price, qty) {

        $http({
          method: 'DELETE',
          url: '/api/importexport/bom/' + pk + '/'
        }).
        then(function(response) {

          $scope.data = []
          $scope.fetchData()
          Flash.create('success', 'Deleted');

          return

        })

      }

      $scope.save = function() {
        for (var i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].user.length == 0) {
            Flash.create('warning', 'Please Remove Empty Rows');
            return
          }
        }
        for (var i = 0; i < $scope.data.length; i++) {
          var url = '/api/importexport/bom/'
          var method = 'POST';
          if ($scope.data[i].pk != undefined) {
            url += $scope.data[i].pk + '/'
            method = 'PATCH';
          }
          var toSend = {
            user: $scope.data[i].user,
            products: $scope.data[i].products,
            project: $scope.form.pk,

          }
          $http({
            method: method,
            url: url,
            data: toSend
          }).
          then((function(i) {
            return function(response) {
              $scope.bomData.push(response.data)
              if (i == $scope.data.length - 1) {
                Flash.create('success', 'Saved');
                $scope.data = []
              }
            }
          })(i))
        }

      }
      $scope.revision = function() {
        var send = {
          revision: $scope.form.revision,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.saveCurrency = function() {
        var send = {
          currency: $scope.form.currency,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.validity = function() {
        var send = {
          quoteValidity: $scope.form.quoteValidity,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.incoTerms = function() {
        var send = {
          terms: $scope.form.terms,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.incoTermsPo = function() {
        console.log("eeeeeeeeeeeeeeee");
        var send = {
          termspo: $scope.form.termspo,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.deliverySave = function() {
        console.log($scope.form.delivery)
        var send = {
          delivery: $scope.form.delivery,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }



      $scope.paymentSave = function() {
        var send = {
          paymentTerms: $scope.form.paymentTerms,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.paymentSavePO = function() {
        var send = {
          paymentTerms1: $scope.form.paymentTerms1,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.shipmentModeSave = function() {
        var send = {
          shipmentMode: $scope.form.shipmentMode,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.shipmentDetails = function() {
        var send = {
          shipmentDetails: $scope.form.shipmentDetails,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.quoteNotesDetails = function() {
        var send = {
          quoteNotes: $scope.form.quoteNotes,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.poNotesDetails = function() {
        var send = {
          poNotes: $scope.form.poNotes,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }


      $scope.sendForApproval = function() {


        var date = new Date().toJSON().split('T')[0]
        var sendStatus = {
          status: 'sent_for_approval',
          weightValue: $scope.form.weightValue.toFixed(2),
          approved1: true,
          approved1_user: $scope.me.pk,
          approved1_date: date
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: sendStatus,
        }).
        then(function(response) {
          $scope.form.status = response.data.status
          $scope.updateStatus()
          Flash.create('success', 'Saved');
          $scope.fetchData()
          link = window.location

          $http({
            method: 'POST',
            url: '/api/importexport/sendEmail/',
            data: {
              'pkValue': $scope.form.pk,
              'link': link
            },
          }).
          then(function(response) {
            Flash.create('success', 'Email Sent');
          })
        })
      }


      $scope.poChange = function() {
        var send = {
          poNumber: $scope.form.poNumber,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })
      }

      $scope.poDateChange = function() {
        console.log($scope.form.poDate, 'aaaaaaaaa');
        var send = {
          poDate: $scope.form.poDate.toJSON().split('T')[0],
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })
      }





      $scope.quoteChange = function() {
        var send = {
          quoteRefNumber: $scope.form.quoteRefNumber,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })

      }

      $scope.quoteDateChange = function() {
        console.log($scope.form.poDate, 'aaaaaaaaa');
        var send = {
          quoteDate: $scope.form.quoteDate.toJSON().split('T')[0],
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })
      }


      $scope.invoiceChange = function() {
        var send = {
          invoiceNumber: $scope.form.invoiceNumber,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })
      }



      $scope.boeChange = function() {
        var send = {
          boeRefNumber: $scope.form.boeRefNumber,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          return
        })

      }


      $scope.packingChange = function() {

        var send = {
          packing: $scope.form.packing,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })

      }



      $scope.assemblyValChange = function() {
        var send = {
          assessableValue: $scope.form.assessableValue,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })

      }


      $scope.insuranceChange = function() {
        var send = {
          insurance: $scope.form.insurance,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }

      $scope.freightChange = function() {
        var send = {
          freight: $scope.form.freight,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }
      $scope.clearingchar1Change = function() {
        var send = {
          clearingCharges1: $scope.form.clearingCharges1,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }
      $scope.clearingchar2Change = function() {
        var send = {
          clearingCharges2: $scope.form.clearingCharges2,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }

      $scope.exrateChange = function() {
        var send = {
          exRate: $scope.form.exRate,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }
      $scope.profitmarginChange = function() {
        var send = {
          profitMargin: $scope.form.profitMargin,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {
          $scope.updateAll()
        })
      }

      $scope.accept = function() {
        var date = new Date().toJSON().split('T')[0]
        var sendStatus = {
          status: 'approved',
          approved1: true,
          approved1_user: $scope.me.pk,
          approved1_date: date
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: sendStatus,
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
          $scope.form.status = response.data.status
          $scope.updateStatus()
          $scope.fetchData()
        })
      }

      $scope.reject = function() {
        var sendStatus = {
          status: 'created',
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: sendStatus,
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
          $scope.form.status = response.data.status
          $scope.updateStatus()
          $scope.data = []
        })
      }

      $scope.send = function() {
        dateVal = new Date()
        console.log(dateVal, 'aaaa');
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: {
            status: 'ongoing',
            grnDate: dateVal.toJSON().split('T')[0]
          },
        }).
        then(function(response) {
          console.log($scope.projects);
          $http({
            method: 'POST',
            url: '/api/importexport/bulkCreateInventory/',
            data: {
              'project': $scope.form.pk
            },
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
          })

          $scope.form.status = response.data.status
          $scope.updateStatus()
          $scope.fetchMaterial()

        })
      }

      $scope.archieve = function() {
        var sendStatus = {
          savedStatus: true,

        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: sendStatus,
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
        })

      }

      $scope.invoiceAdd = function() {

        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.projects.invoice.modal.form.html',
          size: 'xl',
          backdrop: false,
          resolve: {
            data: function() {
              return $scope.form;
            }
          },
          controller: function($scope, data, $uibModalInstance, $timeout) {
            $scope.data = data
            console.log($scope.data, 'aaaaaaaa');
            $scope.fetchData = function() {
              $http({
                method: 'GET',
                url: '/api/importexport/iminvoiceQty/?invoice=' + $scope.form.pk
              }).
              then(function(response) {
                $scope.products = response.data
              })
            }
            $scope.resetData = function() {
              $scope.products = []
              $scope.form = {
                invoiceNumber: $scope.data.invoiceNumber,
                invoiceDate: new Date(),
                poNumber: $scope.data.poNumber,
                insuranceNumber: '',
                transporter: '',
                lrNo: '',
                billName: '',
                shipName: '',
                billAddress: '',
                shipAddress: '',
                billGst: '',
                shipGst: '',
                billState: '',
                billCode: '',
                shipState: '',
                shipCode: '',
                isDetails: false,
                invoiceTerms: ''
              }
            }
            $scope.form = {}
            $scope.products = []
            $http({
              method: 'GET',
              url: '/api/importexport/iminvoice/?project=' + $scope.data.pk
            }).
            then(function(response) {
              console.log(response.data);
              if (response.data.length == 1) {
                $scope.form = response.data[0]
                $scope.products = []
                $scope.fetchData()
              } else {
                $scope.resetData()
              }
            })

            $scope.$watch('form.isDetails', function(newValue, oldValue) {
              if (newValue == true) {
                $scope.form.shipName = $scope.form.billName
                $scope.form.shipAddress = $scope.form.billAddress
                $scope.form.shipGst = $scope.form.billGst
                $scope.form.shipState = $scope.form.billState
                $scope.form.shipCode = $scope.form.billCode
              } else {
                $scope.form.shipName = ''
                $scope.form.shipAddress = ''
                $scope.form.shipGst = ''
                $scope.form.shipState = ''
                $scope.form.shipCode = ''
              }
            })
            $scope.addTableRow = function(indx) {
              if ($scope.products.length > 0) {
                var obj = $scope.products[$scope.products.length - 1]
                if (obj.part_no.length == 0) {
                  Flash.create('danger', 'Please Fill Previous Row Data')
                  return
                }
              }
              $scope.products.push({
                part_no: '',
                description_1: '',
                qty: 0,
                customs_no: '',
                price: 0,
                taxableprice: 0,
                cgst: 0,
                cgstVal: 0,
                sgst: 0,
                sgstVal: 0,
                igst: 0,
                igstVal: 0,
                total: 0
              });
            }
            $scope.deleteData = function(pkVal, idx) {
              console.log(pkVal, idx);
              if (pkVal == undefined) {
                $scope.products.splice(idx, 1)
                return
              } else {
                $http({
                  method: 'DELETE',
                  url: '/api/importexport/iminvoiceQty/' + pkVal + '/'
                }).
                then(function(response) {
                  $scope.products.splice(idx, 1)
                  Flash.create('success', 'Deleted Successfully')
                  return
                })
              }
            }
            $scope.close = function() {
              $uibModalInstance.dismiss();
            }


            $scope.productSearch = function(query) {
              return $http.get('/api/importexport/products/?limit=10&search=' + query).
              then(function(response) {
                return response.data.results;
              })
            };

            $scope.calculate = function() {
              for (var i = 0; i < $scope.products.length; i++) {
                console.log($scope.gstcode, $scope.gstCal, 'kkkkkkkkkkkkkkkkkkk');
                if ($scope.gstcode === $scope.gstCal) {
                  $scope.products[i].cgst = 9
                  $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
                  $scope.products[i].sgst = 9
                  $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
                  $scope.products[i].igst = 0
                  $scope.products[i].igstVal = 0
                } else {
                  $scope.products[i].cgst = 0
                  $scope.products[i].cgstVal = 0
                  $scope.products[i].sgst = 0
                  $scope.products[i].sgstVal = 0
                  $scope.products[i].igst = 18
                  $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
                }
                $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
              }
            }


            var gstData = '29AABCB6326Q1Z6'
            $scope.$watch('form.billGst', function(newValue, oldValue) {
              if (newValue != undefined) {
                $scope.gstcode = gstData.substring(0, 2)
                $scope.gstCal = newValue.substring(0, 2)
                $scope.form.billCode = newValue.substring(0, 2)
                $scope.calculate()
              }
            })
            $scope.$watch('form.shipCode', function(newValue, oldValue) {
              if (newValue != undefined) {
                $scope.form.shipCode = newValue.substring(0, 2)
              }
            })




            $scope.$watch('products', function(newValue, oldValue) {
              var pkList = []
              for (var i = 0; i < newValue.length; i++) {
                if (typeof newValue[i].part_no == 'object') {
                  var ppk = newValue[i].part_no.pk
                  delete newValue[i].part_no.pk
                  if (pkList.indexOf(newValue[i].part_no.part_no) >= 0) {
                    newValue[i].part_no = ''
                    Flash.create('danger', 'This Product Has Already Added')
                    return
                  } else {
                    pkList.push(newValue[i].part_no.part_no)
                  }
                  $scope.products[i] = newValue[i].part_no
                  $scope.products[i].product = ppk
                  $scope.products[i].qty = 1
                  $scope.products[i].taxableprice = parseFloat((newValue[i].part_no.price * $scope.products[i].qty).toFixed(2))
                  $scope.calculate()
                } else {
                  pkList.push(newValue[i].part_no)
                  $scope.products[i].price = parseFloat(newValue[i].price)
                  $scope.products[i].taxableprice = parseFloat((newValue[i].price * newValue[i].qty).toFixed(2))
                  $scope.products[i].cgst = newValue[i].cgst
                  $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
                  $scope.products[i].sgst = newValue[i].sgst
                  $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
                  $scope.products[i].igst = newValue[i].igst
                  $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
                  $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
                }
              }

            }, true)


            $scope.saveInvoice = function() {
              if ($scope.form.invoiceNumber == null || $scope.form.invoiceNumber.length == 0) {
                Flash.create('danger', 'Invoice No. Is Required')
                return
              }
              if ($scope.data.pk) {
                $scope.form.project = $scope.data.pk
              }

              var method = 'POST'
              var url = '/api/importexport/iminvoice/'

              if ($scope.form.pk) {
                method = 'PATCH'
                url += $scope.form.pk + '/'
              }
              if (typeof $scope.form.invoiceDate == 'object') {
                $scope.form.invoiceDate = $scope.form.invoiceDate.toJSON().split('T')[0]
              }
              $http({
                method: method,
                url: url,
                data: $scope.form,
              }).
              then(function(response) {
                console.log(response.data);
                for (var i = 0; i < $scope.products.length; i++) {
                  if ($scope.products[i].description_1.length > 0) {
                    if (!$scope.products[i].pk) {
                      var sendVal = {
                        product: $scope.products[i].product,
                        invoice: response.data.pk,
                        part_no: $scope.products[i].part_no,
                        description_1: $scope.products[i].description_1,
                        customs_no: $scope.products[i].customs_no,
                        price: $scope.products[i].price,
                        qty: $scope.products[i].qty,
                        taxableprice: $scope.products[i].taxableprice,
                        cgst: $scope.products[i].cgst,
                        cgstVal: $scope.products[i].cgstVal,
                        sgst: $scope.products[i].sgst,
                        sgstVal: $scope.products[i].sgstVal,
                        igst: $scope.products[i].igst,
                        igstVal: $scope.products[i].igstVal,
                        total: $scope.products[i].total,
                      }
                      var url = '/api/importexport/iminvoiceQty/'
                      var method = 'POST'
                    } else {
                      var sendVal = {
                        product: $scope.products[i].product.pk,
                        invoice: response.data.pk,
                        part_no: $scope.products[i].part_no,
                        description_1: $scope.products[i].description_1,
                        customs_no: $scope.products[i].customs_no,
                        price: $scope.products[i].price,
                        qty: $scope.products[i].qty,
                        taxableprice: $scope.products[i].taxableprice,
                        cgst: $scope.products[i].cgst,
                        cgstVal: $scope.products[i].cgstVal,
                        sgst: $scope.products[i].sgst,
                        sgstVal: $scope.products[i].sgstVal,
                        igst: $scope.products[i].igst,
                        igstVal: $scope.products[i].igstVal,
                        total: $scope.products[i].total,
                      }
                      var url = '/api/importexport/iminvoiceQty/' + $scope.products[i].pk + '/'
                      var method = 'PATCH'
                    }
                    $http({
                      method: method,
                      url: url,
                      data: sendVal,
                    }).
                    then((function(i) {
                      return function(response) {
                        $scope.products[i].pk = response.data.pk;
                      }
                    })(i))
                  }
                }
                $timeout(function() {
                  Flash.create('success', 'Saved');
                }, 1500);
              })
            }

          }, //----controller ends
        }).result.then(function(f) {
          $scope.fetchData();
        }, function(f) {
          if (typeof f == 'object') {
            $scope.form.service = f
          }
        });
      }

    })
  }


})

app.controller("businessManagement.importexport.projects.invoice", function($scope, $state, $users, $stateParams, $http, Flash) {


})

app.controller("businessManagement.importexport.projects.archieve.explore", function($scope, $state, $users, $stateParams, $http, Flash) {

  if ($state.is('businessManagement.importexport.archiveprojectView')) {
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMM", $stateParams.id);
    $http({
      url: '/api/importexport/projects/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      console.log($scope.form);
      $scope.projects = []
      $scope.materialIssue = []

      function sum(data) {
        if (data == $scope.materialIssue) {
          return data.map(function(m) {
            return m.qty * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        } else if (data == $scope.projects) {
          return data.map(function(m) {
            return m.quantity1 * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        }
      }
      $scope.invoceSave = function() {
        console.log("herrrrrrrrr");
        $scope.form.invoiceValue = 0
        if ($scope.projects.length > 0) {
          for (var i = 0; i < $scope.projects.length; i++) {
            $scope.form.invoiceValue += ($scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2)))
          }
        }
        if ($scope.data.length > 0) {
          for (var i = 0; i < $scope.data.length; i++) {
            $scope.form.invoiceValue += ($scope.data[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[i].price) / 100 + $scope.data[i].price).toFixed(2)))
          }
        }
        console.log($scope.form.invoiceValue, 'ssssssssssssssjjjjj');
        var send = {
          invoiceValue: $scope.form.invoiceValue,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }

      $scope.fetchData = function() {

        $http({
          method: 'GET',
          url: '/api/importexport/bom/?project=' + $scope.form.pk
        }).
        then(function(response) {
          $scope.projects = response.data
          $scope.purchaseSum = sum($scope.projects)
          var tot = 0
          var totweight = 0
          console.log($scope.purchaseSum, 'kkkkkkkkkkkkkkkkkk');
          $scope.form.invoiceValue = 0
          for (var i = 0; i < $scope.projects.length; i++) {
            var totalprice = $scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2))
            tot += totalprice
            var weight = $scope.projects[i].products.weight * $scope.projects[i].quantity1
            totweight += weight
          }
          $scope.form.invoiceValue = tot
          $scope.invoceSave()
          $scope.form.weightValue = totweight.toFixed(2)
          console.log($scope.form.weightValue, 'aaaaaaaaaaaaaa');

          // $scope.updateAll()
          // $rootScope.allData =  $scope.projects

        })
      }

      $scope.fetchMaterial = function() {
        $http({
          method: 'GET',
          url: '/api/importexport/material/?project=' + $scope.form.pk,
        }).
        then(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            console.log(response.data, 'jjjjjjjjjjjjj');
            for (var j = 0; j < response.data[i].materialIssue.length; j++) {
              $scope.materialIssue.push(response.data[i].materialIssue[j])
              $scope.materialSum = sum($scope.materialIssue)
            }
          }
        })
      }



      $scope.fetchData()
      $scope.fetchMaterial()
    })
  }
  // $scope.form = $scope.data.archieveData[$scope.tab.data.index]


})

app.controller("businessManagement.importexport.projects.junk.explore", function($scope, $state, $users, $stateParams, $http, Flash) {


  if ($state.is('businessManagement.importexport.junkprojectView')) {
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMM", $stateParams.id);
    $http({
      url: '/api/importexport/projects/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      console.log($scope.form);
      $scope.projects = []
      $scope.materialIssue = []


      function sum(data) {
        if (data == $scope.materialIssue) {
          return data.map(function(m) {
            return m.qty * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        } else if (data == $scope.projects) {
          return data.map(function(m) {
            return m.quantity1 * m.price
          }).reduce(function(a, b) {
            return a + b
          }, 0)
        }
      }

      $scope.invoceSave = function() {
        $scope.form.invoiceValue = 0
        if ($scope.projects.length > 0) {
          for (var i = 0; i < $scope.projects.length; i++) {
            $scope.form.invoiceValue += ($scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2)))
          }
        }
        if ($scope.data.length > 0) {
          for (var i = 0; i < $scope.data.length; i++) {
            $scope.form.invoiceValue += ($scope.data[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.data[i].price) / 100 + $scope.data[i].price).toFixed(2)))
          }
        }
        console.log("aaaaaa");
        var send = {
          invoiceValue: $scope.form.invoiceValue,
        }
        $http({
          method: 'PATCH',
          url: '/api/importexport/projects/' + $scope.form.pk + '/',
          data: send,
        }).
        then(function(response) {})
      }
      $scope.fetchData = function() {

        $http({
          method: 'GET',
          // url: '/api/importexport/bom/?project=' + $scope.form.pk
          url: '/api/importexport/bom/?project=' + $scope.form.pk

        }).
        then(function(response) {
          $scope.projects = response.data
          $scope.purchaseSum = sum($scope.projects)
          var tot = 0
          var totweight = 0
          console.log($scope.purchaseSum, 'kkkkkkkkkkkkkkkkkk');
          $scope.form.invoiceValue = 0
          for (var i = 0; i < $scope.projects.length; i++) {
            var totalprice = $scope.projects[i].quantity1 * parseFloat((($scope.form.profitMargin * $scope.projects[i].price) / 100 + $scope.projects[i].price).toFixed(2))
            tot += totalprice
            var weight = $scope.projects[i].products.weight * $scope.projects[i].quantity1
            totweight += weight
          }
          $scope.form.invoiceValue = tot
          $scope.invoceSave()
          $scope.form.weightValue = totweight.toFixed(2)

          // $scope.updateAll()
          // $rootScope.allData =  $scope.projects

        })
      }

      $scope.fetchMaterial = function() {
        $http({
          method: 'GET',
          url: '/api/importexport/material/?project=' + $scope.form.pk,
        }).
        then(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            console.log(response.data, 'jjjjjjjjjjjjj');
            for (var j = 0; j < response.data[i].materialIssue.length; j++) {
              $scope.materialIssue.push(response.data[i].materialIssue[j])
              $scope.materialSum = sum($scope.materialIssue)
            }
          }
        })
      }
      $scope.fetchData()
      $scope.fetchMaterial()
    })

  }
}) //----------------------------------projects1-------------------------------------------------
app.controller("businessManagement.importexport.masterSheet", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {


  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: '',
    part_no: ''
  }
  $scope.fetchData = function() {
    $scope.true = 'true'
    let url = '/api/importexport/products/?limit=' + $scope.limit + '&offset=' + $scope.offset
    console.log($scope.search.query, "$scope.search.query");
    if ($scope.search.part_no.length>0) {
      url = url + '&search=' + $scope.search.part_no
    }
    console.log(url, 'url');
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results
      $scope.count = response.data.count
      console.log($scope.allData, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    })
  }
  $scope.fetchData()


  $scope.productResetFunction = function() {
    $scope.search.part_no = ''
    $scope.search.query = ''
    $scope.fetchData()
  }

  $scope.getCount = function() {
    return $http({
      method: 'GET',
      url: '/api/importexport/products/',
    }).
    then(function(response) {
      $scope.productCount = response.data.length
    }, function(response) {
      $scope.productCount = 0
    })
  }
  $scope.getCount()
  $scope.updateData = function() {
    console.log($scope.form.product, 'hhhhhh');
    if (typeof $scope.form.product == 'object') {
      $scope.$broadcast('tablefilter', $scope.form.product.part_no);
    } else {
      $scope.$broadcast('tablefilter', '');
    }
  }

  $scope.$watch('search.query', function(newValue, oldValue) {
    if (typeof newValue == 'object' && newValue != oldValue) {
      console.log('changeeddd', newValue.part_no);
      $scope.search.part_no = newValue.part_no
      $scope.fetchData()
    }
  });

  $scope.productSearch = function(query) {
    return $http.get('/api/importexport/products/?offset=0&limit=20&search=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.tableAction = function(target, action, data) {
    if (action == 'upload') {
      $scope.uploadProduct()
    } else if (action == 'update') {
      $scope.updateProduct()
    } else if (action == 'submitForm') {
      var method = 'PATCH'
      var url = '/api/importexport/products/' + data.pk + '/'
      var send = data
      $http({
        method: method,
        url: url,
        data: send,
      }).
      then(function(response) {
        $scope.$broadcast('forceGenericTableRowRefresh', response.data);
        Flash.create('success', response.status + ' : ' + response.statusText);
      }, function(response) {
        Flash.create('danger', response.status + ' : ' + response.statusText);
      })
    } else {
      var method = 'POST'
      var url = '/api/importexport/products/'
      var send = data
      $http({
        method: method,
        url: url,
        data: send,
      }).
      then(function(response) {
        $scope.$broadcast('forceInsetTableData', response.data);
        Flash.create('success', response.status + ' : ' + response.statusText);
      }, function(response) {
        Flash.create('danger', response.status + ' : ' + response.statusText);
      })
    }
  }
  $scope.uploadProduct = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.masterSheet.products.html',
      size: 'md',
      backdrop: false,
      controller: function($scope, $uibModalInstance) {
        $scope.updateFlag = false
        $scope.form = {
          sheet: emptyFile
        }
        $scope.upload = false

        $scope.uploadSheet = function() {

          if ($scope.form.sheet == emptyFile) {
            Flash.create('warning', 'Please Select File');
            return
          } else {
            Flash.create('success', 'Sheet is Uploading, Please Wait');
            $rootScope.loader = true
          }

          var fd = new FormData();
          fd.append('excelFile', $scope.form.sheet);

          $http({
            method: 'POST',
            url: 'api/importexport/ProductsUpload/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            $scope.form = {
              sheet: emptyFile
            };
            console.log(response, 'aaaaaa');
            $scope.appendCount = response.data.count
            $scope.upload = true
            Flash.create('success', 'Saved')
            $scope.getCount = function() {
              return $http({
                method: 'GET',
                url: '/api/importexport/products/',
              }).
              then(function(response) {
                $scope.productCount = response.data.length
              }, function(response) {
                $scope.productCount = 0
              })
            }
            $scope.getCount()
            $rootScope.loader = false
            $scope.close = function() {
              $uibModalInstance.close();
            };

          })

        }

      },
    });
  }


  $scope.updateProduct = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.masterSheet.products.html',
      size: 'md',
      backdrop: false,
      controller: function($scope, $uibModalInstance) {
        $scope.form = {
          sheet: emptyFile
        }
        $scope.updateFlag = true
        $scope.update = false

        $scope.updateSheet = function() {

          if ($scope.form.sheet == emptyFile) {
            Flash.create('warning', 'Please Select File');
            return
          } else {
            Flash.create('success', 'Sheet is Updating, Please Wait');
            $rootScope.loader = true
          }

          var fd = new FormData();
          fd.append('excelFile', $scope.form.sheet);

          $http({
            method: 'POST',
            url: 'api/importexport/ProductsUpdate/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            $scope.form = {
              sheet: emptyFile
            };
            console.log(response, 'aaaaaa');
            $scope.appendCount = response.data.count
            $scope.notUpdated = response.data.notUpdated
            $scope.notUpdated_partNo = response.data.notUpdated_partNo
            console.log($scope.notUpdated_partNo, 'notupdated');
            $scope.update = true
            Flash.create('success', 'Updated')
            $scope.getCount = function() {
              return $http({
                method: 'GET',
                url: '/api/importexport/products/',
              }).
              then(function(response) {
                $scope.productCount = response.data.length
              }, function(response) {
                $scope.productCount = 0
              })
            }
            $scope.getCount()
            $rootScope.loader = false
            $scope.close = function() {
              $uibModalInstance.close();
            };
            $timeout(function() {
              $uibModalInstance.dismiss();
            }, 10000);
          })

        }

      },
    });
  }




})


app.controller('businessManagement.importexport.masterSheet.newProduct', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $rootScope, $stateParams,$users) {
  $scope.me = $users.get('mySelf');
  if ($state.is('businessManagement.importexport.editmasterSheet')) {
    $http({
      method: 'GET',
      url: '/api/importexport/products/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.data = response.data
      console.log($scope.data, "BBBBBBBBBBBB");
    })
    console.log($stateParams.id);
    $scope.mode = ''
    $scope.data = {
      part_no: '',
      description_1: '',
      description_2: '',
      weight: 0,
      price: 0,
      customs_no: '',
      gst: 18,
      custom: 7.5,
      bar_code: '',
      division: $scope.me.designation.division
    }
    var method = 'PATCH'
    var url = '/api/importexport/products/' + $stateParams.id + '/'
    console.log($scope.data, 'nnnnnnnn');
    $scope.saveProduct = function() {
      $http({
        method: method,
        url: url,
        data: $scope.data,
      }).
      then(function(response) {
        $scope.$broadcast('forceGenericTableRowRefresh', response.data);
        Flash.create('success', response.status + ' : ' + response.statusText);
      }, function(response) {
        Flash.create('danger', response.status + ' : ' + response.statusText);
      })
    }
  }
  $scope.reset = function() {
    $scope.data = {
      part_no: '',
      description_1: '',
      description_2: '',
      weight: 0,
      price: 0,
      customs_no: '',
      gst: 18,
      custom: 7.5,
      bar_code: '',
      division: $scope.me.designation.division,
    }
  }
  $scope.reset()


  $scope.save = function() {
    console.log($scope.data, '$scope.data');
    var method = 'POST'
    var url = '/api/importexport/products/'

    var send = $scope.data
    $http({
      method: method,
      url: url,
      data: send,
    }).
    then(function(response) {
      Flash.create("success", "Created")
      $scope.reset()
    })
  }


})

app.controller('businessManagement.importexport.seettings.mcgGeneralise', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $rootScope) {

  $scope.generaliseMsg = function() {
    $http({
      method: 'GET',
      url: '/api/HR/smsClassifier/'
    }).
    then(function(response) {
      Flash.create('success', 'Generalised Sucessfully');
    })
  }

})

app.controller('businessManagement.importexport.seettings.negativeKeywords.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $rootScope) {
  $scope.wordForm = {
    name: '',
    typ: 'negativeWord'
  }
  $scope.mode = 'new'
  $scope.msg = 'Create'
  $scope.$on('keyWordUpdate', function(event, input) {
    $scope.msg = 'Update'
    $scope.wordForm = input.data
    $scope.mode = 'edit'

  });
  $scope.saveKeyWord = function() {
    if ($scope.wordForm.name == null || $scope.wordForm.name.length == 0) {
      Flash.create('warning', 'Please Mention The Keyword')
      return;
    }
    var method = 'POST'
    var url = '/api/HR/settingTypes/'
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      url = url + $scope.wordForm.pk + '/'
    }
    dataToSend = {
      name: $scope.wordForm.name,
      typ: $scope.wordForm.typ,
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', $scope.msg + 'd');
      $rootScope.$broadcast('forceRefetch', {});
      $scope.wordForm = {
        name: '',
        typ: 'negativeWord'
      }
      $scope.mode = 'new'
      $scope.msg = 'Create'
    })
  }

})

app.controller('businessManagement.importexport.seettings.bankId.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $rootScope) {
  $scope.gEmailForm = {
    name: '',
    typ: 'bankIds'
  }
  $scope.mode = 'new'
  $scope.msg = 'Create'
  $scope.$on('GEmailUpdate', function(event, input) {

    $scope.msg = 'Update'
    $scope.gEmailForm = input.data
    $scope.mode = 'edit'

  });
  $scope.saveGEmail = function() {
    if ($scope.gEmailForm.name == null || $scope.gEmailForm.name.length == 0) {
      Flash.create('warning', 'Please Mention The Email')
      return;
    }
    var method = 'POST'
    var url = '/api/HR/settingTypes/'
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      url = url + $scope.gEmailForm.pk + '/'
    }
    dataToSend = {
      name: $scope.gEmailForm.name,
      typ: $scope.gEmailForm.typ,
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', $scope.msg + 'd');
      $rootScope.$broadcast('forceRefetch', {});
      $scope.gEmailForm = {
        name: '',
        typ: 'bankIds'
      }
      $scope.mode = 'new'
      $scope.msg = 'Create'
    })
  }

})

app.controller('businessManagement.importexport.seettings.socialId.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions, $rootScope) {
  $scope.sEmailForm = {
    name: '',
    typ: 'socialIds'
  }
  $scope.mode = 'new'
  $scope.msg = 'Create'
  $scope.$on('SEmailUpdate', function(event, input) {
    $scope.msg = 'Update'
    $scope.sEmailForm = input.data
    $scope.mode = 'edit'

  });
  $scope.saveSEmail = function() {
    if ($scope.sEmailForm.name == null || $scope.sEmailForm.name.length == 0) {
      Flash.create('warning', 'Please Mention The Email')
      return;
    }
    var method = 'POST'
    var url = '/api/HR/settingTypes/'
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      url = url + $scope.sEmailForm.pk + '/'
    }
    dataToSend = {
      name: $scope.sEmailForm.name,
      typ: $scope.sEmailForm.typ,
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', $scope.msg + 'd');
      $rootScope.$broadcast('forceRefetch', {});
      $scope.sEmailForm = {
        name: '',
        typ: 'socialIds'
      }
      $scope.mode = 'new'
      $scope.msg = 'Create'
    })
  }

}) //------------------------------------mastersheet----------------------------------------------------
app.controller("businessManagement.importexport.inventory1", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  $scope.$watch('modeToggle', function(newValue, oldValue) {
    console.log("truuuuuuuuuuuu");
    if (newValue == true) {
      console.log("aaaaaaaaaaaaaaaaaaaaaajjjjjjjjjjjjjj");
      $scope.getMaterialIssue($scope.offsetmaterial)
    }
  });

  $scope.offset = 0
  $scope.text = {
    searchText: ''
  }
  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()
  });
  if ($rootScope.formToggle.toggleMain) {
    $scope.flagValue = 'True'
  } else {
    $scope.flagValue = 'False'
  }
  console.log($rootScope.formToggle.toggleMain, 'sucesssssssssssssssss');
  $scope.fetchProdInventory = function(offset) {
    if ($scope.text.searchText.length > 0) {
      var url = '/api/importexport/inventoryData/?limit=7&offset=' + offset + '&search=' + $scope.text.searchText + '&flag=' + $scope.flagValue
    } else {
      var url = '/api/importexport/inventoryData/?limit=7&offset=' + offset + '&flag=' + $scope.flagValue
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.products = response.data.data
      console.log($scope.products, 'matreiallll');
      $scope.total = response.data.total
      if ($rootScope.cart.length) {
        for (var i = 0; i < $rootScope.cart.length; i++) {
          for (var j = 0; j < $scope.products.length; j++) {
            if ($rootScope.cart[i] == $scope.products[j].productPk) {
              $scope.products[j].addedCart = true
            }
          }
        }
      }
    })
  }

  $scope.$watch('text.searchText', function(newValue, oldValue) {
    if (typeof newValue == 'object' && newValue != oldValue) {
      $scope.products = [newValue]
    }
  });

  $scope.productSearch = function(query) {
    if (query.length <= 0) {
      console.log('newwwwwwww');
      var url = '/api/importexport/inventoryData/?limit=7&offset=' + $scope.offset + '&flag=' + $scope.flagValue
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.products = response.data.data

        $scope.total = response.data.total
        if ($rootScope.cart.length) {
          for (var i = 0; i < $rootScope.cart.length; i++) {
            for (var j = 0; j < $scope.products.length; j++) {
              if ($rootScope.cart[i] == $scope.products[j].productPk) {
                $scope.products[j].addedCart = true
              }
            }
          }
        }
      })
    } else {
      return $http.get('/api/importexport/inventoryData/?limit=20&searchQuery=' + query + '&flag=' + $scope.flagValue)
        .then(function(response) {
          console.log(response.data, 'dataaa');
          return response.data.data;
        })
    }
  };

  $scope.fetchProdInventory($scope.offset)

  $scope.enterFun = function() {
    $scope.productSearch($scope.text.searchText)
    // $scope.fetchProdInventory($scope.offset)
  }

  $scope.refresh = function() {
    $scope.fetchProdInventory($scope.offset)
  }

  $scope.next = function() {
    $scope.offset = $scope.offset + 7
    $scope.fetchProdInventory($scope.offset)
    if ($scope.products.length == 0) {
      $scope.offset = $scope.offset - 7
      $scope.fetchProdInventory($scope.offset)
    }
  }

  $scope.prev = function() {
    console.log("kkk");
    if ($scope.offset == 0) {
      return
    }
    $scope.offset = $scope.offset - 7
    $scope.fetchProdInventory($scope.offset)
  }

  $scope.reset = function() {
    $rootScope.cart = []
    $scope.fetchProdInventory($scope.offset)
  }
  $scope.reset()
  $scope.addToCart = function(product, indx) {
    $rootScope.cart.push(product)
    $scope.products[indx].addedCart = true
  }


  $scope.searchmaterial = {
    search: "",
    dt: new Date()
  }


  $scope.showPagint = true
  $scope.getMaterialIssue = function(offset) {


    if ($scope.searchmaterial.search.length == 0) {
      $scope.showPagint = true
      var url = '/api/importexport/material/?created__lte=' + $scope.searchmaterial.dt.toJSON().split('T')[0] + '&limit=7&offset=' + offset + '&project__comm_nr__icontains=' + $scope.searchmaterial.search + '&project__flag=' + $scope.flagValue
    } else {
      $scope.showPagint = false
      var url = '/api/importexport/material/?created__lte=' + $scope.searchmaterial.dt.toJSON().split('T')[0] + '&project__comm_nr__icontains=' + $scope.searchmaterial.search + '&project__flag=' + $scope.flagValue
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      if ($scope.searchmaterial.search.length == 0) {
        $scope.materialIssue = response.data.results
        console.log($scope.materialIssue, 'material issue list if loop')
      } else {
        $scope.materialIssue = response.data
        console.log($scope.materialIssue, 'material issue list else')
      }
      $scope.totSum = 0

      $scope.sum = []
      for (var i = 0; i < $scope.materialIssue.length; i++) {
        $scope.issue = $scope.materialIssue[i].materialIssue
        var tot = $scope.issue.map(function(m) {
          return m.qty * m.price
        }).reduce(function(a, b) {
          return a + b
        }, 0)
        $scope.sum.push(tot)
        console.log(tot);
        $scope.totSum += tot

      }
    })
  }

  $scope.offsetmaterial = 0



  $scope.refreshmaterial = function() {
    $scope.getMaterialIssue($scope.offset)
  }

  $scope.nextmaterial = function() {
    if ($scope.materialIssue.length == 0) {
      $scope.offsetmaterial = $scope.offsetmaterial - 7
      $scope.getMaterialIssue($scope.offsetmaterial)
    }
    $scope.offsetmaterial = $scope.offsetmaterial + 7
    $scope.getMaterialIssue($scope.offsetmaterial)
  }

  $scope.prevmaterial = function() {
    if ($scope.offsetmaterial == 0) {
      return
    }
    $scope.offsetmaterial = $scope.offsetmaterial - 7
    $scope.getMaterialIssue($scope.offsetmaterial)
  }

  $scope.enterFunmaterial = function() {
    $scope.getMaterialIssue($scope.offsetmaterial)
  }




  $scope.$watch('modeToggle', function(newValue, oldValue) {

    if (newValue == true) {
      $scope.getMaterialIssue($scope.offsetmaterial)
    }
  });


  $scope.createDC = function(pkVal) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.inventory.deliveryChallan.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        value: function() {
          return pkVal;
        },
        flag: function() {
          return $rootScope.formToggle.toggleMain;
        },
      },
      controller: function($scope, $uibModalInstance, value, flag) {

        $scope.materialPk = value
        $scope.refresh = function() {
          $scope.form = {
            customer: '',
            materialIssue: '',
            heading: '',
            challanNo: '',
            challanDate: '',
            deliveryThr: '',
            refNo: '',
            apprx: '',
            notes: '',
            flag: flag
          }
        }
        $scope.refresh()

        $http({
          method: 'GET',
          url: '/api/importexport/deliveryChallan/?materialIssue=' + $scope.materialPk
        }).
        then(function(response) {
          $scope.data = response.data[0]
          console.log($scope.data, 'aaaaaaaaa');
        })

        $scope.viewAll = function() {
          if (typeof $scope.data == 'undefined') {
            $scope.refresh()
          } else {
            $scope.form = $scope.data
          }
        }
        $timeout(function() {
          $scope.viewAll()
        }, 500);



        $scope.serviceSearch = function(query) {
          return $http.get('/api/ERP/service/?name__icontains=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.create = function() {
          $scope.form.materialIssue = $scope.materialPk
          if (typeof $scope.form.challanDate == 'object') {
            $scope.form.challanDate = $scope.form.challanDate.toJSON().split('T')[0]
          } else {
            $scope.form.challanDate = $scope.form.challanDate
          }


          var dataToSend = {
            customername: $scope.form.customername,
            customeraddress: $scope.form.customeraddress,
            customergst: $scope.form.customergst,
            materialIssue: $scope.form.materialIssue,
            heading: $scope.form.heading,
            challanNo: $scope.form.challanNo,
            challanDate: $scope.form.challanDate,
            deliveryThr: $scope.form.deliveryThr,
            refNo: $scope.form.refNo,
            apprx: $scope.form.apprx,
            notes: $scope.form.notes,
            flag: $scope.form.flag
          }

          if (!$scope.form.pk) {
            var method = 'POST'
            var url = '/api/importexport/deliveryChallan/'
          } else {
            var method = 'PATCH'
            var url = '/api/importexport/deliveryChallan/' + $scope.form.pk + '/'
          }

          $http({
            method: method,
            url: url,
            data: dataToSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $scope.form = response.data
          })
        };
        $scope.close = function() {
          $uibModalInstance.dismiss();
        };
      }
    })
    $scope.getMaterialIssue($scope.offsetmaterial)
  }


  $scope.createReportData = function() {
    $http({
      method: 'GET',
      url: '/api/importexport/createStockReportData/?flag=' + $scope.flagValue,
    }).
    then(function(response) {
      console.log(response.data);
      Flash.create('success', response.data.status);
    }, function(err) {
      Flash.create('warning', err.status + ' : ' + err.statusText);
    })
  }

  $scope.cancelMaterial = function(pk) {
    dataSnd = {
      'pkData': pk
    }
    $http({
      method: 'POST',
      url: '/api/importexport/cancelMaterial/',
      data: dataSnd
    }).
    then(function(response) {
      $scope.getMaterialIssue($scope.offset)

    })
  }

  $scope.toggleMaterial = function(pk, indx) {
    // $scope.prodInventories[indx].open = !$scope.prodInventories[indx].open
    for (var i = 0; i < $scope.materialIssue.length; i++) {
      if ($scope.materialIssue[i].pk == pk) {
        $scope.materialIssue[i].open = !$scope.materialIssue[i].open
      }
    }
  }


  $scope.toggle = function(pk, indx) {
    // $scope.prodInventories[indx].open = !$scope.prodInventories[indx].open
    for (var i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].productPk == pk) {
        $scope.products[i].open = !$scope.products[i].open
      }
    }
  }

  $scope.new = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.inventory.modal.html',
      size: 'lg',
      resolve: {
        value: function() {
          return $scope.flagValue;
        }
      },
      controller: function($scope, $uibModalInstance, value) {
        $scope.productSearch = function(query) {
          return $http.get('/api/importexport/products/?search=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.projectSearch = function(query) {
          return $http.get('/api/importexport/projects/?title__icontains=' + query + '&status=ongoing&flag='+  $scope.flagValue).
          then(function(response) {
            return response.data;
          })
        };
        $scope.reset = function() {
          $scope.form = {
            product: '',
            qty: 1,
            rate: 0,
            project: ''
          }
        }
        $scope.reset()
        $scope.saveProduct = function() {
          if (typeof $scope.form.project != 'object') {
            Flash.create('warning', 'Select Project')
            return
          }
          var dataToSend = {
            product: $scope.form.product.pk,
            qty: $scope.form.qty,
            project: $scope.form.project.pk,
          }
          $http({
            method: 'POST',
            url: '/api/importexport/addInventory/',
            data: dataToSend,
          }).
          then(function(response) {
            console.log(response.data.typ);
            if (response.data.typ === 'success') {
              Flash.create('success', response.data.msg);
              $scope.reset()
            } else {
              Flash.create('warning', response.data.msg);
            }
          });


        }


      },
    }).result.then(function() {}, function() {
      $scope.fetchProdInventory($scope.offset)
    });
  }

  $scope.getList = function() {
    if ($rootScope.cart.length > 0) {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.inventory.cart.modal.html',
        size: 'lg',
        backdrop: false,
        resolve: {
          cartData: function() {
            return $rootScope.cart;
          },
          value: function() {
            return $scope.flagValue;
          },
        },
        controller: function($scope, $uibModalInstance, cartData, value) {
          $scope.showSave = true
          $scope.getFullProjectName = function(p) {
            if (p) {
              var fn = p.title + ' ( ' + p.comm_nr + ' )' + ' - ' + p.vendor.name
              console.log(fn);
              return fn
            } else {
              return
            }
          }
          $scope.close = function() {
            $uibModalInstance.dismiss();
          };


          $scope.addTableRow = function(indx) {
            $scope.productsOrdered.push({
              part_no: '',
              description_1: '',
              price: '',
              weight: 0,
              prodQty: 1,
              total_quantity: 1,
            });
            $scope.showButton = false
          }

          $scope.change = function(query) {
            return $http.get('/api/importexport/products/?limit=10&searchContains=' + query).
            then(function(response) {
              return response.data.results;
            })
          };
          $scope.showButton = true

          $scope.$watch('productsOrdered', function(newValue, oldValue) {
            if (typeof newValue[newValue.length - 1].part_no == 'object') {
              if ($scope.productsOrdered.length > 1) {
                for (var i = 0; i < $scope.productsOrdered.length; i++) {
                  if ($scope.productsOrdered[i].pk == newValue[newValue.length - 1].part_no.pk) {
                    Flash.create('warning', 'Product Already Added');
                    return
                  }
                }
              }
              $scope.showButton = true
              $scope.productsOrdered[$scope.productsOrdered.length - 1] = newValue[newValue.length - 1].part_no
              $scope.productsOrdered[$scope.productsOrdered.length - 1].prodQty = 1
            }
          }, true)

          $scope.projectSearch = function(query) {
            return $http.get('/api/importexport/projectSearch/?limit=30&comm_nr=' + query + '&flag=' + value+'&type=materialIssue').
            then(function(response) {
              console.log(response);
              return response.data.results;
            })
          };

          $scope.userSearch = function(query) {
            return $http.get('/api/HR/userSearch/?first_name__icontains=' + query).
            then(function(response) {
              return response.data;
            })
          };
          $scope.cartData = cartData
          $scope.productsOrdered = []
          // $scope.productsOrderedpk = []
          for (var i = 0; i < $scope.cartData.length; i++) {
            $http({
              method: 'GET',
              url: '/api/importexport/products/' + $scope.cartData[i]
            }).
            then(function(response) {
              $scope.productsOrdered.push(response.data);


            })

          }

          $scope.delete = function(index) {
            if (index == $scope.productsOrdered.length - 1) {
              $scope.showButton = true
              $scope.productsOrdered.splice(index, 1);
            }
            $scope.productsOrdered.splice(index, 1);

          }




          $scope.form = {}
          $scope.save = function() {
            if ($scope.form.responsible == undefined) {
              Flash.create('warning', 'Select Responsible person');
              return
            }
            if ($scope.form.project == undefined) {
              Flash.create('warning', 'Select Project');
              return
            }
            if ($scope.productsOrdered.length <= 0) {
              Flash.create('warning', 'Add Products');
              return
            }
            for (var i = 0; i < $scope.productsOrdered.length; i++) {
              console.log($scope.productsOrdered[i].pk);
              if ($scope.productsOrdered[i].total_quantity <= 0 || !$scope.productsOrdered[i].pk || $scope.productsOrdered[i].prodQty > $scope.productsOrdered[i].total_quantity) {
                Flash.create('warning', 'Remove the products marked in red or with empty value or reduce the quantity ');
                return
              }
            }

            var dataToSend = {
              products: $scope.productsOrdered,
              user: $scope.form.responsible.pk,
              project: $scope.form.project.pk,
            }
            $http({
              method: 'POST',
              url: '/api/importexport/order/',
              data: dataToSend
            }).
            then(function(response) {
              $scope.showButton = false
              $scope.showSave = false
              $scope.values = response.data
            })
          }
        },
      }).result.then(function() {}, function(values) {
        $scope.fetchProdInventory($scope.offset)
      });
    } else {
      Flash.create("warning", 'Add items to Cart')
    }
  }

  $scope.download = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.inventory.stockcheck.modal.html',
      size: 'lg',
      resolve: {
        value: function() {
          return $scope.flagValue;
        }
      },
      controller: function($scope, $uibModalInstance, value) {
        $scope.off = 0;
        $scope.fectchStock = function() {
          $http({
            method: 'GET',
            url: '/api/importexport/inventoryData/?limit=7&offset=' + $scope.off + '&flag=' + value,
          }).
          then(function(response) {
            $scope.stockdata = response.data.data
            console.log($scope.stockdata, 'aaaaaaaaaaaaaa');

          })
        }
        $scope.fectchStock()

        $scope.refresh = function() {
          $scope.fectchStock($scope.off)
        }

        $scope.next = function() {
          $scope.off = $scope.off + 7
          $scope.fectchStock($scope.off)
          if ($scope.stockdata.length == 0) {

            $uibModalInstance.close()
          }
        }

        $scope.prev = function() {
          if ($scope.off == 0) {
            return
          }
          $scope.off = $scope.off - 7
          $scope.fectchStock($scope.off)
        }

        $scope.$watch('stockdata', function(newValue, oldValue) {
          if (typeof newValue == 'object') {
            for (var i = 0; i < $scope.stockdata.length; i++) {

            }
          }

        });

      },
    })
  }
})
//--------------------------------inventry1--------------------------------------------------
app.controller("businessManagement.importexport.vendor", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {

  $rootScope.$on('customEvent', function(event, message) {
    console.log($rootScope.formToggle.toggleMain, 'jjjjjjjjjjjjjjj')
    $state.reload()
  });
  $scope.limit = 9
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }

  $scope.fetchData = function() {
    let url = '/api/importexport/vendor/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&flag=' + $rootScope.formToggle.toggleMain;
    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query

    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results

      $scope.count = response.data.count
      console.log($scope.allData, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaTable");
    })
  }
  $scope.fetchData()
  $scope.deleteVendor = function(pk) {
    $http({
      method: 'DELETE',
      url: '/api/importexport/vendor/' + pk + "/",
    }).then(function(response) {
      Flash.create("success", "Vendor deleted")
      $scope.fetchData();
    });
  }
});

app.controller("businessManagement.importexport.vendor.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $filter, $rootScope) {

  if ($state.is('businessManagement.importexport.editVendor')) {
    $scope.form = {
      name: '',
      personName: '',
      mobile: '',
      email: '',
      gst: '',
      street: '',
      city: '',
      pincode: '',
      state: '',
      country: '',
    }
    $http({
      url: '/api/importexport/vendor/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      console.log($scope.form, "vendorrrrrrrrrrrrr");
      $scope.updateVendor = function() {

        var method = 'PATCH'
        var Url = '/api/importexport/vendor/' + $stateParams.id + '/'
        var dataTosend = {
          name: $scope.form.name,
          personName: $scope.form.personName,
          mobile: $scope.form.mobile,
          email: $scope.form.email,
          gst: $scope.form.gst,
          street: $scope.form.street,
          city: $scope.form.city,
          pincode: $scope.form.pincode,
          state: $scope.form.state,
          country: $scope.form.country,
        };

        $http({
          method: method,
          url: Url,
          data: dataTosend
        }).
        then(function(response) {
          Flash.create('success', 'Updated');

        });
      }
    })
  }
  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      personName: '',
      mobile: '',
      email: '',
      gst: '',
      street: '',
      city: '',
      pincode: '',
      state: '',
      country: '',
    }
  }
  if (typeof $scope.tab == 'undefined') {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.form = $scope.data.tableData[$scope.tab.data.index]
  }


  $scope.createVendor = function() {

    var method = 'POST'
    var Url = '/api/importexport/vendor/'
    var dataTosend = {
      name: $scope.form.name,
      personName: $scope.form.personName,
      mobile: $scope.form.mobile,
      email: $scope.form.email,
      gst: $scope.form.gst,
      street: $scope.form.street,
      city: $scope.form.city,
      pincode: $scope.form.pincode,
      state: $scope.form.state,
      country: $scope.form.country,
    };
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      Url = Url + $scope.form.pk + '/'
    }
    $http({
      method: method,
      url: Url,
      data: dataTosend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      if ($scope.mode == 'edit') {
        return
      } else {
        $scope.resetForm()
      }

    });
  }



});
//--------------------------------------------vendor-------------------------------------------------


app.controller("businessManagement.importexport.vendor", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {

  $rootScope.$on('customEvent', function(event, message) {
    console.log($rootScope.formToggle.toggleMain, 'jjjjjjjjjjjjjjj')
    $state.reload()
  });
  $scope.limit = 9
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }

  $scope.fetchData = function() {
    let url = '/api/importexport/vendor/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&flag=' + $rootScope.formToggle.toggleMain;
    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query

    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results

      $scope.count = response.data.count
      console.log($scope.allData, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaTable");
    })
  }
  $scope.fetchData()
  $scope.deleteVendor = function(pk) {
    $http({
      method: 'DELETE',
      url: '/api/importexport/vendor/' + pk + "/",
    }).then(function(response) {
      Flash.create("success", "Vendor deleted")
      $scope.fetchData();
    });
  }
});

app.controller("businessManagement.importexport.vendor.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $filter, $rootScope) {

  if ($state.is('businessManagement.importexport.editVendor')) {
    $scope.form = {
      name: '',
      personName: '',
      mobile: '',
      email: '',
      gst: '',
      street: '',
      city: '',
      pincode: '',
      state: '',
      country: '',
    }
    $http({
      url: '/api/importexport/vendor/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      console.log($scope.form, "vendorrrrrrrrrrrrr");
      $scope.updateVendor = function() {

        var method = 'PATCH'
        var Url = '/api/importexport/vendor/' + $stateParams.id + '/'
        var dataTosend = {
          name: $scope.form.name,
          personName: $scope.form.personName,
          mobile: $scope.form.mobile,
          email: $scope.form.email,
          gst: $scope.form.gst,
          street: $scope.form.street,
          city: $scope.form.city,
          pincode: $scope.form.pincode,
          state: $scope.form.state,
          country: $scope.form.country,
        };

        $http({
          method: method,
          url: Url,
          data: dataTosend
        }).
        then(function(response) {
          Flash.create('success', 'Updated');

        });
      }
    })
  }
  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      personName: '',
      mobile: '',
      email: '',
      gst: '',
      street: '',
      city: '',
      pincode: '',
      state: '',
      country: '',
    }
  }
  if (typeof $scope.tab == 'undefined') {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.form = $scope.data.tableData[$scope.tab.data.index]
  }


  $scope.createVendor = function() {

    var method = 'POST'
    var Url = '/api/importexport/vendor/'
    var dataTosend = {
      name: $scope.form.name,
      personName: $scope.form.personName,
      mobile: $scope.form.mobile,
      email: $scope.form.email,
      gst: $scope.form.gst,
      street: $scope.form.street,
      city: $scope.form.city,
      pincode: $scope.form.pincode,
      state: $scope.form.state,
      country: $scope.form.country,
    };
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      Url = Url + $scope.form.pk + '/'
    }
    $http({
      method: method,
      url: Url,
      data: dataTosend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      if ($scope.mode == 'edit') {
        return
      } else {
        $scope.resetForm()
      }

    });
  }
}); //-----------------------------vendor------------------------------------------------------------
app.controller("businessManagement.importexport.invoice", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()
  });
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/importexport/iminvoice/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&flag=' + true
    if ($scope.search.query.length > 0) {
      url = url + '&invoiceno=' + $scope.search.query

    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results

      $scope.count = response.data.count
    })
  }
  $scope.fetchData()
  $scope.deleteInvoice = function(pk) {
    $http({
      method: 'DELETE',
      url: '/api/importexport/iminvoice/' + pk + "/",
    }).then(function(response) {
      Flash.create("success", "Project deleted")
      $scope.fetchData();
    });
  }

})

//-------------------------------invoice--------------------------------------------------


app.controller("businessManagement.importexport.invoice.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout, ) {
  if ($state.is('businessManagement.importexport.editInvoice')) {
    $http({
      url: '/api/importexport/iminvoice/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      console.log($scope.form);
      $scope.fetchData = function() {
        $http({
          method: 'GET',
          url: '/api/importexport/iminvoiceQty/?invoice=' + $stateParams.id
        }).
        then(function(response) {
          $scope.products = response.data
        })
      }
      $scope.products = []
      $scope.address = {
        billstreet: '',
        billcity: '',
        billpincode: '',
        shipstreet: '',
        shipcity: '',
        shippincode: '',
      }
      $scope.form = {
        invoiceNumber: '',
        invoiceDate: new Date(),
        poNumber: '',
        insuranceNumber: '',
        transporter: '',
        lrNo: '',
        billName: '',
        machinemodel:'',
        shipName: '',
        billAddress: {
          street: '',
          city: '',
          pincode: ''
        },
        shipAddress: {
          street: '',
          city: '',
          pincode: ''
        },
        billGst: '',
        shipGst: '',
        billState: '',
        billCode: '',
        shipState: '',
        shipCode: '',
        isDetails: false,
        invoiceTerms: '',
        toggleVendor: false,
        flag: $rootScope.formToggle.toggleMain
      }
      $scope.status = false

      $scope.form = response.data

      console.log($scope.form, 'form');


      if (typeof $scope.form.billAddress === 'object') {
        $scope.form.billAddress = $scope.form.billAddress
        console.log($scope.form.billAddress, 'in object');
      } else {
        $scope.form.billAddress = JSON.parse($scope.form.billAddress)
        console.log($scope.form.billAddress, 'not object');
      }
      if (typeof $scope.form.shipAddress === 'object') {
        $scope.form.shipAddress = $scope.form.shipAddress
      } else {
        $scope.form.shipAddress = JSON.parse($scope.form.shipAddress)
      }
      if ($scope.status == false) {
        $scope.editData = response.data
        if (typeof $scope.editData.billAddress === 'object') {
          $scope.editData.billAddress = $scope.editData.billAddress
        } else {
          $scope.editData.billAddress = JSON.parse($scope.editData.billAddress)
        }
        if (typeof $scope.editData.shipAddress === 'object') {
          $scope.editData.shipAddress = $scope.editData.shipAddress
        } else {
          $scope.editData.shipAddress = JSON.parse($scope.editData.shipAddress)
        }
        $scope.status = true
      }


      $scope.products = []
      $scope.fetchData()

      $scope.vendorSearch = function(query) {
        if ($scope.form.toggleVendor == false) {
          return $http.get('/api/importexport/vendor/?name__icontains=' + query).
          then(function(response) {
            return response.data;
          })
        } else {
          return $http.get('/api/ERP/service/?name__icontains=' + query).
          then(function(response) {
            return response.data;
          })
        }
      };

      $scope.$watch('form.billName', function(newValue, oldValue) {

        if (typeof newValue === 'object') {
          if ($scope.form.toggleVendor == false) {
            $scope.form.billName = newValue.name
            $scope.form.billAddress.street = newValue.street
            $scope.form.billAddress.city = newValue.city
            $scope.form.billAddress.pincode = newValue.pincode
            $scope.form.billState = newValue.state
            $scope.form.billGst = newValue.gst
          } else {
            $scope.form.billName = newValue.name
            $scope.form.billAddress.street = newValue.address.street
            $scope.form.billAddress.city = newValue.address.city
            $scope.form.billAddress.pincode = newValue.address.pincode
            $scope.form.billState = newValue.address.state
            $scope.form.billGst = newValue.tin
          }

        }
        if ($scope.form.isDetails == true) {
          $scope.form.shipName = $scope.form.billName
        }
      })
      $scope.$watch('form.shipName', function(newValue, oldValue) {
        if (typeof newValue === 'object' && $scope.form.isDetails == false) {
          if ($scope.form.toggleVendor == false) {
            $scope.form.shipName = newValue.name
            $scope.form.shipAddress.street = newValue.street
            $scope.form.shipAddress.city = newValue.city
            $scope.form.shipAddress.pincode = newValue.pincode
            $scope.form.shipState = newValue.state
            $scope.form.shipGst = newValue.gst
          } else {
            $scope.form.shipName = newValue.name
            $scope.form.shipAddress.street = newValue.address.street
            $scope.form.shipAddress.city = newValue.address.city
            $scope.form.shipAddress.pincode = newValue.address.pincode
            $scope.form.shipState = newValue.address.state
            $scope.form.shipGst = newValue.gst
          }
        }

      })
      $scope.all = false
      $scope.$watch('form.isDetails', function(newValue, oldValue) {
        if (!$scope.form.pk) {
          if (newValue == true) {
            $scope.form.shipName = $scope.form.billName
            $scope.form.shipAddress.street = $scope.form.billAddress.street
            $scope.form.shipAddress.city = $scope.form.billAddress.city
            $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
            $scope.form.shipState = $scope.form.billState
            $scope.form.shipState = $scope.form.billState
            $scope.form.shipGst = $scope.form.billGst
            $scope.all = true

          } else {
            $scope.form.shipName = ''
            $scope.form.shipAddress.street = ''
            $scope.form.shipAddress.city = ''
            $scope.form.shipAddress.pincode = ''
            $scope.form.shipState = ''
            $scope.form.shipGst = ''
            $scope.all = false
          }
        } else {
          if (newValue == true) {
            $scope.form.shipName = $scope.form.billName
            $scope.form.shipAddress.street = $scope.form.billAddress.street
            $scope.form.shipAddress.city = $scope.form.billAddress.city
            $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
            $scope.form.shipState = $scope.form.billState
            $scope.form.shipGst = $scope.form.billGst
            $scope.all = true

          } else {
            console.log($scope.data.tableData[$scope.tab.data.index], 'ggg');
            $scope.form.shipName = $scope.editData.shipName
            $scope.form.shipAddress.street = $scope.editData.shipAddress.street
            $scope.form.shipAddress.city = $scope.editData.shipAddress.city
            $scope.form.shipAddress.pincode = $scope.editData.shipAddress.pincode
            $scope.form.shipState = $scope.editData.shipState
            $scope.form.shipGst = $scope.editData.shipGst
            $scope.all = false
          }
        }

      })

      $scope.$watch('form.billAddress', function(newValue, oldValue) {

        if ($scope.form.isDetails == true) {
          $scope.form.shipAddress.street = $scope.form.billAddress.street
          $scope.form.shipAddress.city = $scope.form.billAddress.city
          $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
        }
      }, true)

      $scope.$watch('form.billState', function(newValue, oldValue) {

        if ($scope.form.isDetails == true) {
          $scope.form.shipState = $scope.form.billState
        }
      })




      $scope.addTableRow = function(indx) {
        if ($scope.products.length > 0) {
          var obj = $scope.products[$scope.products.length - 1]
          if (obj.part_no.length == 0) {
            Flash.create('danger', 'Please Fill Previous Row Data')
            return
          }
        }
        $scope.products.push({
          part_no: '',
          description_1: '',
          qty: 0,
          customs_no: '',
          price: 0,
          taxableprice: 0,
          cgst: 0,
          cgstVal: 0,
          sgst: 0,
          sgstVal: 0,
          igst: 0,
          igstVal: 0,
          total: 0,
          gst: 0
        });
      }
      $scope.deleteData = function(pkVal, idx) {
        console.log(pkVal, idx);
        if (pkVal == undefined) {
          $scope.products.splice(idx, 1)
          return
        } else {
          $http({
            method: 'DELETE',
            url: '/api/importexport/iminvoiceQty/' + pkVal + '/'
          }).
          then(function(response) {
            $scope.products.splice(idx, 1)
            Flash.create('success', 'Deleted Successfully')
            return
          })
        }
      }

      $scope.productSearch = function(query) {
        return $http.get('/api/importexport/products/?limit=10&search=' + query).
        then(function(response) {
          return response.data.results;
        })
      };
      $scope.calculate = function() {
        for (var i = 0; i < $scope.products.length; i++) {
          if ($scope.gstcode === $scope.gstCal) {
            $scope.products[i].cgst = parseFloat(($scope.products[i].gst/2).toFixed(2))
            $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
            $scope.products[i].sgst = parseFloat(($scope.products[i].gst/2).toFixed(2))
            $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
            $scope.products[i].igst = 0
            $scope.products[i].igstVal = 0
          } else {
            $scope.products[i].cgst = 0
            $scope.products[i].cgstVal = 0
            $scope.products[i].sgst = 0
            $scope.products[i].sgstVal = 0
            if($scope.products[i].gst == null || isNaN($scope.products[i].gst)){
              $scope.products[i].gst = 18
            }
            $scope.products[i].igst = parseFloat(($scope.products[i].gst).toFixed(2))
            $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
          }
          $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
        }
      }


      var gstData = '29AABCB6326Q1Z6'
      $scope.$watch('form.billGst', function(newValue, oldValue) {
        if (newValue != undefined) {
          $scope.gstcode = gstData.substring(0, 2)
          $scope.gstCal = newValue.substring(0, 2)
          $scope.form.billCode = newValue.substring(0, 2)
          $scope.calculate()
        }
      })
      $scope.$watch('form.shipGst', function(newValue, oldValue) {
        if (newValue != undefined) {
          $scope.form.shipCode = newValue.substring(0, 2)
        }
      })




      $scope.$watch('products', function(newValue, oldValue) {
        console.log(newValue,'newValue');
        var pkList = []
        for (var i = 0; i < newValue.length; i++) {

          if (typeof newValue[i].part_no == 'object') {
            var ppk = newValue[i].part_no.pk
            delete newValue[i].part_no.pk
            if (pkList.indexOf(newValue[i].part_no.part_no) >= 0) {
              newValue[i].part_no = ''
              Flash.create('danger', 'This Product Has Already Added')
              return
            } else {
              pkList.push(newValue[i].part_no.part_no)
            }
            $scope.products[i] = newValue[i].part_no
            $scope.products[i].product = ppk
            $scope.products[i].qty = 1
            $scope.products[i].gst = 18
            $scope.products[i].taxableprice = parseFloat((newValue[i].part_no.price * $scope.products[i].qty).toFixed(2))
            $scope.calculate()
          } else {
            pkList.push(newValue[i].part_no)
            if(newValue[i].gst == null || isNaN(newValue[i].gst)){
              newValue[i].gst = 18
            }
            $scope.products[i].gst = parseFloat(newValue[i].gst)
            $scope.products[i].price = parseFloat(newValue[i].price)
            $scope.products[i].taxableprice = parseFloat((newValue[i].price * newValue[i].qty).toFixed(2))
            $scope.products[i].cgst = newValue[i].cgst
            $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
            $scope.products[i].sgst = newValue[i].sgst
            $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
            $scope.products[i].igst = newValue[i].igst
            $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
            $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
          }
        }

      }, true)

      $scope.updateProgress = false;
      $scope.updateInvoice = function() {
        $scope.updateProgress = true;
        if ($scope.form.invoiceNumber == null || $scope.form.invoiceNumber.length == 0) {
          Flash.create('danger', 'Invoice No. Is Required')
          return
        }
        if ($scope.form.hasOwnProperty('project')) {
          delete $scope.form.project
        }
        var url = '/api/importexport/iminvoice/' + $stateParams.id + "/"
        $scope.form.billAddress = JSON.stringify($scope.form.billAddress)
        $scope.form.shipAddress = JSON.stringify($scope.form.shipAddress)
        method = 'PATCH'
        if (typeof $scope.form.invoiceDate == 'object') {
          $scope.form.invoiceDate = $scope.form.invoiceDate.toJSON().split('T')[0]
        }
        $http({
          method: method,
          url: url,
          data: $scope.form,
        }).
        then(function(response) {
          console.log($scope.products, '$scope.products');
          if($scope.products.length>0){
            var url = '/api/importexport/addInvoiceQtys/?invoice='+$stateParams.id
            var method = 'POST'
            $http({
              method: method,
              url: url,
              data: $scope.products,
            }).then(function(response) {
            })

          }
          $scope.updateProgress = false;
          Flash.create('success', 'Updated');
          if (!$scope.form.pk) {
            $scope.resetData()
          }

        })
      }
    })
  }
  $scope.fetchData = function() {
    $http({
      method: 'GET',
      url: '/api/importexport/iminvoiceQty/?invoice=' + $scope.form.pk
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }
  $scope.resetData = function() {
    $scope.products = []
    $scope.address = {
      billstreet: '',
      billcity: '',
      billpincode: '',
      shipstreet: '',
      shipcity: '',
      shippincode: '',
    }
    $scope.form = {
      invoiceNumber: 'BPIPL/INV/',
      invoiceDate: new Date(),
      poNumber: '',
      insuranceNumber: '',
      transporter: '',
      lrNo: '',
      comm_nr: '',
      packing: '',
      billName: '',
      machinemodel: '',
      shipName: '',
      billAddress: {
        street: '',
        city: '',
        pincode: ''
      },
      shipAddress: {
        street: '',
        city: '',
        pincode: ''
      },
      billGst: '',
      shipGst: '',
      billState: '',
      billCode: '',
      shipState: '',
      shipCode: '',
      isDetails: false,
      invoiceTerms: '',
      toggleVendor: false,
      flag: true,
    }
  }
  $scope.status = false


  if (typeof $scope.tab == 'undefined') {
    $scope.resetData()
  } else {
    $scope.form = $scope.data.tableData[$scope.tab.data.index]


    if (typeof $scope.form.billAddress === 'object' ) {
      $scope.form.billAddress = $scope.form.billAddress
    } else {
      $scope.form.billAddress = JSON.parse($scope.form.billAddress)
    }
    if (typeof $scope.form.shipAddress === 'object') {
      $scope.form.shipAddress = $scope.form.shipAddress
    } else {
      $scope.form.shipAddress = JSON.parse($scope.form.shipAddress)
    }

    if ($scope.status == false) {
      $scope.editData = $scope.data.tableData[$scope.tab.data.index]
      if (typeof $scope.editData.billAddress === 'object') {
        $scope.editData.billAddress = $scope.editData.billAddress
      } else {
        $scope.editData.billAddress = JSON.parse($scope.editData.billAddress)
      }
      if (typeof $scope.editData.shipAddress === 'object') {
        $scope.editData.shipAddress = $scope.editData.shipAddress
      } else {
        $scope.editData.shipAddress = JSON.parse($scope.editData.shipAddress)
      }
      $scope.status = true
    }


    $scope.products = []
    $scope.fetchData()
  }


  $scope.vendorSearch = function(query) {
    if ($scope.form.toggleVendor == false) {
      return $http.get('/api/importexport/vendor/?name__icontains=' + query).
      then(function(response) {
        return response.data;
      })
    } else {
      return $http.get('/api/ERP/service/?name__icontains=' + query).
      then(function(response) {
        return response.data;
      })
    }
  };

  $scope.$watch('form.billName', function(newValue, oldValue) {


    if ($scope.form.billAddress == null || $scope.form.billAddress == undefined){
        $scope.form.billAddress = {
                                    street: '',
                                    city: '',
                                    pincode: ''
                                  }
    }


    if (typeof newValue === 'object') {
      if ($scope.form.toggleVendor == false) {
        $scope.form.billName = newValue.name
        $scope.form.billAddress.street = newValue.street
        $scope.form.billAddress.city = newValue.city
        $scope.form.billAddress.pincode = newValue.pincode
        $scope.form.billState = newValue.state
        $scope.form.billGst = newValue.gst
      } else {
        $scope.form.billName = newValue.name
        $scope.form.billAddress.street = newValue.address.street
        $scope.form.billAddress.city = newValue.address.city
        $scope.form.billAddress.pincode = newValue.address.pincode
        $scope.form.billState = newValue.address.state
        $scope.form.billGst = newValue.tin
      }

    }
    if ($scope.form.isDetails == true) {
      $scope.form.shipName = $scope.form.billName
    }
  })
  $scope.$watch('form.shipName', function(newValue, oldValue) {

    if ($scope.form.shipAddress == null || $scope.form.shipAddress == undefined){
        $scope.form.shipAddress = {
                                    street: '',
                                    city: '',
                                    pincode: ''
                                  }
    }

    if (typeof newValue === 'object' && $scope.form.isDetails == false) {
      if ($scope.form.toggleVendor == false) {
        $scope.form.shipName = newValue.name
        $scope.form.shipAddress.street = newValue.street
        $scope.form.shipAddress.city = newValue.city
        $scope.form.shipAddress.pincode = newValue.pincode
        $scope.form.shipState = newValue.state
        $scope.form.shipGst = newValue.gst
      } else {
        console.log(newValue, 'newValue');
        $scope.form.shipName = newValue.name
        $scope.form.shipAddress.street = newValue.address.street
        $scope.form.shipAddress.city = newValue.address.city
        $scope.form.shipAddress.pincode = newValue.address.pincode
        $scope.form.shipState = newValue.address.state
        $scope.form.shipGst = newValue.tin
      }
    }

  })
  $scope.all = false
  $scope.$watch('form.isDetails', function(newValue, oldValue) {
    if ($scope.form.billAddress == null || $scope.form.billAddress == undefined){
        $scope.form.billAddress = {
                                    street: '',
                                    city: '',
                                    pincode: ''
                                  }
    }
    if ($scope.form.shipAddress == null || $scope.form.shipAddress == undefined){
        $scope.form.shipAddress = {
                                    street: '',
                                    city: '',
                                    pincode: ''
                                  }
    }

    if (!$scope.form.pk) {
      if (newValue == true) {
        $scope.form.shipName = $scope.form.billName
        $scope.form.shipAddress.street = $scope.form.billAddress.street
        $scope.form.shipAddress.city = $scope.form.billAddress.city
        $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
        $scope.form.shipState = $scope.form.billState
        $scope.form.shipState = $scope.form.billState
        $scope.form.shipGst = $scope.form.billGst
        $scope.all = true

      } else {
        $scope.form.shipName = ''
        $scope.form.shipAddress.street = ''
        $scope.form.shipAddress.city = ''
        $scope.form.shipAddress.pincode = ''
        $scope.form.shipState = ''
        $scope.form.shipGst = ''
        $scope.all = false
      }
    } else {
      if (newValue == true) {
        $scope.form.shipName = $scope.form.billName
        $scope.form.shipAddress.street = $scope.form.billAddress.street
        $scope.form.shipAddress.city = $scope.form.billAddress.city
        $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
        $scope.form.shipState = $scope.form.billState
        $scope.form.shipGst = $scope.form.billGst
        $scope.all = true

      } else {
        // console.log($scope.data.tableData[$scope.tab.data.index], 'ggg');
        $scope.form.shipName = $scope.editData.shipName
        $scope.form.shipAddress.street = $scope.editData.shipAddress.street
        $scope.form.shipAddress.city = $scope.editData.shipAddress.city
        $scope.form.shipAddress.pincode = $scope.editData.shipAddress.pincode
        $scope.form.shipState = $scope.editData.shipState
        $scope.form.shipGst = $scope.editData.shipGst
        $scope.all = false
      }
    }

  })

  $scope.$watch('form.billAddress', function(newValue, oldValue) {

    if ($scope.form.isDetails == true) {
      $scope.form.shipAddress.street = $scope.form.billAddress.street
      $scope.form.shipAddress.city = $scope.form.billAddress.city
      $scope.form.shipAddress.pincode = $scope.form.billAddress.pincode
    }
  }, true)

  $scope.$watch('form.billState', function(newValue, oldValue) {

    if ($scope.form.isDetails == true) {
      $scope.form.shipState = $scope.form.billState
    }
  })




  $scope.addTableRow = function(indx) {
    if ($scope.products.length > 0) {
      var obj = $scope.products[$scope.products.length - 1]
      if (obj.part_no.length == 0) {
        Flash.create('danger', 'Please Fill Previous Row Data')
        return
      }
    }
    $scope.products.push({
      pk: '',
      part_no: '',
      description_1: '',
      qty: 0,
      customs_no: '',
      price: 0,
      taxableprice: 0,
      cgst: 0,
      cgstVal: 0,
      sgst: 0,
      sgstVal: 0,
      igst: 0,
      igstVal: 0,
      total: 0
    });
  }

  $scope.deleteData = function(pkVal, idx) {
    console.log(pkVal, idx);
    if (pkVal == undefined) {
      $scope.products.splice(idx, 1)
      return
    } else {
      $http({
        method: 'DELETE',
        url: '/api/importexport/iminvoiceQty/' + pkVal + '/'
      }).
      then(function(response) {
        $scope.products.splice(idx, 1)
        Flash.create('success', 'Deleted Successfully')
        return
      })
    }
  }

  $scope.productSearch = function(query) {
    return $http.get('/api/importexport/products/?limit=10&search=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.calculate = function() {
    for (var i = 0; i < $scope.products.length; i++) {
      console.log($scope.gstcode, $scope.gstCal, 'kkkkkkkkkkkkkkkkkkk');
      if ($scope.gstcode === $scope.gstCal) {
        $scope.products[i].cgst = 9
        $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
        $scope.products[i].sgst = 9
        $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
        $scope.products[i].igst = 0
        $scope.products[i].igstVal = 0
      } else {
        $scope.products[i].cgst = 0
        $scope.products[i].cgstVal = 0
        $scope.products[i].sgst = 0
        $scope.products[i].sgstVal = 0
        $scope.products[i].igst = 18
        $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
      }
      $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
    }
  }


  var gstData = '29AABCB6326Q1Z6'
  $scope.$watch('form.billGst', function(newValue, oldValue) {
    if (newValue != undefined) {
      $scope.gstcode = gstData.substring(0, 2)
      $scope.gstCal = newValue.substring(0, 2)
      $scope.form.billCode = newValue.substring(0, 2)
      $scope.calculate()
    }
  })
  $scope.$watch('form.shipGst', function(newValue, oldValue) {
    if (newValue != undefined) {
      $scope.form.shipCode = newValue.substring(0, 2)
    }
  })




  $scope.$watch('products', function(newValue, oldValue) {
    var pkList = []
    for (var i = 0; i < newValue.length; i++) {


      if (typeof newValue[i].part_no == 'object') {
        var ppk = newValue[i].part_no.pk
        delete newValue[i].part_no.pk
        if (pkList.indexOf(newValue[i].part_no.part_no) >= 0) {
          newValue[i].part_no = ''
          Flash.create('danger', 'This Product Has Already Added')
          return
        } else {
          pkList.push(newValue[i].part_no.part_no)
        }
        $scope.products[i] = newValue[i].part_no
        $scope.products[i].product = ppk
        $scope.products[i].qty = 1
        $scope.products[i].taxableprice = parseFloat((newValue[i].part_no.price * $scope.products[i].qty).toFixed(2))
        $scope.calculate()
      } else {
        pkList.push(newValue[i].part_no)
        $scope.products[i].price = parseFloat(newValue[i].price)
        $scope.products[i].taxableprice = parseFloat((newValue[i].price * newValue[i].qty).toFixed(2))
        $scope.products[i].cgst = newValue[i].cgst
        $scope.products[i].cgstVal = parseFloat((($scope.products[i].cgst * $scope.products[i].taxableprice) / 100).toFixed(2))
        $scope.products[i].sgst = newValue[i].sgst
        $scope.products[i].sgstVal = parseFloat((($scope.products[i].sgst * $scope.products[i].taxableprice) / 100).toFixed(2))
        $scope.products[i].igst = newValue[i].igst
        $scope.products[i].igstVal = parseFloat((($scope.products[i].igst * $scope.products[i].taxableprice) / 100).toFixed(2))
        $scope.products[i].total = parseFloat(($scope.products[i].taxableprice + $scope.products[i].cgstVal + $scope.products[i].sgstVal + $scope.products[i].igstVal).toFixed(2))
      }
    }

  }, true)
  // $scope.$watch('v.customs_no', function(newValue, oldValue) {
  //   console.log(oldValue,"hhhhhsssssssssmmnnnnnnnnn");
  //   // if(newValue == true) {
  //     console.log(newValue,"hhhhhsssssssssmmnnnnnnnnn");
  //     $scope.v={
  //       customs_no:newValue,
  //       pk:null
  //     }
  //   $http({
  //     method: 'PATCH',
  //     url: '/api/importexport/product/' + $scope.v.pk + '/',
  //     data: $scope.v.customs_no,
  //   }).
  //   then(function(response) {
  //     $scope.customs_no = response.data
  //     console.log($scope.customs_no);
  //     Flash.create('success', 'HSN updated');
  //
  // })
  //   // }
  //
  // },true)

  $scope.UpdateHSN = function(pk) {
    console.log(pk, "hhhhssssnnnnnnnnnn");
    for (var i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].description_1.length > 0) {
        if (!$scope.products[i].pk) {
          var sendVal = {

            customs_no: $scope.products[i].customs_no,

          }

        }

      }
    }
    $http({
      method: 'PATCH',
      url: '/api/importexport/products/' + pk + '/',
      data: sendVal,
    }).
    then(function(response) {
      $scope.customs_no = response.data
      console.log($scope.customs_no);
      Flash.create('success', 'HSN updated');
    })
  }
  $scope.saveInvoice = function(pk) {

    if ($scope.form.invoiceNumber == null || $scope.form.invoiceNumber.length == 0) {
      Flash.create('danger', 'Invoice No. Is Required')
      return
    }
    // console.log($scope.form);
    if ($scope.form.hasOwnProperty('project')) {
      delete $scope.form.project
    }

    var method = 'POST'
    var url = '/api/importexport/iminvoice/'
    $scope.form.billAddress = JSON.stringify($scope.form.billAddress)
    $scope.form.shipAddress = JSON.stringify($scope.form.shipAddress)
    if ($scope.form.pk) {
      method = 'PATCH'
      url += $scope.form.pk + '/'
    }
    if (typeof $scope.form.invoiceDate == 'object') {
      $scope.form.invoiceDate = $scope.form.invoiceDate.toJSON().split('T')[0]
    }
    $http({
      method: method,
      url: url,
      data: $scope.form,
    }).
    then(function(response) {

      for (var i = 0; i < $scope.products.length; i++) {
        if ($scope.products[i].description_1.length > 0) {
          if (!$scope.products[i].pk) {
            var sendVal = {
              product: $scope.products[i].product,
              invoice: response.data.pk,
              part_no: $scope.products[i].part_no,
              description_1: $scope.products[i].description_1,
              customs_no: $scope.products[i].customs_no,
              price: $scope.products[i].price,
              qty: $scope.products[i].qty,
              taxableprice: $scope.products[i].taxableprice,
              cgst: $scope.products[i].cgst,
              cgstVal: $scope.products[i].cgstVal,
              sgst: $scope.products[i].sgst,
              sgstVal: $scope.products[i].sgstVal,
              igst: $scope.products[i].igst,
              igstVal: $scope.products[i].igstVal,
              total: $scope.products[i].total,
              flag: $scope.form.flag
            }
            var url = '/api/importexport/iminvoiceQty/'
            var method = 'POST'
          } else {
            var sendVal = {
              product: $scope.products[i].product.pk,
              invoice: response.data.pk,
              part_no: $scope.products[i].part_no,
              description_1: $scope.products[i].description_1,
              customs_no: $scope.products[i].customs_no,
              price: $scope.products[i].price,
              qty: $scope.products[i].qty,
              taxableprice: $scope.products[i].taxableprice,
              cgst: $scope.products[i].cgst,
              cgstVal: $scope.products[i].cgstVal,
              sgst: $scope.products[i].sgst,
              sgstVal: $scope.products[i].sgstVal,
              igst: $scope.products[i].igst,
              igstVal: $scope.products[i].igstVal,
              total: $scope.products[i].total,
            }

            var url = '/api/importexport/iminvoiceQty/' + $scope.products[i].pk + '/'
            var method = 'PATCH'
          }
          $http({
            method: method,
            url: url,
            data: sendVal,
          }).
          then((function(i) {
            return function(response) {
              $scope.products[i].pk = response.data.pk;
            }
          })(i))
        }
      }
      $timeout(function() {
        Flash.create('success', 'Saved');
        if (!$scope.form.pk) {
          $scope.resetData()
        }
      }, 1500);

    })
  }
})
app.controller("businessManagement.importexport.invoice.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout, ) {
  $http({
    url: '/api/importexport/iminvoice/' + $stateParams.id + '/',
    method: 'GET',
  }).then(function(response) {
    $scope.form = response.data

    $http.get('/api/importexport/iminvoiceQty/?invoice=' + $scope.form.pk).
    then(function(response) {
      $scope.products = response.data
    })
    $scope.data = $scope.form
    if (typeof $scope.data.billAddress === 'object') {
      $scope.data.billAddress = $scope.data.billAddress
    } else {
      $scope.data.billAddress = JSON.parse($scope.data.billAddress)
    }
    if (typeof $scope.data.shipAddress === 'object') {
      $scope.data.shipAddress = $scope.data.shipAddress
    } else {
      $scope.data.shipAddress = JSON.parse($scope.data.shipAddress)
    }



    $scope.products = []
    // $scope.getDetails($scope.data.pk)
  })
  $scope.lockInvoice = function(pk) {
    var datatosSend = {
      lockInvoice: 'true'
    }
    $http({
      method: 'PATCH',
      url: '/api/importexport/iminvoice/' + pk + '/',
      data: datatosSend,
    }).
    then(function(response) {
      $scope.lockInvoice = response.data
      Flash.create('success', 'Invoice Locked');

    })
  }
})
//-------------------------------------invoices-------------------------------------------
//-------------------------------------invoices-------------------------------------------
app.controller("businessManagement.importexport.deliveryChallan", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {

  $scope.limit = 5
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()
  });
  $scope.fetchData = function() {
    $scope.true = 'true'
    let url = '/api/importexport/deliveryChallan/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&flag=' + $rootScope.formToggle.toggleMain

    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results

      $scope.count = response.data.count
    })
  }
  $scope.fetchData()

})
app.controller("businessManagement.importexport.deliveryChallan.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  if ($state.is('businessManagement.importexport.viewDeliverychallan')) {
    $http({
      url: '/api/importexport/deliveryChallan/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data
      $scope.materialIssue = $scope.form.materialIssue.materialIssue
    })

  }
})
//-------------------------------------delierychallan-------------------------------------------------
app.controller("businessManagement.importexport.stockReport", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()


  });

  if ($rootScope.formToggle.toggleMain) {
    $scope.flagValue = 'True'
  } else {
    $scope.flagValue = 'False'
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/importexport/stockCheckReport/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&flag=' + $rootScope.formToggle.toggleMain
    if ($scope.search.query.length > 0) {
      url = url + '&pk=' + $scope.search.query

    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results

      $scope.count = response.data.count
    })
  }
  $scope, data = $scope.allData
  $scope.fetchData()

  $scope.createStock = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.stockReport.create.html',
      backdrop: false,
      size: 'md',
      resolve: {
        flag: function() {
          return $scope.flagValue;
        }
      },
      controller: function($scope, flag, $uibModalInstance) {
        $scope.flag = flag

        $scope.products = []
        $scope.getAll = function() {
          $http({
            method: 'GET',
            url: '/api/importexport/stockCheck/?flag=' + flag
          }).
          then(function(response) {
            $scope.count = response.data[0].count
            $scope.data = response.data[0].data
            if ($scope.data.pk != undefined) {
              $http({
                method: 'GET',
                url: '/api/importexport/stockCheckItem/?stockReport=' + $scope.data.pk + '&flag=' + flag
              }).
              then(function(response) {
                $scope.products = response.data
                return
              })
            } else {
              $scope.products = []
              return
            }

          })
        }
        $scope.getAll()

        $scope.productSearch = function(query) {
          return $http.get('/api/importexport/products/?search=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.refresh = function() {
          $scope.form = {
            product: '',
            qty: 1
          }
        }
        $scope.refresh()
        $scope.saveReport = function() {
          $http({
            method: 'POST',
            url: '/api/importexport/stockCheckReport/',
            data: {
              flag: flag
            },
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $scope.getAll()
          })
        }


        $scope.addProduct = function() {
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].product.pk == $scope.form.product.pk) {
              Flash.create('danger', 'Product already added, Edit for changes');
              if ($scope.products[i].pk) {
                $scope.form.product = $scope.products[i].product
                $scope.form.qty = $scope.products[i].qty
                $http({
                  method: 'DELETE',
                  url: '/api/importexport/stockCheckItem/' + $scope.products[i].pk + '/'
                }).
                then(function(response) {
                  $scope.products.splice(i, 1)
                })
                return
              } else {
                $scope.form.product = $scope.products[i].product
                $scope.form.qty = $scope.products[i].qty
                $scope.products.splice(i, 1)
                return
              }
            }
          }
          if ($scope.form.product == '' || typeof $scope.form.product != 'object') {
            Flash.create('danger', 'Please Select a product');
            return
          }
          $scope.products.push({
            product: $scope.form.product,
            qty: $scope.form.qty,
          });
          $scope.refresh()
        }

        $scope.saveAll = function() {
          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].pk) {
              var method = 'PATCH'
              var url = '/api/importexport/stockCheckItem/' + $scope.products[i].pk + '/'
            } else {
              var method = 'POST'
              var url = '/api/importexport/stockCheckItem/'
            }
            if (flag == 'True') {
              var value = true
            } else {
              var value = false
            }
            var dataToSend = {
              product: $scope.products[i].product.pk,
              qty: $scope.products[i].qty,
              stockReport: $scope.data.pk,
              flag: value,
            }
            $http({
              method: method,
              url: url,
              data: dataToSend,
            }).
            then(function(response) {
              Flash.create('success', 'Saved');
              $scope.products[i - 1] = response.data
            })
          }
        }

        $scope.deleteData = function(idx) {
          for (var i = 0; i < $scope.products.length; i++) {
            if (i == idx) {
              if ($scope.products[i].pk) {
                $http({
                  method: 'DELETE',
                  url: '/api/importexport/stockCheckItem/' + $scope.products[i].pk + '/'
                }).
                then(function(response) {
                  Flash.create('success', 'Deleted');
                  $scope.products.splice(idx, 1)
                  return
                })
              } else {
                $scope.products.splice(idx, 1)
                return
              }
            }
          }
        }
        $scope.close = function() {
          $uibModalInstance.dismiss();
        }
      },
    });
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }


})
app.controller("businessManagement.importexport.stockReportItem", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {



  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()


  });

  if ($rootScope.formToggle.toggleMain) {
    $scope.flagValue = 'True'
  } else {
    $scope.flagValue = 'False'
  }


})
//--------------------------------------stockreport------------------------------------------------
app.controller("businessManagement.importexport.report", function($scope, $sce, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  $scope.form = {
    comm_nr: null,
    supplier: null,
  }
  var toDay = new Date()
  $scope.dateForm = {
    'start': toDay,
    'end': toDay
  }
  $scope.datewiseInvoice = function(){
    var s = $scope.dateForm.start
    s = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1)

    var d = $scope.dateForm.end
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

     window.location.href = '/api/importexport/datewiseinvoiceReport/?start='+ s.toJSON().split('T')[0] + '&end=' + d.toJSON().split('T')[0]
    // $http({
    //   method: 'POST',
    //   url: '/api/importexport/datewiseinvoiceReport/?start='+ s.toJSON().split('T')[0] + '&end=' + d.toJSON().split('T')[0],
    // }).
    // then(function(response) {
    //   console.log(response.data,"jjjj");
    //   // $scope.options1 = response.data
    // })
  }
  // $scope.$watch('[dateForm.start,dateForm.end]', function(newValue, oldValue) {
  //
  //   console.log($scope.dateForm);
  //   var s = $scope.dateForm.start
  //   s = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1)
  //   console.log(s);
  //
  //   var d = $scope.dateForm.end
  //   d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2)
  //   console.log(d);
  //
  // }, true)

  $rootScope.$on('customEvent', function(event, message) {
    $state.reload()
  });

  if ($rootScope.formToggle.toggleMain) {
    $scope.flagValue = 'True'
  } else {
    $scope.flagValue = 'False'
  }

  $http({
    method: 'GET',
    url: '/api/importexport/getCmrList/?flag=' + $scope.flagValue,
  }).
  then(function(response) {
    $scope.options = response.data
  })
  $http({
    method: 'GET',
    url: '/api/ERP/service/',
  }).
  then(function(response) {
    $scope.options1 = response.data
  })

  $http({
    method: 'GET',
    url: '/api/importexport/vendor/',
  }).
  then(function(response) {
    $scope.supplier = response.data
    $scope.supplierAll = [{
      pk: 'all',
      name: 'All Supplier'
    }]
    for (var i = 0; i < response.data.length; i++) {
      var pk = response.data[i].pk
      var name = response.data[i].name
      var obj = {
        pk: pk,
        name: name
      }
      $scope.supplierAll.push(obj)
    }
  })

  $http({
  method: 'GET',
  url: '/api/importexport/complaintManagement/'
}).
then(function(response) {
  $scope.options2 = response.data
})

$scope.idSearch = function(query) {
return $http.get('/api/importexport/complaintManagement/?complaintId=' + query).
then(function(response) {
  return response.data;
})
};

  $scope.downloadPurchase = function() {
    Flash.create('danger', 'Please Select Purchase Report Comm No & Supplier');
  }

  $scope.downloadPurchase1 = function() {
    Flash.create('danger', 'Please Select Consumtion Report Comm No & Supplier');
  }

  $scope.formConsumtion = {
    comm_nr: null,
    supplier: null,
  }
  $scope.selectAll = function(value) {
    if (value == 'all') {
      var link = "/api/importexport/consumptionewiseReport/?commnr=" + $scope.formConsumtion.comm_nr + "&supplier=" + $scope.formConsumtion.supplier + "&all=True&flag=" + $scope.flagValue
      $scope.url = $sce.trustAsResourceUrl(link)
    } else {
      var link = "/api/importexport/consumptionewiseReport/?commnr=" + $scope.formConsumtion.comm_nr + "&supplier=" + $scope.formConsumtion.supplier + "&all=False&flag=" + $scope.flagValue
      $scope.url = $sce.trustAsResourceUrl(link)
    }
  }
  $scope.selectConsumtion = function(value) {
    if ($scope.formConsumtion.supplier == 'all') {
      var link = "/api/importexport/consumptionewiseReport/?commnr=" + $scope.formConsumtion.comm_nr + "&supplier=" + $scope.formConsumtion.supplier + "&all=True&flag=" + $scope.flagValue
      $scope.url = $sce.trustAsResourceUrl(link)
    } else {
      var link = "/api/importexport/consumptionewiseReport/?commnr=" + $scope.formConsumtion.comm_nr + "&supplier=" + $scope.formConsumtion.supplier + "&all=False&flag=" + $scope.flagValue
      $scope.url = $sce.trustAsResourceUrl(link)
    }
  }
  $scope.formStock = {
    supplier: null,
  }
  $scope.downloadPurchase2 = function() {
    Flash.create('danger', 'Please Select Stock Available Report Supplier ');
  }

  $scope.createReportData = function() {
    $http({
      method: 'GET',
      url: '/api/importexport/createStockReportData/?flag=' + $scope.flagValue,
    }).
    then(function(response) {
      Flash.create('success', response.data.status);
    }, function(err) {
      Flash.create('warning', err.status + ' : ' + err.statusText);
    })
  }

})
//---------------------------------report------------------------------------------------------------
app.controller("businessManagement.importexport.CMS", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout, ) {

  $scope.form = {
    searchValue: '',
    sort: '',
    page: 0,
  }
  $scope.limit = 8
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/importexport/complaintManagement/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.search.query.length > 0) {
      url = url + '&complaintRef=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.products = response.data.results
      $scope.count = response.data.count
      // console.log($scope.products);
    })
  }
  $scope.fetchData()

  $scope.Delete = function(pk) {
    $http({
      method: 'DELETE',
      url: '/api/importexport/complaintManagement/' + pk + "/",
    }).then(function(response) {
      Flash.create("success", "Complaint deleted")
      $scope.fetchData();
    });
  }
  $scope.changeState = function(pk) {
    $state.go('businessManagement.importexport.CMSView', {
      id: pk
    });
  };

})
app.controller("businessManagement.importexport.CMS.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout, ) {

  if ($state.is('businessManagement.importexport.editCMS')) {
    $scope.form = {
      customer: '',
      contact: '',
      complaintRef: '',
      machine: '',
      description: '',
      complaintType: '',
      errorCode: null,
      status: 'Open',
      serviceReportNo: '',
      attr1: '',
      attr2: '',
      attr3: '',
      attr4: '',
      closedDate: '',
      machineRunning: '',
      comm_nr: ''
    }
    $http({
      url: '/api/importexport/complaintManagement/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.form = response.data

      $scope.complaintEdit = function() {
        if ($scope.form.date == '') {
          Flash.create('warning', 'Please Add Closing Date')
          return
        } else if (typeof $scope.form.date == 'object') {

          $scope.form.date = $scope.form.date.toJSON().split('T')[0]

        }

        var data = {
          customer: $scope.form.customer.pk,
          contact: $scope.form.contact,
          complaintRef: $scope.form.complaintRef,
          machine: $scope.form.machine,
          description: $scope.form.description,
          complaintType: $scope.form.complaintType,
          errorCode: $scope.form.errorCode,
          status: $scope.form.status,
          serviceReportNo: $scope.form.serviceReportNo,
          attr1: $scope.form.attr1,
          attr2: $scope.form.attr2,
          attr3: $scope.form.attr3,
          attr4: $scope.form.attr4,
          machineRunning: $scope.form.machineRunning,
          comm_nr: $scope.form.comm_nr

        }

        var url = '/api/importexport/complaintManagement/' + $stateParams.id + "/"
        method = 'PATCH';

        $http({
          method: method,
          url: url,
          data: data
        }).then(function(response) {
          Flash.create('success', 'Updated');
          $scope.resetForm();
        })
      }
    })
  }




  $scope.genericUserSearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };


  $scope.resetForm = function() {
    $scope.form = {
      customer: '',
      contact: '',
      complaintRef: '',
      machine: '',
      description: '',
      complaintType: '',
      errorCode: null,
      status: 'Open',
      serviceReportNo: '',
      attr1: '',
      attr2: '',
      attr3: '',
      attr4: '',
      closedDate: '',
      machineRunning: '',
      RefurbishedBind: '',
      comm_nr: ''
    }
  }
  $scope.resetForm()

  $scope.complaintProcessing = false;

  $scope.complaintCreation = function() {
    if ($scope.form.date == '') {
      Flash.create('warning', 'Please Add Closing Date')
      return
    } else if (typeof $scope.form.date == 'object') {

      $scope.form.date = $scope.form.date.toJSON().split('T')[0]

    }
    $scope.complaintProcessing = true;

    var data = {
      customer: $scope.form.customer.pk,
      contact: $scope.form.contact,
      complaintRef: $scope.form.complaintRef,
      machine: $scope.form.machine,
      description: $scope.form.description,
      complaintType: $scope.form.complaintType,
      errorCode: $scope.form.errorCode,
      status: $scope.form.status,
      serviceReportNo: $scope.form.serviceReportNo,
      attr1: $scope.form.attr1,
      attr2: $scope.form.attr2,
      attr3: $scope.form.attr3,
      attr4: $scope.form.attr4,
      machineRunning: $scope.form.machineRunning,
      RefurbishedBind: $scope.form.RefurbishedBind,
      comm_nr: $scope.form.comm_nr
    }
    var method = 'POST'
    var url = '/api/importexport/complaintManagement/'

    $http({
      method: method,
      url: url,
      data: data
    }).then(function(response) {
      if ($scope.form.pk == null) {
        Flash.create('success', 'New complaint Created');
        $scope.resetForm();
      } else {
        Flash.create('success', 'Complaint Updated');
        $scope.resetForm();

      }
      $scope.complaintProcessing = false;

    })
  }
  $scope.complaintUpdate = function(pk) {
    if ($scope.form.date == '') {
      Flash.create('warning', 'Please Add Closing Date')
      return
    } else if (typeof $scope.form.date == 'object') {

      $scope.form.date = $scope.form.date.toJSON().split('T')[0]

    }

    var data = {
      customer: $scope.form.customer.pk,
      contact: $scope.form.contact,
      complaintRef: $scope.form.complaintRef,
      machine: $scope.form.machine,
      description: $scope.form.description,
      complaintType: $scope.form.complaintType,
      errorCode: $scope.form.errorCode,
      status: $scope.form.status,
      serviceReportNo: $scope.form.serviceReportNo,
      attr1: $scope.form.attr1,
      attr2: $scope.form.attr2,
      attr3: $scope.form.attr3,
      attr4: $scope.form.attr4,
      machineRunning: $scope.form.machineRunning,
      RefurbishedBind: $scope.form.RefurbishedBind,
      comm_nr: $scope.form.comm_nr


    }
    var method = 'PATCH'
    var url = '/api/importexport/complaintManagement/' + pk + "/"

    $http({
      method: method,
      url: url,
      data: data
    }).then(function(response) {

      Flash.create('success', 'Updated');
      $scope.resetForm();




    })
  }
});
app.controller("businessManagement.importexport.CMSView", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $permissions, $timeout, ) {
  $scope.me = $users.get('mySelf');
  $scope.complaintId = $stateParams.id

  $scope.fetchData = function() {
    let url = '/api/importexport/complaintManagement/?complaintId=' + $scope.complaintId

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }
  $scope.fetchData()
  $scope.changeState = function() {
    $state.go('businessManagement.importexport.CMS');
  }


  $scope.sentForApproval = function(pk) {
    var sendStatus = {
      status: 'Sent for closing approval',
    }
    $http({
      method: 'PATCH',
      url: '/api/importexport/complaintManagement/' + pk + '/',
      data: sendStatus,
    }).
    then(function(response) {
      Flash.create('success', 'Sent for approval');
      $scope.fetchData()
      link = window.location

      $http({
        method: 'POST',
        url: '/api/importexport/complaintEmail/',
        data: {
          'pkValue': pk,
          'link': link
        },
      }).
      then(function(response) {
        Flash.create('success', 'Email Sent');
        $scope.fetchData()
      })
    })
  }


  $scope.complaintApproval = function(pk) {
    var sendStatus = {
      status: 'Closed',
      is_CloseApproved: 'true',

    }
    $http({
      method: 'PATCH',
      url: '/api/importexport/complaintManagement/' + pk + '/',
      data: sendStatus,
    }).
    then(function(response) {
      Flash.create('success', 'Approved');
      $scope.fetchData()
    })
  }



  $scope.complaintRejection = function() {

    var sendStatus = {
      status: 'Open',
      is_CloseApproved: 'false',
      closedBy: '',

    }
    $http({
      method: 'PATCH',
      url: '/api/importexport/complaintManagement/' + $scope.form.pk + '/',
      data: sendStatus,
    }).
    then(function(response) {
      Flash.create('success', 'Rejected');
      $scope.fetchData()
    })
  }

  $scope.closeForm = function(pk) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.CMS.closeform.html',
      size: 'md',
      backdrop: false,
      resolve: {
        data: function() {
          return pk;

        },
      },


      controller: function($scope, Flash, $http, $timeout, $uibModalInstance, data) {
        var date = new Date().toJSON().split('T')[0]
        $scope.form = {
          closedBy: '',
          date: new Date(),
        }

        $scope.genericUserSearch1 = function(query) {
          return $http.get('/api/HR/users/?registeredBy=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.complaintClose = function() {
          if ($scope.form.date == '') {
            Flash.create('warning', 'Please Add Tentative Closing Date')
            return
          } else if (typeof $scope.form.date == 'object') {
            $scope.form.date = $scope.form.date.toJSON().split('T')[0]
          }
          var dataToSend = {
            closedBy: $scope.form.closedBy.pk,
            closedDate: $scope.form.date
          }
          var url = '/api/importexport/complaintManagement/' + pk + '/'
          method = 'PATCH'
          $scope.display = true;
          $http({
            method: method,
            url: url,
            data: dataToSend,

          }).then(function(response) {
            Flash.create('success', 'complaint closed successfully!')
            $scope.display = true;
            $uibModalInstance.dismiss()
          })

        }

        $scope.close = function() {
          $uibModalInstance.dismiss()
        }

      }
    }).result.then(function() {}, function() {
      $scope.fetchData()
    });
  }
})
//--------------------------------------complaints-----------------------------------------------------
