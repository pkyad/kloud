app.controller('businessManagement.finance.accounts.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  account, $uibModalInstance) {

  $scope.accounts = account
  console.log(account);
  if (account.pk) {
    $scope.mode = 'edit';
    $scope.form = account
    $scope.accounts='account'
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


app.controller('businessManagement.finance.accounts.transaction', function($scope, $http, Flash, accountObj, $uibModalInstance) {

  console.log(accountObj);
  $scope.accountData = accountObj

  $scope.form = {
    toAcc: '',
    amount: 1,
    externalReferenceID: '',
    externalConfirmationID: '',
    showMore: false,
  }
  $scope.accountSearch = function(query) {
    return $http.get('/api/finance/account/?number__icontains=' + query).
    then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].pk == $scope.accountData.pk) {
          response.data.splice(i, 1)
        }
      }
      return response.data;
    })
  };
  $scope.getAccountName = function(acc) {
    if (acc) {
      return acc.number + ' ( ' + acc.bank + ' )'
    }
  }

  $scope.transferMoney = function() {
    console.log($scope.form);
    var f = $scope.form
    if (f.toAcc.length == 0 || f.toAcc.pk == undefined) {
      Flash.create('warning', 'Please Select Proper Account Number');
      return;
    }
    if (f.amount > $scope.accountData.balance) {
      Flash.create('warning', 'Insufficient Amount');
      return;
    }
    var toSend = {
      fromAcc: $scope.accountData.pk,
      toAcc: f.toAcc.pk,
      amount: f.amount,
    }
    if (f.externalReferenceID != null && f.externalReferenceID.length > 0) {
      toSend.externalReferenceID = f.externalReferenceID
    }
    if (f.externalConfirmationID != null && f.externalConfirmationID.length > 0) {
      toSend.externalConfirmationID = f.externalConfirmationID
    }

    console.log(toSend);
    $http({
      method: 'POST',
      url: '/api/finance/transaction/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $uibModalInstance.dismiss(response.data)
    })
  }
});

app.controller('businessManagement.finance.pettyCash', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {
  $scope.searchForm = {
    search: ''
  }
  $scope.allAccounts = function() {

    var url = '/api/finance/account/?only=pettyCash'
    if ($scope.searchForm.search.length > 0) {
      url = url + '&search__in=' + $scope.searchForm.search
    }

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.accountData = response.data
    })

  }
  $scope.allAccounts()

  $http({
    method: 'GET',
    url: '/api/finance/getAccountTotal/?type=pettyCash'
  }).
  then(function(response) {
    $scope.total = response.data
  })
  //   var url = '/api/finance/account/?only='+$scope.selectedTyp
  //   if ($scope.searchForm.search.length > 0) {
  //     url = url + '&search__in=' + $scope.searchForm.search
  //   }
  //   $http({
  //     method: 'GET',
  //     url: url
  //   }).
  //   then(function(response) {
  //     $scope.accountData = response.data
  //     $scope.total = 0
  //     for (var i = 0; i < response.data.length; i++) {
  //       $scope.total+=response.data[i].balance
  //     }
  //   })
  //
  // }

})

app.controller('businessManagement.finance.bankAccounts', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {

  $scope.searchForm = {
    search: ''
  }
  $scope.allAccounts = function() {

    var url = '/api/finance/account/?only=accounts'
    if ($scope.searchForm.search.length > 0) {
      url = url + '&search__in=' + $scope.searchForm.search
    }


    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.accountData = response.data
      // $scope.total = 0
      // for (var i = 0; i < response.data.length; i++) {
      //   $scope.total+=response.data[i].balance
      // }
    })

  }
  $scope.allAccounts()
  //   var url = '/api/finance/account/?only='+$scope.selectedTyp
  //   if ($scope.searchForm.search.length > 0) {
  //     url = url + '&search__in=' + $scope.searchForm.search
  //   }
  //
  //
    $http({
      method: 'GET',
      url: '/api/finance/getAccountTotal/?type=accounts'
    }).
    then(function(response) {
      $scope.total = response.data
    })
  //
  // }
})


app.controller('businessManagement.finance.accounts', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {

  $scope.data = {
    tableData: []
  };


  $scope.download = function(){
    var type = 'accounts'
    if ($state.is('businessManagement.bankAccounts.pettyCash')) {
       type = 'pettyCash'
    }
    window.location.href = '/api/finance/accountsSpreadSheet/?only='+type
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

})

var bankIconMap = {
  hdfc: '/static/images/credit/hdfc.jpg',
  citi: '/static/images/credit/citi.png',
  sbi: '/static/images/credit/sbi.png'
}

app.controller('businessManagement.finance.accounts.item', function($scope, $http) {

  $scope.getBankIcon = function(bankName) {
    if (bankIconMap[bankName]) {
      return bankIconMap[bankName];
    } else {
      return '/static/images/defaultBank.jpg'
    }
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
          $scope.allAccounts()
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

app.controller('businessManagement.finance.accounts.journal', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $location , $timeout) {

  // ledger related

  // $timeout(function() {
  //   $('html, body').animate({
  //         scrollTop: $("#bottom").offset().top
  //     }, 2000);
  // },2000)


    $timeout(function() {
        document.getElementById('bottom').scrollIntoView({block: 'start', behavior: 'smooth'});
    }, 1000);

  $scope.download = function(){
    window.open('/api/finance/pettyCashJournal/?month='+$scope.select.month+'&year='+$scope.select.year, '_blank');
  }
  $scope.dated = new Date()
  $scope.transactions = [{
    narration: '',
    // type: 'D',
    debit: 0,
    credit: 0,
    account: ''
  }, {
    narration: '',
    // type: 'D',
    debit: 0,
    credit: 0,
    account: ''
  }]

  $scope.addNewLine = function(){
    if (typeof $scope.transactions[$scope.transactions.length-1].account!='object') {
      Flash.create('warning','Select a Account')
      return
    }

    if ($scope.transactions[$scope.transactions.length-1].debit==0&&$scope.transactions[$scope.transactions.length-1].credit==0) {
      Flash.create('warning','Add amount for debit or credit')
      return
    }

    $scope.transactions.push({
      narration: '',
      // type: 'D',
      debit: 0,
      credit: 0,
      account: ''
    })

  }

  $scope.total = {
    credit:0,
    debit:0
  }

  // $scope.checkTransactionType = function(indx, typ) {
  //   if (typ.length == 1) {
  //     if (typ == 'D' || typ == 'C') {} else {
  //       $scope.transactions[indx].type = ''
  //     }
  //   } else {
  //     $scope.transactions[indx].type = ''
  //   }
  // }


  $scope.accountSearch = function(query) {
    return $http.get('/api/finance/accountLite/?title__icontains=' + query +'&limit=10').
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.calc = function(){
    $scope.total = {
      credit:0,
      debit:0
    }
    for (var i = 0; i < $scope.transactions.length; i++) {
          $scope.total.debit = $scope.total.debit + parseFloat($scope.transactions[i].debit)
          $scope.total.credit = $scope.total.credit + parseFloat($scope.transactions[i].credit)
    }
  }

  $http({method : 'GET' , url : '/api/clientRelationships/invoiceSettings/'}).
  then(function(response) {
    $scope.orgSettings = response.data;
  })

  $scope.saveTransactions = function() {
    if ($scope.total.credit!=$scope.total.debit) {
      Flash.create('warning','Debit and Credit amount should be matched')
      return
    }
    for (var i = 0; i < $scope.transactions.length; i++) {
        $scope.transactions[i].account = $scope.transactions[i].account.pk
    }

    $http({
      method: 'POST',
      url: '/api/finance/createTransaction/',
      data : {
        'data':$scope.transactions,
        'date':$scope.dated.toJSON().split('T')[0],
        'narration': $scope.narration
      }
    }).
    then(function(response) {

      $scope.transactionData.push(response.data);
      // $scope.transactionData = response.data
      Flash.create('success','Added')
      $scope.transactions = [{
        narration: '',
        type: 'D',
        debit: 0,
        credit: 0,
        account: ''
      }, {
        narration: '',
        // type: 'D',
        debit: 0,
        credit: 0,
        account: ''
      }]
      $scope.total = {
        credit:0,
        debit:0
      }
      $scope.narration = ''
      // $scope.dated = new Date()
    })


  }


  //ledger related




  $scope.months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "Quarter 1 - April-June", "Quarter 2 - July-September", "Quarter 3 - October-December", 'Quarter 4 - January-March', 'Current FY']

  $scope.currentYear = new Date().getFullYear()
  $scope.monthVal = $scope.months[16]
  $scope.select = {}
  console.log($scope.months[16],'aaaaaaaaaaaaaaa');
  $scope.select.month = $scope.months[16]
  $scope.startYear = 2015;
  $scope.years = []
  while ($scope.startYear <= $scope.currentYear) {
    $scope.years.push($scope.startYear++);
  }
  $scope.allYears = []
  for (var i = 0; i < $scope.years.length; i++) {
    var nxtYr = $scope.years[i] + 1
    var val = $scope.years[i] + ' - ' + nxtYr
    $scope.allYears.push(val)
  }
  $scope.select.year = $scope.allYears[$scope.allYears.length-1]


  $scope.filterData = function() {
    $http({
      method: 'GET',
      url: '/api/finance/journal/?month='+$scope.select.month+'&year='+$scope.select.year,
    }).
    then(function(response) {
      $scope.transactionData = response.data
    })
  }
  $scope.filterData()
})
