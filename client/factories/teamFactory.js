module.exports = function (app) {
  app.factory("teamFactory", function ($http, $location, $cookies) {

    var factory = {};
    //gets set from findteam() if the team exists and gets sent to controller to confirm team existence
    factory.teamURL = null;
    //holds currentPersona from getPersona()
    factory.currentPersona = null;
    factory.currentChannel = null;
    factory.team = null;

    //hits api and returns a team url if exists else sends back error
    factory.findTeam = function (team, callback = null, errorHandler = null, setTeamInScope = null) {
      console.log("Entered teamFactory.findTeam method!")
      console.log("RECEIVED TEAM LOOKUP OBJECT: ", team);
      var url = team.url;
      console.log("Current factory.team: ", factory.team)
      if (!factory.team) {
        $http.get('/api/teams/' + url).then(function (response) {
          console.log(response);
          if (!response.data.error) {
            factory.team = response.data.team
            factory.teamURL = response.data.team.url;
            console.log("factory.teamURL: ", factory.teamURL);
            console.log("Team: ", factory.team)
            factory.currentChannel = factory.team.channels[0]
            if (callback) {
              callback(factory.teamURL, factory.currentChannel._id);
            }
            if (setTeamInScope) {
              console.log("CALLL BACK SOOOOOOOOOOOOOOOOOOON")
              setTeamInScope(factory.team)
            }
          } else {
            if (errorHandler) {
              errorHandler(response.data.error);
            }
          }
        });
      } else {
        if (setTeamInScope) {
          console.log("CALLL BACK SOOOOOOOOOOOOOOOOOOON")
          setTeamInScope(factory.team)
        }
      }
    }

    factory.getTeam = function (team, setTeamInScope = null, errorHandler) {
      console.log("Entered teamFactory GET TEAM method!")
      console.log("RECEIVED TEAM LOOKUP OBJECT: ", team);
      var url = team.url;
      // console.log("Current factory.team before http lookup:", factory.team)
      console.log("EXECUTING GET TO URL: ", '/api/teams/' + url)
      $http.get('/api/teams/' + url).then(function (response) {
        // console.log(response);
        if (!response.data.error) {
          factory.team = response.data.team
          factory.teamURL = response.data.team.url;
          console.log("SET factory.teamURL: ", factory.teamURL);
          console.log("SET factory.team: ", factory.team)
          factory.currentChannel = factory.team.channels[0]
          console.log("SET factory.currentChannel: ", factory.currentChannel)
          console.log("Checking for callback...")
          if (setTeamInScope) {
            console.log("EXECUTING SET TEAM IN SCOPE CALLBACK WITH TEAM: ", factory.team)
            setTeamInScope(factory.team)
          }
        } else {
          console.log("RECEIVED ERRORS: ...")
          console.log(response.data.error)
          errorHandler(response.data.error);
        }
      });
    }







    if ($cookies.get('currentTeamURL')) {
      console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
      factory.findTeam({ url: $cookies.get('currentTeamURL') })
    }


    factory.checkEmail = function (email) {
      console.log("Received email:", email)
      if (!factory.team) {
        console.log("There is no team in the factory")
        // errorHandler("NO TEAM IN FACTORY")
        return false
      } else {
        var personas = factory.team.personas
        console.log("Checking emails of each persona")
        for (var x = 0; x < personas.length; x++) {
          console.log(personas[x]._user)
          if (personas[x]._user) {
            console.log(personas[x]._user.email, email)
            if (personas[x]._user.email == email) {
              console.log("Found email match")
              factory.currentPersona = personas[x];
              console.log(factory.currentPersona, "Setting iD into cookie personaIdLogin.........", factory.currentPersona._id)
              $cookies.put('personaIdLogin', factory.currentPersona._id);
              console.log("NEW PERSONA ID IN COOKIE: ", $cookies.get('personaIdLogin'))
              return true
            }
          }

        }
        console.log("No email match found in team persona list")
        return false
      }
    }


    factory.invite = function (email, url, callback, errorHandler) {
      $http.post('api/teams/' + url + '/invite', { email: email }).then(function (response) {
        if (!response.data.error) {
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
