const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const config = require("../config").config;

const dbFilePath = config.dbFile || path.join(__dirname, "../db/cms.sqlite");
const shouldSeed = process.argv.includes("--seed");

fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });

const db = new DatabaseSync(dbFilePath);

const TABLE_MAP = {
  pages: "pages",
  posts: "posts",
  blogs: "posts",
  comments: "comments",
  users: "users",
  zones: "zones",
};

function createCollectionTable(tableName) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS " +
      tableName +
      " (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "data TEXT NOT NULL" +
      ");"
  );
}

function tableExists(tableName) {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return !!row;
}

function initializeSchema() {
  createCollectionTable("pages");
  createCollectionTable("posts");
  createCollectionTable("comments");
  createCollectionTable("users");
  createCollectionTable("zones");

  db.exec(
    "CREATE TABLE IF NOT EXISTS schema_meta (" +
      "key TEXT PRIMARY KEY, " +
      "value TEXT NOT NULL" +
      ");"
  );
}

function isLegacyMigrated() {
  const row = db
    .prepare("SELECT value FROM schema_meta WHERE key = 'legacy_documents_migrated'")
    .get();
  return !!(row && row.value === "1");
}

function setLegacyMigrated() {
  db.prepare(
    "INSERT OR REPLACE INTO schema_meta (key, value) VALUES ('legacy_documents_migrated', '1')"
  ).run();
}

function migrateLegacyDocuments() {
  if (!tableExists("documents") || isLegacyMigrated()) {
    return;
  }

  const rows = db.prepare("SELECT collection, data FROM documents").all();

  rows.forEach((row) => {
    const table = TABLE_MAP[row.collection];
    if (!table) {
      return;
    }
    db.prepare("INSERT INTO " + table + " (data) VALUES (?)").run(row.data);
  });

  setLegacyMigrated();
}

function resolveTableName(collection) {
  return TABLE_MAP[collection] || collection;
}

function exists(collection, matcher) {
  const tableName = resolveTableName(collection);
  const rows = db
    .prepare("SELECT data FROM " + tableName)
    .all();

  return rows.some((row) => {
    const doc = JSON.parse(row.data);
    return Object.keys(matcher).every((key) => doc[key] === matcher[key]);
  });
}

function insert(collection, payload) {
  const tableName = resolveTableName(collection);
  db.prepare("INSERT INTO " + tableName + " (data) VALUES (?)").run(
    JSON.stringify(payload)
  );
}

initializeSchema();
migrateLegacyDocuments();

if (shouldSeed) {
  if (!exists("pages", { url: "index" })) {
    insert("pages", {
      body: "<legend>Welcome</legend>",
      title: "Welcome",
      url: "index",
      user: "",
      date: new Date().toISOString(),
    });
  }

  if (!exists("zones", { key: "header" })) {
    insert("zones", {
      content: "<p>header</p>",
      key: "header",
      date: Date.now(),
    });
  }

  if (!exists("zones", { key: "footer" })) {
    insert("zones", {
      content: "<p>footer</p>",
      key: "footer",
      date: Date.now(),
    });
  }
}

console.log(
  `SQLite initialized at ${dbFilePath}${shouldSeed ? " (seeded)" : ""}`
);
