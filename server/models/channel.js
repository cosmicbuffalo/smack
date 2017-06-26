var mongoose = require('mongoose'),
    Schema = mongoose.Schema


channelSchema = new mongoose.Schema ({

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
    _members : [{
        type : Schema.Types.ObjectId, 
        ref : "Persona"
    }],

    _posts : [{
        type : Schema.Types.ObjectId, 
        ref : "Post"
    }],
    
    _files : [{
        type: Schema.Types.ObjectId, 
        ref : "File"
    }]

    

})

mongoose.model("Channel", channelSchema);