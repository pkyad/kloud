app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.forum', {
      url: "/forum",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.forum.view.html',
          // controller: 'businessManagement.forum',
        }
      }
    })

  })


  // app.controller('businessManagement.forum', function($scope, $http, $aside, $state, Flash, $users, $filter,$window) {
  //
  //
  //
  // })
