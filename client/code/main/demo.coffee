anim = require 'anim'
updatemesh = require 'updatemesh'

ss.event.on 'newScale', (scale) ->
  anim.mesh.scale.x = scale.x
  anim.mesh.scale.y = scale.y
  anim.mesh.scale.z = scale.z

SocketStream.event.on 'ready', ->
  if not anim.init()
    initGUI(anim.gui, anim.mesh.scale)
    anim.animate()
  else
    console.log 'init failed'
    
initGUI = (gui, scale) ->
  
  gui.add(scale, 'x').min(0.1).max(10).step(0.1).listen().onChange ->
    updatemesh.send scale, (success) ->
      if not success
        console.log 'message could not be sent'
        
  gui.add(scale, 'y').min(0.1).max(10).step(0.1).listen().onChange ->
    updatemesh.send scale, (success) ->
      if not success
        console.log 'message could not be sent'
  
  gui.add(scale, 'z').min(0.1).max(10).step(0.1).listen().onChange ->
    updatemesh.send scale, (success) ->
      if not success
        console.log 'message could not be sent'