exports.BEAT_INTERVAL = 30000 # 30 seconds
exports.ACTIVE_TIMEOUT = 60000 # 60 seconds

exports.start = ->
  heartBeat()
  setInterval "heartBeat()", exports.BEAT_INTERVAL
  
window.heartBeat = ->
  ss.rpc 'core.heartBeat', (cubes) ->
