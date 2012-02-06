scene = require 'scene'

initialized = false

init = ->
  initialized = true
  ss.rpc "demo.init", (obj) ->
    if obj?
      scene.newObject obj, true
    else
      console.log "object not returned"

SocketStream.event.on 'ready', ->
  console.log "socket stream ready"
  init()

init() unless initialized
  




$(document).ready ->
  console.log "document ready"
  if not scene.init()
    scene.animate()
  else
    console.log "did not init"
  
