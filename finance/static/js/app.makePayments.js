
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
  $scope.accounts = account
  if (account.pk) {
    $scope.mode = 'edit';
    $scope.form = account
    $scope.form.active = true
    if (account.authorizedSignaturies.length >0) {
      $scope.form.authorizedSignaturies = account.authorizedSignaturies[0]

    }
    $scope.accounts = 'account'
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


  $scope.getUsers = function(){
    $http({
      method: 'GET',
      url: '/api/HR/userSearch/',
    }).
    then(function(response) {
      $scope.users = response.data
    })
  }
  $scope.getUsers()

  $scope.bankList = [
    'Allahabad Bank',
    'Andhra Bank',
    'Bank of Baroda',
    'Bank of India',
    'Bank of Maharashtra',
    'Canara Bank',
    'Central Bank of India',
    'Corporation Bank',
    'Dena Bank',
    'Indian Bank',
    'Indian Overseas Bank',
    'Oriental Bank of Commerce',
    'Punjab National Bank',
    'Punjab & Sind Bank',
    'Syndicate Bank',
    'UCO Bank',
    'Union Bank of India',
    'United Bank of India',
    'Vijaya Bank',
    'State Bank of India',
    'Axis Bank Ltd.',
    'Bandhan Bank Ltd.',
    'CSB Bank Limited',
    'City Union Bank Ltd.',
    'DCB Bank Ltd.',
    'Dhanlaxmi Bank Ltd.',
    'Federal Bank Ltd.',
    'HDFC Bank Ltd',
    'ICICI Bank Ltd.',
    'IndusInd Bank Ltd',
    'IDFC FIRST Bank Limited',
    'Jammu & Kashmir Bank Ltd.',
    'Karnataka Bank Ltd.',
    'Karur Vysya Bank Ltd.',
    'Kotak Mahindra Bank Ltd',
    'Lakshmi Vilas Bank Ltd.',
    'Nainital bank Ltd.',
    'RBL Bank Ltd.',
    'South Indian Bank Ltd.',
    'Tamilnad Mercantile Bank Ltd.',
    'YES Bank Ltd.',
    'IDBI Bank Limited',
  ]

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
    if ($scope.accounts == 'petty') {
      f.personal = true
      var toSend = {
        personal: f.personal,
        balance: f.balance,

      }
    }else {
      f.personal = false
      var toSend = {
        title: f.title,
        bank: f.bank,
        number: f.number,
        ifsc: f.ifsc,
        bankAddress: f.bankAddress,
        personal: f.personal,
        balance: f.balance,

      }
    }

    console.log(toSend, 'opiop');
    if (f.authorizedSignaturies.length == 0) {
      Flash.create('warning', 'Please Add Authorized Signature Users');
      return;
    } else {
      toSend.authorizedSignaturies = f.authorizedSignaturies.pk
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
app.controller('businessManagement.finance.accounts.explore', function($scope, $http, $aside, $uibModal, $state) {

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
      }

    });
  }

  $scope.getBankIcon = function(bankName) {
    if (bankIconMap[bankName]) {
      return bankIconMap[bankName];
    } else {
      return '/static/images/defaultBank.jpg'
    }
  }


    $scope.monthsAccounts = [{
        'digit': 4,
        'month': 'April'
      },
      {
        'digit': 5,
        'month': 'May'
      },
      {
        'digit': 6,
        'month': 'June'
      },
      {
        'digit': 7,
        'month': 'July'
      },
      {
        'digit': 8,
        'month': 'August'
      },
      {
        'digit': 9,
        'month': 'September'
      },
      {
        'digit': 10,
        'month': 'October'
      },
      {
        'digit': 11,
        'month': 'November'
      },
      {
        'digit': 12,
        'month': 'December'
      },
      {
        'digit': 1,
        'month': 'January'
      },
      {
        'digit': 2,
        'month': 'February'
      },
      {
        'digit': 3,
        'month': 'March'
      },

    ]

    $scope.monthsPetty = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "Quarter 1 - April-June", "Quarter 2 - July-September", "Quarter 3 - October-December", 'Quarter 4 - January-March', 'FY']



  $scope.pettyCashaccounts = function() {
      var url = '/api/finance/getPettyCashData/?account=' +$state.params.id
      url = url+'&month='+$scope.select.month+'&year='+$scope.select.year
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.pettycashacntData = response.data
      $scope.form.balance = $scope.account.balance
      // if ($scope.pettycashacntData.length==0) {
      // }
      // else{
      //   $scope.form.balance = $scope.pettycashacntData[$scope.pettycashacntData.length-1].balance
      // }
    })
  }

  $scope.fetchData = function() {
    $http({
      method: 'GET',
      url: '/api/finance/getAccountTransactions/?account=' + $state.params.id + '&year=' + $scope.select.year + '&month=' + $scope.select.month.digit,
    }).
    then(function(response) {
      $scope.transactionData = response.data.data
      var t = $scope.transactionData[0];
      var opening = t.balance+ t.debit - t.credit;

      var t = $scope.transactionData[$scope.transactionData.length -1];
      var closing = t.balance
      $scope.summary = {opening : opening , closing : closing}


    })
  }


  $http({
    method: 'GET',
    url: '/api/finance/account/'+$state.params.id+'/'
  }).
  then(function(response) {
    $scope.account = response.data
    if ($scope.account.personal) {

      $scope.currentYear = new Date().getFullYear()
      $scope.monthVal = $scope.monthsPetty[0]
      $scope.select = {}
      $scope.select.month = $scope.monthsPetty[0]
      $scope.startYear = 2017;
      $scope.years = []
      while ($scope.startYear <= $scope.currentYear) {
        var fromYr = $scope.startYear
        $scope.startYear = $scope.startYear+1
        var years = fromYr.toString() + '-' + $scope.startYear.toString()
        $scope.years.push(years);
      }
      $scope.select.year = $scope.years[$scope.years.length-1]
      $scope.pettyCashaccounts()
    }
    else{
      var today = new Date()
      $scope.currentYear = new Date().getFullYear()
      $scope.monthVal = $scope.monthsAccounts[0]
      $scope.select = {}
      for (var i = 0; i < $scope.monthsAccounts.length; i++) {
        if ($scope.monthsAccounts[i].digit == today.getMonth() +1) {
          $scope.select.month = $scope.monthsAccounts[i]
        }
      }
      $scope.select.year = today.getFullYear()
      $scope.startYear = 2017;
      $scope.years = []
      while ($scope.startYear <= $scope.currentYear) {
        $scope.years.push($scope.startYear++);
      }
      $scope.fetchData()
    }
  })


  // $scope.months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"]


$scope.uploadTransc = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.finance.accounts.uploadTranscation.html',
    size: 'sm',
    backdrop: true,
    resolve: {
      account: function() {
          return $scope.account.pk;
      },
    },
    controller: function($scope, $http, Flash, account, $uibModalInstance) {

      $scope.form = {
        file:emptyFile,
        account:account
      }
      $scope.save = function(){
        var fd = new FormData();
        var f = $scope.form
        if (f.file != emptyFile && typeof f.file != 'string') {
          fd.append('file', f.file)
        }
        fd.append('account', f.account);
        $http({
          method: 'POST',
          url: '/api/finance/uploadTransactions/',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          Flash.create('success','Uploaded')
          $uibModalInstance.dismiss()
        })
      }

    }
  }).result.then(function() {

  }, function(res) {
    $scope.fetchData()
  });
}

$scope.resetForm = function(){
  $scope.form = {
    description:'',
    amount:0,
    creditAmount:0,
    balance :0,
    type:'credit'
  }
}
$scope.resetForm()

$scope.save = function(){
  if ($scope.form.description.length == 0 ) {
    Flash.create('warning','Add Description')
    return
  }
    $scope.form.balance =  parseInt($scope.form.balance) - parseInt( $scope.form.amount)
    $scope.form.balance =  parseInt($scope.form.balance) + parseInt($scope.form.creditAmount)
    var dataToSend = {
      description : $scope.form.description,
      amount : $scope.form.amount,
      creditAmount : $scope.form.creditAmount,
      account : $scope.account.pk,
      balance : $scope.form.balance
    }
    $http({
      method : 'POST',
      url : '/api/finance/pettyCash/',
      data : dataToSend
    }).then(function(response){
      $scope.pettycashacntData.push(response.data)
      $scope.resetForm()
      $scope.form.balance = response.data.balance
      $scope.userAccounts[$scope.selectedIndx].balance = response.data.balance
      Flash.create('success','Added Succesfully')
    })
}

$scope.changeType = function() {
  $scope.form.amount = 0
  $scope.form.creditAmount = 0
}

  // var views = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.finance.transaction.item.html',
  // }, ];
  //
  // var multiselectOptions = [{
  //   icon: 'fa fa-share',
  //   text: 'transaction'
  // }, {
  //   icon: 'fa fa-plus',
  //   text: 'addMoney'
  // }, ];
  //
  // $scope.config = {
  //   views: views,
  //   url: 'api/finance/pettyCash/',
  //   searchField: 'heading__title',
  //   itemsNumPerView: [20, 40, 60],
  //   multiselectOptions: multiselectOptions,
  //   getParams: [{
  //     "key": 'account',
  //     "value": $scope.account.pk
  //   }],
  // }



  // $scope.tableAction = function(target, action, mode) {
  //   console.log(target, action, mode);
  //
  //   if (action == 'addMoney') {
  //     $uibModal.open({
  //       templateUrl: '/static/ngTemplates/app.finance.accounts.addMoney.html',
  //       size: 'md',
  //       resolve: {
  //         accountObj: function() {
  //           return $scope.account;
  //         }
  //       },
  //       controller: function($scope, $http, Flash, accountObj, $uibModalInstance) {
  //         $scope.accountData = accountObj;
  //         $scope.accountData.addAmount = 1;
  //         $scope.addMoney = function functionName() {
  //           $http({
  //             method: 'PATCH',
  //             url: '/api/finance/account/' + $scope.accountData.pk + '/',
  //             data: {addMoney:$scope.accountData.addAmount}
  //           }).
  //           then(function(response) {
  //             Flash.create('success', 'Saved');
  //             $uibModalInstance.dismiss(response.data)
  //           })
  //         }
  //       },
  //     }).result.then(function() {
  //     }, function(res) {
  //       if (res.pk) {
  //         $scope.account = res
  //       }
  //     });
  //   }else if (action == 'transaction') {
  //     $uibModal.open({
  //       templateUrl: '/static/ngTemplates/app.finance.accounts.transaction.html',
  //       size: 'lg',
  //       resolve: {
  //         accountObj: function() {
  //           return $scope.account;
  //         }
  //       },
  //       controller: 'businessManagement.finance.accounts.transaction',
  //     }).result.then(function() {
  //     }, function(res) {
  //       if (res.pk) {
  //         $scope.account.balance -= res.amount
  //         $scope.$broadcast('forceRefetch', {})
  //       }
  //     });
  //
  //   }else if (action == 'more') {
  //
  //
  //   }
  //
  //
  // }

})
