//import controllers
var users = require('./../controllers/users')
var teams = require('./../controllers/teams')
var posts = require('./../controllers/posts')
var channels = require('./../controllers/channels')


module.exports = function(app){

  // I'm just throwing in a bit of stuff here... - Nick

  
  // ---- USER ROUTES ----
  // app.post('/api/users/login', users.login)  //will authenticate login and return failure result + errors or success + user object
  // app.post('/api/users', users.create)       //should create new user with email and name, returns user object on success, errors on failure

  // // --- PERSONA ROUTES ---
  // app.post('/api/users/:userId/personas', personas.create)  //should create new persona for specific user, add the persona to the team specified in post data, and return persona object or errors
  // app.post('/api/personas/:personaId', personas.getPersona)  //get all persona data from id
  // // ---- TEAM ROUTES ----
  app.get('/api/teams', teams.index)                   //should return full list of teams
  app.get('/api/teams/:teamUrl', teams.show)           //should return the object for a specific team or errors if not found
  app.post('/api/teams/:teamUrl/login', teams.login)   //should log a specific persona in to a specific team by finding the team by teamUrl, then the persona by email, then authenticating the password. will return errors or success
  app.post('/api/teams/', teams.create)                //should create new team with post data, returns team object or errors
  app.post('/api/teams/:teamUrl/invite', teams.invite) // should find team and invite a user to join via the email passed in post data


  // --- CHANNEL ROUTES ---
  app.post('/api/teams/:teamId/channels', channels.create)//Object Keys: {personaId: data, teamName: data, purpose: data, private: boolean}       should create new channel with post data, returns channel object or errors
  app.post('/api/channels/:channelId', channels.update)// Object Keys it can be one or the other or both: {name: data, purpose: data}  should update channel with post data and return channel object or errors
  app.post('/api/teams/:teamId/channels/:channelId/delete', channels.delete)  // Object Keys: None just needs the channelId and it should delete channel from team and posts/comments in channel and return success or errors
  app.post('/api/channels/:channelId/invite', channels.invite)// Object Keys: {personaId: data} will find channel and add persona to invite from post data, maybe also send user an email/message of some sort


  // // ---- POST ROUTES ----
  app.get('/api/channels/:channelId/posts', posts.allForChannel)          //should retrieve all the posts associated with a specific channel and return them in order from oldest to newest
  app.post('/api/channels/:channelId/posts', posts.create)                //should create a new post in a specific channel, returns post object or errors
  // app.post('/api/posts/:postId', posts.update)                            //should update post with post data and return post object or errors
  // app.post('/api/channels/:channelId/posts/:postId/delete', posts.delete) //should delete post from channel along with all comments and return success or errors
  
  // // --- COMMENT ROUTES ---
  // app.post('/api/posts/:postId/comments', comments.create)                    //should create a new comment for a specific post, returns comment object or errors
  // app.post('/api/posts/:postId/comments/:commentId/delete', comments.delete)  //will find comment and delete from post and persona, return success or errors
  // app.post('/api/posts/:postId/comments/:commentId', comments.update)         //will find comment and update with post data, then return comment object or errors
  
  // //---- FILE ROUTES ----
  // app.post('/api/channels/:channelId/files', files.create)        //should take a file in post data and add it to a channel and the database, returns success or failure
  // app.get('/api/channels/:channelId/files', files.allForChannel)  //should find all files associated with a channel and return a list of file objects
  // app.get('/api/personas/:personaId/files', files.allForUser)     //should find all files associated with a perona and return a list of file objects or errors
}
