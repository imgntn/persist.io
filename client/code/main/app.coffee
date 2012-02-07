# Client Side code

world = require 'world'

window.sc =
  user: null
  myCube: null
  cubes: {}

# wait for server to send us a cube
ss.event.on 'initCube', (cube, local) ->
  # getting clients cubes
  if local
    console.log 'my cube'
    sc.myCube = initCube(cube, true)
  # getting others cubes
  else
    console.log 'their cube'
    sc.cubes[cube.name] = initCube(cube, false)
    
# return existing cube or
# create a new cube and add it to the scene
initCube = (cube, local) ->
  console.log 'initializing cube'
  
  for tc in sc.cubes
    if tc.id is cube.id
      return tc
  
  if sc.myCube? and sc.myCube.id is cube.id
    return sc.myCube
    
  return world.newCube cube, local
      
# show the login page
displaySignIn = ->
  
  # sign in submition
  $('#signIn').show().submit ->
    console.log "submitting username"
    
    #store username globablly
    sc.user = $('#signIn').find('input').val()
    
    # ask server to log in
    ss.rpc "auth.signIn", sc.user, (response) ->
      
      # error if user already exists
      if response.error
        console.log "response error"
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
  console.log "displaying scene"
  setupCanvas()
  $('#main').show()
  
setupCanvas = ->
  console.log "setting up canvas"
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
      console.log "signed in"
      displayScene() 
      
    # not logged in
    else 
      console.log "not signed in"
      displaySignIn()


SocketStream.event.on 'ready', ->
  console.log "socket stream ready"
  init()
  
SocketStream.event.on 'disconnect', ->
  console.log "triggered"
  ss.rpc "auth.logout", (response) ->
    console.log "responded"

init() unless initialized


