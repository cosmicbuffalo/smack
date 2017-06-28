module.exports = function(app){
  app.controller('loginController', function ($scope, userFactory, $location, $cookies,$routeParams) {
    console.log("reached controller");
  
  // -----------ADD CHECK IF PERSONA LOGGED in, if true, redirect---------------

  //ng-model persona which takes persona.email and persona.password
  $scope.persona = {};
  //url of the current team passed in from route params
  $scope.currentTeamURL = $routeParams.teamURL;

  //sets errors into scope for display in view
  var errorHandler = function (errors) {
    $scope.validationErrors = errors;
    console.log(errors);
  }
  // set persona id into scope.
  function setCurrentPersona(currentPersona) {
    $cookies.put('currentPersonaId', currentPersona._id);
    $location.path("/" + $scope.currentTeamURL + "/messages");
  }

  $scope.findEmail = function () {
    
  }

  //login persona to TEAM 
  $scope.login = function () {
    //angular stuff to only fire off the function if the form is valid and submitted. could be tweaked
    $scope.submitted = true;
    if ($scope.loginForm.$valid) {
      console.log($scope.persona);
      userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
    } else {
      console.log("didnt pass ng validations ")
    }
  }
})

}