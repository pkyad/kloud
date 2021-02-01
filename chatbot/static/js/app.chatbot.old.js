app.config(function($stateProvider) {

  $stateProvider.state('businessManagement.chatbot', {
    url: "/chatbot",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.chatbot.html',
        controller: 'businessManagement.chatbot',
      },

    }
  }).state('businessManagement.chatbot.intents', {
    url: "/intents",
    templateUrl: '/static/ngTemplates/app.intents.html',
    controller: 'businessManagement.intents',

  }).state('businessManagement.chatbot.faq', {
    url: "/faq",
    templateUrl: '/static/ngTemplates/app.faq.html',
    controller: 'businessManagement.faq',

  })
});

app.controller("businessManagement.chatbot", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside, $timeout) {
  if ($state.is('businessManagement.chatbot')) {
    $state.go('businessManagement.chatbot.intents')
  }
})
app.controller("businessManagement.intents", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside, $timeout) {

  // $scope.compDetails = $scope.tab.data
  // console.log($scope.compDetails , "comp details");

  $scope.searchTxt = '';

  $scope.page = 0;
  $scope.next = function() {
    $scope.page += 1;
    $scope.fetchIntents();
  }
  $scope.prev = function() {
    if ($scope.page == 0) {
      return;
    }
    $scope.page -= 1;
    $scope.fetchIntents();
  }


  $scope.IntentMaster = [];

  $scope.fetchIntents = function() {
    var url = '/api/chatbot/intentsLite/?parent_none';

    if ($scope.searchTxt.length > 0) {
      url += '&name__icontains=' + $scope.searchTxt;
    }

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.IntentMaster = response.data;
      if (response.data.length == 0 && $scope.page == 0) {
        $http({
          method: 'POST',
          url: '/api/chatbot/intentView/0/',
          data: {
            auto_response: 'Opps...  I could not understand',
            type: 'FAQ',
            name: 'Default Fallback Intent',
            newx: 100,
            newy: 100,
            blockType: 'start',
            color: 'rgb(61, 185, 74)',
            connections: [{
              callbackName: 'success'
            }]
          }
        }).
        then(function(response) {
          response.data.pk = response.data.id;
          $scope.IntentMaster.push(response.data);
        })
      } else {

      }


    })

  }


  $http({
    method: 'GET',
    url: '/api/chatbot/gallery/'
  }).then(function(response) {
    $scope.gallery = response.data;
  })

  $scope.importIntent = function(file) {
    $http({
      method: 'GET',
      url: '/api/chatbot/cloneGallery/?file=' + file
    }).then(function(response) {
      $scope.fetchIntents();
      window.open('/intentDesigner/' + response.data.key + '/?cloned')
    })
  }


  var customerpk = CUSTOMER_PK

  $http({
    method: 'GET',
    url: '/api/organization/divisions/' + customerpk+'/'
  }).then(function(res) {
    $scope.compDetails = res.data
    $scope.fetchIntents()
  })


  $scope.resetForm = function() {
    $scope.form = {
      name: "",
      description: "",
      auto_response: "",
      context_key: "",
      rule: "process|extract|external",
      mobile_count: 0,
      number_count: 0,
      email_count: 0,
      person_count: 0,
      money_count: 0,
      location_count: 0,
      percent_count: 0,
      dates_count: 0,
      type: "process",
      failResponse: "",
      nodeResponse: "",
      externalProcessType: "REST",
      endpoint: "",
      method: "",
      authentication: "",
      custom_process_code: "",
      mode: 'create',
      input_vatiations: [],
      action_intent: [],
      select_intent: [],
      start_intent: []
    }
  }

  $scope.resetForm();

  $scope.delete = function(indx, pk) {
    $scope.IntentMaster.splice(indx, 1);
    $http({
      method: 'DELETE',
      url: '/api/chatbot/intents/' + pk + '/'
    }).
    then(function(response) {

    })
  }

  $scope.editIntent = function(indx) {


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.intents.form.modal.html',
      size: 'sm',
      backdrop: true,
      placement: 'right',
      resolve: {
        intent: function() {
          return $scope.IntentMaster[indx]
        }
      },
      controller: function($scope, $http, $uibModalInstance, intent) {
        $scope.form = intent;

        $timeout(function() {
          $('#intentName').focus();
        }, 300)

        $scope.save = function() {
          if ($scope.form.name.length == 0) {
            Flash.create('danger', 'Please enter a name')
            return;
          }

          $http({
            method: 'PATCH',
            url: '/api/chatbot/intents/' + $scope.form.pk + '/',
            data: {
              name: $scope.form.name
            }
          }).
          then(function(response) {
            $uibModalInstance.dismiss();
          })
        }
      },
    })

  }


  $scope.newIntentsForm = function(typ, intentsPK) {
    if (typ == 'create') {

      console.log(typ, 'llllllllllllll');
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.intents.form.modal.html',
        size: 'sm',
        backdrop: true,
        placement: 'right',
        controller: function($scope, $http, $uibModalInstance) {
          $scope.form = {
            mode: 'create',
            name: ''
          }

          $timeout(function() {
            $('#intentName').focus();
          }, 300)


          $scope.save = function(response) {

            if ($scope.form.name.length == 0) {
              Flash.create('danger', 'Please enter a name')
              return;
            }

            $http({
              method: 'POST',
              url: '/api/chatbot/intentView/0/',
              data: {
                name: $scope.form.name,
                newx: 100,
                newy: 100,
                blockType: 'start',
                color: 'rgb(61, 185, 74)',
                connections: [{
                  callbackName: 'success'
                }]
              }
            }).
            then(function(response) {
              $uibModalInstance.dismiss();
            })
          }
        },
      }).result.then(function() {}, function(res) {
        $scope.fetchIntents()
      })

    } else {
      window.open('/intentDesigner/' + intentsPK + '/')
    }


  }

});


app.controller("businessManagement.faq", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside , $timeout) {

  // $scope.compDetails = $scope.tab.data
  //
  // console.log($scope.compDetails);

  $scope.createNew = function() {

    if ($scope.form.input_vatiations.length == 0) {
      Flash.create('warning' , 'Please enter at least one user question' );
      return;
    }

    if ($scope.form.response.length == 0) {
      Flash.create('warning' , 'Please enter bot response')
      return;
    }

    var toSend = {
      company : $scope.compDetails.pk,
      response : $scope.form.response,
      input_vatiations_arr : $scope.form.input_vatiations
    }


    console.log(toSend);
    $http({method : 'POST', url : '/api/chatbot/faq/' , data : toSend  }).
    then(function(response) {
      $scope.FAQMaster.unshift(response.data);
      $scope.form = {
        response : '',
        input_vatiations : [],
        newInput : ''
      }
      $scope.showWelcome = false;
    })


  }


  $scope.saveInput = function(input, indx , inpIndx) {

    if (indx == -1) {
      if ($scope.form.input_vatiations[inpIndx].txt.length == 0  ) {
        $scope.form.input_vatiations.splice(inpIndx , 1)
      }
      return;
    }


    var url = '/api/chatbot/faqInpVariations/' + input.pk +'/'
    method = 'PATCH';
    if (input.txt.length == 0) {
      method = 'DELETE';
    }

    $http({method : method , url : url , data : input}).
    then((function(indx, input) {
      return function(response) {
        for (var i = 0; i < $scope.FAQMaster[indx].input_vatiations.length; i++) {
          if ($scope.FAQMaster[indx].input_vatiations[i].pk == input.pk  ) {
            $scope.FAQMaster[indx].input_vatiations.splice(i , 1)
          }
        }
      }
    })(indx , input))

  }

  $scope.form = {
    response : '',
    input_vatiations : [],
    newInput : ''
  }
  $scope.addNewInput = function(indx) {
    if (indx == -1) {
      if ($scope.form.newInput.length == 0) {
        return;
      }
      $scope.form.input_vatiations.push({txt : $scope.form.newInput});
      $scope.form.newInput = '';
    }else {
      if ($scope.FAQMaster[indx].newInput.length == 0) {
        return;
      }
      var toSend = {
        txt : $scope.FAQMaster[indx].newInput,
        parent: $scope.FAQMaster[indx].pk ,
      }
      $http({method : 'POST' , url : '/api/chatbot/faqInpVariations/' , data : toSend}).
      then((function(indx) {
        return function(response) {
          $scope.FAQMaster[indx].input_vatiations.push(response.data);
        }
      })(indx))
      $scope.FAQMaster[indx].newInput = '';
    }
  }

  $scope.saveFaq = function(faq) {

    $http({method : 'PATCH' , url : '/api/chatbot/faq/' + faq.pk +'/' , data : faq }).
    then(function(response) {

    })

  }

  $scope.deleteFaq = function(index) {
    $http({method : 'DELETE' , url : '/api/chatbot/faq/' + $scope.FAQMaster[index].pk +'/' }).
    then((function(index) {
      return function(response) {
        $scope.FAQMaster.splice(index , 1);
      }
    })(index))
  }


  $scope.page = 0;
  $scope.next = function() {
    $scope.page += 1;
    $scope.fetchFAQs();
  }
  $scope.prev = function() {
    if ($scope.page == 0) {
      return;
    }
    $scope.page -= 1;
    $scope.fetchFAQs();
  }

  $scope.searchText = "";
  $scope.FAQMaster = [];

  $scope.fetchFAQs = function() {
    var url = '/api/chatbot/faq/?company='+ $scope.compDetails.pk +'&limit=15&offset=' + 15 * $scope.page;
    if ($scope.searchText.length > 0) {
      url += '&input_vatiations__txt__icontains='+ $scope.searchText
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.FAQMaster = response.data.results;
      if ($scope.page == 0 && $scope.FAQMaster.length == 0) {
        $scope.showForm = true;
        $scope.showWelcome = true;
      }
    })

  }
  var customerpk= CUSTOMER_PK
  $http({
    method: 'GET',
    url: '/api/organization/divisions/'+customerpk+'/'
  }).then(function(response) {
    // $scope.services = response.data
    $scope.compDetails = response.data
    // $scope.setActiveService($scope.activeService)
    $scope.fetchFAQs()
    // $scope.fetchAll()
  })


})
