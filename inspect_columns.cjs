const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('src', 'assets', 'noor_db', 'noor_database_v2.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Inspect ayah_text
    db.all("PRAGMA table_info(ayah_text)", (err, columns) => {
        if (!err) {
            console.log("\nTable: ayah_text");
            console.log("Columns:", columns.map(c => c.name).join(', '));
            db.get("SELECT * FROM ayah_text LIMIT 1", (err, row) => {
                console.log("Sample:", row);
            });
        }
    });

    // Inspect PrayerTimesforKurdistantable
    db.all("PRAGMA table_info(PrayerTimesforKurdistantable)", (err, columns) => {
        if (!err) {
            console.log("\nTable: PrayerTimesforKurdistantable");
            console.log("Columns:", columns.map(c => c.name).join(', '));
            db.get("SELECT * FROM PrayerTimesforKurdistantable LIMIT 1", (err, row) => {
                console.log("Sample:", row);
            });
        }
    });
});
