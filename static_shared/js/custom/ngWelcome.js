var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'mwl.confirm']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

//   $urlRouterProvider.otherwise('/home');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.withCredentials = true;


});


app.controller('main', function($scope, $state, $http, $timeout, $uibModal, $rootScope , $interval, ) {
    console.log('main');
    $scope.a = "dasdsa"
    $scope.logo = logo
    $scope.dependentDetails = dependentDetails
    $scope.msg = ''
    $scope.form = {
        displayPicture : null,
        localAddressStreet:'',
        permanentAddressStreet:'',
        localAddressPin:'',
        localAddressCity:'',
        localAddressState:'',
        localAddressCountry:'',
        permanentAddressPin:'',
        permanentAddressCity:'',
        permanentAddressState:'',
        permanentAddressCountry:'',
        pan:'',
        dateOfBirth:new Date(),
        gender:'M',
        bloodGroup:'',
        married: false,
        note1:'',
        emergency:'',
        contact:'',
        note1:'',
        note2:'',
        emergencyName:'',
        emergencyNumber:'',
        dependents : [
            {name : '' , dob : '' , relationship : 'father'},
            {name : '' , dob : '' , relationship : 'mother'},
            {name : '' , dob : '' , relationship : 'wife'},
            {name : '' , dob : '' , relationship : 'child'},
        ]
    }

    $scope.userPk = USER_PK
    console.log($scope.userPk , '$scope.userPk ');

    $http.get('/api/HR/getWelcomeDetails/').
    then(function(response) {
      $scope.form = response.data
      if ($scope.form.note2 == undefined || $scope.form.note2.length==0) {
        $scope.form.dependents = [
              {name : '' , dob : '' , relationship : 'father'},
              {name : '' , dob : '' , relationship : 'mother'},
              {name : '' , dob : '' , relationship : 'wife'},
              {name : '' , dob : '' , relationship : 'child'},
          ]
      }
      else{
        $scope.form.dependents = JSON.parse($scope.form.note2)
      }
      // console.log($scope.user,'$scope.user');
      // $scope.form.profile = $scope.user.profile
    })


    $scope.filePicker = function(){
        $('#filePicker').click()
    }




    $scope.$watch('form.displayPicture' , (newValue , oldValue)=>{
        console.log({newValue, oldValue})
        if (!newValue) {
            return
        }

        $scope.reader = new FileReader();

        $scope.reader.onload = function(e) {
            $('#preview').attr('src', e.target.result);
        }

        $scope.reader.readAsDataURL(newValue);



    })

    $scope.$watch('form.localAddressPin' , function(newValue , oldValue) {
        if (newValue.length==6) {
          $http({
            method: 'GET',
            url: '/api/ERP/genericPincode/?pincode=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.form.localAddressCity = response.data[0].city;
              $scope.form.localAddressState = response.data[0].state;
              $scope.form.localAddressCountry = response.data[0].country;
            }
          })
      }
    })

    $scope.$watch('form.permanentAddressPin' , function(newValue , oldValue) {
        if (newValue.length==6) {
          $http({
            method: 'GET',
            url: '/api/ERP/genericPincode/?pincode=' + newValue
          }).
          then(function(response) {
            if (response.data.length > 0) {
              $scope.form.permanentAddressCity = response.data[0].city;
              $scope.form.permanentAddressState = response.data[0].state;
              $scope.form.permanentAddressCountry = response.data[0].country;
            }
          })
      }
    })

    $scope.submit = function(){
      $scope.msg = ''
      $http({
        method: 'POST',
        url: '/api/HR/getWelcomeDetails/',
        data: {
        'submit':true
      }
      }).
      then(function(response) {
        window.location.href="/"
      });
    }

    $scope.saveUserDetails = function(){
      var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
      $scope.msg = ''
      if ($scope.form.localAddressStreet == null || $scope.form.localAddressStreet.length==0 ||$scope.form.permanentAddressStreet == null || $scope.form.permanentAddressStreet.length==0 || $scope.form.permanentAddressPin == null || $scope.form.permanentAddressPin.length==0 || $scope.form.localAddressPin == null || $scope.form.localAddressPin.length == 0 || $scope.form.pan == null || $scope.form.pan.length == 0 || $scope.form.dateOfBirth == null || $scope.form.dateOfBirth.length == 0 || $scope.form.PFUan == null || $scope.form.PFUan.length == 0 || $scope.form.gender == null || $scope.form.bloodGroup == null || $scope.form.married == null || $scope.form.note1 == null || $scope.form.note1.length == 0 || $scope.form.accountNumber == null || $scope.form.accountNumber.length == 0 || $scope.form.ifscCode == 0 || $scope.form.ifscCode.length == 0 || $scope.form.ifscCode == null || $scope.form.ifscCode.length == 0 || $scope.form.bankName == null || $scope.form.bankName.length == 0 || $scope.form.adhar == null || $scope.form.adhar.length == 0) {
        $scope.msg = 'All fields are required'
        return
      }
      if(regpan.test($scope.form.pan)){
        // valid pan card number
      } else {
         // invalid pan card number
         $scope.msg = 'Pan Number is invalid'
         return
      }

      if ($scope.form.accountNumber != $scope.form.reaccountNumber ) {
        $scope.msg = 'Account Number in both the field should be entered same'
        return
      }

      if ($scope.form.married == true) {
        if ($scope.form.anivarsary==null ||  $scope.form.anivarsary.length==0) {
          $scope.msg = 'All fields are required'
          return
        }
      }
      var fd = new FormData();
      if ($scope.form.displayPicture != null && typeof $scope.form.displayPicture == 'object'){
        fd.append("displayPicture", $scope.form.displayPicture)
      }
      if ($scope.form.localAddressStreet.length > 0){
        fd.append("localAddressStreet", $scope.form.localAddressStreet)
      }
      if ($scope.form.permanentAddressStreet.length > 0){
        fd.append("permanentAddressStreet", $scope.form.permanentAddressStreet)
      }
      if ($scope.form.permanentAddressPin.length > 0){
        fd.append("permanentAddressPin", $scope.form.permanentAddressPin)
      }
      if ($scope.form.localAddressPin.length > 0){
        fd.append("localAddressPin", $scope.form.localAddressPin)
      }
      if ($scope.form.permanentAddressCity.length > 0){
        fd.append("permanentAddressCity", $scope.form.permanentAddressCity)
      }
      if ($scope.form.localAddressCity.length > 0){
        fd.append("localAddressCity", $scope.form.localAddressCity)
      }
      if ($scope.form.permanentAddressState.length > 0){
        fd.append("permanentAddressState", $scope.form.permanentAddressState)
      }
      if ($scope.form.localAddressState.length > 0){
        fd.append("localAddressState", $scope.form.localAddressState)
      }
      if ($scope.form.permanentAddressCountry.length > 0){
        fd.append("permanentAddressCountry", $scope.form.permanentAddressCountry)
      }
      if ($scope.form.localAddressCountry.length > 0){
        fd.append("localAddressCountry", $scope.form.localAddressCountry)
      }
      if ($scope.form.pan.length > 0){
        fd.append("pan", $scope.form.pan)
      }
      if (typeof $scope.form.dateOfBirth  == 'object'){
        fd.append("dateOfBirth", $scope.form.dateOfBirth.toJSON().split('T')[0])
      }
      if ($scope.form.PFUan.length > 0){
        fd.append("PFUan", $scope.form.PFUan)
      }
      if ($scope.form.gender.length > 0){
        fd.append("gender", $scope.form.gender)
      }
      if ($scope.form.bloodGroup.length > 0){
        fd.append("bloodGroup", $scope.form.bloodGroup)
      }
      if ($scope.form.married.length > 0){
        fd.append("married", $scope.form.married)
      }
      if ($scope.form.note1.length > 0){
        fd.append("note1", $scope.form.note1)
      }
      // if ($scope.form.note2.length > 0){
      //   fd.append("note2", $scope.form.note2)
      // }
      if ($scope.form.accountNumber.length > 0){
        fd.append("accountNumber", $scope.form.accountNumber)
      }
      if ($scope.form.ifscCode.length > 0){
        fd.append("ifscCode", $scope.form.ifscCode)
      }
      if ($scope.form.bankName.length > 0){
        fd.append("bankName", $scope.form.bankName)
      }
      if ($scope.form.anivarsary!=null && typeof $scope.form.anivarsary  == 'object'){
        fd.append("anivarsary", $scope.form.anivarsary.toJSON().split('T')[0])
      }
      if ($scope.form.emergencyName.length > 0){
        fd.append("emergencyName", $scope.form.emergencyName)
      }
      if ($scope.form.emergencyNumber.length > 0){
        fd.append("emergencyNumber", $scope.form.emergencyNumber)
      }
      if ($scope.form.adhar.length > 0){
        fd.append("adhar", $scope.form.adhar)
      }


      for (var i = 0; i < $scope.form.dependents.length; i++) {
        if ($scope.form.dependents[i].dob.length>0 && typeof $scope.form.dependents[i].dob == 'object') {
          $scope.form.dependents[i].dob = $scope.form.dependents[i].dob.toJSON().split('T')[0]
        }
      }
      if ($scope.form.dependents.length > 0){
        fd.append("note2", JSON.stringify($scope.form.dependents))
      }
      $http({
        method: 'POST',
        url: '/api/HR/getWelcomeDetails/',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }).
      then(function(response) {
        $scope.submitForm = true
        console.log(response.data , 'profile data');
      });



    }



})
