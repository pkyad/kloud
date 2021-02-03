  app.controller("controller.messenger.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $rootScope, $timeout,$window) {

    $scope.me = $users.get('mySelf')

    $scope.user = $users.get(parseInt($state.params.id))



    $scope.publish = function(params){
      for (var i = 0; i < $scope.user.participants.length; i++) {
        if ($scope.user.participants[i].pk != $scope.me.pk) {
          connection.session.publish(wamp_prefix+'service.chat.'+$scope.user.participants[i].pk, params).
          then(function(publication) {
            console.log('published');
          },function(){
            console.log('Failed to publish message to all');
          });
        }
      }
    }

    $scope.chatArray = []

    $scope.addChat = function(signal){
      if ($scope.chatArray[$scope.chatArray.length-1]!= signal) {
        $scope.chatArray.push(signal)
        $http({
          method: 'GET',
          url: '/api/PIM/chatMessage/'+signal+'/',
        }).
        then(function(response) {
          if (response.data.thread == $state.params.id) {
            $scope.messages.push(response.data)
          }
        })
      }
    }
    $scope.show = {
      showTypingVal : false
    }
    $scope.showTyping = function(chatPk, val){
      if (chatPk == $state.params.id) {
        $scope.show.showTypingVal = val
      }

    }

    // $scope.getaddChat = function(signal){
    //
    //   $http({
    //     method: 'GET',
    //     url: '/api/PIM/chatMessage/'+signal+'/',
    //   }).
    //   then(function(response) {
    //     if (response.data.thread == $state.params.id) {
    //       $scope.messages.push(response.data)
    //     }
    //   })
    // }


    $scope.form = {
      text: '',
      search: '',
      file: emptyFile
    }



    $scope.openFilePicker = function() {
      $('#filePicker').click();
    }


    $scope.dismissGrpInfo = function(){
      $scope.user.is_show=false
      $scope.showInput=false
    }

    function onevent(args) {
          console.log("Event:", args[0]);
       }

    $scope.send = function() {
      if ($scope.form.text.length == 0 && $scope.form.file == emptyFile) {
        return;
      }

      // var toSend = {
      //   message : $scope.form.text,
      //   user : $state.params.id
      // }

      var toSend = new FormData()
      toSend.append('message', $scope.form.text)
      toSend.append('thread', $state.params.id)
      if ($scope.form.file != emptyFile) {
        toSend.append('attachment', $scope.form.file)
      }
      if ($scope.replyMsgSelected.replyMsg!=null && typeof $scope.replyMsgSelected.replyMsg=='object') {
        toSend.append('replyTo', $scope.replyMsgSelected.replyMsg.pk)
      }

      $http({
        method: 'POST',
        url: '/api/PIM/chatMessage/',
        data: toSend,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.messages.push(response.data)
        $scope.form.text = '';
        $scope.form.file = emptyFile;
        var objDiv = document.getElementById("scrollView");
         objDiv.scrollTop = objDiv.scrollHeight+40;
        $scope.replyMsgSelected = {
          'replyMsg' : ''
        }
        if (response.data.uid!=undefined && response.data.uid!=null) {
          connection.session.publish(wamp_prefix+'service.support.chat.' + response.data.uid, ['M'  , response.data.pk , new Date() ], {}, {
            acknowledge: true
          }).
          then(function(publication) {
            console.log("Published");
          });
        }

        $scope.publish(['M', response.data.pk, $state.params.id])
      })

    }

    $scope.$watch('form.text', function(newValue, oldValue) {
      if (newValue.length>0) {
        connection.session.publish(wamp_prefix+'service.support.chat.' + $scope.user.uid, ['T'  , '' , new Date() ], {}, {
          acknowledge: true
        }).
        then(function(publication) {
          console.log("Published");
        });
        $scope.publish(['T', true ,$state.params.id ])
      }
      else{
          $scope.publish(['T', false ,$state.params.id ])
      }
    })




    window.addEventListener("message", function(event) {
      console.log(event.data);
      if (event.data[0] == 'M') {
        $scope.messages.push(event.data[1]);
        $scope.$apply();
      }
    }, false);

    $scope.call = function(number) {
      $rootScope.$broadcast("call", {
        type: 'call',
        number: number
      });
    }

    $scope.messages = [

    ]

    $scope.getMessages = function() {
      $http({
        method: 'GET',
        url: '/api/PIM/chatMessageBetween/?other=' + $state.params.id
      }).
      then(function(response) {
        $scope.messages = response.data

         $timeout(function() {
           var objDiv = document.getElementById("scrollView");
           objDiv.scrollTop = objDiv.scrollHeight+40;
         },500)
      })

    }

    $scope.getMessages()
    $scope.contactform={
      name:'',
      mobile:'',email:'',notes:'',visitor:'',addrs:'',pinCode:''
    }


    $scope.contactSearch = function(query) {

      return $http.get('/api/marketing/contacts/?limit=20&mobile__icontains=' + query).
      then(function(response) {
        return response.data.results;
      })
    };

    $scope.limit =20
    $scope.$watch('contactform.mobile', function(newValue) {


      console.log($scope.contactform,newValue,'34243');
      if (typeof newValue ==='object') {
        newValue = newValue.mobile

      }else {
        newValue =  newValue
      }
      $http({
        method: 'GET',
        url: '/api/marketing/contacts/?limit=20&mobile__icontains=' + newValue
      }).
      then(function(response) {
        if ($scope.contactform.mobile.pk != undefined) {

          $scope.contactform.email = $scope.contactform.mobile.email
          $scope.contactform.notes = $scope.contactform.mobile.notes
          $scope.contactform.addrs = $scope.contactform.mobile.addrs
          $scope.contactform.pinCode = $scope.contactform.mobile.pinCode
          $scope.contactform.visitor = $scope.contactform.mobile.pk
        }
        // $scope.createContact()
        // if ($scope.contactform.mobile.length >8) {
        //
        // }
        return response.data.results
      })




    })




    $scope.call = function(num) {
      $rootScope.$broadcast("call", {type : 'call' , number : num , source : 'dialPad'  });
    }

    // $scope.call('8328412361')
    // $scope.call('9702438730')


    $scope.$on("call", function(evt, data) {
      console.log({data : data});

      if (data.id) {
        $scope.dialer.campaign = data.id;
      }

      if (data.type == 'call' ) {
        $scope.dialer.number = data.number;

        if (data.number.length == 10) {
          numberToCall = '151191' + $scope.dialer.number ;
        }else{
          numberToCall = $scope.dialer.number ;
        }

        // $scope.dialer.number = '7007148138';
        console.log(data.number);


        $scope.dialer.direction = 'out';
        $scope.dialer.active = true;

        buddyObj = MakeBuddy(undefined, true, false, true, numberToCall, numberToCall);
        $scope.buddyObj = buddyObj;

        $scope.lineObj = new Line(1,  numberToCall,  numberToCall, buddyObj);
        AudioCall($scope.lineObj, numberToCall);
        $scope.dialer.status = 'Connecting'
      }
    });


    $scope.createContact = function(){
      console.log($scope.contactform.mobile,'3443');
      if ($scope.contactform.mobile.length < 8) {
        Flash.create('warning','Enter correct mobile number')
        return
      }
      var data = {
        name:$scope.contactform.name,email:$scope.contactform.email,notes:$scope.contactform.notes,pinCode:$scope.contactform.pinCode,addrs:$scope.contactform.addrs
      }
      if (typeof $scope.contactform.mobile ==='string') {
        data.mobile = $scope.contactform.mobile
      }else {

        data.mobile = $scope.contactform.mobile.mobile
      }
      if ($scope.contactform.pk != undefined) {
          data.visitor = $scope.contactform.pk
      }else {

        data.visitor = null
      }


      if ($scope.contactform.mobile.length ==10) {
          $http({
            method: 'PATCH',
            url:'/api/PIM/chatThreads/'+$state.params.id+'/',
            data:data
          }).
          then(function(response) {


          })

      }

    }

    $scope.getThread = function() {
      $http({
        method: 'GET',
        url: '/api/PIM/chatThreads/' + $state.params.id+'/'
      }).
      then(function(response) {
        $scope.user = response.data


        $scope.contactform.name = response.data.name
        if (response.data.visitor != null) {
          $scope.contactform.mobile = response.data.visitor.mobile
          $scope.contactform.email = response.data.visitor.email
          $scope.contactform.notes = response.data.visitor.notes
          $scope.contactform.addrs = response.data.visitor.addrs
          $scope.contactform.pinCode = response.data.visitor.pinCode
          $scope.contactform.visitor = response.data.visitor.pk
          $scope.contactform.pk = response.data.visitor.pk

        }



        $scope.user.is_show = false
      })
    }
    $scope.getThread()

    $scope.setToPin = function() {
      $scope.user.is_pin=!$scope.user.is_pin
      $http({
        method: 'PATCH',
        url: '/api/PIM/chatThreads/' + $state.params.id+'/',
        data:{
          is_pin : $scope.user.is_pin
        },
      }).
      then(function(response) {
        $scope.user = response.data
        $rootScope.$broadcast("update", {
        });
      })
    }


    $scope.editThread = function(typ) {

      if (typ == 'title') {
        var data = {
          title: $scope.user.name
        }
      }
      else{
        var data = {
          description: $scope.user.description
        }
      }
      $http({
        method: 'PATCH',
        url: '/api/PIM/chatThreads/' + $state.params.id + '/',
        data: data
      }).
      then(function(response) {
        if (typ == 'title') {
          $scope.showInput = false
        }
        else{
          $scope.description = false
        }
      })
    }







    $scope.addParticipants = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.PIM.addparticipants.html',
        size: 'sm',
        backdrop: true,
        controller: function($scope, $uibModalInstance, $http, $state) {
          $scope.close = function() {
            $uibModalInstance.dismiss()
          }
          $scope.getallUsers = function() {
            $http({
              method: 'GET',
              url: '/api/HR/userSearch/'
            }).
            then(function(response) {
              $scope.allUsers = response.data
              for (var i = 0; i < $scope.allUsers.length; i++) {
                $scope.allUsers[i].add = false
              }
            })
          }
          $scope.getallUsers()
          $scope.form = {
            participants: []
          }
          $scope.data = []
          $scope.adduser = function(indx) {
            if ($scope.allUsers[indx].add == true) {

              $scope.form.participants.push($scope.allUsers[indx].pk)
              $scope.data.push($scope.allUsers[indx])
            }
            $scope.form.participants.splice(indx, 1)
            $scope.data.splice(indx, 1)

          }
          $scope.save = function() {

            $http({
              method: 'PATCH',
              url: '/api/PIM/chatThreads/' + $state.params.id + '/',
              data:$scope.form
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)
            })
          }


        }

      }).result.then(function(data) {

      }, function(data) {
          $scope.getThread()
          $scope.user.is_show = false
      });
    }


  $scope.createChatThread = function(k){
    console.log(k,'99000');
    var data ={
      user:k.pk,
      title:k.first_name,
      company:k.division
    }
    $http({
      method: 'POST',
      url: '/api/PIM/chatThreads/',
      data:data
    }).then(function(response) {

    })
  }

$scope.showInput = false
  $scope.viewDetails = function(){
    $scope.showInput = true


  }

$scope.description = false
  $scope.viewDescription = function(){
      $scope.description = true
  }

  // $scope.saveTitle = function(){
  //   $http({
  //     method: 'PATCH',
  //     url: '/api/PIM/chatThreads/' + $state.params.id + '/',
  //     data:{
  //       title:$scope.user.title
  //     }
  //   }).
  //   then(function(response) {
  //       $scope.showInput = false
  //   })
  // }


  // $scope.$watch('user.dp', function(newValue, oldValue) {
  //   console.log("ddddddddddddddddddddddddddddd", newValue);
  //   if (typeof newValue == 'object') {
  //
  //     // var fd = new FormData();
  //     // if (newValue != emptyFile && newValue != null && typeof newValue!='string') {
  //     //   fd.append('logo', newValue)
  //     // }
  //     // $http({
  //     //   method: 'PATCH',
  //     //   url: '/api/organization/divisions/' + $scope.division.pk + '/',
  //     //   data: fd,
  //     //   transformRequest: angular.identity,
  //     //   headers: {
  //     //     'Content-Type': undefined
  //     //   }
  //     // }).
  //     // then(function(response) {
  //     //   $scope.division.logo = response.data.logo;
  //     // })
  //   }
  // })
  $scope.allFiles = []
  $scope.fileAdded = function(file) {
      // console.log("select file",$scope.data.image,file[0]);
      var filedata = file[0]
      $scope.allFiles.push(filedata)
      $timeout(function() {
        $scope.previewImage($scope.allFiles.length-1)
      },500)
    }

    window.addEventListener("paste", function(e){
    if ($state.is('home.messenger.explore')) {
      var item = Array.from(e.clipboardData.items).find(x => /^image\//.test(x.type));
        var blob = item.getAsFile();
        $scope.allFiles.push(blob)
        $timeout(function() {
          $scope.previewImage($scope.allFiles.length-1)
      },500)
    }
      //
      // var img = new Image();
      //
      // img.onload = function(){
      //     document.body.appendChild(this);
      // };
      //
      // img.src = URL.createObjectURL(blob);
  });
    $scope.filedata = ''
  $scope.previewImage = function(indx){
    $scope.filedata = $scope.allFiles[indx]
    $scope.reader = new FileReader();
    $scope.typ = $scope.filedata['type'].split('/')[0]
    if ($scope.typ == 'image') {
      var image1 =  document.getElementById("imagePreview");

      if (typeof $scope.filedata == 'string' && $scope.filedata.length > 0 ) {
        image1.style.backgroundImage = "url("+$scope.filedata+")";
      }
      $scope.reader.onload = function(e) {
        image1.style.backgroundImage = "url("+e.target.result+")";
      }
      $scope.reader.readAsDataURL($scope.filedata);
    }

  }

  $scope.removeParticipant = function(){
    $http({
      method: 'POST',
      url: '/api/PIM/removeParticipant/',
      data:{
        thread : $state.params.id
      }
    }).
    then(function(response) {
      $scope.getChatthreads()
      if (response.data.pk) {
        $state.go('home.messenger.explore',{id:response.data.pk})
      }

    })

  }


$scope.postFiles = function(){
  $scope.count = 0
  console.log($scope.allFiles);
  for (var i = 0; i < $scope.allFiles.length; i++) {
    $scope.count+=1
    var toSend = new FormData()
    toSend.append('thread', $state.params.id)
    if ($scope.allFiles[i] != emptyFile) {
      toSend.append('attachment', $scope.allFiles[i])
    }
    $http({
      method: 'POST',
      url: '/api/PIM/chatMessage/',
      data: toSend,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.messages.push(response.data)
      $scope.form.file = emptyFile;
      $scope.form.text = ''
      var objDiv = document.getElementById("scrollView");
      console.log(objDiv,'334');
       objDiv.scrollTop = objDiv.scrollHeight+40;

       if ($scope.count == $scope.allFiles.length) {
         $scope.allFiles = []
       }
       if (response.data.uid!=undefined && response.data.uid!=null) {
         connection.session.publish(wamp_prefix+'service.support.chat.' + response.data.uid, ['MF'  , response.data.pk , new Date() ], {}, {
           acknowledge: true
         }).
         then(function(publication) {
           console.log("Published");
         });
       }
       $scope.publish(['F', response.data.pk, $state.params.id])
    })
  }
}

  $scope.closeAtachment = function(){
      $scope.allFiles = []
  }


  $scope.viewImage = function(att){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.PIM.viewImage.html',
      size: 'xxl',
      backdrop: true,
      resolve: {
        att: function() {
          return att;
        },
      },
      controller: function($scope, $uibModalInstance, $http, $state, att) {
        $scope.att = att
        console.log(att);
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }
      }

    }).result.then(function(data) {

    }, function(data) {

    });
  }

  $scope.fileNameChanged = function(file) {
      // console.log("select file",$scope.data.image,file[0]);
      var filedata = file[0]
      var typ = filedata['type'].split('/')[0]
      var fd = new FormData();
      if (filedata != null && filedata != emptyFile) {
        fd.append('dp', filedata)
      }
      $http({
        method: 'PATCH',
        url: '/api/PIM/chatThreads/'+$scope.user.pk+'/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.user.dp = response.data.dp
      })
    }

    $scope.replyMsgSelected = {
      replyMsg:''
    }


    $scope.replyTo = function(indx){
      $scope.replyMsgSelected.replyMsg = $scope.messages[indx]
    }

    $scope.removeReply = function(){
      $scope.replyMsgSelected = {
        replyMsg:''
      }
    }

    $scope.forwardTo = function(indx){
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.PIM.forwardChat.html',
        size: 'md',
        backdrop: true,
        resolve : {
          selectedMsg: function () {
            return $scope.messages[indx];
          },
        },
        controller: function($scope, $uibModalInstance, $http, $state, selectedMsg) {
          $scope.search = {
            searchTxt:''
          }
          $scope.selectedMsg = selectedMsg
          $scope.getChatthreads = function() {
            url = '/api/PIM/chatThreads/'
            if ($scope.search.searchTxt!=null && $scope.search.searchTxt.length > 0) {
              url = url+ '?search='+$scope.search.searchTxt
            }
            $http({
              method: 'GET',
              url: url
            }).
            then(function(response) {
              $scope.chatthreads = response.data
            })

          }
          $scope.getChatthreads()
          $scope.close = function() {
            $uibModalInstance.dismiss()
          }

          $scope.selectChatThread = function(){
            var threads = []
            for (var i = 0; i < $scope.chatthreads.length; i++) {
              if ($scope.chatthreads[i].selected) {
                threads.push($scope.chatthreads[i].pk)
              }
            }
            $http({
              method: 'POST',
              url: '/api/PIM/forwardMeg/',
              data:{
                messageId : $scope.selectedMsg.pk,
                threads:threads
              }
            }).
            then(function(response) {
              $scope.close()
            })
          }
          $scope.addedThreads = []
          $scope.addThreads = function(){
              $scope.addedThreads = []
            for (var i = 0; i < $scope.chatthreads.length; i++) {
              if ($scope.chatthreads[i].selected) {
                $scope.addedThreads.push($scope.chatthreads[i])
              }
            }
          }



        }

      }).result.then(function(data) {

      }, function(data) {

      });
    }

  });



  app.controller("controller.messenger", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal,$rootScope,$timeout) {

  $scope.showUsers = 'chats'
  $scope.me = $users.get('mySelf');

    $scope.search = {
      searchTxt: ''
    }




        $scope.updatePinned = function(pk,val){
          $http({
            method: 'PATCH',
            url: '/api/PIM/chatThreads/' + pk+'/',
            data:{
              is_pin : val
            },
          }).
          then(function(response) {
            $rootScope.$broadcast("update", {
            });
          })
        }


    // $scope.getUsers = function() {
    //   console.log("called");
    //   var params = {}
    //
    //   if ($scope.form.searchTxt.length > 0) {
    //     params.search = $scope.form.searchTxt
    //   }
    //
    //   $http({
    //     url: '/api/PIM/getChatThreads/',
    //     method: 'GET',
    //     params: params
    //   }).then(function(response) {
    //     $scope.users = response.data;
    //   })
    // }
    //
    // $scope.getUsers();


    $scope.getAllUsers = function() {
        url = '/api/HR/userSearch/'

      if ($scope.search.searchTxt!=null && $scope.search.searchTxt.length > 0) {
        url = url+ '?search='+$scope.search.searchTxt
      }
      $http({
        url: url,
        method: 'GET',
      }).then(function(response) {
        $scope.allUsers = response.data;
      })
    }

    $scope.getAllUsers();



    $scope.getChatthreads = function() {
      url = '/api/PIM/chatThreads/'
      if ($scope.search.searchTxt!=null && $scope.search.searchTxt.length > 0) {
        url = url+ '?search='+$scope.search.searchTxt
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.chatthreads = response.data
        if ($scope.chatthreads.length > 0) {
          if ($state.is('home.messenger')) {
            $state.go('home.messenger.explore',{id:$scope.chatthreads[0].pk})
          }

        }
      })

    }

    $rootScope.$on('update', function(event) {
      $scope.getChatthreads()
    });
    $scope.getChatthreads()

    $scope.searchAll = function() {
      if ($scope.showUsers == 'chats') {
          $scope.getChatthreads()
      }
      else{
        $scope.getAllUsers();
      }
    }


  $scope.startnewChat = function(indx){
    $http({
      method: 'POST',
      url: '/api/PIM/createNewChat/',
      data:{
          participant:$scope.allUsers[indx].pk
      }
    }).
    then(function(response) {
      $scope.getChatthreads()
      $scope.showUsers = 'chats'
      $state.go('home.messenger.explore',{id:response.data.pk})
    })
  }


  $scope.changeType = function(typ){
    $scope.showUsers = typ
    if (typ!='groupDetails' && typ!='group') {
      $scope.participants = []
    }
    if (typ=='groupDetails' || typ=='group') {
      $scope.form = {
        dp:emptyFile,
        title:''
      }
    }
    $scope.search = {
      searchTxt: ''
    }
  }
  $scope.participants = []
  $scope.addtochatList = function(indx){
    $scope.participants.push($scope.allUsers[indx])
  }

  $scope.remove = function(indx){
      $scope.participants.splice(indx,1)
  }

  $scope.form = {
    dp:emptyFile,
    title:''
  }

  $scope.fileNameChanged = function(file) {
      // console.log("select file",$scope.data.image,file[0]);
      var filedata = file[0]
      var typ = filedata['type'].split('/')[0]
      if (typ!='image') {
        Flash.create('warning' , 'Add Image')
        return
      }
      // var fd = new FormData();
      if (filedata != null && filedata != emptyFile) {
        $scope.form.dp = filedata
        $scope.reader = new FileReader();
        var image1 =  document.getElementById("image1");
        if (typeof filedata == 'string' && filedata.length > 0 ) {
          image1.style.backgroundImage = "url("+filedata+")";
        }
        $scope.reader.onload = function(e) {
            image1.style.backgroundImage = "url("+e.target.result+")";
        }

        $scope.reader.readAsDataURL(filedata);
      }
  }


  $scope.createGroupChat = function(){
    var participants  = []
    for (var i = 0; i < $scope.participants.length; i++) {
       participants.push($scope.participants[i].pk)
    }
    var toSend = new FormData()
    toSend.append('title', $scope.form.title)
    toSend.append('participants', participants)
    if ($scope.form.dp != emptyFile) {
      toSend.append('dp', $scope.form.dp)
    }

    $http({
      method: 'POST',
      url: '/api/PIM/chatThreads/',
      data: toSend,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.getChatthreads()
      $scope.showUsers = 'chats'
      $state.go('home.messenger.explore',{id:response.data.pk})
    })
  }

  $scope.getMessages = function() {
    $http({
      method: 'GET',
      url: '/api/PIM/chatMessageBetween/?other=' + $state.params.id
    }).
    then(function(response) {
      $scope.messages = response.data

       $timeout(function() {
         var objDiv = document.getElementById("scrollView");
         objDiv.scrollTop = objDiv.scrollHeight+40;

       },500)
    })

  }
  $scope.getMessages()





  });
