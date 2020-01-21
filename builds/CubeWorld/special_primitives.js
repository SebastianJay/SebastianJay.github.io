
//adapted from learningwebgl lesson 11 on drawing spheres

//webgl
var cylinderPositionBuffer;
var cylinderNormalBuffer;
var cylinderVertexIndexBuffer;
var cylinderTextureBuffer;

var conePositionBuffer;
var coneNormalBuffer;
var coneVertexIndexBuffer;
var coneTextureBuffer;

var spherePositionBuffer;
var sphereNormalBuffer;
var sphereVertexIndexBuffer;
var sphereTextureBuffer;

//game-related
var cylinderLongitudeBands = 30;
var cylinderRadius = 1.0;
var cylinderHeight = 1.0;

var coneLatitudeBands = 30;
var coneLongitudeBands = 30;
var coneRadius = 1.0;
var coneHeight = 1.0;

var sphereRadius = 1.0;
var sphereLatitudeBands = 30;
var sphereLongitudeBands = 30;

function createSolids()
{
	createSphere();
	createCylinder();
	createCone();
}

function createSphere()
{
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];

	for (var latNumber=0; latNumber <= sphereLatitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / sphereLatitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber=0; longNumber <= sphereLongitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / sphereLongitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / sphereLongitudeBands);
			var v = 1 - (latNumber / sphereLatitudeBands);

			normalData.push(x);
			normalData.push(y);
			normalData.push(z);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(sphereRadius * x);
			vertexPositionData.push(sphereRadius * y);
			vertexPositionData.push(sphereRadius * z);
		}
	}

	var indexData = [];
	for (var latNumber=0; latNumber < sphereLatitudeBands; latNumber++) {
		for (var longNumber=0; longNumber < sphereLongitudeBands; longNumber++) {
			var first = (latNumber * (sphereLongitudeBands + 1)) + longNumber;
			var second = first + sphereLongitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}

	sphereNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	sphereNormalBuffer.itemSize = 3;
	sphereNormalBuffer.numItems = normalData.length / 3;

	sphereTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	sphereTextureBuffer.itemSize = 2;
	sphereTextureBuffer.numItems = textureCoordData.length / 2;

	spherePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	spherePositionBuffer.itemSize = 3;
	spherePositionBuffer.numItems = vertexPositionData.length / 3;

	sphereVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	sphereVertexIndexBuffer.itemSize = 1;
	sphereVertexIndexBuffer.numItems = indexData.length;
}


//creates open-ended cylinder
function createCylinder()
{
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];
	var indexData = [];

	//initial point
	var prevSinTheta = 0;
	var prevCosTheta = 1;
	normalData.push(prevCosTheta, 0, prevSinTheta);
	normalData.push(prevCosTheta, 0, prevSinTheta);
	textureCoordData.push(0, 0);
	textureCoordData.push(0, 1);
	vertexPositionData.push(cylinderRadius * prevCosTheta, 0, cylinderRadius * prevSinTheta);
	vertexPositionData.push(cylinderRadius * prevCosTheta, cylinderHeight, cylinderRadius * prevSinTheta);
	for (var longNumber=1; longNumber <= cylinderLongitudeBands; longNumber++) {
		var theta = longNumber * 2 * Math.PI / cylinderLongitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		var x = cosTheta;
		var z = sinTheta;
		var u = (longNumber / cylinderLongitudeBands);

		normalData.push(cosTheta);
		normalData.push(0);
		normalData.push(sinTheta);
		normalData.push(cosTheta);
		normalData.push(0);
		normalData.push(sinTheta);
		textureCoordData.push(u);
		textureCoordData.push(0);
		textureCoordData.push(u);
		textureCoordData.push(1);
		vertexPositionData.push(cylinderRadius * x);
		vertexPositionData.push(0);
		vertexPositionData.push(cylinderRadius * z);
		vertexPositionData.push(cylinderRadius * x);
		vertexPositionData.push(cylinderHeight);
		vertexPositionData.push(cylinderRadius * z);

		indexData.push((longNumber-1)*2);
		indexData.push((longNumber-1)*2 + 1);
		indexData.push((longNumber)*2);
		indexData.push((longNumber)*2 + 1);
		indexData.push((longNumber)*2);
		indexData.push((longNumber-1)*2 + 1);

		prevSinTheta = sinTheta;
		prevCosTheta = cosTheta;
	}

	cylinderNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	cylinderNormalBuffer.itemSize = 3;
	cylinderNormalBuffer.numItems = normalData.length / 3;

	cylinderTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	cylinderTextureBuffer.itemSize = 2;
	cylinderTextureBuffer.numItems = textureCoordData.length / 2;

	cylinderPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	cylinderPositionBuffer.itemSize = 3;
	cylinderPositionBuffer.numItems = vertexPositionData.length / 3;

	cylinderVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	cylinderVertexIndexBuffer.itemSize = 1;
	cylinderVertexIndexBuffer.numItems = indexData.length;
}

function createCone()
{
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];
	var indexData = [];

	for (var latNumber=0; latNumber <= coneLatitudeBands; latNumber++) {
		var midHeight = latNumber * coneHeight / coneLatitudeBands;
		var midRadius = (coneHeight - midHeight) * coneRadius / coneHeight;
		for (var longNumber=0; longNumber <= coneLongitudeBands; longNumber++) {
			var theta = longNumber * 2 * Math.PI / coneLongitudeBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			var x = midRadius * cosTheta;
			var y = midHeight;
			var z = midRadius * sinTheta;
			var u = 0.5 + (0.5 * cosTheta * midRadius / coneRadius);
			var v = 0.5 + (0.5 * sinTheta * midRadius / coneRadius);

			var nx = x*coneHeight/coneRadius;
			var ny = coneRadius/coneHeight;
			var nz = z*coneHeight/coneRadius;
			var nmag = Math.sqrt(nx*nx + ny*ny + nz*nz);

			normalData.push(nx/nmag);
			normalData.push(ny/nmag);
			normalData.push(nz/nmag);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(x);
			vertexPositionData.push(y);
			vertexPositionData.push(z);
		}
	}

	for (var latNumber=0; latNumber < coneLatitudeBands; latNumber++) {
		for (var longNumber=0; longNumber < coneLongitudeBands; longNumber++) {
			var first = (latNumber * (coneLongitudeBands + 1)) + longNumber;
			var second = first + coneLongitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}

	coneNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	coneNormalBuffer.itemSize = 3;
	coneNormalBuffer.numItems = normalData.length / 3;

	coneTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	coneTextureBuffer.itemSize = 2;
	coneTextureBuffer.numItems = textureCoordData.length / 2;

	conePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, conePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	conePositionBuffer.itemSize = 3;
	conePositionBuffer.numItems = vertexPositionData.length / 3;

	coneVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	coneVertexIndexBuffer.itemSize = 1;
	coneVertexIndexBuffer.numItems = indexData.length;
}

function drawSphere(translateVec, rotateAngle, rotateVec, scaleVec, tex_ind) {
	drawSolidHelper(spherePositionBuffer, sphereNormalBuffer, sphereTextureBuffer, sphereVertexIndexBuffer,
					translateVec, rotateAngle, rotateVec, scaleVec, tex_ind);
}

function drawCylinder(translateVec, rotateAngle, rotateVec, scaleVec, tex_ind) {
	drawSolidHelper(cylinderPositionBuffer, cylinderNormalBuffer, cylinderTextureBuffer, cylinderVertexIndexBuffer,
					translateVec, rotateAngle, rotateVec, scaleVec, tex_ind);
}


function drawCone(translateVec, rotateAngle, rotateVec, scaleVec, tex_ind) {
	drawSolidHelper(conePositionBuffer, coneNormalBuffer, coneTextureBuffer, coneVertexIndexBuffer,
					translateVec, rotateAngle, rotateVec, scaleVec, tex_ind);
}

function drawSolidHelper(posBuffer, normBuffer, texBuffer, vertexIndexBuffer,
						translateVec, rotateAngle, rotateVec, scaleVec, tex_ind) {
	var localMat = mat4.create();
	mat4.identity(localMat);

	mat4.translate(localMat, translateVec);
	mat4.rotate(localMat, degToRad(rotateAngle), rotateVec);
	mat4.scale(localMat, scaleVec);

	mvPushMatrix();

	mat4.multiply(mvMatrix, localMat, mvMatrix);
	//mat4.multiply(localMat, mvMatrix, mvMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureStack[tex_ind]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, posBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, texBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLightFlat);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, dirLightDirectionFlat);
	gl.uniform3fv(shaderProgram.directionalColorUniform, dirLightColorFlat);
	gl.uniform3fv(shaderProgram.pointLightingPositionUniform, pointLightPositionFlat);
	gl.uniform3fv(shaderProgram.pointLightingColorUniform, pointLightColorFlat);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();
}
