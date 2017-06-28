module.exports = function (app) {
  app.factory("userFactory", function ($http, $cookies) {

    var factory = {};
    //gets set from findteam() if the team exists and gets sent to controller to confirm team existence
    factory.teamURL = null;
    factory.currentPersonaId = $cookies.get('currentPersonaId')
    factory.personaIdLogin = $cookies.get('personaIdLogin')
    //holds currentPersona from getPersona()
    factory.currentPersona = {};
    //holds user object
    factory.user = {};


    // controller method to get back persona data
    factory.getPersona = function (currentPersonaId, callback=null, errorHandler=null) {
      console.log("entered get persona function in factory")
      console.log("Current persona ID to look up: ", currentPersonaId)
      $http.get("/api/personas/" + currentPersonaId).then(function (response) {
        console.log(response);
        if (!response.data.errors) {
          //get back all persona data and save to factory
          factory.currentPersona = response.data.persona;
          console.log("Set factory.currentPersona: ", factory.currentPersona)
          //send data back to controller to set to scope

          if (callback){
            callback(factory.currentPersona);
          }

        } else {
          if (errorHandler){
            errorHandler(response.data.errors);
          }

        }
      });
      // callback(factory.currentUser);
      // console.log(factory.currentUser);
    }


    //CHECKS COOKIES AND GETS PERSONA IF AN ID IS FOUND
    if (factory.currentPersonaId){
      console.log("Found Persona ID in cookies: ", factory.currentPersonaId)
      factory.getPersona(factory.currentPersonaId)
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

    factory.createPassword = function (postData, callback) {
      console.log(factory.personaIdLogin)

      if (factory.personaIdLogin) {
        $http.post('/api/personas/' + factory.personaIdLogin, postData).then(function(response){
          if (!response.data.errors){
            console.log("Got repsponse: ", response.data)

          } else {
            console.log(response.data)
          }
          callback();
        })
      }
    }

    return factory;
  });

}
