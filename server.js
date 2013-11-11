/**
 * Module dependencies.
 */

var express = require('express'),
 http = require('http'),
  util = require('util'),
  T = require('timbre'),
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
  app.use(express.session());
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

src = 'http://api.soundcloud.com/tracks/109216345/stream?client_id='+ SC.client_id;
// console.log(request.get(src), "this is the first request")
testing = request({
  uri : src,
  method: 'GET',
  timeout: 10000,
  followRedirect: true,
}, function (error, response, body){
  return body;
});
//write that shit in binary
testing.pipe(fs.createWriteStream('test.mp3')).on('finish', function (){
  // oooh that juicy 128kbp of mp3!
  console.log(fs.createReadStream('test.mp3').pipe(new lame.Decoder));
  fs.createReadStream('test.mp3').pipe(new lame.Decoder).on('format', console.log).pipe(new speaker);
});


// console.log(T('audio'));

// T('audio').load(item, function (){
//   console.log(item)
//   this.play();
// })

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/twitterProfile/:num', function (req, res){
  res.contentType('application/json');
  count = req.param('num');
});

var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);