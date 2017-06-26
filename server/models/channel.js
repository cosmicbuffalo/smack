var mongoose = require('mongoose'),
    Schema = mongoose.Schema


channelSchema = new mongoose.Schema ({

    name : {
        type : String,
        required : true,
        minlength : [5, 'Minimum length on channel name must be 5 characters']
    },

    private : {
        type : Boolean,
        required: true
    }, 
    
    //Adding personas to specfic channels. 
    _members : [{
        type : Schema.Types.ObjectId, ref : "Personas",
        required: true
    }],

    _posts : [{
        type : Schema.Types.ObjectId, ref : "Posts",
        required : true
    }],
    
    _files : [{
        type: Schema.Types.ObjectId, ref : "Files"
    }]

    

})

mongoose.model("Channels", channelSchema);