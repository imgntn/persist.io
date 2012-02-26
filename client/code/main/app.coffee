# Client Side code

world = require 'world'

BEAT_INTERVAL = 15000

window.sc =
  user: null
  cubes: {}
  meshes: {}

# wait for server to send us a cube
ss.event.on 'initCube', (cube) ->
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
    
ss.event.on 'logout', (username) ->
  
  # remove mesh from scene
  mesh = sc.meshes[username]
  world.removeCube mesh 
  
  # delete user from cube and mesh list
  delete sc.cubes[username]
  delete sc.meshes[username]
    
    
# return existing cube or
# create a new cube and add it to the scene
initCube = (cube) ->
  
  for own user, c of sc.cubes
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
    
    #store username globablly
    sc.user = $('#signIn').find('input').val()
    
    # ask server to log in
    ss.rpc "auth.signIn", sc.user, (response) ->
      
      # error if user already exists
      if response.error
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
  # startBeating()
  setupCanvas()
  $('#main').show()
  
setupCanvas = ->
  if not world.init()
    world.animate()
  else
    console.log "did not init WebGL"
    
# start the heart beating cycle
startBeating = ->
  # beat right away
  heartBeat()
  
  # beat every interval
  setInterval "heartBeat()", BEAT_INTERVAL
  
# send a hearbeat to server
window.heartBeat = ->
  console.log "beat..."
  ss.rpc 'core.heartBeat', (cubes) ->
    
    # get names from online cubes
    onlineUsers = (cube.name for cube in cubes)
    
    # loop through registered names and find the ones that aren't in the online list
    offlineUsers = (name for own name, cube of sc.cubes when onlineUsers.indexOf(name) < 0)
    
    # send message to server telling them to logout user
    offline name for name in offlineUsers
    console.log "offline:", offlineUsers
    
# tells server to logout specific user
offline = (name) ->
  console.log "log out:", name
  
  # logout
  ss.rpc 'core.logout', name
  
  
initialized = false

init = ->
  initialized = true
  # ask server if I am logged in
  ###
  ss.rpc "auth.init", (user) ->
    # logged in
    if user
      sc.user = user.name
      displayScene() 
      
    # not logged in
    else
      displaySignIn()
  ###
  displayScene() 


SocketStream.event.on 'ready', ->
  init()

# Seems to create double init problems

#init()

window.alreadyConnect = ->
  if not initialized
    init()
    
setTimeout "alreadyConnect()", 300




