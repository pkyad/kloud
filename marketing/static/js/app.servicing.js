// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.servicing', {
      url: "/servicing",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.marketing.customer.index.html',
          controller: 'businessManagement.servicing',
        },
        "@businessManagement.servicing": {
          templateUrl: '/static/ngTemplates/app.marketing.leads.html',
          controller : 'businessManagement.servicing.view'
        }
      }
    })
  $stateProvider.state('businessManagement.servicing.ongoing', {
    url: "/ongoing",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing.view'
  })
  $stateProvider.state('businessManagement.servicing.assigned', {
    url: "/assigned",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller: 'businessManagement.servicing.view'
  })
  $stateProvider.state('businessManagement.servicing.postponed', {
    url: "/postponed",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing.view'
  })
  $stateProvider.state('businessManagement.servicing.cancelled', {
    url: "/cancelled",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing.view'
  })
  $stateProvider.state('businessManagement.servicing.upcoming', {
    url: "/upcoming",
    templateUrl: '/static/ngTemplates/app.marketing.upcoming.html',
    controller : 'businessManagement.servicing.view'
  })
  $stateProvider.state('businessManagement.servicing.collection', {
    url: "/collection",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing.view'
  })


});


app.controller("businessManagement.servicing.view", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {


})

app.controller("businessManagement.servicing", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {

  $scope.appInfo = {
    name : '',
    logo: ''
  }
  $scope.getApp = function(){
    $http({
      method: 'GET',
      url: '/api/ERP/getapplication/?stateAlias=' + $state.params.name
    }).
    then(function(response) {
      if(response.data.length>0){
        $scope.appInfo.name = response.data[0].displayName
        $scope.appInfo.logo = response.data[0].icon
        console.log(response.data,$scope.appInfo.logo,'$scope.appInfo.logo');

      }
    })
  }
  $scope.getApp()


  $scope.newContact = function(indx) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.newContact.html',
      size: 'lg',
      placement: 'right',
      backdrop: false,
      resolve: {
        data: function() {
          if (indx == undefined || indx == null) {
            return null
          } else {
            return $scope.assetsData[indx].contact
          }
        }
      },
      controller: "businessManagement.marketing.saveContacts",
    }).result.then(function() {
      $scope.getAllData()
    }, function(res) {
      $scope.getAllData()
    });
  }



});

