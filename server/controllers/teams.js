var mongoose = require('mongoose')
var Team = mongoose.model('Team')
var Persona = mongoose.model('Persona')
var User = mongoose.model('User')


exports.index = function (req, res, next) {

  console.log("Entered teams.index")

  Team.find({}).populate('channels personas').exec(function (err, teams) {
    if (err) {
      next(err);
    } else {
      console.log("Found teams!");
      res.json({ success: true, teams: teams });
    }
  })

}

exports.create = function (req, res, next) {

  console.log("Entered teams.create")
  console.log("BODY OF REQUEST: ", req.body)
  //create new team
  var newTeam = new Team(req.body)
  //save it
  newTeam.save(function (err) {
    if (err) {
      next(err)
    } else {
      console.log("Successfully created new team")
      res.json({ success: true, message: "Successfully created new team", team: newTeam })
    }
  })

};

exports.show = function (req, res, next) {
  console.log("Entered teams.show")
  console.log("BODY OF REQUEST: ", req.body);

  Team.findOne({ url: req.params.teamUrl }).populate('channels personas').exec(function (err, team) {
    if (err) {
      next(err);
    } else {
      Team.populate(team, { path: 'personas._user', model: "User" }, function (err2, populatedTeam) {
        if (err2) {
          next(err2)
        } else {
          console.log("Found team!")
          res.json({ success: true, team: populatedTeam })
        }
      })

    }
  })
}


exports.login = function (req, res, next) {
  console.log("Entered teams.login")
  console.log("BODY OF REQUEST: ", req.body);
  //find team based on route param
  Team.findOne({ url: req.params.teamUrl }, function (err, team) {
    if (err) {
      next(err)
    } else if (!team) {
      console.log("team not found");
      res.json({ success: false, error: "The team does not exist" });
    }
    //if team found, search team personas for persona with matching email
    else {
      console.log("team exists");
      Persona.findOne({ email: req.body.email, _team: team }, function (err, persona) {
        if (err) {
          next(err)
        } else if (!persona) {
          console.log("persona not found");
          res.json({ success: false, error: "The persona does not exist" });
        } else {
          if (bcrypt.compareSync(req.body.password, persona.password)) {
            res.json({ success: true, persona: persona })
          } else {
            res.json({ success: false, error: "passwords do not match" })
          }

        }
      });

    }
  });
};
exports.invite = function (req, res, next) {
  console.log("Entered teams.invite")
  console.log("BODY OF REQUEST: ", req.body);
  //find team based on route param
  Team.findOne({ url: req.params.teamUrl }, function (err, team) {
    if (err) {
      next(err)
    } else if (!team) {
      console.log("team not found");
      res.json({ success: false, error: "The team does not exist" });
    }
    //if team found, check if user exists
    else {
      console.log("team exists");
      //find user and check for persona in user
      User.findOne({ email: req.body.email }).populate('_personas').exec(function (err, user) {
        if (err) {
          next(err)
        }
        else {
          //if no user create the user with the email in req.body
          if (!user) {
            //create user with email
            user = new User({ email: req.body.email, personas: [] });
          }
          //if user found, create/push persona in user
          console.log("Got user, ...")
          var newPersona = new Persona({ email: req.body.email, _team: team, _user: user });
          console.log("Attempting to save persona")
          newPersona.save(function (err) {
            if (err) {
              // console.log(err);
              // res.json({ result: "failure", message: "Error during create newpersona", errors: err })
              next(err)
            } else {
              console.log("Attempting to save persona to team")
              team.personas.push(newPersona);
              team.save(function (err) {
                if (err) {
                  // console.log(err);
                  // res.json({ result: "failure", message: "Error during comment creation/saving to message", errors: err })
                  next(err)
                } else {
                  console.log("Attempting to save persona to user")
                  console.log(user)
                  user.personas.push(newPersona);
                  user.save(function (err) {
                    if (err) {
                      // console.log(err);
                      // res.json({ result: "failure", message: "Error during comment creation/saving to user", errors: err })
                      next(err)
                    } else {
                      console.log("Persona saved to team and user successfully")
                      res.json({ success: true, message: "Successfully created persona for team", persona: newPersona })
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
