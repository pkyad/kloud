app.controller('controller.home.expense.claims', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $window) {
  // settings main page controller
  $scope.opened = false;

  window.addEventListener("message", function(evt) {
    console.log(evt);
    if (evt.data[0].type == 'fileScan' && $scope.opened == false ) {
      $scope.opened = true;
      $scope.addInvoicesData(evt.data[0].file)
    }
  })




  var today = new Date()
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  $scope.form = {
    to: today,
    frm: lastDayOfMonth,
    stage:'submitted',
  }
  $scope.data =[]
  $scope.reload = function() {
    var to = new Date($scope.form.to.getFullYear(),$scope.form.to.getMonth(),$scope.form.to.getDate()+2)
    $http.get('/api/finance/getExpenses/?frm=' + $scope.form.frm.toJSON().split('T')[0] + '&to=' + to.toJSON().split('T')[0]+ '&stage=' + $scope.form.stage)
      .then(function(response) {
        $scope.data = response.data;
      })
  }

  $scope.reloadByMonth = function(){
    $http.get('/api/finance/getExpenses/?month='+$scope.select.month+'&year='+$scope.select.year+ '&stage=' + $scope.select.stage)
      .then(function(response) {
        $scope.data = response.data;
      })
  }


  $scope.download = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.expenseDownload.html',
      size: 'md',
      backdrop: true,
      controller: function($scope,$http, Flash, $users, $uibModalInstance){
        $scope.getUsers = function(){
          $http.get('/api/HR/users/?is_active==true').
          then(function(response) {
            $scope.users =  response.data;
          })
        }
        $scope.getUsers()
        var date  = new Date()
        $scope.form = {
          fromDate : new Date(date.getFullYear(), date.getMonth(), 1),
          toDate : date,
          selectedUser : ''
        }
        $scope.downloadSheet = function(){
          var url = '/api/finance/downloadExpenses/?frm=' + $scope.form.fromDate.toJSON().split('T')[0] + '&to=' + $scope.form.toDate.toJSON().split('T')[0];
          if ($scope.form.selectedUser != null  && typeof $scope.form.selectedUser == 'object') {
            url = url + '&user=' + $scope.form.selectedUser.pk
          }
          window.open(url,'_blank');
        }
      },
    }).result.then(function() {}, function(res) {
    });

  }

  $scope.downloadByMonth = function(){
    var url = '/api/finance/downloadExpensesPdf/?month='+$scope.select.month+'&year='+$scope.select.year+ '&stage=' + $scope.select.stage;
    window.open(url,'_blank');
  }

  $scope.getForm = function(mode, pkVal,stage) {
    if (stage=='created' || stage=='submitted'|| stage=='cancelled') {
      var edit = false
    }
    $aside.open({
      templateUrl: '/static/ngTemplates/app.home.expenseClaims.form.html',
      position: 'right',
      size: 'xxl',
      backdrop: false,
      resolve: {
        mode: function() {
          return mode;
        },
        pkVal: function() {
          return pkVal;
        },
        editStage: function() {
          return edit;
        },
        canApprove: function() {
          return true;
        },
        createPermission: function() {
          return $scope.createPermission;
        },
      },
      controller: 'home.expense.claims.form',
    }).result.then(function() {
      $scope.reload()
    }, function() {
      // $scope.reload()
    })
  }

  if (LIMIT_EXPENSE_COUNT == 'True') {
      $scope.months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      $scope.currentYear = new Date().getFullYear()
      $scope.monthVal =  new Date().getMonth()
      $scope.select = {}
      $scope.select.month = $scope.months[$scope.monthVal]
      console.log($scope.month);
      $scope.select.year =  new Date().getFullYear()
      $scope.startYear = 2011;
      $scope.years =[]
      while ( $scope.startYear <= $scope.currentYear ) {
          $scope.years.push($scope.startYear++);
      }
      $scope.createPermission = false
      $scope.select.stage='submitted'
      $scope.reloadByMonth()
  }else{
    $scope.createPermission = true
    $scope.reload()
  }



  $scope.loadTags = function(query) {
    return $http.get('/api/HR/userSearch/?username__contains=' + query)
  };

  $scope.openNewExpenses = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.newExpenses.html',
      size: 'md',
      backdrop: true,
      controller: function($scope,$http, Flash, $users, $uibModalInstance){
        $scope.form = {notes:''}
        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
        $scope.createExpense = function(){

          $http({
            method: 'POST',
            url: '/api/finance/expenseSheet/',
            data: {
              notes: $scope.form.notes,
            }
          }).
          then(function(response) {
            console.log(response.data);
            Flash.create('success', 'Expense Created Successfilly');
            $uibModalInstance.dismiss(response.data)
          })
        }
      },
    }).result.then(function() {}, function(res) {
      if (res!=undefined&&res.pk) {
        $state.go('home.editExpenseClaims' , {'id' : res.pk})
      }
    });
  }

  $scope.addInvoicesData = function(fileUrl){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.addInvoices.html',
      size: 'md',
      backdrop: true,
      resolve : {
        fileUrl : function() {
          return fileUrl
        }
      },
      controller: function($scope,$http, Flash, $users, $uibModalInstance , fileUrl){

        window.addEventListener("message", function(evt) {
          console.log(evt);
          if (evt.data[0].type == 'fileScan' ) {
            $scope.form.fileUrl = evt.data[0].file;
            $scope.form.selection = 'scan';
          }
        })

        console.log(fileUrl);

        $scope.form = {code:'',description:'',amount:0,attachment:emptyFile  , selection : 'file'}

        if (fileUrl != undefined && fileUrl != null) {
          $scope.form.fileUrl = fileUrl;
          $scope.form.selection = 'scan';
        }


        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
        $scope.selectFile = function() {
          $('#filePicker').click()
        }
        $scope.createInvoice = function(){


            var f = $scope.form;
            var fd = new FormData();
            if (f.attachment != null && f.attachment != emptyFile && typeof f.attachment != 'string' ) {
              fd.append('attachment', f.attachment)
            }

            if ($scope.form.selection == 'scan') {
              fd.append('scan', f.fileUrl)
            }

            if (f.code != null && f.code.pk != undefined) {
              fd.append('code', f.code.title);
            } else {
              fd.append('code', f.code);
            }

            fd.append('amount', f.amount);
            fd.append('description', f.description);
          $http({
            method: 'POST',
            url: '/api/finance/invoices/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Expense Created Successfilly');
            $scope.form = {code:'',description:'',amount:0,attachment:emptyFile  , selection : 'file'}

            // $uibModalInstance.dismiss()
          })
        }
      },
    }).result.then(function() {
      $scope.opened = false;
    }, function() {
      $scope.opened = false;
      $scope.reload()
    });
  }

$scope.fileDropzone = function(){
  return
}

  $scope.createExpense = function() {
    var dataToSend = {
      title: 'a sample title',
      title: 'a sample title',
    }
    $http({
      method: 'post',
      url: '/api/finance/expenseSheet/',
      data: dataToSend
    }).
    then(function(response) {
      var pk = response.data.pk;
      $scope.users = []
    }, function(error) {

    })
  }
  $scope.page = 0
  $scope.searchText = ''
  $scope.me = $users.get('mySelf');
  $scope.users = [];
  $scope.reload = function(typ) {
  $scope.typ = typ
  // var url = '/api/finance/expenseSheet/?user='+$scope.me.pk+'&limit='+$scope.limit+'&offset=' + $scope.page*5
  // if (typ == 'search') {
  //   url = url+'&notes__icontains=' +$scope.searchText
  // }
  //   $http({
  //     method: 'GET',
  //     url:  url,
  //   }).
  //   then(function(response) {
  //     $scope.expenseData = response.data.results;
  //   }, function(error) {
  //   })
    $http({
      method: 'GET',
      url:  '/api/finance/getExpensesData/',
    }).
    then(function(response) {
      $scope.expenseData = response.data.expenseObj;
      $scope.invoicesData = response.data.unclaimedObj;
      $scope.unclaimed = response.data.unclaimed;
      $scope.claimed = response.data.claimed;
      $scope.approved = response.data.approved;
    }, function(error) {
    })
  }




  if (LIMIT_EXPENSE_COUNT == 'True') {
    $scope.createPermission = false
    $scope.limit = 6
    $http({
      method: 'POST',
      url:  '/api/finance/createExpenses/',
    }).
    then(function(response) {
        $scope.reload('all')
    }, function(error) {
    })
  }else{
    $scope.createPermission = true
    $scope.limit = 5
    $scope.reload('all')
  }

  $scope.next = function() {
    $scope.page += 1;
    $scope.reload($scope.typ);
  }

  $scope.prev = function() {
    if ($scope.page != 0) {
      $scope.page -=1;
      $scope.reload($scope.typ);
    }
  }


  $scope.delete = function(indx,pkVal){
    $http({method : 'DELETE' , url : '/api/finance/expenseSheet/' + pkVal +'/'}).
    then(function(response) {
      $scope.expenseData.splice(indx , 1);
    })
  }

  $scope.getForm = function(mode, pkVal,stage) {
    if ( stage=='submitted' || stage=='approved' || stage=='cancelled') {
      var edit = false
      var mode = 'view'
    }
    $aside.open({
      templateUrl: '/static/ngTemplates/app.home.expenseClaims.form.html',
      position: 'right',
      size: 'xxl',
      backdrop: false,
      resolve: {
        mode: function() {
          return mode;
        },
        pkVal: function() {
          return pkVal;
        },
        editStage: function() {
          return edit;
        },
        canApprove: function() {
          return false;
        },
        createPermission: function() {
          return $scope.createPermission;
        },
      },
      controller: 'home.expense.claims.form',
    }).result.then(function() {
      $scope.reload()
    }, function() {
      // $scope.reload()
    })
  }



})
app.controller('home.expense.claims.item', function($scope, $http) {

});
app.controller('app.home.expenseClaims.newForm', function($scope, $http, $state, Flash) {
  $scope.resetForm = function() {
    $scope.mode = 'new';
    $scope.form = {
      'notes': '',
      'stage': 'created'
    }
  }
  $scope.resetForm()

  $scope.refreshInvoice = function() {
    $scope.invoiceForm = {
      'code': '',
      'amount': 0,
      'attachment': emptyFile,
      'description': '',
    }
  }
  $scope.refreshInvoice();
  $scope.is_approver = false
  $scope.getData = function(){
    $http.get('/api/finance/expenseSheet/' + $state.params.id+'/').
    then(function(response) {
      $scope.form = response.data;
    })
  }
  if ($state.is('home.editExpenseClaims') || $state.is('home.approveExpenseClaims')) {
    $scope.mode = 'edit'
    $scope.getData()
    if ($state.is('home.approveExpenseClaims')) {
      $scope.is_approver = true
    }
  }

  $scope.saveExpenseSheet = function() {
    var f = $scope.form;
    if (f.notes.length == 0) {
      Flash.create('danger', 'Title Is Required');
      return
    }
    var toSend = {
      notes: f.notes,
    }
    var url = '/api/finance/expenseSheet/';
    if (!$scope.form.pk) {
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
      // Flash.create('success', 'Saved');
      // $state.go('home.editExpenseClaims',{'id':response.data.pk})
    })
  }
  $scope.saveInvoice = function() {
    var f = $scope.invoiceForm;
    console.log(f);
    if (f.code.length == 0) {
      Flash.create('danger', 'Expense Particular Is Required');
      return
    }
    if (f.amount.length == 0 || f.amount == 0) {
      Flash.create('danger', 'Amount Is Required');
      return
    }
    // if (f.description.length == 0) {
    //   Flash.create('danger', 'Description Is Required');
    //   return
    // }
    var url = '/api/finance/invoices/';
    var method = 'POST';
    if ($scope.invoiceForm.pk) {
      method = 'PATCH';
      url += $scope.invoiceForm.pk + '/';
    }
    var fd = new FormData();
    if (f.attachment != null && f.attachment != emptyFile && typeof f.attachment != 'string' ) {
      fd.append('attachment', f.attachment)
    }

    if (f.code != null && f.code.pk != undefined) {
      fd.append('code', f.code.title);
    } else {
      fd.append('code', f.code);
    }

    fd.append('amount', f.amount);
    fd.append('sheet', $scope.form.pk);
    fd.append('description', f.description);
    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.form.invoices.push(response.data);
      Flash.create('success', 'Saved');
      $scope.showEdit = false
      $scope.refreshInvoice();
    })
  }

  $scope.approveInvoice = function(indx){
    console.log($scope.form.unapproved[indx]);
    if ($scope.form.unapproved[indx].accepted) {
        var url = '/api/finance/invoices/'+$scope.form.unapproved[indx].pk+'/';
        var method = 'PATCH';
        $http({
          method: method,
          url: url,
          data: {
          sheet : $scope.form.pk
        },
        }).
        then(function(response) {
          response.data.added = true
          $scope.form.invoices.push(response.data);
          $scope.form.unapproved.splice(indx, 1);
        })
    }

  }

  $scope.undo = function(indx){
    console.log($scope.form.invoices[indx]);
    // if ($scope.form.invoices[indx].accepted) {
        var url = '/api/finance/invoices/'+$scope.form.invoices[indx].pk+'/';
        var method = 'PATCH';
        $http({
          method: method,
          url: url,
          data: {
          sheet : null
        },
        }).
        then(function(response) {
          $scope.form.invoices.splice(indx, 1);
          $scope.form.unapproved.push(response.data);
        })
    // }

  }

  $scope.showEdit = false

  $scope.show = function() {
    $scope.showEdit = true
    $scope.refreshInvoice()
  }

  $scope.cancel = function() {
    $scope.showEdit = false
  }

  $scope.close = function(){
      $uibModalInstance.close();
  }

  $scope.editInvoice = function(ind, pk) {
    if($scope.mode=='edit'&&($scope.form.stage=='created' || $scope.form.stage=='submitted') && !$scope.is_approver){
      $scope.showEdit = true
      $scope.invoiceForm = $scope.form.invoices[ind];
      $scope.form.invoices.splice(ind, 1);
    }
  }

  $scope.deleteInvoice = function(ind, pk) {
    $http({
      method: 'DELETE',
      url: '/api/finance/invoices/' + pk + '/'
    }).
    then((function(ind) {
      return function(response) {
        $scope.form.invoices.splice(ind, 1);
      }
    })(ind))

  }

  $scope.changeStatus = function(status){
    console.log(status,'aaaaaaaaaaaaaaaa');
    dataToSend = {
        stage:status
    }
    $http({
      method: 'PATCH',
      url:  '/api/finance/expenseSheet/'+$scope.form.pk+'/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.form.stage = response.data.stage
    })
  }
});


app.controller('home.expenseSheet.invoiceView', function($scope, $http, input) {
  console.log(input);
  $scope.invoice = input;
  $scope.$watch('invoice.approved', function(newValue, oldValue) {
    console.log($scope.invoice.pk);
    $http({
      method: 'PATCH',
      url: '/api/finance/invoices/' + $scope.invoice.pk + '/',
      data: {
        approved: newValue
      }
    }).
    then(function(response) {})
  })
});

app.controller('home.expenses.claims.explore', function($scope, $http, $aside, Flash) {

  $scope.expense = $scope.data.tableData[$scope.tab.data.index]

  // $http({
  //   method: 'GET',
  //   url: '/api/finance/invoices/?sheet=' + $scope.expense.pk
  // }).
  // then(function(response) {
  //   console.log('sssssssssssssssss', response.data);
  //   $scope.invoices = response.data;
  // })


  $scope.viewInvoice = function(ind) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.home.aside.expenseClaims.invoiceView.html',
      position: 'right',
      size: 'xl',
      backdrop: true,
      resolve: {
        input: function() {
          return $scope.expense.invoices[ind];
        }
      },
      controller: 'home.expenseSheet.invoiceView',
    })
  }
  // $scope.form = {
  //   'approved': 'No'
  // }
  console.log("fbh", $scope.expense.pk);
  $scope.save = function(value) {
    var toSend = {
      approved: $scope.expense.approved,
    }
    console.log("fff", toSend);
    $http({
      method: 'PATCH',
      url: '/api/finance/expenseSheet/' + value + '/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.expense = response.data
    })
  }


})



app.controller('home.expense.claims.form', function($scope, $http, Flash, mode, pkVal,$uibModalInstance,editStage,canApprove, $uibModal,createPermission, $timeout) {
  console.log(editStage,'pppppppppp');
  $scope.editStage = editStage
  $scope.canApprove = canApprove
    $scope.createPermission = createPermission
  $scope.projectSearch = function(query) {
    return $http.get('/api/projects/project/?title__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };




  $scope.codeSearch = function(query) {
    return $http.get('/api/finance/expenseHeading/?limit=10&title__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.resetForm = function() {
    $scope.mode = 'new';
    $scope.editStage = false
    $scope.form = {
      'notes': '',
      'projects': ''
    }
  }
  $scope.mode = mode
  console.log($scope.mode,'pppppppppppp');
  if (mode == 'edit' || mode == 'view') {
    $http.get('/api/finance/expenseSheet/' + pkVal).
    then(function(response) {
      $scope.form = response.data;
      $scope.form.projects = $scope.form.project[0]
      if (LIMIT_EXPENSE_COUNT=='True') {
        $scope.showEdit = false
        $scope.mode = 'edit'

          if ($scope.form.stage=='approved' || $scope.form.stage=='cancelled') {
            $scope.mode = 'view'
          }
      }
    })
  } else {
    $scope.resetForm()
  }


  $scope.$watch('form.projects', function(newValue, oldValue) {
    if (newValue.length>0&&newValue.pk==undefined) {
      $scope.form.newProject = true
    }else {
      $scope.form.newProject = false
    }
  })

  $scope.openProjectPopup = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.pettyCash.projectForm.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        form: function() {
          return $scope.form
        },
      },
      controller: function($scope,$http, Flash, $users, $uibModalInstance,form){
        $scope.projForm = {title:form.projects,dueDate:new Date(),description:'',budget:0}
        $scope.createProject = function(){
          console.log($scope.projForm );
          var f = $scope.projForm
          if (f.title.length == 0) {
            Flash.create('danger', 'Please Write Some Title')
            return
          }
          if (f.budget == null || f.budget == undefined) {
            Flash.create('danger', 'Mention Project Budget');
            return;
          }
          if (f.description.length == 0) {
            Flash.create('danger', 'Write Some Description Of The Project');
            return;
          }
          $http({
            method: 'POST',
            url: '/api/projects/project/',
            data: {
              title: f.title,
              description: f.description,
              dueDate: f.dueDate,
              budget: f.budget
            }
          }).
          then(function(response) {
            console.log(response.data);
            Flash.create('success', 'Project Created Successfilly');
            $uibModalInstance.dismiss(response.data)
          })
        }
      },
    }).result.then(function() {}, function(res) {
      if (res.pk) {
        console.log('updating project');
        $scope.form.projects = res
      }
    });
  }


  $scope.sentForApproval = function(){
    dataToSend = {
        stage:'submitted'
    }
    if (typeof $scope.form.projects=='object') {
    dataToSend.projects =  $scope.form.projects.pk
    }
    $http({
      method: 'PATCH',
      url:  '/api/finance/expenseSheet/'+$scope.form.pk+'/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.editStage = false
      // $scope.mode = 'view'
      $scope.form.stage = 'submitted'
    })
  }

  $scope.approve = function(){
    dataToSend = {
        stage:'approved'
    }
    if (typeof $scope.form.projects=='object') {
    dataToSend.projects =  $scope.form.projects.pk
    }
    $http({
      method: 'PATCH',
      url:  '/api/finance/expenseSheet/'+$scope.form.pk+'/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.editStage = false
      $scope.mode = 'view'
      $scope.form.stage = 'approved'
    })
  }

  $scope.reject = function(){
    dataToSend = {
        stage:'cancelled'
    }
    if (typeof $scope.form.projects=='object') {
    dataToSend.projects =  $scope.form.projects.pk
    }
    $http({
      method: 'PATCH',
      url:  '/api/finance/expenseSheet/'+$scope.form.pk+'/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.editStage = false
      $scope.mode = 'view'
      $scope.form.stage = 'cancelled'
    })
  }


  $scope.showEdit = false

  $scope.show = function() {
    $scope.showEdit = true
    $scope.refreshInvoice()
  }

  $scope.cancel = function() {
    $scope.showEdit = false
  }

  $scope.close = function(){
      $uibModalInstance.close();
  }
  // $scope.expenseCodes = []
  //
  // $scope.$watch('invoiceForm.service', function(newValue, oldValue) {
  //   if (newValue.pk != undefined) {
  //     $http({
  //       method: 'GET',
  //       url: '/api/finance/vendorservice/?vendorProfile__service=' + newValue.pk
  //     }).
  //     then(function(response) {
  //       $scope.expenseCodes = response.data;
  //     })
  //   }
  // })


  // if (typeof $scope.tab != 'undefined' && $scope.tab.data.pk != -1) {
  //   if ($scope.tab.data.index == undefined) {
  //     $scope.form = $scope.tab.data.expense;
  //   } else {
  //     $scope.form = $scope.data.tableData[$scope.tab.data.index];
  //   }
  //   $scope.mode = 'edit';
  //   $scope.form.projects = $scope.form.project[0]
  //   console.log($scope.form)
  // } else {
  //   $scope.resetForm();
  // }

  // $scope.invoiceForm = {
  //   'service': '',
  //   'code': '',
  //   'amount': '',
  //   'currency': '',
  //   'dated': '',
  //   'attachment': emptyFile,
  //   'description': '',
  // }
  // $scope.$watch('form.project', function(newValue, oldValue) {
  //   console.log('cecking', newValue.pk);
  //   if (typeof newValue == 'object') {
  //     $scope.projectData = true;
  //     $scope.projectData = newValue;
  //
  //   } else {
  //     $scope.projectData = false;
  //   }
  // })
  // $scope.$watch('invoiceForm.service', function(newValue, oldValue) {
  //   console.log('cecking', newValue.pk);
  //   if (typeof newValue == 'object') {
  //     $scope.serviceData = true;
  //     $scope.serviceData = newValue;
  //
  //   } else {
  //     $scope.serviceData = false;
  //   }
  // })


  $scope.saveExpenseSheet = function() {
    var f = $scope.form;
    if (f.notes.length == 0) {
      Flash.create('danger', 'Title Is Required');
      return
    }
    // if (f.projects.pk == undefined) {
    //   Flash.create('danger', 'Project Is Required');
    //   return
    // }
    var toSend = {
      notes: f.notes,
      stage:f.stage
    }
    console.log(toSend);
    if (typeof f.projects=='object') {
    toSend.projects =  f.projects.pk
    }
    var url = '/api/finance/expenseSheet/';
    if ($scope.form.pk == undefined) {
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
      $scope.form = response.data;
      $scope.form.projects = $scope.form.project[0]
      $scope.mode = 'edit'
      Flash.create('success', 'Saved');
    })
  }
  // if ($scope.mode == 'edit') {
  //   $http({
  //     method: 'GET',
  //     url: '/api/finance/invoices/?sheet=' + $scope.form.pk
  //   }).
  //   then(function(response) {
  //     $scope.invoiceData = response.data;
  //   })
  // }

  $scope.deleteInvoice = function(ind, pk) {
    $http({
      method: 'DELETE',
      url: '/api/finance/invoices/' + pk + '/'
    }).
    then((function(ind) {
      return function(response) {
        $scope.form.invoices.splice(ind, 1);
      }
    })(ind))

  }

  $scope.editInvoice = function(ind, pk) {
    $scope.showEdit = true
    $scope.invoiceForm = $scope.form.invoices[ind];
    $scope.form.invoices.splice(ind, 1);
  }
  $scope.refreshInvoice = function() {
    $scope.invoiceForm = {
      'code': '',
      'amount': 0,
      'currency': 'INR',
      'dated': new Date(),
      'attachment': emptyFile,
      'gstVal': 0,
      'gstIN': '',
      'description': '',
      'invNo':'',
      'invoiceAmount':0
    }
  }
  $scope.refreshInvoice();
  $scope.saveInvoice = function() {
    var f = $scope.invoiceForm;
    console.log(f);
    if (f.code.length == 0) {
      Flash.create('danger', 'Expense Title Is Required');
      return
    }
    if (f.amount.length == 0) {
      Flash.create('danger', 'Amount Is Required');
      return
    }
    if (f.gstVal.length == 0) {
      Flash.create('danger', 'GST Amount Is Required');
      return
    }
    if (f.description.length == 0) {
      Flash.create('danger', 'Description Is Required');
      return
    }
    var url = '/api/finance/invoices/';
    var method = 'POST';
    if ($scope.invoiceForm.pk) {
      method = 'PATCH';
      url += $scope.invoiceForm.pk + '/';
    }
    var fd = new FormData();
    if (f.attachment != null && f.attachment != emptyFile && typeof f.attachment != 'string' ) {
      fd.append('attachment', f.attachment)
    }
    if (f.gstIN != null && f.gstIN.length > 0) {
      fd.append('gstIN', f.gstIN);
    }
    if (f.invNo != null && f.invNo.length > 0) {
      fd.append('invNo', f.invNo);
    }
    if (f.invoiceAmount != null && f.invoiceAmount.length > 0) {
      fd.append('invoiceAmount', f.invoiceAmount);
    }
    // fd.append('service', f.service.pk);
    if (f.code != null && f.code.pk != undefined) {
      fd.append('code', f.code.title);
    } else {
      fd.append('code', f.code);
    }

    fd.append('amount', f.amount);
    fd.append('gstVal', f.gstVal);
    fd.append('currency', f.currency);
    if (typeof f.dated == 'object') {
      fd.append('dated', f.dated.toJSON().split('T')[0]);
    } else {
      fd.append('dated', f.dated);
    }
    fd.append('sheet', $scope.form.pk);
    fd.append('description', f.description);
    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.form.invoices.push(response.data);
      Flash.create('success', 'Saved');
      $scope.showEdit = false
      $scope.refreshInvoice();
    })
  }



// if (LIMIT_EXPENSE_COUNT=='True') {
//   $scope.showEdit = false
//   $scope.mode = 'edit'
//
//   $timeout(function() {
//     if ($scope.form.stage=='approved' || $scope.form.stage=='cancelled') {
//       $scope.mode = 'view'
//     }
//   },500)
// }

});
