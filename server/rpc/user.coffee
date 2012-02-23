# get a list of all cubes from redis
exports.getOnline = (client, cb) ->
  # get all keys
  client.keys "online:*", (err, keys) ->
    
    # get online user names
    client.mget keys, (err, onlineUsers) ->
    
      if onlineUsers
        # convert to user:name format
        # users = onlineUsers.map (name) -> "user:#{ name }"
        users = ("user:#{ name }" for name in onlineUsers)
          
        
        # get cubes associated with users
        client.mget users, (err, values) ->
        
          # parse all of the cubes
          # cubes = values.map (json) -> JSON.parse json
          cubes = (JSON.parse json for json in values)
            
          
          # callback with list of online cubes
          cb cubes