const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('src', 'assets', 'noor_db', 'noor_database_v2.db');
console.log("Opening DB at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error opening database:", err.message);
    else console.log("Connected to the SQLite database.");
});

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error(err.message);
            return;
        }
        // Log ALL tables to see exactly what we have
        const tableNames = tables.map(t => t.name);
        console.log("ALL Tables found:", JSON.stringify(tableNames, null, 2));
    });
});
