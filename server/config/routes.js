//import controllers
var users = require('./../controllers/users')


module.exports = function(app){

  // I'm just throwing in a bit of stuff here... - Nick

  // old copypasted stuff
  // app.get('/messages', messages.index)
  // app.post('/messages', messages.create)
  // app.post('/messages/:message_id/comments/:comment_id/delete', messages.deleteComment)
  // app.post('/messages/:message_id/delete', messages.deleteMessage)
  // app.post('/messages/:message_id', messages.comment)

  // ---- USER ROUTES ----
  app.post('/users/login', users.login)
  app.post('/users', users.create)

  // ---- TEAM ROUTES ----


  // --- CHANNEL ROUTES ---


  // --- PERSONA ROUTES ---

}
