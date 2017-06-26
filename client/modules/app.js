
var app = angular.module('smack', ['ngRoute', 'ngCookies'])

app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'partials/findteam.html',
    controller:'findTeamController'
  })
  .when('/:teamURL',{
    templateUrl:'partials/login.html',
    controller:'loginController'
  })
  .otherwise({
    redirectTo:'/'
  });
});

module.exports = app
