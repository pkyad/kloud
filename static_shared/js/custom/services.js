app.factory('$users', function(){
  var userProfiles = [];

  return {
    get : function(input , refetch){
      if (typeof input == 'number') {
        input = input.toString(); // if the PK is passed then get the string form of it
      } else{
        if (input != 'mySelf') { // url is passed and it will not get converted to int
          if (typeof input == 'object') {
            return;
          }
          input = getPK(input).toString()
        }
      }
      if (typeof userProfiles[input]=="undefined" || refetch) {
        if (input=='mySelf') {
          me = myProfile();
          if (me != null){
            userProfiles["mySelf"] = me;
            userProfiles[getPK(me.url).toString()] = me;
          }else {
            userProfiles["mySelf"] = null;
          }
        } else {
          url = '/api/HR/userSearch/' + input + '/'
          var user = getUser(url);
          userProfiles[input]= user
        }
      }
      return userProfiles[input];
    },
  }
});

app.factory('$permissions', function($http){

  modules = [];
  apps = []

  return {
    apps : function(input){

    },
    action : function(){

    }

  }

})


function myProfile(){
  var httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', "/api/HR/users/?mode=mySelf&format=json" , false);
  httpRequest.send(null);
  if (httpRequest.status == 200) { // successfully
    var temp = JSON.parse(httpRequest.responseText);
    me = temp[0];
    if (typeof me.url == 'undefined') {
      me.url = '/api/HR/userSearch/'+ me.pk + '/';
    }else {
      me.url = me.url.split('?')[0]
    }
    return me;
  } else if (httpRequest.status == 403) {
    return null;
  }
}

function getUser(urlGet , mode){
  // console.log(urlGet);
  if (urlGet.indexOf('api/HR')==-1) {
    urlGet = '/api/HR/userSearch/'+ urlGet + '/'
  }
  if (urlGet.indexOf('json')==-1) {
    urlGet += '?format=json';
  }
  var httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', urlGet , false);
  httpRequest.send(null);
  if (httpRequest.status == 200) { // successfully
    user = JSON.parse(httpRequest.responseText);
    user.url = '/api/HR/userSearch/'+ user.pk + '/';
    return user
  }
}
