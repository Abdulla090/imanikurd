class Surah {
  final int number;
  final String name;
  final String englishName;
  final String englishNameTranslation;
  final int numberOfAyahs;
  final String revelationType;
  final String? kurdishName;
  final String? place;
  final String? juz;
  final String? audioLink;
  final int? startPage;
  final int? endPage;
  final String? suraNameFormatted;

  const Surah({
    required this.number,
    required this.name,
    required this.englishName,
    required this.englishNameTranslation,
    required this.numberOfAyahs,
    required this.revelationType,
    this.kurdishName,
    this.place,
    this.juz,
    this.audioLink,
    this.startPage,
    this.endPage,
    this.suraNameFormatted,
  });

  factory Surah.fromJson(Map<String, dynamic> json) => Surah(
        number: json['number'] as int,
        name: json['name'] as String,
        englishName: json['englishName'] as String,
        englishNameTranslation: json['englishNameTranslation'] as String,
        numberOfAyahs: json['numberOfAyahs'] as int,
        revelationType: json['revelationType'] as String,
        kurdishName: json['kurdishName'] as String?,
        place: json['place'] as String?,
        juz: json['juz'] as String?,
        audioLink: json['audioLink'] as String?,
        startPage: json['startPage'] as int?,
        endPage: json['endPage'] as int?,
        suraNameFormatted: json['suraNameFormatted'] as String?,
      );
}

class Ayah {
  final int surah;
  final int ayah;
  final String text;
  final int juz;
  final int page;
  final String? audioLink;

  const Ayah({
    required this.surah,
    required this.ayah,
    required this.text,
    required this.juz,
    required this.page,
    this.audioLink,
  });

  factory Ayah.fromJson(Map<String, dynamic> json) => Ayah(
        surah: json['surah'] as int,
        ayah: json['ayah'] as int,
        text: json['text'] as String,
        juz: json['juz'] as int,
        page: json['page'] as int,
        audioLink: json['audioLink'] as String?,
      );

  Ayah copyWith({String? tafsir}) => Ayah(
        surah: surah,
        ayah: ayah,
        text: text,
        juz: juz,
        page: page,
        audioLink: audioLink,
      );
}

class AyahWithTafsir extends Ayah {
  final String? tafsir;

  const AyahWithTafsir({
    required super.surah,
    required super.ayah,
    required super.text,
    required super.juz,
    required super.page,
    super.audioLink,
    this.tafsir,
  });

  factory AyahWithTafsir.fromAyah(Ayah ayah, {String? tafsir}) => AyahWithTafsir(
        surah: ayah.surah,
        ayah: ayah.ayah,
        text: ayah.text,
        juz: ayah.juz,
        page: ayah.page,
        audioLink: ayah.audioLink,
        tafsir: tafsir,
      );
}

class QuranMetadata {
  final int totalSurahs;
  final int totalAyahs;
  final String source;

  const QuranMetadata({
    required this.totalSurahs,
    required this.totalAyahs,
    required this.source,
  });

  factory QuranMetadata.fromJson(Map<String, dynamic> json) => QuranMetadata(
        totalSurahs: json['totalSurahs'] as int,
        totalAyahs: json['totalAyahs'] as int,
        source: json['source'] as String,
      );
}

class QuranData {
  final QuranMetadata metadata;
  final List<Surah> surahs;
  final List<Ayah> ayahs;

  const QuranData({
    required this.metadata,
    required this.surahs,
    required this.ayahs,
  });

  factory QuranData.fromJson(Map<String, dynamic> json) => QuranData(
        metadata: QuranMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
        surahs: (json['surahs'] as List<dynamic>)
            .map((e) => Surah.fromJson(e as Map<String, dynamic>))
            .toList(),
        ayahs: (json['ayahs'] as List<dynamic>)
            .map((e) => Ayah.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class TafsirEntry {
  final int s;
  final int a;
  final String t;

  const TafsirEntry({required this.s, required this.a, required this.t});

  factory TafsirEntry.fromJson(Map<String, dynamic> json) => TafsirEntry(
        s: json['s'] is String ? int.parse(json['s'] as String) : json['s'] as int,
        a: json['a'] as int,
        t: json['t'] as String,
      );
}

class TafsirOption {
  final String id;
  final String name;
  final String file;

  const TafsirOption({required this.id, required this.name, required this.file});
}

class PrayerTimings {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;

  const PrayerTimings({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
  });
}

class DayPrayerRecord {
  final String date;
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;

  const DayPrayerRecord({
    required this.date,
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
  });

  factory DayPrayerRecord.fromJson(Map<String, dynamic> json) => DayPrayerRecord(
        date: json['date'] as String,
        fajr: json['fajr'] as String,
        sunrise: json['sunrise'] as String,
        dhuhr: json['dhuhr'] as String,
        asr: json['asr'] as String,
        maghrib: json['maghrib'] as String,
        isha: json['isha'] as String,
      );

  PrayerTimings toTimings() => PrayerTimings(
        fajr: fajr,
        sunrise: sunrise,
        dhuhr: dhuhr,
        asr: asr,
        maghrib: maghrib,
        isha: isha,
      );
}

class NextPrayer {
  final String name;
  final String time;
  final int hoursUntil;
  final int minutesUntil;

  const NextPrayer({
    required this.name,
    required this.time,
    required this.hoursUntil,
    required this.minutesUntil,
  });
}

class DhikrCategory {
  final int id;
  final String name;

  const DhikrCategory({required this.id, required this.name});

  factory DhikrCategory.fromJson(Map<String, dynamic> json) => DhikrCategory(
        id: json['id'] as int,
        name: json['name'] as String,
      );
}

class DhikrItem {
  final int id;
  final int categoryId;
  final String arabic;
  final String kurdish;
  final int count;

  const DhikrItem({
    required this.id,
    required this.categoryId,
    required this.arabic,
    required this.kurdish,
    required this.count,
  });

  factory DhikrItem.fromJson(Map<String, dynamic> json) => DhikrItem(
        id: json['id'] as int,
        categoryId: json['categoryId'] as int,
        arabic: json['arabic'] as String,
        kurdish: json['kurdish'] as String,
        count: json['count'] as int,
      );
}

class DhikrData {
  final List<DhikrCategory> categories;
  final List<DhikrItem> items;

  const DhikrData({required this.categories, required this.items});

  factory DhikrData.fromJson(Map<String, dynamic> json) => DhikrData(
        categories: (json['categories'] as List<dynamic>)
            .map((e) => DhikrCategory.fromJson(e as Map<String, dynamic>))
            .toList(),
        items: (json['items'] as List<dynamic>)
            .map((e) => DhikrItem.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

class Hadith {
  final int id;
  final String title;
  final String arabic;
  final String kurdish;
  final bool? isFavorite;

  const Hadith({
    required this.id,
    required this.title,
    required this.arabic,
    required this.kurdish,
    this.isFavorite,
  });

  factory Hadith.fromJson(Map<String, dynamic> json) => Hadith(
        id: json['id'] as int,
        title: json['title'] as String,
        arabic: json['arabic'] as String,
        kurdish: json['kurdish'] as String,
        isFavorite: json['isFavorite'] as bool?,
      );
}

class NameOfAllah {
  final int id;
  final String arabic;
  final String kurdish;
  final String english;

  const NameOfAllah({
    required this.id,
    required this.arabic,
    required this.kurdish,
    required this.english,
  });

  factory NameOfAllah.fromJson(Map<String, dynamic> json) => NameOfAllah(
        id: json['id'] as int,
        arabic: json['arabic'] as String,
        kurdish: json['kurdish'] as String,
        english: json['english'] as String,
      );
}

class Qari {
  final String id;
  final String name;
  final String nameAr;
  final String Function(int surahNumber) getUrl;

  const Qari({
    required this.id,
    required this.name,
    required this.nameAr,
    required this.getUrl,
  });
}

class City {
  final String key;
  final String name;
  final String nameKurdish;
  final double lat;
  final double lng;
  final double radius;

  const City({
    required this.key,
    required this.name,
    required this.nameKurdish,
    required this.lat,
    required this.lng,
    required this.radius,
  });
}

class Coordinates {
  final double lat;
  final double lng;

  const Coordinates({required this.lat, required this.lng});
}

class QiblaResult {
  final int direction;
  final Coordinates kaaba;
  final Coordinates from;

  const QiblaResult({
    required this.direction,
    required this.kaaba,
    required this.from,
  });
}

class Companion {
  final int id;
  final String name;
  final String? arabic;
  final String? description;
  final Map<String, dynamic> extra;

  const Companion({
    required this.id,
    required this.name,
    this.arabic,
    this.description,
    this.extra = const {},
  });

  factory Companion.fromJson(Map<String, dynamic> json) {
    final copy = Map<String, dynamic>.from(json);
    final id = copy.remove('id') as int;
    final name = copy.remove('name') as String;
    final arabic = copy.remove('arabic') as String?;
    final description = copy.remove('description') as String?;
    return Companion(
      id: id,
      name: name,
      arabic: arabic,
      description: description,
      extra: copy,
    );
  }
}

class SeerahEntry {
  final int id;
  final int periodId;
  final String periodName;
  final String title;
  final String titleArabic;
  final String date;
  final String hijriDate;
  final String content;
  final String? importance;

  const SeerahEntry({
    required this.id,
    required this.periodId,
    required this.periodName,
    required this.title,
    required this.titleArabic,
    required this.date,
    required this.hijriDate,
    required this.content,
    this.importance,
  });
}

class LibraryItem {
  final int id;
  final String title;
  final String? author;
  final String? url;
  final String? description;
  final Map<String, dynamic> extra;

  const LibraryItem({
    required this.id,
    required this.title,
    this.author,
    this.url,
    this.description,
    this.extra = const {},
  });

  factory LibraryItem.fromJson(Map<String, dynamic> json) {
    final copy = Map<String, dynamic>.from(json);
    final id = copy.remove('id') as int;
    final title = copy.remove('title') as String;
    final author = copy.remove('author') as String?;
    final url = copy.remove('url') as String?;
    final description = copy.remove('description') as String?;
    return LibraryItem(
      id: id,
      title: title,
      author: author,
      url: url,
      description: description,
      extra: copy,
    );
  }
}

class MonthlyPrayerDay {
  final DateTime date;
  final int day;
  final int month;
  final PrayerTimings timings;

  const MonthlyPrayerDay({
    required this.date,
    required this.day,
    required this.month,
    required this.timings,
  });
}

class DailyPrayerRecordWithTimings extends DayPrayerRecord {
  final PrayerTimings timings;

  const DailyPrayerRecordWithTimings({
    required super.date,
    required super.fajr,
    required super.sunrise,
    required super.dhuhr,
    required super.asr,
    required super.maghrib,
    required super.isha,
    required this.timings,
  });
}

class DhikrCategoryWithItems {
  final DhikrCategory category;
  final List<DhikrItem> items;

  const DhikrCategoryWithItems({required this.category, required this.items});
}
