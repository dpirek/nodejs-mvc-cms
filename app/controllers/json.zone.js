// Lib.
var tmpl = require('jqtpl'),
		ser = require('../lib/service'),
		c = require('../../config'),
		Mongolian = require("mongolian");

// Db.
var server = new Mongolian(c.config.dbConnection),
		db = server.db(c.config.dbName);

if(c.config.dbConnection !== 'localhost'){
	db.auth(c.config.dbUserName, c.config.dbPassword);
}

var zones = db.collection("zones");

// HTTP content getter.
exports.get = function(obj, callBack){
		
	if(obj.action === 'list'){

		zones.find().limit(5).toArray(function (err, list) {
         			
			callBack(list);
		});
	} else if(obj.action === 'view'){

		zones.findOne({ key: obj.params.p1 }, function(err, obj) {
			callBack(obj);
		});
	} else if(obj.action === 'update'){
	
		// Save to db.
		zones.update({key: obj.params.key}, {$set: {content: obj.params.content}});
	
		// data
		callBack(obj.params);
	
	} else if(obj.action === 'create'){
	
		// Add date.
		obj.params.date = Date.now();
		
		// Save to db.
		zones.save(obj.params);
		
		// data
		callBack(obj.params);
	} else if(obj.action === 'delete'){
	
		zones.remove({key: obj.params.key})
		
		// data
		callBack(obj.params);
	} else {
		callBack({foo: 'zone'});
	}
};