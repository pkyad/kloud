app.config(function($stateProvider){
  $stateProvider.state('workforceManagement.employees.myCircle', {
    url: "/myCircle",
    templateUrl: '/static/ngTemplates/app.employees.myCircle.html',
    controller: 'workforceManagement.employees.myCircle'
  });
});
app.controller("workforceManagement.employees.myCircle", function($scope, $state, $users, $stateParams, $http, Flash , $timeout) {
  $scope.user = $users.get('mySelf');
  $http({
    method: 'GET',
    url: '/api/HR/users/?reportingTo='+ $scope.user.pk ,
  }).
  then(function(response) {
    $scope.employees = response.data;
    $scope.employees.sort(function(a,b){
      return a.pk - b.pk
    })
  })

  $scope.labels = ["Complete", "In-Complete"];
  $scope.data = [300, 500];
  $scope.colors = ['#f2f2f2', '#5387ac'];
});
