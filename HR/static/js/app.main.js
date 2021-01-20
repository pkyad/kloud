var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'mwl.confirm', 'flash', 'angular-owl-carousel-2']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  //   $urlRouterProvider.otherwise('/home');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});

app.config(function($stateProvider) {



  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: '<appstore-view></appstore-view>',
      controller: 'main',
    })
  $stateProvider
    .state('productdetails', {
      url: "/productDetails/:id",
      templateUrl: '/static/ngTemplates/app.finance.inventory.productDetails.html',
      controller: 'main',
    })

});
app.controller('mainPage', function($scope, $state, $http, $timeout, $uibModal, $rootScope, $interval) {
  $scope.appDetails = function(pkVal) {
    window.open('/appdetails/?id=' + pkVal, '_self')
  }

})
app.controller('main', function($scope, $state, $http, $timeout, $uibModal, $rootScope, $interval, $users) {
  // document.getElementById('hidemeinallpage').style.display = 'none'
  $scope.me = $users.get('mySelf')
  console.log($scope.me);
  $scope.data = '92981329193289'

  $scope.readmore = false
  $scope.show = false

  $scope.apply = function(idx) {
    console.log(idx);
    $uibModal.open({
      templateUrl: '/apply/' + idx,
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {

          return idx;
        }
      },
      controller: "careers.modal.apply",
    }).result.then(function() {

    });
  }

})

app.controller("careers.modal.apply", function($scope, $state, $http, $timeout, data, Flash, $uibModalInstance) {
  var emptyFile = new File([""], "");
  $scope.form = {
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    resume: emptyFile,
    aggree: false,
    job: ''
  }


  $scope.save = function() {
    if ($scope.form.resume == emptyFile || $scope.form.firstname.length == 0) {
      Flash.create('warning', 'fill the details')
    }
    var fd = new FormData()

    fd.append('firstname', $scope.form.firstname)
    fd.append('lastname', $scope.form.lastname)
    fd.append('email', $scope.form.email)
    fd.append('mobile', $scope.form.mobile)
    fd.append('aggree', $scope.form.aggree)
    fd.append('coverletter', $scope.form.coverletter)
    fd.append('job', data)

    if ($scope.form.resume != emptyFile && typeof($scope.form.resume) == 'object' && $scope.form.resume != null) {

      fd.append('resume', $scope.form.resume)
    }

    $http({
      method: 'POST',
      url: '/api/recruitment/applyJob/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Applied....!!!')
      $uibModalInstance.dismiss()
    })

  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss()
  }

})
app.controller('controller.comment.blog', function($scope, $state, $http, $timeout) {

  $scope.showField = false
  $scope.resetForm = function() {
    $scope.data = {
      txt: '',
      name: '',
      email: ''
    }
  }
  $scope.resetForm()

  $scope.error = ''
  $scope.success = ''
  $scope.commentSent = []
  $scope.addComment = function() {

    if ($scope.data.txt == '') {
      $scope.error = "Add Comment"
      return
    }
    if ($scope.data.name == '') {
      $scope.error = "Add Name"
      return
    }
    if ($scope.data.email == '') {
      $scope.error = "Add Email"
      return
    }

    var article = document.getElementById('article').value
    $http({
      method: 'POST',
      url: '/api/businessManagement/comment/',
      data: {
        txt: $scope.data.txt,
        name: $scope.data.name,
        email: $scope.data.email,
        article: article
      }
    }).
    then(function(response) {
      $scope.error = ''
      $scope.success = "Successfully Added!"
      $scope.commentSent.push(response.data);
      $scope.resetForm()
      $timeout(function() {
        $scope.success = ''
      }, 2000);
    })
  }


})


app.controller('controller.uipath-go-compoments', function($scope, $state, $http, $timeout, $interval, $uibModal, $stateParams) {
  $scope.data = {
    email: '',
  }
  $scope.errorMsg = ''
  $scope.successMsg = ''
  $scope.subscribeData = function() {
    $scope.errorMsg = ''
    if ($scope.data.email == '' || $scope.data.email.length == 0) {
      $scope.errorMsg = 'Provide email address to subscribe'
      return
    }
    $http({
      method: 'POST',
      url: '/api/homepage/subscribe/',
      data: {
        email: $scope.data.email,
        typ: 'Subscribe',
        phoneNumber: '',
        notes: '',
        name: '',
        company: '',
        aggree: '',
      }
    }).
    then(function(response) {
      $scope.successMsg = "Successfully subscribed !!!!!"
      $scope.data = ''
      $timeout(function() {
        $scope.successMsg = ''
      }, 3000);
    })

  }
})
