var scene2camera;

var scene2tree,scene2treeContainer;

var scene2tree2,scene2treeContainer2;

var scene2light1,scene2light2,scene2light3,scene2spot1;

var ground, ground_geometry, ground_material

function scene2Loader(){




scene2camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 1, 9500 );
scene2camera.updateProjectionMatrix();
scene2camera.position = new THREE.Vector3(0,300,300);


scene2 = new THREE.Scene();
scene2.add(scene2camera);
scene2.fog = new THREE.FogExp2( 0x000000, 0.0002 );

//THREE.Object3D._threexDomEvent.camera(scene2camera);


branchTexture = THREE.ImageUtils.loadTexture( "treebark.jpg" );
branchTexture.minFilter = THREE.LinearFilter;
branchTexture.magFilter = THREE.LinearFilter;
branchTexture.wrapS = branchTexture.wrapT = THREE.RepeatWrapping;
branchMaterial = new THREE.MeshPhongMaterial( { map:branchTexture, shininess: 2, ambient:0x998822} );
branchMaterial.shading = THREE.SmoothShading;

	scene2tree = new Tree(branchMaterial, -1 , 25, 0, 1);
	scene2tree.position = new THREE.Vector3(0,0,0)
	scene2tree.rotation.x = -90 * Math.PI / 180;
	scene2tree.scale = new THREE.Vector3(1,1,1)
	scene2tree.castShadow = true;
	scene2tree.receiveShadow = false;
	//tree container
	scene2treeContainer = new THREE.Object3D();
	scene2treeContainer.useQuaternion = true;
	scene2treeContainer.add( scene2tree );
	scene2treeContainer.position= new THREE.Vector3(0,-10,0);
	scene2.add(scene2treeContainer);
	
	scene2tree2 = new Tree(branchMaterial, -1 , 25, 0, 1);
	scene2tree2.position = new THREE.Vector3(0,0,0)
	scene2tree2.rotation.x = -90 * Math.PI / 180;
	scene2tree2.scale = new THREE.Vector3(1,1,1)
	scene2tree2.castShadow = true;
	scene2tree2.receiveShadow = false;
	//tree container
	scene2treeContainer2 = new THREE.Object3D();
	scene2treeContainer2.useQuaternion = true;
	scene2treeContainer2.add( scene2tree2 );
	scene2treeContainer2.position= new THREE.Vector3(1000,-10,0);
	scene2.add(scene2treeContainer2);
	
	
	
	
	//ground
	
	groundGeometry = new THREE.PlaneGeometry( 15000, 15000 );
	groundTexture = THREE.ImageUtils.loadTexture("ground2.jpg");
	groundTexture.minFilter = THREE.LinearFilter;
	groundTexture.magFilter = THREE.LinearFilter;
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundMaterial =  new THREE.MeshPhongMaterial( { map:groundTexture, shininess: 2, ambient:0x998822} );
	ground = new THREE.Mesh( groundGeometry, groundMaterial );
	ground.position = new THREE.Vector3(0,-10,0)
	ground.rotation = new THREE.Vector3(0,0,0)
	ground.doubleSided=true;
	ground.receiveShadow=true;
	ground.castShadow=false;
	scene2.add( ground );
	
	//lights

	
	
	scene2light1 = new THREE.PointLight();
	scene2light1.intensity = 1;
	scene2light1.castShadow = false;
	scene2light1.color = new THREE.Color().setRGB(0,1,0.5);
	scene2light1.position.set(0,250,0);
	scene2light1.rotation.set(0,0,0);
	scene2light1.scale.set(5,5,5);
	scene2light1.lookAt(scene2tree)
	scene2.add( scene2light1 );
	
	scene2light2 = new THREE.PointLight();
	scene2light2.intensity = 1;
	scene2light2.castShadow = false;
	scene2light2.color = new THREE.Color().setRGB(0.8,0,0.5);
	scene2light2.position.set(0,250,0);
	scene2light2.rotation.set(0,0,0);
	scene2light2.scale.set(5,5,5);
	scene2light2.lookAt(scene2tree);
	scene2.add( scene2light2 );
	
	scene2light3 = new THREE.PointLight();
	scene2light3.intensity = 1;
	scene2light3.castShadow = false;
	scene2light3.color = new THREE.Color().setRGB(0.2,0.2,0.9);
	scene2light3.position.set(0,250,0);
	scene2light3.rotation.set(0,0,0);
	scene2light3.scale.set(5,5,5);
	scene2light3.lookAt(scene2tree)
	scene2.add( scene2light3 );
	
	scene2spot1 = new THREE.SpotLight();
	scene2spot1.intensity = 1;
	scene2spot1.castShadow = true;
	scene2spot1.color = new THREE.Color().setRGB(1,1,1);
	scene2spot1.position.set(0,200,0);
	scene2spot1.rotation.set(0,0,0);
	scene2spot1.scale.set(1,1,1);
	scene2.add( scene2spot1 );
	
	}