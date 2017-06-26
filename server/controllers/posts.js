var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Channel = mongoose.model('Channel')


exports.create = function(req, res){
  console.log("Entered posts.create");
  console.log("BODY OF REQUEST: ", req.body);
  //Find channel via route parameter
  Channel.findOne({_id:req.params.channelId}, function(err1, channel){
    if (err1){
      //handle errors
      console.log(err1);
      res.json({success:false, message:"Error during post creation", errors:err1})
    } else {
      //create the new post with the request body, which should be sent as a proper post format
      var newPost = new Post(req.body);
      //save the post
      newPost.save(function(err2){
        if (err2){
          //handle errors
          console.log(err2);
          res.json({success:false, message:"Error during post creation", errors:err2});
        } else {
          //push the saved post to the channel
          channel.posts.push(newPost);
          //save the channel
          channel.save(function(err3){
            if (err3){
                //handle errors
                console.log(err3);
                res.json({success:false, message:"Error during post creation", errors:err3});
            } else {
                //if no errors, post creation was a success, respond accordingly
                console.log("Successfully created new message")
                res.json(success:true, message:"Successfully created new post", post:newPost)
            }
          })
        }
      })
    }
  })
}


