// you need to first configure the states for this app

app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.marketing', {
      url: "/marketing",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/genericAppBase.html',
        },
        "@businessManagement.marketing": {
          templateUrl: '/static/ngTemplates/app.marketing.campaign.html',
          controller: 'businessManagement.marketing.campaign'
        }
      }
    })
    .state('businessManagement.marketing.email', {
      url: "/email/:id",
      templateUrl: '/static/ngTemplates/app.marketing.campaign.explore.html',
      controller: 'businessManagement.marketing.canpaign.explore'
    })
    .state('businessManagement.marketing.call', {
      url: "/call/:id",
      templateUrl: '/static/ngTemplates/app.marketing.campaign.call.html',
      controller: 'businessManagement.marketing.canpaign.call.explore'
    })
    .state('businessManagement.marketing.contacts', {
      url: "/contacts",
      templateUrl: '/static/ngTemplates/app.marketing.contacts.html',
      controller: 'businessManagement.marketing.contacts'
    })
    .state('businessManagement.marketing.details', { // for editing
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.marketing.campaign.form.html',
      controller: 'businessManagement.marketing.canpaign.form'
    })
    // .state('businessManagement.marketing.firstLevel', { // for editing
    //   url: "/firstLevel",
    //   templateUrl: '/static/ngTemplates/app.marketing.campaign.call.html',
    //   controller: 'businessManagement.marketing.level'
    // })
    .state('businessManagement.marketing.level', { // for editing
      url: "/level/:id",
      templateUrl: '/static/ngTemplates/app.marketing.campaign.call.html',
      controller: 'businessManagement.marketing.canpaign.call.explore'
    })



});

// app.controller("businessManagement.marketing.level", function($scope, $state, $users, $stateParams, $http, Flash,$uibModal) {
//   $scope.level = 'firstLevel'
//   $scope.me = $users.get('mySelf');
//   if ($state.is('businessManagement.marketing.secondLevel')) {
//     $scope.level = 'secondLevel'
//   }
//   $http({method : 'GET' , url : '/api/marketing/campaignItem/?level=' + $scope.level +'&campaignId__lead=' +$scope.me.pk }).
//   then(function(response) {
//       $scope.items = response.data.results;
//
//   })
//
//
//
// })


app.controller("businessManagement.marketing.canpaign.showDetails", function($scope, $state, $users, $stateParams, $http, Flash,$uibModal,data) {
  $scope.data = data
  $scope.getCampDetails = function(){
    $http({
      method: 'GET',
      url: '/api/marketing/getCampDetails/?id='+$scope.data.pk,
    }).
    then(function(response) {
      $scope.getAllCamp = response.data
    })
  }
  $scope.getCampDetails()
})


app.controller("businessManagement.marketing.campaign", function($scope, $state, $users, $stateParams, $http, Flash,$uibModal,$aside, $interval) {


  // $scope.data = {
  //   tableData: []
  // };
  $scope.me = $users.get('mySelf');
  $scope.getAllNot = function() {
    $http({
      method: 'GET',
      url: '/api/PIM/notification/?user='+$scope.me.pk+'&read=false'
    }).
    then(function(response) {
      $scope.notificationsLength = response.data.length;
    })
  }
  $scope.getAllNot()

  // $interval(function() {
  //   $scope.getAllNot()
  // },3000)

  $scope.showDetails = function(indx){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.campaign.showDetails.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.campaigns[indx];
        },
      },
      controller: "businessManagement.marketing.canpaign.showDetails",
    }).result.then(function () {

    }, function () {
    });
  }


  $scope.teamlead = false

  $scope.showNotifications = function(user){
    $aside.open({
      templateUrl: '/static/ngTemplates/app.notificationtray.html',
      placement: 'left',
      size: 'lg',
      controller: function($scope, $uibModalInstance, $users, $http, Flash, $sce) {
        $scope.query = "";
        $scope.getAllData = function() {
          $http({
            method: 'GET',
            url: '/api/PIM/notification/?user='+user.pk
          }).
          then(function(response) {
            $scope.notificationsData = response.data;
          })
        }
        $scope.getAllData()

        $scope.saveAsRead = function(index, t) {
          console.log(index, t, 'asdasdasdsda');
          $http({
            method: 'PATCH',
            url: '/api/PIM/notification/'+t.pk+'/',
            data:{'read':true}
          }).
          then(function(response) {
            $scope.notificationsData[index] = response.data;
          })
        }
      }
    }).result.then(function () {

    }, function () {
      $scope.getAllNot()
    });

  }

  $scope.teamDetails = ''
  if ($scope.me.profile.teamlead!=undefined && $scope.me.profile.teamlead.pk) {
    $scope.teamlead = true
    $scope.teamDetails = $scope.me.profile.teamlead
    $scope.teamMembers = []
    if ($scope.teamDetails.members.length>0) {
      for (var i = 0; i < $scope.teamDetails.members.length; i++) {
        $scope.teamMembers.push($scope.teamDetails.members[i].user)
      }
    }
  }

  $scope.saveTask = function(indx){
    if (parseInt($scope.campaigns[indx].count) > parseInt( $scope.campaigns[indx].totalTask.balance)) {
      Flash.create('warning',"Should'nt assign more than balance")
      return
    }
    var dataSend = {
      count : $scope.campaigns[indx].count,
      lead :  $scope.campaigns[indx].user.pk,
      campaign : $scope.campaigns[indx].pk
    }
    $http({
      method: 'POST',
      url: '/api/marketing/assign/',
      data: dataSend,
    }).
    then(function(response) {
      Flash.create('success', 'Assigned SuccessFully');
      $scope.getallCampaigns()
    })
  }

  // var views = [{
  //   name: 'list',
  //   icon: 'fa-bars',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.marketing.campaign.item.html',
  // }, ];
  //
  // $scope.Config = {
  //   url: '/api/marketing/campaign/',
  //   views: views,
  //   itemsNumPerView: [12, 24, 48],
  //   searchField: 'name',
  // };
  //
  // $scope.tableAction = function(target, action, mode) {
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     if ($scope.data.tableData[i].pk == parseInt(target)) {
  //       if (action == 'edit') {
  //         $state.go('businessManagement.marketing.details' , {id : target})
  //       } else if (action == 'info') {
  //
  //         if ($scope.data.tableData[i].typ == 'call') {
  //           $state.go('businessManagement.marketing.call' , {id : target})
  //         }else{
  //           $state.go('businessManagement.marketing.email' , {id : target})
  //         }
  //
  //       }else if (action == 'details') {
  //         $scope.addTab({
  //           title: 'Call Campaign Report : ' + $scope.data.tableData[i].name,
  //           cancel: true,
  //           app: 'campaignDetails',
  //           data: {
  //             pk: target,
  //             index: i
  //           },
  //           active: true
  //         })
  //       }
  //
  //     }
  //   }
  //
  // }
  //
  // $scope.tabs = [];
  // $scope.searchTabActive = true;
  //
  // $scope.closeTab = function(index) {
  //   $scope.tabs.splice(index, 1)
  // }
  //
  // $scope.addTab = function(input) {
  //   console.log(JSON.stringify(input));
  //   $scope.searchTabActive = false;
  //   alreadyOpen = false;
  //   for (var i = 0; i < $scope.tabs.length; i++) {
  //     if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
  //       $scope.tabs[i].active = true;
  //       alreadyOpen = true;
  //     } else {
  //       $scope.tabs[i].active = false;
  //     }
  //   }
  //   if (!alreadyOpen) {
  //     $scope.tabs.push(input)
  //   }
  // }

$scope.limit = 12
$scope.offset = 0
$scope.searchForm ={
  searchValue:''
}
$scope.getallCampaigns = function(){
  var url = '/api/marketing/campaign/?limit='+$scope.limit+'&offset='+$scope.offset
  if ($scope.searchForm.searchValue.length >0) {
    url += '&name__icontains='+$scope.searchForm.searchValue
  }
  $http({method : 'GET' , url : url  }).
  then(function(response) {
    $scope.campaigns = response.data.results;
    $scope.prev = response.data.previous
    $scope.next = response.data.next
  })
}
$scope.getallCampaigns()
$scope.dated = new Date()

$scope.getTodayCampaigns = function(){
  var url = '/api/marketing/getFollowup/'
  $http({method : 'GET' , url : url  }).
  then(function(response) {
    $scope.todaycampaigns = response.data;
    console.log($scope.todaycampaigns,'aaaaaaaaaaaaaaaaaaa');
  })
}
$scope.getTodayCampaigns()

$scope.campPrevious = function(){
if ($scope.prev != null) {
  $scope.offset -= $scope.limit
  $scope.getallCampaigns()
}
}
$scope.campNext = function(){
if ($scope.next != null) {
  $scope.offset += $scope.limit
  $scope.getallCampaigns()
}
}


$scope.viewCammpaign = function(data){
  if (data.typ == 'call') {
    $state.go('businessManagement.marketing.call' , {id : data.pk})
  }else{
    $state.go('businessManagement.marketing.email' , {id : data.pk})
  }
}

$scope.editMarketing = function(data){
$state.go('businessManagement.marketing.details' , {id : data.pk})
}


$scope.createCampaign = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.campaign.callForm.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.contactList;
        },
        typ: function() {
          return 'call';
        },
        filters : function() {
          return '';
        },
        tags : function() {
          return '';
        }
      },
      controller: "businessManagement.marketing.canpaign.typPopUp",
    }).result.then(function () {

    }, function () {
    });
}

$scope.bulkUpload = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.marketing.contact.uploadContacts.html',
    size: 'md',
    backdrop: true,
    controller: function($scope, $http, Flash, $uibModal, $uibModalInstance) {

      $scope.selectFile = function() {
        $('#filePicker').click()
      }
      $scope.getUsers = function() {
         $http.get('/api/HR/userSearch/').
        then(function(response) {
          $scope.selectUsers = response.data;
        })
      };
      $scope.getUsers()
      $scope.close = function(){
        $uibModalInstance.dismiss()
      }
      $scope.form = {
        'exFile': emptyFile,
        'source':'',
        'typ':'call',
        'lead':'',
        'dataType':'',
        'priority':''
      }
      $scope.uploading = false
      $scope.postFile = function(){
        var toSend = new FormData()
        if ($scope.form.exFile == emptyFile) {
          Flash.create('warning' , 'No file selected')
          return;
        }
        if ($scope.form.source.length == 0) {
          Flash.create('warning' , 'kindly enter source name.')
          return;
        }
        if ($scope.form.dataType.length == 0) {
          Flash.create('warning' , 'kindly select data type.')
          return;
        }
        if ($scope.form.priority.length == 0) {
          Flash.create('warning' , 'kindly select priority.')
          return;
        }
        toSend.append('exFile', $scope.form.exFile);
        toSend.append('source', $scope.form.source);
        toSend.append('dataType', $scope.form.dataType);
        toSend.append('priority', $scope.form.priority);
        toSend.append('generate', 'generate');
        $scope.uploading = true
        console.log('herererer, marketing js');
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
          $uibModalInstance.dismiss(response.data.contactList);
        }, function(err) {
          Flash.create('danger', 'Error while uploading file');
          $scope.uploading = false
          return
        })
      }
    },
  }).result.then(function() {

  }, function(contactList) {
    // if (contactList.length>0) {
    //   $scope.contactList = contactList
    //   $scope.createCampaign()
    // }

  });

}


})


app.controller("businessManagement.marketing.canpaign.form", function($scope, $http, Flash, $state, $uibModal) {

  $scope.teamSearch = function() {
     $http.get('/api/HR/team/').
    then(function(response) {
      $scope.allUsers = response.data;
      console.log($scope.form,'aaaaaaaaaaaaaaaaaa');
      for (var i = 0; i < $scope.allUsers.length; i++) {
        if ($scope.allUsers[i].pk == $scope.form.team.pk) {
          $scope.form.team = $scope.allUsers[i]
        }
      }
    })
  };



  $scope.getUsers = function() {
     $http.get('/api/HR/userSearch/').
    then(function(response) {
      $scope.selectUsers = response.data;
      for (var i = 0; i < $scope.selectUsers.length; i++) {
        if ($scope.selectUsers[i].pk == $scope.form.lead) {
          $scope.form.lead = $scope.selectUsers[i]
        }
      }
    })
  };
  $scope.getUsers()


  $scope.openCreateTeam = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.HR.form.createTeam.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.form.team;
        }
      },
      controller: function($scope, data, $uibModalInstance) {
        $scope.Reporting = function(query) {
          return $http.get('/api/HR/users/?username__contains=' + query).
          then(function(response) {
            console.log('@', response.data)
            return response.data;
          })
        };
        if (data.pk) {
          $scope.form = {
            team: data.title,
            manager: data.manager,
          }
        } else {
          $scope.form = {
            team: data,
            manager: '',
          }
        }
        $scope.saveTeam = function() {
          if (data.pk) {
            console.log(data.pk);
            var Method = 'PATCH';
            var Url = '/api/HR/team/' + data.pk + '/';
          } else {
            var Method = 'POST';
            var Url = '/api/HR/team/';
          }
          var toSend = {
            title: $scope.form.team,
            manager: $scope.form.manager.pk,
          }
          $http({
            method: Method,
            url: Url,
            data: toSend,
          }).
          then(function(response) {
            $uibModalInstance.dismiss(response.data);
            $scope.form.team = response.data.title;
            Flash.create('success', 'Saved Team SuccessFully');
          })
        }
      }
    }).result.then(function(f) {

    }, function(f) {
      if (typeof f == 'object') {
        $scope.form.team = f
      }
    });
  }

  $http({method : 'GET' , url : '/api/marketing/campaign/'+$state.params.id+'/'   }).
  then(function(response) {
    $scope.form = response.data
    $scope.teamSearch()
  })


  $http({method : 'GET' , url : '/api/marketing/getemailTemplates/'   }).
  then(function(response) {
    $scope.templates = response.data;
  })

$scope.form = {
  name:'',typ:'',emailSubject:'',emailBody:'',limitPerDay:10,msgBody:'',team:'',emailTemplate:'',lead:''
}

  $scope.save = function() {
    if ($scope.form.name == 0) {
      Flash.create('warning', 'Name Is Required')
      return
    }
    // var contacts = []
    // for (var i = 0; i < $scope.data.length; i++) {
    //   contacts.push($scope.data[i].pk)
    // }
    var toSend = {
      typ: $scope.form.typ,
      name : $scope.form.name,
      // contacts : contacts
    }

    if ($scope.form.typ == 'email') {
      if ($scope.form.emailSubject.length == 0) {
        Flash.create('warning', 'Email Subject Is Required')
        return
      }
      if ($scope.form.emailBody.length == 0 && $scope.form.emailTemplate.length == 0)  {
        Flash.create('warning', 'Email Content Is Required')
        return
      }


      if ($scope.form.emailTemplate.length > 0 ) {
        toSend.emailTemplate = $scope.form.emailTemplate;
      }else{
        toSend.emailBody = $scope.form.emailBody;
      }

      toSend.limitPerDay = $scope.form.limitPerDay;

      toSend.emailSubject = $scope.form.emailSubject
    } else if ($scope.form.typ == 'sms') {
      if ($scope.form.msgBody.length == 0) {
        Flash.create('warning', 'Message Is Required')
        return
      }
      toSend.msgBody = $scope.form.msgBody
    } else {
      if ($scope.form.directions!=null && $scope.form.directions.length == 0) {
        Flash.create('warning', 'Directions Is Required')
        return
      }
      toSend.directions = $scope.form.directions
      if ($scope.form.team!=null && typeof $scope.form.team == 'object') {
        toSend.team = $scope.form.team.pk
      }
      if (typeof $scope.form.lead == 'object') {
        toSend.lead = $scope.form.lead.pk
      }

    }
    // var tags = [];
    // for (var i = 0; i < $scope.tags.length; i++) {
    //   tags.push($scope.tags[i].pk)
    // }
    // toSend.tags = tags;
    var method =  'POST'
    var url = '/api/marketing/campaign/'
    if ($scope.form.pk != undefined) {
      method = 'PATCH'
      url+= $socpe.form.pk+'/'
    }

    $http({method : method , url : url , data : toSend   }).
    then(function(response) {
      $scope.form = response.data;
      Flash.create('success' , 'Saved')
    })
  }





});

app.controller("businessManagement.marketing.canpaign.explore", function($scope, $http, Flash, $uibModal, $sce, $aside, $state) {

  $scope.sendTestMail = function() {
    $http({method : 'GET' , url : '/api/marketing/sendTestMail/?id=' + $scope.data.pk   }).
    then(function(response) {
      Flash.create('success' , 'Sent successfully')
    })
  }





  $http({method : 'GET' , url : '/api/marketing/campaign/' + $state.params.id + '/'}).
  then(function(response) {
    $scope.data = response.data;
    $scope.fetch()
    $scope.refreshStats();
  })
  $scope.refreshStats = function() {
    $http({method : 'GET' , url : '/api/marketing/getEmailCampaignStats/?id=' + $scope.data.pk  }).
    then(function(response) {
      $scope.stats = response.data;
    })

  }



  $scope.searchTxt = '';
  $scope.page = 0;


  $scope.fetch = function() {
    $http({method : 'GET' , url : '/api/marketing/emailcampaignItem/?campaign=' + $scope.data.pk +'&limit=12&offset=' + $scope.page *12 +'&email=' + $scope.searchTxt   }).
    then(function(response) {
      $scope.items = response.data.results;
    })
  }



  $scope.next = function() {
    $scope.page += 1;
    $scope.fetch();
  }

  $scope.prev = function() {
    if ($scope.page == 0) {
      return;
    }
    $scope.page -= 1;
    $scope.fetch();
  }


})



app.controller("businessManagement.marketing.canpaign.details", function($scope, $http, Flash, $uibModal, $sce, $aside) {
  $scope.data = $scope.data.tableData[$scope.tab.data.index];

  $scope.form = {inView : 0, page: 0,all : true}
  console.log($scope.data);

  $scope.next = function() {
    $scope.form.page += 1;
    $scope.fetchItems();
  }

  $scope.prev = function() {
    if ($scope.form.page == 0) {
      return;
    }
    $scope.form.page -= 1;
    $scope.fetchItems();
  }



  $scope.fetchItems = function() {

    if ($scope.form.all) {
      var status = 'persuing';
    }else {
      var status = 'interested';
    }

    $http({method : 'GET' , url : '/api/marketing/campaignItem/?limit=15&offset=' + $scope.form.page*15 + '&campaign=' + $scope.data.pk + '&status=' + status  }).
    then(function(response) {
      $scope.campaignItems = response.data.results;
      $scope.form.inView = 0;
      $scope.fetchDetails(0);
    })
  }

  $scope.$watch('form.all' , function(newValue , oldValue) {
    $scope.fetchItems()
  })



  $scope.addComment = function() {

    var toSend = {"typ":"comment","data": $scope.form.cmnt,"contact": $scope.userData.pk ,"campaign": $scope.data.pk}
    $http({method : 'POST' , url : '/api/marketing/campaignLogs/' , data : toSend}).
    then(function(response) {
      $scope.logs.push(response.data)
    })
    $scope.form.cmnt = "";
  }


  $scope.fetchItems();

  $scope.fetchDetails = function(newValue) {
    $scope.userData = $scope.campaignItems[newValue].contact

    $http({method : 'GET' , url : '/api/marketing/campaignLogs/?contact=' + $scope.campaignItems[newValue].contact.pk}).
    then(function(response) {
      $scope.logs = response.data;
    })
  }
  $scope.$watch('form.inView' , function(newValue , oldValue) {
    $scope.fetchDetails(newValue);
  })




})


app.controller("businessManagement.marketing.createQuotataion", function($scope, $http, Flash, $sce, $aside, $state, $rootScope , data, $timeout, $uibModalInstance) {


console.log(data,'aaaaaaaaaaaaaaaaaaaaa');

$scope.contract = data
$scope.contract.data = []
$scope.contract.discount = 0
$scope.contract.grandTotal = 0
$scope.contract.inWords  = 'Zero';
//   $scope.contract = {
//   data:[],
//   discount:0,
//   grandTotal:0
// }
  $scope.fromDelimiter = function(txt) {
    var toReturn = []
    var array = txt.split('||');

    for (var i = 0; i < array.length; i++) {
      toReturn.push({txt : array[i]})
    }
    return toReturn;
  }

  $http({method : 'GET' , url : '/api/clientRelationships/termsAndConditions/'}).
  then(function(response) {
    $scope.tncList = response.data;

    $scope.form.tncs = $scope.fromDelimiter($scope.tncList[0].body) ;
    $scope.form.heading = $scope.tncList[0].heading;



  })

  $scope.$watch("form.desc" , function(newValue , oldValue) {
    if (typeof newValue == 'object') {
      $scope.form.rate = parseInt(newValue.price)
      $scope.form.desc = newValue.name
    }
  }, true)

  $scope.close = function(){
    $uibModalInstance.dismiss()
  }


    $scope.addtnctxt = function(txt) {
      $scope.form.tncs.push({txt : txt });
      $scope.form.tnctxt = "";
    }

    $scope.selectTemplate = function(indx) {
      $scope.form.tncs = $scope.fromDelimiter($scope.tncList[indx].body) ;
      $scope.form.heading = $scope.tncList[indx].heading;
    }

    $scope.removeTnc = function(indx) {
      $scope.form.tncs.splice(indx , 1);
    }

    $scope.removeItem = function(indx) {
      $scope.contract.data.splice(indx , 1)
    }

    $scope.editItem = function(indx) {
        $scope.form.desc = $scope.contract.data[indx].desc,
        $scope.form.qty =  $scope.contract.data[indx].quantity,
        $scope.form.rate = $scope.contract.data[indx].rate,
        $http.get('/api/clientRelationships/productMeta/?code=' + $scope.contract.data[indx].taxCode).
        then(function(response) {
          $scope.form.productMeta =  response.data[0];
        })

      $scope.contract.data.splice(indx , 1)
    }
    $scope.viewContract = function(indx){
      var contractData = $scope.contractVersions[indx]
      $scope.contract.data = JSON.parse(contractData.data)
      $scope.contract.discount = contractData.discount
      $scope.contract.grandTotal = contractData.grandTotal
      $scope.contract.heading = contractData.heading
      if (contractData.termsAndConditionTxts) {
        $scope.form.tncs = $scope.fromDelimiter(contractData.termsAndConditionTxts)
      }
      $scope.contract.inWords  = price_in_words($scope.contract.grandTotal)
    }

    $scope.addItem = function() {
      console.log("aaaaaaaaaaaaaaaaaaaa");
      var desc = $scope.form.desc
      if (typeof desc == 'object') {
        desc = desc.name
      }
      var total = $scope.form.rate* $scope.form.qty;

      var item = {
        currency: "INR",
        desc: desc,
        quantity: $scope.form.qty,
        rate: $scope.form.rate,
        saleType: "Product",
        subtotal: total + $scope.form.productMeta.taxRate*total/100   ,
        tax: $scope.form.productMeta.taxRate,
        taxCode: $scope.form.productMeta.code,
        total: total,
        totalTax: $scope.form.productMeta.taxRate*total/100,
        type: "onetime"
      }
      $scope.contract.data.push(item);
      $scope.form = {desc : '' , productMeta : '' , qty : '' , rate : '' , mode : $scope.form.mode , tncs: $scope.form.tncs , date : new Date(), heading : $scope.form.heading};
      $scope.calculateTotal();
      $timeout(function() {
        $('#descEdit').focus()
      },200)
    }

    $scope.calculateTotal = function() {
      var total = 0
      for (var i = 0; i < $scope.contract.data.length; i++) {
        total += $scope.contract.data[i].subtotal;
      }

      $scope.contract.grandTotal = total;
      if ($scope.contract.discount.toString().length > 0) {
          $scope.contract.grandTotal -= parseInt($scope.contract.discount);
      }

      $scope.contract.inWords  = price_in_words($scope.contract.grandTotal)


    }

    $scope.form = {desc : '' , productMeta : '' , qty : '' , rate : '' , mode : 'new', date : new Date()}

    $scope.inventorySearch = function(query) {
      return $http.get('/api/assets/assets/?limit=10&name__icontains=' + query).
      then(function(response) {
        return response.data.results;
      })
    }



    $scope.searchTaxCode = function(c) {
      return $http.get('/api/clientRelationships/productMeta/?description__icontains=' + c).
      then(function(response) {
        return response.data;
      })
    }
    $scope.save = function() {
      if ($scope.contract.data.length == 0) {
        Flash.create('warning' , 'Add Products')
        return
      }
      var url = '/api/marketing/createcontract/';
      var method = 'POST';

      console.log($scope.form.tncs);

      var tncsTxtArr = [];
      for (var i = 0; i < $scope.form.tncs.length; i++) {
        tncsTxtArr.push( $scope.form.tncs[i].txt )
      }

      var toSend = {
        // contract : $scope.contract.pk,
        data : JSON.stringify($scope.contract.data),
        grandTotal : $scope.contract.grandTotal,
        // value : $scope.contract.grandTotal,
        discount : $scope.contract.discount,
        termsAndConditionTxts : tncsTxtArr.join('||'),
        heading : $scope.form.heading,
        pk :  $scope.contract.pk,
      }
      // if ($scope.form.mode == 'edit') {
      //   method = 'PATCH';
      //   url += $scope.contract.pk + '/'
      // }
      $http({method : method  , url :url , data : toSend }).
      then(function(response) {
        Flash.create('success' , 'Saved');

        $uibModalInstance.dismiss()

      })

    }


})

app.controller("businessManagement.marketing.canpaign.call.explore", function($scope, $http, Flash, $uibModal, $sce, $aside, $state, $rootScope) {


  $scope.fetchCampaignDetails = function(){
    $http({method : 'GET' , url : '/api/marketing/getCampaignStats/?id=' + $state.params.id  }).
    then(function(response){
      $scope.campaignStats = response.data;
    }, function(error){

    })
  }

  $scope.fetchCampaignDetails();

  $scope.createQuote = function(){
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.createQuote.html',
      size: 'xl',
      placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
            return $scope.userData
          }
      },
      controller: "businessManagement.marketing.createQuotataion",
    }).result.then(function() {
      // $scope.fetch()
    }, function(res) {
      // $scope.fetch()
    });
  }

  $scope.sendInfo = function(){
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.sendInfo.html',
      size: 'md',
      placement: 'right',
      backdrop: true,
      resolve: {
        data: function() {
            return $scope.userData
          }
      },
      controller: "businessManagement.marketing.sendInfo",
    }).result.then(function() {
      // $scope.fetch()
    }, function(res) {
      // $scope.fetch()
    });
  }

  $scope.newContact = function(indx) {
    console.log($scope.userData,'dffffffffffffffff',$scope.data[indx]);
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.newContact.html',
      size: 'lg',
      placement: 'left',
      backdrop: true,
      resolve: {
        data: function() {
          if (indx == undefined || indx == null) {
            return {name : $scope.userData.name , email : $scope.userData.email , mobile : $scope.userData.mobile ,pk : $scope.userData.pk , addrs : $scope.userData.addrs  , city : $scope.userData.city  , state : $scope.userData.state  , country : $scope.userData.country , pincode : $scope.userData.pincode , lat : $scope.userData.lat , lng : $scope.userData.lng, about : $scope.userData.about, source : $scope.userData.source, slot : $scope.userData.slot, date : $scope.userData.date,leadAdded:true, campaign :$scope.campaignItem.pk  }
          } else {
            return $scope.data[indx]
          }
        }
      },
      controller: "businessManagement.marketing.saveContacts",
    }).result.then(function() {
      $scope.fetch()
    }, function(res) {
      $scope.fetch()
    });
  }


  $scope.searchContact = function(query) {
    return $http.get('/api/marketing/contacts/?limit=10&search=' + query).
    then(function(response) {
      return response.data.results;
    })
  };


  $scope.email = function(contact) {
    $aside.open({
      templateUrl : '/static/ngTemplates/app.marketing.contact.email.html',
      placement: 'right',
      size: 'md',
      resolve: {
        contact : function() {
          return contact;
        },
      },
      backdrop : true,
      controller : function($scope , contact , $http) {
        $scope.contact = contact;


      }
    }).result.then(function(rea) {
      $scope.form.searchTxt = "";
    }, function(dis) {
      $scope.form.searchTxt = "";
    })
  }


  $scope.form = {searchTxt : ''}
  $scope.$watch('form.searchTxt' , function(newValue , oldValue) {
    if (typeof newValue == 'object') {
      $aside.open({
        templateUrl : '/static/ngTemplates/app.marketing.contact.modal.html',
        placement: 'right',
        size: 'xl',
        resolve: {
          contact : function() {
            return newValue;
          },
        },
        backdrop : true,
        controller : function($scope , contact , $http) {
          $scope.contact = contact;
          $scope.cmntTxt = "";
          $http({method : 'GET' , url : '/api/marketing/campaignLogs/?contact=' + contact.pk }).then(function(response) {
            $scope.logs = response.data;
          })

          $scope.postData = function(txt){
            var data = {typ : 'comment' , data : txt }
            data.contact = $scope.contact.pk;
            $http({
              method: 'POST',
              url: '/api/marketing/campaignLogs/',
              data: data
            }).
            then(function(response) {
              console.log(response.data);
              $scope.logs.push(response.data);
              $scope.cmntTxt = "";
            })
          }
        }
      }).result.then(function(rea) {
        $scope.form.searchTxt = "";
      }, function(dis) {
        $scope.form.searchTxt = "";
      })
    }
  })

  $scope.userDetails = function(){
    $scope.fetchCampaignDetails();
    if ($state.is('businessManagement.marketing.level')) {
      var url = '/api/marketing/getNextEntry/?level=' + $state.params.id
    }
    else{
      var url = '/api/marketing/getNextEntry/?id=' + $scope.data.pk
    }

    $http({
      method: 'GET',
      url:url
    }).then(function(response) {
      console.log(response.data,'9042309293902340902394');
      $scope.userData = response.data.contact.contact;
      $scope.logs = response.data.logs;
      $scope.campaignItem = response.data.contact;

      if ($scope.autoDial) {
        $rootScope.$broadcast("call", {type : 'call' , number : $scope.userData.mobile , source : 'campaign' , id : $scope.data.pk });
      }


    })
  }

  console.log($state,);
  if ($state.is('businessManagement.marketing.level')) {
    // $scope.level = $state.params.id
    // $http({method : 'GET' , url : '/api/marketing/campaignItem/?level=' + $scope.level +'&campaignId__lead=' +$scope.me.pk }).
    // then(function(response) {
    //   $scope.data = response.data.results;
    //   $scope.userDetails()
    // })
    $scope.userDetails()
  }
  else{
    $http({method : 'GET' , url : '/api/marketing/campaign/' + $state.params.id +'/'}).
    then(function(response) {
      $scope.data = response.data;
      $scope.userDetails()
    })
  }


  $scope.postData = function(data){
    console.log('qqqqqqqqqq',data);
    data.contact = $scope.userData.pk
    data.campaign = $scope.data.pk
    $http({
      method: 'POST',
      url: '/api/marketing/campaignLogs/',
      data: data
    }).
    then(function(response) {
      console.log(response.data);
      $scope.logs.push(response.data)
    })
  }

  $scope.waitingScreen = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.waiting.html',
      size: 'sm',
      backdrop: false,
      controller: function($scope , $uibModalInstance , $interval , $timeout) {
        $scope.timer = 5;
        $interval(function() {

          $scope.timer -= 1;

          if ($scope.timer <0) {
            $uibModalInstance.dismiss()
          }

        },1000)

        $scope.cancel = function() {
          $uibModalInstance.close()
        }


      },
    }).result.then(function() {
      console.log("cancel");
      $scope.autoDial = false;
    }, function(res) {
      // console.log("dismiss");
      $scope.createLog('leads')
      $scope.autoDial = true;
    });

  }
  $scope.autoDial = false;

  $scope.$on("campaignUpdate", function(evt, data) {
    console.log(data);
    if (data.id == $scope.data.pk) {
      $scope.waitingScreen()
    }

  });

  $scope.call = function(num) {
    $rootScope.$broadcast("call", {type : 'call' , number : num , source : 'campaign' , id : $scope.data.pk });
  }

  $scope.createLog = function(typ) {
    console.log('777777777', typ);

    if (typ == 'remaind') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.marketing.campaign.call.fallowupForm.html',
        size: 'lg',
        backdrop: true,
        resolve: {
          data: function() {
            return $scope.postData;
          },
          patchItem : function() {
            return $scope.patchItem
          }
        },
        controller: function($scope, $http, Flash, $uibModal, data, $uibModalInstance, patchItem) {
          $scope.postData = data;
          $scope.patchItem = patchItem;
          $scope.followupData = {followupDate : new Date(),data:''}

          $scope.submit = function(){
            console.log($scope.followupData.followupDate);
            if ($scope.followupData.data.length == 0) {
              Flash.create('warning','Please Mention Some Comment')
              return
            }
            var dataSend = {typ : 'followup',followupDate:$scope.followupData.followupDate,data:$scope.followupData.data}
            $scope.postData(dataSend)
            console.log($scope.followupData.level,'aaaaaaaaaaaaaaaaaaa');
            $scope.patchItem({attempted : true , followUp : true , followUpDate : $scope.followupData.followupDate, level : $scope.followupData.level })
            $uibModalInstance.dismiss()
          }
        },
      });
    }else {
      var dataSend = {}
      if (typ == 'call') {
        dataSend.typ = 'outbound'
        $scope.patchItem({attempted : true , attempt : $scope.campaignItem.attempt + 1 })
        $scope.campaignItem.attempt +=1 ;
      }else if (typ == 'skipped') {
        dataSend.typ = 'closed'
        $scope.patchItem({attempted : true , skipped : true })
      }else if (typ == 'leads') {
        dataSend.typ = 'converted'
        $scope.patchItem({attempted : true , status : 'interested' })

      }else if (typ == 'comment') {
        if ($scope.userData.commentData.length == 0) {
          Flash.create('warning','Please Mention Some Comment')
          return
        }
        dataSend.typ = 'comment'
        dataSend.data = $scope.userData.commentData
        $scope.userData.commentData = ''
      }
      $scope.postData(dataSend)
    }
  }


  $scope.patchItem = function(data) {
    $http({method : 'PATCH' , url : '/api/marketing/campaignItem/' + $scope.campaignItem.pk  + '/' , data : data}).
    then(function(response) {
      if (response.data.skipped || response.data.status == 'interested' || response.data.followUp) {
        $scope.userDetails();
      }
    })
  }


})


app.controller("businessManagement.marketing.sendInfo", function($scope, $state, $users, $stateParams, $http, Flash, data) {

$scope.data = data
$http({method : 'GET' , url : '/api/assets/assetAll/' }).
then(function(response) {
  $scope.allAssets = response.data
  $scope.data.asset = $scope.allAssets[0]
  // $scope.allAddons = $scope.form.asset.addons
})

$scope.send = function(typ){
  var data_send = {
    'mobile' : $scope.data.mobile,
    'email' : $scope.data.email,
    'typ' : typ
  }
  if (typ == 'cat' || typ == 'link') {
    data_send.asset = $scope.data.asset.pk
  }
  $http({method : 'POST' , url : '/api/assets/sendInfo/' , data:data_send}).
  then(function(response) {
    Flash.create('success' , 'Sent')
  })
}


})

app.controller("businessManagement.marketing.default", function($scope, $state, $users, $stateParams, $http, Flash) {


})

app.controller("businessManagement.marketing.contacts", function($scope, $state, $users, $stateParams, $http, Flash , $uibModal, $aside) {


  $scope.bulkUpload = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.uploadContacts.html',
      size: 'md',
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

  $scope.test = "dsadsadas"

  $scope.views = {showSourceContacts : function(source) {
    console.log('showing contacts');
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.list.html',
      size: 'xl',
      position : 'right',
      backdrop: true,
      resolve : {
        params : function() {
          return {type : 'source' , value : source}
        }
      },
      controller: function($scope, $http, Flash, $uibModal, $uibModalInstance , params) {

        $scope.delete = function(indx) {
          $http({method : 'DELETE' , url : '/api/marketing/contacts/' + $scope.data[indx].pk +'/'  }).
          then((function(indx) {
            return function(response) {
              $scope.data.splice(indx , 1);
            }
          })(indx))
        }


        $scope.params = params;
        $scope.searchTxt= ''
        $scope.close = function(){
          $uibModalInstance.dismiss()
        }
        $scope.form = {
          'exFile': emptyFile,
          'source':''
        }
        $scope.page = 0;

        $scope.fetch = function() {
          if ($scope.params.type == 'source') {
            query = 'source=' + $scope.params.value
          }
          $http({method : 'GET' , url : '/api/marketing/contacts/?' + query + '&limit=18&offset=' + $scope.page *18+'&search='+ $scope.searchTxt}).
          then(function(response) {
            $scope.data = response.data.results;
          })
        }

        $scope.fetch();

        $scope.next = function() {
          console.log("aaaaaaaaa");
          $scope.page += 1;
          $scope.fetch();
        }


        $scope.prev = function() {
          if ($scope.page >0) {
            $scope.page -= 1;
            $scope.fetch();
          }
        }



      },
    });






  }}


  $http({method : 'GET' , url : '/api/marketing/getCountries/'}).
  then(function(response) {
    $scope.countries = response.data;
    for (var i = 0; i < $scope.countries.length; i++) {
      $scope.countries[i].selected = false;
    }
    $scope.countries.sort(function(a, b) {
      return b.country__count - a.country__count;
    });
  })

  $scope.total = 0;
  $scope.data = {name : true , email : false , companyName : false , country : false , city : false , mobile : false , website : false , gmail : false, selectAll : false, verified : false , positiveResponse : false , negativeResponse : false , websiteVisit : false , chat : false , registered : false , customer : false}

  $scope.selectAll = function() {
    for (var i = 0; i < $scope.countries.length; i++) {
      $scope.countries[i].selected = $scope.data.selectAll;
    }
    $scope.resetOtherFilters();
  }

  $scope.showSourceContacts = function() {

  }

  $scope.resetOtherFilters = function() {
    // $scope.data = {name : false , email : false , companyName : false , country : false , city : false , mobile : false , website : false , gmail : false}
    $scope.tags = [];
  }

  $http({method : 'GET' , url : '/api/marketing/getSources/'}).
  then(function(response) {
    $scope.sources = response.data;
    for (var i = 0; i < $scope.sources.length; i++) {
      $scope.sources[i].selected = false;
    }
    $scope.sources.sort(function(a, b) {
      return b.source__count - a.source__count;
    });

  })

  $scope.tags = []

  $scope.$watch("data" , function(newValue , oldValue) {
    $scope.evaluateTotal();
    $scope.tags = []
  }, true)

  $scope.$watch("sources" , function(newValue , oldValue) {
    $scope.evaluateTotal();
    $scope.tags = []
  }, true)

  $scope.evaluateTotal = function() {
    if ($scope.tags.length == 0) {
      $scope.getTotal()
    }else{
      $scope.total = 0;
      for (var i = 0; i < $scope.tags.length; i++) {
        $scope.total += $scope.tags[i].tagsCount;
      }
    }
  }

  $scope.$watch('tags' , function(newValue , oldValue) {
    $scope.evaluateTotal()
  }, true)


  $scope.getTotal = function() {

    var filtersData = $scope.getFilterData();
    $http({method : 'GET' , url : '/api/marketing/getContactsCount/?filters=' + filtersData.filters + '&country=' + filtersData.countries + '&sources='+ filtersData.sources}).
    then(function(response) {
      $scope.total = response.data.total;
      $scope.campaignData = response.data.campaignData
    })

  }

  $scope.getFilterData = function() {
    var sources = "";

    for (var key in $scope.sources) {
        if ($scope.sources.hasOwnProperty(key)) {
          if ($scope.sources[key].selected) {
            sources += $scope.sources[key].source + ','
          }
        }
    }

    var countries = "";
    for (var key in $scope.countries) {
        if ($scope.countries.hasOwnProperty(key)) {
          if ($scope.countries[key].selected) {
            countries += $scope.countries[key].country + ','
          }
        }
    }

    var filters = "";
    for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          if ($scope.data[key]) {
            filters += key + ','
          }
        }
    }

    return {sources : sources , countries : countries , filters : filters}

  }





  $scope.getTagsSuggestions = function(query) {

    var filtersData = $scope.getFilterData()

    return $http.get('/api/marketing/tag/?limit=10&name__icontains=' + query + '&filters=' + filtersData.filters + '&country=' + filtersData.countries + '&sources='+ filtersData.sources ).then(function(response){

      var darr = response.data.results;
      for (var i = 0; i < darr.length; i++) {
        darr[i].name += ' ( ' + darr[i].tagsCount + ' )';
      }
      return darr;
    })
  }



  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          $scope.addTab({
            title: 'Edit Contact : ' + $scope.data.tableData[i].pk,
            cancel: true,
            app: 'editContact',
            data: {
              pk: target,
              index: i
            },
            active: true
          })
        } else if (action == 'delete') {
          $http({
            method: 'DELETE',
            url: '/api/marketing/contacts/' + target + '/'
          }).
          then(function(response) {
            Flash.create('success', 'Deleted');
            $scope.$broadcast('forceRefetch', {})
          })
        }else if (action == 'info') {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.marketing.contact.logDetailsPopup.html',
            size: 'xl',
            backdrop: true,
            resolve: {
              data: function() {
                return $scope.data.tableData[i];
              },
            },
            controller: function($scope, $http, Flash, $uibModal, data, $uibModalInstance) {
              $scope.contactData = data
              $http({
                method: 'GET',
                url: '/api/marketing/campaignLogs/?contact=' + $scope.contactData.pk,
              }).
              then(function(response) {
                $scope.contactData.logData = response.data
              })
              $scope.close = function(){
                $uibModalInstance.dismiss()
              }
            },
          });

        }
      }
    }

  }

  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index) {
    $scope.tabs.splice(index, 1)
  }

  $scope.addTab = function(input) {
    console.log(JSON.stringify(input));
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      } else {
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }

  $scope.campaignType = 'email';

  $scope.createCampaign = function(){

    //filters=name,mobile,&country=India,&sources=BNI,
    //$scope.tags



    // if ($scope.data.status == 'created') {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.marketing.campaign.callForm.html',
        size: 'lg',
        backdrop: true,
        resolve: {
          data: function() {
            return $scope.campaignData;
          },
          typ: function() {
            return $scope.campaignType;
          },
          filters : function() {
            var filtersData = $scope.getFilterData()
            return 'filters=' + filtersData.filters + '&country=' + filtersData.countries + '&sources='+ filtersData.sources;
          },
          tags : function() {
            return $scope.tags;
          }
        },
        controller: "businessManagement.marketing.canpaign.typPopUp",
      }).result.then(function () {

      }, function () {
        // $scope.userDetails()
        // console.log('doneeeeeeeeee');
        // console.log($scope.campaignData,$scope.data);
        // if ($scope.data.typ == 'email' || $scope.data.typ == 'sms') {
        //   for (var i = 0; i < $scope.campaignData.length; i++) {
        //     var data = {contact:$scope.campaignData[i].pk,campaign:$scope.data.pk}
        //     if ($scope.data.typ == 'email') {
        //       data.typ = 'emailSent'
        //     }else if ($scope.data.typ == 'sms') {
        //       data.typ = 'smsSent'
        //     }
        //     $http({
        //       method: 'POST',
        //       url: '/api/marketing/campaignLogs/',
        //       data: data
        //     }).
        //     then(function(response) {
        //       console.log(response.data);
        //     })
        //   }
        // }

      });

    // } else if ($scope.data.status == 'started') {
    //   $http({
    //     method: 'PATCH',
    //     url: '/api/marketing/campaign/' + $scope.data.pk + '/',
    //     data: {
    //       status: 'closed'
    //     }
    //   }).
    //   then(function(response) {
    //     console.log(response.data);
    //     $scope.data.status = response.data.status
    //   })
    //
    // }
  }


})

app.controller("businessManagement.marketing.bulkContacts", function($scope, $http, Flash) {

  $scope.bulkform = {
    source: '',
    fil: emptyFile,
    success: false,
    usrCount: 0
  }
  $scope.tagsList = []
  $scope.tagSearch = function(val) {
    return $http({
      method: 'GET',
      url: '/api/marketing/tag/?name__contains=' + val
    }).
    then(function(response) {
      return response.data;
    })
  }
  $scope.closeTags = function(idx) {
    $scope.tagsList.splice(idx, 1)
  }
  $scope.saveTags = function() {
    if (typeof $scope.form.tags == 'object') {
      for (var i = 0; i < $scope.tagsList.length; i++) {
        if ($scope.tagsList[i].pk == $scope.form.tags.pk) {
          Flash.create('warning', 'Already Added')
          return
        }
      }
      $scope.tagsList.push($scope.form.tags)
      $scope.form.tags = ''
    } else {
      if ($scope.form.tags.length > 0) {
        $http({
          method: 'POST',
          url: '/api/marketing/tag/',
          data: {
            name: $scope.form.tags
          }
        }).
        then(function(response) {
          $scope.tagsList.push(response.data)
          $scope.form.tags = ''
        })
      }
    }
  }

  $scope.upload = function() {
    console.log('aaaaaaaaa', $scope.bulkform);
    if ($scope.bulkform.source.length == 0) {
      Flash.create('warning', 'Source Is Required')
      return
    }
    if ($scope.bulkform.fil == emptyFile) {
      Flash.create('warning', 'No File Has Selected')
      return
    }
    var toSend = new FormData()
    toSend.append('source', $scope.bulkform.source);
    toSend.append('fil', $scope.bulkform.fil);
    if ($scope.tagsList.length > 0) {
      var tagsPk = []
      for (var i = 0; i < $scope.tagsList.length; i++) {
        tagsPk.push($scope.tagsList[i].pk)
      }
      toSend.append('tags', tagsPk)
    }
    $http({
      method: 'POST',
      url: '/api/marketing/bulkContacts/',
      data: toSend,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      $scope.bulkform.usrCount = response.data.count;
      $scope.bulkform.success = true;
    }, function(err) {
      console.log(err);
      Flash.create('danger', err.status + ' : ' + err.statusText);
    })
  }
});

app.controller("businessManagement.marketing.contacts.form", function($scope, $http, Flash) {

  $scope.resetForm = function() {
    $scope.form = {
      name: '',
      email: '',
      mobile: '',
      source: '',
      referenceId: '',
      tag: '',
      tagsList: [],
      pinCode: '',

    }
  }
  $scope.resetForm()

  if ($scope.tab != undefined) {
    console.log($scope.data.tableData[$scope.tab.data.index]);
    $scope.form = $scope.data.tableData[$scope.tab.data.index]
    $scope.form.tagsList = $scope.form.tags
    $scope.form.tag = ''
  }

  $scope.tagSearch = function(val) {
    return $http({
      method: 'GET',
      url: '/api/marketing/tag/?name__contains=' + val
    }).
    then(function(response) {
      return response.data;
    })
  }
  $scope.closeTags = function(idx) {
    $scope.form.tagsList.splice(idx, 1)
  }
  $scope.saveTags = function() {
    if (typeof $scope.form.tag == 'object') {
      for (var i = 0; i < $scope.form.tagsList.length; i++) {
        if ($scope.form.tagsList[i].pk == $scope.form.tag.pk) {
          Flash.create('warning', 'Already Added')
          return
        }
      }
      $scope.form.tagsList.push($scope.form.tag)
      $scope.form.tag = ''
    } else {
      if ($scope.form.tag.length > 0) {
        $http({
          method: 'POST',
          url: '/api/marketing/tag/',
          data: {
            name: $scope.form.tag
          }
        }).
        then(function(response) {
          $scope.form.tagsList.push(response.data)
          $scope.form.tag = ''
        })
      }
    }
  }

  $scope.createContact = function() {
    var f = $scope.form
    var method = 'POST'
    var url = '/api/marketing/contacts/'
    if (f.pk) {
      method = 'PATCH'
      url = url + f.pk + '/'
    }
    if ((f.name == null || f.name.length == 0) && (f.email == null || f.email.length == 0) && (f.mobile == null || f.mobile.length == 0) && (f.source == null || f.source.length == 0) && (f.referenceId == null || f.referenceId.length == 0)) {
      Flash.create('warning', 'Atleast One Field Is Required')
      return

    }
    console.log(f);
    var toSend = {}
    if (f.name != null && f.name.length > 0) {
      toSend.name = f.name
    }
    if (f.email != null && f.email.length > 0) {
      toSend.email = f.email
    }
    if (f.mobile != null && f.mobile.length > 0) {
      toSend.mobile = f.mobile
    }
    if (f.source != null && f.source.length > 0) {
      toSend.source = f.source
    }
    if (f.referenceId != null && f.referenceId.length > 0) {
      toSend.referenceId = f.referenceId
    }
    if (f.pinCode != null && f.pinCode.length > 0) {
      toSend.pinCode = f.pinCode
    }
    if (f.tagsList.length > 0) {
      var tagsPk = []
      for (var i = 0; i < f.tagsList.length; i++) {
        tagsPk.push(f.tagsList[i].pk)
      }
      toSend.tags = tagsPk
    }
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved')
      if (!f.pk) {
        $scope.resetForm()
      }
      console.log(response.data);
    }, function(err) {
      console.log(err);
      Flash.create('danger', err.status + ' : ' + err.statusText);
    })
  }


});


app.controller("businessManagement.marketing.canpaign.typPopUp", function($scope, $http,$sce, Flash, $uibModal, data, typ, $uibModalInstance, tags , filters) {

  $http({method : 'GET' , url : '/api/marketing/getemailTemplates/'   }).
  then(function(response) {
    $scope.templates = response.data;
  })
  $scope.allUsers = []
  $scope.teamSearch = function() {
  $http.get('/api/HR/team/' ).
    then(function(response) {
      $scope.allUsers =  response.data;
    })
  };
  $scope.teamSearch()

  $scope.getUsers = function() {
     $http.get('/api/HR/userSearch/').
    then(function(response) {
      $scope.selectUsers = response.data;
    })
  };
  $scope.getUsers()

  $scope.filters = filters;
  $scope.tags = tags;
  console.log('77777777', data, typ);
  $scope.data = data
  $scope.typ = typ
  $scope.form = {
    part: '',
    directions: '',
    msgBody: '',
    emailSubject: '',
    emailBody: '',
    partList: [],
    PartPk: [],
    name:'',
    emailTemplate : '',
    team : '',
    lead:''
  }
  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.addParticipants = function() {
    console.log($scope.form.part);
    for (var i = 0; i < $scope.form.PartPk.length; i++) {
      if ($scope.form.PartPk[i] == $scope.form.part.pk) {
        Flash.create('warning', 'This User Has Already Added')
        return
      }
    }
    $scope.form.partList.push($scope.form.part)
    $scope.form.PartPk.push($scope.form.part.pk)
    $scope.form.part = ''
  }
  $scope.closeUser = function(idx) {
    $scope.form.partList.splice(idx, 1)
    $scope.form.PartPk.splice(idx, 1)
  }
  $scope.submit = function() {
    if ($scope.form.name == 0) {
      Flash.create('warning', 'Name Is Required')
      return
    }
    var contacts = []
    for (var i = 0; i < $scope.data.length; i++) {
      contacts.push($scope.data[i].pk)
    }
    var toSend = {
      logs:'create',
      status: 'started',
      typ: $scope.typ,
      name : $scope.form.name,
      contacts : contacts
    }

    if ($scope.typ == 'email') {
      if ($scope.form.emailSubject.length == 0) {
        Flash.create('warning', 'Email Subject Is Required')
        return
      }
      if ($scope.form.emailBody.length == 0 && $scope.form.emailTemplate.length == 0)  {
        Flash.create('warning', 'Email Content Is Required')
        return
      }


      if ($scope.form.emailTemplate.length > 0 ) {
        toSend.emailTemplate = $scope.form.emailTemplate;
      }else{
        toSend.emailBody = $scope.form.emailBody;
      }

      toSend.limitPerDay = $scope.form.limitPerDay;

      toSend.emailSubject = $scope.form.emailSubject
    } else if ($scope.typ == 'sms') {
      if ($scope.form.msgBody.length == 0) {
        Flash.create('warning', 'Message Is Required')
        return
      }
      toSend.msgBody = $scope.form.msgBody
    } else {
      if ($scope.form.directions.length == 0) {
        Flash.create('warning', 'Directions Is Required')
        return
      }
      toSend.directions = $scope.form.directions
      // if ($scope.form.PartPk.length > 0) {
      //   toSend.participants = $scope.form.PartPk
      // }
      console.log($scope.form.team ,'aaaaaaaaaaaaaaaaaaa');
      if (typeof $scope.form.team == 'object') {
        toSend.team = $scope.form.team.pk
      }
      if (typeof $scope.form.lead == 'object') {
        toSend.lead = $scope.form.lead.pk
      }
    }
    var tags = [];
    for (var i = 0; i < $scope.tags.length; i++) {
      tags.push($scope.tags[i].pk)
    }
    toSend.tags = tags;
    $http({
      method: 'POST',
      url: '/api/marketing/addCampaign/' ,
      data: toSend
    }).
    then(function(response) {
      console.log(response.data);
      // $scope.data[i].status = response.data.status
      // $scope.data[i].typ = response.data.typ
      // $scope.data[i].directions = $sce.trustAsHtml(response.data.directions);
      $uibModalInstance.dismiss();
      Flash.create('success', 'Submitted')
    })
  }
})
