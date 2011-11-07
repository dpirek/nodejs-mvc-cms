var formidable = require('formidable'),
		c = require('../../config'),
		fs = require('fs');

exports.upload = function(req, res){
	
	var form = new formidable.IncomingForm();
	
	// Parse file.
  form.parse(req, function(err, fields, files) {
  	
  	if(files.fileToUpload){
			
			// Read file.			
			fs.readFile(files.fileToUpload.path, function(err, data){

		  	// Save file.
				fs.writeFile(c.config.appPath + '/content/files/' + 
					files.fileToUpload.name, 
					data, 
					'utf8', 
					function (err) {
						if (err){
							// throw err;
							res.writeHead(200, {'content-type': 'text/plain'});
							res.write(JSON.stringify({
								isSucessful: false,
								message: 'Something went wrong!'					
							}));
							res.end();
						} else {
							// Sucess.
							res.writeHead(200, {'content-type': 'text/plain'});
							res.write(JSON.stringify({
								isSucessful: true,
								message: 'File was saved!'
							}));
							res.end();
						}
				});
			});
		} else {
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write(JSON.stringify({
				isSucessful: false,
				message: 'Did not receive any file!'					
			}));
			res.end();
		}
  });
};