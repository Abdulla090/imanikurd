// Quran Types

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface AyahWithTranslation {
    number: number;
    text: string;
    numberInSurah: number;
    translation: string;
    tafsir?: string;
}

export interface TafsirData {
    [surahNum: number]: {
        [ayahNum: number]: string;
    };
}

export interface Qari {
    id: string;
    name: string;
    nameAr: string;
    getUrl: (surahNum: number) => string;
}

export interface TafsirOption {
    id: string;
    name: string;
}
