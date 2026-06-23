import 'load_data.dart';
import 'models.dart';

List<Hadith>? _hadithCache;

Future<List<Hadith>> _getHadithData() async {
  _hadithCache ??= (await loadDataAsync<List<dynamic>>('hadiths.json'))
      .map((e) => Hadith.fromJson(e as Map<String, dynamic>))
      .toList();
  return _hadithCache!;
}

Future<List<Hadith>> getHadiths() => _getHadithData();

Future<Hadith?> getHadith(int id) async {
  final data = await _getHadithData();
  for (final hadith in data) {
    if (hadith.id == id) return hadith;
  }
  return null;
}

Future<List<Hadith>> searchHadiths(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getHadithData();
  return data
      .where(
        (h) =>
            h.title.toLowerCase().contains(normalized) ||
            h.kurdish.toLowerCase().contains(normalized) ||
            h.arabic.contains(query.trim()),
      )
      .toList();
}

Future<int> getHadithCount() async => (await _getHadithData()).length;
