{% include "chatter.dependencies.js" %}

function optionTouched(msg) {
  CHATTER_FUNCTION.sendCustomMessage(msg , false , false)
}


document.addEventListener("DOMContentLoaded", function(event) {
  var removeAudioVideo = false;
  var is_iOS = false;
  if (getOS()=='iOS') {
    if(navigator.userAgent.match('CriOS')){
      removeAudioVideo = true
    }
    if(navigator.userAgent.match('FxiOS')){
      removeAudioVideo = true
    }
  }
  var urlData = window.location.href
  if (urlData.includes('?suid=')){
    var uid = urlData.split('?suid=')[1]
    var fURl = urlData.split('?suid=')[0]
    setCookie("uid", uid, 365);
    setCookie("chatOpenCookie", true, 365);
    history.pushState(null, null, fURl);
  }

  {% include "chat.variables.js" %}

  welcomeMessage = welcomeMessage.replaceAll("&lt;",'<')
  welcomeMessage = welcomeMessage.replaceAll("&gt;",">")
  welcomeMessage = welcomeMessage.replaceAll("<a","<a style="+'color:var(--windowColor) !important;text-decoration:none')
  welcomeMessage = welcomeMessage.replaceAll("<li>","<li style='list-style:none'>")
  var isLoggedIn = false;
  function checkLoginStatus() {
    if (typeof isVisitorLogin === "function") {
      var checkLoginstatus =  isVisitorLogin();
      if (checkLoginstatus != undefined) {
        if (checkLoginstatus) {
          isLoggedIn = true;
        }
      }
    }
    return isLoggedIn;
  }
  var sideOfChatBox = position_of_chat.split('-')[0]
  if (sideOfChatBox=='right') {
    var header_bor_rad_active_vid = "0px 10px 0px 0px"
    var foot_bor_rad_active_vid = "0px 0px 10px 0px"
    var header_bor_rad_no_vid = "10px 10px 0px 0px"
    var footer_bor_rad_no_vid = "0px 0px 10px 10px"
  }else {
    var header_bor_rad_active_vid = "10px 0px 0px 0px"
    var foot_bor_rad_active_vid = "0px 0px 0px 10px"
    var header_bor_rad_no_vid = "10px 10px 0px 0px"
    var footer_bor_rad_no_vid = "0px 0px 10px 10px"
  }
  var sy_circle_class="sy-circle-"+position_of_chat.split('-')[0] //sy-circle-right , sy-circle-left
  var sy_text_class=" sy-text-"+position_of_chat.split('-')[0] // sy-text-right , sy-text-left
  var sy_firsttext_class="sy-firsttext-"+position_of_chat.split('-')[0]
  var chat_div_class="chatdiv-"+position_of_chat.split('-')[0];

  firstMessage = firstMessage.replaceAll("&lt;",'<')
  firstMessage = firstMessage.replaceAll("&gt;",">")
  firstMessage = firstMessage.replaceAll("<a","<a style="+'color:var(--windowColor) !important;text-decoration:none')
  firstMessage = firstMessage.replaceAll("<li>","<li style='list-style:none'>")

  if (nameSupport=='None') {
    nameSupport = ''
  }

  var windowColorR = parseInt(windowColor.slice(1,3),16)
  var windowColorG = parseInt(windowColor.slice(3,5),16)
  var windowColorB = parseInt(windowColor.slice(5,7),16)
  var windowColorNew = "rgba("+windowColorR+","+ windowColorG+","+ windowColorB+","+0.6 +")";

  var metaTag=document.createElement('meta');
    metaTag.name="viewport";
    metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    document.getElementsByTagName('head')[0].appendChild(metaTag);

  var linkStyle = document.createElement('link');
      linkStyle.rel = 'stylesheet';
      linkStyle.href = 'https://fonts.googleapis.com/css?family=Muli';
      document.head.appendChild(linkStyle);
  var failedMessages=[];
  var trySendingAgain=[];
  var viewports = {default: metaTag.getAttribute('content'), landscape: 'width=990'};
  var viewport_set = function() {
    if ( screen.width > 768 ){
      metaTag.setAttribute( 'content', viewports.landscape );
    }
    else{
      metaTag.setAttribute( 'content', viewports.default );
    }
  }
  viewport_set();
  window.onresize = function() {
    viewport_set();
  }
  if (is_blink=='True') {
    is_blink = true
    var blinkCss = ", blink 3s infinite"
  }else {
    var blinkCss = ""
    is_blink = true
  }
  support_icon = '{{serverAddress}}'+'{{support_icon}}'
  if (dpSupport=='') {
    dpSupport = '{{serverAddress}}/static/images/img_avatar_card.png'
  }else {
    dpSupport = '{{serverAddress}}'+'{{dp}}'
  }

  chatSupport = chatSupport=='True'
  callBackSupport = callBackSupport=='True'
  videoSupport = videoSupport=='True'
  ticketSupport = ticketSupport=='True'
  audioSupport = audioSupport=='True';
  integrated_media = integrated_media=='True';
  botMode = botMode=='True';

  var uid;
  var broswer;
  var isAgentOnline = false;
  var agentPk = null;
  var notification = new Audio('{{serverAddress}}/static/audio/message.mp3');
  var emailRecieved = false
  var chat = {user : custName , messages : [ { message:"first", sentByAgent:true , created:  new Date() } ] }

  function fetchMessages(uid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText)
          for (var i = 0; i < data.length; i++) {
            chat.messages.push(data[i])
          }
          pushMessages();
        }
    };
    xhttp.open('GET', '{{serverAddress}}/api/chatbot/publicFacing/supportChat/?visitorReq=1&uid=' + uid , true);
    xhttp.send();
  }

  function fetchThread(uid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText)
          if (data.pk) {
            threadExist = true
            chatThreadPk = data.pk;
            agentPk = data.user;
            streamType=data.typ;
            transferred=data.transferred;
            participants=data.participants;
            if (data.agent_name.length>0) {
              agentName.innerHTML = data.agent_name;
            }
            if (data.agent_dp.length>0) {
              document.getElementById('logo_ji').src= '{{serverAddress}}'+ data.agent_dp;
            }
          }
          fetchMessages(uid);
          checkVisitorDetails(uid)
        } else if (this.responseText == '{"PARAMS":"createCookie"}') {
          document.cookie = encodeURIComponent("uid") + "=deleted; expires=" + new Date(0).toUTCString()
          uid = new Date().getTime()
          setCookie("uid", uid, 365);
          fetchMessages(uid);
          checkVisitorDetails(uid)
        }
    };
    xhttp.open('GET', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/?uid=' + uid + '&checkThread', true);
    xhttp.send();
  }

  function checkVisitorDetails() {
    var visitorDetails = getCookie("uidDetails");
    if (visitorDetails != "") {
      visitorDetails = JSON.parse(visitorDetails)
      var uid = getCookie("uid");
      if (uid!="") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var data = JSON.parse(this.responseText)
              if (data.length==0) {
                var xhttp = new XMLHttpRequest();
                 xhttp.onreadystatechange = function() {
                   if (this.readyState == 4 && this.status == 201) {
                     console.log('posted successfully');
                   }
                 };
                 xhttp.open('POST', '{{serverAddress}}/api/chatbot/visitor/', true);
                 xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
                 xhttp.send(JSON.stringify({uid:uid,name:visitorDetails.name,email:visitorDetails.email,phoneNumber:visitorDetails.phoneNumber}));
              }
            }
        };
        xhttp.open('GET', '{{serverAddress}}/api/chatbot/visitor/?uid='+uid  , true);
        xhttp.send();
      }
    }
  }

  var threadExist
  var threadResponse
  var chatThreadPk
  var transferred
  var streamType=''

  function setVisitorDetails(name , phoneNumber , email) {
    detail = getCookie("uidDetails");
    if (detail != "") {
      document.cookie = encodeURIComponent("uidDetails") + "=deleted; expires=" + new Date(0).toUTCString()
    }

    if (uid!="") {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText)
            if (data.length==0) {
              var xhttp = new XMLHttpRequest();
               xhttp.onreadystatechange = function() {
                 if (this.readyState == 4 && this.status == 201) {
                   console.log('posted successfully');
                 }
               };
               xhttp.open('POST', '{{serverAddress}}/api/chatbot/visitor/', true);
               xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
               xhttp.send(JSON.stringify({uid:uid,name:name,email:email,phoneNumber:phoneNumber}));
            }
          }
      };

      xhttp.open('GET', '{{serverAddress}}/api/chatbot/visitor/?uid='+uid  , true);
      xhttp.send();
    }
    setCookie("uidDetails", JSON.stringify({email:email , name:name , phoneNumber:phoneNumber}), 365);
  }

  function setIframeRotated(){
    iframeDiv.style.position = "fixed";
    iframeDiv.style.height = "70vh";
    iframeDiv.style.width = "70vh";
    iframeDiv.style.bottom = "85px";

    if (sideOfChatBox=='right') {
      iframeDiv.style.right = "400px";
    }else {
      iframeDiv.style.left = "400px";
    }
    iframeDiv.style.transition = "all .2s"
    iframeDiv.style.animation = "moveInFront 0.6s"
    iframeDiv.style.transform = "rotate(90deg)";
    document.getElementById('iFrame1').style.height='50px'
    iframeDiv.style.boxShadow='';
    iframeDiv.style.borderRadius='10px';
    document.getElementById('iFrame1').style.borderRadius = "0px 0px 7px 7px";

  }
  function setIframeToNormal(){
    console.log("setiframe to normal");
    iframeDiv.style.position = "fixed";
    iframeDiv.style.height = "70vh";
    iframeDiv.style.width = "50%";
    iframeDiv.style.bottom = "85px";
    if (sideOfChatBox=='right') {
      iframeDiv.style.right = "400px";
    }else {
      iframeDiv.style.left = "400px";
    }
    iframeDiv.style.transform = "rotate(0deg)";
    document.getElementById('iFrame1').style.height='100%';
    document.getElementById('iFrame1').style.borderRadius = "7px 0px 0px 7px";
    iframeDiv.style.boxShadow='-5px -10px 10px rgb(0,0,0,0.2)';
  }


  function setInitColor() {
    document.documentElement.style.setProperty('--windowColor', windowColor);
    document.documentElement.style.setProperty('--iconColor', iconColor);
    document.documentElement.style.setProperty('--fontAndIconColor', fontAndIconColor);
    document.documentElement.style.setProperty('--supportBubbleColor', supportBubbleColor);
  }

  setInitColor()
  window.CHATTER_FUNCTION = {
     sendCustomMessage:function (msg, is_agent ,is_hidden) {
       if (is_hidden==undefined) {
         is_hidden = is_hidden == undefined;
       }
       if (is_agent==undefined) {
         is_agent = false;
       }
       sendMessage(msg,is_agent,is_hidden)
     },
    hideChatBox:function () {
      document.getElementById('mainSyrowDiv').style.display = "none";
    },
    displayChatBox:function () {
      document.getElementById('mainSyrowDiv').style.display = "";
    },
    openChat:function () {
      if (chatOpen) {
        return
      }
      openChat()
      ChatWithUs.style.display="none"
    },
    closeChat:function () {
      closeSupport.click()
    },

    clearCookies:function () {
      document.cookie = encodeURIComponent("uidDetails") + "=deleted; expires=" + new Date(0).toUTCString()
      document.cookie = encodeURIComponent("uid") + "=deleted; expires=" + new Date(0).toUTCString()
    },
    setVisitorDetails:function (name , phoneNumber , email) {
      setVisitorDetails(name, phoneNumber, email);
    },
    getVisitorDetails:function () {
      return getVisitorDetails()
    },
    setColors:function (window_color, icon_color, font_icon_color, support_bubble_color) {
      setColors(window_color, icon_color, font_icon_color, support_bubble_color)
    },
    resetColor:function () {
      setInitColor()
    }
  }

  setTimeout(function () {
    var ChatWithUs=document.getElementById('ChatWithUs')
    ChatWithUs.addEventListener('click',function(){
      openChat()
      ChatWithUs.style.display="none"
    })
    if (support_icon=='{{serverAddress}}') {
      document.getElementById('24Icon').classList.add('font-Syrow24hSupport');
      document.getElementById('supportDp').style.display = "none";
    }
  }, 2000);
  connection.onopen = function (session) {
     setTimeout(function () {
       inputText.placeholder = "Message...";
       paperClip.style.display = "";
       paperPlane.style.display = "";
     }, 3000);

    var supportChat = function(args) {
      var message;

      if (args[0]=='T') {
        isAgentOnline = true;
        onlineStatus.innerHTML = 'Online';
        document.getElementById('TypingBox').style.display="block";
        // onlineStatus.innerHTML = 'Typing...';
        scroll();
        setTimeout(function(){
          document.getElementById('TypingBox').style.display="none";
      }, 2500);
        return
      }

      if (args[0]=="M") {
          message = args[1]
      agentName.innerHTML = args[2].last_name
      document.getElementById('logo_ji').src=args[2].agentDp
      }else if (args[0]=="MF") {
        agentName.innerHTML = args[2].last_name
        document.getElementById('logo_ji').src=args[2].agentDp
        var attachment;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var data = JSON.parse(this.responseText)
              message = data;
              addMessages(message)
              if (data.attachmentType=='instructionImage') {
                openModal(data.attachment)
              }
            }
        };

        xhttp.open('GET', '{{serverAddress}}/api/chatbot/supportChat/' + args[1].filePk + '/'  , true);
        xhttp.send();
        return;

      }else if (args[0]=='ML') {
        console.log('ML');
        agentName.innerHTML = args[2].last_name
        document.getElementById('logo_ji').src=args[2].agentDp
         message = args[1]
      }else if (args[0]=='AP') {
        console.log('agent pk recieveddddddddddddddddddddddddddddddddd , it is '+ args[1]);
        agentPk = args[1];
        isAgentOnline = true;
        agentName.innerHTML = args[2].last_name
        onlineStatus.innerHTML = 'Online'
        document.getElementById('logo_ji').src=args[2].agentDp
        return
      }else if (args[0]=='O') {
        isAgentOnline = true;
        onlineStatus.innerHTML = 'Online'
        return
      }else if (args[0]=='A') {
        isAgentOnline = true;
        agentName.innerHTML = args[1]
        return
      }else if (args[0]=='F') {
        openFeedback(args[1])
        return
      }else if (args[0]=='HTML') {
        var div = document.createElement("div");
        div.innerHTML = args[1]
        messageBox.appendChild(div);
        scroll();
        return
      }

      if (args[0]=='M' || args[0]=='MF' || args[0]=='ML' || args[0]=='F') {
        if (!chatOpen) {
          unreadMsgCount +=1;
          unreadMessageCircleStyle.style.display = "";
          unreadMessageCircleStyle.innerHTML = unreadMsgCount;

          unreadMessageBoxStyle.style.display = "";
          unreadMessageBoxStyle.innerHTML = unreadMsgCount;
          if (serviceCount==1) {
            unreadMsgSingleServ.style.display = "";
            unreadMsgSingleServ.innerHTML = unreadMsgCount;
          }
        }
      }
      addMessages(message)
    }
    uid = getCookie("uid");
    function addMessages(message){
      var div = document.createElement("div");
      div.innerHTML = messageDiv(message)
      messageBox.appendChild(div);
      scroll();
      chat.messages.push(message);
      notification.play();
      removeAddAgainConfirmationBox()
    }
    function heartbeat() {
      return uid
    }


    function getLoggedInStatus(args){
      if (CHATTER_LOGGED_IN != undefined) {
        return CHATTER_LOGGED_IN;
      }else{
        return false;
      }
    }

    function debuggerCallback(args) {
      window.postMessage({debugger : args}, "*");
    }

    function createCookieDetail(args) {
        detail = getCookie("uidDetails");
        if (detail != "") {
          document.cookie = encodeURIComponent("uidDetails") + "=deleted; expires=" + new Date(0).toUTCString()
        }
        if (args[0].email!='') {
          emailRecieved = true
        }
        setCookie("uidDetails", JSON.stringify({email:args[0].email , name:args[0].name , phoneNumber:args[0].phoneNumber}), 365);
    }

    function handleQuickActions(args) {
      if (args[0]=='currentPage') {
        var currentPage = window.location.href
        return currentPage;
      }
      if (args[0]=='LS' && args[1]==uid) {
        var toReturn = checkLoginStatus();
        return toReturn;
      }else {
        var message = {event_name : args[0], event_data : args[1]};
        window.postMessage(message, "*");
      }
    }

    function checkHeartBeat(args) {

      if (args[0]=='changeBotMode' && args[1]==uid) {
        console.log("Transfer notification to agent recieved");
        transferred = args[2];
        if (transferred) {
          CHATTER_FUNCTION.sendCustomMessage("Bot transferred session", true, true);
          // setAudioVideoBtn();
        }
        return;
      }


      if (args[0]=='isOnline' && args[1]==uid) {
        connection.session.publish(wamp_prefix+'service.support.checkHeartBeat.'+args[2], ['iAmOnline', uid, args[2]] , {}, {
          acknowledge: true
        }).
        then(function(publication) {
        },function(){
        });
      }

      if (agentPk && args[0]=='iAmOnline' && args[1]==agentPk && args[2]==uid) {
        isAgentOnline = true;
        onlineStatus.innerHTML = 'Online';
        clearTimeout(agentOnlineTimeOut);
      }
    }

    session.subscribe(wamp_prefix+'service.support.createDetailCookie.'+uid, createCookieDetail).then(
      function (res) {
        console.log("subscribed to service.support.createDetailCookie'");
      },
      function (err) {
        console.log("failed to subscribe: service.support.createDetailCookie");
      }
    );


    if (debuggerMode == '1') {
      session.subscribe(wamp_prefix+'service.support.debugger.'+uid, debuggerCallback).then(
        function (res) {
          console.log("subscribed to service.support.debugger'");
        },
        function (err) {
          console.log("failed to subscribe: service.support.debugger");
        }
      );
    }

    session.subscribe(wamp_prefix+'service.support.checkHeartBeat.'+uid, checkHeartBeat).then(
      function (res) {
        console.log("subscribed to service.support.createDetailCookie'");
      },
      function (err) {
        console.log("failed to subscribe: service.support.createDetailCookie");
      }
    );

    session.register(wamp_prefix+'service.support.heartbeat.'+uid, heartbeat).then(
      function (res) {
        console.log("registered to service.support.heartbeat'");
      },
      function (err) {
        console.log("failed to register: service.support.heartbeat" + err);
      }
    );

    session.register(wamp_prefix+'service.support.loggedIn.'+uid, getLoggedInStatus).then(
      function (res) {
        console.log("registered to service.support.loggedIn'");
      },
      function (err) {
        console.log("failed to register: service.support.loggedIn" + err);
      }
    );

    session.register(wamp_prefix+'service.support.handleQuickActions.'+uid, handleQuickActions).then(
      function (res) {
        console.log("registered to service.support.handleQuickActions'");
      },
      function (err) {
        console.log("failed to register: service.support.handleQuickActions" + err);
      }
    );

    session.subscribe(wamp_prefix+'service.support.chat.' + uid, supportChat).then(
      function (sub) {
        subs=sub
        console.log("subscribed to topic 'service.support.chat'",uid );
        enableTextArea()
      },
      function (err) {
        console.log("failed to subscribe: service.support.chat"+err);
        disableTextArea()
      }
    );


    if (debuggerMode == '1') {
      // openChat()
    }


  };

  connection.onclose = function (session) {

  }

  setInterval(function () {
    if (botMode && !transferred) {
      isAgentOnline = true;
      onlineStatus.innerHTML = 'Online';
      return;
    }

    if (agentPk) {
      agentOnlineTimeOut = setTimeout(function () {
        isAgentOnline = false;
        onlineStatus.innerHTML = 'Away';
      }, 5000);
      connection.session.publish(wamp_prefix+'service.support.checkHeartBeat.'+agentPk, ['isOnline' , agentPk, uid] , {}, {
        acknowledge: true
      }).
      then(function(publication) {
      },function(){
      });
    }else {
      console.log('show online, no agent pk');
      isAgentOnline = true;
      onlineStatus.innerHTML = 'Online';
    }
  }, 10000);

  function createChatDiv() {
    var body = document.getElementsByTagName("BODY")[0];
    var mainDiv = document.createElement("div");
    mainDiv.id="mainSyrowDiv"
    mainDiv.innerHTML = {% include "chat.html" %}

    mainDiv.style.font ="normal 75% Arial, Helvetica, sans-serif"
    body.appendChild(mainDiv);

  }
  createChatDiv()
  if(type_of_icon=="Box"){
    document.getElementById('circleStyle').style.display='none';
    document.getElementById('boxStyle').style.display='';
  }else{
    document.getElementById('circleStyle').style.display='';
    document.getElementById('boxStyle').style.display='none';
  }
  var device;
  var chatOpen = false;
  var audioContains=false,videoContains=false;
  var videoWaiting = false;
  var audioWaiting = false;
  var timeoutForHidingFrameAud;
  var timeoutForHidingFrameVid;
  var unreadMsgCount = 0;

  {% include "chat.elements.js" %}

  var exitBtn = document.getElementById('exitBtn');
  var singleService = document.getElementById('singleService');
  var modal = document.getElementById('myModal');
  var modalContent = document.getElementById('modalContent');
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  chatBox.style.display = "none";
    inputText.addEventListener('keyup',function(e){
      if(inputText.value.length>0){
        document.getElementById('paperPlane').style.color='var(--windowColor)'
      }else{
        document.getElementById('paperPlane').style.color="#A0A0A0"
      }
    })
  inputText.addEventListener('keydown',function(e){
    if(window.innerWidth <= 600) {
      return
     } else {
       if (e.keyCode == 13 && !e.shiftKey){
         e.preventDefault();
         sendMessage(inputText.value);
       }
       if (e.keyCode == 13&&e.shiftKey){
         // console.log('here');
       }
     }
  })

  inputText.addEventListener('click',function(e){
    if (device=='sm') {
      scroll();
    }
  })

  var chatCircleText =   document.getElementById('chatCircleText')
  var callCircleText =   document.getElementById('callCircleText')
  var audioCircleText =  document.getElementById('audioCircleText')
  var videoCircleText = document.getElementById('videoCircleText')
  var ticketCircleText = document.getElementById('ticketCircleText')
  var Syrow24hSupportText = document.getElementById('Syrow24hSupportText')
  var urlforConferenceForAgent,urlforConference,winCol,streamTyp

  function openModal(imageSrc) {
    modalContent.innerHTML = '<img  src="'+ imageSrc +'" style="width:100%; box-sizing:border-box;">';
    modal.style.display = "block";
  }

  function reachChatBoxForInfo(){
    connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'CustmorClosedTheChat' ] , {}, {
      acknowledge: true
    }).
    then(function(publication) {
      console.log("call sent to "+agentPk +" for closing the chat by customer");
    },function(){
      console.log('failed to call '+agentPk+' for closing the chat by customer');
    });
  }

  var videoOpened = false
  var audioOpened = false
  var getFrameContent;

  singleService.style.display = "none";
  function checkCookie() {
    uid = getCookie("uid");
    if (uid != "") {
        fetchThread(uid);
    } else {
        uid = new Date().getTime()
        if (uid != "" && uid != null) {
            setCookie("uid", uid, 365);
        }
        fetchThread(uid);
    }
    connection.open();
  }
  checkCookie();
  ChatWithUs.style.display="none"
  document.getElementById('sy-main-icon').style.display = "none";
  setTimeout(function(){
    isChatOpened = getCookie("chatOpenCookie");
    if (isChatOpened != "") {
        if (isChatOpened==='true') {
          document.getElementById("sy-main-icon").classList.remove('first_animation');
          singleService.classList.remove('first_animation');
          openChat()
          ChatWithUs.style.display="none";
        }else {
          ChatWithUs.style.display="block";
        }
    }else {
      ChatWithUs.style.display="block";
    }
    document.getElementById('sy-main-icon').style.display = "";
  }, 2000);

  var mainStr = "";
  var supportOptions = [ {name:'callCircle' , value:true} , {name:'chatCircle' , value:true} , {name:'audioCircle' , value:true}, {name:'videoCircle' , value:true} , {name:'ticketCircle' , value:true} ];

  for (let i = 0; i < supportOptions.length; i++) {
    if (supportOptions[i].name=='callCircle') {
      supportOptions[i].value = callBackSupport;
    }
    if (supportOptions[i].name=='chatCircle') {
      supportOptions[i].value = chatSupport;
    }
    if (supportOptions[i].name=='audioCircle') {

      // console.log('************************');
      if(videoSupport){
          videoContains=true;
      }
      setTimeout(function () {
        if(streamType=='video'){
          supportOptions[i].value = false;
        }else{
          supportOptions[i].value = audioSupport;
        }
      }, 1000);
    }
    if (supportOptions[i].name=='videoCircle'&&streamType!='audio') {
      if(audioSupport){
          audioContains=true;
      }

      setTimeout(function () {
        if(streamType=='audio'){
          supportOptions[i].value = false;
        }else{
          supportOptions[i].value = videoSupport;
        }

      }, 1000);


    }
    if (supportOptions[i].name=='ticketCircle') {
      supportOptions[i].value = ticketSupport;
    }
  }
  serviceCount = 0
  setTimeout(function () {
    for (var i = 0 , rD = 0 , mB = 0 , mR=0 ; i < supportOptions.length; i++) {
      console.log(supportOptions[i].value,'kkkkkkkkkkkkkkkkkk');
      if (supportOptions[i].value) {
        if(!integrated_media || removeAudioVideo == true){
          if (supportOptions[i].name=='audioCircle' || supportOptions[i].name =='videoCircle') {
            document.getElementById(supportOptions[i].name).style.display = "none";
          }else {
            serviceCount++;
            var activeService = supportOptions[i].name
            rD+=2;
            mB+=60;
            mR+=1;
            var itemName = 'item-'+(i+1);
            supportString = "\
            @-moz-keyframes "+ itemName +" { 100% { \
              margin-bottom: "+mB+"px; \
              margin-right: -"+mR+"px; \
              opacity: 1; \
              -webkit-transform: rotate("+rD+"deg); \
            } }\
            @-webkit-keyframes "+ itemName +" { 100% { \
              margin-bottom: "+mB+"px; \
              margin-right: -"+mR+"px; \
              opacity: 1; \
              -webkit-transform: rotate("+rD+"deg); \
            } }\
            @-ms-keyframes item-1 { 100% { \
              margin-bottom: "+mB+"px; \
              margin-right: -"+mR+"px; \
              opacity: 1; \
              -ms-transform: rotate("+rD+"deg); \
            } }\
            "
            mainStr = mainStr.concat(supportString);
          }

        }
        else{

          serviceCount++;
          var activeService = supportOptions[i].name
          rD+=2;
          mB+=60;
          mR+=1;
          var itemName = 'item-'+(i+1);
          supportString = "\
          @-moz-keyframes "+ itemName +" { 100% { \
            margin-bottom: "+mB+"px; \
            margin-right: -"+mR+"px; \
            opacity: 1; \
            -webkit-transform: rotate("+rD+"deg); \
          } }\
          @-webkit-keyframes "+ itemName +" { 100% { \
            margin-bottom: "+mB+"px; \
            margin-right: -"+mR+"px; \
            opacity: 1; \
            -webkit-transform: rotate("+rD+"deg); \
          } }\
          @-ms-keyframes item-1 { 100% { \
            margin-bottom: "+mB+"px; \
            margin-right: -"+mR+"px; \
            opacity: 1; \
            -ms-transform: rotate("+rD+"deg); \
          } }\
          "
          mainStr = mainStr.concat(supportString);
        }
      }else {
          document.getElementById(supportOptions[i].name).style.display = "none";
      }

    }
    if (serviceCount==1) {
      setTimeout(function () {
          singleService.style.display = ""
          supportCircle.style.display = "none"

          var singleServiceText = document.getElementById('singleServiceText')
          var singleServiceFont = document.getElementById('singleServiceFont')

          singleService.addEventListener("mouseover" , function () {
            singleServiceText.style.display = ""
          })

          singleService.addEventListener("mouseleave" , function () {
            singleServiceText.style.display = "none"
          })

          if (activeService == 'callCircle') {
            singleServiceText.innerHTML = "Callback"

            if (support_icon=='{{serverAddress}}') {
              singleServiceFont.className = "SyrowFont font-SyrowCallBack sy-md-2 sy-ops"
              document.getElementById('singleServiceSupportDp').style.display = "none"
            }else {
              singleServiceFont.className = "SyrowFont sy-md-2 sy-ops"
            }

          }else if (activeService == 'chatCircle') {
            singleServiceText.innerHTML = "Chat"
            singleService.addEventListener("click" , openChat , false)

            if (support_icon=='{{serverAddress}}') {
              singleServiceFont.className = "SyrowFont font-SyrowChat sy-md-2 sy-ops"
              document.getElementById('singleServiceSupportDp').style.display = "none"
            }else {
                singleServiceFont.className = "SyrowFont sy-md-2 sy-ops"
            }

          }else if (activeService == 'audioCircle') {
            singleServiceText.innerHTML = "Audio Call"

            if (support_icon=='{{serverAddress}}') {
              singleServiceFont.className = "SyrowFont font-SyrowAudioCall sy-md-2 sy-ops"
              document.getElementById('singleServiceSupportDp').style.display = "none"
            }else {
              singleServiceFont.className = "SyrowFont sy-md-2 sy-ops"
            }
          }else if (activeService == 'videoCircle') {
            singleServiceText.innerHTML = "Video Call"

            if (support_icon=='{{serverAddress}}') {
              singleServiceFont.className = "SyrowFont font-SyrowVideoCall sy-md-2 sy-ops"
              document.getElementById('singleServiceSupportDp').style.display = "none"
            }else {
              singleServiceFont.className = "SyrowFont sy-md-2 sy-ops"
            }
          }else if (activeService == 'ticketCircle') {
            singleServiceText.innerHTML = "Ticket"
            if (support_icon=='{{serverAddress}}') {
                singleServiceFont.className = "SyrowFont font-SyrowTicket sy-md-1 sy-ops"
              document.getElementById('singleServiceSupportDp').style.display = "none"
            }else {
                singleServiceFont.className = "SyrowFont sy-md-1 sy-ops"
            }
          }
      }, 110);
    }
  }, 1000);

  function setStyle() {
    var newStyle = document.createElement('style');
    {% include "chat.css" %}
    document.head.appendChild(newStyle);
  }

  setTimeout(function () {
    setStyle()
  }, 1500);

  function endChat() {
    chatClosed = true
    if (feedbackFormOpened) {
      return
    }

    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         setCookie("chatOpenCookie", false, 365);
         var dataToSend = {uid:uid , userEndedChat: 'CHAT CLOSED BY USER' , sentByAgent:false };
         connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'CL' , dataToSend ] , {}, {
           acknowledge: true
         }).
         then(function(publication) {
           console.log("Published to "+agentPk+" to end chat");
         },function(){
           console.log('failed to call '+agentPk+" to end chat");
         });
       }
     };
     xhttp.open('PATCH', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/', true);
     xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
     xhttp.send(JSON.stringify({status:"closed",closedByUser:1, uid:uid}));
    openFeedback()
  }

  feedbackFormOpened = false
  feedbackFormSubmitted = false

  function openFeedback(id) {
    hideAudioAndVidoeBtn();

    if (feedbackFormOpened) {
      return
    }
    endOfConversation()
    feedbackFormOpened = true
    console.log('coming in open feedback');
    var id = id;
    var div = document.createElement("div");
    div.id="offlineMessage"
    div.innerHTML =  {% include "chat.feedback.html" %}
    messageBox.appendChild(div);
    scroll();
    var stars = document.getElementById('stars');
    var submitStars = document.getElementById('submitStars');
    messageComposer.style.display = "none";
    startNewChatBtn.style.display = "block";
    if (emailRecieved) {
      // ratingForm.email = emailId
      var emailId = document.getElementById('emailId')
      emailId.style.display = "none"
    }
    submitStarForm(id);
  }

  function thankYouMessage() {
    console.log('coming in thankyou');
    var div = document.createElement("div");
    div.id="thankYou"
    div.innerHTML = {% include "chat.thankyou.html" %}
  messageBox.appendChild(div);
  scroll();
  }

  function submitStarForm(id) {

    var submitCancel=document.getElementById('submitCancel')
    var offlineMessage=document.getElementById('offlineMessage')

    submitCancel.addEventListener('click',function(){
        thankYouMessage();
        submitStars.style.display = "none";
        offlineMessage.style.display="none"
    })

    var myformrating;

    submitStars.addEventListener("click", function() {

      submitStars.style.display = "none";
      offlineMessage.style.display="none"
      var feedbackText = document.getElementById('feedbackText')
      var ratingForm = {
        customerRating:0,
        customerFeedback:feedbackText.value,
        uid : uid
      }
      var emailId = document.getElementById('emailId').value

      if (!emailRecieved) {
        ratingForm.email = emailId
      }
      var star1 = document.getElementById('star-1')
      var star2 = document.getElementById('star-2')
      var star3 = document.getElementById('star-3')
      var star4 = document.getElementById('star-4')
      var star5 = document.getElementById('star-5')
      if (star1.checked) {
        ratingForm.customerRating = 1
      }
      if (star2.checked) {
        ratingForm.customerRating = 2
      }
      if (star3.checked) {
        ratingForm.customerRating = 3
      }
      if (star4.checked) {
        ratingForm.customerRating = 4
      }
      if (star5.checked) {
        ratingForm.customerRating = 5
      }
      myformrating=ratingForm.customerRating
      ratingFormObject = ratingForm
      ratingForm = JSON.stringify(ratingForm)
      var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
           submitStars.style.display = "none";
           submitCancel.style.display='none'
           thankYouMessage()
           feedbackFormSubmitted = true
           closeSupport.click()
            var dataToSend = {uid:uid , usersFeedback:ratingFormObject.customerFeedback  , rating:ratingFormObject.customerRating , sentByAgent:false };

             connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'FB' , dataToSend ] , {}, {
               acknowledge: true
             }).
             then(function(publication) {
               console.log("Published to "+agentPk+" for feedback");
             },function(){
                console.log("failed to publish "+agentPk+" for feedback");
                alert('failed to publish feedback')
             });
         }
       };
       xhttp.open('PATCH', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/', true);
       xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
       xhttp.send(ratingForm);

    }, false);
  }

  closeSupport.style.display = "none";
  var chatClosed = false



  startNewChatBtn.addEventListener("click" , function() {

    unreadMsgCount = 0;
    unreadMessageCircleStyle.style.display = "none";
    unreadMessageCircleStyle.innerHTML = unreadMsgCount;
    unreadMessageBoxStyle.style.display = "none";
    unreadMsgSingleServ.style.display = "none";

    // or you can use variable feedbackFormSubmitted which is true only if feedbackForm is submitted
    messageBox.innerHTML = '';
    isConfirmedToEnd=false;
    confirmationOpened = false;
    msgCount=0;
    document.getElementById('logo_ji').src = dpSupport
    agentName.innerHTML = nameSupport
    document.cookie = encodeURIComponent("uid") + "=deleted; expires=" + new Date(0).toUTCString()
    uid = new Date().getTime()
    setCookie("uid", uid, 365);
    chat = {user : custName , messages : [ { message:"first", sentByAgent:true , created:  new Date() } ] }
    pushMessagesCalled = false;
    pushMessages()
    setAudioVideoBtn();
    streamType=''
    countForFrameContent=0;
    if(countForFrameContent>0){
      document.getElementById('iFrame1').src = '';
    }

    // console.log('Came here ... chat ');
    messageComposer.style.display = "";
    startNewChatBtn.style.display = "none";
    audioSection.style.display = "none";
    videoSection.style.display = "none";
    chatBox_content.style.marginTop = "0"

    agentPk =  null;
    threadExist = undefined;
    chatThreadPk = undefined;
    emailRecieved = false;
    isAgentOnline = false;
    transferred = false;

    connection._transport.close()
    inputText.disabled = true;
    inputText.placeholder = "Initializing....";
    paperClip.style.display = "none";
    paperPlane.style.display = "none";

    setTimeout(function () {
      inputText.disabled = false;
      inputText.placeholder = "Message...";
      paperClip.style.display = "";
      paperPlane.style.display = "";
    }, 2000);


    var visitorDetails = getCookie("uidDetails");
    if (visitorDetails != "") {
      visitorDetails = JSON.parse(visitorDetails)
      // setVisitorDetails(visitorDetails.name, visitorDetails.email, visitorDetails.phoneNumber)
      var uid = getCookie("uid");
      if (uid!="") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var data = JSON.parse(this.responseText)
              if (data.length==0) {
                var xhttp = new XMLHttpRequest();
                 xhttp.onreadystatechange = function() {
                   if (this.readyState == 4 && this.status == 201) {
                     console.log('posted successfully');
                   }
                 };
                 xhttp.open('POST', '{{serverAddress}}/api/chatbot/visitor/', true);
                 xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
                 xhttp.send(JSON.stringify({uid:uid,name:visitorDetails.name,email:visitorDetails.email,phoneNumber:visitorDetails.phoneNumber}));
              }
            }
        };
        xhttp.open('GET', '{{serverAddress}}/api/chatbot/visitor/?uid='+uid  , true);
        xhttp.send();
      }
    }
    feedbackFormOpened = false
    feedbackFormSubmitted = false
  })

  function unableToAns(typ) {
    var textToDisplay = ''
    var retryTag = ''

    if (typ=='audio') {
      textToDisplay = 'Unable to answer the call, kindly'
      retryTag = '<a id="retryAudio" style="cursor:pointer;" >retry</a>'
    }else {

      textToDisplay = 'Unable to answer the call, kindly'
      retryTag = '<a id="retryVideo" style="cursor:pointer;" >retry</a>'
    }

    var unableToAnsDiv = '<div style="clear: both; text-align:center; background-color:none; padding:5px 10px;margin:8px; border-radius:0px 20px 20px 20px; box-sizing:border-box;max-width:94%;"><p style="background-color:#e0f1fa; font-size:12px; color:#444343 !important; border-radius:4px; padding:2px 7px; margin:0px; display:inline-block;" >'+textToDisplay+' '+retryTag+'</p></div>'

    var div = document.createElement("div")
    div.innerHTML = unableToAnsDiv
    messageBox.appendChild(div);

    if (typ=='audio') {
      document.getElementById('retryAudio').addEventListener("click", function () {
        audioBtn.click()
        messageBox.removeChild(div);
      }, false)
    }else {
      document.getElementById('retryVideo').addEventListener("click", function () {
          videoBtn.click()
          messageBox.removeChild(div);
      }, false)
    }

  }

  function resetConnection() {
    console.log('connection reset');
  }

  connection.onclose = function(reason, details) {
    console.log("Connection lost: "+ reason);
    if (reason=='closed') {
      inputText.placeholder = "Connecting....";
      paperClip.style.display = "none";
      paperPlane.style.display = "none";
      // var connection = new autobahn.Connection({url: '{{wampServer}}', realm: 'default'});

      var connection = new autobahn.Connection({
        transports : [
           {
              'type': 'websocket',
              'url': '{{wampServer}}',
           },
           {
              'type': 'longpoll',
              'url': '{{wampLongPoll}}',
           }
        ],
        // url: wampServer,
        realm: 'default'
      });


      connection.open()
    }
    if (reason=='unreachable') {
      // var xhttp = new XMLHttpRequest();
      // xhttp.onreadystatechange = function() {
      //   if (this.readyState == 4 && this.status == 200) {
      //     resetConnection()
      //   }
      // };
      // xhttp.open('GET', '{{serverAddress}}/api/ERP/crossbar/?val=restart', true);
      // xhttp.send();
    }
  }

  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
    // if (event.data=='loadMyOrders') {
    //   var url = 'https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk'
    //    window.open(url);
    // }
    if (event.data=='calledToHideVideo') {

      connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'calledToHideVideo' ] , {}, {
        acknowledge: true
      }).
      then(function(publication) {
        console.log("Published to "+agentPk+" for calledToHideVideo");
      },function(){
        console.log("Fialed to publish "+agentPk+" for calledToHideVideo");
      });
    }
    if (event.data=='calledToShowVideo') {
      connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'calledToShowVideo' ] , {}, {
        acknowledge: true
      }).
      then(function(publication) {
        console.log("Published to "+agentPk+" for calledToShowVideo");
      },function(){
        console.log("Fialed to publish "+agentPk+" for calledToShowVideo");
      });
    }
    if (event.data=='hideTheMainFrame') {
      document.getElementById('iframeDiv').style.display = "none";
    }else if(event.data=='showTheMainFrame'){
      document.getElementById('iframeDiv').style.display = "block";
    }
    if (event.data== 'replyToUseruserleft'){
      audioWaiting = true;
      videoWaiting = true;
      setTimeout(endOfConversation, 1000);
    }
    if (event.data== 'dintPickTheCall'){
      if(isAudioClicked){
        audioBtn.click()
        unableToAns('audio');
      }else if(isVideoClicked){
        videoBtn.click()
        unableToAns('video');
        chatBox_header.style.borderRadius = header_bor_rad_no_vid; // header
        chatBox_footer.style.borderRadius = footer_bor_rad_no_vid; // footer
      }
    }
    if (event.data== 'timeToStart'){
      function publishAboutCall(typOfCall) {
        if (typOfCall=='audio') {
          var callType = 'AC'
        }else if (typOfCall=='video') {
          var callType = 'VCS'
        }
        let profDetail = false;
        let detail = getCookie("uidDetails");
        if (detail != "") {
          profDetail = JSON.parse(detail)
        }

        if (isAgentOnline && agentPk) {
          let dataToPublish = [uid, callType, [] , custID, urlforConferenceForAgent]
          console.log('publish to my agent',agentPk);
          setTimeout(function () {
            connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, dataToPublish , {}, {
              acknowledge: true
            }).
            then(function(publication) {
              console.log("called service.support.agent."+agentPk);
            },function(err){
              console.log("failed to call "+agentPk);
            });
          }, 1000);
        }else {
          let dataToPublish = [uid, callType, [], custID, profDetail, chatThreadPk, custName, urlforConferenceForAgent]
          console.log('publish to all',agentPk);
          setTimeout(function () {
            connection.session.publish(wamp_prefix+'service.support.agent', dataToPublish , {}, {
              acknowledge: true
            }).
            then(function(publication) {
              console.log("Published");
            });
          }, 1000);
        }
        if (typOfCall=='audio') {
          createLogs('audio call started');
        }
        if (typOfCall=='video') {
          createLogs('video call started');
        }
      }

      if (streamTyp=='video') {
        videoOpened = true
      }else if(streamTyp=='audio'){
        audioOpened = true
      }
      if (threadExist==undefined) {
        var firstMessageText = extractContent(firstMessage);
        let dataToPost = {uid: uid , company: custID, firstMessage:firstMessageText,typ:streamTyp}
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 201) {
             var chatThreadData = JSON.parse(this.responseText)
             threadExist = true
             chatThreadPk = chatThreadData.pk
             participants= chatThreadData.participants;
             transferred = chatThreadData.transferred
             publishAboutCall(streamTyp)
           }
         };
         xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/', true);
         xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
         xhttp.send(JSON.stringify(dataToPost));
      }else {
        var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
             publishAboutCall(streamTyp)
           }
         };
         xhttp.open('PATCH', '{{serverAddress}}/api/chatbot/chatThread/'+ chatThreadPk + '/', true);
         xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
         xhttp.send(JSON.stringify({typ:streamTyp}));
      }
    }
    if (event.data.event_name=='session_started') {
      if (agentPk) {
        connection.session.call(wamp_prefix + 'service.support.handleQuickActions.' + agentPk, ['session_started',event.data.event_data]).then(
          function(res) {
            console.log('called');
          },
          function(err) {
            console.log(err);
          }
        );
      }
    }
  }

  function endOfConversation() {
    if (videoOpened) {
      videoWaiting = true;
      setTimeout(function () { //frametimeout
        if (videoOpened) {
          var iFrame = document.getElementById('iFrame1')
          if (iFrame) {
            iFrame.src = '';
            if (device=='sm') {
              videoSection.innerHTML = "";
              videoSection.style.display = "none";
              chatBox_content.style.marginTop = "0";
            }else {
              chatBox_header.style.borderRadius = header_bor_rad_no_vid; //header
              chatBox_footer.style.borderRadius = footer_bor_rad_no_vid; //footer
              var iframeDiv = document.getElementById('iframeDiv')
              iframeDiv.parentNode.removeChild(iframeDiv);
            }
            videoOpened = false;
            videoWaiting = false;
          }
        }
      }, 500);

    }else if(audioOpened){
      audioWaiting = true;
      console.log(audioOpened , 'audio call ended');
      timeoutForHidingFrameAud = setTimeout(function () { //frametimeout
        console.log('timeouttt aud');
        if (audioOpened) {
          var iFrame = document.getElementById('iFrame1')
          if (iFrame) {
            console.log('audio call iframe removed');
            iFrame.src = '';
            audioSection.innerHTML = "";
            audioSection.style.display = "none";
            chatBox_content.style.marginTop = "0";
            audioOpened = false;
            audioWaiting = false;
          }
        }
      }, 500);
    }
  }

  function deactivateAudioFrame(){
    if(getFrameContent!=undefined){
      getFrameContent.postMessage('userleft',webRtcAddress );
    }
    audioSection.style.display = "none";
    chatBox_content.style.marginTop = "0";
    if (audioOpened) {
      createLogs('audio call ended');
    }
  }
  function deactivateVideoFrame(){
    console.log('in deactivateVideoFrame');
    if(getFrameContent!=undefined){
      getFrameContent.postMessage('userleft',webRtcAddress );
    }
    // alert('deactivating audio frame')
    if (videoOpened) {
      let iframeDiv = document.getElementById('iframeDiv')
      if (iframeDiv) {
        iframeDiv.style.display="none"
      }
      videoSection.style.display = "none";
      chatBox_content.style.marginTop = "0";

      chatBox_header.style.borderRadius = header_bor_rad_no_vid; //header
      chatBox_footer.style.borderRadius = footer_bor_rad_no_vid;
    }

    if (videoOpened) {
      if (document.getElementById('iframeDiv')) {
        document.getElementById('iframeDiv').style.display="none"
        videoSection.style.display = "none";
        chatBox_content.style.marginTop = "0";
        var frame = document.getElementById('iframeDiv');
        if (frame.contentWindow!=undefined || frame.contentDocument!=undefined) {
          frameDoc = frame.contentDocument || frame.contentWindow.document;
          frameDoc.removeChild(frameDoc.documentElement);
        }
        frame.src=''
      }
    }
  }

  function togglingActive(element,value,type){
    if(type=='video'){
      if(value){
        element.classList.add('changeOpacity')
        element.classList.remove('font-SyrowVideoCall')
        element.classList.add('font-SyrowVideo-off')
      }else{
        element.classList.remove('changeOpacity')
        element.classList.add('font-SyrowVideoCall')
        element.classList.remove('font-SyrowVideo-off')
      }
    }else{
      if(value){
        element.classList.add('changeOpacity')
        element.classList.remove('font-SyrowPhone1')
        element.classList.add('font-SyrowPhone-call')
      }else{
        element.classList.remove('changeOpacity')
        element.classList.add('font-SyrowPhone1')
        element.classList.remove('font-SyrowPhone-call')
      }
    }

  }
  var videoBtn=document.getElementById('videoBtn')
  var audioBtn=document.getElementById('audioBtn')
  var isVideoClicked=false;
  var isAudioClicked=false;

  function setAudioVideoBtn(){
    setTimeout(function () {
      if(videoContains&&streamType!='audio' && transferred){
        videoBtn.style.display='block'
      }
      if(audioContains&&streamType!='video' && transferred){
        audioBtn.style.display='block'
      }

      if (removeAudioVideo) {
        if (videoBtn) {
          videoBtn.style.display='none'
        }
        if (audioBtn) {
          audioBtn.style.display='none'
        }
      }

    }, 1000);
  }

  setAudioVideoBtn();
  var audioSet=false;
  var videoSet=false;
  videoBtn.addEventListener("click",function(){



    // togglingActive(videoBtn,isVideoClicked,'video')
  })

  videoCircle.addEventListener('click',function () {
    openChat();
    videoBtn.click()
  })

  audioCircle.addEventListener('click',function () {
    openChat();
    audioBtn.click()
  })

  var countForFrameContent=0;

  audioBtn.addEventListener("click",function(){
    togglingActive(audioBtn,isAudioClicked,'audio')
  })

  function hideAudioAndVidoeBtn(){
    videoBtn.style.display='none'
    audioBtn.style.display='none'
  }
  function createLogs(logText) {
    var logText = logText
    var dataToSend = {uid: uid , sentByAgent:false , created: new Date(), logs:logText};
    var dataToAdd = {uid: uid, sentByAgent:false, created:dataToSend.created, message:null, logs:logText, delivered:false, read:false, is_hidden: false};
    if (agentPk) {
      dataToAdd.user = agentPk;
    }
    function publishLogs(messageData) {
      var messageData = messageData
      var uidDetails = false;
      var details = getCookie("uidDetails");
       if (details != "") {
          uidDetails = JSON.parse(details)
       }
      let dataToPublish = [uid, 'M', messageData, custID, uidDetails, chatThreadPk]
      connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, dataToPublish, {}, {
        acknowledge: true
      }).
      then(function(publication) {
        document.getElementById('paperPlane').style.color="#A0A0A0"
        console.log("service.support.agent."+agentPk);
      },function(){
        console.log('Failed to publish message to all');
      });
    }
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 201) {
         console.log('posted successfully');
         var messageData = JSON.parse(this.responseText);

          window.postMessage({autoPlay : true}, "*");

          if (agentPk) {
            publishLogs(messageData)
          }
       }
     };
     xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/supportChat/', true);
     xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
     xhttp.send(JSON.stringify(dataToSend));
  }

  var isConfirmedToEnd=false;
  var confirmationOpened = false;

  function addExitConfirmation() {
    confirmationOpened = true;
    var confirmationBox = '<div class="confirmationDiv">'+
    '<div class="confirmationSureText">Are you sure you want to end this chat?</div>'+
    '<div class="confirmationBtnDiv">'+
      '<button id="confirmationCancel" class="confirmationBtn">Cancel</button>'+
      '<button id="confirmationYes" class="confirmationBtn">Yes</button>'+
      '</div>'+
    '</div>'
    var div = document.createElement("div");
    div.setAttribute("id", "confirmationBox")
    div.innerHTML = confirmationBox
    messageBox.appendChild(div);
    scroll();
    disableTextArea('cancel to continue...');
    document.getElementById('confirmationCancel').addEventListener("click", function() {
      var confBox = document.getElementById('confirmationBox')
      confBox.parentNode.removeChild(confBox);
      enableTextArea();
      confirmationOpened = false;
    });

    document.getElementById('confirmationYes').addEventListener("click", function() {

      var confBox = document.getElementById('confirmationBox')
      confBox.parentNode.removeChild(confBox);
      isConfirmedToEnd=true

      if (threadExist==undefined) {
        return
      }
      endChat();
    });
  }

  function removeAddAgainConfirmationBox() {
    if (confirmationOpened) {
      let confirmationBox = document.getElementById('confirmationBox');
      if (confirmationBox) {
        confirmationBox.parentNode.removeChild(confirmationBox);
         isConfirmedToEnd=false;
         confirmationOpened = false;
        addExitConfirmation()
      }
    }
  }

  exitBtn.addEventListener("click", function() {
    if(chatThreadPk && !confirmationOpened && !feedbackFormOpened){
      addExitConfirmation()
      return;
    }
    if(isConfirmedToEnd){
      if (feedbackFormOpened) {
        closeSupport.click()
        return
      }
    }else{
      if(chat.messages.length<2){
        closeSupport.click()
        return
      }
      if (!confirmationOpened && !feedbackFormOpened) {
        addExitConfirmation()
      }
    }
  }, false);

  paperPlane.addEventListener("click", function() {
    document.getElementById('inputText').focus()
    sendMessage(inputText.value);
  }, false);

  function messageDiv(message) {
    message.timeDate = timeWithDate(new Date(message.created))
    if (message.attachment) {
      setTimeout(function () {
        for (var i = 1; i <= msgCount; i++) {
          document.getElementById('attachedFile'+i).addEventListener("click",function(e){
            openModal(e.target.src)
          },false)
        }
      }, 1000);
      if (message.attachmentType=='image') {
        msgCount++;
        attachedFile = '<img  id="attachedFile'+msgCount+'" src="'+ message.attachment +'" style="width:200px; min-height:10px; box-sizing:border-box;">'
      }else if (message.attachmentType=='instructionImage') {
        attachedFile = '<img  src="'+ message.attachment +'" style="width:200px; box-sizing:border-box;">'

      }else if (message.attachmentType=='audio') {
          console.log('audio');
        attachedFile = '<audio style="width:200px; box-sizing:border-box;" src="'+ message.attachment +'" controls></audio>'
      }else if (message.attachmentType=='video') {
          console.log('video');
        attachedFile = '<video width="200" height="180" style="box-sizing:border-box;" src="'+ message.attachment +'" controls></video>'
      }else if (message.attachmentType=='application') {
          console.log('application');
          attachedFile ='<p style="font-size:14px !important; margin:5px 0px !important;width:100%; line-height: 1.50; box-sizing:border-box;">  <a target="_blank" style="font-size:14px !important; color:#3961ea !important; word-wrap: break-word !important;" href="'+message.attachment+'"> '+message.attachment+' </a></p>'
      }
    }

    if (message.logs==null) {
      if (message.message!=null && message.attachmentType!=null) {
        console.log('youtube link');
        attachedFile = '<iframe width="100%" height="180" style="box-sizing:border-box;" src="'+message.message+'"frameborder="0" allowfullscreen></iframe>'
        var msgDiv =attachedFile
      }else {
        if (message.attachment==null) {
          var str= message.message
          var expression = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
          var regex = new RegExp(expression);
          var res = str.split(' ');
          var pTag
          res.forEach((r)=>{
            if (r.match(regex)) {
              str=str.replace(r,'<a style="font-size:14px !important; color:#3961ea !important;" href="'+r+'" target="_blank">'+r+'</a>')
                pTag='<p style="color: inherit !important; font-size:14px !important; margin:5px 0px !important;width:100%; box-sizing:border-box !important; text-align:start !important;word-wrap: break-word !important; white-space: pre-wrap;">'+ str +'</p>'
            }else{
                 pTag='<p style="color: inherit !important; font-size:14px !important; margin:5px 0px !important; box-sizing:border-box !important;width:100%; text-align:start !important;word-wrap: break-word !important; white-space: pre-wrap;">'+ str +'</p>'
            }
          })
          msgDiv = pTag
        }else {
          msgDiv = attachedFile
        }
      }
    }

    if (message.logs==null) {
      if (!message.sentByAgent) {
        var msgHtml = '<div id="msg'+chat.messages.length+'" style="margin : 0px 0px 15px; box-sizing:border-box;">'+
                        '<div style=" clear: both; float:right; background-color:var(--windowColor) !important; color:var(--fontAndIconColor) !important;  padding:5px 10px;margin:8px;max-width:94%; border-radius:20px 0px 20px 20px; box-sizing:border-box; ">'+
                          msgDiv+
                        '</div>'+
                        '<div style="clear: both; float:right; padding:0px 10px 5px 10px; font-size:9px !important;">'+ message.timeDate +'</div>'+
                      '</div>'
        return msgHtml

      }else {
        var msgHtml = '<div id="msg'+chat.messages.length+'" style="margin:0px 0px 10px; box-sizing:border-box;" >'+
                  '<div style="clear: both; float:left; background-color:#f6f6f6 !important; padding:5px 10px;margin:8px; border-radius:0px 20px 20px 20px; box-sizing:border-box;max-width:94%;">'+
                     msgDiv+
                  '</div> '+
                  '<div style="clear: both; float:left; padding:0px 10px 5px 10px; font-size:9px !important;">'+ message.timeDate +'</div>'+
                '</div> '
        return msgHtml
      }
    }else {
      return ''
    }
  }

  var activityPk;
  var loadTime = new Date().getTime();

  function createActivity() {
    ref = document.referrer
    console.log(ref,typeof(ref),window.location.hostname);
    var dataToPost = {"uid":uid, "page":window.location.href}
    if (ref == null || ref.length==0) {
      dataToPost['reference'] = 'Direct'
    }else if (ref.includes(window.location.hostname)) {
      dataToPost['reference'] = 'Self'
    }else {
      dataToPost['reference'] = ref
    }
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 201) {
         console.log(this.responseText);
         activityPk = JSON.parse(this.responseText).pk
         console.log(activityPk);
       }
     };
     xhttp.open('POST', '{{serverAddress}}/activities/', true);
     xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
     xhttp.send(JSON.stringify(dataToPost));
  }

  function updateActivity(dt) {
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         console.log('Activaty Updated');
       }
     };
     xhttp.open('PATCH', '{{serverAddress}}/activities/?act='+ activityPk , true);
     xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
     xhttp.send(JSON.stringify(dt));
  }

  function checkActivity() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText)
          console.log(data);
          if (!data.pk) {
            createActivity()
          }else{
            activityPk = data.pk;
            console.log(activityPk);
          }
        }
    };
    xhttp.open('GET', '{{serverAddress}}/activities/?uid=' + uid , true);
    xhttp.send();
  }
  checkActivity()
  setInterval(function() {
    updateActivity({'duration': 60})
  }, 60000)

  var pushMessagesCalled = false;

  function pushMessages() {
    if (pushMessagesCalled) {
      return
    }
    pushMessagesCalled = true;
    for (var i = 0; i < chat.messages.length; i++) {
      var div = document.createElement("div");
      div.setAttribute("id", "first_msg")
      if (chat.messages[i].message=="first") {
        firstMessage = firstMessage.replaceAll("<a","<a style="+'color:var(--windowColor) !important;text-decoration:none')
        firstMessage = firstMessage.replaceAll("<li>","<li style='list-style:none'>")
        div.innerHTML = '<div style="margin:0px 0px 10px; box-sizing:border-box;" >'+
          '<div style="clear: both; float:left; background-color:#f6f6f6 !important; padding:5px 10px;margin:8px; border-radius:5px; box-sizing:border-box;font-size:14px;text-align: initial !important;">'+
              firstMessage+
          '</div> '+
        '</div> '
      }else {
        div.innerHTML = messageDiv(chat.messages[i])
      }
      // related to the product carosal
      // var productsArr = [
      //   {image : 'https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png' , title : 'A product Title' , subTitle : '$20 only'},
      //   {image : 'https://systunix.com/media/POS/productV2/1591031671_11_covid-safety-key-500x500.jpg' , title : 'second Title' , subTitle : '$20 only'},
      //   {image : 'https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png' , title : 'A product Title' , subTitle : '$20 only'},
      // ]

      // var scrollProds = '<div class="scrollView">'
      // for (let j = 0; j < productsArr.length; j++) {
      //   const prod = productsArr[j];
      //   scrollProds += '<div class="prodView prodId'+j+'"><img src="'+ prod.image +'"><br><span class="prodHeading">'+ prod.title +'</span><br><span class="prodSubHeading">'+ prod.subTitle +'</span></div>'
      // }
      // scrollProds += '</div>'

      // console.log(scrollProds);
      // div.innerHTML = scrollProds;
      // div.onclick = function(evt){
      //   console.log(evt.target)
      //   sendMessage(evt.target.className);
      // }
      messageBox.appendChild(div);
    }
    scroll();
  }

  function onlineAgent() {
    if (agentPk) {
        connection.session.call(wamp_prefix+'service.support.heartbeat.' + agentPk, []).then(
          function (res) {
            isAgentOnline = true;
            onlineStatus.innerHTML = 'Online';
            if (!res) {
              isAgentOnline = false;
              onlineStatus.innerHTML = 'Away';
            }
         },
         function (err) {
          isAgentOnline = false;
          onlineStatus.innerHTML = 'Away';
        }
       );
    }else {
      onlineStatus.innerHTML = 'Online';
    }
  }

  function spying(inputVal) {
    countOnchange = 0;
    connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, [uid , 'T' , inputVal] , {}, {
      acknowledge: true
    }).
    then(function(publication) {
      console.log("Published to service.support.agent."+agentPk+" for spying");
    },function(){
      console.log('failed to call service.suuport.agent'+agentPk+' for spying');
    });
  }

  inputText.addEventListener('keydown', function(evt) {
    if (evt.keyCode==32 || evt.keyCode == 8 || evt.keyCode == 13 ) {
      spying(this.value)
    }
  });

  function sendMessage(inptText, is_agent, is_hidden) {
      inputText.value = ''
      if (is_hidden==undefined) {
        var is_hidden = false
      }else {
        var is_hidden = is_hidden
      }

      if (is_agent==undefined) {
        var sent_by_agent = false
      }else {
        var sent_by_agent = is_agent
      }

      if (inptText.trim().length<=0) {
        return;
      }

      if (uid!=getCookie("uid")) {
        uid = getCookie("uid");
      }
      var status;
      var youtubeLink = validateYouTubeUrl(inptText);
      if (youtubeLink) {
        status = "ML";
        link = youtubeLink;
        var dataToSend = {uid: uid , message: link, attachmentType:'youtubeLink' , sentByAgent:sent_by_agent , created: new Date() };
      }else {
        status = "M";
        var dataToSend = {uid: uid , message: inptText , sentByAgent:sent_by_agent , created: new Date() };
        var message = dataToSend
      }
      if (is_hidden) {
        dataToSend.is_hidden = true
      }

      if (agentPk) {
        dataToSend.user = agentPk
        if (!isAgentOnline) {
          dataToSend.user = null
        }else {
          dataToSend.user = agentPk
        }
      }

     function publishMessage(toWhome, chatThreadPk) {
       var toWhome = toWhome
       if (toWhome=='toAll') {
         let messageData = dataToSend;
         var uidDetails = false;

         messageData.uid = uid;
         messageData.attachment = messageData.attachment || null;
         messageData.attachmentType = messageData.attachmentType || null;
         messageData.is_hidden = messageData.is_hidden || false;
         messageData.logs = messageData.logs || null;

         let details = getCookie("uidDetails");
          if (details != "") {
             uidDetails = JSON.parse(details)
          }
         let dataToPublish = [uid, status, messageData, custID, uidDetails, chatThreadPk, custName, custID]

         console.log("botMode");
         console.log(botMode);

         if (!botMode || transferred) {
           connection.session.publish(wamp_prefix+'service.support.agent', dataToPublish, {}, {
             acknowledge: true
           }).
           then(function(publication) {
             document.getElementById('paperPlane').style.color="#A0A0A0"
           },function(){
             console.log('Failed to publish message to all');
           });

         }else{
           document.getElementById('paperPlane').style.color="#A0A0A0"
         }
         // publish message to all
       }else {
          let messageData = dataToSend;
          var uidDetails = false;
          messageData.uid = uid;
          messageData.attachment = messageData.attachment || null;
          messageData.attachmentType = messageData.attachmentType || null;
          messageData.is_hidden = messageData.is_hidden || false;
          messageData.logs = messageData.logs || null;

          let details = getCookie("uidDetails");
           if (details != "") {
              uidDetails = JSON.parse(details)
           }

          let dataToPublish = [uid, status, messageData, custID, uidDetails, chatThreadPk]

          console.log("botMode");
          console.log(botMode);

          if (!botMode || transferred) {
            connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, dataToPublish, {}, {
            acknowledge: true
            }).
            then(function(publication) {
              document.getElementById('paperPlane').style.color="#A0A0A0"
            },function(){
              console.log('Failed to publish message to agent');
            });
          }else{
            document.getElementById('paperPlane').style.color="#A0A0A0"
          }

       }
     }

     function pushMessageInView() {
       let viewDataToPush = dataToSend
       viewDataToPush.uid = uid;
       viewDataToPush.attachment = viewDataToPush.attachment || null;
       viewDataToPush.attachmentType = viewDataToPush.attachmentType || null;
       viewDataToPush.is_hidden = viewDataToPush.is_hidden || false;
       viewDataToPush.logs = viewDataToPush.logs || null;

       if (!viewDataToPush.is_hidden) {
         var div = document.createElement("div");
         div.className = "messageOpacity"
         div.innerHTML = messageDiv(viewDataToPush)
         messageBox.appendChild(div);
         scroll();
       }
     }

     function saveMessageInDb() {
       dataToSend.uid = uid;
       var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 201) {
           chat.messages.push(JSON.parse(this.responseText));
           window.postMessage({autoPlay : true}, "*");
          }
       }
       xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/supportChat/', true);
       xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
       xhttp.send(JSON.stringify(dataToSend));
     }

     function handleChatThreadAndMessage() {
       if (threadExist==undefined) {
        var firstMessageText = extractContent(firstMessage);
        let dataToPost = {uid: uid , company: custID, firstMessage:firstMessageText}

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 201) {
             var chatThreadData = JSON.parse(this.responseText)
             threadExist = true
             chatThreadPk = chatThreadData.pk
             transferred = chatThreadData.transferred

             if (transferred == true) {
               setAudioVideoBtn();
             }

             pushMessageInView()
             saveMessageInDb()
             publishMessage('toAll', chatThreadPk);
           }
           if (this.readyState == 4 && this.status == 400) {
             if (JSON.parse(this.responseText).uid[0].indexOf('already exists')>=0) {
               threadExist = undefined;
               document.cookie = encodeURIComponent("uid") + "=deleted; expires=" + new Date(0).toUTCString()
               uid = new Date().getTime()
               setCookie("uid", uid, 365);
               handleChatThreadAndMessage()
             }
           }
         };

         xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/', true);
         xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
         xhttp.send(JSON.stringify(dataToPost));

       }else {
         pushMessageInView()
         saveMessageInDb()
         if (isAgentOnline && agentPk) {
            publishMessage('toOne', chatThreadPk);
          }else {
            publishMessage('toAll', chatThreadPk);
          }
       }

     }
     handleChatThreadAndMessage();
  }
  paperClip.addEventListener("click", function() {
    filePicker.click();
  }, false);

  function publishMessageToAll(dataToPublish){
    dataToPublish.push(custID);
    if(connection.session==null||!connection.session.isOpen){
      var chatArrayLength=chat.messages.length-1;
      var obj={
        'element':document.getElementById('msg'+chatArrayLength),
        'dataToPublish':dataToPublish
      }
      disableTextArea()
      trySendingAgain.push(obj);
      document.getElementById('msg'+chatArrayLength).style.opacity = "0.5";
    }
    else{
      failedMessages.push(dataToPublish)
      for (var i = 0; i < failedMessages.length; i++) {
        console.log(failedMessages[i]);
        connection.session.publish(wamp_prefix+'service.support.agent', failedMessages[i] , {}, {
          acknowledge: true
        }).
        then(function(publication) {
          console.log("Published to all service.support.agent");
        },function (error) {
          failedMessages.push(dataToPublish)
          console.log('failed to send message to all');
       })
      }
      failedMessages=[]
    }
  }

  function publishMessageToOne(MyPk,dataToPublish){
    console.log('publisshing message');
    if(connection.session==null||!connection.session.isOpen){
      var chatArrayLength=chat.messages.length-1;
      var obj={
        'element':document.getElementById('msg'+chatArrayLength),
        'dataToPublish':dataToPublish
      }
      disableTextArea()
      trySendingAgain.push(obj);
      document.getElementById('msg'+chatArrayLength).style.opacity = "0.5";
    }
    else{
      failedMessages.push(dataToPublish)
      for (var i = 0; i < failedMessages.length; i++) {
        connection.session.publish(wamp_prefix+'service.support.agent.'+MyPk, failedMessages[i] , {}, {
          acknowledge: true
        }).
        then(function(publication) {
          console.log("Published service.support.agent."+agentPk);
        },function (error) {
          failedMessages.push(dataToPublish)
          console.log('failed to send message to '+agentPk);
       })
      }
      failedMessages=[]
    }
  }

  function disableTextArea(placeholder){
    if (placeholder==undefined) {
      var placeholder =  "Please Wait. Connecting.. ";
    }else {
      var placeholder = placeholder
    }
    inputText.disabled = true;
    inputText.placeholder =placeholder;
    paperClip.style.display = "none";
    paperPlane.style.display = "none";
  }
  function enableTextArea(){
      inputText.disabled = false;
      inputText.placeholder = "Message...";
      paperClip.style.display = "";
      paperPlane.style.display = "";
  }
  function sendFile() {
      function handleChatThreadAndFile() {
        function publishFileData(toWhome, fileData) {
          var toWhome = toWhome;
          var fileData = fileData;
          var status = "MF"
          if (toWhome=='toAll') {
            let uidDetails = false;
            let details = getCookie("uidDetails");
             if (details != "") {
                uidDetails = JSON.parse(details)
             }
            let dataToPublish = [uid , status , fileData , custID, uidDetails, chatThreadPk,custName ];

            connection.session.publish(wamp_prefix+'service.support.agent', dataToPublish, {}, {
               acknowledge: true
             }).
             then(function(publication) {
               console.log("Published the media file to all");
             },function(){
               console.log('failed to send media file to all');
             });

          }else {
            let dataToPublish = [uid , status , fileData];
            connection.session.publish(wamp_prefix+'service.support.agent.'+agentPk, dataToPublish , {}, {
                acknowledge: true
              }).
              then(function(publication) {
                console.log("Published the media file to "+agentPk);
              },function(){
                console.log('failed to send media file to '+agentPk);
              });
          }
        }
        function saveFileInDataBase() {
          var status = "MF";
          if (uid!=getCookie("uid")) {
            uid = getCookie("uid");
          }
          var file = filePicker;
          var fd = new FormData();
          fd.append('uid', uid);
          fd.append('attachment', file.files[0]);
          fd.append('attachmentType' , file.files[0].type.split('/')[0]);

          if (agentPk) {
            fd.append('user' , agentPk);
          }
          var fileData = {}
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
              var data = JSON.parse(this.responseText)
              filePk = data.pk
              var typ = file.files[0].type.split('/')[0]
              fileData.filePk = data.pk
              fileData.typ = data.attachmentType

              if (agentPk) {
                fileData.user = agentPk;
                if (!isAgentOnline) {
                  fileData.user = null
                }else {
                  fileData.user = agentPk;
                }
              }
              var div = document.createElement("div");
              div.innerHTML = messageDiv(data)
              messageBox.appendChild(div);
              scroll();
              chat.messages.push(data);
              filePicker.value = ""
              if (isAgentOnline && agentPk) {
                publishFileData('toOne', fileData)
              }else {
                publishFileData('toAll', fileData)
              }

              window.postMessage({autoPlay : true}, "*");

            }
          }
          xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/supportChat/', true);
          xhttp.setRequestHeader("X-CSRFToken", csrfToken);
          xhttp.send(fd);
        }

        if (threadExist==undefined) {
         var firstMessageText = extractContent(firstMessage);
         let dataToPost = {uid: uid , company: custID, firstMessage:firstMessageText}

          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
               var chatThreadData = JSON.parse(this.responseText)
               threadExist = true
               chatThreadPk = chatThreadData.pk
               transferred = chatThreadData.transferred
               saveFileInDataBase()
             }
             if (this.readyState == 4 && this.status == 400) {
               if (JSON.parse(this.responseText).uid[0].indexOf('already exists')>=0) {
                 threadExist = undefined;
                 document.cookie = encodeURIComponent("uid") + "=deleted; expires=" + new Date(0).toUTCString()
                 uid = new Date().getTime()
                 setCookie("uid", uid, 365);
                 handleChatThreadAndFile()
               }
             }
           };

           xhttp.open('POST', '{{serverAddress}}/api/chatbot/publicFacing/chatThread/', true);
           xhttp.setRequestHeader("Content-type", "application/json");xhttp.setRequestHeader("X-CSRFToken", csrfToken);
           xhttp.send(JSON.stringify(dataToPost));
        }else {
          saveFileInDataBase()
        }
      }
      handleChatThreadAndFile();
  }
  filePicker.onchange = function(e) {
    var file = filePicker;
    sendFile();
  }
  chatCircle.addEventListener("click", openChat , false);
  var chathasOpenedOnce=false;
  var chatSuggestionBar= document.getElementById('chatSuggestionBar')
  var chatSuggestionBar1= document.getElementById('chatSuggestionBar1')

  setTimeout(function () {
    // alert(chathasOpenedOnce)
    if(!chathasOpenedOnce && debuggerMode!= '1'){
      chatSuggestionBar.style.display="flex"
      chatSuggestionBar1.style.display="flex"
    }
  }, 10000);

  chatSuggestionBar.style.display="none"
  chatSuggestionBar1.style.display="none"
  function openChat() {
    if (videoOpened) {
      let iframeDiv = document.getElementById('iframeDiv')
      if (iframeDiv) {
        if (!videoWaiting) {
          iframeDiv.style.display = "block";
        }
      }
    }
    if (!chatOpen) {
      unreadMsgCount = 0;
      unreadMessageCircleStyle.style.display = "none";
      unreadMessageCircleStyle.innerHTML = unreadMsgCount;
      unreadMsgSingleServ.style.display = "none";
      unreadMessageBoxStyle.style.display = "none";
      scroll();
    }
    document.getElementById("sy-main-icon").classList.remove('first_animation');
    singleService.classList.remove('first_animation');
    chathasOpenedOnce=true;
    chatSuggestionBar.style.display="none"
    chatSuggestionBar1.style.display="none"
    chatOpen = !chatOpen
    setCookie("chatOpenCookie", chatOpen, 365);
    if (chatOpen) {
      supportCircle.style.display = "none";
      if (serviceCount==1) {
        singleService.style.display = "none";
      }

      if (feedbackFormOpened) {
        startNewChatBtn.style.display = "block";
        messageComposer.style.display = "none";
      }
      if (device=='sm') {
        document.getElementsByTagName("BODY")[0].style.overflowY = "hidden";
      }else {
        document.getElementsByTagName("BODY")[0].style.overflowY = "";
      }
      closeSupport.style.display = "";
      chatBox.style.animation = ""
      chatBox.style.display = "block";
      messageBox.style.animation = "moveInLeft 3s ease-out"
      closeSupport.style.animation = "rotateAnti 0.4s"
    }else {
      document.getElementsByTagName("BODY")[0].style.overflowY = "";
    }
  }

  closeSupport.addEventListener("click", function() {
    ChatWithUs.style.display=""
    if (videoOpened) {
      let iframeDiv = document.getElementById('iframeDiv')
      if (iframeDiv) {
        iframeDiv.style.display = "none";
      }
    }

    if (chatOpen) {
      chatOpen = !chatOpen
      setCookie("chatOpenCookie", chatOpen, 365);
      messageBox.style.animation = ""
      if (serviceCount==1) {
        supportCircle.style.display = "none";
        singleService.style.display = "";
      }else {
        supportCircle.style.display = "";
      }
      chatBox.style.animation = "moveInDown 0.4s ease-out"
      closeSupport.style.display = "none";
      closeSupport.style.animation = "";
      setTimeout(function () {
        chatBox.style.display = "none";
      }, 400);
    }

  }, false);

  closeIcon.addEventListener("click", function() {
    if (chatOpen) {
      ChatWithUs.style.display=""
      chatOpen = !chatOpen
      setCookie("chatOpenCookie", chatOpen, 365);
      messageBox.style.animation = ""
      if (serviceCount==1) {
        supportCircle.style.display = "none";
        singleService.style.display = "";
      }else {
        supportCircle.style.display = "";
      }
      chatBox.style.animation = "moveInDown 0.4s ease-out"
      closeSupport.style.display = "none";
      closeSupport.style.animation = "";
      setTimeout(function () {
        chatBox.style.display = "none";
      }, 400);
      if (device=='sm') {
        document.getElementsByTagName("BODY")[0].style.overflowY = "";
      }
    }
  } , false);
  {% include "chat.screensizer.js" %}
})
