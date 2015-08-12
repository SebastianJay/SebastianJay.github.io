
//Taken from the learningWebGL site's lesson 10

//Globals to play with
// xpos, ypos, zpos
// yaw, pitch
// pitchRate, yawRate, walkSpeed
// jumpReq

var currentlyPressedKeys = {};
var pitchRateMag = 0.1;
var yawRateMag = 0.1;
var walkSpeedMag = 0.003;

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	if (currentlyPressedKeys[33] || currentlyPressedKeys[81]) {
		// Page Up
		pitchRate = pitchRateMag;
	} else if (currentlyPressedKeys[34] || currentlyPressedKeys[69]) {
		// Page Down
		pitchRate = -pitchRateMag;
	} else {
		pitchRate = 0;
	}

	if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
		// Left cursor key or A
		yawRate = yawRateMag;
	} else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
		// Right cursor key or D
		yawRate = -yawRateMag;
	} else {
		yawRate = 0;
	}

	if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
		// Up cursor key or W
		walkSpeed = walkSpeedMag;
	} else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
		// Down cursor key
		walkSpeed = -walkSpeedMag;
	} else {
		walkSpeed = 0;
	}

	if (currentlyPressedKeys[32] || currentlyPressedKeys[80]) {
		jumpReq = true;
	} else {
		jumpReq = false;
	}
}
