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
            pageType:''

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
          if ($scope.form.defaultTitle.length == 0 || $scope.form.defaultDescription.length == 0 ) {
            Flash.create('warning', 'Please fill all the details')
            return
          }
          if ($scope.form.pageType.length == 0) {
            Flash.create('warning', 'Please select the type of website')
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
