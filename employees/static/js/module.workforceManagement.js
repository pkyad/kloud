app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement', {
      url: "/workforceManagement",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/workforceManagement.html',
        },
        "menu@workforceManagement": {
          templateUrl: '/static/ngTemplates/workforceManagement.menu.html',
          controller: 'workforceManagement.menu'
        },
        "@workforceManagement": {
          templateUrl: '/static/ngTemplates/workforceManagement.dash.html',
          controller: 'workforceManagement'
        }
      }
    })

    .state('workforceManagement.geoLocation', {
      url: "/geoLocation",
      templateUrl: '/static/ngTemplates/app.workforceManagement.geoLocation.html',
      controller: 'workforceManagement.geoLocation'
    })
});
app.controller('workforceManagement', function($scope, $users, Flash, $http) {

  $scope.fetchWorkforceData = function() {
    $http({
      method: 'GET',
      url: '/api/employees/employeeDashboard/',
    }).
    then(function(response) {
      $scope.workForceData = response.data;
      $scope.totalTime = ($scope.workForceData.fullCount + $scope.workForceData.partCount)
      new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
          labels: ["Full Time", "Part Time"],
          datasets: [{
            label: "",
            backgroundColor: ["#3ecd59", "#f09001"],
            data: [$scope.workForceData.fullCount, $scope.workForceData.partCount]
          }]
        },
        options: {
          title: {
            display: true,
            text: ''
          },
          legend: {
            position: 'right',
          },

        },
      });
    })
  }
  $scope.fetchWorkforceData()


  new Chart(document.getElementById("remote-bar-chart"), {
    type: 'bar',
    data: {
      labels: ["Headquaters", "Remote"],
      datasets: [{
          backgroundColor: ["#39F3BB", "#18A1CD"],
          strokeColor: "",
          label: "Headquaters",
          data: [2478, 3247]
        },
        {
          backgroundColor: ["#09BB9F", "#15607A"],
          strokeColor: "",
          label: "Remote",
          data: [784, 433]
        }
      ]
    },
    options: {

      legend: {
        display: false
      },
      title: {
        display: false,
        text: ""
      },
      scales: {
        xAxes: [{
          barPercentage: 0.7,
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
        }]
      },
    }
  });

  new Chart(document.getElementById("headcount-chart-horizontal"), {
    type: 'horizontalBar',
    data: {
      labels: ["Sales", "Development", "Client support", "Marketing ", "Finance "],
      datasets: [{
        label: "",
        backgroundColor: "#3e95cd",
        data: [2478, 5267, 734, 784, 433]
      }]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: ''
      }
    }
  });


  new Chart(document.getElementById("tenure-doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["1 to 3 Years", "3 to 5 years", "< 1 Year", "> 5 Years"],
      datasets: [{
        label: "",
        backgroundColor: ["#39F3BB", "#18A1CD", "#cd533e", "#d6dd51"],
        data: [2478, 5267, 734, 786]
      }]
    },
    options: {
      title: {
        display: true,
        text: ''
      },
      legend: {
        position: 'bottom',
      },
    }
  });

  new Chart(document.getElementById("growth-mixed-chart"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050"],
      datasets: [{
        label: "Europe",
        type: "line",
        borderColor: "#8e5ea2",
        data: [1408, 2547, 2875, 3734],
        fill: false,
        lineTension: 0,
      }, {
        label: "Europe",
        type: "bar",
        backgroundColor: "rgba(102, 142, 245, 0.82)",
        data: [1600, 1947, 1375, 1134],
      }, {
        label: "Africa",
        type: "bar",
        backgroundColor: "rgba(45, 236, 242, 0.84)",
        backgroundColorHover: "#3e95cd",
        data: [1333, 2621, 2983, 2478]
      }]
    },
    options: {
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: false
      }
    }
  });


  new Chart(document.getElementById("expense-mixed-chart"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050", "2060", "2065", "2067"],
      datasets: [{
        label: "Europe",
        type: "line",
        borderColor: "#f00e00",
        data: [1408, 2547, 2875, 3734, 1332, 2321, 1323],
        fill: false,
        lineTension: 0,
      }, {
        label: "Europe",
        type: "bar",
        backgroundColor: "rgba(90, 236, 135, 0.82)",
        data: [1600, 1947, 1375, 1134, 1212, 4332, 2321],
      }]
    },
    options: {
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }]
      },
    }
  });
});



app.controller('workforceManagement.menu', function($scope, $users, Flash ){
  // main businessManagement tab default page controller

  $scope.apps = [];

  $scope.buildMenu = function(apps) {
    for (var i = 0; i < apps.length; i++) {
      var a = apps[i];
      var parts = a.name.split('.');
      if (a.module != 10 || a.name.indexOf('app') == -1 || parts.length != 2) {
        continue;
      }
      a.state = a.name.replace('app', 'workforceManagement')
      a.dispName = parts[parts.length - 1];
      $scope.apps.push(a);
    }
  }

  var as = $permissions.apps();
  if (typeof as.success == 'undefined') {
    $scope.buildMenu(as);
  } else {
    as.success(function(response) {
      $scope.buildMenu(response);
    });
  };
});

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
      // $scope.changeMap($scope.selected)
    })
  }
  $scope.refresh()
  $scope.zoom = 20
  var markerIconHome = '/static/images/map/Maphome.png'
  $scope.allVisitPlans = []
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
      $scope.allVisitPlans.push($scope.data)
      // if ($scope.data.mapDetails.tourTrackerList.length>0) {
      //   $scope.positionObj = $scope.data.mapDetails.tourTrackerList[$scope.data.mapDetails.tourTrackerList.length - 1]
      //   $scope.slider = {
      //     value: $scope.data.mapDetails.max-1,
      //     options: {
      //       stepsArray: $scope.data.mapDetails.options,
      //       translate: function(value, sliderId, label) {
      //         if (value != $scope.data.mapDetails.tourTrackerList.length) {
      //           switch (label) {
      //             case 'model':
      //             return $scope.data.mapDetails.tourTrackerList[value].time;
      //             case 'ceil':
      //             return $scope.data.mapDetails.tourTrackerList[$scope.data.mapDetails.tourTrackerList.length - 1].time;
      //             case 'floor':
      //             return $scope.data.mapDetails.tourTrackerList[0].time;
      //             default:
      //             return value
      //           }
      //         }
      //       }
      //     },
      //   };
      // }else{
      //   $scope.slider = {
      //     value: $scope.data.mapDetails.min,
      //     options: {
      //       translate: function(value, sliderId, label) {
      //             return 0
      //           }
      //       }
      //   }
      // }
      $scope.onSliderChange()

    })

    $scope.picture = '/static/images/map/BruggLocationWhite2.png'
  }

  $scope.reset = function(){
      $scope.allVisitPlans = []
      $scope.refresh()
      initMap()
      // $scope.changeMap()
  }


  $scope.onSliderChange = function() {
    $scope.currentLocations = [];
    for (var i = 0; i < $scope.allVisitPlans.length; i++) {
      // if ($scope.data.mapDetails != undefined && $scope.data.mapDetails.tourTrackerList.length>0) {
      // if ($scope.slider.value == undefined) {
      //   $scope.slider.value = $scope.data.mapDetails.tourTrackerList.length - 1
      // }
      // $scope.currentLocations = $scope.data.mapDetails.tourTrackerList.slice(0, $scope.slider.value + 1)
      $scope.currentLocations = $scope.allVisitPlans[i].mapDetails.tourTrackerList
      if ($scope.currentLocations.length > 0) {
        $scope.map_center = $scope.currentLocations[$scope.currentLocations.length - 1]
      }
    // }
    // else{
    //   $scope.map_center = {
    //     lat: 12.970435,
    //     lng: 77.578424
    //   };
      // }

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


  function makeRandomColor(){
    var letters = '0123456789'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
          color += letters[Math.round(Math.random() * 10)];
      }
      return color;
  }
  $scope.updateDate = function(){
    for (var i = 0; i < $scope.allVisitPlans.length; i++) {
      if ($scope.allVisitPlans[i].selected) {
        $http({
          method: 'GET',
          url: '/api/marketing/getVisitDetails/?user=' + $scope.allVisitPlans[i].user.pk + '&selectedDate=' + $scope.form.dt.toJSON().split('T')[0]
        }).
        then((function(i) {
          return function(response) {
            $scope.allVisitPlans[i].mapDetails = response.data.data
            $scope.currentLocations = $scope.allVisitPlans[i].mapDetails.tourTrackerList
            if ($scope.currentLocations.length > 0) {
              $scope.map_center = $scope.currentLocations[$scope.currentLocations.length - 1]
            }
            initMap()
          }
        })(i))
      }
    }
  }
  var userPath;
  var lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4
  };


  function initMap() {
    var infowindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: $scope.zoom,
        center: $scope.map_center,
        disableDefaultUI: true,
        scaleControl: true,
        zoomControl: true,
      });
    for (var i = 0; i < $scope.allVisitPlans.length; i++) {
      var markerIconHome = '/static/images/homeicon.png';
      var markerIconEnd = '/static/images/endpoint.png';
      var markerCustomer = '/static/images/customer.png';
      if ($scope.allVisitPlans[i].color == undefined) {
        $scope.allVisitPlans[i].color = makeRandomColor()
      }
      var customers =  []
      customers = $scope.allVisitPlans[i].mapDetails.tourValues

      if (customers.length>0) {
        for (var j = 0; j < customers.length; j++) {
          custTitle = '<b>' +customers[j].customer + '</b> <br/>' +  customers[j].addrs + '<br/> Technician : ' + customers[j].technician
          if (customers[j].techStatus == 'in-transit') {
            custTitle = '<b>' +customers[j].customer + '</b> <br/>' + customers[j].addrs + '<br/>  <b>Technician : ' + customers[j].technician + ' <br/>Expected Distance : ' + customers[j].totalDist + ' Km <br/> Need ' + customers[j].total_time + ' Hr to reach. </b>'
          }
          var infowindow = new google.maps.InfoWindow({
            content: custTitle,
            maxWidth: 200
          });
          var marker3 = new google.maps.Marker({
            position: {lat : customers[j].lat , lng : customers[j].lng},
            map: map,
            icon: {
              labelOrigin: new google.maps.Point(28, 30),
              url: markerCustomer,
              scaledSize: new google.maps.Size(60, 60)
          }
          })
          infowindow.open(map, marker3);
          $timeout(function() {
            var x = document.getElementsByClassName('gm-ui-hover-effect')[0].remove();
          }, 10);
          if (customers[j].techStatus == 'in-transit') {
            var markerIconEnd = '/static/images/driving.png';
            var direction = [$scope.allVisitPlans[i].mapDetails.tourTrackerList[$scope.allVisitPlans[i].mapDetails.tourTrackerList.length-1], {lat : customers[j].lat , lng : customers[j].lng} ]
            var customerPath = new google.maps.Polyline({
              path: direction,
              geodesic: true,
              icons:
              [
                {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px"
                }
              ],
              // strokeColor: '#ff1f00',
              // strokeOpacity: 1.0,
              strokeWeight: 0
            });
            customerPath.setMap(map);
          }
        }
      }
      var userPath = new google.maps.Polyline({
        path: $scope.allVisitPlans[i].mapDetails.tourTrackerList,
        geodesic: true,
        strokeColor: $scope.allVisitPlans[i].color,
        strokeOpacity: 1.0,
        strokeWeight: 5
      });
      userPath.setMap(map);
      var marker1 = new google.maps.Marker({
        position: $scope.allVisitPlans[i].mapDetails.tourTrackerList[0],
        map: map,
        icon: {
          labelOrigin: new google.maps.Point(28, 30),
          url: markerIconHome,
          scaledSize: new google.maps.Size(60, 60)
      }
    })
      var infowindowTech = new google.maps.InfoWindow({
        content: '<b>' +$scope.allVisitPlans[i].user.first_name + '</b>' ,
        maxWidth: 200

      });
      $timeout(function() {
        var x = document.getElementsByClassName('gm-ui-hover-effect')[0].remove();
      }, 10);
      var marker2 = new google.maps.Marker({
        position: $scope.allVisitPlans[i].mapDetails.tourTrackerList[$scope.allVisitPlans[i].mapDetails.tourTrackerList.length-1],
        map: map,
        // title: $scope.allVisitPlans[i].user.first_name,
        icon: {
          labelOrigin: new google.maps.Point(28, 30),
          url: markerIconEnd,
          scaledSize: new google.maps.Size(60, 60)
      }
      })
      infowindowTech.open(map, marker2);
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
