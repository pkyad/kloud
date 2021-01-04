app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.payroll', {
      url: "/payroll",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "@workforceManagement.payroll": {
          templateUrl: '/static/ngTemplates/app.payroll.salary.html',
          controller: 'workforceManagement.salary',
        }
      }
    })



    .state('workforceManagement.payroll.draft', {
      url: "/draft/:year/:month",
      templateUrl: '/static/ngTemplates/app.payroll.salary.report.html',
      controller: 'workforceManagement.salary.payroll.report'
    })

    .state('workforceManagement.payroll.form16', {
      url: "/form16",
      templateUrl: '/static/ngTemplates/app.payroll.form16.html',
      controller: 'workforceManagement.salary.payroll.form16'
    })

    .state('workforceManagement.payroll.details', {
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.payroll.salary.refortinfo.html',
      controller: 'workforceManagement.salary.payslips.info'
    })

});
app.controller("workforceManagement.payroll", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.today = new Date()
  $http({
    method: 'GET',
    url: '/api/HR/users/',
  }).
  then(function(response) {
    $scope.employees = response.data.length;
  })
  var resultKey = function(obj) {
    var name = Object.keys(obj).map(function(key) {
      return [key];
    });
    return name
  }
  var resultValue = function(obj) {
    var name = Object.keys(obj).map(function(key) {
      return obj[key];
    });
    return name
  }
  var monArr = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', "September", 'October', 'November', 'December']
  $http.get('api/payroll/report/').
  then(function(response) {
    var payroll = {}
    $scope.payrollOut = response.data[response.data.length - 1].total
    $scope.payrollRunYear = response.data[response.data.length - 1].year
    $scope.payrollRunMon = monArr[response.data[response.data.length - 1].month]
    var sliceArr = response.data.slice(response.data.length - 12, response.data.length)
    sliceArr.forEach(function(item) {
      var month = monArr[item.month]
      payroll[month] = item.total
    })

    new Chart(document.getElementById("sales-bar-chart"), {
      type: 'bar',
      data: {
        labels: resultKey(payroll),
        datasets: [{
          backgroundColor: "#3E95CD",
          strokeColor: "brown",
          label: "PayOut",
          data: resultValue(payroll)
        }]
      },
      options: {

        legend: {
          display: true,
          position: 'bottom',
          text: 'Salaries',
        },
        title: {
          display: true,
          text: "Last " + sliceArr.length + " Months PayOut"
        },
        scales: {
          xAxes: [{
            categoryPercentage: 1,
            barPercentage: 0.7,
            ticks: {
              display: true,
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
              drawBorder: true,
              display: false,
            },
          }],
          yAxes: [{
            categoryPercentage: 1,
            barPercentage: 0.7,
            ticks: {
              display: true
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
              drawBorder: true,
              display: false,
            }
          }]
        },
      }
    });
  })

  $http.get('api/HR/designation/').
  then(function(response) {
    var departments = response.data.map(function(dept) {
      if (dept.department != null) {
        return dept.department.dept_name
      }
    })
    var countByDept = function(deptments) {
      var value = {};
      departments.forEach(function(i) {
        if (i != undefined) {
          value[i] = (value[i] || 0) + 1;
        }
      });
      return value
    }
    var countObj = countByDept(departments);

    new Chart(document.getElementById("downtime-doughnut-chart"), {
      type: 'doughnut',
      data: {
        labels: resultKey(countObj),
        datasets: [{
          label: "",
          backgroundColor: ["#ee535b", "#f8ac25", "#3cba9f"],
          data: resultValue(countObj)
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Employee Count by Dept'
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  })


  // var year = $scope.today.toJSON().split('-')[0]
  // var month = $scope.today.toJSON().split('-')[1]

  $http.get("api/payroll/advancesData/").
  then(function(response) {
    $scope.adv = response.data;
  })

});


app.controller("controller.warehouse.payroll.openReportInfo", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $uibModalInstance, usr) {

  $http({
    method: 'GET',
    url: '/api/payroll/getPayslipDetails/?user=' + usr+'&month='+$state.params.month+'&year='+$state.params.year
  }).then(function(response) {
    $scope.payroll = response.data;
    // console.log($scope.payroll);
  })

})


app.controller("workforceManagement.salary.payroll.info", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.data = $scope.tab.data;

  $scope.joiningDate = new Date($scope.data.joiningDate);
  $scope.joiningDateYear = $scope.joiningDate.getFullYear();
  $scope.joiningMonth = $scope.joiningDate.getMonth();

  $scope.currentDate = new Date()
  $scope.currentYear = new Date().getFullYear()
  $scope.currentMonth = new Date().getMonth();

  if ($scope.data.lastWorkingDate != null) {
    $scope.lastWorkingDate = new Date($scope.data.lastWorkingDate);
    $scope.lastWorkingYear = $scope.lastWorkingDate.getFullYear();
    $scope.lastWorkingMonth = $scope.lastWorkingDate.getMonth();
  } else {
    $scope.lastWorkingDate = $scope.currentDate
    $scope.lastWorkingYear = $scope.currentYear
    $scope.lastWorkingMonth = $scope.currentMonth
  }

  if ($scope.lastWorkingYear < $scope.currentYear) {
    $scope.currentYear = $scope.lastWorkingYear
    $scope.currentDate = $scope.lastWorkingDate
  }


  $scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  $scope.allData = function(currentYear) {
    $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    $scope.currentYear = currentYear
    $scope.monthsData = []
    if ($scope.joiningDateYear == $scope.lastWorkingYear) {
      if ($scope.joiningMonth == $scope.lastWorkingMonth) {
        $scope.monthsData.push($scope.months[$scope.joiningMonth])
      } else {
        $scope.monthsData = $scope.months.splice($scope.joiningMonth, $scope.lastWorkingMonth)
      }
    } else if ($scope.currentYear == $scope.joiningDateYear) {
      $scope.monthsData = $scope.months.splice($scope.joiningMonth, $scope.months.length)
    } else if ($scope.currentYear == $scope.lastWorkingYear) {
      $scope.monthsData = $scope.months.splice(0, $scope.lastWorkingMonth + 1)
    } else {
      $scope.monthsData = $scope.months
    }
  }
  $scope.$watch('currentYear', function(newValue, oldValue) {
    $scope.allData(newValue)
    $http({
      method: 'GET',
      url: '/api/payroll/payslip/?user=' + $scope.data.user + '&year=' + newValue
    }).
    then(function(response) {
      $scope.monthsForWhichPayslipsExist = []
      $scope.paySlips = response.data;

      for (var i = 0; i < $scope.paySlips.length; i++) {
        $scope.monthsForWhichPayslipsExist.push($scope.monthsList[$scope.paySlips[i].month - 1]);
      }

    })


    console.log($scope.joiningMonth, $scope.lastWorkingMonth);

  })

  $scope.next = function() {
    if ($scope.lastWorkingYear == $scope.currentYear) {
      return;
    } else {
      $scope.currentYear += 1;
      $scope.allData($scope.currentYear)
      $scope.attendance = false;
    }
  }

  $scope.prev = function() {
    if ($scope.joiningDateYear == $scope.currentYear) {
      return;
    } else {
      $scope.currentYear -= 1;
      $scope.allData($scope.currentYear)
      $scope.attendance = false;
    }
  }

  $http({
    method: 'GET',
    url: '/api/HR/designation/?user=' + $scope.data.user
  }).
  then(function(response) {
    console.log(response.data, '@@@@@@@@@@@@@@@@@@@');
    $scope.designation = response.data;
    for (var i = 0; i < $scope.designation.length; i++) {
      if ($scope.designation[i].user == $scope.data.user) {
        $scope.desig = $scope.designation[i];
        console.log($scope.desig);

      }
    }


  })
  $scope.totalamount = 0.0;
  $http({
    method: 'GET',
    url: '/api/payroll/payslip/?user=' + $scope.data.user,
  }).
  then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.totalamount += response.data[i].totalPayable;
    }

  })
  $scope.medicalLeave = 0;
  $scope.annualLeave = 0;
  $http({
    method: 'GET',
    url: '/api/HR/leave/?user=' + $scope.data.user,
  }).
  then(function(response) {

    for (var i = 0; i < response.data.length; i++) {
      console.log(response.data[i], 'kkkkkkkkkk');
      if ((response.data[i].category == "ML") && (response.data[i].status == "approved")) {
        $scope.medicalLeave += response.data[i].leavesCount;
      }
      if (response.data[i].category == "AL" && response.data[i].status == "approved") {
        $scope.annualLeave += response.data[i].leavesCount;
      }
    }

  })
  $scope.attendance = false;


  $scope.view = function(n) {
    $scope.monthss = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    $scope.currentMonth = n;

    function monthIndex(mon) {
      for (var i = 0; i <= $scope.monthss.length; i++) {
        if ($scope.monthss.includes(mon)) {
          return $scope.monthss.indexOf(mon) + 1;
        }
      }
    }

    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }
    $scope.presentDays = 0;
    $scope.hrs = 0;
    $scope.mins = 0;
    $scope.indexMonth = monthIndex(n);
    $scope.days = daysInMonth($scope.indexMonth, $scope.currentYear);
    console.log($scope.currentYear, $scope.indexMonth, 'mmmmmmmmmmmm');

    function interval(count) {
      return count;
    };

    $http({
      method: 'GET',
      url: '/api/performance/timeSheet/?user=' + $scope.data.user
    }).
    then(function(response) {

      for (var i = 0; i < response.data.length; i++) {
        $scope.split = response.data[i].date.split("-");
        if ($scope.split[0] == $scope.currentYear) {
          if ($scope.split[1] == $scope.indexMonth) {
            if (response.data[i].totaltime == null || typeof response.data[i].totaltime === "undefined") {

            } else {

              $scope.timedata = response.data[i].totaltime.split(':');

              $scope.mins = Number($scope.timedata[1]);
              $scope.hrs = Number($scope.timedata[0]);
              $scope.time = parseFloat($scope.hrs + '.' + $scope.mins);
              console.log($scope.time, 'nnnnnnnnnn');
              $scope.countDays = Math.floor($scope.time / 8.5);
              $scope.remainingHour = $scope.time % 8.5;
              $scope.remainingHours = $scope.remainingHour / 8.5;
              console.log($scope.remainingHours, 'oooooooo');
              $scope.presentDays += Math.floor(interval($scope.countDays) + $scope.remainingHours);
              // if($scope.time >= 8.30)
              // {
              //   $scope.presentDays++
              // }
              $scope.attendance = true;
            }

          }
        }
      }
      $scope.attendance = true;
    })
    $scope.leaveDays = 0;
    $http({
      method: 'GET',
      url: '/api/HR/leave/?user=' + $scope.data.user + '&status=approved&fromDate__year=' + $scope.currentYear + '&fromDate__month=' + $scope.indexMonth,
    }).
    then(function(response) {
      console.log(response.data);
      for (var i = 0; i < response.data.length; i++) {

        if (response.data[i].leavesCount != null && response.data[i].leavesCount != undefined) {
          $scope.leaveDays += response.data[i].leavesCount;
        }
      }


    })
  }


});

app.controller("workforceManagement.salary.payslips.info", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.today = new Date();

  $http({method : 'GET' , url : '/api/payroll/report/' + $state.params.id + '/' }).
  then(function(response) {
    $scope.data = response.data;
    $scope.edit = [];
    for (var i = 0; i < $scope.data.payslips.length; i++) {
      $scope.edit.push(false)
    }
  })


  $scope.months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobar", "November", "December"]
  $scope.pay = {}
  $scope.updateReport = function() {
    if ($scope.data.dateOfProcessing == undefined || $scope.data.dateOfProcessing == null) {
      Flash.create('danger', 'Please select Date of Processing');
      return
    } else if (typeof $scope.data.dateOfProcessing == 'object') {
      $scope.data.dateOfProcessing = $scope.data.dateOfProcessing.toJSON().split('T')[0]
    } else {
      $scope.data.dateOfProcessing = $scope.data.dateOfProcessing
    }
    if ($scope.pay.status == true) {
      $scope.status = "paid"
    } else {
      $scope.status = "final"
    }
    $http({
      method: 'PATCH',
      url: '/api/payroll/report/' + $scope.data.pk + '/',
      data: {
        dateOfProcessing: $scope.data.dateOfProcessing,
        status: $scope.status
      }
    }).
    then(function(response) {
      $scope.data = response.data;
      console.log($scope.data.payslips, '---------geettt in resp');
      var monthstr = function() {
        for (var i = 0; i < $scope.months.length; i++) {
          if (i == $scope.data.month) {
            return $scope.months[i]
          }
        }
      }
      for (var i = 0; i < $scope.data.payslips.length; i++) {
        console.log($scope.data.payslips[i], '------', i, $scope.today);
        dataToSend = {
          date: $scope.today.toJSON().split('T')[0],
          sourcePk: $scope.data.payslips[i].pk,
          source: 'Salary payslip ' + monthstr() + ' , ' + $scope.data.year,
          narration: 'Salary payslip ' + $scope.data.payslips[i].totalPayable + ' Rs  , ' + monthstr() + '-' + $scope.data.year,
          contactPerson: $scope.data.payslips[i].user.username,
          accountNumber: $scope.data.payslips[i].user.payroll.accountNumber,
          bankName: $scope.data.payslips[i].user.payroll.bankName,
          amount: $scope.data.payslips[i].totalPayable,
          ifscCode: $scope.data.payslips[i].user.payroll.ifscCode,
        }
        console.log(dataToSend, 'toooosseeennnddii');
        $http({
          method: 'POST',
          url: '/api/finance/disbursal/',
          data: dataToSend,
        }).
        then(function(response) {
          Flash.create('success', 'alossssssss dissssbbbuuuurrrssseeddd');
        })
      }
    })

  }

  $scope.sendMail = function() {

    console.log($scope.months[$scope.data.month]);

    $http({
      method: 'GET',
      url: '/api/payroll/sendPayslips/?report=' + $scope.data.pk + '&month=' + $scope.months[$scope.data.month]
    }).
    then(function() {
      Flash.create('success', 'Email sent successfully');
    })
  }

  $scope.calculate = function(amt, tds, idx) {
    $scope.data.payslips[idx].totalPayable = amt - tds
  }

  $scope.saveIndividualData = function(id, amt, td, total, idx) {
    console.log(id, '----------', td, total, amt);
    $scope.edit[idx] = false;
    var url = '/api/payroll/payslip/'
    var method = 'PATCH'
    url += id + '/'

    var toSend = {
      amount: amt,
      tds: td,
      totalPayable: total
    }
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function() {
      Flash.create('success', 'Saved');
    })


  }
  $scope.open = false;

  console.log($scope.edit);
  $scope.editIndividualData = function(idx) {
    $scope.edit[idx] = true;
  }

  $scope.approve = function(){
    $http({
      method: 'PATCH',
      url: '/api/payroll/report/' + $scope.data.pk + '/',
      data: {
        status: 'paid'
      }
    }).
    then(function(response) {
    $scope.data.status = response.data.status
    })

  }

});




app.controller("workforceManagement.salary.payroll.form16", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.years = []
  var d = new Date();
  $scope.currntYear = d.getFullYear();
  for (var i = 2017; i <= $scope.currntYear; i++) {
    $scope.years.push(i.toString())
  }

  $scope.periods = ['Quater1' , 'Quater2' , 'Quater3' , 'Quater4' ,'April-September','September-March' , 'Yearly']

  $scope.form = {
    'year' : $scope.years[$scope.years.length-1],
    'period' : $scope.periods[0],
    'user' : '',
    'file' : emptyFile
  }

  $scope.allForms = []

  $http({
    method: 'GET',
    url: '/api/HR/users/?division=&is_active=true',
  }).
  then(function(response) {
    $scope.employees = response.data;
    $scope.form.user =   $scope.employees[0]
  })


  $scope.fetchAll = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/form16/?year='+$scope.form.year+'&period='+$scope.form.period,
    }).
    then(function(response) {
      $scope.allForms = response.data

    })
  }
  $scope.fetchAll()

  $scope.editData = function(indx){
    $scope.selectedIndx = indx
    $scope.form = $scope.allForms[indx]
    console.log($scope.form);
    for (var i = 0; i < $scope.employees.length; i++) {
      if ($scope.form.user.pk == $scope.employees[i].pk) {
        $scope.form.user = $scope.employees[i]
      }
    }
  }


  $scope.uploadFile = function(){

    var fd = new FormData();
    if ($scope.form.file == emptyFile) {
        Flash.create('warning' , 'Please upload a file')
        return
    }
    fd.append('user', $scope.form.user.pk);
    fd.append('year', $scope.form.year);
    fd.append('period', $scope.form.period);
    fd.append('file', $scope.form.file);
    var method = 'POST'
    var url = '/api/payroll/form16/'
    if ( $scope.form.pk) {
      method = 'PATCH'
       url +=$scope.form.pk +'/'
    }
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
      if (!$scope.form.pk) {
        $scope.form.user = $scope.employees[0]
        $scope.form.file = emptyFile
        $scope.allForms.push(response.data)
      }else{
        $scope.allForms[$scope.selectedIndx] = response.data
        $scope.form.user = $scope.employees[0]
        $scope.form.file = emptyFile
      }
      Flash.create('success' , 'Added')
      return

    })
  }

  $scope.delete = function(indx){
    $http({
      method: 'GET',
      url: '/api/payroll/form16/'+$scope.allForms[indx].pk+'/',
    }).
    then(function(response) {
      $scope.allForms.splice(indx,1)
    })
  }


})

app.controller("workforceManagement.salary.payroll.report", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.data = []

  $scope.addedData = []
  $scope.initializeSheet = function() {
    $scope.addedData = []
    var toDelete = [];
    for (var i = 0; i < $scope.report.payslips.length; i++) {
      toDelete.push($scope.report.payslips[i].payslipID);
    }
    for (var i = 0; i < toDelete.length; i++) {
      $http({
        method: 'DELETE',
        url: '/api/payroll/payslip/' + toDelete[i] + '/'
      }).
      then(function(response) {

      })
    }
    $scope.report.pfReserved = 0.00
    $scope.report.payable = 0.00
    $scope.report.pfContribution = 0.00
    $scope.report.total = 0.00

    $http({
      method: 'GET',
      url: '/api/payroll/getAllPayroll/?year='+$scope.selectedYear+'&month='+$state.params.month
    }).then(function(response) {
      $scope.report.payslips = response.data
    })


  }


  $scope.openReportInfo = function(idx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.salary.payroll.openReportInfo.html',
      size: 'md',
      backdrop: true,
      resolve: {
        usr: function() {
          if (idx == undefined || idx == null) {
            return {};
          } else {
            return $scope.report.payslips[idx].user.pk;
          }
        }
      },
      controller: "controller.warehouse.payroll.openReportInfo",
    }).result.then(function() {

    }, function() {
      // $rootScope.$broadcast('forceRefetch' , {});
    });

  }

  $scope.deffer = function(indx) {
    $scope.report.payslips[indx].deffered = true;
    if ($scope.report.payslips[indx].payslipID != undefined) {
      $http({
        method: 'PATCH',
        url: '/api/payroll/payslip/' + $scope.report.payslips[indx].payslipID + '/',
        data: {
          deffered: true
        }
      }).
      then(function(response) {

      })
    }
  }



  $scope.calculateAll = function(){
    $scope.report.pfReserved = 0.00
    $scope.report.payable = 0.00
    $scope.report.pfContribution = 0.00
    $scope.report.total = 0.00
    for (var i = 0; i <  $scope.addedData.length; i++) {
        $scope.report.pfReserved += $scope.addedData[i].pfAmnt
        $scope.report.payable += $scope.addedData[i].totalPayable
        $scope.report.pfContribution += $scope.addedData[i].pfAdmin
        $scope.report.total += $scope.addedData[i].grandTotal
    }
  }


  $scope.calculate = function(indx){
    var amount = $scope.report.payslips[indx].hra + $scope.report.payslips[indx].special + $scope.report.payslips[indx].lta + $scope.report.payslips[indx].basic + $scope.report.payslips[indx].adHoc + $scope.report.payslips[indx].bonus
    $scope.report.payslips[indx].totalTaxable =  amount  + $scope.report.payslips[indx].reimbursement - $scope.report.payslips[indx].miscellaneous  - $scope.report.payslips[indx].pfAmnt - $scope.report.payslips[indx].deduction
    // $scope.report.payslips[indx].tds = ($scope.report.payslips[indx].totalTaxable*20)/100
    $scope.report.payslips[indx].totalPayable = $scope.report.payslips[indx].totalTaxable - $scope.report.payslips[indx].tds
    $scope.report.payslips[indx].grandTotal = $scope.report.payslips[indx].totalPayable + $scope.report.payslips[indx].pfAdmin
    // $scope.calculateAll()
  }

  $scope.saveIndividualPayslip = function(id, indx) {
    var url = '/api/payroll/payslip/'
    if (id == undefined) {
      method = 'POST';
    } else {
      method = 'PATCH';
      url += id + '/'
    }

    var toSend = {
      report: $scope.report.pk,
      month: $scope.monthNumber,
      year: $scope.selectedYear,
      amount: $scope.report.payslips[indx].amount,
      totalPayable: $scope.report.payslips[indx].totalPayable,
      reimbursement: $scope.report.payslips[indx].reimbursement,
      miscellaneous : $scope.report.payslips[indx].miscellaneous,
      grandTotal :  $scope.report.payslips[indx].grandTotal,
      days: $scope.daysInMonth,
      pfAdmin :  $scope.report.payslips[indx].pfAdmin,
      pfAmnt :  $scope.report.payslips[indx].pfAmnt,
      tds :  $scope.report.payslips[indx].tds,
    }
    if (typeof $scope.report.payslips[indx].user == 'object') {
      toSend.user = $scope.report.payslips[indx].user.pk
    }
    else{
      toSend.user = $scope.report.payslips[indx].user
    }


    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then((function(indx) {
      return function(response) {
        $scope.report.payslips[indx].payslipID = response.data.pk;
        console.log($scope.addedData, method);
        if (method == 'POST') {
          $scope.addedData.push(response.data)
        } else {
          $scope.addedData[indx] = response.data
        }
        $scope.calculateAll()
      }
    })(indx))
  }

  $scope.fetchOrCreate = function() {
    console.log($scope.monthNumber, $scope.selectedYear, '--------monnnn yyyeee');
    if ($scope.monthNumber != undefined && $scope.selectedYear != undefined) {
      console.log('ifffffffff');
      $http({
        method: 'GET',
        url: '/api/payroll/report/?month=' + $scope.monthNumber + '&year=' + $scope.selectedYear
      }).
      then(function(response) {
        // alert('did not get any previous data')
        if (response.data.length == 0) {
          $http({
            method: 'POST',
            url: '/api/payroll/report/',
            data: {
              month: $scope.monthNumber,
              year: $scope.selectedYear
            }
          }).
          then(function(response) {
            $scope.report = response.data;
            $scope.initializeSheet();
          })
        } else {
          $scope.report = response.data[0];
          for (var i = 0; i < $scope.report.payslips.length; i++) {
            $scope.report.payslips[i].payslipID = $scope.report.payslips[i].pk;
            $scope.addedData.push($scope.report.payslips[i])
          }
        }
      })
    }

  }


  $scope.save = function(status) {
    $scope.total = 0.0
    $scope.totalTDS = 0.0
    console.log($scope.addedData);
    if ($scope.addedData.length > 0) {
      $scope.calculateAll()
    } else {
      Flash.create('danger', 'Please select Employees');
      return
    }
    if (status == 'save') {
      var toSend = {
        total: Math.round($scope.total),
        totalTDS: Math.round($scope.totalTDS),
        status: 'draft'
      }
    } else if (status == 'submit') {
      var toSend = {
        total: Math.round($scope.total),
        totalTDS: Math.round($scope.totalTDS),
        status: 'final'

      }
    }
    // if (submit) {
    //   toSend.status = 'submitted';
    // }
    $http({
      method: 'PATCH',
      url: '/api/payroll/report/' + $scope.report.pk + '/',
      data: toSend
    }).
    then(function() {
      Flash.create('success', 'Saved');
    })

  }

  $scope.submit = function() {
    $scope.save(true);
  }

  // @ankita , lets use this to filter the list of month in the model window while creating a payroll report
  // $scope.$watch('selectedYear', function() {
  //   $scope.monthsInList = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobar", "November", "December"]
  //   $scope.addedData = []
  //   $scope.listMonth = []
  //   $http({
  //     method: 'GET',
  //     url: '/api/payroll/getMonth/?year=' + $scope.selectedYear
  //   }).
  //   then(function(response) {
  //     $scope.filteredmonths = response.data
  //     console.log($scope.filteredmonths);
  //     for (var i = 0; i < $scope.filteredmonths.length; i++) {
  //       $scope.listMonth.push($scope.monthsInList[$scope.filteredmonths[i]])
  //       $scope.selectedMonth = $scope.listMonth[0]
  //     }
  //   })
  // })

  $scope.monList = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobar", "November", "December"]

  $scope.selectedYear = $state.params.year;
  $scope.monthNumber = $scope.monList.indexOf($state.params.month)

  $scope.fetchOrCreate();

})




app.controller("workforceManagement.salary", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside) {


  $http({method : 'GET' , url : '/api/payroll/report/'}).
  then(function(response) {
    $scope.reports = response.data;
  })

  $scope.openPayrollReport = function(data) {
    if (data.status == 'draft') {
      $state.go('workforceManagement.payroll.draft' , {month : $scope.months[data.month] , year : data.year})
    }else{
      $state.go('workforceManagement.payroll.details' , {id : data.pk})
    }
  }


  $scope.months = [ '', "January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobar", "November", "December"]

  $scope.createPayrollReport = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/monthAndYearPicker.html',
      size: 'sm',
      backdrop: true,
      controller: function($scope, $http , $state , $uibModalInstance) {
        $scope.months = []

        $scope.year = 2021;

        $scope.$watch('year', function() {
          $scope.monthsInList = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobar", "November", "December"]
          $scope.addedData = []
          $scope.listMonth = []
          $http({
            method: 'GET',
            url: '/api/payroll/getMonth/?year=' + $scope.year
          }).
          then(function(response) {
            $scope.filteredmonths = response.data
            $scope.months = []
            // console.log($scope.filteredmonths);
            for (var i = 0; i < $scope.filteredmonths.length; i++) {
              $scope.months.push($scope.monthsInList[$scope.filteredmonths[i]])
              // $scope.selectedMonth = $scope.listMonth[0]
            }
          })
        })

        $scope.prev = function() {
          $scope.year -=1;
        }

        $scope.next = function() {
          $scope.year +=1;
        }

        $scope.create = function(month) {
          $state.go('workforceManagement.payroll.draft' , {year : $scope.year , month : month})
          $uibModalInstance.dismiss();

        }



      }
    })




  }










});
