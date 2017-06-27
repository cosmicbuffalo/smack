var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Channel = mongoose.model('Channel');

teamSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        minlength : [5, "Teamname required to be atleast 5 characters long "]
    },
    //url will just be the same as the name but all lowercase with no spaces
    url : { 
        type : String,
        required : true
    },
    // One to many relationship. Has many personas (who are users) in a team.
    personas : [{
        type: Schema.Types.ObjectId, 
        ref : "Persona"
    }],
    // One to many Relationship Personas can browse the channels in the Team
    channels : [{
        type: Schema.Types.ObjectId, 
        ref : "Channel"
    }]
})
//---------------------- Presave Create channels  (general and random)------------------
teamSchema.pre('save', function(done){
    var self = this;
    var randomChannel = new Channel({
        name : "Random",
        private : false,
        _team : self._id
    })
    var generalChannel = new Channel({
        name : "General",
        private : false,
        _team : self._id
    })

    //Creates two default channels upon team creation
    // Will log Error for which team it failed to created basic channels for.
    randomChannel.save(function(randomErr){
        if (randomErr){
            console.log("Random Channel for: " + self.name + "team")
        }else{
            generalChannel.save(function(generalErr){
                if (generalErr){
                    console.log('General Channel for: ' + self.name + "team")
                }else {
                    self.channels.push(randomChannel._id);
                    self.channels.push(generalChannel._id);
                    done();
                }
            })
        }
    })
});

mongoose.model('Team', teamSchema);