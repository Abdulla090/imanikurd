import 'load_data.dart';
import 'models.dart';

QuranData? _quranCache;

Future<QuranData> _getQuranData() async {
  _quranCache ??= QuranData.fromJson(
    await loadDataAsync<Map<String, dynamic>>('quran.json'),
  );
  return _quranCache!;
}

Future<QuranMetadata> getQuranMetadata() async => (await _getQuranData()).metadata;

Future<List<Surah>> getSurahs() async => (await _getQuranData()).surahs;

Future<Surah?> getSurah(int surahNumber) async {
  final surahs = await getSurahs();
  for (final surah in surahs) {
    if (surah.number == surahNumber) return surah;
  }
  return null;
}

Future<List<Ayah>> getSurahAyahs(int surahNumber) async {
  final data = await _getQuranData();
  return data.ayahs.where((a) => a.surah == surahNumber).toList();
}

Future<Ayah?> getAyah(int surahNumber, int ayahNumber) async {
  final data = await _getQuranData();
  for (final ayah in data.ayahs) {
    if (ayah.surah == surahNumber && ayah.ayah == ayahNumber) return ayah;
  }
  return null;
}

Future<List<Ayah>> getFullQuran() async => (await _getQuranData()).ayahs;

Future<List<Ayah>> getJuzAyahs(int juzNumber) async {
  final data = await _getQuranData();
  return data.ayahs.where((a) => a.juz == juzNumber).toList();
}

Future<List<Ayah>> getPageAyahs(int pageNumber) async {
  final data = await _getQuranData();
  return data.ayahs.where((a) => a.page == pageNumber).toList();
}

Future<List<Ayah>> searchQuran(String query) async {
  final normalized = query.trim();
  if (normalized.isEmpty) return [];
  final data = await _getQuranData();
  return data.ayahs.where((a) => a.text.contains(normalized)).toList();
}

Future<int> getTotalAyahCount() async => (await _getQuranData()).ayahs.length;

List<AyahWithTafsir> attachTafsir(List<Ayah> ayahs, Map<int, String> tafsirMap) {
  return ayahs
      .map((a) => AyahWithTafsir.fromAyah(a, tafsir: tafsirMap[a.ayah]))
      .toList();
}
