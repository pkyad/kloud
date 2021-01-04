app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.employees.onboarding', {
      url: "/onboarding",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.onboarding.html',
          controller: 'workforceManagement.recruitment.onboarding',
        }
      }
    })
});
