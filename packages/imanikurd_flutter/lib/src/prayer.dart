import 'cities.dart';
import 'load_data.dart';
import 'models.dart';

typedef PrayerTimesData = Map<String, List<DayPrayerRecord>>;

PrayerTimesData? _prayerCache;

Future<PrayerTimesData> _getPrayerData() async {
  if (_prayerCache != null) return _prayerCache!;
  final raw = await loadDataAsync<Map<String, dynamic>>('prayer_times.json');
  _prayerCache = raw.map(
    (city, records) => MapEntry(
      city,
      (records as List<dynamic>)
          .map((e) => DayPrayerRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
  );
  return _prayerCache!;
}

String _formatDateKey(DateTime date) {
  final month = date.month.toString().padLeft(2, '0');
  final day = date.day.toString().padLeft(2, '0');
  return '$month-$day';
}

int _parseTimeToMinutes(String timeStr) {
  if (timeStr.isEmpty) return 0;
  final cleaned = timeStr.split(' ').first.trim();
  final parts = cleaned.split(':');
  if (parts.length < 2) return 0;
  final h = int.tryParse(parts[0]);
  final m = int.tryParse(parts[1]);
  if (h == null || m == null) return 0;
  return h * 60 + m;
}

Future<List<String>> getPrayerCities() async {
  final data = await _getPrayerData();
  final keys = data.keys.toList()..sort();
  return keys;
}

Future<PrayerTimings?> getPrayerTimes(String cityKey, [DateTime? date]) async {
  final data = await _getPrayerData();
  final cityRecords = data[cityKey] ?? data['Hawler'];
  if (cityRecords == null) return null;

  final dateKey = _formatDateKey(date ?? DateTime.now());
  for (final record in cityRecords) {
    if (record.date == dateKey) return record.toTimings();
  }
  return null;
}

Future<DailyPrayerRecordWithTimings?> getDailyPrayerRecord(String cityKey, [DateTime? date]) async {
  final data = await _getPrayerData();
  final cityRecords = data[cityKey] ?? data['Hawler'];
  if (cityRecords == null) return null;

  final dateKey = _formatDateKey(date ?? DateTime.now());
  for (final record in cityRecords) {
    if (record.date == dateKey) {
      return DailyPrayerRecordWithTimings(
        date: record.date,
        fajr: record.fajr,
        sunrise: record.sunrise,
        dhuhr: record.dhuhr,
        asr: record.asr,
        maghrib: record.maghrib,
        isha: record.isha,
        timings: record.toTimings(),
      );
    }
  }
  return null;
}

Future<List<MonthlyPrayerDay>> getMonthlyPrayerTimes(
  String cityKey,
  int month, [
  int? year,
]) async {
  final data = await _getPrayerData();
  final cityRecords = data[cityKey] ?? data['Hawler'] ?? [];
  final targetYear = year ?? DateTime.now().year;

  final result = <MonthlyPrayerDay>[];
  for (final record in cityRecords) {
    final parts = record.date.split('-').map(int.parse).toList();
    if (parts.length < 2) continue;
    final mm = parts[0];
    final dd = parts[1];
    if (mm == month) {
      result.add(
        MonthlyPrayerDay(
          date: DateTime(targetYear, mm, dd),
          day: dd,
          month: mm,
          timings: record.toTimings(),
        ),
      );
    }
  }
  result.sort((a, b) => a.day.compareTo(b.day));
  return result;
}

String getCityFromCoordinates(double lat, double lng) => getCityByCoordinates(lat, lng).key;

String getCityName(String cityKey) => getCityDisplayName(cityKey);

Future<NextPrayer?> getNextPrayer(String cityKey, [DateTime? now]) async {
  final current = now ?? DateTime.now();
  final timings = await getPrayerTimes(cityKey, current);
  if (timings == null) return null;

  final prayers = [
    ('Fajr', timings.fajr),
    ('Sunrise', timings.sunrise),
    ('Dhuhr', timings.dhuhr),
    ('Asr', timings.asr),
    ('Maghrib', timings.maghrib),
    ('Isha', timings.isha),
  ];

  final currentMins = current.hour * 60 + current.minute;

  for (final prayer in prayers) {
    final prayerMins = _parseTimeToMinutes(prayer.$2);
    if (prayerMins > currentMins) {
      final diff = prayerMins - currentMins;
      return NextPrayer(
        name: prayer.$1,
        time: prayer.$2,
        hoursUntil: diff ~/ 60,
        minutesUntil: diff % 60,
      );
    }
  }

  final fajrMins = _parseTimeToMinutes(prayers.first.$2);
  final diff = 24 * 60 - currentMins + fajrMins;
  return NextPrayer(
    name: prayers.first.$1,
    time: prayers.first.$2,
    hoursUntil: diff ~/ 60,
    minutesUntil: diff % 60,
  );
}

Future<PrayerTimings?> getPrayerTimesByLocation(
  double lat,
  double lng, [
  DateTime? date,
]) {
  final cityKey = getCityFromCoordinates(lat, lng);
  return getPrayerTimes(cityKey, date);
}
