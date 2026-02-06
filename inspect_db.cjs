const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the unzipped database (Corrected: added .db extension)
const dbPath = path.join('src', 'assets', 'noor_db', 'noor_database_v2.db');

console.log("Opening DB at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

db.serialize(() => {
    // List all tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error(err.message);
            return;
        }

        const tableNames = tables.map(t => t.name);
        console.log("Tables found:", tableNames);

        // For each table, get column info
        const interestingTables = tableNames.filter(name =>
            name.toLowerCase().includes('tafsir') ||
            name.toLowerCase().includes('quran') ||
            name.toLowerCase().includes('pray')
        );

        console.log("Inspecting interesting tables:", interestingTables);

        interestingTables.forEach(tableName => {
            db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
                if (err) {
                    console.error(`Error processing table ${tableName}:`, err.message);
                } else {
                    console.log(`\nTable: ${tableName}`);
                    console.log("Columns:", columns.map(c => c.name).join(', '));

                    // Get one row sample
                    db.get(`SELECT * FROM ${tableName} LIMIT 1`, (err, row) => {
                        if (err) console.error(err);
                        else console.log("Sample Row:", row);
                    });
                }
            });
        });
    });
});
