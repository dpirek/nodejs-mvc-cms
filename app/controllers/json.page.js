// Lib.
var tmpl = require('jqtpl'),
		ser = require('../lib/service'),
		c = require('../../config'),
		a = require('../lib/util.array'),
		Mongolian = require("mongolian");

// Db.
var server = new Mongolian(c.config.dbConnection),
		db = server.db(c.config.dbName);
		
if(c.config.dbConnection !== 'localhost'){
	db.auth(c.config.dbUserName, c.config.dbPassword);
}

var pages = db.collection("pages");

// HTTP content getter.
exports.get = function(obj, callBack){
		
	if(obj.action === 'list'){
		
		var currentPage = parseInt(obj.params.p1),
				recordsPerPage = parseInt(obj.params.p2),
				startIndex = (currentPage * recordsPerPage) - recordsPerPage,
				endIndex = startIndex + recordsPerPage - 1;
		
		pages.find().limit(500).toArray(function (err, list) {
			
			var itemCount = list.length;
			var pagedList = [];
			
    	a.pager(list, startIndex, endIndex, function(i, item){
    		pagedList.push(item);
    	});
    	
    	// 
    	callBack({
    		pages: pagedList,
    		pageCount: itemCount
    	});
		});
	} else if(obj.action === 'view'){

		pages.findOne({ url: obj.params.p1 }, function(err, page) {
         			
			callBack(page);
		});
	} else if(obj.action === 'update'){
		
		// Save to db.
		pages.update({url: obj.params.url}, {$set: {body: obj.params.body}});
		pages.update({url:obj.params.url}, {$set: {title: obj.params.title}});
	
		// data
		callBack(obj.params);
	
	} else if(obj.action === 'create'){
		
		var now = new Date();
		
		// Add date.
		obj.params.date = now;
		
		// Save to db.
		pages.save(obj.params);
		
		// data
		callBack(obj.params);
	} else if(obj.action === 'delete'){
		
		pages.remove({url: obj.params.url})
		
		// data
		callBack(obj.params);
	} else {
		callBack({foo: 'page'});
	}
};