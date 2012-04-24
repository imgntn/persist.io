var scene1Loader		= scene1Loader 		|| {};
scene1Loader.createIsland	= scene1Loader.createIsland	|| {};
scene1Loader.createBaptistery = scene1Loader.createBaptistery || {};
scene1Loader.createPlant1 = scene1Loader.createPlant1 || {};
scene1Loader.createAttachments = scene1Loader.createAttachments;
var island;
	var baptistery;
	var plant1;
	var meshes	= {};
	
var scene1Loader = function(){

 scene1Loader.createIsland = function(scene) {

	var island_loader = new THREE.JSONLoader();
	island_loader.load( "island1.js", function(island_geometry) {
	var island_material = new THREE.MeshPhongMaterial();
	island_material.color = new THREE.Color().setRGB(1,1,1);
	island_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	island_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
	island_material.doubleSided=true;
    //island_material.map =

	island = new THREE.Mesh(island_geometry, island_material);
	island.receiveShadow = true;
	island.position.set(0,0,0);
	island.rotation.set(0,0,0);
	island.scale.set(500,500,500);
	scene.add( island );
	//collidersArray.push(island);
	});
	return island;
};
		
	
scene1Loader.createBaptistery = function(scene) {

	var baptistery_loader = new THREE.JSONLoader();
	baptistery_loader.load( "last_baptistery2.js", function(bapstistery_geometry) {
	var baptistery_material = new THREE.MeshPhongMaterial();
	baptistery_material.color = new THREE.Color().setRGB(1,1,1);
	baptistery_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	baptistery_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
	//material.map =
	baptistery_material.doubleSided=true;
	baptistery = new THREE.Mesh(bapstistery_geometry, baptistery_material);
	baptistery.position.set(12.26993865,7.5,-58.47953216);
	baptistery.rotation.set(0,-0.84,0);
	baptistery.scale.set(22.5,22.5,22.5);
	baptistery.receiveShadow=true;
	scene.add( baptistery );
	//collidersArray.push(baptistery);
	});
	return baptistery;
};

scene1Loader.createPlant1 = function(scene) {
	var loader = new THREE.JSONLoader();
	loader.load( "iris.js", function(plant1_geometry) {
	var plant1_material = new THREE.MeshPhongMaterial();
	plant1_material.color = new THREE.Color().setRGB(1,1,1);
	plant1_material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	plant1_material.specular = new THREE.Color().setRGB(0.06666666666666667,0.06666666666666667,0.06666666666666667);
	//material.map =
	plant1 = new THREE.Mesh(plant1_geometry, plant1_material);
	plant1.position.set(150,10,50);
	plant1.rotation.set(0,0,0);
	plant1.scale.set(100,100,100);
	plant1.castShadow = true;
	plant1.receiveShadow = true;
	scene.add( plant1 );
//	collidersArray.push(plant1);
	});
	return plant1;
};


scene1Loader.createAttachments = function(scene, geometry) {
	
	var material	= new THREE.MeshPhongMaterial( { color: 0xFF8800 } );
	material.ambient = new THREE.Color().setRGB(0.0196078431372549,0.0196078431372549,0.0196078431372549);
	
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-213.1438721,11.19820829,246.3605823);
	mesh.rotation.set(0,-0.84,0);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentA']	= mesh;

	var material	= new THREE.MeshPhongMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-35.52397869,11.19820829,492.7211646);
	mesh.rotation.set(0,-0.6283185307179586,-0.06981317007977328);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentB']	= mesh;
	
	var material	= new THREE.MeshPhongMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(275.3108348,11.19820829,-235.162374);
	mesh.rotation.set(0,-0.6283185307179586,-0.06981317007977328);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentC']	= mesh;

	var material	= new THREE.MeshPhongMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-257.5488455,11.19820829,-235.162374);
	mesh.rotation.set(0,0.13962634015954656,0);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentD']	= mesh;
	
	var material	= new THREE.MeshPhongMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(195.3818828,11.19820829,235.162374);
	mesh.rotation.set(0,0.13962634015954656,0);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentE']	= mesh;
	
	var material	= new THREE.MeshPhongMaterial( { color: 0x88CC44 } );
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set(-8.880994671,11.19820829,-503.9193729);
	mesh.rotation.set(0,-2.303834612632515,0);
	mesh.scale= new THREE.Vector3(5,5,5);
	scene.add( mesh );
	meshes['attachmentF'] = mesh;
//collidersArray.push(meshes);
	return meshes;	
};


}
