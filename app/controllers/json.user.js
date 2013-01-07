// Lib.
var tmpl = require('jqtpl'),
		fs = require('fs'),
		util = require('../lib/util.string');
		dbAcccess = require('../lib/db.access'),
		c = require('../../config');

var db = dbAcccess.get();


// Data sets.
var users = db.collection("users");

// HTTP content getter.
exports.get = function(obj, callBack){
	
	if(obj.action === 'getsession'){
		
		var user = window.userSession[obj.cookies.userSession];
		
		// Check if session is present, otherwise logout.
		if(user){
		
			// Choose menu model.
			var menuModelUrl = '/models/menu.js';

			fs.readFile(c.config.appPath + menuModelUrl, function (err, data) {
				
				var menuItems = JSON.parse(data);	
				
				// User data.
				var d = {
			    userName: user.name,
			    userType: user.userType,
			    guid: user.guid,
			    menuItems: menuItems
		    };
		    
	    	callBack(d);

			});
		} else {
			callBack({}, false, false, 'you are logged out');
		}
	} else if(obj.action === 'logout'){
		
		// Delete user from user session object.
		if(obj.cookies.userSession){
			delete window.userSession[obj.cookies.userSession];
		}
		
		// Set cookie to nothing.
		callBack({
			cookie: obj.cookies
		},
		{
			key: 'userSession',
			value: ''
		});
	
	} else if(obj.action === 'login'){

		users.findOne({ 
			name: obj.params.name, 
			password: obj.params.password 
		}, function(err, record) {
		
		// If login sucesfull		
		if(record){

			var sessionGuid = util.string.guid();
			
			// Set.
			window.userSession[sessionGuid] = record;

			// Callback
			callBack({
					//record: record.length,
					//users: window.userSession,
					//cookies: obj.cookies,
					//userName: obj.params.p1,
					userSession: sessionGuid
				},
				{
					key: 'userSession',
					value: sessionGuid
				});
				
			} else {
				callBack({}, false, false);
			}
			
		});
	} else if(obj.action === 'view'){

		users.findOne({ guid: obj.params.p1 }, function(err, user) {

  		// CB.
    	callBack({
      	user: user
      });
		});
	 } else if(obj.action === 'list'){

		users.find().limit(500).toArray(function (err, list) {
      
      // Chew.
      var newList = [];
      
      if(list){
	      list.forEach(function(d, i){
	      	
	      	// Mute password.
	      	d.password = 'not telling you :)';
	      
	      	newList.push(d);
	      });
      }
			callBack({users: newList});
		});
		} else if(obj.action === 'update'){
		
		// Save to db.
		users.update({guid: obj.params.guid}, {$set: {name: obj.params.name}});
		users.update({guid: obj.params.guid}, {$set: {password: obj.params.password}});
		users.update({guid: obj.params.guid}, {$set: {email: obj.params.email}});
	
		// data
		callBack(obj.params);
	} else if(obj.action === 'create'){
		
		var now = new Date();

		// Add date.
		obj.params.date = now; //now.toJSON();
		obj.params.guid = util.string.guid();
		
		// Save to db.
		users.save(obj.params);
		
		// data
		callBack(obj.params);
	} else if(obj.action === 'delete'){
		
		users.remove({guid: obj.params.guid});
		
		// data
		callBack(obj.params);
	} else {
		callBack({});
	}
};