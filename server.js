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
  request = require('request'),
  binaryjs = require('binaryjs'),
  colors = require('colors'),
  app = express();



// Configuration
app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.set('port', 8000);
});



// TODO MOVE THIS INTO A CONFIG FILE
SC = {
          client_id: "7974b5d410ba881ba78d78078a4197c1",
          client_secret : "77b487cc38666703febaf0df4850f815",
          token: "https://api.soundcloud.com/oauth2/token",
          redirect_uri: "/",
      };

var trackId;

function getMp3Stream (trackId) {
	src = 'http://api.soundcloud.com/tracks/' + trackId +'/stream?client_id='+ SC.client_id;
	// adding a stream bit throttler, which may crappify this is a little
	// but it will prevent under buffering of the stream
	throt = new Throttle({bps: 800 * 1024, chunksize: 200});
	// make an api get request using our API key
	hostedMp3 = request({
	  uri : src,
	  method: 'GET',
	  timeout: 10000,
	  followRedirect: true,
	}, function (error, response, body){
		// console.log('body response', body);
		console.log(response.request.uri.href, 'this is the response request');
		//write that shit in binary
	  return body;
	});
	// console.log(hostedMp3, 'inside the get mp3stream');
	// console.log(trackId, 'inside the trackId');
	// oooh that juicy 128kbps of mp3!
	return fs.createReadStream(hostedMp3);
}

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/track1/:trackId', function (req, res, trackId){
  // console.log(req);
  trackId = req.param('trackId');
  track1stream = getMp3Stream(trackId);
  res.set({'Content-Type': 'audio/mp3'});
  
});

app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

  // count = req.param('num');
var server = app.listen(app.settings.port);

var bs = new binaryjs.BinaryServer({server: server, route: 'track2enendp'});
console.log(bs, 'the binaryserver'.red);

// console.log(trackB, 'this is trackB');
bs.on('connection', function(client){
	console.log(client, 'this is the client');
});


console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);