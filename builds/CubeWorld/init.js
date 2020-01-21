var gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {}
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

var shaderProgram;

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
  shaderProgram.pointLightingPositionUniform = gl.getUniformLocation(shaderProgram, "uPointLightingPosition");
  shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
}

var textureStack = [];
var imageFolderPath = 'img';
var groundTextureFilenames = [
  'grass_tile.png',
  'shadow_tile.png',
  'metal_tile.png',
  'earth_tile.png',
  'fire_floor_tile.png',
  'sand_tile.png',
];
var sidingTextureFilenames = [
  'grass_tile_side.png',
  'shadow_tile_side.png',
  'metal_tile_side.png',
  'earth_tile_side.png',
  'fire_floor_tile.png',
  'sand_tile_side.png',
];
var collectTextureFilenames = [
  'green_collect.png',
  'purple_collect.png',
  'yellow_collect.png',
  'brown_collect.png',
  'red_collect.png',
  'blue_collect.png',
];
var specialTextureFilenames = [
  'water_tile.png',
  'water_tile_side.png',
  'fire_tile.png',
  'fire_tile_side.png',
  'tree_trunk.png',
  'tree_cover.png',
  'pole_trunk.png',
  'pole_head.png',
];

function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

function loadImages(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;

  // Called each time an image finished
  // loading.
  var onImageLoad = function() {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      callback(images);
    }
  };

  for (var ii = 0; ii < imagesToLoad; ++ii) {
    var image = loadImage(imageFolderPath + '/' + urls[ii], onImageLoad);
    images.push(image);
  }
}

function initTextures(images) {
  for (var i = 0; i < images.length; i++) {
    var localTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, localTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    textureStack.push(localTexture);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  //todo: fix later
  var normalMat = mat3.create();
  var testMat = mat4.create();
  mat4.identity(testMat);
  mat4.toInverseMat3(mvMatrix, normalMat);
  mat3.transpose(normalMat);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMat);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function initBuffers() {
  createSolids();
  createMap();
  createCollectibles();
  createLights();
}

var xPos = 0;
var yPos = 0.5;
var zPos = 0;

var yaw = 0;
var pitch = 0;
var yawRate = 0;
var pitchRate = 0;
var pitchLimit = 70;
var walkSpeed = 0;
var jumpReq = false;
var grounded = false;
var jumping = false;

var height = 0.5;
var gravX = 0.0;
var gravY = -1.0;
var gravZ = 0.0;
var gravMag = 0.00005;
var gravTimer = 0.0;
var gravVel = 0.0;

var jumpMag = 0.00005;
var jumpInit = 0.007;
var jumpVel = 0.0;

var poleForce = 0.22;
var poleMinDist = 6.5;

var healthPoints = 100.0;

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  prepMatrixTransforms();
  drawMap();
  drawCollectibles();
}

var deathAlertSent = false;
var winAlertSent = false;

function checkEndgame() {
  if (xPos < -cubeSideLength || yPos < -cubeSideLength || zPos < -cubeSideLength ||
    xPos > cubeSideLength || yPos > cubeSideLength || zPos > cubeSideLength || healthPoints <= 0) {
    if (!deathAlertSent) {
      endgameLabel.innerHTML = "You died. =(";
      deathAlertSent = true;
    }
  }
  if (collectiblesRemaining == 0) {
    if (!winAlertSent) {
      if (deathAlertSent) {
        endgameLabel.innerHTML = "You won (albeit as a zombie).";
      } else {
        endgameLabel.innerHTML = "You won. Good job, champ!";
      }
      winAlertSent = true;
    }
  }
}

var lastTime = 0;

function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;

    var xpos1 = xPos;
    var ypos1 = yPos;
    var zpos1 = zPos;
    // walking
    if (walkSpeed != 0) {
      if (gravY < 0 || gravY > 0) {
        var sign;
        if (gravY < 0)
          sign = -1;
        else
          sign = 1;
        xpos1 = xPos - Math.sin(degToRad(yaw)) * walkSpeed * elapsed;
        ypos1 = yPos;
        zpos1 = zPos + sign * Math.cos(degToRad(yaw)) * walkSpeed * elapsed;
      } else if (gravX < 0 || gravX > 0) {
        var sign;
        if (gravX < 0)
          sign = -1;
        else
          sign = 1;
        xpos1 = xPos;
        ypos1 = yPos + Math.sin(degToRad(-sign * yaw)) * walkSpeed * elapsed;
        zpos1 = zPos - Math.cos(degToRad(-sign * yaw)) * walkSpeed * elapsed;
      } else if (gravZ < 0 || gravZ > 0) {
        var sign;
        if (gravZ < 0)
          sign = -1;
        else
          sign = 1;
        xpos1 = xPos - sign * Math.sin(degToRad(sign * yaw)) * walkSpeed * elapsed;
        ypos1 = yPos - sign * Math.cos(degToRad(-yaw)) * walkSpeed * elapsed;
        zpos1 = zPos;
      }
    }

    // repulsion from metal poles
    if (gravX < 0) {
      var poleDy = 0;
      var poleDz = 0;
      for (var i = 0; i < specialWorldPosStack[1].length; i++) {
        var specObjPos = specialWorldPosStack[1][i];
        var distSquared = (specObjPos[1] - ypos1)*(specObjPos[1] - ypos1)
          + (specObjPos[2] - zpos1)*(specObjPos[2] - zpos1);
        if (distSquared < poleMinDist * poleMinDist) {
          var normalY = ypos1 - specObjPos[1];
          var normalZ = zpos1 - specObjPos[2];
          var normalMag = Math.sqrt(normalY*normalY + normalZ*normalZ);
          poleDy += (normalY / normalMag) * poleForce / distSquared;
          poleDz += (normalZ / normalMag) * poleForce / distSquared;
        }
      }
      ypos1 += poleDy;
      zpos1 += poleDz;
    }

    var retLst = checkCollisionGeneral(xpos1, ypos1, zpos1);
    if (retLst[0]) {
      xPos = xpos1;
      yPos = ypos1;
      zPos = zpos1;
    } else {
      xPos = retLst[1];
      yPos = retLst[2];
      zPos = retLst[3];
    }

    // yaw and pitch
    yaw += yawRate * elapsed;
    if ((pitchRate > 0 && pitch < pitchLimit) || (pitchRate < 0 && pitch > -pitchLimit))
      pitch += pitchRate * elapsed;

    // jumping
    if (jumping) {
      jumpVel -= elapsed * jumpMag;
      if (jumpVel < 0) {
        jumpVel = 0;
        jumping = false;
        checkGravitySwitch();
      }
      var xpos2 = xPos + -gravX * jumpVel * elapsed;
      var ypos2 = yPos + -gravY * jumpVel * elapsed;
      var zpos2 = zPos + -gravZ * jumpVel * elapsed;
      xPos = xpos2;
      yPos = ypos2;
      zPos = zpos2;
    } else {
      var xpos2 = xPos + gravX * gravVel * elapsed;
      var ypos2 = yPos + gravY * gravVel * elapsed;
      var zpos2 = zPos + gravZ * gravVel * elapsed;
      var retLst = checkCollisionGravity(xpos2, ypos2, zpos2);
      if (retLst[0]) {
        xPos = xpos2;
        yPos = ypos2;
        zPos = zpos2;
        grounded = false;
        gravVel += elapsed * gravMag;
      } else {
        xPos = retLst[1];
        yPos = retLst[2];
        zPos = retLst[3];
        grounded = true;
        gravVel = 0.0;
      }
    }
    if (jumpReq && grounded) {
      jumpVel = jumpInit;
      jumping = true;
      grounded = false;
    }

    checkCollisionCollectibles();
    checkEndgame();
    healthLabel.innerHTML = "Health: " + Math.floor(healthPoints);
    //animateLight(elapsed);
  }
  lastTime = timeNow;
}


function tick() {
  requestAnimFrame(tick);
  handleKeys();
  drawScene();
  animate();
}

var healthLabel;
var endgameLabel;

function webGLStart() {
  var canvas = document.getElementById("gl-canvas");
  healthLabel = document.getElementById("health-text");
  endgameLabel = document.getElementById("endgame-text");
  initGL(canvas);
  initShaders();
  initBuffers();
  var allFilenames = groundTextureFilenames.concat(sidingTextureFilenames)
    .concat(collectTextureFilenames).concat(specialTextureFilenames);
  loadImages(allFilenames, initTextures);
  //initTextures();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  tick();
}

window.onload = function() {
  webGLStart();
}
