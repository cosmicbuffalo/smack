var mongoose = require('mongoose'),
    Schema = mongoose.Schema


userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : false,
        minlength : [2, "name is too short"]
    },
    lastName : {
        type: String,
        required: false,
        minlength : [2, "name is too short"]
    },
    email : {
        type: String,
        required: true,
        validate: {
            validator: function (value){
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value)

            },
            message: "This email is not in proper format!"
        }
    },
    // ------ User can have mutliple personas that map on a one to one with teamsSchema (bascially a join table with additionally functions)
    personas : [{
        type: Schema.Types.ObjectId,
        ref: "Persona"
    }]

},{timestamps : true})

mongoose.model('User', userSchema);
