app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.catalogmaker', {
    url: "/catalogmaker",
    templateUrl: '/static/ngTemplates/app.businessmanagement.category.html',
    controller: 'businessManagement.category'
  }).state('businessManagement.product', {
    url: "/product/:id",
    templateUrl: '/static/ngTemplates/app.businessmanagement.catalogmaker.html',
    controller: 'businessManagement.catalog'
  })

});


app.controller('businessManagement.category', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal) {
$scope.deleteCategory = function(indx){
  $http({
    method: 'DELETE',
    url: '/api/finance/category/'+$scope.allCategories[indx].pk+'/',
  }).
  then(function(response) {
    $scope.allCategories.splice(indx,1)
  })
}

$scope.addCategory = function(indx){
  if (indx!=undefined) {
    var data = $scope.allCategories[indx]
  }
  else{
    var data = ''
  }
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.finance.addNewCategory.modal.html',
    size: 'md',
    backdrop: true,
    resolve: {
      data: function() {
        return data;
      },
    },
    controller: 'controller.addNewCategory'
  }).result.then(function() {
  }, function() {
    $scope.getCategory()
  });
}

$scope.getCategory = function(){

  $http({
    method: 'GET',
    url: '/api/finance/category/',
  }).
  then(function(response) {
    $scope.allCategories = response.data
  })
}

$scope.getCategory()

})
app.controller('controller.addNewCategory', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModalInstance, data) {

    $scope.colors = ['red','blue','black','green']
    $scope.form = {
      name:'',
      theme_color:$scope.colors[0]
    }
    if (typeof data == 'object') {
      $scope.form = data
    }


    $scope.save = function(){
      if ($scope.form.name == null || $scope.form.name.length == 0) {
          Flash.create('warning' , 'Category name is required')
          return
      }
      var method = 'POST'
      var url = '/api/finance/category/'
      if ($scope.form.pk) {
        url += $scope.form.pk +'/'
        method = 'PATCH'
      }
      $http({
        method: method,
        url: url,
        data : $scope.form
      }).
      then(function(response) {
        Flash.create("success", 'Saved')
        $uibModalInstance.dismiss();
      })
    }
})
app.controller('businessManagement.catalog', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal) {
    $scope.search = "";
    $scope.category  = $state.params.id
    $scope.dataURL = '/products/'+ $state.params.id+'/'
    $scope.limit = 7
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
        var url = '/api/finance/inventory/?name__icontains=' + searchValue + '&limit=' + $scope.limit + '&offset=' + $scope.offset+'&category='+$state.params.id
      } else {
        var url = '/api/finance/inventory/?limit=' + $scope.limit + '&offset=' + $scope.offset+'&category='+$state.params.id
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

    $scope.deleteData = function(indx) {
      $http({
        method: 'DELETE',
        url: '/api/finance/inventory/' +  $scope.inventoryData[indx].pk+'/'
      }).
      then(function(response) {
        $scope.inventoryData.splice(indx, 1)
        Flash.create('success','Deleted...!!!')
        $scope.getAll(false,'')
        $scope.getProducts()
      })

    }

    $scope.addInventory = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.finance.inventoryProductCatalog.modal.html',
        size: 'xl',
        backdrop: true,

        controller: function($scope, $uibModalInstance, $rootScope) {

          $scope.productMetaSearch = function(query) {
            return $http.get('/api/ERP/productMeta/?code__contains=' + query).
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
              productMeta:'',
              taxRate:'',
              taxDescription:'',
              img1:emptyFile,
              img2:emptyFile,
              img3:emptyFile,
              richtxtDesc:'',
              mrp:''
            }
          }

          $scope.refresh()
          $scope.selectedMeta = function(){
              if (typeof $scope.form.taxCode == 'object') {
                // $scope.form.taxDescription = $scope.form.productMeta.description
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

            var fd = new FormData();
            fd.append('name', $scope.form.name);
            fd.append('value', $scope.form.value);
            fd.append('rate', $scope.form.rate);
            fd.append('buyingPrice', $scope.form.buyingPrice);
            fd.append('category',$state.params.id);
            fd.append('mrp',$scope.form.mrp);

            if ($scope.form.sku != undefined &&  $scope.form.sku != null  ) {
                fd.append('sku',$scope.form.sku);
            }


            if ($scope.form.taxRate!=null) {
            fd.append('taxRate',$scope.form.taxRate);
            }
            if ($scope.form.taxCode!=null) {
            fd.append('taxCode',$scope.form.taxCode);
            }

            if ($scope.form.richtxtDesc!=null) {
            fd.append('richtxtDesc',$scope.form.richtxtDesc);
            }

            if ($scope.form.img1!=null&&$scope.form.img1!=emptyFile&&typeof $scope.form.img1=='object') {
              fd.append('img1',$scope.form.img1);
            }
            if ($scope.form.img2!=null&&$scope.form.img2!=emptyFile&&typeof $scope.form.img2=='object') {
              fd.append('img2',$scope.form.img2);
            }
            if ($scope.form.img3!=null&&$scope.form.img3!=emptyFile&&typeof $scope.form.img3=='object') {
                fd.append('img3',$scope.form.img3);
            }

            $http({
              method: 'POST',
              url: '/api/finance/inventory/',
              data: fd,
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }).
            then(function(response) {
              Flash.create("success", 'Saved')
              $uibModalInstance.dismiss()
              $scope.refresh()
            })
          }
        },
      }).result.then(function() {

      }, function() {

        $scope.getAll(false, '')
        $scope.getProducts()

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
        templateUrl: '/static/ngTemplates/app.finance.inventoryProductCatalog.modal.html',
        size: 'lg',
        backdrop: true,
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
          $scope.productMetaSearch = function(query) {
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
            var fd = new FormData();
            fd.append('name', $scope.form.name);
            fd.append('value', $scope.form.value);
            fd.append('rate', $scope.form.rate);
            fd.append('buyingPrice', $scope.form.buyingPrice);
            fd.append('category',$state.params.id);
            fd.append('mrp',$scope.form.mrp);

            if ($scope.form.sku != undefined &&  $scope.form.sku != null  ) {
                fd.append('sku',$scope.form.sku);
            }

            if ($scope.form.taxRate!=null) {
            fd.append('taxRate',$scope.form.taxRate);
            }
            if ($scope.form.taxCode!=null) {
            fd.append('taxCode',$scope.form.taxCode);
            }

            if ($scope.form.richtxtDesc!=null) {
            fd.append('richtxtDesc',$scope.form.richtxtDesc);
            }

            if ($scope.form.img1!=null&&$scope.form.img1!=emptyFile&&typeof $scope.form.img1=='object') {
              fd.append('img1',$scope.form.img1);
            }
            if ($scope.form.img2!=null&&$scope.form.img2!=emptyFile&&typeof $scope.form.img2=='object') {
              fd.append('img2',$scope.form.img2);
            }
            if ($scope.form.img3!=null&&$scope.form.img3!=emptyFile&&typeof $scope.form.img3=='object') {
                fd.append('img3',$scope.form.img3);
            }


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

        $scope.getAll(false,'')
        $scope.getProducts()
      });
    }

$scope.getProducts = function(){
    iframe = document.getElementById('catalog')
    iframe.src = iframe.src
  // window.location = '/products/'
  // $http({
  //   method: 'GET',
  //   url: '/api/finance/ProductsCatalog/',
  //
  // }).
  // then(function(response) {
  // })
}
// $scope.getProducts()


})
