const http = require('http');
const lightnode = require('./lib/lightnode');
const c = require('../config');
const routes = require('./lib/routes');
const file = require('./lib/util.file');
const jsonRoutes = require('./lib/json.routes');

// Set a global obj for cross controll reference.
// Just to keep faithful to the DOM :).
window = {};
window.userSession = {};

const server = new http.Server();
server.listen(c.config.portNumber);

const website = new lightnode.FileServer(c.config.staticContentPath);

website.delegateRequest = function(req, res) {
	const url = req.url.toLowerCase();
	
  if (url.indexOf('/content') === 0){
  	return website;
  } else if (url.indexOf('/admin') === 0){
  	return website;
  } else if (url.indexOf('/upload') === 0){
  	return file.upload(req, res);
  } else if (url.indexOf('/json') === 0){
		return jsonRoutes.get(req, res);
	} else {
		return routes.get(req, res);
	}
};

server.addListener('request', function(req, res) {
	website.receiveRequest(req, res);
});

console.log('http://localhost:' + c.config.portNumber + '/');