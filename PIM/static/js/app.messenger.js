  app.controller("controller.messenger.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout) {

    $scope.me = $users.get('mySelf')

    $scope.user = $users.get(parseInt($state.params.id))


    $scope.form = {
      text: '',
      search: '',
      file: emptyFile
    }



    $scope.openFilePicker = function() {
      $('#filePicker').click();
    }



    function onevent(args) {
          console.log("Event:", args[0]);
       }

    $scope.send = function() {
      if ($scope.form.text.length == 0 && $scope.form.file == emptyFile) {
        return;
      }

      // var toSend = {
      //   message : $scope.form.text,
      //   user : $state.params.id
      // }

      var toSend = new FormData()
      toSend.append('message', $scope.form.text)
      toSend.append('user', $state.params.id)
      if ($scope.form.file != emptyFile) {
        toSend.append('attachment', $scope.form.file)
      }

      $http({
        method: 'POST',
        url: '/api/PIM/chatMessage/',
        data: toSend,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.messages.push(response.data)
        $scope.form.text = '';
        $scope.form.file = emptyFile;
        var objDiv = document.getElementById("scrollView");
         objDiv.scrollTop = objDiv.scrollHeight+40;
        // connection.session.subscribe('service.chat.' + $scope.user.username ,  onevent);
        // connection.session.publish('service.chat.' + $scope.user.username, ['M', response.data]);
      })

    }

    window.addEventListener("message", function(event) {
      console.log(event.data);
      if (event.data[0] == 'M') {
        $scope.messages.push(event.data[1]);
        $scope.$apply();
      }
    }, false);

    $scope.call = function(number) {
      $rootScope.$broadcast("call", {
        type: 'call',
        number: number
      });
    }

    $scope.messages = [

    ]


    $scope.getMessages = function() {
      $http({
        method: 'GET',
        url: '/api/PIM/chatMessageBetween/?other=' + $state.params.id
      }).
      then(function(response) {
        $scope.messages = response.data

         $timeout(function() {
           var objDiv = document.getElementById("scrollView");
           objDiv.scrollTop = objDiv.scrollHeight+40;

         },500)
      })

    }
    $scope.getMessages()

    $scope.getThread = function() {
      $http({
        method: 'GET',
        url: '/api/PIM/chatThreads/' + $state.params.id
      }).
      then(function(response) {
        $scope.user = response.data
        $scope.user.is_show = false
      })
    }
    $scope.getThread()

    $scope.editThread = function(typ) {

      if (typ == 'title') {
        var data = {
          title: $scope.user.name
        }
      }
      else{
        var data = {
          description: $scope.user.description
        }
      }
      $http({
        method: 'PATCH',
        url: '/api/PIM/chatThreads/' + $state.params.id + '/',
        data: data
      }).
      then(function(response) {
        if (typ == 'title') {
          $scope.showInput = false
        }
        else{
          $scope.description = false
        }
      })
    }
    $scope.addParticipants = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.PIM.addparticipants.html',
        size: 'sm',
        backdrop: true,
        controller: function($scope, $uibModalInstance, $http, $state) {
          $scope.close = function() {
            $uibModalInstance.dismiss()
          }
          $scope.getallUsers = function() {
            $http({
              method: 'GET',
              url: '/api/HR/userSearch/'
            }).
            then(function(response) {
              $scope.allUsers = response.data
              for (var i = 0; i < $scope.allUsers.length; i++) {
                $scope.allUsers[i].add = false
              }
            })
          }
          $scope.getallUsers()
          $scope.form = {
            participants: []
          }
          $scope.data = []
          $scope.adduser = function(indx) {
            if ($scope.allUsers[indx].add == true) {

              $scope.form.participants.push($scope.allUsers[indx].pk)
              $scope.data.push($scope.allUsers[indx])
            }
            $scope.form.participants.splice(indx, 1)
            $scope.data.splice(indx, 1)

          }
          $scope.save = function() {

            $http({
              method: 'PATCH',
              url: '/api/PIM/chatThreads/' + $state.params.id + '/',
              data:$scope.form
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)
            })
          }


        }

      }).result.then(function(data) {

      }, function(data) {
          $scope.getThread()
          $scope.user.is_show = false
      });
    }


  $scope.createChatThread = function(k){
    console.log(k,'99000');
    var data ={
      user:k.pk,
      title:k.first_name,
      company:k.division
    }
    $http({
      method: 'POST',
      url: '/api/PIM/chatThreads/',
      data:data
    }).then(function(response) {

    })
  }

$scope.showInput = false
  $scope.viewDetails = function(){
    $scope.showInput = true
  }

$scope.description = false
  $scope.viewDescription = function(){
      $scope.description = true
  }

  // $scope.saveTitle = function(){
  //   $http({
  //     method: 'PATCH',
  //     url: '/api/PIM/chatThreads/' + $state.params.id + '/',
  //     data:{
  //       title:$scope.user.title
  //     }
  //   }).
  //   then(function(response) {
  //       $scope.showInput = false
  //   })
  // }


  // $scope.$watch('user.dp', function(newValue, oldValue) {
  //   console.log("ddddddddddddddddddddddddddddd", newValue);
  //   if (typeof newValue == 'object') {
  //
  //     // var fd = new FormData();
  //     // if (newValue != emptyFile && newValue != null && typeof newValue!='string') {
  //     //   fd.append('logo', newValue)
  //     // }
  //     // $http({
  //     //   method: 'PATCH',
  //     //   url: '/api/organization/divisions/' + $scope.division.pk + '/',
  //     //   data: fd,
  //     //   transformRequest: angular.identity,
  //     //   headers: {
  //     //     'Content-Type': undefined
  //     //   }
  //     // }).
  //     // then(function(response) {
  //     //   $scope.division.logo = response.data.logo;
  //     // })
  //   }
  // })

  $scope.fileNameChanged = function(file) {
      // console.log("select file",$scope.data.image,file[0]);
      var filedata = file[0]
      var typ = filedata['type'].split('/')[0]
      var fd = new FormData();
      if (filedata != null && filedata != emptyFile) {
        fd.append('dp', filedata)
      }
      $http({
        method: 'PATCH',
        url: '/api/PIM/chatThreads/'+$scope.user.pk+'/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.user.dp = response.data.dp
      })
    }


  });

  app.controller("controller.messenger", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $scope.showUsers = 'chats'
  $scope.me = $users.get('mySelf');

    $scope.form = {
      searchTxt: ''
    }

    // $scope.getUsers = function() {
    //   console.log("called");
    //   var params = {}
    //
    //   if ($scope.form.searchTxt.length > 0) {
    //     params.search = $scope.form.searchTxt
    //   }
    //
    //   $http({
    //     url: '/api/PIM/getChatThreads/',
    //     method: 'GET',
    //     params: params
    //   }).then(function(response) {
    //     $scope.users = response.data;
    //   })
    // }
    //
    // $scope.getUsers();


    $scope.getAllUsers = function() {
      var params = {}

      if ($scope.form.searchTxt.length > 0) {
        params.search = $scope.form.searchTxt
      }

      $http({
        url: '/api/HR/userSearch/',
        method: 'GET',
        params: params
      }).then(function(response) {
        $scope.allUsers = response.data;
      })
    }

    $scope.getAllUsers();



    $scope.getChatthreads = function() {
      $http({
        method: 'GET',
        url: '/api/PIM/chatThreads/'
      }).
      then(function(response) {
        $scope.chatthreads = response.data
        if ($scope.chatthreads.length > 0) {
          if ($state.is('home.messenger')) {
            $state.go('home.messenger.explore',{id:$scope.chatthreads[0].pk})
          }

        }
      })

    }
    $scope.getChatthreads()


  $scope.startnewChat = function(indx){
    $http({
      method: 'POST',
      url: '/api/PIM/createNewChat/',
      data:{
          participant:$scope.allUsers[indx].pk
      }
    }).
    then(function(response) {
      $scope.getChatthreads()
      $scope.showUsers = 'chats'
      $state.go('home.messenger.explore',{id:response.data.pk})
    })
  }


  $scope.changeType = function(typ){
    $scope.showUsers = typ
    if (typ!='groupDetails' && typ!='group') {
      $scope.participants = []
    }
    if (typ=='groupDetails' || typ=='group') {
      $scope.form = {
        dp:emptyFile,
        title:''
      }
    }
  }
  $scope.participants = []
  $scope.addtochatList = function(indx){
    $scope.participants.push($scope.allUsers[indx])
  }

  $scope.remove = function(indx){
      $scope.participants.splice(indx,1)
  }

  $scope.form = {
    dp:emptyFile,
    title:''
  }

  $scope.fileNameChanged = function(file) {
      // console.log("select file",$scope.data.image,file[0]);
      var filedata = file[0]
      var typ = filedata['type'].split('/')[0]
      if (typ!='image') {
        Flash.create('warning' , 'Add Image')
        return
      }
      // var fd = new FormData();
      if (filedata != null && filedata != emptyFile) {
        $scope.form.dp = filedata
      }

  }

  $scope.createGroupChat = function(){
    var participants  = []
    for (var i = 0; i < $scope.participants.length; i++) {
       participants.push($scope.participants[i].pk)
    }
    var toSend = new FormData()
    toSend.append('title', $scope.form.title)
    toSend.append('participants', participants)
    if ($scope.form.dp != emptyFile) {
      toSend.append('dp', $scope.form.dp)
    }

    $http({
      method: 'POST',
      url: '/api/PIM/chatThreads/',
      data: toSend,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.getChatthreads()
      $scope.showUsers = 'chats'
      $state.go('home.messenger.explore',{id:response.data.pk})
    })
  }


  });
