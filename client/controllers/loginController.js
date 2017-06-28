module.exports = function (app) {
  app.controller('loginController', function ($scope, userFactory, teamFactory, $location, $cookies, $routeParams) {
    console.log("reached controller");

    // -----------ADD CHECK IF PERSONA LOGGED in, if true, redirect---------------

    //ng-model persona which takes persona.email and persona.password
    $scope.persona = {};
    $scope.email = {};
    $scope.password = {};
    $scope.foundEmail = null;
    $scope.validationErrors = null;

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

    $scope.checkEmail = function () {
      if (!teamFactory.checkEmail($scope.persona.email)) {
        $scope.validationErrors = "Email not found, please ask for an invite";
      } else {
        $scope.foundEmail = $scope.email;
        if (teamFactory.currentPersona.password) {

        } else {
          $('#myModal').modal('show');
        }
      }
    }

    //login persona to TEAM
    $scope.login = function () {
      //angular stuff to only fire off the function if the form is valid and submitted. could be tweaked
      // $scope.submitted = true;
      // if ($scope.loginForm) {
      //   console.log($scope.persona);
      //   userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
      // } else {
      //   console.log("didnt pass ng validations ")
      // }
      console.log($scope.persona);
      userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
    }
    $scope.createPassword = function () {
      $('#myModal').modal('hide');
      factory.createPassword($scope.password.password, errorHandler)


    }
    // $(document).ready(function () {
      // $('#myModal').modal();
    // })

  })

}
