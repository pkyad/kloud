homeView = {
  templateUrl: '/static/ngTemplates/app.home.dashboard.html',
  controller : 'controller.home'
}

if( window.location.href.indexOf('/admin/#') != -1) homeView = {template : '' , controller : 'controller.direct.employees'}
if( window.location.href.indexOf('/manager/#') != -1) homeView = {template : '' , controller : 'controller.direct.accounting'}

app.controller("controller.direct.employees", function($scope , $state) {
  $state.go('workforceManagement.employees')

})

app.controller("controller.direct.accounting", function($scope , $state) {
  $state.go('businessManagement.accounting')
})



app.config(function($stateProvider ){

  $stateProvider
  .state('home', {
    url: "/home",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/home.html',
        controller:'controller.home.main'
      },
      "@home": homeView
    }
  })
  .state('home.mail', {
    url: "/mail",
    templateUrl: '/static/ngTemplates/app.mail.html',
    controller: 'controller.mail'
  })
  .state('home.social', {
    url: "/social/:id",
    templateUrl: '/static/ngTemplates/app.social.html',
    controller: 'controller.social'
  })
  .state('home.blog', {
    url: "/blog/:id?action",
    templateUrl: '/static/ngTemplates/app.home.blog.html',
    controller: 'controller.home.blog'
  })
  .state('home.calendar', {
    url: "/calendar",
    templateUrl: '/static/ngTemplates/app.home.calendar.html',
    controller: 'controller.home.calendar'
  })
  .state('home.notes', {
    url: "/notes",
    templateUrl: '/static/ngTemplates/app.home.notes.html',
    controller: 'controller.home.notes'
  })
  .state('home.notes.view', {
    url: "/:id",
    templateUrl: '/static/ngTemplates/app.home.viewNote.html',
    controller: 'controller.home.viewNotes'
  })
  .state('home.myWork', {
    url: "/myWork",
    templateUrl: '/static/ngTemplates/app.home.myWork.html',
    controller: 'controller.home.myWork'
  })

  .state('home.viewProfile', {
    url: "/viewProfile",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/home.profile.html',
        controller:'controller.home.profile'
      },
      // "@home": homeView
    }
  })

  .state('home.viewProfile.profile', {
    url: "/profile",
    templateUrl: '/static/ngTemplates/app.home.profile.html',
    controller: 'controller.home.profile'
  })

  .state('home.viewProfile.expenseClaims', {
    url: "/expenseClaims",
    templateUrl: '/static/ngTemplates/app.home.expenseClaims.html',
    controller: 'controller.home.expense.claims'
  })
  .state('home.viewProfile.itDeclaration', {
    url: "/it-declaration",
    templateUrl: '/static/ngTemplates/app.home.itDeclaration.html',
    controller: 'controller.home.itDeclaration'
  })
  .state('home.viewProfile.payslips', {
    url: "/payslips",
    templateUrl: '/static/ngTemplates/app.home.payslips.html',
    controller: 'controller.home.payslips'
  })
  .state('home.viewProfile.leave', {
    url: "/leave",
    templateUrl: '/static/ngTemplates/app.home.leave.html',
    controller: 'controller.home.leave'
  })

  .state('home.createExpenseClaims', {
    url: "/createExpenseClaims",
    templateUrl: '/static/ngTemplates/app.home.expenseClaims.newForm.html',
    controller: 'app.home.expenseClaims.newForm'
  })

  .state('home.editExpenseClaims', {
    url: "/editExpenseClaims/:id",
    templateUrl: '/static/ngTemplates/app.home.expenseClaims.newForm.html',
    controller: 'app.home.expenseClaims.newForm'
  })

  .state('home.approveExpenseClaims', {
    url: "/approveExpenseClaims/:id",
    templateUrl: '/static/ngTemplates/app.home.expenseClaims.approve.html',
    controller: 'app.home.expenseClaims.newForm'
  })

  .state('home.interview', {
    url: "/interview",
    templateUrl: '/static/ngTemplates/app.recruitment.interview.html',
    controller: 'workforceManagement.recruitment.interview',
  })
  .state('home.team', {
    url: "/team",
    templateUrl: '/static/ngTemplates/app.clientRelationships.team.html',
    controller: 'businessManagement.clientRelationships.team'
  })
  .state('home.messenger', {
    url: "/messenger",
    templateUrl: '/static/ngTemplates/app.home.messenger2.html',
    controller: 'controller.messenger'
  })
  .state('home.messenger.explore', {
    url: "/user/:id",
    templateUrl: '/static/ngTemplates/app.home.messenger.ui.html',
    controller: 'controller.messenger.explore'
  })



});


function calcDays(date1, date2) {
  // var date1 = new Date(date1);
  // var date2 = new Date(date2);
  var diffTime = Math.abs(date2 - date1);
  var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}



app.controller('controller.home.leave' , function($scope , $state , $http,$users, Flash){
$scope.resetAll = function(){
  $scope.form = {
    fromDate : new Date(),
    toDate : new Date(),
    comment : '',
    selected :'AL'
  }
}
$scope.resetAll()
  $scope.me = $users.get('mySelf');
  $scope.getPayroll = function(){
  $http({
    method: 'GET',
    url: '/api/payroll/payroll/?user='+$scope.me.pk
  }).
  then(function(response) {
    $scope.payrollData = response.data[0]
  })
}
$scope.getPayroll()

  $scope.checkLeaves = function(){
    $http({
      method: 'GET',
      url: '/api/HR/leavesCal/?fromDate='+$scope.form.fromDate.toJSON().split('T')[0]+'&toDate='+$scope.form.toDate.toJSON().split('T')[0]
    }).
    then(function(response) {
      $scope.leavesData = response.data.data
    })
  }
$scope.checkLeaves()
  $scope.saveUserLeaves = function(){
    var totalDays = calcDays($scope.form.fromDate ,$scope.form.toDate )
    if ($scope.form.selected == 'ML') {
      if (totalDays>$scope.payrollData.mlCurrMonthLeaves) {
        Flash.create('warning', 'You cannot apply for ML leaves more than ' + $scope.payrollData.ml )
      }
    }
    if ($scope.form.selected == 'AL') {
      if (totalDays>$scope.payrollData.alCurrMonthLeaves) {
        Flash.create('warning', 'You cannot apply for AL leaves more than ' + $scope.payrollData.ml )
      }
    }
    if ($scope.form.comment.length == 0) {
      Flash.create('warning' , 'Add Reason')
      return
    }

    var dataToSend = {
        category:$scope.form.selected,
        comment:$scope.form.comment,
        days:$scope.leavesData.total,
        fromDate:$scope.form.fromDate.toJSON().split('T')[0],
        holdDays:$scope.leavesData.leaves,
        leavesCount:$scope.leavesData.leaves,
        payroll:$scope.payrollData.pk,
        toDate:$scope.form.toDate.toJSON().split('T')[0],
    }
    $http({
      method: 'POST',
      url: '/api/HR/leave/',
      data : dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Applied');
      $scope.resetAll()
      $scope.getPayroll()
      $scope.checkLeaves()
      $scope.getLeaves()
      return
    })

  }

  $scope.getLeaves = function(){
  $http({
    method: 'GET',
    url: '/api/HR/leave/?leaves='
  }).
  then(function(response) {
    $scope.allLeaves = response.data
  })
}
$scope.getLeaves()

})


app.controller('controller.home.payslips' , function($scope , $state , $http,$users, Flash){
  var d = new Date();
  $scope.currntYear = d.getFullYear();

    $http({
      method: 'GET',
      url: '/api/payroll/getUniqueYears/?payslip=true'
    }).
    then(function(response) {
      $scope.allYears =  response.data.yearLists
        // $scope.allYears.push('2022')
      $scope.currntYear = $scope.allYears[0]
      $scope.getMontlyPayslips()
    })


  $scope.getMontlyPayslips = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/allPaySlips/?year='+$scope.currntYear
    }).
    then(function(response) {
      $scope.allPayslips = response.data
    })
    $http({
      method: 'GET',
      url: '/api/payroll/form16/?year='+$scope.currntYear+'&currentUser='
    }).
    then(function(response) {
      $scope.allForms = response.data

    })
  }

})

app.controller("controller.home.main", function($scope , $state, $users, $http) {
  // $scope.modules = $scope.$parent.$parent.modules;
  // $scope.dashboardAccess = false;
  // $scope.homeMenuAccess = false;
  // for (var i = 0; i < $scope.modules.length; i++) {
  //   if ($scope.modules[i].name == 'home'){
  //     $scope.dashboardAccess = true;
  //   }
  //   if ($scope.modules[i].name.indexOf('home') != -1) {
  //     $scope.homeMenuAccess = true;
  //   }
  // }
  $scope.me = $users.get('mySelf');
  $http({
      method: 'GET',
      url:'/api/organization/divisions/'+$scope.me.designation.division+'/'
    }).
    then(function(response) {
      $scope.division = response.data
    })
})


app.controller('controller.home.menu' , function($scope ,$state, $http){
  $scope.apps = [];

  $scope.buildMenu = function(apps){
    for (var i = 0; i < apps.length; i++) {
      a = apps[i];
      if (a.module != 1) {
        continue;
      }
      parts = a.name.split('.');
      a.dispName = parts[parts.length-1];

      if (a.name == 'app.dashboard') {
        a.state = 'home';
      }else {
        a.state = a.name.replace('app' , 'home');
      }
      $scope.apps.push(a);
    }
  }
  as = $permissions.apps();
  if(typeof as.success == 'undefined'){
    $scope.buildMenu(as);
  } else {
    as.success(function(response){
      $scope.buildMenu(response);
    });
  };

})

function dateToString(date) {
    if (typeof date == 'object') {
      day = date.getDate()
      month = date.getMonth() + 1
      year = date.getFullYear()
      return year + '-' + month + '-' + day
    } else {
      return date
    }
  }


app.controller('controller.home.itDeclaration' , function($scope , $http , $timeout , $state, $uibModal, Flash, $users){

  $scope.calcAll = function(data){
      var sum = data.reduce(function(_this, val){
      return parseInt(_this) + parseInt(val.amount);
    }, 0);
    return sum
  }

  if ($state.is('home.viewProfile.itDeclaration')) {
    $scope.me = $users.get('mySelf');
    $scope.userPk =  $scope.me.pk
  }
  else{
      $scope.userPk = $state.params.id
  }
  $scope.currentYear = new Date().getFullYear()
  $scope.currentMonth = new Date().getMonth();
  $scope.startYear = 2015;
  $scope.years = []
  while ($scope.startYear <= $scope.currentYear) {
    $scope.years.push($scope.startYear++);
  }
  if ($scope.currentMonth+1>3) {
    $scope.currentFinancialYear = $scope.currentYear +'-'+$scope.currentYear+1
  }
  else{
    $scope.currentFinancialYear =$scope.currentYear-1  +'-'+ $scope.currentYear
  }
  $scope.allYears = []

  $http({
    method: 'GET',
    url: '/api/payroll/getUniqueYears/?id='+$scope.userPk
  }).
  then(function(response) {
    $scope.allYears =  response.data.yearLists
    if ($scope.currentFinancialYear.inList($scope.allYears)){
      console.log('yes')
    }
    else {
      $scope.allYears.push($scope.currentFinancialYear)
    }
  })
  // for (var i = 0; i < $scope.years.length; i++) {
  //   var nxtYr = $scope.years[i] + 1
  //   var val = $scope.years[i] + '-' + nxtYr
  //   $scope.allYears.push(val)
  // }


  // for (var i = 0; i < $scope.allYears.length; i++) {
  //   console.log($scope.allYears[i] , $scope.tempcurrentFinancialYear,'aaaaaaaaaaaaaaaaaaaaaaaaaa');
  //   if ($scope.allYears[i] == $scope.tempcurrentFinancialYear) {
  //     $scope.currentFinancialYear = $scope.allYears[i]
  //   }
  // }





  // $scope.currentYear =

  $scope.form = {
    ishouseProperty : false,
    isnewJob : true,
    rent: 0,
    travel :0
  }

  $scope.reCalculate = function(){

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.create.declaration.date.html',
      placement: 'right',
      size: 'sm',
      backdrop: true,
      controller: function($scope,$http, Flash, $users, $uibModalInstance){
        $scope.form = {
          startDate:''
        }
        $scope.calc = function(){
          if ($scope.form.startDate == null || typeof $scope.form.startDate != 'object' ) {
            Flash.create('warning' , 'Select Date')
            return
          }
          $uibModalInstance.dismiss($scope.form.startDate)
        }
      },
    }).result.then(function() {
    }, function(res) {
      if (res != null && typeof res == 'object') {
        var dated = dateToString(res)
        $scope.reCalc(dated)
      }
    })

  }

  $scope.reCalc = function(date){
    $http({
      method: 'GET',
      url: '/api/payroll/reCaluclate/?user='+$scope.userPk+'&dated='+date
    }).
    then(function(response) {
      $scope.allData.incomeData = response.data.incomeData
    })
  }

  $scope.getTotal = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/getITDeclaration/?user='+$scope.userPk+'&onlyTotal='
    }).
    then(function(response) {
      $scope.allData.totalData = response.data
      // if ($scope.allData.housePropertyData.length>0) {
      //   $scope.form.ishouseProperty = true
      // }
      // $scope.caldeductionSix()
    })
  }



  $scope.getAllData = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/getITDeclaration/?user='+$scope.userPk+'&currentFinancialYear='+$scope.currentFinancialYear
    }).
    then(function(response) {
      $scope.allData = response.data
      // if ($scope.allData.housePropertyData.length>0) {
      //   $scope.form.ishouseProperty = true
      // }
      // $scope.caldeductionSix()
    })
  }
    $scope.getAllData()

  $scope.caldeductionSix = function(){
    $scope.deductionSixTotal = 0
    $scope.deductionSixTotal = $scope.calcAll($scope.allData.deductionSixAData)
    if ($scope.deductionSixTotal>150000) {
      Flash.create('warning' , 'You have exceeded limit of deduction')
      return
    }
  }

  $scope.addHome = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.view.addRent.html',
      placement: 'right',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return   $scope.allData.propertyOwnerDetails;
        }
      },
      controller: function($scope,$http, Flash, $users, $uibModalInstance, data){

        $scope.rented = data
        $scope.rented.rent = 0

        if ($state.is('home.viewProfile.itDeclaration')) {
          $scope.me = $users.get('mySelf');
          $scope.userPk =  $scope.me.pk
        }
        else{
            $scope.userPk = $state.params.id
        }


        $scope.addRentedData = function(){
          if ($scope.rented.address == null || $scope.rented.address.length == 0 || $scope.rented.tenantName == null || $scope.rented.tenantName.length == 0 || $scope.rented.tenantPan == null || $scope.rented.tenantPan.length == 0 ) {
            Flash.create('warning','Owner name and Owner Pan and Owner address is required')
            return
          }
          if ($scope.rented.amount.length == 0 || $scope.rented.amount == 0) {
            Flash.create('warning' ,'Add rent')
            return
          }

          var dataToSend = $scope.rented
          dataToSend.group_name = "propertyOwnerDetails"
          dataToSend.user = $scope.userPk
          // dataToSend.user = $scope.userPk
          var method = 'POST'
          var url = '/api/payroll/addITDeclaration/'
          $http({
            method: method,
            url: url,
            data : dataToSend
          }).
          then(function(response) {
            // $uibModalInstance.dismiss(response.data)
              $uibModalInstance.dismiss($scope.rented.amount)
          })
        }


        // $scope.form = {
        //   rent:0,
        //
        // }
        // $scope.save = function(){
        //
        //
        // }
        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
      }
    }).result.then(function() {
    }, function(res) {
      if (res!=undefined&&res>0) {
          $scope.form.rent = res
          $scope.saveRent()
      }

    })
  }

  $scope.updatePayroll = function(typ , val){
    var data = {}
    if (typ == 'isExtraIncome') {
      data['isExtraIncome'] = val
    }
    else if(typ == 'isOwnHouse'){
        data['isOwnHouse'] = val
    }
    $http({
      method: 'PATCH',
      url: '/api/payroll/payroll/'+$scope.payroll.pk+'/',
      data : data
    }).
    then(function(response) {
      $scope.allData.payroll.isOwnHouse = response.data.isOwnHouse
      $scope.allData.payroll.isExtraIncome = response.data.isExtraIncome
    })

  }




  $scope.saveRent = function(){
    var dataToSend = {
    rent :$scope.form.rent,
    // travel : $scope.form.travel,
    group_name : 'exemptions',
    user :   $scope.userPk
  }
  if ($scope.form.rent>0) {
    dataToSend.isRentedHouse = true
    $scope.allData.payroll.isRentedHouse = true
  }
  else{
      dataToSend.isRentedHouse = false
    $scope.allData.payroll.isRentedHouse = false
  }
    var method = 'POST'
    var url = '/api/payroll/addITDeclaration/'
    $http({
      method: method,
      url: url,
      data : dataToSend
    }).
    then(function(response) {
      $scope.allData.annualExcemptionData = response.data
      $scope.getTotal()
    })
  }

  $scope.taxSlabInfo = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.view.taxInfo.html',
      placement: 'right',
      size: 'md',
      backdrop: true,
    }).result.then(function() {
    }, function() {
    })
  }


  $scope.createDeclaration = function(typ){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.create.declaration.html',
      placement: 'right',
      size: 'md',
      backdrop: true,
      resolve: {
        typ: function() {
          return typ;
        }
      },
      controller:'controller.home.create.declaration'
    }).result.then(function() {
    }, function() {
      $scope.getTotal()
    })

  }

  $scope.updateAmount = function(amount, id, limit){
    if (amount>limit) {
      Flash.create('warning' , 'Amount cannot be more than limit')
      return
    }
    $http({
      method: 'PATCH',
      url: '/api/payroll/itDeclaration/'+id+'/',
      data : {
        amount : amount
      }
    }).
    then(function(response) {
      $scope.caldeductionSix()
      $scope.getTotal()
    })
  }

  $scope.updateExcemptionAmount = function(amount , pk, month){
    $http({
      method: 'POST',
      url: '/api/payroll/addITDeclaration/',
      data : {
        amount : amount,
        id : pk,
        user:$scope.userPk
      }
    }).
    then(function(response) {
      $scope.allData.annualExcemptionData = response.data
      $scope.getTotal()
    })
  }

$scope.updateOccupied = function(){
  var dataToSend = {
  amount :$scope.allData.selfOccupiedDetails.amount,
  eligibleAmount : $scope.allData.selfOccupiedDetails.eligibleAmount,
  tenantPan : $scope.allData.selfOccupiedDetails.tenantPan,
  tenantName : $scope.allData.selfOccupiedDetails.tenantName,
  group_name : 'selfOccupied',
  pk : $scope.allData.selfOccupiedDetails.pk,
  user:$scope.userPk
}
  var method = 'POST'
  var url = '/api/payroll/addITDeclaration/'
  $http({
    method: method,
    url: url,
    data : dataToSend
  }).
  then(function(response) {
      $scope.getTotal()
  })
}

  $scope.otherIncomes = {
      title:'',
      amount:0
    }

// $scope.resetOtherIncome = function(){
// }

  $scope.addOtherIncomes = function(data, type){

    if (data.title == null || data.title.length == 0 || data.amount == null || data.amount <= 0) {
      return
    }

    var method = 'POST'
    var url = '/api/payroll/itDeclaration/'
    if (data.pk) {
      var method = 'PATCH'
      var url = url+ data.pk +'/'
    }
    $http({
      method: method,
      url: url,
      data : {
        amount : data.amount,
        title: data.title,
        group_name: 'otherIncomes',
        user:$scope.userPk
      }
    }).
    then(function(response) {
      if (type == 'new') {
        $scope.allData.otherIncomesAData.push(response.data)
        $scope.otherIncomes = {
          title:'',
          amount:0
        }
      }
      $scope.getTotal()
    })
  }

  $scope.deleteOtherIncomes = function(indx){
    $http({
      method: 'DELETE',
      url: '/api/payroll/itDeclaration/'+$scope.allData.otherIncomesAData[indx].pk+'/',
    }).
    then(function(response) {
      $scope.allData.otherIncomesAData.splice(indx,1)
      $scope.getTotal()
    })
  }

  $scope.deletehouseProperty = function(indx){
    $http({
      method: 'DELETE',
      url: '/api/payroll/itDeclaration/'+$scope.allData.housePropertyData[indx].pk+'/',
    }).
    then(function(response) {
      $scope.allData.housePropertyData.splice(indx,1)
      $scope.getTotal()
    })
  }

  $scope.editOtherIncomes = function(indx){
    $scope.otherIncomes = $scope.allData.otherIncomesAData[indx]
    $scope.allData.otherIncomesAData.splice(indx,1)
  }





$scope.addnewTenanat = function(data){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.create.tenanat.html',
    placement: 'right',
    size: 'md',
    backdrop: true,
    resolve: {
      data: function() {
        return data;
      }
    },
    controller:'controller.home.create.tenant'
  }).result.then(function(data) {
  }, function(val) {
     if (typeof val == 'object'&&typeof data!='object') {
      $scope.allData.housePropertyData.push(val)

    }
    $scope.getTotal()

  })
}


$scope.addOwnerDetails = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.create.property.html',
    placement: 'right',
    size: 'md',
    backdrop: true,
    resolve: {
      data: function() {
        return   $scope.allData.propertyOwnerDetails;
      }
    },
    controller:'controller.home.create.property'
  }).result.then(function() {
  }, function() {
    if (typeof data == 'object') {
        $scope.allData.propertyOwnerDetails = data
    }

  })
}

$scope.addDeduction = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.add.deduction.html',
    placement: 'right',
    size: 'md',
    backdrop: true,
    resolve: {
      data: function() {
        return  $scope.allData.deductionSixAData;
      }
    },
    controller:'controller.home.add.deduction'
  }).result.then(function() {
  }, function(data) {
    if (typeof data == 'object') {
      $scope.allData.deductionSixAData.push(data)
      $scope.caldeductionSix()
      $scope.getTotal()
    }

  })
}


})

app.controller('controller.home.add.deduction' , function($scope , $uibModalInstance  , $filter, $http, $uibModalInstance, data, Flash  ) {
$scope.allDeductions = []
for (var i = 0; i < data.length; i++) {
  if (data[i].amount == 0) {
    $scope.allDeductions.push(data[i])
  }
}


$scope.form = {
  deduction : '',
  limit :0,
  amount : 0
}

$scope.selectData = function(){
  $scope.form.limit = $scope.form.deduction.limit
  $scope.form.pk = $scope.form.deduction.pk
}




$scope.updateDeduction= function(){
    if ($scope.form.deduction == null || typeof $scope.form.deduction!='object' || $scope.form.amount == null|| $scope.form.amount == 0 || $scope.form.amount.length == 0) {
      Flash.create('warning' , 'Deduction and amount is required')
      return
    }

    if ($scope.form.amount>$scope.form.limit) {
      Flash.create('warning' , 'Amount cannot be more than limit')
      return
    }
    var method = 'PATCH'
    var url = '/api/payroll/itDeclaration/'+ $scope.form.pk +'/'
    $http({
      method: method,
      url: url,
      data : {
        amount : $scope.form.amount,
      }
    }).
    then(function(response) {
      $uibModalInstance.dismiss(response.data)
    })
}

})

app.controller('controller.home.create.property' , function($scope , $uibModalInstance  , $filter, $http, $uibModalInstance, data, Flash , $state, $users ) {
$scope.rented = data

if ($state.is('home.viewProfile.itDeclaration')) {
  $scope.me = $users.get('mySelf');
  $scope.userPk =  $scope.me.pk
}
else{
    $scope.userPk = $state.params.id
}


$scope.addRentedData = function(){
  if ($scope.rented.address == null || $scope.rented.address.length == 0 || $scope.rented.tenantName == null || $scope.rented.tenantName.length == 0 || $scope.rented.tenantPan == null || $scope.rented.tenantPan.length == 0 ) {
    Flash.create('warning','Owner name and Owner Pan and Owner address is required')
    return
  }


  var dataToSend = $scope.rented
  dataToSend.group_name = "propertyOwnerDetails"
  dataToSend.user = $scope.userPk
  var method = 'POST'
  var url = '/api/payroll/addITDeclaration/'
  $http({
    method: method,
    url: url,
    data : dataToSend
  }).
  then(function(response) {
    $uibModalInstance.dismiss(response.data)
  })
}


})

app.controller('controller.home.create.tenant' , function($scope , $uibModalInstance  , $filter, $http, $uibModalInstance, data, Flash,  $state,  $users ) {


  if ($state.is('home.viewProfile.itDeclaration')) {
    $scope.me = $users.get('mySelf');
    $scope.userPk =  $scope.me.pk
  }
  else{
      $scope.userPk = $state.params.id
  }

  $scope.refreshRentedData = function(){
    $scope.rented = {
      title:'',
      annualRent:0,
      muncipalTax:0,
      unrealizedTax:0,
      netAnnualValue:0,
      standardDeduction:0,
      interestOnLoan:0,
      amount:0,
      tenantName:'',
      tenantPan:''
    }
  }
  $scope.refreshRentedData()

  $scope.calc = function(){
    $scope.rented.netAnnualValue = (parseInt($scope.rented.annualRent) - (parseInt($scope.rented.muncipalTax) + parseInt($scope.rented.unrealizedTax)))
    $scope.rented.standardDeduction = parseInt($scope.rented.netAnnualValue)*0.3
    $scope.rented.amount = (parseInt($scope.rented.netAnnualValue) - (parseInt($scope.rented.standardDeduction) + parseInt($scope.rented.interestOnLoan)))
    $scope.rented.amount = parseInt($scope.rented.amount)
  }

  if (typeof data == 'object') {
    $scope.rented = data
    $scope.calc()
  }



  $scope.addRentedData = function(){

    if ($scope.rented.title == null || $scope.rented.title.length == 0 || $scope.rented.tenantName == null || $scope.rented.tenantName.length == 0 || $scope.rented.tenantPan == null || $scope.rented.tenantPan.length == 0 ) {
      Flash.create('warning','Property number, Tenant name and Tenant Pan is required')
      return
    }

    if ($scope.rented.annualRent == null || $scope.rented.annualRent.length == 0 || $scope.rented.annualRent <= 0 || $scope.rented.muncipalTax == null || $scope.rented.muncipalTax.length == 0 || $scope.rented.unrealizedTax == null || $scope.rented.unrealizedTax.length == 0 || $scope.rented.netAnnualValue == null || $scope.rented.netAnnualValue.length == 0 || $scope.rented.standardDeduction == null || $scope.rented.standardDeduction.length == 0 || $scope.rented.netAnnualValue == null || $scope.rented.netAnnualValue.length  == 0 || $scope.rented.amount == null || $scope.rented.amount.length  == 0) {
      Flash.create('warning','Amount in all fields are not valid')
      return
    }

    var dataToSend = $scope.rented
    dataToSend.user = $scope.userPk
    dataToSend.group_name = "houseProperty"
    var method = 'POST'
    var url = '/api/payroll/addITDeclaration/'
    $http({
      method: method,
      url: url,
      data : dataToSend
    }).
    then(function(response) {
      $uibModalInstance.dismiss(response.data)
    })
  }

})

app.controller('controller.home.create.declaration' , function($scope , $uibModalInstance , typ , $filter, $http, $uibModalInstance  ) {
  $scope.typ = typ


  if ($state.is('home.viewProfile.itDeclaration')) {
    $scope.me = $users.get('mySelf');
    $scope.userPk =  $scope.me.pk
  }
  else{
      $scope.userPk = $scope.userPk
  }

  $scope.getLimit = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/getLimit/?user='+$scope.userPk
    }).
    then(function(response) {
      $scope.form.limit = response.data.limitAmount
    })
  }
  if ($scope.typ == 'Perquisites') {
    $scope.form = {
      'title' : '',
      'amount' : 0,
      'limit' : 5000,
      'group_name' : 'Perquisites',
    }
    $scope.getLimit()
  }


  $scope.save = function(){
    $http({
      method: 'POST',
      url: '/api/payroll/addITDeclaration/'
    }).
    then(function(response) {
      $uibModalInstance.dismiss()
    })
  }




})

app.controller('controller.home.expense.claims', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $window) {
  // settings main page controller
  $scope.opened = false;

  window.addEventListener("message", function(evt) {
    console.log(evt);
    if (evt.data[0].type == 'fileScan' && $scope.opened == false ) {
      $scope.opened = true;
      $scope.addInvoicesData(evt.data[0].file)
    }
  })




  var today = new Date()
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  $scope.form = {
    to: today,
    frm: lastDayOfMonth,
    stage:'submitted',
  }
  $scope.data =[]
  $scope.reload = function() {
    var to = new Date($scope.form.to.getFullYear(),$scope.form.to.getMonth(),$scope.form.to.getDate()+2)
    $http.get('/api/finance/getExpenses/?frm=' + $scope.form.frm.toJSON().split('T')[0] + '&to=' + to.toJSON().split('T')[0]+ '&stage=' + $scope.form.stage)
      .then(function(response) {
        $scope.data = response.data;
      })
  }

  $scope.reloadByMonth = function(){
    $http.get('/api/finance/getExpenses/?month='+$scope.select.month+'&year='+$scope.select.year+ '&stage=' + $scope.select.stage)
      .then(function(response) {
        $scope.data = response.data;
      })
  }


  $scope.download = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.expenseDownload.html',
      size: 'md',
      backdrop: true,
      controller: function($scope,$http, Flash, $users, $uibModalInstance){
        $scope.getUsers = function(){
          $http.get('/api/HR/users/?is_active==true').
          then(function(response) {
            $scope.users =  response.data;
          })
        }
        $scope.getUsers()
        var date  = new Date()
        $scope.form = {
          fromDate : new Date(date.getFullYear(), date.getMonth(), 1),
          toDate : date,
          selectedUser : ''
        }
        $scope.downloadSheet = function(){
          var url = '/api/finance/downloadExpenses/?frm=' + $scope.form.fromDate.toJSON().split('T')[0] + '&to=' + $scope.form.toDate.toJSON().split('T')[0];
          if ($scope.form.selectedUser != null  && typeof $scope.form.selectedUser == 'object') {
            url = url + '&user=' + $scope.form.selectedUser.pk
          }
          window.open(url,'_blank');
        }
      },
    }).result.then(function() {}, function(res) {
    });

  }

  $scope.downloadByMonth = function(){
    var url = '/api/finance/downloadExpensesPdf/?month='+$scope.select.month+'&year='+$scope.select.year+ '&stage=' + $scope.select.stage;
    window.open(url,'_blank');
  }

  $scope.getForm = function(mode, pkVal,stage) {
    if (stage=='created' || stage=='submitted'|| stage=='cancelled') {
      var edit = false
    }
    $aside.open({
      templateUrl: '/static/ngTemplates/app.home.expenseClaims.form.html',
      position: 'right',
      size: 'xxl',
      backdrop: false,
      resolve: {
        mode: function() {
          return mode;
        },
        pkVal: function() {
          return pkVal;
        },
        editStage: function() {
          return edit;
        },
        canApprove: function() {
          return true;
        },
        createPermission: function() {
          return $scope.createPermission;
        },
      },
      controller: 'home.expense.claims.form',
    }).result.then(function() {
      $scope.reload()
    }, function() {
      // $scope.reload()
    })
  }

  if (LIMIT_EXPENSE_COUNT == 'True') {
      $scope.months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      $scope.currentYear = new Date().getFullYear()
      $scope.monthVal =  new Date().getMonth()
      $scope.select = {}
      $scope.select.month = $scope.months[$scope.monthVal]
      console.log($scope.month);
      $scope.select.year =  new Date().getFullYear()
      $scope.startYear = 2011;
      $scope.years =[]
      while ( $scope.startYear <= $scope.currentYear ) {
          $scope.years.push($scope.startYear++);
      }
      $scope.createPermission = false
      $scope.select.stage='submitted'
      $scope.reloadByMonth()
  }else{
    $scope.createPermission = true
    $scope.reload()
  }



  $scope.loadTags = function(query) {
    return $http.get('/api/HR/userSearch/?username__contains=' + query)
  };

  $scope.openNewExpenses = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.newExpenses.html',
      size: 'md',
      backdrop: true,
      controller: function($scope,$http, Flash, $users, $uibModalInstance){
        $scope.form = {notes:''}
        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
        $scope.createExpense = function(){

          $http({
            method: 'POST',
            url: '/api/finance/invoiceReceived/',
            data: {
              title: $scope.form.title,
              invType : 'EXPENSES'
            }
          }).
          then(function(response) {
            console.log(response.data);
            Flash.create('success', 'Expense Created Successfilly');
            $uibModalInstance.dismiss(response.data)
          })
        }
      },
    }).result.then(function() {}, function(res) {
      if (res!=undefined&&res.pk) {
        $state.go('home.editExpenseClaims' , {'id' : res.pk})
      }
    });
  }

  $scope.addInvoicesData = function(fileUrl){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.addInvoices.html',
      size: 'md',
      backdrop: true,
      resolve : {
        fileUrl : function() {
          return fileUrl
        }
      },
      controller: function($scope,$http, Flash, $users, $uibModalInstance , fileUrl){

        window.addEventListener("message", function(evt) {
          console.log(evt);
          if (evt.data[0].type == 'fileScan' ) {
            $scope.form.fileUrl = evt.data[0].file;
            $scope.form.selection = 'scan';
          }
        })

        console.log(fileUrl);

        $scope.form = {product:'',description:'',total:0,attachment:emptyFile  , selection : 'file'}

        if (fileUrl != undefined && fileUrl != null) {
          $scope.form.fileUrl = fileUrl;
          $scope.form.selection = 'scan';
        }


        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
        $scope.selectFile = function() {
          $('#filePicker').click()
        }
        $scope.createInvoice = function(){


            var f = $scope.form;
            var fd = new FormData();
            if (f.attachment != null && f.attachment != emptyFile && typeof f.attachment != 'string' ) {
              fd.append('attachment', f.attachment)
            }

            if ($scope.form.selection == 'scan') {
              fd.append('scan', f.fileUrl)
            }

            // if (f.code != null && f.code.pk != undefined) {
            //   fd.append('code', f.code.title);
            // } else {
            //   fd.append('code', f.code);
            // }
            fd.append('product', f.product);
            fd.append('total', f.total);
            fd.append('description', f.description);
          $http({
            method: 'POST',
            url: '/api/finance/invoiceQty/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Expense Created Successfilly');
            $scope.form = {product:'',description:'',total:0,attachment:emptyFile  , selection : 'file'}

            // $uibModalInstance.dismiss()
          })
        }
      },
    }).result.then(function() {
      $scope.opened = false;
    }, function() {
      $scope.opened = false;
      $scope.reload()
    });
  }

$scope.fileDropzone = function(){
  return
}

  $scope.createExpense = function() {
    var dataToSend = {
      title: 'a sample title',
      title: 'a sample title',
    }
    $http({
      method: 'post',
      url: '/api/finance/expenseSheet/',
      data: dataToSend
    }).
    then(function(response) {
      var pk = response.data.pk;
      $scope.users = []
    }, function(error) {

    })
  }
  $scope.page = 0
  $scope.searchText = ''
  $scope.me = $users.get('mySelf');
  $scope.users = [];
  $scope.reload = function(typ) {
  $scope.typ = typ
  // var url = '/api/finance/expenseSheet/?user='+$scope.me.pk+'&limit='+$scope.limit+'&offset=' + $scope.page*5
  // if (typ == 'search') {
  //   url = url+'&notes__icontains=' +$scope.searchText
  // }
  //   $http({
  //     method: 'GET',
  //     url:  url,
  //   }).
  //   then(function(response) {
  //     $scope.expenseData = response.data.results;
  //   }, function(error) {
  //   })
    $http({
      method: 'GET',
      url:  '/api/finance/getExpensesData/',
    }).
    then(function(response) {
      $scope.expenseData = response.data.expenseObj;
      $scope.invoicesData = response.data.unclaimedObj;
      $scope.unclaimed = response.data.unclaimed;
      $scope.claimed = response.data.claimed;
      $scope.approved = response.data.approved;
      $scope.advance = response.data.advance;
    }, function(error) {
    })
  }




  if (LIMIT_EXPENSE_COUNT == 'True') {
    $scope.createPermission = false
    $scope.limit = 6
    $http({
      method: 'POST',
      url:  '/api/finance/createExpenses/',
    }).
    then(function(response) {
        $scope.reload('all')
    }, function(error) {
    })
  }else{
    $scope.createPermission = true
    $scope.limit = 5
    $scope.reload('all')
  }

  $scope.next = function() {
    $scope.page += 1;
    $scope.reload($scope.typ);
  }

  $scope.prev = function() {
    if ($scope.page != 0) {
      $scope.page -=1;
      $scope.reload($scope.typ);
    }
  }


  $scope.delete = function(indx,pkVal){
    $http({method : 'DELETE' , url : '/api/finance/expenseSheet/' + pkVal +'/'}).
    then(function(response) {
      $scope.expenseData.splice(indx , 1);
    })
  }

  $scope.getForm = function(mode, pkVal,stage) {
    if ( stage=='submitted' || stage=='approved' || stage=='cancelled') {
      var edit = false
      var mode = 'view'
    }
    $aside.open({
      templateUrl: '/static/ngTemplates/app.home.expenseClaims.form.html',
      position: 'right',
      size: 'xxl',
      backdrop: false,
      resolve: {
        mode: function() {
          return mode;
        },
        pkVal: function() {
          return pkVal;
        },
        editStage: function() {
          return edit;
        },
        canApprove: function() {
          return false;
        },
        createPermission: function() {
          return $scope.createPermission;
        },
      },
      controller: 'home.expense.claims.form',
    }).result.then(function() {
      $scope.reload()
    }, function() {
      // $scope.reload()
    })
  }



})
