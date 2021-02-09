app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement', {
      url: "/businessManagement",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/businessManagement.html',
        },
        "menu@businessManagement": {
          templateUrl: '/static/ngTemplates/businessManagement.menu.html',
          controller: 'businessManagement.menu'
        },
        "@businessManagement": {
          templateUrl: '/static/ngTemplates/businessManagement.dash.html',
          controller: 'businessManagement'
        }
      }
    })
    .state('businessManagement.configure', {
      url: "/configure",
      templateUrl: '/static/ngTemplates/app.finance.configure.html',
      controller: 'businessManagement.configure'
    })

});

app.controller('businessManagement.templates', function($scope, $http, $state, $uibModal, Flash, $aside,$timeout,$sce) {

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
    $aside.open({
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

app.controller('businessManagement.KloudERPdelails', function($scope, $http, $state, $uibModal) {

  $scope.fetchDivision = function() {
    $http({
      method: 'GET',
      url: '/api/organization/divisions/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.data = response.data;
    })
  }

  $scope.updateOrg = function() {
    dataToSend = {
      simpleMode: $scope.data.simpleMode,
      telephony: $scope.data.telephony,
      messaging: $scope.data.messaging,
      locked: $scope.data.locked
    }
    $http({
      method: 'PATCH',
      url: '/api/organization/divisions/' + $state.params.id + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
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

app.controller('businessManagement.configure', function($scope, $http) {


});


app.controller('businessManagement', function($scope, $users, Flash, $state) {

  $state.go('businessManagement.CRM')
  return;

  var ctx = document.getElementById("myChart");
  var data = {
    labels: [

    ],
    datasets: [{
      data: [300, 50],
      backgroundColor: [
        "#197dcf",
        "#ECECEC"
      ],

    }]
  };
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI,
      cutoutPercentage: 80
    }
  });
  var ctxx = document.getElementById("myChart1");
  var datas = {
    labels: [

    ],
    datasets: [{
      data: [140, 300],
      backgroundColor: [
        "#db8f36",
        "#ECECEC"
      ],

    }]
  };
  var myDoughnutChart = new Chart(ctxx, {
    type: 'doughnut',
    data: datas,
    options: {
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI,
      cutoutPercentage: 80,
    }
  });


  $scope.barlabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];

  $scope.bardata = [
    [28, 48, 40, 19, 86, 27, 90, 34, 55, 21, 32, 32, 32, 45, 56, 45]
  ];

  new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: ['sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales'],
      datasets: [{
        data: [860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, ],
        label: "",
        borderColor: "#f53838",
        fill: false,
        lineTension: 0,
        pointRadius: 4,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      }
    }
  });
  new Chart(document.getElementById("line-chart1"), {
    type: 'line',
    data: {
      labels: ['sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales'],
      datasets: [{
        data: [860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, ],
        label: "",
        borderColor: "#27b2ed",
        fill: false,
        lineTension: 0,
        pointRadius: 4,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      }
    }
  });
  new Chart(document.getElementById("line-chart2"), {
    type: 'line',
    data: {
      labels: ['sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales', 'sales'],
      datasets: [{
        data: [860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, -783, 2478, 860, -114, 1060, -306, 107, -888, -133, 1000, ],
        label: "",
        borderColor: "#ebdc1a",
        fill: false,
        lineTension: 0,
        pointRadius: 4,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      }
    }
  });
});

app.controller('businessManagement.menu', function($scope, $users, Flash ){
  // main businessManagement tab default page controller

  $scope.apps = [];

});
