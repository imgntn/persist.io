// My SocketStream app

var http = require('http')
  , ss = require('socketstream');

ss.client.define('main', {
  view: 'app.jade',
  css:  ['libs', 'app.styl'],
  code: ['libs', 'modules', 'main']
});

ss.http.router.on('/', function(req, res) {
  res.serve('main');
});

// Remove to use only plain .js, .html and .css files if you prefer
ss.client.formatters.add(require('ss-coffee'));
ss.client.formatters.add(require('ss-jade'));
ss.client.formatters.add(require('ss-stylus'));

// redis 
ss.session.store.use('redis', {host: '50.18.154.76', port: 6379});
ss.publish.transport.use('redis', {host: '50.18.154.76', port: 6379});

// Use server-side compiled Hogan (Mustache) templates. Others engines available
//ss.client.templateEngine.use(require('ss-hogan'));

// Minimise and pack assets if you type  SS_ENV=production node app.js
if (ss.env == 'production') ss.client.packAssets();

var server = http.Server(ss.http.middleware);

var args = process.argv.splice(2);

if (args[0] == 'cloud9') {
    server.listen(process.env.C9_PORT, "0.0.0.0");
} else {
    server.listen(80);
}

ss.start(server);