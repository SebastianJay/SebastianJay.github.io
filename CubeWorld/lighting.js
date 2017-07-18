
//globals from map_builder
//

var ambientLightFlat = [];
var dirLightDirectionFlat = [];
var dirLightColorFlat = [];
var pointLightPositionFlat = [];
var pointLightColorFlat = [];
var lightTimer = 0.0;
var pointLightAmplitude = 0.2;
var pointLightBase = 0.3;
var pointLightFrequency = 0.002;

function createLights()
{
	createDirLight(0.0, -1.0, 0.0, 0.0, 0.0, 0.0);
	pointLightPositionFlat.push(0.0, 0.0, 0.0);
	pointLightColorFlat.push(pointLightBase, pointLightBase, pointLightBase);
	//ambientLightFlat.push(1.0, 1.0, 1.0);
	ambientLightFlat.push(0.5, 0.5, 0.5);
}

function createDirLight(xdir, ydir, zdir, rcolor, gcolor, bcolor)
{
	var mag = Math.sqrt(xdir*xdir + ydir*ydir + zdir*zdir);
	var lightingDirNorm = [-xdir / mag, -ydir / mag, -zdir / mag];

	dirLightDirectionFlat.push(lightingDirNorm[0], lightingDirNorm[1], lightingDirNorm[2]);
	dirLightColorFlat.push(rcolor, gcolor, bcolor);
}

function animateLight(elapsed)
{
	lightTimer += elapsed
	pointLightColorFlat[0] = pointLightBase + pointLightAmplitude * Math.sin(lightTimer * pointLightFrequency);
	pointLightColorFlat[1] = pointLightBase + pointLightAmplitude * Math.sin(lightTimer * pointLightFrequency);
	pointLightColorFlat[2] = pointLightBase + pointLightAmplitude * Math.sin(lightTimer * pointLightFrequency);
}
