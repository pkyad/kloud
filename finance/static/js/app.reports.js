app.config(function($stateProvider) {

$stateProvider
  .state('businessManagement.reports', {
    url: "/reports",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.finance.reports.html',
        controller: 'businessManagement.finance.reports',
      },
      "@businessManagement.finance.reports": {
        template: '<div></div>',
        controller: 'businessManagement.finance.reports',
      }
    }
  })
  .state('businessManagement.reports.gst3b', {
    url: "/gst-3b",
    templateUrl: '/static/ngTemplates/app.finance.report.gstr3b.html',
    controller: 'businessManagement.finance.reports.gst3b'
  })
  .state('businessManagement.reports.compliance', {
    url: "/compliance",
    templateUrl: '/static/ngTemplates/app.finance.report.compliance.html',
    controller: 'businessManagement.finance.reports.compliance'
  })
  .state('businessManagement.reports.pnl', {
    url: "/profit-and-loss",
    templateUrl: '/static/ngTemplates/app.finance.report.pnl.html',
    controller: 'businessManagement.finance.reports.gst3b'
  })
  .state('businessManagement.reports.cashflow', {
    url: "/cashflow",
    templateUrl: '/static/ngTemplates/app.finance.report.cash.html',
    controller: 'businessManagement.finance.reports.gst3b'
  })
  .state('businessManagement.reports.balancesheet', {
    url: "/balancesheet",
    templateUrl: '/static/ngTemplates/app.finance.report.bs.html',
    controller: 'businessManagement.finance.reports.gst3b'
  })
})

app.controller('businessManagement.finance.reports' , function($scope , $http , $aside , $state, Flash , $users , $filter ){
  $state.go('businessManagement.reports.gst3b');
})

app.controller('businessManagement.finance.reports.compliance' , function($scope , $http , $aside , $state, Flash , $users , $filter ){
  

})



app.controller('businessManagement.finance.reports.gst3b' , function($scope , $http , $aside , $state, Flash , $users , $filter ){
  // settings main page controller
  var edDate = new Date()
  var stDate = new Date()
  var stDate = new Date(stDate.setDate(1))
  console.log(stDate,edDate);

  $scope.dateForm = {stDate:stDate,edDate:edDate}
  $scope.fetchData = function(){
    // if ($scope.dateForm.edDate-$scope.dateForm.stDate<0) {
    //   Flash.create('danger','Invalid Dates')
    //   return
    // }
    $http({
      method:'GET',
      url:'/api/finance/gstCalculation/?stDate='+$scope.dateForm.stDate.toJSON().split('T')[0]+'&edDate='+$scope.dateForm.edDate.toJSON().split('T')[0],
    }).
    then(function(response){
      $scope.gstData = response.data
    })
  }
  $scope.fetchData()
  $scope.months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "Quarter 1 - April-June", "Quarter 2 - July-September", "Quarter 3 - October-December", 'Quarter 4 - January-March', 'Current FY']

  $scope.currentYear = new Date().getFullYear()
  $scope.monthVal = $scope.months[0]
  $scope.select = {}
  $scope.select.month = $scope.months[0]
  $scope.select.year = new Date().getFullYear()
  $scope.startYear = 2019;
  $scope.years = []
  while ($scope.startYear <= $scope.currentYear+2) {
    $scope.years.push($scope.startYear++);
  }
  $scope.allYears = []
  for (var i = 0; i < $scope.years.length; i++) {
    var nxtYr = $scope.years[i] + 1
    var val = $scope.years[i] + ' - ' + nxtYr
    $scope.allYears.push(val)
  }
  $scope.selectedYear = $scope.allYears[0]
  $scope.fetchCashFlow = function(data){
    console.log(data,'iooioioi');
    if (data == undefined) {
      data = $scope.allYears[0]
    }
    $http({
      method:'GET',
      url:'/api/finance/cashFlow/?FY='+data
    }).
    then(function(response){
      $scope.cashflowData = response.data
    })
  }
  $scope.fetchCashFlow($scope.selectedYear)
  $scope.form = {
      asOn:new Date()
  }
  $scope.$watch('form.asOn', function(newValue, oldValue) {
    $scope.dat = newValue.toJSON().split('T')[0]
    $scope.fetchBalSheet($scope.dat)
  })
  $scope.fetchBalSheet = function(dat){
    console.log(dat);
    $http({
      method:'GET',
      url:'/api/finance/balanceSheet/?period='+dat
    }).
    then(function(response){
      $scope.balSheetData = response.data
    })
  }
  $scope.fetchproandLoss = function(yr,month){
    $http({
      method:'GET',
      url:'/api/finance/ProfitandLoss/?Year='+yr +'&period='+month
    }).
    then(function(response){
      $scope.proLossData = response.data
    })
  }
    $scope.fetchproandLoss($scope.selectedYear,$scope.months[0])
    $scope.selectUnit = ''
    $scope.fetchUnits = function(){
      $http({
        method:'GET',
        url:'/api/organization/unit/?icansee=1'
      }).
      then(function(response){
        $scope.unitsData = response.data
        if ($scope.unitsData.length >0) {
          $scope.selectUnit = $scope.unitsData[0]
          $scope.fetchgstr($scope.selectUnit)
        }
      })
    }
    console.log($scope.unitsData,"$scope.unitsData");
    $scope.fetchUnits()

    $scope.quarter = "Quarter 1 - April-June"
    $scope.financialYear = "2019-20"
    console.log($scope.quarter ,$scope.financialYear,"$scope.financialYear");
    $scope.fetchgstr = function(idx,Yr,qur){
      if (Yr == undefined || qur == undefined) {
        Yr =  $scope.financialYear
        qur = $scope.quarter
      }
      console.log(Yr,qur);
      $http({
        method:'GET',
        url:'/api/finance/gstr3b/?id='+idx.pk+"&FY="+Yr+"&Quarter="+qur
      }).
      then(function(response){
        $scope.gstrData = response.data
      })
    }
    // $scope.fetchgstr()
})
