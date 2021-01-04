app.controller('businessManagement.finance.pettyCash', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.me = $users.get('mySelf');
  // console.log($scope.me);
  // $scope.form = {
  //   amount: 1,
  //   project: '',
  //   description: '',
  //   costCenter:'',
  //   heading: '',
  //   attachment: emptyFile,
  //   dated: new Date()
  // }
  $scope.userAccounts = []
  $http.get('/api/finance/account/?personal=true&contactPerson=' + $scope.me.pk).
  then(function(response) {
    console.log(response.data);
    // response.data = []
    // response.data = response.data.splice(0,1)
    $scope.userAccounts = response.data;
    if ($scope.userAccounts.length>0) {
      $scope.changeTable(0)
    }
    if (response.data.length > 0) {
      if (response.data.length == 1) {
        $scope.form.accountIdx = 0
      } else {
        $scope.form.accountIdx = -1
      }
    }
  })

$scope.resetForm = function(){
  $scope.form = {
    description:'',
    amount:0,
    creditAmount:0,
    balance :0
  }
}
$scope.resetForm()

  $scope.changeTable = function(indx){
    $scope.pettyCashData = []
    $scope.currentAccount = $scope.userAccounts[indx]
    $scope.selectedIndx = indx
    $http.get('/api/finance/pettyCash/?account='+$scope.userAccounts[indx].pk).
    then(function(response) {
      $scope.pettyCashData = response.data
      if ($scope.pettyCashData.length==0) {
          $scope.form.balance = $scope.userAccounts[indx].balance
      }
      else{
      $scope.form.balance = $scope.pettyCashData[$scope.pettyCashData.length-1].balance
      }
    })
  }


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
        account : $scope.currentAccount.pk,
        balance : $scope.form.balance
      }
      $http({
        method : 'POST',
        url : '/api/finance/pettyCash/',
        data : dataToSend
      }).then(function(response){
        $scope.pettyCashData.push(response.data)
        $scope.resetForm()
        $scope.form.balance = response.data.balance
        $scope.userAccounts[$scope.selectedIndx].balance = response.data.balance
        Flash.create('success','Added Succesfully')
      })
  }








  // $scope.costCenterSearch = function(query) {
  //   return $http.get('/api/finance/costCenter/?name__contains=' + query).
  //   then(function(response) {
  //     return response.data;
  //   })
  // };
  //
  // $scope.limit = 0
  // $scope.expData = []
  // $scope.showMore = true
  // $scope.getExpenseData = function(){
  //   $scope.limit += 4
  //   console.log($scope.limit);
  //   $http.get('/api/projects/project/?limit=' + $scope.limit).
  //   then(function(response) {
  //     console.log(response.data);
  //     $scope.expData = response.data.results
  //     if (response.data.next==null) {
  //       $scope.showMore = false
  //     }
  //     for (var i = 0; i < $scope.expData.length; i++) {
  //       var clr = "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%,0.5)';
  //       $scope.expData[i].colorCode = clr
  //     }
  //   })
  //
  //
  //
  //   // $scope.limit += 1
  //   // console.log($scope.limit);
  //   // $http.get('/api/finance/getExpenseData/?limit=' + $scope.limit).
  //   // then(function(response) {
  //   //   console.log(response.data);
  //   //   $scope.expData = response.data
  //   //   if ($scope.expData.length<$scope.limit) {
  //   //     $scope.showMore = false
  //   //   }
  //   //   for (var i = 0; i < $scope.expData.length; i++) {
  //   //     var clr = "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%,0.5)';
  //   //     $scope.expData[i].colorCode = clr
  //   //   }
  //   // })
  // }
  // $scope.getExpenseData()
  //
  // $scope.titleSearch = function(query) {
  //   return $http.get('/api/finance/expenseHeading/?limit=15&title__icontains=' + query).
  //   then(function(response) {
  //     return response.data.results;
  //   })
  // };
  //
  // $scope.projectSearch = function(query) {
  //   return $http.get('/api/projects/project/?title__icontains=' + query).
  //   then(function(response) {
  //     return response.data;
  //   })
  // };
  //
  //
  // $scope.$watch('form.project', function(newValue, oldValue) {
  //   if (newValue.length>0&&newValue.pk==undefined) {
  //     $scope.form.newProject = true
  //   }else {
  //     $scope.form.newProject = false
  //   }
  // })
  // $scope.openProjectPopup = function(){
  //   $uibModal.open({
  //     templateUrl: '/static/ngTemplates/app.finance.pettyCash.projectForm.html',
  //     size: 'lg',
  //     backdrop: true,
  //     resolve: {
  //       form: function() {
  //         return $scope.form
  //       },
  //     },
  //     controller: function($scope,$http, Flash, $users, $uibModalInstance,form){
  //       $scope.projForm = {title:form.project,dueDate:new Date(),description:'',budget:0}
  //       $scope.createProject = function(){
  //         console.log($scope.projForm );
  //         var f = $scope.projForm
  //         if (f.title.length == 0) {
  //           Flash.create('danger', 'Please Write Some Title')
  //           return
  //         }
  //         if (f.budget == null || f.budget == undefined) {
  //           Flash.create('danger', 'Mention Project Budget');
  //           return;
  //         }
  //         if (f.description.length == 0) {
  //           Flash.create('danger', 'Write Some Description Of The Project');
  //           return;
  //         }
  //         $http({
  //           method: 'POST',
  //           url: '/api/projects/project/',
  //           data: {
  //             title: f.title,
  //             description: f.description,
  //             dueDate: f.dueDate,
  //             budget: f.budget
  //           }
  //         }).
  //         then(function(response) {
  //           console.log(response.data);
  //           Flash.create('success', 'Project Created Successfilly');
  //           $uibModalInstance.dismiss(response.data)
  //         })
  //       }
  //     },
  //   }).result.then(function() {}, function(res) {
  //     if (res.pk) {
  //       console.log('updating project');
  //       $scope.form.project = res
  //     }
  //   });
  // }
  //
  // $scope.postData = function() {
  //   var f = $scope.form
  //   console.log(f);
  //   var formData = new FormData();
  //
  //   formData.append('amount', f.amount)
  //   if (typeof f.project=='object') {
  //     formData.append('project', f.project.pk)
  //   }
  //   if (typeof f.costCenter=='object') {
  //     formData.append('costCenter', f.costCenter.pk)
  //   }
  //   formData.append('account', $scope.userAccounts[f.accountIdx].pk)
  //   formData.append('heading', f.heading.pk)
  //   formData.append('dated', f.dated.toJSON().split('T')[0])
  //
  //   if (f.attachment != emptyFile) {
  //     formData.append('attachment', f.attachment)
  //   }
  //   if (f.description.length > 0) {
  //     formData.append('description', f.description)
  //   }
  //
  //   console.log(formData);
  //
  //   $http({
  //     method: 'POST',
  //     url: '/api/projects/pettyCash/',
  //     data: formData,
  //     transformRequest: angular.identity,
  //     headers: {
  //       'Content-Type': undefined
  //     }
  //   }).
  //   then(function(response) {
  //     Flash.create('success', 'Saved');
  //     $scope.getExpenseData()
  //     $scope.form = {
  //       amount: 1,
  //       project: '',
  //       description: '',
  //       heading: '',
  //       attachment: emptyFile,
  //       accountIdx: 0,
  //       dated: new Date()
  //     }
  //     if ($scope.userAccounts.length > 1) {
  //       $scope.form.accountIdx = -1
  //     }
  //   })
  //
  // }
  //
  // $scope.createRecord = function() {
  //   var f = $scope.form
  //   if (f.heading.length == 0) {
  //     Flash.create('danger', 'Please Write Some Title')
  //     return
  //   }
  //   // if (f.project.length == 0) {
  //   //   Flash.create('warning', 'Select The Projet');
  //   //   return;
  //   // }
  //   if (typeof f.project!='object' && typeof f.costCenter!='object') {
  //     Flash.create('warning', 'Select or Create Project or Select Cost Center');
  //     return;
  //   }
  //   if (f.accountIdx == -1) {
  //     Flash.create('warning', 'Select The Account');
  //     return;
  //   }
  //   if (f.amount == null || f.amount == undefined) {
  //     Flash.create('warning', 'Select Proper Amount');
  //     return;
  //   }
  //   if (f.amount>$scope.userAccounts[f.accountIdx].balance) {
  //     Flash.create('warning', 'In sufficient Amount');
  //     return;
  //   }else {
  //     $scope.userAccounts[f.accountIdx].balance -= f.amount
  //   }
  //
  //   if (f.heading.pk == undefined) {
  //     $http({
  //       method: 'POST',
  //       url: '/api/finance/expenseHeading/',
  //       data: {
  //         title: f.heading
  //       }
  //     }).
  //     then(function(response) {
  //       console.log(response.data);
  //       f.heading = response.data
  //       $scope.postData()
  //     })
  //   } else {
  //     $scope.postData()
  //   }
  //
  // }
  //
  // $scope.openExpenseDetails = function(idx) {
  //   $aside.open({
  //     templateUrl: '/static/ngTemplates/app.finance.pettyCash.details.html',
  //     size: 'xl',
  //     backdrop: true,
  //     placement:'right',
  //     resolve: {
  //       expData: function() {
  //         return $scope.expData[idx]
  //       },
  //     },
  //     controller: 'businessManagement.finance.pettyCash.details',
  //   }).result.then(function() {}, function(res) {
  //   });
  // }

})

app.controller('businessManagement.finance.pettyCash.details', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModalInstance , expData) {
  // console.log(expData);
  $scope.data = expData
  $http.get('/api/finance/pettyCash/?project='+$scope.data.pk).
  then(function(response) {
    // console.log(response.data);
    $scope.expensesData = response.data
  })
  $scope.cancel = function(){
    $uibModalInstance.dismiss();
  }
})
