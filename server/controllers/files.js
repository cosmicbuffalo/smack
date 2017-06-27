var mongoose = require('mongoose'),
    Persona = mongoose.model('Persona'),
    File = mongoose.model('File'),
    multer = require('multer');

var fileExtensions = {
    'image/gif': '.gif',
    'text/plain': '.txt',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'application/zip': '.zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/pdf': '.pdf',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.ms-powerpoint': 'ppt'
}


var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/')

    },
    filename: function (req, file, cb) {

        Persona.findOne({ _id: req.body.personaId }, function (findPersonaErr, persona) {
            if (findPersonaErr) {
                console.log('Could not find Persona with Id: ' + req.body.persona)
            } else {
                var file = new File({
                    _person: persona,
                    pinned: false
                })
                if (req.params.channelId) {
                    Channel.findOne({ _id: req.params.channelId }, function (findChannelErr, channel) {
                        if (findChannelErr) {
                            console.log("Could not find Channel with Id: " + req.params.channelId)
                        } else {
                            file._channel = channel._id
                        }
                    })
                }
                if (req.body.forProfilePicture) {
                    file.profilePic = req.body.forProfilePicture
                }

                var filePath = file.fieldname + '-' + file._id + fileExtensions[file.mimetype]
                file.filePath = filePath
                file.save(function (saveErr) {
                    if (saveErr) {
                        console.log('Could not save file!')
                    } else {

                        // returnFilePath(filePath)

                        cb(null, filePath)

                    }
                })
            }
        })
    }
});

var upload = multer({ storage: storage }).single('fileUpload');






exports.create = function (req, res) {
    // req.body
    upload(req, res, function (uploadErr) {

        console.log(req.file);
        if (err) {
            res.json({ err: uploadErr })
        } else {
            res.json({ success: true, message: "files and relationships created!" })
            //do that
        }
    })


}