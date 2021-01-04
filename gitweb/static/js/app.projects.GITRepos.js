app.controller('controller.projectManagement.GIT.repos.item' , function($scope ,$http, $users , Flash ){
  $scope.me = $users.get('mySelf');
});

app.controller('projectManagement.GIT.repos' , function($scope , $users , Flash ){

  $scope.data = {tableData : []}

  var views = [{name : 'list' , icon : 'fa-th-large' ,
      template : '/static/ngTemplates/genericTable/genericSearchList.html' ,
      itemTemplate : '/static/ngTemplates/app.GIT.repos.item.html',
    },
  ];

  var options = {
    main : {icon : 'fa-pencil', text: 'edit'} ,
    };

  $scope.config = {
    views : views,
    url : '/api/git/repo/',
    searchField: 'id',
    deletable : true,
    editorTemplate : '/static/ngTemplates/app.GIT.form.repo.html',
    canCreate : true,
    itemsNumPerView : [12,24,48],
  }
  $scope.tableAction = function(target , action , mode){
    if (action == 'repoBrowser') {
      for (var i = 0; i < $scope.data.tableData.length; i++) {
        if ($scope.data.tableData[i].pk == parseInt(target)){
          $scope.addTab({title : 'Browse Repo : ' + $scope.data.tableData[i].name , cancel : true , app : 'repoBrowser' , data : {pk : target , name : $scope.data.tableData[i].name} , active : true})
        }
      }
    }
  }
  $scope.tabs = [];
  $scope.searchTabActive = true;

  $scope.closeTab = function(index){
    $scope.tabs.splice(index , 1)
  }

  $scope.addTab = function( input ){
    $scope.searchTabActive = false;
    alreadyOpen = false;
    for (var i = 0; i < $scope.tabs.length; i++) {
      if ($scope.tabs[i].data.pk == input.data.pk && $scope.tabs[i].app == input.app) {
        $scope.tabs[i].active = true;
        alreadyOpen = true;
      }else{
        $scope.tabs[i].active = false;
      }
    }
    if (!alreadyOpen) {
      $scope.tabs.push(input)
    }
  }

});
