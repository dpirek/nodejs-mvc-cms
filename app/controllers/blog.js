
// Libs.
var tmpl = require('jqtpl'),
		ser = require('../lib/service'),
		s = require('../lib/util.string')
		c = require('../../config'),
		Mongolian = require("mongolian");

// Db.
var server = new Mongolian(c.config.dbConnection),
		db = server.db(c.config.dbName);
		
if(c.config.dbConnection !== 'localhost'){
	db.auth(c.config.dbUserName, c.config.dbPassword);
}

var blogs = db.collection("blogs"),
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
	},
	date: function(date){
		
		var d = new Date(date);
	
		return d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
	},
	truncate: function(string, length){
	
		// Remove HTML
		string = string.replace(/<.*?>/g, '');
		
		// Remove zone tags.
		string = string.replace(/{.*?}/g, '');
	
		return '<p>' + s.string.truncate(string, length) + '</p>';
	} 
};

// HTTP content getter.
exports.get = function(params, view, callBack){

	var url = params.p1;

	
	// Get zone list.
	zonesDb.find().limit(50).toArray(function (err, zonesList) {
  	
  	// Zone list.
  	zones = zonesList;
		
		// Array to obj conversion.  	
  	var zone = {};
		for(var i in zones) {
			zone[zones[i].key] = zones[i].content;
		}
		
		if(url === ''){

			// Page.
			blogs.find().limit(50).toArray(function (err, list) {

				var content = tmpl.tmpl(view, {blogs: list, zone: zone}, helpers);
				callBack(content);
			});
		
		// Show blog role
		} else {

			// Page.
			blogs.findOne({url: url}, function(err, obj) {
				
				//console.log(obj);
				
				var content = tmpl.tmpl(view, {blog: obj, zone: zone}, helpers);
				callBack(content);
			});
		}
		
	});
};