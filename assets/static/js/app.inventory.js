app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.inventory', {
      url: "/inventory",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.assets.allCheckins.html',
          controller: 'businessManagement.assets.form.info',
        }
      }
    })

});

app.controller("businessManagement.assets.form.info", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside, $timeout) {
  $scope.me = $users.get('mySelf');

  $scope.filters = {
    warehouse : '',
    search : ''
  }

  $scope.getWarehouse = function(){
    $http({
      method: 'GET',
      url: '/api/organization/unitLite/?warehouse=1'
    }).then(function(response) {
      if ($scope.me.is_superuser) {
        $scope.warehouseList = response.data
        $scope.filters.warehouse = $scope.warehouseList[0]
        $scope.getallCheckins()
      } else {
        $scope.filters.warehouse = $scope.me.designation.unit.pk +''
        $scope.warehouseList = $scope.me.designation.unit
        $scope.getallCheckins()
      }
    })
  }
  $scope.getWarehouse()

  $scope.getallCheckins = function() {
    var url = '/api/assets/checkin/?unit='+$scope.filters.warehouse.pk+'&limit='+$scope.limit+'&offset='+$scope.offset

    if ($scope.filters.search.length > 0) {
      url = url + '&search=' + $scope.filters.search
    }

    $http({
      method: 'GET',
      url: url
    }).then(function(response) {
      $scope.checkinsList = response.data.results
      $scope.checkinsPrev = response.data.previous
      $scope.checkinsNext = response.data.next
    })

    $http({
      method: 'GET',
      url: '/api/assets/getAssets/?unit='+$scope.filters.warehouse.name
    }).then(function(response) {
      $scope.grandTotal = response.data.total_price.price__sum
    })

  }

  $scope.prev = function() {
    if ($scope.checkinsPrev != null) {
      $scope.offset -= 10
      $scope.getallCheckins()
    }
  }

  $scope.next = function() {
    if ($scope.checkinsNext != null) {
      $scope.offset += 10
      $scope.getallCheckins()
    }
  }

  $scope.InventoryRefresh = function() {
    $scope.limit = 10
    $scope.offset = 0
    $scope.filters.search = ''
    $scope.getallCheckins()
  }
  $scope.InventoryRefresh()


  $scope.checkInFun = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.assets.explore.checkin.html',
      size: 'md',
      backdrop: false,
      resolve: {
        warehouse : function() {
          return $scope.filters.warehouse.pk
        }
      },
      controller: "businessManagement.assets.explore.checkin",
    }).result.then(function() {

    }, function() {
      $scope.getallCheckins()
    });
  }

  $scope.checkinAssignModal = function(item){

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.assets.assignCheckin.form.html',
      size: 'md',
      backdrop: false,
      resolve: {
        item: function() {
          return item;
        },
      },
      controller: function($scope, $uibModalInstance, item) {

        $scope.close = function(){
          $uibModalInstance.close();
        }

        $scope.item = item

        $scope.resetForm = function(){
          $scope.form = {
            approvedBy : '',
            to : '',
            personName : '',
            email : '',
            phone : '',
            address : '',
          }
        }

        if ($scope.item.assignedOn != null) {
          $scope.form = item
        } else {
          $scope.resetForm()
        }

        $scope.userSearch = function(query) {
          return $http.get('/api/HR/userSearch/?first_name__icontains=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.save = function() {
          if (typeof $scope.form.approvedBy != 'object') {
            Flash.create('danger', 'Please fill Approved By')
            return;
          }

          if ($scope.form.personName.length == 0  && typeof $scope.form.to != 'object') {
            Flash.create('danger', 'Please select or Fill Assign To')
          }

          if ($scope.form.personName.length > 0) {
            if ($scope.form.email.length == 0 || $scope.form.phone.length == 0 || $scope.form.address.length == 0) {
              Flash.create('danger', 'Please Fill Assign To Details')
            }
          }

          var dataToSend = {
            approvedBy : $scope.form.approvedBy.pk
          }

          if ($scope.form.personName.length > 0 && $scope.form.email.length > 0 && $scope.form.phone.length > 0 && $scope.form.address.length > 0) {
            dataToSend.personName = $scope.form.personName
            dataToSend.email = $scope.form.email
            dataToSend.phone = $scope.form.phone
            dataToSend.address = $scope.form.address
          }

          if (typeof $scope.form.to == 'object'){
            dataToSend.to = $scope.form.to.pk
          }

          $http({
            method: 'PATCH',
            url: '/api/assets/checkin/'+$scope.item.pk+'/',
            data: dataToSend,
          }).
          then(function(response) {
            Flash.create('success', 'Saved')
            $uibModalInstance.dismiss();
          })

        }

      },
    }).result.then(function() {

    }, function() {
      $scope.getallCheckins()
    });
  }

});


app.controller("businessManagement.assets.explore.checkin", function($scope, $rootScope,  $state, $users, $stateParams, $http, Flash, $uibModal, $uibModalInstance , warehouse) {

  $scope.warehouse = warehouse;

  $scope.refresh = function() {
    $scope.checkinForm = {
      'name' : '',
      'serialNo' : '',
      'warrantyTill' : '',
      'manufacturedOn' : '',
      'poNumber' : '',
      'price' : '',
    }
  }
  $scope.refresh()

  $scope.save = function() {

    if ($scope.checkinForm.name.length == 0  || $scope.checkinForm.serialNo == '' || $scope.checkinForm.poNumber == '' || $scope.checkinForm.price == '' || typeof $scope.checkinForm.warrantyTill!='object' || typeof $scope.checkinForm.manufacturedOn!='object') {
      Flash.create('danger', 'Please fill all details')
      return;
    }

    var serialNos = []
    serialNos = $scope.checkinForm.serialNo.split(",")

    var f = $scope.checkinForm;
    var url = '/api/assets/createCheckin/';

    var toSend = {
      name: f.name,
      manufacturedOn: f.manufacturedOn.toJSON().split('T')[0],
      warrantyTill: f.warrantyTill.toJSON().split('T')[0],
      price: f.price,
      warehouse : $scope.warehouse,
      serialNo:serialNos
    }
    if ($scope.checkinForm.poNumber.length > 0) {
      toSend.poNumber = f.poNumber
    }

    $http({
      method: 'POST',
      url: url,
      data: toSend,

    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      $scope.refresh()
      $uibModalInstance.dismiss();
    })


  }
  $scope.cancel = function() {
    $uibModalInstance.close();
  }

})
