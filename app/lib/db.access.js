// References.
var Mongolian = require("mongolian"),
		c = require('../../config');

// Db.
var server = new Mongolian(c.config.dbConnection),
		db = server.db(c.config.dbName);
		
if(c.config.dbConnection !== 'localhost'){
	db.auth(c.config.dbUserName, c.config.dbPassword);
}

exports.get = function(){
	return db;
};