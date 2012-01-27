// My SocketStream app

var http = require('http')
  , ss = require('socketstream');

ss.client.define('main', {
  view:   'app.jade',
  css:    ['libs', 'app.styl'],
  code:   ['libs/jquery.min.js', 'modules', 'main']
});

ss.http.router.on('/', function(req, res) {
  res.serve('main');
});

// Remove to use only plain .js, .html and .css files if you prefer
ss.client.formatters.add(require('ss-coffee'));
ss.client.formatters.add(require('ss-jade'));
ss.client.formatters.add(require('ss-stylus'));

// Minimise and pack assets if you type SS_ENV=production node app
if (ss.env == 'production') ss.client.packAssets();

var server = http.Server(ss.http.middleware);

var arguments = process.argv.splice(2);

if (arguments[0] == 'cloud9') {
    server.listen(process.env.C9_PORT, "0.0.0.0");
} else {
    server.listen(80);
}

ss.start(server);
