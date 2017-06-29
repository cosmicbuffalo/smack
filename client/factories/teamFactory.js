module.exports = function (app) {
  app.factory("teamFactory", function ($http, $location, $cookies, channelFactory) {

  var factory = {};
  //gets set from findteam() if the team exists and gets sent to controller to confirm team existence
  factory.teamURL = null;
  //holds currentPersona from getPersona()
  factory.currentPersona = null;
  factory.currentChannel = null;
  factory.team = null;

  //hits api and returns a team url if exists else sends back error
  factory.findTeam = function (team, callback = null, errorHandler = null) {
    console.log(team);
    var url = team.url;
    if (!factory.team){
    $http.get('/api/teams/' + url).then(function (response) {
      console.log(response);
      if (!response.data.errors) {
        factory.team = response.data.team
        factory.teamURL = response.data.team.url;
        console.log("factory.teamURL: ", factory.teamURL);
        console.log("Team: ", factory.team)
        factory.currentChannel = factory.team.channels[0]
        channelFactory.findChannel(factory.currentChannel._id)
        if (callback){
          callback(factory.teamURL);
        }
      } else {
        if (errorHandler){
          errorHandler(response.data.errors);
        }
      }
    });
  }
  }

  if ($cookies.get('currentTeamURL')){
    console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
    factory.findTeam({url:$cookies.get('currentTeamURL')})
  }


  factory.checkEmail = function(email){
    console.log("Received email:", email)
    if (!factory.team){
      console.log("There is no team in the factory")
      // errorHandler("NO TEAM IN FACTORY")
      return false
    } else {
      var personas = factory.team.personas
      console.log("Checking emails of each persona")
      for(var x = 0; x < personas.length; x++){
        console.log(personas[x]._user)
        if (personas[x]._user){
          console.log(personas[x]._user.email, email)
          if (personas[x]._user.email == email){
            console.log("Found email match")
            factory.currentPersona = personas[x];
            $cookies.put('personaIdLogin', factory.currentPersona._id);
            return true
          }
        }

      }
      console.log("No email match found in team persona list")
      return false
    }
  }
  factory.invite = function (email, url,callback, errorHandler) {
    $http.post('api/teams/' + url +  '/invite', {email: email}).then(function(response){
      if (!response.data.error){
        console.log("Got repsponse: ", response.data)
        callback(response.data)
      } else {
        console.log("reached error handler")
        errorHandler(response.data.error)
      }
    })
  }

  return factory;
});

}
