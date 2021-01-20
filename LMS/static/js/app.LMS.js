//------------------------------------------Courses starts-------------------------------------------------
app.config(function($stateProvider) {
  $stateProvider.state('businessManagement.LMS', {
      url: "/LMS",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.LMS.courses.html',
          controller: 'businessManagement.LMS'
        },
      }
    })
    .state('businessManagement.new', {
      url: "/createcourse/:id",
      templateUrl: '/static/ngTemplates/app.LMS.courses.form.html',
      controller: 'businessManagement.LMS.form'
    })
    .state('businessManagement.activityLog', {
      url: "/activityLog/:id",
      views: {
        "": {
          templateUrl: '/static/ngTemplates/app.LMS.courses.explore.html',
          controller: 'businessManagement.activityLog'

        },
        "@businessManagement.activityLog": {
          templateUrl: '/static/ngTemplates/app.LMS.activityLog.students.html',
          controller: 'businessManagement.activityLog'

        },
      }
    }).state('businessManagement.activityLog.students', {
      url: "/activestudents",
      templateUrl: '/static/ngTemplates/app.LMS.activityLog.students.html',
      controller: 'businessManagement.activityLog'
    }).state('businessManagement.activityLog.courses', {
      url: "/courses",
      templateUrl: '/static/ngTemplates/app.LMS.activityLog.courses.html',
      controller: 'businessManagement.activityLog'
    })
    .state('businessManagement.LMS.students', {
      url: "/students",
      templateUrl: '/static/ngTemplates/app.LMS.students.html',
      controller: 'LMS.students'
    })
  $stateProvider.state('businessManagement.LMS.evaluation', {
    url: "/evaluation",
    templateUrl: '/static/ngTemplates/app.LMS.evaluation.html',
    controller: 'businessManagement.LMS.evaluation'
  }).state('businessManagement.viewPaper', {
    url: "/viewtest/:id",
    views: {
      "": {
        templateUrl: '/static/ngTemplates/app.LMS.onlinetestview.html',
        controller: 'businessManagement.LMS.evaluation'
      },

    }
  }).state('businessManagement.viewPaper.questions', {
    url: "/questions",
    templateUrl: '/static/ngTemplates/app.LMS.questions.html',
    controller: 'LMS.questions'
  }).state('businessManagement.viewPaper.submissions', {
    url: "/submissions",
    templateUrl: '/static/ngTemplates/app.LMS.submissions.html',
    controller: 'LMS.submissions'
  })
  $stateProvider.state('businessManagement.LMS.Configureallbooks', {
      url: "/books",
      templateUrl: '/static/ngTemplates/app.LMS.configBook.item.html',
      controller: 'businessManagement.LMS.configureLMS'
    })
    .state('businessManagement.newBook', {
      url: "/createbook/:id",
      templateUrl: '/static/ngTemplates/app.LMS.configure.form.html',
      controller: 'businessManagement.LMS.configureLMS.form'
    })
    .state('businessManagement.viewBook', {
      url: "/viewbook/:bookid",
      templateUrl: '/static/ngTemplates/app.LMS.viewbook.html',
      controller: 'viewbook'
    })
});






app.controller("viewbook", function($scope, $state, $sce, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal, $aside) {



  $http({
    method: 'GET',
    url: '/api/LMS/book/' + $state.params.bookid + '/'
  }).
  then(function(response) {
    $scope.data = response.data
  })
  $scope.getSections = function() {
    $http({
      method: 'GET',
      url: '/api/LMS/section/?parent=null&book=' + $state.params.bookid
    }).
    then(function(response) {
      $scope.chapters = response.data

    })

  }
  $scope.getSections()

  $scope.form = {
    title: '',
    parent: null
  }

  $scope.createChapter = function() {
    $http({
      method: 'POST',
      url: '/api/LMS/section/',
      data: {
        title: $scope.form.title,
        parent: $scope.form.parent,
        book: $state.params.bookid
      }
    }).
    then(function(response) {
      Flash.create('success', 'Chapter Created')
      $scope.form = ''
      $scope.getSections()
    })
  }

  $scope.sectionform = {
    title: '',
    parent: ''
  }

  $scope.createSection = function(pkVal, indx) {
    $http({
      method: 'POST',
      url: '/api/LMS/section/',
      data: {
        title: $scope.sectionform.title,
        parent: pkVal,
        book: $state.params.bookid
      }
    }).
    then(function(response) {
      $scope.sectionform.title = ''
      $scope.chapters[indx].children.push(response.data)
      Flash.create('success', 'Section Created')
      // $scope.getSections()
    })
  }


  $scope.getSection = function(k) {
    $scope.index = k
    $http({
      method: 'GET',
      url: '/api/LMS/section/' + k + '/',
    }).
    then(function(response) {
      $scope.section = response.data


    })
  }



  $scope.getQuestions = function(pkVal) {
    $http({
      method: 'GET',
      url: '/api/LMS/question/?bookSection=' + pkVal,
    }).
    then(function(response) {
      $scope.questions = response.data


    })
  }


  $scope.selectChoice = function(data) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.LMS.questiontypes.html',
      position: 'left',
      size: 'xl',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: 'LMS.questiontypes',
    })
  }


  $scope.addQuestion = function(data, section) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.addquestion.html',
      size: 'xl',
      backdrop: true,
      resolve: {
        stagedata: function() {
          return data
        },
        section: function() {
          return section
        }

      },
      controller: function($scope, $uibModalInstance, stagedata, section) {
        $scope.form = {
          stage: '',
          typ: stagedata,
          section: section
        }
        $scope.close = function() {

          $uibModalInstance.dismiss($scope.form)

        }








      },
    }).result.then(function(data) {
      console.log(data);
    }, function(data) {
      console.log(data);
      if (data != 'backdrop click') {

        $scope.selectChoice(data)
      }

    });
  }


})
app.controller("LMS.submissions", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal) {

  $scope.getSubmissions = function() {
    $http({
      method: 'GET',
      url: '/api/LMS/paper/' + $state.params.id + '/',
    }).
    then(function(response) {
      $scope.data = response.data

    })
  }
  $scope.getSubmissions()


})
app.controller("LMS.questions", function($scope, $state, $sce, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal, $aside) {


  $scope.selectChoice = function(data) {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.LMS.questiontypes.html',
      position: 'left',
      size: 'xl',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: 'LMS.questiontypes',
    })
  }


  $scope.addQuestion = function(data, section) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.addquestion.html',
      size: 'xl',
      backdrop: true,
      resolve: {
        stagedata: function() {
          return data
        },
        section: function() {
          return section
        }

      },
      controller: function($scope, $uibModalInstance, stagedata, section) {
        $scope.form = {
          stage: '',
          typ: stagedata,
          section: section
        }
        $scope.close = function() {

          $uibModalInstance.dismiss($scope.form)

        }








      },
    }).result.then(function(data) {
      console.log(data);
    }, function(data) {
      console.log(data);
      if (data != 'backdrop click') {

        $scope.selectChoice(data)
      }

    });
  }


  $scope.getQuestions = function() {
    $http({
      method: 'GET',
      url: '/api/LMS/question/?paper=' + $state.params.id,
    }).
    then(function(response) {
      $scope.data = response.data

    })
  }
  $scope.getQuestions()

})

app.controller("LMS.questiontypes", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal, data, $uibModalInstance) {
  $scope.form = data.stage





  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    statusbar: false,
    height: 400,
    menubar: false,
    toolbar: 'undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent | bold italic underline link | style-p style-h1 style-h2 style-h3 | addImage',
    setup: function(editor) {

      ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name) {
        editor.addButton("style-" + name, {
          tooltip: "Toggle " + name,
          text: name.toUpperCase(),
          onClick: function() {
            editor.execCommand('mceToggleFormat', false, name);
          },
          onPostRender: function() {
            var self = this,
              setup = function() {
                editor.formatter.formatChanged(name, function(state) {
                  self.active(state);
                });
              };
            editor.formatter ? setup() : editor.on('init', setup);
          }
        })
      });

      editor.addButton('addImage', {
        text: 'Add Image',
        icon: false,
        onclick: function(evt) {
          console.log(editor);
          $uibModal.open({
            templateUrl: '/static/ngTemplates/app.blog.modal.html',
            size: 'sm',
            backdrop: true,
            controller: function($scope, $http, $uibModalInstance) {
              $scope.form = {
                file: emptyFile,
                alt: ''
              }

              $scope.add = function() {
                var fd = new FormData();
                fd.append('file', $scope.form.file);
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
                  console.log(response.data);

                  $uibModalInstance.dismiss({
                    file: response.data.link,
                    alt: $scope.form.alt,
                    height: response.data.height,
                    width: response.data.width
                  })
                })
              }
            },
          }).result.then(function() {

          }, function(d) {
            editor.editorCommands.execCommand('mceInsertContent', false, '<img alt="' + d.alt + '" height="' + d.height + '" width="' + d.width + '" src="' + d.file + '"/>')

          });



        }
      })
    },
  };

  $scope.cpForm = {
    firstMessage: '',
    isLatex: false
  }

  $scope.data = [{
    rtxt: '',
    answer: false
  }]


  $scope.addOption = function() {
    $scope.data.push({
      rtxt: '',
      answer: false
    })
  }

  $scope.delOption = function(indx) {
    if (indx > 0) {
      $scope.data.splice(indx, 1)

    }
  }


  if (data.stage == 'multiple') {
    $scope.resetform = function() {
      $scope.queform = {
        ques: '',
        marks: 0,
        paper: $state.params.id,
        qtype: 'mcc',
        bookSection: '',
        isLatex: false
      }

    }
    $scope.resetform()
  } else if (data.stage == 'subjective') {
    $scope.resetform = function() {
      $scope.queform = {
        ques: '',
        marks: 0,
        paper: $state.params.id,
        qtype: 'mcq',
        bookSection: '',
        isLatex: false
      }

    }
    $scope.resetform()

  } else if (data.stage == 'file') {
    $scope.resetform = function() {
      $scope.queform = {
        ques: '',
        marks: 0,
        paper: $state.params.id,
        qtype: 'upload',
        bookSection: '',
        isLatex: false
      }

    }
    $scope.resetform()

  }




  $scope.sectionSearch = function(query) {
    return $http.get('/api/LMS/section/?title__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.$watch('queform.bookSection', function(query) {
    return $http.get('/api/LMS/section/?title__contains=' + query.name).
    then(function(response) {
      return response.data.pk;
    })

  })


  $scope.save = function() {
    if ($scope.queform.ques.length == 0 || $scope.queform.marks.length == 0) {
      Flash.create('warning', 'Fill the Form')
      return
    }
    var formdata = {
      ques: $scope.queform.ques,
      marks: $scope.queform.marks,
      paper: $state.params.id,
      qtype: $scope.queform.qtype,
      isLatex: $scope.queform.isLatex
    }
    if (data.typ == 'section') {

      formdata.bookSection = data.section
    }

    var method = "POST"
    var url = '/api/LMS/question/'
    if ($scope.queform.pk != undefined) {
      method = "PATCH"
      url = '/api/LMS/question/' + $scope.queform.pk + '/'
    }
    $http({
      method: method,
      url: url,
      data: formdata
    }).
    then(function(response) {
      $scope.queform.pk = response.data.pk
      if (data.stage != 'upload' || data.stage != 'subjective') {
        if ($scope.data.length > 0) {
          for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].rtxt != undefined || $scope.data[i].rtxt != '') {
              var data = {
                rtxt: $scope.data[i].rtxt,
                answer: $scope.data[i].answer,
                parent: response.data.pk
              }


              $http({
                method: 'POST',
                url: '/api/LMS/optionspart/',
                data: data
              }).
              then(function(response) {
                $uibModalInstance.dismiss();

              })

            }
          }

        }

      }

    
      $uibModalInstance.dismiss();
      Flash.create('success', 'Question Created')
    })
  }

  $scope.close = function() {


  }
  // $scope.uploadcsvFile = function(data) {
  //   $uibModal.open({
  //     templateUrl: '/static/ngTemplates/app.LMS.uploadcsv.html',
  //     size: 'sm',
  //     backdrop: true,
  //     resolve: {
  //       data: function() {
  //         return data
  //       }
  //     },
  //     controller: function($scope, $uibModalInstance, data) {
  //
  //
  //     }
  //   }).result.then(function() {
  //
  //   }, function() {});
  // }


})
app.controller("LMS.students", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal) {

  $scope.form = {
    search: ''
  }
  $scope.limit = 12
  $scope.offset = 0

  $scope.fetchContacts = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contact/?typ=student&limit=' + $scope.limit + '&offset=' + $scope.offset + '&search=' + $scope.form.search,
    }).
    then(function(response) {
      $scope.data = response.data.results
      $scope.prev = response.data.previous
      $scope.next = response.data.next

    })
  }
  $scope.fetchContacts()

  $scope.previous = function() {
    if ($scope.prev != null) {
      $scope.offset -= $scope.limit
      $scope.fetchContacts()
    }
  }
  $scope.Next = function() {
    if ($scope.next != null) {
      $scope.offset += $scope.limit
      $scope.fetchContacts()
    }
  }


  $scope.addStudent = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.students.addstudent.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: function($scope, $uibModalInstance, data) {
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }

        $scope.form = {
          name: '',
          mobile: '',
          email: '',
          typ: 'student'
        }
        if (data == undefined || data == '') {
          var method = 'POST'
          var url = '/api/clientRelationships/contact/'
        } else {
          $scope.form.pk = data.pk
          $scope.form.name = data.name
          $scope.form.mobile = data.mobile
          $scope.form.email = data.email
          method = "PATCH"
          url = '/api/clientRelationships/contact/' + $scope.form.pk + '/'
        }

        $scope.save = function() {
          if ($scope.form.name.length == 0 || $scope.form.mobile.length == 0 || $scope.form.email.length == 0) {
            Flash.create('warning', 'Fill the fields')
            return
          }
          $http({
            method: method,
            url: url,
            data: $scope.form
          }).
          then(function(response) {
            Flash.create('success', 'Created')
            $uibModalInstance.dismiss()
          })
        }



      },
    }).result.then(function() {}, function() {
      $scope.fetchContacts()

    });
  }

})
app.controller("businessManagement.LMS", function($scope, $state, $users, $stateParams, $http, Flash, $timeout, $stateParams, $uibModal) {


  $scope.getState = {
    state: 'current'
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
    let url = '/api/LMS/course/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&state=' + $scope.getState.state
    if ($scope.search.query.length > 0) {
      url = url + '&search=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allcourseData = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.fetchData()


  $scope.delCourse = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/LMS/course/' + $scope.allcourseData[indx].pk + '/'
    }).
    then(function(response) {
      $scope.allcourseData.splice(indx, 1)
      Flash.create('success', 'Deleted...')
    })
  }

  $scope.limit = 15
  $scope.offset = 0
  $scope.fetchpapersData = function() {
    let url = '/api/LMS/paper/?limit=' + $scope.limit + '&offset=' + $scope.offset

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data.results
    })
  }
  $scope.fetchpapersData()

  $scope.createTest = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.evaluation.form.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: function($scope, $http, $uibModalInstance, data) {
        $scope.data = data
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }
        $scope.selectTime = {
          duration: 30
        }
        if ($scope.data == undefined) {
          var method = "POST"
          var url = '/api/LMS/paper/'
          $scope.form = {
            name: '',
            description: '',
            timelimit: $scope.selectTime.duration,
            active: true
          }
        } else {
          $scope.form = $scope.data
          $scope.selectTime.duration = $scope.data.timelimit
          console.log($scope.data, $scope.form, '');
          $scope.form.timelimit = $scope.data.timelimit
          $scope.form.active = $scope.data.active
          method = "PATCH"
          url = '/api/LMS/paper/' + $scope.data.pk + '/'

        }

        $scope.saveTest = function() {
          console.log($scope.form, $scope.selectTime.duration, '4343424343');
          if ($scope.form.name.length == 0) {
            Flash.create('warning', 'Fill the fields')
            return
          }
          var data = {
            name: $scope.form.name,
            description: $scope.form.description,
            timelimit: $scope.selectTime.duration,
            active: $scope.form.active
          }
          $http({
            method: method,
            url: url,
            data: data
          }).
          then(function(response) {
            Flash.create('success', 'Paper Created')
            $uibModalInstance.dismiss()
          })
        }



      },
    }).result.then(function() {
      $state.go('businessManagement.LMS.evaluation')
    }, function() {});
  }
});

app.controller("businessManagement.activityLog", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal, $aside, $rootScope) {

  $http({
    method: 'GET',
    url: '/api/LMS/course/' + $stateParams.id + '/'
  }).
  then(function(response) {
    $scope.course = response.data
  })

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

        $scope.form = {
          paper: '',
          typ: 'homework',
          txt: '',
          paperDueDate: new Date()
        }

        $scope.paperSearch = function(query) {
          return $http.get('/api/LMS/paper/?name=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.$watch('form.paper', function(query) {
          return $http.get('/api/LMS/paper/?name=' + query.name).
          then(function(response) {
            return response.data;
          })

        })


        $scope.saveHomework = function() {
          console.log($scope.form, '32323232');
          var data = {
            paper: $scope.form.paper.pk,
            txt: $scope.form.txt,
            typ: $scope.form.typ,
            course: $state.params.id
          }
          if ($scope.form.paperDueDate != null && typeof $scope.form.paperDueDate == 'object') {
            data.paperDueDate = $scope.form.paperDueDate.toISOString().split('T')[0]
          }
          $http({
            method: 'POST',
            url: '/api/LMS/courseactivity/',
            data: data,

          }).
          then(function(response) {
            Flash.create('success', 'Saved Successfully');
            $uibModalInstance.dismiss(response.data);
          })
        }

      }, //controller ends
    }).result.then(function(h) {

    }, function(h) {

    })
  }
  //homework ends------------

  //quiz starts...........................----------------------------------------------------------------
  $scope.createQuiz = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.addquiz.html',
      size: 'md',
      backdrop: true,

      controller: function($scope, $http, $uibModalInstance) {
        $scope.form = {
          paper: '',
          txt: '',
          time: 0,
          course: $state.params.id,
          typ: 'quiz'
        }

        $scope.paperSearch = function(query) {
          return $http.get('/api/LMS/paper/?name=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.$watch('form.paper', function(query) {
          return $http.get('/api/LMS/paper/?name=' + query.name).
          then(function(response) {
            return response.data;
          })

        })


        $scope.saveQuiz = function() {
          console.log($scope.form, '32323232');
          var data = {
            paper: $scope.form.paper.pk,
            time: $scope.form.paper.timelimit,
            txt: $scope.form.txt,
            typ: $scope.form.typ,
            course: $state.params.id
          }
          console.log(data, '4334');
          $http({
            method: 'POST',
            url: '/api/LMS/courseactivity/',
            data: data,

          }).
          then(function(response) {
            Flash.create('success', 'Saved Successfully');
            $uibModalInstance.dismiss(response.data);
          })
        }





      }, //controller ends
    }).result.then(function() {

    }, function() {

    })
  } //quiz ends...........................


  $scope.getActivities = function() {
    $http({
      method: 'GET',
      url: '/api/LMS/courseactivity/?course=' + $state.params.id
    }).
    then(function(response) {
      $scope.activitydata = response.data
    })
  }
  $scope.getActivities()


  $scope.getContacts = function() {
    $http({
      method: 'GET',
      url: '/api/clientRelationships/contact/?typ=student'
    }).
    then(function(response) {
      $scope.data = response.data
    })
  }
  $scope.getContacts()

  $scope.createStudent = function() {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.activityLog.createstudent.html',
      size: 'md',
      backdrop: true,
      resolve: {

      },
      controller: function($scope, $uibModalInstance) {
        $scope.form = {
          contact: '',
          contacts: [],
          contactsList: [],
          name: '',
          email: '',
          mobile: ''
        }
        $scope.addContacts = function() {
          for (var i = 0; i < $scope.form.contactsList.length; i++) {
            if ($scope.form.contactsList[i].pk == $scope.form.contact.pk) {
              Flash.create('danger', 'Already Added ');
              $scope.form.contact = ''
              return;
            }
          }
          if ($scope.form.contact.pk != undefined) {
            $scope.form.contacts.push($scope.form.contact.pk)
            $scope.form.contactsList.push($scope.form.contact)
            $scope.form.contact = ''

          }
        }
        $scope.$watch('form.contact', function(query) {
          console.log(query, 'ewe');
          if (query.length != 8) {
            return $http.get('/api/clientRelationships/contact/?mobile__contains=' + query).
            then(function(response) {
              $scope.form.name = query.name
              $scope.form.mobile = query.mobile
              $scope.form.email = query.email
              $scope.form.pk = query.pk
              return response.data;
            })

          }

        })

        $scope.getContactsearch = function(query) {
          console.log(query);
          return $http.get('/api/clientRelationships/contact/?mobile__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };

        $scope.save = function() {
          if ($scope.form.pk == undefined) {
            var method = "POST"
            var url = "/api/clientRelationships/contact/"
            var data = {
              mobile: $scope.form.contact,
              name: $scope.form.name,
              email: $scope.form.email,
              typ: 'student'
            }
          } else {
            var method = "PATCH"
            var url = "/api/clientRelationships/contact/" + $scope.form.pk + '/'
            var data = {
              mobile: $scope.form.contact.mobile,
              name: $scope.form.contact.name,
              email: $scope.form.contact.email,
              typ: $scope.form.contact.typ
            }

          }
          if ($scope.form.contact.length < 8) {
            Flash.create('warning', 'mobile proper mobile number')
            return
          }

          $http({
            method: method,
            url: url,
            data: data
          }).
          then(function(response) {
            Flash.create('success', 'Added')
            $uibModalInstance.dismiss()
            $scope.form.contacts.push(response.data.pk)
            $http({
              method: 'PATCH',
              url: '/api/LMS/course/' + $state.params.id + '/',
              data: {
                contacts: $scope.form.contacts
              }
            }).
            then(function(response) {
              Flash.create('success', 'Added')
              $uibModalInstance.dismiss()

            })

          })
        }



      }, //controller ends
    }).result.then(function() {

    }, function() {
      $scope.getActivities()
    })
  }



  $scope.form = {
    dp: emptyFile,
    typ: '',
    txt: ''
  }
  $scope.openFile = function() {
    $('#file').click();
  }

  $scope.$watch('form.dp', function(newValue, oldValue) {
    console.log(newValue);
    if (newValue != undefined && newValue != emptyFile && newValue.size > 0) {
      if (newValue.type == 'application/pdf' || newValue.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        $scope.form.typ = 'file'
      }
      if (newValue.type.split('/')[0] == 'video') {
        $scope.form.typ = 'video'

      }

      $scope.openFileUploader($scope.form);
    }
  })


  $scope.openFileUploader = function(data) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.createCourseactivity.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }
      },
      controller: function($scope, data, $uibModalInstance) {
        console.log(data);
        $scope.form = {
          title: '',
          description: '',
          attachment: data.dp,
          typ: data.typ,
          txt: data.txt
        }
        $scope.close = function() {
          $uibModalInstance.dismiss()
        }

        $scope.save = function() {
          var fd = new FormData()
          fd.append('title', $scope.form.title)
          fd.append('description', $scope.form.description)
          fd.append('typ', $scope.form.typ)
          fd.append('txt', $scope.form.txt)
          fd.append('attachment', $scope.form.attachment)
          fd.append('course', $state.params.id)

          $http({
            method: 'POST',
            url: '/api/LMS/courseactivity/',
            data: fd,
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).
          then(function(response) {
            Flash.create('success', 'Saved Successfully');
            $scope.form = ''
          })

        }


      }, //controller ends
    }).result.then(function() {}, function() {
      $scope.getActivities()
    })
  }









})



app.controller("businessManagement.LMS.form", function($scope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  $scope.resetForm = function() {
    $scope.form = {
      enrollmentStatus: 'open',
      description: '',
      dp: emptyFile,
      // TAs: [],
      instructor: '',
      title: '',
      sellingPrice: '',
      discount: '',
      activeCourse: true,
      topic: ''
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

  // $scope.getInstructor = function(user) {
  //   if (typeof user == 'undefined') {
  //     return;
  //   }
  //   return user.first_name + '  ' + user.last_name;
  // }


  $http({
    method: 'GET',
    url: '/api/LMS/course/' + $stateParams.id + '/'
  }).
  then(function(response) {
    $scope.form = response.data

  })


  $scope.saveCourse = function() {
    if ($scope.form.title.length == 0 || $scope.form.instructor.length == 0) {
      Flash.create('warning', 'Fill all the fields')
    }

    var method = 'POST'
    var url = '/api/LMS/course/'
    if ($scope.form.pk != undefined) {
      method = "PATCH"
      url = "/api/LMS/course/" + $state.params.id + '/'
    }

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
    fd.append('activeCourse', $scope.form.activeCourse);
    fd.append('topic', $scope.form.topic);

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
      Flash.create('success', 'Created Course successfully')
      if ($scope.form.pk == undefined) {
        $scope.resetForm();

      }
    })

  }



});



//-----------------------------------------------online tet starts--------------------------------------------
app.controller('businessManagement.LMS.evaluation', function($scope, $http, $aside, $state, Flash, $users, $filter, $uibModal, $stateParams) {


  if ($state.is('businessManagement.viewPaper')) {
    $state.go('businessManagement.viewPaper.questions')

  }

  $http({
    method: 'GET',
    url: '/api/LMS/paper/' + $state.params.id + '/',
  }).
  then(function(response) {
    $scope.paper = response.data

  })

  $scope.getState = {
    state: 'current'
  }


  $scope.limit = 15
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
    let url = '/api/LMS/paper/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&state=' + $scope.getState.state
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


  $scope.delTest = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/LMS/paper/' + $scope.allData[indx].pk + '/'
    }).
    then(function(response) {
      $scope.allData.splice(indx, 1)
      Flash.create('success', 'Deleted.....!!!')
    })
  }

  $scope.createStudent = function(data) {
    console.log(data);
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.LMS.activityLog.createstudent.html',
      size: 'md',
      backdrop: true,
      resolve: {
        data: function() {
          return data
        }

      },
      controller: function($scope, $uibModalInstance, data) {
        $scope.form = {
          contact: '',
          contacts: [],
          contactsList: [],
          name: '',
          mobile: '',
          email: ''
        }
        $scope.addContacts = function() {
          for (var i = 0; i < $scope.form.contactsList.length; i++) {
            if ($scope.form.contactsList[i].pk == $scope.form.contact.pk) {
              Flash.create('danger', 'Already Added ');
              $scope.form.contact = ''
              return;
            }
          }
          if ($scope.form.contact.pk != undefined) {
            $scope.form.contacts.push($scope.form.contact.pk)
            $scope.form.contactsList.push($scope.form.contact)
            $scope.form.contact = ''

          }
        }
        $scope.getContactsearch = function(query) {
          console.log(query);
          //search for the user
          return $http.get('/api/clientRelationships/contact/?typ=student&mobile__contains=' + query).
          then(function(response) {
            return response.data;
          })
        };
        $scope.$watch('form.contact', function(query) {
          console.log(query, 'ewe');
          if (query.length != 8) {
            return $http.get('/api/clientRelationships/contact/?mobile__contains=' + query).
            then(function(response) {
              $scope.form.name = query.name
              $scope.form.mobile = query.mobile
              $scope.form.email = query.email
              $scope.form.pk = query.pk
              return response.data;
            })

          }

        })

        $scope.save = function() {
          if ($scope.form.pk == undefined) {
            var method = "POST"
            var url = "/api/clientRelationships/contact/"
            var data = {
              mobile: $scope.form.contact,
              name: $scope.form.name,
              email: $scope.form.email,
              typ: 'student'
            }
          } else {
            var method = "PATCH"
            var url = "/api/clientRelationships/contact/" + $scope.form.pk + '/'
            var data = {
              mobile: $scope.form.contact.mobile,
              name: $scope.form.contact.name,
              email: $scope.form.contact.email,
              typ: $scope.form.contact.typ
            }

          }
          $http({
            method: method,
            url: url,
            data: data
          }).
          then(function(response) {
            $scope.form.contacts.push(response.data.pk)
            $http({
              method: 'PATCH',
              url: '/api/LMS/paper/' + $state.params.id + '/',
              data: {
                contacts: $scope.form.contacts
              }
            }).
            then(function(response) {


            })
            Flash.create('success', 'Added')
            $uibModalInstance.dismiss()

          })
        }



      }, //controller ends
    }).result.then(function() {

    }, function() {})
  }

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


app.controller("businessManagement.LMS.configureLMS", function($scope, $state, $users, $stateParams, $http, Flash) {

  $scope.limit = 11
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
      url = url + '&search=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.data = response.data.results
      $scope.count = response.data.count
    })
  }
  $scope.fetchData()

  $scope.delBook = function(indx) {
    $http({
      method: 'DELETE',
      url: '/api/LMS/book/' + $scope.data[indx].pk + '/'
    }).
    then(function(response) {
      $scope.data.splice(indx, 1)
      Flash.create('success', 'Deleted')
    })
  }





});

app.controller("businessManagement.LMS.configureLMS.form", function($scope, $state, $users, $stateParams, $filter, $uibModal, $http, Flash) {

  $scope.form = {
    title: '',
    description: '',
    seoTitle: '',
    syllabus: '',
    dp: emptyFile,
    author: '',
    subject: '',
    // topic: '',
    shortUrl: ''
  }

  $scope.$watch('form.title', function(newValue, oldValue) {
    if (newValue) {

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
      $scope.form.shortUrl = url.replace(/-/g, ' ').trim().replace(/\s/g, '-');
    }

  })




  $http({
    method: 'GET',
    url: '/api/LMS/book/' + $state.params.id + '/'
  }).then(function(res) {
    $scope.form = res.data
  })

  $scope.save = function() {

    var toSend = new FormData();
    var method = 'POST'
    var url = '/api/LMS/book/'
    if ($state.params.id != undefined) {
      method = 'PATCH'
      url += $state.params.id + '/'
    }
    console.log('fileeeeeeeeeeeeeee', typeof $scope.form.dp, $scope.form);
    if ($scope.form.title.length == 0) {
      Flash.create('warning', 'Title is required');
      return;
    }
    toSend.append('title', $scope.form.title)
    toSend.append('description', $scope.form.description)
    toSend.append('dp', $scope.form.dp)
    if ($scope.form.dp != emptyFile && typeof $scope.form.dp != 'string') {}
    if ($scope.form.author != null && $scope.form.author.length > 0) {
      toSend.append('author', $scope.form.author)
    }

    toSend.append('subject', $scope.form.subject)

    // toSend.append('topic', $scope.form.topic)
    toSend.append('shortUrl', $scope.form.shortUrl)




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



});
