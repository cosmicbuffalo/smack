var mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Channel = mongoose.model('Channel')

//This whole controller may need to be redone when we add socket support...


exports.create = function (req, res, next) {
  console.log("Entered posts.create");
  console.log("BODY OF REQUEST: ", req.body);
  //Find channel via route parameter
  Channel.findOne({ _id: req.params.channelId }, function (err1, channel) {
    if (err1) {
      //handle errors
      next(err1)
    } else {
      //create the new post with the request body, which should be sent as a proper post format
      var newPost = new Post(req.body);
      //save the post
      newPost.save(function (err2) {
        if (err2) {
          //handle errors
          next(err2)
        } else {
          //push the saved post to the channel
          channel.posts.push(newPost);
          //save the channel
          channel.save(function (err3) {
            if (err3) {
              //handle errors
              next(err3)
            } else {
              //if no errors, post creation was a success, respond accordingly

              Post.populate(newPost, { path: '_persona', model: 'Persona' }, function (err4, populatedPost) {
                if (err4) {
                  next(err4)
                } else {
                  console.log("Successfully created new message")
                  res.json({ success: true, message: "Successfully created new post", post: populatedPost })
                }

              })
            }
          })
        }
      })
    }
  })
}

exports.allForChannel = function (req, res, next) {
  //This route is basically just a "get channel" route but with all the posts populated
  console.log("Entered posts.allForChannel");
  console.log("BODY OF REQUEST: ", req.body);
  //find channel via route parameter
  Channel.findOne({ _id: req.params.channelId }).populate('posts').exec(function (err, channel) {
    if (err) {
      //handle errors
      next(err)
    } else {
      console.log("Found channel, populated posts")
      console.log(channel)
      res.json({ success: true, message: "Successfully retrieved posts/channel", channel: channel })
    }

  })

}


