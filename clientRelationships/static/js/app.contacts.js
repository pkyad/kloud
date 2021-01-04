
app.controller("businessManagement.clientRelationships.contacts", function($scope, $state, $users, $stateParams, $http, Flash,$uibModal) {

  $scope.data = {
    tableData: []
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.clientRelationships.contacts.item.html',
  }, ];

  var multiselectOptions = [{
    icon: 'fa fa-plus',
    text: 'Import'
  }, ];

  $scope.config = {
    views: views,
    url: '/api/clientRelationships/contact/',
    searchField: 'name or company name',
    deletable: true,
    filterSearch : true,
    itemsNumPerView: [12, 24, 48],
    multiselectOptions :multiselectOptions,
  }


  $scope.tableAction = function(target, action, mode) {
    console.log(target, action, mode);
    console.log($scope.data.tableData);
    if (action == 'Import') {

    }


    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].pk == parseInt(target)) {
        if (action == 'edit') {
          var title = 'Edit Contact :';
          var appType = 'contactEditor';
        } else if (action == 'details') {
          var title = 'Details :';
          var appType = 'contactExplorer';
        }


        console.log({
          title: title + $scope.data.tableData[i].name,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        });


        $scope.addTab({
          title: title + $scope.data.tableData[i].name,
          cancel: true,
          app: appType,
          data: {
            pk: target,
            index: i
          },
          active: true
        })
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



  $scope.$on('exploreContact', function(event, input) {

    $scope.addTab({
    "title": "Details :" + input.contact.name,
      "cancel": true,
      "app": "contactExplorer",
      "data": {
        "pk": input.contact.pk
      },
      "active": true
    })
  });


  $scope.$on('editContact', function(event, input) {

    $scope.addTab({
      "title": "Edit :" + input.contact.name,
      "cancel": true,
      "app": "contactEditor",
      "data": {
        "pk": input.contact.pk,
        contact : input.contact
      },
      "active": true
    })
  });

  $scope.$on('getContact', function(event, input) {
    $aside.open({
      templateUrl : '/static/ngTemplates/app.clientRelationships.contact.explore.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        contact : function() {
          return input.contact.pk;
        },
      },
      backdrop : false,
      controller : 'businessManagement.clientRelationships.contacts.exploreModal'
    }).result.then(function(rea) {
    }, function(dis) {
    })
  });


  $scope.contactForm ={
    search:''
  }
  $scope.limit= 11
  $scope.offset= 0
  $scope.getallContacts = function(){
    var url = '/api/clientRelationships/contact/?limit='+$scope.limit+'&offset='+$scope.offset
    if ($scope.contactForm.search.length > 0 ) {
      url += '&search='+$scope.contactForm.search
    }
    $http({
      method:'GET',
      url:url
    }).then(function(response){
      $scope.contactList = response.data.results
      $scope.contactPrev = response.data.previous
      $scope.contactNext = response.data.next
    })
  }
$scope.getallContacts ()

$scope.previous = function(){
  if ($scope.contactPrev != null) {
    $scope.offset -= $scope.limit
    $scope.getallContacts ()

  }
}
$scope.next = function(){
  if ($scope.contactNext != null) {
    $scope.offset += $scope.limit
    $scope.getallContacts ()

  }
}

$scope.uploadContactList = function(){
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.clientRelationships.contact.bulkUpload.html',
    size: 'md',
    backdrop: false,
    controller: function($scope ,$uibModalInstance,$rootScope){
      $scope.close = function(){
        $uibModalInstance.close();
      }
      $scope.form = {xlFile : emptyFile , success : false , usrCount : 0}
      $scope.upload = function() {
        if ($scope.form.xlFile == emptyFile) {
          Flash.create('warning' , 'No file selected')
        }

        var fd = new FormData()
        fd.append('xl' , $scope.form.xlFile);

        $http({
          method: 'POST',
          url: '/api/clientRelationships/bulkContactsCreation/',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {
          Flash.create('success' , 'Created');
          $scope.form.usrCount = response.data.count;
          $scope.form.success = true;
        })

      }
    },
  }).result.then(function() {


  }, function() {

  });
}

$scope.viewContact =function(data){
  $scope.addTab({
    title: 'View Details:'+data.name,
    cancel: true,
    app: 'contactExplorer',
    data: data,
    active: true
  })
}
$scope.editContact = function(data) {
  $scope.$emit('editContact' , {contact : data})
}
// $scope.editContact =function(data){
//   $scope.addTab({
//     title: 'Edit Contact:'+data.name,
//     cancel: true,
//     app: 'contactEditor',
//     data: data,
//     active: true
//   })
//
// }

})

app.controller("businessManagement.clientRelationships.contacts.item", function($scope, $state, $users, $stateParams, $http, Flash) {






});

app.controller("businessManagement.clientRelationships.contacts.exploreModal", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal, contact, $uibModalInstance) {


  $scope.editIcon = false
  $http({
    method: 'GET',
    url: '/api/clientRelationships/contact/' + contact + '/'
  }).
  then(function(response) {
    $scope.contact = response.data;
    $scope.fetchCoworkers();
  })




  $scope.changeStatus = function(status , indx) {
    $scope.contracts[indx].status = status;

    if (status == 'billed') {
      $uibModal.open({
        template: '<div style="padding:30px;"><div class="form-group"><label>Due Date</label>'+
            '<div class="input-group" >'+
                '<input type="text" class="form-control" show-weeks="false" uib-datepicker-popup="dd-MMMM-yyyy" ng-model="contract.dueDate" is-open="status.opened" />' +
                '<span class="input-group-btn">'+
                  '<button type="button" class="btn btn-default" ng-click="status.opened = true;"><i class="glyphicon glyphicon-calendar"></i></button>'+
                '</span>'+
              '</div><p class="help-block">Auto set based on Deal due period.</p>'+
          '</div></div>',
        size: 'sm',
        backdrop : true,
        resolve : {
          contract : function() {
            return $scope.contracts[indx];
          },
        },
        controller: function($scope , contract){
          $scope.contract = contract;
          var dueDate = new Date();
          dueDate.setDate(dueDate.getDate());
          if ($scope.contract.dueDate == null) {
            $scope.contract.dueDate = dueDate;
          }
          // $scope.deal = deal;
        },
      }).result.then(function () {

      }, (function(indx, status) {
        return function () {
          console.log(indx);
          console.log($scope.contracts[indx].dueDate);

          $http({method : 'PATCH' , url : '/api/clientRelationships/contract/' + $scope.contracts[indx].pk + '/' , data : {status : status , dueDate : $scope.contracts[indx].dueDate.toISOString().substring(0, 10) }}).
          then(function(response) {
            $http({method : 'GET' , url : '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk}).
            then(function(response) {
              Flash.create('success' , 'Saved')
            }, function(err) {
              Flash.create('danger' , 'Error occured')
            })
          })



        }
      })(indx, status));



    }else if (status == 'dueElapsed') {

      var sacCode = 998311;
      var c = $scope.contracts[indx];
      for (var i = 0; i < c.data.length; i++) {
        if (c.data[i].taxCode == sacCode) {
          return;
        }
      }
      // var fineAmount = $scope.deal.contracts[indx].value * $scope.deal.duePenalty*(1/100)
      var fineAmount = $scope.deal.contracts[indx].value
      $http({method : 'GET' , url : '/api/clientRelationships/productMeta/?code='+ sacCode}).
      then((function(indx) {
        return function(response) {
          var quoteInEditor = $scope.contracts[indx]
          var productMeta = response.data[0];
          var subTotal = fineAmount*(1+productMeta.taxRate/100)
          quoteInEditor.data.push({currency : 'INR' , type : 'onetime' , tax: productMeta.taxRate, desc : 'Late payment processing charges' , rate : fineAmount , quantity : 1, taxCode : productMeta.code , totalTax : fineAmount*(productMeta.taxRate/100), subtotal : subTotal })

          quoteInEditor.value += subTotal
          var url = '/api/clientRelationships/contract/' + quoteInEditor.pk + '/'
          var method = 'PATCH'
          var dataToSend = {contact : $scope.contact.pk , data : JSON.stringify(quoteInEditor.data) , value : quoteInEditor.value};
          $http({method : method , url : url , data : dataToSend}).
          then(function(response) {
            $http({method : 'GET' , url : '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk}).
            then(function(response) {
              Flash.create('success' , 'Saved')
            }, function(err) {
              Flash.create('error' , 'Error occured')
            })
          })
        }
      })(indx))
    }else {
      $http({method : 'PATCH' , url : '/api/clientRelationships/contract/' + $scope.contracts[indx].pk + '/' , data : {status : status}}).
      then(function(response) {

      })

    }


  }

  // $scope.deleteContact = function(){
  //   $http({method : 'DELETE' , url : '/api/clientRelationships/contact/' + $scope.contact.pk}).
  //   then(function(response) {
  //     Flash.create('success' , 'Deleted Successfully!')
  //     $scope.tabs.splice($scope.tab.data.index,1)
  //     $scope.$broadcast('forceRefetch',)
  //   });
  // }

  $scope.createQuote = function(){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        deal : function() {
          return {pk:'',company:{},contracts:{},contacts:{}};
        },
        contact : function() {
          return $scope.contact;
        },
        mailer : function() {
          return true
        },
      },
      backdrop : false,
      controller : 'businessManagement.clientRelationships.opportunities.quote'
    }).result.then(function(rea) {
      $scope.fetchContracts()
    }, function(dis) {
      $scope.fetchContracts()
    })
  }

  $scope.editQuote = function(indx){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      backdrop : false,
      resolve: {
        contract: function() {
          return $scope.contracts[indx]
        },
        mailer : function() {
          return true
        },
      },
      controller : 'businessManagement.clientRelationships.opportunities.quoteEdit'
    }).result.then(function(rea) {
      $scope.retriveTimeline()
      $scope.fetchContracts()
    }, function(dis) {
      $scope.retriveTimeline()
      $scope.fetchContracts()
    })
  }








  $scope.sendto = ''
  $scope.sendcc = ''
  $scope.sendEmail = function() {
    var count = 0
    var cc = []
    console.log("herrrrrrrrrrrrrr");
    if ($scope.form.cc.length>0) {
      for (var i = 0; i < $scope.form.cc.length; i++) {
        $http({
          method: 'GET',
          url: '/api/HR/userSearch/'+$scope.form.cc[i]
        }).
        then(function(response) {
          count+=1
          $scope.tempCC = response.data.email +','
          $scope.sendcc = $scope.sendcc + $scope.tempCC
          if (count==$scope.form.cc.length) {
            $scope.sendcc = $scope.sendcc.slice(0, -1);
            $scope.sendto = ''
            // $scope.tempTo = $scope.data.email + ','
            // $scope.sendto = $scope.tempTo
            $scope.tempTo = $scope.contact.email + ','
            $scope.sendto = $scope.tempTo
            if ($scope.deal!=undefined) {
              for (var i = 0; i < $scope.deal.contacts.length; i++) {
                $scope.tempTo = $scope.deal.contacts[i].email + ','
                $scope.sendto = $scope.tempTo
              }
            }
            $scope.sendto = $scope.sendto.slice(0, -1);

            $scope.attachmentTemplates = ''
            if ($scope.form.added != null) {
              for (var i = 0; i < $scope.form.added.length; i++) {
                console.log($scope.form.added[i].pk);
                $scope.tempTemplate = $scope.form.added[i].pk + ','
                $scope.attachmentTemplates = $scope.attachmentTemplates+ $scope.tempTemplate
              }
              $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
            }
            toSend = {
              to:$scope.sendto,
              cc:$scope.sendcc,
              subject:$scope.form.emailSubject,
              body:$scope.form.emailBody,
              attachmentTemplates:$scope.attachmentTemplates
            }
            $http({method : 'POST' , url : '/api/mail/send/' , data : toSend}).
            then(function() {
              Flash.create('success', 'Email sent successfully');
              var data = {"subject":$scope.form.emailSubject}
              var finalData = JSON.stringify(data)
              var dataToSend = {
                typ : 'mail',
                contact:$scope.contact.pk,
                notes:$scope.form.emailBody,
                data:finalData,
              };

              $http({method : 'POST' , url : '/api/clientRelationships/activity/' , data : dataToSend }).
              then(function(response) {
                $scope.resetEmailForm();
              })

            })
          }
        })
      }
    }
      else{
        console.log("herrrrrrrrrrrrrr");
              $scope.sendto = ''
              // $scope.tempTo = $scope.data.email + ','
              // $scope.sendto = $scope.tempTo
              $scope.tempTo = $scope.contact.email + ','
              $scope.sendto = $scope.tempTo
              if ($scope.deal!=undefined) {
                for (var i = 0; i < $scope.deal.contacts.length; i++) {
                  $scope.tempTo = $scope.deal.contacts[i].email + ','
                  $scope.sendto = $scope.tempTo
                }
              }
              $scope.sendto = $scope.sendto.slice(0, -1);
              $scope.attachmentTemplates = ''
              if ($scope.form.added != null) {
                for (var i = 0; i < $scope.form.added.length; i++) {
                  console.log($scope.form.added[i].pk);
                  $scope.tempTemplate = $scope.form.added[i].pk + ','
                  $scope.attachmentTemplates = $scope.attachmentTemplates+ $scope.tempTemplate
                }
                $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
              }
              toSend = {
                to:$scope.sendto,
                subject:$scope.form.emailSubject,
                body:$scope.form.emailBody,
                attachmentTemplates:$scope.attachmentTemplates
              }
              $http({method : 'POST' , url : '/api/mail/send/' , data : toSend}).
              then(function() {
                Flash.create('success', 'Email sent successfully');
                var data = {"subject":$scope.form.emailSubject}
                var finalData = JSON.stringify(data)
                var dataToSend = {
                  typ : 'mail',
                  contact:$scope.contact.pk,
                  notes:$scope.form.emailBody,
                  data:finalData,
                };

                $http({method : 'POST' , url : '/api/clientRelationships/activity/' , data : dataToSend }).
                then(function(response) {
                  $scope.resetEmailForm();
                })

              })
      }


  }
  $scope.editContact = function() {
    console.log($scope.contact,$scope.tab.data,"099000909");
    $scope.$emit('editContact' , {contact : $scope.contact})
  }

  $scope.close = function(){
    $uibModalInstance.close();
  }

  // if ($scope.data != undefined) {
  //   $scope.contact = $scope.data.tableData[$scope.tab.data.index]
  //
  //
  // }
  console.log(contact,'llllllllllllllllllll');

  $scope.disableNext = false;
  $scope.pageNo = 0;

  $scope.cleanCalendarEntry = function(data) {
    var cleaned = []
    for (var j = 0; j < data.clients.length; j++) {
      if (data.clients[j].pk != $scope.contact.pk) {
        cleaned.push(data.clients[j]);
      }
    }
    data.clients = cleaned;
    return data;
  }

  $scope.fetchCalendarEnteries = function() {
    $http({
      method: 'GET',
      url: '/api/PIM/calendar/?originator=CRM&clients__in=[' + $scope.contact.pk + ']'
    }).
    then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        response.data[i] = $scope.cleanCalendarEntry(response.data[i]);
      }
      $scope.calendar = response.data;
      for (var i = 0; i < $scope.calendar.length; i++) {
        $scope.calendar[i].when = new Date($scope.calendar[i].when);
        $scope.calendar[i].newDate = false;
        if (i < $scope.calendar.length - 1) {
          if ($scope.calendar[i].when.toDateString() != new Date($scope.calendar[i + 1].when).toDateString()) {
            $scope.calendar[i].newDate = true;
            if ($scope.calendar[i].when.toDateString() == new Date().toDateString()) {
              $scope.calendar[i].today = true;
            }
          }
        }
      }
    })
  }

  $scope.resetTaskEditor = function() {
    var dummyDate = new Date()
    $scope.taskEditor = {
      otherCRMUsers: [],
      details: ''
    };
    $scope.taskEditor.when = new Date(dummyDate.getFullYear(), dummyDate.getMonth(), dummyDate.getDate(), 23, 59, 59); // 2013-07-30 23:59:59
  }
  $scope.resetTaskEditor();
  $scope.saveTask = function() {
    if ($scope.taskEditor.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [$scope.contact.pk];
    for (var i = 0; i < $scope.taskEditor.otherCRMUsers.length; i++) {
      crmUsers.push($scope.taskEditor.otherCRMUsers[i].pk);
    }

    var dataToSend = {
      when: $scope.taskEditor.when,
      text: $scope.taskEditor.details,
      eventType: 'Reminder',
      originator: 'CRM'
    }
    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetTaskEditor();
    });
  }

  $scope.markComplete = function(pk) {
    for (var i = 0; i < $scope.calendar.length; i++) {
      if ($scope.calendar[i].pk == pk) {
        $scope.calendar[i].completed = true;
        $http({
          method: 'PATCH',
          url: '/api/PIM/calendar/' + pk + '/',
          data: {
            completed: true
          }
        }).
        then(function(response) {
          Flash.create('success', 'Updated');
        }, function(err) {
          Flash.create('danger', 'Error while updating');
        })
      }
    }
  }

  $scope.nextPage = function() {
    if ($scope.disableNext) {
      return;
    }
    $scope.pageNo += 1;
    $scope.retriveTimeline();
  }

  $scope.prevPage = function() {
    if ($scope.pageNo == 0) {
      return;
    }
    $scope.pageNo -= 1;
    $scope.retriveTimeline();
  }

  $scope.noteEditor = {
    text: '',
    doc: emptyFile
  };
  $scope.timelineItems = [];

  $scope.retriveTimeline = function() {
    console.log($scope.pageNo,'aaaaaaaa');
    $http({
      method: 'GET',
      url: '/api/clientRelationships/activity/?contact=' + $scope.contact.pk + '&limit=5&offset=' + $scope.pageNo * 5
    }).
    then(function(response) {
      $scope.timelineItems = response.data.results;
      if ($scope.timelineItems.length == 0 && $scope.pageNo != 0) {
        $scope.prevPage();
      }
      $scope.disableNext = response.data.next == null;
      $scope.analyzeTimeline();
    })
  }

  $scope.analyzeTimeline = function() {
    for (var i = 0; i < $scope.timelineItems.length; i++) {
      $scope.timelineItems[i].created = new Date($scope.timelineItems[i].created);
      if (i < $scope.timelineItems.length - 1 && $scope.timelineItems[i].created.getMonth() != new Date($scope.timelineItems[i + 1].created).getMonth()) {
        $scope.timelineItems[i + 1].newMonth = true;
      }
    }
  }

  $scope.saveNote = function() {
    console.log("will save");

    var fd = new FormData();
    fd.append('typ', 'note');
    fd.append('data', $scope.noteEditor.text);
    fd.append('contact', $scope.contact.pk);

    if ($scope.noteEditor.doc != emptyFile) {
      fd.append('doc', $scope.noteEditor.doc);
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      Flash.create('success', 'Saved');
      $scope.noteEditor.text = '';
      $scope.noteEditor.doc = emptyFile;
    })
  }

  $scope.sortedFeeds = [{
      type: 'note'
    },
    {
      type: 'call'
    },
    {
      type: 'meeting'
    },
    {
      type: 'mail'
    },
    {
      type: 'todo'
    },
  ]

  $scope.tabsView = [{
      name: 'Timeline',
      active: true,
      icon: 'th-large'
    },
    {
      name: 'Activity',
      active: false,
      icon: 'plus'
    },
    {
      name: 'Finances',
      active: false,
      icon: 'money'
    }
  ]

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar:false,
    statusbar: false,
    toolbar: 'templates attach | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline ',
    setup: function(editor) {
      editor.addButton( 'templates', {
        text: 'Templates',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
            size: 'lg',
            backdrop : true,
            resolve : {

            },
            controller: 'businessManagement.clientRelationships.templatePicker',
          }).result.then(function () {

          }, function (t) {
            $scope.form.emailBody = t.template.replace('{{name}}' , $scope.contact.name.split(' ')[0]);
          })

        }
      });

      editor.addButton( 'attach', {
        text: 'Attachments',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
            size: 'md',
            backdrop : true,
            resolve : {

            },
            controller: 'businessManagement.clientRelationships.selectAttachments'

          }).result.then(function (files) {
            for (var i = 0; i < files.length; i++) {
              for (var j = 0; j < $scope.form.added.length; j++) {
                if ($scope.form.added[j].pk == files[i].pk) {
                  continue;
                }
              }
              $scope.form.added.push(files[i])
            }

          }, function () {


          })

        }
      });
    },
  };

  $scope.removeMailAttachment = function(indx) {
    $scope.form.added.splice(indx , 1)
  }

  $scope.resetLogger = function() {
    $scope.logger = {
      when: new Date(),
      where: '',
      subject: '',
      duration: 10,
      comment: '',
      internalUsers: [],
      withinCRMUsers: [],
      location: '',
      withinCRM: '',
      activityType: 'Email'
    };
  }

  $scope.resetLogger();
  $scope.local = {
    activeTab: 0
  };

  $scope.resetEmailForm = function() {
    $scope.form = {cc : [] , emailBody : '' , emailSubject : '', added : []};
  }

  $scope.resetEmailForm();

  $scope.resetEventScheduler = function() {
    $scope.eventScheduler = {
      internalUsers: [],
      when: new Date(),
      details: '',
      otherCRMUsers: [],
      venue: ''
    }
  }

  $scope.resetEventScheduler();
  $scope.saveEvent = function() {

    if ($scope.eventScheduler.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [$scope.contact.pk];
    for (var i = 0; i < $scope.eventScheduler.otherCRMUsers.length; i++) {
      crmUsers.push($scope.eventScheduler.otherCRMUsers[i].pk);
    }

    var internalUsers = [];
    for (var i = 0; i < $scope.eventScheduler.internalUsers.length; i++) {
      internalUsers.push($scope.eventScheduler.internalUsers[i]);
    }

    var dataToSend = {
      when: $scope.eventScheduler.when,
      text: $scope.eventScheduler.details,
      eventType: 'Meeting',
      originator: 'CRM',
      venue: $scope.eventScheduler.venue
    }

    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    if (internalUsers.length != 0) {
      dataToSend.followers = internalUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetEventScheduler();
    });
  }


  $scope.saveActivityLog = function() {
    var dataToSend = {
      when: $scope.logger.when,
      contact: $scope.contact.pk
    };
    var internals = []
    for (var i = 0; i < $scope.logger.internalUsers.length; i++) {
      $scope.logger.internalUsers[i]
      internals.push($scope.logger.internalUsers[i]);
    }

    if (internals.length != 0) {
      dataToSend.internalUsers = internals;
    }



    var externals = []
    for (var i = 0; i < $scope.logger.withinCRMUsers.length; i++) {
      externals.push($scope.logger.withinCRMUsers[i].pk);
    }

    if (externals.length != 0) {
      dataToSend.contacts = externals;
    }
    var activityData;
    if ($scope.logger.activityType == 'Email') {
      dataToSend.typ = 'mail';
      if ($scope.logger.subject.length == 0) {
        Flash.create('warning', 'Subject can not be left blank');
        return;
      }
      activityData = {
        subject: $scope.logger.subject
      };
    } else if ($scope.logger.activityType == 'Meeting') {
      dataToSend.typ = 'meeting';
      activityData = {
        duration: $scope.logger.duration,
        location: $scope.logger.location
      };
    } else if ($scope.logger.activityType == 'Call') {
      dataToSend.typ = 'call';
      activityData = {
        duration: $scope.logger.duration
      }
    }
    dataToSend.data = JSON.stringify(activityData);

    if ($scope.logger.comment != '') {
      dataToSend.notes = $scope.logger.comment;
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      $scope.resetLogger();
      Flash.create('success', 'Saved');
    }, function(err) {
      Flash.create('danger', 'Error');
    })

  }





  $scope.fetchCoworkers = function() {
    if ($scope.contact.company == null) {
      return;
    }
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contactLite/?company=' + $scope.contact.company.pk
    }).
    then(function(response) {
      $scope.coworkers = response.data;
    })
  }

  $scope.exploreContact = function(c) {
    $scope.$emit('exploreContact', {
      contact: c
    });
  }


  $scope.$watch('contact', function(newValue, oldValue) {
    if (newValue != undefined || newValue != null) {
      $scope.retriveTimeline();
      $scope.fetchCalendarEnteries();
    }
  })

  $scope.fetchContracts = function() {
    $http({method : 'GET' , url : '/api/clientRelationships/contract/?contact=' + $scope.contact.pk}).
    then(function(response) {
      if (response.data.length>0) {
        $scope.contracts = response.data
      }
    });
  }
  $scope.$watch('local.activeTab' , function(newValue , oldValue) {
    if (newValue == 2) {
      $scope.fetchContracts();
    }
  })


});

app.controller("businessManagement.clientRelationships.contacts.explore", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $uibModal) {

$scope.editIcon = true

  $scope.changeStatus = function(status , indx) {
    $scope.contracts[indx].status = status;

    if (status == 'billed') {
      $uibModal.open({
        template: '<div style="padding:30px;"><div class="form-group"><label>Due Date</label>'+
            '<div class="input-group" >'+
                '<input type="text" class="form-control" show-weeks="false" uib-datepicker-popup="dd-MMMM-yyyy" ng-model="contract.dueDate" is-open="status.opened" />' +
                '<span class="input-group-btn">'+
                  '<button type="button" class="btn btn-default" ng-click="status.opened = true;"><i class="glyphicon glyphicon-calendar"></i></button>'+
                '</span>'+
              '</div><p class="help-block">Auto set based on Deal due period.</p>'+
          '</div></div>',
        size: 'sm',
        backdrop : true,
        resolve : {
          contract : function() {
            return $scope.contracts[indx];
          },
        },
        controller: function($scope , contract){
          $scope.contract = contract;
          var dueDate = new Date();
          dueDate.setDate(dueDate.getDate());
          if ($scope.contract.dueDate == null) {
            $scope.contract.dueDate = dueDate;
          }
          // $scope.deal = deal;
        },
      }).result.then(function () {

      }, (function(indx, status) {
        return function () {
          console.log(indx);
          console.log($scope.contracts[indx].dueDate);

          $http({method : 'PATCH' , url : '/api/clientRelationships/contract/' + $scope.contracts[indx].pk + '/' , data : {status : status , dueDate : $scope.contracts[indx].dueDate.toISOString().substring(0, 10) }}).
          then(function(response) {
            $http({method : 'GET' , url : '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk}).
            then(function(response) {
              Flash.create('success' , 'Saved')
            }, function(err) {
              Flash.create('danger' , 'Error occured')
            })
          })



        }
      })(indx, status));



    }else if (status == 'dueElapsed') {

      var sacCode = 998311;
      var c = $scope.contracts[indx];
      for (var i = 0; i < c.data.length; i++) {
        if (c.data[i].taxCode == sacCode) {
          return;
        }
      }
      // var fineAmount = $scope.deal.contracts[indx].value * $scope.deal.duePenalty*(1/100)
      var fineAmount = $scope.deal.contracts[indx].value
      $http({method : 'GET' , url : '/api/clientRelationships/productMeta/?code='+ sacCode}).
      then((function(indx) {
        return function(response) {
          var quoteInEditor = $scope.contracts[indx]
          var productMeta = response.data[0];
          var subTotal = fineAmount*(1+productMeta.taxRate/100)
          quoteInEditor.data.push({currency : 'INR' , type : 'onetime' , tax: productMeta.taxRate, desc : 'Late payment processing charges' , rate : fineAmount , quantity : 1, taxCode : productMeta.code , totalTax : fineAmount*(productMeta.taxRate/100), subtotal : subTotal })

          quoteInEditor.value += subTotal
          var url = '/api/clientRelationships/contract/' + quoteInEditor.pk + '/'
          var method = 'PATCH'
          var dataToSend = {contact : $scope.contact.pk , data : JSON.stringify(quoteInEditor.data) , value : quoteInEditor.value};
          $http({method : method , url : url , data : dataToSend}).
          then(function(response) {
            $http({method : 'GET' , url : '/api/clientRelationships/downloadInvoice/?saveOnly=1&contract=' + response.data.pk}).
            then(function(response) {
              Flash.create('success' , 'Saved')
            }, function(err) {
              Flash.create('error' , 'Error occured')
            })
          })
        }
      })(indx))
    }else {
      $http({method : 'PATCH' , url : '/api/clientRelationships/contract/' + $scope.contracts[indx].pk + '/' , data : {status : status}}).
      then(function(response) {

      })

    }


  }

  $scope.deleteContact = function(){
    $http({method : 'DELETE' , url : '/api/clientRelationships/contact/' + $scope.contact.pk+'/'}).
    then(function(response) {
      Flash.create('success' , 'Deleted Successfully!')
      $scope.tabs.splice($scope.tab.data.index,1)
      $scope.$broadcast('forceRefetch',{})
    });
  }



  $scope.createQuote = function(){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      resolve: {
        deal : function() {
          return {pk:'',company:{},contracts:{},contacts:{}};
        },
        contact : function() {
          return $scope.contact;
        },
        mailer : function() {
          return true
        },
      },
      backdrop : false,
      controller : 'businessManagement.clientRelationships.opportunities.quote'
    }).result.then(function(rea) {
      $scope.fetchContracts()
    }, function(dis) {
      $scope.fetchContracts()
    })
  }



  $scope.editQuote = function(indx){
    $aside.open({
      templateUrl : '/static/ngTemplates/app.clientRelationships.quote.form.html',
      placement: 'right',
      size: 'xl',
      backdrop : false,
      resolve: {
        contract: function() {
          return $scope.contracts[indx]
        },
        mailer : function() {
          return true
        },
      },
      controller : 'businessManagement.clientRelationships.opportunities.quoteEdit'
    }).result.then(function(rea) {
      $scope.retriveTimeline()
      $scope.fetchContracts()
    }, function(dis) {
      $scope.retriveTimeline()
      $scope.fetchContracts()
    })
  }








  $scope.sendto = ''
  $scope.sendcc = ''
  $scope.sendEmail = function() {
    console.log("herrrddddd");
    var count = 0
    var cc = []
    if ($scope.form.cc.length>0) {
      for (var i = 0; i < $scope.form.cc.length; i++) {
        $http({
          method: 'GET',
          url: '/api/HR/userSearch/'+$scope.form.cc[i]
        }).
        then(function(response) {
          count+=1
          $scope.tempCC = response.data.email +','
          $scope.sendcc = $scope.sendcc + $scope.tempCC
          if (count==$scope.form.cc.length) {
            $scope.sendcc = $scope.sendcc.slice(0, -1);
            $scope.sendto = ''
            // $scope.tempTo = $scope.data.email + ','
            // $scope.sendto = $scope.tempTo
            $scope.tempTo = $scope.contact.email + ','
            $scope.sendto = $scope.tempTo
            if ($scope.deal!=undefined) {
              for (var i = 0; i < $scope.deal.contacts.length; i++) {
                $scope.tempTo = $scope.deal.contacts[i].email + ','
                $scope.sendto = $scope.tempTo
              }
            }
            $scope.sendto = $scope.sendto.slice(0, -1);
            $scope.attachmentTemplates = ''
            if ($scope.form.added != null) {
              for (var i = 0; i < $scope.form.added.length; i++) {
                console.log($scope.form.added[i].pk);
                $scope.tempTemplate = $scope.form.added[i].pk + ','
                $scope.attachmentTemplates = $scope.attachmentTemplates+ $scope.tempTemplate
              }
              $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
            }
            toSend = {
              to:$scope.sendto,
              cc:$scope.sendcc,
              subject:$scope.form.emailSubject,
              body:$scope.form.emailBody,
              attachmentTemplates:$scope.attachmentTemplates
            }
            $http({method : 'POST' , url : '/api/mail/send/' , data : toSend}).
            then(function() {
              Flash.create('success', 'Email sent successfully');
              var data = {"subject":$scope.form.emailSubject}
              var finalData = JSON.stringify(data)
              var dataToSend = {
                typ : 'mail',
                contact:$scope.contact.pk,
                notes:$scope.form.emailBody,
                data:finalData,
              };

              $http({method : 'POST' , url : '/api/clientRelationships/activity/' , data : dataToSend }).
              then(function(response) {
                $scope.resetEmailForm();
              })

            })
          }
        })
      }
    }
    else{
      console.log("herrrrrrrrrrrrrr");
            $scope.sendto = ''
            // $scope.tempTo = $scope.data.email + ','
            // $scope.sendto = $scope.tempTo
            $scope.tempTo = $scope.contact.email + ','
            $scope.sendto = $scope.tempTo
            if ($scope.deal!=undefined) {
              for (var i = 0; i < $scope.deal.contacts.length; i++) {
                $scope.tempTo = $scope.deal.contacts[i].email + ','
                $scope.sendto = $scope.tempTo
              }
            }
            $scope.sendto = $scope.sendto.slice(0, -1);
            $scope.attachmentTemplates = ''
            if ($scope.form.added != null) {
              for (var i = 0; i < $scope.form.added.length; i++) {
                console.log($scope.form.added[i].pk);
                $scope.tempTemplate = $scope.form.added[i].pk + ','
                $scope.attachmentTemplates = $scope.attachmentTemplates+ $scope.tempTemplate
              }
              $scope.attachmentTemplates = $scope.attachmentTemplates.slice(0, -1);
            }
            toSend = {
              to:$scope.sendto,
              subject:$scope.form.emailSubject,
              body:$scope.form.emailBody,
              attachmentTemplates:$scope.attachmentTemplates
            }
            $http({method : 'POST' , url : '/api/mail/send/' , data : toSend}).
            then(function() {
              Flash.create('success', 'Email sent successfully');
              var data = {"subject":$scope.form.emailSubject}
              var finalData = JSON.stringify(data)
              var dataToSend = {
                typ : 'mail',
                contact:$scope.contact.pk,
                notes:$scope.form.emailBody,
                data:finalData,
              };

              $http({method : 'POST' , url : '/api/clientRelationships/activity/' , data : dataToSend }).
              then(function(response) {
                $scope.resetEmailForm();
              })

            })
    }

  }
  $scope.editContact = function() {
      console.log($scope.contact,$scope.tab.data,"sada343432432");
    $scope.$emit('editContact' , {contact : $scope.contact})
  }

  if ($scope.data != undefined) {
    $scope.contact = $scope.data.tableData[$scope.tab.data.index]
  }

  $scope.disableNext = false;
  $scope.pageNo = 0;

  $scope.cleanCalendarEntry = function(data) {
    var cleaned = []
    for (var j = 0; j < data.clients.length; j++) {
      if (data.clients[j].pk != $scope.contact.pk) {
        cleaned.push(data.clients[j]);
      }
    }
    data.clients = cleaned;
    return data;
  }

  $scope.fetchCalendarEnteries = function() {
    $http({
      method: 'GET',
      url: '/api/PIM/calendar/?originator=CRM&clients__in=[' + $scope.contact.pk + ']'
    }).
    then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        response.data[i] = $scope.cleanCalendarEntry(response.data[i]);
      }
      $scope.calendar = response.data;
      for (var i = 0; i < $scope.calendar.length; i++) {
        $scope.calendar[i].when = new Date($scope.calendar[i].when);
        $scope.calendar[i].newDate = false;
        if (i < $scope.calendar.length - 1) {
          if ($scope.calendar[i].when.toDateString() != new Date($scope.calendar[i + 1].when).toDateString()) {
            $scope.calendar[i].newDate = true;
            if ($scope.calendar[i].when.toDateString() == new Date().toDateString()) {
              $scope.calendar[i].today = true;
            }
          }
        }
      }
    })
  }

  $scope.resetTaskEditor = function() {
    var dummyDate = new Date()
    $scope.taskEditor = {
      otherCRMUsers: [],
      details: ''
    };
    $scope.taskEditor.when = new Date(dummyDate.getFullYear(), dummyDate.getMonth(), dummyDate.getDate(), 23, 59, 59); // 2013-07-30 23:59:59
  }
  $scope.resetTaskEditor();
  $scope.saveTask = function() {
    if ($scope.taskEditor.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [$scope.contact.pk];
    for (var i = 0; i < $scope.taskEditor.otherCRMUsers.length; i++) {
      crmUsers.push($scope.taskEditor.otherCRMUsers[i].pk);
    }

    var dataToSend = {
      when: $scope.taskEditor.when,
      text: $scope.taskEditor.details,
      eventType: 'Reminder',
      originator: 'CRM'
    }
    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetTaskEditor();
    });
  }

  $scope.markComplete = function(pk) {
    for (var i = 0; i < $scope.calendar.length; i++) {
      if ($scope.calendar[i].pk == pk) {
        $scope.calendar[i].completed = true;
        $http({
          method: 'PATCH',
          url: '/api/PIM/calendar/' + pk + '/',
          data: {
            completed: true
          }
        }).
        then(function(response) {
          Flash.create('success', 'Updated');
        }, function(err) {
          Flash.create('danger', 'Error while updating');
        })
      }
    }
  }

  $scope.nextPage = function() {
    if ($scope.disableNext) {
      return;
    }
    $scope.pageNo += 1;
    $scope.retriveTimeline();
  }

  $scope.prevPage = function() {
    if ($scope.pageNo == 0) {
      return;
    }
    $scope.pageNo -= 1;
    $scope.retriveTimeline();
  }

  $scope.noteEditor = {
    text: '',
    doc: emptyFile
  };
  $scope.timelineItems = [];

  $scope.retriveTimeline = function() {
    console.log($scope.pageNo,'aaaaaaaa');
    $http({
      method: 'GET',
      url: '/api/clientRelationships/activity/?contact=' + $scope.contact.pk + '&limit=5&offset=' + $scope.pageNo * 5
    }).
    then(function(response) {
      $scope.timelineItems = response.data.results;
      if ($scope.timelineItems.length == 0 && $scope.pageNo != 0) {
        $scope.prevPage();
      }
      $scope.disableNext = response.data.next == null;
      $scope.analyzeTimeline();
    })
  }

  $scope.analyzeTimeline = function() {
    for (var i = 0; i < $scope.timelineItems.length; i++) {
      $scope.timelineItems[i].created = new Date($scope.timelineItems[i].created);
      if (i < $scope.timelineItems.length - 1 && $scope.timelineItems[i].created.getMonth() != new Date($scope.timelineItems[i + 1].created).getMonth()) {
        $scope.timelineItems[i + 1].newMonth = true;
      }
    }
  }

  $scope.saveNote = function() {
    console.log("will save");

    var fd = new FormData();
    fd.append('typ', 'note');
    fd.append('data', $scope.noteEditor.text);
    fd.append('contact', $scope.contact.pk);

    if ($scope.noteEditor.doc != emptyFile) {
      fd.append('doc', $scope.noteEditor.doc);
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      Flash.create('success', 'Saved');
      $scope.noteEditor.text = '';
      $scope.noteEditor.doc = emptyFile;
    })
  }

  $scope.sortedFeeds = [{
      type: 'note'
    },
    {
      type: 'call'
    },
    {
      type: 'meeting'
    },
    {
      type: 'mail'
    },
    {
      type: 'todo'
    },
  ]

  $scope.tabsView = [{
      name: 'Timeline',
      active: true,
      icon: 'th-large'
    },
    {
      name: 'Activity',
      active: false,
      icon: 'plus'
    },
    {
      name: 'Finances',
      active: false,
      icon: 'money'
    }
  ]

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 300,
    menubar:false,
    statusbar: false,
    toolbar: 'templates attach | undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline ',
    setup: function(editor) {
      editor.addButton( 'templates', {
        text: 'Templates',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectTemplate.html',
            size: 'lg',
            backdrop : true,
            resolve : {

            },
            controller: 'businessManagement.clientRelationships.templatePicker',
          }).result.then(function () {

          }, function (t) {
            $scope.form.emailBody = t.template.replace('{{name}}' , $scope.contact.name.split(' ')[0]);
          })

        }
      });

      editor.addButton( 'attach', {
        text: 'Attachments',
        icon: false,
        onclick: function() {

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.clientRelationships.selectAttachments.html',
            size: 'md',
            backdrop : true,
            resolve : {

            },
            controller: 'businessManagement.clientRelationships.selectAttachments'

          }).result.then(function (files) {
            for (var i = 0; i < files.length; i++) {
              for (var j = 0; j < $scope.form.added.length; j++) {
                if ($scope.form.added[j].pk == files[i].pk) {
                  continue;
                }
              }
              $scope.form.added.push(files[i])
            }

          }, function () {


          })

        }
      });
    },
  };

  $scope.removeMailAttachment = function(indx) {
    $scope.form.added.splice(indx , 1)
  }

  $scope.resetLogger = function() {
    $scope.logger = {
      when: new Date(),
      where: '',
      subject: '',
      duration: 10,
      comment: '',
      internalUsers: [],
      withinCRMUsers: [],
      location: '',
      withinCRM: '',
      activityType: 'Email'
    };
  }

  $scope.resetLogger();
  $scope.local = {
    activeTab: 0
  };

  $scope.resetEmailForm = function() {
    $scope.form = {cc : [] , emailBody : '' , emailSubject : '', added : []};
  }

  $scope.resetEmailForm();

  $scope.resetEventScheduler = function() {
    $scope.eventScheduler = {
      internalUsers: [],
      when: new Date(),
      details: '',
      otherCRMUsers: [],
      venue: ''
    }
  }

  $scope.resetEventScheduler();
  $scope.saveEvent = function() {

    if ($scope.eventScheduler.details.length == 0) {
      Flash.create('warning', 'Details can not be empty')
    }

    var crmUsers = [$scope.contact.pk];
    for (var i = 0; i < $scope.eventScheduler.otherCRMUsers.length; i++) {
      crmUsers.push($scope.eventScheduler.otherCRMUsers[i].pk);
    }

    var internalUsers = [];
    for (var i = 0; i < $scope.eventScheduler.internalUsers.length; i++) {
      internalUsers.push($scope.eventScheduler.internalUsers[i]);
    }

    var dataToSend = {
      when: $scope.eventScheduler.when,
      text: $scope.eventScheduler.details,
      eventType: 'Meeting',
      originator: 'CRM',
      venue: $scope.eventScheduler.venue
    }

    if (crmUsers.length != 0) {
      dataToSend.clients = crmUsers;
    }

    if (internalUsers.length != 0) {
      dataToSend.followers = internalUsers;
    }

    $http({
      method: 'POST',
      url: '/api/PIM/calendar/',
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      // $scope.calendar.unshift($scope.cleanCalendarEntry(response.data));
      $scope.fetchCalendarEnteries();
      $scope.resetEventScheduler();
    });
  }


  $scope.saveActivityLog = function() {
    var dataToSend = {
      when: $scope.logger.when,
      contact: $scope.contact.pk
    };
    var internals = []
    for (var i = 0; i < $scope.logger.internalUsers.length; i++) {
      $scope.logger.internalUsers[i]
      internals.push($scope.logger.internalUsers[i]);
    }

    if (internals.length != 0) {
      dataToSend.internalUsers = internals;
    }



    var externals = []
    for (var i = 0; i < $scope.logger.withinCRMUsers.length; i++) {
      externals.push($scope.logger.withinCRMUsers[i].pk);
    }

    if (externals.length != 0) {
      dataToSend.contacts = externals;
    }
    var activityData;
    if ($scope.logger.activityType == 'Email') {
      dataToSend.typ = 'mail';
      if ($scope.logger.subject.length == 0) {
        Flash.create('warning', 'Subject can not be left blank');
        return;
      }
      activityData = {
        subject: $scope.logger.subject
      };
    } else if ($scope.logger.activityType == 'Meeting') {
      dataToSend.typ = 'meeting';
      activityData = {
        duration: $scope.logger.duration,
        location: $scope.logger.location
      };
    } else if ($scope.logger.activityType == 'Call') {
      dataToSend.typ = 'call';
      activityData = {
        duration: $scope.logger.duration
      }
    }
    dataToSend.data = JSON.stringify(activityData);

    if ($scope.logger.comment != '') {
      dataToSend.notes = $scope.logger.comment;
    }

    $http({
      method: 'POST',
      url: '/api/clientRelationships/activity/',
      data: dataToSend
    }).
    then(function(response) {
      $scope.timelineItems.unshift(response.data);
      $scope.resetLogger();
      Flash.create('success', 'Saved');
    }, function(err) {
      Flash.create('danger', 'Error');
    })

  }


  $http({
    method: 'GET',
    url: '/api/clientRelationships/contact/' + $scope.tab.data.pk + '/'
  }).
  then(function(response) {
    $scope.contact = response.data;
    $scope.fetchCoworkers();
  })


  $scope.fetchCoworkers = function() {
    if ($scope.contact.company == null) {
      return;
    }
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contactLite/?company=' + $scope.contact.company.pk
    }).
    then(function(response) {
      $scope.coworkers = response.data;
    })
  }

  $scope.exploreContact = function(c) {
    $scope.$emit('exploreContact', {
      contact: c
    });
  }


  $scope.$watch('contact', function(newValue, oldValue) {
    if (newValue != undefined || newValue != null) {
      $scope.retriveTimeline();
      $scope.fetchCalendarEnteries();
    }
  })

  $scope.fetchContracts = function() {
    $http({method : 'GET' , url : '/api/clientRelationships/contract/?contact=' + $scope.contact.pk}).
    then(function(response) {
      if (response.data.length>0) {
        $scope.contracts = response.data
      }
    });
  }
  $scope.$watch('local.activeTab' , function(newValue , oldValue) {
    if (newValue == 2) {
      $scope.fetchContracts();
    }
  })


});

app.controller("businessManagement.clientRelationships.contacts.form", function($scope, $state, $users, $stateParams, $http, Flash) {


  $scope.exploreContact = function(c) {
    $scope.$emit('exploreContact', {
      contact: c
    });
  }


  $scope.showContact = function() {
    $scope.addTab({
      "title": "Details :" + $scope.form.name,
      "cancel": true,
      "app": "contactExplorer",
      "data": {
        "pk": $scope.form.pk,
        "index": -1,
      },
      "active": true
    })
  }


  $scope.resetForm = function() {
    $scope.mode = 'new';
    $scope.form = {
      company: undefined,
      name: '',
      email: '',
      mobile: '',
      mobileSecondary: '',
      emailSecondary: '',
      designation: '',
      notes: '',
      linkedin: '',
      facebook: '',
      dp: emptyFile,
      male: true,
      street:'',
      city:'',
      state:'',
      country:'',
      pincode:'',
      isGst : false
    }
  }


  if (typeof $scope.tab != 'undefined' && $scope.tab.data.pk != -1) {
    if ($scope.tab.data.index == undefined) {
      $scope.form = $scope.tab.data.contact;
      $scope.showRefresh = true
    }else {
      $scope.form = $scope.data.tableData[$scope.tab.data.index];
      $scope.showRefresh = true
    }



    $scope.mode = 'edit';
  } else {
    $scope.resetForm();
  }


  $scope.companyAdvanceOptions = false;
  $scope.showCreateCompanyBtn = false;
  $scope.companyExist = false;
  $scope.showCompanyForm = false;

  $scope.me = $users.get('mySelf');




  $scope.companySearch = function(query) {
    return $http.get('/api/ERP/service/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.$watch('form.company', function(newValue, oldValue) {
    console.log(newValue);
    if (typeof newValue == "string" && newValue.length > 0 || newValue == null) {
      $scope.showCreateCompanyBtn = true;
      $scope.companyExist = false;
      $scope.showCompanyForm = false;
    } else if (typeof newValue == "object"&&newValue != null) {
      $scope.companyExist = true;
    } else {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
    }

    if (newValue == '') {
      $scope.showCreateCompanyBtn = false;
      $scope.showCompanyForm = false;
      $scope.companyExist = false;
    }

  });


  $scope.$watch('form.company.address.pincode' , function(newValue , oldValue) {
    if (newValue == undefined) {
      return;
    }
    if (newValue.length == 6) {
      $http({method : 'GET' , url : '/api/ERP/genericPincode/?pincode=' + newValue}).
      then(function(response) {
        if (response.data.length>0) {
          $scope.form.company.address.city = response.data[0].city;
          $scope.form.company.address.state = response.data[0].state;
          $scope.form.company.address.country = response.data[0].country;
        }
        // else{
        //   $scope.form.company.address.city = '';
        //   $scope.form.company.address.state = '';
        //   $scope.form.company.address.country = '';
        // }
      })
    }
    // else{
    //   $scope.form.company.address.city = '';
    //   $scope.form.company.address.state = '';
    //   $scope.form.company.address.country = '';
    //
    // }

  })

  $scope.$watch('form.pincode' , function(newValue , oldValue) {
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
    // else{
    //   $scope.form.company.address.city = '';
    //   $scope.form.company.address.state = '';
    //   $scope.form.company.address.country = '';
    //
    // }

  })


  $scope.updateCompanyDetails = function() {
    if (typeof $scope.form.company != "object") {
      Flash.create('warning', "Company's basic details missing")
      return
    }

    if ($scope.form.company.address != null && typeof $scope.form.company.address == 'object') {
      var method = 'POST';
      var url = '/api/ERP/address/'
      if (typeof $scope.form.company.address.pk == 'number') {
        method = 'PATCH'
        url += $scope.form.company.address.pk + '/'
      }
      $http({
        method: method,
        url: url,
        data: $scope.form.company.address
      }).
      then(function(response) {
        $scope.form.company.address = response.data;
        $scope.address =  response.data;
        var dataToSend = $scope.form.company;
        dataToSend.address = response.data.pk;
        $http({
          method: 'PATCH',
          url: '/api/ERP/service/' + $scope.form.company.pk + '/',
          data: dataToSend
        }).
        then(function(response) {
          $scope.form.company = response.data;
          $scope.form.company.address = $scope.address
          Flash.create('success', 'Saved');
        });
      }, function(err) {
        Flash.create('danger' , 'Error')
      })
    } else {

      var dataToSend = $scope.form.company;

      $http({
        method: 'PATCH',
        url: '/api/ERP/service/' + $scope.form.company.pk + '/',
        data: dataToSend
      }).
      then(function(response) {
        $scope.form.company = response.data;
        Flash.create('success', 'Saved');
      });

    }



  }

  $scope.createCompany = function() {
    if ($scope.companyExist) {
      $scope.showCompanyForm = true;
      $scope.showCreateCompanyBtn = false;
      return
    }

    if (typeof $scope.form.company == "string" && $scope.form.company.length > 1) {
      var dataToSend = {
        name: $scope.form.company,
        user: $scope.me.pk
      }
      $http({
        method: 'POST',
        url: '/api/ERP/service/',
        data: dataToSend
      }).
      then(function(response) {
        $scope.form.company = response.data;
        Flash.create('success', 'Created');
      })
    } else {
      Flash.create('warning', 'Company name too small')
    }
  }

  $scope.createContact = function() {
    var url = '/api/clientRelationships/contact/';
    var method = 'POST'

    if ($scope.form.name == '') {
      Flash.create('warning', 'Name can not be empty!');
    }

    if ($scope.mode == 'edit') {
      url += $scope.form.pk + '/';
      method = 'PATCH'
    }

    var fd = new FormData();
    fd.append('name', $scope.form.name);
    fd.append('male', $scope.form.male);
    fd.append('street', $scope.form.street);
    fd.append('city', $scope.form.city);
    fd.append('pincode', $scope.form.pincode);
    fd.append('state', $scope.form.state);
    fd.append('country', $scope.form.country);
    fd.append('email', $scope.form.email);
    fd.append('mobile', $scope.form.mobile);
    fd.append('emailSecondary', $scope.form.emailSecondary);
    fd.append('facebook', $scope.form.facebook);
    fd.append('linkedin', $scope.form.linkedin);
    fd.append('notes', $scope.form.notes);
    fd.append('designation', $scope.form.designation);
    fd.append('mobileSecondary', $scope.form.mobileSecondary);
    fd.append('isGst', $scope.form.isGst);
    // fd.append('company', null);

    if ($scope.form.company != null && typeof $scope.form.company == 'object') {
      fd.append('company', $scope.form.company.pk);
    }

    if ($scope.form.dp != emptyFile && $scope.form.dp != null && typeof $scope.form.dp != 'string') {
      fd.append('dp', $scope.form.dp)
    }

    $http({
      method: method,
      url: url,
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.form = response.data;

      console.log($scope.form);
      if ($scope.mode == 'new') {
        $scope.form.pk = response.data.pk;
        $scope.mode = 'edit';
      }
      Flash.create('success', 'Saved')
    })
  }

})
