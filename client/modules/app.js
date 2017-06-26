
var app = angular.module('smack', ['ngRoute', 'ngCookies'])

app.config(function($routeProvider){
  $routeProvider
  .when('/home',{
    templateUrl:'partials/login.html',
    controller:'usersController'
  })
  .otherwise({
    redirectTo:'/login'
  });
});

module.exports = app
