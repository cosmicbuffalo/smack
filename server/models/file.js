var mongoose = require('mongoose'),
    Schema = mongoose.Schema

fileSchema = new mongoose.Schema({

    _persona : {
        type : Schema.Types.ObjectId, ref : "Personas",
        required : true
    },


    // File could be for a profile picture hence why I didnt make it required.
    _post : {
        type : Schema.Types.ObjectId, ref : "Posts",
        required : false
    },

    // File does not neccessarily need a channel!
    _channel : {
        type : Schema.Types.ObjectId, ref : "Channels",
        required : false
    },

    // -------------------- file_path  ------------------------
    //     WILL UPDATE SOON!
    //User may save it to their side scroll for important files they want to keep track of.
    pinned : {
        type : Boolean,
        required : true
    },

    // Boolean field required to help the search feature so that way we can filter out results.. we dont want people look at others stuff :D
    profile_pic : {

        type: Boolean,
        required : true
    }




})    