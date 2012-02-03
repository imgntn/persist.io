exports.send = (scale, cb) ->
  if scale?
    ss.rpc('demo.sendscale', scale, cb)
  else
    cb(false)