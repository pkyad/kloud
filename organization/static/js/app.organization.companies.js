app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.organization.companies', {
      url: "/companies",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.organization.companies.html',
          controller: 'workforceManagement.organization.companies',
        }
      }
    })
});
