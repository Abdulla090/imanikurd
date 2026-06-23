import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

typedef DataLoader = Future<dynamic> Function(String filename);

DataLoader? _customLoader;
String _baseUrl = 'https://unpkg.com/imanikurd@1.1.1/data/';
final Map<String, dynamic> _cache = {};

/// Override how JSON data files are loaded (e.g. custom CDN or local storage).
void setDataLoader(DataLoader loader) {
  _customLoader = loader;
}

/// Set the remote base URL for fetching data files when bundled assets are unavailable.
void setBaseUrl(String url) {
  _baseUrl = url.endsWith('/') ? url : '$url/';
}

/// Clear the in-memory data cache.
void clearDataCache() {
  _cache.clear();
}

/// Load and cache a JSON data file asynchronously.
Future<T> loadDataAsync<T>(String filename) async {
  if (_cache.containsKey(filename)) {
    return _cache[filename] as T;
  }

  dynamic data;

  if (_customLoader != null) {
    data = await _customLoader!(filename);
  } else {
    try {
      final raw = await rootBundle.loadString('assets/data/$filename');
      data = jsonDecode(raw);
    } catch (_) {
      final response = await http.get(Uri.parse('$_baseUrl$filename'));
      if (response.statusCode != 200) {
        throw StateError(
          'imanikurd: Failed to fetch data file from $_baseUrl$filename (status: ${response.statusCode})',
        );
      }
      data = jsonDecode(response.body);
    }
  }

  _cache[filename] = data;
  return data as T;
}

/// Asset path for a bundled data file.
String getDataAssetPath(String filename) => 'assets/data/$filename';
