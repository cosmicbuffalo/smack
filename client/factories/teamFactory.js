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

  factory.checkEmail = function(email){
    if (!factory.team){
      console.log("There is no team in the factory")
      errorHandler("NO TEAM IN FACTORY")
      return false
    } else {
      var personas = factory.team.personas
      console.log("Checking emails of each persona")
      for(var x = 0; x < personas.length; x++){
        if (personas[x]._user.email == email){
          return true
        }
      }
      console.log("No email match found in team persona list")
      return false
    }
  }

  return factory;
});

}
