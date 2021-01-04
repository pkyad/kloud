app.controller("workforceManagement.geoLocation", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  // $scope.slider = {
  //   minValue: 100,
  //   maxValue: 400,
  //   options: {
  //     floor: 0,
  //     ceil: 500,
  //     translate: function(value) {
  //       return '$' + value;
  //     }
  //   }
  // };


  $scope.form = {
    offset: 0,
    dt: new Date()
  }
  $scope.allVisits = []
  $scope.selected = 0
  $scope.refresh = function() {
    $scope.data = {}
    // $scope.selected =  ''
    $http({
      method: 'GET',
      url: '/api/HR/getUsersl/'
    }).
    then(function(response) {
      $scope.users = response.data.data;
      $scope.changeMap($scope.selected)
    })
  }
  $scope.refresh()
  $scope.zoom = 20
  var markerIconHome = '/static/images/map/Maphome.png'
  $scope.changeMap = function(indx) {
    $scope.allVisits = []
    $scope.selected = indx
    $scope.data = $scope.users[indx]
    $http({
      method: 'GET',
      url: '/api/marketing/getVisitDetails/?user=' + $scope.users[indx].user.pk + '&selectedDate=' + $scope.form.dt.toJSON().split('T')[0]
    }).
    then(function(response) {
      $scope.data.mapDetails = response.data.data
      $scope.allVisits = $scope.data.mapDetails.tourValues
      if ($scope.data.mapDetails.tourTrackerList.length>0) {
        $scope.positionObj = $scope.data.mapDetails.tourTrackerList[$scope.data.mapDetails.tourTrackerList.length - 1]
        $scope.slider = {
          value: $scope.data.mapDetails.max-1,
          options: {
            stepsArray: $scope.data.mapDetails.options,
            translate: function(value, sliderId, label) {
              if (value != $scope.data.mapDetails.tourTrackerList.length) {
                switch (label) {
                  case 'model':
                  return $scope.data.mapDetails.tourTrackerList[value].time;
                  case 'ceil':
                  return $scope.data.mapDetails.tourTrackerList[$scope.data.mapDetails.tourTrackerList.length - 1].time;
                  case 'floor':
                  return $scope.data.mapDetails.tourTrackerList[0].time;
                  default:
                  return value
                }
              }
            }
          },
        };
      }else{
        $scope.slider = {
          value: $scope.data.mapDetails.min,
          options: {
            translate: function(value, sliderId, label) {
                  return 0
                }
            }
        }
      }
      $scope.onSliderChange()

    })

    $scope.picture = '/static/images/map/BruggLocationWhite2.png'
  }


  $scope.onSliderChange = function() {
    $scope.currentLocations = [];
    if ($scope.data.mapDetails != undefined && $scope.data.mapDetails.tourTrackerList.length>0) {
      if ($scope.slider.value == undefined) {
        $scope.slider.value = $scope.data.mapDetails.tourTrackerList.length - 1
      }
      $scope.currentLocations = $scope.data.mapDetails.tourTrackerList.slice(0, $scope.slider.value + 1)
      if ($scope.currentLocations.length > 0) {
        $scope.map_center = $scope.currentLocations[$scope.currentLocations.length - 1]
      }
    }
    else{
      $scope.map_center = {
        lat: 12.970435,
        lng: 77.578424
      };
    }
    initMap()
  }
  setInterval(function(){
    $http({
      method: 'GET',
      url: '/api/HR/getUsersl/'
    }).
    then(function(response) {
      $scope.users = response.data.data;
    })
  }, 60000)

  $scope.map_center = {
    lat: 12.970435,
    lng: 77.578424
  };
  $scope.data.lat = 12.970435
  $scope.data.lon = 77.578424



  var userPath;
  function initMap() {
    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: $scope.zoom,
        center: $scope.map_center,
        disableDefaultUI: true,
        scaleControl: true,
        zoomControl: true,
      });
    if ($scope.allVisits) {
      for (var i = 0; i < $scope.allVisits.length; i++) {
        var markerIconBlue = '/static/images/map/brugmapBlue.png';
        var marker2 = new google.maps.Marker({
          position: $scope.allVisits[i],
          map: map,
          icon: {
            labelOrigin: new google.maps.Point(28, 30),
            url: markerIconBlue,
            scaledSize: new google.maps.Size(60, 60)
          }
        });
      }
    }
    if ($scope.currentLocations != undefined && $scope.currentLocations.length > 0) {
      var markerIcon = '/static/images/map/BruggLocationWhite2.png';
      secondPostObj = {}
        secondPostObj = $scope.currentLocations[0]
        var marker1 = new google.maps.Marker({
          position: secondPostObj,
          map: map,
          icon: {
            labelOrigin: new google.maps.Point(28, 30),
            url: markerIconHome,
            scaledSize: new google.maps.Size(60, 60)
          }
        });
      var userPath = new google.maps.Polyline({
        path: $scope.currentLocations,
        geodesic: true,
        strokeColor: '#0b3ed6',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });
      userPath.setMap(map);
      var marker = new google.maps.Marker({
        position: $scope.positionObj,
        map: map,
        icon: {
          labelOrigin: new google.maps.Point(28, 30),
          url: markerIcon,
          scaledSize: new google.maps.Size(60, 60)
        }
      });
    }
  }
  $timeout(function() {
    initMap()
  }, 800);


  $scope.call = function() {
    $http({
      method: 'GET',
      url: '/api/marketing/callCurrentCustomer/?mobile=' + $scope.data.mobile
    }).
    then(function(response) {
      Flash.create('success', 'Calling customer , Please pick up the call')
    })
  }



})
