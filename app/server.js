// References.
var http = require('http'),
    lightnode = require('.lib//lightnode'),
    c = require('../config'),
    routes = require('./lib/routes'),
    file = require('./lib/util.file'),
    jsonRoutes = require('./lib/json.routes');

// Set a global obj for cross controll reference.
// Just to keep faithful to the DOM :).
window = {};
window.userSession = {};

// Create server.
var server = new http.Server();
server.listen(c.config.portNumber);

// Website static server.
var website = new lightnode.FileServer(c.config.staticContentPath);

// Request.
website.delegateRequest = function(req, resp) {
	
	// Make non-case-sensitive.
	var url = req.url.toLowerCase();
	
  if (url.indexOf('/content') === 0){
  	return website;
  } else if (url.indexOf('/admin') === 0){
  	return website;
  } else if (url.indexOf('/upload') === 0){
  	return file.upload(req, resp);
  } else if (url.indexOf('/json') === 0){
		return jsonRoutes.get(req, resp);
	} else {
		return routes.get(req, resp);
	}
};

// When a request comes to the ip server.
server.addListener('request', function(req, resp) {
	website.receiveRequest(req, resp);
});

console.log('http://localhost:' + c.config.portNumber + '/');