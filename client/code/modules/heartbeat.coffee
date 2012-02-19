

exports.start = ->
  heartBeat()
  setInterval "heartBeat()", exports.BEAT_INTERVAL
  
window.heartBeat = ->
  ss.rpc 'core.heartBeat', (cubes) ->
