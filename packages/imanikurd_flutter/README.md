# imanikurd

[![pub package](https://img.shields.io/pub/v/imanikurd.svg)](https://pub.dev/packages/imanikurd)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Abdulla090/imanikurd/blob/main/LICENSE)

Flutter/Dart package for the Kurdish Islamic toolkit — full Quran (6236 ayahs), 13 Kurdish Tafsirs, Qibla, prayer times, dhikr, hadith, and more.

## Install

Add to your `pubspec.yaml`:

```yaml
dependencies:
  imanikurd: ^1.1.1
```

Then run:

```bash
flutter pub get
```

## Quick start

```dart
import 'package:imanikurd/imanikurd.dart';

Future<void> main() async {
  final surahs = await getSurahs();
  final quran = await getFullQuran();
  final qibla = calculateQibla(36.19, 44.01);
  final times = await getPrayerTimes('Hawler');
  final dhikr = await getDhikrByCategory(1);
  final tafsir = await getTafsirForAyah('rebar', 1, 1);

  print('${surahs.length} surahs, ${quran.length} ayahs');
  print('Qibla: $qibla°, Fajr: ${times?.fajr}');
}
```

## Features

- **Quran** — 114 surahs, 6236 ayahs, search, juz/page lookup
- **Tafsir** — 13 Kurdish tafsir translations
- **Audio** — Recitation URL generators (Peshawa Qadir + major Arabic reciters)
- **Prayer times** — Kurdistan cities with monthly schedules
- **Qibla** — Bearing, distance to Kaaba, compass alignment check
- **Dhikr / Azkar** — Categorized remembrance items
- **Hadith** — Kurdish hadith collection with search
- **Names of Allah** — All 99 names with translations
- **Companions, Seerah, Library** — Educational content

## Custom data loading

By default, JSON is loaded from bundled `assets/data/`. You can override:

```dart
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:imanikurd/imanikurd.dart';

Future<void> configure() async {
  setDataLoader((filename) async {
    final raw = await rootBundle.loadString('assets/custom/$filename');
    return jsonDecode(raw);
  });

  // Or use a remote CDN:
  setBaseUrl('https://unpkg.com/imanikurd@1.1.1/data/');
}
```

## Related packages

| Platform | Package |
|----------|---------|
| npm (Node/React) | [`imanikurd`](https://www.npmjs.com/package/imanikurd) |
| React Native | [`imanikurd-react-native`](https://www.npmjs.com/package/imanikurd-react-native) |
| Flutter | `imanikurd` (this package) |

## License

MIT
