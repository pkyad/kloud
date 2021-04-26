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
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.row = 0

  $scope.row = 0

  $scope.getIndex = function(idx){
    $scope.row = idx
  }


  $scope.notes = []

  $scope.getNotes = function(){
    var url = '/api/PIM/notesTitle/?own=&limit=' + $scope.limit + '&offset=' + $scope.offset

    url = url + '&title__icontains=' + $scope.form.search

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      console.log(response.data.results);
      $scope.notes = response.data.results
      $scope.resPrev = response.data.previous
      $scope.resNext = response.data.next
      if ($state.is('home.notes')) {
        $state.go('home.notes.view' , {id : $scope.notes[0].pk})
      }
    })
  }
  $scope.getNotes()
  $scope.previous = function() {
    if ($scope.resPrev != null) {
      $scope.offset -= $scope.limit
      $scope.getNotes()
    }
  }

  $scope.next = function() {
    if ($scope.resNext != null) {
      $scope.offset += $scope.limit
      $scope.getNotes()
    }
  }
  //
  // $scope.loadMore = function(){
  //   var url = '/api/PIM/notesTitle/'
  //
  //   url = url + '?title__icontains=' + $scope.form.search + '&limit=10&offset=' + 10*$scope.form.page
  //
  //   $http({
  //     method: 'GET',
  //     url: url
  //   }).
  //   then(function(response) {
  //     var notes = response.data.results;
  //     for (var i = 0; i < notes.length; i++) {
  //       $scope.notes.push(notes[i])
  //     }
  //     $scope.form.page += 1;
  //     if ($state.is('home.notes')) {
  //       $state.go('home.notes.view' , {id : $scope.notes[0].pk})
  //     }
  //   })
  // }

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
  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar: false,
    statusbar: false,
    toolbar: 'share save | numlist | alignleft aligncenter alignright alignjustify | outdent  indent | bold italic underline | style-p style-h1 style-h2 style-h3 ',
    setup: function(editor) {
      editor.addButton('save', {
        text: 'Save',
        icon: false,
        onclick: function() {
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
      });
      editor.addButton('share', {
        text: 'Share',
        icon: false,
        onclick: function() {
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.home.shareNote.modal.html',
            size: 'md',
            backdrop: true,
            resolve: {
              data: function() {
                return $scope.noteData;
              },
            },
            controller: function($scope, $uibModalInstance, data) {
              $scope.data = data;

              $scope.userSearch = function(query) {
                return $http.get('/api/HR/userSearch/?username__contains=' + query).
                then(function(response) {
                  return response.data;
                })
              };

              $scope.close = function(){
                $uibModalInstance.close();
              }

              $scope.getSharedUsers = function(){
                $http({
                  method: 'GET',
                  url: '/api/PIM/notes/' + $scope.data.pk + '/',
                }).
                then(function(response) {
                  console.log(response.data);
                  $scope.usersList = response.data.shares
                })
              }
              $scope.getSharedUsers()

              $scope.form = {
                users : ''
              }

              $scope.addUsers = function(){
                $scope.data.shares.push($scope.form.users)
                $scope.form.users = ''
              }


              $scope.removeUser = function(indx) {
                $scope.data.shares.splice(indx, 1)
              }

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
                  $scope.sharedUsers = response.data.shares
                  Flash.create('success', 'Note Shared')
                  $uibModalInstance.dismiss();

                })
              }
            },
          }).result.then(function() {
          }, function() {
            $scope.getNotes()
          });

        }
      });
      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name) {
        editor.addButton("style-" + name, {
          tooltip: "Toggle " + name,
          text: name.toUpperCase(),
          onClick: function() {
            editor.execCommand('mceToggleFormat', false, name);
          },
          onPostRender: function() {
            var self = this,
              setup = function() {
                editor.formatter.formatChanged(name, function(state) {
                  self.active(state);
                });
              };
            editor.formatter ? setup() : editor.on('init', setup);
          }
        })
      });


    },
  };

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

        $scope.userSearch = function(query) {
          return $http.get('/api/HR/userSearch/?username__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.close = function(){
          $uibModalInstance.close();
        }

        $scope.getSharedUsers = function(){
          $http({
            method: 'GET',
            url: '/api/PIM/notes/' + $scope.data.pk + '/',
          }).
          then(function(response) {
            console.log(response.data);
            $scope.usersList = response.data.shares
          })
        }
        $scope.getSharedUsers()

        $scope.form = {
          users : ''
        }

        $scope.addUsers = function(){
          $scope.data.shares.push($scope.form.users)
          $scope.form.users = ''
        }


        $scope.removeUser = function(indx) {
          $scope.data.shares.splice(indx, 1)
        }

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
            $scope.sharedUsers = response.data.shares
            Flash.create('success', 'Note Shared')
            $uibModalInstance.dismiss();

          })
        }
      },
    }).result.then(function() {
    }, function() {
      $scope.getNotes()
    });
  }


})
