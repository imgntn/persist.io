# Server-side Authentication Code

redis = require 'redis'
uuid = require 'node-uuid'

client = redis.createClient 6379, "50.18.154.76"
client.select 1

exports.actions = (req, res, ss) ->
  
  req.use 'session'
  #req.use 'debug', 'cyan'
  
  # publish to everyone the new cube
  broadCastUserCube = (data) ->
    # associate user name with session
    req.session.setUserId data.name
    
    #publish cube to everyone
    ss.publish.all 'initCube', data
    
  # get a list of all cubes from redis
  getUsersOnline = (cb) ->
    
    # get all keys
    client.keys "user:*", (err, keys) ->
      
      # get values associated with keys
      client.mget keys, (err, values) ->
        
        # parse all of the cubes
        cubes = values.map (json) -> JSON.parse json
        
        result = []
        
        # get current time
        now = new Date()
        time = now.getTime()
        
        # add cubes to result only if still alive
        for cube in cubes
          elapsed = time - cube.lastBeat
          
          if elapsed <= 60000
            result.push cube
        
        cb result
      
  # publish users cube to everyone and
  # publish everyones cubes to user
  publishUser = (cube) ->
    broadCastUserCube cube
    getUsersOnline (cubes) ->
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
    
    # check database
    client.get key, (err, data) ->
      if err
        console.log "sign in error", err
        
      # return their cube
      if data and data.username
        cube = JSON.parse data
        res cube
        publishUser cube
        
      # make them a new cube
      else
        
        # get current time
        now = new Date()
        time = now.getTime()
        
        # make the cube
        cube =
          x: 0
          y: 0
          z: 0
          name: username
          id: uuid.v4()      # generate UUID using random numbers
          lastBeat: time
        
        # add user to database
        val = JSON.stringify cube
        client.set key, val, (err, data) ->
          
          # respond with cube
          if data
            res cube
            publishUser cube
          
  
  
    