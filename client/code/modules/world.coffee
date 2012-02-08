exports.init = ->
  # detect WebGL
  if Detector.webgl
    # create renderer
    renderer = new THREE.WebGLRenderer(
      antialias: true
      preserveDrawingBuffer: true
    )
    renderer.setClearColorHex 0x000000, 1
  else
    # prompt user to get webgl
    Detector.addGetWebGLMessage()
    console.log 'could not detect webgl'
    return true
  
  # append renderer to container element
  renderer.setSize window.innerWidth, window.innerHeight
  $('#container').append renderer.domElement
  
  # setup stats
  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.bottom = '0px'
  $('body').append stats.domElement
  
  # create scene
  scene = new THREE.Scene()
  
  # create camera and move it back
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set 0, 0, 30
  scene.add camera
  
  # make canvas resize with window
  THREEx.WindowResize.bind renderer, camera
  THREEx.Screenshot.bindKey renderer
  if THREEx.FullScreen.available()
    THREEx.FullScreen.bindKey()
    $("#inlineDoc").append "- <i>f</i> for fullscreen"
    
  light = new THREE.PointLight 0xffffff
  light.position.set( 0, 0, 5)
  scene.add light
  
  exports.keyboard = new THREEx.KeyboardState()
  exports.clock = new THREE.Clock()
  
  exports.renderer = renderer
  exports.scene = scene
  exports.camera = camera
  exports.stats = stats
  
  # return false
  false
  
exports.animate = ->
  # animation loop
  requestAnimationFrame exports.animate
  render()
  
  #update stats
  exports.stats.update()
  
exports.newCube = (cube, myCube) ->
  geometry = new THREE.CubeGeometry(3, 3, 3)
  
  c = if myCube then 0x00ff00 else 0x0000ff
    
  material = new THREE.MeshLambertMaterial(
    ambient: 0x080808
    color: c
  )
  
  mesh = new THREE.Mesh(geometry, material)
  mesh.position.set cube.x, cube.y, cube.z
  
  exports.scene.add mesh
  
  return mesh
  
render = ->
  SPEED = 15
  delta = exports.clock.getDelta()
  
  keyboard = exports.keyboard
  
  # TODO: find a way to remove keyboard logic from module
  # so that server interaction does not happen in this module
  myMesh = sc.meshes[sc.user]
  if myMesh?
    if keyboard.pressed 'left'
      myMesh.position.x -= SPEED * delta
    if keyboard.pressed 'right'
      myMesh.position.x += SPEED * delta
    if keyboard.pressed 'up'
      myMesh.position.y += SPEED * delta
    if keyboard.pressed 'down'
      myMesh.position.y -= SPEED * delta
      
  exports.renderer.render exports.scene, exports.camera
  
updateCube = (mesh, cube) ->
  cube.x = mesh.position.x
  cube.y = mesh.position.y
  cube.z = mesh.position.z
  
  # ss.rpc 'updateCube', cube, (response) ->
    
