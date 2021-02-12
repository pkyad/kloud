app.directive('ecommerceHeader', function() {
  return {
    templateUrl: '/static/ngTemplates/ecommerceheader.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users) {
      $scope.me = $users.get('mySelf')
      $scope.categories = {
        "personal": "Personalized Gifts",
        "wooden": "Wooden Key Chains",
        "electronic": "Electronic Gifts",
        "occassional": "Occasional Gifts"


      }

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
          document.getElementById("wishicons").style.display = "inline";
          document.getElementById("logoinnav").style.height = "50px";
        }

      });
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
          "webImage": "https://systunix.com/media/POS/productV2/1592129907_41_banner_without_offer.png",
          "potraitImage": "https://systunix.com/media/POS/productV2/1593619450_56_Banner_for_offer_wo_boder_and_popup_80.png"


        },
        {
          "title": "  Covid 19 Prevention Items  ",
          "description": "  All Kind of Prevention Items available..",
          "webImage": "https://systunix.com/media/POS/productV2/1592132263_84_New1.jpg",
          "potraitImage": "https://systunix.com/media/POS/productV2/1592132263_84_Prevention.png"


        }
      ]


    },
  };
});
app.directive('secondlevelBanners', function() {
  return {
    templateUrl: '/static/ngTemplates/secondlevelBanners.html',
    restrict: 'E',
    replace: false,
    transclude: true,
    controller: function($scope, $state, $stateParams, $users) {
      $scope.me = $users.get('mySelf')
      $scope.secondlevelbanners = {
        lazyLoad: false,
        items: 1,
        autoplay: true,
        autoplayTimeout: 10000,
        dots: true,
        loop: true,
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
      $scope.seconlevelbanners = [{

          "title": "Durable, Cost Effective & Stylish Bottles ",
          "description": "  Good Quality Stainless Steel Bottles Custmize with Logo or Name",
          "webImage": "https://systunix.com/media/POS/productV2/1587100019_25_165-1656919_background-image-for-ecommerce.jpg",
          "potraitImage": "https://systunix.com/media/POS/productV2/1587100019_25_1585741640_91_1583150837_78_bottles_alumin_banner_systunix.png"
        },
        {

          "title": "Durable, Cost Effective & Stylish Bottles ",
          "description": "  Good Quality Stainless Steel Bottles Custmize with Logo or Name",
          "webImage": "https://systunix.com/media/POS/productV2/1587100019_25_165-1656919_background-image-for-ecommerce.jpg",
          "potraitImage": "https://systunix.com/media/POS/productV2/1587100019_25_1585741640_91_1583150837_78_bottles_alumin_banner_systunix.png"




        }
      ]






    },
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
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
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
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
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
        // $state.go('productdetails',{ 'id': $scope.item.pk} )
        window.open('/productDetails/' + $scope.item.pk, '_blank')
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
    // scope: {
    //
    // },
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
      $scope.deals = [{
          "heading": "Best Deals to starts with",
          "items": [{
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date(),
              "pk": 1
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "pk": 2,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "pk": 3,
              "endDateTime": new Date()
            }
          ]
        },
        {
          "heading": "Trending-covid 19 supplies",
          "items": [{
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 1450,
              "sellingPrice": 700,
              "pk": 4,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 1450,
              "sellingPrice": 900,
              "pk": 5,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 1550,
              "sellingPrice": 1000,
              "pk": 6,
              "endDateTime": new Date()
            }
          ]
        },
        {
          "heading": "Trending Gifts-Corporate",
          "items": [{
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speakeddddr",
              "mrp": 1550,
              "sellingPrice": 1000,
              "pk": 1,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 150,
              "sellingPrice": 70,
              "pk": 2,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 70,
              "pk": 3,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 70,
              "pk": 4,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 70,
              "pk": 5,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 700,
              "pk": 6,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 700,
              "pk": 7,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 700,
              "pk": 8,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 100,
              "sellingPrice": 700,
              "pk": 9,
              "endDateTime": new Date()
            },
          ]
        },
        {
          "heading": "Kitchen Jar",
          "items": [{
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 650,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            },
            {
              "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
              "category": "Desk Organizer",
              "name": "SIT01 Bamboo Speaker",
              "mrp": 450,
              "sellingPrice": 700,
              "endDateTime": new Date()
            }
          ]
        }
      ]

      $scope.getIndex = function(indx) {
        console.log(indx);
        $scope.index = indx
        $scope.items = $scope.deals[indx].items
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
      $scope.data = JSON.parse($scope.data)
      $scope.hotproducts = {
        "heading": $scope.data.heading.string,
        "items": $scope.data.products.array
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


      $scope.viewedProducts = {
        "heading": $scope.data.heading,
        "items": $scope.data.products.array
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
            "image": "https://systunix.com/media/POS/productV2/1585742331_59_1583151070_71_Aditya_Birla_Group.png",
            "type": "image",
            "altText": "Aditya Birla Group"
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742338_48_1583141496_78_IIMbangalore.JPG",
            "type": "image",
            "altText": "IIM Banglore"
          },
          {
            // "image": "https://systunix.com/media/POS/productV2/1585742331_59_1583151070_71_Aditya_Birla_Group.png",
            "image": "https://systunix.com/media/POS/productV2/1585742365_53_1583141563_17_Stylumiz.JPG",
            "type": "image",
            "altText": "Stylumia"
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742411_24_1583141479_28_CII.JPG",
            "type": "image",
            "altText": "Confederation of Indian Industry"
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "type": "image",
            "altText": "IMEDCEZ"
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742442_69_1583141482_17_Nimhans.JPG",
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
            "image": "https://systunix.com/media/POS/productV2/1585742338_48_1583141496_78_IIMbangalore.JPG",
            "company": "IIMBangalore",
            "fullname": "Mr.Ranjit",
            "comment": "Our employee likes the bottles provided by Systunix.",
            "rating": 5
          },

          {
            "image": "https://systunix.com/media/POS/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "company": "IMEDCEZ",
            "fullname": "Mr.Aman",
            "comment": "We have given the order and received on time. Best service with best quality. Thanks",
            "rating": 5
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
            "company": "IMEDCEZ",
            "fullname": "Mr.Raj",
            "comment": "We have given the order and received on time. Best service with best quality. Thanks",
            "rating": 4
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1585742425_76_1583141523_91_IMEDCEZ.JPG",
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
      $scope.products = {
        "images": [{
            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          },
          {

            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",
          },
          {
            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }

        ],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      }
      $scope.similarproducts = [

        {
        "images": [{
            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      },
        {
        "images": [{
            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      },
        {
        "images": [{
            "image": "https://systunix.com/media/POS/productV2/1602671180_24_DSC_2578-removebg-preview.png",

          }],
        "category": "Desk Organizer",
        "name": "SIT01 Bamboo Speaker",
        "mrp": 450,
        "sellingPrice": 200,
        "endDateTime": new Date()

      }

    ]

      $scope.showImage = function(indx){
        $scope.index = indx
        $scope.image = $scope.products.images[indx]

      }
      $scope.showImage(0)



    },






  }


});
