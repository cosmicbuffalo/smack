smack.controller('findTeamController', function ($scope, userFactory, $location, $cookies) {
    console.log("reached findTeamController");
    $scope.team = {};
    $scope.validationErrors = null;

    //set cookies
    var currentUser = $cookies.get('currentUser');
    var currentTeam = $cookies.get('currentTeam');
    if (currentTeam && currentUser) {
        $location.path("/" + currentTeam + "/success");
        $scope.currentUser = JSON.parse(currentUser);
    }
    else if (currentTeam && !currentUser) {
        $location.path("/" + teamURL);
    }
    //maybe add if 
    else if (!currentTeam && !currentUser) {
        //do nothing and stay on find team page
    }

    //handles error coming from database and sets into scope
    var errorHandler = function (errors) {
        $scope.validationErrors = errors;
        console.log(errors);
    }
    //if team exists in db, set redirect to team url
    function setTeam(teamURL) {
        if (!team) {
            //reload and display error
        } else {
            $location.path("/" + teamURL);
        }
    }
    //check db if team exists
    $scope.findTeam = function () {
        userFactory.findTeam($scope.team, setTeam, errorHandler)
    }
})