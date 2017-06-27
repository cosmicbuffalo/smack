var mongoose = require('mongoose'),
    Schema = mongoose.Schema

fileSchema = new mongoose.Schema({

    _persona : {
        type : Schema.Types.ObjectId, 
        ref : "Persona",
        required : true
    },


    // File could be for a profile picture hence why I didnt make it required.
    _post : {
        type : Schema.Types.ObjectId, 
        ref : "Post",
        required : false
    },

    // File does not neccessarily need a channel!
    _channel : {
        type : Schema.Types.ObjectId, 
        ref : "Channel",
        required : false
    },

    filePath : {
        type : String,
        required : true
    },
   
    pinned : {
        type : Boolean,
        required : true
    },

    // Boolean field required to help the search feature so that way we can filter out results.. we dont want people look at others stuff :D
    profilePic : {

        type: Boolean,
        required : true
    }




}, {timestamps:true})    

mongoose.model('File', fileSchema);