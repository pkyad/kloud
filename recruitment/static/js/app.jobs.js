app.config(function($stateProvider) {

  $stateProvider
    .state('workforceManagement.jobs', {
      url: "/jobs",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.item.html',
          controller: 'workforceManagement.recruitment.jobs',
        }
      }
    })
    .state('workforceManagement.newJob', {
      url: "/newJob",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.form.html',
          controller: 'workforceManagement.recruitment.roles.form',
        }
      }
    })
    .state('workforceManagement.editJob', {
      url: "/editJob/:id",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.form.html',
          controller: 'workforceManagement.recruitment.roles.form',
        }
      }
    })
    .state('workforceManagement.exploreJob', {
      url: "/exploreJob/:id",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.explore.html',
          controller: 'workforceManagement.recruitment.jobs.explore',
        }
      }
    })
    .state('workforceManagement.exploreJob.allJob', {
      url: "/allJob",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.allJobs.html',
          controller: 'workforceManagement.recruitment.jobs.allJob',
        }
      }
    })
    .state('workforceManagement.exploreJob.viewprofile', {
      url: "/viewprofile/:cand",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.recruitment.jobs.viewProfile.html',
          controller: 'workforceManagement.recruitment.jobs.viewProfile',
        }
      }
    })
    // .state('workforceManagement.viewApplication', {
    //   url: "/viewApplication/:id",
    //   views: {
    //     "": {
    //       templateUrl: '/static/ngTemplates/app.recruitment.jobs.applicant.html',
    //       controller: 'recruitment.applicant.view',
    //     }
    //   }
    // })
});
app.controller("workforceManagement.recruitment.jobs.viewProfile", function($scope, $http, $uibModal, $aside, $state, Flash, $users, $filter ){


})


app.controller("workforceManagement.recruitment.jobs.allJob", function($scope, $http, $uibModal, $aside, $state, Flash, $users, $filter ){
  $scope.allCandidates = []
    $scope.fetchDeals = function() {
      $http({
        method: 'GET',
        url: '/api/recruitment/getAllJobs/?id=' + $state.params.id
      }).
      then(function(response) {
        $scope.allCandidates = response.data;
      });
    }

    $scope.fetchDeals();


})
app.controller("workforceManagement.recruitment.jobs", function($scope, $http, $uibModal, $aside, $state, Flash, $users, $filter ){
  //
  // $scope.data = {
  //   tableData: []
  // };
  //
  // views = [{
  //   name: 'list',
  //   icon: 'fa-th-large',
  //   template: '/static/ngTemplates/genericTable/genericSearchList.html',
  //   itemTemplate: '/static/ngTemplates/app.recruitment.jobs.item.html',
  // }, ];
  //
  // $scope.$watch('data.tableData', function(newValue, oldValue) {
  //   console.log('******************', $scope.data.tableData);
  //   for (var i = 0; i < $scope.data.tableData.length; i++) {
  //     $http({
  //       method: 'GET',
  //       url: '/api/recruitment/applyJob/?job=' + $scope.data.tableData[i].pk + '&status__in!=Created,Closed,Onboarding'
  //     }).
  //     then((function(i) {
  //       return function(response) {
  //         $scope.data.tableData[i].screening = response.data;
  //         console.log(response.data, 'aaaaaaaaaaaaa');
  //       }
  //     })(i));
  //   }
  // })
  // $scope.config = {
  //   views: views,
  //   url: '/api/recruitment/job/',
  //   searchField: 'jobtype',
  //   itemsNumPerView: [12, 24, 48],
  // }
  //
  // $scope.action = function(target, action, mode) {
  //   console.log(target, action, mode);
  //   // console.log("fdg", $scope.data.tableData);
  //
  //   for (var i = 0; i < $scope.allJobs.length; i++) {
  //     if ($scope.allJobs[i].pk == parseInt(target)) {
  //       if (action == 'edit') {
  //         var title = 'Edit Jobs: ';
  //         var myapp = 'jobEdit';
  //       } else if (action == 'jobBrowse') {
  //         var title = 'Browse Jobs : ';
  //         var myapp = 'jobBrowse';
  //       } else if (action == 'selected') {
  //         var title = 'Manage Applications  : ';
  //         var myapp = 'selected';
  //       }
  //       $scope.addTab({
  //         title: title + $scope.allJobs[i].pk,
  //         cancel: true,
  //         app: myapp,
  //         data: $scope.allJobs[i],
  //         active: true
  //       })
  //     }
  //   }
  //
  // }
  // $scope.tabs = [];
  // $scope.searchTabActive = true;
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
  //     console.log(input);
  //     $scope.tabs.push(input)
  //     console.log($scope.tabs, $scope.tabs.length);
  //   }
  // }

  $scope.limit = 5
  $scope.getJobs = function() {
    $http({
      method: 'GET',
      url: '/api/recruitment/job/?limit='+$scope.limit
    }).
    then(function(response) {
      $scope.allJobs = response.data.results;
      $scope.count = response.data.count;
    });
  }
  $scope.getJobs()
  $scope.loadMore = function(){
      $scope.limit = $scope.limit+5
      $scope.getJobs()
  }
});
app.controller("workforceManagement.recruitment.roles.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.refreshOption = true;
  $scope.departmentSearch = function(query) {
    return $http.get('/api/organization/departments/?dept_name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.unitsSearch = function(query) {
    $http.get('/api/organization/unitFull/').
    then(function(response) {
      $scope.allUnits =  response.data;
      if ($scope.form.pk) {
        for (var i = 0; i < $scope.allUnits.length; i++) {
          if ($scope.allUnits[i].pk == $scope.form.unit) {
             $scope.form.unit = $scope.allUnits[i]
          }
        }
      }
      else{
        $scope.form.unit =  $scope.allUnits[0]
      }
    })
  };
    $scope.unitsSearch()
  $scope.roleSearch = function() {
    return $http.get('/api/organization/role/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.resetForm = function() {
    $scope.form = {
      'jobtype': 'Full Time',
      'unit': '',
      'department': '',
      'role': '',
      'contacts': [],
      'skill': '',
      'description':''
    }
    $scope.unitsSearch()
  }

  $scope.getJob = function() {
    $http({
      method: 'GET',
      url: '/api/recruitment/job/'+$state.params.id+'/'
    }).
    then(function(response) {
      $scope.form = response.data;
      $scope.unitsSearch()
    });
  }

  if ($state.is('workforceManagement.newJob')) {
        $scope.resetForm()
        $scope.mode = 'new';
    } else {
      $scope.getJob()
      $scope.mode = 'edit';
    }


  $scope.saveJobs = function() {
    var f = $scope.form;
    var toSend = {
      jobtype: f.jobtype,
      unit: f.unit.pk,
      role: f.role,
      skill: f.skill,
      description: f.description,
      status:'Active'
    }
    console.log(toSend);
    var url = '/api/recruitment/job/';
    if ($scope.form.pk == undefined) {
      var method = 'POST';
    } else {
      var method = 'PATCH';
      url += $scope.form.pk + '/';
    }
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      // $scope.form= response.data;
      Flash.create('success', 'Saved');
      if ($scope.mode == 'new') {
        $scope.resetForm();
      }else {
          Flash.create('success', 'Updated');
      }
    })
  }

});
app.controller("workforceManagement.recruitment.jobs.explore", function($scope, Flash, $state, $users, $stateParams, $http, Flash, $uibModal, $aside) {

  $scope.jobApplied = []

  $scope.getJob = function() {
    $http({
      method: 'GET',
      url: '/api/recruitment/job/'+$state.params.id+'/'
    }).
    then(function(response) {
      $scope.jobDetails = response.data;
    });
  }
  $scope.getJob()
  $state.go('workforceManagement.exploreJob.allJob')
  $scope.approve = function() {
    $scope.jobDetails.approved = true;
    $scope.jobDetails.status = 'Approved'
    var toSend = {
      approved: $scope.jobDetails.approved,
      status: $scope.jobDetails.status
    }
    var method = 'PATCH';
    var url = '/api/recruitment/job/';
    url += $scope.jobDetails.pk + '/';
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
    })
  }
  $scope.active = function() {
    if ($scope.jobDetails.status == 'Active') {
      $scope.jobDetails.status = 'Closed';
    } else if ($scope.jobDetails.status == 'Approved' || $scope.jobDetails.status == 'Closed') {
      $scope.jobDetails.status = 'Active';
    }
    var toSend = {
      status: $scope.jobDetails.status
    }
    var method = 'PATCH';
    var url = '/api/recruitment/job/';
    url += $scope.jobDetails.pk + '/';
    $http({
      method: method,
      url: url,
      data: toSend
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
    })
  }
  $scope.listData = function() {
    $http({
      method: 'GET',
      url: '/api/recruitment/applyJob/?job=' + $state.params.id + '&status=Created'
    }).
    then(function(response) {
      $scope.jobApplied = response.data;
    });
  }
  $scope.listData();
  $scope.form = {
    checkAll: ''
  }
  $scope.$watch('form.checkAll', function(newValue, oldValue) {
    console.log("heeeeeeerrrrrr");
    for (var i = 0; i < $scope.jobApplied.length; i++) {
      $scope.jobApplied[i].select = newValue;
    }
  })

  $scope.bulkupload = function(){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.recruitment.job.upload.html',
      size: 'md',
      backdrop: true,
      resolve: {
        job: function() {
          return $scope.jobDetails.pk;
        },
      },
      controller: function($scope, $uibModalInstance, job) {
        $scope.form = {
          excelFile:'emptyFile'
        }
        $scope.upload = function() {
          var fd = new FormData();
          fd.append('excelFile', $scope.form.excelFile)
          fd.append('job', job)
          var method = 'POST';
          $http({
            method: method,
            url: '/api/recruitment/jobupload/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
              $uibModalInstance.dismiss();
            })
        }
      },
    }).result.then(function() {

    }, function() {
      $scope.listData()
    });
  }

  $scope.selected = function() {
    var count = 0
    for (var i = 0; i < $scope.jobApplied.length; i++) {
      if ($scope.jobApplied[i].select) {
        count += 1
        console.log("aaaaaaa");
        $scope.jobApplied[i].status = 'TechicalInterview'
        var toSend = {
          status: $scope.jobApplied[i].status
        }
        var method = 'PATCH';
        var url = '/api/recruitment/applyJob/';
        url += $scope.jobApplied[i].pk + '/';
        $http({
          method: method,
          url: url,
          data: toSend
        }).
        then(function(response) {
          $scope.data['TechicalInterview'].push(response.data)
          Flash.create('success', 'Done !');
          $scope.listData();
        })
      }
    }
    if (count == 0) {
      Flash.create('warning', 'Please Select Some Candidates')
      return
    }
  }
  $scope.rejected = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.recruitment.rejected.reason.html',
      size: 'sm',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.jobApplied;
        },
      },
      controller: function($scope, data, $uibModalInstance) {
        $scope.reject = function() {
          var count = 0
          for (var i = 0; i < data.length; i++) {
            if (data[i].select) {
              count += 1
              console.log("aaaaaaa", $scope.form.rejectReason);
              data[i].status = 'Closed';
              data[i].rejectReason = $scope.form.rejectReason;
              var toSend = {
                status: data[i].status,
                rejectReason: data[i].rejectReason,
              }
              var method = 'PATCH';
              var url = '/api/recruitment/applyJob/';
              url += data[i].pk + '/';
              $http({
                method: method,
                url: url,
                data: toSend
              }).
              then(function(response) {
                Flash.create('success', 'Rejected !');
                $uibModalInstance.dismiss(response);
              })
            }
          }
          if (count == 0) {
            Flash.create('warning', 'Please Select Some Candidates')
            return
          }jobDetails
        }
      },
    }).result.then(function() {

    }, function() {
      $scope.listData();
    });
  }

  $scope.resumeView = function(data) {
    console.log("will create a quote", data);
    $aside.open({
      templateUrl: '/static/ngTemplates/app.recruitment.resume.view.html',
      placement: 'left',
      size: 'xl',
      resolve: {
        job: function() {
          return data;
        },
      },
      controller: 'recruitment.resume.view'
    })
  }

  $scope.newApplicant = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.recruitment.application.form.html',
      size: 'l',
      backdrop: false,
      resolve: {
        jobDetails: function() {
          return $scope.jobDetails;
        },
      },
      controller: 'recruitment.application.form'
    })

  }

  $http({
    method: 'GET',
    url: '/api/recruitment/getBoardOptions/?jobs='
  }).
  then(function(response) {
    $scope.columns = response.data
  })

  $scope.columns = [
    // {icon : 'fa-pencil-square-o' , text : 'Created' , cat : 'created'},
    {
      icon: 'fa-desktop',
      text: 'Techical Interview',
      cat: 'TechicalInterview'
    },
    {
      icon: 'fa-user-circle-o ',
      text: 'HR Interview',
      cat: 'HRInterview'
    },
    {
      icon: 'fa-bars ',
      text: 'Negotiation',
      cat: 'Negotiation'
    },

  ]

  $scope.isDragging = false;

  // $scope.$on('exploreDeal', function(event, input) {
  //   $scope.addTab({
  //     "title": "Details :" + input.deal.name,
  //     "cancel": true,
  //     "app": "exploreDeal",
  //     "data": {
  //       "pk": input.deal.pk
  //     },
  //     "active": true
  //   })
  // });
  //
  // $scope.exploreDeal = function(deal , evt) {
  //   if ($scope.isDragging) {
  //     $scope.isDragging = false;
  //   }else {
  //     $scope.$emit('exploreDeal', {
  //       deal: deal
  //     });
  //   }
  // }
  $scope.exploreApplicant = function(applicant, evt) {
    if ($scope.isDragging) {
      $scope.isDragging = false;
    } else {
      $scope.addTab({
        "title": "Applicant : " + applicant.firstname,
        "cancel": true,
        "app": "applicant",
        "data": {
          "pk": applicant.pk
        },
        "active": true
      })
    }
  }
  $scope.$on('draggable:start', function(data) {
    $scope.isDragging = true;
  });

  $scope.removeFromData = function(pk) {
    for (var key in $scope.data) {
      if ($scope.data.hasOwnProperty(key)) {
        for (var i = 0; i < $scope.data[key].length; i++) {
          if ($scope.data[key][i].pk == pk) {
            $scope.data[key].splice(i, 1);
            return;
          }
        }
      }
    }
  }

  $scope.onDropComplete = function(data, evt, newState) {
    if (data == null) {
      return;
    }
    $scope.removeFromData(data.pk);
    $scope.data[$scope.columns[newState].cat].push(data);
    console.log($scope.columns[newState].cat);
    console.log(data);

    var dataToSend = {
      status: $scope.columns[newState].cat
    }

    $http({
      method: 'PATCH',
      url: '/api/recruitment/applyJob/' + data.pk + '/',
      data: dataToSend
    }).
    then(function(Response) {}, function(err) {
      Flash.create('danger', 'Error while updating')
    });
    console.log("drop complete");
  }


});

app.controller("recruitment.application.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModalInstance, jobDetails, $timeout) {
  $scope.resetForm = function() {
    $scope.job = jobDetails
    $scope.form = {
      'firstname': '',
      'lastname': '',
      'email': '',
      'mobile': '',
      'coverletter': '',
      'resume': emptyFile,
      'aggree': true
    }
  }

  $scope.resetForm();
  $scope.rsD = ''
  $scope.msg = ''
  $scope.save = function() {
    console.log($scope.form, 'aaaaaaaaaaa');
    var f = $scope.form;
    if (f.firstname.length == 0) {
      return
    }
    if (f.email.length == 0) {
      return
    }
    if (f.aggree == false) {
      return
    }
    if (f.mobile.length == 0) {
      return
    }
    $scope.rsD = ''
    if (f.resume == emptyFile) {
      $scope.rsD = 'Please Upload Resume In PDF Formate'
      return
    }
    var r = f.resume.name.split('.')[1]
    console.log(r);
    if (r != 'pdf') {
      $scope.rsD = 'Please Upload Resume In PDF Formate'
      return
    }
    var url = '/api/recruitment/jobsList/';
    var fd = new FormData();
    console.log(f.resume, 'aaaaaaaa');
    // if (f.resume != null && f.resume != emptyFile) {
    //   console.log("aaaaaaaaaa");
    // }
    fd.append('resume', f.resume)
    fd.append('firstname', f.firstname);
    fd.append('email', f.email);
    fd.append('mobile', f.mobile);
    fd.append('job', $scope.job.pk);
    if (f.aggree) {
      fd.append('aggree', f.aggree);
    }
    if (f.coverletter.length > 0) {
      fd.append('coverletter', f.coverletter);
    }
    if (f.lastname.length > 0) {
      fd.append('lastname', f.lastname);
    }

    console.log(fd, 'aaaaaaaaaaaaaa');
    var method = 'POST';

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
      console.log(response.data);
      if (response.data.res == 'Sucess') {
        $scope.resetForm();
        $scope.msg = 'Applied Sucessfully'
        $timeout(function() {
          $uibModalInstance.dismiss();
        }, 3000);
      } else {
        $scope.msg = 'Errors In The Form'
      }
    })
  }


  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };



});

app.controller("recruitment.resume.view", function($scope, $state, $users, $stateParams, $http, Flash, $uibModalInstance, job) {
  $scope.job = job;
  $scope.resumes = {}
  $scope.cancel = function(e) {
    $uibModalInstance.dismiss();
  };

  $http({
    method: 'GET',
    url: '/api/recruitment/applyJob/' + $scope.job
  }).
  then(function(response) {
    console.log(response.data, 'aaaaa');
    $scope.resumes = response.data;
  });


});

app.controller("recruitment.jobs.selected", function($scope, $state, $users, $stateParams, $http, Flash) {

  $scope.jobDetails = $scope.data.tableData[$scope.tab.data.index]

  $scope.columns = [
    // {icon : 'fa-pencil-square-o' , text : 'Created' , cat : 'created'},
    {
      icon: 'fa-desktop',
      text: 'Techical Interview',
      cat: 'TechicalInterview'
    },
    {
      icon: 'fa-user-circle-o ',
      text: 'HR Interview',
      cat: 'HRInterview'
    },
    {
      icon: 'fa-bars ',
      text: 'Negotiation',
      cat: 'Negotiation'
    },

  ]

  $scope.fetchDeals = function() {
    $http({
      method: 'GET',
      url: '/api/recruitment/applyJob/?job=' + $scope.jobDetails.pk + '&status__in!=Created,Closed,Onboarding'
    }).
    then(function(response) {
      $scope.List = response.data;
      $scope.data = {
        TechicalInterview: [],
        HRInterview: [],
        Negotiation: []
      }
      console.log(response.data);
      for (var i = 0; i < response.data.length; i++) {
        $scope.data[response.data[i].status].push(response.data[i])
      }
    });
  }

  $scope.fetchDeals();
  $scope.isDragging = false;

  // $scope.$on('exploreDeal', function(event, input) {
  //   $scope.addTab({
  //     "title": "Details :" + input.deal.name,
  //     "cancel": true,
  //     "app": "exploreDeal",
  //     "data": {
  //       "pk": input.deal.pk
  //     },
  //     "active": true
  //   })
  // });
  //
  // $scope.exploreDeal = function(deal , evt) {
  //   if ($scope.isDragging) {
  //     $scope.isDragging = false;
  //   }else {
  //     $scope.$emit('exploreDeal', {
  //       deal: deal
  //     });
  //   }
  // }
  $scope.exploreApplicant = function(applicant, evt) {
    if ($scope.isDragging) {
      $scope.isDragging = false;
    } else {
      $scope.addTab({
        "title": "Applicant : " + applicant.firstname,
        "cancel": true,
        "app": "applicant",
        "data": {
          "pk": applicant.pk
        },
        "active": true
      })
    }
  }
  $scope.$on('draggable:start', function(data) {
    $scope.isDragging = true;
  });

  $scope.removeFromData = function(pk) {
    for (var key in $scope.data) {
      if ($scope.data.hasOwnProperty(key)) {
        for (var i = 0; i < $scope.data[key].length; i++) {
          if ($scope.data[key][i].pk == pk) {
            $scope.data[key].splice(i, 1);
            return;
          }
        }
      }
    }
  }

  $scope.onDropComplete = function(data, evt, newState) {
    if (data == null) {
      return;
    }
    $scope.removeFromData(data.pk);
    $scope.data[$scope.columns[newState].cat].push(data);
    console.log($scope.columns[newState].cat);
    console.log(data);

    var dataToSend = {
      status: $scope.columns[newState].cat
    }

    $http({
      method: 'PATCH',
      url: '/api/recruitment/applyJob/' + data.pk + '/',
      data: dataToSend
    }).
    then(function(Response) {}, function(err) {
      Flash.create('danger', 'Error while updating')
    });
    console.log("drop complete");
  }
});

app.controller("recruitment.applicant.view", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.applicant = []
  $scope.schedules = []
  $scope.fetchDeal = function() {

    $http({
      method: 'GET',
      url: '/api/recruitment/applyJob/' + $state.params.id
    }).
    then(function(response) {
      $scope.applicant = response.data;
      $http({
        method: 'GET',
        url: '/api/recruitment/interview/?candidate=' + $scope.applicant.pk
      }).
      then(function(response) {
        $scope.schedules = response.data;
      });
      $http({
        method: 'GET',
        url: '/api/recruitment/applyJob/?email=' + $scope.applicant.email + '&mobile=' + $scope.applicant.mobile
      }).
      then(function(response) {
        console.log(response.data, 'dddddddddddddddd');
        $scope.pastApplyHistory = response.data;
      });
    });
  }
  $scope.fetchDeal()

  $scope.rejected = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.recruitment.rejected.reason.html',
      size: 'sm',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.applicant;
        },
      },
      controller: function($scope, data, $uibModalInstance) {
        console.log(data,'-------ffdsffsdf');
        $scope.reject = function() {
          var toSend = {
            status: 'Closed',
            rejectReason: $scope.form.rejectReason,
          }
          var method = 'PATCH';
          var url = '/api/recruitment/applyJob/' + data.pk + '/';
          $http({
            method: method,
            url: url,
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Done !');
            $uibModalInstance.dismiss(response);
          })
        }
      },
    })
  }

// $scope.onBoard = function() {
//   var toSend = {
//     status: 'Onboarding'
//   }
//   var method = 'PATCH';
//   var url = '/api/recruitment/applyJob/' + $scope.applicant.pk + '/';
//   $http({
//     method: method,
//     url: url,
//     data: toSend
//   }).
//   then(function(response) {
//     Flash.create('success', 'Done !');
//   })
// }
$scope.offer = function() {
  console.log("aaaaaaaaaaa");
  var toSend = {
    first_name: $scope.applicant.firstname,
    last_name: $scope.applicant.lastname,
    emailID: $scope.applicant.email,
    value: $scope.applicant.pk,
    jobType: $scope.applicant.job.jobtype,
    job: $scope.applicant.job.role.name,
  }
  $http({
    method: 'POST',
    url: '/api/recruitment/sendCallLetter/',
    data: toSend
  }).
  then(function() {
    Flash.create('success', 'Email sent successfully')
  })
}


$scope.onlineTest = function() {
  var toSend = {
    first_name: $scope.applicant.firstname,
    last_name: $scope.applicant.lastname,
    emailID: $scope.applicant.email,
    value: 'online',
  }
  $http({
    method: 'POST',
    url: '/api/recruitment/onlinelink/',
    data: toSend
  }).
  then(function() {
    Flash.create('success', 'Email sent successfully')
  })
}


$scope.resetForm = function() {
  $scope.form = {
    'interviewer': '',
    'interviewDate': new Date(),
    'mode': '',
  }
}
$scope.resetForm();

$scope.schedule = function() {
  console.log($scope.form.interviewer.pk, 'aaaaaaaaaaaaa');
  if (typeof $scope.form.interviewer != 'object') {
    Flash.create('warning', 'please Select Suggested Interviewer')
    return
  }
  if ($scope.form.mode.length == 0) {
    Flash.create('warning', 'please Select Interview Mode')
    return
  }
  var toSend = {
    interviewer: $scope.form.interviewer.pk,
    interviewDate: $scope.form.interviewDate,
    candidate: $scope.applicant.pk,
    mode: $scope.form.mode
  }
  console.log('svchhhhhhhhhhhhhhhhh', toSend);
  $http({
    method: 'POST',
    url: '/api/recruitment/interview/',
    data: toSend
  }).
  then(function(response) {
    $scope.callleter(response.data);
    $scope.schedules.push(response.data);
    Flash.create('success', 'Saved')
    $scope.resetForm();
  })
}

$scope.saveData = function() {
  if ($scope.applicant.joiningDate == null) {
    Flash.create('warning', 'please Select Date Of Joining')
    return
  }
  var toSend = {
    hra: $scope.applicant.hra,
    basic: $scope.applicant.basic,
    lta: $scope.applicant.lta,
    special: $scope.applicant.special,
    taxSlab: $scope.applicant.taxSlab,
    adHoc: $scope.applicant.adHoc,
    al: $scope.applicant.al,
    ml: $scope.applicant.ml,
    adHocLeaves: $scope.applicant.adHocLeaves,
    amount: $scope.applicant.amount,
    notice: $scope.applicant.notice,
    probation: $scope.applicant.probation,
    off: $scope.applicant.off,
    probationNotice: $scope.applicant.probationNotice,
    noticePeriodRecovery: $scope.applicant.noticePeriodRecovery,
  }
  if (typeof $scope.applicant.joiningDate == 'object') {
    toSend.joiningDate = $scope.applicant.joiningDate.toJSON().split('T')[0]
  } else {
    toSend.joiningDate = $scope.applicant.joiningDate
  }
  $http({
    method: 'PATCH',
    url: '/api/recruitment/applyJob/' + $scope.applicant.pk + '/',
    data: toSend
  }).
  then(function(response) {
    Flash.create('success', 'Saved')
  })
}

$scope.addToOnboard = function() {
  var toSend = {
    status: 'Onboarding',
  }
  $http({
    method: 'PATCH',
    url: '/api/recruitment/applyJob/' + $scope.applicant.pk + '/',
    data: toSend
  }).
  then(function(response) {
    Flash.create('success', 'Saved')

  })
}

$scope.interviewerSearch = function(query) {
  return $http.get('/api/HR/userSearch/?limit=10&username__contains=' + query).
  then(function(response) {
    return response.data.results;
  })
}
$scope.getName = function(u) {
  if (u != undefined && u.first_name != undefined) {
    return u.first_name + '  ' + u.last_name;
  }
}

$scope.sendSMS = function() {
  console.log("aaaaaaaaaaaaa");
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.recruitment.jobs.applicant.sms.html',
    size: 'sm',
    backdrop: true,
    // resolve: {
    //   data: function() {
    //     return $scope.data;
    //   }
    // },
    controller: "workforceManagement.recruitment.jobs.applicant.sms",
  }).result.then(function() {

  }, function() {

  });
}
$scope.sendMail = function() {
  console.log("aaaaaaaaaaaaa");
  $uibModal.open({
    templateUrl: '/static/ngTemplates/app.recruitment.jobs.applicant.email.html',
    size: 'lg',
    backdrop: true,
    resolve: {
      data: function() {
        return $scope.applicant;
      }
    },
    controller: "workforceManagement.recruitment.jobs.applicant.email",
  }).result.then(function() {

  }, function() {

  });
}
$scope.callleter = function(data) {

  var toSend = {
    first_name: $scope.applicant.firstname,
    last_name: $scope.applicant.lastname,
    emailID: $scope.applicant.email,
    status: $scope.applicant.status,
    dateSch: data.interviewDate,
    value: data.mode,
  }
  $http({
    method: 'POST',
    url: '/api/recruitment/inviteInterview/',
    data: toSend
  }).
  then(function() {
    Flash.create('success', 'Email sent successfully')
  })
  var sendData = {
    first_name: $scope.applicant.firstname,
    last_name: $scope.applicant.lastname,
    resume: $scope.applicant.resume,
    interviewer: data.interviewer.profile.pk,
    interviewer_firstname: data.interviewer.first_name,
    interviewer_lastname: data.interviewer.last_name,
    status: $scope.applicant.status,
    dateSch: data.interviewDate,
    value: data.mode,
    jobType: $scope.applicant.job.jobtype,
    job: $scope.applicant.job.role.name,
  }
  $http({
    method: 'POST',
    url: '/api/recruitment/scheduleInterview/',
    data: sendData
  }).
  then(function() {
    Flash.create('success', 'Email sent successfully')
  })
}
$scope.download = function() {
$http({
  method: 'GET',
  url: '/api/recruitment/downloadCallLeter/?value=' + $scope.applicant.pk
}).
then(function(response) {
  Flash.create('success', 'Saved')
}, function(err) {
  Flash.create('danger', 'Error occured')
})

}
});
app.controller("workforceManagement.recruitment.jobs.applicant.sms", function($scope, $state, $users, $stateParams, $http, Flash) {});


app.controller("workforceManagement.recruitment.jobs.applicant.email", function($scope, $state, $users, $stateParams, $http, Flash, data) {
  $scope.applicant = data,
    $scope.resetEmail = function() {
      $scope.form = {
        subject: '',
        email: ''
      }
    }
  $scope.resetEmail();
  $scope.send = function() {
    if ($scope.form.email == '') {
      Flash.create('warning', 'Email body is Empty')
    }
    var toSend = {
      first_name: $scope.applicant.firstname,
      last_name: $scope.applicant.lastname,
      emailID: $scope.applicant.email,
      status: $scope.applicant.status,
      message: $scope.form.email,
      subject: $scope.form.subject,
      value: 'email'
    }
    $http({
      method: 'POST',
      url: '/api/recruitment/onlinelink/',
      data: toSend
    }).
    then(function() {
      Flash.create('success', 'Email sent successfully')
      $scope.resetEmail();
    })
  }
});
