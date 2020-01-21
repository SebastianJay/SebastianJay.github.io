
var tileNum = 20;
var cubeSideLength = 40.0;	//center at (0, 0, 0)
var tileLength = 2.0;

var mapPositionStack = [];
var mapNormalStack = [];
var mapTextureStack = [];
var mapVertexIndexStack = [];

var sidingPositionStack = [];
var sidingNormalStack = [];
var sidingTextureStack = [];
var sidingVertexIndexStack = [];

//for tiles on the map which are non-standard
var specialPositionStack = [];
var specialNormalStack = [];
var specialTextureStack = [];
var specialVertexIndexStack = [];

//for objects on the map which are non-standard
var specialWorldPosStack = [];
var specialWorldRotAngleStack = [];
var specialWorldRotAxisStack = [];

var elevationStack = [];
var mapPropertyStack = [];
var treeProb = 0.07;
var poleProb = 0.02;
var holeProb = 0.2;
var fireProb = 0.3;
var waterProb = 0.5;

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function createMap()
{
	//order must be consistent here
	createFace(-1, 0);		//grass
	createFace(1, 1);		//shadow
	createFace(-1, 2);		//metal
	createFace(1, 3);		//earth
	createFace(-1, 4);		//fire
	createFace(1, 5);		//water

	createSiding(-1, 0);
	createSiding(1, 1);
	createSiding(-1, 2);
	createSiding(1, 3);
	createSiding(-1, 4);
	createSiding(1, 5);
}

function createFace(sign, num)
{
	var vertices = [];
	var textureCoords = [];
	var mapVertexIndices = [];
	var normals = [];
	var elevationNums = [];
	var properties = [];
	var elevations = [];

	var specPosition = [];
	var specNormals = [];
	var specTextureCoords = [];
	var specVertexIndices = [];

	var specObjPos = [];
	var specObjRotAngle = [];
	var specObjRotAxis = [];

	//first create terrain
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			var elevationNum;
			if (i > 0 && j > 0 && i < tileNum-1 && j < tileNum-1) {
				if (num == 3) {
					elevationNum = randInt(-5, 6);	//earth stage is hilly
				} else {
					elevationNum = randInt(-2, 3);
				}
			}
			else
				elevationNum = 0;

			var property = '';
			if (i > 0 && j > 0 && i < tileNum-1 && j < tileNum-1) {
				if (num == 0) {
					if (Math.random() <= treeProb) {
						property = 'tree';
					}
				} else if (num == 1) {
					if (Math.random() <= holeProb) {
						property = 'hole';
					}
				} else if (num == 2) {
					if (Math.random() <= poleProb) {
						property = 'pole';
					}
				} else if (num == 4) {
					if (Math.random() <= fireProb) {
						property = 'fire';
					}
				} else if (num == 5) {
					if (Math.random() <= waterProb) {
						property = 'water';
					}
				}
			}
			elevationNums.push(elevationNum);
			properties.push(property);
		}
	}

	//make sure no traps are present
	for (var i = 1; i < tileNum-1; i++) {
		for (var j = 1; j < tileNum-1; j++) {
			var property = properties[i*tileNum + j];
			var elevationNum = elevationNums[i*tileNum + j];
			if (property == 'tree' || property == 'pole') continue;

			var el0 = elevationNums[i*tileNum + j - 1];
			if (properties[i*tileNum + j - 1] == 'tree' || properties[i*tileNum + j - 1] == 'pole')	el0 = 9;

			var el1 = elevationNums[i*tileNum + j + 1];
			if (properties[i*tileNum + j + 1] == 'tree' || properties[i*tileNum + j + 1] == 'pole') el1 = 9;

			var el2 = elevationNums[(i-1)*tileNum + j];
			if (properties[(i-1)*tileNum + j] == 'tree' || properties[(i-1)*tileNum + j] == 'pole') el2 = 9;

			var el3 = elevationNums[(i+1)*tileNum + j];
			if (properties[(i+1)*tileNum + j] == 'tree' || properties[(i+1)*tileNum + j] == 'pole')	el3 = 9;

			var minel = Math.min(el0, el1, el2, el3);
			if (elevationNum < minel - 2)
				elevationNum = minel - 2;
			elevationNums[i*tileNum + j] = elevationNum;
		}
	}

	//now create buffers
	var counter = 0;
	var specCounter = 0;
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			var base = -cubeSideLength / 2;
			var elevationNum = elevationNums[i*tileNum + j];
			var property = properties[i*tileNum + j];
			var elevation = (-sign*base) + (-sign*elevationNum * 0.2);

			if (property == 'hole') {
				elevations.push(50.0);
				continue;
			}
			elevations.push(elevation);

			var v1 = [], v2 = [], v3 = [], v4 = [];
			var normalVec = [];
			v1.push(base + i*tileLength);
			v1.push(base + j*tileLength);
			v2.push(base + (i+1)*tileLength);
			v2.push(base + j*tileLength);
			v3.push(base + i*tileLength);
			v3.push(base + (j+1)*tileLength);
			v4.push(base + (i+1)*tileLength);
			v4.push(base + (j+1)*tileLength);
			normalVec.push(0.0);
			normalVec.push(0.0);
			if (num == 0 || num == 1) {
				v1.splice(1, 0, elevation);
				v2.splice(1, 0, elevation);
				v3.splice(1, 0, elevation);
				v4.splice(1, 0, elevation);
				normalVec.splice(1, 0, -sign);
			} else if (num == 2 || num == 3) {
				v1.unshift(elevation);
				v2.unshift(elevation);
				v3.unshift(elevation);
				v4.unshift(elevation);
				normalVec.unshift(-sign);
			} else if (num == 4 || num == 5) {
				v1.push(elevation);
				v2.push(elevation);
				v3.push(elevation);
				v4.push(elevation);
				normalVec.push(-sign);
			}
			var allverts = v1.concat(v2).concat(v3).concat(v4);
			var allnorms = normalVec.concat(normalVec, normalVec, normalVec);

			var posVec, normVec, texVec, indexVec, currentcount;
			if (property == 'fire' || property == 'water') {
				posVec = specPosition;
				normVec = specNormals;
				texVec = specTextureCoords;
				indexVec = specVertexIndices;
				currentcount = specCounter;
			} else {
				posVec = vertices;
				normVec = normals;
				texVec = textureCoords;
				indexVec = mapVertexIndices;
				currentcount = counter;
			}

			for (var k = 0; k < allverts.length; k++)
				posVec.push(allverts[k]);
			for (var k = 0; k < allnorms.length; k++)
				normVec.push(allnorms[k]);

			texVec.push(0.0);
			texVec.push(0.0);
			texVec.push(1.0);
			texVec.push(0.0);
			texVec.push(0.0);
			texVec.push(1.0);
			texVec.push(1.0);
			texVec.push(1.0);

			indexVec.push(currentcount*4);
			indexVec.push(currentcount*4+1);
			indexVec.push(currentcount*4+3);
			indexVec.push(currentcount*4);
			indexVec.push(currentcount*4+3);
			indexVec.push(currentcount*4+2);

			if (property == 'fire' || property == 'water') {
				specCounter += 1;
			} else {
				counter += 1;
			}

			if (property == 'tree') {
				specObjPos.push([base + i*tileLength + tileLength/2, elevation, base + j*tileLength + tileLength/2]);
				specObjRotAngle.push(0);
				specObjRotAxis.push([0, 1, 0]);
				//elevations.push(-sign*base + (-sign*9*0.2));	//make that tile non-platformable
			} else if (property == 'pole') {
				specObjPos.push([elevation, base + i*tileLength + tileLength/2, base + j*tileLength + tileLength/2]);
				specObjRotAngle.push(90);
				specObjRotAxis.push([0, 0, 1]);
			}
		}
	}

	var mapBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	mapBuffer.itemSize = 3;
	mapBuffer.numItems = counter * 4;

	var mapNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	mapNormalBuffer.itemSize = 3;
	mapNormalBuffer.numItems = counter * 4;

	var mapTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	mapTextureBuffer.itemSize = 2;
	mapTextureBuffer.numItems = counter * 4;

	var mapVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mapVertexIndices), gl.STATIC_DRAW);
	mapVertexIndexBuffer.itemSize = 1;
	mapVertexIndexBuffer.numItems = counter * 6;

	mapPositionStack.push(mapBuffer);
	mapNormalStack.push(mapNormalBuffer);
	mapTextureStack.push(mapTextureBuffer);
	mapVertexIndexStack.push(mapVertexIndexBuffer);

	elevationStack.push(elevations);
	mapPropertyStack.push(properties);
	if (specCounter > 0) {
		var specMapBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specMapBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specPosition), gl.STATIC_DRAW);
		specMapBuffer.itemSize = 3;
		specMapBuffer.numItems = specCounter * 4;

		var specNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specNormals), gl.STATIC_DRAW);
		specNormalBuffer.itemSize = 3;
		specNormalBuffer.numItems = specCounter * 4;

		var specTextureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specTextureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specTextureCoords), gl.STATIC_DRAW);
		specTextureBuffer.itemSize = 2;
		specTextureBuffer.numItems = specCounter * 4;

		var specVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, specVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(specVertexIndices), gl.STATIC_DRAW);
		specVertexIndexBuffer.itemSize = 1;
		specVertexIndexBuffer.numItems = specCounter * 6;

		specialPositionStack.push(specMapBuffer);
		specialNormalStack.push(specNormalBuffer);
		specialTextureStack.push(specTextureBuffer);
		specialVertexIndexStack.push(specVertexIndexBuffer);
	}
	if (specObjPos.length > 0) {
		specialWorldPosStack.push(specObjPos);
		specialWorldRotAngleStack.push(specObjRotAngle);
		specialWorldRotAxisStack.push(specObjRotAxis);
	}
}

//lots of args... w/e
function createSidingHelper(v1, v2, v3, v4, ind, sign, normSign, counter, groundElevation, vertices, normals, textureCoords, vertexIndices) {
	var norm = [];
	norm.push(0.0);
	norm.push(0.0);
	if (ind == 0 || ind == 1) {
		v1.splice(1, 0, groundElevation);
		v2.splice(1, 0, groundElevation);
		v3.splice(1, 0, groundElevation + sign*tileLength);
		v4.splice(1, 0, groundElevation + sign*tileLength);
		norm.splice(1, 0, normSign);
	} else if (ind == 2 || ind == 3) {
		v1.unshift(groundElevation);
		v2.unshift(groundElevation);
		v3.unshift(groundElevation + sign*tileLength);
		v4.unshift(groundElevation + sign*tileLength);
		norm.unshift(normSign);
	} else if (ind == 4 || ind == 5) {
		v1.push(groundElevation);
		v2.push(groundElevation);
		v3.push(groundElevation + sign*tileLength);
		v4.push(groundElevation + sign*tileLength);
		norm.push(normSign);
	}
	var allverts = v1.concat(v2).concat(v3).concat(v4);
	for (var k = 0; k < allverts.length; k++)
		vertices.push(allverts[k]);
	var allnorms = norm.concat(norm, norm, norm);
	for (var k = 0; k < allnorms.length; k++)
		normals.push(allnorms[k]);

	textureCoords.push(0.0);
	textureCoords.push(1.0);

	textureCoords.push(1.0);
	textureCoords.push(1.0);

	textureCoords.push(1.0);
	textureCoords.push(0.0);

	textureCoords.push(0.0);
	textureCoords.push(0.0);

	vertexIndices.push(counter*4);
	vertexIndices.push(counter*4+1);
	vertexIndices.push(counter*4+2);
	vertexIndices.push(counter*4);
	vertexIndices.push(counter*4+2);
	vertexIndices.push(counter*4+3);
}

function createSiding(sign, ind) {
	var groundElevations = elevationStack[ind];
	var properties = mapPropertyStack[ind];
	var vertices = [];
	var normals = [];
	var textureCoords = [];
	var vertexIndices = [];

	var specPosition = [];
	var specNormals = [];
	var specTextureCoords = [];
	var specVertexIndices = [];

	var counter = 0;
	var specCounter = 0;
	var base = -cubeSideLength / 2;
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			if (properties[i*tileNum + j] == 'hole')
				continue;
			if (i > 0 && -sign*(groundElevations[i*tileNum+j] - groundElevations[(i-1)*tileNum+j]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + i*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + i*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + j*tileLength);

				if (properties[i*tileNum + j] == 'fire' || properties[i*tileNum + j] == 'water') {
					createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, specCounter, groundElevations[i*tileNum + j],
							specPosition, specNormals, specTextureCoords, specVertexIndices);
					specCounter += 1;
				} else {
					createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, counter, groundElevations[i*tileNum + j],
							vertices, normals, textureCoords, vertexIndices);
					counter += 1;
				}
			}
			if (i < tileNum-1 && -sign*(groundElevations[i*tileNum+j] - groundElevations[(i+1)*tileNum+j]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + (i+1)*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + (i+1)*tileLength);
				v4.push(base + j*tileLength);

				if (properties[i*tileNum + j] == 'fire' || properties[i*tileNum + j] == 'water') {
					createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, specCounter, groundElevations[i*tileNum + j],
							specPosition, specNormals, specTextureCoords, specVertexIndices);
					specCounter += 1;
				} else {
					createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, counter, groundElevations[i*tileNum + j],
							vertices, normals, textureCoords, vertexIndices);
					counter += 1;
				}
			}
			if (j > 0 && -sign*(groundElevations[i*tileNum+j] - groundElevations[i*tileNum+j-1]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + j*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + j*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + j*tileLength);

				if (properties[i*tileNum + j] == 'fire' || properties[i*tileNum + j] == 'water') {
					createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, specCounter, groundElevations[i*tileNum + j],
							specPosition, specNormals, specTextureCoords, specVertexIndices);
					specCounter += 1;
				} else {
					createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, counter, groundElevations[i*tileNum + j],
							vertices, normals, textureCoords, vertexIndices);
					counter += 1;
				}
			}
			if (j < tileNum-1 && -sign*(groundElevations[i*tileNum+j] - groundElevations[i*tileNum+j+1]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + (j+1)*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + (j+1)*tileLength);

				if (properties[i*tileNum + j] == 'fire' || properties[i*tileNum + j] == 'water') {
					createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, specCounter, groundElevations[i*tileNum + j],
							specPosition, specNormals, specTextureCoords, specVertexIndices);
					specCounter += 1;
				} else {
					createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, counter, groundElevations[i*tileNum + j],
							vertices, normals, textureCoords, vertexIndices);
					counter += 1;
				}
			}
		}
	}
	//console.log(counter);
	//console.log(groundElevations.length);
	//console.log(elevationStack.length);

	var sidingBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	sidingBuffer.itemSize = 3;
	sidingBuffer.numItems = counter * 4;

	var sidingNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	sidingNormalBuffer.itemSize = 3;
	sidingNormalBuffer.numItems = counter * 4;

	var sidingTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	sidingTextureBuffer.itemSize = 2;
	sidingTextureBuffer.numItems = counter * 4;

	var sidingVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sidingVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	sidingVertexIndexBuffer.itemSize = 1;
	sidingVertexIndexBuffer.numItems = counter * 6;

	sidingPositionStack.push(sidingBuffer);
	sidingNormalStack.push(sidingNormalBuffer);
	sidingTextureStack.push(sidingTextureBuffer);
	sidingVertexIndexStack.push(sidingVertexIndexBuffer);

	if (specCounter > 0) {
		var specMapBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specMapBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specPosition), gl.STATIC_DRAW);
		specMapBuffer.itemSize = 3;
		specMapBuffer.numItems = specCounter * 4;

		var specNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specNormals), gl.STATIC_DRAW);
		specNormalBuffer.itemSize = 3;
		specNormalBuffer.numItems = specCounter * 4;

		var specTextureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, specTextureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specTextureCoords), gl.STATIC_DRAW);
		specTextureBuffer.itemSize = 2;
		specTextureBuffer.numItems = specCounter * 4;

		var specVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, specVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(specVertexIndices), gl.STATIC_DRAW);
		specVertexIndexBuffer.itemSize = 1;
		specVertexIndexBuffer.numItems = specCounter * 6;

		specialPositionStack.push(specMapBuffer);
		specialNormalStack.push(specNormalBuffer);
		specialTextureStack.push(specTextureBuffer);
		specialVertexIndexStack.push(specVertexIndexBuffer);
	}
}

function prepMatrixTransforms()
{
	mat4.identity(mvMatrix);
	if (gravX < 0) {
		mat4.rotate(mvMatrix, degToRad(90), [0, 0, 1]);
		mat4.rotate(mvMatrix, degToRad(pitch), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [1, 0, 0]);
	}
	else if (gravX > 0) {
		mat4.rotate(mvMatrix, degToRad(-90), [0, 0, 1]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(+yaw), [1, 0, 0]);
	}
	else if (gravZ < 0) {
		mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [0, 0, 1]);
	}
	else if (gravZ > 0) {
		mat4.rotate(mvMatrix, degToRad(90), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(yaw), [0, 0, 1]);
	}
	else if (gravY > 0) {
		mat4.rotate(mvMatrix, degToRad(180), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(yaw), [0, 1, 0]);
	} else {
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	}
	mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
}


function drawMapBuffersHelper(mapBuffer, mapNormalBuffer, mapTextureBuffer, mapVertexIndexBuffer, tex_ind)
{
	gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mapBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, mapNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mapNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mapTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureStack[tex_ind]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLightFlat);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, dirLightDirectionFlat);
	gl.uniform3fv(shaderProgram.directionalColorUniform, dirLightColorFlat);
	gl.uniform3fv(shaderProgram.pointLightingPositionUniform, pointLightPositionFlat);
	gl.uniform3fv(shaderProgram.pointLightingColorUniform, pointLightColorFlat);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, mapVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawMap()
{
	for (var i = 0; i < mapPositionStack.length; i++) {
		var mapBuffer = mapPositionStack[i];
		var mapNormalBuffer = mapNormalStack[i];
		var mapTextureBuffer = mapTextureStack[i];
		var mapVertexIndexBuffer = mapVertexIndexStack[i];
		drawMapBuffersHelper(mapBuffer, mapNormalBuffer, mapTextureBuffer, mapVertexIndexBuffer, i);
	}

	for (var i = 0; i < sidingPositionStack.length; i++) {
		var sidingBuffer = sidingPositionStack[i];
		var sidingNormalBuffer = sidingNormalStack[i];
		var sidingTextureBuffer = sidingTextureStack[i];
		var sidingVertexIndexBuffer = sidingVertexIndexStack[i];
		drawMapBuffersHelper(sidingBuffer, sidingNormalBuffer, sidingTextureBuffer, sidingVertexIndexBuffer, i+6);
	}

	for (var i = 0; i < specialPositionStack.length; i++) {
		var tex_ind = 0;
		if (i == 0)
			tex_ind = 20;
		else if (i == 1)
			tex_ind = 18;
		else if (i == 2)
			tex_ind = 21;
		else if (i == 3)
			tex_ind = 19;

		var mapBuffer = specialPositionStack[i];
		var mapNormalBuffer = specialNormalStack[i];
		var mapTextureBuffer = specialTextureStack[i];
		var mapVertexIndexBuffer = specialVertexIndexStack[i];
		drawMapBuffersHelper(mapBuffer, mapNormalBuffer, mapTextureBuffer, mapVertexIndexBuffer, tex_ind);
	}

	for (var i = 0; i < specialWorldPosStack.length; i++) {
		var specObjPos = specialWorldPosStack[i];
		var specObjRotAngle = specialWorldRotAngleStack[i];
		var specObjRotAxis = specialWorldRotAxisStack[i];
		for (var j = 0; j < specObjPos.length; j++) {
			//hard coding ftw
			if (i == 0) {	//tree
				var treePos = specObjPos[j].slice(0);
				var offset = 1.0;
				treePos[1] += offset;
				drawCylinder(specObjPos[j], specObjRotAngle[j], specObjRotAxis[j], [0.5, 2, 0.5], 22);
				drawCone(treePos, specObjRotAngle[j], specObjRotAxis[j], [2, 2, 2], 23);
			} else if (i == 1) {	//pole
				var polePos = specObjPos[j].slice(0);
				var offset = 1.0;
				polePos[0] += offset;
				//var rot = [0, 0, 0]
				//drawCylinder(specObjPos[j], 0, specObjRotAxis[j], [1.0, 1.0, 1.0], 12);
				// todo: fix cylinder
				drawSphere(polePos, specObjRotAngle[j], specObjRotAxis[j], [1, 1, 1], 25);
			}
		}
	}
}
