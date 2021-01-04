var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'mwl.confirm']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

//   $urlRouterProvider.otherwise('/home');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});


app.controller('main', function($scope, $state, $http, $timeout, $uibModal, $rootScope , $interval, ) {
    console.log('main');
      $scope.userPk = USER_PK
      $scope.form = {
        name:'',
        comapny:'',
        email:''
      }
      $scope.msg = ''
      $scope.save = function(){
        $scope.msg = ''
        if ($scope.form.name == null || $scope.form.name.length == 0) {
          $scope.msg = 'Name is required'
          return
        }

        var dataToSend = {
          name : $scope.form.name,
          pk :   $scope.userPk
        }
        if ($scope.form.company.length>0) {
          dataToSend.company = $scope.form.company
        }
        $http({
          method: 'POST',
          url: '/api/HR/regNewUser/',
          data: dataToSend,
        }).
        then(function(response) {
          window.location.href="/ERP/"
        });
      }







})
