
//initialize app
var app = require('./modules/app.js')

//set up factories
require('./factories/userFactory.js')(app)

require('./factories/teamFactory.js')(app)



//set up controllers
require('./controllers/findTeamController.js')(app)

require('./controllers/loginController.js')(app)

// require('./controllers/users.js')(app)

require('./controllers/mainController.js')(app)
