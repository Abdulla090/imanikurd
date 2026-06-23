import 'load_data.dart';
import 'models.dart';

List<SeerahEntry>? _seerahCache;

class _RawPeriod {
  final int id;
  final String period;
  final List<Map<String, dynamic>> events;

  _RawPeriod({required this.id, required this.period, required this.events});

  factory _RawPeriod.fromJson(Map<String, dynamic> json) => _RawPeriod(
        id: json['id'] as int,
        period: json['period'] as String,
        events: (json['events'] as List<dynamic>? ?? [])
            .map((e) => e as Map<String, dynamic>)
            .toList(),
      );
}

List<SeerahEntry> _flattenPeriods(List<_RawPeriod> periods) {
  final list = <SeerahEntry>[];
  for (final period in periods) {
    for (final event in period.events) {
      list.add(
        SeerahEntry(
          id: event['id'] as int,
          periodId: period.id,
          periodName: period.period,
          title: event['title'] as String,
          titleArabic: event['titleArabic'] as String,
          date: event['date'] as String,
          hijriDate: event['hijriDate'] as String,
          content: (event['description'] as String?) ?? '',
          importance: event['importance'] as String?,
        ),
      );
    }
  }
  return list;
}

Future<List<SeerahEntry>> _getSeerahData() async {
  _seerahCache ??= _flattenPeriods(
    (await loadDataAsync<List<dynamic>>('seerah.json'))
        .map((e) => _RawPeriod.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
  return _seerahCache!;
}

Future<List<SeerahEntry>> getSeerah() => _getSeerahData();

Future<SeerahEntry?> getSeerahEntry(int id) async {
  final data = await _getSeerahData();
  for (final entry in data) {
    if (entry.id == id) return entry;
  }
  return null;
}

Future<List<SeerahEntry>> searchSeerah(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getSeerahData();
  return data
      .where(
        (s) =>
            s.title.toLowerCase().contains(normalized) ||
            s.content.toLowerCase().contains(normalized),
      )
      .toList();
}
