/**
 * Module dependencies.
 */

var express = require('express'),
 http = require('http'),
  util = require('util'),
  timbre = require('timbre'),
  // soundcloud = require("//connect.soundcloud.com/sdk"),
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

// Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
app.get('/blank', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// 

app.get('/twitterProfile/:num', function (req, res){
  res.contentType('application/json');
  count = req.param('num');
});



var server = app.listen(app.settings.port);
console.log("Express server is listening on http://%s:%s in '%s' mode", server.address().address, server.address().port, app.settings.env);