import 'load_data.dart';
import 'models.dart';

List<NameOfAllah>? _namesCache;

Future<List<NameOfAllah>> _getNamesData() async {
  _namesCache ??= (await loadDataAsync<List<dynamic>>('names_of_allah.json'))
      .map((e) => NameOfAllah.fromJson(e as Map<String, dynamic>))
      .toList();
  return _namesCache!;
}

Future<List<NameOfAllah>> getNamesOfAllah() => _getNamesData();

Future<NameOfAllah?> getNameOfAllah(int id) async {
  final data = await _getNamesData();
  for (final name in data) {
    if (name.id == id) return name;
  }
  return null;
}

Future<List<NameOfAllah>> searchNamesOfAllah(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getNamesData();
  return data
      .where(
        (n) =>
            n.arabic.contains(query.trim()) ||
            n.kurdish.toLowerCase().contains(normalized) ||
            n.english.toLowerCase().contains(normalized),
      )
      .toList();
}
