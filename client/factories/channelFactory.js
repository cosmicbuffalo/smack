module.exports = function (app) {
  app.factory("channelFactory", function ($http, $location, $cookies, postFactory) {

  var factory = {};

  factory.channel = null;

  //hits api and returns a team url if exists else sends back error
  factory.findChannel = function (channelId, callback = null, errorHandler = null) {
    console.log("Entered channel factory find channel function");
    console.log("Searching for channel with id: ", channelId)
    $http.get('/api/channels/' + channelId).then(function (response) {

      console.log(response);
      if (!response.data.errors) {
        factory.channel = response.data.channel

        console.log("Channel: ", factory.channel)
        postFactory.setChannel(factory.channel)
        if (callback){
          callback(factory.channel);
        }
      } else {
        if (errorHandler){
          errorHandler(response.data.errors);
        }
      }
    });
  }


  return factory;
});

}
