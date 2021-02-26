app.directive('ecommerceHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceheader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $scope.division = DIVISION_APIKEY
      $scope.getCartItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+$scope.division
        }).
        then(function(response) {
          $scope.allCartItems = response.data
        })
      }
      $scope.getCartItems()
      $rootScope.$on('getCart', function(event, message) {
        $scope.getCartItems()
      });
      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/finance/category/?divId='+$scope.division

        }).
        then(function(response) {
        $scope.categories = response.data
        for (var i = 0; i < $scope.categories.length; i++) {
          var space = /[ ]/;
          var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          var nonascii = /[^\x20-\x7E]/;
          var url = $scope.categories[i].name;
          if (space.test(url)) {
            url = url.replace(/\s+/g, '-').toLowerCase();
            if (special.test(url)) {
              url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
              if (nonascii.test(url)) {
                url = url.replace(/[^\x20-\x7E]/g, '');
              }
            }
          } else {
            url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
          }
          url = url.replace(/-/g, ' ');
          url = url.trim();
          console.log(url.replace(/-/g, ' '));
          console.log(url.replace(/-/g, ' ').trim());
          console.log(url.replace(/-/g, ' ').trim().replace(' ', '-'));
          $scope.categories[i].url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');

        }
        })
      }
      $scope.getCategories()

      document.getElementById("searchinnav").style.display = "none";
      document.getElementById("wishicons").style.display = "none";
      document.getElementById("logoinnav").style.height = 0;
      window.addEventListener("scroll", function(event) {
        if (this.scrollY < 80) {
          document.getElementById("searchinnav").style.display = "none";
          document.getElementById("wishicons").style.display = "none";
          document.getElementById("logoinnav").style.height = 0;
        } else {
          document.getElementById("searchinnav").style.display = "block";
          document.getElementById("wishicons").style.display = "flex";
          document.getElementById("logoinnav").style.height = "50px";
        }

      });
      $scope.loginPage = function(){
        $uibModal.open({
          templateUrl: '/static/ngTemplates/app.ecommerce.customer.login.html',
          size: 'lg',
          backdrop: false,
          // resolve: {
          //   job: function() {
          //     return $scope.jobDetails.pk;
          //   },
          // },
          controller: function($scope, $uibModalInstance) {
            $scope.login = function(){

            }

            $scope.close = function(){
              $uibModalInstance.dismiss();
            }
          },
        }).result.then(function() {

        }, function(data) {

        });
      }

    },
  };
});
app.directive('categories', function() {
  return {
    templateUrl: '/static/ngTemplates/categories.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http) {
      console.log(ID,'2334324');
      $scope.me = $users.get('mySelf')
      $scope.division = DIVISION_APIKEY
      $scope.is_quickadd = false;
  $scope.filters = {
    varients: {},
    price: 0,
    sort: 'low2high',
    page: 0,
    filters: [],
    view: 'list',
    showClear: false,
    pricefilters: '',
    bulkOption: '',
    minPrice: 0,
    maxPrice: 0
  }

      $scope.getProducts = function(){
        $http({
          method: 'GET',
          url: '/api/finance/inventory/?category='+ID,
        }).
        then(function(response) {
          $scope.products = response.data
          for (var i = 0; i < $scope.products.length; i++) {
            var space = /[ ]/;
            var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            var nonascii = /[^\x20-\x7E]/;
            var url = $scope.products[i].name;
            if (space.test(url)) {
              url = url.replace(/\s+/g, '-').toLowerCase();
              if (special.test(url)) {
                url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
                if (nonascii.test(url)) {
                  url = url.replace(/[^\x20-\x7E]/g, '');
                }
              }
            } else {
              url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
            }
            url = url.replace(/-/g, ' ');
            url = url.trim();

            $scope.products[i].url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');

          }

        })
      }
      $scope.getProducts()


    },
  };
});
app.directive('ordersuccessfulView', function() {
  return {
    templateUrl: '/static/ngTemplates/ordersuccessfulView.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope,$rootScope, $state, $stateParams, $users,$http) {
      $scope.orderid = ORDERID
      // $rootScope.$on('getCart', function(event, message) {
      //   $scope.getCartItems()
      // });

      $http({
        method:'GET',url:'/api/finance/sales/?orderid='+$scope.orderid
      }).then(function(response){
        $scope.orderData = response.data.sale
        $scope.salesQty = response.data.salesQty
      })
    },
  };
});

app.directive('checkoutSideview', function() {
  return {
    templateUrl: '/static/ngTemplates/checkoutSide.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')

      $scope.division = DIVISION_APIKEY
      $scope.currency = "fa-inr"
      $scope.data = {
        stage : 'review',
        // modeOfPayment:'COD'
      }
      console.log(window.location.pathname);
      if (window.location.pathname.includes("checkout")) {
        $scope.data.stage = 'review'
      }
      else if (window.location.pathname.includes("address")) {
        $scope.data.stage = 'address'
      }
      else if (window.location.pathname.includes("payment")) {
        $scope.data.stage = 'payment'
      }
      $scope.getCartTotal = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cartTotal/?divId='+$scope.division
        }).
        then(function(response) {
          $scope.totalDetails = response.data
        })
      }
      $scope.getCartTotal()
      $rootScope.$on('getCartTotal', function(event, message) {
        $scope.getCartTotal()
      });


      $scope.order = function(){
        $http({
          method: 'POST',
          url: '/api/clientRelationships/order/',
          data:{
            'id':6435,
            'division':$scope.division
          }
        }).
        then(function(res) {
          console.log(res.data,'kllklkl');
          if ($scope.data.modeOfPayment=='COD') {
            window.location.href = '/pages/'+$scope.division+'/orderSuccessful/?orderid='+res.data.id
            return
          }
          else{
            $http({
              method: 'POST',
              url: '/api/ERP/getPaymentLink/',
              data : {
                'id' : 'sale_'+res.data.id,
                'successUrl':'/orderSuccessful/?orderid='+res.data.id,
                'failureUrl':'/orderFailure',
                'source': 'ecommerce',
                'division':$scope.division
              },
            }).
            then(function(response) {
              window.location.href = response.data
            })
          }
        })
      }





    },
  };
});

app.directive('addressView', function() {
  return {
    templateUrl: '/static/ngTemplates/address.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')
      $scope.currency = "fa-inr"
      $scope.getContactDetails = function(){
        $http({
          method: 'GET',
          url: '/api/clientRelationships/contact/6435/'
        }).
        then(function(response) {
          $scope.contact = response.data
        })
      }
      $scope.getContactDetails()
      $scope.errMsg = {
        street:'',
        pincode:'',
        city:'',
        state:'',
        country:''
      }
    $scope.saveAddress = function(){
      if ($scope.contact.street == null || $scope.contact.street.length == 0) {
        $scope.errMsg.street = "Address is required"
        return
      }
      if ($scope.contact.pincode == null || $scope.contact.pincode.length == 0) {
        $scope.errMsg.pincode = "Pincode is required"
        return
      }
      if ($scope.contact.city == null || $scope.contact.city.length == 0) {
        $scope.errMsg.city = "City is required"
        return
      }
      if ($scope.contact.state == null || $scope.contact.state.length == 0) {
        $scope.errMsg.state = "Pincode is required"
        return
      }
      if ($scope.contact.country == null || $scope.contact.country.length == 0) {
        $scope.errMsg.country = "Pincode is required"
        return
      }
      var dataToSend = {
        street : $scope.contact.street,
        pincode : $scope.contact.pincode,
        city : $scope.contact.city,
        state : $scope.contact.state,
        country : $scope.contact.country
      }
      $http({
        method: 'PATCH',
        url: '/api/clientRelationships/contact/6435/',
        data : dataToSend,
      }).
      then(function(response) {
        $scope.contact = response.data
        $scope.editAddress = false

      })
    }

    $scope.pinSearch = function() {
      if ($scope.contact.pincode.length>5) {
        $http.get('/api/ERP/genericPincode/?limit=10&pincode__contains=' + $scope.contact.pincode).
        then(function(response) {
          var result =  response.data.results[0];
          $scope.contact.city = result.city
          $scope.contact.state = result.state
          $scope.contact.country = result.country
        })
      }
    };
    },
  };
});

app.directive('checkoutpaymentView', function() {
  return {
    templateUrl: '/static/ngTemplates/payment.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')
      $scope.currency = "fa-inr"
      $scope.division = DIVISION_APIKEY
      $scope.getContactDetails = function(){
        $http({
          method: 'GET',
          url: '/api/clientRelationships/contact/6435/'
        }).
        then(function(response) {
          $scope.contact = response.data
        })
      }
      $scope.getContactDetails()

      $scope.getCartItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+$scope.division
        }).
        then(function(response) {
          $scope.cartData = response.data
        })
      }
      $scope.getCartItems()

    },
  };
});
app.directive('checkoutView', function() {
  return {
    templateUrl: '/static/ngTemplates/checkout.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')
      $scope.division = DIVISION_APIKEY
      $scope.getCartItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+$scope.division
        }).
        then(function(response) {
          $scope.cartData = response.data
        })
      }
      $scope.getCartItems()
      $scope.deleteFromCart = function(indx, value) {
        $http({
          method: 'DELETE',
          url: '/api/finance/cart/' + value + '/',
        }).
        then(function(response) {
          $scope.cartData.splice(indx, 1)
          $scope.cartLength -= 1
          $rootScope.$broadcast("getCartTotal", {});

        })
      }
    $scope.changeQty = function(pk, indx, val) {
      var cartData = $scope.cartData[indx]
      if (val == 'increment') {
        $scope.cartData[indx].qty += 1
      }
      if (val == 'decrement') {
        if ($scope.cartData[indx].qty == 1) {
          return
        }
        $scope.cartData[indx].qty -= 1
      }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $scope.cartData[indx].pk + '/',
      data: {
        qty: $scope.cartData[indx].qty
      }
    }).
    then(function(res) {
      $scope.cartData[indx] = res.data
      $rootScope.$broadcast("getCartTotal", {});

    })

  }
    },
  };
});

app.directive('ecommerceBanners', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommercebanners.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    scope:{
      data:'='
    },
    controller: function($scope, $state, $stateParams, $users) {
      $scope.me = $users.get('mySelf')
      $scope.curoselAsset = {
        lazyLoad: false,
        loop: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 10000,
        dots: true,
        // nav:true,
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 1,
          }
        },
      };
      $scope.banners = [

        {
          "title": " Upto 50% off ... ",
          "description": " More offer click below!",
          "webImage": "https://systunix.com/media/finance/productV2/1592129907_41_banner_without_offer.png",
          "potraitImage": "https://systunix.com/media/finance/productV2/1593619450_56_Banner_for_offer_wo_boder_and_popup_80.png"


        },
        {
          "title": "  Covid 19 Prevention Items  ",
          "description": "  All Kind of Prevention Items available..",
          "webImage": "https://systunix.com/media/finance/productV2/1592132263_84_New1.jpg",
          "potraitImage": "https://systunix.com/media/finance/productV2/1592132263_84_Prevention.png"


        }
      ]


    },
  };
});

app.directive('ecommerceFooter', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerce.footer.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users) {
      $scope.me = $users.get('mySelf')







    }
  };
});
app.directive('ecommerceSecondheader', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceSecondheader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http) {
      $scope.me = $users.get('mySelf')
      $scope.division = DIVISION_APIKEY
      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/finance/category/?divId='+$scope.division

        }).
        then(function(response) {
        $scope.categories = response.data
        for (var i = 0; i < $scope.categories.length; i++) {
          var space = /[ ]/;
          var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          var nonascii = /[^\x20-\x7E]/;
          var url = $scope.categories[i].name;
          if (space.test(url)) {
            url = url.replace(/\s+/g, '-').toLowerCase();
            if (special.test(url)) {
              url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
              if (nonascii.test(url)) {
                url = url.replace(/[^\x20-\x7E]/g, '');
              }
            }
          } else {
            url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
          }
          url = url.replace(/-/g, ' ');
          url = url.trim();
          console.log(url.replace(/-/g, ' '));
          console.log(url.replace(/-/g, ' ').trim());
          console.log(url.replace(/-/g, ' ').trim().replace(' ', '-'));
          $scope.categories[i].url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');

        }
        })
      }
      $scope.getCategories()



    }
  };
});


app.directive('ecommerceNewproducts', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceNewproducts.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    scope:{
      data:'='
    },
    controller: function($scope, $state, $stateParams, $users) {
      $scope.me = $users.get('mySelf')
      $scope.items = $scope.data
      console.log($scope.items,'243423');
      $scope.recentProductsProperties = {
        lazyLoad: false,
        loop: false,
        items: 1,
        autoplay: false,
        autoplayTimeout: 10000,
        dots: false,
        nav: true,

        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 4,
            // nav:true,
          }
        },
      };

      $scope.recentProducts = [{
          "heading": "Newly Added Products",
          "items": [{
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            }
          ]
        },
        {
          "heading": "Top Deals",
          "items": [{
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
          ]
        }


      ]

    },
  };
});


app.directive('productCards', function() {
  return {
    templateUrl: '/static/ngTemplates/productcards.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      list: '='
    },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $timeout, $filter) {

      $scope.item = $scope.list
      console.log($scope.item,'3ZXcXZczx34');

      $scope.me = $users.get('mySelf');
      $scope.priceDisplay = false
      // $scope.priceDisplay = settings_isPrice;
      $scope.showPrice = false
      if (!$scope.me && !$scope.priceDisplay) {
        $scope.showPrice = false
      } else {
        $scope.showPrice = true
      }
      $scope.currency = 'fa-inr'
      // $scope.currency = settings_currencySymbol;
      // $scope.isHeart = settings_isHeart;

      if ($scope.currency == 'fa-usd') {
        $scope.currencyVal = '$'
      } else if ($scope.currency == 'fa-inr') {

        $scope.currencyVal = '₹'
      } else {
        $scope.currencyVal = ''
      }


      $scope.getDetails = function() {

        var space = /[ ]/;
        var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        var nonascii = /[^\x20-\x7E]/;
        if ($scope.item.pk != undefined) {
            var url = $scope.item.name;

        }else {
          var url = $scope.item.description.string.name;

        }
        if (space.test(url)) {
          url = url.replace(/\s+/g, '-').toLowerCase();
          if (special.test(url)) {
            url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
            if (nonascii.test(url)) {
              url = url.replace(/[^\x20-\x7E]/g, '');
            }
          }
        } else {
          url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
        }
        url = url.replace(/-/g, ' ');
        url = url.trim();
        if ($scope.item.pk != undefined) {
          $scope.item.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
          window.open('details/'+DIVISION_APIKEY+'/' + $scope.item.pk+'/'+$scope.item.url, '_self')

        }else {
          $scope.item.description.string.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
          window.open('details/'+DIVISION_APIKEY+ '/' + $scope.item.description.string.pk+'/'+$scope.item.description.string.url, '_self')

        }

      }




    },
  };


});


app.directive('ecommerceBestdeals', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceBestdeals.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data:"="
    },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {

      var curday;
      var secTime;
      var ticker;

      function getSeconds() {
        var nowDate = new Date();
        var dy = 6; //Sunday through Saturday, 0 to 6
        var countertime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 00, 0, 0); //20 out of 24 hours = 8pm

        var curtime = nowDate.getTime(); //current time
        var atime = countertime.getTime(); //countdown time
        var diff = parseInt((atime - curtime) / 1000);
        if (diff > 0) {
          curday = dy - nowDate.getDay()
        } else {
          curday = dy - nowDate.getDay() - 1
        } //after countdown time
        if (curday < 0) {
          curday += 7;
        } //already after countdown time, switch to next week
        if (diff <= 0) {
          diff += (86400 * 7)
        }
        startTimer(diff);
      }

      function tick() {
        var secs = secTime;
        if (secs > 0) {
          secTime--;
        } else {
          clearInterval(ticker);
          getSeconds(); //start over
        }

        var days = Math.floor(secs / 86400);
        secs %= 86400;
        var hours = Math.floor(secs / 3600);
        secs %= 3600;
        var mins = Math.floor(secs / 60);
        secs %= 60;

        //update the time display
        $scope.days = curday;
        $scope.hours = ((hours < 10) ? "0" : "") + hours;
        $scope.mins = ((mins < 10) ? "0" : "") + mins;
        $scope.secs = ((secs < 10) ? "0" : "") + secs;
      }

      function startTimer(secs) {
        secTime = parseInt(secs);
        tick(); //initial count display
      }




      $interval(getSeconds, 1000);
      $(document).ready(function() {
        getSeconds();
      });
      $scope.me = $users.get('mySelf');
      $scope.value1 = {
        lazyLoad: false,
        loop: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 10000,
        dots: false,
        // nav:true,
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 1,
          }
        },
      };
      console.log($scope.data);
      $scope.deals = JSON.parse($scope.data)



      $scope.getIndex = function(indx) {
        if ($scope.deals.productsMap.tabs.length > 0) {
          $scope.index = indx
          $scope.items = $scope.deals.productsMap.tabs[indx-1].products.productList

        }
        console.log($scope.items, "werer");
      }
      $scope.getIndex(1)



    },
  };


});
app.directive('ecommerceHotproducts', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommercehotproducts.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data:"="
    },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {
      $scope.items = $scope.data
      if ($scope.data!=undefined) {
      try {
        $scope.data = JSON.parse($scope.data)
      }
      catch(err) {

      }
      $scope.hotproducts = {
        "heading": $scope.data.heading.string,
        "items": $scope.data.products.array
      }
    }

    },






  }


});
app.directive('recentlyViewedproducts', function() {
  return {
    templateUrl: '/static/ngTemplates/recentlyViewedproducts.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      data:'='
    },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {
      console.log($scope.data,"43423234234123cxvxczvcv");
      if ($scope.data!=undefined) {
        $scope.data = JSON.parse($scope.data)

      }
      $scope.viewedProductsProperties = {
        lazyLoad: false,
        loop: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 10000,
        dots: false,
        // nav:true,
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 6,
          }
        },
      };

      if ($scope.data!=undefined) {
        $scope.viewedProducts = {
          "heading": $scope.data.heading.string,
          "items": $scope.data.products.array
        }
    }

    },






  }


});

app.directive('ecommercePartners', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommercePartners.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    // scope: {
    //
    // },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {
      $scope.viewPartnersProperties = {
        lazyLoad: false,
        loop: false,
        items: 1,
        autoplay: false,
        autoplayTimeout: 10000,
        dots: false,
        // nav:true,
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 6,
          }
        },
      };


      $scope.partners = {
        "heading": "Partners",
        "items": [{
            "image": "https://systunix.com/media/finance/productV2/1585742331_59_1583151070_71_Aditya_Birla_Group.png",
            "type": "image",
            "altText": "Aditya Birla Group"
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742338_48_1583141496_78_IIMbangalore.JPG",
            "type": "image",
            "altText": "IIM Banglore"
          },
          {
            // "image": "https://systunix.com/media/finance/productV2/1585742331_59_1583151070_71_Aditya_Birla_Group.png",
            "image": "https://systunix.com/media/finance/productV2/1585742365_53_1583141563_17_Stylumiz.JPG",
            "type": "image",
            "altText": "Stylumia"
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742411_24_1583141479_28_CII.JPG",
            "type": "image",
            "altText": "Confederation of Indian Industry"
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "type": "image",
            "altText": "IMEDCEZ"
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742442_69_1583141482_17_Nimhans.JPG",
            "type": "image",
            "altText": "Nimhans"
          },

        ]
      }

    },






  }


});


app.directive('ecommerceTestimonials', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceTestimonials.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    // scope: {
    //
    // },
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {
      $scope.testimonialProperties = {
        lazyLoad: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 1000,
        dots: false,
        margin: 20,
        // nav:true,
        responsive: {
          0: {
            items: 1
          },
          479: {
            items: 2
          },
          600: {
            items: 3
          },
          1000: {
            items: 6,
          }
        },
      };




      $scope.testimonials = {
        "heading": "Testimonials",
        "items": [{
            "image": "https://systunix.com/media/finance/productV2/1585742338_48_1583141496_78_IIMbangalore.JPG",
            "company": "IIMBangalore",
            "fullname": "Mr.Ranjit",
            "comment": "Our employee likes the bottles provided by Systunix.",
            "rating": 5
          },

          {
            "image": "https://systunix.com/media/finance/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "company": "IMEDCEZ",
            "fullname": "Mr.Aman",
            "comment": "We have given the order and received on time. Best service with best quality. Thanks",
            "rating": 5
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "company": "IMEDCEZ",
            "fullname": "Mr.Raj",
            "comment": "We have given the order and received on time. Best service with best quality. Thanks",
            "rating": 4
          },
          {
            "image": "https://systunix.com/media/finance/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "company": "IMEDCEZ",
            "fullname": "Mr.Rajnandini",
            "comment": "We have given the order and received on time. Best service with best quality. Thanks",
            "rating": 3
          },


        ]
      }

    },






  }


});



app.directive('productDetails', function() {
  return {
    templateUrl: '/static/ngTemplates/productDetails.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: function($scope, $state, $http, Flash, $rootScope, $users, $filter, $interval) {
    $scope.list = $scope.data
      console.log(PRODUCT,'#$38ijsdksdhf');
      $http({
        method: 'GET',
        url: '/api/finance/inventory/'+PRODUCT+'/'

      }).
      then(function(response) {
      $scope.products = response.data
      $scope.getsimilarProducts($scope.products.category.pk)
        $scope.showImage($scope.products.img1)
      })

      $scope.getsimilarProducts = function(pk){
        $http({
          method: 'GET',
          url: '/api/finance/inventory/?category='+pk

        }).
        then(function(response) {
        $scope.similarproducts = response.data

        for (var i = 0; i <   $scope.similarproducts.length; i++) {
          var space = /[ ]/;
          var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          var nonascii = /[^\x20-\x7E]/;
          var url =   $scope.similarproducts[i].name;
          if (space.test(url)) {
            url = url.replace(/\s+/g, '-').toLowerCase();
            if (special.test(url)) {
              url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
              if (nonascii.test(url)) {
                url = url.replace(/[^\x20-\x7E]/g, '');
              }
            }
          } else {
            url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
          }
          url = url.replace(/-/g, ' ');
          url = url.trim();

          $scope.similarproducts[i].url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');

        }
        })
      }

      $scope.addToCart = function(){
        var dataToSend = {
          product :  $scope.products.pk,
          qty : 1,
          contact:6435
        }
        $http({
          method: 'POST',
          url: '/api/finance/cart/',
          data:dataToSend
        }).
        then(function(response) {
          $scope.products.cart = 1
          $scope.products.cartId = response.data.pk
          $rootScope.$broadcast("getCart", {});
        })
      }

      $scope.changeQty = function(val){
        if (val == 'increment') {
          $scope.products.cart+=1
        }
        else{
          $scope.products.cart-=1
        }
        if ($scope.products.cart>0) {
          var dataToSend = {
            qty:$scope.products.cart,
          }
          $http({
            method: 'PATCH',
            url: '/api/finance/cart/'+$scope.products.cartId+'/',
            data:dataToSend
          }).
          then(function(response) {
          })
        }
        else{
          $http({
            method: 'DELETE',
            url: '/api/finance/cart/'+$scope.products.cartId+'/',
          }).
          then(function(response) {
              $rootScope.$broadcast("getCart", {});
          })
        }
      }





      // $scope.products = {
      //   "images": [{
      //       "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //
      //     },
      //     {
      //
      //       "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //     },
      //     {
      //       "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //
      //     }
      //
      //   ],
      //   "category": "Desk Organizer",
      //   "name": "SIT01 Bamboo Speaker",
      //   "mrp": 450,
      //   "sellingPrice": 200,
      //   "endDateTime": new Date()
      //
      // }
      $scope.similarproducts = [

        {
        "images": [{
            "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      },
        {
        "images": [{
            "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      },
        {
        "images": [{
            "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      }

    ]

      $scope.showImage = function(indx){

        $scope.image = indx

      }




    },






  }


});
