  app.controller("controller.messenger.explore", function($scope , $state , $users ,  $stateParams , $http , Flash , $uibModal, $rootScope) {

  $scope.me = $users.get('mySelf')

  $scope.user = $users.get(parseInt($state.params.id))


  $scope.form = {
    text : '',
    search : '',
    file : emptyFile
  }

  $scope.openFilePicker = function() {
    $('#filePicker').click();
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
    toSend.append('message' ,  $scope.form.text)
    toSend.append('user' , $state.params.id)
    if ($scope.form.file != emptyFile) {
      toSend.append('attachment' , $scope.form.file)
    }

    $http({method : 'POST' , url : '/api/PIM/chatMessage/' , data : toSend , transformRequest: angular.identity,
    headers: {
      'Content-Type': undefined
    }}).
    then(function(response) {
      $scope.messages.push(response.data)
      $scope.form.text = '';
      $scope.form.file = emptyFile;

      connection.session.publish('service.chat.' + $scope.user.username, [ 'M' ,  response.data]);
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
    $rootScope.$broadcast("call", {type : 'call' , number : number  });
  }

  $scope.messages = [

  ]


$scope.getMessages = function(){
  $http({method : 'GET' , url : '/api/PIM/chatMessageBetween/?other=' + $state.params.id }).
  then(function(response) {
    $scope.messages = response.data

  })

}
$scope.getMessages()

$scope.getThread = function(){
  $http({method : 'GET' , url : '/api/PIM/chatThreads/' + $state.params.id}).
  then(function(response) {
    $scope.user = response.data
    $scope.user.is_show=false
  })
}
$scope.getThread()

$scope.addParticipants =  function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.PIM.addparticipants.html',
    size: 'sm',
    backdrop: true,
    controller: function($scope,$uibModalInstance,$http,$state) {
      $scope.close = function(){
        $uibModalInstance.dismiss()
      }
      $scope.getallUsers = function(){
        $http({method : 'GET' , url : '/api/HR/users/' }).
        then(function(response) {
          $scope.allUsers = response.data
          for (var i = 0; i < $scope.allUsers.length; i++) {
              $scope.allUsers[i].add = false
          }
        })
      }
      $scope.getallUsers()
      $scope.form ={
        participants:[]
      }
      $scope.adduser = function(indx){
        console.log($scope.allUsers[indx],'3232');
        if ($scope.allUsers[indx].add = true) {

          $scope.form.participants.push($scope.allUsers[indx].pk)
        }

      }
      $scope.save=function(){
        $http({method : 'PATCH' , url : '/api/PIM/chatThreads/'+$state.params.id+'/',data:$scope.form }).
        then(function(response) {
          $uibModalInstance.dismiss()
        })
      }

    }

  }).result.then(function() {

  }, function() {
    $scope.getThread()
  });
}


});

app.controller("controller.messenger", function($scope , $state , $users ,  $stateParams , $http , Flash , $uibModal) {


    $scope.form = {
      searchTxt : ''
    }

      $scope.getUsers = function() {
        console.log("called");
        var params = {}

        if ($scope.form.searchTxt.length > 0) {
          params.search = $scope.form.searchTxt
        }

        $http({
          url : '/api/PIM/getChatThreads/',
          method : 'GET',
          params : params
        }).then(function(response) {
          $scope.users = response.data;
        })
      }

      $scope.getUsers();

      $scope.getChatthreads = function(){
        $http({method : 'GET' , url : '/api/PIM/chatThreads/' }).
        then(function(response) {
          $scope.chatthreads = response.data
        })

      }
$scope.getChatthreads()


});
