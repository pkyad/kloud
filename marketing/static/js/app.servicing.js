// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.servicing', {
      url: "/servicing/:name",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.marketing.customer.index.html',
          controller: 'businessManagement.servicing',
        },
        "@businessManagement.servicing": {
          templateUrl: '/static/ngTemplates/app.marketing.leads.html',
          controller : 'businessManagement.marketing.leads'
        }
      }
    })
  $stateProvider.state('businessManagement.servicing.ongoing', {
    url: "/ongoing",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.marketing.customer.details'
  })
  $stateProvider.state('businessManagement.servicing.assigned', {
    url: "/assigned",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller: 'businessManagement.marketing.contacts'
  })
  $stateProvider.state('businessManagement.servicing.postponed', {
    url: "/postponed",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.marketing.customer.details'
  })
  $stateProvider.state('businessManagement.servicing.cancelled', {
    url: "/cancelled",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.marketing.customer.details'
  })
  $stateProvider.state('businessManagement.servicing.upcoming', {
    url: "/upcoming",
    templateUrl: '/static/ngTemplates/app.marketing.upcoming.html',
    controller : 'businessManagement.marketing.customer.details'
  })
  $stateProvider.state('businessManagement.servicing.collection', {
    url: "/collection",
    templateUrl: '/static/ngTemplates/app.marketing.customerDetails.html',
    controller : 'businessManagement.marketing.customer.details'
  })
  $stateProvider.state('businessManagement.servicing.agreements', {
    url: "/agreements",
    templateUrl: '/static/ngTemplates/app.marketing.agreements.html',
    controller : 'businessManagement.marketing.customer.agreements'
  })

});


app.controller("businessManagement.marketing.customer.agreements", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal, $rootScope) {
  $scope.limit = 10
  $scope.offset = 0
  $scope.contactForm ={
    search:''
  }
  $scope.fetch = function() {
    var url = '/api/clientRelationships/contactAll/?products=&limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.contactForm.search.length > 0 ) {
      url += '&search='+$scope.contactForm.search
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.contactList = response.data.results
      $scope.contactPrev = response.data.previous
      $scope.contactNext = response.data.next
    })
  }
    $scope.fetch()

    $scope.previous = function(){
      if ($scope.contactPrev != null) {
        $scope.offset -= $scope.limit
        $scope.fetch ()

      }
    }
    $scope.next = function(){
      if ($scope.contactNext != null) {
        $scope.offset += $scope.limit
        $scope.fetch ()

      }
    }

})


app.controller("businessManagement.marketing.leads", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal, $rootScope) {
  $scope.serviceName = $state.params.name
  $scope.material_inward = MATERIAL_INWARD

  $scope.filter = {
    dt: new Date(),
    searchTxt: ''
  }

  $scope.data = []

  $scope.fetch = function() {
    $http({
      method: 'GET',
      url: '/api/marketing/contacts/?updated_search=' + $scope.filter.dt.toISOString().split('T')[0] + '&search=' + $scope.filter.searchTxt +'&serviceName='+$state.params.name
    }).
    then(function(response) {
      $scope.data = response.data;
    })
  }

  $scope.assign = function(indx) {

    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.addServiceVisit.html',
      size: 'lg',
      placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.data[indx]
        },
        typ: function() {
          return 'contact'
        },
      },
      controller: 'businessManagement.marketing.addServiceVisit'
    }).result.then(function() {}, function(res) {
      $scope.fetch()
    });

  }


  $scope.$watch('filter.dt', function(newValue, oldValue) {
    $scope.fetch();
  })

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
            return $scope.data[indx]
          }
        }
      },
      controller: "businessManagement.marketing.saveContacts",
    }).result.then(function() {
      $scope.fetch()
    }, function(res) {
      $scope.fetch()
    });
  }

  $scope.openMaterialInward = function(indx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.materialInwardNote.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.data[indx]
        }
      },
      controller: "businessManagement.marketing.materialInwardNote",
    }).result.then(function() {
      $scope.fetch()
    }, function(res) {
      $scope.fetch()
    });
  }

  $scope.call = function(num) {
    $rootScope.$broadcast("call", {type : 'call' , number : num , source : 'campaign' , id : $scope.data.pk });
  }


});

app.controller("businessManagement.marketing.materialInwardNote", function($scope, $http, Flash, $uibModal, $uibModalInstance, NgMap, data) {
  $scope.contact = data
  $scope.totalCharges = 0

  if ($scope.contact.material_charges!=undefined && $scope.contact.material_charges!=null) {
    $scope.totalCharges = $scope.contact.material_charges
  }
  $scope.reset = function(){
    $scope.form = {
      item: '',
      warranty: '',
      issue: ''
    }
  }
  $scope.reset()
  $scope.terms = ''

  $scope.items = []
  if ($scope.contact.material_items == null || $scope.contact.material_items.length==0) {
    $scope.items = []
  }
  else {
    $scope.items = JSON.parse($scope.contact.material_items);
  }

  $scope.add = function() {
    if ($scope.form.item.length == 0 || $scope.form.warranty.length == 0 || $scope.form.issue.length == 0) {
      Flash.create('warning' , 'All details are required')
      return
    }
    $scope.items.push($scope.form)
    $scope.reset()

  }
  $scope.edit = function(indx) {
    $scope.form = $scope.items[indx]
    $scope.items.splice(indx, 1)
  }

  $scope.save = function() {
    var dataToSend = {
      'material_items' : JSON.stringify($scope.items),
      'material_charges' : $scope.totalCharges
    }
    if (typeof $scope.terms =='object') {
      dataToSend.material_terms = $scope.terms.pk
    }

    $http({
      method: 'PATCH',
      url: '/api/marketing/contacts/' + $scope.contact.pk +'/',
      data : dataToSend
    }).
    then(function(response) {
      $scope.contact = response.data
      Flash.create('success' , 'Saved')
      return
    })
  }

  $scope.delete = function(indx) {
    $scope.items.splice(indx, 1)
  }

  $http({
    method: 'GET',
    url: '/api/finance/configureTermsAndConditions/',
  }).
  then(function(response) {
    $scope.termsandConditions = response.data
    console.log($scope.contact.material_terms,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    if ($scope.contact.material_terms!=null) {
      for (var i = 0; i < $scope.termsandConditions.length; i++) {
        if ($scope.termsandConditions[i].pk == $scope.contact.material_terms) {
          $scope.terms = $scope.termsandConditions[i]
        }
      }
    }
  })



})





app.controller("businessManagement.servicing", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal) {

  console.log("changed",$state.params.name,'$state.params.name')
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
            return $scope.assetsData[indx].contact
          }
        }
      },
      controller: "businessManagement.marketing.saveContacts",
    }).result.then(function() {
      $scope.getAllData()
    }, function(res) {
      $scope.getAllData()
    });
  }




  $scope.daysCount = '7'
  $scope.getAllData = function() {
    $http({
      method: 'GET',
      url: '/api/marketing/adminDashboarddetails/?days=' + $scope.daysCount
    }).
    then(function(response) {
      $scope.dashboardData = response.data.data
    })

  }
  $scope.getAllData()

});


app.controller("businessManagement.marketing.addServiceVisit", function($scope, $state, $users, $stateParams, $http, Flash, $aside, data, $uibModalInstance, typ) {
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
  $scope.getLocation = function(lat, lon) {
    console.log("dddddddddddd");
    $scope.lat = lat
    $scope.lng = lon
    $http({
      method: 'GET',
      url: '/api/marketing/getloaction/?lat=' + lat + '&lon=' + lon
    }).
    then(function(response) {
      if (response.data.msg) {
        Flash.create('warning', response.data.msg)
        return
      } else {
        console.log(response.data.address);
        $scope.form.contact.addrs = response.data.address.display_name
        $scope.form.contact.pinCode = response.data.address.address.postcode
      }
    })
  }

  $scope.center = [12.970435, 77.578424];


  $scope.getCurrentLocation = function(event) {
    $scope.lat = event.latLng.lat()
    $scope.lng = event.latLng.lng()
  }

  $scope.form = {
    user: '',
    customer: {},
    tourPlanStop: [],
    invoices: [],
    dated: new Date(),
    addedInvoices: [],
    otp: '',
    visitType: 'installation',
    timeslot: '1 AM',
    techniciandata: []
  }
  $scope.typ = typ
  if (typ == 'contact') {
    $scope.form.customer = data
    $scope.form.timeslot = $scope.form.customer.slot
    $scope.form.dated = $scope.form.customer.date
    $scope.form.serviceName = $scope.form.customer.serviceName
  }else if(typ == 'plan' || typ == 'planandcontact') {
    $scope.form = data
    $scope.form.customer = $scope.form.contact
    $scope.form.dated = $scope.form.tourplan.date
    $scope.user = $scope.form.tourplan.user
    $scope.locations = [$scope.form.customer.lat , $scope.form.customer.lng]
  }
  $scope.tourPlanCount = 0
  $scope.checkCount = function() {
    $scope.tourPlanCount = 0
    if ($scope.form.user.pk!=undefined) {
      $http({
        method: 'GET',
        url: '/api/marketing/getCount/?user=' + $scope.form.user.pk + '&date=' + $scope.form.dated
      }).
      then(function(response) {
        $scope.tourPlanCount = response.data
      })

    }
  }

  $scope.dateVal = new Date()
  $scope.me = $users.get("mySelf");
  $http({
    method: 'GET',
    url: '/api/marketing/tourPlanStop/?contact=' + $scope.form.customer.pk
  }).
  then(function(response) {
    $scope.form.tourPlanStop = response.data
  })
  $http({
    method: 'GET',
    url: '/api/finance/saleAll/?phone=' + $scope.form.customer.mobile
  }).
  then(function(response) {
    $scope.form.invoices = response.data
  })

  $scope.plan = function() {
    if (typeof $scope.form.customer != 'object') {
      Flash.create('warning', 'Select customer')
      return
    }
    if (typeof $scope.form.user != 'object') {
      Flash.create('warning', 'Select user')
      return
    }

    if ($scope.place!=undefined && $scope.place.address_components != undefined) {
      for (var i = 0; i < $scope.place.address_components.length; i++) {
        if ($scope.place.address_components[i].types.indexOf('postal_code') != -1) {
          $scope.form.customer.pinCode = $scope.place.address_components[i].long_name;
        }

        if ($scope.place.address_components[i].types.indexOf("locality") != -1) {
          $scope.form.customer.city = $scope.place.address_components[i].long_name;
        }
        if ($scope.place.address_components[i].types.indexOf("administrative_area_level_1") != -1) {
          $scope.form.customer.state = $scope.place.address_components[i].long_name;
        }
      }
    }

    var tosend = {
      date: $scope.form.dated,
      user: $scope.form.user.pk,
      contact: $scope.form.customer.pk,
      visitType: $scope.form.visitType,
      timeslot: $scope.form.timeslot,
      firstComment: $scope.form.firstComment
    }
    if ($scope.form.customer.pk) {
      tosend.customer = $scope.form.customer
      if ($scope.lat) {
          tosend.customer.lat = $scope.lat
      }
      if ($scope.lng) {
          tosend.customer.lng = $scope.lng
      }
    }
    if ($scope.form.pk) {
      tosend.pk = $scope.form.pk
    }

    if ($scope.form.serviceName!=undefined && $scope.form.serviceName!=null) {
      tosend.serviceName = $scope.form.serviceName
    }
    var method = 'POST'
    var url = '/api/marketing/plan/'
    $http({
      method: method,
      url: url,
      data: tosend
    }).
    then(function(response) {
      $uibModalInstance.dismiss();
      Flash.create('success', 'Saved')
    })
  }

  $scope.saveContact = function() {
    console.log("aaaaaaaaaaaaaa");
    if ($scope.form.name == '' || $scope.form.mobile == '') {
      Flash.create('warning', 'Name, phone number is required')
      return
    }

    if ($scope.place == undefined) {
      Flash.create('warning', 'Address is required')
      return
    }
    console.log($scope.place.address_components);
    if ($scope.place.address_components != undefined) {
      for (var i = 0; i < $scope.place.address_components.length; i++) {
        if ($scope.place.address_components[i].types.indexOf('postal_code') != -1) {
          var pincode = $scope.place.address_components[i].long_name;
        }

        if ($scope.place.address_components[i].types.indexOf("locality") != -1) {
          var city = $scope.place.address_components[i].long_name;
        }
        if ($scope.place.address_components[i].types.indexOf("administrative_area_level_1") != -1) {
          var state = $scope.place.address_components[i].long_name;
        }
      }
    }


    var f = $scope.form
    var tosend = {
      name: f.name,
      mobile: f.mobile,
      addrs: f.addrs,
      pinCode: pincode,
      city: city,
      state: state,
      country: 'India',
      areaCode: pincode,
      about: f.about,
      source: f.source,
      lat: $scope.lat,
      lng: $scope.lng,
      slot: $scope.form.slot
    }
    if (typeof $scope.form.date == 'object') {
      tosend.date = $scope.form.date.toJSON().split('T')[0]
    } else {
      tosend.date = $scope.form.date
    }
    if (f.email != null && f.email.length > 0) {
      tosend.email = f.email
    }
    if (f.companyName != null && f.companyName.length > 0) {
      tosend.companyName = f.companyName
    }
    var method = 'POST'
    var url = '/api/marketing/contacts/'
    if (f.pk) {
      var method = 'PATCH'
      var url = '/api/marketing/contacts/' + f.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: tosend
    }).
    then(function(response) {
      $scope.form.contact = response.data
    })

  }





  $http({
    method: 'GET',
    url: '/api/HR/userSearch/'
  }).
  then(function(response) {
    $scope.form.techniciandata = response.data
    if ($scope.user != undefined && $scope.user != null) {
      for (var i = 0; i < $scope.form.techniciandata.length; i++) {
        if ($scope.form.techniciandata[i].pk == $scope.user.pk) {
          $scope.form.user = $scope.form.techniciandata[i]
        }
      }

    }
    $scope.checkCount()
  })

})

app.controller("businessManagement.marketing.customer.details", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $sce, ngAudio, $aside, $rootScope) {
$scope.material_inward = MATERIAL_INWARD
  $scope.techdata = {
    data: ''
  }
  $scope.showEdit = true
if ($state.is('businessManagement.servicing.collection') || $state.is('businessManagement.servicing.ongoing') ) {
  $scope.showEdit = false

}

  $scope.showAll = function(indx){
    $scope.indx = indx
  }
  $scope.techData = function() {
    $http.get('/api/marketing/getStatus/').
    then(function(response) {
      $scope.techdata = response.data
    })
  }

  $scope.call = function(a) {
    console.log(a);
    $rootScope.$broadcast("call", {type : 'call' , number : a.contact.mobile , source : 'servicing' , id : a.pk });




    // $http({
    //   method: 'GET',
    //   url: '/api/marketing/callCustomer/?id=' + a.pk
    // }).
    // then(function(response) {
    //   Flash.create('success', 'Calling customer , Please pick up the call')
    // })
  }


  $scope.techData()

  $scope.techniciandata = []

  $scope.download = function() {

    var status = '';
    if ($state.is('businessManagement.servicing.assigned')) {
      status = 'assigned';
    }else if ($state.is('businessManagement.servicing.postponed')) {
      status = 'postponed';
    }else if ($state.is('businessManagement.servicing.cancelled')) {
      status = 'cancelled';
    }else if ($state.is('businessManagement.servicing.ongoing')) {
      status = 'ongoing';
    }else if ($state.is('businessManagement.servicing.assigned')) {
      status = 'assigned';
    }else if ($state.is('businessManagement.servicing.upcoming')) {
      status = 'upcoming';
    }else if($state.is('businessManagement.servicing.collection')){
      status = 'completed';
    }

    url = '/api/marketing/getAllTechnicianInfo/?status='  + status ;
    if ($scope.selctTech && $scope.selctTech.pk) {
      url += '&technician=' +  $scope.selctTech.pk
    }

    window.open(url , '_blank')

  }


  $http({
    method: 'GET',
    url: '/api/HR/userSearch/'
  }).
  then(function(response) {
    $scope.techniciandata = response.data
    $scope.techniciandata.push('')
  })

  $scope.search = ''
  $scope.limit = 10
  $scope.offset = 0
  $scope.asecindingOrder = false
  $scope.status = false
  $scope.serviceName = $state.params.name
  $scope.getAllData = function() {
    var url = '/api/marketing/tourPlanStop/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.serviceName!=undefined&&$scope.serviceName!=null) {
      url+='&serviceName='+$scope.serviceName
    }
    if ($scope.search.length > 0) {
      url += '&contact__mobile__contains=' + $scope.search
    }
    if ($scope.asecindingOrder == true) {
      url += '&ascending'
    }

    if (typeof $scope.selctTech == 'object') {
      url += '&tourplan__user=' + $scope.selctTech.pk
    }
    var status = '';
    if ($state.is('businessManagement.servicing.assigned')) {
      status = 'assigned';
    }else if ($state.is('businessManagement.servicing.postponed')) {
      status = 'postponed';
    }else if ($state.is('businessManagement.servicing.cancelled')) {
      status = 'cancelled';
    }else if ($state.is('businessManagement.servicing.ongoing')) {
      status = 'ongoing';
    }else if ($state.is('businessManagement.servicing.assigned')) {
      status = 'assigned';
    }else if ($state.is('businessManagement.servicing.upcoming')) {
      status = 'upcoming';
    }else if($state.is('businessManagement.servicing.collection')){
      status = 'completed';
    }

    if (status.length > 0) {
      url += '&status=' + status
    }

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      $scope.assetsData = response.data.results
      for (var i = 0; i < $scope.assetsData.length; i++) {
        for (var j = 0; j < $scope.assetsData[i].logs.length; j++) {
          if ($scope.assetsData[i].logs[j].fileUrl != null && $scope.assetsData[i].logs[j].fileUrl.length > 0) {
            $scope.assetsData[i].logs[j].fileUrl = $sce.trustAsResourceUrl($scope.assetsData[i].logs[j].fileUrl)
          }
        }

      }

      $scope.changeStatus = function(status, id){
          var url = '/api/marketing/tourPlanStop/'+id+'/'
          var method = 'PATCH'
          $http({
            method: method,
            url: url,
            data : {
              status:status
            }
          }).
          then(function(response) {
          })
      }

      // for (var i = 0; i < $scope.assetsData.length; i++) {
      // $scope.assetsData[i].audio_file = []
      // $scope.assetsData[i].call_audio_file = []
      // if ($scope.assetsData[i].audio_files!=null) {
      //   var audio_file  = []
      //   audio_file = $scope.assetsData[i].audio_files.split(' , ')
      //   for (var j = 0; j < audio_file.length; j++) {
      //     var name = '/media/'+audio_file[j]
      //     $scope.assetsData[i].audio_file.push(name)
      //   }
      // }
      // if ($scope.assetsData[i].call_audio_files!=null) {
      //   var call_audio_file  = []
      //   call_audio_file = $scope.assetsData[i].call_audio_files.split(' , ')
      //   for (var j = 0; j < call_audio_file.length; j++) {
      //     var name1 = '/media/'+call_audio_file[j]
      //     $scope.assetsData[i].call_audio_file.push(name1)
      //   }
      // }
      // }
    })
  }
  $scope.getAllData()


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
            return $scope.assetsData[indx].contact
          }
        }
      },
      controller: "businessManagement.marketing.saveContacts",
    }).result.then(function() {
      $scope.getAllData()
    }, function(res) {
      $scope.getAllData()
    });
  }

  $scope.assign = function(indx) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.addServiceVisit.html',
      size: 'lg',
      placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.assetsData[indx]
        },
        typ: function() {
          return 'planandcontact'
        },
      },
      controller: 'businessManagement.marketing.addServiceVisit'
    }).result.then(function() {}, function(res) {
      $scope.getAllData()
    });

  }

  $scope.techstatus = ''
  $scope.getCompleteData = function() {
    var url = '/api/marketing/tourPlanStop/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&status=completed'
    if ($scope.search.length > 0) {
      url += '&contact__mobile__contains=' + $scope.search
    }
    if ($scope.asecindingOrder == true) {
      url += '&ascending'
    }
    if (typeof $scope.selctTech == 'object') {
      url += '&tourplan__user=' + $scope.selctTech.pk
    }
    // var status = []
    // for (var i = 0; i < $scope.techdata.data.length; i++) {
    //   // if ($scope.techdata.data[i].name =='completed') {
    //   //   $scope.techdata.data[i].is_selected == true
    //   //   status.push($scope.techdata.data[i].name)
    //   // }
    //   if ($scope.techdata.data[i].is_selected == true) {
    //     status.push($scope.techdata.data[i].name)
    //   }
    // }
    // if (status.length>0) {
    //   url+='&status='+status
    // }

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      $scope.completeassetsData = response.data.results
    })

  }
  // $scope.getCompleteData()

  $scope.updateInc = function(indx){
    var data = $scope.completeassetsData[indx]
    var data_to_send = {
      techIncentive : data.techIncentive
    }
    $http({
      method: 'PATCH',
      url: '/api/marketing/tourPlanStop/' + data.pk +'/',
      data : data_to_send
    }).
    then(function(response) {

    })
  }


  $scope.callRecording = function(data, idx) {
    $scope.sounddata = ngAudio.load(data[idx].file.id);
    console.log($scope.sounddata, data, idx);
  }

  $scope.sortData = function() {
    $scope.asecindingOrder = !$scope.asecindingOrder
    $scope.getAllData()
  }
  $scope.prev = function() {
    if ($scope.allData.previous != null) {
      // $scope.limit = $scope.limit-10
      $scope.offset = $scope.offset - 10
      $scope.getAllData()

    }
  }

  $scope.next = function() {
    if ($scope.allData.next != null) {
      // $scope.limit = $scope.limit+10
      $scope.offset = $scope.offset + 10
      $scope.getAllData()

    }
  }

  $scope.refresh = function() {
    $scope.search = ''
    $scope.limit = 10
    $scope.offset = 0
    $scope.selctTech = ' '
    $scope.techData()
    $scope.getAllData()
  }


  $scope.bulkUpload = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.uploadContacts.html',
      size: 'sm',
      backdrop: false,
      controller: function($scope, $http, Flash, $uibModal, $uibModalInstance) {
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }
        $scope.form = {
          'exFile': emptyFile,
          'source': ''
        }
        $scope.uploading = false
        $scope.postFile = function() {
          var toSend = new FormData()
          toSend.append('exFile', $scope.form.exFile);
          toSend.append('source', $scope.form.source);
          $scope.uploading = true
          $http({
            method: 'POST',
            url: '/api/marketing/contactsBulkUpload/',
            data: toSend,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            $scope.uploading = false
            Flash.create('success', response.data.count + ' contacts uploaded!')
            $scope.form = {
              'exFile': emptyFile,
              'source': ''
            }
            return
          }, function(err) {
            Flash.create('danger', 'Error while uploading file');
            $scope.uploading = false
            return
          })
        }
      },
    });

  }



})
