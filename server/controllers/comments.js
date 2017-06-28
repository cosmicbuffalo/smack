var mongoose = require('mongoose'),
    Persona = mongoose.model('Persona'),
    Comment = mongoose.model('Comment'),
    Post = mongoose.model('Post');




exports.create = function (req, res) {

    postId = req.params.postId;
    personaId = req.body.personaId;

    Post.findOne({ _id: postId }, function (findPostErr, post) {

        if (findPostErr) {

            res.json({ success: false, message: "Could not find post with id: " + postId, errors: "Couldn't add comment to post!" })

        } else {

            Persona.findOne({ _id: personaId }, function (findPersonaErr, persona) {

                if (findPersonaErr) {

                    res.json({ success: false, message: "Could not find persona with id: " + personaId, errors: "Couldn't add comment to post!" })

                } else {

                    var newComment = new Comment({
                        content: req.body.cotent,
                        _persona: persona,
                        _post: post
                    });

                    newComment.save(function (newCommentSaveErr) {

                        if (newCommentSaveErr) {

                            res.json({ success: false, message: "Could not save new comment!", errors: "Comment failed to be created!" })

                        } else {

                            res.json({ success: true })
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


