module.exports = function (app) {
  app.controller('loginController', function ($scope, userFactory, teamFactory, $location, $cookies, $routeParams) {
    console.log("reached login controller");

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
    //check if user is logged in and redirect if yes
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
      console.log("Entered set current persona in login controller")
      console.log("RECEIVED PERSONA: ", currentPersona)
      console.log("SETTING ID TO COOKIE currentPersonaId: ", currentPersona._id)
      $cookies.put('currentPersonaId', currentPersona._id);
      $cookies.remove('personaIdLogin')
      console.log("Removed personaIdLogin Cookie")
      console.log("Redirecting...", "/" + $scope.currentTeamURL + "/" + $cookies.get('currentChannelId'))
      $location.path("/" + $scope.currentTeamURL + "/" + $cookies.get('currentChannelId'));
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
      $scope.persona.personaId = $cookies.get('personaIdLogin')
      console.log("POST DATA FOR LOGIN: ", $scope.persona);
      userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
    }

    var modalCloser = function () {
      $('#myModal').modal('hide');
      $scope.foundEmailBool = true;
    }


    //AFTER SUCCESSFUL EMAIL CHECK IF NO PASSWORD
    $scope.createPassword = function () {
      console.log("Entered Create Password function")
      var postData = { password: $scope.password.password }
      if ($scope.password.username) {
        postData.username = $scope.password.username
      }
      console.log("POST DATA TO SEND TO CREATE PASSWORD: ", postData)
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
