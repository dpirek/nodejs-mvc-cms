var fs = require('fs'),
		util = require('../lib/util.string'),
		c = require('../../config');

// HTTP content getter.
exports.get = function(url, params, callBack){
	
	if(url === 'foo'){
		
		callBack({zone: 'foo'});
	
	} else if(url === 'zone/detail'){
		
		fs.readFile(c.config.appPath + '/Models/Zones.js', function (err, data) {
			
			var obj = JSON.parse(data),
					zones = obj,
					pageModel = {};
		
			// Find detail record.
			for(var i in zones) {
				if(zones[i].zone_name === params.name){
					pageModel = zones[i];
				}
			}
			
			// Send data back.
			callBack({zone: pageModel});
		});	
	
	} else if(url === 'zone/list'){
		
		fs.readFile(c.config.appPath + '/Models/Zones.js', function (err, data) {
			
			var obj = JSON.parse(data),
					zones = obj,
					pageModel = {};
					
					// Send data back.
			callBack({zone: zones});
		});	
	
	} else if(url === 'pages/detail'){
		
		fs.readFile(c.config.appPath + '/Models/Pages.js', function (err, data) {
			
			var obj = JSON.parse(data),
					pages = obj,
					pageModel = {};
		
			// Find detail record.
			for(var i in pages) {
				if(pages[i].page_url === params.url){
					pageModel = pages[i];
				}
			}
			
			// Send data back.
			callBack({page: pageModel});
		});	
	} else if(url === 'pages/list'){
		
		fs.readFile(c.config.appPath + '/Models/Pages.js', function (err, data) {
			
			var obj = JSON.parse(data),
					pages = obj;
		
			// Send data back.
			callBack({pages: pages});
		});			
	} else if(url === 'hypoteky/list'){
	
		fs.readFile(c.config.appPath + '/Models/Hypoteky.js', function (err, data) {
			
			var obj = JSON.parse(data),
					hypoteky = obj.data.hypoteky;
			
			// Add urls.
			for(var i in hypoteky) {
				 hypoteky[i].url = util.string.createUrl(hypoteky[i].loan);
			}
			
			// Send data back.
			callBack({hypoteky: hypoteky});
		});	
	} else if(url === 'hypoteky/detail'){
		
		fs.readFile(c.config.appPath + '/Models/Hypoteky.js', function (err, data) {
			
			var obj = JSON.parse(data),
					hypoteky = obj.data.hypoteky,
					pageModel;
			
			// Add urls.
			for(var i in hypoteky) {
				 hypoteky[i].url = util.string.createUrl(hypoteky[i].loan);
			}
			
			// Find detail record.
			for(var i in hypoteky) {
				if(hypoteky[i].url === params.url){
					pageModel = hypoteky[i];
				}
			}

			// Send data back.
			callBack({hypoteka: pageModel});
		});
	} else {
		callBack({});
	}
};