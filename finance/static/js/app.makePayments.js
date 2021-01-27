
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

  $scope.openAccountForm = function(data) {
    console.log(data);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.accounts.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        account: function() {
          if (data == undefined || data == null) {
            return {};
          } else {
            return data;
          }
        },
      },
      controller: 'businessManagement.finance.accounts.form',
    }).result.then(function() {

    }, function(res) {
      if (res == 'saved') {
          $scope.allAccounts()
      }

    });
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



app.controller('businessManagement.finance.accounts.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  account, $uibModalInstance) {

  console.log(account);
  if (account.pk) {
    $scope.mode = 'edit';
    $scope.form = account
    console.log(account, '98089089');
  } else {
    $scope.mode = 'new';
    $scope.form = {
      title: '',
      bank: '',
      number: 0,
      ifsc: '',
      bankAddress: '',
      personal: false,
      contactPerson: null,
      balance: 0,
      authorizedSignaturies: [],

    }
  }

  $scope.saveAccount = function() {
    console.log($scope.form);
    var f = $scope.form
    // if (f.personal == false) {
    //   if (f.title.length == 0 || f.bank.length == 0 || f.number.length == 0 || f.ifsc.length == 0 || f.bankAddress.length == 0) {
    //     Flash.create('warning', 'All Fields Are Required');
    //     return;
    //   }
    //   if (f.number.length == 0) {
    //     Flash.create('warning', 'Account number should be digits');
    //     return;
    //   }
    //
    // }
    console.log(typeof f.number, '-00--000');

    var toSend = {
      title: f.title,
      bank: f.bank,
      number: f.number,
      ifsc: f.ifsc,
      bankAddress: f.bankAddress,
      personal: f.personal,
      balance: f.balance,

    }
    console.log(toSend, 'opiop');
    if (f.authorizedSignaturies.length == 0) {
      Flash.create('warning', 'Please Add Authorized Signature Users');
      return;
    } else {
      toSend.authorizedSignaturies = f.authorizedSignaturies
      // toSend.contactPerson = f.authorizedSignaturies[0]
    }
    // if (f.personal== false) {
    //
    // }
    // else {
    //
    //   if (f.contactPerson == null || typeof f.contactPerson != 'object' || f.contactPerson.pk == undefined) {
    //     Flash.create('warning', 'Please Mention Owner');
    //     return;
    //   }
    //
    //   toSend.contactPerson = f.contactPerson.pk
    // }
    console.log(toSend);
    var url = '/api/finance/account/';
    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += $scope.form.pk + '/';
    }

    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $uibModalInstance.dismiss('saved')
    })
  }

});
