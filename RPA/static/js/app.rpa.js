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

  $scope.getProcess = function(){
    $http({
      method: 'GET',
      url: '/api/RPA/process/',
    }).then(function(response) {
      $scope.processList = response.data
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
