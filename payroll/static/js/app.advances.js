function dateToString(date) {
    if (typeof date == 'object') {
      day = date.getDate()
      month = date.getMonth() + 1
      year = date.getFullYear()
      return year + '-' + month + '-' + day
    } else {
      return date
    }
  }
app.controller("workforceManagement.payroll.advances", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.search = ''
  $scope.limit = 10
  $scope.offset = 0
  $scope.prev = function() {
    // if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.getall()
    // }
  }

  $scope.next = function() {
    // if ($scope.resNext != null) {
        $scope.offset += $scope.limit
      $scope.getall()

    // }
  }

$scope.getall = function(){
  var url = '/api/payroll/advances/?limit='+$scope.limit+'&offset='+$scope.offset+'&user__first_name__icontains='+$scope.search

  $http({
    method: 'GET',
    url: url,
  }).
  then(function(response) {
    $scope.advances = response.data.results;
  })
}
$scope.getall()
});

app.controller("workforceManagement.payroll.advances.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {
  $scope.today = new Date()
  // $scope.advData = $scope.data.tableData[$scope.tab.data.index]

  $http({
    method: 'GET',
    url: '/api/payroll/advances/'+$state.params.id ,
  }).
  then(function(response) {
    $scope.advData = response.data;
    $scope.advData.showBtn = true
      $scope.checkApprove();
      $scope.form = $scope.advData;
      if ($scope.advData.loanStarted == false) {
        $scope.form.emi = $scope.advData.amount;
      }
  })
  $scope.checkApprove = function() {
    console.log($scope.advData.user.pk, $scope.me.pk);
    if ($scope.me.pk == $scope.advData.user.pk) {
      $scope.advData.showBtn = false
    } else {
      if ($scope.advData.approvers.length == 3) {
        $scope.advData.showBtn = false
      } else {
        for (var i = 0; i < $scope.advData.approvers.length; i++) {
          if ($scope.me.pk == $scope.advData.approvers[i].pk) {
            $scope.advData.showBtn = false
          }
        }
      }
    }
    console.log($scope.advData.showBtn);
  }

  $scope.approve = function(pk) {
    if ($scope.advData.approvers.length == 2) {
      dataToSend = {
        approvers: $scope.me.pk,
        approved: true
      }
    } else {
      dataToSend = {
        approvers: $scope.me.pk
      }
    }
    $http({
      method: 'PATCH',
      url: '/api/payroll/advances/' + pk + '/',
      data: dataToSend,
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.advData = response.data;
      $scope.checkApprove();
    })
  }

  $scope.disburse = function(pk) {
    $http({
      method: 'POST',
      url: '/api/payroll/sendDisbursalEmail/',
      data: {
        pk: $scope.advData.pk
      }
    }).
    then(function() {
      Flash.create('success', 'Email sent successfully');
      console.log('sent email');
    })
    dataToSend = {
      date: $scope.today.toJSON().split('T')[0],
      sourcePk: pk,
      source: $scope.advData.typ,
      narration: $scope.advData.typ + ' , ' + $scope.advData.user.username,
      contactPerson: $scope.advData.user.username,
      accountNumber: $scope.advData.user.payroll.accountNumber,
      bankName: $scope.advData.user.payroll.bankName,
      amount: $scope.advData.amount,
      ifscCode: $scope.advData.user.payroll.ifscCode,
    }
    $http({
      method: 'POST',
      url: '/api/finance/disbursal/',
      data: dataToSend,
    }).
    then(function(response) {
      $http({
        method: 'PATCH',
        url: '/api/payroll/advances/' + pk + '/',
        data: {
          disbursed: true
        },
      }).
      then(function(response) {
        console.log('------ disbursed advance/loan -----');
        Flash.create('success', 'Saved');
        $scope.advData = response.data;
      })
    })
  }

  $scope.reset = function() {
    $scope.form = {
      returnBalance: '',
      modeOfReturn: '',
      referenceNumber: '',
      invoiceAmt: '',
      invoice: emptyFile,
    }
  }
  $scope.settlement = function(pk) {
    var f = $scope.form;
    var fd = new FormData();
    if ($scope.advData.typ == 'advance') {
      if ($scope.advData.amount == f.returnBalance + f.invoiceAmt) {
        fd.append('returnBalance', f.returnBalance);
        fd.append('modeOfReturn', f.modeOfReturn);
        fd.append('referenceNumber', f.referenceNumber);
        fd.append('invoiceAmt', f.invoiceAmt);
      } else {
        Flash.create('warning', 'Return Balance or Invoice Amount should be equal to Advance Amount');
        return;
      }
      if (f.invoiceAmt > 0 && f.invoice != null && f.invoice != emptyFile) {
        fd.append('invoice', f.invoice);
      } else if (f.invoiceAmt == 0) {
        //pass
      } else {
        Flash.create('warning', 'Please Attach the Invoice For the Amount' + ' ' + f.invoiceAmt);
        return;
      }
    }
    fd.append('settlementDate', $scope.today.toJSON().split('T')[0]);
    fd.append('settled', true);
    fd.append('settlementUser', $scope.me.pk);
    $http({
      method: 'PATCH',
      url: '/api/payroll/advances/' + pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.advData = response.data;
      $scope.checkApprove();
      $rootScope.$broadcast('forceRefetch', {});
    })
  }


  //
  // $scope.$watch('form.emi', function(newValue, oldValue) {
  //   if (typeof newValue == 'number') {
  //     console.log(Math.ceil($scope.advData.amount / newValue),'--------wwwwatch emi');
  //     $scope.form.tenure = Math.ceil($scope.advData.amount / newValue)
  //   }
  // })



  // $scope.$watch('form..emiStartOffset', function(newValue, oldValue) {
  //   if (typeof newValue == 'number') {
  //     if ($scope.form.loanStartedDate != null) {
  //       var td = new Date($scope.form.loanStartedDate)
  //     } else {
  //       var td = new Date()
  //     }
  //     stDate = new Date(td.setMonth(td.getMonth() + newValue))
  //     // console.log(stDate);
  //     $scope.emilist = [];
  //     console.log($scope.form.tenure,'----in 2nd watchhh');
  //     for (var i = 0; i < $scope.form.tenure; i++) {
  //       console.log($scope.emilist);
  //       $scope.emilist.push({
  //         dt: new Date(stDate.setMonth(stDate.getMonth() + i)).toJSON().split('T')[0],
  //         amt: $scope.form.emi
  //       })
  //     }
  //   }
  // })




  $scope.$watch('[form.emi,form.emiStartOffset]', function(newValue, oldValue) {
    console.log(newValue);
    if (typeof newValue[0] == 'number') {
      console.log(Math.ceil($scope.advData.amount / newValue[0]), '--------wwwwatch emi');
      $scope.form.tenure = Math.ceil($scope.advData.amount / newValue[0])
    }

    if (typeof newValue[1] == 'number') {
      $scope.emilist = [];
      console.log($scope.form.tenure, '----in 2nd watchhh');
      for (var i = 0; i < $scope.form.tenure; i++) {
        if ($scope.form.loanStartedDate != null) {
          var td = new Date($scope.form.loanStartedDate)
        } else {
          var td = new Date()
        }
        stDate = new Date(td.setMonth(td.getMonth() + newValue[1]))
        $scope.emilist.push({
          dt: new Date(stDate.setMonth(stDate.getMonth() + i)).toJSON().split('T')[0],
          amt: $scope.form.emi
        })
      }
      console.log($scope.emilist);
    }


    //  if (newValue.typ=='loan') {
    //    if (typeof newValue.emi == 'number') {
    //      console.log(Math.ceil($scope.advData.amount / newValue.emi ),'--------wwwwatch emi');
    //      $scope.form.tenure = Math.ceil($scope.advData.amount / newValue.emi )
    //    }
    //  if (typeof newValue.emiStartOffset == 'number') {
    //     if ($scope.form.loanStartedDate != null) {
    //       var td = new Date($scope.form.loanStartedDate)
    //     } else {
    //       var td = new Date()
    //     }
    //     stDate = new Date(td.setMonth(td.getMonth() + newValue.emiStartOffset))
    //     // console.log(stDate);
    //     $scope.emilist = [];
    //     console.log($scope.form.tenure,'----in 2nd watchhh');
    //     for (var i = 0; i < $scope.form.tenure; i++) {
    //       console.log($scope.emilist);
    //       $scope.emilist.push({
    //         dt: new Date(stDate.setMonth(stDate.getMonth() + i)).toJSON().split('T')[0],
    //         amt: $scope.form.emi
    //       })
    //     }
    //   }
    // }
  }, true)




  $scope.startLoan = function(pk) {
    var f = $scope.form;
    if ($scope.advData.typ == 'loan') {
      if ($scope.advData.amount == (f.emi * f.tenure)) {
        dataToSend = {
          emiStartOffset: f.emiStartOffset,
          emi: f.emi,
          tenure: f.tenure,
          loanStarted: true,
          loanStartedDate: $scope.today.toJSON().split('T')[0]
        }
        $http({
          method: 'PATCH',
          url: '/api/payroll/advances/' + pk + '/',
          data: dataToSend,
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
          $scope.advData = response.data;
          $scope.checkApprove();
          $rootScope.$broadcast('forceRefetch', {});
          var tosend = {
            pk: $scope.advData.pk,
            emiDate: $scope.emilist,
          }
          $http({
            method: 'POST',
            url: '/api/payroll/sendLoanSettlementEmail/',
            data: tosend,
          }).
          then(function() {
            Flash.create('success', 'Email sent successfully');
            console.log('sent email');
          })
        })
      } else {
        Flash.create('warning', 'Please enter proper EMI amount');
        return;
      }
    }
  }

})
app.controller("workforceManagement.payroll.advances.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope) {

  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?limit=10&username__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.today = new Date()
  $scope.reset = function() {
    $scope.form = {
      user: '',
      reason: '',
      dateOfReturn: $scope.today,
      document: emptyFile,
      returnMethod: 'SALARY_ADVANCE',
      amount : 0
    }
  }
  $scope.reset()
  $scope.save = function() {
    if ($scope.form.user == undefined || $scope.form.user == null || typeof $scope.form.user != 'object'  ) {
      Flash.create('warning' ,'Add user')
      return
    }
    if ($scope.form.reason == undefined || $scope.form.reason == null || $scope.form.reason.length == 0 ) {
      Flash.create('warning' ,'Add reason')
      return
    }
    if ($scope.form.amount == undefined || $scope.form.amount == null || $scope.form.amount.length == 0 || $scope.form.amount==0 ) {
      Flash.create('warning' ,'Add amount')
      return
    }
    var f = $scope.form;
    var fd = new FormData();
    fd.append('user', f.user.pk);
    fd.append('reason', f.reason);
    fd.append('amount', f.amount);
    fd.append('returnMethod', f.returnMethod);
    fd.append('dateOfReturn', dateToString(f.dateOfReturn));
    $http({
      method: 'POST',
      url: '/api/payroll/advances/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
        $scope.reset()
      // $scope.advData = response.data;
      // $scope.checkApprove();
      // $rootScope.$broadcast('forceRefetch', {});
    })
  }


});
