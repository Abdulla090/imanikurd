import 'models.dart';

const List<City> kurdistanCities = [
  City(key: 'Hawler', name: 'Erbil', nameKurdish: 'هەولێر', lat: 36.19, lng: 44.01, radius: 0.4),
  City(key: 'Slemani', name: 'Sulaymaniyah', nameKurdish: 'سلێمانی', lat: 35.56, lng: 45.44, radius: 0.4),
  City(key: 'Duhok', name: 'Duhok', nameKurdish: 'دهۆک', lat: 36.87, lng: 42.99, radius: 0.4),
  City(key: 'Kirkuk', name: 'Kirkuk', nameKurdish: 'کەرکوک', lat: 35.47, lng: 44.39, radius: 0.4),
  City(key: 'Zakho', name: 'Zakho', nameKurdish: 'زاخۆ', lat: 37.15, lng: 42.68, radius: 0.3),
  City(key: 'Halabja', name: 'Halabja', nameKurdish: 'ھەڵەبجە', lat: 35.18, lng: 45.98, radius: 0.3),
  City(key: 'Koya', name: 'Koya', nameKurdish: 'کۆیە', lat: 36.08, lng: 44.63, radius: 0.3),
  City(key: 'Akre', name: 'Akre', nameKurdish: 'ئاکرێ', lat: 36.74, lng: 43.88, radius: 0.3),
  City(key: 'Qaladze', name: 'Qaladze', nameKurdish: 'قەڵادزێ', lat: 36.18, lng: 45.11, radius: 0.3),
  City(key: 'Darbandikhan', name: 'Darbandikhan', nameKurdish: 'دەربەندیخان', lat: 35.11, lng: 45.69, radius: 0.3),
  City(key: 'Soran', name: 'Soran', nameKurdish: 'سۆران', lat: 36.65, lng: 44.54, radius: 0.3),
  City(key: 'Choman', name: 'Choman', nameKurdish: 'چۆمان', lat: 36.63, lng: 44.89, radius: 0.3),
  City(key: 'Penjwin', name: 'Penjwin', nameKurdish: 'پێنجوێن', lat: 35.62, lng: 45.94, radius: 0.3),
  City(key: 'Shaqlawa', name: 'Shaqlawa', nameKurdish: 'شەقڵاوە', lat: 36.4, lng: 44.32, radius: 0.3),
  City(key: 'Rawanduz', name: 'Rawanduz', nameKurdish: 'ڕەواندز', lat: 36.61, lng: 44.52, radius: 0.3),
  City(key: 'Ranya', name: 'Ranya', nameKurdish: 'ڕانیە', lat: 36.25, lng: 44.88, radius: 0.3),
  City(key: 'Kifri', name: 'Kifri', nameKurdish: 'کفری', lat: 34.69, lng: 44.96, radius: 0.3),
  City(key: 'Chamchamal', name: 'Chamchamal', nameKurdish: 'چەمچەماڵ', lat: 35.53, lng: 44.83, radius: 0.3),
  City(key: 'Kalar', name: 'Kalar', nameKurdish: 'کەلار', lat: 34.63, lng: 45.32, radius: 0.3),
  City(key: 'Baghdad', name: 'Baghdad', nameKurdish: 'بەغدا', lat: 33.31, lng: 44.36, radius: 0.5),
  City(key: 'Mosul', name: 'Mosul', nameKurdish: 'موسڵ', lat: 36.34, lng: 43.13, radius: 0.5),
  City(key: 'Basra', name: 'Basra', nameKurdish: 'بەسرە', lat: 30.5, lng: 47.81, radius: 0.5),
];

final Map<String, String> _cityDisplay = {
  for (final city in kurdistanCities) city.key: city.nameKurdish,
};

City getCityByCoordinates(double lat, double lng) {
  City closest = kurdistanCities.last;
  var minDistance = double.infinity;

  for (final city in kurdistanCities) {
    final distance = _distance(lat, lng, city.lat, city.lng);
    if (distance <= city.radius && distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  if (minDistance == double.infinity) {
    return kurdistanCities.firstWhere((c) => c.key == 'Hawler');
  }

  return closest;
}

String getCityDisplayName(String cityKey) => _cityDisplay[cityKey] ?? cityKey;

City? getCity(String cityKey) {
  for (final city in kurdistanCities) {
    if (city.key == cityKey) return city;
  }
  return null;
}

double _distance(double lat1, double lng1, double lat2, double lng2) {
  final dLat = lat1 - lat2;
  final dLng = lng1 - lng2;
  return (dLat * dLat) + (dLng * dLng);
}
