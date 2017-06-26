var mongoose = require('mongoose'),
    Schema = mongoose.Schema


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
    _personas : [{
        type: Schema.Types.ObjectId, 
        ref : "Persona"
    }],
    // One to many Relationship Personas can browse the channels in the Team
    _channels : [{
        type: Schema.Types.ObjectId, 
        ref : "Channel"
    }]
})
//---------------------- Presave Create channels  (general and random)------------------
// teamSchema.pre()

mongoose.model('Team', teamSchema);