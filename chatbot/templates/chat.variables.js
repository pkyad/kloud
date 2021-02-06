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
var webRtcAddress = '{{webrtcAddress}}';
var wamp_prefix = '{{wamp_prefix}}'
var msgCount=0;
var custID = {{pk}};
var custName='{{name}}'
var windowColor = '{{windowColor}}'
var custName = '{{custName}}'
var chatSupport = '{{chat}}'
var integrated_media = '{{integrated_media}}'
var botMode = '{{botMode}}'
var callBackSupport = '{{callBack}}'
var videoSupport = '{{video}}'
var audioSupport = '{{audio}}'
var ticketSupport = '{{ticket}}'
var nameSupport = '{{name}}'
var dpSupport = '{{dp}}'
var supportBubbleColor = '{{supportBubbleColor}}'
var firstMessage = `{{firstMessage | safe}}`;
var iconColor = '{{iconColor}}'
var fontAndIconColor='{{fontColor}}'
var position_of_chat="{{chatIconPosition}}";
var type_of_icon='{{chatIconType}}'
var is_blink = '{{is_blink}}'
var support_icon = '{{support_icon}}'
var welcomeMessage = '{{welcomeMessage}}'
var debuggerMode = '{{debugger}}';
var agentOnlineTimeOut;
var csrfToken = "{% csrf_token %}".split("value='")[1].split("' />")[0];
