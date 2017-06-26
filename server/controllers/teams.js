var mongoose = require('mongoose')
var Team = mongoose.model('Team')
var Persona = mongoose.model('Persona')


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
