app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.employees.exitManagement', {
      url: "/exitManagement",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.employees.exitManagement.html',
          controller: 'workforceManagement.exitManagement',
        }
      }
    })
});
