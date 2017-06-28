module.exports = function (app) {
  app.factory("teamFactory", function ($http) {

  var factory = {};
  //gets set from findteam() if the team exists and gets sent to controller to confirm team existence
  factory.teamURL = null;
  //holds currentPersona from getPersona()
  factory.currentPersona = null;

  factory.team = null;

  //hits api and returns a team url if exists else sends back error
  factory.findTeam = function (team, callback, errorHandler) {
    var URL = team.URL;
    $http.get('/api/teams/' + URL).then(function (response) {
      console.log(response);
      if (!response.data.errors) {
        factory.team = response.data.team
        factory.teamURL = response.data.team.url;
        console.log("factory.teamURL: ", factory.teamURL);
        console.log("Team: ", factory.team)
        callback(factory.teamURL);
      } else {
        errorHandler(response.data.errors);
      }
    });
  }

  return factory;
});

}
