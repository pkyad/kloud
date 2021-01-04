app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.payroll.salary', {
      url: "/salary",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.payroll.salary.html',
          controller: 'workforceManagement.salary',
        }
      }
    })
});
