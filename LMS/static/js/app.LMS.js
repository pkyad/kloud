//------------------------------------------Courses starts-------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.LMS', {
      url: "/LMS",
      templateUrl: '/static/ngTemplates/app.LMS.courses.html',
      controller: 'businessManagement.LMS'
    })
    .state('businessManagement.LMS.new', {
      url: "/new",
      templateUrl: '/static/ngTemplates/app.LMS.courses.form.html',
      controller: 'businessManagement.LMS.form'
    })
    .state('businessManagement.LMS.edit', {
      url: "/edit/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.courses.form.html',
      controller: 'businessManagement.LMS.form'
    })
    .state('businessManagement.activityLog', {
      url: "/activityLog/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.courses.explore.html',
      controller: 'businessManagement.activityLog'
    })
}); //------------------------------------------Courses ends-------------------------------------------------


//----------------------------------Online test  starts-----------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.LMS.evaluation', {
      url: "/evaluation",
      templateUrl: '/static/ngTemplates/app.LMS.evaluation.html',
      controller: 'businessManagement.LMS.evaluation'
    })
    //--------------------------new creation---------------------------------------------------------
    .state('businessManagement.LMS.newmultiplechoice', {
      url: "/multiplechoice/new/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.multiplechoice.html',
      controller: 'businessManagement.LMS.evaluation'
    })
    .state('businessManagement.LMS.newsubjective', {
      url: "/subjective/new/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.subjectiveques.html',
      controller: 'businessManagement.LMS.evaluation'
    })
    .state('businessManagement.LMS.newfileupload', {
      url: "/fileupload/new/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.fileupload.html',
      controller: 'businessManagement.LMS.evaluation'
    })
    .state('businessManagement.LMS.viewPaper', {
      url: "/onlinetest/view/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.onlinetestview.html',
      controller: 'businessManagement.LMS.evaluation'
    })
    //--------------------------new creation---------------------------------------------------------
    .state('businessManagement.LMS.newEvaluation', {
      url: "/evaluation/new",
      templateUrl: '/static/ngTemplates/app.LMS.evaluation.form.html',
      controller: 'businessManagement.LMS.evaluation.form'
    })
    .state('businessManagement.LMS.editEvaluation', {
      url: "/evaluation/edit/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.evaluation.form.html',
      controller: 'businessManagement.LMS.evaluation.form'
    })

}); //----------------------------------Online test ends-----------------------------------------------------

//------------------------------------------------books starts------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.LMS.Configureallbooks', {
      url: "/LMSconfigure/allBooks",
      templateUrl: '/static/ngTemplates/app.LMS.configBook.item.html',
      controller: 'businessManagement.LMS.configureLMS'
    }).state('businessManagement.LMS.editBook', {
      url: "/LMSconfigure/bookEdit/:id/",
      templateUrl: '/static/ngTemplates/app.LMS.configure.form.html',
      controller: 'businessManagement.LMS.configureLMS.form'
    })
    .state('businessManagement.LMS.newBook', {
      url: "/LMSconfigure/new",
      templateUrl: '/static/ngTemplates/app.LMS.configure.form.html',
      controller: 'businessManagement.LMS.configureLMS.form'
    })
});
//------------------------------------------------books ends----------------------------------


app.controller("businessManagement.LMS", function($scope, $state, $users, $stateParams, $http, Flash, $timeout,$stateParams) {

  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/LMS/course/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.search.query.length > 0) {
      url = url + '&title=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.fetchData()
});

app.controller("businessManagement.activityLog", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside, $rootScope) {


  $http({
    method: 'GET',
    url: '/api/LMS/course/' + $stateParams.id + '/'
  }).
  then(function(response) {
    $scope.course = response.data
    console.log($scope.course);
    $scope.activeTab = 0;
    $scope.me = $users.get('mySelf');
    $scope.showAddBtn = false
    console.log($scope.me, $scope.course);
    if ($scope.course.instructor.pk == $scope.me.pk) {
      $scope.showAddBtn = true
    } else if ($scope.course.TAs.indexOf($scope.me.pk) >= 0) {
      $scope.showAddBtn = true
    }

    $scope.enrollmentForm = {
      user: undefined
    }
    $scope.addEnrollment = function() {
      if ($scope.enrollmentForm.user == undefined || typeof $scope.enrollmentForm.user != 'object') {
        Flash.create('warning', 'Please select a user first');
        return;
      }


      for (var i = 0; i < $scope.course.enrollments.length; i++) {
        if ($scope.course.enrollments[i].user == $scope.enrollmentForm.user.pk) {
          Flash.create('danger', 'User already enrolled for this course');
          return;
        }
      }

      var toSend = {
        user: $scope.enrollmentForm.user.pk,
        course: $scope.course.pk
      }

      $http({
        method: 'POST',
        url: '/api/LMS/enrollment/',
        data: toSend
      }).
      then(function(response) {
        Flash.create('success', 'Added')
        $scope.enrollmentForm.user = undefined;
        $scope.course.enrollments.push(response.data);
      })

    }

    $http({
      method: 'GET',
      url: '/api/LMS/bookcoursemap/?course=' + $scope.course.pk
    }).then(function(response) {
      $scope.bdata = response.data;
    })
    $scope.addBook = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMs.course.bookUpload.html',
        size: 'md',
        backdrop: true,
        resolve: {
          data: function() {
            return $scope.course;
          }
        },
        controller: function($scope, $uibModalInstance, data) {
          $scope.bookSearch = function(query) {
            return $http.get('/api/LMS/book/?title__contains=' + query).
            then(function(response) {
              return response.data;
            })
          };

          $scope.saveBook = function() {
            var url = '/api/LMS/bookcoursemap/'
            var method = 'POST';
            var toSend = {
              book: $scope.form.book.pk,
              course: $stateParams.id,
              referenceBook: $scope.form.referencebook,
            }
            $http({
              method: method,
              url: url,
              data: toSend
            }).
            then(function(response) {
                Flash.create('success', 'Book Added successfully');
                $uibModalInstance.dismiss(response.data);
              },
              function(error) {
                Flash.create('danger', 'Book is already added,choose a diffrent book');
              })
          }
        }, //controller ends
      }).result.then(function(f) {

      }, function(f) {
        $scope.bdata.push(f)
        console.log(f, '--------pushed');
      });
    } //addbookfunction ends

    // //----------fetch homework-------------
    $http({
      method: 'GET',
      url: '/api/LMS/homework/?course=' + $scope.course.pk
    }).then(function(response) {
      $scope.homwrkData = response.data;
    })

    //-------------delete homework------------
    $scope.deleteHomework = function(index, pk) {
      console.log('deleteing', index, '---------', pk);
      $http({
        method: 'DELETE',
        url: '/api/LMS/homework/' + pk + '/'
      }).
      then(function(response) {
        $scope.allData.splice(index, 1);
        Flash.create('danger', 'Deleted Homework')
      })
    }
    // //-----------adding homewoks
    $scope.homework = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMs.course.homework.form.html',
        size: 'md',
        backdrop: true,
        resolve: {
          data: function() {
            return $scope.course;
          }
        },
        controller: function($scope, $uibModalInstance, data) {
          $scope.saveHomework = function() {
            console.log('ccccccclllll----in-----homeeeeee save', data.pk, '-----------', $scope.form.paper.pk);
            var fd = new FormData();
            if ($scope.form.pdf != emptyFile && typeof $scope.form.pdf != 'string' && $scope.form.pdf != null) {
              fd.append('pdf', $scope.form.pdf);
            }
            if ($scope.form.date == '') {
              Flash.create('warning', 'Please Add Tentative Closing Date')
              return
            } else if (typeof $scope.form.date == 'object') {
              $scope.form.date = $scope.form.date.toJSON().split('T')[0]
            }
            fd.append('created', $scope.form.date);
            fd.append('course', data.pk);
            fd.append('paper', $scope.form.paper.pk);
            var method = 'POST'
            var url = '/api/LMS/homework/'
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
              Flash.create('success', 'Saved Successfully');
              $uibModalInstance.dismiss(response.data);
            })
          }

        }, //controller ends
      }).result.then(function(h) {

      }, function(h) {
        if (typeof h == 'object') {
          $scope.homwrkData.push(h)
          $scope.refreshData();
        }
      })
    }
    //homework ends------------

    //quiz starts...........................----------------------------------------------------------------
    $scope.createQuiz = function() {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.addquiz.html',
        size: 'md',
        backdrop: true,
        resolve: {
          data: function() {
            return $scope.course;
          }
        },
        controller: function($scope, $uibModalInstance, data) {

            $scope.paperSearch = function(query) {
              //search for the paper
              return $http.get('/api/LMS/paper/?name=' + query).
              then(function(response) {
                return response.data;
              })
            };






        }, //controller ends
      }).result.then(function(h) {

      }, function(h) {
        if (typeof h == 'object') {
          $scope.homwrkData.push(h)
          $scope.refreshData();
        }
      })
    } //quiz ends...........................
  });
})



app.controller("businessManagement.LMS.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  $scope.resetForm = function() {
    $scope.form = {
      enrollmentStatus: 'open',
      description: '',
      dp: emptyFile,
      // TAs: [],
      instructor: undefined,
      title: '',
      sellingPrice:'',
      discount:'',
    };
  }
  $scope.resetForm()
  if (typeof $scope.tab == 'undefined') {
    $scope.mode = 'new';
    $scope.resetForm()
  }


  $scope.userSearch = function(query) {
    //search for the user
    return $http.get('/api/HR/userSearch/?username__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.getInstructor = function(user) {
    if (typeof user == 'undefined') {
      return;
    }
    return user.first_name + '  ' + user.last_name;
  }


  $scope.saveCourse = function() {

    var method = 'POST'
    var url = '/api/LMS/course/'

    var fd = new FormData();
    if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string' && $scope.form.dp != null) {
      fd.append('dp', $scope.form.dp);
    }
    fd.append('title', $scope.form.title);
    fd.append('enrollmentStatus', $scope.form.enrollmentStatus);
    fd.append('description', $scope.form.description);
    // fd.append('TAs', $scope.form.TAs);
    fd.append('instructor', $scope.form.instructor.pk);
    fd.append('sellingPrice', $scope.form.sellingPrice);
    fd.append('discount', $scope.form.discount);

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
      $scope.allData.push(response.data)
      Flash.create('success', 'Created Course successfully')
      $scope.resetForm();
    })

  }

  if ($state.is('businessManagement.LMS.edit')) {
    console.log($stateParams.id, "course");
    $http({
      method: 'GET',
      url: '/api/LMS/course/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.form = response.data

    })
    $scope.editCourses = function() {
      var fd = new FormData();
      if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string' && $scope.form.dp != null) {
        fd.append('dp', $scope.form.dp);
      }
      fd.append('title', $scope.form.title);
      fd.append('enrollmentStatus', $scope.form.enrollmentStatus);
      fd.append('description', $scope.form.description);
      // fd.append('TAs', $scope.form.TAs);
      fd.append('instructor', $scope.form.instructor.pk);
      fd.append('sellingPrice', $scope.form.sellingPrice);
      fd.append('discount', $scope.form.discount);
      $http({
        method: 'PATCH',
        url: '/api/LMS/course/' + $stateParams.id + '/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        Flash.create('success', 'Updated Course successfully')
        $scope.resetForm();

      })
    }

  }

});

app.controller("businessManagement.LMS.examReport", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  console.log($scope.tab.data.pk);

  $http({
    method: 'GET',
    url: '/api/LMS/enrollment/?course=' + $scope.tab.data.pk
  }).then(function(response) {
    $scope.students = response.data;
    for (var i = 0; i < $scope.students.length; i++) {
      $scope.students[i].data = [100, 150, 160, 180];
    }
    console.log($scope.students);
    $scope.students = $scope.students.sort(function(a, b) {
      return (a.user) - (b.user)
    });

  })
  $scope.labels = ["Physics", "Chemistry", "Maths", "Biology"];
  $scope.colors = ['#f5bf78', '#9cf29c', '#9ad1f5', '#f7f5ba']

  $scope.showMore = function(val, pk) {
    $http({
      method: 'GET',
      url: '/api/tutors/tutors24Profile/?user=' + pk
    }).then(function(response) {
      $scope.info = response.data;
      console.log($scope.info);
    })

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.enrolled.students.html',
      size: 'xl',
      backdrop: true,
      resolve: {
        stuData: function() {
          return $scope.info;
        },
      },
      controller: function($scope, stuData, $uibModalInstance) {
        if (val == 'info') {
          console.log('info');
        } else if (val == 'report') {
          console.log('report');
        } else {
          console.log('resssss');
        }
      }
    })
  }
}) //-----------------------------------------------courses ends--------------------------------------------

//-----------------------------------------------online tet starts--------------------------------------------
app.controller('businessManagement.LMS.evaluation', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal,$stateParams) {


  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/LMS/paper/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.fetchData()



  $scope.savePaperGroup = function() {
    console.log($scope.paperGroupData);

    var f = $scope.paperGroupData
    if (f.title.length == 0 || f.description.length == 0) {
      Flash.create('danger', 'All Fields Are Required')
      return
    }
    if (f.blogData.ogimage == emptyFile && (f.blogData.ogimageUrl == '' || f.blogData.ogimageUrl == undefined)) {
      Flash.create('danger', 'Either the OG image file OR og image url is required')
      return;
    }
    if (f.blogData.tagsCSV == '' || f.blogData.section == '' || f.blogData.author == '' || f.blogData.description == '') {
      Flash.create('danger', 'Please check the All SEO related fields');
      return;
    }
    var toSend = {
      title: f.title,
      description: f.description,
      subject: f.subject.pk
    }
    var method = 'PATCH'
    var url = '/api/LMS/paperGroup/' + f.pk + '/'
    $http({
      method: method,
      url: url,
      data: toSend,
    }).
    then(function(response) {
      var f = $scope.paperGroupData
      var fd = new FormData();
      if (f.blogData.ogimage != emptyFile && typeof f.blogData.ogimage != 'string' && f.blogData.ogimage != null) {
        fd.append('ogimage', f.blogData.ogimage);
      } else {
        fd.append('ogimageUrl', f.blogData.ogimageUrl);
      }
      fd.append('contentType', 'paperGroup');
      fd.append('title', f.blogData.title);
      fd.append('shortUrl', f.blogData.shortUrl);
      fd.append('description', f.blogData.description);
      fd.append('tagsCSV', f.blogData.tagsCSV);
      fd.append('section', f.blogData.section);
      fd.append('author', f.blogData.author);
      fd.append('header', f.pk)
      var method = 'POST';
      var url = '/api/PIM/blog/';
      if (f.blogData.pk) {
        method = 'PATCH';
        url += f.blogData.pk + '/';
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
        Flash.create('success', 'Saved Successfully')
      });
    })
  }

  //---------------------------------------online test uib modal--------------------------------------------



  //---------------------------------------online test uib modal ends-------------------------------------

  //---------------------------------------multiple choice new--------------------------------------------
  if ($state.is('businessManagement.LMS.newmultiplechoice')) {
    $scope.tinymceOptions = {
      selector: 'textarea',
      content_css: '/static/css/bootstrap.min.css',
      inline: false,
      plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace anchor',
      skin: 'lightgray',
      theme: 'modern',
      height: 400,
      toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link',
      setup: function(editor) {},
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
    $scope.resetForm = function(){
      $scope.form = {
        marks:'',
        ques:'',
        paper:'',
        // qtype:'string',
      }
    }
    $scope.resetForm()

    $scope.saveMCQ = function(){
        var qtype = 'mcq'
        if ($scope.form.ques == null || $scope.form.ques.length == 0) {
          Flash.create('warning', 'Please write question')
          return;
        }
        if ($scope.form.marks == null || $scope.form.marks.length == 0) {
          Flash.create('warning', 'Please add score')
          return;
        }
        var datatosend = {
          marks:$scope.form.marks,
          ques:$scope.form.ques,
          paper:$stateParams.id,
          qtype:qtype,
        }
        $http({
          method: 'POST',
          url: '/api/LMS/question/',
          data: datatosend
        }).
        then(function(response) {
          $scope.form.pk=response.data.pk
          Flash.create("success" , "Question created")
          // $scope.resetForm()

        })

    }
    $scope.options = function(pk) {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.addoption.html',
        size: 'md',
        backdrop: true,
        resolve: {
          data: function() {
            console.log(pk,"mmmmmmmmmmmmmmm");
            return pk;
          }
        },
        controller: function($scope, $uibModalInstance, data) {
          $scope.statechange = function() {
            $state.go('businessManagement.LMS.newmultiplechoice',{'id':pk})
            $uibModalInstance.dismiss()
          }
          $scope.statechange1 = function() {
            $state.go('businessManagement.LMS.newsubjective',{'id':pk})
            $uibModalInstance.dismiss()
          }
          $scope.statechange2 = function() {
            $state.go('businessManagement.LMS.newfileupload',{'id':pk})
            $uibModalInstance.dismiss()
          }

        }, //controller ends
      }).result.then(function(h) {
        $scope.fetchData()
      }, function(h) {
        if (typeof h == 'object') {
          $scope.fetchData()
        }
      })
    }

  }
  //---------------------------------------multiple choice  ends-------------------------------------

  //--------------------------------------- subjective starts--------------------------------------------

  if ($state.is('businessManagement.LMS.newsubjective')) {
    $scope.tinymceOptions = {
      selector: 'textarea',
      content_css: '/static/css/bootstrap.min.css',
      inline: false,
      plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace anchor',
      skin: 'lightgray',
      theme: 'modern',
      height: 400,
      toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link',
      setup: function(editor) {},
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
    $scope.resetForm = function(){
      $scope.form = {
        marks:'',
        ques:'',
        paper:'',
        qtype:'string',
      }
    }
    $scope.resetForm()

    $scope.saveSubjective = function(){
        var qtype = 'string'
        if ($scope.form.ques == null || $scope.form.ques.length == 0) {
          Flash.create('warning', 'Please write question')
          return;
        }
        if ($scope.form.marks == null || $scope.form.marks.length == 0) {
          Flash.create('warning', 'Please add score')
          return;
        }
        var datatosend = {
          marks:$scope.form.marks,
          ques:$scope.form.ques,
          paper:$stateParams.id,
          qtype:qtype,
        }
        $http({
          method: 'POST',
          url: '/api/LMS/question/',
          data: datatosend
        }).
        then(function(response) {
          Flash.create("success" , "Question created")
          $scope.resetForm()

        })

    }

  }

  //---------------------------------------subjective new ends-------------------------------------

  //---------------------------------------file upload new--------------------------------------------

  if ($state.is('businessManagement.LMS.newfileupload')) {
    $scope.tinymceOptions = {
      selector: 'textarea',
      content_css: '/static/css/bootstrap.min.css',
      inline: false,
      plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace anchor',
      skin: 'lightgray',
      theme: 'modern',
      height: 400,
      toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link',
      setup: function(editor) {},
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
  }
  //---------------------------------------file upload ends-------------------------------------

  //---------------------------------------Paper view starts-------------------------------------
  if ($state.is('businessManagement.LMS.viewPaper')) {
    $scope.search={
      query:''
    }
     console.log($stateParams.id);
     $scope.fetchData = function(){
       let url = '/api/LMS/question/?paper=' + $stateParams.id
       if ($scope.search.query.length > 0) {
         url = url + '&name=' + $scope.search.query
       }
       $http({
         method:'GET',
         url:url
       }).
       then(function(response) {
         $scope.questions = response.data
         $scope.quesArray = []

         for(var i=0;i<$scope.questions.length;i++){
           // if($scope.questions[i].qtype == 'string'){
             console.log("here")
             console.log($scope.questions[i])
             $scope.new = $scope.questions[i].ques.slice(4,$scope.questions[i].ques.length - 4)
             console.log($scope.new)
             $scope.quesArray.push($scope.new)

         // }
         // else{
         //     $scope.new = $scope.questions[i].ques
         //     $scope.quesArray.push($scope.new)
         // }
        }
         console.log($scope.quesArray,"ssss");
       })
     }
     $scope.fetchData()
       $http({
         method:'GET',
         url: '/api/LMS/paper/' + $stateParams.id +'/',
       }).
       then(function(response) {
         $scope.paper = response.data

         console.log($scope.questions);
       })


       $scope.onlineTest = function(pk) {
         $uibModal.open({
           templateUrl: '/static/ngTemplates/app.LMS.onlinetwstnew.html',
           size: 'xl',
           backdrop: true,
           resolve: {
             data: function() {
               console.log(pk,"mmmmmmmmmmmmmmm");
               return pk;
             }
           },
           controller: function($scope, $uibModalInstance, data) {
             $scope.statechange = function() {
               $state.go('businessManagement.LMS.newmultiplechoice',{'id':pk})
               $uibModalInstance.dismiss()
             }
             $scope.statechange1 = function() {
               $state.go('businessManagement.LMS.newsubjective',{'id':pk})
               $uibModalInstance.dismiss()
             }
             $scope.statechange2 = function() {
               $state.go('businessManagement.LMS.newfileupload',{'id':pk})
               $uibModalInstance.dismiss()
             }

           }, //controller ends
         }).result.then(function(h) {
           $scope.fetchData()
         }, function(h) {
           if (typeof h == 'object') {
             $scope.fetchData()
           }
         })
       }


  }

  //---------------------------------------paper view ends-------------------------------------
});

app.controller("businessManagement.LMS.evaluation.explore", function($scope, $state, $users, $stateParams, $http, Flash) {
  $scope.fetchData = function() {
    $http({
      method: 'GET',
      url: '/api/LMS/paper/?groupId=' + $stateParams.id
    }).
    then(function(response) {
      $scope.paper = response.data

    })
  }
  $scope.fetchData()
});


app.controller("businessManagement.LMS.evaluation.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.resetForm = function() {
    $scope.selectedquestions = []
    $scope.questions = []
    $scope.form = {
      text: '',
      typ: '',
      book: '',
      section: '',
      name: '',
      timelimit: '',
      group: '',
      description: '',
      level: '',
    }
  }
  $scope.resetForm();
  $scope.time = new Date();

  if ($scope.tab == undefined || $scope.tab.data == undefined) {
    $scope.mode = 'new';
    $scope.form.timelimit = 60;
    $scope.form.level = 'easy'
  } else {
    $scope.mode = 'edit';
    $scope.selectedquestions = $scope.tab.data.paper.questions;
    $scope.form.name = $scope.tab.data.paper.name
    $scope.form.group = $scope.tab.data.paper.group
    $scope.form.description = $scope.tab.data.paper.description
    $scope.form.level = $scope.tab.data.paper.level
    console.log($scope.selectedquestions);
    console.log($scope.tab.data.paper.timelimit, 'ddddd');
    $scope.form.timelimit = $scope.tab.data.paper.timelimit;
  }


  $scope.$watch('form.section', function(newValue, oldValue) {
    if (typeof newValue != 'object') {
      return;
    }
    $scope.fetchQuestions();
  });

  // $scope.paperGroupSearch = function(query) {
  //   return $http.get('/api/LMS/paperGroup/?limit=10&title__icontains=' + query).
  //   then(function(response) {
  //     return response.data.results;
  //   })
  // };

  // $scope.openPaperGroup = function() {
  //   $uibModal.open({
  //     templateUrl: '/static/ngTemplates/app.LMs.evaluation.papergroup.form.html',
  //     size: 'lg',
  //     backdrop: true,
  //     resolve: {
  //       groupData: function() {
  //         return $scope.form.group;
  //       }
  //     },
  //     controller: function($scope, $uibModalInstance, groupData) {
  //       console.log(groupData);
  //       if (groupData.pk) {
  //         $scope.paperGroupForm = groupData
  //       } else {
  //         $scope.paperGroupForm = {
  //           title: groupData,
  //           description: '',
  //           blogData: {
  //             title: '',
  //             shortUrl: '',
  //             ogimage: emptyFile,
  //             ogimageUrl: '',
  //             description: '',
  //             tagsCSV: '',
  //             section: '',
  //             author: '',
  //           }
  //         }
  //       }
  //
  //       $scope.cancel = function() {
  //         $uibModalInstance.dismiss('Cancel')
  //       }
  //
  //       $scope.save = function() {
  //         console.log($scope.paperGroupForm);
  //         var f = $scope.paperGroupForm
  //         if (f.title.length == 0 || f.description.length == 0) {
  //           Flash.create('danger', 'All Fields Are Required')
  //           return
  //         }
  //
  //         if (f.blogData.ogimage == emptyFile && (f.blogData.ogimageUrl == '' || f.blogData.ogimageUrl == undefined)) {
  //           Flash.create('danger', 'Either the OG image file OR og image url is required')
  //           return;
  //         }
  //         if (f.blogData.tagsCSV == '' || f.blogData.section == '' || f.blogData.author == '' || f.blogData.description == '') {
  //           Flash.create('danger', 'Please check the All SEO related fields');
  //           return;
  //         }
  //
  //         var toSend = {
  //           title: f.title,
  //           description: f.description,
  //         }
  //         var method = 'POST'
  //         var url = '/api/LMS/paperGroup/'
  //         if (f.pk != undefined) {
  //           method = 'PATCH'
  //           url += f.pk + '/'
  //         }
  //         $http({
  //           method: method,
  //           url: url,
  //           data: toSend,
  //         }).
  //         then(function(response) {
  //           $scope.paperGroupForm.pk = response.data.pk
  //           var f = $scope.paperGroupForm
  //           var fd = new FormData();
  //           if (f.blogData.ogimage != emptyFile && typeof f.blogData.ogimage != 'string' && f.blogData.ogimage != null) {
  //             fd.append('ogimage', f.blogData.ogimage);
  //           } else {
  //             fd.append('ogimageUrl', f.blogData.ogimageUrl);
  //           }
  //           fd.append('contentType', 'paperGroup');
  //           fd.append('title', f.blogData.title);
  //           fd.append('shortUrl', f.blogData.shortUrl);
  //           fd.append('description', f.blogData.description);
  //           fd.append('tagsCSV', f.blogData.tagsCSV);
  //           fd.append('section', f.blogData.section);
  //           fd.append('author', f.blogData.author);
  //           fd.append('header', response.data.pk)
  //           var method = 'POST';
  //           var url = '/api/PIM/blog/';
  //           if (f.blogData.pk) {
  //             method = 'PATCH';
  //             url += f.blogData.pk + '/';
  //           }
  //           $http({
  //             method: method,
  //             url: url,
  //             data: fd,
  //             transformRequest: angular.identity,
  //             headers: {
  //               'Content-Type': undefined
  //             }
  //           }).
  //           then(function(response) {
  //             $scope.paperGroupForm.blogData = response.data
  //             Flash.create('success', 'Saved Successfully')
  //             $uibModalInstance.dismiss($scope.paperGroupForm)
  //           });
  //         })
  //       }
  //     },
  //   }).result.then(function(a) {
  //
  //   }, function(a) {
  //     console.log(a);
  //     if (a.pk != undefined) {
  //       $scope.form.group = a
  //     }
  //   });
  // }

  $scope.fetchQuestions = function() {


      var url = '/api/LMS/question/?bookSection=' + $scope.form.section.pk + '&ques__contains=' + $scope.form.text

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.questions.length = 0
      angular.forEach(response.data, function(obj) {
        $scope.questions.push({
          'ques': obj
        })
      })
      console.log($scope.questions);
    })
  }

  $scope.bookSearch = function(query) {
    return $http.get('/api/LMS/book/?title__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.sectionSearch = function(query) {
    return $http.get('/api/LMS/section/?title__contains=' + query + '&book=' + $scope.form.book.pk).
    then(function(response) {
      return response.data;
    })
  };

  $scope.add = function() {
    $scope.title = false;
    for (var i = 0; i < $scope.questions.length; i++) {
      console.log($scope.questions[i])
      if ($scope.questions[i].selected) {
        $scope.selectedquestions.push({
          'ques': $scope.questions[i].ques,
          'marks': 1,
          'negativeMarks': 0.25,
          'optional': false
        })
      }
    }
  };


  $scope.delete = function(indx) {
    $scope.selectedquestions.splice(indx, 1)
  }

  console.log($scope.form.description, 'eeee');
  $scope.save = function() {

    // if ($scope.form.group.pk == undefined) {
    //   Flash.create('danger', 'Please Select Proper Paper Group')
    //   return
    // }

    if (!$scope.form.name.length) {
      Flash.create('danger', 'Add Question Paper Title')
      return
    }

    if (!$scope.form.description) {
      Flash.create('danger', 'Add Question Paper description')
      return
    }

    var toSend = []
    for (var i = 0; i < $scope.selectedquestions.length; i++) {
      console.log($scope.selectedquestions[i])
      var data = {
        ques: $scope.selectedquestions[i].ques.pk,
        marks: $scope.selectedquestions[i].marks,
        optional: $scope.selectedquestions[i].optional,
        negativeMarks: $scope.selectedquestions[i].negativeMarks,
      }
      toSend.push(data)
    }

    var method = 'POST';

    $http({
      method: method,
      url: '/api/LMS/paper/',
      data: {
        questions: toSend,
        name: $scope.form.name,
        timelimit: $scope.form.timelimit,
        // group: $scope.form.group.pk,
        description: $scope.form.description,
        level: $scope.form.level
      }
    }).
    then(function(response) {
      Flash.create('success', 'Question Paper Created');
      $scope.resetForm();
    }, function(response) {
      Flash.create('warning', 'Add Question Paper Title ');
    });


  };
  $scope.form = {
    group: '',
    name: '',
    timelimit: '',
    description: '',
    level: '',
    typ: '',
    section: '',
    subject: '',
    topic: '',
    text: '',
    selected: '',
  }



  if ($state.is("businessManagement.LMS.editEvaluation")) {
    var toSend = []
    for (var i = 0; i < $scope.selectedquestions.length; i++) {
      console.log($scope.selectedquestions[i])
      var data = {
        ques: $scope.selectedquestions[i].ques.pk,
        marks: $scope.selectedquestions[i].marks,
        optional: $scope.selectedquestions[i].optional,
        negativeMarks: $scope.selectedquestions[i].negativeMarks,
      }
      toSend.push(data)
    }
    $http({
      method: 'GET',
      url: '/api/LMS/paper/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.form = response.data
      console.log($scope.form);
    })
    $scope.editinPaper = function() {
      dataToSend = {
        questions: toSend,
        name: $scope.form.name,
        timelimit: $scope.form.timelimit,
        // group: $scope.form.group.pk,
        description: $scope.form.description,
        level: $scope.form.level
      };
      Flash.create('success', 'Updated');
      $http({
        method: 'PATCH',
        url: '/api/LMS/paper/' + $stateParams.id + '/',
        data: dataToSend,
      }).
      then(function(response) {
        Flash.create('success', 'Updated');
        console.log('dataaaa', response.data);
      })
    }
  }




  if ($state.is("businessManagement.LMS.editPapergorup")) {


    $scope.subjectSearch = function(query) {
      return $http.get('/api/LMS/subject/?limit=10&title__icontains=' + query).
      then(function(response) {
        return response.data.results;
      })
    };
    $scope.paperGroupForm = {
      title: '',
      description: '',
      subject: '',
      blogData: {
        title: '',
        shortUrl: '',
        ogimage: emptyFile,
        ogimageUrl: '',
        description: '',
        tagsCSV: '',
        section: '',
        author: '',
      }
    }
    $http({
      url: '/api/LMS/paperGroup/' + $stateParams.id + '/',
      method: 'GET',
    }).then(function(response) {
      $scope.paperGroupForm = response.data
      console.log($scope.paperGroupForm);

    })
    $scope.updatePaperGroup = function() {
      console.log($scope.paperGroupForm);

      var f = $scope.paperGroupForm
      if (f.title.length == 0 || f.description.length == 0) {
        Flash.create('danger', 'All Fields Are Required')
        return
      }
      if (f.blogData.ogimage == emptyFile && (f.blogData.ogimageUrl == '' || f.blogData.ogimageUrl == undefined)) {
        Flash.create('danger', 'Either the OG image file OR og image url is required')
        return;
      }
      if (f.blogData.tagsCSV == '' || f.blogData.section == '' || f.blogData.author == '' || f.blogData.description == '') {
        Flash.create('danger', 'Please check the All SEO related fields');
        return;
      }
      var toSend = {
        title: f.title,
        description: f.description,
        subject: f.subject.pk
      }
      var method = 'PATCH'
      var url = '/api/LMS/paperGroup/' + $stateParams.id + '/'
      $http({
        method: method,
        url: url,
        data: toSend,
      }).
      then(function(response) {

        var f = $scope.paperGroupForm

        var fd = new FormData();
        if (f.blogData.ogimage != emptyFile && typeof f.blogData.ogimage != 'string' && f.blogData.ogimage != null) {
          fd.append('ogimage', f.blogData.ogimage);
        } else {
          fd.append('ogimageUrl', f.blogData.ogimageUrl);
        }
        fd.append('contentType', 'paperGroup');
        fd.append('title', f.blogData.title);
        fd.append('shortUrl', f.blogData.shortUrl);
        fd.append('description', f.blogData.description);
        fd.append('tagsCSV', f.blogData.tagsCSV);
        fd.append('section', f.blogData.section);
        fd.append('author', f.blogData.author);
        fd.append('header', f.pk)

        var url = '/api/PIM/blog/' + f.blogData.pk + '/';
        console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
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
          Flash.create('success', 'Saved Successfully')
        });
      })
    }
  }
});
app.controller("businessManagement.LMS.knowledgeBank.book.explore", function($scope, $state, $users, $stateParams, $http, Flash) {

  $scope.fetchData = function() {
    let url = '/api/LMS/book/' + $stateParams.id + '/'

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.bookData = response.data
      console.log($scope.bookData);
    })
  }
  $scope.fetchData()
  $http({
    method: 'GET',
    url: '/api/LMS/section/?book=' + $stateParams.id,
  }).
  then(function(response) {
    $scope.sectionsData = response.data;
  })


  $scope.showQues = function(idx) {

    $http({
      method: 'GET',
      url: '/api/LMS/question/?bookSection=' + $stateParams.id,
    }).
    then(function(response) {
      $scope.sectionQuestion = response.data;
    })
  }

  $scope.editQuestion = function(idx) {
    $scope.$parent.$parent.$parent.$parent.$parent.$parent.addTab({
      title: 'EditBookQuestion : ' + $scope.sectionQuestion[idx].pk,
      cancel: true,
      app: 'questionEditor',
      data: {
        pk: $scope.sectionQuestion[idx].pk,
      },
      active: true
    })
    console.log($scope.$parent.$parent.$parent.$parent.$parent.$parent.addTab({
      title: 'Edit Book Question',
      cancel: true,
      app: 'questionEditor',
      data: {
        pk: $scope.sectionQuestion[idx].pk,
      },
      active: true
    }));
  }
  $scope.viewAnswer = function(idx) {
    $scope.$parent.$parent.$parent.$parent.$parent.$parent.addTab({
      title: 'View Solution : ' + $scope.sectionQuestion[idx].pk,
      cancel: true,
      app: 'questionExplorer',
      data: {
        pk: $scope.sectionQuestion[idx].pk,
      },
      active: true
    })
    console.log($scope.$parent.$parent.$parent.$parent.$parent.$parent.addTab({
      title: 'View Solution : ' + $scope.sectionQuestion[idx].pk,
      cancel: true,
      app: 'questionExplorer',
      data: {
        pk: $scope.sectionQuestion[idx].pk,
      },
      active: true
    }));
  }
})
//----------------------------------------online test ends---------------------------------------------------


//----------------------------------------question bank starts---------------------------------------------------

 //------------------------------------------------question bank ends----------------------------------

//------------------------------------------------Books starts----------------------------------

app.controller("businessManagement.LMS.configureLMS", function($scope, $state, $users, $stateParams, $http, Flash) {
  if ($state.is("businessManagement.LMS.Configureallbooks")) {
    $scope.limit = 10
    $scope.offset = 0
    $scope.count = 0

    $scope.privious = function() {
      if ($scope.offset > 0) {
        $scope.offset -= $scope.limit
        $scope.fetchData()
      }
    }

    $scope.next = function() {
      if ($scope.offset < $scope.count) {
        $scope.offset += $scope.limit
        $scope.fetchData()
      }
    }
    $scope.search = {
      query: ''
    }
    $scope.fetchData = function() {
      let url = '/api/LMS/book/?limit=' + $scope.limit + '&offset=' + $scope.offset
      if ($scope.search.query.length > 0) {
        url = url + '&name=' + $scope.search.query
      }
      $http({
        method: 'GET',
        url: url
      }).
      then(function(response) {
        $scope.data = response.data.results
        $scope.count = response.data.count
        console.log($scope.data);
      })
    }
    $scope.fetchData()
  }

  $scope.limit = 10
  $scope.offset = 0
  $scope.count = 0

  $scope.privious = function() {
    if ($scope.offset > 0) {
      $scope.offset -= $scope.limit
      $scope.fetchData()
    }
  }

  $scope.next = function() {
    if ($scope.offset < $scope.count) {
      $scope.offset += $scope.limit
      $scope.fetchData()
    }
  }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    let url = '/api/LMS/subject/?limit=' + $scope.limit + '&offset=' + $scope.offset
    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.data = response.data.results
      $scope.count = response.data.count
      console.log($scope.allData);
    })
  }
  $scope.fetchData()



});

app.controller("businessManagement.LMS.configureLMS.form", function($scope, $state, $users, $stateParams, $filter, $uibModal, $http, Flash) {


  if ($state.is('businessManagement.LMS.editBook')) {
    $scope.mode = 'book';

    $http({
      method: 'GET',
      url: '/api/LMS/book/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.form = response.data
      console.log(response.data);
    })


    if ($scope.dataPK != undefined) {
      $http({
        method: 'GET',
        url: '/api/PIM/blog/?contentType=book&&header=' + $scope.dataPK,
      }).
      then(function(response) {
        console.log($scope.dataPK);
        if (response.data.length > 0) {
          console.log('editttttt');
          $scope.blogType = 'edit'
          $scope.blogData = response.data[0]
        } else {
          console.log('newwwwwwwwww');
          $scope.blogType = 'new'
          $scope.blogData = {}
        }
      })
    }


    $scope.resetForm = function() {
      $scope.form = {
        title: '',
        description: '',
        seoTitle: '',
        syllabus: '',
        dp: emptyFile,
        level: 0,
        author: '',
        ISSN: '',
        volume: '',
        version: '',
        license: '',
        subject: '',
        topic: '',
        sections: []
      }
    }
    $scope.resetForm();

    $scope.addSection = function(index, position,pk) {
      console.log('section clickeddddddddddddddddddddddd');
      console.log(index);
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.section.html',
        size: 'md',
        backdrop: true,
        resolve: {
          bookData: function() {
            return $scope.bookDetails;
          },
        },
        controller: function($scope, bookData, $uibModalInstance) {
          $scope.editmode = false;
          console.log('bbbbbbbbb', bookData);
          $scope.Sectionform = {
            title: '',
            shortUrl: '',
            description: '',
            seoTitle: '',
          }
          $scope.cancelSection = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveSection = function() {
            console.log('clickedddddddddddddddddd');
            console.log($scope.Sectionform.title);
            if ($scope.Sectionform.title == null || $scope.Sectionform.title.length == 0) {
              Flash.create('warning', 'Please Mention Some Title')
              return;
            }
            if ($scope.Sectionform.shortUrl == null || $scope.Sectionform.shortUrl.length == 0) {
              Flash.create('warning', 'Please Mention Some Short Url')
              return;
            }
            var secData = {
              title: $scope.Sectionform.title,
              shortUrl: $scope.Sectionform.shortUrl,
              book: $stateParams.id,
              description: $scope.Sectionform.description,
              seoTitle: $scope.Sectionform.seoTitle,
            }

            $http({
              method: 'POST',
              url: '/api/LMS/section/',
              data: secData
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)

            })
          }

        },
      }).result.then(function() {

      }, function(reason) {

        if (reason != undefined) {
          if (typeof reason == 'object') {
            if (position == 'bottom') {
              $scope.form.sections.splice(index + 1, 0, reason)
            } else {
              $scope.form.sections.splice(0, 0, reason)
            }
            $scope.secArr = true
          }
        }

      });
    }

    $scope.editSection = function(index) {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.section.html',
        size: 'md',
        backdrop: true,
        resolve: {
          bookData: function() {
            return $scope.bookDetails;
          },
          secItem: function() {
            return $scope.form.sections[index]
          },
        },
        controller: function($scope, bookData, secItem, $uibModalInstance) {
          $scope.editmode = true;
          console.log(secItem, "----------------getting");
          console.log(secItem.pk, "----------------getting pkkkkkkkkkkk");
          $scope.Sectionform = secItem
          $scope.cancelSection = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveSection = function() {
            console.log(secItem.shortUrl, '----------ssss');
            if ($scope.Sectionform.title == null || $scope.Sectionform.title.length == 0) {
              Flash.create('warning', 'Please Mention Some Title')
              return;
            }
            var secData = {
              title: $scope.Sectionform.title,
              shortUrl: $scope.Sectionform.shortUrl,
              book: bookData.pk,
              description: $scope.Sectionform.description,
              seoTitle: $scope.Sectionform.seoTitle,
            }

            $http({
              method: 'PATCH',
              url: '/api/LMS/section/' + secItem.pk + '/',
              data: secData
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)
              Flash.create('success', 'Updated successfully')
            })
          }

        },
      })
    }



    console.log('typpppppppppp', $scope.blogType);

    $scope.blogPopup = function(bookId) {

      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.blogForm.html',
        size: 'md',
        backdrop: true,
        resolve: {
          blogData: function() {
            return $scope.blogData;
          },
          bookId: function() {
            return bookId;
          },
        },
        controller: function($scope, blogData, bookId, $uibModalInstance) {
          console.log('bbbbbbbbb', blogData, bookId);

          if (blogData.pk) {
            $scope.blogForm = blogData
          } else {
            $scope.blogForm = {
              contentType: 'book',
              tags: [],
              ogimage: emptyFile,
              ogimageUrl: '',
              description: '',
              tagsCSV: '',
              section: '',
              author: '',
              title: '',
            }
          }
          console.log($scope.blogForm);
          $scope.cancelBlog = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveBlog = function() {
            console.log('clickedddddddddddddddddd');
            console.log($scope.blogForm);

            var tags = [];
            for (var i = 0; i < $scope.blogForm.tags.length; i++) {
              tags.push($scope.blogForm.tags[i].pk)
            }

            var fd = new FormData();

            if ($scope.blogForm.ogimage == emptyFile && ($scope.blogForm.ogimageUrl == '' || $scope.blogForm.ogimageUrl == undefined)) {
              Flash.create('danger', 'Either the OG image file OR og image url is required')
              return;
            }
            if ($scope.blogForm.tagsCSV == '' || $scope.blogForm.section == '' || $scope.blogForm.author == '' || $scope.blogForm.description == '') {
              Flash.create('danger', 'Please check the All SEO related fields');
              return;
            }

            if ($scope.blogForm.ogimage != emptyFile && typeof $scope.blogForm.ogimage != 'string' && $scope.blogForm.ogimage != null) {
              fd.append('ogimage', $scope.blogForm.ogimage);

            } else {
              fd.append('ogimageUrl', $scope.blogForm.ogimageUrl);
            }


            fd.append('tagsCSV', $scope.blogForm.tagsCSV);
            fd.append('section', $scope.blogForm.section);
            fd.append('author', $scope.blogForm.author);
            fd.append('description', $scope.blogForm.description);
            fd.append('header', bookId)
            fd.append('contentType', 'book');
            fd.append('tags', tags);
            fd.append('title', $scope.blogForm.title);
            fd.append('shortUrl', $scope.blogForm.shortUrl);

            if ($scope.blogForm.pk) {
              method = 'PATCH';
              url = '/api/PIM/blog/' + $scope.blogForm.pk + '/';
            } else {
              method = 'POST';
              url = '/api/PIM/blog/';
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
              if ($scope.blogForm.pk) {
                Flash.create('success', 'Updated');
              } else {
                Flash.create('success', 'Created');
              }
              $uibModalInstance.dismiss(response.data)
            });

          }

        },
      }).result.then(function() {

      }, function(reason) {

        if (reason != undefined) {
          $scope.blogType = 'edit'
          $scope.blogData = reason
        }

      });
    }


    $scope.secMove = function(index, position) {
      console.log('clickkkkkkk', index, position);
      if ($scope.form.sections.length > 1) {
        var a = $scope.form.sections[index]
        if (position == 'up') {
          if (index > 0) {
            $scope.form.sections.splice(index, 1)
            $scope.form.sections.splice(index - 1, 0, a)
          }
        } else {
          if (index < $scope.form.sections.length - 1) {
            $scope.form.sections.splice(index, 1)
            $scope.form.sections.splice(index + 1, 0, a)
          }
        }
      }
    }
    $scope.saveSecSeq = function() {
      for (var i = 0; i < $scope.form.sections.length; i++) {
        $http({
          method: 'PATCH',
          url: '/api/LMS/section/' + $scope.form.sections[i].pk + '/',
          data: {
            sequence: i
          }
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
        })
      }
    }
    $scope.subjectSearch = function(query) {
      return $http.get('/api/LMS/subject/?title__contains=' + query).
      then(function(response) {
        return response.data;
      })
    };

    $scope.bookShow = true
    // $scope.subjectShow = true
    // $scope.topicShow = true
    // $scope.form.subject = '';
    // console.log('**********************',action,appType);
    if ($scope.clickOn != undefined) {
      console.log('***********', $scope.clickOn);
      if ($scope.clickOn == 'book') {
        $scope.form = $scope.booksData
        console.log('kkkkkkkkkkkkkkkk', $scope.form);
        $scope.form.sections = $filter('orderBy')($scope.booksData.sections, 'sequence')
        $scope.bookDetails = $scope.booksData
        $scope.mode = 'book';
        $scope.bookShow = true
        // $scope.subjectShow = false
        // $scope.topicShow = false
        if ($scope.form.sections.length > 0) {
          $scope.secArr = true
        }
      }

    }
    $scope.save = function() {

      var toSend = new FormData();
      var method = 'POST'
      var url = '/api/LMS/' + $scope.mode + '/'
      if ($scope.form.pk) {
        var method = 'PATCH'
        var url = '/api/LMS/' + $scope.mode + '/' + $scope.form.pk + '/'
      }
      console.log('fileeeeeeeeeeeeeee', typeof $scope.form.dp, $scope.form);
      if ($scope.form.title.length == 0) {
        Flash.create('warning', 'Title is required');
        return;
      }
      toSend.append('title', $scope.form.title)
      toSend.append('description', $scope.form.description)


      if ($scope.mode == 'subject') {
        if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string') {
          toSend.append('dp', $scope.form.dp)
        }
        toSend.append('level', $scope.form.level)
      } else if ($scope.mode == 'book') {

        if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string') {
          toSend.append('dp', $scope.form.dp)
        }
        if ($scope.form.author != null && $scope.form.author.length > 0) {
          toSend.append('author', $scope.form.author)
        }

        toSend.append('subject', $scope.form.subject)

        toSend.append('topic', $scope.form.topic)

        if ($scope.form.ISSN != null && $scope.form.ISSN.length > 0) {
          toSend.append('ISSN', $scope.form.ISSN)
        }
        if ($scope.form.volume != null && $scope.form.volume.length > 0) {
          toSend.append('volume', $scope.form.volume)
        }
        if ($scope.form.version != null && $scope.form.version.length > 0) {
          toSend.append('version', $scope.form.version)
        }
        if ($scope.form.license != null && $scope.form.license.length > 0) {
          toSend.append('license', $scope.form.license)
        }
      } else {

        if ($scope.form.syllabus != null && $scope.form.syllabus.length > 0) {
          toSend.append('syllabus', $scope.form.syllabus)
        }
      }

      $http({
        method: method,
        url: url,
        data: toSend,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        if ($scope.mode == 'book') {
          $scope.hideBook = 'yes'
          $scope.bookDetails = response.data
          $scope.bookDetails.sections = $filter('orderBy')($scope.bookDetails.sections, 'sequence')
          console.log('bookkkkkkkkkkkkkkkk', $scope.bookDetails);
          if ($scope.form.pk) {
            Flash.create('success', 'Book Is updated');
          } else {
            Flash.create('success', 'Book Is Created');
          }
        } else {
          if ($scope.form.pk) {
            Flash.create('success', 'updated');
          } else {
            $scope.resetForm();
            Flash.create('success', 'Saved');
          }
        }
      })
    }
  }
  if ($state.is('businessManagement.LMS.newBook')) {
    $scope.mode = 'book';

    $scope.resetForm = function() {
      $scope.form = {
        title: '',
        description: '',
        seoTitle: '',
        syllabus: '',
        dp: emptyFile,
        level: 0,
        author: '',
        ISSN: '',
        volume: '',
        version: '',
        license: '',
        subject: '',
        topic: '',
        sections: []
      }
    }
    $scope.resetForm();
    $scope.addSection = function(index, position, pk) {
      console.log('section clickeddddddddddddddddddddddd');
      console.log(index);
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.section.html',
        size: 'md',
        backdrop: true,
        resolve: {
          bookData: function() {
            return $scope.bookDetails;
          },
        },
        controller: function($scope, bookData, $uibModalInstance) {
          $scope.editmode = false;
          console.log('bbbbbbbbb', bookData);
          $scope.Sectionform = {
            title: '',
            shortUrl: '',
            description: '',
            seoTitle: '',
          }
          $scope.cancelSection = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveSection = function() {
            console.log('clickedddddddddddddddddd');
            console.log($scope.Sectionform.title);
            if ($scope.Sectionform.title == null || $scope.Sectionform.title.length == 0) {
              Flash.create('warning', 'Please Mention Some Title')
              return;
            }
            if ($scope.Sectionform.shortUrl == null || $scope.Sectionform.shortUrl.length == 0) {
              Flash.create('warning', 'Please Mention Some Short Url')
              return;
            }
            var secData = {
              title: $scope.Sectionform.title,
              shortUrl: $scope.Sectionform.shortUrl,
              book: bookData.pk,
              description: $scope.Sectionform.description,
              seoTitle: $scope.Sectionform.seoTitle,
            }

            $http({
              method: 'POST',
              url: '/api/LMS/section/',
              data: secData
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)
            }, function(err) {
              Flash.create('danger', 'This Short Url Already Exist Select Another')
            })
          }

        },
      }).result.then(function() {

      }, function(reason) {

        if (reason != undefined) {
          if (typeof reason == 'object') {
            if (position == 'bottom') {
              $scope.form.sections.splice(index + 1, 0, reason)
            } else {
              $scope.form.sections.splice(0, 0, reason)
            }
            $scope.secArr = true
          }
        }

      });
    }

    $scope.editSection = function(index) {
      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.section.html',
        size: 'md',
        backdrop: true,
        resolve: {
          bookData: function() {
            return $scope.bookDetails;
          },
          secItem: function() {
            return $scope.form.sections[index]
          },
        },
        controller: function($scope, bookData, secItem, $uibModalInstance) {
          $scope.editmode = true;
          console.log(secItem, "----------------getting");
          console.log(secItem.pk, "----------------getting pkkkkkkkkkkk");
          $scope.Sectionform = secItem
          $scope.cancelSection = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveSection = function() {
            console.log(secItem.shortUrl, '----------ssss');
            if ($scope.Sectionform.title == null || $scope.Sectionform.title.length == 0) {
              Flash.create('warning', 'Please Mention Some Title')
              return;
            }
            var secData = {
              title: $scope.Sectionform.title,
              shortUrl: $scope.Sectionform.shortUrl,
              book: bookData.pk,
              description: $scope.Sectionform.description,
              seoTitle: $scope.Sectionform.seoTitle,
            }

            $http({
              method: 'PATCH',
              url: '/api/LMS/section/' + secItem.pk + '/',
              data: secData
            }).
            then(function(response) {
              $uibModalInstance.dismiss(response.data)
              Flash.create('success', 'Updated successfully')
            })
          }

        },
      })
    }



    console.log('typpppppppppp', $scope.blogType);

    $scope.blogPopup = function(bookId) {

      $uibModal.open({
        templateUrl: '/static/ngTemplates/app.LMS.book.blogForm.html',
        size: 'md',
        backdrop: true,
        resolve: {
          blogData: function() {
            return $scope.blogData;
          },
          bookId: function() {
            return bookId;
          },
        },
        controller: function($scope, blogData, bookId, $uibModalInstance) {
          console.log('bbbbbbbbb', blogData, bookId);

          if (blogData.pk) {
            $scope.blogForm = blogData
          } else {
            $scope.blogForm = {
              contentType: 'book',
              tags: [],
              ogimage: emptyFile,
              ogimageUrl: '',
              description: '',
              tagsCSV: '',
              section: '',
              author: '',
              title: '',
            }
          }
          console.log($scope.blogForm);
          $scope.cancelBlog = function() {
            $uibModalInstance.dismiss()
          }
          $scope.saveBlog = function() {
            console.log('clickedddddddddddddddddd');
            console.log($scope.blogForm);

            var tags = [];
            for (var i = 0; i < $scope.blogForm.tags.length; i++) {
              tags.push($scope.blogForm.tags[i].pk)
            }

            var fd = new FormData();

            if ($scope.blogForm.ogimage == emptyFile && ($scope.blogForm.ogimageUrl == '' || $scope.blogForm.ogimageUrl == undefined)) {
              Flash.create('danger', 'Either the OG image file OR og image url is required')
              return;
            }
            if ($scope.blogForm.tagsCSV == '' || $scope.blogForm.section == '' || $scope.blogForm.author == '' || $scope.blogForm.description == '') {
              Flash.create('danger', 'Please check the All SEO related fields');
              return;
            }

            if ($scope.blogForm.ogimage != emptyFile && typeof $scope.blogForm.ogimage != 'string' && $scope.blogForm.ogimage != null) {
              fd.append('ogimage', $scope.blogForm.ogimage);

            } else {
              fd.append('ogimageUrl', $scope.blogForm.ogimageUrl);
            }


            fd.append('tagsCSV', $scope.blogForm.tagsCSV);
            fd.append('section', $scope.blogForm.section);
            fd.append('author', $scope.blogForm.author);
            fd.append('description', $scope.blogForm.description);
            fd.append('header', bookId)
            fd.append('contentType', 'book');
            fd.append('tags', tags);
            fd.append('title', $scope.blogForm.title);
            fd.append('shortUrl', $scope.blogForm.shortUrl);

            if ($scope.blogForm.pk) {
              method = 'PATCH';
              url = '/api/PIM/blog/' + $scope.blogForm.pk + '/';
            } else {
              method = 'POST';
              url = '/api/PIM/blog/';
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
              if ($scope.blogForm.pk) {
                Flash.create('success', 'Updated');
              } else {
                Flash.create('success', 'Created');
              }
              $uibModalInstance.dismiss(response.data)
            });

          }

        },
      }).result.then(function() {

      }, function(reason) {

        if (reason != undefined) {
          $scope.blogType = 'edit'
          $scope.blogData = reason
        }

      });
    }


    $scope.secMove = function(index, position) {
      console.log('clickkkkkkk', index, position);
      if ($scope.form.sections.length > 1) {
        var a = $scope.form.sections[index]
        if (position == 'up') {
          if (index > 0) {
            $scope.form.sections.splice(index, 1)
            $scope.form.sections.splice(index - 1, 0, a)
          }
        } else {
          if (index < $scope.form.sections.length - 1) {
            $scope.form.sections.splice(index, 1)
            $scope.form.sections.splice(index + 1, 0, a)
          }
        }
      }
    }
    $scope.saveSecSeq = function() {
      for (var i = 0; i < $scope.form.sections.length; i++) {
        $http({
          method: 'PATCH',
          url: '/api/LMS/section/' + $scope.form.sections[i].pk + '/',
          data: {
            sequence: i
          }
        }).
        then(function(response) {
          Flash.create('success', 'Saved');
        })
      }
    }
    $scope.subjectSearch = function(query) {
      return $http.get('/api/LMS/subject/?title__contains=' + query).
      then(function(response) {
        return response.data;
      })
    };

    $scope.bookShow = true
    $scope.subjectShow = true
    $scope.topicShow = true
    $scope.form.subject = '';
    // console.log('**********************',action,appType);
    if ($scope.clickOn != undefined) {
      console.log('***********', $scope.clickOn);
      if ($scope.clickOn == 'book') {
        $scope.form = $scope.booksData
        console.log('kkkkkkkkkkkkkkkk', $scope.form);
        $scope.form.sections = $filter('orderBy')($scope.booksData.sections, 'sequence')
        $scope.bookDetails = $scope.booksData
        $scope.mode = 'book';
        $scope.bookShow = true
        $scope.subjectShow = false
        $scope.topicShow = false
        if ($scope.form.sections.length > 0) {
          $scope.secArr = true
        }
      }

    }
    $scope.save = function() {

      var toSend = new FormData();
      var method = 'POST'
      var url = '/api/LMS/' + $scope.mode + '/'
      console.log('fileeeeeeeeeeeeeee', typeof $scope.form.dp, $scope.form);
      if ($scope.form.title.length == 0) {
        Flash.create('warning', 'Title is required');
        return;
      }
      toSend.append('title', $scope.form.title)
      toSend.append('description', $scope.form.description)


      if ($scope.mode == 'subject') {
        if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string') {
          toSend.append('dp', $scope.form.dp)
        }
        toSend.append('level', $scope.form.level)
      } else if ($scope.mode == 'book') {

        if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string') {
          toSend.append('dp', $scope.form.dp)
        }
        if ($scope.form.author != null && $scope.form.author.length > 0) {
          toSend.append('author', $scope.form.author)
        }

        toSend.append('subject', $scope.form.subject)

        toSend.append('topic', $scope.form.topic)

        if ($scope.form.ISSN != null && $scope.form.ISSN.length > 0) {
          toSend.append('ISSN', $scope.form.ISSN)
        }
        if ($scope.form.volume != null && $scope.form.volume.length > 0) {
          toSend.append('volume', $scope.form.volume)
        }
        if ($scope.form.version != null && $scope.form.version.length > 0) {
          toSend.append('version', $scope.form.version)
        }
        if ($scope.form.license != null && $scope.form.license.length > 0) {
          toSend.append('license', $scope.form.license)
        }
      } else {

        if ($scope.form.syllabus != null && $scope.form.syllabus.length > 0) {
          toSend.append('syllabus', $scope.form.syllabus)
        }
      }

      $http({
        method: method,
        url: url,
        data: toSend,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        if ($scope.mode == 'book') {
          $scope.hideBook = 'yes'
          $scope.bookDetails = response.data
          $scope.bookDetails.sections = $filter('orderBy')($scope.bookDetails.sections, 'sequence')
          console.log('bookkkkkkkkkkkkkkkk', $scope.bookDetails);
          if ($scope.form.pk) {
            Flash.create('success', 'Book Is created');
          } else {
            Flash.create('success', 'Book Is Created');
          }
        } else {
          if ($scope.form.pk) {
            Flash.create('success', 'Created');
          } else {
            $scope.resetForm();
            Flash.create('success', 'Saved');
          }
        }
      })
    }
  }
});
//------------------------------------------------Book ends----------------------------------
