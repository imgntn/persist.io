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
  
exports.newObject = (pos, userObj) ->
  geometry = new THREE.CubeGeometry(3, 3, 3)
  
  if userObj
    c = 0x00ff00
  else
    c = 0x0000ff
    
  material = new THREE.MeshLambertMaterial(
    ambient: 0x080808
    color: c
  )
  mesh = new THREE.Mesh(geometry, material)
  mesh.position.set pos.x, pos.y, pos.z
  
  if userObj
    exports.userObj = mesh
    
  exports.scene.add mesh
  
render = ->
  SPEED = 15
  delta = exports.clock.getDelta()
  userObj = exports.userObj
  
  if userObj?
    keyboard = exports.keyboard
    
    if keyboard.pressed 'left'
      userObj.position.x -= SPEED * delta
    if keyboard.pressed 'right'
      userObj.position.x += SPEED * delta
    if keyboard.pressed 'up'
      userObj.position.y += SPEED * delta
    if keyboard.pressed 'down'
      userObj.position.y -= SPEED * delta

  exports.renderer.render exports.scene, exports.camera
