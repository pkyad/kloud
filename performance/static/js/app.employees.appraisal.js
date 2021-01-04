app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.employees.appraisal', {
      url: "/appraisal",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.performance.appraisal.html',
          controller: 'workforceManagement.performance.appraisal',
        }
      }
    })
});
app.controller("workforceManagement.performance.appraisal", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.performance.appraisal.item.html',
  }, ];

  $scope.config = {
    views: views,
    url: '/api/HR/appraisal/',
    searchField: 'user__username',
    itemsNumPerView: [20, 40, 80],
    getParams: [{
      key: 'getMyHRapprovals',
      value: true
    }]
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'appraisalBrowser') {
          var title = 'Appraisal For : ';
          var appType = 'appraisalBrowser';
        }
        console.log({
          title: title + $scope.data.tableData[i].empId,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        });
        $scope.addTab({
          title: title + $scope.data.tableData[i].empId,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        })
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

});

app.controller("workforceManagement.performance.appraisal.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?limit=10&username__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.form = {
    user: ''
  }
  $scope.createAppraisal = function() {
    if ($scope.form.user.pk == undefined) {
      Flash.create('danger', 'Please Select A Valid Customer')
      return
    }
    $http({
      method: 'POST',
      url: '/api/HR/appraisal/',
      data: {
        user: $scope.form.user.pk
      }
    }).
    then(function(response) {
      console.log(response.data);
      $scope.form = {
        user: ''
      }
      Flash.create('success', 'Created Successfully')
    })
  }
})

app.controller("workforceManagement.performance.appraisal.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.me = $users.get('mySelf')
  console.log($scope.me);
  $scope.appraisalData = $scope.data.tableData[$scope.tab.data.index]
  console.log($scope.appraisalData);
  $http({
    method: 'GET',
    url: '/api/HR/designation/?user=' + $scope.appraisalData.user
  }).
  then(function(response) {
    $scope.userDesignationData = response.data[0]
    if (typeof $scope.userDesignationData.reportingTo == 'number') {
      $scope.userDesignationData.reportingTo = $users.get($scope.userDesignationData.reportingTo);
    }
    if (typeof $scope.userDesignationData.hrApprover == 'number') {
      $scope.userDesignationData.hrApprover = $users.get($scope.userDesignationData.hrApprover);
    }
    if (typeof $scope.userDesignationData.primaryApprover == 'number') {
      $scope.userDesignationData.primaryApprover = $users.get($scope.userDesignationData.primaryApprover);
    }
    if (typeof $scope.userDesignationData.secondaryApprover == 'number') {
      $scope.userDesignationData.secondaryApprover = $users.get($scope.userDesignationData.secondaryApprover);
    }

    console.log($scope.userDesignationData);
  })
  $http({
    method: 'GET',
    url: '/api/payroll/payroll/?user=' + $scope.appraisalData.user
  }).
  then(function(response) {
    $scope.userPayrollData = response.data[0]
  })

  $scope.divisionSearch = function(query) {
    return $http.get('/api/organization/divisions/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.unitSearch = function(query) {
    return $http.get('/api/organization/unit/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.depSearch = function(query) {
    return $http.get('/api/organization/departments/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.roleSearch = function(query) {
    return $http.get('/api/organization/role/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.Reporting = function(query) {
    return $http.get('/api/HR/users/?limit=10&username__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.finaliseAppraisal = function() {
    if ($scope.appraisalData.finalAmount == null || typeof $scope.appraisalData.finalAmount != 'number') {
      Flash.create('danger', 'Please Enter Valid Amount');
      return
    }
    if ($scope.appraisalData.hrCmt == null || $scope.appraisalData.hrCmt.length == 0) {
      Flash.create('danger', 'Please Write Some Message');
      return
    }
    var toSend = {
      finalAmount: parseInt($scope.appraisalData.finalAmount),
      hrCmt: $scope.appraisalData.hrCmt,
      status: 'Completed',
      hra:parseInt($scope.userPayrollData.hra),
      special:parseInt($scope.userPayrollData.special),
      lta:parseInt($scope.userPayrollData.lta),
      basic:parseInt($scope.userPayrollData.basic),
      taxSlab:parseInt($scope.userPayrollData.taxSlab),
      adHoc:parseInt($scope.userPayrollData.adHoc),
      pfAmnt:parseInt($scope.userPayrollData.pfAmnt),
      al:parseInt($scope.userPayrollData.al),
      ml:parseInt($scope.userPayrollData.ml),
      adHocLeaves:parseInt($scope.userPayrollData.adHocLeaves),
    }
    if ($scope.userDesignationData.reportingTo != null && $scope.userDesignationData.reportingTo.pk != undefined) {
      toSend.reportingTo_id = $scope.userDesignationData.reportingTo.pk
    }
    if ($scope.userDesignationData.hrApprover != null && $scope.userDesignationData.hrApprover.pk != undefined) {
      toSend.hrApprover_id = $scope.userDesignationData.hrApprover.pk
    }
    if ($scope.userDesignationData.primaryApprover != null && $scope.userDesignationData.primaryApprover.pk != undefined) {
      toSend.primaryApprover_id = $scope.userDesignationData.primaryApprover.pk
    }
    if ($scope.userDesignationData.secondaryApprover != null && $scope.userDesignationData.secondaryApprover.pk != undefined) {
      toSend.secondaryApprover_id = $scope.userDesignationData.secondaryApprover.pk
    }
    if ($scope.userDesignationData.division != null && $scope.userDesignationData.division.pk != undefined) {
      toSend.division_id = $scope.userDesignationData.division.pk
    }
    if ($scope.userDesignationData.unit != null && $scope.userDesignationData.unit.pk != undefined) {
      toSend.unit_id = $scope.userDesignationData.unit.pk
    }
    if ($scope.userDesignationData.department != null && $scope.userDesignationData.department.pk != undefined) {
      toSend.department_id = $scope.userDesignationData.department.pk
    }
    if ($scope.userDesignationData.role != null && $scope.userDesignationData.role.pk != undefined) {
      toSend.role_id = $scope.userDesignationData.role.pk
    }
    console.log('dataaaaaaaaaaaaa',toSend);
    $http({
      method:'PATCH',
      url:'/api/HR/appraisal/'+$scope.appraisalData.pk+'/',
      data:toSend
    }).
    then(function(response){
      Flash.create('success','Saved Successfully')
      console.log(response.data);
      $scope.appraisalData.status = response.data.status
    })
  }
})
