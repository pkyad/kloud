app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.performance.feedback', {
      url: "/feedback",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.performance.feedback.html',
          controller: 'workforceManagement.performance.feedback',
        }
      }
    })
});
app.controller("workforceManagement.performance.feedback", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {



});
