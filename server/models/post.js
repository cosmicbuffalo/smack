var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    



postSchema = new mongoose.Schema ({
    // post does not require the user to type something... could be a file or link
    content : {
        type: String,
        required : false
    },

    _persona : {
        type : Schema.Types.ObjectId, ref : "Personas",
        required : true
    },

    _channel : {
        type : Schema.Types.ObjectId, ref : "Channels",
        required : true
    },
    // post does not require user to upload a file each time.
    _file : {
        type : Schema.Types.ObjectId, ref : "Files",
        required : false
    },

    // personas can comment on these Posts
    _comments : {
        type : Schema.Types.ObjectId, ref : "Comments"
    }



})

mongoose.model('Posts', postSchema);