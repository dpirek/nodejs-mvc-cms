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

var blogs = db.collection("blogs"), 
		comments = db.collection("comments");

// HTTP content getter.
exports.get = function(obj, callBack){
		
	if(obj.action === 'list'){
		
		var currentPage = parseInt(obj.params.p1),
				recordsPerPage = parseInt(obj.params.p2),
				startIndex = (currentPage * recordsPerPage) - recordsPerPage,
				endIndex = startIndex + recordsPerPage - 1;
		
		blogs.find().limit(500).toArray(function (err, list) {
			
			var itemCount = list.length;
			var pagedList = [];
			
    	a.pager(list, startIndex, endIndex, function(i, item){
    		pagedList.push(item);
    	});
    	
    	// 
    	callBack({
    		blogs: pagedList,
    		blogCount: itemCount
    	});
		});
	} else if(obj.action === 'listcomments'){
		
		var currentPage = parseInt(obj.params.p1),
				recordsPerPage = parseInt(obj.params.p2),
				startIndex = (currentPage * recordsPerPage) - recordsPerPage,
				endIndex = startIndex + recordsPerPage - 1;
				
		//console.log(obj.params)
		comments.find().limit(500).toArray(function (err, list) {
			
			var itemCount = list.length;
			var commentList = [];
			
    	a.pager(list, startIndex, endIndex, function(i, item){
    		commentList.push(item);
    	});
    	
    	//
    	callBack({
    		comment: commentList,
    		commentCount: itemCount
    	});
		});
	} else if(obj.action === 'view'){

		blogs.findOne({ url: obj.params.p1 }, function(err, blog) {
         			
			callBack(blog);
		});
	} else if(obj.action === 'update'){
		
		// Save to db.
		blogs.update({url: obj.params.url}, {$set: {body: obj.params.body}});
		blogs.update({url: obj.params.url}, {$set: {title: obj.params.title}});
	
		// data
		callBack(obj.params);
	
	} else if(obj.action === 'create'){
		
		var now = new Date();
	
		// Add date.
		obj.params.date = now; //.toJSON();
		
		// Save to db.
		blogs.save(obj.params);
		
		// data
		callBack(obj.params);
	} else if(obj.action === 'createcomment'){
		
		var now = new Date();
	
		// Add date.
		obj.params.date = now; //.toJSON();
		
		// Status 0 for un-approved comment.
		obj.params.status = 0; 
		
		// Save to db.
		comments.save(obj.params);
		
		// data
		callBack(obj.params);
	} else if(obj.action === 'delete'){
		
		blogs.remove({url: obj.params.url})
		
		// data
		callBack(obj.params);
	} else {
		callBack({foo: 'page'});
	}
};