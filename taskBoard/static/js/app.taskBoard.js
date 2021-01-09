app.config(function($stateProvider){

  $stateProvider
  .state('projectManagement.taskBoard', {
    url: "/taskBoard",
    templateUrl: '/static/ngTemplates/app.todo.html',
    controller : 'projectManagement.todo',
  })


});

function diff_minutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function diff_human_readable(dt2, dt1 , offset) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  min = diff/60;
  seconds = diff%60;
  return Math.abs(Math.floor(min)+offset) + ' minutes ' + Math.abs(Math.round(seconds)) + ' seconds';
}

app.controller('projectManagement.todo' , function($scope ,$http, $users , Flash ,  $aside , $injector, $timeout, $uibModal, $filter , $interval , mentioUtil , $q){


  $scope.getProductTextRaw = function(item) {
            return '#' + item.title + '('+ item.pk +')' ;
            // var deferred = $q.defer();
            /* the select() function can also return a Promise which ment.io will handle
            propertly during replacement */
                    // simulated async promise
            // $timeout(function() {
            //     deferred.resolve('#' + item.title + '('+ item.pk +')'  );
            // }, 500);
            // return deferred.promise;
        };
  $scope.getPeopleTextRaw = function(item) {
             return '@' + item.username;
         };
  $scope.searchProducts = function(term) {
      var prodList = [];

      return $http.get('/api/projects/projectSearch/?title__icontains='+ term).then(function (response) {
          angular.forEach(response.data, function(item) {
              prodList.push(item);
          });

          $scope.products = prodList;
          return $q.when(prodList);
      });
  };

  $scope.searchPeople = function(term) {
      var peopleList = [];
      return $http.get('/api/HR/userSearch/?limit=10&first_name__icontains=' + term).then(function (response) {
          angular.forEach(response.data.results, function(item) {
            peopleList.push(item);
          });
          $scope.people = peopleList;
          return $q.when(peopleList);
      });
  };



  $http({method : 'GET' , url : '/api/projects/projectSearch/'}).
  then(function(response) {
    $scope.projects = response.data;
  })

  $interval(function() {
    for (var i = 0; i < $scope.tasks.length; i++) {
      if ($scope.tasks[i].timerStartedAt != null) {
        $scope.tasks[i].timerStr = diff_human_readable(new Date(), $scope.tasks[i].timerStartedAt , $scope.tasks[i].timeSpent)
      }
    }
  },1000)

  $scope.openFile = function(file) {
    window.open(file.attachment , '_blank');
  }


  $scope.startTask = function(indx) {


    for (var i = 0; i < $scope.tasks.length; i++) {
      if ($scope.tasks[i].timerStartedAt != null) {
        Flash.create('warning' , 'Another task already running')
        return;
      }
    }



    var task = $scope.tasks[indx];
    if (task.timerStartedAt == null) {
      $http({method : 'PATCH' , url : '/api/taskBoard/task/' + task.pk +'/', data : {timerStartedAt : new Date()}}).
      then((function(indx) {
        return function(response) {
          $scope.tasks[indx].timerStartedAt = new Date();
        }
      })(indx))
    }
  }


  $scope.stopTask = function(indx) {
    var task = $scope.tasks[indx];

    if (task.timerStartedAt != null) {
      $http({method : 'PATCH' , url : '/api/taskBoard/task/' + task.pk + '/', data : {timerStartedAt : null, timeSpent : task.timeSpent + diff_minutes(task.timerStartedAt , new Date()) }}).
      then((function(indx) {
        return function(response) {
          $scope.tasks[indx].timerStartedAt = null;
          $scope.tasks[indx].timeSpent = response.data.timeSpent;
        }
      })(indx))
    }
  }


  window.addEventListener("paste", function(thePasteEvent){

      for (var i = 0; i < thePasteEvent.clipboardData.items.length; i++) {
        if (thePasteEvent.clipboardData.items[i].kind != 'string') {
          $scope.form.files.push(thePasteEvent.clipboardData.items[i].getAsFile())
        }
      }

      // var newValue = $scope.form.file;
      // $scope.reader = new FileReader();
      //
      // console.log(newValue);
      // if (typeof newValue != 'object' || newValue == null || newValue == emptyFile ) {
      //   $('#imgPreview').attr('src', "");
      //   return;
      // }
      //
      // $scope.reader.onload = function(e) {
      //   $('#imgPreview')
      //     .attr('src', e.target.result);
      // }
      //
      // $scope.reader.readAsDataURL(newValue);

  }, false);

  $scope.updateSubTaskTitle = function(pk , txt) {
    $http({method : 'PATCH' , url : '/api/taskBoard/subTask/' + pk  + '/' , data : {title : txt}}).
    then(function(response) {

    })
  }

  $scope.updateTaskTitle = function(pk , txt) {
    $http({method : 'PATCH' , url : '/api/taskBoard/task/' + pk  + '/' , data : {title : txt}}).
    then(function(response) {

    })
  }


  $scope.openTask = function(task) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.taskBoard.task.html',
      placement: 'right',
      size: 'md',
      backdrop: true,
      controller: function($scope , $uibModalInstance , task , $filter  ) {
        $scope.task = task;
        $scope.form = {files : []}

        $scope.$watch('task.dueDate' , function(newValue , oldValue) {
          $http({
            method: 'PATCH',
            url: '/api/taskBoard/task/'+ $scope.task.pk + '/',
            data: {dueDate : $filter('date')($scope.task.dueDate ,'yyyy-MM-dd HH:mm') },
          }).then(function(response) {
            // $scope.task.dueDate = response.data.files;
          })
        });

        $scope.deleteFile = function(indx) {
          $http({method : 'DELETE' , url : '/api/taskBoard/media/' + $scope.task.files[indx].pk + '/'   }).
          then((function(indx) {
            $scope.task.files.splice(indx , 1);
          })(indx))
        }


        $scope.$watch('form.files' , function(newValue , oldValue) {
          if (newValue.length > 0) {
            var fd = new FormData();
            fd.append('filesCount' , $scope.form.files.length)

            for (var i = 0; i < $scope.form.files.length; i++) {
              fd.append('file'+ i , $scope.form.files[i])
            }

            $http({
              method: 'PATCH',
              url: '/api/taskBoard/task/'+ $scope.task.pk + '/',
              data: fd,
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }).then(function(response) {
              $scope.task.files = response.data.files;
            })
          }
        })

        $scope.deleteTask = function() {
          $http({method : 'DELETE' , url : '/api/taskBoard/task/' + $scope.task.pk  + '/'}).
          then(function(response) {
            $uibModalInstance.dismiss();
          })
        }
      },
      resolve: {
        task: function() {
          return task;
        }
      }
    }).result.then(function() {
      $scope.fetchTasks();
    }, function() {
      $scope.fetchTasks();
    })



  }

  $scope.markTask = function(indx , pk , completion) {
    if (completion>0) {
      var cmp = 0;
    }else{
      var cmp = 100;
    }
    $http({method : 'PATCH' , url : '/api/taskBoard/task/' + pk +'/' , data : {completion : cmp }  }).
    then((function(indx) {
      return function(response) {
        $scope.tasks[indx].completion = response.data.completion;
      }
    })(indx))
  }

  $scope.me = $users.get('mySelf');

  $scope.fetchTasks = function() {
    var dt = new Date();
    var params = {}
    if (typeof $scope.form.open == 'number') {
      params.project = $scope.form.open;
    }else if ($scope.form.open == 'today') {
      params.dueDate =  dt.toISOString().split('T')[0]
      params.to =  $scope.me.pk;
    }else if ($scope.form.open == 'backlogs') {
      params.dueDate__lt =  dt.toISOString().split('T')[0]
      params.to =  $scope.me.pk;
    }else if ($scope.form.open == 'inbox') {
      params.to =  $scope.me.pk;
    }else{
      params.filterBy = $scope.form.open;
    }


    $http({method : 'GET' , url : '/api/taskBoard/task/' , params : params}).
    then(function(response) {
      $scope.tasks = response.data;
      for (var i = 0; i < $scope.tasks.length; i++) {
        if ($scope.tasks[i].timerStartedAt) {
          $scope.tasks[i].timerStartedAt = new Date($scope.tasks[i].timerStartedAt);
        }
      }
    })
  }

  $scope.markSubTask = function(pk , indx , taskIndx , status) {

    console.log(pk , indx , taskIndx , status);

    if (status == 'notStarted') {
      var sts = 'complete';
    }else{
      var sts = 'notStarted';
    }

    $http({method : 'PATCH' , url : '/api/taskBoard/subTask/' + pk  +'/' ,data: {status : sts}} ).
    then((function(indx, taskIndx) {
      console.log(indx , taskIndx);
      return function(response) {
        $scope.tasks[taskIndx].subTasks[indx].status = response.data.status;
      }
    })(indx, taskIndx))
  }


  $scope.resetForm = function() {
    if ($scope.form) {
      var existingTab = $scope.form.open;
    }
    $scope.form = {
      addingSubTask : null,
      creatingNew : false,
      title  : '',
      files : [],
      dueDate : new Date(),
      subTaskTxt : ''
    }
    if (existingTab) {
      $scope.form.open = existingTab;
    }
  }
  $scope.resetForm();
  $scope.form.open = 'today';
  $scope.form.heading = 'Today';

  $scope.$watch('form.open' , function(newValue , oldValue) {
    $scope.fetchTasks();
  })


  $scope.addNewSubTask = function(indx , newSubTasksSeries) {

    if (newSubTasksSeries) {
      var dataToSend = {title : $scope.form.subTaskTxt , task : $scope.tasks[indx].pk  }
    }else{
      var dataToSend = {title : $scope.tasks[indx].subTaskText , task : $scope.tasks[indx].pk  }
    }

    $http({method : 'POST' , url : '/api/taskBoard/subTask/' , data : dataToSend }).
    then((function(indx , newSubTasksSeries) {
      return function(response) {
        $scope.tasks[indx].subTasks.push(response.data);
        $scope.form.addingSubTask = null;

        if (!newSubTasksSeries) {
          $scope.tasks[indx].subTaskText = '';
        }else{
          $scope.form.subTaskTxt = '';
        }
      }
    })(indx , newSubTasksSeries))
  }
  $scope.creteTask = function() {
    var fd = new FormData();
    fd.append('title' , $scope.form.title);
    fd.append('dueDate' ,$filter('date')($scope.form.dueDate ,'yyyy-MM-dd'));
    fd.append('filesCount' , $scope.form.files.length)
    if (typeof $scope.form.open == 'number' ) {
      fd.append('project' , $scope.form.open )
    }
    for (var i = 0; i < $scope.form.files.length; i++) {
      fd.append('file'+ i , $scope.form.files[i])
    }

    $http({
      method: 'POST',
      url: '/api/taskBoard/task/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).then(function(response) {
      $scope.tasks.unshift(response.data);
      $scope.resetForm();
    })


  }


  $scope.tasks = [ ]

})


app.controller('projectManagement.taskBoard.createTask' , function($scope ,$http, $users , Flash ,  $aside , $injector, $timeout){
    $scope.reset = function() {
      $scope.form = {title : '' , description :'' , dueDate : new Date() , followers : [] , files : [] , subTasks : [] , personal : true , pk : undefined , mode : 'new' , project : undefined, to : undefined , disableProjectField : false}
      $scope.commentEditor = {text : ''};
      $scope.data = {pk : undefined , commitNotifications : [] , gitPage :0 , messages : [] , messagePage : 0 , addFile : false};
      $scope.explore = {mode :'git'};
      $scope.subTaskBackup = {title : '' , status : 'notStarted'};
      $scope.mode = 'new';
    }

    $scope.reset();
    console.log($scope.$parent.$parent);
    var project;
    try{
      project = $injector.get('project');
    }catch(e){
      project = null;
    }

    if (project != null && typeof project != 'undefined') {
      $http.get('/api/projects/projectSearch/' + project + '/').
      then(function(response){
        $scope.form.project = response.data;
        $scope.form.disableProjectField = true;
      });
    };

    $scope.projectSearch = function(query) {
      return $http.get('/api/projects/projectSearch/?title__contains=' + query).
      then(function(response){
        return response.data;
      })
    }

    $scope.addTimelineItem = function() {
        if ($scope.commentEditor.text.length ==0) {
            Flash.create('warning' , 'Nothing to add!');
            return;
        }else {
            if ($scope.commentEditor.text.startsWith('C#')) {
                // its a commit to be added
                var sha = $scope.commentEditor.text.split('C#')[1];
                if (sha.length == 0) {
                    Flash.create('warning' , 'Plaase provide the HASH value of the commit');
                    return;
                }
                $http({method : 'GET' , url : '/api/git/commitNotification/?sha__contains=' + sha }).
                then(function(response) {
                    if (response.data.count >1) {
                        Flash.create('warning' , 'More then one commit found for this commit HASH');
                        return;
                    }
                    var dataToSend = {
                        task : $scope.form.pk,
                        commit : response.data[0].pk,
                        category : 'git',
                    }
                    $http({method : 'POST' , url : '/api/taskBoard/timelineItem/' , data : dataToSend}).
                    then(function(response) {
                        $scope.data.commitNotifications.push(response.data);
                        $scope.commentEditor.text = '';
                    });
                });
            }else{
                var dataToSend = {
                    task : $scope.form.pk,
                    text : $scope.commentEditor.text,
                    category : 'message',
                }
                $http({method : 'POST' , url : '/api/taskBoard/timelineItem/' , data : dataToSend}).
                then(function(response) {
                    $scope.data.messages.push(response.data);
                    $scope.commentEditor.text = '';
                });
            }
        }
    }

    $scope.subAction = function(action) {
      if (action == 'addToDash') {
        // add to dash
        console.log("will add to dash");
      }else if (action == 'archive') {
        console.log("will archive");
      }
    }

    $scope.exploreNotification = function(index) {
      $aside.open({
        templateUrl : '/static/ngTemplates/app.GIT.aside.exploreNotification.html',
        position:'left',
        size : 'xxl',
        backdrop : true,
        resolve : {
          input : function() {
            return $scope.data.commitNotifications[index].commit;
          }
        },
        controller : 'projectManagement.GIT.exploreNotification',
      })
    }

    $scope.updateFiles = function() {
        if (!$scope.explore.addFile) {
            return;
        }
        var pks = [];
        for (var i = 0; i < $scope.form.files.length; i++) {
            pks.push($scope.form.files[i].pk);
        }
        var dataToSend = {
            files : pks
        }
        $http({method : 'PATCH' , url : '/api/taskBoard/task/'+ $scope.form.pk + '/' , data : dataToSend}).
        then(function(response) {
            Flash.create('success' , 'Saved');
        });
    }

    if (typeof $scope.tab != 'undefined' && typeof $scope.tab.data.pk != 'undefined') {
      $http.get('/api/taskBoard/task/'+ $scope.tab.data.pk +'/').
      then(function(response) {
          $scope.form = response.data;
          $scope.form.to = $users.get($scope.form.to);
          $scope.form.mode = 'view';
          $http({method : 'GET' , url : '/api/taskBoard/timelineItem/?category=git&limit=5&task=' + $scope.form.pk + '&offset=' + $scope.data.gitPage }).
          then(function(response) {
              $scope.data.commitNotifications = response.data.results;
          });
          $http({method : 'GET' , url : '/api/taskBoard/timelineItem/?category=message&limit=5&task=' + $scope.form.pk + '&offset=' + $scope.data.messagePage }).
          then(function(response) {
              $scope.data.messages = response.data.results;
          });
          $scope.mode = 'view';
      });
    }

    $scope.changeExploreMode = function(mode) {
        $scope.explore.mode = mode;
    }

    $scope.edit = function() {
        $scope.form.mode = 'edit';
    }

    $scope.addSubTask = function(){
        for (var i = 0; i < $scope.form.subTasks.length; i++) {
            if($scope.form.subTasks[i].inEditor){
                return;
            }
        }
        $scope.form.subTasks.push({title : '' , status : 'notStarted', inEditor : true});
    }

    $scope.closeEditor = function(index){
        var st = $scope.form.subTasks[index];
        if (typeof st.pk == 'undefined') {
            $scope.form.subTasks.splice(index,1);
        }else{
            $scope.form.subTasks[index] = $scope.subTaskBackup;
            $scope.form.subTasks[index].inEditor = false;
        }
    }

    $scope.editSubTask = function(index) {
        $scope.subTaskBackup = angular.copy($scope.form.subTasks[index]);
        $scope.form.subTasks[index].inEditor = true;
    }

    $scope.save = function() {
        var method = 'POST';
        var url = '/api/taskBoard/task/';
        var dataToSend = {
            title : $scope.form.title,
            description : $scope.form.description,
            dueDate : $scope.form.dueDate,
            followers : $scope.form.followers,
        }
        if (typeof $scope.form.to != 'undefined') {
          dataToSend.to = $scope.form.to.pk;
        }
        if (typeof $scope.form.project != 'undefined' && $scope.form.project != null) {
          dataToSend.project = $scope.form.project.pk;
        }

        dataToSend.files = []
        for (var i = 0; i < $scope.form.files.length; i++) {
            dataToSend.files.push($scope.form.files[i].pk);
        }

        if ($scope.form.pk == null || typeof $scope.form.pk == 'undefined' ) {
            dataToSend.personal = $scope.form.personal;
        }else {
            method = 'PATCH';
            url += $scope.form.pk + '/';
        }
        $http({method : method , url : url , data : dataToSend}).
        then(function(response) {
            Flash.create('success' , 'Saved');
            $scope.form.mode = 'view';
            $scope.form.pk = response.data.pk;
        })
    }

    $scope.changeSubTaskStatus = function(status , index) {
        $scope.form.subTasks[index].status = status;
        var st = $scope.form.subTasks[index];
        $http({method : 'PATCH' , url : '/api/taskBoard/subTask/' + st.pk + '/' , data : st }).
        then(function(response) {
            Flash.create('success' , 'Updated');
        });
    }

    $scope.saveSubTask = function(index) {
        var url ='/api/taskBoard/subTask/';
        if ($scope.form.pk == null || typeof $scope.form.pk == 'undefined') {
            Flash.create('warning' , 'Please save the parent Task before before this can be saved');
            return;
        }
        var st = $scope.form.subTasks[index]
        if (typeof st.pk!='undefined' && st.title.length == 0) {
            $http({method : 'DELETE', url : url + st.pk + '/' }).
            then((function(index) {
                return function(response) {
                    $scope.form.subTasks.splice(index , 1);
                    Flash.create('success' , 'Sub Task deleted');
                }
            })(index))
            return;
        }
        if (st.title.length == 0) {
            Flash.create('warning' , 'Title can not be left blank');
            return;
        }
        var dataToSend = {
            title : st.title,
        }
        var method = 'POST';
        if (typeof st.pk == 'undefined') {
            // its a new task
            dataToSend.status = 'notStarted';
            dataToSend.task = $scope.form.pk;
        }else {
            dataToSend.status = st.status;
            method = 'PATCH';
            url += st.pk + '/'
        }
        $http({method : method , url : url , data : dataToSend}).
        then((function(index) {
            return function(response) {
              console.log(response);
                $scope.form.subTasks[index] = response.data;
                if (response.status == 201) {
                  $scope.addSubTask()
                  $timeout(function() {
                    $('#subTaskEditor').focus();
                  },500)
                }
            }
        })(index))
    };

});

app.controller('projectManagement.taskBoard.task.item' , function($scope){

  $scope.getStatusColor = function() {
    var percentage = $scope.data.completion;
    if (percentage<=20) {
      return 'bg-red';
    }else if (percentage>20 && percentage <50) {
      return 'bg-yellow';
    }else if (percentage >=50 && percentage<75) {
      return 'bg-aqua';
    }else{
      return 'bg-green';
    }
  }

});

app.controller('projectManagement.taskBoard.default' , function($scope , $http , $aside , $state, Flash , $users , $filter , $permissions , $rootScope, $uibModal){

  $scope.openTimeSheet = function() {
    $aside.open({
        templateUrl: '/static/ngTemplates/app.home.myWork.html',
        controller: 'controller.home.myWork',
        position:'left',
        size : 'xl',
        backdrop : true,
    }).result.then(function() {}, function() {
        $rootScope.$broadcast('forceRefetch' , {});
    });
  }


  $scope.forceRefetch = function() {
    $rootScope.$broadcast('forceRefetch' , {});
  };

  $scope.data = {tableData : []};

  $scope.me = $users.get('mySelf');

  $scope.createTask = function() {
      $aside.open({
          templateUrl : '/static/ngTemplates/app.taskBoard.createTask.html',
          controller : 'projectManagement.taskBoard.createTask',
          position:'left',
          size : 'xl',
          backdrop : true,
          resolve : {
            project : function() {
              return null;
            }
          }
      }).result.then(function() {}, function() {
          $rootScope.$broadcast('forceRefetch' , {});
      });
  }

  var views = [{
    name: 'list',
    icon: 'fa-bars',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.taskBoard.item.html',
  }, ];

  $scope.tasksConfig = {
    views: views,
    url: '/api/taskBoard/task/',
    searchField: 'title',
    // getParams : [{key : 'to' , value : $scope.me.pk},],
    multiselectOptions : [{icon : 'fa fa-plus' , text : 'Add' }],
    itemsNumPerView : [5,10,20],
    filters : [
      {icon : '' , key : 'orderBy' , btnClass:'default' , orderable : true, options : [
        {icon : '' , value : 'created'},
        {icon : '' , value : 'completion'},
      ]},
    ],
    drills : [
      {icon : 'fa fa-bars' , name : 'includeWhereIam' , btnClass : 'default' , options : [
        {key : 'follower', value : true},
        {key : 'assignee', value : true},
        {key : 'responsible', value : true},
      ]}
    ]
  }

  $scope.tableAction = function(target , action , mode){
    console.log(target);
    if (mode == 'multi') {
      $scope.createTask();


    }else{

      if (action == 'taskBrowser') {
        for (var i = 0; i < $scope.data.tableData.length; i++) {
          if ($scope.data.tableData[i].pk == parseInt(target)){
            $scope.addTab({title : 'Browse task : ' + $scope.data.tableData[i].title , cancel : true , app : 'taskBrowser' , data : {pk : target , name : $scope.data.tableData[i].title} , active : true})
          }
        }
      }
    }
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index){
    $scope.tabs.splice(index , 1)
  }

  $scope.addTab = function( input ){
      console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      }else{
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }


    $http({
      method: 'GET',
      url: '/api/projects/issue/?responsible=' + $scope.me.pk ,
    }).
    then(function(response) {
      $scope.task = response.data;
    })

    $scope.details = function (id) {
      console.log('detailsssssss function');
      console.log($scope.me.username,$scope.me.pk,'---------');
        $aside.open({
          templateUrl: '/static/ngTemplates/app.projects.issueDetails.html',
          placement: 'left',
          size: 'md',
          backdrop: true,
          controller: function($scope){
              console.log(id,'------this issue');
              $http({
                method: 'GET',
                url: '/api/projects/issue/' + id ,
              }).
              then(function(response) {
                $scope.details = response.data;
              });

            }
        })
      }

      $scope.setStatus = function(pk, status) {
        console.log('sett statusssssssss');
        $http({
          method: 'PATCH',
          url: '/api/projects/issue/' + pk + '/',
          data: {
            status: status
          }
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
        });

        if (status == 'resolved') {
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.project.issue.result.html',
            // placement: 'left',
            size: 'md',
            backdrop: false,
            resolve: {
              issue: function() {
                return pk;
              }
            },
            controller: function($scope, issue, $uibModalInstance) {
              $scope.form = {
                resultComments: '',
                result: 'resolved'
              };
              $scope.issue = issue;
              $scope.save = function() {
                $http({
                  method: 'PATCH',
                  url: '/api/projects/issue/' + $scope.issue + '/',
                  data: $scope.form
                }).
                then(function(response) {
                  Flash.create('success', 'Saved');
                  $uibModalInstance.close()
                });
              }
            }
          }).result.then(function(d) {
          }, function(d) {
          });
        }
      }

});

app.controller("controller.home.myWork", function($scope, $state, $users,$aside, $stateParams, $http, Flash, $uibModal) {

  $scope.me = $users.get('mySelf');

  $scope.items = []

  $scope.selectDate = function(indx) {
    $scope.selectIndex = indx;
  }

  $scope.selectIndex = 7;

  $scope.next = function() {
    $scope.selectIndex < $scope.dates.length - 1 ? $scope.selectIndex++ : $scope.selectIndex = 0;

  }

  $scope.prev = function() {
    $scope.selectIndex > 0 ? $scope.selectIndex-- : $scope.selectIndex = $scope.dates.length - 1;
  }



  $scope.addTableRow = function() {
    $scope.items.push({
      project: '',
      duration: 0,
      comment: ''
    });
    console.log($scope.items);
  }

  $scope.totalTime = function() {

    if ($scope.items == undefined) {
      return 0;
    }


    var total = 0;
    for (var i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].duration != undefined) {
        total += $scope.items[i].duration;
      }
    }
    return total.toFixed(2);
    console.log('aaaaaa', total);
  }


  $scope.deleteTable = function(index) {
    if ($scope.items[index].pk != undefined) {
      $http({
        method: 'DELETE',
        url: '/api/performance/timeSheetItem/' + $scope.items[index].pk + '/'
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



  $scope.projectSearch = function(query) {
    return $http.get('/api/projects/project/?title__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  var today = new Date();
  var day = 1000 * 3600 * 24;

  // $scope.dates = [new Date(today.getTime() - day * 2), new Date(today.getTime() - day), today, new Date(today.getTime() + day), new Date(today.getTime() + 2 * day)];
  $scope.dates = []
  for (var i = 10; i > 0; i--) {
    $scope.dates.push(new Date(today.getTime() - day * (i-3)))
  }

  console.log($scope.dates);


  $http({
    method: 'GET',
    url: '/api/projects/project/?member'
  }).
  then(function(response) {
    $scope.projects = response.data;
    console.log($scope.projects);
  })


  $scope.addProjects = function(idx) {

    for (var i = 0; i < $scope.items.length; i++) {
      if ($scope.items[i].project.pk == $scope.projects[idx].pk) {
        console.log($scope.items[i].project.pk);
        console.log($scope.projects[idx].pk);
        Flash.create('warning', 'Already added');
        return;
      }
    }

    $scope.items.push({
      project: $scope.projects[idx],
      duration: 0,
      comment: ''
    });

  }

  // function addZero(i) {
  //   if (i < 10) {
  //     i = "0" + i;
  //   }
  //   return i;
  // }

  $scope.checkin = function() {
    var d = new Date();
    console.log(d);
    $scope.checkinTime = d.getTime();
    console.log('aaaaaa', $scope.checkinTime,$scope.timeSheet);
    $http({
      method: 'PATCH',
      url: '/api/performance/timeSheet/'+ $scope.timeSheet.pk + '/',
      data: {
        checkInTime: 'checkin',
      }
    }).
    then(function(response) {
      $scope.btnTyp = response.data;

    })

  }

  $scope.checkout = function() {
    var d = new Date();
    $scope.checkoutTime = d.getTime() - $scope.checkinTime;
    console.log($scope.checkoutTime ,$scope.checkinTime);


    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100);
        var  seconds = parseInt((duration / 1000) % 60);
        var  minutes = parseInt((duration / (1000 * 60)) % 60);
        var  hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + ":"+ milliseconds ;
      }
    $scope.totaltime = msToTime($scope.checkoutTime);
    console.log(typeof $scope.totaltime,'cccccccccccccc');
    console.log('bbbbbbbbbb', $scope.checkoutTime,$scope.timeSheet,$scope.totaltime,'vvvvvv');
    $http({
      method: 'PATCH',
      url: '/api/performance/timeSheet/'+ $scope.timeSheet.pk + '/',
      data: {
        checkOutTime: 'checkout',
        totaltime : $scope.totaltime,
      }
    }).
    then(function(response) {
      $scope.btnTyp = response.data;
      console.log("aaaaaaaaaaaaaaaaaaaaaaaa",$scope.btnTyp);
    })
  }

  $scope.$watch('selectIndex', function(newValue, oldValue) {
    var today = new Date()

    var dt = $scope.dates[newValue];
    if (dt > today ) {
      console.log('featureeeeeeee');
      $scope.Checkinshow = false
    }else {
      console.log('past or equallllllllll');
      $scope.Checkinshow = true
    }

    $http({
      method: 'GET',
      url: '/api/performance/timeSheet/?date=' + dt.toJSON().split('T')[0] + '&user=' + $scope.me.pk
    }).
    then(function(response) {
      if (response.data.length == 0) {

        $http({
          method: 'POST',
          url: '/api/performance/timeSheet/',
          data: {
            date: $scope.dates[newValue].toJSON().split('T')[0],
            // status: 'saved'
          }
        }).
        then(function(response) {
          $scope.timeSheet = response.data;
          $scope.items = $scope.timeSheet.items;
          console.log('dddddddddddd',$scope.timeSheet);
          if ($scope.timeSheet.checkIn == null && $scope.timeSheet.checkOut == null) {
            $scope.btnTyp = ''
          }else {
            $scope.btnTyp = $scope.timeSheet
          }
        })

      } else {
        $scope.timeSheet = response.data[0];
        $scope.items = $scope.timeSheet.items;
        console.log('dddddddddddd',$scope.timeSheet);
        if ($scope.timeSheet.checkIn == null && $scope.timeSheet.checkOut == null) {
          $scope.btnTyp = ''
        }else {
          $scope.btnTyp = $scope.timeSheet
        }
      }

    })


  })


  $scope.save = function() {

    for (var i = 0; i < $scope.items.length; i++) {
      var url = '/api/performance/timeSheetItem/'
      var method = 'POST';
      if ($scope.items[i].pk != undefined) {
        url += $scope.items[i].pk + '/'
        method = 'PATCH';
      }

      console.log('aaaaaaaaa', $scope.items[i].project.pk);



      var toSend = {
        project: $scope.items[i].project.pk,
        duration: $scope.items[i].duration,
        comment: $scope.items[i].comment,
        parent: $scope.timeSheet.pk,
      }
      console.log(toSend);

      $http({
        method: method,
        url: url,
        data: toSend
      }).
      then((function(i) {
        return function(response) {
          $scope.items[i].pk = response.data.pk;
          Flash.create('success', 'Saved');
        }
      })(i))

    }

  }
  $scope.Submit = function() {
    $http({
      method: 'PATCH',
      url: '/api/performance/timeSheet/' + $scope.timeSheet.pk + '/',
      data: {
        status: 'submitted'
      }
    }).
    then(function(response) {
      $scope.timeSheet = response.data;
      Flash.create('success', 'Submitted');
    })
  }



  //====================popup  calendar for employees




});



//============================================Attendance controller close ==============================
