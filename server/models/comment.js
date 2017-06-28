var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },

    _persona :{
        type : Schema.Types.ObjectId, ref : "Persona",
        required : true
    },

    _post : {
        type : Schema.Types.ObjectId, ref : "Post",
        required : true
    }
    
 })




 mongoose.model("Comment", commentSchema);