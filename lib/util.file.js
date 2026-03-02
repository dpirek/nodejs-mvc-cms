var fs = require('fs'),
		path = require('path'),
		c = require('../config');

function sendJson(res, payload) {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write(JSON.stringify(payload));
	res.end();
}

function parseMultipartBody(buffer, boundary) {
	var raw = buffer.toString('latin1');
	var parts = raw.split('--' + boundary);
	var fields = {};
	var files = {};

	parts.forEach(function(part) {
		var normalized = part;

		if (!normalized || normalized === '--\r\n' || normalized === '--' || normalized === '\r\n') {
			return;
		}

		if (normalized.indexOf('\r\n') === 0) {
			normalized = normalized.substring(2);
		}

		if (normalized.lastIndexOf('\r\n') === normalized.length - 2) {
			normalized = normalized.substring(0, normalized.length - 2);
		}

		var headerEnd = normalized.indexOf('\r\n\r\n');
		if (headerEnd === -1) {
			return;
		}

		var headerText = normalized.substring(0, headerEnd);
		var contentText = normalized.substring(headerEnd + 4);
		var contentDisposition = /content-disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]*)")?/i.exec(headerText);

		if (!contentDisposition) {
			return;
		}

		var fieldName = contentDisposition[1];
		var fileName = contentDisposition[2];

		if (typeof fileName === 'string') {
			files[fieldName] = {
				name: path.basename(fileName),
				data: Buffer.from(contentText, 'latin1')
			};
		} else {
			fields[fieldName] = contentText;
		}
	});

	return { fields: fields, files: files };
}

exports.upload = function(req, res){
	var chunks = [];

	req.addListener('data', function(chunk) {
		chunks.push(chunk);
	});

	req.addListener('end', function() {
		try {
			var body = Buffer.concat(chunks);
			var contentType = req.headers['content-type'] || '';
			var boundaryMatch = /boundary=([^;]+)/i.exec(contentType);
			var parsed = { fields: {}, files: {} };

			if (boundaryMatch) {
				parsed = parseMultipartBody(body, boundaryMatch[1]);
			}

			var fields = parsed.fields;
			var files = parsed.files;
			var fileName = '';
			var filePath = '/content/files/';
			var file = files.fileToUpload;

			if (!file || !file.data || !file.data.length) {
				return sendJson(res, {
					isSucessful: false,
					message: 'Did not receive any file!'
				});
			}

			fileName = fields.fileName ? path.basename(fields.fileName) : file.name;
			if (!fileName) {
				fileName = 'upload.bin';
			}

			var outputDir = c.config.appPath + filePath;
			var outputPath = outputDir + fileName;
			fs.mkdirSync(outputDir, { recursive: true });
			fs.writeFile(outputPath, file.data, function (err) {
				if (err){
					return sendJson(res, {
						isSucessful: false,
						message: 'Something went wrong!'
					});
				}

				sendJson(res, {
					isSucessful: true,
					message: 'File was saved!',
					data: {
						fileName: fileName,
						filePath: filePath
					}
				});
			});
		} catch (err) {
			sendJson(res, {
				isSucessful: false,
				message: 'Something went wrong!'
			});
		}
	});
};
