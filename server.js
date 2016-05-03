var express = require('express');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var fs = require('fs');

var _ = require('lodash')

var http = require('http');
var cors = require('cors');

var bcrypt = require('bcrypt');

var rules = require('./modules/rules.js')


var mongocn = process.env.MONGO_URL || "mongodb://localhost:27017/votidb";
var db = require('./modules/mongoHandler.js')(mongocn)

var CanIDoServices = require('./modules/canIDoServices.js')({
	_: _,
	db: db
})




var app = express()

var httpServ = http.createServer(app)



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors())

app.use(express.static('www'))
app.use(morgan("combined"))

var router = express.Router()

var seneca = require('seneca')();

var classes = require('./modules/classes.js');

var CanIDoServices = require('./modules/canIDoServices.js')({
	_: _,
	db: db,
	rules: rules,
	classes: classes
})



var libs = {
	db: db,
	_: _,
	bcrypt: bcrypt,
	CanIDoServices: CanIDoServices,
	rules: rules,
	classes: classes
}

seneca.use('./modules/sen.loginActions.js', libs);
seneca.use('./modules/sen.dealWithUserAction.js', libs);
//seneca.use('./modules/sen.questionActions.js', libs);
//seneca.use('./modules/idActions.js', libs);



eval(fs.readFileSync('./modules/routes.js') + '');



initRouter(router,app);


var server = httpServ.listen(5000, function() {
	var host = server.address()
		.address;
	var port = server.address()
		.port;
	console.log('server.js started, listening at http://%s:%s', host, port);
});


