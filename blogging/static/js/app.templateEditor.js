var app = angular.module('app', [ 'ngSanitize','ui.bootstrap','flash']);

app.config(function($httpProvider, $provide) {

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});


app.directive('fileModel', ['$parse', function ($parse) {
  return {
     restrict: 'A',
     link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
           scope.$apply(function() {
              modelSetter(scope, element[0].files[0]);
           });
        });
     }
  };
}]);

app.controller('templateEditor', function($scope, $rootScope , $sce , $http , $timeout,Flash,$uibModal) {
  // $scope.editor1 = ace.edit('aceEditor');
  $scope.checked = true
  $scope.choices = ['Contact Us','Introduction','Image List','Info Section','Testimonials','Widgets','Header','Footer','Others']

  $http({method : 'GET' , url : '/api/website/uielementemplate/' + PK + '/'}).
  then(function(response) {
    $scope.form = response.data;
    $scope.setupEditor();
  })

  $scope.editTemplate = function(data) {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.editTemplate.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data:function(){
          return data
        }
      },
      controller: function($scope, $http, $uibModalInstance,data) {
        $scope.form = data
        $scope.choices = ['Contact Us','Introduction','Image List','Info Section','Testimonials','Widgets','Header','Footer','Others']


        $scope.save = function(){
          var fd = new FormData();
          fd.append('name',$scope.form.name)
          fd.append('templateCategory',$scope.form.templateCategory)
          fd.append('live', $scope.form.live)
          if ($scope.form.mobilePreview != null && typeof($scope.form.mobilePreview) == 'object' ) {

            fd.append('mobilePreview', $scope.form.mobilePreview)
          }
          if ($scope.form.sampleImg != null && typeof($scope.form.sampleImg) == 'object' ) {

            fd.append('sampleImg', $scope.form.sampleImg)
          }
          $http({method : 'PATCH' , url : '/api/website/uielementemplate/' + PK + '/',data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
          then(function(response) {


          })
        }



      }

    }).result.then(function() {}, function() {
    });


  }




  $scope.setupEditor = function() {
    $scope.uielement=  $sce.trustAsResourceUrl('/uielement/?id='+$scope.form.pk)
    $timeout(function() {
      var iFrame = document.getElementById('iFrame')
      $scope.editor1 = ace.edit('aceEditor');
      // $scope.editor1.setTheme("ace/theme/XCode");
      $scope.editor1.getSession().setMode("ace/mode/html");
      $scope.editor1.getSession().setUseWorker(false);
      $scope.editor1.setHighlightActiveLine(false);
      $scope.editor1.setShowPrintMargin(false);
      ace.require("ace/ext/language_tools");
      $scope.editor1.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,

      });
      $scope.editor1.setFontSize("14px");
      $scope.editor1.setBehavioursEnabled(true);
      if ($scope.form != undefined) {
        console.log($scope.form);
        $scope.editor1.setValue($scope.form.template, -1);
      }

      $scope.editor2 = ace.edit('aceEditor2');
      // $scope.editor2.setTheme("ace/theme/XCode");
      $scope.editor2.getSession().setMode("ace/mode/json");
      $scope.editor2.getSession().setUseWorker(false);
      $scope.editor2.setHighlightActiveLine(false);
      $scope.editor2.setShowPrintMargin(false);
      ace.require("ace/ext/language_tools");
      $scope.editor2.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
      });
      $scope.editor2.setFontSize("14px");
      $scope.editor2.setBehavioursEnabled(true);
      if ($scope.form.defaultData != undefined) {
        $scope.editor2.setValue($scope.form.defaultData, -1);
      }

      $scope.show = false
      $scope.save = function() {
        var fd = new FormData()

        fd.append('name', $scope.form.name)
        fd.append('live', $scope.form.live)
        fd.append('template', $scope.editor1.getValue())
        fd.append('defaultData', $scope.editor2.getValue())
        fd.append('templateCategory', $scope.form.templateCategory)
        if ($scope.form.mobilePreview != null && typeof($scope.form.mobilePreview) == 'object' ) {

          fd.append('mobilePreview', $scope.form.mobilePreview)
        }
        if ($scope.form.sampleImg != null && typeof($scope.form.sampleImg) == 'object' ) {

          fd.append('sampleImg', $scope.form.sampleImg)
        }
        console.log($scope.form,'w349023984923482347');
        $http({
          method: 'PATCH',
          url: '/api/website/uielementemplate/' + $scope.form.pk + '/',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
        then(function(response) {

          Flash.create('success', "Updated...!")
          iFrame.src=  $sce.trustAsResourceUrl('/uielement/?id='+response.data.pk)
          $scope.msg ={}
          if (response.status == 200) {
            $scope.msg ={'status':'success','text':'Updated...!!!'}
            $timeout (function(){
              $scope.msg.status =''
              $scope.msg.text =''
            },2000)
            return
          }else {
              $scope.msg ={'status':'danger','text':'Error...!!!'}
              $timeout (function(){
                $scope.msg.status =''
                $scope.msg.text =''
              },2000)
            return
          }
          console.log($scope.uielement,'903842483');
        })
      }
    },300)


    // $timeout(function() {
    //   $scope.editor2 = ace.edit('aceEditor2');
    //   $scope.editor2.setTheme("ace/theme/XCode");
    //   $scope.editor2.getSession().setMode("ace/mode/json");
    //   $scope.editor2.getSession().setUseWorker(false);
    //   $scope.editor2.setHighlightActiveLine(false);
    //   $scope.editor2.setShowPrintMargin(false);
    //   ace.require("ace/ext/language_tools");
    //   $scope.editor2.setOptions({
    //     enableBasicAutocompletion: true,
    //     enableSnippets: true
    //   });
    //   $scope.editor2.setFontSize("14px");
    //   $scope.editor2.setBehavioursEnabled(true);
    //   if ($scope.form != undefined) {
    //     $scope.editor2.setValue($scope.form.defaultData, -1);
    //   }
    //
    // },300)
  }





});
