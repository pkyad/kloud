var projectsStepsData = [{
    indx: 1,
    text: 'created',
    display: 'Created'
  },
  {
    indx: 2,
    text: 'Sent',
    display: 'Sent For Approval'
  },
  // {
  //   indx: 3,
  //   text: 'GRN',
  //   display: 'GRN'
  // },
  {
    indx: 3,
    text: 'Approved',
    display: 'Approved'
  },
  // {
  //   indx: 4,
  //   text: 'ongoing',
  //   display: 'OnGoing'
  // },
];


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

app.controller('businessManagement.finance.financeExpenses', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.limit = 20
  $scope.form = {
    dated: 'quater',
    status: 'all',
    search: '',
    open : false
  }

  $scope.openMenu = function() {
    if (!$scope.form.open) {
      $scope.form.open = true;
    }
  }

  $scope.purchaseOrders = function() {
    var url = '/api/finance/fetchExpenses/?search=' + $scope.form.search +'&limit='+$scope.limit+ '&only='
    // if ($scope.form.dated.length > 0) {
    //   url = url + '&dated=' + $scope.form.dated
    // }
    if ($scope.form.status.length > 0 ) {
      url = url + '&status=' + $scope.form.status
    }
    $http({
      method: 'GET',
      url: url
    }).then(function(response) {
      $scope.purchsedData = response.data

    })
  }
  $scope.purchaseOrders()

  $scope.loadMore = function(){
    $scope.limit = $scope.limit+20
    $scope.purchaseOrders()
  }

  $scope.goTo = function(typ, id){
    if (typ == 'EXPENSE SHEET') {
    $state.go('home.approveExpenseClaims' , {'id' : id})
    }
    else{
      $state.go('businessManagement.accounting.editInvoice',{'id':id})
    }
  }

  $scope.viewDownload = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.expenses.download.html',
      size: 'lg',
      backdrop: true,
      // resolve: {
      //   data: function() {
      //     return $scope.data;
      //   }
      // },
      controller: function($scope, $uibModalInstance, $rootScope) {
        $scope.filter = {
          fromDate : new Date(),
          toDate : new Date()
        }

        $scope.download = function(){
          window.location.href='/api/finance/getExpensesExcel/'
        }
      },
    }).result.then(function() {

    }, function() {

    });
  }

})

app.controller('businessManagement.finance.financeExpensesEdit', function($scope, $http, $aside, $state, Flash, $users, $filter ){

})
app.controller('businessManagement.finance.expenses', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  // settings main page controller


  $scope.data = {
    tableData: [],
    invoiceData: []
  };

  // views = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/tableDefault.html',
  //   itemTemplate: '/static/ngTemplates/app.finance.purchaseOrder.item.html',
  // }, ];
  // //
  // var options = {
  //   main: {
  //     icon: 'fa-pencil',
  //     text: 'edit'
  //   },
  // };
  //
  // $scope.config = {
  //   views: views,
  //   url: '/api/finance/purchaseorder/',
  //   searchField: 'name',
  //   getParams: [{
  //     key: 'isInvoice',
  //     value: false
  //   }],
  //   deletable: true,
  //   itemsNumPerView: [12, 24, 48],
  // }


  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'details') {
          var title = 'PO Details :';
          var appType = 'details';
        } else if (action == 'edit') {
          var title = 'edit :';
          var appType = 'edit';
        } else if (action == 'delete') {
          $http({
            method: 'DELETE',
            url: '/api/finance/purchaseorder/' + $scope.data.tableData[i].pk + '/'
          }).
          then(function(response) {})
          $scope.data.tableData.splice(i, 1)
          return
        }
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
  //
  invoiceViews = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.inboundInvoices.item.html',
  }, ];

  // var options = {
  //   main: {
  //     icon: 'fa-pencil',
  //     text: 'edit'
  //   },
  // };

  $scope.invoiceConfig = {
    views: invoiceViews,
    url: '/api/finance/purchaseorder/',
    searchField: 'name',
    getParams: [{
      key: 'isInvoice',
      value: true
    }],
    deletable: true,
    itemsNumPerView: [12, 24, 48],
  }


  $scope.invoicetableAction = function(target, action, mode) {

    for (var i = 0; i < $scope.data.invoiceData.length; i++) {
      if ($scope.data.invoiceData[i].pk == parseInt(target)) {
        if (action == 'details') {
          var title = 'Invoice Details :';
          var appType = 'idetails';
        } else if (action == 'edit') {
          var title = 'edit :';
          var appType = 'editinvoice';
        } else if (action == 'delete') {
          $http({
            method: 'DELETE',
            url: '/api/finance/purchaseorder/' + $scope.data.invoiceData[i].pk + '/'
          }).
          then(function(response) {})
          $scope.data.invoiceData.splice(i, 1)
          return
        }
        $scope.addTab({
          title: title + $scope.data.invoiceData[i].name,
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
  $scope.limit = 10
  $scope.offset = 0
  $scope.prev = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.purchaseOrders()
    }
  }
  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.purchaseOrders()
    }
  }
  $scope.prevPOInv = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.allinboundInvoices()
    }
  }
  $scope.nextPOInv = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.allinboundInvoices()
    }
  }

  $scope.editPO = function(s) {
    console.log(s, ';999');
    $scope.addTab({
      title: 'Edit PO :' + $scope.purchsedData[s].pk,
      cancel: true,
      app: 'edit',
      data: $scope.purchsedData[s],
      active: true
    })
    // $scope.purchsedData.splice(s, 1)
  }
  $scope.editInv = function(s) {
    console.log(s, ';999');
    $scope.addTab({
      title: 'Edit Invoice :' + $scope.inboundInvoiceData[s].pk,
      cancel: true,
      app: 'editinvoice',
      data: $scope.inboundInvoiceData[s],
      active: true
    })
    // $scope.inboundInvoiceData.splice(s, 1)
  }
  $scope.viewInv = function(s, po) {
    console.log(s, ';999');
    $scope.addTab({
      title: 'View Invoice :' + po.pk,
      cancel: true,
      app: 'idetails',
      data: po,
      active: true
    })
    $scope.allPOInvoices(po)
  }
  $scope.deleteInv = function(s) {
    $http({
      method: 'DELETE',
      url: '/api/finance/purchaseorder/' + $scope.inboundInvoiceData[s].pk + '/',
    }).then(function(response) {
      $scope.inboundInvoiceData.splice(s, 1)
      Flash.create('success', 'Deleted')
    })
  }
  $scope.viewPO = function(s, po) {
    $scope.addTab({
      title: 'Details:' + po.pk,
      cancel: true,
      app: 'details',
      data: po,
      active: true
    })
    $scope.allProducts(s)
  }
  $scope.deletePO = function(s) {
    $http({
      method: 'DELETE',
      url: '/api/finance/purchaseorder/' + $scope.purchsedData[s].pk + '/',
    }).then(function(response) {
      $scope.purchsedData.splice(s, 1)
      Flash.create('success', 'Deleted')
    })
  }
  $scope.orderForm = {
    name: ''
  }
  $scope.purchaseOrders = function() {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorder/?isInvoice=false&limit=' + $scope.limit + '&offset=' + $scope.offset + '&name__icontains=' + $scope.orderForm.name,
    }).then(function(response) {
      $scope.purchsedData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.purchaseOrders()
  $scope.allProducts = function(idx) {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorderqty/?purchaseorder=' + $scope.purchsedData[idx].pk,
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }
  $scope.allPOInvoices = function(idx) {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorderqty/?purchaseorder=' + idx.pk,
    }).
    then(function(response) {
      $scope.Invproducts = response.data
    })
  }
  $scope.orderForm = {
    name: ''
  }
  $scope.allinboundInvoices = function() {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorder/?isInvoice=true' + '&limit=' + $scope.limit + '&offset=' + $scope.offset + '&name__icontains=' + $scope.orderForm.name
    }).
    then(function(response) {
      console.log(response.data, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      $scope.inboundInvoiceData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.allinboundInvoices()
  $scope.allPurchaseorders = function(search, searchValue) {
    var url = '/api/finance/purchaseorder/?isInvoice=false&limit=' + $scope.limit + '&offset=' + $scope.offset
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {

    })

  }
  $scope.allPurchaseorders(false, '')

  $scope.filterOptions = []
  $scope.getFilters = function() {
    $http({
      method: 'GET',
      url: '/api/finance/getallCount/?type=purchasePO',
    }).
    then(function(response) {
      $scope.filterOptions = response.data.data
    })

  }
  $scope.getFilters()

  $scope.refreshInboundinv = function(search, searchValue) {
    var url = '/api/finance/purchaseorder/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&type=PO'
    if ($scope.orderForm.name.length > 0) {
      url = url + '&search__in=' + $scope.orderForm.name
    }
    var searchFields = []
    for (var i = 0; i < $scope.filterOptions.length; i++) {
      if ($scope.filterOptions[i].is_selected == true) {
        searchFields.push($scope.filterOptions[i].value)
      }
    }
    if (searchFields.length > 0) {
      url = url + '&filters=' + searchFields
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.purchsedData = response.data.results
    })

  }
  $scope.refreshInboundinv(false, '')


})

app.controller('businessManagement.finance.purchaseOrder.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      address: '',
      personName: '',
      phone: '',
      email: '',
      pincode: '',
      state: '',
      pin_status: '',
      city: '',
      country: '',
      poNumber: '',
      quoteNumber: '',
      quoteDate: '',
      terms: '',
      project: '',
      costcenter: '',
      bussinessunit: '',
      termsandcondition: '',
      issuer: '',
      deliveryDate:'',
      note:''
    }
  }
  $scope.mode = 'new';
  $scope.getAllData = function(idx) {
    $scope.resetForm()
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorder/' + idx + '/',
    }).
    then(function(response) {
    $scope.form = response.data
    $scope.form.vendor = response.data.service
      $scope.costCenterSearch()
    if ($scope.form.termsandcondition != null && typeof $scope.form.termsandcondition == 'object') {
      if (typeof $scope.form.termsandcondition.body == 'string') {
        $scope.form.termsandcondition.viewbody = $scope.form.termsandcondition.body.split('||')
      } else {
        $scope.form.termsandcondition.viewbody = $scope.form.termsandcondition.body
      }
    }
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorderqty/?purchaseorder=' + idx,
    }).
    then(function(response) {
      $scope.products = response.data
      $scope.all = $scope.products
      $scope.calc()
    })
  })
  }



  $scope.termsAndConditions = {
    data: ''
  }

  $http({
    method: 'GET',
    url: '/api/finance/termsAndConditions/',
  }).
  then(function(response) {
    $scope.terms = response.data
    for (var i = 0; i < $scope.terms.length; i++) {
      $scope.terms[i].body = $scope.terms[i].body.split('||')

    }
  })

  $scope.allCostCenter = []
    $scope.costCenterSearch = function() {
      $http.get('/api/finance/costCenter/').
      then(function(response) {
        $scope.allCostCenter =  response.data;
        if ($state.is('businessManagement.accounting.editPuchaseOrder')) {
          for (var i = 0; i < $scope.allCostCenter.length; i++) {
            if ($scope.allCostCenter[i].pk == $scope.form.costcenter.pk) {
              $scope.form.costcenter = $scope.allCostCenter[i]
            }
          }

        }
      })
    };

  if ($state.is('businessManagement.accounting.purchaseOrder')) {
    $scope.mode = 'new';
    $scope.resetForm()
    $scope.products = []
    $scope.options = false
    $scope.costCenterSearch()
  }
  else {
    $scope.getAllData($state.params.id)
    $scope.mode = 'edit';
    $scope.options = true
    console.log($scope.form.termsandcondition, 'cccccccccccc');


  }
  $scope.showButton = true

  $scope.addTableRow = function(indx) {
    $scope.products.push({
      product: '',
      price: 0,
      qty: 0
    });
    $scope.showButton = false
  }

  $scope.refresh = function() {
    $scope.resetForm()
    $scope.options = false
  }


  $scope.showOption = function() {
    if ($scope.options == false) {
      $scope.options = true
    } else {
      $scope.options = false
    }
  }


  $scope.projectSearch = function(query) {
    return $http.get('/api/projects/project/?title__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.productSearch = function(query) {
    return $http.get('/api/finance/purchaseorderqty/?product__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };



  $scope.bussinessUnit = function(query) {
    return $http.get('/api/organization/unit/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };


  $scope.createVendorService = function() {
    $uibModal.open({
        templateUrl: '/static/ngTemplates/app.finance.vendorService.form.html',
        size: 'lg',
        backdrop: false,
        resolve: {
          vsdata: function() {
            return $scope.form.vendor
          }
        },
        controller: 'businessManagement.finance.vendorService.form',
      })
      .result.then(function(pk) {}, function(res) {
        // $http.get('/api/finance/vendorprofile/' + res + '/').
        // then(function(response) {
        //   $scope.form.vendor = response.data;
        // })
        if (typeof res == 'object') {
          $scope.form.vendor =  res
        }
      })
  }

  $scope.viewDetails = function() {
    $aside.open({
        templateUrl: '/static/ngTemplates/app.finance.services.html',
        placement: 'right',
        size: 'lg',
        resolve: {
          services: function() {
            return $scope.vendorDetails.services
          }
        },
        controller: function($scope, services, $uibModalInstance, $rootScope) {

          $scope.data = services
        },
      })
      .result.then(function(pk) {}, function() {})
  }

  $scope.$watch('form.vendor', function(newValue, oldValue) {
    if ($scope.form.vendor != null && typeof $scope.form.vendor == 'object') {
      // $scope.form.personName = $scope.form.vendor.contactPerson
      $scope.form.phone = newValue.mobile

      // $scope.form.email = newValue.email;
      // $scope.form.accNo = newValue.accountNumber;
      // $scope.form.ifsc = newValue.ifscCode;
      // $scope.form.bankName = newValue.bankName;
      // if (newValue.service != undefined) {
        // $scope.form.gstIn = newValue.service.tin
        if (newValue.address!=null && typeof newValue.address == 'object') {
          $scope.form.address = newValue.address.street
          $scope.form.pincode = newValue.address.pincode
        }
      // }
      // else{
      //   $scope.form.gstIn = ''
      //   $scope.form.address = ''
      //   $scope.form.pincode = ''
      // }


      // $http({
      //   method: 'GET',
      //   url: '/api/finance/getVendorDetails/?id=' + newValue.pk,
      // }).
      // then(function(response) {
      //   $scope.vendorDetails = response.data
      // })
    }

  }, true)


  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if ($scope.form.pincode.toString().length == 6) {
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


  $scope.$watch('products', function(newValue, oldValue) {
    if (newValue != null) {
      for (var i = 0; i < newValue.length; i++) {
        if (typeof newValue[i].product == 'object') {
          $scope.products[i].product = newValue[i].product.product
        }
      }
    }
  }, true)

  $scope.calc = function(){
    $scope.form.totalAmount = 0
    for (var i = 0; i < $scope.products.length; i++) {
        $scope.products[i].total = parseInt($scope.products[i].qty) * parseFloat($scope.products[i].price)
        $scope.form.totalAmount = $scope.form.totalAmount + $scope.products[i].total
    }
  }

  $scope.save = function(status) {
    // if ($scope.mode == 'new') {
    if (typeof $scope.form.vendor != 'object' || $scope.form.address == null || $scope.form.pincode == null || $scope.form.address == '' || $scope.form.pincode.length == 0) {
      Flash.create('danger', 'Vendor, address, pincode are required')
      return
    }
    // }
    if ($scope.form.quoteNumber.length == 0) {
      Flash.create('danger', 'Add Quotataion Number')
      return
    }
    if ($scope.form.quoteDate.length == 0) {
      Flash.create('danger', 'Add Quotataion Date')
      return
    }
    if ($scope.form.deliveryDate.length == 0) {
      Flash.create('danger', 'Add Delivery Date')
      return
    }
    if (!$scope.form.termsandcondition.pk) {
      Flash.create('danger', 'Select Terms and condition')
      return
    }

    if ($scope.products.length == 0) {
      Flash.create('danger', 'Add Product')
      return
    }


    var termsandcond = ''
    for (var i = 0; i < $scope.form.termsandcondition.body.length; i++) {
      if (i == $scope.form.termsandcondition.body.length - 1) {
        termsandcond = termsandcond + $scope.form.termsandcondition.body[i]
      } else {
        termsandcond = termsandcond + $scope.form.termsandcondition.body[i]
      }
    }
    var dataToSend = {
      name: $scope.form.name,
      personName: $scope.form.personName,
      address: $scope.form.address,
      phone: $scope.form.phone,
      // email: $scope.form.email,
      pincode: $scope.form.pincode,
      state: $scope.form.state,
      city: $scope.form.city,
      country: $scope.form.country,
      pin_status: $scope.form.pin_status,
      // deliveryDate: $scope.form.deliveryDate,
      // poNumber: $scope.form.poNumber,
      quoteNumber: $scope.form.quoteNumber,
      // quoteDate: $scope.form.quoteDate,
      terms: termsandcond,
      service: $scope.form.vendor.pk,
      name: $scope.form.vendor.name,
      termsandcondition: $scope.form.termsandcondition.pk,
      invoiceTerms : $scope.form.termsandcondition.body,
      totalAmount : $scope.form.totalAmount,
      isInvoice : false
    }

    if (status != undefined) {
      dataToSend.status = status
    }
    if ($scope.form.project != undefined) {
      dataToSend.project = $scope.form.project.pk
      if ($scope.form.project.costCenter != undefined || $scope.form.project.costCenter != null) {
        $scope.form.costCenter = $scope.form.project.costCenter
        dataToSend.costcenter = $scope.form.costCenter.pk
        if ($scope.form.costCenter.unit != undefined) {
          $scope.form.bussinessunit = $scope.form.costCenter.unit
          dataToSend.bussinessunit = $scope.form.bussinessunit.pk
        }
      }
    }
    if ($scope.form.costcenter != undefined && typeof $scope.form.costcenter == 'object') {
      dataToSend.costcenter = $scope.form.costcenter.pk
      // if ($scope.form.costcenter.unit != undefined || $scope.form.costcenter.unit != null) {
      //   $scope.form.bussinessunit = $scope.form.costcenter.unit
      //   dataToSend.bussinessunit = $scope.form.bussinessunit.pk
      // }
    }
    if ($scope.form.bussinessunit != undefined || $scope.form.bussinessunit != null) {
      dataToSend.bussinessunit = $scope.form.bussinessunit.pk
    }
    if ($scope.form.deliveryDate != null && typeof $scope.form.deliveryDate == 'object') {
      dataToSend.deliveryDate = $scope.form.deliveryDate.toJSON().split('T')[0]
    }
    if ($scope.form.quoteDate != null && typeof $scope.form.quoteDate == 'object') {
      dataToSend.quoteDate = $scope.form.quoteDate.toJSON().split('T')[0]
    }
    if ($scope.form.requester != null && typeof $scope.form.requester == 'object') {
      dataToSend.requester = $scope.form.requester.pk
    }

    if ($scope.form.note!=undefined && $scope.form.note!=null) {
      dataToSend.note = $scope.form.note
    }


    var method = 'POST'
    var url = '/api/finance/purchaseorder/'
    if ($scope.form.pk) {
      method = 'PATCH'
      url = url +$scope.form.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      // $scope.purchsedData.push(response.data)
      var count = 0
      if ($scope.products.length > 0) {
        for (var i = 0; i < $scope.products.length; i++) {
          count += 1
          var toSend = {
            product: $scope.products[i].product,
            qty: $scope.products[i].qty,
            price: $scope.products[i].price,
            purchaseorder: response.data.pk
          }
          if ($scope.products[i].pk) {
            method = 'PATCH',
              url = '/api/finance/purchaseorderqty/' + $scope.products[i].pk + '/'
          } else {
            method = 'POST'
            url = '/api/finance/purchaseorderqty/'
          }
          $http({
            method: method,
            url: url,
            data: toSend
          }).
          then(function(res) {
            console.log($scope.products.length, count, $scope.mode);
            if ($scope.products.length == count && $scope.mode == 'new') {
                $state.go('businessManagement.accounting.editPuchaseOrder',{'id': response.data.pk})
            }

          })
        }
      } else {
        if ($scope.mode == 'new') {
          $state.go('businessManagement.accounting.editPuchaseOrder',{'id': response.data.pk})
        }
      }
      if ($scope.mode == 'edit') {
          $scope.getAllData($state.params.id)
      }
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    })
  }


  $scope.deleteData = function(pkVal, idx) {
    if (pkVal == undefined) {
      $scope.products.splice(idx, 1)
      return
    } else {
      $http({
        method: 'DELETE',
        url: '/api/finance/purchaseorderqty/' + pkVal + '/'
      }).
      then(function(response) {
        $scope.products.splice(idx, 1)
        Flash.create('success', 'Deleted');
        return
      })
    }
  }

  $http({
    method: 'GET',
    url: '/api/HR/userSearch/?is_staff=true',
  }).then(function(response) {
    $scope.issuers = response.data
    for (var i = 0; i < $scope.issuers.length; i++) {
      if ($scope.form.requester == $scope.issuers[i].pk) {
        $scope.form.requester = $scope.issuers[i]
      }
    }
  })
})



app.controller('businessManagement.finance.vendorService.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, vsdata, $uibModalInstance) {

  $scope.resetForm = function() {
    $scope.form = {
      service: '',
      email: '',
      contactPerson: '',
      mobile: '',
      paymentTerm: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      street:'',
      tin:''
    }
  }
  $scope.resetForm()


  if (typeof vsdata == 'object') {
    // $http({
    //   method: 'GET',
    //   url: '/api/ERP/service/' + vsdata.pk +'/',
    // }).
    // then(function(response) {
    //   $scope.form = response.data
    // })
    $scope.form = vsdata
    if ($scope.form.address!=undefined) {
      $scope.form.street =   $scope.form.address.street
      $scope.form.city =   $scope.form.address.city
      $scope.form.state =   $scope.form.address.state
      $scope.form.pincode =   $scope.form.address.pincode
      $scope.form.country =   $scope.form.address.country
    }
    else{
      $scope.form.street =  ''
      $scope.form.city =  ''
      $scope.form.state =   ''
      $scope.form.pincode =   ''
      $scope.form.country =   ''
    }
  } else {
    $scope.form.name = vsdata
  }

  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if (newValue!=undefined && newValue.length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + newValue
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.city = response.data[0].city;
          $scope.form.state = response.data[0].state;
          $scope.form.country = response.data[0].country;
        }
      })
    }
  })

  $scope.cancel = function() {
    $uibModalInstance.dismiss($scope.form);
  }

  $scope.ServiceSave = function() {
    if ($scope.form.name.length == 0  || $scope.form.pincode.length == 0 || $scope.form.tin.length == 0 || $scope.form.street.length == 0 ) {
      Flash.create('warning', 'All details are required')
      return
    }

    var method = 'POST'
    var url = '/api/ERP/serviceApi/'
    // if ($scope.form.service.pk){
    //   method = 'PATCH'
    //   url = '/api/finance/vendorApi/'+$scope.form.service.pk+'/'
    // }

    var dataToSend = {
      name: $scope.form.name,
      // contactPerson: $scope.form.contactPerson,
      mobile: $scope.form.mobile,
      city: $scope.form.city,
      state: $scope.form.state,
      pincode: $scope.form.pincode,
      country: $scope.form.country,
      street: $scope.form.street,
      tin: $scope.form.tin,
    }
    console.log(dataToSend);

    if ($scope.form.pk) {
      dataToSend.servicepk = $scope.form.pk
    }

    if ($scope.form.vendorpk) {
      dataToSend.vendorpk = $scope.form.vendorpk
    }

    if ($scope.form.addresspk) {
      dataToSend.addresspk = $scope.form.addresspk
    }
    // if ($scope.form.email.length > 0 && $scope.form.email != null) {
    //   dataToSend.email = $scope.form.email
    // }
    if ($scope.form.paymentTerm != undefined && $scope.form.paymentTerm != null) {
      dataToSend.paymentTerm = $scope.form.paymentTerm
    }

    if ($scope.form.mobile != undefined && $scope.form.mobile != null) {
      dataToSend.mobile = $scope.form.mobile
    }
    if ($scope.form.bankName != undefined && $scope.form.bankName != null) {
      dataToSend.bankName = $scope.form.bankName
    }
    if ($scope.form.accountNumber != undefined && $scope.form.accountNumber != null) {
      dataToSend.accountNumber = $scope.form.accountNumber
    }
    if ($scope.form.ifscCode != undefined && $scope.form.ifscCode != null) {
      dataToSend.ifscCode = $scope.form.ifscCode
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.form = response.data
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.cancel()
    })
  }
})


app.controller('businessManagement.finance.purchaseOrder.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.projectSteps = {
    steps: projectsStepsData
  }
  $scope.data = $scope.tab.data

  $scope.updateStatus = function() {
    for (var i = 0; i < $scope.projectSteps.steps.length; i++) {
      if ($scope.projectSteps.steps[i].text == $scope.data.status) {
        $scope.data.selectedStatus = $scope.projectSteps.steps[i].indx;
        break;
      }
    }
  }
  $scope.updateStatus()
  $scope.getAllData = function() {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorderqty/?purchaseorder=' + $scope.data.pk,
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }


  $scope.getAllData()

  $scope.sendForApproval = function() {
    dataToSend = {
      status: 'Sent'
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
      data: dataToSend
    }).then(function(response) {
      $scope.data = response.data
      $scope.tab.data = response.data
      $scope.updateStatus()
    })
  }
  $scope.approve = function() {
    dataToSend = {
      status: 'Approved'
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
      data: dataToSend
    }).then(function(response) {
      $scope.data = response.data
      $scope.tab.data = response.data
      $scope.updateStatus()
    })
  }
  $scope.reject = function() {
    dataToSend = {
      status: 'rejected'
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
      data: dataToSend
    }).then(function(response) {
      $scope.data = response.data
      $scope.tab.data = response.data
      $scope.updateStatus()
    })

  }
  $scope.invoice = false
  $scope.addToInvoice = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.purchaseOrder.bankDetails.modal.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        data: function() {
          return $scope.data.pk;
        }
      },
      controller: function($scope, data, $uibModalInstance, $rootScope) {
        // $scope.data.pk = data
        $scope.bankList = [
          'Allahabad Bank',
          'Andhra Bank',
          'Bank of Baroda',
          'Bank of India',
          'Bank of Maharashtra',
          'Canara Bank',
          'Central Bank of India',
          'Corporation Bank',
          'Dena Bank',
          'Indian Bank',
          'Indian Overseas Bank',
          'Oriental Bank of Commerce',
          'Punjab National Bank',
          'Punjab & Sind Bank',
          'Syndicate Bank',
          'UCO Bank',
          'Union Bank of India',
          'United Bank of India',
          'Vijaya Bank',
          'IDBI Bank Ltd',
          'Bharatiya Mahila Bank',
          'State Bank of India',
          'State Bank of Bikaner',
          'State Bank of Hyderabad',
          'State Bank of Mysore',
          'State Bank of Patiala',
          'State Bank of Travancore',
        ]

        $scope.close = function() {
          $uibModalInstance.close();
        }


        $scope.saveBankDetails = function() {
          if ($scope.data.accNo != $scope.data.reaccNo || $scope.data.accNo == undefined || $scope.data.reaccNo == undefined) {
            Flash.create('danger', 'Account Number Doesnt Match');
            return
          }
          if ($scope.data.ifsc != $scope.data.reifsc || $scope.data.ifsc == undefined || $scope.data.reifsc == undefined) {
            Flash.create('danger', 'IFSC Number Doesnt Match');
            return
          }
          if ($scope.data.bankName == undefined) {
            Flash.create('danger', 'Add Bank Name');
            return
          }
          dataToSend = {
            accNo: $scope.data.accNo,
            ifsc: $scope.data.ifsc,
            bankName: $scope.data.bankName,
            isInvoice: true,
          }
          $http({
            method: 'PATCH',
            url: '/api/finance/purchaseorder/' + data + '/',
            data: dataToSend
          }).then(function(response) {
            Flash.create('success', 'Saved');
            // $scope.data = response.data
            // $scope.data.reaccNo = response.data.accNo
            //  $scope.data.reifsc = response.data.ifsc
          })
          $rootScope.$broadcast('forceRefetch', {});
          $uibModalInstance.close();
        }
      },
    }).result.then(function() {

    }, function() {

    });
    // $scope.invoice = true
    // if ($scope.data.accNo != null || $scope.data.ifsc != null) {
    //   $scope.data.reaccNo = $scope.data.accNo
    //   $scope.data.reifsc = $scope.data.ifsc
    // }
    $scope.data = response.data
    // $scope.updateStatus()
  }

  console.log($scope.tab, 'businessManagement.finance.purchaseOrder.explore');


})

app.controller('businessManagement.finance.inboundInvoices.form', function($scope, $timeout, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.resetForm = function() {
    $scope.form = {
      companyName: '',
      address: '',
      personName: '',
      phone: '',
      email: '',
      pincode: 0,
      city: '',
      state: '',
      country: '',
      paymentDueDate: '',
      costcenter: '',
      products: [],
      accNo: '',
      ifsc: '',
      bankName: '',
      invNo: '',
      account: '',
      totalAmount:0,
      deliveryDate:'',
      note:'',
      companyReference:'',
      gstIn:''
    }
  }
  $scope.resetForm()




    $scope.companySearch = function(query) {
      return $http.get('/api/ERP/service/?name__icontains=' + query).
      then(function(response) {
        return response.data;
      })
    };



  $scope.selectCompany = function(){
    if (typeof $scope.form.companyReference == 'object') {
        // $scope.form.phone = $scope.form.companyReference.mobile
        $scope.form.ifsc =  $scope.form.companyReference.ifscCode
        $scope.form.gstIn =  $scope.form.companyReference.tin
        $scope.form.accNo  =  $scope.form.companyReference.accountNumber
        $scope.form.bankName  =  $scope.form.companyReference.bankName
        $scope.form.city  =  $scope.form.companyReference.address.city
        $scope.form.country  =  $scope.form.companyReference.address.country
        $scope.form.state  =  $scope.form.companyReference.address.state
        $scope.form.address  =  $scope.form.companyReference.address.street
        $scope.form.pincode  =  $scope.form.companyReference.address.pincode
        // $scope.form.companyReference = $scope.form.companyReference.pk
        $scope.form.companyName = $scope.form.companyReference.name
    }
  }
    $scope.createVendorService = function() {
      $uibModal.open({
          templateUrl: '/static/ngTemplates/app.finance.vendorService.form.html',
          size: 'lg',
          backdrop: false,
          resolve: {
            vsdata: function() {
              return $scope.form.companyReference
            },
          },
          controller: 'businessManagement.finance.vendorService.form',
        })
        .result.then(function(pk) {}, function(res) {
          // $http.get('/api/finance/vendorprofile/' + res + '/').
          // then(function(response) {
          //   $scope.form.vendor = response.data;
          // })
          if (typeof res == 'object') {
            $scope.form.companyReference =  res
            $scope.selectCompany()
          }
        })
    }

      $scope.getAccount = function() {
        $http.get('/api/finance/accountLite/?heading=expense').
        then(function(response) {
          $scope.allAccount = response.data;
          if (!$scope.form.pk) {
            $scope.form.account = $scope.allAccount[0]
          } else {
            for (var i = 0; i < $scope.allAccount.length; i++) {
              if ($scope.allAccount[i].pk == $scope.form.account) {
                $scope.form.account = $scope.allAccount[i]
              }
            }
          }
        })

      }


    $scope.allCostCenter = []
      $scope.costCenterSearch = function() {
        $http.get('/api/finance/costCenter/').
        then(function(response) {
          $scope.allCostCenter =  response.data;
          // if ($state.is('businessManagement.accounting.editPuchaseOrder')) {
            for (var i = 0; i < $scope.allCostCenter.length; i++) {
              if ($scope.allCostCenter[i].pk == $scope.form.costcenter) {
                $scope.form.costcenter = $scope.allCostCenter[i]
              }
            }

          // }
        })
      };



  $scope.save = function(){
      if (typeof $scope.form.companyReference !='object') {
        Flash.create('danger', 'Company is required');
        return
      }
      if ($scope.form.personName == null || $scope.form.personName.length == 0) {
        Flash.create('danger', 'Person name is required');
        return
      }
      if ($scope.form.phone == null || $scope.form.phone.length == 0) {
        Flash.create('danger', 'Mobile number is required');
        return
      }
      if( $scope.form.address == null || $scope.form.address.length == 0 || $scope.form.state == null || $scope.form.state.length == 0 || $scope.form.city == null || $scope.form.city.length == 0 || $scope.form.pincode == null || $scope.form.pincode.length == 0 || $scope.form.gstIn == null || $scope.form.gstIn.length == 0){
        Flash.create('danger', 'Please update company details');
        return
      }
      if ($scope.form.deliveryDate.length==0) {
        Flash.create('danger', 'Delivery Date is required');
        return
      }
      if ($scope.form.paymentDueDate.length==0) {
        Flash.create('danger', 'Payment Due Date is required');
        return
      }
      if ($scope.form.bankName == null || $scope.form.bankName.length == 0 || $scope.form.ifsc == undefined || $scope.form.ifsc.length == 0 || $scope.form.accNo == undefined || $scope.form.accNo.length == 0) {
        Flash.create('danger', 'Add Bank Details');
        return
      }
      if ($scope.form.products.length == 0) {
        Flash.create('danger', 'Add Products');
        return
      }

      var dataSave = {
        companyReference:$scope.form.companyReference.pk,
        companyName:$scope.form.companyName,
        address : $scope.form.address,
        state : $scope.form.state,
        city : $scope.form.city,
        country : $scope.form.country,
        pincode : $scope.form.pincode,
        gstIn : $scope.form.gstIn,
        bankName : $scope.form.bankName,
        ifsc : $scope.form.ifsc,
        accNo : $scope.form.accNo,
        note : $scope.form.note,
        invNo : $scope.form.invNo,
        personName : $scope.form.personName,
        phone : $scope.form.phone,
        products :  $scope.form.products
      }

      if (typeof $scope.form.paymentDueDate == 'object') {
        dataSave.paymentDueDate = dateToString($scope.form.paymentDueDate)
      }

      if (typeof $scope.form.deliveryDate == 'object') {
        dataSave.deliveryDate = dateToString($scope.form.deliveryDate)
      }
      if (typeof $scope.form.account == 'object') {
          dataSave.account = $scope.form.account.pk
      }
      if (typeof $scope.form.costcenter == 'object') {
          dataSave.costcenter = $scope.form.costcenter.pk
      }

      if ($scope.form.pk) {
        dataSave.id = $scope.form.pk
      }

      $http({
        method: 'POST',
        url: '/api/finance/saveInvoice/',
        data: dataSave
      }).
      then(function(response) {
        // $scope.form = response.data
        Flash.create('success', 'Saved');
        if (!$scope.form.pk) {
          $state.go('businessManagement.accounting.editInvoice',{'id':response.data.pk})
        }
        else{
          $scope.form = response.data
          $scope.costCenterSearch()
            $scope.getAccount()
        }
        // $scope.cancel()
      })

  }


    $scope.deleteData = function(pkVal, idx) {
      if (pkVal == undefined) {
        $scope.form.products.splice(idx, 1)
        return
      } else {
        $http({
          method: 'DELETE',
          url: '/api/finance/invoiceReceived/' + pkVal + '/'
        }).
        then(function(response) {
          $scope.form.products.splice(idx, 1)
          Flash.create('success', 'Deleted');
          return
        })
      }
    }




    $scope.addTableRow = function(indx) {

      $scope.form.products.push({
        product: '',
        price: 0,
        receivedQty: 0,
        productMeta: '',
        taxCode: '',
        taxPer : 0,
        tax: 0,
        total: 0
      });
      // $scope.showButton = false
    }


      $scope.productMetaSearch = function(query) {
        return $http.get('/api/ERP/productMeta/?search=' + query).
        then(function(response) {
          return response.data;
        })
      };

    $scope.calc = function(indx){
      var total = $scope.form.products[indx].receivedQty * $scope.form.products[indx].price
      if ($scope.form.products[indx].taxPer == null || $scope.form.products[indx].taxPer.length == 0) {
        $scope.form.products[indx].taxPer = 0
      }
      $scope.form.products[indx].tax = (($scope.form.products[indx].receivedQty * $scope.form.products[indx].price)*$scope.form.products[indx].taxPer)/100
      $scope.form.products[indx].total = total + $scope.form.products[indx].tax

    }

    $scope.selectHsn = function(indx){
      if (typeof $scope.form.products[indx].taxCode == 'object' ) {
        $scope.form.products[indx].taxPer = $scope.form.products[indx].taxCode.taxRate
        $scope.form.products[indx].taxCode = $scope.form.products[indx].taxCode.code
        $scope.calc(indx)
      }
    }


      if ($state.is('businessManagement.accounting.editInvoice')) {
        $http({
          method: 'GET',
          url: '/api/finance/invoiceReceivedAll/'+$state.params.id+'/',

        }).
        then(function(response) {
          $scope.form = response.data
            $scope.costCenterSearch()
              $scope.getAccount()

        })
      }
      else{
        $scope.costCenterSearch()
          $scope.getAccount()
      }


})



app.controller('businessManagement.finance.vendorService.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, vsdata, $uibModalInstance) {

  $scope.resetForm = function() {
    $scope.form = {
      service: '',
      email: '',
      contactPerson: '',
      mobile: '',
      paymentTerm: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      street:'',
      tin:''
    }
  }
  $scope.resetForm()


  if (typeof vsdata == 'object') {
    // $http({
    //   method: 'GET',
    //   url: '/api/ERP/service/' + vsdata +'/',
    // }).
    // then(function(response) {
    // })
    $scope.form = vsdata
    if ($scope.form.address!=undefined) {
      $scope.form.street =   $scope.form.address.street
      $scope.form.city =   $scope.form.address.city
      $scope.form.state =   $scope.form.address.state
      $scope.form.pincode =   $scope.form.address.pincode
      $scope.form.country =   $scope.form.address.country
    }
    else{
      $scope.form.street =  ''
      $scope.form.city =  ''
      $scope.form.state =   ''
      $scope.form.pincode =   ''
      $scope.form.country =   ''
    }
  }
  else{
    $scope.form.name = vsdata
  }

  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if (newValue!=undefined && newValue.length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + newValue
      }).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.city = response.data[0].city;
          $scope.form.state = response.data[0].state;
          $scope.form.country = response.data[0].country;
        }
      })
    }
  })

  $scope.cancel = function() {
    $uibModalInstance.dismiss($scope.form);
  }

  $scope.ServiceSave = function() {
    if ($scope.form.name.length == 0  || $scope.form.pincode.length == 0 || $scope.form.tin.length == 0 || $scope.form.street.length == 0 ) {
      Flash.create('warning', 'All details are required')
      return
    }

    var method = 'POST'
    var url = '/api/ERP/serviceApi/'
    // if ($scope.form.service.pk){
    //   method = 'PATCH'
    //   url = '/api/finance/vendorApi/'+$scope.form.service.pk+'/'
    // }

    var dataToSend = {
      name: $scope.form.name,
      // contactPerson: $scope.form.contactPerson,
      mobile: $scope.form.mobile,
      city: $scope.form.city,
      state: $scope.form.state,
      pincode: $scope.form.pincode,
      country: $scope.form.country,
      street: $scope.form.street,
      tin: $scope.form.tin,
    }
    console.log(dataToSend);

    if ($scope.form.pk) {
      dataToSend.servicepk = $scope.form.pk
    }

    if ($scope.form.vendorpk) {
      dataToSend.vendorpk = $scope.form.vendorpk
    }

    if ($scope.form.addresspk) {
      dataToSend.addresspk = $scope.form.addresspk
    }
    // if ($scope.form.email.length > 0 && $scope.form.email != null) {
    //   dataToSend.email = $scope.form.email
    // }
    if ($scope.form.paymentTerm != undefined && $scope.form.paymentTerm != null) {
      dataToSend.paymentTerm = $scope.form.paymentTerm
    }

    if ($scope.form.mobile != undefined && $scope.form.mobile != null) {
      dataToSend.mobile = $scope.form.mobile
    }
    if ($scope.form.bankName != undefined && $scope.form.bankName != null) {
      dataToSend.bankName = $scope.form.bankName
    }
    if ($scope.form.accountNumber != undefined && $scope.form.accountNumber != null) {
      dataToSend.accountNumber = $scope.form.accountNumber
    }
    if ($scope.form.ifscCode != undefined && $scope.form.ifscCode != null) {
      dataToSend.ifscCode = $scope.form.ifscCode
    }
    $http({
      method: method,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      $scope.form = response.data
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.cancel()
    })
  }
})


// app.controller('businessManagement.finance.purchaseOrder.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
//   $scope.projectSteps = {
//     steps: projectsStepsData
//   }
//   $scope.data = $scope.tab.data
//
//   $scope.updateStatus = function() {
//     for (var i = 0; i < $scope.projectSteps.steps.length; i++) {
//       if ($scope.projectSteps.steps[i].text == $scope.data.status) {
//         $scope.data.selectedStatus = $scope.projectSteps.steps[i].indx;
//         break;
//       }
//     }
//   }
//   $scope.updateStatus()
//   $scope.getAllData = function() {
//     $http({
//       method: 'GET',
//       url: '/api/finance/purchaseorderqty/?purchaseorder=' + $scope.data.pk,
//     }).
//     then(function(response) {
//       $scope.products = response.data
//     })
//   }
//
//
//   $scope.getAllData()
//
//   $scope.sendForApproval = function() {
//     dataToSend = {
//       status: 'Sent'
//     }
//     $http({
//       method: 'PATCH',
//       url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
//       data: dataToSend
//     }).then(function(response) {
//       $scope.data = response.data
//       $scope.tab.data = response.data
//       $scope.updateStatus()
//     })
//   }
//   $scope.approve = function() {
//     dataToSend = {
//       status: 'Approved'
//     }
//     $http({
//       method: 'PATCH',
//       url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
//       data: dataToSend
//     }).then(function(response) {
//       $scope.data = response.data
//       $scope.tab.data = response.data
//       $scope.updateStatus()
//     })
//   }
//   $scope.reject = function() {
//     dataToSend = {
//       status: 'rejected'
//     }
//     $http({
//       method: 'PATCH',
//       url: '/api/finance/purchaseorder/' + $scope.data.pk + '/',
//       data: dataToSend
//     }).then(function(response) {
//       $scope.data = response.data
//       $scope.tab.data = response.data
//       $scope.updateStatus()
//     })
//
//   }
//   $scope.invoice = false
//   $scope.addToInvoice = function() {
//     $uibModal.open({
//       templateUrl: '/static/ngTemplates/app.finance.purchaseOrder.bankDetails.modal.html',
//       size: 'lg',
//       backdrop: false,
//       resolve: {
//         data: function() {
//           return $scope.data.pk;
//         }
//       },
//       controller: function($scope, data, $uibModalInstance, $rootScope) {
//         // $scope.data.pk = data
//         $scope.bankList = [
//           'Allahabad Bank',
//           'Andhra Bank',
//           'Bank of Baroda',
//           'Bank of India',
//           'Bank of Maharashtra',
//           'Canara Bank',
//           'Central Bank of India',
//           'Corporation Bank',
//           'Dena Bank',
//           'Indian Bank',
//           'Indian Overseas Bank',
//           'Oriental Bank of Commerce',
//           'Punjab National Bank',
//           'Punjab & Sind Bank',
//           'Syndicate Bank',
//           'UCO Bank',
//           'Union Bank of India',
//           'United Bank of India',
//           'Vijaya Bank',
//           'IDBI Bank Ltd',
//           'Bharatiya Mahila Bank',
//           'State Bank of India',
//           'State Bank of Bikaner',
//           'State Bank of Hyderabad',
//           'State Bank of Mysore',
//           'State Bank of Patiala',
//           'State Bank of Travancore',
//         ]
//
//         $scope.close = function() {
//           $uibModalInstance.close();
//         }
//
//
//         $scope.saveBankDetails = function() {
//           if ($scope.data.accNo != $scope.data.reaccNo || $scope.data.accNo == undefined || $scope.data.reaccNo == undefined) {
//             Flash.create('danger', 'Account Number Doesnt Match');
//             return
//           }
//           if ($scope.data.ifsc != $scope.data.reifsc || $scope.data.ifsc == undefined || $scope.data.reifsc == undefined) {
//             Flash.create('danger', 'IFSC Number Doesnt Match');
//             return
//           }
//           if ($scope.data.bankName == undefined) {
//             Flash.create('danger', 'Add Bank Name');
//             return
//           }
//           dataToSend = {
//             accNo: $scope.data.accNo,
//             ifsc: $scope.data.ifsc,
//             bankName: $scope.data.bankName,
//             isInvoice: true,
//           }
//           $http({
//             method: 'PATCH',
//             url: '/api/finance/purchaseorder/' + data + '/',
//             data: dataToSend
//           }).then(function(response) {
//             Flash.create('success', 'Saved');
//             // $scope.data = response.data
//             // $scope.data.reaccNo = response.data.accNo
//             //  $scope.data.reifsc = response.data.ifsc
//           })
//           $rootScope.$broadcast('forceRefetch', {});
//           $uibModalInstance.close();
//         }
//       },
//     }).result.then(function() {
//
//     }, function() {
//
//     });
//     // $scope.invoice = true
//     // if ($scope.data.accNo != null || $scope.data.ifsc != null) {
//     //   $scope.data.reaccNo = $scope.data.accNo
//     //   $scope.data.reifsc = $scope.data.ifsc
//     // }
//     $scope.data = response.data
//     // $scope.updateStatus()
//   }
//
//   console.log($scope.tab, 'businessManagement.finance.purchaseOrder.explore');
//
//
// })
//
// app.controller('businessManagement.finance.inboundInvoices.form', function($scope, $timeout, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
//
//   $scope.resetForm = function() {
//     $scope.form = {
//       companyName: '',
//       address: '',
//       personName: '',
//       phone: '',
//       email: '',
//       pincode: 0,
//       city: '',
//       state: '',
//       country: '',
//       paymentDueDate: '',
//       costcenter: '',
//       products: [],
//       accNo: '',
//       ifsc: '',
//       bankName: '',
//       invNo: '',
//       account: '',
//       totalAmount:0,
//       deliveryDate:'',
//       note:''
//
//     }
//   }
//
//   $scope.allCostCenter = []
//     $scope.costCenterSearch = function() {
//       $http.get('/api/finance/costCenter/').
//       then(function(response) {
//         $scope.allCostCenter =  response.data;
//         if ($state.is('businessManagement.accounting.editPuchaseOrder')) {
//           for (var i = 0; i < $scope.allCostCenter.length; i++) {
//             if ($scope.allCostCenter[i].pk == $scope.form.costcenter.pk) {
//               $scope.form.costcenter = $scope.allCostCenter[i]
//             }
//           }
//
//         }
//       })
//     };
//   $scope.mode = 'new';
//     $scope.getAllData = function(idx) {
//       $scope.resetForm()
//       $http({
//         method: 'GET',
//         url: '/api/finance/invoiceReceived/' + idx + '/',
//       }).
//       then(function(response) {
//       $scope.form = response.data
//       $scope.form.company =   $scope.form.company
//       $scope.costCenterSearch()
//       $scope.getAccount()
//     $http({
//       method: 'GET',
//       url: '/api/finance/purchaseorderqty/?purchaseorder=' + idx,
//     }).
//     then(function(response) {
//       $scope.form.products = response.data
//     })
//     })
//   }
//
//   $scope.toInvoice = function() {
//     $scope.resetForm()
//     $http({
//       method: 'GET',
//       url: '/api/finance/purchaseorder/' + $state.params.id + '/',
//     }).
//     then(function(response) {
//     $scope.form = response.data
//     $scope.form.poNumber =  $scope.form.pk
//     $scope.form.pk = null
//     $scope.form.isInvoice = true
//     $scope.form.products = []
//   })
//   }
//
//
//   $scope.bankList = [
//     'Allahabad Bank',
//     'Andhra Bank',
//     'Bank of Baroda',
//     'Bank of India',
//     'Bank of Maharashtra',
//     'Canara Bank',
//     'Central Bank of India',
//     'Corporation Bank',
//     'Dena Bank',
//     'Indian Bank',
//     'Indian Overseas Bank',
//     'Oriental Bank of Commerce',
//     'Punjab National Bank',
//     'Punjab & Sind Bank',
//     'Syndicate Bank',
//     'UCO Bank',
//     'Union Bank of India',
//     'United Bank of India',
//     'Vijaya Bank',
//     'IDBI Bank Ltd',
//     'Bharatiya Mahila Bank',
//     'State Bank of India',
//     'State Bank of Bikaner',
//     'State Bank of Hyderabad',
//     'State Bank of Mysore',
//     'State Bank of Patiala',
//     'State Bank of Travancore',
//   ]
//   $scope.projectSearch = function(query) {
//     return $http.get('/api/projects/project/?title__contains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.productSearch = function(query) {
//     return $http.get('/api/finance/purchaseorderqty/?product__contains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.createVendorService = function() {
//     $uibModal.open({
//         templateUrl: '/static/ngTemplates/app.finance.vendorService.form.html',
//         size: 'lg',
//         backdrop: false,
//         resolve: {
//           vsdata: function() {
//             return $scope.form.vendor
//           }
//         },
//         controller: 'businessManagement.finance.vendorService.form',
//       })
//       .result.then(function(pk) {}, function(res) {
//         // $http.get('/api/finance/vendorprofile/' + res + '/').
//         // then(function(response) {
//         //   $scope.form.vendor = response.data;
//         // })
//         if (typeof res == 'object') {
//           $scope.form.company =  res
//           $scope.form.companyName =  $scope.form.company.name
//           if ($scope.form.vendor.address!=undefined) {
//             $scope.form.address = $scope.form.vendor.address.street
//             $scope.form.city = $scope.form.vendor.address.city
//             $scope.form.state = $scope.form.vendor.address.state
//             $scope.form.pincode = $scope.form.vendor.address.pincode
//             $scope.form.country = $scope.form.vendor.address.country
//           }
//         }
//       })
//   }
//   $scope.companySearch = function(query) {
//     return $http.get('/api/ERP/service/?name__icontains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.contactSearch = function(query) {
//     return $http.get('/api/CRM/contact/?name__icontains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//
//   $scope.$watch('form.vendor', function(newValue, oldValue) {
//     if ($scope.form.vendor != null && typeof $scope.form.vendor  == 'object') {
//       // $scope.form.personName = $scope.form.vendor.contactPerson
//       $scope.form.phone = newValue.mobile
//       // $scope.form.email = newValue.email;
//       $scope.form.accNo = newValue.accountNumber;
//       // $scope.form.reaccNo = newValue.accountNumber;
//       $scope.form.ifsc = newValue.ifscCode;
//       // $scope.form.reifsc = newValue.ifscCode;
//       $scope.form.bankName = newValue.bankName;
//       // $scope.form.rebankName = newValue.bankName;
//       // if ($scope.form.paymentDueDate.length == 0) {
//         var date = new Date();
//
//         $scope.form.paymentDueDate = date.setDate(date.getDate() + $scope.form.vendor.paymentTerm);
//       // }
//         // if (newValue.service != undefined) {
//       $scope.form.gstIn = newValue.tin
//       if (newValue.address!=null && typeof newValue.address == 'object') {
//         $scope.form.address = newValue.address.street
//         $scope.form.pincode = newValue.address.pincode
//         $scope.form.city = newValue.address.city
//         $scope.form.state = newValue.address.state
//         $scope.form.pincode = newValue.address.pincode
//         $scope.form.country = newValue.address.country
//
//       }
//
//
//
//
//         // }
//         // else{
//         //   $scope.form.gstIn = ''
//         //   $scope.form.address = ''
//         //   $scope.form.pincode = ''
//         // }
//
//
//       // $http({
//       //   method: 'GET',
//       //   url: '/api/finance/getVendorDetails/?id=' + newValue.pk,
//       // }).
//       // then(function(response) {
//       //   $scope.vendorDetails = response.data
//       //
//       // })
//     }
//
//   }, true)
//
//
//   $scope.$watch('form.pincode', function(newValue, oldValue) {
//     if ($scope.form.pincode.toString().length == 6) {
//       console.log("ssssssssssssssssssssss");
//       $http({
//         method: 'GET',
//         url: '/api/ERP/genericPincode/?pincode=' + $scope.form.pincode
//       }).
//       then(function(response) {
//         if (response.data.length > 0) {
//           $scope.form.city = response.data[0].city;
//           $scope.form.state = response.data[0].state;
//           $scope.form.country = response.data[0].country;
//           $scope.form.pin_status = response.data[0].pin_status;
//         }
//       })
//     }
//   })
//
//   $scope.refresh = function() {
//     $scope.resetForm()
//   }
//
//   $scope.addTableRow = function(indx) {
//
//     $scope.form.products.push({
//       product: '',
//       price: 0,
//       receivedQty: 0,
//       productMeta: '',
//       hsn: '',
//       tax: '',
//       total: 0
//     });
//     // $scope.showButton = false
//   }
//
//   $scope.allCostCenter = []
//     $scope.costCenterSearch = function() {
//       $http.get('/api/finance/costCenter/').
//       then(function(response) {
//         $scope.allCostCenter =  response.data;
//         if ($state.is('businessManagement.accounting.editInvoice')) {
//           for (var i = 0; i < $scope.allCostCenter.length; i++) {
//             if ($scope.allCostCenter[i].pk == $scope.form.costcenter.pk) {
//               $scope.form.costcenter = $scope.allCostCenter[i]
//             }
//           }
//
//         }
//       })
//     };
//   $scope.bussinessUnit = function(query) {
//     return $http.get('/api/organization/unit/?name__contains=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.poSearch = function(query) {
//     return $http.get('/api/finance/purchaseorder/?pk__contains=' + query + '&isInvoice=false').
//     then(function(response) {
//       return response.data;
//     })
//   };
//
//   $scope.productMetaSearch = function(query) {
//     return $http.get('/api/ERP/productMeta/?search=' + query).
//     then(function(response) {
//       return response.data;
//     })
//   };
//   //
//   // $scope.pinSearch = function(query) {
//   //   return $http.get('/api/ERP/genericPincode/?pincode__contains=' + query).
//   //   then(function(response) {
//   //     return response.data;
//   //   })
//   // };
//
//
//   $scope.$watch('form.poNumber', function(newValue, oldValue) {
//     if (newValue != null || newValue != undefined) {
//       if (typeof newValue == "object") {
//         $scope.form.pk = null
//         $scope.form.name = newValue.name
//         $scope.form.address = newValue.address
//         $scope.form.personName = newValue.personName
//         $scope.form.phone = newValue.phone
//         $scope.form.email = newValue.email
//         $scope.form.pincode = newValue.pincode
//         $scope.form.city = newValue.city
//         $scope.form.state = newValue.state
//         $scope.form.country = newValue.country
//         $scope.form.status = newValue.status
//         $scope.form.quoteNumber = newValue.quoteNumber
//         $scope.form.quoteDate = newValue.quoteDate
//         $scope.form.deliveryDate = newValue.deliveryDate
//         $scope.form.terms = newValue.terms
//         $scope.form.costcenter = newValue.costcenter
//         $scope.form.bussinessunit = newValue.bussinessunit
//         $scope.form.project = newValue.project
//         $scope.form.isInvoice = newValue.isInvoice
//         $scope.form.vendor = newValue.vendor
//         $scope.form.poNumber = newValue.pk
//         $scope.form.products = []
//         $scope.mode == 'new'
//       }
//     }
//   })
//
//   $http({
//     method: 'GET',
//     url: '/api/finance/termsAndConditions/',
//   }).
//   then(function(response) {
//     $scope.terms = response.data
//     for (var i = 0; i < $scope.terms.length; i++) {
//       // $scope.terms[i].data = []
//       $scope.terms[i].body = $scope.terms[i].body.split('||')
//       // for (var j = 0; j < $scope.terms[i].body .length; j++) {
//       //   $scope.terms[i].data.push({'text': $scope.terms[i].body[j]})
//       // }
//
//     }
//   })
//
//   $scope.$watch('form.products', function(newValue, oldValue) {
//     $scope.form.totalAmount = 0
//     if (newValue != undefined) {
//       for (var i = 0; i < newValue.length; i++) {
//         if (newValue[i].hsn != null && typeof newValue[i].hsn == 'object') {
//           $scope.form.products[i].tax = newValue[i].hsn.taxRate
//           $scope.form.products[i].total = ((newValue[i].receivedQty * newValue[i].price) + (((newValue[i].receivedQty * newValue[i].price) * $scope.form.products[i].tax) / 100)).toFixed(2)
//           // $scope.form.products[i].productMeta = newValue[i].hsn
//           // $scope.form.products[i].hsn = newValue[i].productMeta.code
//         }
//         if (typeof newValue[i].product == 'object') {
//           $scope.form.products[i].product = newValue[i].product.product
//         }
//         $scope.form.totalAmount = parseFloat($scope.form.totalAmount) +  parseFloat($scope.form.products[i].total)
//       }
//     }
//   }, true)
//   $scope.ErrorOnSave = false
//   $scope.saveInvoice = function() {
//
//     // if (typeof $scope.form.poNumber == 'object') {
//     //   $scope.form.poNumber = $scope.form.poNumber.poNumber
//     // } else {
//     //   $scope.form.poNumber = $scope.form.poNumber
//     // }
//     if (typeof $scope.form.vendor !='object') {
//       Flash.create('danger', 'Company is required');
//       return
//     }
//
//     if( $scope.form.address == null || $scope.form.address.length == 0 || $scope.form.state == null || $scope.form.state.length == 0 || $scope.form.city == null || $scope.form.city.length == 0 || $scope.form.pincode == null || $scope.form.pincode.length == 0 || $scope.form.gstIn == null || $scope.form.gstIn.length == 0){
//       Flash.create('danger', 'Please update company details');
//       return
//     }
//
//     if ($scope.form.deliveryDate.length==0) {
//       Flash.create('danger', 'Delivery Date is required');
//       return
//     }
//     if ($scope.form.paymentDueDate.length==0) {
//       Flash.create('danger', 'Payment Due Date is required');
//       return
//     }
//
//     if ($scope.form.bankName == null || $scope.form.bankName.length == 0 || $scope.form.ifsc == undefined || $scope.form.ifsc.length == 0 || $scope.form.accNo == undefined || $scope.form.accNo.length == 0) {
//       Flash.create('danger', 'Add Bank Details');
//       return
//     }
//
//
//     for (var i = 0; i < $scope.form.products.length; i++) {
//       if (!$scope.form.products[i].hsn) {
//         console.log($scope.form.products[i].hsn);
//         Flash.create('danger', 'Add HSN');
//         return
//       }
//     }
//
//     // var termsandcond = ''
//     // for (var i = 0; i < $scope.form.termsandcondition.body.length; i++) {
//     //   if (i == $scope.form.termsandcondition.body.length - 1) {
//     //     termsandcond = termsandcond+$scope.form.termsandcondition.body[i]
//     //   }
//     //   else{
//     //     termsandcond = termsandcond+$scope.form.termsandcondition.body[i]
//     //   }
//     // }
//     var dataToSend = {
//       personName: $scope.form.personName,
//       address: $scope.form.address,
//       phone: $scope.form.phone,
//       // email: $scope.form.email,
//       pincode: $scope.form.pincode,
//       state: $scope.form.state,
//       city: $scope.form.city,
//       country: $scope.form.country,
//       pin_status: $scope.form.pin_status,
//       // deliveryDate: $scope.form.deliveryDate,
//       // poNumber: $scope.form.poNumber,
//       // paymentDueDate: $scope.form.paymentDueDate,
//       gstIn: $scope.form.gstIn,
//       // invoiceTerms: $scope.form.invoiceTerms,
//       // poNumber: $scope.form.poNumber,
//       isInvoice: true,
//       accNo: $scope.form.accNo,
//       ifsc: $scope.form.ifsc,
//       bankName: $scope.form.bankName,
//       // terms: termsandcond,
//       service: $scope.form.vendor.pk,
//       name: $scope.form.vendor.name,
//       totalAmount: $scope.form.totalAmount
//     }
//     if ($scope.form.poNumber != null && $scope.form.poNumber.length>0) {
//       dataToSend.poNumber = $scope.form.poNumber
//     }
//     if ($scope.form.deliveryDate != null && typeof $scope.form.deliveryDate == 'object') {
//       dataToSend.deliveryDate = $scope.form.deliveryDate.toJSON().split('T')[0]
//     }
//     if ($scope.form.paymentDueDate != null && typeof $scope.form.paymentDueDate == 'object') {
//       dataToSend.paymentDueDate = $scope.form.paymentDueDate.toJSON().split('T')[0]
//     }
//
//     if ($scope.form.account!=null && typeof $scope.form.account == 'object') {
//       dataToSend.account = $scope.form.account.pk
//     }
//     if ($scope.form.project != undefined) {
//       dataToSend.project = $scope.form.project.pk
//       if ($scope.form.project.costCenter != undefined || $scope.form.project.costCenter != null) {
//         $scope.form.costCenter = $scope.form.project.costCenter
//         dataToSend.costcenter = $scope.form.costCenter.pk
//         if ($scope.form.costCenter.unit != undefined) {
//           $scope.form.bussinessunit = $scope.form.costCenter.unit
//           dataToSend.bussinessunit = $scope.form.bussinessunit.pk
//         }
//       }
//     }
//     if ($scope.form.costcenter != undefined || $scope.form.costcenter != null) {
//       dataToSend.costcenter = $scope.form.costcenter.pk
//       // if ($scope.form.costcenter.unit != undefined || $scope.form.costcenter.unit != null) {
//       //   $scope.form.bussinessunit = $scope.form.costcenter.unit
//       //   dataToSend.bussinessunit = $scope.form.bussinessunit.pk
//       // }
//     }
//
//     if ($scope.form.bussinessunit != undefined || $scope.form.bussinessunit != null) {
//       dataToSend.bussinessunit = $scope.form.bussinessunit.pk
//     }
//     if ($scope.form.invNo != null && $scope.form.invNo.length > 0) {
//       dataToSend.invNo = $scope.form.invNo
//     }
//
//     if ($scope.form.note !=undefined ||  $scope.form.note != null) {
//         dataToSend.note = $scope.form.note
//     }
//
//     var method = 'POST'
//     var url = '/api/finance/purchaseorder/'
//     if ($scope.form.pk) {
//       method = 'PATCH'
//       url = url + $scope.form.pk + '/'
//     }
//     $http({
//       method: method,
//       url: url,
//       data: dataToSend
//     }).
//     then(function(response) {
//       Flash.create('success', 'Saved');
//       var count = 0
//       if ($scope.form.products.length > 0) {
//         for (var i = 0; i < $scope.form.products.length; i++) {
//           count += 1
//           if (typeof $scope.form.products[i].hsn == 'object') {
//             $scope.form.products[i].tax = $scope.form.products[i].hsn.taxRate
//             $scope.form.products[i].hsn = $scope.form.products[i].hsn.code
//             // $scope.form.products[i].productMeta = $scope.form.products[i].hsn
//           } else {
//             $scope.form.products[i].hsn = $scope.form.products[i].hsn
//             $scope.form.products[i].tax = $scope.form.products[i].tax
//             // $scope.form.products[i].productMeta = $scope.form.products[i].productMeta
//           }
//           var toSend = {
//             product: $scope.form.products[i].product,
//             receivedQty: $scope.form.products[i].receivedQty,
//             price: $scope.form.products[i].price,
//             purchaseorder: response.data.pk,
//             hsn: $scope.form.products[i].hsn,
//             tax: $scope.form.products[i].tax,
//             // productMeta: $scope.form.products[i].productMeta.pk,
//             total: $scope.form.products[i].total
//           }
//           if ($scope.form.products[i].pk) {
//             method = 'PATCH',
//               url = '/api/finance/purchaseorderqty/' + $scope.form.products[i].pk + '/'
//           } else {
//             method = 'POST'
//             url = '/api/finance/purchaseorderqty/'
//           }
//           $http({
//             method: method,
//             url: url,
//             data: toSend
//           }).
//           then(function(res) {
//             if ($scope.form.products.length == count && $scope.mode == 'new') {
//               $state.go('businessManagement.accounting.editInvoice',{'id':response.data.pk})
//             }
//             else{
//               $scope.getAllData($state.params.id)
//             }
//           })
//         }
//       } else {
//         Flash.create('danger', 'Products are not created')
//       }
//     })
//
//   }
//   $scope.deleteData = function(pkVal, idx) {
//     if (pkVal == undefined) {
//       $scope.form.products.splice(idx, 1)
//       return
//     } else {
//       $http({
//         method: 'DELETE',
//         url: '/api/finance/purchaseorderqty/' + pkVal + '/'
//       }).
//       then(function(response) {
//         $scope.form.products.splice(idx, 1)
//         Flash.create('success', 'Deleted');
//         return
//       })
//     }
//   }
//
//   $scope.getAccount = function() {
//     $http.get('/api/finance/accountLite/?heading=expense').
//     then(function(response) {
//       $scope.allAccount = response.data;
//       if (!$scope.form.pk) {
//         $scope.form.account = $scope.allAccount[0]
//       } else {
//         for (var i = 0; i < $scope.allAccount.length; i++) {
//           if ($scope.allAccount[i].pk == $scope.form.account.pk) {
//             $scope.form.account = $scope.allAccount[i]
//           }
//         }
//       }
//     })
//
//   }
//
//
//   if ($state.is('businessManagement.accounting.editInvoice')) {
//     $scope.getAllData($state.params.id)
//     $scope.mode = 'edit';
//     $scope.options = true
//     if ($scope.form.termsandcondition != null && typeof $scope.form.termsandcondition == 'object') {
//       if (typeof $scope.form.termsandcondition.body == 'string') {
//         $scope.form.termsandcondition.body = $scope.form.termsandcondition.body.split('||')
//       } else {
//         $scope.form.termsandcondition.body = $scope.form.termsandcondition.body
//       }
//     }
//
//     // $scope.form.ifsc = $scope.form.ifsc
//     // $scope.form.accNo = $scope.form.accNo
//     // $scope.form.accNo = $scope.form.accNo
//   }  else if ($state.is('businessManagement.accounting.poToInvoice')){
//     $scope.mode = 'new';
//     $scope.toInvoice()
//
//     $scope.options = false
//     $scope.getAccount()
//     $scope.costCenterSearch()
//   } else {
//     $scope.mode = 'new';
//     $scope.resetForm()
//     $scope.products = []
//     $scope.options = false
//     $scope.getAccount()
//     $scope.costCenterSearch()
//   }
//
//
//
// })

app.controller('businessManagement.finance.inboundInvoices.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.data = $scope.tab.data
  $scope.getAllData = function(idx) {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseorderqty/?purchaseorder=' + idx,
    }).
    then(function(response) {
      $scope.products = response.data
    })
  }


  $scope.getAllData()


  $scope.sentEmail = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.sendEmail.modal.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        data: function() {
          return $scope.data;
        }
      },
      controller: function($scope, data, $uibModalInstance, $rootScope) {
        $scope.close = function() {
          $uibModalInstance.close();
        }
        $scope.email = data.email

        $scope.send = function() {
          var toSend = {
            value: data.pk,
            email: $scope.email,
            typ: 'inbond'
          }
          $http({
            method: 'POST',
            url: '/api/finance/sendInvoice/',
            data: toSend
          }).
          then(function() {
            Flash.create('success', 'Email sent successfully')
          })
        }


      },
    }).result.then(function() {

    }, function() {

    });
  }

})

app.controller('businessManagement.finance.expenses.explore.controller', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal){

  $scope.data = {
    amount : 0,
    paymentMode : '',
    dated : new Date()
  }
$scope.allTransactions = []
  $scope.getTransaction = function(){
    $http({
      method: 'GET',
      url: '/api/payroll/disbursallite/?sourcePk='+ $scope.documents[$scope.inView].pk+'&source=expensesInvoice',
    }).
    then(function(response) {
      $scope.allTransactions = response.data
    })
  }
  $scope.getAllData = function() {
    $http({
      method: 'GET',
      url: '/api/finance/purchaseOrderInvoice/?id=' + $state.params.id ,
    }).
    then(function(response) {
    $scope.form = response.data
    $scope.documents = [$scope.form]
    $scope.inView = 0
    $scope.selectedId = $scope.documents[0].pk
    for (var i = 0; i < $scope.form.children.length; i++) {
      var data  = $scope.form.children[i]
      data.parent = $scope.form.pk
      $scope.documents.push(data)
    }
    if ($scope.form.isInvoice == true) {
      $scope.getTransaction()
    }
  })
}
$scope.getAllData()

$scope.changeView = function(indx){
    $scope.inView = indx
    $scope.allTransactions = []
    if (  $scope.documents[$scope.inView].isInvoice) {
      $scope.getTransaction()
    }
}

$scope.productForm = {
    product: '',
    price: 0,
    receivedQty: 0,
    productMeta: '',
    hsn: '',
    tax: '',
    total: 0
  }

$scope.addInvoice = function(){
  console.log($scope.form.vendor,$scope.form.requester) ;
  var data = {
    name: $scope.form.name,
    address:  $scope.form.address,
    personName: $scope.form.personName,
    vendor : $scope.form.vendor,
    phone: $scope.form.phone,
    email: $scope.form.email,
    pincode:$scope.form.pincode,
    city: $scope.form.city,
    state: $scope.form.state,
    country: $scope.form.country,
    poNumber: $scope.form.parent,
    paymentDueDate: new Date(),
    deliveryDate : $scope.form.deliveryDate,
    quoteDate : $scope.form.quoteDate,
    costcenter : $scope.form.costcenter,
    requester : $scope.form.requester,
    quoteNumber : $scope.form.quoteNumber,
    note : $scope.form.note,
    gstIn : '',
    isInvoice : true,
    products :[],
    productForm : $scope.productForm,
    totalAmount :0,
    balanceAmount : 0,
    paidAmount:0,
    bankName:'',
    accNo:'',
    ifsc:''
  }
    $scope.documents.push(data)
    $scope.inView = $scope.documents.length-1
    $scope.allTransactions = []
    $scope.tableEdit = true
}

$scope.changeEdit = function(){
  $scope.tableEdit = true
}

$scope.addData = function(){
  $scope.documents[$scope.inView].products.push($scope.documents[$scope.inView].productForm)
  $scope.documents[$scope.inView].productForm ={
      product: '',
      price: 0,
      receivedQty: 0,
      productMeta: '',
      hsn: '',
      tax: '',
      total: 0
    }
  $scope.calculate()
}

$scope.productSearch = function(query) {
  return $http.get('/api/finance/purchaseorderqty/?product__contains=' + query).
  then(function(response) {
    return response.data;
  })
};

$scope.productMetaSearch = function(query) {
  return $http.get('/api/ERP/productMeta/?search=' + query).
  then(function(response) {
    return response.data;
  })
};

$scope.calculate = function(){
      if ($scope.documents[$scope.inView].products.length>0) {
        $scope.documents[$scope.inView].totalAmount = 0
        for (var j = 0; j < $scope.documents[$scope.inView].products.length; j++) {
          if ($scope.documents[$scope.inView].products[j].hsn != null && typeof $scope.documents[$scope.inView].products[j].hsn == 'object') {
            $scope.documents[$scope.inView].products[j].tax = $scope.documents[$scope.inView].products[j].hsn.taxRate
            // $scope.documents[$scope.inView].products[j].productMeta = $scope.documents[$scope.inView].products[j].hsn
            $scope.documents[$scope.inView].products[j].hsn = $scope.documents[$scope.inView].products[j].hsn.code
          }
          $scope.documents[$scope.inView].products[j].total = (($scope.documents[$scope.inView].products[j].receivedQty * $scope.documents[$scope.inView].products[j].price) + (((parseInt($scope.documents[$scope.inView].products[j].receivedQty) * $scope.documents[$scope.inView].products[j].price) * $scope.documents[$scope.inView].products[j].tax) / 100)).toFixed(2)

          if (typeof $scope.documents[$scope.inView].product == 'object') {
            $scope.documents[$scope.inView].product = $scope.documents[$scope.inView].product.product
          }
          $scope.documents[$scope.inView].totalAmount = parseFloat($scope.documents[$scope.inView].totalAmount) +  parseFloat($scope.documents[$scope.inView].products[j].total)
        }
        $scope.documents[$scope.inView].balanceAmount = parseFloat($scope.documents[$scope.inView].totalAmount) -  parseFloat($scope.documents[$scope.inView].paidAmount)
      }
  }

  $scope.$watch('documents', function(newValue, oldValue) {
  for (var i = 0; i < $scope.documents.length; i++) {
    if (i == $scope.inView && $scope.documents[$scope.inView].productForm!=undefined) {
    if (typeof $scope.documents[$scope.inView].productForm.product == 'object') {
      $scope.documents[$scope.inView].productForm.product = $scope.documents[$scope.inView].productForm.product.product
    }
    else{
      $scope.documents[$scope.inView].productForm.product =  $scope.documents[$scope.inView].productForm.product
    }
    if (typeof $scope.documents[$scope.inView].productForm.hsn == 'object') {
      $scope.documents[$scope.inView].productForm.tax = $scope.documents[$scope.inView].productForm.hsn.taxRate
      $scope.documents[$scope.inView].productForm.total = (($scope.documents[$scope.inView].productForm.receivedQty * $scope.documents[$scope.inView].productForm.price) + ((($scope.documents[$scope.inView].productForm.receivedQty * $scope.documents[$scope.inView].productForm.price) * $scope.documents[$scope.inView].productForm.tax) / 100)).toFixed(2)
      // $scope.documents[$scope.inView].productForm.productMeta = $scope.documents[$scope.inView].productForm.hsn
      // $scope.documents[$scope.inView].productForm.hsn = $scope.documents[$scope.inView].productForm.productMeta.code
      }
      else {
        $scope.documents[$scope.inView].productForm.tax = 0
        $scope.documents[$scope.inView].productForm.total =  $scope.documents[$scope.inView].productForm.price *  $scope.documents[$scope.inView].productForm.receivedQty
      }
    }
    }
  }, true)

  $scope.saveInvoice = function(){
    var dataToSend = {
      name: $scope.documents[$scope.inView].name,
      address:  $scope.documents[$scope.inView].address,
      personName: $scope.documents[$scope.inView].personName,
      phone:$scope.documents[$scope.inView].phone,
      email: $scope.documents[$scope.inView].email,
      pincode:$scope.documents[$scope.inView].pincode,
      city: $scope.documents[$scope.inView].city,
      state: $scope.documents[$scope.inView].state,
      country: $scope.documents[$scope.inView].country,
      poNumber: $scope.documents[$scope.inView].parent,
      deliveryDate : $scope.documents[$scope.inView].deliveryDate,
      quoteDate : $scope.documents[$scope.inView].quoteDate,
      quoteNumber : $scope.documents[$scope.inView].quoteNumber,
      gstIn :$scope.documents[$scope.inView].gstIn,
      isInvoice : true,
      products :$scope.documents[$scope.inView].products,
      totalAmount:$scope.documents[$scope.inView].totalAmount,
      balanceAmount:$scope.documents[$scope.inView].balanceAmount,
      paidAmount:$scope.documents[$scope.inView].paidAmount,
      parent : $scope.form.pk,
      bankName : $scope.documents[$scope.inView].bankName,
      accNo : $scope.documents[$scope.inView].accNo,
      ifsc : $scope.documents[$scope.inView].ifsc,
    }
    if ($scope.documents[$scope.inView].pk) {
      dataToSend.pk = $scope.documents[$scope.inView].pk
    }
    if ($scope.documents[$scope.inView].deliveryDate!=null && typeof $scope.documents[$scope.inView].deliveryDate == 'object') {
        dataToSend.deliveryDate = $scope.documents[$scope.inView].deliveryDate.toJSON().split('T')[0]
    }
    if ($scope.documents[$scope.inView].paymentDueDate!=null && typeof $scope.documents[$scope.inView].paymentDueDate == 'object') {
        dataToSend.paymentDueDate = $scope.documents[$scope.inView].paymentDueDate.toJSON().split('T')[0]
    }
    if ($scope.documents[$scope.inView].costcenter !=null && typeof $scope.documents[$scope.inView].costcenter == 'object') {
        dataToSend.costcenter = $scope.documents[$scope.inView].costcenter.pk
    }
    if ($scope.documents[$scope.inView].requester!=null && typeof $scope.documents[$scope.inView].requester == 'object') {
        dataToSend.requester = $scope.documents[$scope.inView].requester.pk
    }
    if ($scope.documents[$scope.inView].vendor!=null && typeof $scope.documents[$scope.inView].vendor == 'object') {
        dataToSend.vendor = $scope.documents[$scope.inView].vendor.pk
    }
    if ($scope.documents[$scope.inView].requester!=null && typeof $scope.documents[$scope.inView].requester != 'object') {
      dataToSend.requester = $scope.documents[$scope.inView].requester
    }

    if ($scope.documents[$scope.inView].note!=undefined && $scope.documents[$scope.inView].note!=null) {
      dataToSend.note = $scope.documents[$scope.inView].note
    }
    $http({
      method: 'POST',
      url: '/api/finance/purchaseOrderInvoice/',
      data : dataToSend,
    }).
    then(function(response) {
      Flash.create('success' , 'Saved')
      $scope.documents[$scope.inView] = response.data
      $scope.tableEdit = false
      return
    })
  }

// $scope.addTableRow = function(indx) {
//
//   $scope.documents[$scope.inView].products.push({
//     product: '',
//     price: 0,
//     receivedQty: 0,
//     productMeta: '',
//     hsn: '',
//     tax: '',
//     total: 0
//   });
//   // $scope.showButton = false
// }

// $http({
//   method: 'GET',
//   url: '/api/finance/purchaseorderqty/?purchaseorder=' + $state.params.id,
// }).
// then(function(response) {
//   $scope.form.products = response.data
// })

$scope.delete = function(indx){
  if ($scope.documents[$scope.inView].products[indx].pk) {
    $http({
      method: 'DELETE',
      url: '/api/finance/purchaseorderqty/'+$scope.documents[$scope.inView].products[indx].pk+'/',
    }).
    then(function(response) {
      $scope.documents[$scope.inView].products.splice(indx,1)
      $scope.calculate()
    })

  }
  else{
    $scope.documents[$scope.inView].products.splice(indx,1)
    $scope.calculate()
  }
}

$scope.savePayment = function(){
  if ($scope.data.amount == null || $scope.data.amount == 0 || $scope.data.amount>$scope.documents[$scope.inView].balanceAmount || $scope.data.amount.toString().length == 0 ) {
    Flash.create('warning' , 'Invalid Amount')
    return
  }
  var data = $scope.data
  data.purchase = $scope.documents[$scope.inView].pk
  data.dated = data.dated.toJSON().split('T')[0]
  $http({
    method: 'POST',
    url: '/api/finance/expenseTransactionCreate/',
    data:data
  }).
  then(function(response) {
    $scope.documents[$scope.inView].balanceAmount = response.data.purchase.balanceAmount
    $scope.documents[$scope.inView].totalAmount = response.data.purchase.totalAmount
    $scope.documents[$scope.inView].paidAmount = response.data.purchase.paidAmount
    $scope.allTransactions.push(response.data.data)
    $scope.data = {
      amount : 0,
      paymentMode : '',
      dated : new Date()
    }
    // $scope.getAllData()
  })
}
})
app.controller('businessManagement.finance.purchasedashboard', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {

  $scope.totalCustomers = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.expenses.purchaseDetails.html',
      size: 'lg',

      controller: function($scope, $uibModalInstance) {
        $scope.dismiss = function() {
          $uibModalInstance.dismiss();
        }
      },
    });
  }

  function random_rgba() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
  }
  new Chart(document.getElementById("supplier-one"), {
    type: 'bar',
    data: {
      labels: ["Short", "Medium", "Long"],
      datasets: [{
          label: "",
          type: "bar",
          borderColor: "#df8f45",
          backgroundColor: ['green', '#3e95cd', '#d9534f'],
          data: [130, 385, 289],

        },

      ]
    },
    options: {
      scales: {
        xAxes: [{
          stacked: false,
          barPercentage: 1,
          categoryPercentage: 0.8,
          //   ticks: {
          //   beginAtZero: true,
          // },
          gridLines: {
            tickMarkLength: 1,
            display: false,
            drawBorder: false,
          },
        }],
        yAxes: [{
          stacked: false,
          gridLines: {
            display: false,
            drawBorder: false,
          },
          labels: {
            display: false
          },
          ticks: {
            display: false
          }

        }]
      },
      title: {
        display: false,
        text: ''
      },
      legend: {
        display: false
      },
      labels: {
        display: false
      },
      elements: {
        center: {
          text: '',
        }
      }

    }

  })
  new Chart(document.getElementById("defectrate"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        data: [100, 50, 30, 0, 30, 60, 90, 40, 80, 95, 50, 20],
        label: "Defect Rate",
        // borderColor: "blue",
        borderColor: "#5cb85c",
        // borderDash: ([10]),
        // borderCapStyle: 'circle',
        pointBackgroundColor: ['red', '', '', '', '', '', '', '', '', 'red', '', ''],
        pointstyle: 'circle',
        // pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: [5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }
    }
  });

  new Chart(document.getElementById("supplier"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        data: [100, 50, 120, 220, 150, 110, 20, 40, 60, 110, 100, 20],
        label: "Supplier Avaliability",
        // borderColor: "blue",
        borderColor: "#5cb85c",
        // borderDash: ([10]),
        // borderCapStyle: 'circle',
        pointBackgroundColor: ['', 'red', '', '', '', '', 'red', 'red', '', '', '', ''],
        pointstyle: 'circle',
        // pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: [0, 5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }
    }
  });

  new Chart(document.getElementById("leadtime"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        data: [100, 90, 70, 40, -30, 0, 40, 45, 65, 110, 120],
        label: "Lead Time",
        // borderColor: "blue",
        borderColor: "#5cb85c",
        // borderDash: ([10]),
        // borderCapStyle: 'circle',
        pointBackgroundColor: ['', '', '', '', '', '', '', '', '', 'red', 'red'],
        pointstyle: 'circle',
        // pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }
    }
  });

  new Chart(document.getElementById("line-bluechart"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', ''],
      datasets: [{
        data: [100, 120, 0, 140, 120],
        label: "Total Spending",
        // borderColor: "blue",
        borderColor: "#3e95cd",
        borderDash: ([10]),
        borderCapStyle: 'circle',
        pointBackgroundColor: "#3e95cd",
        pointstyle: 'circle',
        pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: 5,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }

    }
  });
  new Chart(document.getElementById("line-greenchart"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', ''],
      datasets: [{
        data: [100, 110, 120, 130, 170],
        label: "Savings",
        // borderColor: "blue",
        borderColor: "green",
        borderDash: ([10]),
        borderCapStyle: 'circle',
        pointBackgroundColor: "green",
        pointstyle: 'circle',
        pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: 5,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }
    }
  });
  new Chart(document.getElementById("line-redchart"), {
    type: 'line',
    data: {
      // labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
      labels: ['', '', '', '', ''],
      datasets: [{
        data: [100, 110, 120, 130, 110],
        label: "Foregone Savings",
        // borderColor: "blue",
        borderColor: "red",
        borderDash: ([10]),
        borderCapStyle: 'circle',
        pointBackgroundColor: "red",
        pointstyle: 'circle',
        pointHitRadius: 20,
        fill: false,
        lineTension: 0,
        pointRadius: 5,
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            display: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
            drawBorder: false,
            display: false,
          }
        }]
      },
      title: {
        display: false,
        text: '',
        legend: false,
        lable: false,
        showLine: false,
      },
      elements: {
        center: {
          text: '',
        }
      }
    }
  });

  clr = '#3e95cd'
  new Chart(document.getElementById("red-doughnut"), {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Balance'],
      datasets: [{
        backgroundColor: [clr, 'rgba(255,255,255,0)'],
        // borderColor:"#ccc",
        borderWidth: 2,
        data: ['100', '0'],
      }],
    },
    options: {
      cutoutPercentage: 80,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '',
      },
      elements: {
        center: {
          text: '804'
        }
      }
    },
  });

  Chart.pluginService.register({
    beforeDraw: function(chart) {
      var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;
      ctx.restore();
      var fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      var text = chart.config.options.elements.center.text,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  });

  clr = 'green'
  new Chart(document.getElementById("green-doughnut"), {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Balance'],
      datasets: [{
        backgroundColor: ['rgba(255,255,255,0)', clr],
        borderColor: "#ccc",
        borderWidth: 1,
        data: ['39', '61'],
      }],
    },
    options: {
      cutoutPercentage: 80,
      legend: {
        display: false
      },
      title: {

        display: true,
        text: '',

      },
      elements: {
        center: {
          text: '61%',
        }
      }

    },
  });


  clr = 'red'
  new Chart(document.getElementById("blue-doughnut"), {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Balance'],
      datasets: [{
        backgroundColor: ['rgba(255,255,255,0)', clr],
        borderColor: "#ccc",
        borderWidth: 1,
        data: ['61', '39'],
      }],
    },
    options: {
      cutoutPercentage: 80,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '',
      },
      elements: {
        center: {
          text: '39%' //set as you wish
        }
      }
    },
  });

  new Chart(document.getElementById("supplierdefect"), {
    type: 'bar',
    data: {
      labels: ["Supplier1", " Supplier1", "Supplier2", "Supplier3", "Supplier4", "Supplier5"],
      datasets: [

        {
          label: [""],
          type: "bar",
          borderColor: "#df8f45",
          backgroundColor: '#084d9d',
          minBarLength: 0,
          data: [15, 25, 22, 32, 19, 28],

        },
        {
          label: [""],
          type: "bar",
          borderColor: "#df8f45",
          backgroundColor: 'red',
          data: [5, 19, 11, 8, 21, 25],

        },
        {
          label: [""],
          type: "bar",
          borderColor: "#df8f45",
          backgroundColor: '#5cb85c',
          data: [56, 67, 60, 60, 60, 47],

        },

      ]

    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          align: 'center',
          anchor: 'center'
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
          barPercentage: 2,
          categoryPercentage: 0.3,
          ticks: {
            beginAtZero: true,
            display: true,
          },
          gridLines: {
            tickMarkLength: 1,
            display: false,
            drawBorder: true,
          },
        }],
        yAxes: [{
          stacked: true,
          gridLines: {
            display: false,
            drawBorder: false,
          },
          labels: {
            display: false
          },
          ticks: {
            display: false
          }

        }]
      },
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: false
      },
      labels: {
        display: false
      },
      elements: {
        center: {
          text: '',
        }
      }

    }

  })

  new Chart(document.getElementById("Deltime"), {
    type: 'horizontalBar',
    data: {
      labels: ["Supplier1", "Supplier2", "Supplier3", "Supplier4", "Supplier5", "Supplier6"],
      datasets: [

        {
          label: [],
          type: "horizontalBar",
          borderColor: "#df8f45",
          backgroundColor: '#5cb85c',
          minBarLength: 0,
          data: [74, 73, 47, 53, 67, 62],

        },
        {
          label: [],
          type: "horizontalBar",
          borderColor: "#df8f45",
          backgroundColor: '#f0ad4e',
          data: [18, 13, 18, 17, 12, 28],

        },
        {
          label: [],
          type: "horizontalBar",
          borderColor: "#df8f45",
          backgroundColor: '#d9534f',
          data: [8, 14, 35, 0, 21, 10],

        },

      ]

    },
    options: {
      plugins: {
        datalabels: {
          align: 'center',
          anchor: 'center',
          data: function(context) {
            return context.dataset.data;
          },
          borderRadius: 4,
          color: 'white',
          formatter: Math.round
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
          barPercentage: 2,
          categoryPercentage: 0.1,
          ticks: {
            beginAtZero: true,
            display: false
            // display: true,
          },
          gridLines: {
            tickMarkLength: 1,
            display: false,
            drawBorder: false,
          },

        }],
        yAxes: [{
          stacked: true,
          gridLines: {
            display: false,
            drawBorder: true,
          },
          labels: {
            display: false
          },
          ticks: {
            beginAtZero: true,
            display: true
          }

        }]
      },
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: true
      },
      labels: {
        display: false
      },
      elements: {
        center: {
          text: '',
        }
      }

    }

  })

  // new Chart(document.getElementById("progressbar"), {
  //   type: 'horizontalBar',
  //   data: {
  //     labels: ["", "", "", "", "", ""],
  //     datasets: [
  //
  //       {
  //         label: [],
  //         type: "horizontalBar",
  //         borderColor: "#df8f45",
  //         backgroundColor: ['#5cb85c','#f0ad4e','#5bc0de','#6c154d','#d9534f','#e6e20a'],
  //         minBarLength: 0,
  //         data: [75, 47, 74, 74, 9, 33],
  //
  //       },
  //       // {
  //       //   label: [],
  //       //   type: "horizontalBar",
  //       //   borderColor: "#df8f45",
  //       //   backgroundColor: '#f0ad4e',
  //       //   data: [18, 13, 18, 17, 12, 28],
  //       //
  //       // },
  //       // {
  //       //   label: [],
  //       //   type: "horizontalBar",
  //       //   borderColor: "#df8f45",
  //       //   backgroundColor: '#d9534f',
  //       //   data: [8, 14, 35, 0, 21, 10],
  //       //
  //       // },
  //
  //     ]
  //
  //   },
  //   options: {
  //     plugins: {
  //       datalabels: {
  //         align: 'center',
  //         anchor: 'center',
  //         data: function(context) {
  //           return context.dataset.data;
  //         },
  //         borderRadius: 4,
  //         color: 'white',
  //         formatter: Math.round
  //       }
  //     },
  //     scales: {
  //       xAxes: [{
  //         stacked: true,
  //         barPercentage: 2,
  //         categoryPercentage: 0.1,
  //         ticks: {
  //           beginAtZero: true,
  //           display: false
  //           // display: true,
  //         },
  //         gridLines: {
  //           tickMarkLength: 1,
  //           display: false,
  //           drawBorder: false,
  //         },
  //
  //       }],
  //       yAxes: [{
  //         stacked: true,
  //         gridLines: {
  //           display: false,
  //           drawBorder: false,
  //         },
  //         labels: {
  //           display: false
  //         },
  //         ticks: {
  //           beginAtZero: true,
  //           display: true
  //         }
  //
  //       }]
  //     },
  //     title: {
  //       display: false,
  //       text: ''
  //     },
  //     legend: {
  //       display: false
  //     },
  //     labels: {
  //       display: false
  //     },
  //     elements: {
  //       center: {
  //         text: '',
  //       }
  //     }
  //
  //   }
  //
  // })

})
