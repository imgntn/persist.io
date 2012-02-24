// My SocketStream app

var http      = require('http'),
    ss        = require('socketstream'),
    everyauth = require('everyauth'),
    util      = require('util'),
    redis     = require('redis'),
    
    client    = redis.createClient(6379, "50.18.154.76");
    
client.select(1);

ss.client.define('main', {
  view: 'app.jade',
  css:  ['libs', 'app.styl'],
  code: ['libs', 'modules', 'main']
});

ss.http.router.on('/', function(req, res) {
  res.serve('main');
});

everyauth.twitter
  .consumerKey('7i1XvDQqFSaQrMcjGcQPAg')
  .consumerSecret('zQ14upSmunxpZpkaoPt3vT0yoKBB2HhmMuAG4pCqto')
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {  
    var user, username, promise, twitterData, twitterId;
    
    console.log(util.inspect(twitterUserMetadata));
    
    var is_empty = function(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        
        return true
    };
    
    promise = this.Promise();
    
    client.hgetall("twitter:" + twitterUserMetadata.id_str, function(err, data) {
        if (err) {
            console.log("Error accessing twitter redis data", err);
            promise.fail(err);
            return;
        }
        
        if (!data || !is_empty(data)) {
            // Twitter data exists
            console.log("Twitter exists:", util.inspect(data));
            
            // Get user data associated with twitter account
            client.get("user:" + data.username, function(err, data) {
                if (err) {
                    console.log("Error accessing redis user data using twitter values", err);
                    promise.fail(err);
                    return;
                }
                
                if (!data) {
                    err = "ERROR: Twitter data exists but user data does not";
                    console.log(err);
                    promise.fail(err);
                    return;
                }
                
                user = JSON.parse(data);
                
                console.log("User exists:", util.inspect(user));
                promise.fulfill(user);
            });
        } else {
            // Twitter data does not exist
            
            // TODO: create new user (need a way to get a username)
            username = twitterUserMetadata.screen_name;
            twitterId = twitterUserMetadata.id;
            
            user = {
                username: username,
                twitterId: twitterId
            };
            
            data = JSON.stringify(user);
            
            client.set("user:" + username, data, function(err, data) {
                if (err) {
                    console.log("Error creating new user data", err);
                    promise.fail(err);
                    return;
                }
                
                console.log("User created:", util.inspect(user));
                
                // TODO: create new twitter data that points to new username
                twitterData = {
                    accessToken: accessToken,
                    accessTokenSecret: accessTokenSecret,
                    username: username,
                    id: twitterId
                };
                
                client.hmset("twitter:" + twitterId, twitterData, function(err, data) {
                    if (err) {
                        console.log("Error creating new twitter data", err);
                        promise.fail(err);
                        return;
                    }
                    
                    console.log("Twitter data created:", util.inspect(twitterData));
                    
                    promise.fulfill(user);
                });
            });
        }
    });
    
    return promise;
                    
                    
    
    // Check for preexisting suer
    /*
    client.get(twitterUserMetadata.id_str, function(err, data) {
      if (err) {
        console.log("Error accessing redis with username", err);
        promise.fail(err);
        return;
      } 
      
      // User already exists
      if (data) {
        user = JSON.parse(data);
        console.log("User exists:", util.inspect(user));
        promise.fulfill(user);
        return;
      } else {
        // User doesn't exist so we need to make a new one
        user = {
          accessToken: accessToken,
          accessTokenSecret: accessTokenSecret,
          name: twitterUserMetadata.name,
          twitterId: twitterUserMetadata.id
        };
        
        newData = JSON.stringify(user);
        
        client.set(twitterUserMetadata.id_str, newData, function(err, data) {
          if (err) {
            console.log("Error setting twitter user data in redis", err);
            promise.fail(err);
            return;
          }
          
          console.log("User created:", util.inspect(user));
          promise.fulfill(user);
        });
      }
    });
    */
    
    return promise;
  })
  .redirectPath('/');

// Remove to use only plain .js, .html and .css files if you prefer
ss.client.formatters.add(require('ss-coffee'));
ss.client.formatters.add(require('ss-jade'));
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// redis 
ss.session.store.use('redis', {host: '50.18.154.76', port: 6379});
ss.publish.transport.use('redis', {host: '50.18.154.76', port: 6379});

// Minimise and pack assets if you type  SS_ENV=production node app.js
if (ss.env == 'production') ss.client.packAssets();

// Enable optional console server access. Run 'ss-client' to connect
var consoleServer = require('ss-console').init(ss);
consoleServer.listen(5000);

ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.append(everyauth.middleware());

var server = http.Server(ss.http.middleware);

var args = process.argv.splice(2);

if (args[0] == 'cloud9') {
    server.listen(process.env.C9_PORT, "0.0.0.0");
} else {
    server.listen(80);
}

ss.start(server);
