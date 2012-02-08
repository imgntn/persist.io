# Server-side Authentication Code

redis = require 'redis'
uuid = require 'node-uuid'

exports.before = (m) ->
  [m.loadSession()]

exports.actions = (req, res, ss) ->
  ###
  console.log 'this just happened'
  client = redis.createClient 6379, "50.18.154.76"
  client.select 0
  client.keys "*", (err, replies) ->
    replies.forEach (reply, i) ->
      console.log "reply: " + reply
      client.get reply, redis.print
    client.quit()
  ###
  
  broadCastUserCube = (data) ->
    req.session.setUserId data.name
    
    res data                                # must respond first (with the cube) so the scene is created
    
    console.log "broadcasting '#{ data.name }' cube"
    ss.publish.all 'initCube', data         # then send cube
    
  getUsersOnline = (cb) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    client.keys "user:*", (err, keys) ->
      client.mget keys, (err, values) ->
        client.quit()
        cb values.map (user) -> JSON.parse user
        
    
  
  # check to see if user is logged in
  init: ->    
    if req.session.userId?
      client = redis.createClient 6379, "50.18.154.76"
      client.select 1
      
      # check database for user:userId key
      client.get "user:#{ req.session.userId }", (err, data) =>
        # user is logged in
        if data
          cube = JSON.parse data
          broadCastUserCube cube
        # no cube in database
        else
          res false
        client.quit()
        
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
        client.set "user:#{ username }", JSON.stringify(cube), (err, data) ->
          # expire user data in database after 2 minutes of inactivity
          client.expire "user:#{ username }", 120
          client.quit()
          
          if data
            # store userId in session
            broadCastUserCube cube, true
            getUsersOnline (cubes) =>
              for onlineCube in cubes
                console.log "publishing '#{ onlineCube.name }' cube"
                ss.publish.all 'initCube', onlineCube
            
            ###
            client.select 0
            client.keys "*", (err, replies) ->
              replies.forEach (reply, i) ->
                console.log "reply: " + reply
                client.get reply, redis.print
              client.quit()
            ###
            # TODO: send other cubes to user
  logout: ->
    console.log 'logged out'
          
  
  
    