module.exports = function(app){
  app.controller('loginController', function ($scope, userFactory, $location, $cookies,$routeParams) {
    console.log("reached controller");

    $scope.user = {};


    var currentTeamURL = $routeParams.teamURL;

    var errorHandler = function (errors) {
        $scope.validationErrors = errors;
        console.log(errors);
    }

    function setCurrentUser(currentUser) {
        $cookies.put('currentUserId', currentUser._id);
        $location.path("/" + currentTeamURL + "/success");

    }

    $scope.getCurrentUser = function () {
        console.log("reached scope.index");
        userFactory.getCurrentUser(setCurrentUser);
    }

    $scope.login = function () {
        $scope.submitted = true;
        if ($scope.loginForm.$valid) {
            console.log($scope.user);
            loginFactory.login($scope.user, currentTeamURL, setCurrentUser, errorHandler);
        } else {
            console.log("didnt pass ng validations ")
        }
    }
})

}