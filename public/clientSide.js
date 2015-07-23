Desires.getDesires();

function showControls() {
	alertify.alert('persist.io - by james b. pollack 2012', 'Keyboard Controls: <br> <br> W,A,S,D,R,F - Move Camera <br> SPACEBAR - Freeze / Unfreeze Camera   <br> Arrow Keys - Move Character<br><br>  Mouse Controls: <br><br> Left Mouse Button - Camera Forward <br> Right Mouse Button - Camera Backward ');
}
showControls();

var audioPlaying = false;

function toggleAudio() {
	if (audioPlaying === true) {
		document.getElementById('audio_1').pause();
		document.getElementById('audio_2').pause();
		audioPlaying = false;
	} else {
		document.getElementById('audio_1').play();
		document.getElementById('audio_2').play();
		audioPlaying = true;
	}
}
var netCharacters, nnetCharacter, netCharacterControls, netConfigModel;

var nnetRows = 1,
	nnetSkins = 1,
	netCharacter, netBaseCharacter, cloneCharacterNet, netGyro;
var neshamotLoader, neshamotMaterial, netLight;
var dtube;
var neshamotHere = false;


//setup

var container = document.createElement('div'),

	camera,
	scene,
	renderer,
	SHADOW_MAP_WIDTH = 2048,
	SHADOW_MAP_HEIGHT = 1024;
renderer = new THREE.WebGLRenderer({
	clearAlpha: 1,
	clearColor: 0x000000
});
renderer.setSize(window.innerWidth, window.innerHeight);
container = document.body.appendChild(container);
camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 9500);

camera.updateProjectionMatrix();
THREE.Object3D._threexDomEvent.camera(camera);

scene = new THREE.Scene();
scene.add(camera);
scene.fog = new THREE.FogExp2(0x000000, 0.0003);

renderer.autoClear = false;
renderer.shadowCameraNear = 2;
renderer.shadowCameraFar = this.camera.far;
renderer.shadowCameraFov = 70;
renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.7;
renderer.shadowMapWidth = SHADOW_MAP_WIDTH;
renderer.shadowMapHeight = SHADOW_MAP_HEIGHT;
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
container.appendChild(renderer.domElement);
var renderManager = new THREE.Extras.RenderManager(renderer);


var barkimage = document.createElement('img');
barkimage.src = "treebark.jpg";
branchTexture = new THREE.Texture(barkimage);


scene1Loader();

//controls

var controls = new THREE.FirstPersonControls(camera);
controls.movementSpeed = 60;
controls.lookSpeed = 0.040;
controls.constrainVertical = false;
//controls.verticalMax = 12.5;
//controls.verticalMin = -2.5;
//controls.constrainVertical = false; 

originSpot = new THREE.Vector3(0, 0, 0);


//lights

var light1 = new THREE.PointLight();
light1.intensity = 1;
light1.castShadow = false;
light1.color = new THREE.Color().setRGB(0, 1, 0.14901960784313725);
light1.position.set(107.3619632, 750, -11.69590643);
light1.rotation.set(0, 0, 0);
light1.scale.set(5, 5, 5);
scene.add(light1);

var light2 = new THREE.PointLight();
light2.intensity = 1;
light2.castShadow = false;
light2.color = new THREE.Color().setRGB(0.0196078431372549, 0.2980392156862745, 1);
light2.position.set(70.55214724, 750, -1286.549708);
light2.rotation.set(0, 0, 0);
light2.scale.set(5, 5, 5);
scene.add(light2);

var light3 = new THREE.PointLight();
light3.intensity = 1;
light3.castShadow = false;
light3.color = new THREE.Color().setRGB(1, 0.0196078431372549, 0.14901960784313725);
light3.position.set(70.55214724, 750, 760.2339181);
light3.rotation.set(0, 0, 0);
light3.scale.set(5, 5, 5);
scene.add(light3);

var light4 = new THREE.PointLight();
light4.intensity = 1;
light4.castShadow = false;
light4.color = new THREE.Color().setRGB(1, 0, 0.5);
light4.position.set(-210.4795737, -1220.884658, -907.0548712);
light4.rotation.set(0, 0, 0);
light4.scale.set(5, 5, 5);
scene.add(light4);

var light5 = new THREE.SpotLight();
light5.intensity = 1;
light5.castShadow = true;
light5.color = new THREE.Color().setRGB(1, 1, 1);
light5.position.set(-32.85968028, 268.4770437, 0);
light5.rotation.set(0, 0, 0);
light5.scale.set(1, 1, 1);
scene.add(light5);

var light6 = new THREE.SpotLight();
light6.intensity = 5;
light6.castShadow = true;
light6.color = new THREE.Color().setRGB(1, 1, 1);
light6.position.set(0, 0, 0);
light6.rotation.set(0, 0, 0);
light6.scale.set(250, 250, 250);
scene.add(light6);



//island 
var island = scene1Loader.createIsland(scene);


//baptistery
var baptistery = scene1Loader.createBaptistery(scene);


//plants
var plant1 = scene1Loader.createPlant1(scene);



//fireballsun

var start_time, uniforms, fireballmesh;
var oldTime = new Date().getTime();

start_time = new Date().getTime();

uniforms = {
	time: {
		type: "f",
		value: 1.0
	},
	scale: {
		type: "f",
		value: 1.5
	}
};
var size = 0.75;


var fireballmaterial = new THREE.ShaderMaterial({

	uniforms: uniforms,
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent

});

fireballmesh = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 8), fireballmaterial);
scene.add(fireballmesh);
fireballmesh.position.set(2500, 1000, 600);
fireballmesh.scale = new THREE.Vector3(350, 350, 350);

//DOMevents in 3D



var attachmentA, attachmentB, attachmentC, attachmentD, attachmentE, attachmentF;



new THREE.JSONLoader().load('last_baptistery2.js', function(geometry) {
	var meshes = scene1Loader.createAttachments(scene, geometry); //buildMeshes(geometry);
	//	bindEvents(meshes);
	attachmentA = meshes['attachmentA'];
	attachmentB = meshes['attachmentB'];
	attachmentC = meshes['attachmentC'];
	attachmentD = meshes['attachmentD'];
	attachmentE = meshes['attachmentE'];
	attachmentF = meshes['attachmentF'];
	drawTube();
	drawTube2();
	drawTube3();
});

var Store = {
	scene: "Above"
};


var setActiveScene = function(sceneName) {
	Store.scene = sceneName
	return
}

var toggleScene = function() {
		if (Store.scene === "Above") {
			setActiveScene("Beyond")
			$('.main-button').eq(0).show();
			$('.main-button').eq(1).hide();
		} else if (Store.scene === "Beyond") {
			setActiveScene("Above");
			$('.main-button').eq(1).show();
			$('.main-button').eq(0).hide();
		}
	}
	/*----callback functions----*/

var cbScale = function(object3d) {

	new TWEEN.Tween(object3d.scale)
		.to({
			x: 10,
			y: 10,
			z: 10
		}, 100)
		.easing(TWEEN.Easing.Quartic.EaseIn)
		.start();
	new TWEEN.Tween(object3d.material.color)
		.to({
			r: 1,
			g: 0.5,
			b: 0
		}, 100)
		.easing(TWEEN.Easing.Quartic.EaseIn)
		.start();
};
cbScale.off = function(object3d) {

	new TWEEN.Tween(object3d.scale)
		.to({
			x: 5,
			y: 5,
			z: 5
		}, 100)
		.easing(TWEEN.Easing.Quartic.EaseIn)
		.start();
	new TWEEN.Tween(object3d.material.color)
		.to({
			r: 0.5,
			g: 0.75,
			b: 0.25
		}, 100)
		.easing(TWEEN.Easing.Quartic.EaseIn)
		.start();
}

var cbRotate = function(object3d) {
	if (object3d.rotation.x < Math.PI / 4) {
		var rotation = {
			x: Math.PI / 2
		};
		var color = {
			r: 1,
			g: 0.5,
			b: 0
		};
	} else {
		var rotation = {
			x: 0
		};
		var color = {
			r: 0.5,
			g: 0.75,
			b: 0.25
		};
	}
	new TWEEN.Tween(object3d.rotation).to(rotation, 100)
		.easing(TWEEN.Easing.Bounce.EaseOut).start();
	new TWEEN.Tween(object3d.material.color).to(color, 100)
		.easing(TWEEN.Easing.Quartic.EaseIn).start();
};


var cbHelpA = function(event) {
	cbScale(attachmentA);
};
cbHelpA.off = function(event) {
	cbScale.off(attachmentA);
};

var cbHelpB = function(event) {
	cbRotate(attachmentB);
};
cbHelpB.off = function(event) {};

var cbHelpC = function(event) {
	cbScale(attachmentC);
};
cbHelpC.off = function(event) {
	cbScale.off(attachmentC);
};

var cbHelpD = function(event) {
	cbScale(attachmentD);
};
cbHelpD.off = function(event) {
	cbScale.off(attachmentD);
};

var cbHelpE = function(event) {
	cbRotate(attachmentE);
};
cbHelpE.off = function(event) {};

var cbHelpF = function(event) {
	cbScale(attachmentF);
};
cbHelpF.off = function(event) {
	cbScale.off(attachmentF);
};

function bindEvents(meshes) {
	meshes['attachmentA'].on('mouseover', cbHelpA).on('mouseout', cbHelpA.off);
	meshes['attachmentB'].on('mouseover', cbHelpB).on('mouseout', cbHelpB.off);
	meshes['attachmentC'].on('mouseover', cbHelpC).on('mouseout', cbHelpC.off);
	meshes['attachmentD'].on('mouseover', cbHelpD).on('mouseout', cbHelpD.off);
	meshes['attachmentE'].on('mouseover', cbHelpE).on('mouseout', cbHelpE.off);
	meshes['attachmentF'].on('mouseover', cbHelpF).on('mouseout', cbHelpF.off);
}


/*----end callback functions----*/

// particles

var particles, geometry, materials = [],
	parameters, i, h, color;
geometry = new THREE.Geometry();

for (i = 0; i < 2000; i++) {

	vector = new THREE.Vector3(Math.random() * 3000 - 1000, Math.random() * 3000 - 1000, Math.random() * 3000 - 1000);
	geometry.vertices.push(new THREE.Vertex(vector));

}

parameters = [
	[
		[1.0, 1.0, 1.0], 5
	],
	[
		[0.95, 1, 1], 4
	],
	[
		[0.90, 1, 1], 3
	],
	[
		[0.85, 1, 1], 2
	],
	[
		[0.80, 1, 1], 1
	]
];
//parameters = [ [ 0xff0000, 5 ], [ 0xff3300, 4 ], [ 0xff6600, 3 ], [ 0xff9900, 2 ], [ 0xffaa00, 1 ] ];
//	parameters = [ [ 0xffffff, 5 ], [ 0xdddddd, 4 ], [ 0xaaaaaa, 3 ], [ 0x999999, 2 ], [ 0x777777, 1 ] ];

for (i = 0; i < parameters.length; i++) {

	size = parameters[i][1];
	color = parameters[i][0];

	//materials[i] = new THREE.ParticleBasicMaterial( { color: color, size: size } );

	materials[i] = new THREE.ParticleBasicMaterial({
		size: size
	});
	materials[i].color.setHSV(color[0], color[1], color[2]);

	particles = new THREE.ParticleSystem(geometry, materials[i]);

	particles.rotation.x = Math.random() * 6;
	particles.rotation.y = Math.random() * 6;
	particles.rotation.z = Math.random() * 6;
	particles.castShadow = false;

	scene.add(particles);

}



// audio & audiolet

//audiolet variables
// var audio, initaudio;
var keyboardFuncs = new Object();
keyboardFuncs.left = function() {
	mesh.position.setX(mesh.position.x - 2);
};
keyboardFuncs.right = function() {
	mesh.position.setX(mesh.position.x + 2);
};
keyboardFuncs.up = function() {
	mesh.position.setZ(mesh.position.z - 2);
};
keyboardFuncs.down = function() {
	mesh.position.setZ(mesh.position.z + 2);
};
// var mesh, meshsource;



//tree
var tree, treeContainer;
var branchTexture, branchMaterial;
//tree branch texture

branchTexture.minFilter = THREE.NearestFilter;
branchTexture.magFilter = THREE.NearestFilter;
branchTexture.wrapS = branchTexture.wrapT = THREE.RepeatWrapping;
branchMaterial = new THREE.MeshPhongMaterial({
	map: branchTexture,
	shininess: 2,
	ambient: 0x998822
});
//branchMaterial = new THREE.MeshBasicMaterial( { color:0x0044ff, opacity:1, map: branchTexture } );
branchMaterial.shading = THREE.SmoothShading;

//create tree, will timeout some milliseconds

tree = new Tree(branchMaterial, -1, 25, 0, 1);
tree.position = new THREE.Vector3(0, 0, 400)
tree.rotation.x = -90 * Math.PI / 180;
tree.scale = new THREE.Vector3(1, 1, 1)
tree.castShadow = true;
tree.receiveShadow = false;
//tree container
treeContainer = new THREE.Object3D();
treeContainer.useQuaternion = true;
treeContainer.add(tree);
scene.add(treeContainer);


function scaleTweenUpdate(event) {
	updateScaleRecursive(tree);
}

//recursivly update all branch childs
function updateScaleRecursive(child) {
	for (var c = 0; c < child.children.length; c++) {
		updateScaleRecursive(child.children[c]);
		child.children[c].scale = child.scale;
	}
}


//character
var characters = [];
var nCharacters = 0;

var CharacterControls = {

	moveForward: false,
	moveBackward: false,
	moveLeft: false,
	moveRight: false,
	attack: false,
	pain: false,
	death: false,
	wave: false,
	flip: false,
	taunt: false,
	point: false,

};
var configModel = {

	baseUrl: "models/faerie/",

	body: "faerie.js",
	skins: ["Faerie2.png"],
	weapons: [
		["faeriewand.js", "weapon.png"]
	],
	//	weapons:  [ [ "weapon-light.js", "weapon.jpg" ] ],
	animations: {
		move: "run",
		idle: "stand",
		jump: "jump",
		attack: "attack",
		crouchMove: "crwalk",
		crouchIdle: "crstand",
		crouchAttach: "crattack",
		pain: "pain",
		death: "death",
		wave: "wave",
		flip: "flip",
		taunt: "taunt",
		point: "point"
	},

	walkSpeed: 250,
	crouchSpeed: 175

};


var keyboard;

//chracter controls
keyboard = new THREEx.KeyboardState();

setInterval(function() {
	if (renderManager.current.id === "Beyond") {
		return
	}
	var fwd = "down"
	if (keyboard.pressed(fwd)) {
		CharacterControls.moveForward = true;

	} else {
		CharacterControls.moveForward = false;
	}
	var bkwd = "up"
	if (keyboard.pressed(bkwd)) {
		CharacterControls.moveBackward = true;

	} else {
		CharacterControls.moveBackward = false;
	}
	var left = "left"
	if (keyboard.pressed(left)) {
		CharacterControls.moveLeft = true;

	} else {
		CharacterControls.moveLeft = false;
	}
	var right = "right"
	if (keyboard.pressed(right)) {
		CharacterControls.moveRight = true;

	} else {
		CharacterControls.moveRight = false;
	}

	var pain = "k"
	if (keyboard.pressed(pain)) {
		CharacterControls.pain = true;
	} else {
		CharacterControls.pain = false;
	}

	var jump = "j"
	if (keyboard.pressed(jump)) {
		CharacterControls.jump = true;
	} else {
		CharacterControls.jump = false;
	}
	return
}, 250);


var nRows = 1;
var nSkins = 3;
nCharacters = nSkins * nRows;
var character;
for (var i = 0; i < nCharacters; i++) {

	character = new THREE.MD2CharacterComplex();
	character.scale = 3;

	character.controls = CharacterControls;
	characters.push(character);


}

var baseCharacter = new THREE.MD2CharacterComplex();
baseCharacter.scale = 1;
var cloneCharacter;
baseCharacter.onLoadComplete = function() {

	var k = 0;

	for (var j = 0; j < nRows; j++) {

		for (var i = 0; i < nSkins; i++) {

			cloneCharacter = characters[k];

			cloneCharacter.shareParts(baseCharacter);

			cloneCharacter.enableShadows(true);

			cloneCharacter.setWeapon(0);
			cloneCharacter.setSkin(i);
			cloneCharacter.setWireframe(true);
			cloneCharacter.root.position.x = (i - nSkins / 2) * 150;
			cloneCharacter.root.position.z = j * 250;
			cloneCharacter.root.position.y = 85;

			scene.add(cloneCharacter.root);



			k++;

		}

	}
	characters[1].setWireframe(false)
	var gyro = new THREE.Gyroscope();
	gyro.add(camera);

	characters[Math.floor(nSkins / 2)].root.add(gyro);
	var audio = document.getElementById('audio_1');
	var audio2 = document.getElementById('audio_2')
	toggleAudio();
	audio.volume = 0.55;
	audio2.volume = 0.65;
	$('.loader').hide();
};

baseCharacter.loadParts(configModel);


//tubes
var tube;

function drawTube(tube) {
	var radius = 20;
	var path;
	path = new THREE.SplineCurve3();
	path.points.push(meshes['attachmentA'].position);
	path.points.push(new THREE.Vector3(0, 300, 0));
	path.points.push(meshes['attachmentC'].position);

	tube = new THREE.Mesh(new THREE.TubeGeometry(path, 100, radius, 4), new THREE.MeshPhongMaterial({
		color: 0xff00ff
	}));
	tube.castShadow = true;
	tube.receiveShadow = true;
	tube.scale = new THREE.Vector3(1, 1, 1);
	scene.add(tube);
	//	collidersArray.push(tube);
	return tube
}
var tube2;

function drawTube2(tube2) {
	var radius2 = 10;
	var path2;
	path2 = new THREE.SplineCurve3();
	path2.points.push(meshes['attachmentB'].position);
	path2.points.push(new THREE.Vector3(-800, -300, 0));
	path2.points.push(meshes['attachmentF'].position);

	tube2 = new THREE.Mesh(new THREE.TubeGeometry(path2, 100, radius2, 4), new THREE.MeshPhongMaterial({
		color: 0x00ff50
	}));
	tube2.castShadow = true;
	tube2.receiveShadow = true;
	tube2.scale = new THREE.Vector3(1, 1, 1);
	scene.add(tube2);
	//	collidersArray.push(tube2);
	return tube2
}

var tube3;

function drawTube3(tube3) {
	var radius3 = 10;
	var path3;
	path3 = new THREE.SplineCurve3();
	path3.points.push(meshes['attachmentD'].position);
	path3.points.push(new THREE.Vector3(400, 600, 0));
	path3.points.push(meshes['attachmentE'].position);

	tube3 = new THREE.Mesh(new THREE.TubeGeometry(path3, 100, radius3, 4), new THREE.MeshPhongMaterial({
		color: 0xffA500
	}));
	tube3.castShadow = true;
	tube3.receiveShadow = true;
	tube3.scale = new THREE.Vector3(1, 1, 1);
	scene.add(tube3);
	//		collidersArray.push(tube3);
	return tube3
}



var camera2;
camera2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 9500);
camera2.updateProjectionMatrix();
scene.add(camera2);
camera2.position = new THREE.Vector3(-300, 300, -300);

renderManager.add('Above', scene, camera2, function(delta, renderer) {
		THREEx.WindowResize(renderer, this.camera);
		THREE.Object3D._threexDomEvent.camera(this.camera)

		branchTexture.needsUpdate = true;
		leafTexture.needsUpdate = true;
		RTTmaterial.needsUpdate = true;
		materialScreen.needsUpdate = true;


		renderer.autoClear = false;

		THREE.Object3D._threexDomEvent.camera(this.camera);

		funstuff();


		controls.object = this.camera;
		controls.constrainVertical = true;
		controls.verticalMin = 2.75;
		controls.verticalMax = 1.25;

		renderer.render(scene, cameraRTT, rtTexture, true);
		//	renderer.render( sceneScreen, cameraRTT );
		this.camera.lookAt(characters[1].root.position);

		renderer.render(this.scene, this.camera);

		if (this.camera.position.y <= 20) {
			this.camera.position.y = 20;
		}
		//ceiling
		if (this.camera.position.y >= 1200) {
			this.camera.position.y = 1180;
		}

		//walls

		if (this.camera.position.x >= 2600) {
			this.camera.position.x = 2560;
		}
		if (this.camera.position.x <= -2600) {
			this.camera.position.x = -2560;
		}

		if (this.camera.position.z >= 2600) {
			this.camera.position.z = 2560;
		}
		if (this.camera.position.z <= -2600) {
			this.camera.position.z = -2560;
		}


		//collisionDetection()


	}

);

var camera3;
camera3 = new THREE.PerspectiveCamera(160, window.innerWidth / window.innerHeight, 1, 9500);
camera3.updateProjectionMatrix();
scene.add(camera3);
camera3.position = new THREE.Vector3(-300, 300, -300);

renderManager.add('Below', scene, camera3, function(delta, renderer) {
		branchTexture.needsUpdate = true;
		leafTexture.needsUpdate = true;
		RTTmaterial.needsUpdate = true;
		materialScreen.needsUpdate = true;
		renderer.autoClear = false;


		funstuff();

		camera3.position.x = Math.sin(spinTimer) * 200;
		camera3.position.z = Math.cos(spinTimer) * -200;
		camera3.position.z = Math.cos(spinTimer) * 80;

		if (camera3.position.y <= -1000) {
			camera3.position.y = -990;
		}
		//ceiling
		if (camera3.position.y >= 1000) {
			camera3.position.y = 990;
		}

		this.camera.lookAt(character.root.position)

		renderer.render(scene, cameraRTT, rtTexture, true);
		renderer.render(this.scene, this.camera);


	}

);

//secondscene
scene2Loader();

renderManager.add('Beyond', scene2, scene2camera, function(delta, renderer) {
		groundTexture.needsUpdate = true;
		THREEx.WindowResize(renderer, this.camera);
		THREE.Object3D._threexDomEvent.camera(this.camera);

		funstuff();
		controls.object = this.camera;

		//floor
		if (this.camera.position.y <= 10) {
			this.camera.position.y = 11;
		}
		//ceiling
		if (this.camera.position.y >= 3000) {
			this.camera.position.y = 1990;
		}


		if (this.camera.position.x >= 10000) {
			this.camera.position.x = 9990;
		}
		if (this.camera.position.x <= -10000) {
			this.camera.position.x = -9990;
		}

		if (this.camera.position.z >= 10000) {
			this.camera.position.z = 9990;
		}
		if (this.camera.position.z <= -10000) {
			this.camera.position.z = -9990;
		}



		/*	function recenterView(){

								this.camera.position = new THREE.Vector3(200,200,200);
								centerPoint = new THREE.Vector3(0,0,0);
								this.camera.lookAt(centerPoint);
							};
							
							if (recenterView = true){} 
				*/

		//collisionDetection()
		this.camera.lookAt(0, 0, 0);
		renderer.render(this.scene, this.camera);
	}

);



//prep for animation loop (funstuff)

//clock

var clock = new THREE.Clock();
//	delta = clock.getDelta();

//other movement timers

var time, delta, spinTimer, lightTimer, animDelta;

function movementTimer() {

	time = Date.now();
	spinTimer = time / 6000;
	lightTimer = time * 0.0025;
	animDelta = time - oldTime;
	delta = animDelta * 0.001;
	if (isNaN(animDelta) || animDelta > 1000 || animDelta === 0) {
		animDelta = 1000 / 60;
	}
	oldTime = time;

}

//character movement


function characterMovement() {

	for (var i = 0; i < nCharacters; i++) {

		characters[i].update(delta);

	}
}



//fireball movement

function fireballMovement() {

	// fireballshader turn 
	uniforms.time.value += 0.275 * delta;
	fireballmesh.rotation.y += 0.5 * delta;
	fireballmesh.rotation.x += 0.5 * delta;

	//fireball orbit

	fireballmesh.position.x = 4000 * Math.cos(spinTimer);
	fireballmesh.position.z = 4000 * Math.sin(spinTimer);

}
//particle movement

function particleMovement() {
	for (i = 0; i < scene.children.length; i++) {

		var object = scene.children[i];

		if (object instanceof THREE.ParticleSystem) {

			object.rotation.y = (spinTimer * (i < 4 ? i + 1 : -(i + 1)) / 32);

		}

	}

	for (i = 0; i < materials.length; i++) {

		color = parameters[i][0];

		h = (360 * (color[0] + spinTimer) % 360) / 360;
		materials[i].color.setHSV(h, color[1], color[2]);

	}
}


//light movement

var lightCos3, lightCos5, lightCos7, lightSin3, lightSin5, lightSin7;
var lightZ = 20,
	lightD = 75,
	lightE = 5,
	lightF = lightD * lightE;


function lightMovement() {

	lightCos3 = Math.cos(lightTimer * 0.3) * lightF;
	lightCos5 = Math.cos(lightTimer * 0.5) * lightF;
	lightCos7 = Math.cos(lightTimer * 0.7) * lightF;

	lightSin3 = Math.sin(lightTimer * 0.3) * lightF;
	lightSin5 = Math.sin(lightTimer * 0.7) * lightF;
	lightSin7 = Math.sin(lightTimer * 0.5) * lightF;


	light1.position.x = lightSin7;
	light1.position.z = lightCos3;
	//	lightcube1.position = light1.position;

	light2.position.x = lightCos3;
	light2.position.z = lightSin7;
	//		lightcube2.position = light2.position;


	light3.position.x = lightSin7;
	light3.position.z = lightSin5;
	//		lightcube3.position = light3.position;


	light4.position.x = lightSin3;
	light4.position.z = lightSin5;
	//		lightcube4.position = light4.position;

	light5.position.x = lightSin5;
	light5.position.z = lightCos5;
	//		lightcube5.position = light5.position;

	light6.position = fireballmesh.position
	light6.lookAt(0, 0, 0);

	scene2light1.position.x = lightCos5;
	scene2light1.position.z = lightSin5;
	scene2light1.lookAt(0, 0, 0);

	scene2light2.position.x = lightSin3;
	scene2light2.position.z = lightCos7;
	scene2light2.lookAt(0, 0, 0);

	scene2light3.position.x = lightCos3;
	scene2light3.position.z = lightCos3;
	scene2light3.lookAt(0, 0, 0)

	scene2spot1.position.x = lightSin3;
	scene2spot1.position.z = lightSin3;
	//	scene2spot1cube.position = scene2spot1.position;

	netLight.position.x = lightCos3;
	netLight.position.z = lightSin7;
}

function funstuff() {
	movementTimer();
	characterMovement();
	fireballMovement();
	particleMovement();
	lightMovement();
	TWEEN.update();
	controls.update(clock.getDelta());
}

var cameraRTT, sceneRTT, sceneScreen;

var rtTexture, material, quad;

//sceneRTT = new THREE.Scene();
sceneScreen = new THREE.Scene();
sceneRTT = new THREE.Scene();
cameraRTT = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
cameraRTT.position.z = 1000;

sceneRTT.add(cameraRTT);

var RTTlight = new THREE.DirectionalLight(0xffffff);
RTTlight.position.set(0, 0, 1).normalize();
sceneRTT.add(RTTlight);

RTTlight = new THREE.DirectionalLight(0xffaaaa, 1.5);
RTTlight.position.set(0, -1, -1).normalize();
sceneRTT.add(RTTlight);

rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.NearestFilter,
	format: THREE.RGBFormat
});

RTTmaterial = new THREE.ShaderMaterial({

	uniforms: {
		time: {
			type: "f",
			value: 0.0
		}
	},
	vertexShader: document.getElementById('RTTvertexShader').textContent,
	fragmentShader: document.getElementById('fragment_shader_pass_1').textContent

});
var materialScreen = new THREE.ShaderMaterial({

	uniforms: {
		tDiffuse: {
			type: "t",
			value: 0,
			texture: rtTexture
		}
	},
	vertexShader: document.getElementById('RTTvertexShader').textContent,
	fragmentShader: document.getElementById('fragment_shader_screen').textContent,
	depthWrite: false

});
var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

quad = new THREE.Mesh(plane, materialScreen);
quad.position.z = -200;
quad.rotation.x = Math.PI / 2;
sceneRTT.add(quad);

quad = new THREE.Mesh(plane, materialScreen);
quad.position.z = -200;
quad.rotation.x = Math.PI / 2;
quad.rotation.y = Math.PI;
quad.scale = new THREE.Vector3(0.5, 0.5, 0.5);
sceneScreen.add(quad);


// pubsub_selector_plane
// plane
var pubsubplane_geometry = new THREE.PlaneGeometry(150, 150);
var pubsubplane = new THREE.Mesh(pubsubplane_geometry, materialScreen);
pubsubplane.position = new THREE.Vector3(12.26993865, -60, -58.47953216);
pubsubplane.rotation = new THREE.Vector3(0, -1, 0);
pubsubplane.scale = new THREE.Vector3(1.4, 1.4, 1.4);
pubsubplane.doubleSided = true;
pubsubplane.receiveShadow = false;
pubsubplane.castShadow = false;
//pubsubplane.castShadow=true;
scene.add(pubsubplane);



function animate() {
	requestAnimationFrame(animate);
	// create render target
	if (RTTmaterial.uniforms.time.value > 1 || RTTmaterial.uniforms.time.value < 0) {

		delta *= -1;

	}
	RTTmaterial.uniforms.time.value += delta;
	renderManager.renderCurrent();
	if (typeof group !== 'undefined') {

	}

	//audio

	// get the input and update position
	// getInput();

	// //audioooooooooo
	// makeNoise();
}
/*setTimeout("animate();",4000);*/
animate();
camera2.lookAt(character.root.position);

function drawManyTrees(locations) {
	var treePositionIndex = {
		x: 0,
		y: 0,
		z: 0
	}
	_.each(locations, function(location) {
		var tree = new Tree(branchMaterial, -1, 15, 0, 1.5);
		tree.position = new THREE.Vector3(0, 0, 0)
		tree.rotation.x = -90 * Math.PI / 180;
		tree.scale = new THREE.Vector3(1, 1, 1)
		tree.castShadow = false;
		tree.receiveShadow = false;
		//tree container
		var treeContainer = new THREE.Object3D();
		treeContainer.useQuaternion = true;
		treeContainer.add(tree);
		treeContainer.position = new THREE.Vector3(location[0], location[1], location[2]);
		scene2.add(treeContainer);
		console.log('tree container:', treeContainer)
	})


}

function drawDynamicText(txtInput) {
	var dynamicTexture = new THREEx.DynamicTexture(512, 512)
	var geometry = new THREE.CubeGeometry(100, 100, 100);
	var material = new THREE.MeshBasicMaterial({
		map: dynamicTexture.texture
	})
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position = new THREE.Vector3(200, 200, 200);
	scene2.add(mesh);
	dynamicTexture.clear('cyan');
	dynamicTexture.drawText(txtInput, null, null, 'red')
}

var dynamicTextureMeshes = [];

function drawDynamic(txtInput, geometry) {
	var dynamicTexture = new THREEx.DynamicTexture(512, 512)

	var material = new THREE.MeshBasicMaterial({
		map: dynamicTexture.texture
	})
	var mesh = new THREE.Mesh(geometry, material);

	dynamicTextureMeshes.push(dynamicTexture);
	dynamicTexture.clear('cyan');
	dynamicTexture.drawText(txtInput, 32, 256, 'red')
	return mesh
}

function drawManyTexts(desire) {
	var location = desire.location
	_.each(desire, function(desire) {
		var textGeo = new THREE.TextGeometry(txt, {

			size: size,
			height: height,
			curveSegments: curveSegments,

			font: font,
			weight: weight,
			style: style,

			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: bevelEnabled,

			bend: bend,

			material: 0,
			extrudeMaterial: 1

		});
		textGeo.materials = [textMaterialFront, textMaterialSide];

		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();

		// "fix" side normals by removing z-component of normals for side faces
		// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

		if (!bevelEnabled) {

			var triangleAresaHeuristics = 0.1 * (height * size);

			for (var i = 0; i < textGeo.faces.length; i++) {

				var face = textGeo.faces[i];

				if (face.materialIndex == 1) {

					for (var j = 0; j < face.vertexNormals.length; j++) {

						face.vertexNormals[j].z = 0;
						face.vertexNormals[j].normalize();

					}

					var va = textGeo.vertices[face.a].position;
					var vb = textGeo.vertices[face.b].position;
					var vc = textGeo.vertices[face.c].position;

					var s = THREE.GeometryUtils.triangleArea(va, vb, vc);

					if (s > triangleAreaHeuristics) {

						for (var j = 0; j < face.vertexNormals.length; j++) {

							face.vertexNormals[j].copy(face.normal);

						}

					}

				}

			}

			text
		}

		var centerOffset = -0.3 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

		var textMesh1 = new THREE.Mesh(textGeo, faceMaterial);

		textMesh1.position.x = location.x;
		textMesh1.position.y = location.y;
		textMesh1.position.z = location.z;

		textMesh1.rotation.x = 0;
		textMesh1.rotation.y = Math.PI * 2;

		txtparent.add(textMesh1);


	})
}

function localTransform() {
	scene2NetTree = new Tree(branchMaterial, -1, 25, 0, 1.5);
	scene2NetTree.position = new THREE.Vector3(0, 0, 0)
	scene2NetTree.rotation.x = -90 * Math.PI / 180;
	scene2NetTree.scale = new THREE.Vector3(1, 1, 1)
	scene2NetTree.castShadow = true;
	scene2NetTree.receiveShadow = true;
	//tree container
	scene2NetTreeContainer = new THREE.Object3D();
	scene2NetTreeContainer.useQuaternion = true;
	scene2NetTreeContainer.add(scene2NetTree);
	scene2NetTreeContainer.position = new THREE.Vector3(-1500, -20, 0);
	scene2.add(scene2NetTreeContainer);



	// neshamot

	// neshamotLoader = new THREE.JSONLoader();
	// neshamotLoader.load("neshamot.js", function(neshamotGeometry) {
	// 	neshamotMaterial = new THREE.MeshPhongMaterial();
	// 	neshamotMaterial.color = new THREE.Color().setRGB(0, 0, 0);
	// 	neshamotMaterial.ambient = new THREE.Color().setRGB(0.0196078431372549, 0.0196078431372549, 0.0196078431372549);
	// 	neshamotMaterial.specular = new THREE.Color().setRGB(0.06666666666666667, 0.06666666666666667, 0.06666666666666667);
	// 	neshamotMaterial.morphTargets = true;
	// 	//material.map =
	// 	neshamot = new THREE.MorphAnimMesh(neshamotGeometry, neshamotMaterial);
	// 	neshamot.position.set(-750, -30, 0);
	// 	neshamot.rotation.set(0, 0, 0);
	// 	neshamot.scale.set(2.5, 2.5, 2.5);
	// 	neshamot.receiveShadow = true;
	// 	neshamot.castShadow = true;
	// 	scene2.add(neshamot);
	// 	neshamot.lookAt(scene2NetTreeContainer.position);
	// 	neshamotHere = true;



	// });

	//character
	netCharacters = [];
	nnetCharacters = 0;

	netCharacterControls = {

		moveForward: false,
		moveBackward: false,
		moveLeft: false,
		moveRight: false,
		attack: false,
		pain: false,
		death: false,
		wave: false,
		flip: false,
		taunt: false,
		point: false,

	};
	netConfigModel = {

		baseUrl: "models/faerie/",

		body: "faerie.js",
		//body: "ogro-light.js",
		/*skins: [ "grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png",
				 "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png",
				 "sharokh.png" ],*/
		skins: ["Faerie2.png"],
		weapons: [
			["faeriewand.js", "weapon.png"]
		],
		//	weapons:  [ [ "weapon-light.js", "weapon.jpg" ] ],
		animations: {
			move: "run",
			idle: "stand",
			jump: "jump",
			attack: "attack",
			crouchMove: "crwalk",
			crouchIdle: "crstand",
			crouchAttach: "crattack",
			pain: "pain",
			death: "death",
			wave: "wave",
			flip: "flip",
			taunt: "taunt",
			point: "point"
		},

		walkSpeed: 250,
		crouchSpeed: 175

	};



	nnetRows = 1;
	//	var nSkins = configOgro.skins.length;
	nnetSkins = 1;
	nnetCharacters = nnetSkins * nnetRows;
	for (var i = 0; i < nCharacters; i++) {

		netCharacter = new THREE.MD2CharacterComplex();
		netCharacter.scale = 3;
		netCharacter.controls = netCharacterControls;

		netCharacters.push(netCharacter);


	}

	netBaseCharacter = new THREE.MD2CharacterComplex();
	netBaseCharacter.scale = 3;
	netBaseCharacter.onLoadComplete = function() {

		var k = 0;

		for (var j = 0; j < nRows; j++) {

			for (var i = 0; i < nSkins; i++) {

				cloneCharacterNet = netCharacters[k];

				cloneCharacterNet.shareParts(netBaseCharacter);

				cloneCharacterNet.enableShadows(true);

				cloneCharacterNet.setWeapon(0);
				cloneCharacterNet.setSkin(i);

				cloneCharacterNet.root.position = new THREE.Vector3(-1430, 90, 70);
				cloneCharacterNet.root.rotation = new THREE.Vector3(0, 3.75, 0);
				cloneCharacterNet.castShadow = true;
				scene2.add(cloneCharacterNet.root);


				k++;

			}

		}

		netGyro = new THREE.Gyroscope();
		netGyro.add(scene2camera);

		netCharacters[Math.floor(nSkins / 2)].root.add(netGyro);

		function drawdTube(dtube) {

			var dradius = 2.5;
			var dpath;
			dpath = new THREE.SplineCurve3();
			dpath.points.push(new THREE.Vector3(-1500, 90, 0));
			dpath.points.push(new THREE.Vector3(-1430, 140, 70));

			dtube = new THREE.Mesh(new THREE.TubeGeometry(dpath, 100, dradius, 4), new THREE.MeshPhongMaterial({
				color: 0xff00ff
			}));
			dtube.castShadow = true;
			dtube.receiveShadow = true;
			dtube.scale = new THREE.Vector3(1, 1, 1);
			scene2.add(dtube);
			return dtube
		}


		drawdTube();

	};

	netBaseCharacter.loadParts(netConfigModel);

	netLight.position = new THREE.Vector3(-1500, 1200, 0);
	netLight.target = netCharacter.root;



}

function createText() {

	textGeo = new THREE.TextGeometry(text, {

		size: size,
		height: height,
		curveSegments: curveSegments,

		font: font,
		weight: weight,
		style: style,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,

		bend: bend,

		material: 0,
		extrudeMaterial: 1

	});
	textGeo.materials = [textMaterialFront, textMaterialSide];

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	// "fix" side normals by removing z-component of normals for side faces
	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

	if (!bevelEnabled) {

		var triangleAresaHeuristics = 0.1 * (height * size);

		for (var i = 0; i < textGeo.faces.length; i++) {

			var face = textGeo.faces[i];

			if (face.materialIndex == 1) {

				for (var j = 0; j < face.vertexNormals.length; j++) {

					face.vertexNormals[j].z = 0;
					face.vertexNormals[j].normalize();

				}

				var va = textGeo.vertices[face.a].position;
				var vb = textGeo.vertices[face.b].position;
				var vc = textGeo.vertices[face.c].position;

				var s = THREE.GeometryUtils.triangleArea(va, vb, vc);

				if (s > triangleAreaHeuristics) {

					for (var j = 0; j < face.vertexNormals.length; j++) {

						face.vertexNormals[j].copy(face.normal);

					}

				}

			}

		}

		text
	}

	var centerOffset = -0.3 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

	textMesh1 = new THREE.Mesh(textGeo, faceMaterial);

	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;

	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;

	txtparent.add(textMesh1);
	if (mirror) {

		textMesh2 = new THREE.Mesh(textGeo, faceMaterial);

		textMesh2.position.x = centerOffset;
		textMesh2.position.y = -hover;
		textMesh2.position.z = height;

		textMesh2.rotation.x = Math.PI;
		textMesh2.rotation.y = Math.PI * 2;

		txtparent.add(textMesh2);


	}
}

/*
function show_prompt_name()
{
var name=prompt("what do they call you?","wanderer");
if (name!=null && name!="")
  {
  console.log("<p>Hello " + name + "! welcome to persist.io?</p>");
$.get("http://persist.io:7379/SADD/userNames/"+name)
  }



}
*/

var myDesire, myAnswer, txtparent;
var desires = {
	prompt: function() {
		var myDesire = this.alertifyPrompt()

	},
	alertifyPrompt: function() {
		var _t = this;
		alertify.prompt('Tell me...', 'What do you want from life, ultimately?', '',
			function(evt, value) {

				_t.postPrompt(value);
			},
			function() {
				alertify.message('Tell me...')
			}
		);

	},
	postPrompt: function(myDesire) {
		options = {
			txt: myDesire
		}

		console.log('options is', options)
		if (options.txt !== null && options.txt !== "") {
			renderManager.setCurrent('Beyond');
			toggleScene();

			controls.movementSpeed = 200;
			plant1.position.y = -30

			scene2.remove(txtparent);

			text = "Was ihr seid, das waren wir. Was wir sind, das werdet ihr.";
			txtparent = new THREE.Object3D();
			txtparent.rotation = new THREE.Vector3(0, 120, 0);
			txtparent.scale = new THREE.Vector3(1, 1, 1);
			txtparent.position = new THREE.Vector3(-1430, 500, 70);

			createText();
			scene2.add(txtparent);

			var tmpDate = new moment();
			var tmpDateString1 = tmpDate.format('L');
			text = tmpDateString1;
			txtparent = new THREE.Object3D();
			txtparent.position = new THREE.Vector3(-1430, 200, 70);
			txtparent.scale = new THREE.Vector3(0.25, 0.25, 0.25);
			txtparent.rotation = new THREE.Vector3(0, 120, 0);



			createText();
			scene2.add(txtparent);

			text = myDesire;
			txtparent = new THREE.Object3D();
			txtparent.position = new THREE.Vector3(-1430, 250, 70);
			txtparent.scale = new THREE.Vector3(0.25, 0.32, 0.32);
			txtparent.rotation = new THREE.Vector3(0, 120, 0);

			createText();
			scene2.add(txtparent);


			controls.freeze = true;
			scene2camera.position.set(0, 0, 1000);
			scene2camera.lookAt(scene2NetTreeContainer.position);
			new TWEEN.Tween(scene2camera.position).to({
				x: 0,
				y: 0,
				z: 200
			}, 10000).start().onComplete(function() {
				controls.freeze = false;
			});

			var writeDesire = $.post('api/desires', options).done(function(data) {
					console.log('data in post is:', data)

					startScene2Tweens();
				})
				.fail(function(e) {
					alert("error saving data to api", e);
				})
		} else {
			alertify.message('Tell me...')
			console.log('should have desire to store');
		}
	}
};