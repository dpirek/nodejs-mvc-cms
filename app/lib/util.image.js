
// Image downloader.


/*
	Usage:
	
	var img = require('./lib/util.image');
	
	img.download({
		host: 'www.google.com', 
		port: 80, 
		path: '/images/logos/ps_logo2.png',
		targetFolder: '/',
		targetName: 'logo.png'
	});
*/

var http = require('http'),
		c = require('../../config'),
		fs = require('fs');

exports.download = function(options){
	
	var request = http.get(options, function(res){
		
		var imagedata = '';
		res.setEncoding('binary');
		
		// Chunk data.
		res.on('data', function(chunk){
			imagedata += chunk;
		});
		
		// Fianlly.
		res.on('end', function(){
			
			// Save file.
		  fs.writeFile(c.config.appPath + options.targetFolder + options.targetName, imagedata, 'binary', function(err){
		    if (err) throw err;
		    
		    //File was saved.
		    console.log('File saved.');
		    
		    // Crear memory.
		    imagedata = '';
		  });
		});
	});
};

