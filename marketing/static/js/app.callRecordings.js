app.config(function($stateProvider) {

  $stateProvider
  .state('businessManagement.callRecordings', {
    url: "/qualityCheck",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.marketing.qualityCheck.html',
        controller : 'businessManagement.qualityCheck',
      }
    }
  })

});



app.controller("businessManagement.qualityCheck", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal , $timeout) {


  $scope.callRecordings = false


  $scope.data = []

  $scope.setupWave = function(dataIndex,indx , fileUrl , fileUrl2) {
    $timeout(function() {
      console.log(indx,'indx');
      $scope.data[dataIndex].logs[indx].wavesurfer = WaveSurfer.create({
          container: '#waveform' + indx,
          waveColor: 'rgb(153, 153, 153)',
          progressColor: '#F9F9F9'
      });
      $scope.data[dataIndex].logs[indx].wavesurfer2 = WaveSurfer.create({
          container: '#waveform2' + indx,
          waveColor: 'rgb(153, 153, 153)',
          progressColor: '#F9F9F9'
      });

      // $scope.data.logs[indx].wavesurfer.load('/static/audio/testCall.mp3');
      $scope.data[dataIndex].logs[indx].wavesurfer.load(fileUrl);
      $scope.data[dataIndex].logs[indx].wavesurfer2.load(fileUrl2);
    },0)

  }
  $scope.updatePlayTime = function(cdr,playedTime) {
    $http({
      method: 'GET',
      url: '/api/marketing/updatePlayTime/?pk='+cdr+'&playTime='+playedTime
    }).
    then(function(response) {
      console.log(response.data,'log data');

    })
  }

  $scope.play = function(dataIndex,indx) {
    console.log('play clicked');
    $scope.data[dataIndex].logs[indx].wavesurfer.play()
    $scope.data[dataIndex].logs[indx].wavesurfer2.play()
    //set to end time
    $scope.updatePlayTime($scope.data[dataIndex].logs[indx].pk,$scope.data[dataIndex].logs[indx].duration)
  }
  $scope.pause = function(dataIndex,indx) {
    console.log('pause clicked');
    $scope.data[dataIndex].logs[indx].wavesurfer.pause()
    $scope.data[dataIndex].logs[indx].wavesurfer2.pause()
    //set to paused time
    console.log($scope.data[dataIndex].logs[indx].wavesurfer.getCurrentTime(),'currentTime');
    $scope.updatePlayTime($scope.data[dataIndex].logs[indx].pk,Math.round($scope.data[dataIndex].logs[indx].wavesurfer.getCurrentTime()))
  }



  $scope.fetchData = function(index,contact) {
    $http({
      method: 'GET',
      url: '/api/marketing/fetchSIPCalls/?limit=10&offset=0&contact=' + contact
    }).
    then(function(response) {
      $scope.data[index]['logs'] = response.data.results;
      for (var i = 0; i < $scope.data[index].logs.length; i++) {
        // $sce.trustAsResourceUrl($scope.data.logs[i].fileUrl)
        $scope.data[index].logs[i].fileUrl = 'https://iondialer.cioc.in:5000/' + $scope.data[index].logs[i].userfield + '-in.wav';
        $scope.data[index].logs[i].fileUrl2 = 'https://iondialer.cioc.in:5000/' + $scope.data[index].logs[i].userfield + '-out.wav';

        var parts = $scope.data[index].logs[i].userfield.split('_');
        if (parts[0].length <6) {
          $scope.data[index].logs[i].userPk = parseInt(parts[0])-100;
        }else{
          $scope.data[index].logs[i].caller = parts[0]
        }
        $scope.data[index].logs[i].to = parts[1]

        console.log($scope.data[index].logs[i]);


      }

    })
  }


  $scope.fetchRecording = function(){
    console.log('console log herer');
    // $state.go("businessManagement.callRecordings.recordings")
    $scope.callRecordings = true
  }




  console.log($scope.sound, '0990430903009');

  $scope.material_inward = MATERIAL_INWARD

  $scope.filter = {
    dt: new Date(),
    searchTxt: ''
  }




  $scope.fetch = function() {
    if (typeof $scope.selected == 'string' && $scope.selected.length >0){
      if ($scope.selected =='approved'){
        $scope.callRecordings = false;
        url = '/api/marketing/contacts/?qcApproved=true&limit=20&offset=0'
      }
      if ($scope.selected =='rejected'){
        $scope.callRecordings = false;
        url = '/api/marketing/contacts/?qcApproved=false&limit=20&offset=0'
      }
    }
    else{
        url = '/api/marketing/contacts/?qcApproved=false&limit=20&offset=0'
    }
    if ( $scope.filter.searchTxt.length>0) {
      url = url +'/api/marketing/contacts/?search=' + $scope.filter.searchTxt
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.data = response.data.results;
      for (var i=0;i < $scope.data.length;i++){
        $scope.fetchData(i,$scope.data[i].mobile)

      }
    })
  }





$scope.fetch()

  $scope.qcAction = function(contactPk, type, indx) {
    dataToSend = {}
    // $scope.type = type
    // if (type == 'rejected') {
    //   $scope.data[indx].showcomment = true
    //
    // }
    if(type == 'approve'){
      dataToSend['qcReviewed'] = true;
      dataToSend['qcApproved'] = true;
    }
    if(type == 'reject'){
      dataToSend['qcReviewed'] = true;
      dataToSend['qcApproved'] = false;
    }

    $http({
      method: 'PATCH',
      url: '/api/marketing/contacts/'+contactPk+ '/',
      data : dataToSend
    }).
    then(function(response) {
      Flash.create('success','Successfully approved the lead.')
      // $scope.data[indx].qcReviewed = response.data.qcReviewed
      // $scope.data[indx].qcApproved = response.data.qcApproved
      $scope.fetch()
      console.log(response.data)
      // $scope.fetch()
    })

  }


$scope.send = function(cmnt,indx , id){
  console.log(indx,'aaaaaaaaaaaaaaaaa');
  if (cmnt.length == 0) {
    Flash.create('warning' , 'Add Comments')
    return

  }
  $http({
    method: 'POST',
    url: '/api/marketing/sendNofctn/',
    data : {
      'contact' : id,
      'comment' : cmnt,
    }
  }).
  then(function(response) {
    Flash.create('success','Sent')
    $scope.data[indx].showcomment = false
    $scope.fetch()
  })

}






  $scope.$watch('filter.dt', function(newValue, oldValue) {
    $scope.fetch();
  })

  $scope.newContact = function(indx) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.newContact.html',
      size: 'lg',
      placement: 'right',
      backdrop: false,
      resolve: {
        data: function() {
          if (indx == undefined || indx == null) {
            return null
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

  $scope.openMaterialInward = function(indx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.contact.materialInwardNote.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.data[indx]
        }
      },
      controller: "businessManagement.marketing.materialInwardNote",
    }).result.then(function() {
      $scope.fetch()
    }, function(res) {
      $scope.fetch()
    });
  }

  $scope.call = function(num) {
    $rootScope.$broadcast("call", {type : 'call' , number : num , source : 'campaign' , id : $scope.data.pk });
  }


})

app.controller("businessManagement.recordings", function($scope, $state, $users, $stateParams, $http, Flash, $aside, $sce, $uibModal , $timeout) {

  console.log('businessManagement.marketing.callRecordings','herer');

  $scope.setupWave = function(indx , fileUrl , fileUrl2) {
    $timeout(function() {
      $scope.data.logs[indx].wavesurfer = WaveSurfer.create({
          container: '#waveform' + indx,
          waveColor: 'rgb(153, 153, 153)',
          progressColor: '#F9F9F9'
      });
      $scope.data.logs[indx].wavesurfer2 = WaveSurfer.create({
          container: '#waveform2' + indx,
          waveColor: 'rgb(153, 153, 153)',
          progressColor: '#F9F9F9'
      });

      // $scope.data.logs[indx].wavesurfer.load('/static/audio/testCall.mp3');
      $scope.data.logs[indx].wavesurfer.load(fileUrl);
      $scope.data.logs[indx].wavesurfer2.load(fileUrl2);
    },0)

  }


  $scope.play = function(indx) {
    $scope.data.logs[indx].wavesurfer.play()
    $scope.data.logs[indx].wavesurfer2.play()
  }
  $scope.pause = function(indx) {
    $scope.data.logs[indx].wavesurfer.pause()
    $scope.data.logs[indx].wavesurfer2.pause()
  }

  $scope.data = {
    page: 0,
    logs: []
  }

  $scope.next = function() {
    $scope.data.page += 1;
    $scope.fetchData();
  }

  $scope.prev = function() {
    if ($scope.data.page > 0) {
      $scope.data.page -= 1;
    }
    $scope.fetchData();
  }
  $scope.searchForm = {
    search: ''
  }
  $scope.fetchData = function() {
    $http({
      method: 'GET',
      url: '/api/marketing/fetchSIPCalls/?limit=10&offset=' + $scope.data.page * 10 + '&userfield__contains=' + $scope.searchForm.search
    }).
    then(function(response) {
      $scope.data.logs = response.data.results;
      for (var i = 0; i < $scope.data.logs.length; i++) {
        // $sce.trustAsResourceUrl($scope.data.logs[i].fileUrl)
        $scope.data.logs[i].fileUrl = 'https://iondialer.cioc.in:5000/' + $scope.data.logs[i].userfield + '-in.wav';
        $scope.data.logs[i].fileUrl2 = 'https://iondialer.cioc.in:5000/' + $scope.data.logs[i].userfield + '-out.wav';

        var parts = $scope.data.logs[i].userfield.split('_');
        if (parts[0].length <6) {
          $scope.data.logs[i].userPk = parseInt(parts[0])-100;
        }else{
          $scope.data.logs[i].caller = parts[0]
        }
        $scope.data.logs[i].to = parts[1]

        console.log($scope.data.logs[i]);



      }

    })
  }

  $scope.fetchData();



  $scope.report = function(log, indx) {


    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.marketing.servicing.qualityReport.html',
      size: 'sm',
      backdrop: true,
      resolve: {
        log: function() {
          return log
        }
      },
      controller: function($scope, $http, Flash, $uibModal, $uibModalInstance, log) {
        $scope.data = {
          text: '',
          log: log
        }
        $scope.sendMail = function() {
          $http({
            method: 'POST',
            url: '/api/marketing/sendCallReport/',
            data: {
              log: $scope.data.log.pk,
              text: $scope.data.text
            }
          }).
          then(function(response) {
            Flash.create('success', 'Call reported Successfully')
            $uibModalInstance.dismiss();
          })
        }


      },
    });



  }

  // console.log(  $scope.sounddata = ngAudio.load(data[idx].file.id););
  console.log($scope.sound, '0990430903009');
})
