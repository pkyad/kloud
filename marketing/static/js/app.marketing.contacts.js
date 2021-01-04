app.controller("businessManagement.marketing.contacts", function($scope, $state, $users, $stateParams, $http, Flash , $uibModal, $aside) {


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
          'source':'',
          'dataType':'',
          'priority':'',
        }
        $scope.uploading = false
        $scope.postFile = function(){
          var toSend = new FormData()
          if ($scope.form.exFile == emptyFile) {
            Flash.create('warning' , 'No file selected')
            return;
          }
          if ($scope.form.source.length > 0) {
            Flash.create('warning' , 'kindly enter source name.')
            return;
          }
          if ($scope.form.dataType.length > 0) {
            Flash.create('warning' , 'kindly select data type.')
            return;
          }
          if ($scope.form.priority.length > 0) {
            Flash.create('warning' , 'kindly select priority.')
            return;
          }
          toSend.append('exFile', $scope.form.exFile);
          toSend.append('source', $scope.form.source);
          toSend.append('dataType', $scope.form.dataType);
          toSend.append('priority', $scope.form.priority);
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

    return $http.get('/api/marketing/tag/?filter=&limit=10&name__icontains=' + query + '&filters=' + filtersData.filters + '&country=' + filtersData.countries + '&sources='+ filtersData.sources ).then(function(response){

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
    emailTemplate : ''
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
      if ($scope.form.PartPk.length > 0) {
        toSend.participants = $scope.form.PartPk
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
