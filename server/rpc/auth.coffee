# Server-side Authentication Code

redis = require 'redis'
uuid = require 'node-uuid'

exports.actions = (req, res, ss) ->
  
  req.use 'session'
  req.use 'debug', 'cyan'
  
  # publish to everyone the new cube
  broadCastUserCube = (data) ->
    req.session.setUserId data.name
    
    console.log "broadcasting '#{ data.name }' cube"
    ss.publish.all 'initCube', data         # then send cube
    
  # get a list of all cubes from redis
  getUsersOnline = (cb) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    client.keys "user:*", (err, keys) ->
      client.mget keys, (err, values) ->
        client.quit()
        cb values.map (user) -> JSON.parse user
      
  # publish users cube to everyone and
  # publish everyones cubes to user
  publishUser = (cube) ->
    broadCastUserCube cube
    getUsersOnline (cubes) ->
      for onlineCube in cubes
        console.log "publishing '#{ onlineCube.name }' cube"
        ss.publish.user cube.name, 'initCube', onlineCube
        
  # check to see if user is logged in
  init: ->    
    if req.session.userId?
      client = redis.createClient 6379, "50.18.154.76"
      client.select 1
      
      # check database for user:userId key
      key = "user:#{ req.session.userId }"
      client.get key, (err, data) ->
        client.quit()
        # user is logged in
        if data
          cube = JSON.parse data
          res cube # respond first
          publishUser cube
        # no cube in database
        else
          res false
          
    # no userId in session
    else
      res false
        
  # sign a user in
  signIn: (username) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    
    # check for user in database
    client.get "user:#{ username }", (err, data) ->
      # user already exists
      # return with error
      if data
        res 
          error: true
          error_msg: "Username already in use"
      else
        cube =
          x: 0
          y: 0
          z: 0
          name: username     # store username
          id: uuid.v4()      # generate UUID using random numbers
        
        # add user to database
        key = "user:#{ username }"
        client.set key, JSON.stringify(cube), (err, data) ->
          # expire user data in database after 2 minutes of inactivity
          client.expire key, 300
          client.quit()
          
          if data
            res cube
            publishUser cube
            
  logout: ->
    console.log 'logged out'
          
  
  
    