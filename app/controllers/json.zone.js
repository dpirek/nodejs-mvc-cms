// Lib.
var tmpl = require('jqtpl'),
		dbAcccess = require('../lib/db.access'),
		c = require('../../config');

var db = dbAcccess.get();

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