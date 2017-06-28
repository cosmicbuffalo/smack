module.exports = function (app) {
  app.factory("userFactory", function ($http) {

  var factory = {};
  //gets set from findteam() if the team exists and gets sent to controller to confirm team existence 
  factory.teamURL = null;
  //holds currentPersona from getPersona()
  factory.currentPersona = null;

  //hits api and returns a team url if exists else sends back error
  factory.findTeam = function (team, callback, errorHandler) {
    var URL = team.URL;
    $http.get('/api/teams/' + URL).then(function (response) {
      console.log(response);
      if (!response.data.errors) {
        factory.teamURL = response.data.team.url;
        console.log("factory.teamURL: ", factory.teamURL);
        callback(factory.teamURL);
      } else {
        errorHandler(response.data.errors);
      }
    });
  }

  // controller method to get back persona data 
  factory.getPersona = function (currentPersonaId, callback, errorHandler) {
    $http.post("/api/personas/" + currentPersonaId).then(function (response) {
      console.log(response);
      if (!response.data.errors) {
        //get back all persona data and save to factory
        factory.currentPersona = response.data.persona;
        //send data back to controller to set to scope
        callback(factory.currentPersona);
      } else {
        errorHandler(response.data.errors);
      }
    });
    callback(factory.currentUser);
    console.log(factory.currentUser);
  }
  //login persona and send persona back to contoller to set into cookies 
  factory.login = function (user, currentTeamURL, callback, errorHandler) {
    $http.post("/api/teams/" + currentTeamURL + "/login", user).then(function (response) {
      console.log(response);
      if (!response.data.errors) {
        //set user id into cookies
        callback(response.data.persona)
      } else {
        errorHandler(response.data.errors);
      }
    });
  }

  return factory;
});

}
