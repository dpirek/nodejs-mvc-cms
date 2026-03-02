// References.
var fs = require("fs"),
		path = require("path"),
		DatabaseSync = require("node:sqlite").DatabaseSync,
		c = require("../../config");

var dbFilePath = c.config.dbFile || path.join(__dirname, "../../db/cms.sqlite");
fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });

var sqlite = new DatabaseSync(dbFilePath);

var TABLE_MAP = {
	pages: "pages",
	posts: "posts",
	blogs: "posts",
	comments: "comments",
	users: "users",
	zones: "zones"
};

function tableExists(tableName) {
	var row = sqlite
		.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
		.get(tableName);
	return !!row;
}

function createCollectionTable(tableName) {
	sqlite.exec(
		"CREATE TABLE IF NOT EXISTS " + tableName + " (" +
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"data TEXT NOT NULL" +
		");"
	);
}

function initializeSchema() {
	createCollectionTable("pages");
	createCollectionTable("posts");
	createCollectionTable("comments");
	createCollectionTable("users");
	createCollectionTable("zones");

	sqlite.exec(
		"CREATE TABLE IF NOT EXISTS schema_meta (" +
		"key TEXT PRIMARY KEY, " +
		"value TEXT NOT NULL" +
		");"
	);
}

function isLegacyMigrated() {
	var row = sqlite
		.prepare("SELECT value FROM schema_meta WHERE key = 'legacy_documents_migrated'")
		.get();
	return !!(row && row.value === "1");
}

function setLegacyMigrated() {
	sqlite
		.prepare(
			"INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('legacy_documents_migrated', '1')"
		)
		.run();
}

function migrateLegacyDocuments() {
	if (!tableExists("documents") || isLegacyMigrated()) {
		return;
	}

	var rows = sqlite.prepare("SELECT collection, data FROM documents").all();

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var targetTable = TABLE_MAP[row.collection];

		if (!targetTable) {
			continue;
		}

		sqlite
			.prepare("INSERT INTO " + targetTable + " (data) VALUES (?)")
			.run(row.data);
	}

	setLegacyMigrated();
}

function resolveTableName(collectionName) {
	return TABLE_MAP[collectionName] || collectionName;
}

initializeSchema();
migrateLegacyDocuments();

function matchesQuery(doc, query) {
	if (!query) {
		return true;
	}

	for (var key in query) {
		if (query.hasOwnProperty(key) && doc[key] !== query[key]) {
			return false;
		}
	}

	return true;
}

function getSortValue(value) {
	if (value === null || value === undefined) {
		return value;
	}

	if (typeof value === "string") {
		var parsed = Date.parse(value);
		if (!isNaN(parsed)) {
			return parsed;
		}
		return value.toLowerCase();
	}

	if (value instanceof Date) {
		return value.getTime();
	}

	return value;
}

function compareValues(a, b) {
	if (a === b) {
		return 0;
	}
	if (a === undefined || a === null) {
		return -1;
	}
	if (b === undefined || b === null) {
		return 1;
	}
	return a < b ? -1 : 1;
}

function readCollectionRows(collectionName) {
	var tableName = resolveTableName(collectionName);
	return sqlite
		.prepare("SELECT id, data FROM " + tableName)
		.all();
}

function rowToDocument(row) {
	var doc = JSON.parse(row.data);
	doc._id = row.id;
	return doc;
}

function Cursor(collectionName, query) {
	this.collectionName = collectionName;
	this.query = query || {};
	this.limitCount = 0;
	this.sortField = "";
	this.sortDirection = 1;
}

Cursor.prototype.limit = function(count) {
	this.limitCount = parseInt(count, 10) || 0;
	return this;
};

Cursor.prototype.sort = function(sortObj) {
	if (!sortObj) {
		return this;
	}

	for (var key in sortObj) {
		if (sortObj.hasOwnProperty(key)) {
			this.sortField = key;
			this.sortDirection = sortObj[key] === -1 ? -1 : 1;
			break;
		}
	}

	return this;
};

Cursor.prototype.toArray = function(callback) {
	try {
		var rows = readCollectionRows(this.collectionName);
		var list = [];

		for (var i = 0; i < rows.length; i++) {
			var doc = rowToDocument(rows[i]);
			if (matchesQuery(doc, this.query)) {
				list.push(doc);
			}
		}

		if (this.sortField) {
			var sortField = this.sortField;
			var sortDirection = this.sortDirection;

			list.sort(function(a, b) {
				var aValue = getSortValue(a[sortField]);
				var bValue = getSortValue(b[sortField]);
				return compareValues(aValue, bValue) * sortDirection;
			});
		}

		if (this.limitCount > 0) {
			list = list.slice(0, this.limitCount);
		}

		if (callback) {
			process.nextTick(function() {
				callback(null, list);
			});
		}
	} catch (err) {
		if (callback) {
			process.nextTick(function() {
				callback(err, []);
			});
		}
	}
};

function Collection(name) {
	this.name = name;
}

Collection.prototype.find = function(query) {
	return new Cursor(this.name, query || {});
};

Collection.prototype.findOne = function(query, callback) {
	this.find(query).limit(1).toArray(function(err, list) {
		if (callback) {
			callback(err, list[0] || null);
		}
	});
};

Collection.prototype.save = function(doc, callback) {
	try {
		var newDoc = {};
		for (var key in doc) {
			if (doc.hasOwnProperty(key) && key !== "_id") {
				newDoc[key] = doc[key];
			}
		}

		var tableName = resolveTableName(this.name);
		var result = sqlite
			.prepare("INSERT INTO " + tableName + " (data) VALUES (?)")
			.run(JSON.stringify(newDoc));

		newDoc._id = Number(result.lastInsertRowid || result.lastInsertRowId);

		if (callback) {
			process.nextTick(function() {
				callback(null, newDoc);
			});
		}
	} catch (err) {
		if (callback) {
			process.nextTick(function() {
				callback(err);
			});
		}
	}
};

Collection.prototype.update = function(query, updateData, callback) {
	try {
		var rows = readCollectionRows(this.name);
		var modifiedCount = 0;
		var setData = (updateData && updateData.$set) || {};
		var tableName = resolveTableName(this.name);

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var doc = rowToDocument(row);

			if (matchesQuery(doc, query)) {
				for (var key in setData) {
					if (setData.hasOwnProperty(key)) {
						doc[key] = setData[key];
					}
				}
				sqlite
					.prepare("UPDATE " + tableName + " SET data = ? WHERE id = ?")
					.run(JSON.stringify(doc), row.id);
				modifiedCount++;
			}
		}

		if (callback) {
			process.nextTick(function() {
				callback(null, modifiedCount);
			});
		}
	} catch (err) {
		if (callback) {
			process.nextTick(function() {
				callback(err);
			});
		}
	}
};

Collection.prototype.remove = function(query, callback) {
	try {
		var rows = readCollectionRows(this.name);
		var removedCount = 0;
		var tableName = resolveTableName(this.name);

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var doc = rowToDocument(row);

			if (matchesQuery(doc, query)) {
				sqlite
					.prepare("DELETE FROM " + tableName + " WHERE id = ?")
					.run(row.id);
				removedCount++;
			}
		}

		if (callback) {
			process.nextTick(function() {
				callback(null, removedCount);
			});
		}
	} catch (err) {
		if (callback) {
			process.nextTick(function() {
				callback(err);
			});
		}
	}
};

var db = {
	collection: function(name) {
		return new Collection(name);
	}
};

exports.get = function() {
	return db;
};
