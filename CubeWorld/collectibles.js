
//globals from map_builder
// tileNum, cubeSideLength, tileLength, elevationStack, mapTextureStack

//webgl
//game-related
var collectWorldPosStack = [];
var collectWorldRotAngleStack = [];
var collectWorldRotAxisStack = [];
var collectFound = [];
var collectiblesRemaining = 0;
var collectRadius = 1.0;

function createCollectibles()
{
	var counter = 0;
	for (var i = 0; i < elevationStack.length; i++) {
		var elevations = elevationStack[i];
		var base = -cubeSideLength / 2;
		var ind1 = randInt(5, 16);
		var ind2 = randInt(5, 16);
		//todo: fix logic
		while (mapPropertyStack[i][ind1*tileNum + ind2] != '') {
			ind1 = randInt(5, 16);
			ind2 = randInt(5, 16);			
		}
		var hpos = elevations[ind1*tileNum + ind2];
		var sign = 1;
		var collectHeight = 1.0;
		if (i % 2 == 0)
			sign = -1;
		if (i == 0 || i == 1) {
			collectWorldPosStack.push([base+tileLength*ind1 + tileLength/2, hpos - sign*collectHeight, base+tileLength*ind2 + tileLength/2]);
			collectWorldRotAngleStack.push(0);
			collectWorldRotAxisStack.push([0, 1, 0]);
		}
		if (i == 2 || i == 3) {
			collectWorldPosStack.push([hpos - sign*collectHeight, base+tileLength*ind1 + tileLength/2, base+tileLength*ind2 + tileLength/2]);
			collectWorldRotAngleStack.push(90);
			collectWorldRotAxisStack.push([0, 0, 1]);
		}
		if (i == 4 || i == 5) {
			collectWorldPosStack.push([base+tileLength*ind1 + tileLength/2, base+tileLength*ind2 + tileLength/2, hpos - sign*collectHeight]);
			collectWorldRotAngleStack.push(90);
			collectWorldRotAxisStack.push([1, 0, 0]);
		}
		counter += 1;
	}
	collectiblesRemaining = counter;
}

function drawCollectibles() {
	for (var i = 0; i < collectWorldPosStack.length; i++) {
		if (collectFound[i])
			continue;
		
		var radRatio = collectRadius / sphereRadius / 1.3;
		drawSphere(collectWorldPosStack[i], collectWorldRotAngleStack[i], collectWorldRotAxisStack[i], [radRatio, radRatio, radRatio], 12+i);
	}
}

function checkCollisionCollectibles() {
	for (var i = 0; i < collectWorldPosStack.length; i++) {
		if (collectFound[i])
			continue;
		var posVec = collectWorldPosStack[i];
		//console.log(posVec[0] + ' ' + posVec[1] + ' ' + posVec[2]);
		if ( ((xPos - posVec[0])*(xPos - posVec[0]) + (yPos - posVec[1])*(yPos - posVec[1]) + (zPos - posVec[2])*(zPos - posVec[2])) < collectRadius*collectRadius ) {
			collectFound[i] = true;
			collectiblesRemaining -= 1;
		}
	}
}
