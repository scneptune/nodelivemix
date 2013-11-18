/* Author: SCNEPTUNE */

$('.knob').knobKnob({
    snap : 20,          // Snap to zero if less than this deg.
    value: 90,         // Default rotation
    turn : function(ratio){
        ratio = 0.80;
    }
});
$('slider').slider();
TestTrack1 = {
	track: 'A',
	trackId: '119795985'
}


function getTurntableTrack (TurntableTrack) {
	audioSide = $('audio[data-turntable="'+ TurntableTrack.track +'"]');
	scId = TurntableTrack.trackId;
}

getTurntableTrack(TestTrack1);
src= '../test.mp3'
T("audio").loadthis(src, function () {
}).play().on("ended", function () {
  this.pause();
});

T('mediastream');
console.log();























