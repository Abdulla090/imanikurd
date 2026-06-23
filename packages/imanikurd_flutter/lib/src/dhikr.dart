import 'load_data.dart';
import 'models.dart';

DhikrData? _dhikrCache;

Future<DhikrData> _getDhikrData() async {
  _dhikrCache ??= DhikrData.fromJson(
    await loadDataAsync<Map<String, dynamic>>('dhikr.json'),
  );
  return _dhikrCache!;
}

Future<List<DhikrCategory>> getDhikrCategories() async => (await _getDhikrData()).categories;

Future<List<DhikrItem>> getDhikrItems() async => (await _getDhikrData()).items;

Future<List<DhikrItem>> getDhikrByCategory(int categoryId) async {
  final data = await _getDhikrData();
  return data.items.where((item) => item.categoryId == categoryId).toList();
}

Future<DhikrItem?> getDhikrById(int id) async {
  final data = await _getDhikrData();
  for (final item in data.items) {
    if (item.id == id) return item;
  }
  return null;
}

Future<List<DhikrItem>> searchDhikr(String query) async {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return [];
  final data = await _getDhikrData();
  return data.items
      .where(
        (item) =>
            item.kurdish.toLowerCase().contains(normalized) ||
            item.arabic.contains(query.trim()),
      )
      .toList();
}

Future<DhikrCategoryWithItems?> getDhikrCategoryWithItems(int categoryId) async {
  final data = await _getDhikrData();
  DhikrCategory? category;
  for (final c in data.categories) {
    if (c.id == categoryId) {
      category = c;
      break;
    }
  }
  if (category == null) return null;
  return DhikrCategoryWithItems(
    category: category,
    items: data.items.where((item) => item.categoryId == categoryId).toList(),
  );
}
