// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.servicing', {
      url: "/servicing",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.marketing.customer.index.html',
          controller: 'businessManagement.servicing',
        },
        "@businessManagement.servicing": {
          templateUrl: '/static/ngTemplates/app.marketing.leads.html',
          controller : 'businessManagement.servicing'
        }
      }
    })
  $stateProvider.state('businessManagement.servicing.ongoing', {
    url: "/ongoing",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing'
  })
  $stateProvider.state('businessManagement.servicing.assigned', {
    url: "/assigned",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller: 'businessManagement.servicing'
  })
  $stateProvider.state('businessManagement.servicing.postponed', {
    url: "/postponed",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing'
  })
  $stateProvider.state('businessManagement.servicing.cancelled', {
    url: "/cancelled",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing'
  })
  $stateProvider.state('businessManagement.servicing.upcoming', {
    url: "/upcoming",
    templateUrl: '/static/ngTemplates/app.marketing.upcoming.html',
    controller : 'businessManagement.servicing'
  })
  $stateProvider.state('businessManagement.servicing.collection', {
    url: "/collection",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.servicing'
  })


});


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

// app.controller("businessManagement.servicing.view", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {
//
//
//
//
// })



app.controller("businessManagement.servicing", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {


  $scope.selected = {
    status : 'created'
  }
  $scope.getServices = function(){
    if ($state.is('businessManagement.servicing.assigned')) {
        $scope.selected.status = 'assigned'
    }
    else if ($state.is('businessManagement.servicing.ongoing')) {
        $scope.selected.status = 'ongoing'
    }
    else if ($state.is('businessManagement.servicing.completed')) {
        $scope.selected.status = 'completed'
    }
    else if ($state.is('businessManagement.servicing.postponed')) {
        $scope.selected.status = 'postponed'
    }
    else if ($state.is('businessManagement.servicing.cancelled')) {
        $scope.selected.status = 'cancelled'
    }
    $http({
      method: 'GET',
      url: '/api/clientRelationships/serviceTicket/?status='+$scope.selected.status
    }).
    then(function(response) {
      $scope.allServices = response.data
      console.log($scope.allServices);
    })
  }

  $scope.getServices()
  $scope.appInfo = {
    name : '',
    logo: ''
  }
  $scope.getApp = function(){
    $http({
      method: 'GET',
      url: '/api/ERP/getapplication/?stateAlias=' + $state.params.name
    }).
    then(function(response) {
      if(response.data.length>0){
        $scope.appInfo.name = response.data[0].displayName
        $scope.appInfo.logo = response.data[0].icon
        console.log(response.data,$scope.appInfo.logo,'$scope.appInfo.logo');

      }
    })
  }
  $scope.getApp()


  $scope.newContact = function(indx) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.newContact.html',
      size: 'lg',
      placement: 'right',
      backdrop: false,
      resolve: {
        data: function() {
          if (indx == undefined || indx == null) {
            return null
          } else {
            return $scope.allServices[indx]
          }
        }
      },
      controller: "businessManagement.marketing.addContacts",
    }).result.then(function() {
      // $scope.getAllData()
    }, function(res) {
      if (typeof res == 'object') {
        $scope.allServices.push(res)
      }
      // $scope.getAllData()
    });
  }



});
app.controller("businessManagement.marketing.addContacts", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal, $uibModalInstance, data) {
  console.log(data);
  if (typeof data == 'object') {
    $scope.form = data
  }
  else{
    $scope.form = {
      preferredTimeSlot:'',
      preferredDate :'',
      referenceContact:'',
      name:'',
      phone:'',
      email:'',
      productName : '',
      productSerial : '',
      notes:'',
      address:'',
      pincode:'',
      city:'',
      state :'',
      country :'',
      requireOnSiteVisit:false,
      warrantyStatus:'OEM Warranty'
    }
  }
  $scope.searchContact = function(query) {
    return $http.get('/api/clientRelationships/contact/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  }

$scope.selectContact = function(){
  // $scope.$watch('form.name', function(newValue, oldValue) {
  if (typeof $scope.form.name == 'object') {
    $scope.form.phone = $scope.form.name.mobile
    $scope.form.email = $scope.form.name.email
    $scope.form.address = $scope.form.name.street
    $scope.form.city = $scope.form.name.city
    $scope.form.state = $scope.form.name.state
    $scope.form.pincode = $scope.form.name.pincode
    $scope.form.country = $scope.form.name.country
    $scope.form.name = $scope.form.name.name
    // $scope.locations = [$scope.form.name.lat, $scope.form.name.lng]
    $scope.form.referenceContact = $scope.form.name.pk
    // $scope.place = $scope.form.addrs
    // var pincode = $scope.form.areaCode
    // var city = $scope.form.city
    // var state = $scope.form.state
  }
  // })
}

$scope.selectPincode = function(){
  if (typeof $scope.form.pincode == 'object') {
      $scope.form.state = $scope.form.pincode.state
      $scope.form.city = $scope.form.pincode.city
      $scope.form.state = $scope.form.pincode.state
      $scope.form.country = $scope.form.pincode.country
      $scope.form.pincode = $scope.form.pincode.pincode
  }
}


$scope.types = "[]";
$scope.usebounds = false;

$scope.placeChanged = function() {
  $scope.place = this.getPlace();
  if ($scope.place.geometry.location != undefined) {
    $scope.locations = $scope.place.geometry.location
    $scope.lat = $scope.place.geometry.location.lat()
    $scope.lng = $scope.place.geometry.location.lng()
  }
  console.log('location', $scope.place.geometry.location.lat() ,  $scope.place.geometry.location.lng());
  console.log('location', $scope.place);
}



  $scope.close = function() {
    $uibModalInstance.dismiss()
  }

  $scope.pinSearch = function(query) {
    return $http.get('/api/ERP/genericPincode/?limit=10&pincode__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.save = function(){
    console.log($scope.form.requireOnSiteVisit);
    if ($scope.form.name == null || $scope.form.name.length == 0 ) {
      Flash.create('warning' , 'Name is required')
      return
    }
    if ($scope.form.phone == null || $scope.form.phone.length == 0 ) {
      Flash.create('warning' , 'Mobile number is required')
      return
    }
    if ($scope.form.productName == null || $scope.form.productName.length == 0 ) {
      Flash.create('warning' , 'Product name is required')
      return
    }
    if ($scope.form.requireOnSiteVisit == true) {
      if ($scope.form.preferredDate == null ||  typeof $scope.form.preferredDate!='object' ) {
        Flash.create('warning' , 'Prefered date is required')
        return
      }
      if ($scope.form.preferredTimeSlot == null ||   $scope.form.preferredTimeSlot.length == 0  ) {
        Flash.create('warning' , 'Prefered time slot is required')
        return
      }
    }
    if ($scope.form.pincode == null || $scope.form.pincode.length == 0 ) {
      Flash.create('warning' , 'Pincode is required')
      return
    }
    if ($scope.form.address == null || $scope.form.address.length == 0 ) {
      Flash.create('warning' , 'Address is required')
      return
    }
    var dataSave = {
      name:$scope.form.name,
      phone:$scope.form.phone,
      pincode:$scope.form.pincode,
      state:$scope.form.state,
      city:$scope.form.city,
      country:$scope.form.country,
      address:$scope.form.address,
      requireOnSiteVisit:$scope.form.requireOnSiteVisit,
    }
    if ($scope.form.referenceContact!=undefined && $scope.form.referenceContact.length>0 ) {
        dataSave.referenceContact = $scope.form.referenceContact
    }
    else{
      dataSave.referenceContact = null
    }
    if ($scope.form.requireOnSiteVisit == true) {
        dataSave.preferredDate = dateToString($scope.form.preferredDate)
        dataSave.preferredTimeSlot = $scope.form.preferredTimeSlot
    }
    if ($scope.form.productName !=undefined&&$scope.form.productName !=null) {
        dataSave.productName = $scope.form.productName
    }
    if ($scope.form.email !=undefined&&$scope.form.email !=null) {
        dataSave.email = $scope.form.email
    }
    if ($scope.form.productSerial !=undefined&&$scope.form.productSerial !=null) {
        dataSave.productSerial = $scope.form.productSerial
    }
    if ($scope.form.notes !=undefined&&$scope.form.notes !=null) {
        dataSave.notes = $scope.form.notes
    }
    if ($scope.form.warrantyStatus !=undefined&&$scope.form.warrantyStatus !=null) {
        dataSave.warrantyStatus = $scope.form.warrantyStatus
    }
    var method = 'POST'
    var url = '/api/clientRelationships/serviceTicket/'
    if ($scope.form.pk) {
      method = 'PATCH'
      url +=$scope.form.pk+'/'
    }
    $http({
      method: method,
      url:url,
      data:dataSave
    }).
    then(function(response) {
      if (!$scope.form.pk) {
        $uibModalInstance.dismiss(response.data)
      }
      $uibModalInstance.dismiss()
    })

  }



})
