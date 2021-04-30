
app.controller("workforceManagement.organization.companies", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {



});

app.controller("workforceManagement.organization.division.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, data, $uibModalInstance) {

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
});


app.controller("workforceManagement.organization.division.info", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside) {

  $scope.$watch('division.logoFile', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      // show the preview and save the logo
      // logo
      var fd = new FormData();
      if (newValue != emptyFile && newValue != null && typeof newValue!='string') {
        fd.append('logo', newValue)
      }
      $http({
        method: 'PATCH',
        url: '/api/organization/divisions/' + $scope.division.pk + '/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.division.logo = response.data.logo;
      })
    }
  })





  $scope.save = function() {
    var toSend = {
      name: $scope.division.name,
      website: $scope.division.website,
      pan: $scope.division.pan,
      cin: $scope.division.cin,
      // l1: $scope.division.l1,
      // l2: $scope.division.l2,
      upi : $scope.division.upi
    }

    $http({
      method: 'PATCH',
      url: '/api/organization/divisions/' + $scope.division.pk + '/',
      data: toSend
    })


  }

  $scope.pinSearch = function(query) {
    return $http.get('/api/ERP/genericPincode/?limit=10&pincode__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

$scope.saveUnit = function(){
  var toSend = {
    gstin: $scope.unitsData[0].gstin,
    address: $scope.unitsData[0].address,
  }

  if (typeof $scope.unitsData[0].pincode == 'object') {
    $scope.unitsData[0].state = $scope.unitsData[0].pincode.state;
    $scope.unitsData[0].city = $scope.unitsData[0].pincode.city;
    $scope.unitsData[0].country = $scope.unitsData[0].pincode.country;
    $scope.unitsData[0].pincode = $scope.unitsData[0].pincode.pincode;
    toSend.state = $scope.unitsData[0].state
    toSend.city = $scope.unitsData[0].city
    toSend.country = $scope.unitsData[0].country
    toSend.pincode = $scope.unitsData[0].pincode
  }

  $http({
    method: 'PATCH',
    url: '/api/organization/unit/'+$scope.unitsData[0].pk+'/',
    data : toSend
  }).
  then(function(response) {

  })


}


  $http({
    method: 'GET',
    url: '/api/organization/getMyDivision/'
  }).
  then(function(response) {
    $scope.division = response.data;
    $scope.getallUnits()
    $scope.getallPermissions()
    $scope.getallDepartments()
  })

  $scope.careateUnit = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.createunit.html',
      position: 'right',
      size: 'l',
      backdrop: true,
      resolve: {
        division: function() {
          return $scope.division
        },
        data: function() {
          if (data == undefined) {
            return data
          } else {
            return data
          }

        }

      },
      controller: 'workforceManagement.organization.company.units.form',
    }).result.then(function() {
      $scope.getallUnits();
    }, function() {
      $scope.getallUnits();
    })
  }


  $scope.createDepartment = function(depdata) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.createDepartment.html',
      position: 'right',
      size: 'l',
      backdrop: true,
      resolve: {
        data1: function() {
          return $scope.division
        },
        data: function() {
          if (depdata == undefined) {
            return depdata
          } else {
            return depdata
          }

        }
      },
      controller: 'workforceManagement.organization.company.Departments.form',
    }).result.then(function() {
      $scope.getallDepartments()
    }, function() {
      $scope.getallDepartments()
    })
  }
  $scope.createRole = function(roledata) {
    console.log({
      roledata
    });
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.createRole.html',
      size: 'md',
      backdrop: true,
      resolve: {
        roleDivision: function() {
          return $scope.division
        },
        roledata: function() {
          if (roledata == undefined) {
            return
          } else {
            return roledata
          }

        }
      },
      controller: 'workforceManagement.organization.company.Roles.form',
    }).result.then(function() {
      $scope.getallPermissions()
    }, function() {
      $scope.getallPermissions()
    })
  }

  $scope.editRolePermission = function(roledata) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.organization.editRoleApps.html',
      placement: 'right',
      size: 'xl',
      backdrop: true,
      resolve: {
        roleDivision: function() {
          return $scope.division
        },
        roledata: function() {
          if (roledata == undefined) {
            return
          } else {
            return roledata
          }

        }
      },
      controller: 'workforceManagement.organization.company.Roles.form',
    }).result.then(function() {
      $scope.getallPermissions()
    }, function() {
      $scope.getallPermissions()
    })
  }

  $scope.getallUnits = function() {
    $http({
      method: 'GET',
      url: '/api/organization/unit/?division=' + $scope.division.pk
    }).then(function(response) {
      $scope.unitsData = response.data
    })
  }


  $scope.getallPermissions = function() {
    $http({
      method: 'GET',
      url: '/api/organization/role/?division=' + $scope.division.pk
    }).then(function(response) {
      $scope.RolesData = response.data
    })
  }


  $scope.getallDepartments = function() {
    $http({
      method: 'GET',
      url: '/api/organization/departments/?division=' + $scope.division.pk
    }).then(function(response) {
      $scope.DepartmentsData = response.data
    })
  }


  $scope.delUnit = function(pk, indx) {
    $http({
      method: 'DELETE',
      url: '/api/organization/unit/' + pk + '/'
    }).then(function(response) {
      $scope.getallUnits()
      Flash.create('success', 'Deleted...!')
    })
  }

  $scope.delDepartment = function(pk, indx) {
    $http({
      method: 'DELETE',
      url: '/api/organization/departments/' + pk + '/'
    }).then(function(response) {
      $scope.getallDepartments()
      Flash.create('success', 'Deleted...!')
    })
  }

  $scope.delRole = function(pk, indx) {
    $http({
      method: 'DELETE',
      url: '/api/organization/role/' + pk + '/'
    }).then(function(response) {
      $scope.getallPermissions()
      Flash.create('success', 'Deleted...!')
    })
  }

});





app.controller("workforceManagement.organization.company.Roles.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, roleDivision, roledata) {









  if (roledata) {
    $scope.roleid = roledata.pk
  }

  $scope.getPermissionSuggestions = function(query) {
    return $http.get('/api/ERP/application/?name__contains=' + query)
  }

  $http({
    method: 'GET',
    url: '/api/ERP/application/?type=installed',
  }).
  then(function(response) {
    $scope.applications = response.data
  });

  $scope.homeType = 'Report'
  $http({
    method: 'GET',
    url: '/api/organization/homeChart/?type=' + $scope.homeType + '&division=' + roleDivision.pk,
  }).
  then(function(response) {
    $scope.reports = response.data
  });

  $scope.chartName = 'Chart'
  $http({
    method: 'GET',
    url: '/api/organization/homeChart/?type=' + $scope.chartName + '&division=' + roleDivision.pk,
  }).
  then(function(response) {
    $scope.charts = response.data
  });


  $scope.getPermissions = function(id) {
    $http({
      method: 'GET',
      url: '/api/organization/role/?id=' + id,
    }).
    then(function(response) {
      $scope.crole = response.data[0]
      for (var j = 0; j < $scope.crole.permissions.length; j++) {
        $scope.crole[$scope.crole.permissions[j].name] = true
      }
      for (var k = 0; k < $scope.crole.reports.length; k++) {
        $scope.crole[$scope.crole.reports[k].name] = true
      }
      for (var a = 0; a < $scope.crole.charts.length; a++) {
        $scope.crole[$scope.crole.charts[a].name] = true
      }
    });
  }

  $scope.getPermissions($scope.roleid);

  $scope.updateRole = function(value, role, app) {
    $http({
      method: 'POST',
      url: '/api/organization/updatePermission/',
      data: {
        value: value,
        role: role.pk,
        app: app.pk
      }
    }).
    then(function(response) {})
  }

  $scope.updateReportRole = function(value, role, report) {
    $http({
      method: 'POST',
      url: '/api/organization/updateReportsPermission/',
      data: {
        value: value,
        role: role.pk,
        report: report.pk
      }
    }).
    then(function(response) {})
  }


  $scope.updateChartRole = function(value, role, chart) {
    $http({
      method: 'POST',
      url: '/api/organization/updateChartsPermission/',
      data: {
        value: value,
        role: role.pk,
        chart: chart.pk
      }
    }).
    then(function(response) {})
  }


  $scope.updateUserPermissions = function(index) {
    var userData = $scope.tabs[index].data;
    if (userData.appsToAdd.length == 0) {
      Flash.create('warning', 'No new permission to add')
      return;
    }
    var apps = [];
    for (var i = 0; i < userData.appsToAdd.length; i++) {
      apps.push(userData.appsToAdd[i].pk)
    }
    var dataToSend = {
      user: getPK(userData.url),
      apps: apps,
    }
    $http({
      method: 'POST',
      url: '/api/ERP/permission/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


  $scope.resetForm = function() {
    $scope.form = {
      'name': '',
      'division': '',
      'permissions': [],
    }
  }
  $scope.resetForm()
  if (roledata != undefined) {
    $scope.mode = 'edit';
    $scope.form = roledata;
  } else {
    $scope.mode = 'new';
    $scope.resetForm();
  }



  $scope.save = function() {
    var f = $scope.form;
    console.log($scope.form.name, $scope.form.permission, "09909009");
    var url = '/api/organization/role/';

    var dataToSend = {
      'name': $scope.form.name,
      'division': roleDivision.pk,
      'permissions': $scope.form.permissions
    }
    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += f.pk + '/'
    }


    $http({
      method: method,
      url: url,
      data: dataToSend,
    }).
    then(function(response) {
      $scope.form.pk = response.data.pk;
      // $scope.fetchData();
      //  $scope.$broadcast('forceRefetch',)
      //    $scope.$broadcast('forcerefresh', response.data);
      //  $route.reload();
      if ($scope.mode == 'new') {
        Flash.create('success', 'Saved')
        $scope.getPermissions($scope.form.pk);
        $scope.mode = 'edit';
        // $scope.resetForm();
      }
    })
  }




  $scope.divSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/divisions/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

  $scope.unitSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/unit/?division__name__contains=' + $scope.form.division.name + '&&name_contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

  $scope.depSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/departments/?dept_name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

})
app.controller("workforceManagement.organization.company.Departments.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, data1, data) {

  console.log(data, "datadatadata");
  $scope.resetForm = function() {
    $scope.form = {

      'dept_name': '',
      'division': '',
      'contacts': []
    }
  }


  $scope.unit = [];
  if (data != undefined) {
    console.log();
    $scope.mode = 'edit';
    $scope.form = data;
  } else {
    $scope.mode = 'new';
    $scope.resetForm();
  }

  $scope.save = function() {
    console.log('entered');
    console.log($scope.unit);
    // $scope.form.units = [ ];
    for (var i = 0; i < $scope.unit.length; i++) {
      $scope.form.units.push($scope.unit[i].pk)
    }
    var f = $scope.form;
    var url = '/api/organization/departments/';

    var datatoSend = {
      'dept_name': f.dept_name,
      'division': data1.pk,
      'contacts': f.contacts
    }

    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += f.pk + '/'
    }


    $http({
      method: method,
      url: url,
      data: datatoSend,

    }).
    then(function(response) {
      console.log(response.data);
      $scope.form.pk = response.data.pk;
      Flash.create('success', 'Saved')
      // $scope.fetchData();
      //  $scope.$broadcast('forceRefetch',)
      //    $scope.$broadcast('forcerefresh', response.data);
      //  $route.reload();
      if ($scope.mode == 'new') {
        console.log("aaaaaaaaaa");
        $scope.resetForm();
      }
    })
  }



})
app.controller("workforceManagement.organization.company.units.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, division, data) {
  console.log(data);
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
      'email': '',
      'l1': '',
      'l2': '',
      'division': '',
      'areaCode': '',
      'gstin': ''
    }
  }


  $scope.units = [];
  if (data != undefined) {
    $scope.mode = 'edit';
    $scope.form = data;
    $scope.place = $scope.form.address
    $scope.locations = [$scope.form.lat, $scope.form.lng]
    // $scope.units = $scope.form.units;
  } else {
    $scope.mode = 'new';
    $scope.resetForm();
  }

    $scope.types = "[]";
    $scope.placeChanged = function() {
      $scope.place = this.getPlace();
      if ($scope.place.geometry.location != undefined) {
        $scope.locations = $scope.place.geometry.location
        $scope.lat = $scope.place.geometry.location.lat()
        $scope.lng = $scope.place.geometry.location.lng()
      }
      console.log('location', $scope.place.geometry.location.lat() ,  $scope.place.geometry.location.lng());
      console.log('location', $scope.place);
    }

    $scope.getLocation = function(lat, lon) {
      console.log(lat);
      $scope.lat = lat
      $scope.lng = lon
      $http({
        method: 'GET',
        url: '/api/marketing/getloaction/?lat=' + lat + '&lon=' + lon
      }).
      then(function(response) {
        if (response.data.msg) {
          Flash.create('warning', response.data.msg)
          return
        } else {
          console.log(response.data.address);
          $scope.form.address = response.data.address.display_name
          $scope.form.pincode = response.data.address.address.postcode
        }
      })
    }

    $scope.center = [12.970435, 77.578424];

    $scope.getCurrentLocation = function(event) {
      console.log("ssssssssss", event.latLng.lat(), event.latLng.lng());
      $scope.lat = event.latLng.lat()
      $scope.lng = event.latLng.lng()
    }

  $scope.save = function() {
    console.log($scope.lat,$scope.lng);
    if ($scope.form.name == null || $scope.form.name.length == 0 || $scope.form.mobile == null || $scope.form.mobile.length == 0 || $scope.form.areaCode == null || $scope.form.areaCode.length == 0) {
      Flash.create('warning', 'Name, Mobile and Code/ID is required')
      return
    }
    if (typeof $scope.form.pincode == 'object') {
      $scope.form.state = $scope.form.pincode.state;
      $scope.form.city = $scope.form.pincode.city;
      $scope.form.country = $scope.form.pincode.country;
      $scope.form.pincode = $scope.form.pincode.pincode;
    }
    console.log('entered');
    var f = $scope.form;
    var url = '/api/organization/unit/';



    var toSend = {
      name: f.name,
      address: f.address,
      pincode: f.pincode,
      city: f.city,
      state: f.state,
      country: f.country,
      mobile: f.mobile,
      division: division.pk,
      // areaCode: f.areaCode,
      warehouse: f.warehouse,
      master: f.master,
      bankBranch: f.bankBranch,
      bankName: f.bankName,
      bankAccNumber: f.bankAccNumber,
      ifsc: f.ifsc,
      swift: f.swift,
      lat: $scope.lat,
      lng: $scope.lng,
    }
    // if (f.parent!=null && typeof f.parent=='object') {
    //   toSend.parent =  f.parent.pk
    // }
    if (f.email != null && f.email.length > 0) {
      toSend.email = f.email
    }
    if (f.areaCode != null && f.areaCode.length > 0) {
      toSend.areaCode = f.areaCode
    }
    if (f.gstin != null && f.gstin.length > 0) {
      toSend.gstin = f.gstin
    }

    if (f.telephone != null && f.telephone.length != 0) {
      toSend.telephone = f.telephone;
    }
    if (f.fax != null && f.fax.length != 0) {
      toSend.fax = f.fax;
    }
    if (f.l1 != null && f.l1.length != 0) {
      toSend.l1 = f.l1;
    }
    if (f.l2 != null && f.l2.length != 0) {
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

  // $scope.divisionSearch = function(query) {
  //   // console.log('************',query);
  //   return $http.get('/api/organization/divisions/?name__contains=' + query).
  //   then(function(response) {
  //     console.log('@', response.data);
  //     return response.data;
  //   })
  // };


});
app.controller("workforceManagement.organization.division.item", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  //
  //
  // $http({
  //   method: 'GET',
  //   url: '/api/organization/divisions/'
  // }).
  // then(function(response) {
  //    $scope.division = response.data;
  //
  // })
});
