/**
 * Module dependencies.
 */
'use strict';

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
    app.set('port', 9000);
});

// TODO MOVE THIS INTO A CONFIG FILE
var SC = {
        client_id: "7974b5d410ba881ba78d78078a4197c1",
        client_secret : "77b487cc38666703febaf0df4850f815",
        token: "https://api.soundcloud.com/oauth2/token",
        redirect_uri: "/"
    };

var trackId;

function getMp3Stream(trackId) {
    var src = 'http://api.soundcloud.com/tracks/'  + trackId + '/stream?client_id=' + SC.client_id,
    // adding a stream bit throttler, which may crappify this is a little
    // but it will prevent under buffering of the stream
    throt = new Throttle({bps: 800 * 1024, chunksize: 200}),
    // make an api get request using our API key
    hostedMp3 = request({
        uri : src,
        method: 'GET',
        timeout: 10000,
        followRedirect: true
    }, function (error, response, body) {
    // console.log('body response', body);
    if (error) {
      console.log ('Oops we crapped out somewhere, here is the last bit of request'.red, response);
     }
    console.log(response.request.uri.href, 'this is the response request');
    //write that shit in binary
    return body;
  });
  // console.log(hostedMp3, 'inside the get mp3stream');
  // console.log(trackId, 'inside the trackId');
  // oooh that juicy 128kbps of mp3!
  return fs.createReadStream(hostedMp3).pipe(throt);
}

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.param('scTrackId', function(){
  var scTrackId;
  return console.log(scTrackId);
});

app.get('/track1/:scTrackId', function (req, res, scTrackId){
  // console.log(req);
  var trackId = req.param('scTrackId'), track1stream = getMp3Stream(trackId);
  res.set({'Content-Type': 'audio/mp3'});
  return track1stream;
});

app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

var outsiteref = app;

  // count = req.param('num');
var server = app.listen(app.settings.port);


var bs = new binaryjs.BinaryServer({server: server, path: 'track1/:scTrackId'});

bs._server.prototype.appref =  console.log('im a prototyped method');

console.log('the binaryserver'.red);
console.log(bs);
console.log(bs._server.app);
bs.on('connection', function(client){
  console.log(client, 'this is the client');
});


console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);