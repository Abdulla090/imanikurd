import { useState, useEffect } from "react";

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface AyahWithTranslation extends Ayah {
  translation: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export function useQuran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.alquran.cloud/v1/surah");
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      }
    } catch (err) {
      setError("Failed to fetch surahs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAyah = async (
    surahNumber: number,
    ayahNumber: number
  ): Promise<AyahWithTranslation | null> => {
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`),
        fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`),
      ]);

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      if (arabicData.code === 200 && translationData.code === 200) {
        return {
          ...arabicData.data,
          translation: translationData.data.text,
        };
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch ayah:", err);
      return null;
    }
  };

  const fetchSurahAyahs = async (surahNumber: number): Promise<AyahWithTranslation[]> => {
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
      ]);

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      if (arabicData.code === 200 && translationData.code === 200) {
        return arabicData.data.ayahs.map((ayah: Ayah, index: number) => ({
          ...ayah,
          translation: translationData.data.ayahs[index]?.text || "",
        }));
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch surah ayahs:", err);
      return [];
    }
  };

  return {
    surahs,
    loading,
    error,
    fetchAyah,
    fetchSurahAyahs,
  };
}
