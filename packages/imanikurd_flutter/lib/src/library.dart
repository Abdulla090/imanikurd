import 'load_data.dart';
import 'models.dart';

List<LibraryItem>? _libraryCache;

Future<List<LibraryItem>> _getLibraryData() async {
  if (_libraryCache != null) return _libraryCache!;
  final raw = await loadDataAsync<Map<String, dynamic>>('library.json');
  final books = raw['books'] as List<dynamic>? ?? [];
  _libraryCache = books.map((e) => LibraryItem.fromJson(e as Map<String, dynamic>)).toList();
  return _libraryCache!;
}

Future<List<LibraryItem>> getLibrary() => _getLibraryData();

Future<LibraryItem?> getLibraryItem(int id) async {
  final data = await _getLibraryData();
  for (final item in data) {
    if (item.id == id) return item;
  }
  return null;
}

Future<List<LibraryItem>> searchLibrary(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getLibraryData();
  return data
      .where(
        (item) =>
            item.title.toLowerCase().contains(normalized) ||
            (item.author ?? '').toLowerCase().contains(normalized),
      )
      .toList();
}
