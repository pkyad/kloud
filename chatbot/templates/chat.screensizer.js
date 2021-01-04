function lgDevice(x) {
    if (x.matches) {
    device = 'lg'
    document.getElementsByTagName("BODY")[0].style.overflowY = "";
  }
}

function smDevice(x) {
  if (x.matches) {
    device = 'sm'
    if (chatOpen) {
       document.getElementsByTagName("BODY")[0].style.overflowY = "hidden";
     }else {
        document.getElementsByTagName("BODY")[0].style.overflowY = "";
     }
   }
}

var sm = window.matchMedia("(max-width: 600px)")
smDevice(sm) // Call listener function at run time
sm.addListener(smDevice) // Attach listener function on state changes
var lg = window.matchMedia("(min-width: 600px)")
lgDevice(lg)
lg.addListener(lgDevice)
