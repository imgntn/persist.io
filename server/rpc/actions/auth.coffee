# Server-side Authentication Code

redis = require 'redis'
uuid = require 'node-uuid'

exports.before = (m) ->
  [m.loadSession()]

exports.actions = (req, res, ss) ->
  
  # check to see if user is logged in
  init: ->    
    if req.session.userId?
      client = redis.createClient 6379, "50.18.154.76"
      client.select 1
      
      # check database for user:userId
      client.get "user:#{ req.session.userId }", (err, data) ->
        # user is logged in
        if data
          res data
          
        # user is not logged in
        else
          res false
        client.quit()
        
    # user is not logged in
    else
      res false
        
  # sign a user in
  signIn: (username) ->
    client = redis.createClient 6379, "50.18.154.76"
    client.select 1
    
    # check for user in database
    client.get "user:#{ username }", (err, data) =>
      # user already exists
      # return with error
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
          name: username     # store username
          id: uuid.v4()      # generate UUID using random numbers
        
        # add user to database
        client.set "user:#{ username }", JSON.stringify(cube), (err, data) =>
          # expire user data in database after 10 minutes of inactivity
          client.expire "user:#{ username }", 300
          if data
            
            # store userId in session
            req.session.setUserId username
            
            res data
            
            # push clients cube and all other cubes to client
            # TODO: publish all cubes
            ss.publish.user username, 'initCube', data
            
          client.quit()
    