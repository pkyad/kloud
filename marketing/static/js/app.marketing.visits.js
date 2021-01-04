app.controller('businessManagement.marketing.visits', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal) {
  $scope.me = $users.get('mySelf');
  console.log($scope.me, 'aaaaaaaaa');
  $scope.contactSearch = function(query) {
    return $http.get('/api/marketing/contacts/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  }


  $scope.audioFile = function(){
    var fd = new FormData();
    // if ($scope.form.audioFile != emptyFile && typeof $scope.form.audioFile != 'string' && $scope.form.audioFile != undefined) {
    //   fd.append('audioFile', $scope.form.audioFile)
    // }
    console.log($scope.tourStop.pk,'herrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    fd.append('visit', $scope.comntData.pk)
    console.log(fd);
    $http({
      method: 'POST',
      url: '/api/marketing/saveAudio/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.now = true;
      $scope.showSlot = false;
      $scope.tourData = response.data;
      $scope.form = response.data;
    })
  }

  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  }
  var u;
  $scope.showForm = false;
  $scope.now = false;
  $scope.showSlot = false;
  $scope.$watch('form.user', function(newValue, oldValue) {
    if (newValue != undefined || newValue != null) {
      $scope.showcmnt = false;
      if (typeof(newValue) == 'object') {
        $scope.showForm = true;
      } else {
        $scope.showForm = false;
        $scope.now = false;
      }
    }
    u = newValue;
    return u
  })


  $scope.resetForm = function() {
    $scope.form = {
      'date': new Date(),
      'user': '',
      'ta': 0,
      'da': 0,
      'amount': 0,
      'approved': '',
      'attachment': emptyfile,
      // 'audioFile' :  emptyfile,
    }
  }
  $scope.today = new Date()

  $scope.data = {
    before : [],
    after:[]
  }



  $scope.getTourplan = function(date) {
    if (u != undefined) {
      $http({
        method: 'GET',
        url: '/api/marketing/tourplan/?user=' + u.pk + '&date=' + date
      }).
      then(function(response) {
        $scope.tData = response.data
        if ($scope.tData.length > 0) {
          $scope.tourData = $scope.tData[0];
          $scope.form = $scope.tourData;
          $scope.now = true;
          // if ($scope.tourData.status != 'created') {
          //   $scope.gotData = false;
          // }
        } else {
          $scope.form.ta = 0
          $scope.form.da = 0
          $scope.form.amount = 0
          var f = $scope.form
          var fd = new FormData();
          if (f.attachment != emptyFile && typeof f.attachment != 'string' && f.attachment != undefined) {
            fd.append('attachment', f.attachment)
          }
          if (typeof(f.user) != 'object') {
            Flash.create('warning', 'please select the User');
          } else {
            fd.append('user', f.user.pk);
          }
          if (f.date == '') {
            Flash.create('warning', 'please select the date');
          } else {
            fd.append('date', f.date.toJSON().split('T')[0]);
          }
          if (f.approved == undefined || f.approved == null) {
            fd.append('approved', false);
          } else {
            fd.append('approved', f.approved);
          }
          fd.append('ta', f.ta);
          fd.append('da', f.da);
          fd.append('amount', f.amount);
          console.log(fd);
          $http({
            method: 'POST',
            url: '/api/marketing/tourplan/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $scope.now = true;
            $scope.showSlot = false;
            $scope.tourData = response.data;
            $scope.form = response.data;
          })
        }
      })
    }
  }
  $scope.update = function() {
    // console.log($scope.tourData);
    var u = $scope.tourData
    var fd = new FormData();
    if ($scope.form.attachment != emptyFile && typeof $scope.form.attachment != 'string' && $scope.form.attachment != null) {
      fd.append('attachment', $scope.form.attachment)
    }
    fd.append('ta', $scope.form.ta);
    fd.append('da', $scope.form.da);
    fd.append('amount', $scope.form.amount);
    fd.append('user', u.user.pk);
    fd.append('date', u.date);
    $http({
      method: 'PATCH',
      url: '/api/marketing/tourplan/' + $scope.tourData.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'updated');
      $scope.form = response.data;
    })
  }

  $scope.approval = function() {
    var fd = new FormData();
    fd.append('status', 'sent_for_approval');
    $http({
      method: 'PATCH',
      url: '/api/marketing/tourplan/' + $scope.tourData.pk + '/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Sent for Approval');
      $scope.form.status = response.data.status;
    })
  }
  $scope.$watch('form.date', function(newValue, oldValue) {
    if (newValue != undefined || newValue != null) {
      if (typeof newValue == 'object') {
        $scope.showcmnt = false;
        var date = newValue.toJSON().split('T')[0];
      } else {
        var date = newValue;
      }
      $scope.getTourplan(date);
      if ($scope.tourData != undefined) {
        $scope.showSlot = true;
        $scope.gotData = true;
        $scope.getTourStop();
      } else {
        $scope.showSlot = false;
        $scope.gotData = false;
      }
    }
  })


  $scope.form = {
    'contact': '',
    'timeslot': '',
    'tourplan': '',
  }
  $scope.getTourStop = function() {
    // console.log('came to fetchehhhhh');
    $http({
      method: 'GET',
      url: '/api/marketing/tourPlanStop/?tourplan=' + $scope.tourData.pk
    }).
    then(function(response) {
      $scope.tourStop = response.data;
      // console.log('got thiiiiiiii sin fetttttttch', $scope.tourStop);
    })
  }

  $scope.saveContact = function() {
    // console.log($scope.tourData.pk, '------first form pk');
    var t = $scope.form
    var toSend = {
      timeslot: t.timeslot,
      tourplan: $scope.tourData.pk,
      comments: t.comments,
    }
    if (typeof(t.contact) != 'object') {
      Flash.create('warning', 'please select the User');
    } else {
      toSend.contact = t.contact.pk;
    }
    $http({
      method: 'POST',
      url: '/api/marketing/tourPlanStop/',
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'TimeSlot Added Successfully');
      $scope.conData = response.data;
      $scope.getTourStop();
      $scope.showSlot = true;
      $scope.form.contact = '';
      $scope.form.timeslot = '';
    })
  }

  $scope.searchPin = function() {
    if ($scope.form.pincode != '') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.marketing.visits.pincode.html',
        size: 'lg',
        backdrop: false,
        resolve: {
          data: function() {
            return $scope.form.pincode;
          },
          tour: function() {
            return $scope.tourData
          }
        },
        controller: function($scope, $http, Flash, data, tour, $uibModalInstance) {
          // console.log(data, tour.pk, '---------');
          $http({
            method: 'GET',
            url: '/api/marketing/contacts/?pinCode=' + data
          }).
          then(function(response) {
            $scope.multislot = response.data;
          })
          $scope.form = {
            allSelected: ''
          }
          $scope.$watch('form.allSelected', function(newValue, oldValue) {
            // console.log("heeeeeeerrrrrr");
            if ($scope.multislot != undefined) {
              for (var i = 0; i < $scope.multislot.length; i++) {
                $scope.multislot[i].selected = newValue;
              }
            }
          })
          $scope.saveSelected = function() {
            $scope.nowclose = false;
            $scope.tt = []
            var count = 0
            for (var i = 0; i < $scope.multislot.length; i++) {
              if ($scope.multislot[i].selected) {
                count += 1
                // console.log("aaaaaaa", count);
                var f = $scope.multislot[i];
                var toSend = {
                  contact: f.pk,
                  timeslot: f.timeslot,
                  tourplan: tour.pk,
                  comments: f.comments,
                }
                // console.log(toSend, '--------paraaasmsmsmsm');
                $http({
                  method: 'POST',
                  url: '/api/marketing/tourPlanStop/',
                  data: toSend
                }).
                then(function(response) {
                  $scope.tt.push(response.data)
                  // console.log($scope.tt.length, 'lllllllll');
                  $scope.nowclose = true;

                })
              }
            }
          }
          $scope.cancel = function() {
            $uibModalInstance.dismiss($scope.tt);
          }
        }, //controller ends
      }).result.then(function(f) {
        return f
      }, function(f) {
        if (typeof f != 'string') {
          $scope.form.pincode = '';
          for (var i = 0; i < f.length; i++) {
            // console.log(f[i]), 'kkkkkkkkkkkk';
            $scope.tourStop.push(f[i]);
          }
        }
      });
    }

  } //function endss

  $scope.detail = false;
  $scope.pk = null
  $scope.showDetail = function(idx, pk) {
    // console.log(idx, pk, '--------id and pk');
    $scope.detail = true;
    $scope.showcmnt = true;
    $scope.selected = idx;
    $scope.pk = pk
    // console.log('gettttiinnggg cooommm');
    // console.log($scope.comntData, 'innnnn showwww');
    $http({
      method: 'GET',
      url: '/api/marketing/tourPlanStop/' + $scope.pk +'/'
    }).
    then(function(response) {
      $scope.comntData = response.data;
      $scope.form.comments = $scope.comntData.comments;
      $scope.data.before = $scope.comntData.beforePic
      $scope.data.after = $scope.comntData.afterPic
      // console.log($scope.form.comments, '-------uuuiininn coooommm getett');
    })
  }


  $scope.saveComment = function() {

    var dataToSend = {
      comments: $scope.form.comments,
    }
    var beforeImages = []
    var afterImages = []
    if ($scope.data.before.length>0) {
      for (var i = 0; i < $scope.data.before.length; i++) {
        beforeImages.push($scope.data.before[i].pk)
      }
      dataToSend.beforePic = beforeImages
    }
    if ($scope.data.after.length>0) {
      for (var i = 0; i < $scope.data.after.length; i++) {
        afterImages.push($scope.data.after[i].pk)
      }
      dataToSend.afterPic = afterImages
    }

    $http({
      method: 'PATCH',
      url: '/api/marketing/tourPlanStop/' + $scope.pk + '/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'saved');
      // console.log(response.data);
      $scope.form.comments = response.data.comments;
    })
  }

  $scope.AddInvoice = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.invoice.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.comntData;
        }
      },
      controller: function($scope, $http, Flash, data, $uibModalInstance) {
        $scope.data = data
        $scope.data.products = []
        $scope.addTableRow = function(indx) {
          $scope.data.products.push({
            asset: '',
            price: 0,
            receivedQty: 0,
          });
          // $scope.showButton = false
        }

        $scope.productSearch = function(query) {
          return $http.get('/api/finance/purchaseorderqty/?product__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.productMetaSearch = function(query) {
          return $http.get('/api/clientRelationships/productMeta/?code__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.assetsSearch = function(query) {
          return $http.get('/api/assets/assets/?name__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.$watch('data.products', function(newValue, oldValue) {
          if (newValue != undefined) {
            for (var i = 0; i < newValue.length; i++) {
              if (typeof newValue[i].asset == 'object') {
                $scope.data.products[i].price = newValue[i].asset.price
              }
            }

            if (newValue.length>1) {
              $scope.checkAsset(newValue[newValue.length-1].asset,newValue.length-1)
            }
          }
        }, true)

        $scope.checkAsset = function(asset , indx){
          console.log(asset,indx);
          if (typeof asset == 'object') {
            for (var i = 0; i < $scope.data.products.length-1; i++) {
              if ($scope.data.products[i].asset.pk == asset.pk) {
                Flash.create('warning',' Already Added')
                $scope.data.products.splice(indx,1)
                return
              }
            }
          }
        }

        $scope.delete = function(indx){
          $scope.data.products.splice(indx,1)
          Flash.create('warning','Deleted')
        }

        $scope.save = function(){

          var products = []
          for (var i = 0; i < $scope.data.products.length; i++) {
            console.log($scope.data.products[i].asset.checkinAllCount);
            if ($scope.data.products[i].receivedQty>$scope.data.products[i].asset.checkinAllCount) {
              Flash.create('warning',' Avaliable quantity for : ' + $scope.data.products[i].asset.name  +' for ' + $scope.data.products[i].asset.checkinAllCount)
              return
            }
            if ($scope.data.products[i].receivedQty > 0) {
              products.push({'asset':$scope.data.products[i].asset.pk,'quantity':$scope.data.products[i].receivedQty,'price':$scope.data.products[i].price})
            }
          }
          dataToSend = {
            contact : $scope.data.contact.pk,
            products : products,
            tourplan : $scope.data.pk
          }
          $http({
            method: 'POST',
            url: '/api/marketing/createInvoice/',
            data: dataToSend
          }).
          then(function(response) {
            $uibModalInstance.dismiss()
            Flash.create('success', 'saved');

          })
        }
      },
    }).result.then(function() {
    }, function() {

    });
  }


})
