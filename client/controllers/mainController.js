module.exports = function(app){

  app.controller('mainController', function($scope, $location, userFactory, teamFactory, postFactory){



    var initializeScope = function (){
      $scope.persona = userFactory.currentPersona

      $scope.team = teamFactory.team

      $scope.channel = postFactory.channel

      $scope.posts = postFactory.posts

      $scope.newPost = {
        _persona:$scope.persona._id
      }
    }

    var addPostSuccess = function(data){
      console.log("Entered main controller add post success function")
      console.log(data)
      $scope.newPost = {_persona:$scope.persona._id}
    }

    var errorHandler = function(errors){
      console.log("Entered main controller error handler function")
      console.log(errors);
    }

    $scope.addPost = function(){

      console.log("Triggered add post function")
      console.log("New Post object before adding persona and channel: ", $scope.newPost);

      postFactory.addPost($scope.newPost, addPostSuccess, errorHandler)

    }

    $(document).ready(function(){
      initializeScope();
    })


  })

}
