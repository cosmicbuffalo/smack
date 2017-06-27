
module.exports = function (app) {
  app.controller('findTeamController', function ($scope, userFactory, $location, $cookies) {
    console.log("reached findTeamController");
    $scope.team = {};
    $scope.validationErrors = null;

    //set cookies
    var currentUserId = $cookies.get('currentUserId');
    var currentTeamURL = $cookies.get('currentTeamURL');
    //if cookies for user team, send to team main page
    if (currentTeamURL && currentUserId) {
      $location.path("/" + currentTeamURL + "/");
      $scope.currentUser = currentUserId;
    }
    else if (currentTeamURL && !currentUserId) {
      $location.path("/" + currentTeamURL);
    }
    //maybe add if currentuser but no currentteam, show teams and suggest logging in or finding new team
    else if (!currentTeamURL && !currentUserId) {
      //do nothing and stay on find team page
    } else {
      //do nothing and stay on find team page
    }

    //handles error coming from database and sets into scope
    var errorHandler = function (errors) {
      $scope.validationErrors = errors;
      console.log(errors);
    }
    //if team exists in db, set redirect to team url
    function setTeam(teamURL) {
      $cookies.put('currentTeamURL', teamURL);
      $location.path("/" + teamURL);
    }
    //check db if team exists
    $scope.findTeam = function () {
      userFactory.findTeam($scope.team, setTeam, errorHandler)
    }
  })
}

