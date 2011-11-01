var fs = require('fs'),
		c = require('../../config');

// HTTP content getter.
exports.get = function(params, callBack){
	
	// Default value.
	if(params.params.p1 === '1'){
		params.params.p1 = 'page.index';
	}
	
	if(params.action === 'get'){
		
		fs.readFile(c.config.appPath + '/views/' + params.params.p1.replace('.', '/') + '.html', function (err, data) {
			callBack({content: data.toString()});
		});
	} else if(params.action === 'update'){
		
		fs.writeFile(c.config.appPath + '/views/' + params.params.page.replace('.', '/') + '.html', params.params.content, function (err) {
			callBack({});
		});
	} else {
		callBack({foo: 'temp'});
	}
};