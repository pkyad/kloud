app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.customers', {
    url: "/customers",
    templateUrl: '/static/ngTemplates/app.marketing.contactslist.html',
    // controller: 'businessManagement.marketing.contacts'
  })

})

app.controller("businessManagement.marketing.contactslist", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {

  $scope.filter = {
    date1: new Date(),
    searchTxt: '',
    date2: new Date(),
    typ: 'Today'
  }

  $scope.data = []

  $scope.fetch = function() {
    $http({
      method: 'GET',
      url: '/api/marketing/getOnlyContacts/?typ=' + $scope.filter.typ + '&search=' + $scope.filter.searchTxt
    }).
    then(function(response) {
      $scope.data = response.data.data;
    })
  }

  $scope.fetch()


  $scope.assign = function(indx) {

    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.addServiceVisit.html',
      size: 'lg',
      placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.data[indx]
        },
        typ: function() {
          return 'contact'
        },
      },
      controller: 'businessManagement.marketing.addServiceVisit'
    })

  }
})
