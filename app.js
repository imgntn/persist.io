// My SocketStream app

var http      = require('http'),
    ss        = require('socketstream'),
    everyauth = require('everyauth'),
    util      = require('util'),
    redis     = require('redis'),
    bcrypt    = require('bcrypt'),
    
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


everyauth.password
    //.loginWith('/email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .authenticate(function(login, password) {
        var promise = this.Promise();
        var errors = [];
        if (!login) errors.push('Missing login');
        if (!password) errors.push('Missing password');
        if (errors.length) promise.fulfill(errors);
        
        client.get("user:" + login, function(err, data) {
            if (err) {
                console.log("Error getting user data", err);
                promise.fulfill([err]);
                return;
            }
            
            user = JSON.parse(data);
            
            if (bcrypt.compareSync(password, user.password)) {
                console.log("User exists:", util.inspect(user));
                promise.fulfill(user);
            } else {
                err = "Password does not match";
                console.log(err);
                promise.fulfill([err]);
            }
        });
            
        
        return promise;
    })
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .validateRegistration(function(newUserAttrs) {
        var login = newUserAttrs.login;
        var promise = this.Promise();
        
        client.get("user:" + login, function(err, data) {
            if (err) {
                console.log("Error getting user data during validation", err);
                promise.fulfill([err]);
                return;
            }
            
            if (data) {
                console.log("User already exists");
                promise.fulfill(["User already exists"]);
            }
        });
        
        return promise;
    })
    .registerUser(function(newUserAttrs) {
        var promise = this.Promise();
        var login = newUserAttrs.login;
        var password = newUserAttrs.password;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        
        var user = {
            username: login,
            password: hash
        };
        
        var data = JSON.stringify(user);
        
        client.set("user:" + login, data, function(err, data) {
            if (err) {
                return promise.fulfill([err]);
            }
            promise.fulfill(user);
        });
        
        return promise;
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');
        

everyauth.twitter
  .consumerKey('7i1XvDQqFSaQrMcjGcQPAg')
  .consumerSecret('zQ14upSmunxpZpkaoPt3vT0yoKBB2HhmMuAG4pCqto')
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {  
    var user, username, promise, twitterData, twitterId;
    
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
            promise.fulfill([err]);
            return;
        }
        
        if (!data || !is_empty(data)) {
            // Twitter data exists
            console.log("Twitter exists:", util.inspect(data));
            
            // Get user data associated with twitter account
            client.get("user:" + data.username, function(err, data) {
                if (err) {
                    console.log("Error accessing redis user data using twitter values", err);
                    promise.fulfill([err]);
                    return;
                }
                
                if (!data) {
                    err = "ERROR: Twitter data exists but user data does not";
                    console.log(err);
                    promise.fulfill([err]);
                    return;
                }
                
                user = JSON.parse(data);
                
                console.log("User exists:", util.inspect(user));
                promise.fulfill(user);
            });
        } else {
            promise.fulfill(["User doesn't exist"]);
            /*
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
            */
        }
    });
    
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
