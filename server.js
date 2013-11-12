/**
 * Module dependencies.
 */

var express = require('express'),
 http = require('http'),
	util = require('util'),
	T = require('timbre'),
	Throttle = require('throttle'),
	fs = require('fs'),
	lame = require('lame'),
	speaker = require('speaker'),
	request = require('request'),
	mp3_decode = require('timbre/src/extras/mp3_decode'),
	jsmad = require('timbre/src/extras/jsmad'),
	app = express();



// Configuration
app.configure(function () {
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// app.use(express.session());
	app.use(app.router);
});

app.configure('development', function () {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
	app.set('port', 8000);
});

SC = {
	client_id: "7974b5d410ba881ba78d78078a4197c1",
	client_secret : "77b487cc38666703febaf0df4850f815",
	token: "https://api.soundcloud.com/oauth2/token",
	redirect_uri: "/",
	};


var src;




// Routes
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/blank', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/track1/:soundCloudId', function (req, res) {
	scId = req.param('soundCloudId');
	src = 'http://api.soundcloud.com/tracks/' + scId+ '/stream?client_id='+ SC.client_id;
	console.log(src);
	getMp3 = request({
				uri : src,
				method: 'GET',
				timeout: 10000,
				followRedirect: true,
		}, function (error, response, body){
				return body;
		});
		//write that shit in binary
		 getMp3.pipe(fs.createWriteStream('track1.mp3')).on('finish', function() {
		 	unthrottledStream = fs.createReadStream('track1.mp3');
		 	throt = new Throttle({bps: 800 * 1024, chunksize: 200});
		 	unthrottledStream.pipe(throt).pipe(new lame.Decoder).pipe(new speaker);
		 });
		});
	 
});

app.get('/track2/:id', function (req, res) {
	var id = req.param('id');
	res.sendfile(__dirname + 'track2.mp3');
});


	// count = req.param('num');
var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);


