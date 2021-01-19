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

    .state('businessManagement.createForum', {
      url: "/createForum",
      templateUrl: '/static/ngTemplates/app.createForum.html',
      // controller: 'businessManagement.createForum'
    })
    .state('businessManagement.editForum', {
      url: "/editForum/:id",
      templateUrl: '/static/ngTemplates/app.createForum.html',
      // controller: 'businessManagement.createForum'
    })
    .state('businessManagement.viewForum', {
      url: "/viewForum/:id",
      templateUrl: '/static/ngTemplates/app.viewForum.html',
      // controller: 'businessManagement.createForum'
    })
  })


  // app.controller('businessManagement.createForum', function($scope, $http, $aside, $state, Flash, $users, $filter,$window) {
  //
  //
  //
  //
  // })
