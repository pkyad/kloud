app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.sales', {
      url: "/sales",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "menu@businessManagement.sales": {
          templateUrl: '/static/ngTemplates/genericMenu.html',
          controller: 'controller.generic.menu',
        },
        "@businessManagement.sales": {
          templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
          controller: 'businessManagement.finance.invoicing',
        }
      }
    })
    .state('businessManagement.sales.SaleOrder', {
      url: "/sales/saleOrder",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
      controller: 'businessManagement.finance.invoicing'
    })
    .state('businessManagement.sales.invoice', {
      url: "/sales/invoice",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.form.html',
      controller: 'businessManagement.finance.invoicing.form'
    })
    .state('businessManagement.sales.Outstanding', {
      url: "/sales/Outstanding",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
      controller: 'businessManagement.finance.invoicing'
    })
    .state('businessManagement.sales.Received', {
      url: "/sales/Received",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
      controller: 'businessManagement.finance.invoicing'
    })
    .state('businessManagement.sales.Overdue', {
      url: "/sales/Overdue",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
      controller: 'businessManagement.finance.invoicing'
    })
    .state('businessManagement.sales.Cancelled', {
      url: "/sales/Cancelled",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.html',
      controller: 'businessManagement.finance.invoicing'
    })
    .state('businessManagement.sales.createSales', {
      url: "/sales/sales",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.form.html',
      controller: 'businessManagement.finance.invoicing.form'
    })
    .state('businessManagement.sales.editSales', {
      url: "/sales/editSales/:id",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.form.html',
      controller: 'businessManagement.finance.invoicing.form'
    })
    .state('businessManagement.sales.editInvoice', {
      url: "/sales/editInvoice/:id",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.form.html',
      controller: 'businessManagement.finance.invoicing.form'
    })
    .state('businessManagement.sales.explore', {
      url: "/sales/explore/:id",
      templateUrl: '/static/ngTemplates/app.finance.invoicing.explore.html',
      controller: 'businessManagement.finance.invoicing.explore'
    })
});




app.controller('businessManagement.finance.invoicing', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  $scope.data = {
    tableData: []
  };

  $scope.goTo = function(state){
    $state.go('businessManagement.sales.' + state)
  }

  if ($state.is('businessManagement.sales')) {
    $scope.goTo('SaleOrder')
  }

  // views = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.finance.invoicing.item.html',
  // }, ];
  //
  // $scope.config = {
  //   views: views,
  //   url: '/api/finance/outBoundInvoice/',
  //   searchField: 'poNumber',
  //   itemsNumPerView: [12, 24, 48],
  // }




  $scope.deleteOutboundInv = function(indx){
    $http({
      method:'DELETE',
      url: '/api/finance/sale/'+$scope.InvoiceData[indx].pk+'/',
    }).then(function(response){
      $scope.InvoiceData.splice(indx,1)
      Flash.create('success','Deleted')
    })
  }
  $scope.getQtyDetails = function(pk){
    $http.get('/api/finance/salesQty/?outBound=' + pk).
    then(function(response) {
      console.log(response.data);
      $scope.products = response.data
    })
  }
  $scope.limit = 8;
  $scope.offset = 0
  $scope.prevInvs = function(){
    if ($scope.offset >0) {
      $scope.offset -= $scope.limit
      $scope.outboundInvoiceData()
    }
  }
  $scope.nextInvs = function(){
    var tot = $scope.offset+8
    if (tot < $scope.count) {
      $scope.offset += $scope.limit
      $scope.outboundInvoiceData()
    }
  }
  $scope.invoiceForm={
    ponumber:''
  }

$scope.filterOptions = []
$scope.getFilters = function(){
  $http({
    method: 'GET',
    url: '/api/finance/getOutBoundCount/',
  }).
  then(function(response) {
    $scope.filterOptions = response.data.data
  })

}
$scope.getFilters()
  // $scope.filterOptions = [
  //   {'name' : 'Sale Orders' , 'is_selected' : false, count : 2},
  //   {'name' : 'Approved' , 'is_selected' : false, count : 2},
  //   {'name' : 'Outstanding' , 'is_selected' : false, count : 2},
  //   {'name' : 'Overdue' , 'is_selected' : false, count : 2},
  //   {'name' : 'Received' , 'is_selected' : false, count : 2},
  //   {'name' : 'Cancelled' , 'is_selected' : false, count : 0},
  // ]


  $scope.sortAmount = {
    'is_sort' :false
  }

  $scope.filters = ''
  var params = $state
  $scope.filters = params.current.name.split('.')[2]
  if (  $scope.filters  == undefined) {
    $scope.filters = ''
  }
  $scope.outboundInvoiceData = function(){
    var url='/api/finance/sale/?limit='+$scope.limit+'&offset='+$scope.offset
    // for (var i = 0; i < $scope.filterOptions.length; i++) {
    //   if ($scope.filterOptions[i].is_selected == true) {
    //     $scope.filters.push($scope.filterOptions[i].name)
    //   }
    // }
    if ($scope.filters.length>0) {
      if ($scope.filters == 'Outstanding') {
          url = url+'&isInvoice=true&status=SaleOrder&cancelled=false'
      }
      else if ($scope.filters == 'SaleOrder') {
          url = url+'&isInvoice=false&status=SaleOrder&cancelled=false'
      }
      else if ($scope.filters == 'Cancelled') {
          url = url+'&isInvoice=false&cancelled=true'
      }
      else{
        url = url+'&isInvoice=false&cancelled=false&status='+$scope.filters
      }
      // else{
      //   url = url+'&haveparent=&filters='+$scope.filters
      // }
    }
    if ($scope.invoiceForm.ponumber.length>0) {
        url = url+'&search__in='+$scope.invoiceForm.ponumber
    }
    if ($scope.sortAmount.is_sort == true) {
      url = url+'&sort='
    }
    $http.get(url).
    then(function(response) {
      console.log(response.data);
      $scope.InvoiceData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.outboundInvoiceData()


  $scope.download = function(){
    var url='/api/finance/invoicingSpreadsheet/?all='
    $scope.filters = []
    for (var i = 0; i < $scope.filterOptions.length; i++) {
      if ($scope.filterOptions[i].is_selected == true) {
        $scope.filters.push($scope.filterOptions[i].name)
      }
    }
    if ($scope.filters.length>0) {
      url = url+'&filters='+$scope.filters
    }
    if ($scope.invoiceForm.ponumber.length>0) {
        url = url+'&search__in='+$scope.invoiceForm.ponumber
    }
    if ($scope.sortAmount.is_sort == true) {
      url = url+'&sort='
    }
    window.location.href=url
  }

})

app.controller('businessManagement.finance.invoicing.explore', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {
$scope.min_height  = 70
$scope.productForm = {
  product: '',
  qty : 1,
  price : 0 ,
  hsn : '',
  tax : 0,
  total : 0,

}

$scope.selectTerms = function(data){
  $scope.documents[$scope.inView].termsandcondition = data
  $scope.documents[$scope.inView].terms = data.body
}
$scope.accounts = []
$scope.getAccounts = function(){
  $http({
    method: 'GET',
    url: '/api/finance/account/?only=accounts',
  }).
  then(function(response) {
    $scope.accounts = response.data
  })
}
$scope.getAccounts()
$scope.allTransactions = []
  $scope.getTransaction = function(){
    $http({
      method: 'GET',
      url: '/api/finance/transaction/?outBound='+ $scope.documents[$scope.inView].pk+'&account__filter=',
    }).
    then(function(response) {
      $scope.allTransactions = response.data
    })
  }
  $scope.allTermsandCondition = []
    $scope.getTermsandCondition = function(){
      $http({
        method: 'GET',
        url: '/api/finance/termsAndConditions/',
      }).
      then(function(response) {
        $scope.allTermsandCondition = response.data
      })
    }

    $scope.getTermsandCondition()
  $scope.getDetails = function(){
    $scope.documents = []
    $http.get('/api/finance/outbondInvoiceDetails/?id=' + $state.params.id).
    then(function(response) {
      $scope.inView = 0
      $scope.form = response.data
      $scope.selectedId = $scope.form.pk
      $scope.form.inWords  = price_in_words($scope.form.total)
      $scope.documents = [$scope.form]
      $scope.selectedId = $scope.documents[0].pk
      for (var i = 0; i < $scope.form.children.length; i++) {
        var data  = $scope.form.children[i]
        data.parent = $scope.form.pk
        data.inWords  = price_in_words(data.total)
        data.productForm = $scope.productForm
        $scope.documents.push(data)
      }
      if ($scope.form.isInvoice == true) {
        $scope.getTransaction()
      }
    })
  }


  $scope.updateAmount = function(){
    $http.get('/api/finance/getUpdatedInvoiceAmount/?id=' + $state.params.id).
    then(function(response) {
      $scope.form.total = response.data.total
      $scope.form.paidAmount = response.data.paidAmount
      $scope.form.receivedAmount = response.data.receivedAmount
      $scope.form.balanceAmount = response.data.balanceAmount
    })
  }

  $scope.getParticularInv = function(){
    $http.get('/api/finance/outbondInvoiceDetails/?id=' + $scope.documents[$scope.inView].pk).
    then(function(response) {
      $scope.documents[$scope.inView].balanceAmount = response.data.balanceAmount
      $scope.documents[$scope.inView].paidAmount = response.data.paidAmount
    })
  }

  $scope.data = {
    amount : 0,
    account : '',
    dated : new Date(),
    externalReferenceID:''
  }
  $scope.savePayment = function(){
    if ($scope.data.amount == null || $scope.data.amount == 0 || $scope.data.amount>$scope.documents[$scope.inView].balanceAmount || $scope.data.amount.toString().length == 0 ) {
      Flash.create('warning' , 'Invalid Amount')
      return
    }
    if (typeof $scope.data.account !='object' || $scope.data.account.length == 0) {
      Flash.create('warning' , 'Select Account')
      return
    }
    var data = $scope.data
    data.account = $scope.data.account.pk
    data.purchase = $scope.documents[$scope.inView].pk
    data.dated = data.dated.toJSON().split('T')[0]
    data.frmaccount = $scope.documents[$scope.inView].account.pk
    $http({
      method: 'POST',
      url: '/api/finance/salesTransactionCreate/',
      data:data
    }).
    then(function(response) {
      $scope.allTransactions.push(response.data)
      $scope.data = {amount : 0,account : '',dated : new Date(),externalReferenceID:''}
      $scope.getParticularInv()
      $scope.updateAmount()
    })
  }
  $scope.selectedView = function(indx){
    $scope.inView = indx
    $scope.selectedId = $scope.documents[indx].pk
    if ($scope.documents[$scope.inView].isInvoice) {
      $scope.getTransaction()
    }
    $scope.documents[$scope.inView].productForm = {product: '',qty : 1,  price : 0 ,hsn : '',tax : 0,total : 0,}
  }


  $scope.createChild  = function(){
    $scope.newData = {
      parent : $scope.form.pk,
      isInvoice: true,
      poNumber: $scope.form.poNumber,
      name: $scope.form.name,
      personName: $scope.form.personName,
      phone: $scope.form.phone,
      email: $scope.form.email,
      address: $scope.form.address,
      pincode: $scope.form.pincode,
      state: $scope.form.state,
      city: $scope.form.city,
      country: $scope.form.country,
      pin_status: '1',
      deliveryDate: $scope.form.deliveryDate,
      payDueDate: $scope.form.payDueDate,
      gstIn: $scope.form.gstIn,
      costcenter: $scope.form.costCenter,
      invoiceqty : [],
      total : 0,
      account : $scope.form.account,
      contact : $scope.form.contact,
      terms : $scope.form.terms,
      serviceFor : $scope.form.serviceFor,
      isPerforma : $scope.form.isPerforma,
    }
    $scope.documents.push($scope.newData)
    $scope.inView = $scope.documents.length-1
    $scope.allTransactions = []
    for (var i = 0; i < $scope.allTermsandCondition.length; i++) {
      if ($scope.allTermsandCondition[i].pk == $scope.form.termsandcondition) {
         $scope.form.termsandcondition = $scope.allTermsandCondition[i]
      }
    }
    if ($scope.newData.serviceFor!=null) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.finance.soAdd.html',
      size: 'lg',
      backdrop:false,
      resolve: {
        serviceFor: function() {
          return $scope.newData.serviceFor
        }
      },
      backdrop: true,
      controller: function($scope, $http, Flash, $users, $uibModalInstance , serviceFor) {
          $http.get('/api/finance/getAllTour/?serviceFor='+serviceFor).
          then(function(response) {
            $scope.invoiceqty = response.data
            if ($scope.invoiceqty.length == 0) {
              $uibModalInstance.dismiss($scope.invoiceqty);
            }
          })
          $scope.submit = function(){
            var data = []
            for (var i = 0; i < $scope.invoiceqty.length; i++) {
              if ($scope.invoiceqty[i].selected == true) {
                data.push($scope.invoiceqty[i])
              }
            }
            $uibModalInstance.dismiss(data);
          }
      }
    }).result.then(function() {}, function(data) {
      if (data.length>0) {
        $scope.documents[$scope.inView].invoiceqty = data
        $scope.calc()
      }
      });
  }


  }

    $scope.getSettings = function(){
      $http.get('/api/clientRelationships/invoiceSettings/').
      then(function(response) {
        console.log(response.data);
        $scope.settings = response.data
      })
    }
    $scope.getSettings()
    $scope.getDetails()

    $scope.resetForm = function() {
      $scope.form = {
        isInvoice: true,
        poNumber: '',
        name: '',
        personName: '',
        phone: '',
        email: '',
        address: '',
        pincode: '',
        state: '',
        city: '',
        country: '',
        pin_status: '1',
        deliveryDate: new Date(),
        payDueDate: new Date(),
        gstIn: '',
        project: '',
        costcenter: '',
        bussinessunit: '',
        pincodeData:[],
        invoiceqty : [],
        total : 0,
        isPerforma : false
      }
    }

  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?limit=10&search=' + c).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.productSearch = function(c) {
    return $http.get('/api/finance/salesQty/?limit=10&product__icontains=' + c).
    then(function(response) {
      return response.data.results;
    })
  }

$scope.calc = function(){
  $scope.documents[$scope.inView].total = 0
  for (var i = 0; i < $scope.documents[$scope.inView].invoiceqty.length; i++) {
    $scope.documents[$scope.inView].invoiceqty[i].total = 0
    var p = $scope.documents[$scope.inView].invoiceqty[i].price
    var q = $scope.documents[$scope.inView].invoiceqty[i].qty
    if ($scope.documents[$scope.inView].invoiceqty[i].hsn!=null && typeof $scope.documents[$scope.inView].invoiceqty[i].hsn == 'object') {
        var tx = parseFloat($scope.documents[$scope.inView].invoiceqty[i].hsn.taxRate)
        var txAmount = parseFloat(((tx * p) / 100).toFixed(2))
        $scope.documents[$scope.inView].invoiceqty[i].taxPer = $scope.documents[$scope.inView].invoiceqty[i].hsn.taxRate
      }
      else {
        var txAmount = 0
    }
    $scope.documents[$scope.inView].invoiceqty[i].tax = txAmount
    $scope.documents[$scope.inView].invoiceqty[i].total = Math.round(((parseFloat(p) + parseFloat(txAmount)) * q), 2)
    $scope.documents[$scope.inView].total+=$scope.documents[$scope.inView].invoiceqty[i].total
  }
  $scope.documents[$scope.inView].inWords  = price_in_words($scope.documents[$scope.inView].total)
}
$scope.addProduct = function(){
  var prodData = $scope.documents[$scope.inView]
  if (prodData.productForm.product == null || prodData.productForm.product.length == 0 || prodData.productForm.qty == null || prodData.productForm.qty == 0 || prodData.productForm.qty.length == 0  || prodData.productForm.price == null || prodData.productForm.price.length == 0 || prodData.productForm.price == 0) {
    Flash.create('warning','Add Product, Price and Quantity')
    return
  }
  $scope.documents[$scope.inView].invoiceqty.push(prodData.productForm)
  $scope.documents[$scope.inView].productForm = {product: '',qty : 1,  price : 0 ,hsn : '',tax : 0,total : 0,}
  $scope.calc()
}

$scope.save = function(){
  var fromData = $scope.documents[$scope.inView]
  // if (fromData.name == null || fromData.name.length == 0 ) {
  //   Flash.create('danger','Enter the Name')
  //   return
  // }
  if (fromData.personName == null || fromData.personName.length == 0) {
    Flash.create('danger','Enter the Person name')
    return
  }
  if (fromData.phone == null || fromData.phone.length == 0) {
    Flash.create('danger','Enter the Phone Number')
    return
  }
  if (fromData.email == null || fromData.email.length == 0) {
    Flash.create('danger','Enter the Email')
    return
  }
  if (fromData.address == null || fromData.address.length == 0) {
    Flash.create('danger','Enter the Address')
    return
  }
  if (fromData.pincode == null || fromData.pincode.length == 0) {
    Flash.create('danger','Enter the valid pincode')
    return
  }
  var dataToSend ={
    'name' : fromData.name,
    'poNumber' : fromData.poNumber,
    'personName' : fromData.personName,
    'phone' : fromData.phone,
    'email' : fromData.email,
    'pincode' : fromData.pincode,
    'address' : fromData.address,
    'city' : fromData.city,
    'state' : fromData.state,
    'country' : fromData.country,
    'total': fromData.total,
    'gstIn' : fromData.gstIn,
    'isInvoice' : true,
    'isPerforma' : fromData.isPerforma,
  }
  if (fromData.pk) {
    dataToSend.pk = fromData.pk
    dataToSend.balanceAmount = fromData.total - fromData.paidAmount
  }
  else{
    dataToSend.balanceAmount = fromData.total
  }
  if (fromData.contact) {
    dataToSend.contact = fromData.contact
  }
  if (fromData.deliveryDate != null && typeof fromData.deliveryDate == 'string') {
    dataToSend.deliveryDate = fromData.deliveryDate
  }
  if (fromData.payDueDate != null && typeof fromData.payDueDate == 'string') {
    dataToSend.payDueDate = fromData.payDueDate
  }
  if (fromData.costcenter != null && typeof fromData.costcenter == 'object') {
    dataToSend.costcenter = fromData.costcenter.pk
  }

  if (fromData.account != null && typeof fromData.account == 'object') {
    dataToSend.account = fromData.account.pk
  }
  if(fromData.parent){
    dataToSend.parent = fromData.parent
  }
  if (typeof fromData.termsandcondition == 'object') {
      dataToSend.termsandcondition = fromData.termsandcondition.pk
      dataToSend.terms = fromData.terms
  }
  var products = []
  for (var i = 0; i < fromData.invoiceqty.length; i++) {
    var tempData = fromData.invoiceqty[i]
    if (tempData.hsn!=null && typeof tempData.hsn == 'object') {
      tempData.hsn = tempData.hsn.pk
    }
    if (tempData.id) {
      tempData.id = tempData.id
    }
    products.push(fromData.invoiceqty[i])
  }
  dataToSend.products = products

  if ($scope.form.serviceFor!=null && typeof $scope.form.serviceFor == 'object') {
    dataToSend.serviceFor = $scope.form.serviceFor.stateAlias
  }
  else if($scope.form.serviceFor!=null && $scope.form.serviceFor.length>0){
    dataToSend.serviceFor = $scope.form.serviceFor
  }
  $http({
    method: 'POST',
    url: '/api/finance/outbondInvoiceDetails/',
    data: dataToSend
  }).
  then(function(response) {
    var parent = $scope.form.pk
    $scope.documents[$scope.inView] = response.data
    $scope.documents[$scope.inView].parent = parent
    $scope.documents[$scope.inView].indx = $scope.inView
    $scope.documents[$scope.inView].inWords  = price_in_words(response.data.total)
    $scope.updateAmount()
    Flash.create('success','Saved')
  })
}

$scope.removeProduct = function(indx){
  var prodData = $scope.documents[$scope.inView].invoiceqty[indx]
  if (prodData.pk) {
    $http({
      method: 'DELETE',
      url: '/api/finance/salesQty/' + prodData.pk +'/',
    }).
    then(function(response) {
      $scope.documents[$scope.inView].invoiceqty.splice(indx,1)
      $scope.calc()
    })
  }
  else{
    $scope.documents[$scope.inView].invoiceqty.splice(indx,1)
    $scope.calc()
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
  var p = parseFloat($scope.documents[$scope.inView].productForm.price)
  var q = parseInt($scope.documents[$scope.inView].productForm.qty)
  if (typeof $scope.documents[$scope.inView].productForm.hsn == 'object') {
      var tx = parseFloat($scope.documents[$scope.inView].productForm.hsn.taxRate)
      var txAmount = parseFloat(((tx * p) / 100).toFixed(2))
      $scope.documents[$scope.inView].productForm.tax = txAmount
    }
    else {
      var txAmount = 0
      $scope.documents[$scope.inView].productForm.tax = 0
    }
    $scope.documents[$scope.inView].productForm.total = Math.round(((parseFloat(p) + parseFloat(txAmount)) * q), 2)
  }
  }
}, true)


  $scope.changeStatus = function(sts){
    console.log(sts);
    if (sts==undefined) {
      var toSend = {isInvoice:true}
    }else if(sts=='Cancel'){
      var toSend = {cancelled:true}
    }
    else {
      var toSend = {status:sts}
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/sale/' + $scope.form.pk + '/',
      data:toSend
    }).
    then(function(response) {
      Flash.create('success', 'Updated');
      $scope.form.status = response.data.status
      $scope.form.isInvoice = response.data.isInvoice
      $scope.form.cancelled = response.data.cancelled
    })
  }

})

app.controller('businessManagement.finance.invoicing.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal, $timeout) {
console.log('ggg');
  $scope.getDetails = function(){
    $http.get('/api/finance/outbondInvoiceDetails/?id=' + $state.params.id).
    then(function(response) {
      $scope.form = response.data
      $scope.inWords  = price_in_words($scope.form.total)
      $scope.getCurrentAccounts()
    })
  }
  $scope.contactSearch = function(query) {
    return $http.get('/api/clientRelationships/contact/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  }

  $scope.allApplications = []
    $scope.getallApplications = function(){
      $http({
        method: 'GET',
        url: '/api/ERP/getapplication/?statealias=false',
      }).
      then(function(response) {
        $scope.allApplications = response.data

      })
    }
  $scope.getallApplications()


$scope.assetsAccounts = []
  $scope.getCurrentAccounts = function(){
    $http({
      method: 'GET',
      url: '/api/finance/accountLite/?personal=false&heading=income',
    }).
    then(function(response) {
      $scope.assetsAccounts = response.data
      if ($scope.form.pk) {
        for (var i = 0; i < $scope.assetsAccounts.length; i++) {
          if ($scope.assetsAccounts[i].pk == $scope.form.account.pk) {
            $scope.form.account = $scope.assetsAccounts[i]
          }
        }
      }
    })
  }



    $scope.allTermsandCondition = []
      $scope.getTermsandCondition = function(){
        $http({
          method: 'GET',
          url: '/api/finance/termsAndConditions/',
        }).
        then(function(response) {
          $scope.allTermsandCondition = response.data
        })
      }

        $scope.getTermsandCondition()

    $scope.selectTerms = function(){
      $scope.form.terms = $scope.form.termsandcondition.body
    }
  // $scope.getprojetDetails = function(pk){
  //   $http.get('/api/projects/project/?ourBoundInvoices=' + $state.params.id).
  //   then(function(response) {
  //     console.log(response.data);
  //     if (response.data.length==1) {
  //       $scope.form.project = response.data[0]
  //     }else {
  //       $scope.form.project == null
  //     }
  //   })
  // }

  $scope.$watch('form.personName', function(newValue, oldValue) {
    if (typeof newValue == 'object') {
      $scope.form.contact = newValue.pk
      $scope.form.email = newValue.email
      $scope.form.phone = newValue.mobile
      if (newValue.company!=null) {
        $scope.form.name = newValue.company.name
      }
      $scope.form.address = newValue.street
      $scope.form.pincode = newValue.pincode
      $scope.form.state = newValue.state
      $scope.form.city = newValue.city
      $scope.form.country = newValue.country
      // $scope.form.personName = newValue.name
    }
  }, true)

  $scope.getSettings = function(){
    $http.get('/api/clientRelationships/invoiceSettings/').
    then(function(response) {
      console.log(response.data);
      $scope.settings = response.data
    })
  }
  $scope.getSettings()
  $scope.resetForm = function() {
    $scope.form = {
      isInvoice: false,
      poNumber: '',
      name: '',
      personName: '',
      phone: '',
      email: '',
      address: '',
      pincode: '',
      state: '',
      city: '',
      country: '',
      pin_status: '1',
      deliveryDate: new Date(),
      payDueDate: new Date(),
      gstIn: '',
      project: '',
      costcenter: '',
      bussinessunit: '',
      pincodeData:[],
      invoiceqty : [],
      total : 0,
      account : '',
      terms:'',
      termsandcondition:'',
      serviceFor : '',
      isPerforma : false
    }
  }
  $scope.resetProdForm = function(){
    $scope.productForm = {
      product: '',
      qty : 1,
      price : 0 ,
      hsn : '',
      tax : 0,
      total : 0,

    }
  }
 $scope.showPerforma = false
  if  ($state.is('businessManagement.sales.editSales') || $state.is('businessManagement.sales.editInvoice')) {
      $scope.mode = 'edit';
      $scope.getDetails()

  }
  else {
    $scope.mode = 'new';
     $scope.resetForm()
     if ($state.is('businessManagement.sales.invoice')) {
       $scope.form.isInvoice = true
       $scope.showPerforma = true
     }
     $scope.getCurrentAccounts()
  }
  $scope.$watch('form.pincode', function(newValue, oldValue) {
    if (newValue != null && newValue.length > 0) {
      $http.get('/api/ERP/genericPincode/?pincode__iexact=' + newValue).
      then(function(response) {
        if (response.data.length > 0) {
          $scope.form.city = response.data[0].city
          $scope.form.state = response.data[0].state
          $scope.form.country = response.data[0].country
          $scope.form.pincode = response.data[0].pincode
        }
        else{
          $scope.form.city = ''
          $scope.form.state = ''
          $scope.form.country = ''
        }
      })
    }
  },true)
  $scope.projectSearch = function(query) {
    return $http.get('/api/projects/project/?limit=10&title__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };1
  $scope.costCenterSearch = function(query) {
    return $http.get('/api/finance/costCenter/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };
  $scope.unitSearch = function(query) {
    return $http.get('/api/organization/unit/?limit=10&name__icontains=' + query).
    then(function(response) {
      return response.data.results;
    })
  };

  $scope.searchTaxCode = function(c) {
    return $http.get('/api/ERP/productMeta/?limit=10&search=' + c).
    then(function(response) {
      return response.data.results;
    })
  }
  $scope.productSearch = function(c) {
    return $http.get('/api/finance/salesQty/?limit=10&product__icontains=' + c).
    then(function(response) {
      return response.data.results;
    })
  }
$scope.inWords = ''
$scope.calc = function(){
  $scope.form.total = 0
  for (var i = 0; i < $scope.form.invoiceqty.length; i++) {
    $scope.form.invoiceqty[i].total = 0
    var p = $scope.form.invoiceqty[i].price
    var q = $scope.form.invoiceqty[i].qty
    if ($scope.form.invoiceqty[i].hsn!=null && typeof $scope.form.invoiceqty[i].hsn == 'object') {
        var tx = parseFloat($scope.form.invoiceqty[i].hsn.taxRate)
        var txAmount = parseFloat(((tx * p) / 100).toFixed(2))
      }
      else {
        var txAmount = 0
    }
    $scope.form.invoiceqty[i].tax = txAmount
    $scope.form.invoiceqty[i].total = Math.round(((parseFloat(p) + parseFloat(txAmount)) * q), 2)
    $scope.form.total+=$scope.form.invoiceqty[i].total
  }
  $scope.inWords  = price_in_words($scope.form.total)
}
$scope.addProduct = function(){
  if ($scope.productForm.product == null || $scope.productForm.product.length == 0 || $scope.productForm.qty == null || $scope.productForm.qty == 0 || $scope.productForm.qty.length == 0  || $scope.productForm.price == null || $scope.productForm.price.length == 0 || $scope.productForm.price == 0) {
    Flash.create('warning','Add Product, Price and Quantity')
    return
  }
  $scope.form.invoiceqty.push($scope.productForm)
  $scope.resetProdForm()
  $scope.calc()
}



$scope.$watch('productForm', function(newValue, oldValue) {
  if (typeof $scope.productForm.product == 'object') {
    $scope.productForm.product = $scope.productForm.product.product
  }
  else{
    $scope.productForm.product =  $scope.productForm.product
  }
  var p = parseFloat($scope.productForm.price)
  var q = parseInt($scope.productForm.qty)
  if (typeof $scope.productForm.hsn == 'object') {
      var tx = parseFloat($scope.productForm.hsn.taxRate)
      var txAmount = parseFloat(((tx * p) / 100).toFixed(2))
      $scope.productForm.tax = txAmount
      $scope.productForm.taxPer = $scope.productForm.hsn.taxRate
      console.log($scope.productForm.tax);
    }
    else if ($scope.productForm.hsn == null || $scope.productForm.hsn.length == 0){
      var txAmount = 0
      $scope.productForm.tax = 0
    }
    $scope.productForm.total = Math.round(((parseFloat(p) + parseFloat(txAmount)) * q), 2)
}, true)


$scope.save = function(){

  // if ($scope.form.name == null || $scope.form.name.length == 0 ) {
  //   Flash.create('danger','Enter the Name')
  //   return
  // }
  if ($scope.form.personName == null || $scope.form.personName.length == 0) {
    Flash.create('danger','Enter the Person name')
    return
  }
  if ($scope.form.phone == null || $scope.form.phone.length == 0) {
    Flash.create('danger','Enter the Phone Number')
    return
  }
  if ($scope.form.email == null || $scope.form.email.length == 0) {
    Flash.create('danger','Enter the Email')
    return
  }
  if ($scope.form.address == null || $scope.form.address.length == 0) {
    Flash.create('danger','Enter the Address')
    return
  }
  if ($scope.form.pincode == null || $scope.form.pincode.length == 0) {
    Flash.create('danger','Enter the valid pincode')
    return
  }
  if ($scope.form.account == null || typeof $scope.form.account != 'object') {
    Flash.create('danger','Select Sales Category')
    return
  }
  var dataToSend ={
    'name' : $scope.form.name,
    'poNumber' : $scope.form.poNumber,
    'phone' : $scope.form.phone,
    'email' : $scope.form.email,
    'pincode' : $scope.form.pincode,
    'address' : $scope.form.address,
    'city' : $scope.form.city,
    'state' : $scope.form.state,
    'country' : $scope.form.country,
    'total': $scope.form.total,
    'gstIn' : $scope.form.gstIn,
    'isInvoice' :  $scope.form.isInvoice,
    'terms' :  $scope.form.terms,
    'isPerforma' :  $scope.form.isPerforma,
  }
  // if ($scope.form.contact) {
  //   dataToSend.contact = $scope.form.contact
  // }
  if (typeof $scope.form.personName == 'object') {
    dataToSend.personName = $scope.form.personName.name
    dataToSend.contact = $scope.form.contact
  }
  else{
    dataToSend.personName = $scope.form.personName
  }
  if ($scope.form.pk) {
    dataToSend.pk = $scope.form.pk
    dataToSend.balanceAmount =  $scope.form.total - $scope.form.paidAmount
  }
  else{
    dataToSend.balanceAmount = $scope.form.total
  }
  if ($scope.form.deliveryDate != null && typeof $scope.form.deliveryDate == 'object') {
    dataToSend.deliveryDate = $scope.form.deliveryDate.toISOString().split('T')[0]
  }
  if ($scope.form.payDueDate != null && typeof $scope.form.payDueDate == 'object') {
    dataToSend.payDueDate = $scope.form.payDueDate.toISOString().split('T')[0]
  }
  if ($scope.form.costcenter != null && typeof $scope.form.costcenter == 'object') {
    dataToSend.costcenter = $scope.form.costcenter.pk
  }
  if ($scope.form.account != null && typeof $scope.form.account == 'object') {
    dataToSend.account = $scope.form.account.pk
  }
  var products = []
  for (var i = 0; i < $scope.form.invoiceqty.length; i++) {
    var tempData = $scope.form.invoiceqty[i]
    if (tempData.hsn!=null && typeof tempData.hsn == 'object') {
      tempData.taxPer = tempData.hsn.taxRate
      tempData.hsn = tempData.hsn.code
    }
    products.push($scope.form.invoiceqty[i])
  }
  dataToSend.products = products
  if (typeof $scope.form.termsandcondition == 'object'){
    dataToSend.termsandcondition = $scope.form.termsandcondition.pk
    dataToSend.terms =  $scope.form.termsandcondition.body
  }

  // if (typeof $scope.form.serviceFor == 'object') {
  //   dataToSend.serviceFor = $scope.form.serviceFor.stateAlias
  // }
  // else if($scope.form.serviceFor.length>0){
  //   dataToSend.serviceFor = $scope.form.serviceFor
  // }
  $http({
    method: 'POST',
    url: '/api/finance/outbondInvoiceDetails/',
    data: dataToSend
  }).
  then(function(response) {
    $scope.form = response.data
    Flash.create('success','Saved')
    if  ($state.is('businessManagement.sales.createSales') ) {
      $state.go('businessManagement.sales.editSales',{'id' : $scope.form.pk})
    }
    else if($state.is('businessManagement.sales.invoice')){
        $state.go('businessManagement.sales.editInvoice',{'id' : $scope.form.pk})
    }
    else{
      $scope.getDetails()
    }
  })
}

$scope.removeProduct = function(indx){
  var prodData = $scope.form.invoiceqty[indx]
  if (prodData.pk) {
    $http({
      method: 'DELETE',
      url: '/api/finance/salesQty/' + prodData.pk +'/',
    }).
    then(function(response) {
      $scope.form.invoiceqty.splice(indx,1)
      $scope.calc()
    })
  }
  else{
    $scope.form.invoiceqty.splice(indx,1)
    $scope.calc()
  }
}




$scope.resetProdForm()


})
