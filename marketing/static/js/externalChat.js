var app = angular.module('app', ['ngAnimate']);

app.config(function( $httpProvider) {

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});

app.controller('main', function($scope, $http, $timeout ) {

  $scope.a = "dasdas"
  $scope.data = {messages : [] , attachment : null , txt : '' , uid : new Date().getTime() }

  $http({method : 'GET' , url : '/api/PIM/chatMessageBetween/?other=55'}).
  then(function(response) {
    $scope.data.messages = response.data;
    $timeout(()=>{
      $('#mainScroll').animate({scrollTop : 1000 }, 1000)
    },1000)
  })


  $scope.send = function() {
      $scope.data.messages.push({message : $scope.data.txt});
      $scope.data.txt = '';
      $timeout(()=>{
        $('#mainScroll').animate({scrollTop : 1000}, 1000)
      },1000)
  }


})
