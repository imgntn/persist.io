# Server-side Code
redis = require "redis"

# Example of pre-loading sessions into req.session using inbuilt middleware
# To use the 'example' custom middleware you'd append m.example.authenticated() to the array
exports.before = (m) ->
  [m.loadSession()]

# Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = (req, res, ss) ->

  init: ->
    
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    
    client.on "error", (err) ->
      console.log "Redis: #{ err }"
    
    if req.session
      if req.session.userId?
        console.log "already logged in"
        client.hgetall req.session.userId, (err, obj) ->
          res obj
      else    
        console.log "new user"
        obj =
          x: 0
          y: 0
          z: 0
        id =  Math.floor Math.random() * 5000
        client.hmset id, "x", 0, "y", 0, "z", 0
        req.session.userId = id
        res obj
        
    client.quit()

      
      
      
