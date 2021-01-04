app.config(function($stateProvider) {

  $stateProvider
    .state('admin.documents', {
      url: "/documents",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.documents.html',
          controller: 'admin.documents',
        }
      }
    })
});
app.controller("admin.documents", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.openDocForm = function(data) {
    console.log(data);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.docForm.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        account: function() {
          if (data == undefined || data == null) {
            return {}
          }
          else {

            return data;
          }
        }
        },
      controller: 'account.documents.form',
    })
    .result.then(function() {

    }, function(res) {
    })
  }



  $scope.limit = 20
  $scope.offset = 0
  $scope.prevDoc = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.allDoclist(false, '')
    }
  }
  $scope.nextDoc = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.allDoclist(false, '')
    }
  }
  $scope.searchForm = {
    search: ''
  }
  $scope.allDoclist = function(search, searchValue) {
    console.log(search, searchValue);
    if (search == true) {
      var url = '/api/HR/documents/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&title__icontains=' + searchValue

    } else {
      var url = '/api/HR/documents/?limit=' + $scope.limit + '&offset=' + $scope.offset

    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.docData = response.data.results
      $scope.count = response.data.count
    })

  }
  $scope.allDoclist(false, '')
})

app.controller("account.documents.form", function($scope, $state, $users, $stateParams, $http, Flash, account) {


  $scope.resetform = function() {
    $scope.form = {
      title: '',
      version: '',
      description: '',
      docFile: emptyFile,
      user: '',
      active: false,
    }
  }
  $scope.resetform()
  if (account.pk) {
    $scope.form = account
  }
  $scope.userSearch = function(query) {
    return $http.get('/api/HR/users/?username__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  }

  console.log($scope.form,'for,msdfasd');


  $scope.saveDoc = function() {
    var fd = new FormData()
    fd.append('title', $scope.form.title)
    fd.append('version', $scope.form.version)
    fd.append('description', $scope.form.description)
    fd.append('user', $scope.form.user.pk)
    fd.append('active', $scope.form.active)
    fd.append('file_typ',$scope.form.docFile.type)
    fd.append('docFile', $scope.form.docFile)
    // if (typeof $scope.form.docFile != 'string' && $scope.form.docFile!=emptyFile) {
    // }
    // if ($scope.form.docFile == emptyFile && ($scope.form.docFile == '' || $scope.form.docFile == undefined)) {
    //   Flash.create('danger', 'Add the document')
    //   return;
    // }
    console.log($scope.form.docFile.type, 'docFielashkdfhasdfhj');
    if ($scope.form.pk != undefined) {

      method = 'PATCH';
      url = '/api/HR/documents/' + $scope.form.pk + '/';
    } else {
      method = 'POST';
      url = '/api/HR/documents/';
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.resetform()
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }

})
