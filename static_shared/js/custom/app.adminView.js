var app = angular.module('app', ['ui.router','flash']);

  app.config(function($httpProvider,$stateProvider, $urlRouterProvider,$provide) {

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.withCredentials = true;


  });

  app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeError", console.log.bind(console));
  }]);


  app.directive('fileModel', ['$parse', function ($parse) {
          return {
             restrict: 'A',
             link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                   scope.$apply(function() {
                      modelSetter(scope, element[0].files[0]);
                   });
                });
             }
          };
   }]);

  app.controller('main' , function($scope,$http,Flash) {
    $scope.a = "das"

  })
