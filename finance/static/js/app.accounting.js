// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.accounting', {
      url: "/accounting",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "menu@businessManagement.accounting": {
          templateUrl: '/static/ngTemplates/genericMenu.html',
          controller: 'controller.generic.menu',
        },
        "@businessManagement.accounting": {
          templateUrl: '/static/ngTemplates/app.finance.account.journal.html',
          controller: 'businessManagement.finance.accounts.journal',
        }
      }
    })
    .state('businessManagement.accountsView', {
      url: "/accounts/:id",
      templateUrl: '/static/ngTemplates/app.finance.accounts.explore.html',
      controller: 'businessManagement.finance.accounts.explore'
    })
    .state('businessManagement.bankAccounts', {
      url: "/bankAccounts",
      templateUrl: '/static/ngTemplates/app.finance.accounts.html',
      controller: 'admin.disbursal'
    })
    .state('businessManagement.bankAccounts.accounts', {
      url: "/acc",
      templateUrl: '/static/ngTemplates/app.finance.bankAccounts.html',
      controller: 'businessManagement.finance.bankAccounts'
    })
    .state('businessManagement.bankAccounts.pettyCash', {
      url: "/pettyCash",
      templateUrl: '/static/ngTemplates/app.finance.bankAccounts.html',
      controller: 'businessManagement.finance.pettyCash'
    })
    .state('businessManagement.accounting.vendor', {
      url: "/vendor",
      templateUrl: '/static/ngTemplates/app.finance.vendor.html',
      controller: 'businessManagement.finance.vendor'
    })
    .state('businessManagement.newVendor', {
      url: "/newVendor",
      templateUrl: '/static/ngTemplates/app.finance.vendor.form.html',
      controller: 'businessManagement.finance.vendor.form'
    })

    .state('businessManagement.editVendor', {
      url: "/editVendor/:id",
      templateUrl: '/static/ngTemplates/app.finance.vendor.form.html',
      controller: 'businessManagement.finance.vendor.form'
    })
    .state('businessManagement.expenses', {
      url: "/expenses",
      templateUrl: '/static/ngTemplates/app.finance.expenses.html',
      controller: 'businessManagement.finance.financeExpenses'
    })
    .state('businessManagement.accounting.invoice', {
      url: "/expenses/invoice",
      templateUrl: '/static/ngTemplates/app.finance.inboundInvoices.form.html',
      controller: 'businessManagement.finance.inboundInvoices.form'
    })
    .state('businessManagement.accounting.poToInvoice', {
      url: "/expenses/poToInvoice/:id",
      templateUrl: '/static/ngTemplates/app.finance.inboundInvoices.form.html',
      controller: 'businessManagement.finance.inboundInvoices.form'
    })
    .state('businessManagement.accounting.editInvoice', {
      url: "/expenses/editInvoice/:id",
      templateUrl: '/static/ngTemplates/app.finance.inboundInvoices.form.html',
      controller: 'businessManagement.finance.inboundInvoices.form'
    })
    .state('businessManagement.accounting.explore', {
      url: "/expenses/explore/:id",
      templateUrl: '/static/ngTemplates/app.finance.expenses.explore.html',
      controller: 'businessManagement.finance.expenses.explore.controller'
    })


    .state('businessManagement.accounting.reimbursement', {
      url: "/reimbursement",
      templateUrl: '/static/ngTemplates/app.finance.reimbursement.form.html',
      controller: 'businessManagement.finance.reimbursement'
    })

    .state('businessManagement.advances', {
      url: "/advances",
      templateUrl: '/static/ngTemplates/app.payroll.advances.html',
      controller: 'workforceManagement.payroll.advances',
    })
    .state('businessManagement.accounting.new', {
      url: "/new",
      templateUrl: '/static/ngTemplates/app.payroll.advances.form.html',
      controller: 'workforceManagement.payroll.advances.form',
    })
    .state('businessManagement.advanceexplore', {
      url: "/advanceexplore/:id",
      templateUrl: '/static/ngTemplates/app.payroll.advances.explore.html',
      controller: 'workforceManagement.payroll.advances.explore',
    })

});
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


app.controller('businessManagement.finance.default', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.dateForm = {
    stMonth: new Date(),
    edMonth: new Date()
  }
  $scope.fetchAmtData = function() {
    $http({
      method: 'GET',
      url: '/api/finance/amountCalculation/?stMonth=' + $scope.dateForm.stMonth.toJSON().split('T')[0] + '&edMonth=' + $scope.dateForm.edMonth.toJSON().split('T')[0],
    }).
    then(function(response) {
      $scope.amtDetails = response.data
    })
  }
  $scope.fetchAmtData()

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function random_rgba() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
  }

  $http.get('/api/finance/monthsExpensesData/').
  then(function(response) {
    console.log(response.data);
    new Chart(document.getElementById("active-line-chart"), {
      type: "line",
      data: {
        labels: response.data.labels,
        datasets: [{
          label: "Month Wise Expenses",
          data: response.data.datasets,
          backgroundColor: "#e92815",
          borderColor: "#e27d73",
          fill: false,
          lineTension: 0,
          radius: 7
        }, ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Month Wise Expenses",
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
          }],
          yAxes: [{
            gridLines: {
              display: false,
            },
          }]
        }
      }
    });
  })

  $http.get('/api/finance/expensesGraphData/').
  then(function(response) {
    console.log(response.data);
    $scope.expData = response.data
    for (var i = 0; i < $scope.expData.datasets.length; i++) {
      clr = getRandomColor()
      console.log(clr);
      $scope.expData.datasets[i].backgroundColor = clr
      $scope.expData.datasets[i].hoverBackgroundColor = clr
    }
    var numberWithCommas = function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    new Chart(document.getElementById("items-bar-chart"), {
      type: 'bar',
      data: {
        labels: $scope.expData.labels,
        datasets: $scope.expData.datasets
      },
      options: {
        title: {
          display: true,
          text: "Projects Expenses",
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: true,
          labels: {
            fontColor: "#333",
            fontSize: 16
          }
        },
        tooltips: {
          mode: 'label',
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            },
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            },
          }]
        }
      }
    });
  })

  $scope.projectWiseData = function() {
    $http.get('/api/projects/project/?projectClosed=false').
    then(function(response) {
      console.log(response.data);
      $scope.projExpData = response.data
      setTimeout(function() {
        for (var i = 0; i < $scope.projExpData.length; i++) {
          $scope.projExpData[i].expPercent = (($scope.projExpData[i].totalCost * 100) / $scope.projExpData[i].budget).toFixed(1)
          if ($scope.projExpData[i].expPercent == 'NaN') {
            $scope.projExpData[i].expPercent = 0
          }
          clr = random_rgba()
          var ids = "expense-doughnut-chart" + i
          // console.log(ids, clr);
          new Chart(document.getElementById(ids), {
            type: 'doughnut',
            data: {
              labels: ['Expenses', 'Balance'],
              datasets: [{
                backgroundColor: [clr, 'rgba(255, 255, 255, 0)'],
                data: [$scope.projExpData[i].totalCost, ($scope.projExpData[i].budget - $scope.projExpData[i].totalCost)]
              }]
            },
            options: {
              cutoutPercentage: 70,
              legend: {
                display: false
              },
              title: {
                display: false,
                text: $scope.projExpData[i].title,
              }
            },
          });
        }
      }, 500);

    })
  }
  $scope.projectWiseData()

  $scope.showProjectForm = function(obj) {
    console.log(obj);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.pettyCash.projectForm.html',
      size: 'lg',
      backdrop: true,
      controller: function($scope, $http, Flash, $users, $uibModalInstance) {
        console.log('incontrollerrrrrr', obj);
        $scope.projForm = obj
        $scope.closeProject = function() {
          $http({
            method: 'PATCH',
            url: '/api/projects/project/' + $scope.projForm.pk + '/',
            data: {
              projectClosed: true,
            }
          }).
          then(function(response) {
            console.log(response.data);
            Flash.create('success', 'Project Closed Successfilly');
            $uibModalInstance.dismiss('Update')
          })
        }
        $scope.updateProject = function() {
          console.log($scope.projForm);
          var f = $scope.projForm
          if (f.title == null || f.title.length == 0) {
            Flash.create('danger', 'Please Write Some Title')
            return
          }
          if (f.budget == null || f.budget == undefined) {
            Flash.create('danger', 'Mention Project Budget');
            return;
          }
          if (f.description == null || f.description.length == 0) {
            Flash.create('danger', 'Write Some Description Of The Project');
            return;
          }
          var toSend = {
            title: f.title,
            description: f.description,
            budget: f.budget
          }
          console.log(typeof f.dueDate);
          if (typeof f.dueDate == 'object') {
            toSend.dueDate = f.dueDate
          }
          console.log(toSend);
          $http({
            method: 'PATCH',
            url: '/api/projects/project/' + $scope.projForm.pk + '/',
            data: toSend
          }).
          then(function(response) {
            console.log(response.data);
            Flash.create('success', 'Updated');
            $uibModalInstance.dismiss('Update')
          })
        }
      },
    }).result.then(function() {}, function(res) {
      if (res == 'Update') {
        console.log('refresh graph');
        $scope.projectWiseData()
      }
    });
  }


  var ids = "inflow-line-chart"
  let chart = new Chart(document.getElementById(ids), {
    type: 'line',
    data: {
      datasets: [{
          data: [10000, 20000, 30000, 40000, 50000],
          borderColor: '#2490EF',
          // backgroundColor: 'white',
          label: 'Outflow',
          fill: false


        },
        {
          data: [50000, 45000, 30000, 40000, 50000],
          borderColor: '#289F38',
          // backgroundColor: 'white',
          label: 'Inflow',
          fill: false

        },

      ],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    options: {

      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        // yAxes: [{
        //    gridLines: {
        //       display: false
        //    }
        // }]
      }
    }
  });
  var ids = "profitloss-bar-graph"
  let barGraph = new Chart(document.getElementById(ids), {
    type: 'bar',
    data: {
      datasets: [{
          data: [10000, 20000, 30000, 40000, 50000],
          barPercentage: 0.5,
          barThickness: 2,
          maxBarThickness: 8,
          minBarLength: 2,
          categoryPercentage: 70,
          backgroundColor: '#2C9AF1',



        },
        {
          data: [-50000, -45000, 30000, 40000, 50000],
          barPercentage: 0.5,
          barThickness: 2,
          maxBarThickness: 8,
          minBarLength: 2,
          categoryPercentage: 70,
          backgroundColor: '#CCCFD1',
          fill: false


        },

      ],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    options: {
      legend: {
        display: false,
        labels: {
          fontColor: "#000080",
        }
      },

    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      // yAxes: [{
        //    gridLines: {
          //       display: false
          //    }
          // }]
        }

    }
  });
  // var ids = "sales-invoice-chart"
  // let horizontalBargraph = new Chart(document.getElementById(ids), {
  //   type: 'horizontalBar',
  //   data: {
  //     datasets: [{
  //         data: [10000, 20000, 30000, 40000, 50000],
  //         barPercentage: 0.5,
  //         barThickness: 2,
  //         maxBarThickness: 8,
  //         minBarLength: 2,
  //         categoryPercentage: 70,
  //         backgroundColor: '#2C9AF1'
  //
  //       },
  //       //     {
  //       //       data: [-50000,-45000,30000,40000,50000],
  //       //       barPercentage: 0.5,
  //       // barThickness: 2,
  //       // maxBarThickness: 8,
  //       // minBarLength: 2,
  //       // categoryPercentage:70,
  //       // backgroundColor:'#CCCFD1'
  //       //
  //       //   },
  //
  //     ],
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         gridLines: {
  //           drawBorder: false,
  //         },
  //       }]
  //     },
  //     legend: {
  //          display: true,
  //          labels: {
  //              fontColor: 'rgb(255, 99, 132)',
  //              text:'Profit'
  //          }
  //      }
  //   },
  // });

  clr = getRandomColor()
  let doughnutGraph = new Chart(document.getElementById('expenses-doughnut'), {
    type: 'doughnut',
    data: {
      labels: ['Rent & Mortgage', 'Automotive','Travel Expenses','Food & Entertainment','Others'],
      datasets: [{
        backgroundColor: ['red', 'green', 'blue', 'orange'],
        data: [1000, 2000, 3000, 50000,60000],
      }]
    },
    options: {
      cutoutPercentage: 70,
      legend: {
        display: true,
        position:'left'
      },
      title: {
        display: true,
        // text: 'Top Expenses',
      },
      elements: {
      center: {
        text: 'Red is 2/3 of the total numbers',
        color: 'red', // Default is #000000
        fontStyle: 'Arial', // Default is Arial
        sidePadding: 20, // Default is 20 (as a percentage)
        minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
        lineHeight: 25 // Default is 25 (in px), used for when text wraps
      }
    },
            centertext: "123"
    },
  });

})

app.controller('businessManagement.finance.vendor', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0
  $scope.vendorprev = function(){
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.vendorListData()
    }
  }
  $scope.vendornext = function(){
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.vendorListData()
    }
  }

  $scope.searchForm = {
    search: ''
  }

  $scope.vendorListData = function(){
  var url = '/api/finance/vendorprofile/?limit='+$scope.limit+'&offset='+$scope.offset
  if ($scope.searchForm.search.length>0) {
      url = url+'&service__name__icontains='+$scope.searchForm.search
    }
  $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.vendorDList = response.data.results
      $scope.count = response.data.count
    })
  }

  $scope.vendorListData()

  // $scope.data = {
  //   tableData: []
  // };
  //
  // views = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.finance.vendor.item.html',
  // }, ];
  //
  // $scope.config = {
  //   views: views,
  //   url: '/api/finance/vendorprofile/',
  //   filterSearch: true,
  //   searchField: 'name',
  //   deletable: true,
  //   itemsNumPerView: [12, 24, 48],
  //   getParams: [{
  //     key: 'vendor',
  //     value: true
  //   }]
  // }
  //
  //
  // $scope.tableAction = function(target, action, mode) {
  //   console.log(target, action, mode);
  //   console.log($scope.data.tableData, 'yyyyyyyyyyyyyyyyy');
  //
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     if ($scope.data.tableData[i].pk == parseInt(target)) {
  //       if (action == 'edit') {
  //         var title = 'Edit VendorProfile :';
  //         var appType = 'vendorEditor';
  //       } else if (action == 'details') {
  //         var title = 'Details :';
  //         var appType = 'vendorExplorer';
  //       } else if (action == 'invoiceDetails') {
  //         var title = 'Invoice :';
  //         var appType = 'vendorInvoice';
  //       }
  //
  //       $scope.addTab({
  //         title: title + $scope.data.tableData[i].service.name,
  //         cancel: true,
  //         app: appType,
  //         data: {
  //           pk: target,
  //           index: i
  //         },
  //         active: true
  //       })
  //
  //     }
  //   }
  // }

  $scope.viewVendors = function(vdata){
    $scope.vendorPk = vdata.pk
    console.log(vdata, 'tttttttttttt');
    $scope.addTab({
      title: 'Details : ' + vdata.service.name,
      cancel: true,
      app: 'vendorExplorer',
      data: vdata,
      active: true
    })
      $scope.fetchData(vdata.pk)
  }
  // $scope.today = new Date()
  // if ($scope.tab == undefined) {
  //   $scope.resetForm();
  // } else {
  //   $scope.vendorData = $scope.tab.data
  // }
  //
  $scope.items = []

  $scope.addTableRow = function() {
    $scope.items.push({
      particular: '',
      rate: 0,
    });
    console.log($scope.items);
  }

  $scope.deleteTable = function(index) {
    if ($scope.items[index].pk != undefined) {
      $http({
        method: 'DELETE',
        url: '/api/finance/VendorService/' + $scope.items[index].pk + '/'
      }).
      then((function(index) {
        return function(response) {
          $scope.items.splice(index, 1);
          Flash.create('success', 'Deleted');
        }
      })(index))

    } else {
      $scope.items.splice(index, 1);
    }
  };


  $scope.fetchData = function(index) {
    $http({
      method: 'GET',
      url: '/api/finance/vendorservice/?vendorProfile=' + index
    }).
    then(function(response) {
      $scope.vendorServiceData = response.data;
      // console.log('---------------------------------');
      console.log($scope.vendorServiceData, 'ffffffffffff');
    })
  }
  // $scope.fetchData()

  $scope.deleteData = function(pk, index) {
    // console.log('---------------delelelele------------');
    // console.log($scope.vendorServiceData);
    $scope.vendorServiceData.splice(index, 1);
    $http({
      method: 'DELETE',
      url: '/api/finance/vendorservice/' + pk + '/'
    }).
    then((function(index) {
      return function(response) {

        Flash.create('success', 'Deleted');
      }
    })(index))

  }

  $scope.save = function() {

    for (var i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].particular.length == 0) {
        Flash.create('warning', 'Please Remove Empty Rows');
        return
      }
    }
    for (var i = 0; i < $scope.items.length; i++) {
      var url = '/api/finance/vendorservice/'
      var method = 'POST';
      if ($scope.items[i].pk != undefined) {
        url += $scope.items[i].pk + '/'
        method = 'PATCH';
      }
      var toSend = {
        particular: $scope.items[i].particular,
        rate: $scope.items[i].rate,
        vendorProfile: $scope.vendorPk,
      }
      // console.log(toSend);
      $http({
        method: method,
        url: url,
        data: toSend
      }).
      then((function(i) {
        return function(response) {
          $scope.vendorServiceData.push(response.data)
          if (i == $scope.items.length - 1) {
            Flash.create('success', 'Saved');
            $scope.items = []
          }
          // $scope.items[i].pk = response.data.pk;
          // $scope.resetRow()
        }
      })(i))
    }

  }

  $scope.vendorExplore = function(vdata){
    $scope.invoiceData = vdata
    $scope.vendorPk = vdata.pk
    console.log(vdata, 'tttttttttttt');
    $scope.addTab({
      title: 'Details : ' + vdata.service.name,
      cancel: true,
      app: 'vendorInvoice',
      data: vdata,
      active: true
    })
      $scope.fetchInvoiceData(vdata.pk)
  }


  $scope.openUpload = function() {
    console.log('-----------------came to function');
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.vendor.upload.form.html',
      size: 'md',
      backdrop: true,
      resolve: {
        fdata: function() {
          return $scope.invoiceData;
        }
      },
      controller: function($scope, fdata, $uibModalInstance) {

        $scope.form = {
          'dated': new Date(),
          'dueDate': new Date(),
          'amount': 0,
          'gst': 0,
          'invoice': emptyFile,
        }
        $scope.reset = function() {
          $scope.form = {
            'dated': new Date(),
            'dueDate': '',
            'amount': '',
            'gst': '',
            'invoice': emptyFile,
            'invNo':''
          }
        }

        $scope.saveInvoice = function() {
          var method = 'POST'
          var Url = '/api/finance/vendorinvoice/'
          var fd = new FormData();
          if ($scope.form.invoice != emptyFile) {
            fd.append('invoice', $scope.form.invoice)
          }else{
              Flash.create('danger', 'Please upload the invoice Doc');
          }
          fd.append('vendorProfile', fdata.pk);
          fd.append('dated', $scope.form.dated.toJSON().split('T')[0]);
          fd.append('amount', $scope.form.amount);
          fd.append('gst', $scope.form.gst);
          fd.append('dueDate', $scope.form.dueDate.toJSON().split('T')[0]);
          if ($scope.form.invNo!=null&&$scope.form.invNo.length>0) {
            fd.append('invNo', $scope.form.invNo);
          }
          $http({
            method: method,
            url: Url,
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            // $scope.vendorInvoiceData.push(response.data)
            $uibModalInstance.dismiss(response.data);
          });
        }
      }, //----controller ends--------------
    }).result.then(function(f) {

    }, function(f) {
      console.log($scope.vendorInvoiceData, 'qqqqqqqqqqqqqqqqq');
      // $scope.vendorInvoiceData.push(f)
      $scope.fetchInvoiceData();
    });
  } //--------------openUploadfunction ends------------------

  //----------------fetch invoice -----------
  if ($scope.tab == undefined) {} else {
    // $scope.invoiceData = $scope.data.tableData[$scope.tab.data.index]
    $scope.invoiceData = $scope.tab.data
    console.log($scope.invoiceData, '$scope.invoiceData$scope.invoiceData');
  }

  $scope.fetchInvoiceData = function(idx) {
    $http({
      method: 'GET',
      url: '/api/finance/vendorinvoice/?vendorProfile=' + idx

    }).
    then(function(response) {
      $scope.vendorInvoiceData = response.data;
    })
  }
  $scope.fetchInvoiceData()



  //-------------------delete invoice-----------------
  $scope.deleteInvoice = function(pk, index) {
    console.log('---------------delelelele------------');
    // console.log($scope.vendorServiceData);
    $scope.vendorInvoiceData.splice(index, 1);
    $http({
      method: 'DELETE',
      url: '/api/finance/vendorinvoice/' + pk + '/'
    }).
    then((function(index) {
      return function(response) {
        $scope.fetchInvoiceData()
        Flash.create('success', 'Deleted');
      }
    })(index))

  }

  //-----------------chnage status and  apply date to approvedon and disbursedon
  $scope.setStatus = function(pk, idx, approved, disbursed) {
    // console.log($scope.me.pk, '----------meeeeeeeeeee');
    // console.log(idx, $scope.vendorInvoiceData[idx]);
    console.log(disbursed, approved, '--------ststststs');
    if (disbursed == true) {
      dataToSend = {
        date : $scope.today.toJSON().split('T')[0],
        sourcePk: pk,
        source: 'Vendor Invoice',
        narration: 'Vendor Invoice' + ' , ' + $scope.vendorInvoiceData[idx].vendorProfile.service.name,
        contactPerson: $scope.vendorInvoiceData[idx].vendorProfile.contactPerson,
        accountNumber: $scope.vendorInvoiceData[idx].vendorProfile.accountNumber,
        bankName: $scope.vendorInvoiceData[idx].vendorProfile.bankName,
        ifscCode: $scope.vendorInvoiceData[idx].vendorProfile.ifscCode,
        amount: $scope.vendorInvoiceData[idx].amount,
      }
      console.log(dataToSend,'---------sssseenndd');
      $http({
        method: 'POST',
        url: '/api/finance/disbursal/',
        data: dataToSend,
      }).
      then(function(response) {
        $http({
          method: 'PATCH',
          url: '/api/finance/vendorinvoice/' + pk + '/',
          data: {
            disbursed: disbursed,
          },
        }).
        then(function(response) {
          $scope.vendorInvoiceData[idx] = response.data
          console.log($scope.vendorInvoiceData, 'hhhhhhhhhhh');
          Flash.create('success', 'Saved');
        })
      })
    } else {
      $http({
        method: 'PATCH',
        url: '/api/finance/vendorinvoice/' + pk + '/',
        data: {
          approved: approved,
          approver: $scope.me.pk,
        }
      }).then(function(response) {
        $scope.vendorInvoiceData[idx] = response.data
        console.log($scope.vendorInvoiceData, 'uuuuuuuuuuuuuuu');
        Flash.create('success', 'Saved');
      });
    }
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input), 'iiiiiiiiiiiiiiiiiiiiiiiiii');
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

  // $scope.$on('exploreCustomer', function(event, input) {
  //   console.log("recieved");
  //   console.log(input);
  //   $scope.addTab({
  //     "title": "Details :" + input.vendor.service,
  //     "cancel": true,
  //     "app": "vendorExplorer",
  //     "data": {
  //       "pk": input.vendor.pk
  //     },
  //     "active": true
  //   })
  // });


  $scope.$on('exploreInvoice', function(event, input) {
    console.log("recieved");
    console.log(input);
    $scope.addTab({
      "title": "Details :" + input.vendor.service,
      "cancel": true,
      "app": "vendorInvoice",
      "data": {
        "pk": input.vendor.pk
      },
      "active": true
    })
  });

  $scope.vendorListEdit = function(e){
    $scope.addTab({
      "title": "Edit :" + e.pk,
      "cancel": true,
      "app": "vendorEditor",
      "data": e,
      "active": true
    })
  }

  // $scope.$on('editCustomer', function(event, input) {
  //   console.log("recieved");
  //   console.log(input);
  //   $scope.addTab({
  //     "title": "Edit :" + input.vendor.service,
  //     "cancel": true,
  //     "app": "vendorEditor",
  //     "data": {
  //       "pk": input.vendor.pk,
  //       vendor: input.vendor
  //     },
  //     "active": true
  //   })
  // });


})


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.controller("businessManagement.finance.vendor.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, ) {

  $scope.resetForm = function() {
    $scope.form = {
      contactperson: '',
      mobile: '',
      email: '',
      paymentTerm: '',
      contentDocs: emptyFile,
      service: ''
    }
  }

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  //--------------------------------------------------------------------

  $scope.showCreateCompanyBtn = false;
  $scope.companyExist = false;
  $scope.me = $users.get('mySelf');

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.$watch('form.service', function(newValue, oldValue) {
    // console.log(newValue);
    if (typeof newValue == "string" && newValue.length > 0) {
      $scope.showCreateCompanyBtn = true;
      $scope.companyExist = false;
      $scope.showCompanyForm = false;
    } else if (typeof newValue == "object") {
      $scope.companyExist = true;
    } else {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
    }

    if (newValue == '') {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
      $scope.companyExist = false;
    }

  });

  $scope.openCreateService = function() {
    // console.log($scope.form.service, '-----------------');
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.vendor.create.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.form.service;
        }
      },
      controller: function($scope, data, $uibModalInstance) {
        // console.log(data);
        $scope.form = {
          service: data,
          mobile: '',
          about: '',
          telephone: '',
          cin: '',
          tin: '',
          logo: '',
          web: '',
          address: {
            street: null,
            city: null,
            state: null,
            country: null,
            pincode: null
          }
        }
        if (typeof data == 'object') {
          $scope.form.service = data.name
          $scope.form.mobile = data.mobile
          $scope.form.telephone = data.telephone
          $scope.form.tin = data.tin
          $scope.form.cin = data.cin
          $scope.form.address = data.address
          $scope.form.logo = data.logo
          $scope.form.web = data.web
          $scope.form.about = data.about

        } else {
          $scope.form.service = data
        }
        //------------------------------------------------------------------------
        $scope.createCompany = function() {
          var method = 'POST'
          var addUrl = '/api/ERP/address/'
          var serviceUrl = '/api/ERP/service/'
          if ($scope.form.address.pk) {
            method = 'PATCH'
            addUrl = addUrl + $scope.form.address.pk + '/'
            serviceUrl = serviceUrl + data.pk + '/'
          }
          // console.log(addUrl,serviceUrl);
          $http({
            method: method,
            url: addUrl,
            data: $scope.form.address
          }).
          then(function(response) {
            var dataToSend = {
              name: $scope.form.service,
              mobile: $scope.form.mobile,
              about: $scope.form.about,
              address: response.data.pk,
              telephone: $scope.form.telephone,
              cin: $scope.form.cin,
              tin: $scope.form.tin,
              logo: $scope.form.logo,
              web: $scope.form.web,
            };
            $http({
              method: method,
              url: serviceUrl,
              data: dataToSend
            }).
            then(function(response) {
              Flash.create('success', 'Saved');
              $uibModalInstance.dismiss(response.data);
            });
          })
        }
      }, //----controller ends
    }).result.then(function(f) {
      $scope.fetchData();
    }, function(f) {
      // console.log('777777777777777777777777', f);
      if (typeof f == 'object') {
        $scope.form.service = f
      }
    });

  }

  // -----------------------------------------------------------------------------

  if ($state.is('businessManagement.newVendor')) {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.resetForm()
    $http({
      method: 'GET',
      url: '/api/finance/vendorprofile/' + $state.params.id + '/',
    }).
    then(function(response) {
      $scope.form = response.data
    })
  }
  if ($scope.mode == 'edit') {
    if ($scope.form.contentDocs.length>0) {
      var list = $scope.form.contentDocs.split('/')
      $scope.form.contentDocs = list[7]
    }
  }

  $scope.createVendor = function() {
    if ($scope.form.contactPerson == null || $scope.form.contactPerson.length == 0) {
      Flash.create('warning', 'Please Mention Contact Person Name')
      return
    }
    var fd = new FormData();
    fd.append('contactPerson', $scope.form.contactPerson);
    if ($scope.form.service != null && typeof $scope.form.service == 'object') {
      fd.append('service', $scope.form.service.pk);
    }
    if ($scope.form.contentDocs != null && $scope.form.contentDocs != emptyFile) {
      fd.append('contentDocs', $scope.form.contentDocs);
    }
    if ($scope.form.mobile != null && $scope.form.mobile.length > 0) {
      fd.append('mobile', $scope.form.mobile);
    }
    if ($scope.form.email != null && $scope.form.email.length > 0) {
      fd.append('email', $scope.form.email);

    }
    if ($scope.form.paymentTerm != null && $scope.form.paymentTerm.length > 0) {
      fd.append('paymentTerm', $scope.form.paymentTerm);
    }
    if ($scope.form.bankName != null && $scope.form.bankName.length > 0) {
      fd.append('bankName', $scope.form.bankName);
    }
    if ($scope.form.accountNumber != null && $scope.form.accountNumber.length > 0) {
      fd.append('accountNumber', $scope.form.accountNumber);
    }
    if ($scope.form.ifscCode != null && $scope.form.ifscCode.length > 0) {
      fd.append('ifscCode', $scope.form.ifscCode);
    }
    $http({
      method: 'POST',
      url: '/api/finance/vendorprofile/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    });
  }

  $scope.updateVendor = function() {
    var addUrl = '/api/ERP/address/'
    var vendorUrl = '/api/finance/vendorprofile/'
    var serviceUrl = '/api/ERP/service/'
    var addData = {
      street: $scope.form.service.address.street,
      city: $scope.form.service.address.city,
      state: $scope.form.service.address.state,
      country: $scope.form.service.address.country,
      pincode: $scope.form.service.address.pincode,
    }
    var servData = {
      telephone: $scope.form.service.telephone,
      cin: $scope.form.service.cin,
      tin: $scope.form.service.tin,
      logo: $scope.form.service.logo,
      web: $scope.form.service.web,
    };
    $http({
      method: 'PATCH',
      url: addUrl + $scope.form.service.address.pk + '/',
      data: addData,
    }).
    then(function(response) {
      // Flash.create('success', 'Updated');
    });
    $http({
      method: 'PATCH',
      url: serviceUrl + $scope.form.service.pk + '/',
      data: servData,
    }).
    then(function(response) {
      // Flash.create('success', 'Updated');
    });
    var fd = new FormData();
    console.log($scope.mode,'uurqiuweiouriqoweuriqwoeurioweru');
    fd.append('contactPerson', $scope.form.contactPerson);
    if ($scope.form.service != null && typeof $scope.form.service == 'object') {
      fd.append('service', $scope.form.service.pk);
    }
    if ($scope.form.contentDocs != null && $scope.form.contentDocs != emptyFile && typeof $scope.form.contentDocs == 'object') {
      fd.append('contentDocs', $scope.form.contentDocs);
    }
    if ($scope.form.mobile != null && $scope.form.mobile.length > 0) {
      fd.append('mobile', $scope.form.mobile);
    }
    if ($scope.form.email != null && $scope.form.email.length > 0) {
      fd.append('email', $scope.form.email);
    }
    if ($scope.form.paymentTerm != null && $scope.form.paymentTerm.length > 0) {
      fd.append('paymentTerm', $scope.form.paymentTerm);
    }
    if ($scope.form.bankName != null && $scope.form.bankName.length > 0) {
      fd.append('bankName', $scope.form.bankName);
    }
    if ($scope.form.accountNumber != null && $scope.form.accountNumber.length > 0) {
      fd.append('accountNumber', $scope.form.accountNumber);
    }
    if ($scope.form.ifscCode != null && $scope.form.ifscCode.length > 0) {
      fd.append('ifscCode', $scope.form.ifscCode);
    }
    $http({
      method: 'PATCH',
      url: vendorUrl + $scope.form.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).then(function(response) {
      Flash.create('success', 'Updated Vendor');
      if ($scope.mode == 'new') {
        $scope.resetForm()
      }
    }, function(error) {
      Flash.create('danger', 'Something Went Wrong please check all Details');
    })
  }

})

app.controller("businessManagement.finance.vendor.item", function($scope, $state, $users, $stateParams, $http, Flash) {



})



app.controller("businessManagement.finance.vendor.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  console.log($scope.data, 'ddddddddd');




})
