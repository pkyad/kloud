app.config(function($stateProvider) {
  $stateProvider.state('workforceManagement.approvals', {
    url: "/approvals",
    templateUrl: '/static/ngTemplates/app.approvals.html',
    controller: 'workforceManagement.employees.approvals'
  });
});

app.controller("workforceManagement.employees.approvals.info", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  $scope.data = $scope.tab.data;
  $scope.me = $users.get("mySelf");
  console.log('aaaaaaaaaaaaaaaaaaaaaa', $scope.me);
  // $scope.friend = $users.get( $scope.data.user);
  //
  // console.log('friendddd', $scope.friend);
  $scope.save = function(typ) {
    var url = '/api/HR/leave/' + $scope.data.pk + '/';
    $http({
      method: 'PATCH',
      url: url,
      data: {
        typ: typ
      },
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.data = response.data;
    })
  }

});

app.controller("workforceManagement.employees.timeSheet.info", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  $scope.data = $scope.tab.data;


  // $http({
  // method: 'GET',
  // url: '/api/performance/timeSheet/'
  // }).
  // then(function(response) {
  //     $scope.timeSheet = response.data[0];
  // console.log($scope.timeSheet);
  // })


  $scope.totalTime = function() {

    if ($scope.data == undefined) {
      return 0;
    }


    var total = 0;
    for (var i = 0; i < $scope.data.items.length; i++) {
      if ($scope.data.items[i].duration != undefined) {
        total += $scope.data.items[i].duration;
      }
    }
    return total.toFixed(2);
    console.log('aaaaaa', total);
  }

  $scope.save = function() {
    var url = '/api/performance/timeSheet/' + $scope.data.pk + '/';
    $http({
      method: 'PATCH',
      url: url,
      data: {
        typ: 'approved'
      },
    }).
    then(function(response) {
      Flash.create('success', 'Approved');
      $scope.data = response.data;
    })
  }
  $scope.reject = function() {
    var url = '/api/performance/timeSheet/' + $scope.data.pk + '/';
    $http({
      method: 'PATCH',
      url: url,
      data: {
        typ: 'created'
      },
    }).
    then(function(response) {
      Flash.create('success', 'Rejected');
      $scope.data = response.data;
    })
  }



});


app.controller("workforceManagement.employees.approvals", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $rootScope) {
  $scope.data = {
    tableData: [],
    sheetTableData: [],
    tourPlanData: [],
    appraisalData: [],
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.employees.approvals.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/HR/leave/',
    // searchField: 's',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'info') {
          var title = 'Leave request :';
          var appType = 'leavesInfo';
        }

        $scope.addTab({
          title: title + $scope.data.tableData[i].pk,
          cancel: true,
          app: appType,
          data: $scope.data.tableData[i],
          active: true
        })
      }
    }
  }

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.employees.timeSheet.item.html',
  }, ];


  $scope.configSheet = {
    views: views,
    url: '/api/performance/timeSheet/',
    searchField: 'dept_name',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableActionSheet = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.sheetTableData);

    for (var i = 0; i < $scope.data.sheetTableData.length; i++) {
      if ($scope.data.sheetTableData[i].pk == parseInt(target)) {
        if (action == 'sheet') {
          var title = 'Time Sheet :';
          var appType = 'sheetInfo';
        }

        $scope.addTab({
          title: title + $scope.data.sheetTableData[i].pk,
          cancel: true,
          app: appType,
          data: $scope.data.sheetTableData[i],
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

  tourViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.employees.approvals.tour.item.html',
  }, ];

  $scope.configTour = {
    url: '/api/marketing/tourplan/',
    views: tourViews,
    itemsNumPerView: [12, 24, 48],
    searchField: 'date',
    // getParams: [{
    //   "key": 'status',
    //   "value": 'sent_for_approval'
    // }],
  }

  $scope.tableActionTour = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tourPlanData.length; i++) {
      if ($scope.data.tourPlanData[i].pk == parseInt(target)) {
        if (action == 'tour') {
          var title = 'Tour Plan :';
          var appType = 'tourInfo';
        }

        $scope.addTab({
          title: title + $scope.data.tourPlanData[i].pk,
          cancel: true,
          app: appType,
          data: $scope.data.tourPlanData[i],
          active: true
        })
      }
    }
  }

  appraisalViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.employees.appraisal.item.html',
  }, ];

  $scope.configAppraisal = {
    views: appraisalViews,
    url: '/api/HR/appraisal/',
    searchField: 'user__username',
    itemsNumPerView: [20, 40, 80],
    getParams: [{
      key: 'status',
      value: 'Inprogress'
    }, {
      key: 'getMyManagerapprovals',
      value: true
    }]
  }

  $scope.tableActionAppraisal = function(target, action, mode) {
    for (var i = 0; i < $scope.data.appraisalData.length; i++) {
      if ($scope.data.appraisalData[i].pk == parseInt(target)) {
        if (action == 'appraisalBrowser') {
          var title = 'Appraisal For : ';
          var appType = 'appraisalBrowser';
        }

        $scope.addTab({
          title: title + $scope.data.appraisalData[i].empId,
          cancel: true,
          app: appType,
          data: $scope.data.appraisalData[i],
          active: true
        })
      }
    }
  }

  deboardViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.employees.approvals.deboard.item.html',
  }, ];

  $scope.configDeboard = {
    url: '/api/HR/exitManagement/',
    views: deboardViews,
    itemsNumPerView: [12, 24, 48],
    searchField: 'user',
    // getParams: [{
    //   "key": 'status',
    //   "value": 'sent_for_approval'
    // }],
  }

  $scope.tableActionDeboard = function(target, action, mode) {
    for (var i = 0; i < $scope.data.deboardData.length; i++) {
      if ($scope.data.deboardData[i].pk == parseInt(target)) {
        if (action == 'deboardInfo') {
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.employees.approvals.deboardModal.html',
            size: 'md',
            backdrop: true,
            resolve: {
              data: function() {
                return $scope.data.deboardData[i];
              }
            },
            controller: function($scope, data, $uibModalInstance, $rootScope) {
              $scope.me = $users.get("mySelf");
              $scope.today = new Date()
              $scope.deboardData = data;
              $scope.form = {
                superManagerApproval: $scope.deboardData.superManagerApproval,
                managersApproval: $scope.deboardData.managersApproval,
              }
              $scope.save = function() {
                var dataToSend = {
                  superManagerApproval: $scope.form.superManagerApproval,
                  managersApproval: $scope.form.managersApproval,
                  managerApprovedDate: $scope.today,
                }
                if ($scope.form.superManagerApproval == true) {
                  dataToSend.superManagerApprovedDate = $scope.today;
                }
                $http({
                  method: 'PATCH',
                  url: '/api/HR/exitManagement/' + $scope.deboardData.pk + '/',
                  data: dataToSend,
                }).
                then(function(response) {
                  Flash.create('success', 'Saved');
                  $uibModalInstance.dismiss(response.data);
                  $rootScope.$broadcast('forceRefetch', {});
                });
              }
            }, //controlller ends
          })
        }
      }
    }
  } //tableaction ends

});

app.controller("workforceManagement.employees.appraisal.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.me = $users.get('mySelf')
  console.log($scope.me);
  $scope.appraisalData = $scope.tab.data
  console.log($scope.appraisalData);
  $http({
    method: 'GET',
    url: '/api/HR/designation/?user=' + $scope.appraisalData.user
  }).
  then(function(response) {
    $scope.userDesignationData = response.data[0]
  })
  $http({
    method: 'GET',
    url: '/api/payroll/payroll/?user=' + $scope.appraisalData.user
  }).
  then(function(response) {
    $scope.userPayrollData = response.data[0]
  })
  $scope.managerApprovers = function(typ) {
    console.log(typ);
    if (typ == 'manager') {
      var amt = $scope.appraisalData.managerAmt
      var cmt = $scope.appraisalData.managerCmt
      var data = {
        managerAmt: parseInt(amt),
        managerCmt: cmt
      }
    } else {
      var amt = $scope.appraisalData.superManagerAmt
      var cmt = $scope.appraisalData.superManagerCmt
      var data = {
        superManagerAmt: parseInt(amt),
        superManagerCmt: cmt
      }
    }
    if (amt == null || typeof amt != 'number') {
      Flash.create('danger', 'Please Select A Valid Amount')
      return
    }
    if (cmt == null || cmt.length == 0) {
      Flash.create('danger', 'Please Write Some Message')
      return
    }
    $http({
      method: 'PATCH',
      url: '/api/HR/appraisal/' + $scope.appraisalData.pk + '/',
      data: data
    }).
    then(function(response) {
      Flash.create('success', 'Saved Successfully')
      console.log(response.data);
    })
  }
})

app.controller("workforceManagement.employees.tourPlan.info", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {
  $scope.toData = $scope.tab.data
  // $scope.form.amount = $scope.toData.amount;
  $http({
    method: 'GET',
    url: '/api/marketing/tourPlanStop/?tourplan=' + $scope.toData.pk
  }).
  then(function(response) {
    $scope.tourStop = response.data;
  })

  $scope.approvebtn = false;
  $scope.approve = function(data) {
    var fd = new FormData();
    fd.append('status', data);
    fd.append('amount', $scope.toData.amount)
    $http({
      method: 'PATCH',
      url: '/api/marketing/tourplan/' + $scope.toData.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.approvebtn = true;
      if (response.data.status == 'rejected') {
        Flash.create('success', 'Tour Plan rejected');
      } else {
        Flash.create('success', 'Tour Plan Approved');
        $rootScope.$broadcast('forceRefetch', {});
      }
    }, function(error) {
      Flash.create('danger', response.status);
      $scope.approvebtn = false;
    })
  }

});
