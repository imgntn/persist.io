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
    req.session.setUserId data.name
    
    ss.publish.all 'initCube', data         # then send cube
    
  # get a list of all cubes from redis
  getUsersOnline = (cb) ->
    # get all of the kesy
    client.keys "user:*", (err, keys) ->
      
      # check if there are kesy
      if keys.length > 0
      
        # create a batch call
        multi = client.multi()
        
        # add each cube get to multi call
        for key in keys
          multi.hgetall key
          
        # exec multi
        multi.exec (err, replies) ->
          console.log "all cubes:\n", replies 
          result = []
          
          # check lastBeat
          for cube in replies
            now = new Date()
            time = now.getTime()
            elapsed = time - cube.lastBeat
            console.log "elapsed:", elapsed
            if elapsed <= 60000
              result.push cube
              
          # return list of cubes
          cb result
      else
        cb []
    ###
    client.keys "user:*", (err, keys) ->
      client.mget keys, (err, values) ->
        cb values.map (user) -> JSON.parse user
    ###
      
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
    if req.session.userId?
      console.log 'has userId'
      # check database for user:userId key
      key = "user:#{ req.session.userId }"
      client.hgetall key, (err, cube) ->
        # user is logged in
        if cube
          console.log '\thas user data'
          res cube # respond first
          publishUser cube
        # no cube in database
        else
          console.log '\tdoes not have user data'
          res false
          
    # no userId in session
    else
      console.log 'does not have userId'
      res false
        
  # sign a user in
  signIn: (username) ->
    # check for user in database
    key = "user:#{ username }"
    client.hgetall key, (err, data) ->
      if err
        console.log "sign in error", err
      # return their cube
      if data and data.username
        res data
        publishUser data
        ###
        res 
          error: true
          error_msg: "Username already in use"
        ###
        
      # make them a new cube
      else
        now = new Date()
        cube =
          x: 0
          y: 0
          z: 0
          name: username     # store username
          id: uuid.v4()      # generate UUID using random numbers
          lastBeat: now.getTime()
        
        # add user to database
        client.hmset key, cube, (err, data) ->
          # expire user data in database after 2 minutes of inactivity
          #client.expire key, 300
          
          if data
            res cube
            publishUser cube
          
  
  
    