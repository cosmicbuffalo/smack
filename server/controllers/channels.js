var mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  Channel = mongoose.model('Channel'),
  Persona = mongoose.model('Persona'),
  Post = mongoose.model('Post');


exports.create = function (req, res, next) {
  console.log("Creating new channel with the teamId: " + req.params.teamId);

  Team.findOne({ _id: req.params.teamId }, function (teamFindErr, team) {
    if (teamFindErr) {

      // res.json({ success: false, message: "Could not find Team with Id: " + req.params.teamId, errors: "No such Team exists!" })
      next(teamFindErr)
    } else {
      console.log('team found')
      Persona.findOne({ _id: req.body.personaId }, function (personaFindErr, persona) {

        if (personaFindErr) {

          // res.json({ success: false, message: "Could not find persona with Id: " + req.body.personaId, errors: "No such User exists!" })
          next(personaFindErr)
        } else {
          console.log('persona found')
          var newChannel = new Channel({
            name: req.body.teamName,
            private: req.body.private,
            purpose: req.body.purpose,
            _team: team
          })
          newChannel.members = [persona];

          newChannel.save(function (newChannelSaveErr) {

            if (newChannelSaveErr) {

              // res.json({ success: false, message: "Could not create new Channel Document in Channel Collection.. The object failed validations ", errors: "Channel Failed to be created!" })
              next(newChannelSaveErr)
            } else {
              team.channels.push(newChannel)
              team.save(function (teamSaveErr) {
                if (teamSaveErr) {
                  next(teamSaveErr)
                } else {
                  console.log('working!')
                  res.json({ success: true, message: "New Channel was created with Id: " + newChannel._id + "with personaId: " + persona._id + " as its first member" })
                }
              })

            }
          })
        }
      })
    }
  })
}

exports.update = function (req, res) {

  Channel.update({ _id: req.params.channelId }, { $set: req.body }, function (channelUpdateErr) {

    if (channelUpdateErr) {

      res.json({ success: false, message: "Channel with id:" + req.params.channelId + " was not updated ", errors: "channel update was unsuccessful!" })

    } else {

      res.json({ success: true, message: "Channel with id: " + req.params.channelId + "successfully updated!" })

    }
  })
}

exports.delete = function (req, res) { // true means it is removing just one
  channelId = mongoose.Types.ObjectId(req.params.channelId);
  teamId = mongoose.Types.ObjectId(req.params.teamId);

  Team.update(
    { _id: teamId },
    {
      $pull: { channels: { $in: channelId } },
      multi: false
    },
    function (teamUpdateErr) {

      if (teamUpdateErr) {

        res.json({ success: false, message: "Could not delete Team reference  to channel with channelId " + channelId, errors: "Could not delete channel!" })

      } else {

        Channel.remove({ _id: channel }, true, function (channelRemoveErr) {

          if (channelRemoveErr) {

            res.json({ success: false, message: "Channel with Id: " + channel + " has not been removed", errors: "Channel failed to be removed!" })

          } else {

            res.json({ sucess: true, message: "Channel with Id: " + channel + "removed!" })
          }
        });
      }

    })
}

exports.invite = function (req, res) {
  console.log("Entered channels.invite")
  var channelId = req.params.channelId,
    personaId = req.body.personaId

  console.log("Finding channel with channel ID: ", channelId)
  Channel.findOne({ _id: channelId }, function (channelfindErr, channel) {
    if (channelfindErr) {
      next(channelfindErr)
    } else {

      console.log("Found channel, finding persona with ID: ", personaId)
      Persona.findOne({ _id: personaId }, function (findPersonaErr, persona) {
        if (findPersonaErr) {
          next(findPersonaErr)
        } else {

          console.log("Found persona, pushing persona into channel.members")
          channel.members.push(persona)
          console.log("Saving channel")
          channel.save(function (channelSaveErr) {
            if (channelSaveErr) {
              next(channelSaveErr)
            } else {

              console.log("Successfully invited persona to channel!")
              res.json({ success: true, message: "Channel successfully added persona with Id: " + persona._id })
            }
          })
        }
      })

    }
  })
}


exports.show = function (req, res, next) {
  console.log("Entered channels.show")
  console.log("BODY OF REQUEST: ", req.body);
  console.log("REQUEST PARAMS: ", req.params)

  Channel.findOne({ _id: req.params.channelId }).populate('members posts files').exec(function (err, channel) {
    if (err) {
      next(err);
    } else {
      console.log(channel)
      Channel.populate(channel, { path: 'posts.comments', model: "Comment" }, function (err2, populatedChannelRound1) {
        if (err2) {
          next(err2)
        } else {
          console.log("Populated comments of posts!")
          Channel.populate(channel, { path: 'posts._persona', model: "Persona" }, function (err3, populatedChannelRound2) {
            if (err3) {
              next(err3)
            } else {
              console.log("Populated personas of posts!")
              res.json({ success: true, channel: populatedChannelRound2 })
            }
          })

        }
      })

    }
  })
}
