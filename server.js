var express  = require( 'express' ),
    bp       = require('body-parser'),
    mongodb  = require('mongodb'),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    app      = express();

var mongoObjID = mongodb.ObjectID

app.use(express.static( path.join( root, './client' )));
app.use(express.static( path.join( root, './bower_components')));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(bp.json())
app.use(bp.urlencoded({extended:true}))

var db;

//run schema to prep database
require('./server/config/mongoose')

//configure routes
var router = require('./server/config/routes')
router(app)

app.use(function(err, req, res, next) {
  console.log("Entered generic error handler")
  console.log(err)
  res.status(err.status || 500);
  res.json({
    success:false,
    message: err.message,
    errors: err
  });
});

// app.listen( port, function() {
//   console.log( `server running on port ${ port }` );
// });


mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen( port, function () {
    console.log("App now running on port", port);
  });
});