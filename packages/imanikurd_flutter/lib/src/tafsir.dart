import 'load_data.dart';
import 'models.dart';

const List<TafsirOption> tafsirOptions = [
  TafsirOption(id: 'rebar', name: 'تەفسیری ڕێبەر', file: 'tafsir_rebar.json'),
  TafsirOption(id: 'asan', name: 'تەفسیری ئاسان', file: 'tafsir_asan.json'),
  TafsirOption(id: 'puxta', name: 'تەفسیری پوختە', file: 'tafsir_puxta.json'),
  TafsirOption(id: 'raman', name: 'تەفسیری ڕامان', file: 'tafsir_raman.json'),
  TafsirOption(id: 'hazhar', name: 'تەفسیری هەژار (مامۆستا هەژار)', file: 'tafsir_hazhar.json'),
  TafsirOption(id: 'zhin', name: 'تەفسیری ژیان', file: 'tafsir_zhin.json'),
  TafsirOption(id: 'sanahi', name: 'تەفسیری سەناهی', file: 'tafsir_sanahi.json'),
  TafsirOption(id: 'maisar', name: 'تەفسیری مویەسەر', file: 'tafsir_maisar.json'),
  TafsirOption(id: 'tawhid', name: 'تەفسیری تەوحیدی', file: 'tafsir_tawhid.json'),
  TafsirOption(id: 'roshn', name: 'تەفسیری ڕۆشن', file: 'tafsir_roshn.json'),
  TafsirOption(id: 'runahi', name: 'تەفسیری ڕوناهی', file: 'tafsir_runahi.json'),
  TafsirOption(id: 'mokhtasar', name: 'تەفسیری موختەسەر', file: 'tafsir_mokhtasar.json'),
  TafsirOption(id: 'krd', name: 'تەفسیری کوردی', file: 'tafsir_krd.json'),
];

final Map<String, List<TafsirEntry>> _tafsirCache = {};

TafsirOption _getTafsirOption(String tafsirId) {
  for (final option in tafsirOptions) {
    if (option.id == tafsirId) return option;
  }
  throw ArgumentError(
    'Unknown tafsir id "$tafsirId". Valid ids: ${tafsirOptions.map((t) => t.id).join(", ")}',
  );
}

Future<List<TafsirEntry>> _loadTafsirRaw(String tafsirId) async {
  if (_tafsirCache.containsKey(tafsirId)) {
    return _tafsirCache[tafsirId]!;
  }

  final file = _getTafsirOption(tafsirId).file;
  final raw = await loadDataAsync<List<dynamic>>(file);
  final entries = raw.map((e) => TafsirEntry.fromJson(e as Map<String, dynamic>)).toList();
  _tafsirCache[tafsirId] = entries;
  return entries;
}

List<TafsirOption> getTafsirOptions() => tafsirOptions;

Future<List<TafsirEntry>> getTafsir(String tafsirId) => _loadTafsirRaw(tafsirId);

Future<String?> getTafsirForAyah(String tafsirId, int surahNumber, int ayahNumber) async {
  final entries = await _loadTafsirRaw(tafsirId);
  for (final entry in entries) {
    if (entry.s == surahNumber && entry.a == ayahNumber) return entry.t;
  }
  return null;
}

Future<Map<int, String>> getTafsirForSurah(String tafsirId, int surahNumber) async {
  final entries = await _loadTafsirRaw(tafsirId);
  final result = <int, String>{};
  for (final entry in entries) {
    if (entry.s == surahNumber) {
      result[entry.a] = entry.t;
    }
  }
  return result;
}

Future<List<TafsirEntry>> searchTafsir(String tafsirId, String query) async {
  final normalized = query.trim();
  if (normalized.isEmpty) return [];
  final entries = await _loadTafsirRaw(tafsirId);
  return entries.where((e) => e.t.contains(normalized)).toList();
}
