exports.init = ->
  # detect WebGL
  if Detector.webgl
    # create renderer
    renderer = exports.renderer = new THREE.WebGLRenderer(
      antialias: true
      preserveDrawingBuffer: true
    )
    renderer.setClearColorHex 0x000000, 1
  else
    # prompt user to get webgl
    Detector.addGetWebGLMessage()
    console.log 'could not detect webgl'
    return true
  
  mouseX = 0
  mouseY = 0
  
  # half width and half height
  hw = window.innerWidth / 2.0
  hh = window.innerHeight / 2.0
  
  maxAcceleration = exports.maxAcceleration = 10.0
  
  # append renderer to container element
  renderer.setSize window.innerWidth, window.innerHeight
  $('#container')
    .append(renderer.domElement)
    .mousemove (event) ->
      # keep track of mouse position
      mouseX = event.pageX
      mouseY = event.pageY
    
  # setup stats
  stats = exports.stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.bottom = '0px'
  $('body').append stats.domElement
  
  # create scene
  scene = exports.scene = new THREE.Scene()
  
  # create camera and move it back
  camera = exports.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set 0, 0, 30
  scene.add camera
  
  # make canvas resize with window
  THREEx.WindowResize.bind renderer, camera
  THREEx.Screenshot.bindKey renderer
  if THREEx.FullScreen.available()
    THREEx.FullScreen.bindKey()
    $("#inlineDoc").append "- <i>f</i> for fullscreen"
    
  # add lights
  light = new THREE.PointLight 0xffffff
  light.position.set( 0, 0, 5)
  scene.add light
  
  # generate line
  length = exports.length = 25
  spread = 1
  points = genLinePoints length, spread
  path = new THREE.Spline points
  line = exports.line = genMeshFromPath path, points
  scene.add line
  
  # generate cube
  materials = ( new THREE.MeshBasicMaterial color: 0xffffff for i in [0..5] )
  cubeGeom = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1, materials)
  cubeMaterial = new THREE.MeshFaceMaterial()
  cube = exports.cube = new THREE.Mesh cubeGeom, cubeMaterial
  scene.add cube
  
  # Movement logic for cube
  cube.velocity = new THREE.Vector3 0, 0, 0
  cube.update = (steering, maxSpeed, time) ->
    # change position by velocity
    @position.x += @velocity.x * time
    @position.y += @velocity.y * time
    
    # change velocity by steering
    @velocity.x += steering.linear.x * time
    @velocity.y += steering.linear.y * time
    
    # crop velocity by maxSpeed
    if @velocity.length() > maxSpeed
      @velocity.normalize()
      @velocity.multiplyScalar maxSpeed
      
      
  # Mouse target for mouse follow steering
  mouse = exports.mouse = 
    position: new THREE.Vector3()
    update: (camera) ->
      @position.x = mouseX - hw
      @position.y = window.innerHeight - mouseY - hh
      @position.addSelf camera.position
  mouseSeek = new Seek cube, mouse, maxAcceleration
  
  # Wind target for wind pushing
  windTarget = exports.windTarget =
    position: new THREE.Vector3()
    update: (cube) ->
      @position.x = cube.position.x + 50
      @position.y = cube.position.y
  exports.windForce = new Seek cube, windTarget, maxAcceleration / 2.0
  
  # List of steering behaviors to be applied to cube
  behaviors = exports.behaviors = new BlendedSteering maxAcceleration, 0
  behaviors.add mouseSeek
  
  exports.keyboard = new THREEx.KeyboardState()
  exports.clock = new THREE.Clock()
    
  exports.finished = true
  exports.start = true
  exports.newPoints = []
  exports.newLine = null
  exports.wind = false
  
  
  # return false
  false
  
# generate an array of points given a lenght and spread
genLinePoints = (length, spread) ->
  points = (new THREE.Vector3 0, i, 0 for i in [0..length] by spread)

# generate a mesh given a spline path and its points
genMeshFromPath = (path, points) ->
  geometry = new THREE.Geometry()
  colors = []
  
  # add vertex for every point along path
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
  cube = exports.cube
  windTarget = exports.windTarget
  line = exports.line
  camera = exports.camera
  scene = exports.scene
  keyboard = exports.keyboard
  clock = exports.clock
  mouse = exports.mouse
  
  maxSpeed = 5.0
  delta = clock.getDelta()
  
  # reset login
  if keyboard.pressed('r') and not exports.start
    exports.start = true
    exports.finished = true
    exports.newPoints = []
    exports.wind = false
    
    # remove new path and add cube
    scene.add cube
    scene.remove exports.newLine
    
    # remove wind force
    exports.behaviors.remove exports.windForce
    
    # reset cube
    cube.position.x = 0
    cube.position.y = 0
    
    # reset camera
    camera.position.y = 0
    
  # start movement after reset
  if keyboard.pressed('space') and exports.start
    exports.finished = false
    exports.start = false
    exports.windStart = Math.random() * exports.length * 0.75 / maxSpeed
    exports.startTime = clock.getElapsedTime()
    
    
  # if we have started
  if not exports.finished
  
    now = clock.getElapsedTime()
    
    # check for wind trigger
    if now - exports.startTime >= exports.windStart and not exports.wind
      exports.wind = true
      exports.behaviors.add exports.windForce
    
    # update camera position according to player
    camera.position.y = cube.position.y
    
    # update mouse position according to camera
    mouse.update camera
    
    # update wind target according to player
    windTarget.update cube
    
    # get steering for cube from all behaviors
    steering = exports.behaviors.getSteering()    
    
    # apply steering
    cube.update steering, maxSpeed, delta
      
    # building new path
    exports.newPoints.push new THREE.Vector3 cube.position.x, cube.position.y, 0
    
    # if we have reached end of path
    if cube.position.y >= exports.length
      exports.finished = true
      
      # generate path
      path = new THREE.Spline exports.newPoints
      
      # generate mesh from path
      exports.newLine = genMeshFromPath path, exports.newPoints
      
      # remove cube and add new path
      scene.add exports.newLine
      scene.remove cube
      
  # if we have reached end and not reset
  # used to control camera to view path
  else if not exports.start
  
    if keyboard.pressed 'up'
      camera.position.y += 10 * delta
    if keyboard.pressed 'down'
      camera.position.y -= 10 * delta
      
  # render the scene
  exports.renderer.render exports.scene, exports.camera
  
# Steering object that stores linear and angular acceleration
class SteeringOutput
  constructor: ->
    @linear = new THREE.Vector3()
    @angular = 0
  
  addSelf: (steering) ->
    @linear.addSelf steering.linear
    @angular += steering.angular
    return this
    
  multiplyScalar: (scale) ->
    @linear.multiplyScalar scale
    @angular *= scale
    return this
 
# Class that finds steering vector from character to target
class Seek
  constructor: (@character, @target, @maxAcceleration) ->
  
  getSteering: ->
    steering = new SteeringOutput
    
    # get direction to target
    steering.linear = @target.position.subSelf @character.position
    
    # give full acceleration along this direction
    steering.linear.normalize()
    steering.linear.multiplyScalar @maxAcceleration
    
    steering.angular = 0
    
    return steering
  
# Blends a series of steering behaviors by weight
class BlendedSteering
    
  constructor: (@maxAcceleration, @maxRotation) ->
    @behaviors = []
    @weights = []
    
  getSteering: ->
    steering = new SteeringOutput
    
    # accumulate steering
    for i in [0..@behaviors.length - 1]
      behavior = @behaviors[i]
      weight = @weights[i]
      steering.addSelf behavior.getSteering().multiplyScalar weight
      
    # truncate linear
    if steering.linear.length() > @maxAcceleration
      steering.linear.normalize()
      steering.linear.multiplyScalar @maxAcceleration
      
    # trancate angular
    if steering.angular > @maxRotation
      steering.angular = @maxRotation
      
    return steering
      
  # add behavior and its weight
  add: (behavior, weight = 1) ->
    @behaviors.push behavior
    @weights.push weight
    
  # remove a behavior
  remove: (behavior) ->
    index = @behaviors.indexOf behavior
    
    if index >= 0
      @behaviors.splice index, 1
      @weights.splice index, 1
    
