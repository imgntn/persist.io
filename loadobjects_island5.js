var createIsland = function(scene) {
	var island;
	var island_loader = new THREE.JSONLoader();
	island_loader.load( "island5.js", function(island_geometry) {
	var island_material = new THREE.MeshLambertMaterial();
	island_material.color = new THREE.Color().setRGB(1,1,1);
	island_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	island_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
    //island_material.map = THREE.ImageUtils.loadTexture("grass.jpg");

	island = new THREE.Mesh(island_geometry, island_material);
		island.receiveShadow = true;
	island.position.set(0,0,0);
	island.rotation.set(0,0,0);
	island.scale.set(100,100,100);
	scene.add( island );
	});
	return island;
};

var createBaptistery = function(scene) {
	var baptistery;
	var baptistery_loader = new THREE.JSONLoader();
	baptistery_loader.load( "last_baptistery2.js", function(bapstistery_geometry) {
	var baptistery_material = new THREE.MeshLambertMaterial();
	baptistery_material.color = new THREE.Color().setRGB(1,1,1);
	baptistery_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	baptistery_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
	//material.map = THREE.ImageUtils.loadTexture("path/to/texture.jpg");
	
	baptistery = new THREE.Mesh(bapstistery_geometry, baptistery_material);
	baptistery.position.set(2.4539877300613355,0,-11.695906432748425);
	baptistery.rotation.set(0,-0.84,0);
	baptistery.scale.set(4.5,4.5,4.5);
	baptistery.receiveShadow=true;
	scene.add( baptistery );
	});
	return baptistery;
};

var createPlant1 = function(scene) {
	var plant1;
	var loader = new THREE.JSONLoader();
	loader.load( "plant1.js", function(plant1_geometry) {
	var plant1_material = new THREE.MeshLambertMaterial();
	plant1_material.color = new THREE.Color().setRGB(1,1,1);
	plant1_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	plant1_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
	//material.map = THREE.ImageUtils.loadTexture("path/to/texture.jpg");
	plant1 = new THREE.Mesh(plant1_geometry, plant1_material);
	plant1.position.set(30,10,10);
	plant1.rotation.set(0,0,0);
	plant1.scale.set(10,10,10);
	plant1.castShadow = true;
	plant1.receiveShadow = true;
	scene.add( plant1 );
	});
	return plant1;
};

var createAttachments = function(scene, geometry) {
	var meshes	= {};
	
	var material	= new THREE.MeshLambertMaterial( { color: 0xFF8800 } );
	material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-42.62877442273525,2.239641657334812,49.27211646136609);
	mesh.rotation.set(0,-0.84,0);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentA']	= mesh;

	var material	= new THREE.MeshLambertMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-7.10479573712278,2.2396416573348112,98.5442329227322);
	mesh.rotation.set(0,-0.6283185307179586,-0.06981317007977328);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentB']	= mesh;
	
	var material	= new THREE.MeshLambertMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(55.062166962699706,2.2396416573348112,-47.032474804031594);
	mesh.rotation.set(0,-0.6283185307179586,-0.06981317007977328);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentC']	= mesh;

	var material	= new THREE.MeshLambertMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-51.50976909413862,2.239641657334812,-47.03247480403115);
	mesh.rotation.set(0,0.13962634015954656,0);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentD']	= mesh;
	
	var material	= new THREE.MeshLambertMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(39.07637655417396,2.239641657334812,47.032474804031395);
	mesh.rotation.set(0,0.13962634015954656,0);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentE']	= mesh;
	
	var material	= new THREE.MeshLambertMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-1.77619893428081,2.239641657334812,-100.7838745800672);
	mesh.rotation.set(0,-2.303834612632515,0);
	mesh.scale= new THREE.Vector3(1,1,1);
	scene.add( mesh );
	meshes['attachmentF'] = mesh;

	return meshes;	
};