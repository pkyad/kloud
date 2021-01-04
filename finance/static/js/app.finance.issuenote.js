app.controller('businessManagement.finance.issuenote' , function($scope , $http , $aside , $state, Flash , $users , $stateParams , $filter ,  $uibModal){


  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.issuenote.list.html',
  }, ];

  $scope.config = {
    views: views,
    url: 'api/finance/issuenote/',
    searchField: 'invoice_number',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);


    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          var title = 'Edit : ';
          var appType = 'IssuenoteEditor';
        } else  {
          var title = 'Details : ';
          var appType = 'StoreExplore';
        }
        $scope.addTab({
          title: title + $scope.data.tableData[i].pk,
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

// $http({
//   method : 'POST',
//   url : '/api/finance/issuenote/',
//   data : dataToSend
// }).then(function(response){
//   console.log(response);
//   Flash.create('success', 'Saved');
//   $scope.newform = false
//   $scope.detailform = true
//   $scope.issuenote.pk = response.data.pk;
//   $scope.issuenote = response.data;
// })
})
app.controller('businessManagement.finance.issuenote.form' , function($scope , $http , $aside , $state, Flash , $users , $stateParams , $filter ,  $uibModal){


  $scope.detailform = true

  $scope.resetForm = function() {
    $scope.issuenote = {
    manager : "",
    from_store : "",
    to_store : "",
    invoice_number : "5",
    vehicle_number : "5",
    driver_number : "5",
    status : "In-transit",
    }
  }
  $scope.newform = true
  if (typeof $scope.tab == 'undefined') {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.issuenote = $scope.data.tableData[$scope.tab.data.index]

  }




  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?limit=10&username__icontains=' + query).then(function(response){
      return response.data.results;
    })
  };

  $scope.storeSearch = function(query) {
    return $http.get('/api/finance/store/?limit=10&location__icontains=' + query).then(function(response){
      return response.data.results;
    })
  };

  $scope.statusSearch = function(query) {
    return $http.get('/api/finance/issuenote/?limit=10&status__icontains=' + query).then(function(response){
      return response.data.results;
    })
  };



  $scope.save = function() {




    var dataToSend = {
      manager : $scope.issuenote.manager.pk,
      from_store : $scope.issuenote.from_store.pk,
      to_store : $scope.issuenote.to_store.pk,
      invoice_number : $scope.issuenote.invoice_number,
      vehicle_number : $scope.issuenote.vehicle_number,
      driver_number : $scope.issuenote.driver_number,
      status : $scope.issuenote.status,
      // delivered_date : $scope.issuenote.delivered_date,
      // checked_date : $scope.issuenote.checked_date,
      // departed_date : $scope.issuenote.departed_date,
    }

  $http({
    method : 'POST',
    url : '/api/finance/issuenote/',
    data : dataToSend
  }).then(function(response){
    console.log(response);
    Flash.create('success', 'Saved');
    $scope.detailform = true
    $scope.issuenote.pk = response.data.pk;
    $scope.issuenote = response.data;
  })

  }

  $scope.addIssueDetail = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.issuenotedetail.html',
      size: 'xl',
      backdrop: false,

      controller: function($scope, $uibModalInstance, $rootScope){

        $scope.productSearch = function(query) {
          return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).then(function(response){
            return response.data.results;
          })
        };


      }
    })
  }


})
