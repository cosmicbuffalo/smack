var mongoose = require('mongoose'),
    Schema = mongoose.Schema


teamSchema = new mongoose.Schema({

    name : {
        types : String,
        required : true,
        minlength : [5, "Teamname required to be atleast 5 characters long "]
    },
    // One to many relationship. Has many personas (who are users) in a team.
    _personas : [{
        type: Schema.Types.ObjectId, ref : "Personas"
    }],
    // One to many Relationship Personas can browse the channels in the Team
    _channels : [{
        type: Schema.Types.ObjectId, ref : "Channels"
    }]
})
//---------------------- Presave Create channels  (general and random)------------------
// teamSchema.pre()

mongoose.model('Teams', teamSchema);