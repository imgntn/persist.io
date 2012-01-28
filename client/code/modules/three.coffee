exports.init = ->
  if Detector.webgl
    exports.renderer = new THREE.WebGLRenderer(
      antialias: true
      preserveDrawingBuffer: true
    )
    exports.renderer.setClearColorHex 0xBBBBBB, 1
  else
    Detector.addGetWebGLMessage()
    return true
  exports.renderer.setSize window.innerWidth, window.innerHeight
  result = $('#container').append exports.renderer.domElement
  
  exports.stats = new Stats()
  exports.stats.domElement.style.position = 'absolute'
  exports.stats.domElement.style.bottom = '0px'
  $('body').append exports.stats.domElement
  
  exports.scene = new THREE.Scene()
  
  exports.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
  exports.camera.position.set 0, 0, 5
  exports.scene.add exports.camera
  
  THREEx.WindowResize.bind exports.renderer, exports.camera
  
  THREEx.Screenshot.bindKey exports.renderer
  
  if THREEx.FullScreen.available()
    THREEx.FullScreen.bindKey()
    $('#inlineDoc').append "- i <i>f</i> for fullscreen"
  
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
  geometry = new THREE.TorusGeometry(1, 0.42, 16, 16)
  material = new THREE.MeshLambertMaterial(
    ambient: 0x808080
    color: Math.random() * 0xffffff
  )
  mesh = new THREE.Mesh(geometry, material)
  exports.scene.add mesh
  
exports.animate = ->
  requestAnimationFrame exports.animate
  render()
  exports.stats.update()
  
render = ->
  PIseconds = Date.now() * Math.PI
  i = 0

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
  
exports.scene = undefined
exports.renderer = undefined
exports.camera = undefined
exports.stats = undefined

composer = undefined
