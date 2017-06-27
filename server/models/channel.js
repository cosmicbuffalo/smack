var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    

channelSchema = new Schema ({

    name : {
        type : String,
        required : true,
        minlength : [5, 'Minimum length on channel name is 5 characters']
    },

    private : {
        type : Boolean,
        required: true
    }, 
    
    //Adding personas to specfic channels. 
    members : [{
        type : Schema.Types.ObjectId, 
        ref : "Persona"
    }],

    posts : [{
        type : Schema.Types.ObjectId, 
        ref : "Post"
    }],
    
    files : [{
        type: Schema.Types.ObjectId, 
        ref : "File"
    }],
    
    _team : {
        type : Schema.Types.ObjectId,
        ref: "Team"
    }

    

})

mongoose.model("Channel", channelSchema);