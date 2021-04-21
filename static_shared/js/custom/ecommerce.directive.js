
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  // console.log('set cookie');
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}


app.directive('privacyPolicy', function() {
  return {
    templateUrl: '/static/ngTemplates/privacyPolicy.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {

    }
  }
})
app.directive('aboutUs', function() {
  return {
    templateUrl: '/static/ngTemplates/aboutUs.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {

    }
  }
})
app.directive('terms', function() {
  return {
    templateUrl: '/static/ngTemplates/terms.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {

    }
  }
})
app.directive('ecommerceHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceheader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal,Flash) {
      $scope.me = $users.get('mySelf')
      try {
        $scope.divApikey = DIVISION_APIKEY
        $scope.division = DIVISION_APIKEY
        $scope.divisionPk = DIVISION
        url = '/api/website/getFooterDetails/?divId='+$scope.division
      }
      catch(err) {
        url = '/api/website/getFooterDetails/'
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.divisionDetails = response.data
      })

      $scope.search = {
        searchValue:''
      }
      $scope.$watch('search.searchValue',function(newVal,oldVal){
        console.log(newVal,oldVal,"lkl980iop");
      })
      $scope.productSearch = function(query) {
        return $http.get('/api/finance/inventory/?limit=10&name__icontains=' + query).
        then(function(response) {
          $scope.data = response.data.results
          for (var i = 0; i < response.data.results.length; i++) {
            response.data.results[i].apiKey = DIVISION_APIKEY
          }
          return response.data.results;
        })
      };

      $scope.getAllCartItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+DIVISION_APIKEY+'&contact='+$scope.userDetails.pk
        }).
        then(function(response) {
          $scope.allCartItems = response.data
          if (customer!=undefined && customer!=null && customer.length>0) {
            $scope.createCartData()
          }
        })
      }
      $rootScope.$on('getCart', function(event, message) {
        $scope.getAllCartItems()
      });

      $scope.cartCookieData = []
      $scope.getCookieCart = function(){
        detail = getCookie("addToCart");
        if (detail != "") {
          $scope.cartCookieData = JSON.parse(detail)

        }
      }

      $rootScope.$on('getCookieCart', function(event, message) {
        $scope.getCookieCart()
      });

      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null && customer.length>0) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY,
        }).
        then(function(response) {
          $scope.userDetails = response.data
          $scope.getAllCartItems()
        })
      }
      else{
        $scope.getCookieCart()
        }

      $scope.createCartData = function(){
        detail = getCookie("addToCart");
        if (detail != "") {
          $scope.cartCookieData = JSON.parse(detail)
          document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
          if ($scope.cartCookieData.length>0) {
            for (var i = 0; i < $scope.cartCookieData.length; i++) {
              var dataToSend = {
                product :  $scope.cartCookieData[i].product,
                qty : $scope.cartCookieData[i].qty,
                contact:$scope.userDetails.pk,
                divId:DIVISION_APIKEY

              }
              $http({
                method: 'POST',
                url: '/api/finance/cart/',
                data:dataToSend
              }).
              then((function(i) {
                return function(response) {
                  $scope.allCartItems.push(response.data)
                  if (i == $scope.cartCookieData.length - 1) {
                    deleteCookie('addToCart')
                    $scope.cartCookieData()

                  }
                }
              })(i))
            }
          }
        }
      }


      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/website/getCategory/?divId='+$scope.division

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
          controller: function($scope, $uibModalInstance,Flash,$timeout) {
            $scope.waitMsg = "please wait for otp"
            $scope.isMsg = false
            $scope.form = {
              mobile:'',
              otp:'',
              errMsg:'',
              successMsg:''
            }
            $scope.login = function(){
              if ($scope.form.mobile.length == 0) {
                $scope.msg = '* Please enter the mobile number'
                $timeout(function(){
                  $scope.msg =''
                },500)
                return
              }
              $scope.isMsg = true
              var dataToSend = {
                  mobile : $scope.form.mobile,
                  divId : DIVISION_APIKEY
                }
              if ($scope.form.otp != null && $scope.form.otp.length>0) {
                dataToSend.otp = $scope.form.otp
              }
              $http({
                method: 'POST',
                url: '/getCustomerOtp/',
                data:dataToSend
              }).
              then(function(response) {
                $scope.form.errMsg = ''
                $scope.form.successMsg = ''
                if (response.data.errMsg!=undefined) {
                  $scope.form.errMsg = response.data.errMsg
                }
                if (response.data.successMsg!=undefined) {
                  $scope.form.successMsg = response.data.successMsg
                }
                if (response.data.success!=undefined) {
                  $scope.form.success = response.data.success
                }
                if (response.data.contact!=undefined) {
                  $scope.form.contact = response.data.contact
                  $uibModalInstance.dismiss($scope.form.contact)
                }
                $timeout(function(){
                  $scope.waitMsg =''
                  $scope.msg =''
                },250)
              })
            }



            $scope.close = function(){
              $uibModalInstance.dismiss();
            }
          },
        }).result.then(function(data) {
          if (data!=undefined) {
            $rootScope.userDetails = data
            location.reload();

          }
        }, function(data) {
          if (data!=undefined) {
            $rootScope.userDetails = data
            location.reload();

          }

        });
      }

      $scope.logoutCustomer = function(){
        deleteCookie("customer");
        location.reload();
      }
      $scope.goToProfile = function(){
        window.location.href = '/pages/'+$scope.division+'/profile'
        return
      }




  // $http.get('/api/ERP/appSettings/?app=25&name__iexact=searchImage').
  // then(function(response) {
  //   if (response.data[0] != null) {
  //     if (response.data[0].flag) {
  //       $scope.searchImage = true
  //     }
  //   }
  // });














    },
  };
});
app.directive('agencyHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/agencyHeader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $http({
        method:'GET',
        url:'/api/organization/divisions/'+$scope.me.designation.division
      }).then(function(response){
        $scope.division = response.data
      })
    },
  };
});
app.directive('blankHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/blankHeader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $http({
        method:'GET',
        url:'/api/organization/divisions/'+$scope.me.designation.division
      }).then(function(response){
        $scope.division = response.data
      })
    },
  };
});
app.directive('agencyFooter', function() {
  return {
    templateUrl: '/static/ngTemplates/agencyFooter.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $http({
        method:'GET',
        url:'/api/organization/divisions/'+$scope.me.designation.division
      }).then(function(response){
        $scope.division = response.data
      })
    },
  };
});
app.directive('servicesHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/servicesHeader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $http({
        method:'GET',
        url:'/api/organization/divisions/'+$scope.me.designation.division
      }).then(function(response){
        $scope.division = response.data
      })
      $scope.me = $users.get('mySelf')
    },
  };
});
app.directive('servicesFooter', function() {
  return {
    templateUrl: '/static/ngTemplates/servicesFooter.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http, $rootScope, $uibModal) {
      $scope.me = $users.get('mySelf')
      $http({
        method:'GET',
        url:'/api/organization/divisions/'+$scope.me.designation.division
      }).then(function(response){
        $scope.division = response.data
      })
      $http({
        method:'GET',
        url:'/api/organization/unit/?division='+$scope.me.designation.division
      }).then(function(response){
        $scope.unit = response.data[0]
      })
      $scope.me = $users.get('mySelf')
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
          url: '/api/website/getProducts/?category='+ID,
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
      $scope.apikey = APIKEY


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
      $scope.totalDetails = {
        showDetails : false,
        subTotal : 0,
        totalGST : 0,
        shipping : 0,
        grandTotal : 0

      }
      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null && customer.length>0) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId',
        }).
        then(function(response) {
          $scope.userId = response.data.id
          $scope.getCartTotal()
        })
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
          url: '/api/finance/cartTotal/?divId='+$scope.division+'&contact='+$scope.userId
        }).
        then(function(response) {
          $scope.totalDetails = response.data
        })
      }

      $rootScope.$on('getCartTotal', function(event, message) {
        $scope.getCartTotal()
      });


      $scope.order = function(){
        $http({
          method: 'POST',
          url: '/api/clientRelationships/order/',
          data:{
            'id':$scope.userId,
            'division':$scope.division
          }
        }).
        then(function(res) {
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
      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId',
        }).
        then(function(response) {
          $scope.userId = response.data.id
          $scope.getContactDetails()
        })
      }
      $scope.getContactDetails = function(){
        $http({
          method: 'GET',
          url: '/api/website/updateContact/?id='+$scope.userId
        }).
        then(function(response) {
          $scope.contact = response.data
        })
      }
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
        country : $scope.contact.country,
        pk:$scope.userId
      }
      $http({
        method: 'POST',
        url: '/api/website/updateContact/',
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

app.directive('profileView', function() {
  return {
    templateUrl: '/static/ngTemplates/profile.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')
      $scope.currency = "fa-inr"
      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId',
        }).
        then(function(response) {
          $scope.userId = response.data.id
          $scope.getContactDetails()
        })
      }
      $scope.getContactDetails = function(){
        $http({
          method: 'GET',
          url: '/api/website/updateContact/?id='+$scope.userId
        }).
        then(function(response) {
          $scope.contact = response.data
        })
      }
      $scope.errMsg = {
        street:'',
        pincode:'',
        city:'',
        state:'',
        country:'',
        name:'',
        email:'',
        mobile:'',
      }
    $scope.save = function(){
      if ($scope.contact.name == null || $scope.contact.name.length == 0) {
        $scope.errMsg.name = "Name is required"
        return
      }
      if ($scope.contact.mobile == null || $scope.contact.mobile.length == 0) {
        $scope.errMsg.mobile = "Mobile number is required"
        return
      }
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
        country : $scope.contact.country,
        pk : $scope.contact.pk,
        name : $scope.contact.name,
        email : $scope.contact.email,
      }
      $http({
        method: 'POST',
        url: '/api/website/updateContact/',
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
      $scope.data = {
        modeOfPayment :'COD'
      }

      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId=',
        }).
        then(function(response) {
          $scope.userId = response.data.id
          $scope.getContactDetails()
          $scope.getCartPayItems()
        })
      }
      $scope.getContactDetails = function(){
        $http({
          method: 'GET',
          url: '/api/website/updateContact/?id='+$scope.userId
        }).
        then(function(response) {
          $scope.contact = response.data
        })
      }

      $scope.getCartPayItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+$scope.division+'&contact='+$scope.userId
        }).
        then(function(response) {
          $scope.cartData = response.data
        })
      }

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
      var customer = getCookie("customer");
      if (customer!=undefined && customer!=null && customer.length>0 ) {
        $http({
          method: 'GET',
          url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId',
        }).
        then(function(response) {
          $scope.userId = response.data.id
          $scope.getCartItems()

        })
      }
      $scope.cartData = []
      $scope.getCartItems = function(){
        $http({
          method: 'GET',
          url: '/api/finance/cart/?divId='+$scope.division+'&contact='+$scope.userId
        }).
        then(function(response) {
          $scope.cartData = response.data
          if (customer!=undefined && customer!=null && customer.length>0) {
            // $scope.createCartData()
          }
        })
      }

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

app.directive('secondlevelBanners', function() {
  return {
    templateUrl: '/static/ngTemplates/secondlevelBanners.html',
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
      $scope.banners = []
      if ($scope.data!=undefined) {
      try {
        $scope.data = JSON.parse($scope.data)
      }
      catch(err) {
      $scope.data = $scope.data
      }
      $scope.banners = [$scope.data.backgroundimage, $scope.data.secondbackgroundimage]
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
      $scope.banners = []
      if ($scope.data!=undefined) {
      try {
        $scope.data = JSON.parse($scope.data)
      }
      catch(err) {
      $scope.data = $scope.data
      }
      $scope.banners = [$scope.data.backgroundimage, $scope.data.secondbackgroundimage]
    }




    // }
      // $scope.banners = [
      //
      //   {
      //     "title": " Upto 50% off ... ",
      //     "description": " More offer click below!",
      //     "webImage": "https://systunix.com/media/finance/productV2/1592129907_41_banner_without_offer.png",
      //     "potraitImage": "https://systunix.com/media/finance/productV2/1593619450_56_Banner_for_offer_wo_boder_and_popup_80.png"
      //
      //
      //   },
      //   {
      //     "title": "  Covid 19 Prevention Items  ",
      //     "description": "  All Kind of Prevention Items available..",
      //     "webImage": "https://systunix.com/media/finance/productV2/1592132263_84_New1.jpg",
      //     "potraitImage": "https://systunix.com/media/finance/productV2/1592132263_84_Prevention.png"
      //
      //
      //   }
      // ]


    },
  };
});

app.directive('ecommerceFooter', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerce.footer.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    scope:{
      data:'='
    },
    controller: function($scope, $state, $stateParams, $users, $http) {
      $scope.me = $users.get('mySelf')
      console.log($scope.data,'i8i4i123489');
      try {
        $scope.division = DIVISION_APIKEY
        url = '/api/website/getFooterDetails/?divId='+$scope.division
      }
      catch(err) {
        url = '/api/website/getFooterDetails/'
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.divisionDetails = response.data
      })

      $scope.getLinks = function(){
        $http({
          method: 'GET',
          url: '/api/website/page/?inFooter=True'
        }).
        then(function(response) {
          $scope.footerLinks = response.data
        })

      }
      $scope.getLinks()
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
      // $scope.division = DIVISION_APIKEY
      try {
        $scope.division = DIVISION_APIKEY
        url = '/api/website/getFooterDetails/?divId='+$scope.division
      }
      catch(err) {
        url = '/api/website/getFooterDetails/'
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.divisionDetails = response.data
      })
      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/website/getCategory/?divId='+$scope.division

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
      console.log($scope.data,'aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      if ($scope.data!=undefined) {
      try {
        $scope.data = JSON.parse($scope.data)
      }
      catch(err) {
      $scope.data = $scope.data
      }
    }
      console.log($scope.data,'sssssssssssssssssss');
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
          "items": $scope.data
        },
        {
          "heading": "Top Deals",
          "items": $scope.data
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
    controller: function($scope, $state, $http, Flash, $rootScope,$uibModal, $users, $timeout, $filter) {

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
          window.open('/pages/'+DIVISION_APIKEY+'/details/'+ $scope.item.pk+'/'+$scope.item.url, '_self')

        }else {
          $scope.item.description.string.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
          window.open('/pages/'+DIVISION_APIKEY+'/details/' + $scope.item.description.string.pk+'/'+$scope.item.description.string.url, '_self')

        }

      }


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
            $scope.form = {
              mobile:'',
              otp:'',
              errMsg:'',
              successMsg:''
            }
            $scope.login = function(){
              var dataToSend = {
                  mobile : $scope.form.mobile,
                  divId : DIVISION_APIKEY
                }
              if ($scope.form.otp != null && $scope.form.otp.length>0) {
                dataToSend.otp = $scope.form.otp
              }
              $http({
                method: 'POST',
                url: '/getCustomerOtp/',
                data:dataToSend
              }).
              then(function(response) {
                $scope.form.errMsg = ''
                $scope.form.successMsg = ''
                if (response.data.errMsg!=undefined) {
                  $scope.form.errMsg = response.data.errMsg
                }
                if (response.data.successMsg!=undefined) {
                  $scope.form.successMsg = response.data.successMsg
                }
                if (response.data.success!=undefined) {
                  $scope.form.success = response.data.success
                }
                if (response.data.contact!=undefined) {
                  $scope.form.contact = response.data.contact
                  $uibModalInstance.dismiss($scope.form.contact)
                }

              })
            }



            $scope.close = function(){
              $uibModalInstance.dismiss();
            }
          },
        }).result.then(function() {

        }, function(data) {
          if (data!=undefined) {
            $scope.userDetails = data
            location.reload();

          }

        });
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
      // $scope.deals = JSON.parse(JSON.stringify($scope.data))
        if ($scope.data!=undefined) {
        try {
          $scope.data = JSON.parse($scope.data)
        }
        catch(err) {

        }
      }
        $scope.deals = $scope.data

      $scope.getIndex = function(indx) {
        if ($scope.deals.productsMap.tabs.length > 0) {
          $scope.index = indx
          $scope.items = $scope.deals.productsMap.tabs[indx-1].products.productList

        }
      }
      if ($scope.data.productsMap.tabs.length > 1 ) {
        $scope.getIndex(2)

      }



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
      console.log($scope.data);
      $scope.items = $scope.data
      if ($scope.data !=undefined ) {
      try {
        $scope.data = JSON.parse($scope.data)
        $scope.hotproducts = {
          "heading": $scope.data.heading.string,
          "items": $scope.data.products.array
        }
        console.log($scope.data,"klklllk");
      }
      catch(err) {
        $scope.hotproducts = {
          "heading": 'Hot Products',
          "items": $scope.data
        }
      }
      console.log($scope.data);


    }
    else {
      $scope.hotproducts = {
        "heading": 'Hot Products',
        "items": $scope.data
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
      if ($scope.data!=undefined) {
      try {
        $scope.data = JSON.parse($scope.data)
      }
      catch(err) {

      }
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
    $scope.division = DIVISION_APIKEY
    $scope.list = $scope.data
    var customer = getCookie("customer");
    if (customer!=undefined && customer!=null) {
      $http({
        method: 'GET',
        url: '/getDetailsCustomer/?token='+customer+'&divId='+DIVISION_APIKEY+'&getId',
      }).
      then(function(response) {
        $scope.userId = response.data.id
        $scope.getProd()
      })
    }

      $scope.getProd = function(){
        var url = '/api/website/getProducts/?id='+PRODUCT
        if ($scope.userId!=undefined) {
          url+='&contact='+$scope.userId+'&divId='+DIVISION_APIKEY
        }
        $http({
          method: 'GET',
          url: url
        }).
        then(function(response) {
          $scope.products = response.data
          if ($scope.products.addonsData!=undefined && $scope.products.addonsData!=null && $scope.products.addonsData.length>0) {
            $scope.products.addonsData = JSON.parse($scope.products.addonsData)
            if ($scope.products.addon!=null) {
              $scope.products.addon =   JSON.parse($scope.products.addon)
            }
          }
          else{
            $scope.products.addonsData = []
          }
          if ($scope.products.customizationData!=undefined && $scope.products.customizationData!=null && $scope.products.customizationData.length>0) {
            $scope.products.customizationData = JSON.parse($scope.products.customizationData)
          }
          else{
            $scope.products.customizationData = []
          }
          $scope.getsimilarProducts($scope.products.category.pk)
          $scope.showImage($scope.products.img1)
          if (customer==undefined || customer==null || customer.length == 0) {
            $scope.checkOtherCart()
          }
        })
      }


      $scope.getsimilarProducts = function(pk){
        $http({
          method: 'GET',
          url: '/api/website/getProducts/?category='+pk

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
      $scope.cartData = []
      $scope.checkOtherCart = function(){
          detail = getCookie("addToCart");
          if (detail != "") {
            $scope.cartData = JSON.parse(detail)
            document.cookie = encodeURIComponent("addToCart") + "=deleted; expires=" + new Date(0).toUTCString()
            for (var i = 0; i < $scope.cartData.length; i++) {
              if ($scope.cartData[i].product == $scope.products.pk) {
                $scope.products.cart = $scope.cartData[i].qty
              }
            }
          }
      }

      $scope.addToCart = function(){
        if ($scope.userId==undefined || $scope.userId==null || $scope.userId.length == 0) {
          $scope.products.cart = 1
          $scope.item = {
            product :  $scope.products.pk,
            qty : 1,
            divId : DIVISION_APIKEY
          }
          if ($scope.products.addon!=undefined&&$scope.products.addon!=null) {
            $scope.item.addon = $scope.products.addon
          }
          $scope.cartData.push($scope.item)
          setCookie("addToCart", JSON.stringify($scope.cartData), 365);
            $rootScope.$broadcast("getCookieCart", {});
          return
        }
        var dataToSend = {
          product :  $scope.products.pk,
          qty : 1,
          contact:$scope.userId,
          divId : DIVISION_APIKEY
        }
        if ($scope.products.addon!=undefined&&$scope.products.addon!=null) {
          dataToSend.addon = JSON.stringify($scope.products.addon)
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

      // $scope.changeQytyCookie = function() {
      //   if ($scope.list.added_cart < $scope.selectedObj.orderThreshold) {
      //     $scope.list.added_cart++
      //   }
      //   $scope.qtyToAddInit.qty = $scope.list.added_cart
      //   for (var i = 0; i < $rootScope.addToCart.length; i++) {
      //     if ($rootScope.addToCart[i].prodSku == $scope.selectedObj.sku) {
      //       $rootScope.addToCart[i].qty = $rootScope.addToCart[i].qty + 1
      //       setCookie("addToCart", JSON.stringify($rootScope.addToCart), 365);
      //     }
      //   }
      // }

      $scope.changeQty = function(val){
        if (val == 'increment') {
          $scope.products.cart+=1
        }
        else{
          $scope.products.cart-=1
        }
        if ($scope.products.cart>0) {
         if ($scope.userId==undefined || $scope.userId==null || $scope.userId.length == 0) {
           for (var i = 0; i < $scope.cartData.length; i++) {
             console.log($scope.cartData[i].product, $scope.products.pk);
             if ($scope.cartData[i].product == $scope.products.pk) {
                 $scope.cartData[i].qty = $scope.products.cart
                setCookie("addToCart", JSON.stringify($scope.cartData), 365);
             }
           }
           return
          }
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
          if ($scope.userId==undefined || $scope.userId==null || $scope.userId.length == 0) {
            for (var i = 0; i < $scope.cartData.length; i++) {
              console.log($scope.cartData[i].product, $scope.products.pk);
              if ($scope.cartData[i].product == $scope.products.pk) {
                  $scope.cartData.splice(i,1)
                 setCookie("addToCart", JSON.stringify($scope.cartData), 365);
              }
            }
            return
           }
          $http({
            method: 'DELETE',
            url: '/api/finance/cart/'+$scope.products.cartId+'/',
          }).
          then(function(response) {
              $rootScope.$broadcast("getCart", {});
          })
        }
      }

      $scope.showImage = function(indx){

        $scope.image = indx

      }




    },






  }


});
