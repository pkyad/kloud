app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.rpa', {
      url: "/rpa",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.rpa.html',
          controller: 'businessManagement.rpa'
        },

        "@businessManagement.rpa": {
          templateUrl: '/static/ngTemplates/app.rpa.jobs.html',
          controller: 'businessManagement.job'
        }
      }
    })

    .state('businessManagement.rpa.jobs', {
      url: "/job",
      templateUrl: '/static/ngTemplates/app.rpa.jobs.html',
      controller: 'businessManagement.job',
    })
    .state('businessManagement.rpa.process', {
      url: "/process",
      templateUrl: '/static/ngTemplates/app.rpa.process.html',
      controller: 'businessManagement.process',
    })

    .state('businessManagement.rpa.machine', {
      url: "/machine",
      templateUrl: '/static/ngTemplates/app.rpa.machine.html',
      controller: 'businessManagement.machine',
    })
    .state('businessManagement.rpa.viewjob', {
      url: "/viewjob/:id",
      templateUrl: '/static/ngTemplates/app.rpa.viewjob.html',
      controller: 'businessManagement.viewjob',
    })
});


app.controller('businessManagement.rpa', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal, $state) {


})
app.controller('businessManagement.viewjob', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal, $state) {
  $scope.form = {
    search : ''
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.prev = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.getJobs()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.getJobs()
    }
  }


  $scope.getJobs = function(){
    var url = '/api/RPA/jobContext/?job='+$state.params.id+'&limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.form.search!=null && $scope.form.search.length>0) {
      url+='&search='+$scope.form.search
    }
    $http({
      method:'GET',
      url: url
    }).then(function(response){
      $scope.contextData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.getJobs()
  $scope.editJobContext = function(indx){
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.editJobContext.html',
      backdrop: true,
      size: "lg",
      resolve: {
        data:function(){
          return $scope.contextData[indx]
        }
      },
      controller: function($scope, $http, $uibModalInstance, Flash, $state,data) {
        $scope.form = data
        $scope.save = function(){
          $http({
            method:'PATCH',
            url: '/api/RPA/jobContext/'+$scope.form.pk+'/',
            data:{
              value : $scope.form.value
            }
          }).then(function(response){
              $uibModalInstance.dismiss()
          })
        }








      }
    }).result.then(function() {

    }, function() {
    });
  }

})

app.controller('businessManagement.job', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {

  $scope.deleteJob = function(pk){
    $http({
      method:'DELETE',
      url: '/api/RPA/job/'+pk+'/'
    }).then(function(response){
        $scope.getJobs()
    })
  }




  $scope.createrpaJob = function(job) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.createJob.html',
      backdrop: true,
      size: "lg",
      resolve: {
        job:function(){
          return job
        }
      },
      controller: function($scope, $http, $uibModalInstance, Flash, $state,job) {
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }

        $scope.getProcess = function(){
          $http({
            method: 'GET',
            url: '/api/RPA/process/',
          }).then(function(response) {
            $scope.processList = response.data
          })
        }
        $scope.getProcess()


        $scope.processSelected = function(){

          try {
            console.log($scope.form.process.argSchema,'$scope.form.process.argSchema');
            $scope.processForm = JSON.parse($scope.form.process.argSchema)
            console.log($scope.processForm,'process json object');
          } catch (e) {
            Flash.create('warning','Kindly check process form configuration json object')
          }

        }


        $scope.statusList = ['queued', 'started', 'failed', 'success', 'aborted']

        if (job != undefined) {
          $scope.form = job
        }else {
          $scope.reset = function() {
            $scope.form = {
              process: ''
            }
          }
          $scope.reset()

        }

        $scope.save = function() {
          var datatoSend = {
            retryCount: $scope.form.retryCount,
            status: $scope.form.status,
            process: $scope.form.process.pk,
            // queue: $scope.form.queue.pk,
            processForm : $scope.processForm
          }
          var method= 'POST'
          var url ="/api/RPA/createJob/"
          if ($scope.form.pk != undefined) {
            method = "PATCH"
            url += $scope.form.pk+'/'
          }
          $http({
            method: method,
            url: url,
            data: datatoSend
          }).then(function(response) {
            if ($scope.form.pk != undefined) {
              Flash.create('success', 'Updated..!!!!!')
            } else {
              Flash.create('success', 'Created..!!!!!')

            }
            $scope.close()
          })

        }

      }
    }).result.then(function() {

    }, function() {
      $scope.getJobs()
    });



  }
  $scope.form = {
    search : ''
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.prev = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.getJobs()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.getJobs()
    }
  }
  $scope.getJobs = function(){
    var url = '/api/RPA/job/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.form.search!=null && $scope.form.search.length>0) {
      url+='&search='+$scope.form.search
    }
    $http({
      method:'GET',
      url: url
    }).then(function(response){
      $scope.jobs = response.data.results
      $scope.count =  response.data.count
    })
  }
  $scope.getJobs()

  $scope.delJob = function(idx){
    $http({
      method:'DELETE',
      url:'/api/RPA/job/'+  $scope.jobs[idx].pk+'/'
    }).then(function(response){
        $scope.jobs.splice(idx,1)
        Flash.create('success','Deleted.....!!!')
        $scope.getJobs()
    })
  }

})



app.controller('businessManagement.process', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {
  $scope.form = {
    search : ''
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.prev = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.getProcess()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.getProcess()
    }
  }



  $scope.getProcess = function(){
    var url = '/api/RPA/process/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.form.search!=null && $scope.form.search.length>0) {
      url+='&search='+$scope.form.search
    }
    $http({
      method: 'GET',
      url: url,
    }).then(function(response) {
      $scope.processList = response.data.results
      $scope.count = response.data.count

    })
  }
  $scope.getProcess()


  $scope.createProcess = function(item) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.createProcess.html',
      backdrop: true,
      size: "lg",
      resolve: {
        item:function(){
          return item
        }
      },
      controller: function($scope, $http, $uibModalInstance, Flash, $state,item) {
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }
        var myElement = document.getElementById("editor");
        console.log(myElement,'myElement');

        if (item != undefined) {
          $scope.form = item
        }else {
          $scope.reset = function() {
            $scope.form = {
              name: '',
              uri: '',
              argSchema: '',
              env: ''
            }
          }
          $scope.reset()

        }



        $scope.statusList = ['queued', 'started', 'failed', 'success', 'aborted']


        $scope.init = function() {
          $scope.aceEditorSchema = ace.edit("editor");
          $scope.aceEditorSchema.setTheme("ace/theme/gruvbox");
          $scope.aceEditorSchema.getSession().setMode("ace/mode/json");
          $scope.aceEditorSchema.getSession().setUseWorker(false);
          $scope.aceEditorSchema.setHighlightActiveLine(false);
          $scope.aceEditorSchema.setShowPrintMargin(false);
          ace.require("ace/ext/language_tools");
          $scope.aceEditorSchema.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
          });
          $scope.aceEditorSchema.setFontSize("14px");
          $scope.aceEditorSchema.setBehavioursEnabled(true);
          if ($scope.form.argSchema != undefined) {
            $scope.aceEditorSchema.setValue($scope.form.argSchema, -1);
          }
      }

        $uibModalInstance.rendered.then($scope.init);



        $scope.save = function() {
          var datatoSend = {
            name: $scope.form.name,
            uri: $scope.form.uri,
            argSchema: $scope.aceEditorSchema.getValue(),
            env: $scope.form.env
          }
          var method= 'POST'
          var url ="/api/RPA/process/"
          if ($scope.form.pk != undefined) {
            method = "PATCH"
            url += $scope.form.pk+'/'
          }
          $http({
            method: method,
            url: url,
            data: datatoSend
          }).then(function(response) {
            // if ($scope.form.pk != undefined) {
            //   Flash.create('success', 'Updated..!!!!!')
            // } else {
            //   Flash.create('success', 'Created..!!!!!')

            // }
            $scope.close()
          })

        }

      }
    }).result.then(function() {

    }, function() {
      $scope.getProcess()
    });




  }





  $scope.deleteProcess = function(id){
    $http({
      method: 'DELETE',
      url: '/api/RPA/process/'+id+'/',
    }).then(function(response) {
      $scope.getProcess()
    })
  }

})

app.controller('businessManagement.machine', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {

  $scope.form = {
    search : ''
  }
  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.prev = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.getMachine()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.getMachine()
    }
  }

  $scope.openModal = function(item) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.createMachine.html',
      backdrop: true,
      size: "lg",
      resolve: {
        item:function(){
          return item
        }
      },
      controller: function($scope, $http, $uibModalInstance, Flash, $state,item) {
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }


        if (item != undefined) {
          $scope.form = item
        }else {
          $scope.reset = function() {
            $scope.form = {
              name: '',
              env:''
            }
          }
          $scope.reset()

        }

        $scope.save = function() {
          var datatoSend = {
            name: $scope.form.name,
            env : $scope.form.env
          }
          var method= 'POST'
          var url ="/api/RPA/machine/"
          if ($scope.form.pk != undefined) {
            method = "PATCH"
            url += $scope.form.pk+'/'
          }
          $http({
            method: method,
            url: url,
            data: datatoSend
          }).then(function(response) {

            $scope.close()
          })

        }

      }
    }).result.then(function() {

    }, function() {
      $scope.getMachine()
    });



  }


  $scope.getMachine = function(){
    var url = '/api/RPA/machine/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.form.search!=null && $scope.form.search.length>0) {
      url+='&search='+$scope.form.search
    }
    $http({
      method: 'GET',
      url: url,
    }).then(function(response) {
      $scope.machineList = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.getMachine()

  $scope.delMachine = function(id){
    $http({
      method:'DELETE',
      url:'/api/RPA/machine/'+  id+'/'
    }).then(function(response){
        $scope.getMachine()
    })
  }

})
