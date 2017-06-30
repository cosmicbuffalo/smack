module.exports = function (io) {

  io.sockets.on('connection', function (socket) {
    console.log("WE ARE USING SOCKETS!");
    console.log(socket.id);
    //all the socket code goes in here!

    socket.on("added_new_post", function (post) {
      console.log('RECEIVED NEW POST EVENT, DATA: ', post);
      socket.broadcast.emit('added_new_post', post);
    })





  })


}