var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Post = mongoose.model('Post');
    
    

channelSchema = new Schema ({

    name : {
        type : String,
        required : true,
        minlength : [5, 'Minimum length on channel name is 5 characters']
    },
    purpose : {
        type: String,
        required : true, 
        minlength : [10, "Minimum length of a channel purpose is 10 characters"]
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
    
    team : {
        type : Schema.Types.ObjectId,
        ref: "Team"
    }

    

})
channelSchema.pre('remove', function(next) {
    var self = this
    // Remove all the assignment docs that reference the removed channel.
    Post.remove({ _channel : self._id }).exec();
    File.remove({_channel : self._id}).exec();
    next();
});

mongoose.model("Channel", channelSchema);