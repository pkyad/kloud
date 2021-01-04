var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'mwl.confirm']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

//   $urlRouterProvider.otherwise('/home');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});


app.controller('main', function($scope, $state, $http, $timeout, $uibModal, $rootScope , $interval) {
    console.log('main');
    
    

})