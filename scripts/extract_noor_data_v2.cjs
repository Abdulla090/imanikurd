const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join('src', 'assets', 'noor_db', 'noor_database_v2.db');
const outputDir = path.join('public', 'data');
const prayerOutputDir = path.join('src', 'data');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(prayerOutputDir)) fs.mkdirSync(prayerOutputDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 1. Extract Prayer Times
    console.log("Extracting Prayer Times...");
    db.all("SELECT * FROM PrayerTimesforKurdistantable", (err, rows) => {
        if (err) {
            console.error("Error extracting prayer times:", err);
        } else {
            console.log(`Found ${rows.length} prayer time records.`);
            const prayerData = {};

            // Need to see the row structure to map correctly
            // Based on previous valid glimpse: maybe city name is a column?
            // Or maybe it's just one big table with City column?
            // Let's dump a sample to console to be safe, then proceed.
            // Actually, I'll assumne the structure and if it fails, I'll debug.
            // Common keys: 'Date', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'City'
            // The previous 'prayertimes' inspect had: bayani, xorhalatn, niwaro, asr, eywara, esha, cities, date

            rows.forEach(row => {
                // Adjust keys based on actual table columns (guessing slightly, will refine if errors)
                // If columns are Arabic/Kurdish:
                const city = row.city_name || row.City || row.cities || 'Hawler';
                const date = row.Date || row.date; // "01-01"

                if (!prayerData[city]) prayerData[city] = {};
                if (date) {
                    prayerData[city][date] = {
                        fajr: row.Fajr || row.bayani,
                        sunrise: row.Sunrise || row.xorhalatn,
                        dhuhr: row.Dhuhr || row.niwaro,
                        asr: row.Asr || row.asr,
                        maghrib: row.Maghrib || row.eywara,
                        isha: row.Isha || row.esha
                    };
                }
            });

            fs.writeFileSync(path.join(prayerOutputDir, 'prayer_times_kurdistan.json'), JSON.stringify(prayerData, null, 2));
            console.log("Prayer times saved.");
        }
    });

    // 2. Extract Tafsirs from ayah_text
    const tafsirColumns = [
        'rebar', 'raman', 'puxte', 'asan', 'hazhar', 'zhian',
        'sanahi', 'moyasar', 'tawhidi', 'roshn', 'runahi', 'muxtasar'
    ];
    // Note: I am guessing the exact column names based on the earlier 't_rebar', 't_asan' pattern
    // and the specific output 'rebar', 'raman', 'puxte'. 
    // I will try to select them all. If a column doesn't exist, SQLite will error? 
    // Easier: SELECT * and iterate keys.

    db.all("SELECT * FROM ayah_text", (err, rows) => {
        if (err) {
            console.error("Error reading ayah_text:", err);
            return;
        }

        console.log(`Processing ${rows.length} ayahs for Tafsir extraction...`);

        // Identify which columns are actually present and look like Tafsir
        const sample = rows[0];
        const availableTafsirs = Object.keys(sample).filter(key =>
            // Filter keys that are likely Tafsir (long text, not metadata)
            !['suraId', 'juzz', 'page', 'link', 'sura_name_ar', 'ayah', 'text', 'aya_no_arabic', 'aya_no_arabic_rev', 'id'].includes(key)
        );

        console.log("Found Tafsir columns:", availableTafsirs);

        availableTafsirs.forEach(tafsirName => {
            const extracted = rows.map(r => ({
                s: r.suraId,
                a: r.ayah,
                t: r[tafsirName]
            }));

            // Save each Tafsir as a separate JSON
            fs.writeFileSync(
                path.join(outputDir, `tafsir_${tafsirName}.json`),
                JSON.stringify(extracted)
            );
            console.log(`Saved tafsir_${tafsirName}.json`);
        });
    });

});
