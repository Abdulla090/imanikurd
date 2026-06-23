import 'load_data.dart';
import 'models.dart';

List<Companion>? _companionsCache;

Future<List<Companion>> _getCompanionsData() async {
  _companionsCache ??= (await loadDataAsync<List<dynamic>>('companions.json'))
      .map((e) => Companion.fromJson(e as Map<String, dynamic>))
      .toList();
  return _companionsCache!;
}

Future<List<Companion>> getCompanions() => _getCompanionsData();

Future<Companion?> getCompanion(int id) async {
  final data = await _getCompanionsData();
  for (final companion in data) {
    if (companion.id == id) return companion;
  }
  return null;
}

Future<List<Companion>> searchCompanions(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getCompanionsData();
  return data.where((c) {
    final name = c.name.toLowerCase();
    final arabic = c.arabic ?? '';
    final desc = (c.description ?? '').toLowerCase();
    return name.contains(normalized) ||
        arabic.contains(query.trim()) ||
        desc.contains(normalized);
  }).toList();
}
