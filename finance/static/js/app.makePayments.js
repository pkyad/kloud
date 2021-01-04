
app.controller("admin.disbursal", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.disbData = [];
  $scope.getAllTranc = function(){
    $http({
      method: 'GET',
      url: '/api/finance/disbursal/?disbursed=' + true,
    }).then(function(response) {
      $scope.disbData = response.data;
      console.log('-------gootttttt', $scope.disbData);
    })
  }
$scope.getAllTranc()

$scope.getPending = function(){
  $http({
    method: 'GET',
    url: '/api/finance/disbursal/?disbursed=' + false,
  }).then(function(response) {
    $scope.pending = response.data;
    console.log('-------gootttttt', $scope.disbData);
  })
}
$scope.getPending()
  // $scope.getDisb();

  $scope.form = {
    allSelected: ''
  }
  $scope.$watch('form.allSelected', function(newValue, oldValue) {
    console.log('ddddddddddddddd', newValue, $scope.disbData);
    if ($scope.disbData != undefined) {
      for (var i = 0; i < $scope.disbData.length; i++) {
        $scope.disbData[i].selected = newValue;
      }
    }
  })


  $http({
    method: 'GET',
    url: '/api/finance/account/?only=accounts',
  }).then(function(response) {
    $scope.accounts = response.data;
  })

  $scope.save = function(indx) {
    $scope.form = $scope.pending[indx]
    if ($scope.form.account == undefined) {
      Flash.create('danger', 'please select the Account.')
    }
    if ($scope.form.refernceid == '') {
      Flash.create('danger', 'please add refernceid.')
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/disbursal/' + $scope.form.pk + '/',
      data: {
        disbursed: true,
        disbursalNote: $scope.form.disbursalNote,
        account: $scope.form.account.pk
      },
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.getAllTranc()
      $scope.getPending()
    })
  }

  $scope.done = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.disbursal.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.disbData;
        },
      },
      controller: function($scope, $uibModalInstance, data) {
        $http({
          method: 'GET',
          url: '/api/finance/account/?personal=false',
        }).then(function(response) {
          $scope.accounts = response.data;
        })
        $scope.form = {
          disbursalNote: '',
        }
        $scope.save = function() {
          var count = 0;
          for (var i = 0; i < data.length; i++) {
            if (data[i].selected == true) {
              if ($scope.form.account == undefined) {
                Flash.create('danger', 'please select the Account.')
              }
              if ($scope.form.disbursalNote == '') {
                Flash.create('danger', 'please write a Disbursal Note.')
              }
              $http({
                method: 'PATCH',
                url: '/api/finance/disbursal/' + data[i].pk + '/',
                data: {
                  disbursed: true,
                  disbursalNote: $scope.form.disbursalNote,
                  account: $scope.form.account.pk
                },
              }).
              then(function(response) {
                Flash.create('success', 'Saved');
                $uibModalInstance.dismiss(response.data);
              })
            } else {
              Flash.create('danger', 'please select item to be disbursed.')
            }
          }
        }
      }, //controller ends
    }).result.then(function(i) {

    }, function(i) {
      if (typeof i == 'object') {
        $scope.form.mode = false;
        $scope.getDisb(true);
      }
    });
  }
  $scope.download = function(){
    selPk = []
    for (var i = 0; i < $scope.pending.length; i++) {
      // if ($scope.disbData[i].selected) {
        selPk.push($scope.pending[i].pk)
      // }
    }
    window.open('/api/payroll/getDisbursalSheet/?pkList='+selPk, '_blank');
  }
});
