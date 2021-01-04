app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.organization.units', {
      url: "/units",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.organization.units.html',
          controller: 'workforceManagement.organization.units',
        }
      }
    })
});
app.controller("workforceManagement.organization.units", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.organization.unit.item.html',
  }, ];

  var multiselectOptions = [{
    icon: 'fa fa-plus',
    text: 'Upload'
  } ];
  $scope.config = {
    views: views,
    url: '/api/organization/unit/',
    searchField: 'name',
    itemsNumPerView: [12, 24, 48],
    multiselectOptions:multiselectOptions
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);
    if (action == 'Upload') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.organization.units.bulkUpload.html',
        size: 'sm',
        backdrop: false,
        controller: function($scope, $uibModalInstance, $rootScope) {
          $scope.close = function(){
            $uibModalInstance.dismiss()
          }
          $scope.form = {
            'exFile': emptyFile,
          }
          $scope.uploading = false
          $scope.postFile = function(){
            var toSend = new FormData()
            toSend.append('exFile', $scope.form.exFile);
            $scope.uploading = true
            $http({
              method: 'POST',
              url: '/api/organization/unitsBulkUpload/',
              data: toSend,
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }).
            then(function(response) {
              $scope.uploading = false
              Flash.create('success',response.data.count + ' units added!')
              $scope.form = {
                'exFile': emptyFile,
              }
              $uibModalInstance.dismiss()
            }, function(err) {
              Flash.create('danger', 'Error while uploading file');
              $scope.uploading = false
            })
          }

        },
      }).result.then(function() {
      }, function() {
        $rootScope.$broadcast('forceRefetch', {});

      });
    }
    else{
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          if (action == 'edit') {
            var title = 'Edit :';
            var appType = 'unitEditor';
          } else if (action == 'info') {
            var title = 'Details :';
            var appType = 'unitInfo';
          }
          $scope.addTab({
            title: title + $scope.data.tableData[i].name,
            cancel: true,
            app: appType,
            data: {
              pk: target,
              index: i,
              unit: $scope.data.tableData[i]
            },
            active: true
          })

        }
      }
    }


  }




  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
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
  //customer search pk



});


app.controller("workforceManagement.organization.unit.info", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.unit = $scope.tab.data.unit;


});


app.controller("workforceManagement.organization.units.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.me = $users.get('mySelf');
  console.log($scope.me);

  $scope.pinSearch = function(query) {
    return $http.get('/api/ERP/genericPincode/?limit=10&pincode__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.unitsSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/unit/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data);
      return response.data;
    })
  };
  // $scope.units = [];
  // $scope.unititems = function() {
  //   console.log('aaaaaaaaaaaaaaaaaaaaaa', $scope.form.parent);
  //   $scope.units.push($scope.form.parent)
  //   $scope.form.parent = [];
  // }
  //
  // $scope.deleteitem = function(index) {
  //   $scope.units.splice(index, 1);
  // }


  console.log($scope.tab);

  $scope.resetForm = function() {
    $scope.form = {
      'name': '',
      'address': '',
      'pincode': '',
      'pincode.city': '',
      'pincode.state': '',
      'pincode.country': '',
      'mobile': '',
      'telephone': '',
      'fax': '',
      'contacts': [],
      'l1': '',
      'l2': '',
      'division': '',
      'parent': '',
      'areaCode':'',
      'gstin':''
    }
  }


  $scope.units = [];
  if ($scope.tab != undefined) {
    $scope.mode = 'edit';
    $scope.form = $scope.tab.data.unit;
    $scope.units = $scope.form.units;
  } else {
    $scope.mode = 'new';
    $scope.resetForm();
  }



  $scope.save = function() {
    if (typeof $scope.form.pincode == 'object') {
      $scope.form.state = $scope.form.pincode.state;
      $scope.form.city = $scope.form.pincode.city;
      $scope.form.country = $scope.form.pincode.country;
      $scope.form.pincode = $scope.form.pincode.pincode;
    }
    console.log('entered');
    var f = $scope.form;
    var url = '/api/organization/unit/';

    // var parent = []
    // for (var i = 0; i < $scope.form.parent.length; i++) {
    //   parent.push($scope.form.parent[i].pk);
    // }
    console.log($scope.form.parent);
    console.log($scope.form);
    // for (var i = 0; i < $scope.units.length; i++) {
    //   $scope.form.units.push($scope.units[i].pk)
    // }






    // console.log('*',$scope.form.unit);

    var toSend = {
      name: f.name,
      address: f.address,
      pincode: f.pincode,
      city: f.city,
      state: f.state,
      country: f.country,
      mobile: f.mobile,
      contacts: f.contacts,
      division: f.division.pk,
      areaCode : f.areaCode,
      warehouse : f.warehouse
    }
    if (f.parent!=null && typeof f.parent=='object') {
      toSend.parent =  f.parent.pk
    }
    if (f.gstin!=null && typeof f.gstin=='string') {
      toSend.gstin =  f.gstin
    }

    if (f.telephone != null && f.telephone.length != 0  ) {
      toSend.telephone = f.telephone;
    }
    if (f.fax != null && f.fax.length != 0  ) {
      toSend.fax = f.fax;
    }
    if (f.l1 != null && f.l1.length != 0 ) {
      toSend.l1 = f.l1;
    }
    if (f.l2 != null && f.l2.length != 0 ) {
      toSend.l2 = f.l2;
    }

    // if (division != null) {
    //   toSend.division = division.pk;
    // } else {
    //   toSend.parent = parent;
    // }


    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += f.pk + '/'
    }


    $http({
      method: method,
      url: url,
      data: toSend,

    }).
    then(function(response) {
      $scope.form.pk = response.data.pk;
      Flash.create('success', 'Saved')
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    })
  }

  //find in another table

  $scope.divisionSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/divisions/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data);
      return response.data;
    })
  };


});
