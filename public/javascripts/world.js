if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();

animate();

function init() {
    container = document.createElement( 'div' );
    
    document.body.appendChild( container );
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000094, 1, 15000 );
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.z = 1000;
    scene.add(camera);
    
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.1;
    
    var light = new THREE.PointLight( 0x50ffff );
    light.position.set( 0, 0, 0 );
    scene.add( light );
    
    light = new THREE.DirectionalLight( 0xffff8c );
    light.position.set( 0, 0, 1 ).normalize();
    scene.add( light );
    
    var material = new THREE.MeshLambertMaterial( { color: 0xDF00FF, wireframe: false } );
    
    var geometry = [
        [ new THREE.SphereGeometry( 100, 256, 32 ), 300 ],
        [ new THREE.SphereGeometry( 100, 128, 16 ), 1000 ],
        [ new THREE.SphereGeometry( 100, 64, 8 ), 2000 ],
        [ new THREE.SphereGeometry( 100, 32, 4 ), 10000 ]
    ];
    
    var i, j, mesh, lod;
    
    for ( j = 0; j < 400; j ++ ) {
        
        lod = new THREE.LOD();
        
        for ( i = 0; i < geometry.length; i ++ ) {
            mesh = new THREE.Mesh( geometry[ i ][ 0 ], material );
            
            mesh.scale.set( 1.78, 1.78, 1.78 );
            
            mesh.updateMatrix();
            
            mesh.matrixAutoUpdate = false;
            
            lod.addLevel( mesh, geometry[ i ][ 1 ] );
        }
        
        lod.position.x = 10000 * ( 0.5 - Math.random() );
        lod.position.y =  5500 * ( 0.5 - Math.random() );
        lod.position.z = 10000 * ( 0.5 - Math.random() );
        
        lod.updateMatrix();
        
        lod.matrixAutoUpdate = false;
        
        scene.add( lod );
    }
    renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: .5 } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    renderer.autoUpdateScene = false;
    container.appendChild( renderer.domElement );
}

function onDocumentMouseMove(event) {
    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    //camera.position.x += ( mouseX - camera.position.x ) * .005;
    //camera.position.y += ( - mouseY - camera.position.y ) * .01;
    
    //camera.lookAt( scene.position );
    
    controls.update(clock.getDelta());
    
    scene.updateMatrixWorld();
    
    THREE.SceneUtils.traverseHierarchy( scene, function ( node ) { if ( node instanceof THREE.LOD ) node.update( camera ) } );
    
    renderer.render( scene, camera );
}
