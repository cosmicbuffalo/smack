var mongoose = require('mongoose')
var Team = mongoose.model('Team')
var Persona = mongoose.model


exports.create = function (request, response) {

    console.log("Entered teams.create")
    console.log("BODY OF REQUEST: ", request.body)

    var newTeam = new Team(request.body)

    newTeam.save(function (err) {
        if (err) {
            console.log(err)
            res.json({ result: "failure", errors: err })
        } else {
            console.log("Successfully created new team")
            res.json({ result: "success", team: newTeam })
        }
    })

};

exports.login = function (req, res) {
    console.log(req.body);
    //find team based on route param
    Team.findOne({ url: req.params.teamUrl }, function (err, team) {
        if (err) {
            console.log(err);
            res.json({ errors: err });
        } else if (!team) {
            console.log("team not found");
            res.json({ errors: "The team does not exist" });
        }
        //if team found, search team personas for persona with matching email
        else {
            console.log("team exists");
            Persona.findOne({ email: req.body.email, _team: team }, function (err, persona) {
                if (err) {
                    console.log(err);
                    res.json({ errors: err });
                } else if (!persona) {
                    console.log("persona not found");
                    res.json({ errors: "The persona does not exist" });
                } else {
                    if (bcrypt.compareSync(req.body.password, persona.password)) {
                        res.json({ persona: persona })
                    } else {
                        res.json({ errors: "passwords do not match" })
                    }

                }
            });

        }
    });
};
exports.invite = function (req, res) {
    console.log(req.body);
    //find team based on route param
    Team.findOne({ url: req.params.teamUrl }, function (err, team) {
        if (err) {
            console.log(err);
            res.json({ errors: err });
        } else if (!team) {
            console.log("team not found");
            res.json({ errors: "The team does not exist" });
        }
        //if team found, check if user exists
        else {
            console.log("team exists");
            //find user and check for persona in user
            User.findOne({ email: req.body.email }).populate('_personas').exec(function (err, user) {
                if (err) {
                    console.log(err);
                    console.log("Unable to find user with email: ", req.body.email)
                    res.json({ result: "failure", message: "Unable to find user with requested email", errors: err })
                }
                else {
                    //if no user create the user with the email in req.body
                    if (!user) {
                        //create user with email
                        user = new User({ email: req.body.email });
                    }
                    //if user found, create/push persona in user
                    console.log("Got user, ...")
                    var newPersona = new Persona({ email: req.body.email });
                    newPersona.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.json({ result: "failure", message: "Error during create newpersona", errors: err })
                        } else {
                            console.log("Attempting to save persona to user")
                            team.personas.push(newPersona);
                            team.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.json({ result: "failure", message: "Error during comment creation/saving to message", errors: err })
                                } else {
                                    console.log("Attempting to save comment to user")
                                    user.personas.push(newPersona);
                                    user.save(function (err) {
                                        if (ere) {
                                            console.log(err);
                                            res.json({ result: "failure", message: "Error during comment creation/saving to user", errors: err })
                                        } else {
                                            console.log("comment saved to message and user successfully")
                                            res.json({ result: "success", message: "Successfully created comment on message" })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
};
exports.invite = function (req, res) {

    Message.findOne({ _id: req.params.message_id }, function (err1, message) {
        if (err1) {
            console.log(err1);
            console.log("Unable to find message with id: ", req.params.message_id)
            res.json({ result: "failure", message: "Unable to find message with requested ID, comment creation failed", errors: err1 })
        } else {
            console.log("Got message, finding user now...")
            User.findOne({ _id: req.body.user_id }, function (err2, user) {
                if (err2) {
                    console.log(err2);
                    console.log("Unable to find user with id: ", req.body.user_id)
                    res.json({ result: "failure", message: "Unable to find user with requested ID, comment creation failed", errors: err2 })
                } else {
                    console.log("Got user, creating new comment now...")
                    var comment = new Comment({ text: req.body.text })
                    comment._user = user.id
                    comment.save(function (err3) {
                        if (err3) {
                            console.log(err3);
                            res.json({ result: "failure", message: "Error during comment creation/saving comment", errors: err3 })
                        } else {
                            console.log("Attempting to save comment to message")
                            message.comments.push(comment);
                            message.save(function (err4) {
                                if (err4) {
                                    console.log(err4);
                                    res.json({ result: "failure", message: "Error during comment creation/saving to message", errors: err4 })
                                } else {
                                    console.log("Attempting to save comment to user")
                                    user.comments.push(comment);
                                    user.save(function (err5) {
                                        if (err5) {
                                            console.log(err5);
                                            res.json({ result: "failure", message: "Error during comment creation/saving to user", errors: err5 })
                                        } else {
                                            console.log("comment saved to message and user successfully")
                                            res.json({ result: "success", message: "Successfully created comment on message" })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}