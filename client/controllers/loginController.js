module.exports = function (app) {
  app.controller('loginController', function ($scope, userFactory, teamFactory, $location, $cookies, $routeParams) {
    console.log("reached controller");

    // -----------ADD CHECK IF PERSONA LOGGED in, if true, redirect---------------

    //ng-model persona which takes persona.email and persona.password
    $scope.persona = {};
    $scope.email = {};
    $scope.invite = {};
    $scope.password = {};
    $scope.foundEmail = null;
    $scope.foundEmailBool = false;
    $scope.validationErrors = null;
    $scope.successMessages = null;

    //url of the current team passed in from route params
    $scope.currentTeamURL = $routeParams.teamURL;
    console.log()
    //check if user is logged in
    var currentPersonaId = $cookies.get('currentPersonaId');
    if (currentPersonaId) {
      $location.path("/" + $scope.currentTeamURL + "/messages");

    } else {

    }

    //sets errors into scope for display in view
    var errorHandler = function (error) {
      $scope.validationErrors = error;
      console.log(error);
    }
    // set persona id into scope.
    function setCurrentPersona(currentPersona) {
      $cookies.put('currentPersonaId', currentPersona._id);
      $location.path("/" + $scope.currentTeamURL + "/messages");
    }

    //FIRST TO HAPPEN
    $scope.checkEmail = function () {
      if (!teamFactory.checkEmail($scope.persona.email)) {
        $scope.validationErrors = "Email not found, please ask for an invite";
      } else {
        $scope.foundEmail = $scope.email;
        if (!teamFactory.currentPersona.password || !teamFactory.currentPersona.username) {
          $('#myModal').modal('show');
        } else {
          $scope.foundEmailBool = true;
          $scope.successMessages = "Found Email Match, please enter your password";
          $scope.validationErrors = null;

        }
      }
    }

    //AFTER SUCCESSFUL CHECK OF EMAIL AND PASSWORD CREATION
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
      $scope.persona.personaId = teamFactory.currentPersona._id
      console.log($scope.persona);
      userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
    }

    var modalCloser = function () {
      $('#myModal').modal('hide');
    }


    //AFTER SUCCESSFUL EMAIL CHECK IF NO PASSWORD
    $scope.createPassword = function () {
      var postData = { password: $scope.password.password }
      if ($scope.password.username) {
        postData.username = $scope.password.username
      }
      userFactory.createPassword(postData, modalCloser)
    }
    var inviteSuccess = function (result) {
      $scope.successMessages = result;
      console.log("created invite:", result)
    }
    $scope.invite = function () {
      teamFactory.invite($scope.invite.email, $scope.currentTeamURL, inviteSuccess, errorHandler);
    }


  })

}
