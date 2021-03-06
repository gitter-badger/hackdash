
/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express)
  , http = require('http')
  , path = require('path')
  , clientVersion = require('./client/package.json').version;

var app = exports.app = express();

var sessionMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days;
var staticsMaxAge = 365 * 24 * 60 * 60 * 1000; // 1 Year;

var config;

// Set Config
switch(app.get('env')) {
  case "development":
  case "production":
    config = require('./config.json');
    break;
  case "test":
    config = require('./config.test.json');
    break;
}

/*
 * DB
 */

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

/*
 * Application config
 */

app.configure(function(){
  app.set('config', config);
  app.set('clientVersion', clientVersion);
  app.set('port', process.env.PORT || app.get('config').port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')(path.join(__dirname, 'public')));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.limit('3.5mb'));
  app.use(express.methodOverride());

  var prCfg = app.get('config').prerender;
  if (prCfg && prCfg.enabled){
    app.use(require('./seo')(app));
  }

  app.use(express.cookieParser(app.get('config').session));
  app.use(express.session({
      secret: app.get('config').session
    , store: new MongoStore({db: app.get('config').db.name, url: app.get('config').db.url})
    , cookie: { maxAge: sessionMaxAge, path: '/', domain: '.' + app.get('config').host }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(__dirname + '/public', { maxAge: staticsMaxAge }));

  app.use(function(req, res) {
    res.status(404);
    res.render('404');
  });

  app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500);
    res.render('500');
  });

  app.set('statuses', require('./models/statuses'));

	app.locals.title = config.title;
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Models
 */

require('./models')();

/*
 * Auth
 */

require('./auth')(app);

/*
 * Routes
 */

require('./routes')(app);

/*
 * Mailer
 */

if(app.get('config').mailer) {
	require('./mailer')(app);
}

var server = module.exports = http.Server(app);

/*
 * Live dashboard
 */

if(config.live) {
	require('./live')(app, server);
}

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err){
  console.log(err);
});
