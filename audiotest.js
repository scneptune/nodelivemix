// TEST TEST TEST

var T = require('timbre');
var request = require('request');

// var src = "test.mp3";

// SC = {
//           client_id: "7974b5d410ba881ba78d78078a4197c1",
//           client_secret : "77b487cc38666703febaf0df4850f815",
//           token: "https://api.soundcloud.com/oauth2/token",
//           redirect_uri: "/",
//         };

// var src = 'http://api.soundcloud.com/tracks/109216345/stream?client_id='+ SC.client_id;
//  followAPI = request({
//   uri : src,
//   method: 'GET',
//   timeout: 10000,
//   followRedirect: true,
// }, function (error, response, body){
//   return response;
// });

T("audio").loadthis(followAPI, function() {
	this.play();
}).on("ended", function() {
  this.pause();
});
