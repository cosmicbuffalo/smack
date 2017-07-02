
module.exports = function (app) {
  app.controller('findTeamController', function ($scope, userFactory, teamFactory, $location, $cookies, $route) {
    console.log("reached findTeamController");
    //ng-model team from view
    $scope.team = {};
    //ng-model newteam for createteam
    $scope.newTeam = {};
    //validation error from error handler
    $scope.validationErrors = null;
    $scope.successMessages = null;
    //array of logged in team urls to create links in view
    $scope.loggedInTeams = [];



    //handles error coming from database and sets into scope
    var errorHandler = function (errors) {
      $scope.validationErrors = errors;
      //maybe reload page?
      console.log(errors);
    }

    //if team exists in db, set redirect to team url
    function setTeam(team) {
      console.log("teamURL: ", team.url)
      if (team.url) {
        console.log("CHANNEL ID: ", team.channels[0]._id)
        $cookies.put("currentChannelId", team.channels[0]._id)
        $cookies.put("currentTeamURL", team.url)
        $location.path("/" + team.url);
      } else {
        console.log("team not found");
      }

    }

    var currentTeamURL = $cookies.get('currentTeamURL');
    //check db if team exists
    $scope.findTeam = function () {
      if (!currentTeamURL) {
        teamFactory.getTeam($scope.team, setTeam, errorHandler);
      } else {
        if (currentTeamURL === $scope.team.url) {
          $location.path("/" + currentTeamURL);
        }
      }
      teamFactory.getTeam($scope.team, setTeam, errorHandler)

    }
    //this function is specific to the invite that happens when team is created as it waits for the invite to happen and then calls create team
    var inviteSuccess = function (result) {
      $scope.findTeam();
      $scope.successMessages = result;
      console.log("created invite:", result)
    }
    var successHandler = function (team) {
      teamFactory.invite($scope.newTeam.email, $scope.newTeam.url, inviteSuccess, errorHandler);
      $scope.team = team;
      console.log("after created team", team);
    }
    $scope.createTeam = function () {
      $scope.newTeam.url = $scope.newTeam.name.replace(/ /g, '').toLowerCase();
      teamFactory.createTeam($scope.newTeam, successHandler, errorHandler);
    }
  })
}
