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
    .state('businessManagement.rpa.queue', {
      url: "/queue",
      templateUrl: '/static/ngTemplates/app.rpa.queue.html',
      controller: 'businessManagement.queue',
    })


});


app.controller('businessManagement.rpa', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {


})

app.controller('businessManagement.job', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {




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
        $scope.getQueues = function(){
          $http({
            method: 'GET',
            url: '/api/RPA/queue/',
          }).then(function(response) {
            $scope.queuesList = response.data
          })
        }
        $scope.getQueues()

        $scope.statusList = ['queued', 'started', 'failed', 'success', 'aborted']

        if (job != undefined) {
          $scope.form = job
        }else {
          $scope.reset = function() {
            $scope.form = {
              retryCount: 0,
              status: 'queued',
              process: '',
              queue: ''
            }
          }
          $scope.reset()

        }

        $scope.save = function() {
          var datatoSend = {
            retryCount: $scope.form.retryCount,
            status: $scope.form.status,
            process: $scope.form.process.pk,
            queue: $scope.form.queue.pk
          }
          var method= 'POST'
          var url ="/api/RPA/job/"
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
      $scope.getJobs()
    });



  }


  $scope.getJobs = function(){
    $http({
      method:'GET',
      url:'/api/RPA/job/'
    }).then(function(response){
      $scope.jobs = response.data
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

  $scope.createProcess = function(job) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.createProcess.html',
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
        var myElement = document.getElementById("editor"); 
        console.log(myElement,'myElement');

        if (job != undefined) {
          $scope.form = job
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




        $scope.getProcess = function(){
          $http({
            method: 'GET',
            url: '/api/RPA/process/',
          }).then(function(response) {
            $scope.processList = response.data
          })
        }
        $scope.getProcess()

        $scope.getQueues = function(){
          $http({
            method: 'GET',
            url: '/api/RPA/queue/',
          }).then(function(response) {
            $scope.queuesList = response.data
          })
        }
        $scope.getQueues()

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
      $scope.getProcess()
    });



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

  $scope.deleteProcess = function(id){
    $http({
      method: 'DELETE',
      url: '/api/RPA/process/'+id+'/',
    }).then(function(response) {
      $scope.getProcess()
    })
  }
  



})
app.controller('businessManagement.queue', function($scope, $users, Flash, $permissions, $http, $aside, $uibModal) {


  $scope.queueModal = function(item) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.rpa.createQueue.html',
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

        $scope.getProcess = function(){
          $http({
            method: 'GET',
            url: '/api/RPA/process/',
          }).then(function(response) {
            $scope.processList = response.data
          })
        }
        $scope.getProcess()

        if (item != undefined) {
          $scope.form = item
        }else {
          $scope.reset = function() {
            $scope.form = {
              name: '',
              process: '',
            }
          }
          $scope.reset()
        }





        $scope.save = function() {
          if(typeof $scope.form.process != 'object'){
            Flash.create('warning', 'Kindly select a process')
          }  

          var datatoSend = {
            name: $scope.form.name,
            process: $scope.form.process.pk
          }
          var method= 'POST'
          var url ="/api/RPA/queue/"
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
      $scope.getQueues()
    });



  }


  $scope.getQueues = function(){
    $http({
      method: 'GET',
      url: '/api/RPA/queue/',
    }).then(function(response) {
      $scope.queuesList = response.data
    })
  }
  $scope.getQueues()

  $scope.deleteQueue = function(id){
    $http({
      method: 'DELETE',
      url: '/api/RPA/queue/'+id+'/',
    }).then(function(response) {
      $scope.getQueues()
    })
  }
  







})
