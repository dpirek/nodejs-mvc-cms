
// Libs.
var tmpl = require('jqtpl'),
		dbAcccess = require('../lib/db.access'),
		c = require('../../config');

var db = dbAcccess.get();

var pages = db.collection("pages"),
		zonesDb = db.collection("zones");

// Shared vars.
var zones = [];

var helpers = {
	htmlString: function(html){
	
		try {
			
			// Search zones.
			for(var i in zones) {
				html = html.replace('{zone:' + zones[i].key + '}', zones[i].content);
			}

		return html;
		} catch (ex){
			return ex;
		}
	}
};

// HTTP content getter.
exports.get = function(params, view, callBack){

	var pageUrl = params.p1;
	if(pageUrl === ''){
		pageUrl = 'index';
	}
	
	// Get zone list.
	zonesDb.find().limit(50).toArray(function (err, zonesList) {
  	
  	// Zone list.
  	zones = zonesList;
		
		// Array to obj conversion.  	
  	var zone = {};
		for(var i in zones) {
			zone[zones[i].key] = zones[i].content;
		}
			
		// Page.
		pages.findOne({url: pageUrl}, function(err, obj) {
			
			if(obj){
			
				var content = tmpl.tmpl(view, {
					page: obj, 
					zone: zone
					}, helpers);
					
				callBack(content);
			} else {
				
				// 404.
				callBack('404 Page not found!');
			}
			
		});
	});
};