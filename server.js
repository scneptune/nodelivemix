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

// make an api get request using our API key
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
    // oooh that juicy 128kbps of mp3!
  unthrottledStream = fs.createReadStream('test.mp3');
  // adding a stream bit throttler, which may crappify this is a little
  // but it will prevent under buffering of the stream
  throt = new Throttle({bps: 800 * 1024, chunksize: 200});
  // unthrottledStream.pipe(throt).pipe(new lame.Decoder).pipe(new speaker);
  unthrottledStream.pipe(throt).pipe(new lame.Decoder).on('format', function(){
    console.log(this._transformState.writechunk);
    console.log(' ==================== DIVIDER ===============');
    // this.pipe(new speaker);
  });

});
testUnthrottle = fs.createReadStream('TellMeWhy.mp3');
throtTest = new Throttle({bps: 200 * 1024, chunksize: 150});

testUnthrottle.pipe(throtTest).pipe( new lame.Decoder).on('format', function (){
  console.log(this, "========= OTHER MP3========");
})
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
app.get('/node_modules', function(req, res) {
  res.sendfile(__dirname + '/node_modules/');
});

  // count = req.param('num');
var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);