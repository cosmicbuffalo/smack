var app = angular.module('smack', ['ngRoute', 'ngCookies', 'ngMessages'])

app.config(function($routeProvider){
  $routeProvider
  //root route= find team (from find team can redirect to a logged in team)
  .when('/',{
    templateUrl:'partials/findteam.html',
    controller:'findTeamController'
  })
  .when('/createteam',{
    templateUrl:'partials/createteam.html',
    controller:'findTeamController'
  })
  //login to team
  .when('/:teamURL/',{
    templateUrl:'partials/login.html',
    controller:'loginController'
  })
  //invite to team
  .when('/:teamURL/invite',{
    templateUrl:'partials/invite.html',
    controller:'loginController'
  })
  //the APP
  .when('/:teamURL/:channelId',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .when('/:teamURL/messages',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .otherwise({
    redirectTo:'/'
  });
});

module.exports = app




//directive to compare passwords and confirm match
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);
