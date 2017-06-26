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

}

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
    })
}