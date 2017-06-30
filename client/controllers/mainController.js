class DateDivider {
  constructor(date) {
    this.date = date
  }
}

module.exports = function (app) {


  app.controller('mainController', function ($scope, teamFactory, userFactory, mainFactory, $cookies, $location, $routeParams, $timeout, socket) {

    $scope.loaded = false;
    $timeout(function () { $scope.loaded = true; }, 3000);
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
        if (!$scope.channel.posts) { console.log("NO POSTS FOUND ON CHANNEL") }
        $scope.posts = $scope.channel.posts
        //HERE IS WHERE DATE DIVIDERS WILL BE INSERTED -- NEED TO REFACTOR FOR MULTIPLE DATES
        var firstDivider = new DateDivider($scope.posts[0].createdAt)
        $scope.posts.splice(0, 0, firstDivider)
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
      mainFactory.inviteToChannel($scope.channelInvite.email, inviteChannelModalCloser)

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