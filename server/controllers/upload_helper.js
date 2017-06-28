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

        console.log("File req: " , req.body);

        Persona.findOne({ _id: req.body.personaId }, function (findPersonaErr, persona) {

            if (findPersonaErr) {
                console.log('Could not find Persona with Id: ' + req.body.persona)
            
            } else {
                
                var newfile = new File({
                    _persona: persona,
                    pinned: false
                })

                newfile.save(function(){
                    
                    if (req.params.channelId) {
                    
                        Channel.findOne({ _id: req.params.channelId }, function (findChannelErr, channel) {
                    
                            if (findChannelErr) {
                    
                                console.log("Could not find Channel with Id: " + req.params.channelId)
                    
                            } else {
                    
                                newfile._channel = channel._id
                            }
                        })
                    }
                    if (req.body.forProfilePicture) {
                        
                        newfile.profilePic = req.body.forProfilePicture
                    }
                    var filePath = file.fieldname + '-' + newfile._id + fileExtensions[file.mimetype]
                    
                    newfile.filePath = "/uploads/" + filePath
                    
                    console.log(file)
                    
                    newfile.save(function (saveErr) {
                        if (saveErr) {
                            console.log(saveErr)
                        } else {

                            // returnFilePath(filePath)

                            cb(null, filePath)

                        }
                    })
                })
            }
        })
    }
});

exports.upload = multer({ storage: storage }).single('fileUpload');