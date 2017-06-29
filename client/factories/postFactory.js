class DateDivider{
  constructor(date){
    this.date = date
  }
}

module.exports = function (app) {
  app.factory("postFactory", function ($http, userFactory) {

  var factory = {};

  factory.channel = {};

  factory.setChannel = function(channel, callback=null){
    console.log("Setting channel in post factory")
    console.log(channel)
    factory.channel = channel
    factory.setPosts(factory.channel, callback)
  }

  factory.posts = [];

  factory.setPosts = function(data, callback){
    console.log("Setting posts in postFactory")
    if (!factory.channel.posts){
      return false
    } else {
      factory.posts = factory.channel.posts
      //HERE IS WHERE DATE DIVIDERS WILL BE INSERTED
      var firstDivider = new DateDivider(factory.posts[0].createdAt)

      factory.posts.splice(0,0,firstDivider)
      if (callback){
        callback(factory.posts)
      }

    }
  }

  factory.addPost = function (newPost, callback, errorHandler){
    console.log("Entered addPost in factory")
    console.log("Attempting to add current persona id to newPost")
    newPost._persona = userFactory.currentPersona._id
    console.log("Attempting to add current channel id to newPost")
    newPost._channel = factory.channel._id
    console.log("newPost after adding persona and channel: ", newPost)
    console.log("Executing http request")
    $http.post('/api/channels/' + factory.channel._id + '/posts', newPost).then(function(response){

      console.log(response.data);
      if (!response.data.errors){

        callback(response.data);

      } else {
        errorHandler(response.data.errors)

      }

    })

  }





  return factory;
});

}
