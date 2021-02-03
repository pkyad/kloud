var app = angular.module('app', ['ui.bootstrap', 'ngAside', 'uiSwitch']);

app.config(function($httpProvider) {

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;

});

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});


function getConnectorDimension(p1 , p2, arrowElem , labelElem) {

  if (p1.centerX < p2.centerX) {
    pointX = p1.centerX;
  }else{
    pointX = p2.centerX;
  }

  if (p1.centerY < p2.centerY) {
    pointY = p1.centerY;
  }else{
    pointY = p2.centerY;
  }

  width = Math.abs(p1.centerX-p2.centerX)
  height = Math.abs(p1.centerY-p2.centerY)

  // console.log(p1);
  // console.log(p2);

  if (p1.centerY > p2.centerY && p1.centerX > p2.centerX) {

    // console.log("case 1");

    css = {"border-top-style":"solid", "border-right-style":"solid","border-bottom-style":"none", "border-left-style":"none" };

    if (pointX + width < (p2.centerX + p2.w/2)) {
      // console.log(1);
      arrowElem.css({"margin-top": (p2.h/2+10) +"px","position": "absolute","right": "-5px", "transform": "rotate(-90deg)", "left" : "unset", "bottom": "unset" })

      // labelElem.css({"margin-top": (p2.h/2+10)+"px","right": "10px", "left" : "unset", "bottom": "unset"})

    }else{
      // console.log(2);
      arrowElem.css({"margin-top": "-13px","position": "absolute","right": "initial", "transform": "rotate(180deg)", "left": (p2.w/2 + 10) +"px", "bottom": "unset" })

      // labelElem.css({"margin-top": "0px","right": "unset", "left" : (p2.w/2+20) +"px", "bottom": "unset"})

    }

  }else if (p1.centerY < p2.centerY && p1.centerX > p2.centerX) {

    // console.log("case 2" , pointX , pointY , p1 , p2);


    css = {"border-top-style":"solid", "border-left-style":"solid","border-bottom-style":"none", "border-right-style":"none" };
    if (p2.centerY - p2.h/2 > pointY) {
      // console.log(3);
      arrowElem.css({"margin-top": "unset","position": "absolute","right": "unset", "transform": "rotate(90deg)", "left" : "-6px", "bottom": (p1.h/2+6) +"px"  })

      // labelElem.css({"margin-top": "unset","right": "unset", "left" : "10px", "bottom": "40px"})
    }else{
      // console.log(4);
      arrowElem.css({"margin-top": "-14px","position": "absolute","right": "unset", "transform": "rotate(-180deg)", "left" : (p2.w/2+1) +"px", "bottom": "unset"})

      // labelElem.css({"margin-top": "4px","right": (p2.w/2+20) +"px", "left" : "unset", "bottom": "unset"})
    }

  }else if (p1.centerY < p2.centerY && p1.centerX < p2.centerX) {
    // case 3
    // console.log("case 3");
    css = {"border-top-style":"none", "border-right-style":"none","border-bottom-style":"solid", "border-left-style":"solid" };

    if (p1.centerX < (p2.centerX - p2.w/2)) {
      // console.log(5);
      arrowElem.css({"margin-top": "unset","position": "absolute","right": p2.w/2 +"px", "transform": "rotate(0deg)", "left" : "unset", "bottom": "-16px"})

      // labelElem.css({"margin-top": "4px","right": (p2.w/2+20) +"px", "left" : "unset", "bottom": "unset"})

    }else{
      // console.log(6);
      arrowElem.css({"margin-top": "unset","position": "absolute","right": "unset", "transform": "rotate(90deg)" , "left" : "-6px", "bottom" : (p2.h/2 -4) + "px"})

      // labelElem.css({"margin-top": "4px","right":  (p2.w/2 +20) + "px", "left" : "unset", "bottom": "0px"})


    }
  }else{
    // console.log("case 4");
    // case 4

    css = {"border-top-style":"none", "border-left-style":"none","border-bottom-style":"solid", "border-right-style":"solid" };


    if (pointX > (p2.centerX - p2.w/2)  && pointY < (p2.centerY - p2.h/2)) {

      if (p2.centerY<p1.centerY) {
        // console.log(7);
        arrowElem.css({"margin-top": p2.h/2 +"px","position": "absolute","right": "unset", "transform": "rotate(-90deg)", "left" : "-7px", "bottom": "unset"})
      }else{
        // console.log(9);
        arrowElem.css({"margin-top": "unset","position": "absolute","right": p2.w/2 +"px", "transform": "rotate(0deg)", "left" : "unset", "bottom": "-16px"})
      }

    }else{


      if ((p2.centerY +p2.h/2) < (p1.centerY-10) ) {
        // console.log(8);
        arrowElem.css({"margin-top": (p2.h/2-10)  +"px","position": "absolute","right": "-6px", "transform": "rotate(-90deg)", "left" : "unset", "bottom": "unset"})

        // labelElem.css({"margin-top":  p2.h/2+"px","right": "10px", "left" : "unset", "bottom": "unset"})

      }else{
        // console.log(9);
        arrowElem.css({"margin-top": "unset","position": "absolute","right": (p2.w/2)+ "px", "transform": "rotate(0deg)", "left" : "unset", "bottom": "-16px"})
      }


    }
  }
  // console.log(css);
  return {x : pointX , y : pointY , w : width , h : height, css : css}
}

function getElementCenter(elem) {
  var offset = elem.offset();

  if (offset == undefined) {
    return;
  }

  var width = elem.width();
  var height = elem.height();
  var centerX = offset.left + width / 2;
  var centerY = offset.top + height / 2;
  return {centerX : centerX , centerY : centerY, w : width , h : height}
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

app.controller("controller.customer.uipathSettings.modal", function($scope, $timeout, $uibModalInstance,$http , ind) {
  $scope.form = {url : '' , email : '' , password : '' , tenant : '' , error : false, success : false}
  $scope.ind = ind;

  $scope.clear = function() {
    $http({method : 'DELETE' , url : '/api/chatbot/saveSettings/', data : {type : 'uipath'} }).
    then(function(response) {
      $scope.form.url = '';
      $scope.form.email = '';
      $scope.form.tenant = '';
      $scope.form.password = '';
    });
  }


  $http({method : 'GET' , url : '/api/chatbot/saveSettings/?type=uipath&customer=' + COMPANY_PK }).
  then(function(response) {
    $scope.form.url = response.data.url;
    $scope.form.email = response.data.email;
    $scope.form.tenant = response.data.tenant;
    $scope.form.password = response.data.password;
    $scope.form.uipathOrgId = response.data.uipathOrgId;
  });


  $scope.save = function() {

    if ($scope.form.email == "" || $scope.form.password == "" || $scope.form.url == "" || $scope.form.tenant == "" || $scope.form.url == null) {
      // Flash.create('warning' , 'Please fill all the details')
      $scope.form.error = true;
      return;
    }
    var toSend = {
      data : $scope.form,
      type : 'uipath',
      customer : COMPANY_PK,
    }
    $http({method : 'POST' , url : '/api/chatbot/saveSettings/' , data : toSend}).
    then(function(response) {
      $scope.form.success = true;
      $scope.form.error = false;
      // Flash.create('success' , 'Saved')
      $uibModalInstance.dismiss($scope.ind);
    }, function(err) {
      // Flash.create('danger' , 'Error')
      $scope.form.error = true;
      $scope.form.success = false;
    })
  }

  $scope.cancel = function() {
    $uibModalInstance.close();
  }

})



app.controller('main', function($scope, $http, $timeout, $aside , $uibModal ) {

  if (window.location.href.indexOf('cloned') != -1) {
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }

    $uibModal.open({
      templateUrl: '/static/ngTemplates/app.autoPlay.html',
      size: 'sm',
      backdrop: true,
      controller: function($scope , $uibModalInstance, $interval) {
        $scope.cancel = function() {
          $uibModalInstance.close();
        }

        $scope.time = 5;
        $interval(function() {
          $scope.time -= 1;
          if ($scope.time == -1) {
            $uibModalInstance.dismiss(true);
          }
        },1000)


      },
    }).result.then(function() {
      console.log("in first");
    }, function(reason) {
      console.log(reason);
      if (reason == true) {
        $scope.playOnWeb();
      }
    });

  }


  var autoPlay = $.cookie('autoPlay');
  console.log(autoPlay);
  if (autoPlay == undefined) {
    $scope.autoPlay = true;
    $.cookie('autoPlay' , '1');
  }else if (autoPlay == '1') {
    $scope.autoPlay = true;
  }else{
    $scope.autoPlay = false;
  }
  $scope.saveAutoPlay = function() {
    if ($scope.autoPlay) {
      $.cookie('autoPlay' , '1');
    }else {
      $.cookie('autoPlay' , '0');
    }
  }



  window.addEventListener("message", function(event) {
    console.log(event);
    if (event.data.debugger != undefined || event.data.debugger != null) {
      if (event.data.debugger[0] == 'STEP' ) {
        $scope.liveConnector.currentStep = parseInt(event.data.debugger[1]);

        for (var i = 0; i < $scope.blocks.length; i++) {
          if ($scope.liveConnector.currentStep == $scope.blocks[i].id) {
            $scope.blocks[i].backgroundColor = '#ffff98';
          }else{
            $scope.blocks[i].backgroundColor = 'white';
          }

        }
        $scope.$apply()

      }else if (event.data.debugger[0] == 'ERROR') {
        $scope.errorMsg = event.data.debugger[1];
        $scope.errorMsgType = event.data.debugger[2];

        $scope.showErrorMsg = true;
        $scope.$apply()
      }

    }else if (event.data.autoPlay != undefined || event.data.autoPlay != null) {
      if (event.data.autoPlay == true && $scope.autoPlay) {

        $http({method : 'GET' , url : '/api/chatbot/getExampleInput/?step=' + $scope.liveConnector.currentStep }).
        then(function(response) {
          if (response.data.valid) {
            CHATTER_FUNCTION.sendCustomMessage(response.data.txt , false , false)
          }
        })


      }
    }
  }, false);


  $scope.intentID = INTENT_ID;

  $scope.screenWidth = screen.width * 0.70;


  $scope.colors = [
     '#607d8b','#f9a825','#f44336' ,'#d500f9','#455a64',  '#ff1744'

  ]

  $scope.hideOptions = function(evt) {
    if ($scope.liveConnector.showOpt) {
      evt.stopPropagation();
      $scope.liveConnector.showOpt = false;
    }
  }

  $scope.errorMsg = '';
  $scope.showErrorMsg = false;
  $scope.closeErrorMsg = function(evnt) {
    $scope.showErrorMsg = false;
    evnt.stopPropagation();
  }

  $scope.openErroMsg = function(evnt) {
    if ($scope.errorMsgType == 'UIPATHCONFIG') {
      $scope.openUIPathSettings(null);
    }else if ($scope.errorMsgType == 'CONFIG') {
      for (var i = 0; i < $scope.blocks.length; i++) {
        if ($scope.blocks[i].id == $scope.liveConnector.currentStep) {
          $scope.openProperties(i);
        }
      }
    }
    $scope.showErrorMsg = false;
  }


  $scope.openUIPathConfig = function() {
    $aside.open({
      templateUrl: '/static/ngTemplates/app.customer.uipathSettings.modal.html',
      size: 'xl',
      backdrop: true,
      position:'left',
      resolve: {
        ind : function() {
          return
        }
      },
      controller: 'controller.customer.uipathSettings.modal',
    }).result.then(function() {}, function(res) {
    })
  }


  $scope.openUIPathSettings = function(ind) {



      $http({method : 'GET' , url : '/api/chatbot/saveSettings/?type=uipath&customer=' + COMPANY_PK }).
      then((function(ind) {
        return function(response) {

          if (response.data.url == null) {

            $aside.open({
              templateUrl: '/static/ngTemplates/app.customer.uipathSettings.modal.html',
              size: 'xl',
              backdrop: false,
              position:'left',
              resolve : {
                ind : function() {
                  return ind
                }
              },
              controller: 'controller.customer.uipathSettings.modal',
            }).result.then(function(res) {
              console.log(res);
            }, function(res) {
              console.log("das" , res);
              if (res != null) {
                $scope.openProperties(res , false);
              }


            })
          }else{
            if (ind != null) {
              $scope.openProperties(ind , false);
            }
          }

        }
      })(ind));

  }

  $scope.saveMessage = function(b) {
    $http({method : 'PATCH' , url : '/api/chatbot/intents/'+ b.id +'/' , data : {auto_response : b.auto_response}})
  }

  $scope.openProperties = function(ind , check) {
    if ( $scope.blocks[ind].blockType == 'sendMessage' ) {
      return;
    }

    if ($scope.liveConnector.active || $scope.blocks[ind].blockType == 'end') {
      $scope.liveConnector.active = false;
      return;
    }

    if (check && $scope.blocks[ind].blockType == 'invokeUiPath') {
      $scope.openUIPathSettings(ind);
      return;
    }



    $scope.liveConnector.moved = false;
    $aside.open({
      templateUrl: '/static/ngTemplates/nodeProperties.html',
      placement: 'left',
      size: 'md',
      backdrop: true,
      controller: function($scope , $http , $uibModalInstance , block) {


        $scope.autoFill = function(typ) {
          if (typ == 'orderid') {
            $scope.data.auto_response = 'Please enter your 6 digit order ID';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    \n    regexPattern = r\"\\d{6}\"\n    # replace it with your own regex pattern\n    \n    result = re.findall(regexPattern , txt)\n    \n    if len(result)>0:\n        return result[0]\n    else:\n        # returning None will make the intent go into failure path\n        return None';
            $scope.data.exampleInput = 'That will be 123456';

          }else if (typ == 'aadhar') {
            $scope.data.auto_response = 'Please enter your aadhar number';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    \n    regexPattern = r\"\\d{12}\"\n    # replace it with your own regex pattern\n    \n    result = re.findall(regexPattern , txt)\n    \n    if len(result)>0:\n        return result[0]\n    else:\n        # returning None will make the intent go into failure path\n        return None';
            $scope.data.exampleInput = 'That will be 123456789012';
          }else if (typ == 'ssn') {
            $scope.data.auto_response = 'Please enter your Social Security Number';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    \n    regexPattern = r\"^(?!000|.+0{4})(?:\\d{9}|\\d{3}-\\d{2}-\\d{4})$\" \n    # replace it with your own regex pattern\n    \n    result = re.findall(regexPattern , txt)\n    \n    if len(result)>0:\n        return result[0]\n    else:\n        # returning None will make the intent go into failure path\n        return None';
            $scope.data.exampleInput = 'That will be AAA-GG-SSSS';
          }else if (typ == 'account') {
            $scope.data.auto_response = 'Please enter your 10 digit account number';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    \n    regexPattern = r\"\\d{10}\"\n    # replace it with your own regex pattern\n    \n    result = re.findall(regexPattern , txt)\n    \n    if len(result)>0:\n        return result[0]\n    else:\n        # returning None will make the intent go into failure path\n        return None';
            $scope.data.exampleInput = 'That will be 1234567890';
          }else if (typ == 'date') {
            $scope.data.auto_response = 'Please enter the date';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = nlpResult\n    \n    if len(dates)>0:\n        return dates[0][1].strftime(\"%m-%d-%Y\")\n    else:\n        return None';
            $scope.data.exampleInput = 'How about next Tuesday';
          }else if (typ == 'pan') {
            $scope.data.auto_response = 'Please enter your PAN number';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    \n    regexPattern = r\"[A-Za-z]{5}\\d{4}[A-Za-z]{1}\" \n    # replace it with your own regex pattern\n    \n    result = re.findall(regexPattern , txt)\n    print result\n    if len(result)>0:\n        return result[0]\n    else:\n        # returning None will make the intent go into failure path\n        return None';
            $scope.data.exampleInput = 'RTYGT7654G';
          }else if (typ == 'money') {
            $scope.data.auto_response = 'How much money you need';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = nlpResult\n    print percents\n    if len(percents)>0:\n        return percents[0]\n    else:\n        return None';
            $scope.data.exampleInput = '$2343';
          }else if (typ == 'percentage') {
            $scope.data.auto_response = 'Please enter a percentage value';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = nlpResult\n    print percents\n    if len(percents)>0:\n        return percents[0]\n    else:\n        return None';
            $scope.data.exampleInput = '18%';
          }else if (typ == 'location') {
            $scope.data.auto_response = 'Where do you want to go';
            $scope.data.custom_process_code = 'def extract(txt , nlpResult):\n    datafields , words,percents, durations , persons , miscs , locations, cleanedTags, dates, money = nlpResult\n    print locations\n    if len(locations)>0:\n        return locations[0]\n    else:\n        return None';
            $scope.data.exampleInput = 'I want to visit Sydney';
          }else if (typ == 'mapping') {
            $scope.data.custom_process_code = "def extract(txt , nlpResult):\n    \n    # this is an example of transforming the message to standard codes like state codes\n    mapings = [\n        {'from' : 'Karnataka' , 'to' : 'KA'},\n        {'from' : 'Maharashtra' , 'to' : 'MH'},\n        {'from' : 'Tamilnadu' , 'to' : 'TN'},\n    ]\n    \n    \n    \n    similarityArray = []\n    for mapping in mapings:\n        mapping['similarity'] = compareSentance(Statement(mapping['from']),Statement(txt))\n        \n        if mapping['similarity'] >0.9: # skip if its not 90% similar\n            similarityArray.append(mapping)\n\n    similarityArray.sort(key=lambda x: x['similarity'], reverse=True)\n\n    for toPrint in similarityArray:\n        print toPrint\n\n\n    if len(similarityArray)>0:\n        return similarityArray[0]['to']\n    else:\n        return None";

            $scope.data.exampleInput = 'Karnataka';
            $scope.data.auto_response = 'Which state you live in';

          }
          $scope.data.context_key = typ;
          $scope.data.failResponse = 'Opps... I could not get it';
          $scope.data.nodeResponse = 'Thanks';
          $scope.editor3.setValue($scope.data.custom_process_code, -1);


        }



        $scope.block = block;
        $scope.close = function() {
          $uibModalInstance.dismiss();
        }

        $scope.form = {inputVariation : '' , optionTxt: '', affirmVariation : '', startOverVariation : '', actionVariation : ''}

        $scope.addAffirmVariation = function() {

          $http({method : 'POST' , url : '/api/chatbot/nodeblockinputvariation/' , data : {parent : $scope.data.pk , txt : $scope.form.affirmVariation}   }).
          then(function(response) {
            $scope.data.input_vatiations.push(response.data)
            $scope.form.affirmVariation = "";
          })

        }

        $scope.deleteAffirmVariation = function(i , indx) {
          $http({method : 'DELETE' , url : '/api/chatbot/nodeblockinputvariation/' + i.pk + '/'   }).
          then((function(indx) {
            return function(response) {
              $scope.data.input_vatiations.splice(indx , 1);
            }
          })(indx))
        }

        $scope.addStartOverVariation = function() {
          $http({method : 'POST' , url : '/api/chatbot/startovervariations/' , data : {parent : $scope.data.pk , txt : $scope.form.startOverVariation}   }).
          then(function(response) {
            $scope.data.startover_vatiations.push(response.data)
            $scope.form.startOverVariation = "";
          })
        }

        $scope.deleteStartOverVariation = function(i , indx) {
          $http({method : 'DELETE' , url : '/api/chatbot/startovervariations/' + i.pk + '/'   }).
          then((function(indx) {
            return function(response) {
              $scope.data.startover_vatiations.splice(indx , 1);
            }
          })(indx))

        }


        $scope.addInputVariation = function() {
          $http({method : 'POST' , url : '/api/chatbot/nodeselectionsvariations/' , data : {parent : $scope.data.pk , txt : $scope.form.inputVariation}   }).
          then(function(response) {
            $scope.data.node_variations_vatiations.push(response.data)
            $scope.form.inputVariation = "";
          })
        }

        $scope.deleteInputVariation = function(i , indx) {
          $http({method : 'DELETE' , url : '/api/chatbot/nodeselectionsvariations/' + i.pk + '/'   }).
          then((function(indx) {
            return function(response) {
              $scope.data.node_variations_vatiations.splice(indx , 1);
            }
          })(indx))

        }

        $scope.addActionInputVariation = function() {
          $http({method : 'POST' , url : '/api/chatbot/actionintentinputvariation/' , data : {parent : $scope.data.pk , txt : $scope.form.actionVariation}   }).
          then(function(response) {
            $scope.data.action_intent_vatiations.push(response.data)
            $scope.form.actionVariation = "";
          })
        }

        $scope.deleteActionInputVariation = function(i , indx) {
          $http({method : 'DELETE' , url : '/api/chatbot/actionintentinputvariation/' + i.pk + '/'   }).
          then((function(indx) {
            return function(response) {
              $scope.data.action_intent_vatiations.splice(indx , 1);
            }
          })(indx))

        }

        $http({method : 'GET' , url : '/api/chatbot/intents/' + block.id   +'/' }).
        then(function(response) {
          $scope.data = response.data;

          $scope.data.retry += '';


          $scope.initiate();

          if ($scope.data.blockType == 'presentCatalog') {

            $http({url : '/api/finance/category/' , method : 'GET'}).
            then(function(response) {
              $scope.catalogs = response.data;
            });

          } else if ($scope.data.blockType == 'invokeUiPath') {
            $scope.uipathData = {processes : [], environments : [], robots : [] , queues : []}

            // $http({url : '/api/support/uipathResources/?type=environment&profile=' + COMPANY_PROFILE , method : 'GET'}).
            // then(function(response) {
            //   $scope.uipathData.environments = response.data.value;
            // });

            $http({url : '/api/chatbot/uipathResources/?type=process'  , method : 'GET'}).
            then(function(response) {
              $scope.uipathData.processes = response.data.value;
            });


            $http({url : '/api/chatbot/uipathResources/?type=queues' , method : 'GET'}).
            then(function(response) {
              $scope.uipathData.queues = response.data.value;
            });

            $http({url : '/api/chatbot/uipathResources/?type=robots' , method : 'GET'}).
            then(function(response) {
              $scope.uipathData.robots = response.data.value;

              var robot = JSON.parse($scope.data.uipathRobot)
              for (var i = 0; i < $scope.uipathData.robots.length; i++) {
                if ($scope.uipathData.robots[i].Id == robot.Id) {
                  $scope.data.uipathRobot = i + '';
                }
              }

            });
          }

        })

        $scope.resetProcessAndRobot = function() {
          $scope.data.uipathRobot = null;
          $scope.data.uipathProcess = null;
        }

        $scope.resetUiPathQueue = function() {
          $scope.data.uipathQueue = null;
        }

        $scope.saveOptions = function(connection, ind) {
          $scope.block.connections[ind].condition = connection.condition;
          $http({method : 'PATCH' , url : '/api/chatbot/connection/' +  connection.pk +'/', data : {condition : connection.condition}}).
          then(function(response) {

          })
        }

        $scope.addOptions = function(switchCase) {
          var dataToSend = {parent :  $scope.data.pk , callbackName : 'option'  }
          if (!switchCase) {
            dataToSend.condition = $scope.form.optionTxt;
          }

          $http({method : 'POST' , url : '/api/chatbot/connection/' , data : dataToSend}).
          then(function(response) {
            $scope.data.connections.push(response.data);
            $scope.block.connections.push(response.data);
            $scope.form.optionTxt = '';
          })
        }

        $scope.deleteOption = function(connection , indx) {
          $http({method : 'DELETE' , url : '/api/chatbot/connection/' +  connection.pk +'/' }).
          then((function(indx) {
            return function(response) {
              $scope.data.connections.splice(indx , 1);
              $scope.block.connections.splice(indx , 1);
            }
          })(indx))
        }



        $scope.save = function() {
          var b = $scope.data;

          var dataToSend = {
            auto_response : b.auto_response,
            failResponse : b.failResponse,
            nodeResponse : b.nodeResponse,
            context_key : $scope.block.context_key,
            name : $scope.block.name,
            // description : b.description,
            verify : b.verify,
            unique : b.unique,
            // description : b.description,
            exampleInput : b.exampleInput,
            retry : b.retry
          }

          if (b.blockType == 'runPython' || b.blockType == 'getInput') {
            if ($scope.editor3 != undefined) {
              dataToSend.custom_process_code = $scope.editor3.getValue();
            }

          }else if (b.blockType == 'getMobile' || b.blockType == 'getEmail') {
            if ($scope.editor1 != undefined) {
              dataToSend.pre_validation_code = $scope.editor1.getValue();
            }
            if ($scope.editor2) {
              dataToSend.validation_code = $scope.editor2.getValue();
            }
          }else if (b.blockType == 'presentCatalog') {
            dataToSend.endpoint = b.endpoint;
          }

          if (b.blockType == 'invokeUiPath') {

            // if (b.uipathEnvironment != "") {
            //   dataToSend.uipathEnvironment = b.uipathEnvironment;
            // }
            if (b.uipathRobot != "" && b.uipathRobot != null ) {
              dataToSend.uipathRobot = JSON.stringify($scope.uipathData.robots[parseInt(b.uipathRobot)]);
              if (b.uipathProcess != "" && b.uipathProcess != null) {
                dataToSend.uipathProcess = b.uipathProcess;
              }
            }else{
              if (b.uipathQueue != ""  && b.uipathQueue != null) {
                dataToSend.uipathQueue = b.uipathQueue;
              }
            }
          }

          $scope.saving = true;
          $http({method : 'PATCH' , url : '/api/chatbot/intents/' + $scope.block.id   +'/' , data : dataToSend  }).
          then(function(response) {
            console.log(response);
            $scope.saving = false;
          })
        }

        $scope.testCode = function() {
          $http({method : 'POST' , url : '/extractorTester/' , data : {txt : $scope.data.exampleInput , code : $scope.editor3.getValue() }  }).
          then(function(response) {
            console.log(response);

          })
        }

        $scope.initiate = function() {
          if (($scope.data.blockType == 'getMobile' || $scope.data.blockType == 'getEmail') && $scope.data.verify) {

              $timeout(function() {
                $scope.editor1 = ace.edit('aceEditor');
                $scope.editor1.setTheme("ace/theme/XCode");
                $scope.editor1.getSession().setMode("ace/mode/python");
                $scope.editor1.getSession().setUseWorker(false);
                $scope.editor1.setHighlightActiveLine(false);
                $scope.editor1.setShowPrintMargin(false);
                ace.require("ace/ext/language_tools");
                $scope.editor1.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true
                });
                 $scope.editor1.setFontSize("14px");
                $scope.editor1.setBehavioursEnabled(true);
                $scope.editor1.setValue($scope.data.pre_validation_code, -1);
              }, 300)

              $timeout(function() {
                $scope.editor2 = ace.edit('aceEditor2');
                $scope.editor2.setTheme("ace/theme/XCode");
                $scope.editor2.getSession().setMode("ace/mode/python");
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
                $scope.editor2.setValue($scope.data.validation_code, -1);
              }, 300)


          };

          if ($scope.data.blockType == 'runPython' || $scope.data.blockType == 'getInput') {

            $timeout(function() {
              $scope.editor3 = ace.edit('aceEditor3');
              $scope.editor3.setTheme("ace/theme/XCode");
              $scope.editor3.getSession().setMode("ace/mode/python");
              $scope.editor3.getSession().setUseWorker(false);
              $scope.editor3.setHighlightActiveLine(false);
              $scope.editor3.setShowPrintMargin(false);
              $scope.editor3.getSession().setUseWrapMode(true);
              $scope.editor3.getSession().setWrapLimitRange();
              // $scope.editor3.$blockScrolling = Infinity;
              ace.require("ace/ext/language_tools");
              $scope.editor3.setOptions({
                  enableBasicAutocompletion: true,
                  enableSnippets: true
              });
               $scope.editor3.setFontSize("14px");
              $scope.editor3.setBehavioursEnabled(true);
              $scope.editor3.setValue($scope.data.custom_process_code, -1);
            }, 300)


          }
        }


      },
      resolve: {
       block: function () {
         return $scope.blocks[ind];
        }
      }
    })
  }



  $scope.deleteConnection = function() {
    $scope.liveConnector.showdelete = false;
    var conn = $scope.blocks[$scope.liveConnector.selectedConnectorFrom].connections[$scope.liveConnector.selectedConnectorInd];

    $http({method : 'PATCH' , url : '/api/chatbot/intentView/' + conn.pk + '/' , data : {action : 'removeConnection'}}).
    then(function(response) {
      conn.to = null;
    })

    $scope.liveConnector.connection = null;
    $scope.clickingAnywhere();

    console.log($scope.blocks);
  }

  // $scope.openProperties()

  $scope.clickingAnywhere = function() {
    $scope.liveConnector.showdelete = false;
    for (var i = 0; i < $scope.blocks.length; i++) {
      $scope.blocks[i].hovering = false;
      var conns = $scope.blocks[i].connections;
      for (var j = 0; j < conns.length; j++) {
        var c = conns[j];
        $('#connector' + $scope.blocks[i].id+ '-' + c.to).css({"border-color" : $scope.colors[j]})
        $('#arrow' + $scope.blocks[i].id+ '-' + c.to).css({"color" : $scope.colors[j]})
      }
    }
  }

  $scope.checkConnectionSelection = function(evnt , ind , bind, c) {

    $scope.liveConnector.selectedConnectorFrom = bind;
    $scope.liveConnector.selectedConnectorInd = ind;

    console.log(ind , bind);

    console.log(evnt);
    var ptx = evnt.clientX;
    var pty = evnt.clientY;
    evnt.stopPropagation();
    var target = evnt.currentTarget;

    var h = target.clientHeight;
    var w = target.clientWidth;
    var x = target.offsetLeft;
    var y = target.offsetTop;

    var elem = $( '#' + evnt.currentTarget.id);
    var valt = elem.css("border-top-style")=='solid';
    var vall = elem.css("border-left-style")=='solid';
    var valb = elem.css("border-bottom-style")=='solid';
    var valr = elem.css("border-right-style")=='solid';

    // console.log(Math.abs(pty-y-h)<10);
    // console.log(ptx);
    // console.log(x);
    // console.log(h);
    // console.log(elem.css("border-bottom-style"));
    // console.log(valb);
    // console.log(ptx , pty , h , w , x , y);

    console.log($('#connector' + $scope.blocks[bind].id + '-' + c.to));

    if ((Math.abs(ptx-x)<10 && vall ) || (Math.abs(ptx-x-w)<10 && valr) || (Math.abs(pty-y)<10 && valt) || (Math.abs(pty-y-h)<10 && valb) ) {
      console.log("close");

      $('#connector' + $scope.blocks[bind].id + '-' + c.to).css({"border-color" : "red"})
      $('#arrow' + $scope.blocks[bind].id + '-' + c.to).css({"color" : "red"})

      $scope.liveConnector.deletex = ptx;
      $scope.liveConnector.deletey = pty;
      $scope.liveConnector.showdelete = true;

      // $scope.blocks[bind].connections[ind].selec

    }else{
      $('#connector' + $scope.blocks[bind].id + '-' + c.to).css({"border-color" : $scope.colors[ind]})
      $('#arrow' + $scope.blocks[bind].id + '-' + c.to).css({"color" : $scope.colors[ind]})
      $scope.liveConnector.showdelete = false;
    }

    for (var j = 0; j < $scope.blocks.length; j++) {
      var conns = $scope.blocks[j].connections;

      for (var i = 0; i < conns.length; i++) {
        if (i != ind) {
          $('#connector' + conns[i].from+ '-' + conns[i].to).css({"border-color" : $scope.colors[ind]})
          $('#arrow' + conns[i].from+ '-' + conns[i].to).css({"color" : $scope.colors[ind]})
        }
      }


    }

    // $scope.updateConnector();

  }


  $scope.liveConnector = {active : false , x1 : 1100 , y1 : 300 , x2 : 1200 , y2 : 400 , w : 0 , h : 0 , b11 : false , b12: false , b13 : true , b14 : true , b21 : true , b22 : true , b23 : false , b24 : false , pivotx : 1100 , pivoty : 300 , connectx : 0 , connecty : 0 , deg : 90 , br1 : 'top-left' , br2 : 'top-left' , optx : 0 , opty : 0, showOpt : false , color : null , currentStep : null, variables : []}

  $scope.startConnector = function(evt , b , c , color, ind , bind) {
    console.log(b);
    console.log(c);
    console.log(ind);
    console.log(bind);

    b.height = $( '#draggable' + b.id ).height();
    b.width = $( '#draggable' + b.id ).width();

    console.log(b);

    $scope.liveConnector = {active : true , x1 : 1100 , y1 : 300 , x2 : 1200 , y2 : 400 , w : 0 , h : 0 , b11 : false , b12: false , b13 : true , b14 : true , b21 : true , b22 : true , b23 : false , b24 : false , pivotx : b.newx+b.width/2 , pivoty : b.newy+b.height/2 , connectx : 0 , connecty : 0 , deg : 90 , br1 : 'top-left' , br2 : 'top-left', optx : 0 , opty : 0, showOpt : false , fromBlock : b , color : color, connection : c , fromBlockInd : bind , connectionIndex : ind}
  }

  $scope.savePositions = function() {
    $http({method : 'PATCH' , url : '/api/chatbot/intentView/0/' , data : {action : 'updatePosition' , blocks : $scope.blocks}}).
    then(function(response) {
      $scope.liveConnector.moved = false;
    })
  }

  $scope.mouseUpShowOptions = function(evnt) {
    // evnt.stopPropagation()
    console.log($scope.liveConnector);
    if ($scope.blocks == undefined) {
      return;
    }

    var to = null;
    for (var i = 0; i < $scope.blocks.length; i++) {
      if ($scope.liveConnector.fromBlock != undefined && $scope.blocks[i].hovering && $scope.liveConnector.fromBlock.id != $scope.blocks[i].id) {
        // console.log( 'to',  $scope.blocks[i]);
        to = $scope.blocks[i].id;

        // break;
      }
    }
    // console.log(to , "to this block");
    if ($scope.liveConnector.active && to == null) {

      $scope.liveConnector.active = false;
      $scope.liveConnector.showOpt = true;
      $scope.liveConnector.optx = evnt.pageY;
      $scope.liveConnector.opty = evnt.pageX;

      $timeout(function() {
        $('#optionsDropdown').click()
      },100)
      // $scope.liveConnector.connection.show = true;
    }

    if ($scope.liveConnector.active && to != null) {
      // $scope.liveConnector.active = false;
      $scope.liveConnector.showOpt = false;

      if (to == $scope.liveConnector.fromBlock.id ) {
        return;
      }

      var conn = $scope.blocks[$scope.liveConnector.fromBlockInd].connections[$scope.liveConnector.connectionIndex];


      $http({method : 'PATCH' , url : '/api/chatbot/intentView/' + conn.pk + '/' , data : {action : 'addConnection' , to : to}}).
      then(function(response) {
        conn.to = response.data.to;
      })




      $timeout(function() {
        $scope.updateConnector();
      },200)

      console.log($scope.liveConnector);
    }else{
      $scope.savePositions();
    }


  }


  $scope.viewContext = function(){
    $aside.open({
      templateUrl: '/static/ngTemplates/device.variables.html',
      placement: 'bottom',
      size: 'md',
      backdrop: false,
      controller: function($scope , $http , $uibModalInstance) {


      var uid = getCookie("uid");

      $scope.getAll = function(){
        $http({method : 'GET' , url : '/api/chatbot/getAllVariables/?id='+INTENT_ID+'&uid='+uid}).
        then(function(response) {
          $scope.allData = response.data
        })
      }
      $scope.getAll()
      $scope.reset = function(){
        $scope.form = {
          key:'',
          typ:'',
          value:'',
          can_change:false
        }
      }

      $scope.close = function(){
         $uibModalInstance.dismiss()
      }

      $scope.add = function(){
        if ($scope.form.key == undefined || $scope.form.key == null || $scope.form.key.length == 0 ) {
            Flash.create('warning' , 'Add Key')
            return
        }
        if ($scope.form.typ == undefined || $scope.form.typ == null || $scope.form.typ.length == 0 ) {
            Flash.create('warning' , 'Add Type')
            return
        }
        if ($scope.form.value == undefined || $scope.form.value == null || $scope.form.value.length == 0 ) {
            Flash.create('warning' , 'Add Value')
            return
        }
        var dataToSave = $scope.form
        dataToSave.nodeBlock = parseInt(INTENT_ID)
        $http({method : 'POST' , url : '/api/chatbot/variableContext/' , data : dataToSave}).
        then(function(response) {
          $scope.allData.dynamicVariables.push(response.data)
          $scope.reset()
        })
      }
      }
    })


  }
  $scope.mouseMoved = function(evnt) {
    // console.log(evnt);

    if (!$scope.liveConnector.active) {
      return;
    }

    var raww = ($scope.liveConnector.pivotx - evnt.pageX)/2;
    var rawh = ($scope.liveConnector.pivoty - evnt.pageY)/2;

    $scope.liveConnector.connectx = $scope.liveConnector.pivotx - raww;
    $scope.liveConnector.connecty = $scope.liveConnector.pivoty - rawh;


    if (raww >0 && rawh>0) {
      // console.log("first");
      var w = Math.abs(raww);
      var h = Math.abs(rawh);

      $scope.liveConnector.w = w;
      $scope.liveConnector.h = h;

      $scope.liveConnector.x2 = evnt.pageX;
      $scope.liveConnector.y2 = evnt.pageY;

      $scope.liveConnector.x1 = $scope.liveConnector.pivotx - w -2;
      $scope.liveConnector.y1 = $scope.liveConnector.pivoty-h;

      $scope.liveConnector.b21 =true;
      $scope.liveConnector.b22 =true;
      $scope.liveConnector.b23 =false;
      $scope.liveConnector.b24 =false;

      $scope.liveConnector.b11 =false;
      $scope.liveConnector.b12 =false;
      $scope.liveConnector.b13 =true;
      $scope.liveConnector.b14 =true;

      $scope.liveConnector.deg = -90;

      $scope.liveConnector.br2 = 'top-right';
      $scope.liveConnector.br1 = 'bottom-left';

    }else if (raww >0 && rawh<0) {
      // console.log("second");
      var w = Math.abs(raww);
      var h = Math.abs(rawh);

      $scope.liveConnector.w = w;
      $scope.liveConnector.h = h;

      $scope.liveConnector.x2 = evnt.pageX;
      $scope.liveConnector.y2 = evnt.pageY-h-2;

      $scope.liveConnector.x1 = $scope.liveConnector.pivotx-w-2;
      $scope.liveConnector.y1 = $scope.liveConnector.pivoty;


      $scope.liveConnector.b21 =false;
      $scope.liveConnector.b22 =true;
      $scope.liveConnector.b23 =true;
      $scope.liveConnector.b24 =false;

      $scope.liveConnector.b11 =true;
      $scope.liveConnector.b12 =false;
      $scope.liveConnector.b13 =false;
      $scope.liveConnector.b14 =true;

      $scope.liveConnector.deg = 90;

      $scope.liveConnector.br2 = 'bottom-right';
      $scope.liveConnector.br1 = 'top-left';

    }else if (raww <0 && rawh<0) {
      // console.log("third");

      var w = Math.abs(raww);
      var h = Math.abs(rawh);

      $scope.liveConnector.w = w;
      $scope.liveConnector.h = h;

      $scope.liveConnector.x1 = $scope.liveConnector.pivotx;
      $scope.liveConnector.y1 = $scope.liveConnector.pivoty;

      $scope.liveConnector.x2 = evnt.pageX-w-2;
      $scope.liveConnector.y2 = evnt.pageY-h-2;

      $scope.liveConnector.b21 =false;
      $scope.liveConnector.b22 =false;
      $scope.liveConnector.b23 =true;
      $scope.liveConnector.b24 =true;

      $scope.liveConnector.b11 =true;
      $scope.liveConnector.b12 =true;
      $scope.liveConnector.b13 =false;
      $scope.liveConnector.b14 =false;

      $scope.liveConnector.deg = 90;

      $scope.liveConnector.br2 = 'bottom-left';
      $scope.liveConnector.br1 = 'top-right';

    }else{
      // console.log("fourth");

      var w = Math.abs(raww);
      var h = Math.abs(rawh);

      $scope.liveConnector.w = w;
      $scope.liveConnector.h = h;


      $scope.liveConnector.x1 =  $scope.liveConnector.pivotx;
      $scope.liveConnector.y1 =  $scope.liveConnector.pivoty-h-2;


      $scope.liveConnector.x2 = evnt.pageX-w-2;
      $scope.liveConnector.y2 = evnt.pageY-2;

      $scope.liveConnector.b21 =true;
      $scope.liveConnector.b22 =false;
      $scope.liveConnector.b23 =false;
      $scope.liveConnector.b24 =true;

      $scope.liveConnector.b11 =false;
      $scope.liveConnector.b12 =true;
      $scope.liveConnector.b13 =true;
      $scope.liveConnector.b14 =false;

      $scope.liveConnector.deg = -90;

      $scope.liveConnector.br2 = 'top-left';
      $scope.liveConnector.br1 = 'bottom-right';


    }






    // $scope.liveConnector.x1 = evnt.pageX;
    // $scope.liveConnector.y1 = evnt.pageY;


  }


  $scope.addBlock = function(indx , evnt , typ) {
    // console.log(evnt);
    evnt.stopPropagation()
    var from = $scope.liveConnector.fromBlock;

    $scope.liveConnector.showOpt = false;


    var posx = $scope.liveConnector.opty;
    var posy = $scope.liveConnector.optx;
    var label = "User Input";
    var color = "#424242";
    var icon = null;

    if (typ == 'getEmail') {
      label = "User Input";
      color = "#607d8b";
      icon = null;
    }else if (typ == 'getMobile') {
      label = "User Input";
      color = "#607d8b";
      icon = null;
    }else if (typ == 'getDate') {
      label = "User Input";
      color = "#607d8b";
      icon = null;
    }else if (typ == 'invokeUiPath') {
      label = "User Input";
      color = "rgb(250, 70, 22)";
      icon = "/static/images/uipath.png";
    }else if (typ == 'giveChoices') {
      label = "User Input";
      color = "#ff5722";
      icon = null;
    }else if (typ == 'addCondition') {
      label = "System";
      color = "#607d8b";
      icon = null;
    }else if (typ == 'runPython') {
      label = "User Input";
      color = "rgb(248, 183, 33)";
      icon = '/static/images/python.png';
    }else if (typ == 'sendMessage') {
      label = "System";
      color = "#616161";
      icon = null;
    }else if (typ == 'getFile') {
      label = "User Input";
      color = "#d81b60";
      icon = null;
    }else if (typ == 'getInput') {
      label = "User Input";
      color = "#0097a7";
      icon = null;
    }else if (typ == 'transfer') {
      label = "System";
      color = "#ff6f00";
      icon = null;
    }else if (typ == 'askForPermission') {
      label = "Authorization";
      color = "#ff6f00";
      icon = null;
    }else if (typ == 'end') {
      label = "End";
      color = "#f41919";
      icon = null;
    }else if (typ == 'resume') {
      label = "Resume";
      color = "orange";
      icon = null;
    }

    var failResponse = 'Opps... I could not get it';
    var nodeResponse = 'Thanks';

    var block = null;
    if (typ == 'end') {
      block ={
        "name": "",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
        ]
      }
    }else if (typ == 'getName') {
      block ={
        failResponse : failResponse,
        nodeResponse : nodeResponse,
        auto_response : 'May I have your name please ?',
        context_key : 'name',
        exampleInput : 'My name is John Doe',
        "name": "Ask for Name",
        "description": "NLP based name extractor",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'getEmail') {
      block = {
        failResponse : failResponse,
        nodeResponse : nodeResponse,
        auto_response : 'please let me know youe email id',
        context_key : 'email',
        exampleInput : 'user@example.com',
        "name": "Ask for Email",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ],
        pre_validation_code : 'def sendOTP(email , otp):\n    # please write your OTP sending mechanism\n    return'
      }
    }else if (typ == 'getMobile') {
      block = {
        failResponse : failResponse,
        nodeResponse : nodeResponse,
        auto_response : 'Can I have your mobile number please',
        context_key : 'mobile',
        exampleInput : '0000000000',
        "name": "Ask for a Number",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ],
        pre_validation_code : 'def sendOTP(mobile , otp):\n    # please write your OTP sending mechanism\n    return'
      }
    }else if (typ == 'getDate') {
      block = {
        "name": "Ask a date",
        "description": "Ask for a date from user",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'invokeUiPath') {
      block = {
        "name": "Invoke UIPath Process",
        "description": "Add job to the orchestrator queue",
        auto_response : 'Working on it...',
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'presentCatalog') {
      block = {
        "name": "Present Catalog Products",
        "description": "Shows a clicable products catalog",
        auto_response : 'Please select one of these options', // can we save the PK of the catalog here
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
        ]
      }
    }else if (typ == 'giveChoices') {
      block = {
        "name": "Chose one from many",
        blockType : typ,
        auto_response : 'Please choose one of these items',
        "description": "Based on user's choice",
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'option' , connected : false , condition : 'Choice 1'},
          {callbackName : 'option' , connected : false , condition : 'Choice 2'}
        ]
      }
    }else if (typ == 'addCondition') {
      block = {
        "name": "Conditional Switch",
        blockType : typ,
        "description": "Based on expression switch case",
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'runPython') {
      block = {
        "name": "Run Python code",
        "description": "Python code",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'sendMessage') {
      block = {
        "name": "Send a text/image in a message",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
        ]
      }
    }else if (typ == 'getFile') {
      block = {
        failResponse : failResponse,
        nodeResponse : nodeResponse,
        auto_response : 'Please share a file',
        context_key : 'file',
        "name": "Request one / multiple files",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'getInput') {
      block = {
        "name": "Ask user any input",
        "description": "Raw input",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        custom_process_code : 'def extract(txt , nlpResult):\n    return txt',
        connections : [
          {callbackName : 'success' , connected : false },
          {callbackName : 'failure' , connected : false }
        ]
      }
    }else if (typ == 'transfer') {
      block = {
        "name": "Transfer the chat to a Human",
        "description": "",
        auto_response : 'Please wait, While I transfer you to an agent',
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'next' , connected : false },
        ]
      }
    }else if (typ == 'askForPermission') {
      block = {
        "name": "Ask confirmation to proceed",
        "description": "ask confirmation",
        auto_response : 'Can I proceed with your request',
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : [
          {callbackName : 'Confirmed' , connected : false },
          {callbackName : 'Denied' , connected : false },
          {callbackName : 'Edit Details' , connected : false }
        ]
      }
    }else if (typ == 'resume') {
      block ={
        "name": "",
        "description": "",
        blockType : typ,
        "label": label,
        "color": color,
        "icon": icon,
        "newx": posx,
        "newy": posy,
        parent : $scope.parentID,
        connections : []
      }
    }

    block.parent = $scope.intentID;
    block.connection = $scope.liveConnector.connection.pk;
    $http({method : 'POST' , url : '/api/chatbot/intentView/0/' , data : block}).
    then(function(response) {
      $scope.blocks.push(response.data);

      $scope.liveConnector.connection.to = response.data.id;

      $timeout(function() {
        var i = $scope.blocks.length -1;
        var elem = $('#draggable'+$scope.blocks[i].id)

        elem.css({top:$scope.blocks[i].newy + "px" , left: $scope.blocks[i].newx +"px" })

        elem.draggable({ handle:'.handle', drag: function(evt) {
          offsets = $( '#' + evt.target.id).offset();
          for (var i = 0; i < $scope.blocks.length; i++) {
            if ($scope.blocks[i].id == parseInt( evt.target.id.replace('draggable', '')) ) {
              $scope.blocks[i].newx = offsets.left;
              $scope.blocks[i].newy = offsets.top;
            }
          }
          $scope.updateConnector()
        }});

        $timeout(function() {
          $scope.updateConnector();
        },300)

      },200)


    })

    $timeout(function() {
      $('#optionsDropdown').click()
    },100)

  }

  $scope.addVariableToMessage = function(choice , indx) {
    $scope.blocks[indx].auto_response += ' {{'+ choice +'}} ';
    $scope.saveMessage($scope.blocks[indx])
  }


  $scope.getVariables = function() {

    if ($scope.liveConnector.variables == undefined) {
      $scope.liveConnector.variables = [];
    }


    for (var i = 0; i < $scope.blocks.length; i++) {
      if ($scope.blocks[i].context_key && $scope.liveConnector.variables.indexOf($scope.blocks[i].context_key) == -1 ) {
        $scope.liveConnector.variables.push($scope.blocks[i].context_key)
      }
    }
  }


  $scope.playOnWeb = function() {
    $scope.showErrorMsg = false;
    $http({method : 'GET' , url : '/api/chatbot/nodeselectionsvariations/?limit=1&parent=' + $scope.intentID }).
    then(function(response) {
      $scope.liveConnector.currentStep = null;
      for (var i = 0; i < $scope.blocks.length; i++) {
        $scope.blocks[i].backgroundColor = 'white';
      }
      CHATTER_FUNCTION.openChat()
      CHATTER_FUNCTION.sendCustomMessage(response.data.results[0].txt , false , false)

    })



  }

  $scope.playOnDevice = function(device) {
    $aside.open({
      templateUrl: '/static/ngTemplates/device.instructions.html',
      placement: 'left',
      size: 'md',
      backdrop: true,
      resolve : {
        device : function() {
          return device;
        }
      },
      controller: function($scope , $http , $uibModalInstance, device) {
        $scope.device = device;
        $scope.data = {number : '' , success : false };
        $scope.sendLink = function() {
          $http({method : 'GET' , url : '/api/chatbot/sendAppLink/?mob=' + $scope.data.number + '&device=' + $scope.device }).
          then(function(response) {
            $scope.data.success = true;

            $http({method : 'POST' , url : '/api/chatbot/saveSettings/' , data : {type : 'whatsappTest' , whatsapp_test_number : $scope.data.number  }  }).
            then(function(response) {

            })


          })
        }

        // support.cioc.in||EUJbqOw66BQWaO6mSvQBtfDyg1f8yLkcbBA2VxGqDg||cioc||socket.syrow.com

        $http({method : 'GET' , url : '/api/chatbot/getAPIKey/'  }).
        then(function(response) {
          $scope.apiKey = response.data.key;
        })

        $http({method : 'GET' , url : '/api/chatbot/saveSettings/?type=whatsappTest'  }).
        then(function(response) {
          $scope.data.number = response.data.whatsapp_test_number;
        })




      }
    })
  }


  $http({method : 'GET' , url : '/api/chatbot/intentView/'+ $scope.intentID +'/'}).
  then(function(response) {
    $scope.blocks = response.data;

    for (var i = 0; i < $scope.blocks.length; i++) {
      $scope.blocks[i].backgroundColor = 'white';
      if ($scope.blocks[i].parent == null) {
        $scope.parentNode = $scope.blocks[i];
      }
    }

    $scope.initialize();
    if ($scope.blocks.length == 1) {
      $scope.openProperties(0);
    }
  })

  $scope.delete = function(indx) {
    $http({method : 'DELETE' , url : '/api/chatbot/intentView/' + $scope.blocks[indx].id +'/' }).
    then((function(indx) {
      return function(response) {
        var id = $scope.blocks[indx].id;
        $scope.blocks.splice(indx , 1);

        for (var i = 0; i < $scope.blocks.length; i++) {
          for (var j = 0; j < $scope.blocks[i].connections.length; j++) {
            if ($scope.blocks[i].connections[j].to == id) {
              $scope.blocks[i].connections[j].to = null;
            }
          }
        }

        $scope.clickingAnywhere();
      }
    })(indx))
  }

  $scope.updateConnector = function() {


    for (var j = 0; j < $scope.blocks.length; j++) {
      var conns = $scope.blocks[j].connections;


      for (var i = 0; i < conns.length; i++) {

        if (conns[i].to == null) {
          continue;
        }

        p1 = getElementCenter($('#draggable'+ $scope.blocks[j].id  ))
        p2 = getElementCenter($('#draggable' + conns[i].to ))

        var arrowElem = $('#arrow'+ $scope.blocks[j].id +'-'+ conns[i].to)
        var labelElem = $('#label'+ $scope.blocks[j].id +'-'+ conns[i].to)
        var connectorDim = getConnectorDimension(p1 , p2, arrowElem , labelElem)
        var connector = $('#connector'+ $scope.blocks[j].id +'-'+ conns[i].to)

        connector.css({top: connectorDim.y, left: connectorDim.x, width: connectorDim.w , height: connectorDim.h});

        connector.css(connectorDim.css)
      }


    }



  }

  $scope.initialize = function() {
    $timeout(function() {
      $('body').attr("spellcheck",false)

      for (var i = 0; i < $scope.blocks.length; i++) {
        var elem = $('#draggable'+$scope.blocks[i].id)

        elem.css({top:$scope.blocks[i].newy + "px" , left: $scope.blocks[i].newx +"px" })

        elem.draggable({handle:'.handle', drag: function(evt) {
          offsets = $( '#' + evt.target.id).offset();
          for (var i = 0; i < $scope.blocks.length; i++) {
            if ($scope.blocks[i].id == parseInt( evt.target.id.replace('draggable', '')) ) {
              $scope.blocks[i].newx = offsets.left;
              $scope.blocks[i].newy = offsets.top;
            }
          }

          $scope.updateConnector()
        }});

      }

      $scope.updateConnector()
      $('#loader').css({display:'none'})

    },1000)
  }


  // $scope.initialize();

});
