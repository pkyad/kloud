
app.directive("mathjaxBind", function() {
  return {
    restrict: "A",
    controller: ["$scope", "$element", "$attrs",
      function($scope, $element, $attrs) {
        console.log($scope, $element, $attrs);
        $scope.$watch($attrs.mathjaxBind, function(texExpression) {
          $element.html(texExpression);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
        });
      }
    ]
  };
});

app.directive('tabsStrip', function() {
  return {
    templateUrl: '/static/ngTemplates/tabsStrip.html',
    restrict: 'E',
    replace: true,
    scope: {
      tabs: '=',
      active: '='
    },
    controller: function($scope, $state, $stateParams) {
      $scope.changeTab = function(index) {
        for (var i = 0; i < $scope.tabs.length; i++) {
          $scope.tabs[i].active = false;
        }
        $scope.tabs[index].active = true;
        $scope.active = index;
      }

      $scope.$watch('active', function(newValue, oldValue) {
        $scope.changeTab(newValue);
      })
    },
  };
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

app.directive('commentInput', function() {
  return {
    templateUrl: '/static/ngTemplates/inputWithFile.html',
    restrict: 'E',
    replace: true,
    scope: {
      text: '=',
      doc: '=',
      saveNote: '='
    },
    controller: function($scope, $state, $stateParams) {

      $scope.randomKey = '' + new Date().getTime();

      if ($scope.doc == null || $scope.doc == undefined) {
        $scope.doc = emptyFile;
      }
      if ($scope.text == null || $scope.doc == undefined) {
        $scope.text = '';
      }
      $scope.browseForFile = function() {
        if ($scope.doc.size != 0) {
          $scope.doc = emptyFile;
          return;
        }
        $('#noteEditorFile' + $scope.randomKey).click();
      }

      $scope.$watch('doc', function(newValue, oldValue) {
        // console.log(newValue);
      })
    },
  };
});

app.directive('wizard', function() {
  return {
    templateUrl: '/static/ngTemplates/wizard.html',
    restrict: 'E',
    replace: true,
    scope: {
      active: '=',
      editable: '=',
      steps: '=',
      error: '='
    },
    controller: function($scope, $state, $stateParams) {

      $scope.activeBackup = -2;
      $scope.wizardClicked = function(indx) {
        if ($scope.editable) {
          $scope.active = indx;
          $scope.activeBackup = -2;
        }
      }

      $scope.resetHover = function(indx) {
        if ($scope.editable && $scope.activeBackup != -2) {
          $scope.active = $scope.activeBackup;
          $scope.activeBackup = -2;
        }
      }

      $scope.activateTemp = function(indx) {
        if ($scope.editable) {
          $scope.activeBackup = $scope.active;
          $scope.active = indx;
        }
      }

    },
  };
});

app.directive('breadcrumb', function() {
  return {
    templateUrl: '/static/ngTemplates/breadcrumb.html',
    restrict: 'E',
    replace: true,
    scope: false,
    controller: function($scope, $state, $stateParams) {
      var stateName = $state.current.name;
      $scope.stateParts = stateName.split('.');
      for (key in $stateParams) {
        if (typeof $stateParams[key] != 'undefined' && $stateParams[key] != '' && typeof parseInt($stateParams[key]) != 'number') {
          $scope.stateParts.push($stateParams[key]);
        };
      };
    },
  };
});

app.directive('userField', function() {
  return {
    templateUrl: '/static/ngTemplates/userInputField.html',
    restrict: 'E',
    replace: true,
    scope: {
      user: '=',
      url: '@',
      label: '@',
    },
    controller: function($scope, $state, $http, Flash) {
      $scope.userSearch = function(query) {
        return $http.get($scope.url + '?username__icontains=' + query).
        then(function(response) {
          return response.data;
        })
      };
      $scope.getName = function(u) {
        if (typeof u == 'undefined' || u == null) {
          return '';
        }
        return u.first_name + '  ' + u.last_name;
      }
    },
  };
});

app.directive('usersField', function() {
  return {
    templateUrl: '/static/ngTemplates/usersInputField.html',
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      url: '@',
      col: '@',
      label: '@',
      viewOnly: '@'
    },
    controller: function($scope, $state, $http, Flash) {
      $scope.d = {
        user: undefined
      };
      if (typeof $scope.col != 'undefined') {
        $scope.showResults = true;
      } else {
        $scope.showResults = false;
      }

      if (typeof $scope.viewOnly != 'undefined') {
        $scope.viewOnly = false;
      }
      // $scope.user = undefined;
      $scope.userSearch = function(query) {
        return $http.get($scope.url + '?offset=0&limit=10&username__icontains=' + query).
        then(function(response) {
          // for (var i = 0; i < response.data.length; i++) {
          //   if ($scope.data.indexOf(response.data[i]) != -1) {
          //     response.data.splice(i, 1);
          //   }
          // }
          return response.data.results;
        })
      };
      $scope.getName = function(u) {
        if (typeof u == 'undefined') {
          return '';
        }
        return u.first_name + '  ' + u.last_name;
      }

      $scope.removeUser = function(index) {
        $scope.data.splice(index, 1);
      }
      if ($scope.data == undefined || $scope.data.length == 0) {
        $scope.data =[]

      }
      $scope.$watch('d.user' , function(newValue , oldValue) {
        if (typeof newValue == 'object') {
          $scope.addUser();
        }
      },true)
      $scope.addUser = function() {
        if ($scope.d.user==undefined||$scope.d.user.pk==undefined) {
          Flash.create('danger', 'Please Select A Valid User')
          return;
        }
        for (var i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i] == $scope.d.user.pk) {
            Flash.create('danger', 'User already a member of this group')
            return;
          }
        }
        $scope.data.push($scope.d.user.pk);
        $scope.d.user = undefined;
      }
    },
  };
});

app.directive('mediaField', function() {
  return {
    templateUrl: '/static/ngTemplates/mediaInputField.html',
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      url: '@',
    },
    controller: function($scope, $state, $http, Flash) {
      $scope.form = {
        mediaType: '',
        url: ''
      }
      $scope.switchMediaMode = function(mode) {
        $scope.form.mediaType = mode;
      }

      $scope.getFileName = function(f) {
        var parts = f.split('/');
        return parts[parts.length - 1];
      }

      $scope.removeMedia = function(index) {
        $http({
          method: 'DELETE',
          url: $scope.url + $scope.data[index].pk + '/'
        }).
        then(function(response) {
          $scope.data.splice(index, 1);
        })
      }
      $scope.postMedia = function() {
        var fd = new FormData();
        fd.append('mediaType', $scope.form.mediaType);
        fd.append('link', $scope.form.url);
        if (['doc', 'image', 'video'].indexOf($scope.form.mediaType) != -1 && $scope.form.file != emptyFile) {
          fd.append('attachment', $scope.form.file);
        } else if ($scope.form.url == '') {
          Flash.create('danger', 'No file to attach');
          return;
        }
        url = $scope.url;
        $http({
          method: 'POST',
          url: url,
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          $scope.data.push(response.data);
          $scope.form.file = emptyFile;
          Flash.create('success', response.status + ' : ' + response.statusText);
        }, function(response) {
          Flash.create('danger', response.status + ' : ' + response.statusText);
        });
      }
    },
  };
});

app.directive('genericForm', function() {
  return {
    templateUrl: '/static/ngTemplates/genericForm.html',
    restrict: 'E',
    replace: true,
    scope: {
      template: '=',
      submitFn: '&',
      data: '=',
      formTitle: '=',
      wizard: '=',
      maxPage: '=',
    },
    controller: function($scope, $state) {
      $scope.page = 1;

      $scope.next = function() {
        $scope.page += 1;
        if ($scope.page > $scope.maxPage) {
          $scope.page = $scope.maxPage;
        }
      }
      $scope.prev = function() {
        $scope.page -= 1;
        if ($scope.page < 1) {
          $scope.page = 1;
        }
      }
    },
  };
});

app.directive('chatBox', function() {
  return {
    templateUrl: '/static/ngTemplates/chatBox.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      index:'=',
      closeChat: '=',
    },
    controller: function($scope, $users , $uibModal) {
      $scope.me = $users.get('mySelf');

      $scope.chatBox = {
        messageToSend: '',
        fileToSend: emptyFile
      }

      $scope.removeFile = function() {
        $scope.chatBox.fileToSend = emptyFile;
      }


      $scope.send = function() {
        if ($scope.chatBox.fileToSend.size>0) {
          var typ = $scope.chatBox.fileToSend.type.split('/')[0]
          var message;
          if (typ=='image') {
            message = {msg : "",sentByMe:true, img:'/static/images/career.jpg' , created: new Date()}
            $scope.data.messages.push(message)
          }else if (typ=='audio') {
            message = {msg:"" , sentByMe: true, audio:'/static/audio/notification.mp3', created: new Date() }
            $scope.data.messages.push(message)
          }else if (typ=='video') {
            message = {msg : "",sentByMe:true, video:'/static/videos/24tutors.mp4' , created: new Date()}
            $scope.data.messages.push(message)
          }else if (typ=='application') {
            message = {msg : "",sentByMe:true, doc:'static/document/invoice.pdf' , created: new Date()}
            $scope.data.messages.push(message)
          }
          $scope.status = 'MF';

          connection.session.publish('service.support.chat.' + $scope.data.uid, [$scope.status  , message , new Date() ], {}, {
            acknowledge: true
          }).
          then(function(publication) {
            console.log("Published");
          });

          $scope.chatBox.fileToSend = emptyFile;
          $scope.scroll()

        }

        if ($scope.chatBox.messageToSend.length>0) {


          var youtubeLink = $scope.chatBox.messageToSend.includes("www.youtube.com/");

          if (youtubeLink) {
            var message = {msg:"" , link:$scope.chatBox.messageToSend ,  sentByMe:true , created: new Date() }
          }else {
            var message = {msg:$scope.chatBox.messageToSend , sentByMe: true, created: new Date() }
          }

          $scope.data.messages.push(message)
          console.log($scope.chatBox.messageToSend);
          $scope.status = 'M';

          connection.session.publish('service.support.chat.' + $scope.data.uid, [$scope.status  , message , new Date() ], {}, {
            acknowledge: true
          }).
          then(function(publication) {
            console.log("Published");
          });


          $scope.chatBox.messageToSend = ''
          $scope.scroll()
        }
      };

      $scope.closeChatBox = function(indx) {
        $scope.closeChat(indx)
      }

      $scope.attachFile = function() {
        $('#filePickerChat' + $scope.index).click();
      }

      $scope.scroll = function () {
        setTimeout(function () {
          var id = document.getElementById("scrollArea"+ $scope.index);
          id.scrollTop = id.scrollHeight;
        }, 200);
      }

      $scope.knowledgeBase = function(data) {
        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.support.knowledgeBase.modal.html',
          size: 'md',
          backdrop: true,
          controller: function($scope, $users , $uibModalInstance) {

            $scope.closeModal = function () {
              $uibModalInstance.close()
            }

          },
        })
      }

    }
  };
});


app.directive('messageStrip', function() {
  return {
    templateUrl: '/static/ngTemplates/messageStrip.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      openChat: '=',
    },
    controller: function($scope, $users) {
      $scope.me = $users.get('mySelf');
      if ($scope.me.pk == $scope.data.originator) {
        $scope.friend = $scope.data.user;
      } else {
        $scope.friend = $scope.data.originator;
      }
      $scope.clicked = function() {
        $scope.data.count = 0;
        $scope.openChat($scope.friend)
      }
    }
  };
});

app.directive('notificationStrip', function() {
  return {
    templateUrl: '/static/ngTemplates/notificationStrip.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
    },
    controller: function($scope, $http, $users, $aside) {
      var parts = $scope.data.shortInfo.split(':');
      // console.log(parts);
      if (typeof parts[1] == 'undefined') {
        $scope.notificationType = 'default';
      } else {
        $scope.notificationType = parts[0];
      }
      // console.log($scope.data);
      // console.log($scope.notificationType);
      var nodeUrl = '/api/social/' + $scope.notificationType + '/'
      if (typeof parts[1] != 'undefined' && $scope.data.originator == 'social') {
        // console.log(nodeUrl + parts[1]);
        $http({
          method: 'GET',
          url: nodeUrl + parts[1] + '/'
        }).
        then(function(response) {
          $scope.friend = response.data.user;
          if ($scope.notificationType == 'postComment') {
            var url = '/api/social/post/' + response.data.parent + '/';
          } else if ($scope.notificationType == 'pictureComment') {
            var url = '/api/social/picture/' + response.data.parent + '/';
          }
          $http({
            method: 'GET',
            url: url
          }).then(function(response) {
            $scope.notificationData = response.data;
            if ($scope.notificationType == 'pictureComment') {
              $http({
                method: 'GET',
                url: '/api/social/album/' + $scope.data.shortInfo.split(':')[3] + '/?user=' + $users.get($scope.notificationData.user).username
              }).
              then(function(response) {
                $scope.objParent = response.data;
              });
            };
          });
        });
      } else if (typeof parts[1] != 'undefined' && $scope.data.originator == 'git') {
        if (parts[0] == 'codeComment') {
          var url = '/api/git/commitNotification/?sha=' + parts[2];
          $http({
            method: 'GET',
            url: url
          }).
          then(function(response) {
            $scope.commit = response.data[0];
          });
          var url = '/api/git/codeComment/' + parts[1] + '/';
          $http({
            method: 'GET',
            url: url
          }).
          then(function(response) {
            $scope.codeComment = response.data;
          });
        }
      };

      $scope.openAlbum = function(position, backdrop, input) {
        $scope.asideState = {
          open: true,
          position: position
        };

        function postClose() {
          $scope.asideState.open = false;
        }

        $aside.open({
          templateUrl: '/static/ngTemplates/app.social.aside.album.html',
          placement: position,
          size: 'lg',
          backdrop: backdrop,
          controller: 'controller.social.aside.picture',
          resolve: {
            input: function() {
              return input;
            }
          }
        }).result.then(postClose, postClose);
      }

      $scope.openPost = function(position, backdrop, input) {
        $scope.asideState = {
          open: true,
          position: position
        };

        function postClose() {
          $scope.asideState.open = false;
        }

        $aside.open({
          templateUrl: '/static/ngTemplates/app.social.aside.post.html',
          placement: position,
          size: 'md',
          backdrop: backdrop,
          controller: 'controller.social.aside.post',
          resolve: {
            input: function() {
              return input;
            }
          }
        }).result.then(postClose, postClose);
      }

      $scope.openCommit = function() {
        $aside.open({
          templateUrl: '/static/ngTemplates/app.GIT.aside.exploreNotification.html',
          position: 'left',
          size: 'xxl',
          backdrop: true,
          resolve: {
            input: function() {
              return $scope.commit;
            }
          },
          controller: 'projectManagement.GIT.exploreNotification',
        })
      }

      $scope.openNotification = function() {
        $http({
          method: 'PATCH',
          url: '/api/PIM/notification/' + $scope.data.pk + '/',
          data: {
            read: true
          }
        }).
        then(function(response) {
          $scope.$parent.notificationClicked($scope.data.pk);
          $scope.data.read = true;
        });
        if ($scope.notificationType == 'postLike' || $scope.notificationType == 'postComment') {
          $scope.openPost('right', true, {
            data: $scope.notificationData,
            onDelete: function() {
              return;
            }
          })
        } else if ($scope.notificationType == 'pictureLike' || $scope.notificationType == 'pictureComment') {
          $scope.openAlbum('right', true, {
            data: $scope.notificationData,
            parent: $scope.objParent,
            onDelete: ""
          })
        } else if ($scope.notificationType == 'codeComment') {
          $scope.openCommit()
        }
      }
    },
  };
});


app.directive('chatWindow', function($users) {
  return {
    templateUrl: '/static/ngTemplates/chatWindow.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      friendUrl: '=',
      pos: '=',
      cancel: '&',
    },
    controller: function($scope, $location, $anchorScroll, $http, $templateCache, $timeout, ngAudio) {
      // console.log($scope.pos);
      $scope.me = $users.get("mySelf");
      $scope.friend = $users.get($scope.friendUrl);
      // console.log($scope.friend);
      $scope.sound = ngAudio.load("static/audio/notification.mp3");

      $scope.isTyping = false;
      $scope.toggle = true;
      $scope.messageToSend = "";
      $scope.fileToSend = emptyFile;
      $scope.chatForm = {
        messageToSend: '',
        fileToSend: emptyFile
      }
      $scope.status = "N"; // neutral / No action being performed
      $scope.send = function() {
        var msg = angular.copy($scope.chatForm.messageToSend)
        if (msg != "") {
          $scope.status = "M"; // contains message
          var dataToSend = {
            message: msg,
            user: $scope.friend.pk,
            read: false
          };
          $http({
            method: 'POST',
            data: dataToSend,
            url: '/api/PIM/chatMessage/'
          }).
          then(function(response) {
            $scope.ims.push(response.data)
            $scope.senderIsMe.push(true);
            connection.session.publish('service.chat.' + $scope.friend.username, [$scope.status, response.data.message, $scope.me.username, response.data.pk], {}, {
              acknowledge: true
            }).
            then(function(publication) {});
            $scope.chatForm.messageToSend = "";
          })
        }
      }; // send function for text

      $scope.sendFile = function() {
        console.log('send message ');
        var fd = new FormData();
        var file = $scope.chatForm.fileToSend
        console.log($scope.chatForm.fileToSend);
        console.log(file);
        if (file != emptyFile) {
          $scope.status = "MF"; // contains message
          // var dataToSend = {attachment:file , user: $scope.friend.pk , read:false};
          fd.append('attachment', file);
          fd.append('user', $scope.friend.pk);
          fd.append('read', false);
          $http({
            method: 'POST',
            data: fd,
            url: '/api/PIM/chatMessage/',
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            console.log('resssssss', response.data);
            // $scope.ims.push(response.data)
            var fileTypeArr = response.data.attachment.split('.')
            var fileType =  fileTypeArr[fileTypeArr.length-1]
            if (fileType == 'jpg'|| fileType == 'jpeg'|| fileType == 'png'|| fileType == 'svg'|| fileType == 'gif') {
              response.data.fileType = 'image'
            }else {
              response.data.fileType = 'document'
            }
            $scope.ims.push(response.data)
            $scope.senderIsMe.push(true);
            console.log(response.data.attachment);
            connection.session.publish('service.chat.' + $scope.friend.username, [$scope.status, response.data.attachment, $scope.me.username, response.data.pk], {}, {
              acknowledge: true
            }).
            then(function(publication) {});
            $scope.chatForm.fileToSend = emptyFile;
          })
        }
      }; // send function for file

      $scope.attachFile = function() {
        console.log($scope.friend.pk);
        $('#filePickerChat' + $scope.friend.pk).click();
      }

      $scope.$watch('chatForm.fileToSend', function(newValue, oldValue) {
        if (newValue == emptyFile) {
          return;
        }
        console.log('herreee', $scope.chatForm.fileToSend);
      });

      $scope.removeFile = function() {
        $scope.chatForm.fileToSend = emptyFile;
      }

      $scope.expandImage = function (imgUrl) {
        console.log('expaaannddddd');
        console.log(imgUrl);
      }

      $scope.addMessage = function(msg, url) {
        console.log('in add messagge');
        $scope.sound.play();
        $http({
          method: 'PATCH',
          url: '/api/PIM/chatMessage/' + url + '/?mode=',
          data: {
            read: true
          }
        }).
        then(function(response) {
          console.log('resssssssss');
          if (response.data.attachment) {
            var fileTypeArr = response.data.attachment.split('.')
            var fileType =  fileTypeArr[fileTypeArr.length-1]
            if (fileType == 'jpg'|| fileType == 'jpeg'|| fileType == 'png'|| fileType == 'svg'|| fileType == 'gif') {
              response.data.fileType = 'image'
            }else {
              response.data.fileType = 'document'
            }
          }
          $scope.ims.push(response.data);
          $scope.senderIsMe.push(false);
        });
      };

      $scope.fetchMessages = function() {
        $scope.method = 'GET';
        $scope.url = '/api/PIM/chatMessageBetween/?other=' + $scope.friend.username;
        $scope.ims = [];
        $scope.imsCount = 0;
        $scope.senderIsMe = [];
        $http({
          method: $scope.method,
          url: $scope.url
        }).
        then(function(response) {
          $scope.imsCount = response.data.length;
          for (var i = 0; i < response.data.length; i++) {
            var im = response.data[i];
            var sender = $users.get(im.originator)
            if (sender.username == $scope.me.username) {
              $scope.senderIsMe.push(true);
            } else {
              $scope.senderIsMe.push(false);
            }
            if (im.attachment) {
              var fileTypeArr = im.attachment.split('.')
              var fileType =  fileTypeArr[fileTypeArr.length-1]
              if (fileType == 'jpg'|| fileType == 'jpeg'|| fileType == 'png'|| fileType == 'svg'|| fileType == 'gif') {
                im.fileType = 'image'
              }else {
                im.fileType = 'document'
              }
            }
            $scope.ims.push(im);
            // console.log($scope.ims.length);
          }
        });
      };
      $scope.fetchMessages();
      $scope.scroll = function() {
        var $id = $("#scrollArea" + $scope.pos);
        $id.scrollTop($id[0].scrollHeight);
      }
    },
    // attrs is the attrs passed from the main scope
    link: function postLink(scope, element, attrs) {
      scope.$watch('chatForm.messageToSend', function(newValue, oldValue) {
        // console.log("changing");
        scope.status = "T"; // the sender is typing a message
        if (newValue != "") {
          connection.session.publish('service.chat.' + scope.friend.username, [scope.status, scope.chatForm.messageToSend, scope.me.username]);
        }
        scope.status = "N";
      }); // watch for the messageTosend
      scope.$watch('ims.length', function() {
        setTimeout(function() {
          scope.scroll();
        }, 500);
      });
      scope.$watch('pos', function(newValue, oldValue) {
        // console.log(newValue);
        scope.location = 30 + newValue * 320;
        // console.log("setting the new position value");
        // console.log();
      });
    } // link
  };
});


app.directive('appstoreView', function() {
  return {
    templateUrl: '/static/ngTemplates/appstoreview.html',
     // css: '/static/css/appstoreview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    // scope: {
    //   data: '=',
    //   // addCart: '='
    // },
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      console.log($scope.allApplication);
      $http({
        method: 'GET',
        url: '/api/ERP/getapplication/',
      }).
      then(function(response) {
        $scope.allApplication = response.data
      })


    },
  };
});


app.directive('appdetailedView', function() {
  return {
    templateUrl: '/static/ngTemplates/appdetailedView.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      id: '=',
      // addCart: '='
    },
    controller: function($scope, $state, $http, Flash, $rootScope, $filter,$location, $users, $timeout) {
        $scope.step = 'notinstalled'
        $scope.me = $users.get('mySelf');
        $scope.division = $scope.me.designation.division
      if ($state.is('workforceManagement.appDetails')) {
        var id = $state.params.id;
      }else{
        var id = window.location.href.split('=')[1]
      }

      $scope.form = {
        user : ''
      }
      $scope.getUsers = function() {
         $http.get('/api/HR/userSearch/').
        then(function(response) {
          $scope.selectUsers = response.data;
          $scope.form.user = $scope.selectUsers[0]
        })
      };
      $scope.getUsers()



      $scope.addPermision = function(){

      }
      $scope.openApp = function(){
        $state.go($scope.app.module  + '.' + $scope.app.name.replace('app.' , ''))
      }

      // $scope.getInstalledApp = function(){
      //   $http({
      //     method: 'GET',
      //     url: '/api/organization/installedApp/?app='+$scope.app.pk+'&parent='+$scope.division,
      //   }).
      //   then(function(res) {
      //
      //     $scope.installedApp = res.data[0]
      //     console.log(res.data,'343');
      //     if (res.data.length>0) {
      //       $scope.step = 'installed'
      //       $scope.getAppName()
      //       // location.reload();
      //     }
      //   })
      // }

      $scope.getAppName = function(){
        console.log("ssssssss");
        if ($scope.app.name.includes("app.")) {
          $scope.state = $scope.app.name.replace("app.", $scope.app.module.name+'/');
        }
        if ($scope.app.name.includes("sudo.")) {
          $scope.state = $scope.app.name.replace("sudo.", $scope.app.module.name+'/');
        }
      }

      // $http({
      //   method: 'GET',
      //   url: '/api/ERP/application/'+id+'/',
      // }).
      // then(function(response) {
      //   $scope.app = response.data
      //   $scope.getInstalledApp()
      //
      // })

      $scope.fetchDetails = function(){

        $http({
          method: 'GET',
          url: '/api/ERP/getAppDetails/?app='+id,
        }).
        then(function(response) {
          $scope.allData = response.data
          $scope.app = $scope.allData.appData
          $scope.users =  $scope.allData.appUser
          $scope.appMedia =  $scope.allData.appMedias
          $scope.appMedia =  $scope.allData.appMedias
          $scope.app.feedback = $scope.allData.appFeedbacks
          $scope.installedApp = $scope.allData.installedApp
          $scope.is_staff =  $scope.allData.is_staff
          $scope.is_user_installed =  $scope.allData.is_user_installed
          if ($scope.installedApp.pk) {
            $scope.step = 'installed'
            $scope.getAppName()
          }
        })

      }
      $scope.fetchDetails()

      // $scope.getUsers= function(){
      //
      //   $http({
      //     method: 'GET',
      //     url: '/api/ERP/getappusers/?app='+id,
      //   }).
      //   then(function(res) {
      //     $scope.users = res.data.data
      //   })
      // }
      // $scope.getUsers()


      // $http({
      //   method: 'GET',
      //   url: '/api/ERP/applicationmedia/?app='+id,
      // }).
      // then(function(response) {
      //   $scope.appMedia = response.data
      // })

      $scope.install = function(){
        $scope.step = 'installing'
        $timeout(function() {
          var dataToSend = {
            app: $scope.app.pk,
            priceAsAdded: 0,
            type:'newintall'
          }
          $http({
            method: 'POST',
            url: '/api/organization/intallUserApp/',
            data: dataToSend
          }).
          then(function(response) {
            $scope.fetchDetails()
              // $scope.step = 'installed'
              // $scope.getInstalledApp()
              // $scope.user = [response.data.userObj]
              //
              // if (res.data.length>0) {
              //   $scope.step = 'installed'
              //   $scope.getAppName()
              //   // location.reload();
              // }
            }, function(error) {

              $scope.step = 'notinstalled'

            })

        }, 3000);
      }


      $scope.addPermision = function(){
        $http({
          method: 'POST',
          url: '/api/organization/intallUserApp/',
          data:{
            user : $scope.form.user.pk ,
            app :  $scope.app.pk
          }
        }).
        then(function(response) {
          $scope.users.push($scope.form.user)
          })
      }


      $scope.unInstall = function(){
        $scope.step = 'installing'
        $timeout(function() {
        $http({
          method: 'GET',
          url: '/api/organization/uninstallApp/?id=' + $scope.installedApp.pk,
        }).
        then(function(response) {
            $scope.step = 'notinstalled'
            $scope.users =  []
          }, function(error) {
            $scope.step = 'Uninstall'
          })
         // location.reload();

       }, 2000);
      }


    },
  };
});


app.directive('contactusView', function() {
  return {
    templateUrl: '/static/ngTemplates/contactusview.html',
    // css: '/static/css/contactusview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {

    },
  };
});


app.directive('careerView', function() {
  return {
    templateUrl: '/static/ngTemplates/careerview.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      $http({
        method: 'GET',
        url: '/api/recruitment/job/',
      }).
      then(function(response) {
        $scope.allJobs = response.data
        var half_length = Math.ceil($scope.allJobs.length / 2);
        $scope.allJobs1 = $scope.allJobs
        $scope.allJobs1 = $scope.allJobs.splice(0,half_length);
        $scope.allJobs2 = $scope.allJobs.splice(0,$scope.allJobs.length);
        console.log($scope.allJobs1, $scope.allJobs2);

      })
    },
  };
});


app.directive('forumMain', function() {
  return {
    templateUrl: '/static/ngTemplates/forummain.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      $http({
        method: 'GET',
        url: '/api/forum/getForums/',
      }).
      then(function(response) {
        $scope.allForums = response.data
      })

      $scope.deleteForum = function(indx, typ){
        if (typ == 'posts1') {
          $http({
            method: 'DELETE',
            url: '/api/forum/forum/'+$scope.allForums.posts1[indx].pk+'/',
          }).
          then(function(response) {
            $scope.allForums.posts1.splice(indx,1)
            return
          })
        }

        if (typ == 'posts2') {
          $http({
            method: 'DELETE',
            url: '/api/forum/forum/'+$scope.allForums.posts2[indx].pk+'/',
          }).
          then(function(response) {
            $scope.allForums.posts2.splice(indx,1)
            return
          })
        }

      }
      $scope.goTo = function(id){
        $state.go('businessManagement.viewForum',{'id' : id})

      }

    },
  };
});


app.directive('forumView', function() {
  return {
    templateUrl: '/static/ngTemplates/forumview.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      $http({
        method: 'GET',
        url: '/api/forum/forumapi/?id='+$state.params.id,
      }).
      then(function(response) {
        $scope.alldata = response.data
      })

      $scope.resetForm = function(){
      $scope.data = {
        content : '',
        files : []
      }
    }
    $scope.resetForm()

    $scope.fileNameChanged = function(file) {
        // console.log("select file",$scope.data.image,file[0]);
        var filedata = file[0]
        var typ = filedata['type'].split('/')[0]
        var fd = new FormData();
        if (filedata != null && filedata != emptyFile) {
          fd.append('attachment', filedata)
          fd.append('typ', typ)
        }
        $http({
          method: 'POST',
          url: '/api/forum/forumCommentfies/',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          $scope.data.files.push(response.data)
        })
      }

      $scope.delete = function(indx){
        $http({
          method: 'DELETE',
          url: '/api/forum/forumComment/'+$scope.alldata.forumcommentdata[indx].pk+'/',
        }).
        then(function(response) {
          $scope.alldata.forumcommentdata.splice(indx,1)
        })
      }


      $scope.removeImage = function(idx) {
        $http({
          method: 'DELETE',
          url: '/api/forum/forumCommentfies/' + $scope.data.files[idx].pk + '/',
        }).
        then(function(response) {
          $scope.data.files.splice(idx, 1)
        })
      }

      $scope.postcomment = function() {

          var dataToSend = {
            content: $scope.data.content,
            parent: $state.params.id,
          }

          var filesList = []
          for (var i = 0; i < $scope.data.files.length; i++) {
            filesList.push($scope.data.files[i].pk)
          }
          if (filesList.length > 0) {
            dataToSend.files = filesList
          }

          if ($scope.data.pk) {
              dataToSend.id = $scope.data.pk
          }

          $http({
            method: 'POST',
            url: '/api/forum/forumcommentapi/',
            data: dataToSend
          }).
          then(function(response) {
            if (!$scope.data.pk) {
              $scope.alldata.forumcommentdata.push(response.data);
            }
            $scope.resetForm()
          })
        }

        $scope.edit = function(indx){
          $scope.data = $scope.alldata.forumcommentdata[indx]
        }
    },
  };
});


app.directive('academyCourses', function() {
  return {
    templateUrl: '/static/ngTemplates/academyCourses.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      $http({
        method: 'GET',
        url: '/api/LMS/course/?activeCourse=True',
      }).
      then(function(response) {
        $scope.courses = response.data
      })
    }
  }
})

app.directive('courseDetails', function() {
  return {
    templateUrl: '/static/ngTemplates/courseDetails.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      console.log(id);
      $http({
        method: 'GET',
        url: '/api/LMS/getCourseactivities/?course='+id,
      }).
      then(function(response) {
        $scope.activitydata = response.data
      })
    }
  }
})
app.directive('forumCreate', function() {
  return {
    templateUrl: '/static/ngTemplates/forumForm.html',
     // css: '/static/css/careerview.css',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $filter) {
      var emptyFile = new File([""], "");
      $scope.resetForm = function() {
        $scope.data = {
          title: '',
          description: '',
          // category: '',
          tags: '',
          image: emptyFile,
          files: []
        }
      }

      // $http({
      //   method: 'GET',
      //   url: '/api/articles/category/'
      // }).then(function(response) {
      //   console.log(response.data);
      //   $scope.allcat = response.data;
      // })
      $scope.resetForm()
      $scope.saveforum = function() {
        console.log(document.getElementsByClassName('ql-editor')[0]);
        var dataToSend = {
          title: $scope.data.title,
          description: document.getElementsByClassName('ql-editor')[0].innerHTML,
          // category: $scope.data.category.pk,
          tags: $scope.data.tags
        }
        var filesList = []
        for (var i = 0; i < $scope.data.files.length; i++) {
          filesList.push($scope.data.files[i].pk)
        }
        if (filesList.length > 0) {
          dataToSend.files = filesList
        }

        if ($scope.data.pk) {
          dataToSend.id = $scope.data.pk
        }
        $http({
          method: 'POST',
          url: '/api/forum/forumapi/',
          data: dataToSend
        }).
        then(function(response) {
          if ($state.is('businessManagement.createForum')) {
            $scope.resetForm()
            document.getElementsByClassName('ql-editor')[0].textContent = ''
          }
          Flash.create('success' , 'Saved')
          return
        })
      }

      //   $scope.$watch('data.image', function(newValue, oldValue) {
      //     console.log(newvalue,'aaaaaaaaaaaaaa');
      //   },true)
      //
      //



      $scope.fileNameChanged = function(file) {
        // console.log("select file",$scope.data.image,file[0]);
        var filedata = file[0]
        var typ = filedata['type'].split('/')[0]
        var fd = new FormData();
        if (filedata != null && filedata != emptyFile) {
          fd.append('attachment', filedata)
          fd.append('typ', typ)
        }
        $http({
          method: 'POST',
          url: '/api/forum/forumfiles/',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          $scope.data.files.push(response.data)
        })
      }


      $scope.removeImage = function(idx) {
        $http({
          method: 'DELETE',
          url: '/api/forum/forumfiles/' + $scope.data.files[idx].pk + '/',
        }).
        then(function(response) {
          $scope.data.files.splice(idx, 1)
        })
      }

      setTimeout(function() {
      if ($state.is('businessManagement.editForum')) {
        $http({
          method: 'GET',
          url: '/api/forum/forum/'+$state.params.id+'/',
        }).
        then(function(response) {
          $scope.data = response.data
          document.getElementsByClassName('ql-editor')[0].innerHTML = $scope.data.description
          $scope.data.tags = []
          for (var i = 0; i < $scope.data.tag.length; i++) {
            $scope.data.tags.push($scope.data.tag[i].name)
          }
        })
      }
    }, 600)

      // var options = {
      //   debug: 'info',
      //   modules: {
      //     toolbar: '#toolbar'
      //   },
      //   placeholder: 'Compose an epic...',
      //   readOnly: true,
      //   theme: 'snow'
      // };

      setTimeout(function() {
        var quill = new Quill('#editor', {
          debug: 'info',
          placeholder: 'Description...',
          theme: 'snow'
        });
      }, 500)


    },
  };
});
