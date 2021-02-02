var connection = new autobahn.Connection({url: 'wss://'+ 'ws.epsilonai.com/ws', realm: 'default'});

// "onopen" handler will fire when WAMP session has been established ..
connection.onopen = function (session) {

   console.log("session established!");

   // our event handler we will subscribe on our topic
   //
  function chatResonse (args) {
    var scope = angular.element(document.getElementById('messenger')).scope();
    if (args[0] == 'T') {
      scope.showTyping(args[2], args[1])
    }
  else{
    scope.$apply(function() {
      scope.addChat(args[1]);
    });
  }
  };

  function chatSupportResonse(args){
     var scope = angular.element(document.getElementById('messenger')).scope();
     scope.$apply(function() {
       scope.addChat(args[2]);
     });
    // console.log(args)
    // var scope = angular.element(document.getElementById('mainChat')).scope();
    // console.log('sssssssssssssssss');
    // if (scope == undefined) {
    //   var mainscope = document.getElementById('main')
    //   var div = document.createElement("div")
    //   div.innerHTML = 'new notification'
    //   div.style = {'width' : '500px' , 'background' : '#e9e9e9' , 'color' : 'white','transition':'width 2s','position':'relative','bottom':'10px';'height' : '300px'}
    //   mainscope.appendChild(div);
    //   console.log(mainscope,'aaaaaaaaaaaaaaaaaaaaaa');
    // }
  }

  processNotification = function(args){
    console.log('ssssssssssssssssssss');
    var scope = angular.element(document.getElementById('main')).scope();
    scope.$apply(function() {
      scope.fetchNotifications(args[0]);
    });
  };

  processUpdates = function(args){
    window.postMessage(args);



    var scope = angular.element(document.getElementById('aside')).scope();
    if (typeof scope != 'undefined') {
      scope.$apply(function() {
        scope.refreshAside(args[0]);
      });
    }
  };

  processDashboardUpdates = function(args) {
    console.log(args);
    var scope = angular.element(document.getElementById('dashboard')).scope();
    console.log(scope);

    if (typeof scope != 'undefined') {
      scope.$apply(function() {
        scope.refreshDashboard(args[0]);
      });
    }
  };

  session.subscribe(wamp_prefix + 'service.chat.'+wampBindName, chatResonse).then(
    function (sub) {
      console.log("subscribed to topic 'chatResonse'");
    },
    function (err) {
      console.log("failed to subscribed: " + err);
    }
  );
  if (IS_ON_SUPPORT){
    session.subscribe(wamp_prefix + 'service.support.'+ DIVISIONPK, chatSupportResonse).then(
      function (sub) {
        console.log("subscribed to company support channel 'chatResonse'");
      },
      function (err) {
        console.log("failed to subscribed: " + err);
      }
    );
  }
  session.subscribe('service.notification.'+wampBindName, processNotification).then(
    function (sub) {
      console.log("subscribed to topic 'notification'");
    },
    function (err) {
      console.log("failed to subscribed: " + err);
    }
  );
  session.subscribe('service.updates.'+wampBindName, processUpdates).then(
    function (sub) {
      console.log("subscribed to topic 'updates'");
    },
    function (err) {
      console.log("failed to subscribed: " + err);
    }
  );
  session.subscribe('service.dashboard.'+wampBindName, processDashboardUpdates).then(
    // for the various dashboard updates
    function (sub) {
      console.log("subscribed to topic 'dashboard'");
    },
    function (err) {
      console.log("failed to subscribed: " + err);
    }
  );

};


  // fired when connection was lost (or could not be established)
  //
connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
}
connection.open();
