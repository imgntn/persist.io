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
  
  exports.mouseX = 0
  exports.mouseY = 0
  
  # append renderer to container element
  renderer.setSize window.innerWidth, window.innerHeight
  $('#container').append(renderer.domElement)
    .mousemove (event) ->
      window.mouseX = event.pageX
      window.mouseY = event.pageY

  
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
  
  
  
  exports.length = 25
  spread = 1
  
  points = genLinePoints exports.length, spread
  
  path = new THREE.Spline points
  
  line = genMeshFromPath path, points

  scene.add line
  
  
  materials = ( new THREE.MeshBasicMaterial color: 0xffffff for i in [0..5] )
  cubeGeom = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1, materials)
  cubeMaterial = new THREE.MeshFaceMaterial()
  cube = new THREE.Mesh cubeGeom, cubeMaterial
  
  cube.velocity = new THREE.Vector3 0, 0, 0
  
  cube.update = (steering, maxSpeed, time) ->
    this.position.x += this.velocity.x * time
    this.position.y += this.velocity.y * time
    
    this.velocity.x += steering.linear.x * time
    this.velocity.y += steering.linear.y * time
    
    if this.velocity.length() > maxSpeed
      this.velocity.normalize()
      this.velocity.multiplyScalar maxSpeed
      
    
  
  scene.add cube
  
  exports.line = line
  exports.cube = cube
  
  exports.keyboard = new THREEx.KeyboardState()
  exports.clock = new THREE.Clock()
  
  exports.renderer = renderer
  exports.scene = scene
  exports.camera = camera
  exports.stats = stats
  
  exports.reset = false
  exports.finished = true
  exports.start = true
  exports.newPoints = []
  exports.newLine = null
  
  # return false
  false
  
genLinePoints = (length, spread) ->
  points = (new THREE.Vector3 0, i, 0 for i in [0..length] by spread)

genMeshFromPath = (path, points) ->
  geometry = new THREE.Geometry()
  colors = []
  
  for i in [0..points.length]
    
    index = i / points.length
    position = path.getPoint index
    
    geometry.vertices[i] = new THREE.Vertex new THREE.Vector3 position.x, position.y, position.z
    
    colors[i] = new THREE.Color 0xffffff 
    colors[i].setHSV i / points.length, 1.0, 1.0
    
  geometry.colors = colors
  
  material = new THREE.LineBasicMaterial color: 0xffffff, opacity: 1, linewidth: 3
  material.vertexColors = true
  
  return line = new THREE.Line geometry, material
  
exports.animate = ->
  # animation loop
  requestAnimationFrame exports.animate
  render()
  
  # update stats
  exports.stats.update()
  
render = ->
  maxSpeed = 8
  maxAcceleration = 10
  delta = exports.clock.getDelta()
  
  cube = exports.cube
  line = exports.line
  camera = exports.camera
  scene = exports.scene
  
  keyboard = exports.keyboard
  
  # reset login
  if keyboard.pressed('r') and not exports.reset
    exports.reset = true
    exports.start = true
    exports.finished = true
    exports.newPoints = []
    
    # remove new path and add cube
    scene.add cube
    scene.remove exports.newLine
    
    cube.position.x = 0
    cube.position.y = 0
    
    camera.position.y = 0
    
  else
    exports.reset = false
    
  # used to start
  if keyboard.pressed('space')and exports.start
    exports.finished = false
    exports.start = false
    
  if not exports.finished
    
    target = {}
    
    hw = window.innerWidth / 2.0
    hh = window.innerHeight / 2.0
    target.position = new THREE.Vector3 window.mouseX - hw, window.innerHeight - window.mouseY - hh, 0
    target.position.addSelf camera.position
    
    steering = getSteering cube, target, maxAcceleration
    
    cube.update steering, maxSpeed, delta
    
    camera.position.x = cube.position.x
    camera.position.y = cube.position.y
      
    # building new path
    exports.newPoints.push new THREE.Vector3 cube.position.x, cube.position.y, 0
    
    # if we have reached end of path
    if cube.position.y >= exports.length
      exports.finished = true
      
      path = new THREE.Spline exports.newPoints
      
      exports.newLine = genMeshFromPath path, exports.newPoints
      
      # remove cube and add new path
      scene.add exports.newLine
      scene.remove cube
      
  # if we have reached end and not reset
  else if not exports.start
    if keyboard.pressed 'up'
      camera.position.y += 10 * delta
    if keyboard.pressed 'down'
      camera.position.y -= 10 * delta
      
      
      
  exports.renderer.render exports.scene, exports.camera
  
getSteering = (character, target, maxAcceleration) ->
  steering = {}
  
  # get direction to target
  steering.linear = target.position.sub target.position, character.position
  
  # give full acceleration
  steering.linear.normalize()
  steering.linear.multiplyScalar maxAcceleration

  return steering
    
