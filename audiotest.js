// TEST TEST TEST

var T = require('timbre');

var src = "test.mp3";

T("audio").loadthis(src, function() {
  this.play();
}).on("ended", function() {
  this.pause();
});
