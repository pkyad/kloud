{% include "calender.dependencies.js" %}
var bootstrap1 = document.createElement('script');
bootstrap1.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.min.js');
document.head.appendChild(bootstrap1);
var jQueryScript = document.createElement('script');
jQueryScript.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js');
document.head.appendChild(jQueryScript);
var bootstrap2 = document.createElement('script');
bootstrap2.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js');
document.head.appendChild(bootstrap2);
var bootstrap3 = document.createElement('script');
bootstrap3.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/js/bootstrap-datetimepicker.min.js');
document.head.appendChild(bootstrap3);




var siteurl = "{{siteurl}}"
var id = "{{id}}"
document.addEventListener("DOMContentLoaded", function(event) {
  var icon = siteurl+'/static/apps/calender.png'
  var userIcon = siteurl+'/static/images/avatar5.png'
  function createChatDiv() {
    var body = document.getElementsByTagName("BODY")[0];
    var mainDiv = document.createElement("div");
    mainDiv.id="calendarDiv"
    mainDiv.innerHTML = {% include "calendar.html" %}
    mainDiv.style.font ="normal 75% Arial, Helvetica, sans-serif"
    body.appendChild(mainDiv);

  }
  createChatDiv()
  function setStyle() {
    var newStyle = document.createElement('style');
    {% include "calendar.css" %}
    document.head.appendChild(newStyle);
    var link  = document.createElement('link');
    // link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css';
    link.media = 'all';
    document.head.appendChild(link);
    var link1  = document.createElement('link');
    // link1.id   = cssId;
    link1.rel  = 'stylesheet';
    link1.type = 'text/css';
    link1.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/css/bootstrap-datetimepicker.min.css';
    link1.media = 'all';
    document.head.appendChild(link1);
  }

  setTimeout(function () {
    setStyle()
  }, 1500);
  var maindiv = document.getElementById('chatBox');
  var modal = document.getElementById('myModal');
  var modalContent = document.getElementById('modalContent');

  window.onclick = function(event) {
      if (event.target == maindiv) {
        console.log('sssssss', event.target)
          modal.style.display = "block";
      }
  }


})
var slotSelected = ''
var date = ''
function getSlots() {
  var datePicker =  document.getElementById('datePicker');
  date = datePicker.value
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var slots = JSON.parse(this.responseText)
        var allSlots = document.getElementById('allSlots');
         allSlots.innerHTML = '';
        if (slots.slots.length>0) {
          var confrm = document.getElementById('confrm');
          confrm.style.display = 'block'
          for (var i = 0; i < slots.slots.length; i++) {
            var newDiv = document.createElement('div');
            newDiv.id = 'slot_'+slots.slots[i];
            newDiv.onclick=function() {
              selectSlot(this.id)
            }
            newDiv.className = 'slotbox';
            newDiv.innerHTML = slots.slots[i]
            allSlots.appendChild(newDiv);
          }
          selectSlot('slot_'+slots.slots[0])
        }
        else{
          var confrm = document.getElementById('confrm');
          confrm.style.display = 'none'
        }
    }
    else{
      var confrm = document.getElementById('confrm');
      confrm.style.display = 'none'
    }
  };
  request.open('GET', '{{siteurl}}/api/ERP/getCalendarSlots/?date='+date+'&id='+id, true);
  request.send();
  // request.setRequestHeader("Content-type", "application/json");
  // request.send(JSON.stringify(obj_to_send));
}

var selectSlot = function(arg) {
  var allslots = document.getElementsByClassName('slotbox')
  for (var i = 0; i < allslots.length; i++) {
    allslots[i].style.background = '#ffffff'
    allslots[i].style.color = '#11aaf5'
  }
  var selectedSlot = document.getElementById(arg);
  selectedSlot.style.background = '#11aaf5'
  selectedSlot.style.color = '#ffffff'
  slotSelected = arg.split('slot_')[1]
}

var createSlot = function(){
  var name = document.getElementById('name')
  var email = document.getElementById('email')
  var mobile = document.getElementById('mobile')
  var xhttp = new XMLHttpRequest();
  var csrftoken = getCookie("csrftoken")
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      name.value = ''
      email.value = ''
      mobile.value = ''
      var confrm = document.getElementById('confrm');
      confrm.style.display = 'block'
      var pwait = document.getElementById('pleaseWait');
      pwait.style.display = 'none'
      document.getElementById('alerts').innerHTML='<h4>Your appointment is been booked</h4>'
      setTimeout(function () {
        var win = document.getElementById('myModal');
        win.style.display = "none"
      }, 1500);
    }
  };
  var tempDate = new Date(date)
  var form = {
      when:tempDate,
      slot:slotSelected,
      eventType:'Meeting',
      id:id,
      name:name.value,
      email:email.value,
      mobile:mobile.value,
  }
  var confrm = document.getElementById('confrm');
  confrm.style.display = 'none'
  var pwait = document.getElementById('pleaseWait');
  pwait.style.display = 'block'
  xhttp.open('POST', '{{siteurl}}/api/PIM/genCalendarEntry/', true);
  xhttp.setRequestHeader('X-CSRFToken', csrftoken);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(form));
}
