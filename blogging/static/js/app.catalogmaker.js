app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.catalogmaker', {
    url: "/catalogmaker",
    templateUrl: '/static/ngTemplates/app.businessmanagement.category.html',
    controller: 'businessManagement.category'
  }).state('businessManagement.product', {
    url: "/product/:id",
    templateUrl: '/static/ngTemplates/app.businessmanagement.catalogmaker.html',
    controller: 'businessManagement.catalog'
  }).state('businessManagement.catalogproducts', {
    url: "/products/:id",
    templateUrl: '/static/ngTemplates/app.finance.products.html',
    controller: 'businessManagement.catalog'
  }).state('businessManagement.form', {
    url: "/product/:id/new",
    templateUrl: '/static/ngTemplates/app.finance.inventoryProductCatalog.modal.html',
    controller: 'businessManagement.form'
  })

});


app.controller('businessManagement.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal) {

  $scope.show = false;
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
      name: '',
      mrp:'',
      buyingPrice:0,
      rate: '',
      sku:'',
      value: 0,
      refurnished: 0,
      productMeta:'',
      taxRate:'',
      taxDescription:'',
      img1:emptyFile,
      img2:emptyFile,
      img3:emptyFile,
      richtxtDesc:'',
      taxCode : '',
      addonsData:[],
      customizationData:[]
    }
    $scope.addons = {'description' : '' , 'price' : 0}
    $scope.customization =  {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }
    $scope.addIndex = null
    $scope.custIndex = null
  }
  $scope.refresh()

  // $scope.addCustomisation = function(){
  //   $scope.form.customizationData.push($scope.customization)
  //   $scope.customization = {'text' : 'Sample Text' , 'sampleimage' : emptyFile , 'color' : '','sampleimageHeight':'','sampleimageWidth':'', 'backgroundColor' : ''}
  // }
  $scope.addText = function(){
    var data = {'type' : 'textarea', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'Sample Text', 'rows':1}
    $scope.customization.data.push(data)
  }
  $scope.addImage = function(){
    var data = {'type' : 'image', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'', 'rows':1}
    $scope.customization.data.push(data)
  }

  $scope.increaseRow = function(indx){
    $scope.customization.data[indx].rows+=1
  }


  $scope.addCustomisation = function(){
    if ($scope.custIndex != null) {
      $scope.form.customizationData[$scope.custIndex] = $scope.customization
    }
    else{
      $scope.form.customizationData.push($scope.customization)
    }
    $scope.customization = {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }
    $scope.custIndex = null
  }

  $scope.editAddons = function(indx){
    $scope.addIndex = indx
    $scope.addons = $scope.form.addonsData[indx]
  }
  $scope.editCustomisation = function(indx){
    $scope.custIndex = indx
    $scope.customization = $scope.form.customizationData[indx]
  }

  $scope.deleteAddons = function(indx){
      $scope.form.addonsData.splice(indx,1)
  }

  $scope.deleteCust = function(indx){
    $scope.form.customizationData.splice(indx,1)
  }

  $scope.uploadSampleImage = function(){
    var fd = new FormData();
    fd.append('file', $scope.customization.backgroundImage);
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
      $scope.customization.backgroundImage = response.data.link
      // $scope.customization.sampleimageHeight = response.data.height
      // $scope.customization.sampleimageWidth = response.data.width
      // $uibModalInstance.dismiss({
      //   file: response.data.link,
      //   alt: $scope.form.alt,
      //   height: response.data.height,
      //   width: response.data.width
      // })
    })
  }

  $scope.selectedMeta = function(){
      if (typeof $scope.form.taxCode == 'object') {
        // $scope.form.taxDescription = $scope.form.productMeta.description
        $scope.form.taxRate = $scope.form.taxCode.taxRate
        $scope.form.taxCode  = $scope.form.taxCode.code
      }
  }


  $scope.$watch('form.img1' , function(newValue , oldValue) {
    console.log(newValue,'334');
    $scope.reader = new FileReader();

    if (typeof newValue == 'string' && newValue.length > 0 ) {
      $('#image1').attr('src', newValue);
    }
    $scope.reader.onload = function(e) {
      $('#image1').attr('src', e.target.result);
    }

    $scope.reader.readAsDataURL(newValue);
  })

  $scope.$watch('form.img2' , function(newValue , oldValue) {
    $scope.reader = new FileReader();
    if (typeof newValue == 'string' && newValue.length > 0 ) {
      $('#image2').attr('src', newValue);
    }
    $scope.reader.onload = function(e) {
      $('#image2').attr('src', e.target.result);
    }

    $scope.reader.readAsDataURL(newValue);


  })
  $scope.$watch('form.img3' , function(newValue , oldValue) {
    $scope.reader = new FileReader();
    if (typeof newValue == 'string' && newValue.length > 0 ) {
      $('#image3').attr('src', newValue);
    }
    $scope.reader.onload = function(e) {
      $('#image3').attr('src', e.target.result);
    }

    $scope.reader.readAsDataURL(newValue);


  })


  $scope.addAddons = function(){
    if ($scope.addIndex!=null) {
      $scope.form.addonsData[$scope.addIndex] = $scope.addons
    }
    else{
      $scope.form.addonsData.push($scope.addons)
    }
    $scope.addons = {'description' : '' , 'price' : 0}
    $scope.addIndex = null
  }


  $scope.saveInventory = function() {
    // if ($scope.form.name == undefined || $scope.form.name == '') {
    //   Flash.create("warning", 'Add name')
    //   return
    // }
    // if ($scope.form.buyingPrice == undefined ||  $scope.form.buyingPrice == null  || $scope.form.buyingPrice.length == 0) {
    //   Flash.create("warning", 'Add Selling Price')
    //   return
    // }
    // if ($scope.form.rate == undefined || $scope.form.rate == '') {
    //   Flash.create("warning", 'Add Price')
    //   return
    // }

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
    if ($scope.form.addonsData!=undefined&&$scope.form.addonsData!=null&&$scope.form.addonsData.length>0) {
      fd.append('addonsData',JSON.stringify($scope.form.addonsData));
    }
    if ($scope.form.customizationData!=undefined&&$scope.form.customizationData!=null&&$scope.form.customizationData.length>0) {
      fd.append('customizationData',JSON.stringify($scope.form.customizationData));
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


})

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

$scope.limit =24
$scope.offset = 0

$scope.getCategory = function(){
  // var url="/api/finance/category/"
  $http({
    method: 'GET',
    // url: 'https://bnistore.in/api/ecommerce/genericProduct/?limit='+$scope.limit+'&offset='+$scope.offset
    url: '/api/finance/category/'

  }).
  then(function(response) {
    // $scope.allCategories = response.data.results
    $scope.allCategories = response.data
    console.log($scope.allCategories,"342112312");
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
app.controller('businessManagement.catalog', function($scope,$users, $http, $aside, $state, Flash, $users, $filter, $uibModal) {
    $scope.me = $users.get('mySelf')
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
        var url = '/api/finance/inventory/?name__icontains=' + searchValue + '&category='+$state.params.id
      } else {
        var url = '/api/finance/inventory/?category='+$state.params.id
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.inventoryData = response.data
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
              name: '',
              mrp:'',
              buyingPrice:0,
              rate: '',
              sku:'',
              value: 0,
              refurnished: 0,
              productMeta:'',
              taxRate:'',
              taxDescription:'',
              img1:emptyFile,
              img2:emptyFile,
              img3:emptyFile,
              richtxtDesc:'',
              taxCode : '',
              addonsData:[],
              customizationData:[]
            }
            $scope.addons = {'description' : '' , 'price' : 0}
            $scope.customization =  {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }
            $scope.addIndex = null
            $scope.custIndex = null
          }
          $scope.refresh()

          // $scope.addCustomisation = function(){
          //   $scope.form.customizationData.push($scope.customization)
          //   $scope.customization = {'text' : 'Sample Text' , 'sampleimage' : emptyFile , 'color' : '','sampleimageHeight':'','sampleimageWidth':'', 'backgroundColor' : ''}
          // }
          $scope.addText = function(){
            var data = {'type' : 'textarea', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'Sample Text', 'rows':1}
            $scope.customization.data.push(data)
          }
          $scope.addImage = function(){
            var data = {'type' : 'image', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'', 'rows':1}
            $scope.customization.data.push(data)
          }

          $scope.increaseRow = function(indx){
            $scope.customization.data[indx].rows+=1
          }


          $scope.addCustomisation = function(){
            if ($scope.custIndex != null) {
              $scope.form.customizationData[$scope.custIndex] = $scope.customization
            }
            else{
              $scope.form.customizationData.push($scope.customization)
            }
            $scope.customization = {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }
            $scope.custIndex = null
          }

          $scope.editAddons = function(indx){
            $scope.addIndex = indx
            $scope.addons = $scope.form.addonsData[indx]
          }
          $scope.editCustomisation = function(indx){
            $scope.custIndex = indx
            $scope.customization = $scope.form.customizationData[indx]
          }

          $scope.deleteAddons = function(indx){
              $scope.form.addonsData.splice(indx,1)
          }

          $scope.deleteCust = function(indx){
            $scope.form.customizationData.splice(indx,1)
          }

          $scope.uploadSampleImage = function(){
            var fd = new FormData();
            fd.append('file', $scope.customization.backgroundImage);
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
              $scope.customization.backgroundImage = response.data.link
              // $scope.customization.sampleimageHeight = response.data.height
              // $scope.customization.sampleimageWidth = response.data.width
              // $uibModalInstance.dismiss({
              //   file: response.data.link,
              //   alt: $scope.form.alt,
              //   height: response.data.height,
              //   width: response.data.width
              // })
            })
          }

          $scope.selectedMeta = function(){
              if (typeof $scope.form.taxCode == 'object') {
                // $scope.form.taxDescription = $scope.form.productMeta.description
                $scope.form.taxRate = $scope.form.taxCode.taxRate
                $scope.form.taxCode  = $scope.form.taxCode.code
              }
          }


          $scope.$watch('form.img1' , function(newValue , oldValue) {
            console.log(newValue,'334');
            $scope.reader = new FileReader();

            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image1').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image1').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);
          })

          $scope.$watch('form.img2' , function(newValue , oldValue) {
            $scope.reader = new FileReader();
            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image2').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image2').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);


          })
          $scope.$watch('form.img3' , function(newValue , oldValue) {
            $scope.reader = new FileReader();
            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image3').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image3').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);


          })


          $scope.addAddons = function(){
            if ($scope.addIndex!=null) {
              $scope.form.addonsData[$scope.addIndex] = $scope.addons
            }
            else{
              $scope.form.addonsData.push($scope.addons)
            }
            $scope.addons = {'description' : '' , 'price' : 0}
            $scope.addIndex = null
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
            if ($scope.form.addonsData!=undefined&&$scope.form.addonsData!=null&&$scope.form.addonsData.length>0) {
              fd.append('addonsData',JSON.stringify($scope.form.addonsData));
            }
            if ($scope.form.customizationData!=undefined&&$scope.form.customizationData!=null&&$scope.form.customizationData.length>0) {
              fd.append('customizationData',JSON.stringify($scope.form.customizationData));
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
        size: 'xl',
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
          $scope.startX=0;
          $scope.startY=0;
          $scope.x=0;
          $scope.y=0;
          $scope.addons = {'description' : '' , 'price' : 0}
          // $scope.customization = {'text' : 'Sample Text' , 'sampleimage' : emptyFile , 'color' : '','sampleimageHeight':'','sampleimageWidth':'', 'backgroundColor' : ''}
          $scope.addIndex = null
          $scope.custIndex = null
          $scope.form = data;
          if ($scope.form.addonsData!=undefined && $scope.form.addonsData!=null && $scope.form.addonsData.length>0) {
            $scope.form.addonsData = JSON.parse($scope.form.addonsData)
          }
          else{
            $scope.form.addonsData = []
          }
          if ($scope.form.customizationData!=undefined && $scope.form.customizationData!=null && $scope.form.customizationData.length>0) {
            $scope.form.customizationData = JSON.parse($scope.form.customizationData)
          }
          else{
            $scope.form.customizationData = []
          }
          $scope.customization = {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }

          $scope.addText = function(){
            var data = {'type' : 'textarea', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'Sample Text', 'rows':1}
            $scope.customization.data.push(data)
          }
          $scope.addImage = function(){
            var data = {'type' : 'image', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':'', 'rows':1}
            $scope.customization.data.push(data)
          }

          $scope.increaseRow = function(indx){
            $scope.customization.data[indx].rows+=1
          }



          // $scope.addImage = function(){
          //   var data = {'type' : 'image', 'startX' : 0,  'startY' : 0, 'x': 0, 'y' : 0, 'data':''}
          //   $scope.form.customizationData.data.push(data)
          // }


          $scope.addCustomisation = function(){
            if ($scope.custIndex != null) {
              $scope.form.customizationData[$scope.custIndex] = $scope.customization
            }
            else{
              $scope.form.customizationData.push($scope.customization)
            }
            $scope.customization = {'backgroundColor' : '' , 'color':'', data:[], 'height':100, 'width':100, 'backgroundImage' : '','title':'' }
            $scope.custIndex = null
          }

          $scope.editAddons = function(indx){
            $scope.addIndex = indx
            $scope.addons = $scope.form.addonsData[indx]
          }
          $scope.editCustomisation = function(indx){
            $scope.custIndex = indx
            $scope.customization = $scope.form.customizationData[indx]
          }

          $scope.deleteAddons = function(indx){
              $scope.form.addonsData.splice(indx,1)
          }

          $scope.deleteCust = function(indx){
            $scope.form.customizationData.splice(indx,1)
          }


          $scope.addAddons = function(){
            if ($scope.addIndex!=null) {
              $scope.form.addonsData[$scope.addIndex] = $scope.addons
            }
            else{
              $scope.form.addonsData.push($scope.addons)
            }
            $scope.addons = {'description' : '' , 'price' : 0}
            $scope.addIndex = null
          }

          $scope.uploadSampleImage = function(){
            var fd = new FormData();
            fd.append('file', $scope.customization.backgroundImage);
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
              $scope.customization.backgroundImage = response.data.link
              // $scope.customization.sampleimageHeight = response.data.height
              // $scope.customization.sampleimageWidth = response.data.width
              // $uibModalInstance.dismiss({
              //   file: response.data.link,
              //   alt: $scope.form.alt,
              //   height: response.data.height,
              //   width: response.data.width
              // })
            })
          }
          // if ($scope.form.length>0) {
          //
          // }
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

          $scope.$watch('form.img1' , function(newValue , oldValue) {
            console.log(newValue,'334');
            $scope.reader = new FileReader();

            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image1').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image1').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);
          })

          $scope.$watch('form.img2' , function(newValue , oldValue) {
            $scope.reader = new FileReader();
            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image2').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image2').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);


          })
          $scope.$watch('form.img3' , function(newValue , oldValue) {
            $scope.reader = new FileReader();
            if (typeof newValue == 'string' && newValue.length > 0 ) {
              $('#image3').attr('src', newValue);
            }
            $scope.reader.onload = function(e) {
              $('#image3').attr('src', e.target.result);
            }

            $scope.reader.readAsDataURL(newValue);


          })




          $scope.saveInventory = function() {
            var fd = new FormData();
            var fd = new FormData();
            fd.append('name', $scope.form.name);
            fd.append('value', $scope.form.value);
            fd.append('rate', $scope.form.rate);
            fd.append('buyingPrice', $scope.form.buyingPrice);
            fd.append('category',$state.params.id);
            fd.append('mrp',$scope.form.mrp);

            console.log($scope.form);
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

            if ($scope.form.addonsData!=undefined&&$scope.form.addonsData!=null&&$scope.form.addonsData.length>0) {
              fd.append('addonsData',JSON.stringify($scope.form.addonsData));
            }
            if ($scope.form.customizationData!=undefined&&$scope.form.customizationData!=null&&$scope.form.customizationData.length>0) {
              fd.append('customizationData',JSON.stringify($scope.form.customizationData));
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
