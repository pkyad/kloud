app.config(function($stateProvider) {
  $stateProvider

    .state('workforceManagement.appStore', {
      url: "/appStore",
      template: '<div style="padding-top:30px;"><appstore-view> </appstore-view></div>',
      controller: 'controller.appStore',
    })
    .state('workforceManagement.billing', {
      url: "/billing/",
      templateUrl: '/static/ngTemplates/app.viewBilling.html',
      controller: 'controller.billing',
    })
    .state('workforceManagement.appDetails', {
      url: "/appDetails/:id",
      template: '<appdetailed-view id="$state.params.id"> </appdetailed-view>',
      controller: 'controller.appStore',
    })
    .state('workforceManagement.employees', {
      url: "/employees",
      templateUrl: '/static/ngTemplates/app.HR.manage.users.html',
      controller: 'admin.manageUsers',
    })
    .state('workforceManagement.employees.new', {
      url: "/new",
      templateUrl: '/static/ngTemplates/app.HR.form.newUser.html',
      controller: 'admin.manageUsers.form'
    })

    .state('workforceManagement.Attendance', {
      url: "/Attendance",
      templateUrl: '/static/ngTemplates/app.employees.Attendance.html',
      controller: 'workforceManagement.employees.Attendance'
    })
    .state('workforceManagement.employees.joining', {
      url: "/joining",
      templateUrl: '/static/ngTemplates/app.recruitment.onboarding.html',
      controller: 'workforceManagement.recruitment.onboarding',
    })
    .state('workforceManagement.employees.exit', {
      url: "/exit",
      templateUrl: '/static/ngTemplates/app.employees.exitManagement.html',
      controller: 'workforceManagement.exitManagement',
    })
    .state('workforceManagement.employees.oldEmployees', {
      url: "/oldEmployees",
      templateUrl: '/static/ngTemplates/app.employees.oldEmployees.html',
      controller: 'admin.oldEmployees'
    })
    .state('workforceManagement.profile', {
      url: "/profile/:id",
      templateUrl: '/static/ngTemplates/app.HR.editPayrollDesignationMasterForms.html',
      controller: 'sudo.manageUsers.profile'
    })


    .state('workforceManagement.employees.team', {
      url: "/team",
      templateUrl: '/static/ngTemplates/app.HR.manage.team.html',
      controller: 'workforceManagement.employees.teams'
    })


});

app.controller('controller.billing', function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $aside) {
  $scope.me= $users.get('mySelf')
  $scope.date =  new Date()
  $scope.currentYear = $scope.date.getFullYear()
  $scope.startYear = 2015;
  $scope.years = []
  while ($scope.startYear <= $scope.currentYear) {
    $scope.years.push($scope.startYear++);
  }

  $scope.monthList =   ['January' , 'february' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'Octember' , 'November' , 'December' ]

  $scope.select = {
    year : $scope.currentYear,
    month : $scope.monthList[$scope.date.getMonth()]
  }


  function random_rgba() {
    var o = Math.round,
    r = Math.random,
    s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
  }
  $scope.getBillingData = function(){
    $http({
      method: 'GET',
      url: '/api/ERP/getBilling/?year='+$scope.select.year+'&month='+$scope.select.month,
    }).
    then(function(response) {
      $scope.allBilledItems = response.data
      $scope.doughnutAmount = []
      $scope.doughnutLabels = []
      $scope.doughnutColors = []
      $scope.amount =0
      for (var i = 0; i < $scope.allBilledItems.obj.length; i++) {
          if (i <=3 ) {
            $scope.doughnutAmount.push($scope.allBilledItems.obj[i].amount)
            $scope.doughnutLabels.push($scope.allBilledItems.obj[i].title)
            $scope.doughnutColors.push(random_rgba())

          }else {
            $scope.amount += $scope.allBilledItems.obj[i].amount
          }

      }
      $scope.doughnutLabels.splice(4,0,'Others')
      $scope.doughnutAmount.splice(4,0,$scope.amount)
      $scope.doughnutColors.splice(4,0,'red')
      $scope.graphs()
    })
  }
  $scope.getBillingData()
  clr= random_rgba()



  $scope.graphs = function(){
    new Chart(document.getElementById("Billing-doughnut"), {
    type: 'doughnut',
    data: {
      labels:   $scope.doughnutLabels,
      datasets: [{
        backgroundColor: $scope.doughnutColors,
        borderColor: "#ccc",
        borderWidth: 1,
        data: $scope.doughnutAmount,
      }],
    },
    options: {
      cutoutPercentage: 65,
      legend: {
        display: true
      },
      title: {

        display: true,
        text: '',

      },
      elements: {
        center: {
          text: '61%',
        }
      }

    },
  });

  }
  console.log($scope.doughnutAmount,$scope.doughnutLabels,'324');






})
app.controller('controller.appStore', function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $aside) {
  $scope.appDetails = function(pkVal){
    if ($state.is('workforceManagement.appStore')) {
      $state.go('workforceManagement.appDetails', {id : pkVal})
    }else{
      window.open('/appdetails/?id='+pkVal,'_blank')
    }
  }





})
app.controller('workforceManagement.employees.teams', function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $aside) {
  $scope.searchForm = {
    searchValue:''
  }
  $scope.limit = 15
  $scope.offset = 0
  $scope.teamSearch = function() {
    var url = '/api/HR/teamAll/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.searchForm.searchValue.length>0) {
      url +=  '&title__icontains='+$scope.searchForm.searchValue
    }
    $http.get(url).
    then(function(response) {
      $scope.allTeams =  response.data.results;
      $scope.resPrev = response.data.previous
      $scope.resNext = response.data.next
    })
  };
  $scope.teamSearch()

  $scope.previous = function() {
    if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.teamSearch()
    }
  }

  $scope.next = function() {
    if ($scope.resNext != null) {
      $scope.offset += $scope.limit
      $scope.teamSearch()
    }
  }

  $scope.userSearch = function(query) {
    //search for the user
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

$scope.remove = function(member){
  var data = {
    user : member.pk,
    typ:'remove'
  }
  $http({
    method: 'POST',
    url: '/api/HR/addTeamMember/',
    data:data
  }).
  then(function(response) {
    Flash.create('success' , 'Removed')
    $scope.teamSearch()
  })
}
$scope.add = function(indx,user){
  var data = {
    user : user.pk,
    team : $scope.allTeams[indx].pk,
  }
  $http({
    method: 'POST',
    url: '/api/HR/addTeamMember/',
    data:data
  }).
  then(function(response) {
    $scope.allTeams[indx].members.push(response.data)
    $scope.allTeams[indx].selectedMember = ''
  })
}

$scope.openCreateTeam = function(indx) {
  if (indx!=undefined){
    var data = $scope.allTeams[indx]
  }
  else{
    var data = ''
  }
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.HR.form.createTeam.html',
    size: 'md',
    backdrop: true,
    resolve : {
      data : function() {
        return data
      },
    },
    controller: function($scope, $uibModalInstance, data) {
      console.log(data);

      $scope.simpleMode = SIMPLE_MODE
      $scope.Reporting = function(query) {
        return $http.get('/api/HR/userSearch/?username__contains=' + query).
        then(function(response) {
          console.log('@', response.data)
          return response.data;
        })
      };
      $scope.unitSearch = function() {
        $http.get('/api/organization/unit/').
        then(function(response) {
          $scope.units =  response.data;
          if ($scope.form.unit) {
            for (var i = 0; i < $scope.units.length; i++) {
              if ($scope.units[i].pk == $scope.form.unit || $scope.units[i].pk == $scope.form.unit.pk ) {
                $scope.form.unit = $scope.units[i]
              }
            }
          }
        })
      };


      $scope.form = {
        title:'',
        manager: '',
        unit:'',
        isOnSupport:false
      }
      if (data.pk) {
        $scope.form = data
      }
      $scope.unitSearch()
      $scope.saveTeam = function() {

        console.log("ssssssssssssssssssssssss");

        if ($scope.form.title == null || $scope.form.title.length == 0) {
          Flash.create('warning','Add title')
          return
        }

        if ($scope.form.manager == null || typeof $scope.form.manager!='object') {
          Flash.create('warning','Select Manager')
          return
        }

        var Method = 'POST';
        var Url = '/api/HR/team/';
        if ($scope.form.pk) {
          var Method = 'PATCH';
          var Url = '/api/HR/team/'+$scope.form.pk+'/';
        }
        var toSend = {
          title: $scope.form.title,
          manager: $scope.form.manager.pk,
          isOnSupport:$scope.form.isOnSupport
        }
        if ($scope.form.unit!= null && typeof $scope.form.unit == 'object') {
          toSend.unit =  $scope.form.unit.pk

        }
        $http({
          method: Method,
          url: Url,
          data: toSend,
        }).
        then(function(response) {
          $uibModalInstance.dismiss(response.data);
          $scope.form.team = response.data.title;
          Flash.create('success', 'Saved Team SuccessFully');
        })
      }
    }
  }).result.then(function(f) {

  }, function(f) {
    // if (typeof f == 'object') {
    //   $scope.form.team = f
    // }
    $scope.teamSearch()
  });
}

})



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
  app.controller("admin.oldEmployees", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
    $scope.today = new Date()
    $scope.employees = [];
    $scope.search = {
      searchValue : ''
    }
    $scope.getEmployees = function(){
    var url = '/api/HR/exitManagement/?is_exited=true&limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.search.searchValue.length>0) {
      url+='&search='+$scope.search.searchValue
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.employees = response.data.results;
      $scope.resPrev = response.data.previous
      $scope.resNext = response.data.next
    })
  };
  $scope.getEmployees()

  $scope.previous = function() {
    if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.getEmployees()
    }
  }

  $scope.next = function() {
    if ($scope.resNext != null) {
      $scope.offset += $scope.limit
      $scope.getEmployees()
    }
  }

})


app.controller("workforceManagement.exitManagement", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.today = new Date()
  $scope.employees = [];
  $scope.search = {
    searchValue : ''
  }
  $scope.getEmployees = function(){
  var url = '/api/HR/exitManagement/?is_exited=false&limit=' + $scope.limit + '&offset=' + $scope.offset
  if ($scope.search.searchValue.length>0) {
    url+='&search='+$scope.search.searchValue
  }
  $http({
    method: 'GET',
    url: url
  }).
  then(function(response) {
    $scope.employees = response.data.results;
    $scope.resPrev = response.data.previous
    $scope.resNext = response.data.next
  })
};
$scope.getEmployees()

$scope.previous = function() {
  if ($scope.resPrev != null) {
    $scope.offset -= $scope.limit
    $scope.getEmployees()
  }
}

$scope.next = function() {
  if ($scope.resNext != null) {
    $scope.offset += $scope.limit
    $scope.getEmployees()
  }
}
  $scope.selectEmp = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.employees.exitManagement.userSelect.html',
      size: 'sm',
      backdrop: true,
      controller: function($scope, $uibModalInstance) {
        $scope.userSearch = function(query) {
          return $http.get('/api/HR/users/?is_active=true&limit=10&division=&first_name__icontains=' + query).
          then(function(response) {
            return response.data.results;
          })
        }
        $scope.getName = function(u) {
          if (u != undefined && u.first_name != undefined) {
            return u.first_name + '  ' + u.last_name;
          }
        }

        $scope.form = {
          user : '',
          lastWorkingDate : new Date()
        }

        $scope.save = function() {
          if ($scope.form.user == null ) {
            Flash.create('warning' , 'Select Employee')
            return
          }

          var dataToSend = {
            user: $scope.form.user.pk,
            lastWorkingDate : dateToString($scope.form.lastWorkingDate)
          }
          $http({
            method: 'POST',
            url: '/api/HR/exitManagement/',
            data: dataToSend,
          }).
          then(function(response) {
            $uibModalInstance.dismiss(response.data);
          }, function(error) {
            Flash.create('danger', 'Employee Already Added');
          })
        }
      },
    }).result.then(function(f) {

    }, function(f) {
      if (typeof f == 'object') {
        $scope.employees.push(f);
      }
    });
  }
  $scope.form = {
    security: $scope.employees.security,
    it: $scope.employees.it,
    hr: $scope.employees.hr,
    finance: $scope.employees.finance,
  }
  var f = $scope.form;
  $scope.deboard = function(idx, pk) {
    var dataToSend = {
      security: f.security,
      it: f.it,
      hr: f.hr,
      finance: f.finance,
    }
    if (f.security == true) {
      dataToSend.securityApprovedDate = $scope.today;
      console.log('in seccccccccc');
    }
    if (f.it == true) {
      dataToSend.itApprovedDate = $scope.today;
      console.log('in ittttttttttt');
    }
    if (f.hr == true) {
      dataToSend.hrApprovedDate = $scope.today;
      console.log('in hrrrrrrr');
    }
    if (f.finance == true) {
      dataToSend.financeApprovedDate = $scope.today;
      console.log('in finnnnnnaaa');
    }
    $http({
      method: 'PATCH',
      url: '/api/HR/exitManagement/' + pk + '/',
      data: dataToSend,
    }).
    then(function(response) {
      $scope.data = response.data;
      $scope.employees[idx] = $scope.data;
      if ($scope.data.security == true && $scope.data.it == true && $scope.data.hr == true && $scope.data.finance == true) {
        var dataToSend = {
          is_staff: false,
          is_active: false,
        }
        $http({
          method: 'PATCH',
          url: '/api/HR/users/' + $scope.employees[idx].user.pk + '/',
          data: dataToSend,
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
          $scope.employees[idx].user = response.data;
          var toSend = {
            lastWorkingDate: $scope.today.toJSON().split('T')[0],
            deboarded: true,
          }
          $http({
            method: 'PATCH',
            url: '/api/payroll/payroll/' + $scope.employees[idx].user.payroll.pk + '/',
            data: toSend,
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $scope.employees[idx].user.payroll.lastWorkingDate = response.data.lastWorkingDate
          })
        })
      }
      Flash.create('success', 'Saved');
    })
  }

  $scope.remove = function(idx, pk){
    console.log('removiingggggg',idx, pk);
      $http({
        method: 'DELETE',
        url: '/api/HR/exitManagement/' + pk + '/',
      }).
      then((function(idx) {
        return function(response) {
          $scope.employees.splice(idx , 1);
        }
      })(idx))
  }

  $scope.selectedFile = function(typ, indx){
    $scope.fileType = typ
    $scope.indx = indx
  }



  $scope.fileupload = function(file){
    $scope.file = file[0]
    var fd = new FormData()

    console.log($scope.file, $scope.fileType, $scope.indx );
    if ($scope.fileType == 'resignation') {
      fd.append('resignation', $scope.file);
    }
    else if ($scope.fileType == 'finalSettlement') {
      fd.append('finalSettlment', $scope.file);
    }
    else  if ($scope.fileType == 'notice') {
      fd.append('notice', $scope.file);
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/exitManagement/'+$scope.employees[$scope.indx].pk+'/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.employees[$scope.indx] = response.data
      Flash.create('success', "Uploaded")
    })
  }

  $scope.exitEmployee = function(indx){
    $http({
      method: 'PATCH',
      url: '/api/HR/exitManagement/'+$scope.employees[indx].pk+'/',
      data: {
      is_exited : true
      },
    }).
    then(function(response) {
      if (response.data.is_exited == true) {
          $scope.employees.splice(indx,1)
          Flash.create('success', "Uploaded")
      }
    })

  }

});



app.controller("workforceManagement.employees", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $http({
    method: 'GET',
    url: '/api/recruitment/dashboardRecruit/',
  }).
  then(function(response) {
    $scope.recruitData = response.data;
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
  $http({
    method: 'GET',
    url: '/api/HR/profile/',
  }).
  then(function(response) {
    $scope.employees = response.data.length;
    var maleCount = []
    var femaleCount = []
    response.data.forEach(function(item) {
      if (item.gender == "M") {
        maleCount.push(item.gender)
      } else {
        femaleCount.push(item.gender)
      }
    })
    new Chart(document.getElementById("downtime-doughnut-chart"), {
      type: 'pie',
      data: {
        labels: ['Total', 'Male', 'Female'],
        datasets: [{
          label: "",
          backgroundColor: ["#ee535b", "#f8ac25", "#3cba9f"],
          data: [$scope.employees, maleCount.length, femaleCount.length]
        }]
      },
      options: {
        title: {
          display: true,
          text: 'HeadCount'
        },
        legend: {
          position: 'bottom',
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

    new Chart(document.getElementById("sales-bar-chart"), {
      type: 'bar',
      data: {
        labels: resultKey(countObj),
        datasets: [{
          backgroundColor: "#3E95CD",
          strokeColor: "brown",
          label: "Employees",
          data: resultValue(countObj)
        }]
      },
      options: {

        legend: {
          display: true,
          position: 'bottom',

        },
        title: {
          display: true,
          text: "Count By Department"
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
              display: true,
              beginAtZero: true,
              callback: function(value) {
                if (value % 1 === 0) {
                  return value;
                }
              }
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
  });

  $http.get('api/payroll/payslip/').
  then(function(response) {
    var filterEmp = function(arr,minrange,maxrange) {
      var array = []
       var count = 0
      arr.reverse().forEach(function(item) {
        if (!array.includes(item.user.pk)) {
          array.push(item.user.pk)
          if (item.totalPayable >= minrange && item.totalPayable <= maxrange) {
            count++
          }
        }
      })
     return count
    }
    console.log();
    new Chart(document.getElementById("headcount-chart-horizontal"), {
      type: 'bar',
      data: {
        labels: ["< 15k","15k-20k", "20k-25k", "25k-30k","> 30k"],
        datasets: [{
          label: "No of Employees",
          backgroundColor: "#3CBA9F",
          data: [filterEmp(response.data,0,14999),filterEmp(response.data,15000,19999), filterEmp(response.data,20000,24999), filterEmp(response.data,25000,29999),filterEmp(response.data,30001,200000)]
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'No of Employees by Monthly Salary '
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
              display: true,
              beginAtZero: true,
              callback: function(value) {
                if (value % 1 === 0) {
                  return value;
                }
              }
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
  });


    $http({
      method: 'GET',
      url: '/api/performance/feedback/'
    }).
    then(function(response) {
      $scope.feedsDash = response.data.length
      console.log($scope.feedsDash,'feeeeeeeeeee');
    })

    $http({
      method: 'GET',
      url: '/api/employees/complaints/?status=resolved'
    }).
    then(function(response) {
      $scope.complaintsDash = response.data.length
      console.log($scope.complaintsDash,'comppppppppppp');
    })

    $http({
      method: 'GET',
      url: '/api/HR/appraisal/'
    }).
    then(function(response) {
      $scope.appraisalDash = response.data.length
      console.log($scope.appraisalDash,'appppprrrrr');
    })

    $scope.me = $users.get('mySelf');
    $http({
      method: 'GET',
      url: '/api/performance/feedback/'
    }).
    then(function(response) {
      $scope.feeds = response.data
    })

    $http({
      method: 'GET',
      url: '/api/employees/complaints/'
    }).
    then(function(response) {
      $scope.complaints = response.data
    })


    $scope.limit = 6;
    $scope.climit = 8
    $scope.hideit = false;
    $scope.hidecbtn = false;
    $scope.loadMore = function(lim, typ) {
      console.log('loooooooooooo', lim, $scope.feeds.length, typ);
      if (typ == 'feed') {
        if (lim == $scope.feeds.length) {
          $scope.hideit = true;
        }
        $scope.increamented = $scope.limit + 4;
        $scope.limit = $scope.increamented > $scope.feeds.length ? $scope.feeds.length : $scope.increamented;
      } else {
        if (lim == $scope.complaints.length) {
          $scope.hidecbtn = true;
        }
        $scope.increamented = $scope.climit + 4;
        $scope.climit = $scope.increamented > $scope.complaints.length ? $scope.complaints.length : $scope.increamented;
      }

    };

    $scope.resolve = function(pk) {
      var toSend = {
        status: 'resolved'
      }
      $http({
        method: 'PATCH',
        url: '/api/employees/complaints/' + pk + '/',
        data: toSend,
      }).
      then(function(response) {
      })
    }







});


app.controller('admin.manageUsers.form', function($scope, $http, Flash, $uibModal,$rootScope, $state) {
  $scope.simpleMode = SIMPLE_MODE
  $scope.reload = function(){
    $scope.form = {
      username : '',
      first_name : '',
      last_name : '',
      email : '',
      password:'',
      unit : '',
      department:'',
      role:'',
      reportingTo:'',
      mobile:''
    }
  }
  $scope.reload()
  $scope.Reporting = function() {
    $http.get('/api/HR/users/?is_active=true&division=').
    then(function(response) {
      $scope.reportingToUsers =  response.data;
    })
  };
  $scope.Reporting()

  $scope.unitSearch = function() {
    $http.get('/api/organization/unit/?icansee=').
    then(function(response) {
      $scope.units =  response.data;
      if ($scope.simpleMode&&response.data.length>0) {
        $scope.form.unit = response.data[0]
      }
    })
  };
  $scope.unitSearch()
  // console.log($scope.simpleMode,'aaaaaaaaaaaaaa');
  // if ($scope.simpleMode) {
  //   $http.get('/api/organization/unit/').
  //   then(function(response) {
  //     if ($scope.form.unit.length>0) {
  //       $scope.form.unit =  response.data[0];
  //     }
  //     else{
  //       $scope.form.unit =  ''
  //     }
  //     // $scope.form.unit = response.data[0]
  //   })
  // }

  $scope.depSearch = function(query) {
   $http.get('/api/organization/departments/').
    then(function(response) {
      $scope.departments =  response.data;
    })
  };
  $scope.depSearch()

  $scope.roleSearch = function(query) {
    $http.get('/api/organization/role/').
    then(function(response) {
      $scope.roles = response.data;
    })
  };
  $scope.roleSearch()

  $scope.ReportingAll = function() {
    return $http.get('/api/HR/users/?first_name__icontains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };


  $scope.unitAllSearch = function() {
    return $http.get('/api/organization/unit/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };


  $scope.depAllSearch = function(query) {
    return $http.get('/api/organization/departments/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };


  $scope.roleAllSearch = function(query) {
    return $http.get('/api/organization/role/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

  $scope.viewProfile = false

  $scope.save = function(){
    // if ($scope.form.username == '' || $scope.form.username.length == 0) {
    //   Flash.create('warning' , 'Username is required')
    //   return
    // }

    if ($scope.form.first_name == '' || $scope.form.first_name.length == 0) {
      Flash.create('warning' , 'First Name is required')
      return
    }
    if ($scope.form.email == '' || $scope.form.email.length == 0) {
      Flash.create('warning' , 'Email is required')
      return
    }
    if ($scope.form.mobile == '' || $scope.form.mobile.length == 0) {
      Flash.create('warning' , 'Mobile is required')
      return
    }

    if (/^\d+$/.test($scope.form.mobile)) {
      }
      else {
        Flash.create('warning' , 'Invalid Mobile Number')
        return
      }


    var dataToSend = {
      'username' : $scope.form.mobile,
      'first_name' : $scope.form.first_name,
      'email' : $scope.form.email,
      'mobile' : $scope.form.mobile
    }

    if ($scope.form.last_name!=null && $scope.form.last_name.length>0) {
      dataToSend.last_name = $scope.form.last_name
    }
    if (typeof $scope.form.unit == 'object') {
      dataToSend.unit = $scope.form.unit.pk
    }

    if (typeof $scope.form.department == 'object') {
      dataToSend.department = $scope.form.department.pk
    }
    if (typeof $scope.form.role == 'object') {
      dataToSend.role = $scope.form.role.pk
    }
    if (typeof $scope.form.reportingTo == 'object') {
      dataToSend.reportingTo = $scope.form.reportingTo.pk
    }


    $http({
      method: 'POST',
      url: '/api/HR/userCreate/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success' , 'Saved')
      $scope.userPk = response.data.pk
      $scope.viewProfile = true
      // $scope.reload()
    }, function(err) {
      if (err.data.username) {
        Flash.create('warning' , err.data.username[0])
        return
      }
    })

  }

})

app.controller('admin.manageUsers.mailAccount', function($scope, $http, Flash, $uibModal,$rootScope, $state) {

  // console.log($rootScope.user,'99090jkhjkh');
  // $scope.userPk = $scope.$parent.$parent.data.pk;
  $scope.userPk = $state.params.id
  $scope.form = {
    email: '',
    passKey: '',
    user: $scope.userPk,
    displayName: '',
    signature: ''
  }
  $scope.save = function() {
    $http({
      method: 'POST',
      url: '/api/mail/account/',
      data: $scope.form
    }).
    then(function(response) {
      $scope.accounts.push(response.data);
      $scope.form = {
        email: '',
        passKey: '',
        user: $scope.userPk,
        displayName: '',
        signature: ''
      }
    });
  }

  $http({
    method: 'GET',
    url: '/api/mail/account/?user=' + $scope.userPk
  }).
  then(function(response) {
    $scope.accounts = response.data;
  })

  $scope.remove = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/mail/account/' + $scope.accounts[indx].pk + '/'
    }).
    then(function(response) {
      Flash.create('success', 'Removed');
    })
    $scope.accounts.splice(indx, 1)
  }
// saveBtn publishBtn cancelBtn |
  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 250,
    menubar : false,
    statusbar : false,
    // skin: "oxide-dark",
    toolbar: ' undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link | style-p style-h1 style-h2 style-h3 | addImage',
    setup: function(editor) {

      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name) {
        editor.addButton("style-" + name, {
          tooltip: "Toggle " + name,
          text: name.toUpperCase(),
          onClick: function() {
            editor.execCommand('mceToggleFormat', false, name);
          },
          onPostRender: function() {
            var self = this,
              setup = function() {
                editor.formatter.formatChanged(name, function(state) {
                  self.active(state);
                });
              };
            editor.formatter ? setup() : editor.on('init', setup);
          }
        })
      });

      editor.addButton('addImage', {
        text: 'Add Image',
        icon: false,
        onclick: function(evt) {
          console.log(editor);
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.blog.modal.html',
            size: 'sm',
            backdrop: true,
            controller: function($scope, $http, $uibModalInstance) {
              $scope.form = {
                file: emptyFile,
                alt: ''
              }

              $scope.add = function() {
                var fd = new FormData();
                fd.append('file', $scope.form.file);
                $http({
                  method: 'POST',
                  url: '/api/PIM/saveImage/',
                  data: fd,
                  transformRequest: angular.identity,
                  headers: {
                    'Content-Type': undefined
                  }
                }).
                then(function(response) {
                  console.log(response.data);

                  $uibModalInstance.dismiss({
                    file: response.data.link,
                    alt: $scope.form.alt,
                    height: response.data.height,
                    width: response.data.width
                  })
                })
              }
            },
          }).result.then(function() {

          }, function(d) {
            editor.editorCommands.execCommand('mceInsertContent', false, '<br><img alt="' + d.alt + '" height="' + d.height + '" width="' + d.width + '" src="' + d.file + '"/>')

          });



        }
      })

      editor.addButton('publishBtn', {
        text: 'Publish',
        icon: false,
        onclick: function() {
          var tags = [];
          for (var i = 0; i < $scope.editor.tags.length; i++) {
            tags.push($scope.editor.tags[i].pk)
          }

          console.log($scope.editor);

          var fd = new FormData();

          fd.append('source', $scope.editor.source);
          fd.append('header', $scope.editor.header);
          fd.append('title', $scope.editor.title);
          fd.append('users', [$scope.me.pk]);
          fd.append('sourceFormat', 'html');
          fd.append('state', 'published');
          fd.append('tags', tags);

          if ($scope.editor.ogimage == emptyFile && ($scope.editor.ogimageUrl == '' || $scope.editor.ogimageUrl == undefined)) {
            Flash.create('danger', 'Either the OG image file OR og image url is required')
            return;
          }

          if ($scope.editor.ogimage != emptyFile && typeof $scope.editor.ogimage != 'string' && $scope.editor.ogimage != null) {
            fd.append('ogimage', $scope.editor.ogimage);

          } else {
            fd.append('ogimageUrl', $scope.editor.ogimageUrl);
          }

          // 'shortUrl', 'description', 'tags','section' , 'author'
          if ($scope.editor.shortUrl == '' || $scope.editor.tagsCSV == '' || $scope.editor.section == '' || $scope.editor.author == '') {
            Flash.create('danger', 'Please check the SEO related fields');
            return;
          }

          fd.append('shortUrl', $scope.editor.shortUrl);
          fd.append('tagsCSV', $scope.editor.tagsCSV);
          fd.append('section', $scope.editor.section);
          fd.append('author', $scope.editor.author);
          fd.append('description', $scope.editor.description);

          if ($scope.mode == 'edit') {
            method = 'PATCH';
            url = '/api/PIM/blog/' + $stateParams.id + '/';
          } else if ($scope.mode == 'new') {
            method = 'POST';
            url = '/api/PIM/blog/';
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
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.editor.source = '';
            $scope.editor.header = '';
            $scope.editor.title = '';
            $scope.editor.tags = [];
            $scope.editor.mode = 'hedaer';
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });
        }
      });
      editor.addButton('saveBtn', {
        text: 'Save',
        icon: false,
        onclick: function() {
          tags = '';
          for (var i = 0; i < $scope.editor.tags.length; i++) {
            tags += $scope.editor.tags[i].title;
            if (i != $scope.editor.tags.length - 1) {
              tags += ',';
            }
          }
          var dataToSend = {
            source: $scope.editor.source,
            header: $scope.editor.header,
            title: $scope.editor.title,
            users: [$scope.me.pk],
            sourceFormat: 'html',
            state: 'saved',
            tags: tags,
          };

          if ($scope.mode == 'edit') {
            method = 'PATCH';
            url = $scope.editor.url;
          } else if ($scope.mode == 'new') {
            method = 'POST';
            url = '/api/PIM/blog/';
          }

          $http({
            method: method,
            url: url,
            data: dataToSend
          }).
          then(function(response) {
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.editor.source = '';
            $scope.editor.header = '';
            $scope.editor.title = '';
            $scope.editor.tags = [];
            $scope.editor.mode = 'hedaer';
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });
        }
      });
      editor.addButton('cancelBtn', {
        text: 'Cancel',
        icon: false,
        onclick: function() {
          if ($scope.mode == 'edit') {
            $state.go('home.blog', {
              action: 'list'
            })
          } else {
            $state.go('home.blog', {
              id: '',
              action: 'list'
            })
          }

        }
      });
    },
  };


});

app.controller('sudo.manageUsers.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout,$rootScope) {

  $scope.data = $scope.tab.data;
  console.log($scope.data);
  $scope.payroll =  $scope.tab.data.payroll
  $scope.designation =  $scope.tab.data.designation

  // console.log('aaaaaaaaaaaaaaaaaaaaaa', $scope.data.pk);
  $http({
    method: 'GET',
    url: '/api/HR/profileAdminMode/' + $scope.data.profile.pk
  }).
  then(function(response) {
    $scope.profile = response.data;
  })
  // console.log('((((((((((((((()))))))))))))))', $scope.data.userPK);
  // $http({
  //   method: 'GET',
  //   url: '/api/HR/designation/?user=' + $scope.data.userPK
  // }).
  // then(function(response) {
  //   console.log(response.data, '&&&&&&&&&&&&&&&&&&&&&&&7');
  //   $scope.designation = response.data[0];
  //   console.log($scope.designation);
  //
  //
  //   if (typeof $scope.designation.division == 'number') {
  //     $http({
  //       method: 'GET',
  //       url: '/api/organization/divisions/' + $scope.designation.division + '/'
  //     }).
  //     then(function(response) {
  //       $scope.designation.division = response.data;
  //     })
  //   }
  //
  //   if (typeof $scope.designation.unit == 'number') {
  //     $http({
  //       method: 'GET',
  //       url: '/api/organization/unit/' + $scope.designation.unit + '/'
  //     }).
  //     then(function(response) {
  //       $scope.designation.unit = response.data;
  //     })
  //
  //   }
  //
  // })

});

app.controller('sudo.manageUsers.profile', function($scope, $http, Flash, $users,$rootScope,$uibModal, $state, $aside) {
  $scope.simpleMode = SIMPLE_MODE
  $scope.toggleActive = function() {

  }

  $scope.remove = function(installedApp, indx) {
    $http({method : 'DELETE' , url : '/api/HR/appInstaller/' ,params : { app :  installedApp.pk }}).
    then((function(indx){
      return function(response) {
        Flash.create('success' , 'App uninstalled');
        $scope.form.apps.splice(indx, 1);
      }
    })(indx))
  }

  $scope.addApplication = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.addApplication.modal.html',
      size: 'lg',
      backdrop: true,
      resolve : {
        designation : function() {
          return $scope.form.designation
        }
      },
      controller:function($scope,$uibModalInstance, $rootScope, designation, $http, Flash){
        $scope.designation = designation;
        $scope.form = {
          app : null
        }
        $scope.appSearch = function(query) {
          return $http.get('/api/HR/appInstaller/?search=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.save = function() {
          $http({method : 'POST' , url : '/api/HR/appInstaller/' ,data : {designation : $scope.designation.pk , app :  $scope.form.app.pk }}).then(function(response) {
            $scope.form.app = null;
            Flash.create('success' , 'App installed');
          })
        }
      }
    }).result.then(function() {
    }, function() {
      $scope.init();
    });
  }


  $scope.form = {payroll:'',designation:'',profile:'',basic:'',master:'', simpleMode : true, enablePayroll : false, telephony : false}

  $scope.getRoles = function(){
    $http({
      method: 'GET',
      url: '/api/organization/role/'})
    .then(function(response) {
      $scope.roleList = response.data
    })
  }

  $scope.getRoles()
  $scope.getReportingList = function(){
    $http({
      method: 'GET',
      url: '/api/HR/users/?is_active=true&division='})
    .then(function(response) {
      $scope.reportingList = response.data
    })
  }

  $scope.getReportingList()

  $scope.getUnits = function(){
    $http({
      method: 'GET',
      url: '/api/organization/unit/?icansee='})
    .then(function(response) {
      $scope.unitList = response.data
    })
  }

  $scope.getUnits()

  $scope.unitSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/unit/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };
  $scope.init = function() {
    $http({
      method: 'GET',
      url: '/api/HR/updatePayrollDesignationMasterAcc/?id=' + $state.params.id
    }).
    then(function(response) {
      $scope.form = response.data.master;
      $scope.form.payroll = response.data.payroll;
      $scope.form.designation = response.data.designation;
      $scope.form.profile = response.data.profile;
      $scope.form.basic = response.data.basic;
      $scope.form.apps = response.data.apps;
      $scope.form.simpleMode = response.data.simpleMode;
      $scope.form.telephony = response.data.telephony;
      $scope.form.canChangeStaffStatus = response.data.canChangeStaffStatus;
      if ($scope.form.payroll.ctc) {
        $scope.form.ctc = $scope.form.payroll.ctc
      }
      $scope.checkCTC();
      console.log($scope.form,'$scope.form.designation.role');
    })
  }

  $scope.checkCTC = function() {
    if ($scope.form.ctc>250000) {
      $scope.form.enablePayroll = true;
      // $scope.form.payroll.ctc = 0;
    }
  }

  $scope.calculateCTCBreakup = function() {
    $scope.form.payroll.hra = 0.4 * $scope.form.ctc;
    $scope.form.payroll.pTax = 2400;
    $scope.form.payroll.basic = 0.1* $scope.form.ctc;
    $scope.form.payroll.bonus = 0.1* $scope.form.ctc;
    $scope.form.payroll.adHoc = 0.2* $scope.form.ctc;
    $scope.form.payroll.pfAmnt = 0.015* $scope.form.ctc;
    $scope.form.payroll.pfAdmin = 0.015* $scope.form.ctc;
    $scope.form.payroll.special = 0.1*$scope.form.ctc
    $scope.form.payroll.lta = 0.1* $scope.form.ctc;
    $scope.calculateCTC();
  }

  $scope.calculateCTC = function() {
      $scope.form.payroll.ctc = parseInt($scope.form.payroll.pfAmnt) + parseInt($scope.form.payroll.pfAdmin) + parseInt($scope.form.payroll.pTax) +parseInt( $scope.form.payroll.adHoc )+ parseInt($scope.form.payroll.bonus) + parseInt($scope.form.payroll.basic) + parseInt($scope.form.payroll.hra) + parseInt($scope.form.payroll.lta) +parseInt($scope.form.payroll.special)  ;
  }

  $scope.sendWelcomeKit = function() {
    $http({
      method: 'GET',
      url: '/api/HR/sendWelcomeKit/?user='+$scope.form.pk

    }).then(function(response) {
      console.log(response , 'send welcome kit');
      Flash.create(`${response.data.messageType}`, `${response.data.message}`)
    })
  }

  $scope.init();

  $scope.goto = function(val){
    document.getElementById(val).scrollIntoView({block: 'start', behavior: 'smooth'});
    $scope.selected = val
  }

  $scope.selected = 'basic'


  $scope.depSearch = function(query) {
    // console.log('************',query);
    return $http.get('/api/organization/departments/?name__contains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

  $scope.openItDeclaration = function(){
     $aside.open({
        templateUrl: '/static/ngTemplates/app.home.itDeclaration.html',
        placement: 'right',
        backdrop : true,
        size: 'xxl',
        // resolve: {
        //   services: function() {
        //     return $scope.vendorDetails.services
        //   }
        // },
        controller:'controller.home.itDeclaration',
      })
      .result.then(function(pk) {}, function() {})
  }


  // $scope.form = $scope.tab.data;
  // $scope.form = $rootScope.user;
  // $scope.form.desgination = $rootScope.user.designation;
  // console.log($scope.form,"0-00ilkjklgf");
  // if (typeof $scope.form.desgination.reportingTo == 'number') {
  //   $scope.form.desgination.reportingTo = $users.get($scope.form.desgination.reportingTo);
  // }
  //
  // if (typeof $scope.form.desgination.hrApprover == 'number') {
  //   $scope.form.desgination.hrApprover = $users.get($scope.form.desgination.hrApprover);
  // }
  //
  // if (typeof $scope.form.desgination.secondaryApprover == 'number') {
  //   $scope.form.desgination.secondaryApprover = $users.get($scope.form.desgination.secondaryApprover);
  // }
  //
  // if (typeof $scope.form.desgination.primaryApprover == 'number') {
  //   $scope.form.desgination.primaryApprover = $users.get($scope.form.desgination.primaryApprover);
  // }


  // if (typeof $scope.form.desgination.unit == 'number') {
  //   $http({
  //     method: 'GET',
  //     url: '/api/organization/unit/' + $scope.form.desgination.unit + '/'
  //   }).
  //   then(function(response) {
  //     $scope.form.desgination.unit = response.data;
  //   })
  // }

  // if (typeof $scope.form.desgination.department == 'number') {
  //   $http({
  //     method: 'GET',
  //     url: '/api/organization/departments/' + $scope.form.desgination.department + '/'
  //   }).
  //   then(function(response) {
  //     $scope.form.desgination.department = response.data;
  //   })
  // }



  $scope.responsibilitySearch = function(query) {
    return $http.get('/api/organization/responsibility/?title__contains=' + query).
    then(function(response) {
      return response.data;
    })
  }







  $scope.Reporting = function(query) {
    return $http.get('/api/HR/users/?first_name__icontains=' + query).
    then(function(response) {
      console.log('@', response.data)
      return response.data;
    })
  };

  $scope.me = $users.get('mySelf');

  $scope.teamSearch = function(query) {
    return $http.get('/api/HR/team/?title__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.openCreateTeam = function() {
    console.log("herrrrrrrrrrrrrrr");
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.form.createTeam.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.form.designation.team;
        }
      },
      controller: function($scope, data, $uibModalInstance) {
        $scope.Reporting = function(query) {
          return $http.get('/api/HR/users/?username__contains=' + query).
          then(function(response) {
            console.log('@', response.data)
            return response.data;
          })
        };
        if (data.pk) {
          $scope.form = {
            team: data.title,
            manager: data.manager,
          }
        } else {
          $scope.form = {
            team: data,
            manager: '',
          }
        }

        console.log(data);
        $scope.saveTeam = function() {
          if (data.pk) {
            console.log(data.pk);
            var Method = 'PATCH';
            var Url = '/api/HR/team/' + data.pk + '/';
          } else {
            var Method = 'POST';
            var Url = '/api/HR/team/';
          }
          var toSend = {
            title: $scope.form.team,
            manager: $scope.form.manager.pk,
          }
          $http({
            method: Method,
            url: Url,
            data: toSend,
          }).
          then(function(response) {
            $uibModalInstance.dismiss(response.data);
            $scope.form.team = response.data.title;
            Flash.create('success', 'Saved Team SuccessFully');
          })
        }
      }
    }).result.then(function(f) {

    }, function(f) {
      if (typeof f == 'object') {
        $scope.form.team = f
      }
    });
  }


  // $scope.form =$rootScope.user;

  $scope.updateUser = function() {
    var f = $scope.form;

    if (f.basic.sameAsLocal == true) {
      f.basic.permanentAddressStreet = f.basic.localAddressStreet
      f.basic.permanentAddressCity = f.basic.localAddressCity
      f.basic.permanentAddressPin = f.basic.localAddressPin
      f.basic.permanentAddressState = f.basic.localAddressState
      f.basic.permanentAddressCountry = f.basic.localAddressCountry
    }

    dataToSend = {
      // user: f.pk,
      payroll:{
        pk:f.payroll.pk,
        hra: f.payroll.hra,
        special: f.payroll.special,
        lta: f.payroll.lta,
        basic: f.payroll.basic,
        taxSlab: f.payroll.taxSlab,
        adHoc: f.payroll.adHoc,
        policyNumber: f.payroll.policyNumber,
        provider: f.payroll.provider,
        amount: f.payroll.amount,
        noticePeriodRecovery: f.payroll.noticePeriodRecovery,
        notice: f.payroll.notice,
        probation: f.payroll.probation,
        probationNotice: f.payroll.probationNotice,
        al: f.payroll.al,
        ml: f.payroll.ml,
        adHocLeaves: f.payroll.adHocLeaves,
        off: f.payroll.off,
        accountNumber: f.payroll.accountNumber,
        ifscCode: f.payroll.ifscCode,
        bankName: f.payroll.bankName,
        deboarded: f.payroll.deboarded,
        PFUan: f.payroll.PFUan,
        pan: f.payroll.pan,
        pfAccNo: f.payroll.pfAccNo,
        pfUniNo: f.payroll.pfUniNo,
        pfAmnt: f.payroll.pfAmnt,
        esic: f.payroll.esic,
        esicAmount: f.payroll.esicAmount,
        pTax: f.payroll.pTax,
        bonus: f.payroll.bonus,
        pfAdmin: f.payroll.pfAdmin,
        esicAdmin: f.payroll.esicAdmin,
        ctc:f.payroll.ctc,
        activatePayroll:f.payroll.activatePayroll,
      },
      basic:{
        pk: f.basic.pk,
        empID: f.basic.empID,
        empType: f.basic.empType,
        prefix: f.basic.prefix,
        gender: f.basic.gender,
        permanentAddressStreet: f.basic.permanentAddressStreet,
        permanentAddressCity: f.basic.permanentAddressCity,
        permanentAddressPin: f.basic.permanentAddressPin,
        permanentAddressState: f.basic.permanentAddressState,
        permanentAddressCountry: f.basic.permanentAddressCountry,
        sameAsLocal: f.basic.sameAsLocal,
        localAddressStreet: f.basic.localAddressStreet,
        localAddressCity: f.basic.localAddressCity,
        localAddressPin: f.basic.localAddressPin,
        localAddressState: f.basic.localAddressState,
        localAddressCountry: f.basic.localAddressCountry,
        emergency: f.basic.emergencyName + '::' + f.emergencyNumber,
        bloodGroup: f.basic.bloodGroup,
        website: f.basic.website,
        almaMater: f.basic.almaMater,
        pgUniversity: f.basic.pgUniversity,
        docUniversity: f.basic.docUniversity,
        fathersName: f.basic.fathersName,
        mothersName: f.basic.mothersName,
        wifesName: f.basic.wifesName,
        childCSV: f.basic.childCSV,
        note1: f.basic.note1,
        note2: f.basic.note2,
        note3: f.basic.note3,
        job_type : f.basic.job_type,
        mobile : f.basic.mobile
      },
      master:{

      },
      designation:{

      }


    }

    if (f.basic.married) {
      dataToSend.basic.married = f.married;
      // dataToSend.anivarsary = prof.anivarsary.toJSON().split('T')[0]
      if (typeof f.basic.anivarsary == 'object') {
        dataToSend.basic.anivarsary = f.basic.anivarsary.toJSON().split('T')[0]
      } else {
        dataToSend.basic.anivarsary = f.basic.anivarsary
      }
    }
    // if (f.basic.dateOfBirth!=null && f.basic.mobile.length>0) {
    //   dataToSend.basic.mobile = f.basic.mobile
    // }

    if (f.basic.email.length>0) {
      dataToSend.basic.email = f.basic.email
    }

    if (f.basic.dateOfBirth!=null && typeof f.basic.dateOfBirth == 'object') {
      dataToSend.basic.dateOfBirth = f.basic.dateOfBirth.toJSON().split('T')[0]
    } else {
      dataToSend.basic.dateOfBirth = f.basic.dateOfBirth
    }

    if (f.payroll.joiningDate != null && typeof f.payroll.joiningDate == 'object') {
      dataToSend.payroll.joiningDate = f.payroll.joiningDate.toJSON().split('T')[0]
    }


    if (f.payroll.lastWorkingDate != null && typeof f.payroll.lastWorkingDate == 'object') {
      dataToSend.payroll.lastWorkingDate = f.payroll.lastWorkingDate.toJSON().split('T')[0]
    }
    if (f.designation.reportingTo != null && typeof f.designation.reportingTo == 'object') {
      dataToSend.designation.reportingTo = f.designation.reportingTo.pk
    }
    if (f.designation.hrApprover != null && typeof f.designation.hrApprover == 'object') {
      dataToSend.designation.hrApprover = f.designation.hrApprover.pk
    }
    if (f.designation.primaryApprover != null && typeof f.designation.primaryApprover == 'object') {
      dataToSend.designation.primaryApprover = f.designation.primaryApprover.pk
    }
    if (f.designation.secondaryApprover != null && typeof f.designation.secondaryApprover == 'object') {
      dataToSend.designation.secondaryApprover = f.designation.secondaryApprover.pk
    }
    if (f.designation.division != null && typeof f.designation.division == 'object') {
      dataToSend.designation.division = f.designation.division.pk
    }
    if (f.designation.unit != null && typeof f.designation.unit == 'object') {
      dataToSend.designation.unit = f.designation.unit.pk
    }
    if (f.designation.department != null && typeof f.designation.department == 'object') {
      dataToSend.designation.department = f.designation.department.pk
    }
    if (f.designation.role != null && typeof f.designation.role == 'object') {
      dataToSend.designation.role = f.designation.role.pk
    }
    if (f.designation.reportingTo != null && typeof f.designation.reportingTo == 'object') {
      dataToSend.designation.reportingTo = f.designation.reportingTo.pk
    }
    if (f.designation.team != null && typeof f.designation.team == 'object') {
      dataToSend.designation.team = f.designation.team.pk
    }
    dataToSend.designation.pk = f.designation.pk
    // if (f.team != null && typeof f.team == 'object') {
    // }
    dataToSend.master.username = $scope.form.username
    dataToSend.master.first_name = $scope.form.first_name
    dataToSend.master.last_name = $scope.form.last_name
    dataToSend.master.email = $scope.form.email
    dataToSend.master.is_active = $scope.form.is_active
    dataToSend.master.is_staff = $scope.form.is_staff
    if ($scope.form.password!=undefined && $scope.form.password.length>0) {
      dataToSend.master.password = $scope.form.password
    }
    dataToSend.master.pk = $state.params.id

    $http({
      method: 'POST',
      url: '/api/HR/updatePayrollDesignationMasterAcc/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(err) {

    })



    var fd = new FormData();
    fd.append('pk', f.basic.pk)
    if (f.basic.displayPicture != emptyFile && typeof f.basic.displayPicture != 'string' && f.basic.displayPicture != null) {
      fd.append('displayPicture', f.basic.displayPicture);
    }
    if (f.basic.TNCandBond != emptyFile && typeof f.basic.TNCandBond != 'string' && f.basic.TNCandBond != null) {
      fd.append('TNCandBond', f.basic.TNCandBond);
    }
    if (f.basic.resume != emptyFile && typeof f.basic.resume != 'string' && f.basic.resume != null) {
      fd.append('resume', f.basic.resume);
    }
    if (f.basic.certificates != emptyFile && typeof f.basic.certificates != 'string' && f.basic.certificates != null) {
      fd.append('certificates', f.basic.certificates);
    }
    if (f.basic.transcripts != emptyFile && typeof f.basic.transcripts != 'string' && f.basic.transcripts != null) {
      fd.append('transcripts', f.basic.transcripts);
    }
    if (f.basic.otherDocs != emptyFile && typeof f.basic.otherDocs != 'string' && f.basic.otherDocs != null) {
      fd.append('otherDocs', f.basic.otherDocs);
    }
    if (f.basic.IDPhoto != emptyFile && typeof f.basic.IDPhoto != 'string' && f.basic.IDPhoto != null) {
      fd.append('IDPhoto', f.basic.IDPhoto);
    }
    if (f.basic.resignation != emptyFile && typeof f.basic.resignation != null) {
      fd.append('resignation', f.basic.resignation);
    }
    if (f.basic.vehicleRegistration != emptyFile && typeof f.basic.vehicleRegistration != null) {
      fd.append('vehicleRegistration', f.basic.vehicleRegistration);
    }
    if (f.basic.appointmentAcceptance != emptyFile && typeof f.basic.appointmentAcceptance != null) {
      fd.append('appointmentAcceptance', f.basic.appointmentAcceptance);
    }
    if (f.basic.pan != emptyFile && typeof f.basic.pan != null) {
      fd.append('pan', f.basic.pan);
    }
    if (f.basic.drivingLicense != emptyFile && typeof f.basic.drivingLicense != null) {
      fd.append('drivingLicense', f.basic.drivingLicense);
    }
    if (f.basic.cheque != emptyFile && typeof f.basic.cheque != null) {
      fd.append('cheque', f.basic.cheque);
    }
    if (f.basic.passbook != emptyFile && typeof f.basic.passbook != null) {
      fd.append('passbook', f.basic.passbook);
    }
    $http({
      method: 'POST',
      url: '/api/HR/updatePayrollDesignationMasterAcc/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {

      // $scope.data.pk=response.data.pk

      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(err) {

    })
  }




});

// app.controller('sudo.manageUsers.editDesignation', function($scope, $http, Flash, $users, $uibModal,$rootScope) {
//   // $scope.user = $users.get($scope.tab.data.user);
//
//   $scope.divisionSearch = function(query) {
//     return $http.get('/api/organization/divisions/?name__contains=' + query).
//     then(function(response) {
//       console.log('@', response.data);
//       return response.data;
//     })
//   };
//
//   $scope.unitSearch = function(query) {
//     // console.log('************',query);
//     return $http.get('/api/organization/unit/?name__contains=' + query).
//     then(function(response) {
//       console.log('@', response.data)
//       return response.data;
//     })
//   };
//
//   $scope.depSearch = function(query) {
//     // console.log('************',query);
//     return $http.get('/api/organization/departments/?name__contains=' + query).
//     then(function(response) {
//       console.log('@', response.data)
//       return response.data;
//     })
//   };
//
//   $scope.roleSearch = function(query) {
//     // console.log('************',query);
//     return $http.get('/api/organization/role/?name__contains=' + query).
//     then(function(response) {
//       console.log('@', response.data)
//       return response.data;
//     })
//   };
//
//   // $scope.form = $scope.tab.data;
//   $scope.form = $rootScope.user.designation;
//
//   if (typeof $scope.form.reportingTo == 'number') {
//     $scope.form.reportingTo = $users.get($scope.form.reportingTo);
//   }
//
//   if (typeof $scope.form.hrApprover == 'number') {
//     $scope.form.hrApprover = $users.get($scope.form.hrApprover);
//   }
//
//   if (typeof $scope.form.secondaryApprover == 'number') {
//     $scope.form.secondaryApprover = $users.get($scope.form.secondaryApprover);
//   }
//
//   if (typeof $scope.form.primaryApprover == 'number') {
//     $scope.form.primaryApprover = $users.get($scope.form.primaryApprover);
//   }
//   if (typeof $scope.form.division == 'number') {
//     $http({
//       method: 'GET',
//       url: '/api/organization/divisions/' + $scope.form.division + '/'
//     }).
//     then(function(response) {
//       $scope.form.division = response.data;
//     })
//   }
//
//   if (typeof $scope.form.unit == 'number') {
//     $http({
//       method: 'GET',
//       url: '/api/organization/unit/' + $scope.form.unit + '/'
//     }).
//     then(function(response) {
//       $scope.form.unit = response.data;
//     })
//   }
//
//   if (typeof $scope.form.department == 'number') {
//     $http({
//       method: 'GET',
//       url: '/api/organization/departments/' + $scope.form.department + '/'
//     }).
//     then(function(response) {
//       $scope.form.department = response.data;
//     })
//   }
//
//   if (typeof $scope.form.role == 'number') {
//     $http({
//       method: 'GET',
//       url: '/api/organization/role/' + $scope.form.role + '/'
//     }).
//     then(function(response) {
//       $scope.form.role = response.data;
//     })
//   }
//
//
//
//
//   $rootScope.tab = $scope.tab.data
//   console.log('pppppppppppppppppppp', $scope.tab.data);
//   $scope.save = function() {
//     console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
//     // make patch request
//     var f = $scope.form;
//     console.log(f);
//     dataToSend = {
//       // user: f.pk,
//       // reportingTo: f.reportingTo.pk,
//       // primaryApprover: f.primaryApprover.pk,
//       // secondaryApprover: f.secondaryApprover.pk,
//       // division: f.division.pk,
//       // unit: f.unit.pk,
//       // department: f.department.pk,
//       // role: f.role.pk
//
//     }
//     if (f.reportingTo != null && typeof f.reportingTo == 'object') {
//       dataToSend.reportingTo = f.reportingTo.pk
//     }
//     if (f.hrApprover != null && typeof f.hrApprover == 'object') {
//       dataToSend.hrApprover = f.hrApprover.pk
//     }
//     if (f.primaryApprover != null && typeof f.primaryApprover == 'object') {
//       dataToSend.primaryApprover = f.primaryApprover.pk
//     }
//     if (f.secondaryApprover != null && typeof f.secondaryApprover == 'object') {
//       dataToSend.secondaryApprover = f.secondaryApprover.pk
//     }
//     if (f.division != null && typeof f.division == 'object') {
//       dataToSend.division = f.division.pk
//     }
//     if (f.unit != null && typeof f.unit == 'object') {
//       dataToSend.unit = f.unit.pk
//     }
//     if (f.department != null && typeof f.department == 'object') {
//       dataToSend.department = f.department.pk
//     }
//     if (f.role != null && typeof f.role == 'object') {
//       dataToSend.role = f.role.pk
//     }
//     if (f.team != null && typeof f.team == 'object') {
//       dataToSend.team = f.team.pk
//     }
//     console.log(dataToSend);
//     $http({
//       method: 'PATCH',
//       url: '/api/HR/designation/' + f.pk + '/',
//       data: dataToSend
//     }).
//     then(function(response) {
//
//       // $scope.form.pk = response.data.pk;
//       Flash.create('success', response.status + ' : ' + response.statusText);
//     }, function(err) {})
//   }
//
//
//
//
//
//
//   $scope.responsibilitySearch = function(query) {
//     return $http.get('/api/organization/responsibility/?title__contains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   }
//
//
//
//
//
//
//
//
//
//   $scope.me = $users.get('mySelf');
//
//   $scope.teamSearch = function(query) {
//     return $http.get('/api/HR/team/?title__icontains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.openCreateTeam = function() {
//     $uibModal.open({
//       templateUrl: '/static/ngTemplates/app.HR.form.createTeam.html',
//       size: 'md',
//       backdrop: true,
//       resolve: {
//         data: function() {
//           return $scope.form.team;
//         }
//       },
//       controller: function($scope, data, $uibModalInstance) {
//         $scope.Reporting = function(query) {
//           return $http.get('/api/HR/users/?username__contains=' + query).
//           then(function(response) {
//             console.log('@', response.data)
//             return response.data;
//           })
//         };
//         if (data.pk) {
//           $scope.form = {
//             team: data.title,
//             manager: data.manager,
//           }
//         } else {
//           $scope.form = {
//             team: data,
//             manager: '',
//           }
//         }
//
//         console.log(data);
//         $scope.saveTeam = function() {
//           if (data.pk) {
//             console.log(data.pk);
//             var Method = 'PATCH';
//             var Url = '/api/HR/team/' + data.pk + '/';
//           } else {
//             var Method = 'POST';
//             var Url = '/api/HR/team/';
//           }
//           var toSend = {
//             title: $scope.form.team,
//             manager: $scope.form.manager.pk,
//           }
//           $http({
//             method: Method,
//             url: Url,
//             data: toSend,
//           }).
//           then(function(response) {
//             $uibModalInstance.dismiss(response.data);
//             $scope.form.team = response.data.title;
//             Flash.create('success', 'Saved Team SuccessFully');
//           })
//         }
//       }
//     }).result.then(function(f) {
//
//     }, function(f) {
//       if (typeof f == 'object') {
//         $scope.form.team = f
//       }
//     });
//   }
//
//
//
// });



app.controller('sudo.admin.editProfile', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout,$rootScope) {

  $scope.page = 1;
  $scope.maxPage = 3;
  console.log($scope.tab);
  console.log($rootScope.profilePk ,'Prijj')
  $http({
    method:'GET',
    url:'/api/HR/profileAdminMode/'+$rootScope.profilePk+'/'
  }).then(function(response){
    $scope.data = response.data;

  })
  if ($scope.data.emergency != null) {
    $scope.data.emergencyName = $scope.data.emergency.split('::')[0]
    $scope.data.emergencyNumber = $scope.data.emergency.split('::')[1]
  }
  $scope.next = function() {
    console.log("came to next");
    if ($scope.page < $scope.maxPage) {
      $scope.page += 1;
    }
  }

  $scope.prev = function() {
    if ($scope.page > 1) {
      $scope.page -= 1;
    }
  }

  $scope.saveFirstPage = function() {
    var prof = $scope.data;
    console.log($scope.data);


    if (prof.sameAsLocal == true) {
      prof.permanentAddressStreet = prof.localAddressStreet
      prof.permanentAddressCity = prof.localAddressCity
      prof.permanentAddressPin = prof.localAddressPin
      prof.permanentAddressState = prof.localAddressState
      prof.permanentAddressCountry = prof.localAddressCountry
    }

    var dataToSend = {
      empID: prof.empID,
      empType: prof.empType,
      prefix: prof.prefix,
      // dateOfBirth: prof.dateOfBirth.toJSON().split('T')[0],

      gender: prof.gender,
      permanentAddressStreet: prof.permanentAddressStreet,
      permanentAddressCity: prof.permanentAddressCity,
      permanentAddressPin: prof.permanentAddressPin,
      permanentAddressState: prof.permanentAddressState,
      permanentAddressCountry: prof.permanentAddressCountry,
      sameAsLocal: prof.sameAsLocal,
      // sameAsShipping: prof.sameAsShipping,
      localAddressStreet: prof.localAddressStreet,
      localAddressCity: prof.localAddressCity,
      localAddressPin: prof.localAddressPin,
      localAddressState: prof.localAddressState,
      localAddressCountry: prof.localAddressCountry,
      emergency: prof.emergencyName + '::' + prof.emergencyNumber,
      bloodGroup: prof.bloodGroup,
    }
    if (prof.married) {
      dataToSend.married = prof.married;
      // dataToSend.anivarsary = prof.anivarsary.toJSON().split('T')[0]
      if (typeof prof.anivarsary == 'object') {
        dataToSend.anivarsary = prof.anivarsary.toJSON().split('T')[0]
      } else {
        dataToSend.anivarsary = prof.anivarsary
      }
    }
    if (prof.mobile.length>0) {
      dataToSend.mobile = prof.mobile
    }

    if (prof.email.length>0) {
      dataToSend.email = prof.email
    }

    if (prof.dateOfBirth!=null && typeof prof.dateOfBirth == 'object') {
      dataToSend.dateOfBirth = prof.dateOfBirth.toJSON().split('T')[0]
    } else {
      dataToSend.dateOfBirth = prof.dateOfBirth
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + prof.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', "Saved");
    })
  }

  $scope.saveSecondPage = function() {


    var f = $scope.data;
    var dataToSend = {
      website: f.website,
      almaMater: f.almaMater,
      pgUniversity: f.pgUniversity,
      docUniversity: f.docUniversity,
      fathersName: f.fathersName,
      mothersName: f.mothersName,
      wifesName: f.wifesName,
      childCSV: f.childCSV,
      note1: f.note1,
      note2: f.note2,
      note3: f.note3,
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + f.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', "Saved");
    })

  }

  $scope.files = {
    "displayPicture": emptyFile,
    'TNCandBond': emptyFile,
    'resume': emptyFile,
    'certificates': emptyFile,
    'transcripts': emptyFile,
    'otherDocs': emptyFile,
    'resignation': emptyFile,
    'vehicleRegistration': emptyFile,
    'appointmentAcceptance': emptyFile,
    'pan': emptyFile,
    'drivingLicense': emptyFile,
    'cheque': emptyFile,
    'passbook': emptyFile,
    'sign': emptyFile,
    'IDPhoto': emptyFile

  }

  $scope.saveFiles = function() {
    var f = $scope.files;
    var fd = new FormData();

    var fileFields = ['displayPicture', 'TNCandBond', 'resume', 'certificates', 'transcripts', 'otherDocs', 'resignation', 'vehicleRegistration', 'appointmentAcceptance', 'pan', 'drivingLicense', 'cheque', 'passbook', 'sign', 'IDPhoto']
    for (var i = 0; i < fileFields.length; i++) {
      if ($scope.files[fileFields[i]] != emptyFile) {
        fd.append(fileFields[i], $scope.files[fileFields[i]])
      }
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + $scope.data.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      console.log(response);
      Flash.create('success', "Saved");

    })
  }

  $scope.save = function() {
    if ($scope.page == 1) {
      $scope.saveFirstPage();
    } else if ($scope.page == 2) {
      $scope.saveSecondPage();
    } else {
      $scope.saveFiles();
    }
  }

});




app.controller('admin.manageUsers', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal, $rootScope) {

  $scope.openPasskey = function(pk) {
    console.log(pk);


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.passkey.create.html',
      size: 'lg',
      resolve: {
        pk: function() {
          return pk
        },
      },
      controller: function($scope, $http, pk, Flash, $uibModalInstance) {
        $scope.hideGen = true
        $scope.generateMailPasskey = function(typ) {
          url = '/api/HR/passkey/?profile=' + pk
          if (typ == 'generate') {
            url = url+'&generate='
          }
          $http({
            method: 'GET',
            url:url,
          }).
          then(function(response) {
            $scope.data = response.data;
          });
        }
        $scope.copyPassKey = function() {
          var copyElement = document.createElement("textarea");
          copyElement.style.position = 'fixed';
          copyElement.style.opacity = '0';
          copyElement.textContent = $scope.data.siteAddress + '/tlogin//?token=' + $scope.data.passkey;
          var body = document.getElementsByTagName('body')[0];
          body.appendChild(copyElement);
          copyElement.select();
          document.execCommand('copy');
          body.removeChild(copyElement);
          alert("Copied to clipboard, open in ingognito window ");
        }
        $scope.generateMailPasskey('get')
      }
    })
  }


  $scope.allDivisions = function() {
    $http({
      method: 'GET',
      url: '/api/organization/divisions/'

    }).then(function(response) {
      $scope.divisionData = response.data;

      if (response.data.length == 1) {
        $scope.divisionForm.chooseDivision = response.data[0]
        $scope.allmanageUsers()
      }
      // $scope.divisionForm.chooseDivision = $scope.divisionData[0]
    })
  }
  $scope.allDivisions()


  $scope.divisionForm = {
    chooseDivision: '',
    searchValue: ''
  }

  $scope.limit = 15
  $scope.offset = 0
  $scope.allmanageUsers = function() {
    var url = '/api/HR/users/?limit=' + $scope.limit + '&offset=' + $scope.offset+'&division='
    if ($scope.divisionForm.chooseDivision.pk != undefined) {
      url +=  '&designation__division=' + $scope.divisionForm.chooseDivision.pk
      if ($scope.divisionForm.searchValue.length > 0) {
        url +=  '&first_name__icontains=' + $scope.divisionForm.searchValue
      }
    }else {
      if ($scope.divisionForm.searchValue.length > 0) {
        url +='&first_name__icontains=' + $scope.divisionForm.searchValue
      }

    }
    if ($state.is('workforceManagement.oldEmployees')) {
        url +='&is_active=false'
    }
    if ($state.is('workforceManagement.employees')) {
      url +='&is_active=true'
    }


    $http({
      method: 'GET',
      url: url

    }).then(function(response) {
      $scope.allUsers = response.data.results
      $scope.resPrev = response.data.previous
      $scope.resNext = response.data.next
    })

  }

  $scope.allmanageUsers()

  $scope.previous = function() {
    if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.allmanageUsers()
    }
  }

  $scope.next = function() {
    if ($scope.resNext != null) {
      $scope.offset += $scope.limit
      $scope.allmanageUsers()
    }
  }


 $scope.profileChanged = function(user, type) {
   console.log("sssssssssssss");
   var fd = new FormData();
   if (type == 'isDashboard'){
     fd.append("isDashboard", user.profile.isDashboard)
   }
   if (type == 'isManager'){
     fd.append("isManager", user.profile.isManager)
   }

   $http({
     method: 'PATCH',
     url: '/api/HR/profileAdminMode/' + user.profile.pk + '/',
     data: fd,
     transformRequest: angular.identity,
     headers: {
       'Content-Type': undefined
     }
   }).
   then(function(response) {
     console.log(response.data , 'profile data');
   });
 }



  $scope.uploadFiles = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.users.bulkUpload.html',
      size: 'sm',
      backdrop: true,
      controller: function($scope, $uibModalInstance, $rootScope) {

        $http({
          method: 'GET',
          url: '/api/organization/divisions/'
        }).
        then(function(response) {
          $scope.divisions = response.data;
          $scope.form.division = $scope.divisions[0].pk + ''
        })
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }
        $scope.form = {
          'exFile': emptyFile,
          'division': ''
        }
        $scope.uploading = false
        $scope.postFile = function() {
          var toSend = new FormData()
          toSend.append('exFile', $scope.form.exFile);
          toSend.append('division', $scope.form.division);
          $scope.uploading = true
          $http({
            method: 'POST',
            url: '/api/HR/usersBulkUpload/',
            data: toSend,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            $scope.uploading = false
            Flash.create('success', response.data.count + ' users added!')
            $scope.form = {
              'exFile': emptyFile,
            }
            $uibModalInstance.dismiss()
          }, function(err) {
            Flash.create('danger', 'Error while uploading file');
            $scope.uploading = false
          })
        }
      },
    }).result.then(function() {}, function() {
      $rootScope.$broadcast('forceRefetch', {});
    });

  }

  $scope.downloadUserProfile = function(user){
    window.open('/api/employees/downloadUserProfile/?user='+user.pk)
  }




  // create new user
  $scope.newUser = {
    username: '',
    firstName: '',
    lastName: '',
    password: ''
  };
  $scope.createUser = function() {
    dataToSend = {
      username: $scope.newUser.username,
      first_name: $scope.newUser.firstName,
      last_name: $scope.newUser.lastName,
      password: $scope.newUser.password
    };
    $http({
      method: 'POST',
      url: '/api/HR/usersAdminMode/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.newUser = {
        username: '',
        firstName: '',
        lastName: '',
        password: ''
      };
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }


  $scope.tableAction = function(target, action, mode) {
    // target is the url of the object
    if (typeof mode == 'undefined') {
      if (action == 'im') {
        $scope.$parent.$parent.addIMWindow(target);
      } else if (action == 'editProfile') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/').
            success((function(target) {
              return function(response) {
                u = $users.get(target)
                console.log("will add tab profile : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit Profile for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editProfile',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);
              }
            })(target));
          }
        }

      } else if (action == 'social') {
        $state.go('home.social', {
          id: target
        })
      } else if (action == 'editMaster') {
        console.log(target);
        $http({
          method: 'GET',
          url: '/api/HR/usersAdminMode/' + target + '/'
        }).
        then(function(response) {
          userData = response.data;
          $scope.addTab({
            title: 'Edit master data  for ' + userData.first_name + ' ' + userData.last_name,
            cancel: true,
            app: 'editMaster',
            data: userData,
            active: true
          })

        })
      } else if (action == 'editPermissions') {
        u = $users.get(target)
        $http.get('/api/ERP/application/?user=' + u.username).
        success((function(target) {
          return function(data) {
            u = $users.get(target)
            permissionsFormData = {
              appsToAdd: data,
              url: target,
            }
            $scope.addTab({
              title: 'Edit permissions for ' + u.first_name + ' ' + u.last_name,
              cancel: true,
              app: 'editPermissions',
              data: permissionsFormData,
              active: true
            })
          }
        })(target));
      } else if (action == 'viewProfile') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/').
            success((function(target) {
              return function(response) {
                response.userPK = target;
                u = $users.get(target)
                console.log("will add tab profile : ");
                console.log(response);
                $scope.addTab({
                  title: 'Profile for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'viewProfile',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);
              }
            })(target));
          }
        }
      } else if (action == 'editDesignation') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/HR/designation/' + $scope.data.tableData[i].designation + '/').
            success((function(target) {
              return function(response) {
                response.userPK = target;
                // console.log(target);
                u = $users.get(target)
                console.log("will add tab profile : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit Designation for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editDesignation',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);
              }
            })(target));
          }
        }
      } else if (action == 'editPayroll') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == target) {
            u = $users.get(target)
            $http.get('/api/payroll/payroll/' + $scope.data.tableData[i].payroll.pk + '/').
            success((function(target) {
              return function(response) {
                u = $users.get(target)
                console.log("will add tab payroll : ");
                console.log(response);
                $scope.addTab({
                  title: 'Edit payroll for ' + u.first_name + ' ' + u.last_name,
                  cancel: true,
                  app: 'editPayroll',
                  data: response,
                  active: true
                })

                console.log($scope.tabs);

              }
            })(target));
          }
        }
      }
      // for the single select actions
    } else {
      if (mode == 'multi') {
        if (action == 'Upload') {
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.HR.users.bulkUpload.html',
            size: 'sm',
            backdrop: true,
            controller: function($scope, $uibModalInstance, $rootScope) {

              $http({
                method: 'GET',
                url: '/api/organization/divisions/'
              }).
              then(function(response) {
                $scope.divisions = response.data;
                $scope.form.division = $scope.divisions[0].pk + ''
              })
              $scope.close = function() {
                $uibModalInstance.dismiss()
              }
              $scope.form = {
                'exFile': emptyFile,
                'division': ''
              }
              $scope.uploading = false
              $scope.postFile = function() {
                var toSend = new FormData()
                toSend.append('exFile', $scope.form.exFile);
                toSend.append('division', $scope.form.division);
                $scope.uploading = true
                $http({
                  method: 'POST',
                  url: '/api/HR/usersBulkUpload/',
                  data: toSend,
                  transformRequest: angular.identity,
                  headers: {
                    'Content-Type': undefined
                  }
                }).
                then(function(response) {
                  $scope.uploading = false
                  Flash.create('success', response.data.count + ' users added!')
                  $scope.form = {
                    'exFile': emptyFile,
                  }
                  $uibModalInstance.dismiss()
                }, function(err) {
                  Flash.create('danger', 'Error while uploading file');
                  $scope.uploading = false
                })
              }
            },
          }).result.then(function() {}, function() {
            $rootScope.$broadcast('forceRefetch', {});
          });
        }
      }
    }
  }

  $scope.updateUserPermissions = function(index) {
    var userData = $scope.tabs[index].data;
    if (userData.appsToAdd.length == 0) {
      Flash.create('warning', 'No new permission to add')
      return;
    }
    var apps = [];
    for (var i = 0; i < userData.appsToAdd.length; i++) {
      apps.push(userData.appsToAdd[i].pk)
    }
    var dataToSend = {
      user: getPK(userData.url),
      apps: apps,
    }
    $http({
      method: 'POST',
      url: '/api/ERP/permission/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })

  }

  $scope.getPermissionSuggestions = function(query) {
    return $http.get('/api/ERP/application/?name__contains=' + query)
  }

  $scope.updateProfile = function(index) {
    userData = $scope.tabs[index].data;
    var fd = new FormData();
    for (key in userData) {
      if (key != 'url' && userData[key] != null) {
        if ($scope.profileFormStructure[key].type.indexOf('integer') != -1) {
          if (userData[key] != null) {
            fd.append(key, parseInt(userData[key]));
          }
        } else if ($scope.profileFormStructure[key].type.indexOf('date') != -1) {
          if (userData[key] != null) {
            fd.append(key, $filter('date')(userData[key], "yyyy-MM-dd"));
          }
        } else if ($scope.profileFormStructure[key].type.indexOf('url') != -1 && (userData[key] == null || userData[key] == '')) {
          // fd.append( key , 'http://localhost');
        } else {
          fd.append(key, userData[key]);
        }
      }
    }
    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + userData.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  };


  $scope.updateUserMasterDetails = function(index) {
    var userData = $scope.tabs[index].data;
    console.log($scope.tabs[index]);
    dataToSend = {
      username: userData.username,
      last_name: userData.last_name,
      first_name: userData.first_name,
      is_staff: userData.is_staff,
      is_active: userData.is_active,
      email: userData.email,
    }
    if (userData.password != '') {
      dataToSend.password = userData.password
    }
    $http({
      method: 'PATCH',
      // url: userData.url.replace('users', 'usersAdminMode'),
      url: '/api/HR/usersAdminMode/'+userData.pk+'/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }

  $scope.Reporting = function(query) {
    return $http.get('/api/HR/users/?first_name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };


  $scope.openPasskey = function(pk) {
    console.log(pk);


    url = '/api/HR/passkey/?profile=' + pk + '&generate='
    $http({
      method: 'GET',
      url:url,
    }).
    then(function(response) {
      $scope.data = response.data;
      var copyElement = document.createElement("textarea");
      copyElement.style.position = 'fixed';
      copyElement.style.opacity = '0';
      copyElement.textContent = $scope.data.siteAddress + '/tlogin//?token=' + $scope.data.passkey;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copyElement);
      copyElement.select();
      document.execCommand('copy');
      body.removeChild(copyElement);


      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.passkey.create.html',
        size: 'lg',
        controller: function($scope, $http, Flash, $uibModalInstance) {
        }
      })


    });


  }


  // $scope.allmanageUsers()
});

app.controller("workforceManagement.recruitment.onboarding", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.recruitment.onboarding.item.html',
  }, ];

  $scope.config = {
    views: views,
    url: '/api/recruitment/applyJob/',
    searchField: 'firstname',
    getParams : [{key : 'status' , value : 'Onboarding'},],
    itemsNumPerView: [12, 24, 48],
  }

  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'candidateBrowse') {
          var title = 'Browse Candidate : ';
          var myapp = 'candidateBrowse';
        }
        $scope.addTab({
          title: title + $scope.data.tableData[i].firstname,
          cancel: true,
          app: myapp,
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

});

app.controller("workforceManagement.recruitment.onboarding.explore", function($scope, Flash, $state, $users, $stateParams, $http, Flash, $uibModal, $aside) {

  $scope.candidate = $scope.data.tableData[$scope.tab.data.index]
  $scope.saved = false
  $scope.getDetails = function(){
    $http({
      method: 'GET',
      url: '/api/HR/users/?email=' + $scope.candidate.email
    }).
    then(function(response) {
      console.log(response.data);
      $scope.val = response.data[0]
      $scope.details = $scope.val.profile

      if(response.data.length>0){
        $scope.saved = true
      }
      $http({
        method: 'GET',
        url: '/api/HR/profileAdminMode/' +$scope.details.pk
      }).
      then(function(response) {
        $scope.form = response.data
        if($scope.form.emergency!=null){
          $scope.form.emergencyName = $scope.form.emergency.split('::')[0]
          $scope.form.emergencyNumber = $scope.form.emergency.split('::')[1]
        }
      })
    }, function(err) {
      Flash.create('danger', 'Error occured')
    })
  }
    $scope.getDetails()

  $scope.addAsUser = function(){
    $scope.candidate.username = $scope.candidate.newEmail
    $scope.candidate.newAddedEmail = $scope.candidate.newEmail+'@cioc.in'
    dataToSend = $scope.candidate
    $http({
      method: 'POST',
      url: '/api/recruitment/saveDetails/',
      data: dataToSend
    }).
    then(function() {
      Flash.create('success', 'Saved')
      $scope.getDetails()
    })
  }

  $scope.page = 1;
  $scope.maxPage = 3;


  $scope.next = function() {
    console.log("came to next");
    if ($scope.page < $scope.maxPage) {
      $scope.page += 1;
    }
  }

  $scope.prev = function() {
    if ($scope.page > 1) {
      $scope.page -= 1;
    }
  }

  $scope.saveFirstPage = function() {
    var prof = $scope.form;

    if(prof.sameAsLocal==true){
      prof.permanentAddressStreet =prof.localAddressStreet
      prof.permanentAddressCity = prof.localAddressCity
      prof.permanentAddressPin =prof.localAddressPin
      prof.permanentAddressState = prof.localAddressState
      prof.permanentAddressCountry = prof.localAddressCountry
    }


    console.log(prof.sameAsLocal,'sasaaaaaaaaaaaaaaaaa');


    var dataToSend = {
      empID: prof.empID,
      empType: prof.empType,
      prefix: prof.prefix,
      // dateOfBirth: prof.dateOfBirth.toJSON().split('T')[0],

      gender: prof.gender,
      permanentAddressStreet: prof.permanentAddressStreet,
      permanentAddressCity: prof.permanentAddressCity,
      permanentAddressPin: prof.permanentAddressPin,
      permanentAddressState: prof.permanentAddressState,
      permanentAddressCountry: prof.permanentAddressCountry,
      // sameAsShipping: prof.sameAsShipping,
      sameAsLocal:prof.sameAsLocal,
      localAddressStreet: prof.localAddressStreet,
      localAddressCity: prof.localAddressCity,
      localAddressPin: prof.localAddressPin,
      localAddressState: prof.localAddressState,
      localAddressCountry: prof.localAddressCountry,
      email: prof.email,
      mobile: prof.mobile,
      emergency: prof.emergencyName + '::' + prof.emergencyNumber,
      bloodGroup: prof.bloodGroup,
    }
    if (prof.married) {
      dataToSend.married = prof.married;
      // dataToSend.anivarsary = prof.anivarsary.toJSON().split('T')[0]
      if (typeof prof.anivarsary == 'object') {
        dataToSend.anivarsary = prof.anivarsary.toJSON().split('T')[0]
      } else {
        dataToSend.anivarsary = prof.anivarsary
      }
    }

    if (typeof prof.dateOfBirth == 'object') {
      dataToSend.dateOfBirth = prof.dateOfBirth.toJSON().split('T')[0]
    } else {
      dataToSend.dateOfBirth = prof.dateOfBirth
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + prof.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', "Saved");
    })
  }

  $scope.saveSecondPage = function() {


    var f = $scope.form;
    var dataToSend = {
      website: f.website,
      almaMater: f.almaMater,
      pgUniversity: f.pgUniversity,
      docUniversity: f.docUniversity,
      fathersName: f.fathersName,
      mothersName: f.mothersName,
      wifesName: f.wifesName,
      childCSV: f.childCSV,
      note1: f.note1,
      note2: f.note2,
      note3: f.note3,
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + f.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', "Saved");
    })

  }

  $scope.files = {
    "displayPicture": emptyFile,
    'TNCandBond': emptyFile,
    'resume': emptyFile,
    'certificates': emptyFile,
    'transcripts': emptyFile,
    'otherDocs': emptyFile,
    'resignation': emptyFile,
    'vehicleRegistration': emptyFile,
    'appointmentAcceptance': emptyFile,
    'pan': emptyFile,
    'drivingLicense': emptyFile,
    'cheque': emptyFile,
    'passbook': emptyFile,
    'sign': emptyFile,
    'IDPhoto': emptyFile

  }

  $scope.saveFiles = function() {
    var f = $scope.files;
    var fd = new FormData();

    var fileFields = ['displayPicture','TNCandBond', 'resume', 'certificates', 'transcripts', 'otherDocs', 'resignation', 'vehicleRegistration', 'appointmentAcceptance', 'pan', 'drivingLicense', 'cheque', 'passbook', 'sign', 'IDPhoto']
    for (var i = 0; i < fileFields.length; i++) {
      if ($scope.files[fileFields[i]] != emptyFile) {
        fd.append(fileFields[i], $scope.files[fileFields[i]])
      }
    }

    $http({
      method: 'PATCH',
      url: '/api/HR/profileAdminMode/' + $scope.form.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      console.log(response);
      Flash.create('success', "Saved");

    })
  }

  $scope.save = function() {
    if ($scope.page == 1) {
      $scope.saveFirstPage();
    } else if ($scope.page == 2) {
      $scope.saveSecondPage();
    } else {
      $scope.saveFiles();
    }
  }

  $scope.finalStage = function(){
    $http({
      method: 'PATCH',
      url: '/api/recruitment/applyJob/' + $scope.candidate.pk+'/',
      data: {
      status:'Closed'
    }
    }).
    then(function() {
        $scope.tabs.splice($scope.tab.data.index,1)
        $scope.$broadcast('forceRefetch',)
    })
  }

  });
