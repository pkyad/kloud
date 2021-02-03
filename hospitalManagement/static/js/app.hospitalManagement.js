app.config(function($stateProvider) {

  $stateProvider
    .state('businessManagement.hospitalManagement', {
      url: "/hospitalManagement",
      templateUrl: '/static/ngTemplates/app.patientsMain.html',
      controller: 'businessManagement.hospitalManagement',
    })
    .state('businessManagement.hospitalManagement.newpatient', {
      url: "/new",
      templateUrl: '/static/ngTemplates/app.patients.form.newPatient.html',
      controller: 'businessManagement.hospitalManagement.form',
    })
    .state('businessManagement.hospitalManagement.explorepatient', {
      url: "/explore/:id",
      templateUrl: '/static/ngTemplates/app.patients.details.html',
      controller: 'businessManagement.patient.explore',
    })
    .state('businessManagement.hospitalManagement.inPatients', {
      url: "/inPatients",
      templateUrl: '/static/ngTemplates/app.activePatients.html',
      controller: 'businessManagement.activePatients',
    })

    .state('businessManagement.hospitalManagement.newinPatients', {
      url: "/inPatients/new",
      templateUrl: '/static/ngTemplates/app.activePatients.form.newActivePatient.html',
      controller: 'businessManagement.activePatients.form'
    })
    .state('businessManagement.hospitalManagement.editinPatients', {
      url: "/inPatients/:id",
      templateUrl: '/static/ngTemplates/app.activePatients.form.newActivePatient.html',
      controller: 'businessManagement.activePatients.form'
    })
    .state('businessManagement.hospitalManagement.exploreinPatients', {
      url: "/inPatients-details/:id",
      templateUrl: '/static/ngTemplates/app.activePatients.explore.html',
      controller: 'businessManagement.activePatient.explore'
    })
    .state('businessManagement.hospitalManagement.outPatients', {
      url: "/outPatients",
      templateUrl: '/static/ngTemplates/app.outPatient.html',
      controller: 'businessManagement.outPatient',
    })
    .state('businessManagement.hospitalManagement.newoutpatient', {
      url: "/outPatients/new",
      templateUrl: '/static/ngTemplates/app.outPatients.form.newOutPatient.html',
      controller: 'businessManagement.outPatient.form',
    })
    .state('businessManagement.hospitalManagement.editoutpatient', {
      url: "/outPatients/:id",
      templateUrl: '/static/ngTemplates/app.outPatients.form.newOutPatient.html',
      controller: 'businessManagement.outPatient.form',
    })
    .state('businessManagement.hospitalManagement.exploreoutpatient', {
      url: "/outPatients-details/:id",
      templateUrl: '/static/ngTemplates/app.outPatient.explore.html',
      controller: 'businessManagement.outPatient.explore',
    })
    .state('businessManagement.hospitalManagement.servicesOffered', {
      url: "/servicesOffered",
      templateUrl: '/static/ngTemplates/app.configure.servicesOffered.html',
      controller: 'businessManagement.hospitalManagement.servicesOffered'
    })
    .state('businessManagement.hospitalManagement.newproduct', {
      url: "/servicesOffered/new",
      templateUrl: '/static/ngTemplates/app.configure.services.form.html',
      controller: 'businessManagement.services.form',
    })
    .state('businessManagement.hospitalManagement.editservicesOffered', {
      url: "/servicesOffered/:id",
      templateUrl: '/static/ngTemplates/app.configure.services.form.html',
      controller: 'businessManagement.services.form'
    })
    .state('businessManagement.hospitalManagement.doctors', {
      url: "/doctors",
      templateUrl: '/static/ngTemplates/app.configure.doctors.html',
      controller: 'businessManagement.hospitalManagement.doctors'
    })
    .state('businessManagement.hospitalManagement.createDoctors', {
      url: "/doctors/new",
      templateUrl: '/static/ngTemplates/app.configure.doctor.form.html',
      controller: 'businessManagement.hospitalManagement.doctors.form'
    })
    .state('businessManagement.hospitalManagement.editDoctors', {
      url: "/doctors/:id",
      templateUrl: '/static/ngTemplates/app.configure.doctor.form.html',
      controller: 'businessManagement.hospitalManagement.doctors.form'
    })
    .state('businessManagement.hospitalManagement.reports11', {
      url: "/Hospreports",
      templateUrl: '/static/ngTemplates/app.reports11.html',
      controller: 'businessManagement.hospitalManagement.reports11',
    })
    .state('businessManagement.hospitalManagement.editpatient', {
      url: "/:id",
      templateUrl: '/static/ngTemplates/app.patients.form.newPatient.html',
      controller: 'businessManagement.hospitalManagement.form',
    })
});

app.controller("businessManagement.hospitalManagement", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  // $scope.limit = 8
  // $scope.offset = 0
  // $scope.count = 0
  //
  // $scope.privious = function() {
  //   if ($scope.offset > 0) {
  //     $scope.offset -= $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  //
  // $scope.next = function() {
  //   if ($scope.offset < $scope.count) {
  //     $scope.offset += $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    // let url = '/api/hospitalManagement/patient/?limit=' + $scope.limit + '&offset=' + $scope.offset
    let url = '/api/hospitalManagement/patient/'
    if ($scope.search.query.length > 0) {
      url = url + '?name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      // $scope.count = response.data.count
    })
  }
  $scope.fetchData()


  $scope.getData = function(){
    $http({
      method: 'GET',
      url:  '/api/hospitalManagement/hospMigration/'
    }).
    then(function(response) {
      console.log(response);

    })
  }

});

app.controller("businessManagement.patient.explore", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  console.log($stateParams.id);
  $http({
    method: 'GET',
    url: '/api/hospitalManagement/patient/' + $stateParams.id + '/'
  }).
  then(function(response) {
    // Flash.create("", "immmmmmmm")
    $scope.patient = response.data
  })


  $scope.visits = [];
  $http({
    method: 'GET',
    url: '/api/hospitalManagement/activePatientLite/?patient=' + $stateParams.id
  }).
  then(function(response) {
    console.log(response.data);
    $scope.visits = response.data;
    for (var i = 0; i < $scope.visits.length; i++) {
      $scope.visits[i].expanded = false;
    }
  })

  $scope.toggleExpand = function(idx) {
    $scope.visits[idx].expanded = !$scope.visits[idx].expanded
  }

  $scope.openInvoice = function(pk) {
    window.open('/api/hospitalManagement/downloadInvoice/?invoicePk=' + pk, '_blank');
  }

});

app.controller("businessManagement.hospitalManagement.form", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  $scope.formRefresh = function() {
    $scope.newPatient = {
      firstName: '',
      gender: '',
      phoneNo: '',
      age: '',
      street: '',
      city: '',
      pin: '',
      state: '',
      country: ''
    };
  }
  $scope.formRefresh();

  console.log($scope.newPatient.pin);

  $scope.$watch('newPatient.pin', function(newValue, oldValue) {
    if (newValue.toString().length == 6) {
      $http({
        method: 'GET',
        url: '/api/ERP/genericPincode/?pincode=' + $scope.newPatient.pin
      }).
      then(function(response) {
        console.log(response);
        if (response.data.length > 0) {
          $scope.newPatient.city = response.data[0].city;
          $scope.newPatient.state = response.data[0].state;
          $scope.newPatient.country = response.data[0].country;
        }
      })
    } else {
      $scope.newPatient.city = ''
      $scope.newPatient.state = ''
      $scope.newPatient.country = ''
    }
  })


  if ($state.is('businessManagement.hospitalManagement.editpatient')) {

    $http({
      method: 'GET',
      url: '/api/hospitalManagement/patient/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.newPatient = response.data
      console.log($scope.newPatient);
    })

    $scope.editPatient = function() {
      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/patient/' + $stateParams.id + '/',
        data: $scope.newPatient,
      }).
      then(function(response) {
        Flash.create('success', 'Updated');
        console.log('dataaaa', response.data);
        $scope.fetchData()

      })
    }
  }
  $scope.createPatient = function() {

    if ($scope.newPatient.firstName == '') {
      Flash.create('warning', 'Please fill Name');
      return
    }
    if ($scope.newPatient.age == '') {
      Flash.create('warning', 'Please fill Age');
      return
    }

    if ($scope.newPatient.phoneNo == '') {
      Flash.create('warning', 'Please enter mobile no');
      return
    }

    if ($scope.newPatient.pin == '') {
      // delete $scope.newPatient.pin
      Flash.create('warning', 'Please enter pincode');
      return
    }


    $http({
      method: 'POST',
      url: '/api/hospitalManagement/patient/',
      data: $scope.newPatient
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);
      $scope.formRefresh()
      $scope.fetchData()
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });


  }

});
app.controller('businessManagement.activePatient.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal, $stateParams) {


  $scope.tinymceOptions = {
    selector: 'textarea',
    content_css: '/static/css/bootstrap.min.css',
    inline: false,
    plugins: 'advlist autolink link image lists charmap preview imagetools paste table insertdatetime code searchreplace ',
    skin: 'lightgray',
    theme: 'modern',
    height: 250,
    menubar : false,
    statusbar : false,
    // skin: "oxide-dark",
    toolbar: ' undo redo | bullist numlist | alignleft aligncenter alignright alignjustify | outdent  indent blockquote | bold italic underline | image link | style-p style-h1 style-h2 style-h3 | addImage',
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
            editor.editorCommands.execCommand('mceInsertContent', false, '<br><img alt="' + d.alt + '" height="' + d.height + '" width="' + d.width + '" src="' + d.file + '"/>')

          });



        }
      })

      editor.addButton('publishBtn', {
        text: 'Publish',
        icon: false,
        onclick: function() {
          var tags = [];
          for (var i = 0; i < $scope.editor.tags.length; i++) {
            tags.push($scope.editor.tags[i].pk)
          }

          console.log($scope.editor);

          var fd = new FormData();

          fd.append('source', $scope.editor.source);
          fd.append('header', $scope.editor.header);
          fd.append('title', $scope.editor.title);
          fd.append('users', [$scope.me.pk]);
          fd.append('sourceFormat', 'html');
          fd.append('state', 'published');
          fd.append('tags', tags);

          if ($scope.editor.ogimage == emptyFile && ($scope.editor.ogimageUrl == '' || $scope.editor.ogimageUrl == undefined)) {
            Flash.create('danger', 'Either the OG image file OR og image url is required')
            return;
          }

          if ($scope.editor.ogimage != emptyFile && typeof $scope.editor.ogimage != 'string' && $scope.editor.ogimage != null) {
            fd.append('ogimage', $scope.editor.ogimage);

          } else {
            fd.append('ogimageUrl', $scope.editor.ogimageUrl);
          }

          // 'shortUrl', 'description', 'tags','section' , 'author'
          if ($scope.editor.shortUrl == '' || $scope.editor.tagsCSV == '' || $scope.editor.section == '' || $scope.editor.author == '') {
            Flash.create('danger', 'Please check the SEO related fields');
            return;
          }

          fd.append('shortUrl', $scope.editor.shortUrl);
          fd.append('tagsCSV', $scope.editor.tagsCSV);
          fd.append('section', $scope.editor.section);
          fd.append('author', $scope.editor.author);
          fd.append('description', $scope.editor.description);

          if ($scope.mode == 'edit') {
            method = 'PATCH';
            url = '/api/PIM/blog/' + $stateParams.id + '/';
          } else if ($scope.mode == 'new') {
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
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.editor.source = '';
            $scope.editor.header = '';
            $scope.editor.title = '';
            $scope.editor.tags = [];
            $scope.editor.mode = 'hedaer';
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });
        }
      });
      editor.addButton('saveBtn', {
        text: 'Save',
        icon: false,
        onclick: function() {
          tags = '';
          for (var i = 0; i < $scope.editor.tags.length; i++) {
            tags += $scope.editor.tags[i].title;
            if (i != $scope.editor.tags.length - 1) {
              tags += ',';
            }
          }
          var dataToSend = {
            source: $scope.editor.source,
            header: $scope.editor.header,
            title: $scope.editor.title,
            users: [$scope.me.pk],
            sourceFormat: 'html',
            state: 'saved',
            tags: tags,
          };

          if ($scope.mode == 'edit') {
            method = 'PATCH';
            url = $scope.editor.url;
          } else if ($scope.mode == 'new') {
            method = 'POST';
            url = '/api/PIM/blog/';
          }

          $http({
            method: method,
            url: url,
            data: dataToSend
          }).
          then(function(response) {
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.editor.source = '';
            $scope.editor.header = '';
            $scope.editor.title = '';
            $scope.editor.tags = [];
            $scope.editor.mode = 'hedaer';
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });
        }
      });
      editor.addButton('cancelBtn', {
        text: 'Cancel',
        icon: false,
        onclick: function() {
          if ($scope.mode == 'edit') {
            $state.go('home.blog', {
              action: 'list'
            })
          } else {
            $state.go('home.blog', {
              id: '',
              action: 'list'
            })
          }

        }
      });
    },
  };

  $http({

    method: 'GET',
    url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/',
  }).
  then(function(response) {
    $scope.data = response.data
  })

  $scope.$watch('data.msg', function(newValue, oldValue) {

    if (newValue != null) {

      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/',
        data: {
          msg: $scope.data.msg
        }
      }).
      then(function(response) {});

    }
  })

  $scope.invoices = [];
  $scope.doctorSearch = function(query) {
    return $http.get('/api/hospitalManagement/doctor/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.fetchInvoices = function() {
    $http({
      method: 'GET',
      url: '/api/hospitalManagement/invoice/?activePatient=' + $stateParams.id
    }).
    then(function(response) {
      console.log('invoicesss', response.data);
      $scope.invoices = response.data
    })
    $http({
      method: 'GET',
      url: '/api/hospitalManagement/dischargeSummary/?patient=' + $stateParams.id
    }).
    then(function(response) {
      $scope.dis = response.data
      if ($scope.dis.length > 0) {
        console.log('thteeeeeeeeeee');
        $scope.dischargeSummForm = $scope.dis[0]
        $scope.dischargeSummForm.primaryDoctor = $scope.data.docName
        $scope.dischargeSummForm.docList = $scope.dischargeSummForm.treatingConsultant
        $scope.dischargeSummForm.docListPk = []
        for (var i = 0; i < $scope.dischargeSummForm.docList.length; i++) {
          $scope.dischargeSummForm.docListPk.push($scope.dischargeSummForm.docList[i].pk)
        }
        $scope.dischargeSummForm.treatingConsultant = ''
      } else {
        console.log('newwwwwwwwwwwwwwww');
        $scope.refresh();
        $scope.dischargeSummForm.patient = $scope.data
        console.log($scope.dischargeSummForm.patient);
        $scope.dischargeSummForm.primaryDoctor = $scope.data.docName
      }
    })
  }

  $scope.fetchInvoices();

  //form for discharge summary

  $scope.refresh = function() {

    $scope.dischargeSummForm = {
      ipNo: '',
      treatingConsultant: '',
      mlcNo: '',
      firNo: '',
      provisionalDiagnosis: '',
      finalDiagnosis: '',
      complaintsAndReason: '',
      summIllness: '',
      keyFindings: '',
      historyOfAlchohol: '',
      pastHistory: '',
      familyHistory: '',
      summaryKeyInvestigation: '',
      courseInHospital: '',
      patientCondition: '',
      advice: '',
      reviewOn: '',
      complications: '',
      treatmentGiven: '',
      docList: [],
      docListPk: [],
      // primaryDoctor: $scope.data.docName
    }
  }

  $timeout(function() {
    $scope.$watch('dischargeSummForm.patient.dateOfDischarge', function(newValue, oldValue) {

      console.log(newValue);
      if (newValue == '' || newValue == undefined) {
        $scope.dischargeSummForm.patient.dateOfDischarge = new Date();
      } else {
        if (typeof newValue == 'string') {
          $scope.dischargeSummForm.patient.dateOfDischarge = new Date($scope.dischargeSummForm.patient.dateOfDischarge);
        }
      }

      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/activePatient/' + $scope.data.pk + '/',
        data: {
          status: 'dishcharged',
          dateOfDischarge: newValue
        },

      }).
      then(function(response) {})
    })
  }, 500)

  $scope.chageStatus = function() {
    $http({
      method: 'PATCH',
      url: '/api/hospitalManagement/activePatient/' + $scope.data.pk + '/',
      data: {
        status: 'dishcharged',
        dateOfDischarge: new Date()
      },

    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      console.log('dataaaa', response.data);
      $scope.dischargeSummForm.patient.dateOfDischarge = new Date();
    })
  }


  $scope.addDoctor = function() {
    if ($scope.dischargeSummForm.treatingConsultant.pk == undefined) {
      Flash.create('warning', 'Please Select Suggested Doctors');
      return
    }
    if ($scope.dischargeSummForm.docListPk.indexOf($scope.dischargeSummForm.treatingConsultant.pk) >= 0) {
      Flash.create('warning', 'This Doctor Has Already Added');
      $scope.dischargeSummForm.treatingConsultant = ''
      return
    }
    $scope.dischargeSummForm.docList.push($scope.dischargeSummForm.treatingConsultant)
    $scope.dischargeSummForm.docListPk.push($scope.dischargeSummForm.treatingConsultant.pk)
    $scope.dischargeSummForm.treatingConsultant = ''
  }
  $scope.removeDoctor = function(idx) {
    $scope.dischargeSummForm.docList.splice(idx, 1)
    $scope.dischargeSummForm.docListPk.splice(idx, 1)
  }


  $scope.saveDischargeSumm = function() {

    console.log('here...');
    console.log($scope.dischargeSummForm);
    if (typeof $scope.dischargeSummForm.primaryDoctor != 'object') {
      Flash.create('warning', 'Please Fill Suggested Primary Doctor');
      return
    }

    $scope.copyOfDoctor = $scope.dischargeSummForm.primaryDoctor
    var toSend = $scope.dischargeSummForm
    toSend.patient = $scope.dischargeSummForm.patient.pk
    toSend.primaryDoctor = $scope.dischargeSummForm.primaryDoctor.pk
    delete toSend['treatingConsultant']
    delete toSend['docList']
    console.log('******************', toSend);

    if ($scope.dischargeSummForm.pk) {
      var method = 'PATCH'
      var url = '/api/hospitalManagement/dischargeSummary/' + $scope.dischargeSummForm.pk + '/'
    } else {
      var method = 'POST'
      var url = '/api/hospitalManagement/dischargeSummary/'
    }
    $http({
      method: method,
      url: url,
      data: toSend,

    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      console.log('dataaaa', response.data);
      $scope.dischargeSummForm = response.data
      $scope.dischargeSummForm.primaryDoctor = $scope.copyOfDoctor
      $scope.dischargeSummForm.docList = $scope.dischargeSummForm.treatingConsultant
      $scope.dischargeSummForm.docListPk = []
      for (var i = 0; i < $scope.dischargeSummForm.docList.length; i++) {
        $scope.dischargeSummForm.docListPk.push($scope.dischargeSummForm.docList[i].pk)
      }
      $scope.dischargeSummForm.treatingConsultant = ''
    })
  }
  $scope.createInvoice = function() {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.createInvoice.html',
      size: 'md',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          return $scope.invoices;
        },
        patientData: function() {
          return $scope.data;
        }
      },
      controller: function($scope, patientData, invoiceData, $uibModalInstance) {

        $scope.invoiceForm = {
          name: ''
        }

        $scope.saveNewInvoice = function() {

          if ($scope.invoiceForm.name == '') {
            return
          }
          console.log('creating invoice.....s.');

          dataToSend = {
            activePatient: patientData.pk,
            invoiceName: $scope.invoiceForm.name,
            grandTotal: 0
          };

          console.log(dataToSend);

          $http({
            method: 'POST',
            url: '/api/hospitalManagement/invoice/',
            data: dataToSend
          }).
          then(function(response) {
            console.log('new invoice createdddd', response.data);
            invoiceData.push(response.data);
            $uibModalInstance.dismiss();
          })

        }

      },
    }).result.then(function() {

    }, function() {

    });
  }

  $scope.updatePayment = function(idx) {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.makePayment.html',
      size: 'sm',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          console.log($scope.invoices);
          console.log(idx);
          return $scope.invoices[idx];
        },
        indx: function() {
          return idx;
        }
      },
      controller: function($scope, indx, invoiceData, $uibModalInstance) {
        $scope.indx = indx;
        $scope.invoice = invoiceData;

        $scope.form = {
          discount: 0
        }

        $scope.saveInvoiceForm = function() {

          var toSend = {
            discount: $scope.form.discount,
            billed: true,
          }

          $http({
            method: 'PATCH',
            url: '/api/hospitalManagement/invoice/' + $scope.invoice.pk + '/',
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $uibModalInstance.dismiss();
          })


        }
      }
    }).result.then(function() {

    }, function() {
      $scope.fetchInvoices();
    });



  }

  $scope.openInvoice = function(pk) {
    window.open('/api/hospitalManagement/downloadInvoice/?invoicePk=' + pk, '_blank');
  }

  $scope.openDischargeSummary = function(pk) {
    console.log(pk);
    $scope.saveDischargeSumm()
    $timeout(function() {
      window.open('/api/hospitalManagement/downloaddischargeSummary/?pPk=' + pk, '_blank');
    }, 500)
  }
  $scope.invoiceInfo = function(idx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.invoiceInfo.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          return $scope.invoices[idx];
        },
        indx: function() {
          return idx;
        }
      },
      controller: function($scope, indx, invoiceData, $uibModalInstance) {
        $scope.indx = indx;
        $scope.form = invoiceData;
        $scope.form.productsList = [];
        console.log($scope.form);
        if ($scope.form.products != null && typeof $scope.form.products == 'string') {
          $scope.form.productsList = JSON.parse($scope.form.products);
        }
        console.log('formmmmmm', $scope.form);
        $scope.addTableRow = function() {
          $scope.form.productsList.push({
            data: "",
            quantity: 1
          });
          console.log($scope.form.productsList);
        }

        $scope.deleteTable = function(index) {
          $scope.form.productsList.splice(index, 1);
        };

        $scope.subTotal = function() {
          var subTotal = 0;
          angular.forEach($scope.form.productsList, function(item) {
            subTotal += (item.quantity * item.data.rate);
          })
          return subTotal.toFixed(2);
        }

        $scope.productSearch = function(query) {
          console.log("called");
          return $http.get('/api/hospitalManagement/product/?name__contains=' + query).
          then(function(response) {
            return response.data;
          })
        }

        $scope.saveInvoiceForm = function() {
          console.log('************');
          console.log($scope.form);
          var f = $scope.form;
          console.log(f);
          console.log(f.productsList);
          if (f.productsList.length == 0) {
            Flash.create('danger', 'Please add product');
            return;
          }
          var gtotal = $scope.subTotal()
          console.log(gtotal, typeof gtotal);
          if (gtotal == 'NaN') {
            Flash.create('danger', 'Please delete empty row');
            return;
          }
          var toSend = {
            products: JSON.stringify(f.productsList),
            grandTotal: gtotal
          }
          console.log(toSend);

          $http({
            method: 'PATCH',
            url: '/api/hospitalManagement/invoice/' + f.pk + '/',
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $uibModalInstance.dismiss();
          })

        }


      },
    }).result.then(function() {

    }, function() {
      $scope.fetchInvoices();
    });
  }

  $scope.checkOut = function() {
    console.log('checkout');
    console.log($scope.data);
    var date = new Date()
    console.log(date);
  }

});

app.controller("businessManagement.activePatients", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  //
  // $scope.limit = 10
  // $scope.offset = 0
  // $scope.count = 0
  //
  // $scope.privious = function() {
  //   if ($scope.offset > 0) {
  //     $scope.offset -= $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  //
  // $scope.next = function() {
  //   if ($scope.offset < $scope.count) {
  //     $scope.offset += $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    // let url = '/api/hospitalManagement/activePatient/?limit=' + $scope.limit + '&offset=' + $scope.offset
    let url = '/api/hospitalManagement/activePatient/'
    if ($scope.search.query.length > 0) {
      url = url + '?name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      // $scope.count = response.data.count
    })
  }
  $scope.fetchData()

});

app.controller("businessManagement.activePatients.form", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  $scope.patientSearch = function(query) {
    return $http.get('/api/hospitalManagement/patient/?firstName__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };
  $scope.doctorSearch = function(query) {
    console.log(query);
    return $http.get('/api/hospitalManagement/doctor/?name__icontains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  console.log('yesssss');
  $scope.statusList = [{
      name: "Checked In",
      value: "checkedIn"
    },
    {
      name: "Treatment ongoing",
      value: "onGoingTreatment"
    },
    {
      name: "Operation",
      value: "operation"
    },
    {
      name: "Observation",
      value: "observation"
    },
    {
      name: "Ready to discharged",
      value: "readyToDischarged"
    },
    {
      name: "Discharged",
      value: "dishcharged"
    },
    {
      name: "Settled",
      value: "settled"
    }
  ];

  $scope.$watch('activePatientsForm.status', function(newValue, oldValue) {
    console.log('newValue', newValue);
  })

  $scope.addNewActivePatient = function(name) {
    // $scope.addForm = true;
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.addNewPatientModal.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        name: function() {
          return name;
        },
        form: function() {
          return $scope.activePatientsForm;
        }
      },
      controller: function($scope, name, form, $uibModalInstance) {
        $scope.name = name
        $scope.formRefresh = function() {
          $scope.newPatient = {
            firstName: $scope.name,
            gender: '',
            age: '',
            phoneNo: '',
            street: '',
            city: 'Bangalore',
            pin: '',
            state: 'Karnataka',
            country: 'India',
            patient: ''
          };
        }
        $scope.formRefresh();

        $scope.cancelPatient = function() {
          $uibModalInstance.dismiss($scope.name);
        }
        $scope.createPatient = function() {

          if ($scope.newPatient.firstName == '') {
            Flash.create('warning', 'Please fill First Name');
            return
          }
          if ($scope.newPatient.age == '') {
            Flash.create('warning', 'Please fill Age');
            return
          }

          if ($scope.newPatient.phoneNo == '') {
            Flash.create('warning', 'Please enter mobile no');
            return
          }
          if ($scope.newPatient.pin == '') {
            delete $scope.newPatient.pin
          }
          console.log('lklklkllklklklklkl', $scope.newPatient);

          $http({
            method: 'POST',
            url: '/api/hospitalManagement/patient/',
            data: $scope.newPatient
          }).
          then(function(response) {
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.formRefresh()
            $uibModalInstance.dismiss(response.data);
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });
        }
      },
    }).result.then(function() {

    }, function(res) {
      console.log('ressssssssssssss', res);
      $scope.activePatientsForm.patient = res
    });

  }

  $scope.displayDetails = false;

  $scope.$watch('activePatientsForm.patient', function(newValue, oldValue) {
    console.log(newValue);
    if (newValue == undefined || newValue.length == 0) {
      $scope.displayDetails = false;
      $scope.addNewPatient = false;
      return
    }
    console.log(newValue.length);
    if (typeof newValue == 'object') {
      $scope.addNewPatient = false;
      $scope.displayDetails = true;
      console.log('obbjjj');
      if ($scope.activePatientsForm.pk == undefined) {
        $http.get('/api/hospitalManagement/activePatient/?patient=' + newValue.pk + '&outPatient=false').
        then(function(response) {
          console.log(response.data);
          if (response.data.length > 0) {
            Flash.create('danger', 'This patient is already added');
            $scope.activePatientsForm.patient = '';
            return;
          }
        })
      }
    } else {
      $scope.addNewPatient = true;
      $scope.displayDetails = false;
    }
  })


  $scope.createActivePatient = function() {

    if ($scope.activePatientsForm.patient == '') {
      Flash.create('danger', 'please fill patient name');
      return
    }
    if ($scope.activePatientsForm.inTime == '') {
      Flash.create('danger', 'please fill In Time');
      return
    }
    if ($scope.activePatientsForm.docName == '' || $scope.activePatientsForm.docName.pk == undefined) {
      Flash.create('danger', 'please Select Suggested Doctor Name');
      return
    }

    dataToSend = {
      patient: $scope.activePatientsForm.patient.pk,
      inTime: $scope.activePatientsForm.inTime,
      docName: $scope.activePatientsForm.docName.pk,
      mlc: $scope.activePatientsForm.mlc,
      cash: $scope.activePatientsForm.cash,
      insurance: $scope.activePatientsForm.insurance,
    };
    var m = 'POST'
    var url = '/api/hospitalManagement/activePatient/'
    console.log(dataToSend);

    $http({
      method: m,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);

      if ($scope.activePatientsForm.pk == undefined) {

        $scope.activePatientsForm = {
          patient: '',
          docName: '',
          inTime: new Date(),
          status: '',
          comments: '',
          mlc: false,
          cash: false,
          insurance: false

        };
      }

    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });
  }

  if ($state.is('businessManagement.hospitalManagement.editinPatients')) {

    $http({
      method: 'GET',
      url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.activePatientsForm = response.data
    })

    $scope.editinPatient = function() {
      dataToSend = {
        patient: $scope.activePatientsForm.patient.pk,
        inTime: $scope.activePatientsForm.inTime,
        docName: $scope.activePatientsForm.docName.pk,
        mlc: $scope.activePatientsForm.mlc,
        cash: $scope.activePatientsForm.cash,
        insurance: $scope.activePatientsForm.insurance,
        status: $scope.activePatientsForm.status,
      };
      Flash.create('success', 'Updated');


      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/',
        data: dataToSend,
      }).
      then(function(response) {
        Flash.create('success', 'Updated');
      })
    }
  } else {
    $scope.activePatientsForm = {
      patient: '',
      docName: '',
      inTime: new Date(),
      status: '',
      comments: '',
      mlc: false,
      cash: false,
      insurance: false

    };
  }
});

app.controller('businessManagement.outPatient.explore', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal, $stateParams) {

  $scope.updatePayment = function(idx) {

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.makePayment.html',
      size: 'sm',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          console.log($scope.invoices);
          console.log(idx);
          return $scope.invoices[idx];
        },
        indx: function() {
          return idx;
        }
      },
      controller: function($scope, indx, invoiceData, $uibModalInstance) {
        $scope.indx = indx;
        $scope.invoice = invoiceData;

        $scope.form = {
          discount: 0
        }

        $scope.saveInvoiceForm = function() {

          var toSend = {
            discount: $scope.form.discount,
            billed: true,
          }

          $http({
            method: 'PATCH',
            url: '/api/hospitalManagement/invoice/' + $scope.invoice.pk + '/',
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $uibModalInstance.dismiss();
          })


        }
      }
    }).result.then(function() {

    }, function() {
      $scope.fetchInvoices();
    });

  }

  console.log('coming in explooreeee');

  $scope.invoices = [];
  console.log('yyyyyyyyyyyyyy');

  $http({
    method: 'GET',
    url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/' + '?outPatient=true'
  }).
  then(function(response) {
    $scope.data = response.data
    console.log($scope.data);

    $scope.fetchInvoices = function() {
      $http({
        method: 'GET',
        url: '/api/hospitalManagement/invoice/?activePatient=' + $stateParams.id
      }).
      then(function(response) {
        console.log('invoicesss', response.data);
        $scope.invoices = response.data
        console.log('invoicesss', $scope.invoices);

      })

      $http({
        method: 'GET',
        url: '/api/hospitalManagement/dischargeSummary/?patientId=' + $scope.data.patient.pk
      }).
      then(function(response) {
        console.log('dissssssssss', response.data);
        $scope.dis = response.data
        if ($scope.dis.length > 0) {
          console.log('thteeeeeeeeeee');
          $scope.dischargeSummForm = $scope.dis[0]
        } else {
          console.log('newwwwwwwwwwwwwwww');
          $scope.refresh();
          $scope.dischargeSummForm.patientName = $scope.data.patient
        }
        console.log(777777777777777777777, $scope.dischargeSummForm);
      })
    }
    $scope.fetchInvoices();
  })

  $scope.refresh = function() {

    $scope.dischargeSummForm = {
      age: '',
      sex: '',
      telephoneNo: '',
      uhidNo: '',
      ipNo: '',
      treatingConsultantName: '',
      treatingConsultantContact: '',
      treatingConsultantDept: '',
      dateOfAdmission: new Date(),
      dateOfDischarge: new Date(),
      mlcNo: '',
      firNo: '',
      provisionalDiagnosis: '',
      finalDiagnosis: '',
      complaintsAndReason: '',
      summIllness: '',
      keyFindings: '',
      historyOfAlchohol: '',
      pastHistory: '',
      familyHistory: '',
      courseInHospital: '',
      patientCondition: '',
      advice: '',
      reviewOn: '',
      complications: '',
      doctorName: '',
      regNo: ''
    }
  }

  $scope.chageStatus = function() {
    $http({
      method: 'PATCH',
      url: '/api/hospitalManagement/activePatient/' + $scope.data.pk + '/',
      data: {
        status: 'dishcharged',
        dateOfDischarge: new Date()
      },

    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      console.log('dataaaa', response.data);
      $scope.data = response.data
    })
  }

  $scope.saveDischargeSumm = function() {

    console.log('here...');
    console.log($scope.dischargeSummForm);


    var toSend = $scope.dischargeSummForm
    toSend.patientName = $scope.dischargeSummForm.patientName.pk


    $http({
      method: 'POST',
      url: '/api/hospitalManagement/dischargeSummary/',
      data: $scope.dischargeSummForm,

    }).
    then(function(response) {
      Flash.create('success', 'Saved');
      console.log('dataaaa', response.data);
      $scope.refresh();
    })

  }

  $scope.createInvoice = function() {
    console.log('hereeeee');
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.createInvoice.html',
      size: 'md',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          return $scope.invoices;
        },
        patientData: function() {
          return $scope.data;
        }
      },
      controller: function($scope, patientData, invoiceData, $uibModalInstance) {

        $scope.invoiceForm = {
          name: ''
        }

        $scope.saveNewInvoice = function() {

          if ($scope.invoiceForm.name == '') {
            return
          }
          console.log('creating invoice.....s.');

          dataToSend = {
            activePatient: patientData.pk,
            invoiceName: $scope.invoiceForm.name,
            grandTotal: 0
          };

          console.log(dataToSend);

          $http({
            method: 'POST',
            url: '/api/hospitalManagement/invoice/',
            data: dataToSend
          }).
          then(function(response) {
            console.log('new invoice createdddd', response.data);
            invoiceData.push(response.data);
            $uibModalInstance.dismiss();
          })

        }

      },
    }).result.then(function() {

    }, function() {

    });
  }

  $scope.openInvoice = function(pk) {
    window.open('/api/hospitalManagement/downloadInvoice/?invoicePk=' + pk, '_blank');
  }


  $scope.invoiceInfo = function(idx) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.invoiceInfo.html',
      size: 'lg',
      backdrop: true,
      resolve: {
        invoiceData: function() {
          return $scope.invoices[idx];
        },
        indx: function() {
          return idx;
        }
      },
      controller: function($scope, indx, invoiceData, $uibModalInstance) {

        $scope.indx = indx;
        $scope.form = invoiceData;
        $scope.form.productsList = [];
        console.log($scope.form);
        if ($scope.form.products != null && typeof $scope.form.products == 'string') {
          $scope.form.productsList = JSON.parse($scope.form.products);
        }

        console.log('formmmmmm', $scope.form);


        $scope.addTableRow = function() {
          $scope.form.productsList.push({
            data: "",
            quantity: 1
          });
          console.log($scope.form.productsList);
        }

        $scope.deleteTable = function(index) {
          $scope.form.productsList.splice(index, 1);
        };

        $scope.subTotal = function() {
          var subTotal = 0;
          angular.forEach($scope.form.productsList, function(item) {
            subTotal += (item.quantity * item.data.rate);
          })
          return subTotal.toFixed(2);
        }

        $scope.productSearch = function(query) {
          console.log("called");
          return $http.get('/api/hospitalManagement/product/?name__contains=' + query).
          then(function(response) {
            return response.data;
          })
        }

        $scope.saveInvoiceForm = function() {
          console.log('************');
          console.log($scope.form);
          var f = $scope.form;
          console.log(f);
          console.log(f.productsList);
          if (f.productsList.length == 0) {
            Flash.create('danger', 'Please add product');
            return;
          }
          var gtotal = $scope.subTotal()
          console.log(gtotal, typeof gtotal);
          if (gtotal == 'NaN') {
            Flash.create('danger', 'Please delete empty row');
            return;
          }
          var toSend = {
            products: JSON.stringify(f.productsList),
            grandTotal: gtotal
          }
          console.log(toSend);

          $http({
            method: 'PATCH',
            url: '/api/hospitalManagement/invoice/' + f.pk + '/',
            data: toSend
          }).
          then(function(response) {
            Flash.create('success', 'Saved');
            $uibModalInstance.dismiss();
          })

        }


      },
    }).result.then(function() {

    }, function() {
      $scope.fetchInvoices();
    });
  }

  $scope.checkOut = function() {
    console.log('checkout');
    console.log($scope.data);
    var date = new Date()
    console.log(date);
  }

});

app.controller("businessManagement.outPatient", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {


  // $scope.limit = 10
  // $scope.offset = 0
  // $scope.count = 0
  //
  // $scope.privious = function() {
  //   if ($scope.offset > 0) {
  //     $scope.offset -= $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  //
  // $scope.next = function() {
  //   if ($scope.offset < $scope.count) {
  //     $scope.offset += $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    // let url = '/api/hospitalManagement/activePatient/?limit=' + $scope.limit + '&offset=' + $scope.offset + '&outPatient=true'
    let url = '/api/hospitalManagement/activePatient/?outPatient=true'
    if ($scope.search.query.length > 0) {
      url = url + '&name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      // $scope.count = response.data.count

    })
  }
  $scope.fetchData()

});


app.controller('businessManagement.outPatient.form', function($scope, $http, $aside, $state, Flash, $users, $filter, $timeout, $uibModal, $stateParams) {


  $scope.patientSearch = function(query) {
    return $http.get('/api/hospitalManagement/patient/?firstName__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.doctorSearch = function(query) {
    return $http.get('/api/hospitalManagement/doctor/?name__contains=' + query).
    then(function(response) {
      return response.data;
    })
  };

  $scope.statusList = [{
      name: "Checked In",
      value: "checkedIn"
    },
    {
      name: "Treatment ongoing",
      value: "onGoingTreatment"
    },
    {
      name: "Operation",
      value: "operation"
    },
    {
      name: "Observation",
      value: "observation"
    },
    {
      name: "Ready to discharged",
      value: "readyToDischarged"
    },
    {
      name: "Discharged",
      value: "dishcharged"
    },
    {
      name: "Settled",
      value: "settled"
    }
  ];

  $scope.activePatientsForm = {
    patient: '',
    docName: '',
    inTime: new Date(),
    status: '',
    comments: ''
  };
  $scope.addNewActivePatient = function(name) {
    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.activePatients.addNewPatientModal.html',
      size: 'lg',
      backdrop: false,
      resolve: {
        name: function() {
          return name;
        },
        form: function() {
          return $scope.activePatientsForm;
        }
      },
      controller: function($scope, name, form, $uibModalInstance) {
        $scope.name = name;
        $scope.formRefresh = function() {
          $scope.newPatient = {
            firstName: $scope.name,
            lastName: '',
            gender: '',
            age: '',
            phoneNo: '',
            street: '',
            city: 'Bangalore',
            pin: '',
            state: 'Karnataka',
            country: 'India'
          };
        }
        $scope.formRefresh();

        $scope.cancelPatient = function() {
          $uibModalInstance.dismiss($scope.name);
        }
        $scope.createPatient = function() {

          if ($scope.newPatient.firstName == '') {
            Flash.create('warning', 'Please fill First Name');
            return
          }
          if ($scope.newPatient.age == '') {
            Flash.create('warning', 'Please fill Age');
            return
          }
          if ($scope.newPatient.phoneNo == '') {
            Flash.create('warning', 'Please enter mobile no');
            return
          }
          if ($scope.newPatient.pin == '') {
            delete $scope.newPatient.pin
          }

          $http({
            method: 'POST',
            url: '/api/hospitalManagement/patient/',
            data: $scope.newPatient
          }).
          then(function(response) {
            Flash.create('success', response.status + ' : ' + response.statusText);
            $scope.formRefresh()
            $uibModalInstance.dismiss(response.data);
          }, function(response) {
            Flash.create('danger', response.status + ' : ' + response.statusText);
          });


        }



      },
    }).result.then(function() {

    }, function(res) {
      $scope.activePatientsForm.patient = res;
    });

  }


  $scope.$watch('activePatientsForm.patient', function(newValue, oldValue) {
    if (newValue.length == 0) {
      $scope.displayDetails = false;
      $scope.addNewPatient = false;
      return
    }
    console.log(newValue.length);
    if (typeof newValue == 'object') {
      $scope.addNewPatient = false;
      $scope.displayDetails = true;
      console.log('obbjjj');
      if ($scope.activePatientsForm.pk == undefined) {
        $http.get('/api/hospitalManagement/activePatient/?patient=' + newValue.pk + '&outPatient=true').
        then(function(response) {
          console.log(response.data);
          if (response.data.length > 0) {
            Flash.create('danger', 'This patient is already added');
            $scope.activePatientsForm.patient = '';
            return;
          }
        })
      }



    } else {
      $scope.addNewPatient = true;
      $scope.displayDetails = false;
    }
  })


  $scope.createActivePatient = function() {

    if ($scope.activePatientsForm.patient == '') {
      Flash.create('danger', 'please fill patient name');
      return
    }
    if ($scope.activePatientsForm.docName == '' || $scope.activePatientsForm.docName.pk == undefined) {
      Flash.create('danger', 'please Select Suggested Doctor Name');
      return
    }

    if ($scope.activePatientsForm.inTime == '') {
      Flash.create('danger', 'please fill In Time');
      return
    }


    dataToSend = {
      patient: $scope.activePatientsForm.patient.pk,
      docName: $scope.activePatientsForm.docName.pk,
      inTime: $scope.activePatientsForm.inTime,
      outPatient: true
    };


    var m = 'POST'
    var url = '/api/hospitalManagement/activePatient/'
    console.log(dataToSend);

    $http({
      method: m,
      url: url,
      data: dataToSend
    }).
    then(function(response) {
      Flash.create('success', response.status + ' : ' + response.statusText);

      if ($scope.activePatientsForm.pk == undefined) {
        $scope.activePatientsForm = {
          patient: '',
          docName: '',
          inTime: new Date(),
          status: '',
          comments: ''
        };
      }
    }, function(response) {
      Flash.create('danger', response.status + ' : ' + response.statusText);
    });

  }



  if ($state.is('businessManagement.hospitalManagement.editoutpatient')) {

    $http({
      method: 'GET',
      url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/' + '?outPatient=true'
    }).
    then(function(response) {
      $scope.activePatientsForm = response.data
      console.log($scope.activePatientsForm);
    })

    $scope.editOutPatient = function() {
      dataToSend = {
        patient: $scope.activePatientsForm.patient.pk,
        docName: $scope.activePatientsForm.docName.pk,
        inTime: $scope.activePatientsForm.inTime,
        outPatient: true,
        status: $scope.activePatientsForm.status
      };
      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/activePatient/' + $stateParams.id + '/' + '?outPatient=true',
        data: dataToSend,
      }).
      then(function(response) {
        Flash.create('success', 'Updated');
        console.log('dataaaa', response.data);
      })
    }
  }
});

app.controller("businessManagement.hospitalManagement.servicesOffered", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  // $scope.limit = 10
  // $scope.offset = 0
  // $scope.count = 0
  //
  // $scope.privious = function() {
  //   if ($scope.offset > 0) {
  //     $scope.offset -= $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  //
  // $scope.next = function() {
  //   if ($scope.offset < $scope.count) {
  //     $scope.offset += $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    // let url = '/api/hospitalManagement/product/?limit=' + $scope.limit + '&offset=' + $scope.offset
    let url = '/api/hospitalManagement/product/'
    if ($scope.search.query.length > 0) {
      url = url + '?name=' + $scope.search.query
    }
    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      // $scope.count = response.data.count
    })
  }
  $scope.fetchData()
});

app.controller("businessManagement.services.form", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  $scope.productForm = {
    name: '',
    rate: ''
  }

  $scope.save = function() {

    $http({
      method: 'POST',
      url: '/api/hospitalManagement/product/',
      data: {
        name: $scope.productForm.name,
        rate: $scope.productForm.rate
      }
    }).
    then(function(response) {
      console.log('product', response.data);
      Flash.create('success', 'Saved');
      $scope.productForm = {
        name: '',
        rate: ''
      }
    })

  }


  if ($state.is("businessManagement.hospitalManagement.editservicesOffered")) {
    console.log($stateParams.id, "servise");
    $http({
      method: 'GET',
      url: '/api/hospitalManagement/product/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.productForm = response.data
      console.log($scope.doctorForm);
    })
    $scope.editServise = function() {
      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/product/' + $scope.productForm.pk + '/',
        data: {
          name: $scope.productForm.name,
          rate: $scope.productForm.rate
        }
      }).
      then(function(response) {
        console.log('product', response.data);
        Flash.create('success', 'Updated');
      })
    }
  }

});
app.controller("businessManagement.hospitalManagement.doctors", function($scope, $state, $users, $stateParams, $http, Flash, $timeout) {

  // $scope.limit = 10
  // $scope.offset = 0
  // $scope.count = 0
  //
  // $scope.privious = function() {
  //   if ($scope.offset > 0) {
  //     $scope.offset -= $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  //
  // $scope.next = function() {
  //   if ($scope.offset < $scope.count) {
  //     $scope.offset += $scope.limit
  //     $scope.fetchData()
  //   }
  // }
  $scope.search = {
    query: ''
  }
  $scope.fetchData = function() {
    // let url = '/api/hospitalManagement/doctor/?limit=' + $scope.limit + '&offset=' + $scope.offset
    var url = '/api/hospitalManagement/doctor/'
    if ($scope.search.query.length > 0) {
      url += '?name__icontains=' + $scope.search.query
    }

    $http({
      method: 'GET',
      url: url
    }).
    then(function(response) {
      $scope.allData = response.data
      // $scope.count = response.data.count
    })
  }
  $scope.fetchData()
});

app.controller("businessManagement.hospitalManagement.doctors.form", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {

  console.log('gggggggggggg', $scope.tab);


  $scope.doctorForm = {
    name: '',
    department: '',
    education: '',
    mobile: ''
  }


  $scope.saveDoctor = function() {
    var toSend = {
      name: $scope.doctorForm.name,
      department: $scope.doctorForm.department,
      education: $scope.doctorForm.education,
      mobile: $scope.doctorForm.mobile
    }

    $http({
      method: 'POST',
      url: '/api/hospitalManagement/doctor/',
      data: toSend
    }).
    then(function(response) {
      console.log('product', response.data);
      Flash.create('success', 'Saved');
      $scope.doctorForm = {
        name: '',
        rate: ''
      }
    })

  }

  if ($state.is("businessManagement.hospitalManagement.editDoctors")) {
    console.log($stateParams.id, 'ddddddoooooooooooo');
    $http({
      method: 'GET',
      url: '/api/hospitalManagement/doctor/' + $stateParams.id + '/'
    }).
    then(function(response) {
      $scope.doctorForm = response.data
      console.log($scope.doctorForm);
    })
    $scope.editDoctor = function() {
      var toSend = {
        name: $scope.doctorForm.name,
        department: $scope.doctorForm.department,
        education: $scope.doctorForm.education,
        mobile: $scope.doctorForm.mobile
      }
      $http({
        method: 'PATCH',
        url: '/api/hospitalManagement/doctor/' + $stateParams.id + '/',
        data: toSend
      }).
      then(function(response) {
        console.log('product', response.data);
        Flash.create('success', ' Updated');
        $scope.doctorForm = response.data
      })
    }
  }


});
app.controller("businessManagement.hospitalManagement.reports11", function($scope, $rootScope, $state, $users, $stateParams, $http, Flash, $uibModal) {
  var toDay = new Date()
  console.log(toDay);


  $scope.dateForm = {
    'start': toDay,
    'end': toDay
  }
  console.log('datesssssssssssssssss', $scope.dateForm);

  $scope.tableData = []
  $scope.$watch('[dateForm.start,dateForm.end]', function(newValue, oldValue) {

    console.log($scope.dateForm);
    var s = $scope.dateForm.start
    s = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1)
    console.log(s);

    var d = $scope.dateForm.end
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2)
    console.log(d);
    $http({
      method: 'GET',
      url: '/api/hospitalManagement/reports/?start=' + s.toJSON().split('T')[0] + '&end=' + d.toJSON().split('T')[0]
    }).
    then(function(response) {
      $scope.tableData = response.data
      console.log('reports', $scope.tableData);
      $scope.grandTotal = 0
      for (var i = 0; i < $scope.tableData.length; i++) {
        $scope.grandTotal += $scope.tableData[i].grandTotal
      }
    })
  }, true)


});
