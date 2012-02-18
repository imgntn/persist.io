# Server-side Code
redis = require "redis"

# Example of pre-loading sessions into req.session using inbuilt middleware
# To use the 'example' custom middleware you'd append m.example.authenticated() to the array

client = redis.createClient 6379, "50.18.154.76"
client.select 1

# Define actions which can be called from the client using ss.rpc('demo.ACTIONNAME', param1, param2...)
exports.actions = (req, res, ss) ->
  
  req.use 'session'
  req.use 'example.authenticated'
  
  updateCube: (cube) ->
    
    # client.keys "user:*", redis.print
    
    # update cube in redis
    key = "user:#{ cube.name }"
    val = JSON.stringify cube
    client.set key, val
      
    # publish cube to all users
    ss.publish.all 'updateCube', cube
  
  heartBeat: ->
    key = "online:#{ req.session.userId }"
    client.expire key, 30000
    
    getUsersOnline (cubes) ->
      #console.log "online cubes:\n", cubes
      res cubes
    
    ###
    # get old cube data
    client.get key, (err, data) ->
      console.log err if err
      
      # get new time
      now = new Date()
      time = now.getTime()
      
      # parse data
      cube = JSON.parse data
      
      # update time
      cube.lastBeat = time
      
      # re-stringify
      val = JSON.stringify cube
      
      # resubmit to database
      client.set key, val
    ###
      