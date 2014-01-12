var events = require('events'),
  express = require('express'),
  hbars = require('./hbars.js'),
  util = require('util'),
  db = require('./db.js');

var Web = function(config, rootDir) {
  if(!(this instanceof Web)) return new Web(config, rootDir);
  var self = this;
  
  var app = express(),
    hbs = new hbars(rootDir, config),
    SC = require('./sc.js')(config.web.sc_client_id);

  app.engine('handlebars', hbs.hbs.engine);

  app.configure(function() {
    app.set('views', rootDir + '/web/views');
    app.set('view engine', 'handlebars');
    //app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded())
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'roygbiv' }));
    app.use(app.router);
    app.use(express.static(rootDir + config.web.folders.static));
  });
  
  app.get('/', function (req, res) {
    db.query({
      sql: 'Select * from artists order by artist;',
      inserts: []
    }, function(err, dbRes) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      res.render('index', {
        sc_client_id: config.web.sc_client_id,
        artists: dbRes
      });      
    });
  }); 
  
  app.get('/test', function (req, res) {
    res.render('test', {
      sc_client_id: config.web.sc_client_id
    });
  }); 

  app.post('/AddLink', function(req, res) {
    if (typeof req.body.link !== 'undefined' && typeof req.body.artistId !== 'undefined') {
      SC.resolve(req.body.link, function(obj) {
        db.query({
          sql: 'Insert into tracks(artistId,title,url,raw) Values (?,?,?,?);',
          inserts: [req.body.artistId,obj.title,obj.stream_url,JSON.stringify(obj)]
        }, function(err, dbRes) {
          if (err) {
            console.log(err);
          }
          res.end();
        });
      });
    }
  });

  this.startServer = function() {
    db.connect(config, 'WEB', function webDB() {
      app.listen(config.web.port, function webStarted() {
        console.log('Created web server');
      });
    });
  };
  
};

util.inherits(Web, events.EventEmitter);

module.exports = Web;
