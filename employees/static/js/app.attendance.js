
app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.attendance', {
      url: "/attendance",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "menu@businessManagement.accounting": {
          templateUrl: '/static/ngTemplates/genericMenu.html',
          controller: 'controller.generic.menu',
        },
        "@businessManagement.attendance": {
          templateUrl: '/static/ngTemplates/app.employees.Attendance.html',
          controller: 'businessManagement.employees.Attendance',
        }
      }
    })
});
// .state('businessManagement.Attendance', {
//   url: "/Attendance",
//   templateUrl: '/static/ngTemplates/app.employees.Attendance.html',
//   controller: 'businessManagement.employees.Attendance'
// })

app.controller('businessManagement.employees.Attendance', function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $aside) {

  $scope.openDay = function(day) {
    console.log($scope.dates[day]);

    $aside.open({
      resolve : {
        date : function() {
          return $scope.dateDisp
        },
        day : function() {
          return $scope.dates[day]
        },
        user : function() {
          return $scope.userform.user
        }
      },
      templateUrl : '/static/ngTemplates/app.employees.logs.html',
      placement: 'right',
      size: 'lg',
      backdrop : true,
      controller : function($scope , $http , date , day , user ) {
        var dt =new  Date( date.getFullYear(),date.getMonth(),day+1)
        $http({method : 'GET' , url : '/api/employees/log/?user=' + user.pk + '&dated=' + dt.toISOString().split('T')[0]  }).
        then(function(response) {
          $scope.data = response.data;
        })
      }
    })


  }



  $scope.me = $users.get('mySelf'); //hit api and get user who is logged in
  $scope.userform = {
    user: $scope.me
  }

  $scope.$watch('userform.user'  , function(newValue , oldValue) {
    if (typeof newValue == 'object') {
      $scope.getUserAttendance();
    }
  })



  $scope.getUserAttendance = function() {
    //http get request to hit the api and fetch user data. we send user pk and date for which we need data.
    $http({
      method: 'GET',
      url: '/api/employees/fetchAttendance/?user=' + $scope.userform.user.pk + '&date=' + $scope.dateDisp.toJSON().split('T')[0],
    }).
    then(function(response) {
      // console.log(response.data,'resssssssssssss');
      $scope.values = response.data.valList
      $scope.timeList = response.data.timeList
      $scope.leavetype = response.data.leavetype
    })
    // console.log($scope.dateDisp, '7777777777777777');
    // console.log($scope.userform);
  }

  $scope.listOfDays = [{
      "val": 1,
      "disp": "Sunday"
    }, {
      "val": 1,
      "disp": "Monday"
    }, {
      "val": 1,
      "disp": "Tuesday"
    }, {
      "val": 1,
      "disp": "Wednesday"
    }, {
      "val": 1,
      "disp": "Thursday"
    },
    {
      "val": 1,
      "disp": "Friday"
    }, {
      "val": 1,
      "disp": "Saturday"
    }
  ];

  var calDate = new Date(); // the current date value known to the calendar, also the selected. For a random month its 1st day of that month.
  var calMonth = calDate.getMonth(); // in MM format
  var calYear = calDate.getFullYear(); // in YYYY format

  $scope.itemInView = [];
  datesMap = getDays(calMonth, calYear);
  $scope.dates = datesMap.days;
  $scope.dateFlags = datesMap.flags;
  $scope.dateDisp = calDate;
  $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp; // Find equivalent day name from the index
  $scope.getUserAttendance()


  $scope.gotoToday = function() {
    var calDate = new Date(); // current day
    calMonth = calDate.getMonth();
    calYear = calDate.getFullYear();
    $scope.dateDisp = calDate;
    $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
    datesMap = getDays(calMonth, calYear);
    $scope.dates = datesMap.days;
    $scope.dateFlags = datesMap.flags;
    $scope.getUserAttendance()
  };
  $scope.gotoNext = function() {
    calMonth += 1;
    calDate.setFullYear(calYear, calMonth, 1);
    datesMap = getDays(calMonth, calYear);
    $scope.dates = datesMap.days;
    $scope.dateFlags = datesMap.flags;
    $scope.dateDisp = calDate;
    $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
    $scope.getUserAttendance()
  };
  $scope.gotoPrev = function() {
    calMonth -= 1;
    calDate.setFullYear(calYear, calMonth, 1);
    datesMap = getDays(calMonth, calYear);
    $scope.dates = datesMap.days;
    $scope.dateFlags = datesMap.flags;
    $scope.dateDisp = calDate;
    $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
    $scope.getUserAttendance()
  };

  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) input.push(i);
    return input;
  };
  $scope.userSearch = function(query) {
    //search for the user
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };


  $scope.getval = function(typ, dt) {
    if ($scope.values!=undefined) {
      if (typ == 'Cur') {
        if ($scope.values[dt - 1] >= 8) {
          return '#ddf9d7'
          //for worked more then 8hrs
        } else if ($scope.values[dt - 1] > 0 && $scope.values[dt - 1] < 8) {
          return '#feefde'
          //for absent
        } else if ($scope.values[dt - 1] == 0) {
          return '#e2f3fe'
          //for loggedin  or loggedout once
        }else if ($scope.values[dt - 1] == -2) {
          return '#E4E4E4'
          //for the leave request
        }
      } else {
        return ''
      }
    }
  }


  $scope.openUploadForm = function() {


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.employess.Attendance.uploadform.html',
      size: 'md',
      backdrop: true,

      controller: function($scope, ) {

        $scope.uploadForm = {
          datFile: emptyFile,
        }
        $scope.upload = function() {
          if ($scope.uploadForm.datFile == emptyFile) {
            Flash.create('warning', 'No file selected')
            return
          }
          console.log($scope.uploadForm.datFile);
          var fd = new FormData()
          fd.append('file', $scope.uploadForm.datFile);
          console.log(fd);
          $http({
            method: 'POST',
            url: '/api/employees/loadAttendanceData/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
          })

        }

      },
    })

  }




});
