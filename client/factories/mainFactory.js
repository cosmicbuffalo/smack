class DateDivider {
  constructor(date) {
    this.date = date
  }
}


module.exports = function (app) {


  app.factory('mainFactory', function ($http, $location, $cookies, userFactory) {
    var factory = {};

    factory.channel = null;

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
          console.log("GOT SUCCESS RESPONSE IN CREATE CHANNEL, EXECUTING CALLBACK...")
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

    // factory.setPosts = function (data, callback) {
    //   console.log("Entered mainFactory SET POSTS function")
    //   if (!data.posts) {
    //     console.log("THERE ARE NO POSTS, CALLING CALLBACK WITH EMPTY ARRAY")
    //     callback([]);
    //   } else {
    //     console.log("SETTING POSTS")
    //     factory.posts = data.posts
    //     //HERE IS WHERE DATE DIVIDERS WILL BE INSERTED
    //     var firstDivider = new DateDivider(factory.posts[0].createdAt)
    //     console.log("CREATED FIRST DATE DIVIDER")
    //     factory.posts.splice(0, 0, firstDivider)
    //     console.log("ADDED DATE DIVIDER TO POSTS")
    //     console.log("EXECUTING CALLBACK WITH POSTS")
    //     if (callback) {
    //       callback(factory.channel, factory.posts)
    //     }

    //   }
    // }

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
          console.log("NO ERRORS, EXECUTING CALLBACK...")
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