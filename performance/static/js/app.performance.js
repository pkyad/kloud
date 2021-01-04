app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.performance', {
      url: "/performance",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "menu@workforceManagement.performance": {
          templateUrl: '/static/ngTemplates/genericMenu.html',
          controller: 'controller.generic.menu',
        },
        "@workforceManagement.performance": {
          // templateUrl: '/static/ngTemplates/app.performance.dash.html',
          controller: 'workforceManagement.performance.dash',
        }
      }
    })
});
app.controller("workforceManagement.performance.dash", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  $state.go('workforceManagement.performance.feedback');
});
