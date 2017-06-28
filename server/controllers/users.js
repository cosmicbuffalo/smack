var mongoose = require('mongoose'),
    User = mongoose.model('User')

exports.index = function (req, res, next) {

  console.log("Entered users.index")

  User.find({}).populate('personas').exec(function (err, users) {
    if (err) {
      next(err);
    } else {
      console.log("Found users!");
      res.json({ success: true, users: users });
    }
  })

}
