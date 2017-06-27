var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Comment = mongoose.model('Comment'),
    File = mongoose.model('File')
    



postSchema = new mongoose.Schema ({
    // post does not require the user to type something... could be a file or link
    content : {
        type: String,
        required : false
    },
    notification : {
        type: Boolean,
        required: false
    },

    _persona : {
        type : Schema.Types.ObjectId, 
        ref : "Persona",
        required : true
    },

    _channel : {
        type : Schema.Types.ObjectId, 
        ref : "Channel",
        required : true
    },
    // post does not require user to upload a file each time.
    _file : {
        type : Schema.Types.ObjectId, 
        ref : "File",
        required : false
    },

    // personas can comment on these Posts
    comments : [{
        type : Schema.Types.ObjectId, 
        ref : "Comment"
    }]



})

postSchema.pre('remove', function(next){
     // Remove all the assignment docs that reference the removed post.
    var self = this
    Comment.remove({_post : self._id}).exec();
    File.remove({_post : self._id}).exec();
    next();
})


mongoose.model('Post', postSchema);