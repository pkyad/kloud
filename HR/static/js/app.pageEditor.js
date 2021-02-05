var app = angular.module('app', ['ui.router', 'flash', 'ngSanitize', 'ngDraggable', 'ui.bootstrap','angular-owl-carousel-2']);

app.filter('to_trusted', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);

app.config(function($httpProvider, $stateProvider, $urlRouterProvider, $provide) {

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$on("$stateChangeError", console.log.bind(console));
}]);

app.directive('fileModel', ['$parse', function($parse) {
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

app.controller('pages', function($scope, $http, $state, Flash, $sce, $uibModal) {
  $scope.isDisabled = true

  $scope.publish = function() {
    $http({
      method: 'GET',
      url: '/api/website/publish/?page=' + page
    })
  }

  $scope.reset = function() {
    $scope.form = {
      title: '',
      description: '',
      url: '',

    }

  }
  $scope.reset()
  $scope.showForm = false
  $scope.showcomponentForm = false

  $http({
    method: 'GET',
    url: '/api/website/page/' + page + '/',
  }).
  then(function(response) {
    $scope.page = response.data;
    $scope.getComponents()
  })




  $scope.getTemplates = function() {
    $http({
      method: 'GET',
      url: '/api/website/uielementemplate/',
    }).
    then(function(response) {
      $scope.templates = response.data
    })
  }
  $scope.getTemplates()

  $scope.resetForm = function() {
    $scope.componentform = {
      parent: '',
      component_type: '',
      template: ''
    }

  }
  $scope.resetForm()

  $scope.saveComponent = function() {
    if ($scope.componentform.component_type.length == 0) {
      Flash.create('warning', 'Please select component type')
      return
    }
    console.log({
      "componentform": $scope.componentform.component_type
    });
    var dataTosend = {
      parent: $scope.page.pk,
      component_type: $scope.componentform.component_type.name,
      template: $scope.componentform.component_type.template,
      data: $scope.componentform.component_type.defaultData
    }

    $http({
      method: 'POST',
      url: '/api/website/components/',
      data: dataTosend,

    }).
    then(function(response) {
      Flash.create('success', 'Created....!!!')
      window.location.reload(false);
      $scope.getComponents($scope.page.pk)
      $scope.resetForm()

    })
  }
  $scope.deleteComponent = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/website/components/' + $scope.components[indx].pk + '/',
    }).
    then(function(response) {
      $scope.components.splice(indx, 1)
      Flash.create('success', 'Deleted')
      window.location.href = window.location.href
      $scope.getComponents()
    })
  }

  $scope.getComponents = function() {
    $scope.data = $scope.form
    console.log($scope.data,'34343');
    $http({
      method: 'GET',
      url: '/api/website/components/?parent=' + page,
    }).
    then(function(response) {
      $scope.components = response.data
      // for (var i = 0; i < $scope.components.length; i++) {
      //   $scope.components[i].data = JSON.parse($scope.components[i].data)
      // }
    })
  }

$scope.getComponents()

  $scope.createPage = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.createPage.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return $scope.page
        }
      },
      controller: function($scope, $http, $uibModalInstance, data) {
        $scope.form = data
        $scope.$watch('form.title', function(newValue, oldValue) {

          var space = /[ ]/;
          var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          var nonascii = /[^\x20-\x7E]/;
          var url = $scope.form.title;
          if (space.test(newValue)) {
            url = newValue.replace(/\s+/g, '-').toLowerCase();
            if (special.test(url)) {
              url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
              if (nonascii.test(url)) {
                url = url.replace(/[^\x20-\x7E]/g, '');
              }
            }
          } else {
            url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
          }
          url = url.replace(/-/g, ' ');
          url = url.trim();
          $scope.form.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');

        })
        var emptyFile = new File([""], "");
        $scope.reset = function() {
          $scope.form = {
            title: '',
            description: '',
            url: '',
            ogImage: emptyFile

          }

        }
        $scope.save = function() {

          var fd = new FormData()
          console.log($scope.form.ogImage, "Asdfasf932789398");
          fd.append('title', $scope.form.title)
          fd.append('url', $scope.form.url)
          fd.append('description', $scope.form.description)
          if ($scope.form.ogImage != emptyFile && $scope.form.ogImage != null && typeof $scope.form.ogImage != 'string') {
            fd.append('ogImage', $scope.form.ogImage)

          }

          $http({
            method: 'PATCH',
            url: '/api/website/page/' + data + '/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Created....!!!')

            $uibModalInstance.dismiss()

          })
        }
      },

    }).result.then(function() {}, function() {});
  }

  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1));
    return arr; // for testing
  };
  $scope.moveUp = function(indx) {

    // $scope.components = array_move($scope.components[indx], indx, indx - 1)
    $scope.components[indx] = array_move($scope.components, indx, indx - 1)
    console.log($scope.components, "fkdfjdjfdkj1");
  }
  $scope.moveDown = function(indx) {

    $scope.components = array_move($scope.components, indx, indx + 1)
    console.log($scope.components, "fkdfjdjfdkj2");
  }


  $scope.EditComponent = function(idx) {
    data = $scope.components[idx];
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.uitemplateEditable.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        },
        idx: function() {
          return idx
        }
      },
      controller: function($scope, $http,$uibModal, $uibModalInstance, data, idx, $timeout) {

        $scope.component = data;
        console.log(data,'32490340234890');
        $scope.component.data = JSON.parse($scope.component.data)
        // console.log(typeof $scope.component.data,'233');
        $scope.idx = idx;
        $scope.files = {};



        $scope.uploadmediafile = function(file, key) {
          console.log(file);
          $timeout(function(){

              var fd = new FormData()
              fd.append('file', file)
              fd.append('key', key)
              fd.append('name', file.name)
              fd.append('mediaType', file.type)

              $http({
                method: 'POST',
                url: '/api/ERP/uploadmediafile/',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                  'Content-Type': undefined
                }
              }).
              then(function(response) {
                console.log(response);
                console.log($scope.component.data[response.data.key]);
                $scope.component.data[response.data.key].imageUrl = response.data.imageUrl;
              })

          }, 1000)
        }



        $scope.save = function(data) {

          $http({
            method: 'PATCH',
            url: '/api/website/components/' + $scope.component.pk + '/',
            data: {
              data: JSON.stringify(data)
            },
          }).
          then(function(response) {
            $uibModalInstance.dismiss()
          })
        }

        $scope.editArrayObj = function(field, idx, key) {
          if(idx == -1){
            data = angular.copy(field.form)
          }else{
            data = field.array[idx];
          }

          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.website.arrayObjEditor.html',
            size: 'lg',
            backdrop: true,
            resolve: {
              data: function() {
                return data
              },
              idx: function() {
                return idx
              },
              key : function(){
                return key
              }
            },
            controller: function($scope, $http, $uibModalInstance, data, idx, key) {
              $scope.idx = idx;
              $scope.key = key;
              $scope.form = data;

              $scope.add = function(){
                $uibModalInstance.dismiss({data : $scope.form , key : $scope.key})
              }
              $scope.productSearch = function(query) {

                return $http.get('/api/finance/inventory/?limit=20&mobile__icontains=' + query).
                then(function(response) {
                  return response.data.results;
                })
              };

            }
          }).result.then(function(d){

          }, function(r){
            console.log({r});
            console.log(r.data);
            $scope.component.data[r.key].array.push(r.data)
          });
        }





      }
    })
  }


  $scope.addComponent = function(idx) {
    console.log(idx,'ds');
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.createUItemplate.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        idx: function() {
          return idx
        },
        components : function() {
          return $scope.components;
        },
        page: function() {
          return page
        }
      },
      controller: function($scope, $http, $uibModalInstance,$state,idx,page, components) {

        $scope.components = components;
        $scope.idx = idx;
        console.log(idx,'9403849384903902');

        console.log($state.params,'093403049');
        $scope.form = {
          selectSection:'Image List',search:''
        }

        $scope.getTemplates  = function(){
          var  url = '/api/website/uielementemplate/'
          if ($scope.form.search.length >0) {
            url += '?name__icontains='+$scope.form.search
          }else{
            url += '?templateCategory=' + $scope.form.selectSection
          }

          $http({
            method: 'GET',
            url: url,

          }).
          then(function(response) {
            $scope.elements  =  response.data;
            $scope.form.selectedIndex = null;
          })
        }

        $scope.$watch('form.selectSection' , function(newValue , oldValue) {
          $scope.getTemplates();
        })

        $scope.save  = function(){
          if ($scope.form.selectedIndex != null) {
              $scope.form.uielementtemplate =   $scope.elements[$scope.form.selectedIndex]
          }
          var data = {
            uielement:  $scope.form.uielementtemplate.pk,
            parent:page,
            index:idx+1
          }

          $http({
            method: 'POST',
            url: '/api/website/components/',
            data:data
          }).
          then(function(response) {
            console.log($scope.components.length);

            for (var i = 0; i < $scope.components.length; i++) {
              $http({
                method: 'PATCH',
                url: '/api/website/components/'+$scope.components[i].pk + '/',
                data:{index:i}
              }).
              then(function(response) {

                $uibModalInstance.dismiss();

              })

              $uibModalInstance.dismiss();


            }
          })
        }


      }
    }).result.then(function() {


    }, function() {
      window.location.href = window.location.href
    });
  }

})
