const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'assets', 'noor_db', 'noor_database_v2.db');
const outputDir = path.join('public', 'data');
const prayerOutputDir = path.join('src', 'data');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(prayerOutputDir)) fs.mkdirSync(prayerOutputDir, { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error opening DB:", err);
    else console.log("DB Opened");
});

// Tafsir Tables to extract
const tafsirTables = [
    't_asan', 't_hazhar', 't_ramann', 't_rebar', 't_zhian',
    't_sanahi', 't_muyasar', 't_tawhidi', 't_roshn', 't_runahi', 't_mukhtasar', 't_puxte'
];

db.serialize(() => {
    // 1. Extract Prayer Times
    console.log("Extracting Prayer Times...");
    db.all("SELECT * FROM prayertimes", (err, rows) => {
        if (err) {
            console.error("Error extracting prayer times:", err);
            return;
        }

        const prayerData = {};

        // Group by city
        rows.forEach(row => {
            const city = row.cities || 'Hawler'; // Default if null, though inspect showed 'Hawler'
            if (!prayerData[city]) prayerData[city] = {};

            // Key by short date "MM-DD"
            // The sample row showed date: '01-01'. 
            if (row.date) {
                prayerData[city][row.date] = {
                    fajr: row.bayani,
                    sunrise: row.xorhalatn,
                    dhuhr: row.niwaro,
                    asr: row.asr,
                    maghrib: row.eywara,
                    isha: row.esha
                };
            }
        });

        fs.writeFileSync(
            path.join(prayerOutputDir, 'prayer_times_kurdistan.json'),
            JSON.stringify(prayerData, null, 2)
        );
        console.log("Prayer times saved.");
    });

    // 2. Extract Tafsirs
    tafsirTables.forEach(table => {
        // Check if table exists first (some might have slightly different names in v2)
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`, (err, row) => {
            if (!row) {
                console.warn(`Table ${table} not found, skipping.`);
                return;
            }

            console.log(`Extracting ${table}...`);
            // Usually cols are: id, sura, aya, text
            db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    console.error(`Error reading ${table}:`, err);
                    return;
                }

                // Minify data: array of arrays or simple objects to save space?
                // Objects are easier: { s: sura, a: aya, t: text }
                const formatted = rows.map(r => ({
                    s: r.sura,
                    a: r.aya,
                    t: r.text
                }));

                fs.writeFileSync(
                    path.join(outputDir, `${table}.json`),
                    JSON.stringify(formatted) // Minified JSON (no spaces)
                );
                console.log(`Saved ${table}.json (${formatted.length} ayahs)`);
            });
        });
    });

});
