app.directive('ecommerceHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceheader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http) {
      $scope.me = $users.get('mySelf')

      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/finance/category/'

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
        if (this.scrollY < 100) {
          document.getElementById("searchinnav").style.display = "none";
          document.getElementById("wishicons").style.display = "none";
          document.getElementById("logoinnav").style.height = 0;
        } else {
          document.getElementById("searchinnav").style.display = "block";
          document.getElementById("wishicons").style.display = "flex";
          document.getElementById("logoinnav").style.height = "50px";
        }

      });
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
app.directive('checkoutView', function() {
  return {
    templateUrl: '/static/ngTemplates/checkout.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users,$http,$timeout,$rootScope) {
      $scope.me = $users.get('mySelf')

      $scope.is_wishlist = false
  $scope.deletecustomatcart = function(indx) {
    var dataToSend = {
      customDetails: null,
      customFile: null,
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.cartData[indx].pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create("success", 'Customization Removed')
    })
  }
  $scope.uploadcustomatcart = function(indx) {
    var fd = new FormData()
    fd.append('customDetails', $rootScope.cartData[indx].customDetails);
    fd.append('customFile', $rootScope.cartData[indx].customFile);
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.cartData[indx].pk + '/',
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      },
      data: fd,
    }).
    then(function(response) {
      Flash.create("success", 'Customization Added')
    })

  }
  $scope.currency = "fa-inr"
  $scope.me = $users.get('mySelf');

  var url = new URL(window.location.href)
  var action = url.searchParams.get("action")


  $scope.removeComment = function(indx) {
    $rootScope.cartData[indx].comment = null
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.cartData[indx].pk + '/',
      data: {
        comment: $rootScope.cartData[indx].comment
      }
    }).
    then(function(res) {})
  }

  $scope.removeCommentFav = function(indx) {
    $rootScope.favData[indx].comment = null
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.favData[indx].pk + '/',
      data: {
        comment: $rootScope.favData[indx].comment
      }
    }).
    then(function(res) {})
  }





  $scope.getcustomization = function(indx) {
    var cart = $rootScope.cartData[indx]
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.getcustomization.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        cartPk: function() {
          return cart.pk;
        },
        selectedProdVarpk: function() {
          return cart.productVariant.pk;
        },
        productpk: function() {
          return cart.product.pk;
        },
        typ: function() {
          return 'edit';
        },
      },
      controller: 'ecommerce.customisation'
    }).result.then(function(data) {}, function(data) {
      console.log(data);
      if (data != undefined) {
        $rootScope.cartData[indx] = data
      }
    });
  }


  $scope.removecustomization = function(indx) {
    var patchdata = {
      customFile: null,
      customDetails: null,
      addon: null
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.cartData[indx].pk + '/',
      data: patchdata,
    }).
    then(function(response) {
      $rootScope.cartData[indx] = response.data
    })
  }


  $scope.data = {}
  $scope.data.stage = 'review'
  $scope.deleteFromCart = function(indx, value) {
    $http({
      method: 'DELETE',
      url: '/api/finance/cart/' + value + '/',
    }).
    then(function(response) {
      $rootScope.cartData.splice(indx, 1)
      $rootScope.cartLength -= 1

    })
  }

  $scope.deleteFromFav = function(indx, value) {
    console.log('herrrrrrrrrrrr');
    $http({
      method: 'DELETE',
      url: '/api/finance/cart/' + value + '/',
    }).
    then(function(response) {
      $rootScope.favData.splice(indx, 1)
      $rootScope.favLength -= 1
    })
  }

  $scope.moveToCart = function(indx, value) {
    var dataToSend = {
      is_fav: false
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + value + '/',
      data: dataToSend
    }).
    then(function(response) {
      $rootScope.favData.splice(indx, 1)
      $rootScope.favLength -= 1
      $rootScope.cartData.push(response.data)
      $rootScope.cartLength += 1

    })
  }

  $scope.moveToWishlist = function(indx, value) {
    var dataToSend = {
      is_fav: true
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + value + '/',
      data: dataToSend
    }).
    then(function(response) {
      $rootScope.cartData.splice(indx, 1)
      $rootScope.cartLength -= 1
      $rootScope.favData.push(response.data)
      $rootScope.favLength += 1

    })
  }


  $scope.updateQty = function(cartPk, name, qty) {
    console.log("herrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.ecommerce.updateCart.modal.html',
      size: 'sm',
      backdrop: false,
      resolve: {
        cartPk: function() {
          return cartPk;
        },
        name: function() {
          return name;
        },
        qty: function() {
          return qty;
        },
      },
      controller: function($scope, $http, $uibModalInstance, cartPk, name, qty) {

        $scope.closeModal = function() {
          $uibModalInstance.dismiss()
        }
        $scope.form = {
          pk: cartPk,
          name: name,
          qty: qty
        }
        $scope.updateCart = function() {
          $http({
            method: 'PATCH',
            url: '/api/finance/cart/' + $scope.form.pk + '/',
            data: {
              qty: $scope.form.qty
            }
          }).
          then(function(res) {
            $scope.closeModal()
          })
        }
      },
    }).result.then(function(data) {}, function(data) {

    });
  }



  $timeout(function() {

  }, 700);



  $scope.changeQty = function(pk, indx, val) {
    var cartData = $rootScope.cartData[indx]
    if (val == 'increment') {
      if (cartData.productVariant.minQtyOrder != null) {
        if (cartData.productVariant.maxQtyOrder <= cartData.qty || cartData.productVariant.stock <= cartData.qty) {
          return
        }
      }
      $rootScope.cartData[indx].qty += 1
    }
    if (val == 'decrement') {
      if (cartData.productVariant.minQtyOrder != null) {
        if (cartData.qty == cartData.productVariant.minQtyOrder) {
          return
        }
        $rootScope.cartData[indx].qty -= 1
      } else {
        $rootScope.cartData[indx].qty -= 1
        if ($rootScope.cartData[indx].qty <= 1) {
          $rootScope.cartData[indx].qty = 1
        }
      }
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.cartData[indx].pk + '/',
      data: {
        qty: $rootScope.cartData[indx].qty
      }
    }).
    then(function(res) {
      $rootScope.cartData[indx] = res.data

    })

  }

  $scope.changeQtyFav = function(pk, indx, val) {
    var favData = $rootScope.favData[indx]
    if (val == 'increment') {
      if (favData.productVariant.minQtyOrder != null) {
        if (favData.productVariant.maxQtyOrder <= favData.qty || favData.productVariant.stock <= favData.qty) {
          return
        }
      }
      $rootScope.favData[indx].qty += 1
    }
    if (val == 'decrement') {
      if (favData.productVariant.minQtyOrder != null) {
        if (favData.qty == favData.productVariant.minQtyOrder) {
          return
        }
        $rootScope.favData[indx].qty -= 1
      } else {
        $rootScope.favData[indx].qty -= 1
        if ($rootScope.favData[indx].qty <= 1) {
          $rootScope.favData[indx].qty = 1
        }
      }
    }
    $http({
      method: 'PATCH',
      url: '/api/finance/cart/' + $rootScope.favData[indx].pk + '/',
      data: {
        qty: $rootScope.favData[indx].qty
      }
    }).
    then(function(res) {})
  }

  $scope.next = function() {

    window.scrollTo(0, 0);
    $state.go('address')

  }
  $scope.data.stage = 'review'


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

      $scope.getCategories = function(){
        $http({
          method: 'GET',
          url: '/api/finance/category/'

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
          window.open('/details/' + $scope.item.pk+'/'+$scope.item.url, '_self')

        }else {
          $scope.item.description.string.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
          window.open('/details/' + $scope.item.description.string.pk+'/'+$scope.item.description.string.url, '_self')

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
      $scope.deals = JSON.parse($scope.data)

      // console.log(JSON.parse($scope.deals),'ssssssssssssssssssssssssssssssssssssssssssssss');

      // $scope.deals = [{
      //     "heading": "Best Deals to starts with",
      //     "items": [{
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 450,
      //         "sellingPrice": 700,
      //         "endDateTime": new Date(),
      //         "pk": 1
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 450,
      //         "sellingPrice": 700,
      //         "pk": 2,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 450,
      //         "sellingPrice": 700,
      //         "pk": 3,
      //         "endDateTime": new Date()
      //       }
      //     ]
      //   },
      //   {
      //     "heading": "Trending-covid 19 supplies",
      //     "items": [{
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 1450,
      //         "sellingPrice": 700,
      //         "pk": 4,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 1450,
      //         "sellingPrice": 900,
      //         "pk": 5,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 1550,
      //         "sellingPrice": 1000,
      //         "pk": 6,
      //         "endDateTime": new Date()
      //       }
      //     ]
      //   },
      //   {
      //     "heading": "Trending Gifts-Corporate",
      //     "items": [{
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speakeddddr",
      //         "mrp": 1550,
      //         "sellingPrice": 1000,
      //         "pk": 1,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 150,
      //         "sellingPrice": 70,
      //         "pk": 2,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 70,
      //         "pk": 3,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 70,
      //         "pk": 4,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 70,
      //         "pk": 5,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 700,
      //         "pk": 6,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 700,
      //         "pk": 7,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 700,
      //         "pk": 8,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 100,
      //         "sellingPrice": 700,
      //         "pk": 9,
      //         "endDateTime": new Date()
      //       },
      //     ]
      //   },
      //   {
      //     "heading": "Kitchen Jar",
      //     "items": [{
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 650,
      //         "sellingPrice": 700,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 450,
      //         "sellingPrice": 700,
      //         "endDateTime": new Date()
      //       },
      //       {
      //         "image": "https://systunix.com/media/finance/productV2/1602671180_24_DSC_2578-removebg-preview.png",
      //         "category": "Desk Organizer",
      //         "name": "SIT01 Bamboo Speaker",
      //         "mrp": 450,
      //         "sellingPrice": 700,
      //         "endDateTime": new Date()
      //       }
      //     ]
      //   }
      // ]

      // $scope.getIndex = function(indx) {
      //   console.log(indx);
      //   $scope.index = indx
      //   $scope.items = $scope.deals[indx].items
      //   console.log($scope.items, "werer");
      // }
      // $scope.getIndex(1)



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
      $scope.data = JSON.parse($scope.data)
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
        })
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
