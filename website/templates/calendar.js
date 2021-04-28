{% include "chatter.dependencies.js" %}


document.addEventListener("DOMContentLoaded", function(event) {
  var siteurl = "{{siteurl}}"
  var icon = siteurl+'static/apps/calender.png'
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
