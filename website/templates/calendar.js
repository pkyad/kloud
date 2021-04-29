{% include "calender.dependencies.js" %}

var siteurl = "{{siteurl}}"
var id = "{{id}}"
document.addEventListener("DOMContentLoaded", function(event) {
  var icon = siteurl+'/static/apps/calender.png'
  var closeIcon = siteurl+'/static/images/close.png'
  function createCalDiv() {
    var body = document.getElementsByTagName("BODY")[0];
    var mainDiv = document.createElement("div");
    mainDiv.id="calendarDiv"
    mainDiv.innerHTML = {% include "calendar.html" %}
    mainDiv.style.font ="normal 75% Arial, Helvetica, sans-serif"
    body.appendChild(mainDiv);

  }
  createCalDiv()
  function setStyle() {
    var newStyle = document.createElement('style');
    {% include "calendar.css" %}
    document.head.appendChild(newStyle);
  }

  setTimeout(function () {
    setStyle()
  }, 1500);
  var maindiv = document.getElementById('chatBox');
  var modal = document.getElementById('myModal');
  var modalContent = document.getElementById('modalContent');
  var datePicker =  document.getElementById('datePicker');
  var today = new Date()
  datePicker.value =  today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  getSlots()


  window.onclick = function(event) {
      if (event.target == maindiv) {
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
      document.getElementById('alerts').innerHTML=''
      }, 1500);
    }
  };
  var tempDate = new Date(date)
  var error = document.getElementById('errors');
  error.innerHTML = ''
  if (name.value == undefined  || name.value == null || name.value.length==0) {
    error.innerHTML = '<h4>Name is required</h4>'
    return
  }

  if (mobile.value == undefined  || mobile.value == null || mobile.value.toString().length==0) {
    error.innerHTML = '<h4>Mobile number is required</h4>'
    return
  }
  if (email.value == undefined  || email.value == null || email.value.length==0) {
    error.innerHTML = '<h4>Email is required</h4>'
    return
  }
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
var closemodal = function(){
  var win = document.getElementById('myModal');
  win.style.display = "none"
}
