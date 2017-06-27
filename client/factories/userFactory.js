module.exports = function (app) {
  app.factory("loginFactory", function ($http) {

    var factory = {};
    factory.teamURL = null;
    factory.currentUser = null;

    //hits api and returns a team url if exists else sends back error
    factory.findTeam = function (team, callback, errorHandler) {
      var URL = team.URL;
      $http.post('/api/teams/' + URL).then(function (response) {
        console.log(response);
        if (!response.data.errors) {
          factory.teamURL = response.data.URL;
          callback(factory.teamURL);
        } else {
          errorHandler(response.data.errors);
        }
      });
    }

    // index: Retrieve all 
    factory.getCurrentUser = function (callback) {
      callback(factory.currentUser);
      console.log(factory.currentUser);
    }
    factory.login = function (user, currentTeamURL, callback, errorHandler) {
      $http.post("/api/teams/" + currentTeamURL + "/login", user).then(function (response) {
        console.log(response);
        if (!response.data.errors) {
          factory.currentUser = response.data.user;
          factory.getCurrentUser(callback);
        } else {
          errorHandler(response.data.errors);
        }
      });
    }

    return factory;
  });

}

