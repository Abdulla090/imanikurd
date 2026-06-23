import 'models.dart';

String _paddedSurah(int surahNum) => surahNum.toString().padLeft(3, '0');

String _peshawaUrl(int surahNum) =>
    'https://media.githubusercontent.com/media/w-coding/Peshawa-Qadir/main/mp3%20files/${_paddedSurah(surahNum)}.mp3';

String _alafasyUrl(int surahNum) => 'https://server8.mp3quran.net/afs/${_paddedSurah(surahNum)}.mp3';
String _husaryUrl(int surahNum) => 'https://server7.mp3quran.net/husr/${_paddedSurah(surahNum)}.mp3';
String _minshawiUrl(int surahNum) => 'https://server10.mp3quran.net/minsh/${_paddedSurah(surahNum)}.mp3';
String _abdulbasitUrl(int surahNum) => 'https://server7.mp3quran.net/basit/${_paddedSurah(surahNum)}.mp3';
String _sudaisUrl(int surahNum) => 'https://server11.mp3quran.net/sds/${_paddedSurah(surahNum)}.mp3';
String _shuraimUrl(int surahNum) => 'https://server7.mp3quran.net/shur/${_paddedSurah(surahNum)}.mp3';
String _maherUrl(int surahNum) => 'https://server12.mp3quran.net/maher/${_paddedSurah(surahNum)}.mp3';
String _ghamdiUrl(int surahNum) => 'https://server7.mp3quran.net/s_gmd/${_paddedSurah(surahNum)}.mp3';
String _ajamyUrl(int surahNum) => 'https://server10.mp3quran.net/ajm/${_paddedSurah(surahNum)}.mp3';

final List<Qari> qariOptions = [
  Qari(
    id: 'peshawa',
    name: 'پێشەوا قادر (کوردی)',
    nameAr: 'Peshawa Qadir',
    getUrl: _peshawaUrl,
  ),
  Qari(
    id: 'alafasy',
    name: 'مشاری العفاسی',
    nameAr: 'Mishary Alafasy',
    getUrl: _alafasyUrl,
  ),
  Qari(
    id: 'husary',
    name: 'محمود خلیل الحصری',
    nameAr: 'Mahmoud Al-Husary',
    getUrl: _husaryUrl,
  ),
  Qari(
    id: 'minshawi',
    name: 'محمد صدیق المنشاوی',
    nameAr: 'Al-Minshawi',
    getUrl: _minshawiUrl,
  ),
  Qari(
    id: 'abdulbasit',
    name: 'عبدالباسط عبدالصمد',
    nameAr: 'Abdul Basit',
    getUrl: _abdulbasitUrl,
  ),
  Qari(
    id: 'sudais',
    name: 'عبدالرحمن السدیس',
    nameAr: 'Abdulrahman Al-Sudais',
    getUrl: _sudaisUrl,
  ),
  Qari(
    id: 'shuraim',
    name: 'سعود الشریم',
    nameAr: 'Saud Al-Shuraim',
    getUrl: _shuraimUrl,
  ),
  Qari(
    id: 'maher',
    name: 'ماهر المعیقلی',
    nameAr: 'Maher Al-Muaiqly',
    getUrl: _maherUrl,
  ),
  Qari(
    id: 'ghamdi',
    name: 'سعد الغامدی',
    nameAr: 'Saad Al-Ghamdi',
    getUrl: _ghamdiUrl,
  ),
  Qari(
    id: 'ajamy',
    name: 'أحمد العجمی',
    nameAr: 'Ahmed Al-Ajmi',
    getUrl: _ajamyUrl,
  ),
];

List<Qari> getQariOptions() => qariOptions;

String? getRecitationUrl(String qariId, int surahNumber) {
  final qari = getQari(qariId);
  return qari?.getUrl(surahNumber);
}

Qari? getQari(String qariId) {
  for (final qari in qariOptions) {
    if (qari.id == qariId) return qari;
  }
  return null;
}
