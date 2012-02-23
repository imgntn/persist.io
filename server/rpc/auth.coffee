# Server-side Authentication Code

redis = require 'redis'
uuid = require 'node-uuid'
util = require 'util'
user = require './user'

client = redis.createClient 6379, "50.18.154.76"
client.on "error", (err) -> console.log "Error #{ err }"

client.select 1

exports.actions = (req, res, ss) ->
  
  req.use 'session'
  # req.use 'debug', 'cyan'
  
  # publish to everyone the new cube
  broadCastUserCube = (data) ->
    # associate user name with session
    req.session.setUserId data.name
    
    #publish cube to everyone
    ss.publish.all 'initCube', data
      
  # publish users cube to everyone and
  # publish everyones cubes to user
  publishUser = (cube) ->
    broadCastUserCube cube
    
    user.getOnline client, (cubes) ->
      #console.log "online cubes:\n", cubes
      for onlineCube in cubes
        ss.publish.user cube.name, 'initCube', onlineCube
        
  # check to see if user is logged in
  init: ->    
    
    # check for session
    if req.session.userId?
    
      key = "user:#{ req.session.userId }"
      
      # check for data
      client.get key, (err, data) ->
        
        # respond with data
        if data
          cube = JSON.parse data
          res cube # respond first
          publishUser cube
          
        # respond with false
        else
          res false
          
    # no userId in session
    else
      res false
        
  # sign a user in
  signIn: (username) ->
    key = "user:#{ username }"
    
    console.log "key:", key
    client.keys "*", redis.print
    
    # check database
    client.get key, (err, data) ->
    
      cube = JSON.parse data
      
      # return their cube
      if cube and cube.name
      
        console.log "found old cube"
        res cube
        publishUser cube
        
      # make them a new cube
      else        
        console.log "let's build them a cube"
        # make the cube
        cube =
          x: 0
          y: 0
          z: 0
          name: username
          id: uuid.v4()      # generate UUID using random numbers
        
        # add user to database
        val = JSON.stringify cube
        client.set key, val, (err, data) ->
          
          # respond with cube
          if data
            res cube
            publishUser cube
          
  
  
    