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
    var user, newData, promise;
    
    promise = this.Promise();
    
    // Check for preexisting suer
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
