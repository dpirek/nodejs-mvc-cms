var fs = require('fs'),
		c = require('../../config'),
		querystring = require('querystring');

// Router.
exports.get = function(req, resp){
	
	// TODO: implement security layer.
	// (skip comment posting).
	
	// To Get a Cookie.
	var cookies = {};
	req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
	  var parts = cookie.split('=');
	  cookies[parts[0].trim()] = (parts[1] || '').trim();
	});
	
	var url = req.url.toLowerCase(),
			arr = url.split('/'),
			controller = 'json.page',
			action = 'index',
			p1 = '1',
			p2 = '10',
			p3 = '';
	
	try{

		if(arr[2]){
			controller = arr[2];
		}
		
		if(arr[3]){
			action = arr[3];
		}
		
		if(arr[4]){
			p1 = arr[4];
		}
		
		if(arr[5]){
			p2 = arr[5];
		}
		
		if(arr[6]){
			p3 = arr[6];
		}

		// Load controller.
		var ctrl = require('../controllers/json.' + controller);
		
		if(req.method === 'POST'){
			
			var _REQUEST = {},
					_CONTENT = '';
			
			req.addListener('data', function(chunk) {
				_CONTENT += chunk;
			});
			
			req.addListener('end', function() {
				_REQUEST = querystring.parse(_CONTENT);
				//callback(_REQUEST);
				
				// Load controller.
				ctrl.get({
						controller: controller,
						action: action,
						cookies: cookies,
						params: _REQUEST
					},
					function(data, cookie, isSucessful, message){
						
						var headers = {};
						
						// Set cookie if suplied.
						if(cookie){
							// Set headers.
							headers = {
								'content-type': 'text/html',
								'Location': '/',
								'Set-Cookie': cookie.key + '=' + cookie.value,
							};
						} else {
							
							// Set headers.
							headers = {
								'content-type': 'text/html'
							};
						}
						
						// Set defaults.
						if(typeof isSucessful === 'undefined'){
							isSucessful = true;
						}
						
						if(typeof message === 'undefined'){
							message = '';
						}
						
						resp.writeHead(200, headers);
						resp.write(JSON.stringify({
							isSucessful: isSucessful,
							message: message,
							data: data
						}));
						resp.end();
				});
			});
		} else {
			
			// Load controller.
			ctrl.get({
					controller: controller,
					action: action,
					cookies: cookies,
					params: {
						p1: p1,
						p2: p2,
						p3: p3
					}
				},
				function(data, cookie, isSucessful, message){
					
					var headers = {};
					
					// Set cookie if suplied.
					if(cookie){
						
						// Set headers.
						headers = {
							'content-type': 'text/html',
							'Location': '/',
							'Set-Cookie': cookie.key + '=' + cookie.value,
						};
						
						//var Cookies = require("cookies");
						//var c = new Cookies(req, resp, {});
						
					} else {
						
						// Set headers.
						headers = {
							'content-type': 'text/html'
						};
					}
					
					// Set defaults.
					if(typeof isSucessful === 'undefined'){
						isSucessful = true;
					}
					
					if(typeof message === 'undefined'){
						message = '';
					}
					
					resp.writeHead(200, headers);
					resp.write(JSON.stringify({
						isSucessful: isSucessful,
						message: message,
						data: data
					}));
					resp.end();
			});
		}
	} catch(ex){
		
		// Error page.
		resp.writeHead(200, {'content-type': 'text/html'});
		resp.write(JSON.stringify({
			isSucessful: false,
			message: 'something went wrong: ' + ex,
			data: {}
		}));
		resp.end();	
	}
};