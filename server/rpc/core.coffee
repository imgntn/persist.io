# Server-side Code
redis = require "redis"
user = require "./user"

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
    # username
    username = req.session.userId
    
    # key
    onlineKey = "online:#{ username }"
    
    # set key online:user equal to user
    client.setex onlineKey, 20, "#{ username }"
    
    # get online users and return them to client
    user.getOnline client, (cubes) ->
      # console.log cubes
      res cubes
      
  logout: (username) ->
    # send message to all clients to logout specific user
    ss.publish.all 'logout', username