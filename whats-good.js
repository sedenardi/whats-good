var fs = require('fs')
  Web = require('./my_modules/web.js');

var configFile = './config.json';

var configData = fs.readFileSync(configFile),
  config;

try {
  config = JSON.parse(configData);
} catch (e) {
  console.log('Error parsing config.json, proper operation is highly unlikely');
  console.log(e);
}

var web = new Web(config, __dirname);

web.startServer();