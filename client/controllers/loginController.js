smack.controller('loginController', function ($scope, userFactory, $location, $cookies) {
    console.log("reached controller");

    $scope.user = {};


    var errorHandler = function (errors) {
        $scope.validationErrors = errors;
        console.log(errors);
    }
    function setCurrentUser(currentUser) {
        $cookies.put('currentUser', JSON.stringify(currentUser));
        $location.path("/" );

    }
    $scope.getCurrentUser = function () {
        console.log("reached scope.index");
        loginFactory.getCurrentUser(setCurrentUser);
    }

    $scope.login = function () {
        $scope.submitted = true;
        if ($scope.loginForm.$valid) {
            console.log($scope.user);
            loginFactory.login($scope.user, setCurrentUser, errorHandler);
        } else {
            console.log("didnt pass ng validations ")
        }
    }
})