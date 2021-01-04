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


  $http({method : 'GET' , url : '/api/PIM/chatMessageBetween/?other=' + $state.params.id }).
  then(function(response) {
    $scope.messages = response.data
  })



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





});
