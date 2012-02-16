exports.BEAT_INTERVAL = 60000 # one minute
exports.BEAT_BUFFER = 300000

exports.start = ->
  heartBeat()
  setInterval "heartBeat()", exports.BEAT_INTERVAL
  
window.heartBeat = ->
  ss.rpc 'core.heartBeat', ->
