app.controller("controller.home", function($scope, $state, $http, $uibModal, $timeout, $users , $interval) {


  if( window.location.href.indexOf('/admin/#') != -1) $state.go('workforceManagement.employees')
  if( window.location.href.indexOf('/manager/#') != -1) $state.go('businessManagement.accounting')

  console.log('home');
  $scope.now = new Date();
  $interval(function() {
    $scope.now = new Date();
  },60000)

  $scope.me = $users.get('mySelf');

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function(points, evt) {
    console.log(points, evt);
  };

  $scope.labels2 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data2 = [300, 500, 100];




  // new Chart(document.getElementById("home-mixed-chart"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["2014", "2015", "2016", "2017", "2018"],
  //     datasets: [{
  //       label: "Monomerce",
  //       type: "line",
  //       borderColor: "#4583df",
  //       data: [408, 875, -634, 234, 356],
  //       lineTension: 0,
  //       fill: false,
  //     }, {
  //       label: "Syrow",
  //       type: "line",
  //       borderColor: "#FFB424",
  //       data: [133, -221, 478, 345, 231],
  //       lineTension: 0,
  //       fill: false,
  //     }, {
  //       label: "Tutors24",
  //       type: "bar",
  //       backgroundColor: "rgba(106, 147, 154, 0.38)",
  //       data: [408, 547, 675, -734, 345],
  //     }, {
  //       label: "EpsilonAI",
  //       type: "bar",
  //       backgroundColor: "rgba(106, 147, 154, 0.38)",
  //       backgroundColorHover: "#3e95cd",
  //       data: [133, -383, 978, -344, 356]
  //     }]
  //   },
  //   options: {
  //     // bezierCurve : true,
  //     scales: {
  //       xAxes: [{
  //         barPercentage: 0.4
  //       }]
  //     },
  //     title: {
  //       display: true,
  //       text: ''
  //     },
  //     legend: {
  //       display: false
  //     }
  //   }
  // });


  // new Chart(document.getElementById("homeExpense-bar-chart"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["Business", "Bonus", "Finance", "Marketing", "Expenses", "TravelExpense", "Assets", "Projects", "Performace", "Organization"],
  //     datasets: [{
  //       label: "Population (millions)",
  //       backgroundColor: ["#91E4A6", "#C6FF8C", "#FFF68A", "#8CEAFF", "#FF8E9C", "#95D13B", "#02886c", "#FA6E41", "#E91E63", "#FF4A43"],
  //       data: [44, -25, 43, 49, 43, -20, 45, -34, 53, 29]
  //     }]
  //   },
  //   options: {
  //     legend: {
  //       display: false
  //     },
  //     title: {
  //       display: true,
  //       text: ''
  //     }
  //   }
  // });
  //
  // new Chart(document.getElementById("tenure-doughnut-chart"), {
  //   type: 'doughnut',
  //   data: {
  //     labels: ["1 to 3 Years", "3 to 5 years", "< 1 Year", "> 5 Years"],
  //     datasets: [{
  //       label: "",
  //       backgroundColor: ["#74D3CF", "#FBC0BC", "#819DCF", "#FE7AA2"],
  //       data: [2478, 5267, 734, 786]
  //     }]
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: ''
  //     },
  //     legend: {
  //       position: 'bottom',
  //     },
  //   }
  // });
  //
  // new Chart(document.getElementById("growth-mixed-chart"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
  //     datasets: [{
  //       label: "Europe",
  //       type: "line",
  //       borderColor: "#e4dd2f",
  //       data: [1408, 2547, 2875, 3734, 2345, 3212],
  //       fill: false,
  //       lineTension: 0,
  //     }, {
  //       label: "Europe",
  //       type: "bar",
  //       backgroundColor: "#40BBC2",
  //       backgroundColorHover: "#298287",
  //       data: [1600, 1947, 1375, 1134, 2323, 1432],
  //     }, {
  //       label: "Africa",
  //       type: "bar",
  //       backgroundColor: "#413F68",
  //       backgroundColorHover: "#6a67ab",
  //       data: [1333, 2621, 2983, 2478, 2342, 1324]
  //     }]
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: ''
  //     },
  //     legend: {
  //       display: false
  //     }
  //   }
  // });
  //
  //
  // new Chart(document.getElementById("expense-mixed-chart"), {
  //   type: 'bar',
  //   data: {
  //     labels: ["2011", "2012", "2013", "2014", "2015", "2016", "2017"],
  //     datasets: [{
  //       label: "Europe",
  //       type: "line",
  //       borderColor: "#69d022",
  //       data: [1408, 2547, 2575, 2434, 1332, 2321, 1323],
  //       fill: false,
  //       lineTension: 0,
  //     }, {
  //       label: "Europe",
  //       type: "bar",
  //       backgroundColor: "#EF5252",
  //       data: [1600, 1947, 2375, 2134, 1212, 4332, 2321],
  //     }]
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: ''
  //     },
  //     legend: {
  //       display: false
  //     },
  //     scales: {
  //       xAxes: [{
  //         barPercentage: 0.6,
  //         categoryPercentage: 0.8,
  //       }]
  //     },
  //   }
  // });

})
