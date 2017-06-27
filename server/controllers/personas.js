var Persona = mongoose.model('Persona');

//retrieves persona data based on persona id in param
exports.getPersona = function (req, res, next) {
  console.log("Entered get persona")
  Persona.findOne({ _id: req.params.currentPersonaId }).populate('_user').exec(function (err, persona) {
    if (err) {
      next(err);
    } else {
      console.log("Found persona!");
      res.json({ success: true, persona: persona });
    }
  })
}