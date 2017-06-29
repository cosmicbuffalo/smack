var mongoose = require('mongoose'),
    Persona = mongoose.model('Persona'),
    Comment = mongoose.model('Comment'),
    Post = mongoose.model('Post');




exports.create = function (req, res, next) {
  console.log("Entered comments.create")
  console.log("BODY OF REQUEST: ", req.body);
  console.log("REQUEST PARAMS: ", req.params)
  postId = req.params.postId;
  personaId = req.body._persona;

  Post.findOne({ _id: postId }, function (findPostErr, post) {

    if (findPostErr) {
        next(findPostErr)
        // res.json({ success: false, message: "Could not find post with id: " + postId, errors: "Couldn't add comment to post!" })

    } else {
      console.log("Found post, finding persona")
      Persona.findOne({ _id: personaId }, function (findPersonaErr, persona) {

        if (findPersonaErr) {
          next(findPersonaErr)
          // res.json({ success: false, message: "Could not find persona with id: " + personaId, errors: "Couldn't add comment to post!" })

        } else {
          console.log("Found persona")
          console.log("Post: ", post)
          console.log("Persona: ", persona)
          var newComment = new Comment({
              content: req.body.content,
              _persona: persona,
              _post: post
          });
          console.log("Attempting to save comment")
          newComment.save(function (newCommentSaveErr) {

            if (newCommentSaveErr) {
              next(newCommentSaveErr)
              // res.json({ success: false, message: "Could not save new comment!", errors: "Comment failed to be created!" })

            } else {
              console.log("Saved comment, pushing to post")
              post.comments.push(newComment)
              // persona.comments.push(newComment)
              console.log("Attempting to save post")
              post.save(function(postSaveErr){
                if (postSaveErr){
                  next(postSaveErr)
                } else {
                  console.log("Saved post, comment was created successfully!")
                  
                  res.json({succes:true, comment:newComment})
                }
              })

            }
          })
        }
      })

    }
  })
}

exports.delete = function (req, res) {

    var postId = req.params.postId,
        commentId = req.params.commentId

    Post.update(
        { _id: postId },
        {
            $pull: { comments: { $in: commentId } },
            multi: false
        },

        function (postUpdateErr) {

            if (postUpdateErr) {

                res.json({ success: false, message: "Could not delete Post reference  to comment with commentId " + commentId, errors: "Could not delete comment!" })

            } else {

                Comment.remove({ _id: commentId }, true, function (commentRemoveErr) {

                    if (commentRemoveErr) {

                        res.json({ success: false, message: "Comment with Id: " + commentId + " has not been removed", errors: "Comment failed to be removed!" })

                    } else {

                        res.json({ sucess: true, message: "comment with Id: " + commentId + "removed!" })
                    }
                })
            }
        })
}

exports.update = function (req, res) {

    var commentId = req.params.commentId,
        updatedComment = req.body.comment

    Comment.update({
        _id: commentId
    },
        { $set: { content: updatedComment } },
        function (commentUpdateErr) {

            if (commentUpdateErr) {

                res.json({ success: false, message: "Could not update Comment with Id: " + commentId, errors: "Could not update comment!" })

            } else {

                res.json({ success: true, message: "Comment with Id: " + commentId + "has been updated!" })
            }
        })
}
