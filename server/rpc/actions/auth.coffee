# Server-side Authentication Code

redis = require "redis"

exports.before = (m) ->
  [m.loadSession()]

exports.actions = (req, res, ss) ->
  
  init: ->    
    if req.session.userId?
      client = redis.createClient 6379, "50.18.154.76"
      client.get "ss:session:#{ req.session._store.id }", (err, data) ->
        if data
          res data
        else
          res false
        client.quit()
    else
      res false
        
  signIn: (username) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.get "ss:session:#{ username }", (err, data) =>
      if data
        res 
          error: true
          errror_msg: "Username already in use"
      else
        
        # TODO: make geometry
        cube =
          x: 0
          y: 0
          z: 0
        
        client.set "ss:session:#{ username }", JSON.stringify(cube), (err, data) =>
          client.expire "ss:session:#{ username }", 300
          if data
            false
            # TODO: publish all cubes
          client.quit()
    