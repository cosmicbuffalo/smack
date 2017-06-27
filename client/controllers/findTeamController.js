
module.exports = function (app) {
  app.controller('findTeamController', function ($scope, userFactory, $location, $cookies) {
    console.log("reached findTeamController");
    //ng-model team from view
    $scope.team = {};
    //validation error from error handler
    $scope.validationErrors = null;
    //array of logged in team urls to create links in view
    $scope.loggedInTeams = [];


    //handles error coming from database and sets into scope
    var errorHandler = function (errors) {
        $scope.validationErrors = errors;
        //maybe reload page?
        console.log(errors);
    }
    //if team exists in db, set redirect to team url
    function setTeam(teamURL) {
        $location.path("/" + teamURL);
    }
    //check db if team exists
    $scope.findTeam = function () {
      userFactory.findTeam($scope.team, setTeam, errorHandler)
    }
  })
}

