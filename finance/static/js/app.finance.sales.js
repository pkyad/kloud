app.controller('businessManagement.finance.sales.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModalInstance) {
  $scope.form = {
    toAcc: '',
    verified: false,
    currency: 'INR',
    exFile: emptyFile
  }

  $scope.accountSearch = function(query) {
    return $http.get('/api/finance/account/?number__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.getAccountName = function(acc) {
    if (acc) {
      return acc.number + ' ( ' + acc.bank + ' )'
    }
  }
  $scope.uploadExcel = function() {
    console.log($scope.form);
    var f = $scope.form
    if (f.toAcc.length == 0 || f.toAcc.pk == undefined) {
      Flash.create('warning', 'Select To Account');
      return;
    }
    if ($scope.form.exFile == emptyFile) {
      Flash.create('danger', 'Please Select Proper Excel File')
      return
    }

    var excelData = new FormData();
    excelData.append('exFile', $scope.form.exFile)
    excelData.append('toAcc', $scope.form.toAcc.pk)
    excelData.append('verified', $scope.form.verified)
    excelData.append('currency', $scope.form.currency)

    $http({
      method: 'POST',
      url: '/api/finance/uplodInflowData/',
      data: excelData,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $uibModalInstance.dismiss('saved')
    })
  }
});

app.controller('businessManagement.finance.sales', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.data = {
    tableData: [],
    crmData: [],
    invoicingData: []
  };

  var multiselectOptions = [{
    icon: 'fa fa-plus',
    text: 'Import'
  }, ];

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.inflow.item.html',
  }, ];

  $scope.config = {
    views: views,
    url: '/api/finance/inflow/',
    // filterSearch: true,
    searchField: 'referenceID',
    itemsNumPerView: [12, 24, 48],
    multiselectOptions: multiselectOptions,
  }

  crmViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.inflow.crm.item.html',
  }, ];

  $scope.crmConfig = {
    views: crmViews,
    url: '/api/clientRelationships/contract/',
    // filterSearch: true,
    searchField: 'id',
    itemsNumPerView: [12, 24, 48],
    getParams: [{
      "key": 'status',
      "value": 'received'
    }],
  }


  invoicingViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.inflow.invoicing.item.html',
  }, ];

  $scope.invoicingConfig = {
    views: invoicingViews,
    url: '/api/finance/sale/',
    // filterSearch: true,
    searchField: 'id',
    itemsNumPerView: [12, 24, 48],
    getParams: [{
      "key": 'status__in',
      "value": 'Received,created'
    },{
      "key": 'isInvoice',
      "value": true
    }],
  }

  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    if (action == 'Import') {
      $scope.openInflowForm();
    } else if (action == 'delete') {
      console.log('delete', target);
      // $http({
      //   method: 'DELETE',
      //   url: '/api/finance/inflow/' + target + '/'
      // }).
      // then(function(response) {
      //   Flash.create('success', 'Deleted');
      //   $scope.$broadcast('forceRefetch', {})
      // })
    } else {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)) {
          if (action == 'inflowBrowser') {
            $scope.addTab({
              title: 'Browse Inflow : ' + $scope.data.tableData[i].pk,
              cancel: true,
              app: 'inflowBrowser',
              data: {
                pk: target,
                index: i,
                cData: $scope.data.tableData[i]
              },
              active: true
            })
          }
        }
      }
    }
  }

  $scope.crmTableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

  }

  $scope.openInflowForm = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.inflow.form.html',
      size: 'lg',
      backdrop: true,
      controller: 'businessManagement.finance.sales.form',
    }).result.then(function() {}, function(res) {
      if (res == 'saved') {
        console.log('refreshinggggggg');
        $scope.$broadcast('forceRefetch', {})
      }
    });
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

  // $scope.addTab({"title":"Browse Cost Center : 1","cancel":true,"app":"costCenterBrowser","data":{"pk":1,"index":0},"active":true});

  $http({
    method: 'GET',
    url: '/api/finance/average/'
  }).
  then(function(response) {
    $scope.totalData = response.data
  })


})
