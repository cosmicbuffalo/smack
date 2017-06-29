var mongoose = require('mongoose')
var Persona = mongoose.model('Persona');
var Team = mongoose.model('Team');
var User = mongoose.model('User')

//retrieves persona data based on persona id in param
exports.getPersona = function (req, res, next) {
  console.log("Entered get persona")
  console.log("BODY OF REQUEST: ", req.body)
  console.log("REQUEST PARAMS: ", req.params)
  Persona.findOne({ _id: req.params.personaId }).populate('_user').exec(function (err, persona) {
    if (err) {
      next(err);
    } else {
      console.log()
      console.log("Found persona!");
      res.json({ success: true, persona: persona });
    }
  })
}

exports.create = function (req, res, next) {
  console.log("Entered personas.create")
  console.log("BODY OF REQUEST: ", req.body)
  console.log("REQUEST PARAMS: ", req.params)

  Team.findOne({url:req.params.teamUrl}, function(err, team){
    if (err){
      next(err);
    } else {
      console.log("Found team, finding user")
      User.findOne({email:req.body.email}, function(err, user){
        if (err){
          next(err);
        } else {
          console.log("Found user, creating persona")
          var newPersona = new Persona(req.body);
          newPersona._team = team;
          newPersona._user = user;
          newPersona.save(function(err2){
            if (err2){
              next(err2);
            } else {
              console.log("Saved persona, pushing to team")
              team.personas.push(newPersona);
              team.save(function(err3){
                if (err3){
                  next(err3);
                } else {
                  console.log("Saved team, pushing to user")
                  user.personas.push(newPersona);
                  user.save(function(err4){
                    if(err4){
                      next(err4);
                    } else {
                      console.log("Successfully created persona")
                      res.json({success:true, persona:newPersona})
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


exports.update = function(req, res, next){

  console.log("Entered personas.update")
  console.log("BODY OF REQUEST: ", req.body)
  console.log("REQUEST PARAMS: ", req.params)

  Persona.findOne({_id:req.params.personaId}, function(err, persona){
    if (err){
      next(err);
    } else {
      console.log("Found persona, updating password before save")
      persona.password = req.body.password
      if(req.body.username){
        persona.username = req.body.username
      }
      persona.save(function(err2){
        if (err2){
          next(err2);
        } else {
          console.log("Successfully updated persona")
          res.json({success:true, persona:persona})
        }
      })


    }

  })


}
