app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.rpa', {
        url: "/rpa",
        views: {
          "": {
            templateUrl: '/static/ngTemplates/app.rpa.html',
            controller: 'businessManagement.rpa'
          },

          "@businessManagement.rpa": {
            templateUrl: '/static/ngTemplates/app.rpa.jobs.html',
            controller: 'businessManagement.jobs'
          }
        }
      })
    .state('businessManagement.rpa.jobs', {
      url: "/jobss",
      templateUrl: '/static/ngTemplates/app.rpa.jobs.html',
      controller : 'businessManagement.job',
    })
    .state('businessManagement.rpa.process', {
      url: "/process",
      templateUrl: '/static/ngTemplates/app.rpa.process.html',
      controller : 'businessManagement.process',
    })
    .state('businessManagement.rpa.queue', {
      url: "/queue",
      templateUrl: '/static/ngTemplates/app.rpa.queue.html',
      controller : 'businessManagement.queue',
    })


});


app.controller('businessManagement.rpa' , function($scope , $users , Flash , $permissions , $http, $aside , $uibModal){


})
app.controller('businessManagement.job' , function($scope , $users , Flash , $permissions , $http, $aside , $uibModal){

  $scope.createrpaJob = function(){
    $uibModal.open({
      templateUrl:'/static/ngTemplates/app.rpa.createJob.html',
      backdrop:false,
      resolve:{

      },
      controller:function($scope,$http,$uibModalInstance,Flash,$state){
        $scope.close= function(){
          $uibModalInstance.dismiss()
        }
      }
    }).result.then(function() {

    });



  }


})
app.controller('businessManagement.process' , function($scope , $users , Flash , $permissions , $http, $aside , $uibModal){


})
app.controller('businessManagement.queue' , function($scope , $users , Flash , $permissions , $http, $aside , $uibModal){


})
