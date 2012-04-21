var scene2camera;


//tree vars
var scene2tree,scene2treeContainer;

var scene2tree2,scene2treeContainer2;


//light vars
var scene2light1,scene2light2,scene2light3,scene2spot1;


//ground vars
var ground, ground_geometry, ground_material, groundimage;


//skybox var
var urlPrefix,urls,textureCube,skyShader,skyUniforms,skyMaterial,skyMesh;


//lightcube vars

var scene2spot1cube, scene2spot1cube_geometry, scene2spot1cube_material;

//txt

var textMesh1, textMesh2, textGeo, faceMaterial, textMaterialFront, textMaterialSide, txtparent;

				var firstLetter = true;

				var text = "Was ihr seid, das waren wir. Was wir sind, das werdet ihr.";
				
					var mirror = false;

					var fontMap = {
					"helvetiker"  : 0,
				/*	"optimer"  	  : 1,
					"gentilis" 	  : 2,
					"droid sans"  : 3,
					"droid serif" : 4
					*/

					};

					var weightMap = {
					"normal"	: 0,
					"bold"		: 1
					}

					var reverseFontMap = {};
					var reverseWeightMap = {};

					for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
					for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;
				

function scene2Loader(){




scene2camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 1, 150000 );
scene2camera.updateProjectionMatrix();
scene2camera.position = new THREE.Vector3(0,500,500);


scene2 = new THREE.Scene();
scene2.add(scene2camera);

//THREE.Object3D._threexDomEvent.camera(scene2camera);


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
	groundimage= document.createElement( 'img' );
	groundimage.src = "ground2.jpg";
	groundTexture = new THREE.Texture( groundimage );
	groundTexture.needsUpdate = true;
	groundTexture.minFilter = THREE.LinearFilter;
	groundTexture.magFilter = THREE.LinearFilter;
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundGeometry = new THREE.PlaneGeometry( 10000, 10000 );
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
	scene2.add( scene2light1 );
	
	scene2light2 = new THREE.PointLight();
	scene2light2.intensity = 1;
	scene2light2.castShadow = false;
	scene2light2.color = new THREE.Color().setRGB(0.8,0,0.5);
	scene2light2.position.set(0,250,0);
	scene2light2.rotation.set(0,0,0);
	scene2light2.scale.set(5,5,5);
	scene2.add( scene2light2 );
	
	scene2light3 = new THREE.PointLight();
	scene2light3.intensity = 1;
	scene2light3.castShadow = false;
	scene2light3.color = new THREE.Color().setRGB(0.2,0.2,0.9);
	scene2light3.position.set(0,250,0);
	scene2light3.rotation.set(0,0,0);
	scene2light3.scale.set(5,5,5);
	scene2.add( scene2light3 );
	
	scene2spot1 = new THREE.SpotLight();
	scene2spot1.intensity = 1;
	scene2spot1.castShadow = true;
	scene2spot1.color = new THREE.Color().setRGB(1,1,1);
	scene2spot1.position.set(0,200,0);
	scene2spot1.rotation.set(0,0,0);
	scene2spot1.scale.set(1,1,1);
	scene2.add( scene2spot1 );
	
	//lightcubes
	
	 scene2spot1cube_geometry = new THREE.CubeGeometry(200,200,200);
	scene2spot1cube_material =  new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	scene2spot1cube = new THREE.Mesh( scene2spot1cube_geometry, scene2spot1cube_material );
	        scene2.add( scene2spot1cube );
	//skybox

	// load the cube textures
		 urlPrefix	= "skybox/cubemap_gradient/";
	/*	 urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
				urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
				urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
				*/
				 urls = [ urlPrefix + "posx.png", urlPrefix + "negx.png",
						urlPrefix + "posy.png", urlPrefix + "negy.png",
						urlPrefix + "posz.png", urlPrefix + "negz.png" ];
		 textureCube	= THREE.ImageUtils.loadTextureCube( urls );

		// init the cube shadder
		 skyShader	= THREE.ShaderUtils.lib["cube"];
		 skyUniforms	= THREE.UniformsUtils.clone( skyShader.uniforms );
		skyUniforms['tCube'].texture= textureCube;
		 skyMaterial = new THREE.ShaderMaterial({
			fragmentShader	: skyShader.fragmentShader,
			vertexShader	: skyShader.vertexShader,
			uniforms	: skyUniforms
		});

		// build the skybox Mesh
		skyMesh	= new THREE.Mesh( new THREE.CubeGeometry( 150000, 150000, 150000, 1, 1, 1, null, true ), skyMaterial );
		skyMesh.doubleSided = true;
		// add it to the scene
		scene2.add( skyMesh );
		
		
		
		
	
		
		
		
		
		
		
		
		
		
	//text

	

						height = 100,
						size = 100,
						hover = 600,

						curveSegments = 4,

						bevelThickness = 2,
						bevelSize = 1.5,
						bevelSegments = 3,
						bevelEnabled = true,
						bend = true,

						font = "helvetiker", 		// helvetiker
						weight = "bold",		// normal bold
						style = "normal";		// normal italic

				

		faceMaterial = new THREE.MeshFaceMaterial();

					textMaterialFront = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
					textMaterialSide = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );

					txtparent = new THREE.Object3D();
					txtparent.position.y = 100;

					scene2.add( txtparent );
		
	createText();
	
	function createText() {

					textGeo = new THREE.TextGeometry( text, {

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
					textGeo.materials = [ textMaterialFront, textMaterialSide ];

								textGeo.computeBoundingBox();
								textGeo.computeVertexNormals();

								// "fix" side normals by removing z-component of normals for side faces
								// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

								if ( ! bevelEnabled ) {

									var triangleAresaHeuristics = 0.1 * ( height * size );

									for ( var i = 0; i < textGeo.faces.length; i ++ ) {

										var face = textGeo.faces[ i ];

										if ( face.materialIndex == 1 ) {

											for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

												face.vertexNormals[ j ].z = 0;
												face.vertexNormals[ j ].normalize();

											}

											var va = textGeo.vertices[ face.a ].position;
											var vb = textGeo.vertices[ face.b ].position;
											var vc = textGeo.vertices[ face.c ].position;

											var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

											if ( s > triangleAreaHeuristics ) {

												for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

													face.vertexNormals[ j ].copy( face.normal );

												}

											}

										}

									}

								text}

								var centerOffset = -0.3 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

								textMesh1 = new THREE.Mesh( textGeo, faceMaterial );

								textMesh1.position.x = centerOffset;
								textMesh1.position.y = hover;
								textMesh1.position.z = 0;

								textMesh1.rotation.x = 0;
								textMesh1.rotation.y = Math.PI * 2;

								txtparent.add( textMesh1 );
								if ( mirror ) {

												textMesh2 = new THREE.Mesh( textGeo, faceMaterial );

												textMesh2.position.x = centerOffset;
												textMesh2.position.y = -hover;
												textMesh2.position.z = height;

												textMesh2.rotation.x = Math.PI;
												textMesh2.rotation.y = Math.PI * 2;

												txtparent.add( textMesh2 );
												

	}
	}
	}	
