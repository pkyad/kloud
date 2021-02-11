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
    $scope.imageform.images = JSON.parse(response.data.images)
    $scope.setupEditor();
  })

  $scope.showFile = function(data){
    $scope.stage = data
  }
  $scope.showFile('template')

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
        console.log(data,'434');
        $scope.choices = ['Contact Us','Introduction','Image List','Info Section','Testimonials','Widgets','Header','Footer','Others']

        $scope.editor1 = ace.edit('aceEditor');
        $scope.editor1.setTheme("ace/theme/gruvbox");
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
        $scope.editor2.setTheme("ace/theme/gruvbox");
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
        $scope.editor3 = ace.edit('aceEditor3');
        $scope.editor3.setTheme("ace/theme/gruvbox");
        console.log(  $scope.editor3.getSession());
        $scope.editor3.getSession().setMode("ace/mode/css");
        $scope.editor3.getSession().setUseWorker(false);
        $scope.editor3.setHighlightActiveLine(false);
        $scope.editor3.setShowPrintMargin(false);
        ace.require("ace/ext/language_tools");
        $scope.editor3.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true
        });
        $scope.editor3.setFontSize("14px");
        $scope.editor3.setBehavioursEnabled(true);
        if ($scope.form.css != undefined) {
          $scope.editor3.setValue($scope.form.css, -1);
        }


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
          fd.append('template', $scope.editor1.getValue())
          fd.append('defaultData', $scope.editor2.getValue())
          fd.append('css', $scope.editor3.getValue())
          $http({method : 'PATCH' , url : '/api/website/uielementemplate/' + PK + '/',data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).
          then(function(response) {

              $uibModalInstance.dismiss()
          })
        }



      }

    }).result.then(function() {}, function() {
    });


  }




  $scope.setupEditor = function() {
    $scope.uielement=  $sce.trustAsResourceUrl('/uielement/?id='+$scope.form.pk)
    $timeout(function() {
      // var iFrame = document.getElementById('iFrame')
      $scope.editor1 = ace.edit('aceEditor');
      $scope.editor1.setTheme("ace/theme/gruvbox");
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
      $scope.editor2.setTheme("ace/theme/gruvbox");
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
      $scope.editor3 = ace.edit('aceEditor3');
      $scope.editor3.setTheme("ace/theme/gruvbox");
      console.log(  $scope.editor3.getSession());
      $scope.editor3.getSession().setMode("ace/mode/css");
      $scope.editor3.getSession().setUseWorker(false);
      $scope.editor3.setHighlightActiveLine(false);
      $scope.editor3.setShowPrintMargin(false);
      ace.require("ace/ext/language_tools");
      $scope.editor3.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
      });
      $scope.editor3.setFontSize("14px");
      $scope.editor3.setBehavioursEnabled(true);
      if ($scope.form.css != undefined) {
        $scope.editor3.setValue($scope.form.css, -1);
      }
      console.log($scope.editor3.getValue());
      $scope.show = false
      $scope.save = function() {
        var fd = new FormData()

        fd.append('name', $scope.form.name)
        fd.append('live', $scope.form.live)
        fd.append('template', $scope.editor1.getValue())
        fd.append('defaultData', $scope.editor2.getValue())
        fd.append('css', $scope.editor3.getValue())
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
          // iFrame.src=  $sce.trustAsResourceUrl('/uielement/?id='+response.data.pk)
          $scope.msg ={}
          if (response.status == 200) {
            $scope.msg ={'status':'success','text':'Updated...!!!'}
            $timeout (function(){
              $scope.msg.status =''
              $scope.msg.text =''
              $scope.editTemplate(response.data)
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



  }
  var emptyFile = new File([""], "");
  $scope.imageform = {
    file:emptyFile,name:'',images:[],templates:'template',imageLinks:[]
  }

  $scope.fileupload = function(file){
    var fd = new FormData()
    $scope.file = file[0]

    fd.append('file', $scope.file)
    fd.append('template', $scope.form.templates)

    $http({
      method: 'POST',
      url: '/api/PIM/saveImage/',
      data: fd,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      $scope.imageform.images.push({link:response.data.link,name:response.data.name})

      $http({
        method: 'PATCH',
        url: '/api/website/uielementemplate/'+PK+'/',
        data: {images:JSON.stringify($scope.imageform.images)},

      }).
      then(function(response) {

      })

    })
  }

  $scope.copyUrl = function(link){
    var copyElement = document.createElement("textarea");
   copyElement.style.position = 'fixed';
   copyElement.style.opacity = '0';
   copyElement.textContent = decodeURI(link);
   var body = document.getElementsByTagName('body')[0];
   body.appendChild(copyElement);
   copyElement.select();
   document.execCommand('copy');

   body.removeChild(copyElement);
   alert('copy to clipboard')
  }




});
