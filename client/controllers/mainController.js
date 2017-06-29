module.exports = function (app) {

  app.controller('mainController', function($scope, $location, userFactory, teamFactory, channelFactory, postFactory, $cookies){

    $scope.persona = {}

    $scope.team = {}

    $scope.channel = {}


    $scope.posts = []


    $scope.newPost = {}

    var currentPersonaId = $cookies.get('currentPersonaId');
    if (!currentPersonaId) {
      $location.path("/");
    } else {
      
    }

    var setPersona = function(){
      console.log("Entered set persona in main controller")
      $scope.persona = userFactory.currentPersona

      $scope.newPost = {
        _persona: $scope.persona._id
      }
    }
    var setTeam = function(data){
      console.log("Entered set team in main controller")
      $scope.team = teamFactory.team
      channelFactory.findChannel(teamFactory.currentChannel._id, setChannel)
    }

    var setChannel = function (data){
      console.log("Entered set channel in main controller")
      $scope.channel = channelFactory.channel
      $scope.posts = $scope.channel.posts
      console.log("Scope.posts: ", $scope.posts)

    }

    if ($cookies.get('currentTeamURL')){
      console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
      teamFactory.findTeam({url:$cookies.get('currentTeamURL')}, setTeam)
    }



    var addPostSuccess = function (data) {
      console.log("Entered main controller add post success function")
      console.log(data)
      $scope.newPost = { _persona: $scope.persona._id }
    }

    var errorHandler = function (errors) {
      console.log("Entered main controller error handler function")
      console.log(errors);
    }

    $scope.addPost = function () {

      console.log("Triggered add post function")
      console.log("New Post object before adding persona and channel: ", $scope.newPost);

      postFactory.addPost($scope.newPost, addPostSuccess, errorHandler)

    }
  })

}
