var request = require('request');

var SC = function(client_id) {
  if(!(this instanceof SC)) return new SC(client_id);
  var self = this;
  var base_url = 'http://api.soundcloud.com';
  
  this.resolve = function(link,callback) {
    var url = base_url + '/resolve.json' + '?url=' + link + '&client_id=' + client_id;
    request(url, function(error, response, body) {
      callback(JSON.parse(body));
    });
  };
  
};

module.exports = SC;
