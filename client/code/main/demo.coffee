anim = require 'anim'
updatemesh = require 'updatemesh'

gScale = null
reset = false

ss.event.on 'newScale', (scale) ->
  if not gScale?
    anim.mesh.scale.x = scale.x
    anim.mesh.scale.y = scale.y
    anim.mesh.scale.z = scale.z
  else if reset
    reset = false
    gScale = null

SocketStream.event.on 'ready', ->
  if not anim.init()
    initGUI(anim.gui, anim.mesh.scale)
    anim.animate()
  else
    console.log 'init failed'
    
initGUI = (gui, scale) ->
  updateScale = ->
    gScale = scale
    updatemesh.send scale, (success) ->
      if not success
        gScale = null
        console.log 'message could not be sent'
  
  gui.add(scale, 'x').min(0.1).max(10).step(0.1).listen().onChange(updateScale).onFinishChange ->
    reset = true
        
  gui.add(scale, 'y').min(0.1).max(10).step(0.1).listen().onChange(updateScale).onFinishChange ->
    reset = true
  
  gui.add(scale, 'z').min(0.1).max(10).step(0.1).listen().onChange(updateScale).onFinishChange ->
    reset = true
        
