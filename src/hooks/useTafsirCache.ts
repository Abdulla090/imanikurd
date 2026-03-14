import { useState, useEffect, useRef, useCallback } from "react";
import { TafsirData } from "@/components/quran/types";
import { TAFSIR_OPTIONS } from "@/components/quran/constants";
import { toast } from "sonner";

// In-memory cache — persists across component mounts within the same session
// Full parsed tafsir for each tafsir ID
const tafsirCache = new Map<string, TafsirData>();

// Raw JSON cache — avoid re-downloading when user switches tafsirs back and forth
const rawJsonCache = new Map<string, any[]>();

/**
 * Parse tafsir entries for a SINGLE surah from the raw array.
 * This is very fast (< 5ms) since we only loop once and filter.
 */
function parseSurahTafsir(rawData: any[], surahNumber: number): TafsirData {
    const result: TafsirData = {};
    result[surahNumber] = {};

    for (let i = 0; i < rawData.length; i++) {
        const item = rawData[i];
        const s = typeof item.s === "string" ? parseInt(item.s, 10) : item.s;
        if (s === surahNumber) {
            result[surahNumber][item.a] = item.t;
        }
    }

    return result;
}

/**
 * Parse ALL surahs from the raw array — used for background caching.
 * Runs in chunked batches so it doesn't block the main thread.
 */
function parseFullTafsirChunked(
    rawData: any[],
    onComplete: (data: TafsirData) => void
) {
    const parsedData: TafsirData = {};
    const chunkSize = 3000; // entries per frame
    let index = 0;
    let cancelled = false;

    function processChunk() {
        if (cancelled) return;

        const end = Math.min(index + chunkSize, rawData.length);
        for (let i = index; i < end; i++) {
            const item = rawData[i];
            const surahNum =
                typeof item.s === "string" ? parseInt(item.s, 10) : item.s;
            if (!parsedData[surahNum]) parsedData[surahNum] = {};
            parsedData[surahNum][item.a] = item.t;
        }
        index = end;

        if (index < rawData.length) {
            // Yield to main thread, process next chunk after browser has time to paint
            requestAnimationFrame(processChunk);
        } else {
            onComplete(parsedData);
        }
    }

    // Start processing after a short delay to let the UI settle
    requestAnimationFrame(processChunk);

    return () => {
        cancelled = true;
    };
}

function pickSingleSurah(data: TafsirData, surahNumber?: number | null): TafsirData {
    if (!surahNumber || !data[surahNumber]) return {};
    return { [surahNumber]: data[surahNumber] };
}

export function useTafsirCache(prioritySurah?: number | null) {
    const [tafsirData, setTafsirData] = useState<TafsirData>({});
    const [tafsirLoaded, setTafsirLoaded] = useState(false);
    const [selectedTafsir, setSelectedTafsir] = useState("rebar");
    const loadingRef = useRef(false);
    const abortRef = useRef<AbortController | null>(null);
    const currentTafsirRef = useRef<string>("");
    const cancelBackgroundParseRef = useRef<(() => void) | null>(null);

    const loadTafsirJSON = useCallback(
        async (tafsirId: string, currentSurah?: number | null) => {
            // Cancel any in-flight request
            if (loadingRef.current) {
                abortRef.current?.abort();
            }
            // Cancel any background parse for the previous tafsir selection
            cancelBackgroundParseRef.current?.();
            cancelBackgroundParseRef.current = null;

            currentTafsirRef.current = tafsirId;

            // 1) Full cache hit → instant switch, all surahs available
            if (tafsirCache.has(tafsirId)) {
                const cached = tafsirCache.get(tafsirId)!;
                setTafsirData(pickSingleSurah(cached, currentSurah));
                setTafsirLoaded(true);
                localStorage.setItem("selected-tafsir-id", tafsirId);
                return;
            }

            loadingRef.current = true;
            setTafsirLoaded(false);

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                let rawData: any[];

                // 2) Check if we already have the raw JSON cached (avoids re-download inside the current session)
                if (rawJsonCache.has(tafsirId)) {
                    rawData = rawJsonCache.get(tafsirId)!;
                } else {
                    const cacheName = "tafsir-network-cache-v1";
                    const url = `/data/tafsir_${tafsirId}.json`;
                    
                    try {
                        const cache = await caches.open(cacheName);
                        let response = await cache.match(url);
                        
                        if (!response) {
                            response = await fetch(url, { signal: controller.signal });
                            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                            // Clone before using since body can only be read once
                            cache.put(url, response.clone());
                        }
                        
                        rawData = await response.json();
                    } catch (e: any) {
                        if (e.name === "AbortError") throw e;
                        // Fallback if Cache API fails
                        const response = await fetch(url, { signal: controller.signal });
                        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                        rawData = await response.json();
                    }

                    // Cache raw JSON in memory for this session
                    rawJsonCache.set(tafsirId, rawData);
                }

                if (controller.signal.aborted) return;

                // 3) FAST PATH: Parse only the current surah first (< 5ms)
                //    This lets the user see tafsir content almost immediately
                if (currentSurah && currentSurah > 0) {
                    const partialData = parseSurahTafsir(rawData, currentSurah);
                    if (currentTafsirRef.current === tafsirId) {
                        setTafsirData(partialData);
                        setTafsirLoaded(true);
                    }
                } else {
                    // No active surah selected yet, but tafsir file is ready.
                    setTafsirLoaded(true);
                }

                // 4) BACKGROUND: Parse the full dataset in non-blocking chunks
                //    This fills the global cache without forcing a huge UI state update.
                cancelBackgroundParseRef.current = parseFullTafsirChunked(rawData, (fullData) => {
                    // Only update if this tafsir is still the active one
                    if (currentTafsirRef.current === tafsirId) {
                        tafsirCache.set(tafsirId, fullData);
                        setTafsirLoaded(true);
                    }
                });

                toast.success("تەفسیر بارکرا", {
                    description: TAFSIR_OPTIONS.find((t) => t.id === tafsirId)?.name,
                    duration: 1000,
                });
                localStorage.setItem("selected-tafsir-id", tafsirId);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Failed to load tafsir:", err);
                    toast.error("هەڵە لە بارکردنی تەفسیر");
                }
            } finally {
                loadingRef.current = false;
            }
        },
        []
    );

    // Initial load
    useEffect(() => {
        const saved = localStorage.getItem("selected-tafsir-id");
        const validIds = TAFSIR_OPTIONS.map((t) => t.id);
        const validSaved = saved && validIds.includes(saved) ? saved : "rebar";

        if (validSaved !== saved) {
            localStorage.removeItem("selected-tafsir-id");
        }

        setSelectedTafsir(validSaved);
        loadTafsirJSON(validSaved, prioritySurah);
    }, [loadTafsirJSON]); // eslint-disable-line react-hooks/exhaustive-deps

    // Watch for tafsir selection change
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        loadTafsirJSON(selectedTafsir, prioritySurah);
    }, [selectedTafsir, loadTafsirJSON, prioritySurah]);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
            cancelBackgroundParseRef.current?.();
        };
    }, []);

    return {
        tafsirData,
        tafsirLoaded,
        selectedTafsir,
        setSelectedTafsir,
        /** Call this when the user selects a new surah to prioritize parsing it first */
        loadForSurah: useCallback(
            (surahNum: number) => {
                // If full cache exists, hydrate only the requested surah into state.
                if (tafsirCache.has(selectedTafsir)) {
                    const cached = tafsirCache.get(selectedTafsir)!;
                    const surahOnly = pickSingleSurah(cached, surahNum);
                    if (surahOnly[surahNum]) {
                        setTafsirData(surahOnly);
                    }
                    return;
                }

                // If raw data is available but full parse isn't done yet,
                // quickly extract just this surah
                if (rawJsonCache.has(selectedTafsir)) {
                    const rawData = rawJsonCache.get(selectedTafsir)!;
                    const partial = parseSurahTafsir(rawData, surahNum);
                    setTafsirData(partial);
                    setTafsirLoaded(true);
                }
            },
            [selectedTafsir]
        ),
    };
}
