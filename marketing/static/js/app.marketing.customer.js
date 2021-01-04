app.controller("businessManagement.marketing.customer", function($scope, $state, $users, $stateParams, $http, Flash, $aside) {

$scope.form = {
  user : '',
  customer:'',
  tourPlanStop:[],
  invoices:[],
  dated : new Date(),
  addedInvoices :[],
  otp:'',
  visitType:'installation',
  timeslot : '1 AM'
}

$scope.dateVal = new Date()

$scope.selectCustomer = function(query) {
  return $http.get('/api/marketing/contacts/?search=' + query+'&limit=10' ).
  then(function(response) {
    return response.data.results;
  })
};
$scope.me = $users.get("mySelf");

$scope.getData = function(){
  $http({method : 'GET' , url : '/api/marketing/tourPlanStop/?contact='+$scope.form.customer.pk}).
  then(function(response) {
    $scope.form.tourPlanStop = response.data
  })
  $http({method : 'GET' , url : '/api/finance/saleAll/?phone='+$scope.form.customer.mobile}).
  then(function(response) {
    $scope.form.invoices = response.data
  })
}

$scope.$watch("form.customer" , function(newValue , oldValue) {
  if (typeof newValue == 'object') {
    $scope.getData()
    $scope.userSearch()
  }
  else{
    $scope.form.user = ''
    $scope.form.technicians = []
  }
}, true)


$scope.plan = function(){
  if (typeof $scope.form.customer!='object') {
    Flash.create('warning','Select customer')
    return
  }
  if (typeof $scope.form.user!='object') {
    Flash.create('warning','Select user')
    return
  }
  var tosend = {
    date : $scope.form.dated,
    user : $scope.form.user.pk,
    contact : $scope.form.customer.pk,
    visitType : $scope.form.visitType,
    timeslot: $scope.form.timeslot,
  }
  $http({method : 'POST' , url : '/api/marketing/plan/',data:tosend}).
  then(function(response) {
    $scope.getData()
    $scope.form = {
      user : '',
      customer:'',
      tourPlanStop:[],
      invoices:[],
      dated : new Date(),
      addedInvoices :[],
      otp:'',
      visitType:'installation',
      timeslot : '1 AM',
      technicians:'',
    }
    Flash.create('success', 'Created')
  })
}




$scope.userData = function(){
  $http.get('/api/HR/userSearch/').
   then(function(response) {
     $scope.techniciandata = response.data
     return $scope.techniciandata
   })
}
$scope.userData()



// $scope.techData()

  $scope.userSearch = function() {
    console.log($scope.form.customer.areaCode);
   $http.get('/api/HR/userSearch/?areaCode='+$scope.form.customer.areaCode).
    then(function(response) {
      $scope.form.technicians =   response.data;
    })
  };



  $scope.productSearch = function(c) {
    return $http.get('/api/finance/salesQty/?limit=10&product__icontains=' + c).
    then(function(response) {
      return response.data.results;
    })
  }

  $scope.requestOtp = function(typ,id){
    var tosend = {
      typ : typ,
      id:id,
    }
    $http({method : 'POST' , url : '/api/marketing/requestOtp/',data:tosend}).
    then(function(response) {
    })
  }

  $scope.verifyOtp = function(typ,id){
    var tosend = {
      typ : typ,
      id:id,
      otp:$scope.form.otp
    }
    $http({method : 'POST' , url : '/api/marketing/verifyOtp/',data:tosend}).
    then(function(response) {
    })
  }

  $scope.saveComment = function(pk,comment){

    $http({method : 'PATCH' ,
     url : '/api/marketing/tourPlanStop/'+pk+'/',
     data:{
       general_comment :   comment
    }
  }).
    then(function(response) {
      Flash.create('success',"Updated")
    })
  }

  $scope.newContact = function(){
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.newContact.html',
      size: 'lg',
      placement: 'right',
      backdrop: false,
      resolve: {
        data: function() {
          return $scope.form.customer
        },
      },
      controller: function($scope, $http, Flash, $uibModal, $uibModalInstance, data, NgMap) {

        $scope.form = {
          name:'',
          email:'',
          mobile:'',
          addrs:'',
          city:'',
          state:'',
          country:'',
          areaCode:'',
          pinCode:'',

        }

        $scope.getLocation = function(lat, lon){
          $http({method : 'GET' , url : '/api/marketing/getloaction/?lat=' + lat + '&lon=' + lon}).
          then(function(response) {
            if (response.data.msg) {
              Flash.create('warning',response.data.msg)
              return
            }
            else{
              console.log(response.data.address);
              $scope.form.addrs = response.data.address.display_name
              $scope.form.pinCode = response.data.address.address.postcode
            }
          })
        }

        $scope.center=[12.970435,77.578424];



        if (typeof data == 'object') {
          $scope.form = data
          $http({method : 'GET' , url : '/api/marketing/getloaction/?address=' + $scope.form.addrs}).
          then(function(response) {
            if (response.data.msg) {
            }
            else{
              $scope.center=[response.data.lat,response.data.lon];
            }
          })
        }
        else{
            $scope.form.mobile = data
              $scope.getLocation(12.970435, 77.578424)
        }


        $scope.areaCodes = []
        $http({method : 'GET' , url : '/api/marketing/getAreaCode/'}).
        then(function(response) {
          $scope.areaCodes = response.data.areaCodes
          // console.log($scope.form.areaCode,'aaaaaaaaaaaaa');
          // $scope.form.areaCode = $scope.areaCodes[0]
          for (var i = 0; i < $scope.areaCodes.length; i++) {
            if ($scope.form.areaCode == $scope.areaCodes[i].areaCode) {
              $scope.form.areaCode = $scope.areaCodes[i]
            }
          }
          console.log($scope.form);
          if ($scope.form.areaCode  == undefined || $scope.form.areaCode  == null || $scope.form.areaCode.length == 0 ) {
            $scope.form.areaCode = $scope.areaCodes[0]
          }
        })

        $scope.close = function(){
          if ($scope.form.pk) {
            $uibModalInstance.dismiss($scope.form)
          }
          else{
            $uibModalInstance.dismiss()
          }
        }

          // $scope.address = "Bangalore, India";
          //   $scope.onDragEnd = function (marker, $event) {
          //       var lat = marker.latLng.lat();
          //       var lng = marker.latLng.lng();
          //       console.log(lat , lng);
          //
          //   };


      $scope.getCurrentLocation = function(event){

         $scope.getLocation(event.latLng.lat() , event.latLng.lng())

          }

        $scope.$watch('form.pinCode' , function(newValue , oldValue) {
          console.log(newValue,'aaaaaaaaaaaaaaaaaaaaaaaaaa');
          if (newValue == undefined) {
            return;
          }
          if (newValue.length == 6) {
            $http({method : 'GET' , url : '/api/ERP/genericPincode/?pincode=' + newValue}).
            then(function(response) {
              if (response.data.length>0) {
                $scope.form.city = response.data[0].city;
                $scope.form.state = response.data[0].state;
                $scope.form.country = response.data[0].country;

              }
              // else{
              //   $scope.form.company.address.city = '';
              //   $scope.form.company.address.state = '';
              //   $scope.form.company.address.country = '';
              // }
            })
          }
        }, true)

        $scope.saveContact = function(){
          if ($scope.form.name == '' || $scope.form.mobile == '' || $scope.form.addrs == '' || $scope.form.areaCode == '' ) {
            Flash.create('warning' , 'Name, phone, address and areacode are required')
            return
          }
          if ($scope.form.pinCode.length == 0 || $scope.form.city.length == 0 || $scope.form.state.length == 0 || $scope.form.country.length == 0) {
            Flash.create('warning' , 'Enter valid pincode')
            return
          }
          var f = $scope.form
          var tosend = {
            name : f.name,
            mobile:f.mobile,
            addrs:f.addrs,
            pinCode:f.pinCode,
            city:f.city,
            state:f.state,
            country:f.country,
            areaCode:f.areaCode.areaCode
          }
          if (f.email!=null && f.email.length>0) {
            tosend.email = f.email
          }
          var method = 'POST'
          var url = '/api/marketing/contacts/'
          if (f.pk) {
            var method = 'PATCH'
            var url = '/api/marketing/contacts/' + f.pk +'/'
          }

          $http({method : method , url : url,data:tosend}).
          then(function(response) {
            $scope.form = {
              name:'',
              email:'',
              mobile:'',
              addrs:'',
              city:'',
              state:'',
              country:'',
              areaCode:'',
              pincode:'',
            }
            $uibModalInstance.dismiss(response.data)
          })

        }

      },
    }).result.then(function() {

    }, function(res) {
      if (res!=undefined) {
        $scope.form.customer = res
        if ($scope.form.customer.areaCode.areaCode!=undefined) {
          $scope.form.customer.areaCode = $scope.form.customer.areaCode.areaCode
        }
        $scope.userSearch()
      }
    });
  }


  // $scope.audioFile = function(){
  //   var fd = new FormData();
  //   if ($scope.form.audioFile != emptyFile && typeof $scope.form.audioFile != 'string' && $scope.form.audioFile != undefined) {
  //     fd.append('audioFile', $scope.form.audioFile)
  //   }
  //   fd.append('phone', '8792706346')
  //   console.log(fd);
  //   $http({
  //     method: 'POST',
  //     url: '/api/marketing/saveAudio/',
  //     data: fd,
  //     transformRequest: angular.identity,
  //     headers: {
  //       'Content-Type': undefined
  //     }
  //   }).
  //   then(function(response) {
  //     Flash.create('success', 'Saved');
  //     $scope.now = true;
  //     $scope.showSlot = false;
  //     $scope.tourData = response.data;
  //     $scope.form = response.data;
  //   })
  // }

})

app.controller("businessManagement.marketing.customer.details", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


$scope.techdata = {
  data : ''
}
  $scope.techData = function(){
    $http.get('/api/marketing/getStatus/').
     then(function(response) {
       $scope.techdata = response.data
     })
  }
  $scope.techData()


  $scope.search = ''
  $scope.limit = 10
  $scope.offset = 0
  $scope.asecindingOrder = false
  $scope.status = false
  $scope.getAllData = function(){
    var url = '/api/marketing/tourPlanStop/?limit=' +$scope.limit +'&offset='+$scope.offset
    if ($scope.search.length>0) {
      url+='&contact__mobile__contains='+$scope.search
    }
    if ($scope.asecindingOrder == true) {
      url+='&ascending'
    }

    if (typeof $scope.selctTech == 'object') {
      url+='&tourplan__user='+$scope.selctTech.pk
    }
    var status = []
    for (var i = 0; i < $scope.techdata.data.length; i++) {
      if ($scope.techdata.data[i].is_selected == true) {
        status.push($scope.techdata.data[i].name)
        $scope.techstatus = status+','
      }
    }
    if (status.length>0) {
          url+='&status='+status
          console.log(status,"statusstatusstatusstatusstatus");




    }

    $http({method : 'GET' , url : url}).
    then(function(response) {
      $scope.allData = response.data
      $scope.assetsData = response.data.results
      // for (var i = 0; i < $scope.assetsData.length; i++) {
        // $scope.assetsData[i].audio_file = []
        // $scope.assetsData[i].call_audio_file = []
        // if ($scope.assetsData[i].audio_files!=null) {
        //   var audio_file  = []
        //   audio_file = $scope.assetsData[i].audio_files.split(' , ')
        //   for (var j = 0; j < audio_file.length; j++) {
        //     var name = '/media/'+audio_file[j]
        //     $scope.assetsData[i].audio_file.push(name)
        //   }
        // }
        // if ($scope.assetsData[i].call_audio_files!=null) {
        //   var call_audio_file  = []
        //   call_audio_file = $scope.assetsData[i].call_audio_files.split(' , ')
        //   for (var j = 0; j < call_audio_file.length; j++) {
        //     var name1 = '/media/'+call_audio_file[j]
        //     $scope.assetsData[i].call_audio_file.push(name1)
        //   }
        // }
      // }
    })
  }
$scope.getAllData()

$scope.techstatus = ''
$scope.getCompleteData = function(){

  var url = '/api/marketing/tourPlanStop/?limit=' +$scope.limit +'&offset='+$scope.offset+'&status=completed'
  if ($scope.search.length>0) {
    url+='&contact__mobile__contains='+$scope.search
  }
  if ($scope.asecindingOrder == true) {
    url+='&ascending'
  }

  if (typeof $scope.selctTech == 'object') {
    url+='&tourplan__user='+$scope.selctTech.pk
  }
  // var status = []
  // for (var i = 0; i < $scope.techdata.data.length; i++) {
  //   // if ($scope.techdata.data[i].name =='completed') {
  //   //   $scope.techdata.data[i].is_selected == true
  //   //   status.push($scope.techdata.data[i].name)
  //   // }
  //   if ($scope.techdata.data[i].is_selected == true) {
  //     status.push($scope.techdata.data[i].name)
  //   }
  // }
  // if (status.length>0) {
  //   url+='&status='+status
  // }

  $http({method : 'GET' , url : url}).
  then(function(response) {
    $scope.allData = response.data
    $scope.completeassetsData = response.data.results

  })

}
$scope.getCompleteData()



$scope.sortData = function(){
  $scope.asecindingOrder =! $scope.asecindingOrder
  $scope.getAllData()
}
$scope.prev = function(){
  if ($scope.allData.previous!=null) {
    // $scope.limit = $scope.limit-10
    $scope.offset = $scope.offset-10
    $scope.getAllData()

  }
}

$scope.next = function(){
  if ($scope.allData.next!=null) {
    // $scope.limit = $scope.limit+10
    $scope.offset = $scope.offset+10
    $scope.getAllData()

  }
}

$scope.refresh = function(){
  $scope.search = ''
  $scope.limit = 10
  $scope.offset = 0
  $scope.selctTech = ' '
  $scope.techData()
  $scope.getAllData()
}


$scope.bulkUpload = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.marketing.contact.uploadContacts.html',
    size: 'sm',
    backdrop: false,
    controller: function($scope, $http, Flash, $uibModal, $uibModalInstance) {
      $scope.close = function(){
        $uibModalInstance.dismiss()
      }
      $scope.form = {
        'exFile': emptyFile,
        'source':''
      }
      $scope.uploading = false
      $scope.postFile = function(){
        var toSend = new FormData()
        toSend.append('exFile', $scope.form.exFile);
        toSend.append('source', $scope.form.source);
        $scope.uploading = true
        $http({
          method: 'POST',
          url: '/api/marketing/contactsBulkUpload/',
          data: toSend,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          $scope.uploading = false
          Flash.create('success',response.data.count + ' contacts uploaded!')
          $scope.form = {
            'exFile': emptyFile,
            'source':''
          }
          return
        }, function(err) {
          Flash.create('danger', 'Error while uploading file');
          $scope.uploading = false
          return
        })
      }
    },
  });

}



})
