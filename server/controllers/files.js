var mongoose = require('mongoose'),
    Persona = mongoose.model('Persona'),
    File = mongoose.model('File'),
    uploader = require('./upload_helper')

exports.create = function (req, res) {
    var self = this
    console.log('User req:  ' , req.body)
    uploader.upload(req, res, function (uploadErr) {

        console.log(req.file);
        if (uploadErr) {
            res.json({ err: uploadErr })
        } else {
            res.json({ success: true, message: "files and relationships created!" })
            //do that
        }
    })
}

exports.allForChannel = function(req, res){

    channelId = req.params.channelId
    
    File.find({_channel : channelId }, function(findFileErr, files){
        
        if (findFileErr){

            res.json({success: false, message: "Could not find files with channel id: " + channelId, errors: "Couldn't find channels files!"})
        }
        else{

            res.json({succes : true, message: "Found the files with channel id: " + channelId, files: files})
        }
    })
}

exports.allForUser = function(req, res ) { 
    personaId = req.params.personaId

    File.find({ _persona: personaId, profilePic : {$ne: true} }, function(findFileErr, files){

        if  (findFileErr){
            
            res.json({success: false, message: "Could not find files with persona id: " + personaId, errors: "Couldn't find users files!" })
        
        }else{
        
            res.json({ success : true, message: "found all personas' files", files: files})
        }
    })


}