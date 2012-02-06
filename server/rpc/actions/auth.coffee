# Server-side Authentication Code

redis = require "redis"

exports.before = (m) ->
  [m.loadSession()]

exports.actions = (req, res, ss) ->
  
  init: ->    
    if req.session.userId?
      client = redis.createClient 6379, "50.18.154.76"
      client.select 1
      client.get "user:#{ req.session.userId }", (err, data) ->
        if data
          res data
        else
          res false
        client.quit()
    else
      res false
        
  signIn: (username) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    client.get "user:#{ username }", (err, data) =>
      if data
        console.log "already logged in"
        res 
          error: true
          error_msg: "Username already in use"
      else
        console.log "not logged in"
        cube =
          x: 0
          y: 0
          z: 0
        
        client.set "user:#{ username }", JSON.stringify(cube), (err, data) =>
          client.expire "user:#{ username }", 300
          if data
            # TODO: publish all cubes
            console.log 
            req.session.setUserId username
            res cube
            ss.publish.user username, 'initCube', cube
          client.quit()
    