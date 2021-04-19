app.config(function($stateProvider) {



  $stateProvider
    .state('businessManagement.website', {
      url: "/website",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.website.html',
          controller: 'pages'

        },
        "@businessManagement.website": {
          templateUrl: '/static/ngTemplates/app.website.pages.html',
          // controller: 'pages'
        }


      }
    })
    .state('businessManagement.website.blogs', {
      url: "/blogs",
      templateUrl: '/static/ngTemplates/app.businessmanagement.allblogs.html',
      controller: 'businessManagement.articles',
    })
    .state('businessManagement.website.createblog', {
      url: "/createblog",
      templateUrl: '/static/ngTemplates/app.businessmanagement.blog.form.html',
      controller: 'businessManagement.articles.form',
    })
    .state('businessManagement.website.editblog', {
      url: "/editblog/:id",
      templateUrl: '/static/ngTemplates/app.businessmanagement.blog.form.html',
      controller: 'businessManagement.articles.form',
    })
    .state('businessManagement.website.templates', {
      url: "/templates",
      templateUrl: '/static/ngTemplates/app.website.templates.item.html',
      controller: 'templates'
    })
    .state('businessManagement.website.pages', {
      url: "/pages",
      templateUrl: '/static/ngTemplates/app.website.pages.html',
      controller: 'pages'
    })
    .state('businessManagement.website.settings', {
      url: "/settings",
      templateUrl: '/static/ngTemplates/app.website.settings.html',
      controller: 'settings'
    })

});

app.controller('settings', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal,  $sce) {

  $scope.reset = function() {
    $scope.form = {
      defaultOgImage: emptyFile,
      defaultTitle: '',
      defaultDescription: '',
      headerTemplate: '',
      footerTemplate: '',enableChatbot:false
    }
  }
  $scope.reset()

  if ($scope.me != null) {

    $scope.headerUrl = $sce.trustAsResourceUrl('/headerfooter/?header=header')
    $scope.footerUrl = $sce.trustAsResourceUrl('/headerfooter/?footer=footer')

    $http({
      method: 'GET',
      url: '/api/organization/divisions/'+$scope.me.designation.division+'/',


    }).
    then(function(response) {
      $scope.form = response.data
      $scope.form.headerTemplate = response.data.headerTemplate
      $scope.form.footerTemplate = response.data.footerTemplate
    })
  }

  $scope.$watch('form.headerTemplate', function(query) {
    console.log($scope.me,'4343');
    if ($scope.form.headerTemplate != undefined) {
      $scope.headerUrl = $sce.trustAsResourceUrl('/uielement/?id=' + $scope.form.headerTemplate.pk)

    }
  })


  $scope.$watch('form.footerTemplate', function(query) {
    if ($scope.form.footerTemplate != undefined) {
        $scope.footerUrl = $sce.trustAsResourceUrl('/uielement/?id=' + $scope.form.footerTemplate.pk)

    }
  })


  $scope.changeHeader = function() {
    $scope.form.headerTemplate = ''
  }
  $scope.changeFooter = function() {
    $scope.form.footerTemplate = ''
  }







  $scope.save = function() {
    // if ($scope.form.defaultOgImage == emptyFile || $scope.form.defaultTitle.length == 0 || $scope.form.defaultDescription.length == 0) {
    //   Flash.create('warning', 'Fill all the Details')
    //   return
    // }

    var fd = new FormData()
    fd.append('defaultTitle', $scope.form.defaultTitle)
    fd.append('defaultDescription', $scope.form.defaultDescription)
    fd.append('enableChatbot', $scope.form.enableChatbot)
    if ($scope.form.footerTemplate != undefined) {
      fd.append('footerTemplate', $scope.form.footerTemplate.pk)

    }
    if ($scope.form.headerTemplate != undefined) {
      fd.append('headerTemplate', $scope.form.headerTemplate.pk)

    }
    if ($scope.form.defaultOgImage != null && $scope.form.defaultOgImage != emptyFile) {

      fd.append('defaultOgImage', $scope.form.defaultOgImage)
    }
    var method = 'POST'
    var url = '/api/organization/getheaderandfooter/'

    console.log($scope.form, '4930983409348903');
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
      $scope.form.footerTemplate = response.data.footerTemplate
      $scope.form.headerTemplate = response.data.headerTemplate
      Flash.create('success', 'Created....!!!')
      $scope.renderheaderfooter()
    })
  }





  $scope.gotoHeaderandFooter = function(pkVal) {
    window.open('/settings/?id=' + pkVal, '_blank')
  }


  $scope.renderheaderfooter = function(){
    $scope.headerandfooter = '/renderheaderfooter/'
    var i = document.getElementById('iframeId')
     i.src = i.src
  }
  $scope.renderheaderfooter()
  $scope.selectHeader = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.headers.html',
      size: 'lg',
      backdrop: true,
      resolve: {

      },
      controller: function($scope, $http, $uibModalInstance) {

        $scope.form = {
          selectedHeader: null,
        }

        $scope.close = function() {
          if ($scope.form.selectedHeader != null) {

            $uibModalInstance.dismiss($scope.headers[$scope.form.selectedHeader])
          } else {

            $uibModalInstance.dismiss()
          }

        }
        $scope.footerTemplateSearch = function() {

          $http.get('/api/website/uielementemplate/?templateCategory__icontains=Footer').then(function(response) {
            $scope.footers = response.data
          })

        }

        $scope.footerTemplateSearch()
        $scope.headerTemplateSearch = function() {
          $http.get('/api/website/uielementemplate/?templateCategory__icontains=Header').then(function(response) {
            $scope.headers = response.data

          })
        }
        $scope.headerTemplateSearch()


      }

    }).result.then(function(header) {


    }, function(header) {
      $scope.form.headerTemplate = header

       $scope.save()
       // $scope.renderheaderfooter()
    });


  }
  $scope.selectFooter = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.footers.html',
      size: 'lg',
      backdrop: true,
      resolve: {

      },
      controller: function($scope, $http, $uibModalInstance) {

        $scope.form = {
          selectedFooter: null,
        }

        $scope.close = function() {
          if ($scope.form.selectedFooter != null) {

            $uibModalInstance.dismiss($scope.footers[$scope.form.selectedFooter])
          } else {

            $uibModalInstance.dismiss()
          }

        }
        $scope.footerTemplateSearch = function() {

          $http.get('/api/website/uielementemplate/?templateCategory__icontains=Footer').then(function(response) {
            $scope.footers = response.data
          })

        }

        $scope.footerTemplateSearch()



      }

    }).result.then(function(footer) {}, function(footer) {
      $scope.form.footerTemplate = footer
      $scope.save()

    });


  }




})
app.controller('blogs', function($scope, $http, $aside, $state, Flash, $users, $filter ){


  $scope.limit = 20
  $scope.offset = 0
  $scope.fetchBlogs = function() {
    $http({
      method: 'GET',
      url: '/api/blogging/article/?limit=' + $scope.limit + '&offset=' + $scope.offset,
    }).
    then(function(response) {
      $scope.blogs = response.data.results
      $scope.prev = response.data.previous
      $scope.next = response.data.next
    })
  }
  $scope.fetchBlogs()

  $scope.Previous = function() {
    if ($scope.prev != null) {
      $scope.offset -= $scope.limit
      $scope.fetchBlogs()
    }
  }
  $scope.Next = function() {
    if ($scope.next != null) {
      $scope.offset += $scope.limit
      $scope.fetchBlogs()
    }
  }


})
app.controller('templates', function($scope, $http, $aside, $state, Flash, $users, $filter ){
  $scope.deleteTemplate = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/website/uielementemplate/' + $scope.templates[indx].pk + '/',
    }).
    then(function(response) {
      $scope.templates.splice(indx, 1)
      Flash.create('success', 'Deleted')
      $scope.getPages()
    })
  }

  $scope.limit = 16
  $scope.offset = 0
  $scope.getTemplates = function() {
    $http({
      method: 'GET',
      url: '/api/website/uielementemplate/?limit=' + $scope.limit + '&offset=' + $scope.offset,
    }).
    then(function(response) {
      $scope.templates = response.data.results
      $scope.prev = response.data.previous
      $scope.next = response.data.next
    })
  }
  $scope.getTemplates()

  $scope.Previous = function() {
    if ($scope.prev != null) {
      $scope.offset -= $scope.limit
      $scope.getTemplates()
    }
  }
  $scope.Next = function() {
    if ($scope.next != null) {
      $scope.offset += $scope.limit
      $scope.getTemplates()
    }
  }
})
app.controller('pages', function($scope, $http, $aside, $state, Flash, $users, $filter,  $uibModal,$location) {
  // if ($state.is('businessManagement.website')) {
  //   $state.go('businessManagement.website.pages')
  // }



  $scope.apiKey= API_KEY

  $scope.isDisabled = true

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






  $scope.initialPage = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.initialPage.html',
      size: 'lg',
      backdrop: true,
      resolve: {

      },
      controller: function($scope, $http, $uibModalInstance) {
        $scope.selectTypForm = {
          cardTyp:''
        }

        $scope.reset = function() {
          $scope.form = {
            defaultTitle:'',
            defaultDescription: '',
            url: '',
            stage:''

          }

        }
        $scope.reset()
        console.log(DIVISIONPK,'ooiopo8p');
        $http({
          method: 'GET',
          url: '/api/organization/divisions/' +DIVISIONPK+'/'
        }).
        then(function(response) {
          $scope.division = response.data
          $scope.form = response.data
          console.log($scope.form,"opopop");
        })

        $scope.selectTyp = [
          {text:'Ecommerce',img:'/static/images/Ecommerce.png'},
          {text:'Freelancer professional profile',img:'/static/images/portfolio.png'},
          {text:'Agency',img:'/static/images/Agency.png'},
          {text:'Services',img:'/static/images/service.png'},
          {text:'Blank',img:'/static/images/Blank.png'},
          {text:'LMS',img:'/static/images/LMS.png'}


        ]

        // $scope.$watch('form.title', function(newValue, oldValue) {
        //
        //
        //
        //
        //   var space = /[ ]/;
        //   var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        //   var nonascii = /[^\x20-\x7E]/;
        //   var url = $scope.form.title;
        //   if (space.test(newValue)) {
        //     url = newValue.replace(/\s+/g, '-').toLowerCase();
        //     if (special.test(url)) {
        //       url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '');
        //       if (nonascii.test(url)) {
        //         url = url.replace(/[^\x20-\x7E]/g, '');
        //       }
        //     }
        //   } else {
        //     url = url.replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]+/g, '-').toLowerCase();;
        //   }
        //   url = url.replace(/-/g, ' ');
        //   url = url.trim();
        //   $scope.form.url = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
        //
        // })

        $scope.selectTab = function(indx){
          $scope.selectedIndx = indx
          $scope.form.pageType = $scope.selectTyp[indx].text
        }

        $scope.isValid = true

        $scope.checkUrl = function(){
          $http({
            method: 'GET',
            url: '/api/website/checkUrl/?url=' + $scope.form.url
          }).
          then(function(response) {
            $scope.isValid = response.data.isValid
          })
        }

        $scope.save = function() {
          if ($scope.form.defaultTitle.length == 0 || $scope.form.defaultDescription.length == 0) {
            Flash.create('warning', 'Please fill all the details')
            return
          }

          var dataTosend = {
            defaultTitle:$scope.form.defaultTitle,
            url:$scope.form.url,
            defaultDescription:$scope.form.defaultDescription,
            pageType:$scope.form.pageType
          }
          var method = 'POST'
          var url = '/api/website/initializewebsitebuilder/'
          // if ($scope.form.pk != undefined) {
          //   method = "PATCH"
          //   url = '/api/website/page/' + $scope.form.pk + '/'
          // }
          $http({
            method: method,
            url: url,
            data: dataTosend
          }).
          then(function(response) {
            Flash.create('success', 'Created....!!!')
            $uibModalInstance.dismiss()
          })
        }



      }



    }).result.then(function(data) {}, function() {

      $scope.getPages()
    });
  }




  var emptyFile = new File([""], "");
  $scope.showForm = false
  $scope.showcomponentForm = false
  $scope.limit = 6
  $scope.offset = 0
  $scope.currentPage =1
  $scope.searchForm = {
    search:''
  }
  $scope.getPages = function() {
    // alert('sssssssss')
    console.log($state,'ssssssssssssss');
    var url = '/api/website/page/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.searchForm.search.length > 0) {
      url += '&search='+$scope.searchForm.search
    }
    $http({
      method: 'GET',
      url:url ,
    }).
    then(function(response) {
      $scope.pages = response.data.results
      console.log($scope.pages.length,"askdfasfdasdfa");
      if ($scope.pages.length  == 0 && $state.is('businessManagement.website')) {
          $scope.initialPage()
      }else {
        for (var i = 0; i < $scope.pages.length; i++) {
          $scope.pages[i].domain = window.location.host
          $scope.pages[i].domainUrl = window.location.host+'/'+$scope.pages[i].url
        }
        $scope.total = response.data.count
        $scope.prev = response.data.previous
        $scope.next = response.data.next
        return
      }
    })
  }
  $scope.getPages()


  $scope.Previous = function() {
    if ($scope.prev != null) {
      $scope.offset -= $scope.limit
      $scope.getPages()
    }
  }
  $scope.Next = function() {
    if ($scope.next != null) {
      $scope.offset += $scope.limit
      $scope.getPages()
    }
  }

  $scope.pageChanged = function(currentPage){
    $scope.currentPage = currentPage
    $scope.offset = $scope.limit*($scope.currentPage-1)
    $scope.getPages()
  }


  $scope.getComponents = function(pkVal) {
    $scope.data = pkVal
    $scope.showcomponentForm = true
    $http({
      method: 'GET',
      url: '/api/website/components/?parent=' + pkVal.pk,
    }).
    then(function(response) {
      $scope.components = response.data
    })
  }



  $scope.deletePage = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/website/page/' + $scope.pages[indx].pk + '/',
    }).
    then(function(response) {
      $scope.pages.splice(indx, 1)
      Flash.create('success', 'Deleted')
      $scope.showcomponentForm = false
      $scope.getPages()
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
      $scope.getComponents($scope.components[indx].parent)
    })
  }

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
    var dataTosend = {
      parent: $scope.data.pk,
      component_type: $scope.componentform.component_type.name,
      template: $scope.componentform.component_type.template
    }

    $http({
      method: 'POST',
      url: '/api/website/components/',
      data: dataTosend,

    }).
    then(function(response) {
      Flash.create('success', 'Created....!!!')
      $scope.getComponents(response.data.parent)
      $scope.resetForm()

    })
  }

  $scope.close = function() {
    $scope.showcomponentForm = false
  }

  $scope.pageEditor = function(data) {
    window.open('/pageeditor/' + data.pk, '_blank')
  }

  $scope.createPage = function(pkVal) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.website.createPage.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        pkVal: function() {
          return pkVal
        }
      },
      controller: function($scope, $http, $uibModalInstance, pkVal) {
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
        $scope.$watch('form.ogImage', (newValue, oldValue) => {
          console.log({
            newValue,
            oldValue
          })
          if (!newValue) {
            return
          }

          $scope.reader = new FileReader();

          $scope.reader.onload = function(e) {
            $('#preview').attr('src', e.target.result);
          }

          $scope.reader.readAsDataURL(newValue);



        })

        if (pkVal == undefined) {
          $scope.reset = function() {
            $scope.form = {
              title: '',
              description: '',
              url: '',
              ogImage: emptyFile,enableChat:false,inFooter:false

            }

          }
          $scope.reset()

        } else {
          $scope.form = pkVal
        }
        $scope.save = function() {
          if ($scope.form.title.length == 0 || $scope.form.description.length == 0) {
            Flash.create('warning', 'Please fill all the details')
            return
          }
          var fd = new FormData()
          fd.append('title', $scope.form.title)
          fd.append('url', $scope.form.url)
          fd.append('description', $scope.form.description)
          fd.append('enableChat', $scope.form.enableChat)
          fd.append('inFooter', $scope.form.inFooter)
          if ($scope.form.ogImage != emptyFile && $scope.form.ogImage != null && typeof $scope.form.ogImage != 'string') {
            fd.append('ogImage', $scope.form.ogImage)

          }
          var method = 'POST'
          var url = '/api/website/page/'
          if ($scope.form.pk != undefined) {
            method = "PATCH"
            url = '/api/website/page/' + $scope.form.pk + '/'
          }
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
            console.log(response.data,'432423243');
            if (response.data.pk) {
                Flash.create('success', 'Created....!!!')
            } else {
              Flash.create('danger', `${response.data.status}`)
            }
            $uibModalInstance.dismiss()

          })
        }
      }

    }).result.then(function() {}, function() {
    });
  }



})


app.controller('businessManagement.articles', function($scope, $http, $aside, $state, Flash, $users, $filter ){

  if ($state.is('businessManagement.articles')) {
      $state.go('businessManagement.articles.allblogs')
  }

  $scope.page = 0;

  $scope.articles = [];
  $scope.refetch = function(append) {

    if (append == true) {
      $scope.page += 1;
    } else {
      $scope.page = 0;
    }

    if ($scope.me.is_staff || $scope.me.is_superuser) {
      $scope.manage = true;
    } else {
      $scope.manage = false;
      // $scope.filter1.contentWriter = $scope.me;
    }
    var f = $scope.filter1;
    var filters = '?limit=' + 10 + '&offset=' + $scope.page * 10 + '&published=' + f.published;

    if (f.title.length > 0) {
      filters += '&title__icontains=' + f.title;
    }

    if (typeof f.author == "object" && f.author != null && f.author != undefined) {
      filters += '&author=' + f.author.pk
    }
    if (typeof f.contentWriter == "object" && f.contentWriter != null && f.contentWriter != undefined) {
      filters += '&contentWriter=' + f.contentWriter.pk
    }
    // if (typeof f.reviewer=="object"||f.reviewer!=null||f.reviewer!=undefined) {
    //   filters+='&reviewer='+$scope.filter1.reviewer.pk
    // }
    if (f.articletyp.length > 0) {
      filters += '&content_type=' + f.articletyp
    }
    console.log(f.parent);
    if (f.parent != null && f.parent != undefined && f.parent.length != 0) {
      filters += '&category__parent=' + f.parent.pk
    }
    if (f.category != null && f.category != undefined && f.category.length != 0) {
      filters += '&category=' + f.category.pk
    }
    if (f.freeText.length > 0) {
      filters += '&contents__content__icontains=' + f.freeText
    }

    $http({
      method: 'GET',
      url: '/api/blogging/article/' + filters
    }).then((function(append) {
      return function(response) {
        if (append) {
          for (var i = 0; i < response.data.results.length; i++) {
            $scope.articles.push(response.data.results[i])
          }
        } else {
          $scope.articles = response.data.results;
        }
      }
    })(append))
  }

  $scope.reset = function() {
    $scope.filter1 = {
      title: '',
      author: '',
      contentWriter: '',
      reviewer: '',
      parent: '',
      category: '',
      freeText: '',
      articletyp: '',
      published: false

    }
    $scope.refetch()
  }


  $scope.filter1 = {
    title: '',
    freeText: '',
    author: '',
    contentWriter: '',
    reviewer: '',
    parent: '',
    category: '',
    publishingChannel: '',
    selectAll: false,
    published: false,
    articletyp: ''
  }

  $scope.me = $users.get('mySelf');

  $scope.$watch('filter1.selectAll', function(newValue, oldValue) {
    for (var i = 0; i < $scope.articles.length; i++) {
      $scope.articles[i].selected = newValue;
    }
  })

  $scope.userSearch = function(query, author) {
    if (author) {
      return $http.get('/api/HR/userSearch/?search=' + query).
      then(function(response) {
        return response.data;
      })
    } else {
      return $http.get('/api/HR/userSearch/?username__contains=' + query).
      then(function(response) {
        return response.data;
      })
    }
  };

  $http.get('/api/blogging/category/?onlyParent=').
  then(function(response) {
    $scope.parent = response.data;
  })

  $scope.$watch('filter1.parent', function(newValue, oldValue) {
    if (newValue.pk) {
      $http.get('/api/blogging/category/?parent=' + newValue.pk).
      then(function(response) {
        $scope.childrens = response.data;
      })
    }
  })

  $scope.refetch();


});


app.controller('businessManagement.articles.form', function($scope, $http, $aside, $state, Flash, $users, $filter,  $timeout,$uibModal) {
  $scope.surveySearch = function(query, preFill) {
    return $http.get('/api/PIM/survey/?name_icontains=' + query).
    then(function(response) {
      if (preFill) {
        if (response.data.length > 0) {
          $scope.form.survey = response.data
          console.log($scope.form.survey, "kkjhkhjjh");
        } else {
          $scope.form.survey = ''
        }
      } else {
        return response.data
      }




    })
  };

  $scope.showInViewer = function(newValue) {
    $scope.reader = new FileReader();

    console.log(newValue);
    if (typeof newValue != 'object' || newValue == null || newValue.name == "") {
      if ($scope.form.pk) {
        console.log("removing in edit slot");
        $('#imgPreview' + $scope.form.pk)
          .attr('src', "");
        console.log($scope.sectionInView);
        if (!$scope.sectionInView.imageUrl) {
          $scope.sectionInView.imageUrl = "";
        }
      } else {
        console.log("removing in new slot");
        $('#imgPreview')
          .attr('src', "");
      }
      return;
    }
    console.log("loading the image view");
    // if (newValue.name == "") {
    //   $('#blah').attr('src', '');
    //   return;
    // }
    $scope.reader.onload = function(e) {

      if ($scope.form.pk) {
        console.log("loading in edit slot");
        $('#imgPreview' + $scope.form.pk)
          .attr('src', e.target.result);
      } else {
        console.log("loading in new slot");
        $('#imgPreview')
          .attr('src', e.target.result);
      }

      // $scope.sectionInView.imageUrl = "";
    }

    $scope.reader.readAsDataURL(newValue);
  }



  $scope.gotoSection = function(indx) {
    console.log(indx);
    console.log($scope.sections);
    $scope.sectionInView = $scope.sections[indx];
    $scope.indexVal = indx;
    if ($scope.sectionInView == undefined) {
      $scope.addSection();
      $scope.sectionInView = $scope.sections[indx];
    }

    if (typeof $scope.sectionInView.img == 'string') {
      $scope.sectionInView.imageUrl = $scope.sectionInView.img;
    } else {
      $scope.showInViewer($scope.sectionInView.img)
    }
    if ($scope.sectionInView.img == null) {
      $scope.sectionInView.imageUrl = "";
    }
    if ($scope.sectionInView.header == "null") {
      $scope.sectionInView.header = "";
    }
    $scope.sectionIndex = indx;
    if ($scope.sectionInView.shortTitle == "null") {
      $scope.sectionInView.shortTitle = "";
    }
    if ($scope.sectionInView.altTexts == "null") {
      $scope.sectionInView.altTexts = "";
    }
    if ($scope.sectionInView.imageTitle == "null") {
      $scope.sectionInView.imageTitle = "";
    }
    if ($scope.sectionInView.content == "null") {
      $scope.sectionInView.content = "";
    }

  }


  $scope.collapse = function(val) {
    console.log(val);
    if (val == 'hide') {
      $scope.hide = true;
    } else {
      $scope.hide = false;
    }
  }



  $scope.resetErrors = function() {
    $scope.errors = {
      parent: false,
      title: false,
      category: false,
      articleUrl: false,
      author: false,
      typ: false,
      featuredContent: false,
      sensitive: false,
      // scheduleTime: false,
      summary: false,
      tags: false,
      metaDescription: false,
      keywords: false,
      // ogTitle: false,
      // ogUrl: false,
      articleSections: false,
    }
  }


  $scope.addSection = function() {
    // console.log('adinggggggggg new section');
    $scope.sections.push({
      header: '',
      shortTitle: '',
      content: '',
      img: emptyFile,
      altTexts: '',
      link: '',
      imageTitle: ''
    });
  }

  $scope.resetForms = function() {
    $scope.form = {
      category: '',
      articleUrl: '',
      author: '',
      lang: 'hi',
      typ: '',
      category: '',
      featuredContent: false,
      sensitive: false,
      // scheduleTime: new Date(),
      summary: '',
      tags: [],
      // metaTitle: '',
      metaDescription: '',
      keywords: [],
      // ogTitle: '',
      // ogUrl: '',
      // ogDescription: '',
      articleSections: [],
      content_type: 'article',
      link: true,
      otherCategories: [],
      read_time:5,
      ogImg:emptyFile
    }

    $scope.gototop = function() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }


    $scope.removeOtherCategory = function(i) {
      $scope.form.otherCategories.splice(i, 1);
    }

    $scope.resetErrors();


    $scope.sections = [{
      header: '',
      shortTitle: '',
      content: '',
      img: emptyFile,
      altTexts: '',
      link: '',
      imageTitle: ''
    }]

    $scope.gotoSection(0);

    $scope.bites = []
  }

  $scope.resetForms();
  console.log($state.params.id,'39293238');
  if ($state.params.id == undefined) {
    // console.log('new modeeeeeeeeee');
    $scope.mode = 'new';
    $scope.resetForms()
  } else {
    $scope.mode = 'edit';

    $http({
      method: 'GET',
      url: '/api/blogging/article/' + $state.params.id + '/'
    }).
    then(function(response) {
      $scope.form = response.data;
      console.log(response.data,'klk ur heree');

      $scope.sections = $scope.form.contents;
      console.log($scope.sections,'asdlasdjfljasldfsdl');
      console.log($scope.sections);
      // $scope.form.category = "";
      $scope.form.parent = response.data.category;

      var keywords = [];
      var keywordpush = []


      if (typeof $scope.form.keywords == 'object') {
        var keyParts = []
        for (var i = 0; i < $scope.form.keywords.length; i++) {
          keyParts.push($scope.form.keywords[i].name)
        }
        // var parts = keywordpush.join(',');
        // var keyParts = parts
      } else if ($scope.form.tags.search(",")) {
        var keyParts = $scope.form.keywords.split(',');
      } else {
        var keyParts = $scope.form.keywords
      }
      for (var i = 0; i < keyParts.length; i++) {
        if (keyParts[i].length == 0) {
          continue;
        }
        keywords.push({
          name: keyParts[i]
        })
      }
      $scope.form.keywords = keywords;
      var tags = [];
      var tagspush = []


      if (typeof $scope.form.tags != 'object') {
        if ($scope.form.tags.search(",")) {
          var tagParts = $scope.form.tags.split(',');
        } else {
          var tagParts = $scope.form.tags;
        }
      } else {
        var tagParts = []
        for (var i = 0; i < $scope.form.tags.length; i++) {
          tagParts.push($scope.form.tags[i].name)
        }
        console.log(tagParts, 'aaaaaaaaa');
      }

      for (var i = 0; i < tagParts.length; i++) {
        if (tagParts[i].length == 0) {
          continue;
        }
        tags.push({
          name: tagParts[i]
        })
      }
      // alert(tags);
      $scope.form.tags = tags;
      console.log($scope.form.tags, 'BBBBBBBBBBBBBBBBBBBBBBBB');

      keys = [];
      i = 1;


      for (var [key, value] of Object.entries($scope.form)) {
        if (key == ('qb' + i) && value != null) {
          $scope.bites.push({
            text: value
          });
          i += 1;
        }
      }
      // console.log($scope.bites);
      $scope.gotoSection(0);
    })

  }

  $scope.addBites = function() {
    if ($scope.bites.length > 7) {
      return;
    }
    $scope.bites.push({
      text: ''
    })
  }

  $scope.removeSection = function(indx) {
    $scope.sections.splice(indx, 1);
    if ($scope.sections.length == indx) {
      $scope.gotoSection(indx - 1);
    } else {
      $scope.gotoSection(indx);
    }
  }

  $scope.$watch('form.title', function(newValue, oldValue) {
    if (newValue) {
      console.log('aaaaaaaaaaaaaaa');
      $scope.form.ogTitle = newValue;
      $scope.form.metaTitle = newValue;

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
      console.log(url.replace(/-/g, ' '));
      console.log(url.replace(/-/g, ' ').trim());
      console.log(url.replace(/-/g, ' ').trim().replace(' ', '-'));
      // $scope.form.articleUrl = url.replace('-' , ' ').replace(/^\s+|\s+$/gm,'');
      $scope.form.articleUrl = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
      console.log($scope.form.articleUrl,"ll;");
    }
    // console.log(url);
    // $scope.form.articleUrl = newValue.replace(/\s+/g, '-').toLowerCase();
  })

  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace anchor',
    skin: 'lightgray',
    theme: 'modern',
    height: 400,
    toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link',
    setup: function(editor) {
      // editor.addButton();
    },
    rel_list: [{
        title: 'None',
        value: 'none'
      },
      {
        title: 'No Follow',
        value: 'nofollow'
      },
      {
        title: 'Table of contents',
        value: 'toc'
      }
    ]
  };

  $scope.clearFile = function(selIndx) {
    $scope.sections[selIndx].img = emptyFile;
    $scope.sections[selIndx].imageUrl = "";
    $scope.sectionInView.imageUrl = "";
    $scope.sectionInView.img = emptyFile;
    // if (typeof $scope.sectionInView.img == 'string') {
    // }else{
    // }
  }


  $scope.openFilePicker = function(selIndx) {
    $scope.indexVal = selIndx
    if (!$scope.form.pk) {
      document.getElementById('selectedFile').click();
    } else {
      console.log("hereererere");
      document.getElementById('selectedFile' + $scope.form.pk).click();
    }
  }


  $scope.addCategory = function() {
    for (var i = 0; i < $scope.form.otherCategories.length; i++) {
      if ($scope.form.otherCategories[i].pk == $scope.form.category.pk) {
        Flash.create('warning', 'Category already exist')
        return;
      }
    }
    $scope.form.otherCategories.push($scope.form.category)
  }


  $scope.$watch('sections_to_send', function(newValue, oldValue) {
    if ($scope.saving && $scope.sections.length == newValue.length) {
      console.log("herrrrrrrrrrrrrrrrrrrrrrrrsssssssssssssssss");

      var secIDs = []
      for (var i = 0; i < $scope.sections.length; i++) {
        secIDs.push($scope.sections[i].pk)
      }
      $scope.saveArticle(secIDs);

    }
  }, true)


  $scope.$watch('sectionInView.img', function(newValue, oldValue) {
    $scope.showInViewer(newValue);
  })

  $scope.gotoSection(0);
  // $scope.saving = false;

  $scope.sections_to_send = [];
  $scope.saving = false;

  $scope.validate = function(type, errortype) {
    console.log(type, errortype);
    if (type == undefined || type == '' || type == null) {
      errortype = true
    } else {
      errortype = false
    }
  }
  $scope.saveForm = function() {
    console.log($scope.form)
    var findError = []

    // if ($scope.form.title == undefined || $scope.form.title == '' || $scope.form.title == null) {
    //   $scope.errors.title = true
    //   findError.push($scope.errors.title)
    // }
    // if ($scope.form.articleUrl == undefined || $scope.form.articleUrl == '' || $scope.form.articleUrl == null) {
    //   $scope.errors.articleUrl = true
    //   findError.push($scope.errors.articleUrl)
    // }
    // console.log($scope.form.author, 'kkkkkkk');
    //
    // if ($scope.form.author != '') {
    //   if (typeof $scope.form.author == 'string') {
    //     $scope.errors.author = true
    //     findError.push($scope.errors.author)
    //   }
    // }
    //
    // if ($scope.form.typ == undefined || $scope.form.typ == '' || $scope.form.typ == null) {
    //   $scope.errors.typ = true
    //   findError.push($scope.errors.typ)
    // }
    // if (typeof $scope.form.parent == 'object') {
    //   $scope.form.otherCategories.push($scope.form.parent)
    // }
    // if ($scope.form.otherCategories.length == 0 ) {
    //   Flash.create('warning', 'Please select and add a category')
    //   $scope.errors.category = true
    //   findError.push($scope.errors.category)
    // }

    // console.log(findError.length, 'error');
    // if (findError.length >= 1) {
    //   return
    // }

    $scope.sections_to_send = [];
    $scope.saving = true;

    if ($scope.form.content_type == 'article') {

      for (var i = 0; i < $scope.sections.length; i++) {
        if ($scope.sections[i].content == null || $scope.sections[i].content.length == 0) {
          Flash.create('danger', 'Content is empty in section ' + (i + 1))
          return;
        }
      }

      for (var i = 0; i < $scope.sections.length; i++) {
        var Method = 'POST';
        var Url = '/api/blogging/articleSection/';
        var d = $scope.sections[i];
        var fd = new FormData();


        fd.append('header', d.header);
        fd.append('shortTitle', d.shortTitle);
        fd.append('content', d.content);
        fd.append('index', i);

        if (d.img != emptyFile) {
          if ($scope.mode == 'edit' && typeof d.img != 'string' && d.img != null) {
            fd.append('img', d.img);
          } else if ($scope.mode != 'edit') {
            fd.append('img', d.img);
          }
        } else {
          if (d.imageUrl == "" || d.imageUrl == null || d.imageUrl == undefined) {
            fd.append("clearImage", "1")
          }
        }

        fd.append('altTexts', d.altTexts);
        fd.append('link', d.link);
        fd.append('imageTitle', d.imageTitle);

        if (d.pk) {
          Method = 'PATCH';
          Url += d.pk + '/'
        }

        $http({
          method: Method,
          url: Url,
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).then((function(i) {
          return function(response) {
            $scope.sections[i].pk = response.data.pk;
            $scope.sections_to_send.push($scope.sections[i].pk)
          }
        })(i))
      }
    } else {
      var Method = 'POST';
      var Url = '/api/blogging/articleSection/';
      var d = $scope.sections[0];
      var fd = new FormData();
      //
      // fd.append('header', d.header);
      // fd.append('shortTitle', d.shortTitle);
      // console.log(d.img, 'image');
      if ($scope.form.content_type == 'image') {
        if (i == 0 && d.img == emptyFile || d.img.name == "") {
          Flash.create('warning', 'Please upload atleast one image in Introduction section')
          return
        } else {
          if (d.img != emptyFile) {
            if ($scope.mode == 'edit' && typeof d.img != 'string' && d.img != null) {
              fd.append('img', d.img);
            } else if ($scope.mode != 'edit') {
              fd.append('img', d.img);
            }
          }
        }
      } else {
        // if (d.img != emptyFile) {
        if ($scope.mode == 'edit' && typeof d.img != 'string' && d.img != null) {
          fd.append('img', d.img);
        } else if ($scope.mode != 'edit') {
          fd.append('img', d.img);
        }
        // }
      }

      fd.append('altTexts', d.altTexts);
      if ($scope.form.content_type == 'video') {
        if (d.link == "" || d.link == null || d.link == undefined) {
          Flash.create('warning', 'Please add Link in Introduction section')
          return
        } else {
          fd.append('link', d.link);
        }
      }
      if ($scope.form.content_type == 'image') {
        fd.append('imageTitle', d.imageTitle);
      }

      if (d.pk) {
        Method = 'PATCH';
        Url += d.pk + '/'
      }

      Url += '?skipMinification=1'

      $http({
        method: Method,
        url: Url,
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).then(function(response) {
        $scope.sections[0].pk = response.data.pk;
        $scope.sections_to_send.push(response.data.pk);
      })
    }
  }

  $scope.$watch('form.metaDescription', function(newValue, oldValue) {
    if ($scope.form.linkDesc && $scope.mode != 'edit') {
      $scope.form.ogDescription = newValue;
    }
  });

  $scope.linkDesc = true;

  $scope.saveArticle = function(articleSections) {
    $scope.form.articleSections = articleSections
    // if ($scope.mode = 'edit') {
    // console.log('patch requestttttt');
    // var Method = 'PACTH';
    // var Url = '/api/blogging/article/';
    // } else {
    // console.log('post Requesttttttttt');



    var Method = 'POST';
    var Url = '/api/blogging/article/';

    if ($scope.mode == 'edit') {
      Method = 'PATCH';
      Url += $scope.form.pk + '/'

      console.log($scope.form.tags,'sklsdkslk');
    }

    var tgs = '';
    if ($scope.form.tags.length > 0) {
      for (var i = 0; i < $scope.form.tags.length; i++) {
        tgs += $scope.form.tags[i].name + ','
      }
    }

    var keywords = '';
    if ($scope.form.keywords > 0) {
      for (var i = 0; i < $scope.form.keywords.length; i++) {
        keywords += $scope.form.keywords[i].name + ','
      }
    }

    // if (typeof $scope.form.category == 'string' ||  $scope.form.category == null) {
    //   Flash.create('warning', '')
    // }









    // otherCategories.push($scope.form.parent.pk)
    var d = $scope.form;
    console.log(d.articleSections,'lllllllllllllll');
    if (d.articleSections.length == 0) {
      return;
    }
    var otherCategories = []
    for (var i = 0; i < $scope.form.otherCategories.length; i++) {
      otherCategories.push($scope.form.otherCategories[i].pk);
    }
    var finalData = new FormData();
    finalData.append('title',d.title)
    finalData.append('articleUrl',d.articleUrl)
    finalData.append('lang',d.lang)
    // finalData.append('category__id',$scope.form.otherCategories[0].pk)
    finalData.append('featuredContent',d.featuredContent)


    finalData.append('tags',tgs)

    if (d.author) {
      finalData.append('author__id',d.author.pk)
      // finalData.author__id = d.author.pk
    }
    // finalData.append('ogUrl',d.articleUrl)
    // finalData.append('ogDescription',d.ogDescription)
    finalData.append('contents__ids',d.articleSections)
    finalData.append('otherCategories__ids',otherCategories)
    finalData.append('content_type',d.content_type)
    if (true) {

    }
    if (typeof d.ogImg != 'string' && d.ogImg != emptyFile && d.ogImg != null) {
      finalData.append('ogImg', d.ogImg)
    }



    if ($scope.bites.length > 0) {
      finalData.qb1 = $scope.bites[0].text;
    }
    if ($scope.bites.length > 1) {
      finalData.qb2 = $scope.bites[1].text;
    }
    if ($scope.bites.length > 2) {
      finalData.qb3 = $scope.bites[2].text;
    }
    if ($scope.bites.length > 3) {
      finalData.qb4 = $scope.bites[3].text;
    }
    if ($scope.bites.length > 4) {
      finalData.qb5 = $scope.bites[4].text;
    }
    if ($scope.bites.length > 5) {
      finalData.qb6 = $scope.bites[5].text;
    }
    if ($scope.bites.length > 6) {
      finalData.qb7 = $scope.bites[6].text;
    }
    // console.log(toSend, '----------tosend data');
    $http({
      method: Method,
      url: Url,
      data: finalData,
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      $scope.saving = false;
      if ($scope.mode != 'edit') {
        $scope.form = response.data
        Flash.create('success', 'Updated');
        $scope.resetForms();
      }
    })



  }

  $http.get('/api/blogging/category/?onlyParent=').
  then(function(response) {
    $scope.parent = response.data;
  })


  // '/api/HR/userSearch/?search=' + query + '&profile__is_creator=false&is_superuser=false&is_staff=false&profile__is_doctor=true'
  $scope.userSearch = function(query) {
    return $http.get('/api/HR/userSearch/?search=' + query ).
    then(function(response) {
      return response.data;
    })
  };


  $http({
    method: 'GET',
    url: '/api/blogging/type/'
  }).
  then(function(response) {
    $scope.types = response.data;
     return response.data
  })


  $scope.$watch('form.parent', function(newValue, oldValue) {
    console.log(newValue,"jkkjjkjk");
    if (newValue != undefined) {
      $http.get('/api/blogging/category/?parent=' + newValue.pk).
      then(function(response) {
        $scope.childrens = response.data
      })
    } else {
      $scope.childrens = [];
    }
  });
  $scope.createCategory = function(data) {
      $uibModal.open({
          templateUrl: '/static/ngTemplates/app.businessManagement.createCategory.html',
          size: 'lg',
          backdrop: true,
          resolve: {
            category: function() {
              return data
            }
          },
          controller: 'controller.createCategory',
        })
        .result.then(function(d) {}, function(d) {
          console.log(d,'33434');
          $scope.form.parent = ''
        })
    }

})

app.controller('controller.createCategory', function($scope, $http, $aside, $state, Flash, $users, $filter,  category,$uibModalInstance) {
  $scope.form = {
    name: '',
    title: '',
    typ: '',
    data: '',
    banner: emptyFile,
    img: emptyFile
  }
  if (typeof(category) =='string') {
    $scope.form.name = category
  }
  console.log(typeof(category), '90342849394')
  if (typeof(category) == 'object') {
    $scope.form.pk = category.pk
    $scope.form.name = category.name
    $scope.form.title = category.title
    $scope.form.typ = category.typ
    $scope.form.data = category.data
    $scope.form.banner = category.banner
    $scope.form.img = category.img
  }
  $scope.save = function() {
    var fd = new FormData()
    fd.append('name', $scope.form.name)
    fd.append('title', $scope.form.title)
    fd.append('typ', $scope.form.typ)
    fd.append('data', $scope.form.data)
    if ($scope.form.banner != null && typeof($scope.form.banner) == 'object') {
      fd.append('banner', $scope.form.banner)

    }
    if ($scope.form.img != null && typeof($scope.form.img) == 'object') {
      fd.append('img', $scope.form.img)

    }
    var method = 'POST'
    var url = "/api/blogging/category/"
    if ($scope.form.pk) {
      method = "PATCH"
      url = "/api/blogging/category/" + $scope.form.pk + '/'
    }
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
      Flash.create('success', 'Saved');
      $uibModalInstance.dismiss(response.data)

    })
  }




})

app.controller('businessManagement.articles.reviewComment', function($scope, $http, $aside, $state, Flash, $users, $filter ){

  $scope.articleData = $scope.tab.data.article;
  $scope.articleContents = $scope.articleData.contents;

  $scope.reviewer = $users.get('mySelf')
  console.log($scope.reviewer.is_staff);

  $http({
    method: 'GET',
    url: '/api/blogging/article/' + $scope.articleData.pk + '/',
  }).
  then(function(response) {
    $scope.mainData = response.data;
    $scope.call()
  })

  $scope.call = function() {
    if ($scope.reviewer) {
      if ($scope.reviewer.is_staff && $scope.mainData.status == 'submitted') {
        $scope.sendApproval = false
        $scope.afterSubmit = true
        $scope.publish = true
      }
      if ($scope.mainData.status == 'created') {
        $scope.sendApproval = true
        $scope.afterSubmit = false
        $scope.publish = false
      }
      if ($scope.mainData.status == 'submitted' && !$scope.reviewer.is_staff) {
        $scope.sendApproval = true
        $scope.afterSubmit = false
        $scope.publish = false
      }
      if ($scope.mainData.status == 'published') {
        $scope.publish = false
        $scope.afterSubmit = false
        $scope.sendApproval = false
      }
    }

  }


  $http({
    method: 'GET',
    url: '/api/blogging/ReviewerComment/?article=' + $scope.articleData.pk,
  }).
  then(function(response) {
    $scope.reviews = response.data;
    console.log($scope.reviews, 'aaaaaa')

  })
  $scope.form = {
    review: '',
  }

  $scope.sendreview = function() {
    console.log($scope.reviewer.pk, $scope.form.review, $scope.articleData.pk, 'llllll');
    if ($scope.form.review == '') {
      Flash.create('warning', 'Please Write Something...')
      return
    }
    var sendData = {
      reviewer: $scope.reviewer.pk,
      reviewerComment: $scope.form.review,
      article: $scope.articleData.pk,
    }
    $http({
      method: 'POST',
      url: '/api/blogging/ReviewerComment/',
      data: sendData,
    }).
    then(function(response) {
      $scope.form.review = ''
      Flash.create('success', 'Review Sent Successfully')
      console.log(response.data)
      $scope.reviews.push(response.data);
    })

  }

  $scope.me = $users.get('mySelf');
  if ($scope.me.is_staff || $scope.me.is_superuser) {
    $scope.manage = true;
  } else {
    $scope.manage = false;
  }

  $scope.loading = false;

  $scope.sendForApproval = function(type) {
    $scope.loading = true;
    console.log($scope.reviewer.pk, 'lllllll');
    var sendData = {}
    var method, url
    if (type == 'submitted') {
      sendData.user = $scope.reviewer.pk
      sendData.status = 'submitted'
      sendData.article_id = $scope.mainData.pk
      method = 'POST'
      url = '/api/blogging/SendMail/?type=mail'
    }
    if (type == 'published') {
      sendData.article_id = $scope.mainData.pk
      sendData.status = 'published'
      method = 'POST'
      url = '/api/blogging/SendMail/?type=publish'
    }
    if (type == 'created') {
      sendData.article_id = $scope.mainData.pk
      sendData.status = 'created'
      method = 'POST'
      url = '/api/blogging/SendMail/?type=content'
    }

    $http({
      method: method,
      url: url,
      data: sendData,
    }).
    then(function(response) {
      Flash.create('success', ' Successfully Sent')
      $scope.articleData.status = response.data.status;

      $scope.loading = false;


    })


  }


})

app.controller('businessManagement.articles.browse', function($scope, $http, $aside, $state, Flash, $users, $filter ){



  $scope.userSearchDoctor = function(query) {
    return $http.get('/api/HR/userSearch/?username__icontains=' + query + '&profile__is_creator=false&is_superuser=false&is_staff=false&profile__is_doctor=true').
    then(function(response) {
      return response.data;
    })
  };

  $scope.userSearchWriter = function(query) {
    return $http.get('/api/HR/userSearch/?username__icontains=' + query + '&profile__is_creator=true&is_superuser=false&is_staff=false&profile__is_doctor=false').
    then(function(response) {
      return response.data;
    })
  };

  $scope.userSearcManager = function(query) {
    return $http.get('/api/HR/userSearch/?username__icontains=' + query + '&profile__is_creator=false&is_superuser=false&is_staff=true&profile__is_doctor=false').
    then(function(response) {
      return response.data;
    })
  };

  $scope.publish = function() {
    $scope.publishCount = 0
    $scope.responseCount = 0
    if ($scope.publishData == undefined) {
      Flash.create("warning", 'Select Batch Operation')
      return
    }
    for (var i = 0; i < $scope.articles.length; i++) {
      if ($scope.articles[i].selected) {
        $scope.publishCount += 1
        $http({
          method: 'PATCH',
          url: '/api/blogging/article/' + $scope.articles[i].pk + '/',
          data: {
            action: $scope.publishData,
            // publish:$scope.isPubish
          },
        }).
        then(function(response) {
          $scope.responseCount += 1
          if ($scope.publishCount == $scope.responseCount) {
            Flash.create('success', $scope.publishData + 'ed')
          }
          $scope.articles.splice(i, 1);

        })
      }
    }
  }

  $scope.publishEach = function(pkVal, actionVal, indx) {
    var actionData = actionVal
    $http({
      method: 'PATCH',
      url: '/api/blogging/article/' + pkVal + '/',
      data: {
        action: actionData,
        // publish:$scope.isPubish
      },
    }).
    then(function(response) {

      Flash.create("success", actionData + 'ed')
      $scope.articles.splice(indx, 1);
    })
  }

})
