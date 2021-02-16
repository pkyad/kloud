var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'ngAside', 'ngDraggable', 'flash', 'chart.js', 'ngTagsInput', 'ui.tinymce', 'hljs', 'mwl.confirm', 'ngAudio', 'uiSwitch', 'rzModule', 'ngMap', 'mentio', 'angular-owl-carousel-2', 'simplemde', 'as.sortable']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide, hljsServiceProvider) {
  hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
    tabReplace: '    '
  });
  $urlRouterProvider.otherwise(DEFAULT_STATE);

  if( window.location.href.indexOf('/admin/#') != -1) homeView = $urlRouterProvider.otherwise('/workforceManagement/employees');

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});



app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams ) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeError", console.log.bind(console));
}]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
// Main controller is mainly for the Navbar and also contains some common components such as clipboad etc
app.controller('main', function($scope, $state, $users, $aside, $http, $timeout, $uibModal,  ngAudio, $rootScope , $interval) {
  console.log('main');

  $scope.openPaymentModal = function(){
  $scope.modalInstance  = $uibModal.open({
      templateUrl: '/static/ngTemplates/app.payment.plan.html',
      size: 'lg',
      backdrop: false,
      controller: function($scope , $uibModalInstance){
        $scope.subscribe = false
        $scope.enterpriseSubscriptionReq =  false
        $scope.updateSubscribe = function(){
          $scope.subscribe = true
        }
        $scope.enterpriseSubscriptionReq = IS_ENTERPRISE_SUBSCRIPTION
        $scope.form = {
          name : '',
          mobile:''
        }
        $scope.save = function(){
          $http({
            method: 'POST',
            url: '/api/HR/updateUrl/',
            data : {
              name : $scope.form.name,
              mobile : $scope.form.mobile
            }
          }).
          then(function(response) {
            $scope.enterpriseSubscriptionReq =  true
          })
        }

      },
    }).result.then(function() {

    }, function() {

    });
  }
  if (IS_FREE_QUOTA_EXCEED) {
    $scope.openPaymentModal()
  }

  $scope.closeModal = function(){
    angular.element('.modal-dialog').hide();
  }



  $scope.openSuspensionNotice = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.disabledNotice.html',
      size: 'md',
      backdrop: false,
      controller: function($scope , $uibModalInstance){

        $scope.divisionName = DIVISION_NAME;
        $scope.dueDate = DUE_DATE;
        $scope.totalDue = TOTAL_DUE


      },
    }).result.then(function() {

    }, function() {
      $scope.getallCheckins()
    });
  }

  if(LOCKED == 'True'){
    $scope.openSuspensionNotice();
  }

  $rootScope.formToggle={toggleMain : false}
    $scope.$watch('formToggle.toggleMain', function(newValue, oldValue) {
      if(newValue!=oldValue){
        $scope.$emit('customEvent', newValue)
        console.log(newValue);
      }
    },true);
  $scope.globalSearch = {
    active : false,
    txt : '',
    results : [],
    createActive : false
  }

  $scope.activateCreate = function() {
    $scope.globalSearch.createActive = true;
  }

  $scope.activateSearch = function() {
    $scope.globalSearch.active = true;
    $scope.globalSearch.txt = '';
    $timeout(function() {
      $('#globalSearchInput').focus();
    },300)
  }


  $scope.$on('activateSearch', function(event, input) {
    $scope.activateSearch();
  });



  // $scope.handleShortcut = function(evt) {
  //   console.log(evt);
  //   if (evt.target.localName == 'div' && (evt.key == 's' || evt.key == 'S')) {
  //     $scope.activateSearch()
  //   }else if (evt.target.localName != 'div' && (evt.key == 'c' || evt.key == 'C')) {
  //     $scope.activateCreate()
  //   }
  //
  //
  // }

  $scope.reloadApps = function() {

    if ($scope.globalSearch.txt.length == 0) {
      mode = 'others'
    }

    $http({method : 'GET' , url : '/api/HR/myApps/' , params : {displayName__icontains : $scope.globalSearch.txt , mode : mode, 'inMenu' : true }}).
    then(function(response) {
      $scope.globalSearch.results = response.data.apps;
      $scope.globalSearch.canAccessSettings = response.data.settings;
    })
  }

  $scope.reloadApps()


  $scope.handleSearchInput = function(evt) {
    if (evt.key == 'Escape') {
      $scope.globalSearch.active = false;
    }else{

      $scope.reloadApps()



    }



  }

  $scope.me = $users.get('mySelf');
  console.log($scope.me);
  $scope.enableTelephony = ENABLE_TELEPHONY;
  $scope.enableMessaing = ENABLE_MESSAGING;
  $scope.headerUrl = '/static/ngTemplates/header.html',
  $scope.sideMenu = '/static/ngTemplates/sideMenu.html',


    $scope.themeObj = {
      main: '#005173',
      highlight: '#04414f'
    };
  $scope.dashboardAccess = false;
  $scope.brandLogo = BRAND_LOGO;
  // $scope.notificationCount = NOTIFICATIONCOUNT;

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }



  $scope.mobileView = false;

  setInterval(function() {

    if ($(window).width() < 600) {
      document.getElementById('mainUI').addEventListener('click', function() {
        if ($(window).width() < 600) {
          $scope.sideMenuVisibility = false
        }

      })

      $scope.mobileView = true;
      if (!$scope.sideMenuVisibility) {
        document.getElementById('navbarTop').style.margin = '0%';
        document.getElementById('mainUIParent').style.width = '100%';
        document.getElementById('sideMenu').style.display = 'none'
      }
    } else {
      $scope.mobileView = false;
    }
  }, 10)
  // $(window).on('mouseover', function() {
  //
  // })


  $scope.onHover = false;
  console.log($scope.onHover);
  $scope.sideMenuVisibility = false;
  // retrive it back

  $http({
    method: 'GET',
    url: '/api/PIM/settings/' + $scope.me.settings + '/'
  }).
  then(function(response) {
    for (key in response.data.theme) {
      if (key != 'url') {
        if (response.data.theme[key] != null) {
          $scope.themeObj[key] = response.data.theme[key];
        }
      }
    }
  }, function(response) {});

  $scope.sound = ngAudio.load("/static/audio/notification.ogg");

  $scope.theme = ":root { --themeMain: " + $scope.themeObj.main + ";--headerNavbarHighlight:" + $scope.themeObj.highlight + "; }";
  $scope.$watchGroup(['themeObj.main', 'themeObj.highlight'], function(newValue, oldValue) {
    $scope.theme = ":root { --themeMain: " + $scope.themeObj.main + ";--headerNavbarHighlight:" + $scope.themeObj.highlight + "; }";
  })

  $scope.terminal = {
    command: '',
    show: false,
    showCommandOptions: false,
    showNotitications: false
  };

  $scope.about = function() {
    var modalInstance = $uibModal.open({
      templateUrl: '/static/ngTemplates/about.html',
      size: 'lg',
      controller: function($scope) {},
    });
  };

  $scope.commandOptionsClicked = function(action) {
    if (action == 'im') {
      $scope.addIMWindow($scope.terminal.command.pk)
    } else if (action == 'social') {
      $state.go('home.social', {
        id: $scope.terminal.command.pk
      })
    }
    $scope.terminal = {
      command: '',
      show: false,
      showCommandOptions: false
    };
  }

  $scope.userSearch = function(query) {
    if (!query.startsWith('@')) {
      return;
    }
    var searchQuery = query.split('@')[1]
    if (searchQuery.length == 0) {
      return;
    }
    return $http.get('/api/HR/userSearch/?username__contains=' + searchQuery).
    then(function(response) {
      return response.data;
    })
  };
  $scope.getName = function(u) {
    if (typeof u == 'undefined' || u == null || u.username == null || typeof u.first_name == 'undefined') {
      return '';
    }
    return '@ ' + u.first_name + '  ' + u.last_name;
  }

  $scope.$watch('terminal.command.username', function(newValue, oldValue) {
    console.log(newValue);
    if (typeof newValue != 'undefined') {
      $scope.terminal.showCommandOptions = true;
    }
  });

  $scope.parseCommand = function() {
    if ($scope.terminal.command == '') {
      $scope.terminal.show = false;
      return;
    }
    // parse the command
    // possible commands for the calendar app :
    // 'remind me to ask bill for the report on the project'
    // arrange a meeting with @team ELMS at 2 pm on alternate working day
    // todo code review by EOD
    var cmd = $scope.terminal.command;
    if (typeof cmd == 'string' && cmd.startsWith('@')) {
      // user is searching for a user



    }

  };


  $scope.$watch('terminal.show', function(newValue, oldValue) {
    // once the termial is visible the timer starts , after 150 seconds is there is no command
    // in the termial then the terminal is closed
    if (newValue == false) {
      return;
    }
    $timeout(function() {
      if ($scope.terminal.command.length == 0) {
        $scope.closeTerminal();
      }
    }, 150000);
  });

  $scope.closeTerminal = function() {
    if ($scope.terminal.command.length == 0) {
      $scope.terminal.show = false;
    }
  }



  settings = {
    theme: $scope.themeObj,
    mobile: $scope.me.profile.mobile
  };
  $scope.openSettings = function(position, backdrop, data) {
    $scope.asideState = {
      open: true,
      position: position
    };

    function postClose() {
      $scope.asideState.open = false;
      $scope.me = $users.get('mySelf', true)
    }

    $aside.open({
      templateUrl: '/static/ngTemplates/settings.html',
      placement: position,
      size: 'md',
      backdrop: backdrop,
      controller: function($scope, $uibModalInstance, $users, $http, Flash) {
        emptyFile = new File([""], "");
        $scope.settings = settings;
        $scope.settings.displayPicture = emptyFile;
        $scope.me = $users.get('mySelf');
        $scope.statusMessage = '';
        $scope.settings.oldPassword = '';
        $scope.settings.password = '';
        $scope.settings.password2 = '';
        $scope.cancel = function(e) {
          $uibModalInstance.dismiss();
          // e.stopPropagation();
        };

        $scope.changePassword = function() {
          if ($scope.settings.password != '' && $scope.settings.password2 == $scope.settings.password && $scope.settings.oldPassword != '') {
            $http({
              method: 'PATCH',
              url: '/api/HR/users/' + $scope.me.pk + '/',
              data: {
                password: $scope.settings.password,
                oldPassword: $scope.settings.oldPassword
              }
            }).
            then(function(response) {
              Flash.create('success', response.status + ' : ' + response.statusText);
            }, function(response) {
              Flash.create('danger', response.status + ' : ' + response.statusText);
            });
          }
        }

        $scope.saveSettings = function() {
          var fdProfile = new FormData();
          if ($scope.settings.displayPicture != emptyFile) {
            fdProfile.append('displayPicture', $scope.settings.displayPicture);
          }
          if (isNumber($scope.settings.mobile)) {
            fdProfile.append('mobile', $scope.settings.mobile);
          }
          $http({
            method: 'PATCH',
            url: '/api/HR/profile/' + $scope.me.profile.pk + '/',
            data: fdProfile,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            $http({
              method: 'PATCH',
              url: '/api/PIM/settings/' + $scope.me.settings + '/',
              data: {
                presence: "Busy",
                user: $scope.me.pk
              }
            }).
            then(function(response) {
              $http({
                method: 'PATCH',
                url: '/api/PIM/theme/' + response.data.theme.pk + '/',
                data: $scope.settings.theme
              }).
              then(function(response) {
                $scope.changePassword();
                Flash.create('success', response.status + ' : ' + response.statusText);
              }, function(response) {
                $scope.changePassword();
                Flash.create('danger', response.status + ' : ' + response.statusText);
              });
            });
          });

        }
      }
    }).result.then(postClose, postClose);
  }


  $scope.showNotifications = function(user){
    console.log(user.pk, 'usersasdasdasda');
    $aside.open({
      templateUrl: '/static/ngTemplates/app.notificationtray.html',
      placement: 'left',
      size: 'lg',
      controller: function($scope, $uibModalInstance, $users, $http, Flash, $sce) {
        $scope.query = "";
        $scope.getAllData = function() {
          $http({
            method: 'GET',
            url: '/api/PIM/notification/?user='+user.pk
          }).
          then(function(response) {
            $scope.notificationsData = response.data;
          })
        }
        $scope.getAllData()

        $scope.saveAsRead = function(index, t) {
          console.log(index, t, 'asdasdasdsda');
          $http({
            method: 'PATCH',
            url: '/api/PIM/notification/'+t.pk+'/',
            data:{'read':true}
          }).
          then(function(response) {
            $scope.notificationsData[index] = response.data;
          })
        }
      }
    }).result.then(function () {

    }, function () {
      $scope.getAllNot()
    });


  }
  $scope.createNotification = function(user, type){
    $http({
      method: 'POST',
      url: '/api/PIM/createNotification/',
      data:{'user':user.pk,'type':type}
    }).
    then(function(response) {
      Flash.create('success','Successfully sent data request.')
    })

  }
  $scope.downloadDailyCallReport = function(user){
    window.open('/api/marketing/downloadDailyCallReport/?user='+ user.pk,_blank = true)
  }


  $scope.me = $users.get('mySelf');


  $scope.fetchNotifications = function(signal) {
    // By default the signal is undefined when the user logs in. In that case it fetches all the data.
    // signal is passed by the WAMP processor for real time notification delivery.
    // console.log("going to fetch notifications");
    // console.log(toFetch);
    // console.log(signal);
    var url = '/api/PIM/notification/';
    $scope.method = 'GET';
    // $scope.sound.play();
    if (typeof signal != 'undefined') {
      url = url + signal.pk + '/';
      if (signal.action == 'deleted') {
        for (var i = 0; i < $scope.rawNotifications.length; i++) {
          if ($scope.rawNotifications[i].pk == signal.pk) {
            // console.log("found");
            $scope.rawNotifications.splice(i, 1);
          }
        }
        $scope.refreshNotification();
      } else {

        $http({
          method: $scope.method,
          url: url
        }).
        then(function(response) {
          var notification = response.data;
          $scope.rawNotifications.unshift(notification);
          $scope.refreshNotification();
        });
      }
      return;
    };
    $scope.rawNotifications = [];
    $http({
      method: $scope.method,
      url: url
    }).
    then(function(response) {
      $scope.rawNotifications = response.data;
      $scope.refreshNotification();
    });
  };

  $scope.refreshNotification = function() {
    var notificationParent = [];
    $scope.notifications = [];
    for (var i = 0; i < $scope.rawNotifications.length; i++) {
      var notification = $scope.rawNotifications[i];
      var parts = notification.title.split(':');
      var parentPk = parts[2];
      var notificationType = parts[0];
      var parentNotificationIndex = notificationParent.indexOf(parentPk + ':' + notificationType);
      if (parentNotificationIndex == -1) { // this is new notification for this parent of notification type
        $scope.rawNotifications[i].hide = false;
      } else { // there is already a notification for this parent
        $scope.rawNotifications[i].hide = true
      };
      notificationParent.push(parentPk + ':' + notificationType);
    }
    for (var i = 0; i < $scope.rawNotifications.length; i++) {
      var notification = $scope.rawNotifications[i];
      if (notification.hide == false) {
        notification.multi = false;
        for (var j = i + 1; j < $scope.rawNotifications.length; j++) {
          if (notificationParent[j] == notificationParent[i]) {
            notification.multi = true;
            break;
          }
        }
        $scope.notifications.push(notification)
      }
    }
    $scope.notificationsCount = 0;
    for (var i = 0; i < $scope.notifications.length; i++) {
      if (!$scope.notifications[i].read) {
        $scope.notificationsCount += 1;
      }
    }
  };

  $scope.notificationClicked = function(pk) {
    // one the notification was clikced the directive will call this function. here i will mark the notification in the dropdown read
    for (var i = 0; i < $scope.rawNotifications.length; i++) {
      if ($scope.rawNotifications[i].pk == pk) {
        $scope.rawNotifications[i].read = true;
      }
    }
    $scope.refreshNotification();
  }

  $scope.refreshMessages = function() {
    $scope.ims = [];
    $scope.instantMessagesCount = 0;
    peopleInvolved = [];
    for (var i = 0; i < $scope.rawMessages.length; i++) {
      var im = $scope.rawMessages[i];
      if (im.originator == $scope.me.pk) {
        if (peopleInvolved.indexOf(im.user) == -1) {
          peopleInvolved.push(im.user)
        }
      } else {
        if (peopleInvolved.indexOf(im.originator) == -1) {
          peopleInvolved.push(im.originator)
        }
      }
    }
    for (var i = 0; i < peopleInvolved.length; i++) {
      for (var j = 0; j < $scope.rawMessages.length; j++) {
        var im = $scope.rawMessages[j];
        var friend = peopleInvolved[i];
        if (friend == im.originator || friend == im.user) {
          count = 0;
          for (var k = 0; k < $scope.rawMessages.length; k++) {
            im2 = $scope.rawMessages[k]
            if ((im2.originator == friend || im2.user == friend) && im2.read == false) {
              count += 1;
            }
          }
          if (count != 0) {
            $scope.instantMessagesCount += 1;
          }
          im.count = count;
          $scope.ims.push(im);
          break;
        }
      }
    }
  }

  $scope.fetchMessages = function() {
    // This is because the chat system is build along with the notification system. Since this is the part whcih is common accros all the modules
    $scope.method = 'GET';
    $scope.url = '/api/PIM/chatMessage/';
    $scope.ims = [];
    var senders = [];

    $http({
      method: $scope.method,
      url: $scope.url
    }).
    then(function(response) {
      // console.log(response.data);
      $scope.rawMessages = response.data;
      $scope.refreshMessages();
    });
  };
  $scope.fetchNotifications();
  $scope.fetchMessages();

  $scope.imWindows = []

  $scope.addIMWindow = function(pk) {
    // console.log(pk);
    url = $users.get(pk).url;
    for (var i = 0; i < $scope.rawMessages.length; i++) {
      if ($scope.rawMessages[i].originator == pk && $scope.rawMessages[i].read == false) {
        $scope.rawMessages[i].read = true;
      }
    }
    $scope.refreshMessages();
    if ($scope.imWindows.length <= 4) {
      for (var i = 0; i < $scope.imWindows.length; i++) {
        if ($scope.imWindows[i].url == url) {
          return;
        }
      }
      me = $users.get("mySelf");
      if (url != me.url.split('?')[0]) {
        friend = $users.get(url)
        $scope.imWindows.push({
          url: url,
          username: friend.username
        });
      }
    }
  }
  $scope.fetchAddIMWindow = function(msgPK) {
    $scope.sound.play();
    $http({
      method: 'GET',
      url: '/api/PIM/chatMessage/' + msgPK + '/?mode='
    }).
    then(function(response) {
      $scope.addIMWindow(response.data.originator)
      response.data.read = true;
      $scope.rawMessages.unshift(response.data);
      $scope.refreshMessages()
    });
  };


  $scope.closeIMWindow = function(pos) {
    $scope.imWindows.splice(pos, 1);
  }



  $scope.createChart = function(a, idx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.dashboard.newChartForm.html',
      size: 'md',
      resolve : {
        fData: function() {
          return a
        },
        chartIdx: function() {
          return idx
        },
      },
      controller: function($scope, $http, $uibModalInstance, Flash, fData, chartIdx){
        $scope.formData = fData

        $timeout(function() {
          $scope.editor1 = ace.edit('aceEditor');
          $scope.editor1.setTheme("ace/theme/XCode");
          $scope.editor1.getSession().setMode("ace/mode/python");
          $scope.editor1.getSession().setUseWorker(false);
          $scope.editor1.setHighlightActiveLine(false);
          $scope.editor1.setShowPrintMargin(false);
          ace.require("ace/ext/language_tools");
          $scope.editor1.setOptions({
              enableBasicAutocompletion: true,
              enableSnippets: true
          });
           $scope.editor1.setFontSize("14px");
          $scope.editor1.setBehavioursEnabled(true);
          if ($scope.formData != undefined) {
            $scope.editor1.setValue($scope.formData.query, -1);
          }
        },300)



        $scope.chartTypeList = ['Bar', 'Pie', 'Doughnut', 'Line', 'Table']
        $scope.form = {
          enabled : true,
          name : '',
          chartType : '',
          query : '',
          pk : null,
        }

        $scope.setDefault = function(newValue){
          if (newValue == 'Pie') {
            $scope.editor1.setValue("data = {\n    \"labels\" : [\"Download Sales\", \"In-Store Sales\", \"Mail-Order Sales\", \"New Sales\"],\n    \"values\" : [300, 600, 100, 700],\n    \"series\" : ''\n    }", -1);
          }else if (newValue == 'Bar') {
            $scope.editor1.setValue("data = {\n    \"labels\" : ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],\n    \"values\" : [\n         [28, 48, 40, 19, 86, 27, 90],\n         [4, 67, 11, 56, 9, 78, 4]\n    ],\n    \"series\" : [\"Series A\", \"Series B\"]\n    }", -1);
          }else if (newValue == 'Doughnut') {
            $scope.editor1.setValue("data = {\n    \"labels\" : [\"P1\", \"P2\", \"P3\"],\n    \"values\" : [180, 450, 2000],\n    \"series\" : ''\n    }", -1);
          }else if (newValue == 'Line') {
            $scope.editor1.setValue("data = {\n    \"labels\" : [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\"],\n    \"values\" : [\n        [65, 59, 80, 81, 56, 55, 40],\n        [28, 48, 40, 19, 86, 27, 90],\n        [10, 01, 01, 10, 10, 01, 10]\n     ],\n     \"series\" : ['Series A', 'Series B'],\n    }", -1);
          }else if (newValue == 'Table') {
            $scope.editor1.setValue("data = {\n    \"labels\" : [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\"],\n    \"values\" : [\n        [65, 59, 80, 81, 56, 55, 40],\n        [28, 48, 40, 19, 86, 27, 90],\n        [10, 01, 01, 10, 10, 01, 10]\n     ],\n     \"series\" : ['Series A', 'Series B'],\n    }", -1);
          }
        }
        if ($scope.formData != undefined) {
          $scope.form = $scope.formData
        }

        $scope.deleteChart = function(){
          $http({
            method: 'DELETE',
            url: '/api/organization/homeChart/' + $scope.formData.id + '/'
          }).
          then(function(response) {
            Flash.create('warning', 'Chart Deleted')
            $uibModalInstance.dismiss()
          })
          .result.then(function() {
          }, function() {
              $scope.getChart()
          });
        }

        $scope.close = function(){
          $uibModalInstance.dismiss()
        }

        $scope.submit = function() {
          if ($scope.form.name == '') {
            Flash.create('warning', 'Enter the name')
            return
          }
          if ($scope.form.chartType == '') {
            Flash.create('warning', 'Select the chart type')
            return
          }

          var toSend = {
            enabled : $scope.form.enabled,
            name : $scope.form.name,
            chartType : $scope.form.chartType,
            query :$scope.editor1.getValue(),
            division :DIVISIONPK,
          }

          if ($scope.formData != undefined) {
            var method = 'PATCH'
            var url = '/api/organization/homeChart/' + $scope.formData.id + '/'
          } else {
            var method = 'POST'
            var url = '/api/organization/homeChart/'
          }

          $http({
            method: method,
            url: url,
            data: toSend,
          }).
          then(function(response) {
            $scope.chartType = response.data.chartType
            $uibModalInstance.dismiss($scope.chartType)
          })
        }
      },
    })
    .result.then(function() {
    }, function(chartType) {
      if (chartType != 'backdrop click') {
        $scope.getChart()
      }
    });
  }

  $scope.downloadChart = function(id){
    window.open('/api/organization/downloadChart/?id=' + id, "_blank");
  }

  $scope.itemsList = {
    items1: [],
    items2: [],
  };
  $scope.getChart = function(){
    $http({
        method: 'GET',
        url: '/api/organization/dashboardData/',
      }).
      then(function(response) {
        if (response.data.length >= 2) {
          $scope.set1 = response.data.length/2
        } else {
          $scope.set1 = response.data.length
        }
        $scope.itemsList.items1 = response.data.slice(0, $scope.set1)
        $scope.itemsList.items2 = response.data.slice($scope.set1, response.data.length);
    });
  }

  $scope.getChart();

  $scope.sortableOptions = {
    containment: '#grid-container'
  };


  $scope.list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']


});

app.controller('controller.generic.menu', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  // settings main page controller

  var parts = $state.current.name.split('.');
  $scope.moduleName = parts[0];
  $scope.appName = parts[1];

  var getState = function(input) {
    var parts = input.name.split('.');
    // console.log(parts);
    return input.name.replace('app', $scope.moduleName)
  }

  $scope.apps = [];
  $scope.rawApps = [];


  $scope.goToRoot = function() {
    $state.go($scope.moduleName + '.' + $scope.appName)
  }

  $scope.isActive = function(index) {
    var app = $scope.apps[index]
    if (angular.isDefined($state.params.app)) {
      return $state.params.app == app.name.split('.')[2]
    } else {
      return $state.is(app.name.replace('app', $scope.moduleName))
    }
  }

});
CURRENT_LINE = null;
// Main controller is mainly for the Navbar and also contains some common components such as clipboad etc
app.controller('sideMenu', function($scope, $http, $aside, $state, Flash, $users, $filter,  $rootScope, $interval, $timeout , $uibModal) {


  $scope.activateSearch = function() {
    $rootScope.$broadcast("activateSearch", {});
  }

  $scope.adminOrManageMode = false;

  if(window.location.href.indexOf('manager/#') != -1 || window.location.href.indexOf('admin/#') != -1){
    $scope.adminOrManageMode = true;
  }

  $scope.goHome = function(){
    $state.go(HOME_STATE)
  }



  $scope.dial = function(num) {
    $scope.dialer.editor += num;
    console.log(num);
  }

  $scope.dialer = {
    editor: '',
    number: '',
    status: 'idle',
    timer : '',
    onHold: false,
    active : false,
    campaign : null,
    direction : 'out',
    dialPad : false
  }
  $scope.refreshEmail = function() {
    $scope.mailer = {
      cc: false,
      ccAddress: [],
      toAddress: [],
      toggle: false,
      active: false,
      body: '',
      subject: '',
      options: {
        selector: 'textarea',
        content_css: '/static/css/bootstrap.min.css',
        inline: false,
        plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
        skin: 'lightgray',
        theme: 'modern',
        height: 380,
        menubar: false,
        statusbar: false,
        toolbar: ' undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | bold italic underline| link',
      },
      files: [],
      templateFiles: [],
      file: new File([""], ""),
      contact: null,
      contactName: ''
    }
  }
  $scope.refreshEmail()

  $scope.hold = function() {
    if (!$scope.dialer.onHold) {
      holdSession($scope.lineObj)
      $scope.dialer.onHold = true;
    }else{
      unholdSession($scope.lineObj)
      $scope.dialer.onHold = false;
    }
  }

  $scope.disconnecCall = function() {
    if ($scope.dialer.status == 'Connected') {
      endSession($scope.lineObj)
    }else{
      cancelSession($scope.lineObj)
    }

    $scope.dialer.number = '';
    $scope.dialer.status = 'idle';
    $scope.dialer.onHold = false;
    $scope.dialer.active = false;
  }

  $scope.recentCalls = []
  $scope.call = function(num) {
    if (num.length == 10) {
      $scope.recentCalls.push(num)
      $rootScope.$broadcast("call", {type : 'call' , number : num , source : 'dialPad'  });
    }else {
      Flash.create('warning','Enter the correct mobile number ')
    }
  }

  $scope.call('9702438730')


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


  // $scope.dialer.direction = 'in';
  // $scope.dialer.number = '321312312';
  // $scope.dialer.active = true;
  // $scope.dialer.onHold = false;
  // $scope.dialer.status = 'Incoming';

  $scope.answerCall = function() {
    console.log("answer btn clicked");
    AnswerAudioCall($scope.buddyObj)
  }

  $scope.reject = function() {
    RejectCall($scope.buddyObj)
    $scope.dialer.number = '';
    $scope.dialer.status = 'idle';
    $scope.dialer.onHold = false;
    $scope.dialer.active = false;
  };

  window.addEventListener("message", function(evt) {

    if (evt.data.status == undefined) {
      console.log("Returning for the data :" , evt.data );
      console.log(evt.data);
      return;
    }

    var status = evt.data.status;
    if (status == 'terminated') {

      if ($scope.dialer.timer.length > 0) {
        console.log("will dial next number");
        $rootScope.$broadcast("campaignUpdate", {type : 'next' , id : $scope.dialer.campaign });
      }

      $scope.dialer.number = '';
      $scope.dialer.status = 'idle';
      $scope.dialer.onHold = false;
      $scope.dialer.active = false;
      $scope.dialer.timer = ''


    }else if (status == 'timer') {
      $scope.dialer.timer = evt.data.time;
      $scope.dialer.status = 'Connected';

    }else if (status == 'accepted') {
      $scope.dialer.onHold = false;
      $scope.dialer.status = 'Connected';
    }else if (status == 'sendrecv') {

    }else if (status == 'incomming') {
      $scope.dialer.direction = 'in';
      $scope.dialer.number = evt.data.number;
      $scope.dialer.active = true;
      $scope.dialer.onHold = false;
      $scope.dialer.status = 'Incoming';
      $scope.buddyObj = evt.data.buddy;
    }else if (status == 'lineUpdate') {
      $scope.lineObj = evt.data.line;
    }




  }, false);

  $scope.openSwitcher = function(){
    $state.go('home.viewProfile.profile');
  }

  var mode = 'recent'
  if (APP_NAME.length > 0) {
    mode = APP_NAME
  }
  $http({
    method: 'GET',
    url: '/api/HR/myApps/',
    params : {mode : mode}
  }).
  then(function(response) {
    $scope.filter.menuApps = response.data.apps;
    console.log({ menuApps : response.data});
  })


  $scope.isMedium= false
  if (screen.width >= 1279 && screen.width <= 1439) {
    $scope.isMedium= true
    console.log($scope.filter,'kkk');

  }
  $scope.filter = {
    searchTxt: '',
    menuApps : []
  }

  $scope.user = $users.get('mySelf');

  $scope.SHOW_COMMON_APPS = SHOW_COMMON_APPS;

  $scope.fixedApps = [
    // {icon : 'home' , state : 'home'},
    // {icon : 'envelope-o' , state : 'home.mail'},
    // {
    //   icon: 'calendar',
    //   state: 'home.calendar'
    // },
    {
      icon: 'comments-o',
      state: 'home.notes'
    },
  ]


  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
    $http({
      method: 'POST',
      url: '/api/HR/updateUrl/',
      data: {
        state : $state.current.name,
        url : window.location.href,
        params : $state.params,
        profile : $scope.user.profile.pk
      },
    }).
    then(function(response) {

    })
  });

  $scope.inExcludedApps = function(a) {
    var apps = ['app.mail', 'app.calendar', 'app.dashboard', 'app.notes', 'app.users']
    for (var i = 0; i < apps.length; i++) {
      if (a.name == apps[i]) {
        return true;
      }
    }
    return false;
  }

  var getState = function(input) {
    var parts = input.name.split('.');
    if (parts[0] == 'sudo') {
      return input.name.replace('sudo', $scope.moduleName)
    } else {
      return input.name.replace('app', $scope.moduleName)
    }
  }

  $scope.getIcon = function() {
    if ($scope.rawApps.length == 0) {
      return ''
    } else {
      for (var i = 0; i < $scope.rawApps.length; i++) {
        if ($scope.rawApps[i].name == 'app.' + $scope.appName) {
          return $scope.rawApps[i].icon;
        }
      }
    }
  };

  $scope.goToRoot = function() {
    $state.go($scope.moduleName + '.' + $scope.appName)
  }

  $scope.isActive = function(index) {
    var app = $scope.apps[index]
    if (angular.isDefined($state.params.app)) {
      return $state.params.app == app.name.split('.')[2]
    } else {
      return $state.is(app.name.replace('app', $scope.moduleName))
    }
  }

  $scope.viewTemplates = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.viewtemplates.html',
      placement: 'right',
      size: 'lg',
      controller: function($scope, $uibModalInstance, $users, $http, Flash, $sce) {
        $scope.query = "";
        $scope.getAllData = function() {
          $http({
            method: 'GET',
            url: '/api/clientRelationships/emailTemplate/?title__icontains=' + $scope.query
          }).
          then(function(response) {
            $scope.templates = response.data;
            for (var i = 0; i < $scope.templates.length; i++) {
              $scope.templates[i].htmltemplate = $sce.trustAsHtml($scope.templates[i].template)
            }
          })
        }
        $scope.getAllData()

        $scope.selectTemplate = function(t) {
          $uibModalInstance.dismiss(t)
        }
      }
    }).result.then(function() {

    }, function(t) {
      $scope.mailer.body = t.template
      $scope.mailer.subject = t.title
      if ($scope.mailer.contactName!=null&&$scope.mailer.contactName!=''&&$scope.mailer.contactName.length > 0) {
        $scope.mailer.body = $scope.mailer.body.replace('{{name}}', $scope.mailer.contactName);
      } else {
        $scope.mailer.body = $scope.mailer.body.replace('{{name}}', "");
      }
      $scope.mailer.body = '<p>' + $scope.mailer.body + '<br/>' + $scope.mailer.fromAddress.signature + '</p>'
    })
  }

  $scope.addFile = function() {
    var fd = new FormData();
    fd.append('attachment', $scope.mailer.file);
    console.log($scope.mailer);
    fd.append('user', $scope.me.pk);
    $http({
      method: 'POST',
      url: '/api/mail/attachment/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      response.data.filename = response.data.attachment.split('_' + $scope.me.username + '_')[1];
      $scope.mailer.files.push(response.data)
      $scope.mailer.file = new File([""], "");
    });
  }

  $rootScope.$on('sendInvoice', function(evt, contract) {
    console.log(evt , contract);
    if (contract.contract != undefined) {
      $scope.mailer.contact = contract.contact
      $scope.mailer.contactName = contract.name
      var url = '/api/clientRelationships/sendEmailAttach/?contract=' + contract.contract
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        if (contract.email.length > 0) {
          $scope.mailer.toAddress.push({
            'email': contract.email
          })
        }
        $scope.mailer.files.push(response.data)
        $scope.mailer.file = new File([""], "");
        $scope.mailer.toggle = true
        $scope.mailer.active = true
      })
    }
  });

  $rootScope.$on('scheduleInterview', function(evt, candidate) {
    console.log(evt , candidate);
    // if (contract.contract != undefined) {
      // $scope.mailer.contact = contract.contact
      $scope.mailer.contactName = candidate.name
      // var url = '/api/clientRelationships/sendEmailAttach/?contract=' + contract.contract
      // $http({
      //   method: 'GET',
      //   url: url
      // }).
      // then(function(response) {
        if (candidate.email.length > 0) {
          $scope.mailer.toAddress.push({
            'email': candidate.email
          })
        }
        $scope.mailer.files = []
        $scope.mailer.file = new File([""], "");
        $scope.mailer.toggle = true
        $scope.mailer.active = true
      // })
    // }
  });

  $scope.attach = function() {
    $('#attach').click()
  };

  $scope.$watch('mailer.file' , function(newValue , oldValue) {
    if (newValue.size > 0) {
      $scope.addFile()

    }
  })
  $scope.emailIds = []
  $scope.getUserEmails = function() {
    $http({
      method: 'GET',
      url: '/api/mail/accountlite/?user=' + $scope.me
    }).
    then(function(response) {
      $scope.emailIds = response.data
      if($scope.emailIds.length>0){
        $scope.mailer.fromAddress = $scope.emailIds[0]
        $scope.mailer.body = '<p>' + $scope.mailer.body + '<br/>' + $scope.mailer.fromAddress.signature + '</p>'
      }
    })
  }
  $scope.changeSignature = function() {
    $scope.mailer.body = '<p>' + $scope.mailer.body + '<br/>' + $scope.mailer.fromAddress.signature + '</p>'
  }
  $scope.getUserEmails()
  $scope.sendingEmail = false
  $scope.sendMail = function() {


    var attachments = [];
    for (var i = 0; i < $scope.mailer.files.length; i++) {
      attachments.push($scope.mailer.files[i].pk);
    }

    // var attachmentTemplates = [];
    // for (var i = 0; i < $scope.mailer.added.length; i++) {
    //   attachmentTemplates.push( $scope.mailer.added[i].pk);
    // }

    var fd = new FormData();
    if ($scope.mailer.subject == undefined || $scope.mailer.subject.length == 0) {
      Flash.create('danger', 'Subject is required');
      return;
    }
    fd.append('subject', $scope.mailer.subject);
    if ($scope.mailer.bodyFormat == 'plain') {
      fd.append('body', $scope.mailer.plainBody);
      var body = $scope.mailer.plainBody
    } else {
      fd.append('body', $scope.mailer.body);
      var body = $scope.mailer.body
    }
    if (typeof $scope.mailer.toAddress == 'undefined' || $scope.mailer.toAddress.length <= 0) {
      Flash.create('danger', 'No reciepient specified');
      return;
    } else {
      to = []
      for (var i = 0; i < $scope.mailer.toAddress.length; i++) {
        to.push($scope.mailer.toAddress[i].email)
      }
      fd.append('to', to);
    }
    if ('ccAddress' in $scope.mailer && $scope.mailer.ccAddress.length > 0) {
      for (var i = 0; i < $scope.mailer.ccAddress.length; i++) {
        cc = []
        cc.push($scope.mailer.ccAddress[i].email)
      }
      fd.append('cc', cc);
    }
    // if ('bcc' in $scope.mailer && $scope.mailer.bcc.length > 2) {
    //   fd.append('bcc' , $scope.mailer.bcc);
    // }
    if (attachments.length > 0) {
      fd.append('attachments', attachments);
    }
    if (typeof $scope.mailer.fromAddress == 'object') {
      fd.append('account', $scope.mailer.fromAddress.pk);
    }

    if ($scope.mailer.contact != null) {
      fd.append('contact', $scope.mailer.contact);
    }
    // if (attachmentTemplates.length > 0) {
    //   fd.append('attachmentTemplates' , attachments);
    // }

    $scope.editor = false;
    $scope.sendingEmail = true
    $http({
      method: 'POST',
      url: '/api/mail/send/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      if (response.status == 200) {
        $scope.sendingEmail = false
        Flash.create('success', response.status + ' : ' + response.statusText);
        $scope.refreshEmail()
      } else {
        Flash.create('danger', response.status + ' : ' + response.statusText);
      }
    });
  }


})

//==========================Attendance controller open ====================

app.controller('ctrl.home.attendance.aside', function($scope, $state, $users, $stateParams, $http, Flash, $timeout,$uibModal) {
  // $scope.baseUrl = '/api/PIM/home/myWork/';
  console.log('vbdhsfhbfhsbhfsbjfdbjfdbsjfd');
  $scope.me = $users.get('mySelf'); //hit api and get user who is logged in
  $scope.userform = {
    user: $scope.me
  }
  $scope.getUserAttendance = function() {
    //http get request to hit the api and fetch user data. we send user pk and date for which we need data.
    $http({
      method: 'GET',
      url: '/api/employees/fetchAttendance/?user=' + $scope.userform.user.pk + '&date=' + $scope.dateDisp.toJSON().split('T')[0],
    }).
    then(function(response) {
      // console.log(response.data,'resssssssssssss');
      $scope.values = response.data.valList
      $scope.timeList = response.data.timeList
      $scope.leavetype = response.data.leavetype
    })
    // console.log($scope.dateDisp, '7777777777777777');
    // console.log($scope.userform);
  }

  $scope.listOfDays = [{
    "val": 1,
    "disp": "Sunday"
  }, {
    "val": 1,
    "disp": "Monday"
  }, {
    "val": 1,
    "disp": "Tuesday"
  }, {
    "val": 1,
    "disp": "Wednesday"
  }, {
    "val": 1,
    "disp": "Thursday"
  },
  {
    "val": 1,
    "disp": "Friday"
  }, {
    "val": 1,
    "disp": "Saturday"
  }
];

var calDate = new Date(); // the current date value known to the calendar, also the selected. For a random month its 1st day of that month.
var calMonth = calDate.getMonth(); // in MM format
var calYear = calDate.getFullYear(); // in YYYY format

$scope.itemInView = [];
datesMap = getDays(calMonth, calYear);
$scope.dates = datesMap.days;
$scope.dateFlags = datesMap.flags;
$scope.dateDisp = calDate;
$scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp; // Find equivalent day name from the index
$scope.getUserAttendance()


$scope.gotoToday = function() {
  var calDate = new Date(); // current day
  calMonth = calDate.getMonth();
  calYear = calDate.getFullYear();
  $scope.dateDisp = calDate;
  $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
  datesMap = getDays(calMonth, calYear);
  $scope.dates = datesMap.days;
  $scope.dateFlags = datesMap.flags;
  $scope.getUserAttendance()
};
$scope.gotoNext = function() {
  calMonth += 1;
  calDate.setFullYear(calYear, calMonth, 1);
  datesMap = getDays(calMonth, calYear);
  $scope.dates = datesMap.days;
  $scope.dateFlags = datesMap.flags;
  $scope.dateDisp = calDate;
  $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
  $scope.getUserAttendance()
};
$scope.gotoPrev = function() {
  calMonth -= 1;
  calDate.setFullYear(calYear, calMonth, 1);
  datesMap = getDays(calMonth, calYear);
  $scope.dates = datesMap.days;
  $scope.dateFlags = datesMap.flags;
  $scope.dateDisp = calDate;
  $scope.dayDisp = $scope.listOfDays[calDate.getDay()].disp;
  $scope.getUserAttendance()
};

$scope.range = function(min, max, step) {
  step = step || 1;
  var input = [];
  for (var i = min; i <= max; i += step) input.push(i);
  return input;
};
$scope.userSearch = function(query) {
  //search for the user
  return $http.get('/api/HR/userSearch/?username__contains=' + query).
  then(function(response) {
    return response.data;
  })
};


$scope.getval = function(typ, dt) {
  if ($scope.values!=undefined) {
    if (typ == 'Cur') {
      if ($scope.values[dt - 1] >= 8) {
        return '#cff6c9'
        //for worked more then 8hrs
      } else if ($scope.values[dt - 1] > 0 && $scope.values[dt - 1] < 8) {
        return '#f7decd'
        //for absent
      } else if ($scope.values[dt - 1] == 0) {
        return '#d7e8f7'
        //for loggedin  or loggedout once
      }else if ($scope.values[dt - 1] == -2) {
        return '#dbdbdb'
        //for the leave request
      }
    } else {
      return ''
    }
  }
}

});

app.controller("controller.home.profile", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside) {

  $scope.openAttendance = function(){
    console.log('inside openAttendance functioin');
    $aside.open({
      templateUrl : '/static/ngTemplates/app.home.Attendance.html',
      placement: 'right',
      size: 'xl',
      backdrop : true,
      // resolve: {
      //   a : function() {
      //     return $scope.sai;
      //   },
      // },
      controller : 'ctrl.home.attendance.aside'
    })
  }

  $scope.taskModal = function(){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.home.taskModal.html',
      placement: 'right',
      size: 'lg',
      backdrop : true,
      // resolve: {
      //   a : function() {
      //     return $scope.sai;
      //   },
      // },
      controller : 'ctrl.home.taskModal.aside'
    }).result.then(function(i) {

    }, function() {
      $scope.getTasks()
    });
  }
  // $scope.data = $scope.tab.data;

  $scope.me = $users.get("mySelf");


  $http({
    method: 'GET',
    url: '/api/payroll/payroll/?user=' + $scope.me.pk
  }).
  then(function(response) {
    $scope.payroll = response.data[0];
  })

  $http({
    method: 'GET',
    url: '/api/HR/designation/?user=' + $scope.me.pk
  }).
  then(function(response) {

    $scope.designation = response.data[0];


    if (typeof $scope.designation.division == 'number') {
      $http({
        method: 'GET',
        url: '/api/organization/divisions/' + $scope.designation.division + '/'
      }).
      then(function(response) {
        $scope.designation.division = response.data;
      })
    }

    if (typeof $scope.designation.unit == 'number') {
      $http({
        method: 'GET',
        url: '/api/organization/unit/' + $scope.designation.unit + '/'
      }).
      then(function(response) {
        $scope.designation.unit = response.data;
      })

    }
    $scope.assignedItems = []
    $scope.holidayList = []
    if ($scope.me.pk) {
      $http({
        method: 'GET',
        url: '/api/assets/checkin/?to=' + $scope.me.pk
      }).
      then(function(response) {
        $scope.assignedItems = response.data
      })
    }

    $http({
      method: 'GET',
      url: '/api/organization/companyHoliday/'
    }).
    then(function(response) {
      $scope.holidayList = response.data
    })
    $scope.allDocs = []
    $http({
      method:'GET',
      url:'/api/HR/document/'
    }).then(function(response){
      $scope.allDocs = response.data
    })

  })


  $http({
    method: 'GET',
    url: '/api/HR/appraisal/?status=Created&user=' + $scope.me.pk
  }).
  then(function(response) {
    console.log(response.data, 'Appraisalsssssss');
    $scope.appraisalData = response.data;
  })

  $scope.sendAppraisal = function(idx) {
    var f = $scope.appraisalData[idx]
    console.log(f);
    if (typeof f.userCmt != 'string') {
      Flash.create('danger', 'Please Enter Some Message')
      return
    }
    if (typeof f.userAmount != 'number') {
      Flash.create('danger', 'Please Enter Valid Amount')
      return
    }
    console.log(parseInt(f.userAmount));
    $http({
      method: 'PATCH',
      url: '/api/HR/appraisal/' + f.pk + '/',
      data: {
        userCmt: f.userCmt,
        userAmount: parseInt(f.userAmount),
        'status': 'Inprogress'
      }
    }).
    then(function(response) {
      Flash.create('success', 'Request Has Been Sent Successfully')
      console.log(response.data);
      $scope.appraisalData.splice(idx, 1)
    })
  }



  $http({
    method: 'GET',
    url: '/api/HR/profileAdminMode/?user=' + $scope.me.pk
  }).
  then(function(response) {
    $scope.data = response.data[0];
  })

  $scope.openModal = function(payroll) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.home.profile.modal.html',
      size: 'lg',
      controller: function($scope, $http, Flash, $uibModalInstance, $users) {
        $scope.data = payroll;
        console.log($scope.data);

        // $scope.joiningDate =new Date($scope.data.joiningDate);
        // $scope.joiningDateYear = $scope.joiningDate.getFullYear();
        // $scope.joiningMonth =  $scope.joiningDate.getMonth();
        //
        // $scope.currentDate = new Date()
        // $scope.currentYear = new Date().getFullYear()
        // $scope.currentMonth =  new Date().getMonth();
        //
        // if($scope.data.lastWorkingDate!=null){
        //   $scope.lastWorkingDate =new Date($scope.data.lastWorkingDate);
        //   $scope.lastWorkingYear = $scope.lastWorkingDate.getFullYear();
        //   $scope.lastWorkingMonth = $scope.lastWorkingDate.getMonth();
        // }
        // else{
        //   $scope.lastWorkingDate = $scope.currentDate
        //   $scope.lastWorkingYear = $scope.currentYear
        //   $scope.lastWorkingMonth = $scope.currentMonth
        // }
        //
        //
        //
        //
        // if ($scope.lastWorkingYear<$scope.currentYear) {
        //   $scope.currentYear = $scope.lastWorkingYear
        //   $scope.currentDate = $scope.lastWorkingDate
        // }
        //
        //
        //
        // $scope.$watch('currentYear', function(newValue, oldValue) {
        //
        //   console.log($scope.joiningMonth,$scope.lastWorkingMonth);
        //   $scope.monthsData =[]
        //   $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        //   if($scope.joiningDateYear==$scope.lastWorkingYear){;
        //     if($scope.joiningMonth==$scope.lastWorkingMonth){
        //       $scope.monthsData.push($scope.months[$scope.joiningMonth])
        //     }
        //     else{
        //       $scope.monthsData = $scope.months.splice($scope.joiningMonth,$scope.lastWorkingMonth-1)
        //     }
        //   }
        //   else if(newValue==$scope.joiningDateYear){
        //     $scope.monthsData = $scope.months.splice($scope.joiningMonth,$scope.months.length)
        //   }
        //   else if(newValue==$scope.lastWorkingYear){
        //     $scope.monthsData =  $scope.months.splice(0,$scope.lastWorkingMonth+1)
        //   }
        //   else{
        //     $scope.monthsData = $scope.months
        //   }
        // })
        //
        // $scope.next = function() {
        //   if($scope.lastWorkingYear == $scope.currentYear ){
        //     return ;
        //   }
        //   else{
        //   $scope.currentYear += 1;
        //   }
        // }
        //
        // $scope.prev = function() {
        //   if($scope.joiningDateYear == $scope.currentYear ){
        //     return ;
        //   }
        //   else{
        //   $scope.currentYear -= 1;
        //   }
        // }


        $scope.joiningDate = new Date($scope.data.joiningDate);
        $scope.joiningDateYear = $scope.joiningDate.getFullYear();
        $scope.joiningMonth = $scope.joiningDate.getMonth();

        $scope.currentDate = new Date()
        $scope.currentYear = new Date().getFullYear()
        $scope.currentMonth = new Date().getMonth();

        if ($scope.data.lastWorkingDate != null) {
          $scope.lastWorkingDate = new Date($scope.data.lastWorkingDate);
          $scope.lastWorkingYear = $scope.lastWorkingDate.getFullYear();
          $scope.lastWorkingMonth = $scope.lastWorkingDate.getMonth();
        } else {
          $scope.lastWorkingDate = $scope.currentDate
          $scope.lastWorkingYear = $scope.currentYear
          $scope.lastWorkingMonth = $scope.currentMonth
        }

        if ($scope.lastWorkingYear < $scope.currentYear) {
          $scope.currentYear = $scope.lastWorkingYear
          $scope.currentDate = $scope.lastWorkingDate
        }


        $scope.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        $scope.allData = function(currentYear) {
          $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          $scope.currentYear = currentYear
          $scope.monthsData = []
          if ($scope.joiningDateYear == $scope.lastWorkingYear) {
            if ($scope.joiningMonth == $scope.lastWorkingMonth) {
              $scope.monthsData.push($scope.months[$scope.joiningMonth])
            } else {
              $scope.monthsData = $scope.months.splice($scope.joiningMonth, $scope.lastWorkingMonth)
            }
          } else if ($scope.currentYear == $scope.joiningDateYear) {
            $scope.monthsData = $scope.months.splice($scope.joiningMonth, $scope.months.length)
          } else if ($scope.currentYear == $scope.lastWorkingYear) {
            $scope.monthsData = $scope.months.splice(0, $scope.lastWorkingMonth + 1)
          } else {
            $scope.monthsData = $scope.months
          }
        }
        $scope.$watch('currentYear', function(newValue, oldValue) {

          $scope.allData(newValue)

          $http({
            method: 'GET',
            url: '/api/payroll/payslip/?user=' + $scope.data.user + '&year=' + newValue
          }).
          then(function(response) {
            $scope.monthsForWhichPayslipsExist = []
            $scope.paySlips = response.data;

            for (var i = 0; i < $scope.paySlips.length; i++) {
              $scope.monthsForWhichPayslipsExist.push($scope.monthsList[$scope.paySlips[i].month - 1]);
            }

          })


          console.log($scope.joiningMonth, $scope.lastWorkingMonth);

        })

        $scope.next = function() {
          if ($scope.lastWorkingYear == $scope.currentYear) {
            return;
          } else {
            $scope.currentYear += 1;
            $scope.allData($scope.currentYear)
            $scope.attendance = false;
          }
        }

        $scope.prev = function() {
          if ($scope.joiningDateYear == $scope.currentYear) {
            return;
          } else {
            $scope.currentYear -= 1;
            $scope.allData($scope.currentYear)
            $scope.attendance = false;
          }
        }



        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel')
        }

        $scope.attendance = false;

        $scope.view = function(n) {
          $scope.monthss = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          $scope.currentMonth = n;

          function monthIndex(mon) {
            for (var i = 0; i <= $scope.monthss.length; i++) {
              if ($scope.monthss.includes(mon)) {
                return $scope.monthss.indexOf(mon) + 1;
              }
            }
          }

          function daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
          }
          $scope.presentDays = 0;
          $scope.hrs = 0;
          $scope.mins = 0;
          $scope.indexMonth = monthIndex(n);
          $scope.days = daysInMonth($scope.indexMonth, $scope.currentYear);
          console.log($scope.currentYear, $scope.indexMonth, 'mmmmmmmmmmmm');

          function interval(count) {
            return count;
          };

          $http({
            method: 'GET',
            url: '/api/performance/timeSheet/?user=' + $scope.data.user
          }).
          then(function(response) {
            $scope.presentDays = 0;
            for (var i = 0; i < response.data.length; i++) {
              $scope.split = response.data[i].date.split("-");
              if ($scope.split[0] == $scope.currentYear) {
                if ($scope.split[1] == $scope.indexMonth) {
                  if (response.data[i].totaltime == null || typeof response.data[i].totaltime === "undefined") {

                  } else {

                    $scope.timedata = response.data[i].totaltime.split(':');

                    $scope.mins = Number($scope.timedata[1]);
                    $scope.hrs = Number($scope.timedata[0]);
                    $scope.time = parseFloat($scope.hrs + '.' + $scope.mins);
                    console.log($scope.time, 'nnnnnnnnnn');
                    $scope.countDays = Math.floor($scope.time / 8.5);
                    $scope.remainingHour = $scope.time % 8.5;
                    $scope.remainingHours = $scope.remainingHour / 8.5;
                    console.log($scope.remainingHours, 'oooooooo');
                    $scope.presentDays += Math.floor(interval($scope.countDays) + $scope.remainingHours);
                    // if($scope.time >= 8.30)
                    // {
                    //   $scope.presentDays++
                    // }
                    $scope.attendance = true;
                  }

                }
              }
            }
            $scope.attendance = true;
          })
          $scope.leaveDays = 0;
          $http({
            method: 'GET',
            url: '/api/HR/leave/?user=' + $scope.data.user + '&status=approved&fromDate__year=' + $scope.currentYear + '&fromDate__month=' + $scope.indexMonth,
          }).
          then(function(response) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {

              if (response.data[i].leavesCount != null && response.data[i].leavesCount != undefined) {
                $scope.leaveDays += response.data[i].leavesCount;
              }
            }


          })
        }

      },
    })
  }

  $scope.reset = function() {
    $scope.form = {
      txt: '',
    }
  }
  $scope.reset();
  $scope.sendComplaint = function(managerId) {
    toSend = {
      user: $scope.me.pk,
      txt: $scope.form.txt,
    }
    $http({
      method: 'POST',
      url: '/api/employees/complaints/',
      data: toSend
    }).
    then(function(response) {
      $scope.complaints = response.data;
      $scope.reset();
      uData = {
        pk: $scope.me.pk,
        txt : response.data.txt,
        manPk: managerId,
      }
      $http({
        method: 'POST',
        url: '/api/employees/sendComplaintEmail/',
        data: uData,
      }).
      then(function() {
        Flash.create('success', 'Email sent successfully');
        console.log('sent email');
      })
    })
  }

$scope.getTasks = function(){
  $http({
    method: 'GET',
    url: '/api/taskBoard/getAllTaskboard/?onlyworkbook='
  }).
  then(function(response) {
    $scope.workbook_data = response.data.workbook_data;
    $scope.alreadyAdded = response.data.alreadyAdded;
  })
}
$scope.getTasks()

});

app.controller("businessManagement.marketing.saveContacts", function($scope, $http, Flash, $uibModal, $uibModalInstance, NgMap, data , $state) {

  $scope.material_inward = MATERIAL_INWARD


  $scope.serviceName = $state.params.name

  $scope.checkContact = function() {
    if ($scope.form.mobile.length >= 10) {
      $http({
        method: 'GET',
        url: '/api/marketing/contacts/?mobile=' + $scope.form.mobile
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form = response.data[0]
        }
      })
    }

  }


  $scope.productSearch = function(query) {
    return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).then(function(response){
      return response.data.results;
    })
  };



  //vm.types = "['geocode']";
  $scope.types = "[]";
  $scope.usebounds = false;

  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    if ($scope.place.geometry.location != undefined) {
      $scope.locations = $scope.place.geometry.location
      $scope.lat = $scope.place.geometry.location.lat()
      $scope.lng = $scope.place.geometry.location.lng()
    }
    console.log('location', $scope.place.geometry.location.lat() ,  $scope.place.geometry.location.lng());
    console.log('location', $scope.place);
  }

  $scope.form = {
    name: '',
    email: '',
    mobile: '',
    addrs: '',
    city: '',
    state: '',
    country: '',
    areaCode: '',
    pinCode: '',
    about: '',
    source: '',
    date: '',
    slot: '',
    warrantyStatus:'',
    product : '',
    serialNo: ''
  }

  if (data != null) {
    if (data.pk) {
      $scope.form = data;
      $scope.place = $scope.form.addrs
      var pincode = $scope.form.areaCode
      var city = $scope.form.city
      var state = $scope.form.state
      $scope.locations = [$scope.form.lat, $scope.form.lng]

      if ($scope.form.isSales == true) {
        $scope.form.dataType = 'sales'
      }
      else{
        $scope.form.dataType = 'services'
      }
    }else{
      $scope.form.name = data.name;
      $scope.form.email = data.email;
      $scope.form.mobile = data.mobile;
    }
  }

  $scope.getLocation = function(lat, lon) {
    $scope.lat = lat
    $scope.lng = lon
    $http({
      method: 'GET',
      url: '/api/marketing/getloaction/?lat=' + lat + '&lon=' + lon
    }).
    then(function(response) {
      if (response.data.msg) {
        Flash.create('warning', response.data.msg)
        return
      } else {
        console.log(response.data.address);
        $scope.form.addrs = response.data.address.display_name
        $scope.form.pinCode = response.data.address.address.postcode
      }
    })
  }

  $scope.center = [12.970435, 77.578424];

  $scope.close = function() {
    if ($scope.form.pk) {
      $uibModalInstance.dismiss($scope.form)
    } else {
      $uibModalInstance.dismiss()
    }
  }

  $scope.getCurrentLocation = function(event) {
    $scope.lat = event.latLng.lat()
    $scope.lng = event.latLng.lng()
  }

  $scope.$watch('form.pinCode' , function(newValue , oldValue) {
    console.log(newValue,'aaaaaaaaaaaaaaaaaaa');
    if (newValue == undefined) {
      return;
    }
    if (newValue.length == 6) {
      $http({method : 'GET' , url : '/api/ERP/genericPincode/?pincode=' + newValue}).
      then(function(response) {
        if (response.data.length>0) {
          $scope.form.city = response.data[0].city;
          $scope.form.state = response.data[0].state;
          $scope.form.country = response.data[0].country;
          console.log($scope.form,'aaaaaaaaaaaaaaaaaaaaaaaa');
        }
      })
    }

  })

  $scope.saveContact = function() {
    if ($scope.form.name == '' || $scope.form.mobile == '') {
      Flash.create('warning', 'Name, phone number is required')
      return
    }

    if ($scope.place == undefined) {
      Flash.create('warning', 'Address is required')
      return
    }
    console.log($scope.place.address_components);

    var f = $scope.form
    console.log(f,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    var tosend = {
      name: f.name,
      mobile: f.mobile,
      addrs: f.addrs,
      pinCode: f.pinCode,
      city: f.city,
      state: f.state,
      country: 'India',
      areaCode: f.pinCode,
      about: f.about,
      source: f.source,
      lat: $scope.lat,
      lng: $scope.lng,
      slot: $scope.form.slot,
      serviceName : $state.params.name
    }
    if (typeof $scope.form.date == 'object') {
      tosend.date = $scope.form.date.toJSON().split('T')[0]
    } else {
      tosend.date = $scope.form.date
    }
    if (f.email != null && f.email.length > 0) {
      tosend.email = f.email
    }
    if (f.companyName != null && f.companyName.length > 0) {
      tosend.companyName = f.companyName
    }

    if (f.dataType == 'sales') {
        tosend.isSales = true
    }
    else{
        tosend.isSales = false
    }
    if ($scope.serviceName !=undefined) {
      tosend.serviceName = $scope.serviceName
    }

    if (f.warrantyStatus != null && f.warrantyStatus.length > 0) {
      tosend.warrantyStatus = f.warrantyStatus
    }

    if ($scope.form.product!=undefined && $scope.form.product!=null && typeof $scope.form.product == 'object') {
      tosend.product = $scope.form.product.pk
    }

    if ($scope.form.serialNo!=null) {
      tosend.serialNo = $scope.form.serialNo
    }


    var method = 'POST'
    var url = '/api/marketing/contacts/'
    if (f.pk) {
      var method = 'PATCH'
      var url = '/api/marketing/contacts/' + f.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: tosend
    }).
    then(function(response) {
      if (f.leadAdded) {
          $http({method : 'PATCH' , url : '/api/marketing/campaignItem/' + f.campaign  + '/' , data : {status:'converted'}}).
          then(function(response) {
          })
      }
      $scope.form = {
        name: '',
        email: '',
        mobile: '',
        addrs: '',
        city: '',
        state: '',
        country: '',
        areaCode: '',
        pincode: '',
      }

      $uibModalInstance.dismiss(response.data)
    })

  }
})
