var app = angular.module('smack', ['ngRoute', 'ngCookies'])

app.config(function($routeProvider){
  $routeProvider
  //root route= find team (from find team can redirect to a logged in team)
  .when('/',{
    templateUrl:'partials/findteam.html',
    controller:'findTeamController'
  })
  //login to team
  .when('/:teamURL',{
    templateUrl:'partials/login.html',
    controller:'loginController'
  })
  //the APP
  .when('/:teamURL/messages',{
    templateUrl:'partials/messages.html',
    controller:'messagesController'
  })
  .otherwise({
    redirectTo:'/'
  });
});

module.exports = app
