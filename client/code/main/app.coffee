# Client Side code

scene = require 'scene'

ss.event.on 'initCube', (cube) ->
  # initialize cube
  false

initialized = false

init = ->
  ss.rpc "auth.init", (user) ->
    if user
      console.log "signed in"
      displayScene() 
    else 
      console.log "not signed in"
      displaySignIn()
      
displaySignIn = ->
  $('#signIn').show().submit ->
    console.log "submitting username"
    ss.rpc "auth.signIn", $('#signIn').find('input').val(), (response) ->
      console.log "sign in successful"
      $('signIn').fadeOut(230)
      displayScene()
    false
    
displayScene = ->
  console.log "displaying scene"
  setupCanvas()
  $('#main').show()
  
setupCanvas = ->
  console.log "setting up canvas"
  console.log "initializing"
  if not scene.init()
    scene.animate()
  else
    console.log "did not init"
  initialized = true

SocketStream.event.on 'ready', ->
  console.log "socket stream ready"
  init()

init() unless initialized


