module.exports = function (io) {

  io.sockets.on('connection', function (socket) {
    console.log("WE ARE USING SOCKETS!");
    console.log(socket.id);
    //all the socket code goes in here!

    socket.on("added_new_post", function (post) {
      console.log('RECEIVED NEW POST EVENT, DATA: ', post);
      socket.broadcast.emit('added_new_post', post);
    })

    //data should be like so: {channelId:channelId}
    socket.on("invited_to_channel", function(data){
      console.log("RECEIVED INVITED TO CHANNEL EVENT, DATA: ", data);
      io.emit("invited_to_channel", data)
    })

    //data should be like so: {teamURL:teamURL}
    socket.on('added_new_channel', function(data){
      console.log("RECEIVED NEW CHANNEL EVENT, DATA: ", data);
      socket.broadcast.emit('added_new_channel', data);
    })




  })


}