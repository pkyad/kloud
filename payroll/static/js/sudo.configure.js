
app.config(function($stateProvider) {

  $stateProvider
    .state('admin.configure', {
      url: "/configure",
      templateUrl: '/static/ngTemplates/app.organization.division.info.html',
      controller: 'workforceManagement.organization.division.info',
    })
    .state('admin.integrations', {
      url: "/integrations",
      templateUrl: '/static/ngTemplates/app.organization.division.integrations.html',
      controller: 'workforceManagement.organization.division.integrations',
    })
    .state('admin.pnl', {
      url: "/profit-and-loss",
      templateUrl: '/static/ngTemplates/app.profitandloss.create.form.html',
      controller: 'profitandloss.form.controller'
    })
    .state('admin.cashflow', {
      url: "/cashflow-statement",
      templateUrl: '/static/ngTemplates/app.cashflow.create.form.html',
      controller: 'cashflow.form.controller'
    })
    .state('admin.balancesheet', {
      url: "/balancesheet",
      templateUrl: '/static/ngTemplates/app.balanceSheet.create.form.html',
      controller: 'balanceSheet.form.controller'
    })
    .state('admin.termsandcondition', {
      url: "/purchase-terms-and-conditions",
      templateUrl: '/static/ngTemplates/app.termsandcondition.html',
      controller: 'businessManagement.termscondition'
    })
    .state('admin.salestermsandcondition', {
      url: "/sales-terms-and-conditions",
      templateUrl: '/static/ngTemplates/app.clientRelationships.termscondition.html',
      controller: 'businessManagement.clientRelationships.configure.termscondition'
    })

    .state('admin.pricesheet', {
      url: "/price-sheet",
      templateUrl: '/static/ngTemplates/app.finance.inventory.html',
      controller: 'businessManagement.finance.inventory'
    })

    .state('admin.templates', {
      url: "/email-templates",
      templateUrl: '/static/ngTemplates/app.crm.templates.html',
      controller: 'admin.templates'
    })
    .state('admin.holidays', {
      url: "/company-holidays",
      templateUrl: '/static/ngTemplates/app.settings.holidays.html',
      controller: 'admin.settings.configure.calendar.form'
    })
    .state('admin.costCenters', {
      url: "/cost-centers",
      templateUrl: '/static/ngTemplates/app.finance.costCenter.html',
      controller: 'businessManagement.finance.costCenter'
    })

    .state('admin.termsandconditions', {
      url: "/service-ticketing-terms",
      templateUrl: '/static/ngTemplates/app.finance.termsAndConditions.html',
      controller: 'businessManagement.finance.termsAndConditions'
    })
    .state('admin.documents', {
      url: "/documents",
      templateUrl: '/static/ngTemplates/app.finance.documents.html',
      controller: 'businessManagement.finance.documents'
    })
    .state('admin.crmtermsandcondition', {
      url: "/crmtermsandcondition",
      templateUrl: '/static/ngTemplates/app.clientRelationships.crmtermsandcondition.html',
      controller: 'clientRelationships.crmtermsandcondition'
    })
    // .state('admin.files', {
    //   url: "/email-files",
    //   templateUrl: '/static/ngTemplates/app.crm.files.html',
    //   controller: 'admin.files'
    // })


});


app.controller("workforceManagement.organization.division.integrations", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside , $timeout) {
  // $scope.compDetails = $scope.tab.data;
  $scope.form = {
    ios_sdk_enabled : false,
    react_sdk_enabled : false,
    rest_sdk_enabled : false,
    android_sdk_enabled : false,

  }
    // $http({
    //   method: 'GET',
    //   url: '/api/ERP/service/'+ customerpk +'/'
    // }).then(function(response) {
    //   $scope.compDetails = response.data
    // })

  $http({method : 'GET' , url : '/api/organization/saveSettings/?type=buttonSetting' }).
  then(function(response) {
    $scope.form.ios_sdk_enabled = response.data.ios_sdk_enabled
    $scope.form.react_sdk_enabled = response.data.react_sdk_enabled
    $scope.form.rest_sdk_enabled = response.data.rest_sdk_enabled
    $scope.form.android_sdk_enabled = response.data.android_sdk_enabled
  });

  $scope.openWebSettings = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.customer.webSettings.modal.html',
      size: 'md',
      backdrop: true,
      resolve: {
        compDetails: function() {
          return $scope.compDetails;
        }
      },
      controller: 'controller.customer.webSettings.modal',
    }).result.then(function() {}, function(res) {
    })
  }


  $scope.openUIPathSettings = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.customer.uipathSettings.modal.html',
      size: 'xl',
      backdrop: true,
      position:'left',
      controller: 'controller.customer.uipathSettings.modal',
    }).result.then(function() {}, function(res) {
    })
  }

  $scope.openMessengerSettings = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.customer.openMessengerSettings.modal.html',
      size: 'md',
      backdrop: true,
      controller: 'controller.customer.openMessengerSettings.modal',
    }).result.then(function() {}, function(res) {
    })
  }

  $scope.openWhatsappSettings = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.customer.openWhatsappSettings.modal.html',
      size: 'md',
      backdrop: true,
      controller: 'controller.customer.openWhatsappSettings.modal',
    }).result.then(function() {}, function(res) {
    })
  }

  $scope.changeStatus = function(typ){
    if (typ == 'ios') {
      var dataTosend ={
        ios_sdk_enabled :$scope.form.ios_sdk_enabled,
      }
    }
    if (typ == 'react') {
      var dataTosend ={
        react_sdk_enabled :$scope.form.react_sdk_enabled,
      }
    }
    if (typ == 'rest') {
      var dataTosend ={
        rest_sdk_enabled :$scope.form.rest_sdk_enabled,
      }
    }
    if (typ == 'android') {
      var dataTosend ={
        android_sdk_enabled :$scope.form.android_sdk_enabled,
      }
    }
    dataTosend.type = typ
    $http({
      method: 'POST',
      url: '/api/organization/saveSettings/',
      data: dataTosend
    }).
    then(function(response) {
    })
  }
})


app.controller("admin.configure", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.getappSettings = function() {
    $http({
      method: 'GET',
      url: '/api/ERP/getAllSettings/'
    }).
    then(function(response) {
      $scope.appsettings = response.data;
    })
  }
    $scope.getappSettings()


})
app.controller("admin.settings.configure.hsnsac.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal,$rootScope) {
$scope.resetForm = function(){
  $scope.form ={
    description:'',
    typ:'HSN',
    code:0,
    taxRate:0
  }

}
$scope.resetForm()

$scope.save = function(){
  var dataTosend ={
    description:$scope.form.description,
    typ:$scope.form.typ,
    code:$scope.form.code,
    taxRate:$scope.form.taxRate
  }
  var method ='POST'
  var url ='/api/ERP/productMeta/'
  if ($scope.form.pk != undefined) {
    method = 'PATCH'
    url = '/api/ERP/productMeta/'+$scope.form.pk+'/'
  }
  $http({
    method:method,
    url:url,
    data:dataTosend
  }).then(function(response){
    Flash.create('success','Saved....!!!')
    $scope.alltaxCodes()
    $scope.resetForm()
  })
}

$scope.searchForm = {
  searchValue:''
}
$scope.limit = 15
$scope.offset = 0
$scope.alltaxCodes = function(){
  var url = '/api/ERP/productMeta/?limit='+$scope.limit+'&offset='+$scope.offset
  if ($scope.searchForm.searchValue.length > 0) {
    url +='&search='+$scope.searchForm.searchValue
  }
  $http({
    method:'GET',
    url:url
  }).then(function(response){
    $scope.codes = response.data.results
    $scope.prometaPrev = response.data.previous
    $scope.prometaNext = response.data.next
  })
}
$scope.alltaxCodes()


$scope.previous =function(){
  if ($scope.prometaPrev != null) {
    $scope.offset -= $scope.limit
    $scope.alltaxCodes()
  }
}
$scope.next =function(){
  if ($scope.prometaNext != null) {
    $scope.offset += $scope.limit
    $scope.alltaxCodes()
  }
}

$scope.$on('editTaxcodes', function(event, input) {
  $scope.form  = input.data
});


$scope.editCodes = function(data,idx){
  $scope.codes.splice(idx,1)
  $rootScope.$broadcast('editTaxcodes', {data:data});

}

$scope.delTaxcodes = function(data,idx){
  $http({
    method:'DELETE',
    url:'/api/ERP/productMeta/'+data.pk+'/'
  }).then(function(response){
    Flash.create('success','Deleted....!!')
    $scope.codes.splice(idx,1)
  })
}

})
app.controller("businessManagement.termscondition", function($scope, $state, $users, $stateParams, $http, Flash) {

  $scope.reset = function() {
    $scope.form = {
      title: '',
      version: '',
      heading: '',
      body: '',
      addedPoints: [],
      finalPoints: ''
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

  $scope.save = function() {
    if ($scope.form.addedPoints.length > 0) {
      for (var i = 0; i < $scope.form.addedPoints.length; i++) {
        $scope.form.finalPoints = $scope.form.finalPoints + $scope.form.addedPoints[i] + '||'
      }
      $scope.form.finalPoints = $scope.form.finalPoints.slice(0, $scope.form.finalPoints.length - 2)
    } else {
      Flash.create("warning", "Add Body")
      return
    }


    dataToSend = {
      title: $scope.form.title,
      version: $scope.form.version,
      body: $scope.form.finalPoints,
      heading: $scope.form.heading
    }
    var method = 'POST'
    var url = '/api/finance/termsAndConditions/'
    if ($scope.form.pk) {
      var method = 'PATCH'
      var url = '/api/finance/termsAndConditions/' + $scope.form.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: dataToSend,
    }).
    then(function(response) {
      Flash.create("success", 'Saved!')
      $scope.allData.push(response.data)
      $scope.reset()
    }, function(error) {



    })

  }

  $http({
    method: 'GET',
    url: '/api/finance/termsAndConditions/',
  }).
  then(function(response) {
    $scope.allData = response.data
    console.log($scope.allData, 'lllllllll');
  }, function(error) {

  })

  $scope.edit = function(indx) {
    $scope.form.title = $scope.allData[indx].title
    $scope.form.version = $scope.allData[indx].version
    $scope.form.pk = $scope.allData[indx].pk
    $scope.form.heading = $scope.allData[indx].heading
    $scope.form.body = ''
    $scope.form.addedPoints = $scope.allData[indx].body.split('||')
    $scope.allData.splice(indx, 1)
  }

  $scope.delete = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/finance/termsAndConditions/' + $scope.allData[indx].pk + '/'
    }).
    then(function(response) {
      Flash.create('success', 'Deleted');
    })
    $scope.allData.splice(indx, 1);
  }

})


app.controller('balanceSheet.form.controller' , function($scope , $http, Flash){
  console.log("ssssssssssssssssss");

$scope.refresh = function(){
  $scope.form = {
    currentAsset:'',
    currentAssetAmount:0,
    fixedAsset:'',
    fixedAssetAmount:0,
    otherAsset:'',
    otherAssetAmount:0,
    currentLiability:'',
    currentLiabilityAmount:0,
    longTermLiability:'',
    longTermLiabilityAmount:0,
    ownerEquity:'',
    ownerEquityAmount:0
  }
}
$scope.refresh ()
$scope.getAccount = function(){
  $http({
    method: 'GET',
    url: '/api/finance/getBalanceSheet/',
  }).
  then(function(response) {
    $scope.balance = response.data
  })
}
$scope.getAccount()

  $scope.saveData = function(typ,title,amount,pk){
    if (amount==undefined || amount.length==0 ) {
      Flash.create('warning','Add Opening Balance')
      return
    }
    var  dataToSend = {
      heading:typ,
      title:title,
      group:'balanceSheet',
      credit:amount,
      balance:amount
    }
    var url = '/api/finance/account/'
    var method = 'POST'

    if (pk!=undefined && pk!=null) {
      url = url + pk +'/'
      method = 'PATCH'
    }
    $http({
      method: method,
      url: url,
      data:dataToSend
    }).
    then(function(response) {
      $scope.refresh()
      $scope.getAccount()
    })
  }

  $scope.delete = function(pk){
    $http({
      method: 'DELETE',
      url: '/api/finance/account/'+pk,
    }).
    then(function(response) {
      $scope.getAccount()
    })
  }

});



app.controller('cashflow.form.controller' , function($scope , $http){

$scope.refresh = function(){
  $scope.form = {
    operating:'',
    investing:'',
    financing:'',
  }
}
$scope.refresh ()
$scope.getAllAccount = function(){
  $http({
    method: 'GET',
    url: '/api/finance/getCashFlow/',
  }).
  then(function(response) {
    $scope.data = response.data
  })
}
$scope.getAllAccount()

  $scope.saveData = function(typ,title,pk){
    var  dataToSend ={
      heading:typ,
      title:title,
      group:'cashflow'
    }
    var url = '/api/finance/account/'
    var method = 'POST'

    if (pk!=undefined && pk!=null) {
      url = url + pk +'/'
      method = 'PATCH'
    }
    $http({
      method: method,
      url: url,
      data:dataToSend
    }).
    then(function(response) {
      $scope.refresh()
      $scope.getAllAccount()
    })
  }

  $scope.delete = function(pk){
    $http({
      method: 'DELETE',
      url: '/api/finance/account/'+pk,
    }).
    then(function(response) {
      $scope.getAllAccount()
    })
  }
});

app.controller('profitandloss.form.controller' , function($scope , $http){

$scope.refresh = function(){
  $scope.form = {
    income:'',
    sales:'',
    expenses:'',
    otherIncome:''
  }
}
$scope.refresh ()
$scope.getAllAccount = function(){
  $http({
    method: 'GET',
    url: '/api/finance/getAccount/',
  }).
  then(function(response) {
    $scope.data = response.data
  })
}
$scope.getAllAccount()

  $scope.saveData = function(typ,title,pk){
    var  dataToSend ={
      heading:typ,
      title:title,
      group:'profit and loss'
    }
    var url = '/api/finance/account/'
    var method = 'POST'

    if (pk!=undefined && pk!=null) {
      url = url + pk +'/'
      method = 'PATCH'
    }
    $http({
      method: method,
      url: url,
      data:dataToSend
    }).
    then(function(response) {
      $scope.refresh()
      $scope.getAllAccount()
    })
  }

  $scope.delete = function(pk){
    $http({
      method: 'DELETE',
      url: '/api/finance/account/'+pk,
    }).
    then(function(response) {
      $scope.getAllAccount()
    })
  }

});








app.controller('admin.settings.configure.calendar.form' , function($scope ,$uibModal, $stateParams , $http , $aside , $state , Flash , $users , $filter,$rootScope){

  $scope.holiDayForm = {name : '' , typ : 'restricted' , date : new Date()}



  $scope.openHolidayForm = function(form) {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.holiday.modal.html',
      size: 'md',
      backdrop: true,
      resolve : {
        form : function() {
          return $scope.holiDayForm;
        }
      },
      controller: function($scope, $uibModalInstance, $rootScope, form , $http, Flash, $interval, $timeout) {

        $scope.sampleNames = [
          'Leave policy',
          'Expense Claim policy',
          'Advance for travel policy',
        ]

        $scope.sampleNameIndex = 0;
        $interval(function() {
          $scope.sampleNameIndex += 1;
          if ($scope.sampleNameIndex > 2) {
            $scope.sampleNameIndex = 0;
          }
        }, 5000)

        $scope.holiDayForm = form;

        $timeout(function() {
          $('#holidayName').focus();
        },1000);

        $scope.saveHoliday = function() {
          if ($scope.holiDayForm.name == null || $scope.holiDayForm.name.length == 0) {
            Flash.create('warning', 'Please Mention The Name' );
            return
          }
          if ($scope.holiDayForm.date == null) {
            Flash.create('warning', 'Please Select The Date' );
            return
          }
          var url = '/api/organization/companyHoliday/'
          var method = 'POST';
          var dataToSend = {
            typ : $scope.holiDayForm.typ,
            name : $scope.holiDayForm.name,
          };
          if (typeof $scope.holiDayForm.date == 'object') {
            dataToSend.date = $scope.holiDayForm.date.toJSON().split('T')[0]
          }else {
            dataToSend.date = $scope.holiDayForm.date
          }

          var params = {}

          if ($state.is('businessManagement.KloudERP.holidays')) {
            params = {master : 'yes'}
          }


          if ($scope.holiDayForm.pk) {
            url += $scope.holiDayForm.pk + '/'
            method = 'PATCH'
          }
          console.log(dataToSend);
          $http({method : method , url : url , data : dataToSend , params : params}).
          then(function(response) {
            console.log(response.data);
            if ($scope.holiDayForm.pk) {
              Flash.create('success', 'Updated' );
            }else {

              Flash.create('success', 'Created' );
            }
            $scope.holiDayForm = {typ : 'national' , date : new Date()}
            $scope.allHolidays()
          })
        }


      },
    }).result.then(function() {
      $scope.allHolidays()
    }, function() {
      $scope.allHolidays()
    });


  }



  $scope.searchHoliday={
    searchValue:'',
    year : '2021'
  }

  $scope.allHolidays = function(){
    var url ='/api/organization/companyHoliday/?year=' + $scope.searchHoliday.year ;
    if ($scope.searchHoliday.searchValue.length > 0) {
      url += '&search='+$scope.searchHoliday.searchValue;
    }
    $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.holidays = response.data
    })
  }
  $scope.allHolidays()

  $scope.editHolidays = function(data,idx){
    $scope.holidays.splice(idx,1)
    console.log(data,"490394039");

  }

});



app.controller('businessManagement.finance.inventory', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.search = "";

  $scope.limit = 20
  $scope.offset = 0
  $scope.prevInventory = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.getAll(false, '')
    }
  }
  $scope.nextInventory = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.getAll(false, '')
    }
  }

  $scope.getAll = function(search, searchValue) {
    if (search == true) {
      var url = '/api/finance/inventory/?name__icontains=' + searchValue + '&limit=' + $scope.limit + '&offset=' + $scope.offset
    } else {
      var url = '/api/finance/inventory/?limit=' + $scope.limit + '&offset=' + $scope.offset
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.inventoryData = response.data.results
      $scope.count = response.data.count
      $scope.total = 0
      for (var i = 0; i < $scope.inventoryData.length; i++) {
        $scope.tot = $scope.inventoryData[i].rate * $scope.inventoryData[i].total
        $scope.total += $scope.tot
      }
    })

  }
  $scope.getAll(false, '')

  $scope.$watch('search', function(newValue, oldValue) {
    if (newValue.length > 0) {
      $scope.getAll(true, newValue)
    } else {
      $scope.getAll(false, '')
    }
  })

  $scope.deleteData = function(pkVal, indx) {
    $http({
      method: 'DELETE',
      url: '/api/finance/inventory/' + pkVal
    }).
    then(function(response) {
      $scope.inventoryData.splice(indx, 1)
    })

  }

  $scope.addInventory = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.inventoryProduct.modal.html',
      size: 'xl',
      backdrop: false,

      controller: function($scope, $uibModalInstance, $rootScope) {

        $scope.productMetaSearch = function(query) {
          return $http.get('/api/ERP/productMeta/?search=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.close = function() {
          $uibModalInstance.close();
        }
        $scope.refresh = function() {
          $scope.form = {
            value: 0,
            rate: '',
            name: '',
            refurnished: 0,
            buyingPrice:0,
            sku:'',
            productMeta : '',
            taxDescription:'',
            taxRate:''
          }
        }

        $scope.refresh()

        $scope.selectedMeta = function(){
            if (typeof $scope.form.taxCode == 'object') {
              $scope.form.taxRate = $scope.form.taxCode.taxRate
              $scope.form.taxCode  = $scope.form.taxCode.code
            }
        }

        $scope.saveInventory = function() {
          if ($scope.form.name == undefined || $scope.form.name == '') {
            Flash.create("warning", 'Add name')
            return
          }
          if ($scope.form.buyingPrice == undefined ||  $scope.form.buyingPrice == null  || $scope.form.buyingPrice.length == 0) {
            Flash.create("warning", 'Add Selling Price')
            return
          }
          if ($scope.form.rate == undefined || $scope.form.rate == '') {
            Flash.create("warning", 'Add Price')
            return
          }
          var toSend = {
            value: $scope.form.value,
            rate: $scope.form.rate,
            name: $scope.form.name,
            // productMeta: $scope.form.productMeta.pk,
            buyingPrice: $scope.form.buyingPrice,
          }
          if ($scope.form.sku != undefined &&  $scope.form.sku != null  ) {
            toSend.sku = $scope.form.sku
          }

          // if ($scope.form.productMeta!=null) {
          //   toSend.productMeta = $scope.form.productMeta
          // }
          if ($scope.form.taxRate!=null) {
            toSend.taxRate = $scope.form.taxRate
          }
          if ($scope.form.taxCode!=null) {
            toSend.taxCode = $scope.form.taxCode
          }
          $http({
            method: 'POST',
            url: '/api/finance/inventory/',
            data: toSend
          }).
          then(function(response) {
            Flash.create("success", 'Saved')
            $scope.refresh()
          })
        }
      },
    }).result.then(function() {

      $scope.getAll(false, '')
    }, function() {

    });
  }


  $scope.toggleSellable = function(sellable, pk) {
    $http({
      method: 'PATCH',
      url: '/api/finance/inventory/' + pk + '/',
      data: {
        sellable: sellable
      }
    }).then(function(response) {

    })
  }

  $scope.postData = function(idx) {
    console.log($scope.inventoryData[idx]);

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.inventoryProduct.edit.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        data: function() {
          return $scope.inventoryData[idx];
        }
      },


      controller: function($scope, $uibModalInstance, $rootScope, data) {
        $scope.close = function() {
          $uibModalInstance.close();
        }
        $scope.form = data;
        // $scope.form=$scope.data
        // $scope.form = {
        //   description: $scope.data.description,
        //   richtxtDesc: $scope.data.richtxtDesc,
        //   img1: emptyFile,
        //   img2: emptyFile,
        //   img3: emptyFile,
        //   productMeta: '',
        //   category: $scope.data.category,
        //   name: $scope.data.name,
        //   total: $scope.data.total,
        //   rate: $scope.data.rate,
        //   refurnished: $scope.data.refurnished,
        //   totalRef: $scope.data.totalRef,
        //   buyingPrice:$scope.data.buyingPrice,
        //   sku:$scope.data.sku
        // }
        // if ($scope.data.productMeta == null) {
        //   $scope.form.productMeta = ''
        // } else {
        //   $scope.form.productMeta = $scope.data.productMeta.description
        // }
        $scope.productSearch = function(query) {
          return $http.get('/api/ERP/productMeta/?search=' + query).
          then(function(response) {
            return response.data;
          })
        }
        $scope.invSearch = function(query) {
          return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).
          then(function(response) {
            return response.data.results;
          })
        }

        $scope.selectedMeta = function(){
            if (typeof $scope.form.taxCode == 'object') {
              // $scope.form.taxDescription = $scope.form.productMeta.description
              $scope.form.taxRate = $scope.form.taxCode.taxRate
              $scope.form.taxCode  = $scope.form.taxCode.code
            }
        }

        $scope.saveInventory = function() {
          var fd = new FormData();
          // if ($scope.form.productMeta.pk == undefined) {
          //   console.log("herrrrrrrrrrrrrrrr", $scope.data.productMeta.pk);
          //   fd.append('productMeta', $scope.data.productMeta.pk);
          // } else {
          //   console.log("therrrrrrrrrrrrrrrr");
          //   fd.append('productMeta', $scope.form.productMeta.pk);
          //
          // }
          // console.log($scope.form.img1, 'sss');

          fd.append('name', $scope.form.name);
          fd.append('rate', $scope.form.rate);
          fd.append('description', $scope.form.description);
          console.log($scope.form.category);
          if ($scope.form.category != null && $scope.form.category.pk) {
            fd.append('category', $scope.form.category.name);
          } else if ($scope.form.category != null && $scope.form.category.length > 0) {
            fd.append('category', $scope.form.category);
          }

          if ($scope.form.productMeta!=null) {
            fd.append('productMeta', $scope.form.productMeta);
          }
          if ($scope.form.taxRate!=null) {
            fd.append('taxRate', $scope.form.taxRate);
          }
          if ($scope.form.taxCode!=null) {
            fd.append('taxCode', $scope.form.taxCode);
          }
          // fd.append('richtxtDesc', $scope.form.richtxtDesc);
          // if (typeof $scope.form.img1 != 'string' && $scope.form.img1 != emptyFile) {
          //   fd.append('img1', $scope.form.img1);
          // }
          // if (typeof $scope.form.img2 != 'string' && $scope.form.img2 != emptyFile) {
          //   fd.append('img2', $scope.form.img2);
          // }
          // if (typeof $scope.form.img3 != 'string' && $scope.form.img3 != emptyFile) {
          //   fd.append('img3', $scope.form.img3);
          // }



          $http({
            method: 'PATCH',
            url: '/api/finance/inventory/' + $scope.form.pk + '/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create("success", 'Saved')
            $uibModalInstance.dismiss(response.data);
          })

        }

      }
    }).result.then(function() {}, function(res) {
      if (res.pk) {
        $scope.inventoryData[idx] = res
      }
    });
  }




})




app.controller("admin.files", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.create = function(data, txt) {
    console.log(data,txt,"309900219012");
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.configure.files.form.html',
      size: 'lg',
      // placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
          if (data == undefined) {

            return data
          } else {
            return data
          }
        },
        txt: function() {
          $scope.text = txt
          return $scope.text
        }

      },
      controller: "businessManagement.clientRelationships.configure.files.form"
    })

  }


  $scope.data = {
    tableData: [],
    templatetableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.clientRelationships.configure.files.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/clientRelationships/files/',
    // filterSearch: true,
    searchField: 'title',
    deletable: true,
    itemsNumPerView: [9, 18, 36],
    multiselectOptions: [{
      icon: 'fa fa-plus',
      text: 'New'
    }],
    // getParams: [{
    //   key: 'vendor',
    //   value: false
    // }]
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);

    for (var i = 0; i < $scope.data.tableData.length; i++) {
      $scope.fileData = $scope.data.tableData[i]
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          var title = 'Edit File :';
          var appType = 'fileEditor';

        } else if (action == 'details') {
          var title = 'Details :';
          var appType = 'fileExplorer';
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



      }


    }
    if (action == 'New') {
      $scope.create(undefined,false);
    } else if (action == 'editFile') {
      $http({
        method: 'GET',
        url: '/api/clientRelationships/files/' + target + '/'
      }).then(function(response) {
        $scope.create(response.data, false)

      })
    }
  }

  console.log($scope.tab, "934904904903");

});

app.controller('admin.templates' , function($scope , $state , $users , $uibModal,$http ) {

  $scope.create = function(data, txt) {
    console.log(data,txt,"309900219012");
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.clientRelationships.configure.templates.form.html',
      size: 'lg',
      // placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
          if (data == undefined) {

            return data
          } else {
            return data
          }
        },
        txt: function() {
          $scope.text = txt
          return $scope.text
        }

      },
      controller: "businessManagement.clientRelationships.configure.templates.form"
    })

  }
  var templateviews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.clientRelationships.configure.template.item.html',
  }, ];


  $scope.templateconfig = {
    views: templateviews,
    url: '/api/clientRelationships/emailTemplate/',
    // filterSearch: true,
    searchField: 'title',
    deletable: true,
    itemsNumPerView: [9, 18, 36],
    multiselectOptions: [{
      icon: 'fa fa-plus',
      text: 'New'
    }],
    // getParams: [{
    //   key: 'vendor',
    //   value: false
    // }]
  }


  $scope.templatetableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);

    for (var i = 0; i < $scope.data.templatetableData.length; i++) {
      if ($scope.data.templatetableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          var title = 'Edit Template :';
          var appType = 'templateEditor';
        } else if (action == 'details') {
          var title = 'Details :';
          var appType = 'templateExplorer';
          $scope.addTab({
            title: title + $scope.data.templatetableData[i].title,
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
    if (action == 'New') {
      $scope.create(undefined,true)
    }
    else if (action == 'editTemplate') {
      $http({
        method: 'GET',
        url: '/api/clientRelationships/emailTemplate/' + target + '/'
      }).then(function(response) {
        $scope.create(response.data, true)

      })
    }

  }
})

app.controller('businessManagement.clientRelationships.configure.templates.form' , function($scope,Flash , $state , $users , $uibModal,$http,data, txt, $uibModalInstance ) {


  $scope.fileSearch = function(query) {
    return $http.get('/api/clientRelationships/files/?title__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    statusbar: false,
    height: 400,
    menubar:false,
    toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent | bold italic underline link | style-p style-h1 style-h2 style-h3 | addImage',
    setup: function(editor) {

      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name) {
        editor.addButton("style-" + name, {
          tooltip: "Toggle " + name,
          text: name.toUpperCase(),
          onClick: function() {
            editor.execCommand('mceToggleFormat', false, name);
          },
          onPostRender: function() {
            var self = this,
            setup = function() {
              editor.formatter.formatChanged(name, function(state) {
                self.active(state);
              });
            };
            editor.formatter ? setup() : editor.on('init', setup);
          }
        })
      });

      editor.addButton('addImage', {
        text: 'Add Image',
        icon: false,
        onclick: function(evt) {
          console.log(editor);
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.blog.modal.html',
            size: 'sm',
            backdrop: true,
            controller: function($scope, $http, $uibModalInstance) {
              $scope.form = {
                file: emptyFile,
                alt: ''
              }

              $scope.add = function() {
                var fd = new FormData();
                fd.append('file', $scope.form.file);
                $http({
                  method: 'POST',
                  url: '/api/PIM/saveImage/',
                  data: fd,
                  transformRequest: angular.identity,
                  headers: {
                    'Content-Type': undefined
                  }
                }).
                then(function(response) {
                  console.log(response.data);

                  $uibModalInstance.dismiss({
                    file: response.data.link,
                    alt: $scope.form.alt,
                    height: response.data.height,
                    width: response.data.width
                  })
                })
              }
            },
          }).result.then(function() {

          }, function(d) {
            editor.editorCommands.execCommand('mceInsertContent', false, '<br><img alt="' + d.alt + '" height="' + d.height + '" width="' + d.width + '" src="' + d.file + '"/>')

          });



        }
      })
    },
  };

  $scope.addFile = function() {
    $scope.form.files.push($scope.form.fileSelected)
    $scope.form.fileSelected = ''
  }

  $scope.deleteFile = function(pkVal, indx) {
    $scope.form.files.splice(indx, 1)
  }

  $scope.resetForm = function() {
    $scope.form = {
      title: '',
      description: '',
      template: '',
      files: [],
      filesPk: [],
      fileSelected: '',
      creator: false
    }
  }
  $scope.resetForm()

  if (data == undefined) {
    $scope.mode = 'new';
    $scope.resetForm()
  } else {
    $scope.mode = 'edit';
    $scope.form = data
    console.log($scope.form, 'llllll');
  }

  $scope.me = $users.get('mySelf');

  $scope.saveTemplate = function() {

    $scope.form.filesPk = []
    for (var i = 0; i < $scope.form.files.length; i++) {
      $scope.form.filesPk.push($scope.form.files[i].pk)
    }



    if ($scope.form.title == '') {
      Flash.create("warning", "Add Title")
      return
    }



    if ($scope.form.template == '') {
      Flash.create("warning", "Add data to Template")
      return
    }

    var dataToSend = {
      title: $scope.form.title,
      // description: $scope.form.description,
      template: $scope.form.template,
      files: $scope.form.filesPk,
      user: $scope.me.pk,
      creator: $scope.form.creator
    }



    if ($scope.mode == 'edit') {
      var method = 'PATCH'
      var url = "/api/clientRelationships/emailTemplate/" + $scope.form.pk + '/'
    } else {
      var method = 'POST'
      var url = "/api/clientRelationships/emailTemplate/"
    }

    $http({
      method: method,
      url: url,
      data: dataToSend

      }).
      then(function(response) {
        Flash.create("success", 'Saved!')
        $uibModalInstance.dismiss()
        if ($scope.mode == 'new') {
          $scope.resetForm()
        }
      }, function(error) {

      })
    }
})


app.controller("businessManagement.clientRelationships.configure.files.form", function($scope, $state, $users, $stateParams, $http, Flash, data, txt, $uibModalInstance) {


  $scope.fileOrTemplates = txt
    $scope.resetFileForm = function() {
      $scope.form = {
        attachment: emptyFile,
        // version: '',
        title: '',
        // description: '',
        rawFiles: emptyFile,
      }
    }
    $scope.resetFileForm()
    console.log(txt, "432989048nmds");

    if (data != undefined) {
      $scope.mode = 'edit';
      $scope.form = data
    } else {
      $scope.mode = 'new';
      $scope.resetFileForm()
    }

    $scope.me = $users.get('mySelf');

    $scope.saveFile = function() {
      var fd = new FormData();
      // console.log($scope.form.attachment.name);

      if ($scope.form.title == '') {
        Flash.create("warning", "Add Title")
        return
      } else {
        fd.append('title', $scope.form.title)
      }


      console.log(typeof $scope.form.rawFiles, $scope.form.rawFiles);

      if ($scope.form.attachment != emptyFile && typeof $scope.form.attachment != 'string') {
        fd.append('attachment', $scope.form.attachment);
        fd.append('filename', $scope.form.attachment.name);
      } else {
        if ($scope.mode == 'new') {
          Flash.create("warning", "Add Attachment")
          return

        }
      }
      if ($scope.form.rawFiles != emptyFile && typeof $scope.form.rawFiles != 'string' && $scope.form.rawFiles != null) {
        fd.append('rawFiles', $scope.form.rawFiles);
      }
      fd.append('user', me.pk);
      if ($scope.mode == 'edit') {
        var method = 'PATCH'
        var url = "/api/clientRelationships/files/" + $scope.form.pk + '/'
      } else {
        var method = 'POST'
        var url = "/api/clientRelationships/files/"
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
        $uibModalInstance.dismiss()
        if ($scope.mode == 'new') {
          $scope.resetFileForm()
        }
      }, function(error) {
        ;
      })
    }








})







app.controller("businessManagement.clientRelationships.configure.termscondition", function($scope, $state, $users, $stateParams, $http, Flash) {
$scope.appliacableList = ['INVOICE' , 'SALES ORDER']

  $scope.reset = function() {
    $scope.form = {
      heading: '',
      body: '',
      addedPoints: [],
      finalPoints: '',
      default: false,
      prefix : '',
      typ : $scope.appliacableList[0]
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

  $scope.save = function() {
    if ($scope.form.addedPoints.length > 0) {
      for (var i = 0; i < $scope.form.addedPoints.length; i++) {
        $scope.form.finalPoints = $scope.form.finalPoints + $scope.form.addedPoints[i] + '||'
      }
      $scope.form.finalPoints = $scope.form.finalPoints.slice(0, $scope.form.finalPoints.length - 2)
    } else {
      Flash.create("warning", "Add Body")
      return
    }

    if ($scope.form.prefix == null || $scope.form.prefix.length == 0) {
      Flash.create("warning", "Add prefix")
      return
    }

    var dataToSend = {
      body: $scope.form.finalPoints,
      heading: $scope.form.heading,
      default: $scope.form.default,
      prefix :  $scope.form.prefix,
      typ :  $scope.form.typ,
    }
    var method = 'POST'
    var url = '/api/finance/termsAndConditions/'
    if ($scope.form.pk) {
      var method = 'PATCH'
      var url = '/api/finance/termsAndConditions/' + $scope.form.pk + '/'
    }

    $http({
      method: method,
      url: url,
      data: dataToSend,
    }).
    then(function(response) {
      Flash.create("success", 'Saved!')
      $scope.allData.push(response.data)
      $scope.reset()
    }, function(error) {



    })

  }

  $http({
    method: 'GET',
    url: '/api/finance/termsAndConditions/',
  }).
  then(function(response) {
    $scope.allData = response.data
    console.log($scope.allData, 'lllllllll');
  }, function(error) {

  })

  $scope.edit = function(indx) {
    $scope.form.default = $scope.allData[indx].default
    $scope.form.pk = $scope.allData[indx].pk
    $scope.form.heading = $scope.allData[indx].heading
    $scope.form.prefix = $scope.allData[indx].prefix
    $scope.form.typ = $scope.allData[indx].typ
    $scope.form.body = ''
    $scope.form.addedPoints = $scope.allData[indx].body.split('||')
    $scope.allData.splice(indx, 1)
  }

  $scope.delete = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/finance/termsAndConditions/' + $scope.allData[indx].pk + '/'
    }).
    then(function(response) {
      Flash.create('success', 'Deleted');
    })
    $scope.allData.splice(indx, 1);
  }

})


app.controller("businessManagement.clientRelationships.configure.coupon", function($scope, $state, $users, $stateParams, $http, Flash) {
  $scope.coupon = []
  $scope.getCoupon = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/coupon/',
    }).
    then(function(response) {
      $scope.coupon = response.data
    }, function(error) {})
  }
  $scope.getCoupon()

  $scope.reset = function() {
    $scope.form = {
      title: '',
      description: '',
      percentage: 0
    }
  }
  $scope.reset()

  $scope.save = function() {
    dataToSend = $scope.form

    var method = 'POST'
    var url = '/api/clientRelationships/coupon/'
    if ($scope.form.pk) {
      var method = 'PATCH'
      var url = '/api/clientRelationships/coupon/' + $scope.form.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend,
    }).
    then(function(response) {
      Flash.create("success", 'Saved!')
      $scope.coupon.push(response.data)
      $scope.reset()
    }, function(error) {



    })
  }

  $scope.edit = function(pk, indx) {
    $scope.form = $scope.coupon[indx]
    $scope.coupon.splice(indx, 1)

  }


})

app.controller('businessManagement.finance.costCenter.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  cCenter, $uibModalInstance) {
  if (cCenter.pk) {
    $scope.mode = 'edit';
    $scope.form = cCenter
  } else {
    $scope.mode = 'new';
    $scope.form = {
      head: '',
      name: '',
      code: '',
      account: '',
    }
  }
  $scope.accountSearch = function(query) {
    return $http.get('/api/finance/account/?search__in=' + query+'&limit=10').
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?limit=10&username__contains=' + query).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.getuserName = function(user) {
    if (user) {
      ret = user.first_name
      if (user.last_name) {
        ret += ' ' + user.last_name
      }
      return ret
    }
  }
  $scope.getAccountName = function(acc) {
    if (acc) {
      return acc.number + ' ( ' + acc.bank + ' )'
    }
  }
  $scope.savecCenter = function() {
    var f = $scope.form
    if (f.head.length == 0 || f.head.pk == undefined || f.account.length == 0 || f.account.pk == undefined || f.name.length == 0 || f.code.length == 0) {
      Flash.create('warning', 'All Fields Are Required');
      return;
    }
    var toSend = {
      name: f.name,
      code: f.code,
      head: f.head.pk,
      account: f.account.pk,
    }
    console.log(toSend);
    var url = '/api/finance/costCenter/';
    if ($scope.mode == 'new') {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += $scope.form.pk + '/';
    }
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $uibModalInstance.dismiss('saved')
    })
  }
});


app.controller('businessManagement.finance.costCenter', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  console.log('const center');

  $scope.createCC = function(name , parent, indx) {
    var url = '/api/finance/costCenter/';
    $http({
      method:'POST',
      url:url,
      data : {name : name , parent : parent}
    }).then((function(parent, indx) {
      return function(response){
        if (parent) {
          $scope.costData[indx].children.push(response.data);
          $scope.costData[indx].newName = '';
        }else{
          $scope.costData.push(response.data);
          $scope.form.name = ""
        }
      }
    })(parent, indx))
  }

  $scope.update = function(name , pk) {
    $http({method : 'PATCH' , url : '/api/finance/costCenter/' + pk + '/' , data : {name : name}}).
    then(function(response) {

    })
  }


  $scope.delete = function(pk , parentIndx , indx) {
    console.log({parentIndx , indx})
    $http({method : 'DELETE' , url : '/api/finance/costCenter/' + pk +'/'}).
    then((function(pk ) {
      for (var i = 0; i < $scope.costData.length; i++) {
        if ($scope.costData[i].pk == pk) {
          $scope.costData.splice(i, 1);
          break
        }
        for (var j = 0; j < $scope.costData[i].children.length; j++) {
          if ($scope.costData[i].children[j].pk == pk) {
            $scope.costData[i].children.splice(j, 1)
            break;
          }
        }
      }
    })(pk))
  }


  $scope.fetchCostData = function(){
    var url = '/api/finance/costCenter/';
    $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.costData = response.data;
    })
  }
  $scope.fetchCostData()








})

app.controller('businessManagement.finance.costCenter.item', function($scope, $http) {

});

app.controller('businessManagement.finance.costCenter.explore', function($scope, $http) {

  $scope.costCenter = $scope.tab.data.cData

  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0
  $scope.prev = function(){
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchCostData()
    }
  }
  $scope.next = function(){
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchCostData()
    }
  }

  $scope.searchForm = {
    search: ''
  }

  $scope.exploreCostData = function(){
  var url = '/api/projects/project/?limit='+$scope.limit+'&offset='+$scope.offset
  if ($scope.searchForm.search.length>0) {
      url = url+'&title__icontains='+$scope.searchForm.search
    }
  $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.projectData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.exploreCostData()

});

app.controller("businessManagement.finance.termsAndConditions", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


    $scope.reset = function() {
      $scope.form = {
        version: '',
        heading: '',
        body: '',
        addedPoints: [],
        finalPoints: ''
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

    $scope.save = function() {
      if ($scope.form.addedPoints.length > 0) {
        for (var i = 0; i < $scope.form.addedPoints.length; i++) {
          $scope.form.finalPoints = $scope.form.finalPoints + $scope.form.addedPoints[i] + '||'
        }
        $scope.form.finalPoints = $scope.form.finalPoints.slice(0, $scope.form.finalPoints.length - 2)
      } else {
        Flash.create("warning", "Add Body")
        return
      }


      dataToSend = {
        version: $scope.form.version,
        body: $scope.form.finalPoints,
        heading: $scope.form.heading
      }
      var method = 'POST'
      var url = '/api/clientRelationships/configureTermsAndConditions/'
      if ($scope.form.pk) {
        var method = 'PATCH'
        var url = '/api/clientRelationships/configureTermsAndConditions/' + $scope.form.pk + '/'
      }

      $http({
        method: method,
        url: url,
        data: dataToSend,
      }).
      then(function(response) {
        Flash.create("success", 'Saved!')
        $scope.allData.push(response.data)
        $scope.reset()
      }, function(error) {



      })

    }

    $http({
      method: 'GET',
      url: '/api/clientRelationships/configureTermsAndConditions/',
    }).
    then(function(response) {
      $scope.allData = response.data
      console.log($scope.allData, 'lllllllll');
    }, function(error) {

    })

    $scope.edit = function(indx) {
      $scope.form.title = $scope.allData[indx].title
      $scope.form.version = $scope.allData[indx].version
      $scope.form.pk = $scope.allData[indx].pk
      $scope.form.heading = $scope.allData[indx].heading
      $scope.form.body = ''
      $scope.form.addedPoints = $scope.allData[indx].body.split('||')
      $scope.allData.splice(indx, 1)
    }

    $scope.delete = function(indx) {
      $http({
        method: 'DELETE',
        url: '/api/clientRelationships/configureTermsAndConditions/' + $scope.allData[indx].pk + '/'
      }).
      then(function(response) {
        Flash.create('success', 'Deleted');
      })
      $scope.allData.splice(indx, 1);
    }




})

app.controller("businessManagement.finance.documents", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  $scope.form = {
    name : '',
    description:'',
    documentFile:emptyFile
  }

  $scope.openFileUploader = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.document.modal.html',
      size: 'md',
      backdrop: true,
      resolve : {
        form : function() {
          return $scope.form;
        }
      },
      controller: function($scope, $uibModalInstance, $rootScope, form , $http, Flash, $interval, $timeout) {

        $scope.sampleNames = [
          'Leave policy',
          'Expense Claim policy',
          'Advance for travel policy',
        ]

        $scope.sampleNameIndex = 0;
        $interval(function() {
          $scope.sampleNameIndex += 1;
          if ($scope.sampleNameIndex > 2) {
            $scope.sampleNameIndex = 0;
          }
        }, 5000)



        $scope.form = form;

        $timeout(function() {
          $('#documentName').focus();
        },1000);


        console.log(form);
        $scope.saveDocument = function(){
          if ($scope.form.name.length == 0) {
            Flash.create('warning','Name is required')
            return
          }

          if ($scope.form.documentFile == emptyFile && ($scope.form.documentFile == '' || $scope.form.documentFile == undefined)) {
            Flash.create('danger', 'Add File')
            return;
          }
          method = 'POST'
          url = '/api/HR/document/'
          if ($scope.form.pk) {
            method = 'PATCH'
            url =url + $scope.form.pk + '/'
          }
          var fd = new FormData();
          fd.append('name', $scope.form.name);
          if ($scope.form.documentFile != emptyFile && $scope.form.documentFile != null && typeof $scope.form.documentFile != 'string') {
            fd.append('documentFile', $scope.form.documentFile)
          }
          if ($scope.form.description!=null && $scope.form.description.length>0) {
            fd.append('description', $scope.form.description)
          }
          $http({
            method:method,
            url:url,
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).then(function(response){
            Flash.create('success','Saved....!!!')
            $uibModalInstance.dismiss();
          })
        }



      },
    }).result.then(function() {
      $scope.allDocuments()
    }, function() {
      $scope.allDocuments()
    });
  }

  $scope.downloadFile = function(link) {
    window.open(link , '_blank');
  }

  $scope.openFile = function() {
    $('#filePicker').click();
  }

  $scope.$watch('form.documentFile' , function(newValue , oldValue) {
    if (newValue != undefined && newValue != emptyFile  && newValue.size > 0) {
      $scope.form.name = '';
      $scope.form.description = '';
      $scope.form.pk = undefined;
      $scope.openFileUploader();
    }
  })

  $scope.allDocuments = function(){
    var url ='/api/HR/document/';
    $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.allDocs = response.data
    })
  }

  $scope.allDocuments()

  $scope.editDocument = function(indx){
    $scope.form = $scope.allDocs[indx];
    $scope.openFileUploader();
  }

  $scope.deleteDocument = function(indx){
    $http({
      method:'DELETE',
      url:'/api/HR/document/'+$scope.allDocs[indx].pk+'/'
    }).then(function(response){
      Flash.create('success','Saved....!!!')
      $scope.allDocuments()
    })
  }
})



app.controller("controller.customer.webSettings.modal", function($scope, $users, $timeout, $uibModalInstance,$http,Flash) {
  $scope.form = {url : '' , email : ''}

   $http({method : 'GET' , url : '/api/organization/saveSettings/?type=web' }).
   then(function(response) {
     $scope.form.url = response.data.url;
     $scope.chatterLink = response.data.chatterLink;
     $scope.host = response.data.host;
     var srcUrl = response.data.host + '/script/chatter-'+ $scope.chatterLink +'.js';
     $scope.src = '<script src="'+ srcUrl +'"></script>'
   });

   $scope.sendEmail = function() {
     if ($scope.form.email.length >0) {
       $http({
         method: 'POST',
         url: '/api/organization/emailScript/',
         data: {
           email: $scope.form.email,
           script: $scope.src,
         }
       }).then(function(response) {
         Flash.create('success', 'Mail Sent')
         // $scope.emailAddress = ''
         $uibModalInstance.dismiss()
       });
     }
   }

   $scope.save = function() {

     if ( $scope.form.url == "" ) {
       Flash.create('warning' , 'Please fill all the details')
       return;
     }

     var toSend = {
       data : $scope.form,
       type : 'web',
     }
     $http({method : 'POST' , url : '/api/organization/saveSettings/' , data : toSend}).
     then(function(response) {
       Flash.create('success' , 'Saved')
     }, function(err) {
       Flash.create('danger' , 'Error')
     })
   }

   $scope.cancel = function() {
     $uibModalInstance.dismiss();
   }

})


app.controller("controller.customer.uipathSettings.modal", function($scope, $users, $timeout, $uibModalInstance,$http,Flash) {
  $scope.form = {url : '' , email : '' , password : '' , tenant : '' , error : false, success : false}


  $http({method : 'GET' , url : '/api/organization/saveSettings/?type=uipath' }).
  then(function(response) {
    $scope.form.url = response.data.url;
    $scope.form.email = response.data.email;
    $scope.form.tenant = response.data.tenant;
    $scope.form.password = response.data.password;
  });


  $scope.save = function() {

    if ($scope.form.email == "" || $scope.form.password == "" || $scope.form.url == "" || $scope.form.tenant == "") {
      Flash.create('warning' , 'Please fill all the details')
      return;
    }


    var toSend = {
      data : $scope.form,
      type : 'uipath',
    }
    $http({method : 'POST' , url : '/api/organization/saveSettings/' , data : toSend}).
    then(function(response) {
      $scope.form.success = true;
      $scope.form.error = false;
      Flash.create('success' , 'Saved')
    }, function(err) {
      Flash.create('danger' , 'Error')
      $scope.form.error = true;
      $scope.form.success = false;
    })
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }

})


app.controller("controller.customer.openMessengerSettings.modal", function($scope, $users, $timeout, $uibModalInstance,$http,Flash) {
  $scope.form = {access_token : '' , pageID : '' }


  $http({method : 'GET' , url : '/api/organization/saveSettings/?type=messenger'}).
  then(function(response) {
    $scope.form.access_token = response.data.access_token;
    $scope.form.pageID = response.data.pageID;
  });


  $scope.save = function() {

    if ($scope.form.access_token == "" || $scope.form.pageID == "") {
      Flash.create('warning' , 'Please fill all the details')
      return;
    }


    var toSend = {
      data : $scope.form,
      type : 'messenger',
    }
    $http({method : 'POST' , url : '/api/organization/saveSettings/' , data : toSend}).
    then(function(response) {
      $scope.form.success = true;
      $scope.form.error = false;
      Flash.create('success' , 'Saved')
    }, function(err) {
      Flash.create('danger' , 'Error')
      $scope.form.error = true;
      $scope.form.success = false;
    })
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }

})


app.controller("controller.customer.openWhatsappSettings.modal", function($scope, $users, $timeout, $uibModalInstance,$http,Flash) {
  $scope.form = {twillioAccountSID : '' , trillioAuthToken : '' , whatsappNumber : '' }


  $http({method : 'GET' , url : '/api/organization/saveSettings/?type=whatsapp'}).
  then(function(response) {
    $scope.form.twillioAccountSID = response.data.twillioAccountSID;
    $scope.form.trillioAuthToken = response.data.trillioAuthToken;
    $scope.form.whatsappNumber = response.data.whatsappNumber;
  });


  $scope.save = function() {

    if ($scope.form.access_token == "" || $scope.form.pageID == "") {
      Flash.create('warning' , 'Please fill all the details')
      return;
    }


    var toSend = {
      data : $scope.form,
      type : 'whatsapp',
    }
    $http({method : 'POST' , url : '/api/organization/saveSettings/' , data : toSend}).
    then(function(response) {
      $scope.form.success = true;
      $scope.form.error = false;
      Flash.create('success' , 'Saved')
    }, function(err) {
      Flash.create('danger' , 'Error')
      $scope.form.error = true;
      $scope.form.success = false;
    })
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  }

})
