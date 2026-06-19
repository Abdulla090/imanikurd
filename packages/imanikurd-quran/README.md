# imanikurd-quran

Quran database, 13 Kurdish Tafsirs, and audio recitations logic for the Kurdish community. Part of the `imanikurd` toolkit.

## Installation

```bash
npm install imanikurd-quran
```

## Features

- **Full Quran Text**: All 6236 ayahs with Kurdish and Arabic metadata.
- **13 Kurdish Tafsirs**: Includes Tafsir Rebar, Asan, Raman, Hazhar, and more.
- **Audio Recitations**: Reciters (Qaris) and audio link generators.

## Usage

```typescript
import { getSurah, getSurahAyahs, getTafsirForAyah } from "imanikurd-quran";

// Get Surah Al-Fatiha
const surah = getSurah(1);
console.log(surah.englishName); // Al-Fatiha

// Get Tafsir for Al-Fatiha Ayah 1
const tafsir = getTafsirForAyah(1, 1, "rebar");
console.log(tafsir); // Kurdish Tafsir text
```
