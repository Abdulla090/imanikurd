import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';
import 'package:imanikurd/imanikurd.dart';

void main() {
  final dataDir = Directory('assets/data');

  setUpAll(() {
    setDataLoader((filename) async {
      final file = File('${dataDir.path}/$filename');
      final contents = await file.readAsString();
      return jsonDecode(contents);
    });
  });

  tearDown(clearDataCache);

  test('getSurahs returns 114 surahs', () async {
    final surahs = await getSurahs();
    expect(surahs.length, 114);
  });

  test('getTotalAyahCount returns 6236', () async {
    final count = await getTotalAyahCount();
    expect(count, 6236);
  });

  test('calculateQibla returns valid bearing', () {
    final direction = calculateQibla(36.19, 44.01);
    expect(direction, greaterThanOrEqualTo(0));
    expect(direction, lessThan(360));
  });

  test('getDhikrCategories returns categories', () async {
    final categories = await getDhikrCategories();
    expect(categories, isNotEmpty);
  });

  test('getNamesOfAllah returns 99 names', () async {
    final names = await getNamesOfAllah();
    expect(names.length, 99);
  });

  test('getPrayerCities returns Kurdistan cities', () async {
    final cities = await getPrayerCities();
    expect(cities, contains('Hawler'));
  });

  test('getHadithCount returns hadiths', () async {
    final count = await getHadithCount();
    expect(count, greaterThan(0));
  });
}
