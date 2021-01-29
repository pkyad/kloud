app.controller("controller.home.calendar", function($scope , $http ,$aside, $state , $timeout , $users, $uibModal) {

  $scope.options = {
      minDate: new Date(),
      showWeeks: false
    };


$scope.allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December']

  $scope.me = $users.get("mySelf");

  $scope.data = {items : []};
  var date = new Date()
  $http({url : '/api/PIM/calendar/?date='+date.toISOString().split('T')[0] , method : 'GET'}).
  then(function(response){
    d = response.data;
    for (var i = 0; i < d.length; i++) {
      $scope.data.items.push( {'type' : d[i].eventType, data : d[i] ,  date : new Date(d[i].when)});
    }
    console.log(d, 'dadadadada');
  })


$scope.form = {
  selectYear:new Date().getFullYear()
}
$scope.years = [$scope.form.selectYear-2,$scope.form.selectYear-1,$scope.form.selectYear,$scope.form.selectYear+1,$scope.form.selectYear+2]

$scope.changeCalendar = function(){
  $scope.date = new Date($scope.form.selectYear, new Date().getMonth(), new Date().getDate())
}

$scope.showMonthwise = function(month,year){
  $scope.index = month
  console.log(new Date().getDate());
  var date = new Date(year.getFullYear(), month, new Date().getDate());
  $scope.date = date

}

  $scope.fetchCalenderEvents = function(){
    $http({url : '/api/PIM/calendar/?date='+$scope.date.toISOString().split('T')[0] , method : 'GET'}).
    then(function(response){
      d = response.data;
      $scope.data.items = [];
      for (var i = 0; i < d.length; i++) {
        $scope.data.items.push( {'type' : d[i].eventType, data : d[i] ,  date : new Date(d[i].when)});
      }
    })


  }

  $scope.showDay = function(input){
    $scope.itemsToShow = [];
    for (var i = 0; i < input.length; i++) {
      $scope.itemsToShow.push($scope.data.items[input[i]]);
    }
    $scope.itemInView = $scope.data.items[input[0]];
  };

  $scope.itemSelected = function(input){
    $scope.itemInView = $scope.itemsToShow[input];
  }

  $scope.toggleToDo = function(input){
    todo = $scope.data.items[input].data;
    $http({url : '/api/PIM/calendar/'+ todo.pk+'/' , method : 'PATCH' , data : {completed : todo.completed}})
  }
  $scope.deleteToDo = function(input){
    todo = $scope.data.items[input].data;
    $http({url : '/api/PIM/calendar/'+todo.pk+'/' , method : 'DELETE' })
    $scope.data.items.splice(input , 1);
  }

  $scope.showPerticular = function(input){
    $scope.itemInView = $scope.data.items[input];
  };

  $scope.edit = function(){
    $scope.openForm($scope.data.items.indexOf($scope.itemInView));
  }
  $scope.delete = function(){
    $http({method : 'DELETE' , url : '/api/PIM/calendar/' + $scope.itemInView.data.pk + '/'}).
    then(function(response){
      $scope.data.items.splice($scope.data.items.indexOf($scope.itemInView) , 1);
    })
  }

  $scope.windowObjectReference = document.createElement("iframe");
  $scope.openAuthenticator = function(typ) {
    if (typ == 'zoom') {
      $scope.windowObjectReference =   window.open("https://zoom.us/oauth/authorize?response_type=code&client_id=NSibt8TRCC1jSvaXk1bfw&redirect_uri=https://6be19224e4bb.ngrok.io/zoomAuthRedirect/" , 'popUpWindow','height=500,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
      $timeout(function(){
      $scope.windowObjectReference.close();
      $http({
        method: 'GET',
        url: '/api/HR/profile/' + $scope.me.profile.pk + '/',
      }).
      then(function(response) {
        $scope.me.profile.zoom_token = response.data.zoom_token
      })
      },10000)
    }
  }




  // $scope.windowObjectReference.addEventListener('beforeunload', function() {
  //   console.log("beforeunloadbeforeunloadbeforeunload");
  // });
  // $scope.windowObjectReference.addEventListener('hashchange', function() {
  //   console.log("beforeunloadbeforeunloadbeforeunloadbeforeunloadsssssssssssssss");
  // });



  $scope.openForm = function(index){
    // index is the index of the calendar item to be edited , if its undefined then a new object will be created else edited
    templateUrl = '/static/ngTemplates/app.home.calendar.aside.html';
    input = {formTitle : typeof index == 'undefined'? 'Create' : 'Edit' , items : $scope.data.items , editor: index};
    $scope.openAside(input);
  }

  $scope.openAside = function(input) {

    $uibModal.open({
      templateUrl: templateUrl,
      size: 'md',
      backdrop: true,
      controller:'controller.home.calendar.aside',
      resolve: {
       input: function () {
         return input;
        }
      }
    }).result.then();
  }

  $scope.date = new Date();
  $scope.templates = '/static/ngTemplates/app.home.calendar.items.html';


  $scope.openSlots = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.addSlots.items.html',
      size: 'lg',
      backdrop: true,
      controller:'controller.home.calendar.addSlots',
      // resolve: {
      //  // input: function () {
      //  //   return input;
      //  //  }
      // }
    }).result.then();
  }

});


app.controller('controller.home.calendar.addSlots', function($scope, $uibModalInstance ,$timeout, $http, $users  , Flash ,$filter) {
  $http({
    method: 'GET',
    url: '/api/ERP/getAllSchedule/'
  }).
  then(function(response) {
    $scope.allSchedules = response.data
  })

  $scope.updateAvailable = function(data){
    $http({
      method: 'PATCH',
      url: '/api/ERP/calendarSlot/'+data.pk+'/',
      data:{
        is_available : data.is_available
      }
    }).
    then(function(response) {
    })

  }

})

app.controller('controller.home.calendar.aside', function($scope, $uibModalInstance ,$timeout, $http, $users , input , Flash ,$filter) {
  $scope.baseUrl = '/api/PIM/calendar/';


  $scope.loadTags = function(query) {
    // return $http.get('/api/HR/userSearch/?username__contains=' + query)
    return $http.get('/searchPeople/?search=' + query)
  };


  var emptyFile = new File([""], "");
  $scope.me = $users.get("mySelf");
  $scope.data = input;

  $scope.saveMeeting = function(){
    console.log( $scope.data.slot ,'aaaaaaaaaaaaaaaaaaaaaaa');

    var fd = new FormData();
    fd.append('eventType' , 'Meeting' );
    fd.append('text' , $scope.data.text );
    if ($scope.data.attachment !=emptyFile && $scope.data.attachment != null) {
      fd.append('attachment' , $scope.data.attachment);
    }
    if ( typeof $scope.data.with !='undefined' && $scope.data.with.length != 0 ) {
      var withStr = [];
      for (var i = 0; i < $scope.data.with.length; i++) {
        withStr.push($scope.data.with[i].id);
      }
      if (withStr.length > 0) {
        fd.append('followers' , withStr)
      }
    }
    if ($scope.data.when != '' ) {
      fd.append('when' , $filter('date')($scope.data.when , "yyyy-MM-dd'T'HH:mm:ssZ") );
    }
    if ($scope.data.venue != '' ) {
      fd.append('venue' , $scope.data.venue );
    }
    if ($scope.data.duration != '' ) {
      fd.append('duration' , parseInt($scope.data.duration*60) );
    }
    fd.append('level' , $scope.data.level );
    fd.append('slot' , $scope.data.slot );

    if ($scope.editMode) {
      url = '/api/PIM/calendar/' + $scope.data.items[$scope.data.editor].data.pk + '/';
      method = 'PATCH';
    } else {
      method = 'POST';
      url  = '/api/PIM/calendar/';
    }

    $http({method : method , url : url, data : fd , transformRequest: angular.identity, headers: {'Content-Type': undefined}}).
    then(function(response){
      window.open("https://zoom.us/oauth/authorize?response_type=code&client_id=zKOQhCMNScqwz67aaWS4Q&redirect_uri=https://efc1a34cc21d.ngrok.io/api/PIM/calendar/" , 'popUpWindow','height=500,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
      $timeout(function(){
        window.close()

      },1000)

      $scope.resetForm();
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.$$postDigest(function(){
        $scope.data.items.push( {'type' : response.data.eventType, data : response.data ,  date : new Date(response.data.when)});
      })
      if($scope.editMode) {
        for (var i = 0; i < $scope.data.items.length; i++) {
          if ($scope.data.items[i].data.pk == response.data.pk){
            $scope.data.items.splice(i, 1);
            return;
          }
        }
      }
    },function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    });
  };

  $scope.saveReminder = function(){
    if ($scope.editMode) {
      url = $scope.baseUrl + $scope.data.items[$scope.data.editor].data.pk +'/';
      method = 'PATCH';
    } else {
      method = 'POST';
      url  = $scope.baseUrl;
    }


    data = { eventType : 'Reminder' , text : $scope.data.text , when : $filter('date')($scope.data.when , "yyyy-MM-dd'T'HH:mm:ssZ")  };
    $http({method : method , url : url , data : data}).
    then(function(response){
      $scope.resetForm();
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.$$postDigest(function(){
        $scope.data.items.push( {'type' : response.data.eventType, data : response.data ,  date : new Date(response.data.when)});
      })
      if($scope.editMode) {
        for (var i = 0; i < $scope.data.items.length; i++) {
          if ($scope.data.items[i].data.pk == response.data.pk){
            $scope.data.items.splice(i, 1);
            return;
          }
        }
      }
    } , function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    });
  };

  $scope.saveToDo = function(){
    if ($scope.editMode) {
      url = $scope.data.items[$scope.data.editor].data.url;
      method = 'PATCH';
    } else {
      method = 'POST';
      url  = $scope.baseUrl;
    }

    data = { eventType : 'ToDo', user : $scope.me.url , text : $scope.data.text  };
    $http({method : method , url : url , data : data}).
    then(function(response){
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.resetForm();
      $scope.$$postDigest(function(){
        $scope.data.items.push( {'type' : response.data.eventType, data : response.data ,  date : new Date(response.data.when)});
      })
      if($scope.editMode) {
        for (var i = 0; i < $scope.data.items.length; i++) {
          if ($scope.data.items[i].data.url.cleanUrl() == response.data.url.cleanUrl()){
            $scope.data.items.splice(i, 1);
            return;
          }
        }
      }
    } , function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    });
  };

  $scope.me = $users.get("mySelf");

  console.log('aaaaaaaaaaaaaaaaaaaaaa', $scope.me);
  $http({
    method: 'GET',
    url: '/api/payroll/payroll/?user=' + $scope.me.pk
  }).
  then(function(response) {
    $scope.payroll = response.data[0];
    console.log($scope.payroll);
  })



$scope.leaveForm = function(){
  $scope.form = {
    fromDate:'',
    toDate:'',
    category:'',
    comment:'',
  }
  $scope.showCal = false
}
$scope.leaveForm()
  $scope.$watch('[form.fromDate,form.toDate]', function(newValue , oldValue) {
    console.log();
    if (typeof $scope.form.fromDate == 'object' && typeof $scope.form.toDate == 'object') {

      console.log('cccccccccccc',$scope.form.fromDate , $scope.form.toDate);
      $http({
        method: 'GET',
        url: '/api/HR/leavesCal/?fromDate=' + $scope.form.fromDate.toJSON().split('T')[0] + '&toDate=' + $scope.form.toDate.toJSON().split('T')[0]
      }).
      then(function(response) {
        console.log('leavesssssssssssss',response.data.data);
        $scope.total = response.data.data.total
        $scope.holidays = response.data.data.holidays
        $scope.saturdays = response.data.data.saturdays
        $scope.sundays = response.data.data.sundays
        $scope.leaves = response.data.data.leaves
        $scope.fromDate = response.data.data.fromDate
        $scope.toDate = response.data.data.toDate
        if ($scope.total > 0) {
          $scope.showCal = true
        }else {
          $scope.showCal = false
        }
        console.log($scope.total , $scope.holidays ,$scope.saturdays ,$scope.sundays , $scope.leaves);
      })
    }

  },true);

  $scope.saveLeaves = function(){
    var f = $scope.form;
    if ($scope.total == undefined || $scope.total<1) {
      Flash.create('warning', 'Please Select The Valid Dates')
      return
    }
    if (f.category.length == 0) {
      Flash.create('warning', 'Please Select The Leave Type')
      return
    }
    if (f.category == 'AL' && ($scope.payroll.al < $scope.leaves)) {
      Flash.create('warning', 'Leaves Are More Than Anual Leaves')
      return
    }else if (f.category == 'ML' && ($scope.payroll.ml < $scope.leaves)){
      Flash.create('warning', 'Leaves Are More Than Medical Leaves')
      return
    }else if (f.category == 'casual' && ($scope.payroll.adHocLeaves < $scope.leaves)) {
      Flash.create('warning', 'Leaves Are More Than Casual Leaves')
      return
    }


    // var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    // var firstDate = f.fromDate;
    // var secondDate = f.toDate;
    //
    // var diffDays = Math.round(Math.abs((f.fromDate.getTime() - f.toDate.getTime())/(oneDay)));


    console.log($scope.fromDate,$scope.toDate);

    var tosend = {
      fromDate: $scope.fromDate,
      toDate: $scope.toDate,
      days: $scope.total,
      leavesCount: $scope.leaves,
      category: f.category,
      comment: f.comment,
      payroll : $scope.payroll.pk,
      holdDays : $scope.leaves
    }
    console.log('aaaaaaa',tosend);

    $http({
      method: 'POST',
      url: '/api/HR/leave/',
      data: tosend,

    }).
    then(function(response) {
      $scope.leaveForm()
      Flash.create('success', 'Submited Successfully')
      $http({
        method: 'GET',
        url: '/api/payroll/payroll/?user=' + $scope.me.pk
      }).
      then(function(response) {
        $scope.payroll = response.data[0];
        console.log($scope.payroll);
      })
    })

  };

  $scope.resetForm = function(typ){
    if (typ != undefined) {
      console.log('typ');
      $scope.leaveForm()
    }else {
      console.log('noneeeeeeeeee');
      $scope.data.text = '';
      $scope.data.attachment = emptyFile;
      $scope.data.with = '';
      $scope.data.when = new Date();
      $scope.data.venue = '';
      $scope.data.level = 'Normal';
      $scope.data.duration = '';
      $scope.data.slot = '9:00 AM';
    }

  };

  $scope.editMode = false;
  if (typeof $scope.data.editor == 'undefined') {
    $scope.resetForm();
  } else {
    $scope.editMode = true;
    calObj = $scope.data.items[$scope.data.editor].data;

    for (key in calObj){
      if (key == 'when') {
        $scope.data.when = new Date(calObj[key]);
      } else if (key == 'followers') {
        $scope.data.with = [];
        for (var i = 0; i < calObj[key].length; i++) {
          $scope.data.with.push($users.get(calObj.followers[i]))
        }
      } else if (key == 'duration') {
        $scope.data[key] = calObj[key]/60;
      } else {
        $scope.data[key] = calObj[key];
      }
    }
    itemType = $scope.data.items[$scope.data.editor].type;
    if ( itemType == 'Meeting') {
      $scope.editorTemplate = $scope.data.template.meeting;
    } else if (itemType == 'ToDo') {
      $scope.editorTemplate = $scope.data.template.todo;
    } else if (itemType == 'Reminder') {
      $scope.editorTemplate = $scope.data.template.reminder;
    }
  }
});
