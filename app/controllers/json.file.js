// Lib.
var c = require('../../config'),
		fs = require('fs'),
		a = require('../lib/util.array');
		
// HTTP content getter.
exports.get = function(obj, callBack){
		
	if(obj.action === 'list'){
		fs.readdir(c.config.appPath + '/content/files', function(err, data){
			callBack(data);
		});
	} else if(obj.action === 'delete'){
	
		var name = obj.params.name;
	
		fs.unlink(c.config.appPath + '/content/files/' + name, function(err, data){
		
			if(err){
				console.log(err);
				callBack(data);
			} else {
				callBack(data);
			}
		});
	} else {
		callBack({foo: 'page'});
	}
};