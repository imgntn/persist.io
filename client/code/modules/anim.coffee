exports.init = ->
  
  # detect WebGL
  if Detector.webgl
    # create renderer
    exports.renderer = new THREE.WebGLRenderer(
      antialias: true
      preserveDrawingBuffer: true
    )
    exports.renderer.setClearColorHex 0xBBBBBB, 1
  else
    # prompt user to get webgl
    Detector.addGetWebGLMessage()
    console.log 'could not detect webgl'
    return true
  
  # append renderer to container element
  exports.renderer.setSize window.innerWidth, window.innerHeight
  $('#container').append exports.renderer.domElement
  
  # setup stats
  exports.stats = new Stats()
  exports.stats.domElement.style.position = 'absolute'
  exports.stats.domElement.style.bottom = '0px'
  $('body').append exports.stats.domElement
  
  # create scene
  exports.scene = new THREE.Scene()
  
  # create camera and move it back
  exports.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
  exports.camera.position.set 0, 0, 15
  exports.scene.add exports.camera
  
  # make canvas resize with window
  THREEx.WindowResize.bind exports.renderer, exports.camera
  THREEx.Screenshot.bindKey exports.renderer
  if THREEx.FullScreen.available()
    THREEx.FullScreen.bindKey()
    #document.getElementById("inlineDoc").innerHTML += "- <i>f</i> for fullscreen"
    $("#inlineDoc").append "- <i>f</i> for fullscreen"
  
  # create lights
  light = new THREE.AmbientLight(Math.random() * 0xffffff)
  exports.scene.add light
  light = new THREE.DirectionalLight(Math.random() * 0xffffff)
  light.position.set(Math.random(), Math.random(), Math.random()).normalize()
  exports.scene.add light
  light = new THREE.DirectionalLight(Math.random() * 0xffffff)
  light.position.set(Math.random(), Math.random(), Math.random()).normalize()
  exports.scene.add light
  light = new THREE.PointLight(Math.random() * 0xffffff)
  light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar 1.2
  exports.scene.add light
  light = new THREE.PointLight(Math.random() * 0xffffff)
  light.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar 1.2
  exports.scene.add light
  
  # create geometry and material for mesh
  geometry = new THREE.CubeGeometry(1, 1, 1)
  material = new THREE.MeshLambertMaterial(
    ambient: 0x808080
    color: Math.random() * 0xffffff
  )
  mesh = new THREE.Mesh(geometry, material)
  exports.scene.add mesh 
  
  exports.mesh = mesh
  
  # create a gui
  exports.gui = new dat.GUI()
  
  
  
  # return false
  false
  
exports.animate = ->
  # animation loop
  requestAnimationFrame exports.animate
  render()
  
  #update stats
  exports.stats.update()
  
render = ->
  PIseconds = Date.now() * Math.PI
  i = 0

  # animate lights and cube
  while i < exports.scene.objects.length
    exports.scene.objects[i].rotation.y = PIseconds * 0.0003 * (if i % 2 then 1 else -1)
    exports.scene.objects[i].rotation.x = PIseconds * 0.0002 * (if i % 2 then 1 else -1)
    i++
  exports.scene.lights.forEach (light, idx) ->
    return  if light instanceof THREE.DirectionalLight is false
    ang = 0.0005 * PIseconds * (if idx % 2 then 1 else -1)
    light.position.set(Math.cos(ang), Math.sin(ang), Math.cos(ang * 2)).normalize()

  exports.scene.lights.forEach (light, idx) ->
    return  if light instanceof THREE.PointLight is false
    angle = 0.0005 * PIseconds * (if idx % 2 then 1 else -1) + idx * Math.PI / 3
    light.position.set(Math.cos(angle) * 3, Math.sin(angle * 3) * 2, Math.cos(angle * 2)).normalize().multiplyScalar 2

  exports.renderer.render exports.scene, exports.camera
