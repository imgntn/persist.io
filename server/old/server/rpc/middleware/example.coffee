# Example middleware

# Only let a request through if the session has been authenticated
exports.authenticated = ->
  (req, res, next) ->
    if req.session && req.session.userId?
      #console.log req.session.userId
      #console.log "logged in"
      next()
    else
      console.log "not logged in"
      res(false)
