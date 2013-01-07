var fs = require('fs'),
		c = require('../../config');

// Router.
exports.get = function(req, resp){
	
	var url = req.url.toLowerCase(),
			arr = url.split('/'),
			controller = 'page',
			action = 'index',
			p1 = '',
			p2 = '',
			p3 = '',
			p4 = '';
	
	try{

		// Routing.
		if(arr[1] === 'blog'){
		
			var controller = 'blog';
	
			if(arr[2]){
				p1 = arr[2];
				action = 'detail';
			}
		// Default route.
		} else {

			if(arr[1]){
				p1 = arr[1];
			}
		}
		
		// Load controller.
		var ctrl = require('../controllers/' + controller);
		
		// Load view.
		fs.readFile(c.config.appPath + '/views/' + controller + '/' + action + '.html', function (err, template) {
			
			var view = '';
			
			if(template){
				view = template.toString();
			}
			
			// Load controller.
			ctrl.get({
					controller: controller,
					action: action,
					p1: p1,
					p2: p2,
					p3: p3,
					p4: p4
				},
				view,
				function(content){
					resp.writeHead(200, {'content-type': 'text/html'});
					resp.write(content);
					resp.end();
			});
		});
	} catch(ex){
		
		// Error page.
		resp.writeHead(200, {'content-type': 'text/html'});
		resp.write(ex);
		resp.end();	
	}
};