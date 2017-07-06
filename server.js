var express  = require( 'express' ),
    bp       = require('body-parser'),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    app      = express();

app.use(express.static( path.join( root, './client' )));
app.use(express.static( path.join( root, './bower_components')));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(bp.json())
app.use(bp.urlencoded({extended:true}))



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

var server = app.listen(process.env.PORT || 7000);
// var server = app.listen( port, function() {
//   console.log( `server running on port ${ port }` );
// });

var io = require('socket.io').listen(server);
var connections = require('./server/config/connections')
connections(io)
