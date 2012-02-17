# Client Side code

world = require 'world'
heartbeat = require 'heartbeat'

window.sc =
  user: null
  cubes: []
  meshes: []

# wait for server to send us a cube
ss.event.on 'initCube', (cube) ->
  console.log cube
  initCube(cube)
  
ss.event.on 'updateCube', (cube) ->
  if cube.name is sc.user
    return
    
  # update if not our cube
  else if sc.cubes[cube.name]
    for k, v of cube
      sc.cubes[cube.name][k] = v
    mesh = sc.meshes[cube.name]
    mesh.position.x = cube.x
    mesh.position.y = cube.y
    mesh.position.z = cube.z
  
  # cube couldnt be found
  else
    initCube cube
    
    
# return existing cube or
# create a new cube and add it to the scene
initCube = (cube) ->
  #console.log 'initializing cube'
  
  for user, c of sc.cubes
    if c.id is cube.id
      # cube with id already exists in my list
      return
      
  myCube = sc.user is cube.name
      
  sc.cubes[cube.name] = cube
  sc.meshes[cube.name] = world.newCube cube, myCube
      
# show the login page
displaySignIn = ->
  
  # sign in submition
  $('#signIn').show().submit ->
    #console.log "submitting username"
    
    #store username globablly
    sc.user = $('#signIn').find('input').val()
    
    # ask server to log in
    ss.rpc "auth.signIn", sc.user, (response) ->
      
      # error if user already exists
      if response.error
        #console.log "username already exists"
        $('#signIn').find('input').val('')
        $('#signIn').append("<p id='signInError'>" + response.error_msg + "</p>")
        
      # fadeOut login and show scene
      else
        $('#signIn').fadeOut(230)
        displayScene()
        
    # stop submit button from continuing
    false
    
# initialize the canvas and scene and show main view
displayScene = ->
  heartbeat.start()
  console.log "displaying scene"
  setupCanvas()
  $('#main').show()
  
setupCanvas = ->
  #console.log "setting up canvas"
  if not world.init()
    world.animate()
  else
    console.log "did not init WebGL"
  
  
initialized = false

init = ->
  initialized = true
  # ask server if I am logged in
  ss.rpc "auth.init", (user) ->
    # logged in
    if user
      sc.user = user.name
      #console.log "signed in"
      displayScene() 
      
    # not logged in
    else 
      #console.log "not signed in"
      displaySignIn()


SocketStream.event.on 'ready', ->
  console.log "socketstream ready event"
  init()

# Seems to create double init problems

#init()

window.alreadyConnect = ->
  if not initialized
    init()
    
setTimeout "alreadyConnect()", 300




