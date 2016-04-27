var express = require('express');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var fs = require('fs');

var _ = require('underscore')

var http = require('http');
var cors = require('cors');

var bcrypt = require('bcrypt');


var mongocn = process.env.MONGO_URL || "mongodb://localhost:27017/votidb";
//var mongocn = process.env.DOKKU_MONGO_VOTIDB_PORT_27017_TCP.replace('tcp://','mongodb://miki:miki@') + '/' + "votidb"

console.log('mongo connection string: ',mongocn)

var dbFuncs = require('./modules/dbFuncs.js')

var CanIDoServices = require('./modules/canIDoServices.js')({
	_: _,
	dbFuncs: dbFuncs
})

var rules = require('./modules/rules.js')


dbFuncs.connect(mongocn)


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

var CanIDoServices = require('./modules/canIDoServices.js')({
	_: _,
	dbFuncs: dbFuncs,
	rules: rules
})

var libs = {
	dbFuncs: dbFuncs,
	_: _,
	bcrypt: bcrypt,
	CanIDoServices: CanIDoServices,
	rules: rules
}

seneca.use('./modules/loginActions.js', libs);
seneca.use('./modules/voteActions.js', libs);
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


