app.config(function($stateProvider) {

  $stateProvider
    .state('projectManagement.projects', {
        url: "/projects",
        views: {
          "": {
            templateUrl: '/static/ngTemplates/app.projects.html',
          },
          "menu@projectManagement.projects": {
            templateUrl: '/static/ngTemplates/app.projects.menu.html',
            controller: 'projectManagement.projects.menu',
          },
          "@projectManagement.projects": {
            templateUrl: '/static/ngTemplates/app.projects.default.html',
            controller: 'projectManagement.projects.default',
          }
        }
      })
    .state('projectManagement.projects.activities', {
      url: "/activities",
      templateUrl: '/static/ngTemplates/app.GIT.default.html',
      controller : 'projectManagement.GIT.default',
    })
    .state('projectManagement.projects.GITRepos', {
      url: "/GITRepos",
      templateUrl: '/static/ngTemplates/app.GIT.repos.html',
      controller: 'projectManagement.GIT.repos'
    })
    .state('projectManagement.projects.groups', {
      url: "/groups",
      templateUrl: '/static/ngTemplates/app.GIT.groups.html',
      controller: 'projectManagement.GIT.groups'
    })
    .state('projectManagement.projects.devices', {
      url: "/devices",
      templateUrl: '/static/ngTemplates/app.GIT.manage.html',
      controller: 'projectManagement.GIT.manage'
    })
    .state('projectManagement.projects.details', {
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.projects.explore.html',
      controller : 'projectManagement.projects.project.explore',
    })
    .state('projectManagement.projects.details.repo', {
      url: "/repo",
      templateUrl: '/static/ngTemplates/app.GIT.repos.explore.html'
    })
    .state('projectManagement.projects.details.tasks', {
      url: "/tasks",
      templateUrl: '/static/ngTemplates/app.projects.explore.tasks.html',
      controller : 'projectManagement.project.tasks',
    })
    // .state('projectManagement.projects.details.issues', {
    //   url: "/issues",
    //   templateUrl: '/static/ngTemplates/app.projects.explore.issues.html',
    //   controller : 'projectManagement.project.issues',
    // })
    .state('projectManagement.projects.details.files', {
      url: "/files",
      templateUrl: '/static/ngTemplates/app.projects.explore.files.html',
      controller : 'projectManagement.projects.project.explore',
    })
    .state('projectManagement.projects.details.files.explore', {
      url: "/:fileid",
      templateUrl: '/static/ngTemplates/app.projects.explore.wiki.html',
      controller : 'projectManagement.project.wiki',
    }).state('projectManagement.projects.details.team', {
        url: "/team",
        templateUrl: '/static/ngTemplates/app.projects.explore.team.html',
        controller : 'projectManagement.project.team',
      })
    .state('projectManagement.projects.details.wiki', {
      url: "/wiki",
      templateUrl: '/static/ngTemplates/app.projects.explore.wiki.html',
      controller : 'projectManagement.project.wiki',
    })
    .state('projectManagement.projects.details.wiki.explore', {
      url: "/:wikiid",
      templateUrl: '/static/ngTemplates/app.projects.explore.wiki.explore.html',
      controller : 'projectManagement.project.wiki.explore',
    })

});


app.controller('projectManagement.project.team' , function($scope,$state , $users , Flash , $permissions , $http, $aside , $uibModal){

  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/' + '?offset=0&limit=10&username__icontains=' + query).
    then(function(response) {

      return response.data.results;
    })
  };

  $scope.data = {
    teams:'',
    team:[]
  }
  $scope.getProduct = function(){
    $http({method : 'GET' , url : '/api/projects/project/'+$state.params.id+'/'}).
    then(function(response) {
      $scope.data.team = response.data.team
    });
  }
  $scope.getProduct()


  $scope.addTeam= function(){
    if ($scope.data.teams.pk != undefined) {
      for (var i = 0; i < $scope.data.team.length; i++) {
        if ($scope.data.teams.pk == $scope.data.team[i].pk) {
          $scope.data.team.splice(i,1)
          Flash.create('danger','User was already there....')
        }
      }
      $scope.data.team.push($scope.data.teams.pk)
    }
    $scope.save()
    $scope.data.teams =''
  }

  $scope.save = function(){
    $http({
      method:'PATCH',
      url:'/api/projects/project/'+$state.params.id+'/',
      data:
        {
          team:$scope.data.team
      }
    }).then(function(response){

      $scope.data.team = response.data.team

    })
  }

  $scope.removeUser = function(idx){
    $scope.data.team.splice(idx,1)
    $scope.save()
  }



})
app.controller('projectManagement.GIT.repos.explore' , function($scope , $users , Flash , $permissions , $http, $aside , $uibModal){

  $scope.openProperties = function() {

    $aside.open({
      templateUrl: '/static/ngTemplates/app.GIT.form.repo.html',
      size: 'lg',
      placement: 'right',
      backdrop: true,
      resolve: {
        data : function() {
          return $scope.repo;
        },
        projectPk : function() {
          return $scope.project.pk;
        }
      },
      controller: "controller.projectManagement.GIT.repo.modal"
    })
  }



  $scope.createRepo = function() {
    $http({method : 'POST' , url : '/api/git/repo/' , data : {"name":$scope.project.title,"perms":[],"groups":[] , project : $scope.project.pk } }).
    then(function(response) {
      $scope.repo = response.data;
      $scope.$parent.$parent.project.repos.push(response.data)
      $scope.repoPK = response.data.pk
      $scope.repoCreate = false;
      var dataToSend = {
        mode : 'overview',
        repo : newValue.repos[0].pk
      }

      $http({method : 'GET' , url : '/api/git/browseRepo/' , params : dataToSend}).
      then(function(response) {
        $scope.overview = response.data;
        $scope.getLogs()
      });
    })
  }



  $scope.toggleView = function() {
    if ( $scope.mode == 'logs') {
      $scope.mode = 'folder';
    }else{
      $scope.mode = 'logs';
    }
  }

  $scope.changeBranch = function(b) {
    console.log("came  " , b);
    $scope.branchInView = b;
    $scope.getLogs()
  }


  $scope.$watch('$parent.$parent.project', function(newValue , oldValue) {
    if (newValue == undefined) {
      return;
    }
    $scope.project = newValue;
    if (newValue.repos.length == 0) {
      $scope.repoCreate = true;

      return;
    }
    $scope.repo = $scope.repoPK = newValue.repos[0]
    $scope.repoPK = newValue.repos[0].pk
    var dataToSend = {
      mode : 'overview',
      repo : newValue.repos[0].pk
    }

    $http({method : 'GET' , url : '/api/git/browseRepo/' , params : dataToSend}).
    then(function(response) {
      $scope.overview = response.data;
      $scope.getLogs()
    });
  }, true);

  $scope.relPath = '';
  $scope.mode = 'folder';
  $scope.logConfig = {page : 0 , pageSize : 10 , summaryInView : -1};
  $scope.branchInView = 'master';

  $scope.nextLogs = function() {
    $scope.logConfig.page += 1;
    $scope.getLogs()
  }

  $scope.prevLogs = function() {
    $scope.logConfig.page -= 1;
    $scope.getLogs()
  }

  $scope.showCommitSummary = function(index) {
    if ($scope.logConfig.summaryInView == index) {
      $scope.logConfig.summaryInView = -1;
      return;
    }else {
      $scope.logConfig.summaryInView = index;
    }
  }
  $scope.diffConfig = {sha : ''};
  $scope.showCommitDiff = function(index){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.GIT.aside.exploreNotification.html',
      position:'left',
      size : 'xxl',
      backdrop : true,
      resolve : {
        input : function() {
          var toReturn = $scope.logs[index];
          toReturn.repo = $scope.repo;
          toReturn.sha = toReturn.id;
          toReturn.branch = $scope.branchInView;
          return toReturn;
        }
      },
      controller : 'projectManagement.GIT.exploreNotification',
    })


  }

  $scope.getLogs = function() {
    $scope.logConfig.summaryInView = -1;
    params = {
      mode : 'commits',
      repo : $scope.repoPK,
      page : $scope.logConfig.page,
      limit : $scope.logConfig.pageSize,
      branch : $scope.branchInView
    }
    $http({method : 'GET' , url : '/api/git/browseRepo/' , params : params }).
    then(function(response) {
      $scope.logs = response.data;
      for (var i = 0; i < $scope.logs.length; i++) {
        $scope.logs[i].date = new Date($scope.logs[i].date)
      }
      if ($scope.mode == 'folder') {
        $scope.shaInView = response.data[0].id;
        $scope.fetchFileList()
      }
    });
  }
  $scope.getDiff = function(index) {
    params = {
      repo : $scope.repoPK,
      sha : $scope.logs[index].id,
      mode : 'diff',
    }
    $http({method : 'GET' , url : '/api/git/browseRepo/' , params : params }).
    then(function(response) {
      $scope.commit = response.data;
      console.log($scope.diffs);
    }, function(response) {
      // $scope.getLogs()
    })
  }

  $scope.navigateViaBreadcrumb = function(i) {
    if (i == -1) {
      $scope.relPath = '';
    }else {
      $scope.relPath = $scope.relPath.split(i)[0] + i;
    }
    $scope.fetchFileList()
  }

  $scope.fileInView = {name : '' , content : '' , size : 0}

  $scope.exploreSpecific = function(f) {
    if (f.isDir) {
      if ($scope.relPath.length > 0) {
        $scope.relPath += '/';
      }
      $scope.relPath += f.name ;
      if (f.name == '.') {
        $scope.relPath = '';
      }else if (f.name == '..') {
        parts = $scope.relPath.split('/')
        $scope.relPath = '';
        for (var i = 0; i < parts.length-2; i++) {
          $scope.relPath += parts[i];
          if (i != parts.length-3) {
            $scope.relPath += '/';
          }
        }
      }
      $scope.fetchFileList()
    }else {
      $scope.mode = 'file';
      name = $scope.relPath + '/'+ f.name;
      dataToSend = {
        repo : $scope.repoPK,
        relPath : $scope.relPath,
        name : f.name,
        mode : 'file',
        sha : $scope.shaInView,
      }

      $http({method : 'GET' , url : '/api/git/browseRepo/' , params : dataToSend}).
      then(function(response) {
        $scope.fileInView = response.data;
      });
    }
  }

  $scope.fetchFileList = function() {
    $scope.mode = 'folder';
    dataToSend = {
      repo : $scope.repoPK,
      relPath : $scope.relPath,
      mode : 'folder',
      sha : $scope.shaInView ,
    }
    $http({method : 'GET' , url : '/api/git/browseRepo/' , params : dataToSend}).
    then(function(response) {
      $scope.files = response.data;
      for (var i = 0; i < $scope.files.length; i++) {
        $scope.files[i].lastModified = new Date($scope.files[i].lastModified)
      }
    })
  }

  // $scope.fetchFileList()

});



app.controller('projectManagement.project.wiki', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {

  $scope.$watch('$parent.project', function(newValue , oldValue) {
    if (newValue == undefined) {
      return;
    }
    $scope.project = $scope.$parent.project

  }, true);

  $scope.openCreateNote = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.createNote.html',
      size: 'md',
      backdrop: true,
      controller: function($scope, $uibModalInstance) {

        $scope.form = {
          title : ''
        }

        $scope.saveNote = function() {
          var dataToSend = {
            title : $scope.form.title,
            project:$state.params.id
          }

          $http({
            method: 'POST',
            url: '/api/PIM/notes/',
            data: dataToSend
          }).
          then(function(response) {
            $uibModalInstance.dismiss();
            Flash.create('success', 'Note created')
          })
        }
      },
    }).result.then(function() {
      $scope.getNotes()
    }, function() {
      $scope.getNotes()
    });

  }

  $scope.form = {
    search : '',
    page : 1
  }

  $scope.row = 0

  $scope.getIndex = function(idx){
    $scope.row = idx
  }


  $scope.notes = []

  $scope.getNotes = function(){
    var url = '/api/PIM/notesTitle/'

    url = url + '?title__icontains=' + $scope.form.search + '&limit=10&offset=0'

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.notes = response.data.results

      if ($state.is('home.notes')) {
        $state.go('home.notes.view' , {id : $scope.notes[0].pk})
      }
    })
  }
  $scope.getNotes()


  $scope.loadMore = function(){
    var url = '/api/PIM/notesTitle/'

    url = url + '?title__icontains=' + $scope.form.search + '&limit=10&offset=' + 10*$scope.form.page

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      var notes = response.data.results;
      for (var i = 0; i < notes.length; i++) {
        $scope.notes.push(notes[i])
      }
      $scope.form.page += 1;
      if ($state.is('home.notes')) {
        $state.go('home.notes.view' , {id : $scope.notes[0].pk})
      }
    })
  }


})
app.controller('projectManagement.project.wiki.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {

  $scope.getNoteData = function(){
    $http({
      method: 'GET',
      url: '/api/PIM/notes/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.noteData = response.data

    })
  }
  $scope.getNoteData()


  $scope.save = function() {

    var url =  '/api/PIM/notes/' + $state.params.id + '/'
    if ($scope.noteData) {
      $http({method : 'PATCH' , url : url , data :{source : $scope.noteData.source} }).
      then(function(response) {
        Flash.create('success', 'Source Updated')
      })
    } else {
      Flash.create('warning', 'Add Source Data')
    }
  }

  $scope.share = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.shareNote.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return data;
        },
      },
      controller: function($scope, $uibModalInstance, data) {
        $scope.data = data;

        $scope.userSearch = function(query) {
          return $http.get('/api/HR/userSearch/?username__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.close = function(){
          $uibModalInstance.close();
        }

        $scope.getSharedUsers = function(){
          $http({
            method: 'GET',
            url: '/api/PIM/notes/' + $scope.data.pk + '/',
          }).
          then(function(response) {
            console.log(response.data);
            $scope.usersList = response.data.shares
          })
        }
        $scope.getSharedUsers()

        $scope.form = {
          users : ''
        }

        $scope.addUsers = function(){
          $scope.data.shares.push($scope.form.users)
          $scope.form.users = ''
        }


        $scope.removeUser = function(indx) {
          $scope.data.shares.splice(indx, 1)
        }

        $scope.saveNote = function() {

          var dataToSend = {
            shares : $scope.data.shares
          }

          $http({
            method: 'PATCH',
            url: '/api/PIM/notes/' + $scope.data.pk + '/',
            data: dataToSend
          }).
          then(function(response) {
            $scope.sharedUsers = response.data.shares
            Flash.create('success', 'Note Shared')
            $uibModalInstance.dismiss();

          })
        }
      },
    }).result.then(function() {
    }, function() {
      $scope.getNotes()
    });
  }


})


app.controller('projectManagement.project.issues', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {


  $scope.openIssueForm = function() {
    console.log('inside open function');
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.projects.issuesform.html',
      // placement: 'left',
      size: 'md',
      backdrop: true,
      resolve: {
        project: function() {
          return $scope.$parent.project;
        }
      },
      controller: 'projectManagement.project.issues.form'
    }).result.then(function(d) {
      $scope.fetchIssues()
    }, function(d) {
      $scope.fetchIssues()
    });

  }
  $scope.fetchIssues = function(data) {
    console.log('------------', $scope.project.pk);
    var params = {project : $scope.project.pk}
    if (!$scope.project.showOngoing) {
      params.result = 'null';
    }

    $http({
      method: 'GET',
      url: '/api/projects/issue/' ,
      params : params
    }).
    then(function(response) {
      $scope.issues = response.data;
      console.log($scope.issues);
    })
  }


  $scope.$watch('$parent.project', function(newValue , oldValue) {
    if (newValue == undefined) {
      return;
    }
    $scope.project = $scope.$parent.project
    $scope.fetchIssues()

  }, true);

})

app.controller('projectManagement.project.tasks', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $interval) {

  $scope.getPeopleTextRaw = function(item) {
             return '@' + item.username;
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

   $scope.fetchTasks = function() {
     var dt = new Date();
     var params = {}
     params.project = $scope.$parent.project.pk;


     $http({method : 'GET' , url : '/api/taskBoard/task/?filterBy=team' , params : params}).
     then(function(response) {
       $scope.tasks = response.data;
       for (var i = 0; i < $scope.tasks.length; i++) {
         if ($scope.tasks[i].timerStartedAt) {
           $scope.tasks[i].timerStartedAt = new Date($scope.tasks[i].timerStartedAt);
         }
       }
     })
   }

   console.log($scope.$parent);

   $scope.$watch('$parent.project', function(newValue , oldValue) {
     if (newValue == undefined) {
       return;
     }
     $scope.fetchTasks()

   }, true);


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

   $scope.addNewSubTask = function(indx , newSubTasksSeries) {

     console.log(indx , newSubTasksSeries);

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
     fd.append('project' , $scope.$parent.project.pk )
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

  $scope.updateTaskTitle = function(pk , txt) {
    $http({method : 'PATCH' , url : '/api/taskBoard/task/' + pk  + '/' , data : {title : txt}}).
    then(function(response) {

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


  $scope.openFile = function(file) {
    window.open(file.attachment , '_blank');
  }


  $interval(function() {
    for (var i = 0; i < $scope.tasks.length; i++) {
      if ($scope.tasks[i].timerStartedAt != null) {
        $scope.tasks[i].timerStr = diff_human_readable(new Date(), $scope.tasks[i].timerStartedAt , $scope.tasks[i].timeSpent)
      }
    }
  },1000)

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


  $scope.updateSubTaskTitle = function(pk , txt) {
    $http({method : 'PATCH' , url : '/api/taskBoard/subTask/' + pk  + '/' , data : {title : txt}}).
    then(function(response) {

    })
  }

});

var parseNotifications = function(notifications) {
    if (typeof notifications == 'undefined' || notifications.length==0) {
        return [];
    }
    var d = new Date(notifications[0].time);
    notifications[0].dateShow = true;
    notifications[0].time = d;
    for (var i = 1; i < notifications.length; i++) {
        var d2 = new Date(notifications[i].time);
        notifications[i].time = d2;
        if (d.getDate()!= d2.getDate() || d.getMonth()!= d2.getMonth() || d.getFullYear() != d2.getFullYear() ) {
          notifications[i].dateShow = true;
          d = d2;
        }else {
          notifications[i].dateShow = false;
        }
    }
    return notifications;
};




app.controller('projectManagement.projects.project.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  if ($state.is('projectManagement.projects.details')) {
    $state.go('projectManagement.projects.details.wiki')
  }
  // projectManagement.projects.details.wiki
  $scope.form = {
    icon: emptyFile,
    file: emptyFile,
  }

  $scope.viewFile = function(file, idx){
    console.log(file, idx);
    $scope.image = file.attachment
    $scope.type = idx
    $scope.text = 'Initial Project Proposal'
    $scope.size = '3 MB'
  }

  $scope.$watch('form.file', function(newValue, oldValue) {
    if (typeof newValue == 'object') {

      var fd = new FormData();
      if (newValue != emptyFile && newValue != null && typeof newValue!='string') {
        fd.append('files', newValue)
        fd.append('type', newValue.type)
      }

      $http({
        method: 'PATCH',
        url: '/api/projects/project/' + $state.params.id + '/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.getallProjects()

      })
    }
  })

  $scope.$watch('project.icon', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      // show the preview and save the logo
      // logo
      var fd = new FormData();
      if (newValue != emptyFile && newValue != null && typeof newValue!='string') {
        fd.append('icon', newValue)
      }
      $http({
        method: 'PATCH',
        url: '/api/projects/project/' + $state.params.id + '/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.project.icon = response.data.icon;
      })
    }
  })


  $scope.getallProjects = function(){
    $http({
      method: 'GET',
      url: '/api/projects/project/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.project = response.data;
      var fileLength = $scope.project.files.length
      console.log(fileLength);
      if (fileLength >= 6) {
        $scope.fiveBoxes = $scope.project.files.splice(5, fileLength)
      }
      $scope.project.messages = [];
      for (var i = 0; i < $scope.project.repos.length; i++) {
        $scope.project.repos[i].page = 0;
        $scope.project.repos[i].rawCommitNotifications = []
        $scope.fetchNotifications(i);
      }
      $scope.fetchTasks();
      $http({
        method: 'GET',
        url: '/api/projects/timelineItem/?category=message&project=' + $state.params.id
      }).
      then(function(response) {
        $scope.project.messages = response.data;
      })
      $scope.mode = 'view';

      $scope.fetchTimesheetItems();
      $scope.fetchIssues();
    });
  }

  $scope.getallProjects()



  $scope.fetchNotifications = function(index) {
    // takes the index of the repo for which the notifications is to be fetched
    $http({
      method: 'GET',
      url: '/api/git/commitNotification/?limit=10&offset=' + $scope.project.repos[index].page * 5 + '&repo=' + $scope.project.repos[index].pk
    }).
    then((function(index) {
      return function(response) {
        $scope.project.repos[index].commitCount = response.data.count;
        $scope.project.repos[index].rawCommitNotifications = $scope.project.repos[index].rawCommitNotifications.concat(response.data.results);
        $scope.project.repos[index].commitNotifications = parseNotifications($scope.project.repos[index].rawCommitNotifications);
      }
    })(index));
  }

  $scope.mode = 'new';

  $scope.fetchTasks = function() {
    $http({
      method: 'GET',
      url: '/api/taskBoard/task/?project=' + $state.params.id
    }).
    then(function(response) {
      $scope.project.tasks = response.data;
    });
  }



  $scope.createTask = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.taskBoard.createTask.html',
      controller: 'projectManagement.taskBoard.createTask',
      position: 'left',
      size: 'xl',
      backdrop: true,
      resolve: {
        project: function() {
          return $scope.project.pk;
        }
      }
    }).result.then(function() {}, function() {
      console.log("create task1");
      $scope.fetchTasks();
    });
  }

  $scope.loadMore = function(index) {
    $scope.project.repos[index].page += 1;
    $scope.fetchNotifications(index);
  }

  $scope.exploreNotification = function(repo, commit) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.GIT.aside.exploreNotification.html',
      position: 'left',
      size: 'xxl',
      backdrop: true,
      resolve: {
        input: function() {
          return $scope.project.repos[repo].commitNotifications[commit];
        }
      },
      controller: 'projectManagement.GIT.exploreNotification',
    })
  }

  $scope.explore = {
    mode: 'git',
    addFile: false
  };

  $scope.updateFiles = function() {
    if (!$scope.explore.addFile) {
      return;
    }
    var pks = [];
    for (var i = 0; i < $scope.project.files.length; i++) {
      pks.push($scope.project.files[i].pk);
    }
    var dataToSend = {
      files: pks
    }
    $http({
      method: 'PATCH',
      url: '/api/projects/project/' + $scope.project.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
    });
  }

  $scope.changeExploreMode = function(mode) {
    $scope.explore.mode = mode;
  }

  $scope.objectives= [];
  $scope.saveProjectObjective = function() {

    var toSend = {
      details : $scope.objectiveTxt,
      parent : $scope.project.pk
    }

    $http({method : 'POST' , url : '/api/projects/projectObjective/?parent=' + $scope.project.pk , data : toSend}).
    then(function(response) {
      $scope.objectives.push(response.data);
      $scope.objectiveTxt = "";
    })
  }



  $scope.fetchTimesheetItems = function(data) {
    $http({
      method: 'GET',
      url: '/api/performance/projectCost/?project=' + $scope.project.pk,
    }).then(function(response) {
      $scope.timesheetItems = response.data;
      $scope.totalTime = 0;
      for (var i = 0; i < $scope.timesheetItems.length; i++) {
        $scope.totalTime += $scope.timesheetItems[i].time;
      }

      $scope.totalTime = $scope.totalTime/60;
    })



    $http({
      method: 'GET',
      url: '/api/performance/projectContribution/?project=' + $scope.project.pk,
    }).
    then(function(response) {
      $scope.teamMembers = response.data;
    })
    $http({method : 'GET' , url : '/api/projects/projectObjective/?parent=' + $scope.project.pk }).
    then(function(response) {
      $scope.objectives = response.data;
    })

  }

  $scope.fetchIssues = function(data) {
    console.log('------------', $scope.project.pk);
    $http({
      method: 'GET',
      url: '/api/projects/issue/?project=' + $scope.project.pk,
    }).
    then(function(response) {
      $scope.issues = response.data;
      console.log($scope.issues);
    })
  }

  //=====================================================



  $scope.opencomments = function() {
    console.log('inside coomments');
  }

  $scope.setStatus = function(pk, status) {
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
        $scope.fetchIssues()
      }, function(d) {
        $scope.fetchIssues()
      });
    }
  }

  $scope.showDetails =function (id) {
    console.log('showwwwwwwwwwwwwing detail.............',id);
    $aside.open({
      templateUrl: '/static/ngTemplates/app.projects.issueDetails.html',
      placement: 'right',
      size: 'md',
      backdrop: true,
      resolve: {
        project: function() {
          return $scope.project;
        }
      },
      controller: function($scope){
          console.log(id,'------this issue');
          $http({
            method: 'GET',
            url: '/api/projects/issue/' + id ,
          }).
          then(function(response) {
            $scope.details = response.data;
          })
        }


    }) //-modal ends

  }





});

//------------------------------------------------------------------------------------------------
app.controller('projectManagement.project.issues.form', function($scope, $state, $users, $http, Flash, $timeout, $uibModal, $filter,  project,$uibModalInstance) {

  window.addEventListener("paste", function(thePasteEvent){
      var items = thePasteEvent.clipboardData.items;

      $scope.form.file = thePasteEvent.clipboardData.items[0].getAsFile();

      var newValue = $scope.form.file;
      $scope.reader = new FileReader();

      console.log(newValue);
      if (typeof newValue != 'object' || newValue == null || newValue == emptyFile ) {
        $('#imgPreview').attr('src', "");
        return;
      }

      $scope.reader.onload = function(e) {
        $('#imgPreview')
          .attr('src', e.target.result);
      }

      $scope.reader.readAsDataURL(newValue);

  }, false);


  $scope.reset = function() {
    $scope.today = new Date()
    dayAftTom = new Date($scope.today.setDate($scope.today.getDate()+2))
    $scope.form = {
      'title': '',
      'project': project.pk,
      'responsible': '',
      'tentresdt': dayAftTom,
      'priority': 'low',
      'file' : emptyFile,
      'description' : ''
    }
  }
  $scope.reset();


  $scope.save = function() {
    if ($scope.form.responsible == null || $scope.form.responsible.length == 0) {
      Flash.create('warning', 'Please Mention Responsible Person Name')
      return
    }
    var method = 'POST'
    var Url = '/api/projects/issue/'
    var fd = new FormData();
    console.log($scope.form.file);
    if ($scope.form.file != emptyFile) {
      fd.append('file', $scope.form.file)
    }
    fd.append('title', $scope.form.title);
    fd.append('project', $scope.form.project);
    fd.append('responsible', $scope.form.responsible.pk);
    fd.append('tentresdt', $scope.form.tentresdt.toJSON().split('T')[0]);
    fd.append('priority', $scope.form.priority);
    fd.append('description', $scope.form.description);
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
      $uibModalInstance.dismiss(response.data);
    });
  }
  $scope.userSearch = function(query) {
    //search for the user
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  }

});


//-------------------------------------------------------------------------------------------------------------------------------------------
app.controller('projectManagement.project.item', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  $scope.me = $users.get('mySelf');

});

app.controller('projectManagement.project.modal.project', function($scope, $http, $aside, $state, Flash, $users, $filter ){

  $scope.save = function() {
    var dataToSend = {
      description: $scope.data.description,
      dueDate: $scope.data.dueDate,
      team: $scope.data.team,
    }
    $http({
      method: 'PATCH',
      url: '/api/projects/project/' + $scope.data.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
    })
  }

});
app.controller('projectManagement.projects.new', function($scope, $http, $aside, $state, Flash, $users, $filter, $permissions , $uibModalInstance) {


$scope.getCC = function(){
  $http.get('/api/finance/costCenter/').
  then(function(response) {
    $scope.costcenters = response.data
  })
}
$scope.getCC()
  $scope.ccSearch = function(query) {
    return $http.get('/api/finance/costCenter/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.resetForm = function() {
    $scope.form = {
      title: '',
      dueDate: new Date(),
      costCenter: '',
      company: '',
      description: '',
      team: []
    };
    $scope.data = {
      files: []
    };
  };
  $scope.resetForm();


  $scope.getProjects  = function(){
    $http.get('/api/projects/project/').
    then(function(response) {
      $scope.projects = response.data
    })
  }

  $scope.postProject = function() {
    if ($scope.form.title.length==0) {
      Flash.create('warning', 'Please Select The Title');
      return;
    }
    // if ($scope.form.costCenter.length==0 || $scope.form.costCenter.pk==undefined) {
    //   Flash.create('warning', 'Please Select Proper Cost Center');
    //   return;
    // }
    if ($scope.form.company==null || $scope.form.company.length==0 || $scope.form.company.pk==undefined) {
      Flash.create('warning', 'Please Select Proper Company');
      return;
    }
    var dataToSend = $scope.form;
    dataToSend.costCenter = $scope.form.costCenter.pk;
    dataToSend.company = $scope.form.company.pk;
    dataToSend.files = []
    for (var i = 0; i < $scope.data.files.length; i++) {
      dataToSend.files.push($scope.data.files[i].pk)
    }
    $http({
      method: 'POST',
      url: '/api/projects/project/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Project created')
      $uibModalInstance.dismiss()
      $scope.getProjects()
      $scope.resetForm();
    });
  };


  $scope.close = function() {
    $uibModalInstance.dismiss();
  }

});



app.controller('projectManagement.projects.default', function($scope, $http, $aside, $state, Flash, $users, $filter ){

  $scope.create = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.projects.new.html',
      size: 'lg',
      placement: 'right',
      backdrop: true,
      controller : 'projectManagement.projects.new'
    })

  }

  $scope.searchForm = {
    searchValue: ''
  }
  $scope.limit = 5
  $scope.offset = 0
  $scope.getallProjects = function() {
    var url = '/api/projects/project/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.searchForm.searchValue.length > 0) {
      url += '&title__icontains=' + $scope.searchForm.searchValue
    }
    $http({
      method: 'GET',
      url: url
    }).then(function(response) {
      $scope.projects = response.data.results
      $scope.Prevprojects = response.data.previous
      $scope.Nextprojects = response.data.next
    })
  }
  $scope.getallProjects()

  $scope.prevProj = function() {
    if ($scope.Prevprojects != null) {
      $scope.offset -= $scope.limit
      $scope.getallProjects()
    }
  }
  $scope.nextProj = function() {
    if ($scope.Nextprojects != null) {
      $scope.offset += $scope.limit
      $scope.getallProjects()
    }
  }


  $scope.data = {
    tableData: []
  };
  var views = [{
    name: 'list',
    icon: 'fa-bars',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.projects.item.html',
  }, ];

  $scope.projectsConfig = {
    views: views,
    url: '/api/projects/project/',
    editorTemplate: '/static/ngTemplates/app.projects.form.project.html',
    searchField: 'title',
    itemsNumPerView: [6, 12, 24],
    multiselectOptions : [{icon : 'fa fa-plus' , text : 'Create New Project' }],
  }



  $scope.viewProject = function(target) {
    $state.go('projectManagement.projects.details' , {id : target.pk})
  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
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


app.controller('projectManagement.projects.menu', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  // settings main page controller

  var getState = function(input) {
    var parts = input.name.split('.');
    // console.log(parts);
    return input.name.replace('app', 'projectManagement')
  }

  $scope.apps = [];

  $scope.buildMenu = function(apps) {
    for (var i = 0; i < apps.length; i++) {
      var a = apps[i];
      var parts = a.name.split('.');
      if (a.module != 10 || parts.length != 3 || parts[1] != 'projects') {
        continue;
      }
      a.state = getState(a)
      a.dispName = parts[parts.length - 1];
      $scope.apps.push(a);
    }
  }

  $scope.isActive = function(index) {
    var app = $scope.apps[index]
    if (angular.isDefined($state.params.app)) {
      return $state.params.app == app.name.split('.')[2]
    } else {
      return $state.is(app.name.replace('app', 'projectManagement'))
    }
  }


});


app.controller('controller.projectManagement.GIT.repo.modal' , function($scope ,$http, $users , Flash , $permissions , data , projectPk){

  $scope.data = data;

  $scope.mode = 'edit';

  $http({method : 'GET' , url : '/api/git/repo/' + $scope.data.pk + '/'   }).
  then(function(response) {
    $scope.data = response.data;
    $http({method : 'GET' , url : '/api/projects/project/' + projectPk + '/'}).
    then(function(response) {
        $scope.data.project = response.data;
    });
  })







  $scope.objectSearch = function(query) {
    if ($scope.data.permMode == 'individual') {
      url = '/api/HR/userSearch/?username__contains=' ;
    }else {
      url = '/api/git/gitGroup/?name__contains='
    }
    return $http.get(url + query).
    then(function(response){
      return response.data;
    })
  };
  $scope.getName = function(u) {
    if (typeof u == 'undefined') {
      return '';
    }
    if ($scope.data.permMode == 'individual') {
      return u.first_name + '  ' +u.last_name;
    }else {
      return u.name;
    }
  }
  $scope.data.permMode = 'individual';
  $scope.resetCheckboxes = function() {
    $scope.data.canRead = false;
    $scope.data.canWrite = false;
    $scope.data.canDelete = false;
    $scope.data.limited = false;
  };

  $scope.resetCheckboxes();

  $scope.data.editorIndex = -1;
  $scope.data.editorMode = 'individual';

  $scope.editPerm = function(index) {
    $scope.data.editorIndex = index;
    $scope.data.editorMode = 'individual';
  }

  $scope.savePerm = function(index) {
    dataToSend = {
      canRead : $scope.data.perms[index].canRead,
      canWrite : $scope.data.perms[index].canWrite,
      canDelete : $scope.data.perms[index].canDelete,
      limited : $scope.data.perms[index].limited,
    }
    $http({method : 'PATCH' , url : '/api/git/repoPermission/' + $scope.data.perms[index].pk + '/' , data : dataToSend}).
    then(function(response) {
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.data.editorIndex = -1;
    }, function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    })
  }

  $scope.editGroup = function(index) {
    $scope.data.editorMode = 'group';
    $scope.data.editorIndex = index;
  }

  $scope.saveGroup = function(index) {
    var dataToSend = {
      canRead : $scope.data.groups[index].canRead,
      canWrite : $scope.data.groups[index].canWrite,
      canDelete : $scope.data.groups[index].canDelete,
      limited : $scope.data.groups[index].limited,
    };
    $http({method : 'PATCH' , url : '/api/git/groupPermission/' + $scope.data.groups[index].pk + '/' , data : dataToSend}).
    then(function(response) {
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.data.editorIndex = -1;
    }, function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    });
  };

  $scope.projectSearch = function(query) {
    return $http.get('/api/projects/project/?title__contains=' + query).
    then(function(response){
      return response.data;
    })
  }

  $scope.save = function() {
    var url = '/api/git/repo/'
    if ($scope.mode == 'new') {
      method = 'POST';
    }else {
      method = 'PATCH';
      url += $scope.data.pk + '/';
    }
    var perms = []
    for (var i = 0; i < $scope.data.perms.length; i++) {
      perms.push($scope.data.perms[i].pk)
    }
    var groups = []
    for (var i = 0; i < $scope.data.groups.length; i++) {
      groups.push($scope.data.groups[i].pk)
    }

    var dataToSend = {
      name : $scope.data.name,
      description : $scope.data.description,
      perms : perms,
      groups : groups,
    };
    if (typeof $scope.data.project != 'undefined' && $scope.data.project != null) {
        dataToSend.project = $scope.data.project.pk;
    };
    $http({method : method , url : url , data : dataToSend}).
    then(function(response) {
      Flash.create('success' , response.status + ' : ' + response.statusText);
      $scope.mode = 'edit';
      $scope.data.pk = response.data.pk;
    }, function(response){
      Flash.create('danger' , response.status + ' : ' + response.statusText);
    })


  }

  $scope.deletePerm = function(index) {
    $http({method : 'DELETE' , url : '/api/git/repoPermission/' + $scope.data.perms[index].pk + '/' }).
    then((function(index) {
      return function(response) {
        $scope.data.perms.splice(index,1);
      }
    })(index));
  }
  $scope.deleteGroup = function(index) {
    $http({method : 'DELETE' , url : '/api/git/groupPermission/' + $scope.data.groups[index].pk + '/' }).
    then((function(index) {
      return function(response) {
        $scope.data.groups.splice(index,1);
      }
    })(index));
  }

  $scope.addPermission = function() {
    var dataToSend = {
      user : $scope.data.object.pk,
      canRead : $scope.data.canRead,
      canWrite : $scope.data.canWrite,
      canDelete : $scope.data.canDelete,
      limited : $scope.data.limited,
    }
    if ($scope.data.permMode == 'individual') {
      for (var i = 0; i < $scope.data.perms.length; i++) {
        if ($scope.data.perms[i].user == $scope.data.object.pk){
          Flash.create('danger' , 'User already a member of this Repo')
          return;
        }
      }
      $http({method : 'POST' , url : '/api/git/repoPermission/' , data : dataToSend }).
      then(function(response) {
        $scope.data.perms.push(response.data);
        $scope.data.object = undefined;
        $scope.resetCheckboxes();
        $scope.save();
      })
    }else {
      for (var i = 0; i < $scope.data.groups.length; i++) {
        if ($scope.data.groups[i].pk == $scope.data.object.pk){
          Flash.create('danger' , 'Group already a member of this Repo')
          return;
        }
      };
      var dataToSend = {
        group : $scope.data.object.pk,
        canRead : $scope.data.canRead,
        canWrite : $scope.data.canWrite,
        canDelete : $scope.data.canDelete,
      };
      $http({method : 'POST' , url : '/api/git/groupPermission/' , data : dataToSend}).
      then(function(response) {
        $scope.data.groups.push(response.data);
        $scope.data.object = undefined;
        $scope.resetCheckboxes();
        $scope.save();
      });

    }
  }
});
