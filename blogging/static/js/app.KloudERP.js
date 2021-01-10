app.controller('businessManagement.kloudERP', function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.searchForm = {
    searchValue: ''

  }
  $scope.limit = 9
  $scope.offset = 0
  $scope.getallCompanies = function() {
    var url = '/api/organization/divisions/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.searchForm.searchValue.length > 0) {
      url += '&name__icontains=' + $scope.searchForm.searchValue
    }
    $http({
      method: 'GET',
      url: url

    }).
    then(function(response) {
      $scope.divisions = response.data.results
      $scope.resPrev = response.data.previous
      $scope.resNext = response.data.next

      $scope.checkPerm();


    })
  }
  $scope.getallCompanies()


  $scope.checkPerm = function() {
    if ($scope.divisions && $scope.divisions.length == 1 && $state.is('workforceManagement.organization')) {
      $state.go('workforceManagement.organization.details', {
        id: $scope.divisions[0].pk
      })
    }
  }


  $scope.prev = function() {
    if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.getallCompanies()
    }
  }
  $scope.next = function() {
    if ($scope.resNext != null) {
      $scope.offset += $scope.limit
      $scope.getallCompanies()
    }
  }
  $scope.viewDivision = function(data) {
    $state.go('workforceManagement.organization.details', {
      id: data.pk
    })
  }


  $scope.delete = function(data, idx) {
    $http({
      method: 'DELETE',
      url: '/api/organization/divisions/' + data.pk + '/'

    }).
    then(function(response) {
      Flash.create('success', 'Deleted....!!!')
      // $scope.divisions.splice(idx, 1)
      $scope.getallCompanies()
    })
  }
  $scope.createDivision = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.organization.division.form.html',
      position: 'right',
      size: 'l',
      backdrop: true,
      resolve: {
        data: function() {
          if (data == undefined) {
            return data
          } else {
            return data
          }

        }

      },
      controller: 'workforceManagement.organization.division.form',
    }).result.then(function() {
      $scope.getallCompanies();
    }, function() {
      $scope.getallCompanies();
    })
  }



})
