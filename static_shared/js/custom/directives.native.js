app.directive('futureDatepicker', ['$parse', function ($parse) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/static/ngTemplates/futureDatepicker.html',
    scope: {
      date: '=',
      cls : '='
    },
    controller: function($scope, $state, $stateParams , $filter) {
      if (typeof $scope.date == 'string') {
        $scope.date = new Date($scope.date)
      }
      console.log($scope.cls);
      $scope.checkDate = function(dt1 , dt2) {
        if (dt1.toISOString().split('T')[0] == dt2.toISOString().split('T')[0]  ) {
          return true;
        }else{
          return false;
        }
      }

      $scope.today = new Date()
      $scope.tomorrow = new Date($scope.today)
      $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1)
      console.log($scope.date);
      var today = new Date();
      var lastday = today.getDate() - (today.getDay() - 1) + 5;
      $scope.weekend = new Date(today.setDate(lastday));
      $scope.$watch('date' , function(newValue , oldValue) {
        if ( $scope.checkDate($scope.date , $scope.today) ) {
          $scope.dateStr = "Today"
        }else if ( $scope.checkDate($scope.date , $scope.tomorrow)) {
          $scope.dateStr = "Tomorrow"
        }else if ( $scope.checkDate($scope.date , $scope.weekend)) {
          $scope.dateStr = "Weekend"
        }else{
          $scope.dateStr = $filter('date')($scope.date, "dd MMM yyyy");
        }
      })
    }
  };
}]);


app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


app.directive('filesModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.filesModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files);
        });
      });
    }
  };
}]);


/*
This directive allows us to pass a function in on an enter key to do what we want.
 */

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

app.directive('focusMe', function($timeout) {
  // bring any input into focus based on the focus-me = "true" attribute
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) {
          element[0].focus();
          scope[attrs.focusMe] = false;
        }
      });
    }
  };
});
