// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.CRM', {
      url: "/CRM",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "@businessManagement.CRM": {
          templateUrl: '/static/ngTemplates/app.clientRelationships.default.html',
          controller: 'businessManagement.clientRelationships.default',
        }
      }
    })
    .state('businessManagement.contacts', {
      url: "/contacts",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.html',
      controller: 'businessManagement.clientRelationships.contacts'
    })
    .state('businessManagement.contacts.edit', {
      url: "/edit/:id",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.edit.html',
      controller: 'businessManagement.clientRelationships.contacts.edit'
    })
    .state('businessManagement.contacts.new', {
      url: "/new",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.edit.html',
      controller: 'businessManagement.clientRelationships.contacts.edit'
    })
    .state('businessManagement.contacts.delatils', {
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.delatils.html',
      controller: 'businessManagement.clientRelationships.contacts.delatils'
    })
    .state('businessManagement.contacts.quotenew', {
      url: "/b2cQuote/:id",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.quote.html',
      controller: 'businessManagement.clientRelationships.contacts.quote'
    })

    .state('businessManagement.contacts.createquote', {
      url: "/quote/:id/:template",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.createquote.html',
      controller: 'businessManagement.clientRelationships.contacts.quote'
    })
    .state('businessManagement.contacts.quote', {
      url: "/b2cQuote/:id/:contract",
      // templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.quote.html',
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.createquote.html',
      controller: 'businessManagement.clientRelationships.contacts.quote'
    })
    .state('businessManagement.contacts.contactQuote', {
      url: "/contactQuote/:id/:tour",
      templateUrl: '/static/ngTemplates/app.clientRelationships.contacts.quote.html',
      controller: 'businessManagement.clientRelationships.contacts.quote'
    })
    .state('businessManagement.CRM.opportunities', {
      url: "/opportunities",
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunities.list.html',
      controller: 'businessManagement.clientRelationships.opportunities.list'
    })
    .state('businessManagement.CRM.opportunities.new', {
      url: "/opportunities/new",
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunities.form.html',
      controller: 'businessManagement.clientRelationships.opportunities.form'
    })
    .state('businessManagement.CRM.opportunities.details', {
      url: "/opportunities/:id",
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunities.explore.html',
      controller: 'businessManagement.clientRelationships.opportunities.explore'
    })
    // .state('businessManagement.CRM.relationships', {
    //   url: "/relationships",
    //   templateUrl: '/static/ngTemplates/app.clientRelationships.relationships.html',
    //   controller: 'businessManagement.clientRelationships.relationships'
    // })
    // .state('businessManagement.clientRelationships.reports', {
    //   url: "/reports",
    //   templateUrl: '/static/ngTemplates/app.clientRelationships.reports.html',
    //   controller: 'businessManagement.clientRelationships.reports'
    // })
    .state('businessManagement.CRM.companies', {
      url: "/companies",
      templateUrl: '/static/ngTemplates/app.clientRelationships.customers.html',
      controller: 'businessManagement.clientRelationships.customers'
    })
  // .state('businessManagement.clientRelationships.emails', {
  //   url: "/emails",
  //   templateUrl: '/static/ngTemplates/app.clientRelationships.emails.html',
  //   controller: 'businessManagement.clientRelationships.emails'
  // })

});

app.controller('businessManagement.clientRelationships.contacts.edit', function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal, $timeout) {

  if ($state.is('businessManagement.contacts.edit')) {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contact/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.form = response.data;
      console.log($scope.form.designation, $scope.form);
      if ($scope.form.company != null) {
        $scope.form.gstin = $scope.form.company.tin
        $scope.form.street = $scope.form.company.address.street;
        $scope.form.city = $scope.form.company.address.city;
        $scope.form.pincode = $scope.form.company.address.pincode;
        $scope.form.state = $scope.form.company.address.state;
      }

    })
  } else {
    $scope.form = {
      name: '',
      email: '',
      mobile: '',
      company: '',
      street: '',
      pincode: '',
      city: '',
      state: '',
      gstin: '',
      isGst: false,
      showMore: false,
      designation: ''
    }
  }

  $scope.goToContact = function(ID){
    $state.go('businessManagement.contacts.delatils', {id :ID});
  }

  $scope.save = function() {
    if ($scope.form.name == null || $scope.form.name.length == 0 || $scope.form.email == null || $scope.form.email.length == 0 || $scope.form.mobile == null || $scope.form.mobile.length == 0) {
      Flash.create('warning', 'Name ,  Email and Mobile are required')
      return
    }
    if ($scope.form.street == null || $scope.form.street.length == 0 || $scope.form.pincode == null || $scope.form.pincode.length == 0) {
      Flash.create('warning', 'Address, Pincode, City, State and Country are required')
      return
    }
    var dataToSend = {
      name: $scope.form.name,
      email: $scope.form.email,
      mobile: $scope.form.mobile,
      street: $scope.form.street,
      pincode: $scope.form.pincode,
      city: $scope.form.city,
      state: $scope.form.state,
      country: $scope.form.country,
      isGst: $scope.form.isGst,
    }

    if (typeof $scope.form.dp == 'object') {
      dataToSend.dp = $scope.form.dp
    }

    if ($scope.form.company != null && typeof $scope.form.company == 'object') {
      dataToSend.companypk = $scope.form.company.pk
      dataToSend.company = $scope.form.company
    } else if ($scope.form.company != null && $scope.form.company.length > 0 && $scope.form.company != 'object') {
      dataToSend.company = $scope.form.company
    }
    if ($scope.form.designation != null && $scope.form.designation.length > 0) {
      dataToSend.designation = $scope.form.designation
    }
    if ($scope.form.gstin != null && $scope.form.gstin.length > 0) {
      dataToSend.gstin = $scope.form.gstin
    }
    if ($scope.form.pk) {
      dataToSend.pk = $scope.form.pk
    }
    $http({
      method: 'POST',
      url: '/api/clientRelationships/createContact/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      $scope.form = response.data;
      if ($scope.form.company != null) {
        $scope.form.gstin = $scope.form.company.tin
        if ($scope.form.company.address) {
          $scope.form.street = $scope.form.company.address.street;
          $scope.form.city = $scope.form.company.address.city;
          $scope.form.pincode = $scope.form.company.address.pincode;
          $scope.form.state = $scope.form.company.address.state;
        }

      }
    })
  }

  $scope.$watch('form.company', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      $scope.form.gstin = $scope.form.company.tin
      if (newValue.address != null) {
        $scope.form.street = newValue.address.street;
        $scope.form.city = newValue.address.city;
        $scope.form.pincode = newValue.address.pincode;
        $scope.form.state = newValue.address.state;
      } else {
        $scope.form.street = '';
        $scope.form.city = '';
        $scope.form.pincode = '';
        $scope.form.state = '';
      }
    }
  })

  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if (newValue.length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + $scope.form.pincode
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.city = response.data[0].city;
          $scope.form.state = response.data[0].state;
          $scope.form.country = response.data[0].country;
          $scope.form.pin_status = response.data[0].pin_status;
        }
      })
    }
  })

  // $scope.save = function() {
  //   var method = 'POST';
  //   var url = '/api/clientRelationships/contact/'
  //   if ($scope.form.pk) {
  //     method = 'PATCH';
  //     url += $state.params.id + '/';
  //   }
  //   var toSend =  $scope.form;
  //   toSend.dp = null;
  //   $http({method : method , url : url , data : $scope.form}).
  //   then(function(response) {
  //     Flash.create('success' , 'Saved');
  //   })
  //
  //
  // }

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.displaySuggestion = function() {
    var input = document.getElementById('searchTextField');
    var options = {
      bounds: defaultBounds,
      types: ['establishment']
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

  }



})


app.controller('clientRelationships.crmtermsandcondition', function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal, $timeout, $rootScope, $interval) {

  $scope.placeholder = "Add a custom message here...."
  $scope.uiForm = {placeholder : "Add a custom message here....", placeholderIndx : 0}



  $interval(function() {
    $scope.uiForm.placeholder = $scope.placeholder.substring(0, $scope.uiForm.placeholderIndx);
    $scope.uiForm.placeholderIndx += 1;
    if ($scope.uiForm.placeholderIndx > $scope.placeholder.length) {
      $scope.uiForm.placeholderIndx = 0
      }
  },100)


  $scope.delete = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/clientRelationships/crmtermsAndConditions/' + $scope.allData[indx].pk + '/',
    }).
    then(function(response) {
      $scope.allData.splice(indx, 1)
    })
  }


  $scope.getSettings = function(){
    $http.get('/api/clientRelationships/invoiceSettings/').
    then(function(response) {
      console.log(response.data);
      $scope.settings = response.data
    })
  }
    $scope.getSettings()
  // $scope.form.addedPoints = []


  $scope.deletePoint = function(indx) {
    $scope.form.addedPoints.splice(indx, 1)
  }

  $scope.moveUp = function(indx, mainIndx) {
    console.log($scope.allData[mainIndx] , mainIndx);
    var row = $scope.allData[mainIndx].addedPoints[indx]
    $scope.allData[mainIndx].addedPoints.splice(indx, 1)
    $scope.allData[mainIndx].addedPoints.splice(indx - 1, 0, row)

  }

  $scope.moveDown = function(indx, mainIndx) {
    var row = $scope.allData[mainIndx].addedPoints[indx]
    $scope.allData[mainIndx].splice(indx, 1)
    $scope.allData[mainIndx].splice(indx + 1, 0, row)
  }


$scope.getAll = function(){
  $http({
    method: 'GET',
    url: '/api/clientRelationships/crmtermsAndConditions/',
  }).
  then(function(response) {
    $scope.allData = response.data
    for (var i = 0; i < $scope.allData.length; i++) {
      $scope.allData[i].addedPoints = []
      if ($scope.allData[i].body != undefined && $scope.allData[i].body != null) {
        var points = $scope.allData[i].body.split('||')
        for (var j = 0; j < points.length; j++) {
          $scope.allData[i].addedPoints.push({'txt' : points[j]})
        }

      }
    }
  }, function(error) {

  })

}

$scope.getAll()


  $scope.addtnctxt = function(txt , indx) {
  //   console.log($scope.allData[indx].addedPoints);
  // if ($scope.allData[indx].addedPoints == undefined) {
  //     $scope.allData[indx].addedPoints = []
  // }
    $scope.allData[indx].addedPoints.push({'txt' : txt})
    $scope.allData[indx].tnctxt = "";
  }
  $scope.edit = function(indx) {
    $scope.form = $scope.allData[indx]
    $scope.form.addedPoints = $scope.form.body.split('||')
    $scope.form.body = ''
    $scope.allData.splice(indx, 1)
  }
  // $scope.preview =''
  $scope.view = function(indx){
    $scope.preview = indx
  }


  $scope.removeTnc = function(indx, mainIndx) {
    $scope.allData[mainIndx].addedPoints.splice(indx, 1);
  }

  $scope.update = function(indx) {
    var formdata = $scope.allData[indx]
    if (formdata.themeColor == null ||formdata.themeColor.length == 0 ) {
      Flash.create('warning' , 'Add theme color')
      return
    }
    if (formdata.addedPoints == null ||formdata.addedPoints.length == 0 ) {
      Flash.create('warning' , 'Add terms and conditions')
      return
    }
    if (formdata.heading == null || formdata.heading.length == 0) {
      Flash.create("warning", "Add heading")
      return
    }

    formdata.finalPoints = ''
    if (formdata.addedPoints.length > 0) {
      for (var i = 0; i < formdata.addedPoints.length; i++) {
        console.log(formdata.addedPoints[i]);
        formdata.finalPoints += formdata.addedPoints[i].txt + '||'
      }
      formdata.finalPoints = formdata.finalPoints.slice(0, formdata.finalPoints.length - 2)
    } else {
      Flash.create("warning", "Add Body")
      return
    }






    // dataToSend = {
    //   title: formdata.title,
    //   version: formdata.version,
    //   body: formdata.finalPoints,
    //   heading: formdata.heading,
    //   isGst:formdata.isGst
    // }
    var fd = new FormData();

    // fd.append('title', formdata.title);
    fd.append('version', formdata.version);
    fd.append('body', formdata.finalPoints);
    fd.append('heading', formdata.heading);
    fd.append('isGst', formdata.isGst);
    fd.append('themeColor', formdata.themeColor);
    fd.append('version', formdata.version);
    if (formdata.extraFieldOne != null) {
      fd.append('extraFieldOne', formdata.extraFieldOne);
    }
    if (formdata.extraFieldTwo != null) {
      fd.append('extraFieldTwo', formdata.extraFieldTwo);
    }
    if (formdata.message != null) {
      fd.append('message', formdata.message);
    }
    if (formdata.companyPamphlet != null && formdata.companyPamphlet != emptyFile && typeof formdata.companyPamphlet != 'string') {
      fd.append('companyPamphlet', formdata.companyPamphlet);
    }
    var method = 'POST'
    var url = '/api/clientRelationships/crmtermsAndConditions/'
    if (formdata.pk) {
      var method = 'PATCH'
      var url = '/api/clientRelationships/crmtermsAndConditions/' + formdata.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create("success", 'Saved!')
      $scope.allData[indx] = response.data
      var points = $scope.allData[indx].body.split('||')
      $scope.allData[indx].addedPoints = []
      for (var j = 0; j < points.length; j++) {
        $scope.allData[indx].addedPoints.push({'txt' : points[j]})
      }
      // $scope.allData.push(response.data)
      $scope.reset()
    }, function(error) {



    })

  }

  $scope.createFormat = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.createTemplate.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        contact: function() {
          return $state.params.id;
        }
      },
      controller: 'createTemplate.controller'
    }).result.then(function() {}, function() {
      $scope.getAll()
    })
  }

})
app.controller('createTemplate.controller', function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModalInstance, $timeout, $rootScope) {

  $scope.versions = ['V1', 'V2', 'V3']
  $scope.reset = function() {
    $scope.form = {
      name: '',
      version: 'V1'
    }
  }

  $scope.reset()

  $scope.add = function() {
    if ($scope.form.body == '' || $scope.form.body.length == 0) {
      Flash.create("warning", "Add Body")
      return
    }
    $scope.form.addedPoints.push($scope.form.body)
    $scope.form.body = ''
  }
  $scope.save = function() {
    // $scope.form.finalPoints = ''
    // if ($scope.form.addedPoints.length > 0) {
    //   for (var i = 0; i < $scope.form.addedPoints.length; i++) {
    //     $scope.form.finalPoints += $scope.form.addedPoints[i] + '||'
    //   }
    //   $scope.form.finalPoints = $scope.form.finalPoints.slice(0, $scope.form.finalPoints.length - 2)
    // } else {
    //   Flash.create("warning", "Add Body")
    //   return
    // }

    if ($scope.form.name == null || $scope.form.name.length == 0) {
      Flash.create("warning", "Add title")
      return
    }


    // dataToSend = {
    //   title: $scope.form.title,
    //   version: $scope.form.version,
    //   body: $scope.form.finalPoints,
    //   heading: $scope.form.heading,
    //   isGst:$scope.form.isGst
    // }
    var fd = new FormData();

    fd.append('name', $scope.form.name);
    fd.append('version', $scope.form.version);
    fd.append('heading', 'Quotation');
    // fd.append('body', $scope.form.finalPoints);
    // fd.append('heading', $scope.form.heading);
    // fd.append('isGst', $scope.form.isGst);
    // fd.append('themeColor', $scope.form.themeColor);
    // fd.append('version', $scope.form.version);
    // if ($scope.form.extraFieldOne != null) {
    //   fd.append('extraFieldOne', $scope.form.extraFieldOne);
    // }
    // if ($scope.form.extraFieldTwo != null) {
    //   fd.append('extraFieldTwo', $scope.form.extraFieldTwo);
    // }
    // if ($scope.form.message != null) {
    //   fd.append('message', $scope.form.message);
    // }
    // if ($scope.form.companyPamphlet != null && $scope.form.companyPamphlet != emptyFile && typeof $scope.form.companyPamphlet != 'string') {
    //   fd.append('companyPamphlet', $scope.form.companyPamphlet);
    // }
    var method = 'POST'
    var url = '/api/clientRelationships/crmtermsAndConditions/'
    if ($scope.form.pk) {
      var method = 'PATCH'
      var url = '/api/clientRelationships/crmtermsAndConditions/' + $scope.form.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create("success", 'Saved!')
      $scope.reset()
      $uibModalInstance.dismiss()

    }, function(error) {



    })

  }

  $scope.deletePoint = function(indx) {
    $scope.form.addedPoints.splice(indx, 1)
  }

  $scope.moveUp = function(indx) {
    var row = $scope.form.addedPoints[indx]
    $scope.form.addedPoints.splice(indx, 1)
    $scope.form.addedPoints.splice(indx - 1, 0, row)

  }

  $scope.moveDown = function(indx) {
    var row = $scope.form.addedPoints[indx]
    $scope.form.addedPoints.splice(indx, 1)
    $scope.form.addedPoints.splice(indx + 1, 0, row)
  }

})

app.controller('businessManagement.clientRelationships.contacts.quote', function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal, $timeout, $rootScope) {

  $scope.fromDelimiter = function(txt) {
    var toReturn = []
    var array = txt.split('||');

    for (var i = 0; i < array.length; i++) {
      toReturn.push({
        txt: array[i]
      })
    }
    return toReturn;
  }




  $scope.showTerms = true
  if ($state.is('businessManagement.contacts.createquote')) {

    $scope.showTerms = false
    $scope.terms = ''
    $http({
      method: 'GET',
      url: '/api/clientRelationships/crmtermsAndConditions/' + $state.params.template + '/'
    }).
    then(function(response) {
      // $scope.tncList = response.data;

      $scope.form.tncs = $scope.fromDelimiter(response.data.body);
      $scope.form.heading = response.data.heading;
      $scope.terms = response.data
      $scope.extraFieldOne = $scope.terms.extraFieldOne
      $scope.extraFieldTwo = $scope.terms.extraFieldTwo
      if ($scope.terms.version == 'V3') {
        $scope.form.dueDate = new Date()
        $scope.form.dueDate.setDate($scope.form.dueDate.getDate() + 7);
      }
    })
  } else {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/crmtermsAndConditions/'
    }).
    then(function(response) {
      $scope.tncList = response.data;

      $scope.form.tncs = $scope.fromDelimiter($scope.tncList[0].body);
      $scope.form.heading = $scope.tncList[0].heading;
    })
  }

  $scope.addtnctxt = function(txt) {
    $scope.form.tncs.push({
      txt: txt
    });
    $scope.form.tnctxt = "";
  }

  $scope.selectTemplate = function(indx) {
    $scope.form.tncs = $scope.fromDelimiter($scope.tncList[indx].body);
    $scope.form.heading = $scope.tncList[indx].heading;
  }

  $scope.removeTnc = function(indx) {
    $scope.form.tncs.splice(indx, 1);
  }

  $scope.removeItem = function(indx) {
    $scope.contract.data.splice(indx, 1)
  }


  $scope.form = {
    desc: '',
    productMeta: '',
    qty: '',
    rate: '',
    mode: 'new',
    date: new Date(),
    extraFieldOne: '',
    extraFieldTwo: '',
    index:undefined,
  }


  $scope.editItem = function(indx) {
    var tempTerms = $scope.form.tncs
    $scope.form = $scope.contract.data[indx]
    $scope.form.qty = $scope.contract.data[indx].quantity
    $scope.form.tncs = tempTerms
    if ($scope.contract.data[indx].extraFieldOne != undefined && $scope.contract.data[indx].extraFieldOne.length > 0) {
      $scope.form.extraFieldOne = $scope.contract.data[indx].extraFieldOne
    }
    if ($scope.contract.data[indx].extraFieldTwo != undefined && $scope.contract.data[indx].extraFieldTwo.length > 0) {
      $scope.form.extraFieldTwo = $scope.contract.data[indx].extraFieldTwo
    }
    // $scope.form.desc = $scope.contract.data[indx].desc
    // $scope.form.qty = $scope.contract.data[indx].quantity
    // $scope.form.rate = $scope.contract.data[indx].rate
    // $scope.form.rate = $scope.contract.data[indx].rate
    $scope.form.index = indx
    if ($scope.contract.data[indx].taxCode.toString().length > 0) {
      $http.get('/api/ERP/productMeta/?code=' + $scope.contract.data[indx].taxCode).
      then(function(response) {
        $scope.form.productMeta = response.data[0];
      })

    }
    console.log($scope.form, '$scope.form');

    // $scope.contract.data.splice(indx, 1)
  }

  $scope.save = function() {
    var url = '/api/clientRelationships/contract/';
    var method = 'POST';

    console.log($scope.form.tncs);

    var tncsTxtArr = [];
    for (var i = 0; i < $scope.form.tncs.length; i++) {
      tncsTxtArr.push($scope.form.tncs[i].txt)
    }
    if($scope.contract.discount.length == 0){
      $scope.contract.discount = 0
    }

    var toSend = {
      contact: $scope.contact.pk,
      data: JSON.stringify($scope.contract.data),
      grandTotal: $scope.contract.grandTotal,
      value: $scope.contract.grandTotal,
      discount: $scope.contract.discount,
      termsAndConditionTxts: tncsTxtArr.join('||'),
      heading: $scope.form.heading,
    }
    if ($scope.form.dueDate != undefined && $scope.form.dueDate != null && typeof $scope.form.dueDate == 'object') {
      toSend.dueDate = $scope.form.dueDate.toJSON().split('T')[0]
    }
    if ($scope.terms != undefined && $scope.terms != null && typeof $scope.terms == 'object') {
      toSend.termsAndCondition = $scope.terms.pk
    }
    if ($state.is('businessManagement.contacts.contactQuote')) {
      toSend.tour = $state.params.tour
    }
    if ($scope.contract.pk) {
      method = 'PATCH';
      url += $scope.contract.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      if ($state.is('businessManagement.contacts.quotenew') || $state.is('businessManagement.contacts.contactQuote') || $state.is('businessManagement.contacts.createquote')) {
        $state.go('businessManagement.contacts.quote', {
          id: $scope.contact.pk,
          contract: response.data.pk
        })
      }
      $scope.getVersions()


    })

  }

  $scope.viewContract = function(indx) {
    var contractData = $scope.contractVersions[indx]
    $scope.contract.data = JSON.parse(contractData.data)
    $scope.contract.discount = contractData.discount
    $scope.contract.grandTotal = contractData.grandTotal
    $scope.contract.heading = contractData.heading
    if (contractData.termsAndConditionTxts) {
      $scope.form.tncs = $scope.fromDelimiter(contractData.termsAndConditionTxts)
    }
    $scope.contract.inWords = price_in_words($scope.contract.grandTotal)
  }

  $scope.addItem = function() {
    var desc = $scope.form.desc
    if (typeof desc == 'object') {
      desc = desc.name
    }
    var total = $scope.form.rate * $scope.form.qty;

    var item = {
      currency: "INR",
      desc: desc,
      quantity: $scope.form.qty,
      rate: $scope.form.rate,
      saleType: "Product",
      // subtotal: total + $scope.form.productMeta.taxRate*total/100   ,
      // tax: $scope.form.productMeta.taxRate,
      // taxCode: $scope.form.productMeta.code,
      total: total,
      // totalTax: $scope.form.productMeta.taxRate*total/100,
      type: "onetime",
      extraFieldOne: $scope.form.extraFieldOne,
      extraFieldTwo: $scope.form.extraFieldTwo,
    }

    if ($scope.terms != undefined && $scope.terms.isGst == false) {
      item.subtotal = total
      item.totalTax = 0
      item.tax = 0
      item.taxCode = ''
    } else if ($scope.form.productMeta != null && typeof $scope.form.productMeta == 'object') {
      item.subtotal = total + $scope.form.productMeta.taxRate * total / 100
      item.totalTax = $scope.form.productMeta.taxRate * total / 100
      item.tax = $scope.form.productMeta.taxRate
      item.taxCode = $scope.form.productMeta.code
    } else {
      item.subtotal = total
      item.totalTax = 0
      item.tax = 0
      item.taxCode = ''
    }
    console.log($scope.form.index,'$scope.form.index');
    if($scope.form.index != undefined && $scope.form.index.toString().length >0){

      $scope.contract.data[$scope.form.index] = item;
    }else{
      $scope.contract.data.push(item);
    }
    $scope.form = {
      desc: '',
      productMeta: '',
      qty: '',
      rate: '',
      mode: $scope.form.mode,
      tncs: $scope.form.tncs,
      date: new Date(),
      heading: $scope.form.heading,
      extraFieldOne: '',
      extraFieldTwo: '',
      index:undefined,
    };
    $scope.calculateTotal();
    $timeout(function() {
      $('#descEdit').focus()
    }, 200)
  }

  $scope.calculateTotal = function() {
    var total = 0
    for (var i = 0; i < $scope.contract.data.length; i++) {
      total += $scope.contract.data[i].subtotal;
    }

    $scope.contract.grandTotal = total;
    if ($scope.contract.discount.toString().length > 0) {
      $scope.contract.grandTotal -= parseFloat($scope.contract.discount);
    }

    $scope.contract.inWords = price_in_words($scope.contract.grandTotal)


  }




  $scope.inventorySearch = function(query) {
    return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  }

  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?description__icontains=' + c).
    then(function(response) {
      return response.data;
    })
  }

  $scope.getVersions = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contractTracker/?contract=' + $state.params.contract
    }).
    then(function(response) {
      $scope.contractVersions = response.data
    })
  }

  $scope.$watch('form.desc', function(newValue, oldValue) {
    if (newValue.pk) {
      $scope.form.rate = newValue.rate;
      if ( newValue.taxCode!=null&&newValue.taxCode.length>0) {
        $http.get('/api/ERP/productMeta/?code=' + newValue.taxCode).
        then(function(response) {
          $scope.form.productMeta =  response.data[0];
        })
      }
      else{
        $scope.form.productMeta = ''
      }
    }
  }, true)

  $http({
    method: 'GET',
    url: '/api/clientRelationships/invoiceSettings/'
  }).
  then(function(response) {
    $scope.settings = response.data;
  })
  $scope.contractVersions = []
  if ($state.is('businessManagement.contacts.quote')) {
    console.log("edit contract");
    // existing quote
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contract/' + $state.params.contract + '/'
    }).
    then(function(response) {
      $scope.contract = response.data;
      $scope.contract.data = JSON.parse($scope.contract.data)
      $scope.calculateTotal()
      console.log($scope.contract.data[0]);
      $scope.form.mode = 'edit';
      $scope.contract.inWords = price_in_words($scope.contract.grandTotal)
      if ($scope.contract.termsAndConditionTxts) {

        $scope.form.tncs = $scope.fromDelimiter($scope.contract.termsAndConditionTxts)
      }
      if ($scope.contract.heading) {
        $scope.form.heading = $scope.contract.heading;
      }

      if ($scope.contract.termsAndCondition) {
        $scope.terms = $scope.contract.termsAndCondition
        $scope.extraFieldOne = $scope.terms.extraFieldOne
        $scope.extraFieldTwo = $scope.terms.extraFieldTwo
        if ($scope.terms.version == 'V3') {
          $scope.form.dueDate = $scope.contract.dueDate
        }

      }
    })


    // $rootScope.$broadcast('getInvoice', {$state.params.contract})

    $scope.getVersions()
  } else if ($state.is('businessManagement.contacts.quotenew') || $state.is('businessManagement.contacts.contactQuote') || $state.is('businessManagement.contacts.createquote')) {
    console.log("new contract");
    $scope.form.mode = 'new';
    $scope.contract = {
      grandTotal: 0,
      discount: 0,
      data: []
    }

    $scope.contract.inWords = 'Zero';

  }



  $scope.editIcon = false
  $http({
    method: 'GET',
    url: '/api/clientRelationships/contact/' + $state.params.id + '/'
  }).
  then(function(response) {
    $scope.contact = response.data;
    $scope.fetchCoworkers();
  })

  $scope.fetchCoworkers = function() {
    if ($scope.contact.company == null) {
      return;
    }
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contactLite/?company=' + $scope.contact.company.pk
    }).
    then(function(response) {
      $scope.coworkers = response.data;
    })
  }

  $scope.sendViaMail = function() {
    console.log("broadcasting");
    $rootScope.$broadcast('sendInvoice', {
      contract: $state.params.contract,
      email: $scope.contact.email,
      contact: $scope.contact.pk,
      name: $scope.contact.name
    })
  }


});

app.controller('businessManagement.clientRelationships.contacts.delatils', function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal, $rootScope) {
  $scope.products = []
  $scope.openContact = function(c) {
    $state.go('.', {
      id: c.pk
    })
  }

  $scope.editIcon = false

  $http({
    method: 'GET',
    url: '/api/clientRelationships/contact/' + $state.params.id + '/'
  }).
  then(function(response) {
    $scope.contact = response.data;
    $scope.lat = parseFloat(response.data.company.address.lat)
    $scope.lon = parseFloat(response.data.company.address.lon)
    $scope.fetchContracts();
    $scope.fetchCoworkers();
  })

  $http({
    method: 'GET',
    url: '/api/clientRelationships/registeredProducts/?contact=' + $state.params.id
  }).
  then(function(response) {
    $scope.products = response.data;
  })


  $scope.picture = '/static/images/map/BruggLocationWhite2.png'
  // $scope.picture = '/static/images/map/mapmarker.png'
  $scope.zoom = 20
  $scope.map_center = {
    lat: $scope.lat,
    lng: $scope.lon
  };

  // function initMap() {
  //   var infowindow = new google.maps.InfoWindow();
  //   var map = new google.maps.Map(
  //     document.getElementById('googleMap'), {
  //       zoom: $scope.zoom,
  //       center: $scope.map_center,
  //       disableDefaultUI: true,
  //       scaleControl: true,
  //       zoomControl: true,
  //     });
  //
  //   var marker3 = new google.maps.Marker({
  //     position: {
  //       lat: $scope.lat,
  //       lng: $scope.lon
  //     },
  //     map: map,
  //     icon: {
  //       labelOrigin: new google.maps.Point(28, 30),
  //       url: $scope.picture,
  //       scaledSize: new google.maps.Size(60, 60)
  //     }
  //   })
  //   infowindow.open(map, marker3);
  //
  // }
  //
  // initMap()



  $scope.selectTemplate = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        contact: function() {
          return $state.params.id;
        }
      },
      controller: function($scope, $users, contact, $uibModalInstance) {
        $http.get('/api/clientRelationships/crmtermsAndConditions/').
        then(function(response) {
          $scope.termsConditions = response.data
          $scope.terms = response.data[0]
          $scope.terms.points = $scope.terms.body.split('||')
        })

        $scope.selectedTemplate = function(s) {
          $uibModalInstance.dismiss(s.pk)
        }
      },
    }).result.then(function() {}, function(data) {
      if (data) {
        if (typeof data == 'number') {
          $state.go('businessManagement.contacts.createquote', {
            id: $state.params.id,
            template: data
          })
        }
      }
    })
  }

  $scope.changeStatus = function(status, indx) {

    if (status == 'invoice' || status == 'saleOrder' || status == 'performa') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.clientRelationships.addTOSaleOrder.modal.html',
        size: 'md',
        backdrop: true,
        resolve: {
          contract: function() {
            return $scope.contracts[indx].pk;
          },
          dealType: function() {
            return status;
          }
        },
        controller: function($scope, $users, contract, $uibModalInstance, dealType) {
          $scope.dealType = dealType
          $scope.title = "Generate Sale Order"
          $scope.form = {
            poNumber: '',
            deliveryDate: '',
            payDueDate: '',
            account: '',
            isPerforma: false,
            isInvoice: false
          }
          if ($scope.dealType == 'invoice' || $scope.dealType == 'performa') {
            $scope.form.isInvoice = true
            $scope.title = "Generate Invoice"
            if ($scope.dealType == 'performa') {
              $scope.form.isPerforma = true
              $scope.title = "Generate Performa"
            }
          }

          $scope.assetsAccounts = []
          $scope.getCurrentAccounts = function() {
            $http({
              method: 'GET',
              url: '/api/finance/accountLite/?personal=false&heading=income',
            }).
            then(function(response) {
              $scope.assetsAccounts = response.data
            })
          }

          $scope.getCurrentAccounts()


          $scope.addToSale = function() {
            if ($scope.form.poNumber.length == 0 || $scope.form.account.length == 0) {
              Flash.create('warning', 'All details are required')
              return
            }
            var dataToSend = {
              'invoicePk': contract,
              'poNumber': $scope.form.poNumber,
              'isInvoice': $scope.form.isInvoice,
              'isPerforma': $scope.form.isPerforma
            }
            // if (typeof $scope.form.deliveryDate == 'object') {
            //   dataToSend.deliveryDate = $scope.form.deliveryDate.toJSON().split('T')[0]
            // }
            // if (typeof $scope.form.payDueDate == 'object') {
            //   dataToSend.payDueDate = $scope.form.payDueDate.toJSON().split('T')[0]
            // }
            if (typeof $scope.form.account == 'object') {
              dataToSend.account = $scope.form.account.pk
            }
            $http({
              method: 'POST',
              url: '/api/finance/outbondInvoiceDetails/',
              data: dataToSend
            }).
            then(function(res) {
              Flash.create('success', 'Sale Order Generated')
              $uibModalInstance.dismiss(res.data)
            })
          }
        },
      }).result.then(function() {}, function(data) {
        if (data.pk) {
          $scope.contracts[indx].status = 'approved';
        }
      })


    } else {
      $http({
        method: 'PATCH',
        url: '/api/clientRelationships/contract/' + $scope.contracts[indx].pk + '/',
        data: {
          status: status
        }
      }).
      then(function(response) {
        $scope.contracts[indx].status = response.data.status;
      })

    }


  }

  $scope.editQuote = function(contract) {
    $state.go('businessManagement.contacts.quote', {
      id: $scope.contact.pk,
      contract: contract.pk
    })
  }

  $scope.disableNext = false;
  $scope.pageNo = 0;

  $scope.nextPage = function() {
    if ($scope.disableNext) {
      return;
    }
    $scope.pageNo += 1;
    $scope.retriveTimeline();
  }

  $scope.prevPage = function() {
    if ($scope.pageNo == 0) {
      return;
    }
    $scope.pageNo -= 1;
    $scope.retriveTimeline();
  }

  $scope.noteEditor = {
    text: '',
    doc: emptyFile
  };
  $scope.timelineItems = [];

  $scope.retriveTimeline = function() {
    console.log($scope.pageNo, 'aaaaaaaa');
    $http({
      method: 'GET',
      url: '/api/clientRelationships/activity/?contact=' + $scope.contact.pk + '&limit=5&offset=' + $scope.pageNo * 5
    }).
    then(function(response) {
      $scope.timelineItems = response.data.results;
      if ($scope.timelineItems.length == 0 && $scope.pageNo != 0) {
        $scope.prevPage();
      }
      $scope.disableNext = response.data.next == null;
      $scope.analyzeTimeline();
    })
  }

  $scope.analyzeTimeline = function() {
    for (var i = 0; i < $scope.timelineItems.length; i++) {
      $scope.timelineItems[i].created = new Date($scope.timelineItems[i].created);
      if (i < $scope.timelineItems.length - 1 && $scope.timelineItems[i].created.getMonth() != new Date($scope.timelineItems[i + 1].created).getMonth()) {
        $scope.timelineItems[i + 1].newMonth = true;
      }
    }
  }

  $scope.addProduct = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.addProduct.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        contact: function() {
          return $state.params.id;
        }
      },
      controller: 'businessManagement.clientRelationships.addProduct.modal',
    }).result.then(function() {}, function(data) {
      if (data.pk) {
        $scope.products.push(data)
      }
    })
  }

  $scope.editAMCProduct = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.addProduct.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        contact: function() {
          return data;
        }
      },
      controller: 'businessManagement.clientRelationships.addProduct.modal',
    }).result.then(function() {}, function(data) {
      if (data.pk) {
        $scope.products.push(data)
      }
    })
  }

  $scope.saveNote = function() {
    console.log("will save");

    var fd = new FormData();
    fd.append('typ', 'note');
    fd.append('data', $scope.noteEditor.text);
    fd.append('contact', $scope.contact.pk);

    if ($scope.noteEditor.doc != emptyFile) {
      fd.append('doc', $scope.noteEditor.doc);
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      Flash.create('success', 'Saved');
      $scope.noteEditor.text = '';
      $scope.noteEditor.doc = emptyFile;
    })
  }

  $scope.sortedFeeds = [{
      type: 'note'
    },
    {
      type: 'call'
    },
    {
      type: 'meeting'
    },
    {
      type: 'mail'
    },
    {
      type: 'todo'
    },
  ]


  $scope.fetchCoworkers = function() {
    if ($scope.contact.company == null) {
      return;
    }
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contactLite/?company=' + $scope.contact.company.pk
    }).
    then(function(response) {
      $scope.coworkers = response.data;
    })
  }

  $scope.exploreContact = function(c) {
    $scope.$emit('exploreContact', {
      contact: c
    });
  }


  $scope.$watch('contact', function(newValue, oldValue) {
    if (newValue != undefined || newValue != null) {
      $scope.retriveTimeline();
    }
  })

  $scope.fetchContracts = function() {

    var query = ''

    $http({
      method: 'GET',
      url: '/api/clientRelationships/contract/?contact=' + $scope.contact.pk + query
    }).
    then(function(response) {
      if (response.data.length > 0) {
        $scope.contracts = response.data
      }
    });
  }

  $scope.call = function() {
    $rootScope.$broadcast("call", {
      type: 'call',
      number: $scope.contact.mobile,
      source: 'campaign',
      id: $scope.data.pk
    });
  }



})

app.controller('businessManagement.contact.form.quick', function($scope, user, $users, $uibModalInstance, $http, Flash, helpText) {

  $scope.helpText = helpText;

  if (typeof user == 'object') {
    $scope.form = {
      user: user.name,
      company: '',
      showMore: false,
      street: '',
      pincode: '',
      city: '',
      state: '',
      addresspk: null,
      male: true,
      tin: '',
      email: user.email,
      mobile: ''
    };
  } else {
    $scope.form = {
      user: user,
      company: '',
      showMore: false,
      street: '',
      pincode: '',
      city: '',
      state: '',
      addresspk: null,
      male: true,
      tin: '',
      email: '',
      mobile: ''
    };
  }

  $scope.toggleShowMore = function() {
    $scope.form.showMore = !$scope.form.showMore;
  }

  if (typeof user == 'object' && user.pk) {
    $scope.form = {
      user: user.name,
      company: user.company,
      showMore: false,
      addresspk: null,
      male: true,
      email: user.email,
      mobile: user.mobile,
      pk: user.pk
    };
  }

  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if (newValue.length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + newValue
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.city = response.data[0].city;
          $scope.form.state = response.data[0].state;
          $scope.form.country = response.data[0].country;
        } else {
          $scope.form.city = '';
          $scope.form.state = '';
          $scope.form.country = '';
        }
      })
    } else {
      $scope.form.city = '';
      $scope.form.state = '';
      $scope.form.country = '';

    }

  })

  $scope.$watch('form.company', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      $scope.form.tin = newValue.tin;
      $scope.form.street = newValue.address.street;
      $scope.form.state = newValue.address.state;
      $scope.form.city = newValue.address.city;
      $scope.form.pincode = newValue.address.pincode + '';
      $scope.form.country = newValue.address.country;
    }

  })

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.me = $users.get('mySelf')

  $scope.save = function() {
    if ($scope.form.user.length == 0) {
      Flash.create('warning', 'Please enter the name of the customer')
      return;
    }

    if ($scope.form.street == '') {
      Flash.create('warning', 'Street is required')
      return;
    }


    if ($scope.form.street.length > 0 && $scope.form.pincode.length != 6) {
      Flash.create('warning', 'Pincode is required since you entered Street')
      return;
    }

    if ($scope.form.city.length == '' || $scope.form.state.length == '' || $scope.form.country.length == '') {
      Flash.create('warning', 'City, State and Country are required')
      return;
    }

    var f = $scope.form;
    if ($scope.form.street.length > 0) {

      var method = 'POST';
      var url = '/api/ERP/address/'

      if ($scope.form.company.address != null) {
        method = 'PATCH';
        url += $scope.form.company.address.pk + '/'
      }

      $http({
        method: method,
        url: url,
        data: {
          street: f.street,
          city: f.city,
          pincode: f.pincode,
          state: f.pincode,
          country: f.country
        }
      }).
      then(function(response) {
        $scope.form.addresspk = response.data.pk;
        $scope.saveCompany()
      })
      return;
    }

    $scope.saveCompany()
  }


  $scope.close = function() {
    $uibModalInstance.close()
  }

  $scope.saveCompany = function() {
    var cname = $scope.form.company



    if (cname == undefined || cname.length == 0) {
      $scope.saveContact()
      return;
    }


    var method = 'POST';
    var url = '/api/ERP/service/';

    if (typeof cname == 'object') {
      method = 'PATCH';
      url += cname.pk + '/'
    }

    var dataToSend = {
      address: $scope.form.addresspk,
      user: $scope.me.pk,
      tin: $scope.form.tin
    }

    if (method == 'POST') {
      dataToSend.name = cname
    }

    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.form.company = response.data;
      $scope.saveContact()
    })

  }

  $scope.saveContact = function() {
    var dataToSend = {
      name: $scope.form.user,
      male: $scope.form.male
    }
    if (typeof $scope.form.company == 'object') {
      dataToSend.company = $scope.form.company.pk;
    }

    if ($scope.form.email.length > 0) {
      dataToSend.email = $scope.form.email;
    }
    if ($scope.form.mobile != null && $scope.form.mobile.length > 0) {
      dataToSend.mobile = $scope.form.mobile;
    }

    var method = 'POST';
    var url = '/api/clientRelationships/contact/';

    if ($scope.form.pk) {
      method = 'PATCH';
      url += $scope.form.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Created')
      $uibModalInstance.dismiss(response.data)
    })
  }



})


app.controller('businessManagement.clientRelationships.addProduct.modal', function($scope, $http, $uibModalInstance, contact, Flash) {

  if (typeof contact != 'object') {
    $scope.form = {
      'productName': '',
      // 'addon' : '',
      'period': 'Quaterly',
      'contact': contact,
      'totalServices': 1,
      'serialNo': '',
      'notes': '',
      'seperateAddress': false,
      'address': '',
      'pincode': '',
      'startDate': new Date()
    }
  } else {
    $scope.form = contact
  }

  $scope.period = ['Yearly', 'Quaterly', 'Half Yearly']

  $scope.changeAsset = function() {
    $scope.allAddons = $scope.form.asset.addons
  }

  $scope.addProd = function() {

    if ($scope.form.totalServices == 0) {
      Flash.create('warning', 'Add valid total services')
      return
    }
    // if ($scope.form.serialNo.length == 0) {
    //   Flash.create('warning', 'Add valid Serial Number')
    //   return
    // }
    // if ($scope.form.qty == 0) {
    //   Flash.create('warning', 'Add valid qunatity')
    //   return
    // }
    var dataToSend = {
      productName: $scope.form.productName,
      period: $scope.form.period,
      contact: $scope.form.contact,
      totalServices: $scope.form.totalServices,
      // serialNo: $scope.form.serialNo,
      // qty: $scope.form.qty,
      seperateAddress: $scope.form.seperateAddress,
      // serviceFor: $scope.form.serviceFor.stateAlias,
      startDate: $scope.form.startDate.toJSON().split('T')[0]
    }
    if ($scope.form.pk != undefined) {
      dataToSend.id = $scope.form.pk
    }
    if ($scope.form.seperateAddress == true) {
      if ($scope.form.address.length > 0) {
        dataToSend.address = $scope.form.address
      } else {
        Flash.create('warning', 'Address is required')
        return
      }
      if (typeof $scope.form.pincode=='object') {
        dataToSend.pincode = $scope.form.pincode.pincode
        dataToSend.city = $scope.form.pincode.city
        dataToSend.state = $scope.form.pincode.state
        dataToSend.country = $scope.form.pincode.country
      } else {
        Flash.create('warning', 'Pincode is required')
        return
      }
    }
    if ($scope.form.serialNo!= null) {
      dataToSend.serialNo = $scope.form.serialNo
    }
    if ($scope.form.notes!= null) {
      dataToSend.notes = $scope.form.notes
    }
    $http({
      method: 'POST',
      url: '/api/clientRelationships/addProduct/',
      data: dataToSend
    }).
    then(function(response) {
      $uibModalInstance.dismiss(response.data)
    })
  }

  $scope.pinSearch = function(query) {
    return $http.get('/api/ERP/genericPincode/?limit=10&pincode__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

})


app.controller('businessManagement.clientRelationships.selectAttachments', function($scope, $http, $uibModalInstance) {
  $scope.query = "";
  $scope.added = [];
  $scope.add = function(f) {
    for (var i = 0; i < $scope.added.length; i++) {
      if ($scope.added[i].pk == f.pk) {
        return;
      }
    }
    $scope.added.push(f)
  }
  $scope.remove = function(indx) {
    $scope.added.splice(indx, 1)
  }
  $scope.page = 0;

  $scope.fetchFiles = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/files/?limit=10&title__icontains=' + $scope.query + '&offset=' + $scope.page * 10
    }).
    then(function(response) {
      $scope.files = response.data.results;
    })
  }

  $scope.fetchFiles();

  $scope.next = function() {
    $scope.page += 1;
    $scope.fetchFiles();
  }

  $scope.prev = function() {
    if ($scope.page != 0) {
      $scope.page -= 1;
      $scope.fetchFiles();
    }
  }



  $scope.close = function(t) {
    $uibModalInstance.close($scope.added)
  }

})

app.controller('businessManagement.clientRelationships.templatePicker', function($scope, $http, $uibModalInstance, $sce) {
  $scope.query = "";

  $http({
    method: 'GET',
    url: '/api/clientRelationships/emailTemplate/?title__icontains=' + $scope.query
  }).
  then(function(response) {
    $scope.templates = response.data;

    for (var i = 0; i < $scope.templates.length; i++) {
      $scope.templates[i].htmltemplate = $sce.trustAsHtml($scope.templates[i].template)
    }


  })

  $scope.selectTemplate = function(t) {
    $uibModalInstance.dismiss(t)
  }

})


app.controller("businessManagement.clientRelationships.default", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $uibModal, $aside, $rootScope, $window) {
  // fetch the mail id credentials and change the password
  $scope.me = $users.get('mySelf');

  $http({
    method: 'GET',
    url: '/api/clientRelationships/crmtermsAndConditions/'
  }).
  then(function(response) {
    $scope.allTermsandCon = response.data

  })

  $timeout(function() {
    $('#contactSearchEdit').focus();
  }, 200)

  $scope.$watch('customer', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      $state.go('businessManagement.contacts.delatils', {
        id: newValue.pk
      })
    }
  })

  $scope.openInvoice = function(d) {
    $state.go('businessManagement.contacts.quote', {
      id: d.contact__pk,
      contract: d.pk
    })
  }

  $http({
    method: 'GET',
    url: '/api/clientRelationships/chartData/'
  }).
  then(function(response) {
    $scope.chartData = response.data;
  })


  $scope.options = {
    scaleFontColor: "#8A96A4",
    legend: {
      display: true
    },
    scales: {
      yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };


  $http({
    method: 'GET',
    url: '/api/mail/account/?user=' + $scope.me.pk
  }).
  then(function(response) {
    $scope.mailAccount = response.data[0]
    if ($scope.mailAccount.passKey == "123" || $scope.mailAccount.passKey == null || $scope.mailAccount.passKey == undefined || $scope.mailAccount.passKey == "") {
      $scope.mailAccount.passKey = ""
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.clientRelationships.changePassword.modal.html',
        size: 'sm',
        backdrop: true,
        resolve: {
          mailAccount: function() {
            return $scope.mailAccount;
          }
        },
        controller: function($scope, $users, mailAccount, $uibModalInstance) {
          $scope.mailAccount = mailAccount;
          $scope.save = function() {
            $http({
              method: 'PATCH',
              url: '/api/mail/account/' + $scope.mailAccount.pk + '/',
              data: $scope.mailAccount
            }).
            then(function(response) {
              $uibModalInstance.dismiss()
            })
          }
          $scope.dismiss = function() {
            $uibModalInstance.dismiss();
          }
        },
      })
    }
  })



  var date = new Date();

  $scope.filterData = {

    frm: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  $scope.customerSearch = function(query) {
    return $http.get('/api/clientRelationships/contact/?limit=10&search=' + query).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.typ = "quoted"

  // $http({method : 'GET' , url : '/api/clientRelationships/clientHomeCal/'}).
  // then(function(response) {
  //   console.log('resssssssssss',response.data);
  //   $scope.clrHomeData = response.data
  //   if ($scope.clrHomeData.currencyTyp == 'INR') {
  //   $scope.currSymbol = 'inr';
  // }else if ($scope.clrHomeData.currencyTyp == 'USD') {
  //     $scope.currSymbol = 'usd';
  //   }else if ($scope.clrHomeData.currencyTyp == 'GBP') {
  //     $scope.currSymbol = 'gbp';
  //   }else if ($scope.clrHomeData.currencyTyp == 'EUR') {
  //     $scope.currSymbol = 'eur';
  //   }else if ($scope.clrHomeData.currencyTyp == 'AUD') {
  //     $scope.currSymbol = 'aud';
  //   }else {
  //     $scope.currSymbol = '';
  //   }
  // })
  $scope.customer = ''
  $scope.showfilter = false;

  $scope.filter = function(download) {
    var toDate = new Date($scope.filterData.to.getFullYear(), $scope.filterData.to.getMonth(), $scope.filterData.to.getDate() + 2);
    console.log(toDate, 'llllll');
    // toDate.setDate(toDate.getDate() + 1);

    var url = '/api/clientRelationships/clientHomeCal/?frm=' + $scope.filterData.frm.toJSON().split('T')[0] + '&to=' + toDate.toJSON().split('T')[0]
    if ($scope.typ != undefined) {
      url = url + '&typ=' + $scope.typ
    }
    if ($scope.filterData.tandc != null && typeof $scope.filterData.tandc == 'object') {
      url = url + '&tandc=' + $scope.filterData.tandc.pk
    }
    // if ($scope.customer!='') {
    //   url = url+'&customer='+$scope.customer.pk
    // }
    if (download) {
      $window.open(url + '&download', '_blank');
    } else {
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.clrHomeData = response.data
        if ($scope.clrHomeData.currencyTyp == 'INR') {
          $scope.currSymbol = 'inr';
        } else if ($scope.clrHomeData.currencyTyp == 'USD') {
          $scope.currSymbol = 'usd';
        } else if ($scope.clrHomeData.currencyTyp == 'GBP') {
          $scope.currSymbol = 'gbp';
        } else if ($scope.clrHomeData.currencyTyp == 'EUR') {
          $scope.currSymbol = 'eur';
        } else if ($scope.clrHomeData.currencyTyp == 'AUD') {
          $scope.currSymbol = 'aud';
        } else {
          $scope.currSymbol = '';
        }
      })
    }
  }

  $scope.filter()

  $scope.valConfig = {
    type: 'funnel',
    data: {
      datasets: [{
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#16a085",
          "#af6a10",
          "#FFB424",
          "#2980b9",
          "#27ae60",
          "#795F99"
        ],
        hoverBackgroundColor: [
          "#16a085",
          "#af6a10",
          "#FFB424",
          "#2980b9",
          "#27ae60",
          "#795F99"
        ]
      }],
      labels: [
        "Contacting",
        "Demo/POC",
        "Requirements",
        "Proposal",
        "Negotiation",
        "Conclusion"
      ]
    },
    options: {
      responsive: true,
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sales pipeline'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };

  $scope.countConf = JSON.parse(JSON.stringify($scope.valConfig))




  $scope.$watch('dealGraph', function(newValue, oldValue) {
    if (newValue) {
      $scope.showtyp = 'count'
    } else {
      $scope.showtyp = 'val'
    }
  });

  $http({
    method: 'GET',
    url: '/api/clientRelationships/teamMembersStats/'
  }).
  then(function(response) {
    $scope.form.teamData = response.data;
  })


  $timeout(function() {
    $scope.valConfig.data.datasets[0].data = $scope.clrHomeData.sumLi
    $scope.countConf.data.datasets[0].data = $scope.clrHomeData.countLi
    var valG = document.getElementById("chart-areaVal").getContext("2d");
    var countG = document.getElementById("chart-areaCount").getContext("2d");
    window.myDoughnut1 = new Chart(valG, $scope.valConfig);
    window.myDoughnut2 = new Chart(countG, $scope.countConf);
    $scope.dealGraph = false
    selectGaguge1 = new Gauge(document.getElementById("select-1"));
    selectGaguge1.maxValue = $scope.clrHomeData.target;
    selectGaguge1.set($scope.clrHomeData.complete);
  }, 1000);





  $scope.form = {
    usrSearch: '',
    contacts: []
  }


  $scope.searchContacts = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contact/?name__icontains=' + $scope.form.usrSearch + '&limit=4'
    }).
    then(function(response) {
      $scope.form.contacts = response.data.results;
    })
  }

  $scope.changeStatusContract = function(status, indx, pk, mode) {
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/contract/' + pk + '/',
      data: {
        status: status
      }
    }).then((function(mode, indx, status) {
      return function(response) {
        if (mode == 'quotation') {
          $scope.clrHomeData.quotedQuote.splice(indx, 1)
        } else if (mode == 'invoice') {
          $scope.clrHomeData.billedQuote.splice(indx, 1)
        } else {
          $scope.clrHomeData.dueElapsedQuote.splice(indx, 1)
        }
      }
    })(mode, indx, status))
  }

  $scope.edit = function(pkVal) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.editTask.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        pkVal: function() {
          return pkVal;
        }
      },
      controller: function($scope, $users, pkVal, $uibModalInstance) {

        $http({
          method: 'GET',
          url: '/api/PIM/calendar/' + pkVal
        }).
        then(function(response) {
          $scope.form = response.data

        })

        $scope.saveTask = function() {
          if ($scope.form.text.length == 0) {
            Flash.create('warning', 'Details can not be empty')
          }

          var crmUsers = [];
          for (var i = 0; i < $scope.form.clients.length; i++) {
            crmUsers.push($scope.form.clients[i].pk);
          }

          var dataToSend = {
            when: $scope.form.when,
            text: $scope.form.text,
          }
          if (crmUsers.length != 0) {
            dataToSend.clients = crmUsers;
          }

          $http({
            method: 'PATCH',
            url: '/api/PIM/calendar/' + $scope.form.pk + '/',
            data: dataToSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
            $scope.form = response.data
          });
        }


      },
    })

  }



  $scope.changeStatus = function(pkVal, indx, typ) {
    $http({
      method: 'PATCH',
      url: '/api/PIM/calendar/' + pkVal + '/',
      data: {
        completed: true
      }
    }).
    then(function() {
      Flash.create('success', 'Marked as Completed')
      if (typ == 'unCompletedTasks') {
        $scope.clrHomeData.unCompletedTasks.splice(indx, 1)
      }
      if (typ == 'todayTasks') {
        $scope.clrHomeData.todayTasks[indx].completed = true
      }
      if (typ == 'todayTasks') {
        $scope.clrHomeData.tomorrowTasks[indx].completed = true
      }
    })
  }

  $scope.searchContacts();

  $scope.call = function(data) {

    $rootScope.$broadcast("call", {
      type: 'call',
      number: $scope.mobile,
      source: 'campaign',
      id: $scope.data.pk
    });

    // $uibModal.open({
    //   templateUrl: '/static/ngTemplates/app.clientRelationships.call.modal.html',
    //   size: 'md',
    //   backdrop: true,
    //   resolve: {
    //     mobile: function() {
    //       return data.mobile;
    //     }
    //   },
    //   controller: function($scope, $users , mobile , $uibModalInstance) {
    //     $scope.mobile = mobile;
    //     $scope.mode = 'calling';
    //     $scope.me = $users.get('mySelf');
    //     connection.session.publish('service.self.'+ $scope.me.username , ['call' , $scope.mobile], {}, {acknowledge: true}).
    //     then(function (publication) {
    //       $scope.mode = 'incall';
    //     });
    //
    //     $scope.endCall = function() {
    //       connection.session.publish('service.self.'+ $scope.me.username , ['endcall'], {}, {acknowledge: true}).
    //       then(function (publication) {
    //         $scope.mode = 'ended';
    //         $uibModalInstance.dismiss();
    //       });
    //     }
    //
    //   },
    // })
  }



  $scope.changeStatus = function(status, indx) {

    if (status == 'invoice' || status == 'saleOrder' || status == 'performa') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.clientRelationships.addTOSaleOrder.modal.html',
        size: 'md',
        backdrop: true,
        resolve: {
          contract: function() {
            return $scope.clrHomeData.quotedQuote[indx].pk;
          },
          dealType: function() {
            return status;
          }
        },
        controller: function($scope, $users, contract, $uibModalInstance, dealType) {
          $scope.dealType = dealType
          $scope.title = "Generate Sale Order"
          $scope.form = {
            poNumber: '',
            deliveryDate: '',
            payDueDate: '',
            account: '',
            isPerforma: false,
            isInvoice: false
          }
          if ($scope.dealType == 'invoice' || $scope.dealType == 'performa') {
            $scope.form.isInvoice = true
            $scope.title = "Generate Invoice"
            if ($scope.dealType == 'performa') {
              $scope.form.isPerforma = true
              $scope.title = "Generate Performa"
            }
          }

          $scope.assetsAccounts = []
          $scope.getCurrentAccounts = function() {
            $http({
              method: 'GET',
              url: '/api/finance/accountLite/?personal=false&heading=income',
            }).
            then(function(response) {
              $scope.assetsAccounts = response.data
            })
          }

          $scope.getCurrentAccounts()


          $scope.addToSale = function() {
            if ($scope.form.poNumber.length == 0 || $scope.form.account.length == 0) {
              Flash.create('warning', 'All details are required')
              return
            }
            var dataToSend = {
              'invoicePk': contract,
              'poNumber': $scope.form.poNumber,
              'isInvoice': $scope.form.isInvoice,
              'isPerforma': $scope.form.isPerforma
            }
            // if (typeof $scope.form.deliveryDate == 'object') {
            //   dataToSend.deliveryDate = $scope.form.deliveryDate.toJSON().split('T')[0]
            // }
            // if (typeof $scope.form.payDueDate == 'object') {
            //   dataToSend.payDueDate = $scope.form.payDueDate.toJSON().split('T')[0]
            // }
            if (typeof $scope.form.account == 'object') {
              dataToSend.account = $scope.form.account.pk
            }
            $http({
              method: 'POST',
              url: '/api/finance/outbondInvoiceDetails/',
              data: dataToSend
            }).
            then(function(res) {
              Flash.create('success', 'Sale Order Generated')
              $uibModalInstance.dismiss(res.data)
            })
          }
        },
      }).result.then(function() {}, function(data) {
        if (data.pk) {
          $scope.clrHomeData.quotedQuote.splice(indx, 1)
        }
      })


    } else {
      $http({
        method: 'PATCH',
        url: '/api/clientRelationships/contract/' + $scope.clrHomeData.quotedQuote[indx].pk + '/',
        data: {
          status: status
        }
      }).
      then(function(response) {
        $scope.clrHomeData.quotedQuote.splice(indx, 1)
      })

    }


  }

  $scope.sms = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.message.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        mobile: function() {
          return data.mobile;
        },
        name: function() {
          return data.name;
        }
      },
      controller: function($scope, mobile, name, $uibModalInstance, $timeout) {
        $scope.mobile = mobile;
        $scope.name = name;
        $scope.mode = 'writing';
        $scope.form = {
          text: 'Hi ' + name.split(' ')[0] + ' '
        };

        $scope.me = $users.get('mySelf');

        $scope.sendSMS = function() {
          connection.session.publish('service.self.' + $scope.me.username, ['sms', $scope.mobile, $scope.form.text], {}, {
            acknowledge: true
          }).
          then(function(publication) {
            $scope.mode = 'sent';
            $timeout(function() {
              $uibModalInstance.dismiss();
            }, 3000)

          });
        }

      },
    })
  }

  $scope.email = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.email.modal.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return data;
        }
      },
      controller: function($scope, data) {
        $scope.data = data;
        $scope.resetEmailForm = function() {
          $scope.form = {
            cc: [],
            emailBody: '',
            emailSubject: '',
            added: []
          };
        }

        $scope.resetEmailForm();

        $scope.sendto = ''
        $scope.sendcc = ''
        $scope.sendEmail = function() {
          var count = 0
          var cc = []
          for (var i = 0; i < $scope.form.cc.length; i++) {
            $http({
              method: 'GET',
              url: '/api/HR/userSearch/' + $scope.form.cc[i]
            }).
            then(function(response) {
              count += 1
              $scope.tempCC = response.data.email + ','
              $scope.sendcc = $scope.sendcc + $scope.tempCC
              if (count == $scope.form.cc.length) {
                $scope.sendcc = $scope.sendcc.slice(0, -1);
                $scope.sendto = ''
                $scope.tempTo = $scope.data.email
                $scope.sendto = $scope.tempTo
                $scope.attachmentTemplates = ''
                if ($scope.form.added != null) {
                  for (var i = 0; i < $scope.form.added.length; i++) {
                    console.log($scope.form.added[i].pk);
                    $scope.tempTemplate = $scope.form.added[i].pk + ','
                    $scope.attachmentTemplates = $scope.attachmentTemplates + $scope.tempTemplate
                  }
                  $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
                }
                toSend = {
                  to: $scope.sendto,
                  cc: $scope.sendcc,
                  subject: $scope.form.emailSubject,
                  body: $scope.form.emailBody,
                  attachmentTemplates: $scope.attachmentTemplates
                }
                $http({
                  method: 'POST',
                  url: '/api/mail/send/',
                  data: toSend
                }).
                then(function() {
                  Flash.create('success', 'Email sent successfully');
                  var data = {
                    "subject": $scope.form.emailSubject
                  }
                  var finalData = JSON.stringify(data)
                  var dataToSend = {
                    typ: 'mail',
                    contact: $scope.data.pk,
                    notes: $scope.form.emailBody,
                    data: finalData,
                  };
                  $http({
                    method: 'POST',
                    url: '/api/clientRelationships/activity/',
                    data: dataToSend
                  }).
                  then(function(response) {
                    $scope.resetEmailForm();
                  })

                })
              }
            })
          }

        }
        $scope.tinymceOptions = {
          selector: 'textarea',
          content_css: '/static/css/bootstrap.min.css',
          inline: false,
          plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
          skin: 'lightgray',
          theme: 'modern',
          height: 300,
          menubar: false,
          statusbar: false,
          toolbar: 'templates attach | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline ',
          setup: function(editor) {
            editor.addButton('templates', {
              text: 'Templates',
              icon: false,
              onclick: function() {

                $uibModal.open({
                  templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
                  size: 'lg',
                  backdrop: true,
                  resolve: {

                  },
                  controller: 'businessManagement.clientRelationships.templatePicker',
                }).result.then(function() {

                }, function(t) {
                  $scope.form.emailBody = t.template.replace('{{name}}');
                })

              }
            });

            editor.addButton('attach', {
              text: 'Attachments',
              icon: false,
              onclick: function() {

                $uibModal.open({
                  templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
                  size: 'md',
                  backdrop: true,
                  resolve: {

                  },
                  controller: 'businessManagement.clientRelationships.selectAttachments'

                }).result.then(function(files) {
                  for (var i = 0; i < files.length; i++) {
                    for (var j = 0; j < $scope.form.added.length; j++) {
                      if ($scope.form.added[j].pk == files[i].pk) {
                        continue;
                      }
                    }
                    $scope.form.added.push(files[i])
                  }

                }, function() {


                })

              }
            });
          },
        };

        $scope.resetEmailForm = function() {
          $scope.form = {
            emailBody: '',
            cc: [],
            emailSubject: '',
            added: []
          }
        }

        $scope.resetEmailForm();

      },
    })
  }

  $scope.getContact = function(contactPk) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.contact.explore.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        contact: function() {
          return contactPk;
        },
      },
      backdrop: false,
      controller: 'businessManagement.clientRelationships.contacts.exploreModal'
    }).result.then(function(rea) {}, function(dis) {})
  }

  $scope.getInvoice = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.createInvoice.html',
      placement: 'right',
      size: 'xl',
      // resolve: {
      //   contact : function() {
      //     return contactPk;
      //   },
      // },
      backdrop: true,
      controller: 'businessManagement.controller.createQuotation'
    }).result.then(function(rea) {}, function(dis) {})
  }
  // $scope.getInvoice()
})

app.controller("businessManagement.controller.createQuotation", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $rootScope, $window) {

  var imgVal = '/static/images/drawing-2111.svg'

})
app.directive('companyField', function() {
  return {
    templateUrl: '/static/ngTemplates/companyInputField.html',
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
    },
    controller: function($scope, $state, $http, Flash) {
      $scope.companySearch = function(query) {
        return $http.get('/api/ERP/service/?name__icontains=' + query).
        then(function(response) {
          return response.data;
        })
      };
    },
  };
});


app.directive('clientsField', function() {
  return {
    templateUrl: '/static/ngTemplates/clientsInputField.html',
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      url: '@',
      col: '@',
      label: '@',
      company: '='
    },
    controller: function($scope, $state, $http, Flash, $uibModal) {
      $scope.d = {
        user: undefined,
        showCreateContact: false,
      };
      if (typeof $scope.col != 'undefined') {
        $scope.showResults = true;
      } else {
        $scope.showResults = false;
      }
      $scope.$watch('company', function(newValue, oldValue) {
        if (typeof $scope.company == 'undefined') {
          $scope.companySearch = '';
        } else {
          $scope.companySearch = '&company=' + $scope.company;
        }
      });

      $scope.$watch('d.user', function(newValue, oldValue) {
        if (typeof newValue == 'string') {
          $scope.d.showCreateContact = true;
        } else {
          $scope.d.showCreateContact = false;
        }
      });



      // $scope.user = undefined;
      $scope.userSearch = function(query) {
        return $http.get($scope.url + '?name__icontains=' + query + $scope.companySearch).
        then(function(response) {
          return response.data;
        })
      };

      $scope.removeUser = function(index) {
        $scope.data.splice(index, 1);
      }

      $scope.addUser = function() {
        for (var i = 0; i < $scope.data.length; i++) {
          if ($scope.data[i].pk == $scope.d.user.pk) {
            Flash.create('danger', 'User already a member of this group')
            return;
          }
        }
        if (typeof $scope.d.user == 'string') {
          Flash.create('warning', 'Please search / create and add a client')
          return;
        }
        $scope.data.push($scope.d.user);
        $scope.d.user = undefined;
      }

      $scope.createNewClient = function() {

        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.clientRelationships.contact.form.quick.html',
          size: 'md',
          backdrop: false,
          resolve: {
            user: function() {
              return $scope.d.user;
            },
            helpText: function() {
              return null
            }

          },
          controller: 'businessManagement.contact.form.quick'
        }).result.then(function(d) {

        }, function(d) {
          $scope.d.user = d;
          $scope.addUser();
        });


      }





    },
  };
});


app.directive('crmNote', function() {
  return {
    templateUrl: '/static/ngTemplates/app.clientRelationships.noteBubble.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      onDelete: '&',
    },
    controller: function($scope, $http, $timeout, $users, $aside, $interval, $window) {

    },
  };
});

app.directive('crmCall', function() {
  return {
    templateUrl: '/static/ngTemplates/app.clientRelationships.callBubble.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      onDelete: '&',
    },
    controller: function($scope, $http, $timeout, $users, $aside, $interval, $window, $sce) {
      $scope.data.notesHtml = $sce.trustAsHtml($scope.data.notes);
      var parsedData = JSON.parse($scope.data.data);
      $scope.data.duration = parsedData.duration;
    },
  };
});

app.directive('crmMeeting', function() {
  return {
    templateUrl: '/static/ngTemplates/app.clientRelationships.meetingBubble.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      onDelete: '&',
    },
    controller: function($scope, $http, $timeout, $users, $aside, $interval, $window, $sce) {
      $scope.data.notesHtml = $sce.trustAsHtml($scope.data.notes);
      var parsedData = JSON.parse($scope.data.data);
      $scope.data.location = parsedData.location;
      $scope.data.duration = parsedData.duration;
    },
  };
});

app.directive('crmMail', function() {
  return {
    templateUrl: '/static/ngTemplates/app.clientRelationships.emailBubble.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      onDelete: '&',
    },
    controller: function($scope, $http, $timeout, $users, $aside, $interval, $window, $sce) {
      $scope.data.subject = JSON.parse($scope.data.data).subject;
      $scope.data.notesHtml = $sce.trustAsHtml($scope.data.notes);
    },
  };
});




app.directive('crmTodo', function() {
  return {
    templateUrl: '/static/ngTemplates/app.clientRelationships.todoBubble.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data: '=',
      onDelete: '&',
    },
    controller: function($scope, $http, $timeout, $users, $aside, $interval, $window) {

    },
  };
});

var crmRelationTypes = ['onetime', 'request', 'day', 'hour', 'monthly', 'yearly', 'user']

app.controller("businessManagement.clientRelationships.opportunities.quote", function($scope, $state, $users, $stateParams, $http, Flash, $uibModalInstance, deal, contact, $uibModal, mailer, $timeout) {

  $scope.contact = contact
  $scope.deal = deal
  $scope.mailer = mailer;

  $scope.getEmailAddressSuggestions = function(query) {
    return $http.get('/api/ERP/application/?name__icontains=' + query)
  }


  $scope.mailEditor = {
    to: [],
    cc: [],
    subject: '',
    added: [],
    body: '',
    terms: ''
  }
  if ($scope.deal.contacts != undefined && $scope.deal.contacts.length > 0) {
    for (var i = 0; i < $scope.deal.contacts.length; i++) {
      if ($scope.deal.contacts[i].email != null) {
        $scope.mailEditor.to.push($scope.deal.contacts[i].email)
      }
    }
  } else {

  }

  if ($scope.contact != null && typeof $scope.contact == 'object' && $scope.contact.pk && $scope.contact.email) {
    $scope.mailEditor.to.push($scope.contact.email)
  }

  $scope.quotemode = 'createOpportunity'

  if ($scope.contact != null && typeof $scope.contact == 'object' && $scope.contact.pk) {
    $scope.quotemode = 'contact'
  }

  if (typeof $scope.deal.pk == 'number' && $scope.deal.pk != '') {
    $scope.mailEditor.subject = "Quotation for " + $scope.deal.name
    $scope.quotemode = 'deal'
  } else {
    $scope.mailEditor.subject = "Quotation"
  }

  console.log("quotemode : ", $scope.quotemode);

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar: false,
    statusbar: false,
    toolbar: 'templates attach | numlist | alignleft aligncenter alignright alignjustify | outdent  indent | bold italic underline',
    setup: function(editor) {
      editor.addButton('templates', {
        text: 'Templates',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
            size: 'lg',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.templatePicker',
          }).result.then(function() {

          }, function(t) {
            if ($scope.deal.contacts.length > 0) {
              t.template = t.template.replace('{{name}}', $scope.deal.contacts[0].name)
            } else if ($scope.contact && $scope.contact.name) {
              t.template = t.template.replace('{{name}}', $scope.contact.name)
            }
            $scope.mailEditor.body = t.template;
          })


        }
      });

      $scope.removeMailAttachment = function(indx) {
        $scope.mailEditor.added.splice(indx, 1)
      }

      editor.addButton('attach', {
        text: 'Attachments',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
            size: 'md',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.selectAttachments',
          }).result.then(function(files) {
            for (var i = 0; i < files.length; i++) {
              for (var j = 0; j < $scope.mailEditor.added.length; j++) {
                if ($scope.mailEditor.added[j].pk == files[i].pk) {
                  continue;
                }
              }
              $scope.mailEditor.added.push(files[i])
            }
          }, function() {

          })
        }
      });
    },
  };

  $scope.discount = [{
    'title': 'none',
    'percentage': 0
  }]
  $scope.coupon = $scope.discount[0]
  $http({
    method: 'GET',
    url: '/api/clientRelationships/coupon/'
  }).
  then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.discount.push(response.data[i])
    }
  })


  $scope.$watch('form.desc', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      if (newValue.productMeta != null) {
        $scope.form.productMeta = newValue.productMeta;
      }

      $scope.form.rate = newValue.rate;
      $scope.form.desc = newValue.name;

    }
  })

  $scope.inventorySearch = function(query) {
    return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.terms = {}

  $http.get('/api/clientRelationships/termsAndConditions/').
  then(function(response) {
    $scope.termsConditions = response.data
    $scope.terms = response.data[0]
    $scope.terms.points = $scope.terms.body.split('||')
  })


  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?description__icontains=' + c).
    then(function(response) {
      return response.data;
    })
  }

  $scope.$watch('terms', function(newValue, oldValue) {
    $scope.terms.points = $scope.terms.body.split('||')
  })

  $scope.emailBody = ""
  $scope.firstQuote = true;

  $scope.deal = deal;
  $scope.data = [];

  console.log($scope.deal);


  $scope.$watch('form.productMeta', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      if (newValue.typ == 'SAC') {
        $scope.form.productMeta.saleType = 'Service'
      } else {
        $scope.form.productMeta.saleType = 'Product'
      }
      $scope.showTaxCodeDetails = true;
    } else {
      $scope.showTaxCodeDetails = false;
    }
  })

  // $scope.terms={
  //   points:[],
  // }
  if ($scope.deal && $scope.deal.contracts.length > 0) {
    $scope.contract = $scope.deal.contracts[0]
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contract/' + $scope.deal.contracts[0] + '/'
    }).
    then(function(response) {
      $scope.data = JSON.parse(response.data.data);
      if (response.data.termsAndCondition != undefined) {
        $scope.terms = response.data.termsAndCondition
      } else {
        $scope.terms = response.data[0]
      }
      $timeout(function() {
        if (response.data.coupon) {
          for (var i = 0; i < $scope.discount.length; i++) {
            if ($scope.discount[i].pk == response.data.coupon) {
              $scope.coupon = $scope.discount[i]
            }
          }
        } else {
          $scope.coupon = $scope.discount[0]
        }

      }, 500)
      $scope.mailEditor.added = JSON.parse(response.data.files);
      $scope.mailEditor.subject = response.data.subject;
      $scope.mailEditor.body = response.data.mailBody;
      if (response.data.to != null) {
        $scope.mailEditor.to = response.data.to.split(',')
      }
      if (response.data.cc != null) {
        $scope.mailEditor.cc = response.data.cc.split(',')
      }
    });
  }
  $scope.types = crmRelationTypes;
  $scope.currency = ['INR', 'USD']

  if ($scope.deal.pk != '') {
    $scope.selectedCurrency = $scope.deal.currency
  } else {
    $scope.selectedCurrency = 'INR'
  }


  $scope.resetForm = function() {
    $scope.form = {
      currency: $scope.selectedCurrency,
      type: 'onetime',
      quantity: 1,
      tax: 0,
      rate: 0,
      desc: ''
    };
  }

  $scope.setCurrency = function(cur) {
    $scope.form.currency = cur;
  }

  $scope.setType = function(typ) {
    $scope.form.type = typ;
  }
  $scope.cancel = function(e) {
    $uibModalInstance.dismiss($scope.contract);
  };

  $scope.remove = function(idx) {
    $scope.data.splice(idx, 1);
  }

  $scope.edit = function(idx) {
    var d = $scope.data[idx];
    $scope.form = {
      currency: d.currency,
      type: d.type,
      quantity: d.quantity,
      tax: d.tax,
      rate: d.rate,
      desc: d.desc,
    };
    $http.get('/api/ERP/productMeta/?code=' + d.taxCode).
    then(function(response) {
      $scope.form.productMeta = response.data[0]
    })
    $scope.data.splice(idx, 1);
  }

  $scope.calculateTotal = function() {
    var total = 0;
    var totalTax = 0;
    var grandTotal = 0;
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.data[i].total = parseInt($scope.data[i].quantity) * parseInt($scope.data[i].rate);
      $scope.data[i].totalTax = $scope.data[i].total * parseInt($scope.data[i].tax) / 100;
      $scope.data[i].subtotal = $scope.data[i].totalTax + $scope.data[i].total;
      total += $scope.data[i].total;
      totalTax += $scope.data[i].totalTax;
      grandTotal += $scope.data[i].subtotal;
    }
    $scope.totalTax = totalTax;
    $scope.total = total;
    $scope.grandTotal = grandTotal;
    $scope.discountRate = 0
    if ($scope.coupon.pk != undefined) {
      $scope.discountRate = $scope.grandTotal * $scope.coupon.percentage / 100
      $scope.finalAmount = $scope.grandTotal - $scope.discountRate
    } else {
      $scope.discountRate = 0
      $scope.finalAmount = 0
    }
    $scope.deal.calculated = {
      value: total,
      tax: totalTax,
      grand: grandTotal
    }
  }

  $scope.send = function() {
    $scope.me = $users.get('mySelf');
    console.log($scope.deal);
    // send the pk of the contract object and returns mails/models.py - mailAttachment object
    if ($scope.deal.contracts.length > 0) {
      var url = '/api/clientRelationships/sendEmailAttach/?contract=' + $scope.deal.contracts[0]
    } else {
      var url = '/api/clientRelationships/sendEmailAttach/?contract=' + $scope.contract
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.mailObj = response.data
      $scope.sendto = ''
      for (var i = 0; i < $scope.mailEditor.to.length; i++) {
        if ($scope.mailEditor.to[i]['email'] == undefined) {
          $scope.tempTo = $scope.mailEditor.to[i] + ","
        } else {
          $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
        }
        $scope.sendto = $scope.sendto + ',' + $scope.tempTo
        $scope.sendto = $scope.sendto.slice(0, -1);
      }

      $scope.sendcc = ''
      for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
        if ($scope.mailEditor.cc[i]['email'] == undefined) {
          $scope.tempCC = $scope.mailEditor.cc[i] + ","
        } else {
          $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
        }
        $scope.sendcc = $scope.sendcc + $scope.tempCC
        $scope.sendcc = $scope.sendcc.slice(0, -1);
      }
      $scope.attachmentTemplates = ''
      if ($scope.mailEditor.added != null) {
        for (var i = 0; i < $scope.mailEditor.added.length; i++) {
          console.log($scope.mailEditor.added[i].pk);
          $scope.tempTemplate = $scope.mailEditor.added[i].pk + ','
          $scope.attachmentTemplates = $scope.attachmentTemplates + $scope.tempTemplate
        }
        $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
      }
      if ($scope.mailEditor.body == null || $scope.mailEditor.body == '') {
        Flash.create("warning", "Add Body Message")
        return
      }

      dataSend = {
        attachments: $scope.mailObj.pk.toString(),
        to: $scope.sendto,
        subject: $scope.mailEditor.subject,
        body: $scope.mailEditor.body,
        attachmentTemplates: $scope.attachmentTemplates
      }
      if ($scope.sendcc != "") {
        dataSend.cc = $scope.sendcc;
      }
      Flash.create("success", "Please wait!... Sending mail")
      $http({
        method: 'POST',
        url: '/api/mail/send/',
        data: dataSend
      }).
      then(function(response) {
        var data = {
          "subject": $scope.mailEditor.subject
        }
        var finalData = JSON.stringify(data)
        var dataToSend = {
          typ: 'mail',
          internalUsers: [$scope.me.pk],
          notes: $scope.mailEditor.body,
          data: finalData,
        };
        if ($scope.quotemode == 'deal') {
          dataToSend.deal = $scope.deal.pk
        } else {
          dataToSend.contact = $scope.contact.pk
        }
        var externals = []
        for (var i = 0; i < $scope.deal.contacts.length; i++) {
          externals.push($scope.deal.contacts[i].pk);
        }
        if (externals.length != 0) {
          dataToSend.contacts = externals;
        }
        $http({
          method: 'POST',
          url: '/api/clientRelationships/activity/',
          data: dataToSend
        }).
        then(function(response) {
          Flash.create("success", "Successfully Sent!")
          $uibModalInstance.dismiss()
        }, function(err) {
          Flash.create("danger", "Error Occured while Saving!")
          return
        })
      }).then(function(err) {
        Flash.create("danger", "Error Occured while Sending!")
        return

      })
    })
  }

  console.log($scope);

  $scope.dismiss = function() {
    $uibModalInstance.close();
  }



  $scope.save = function() {
    var url = '/api/clientRelationships/contract/'
    var method = 'POST';
    if ($scope.deal.contracts.length > 0) {
      method = 'PATCH';
      url += $scope.deal.contracts[0] + '/'
    } else if ($scope.contract != undefined) {
      method = 'PATCH';
      url += $scope.contract + '/'
    }
    $scope.to = ''
    for (var i = 0; i < $scope.mailEditor.to.length; i++) {
      if ($scope.mailEditor.to[i]['email'] == undefined) {
        $scope.tempTo = $scope.mailEditor.to[i] + ","
      } else {
        $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
      }
      $scope.to = $scope.to + $scope.tempTo
      $scope.to = $scope.to.slice(0, -1);
    }
    $scope.cc = ''
    for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
      if ($scope.mailEditor.cc[i]['email'] == undefined) {
        $scope.tempCC = $scope.mailEditor.cc[i] + ","
      } else {
        $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
      }
      $scope.cc = $scope.cc + $scope.tempCC
      $scope.cc = $scope.cc.slice(0, -1);
    }
    var dataToSend = {
      data: JSON.stringify($scope.data),
      value: parseInt($scope.grandTotal),
      files: JSON.stringify($scope.mailEditor.added)
    };

    if ($scope.mailEditor.subject != "") {
      dataToSend.subject = $scope.mailEditor.subject
    }
    if ($scope.to != "") {
      dataToSend.to = $scope.to;
    }
    if ($scope.cc != "") {
      dataToSend.cc = $scope.cc;
    }
    if ($scope.mailEditor.body != "") {
      dataToSend.mailBody = $scope.mailEditor.body;
    }

    if (method == 'POST') {
      if ($scope.deal.pk) {
        dataToSend.deal = $scope.deal.pk;
      } else {
        dataToSend.contact = $scope.contact.pk;
      }
    }

    dataToSend.termsAndCondition = $scope.terms.pk;

    if ($scope.coupon.pk != undefined) {
      dataToSend.coupon = $scope.coupon.pk;
    } else {
      dataToSend.coupon = ''
    }

    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.contract = response.data.pk
      console.log($scope.contract, "contract id");
      if ($scope.deal.contracts.length == 0) {
        $scope.deal.contracts.push(response.data.pk);
      }
      $scope.resetForm();
      $uibModalInstance.dismiss(response.data.pk);
      Flash.create("success", "Successfully Saved!")
    })

  }

  $scope.add = function() {
    if ($scope.form.tax > 70) {
      Flash.create('warning', 'The tax rate is unrealistic');
      return;
    }
    if (typeof $scope.form.productMeta != 'object') {
      Flash.create('warning', 'Select Product/Service class');
      return;
    }
    $scope.calculateTotal();
    $scope.total = parseInt($scope.form.quantity) * parseInt($scope.form.rate);
    $scope.totalTax = $scope.total * parseInt($scope.form.productMeta.taxRate) / 100;
    $scope.subtotal = $scope.totalTax + $scope.total;
    $scope.data.push({
      currency: $scope.form.currency,
      type: $scope.form.type,
      tax: $scope.form.productMeta.taxRate,
      desc: $scope.form.desc,
      rate: $scope.form.rate,
      quantity: $scope.form.quantity,
      taxCode: $scope.form.productMeta.code,
      totalTax: $scope.totalTax,
      subtotal: $scope.subtotal,
      saleType: $scope.form.productMeta.saleType,

    })
    var url = '/api/clientRelationships/contract/'
    var method = 'POST';
    if ($scope.deal.contracts.length > 0) {
      method = 'PATCH';
      url += $scope.deal.contracts[0] + '/'
    } else if ($scope.contract != undefined) {
      method = 'PATCH';
      url += $scope.contract + '/'
    }
    $scope.to = ''
    for (var i = 0; i < $scope.mailEditor.to.length; i++) {
      if ($scope.mailEditor.to[i]['email'] == undefined) {
        $scope.tempTo = $scope.mailEditor.to[i] + ","
      } else {
        $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
      }
      $scope.to = $scope.to + $scope.tempTo
      $scope.to = $scope.to.slice(0, -1);
    }
    $scope.cc = ''
    for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
      if ($scope.mailEditor.cc[i]['email'] == undefined) {
        $scope.tempCC = $scope.mailEditor.cc[i] + ","
      } else {
        $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
      }
      $scope.cc = $scope.cc + $scope.tempCC
      $scope.cc = $scope.cc.slice(0, -1);
    }
    var dataToSend = {
      data: JSON.stringify($scope.data),
      value: parseInt($scope.grandTotal),
      files: JSON.stringify($scope.mailEditor.added)
    };

    if ($scope.mailEditor.subject != "") {
      dataToSend.subject = $scope.mailEditor.subject
    }
    if ($scope.to != "") {
      dataToSend.to = $scope.to;
    }
    if ($scope.cc != "") {
      dataToSend.cc = $scope.cc;
    }
    if ($scope.mailEditor.body != "") {
      dataToSend.mailBody = $scope.mailEditor.body;
    }

    if (method == 'POST') {
      if ($scope.deal.pk) {
        dataToSend.deal = $scope.deal.pk;
      } else {
        dataToSend.contact = $scope.contact.pk;
      }
    }

    dataToSend.termsAndCondition = $scope.terms.pk;

    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.contract = response.data.pk
      console.log($scope.contract, "contract id");
      if ($scope.deal.contracts.length == 0) {
        $scope.deal.contracts.push(response.data.pk);
      }
      $scope.resetForm();
    })
  }

  $scope.resetForm();
  $scope.$watch('data', function(newValue, oldValue) {

    $scope.calculateTotal();

  }, true)


  $scope.downloadInvoice = function() {
    if ($scope.deal.contracts.length > 0) {
      window.location.href = "/api/clientRelationships/downloadInvoice/?contract=" + $scope.deal.contracts[0]
    } else {
      window.location.href = "/api/clientRelationships/downloadInvoice/?contract=" + $scope.contract
    }
  }



  $scope.$watch('coupon', function(newValue, oldValue) {
    $scope.calculateTotal()
  })


});

app.controller("businessManagement.clientRelationships.opportunities.created", function($scope, $state, $users, $stateParams, $http, Flash) {

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.clientRelationships.deal.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/clientRelationships/deal/',
    searchField: 'name',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
    drills: [{
      icon: 'fa fa-bars',
      name: 'Limit search',
      btnClass: 'default',
      options: [{
          key: 'created',
          value: true
        },
        {
          key: 'won',
          value: false
        },
        {
          key: 'lost',
          value: false
        },
      ]
    }, ]
  }


  $scope.tableAction = function(target, action, mode) {

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'exploreDeal') {
          $scope.$emit('exploreDeal', {
            deal: $scope.data.tableData[i]
          });
        }
      }
    }

  }

});


app.controller("businessManagement.clientRelationships.opportunities.explore", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $timeout, $rootScope, $aside) {

  $scope.disableNext = false;
  $scope.pageNo = 0;
  $scope.sms = {
    text: '',
    include: [],
    selectAll: false,
    preventUnselect: false
  }
  $scope.form = {}

  $scope.$watch('sms.selectAll', function(newValue, oldValue) {
    if ($scope.sms.preventUnselect && !newValue) {
      $scope.sms.preventUnselect = false;
      return;
    }
    for (var i = 0; i < $scope.sms.include.length; i++) {
      $scope.sms.include[i] = newValue;
    }
    if (newValue) {
      $scope.sms.preventUnselect = false;
    }
  })

  $scope.$watch('sms.include', function(newValue, oldValue) {
    for (var i = 0; i < $scope.sms.include.length; i++) {
      if ($scope.sms.include[i] == false) {
        $scope.sms.selectAll = false;
        $scope.sms.preventUnselect = true;
        return;
      }
    }
    $scope.sms.selectAll = true;
  }, true)

  $scope.sendSMS = function() {
    if ($scope.sms.text == '') {
      Flash.create('danger', 'No text to send');
      return;
    }
    for (var i = 0; i < $scope.deal.contacts.length; i++) {
      if ($scope.deal.contacts[i].mobile != null && $scope.deal.contacts[i].mobile != undefined && $scope.sms.include[i]) {
        var cleanedNumber = $scope.deal.contacts[i].mobile;

        var numb = cleanedNumber.match(/\d/g);
        cleanedNumber = numb = numb.join("");

        if (cleanedNumber.length == 11 && cleanedNumber[0] == '0') {
          clientRelationships = clientRelationships.substring(1, 11)
        } else if (cleanedNumber.substring(0, 2) == '91') {
          clientRelationships = clientRelationships.substring(2)
        }

        $http({
          method: 'POST',
          url: '/api/ERP/sendSMS/',
          data: {
            text: $scope.sms.text,
            number: cleanedNumber
          }
        }).
        then(function(response) {
          $scope.sms.text = '';
          Flash.create('success', 'Sent');
        });
      }
    }
  }

  $scope.changeStatus = function() {
    var dealData = $scope.deal
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.addProject.form.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        deal: function() {
          return $scope.deal.pk;
        }
      },
      controller: 'businessManagement.clientRelationships.controller.addProject'
    }).result.then(function(dealResult) {
      dealData.result = dealResult;
      $scope.deal = dealData
      $rootScope.$broadcast('dealUpdated', {
        deal: $scope.deal
      });
    }, function() {})
  }

  $scope.getContact = function(contactPk) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.contact.explore.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        contact: function() {
          return contactPk;
        },
      },
      backdrop: false,
      controller: 'businessManagement.clientRelationships.contacts.exploreModal'
    }).result.then(function(rea) {}, function(dis) {})
  }

  $scope.viewDetails = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunities.viewDetails.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        dealPk: function() {
          return $scope.deal.pk;
        },
      },
      backdrop: false,
      controller: 'businessManagement.clientRelationships.opportunities.viewDetails'
    }).result.then(function(rea) {}, function(dis) {})
  }

  $scope.addAggrement = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.aggrement.html',
      placement: 'right',
      size: 'xl',
      backdrop: false,
      resolve: {
        deal: function() {
          return $scope.deal.pk;
        }
      },
      controller: 'businessManagement.clientRelationships.controller.aggrement'
    }).result.then(function() {}, function() {})
  }

  // $scope.editQuote = function(contract){
  //   $state.go('businessManagement.contacts.quote' , {id : $scope.contact.pk , contract : contract.pk })
  // }


  $scope.editDeal = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.editDeal.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        deal: function() {
          return $scope.deal;
        }
      },
      controller: function($scope, deal) {
        $scope.deal = deal;

        $timeout(function() {
          $scope.deal.probability += 0.1;
        }, 1000);
        $scope.setCurrency = function(curr) {
          $scope.deal.currency = curr;
        }

      },
    }).result.then(function() {

    }, function() {
      var deal = $scope.deal;
      var dataToSend = {
        name: deal.name,
        probability: deal.probability,
        requirements: deal.requirements,
        closeDate: deal.closeDate,
        currency: deal.currency,
        value: deal.value
      }

      var crmUsers = []
      for (var i = 0; i < deal.contacts.length; i++) {
        crmUsers.push(deal.contacts[i].pk)
      }

      if (crmUsers.length != 0) {
        dataToSend.contacts = crmUsers;
      } else {
        Flash.create('warning', 'At least one contact is required');
        return;
      }

      if (deal.internalUsers.length != 0) {
        dataToSend.internalUsers = deal.internalUsers;
      }

      $http({
        method: 'PATCH',
        url: '/api/clientRelationships/deal/' + $scope.deal.pk + '/',
        data: dataToSend
      }).
      then(function(response) {
        $rootScope.$broadcast('dealUpdated', {
          deal: response.data
        });
      });

    });
  }

  $scope.cloneDeal = function() {
    $rootScope.$broadcast('cloneDeal', {
      deal: $scope.deal
    });
  }


  $scope.sortedFeeds = [{
      type: 'note'
    },
    {
      type: 'call'
    },
    {
      type: 'meeting'
    },
    {
      type: 'mail'
    },
    {
      type: 'todo'
    },
  ]

  $scope.noteEditor = {
    text: '',
    doc: emptyFile
  };

  $scope.concludeDeal = function(state) {
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + $scope.deal.pk + '/',
      data: {
        result: state
      }
    }).
    then(function(response) {
      $scope.processDealResponse(response.data);
      $rootScope.$broadcast('dealUpdated', {
        deal: response.data
      });

    })
  }


  $scope.saveActivityLog = function() {
    var dataToSend = {
      when: $scope.logger.when,
      deal: $scope.deal.pk
    };
    var internals = []
    for (var i = 0; i < $scope.logger.internalUsers.length; i++) {
      $scope.logger.internalUsers[i]
      internals.push($scope.logger.internalUsers[i]);
    }

    if (internals.length != 0) {
      dataToSend.internalUsers = internals;
    }

    var externals = []
    for (var i = 0; i < $scope.logger.withinCRMUsers.length; i++) {
      externals.push($scope.logger.withinCRMUsers[i].pk);
    }

    if (externals.length != 0) {
      dataToSend.contacts = externals;
    }
    var activityData;
    if ($scope.logger.activityType == 'Email') {
      dataToSend.typ = 'mail';
      if ($scope.logger.subject.length == 0) {
        Flash.create('warning', 'Subject can not be left blank');
        return;
      }
      activityData = {
        subject: $scope.logger.subject
      };
    } else if ($scope.logger.activityType == 'Meeting') {
      dataToSend.typ = 'meeting';
      activityData = {
        duration: $scope.logger.duration,
        location: $scope.logger.location
      };
    } else if ($scope.logger.activityType == 'Call') {
      dataToSend.typ = 'call';
      activityData = {
        duration: $scope.logger.duration
      }
    }
    dataToSend.data = JSON.stringify(activityData);

    if ($scope.logger.comment != '') {
      dataToSend.notes = $scope.logger.comment;
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      $scope.resetLogger();
      Flash.create('success', 'Saved');
    }, function(err) {
      Flash.create('danger', 'Error');
    })

  }

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar: false,
    statusbar: false,
    toolbar: 'templates attach | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline ',
    setup: function(editor) {
      editor.addButton('templates', {
        text: 'Templates',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
            size: 'lg',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.templatePicker',
          }).result.then(function() {

          }, function(t) {
            if ($scope.deal.contacts.length > 0) {
              t.template = t.template.replace('{{name}}', $scope.deal.contacts[0].name)
            }
            $scope.form.emailBody = t.template;
          })

        }
      });

      editor.addButton('attach', {
        text: 'Attachments',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
            size: 'md',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.selectAttachments'

          }).result.then(function(files) {
            for (var i = 0; i < files.length; i++) {
              for (var j = 0; j < $scope.form.added.length; j++) {
                if ($scope.form.added[j].pk == files[i].pk) {
                  continue;
                }
              }
              $scope.form.added.push(files[i])
            }

          }, function() {


          })

        }
      });
    },
  };

  $scope.removeMailAttachment = function(indx) {
    $scope.form.added.splice(indx, 1)
  }

  $scope.quote = function() {
    console.log("will create a quote");
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      backdrop: false,
      size: 'xl',
      resolve: {
        deal: function() {
          return $scope.deal;
        },
        contact: function() {
          return {
            pk: '',
            company: {}
          };
        },
        mailer: function() {
          return false
        },
      },
      controller: 'businessManagement.clientRelationships.opportunities.quote'
    }).result.then(function(rea) {
      $scope.retriveTimeline()
    }, function(dis) {
      $scope.retriveTimeline()
    })
  }

  $scope.editQuote = function(data) {
    console.log("will create a quote");
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      backdrop: false,
      size: 'xl',
      resolve: {
        contract: function() {
          return data;
        },
        mailer: function() {
          return false
        },
      },
      controller: 'businessManagement.clientRelationships.opportunities.quoteEdit'
    }).result.then(function(rea) {
      $scope.retriveTimeline()
    }, function(dis) {
      $scope.retriveTimeline()
    })
  }

  $scope.tabs = [{
      name: 'Timeline',
      active: true,
      icon: 'th-large'
    },
    {
      name: 'Activity',
      active: false,
      icon: 'plus'
    },
    {
      name: 'Quotations / Files',
      active: false,
      icon: 'envelope-o'
    }
  ]

  $scope.resetTaskEditor = function() {
    var dummyDate = new Date()
    $scope.taskEditor = {
      otherCRMUsers: [],
      details: ''
    };
    $scope.taskEditor.when = new Date(dummyDate.getFullYear(), dummyDate.getMonth(), dummyDate.getDate(), 23, 59, 59); // 2013-07-30 23:59:59
  }

  $scope.resetTaskEditor();

  $scope.resetLogger = function() {
    $scope.logger = {
      when: new Date(),
      where: '',
      subject: '',
      duration: 10,
      comment: '',
      internalUsers: [],
      withinCRMUsers: [],
      location: '',
      withinCRM: '',
      activityType: 'Email'
    };
  }

  $scope.resetLogger();

  $scope.local = {
    activeTab: 0,
    minInfo: true
  };

  if ($.cookie("minInfo") == undefined) {
    $scope.local.minInfo = false;
  } else {
    $scope.local.minInfo = $.cookie("minInfo");
  }

  $scope.resetEventScheduler = function() {
    $scope.eventScheduler = {
      internalUsers: [],
      when: new Date(),
      details: '',
      otherCRMUsers: [],
      venue: ''
    }
  }

  $scope.saveEvent = function() {

    if ($scope.eventScheduler.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [];
    for (var i = 0; i < $scope.eventScheduler.otherCRMUsers.length; i++) {
      crmUsers.push($scope.eventScheduler.otherCRMUsers[i].pk);
    }

    var internalUsers = [];
    for (var i = 0; i < $scope.eventScheduler.internalUsers.length; i++) {
      internalUsers.push($scope.eventScheduler.internalUsers[i]);
    }

    var dataToSend = {
      when: $scope.eventScheduler.when,
      text: $scope.eventScheduler.details,
      eventType: 'Meeting',
      originator: 'CRM',
      venue: $scope.eventScheduler.venue,
      data: JSON.stringify({
        deal: $scope.deal.pk
      })
    }

    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    if (internalUsers.length != 0) {
      dataToSend.followers = internalUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetEventScheduler();
    });
  }


  $scope.markComplete = function(pk) {
    for (var i = 0; i < $scope.calendar.length; i++) {
      if ($scope.calendar[i].pk == pk) {
        $scope.calendar[i].completed = true;
        $http({
          method: 'PATCH',
          url: '/api/PIM/calendar/' + pk + '/',
          data: {
            completed: true
          }
        }).
        then(function(response) {
          Flash.create('success', 'Updated');
        }, function(err) {
          Flash.create('danger', 'Error while updating');
        })
      }
    }
  }

  $scope.resetEventScheduler();

  $scope.toggleInfoLevel = function() {
    $scope.local.minInfo = !$scope.local.minInfo;
    $.cookie("minInfo", $scope.local.minInfo);
  }

  $scope.fetchCalendarEnteries = function() {
    $http({
      method: 'GET',
      url: '/api/PIM/calendar/?originator=CRM&data__contains=' + JSON.stringify({
        deal: $scope.deal.pk
      })
    }).
    then(function(response) {

      $scope.calendar = response.data;


      for (var i = 0; i < $scope.calendar.length; i++) {
        $scope.calendar[i].when = new Date($scope.calendar[i].when);
        $scope.calendar[i].newDate = false;
        if (i < $scope.calendar.length - 1) {
          if ($scope.calendar[i].when.toDateString() != new Date($scope.calendar[i + 1].when).toDateString()) {
            $scope.calendar[i].newDate = true;
            if ($scope.calendar[i].when.toDateString() == new Date().toDateString()) {
              $scope.calendar[i].today = true;
            }
          }
        }
      }
    })
  }

  $scope.moveToNextStage = function() {
    var state = $scope.crmSteps[$scope.deal.state + 1].text;
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + $scope.deal.pk + '/',
      data: {
        state: state
      }
    }).
    then(function(response) {
      $scope.deal.state += 1;
      $rootScope.$broadcast('dealUpdated', {
        deal: response.data
      });
    })
  }

  $scope.statusType = ['won', 'loss']

  $scope.updateStatus = function(status) {
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + $scope.deal.pk + '/',
      data: {
        result: status
      }
    }).
    then(function(response) {
      Flash.create('success', 'Updated');
      $scope.deal.result = status;
      $rootScope.$broadcast('dealUpdated', {
        deal: response.data
      });
    })
  }

  $scope.exploreContact = function(c) {
    $scope.$emit('exploreContact', {
      contact: c
    });
  }

  $scope.nextPage = function() {
    if ($scope.disableNext) {
      return;
    }
    $scope.pageNo += 1;
    $scope.retriveTimeline();
  }

  $scope.prevPage = function() {
    if ($scope.pageNo == 0) {
      return;
    }
    $scope.pageNo -= 1;
    $scope.retriveTimeline();
  }

  $scope.timelineItems = [];

  $scope.saveTask = function() {
    if ($scope.taskEditor.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [];
    for (var i = 0; i < $scope.taskEditor.otherCRMUsers.length; i++) {
      crmUsers.push($scope.taskEditor.otherCRMUsers[i].pk);
    }

    var dataToSend = {
      when: $scope.taskEditor.when,
      text: $scope.taskEditor.details,
      eventType: 'Reminder',
      originator: 'CRM',
      data: JSON.stringify({
        deal: $scope.deal.pk
      })
    }
    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetTaskEditor();
    });
  }


  $scope.retriveTimeline = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/activity/?deal=' + $scope.deal.pk + '&limit=5&offset=' + $scope.pageNo * 5
    }).
    then(function(response) {
      $scope.timelineItems = response.data.results;
      if ($scope.timelineItems.length == 0 && $scope.pageNo != 0) {
        $scope.prevPage();
      }
      $scope.disableNext = response.data.next == null;
      $scope.analyzeTimeline();
    })
  }

  $scope.analyzeTimeline = function() {
    for (var i = 0; i < $scope.timelineItems.length; i++) {
      $scope.timelineItems[i].created = new Date($scope.timelineItems[i].created);
      if (i < $scope.timelineItems.length - 1 && $scope.timelineItems[i].created.getMonth() != new Date($scope.timelineItems[i + 1].created).getMonth()) {
        $scope.timelineItems[i + 1].newMonth = true;
      }
    }
  }


  $http({
    method: 'GET',
    url: '/api/clientRelationships/getBoardOptions/?allDeal='
  }).
  then(function(response) {
    $scope.crmSteps = response.data
    $scope.data = {
      steps: $scope.crmSteps
    }
  })


  // $scope.data = {
  //   steps: crmSteps
  // }

  $scope.processDealResponse = function(data) {
    $scope.deal = data;
    // console.log(data);
    for (var i = 0; i < $scope.data.steps.length; i++) {
      if ($scope.data.steps[i].text == data.state) {
        $scope.deal.state = i;
        break;
      }
    }
    if (typeof $scope.deal.state == 'string') {
      if ($scope.deal.state == 'created') {
        $scope.deal.state = -1;
      } else {
        $scope.deal.state = 0;
      }
    }
    if ($scope.deal.result == 'won' && $scope.deal.state == 5) {
      $scope.deal.state += 1;
    }

    $scope.retriveTimeline();
    $scope.fetchCalendarEnteries();

    for (var i = 0; i < $scope.deal.contacts.length; i++) {
      $scope.sms.include.push(false)
    }


  }

  $scope.fetchDeal = function() {

    $http({
      method: 'GET',
      url: '/api/clientRelationships/deal/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.processDealResponse(response.data);
      $http({
        method: 'GET',
        url: '/api/clientRelationships/contract/?deal=' + $state.params.id
      }).
      then(function(response) {
        $scope.deal.contracts = response.data;
      });
    });


  }

  $scope.fetchDeal();

  $scope.saveNote = function() {

    var fd = new FormData();
    fd.append('typ', 'note');
    fd.append('data', $scope.noteEditor.text);
    fd.append('deal', $scope.deal.pk);

    if ($scope.noteEditor.doc != emptyFile) {
      fd.append('doc', $scope.noteEditor.doc);
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      Flash.create('success', 'Saved');
      $scope.noteEditor.text = '';
      $scope.noteEditor.doc = emptyFile;
    })
  }

  $scope.resetEmailForm = function() {
    $scope.form = {
      cc: [],
      emailBody: '',
      emailSubject: '',
      added: []
    };
  }

  $scope.resetEmailForm();
  $scope.sendto = ''
  $scope.sendcc = ''
  $scope.sendEmail = function() {
    console.log($scope.deal, 'ppppppppppppppppppppppp', $scope.data);
    var count = 0
    var cc = []
    for (var i = 0; i < $scope.form.cc.length; i++) {
      $http({
        method: 'GET',
        url: '/api/HR/userSearch/' + $scope.form.cc[i]
      }).
      then(function(response) {
        count += 1
        $scope.tempCC = response.data.email + ','
        $scope.sendcc = $scope.sendcc + $scope.tempCC
        if (count == $scope.form.cc.length) {
          $scope.sendcc = $scope.sendcc.slice(0, -1);
          $scope.sendto = ''
          // $scope.tempTo = $scope.data.email + ','
          // $scope.sendto = $scope.tempTo
          // $scope.tempTo = $scope.contact.email + ','
          // $scope.sendto = $scope.tempTo
          if ($scope.deal != undefined) {
            for (var i = 0; i < $scope.deal.contacts.length; i++) {
              $scope.tempTo = $scope.deal.contacts[i].email + ','
              $scope.sendto = $scope.tempTo
            }
          }
          $scope.sendto = $scope.sendto.slice(0, -1);
          $scope.attachmentTemplates = ''
          if ($scope.form.added != null) {
            for (var i = 0; i < $scope.form.added.length; i++) {
              console.log($scope.form.added[i].pk);
              $scope.tempTemplate = $scope.form.added[i].pk + ','
              $scope.attachmentTemplates = $scope.attachmentTemplates + $scope.tempTemplate
            }
            $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
          }
          toSend = {
            to: $scope.sendto,
            cc: $scope.sendcc,
            subject: $scope.form.emailSubject,
            body: $scope.form.emailBody,
            attachmentTemplates: $scope.attachmentTemplates
          }
          $http({
            method: 'POST',
            url: '/api/mail/send/',
            data: toSend
          }).
          then(function() {
            Flash.create('success', 'Email sent successfully');
            var data = {
              "subject": $scope.form.emailSubject
            }
            var finalData = JSON.stringify(data)
            var dataToSend = {
              typ: 'mail',
              deal: $scope.deal.pk,
              notes: $scope.form.emailBody,
              data: finalData,
            };
            $http({
              method: 'POST',
              url: '/api/clientRelationships/activity/',
              data: dataToSend
            }).
            then(function(response) {
              $scope.resetEmailForm();
            })

          })
        }
      })
    }
  }
});

app.controller("businessManagement.clientRelationships.controller.addProject", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $uibModalInstance, deal) {
  $scope.me = $users.get('mySelf');
  $http({
    method: 'GET',
    url: '/api/clientRelationships/deal/' + deal
  }).
  then(function(response) {
    $scope.deal = response.data
    console.log($scope.deal);
    var date = new Date()
    $scope.deal.dueDate = date.setDate(date.getDate() + $scope.deal.deliveryTime);
    $scope.deal.dueDate = new Date($scope.deal.dueDate)
  })

  $scope.close = function() {
    $uibModalInstance.close($scope.deal.result);
  }

  $scope.saveProject = function() {
    var dataToSend = {
      deal: $scope.deal.pk,
      title: $scope.deal.name,
      description: $scope.deal.requirements,
      dueDate: $scope.deal.dueDate,
      team: $scope.deal.team,
      user: $scope.me.pk
    }
    $http({
      method: 'POST',
      url: '/api/clientRelationships/convertAsProject/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Added As Project')
      $scope.deal.result = 'won'
      $uibModalInstance.close($scope.deal.reult);
    })
  }




})




app.controller("businessManagement.clientRelationships.opportunities.viewDetails", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $uibModalInstance, dealPk) {

  $scope.close = function() {
    $uibModalInstance.close();
  }


  $scope.requiementsData = []
  $scope.paymentsData = []
  $http({
    method: 'GET',
    url: '/api/clientRelationships/deal/' + dealPk
  }).
  then(function(response) {
    $scope.deal = response.data
    $http({
      method: 'GET',
      url: '/api/clientRelationships/dealRequirement/?parent=' + dealPk
    }).
    then(function(response) {
      $scope.requiementsData = response.data
    })
    $http({
      method: 'GET',
      url: '/api/clientRelationships/dealPaymentsTerm/?parent=' + dealPk
    }).
    then(function(response) {
      $scope.paymentsData = response.data
    })
  })

  $scope.reqRefresh = function() {
    $scope.requirement = {
      title: '',
      details: ''
    }
  }

  $scope.paymentRefresh = function() {
    $scope.payment = {
      offset: '',
      percent: '',
      milestone: ''
    }
  }

  $scope.reqRefresh()
  $scope.paymentRefresh()

  $scope.saveReq = function() {
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + $scope.deal.pk + '/',
      data: {
        requirements: $scope.deal.requirements
      }
    }).
    then(function(response) {
      $scope.deal = response.data
      Flash.create('success', 'Saved')
    })
  }


  $scope.addReq = function() {
    if ($scope.requirement.title == '') {
      Flash.create('warning', 'Add Title for Requiremnts');
      return;
    }
    var dataToSend = {
      title: $scope.requirement.title,
      details: $scope.requirement.details,
      parent: $scope.deal.pk
    }
    var method = 'POST'
    var url = '/api/clientRelationships/dealRequirement/';
    if ($scope.requirement.pk) {
      method = 'PATCH'
      url += $scope.requirement.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.requiementsData.push(response.data)
      $scope.reqRefresh()
    })
  }

  $scope.addPaymentData = function() {
    if ($scope.payment.offset == '') {
      Flash.create('warning', 'Add offset for Payment');
      return;
    }
    if ($scope.payment.percent == '') {
      Flash.create('warning', 'Add percent for Payment');
      return;
    }
    if ($scope.payment.milestone == '') {
      Flash.create('warning', 'Add milestone for Payment');
      return;
    }
    var dataToSend = {
      offset: $scope.payment.offset,
      percent: $scope.payment.percent,
      milestone: $scope.payment.milestone,
      parent: $scope.deal.pk
    }
    var method = 'POST'
    var url = '/api/clientRelationships/dealPaymentsTerm/';
    if ($scope.payment.pk) {
      method = 'PATCH'
      url += $scope.payment.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.paymentsData.push(response.data)
      $scope.paymentRefresh()
    })
  }

  $scope.editReq = function(indx) {
    $scope.requirement = $scope.requiementsData[indx]
    $scope.requiementsData.splice(indx, 1)
  }
  $scope.editPayment = function(indx) {
    $scope.payment = $scope.paymentsData[indx]
    $scope.paymentsData.splice(indx, 1)
  }

  $scope.deleteReq = function(indx, pk) {
    $http({
      method: 'DELETE',
      url: '/api/clientRelationships/dealRequirement/' + pk
    }).
    then(function(response) {
      $scope.requiementsData.splice(indx, 1)

    })
  }

  $scope.deletePayment = function(indx, pk) {
    $http({
      method: 'DELETE',
      url: '/api/clientRelationships/dealPaymentsTerm/' + pk
    }).
    then(function(response) {
      $scope.paymentsData.splice(indx, 1)
    })
  }


})

app.controller("app.clientRelationships.opportunity.newForm", function($scope, $state, $users, $http, Flash, $uibModalInstance) {
  $scope.contactSearch = function(query) {
    return $http.get('/api/clientRelationships/contact/?name__icontains=' + query + '&limit=10').
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.serviceSearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query + '&limit=10').
    then(function(response) {
      return response.data.results;
    })
  }

  $scope.form = {
    name: '',
    contact: '',
    email: '',
    phone: '',
    company: ''
  }
  $scope.save = function() {
    if ($scope.form.name.length == 0 || $scope.form.contact.length == 0 || $scope.form.company.length == 0) {
      if (typeof $scope.form.contact != 'object') {
        Flash.create('warning', 'Mobile number and Email is required')
        return
      }
      Flash.create('warning', 'Title, Contact and Company is required')
      return
    }
    var dataToSend = {
      name: $scope.form.name
    }
    if (typeof $scope.form.contact == 'object') {
      dataToSend.contactPk = $scope.form.contact.pk
    } else {
      dataToSend.contact = $scope.form.contact
      dataToSend.email = $scope.form.email
      dataToSend.mobile = $scope.form.mobile
    }
    if (typeof $scope.form.company == 'object') {
      dataToSend.companyPk = $scope.form.company.pk
    } else {
      dataToSend.company = $scope.form.company
    }
    $http({
      method: 'POST',
      url: '/api/clientRelationships/saveDeal/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Created')
      $uibModalInstance.dismiss()
    })
  }

  $scope.close = function() {
    $uibModalInstance.dismiss()
  }
})

app.controller("businessManagement.clientRelationships.opportunities.list", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $http({
    method: 'GET',
    url: '/api/clientRelationships/getBoardOptions/?allDeal='
  }).
  then(function(response) {
    $scope.crmSteps = response.data
  })

  $scope.newOpportunity = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunity.newForm.html',
      size: 'md',
      backdrop: false,
      controller: 'app.clientRelationships.opportunity.newForm',
    }).result.then(function() {


    }, function() {
      $scope.fetchDeals();
    });
  }

  $http({
    method: 'GET',
    url: '/api/clientRelationships/getBoardOptions/?deal='
  }).
  then(function(response) {
    $scope.columns = response.data
  })

  //
  // $scope.columns = [
  //   // {icon : 'fa-pencil-square-o' , text : 'Created' , cat : 'created'},
  //
  //   {
  //     text: '',
  //     cat: 'new'
  //   },
  //   {
  //     icon: '/static/images/icons8-call-male-80_orange.png',
  //     text: 'Contacting',
  //     cat: 'contacted'
  //   },
  //   {
  //     icon: '/static/images/icons8-note-taking-80.png',
  //     text: 'Requirements',
  //     cat: 'requirements'
  //   },
  //   {
  //     icon: '/static/images/icons8-online-pricing-64.png',
  //     text: 'Proposal',
  //     cat: 'proposal'
  //   },
  //   {
  //     icon: '/static/images/icons8-estimate-64.png',
  //     text: 'Negotiation',
  //     cat: 'negotiation'
  //   }
  // ]

  $scope.searchText = '';
  $scope.companySearch = false;
  $scope.resetSearch = function() {
    $scope.searchText = '';
    $scope.fetchDeals();
  }

  $scope.fetchDeals = function() {
    var url = '/api/clientRelationships/deal/?';
    if ($scope.companySearch && $scope.searchText != '') {
      url += 'company__contains=' + $scope.searchText
    } else if (!$scope.companySearch && $scope.searchText != '') {
      url += 'name__contains=' + $scope.searchText
    }
    url += '&board';

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.deals = response.data;
      $scope.data = {
        created: [],
        contacted: [],
        demo: [],
        requirements: [],
        proposal: [],
        negotiation: [],
        conclusion: []
      }
      console.log(response.data);
      for (var i = 0; i < response.data.length; i++) {
        $scope.data[response.data[i].state].push(response.data[i])
      }

    });
  }

  $scope.fetchDeals();
  $scope.isDragging = false;
  $scope.removeFromData = function(pk) {
    for (var key in $scope.data) {
      if ($scope.data.hasOwnProperty(key)) {
        for (var i = 0; i < $scope.data[key].length; i++) {
          if ($scope.data[key][i].pk == pk) {
            $scope.data[key].splice(i, 1);
            return;
          }
        }
      }
    }
  }

  $scope.exploreDeal = function(deal, evt) {
    if ($scope.isDragging) {
      $scope.isDragging = false;
    } else {
      $scope.$emit('exploreDeal', {
        deal: deal
      });
    }
  }

  $scope.$on('draggable:start', function(data) {
    $scope.isDragging = true;
  });

  $scope.$on('dealUpdated', function(evt, data) {
    $scope.removeFromData(data.deal.pk);
    if (data.deal.result != 'lost') {
      $scope.data[data.deal.state].push(data.deal);
    }

  });

  $scope.openCard = function(c) {
    $state.go('businessManagement.CRM.opportunities.details', {
      id: c.pk
    });
  }

  $scope.onDropComplete = function(data, evt, newState) {




    if (data == null) {
      return;
    }
    $scope.removeFromData(data.pk);
    $scope.data[$scope.columns[newState].cat].push(data);

    var dataToSend = {
      state: $scope.columns[newState].cat
    }

    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + data.pk + '/',
      data: dataToSend
    }).
    then(function(Response) {}, function(err) {
      Flash.create('danger', 'Error while updating')
    });
    console.log("drop complete");
  }


  $scope.bulkUpload = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.opportunity.bulkUpload.html',
      size: 'md',
      backdrop: false,
      controller: function($scope, $uibModalInstance, $rootScope) {
        $scope.close = function() {
          $uibModalInstance.close();
        }
        $scope.form = {
          xlFile: emptyFile,
          success: false,
          usrCount: 0,
          'unaddedCount': 0
        }
        $scope.upload = function() {
          if ($scope.form.xlFile == emptyFile) {
            Flash.create('warning', 'No file selected')
          }

          var fd = new FormData()
          fd.append('xl', $scope.form.xlFile);

          $http({
            method: 'POST',
            url: '/api/clientRelationships/bulkOpportunityCreation/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Created');
            $scope.form.usrCount = response.data.count;
            $scope.form.unaddedCount = response.data.unaddedCount;
            $scope.form.success = true;
          })

        }
      },
    }).result.then(function() {


    }, function() {

    });
  }

});


app.controller("businessManagement.clientRelationships.opportunities", function($scope, $state, $users, $stateParams, $http, Flash, $aside) {

  $scope.tabs = [];
  $scope.searchTabActive = true;
  // $scope.createTabActive = true;

  $scope.$on('cloneDeal', function(event, input) {
    $scope.searchTabActive = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      $scope.tabs[i].active = false;
    }
    $scope.createTabActive = true;
  });

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }

  $scope.$on('editContact', function(event, input) {
    console.log("recieved");
    console.log(input);
    $scope.addTab({
      "title": "Edit :" + input.contact.name,
      "cancel": true,
      "app": "contactEditor",
      "data": {
        "pk": input.contact.pk,
        contact: input.contact
      },
      "active": true
    })
  });

  $scope.$on('showContactsForm', function(event, input) {
    $scope.addTab({
      title: 'Create contact / company entry',
      cancel: true,
      app: 'contactForm',
      data: {
        pk: -1,
      },
      active: true
    })
  });

  $scope.$on('exploreDeal', function(event, input) {
    $scope.addTab({
      "title": "Details :" + input.deal.name,
      "cancel": true,
      "app": "exploreDeal",
      "data": {
        "pk": input.deal.pk
      },
      "active": true
    })
  });

  $scope.$on('exploreContact', function(event, input) {
    console.log("recieved");
    console.log(input);
    $scope.addTab({
      "title": "Details :" + input.contact.name,
      "cancel": true,
      "app": "contactExplorer",
      "data": {
        "pk": input.contact.pk
      },
      "active": true
    })
  });

  $scope.$on('getContact', function(event, input) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.contact.explore.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        contact: function() {
          return input.contact.pk;
        },
      },
      backdrop: false,
      controller: 'businessManagement.clientRelationships.contacts.exploreModal'
    }).result.then(function(rea) {}, function(dis) {})
  });

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar: false,
    statusbar: false,
    toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | link',
    setup: function(editor) {
      // editor.addButton();
    },
  };


  // $scope.addTab({"title":"Details :Blandit insolens pri ad","cancel":true,"app":"exploreDeal","data":{"pk":5},"active":true})

});

app.controller("businessManagement.clientRelationships.opportunities.form", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $rootScope, $aside) {



  $scope.mode = 'new';

  $scope.$on('cloneDeal', function(event, input) {
    $scope.resetDealEditor();
    console.log("will clone");
    $http({
      method: 'GET',
      url: '/api/clientRelationships/deal/' + input.deal.pk
    }).
    then(function(response) {
      $scope.dealEditor = response.data;
      $scope.dealEditor.otherCRMUsers = response.data.contacts;
      $scope.dealEditor.state = -1;
      $scope.dealEditor.name += ' (Cloned)'
    })



  });

  $scope.wizardClicked = function(indx) {
    console.log(indx);
  }

  $scope.activeWizardTab = 3;

  $scope.data = {
    steps: crmSteps
  }

  $scope.resetDealEditor = function() {
    var dummyDate = new Date();
    $scope.mode = 'new';
    var onlyDate = new Date(dummyDate.getFullYear(), dummyDate.getMonth(), dummyDate.getDate(), 23, 59, 59); // 2013-07-30 23:59:59

    $scope.dealEditor = {
      otherCRMUsers: [],
      internalUsers: [],
      name: '',
      currency: 'INR',
      probability: 0,
      state: -1,
      closeDate: onlyDate,
      value: 0,
      relation: 'onetime',
      company: '',
      contracts: [],
      deliveryTime: 45
    }
    $scope.requiementsData = []
    $scope.paymentsData = []
  }

  $scope.$watch('dealEditor.otherCRMUsers', function(newValue, oldValue) {
    if ($scope.dealEditor.otherCRMUsers.length == 1) {
      if (typeof $scope.dealEditor.otherCRMUsers[0].company == 'object') {
        $scope.dealEditor.company = $scope.dealEditor.otherCRMUsers[0].company;
        return;
      }
      $http({
        method: 'GET',
        url: '/api/ERP/service/' + $scope.dealEditor.otherCRMUsers[0].company + '/'
      }).
      then(function(response) {
        $scope.dealEditor.company = response.data;
      });
    }
  }, true);

  $scope.setRelation = function(rl) {
    $scope.dealEditor.relation = rl;
  }

  $scope.saveDeal = function() {
    var d = $scope.dealEditor;
    console.log(d);
    if (d.company == '' || typeof d.company != 'object' || d.company == null) {
      Flash.create('warning', 'Company can not be blank');
      return;
    }
    if (d.name.length == 0) {
      Flash.create('warning', 'Deal name can not be blank');
      return;
    }

    var stateTxt;
    if (d.state == -1) {
      stateTxt = 'created';
    } else {
      stateTxt = $scope.data.steps[d.state].text
    }
    var dataToSend = {
      name: d.name,
      probability: d.probability,
      state: stateTxt,
      closeDate: d.closeDate,
      value: d.value,
      relation: d.relation,
      currency: d.currency,
      company: d.company.pk,
      deliveryTime: d.deliveryTime
    }

    if (d.requirements != '') {
      dataToSend.requirements = d.requirements;
    }

    var crmUsers = []
    for (var i = 0; i < d.otherCRMUsers.length; i++) {
      crmUsers.push(d.otherCRMUsers[i].pk)
    }

    if (crmUsers.length != 0) {
      dataToSend.contacts = crmUsers;
    } else {
      Flash.create('warning', 'At least one contact is required');
      return;
    }

    if (d.internalUsers.length != 0) {
      dataToSend.internalUsers = d.internalUsers;
    }

    var method;
    var url = '/api/clientRelationships/deal/';
    if ($scope.mode == 'edit') {
      method = 'PATCH'
      url += $scope.deal.pk + '/'
    } else {
      method = 'POST'
    }

    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.mode = 'edit';
      $scope.deal = response.data;
      $scope.addReqVal = true
      Flash.create('success', 'Saved');
      if (response.data.state == 'created') {
        return;
      }
      $rootScope.$broadcast('dealUpdated', {
        deal: response.data
      });
    })
  }
  $scope.reqRefresh = function() {
    $scope.requirement = {
      title: '',
      details: ''
    }
  }

  $scope.paymentRefresh = function() {
    $scope.payment = {
      offset: '',
      percent: '',
      milestone: ''
    }
  }
  $scope.requiementsData = []
  $scope.paymentsData = []
  $scope.reqRefresh()
  $scope.paymentRefresh()


  $scope.addReq = function() {
    if ($scope.requirement.title == '') {
      Flash.create('warning', 'Add Title for Requiremnts');
      return;
    }
    var dataToSend = {
      title: $scope.requirement.title,
      details: $scope.requirement.details,
      parent: $scope.deal.pk
    }
    var method = 'POST'
    var url = '/api/clientRelationships/dealRequirement/';
    if ($scope.requirement.pk) {
      method = 'PATCH'
      url += $scope.requirement.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.requiementsData.push(response.data)
      $scope.reqRefresh()
    })
  }

  $scope.addPaymentData = function() {
    if ($scope.payment.offset == '') {
      Flash.create('warning', 'Add offset for Payment');
      return;
    }
    if ($scope.payment.percent == '') {
      Flash.create('warning', 'Add percent for Payment');
      return;
    }
    if ($scope.payment.milestone == '') {
      Flash.create('warning', 'Add milestone for Payment');
      return;
    }
    var dataToSend = {
      offset: $scope.payment.offset,
      percent: $scope.payment.percent,
      milestone: $scope.payment.milestone,
      parent: $scope.deal.pk
    }
    var method = 'POST'
    var url = '/api/clientRelationships/dealPaymentsTerm/';
    if ($scope.payment.pk) {
      method = 'PATCH'
      url += $scope.payment.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.paymentsData.push(response.data)
      $scope.paymentRefresh()
    })
  }

  $scope.editReq = function(indx) {
    $scope.requirement = $scope.requiementsData[indx]
    $scope.requiementsData.splice(indx, 1)
  }
  $scope.editPayment = function(indx) {
    $scope.payment = $scope.paymentsData[indx]
    $scope.paymentsData.splice(indx, 1)
  }

  $scope.deleteReq = function(indx, pk) {
    $http({
      method: 'DELETE',
      url: '/api/clientRelationships/dealRequirement/' + pk
    }).
    then(function(response) {
      $scope.requiementsData.splice(indx, 1)

    })
  }

  $scope.deletePayment = function(indx, pk) {
    $http({
      method: 'DELETE',
      url: '/api/clientRelationships/dealPaymentsTerm/' + pk
    }).
    then(function(response) {
      $scope.paymentsData.splice(indx, 1)
    })
  }




  $scope.setCurrency = function(curr) {
    $scope.dealEditor.currency = curr;
  }

  $scope.resetDealEditor();

  $scope.openContactForm = function() {
    $scope.$emit('showContactsForm', {});
  }


  $scope.quote = function() {
    console.log("will create a quote");
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      backdrop: false,
      resolve: {
        deal: function() {
          if ($scope.deal != undefined) {
            return $scope.deal;
          } else {
            return $scope.dealEditor
          }
        },
        contact: function() {
          return {
            pk: '',
            company: {}
          };
        },
        mailer: function() {
          return true
        },
      },
      controller: 'businessManagement.clientRelationships.opportunities.quote'
    })
  }

  // $scope.quote()



});


app.controller("businessManagement.clientRelationships.opportunities.quoteEdit", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $rootScope, $aside, mailer, contract, $uibModal, $uibModalInstance) {

  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }
  $scope.dismiss = function() {
    $uibModalInstance.dismiss();
  }
  $scope.terms = {}

  $http.get('/api/clientRelationships/termsAndConditions/').
  then(function(response) {
    $scope.termsConditions = response.data
    // $scope.terms = response.data[0]
    // if ($scope.terms) {
    //   $scope.terms.points =  $scope.terms.body.split('||')
    //
    // }
  })

  $scope.$watch('terms', function(newValue, oldValue) {
    $scope.terms = newValue
    // $scope.terms.points =  $scope.terms.body.split('||')
    if ($scope.terms.body != undefined) {
      $scope.terms.points = $scope.terms.body.split('||')

    }
  })

  $scope.discount = [{
    'title': 'none',
    'percentage': 0
  }]
  $scope.coupon = $scope.discount[0]
  $http({
    method: 'GET',
    url: '/api/clientRelationships/coupon/'
  }).
  then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.discount.push(response.data[i])
    }
  })

  $scope.mailEditor = {
    to: [],
    cc: [],
    subject: '',
    added: [],
    body: '',
    terms: ''
  }
  $scope.resetForm = function() {
    $scope.form = {
      currency: $scope.selectedCurrency,
      type: 'onetime',
      quantity: 1,
      tax: 0,
      rate: 0,
      desc: ''
    };
  }

  $scope.remove = function(idx) {
    $scope.data.splice(idx, 1);
  }




  $scope.getEmailAddressSuggestions = function(query) {
    return $http.get('/api/ERP/application/?name__contains=' + query)
  }
  $scope.selectedCurrency = 'INR'
  $scope.firstQuote = true;
  $scope.contract = contract
  $scope.mailer = mailer
  $scope.data = JSON.parse($scope.contract.data);
  if ($scope.contract.termsAndCondition != undefined) {
    $scope.terms = $scope.contract.termsAndCondition
  } else {
    $scope.terms = response.data[0]
  }
  $timeout(function() {
    if ($scope.contract.coupon) {
      for (var i = 0; i < $scope.discount.length; i++) {
        if ($scope.discount[i].pk == $scope.contract.coupon) {
          $scope.coupon = $scope.discount[i]
        }
      }
    } else {
      $scope.coupon = $scope.discount[0]
    }

  }, 500)
  $scope.mailEditor.added = JSON.parse($scope.contract.files);
  $scope.mailEditor.subject = $scope.contract.subject;
  $scope.mailEditor.body = $scope.contract.mailBody;
  if ($scope.contract.to != null) {
    $scope.mailEditor.to = $scope.contract.to.split(',')
  }
  if ($scope.contract.cc != null) {
    $scope.mailEditor.cc = $scope.contract.cc.split(',')
  }
  $scope.currency = ['INR', 'USD']
  if ($scope.contract.deal) {
    $scope.selectedCurrency = $scope.contract.deal.currency
  } else {
    $scope.selectedCurrency = 'INR'
  }
  $scope.edit = function(idx) {
    var d = $scope.data[idx];
    $scope.form = {
      currency: d.currency,
      type: d.type,
      quantity: d.quantity,
      tax: d.tax,
      rate: d.rate,
      desc: d.desc,
    };
    $http.get('/api/ERP/productMeta/?code=' + d.taxCode).
    then(function(response) {
      $scope.form.productMeta = response.data[0]
    })
    $scope.data.splice(idx, 1);
  }
  $scope.calculateTotal = function() {
    var total = 0;
    var totalTax = 0;
    var grandTotal = 0;
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.data[i].total = parseInt($scope.data[i].quantity) * parseInt($scope.data[i].rate);
      $scope.data[i].totalTax = $scope.data[i].total * parseInt($scope.data[i].tax) / 100;
      $scope.data[i].subtotal = $scope.data[i].totalTax + $scope.data[i].total;
      total += $scope.data[i].total;
      totalTax += $scope.data[i].totalTax;
      grandTotal += $scope.data[i].subtotal;
    }
    $scope.totalTax = totalTax;
    $scope.total = total;
    $scope.grandTotal = grandTotal;
    $scope.discountRate = 0
    if ($scope.coupon.pk != undefined) {
      $scope.discountRate = $scope.grandTotal * $scope.coupon.percentage / 100
      $scope.finalAmount = $scope.grandTotal - $scope.discountRate
    } else {
      $scope.discountRate = 0
      $scope.finalAmount = 0
    }
    // $scope.deal.calculated = {value : total , tax : totalTax , grand : grandTotal}
  }
  $scope.resetForm()
  $scope.calculateTotal()
  $scope.add = function() {
    if ($scope.form.tax > 70) {
      Flash.create('warning', 'The tax rate is unrealistic');
      return;
    }
    if (typeof $scope.form.productMeta != 'object') {
      Flash.create('warning', 'Select Product/Service class');
      return;
    }
    $scope.calculateTotal();
    $scope.total = parseInt($scope.form.quantity) * parseInt($scope.form.rate);
    $scope.totalTax = $scope.total * parseInt($scope.form.productMeta.taxRate) / 100;
    $scope.subtotal = $scope.totalTax + $scope.total;
    $scope.data.push({
      currency: $scope.form.currency,
      type: $scope.form.type,
      tax: $scope.form.productMeta.taxRate,
      desc: $scope.form.desc,
      rate: $scope.form.rate,
      quantity: $scope.form.quantity,
      taxCode: $scope.form.productMeta.code,
      totalTax: $scope.totalTax,
      subtotal: $scope.subtotal,
      saleType: $scope.form.productMeta.saleType
    })
    var url = '/api/clientRelationships/contract/' + $scope.contract.pk + '/'
    var method = 'PATCH';
    $scope.to = ''
    for (var i = 0; i < $scope.mailEditor.to.length; i++) {
      if ($scope.mailEditor.to[i]['email'] == undefined) {
        $scope.tempTo = $scope.mailEditor.to[i] + ","
      } else {
        $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
      }
      $scope.to = $scope.to + $scope.tempTo
      $scope.to = $scope.to.slice(0, -1);
    }
    $scope.cc = ''
    for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
      if ($scope.mailEditor.cc[i]['email'] == undefined) {
        $scope.tempCC = $scope.mailEditor.cc[i] + ","
      } else {
        $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
      }
      $scope.cc = $scope.cc + $scope.tempCC
      $scope.cc = $scope.cc.slice(0, -1);
    }
    var dataToSend = {
      data: JSON.stringify($scope.data),
      value: parseInt($scope.grandTotal),
      files: JSON.stringify($scope.mailEditor.added)
    };

    if ($scope.cc != '') {
      dataToSend.cc = $scope.cc;
    }

    if ($scope.mailEditor.subject != '') {
      dataToSend.subject = $scope.mailEditor.subject
    }
    if ($scope.to != '') {
      dataToSend.to = $scope.to
    }
    if ($scope.mailEditor.body != '') {
      dataToSend.mailBody = $scope.mailEditor.body;
    }



    if (method == 'POST') {
      if ($scope.contract.deal != '') {
        dataToSend.deal = $scope.contract.deal;
      } else {
        dataToSend.contact = $scope.contract.contact;
      }
    }
    dataToSend.termsAndCondition = $scope.terms.pk;




    console.log(dataToSend, 'aaaaaaaaaaaaaaaaa');
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      // if ($scope.deal.contracts.length ==0) {
      //   $scope.deal.contracts.push(response.data.pk);
      // }
      $scope.resetForm();
    })
  }
  $scope.inventorySearch = function(query) {
    return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  }

  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?description__icontains=' + c).
    then(function(response) {
      return response.data;
    })
  }



  $scope.$watch('form.desc', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      if (newValue.productMeta != null) {
        $scope.form.productMeta = newValue.productMeta;
      }

      $scope.form.rate = newValue.rate;
      $scope.form.desc = newValue.name;

    }
  })
  $scope.$watch('form.productMeta', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      if (newValue.typ == 'SAC') {
        $scope.form.productMeta.saleType = 'Service'
      } else {
        $scope.form.productMeta.saleType = 'Product'
      }
      $scope.showTaxCodeDetails = true;
    } else {
      $scope.showTaxCodeDetails = false;
    }
  })

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar: false,
    statusbar: false,
    toolbar: 'templates attach | numlist | alignleft aligncenter alignright alignjustify | outdent  indent | bold italic underline',
    setup: function(editor) {
      editor.addButton('templates', {
        text: 'Templates',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
            size: 'lg',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.templatePicker',
          }).result.then(function() {

          }, function(t) {
            // if ($scope.deal.contacts.length > 0) {
            //   t.template = t.template.replace('{{name}}' , $scope.deal.contacts[0].name)
            // }
            $scope.mailEditor.body = t.template;
          })


        }
      });

      $scope.removeMailAttachment = function(indx) {
        $scope.mailEditor.added.splice(indx, 1)
      }

      editor.addButton('attach', {
        text: 'Attachments',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
            size: 'md',
            backdrop: true,
            resolve: {

            },
            controller: 'businessManagement.clientRelationships.selectAttachments',
          }).result.then(function(files) {
            for (var i = 0; i < files.length; i++) {
              for (var j = 0; j < $scope.mailEditor.added.length; j++) {
                if ($scope.mailEditor.added[j].pk == files[i].pk) {
                  continue;
                }
              }
              $scope.mailEditor.added.push(files[i])
            }
          }, function() {

          })
        }
      });
    },
  };
  $scope.send = function() {
    $scope.me = $users.get('mySelf');
    // send the pk of the contract object and returns mails/models.py - mailAttachment object


    var url = '/api/clientRelationships/sendEmailAttach/?contract=' + $scope.contract.pk

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.mailObj = response.data
      $scope.sendto = ''
      for (var i = 0; i < $scope.mailEditor.to.length; i++) {
        if ($scope.mailEditor.to[i]['email'] == undefined) {
          $scope.tempTo = $scope.mailEditor.to[i] + ","
        } else {
          $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
        }
        console.log($scope.tempTo, 'pppppppppppppppppppppppppppppppppppp');
        $scope.sendto = $scope.sendto + ',' + $scope.tempTo
        $scope.sendto = $scope.sendto.slice(0, -1);
      }
      $scope.sendcc = ''
      for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
        if ($scope.mailEditor.cc[i]['email'] == undefined) {
          $scope.tempCC = $scope.mailEditor.cc[i] + ","
        } else {
          $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
        }
        $scope.sendcc = $scope.sendcc + $scope.tempCC
        $scope.sendcc = $scope.sendcc.slice(0, -1);
      }
      $scope.attachmentTemplates = ''
      if ($scope.mailEditor.added != null) {
        for (var i = 0; i < $scope.mailEditor.added.length; i++) {
          console.log($scope.mailEditor.added[i].pk);
          $scope.tempTemplate = $scope.mailEditor.added[i].pk + ','
          $scope.attachmentTemplates = $scope.attachmentTemplates + $scope.tempTemplate
        }
        $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
      }
      if ($scope.mailEditor.body == null || $scope.mailEditor.body == '') {
        Flash.create("warning", "Add Body Message")
        return
      }
      dataSend = {
        attachments: $scope.mailObj.pk.toString(),
        to: $scope.sendto,
        cc: $scope.sendcc,
        subject: $scope.mailEditor.subject,
        body: $scope.mailEditor.body,
        attachmentTemplates: $scope.attachmentTemplates
      }
      $http({
        method: 'POST',
        url: '/api/mail/send/',
        data: dataSend
      }).
      then(function(response) {
        var data = {
          "subject": $scope.mailEditor.subject
        }
        var finalData = JSON.stringify(data)
        var dataToSend = {
          typ: 'mail',
          internalUsers: [$scope.me.pk],
          notes: $scope.mailEditor.body,
          data: finalData,
        };
        if ($scope.contract.deal != null) {
          dataToSend.deal = $scope.contract.deal.pk
          var externals = []
          for (var i = 0; i < $scope.contract.deal.contacts.length; i++) {
            externals.push($scope.contract.deal.contacts[i].pk);
          }
          if (externals.length != 0) {
            dataToSend.contacts = externals;
          }
        } else {
          dataToSend.contact = $scope.contract.contact.pk
        }

        $http({
          method: 'POST',
          url: '/api/clientRelationships/activity/',
          data: dataToSend
        }).
        then(function(response) {
          Flash.create("success", "Successfully Sent!")
          $uibModalInstance.dismiss()

        })
      })
    })
  }

  $scope.$watch('data', function(newValue, oldValue) {
    $scope.calculateTotal();
  }, true)


  $scope.downloadInvoice = function() {
    window.location.href = "/api/clientRelationships/downloadInvoice/?contract=" + $scope.contract.pk
  }

  $scope.save = function() {

    var url = '/api/clientRelationships/contract/' + $scope.contract.pk + '/'
    var method = 'PATCH';
    $scope.to = ''
    for (var i = 0; i < $scope.mailEditor.to.length; i++) {
      if ($scope.mailEditor.to[i]['email'] == undefined) {
        $scope.tempTo = $scope.mailEditor.to[i] + ","
      } else {
        $scope.tempTo = $scope.mailEditor.to[i]['email'] + ","
      }
      $scope.to = $scope.to + $scope.tempTo
      $scope.to = $scope.to.slice(0, -1);
    }
    $scope.cc = ''
    for (var i = 0; i < $scope.mailEditor.cc.length; i++) {
      if ($scope.mailEditor.cc[i]['email'] == undefined) {
        $scope.tempCC = $scope.mailEditor.cc[i] + ","
      } else {
        $scope.tempCC = $scope.mailEditor.cc[i]['email'] + ","
      }
      $scope.cc = $scope.cc + $scope.tempCC
      $scope.cc = $scope.cc.slice(0, -1);
    }
    var dataToSend = {
      data: JSON.stringify($scope.data),
      value: parseInt($scope.grandTotal),
      files: JSON.stringify($scope.mailEditor.added)
    };

    if ($scope.cc != '') {
      dataToSend.cc = $scope.cc;
    }

    if ($scope.mailEditor.subject != '') {
      dataToSend.subject = $scope.mailEditor.subject
    }
    if ($scope.to != '') {
      dataToSend.to = $scope.to
    }
    if ($scope.mailEditor.body != '') {
      dataToSend.mailBody = $scope.mailEditor.body;
    }



    if (method == 'POST') {
      if ($scope.contract.deal != '') {
        dataToSend.deal = $scope.contract.deal;
      } else {
        dataToSend.contact = $scope.contract.contact;
      }
    }
    dataToSend.termsAndCondition = $scope.terms.pk;
    if ($scope.coupon.pk != undefined) {
      dataToSend.coupon = $scope.coupon.pk;
    } else {
      dataToSend.coupon = ''
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      // if ($scope.deal.contracts.length ==0) {
      //   $scope.deal.contracts.push(response.data.pk);
      // }
      $scope.resetForm();
      Flash.create("success", "Successfully Saved!")
      $uibModalInstance.dismiss()

    })

  }



  $scope.$watch('coupon', function(newValue, oldValue) {

    if ($scope.data.length == 0) {
      $scope.coupon = $scope.discount[0]
      Flash.create("warning", 'Add Product First')
      return
    } else {
      $scope.calculateTotal()
    }

  })
})


app.controller("businessManagement.clientRelationships.controller.aggrement", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $rootScope, $aside, $uibModal, $uibModalInstance, deal) {

  $scope.close = function() {
    $uibModalInstance.close();
  }

  $http({
    method: 'POST',
    url: '/api/clientRelationships/createLegalAgreementTerms/',
    data: {
      deal: deal
    }
  }).
  then(function(response) {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/legalAgreement/' + response.data.legalPk,
    }).
    then(function(response) {
      $scope.form = response.data
      console.log();
      $http({
        method: 'GET',
        url: '/api/clientRelationships/legalAgreementTerms/?parent=' + response.data.legalPk,
      }).
      then(function(response) {
        $scope.termsData = response.data
      })

    })
  })

  $scope.submitForm = function() {
    var dataToSend = {
      title: $scope.form.title,
      witness1: $scope.form.witness1,
      witness2: $scope.form.witness2,
      effectiveDate: $scope.form.effectiveDate,
      effectiveDateEnd: $scope.form.effectiveDateEnd,
    }
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/legalAgreement/' + $scope.form.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.form = response.data
      Flash.create("success", "Successfully Saved!")
    })
  }
  $scope.signed = function() {
    var dataToSend = {
      signed: true,
      signedOn: new Date()
    }
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/legalAgreement/' + $scope.form.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.form = response.data
      Flash.create("success", "Successfully Saved!")
    })
  }
})

app.controller("businessManagement.clientRelationships.customers", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.$on('exploreRelation', function(evt, input) {
    $scope.addTab({
      "title": "Manage : " + input.name,
      "cancel": true,
      "app": "manageRelation",
      "data": {
        "pk": input.pk,
      },
      "active": true
    })
  })


  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.clientRelationships.customer.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/ERP/service/',
    filterSearch: true,
    searchField: 'name or web',
    deletable: true,
    itemsNumPerView: [12, 24, 48],
    getParams: [{
      key: 'vendor',
      value: false
    }, {
      key: 'get_service',
      value: ''
    }]
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          var title = 'Edit Customer :';
          var appType = 'customerEditor';
        } else if (action == 'details') {
          var title = 'Details :';
          var appType = 'customerExplorer';
        }


        console.log({
          title: title + $scope.data.tableData[i].name,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        });


        $scope.addTab({
          title: title + $scope.data.tableData[i].name,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        })
      }
    }

  }


  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }

  $scope.$on('exploreCustomer', function(event, input) {
    console.log("recieved");
    console.log(input);
    $scope.addTab({
      "title": "Details :" + input.customer.name,
      "cancel": true,
      "app": "customerExplorer",
      "data": {
        "pk": input.customer.pk
      },
      "active": true
    })
  });


  $scope.$on('editCustomer', function(event, input) {

    $scope.addTab({
      "title": "Edit :" + input.customer.name,
      "cancel": true,
      "app": "customerEditor",
      "data": input.customer,
      "active": true
    })
  });

  $scope.customerform = {
    search: ''
  }


  $scope.limit = 15
  $scope.offset = 0
  $scope.getallCustomers = function() {
    var url = '/api/ERP/service/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.customerform.search.length > 0) {
      url += '&search=' + $scope.customerform.search
    }
    $http({
      method: 'GET',
      url: url
    }).then(function(response) {
      $scope.customerList = response.data.results
      $scope.cutomerPrev = response.data.previous
      $scope.cutomerNext = response.data.next
    })
  }
  $scope.getallCustomers()

  $scope.Customerprev = function() {
    if ($scope.cutomerPrev != null) {
      $scope.offset -= $scope.limit
      $scope.getallCustomers()
    }
  }

  $scope.Customernext = function() {
    if ($scope.cutomerNext != null) {
      $scope.offset += $scope.limit
      $scope.getallCustomers()
    }
  }
  $scope.editCustomer = function(data) {
    $scope.$emit('editCustomer', {
      customer: data
    })
  }
  $scope.exploreCustomer = function(data) {
    $scope.$emit('exploreCustomer', {
      customer: data
    })
  }

  $scope.addCompany = function(data) {
    // businessManagement.clientRelationships.customer.form

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.customer.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: 'businessManagement.clientRelationships.customer.form'
    }).result.then(function() {
      // console.log('here...');
    }, function() {
      // $scope.getAsset()

    });
  }

})


app.controller("businessManagement.clientRelationships.customer.form", function($scope, $state, $users, $stateParams, $http, Flash, data, $uibModalInstance) {


  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      // user: '',
      mobile: '',
      about: '',
      telephone: '',
      cin: '',
      tin: '',
      logo: '',
      web: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      }
    }
  }
  // $scope.resetForm()


  if (data != undefined) {
    $scope.mode = 'edit';
    $scope.form = data

  } else {
    $scope.mode = 'new';
    $scope.resetForm()
  }


  // $scope.userSearch = function(query) {
  //   //search for the user
  //   return $http.get('/api/HR/userSearch/?username__contains=' + query).
  //   then(function(response) {
  //     return response.data;
  //   })
  // }

  $scope.$watch('form.address.pincode', function(newValue, oldValue) {
    if (newValue.length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + $scope.form.pincode
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.address.city = response.data[0].city;
          $scope.form.address.state = response.data[0].state;
          $scope.form.address.country = response.data[0].country;
        }
      })
    }
  })

  $scope.createCompany = function() {
    console.log('jbvjbdvjbdjfvbfd................');
    if (typeof $scope.form.name != "string" || $scope.form.name.length == 0) {
      Flash.create('warning', 'Company name is Required')
      return
    }
    if ($scope.mode == 'new') {

      if ($scope.form.address.pincode.length == 0) {
        Flash.create('warning', 'Pincode is Required')
        return
      }

    }
    if ($scope.mode == 'edit') {

      if ($scope.form.address == null) {
        Flash.create('warning', 'Pincode is Required')
        return

      }

    }
    // if (typeof $scope.form.user != "object") {
    //   Flash.create('warning', 'Please Select Suggested User')
    //   return
    // }
    var method = 'POST'
    var addUrl = '/api/ERP/address/'
    var serviceUrl = '/api/ERP/service/'

    if ($scope.mode == 'edit') {
      // method = 'PATCH'
      console.log($scope.form.address, $scope.form);
      method = 'PATCH'
      serviceUrl = serviceUrl + $scope.form.pk + '/'
      if ($scope.form.address != null) {
        method = 'PATCH'
        addUrl = addUrl + $scope.form.address.pk + '/'
      }

    }

    console.log(addUrl, serviceUrl);
    $http({
      method: method,
      url: addUrl,
      data: $scope.form.address
    }).
    then(function(response) {
      $scope.form.address = response.data

      var dataToSend = {
        name: $scope.form.name,
        mobile: $scope.form.mobile,
        about: $scope.form.about,
        address: response.data.pk,
        telephone: $scope.form.telephone,
        cin: $scope.form.cin,
        tin: $scope.form.tin,
        logo: $scope.form.logo,
        web: $scope.form.web,
      };
      $http({
        method: method,
        url: serviceUrl,
        data: dataToSend
      }).
      then(function(response) {
        Flash.create('success', 'Created');
        if ($scope.mode == 'new') {
          $scope.resetForm()
        }
        $uibModalInstance.dismiss();

      });

    })

  }

})

app.controller("businessManagement.clientRelationships.customer.item", function($scope, $state, $users, $stateParams, $http, Flash) {


})

app.controller("businessManagement.clientRelationships.customer.explore", function($scope, $state, $users, $stateParams, $http, Flash) {





  console.log('ssssssssssssss');
  if ($scope.data != undefined) {
    $scope.customerData = $scope.tab.data
  }
  console.log($scope.data, $scope.contact);

  // http://localhost:8000/api/clientRelationships/dealLite/?result=won&company=2


  $scope.fetchDeals = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/dealLite/?company=' + $scope.customerData.pk
    }).
    then(function(response) {
      $scope.data.deals = response.data;
      $scope.data.paidAmount = 0
      $scope.data.pendingAmount = 0
      $scope.data.overDueAmount = 0
      for (var i = 0; i < $scope.data.deals.length; i++) {
        $scope.data.paidAmount += $scope.data.deals[i].paidAmount
        $scope.data.pendingAmount += $scope.data.deals[i].pendingAmount
        $scope.data.overDueAmount += $scope.data.deals[i].overDueAmount
      }
      // $scope.data2 = [$scope.data.paidAmount, $scope.data.pendingAmount, $scope.data.overDueAmount];
    })
  }

  $scope.fetchDeals();

  $http({
    method: 'GET',
    url: '/api/clientRelationships/contact/?company=' + $scope.customerData.pk
  }).
  then(function(response) {
    // console.log(response.data);
    $scope.contactItems = response.data;
    // console.log($scope.contactItems,'fhsdvfhsdvfhvsdh');
  })

})


app.controller("businessManagement.clientRelationships.relationships.manage", function($scope, $state, $users, $stateParams, $http, Flash, $sce, $aside, $timeout, $uibModal) {
  $scope.getContact = function(contactPk) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.contact.explore.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        contact: function() {
          return contactPk;
        },
      },
      backdrop: false,
      controller: 'businessManagement.clientRelationships.contacts.exploreModal'
    }).result.then(function(rea) {}, function(dis) {})
  }

  $scope.changeStatus = function(status, indx) {
    $scope.deal.contracts[indx].status = status;

    if (status == 'billed') {
      $uibModal.open({
        template: '<div style="padding:30px;"><div class="form-group"><label>Due Date</label>' +
          '<div class="input-group" >' +
          '<input type="text" class="form-control" show-weeks="false" uib-datepicker-popup="dd-MMMM-yyyy" ng-model="contract.dueDate" is-open="status.opened" />' +
          '<span class="input-group-btn">' +
          '<button type="button" class="btn btn-default" ng-click="status.opened = true;"><i class="glyphicon glyphicon-calendar"></i></button>' +
          '</span>' +
          '</div><p class="help-block">Auto set based on Deal due period.</p>' +
          '</div></div>',
        size: 'sm',
        backdrop: true,
        resolve: {
          contract: function() {
            return $scope.deal.contracts[indx];
          },
          deal: function() {
            return $scope.deal;
          }
        },
        controller: function($scope, contract, deal) {
          $scope.contract = contract;
          var dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + deal.duePeriod);
          if ($scope.contract.dueDate == null) {
            $scope.contract.dueDate = dueDate;
          }
          $scope.deal = deal;
        },
      }).result.then(function() {

      }, (function(indx, status) {
        return function() {
          console.log(indx);
          console.log($scope.deal.contracts[indx].dueDate);

          $http({
            method: 'PATCH',
            url: '/api/clientRelationships/contract/' + $scope.deal.contracts[indx].pk + '/',
            data: {
              status: status,
              dueDate: $scope.deal.contracts[indx].dueDate.toISOString().substring(0, 10)
            }
          }).
          then(function(response) {
            $http({
              method: 'GET',
              url: '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk
            }).
            then(function(response) {
              Flash.create('success', 'Saved')
            }, function(err) {
              Flash.create('danger', 'Error occured')
            })
          })



        }
      })(indx, status));



    } else if (status == 'dueElapsed') {

      var sacCode = 998311;
      var c = $scope.deal.contracts[indx];
      for (var i = 0; i < c.data.length; i++) {
        if (c.data[i].taxCode == sacCode) {
          return;
        }
      }

      var fineAmount = $scope.deal.contracts[indx].value * $scope.deal.duePenalty * (1 / 100)

      $http({
        method: 'GET',
        url: '/api/ERP/productMeta/?code=' + sacCode
      }).
      then((function(indx) {
        return function(response) {
          var quoteInEditor = $scope.deal.contracts[indx]
          var productMeta = response.data[0];
          var subTotal = fineAmount * (1 + productMeta.taxRate / 100)
          quoteInEditor.data.push({
            currency: $scope.deal.currency,
            type: 'onetime',
            tax: productMeta.taxRate,
            desc: 'Late payment processing charges',
            rate: fineAmount,
            quantity: 1,
            taxCode: productMeta.code,
            totalTax: fineAmount * (productMeta.taxRate / 100),
            subtotal: subTotal
          })

          quoteInEditor.value += subTotal
          var url = '/api/clientRelationships/contract/' + quoteInEditor.pk + '/'
          var method = 'PATCH'
          var dataToSend = {
            deal: $scope.deal.pk,
            data: JSON.stringify(quoteInEditor.data),
            value: quoteInEditor.value
          };
          $http({
            method: method,
            url: url,
            data: dataToSend
          }).
          then(function(response) {
            $http({
              method: 'GET',
              url: '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk
            }).
            then(function(response) {
              Flash.create('success', 'Saved')
            }, function(err) {
              Flash.create('error', 'Error occured')
            })
          })
        }
      })(indx))


    } else {

      $http({
        method: 'PATCH',
        url: '/api/clientRelationships/contract/' + $scope.deal.contracts[indx].pk + '/',
        data: {
          status: status
        }
      }).
      then(function(response) {

      })

    }


  }

  $scope.sendNotification = function(indx) {

    $scope.quote = $scope.deal.contracts[indx];

    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.quote.notification.html',
      placement: 'right',
      size: 'lg',
      backdrop: false,
      resolve: {
        quote: function() {
          return $scope.quote;
        },
        deal: function() {
          return $scope.deal;
        },
      },
      controller: 'businessManagement.clientRelationships.relationships.quote.notification'
    })
  }


  $scope.editQuote = function(idx) {
    if (typeof idx == 'number') {
      $scope.quoteInEditor = $scope.deal.contracts[idx];
    } else {
      $scope.quoteInEditor = {
        data: [],
        value: 0,
        doc: null,
        status: 'quoted',
        details: '',
        pk: null
      }
    }

    $aside.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        quoteData: function() {
          return $scope.quoteInEditor;
        },
        currency: function() {
          return $scope.deal.currency;
        },
        deal: function() {
          return $scope.deal;
        },
      },
      controller: 'businessManagement.clientRelationships.relationships.quote'
    }).result.then(function() {

    }, function() {
      $scope.fetchDeal()
      // if ($scope.quoteInEditor.pk == null) {
      //   $scope.deal.contracts.push(response.data)
      // }else {
      //   for (var i = 0; i < $scope.deal.contracts.length; i++) {
      //     if ($scope.deal.contracts[i].pk == response.data.pk) {
      //       $scope.deal.contracts[i] = response.data;
      //       $scope.deal.contracts[i].data = JSON.parse($scope.deal.contracts[i].data );
      //     }
      //   }
      // }
    });
  }

  $scope.fetchContracts = function() {
    for (var i = 0; i < $scope.deal.contracts.length; i++) {
      $http({
        method: 'GET',
        url: '/api/clientRelationships/contract/' + $scope.deal.contracts[i] + '/'
      }).
      then(function(response) {
        for (var i = 0; i < $scope.deal.contracts.length; i++) {
          if ($scope.deal.contracts[i] == response.data.pk) {
            $scope.deal.contracts[i] = response.data;
            $scope.deal.contracts[i].data = JSON.parse(response.data.data);
            break
          }
        }

        $timeout(function() {
          // $scope.sendNotification()
        }, 1000)
        // $scope.editQuote();
      })
    }
  }



  $scope.fetchDeal = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/deal/' + $scope.tab.data.pk + '/'
    }).
    then(function(response) {
      $scope.deal = response.data;
      $scope.deal.requirements = $sce.trustAsHtml(response.data.requirements);
      console.log($scope.deal);
      $http({
        method: 'GET',
        url: '/api/ERP/service/' + response.data.company.pk + '/'
      }).
      then(function(response) {
        $scope.deal.company = response.data;
        $scope.fetchContracts();

      });

    });
  }
  $scope.minInfo = false;
  $scope.fetchDeal();



  //===============================================
  $scope.update = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.update.form.html',
      // placement: 'left',
      size: 'md',
      backdrop: true,
      resolve: {
        deal: function() {
          return $scope.deal;
        }

      },
      controller: 'businessManagement.clientRelationships.update.form'
    }).result.then(function(d) {
      $scope.fetchDeal();
    }, function(d) {
      $scope.fetchDeal();
    });
  }

  //============================================



});



//==============================================================
app.controller('businessManagement.clientRelationships.update.form', function($scope, $state, $users, $http, Flash, $timeout, $uibModal, $filter,  deal) {

  // $scope.reset = function() {
  //   $scope.form = {user : '' ,value : '' ,billingType : '' ,requirements : '' ,rate : '' ,closeDate : '' }
  // }
  $scope.currency = ['inr', 'usd']
  //
  $scope.setCurrency = function(cur) {
    $scope.form.currency = cur;
  }

  $scope.form = {
    user: deal.user,
    currency: deal.currency,
    value: deal.value,
    billingType: deal.billingType,
    requirements: deal.requirements,
    rate: deal.rate,
    closeDate: deal.closeDate,
    tin: deal.company.tin
  }

  $scope.userSearch = function(query) {
    //search for the user
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  }


  $scope.save = function() {
    var dataToSend = {
      user: $scope.form.user.pk,
      currency: $scope.form.currency,
      value: $scope.form.value,
      billingType: $scope.form.billingType,
      requirements: $scope.form.requirements,
      rate: $scope.form.rate,
      closeDate: $scope.form.closeDate,
      tin: $scope.form.tin
    };
    tin = $scope.form.tin;
    $http({
      method: 'PATCH',
      url: '/api/clientRelationships/deal/' + deal.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      // console.log(deal.company.pk,'fhbvdhfvsdhfvsdhfv---------------------',tin);
      //

    });
    $http({
      method: 'PATCH',
      url: '/api/ERP/service/' + deal.company.pk + '/',
      data: {
        tin: tin
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      return
    });
  }



});
//===========================================================================================

app.controller("businessManagement.clientRelationships.relationships.quote", function($scope, $state, $users, $stateParams, $http, Flash, $uibModalInstance, quoteData, currency, deal, $timeout) {

  $scope.quote = quoteData;
  $scope.deal = deal
  $scope.firstQuote = false;
  $scope.types = crmRelationTypes;
  $scope.currency = ['inr', 'usd']

  $scope.total = $scope.quote.value;
  $scope.data = $scope.quote.data;


  $scope.resetForm = function() {
    $scope.form = {
      currency: currency,
      type: 'onetime',
      quantity: 0,
      tax: 0,
      rate: 0,
      desc: '',
      productMeta: ''
    };
  }

  $scope.terms = {}
  $http.get('/api/clientRelationships/termsAndConditions/').
  then(function(response) {
    $scope.termsConditions = response.data
    if ($scope.quote.termsAndCondition != undefined) {
      $scope.terms = $scope.quote.termsAndCondition
    } else {
      $scope.terms = response.data[0]
    }
  })

  $timeout(function() {
    if ($scope.quote.coupon) {
      for (var i = 0; i < $scope.discount.length; i++) {
        if ($scope.discount[i].pk == $scope.quote.coupon) {
          $scope.coupon = $scope.discount[i]
        }
      }
    } else {
      $scope.coupon = $scope.discount[0]
    }

  }, 500)


  $scope.$watch('terms', function(newValue, oldValue) {
    $scope.terms = newValue
    if ($scope.terms.body != undefined) {
      $scope.terms.points = $scope.terms.body.split('||')
    }
  })



  $scope.discount = [{
    'title': 'none',
    'percentage': 0
  }]
  $scope.coupon = $scope.discount[0]
  $http({
    method: 'GET',
    url: '/api/clientRelationships/coupon/'
  }).
  then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.discount.push(response.data[i])
    }
  })

  $scope.$watch('form.productMeta', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      if (newValue.typ == 'SAC') {
        $scope.form.productMeta.saleType = 'Service'
      } else {
        $scope.form.productMeta.saleType = 'Product'
      }
      $scope.showTaxCodeDetails = true;
    } else {
      $scope.showTaxCodeDetails = false;
    }
  })

  $scope.setCurrency = function(cur) {
    $scope.form.currency = cur;
  }

  $scope.setType = function(typ) {
    $scope.form.type = typ;
  }
  $scope.save = function() {
    var method;
    var url = '/api/clientRelationships/contract/'
    if ($scope.quote.pk == null) {
      method = 'POST'
    } else {
      method = 'PATCH'
      url += $scope.quote.pk + '/'
    }

    if ($scope.quote.data.length == 0) {
      return;
    }
    var dataToSend = {
      deal: $scope.deal.pk,
      data: JSON.stringify($scope.quote.data),
      value: $scope.quote.calculated.value,
      termsAndCondition: $scope.terms.pk
    };
    if ($scope.coupon.pk != undefined) {
      dataToSend.coupon = $scope.coupon.pk;
    } else {
      dataToSend.coupon = ''
    }

    console.log($scope.quote);
    console.log(dataToSend);
    console.log(url);
    console.log(method);
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $uibModalInstance.dismiss();
    })

    // console.log($scope.quoteData);
    // $uibModalInstance.dismiss();
  };

  $scope.remove = function(idx) {
    $scope.data.splice(idx, 1);
  }

  $scope.dismiss = function() {
    $uibModalInstance.dismiss();
  }

  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?description__contains=' + c).
    then(function(response) {
      return response.data;
    })
  }

  $scope.edit = function(idx) {
    var d = $scope.data[idx];
    $scope.form = {
      currency: d.currency,
      type: d.type,
      quantity: d.quantity,
      tax: d.tax,
      rate: d.rate,
      desc: d.desc
    };
    $http({
      method: 'GET',
      url: '/api/ERP/productMeta/?code=' + d.taxCode
    }).
    then(function(response) {
      $scope.form.productMeta = response.data[0];
    })
    $scope.data.splice(idx, 1);
  }

  $scope.calculateTotal = function() {
    var total = 0;
    var totalTax = 0;
    var grandTotal = 0;
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.data[i].total = parseInt($scope.data[i].quantity) * parseFloat($scope.data[i].rate);
      $scope.data[i].totalTax = $scope.data[i].total * parseFloat($scope.data[i].tax) / 100;
      $scope.data[i].subtotal = $scope.data[i].totalTax + $scope.data[i].total;
      total += $scope.data[i].total;
      totalTax += $scope.data[i].totalTax;
      grandTotal += $scope.data[i].subtotal;
    }
    $scope.totalTax = totalTax;
    $scope.total = total;
    $scope.grandTotal = grandTotal;
    if ($scope.coupon.pk != undefined) {
      $scope.discountRate = $scope.grandTotal * $scope.coupon.percentage / 100
      $scope.finalAmount = $scope.grandTotal - $scope.discountRate
    } else {
      $scope.discountRate = 0
      $scope.finalAmount = 0
    }


    $scope.quote.calculated = {
      value: total,
      tax: totalTax,
      grand: grandTotal
    }

  }

  $scope.add = function() {
    if ($scope.form.tax > 70) {
      Flash.create('warning', 'The tax rate is unrealistic');
      return;
    }
    if (typeof $scope.form.productMeta != 'object') {
      Flash.create('warning', 'Select Product/Service class');
      return;
    }
    $scope.data.push({
      currency: $scope.form.currency,
      type: $scope.form.type,
      tax: $scope.form.productMeta.taxRate,
      desc: $scope.form.desc,
      rate: $scope.form.rate,
      quantity: $scope.form.quantity,
      taxCode: $scope.form.productMeta.code,
      saleType: $scope.form.productMeta.saleType
    })
    $scope.resetForm();
  }

  $scope.resetForm();

  $scope.$watch('data', function(newValue, oldValue) {
    $scope.calculateTotal();
  }, true)

  $scope.$watch('coupon', function(newValue, oldValue) {
    $scope.calculateTotal()
  })

});


app.controller("businessManagement.clientRelationships.relationships.quote.notification", function($scope, $state, $users, $stateParams, $http, Flash, $sce, $aside, quote, deal, $uibModalInstance) {
  $scope.quote = quote;
  $scope.deal = deal;
  $scope.send = function() {
    var contacts = []
    for (var i = 0; i < $scope.deal.contacts.length; i++) {
      if ($scope.deal.contacts[i].checked) {
        contacts.push($scope.deal.contacts[i].pk);
      }
    }

    var internal = []
    for (var i = 0; i < $scope.internalUsers.length; i++) {
      internal.push($scope.internalUsers[i]);
    }

    var toSend = {
      sendEmail: $scope.sendEmail,
      sendSMS: $scope.sendSMS,
      internal: internal,
      contacts: contacts,
      type: $scope.notificationType,
      contract: $scope.quote.pk
    }
    $http({
      method: 'POST',
      url: '/api/clientRelationships/sendNotification/',
      data: toSend
    }).
    then(function() {

    }, function() {
      $scope.reset();
    })
  }




  $scope.cancel = function(e) {
    $uibModalInstance.dismiss();
  };

  $scope.reset = function() {
    for (var i = 0; i < $scope.deal.contacts.length; i++) {
      $scope.deal.contacts[i].checked = false;
    }
    $scope.notificationType = 'Please select';
    $scope.sendEmail = false;
    $scope.sendSMS = false;
    $scope.internalUsers = [];
  }

  $scope.reset();




});
