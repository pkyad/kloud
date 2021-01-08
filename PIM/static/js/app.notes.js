app.controller("controller.home.notes", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.openCreateNote = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.createNote.html',
      size: 'md',
      backdrop: true,
      controller: function($scope, $uibModalInstance) {

        $scope.form = {
          title : ''
        }

        $scope.saveNote = function() {
          var dataToSend = {
            title : $scope.form.title
          }

          $http({
            method: 'POST',
            url: '/api/PIM/notes/',
            data: dataToSend
          }).
          then(function(response) {
            $uibModalInstance.dismiss();
            Flash.create('success', 'Note created')
          })
        }
      },
    }).result.then(function() {
      $scope.getNotes()
    }, function() {
      $scope.getNotes()
    });

  }

  $scope.form = {
    search : '',
    page : 1
  }

  $scope.row = 0

  $scope.getIndex = function(idx){
    $scope.row = idx
  }


  $scope.notes = []

  $scope.getNotes = function(){
    var url = '/api/PIM/notesTitle/'

    url = url + '?title__icontains=' + $scope.form.search + '&limit=10&offset=0'

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.notes = response.data.results

      if ($state.is('home.notes')) {
        $state.go('home.notes.view' , {id : $scope.notes[0].pk})
      }
    })
  }
  $scope.getNotes()


  $scope.loadMore = function(){
    var url = '/api/PIM/notesTitle/'

    url = url + '?title__icontains=' + $scope.form.search + '&limit=10&offset=' + 10*$scope.form.page

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      var notes = response.data.results;
      for (var i = 0; i < notes.length; i++) {
        $scope.notes.push(notes[i])
      }
      $scope.form.page += 1;
      if ($state.is('home.notes')) {
        $state.go('home.notes.view' , {id : $scope.notes[0].pk})
      }
    })
  }

});



app.controller("controller.home.viewNotes", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.getNoteData = function(){
    $http({
      method: 'GET',
      url: '/api/PIM/notes/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.noteData = response.data

    })
  }
  $scope.getNoteData()


  $scope.save = function() {

    var url =  '/api/PIM/notes/' + $state.params.id + '/'
    if ($scope.noteData) {
      $http({method : 'PATCH' , url : url , data :{source : $scope.noteData.source} }).
      then(function(response) {
        Flash.create('success', 'Source Updated')
      })
    } else {
      Flash.create('warning', 'Add Source Data')
    }
  }

  $scope.share = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.shareNote.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return data;
        },
      },
      controller: function($scope, $uibModalInstance, data) {
        $scope.data = data;

        $scope.saveNote = function() {
          var dataToSend = {
            shares : $scope.data.shares
          }

          $http({
            method: 'PATCH',
            url: '/api/PIM/notes/' + $scope.data.pk + '/',
            data: dataToSend
          }).
          then(function(response) {
            $uibModalInstance.dismiss();
            Flash.create('success', 'Note created')
          })
        }
      },
    }).result.then(function() {
    }, function() {
      $scope.getNotes()
    });
  }


})
