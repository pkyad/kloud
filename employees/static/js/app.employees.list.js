app.config(function($stateProvider) {
  $stateProvider.state('workforceManagement.employees.list', {
    url: "/list",
    templateUrl: '/static/ngTemplates/app.employees.list.html',
    controller: 'workforceManagement.employees.list'
  });
});
app.controller("workforceManagement.employees.list", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  var views = [{
      name: 'table',
      icon: 'fa-bars',
      template: '/static/ngTemplates/genericTable/genericSearchList.html',
      itemTemplate: '/static/ngTemplates/app.employees.list.items.html'
    },]
    var options = {
      main: {
        icon: 'fa-envelope-o',
        text: 'im'
      },
      others: [
        {
          icon: '',
          text: 'viewProfile'
        },
      ]
    };
  $scope.user = $users.get('mySelf');
  $scope.config = {
    url: '/api/HR/users/?reportingTo='+ $scope.user.pk + '&' ,
    views: views,
    options: options,
    itemsNumPerView: [12, 24, 48],
    searchField: 'username',
  };

  $scope.tabs = [];
  $scope.searchTabActive = true;
  $scope.data = {
    tableData: []
  };

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {

      if ($scope.tabs[i].app == input.app) {
        if ((typeof $scope.tabs[i].data.url != 'undefined' && $scope.tabs[i].data.url == input.data.url) || (typeof $scope.tabs[i].data.pk != 'undefined' && $scope.tabs[i].data.pk == input.data.pk)) {
          $scope.tabs[i].active = true;
          alreadyOpen = true;
        }
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }

  $scope.tableAction = function(target, action, mode) {

    if (action == 'im') {
      $scope.$parent.$parent.addIMWindow(target);
    }
    else if (action == 'viewProfile') {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == target) {
          u = $users.get(target)
          $http.get('/api/HR/profileAdminMode/' + $scope.data.tableData[i].profile.pk + '/').
          success((function(target) {
            return function(response) {
              response.userPK = target;
              u = $users.get(target)
              console.log("will add tab profile : ");
              console.log(response);
              $scope.addTab({
                title: 'Profile for ' + u.first_name + ' ' + u.last_name,
                cancel: true,
                app: 'viewProfile',
                data: response,
                active: true
              })

              console.log($scope.tabs);
            }
          })(target));
        }
      }
    }
  }


});
