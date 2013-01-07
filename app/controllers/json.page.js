// Lib.
var tmpl = require('jqtpl'),
		a = require('../lib/util.array'),
		dbAcccess = require('../lib/db.access'),
		c = require('../../config');

var db = dbAcccess.get();

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
      
      if(page) {
        delete page._id;
      }
      
			callBack(page);
		});
	} else if(obj.action === 'update'){
		
		// Save to db.
		pages.update({url: obj.params.url}, {$set: {body: obj.params.body}});
		pages.update({url:obj.params.url}, {$set: {title: obj.params.title}});
	
		// data
		callBack(obj.params);
	
	} else if(obj.action === 'create'){
		
		pages.findOne({ url: obj.params.url }, function(err, page) {
      
      if(page) {
        callBack({}, {}, false);
      } else {
        
        var now = new Date();
		
    		// Add date.
    		obj.params.date = now;
    		
        if(obj.params.url === '' || obj.params.title === ''){
        	callBack(obj.params, {}, false);
        } else {
        	// Save to db.
          pages.save(obj.params);
          callBack(obj.params, {}, true);
        }
      }
		});		
	} else if(obj.action === 'delete'){
		
		pages.remove({url: obj.params.url})
		
		// data
		callBack(obj.params);
	} else {
		callBack({foo: 'page'});
	}
};