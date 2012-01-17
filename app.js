
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  
});

// Routes

app.get('/', function(req, res){
  res.render('index.jade', {
    title: 'bethere', url:''
  });
});


app.get('/about', function(req, res){
  res.render('about.jade', {
    title: 'about'
  });
});

app.get('/test', function(req, res){
  res.render('test.jade', {
    title: 'about'
  });
});


app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
