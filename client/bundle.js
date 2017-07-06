(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = function (app) {
  app.controller('findTeamController', function ($scope, userFactory, teamFactory, $location, $cookies) {
    console.log("reached findTeamController");
    //ng-model team from view
    $scope.team = {};
    //validation error from error handler
    $scope.validationErrors = null;
    //array of logged in team urls to create links in view
    $scope.loggedInTeams = [];



    //handles error coming from database and sets into scope
    var errorHandler = function (errors) {
      $scope.validationErrors = errors;
      //maybe reload page?
      console.log(errors);
    }
    //if team exists in db, set redirect to team url
    function setTeam(team) {
      console.log("teamURL: ", team.url)
      if (team.url) {
        console.log("CHANNEL ID: ", team.channels[0]._id)
        $cookies.put("currentChannelId", team.channels[0]._id)
        $cookies.put("currentTeamURL", team.url)
        $location.path("/" + team.url);
      } else {
        console.log("team not found");
      }

    }

    var currentTeamURL = $cookies.get('currentTeamURL');
    //check db if team exists
    $scope.findTeam = function () {
      if (!currentTeamURL) {
        teamFactory.getTeam($scope.team, setTeam, errorHandler);
      } else {
        if (currentTeamURL === $scope.team.url) {
          $location.path("/" + currentTeamURL);
        }
      }
      teamFactory.getTeam($scope.team, setTeam, errorHandler)

    }
  })
}

},{}],2:[function(require,module,exports){
module.exports = function (app) {
  app.controller('loginController', function ($scope, userFactory, teamFactory, $location, $cookies, $routeParams) {
    console.log("reached login controller");

    // -----------ADD CHECK IF PERSONA LOGGED in, if true, redirect---------------

    //ng-model persona which takes persona.email and persona.password
    $scope.persona = {};
    $scope.email = {};
    $scope.invite = {};
    $scope.password = {};
    $scope.foundEmail = null;
    $scope.foundEmailBool = false;
    $scope.validationErrors = null;
    $scope.successMessages = null;


    //url of the current team passed in from route params
    $scope.currentTeamURL = $routeParams.teamURL;
    console.log()
    //check if user is logged in and redirect if yes
    var currentPersonaId = $cookies.get('currentPersonaId');
    if (currentPersonaId) {
      $location.path("/" + $scope.currentTeamURL + "/messages");

    } else {

    }

    //sets errors into scope for display in view
    var errorHandler = function (error) {
      $scope.validationErrors = error;
      console.log(error);
    }
    // set persona id into scope.
    function setCurrentPersona(currentPersona) {
      console.log("Entered set current persona in login controller")
      console.log("RECEIVED PERSONA: ", currentPersona)
      console.log("SETTING ID TO COOKIE currentPersonaId: ", currentPersona._id)
      $cookies.put('currentPersonaId', currentPersona._id);
      $cookies.remove('personaIdLogin')
      console.log("Removed personaIdLogin Cookie")
      console.log("Redirecting...", "/" + $scope.currentTeamURL + "/" + $cookies.get('currentChannelId'))
      $location.path("/" + $scope.currentTeamURL + "/" + $cookies.get('currentChannelId'));
    }

    //FIRST TO HAPPEN
    $scope.checkEmail = function () {
      if (!teamFactory.checkEmail($scope.persona.email)) {
        $scope.validationErrors = "Email not found, please ask for an invite";
      } else {
        $scope.foundEmail = $scope.email;
        if (!teamFactory.currentPersona.password || !teamFactory.currentPersona.username) {
          $('#myModal').modal('show');
        } else {
          $scope.foundEmailBool = true;
          $scope.successMessages = "Found Email Match, please enter your password";
          $scope.validationErrors = null;

        }
      }
    }

    //AFTER SUCCESSFUL CHECK OF EMAIL AND PASSWORD CREATION
    //login persona to TEAM
    $scope.login = function () {
      //angular stuff to only fire off the function if the form is valid and submitted. could be tweaked
      // $scope.submitted = true;
      // if ($scope.loginForm) {
      //   console.log($scope.persona);
      //   userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
      // } else {
      //   console.log("didnt pass ng validations ")
      // }
      $scope.persona.personaId = $cookies.get('personaIdLogin')
      console.log("POST DATA FOR LOGIN: ", $scope.persona);
      userFactory.login($scope.persona, $scope.currentTeamURL, setCurrentPersona, errorHandler);
    }

    var modalCloser = function () {
      $('#myModal').modal('hide');
      $scope.foundEmailBool = true;
    }


    //AFTER SUCCESSFUL EMAIL CHECK IF NO PASSWORD
    $scope.createPassword = function () {
      console.log("Entered Create Password function")
      var postData = { password: $scope.password.password }
      if ($scope.password.username) {
        postData.username = $scope.password.username
      }
      console.log("POST DATA TO SEND TO CREATE PASSWORD: ", postData)
      userFactory.createPassword(postData, modalCloser)
    }
    var inviteSuccess = function (result) {
      $scope.successMessages = result;
      console.log("created invite:", result)
    }
    $scope.invite = function () {
      teamFactory.invite($scope.invite.email, $scope.currentTeamURL, inviteSuccess, errorHandler);
    }


  })

}

},{}],3:[function(require,module,exports){
class DateDivider {
  constructor(date) {
    this.date = date
  }
}

module.exports = function (app) {


  app.controller('mainController', function ($scope, teamFactory, userFactory, mainFactory, $cookies, $location, $routeParams, $timeout, socket, $route) {

    $scope.loaded = false;
    $timeout(function () { $scope.loaded = true; }, 4000);
    $scope.persona = {}

    $scope.team = {};
    // $scope.persona = null;
    $scope.channel = null;
    $scope.posts = [];
    $scope.channelType = false;
    $scope.publicOrPrivateDesription = "Anyone on your team can view and join this channel"

    $scope.channelInvite = null;



    //------------------------------------------------------------------------------------------
    //get persona on page load
    //------------------------------------------------------------------------------------------ 
    if (!$cookies.get('currentPersonaId')) {
      console.log("DIDN'T FIND PERSONA ID IN COOKIES... REDIRECTNG TO ROOT")
      $location.path("/");
    }
    console.log("GETTING CURRENT PERSONA BY ID IN COOKIES: ", $cookies.get('currentPersonaId'), "********* 1 *********")
    userFactory.getPersona($cookies.get('currentPersonaId'), function (data) {
      console.log(data)
      $scope.persona = data
      console.log("SET CURRENT PERSONA TO SCOPE: ", $scope.persona, "********* 1! *********")
    })


    var refreshChannelAndPosts = function () {
      mainFactory.findChannel($routeParams.channelId, function (data) {
        $scope.channel = mainFactory.channel
        console.log("SET CURRENT CHANNEL TO SCOPE: ", $scope.channel)
        $cookies.put('currentChannelId', $scope.channel._id)
        if (!$scope.channel.posts) { console.log("NO POSTS FOUND ON CHANNEL") }
        $scope.posts = $scope.channel.posts
        //HERE IS WHERE DATE DIVIDERS WILL BE INSERTED -- NEED TO REFACTOR FOR MULTIPLE DATES
        if ($scope.channel.posts[0]) {
          var firstDivider = new DateDivider($scope.posts[0].createdAt)
          $scope.posts.splice(0, 0, firstDivider)
        }
        console.log("SET CURRENT POSTS TO SCOPE: ", $scope.posts, "********* 2! *********")

      })

    }


    //------------------------------------------------------------------------------------------
    //get channel on page load
    //------------------------------------------------------------------------------------------
    console.log("FINDING CHANNEL ON PAGE LOAD WITH ID: ", $routeParams.channelId, "********* 2 *********")
    refreshChannelAndPosts()



    // -----------------------------------------------------------------------------------------
    // Changing channel in controller on click
    // -----------------------------------------------------------------------------------------

    $scope.changeChannel = function (channelId, boolean = null) {
      // Broke it up to make it more readable, example is  : /codingdojochicago/3fj31323dcdfF31
      var teamUrl = $cookies.get('currentTeamURL');

      $location.url('/' + teamUrl + '/' + channelId);

      if (boolean) {
        // There are two different methods  this function
        // gets called in one is a modal. The browse channel modal
        // passes this boolean and the modal closes on click.
        browseChannelClose();
      }

    }
    //--------------------------------------------------------------------------------------
    // Browse channelswitches over to create new channel!
    //--------------------------------------------------------------------------------------
    $scope.goToNewChannel = function () {
      console.log('working!')
      $('#filterChannelModal').modal('hide');
      $('#addChannelModal').modal('show');

    }





    function setTeamInScope(data) {
      console.log("Entered set team in scope")
      $scope.team = data
      console.log('SET TEAM TO SCOPE: ', data, "********* 3! *********")
    }

    //check to see if team url is in cookies
    //get team and set team to scope
    console.log("GETTING CURRENT TEAM BY URL: ", $cookies.get('currentTeamURL'), "********* 3 *********", "TEAM SHOULD BE UP TO DATE")
    if ($cookies.get('currentTeamURL')) {
      console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
      reloadTeam()
    }

    function reloadTeam() {
      console.log("Entered reload team, calling teamFactory GET TEAM with url from cookie")
      teamFactory.getTeam({ url: $cookies.get('currentTeamURL') }, setTeamInScope)
    }

    //new channel form submit action
    $scope.addChannel = function (channelObj) {
      console.log("Triggered addChannel function!")
      channelObj.private = $scope.channelType
      channelObj.personaId = $cookies.get('currentPersonaId')
      console.log("Will call mainFactory CREATE CHANNEL")
      console.log("PASSING TEAM ID: ", teamFactory.team._id)
      console.log("PASSING NEW CHANNEL OBJECT: ", channelObj)
      mainFactory.createChannel(teamFactory.team._id, channelObj, reloadTeam, modalCloser)
      $scope.channelObj = {};
    }






    var errorHandler = function (errors) {
      console.log("Entered main controller error handler function")
      console.log(errors);
    }

    $scope.addPost = function () {
      console.log("Triggered add post function")
      console.log("WILL CALL mainFactory ADD POST")
      console.log("PASSING NEW POST OBJECT: ", $scope.newPost);
      mainFactory.addPost($scope.newPost, refreshChannelAndPosts, errorHandler)
      $scope.newPost = {};

    }


    socket.on('added_new_post', function (post) {
      console.log("RECEIVED NEW POST EVENT WITH DATA: ", post)
      if (post._channel == $scope.channel._id) {
        $scope.posts.push(post)
      }

      // console.log($("#posts-container"))
      // console.log($("#posts-container")[0].scrollHeight)
      scrollSmoothToBottom('posts-container')
    })

    function scrollSmoothToBottom(id) {
      var div = document.getElementById(id);
      $('#' + id).animate({
        scrollTop: div.scrollHeight - div.clientHeight
      }, 500);
    }

    socket.on('invited_to_channel', function (data) {
      console.log("RECEIVED INVITED TO CHANNEL EVENT WITH DATA: ", data)
      if ($scope.channel._id == data.channelId) {
        $route.reload();
      }

    })

    socket.on('added_new_channel', function (data) {
      console.log("RECEIVED ADDED NEW CHANNEL EVENT WITH DATA: ", data);

      if ($scope.team.url == data.teamURL) {
        console.log("CALLING RELOAD TEAM TO REFRESH CHANNEL LIST")
        reloadTeam();
      }


    })





    // log persona out and redirect to team login
    $scope.logOut = function () {
      $cookies.remove('currentTeamURL');
      $cookies.remove('currentPersonaId');
      $location.path("/");
    }

    //logOut and switch teams
    $scope.changeTeam = function () {
      $cookies.remove('currentPersonaId');
      $cookies.remove('currentTeamURL');
      $location.path("/");
    }

    $scope.inviteToChannel = function () {
      $('#channelInviteModal').modal('show');
    }
    $scope.inviteToChannelSubmit = function () {
      console.log("Entered invite to channel submit function")
      console.log("INVITE OBJECT: ", $scope.invite)

      console.log("PERSONAS FOUND ON CURRENT TEAM: ", $scope.team.personas)

      for (var x = 0; x < $scope.team.personas.length; x++) {
        // console.log("COMPARING: ", $scope.team.personas[x].username, $scope.invite.username)
        if ($scope.team.personas[x].username == $scope.invite.username) {
          $scope.invite._id = $scope.team.personas[x]._id
        }
      }
      console.log("INVITE OBJECT AFTER ID LOOKUP: ", $scope.invite)

      if (!$scope.invite._id) {
        console.log("FAILED TO LOOKUP PERSONA ID, USERNAME NOT FOUND IN TEAM MEMBERS")
        return
      }


      mainFactory.inviteToChannel($scope.invite._id, inviteChannelModalCloser)

    }


    function browseChannelClose() {
      $('filterChannelModal').modal('hide');
      // these two were added because of the modals
      // backdrop style not being removed on close..
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }

    var modalCloser = function () {
      $('#addChannelModal').modal('hide');
    }
    var inviteChannelModalCloser = function () {
      $('#channelInviteModal').modal('hide');
    }








    var checkboxListener = function (value) {
      $scope.channelType = value
      if ($scope.channelType) {
        $scope.publicOrPrivate = ""
        $scope.publicOrPrivateDesription = "Anyone on your team can view and join this channel"
      } else {

        $scope.publicOrPrivate = "private"
        $scope.publicOrPrivateDesription = "This channel can only be joined or viewed by invite"
      }
      console.log($scope.publicOrPrivate)

    }
    //bootstrap toggle boolean return
    $(document).ready(function () {


      $("#channel-option").change(function () {
        checkboxListener($(this).prop('checked'))
      })

      setTimeout(function () {
        var availablePersonas = [];
        for (var x = 0; x < $scope.team.personas.length; x++) {
          availablePersonas.push($scope.team.personas[x].username)
        }
        console.log("List of usernames to choose from for add to channel:, ", availablePersonas)

        $("#tags").autocomplete({
          source: availablePersonas
        });
      }, 2000)






    })


  })




  //bootstrap toggle
  $(function () {
    $('#channel-option').bootstrapToggle({
      on: 'Private',
      off: 'Public'
    });
  })





}
},{}],4:[function(require,module,exports){
class DateDivider {
  constructor(date) {
    this.date = date
  }
}


module.exports = function (app) {


  app.factory('mainFactory', function ($http, $location, $cookies, userFactory, socket) {
    var factory = {};

    factory.channel = null;
    factory.posts = [];

    //hits api and returns a team url if exists else sends back error
    factory.findChannel = function (channelId, callback, errorHandler = null) {
      console.log("Entered mainfactory FIND CHANNEL function");
      console.log("Searching for channel with id: ", channelId)
      $http.get('/api/channels/' + channelId).then(function (response) {

        console.log("FIND CHANNEL FUNCTION GOT RESPONSE DATA: ", response.data);
        if (!response.data.errors) {
          console.log("NO ERRORS, SETTING CHANNEL IN MAIN FACTORY")
          factory.channel = response.data.channel
          console.log("SET mainFactory factory.channel: ", factory.channel)
          // console.log("CALLING mainFactory SET POSTS, PASSING ALONG CALLBACK") //CALLBACK WILL DO THE DATE DIVIDERS
          // factory.setPosts(factory.channel, callback)
          console.log("EXECUTING CALLBACK WITH CHANNEL...")
          callback(factory.channel)
        } else {
          if (errorHandler) {
            errorHandler(response.data.errors);
          }
        }
      });
    }

    factory.createChannel = function (teamId, channelObj, callback, modalCloser = null) {
      console.log("Entered mainFactory CREATE CHANNEL method!")
      console.log("RECEIVED TEAM ID: ", teamId)
      console.log("RECEIVED NEW CHANNEL OBJECT: ", channelObj);
      console.log("POSTING TO URL WITH NEW CHANNEL OBJECT: ", '/api/teams/' + teamId + '/channels')
      $http.post('/api/teams/' + teamId + '/channels', channelObj).then(function (res) {

        if (res.data.success) {
          console.log("GOT SUCCESS RESPONSE IN CREATE CHANNEL, EMITTING NEW CHANNEL EVENT TO SERVER AND EXECUTING CALLBACK...")
          socket.emit('added_new_channel', {teamURL:$cookies.get('currentTeamURL')})
          callback()

        }
        else {
          console.log("RECEIVED FAILURE RESPONSE IN CREATE CHANNEL...")
          console.log("RESPONSE DATA: ", res.data)
          console.log("STILL EXECUTING CALLBACK...")
          callback()
        }
        if (modalCloser) {
          console.log("CLOSING MODAL...")
          modalCloser()
        }

      })

    }
    factory.inviteToChannel = function (personaId, modalCloser = null) {
      $http.post('/api/channels/' + $cookies.get('currentChannelId') + '/invite', { personaId: personaId }).then(function (res) {

        if (res.data.success) {
          console.log("GOT SUCCESS RESPONSE IN invite to CHANNEL")
          socket.emit("invited_to_channel", {channelId:$cookies.get('currentChannelId')})
          modalCloser()
        }
        else {
          console.log("RECEIVED FAILURE RESPONSE IN invite to CHANNEL...")
          console.log("RESPONSE DATA: ", res.data)
          console.log("STILL EXECUTING CALLBACK...")
        }
        if (modalCloser) {
          console.log("CLOSING MODAL...")
          modalCloser()
        }
      })
    }


    factory.addPost = function (newPost, callback, errorHandler) {
      console.log("Entered mainFactory ADD POST method")
      console.log("RECEIVED INCOMPLETE NEW POST OBJECT: ", newPost)
      console.log("Attempting to add current persona id to newPost")
      newPost._persona = $cookies.get('currentPersonaId')
      console.log("Attempting to add current channel id to newPost")
      newPost._channel = $cookies.get('currentChannelId')
      console.log("newPost after adding persona and channel: ", newPost)
      console.log("EXECUTING REQUEST TO URL: ", '/api/channels/' + $cookies.get('currentChannelId') + '/posts')
      $http.post('/api/channels/' + $cookies.get('currentChannelId') + '/posts', newPost).then(function (response) {

        console.log("RESPONSE DATA FROM ADD POST: ", response.data);
        if (!response.data.errors) {
          console.log("NO ERRORS, EMITTING TO SERVER AND EXECUTING CALLBACK...")
          socket.emit("added_new_post", response.data.post)
          callback();

        } else {
          console.log("GOT ERRORS: ", response.data.errors)
          errorHandler(response.data.errors)

        }

      })

    }





    return factory;



  })


}
},{}],5:[function(require,module,exports){
module.exports = function(app){


  app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});



}
},{}],6:[function(require,module,exports){
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

    factory.getTeam = function (team, setTeamInScope = null) {
      console.log("Entered teamFactory GET TEAM method!")
      console.log("RECEIVED TEAM LOOKUP OBJECT: ", team);
      var url = team.url;
      // console.log("Current factory.team before http lookup:", factory.team)
      console.log("EXECUTING GET TO URL: ", '/api/teams/' + url)
      $http.get('/api/teams/' + url).then(function (response) {
        // console.log(response);
        if (!response.data.errors) {
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
          console.log(response.data.errors)
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

},{}],7:[function(require,module,exports){
module.exports = function (app) {
  app.factory("userFactory", function ($http, $cookies) {

    var factory = {};
    //gets set from findteam() if the team exists and gets sent to controller to confirm team existence
    factory.teamURL = null;
    factory.currentPersonaId = $cookies.get('currentPersonaId')
    console.log("FACTORY CURRENT PERSONA ID FROM COOKIES", factory.currentPersonaId)
    // factory.personaIdLogin = $cookies.get('personaIdLogin')
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
      console.log("Entered User Factory Login method")
      console.log("RECEIVED POSTDATA: ", user)
      console.log("POSTING TO URL: ", "/api/teams/" + currentTeamURL + "/login")

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
      console.log("Entered userFactory createPassword function")
      console.log("FOUND personaIdLogin COOKIE: ", $cookies.get('personaIdLogin'))
      console.log("RECEIVED POSTDATA: ", postData)

      if ($cookies.get('personaIdLogin')) {
        console.log("POSTING TO URL: ", '/api/personas/' + $cookies.get('personaIdLogin'))
        $http.post('/api/personas/' + $cookies.get('personaIdLogin'), postData).then(function(response){
          if (!response.data.errors){
            console.log("Got response: ", response.data)
            factory.currentPersona = response.data.persona
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

},{}],8:[function(require,module,exports){

//initialize app
var app = require('./modules/app.js')

//set up factories
require('./factories/socketFactory.js')(app)

require('./factories/userFactory.js')(app)

require('./factories/teamFactory.js')(app)

require('./factories/mainFactory.js')(app)



//set up controllers
require('./controllers/findTeamController.js')(app)

require('./controllers/loginController.js')(app)

require('./controllers/mainController.js')(app) //NEW MAIN CONTROLLER


},{"./controllers/findTeamController.js":1,"./controllers/loginController.js":2,"./controllers/mainController.js":3,"./factories/mainFactory.js":4,"./factories/socketFactory.js":5,"./factories/teamFactory.js":6,"./factories/userFactory.js":7,"./modules/app.js":9}],9:[function(require,module,exports){
var app = angular.module('smack', ['ngRoute', 'ngCookies', 'ngMessages' ])

app.config(function($routeProvider){
  $routeProvider
  //root route= find team (from find team can redirect to a logged in team)
  .when('/',{
    templateUrl:'partials/findteam.html',
    controller:'findTeamController'
  })
  .when('/createteam',{
    templateUrl:'partials/createteam.html',
    controller:'findTeamController'
  })
  //login to team
  .when('/:teamURL/',{
    templateUrl:'partials/login.html',
    controller:'loginController'
  })
  //invite to team
  .when('/:teamURL/invite',{
    templateUrl:'partials/invite.html',
    controller:'loginController'
  })
  //the APP
  .when('/:teamURL/:channelId',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .when('/:teamURL/messages',{
    templateUrl:'partials/main.html',
    controller:'mainController'
  })
  .otherwise({
    redirectTo:'/'
  });
});

module.exports = app




//directive to compare passwords and confirm match
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);

},{}]},{},[8]);
