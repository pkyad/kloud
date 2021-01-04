app.controller('businessManagement.finance.reconciliation', function($scope, $http, $aside, $state, Flash, $users, $filter, $rootScope) {

  $scope.data = {
    tableData: [],
  };

  views = [{
    name: 'list',
    icon: 'fa-th-large',
    template: '/static/ngTemplates/genericTable/genericSearchList.html',
    itemTemplate: '/static/ngTemplates/app.finance.reconciliation.item.html',
  }, ];


  $scope.config = {
    views: views,
    url: '/api/finance/reportreconciliation/',
    searchField: 'name',
    itemsNumPerView: [12, 24, 48],
  }


  $scope.tableAction = function(target, action, mode) {
    for (var i = 0; i < $scope.data.tableData.length; i++) {
      if ($scope.data.tableData[i].id == parseInt(target)) {
        if (action == 'details') {
          var title = 'PO Details :';
          var appType = 'details';
        }  else if (action == 'reconciliationExplorer') {
          var title = 'Details :';
          var appType = 'reconciliationExplorer';
        }
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
    $http({
      method: 'GET',
      url: '/api/finance/reportreconciliation/' + $scope.data.id,
    }).
    then(function(response) {
      $scope.data = response.data

    })


})





app.controller("businessManagement.finance.reconciliation.form", function($scope,$filter, $state, $users, $stateParams, $http, Flash, $uibModal, ) {
  $scope.resetForm = function() {
    $scope.form = {
      sheet: emptyFile,
      date: '',
      name: '',
      msg : '',
    }
  }
  $scope.resetForm()


  $scope.upload = function() {
    if ($scope.form.sheet == emptyFile) {
      Flash.create('warning', 'No file selected')
      return
    }
    var fd = new FormData()
    fd.append('name', $scope.form.name);
    fd.append('date', $scope.form.date.toJSON().split('T')[0]);
    fd.append('xl', $scope.form.sheet);
    $scope.form.msg = "Uploading Data"
    $http({
      method: 'POST',
      url: '/api/finance/reconciliationsheet/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success',response.data.count+ 'Data Added');
        $scope.resetForm()
        $scope.form.msg = "Uploaded"
    })

  }

   })


app.controller("businessManagement.finance.reconciliation.explore", function($scope,$filter, $state, $users, $stateParams, $http, Flash, $uibModal,$rootScope ) {
  $scope.loading=false
  $scope.data1 = $scope.data.tableData[$scope.tab.data.index]
  document.getElementById('txtFileUpload').addEventListener('change', upload, false);

   function upload(evt) {
   var data = null;
   var file = evt.target.files[0];
   var reader = new FileReader();
   reader.readAsText(file);
   reader.onload = function(event) {
   var csvData = event.target.result;

   var data = Papa.parse(csvData, {header : true});


   var result = [];

       for (i = 0; i < data.data.length; i++) {
      result.push(data.data[i].transaction_id);
       }
       var outputstr =[];
       for (var i = 0; i < result.length; i++) {
         var a= result[i].replace(/'/g,'');
         outputstr.push(a);
       }
 $scope.mycount=0;
   for (var i = 0; i < $scope.data.length; i++) {
       $scope.data[i].matched = false
   for (var j = 0; j < outputstr.length; j++) {
     if ( $scope.data[i].payment1externaltxnid == outputstr[j]) {
       $scope.data[i].matched = true
       $scope.mycount +=1;
       $scope.patchme($scope.data[i].id,$scope.data[i].matched);
       }
     }
   }

     $http({method : 'PATCH' , url : '/api/finance/reportreconciliation/'+ $scope.data1.id + '/' ,data :{paytmMatch : $scope.mycount}})

   };
   reader.onerror = function() {

   alert('Unable to read ' + file.fileName);

   };
  }


$scope.patchme = function(b,a) {
 $http({method : 'PATCH' , url : '/api/finance/reporttransaction/'+ b + '/' ,data :{paytmMatching : a}})
}





  $scope.getAllData = function() {

    $http({
      method: 'GET',
      url: '/api/finance/reporttransaction/?parent=' + $scope.data.id,
    }).

    then(function(response) {
      $scope.data = response.data
      $scope.loading =true
    })
  }

  $scope.getAllData()

})
