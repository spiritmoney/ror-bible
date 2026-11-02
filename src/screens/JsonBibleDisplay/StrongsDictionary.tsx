// src/components/StrongDictionaryPopup.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { condordanceResultAtom, selectedStrongsMeaning } from "store/atoms/general";

type DictEntry = {
  strongNumber: string;
  langWord?: string;
  phon?: string;
  meaning?: string;
  dictLinkH?: string;
  dictLinkG?: string;
  dictLink?: string;
  raw?: any;
};

export type ConcordanceItem = {
  [x: string]: string | undefined;
  bibleLink?: string;
  transLink?: string;
  trans?: string;
  snippet?: string;
  raw?: any;
};

type Props = {
  isOpen: boolean;
  position?: { top: number; left: number };
  selectedCode?: string;
  title?: string;
  onClose: () => void;
  onConcordanceResults?: (results: ConcordanceItem[]) => void;
};

const showDebug = false;

/* -------------------- Helpers -------------------- */

/** Normalize strong tokens like "G0001." or "[H0175]" -> "g0001" */
const normalizeStrong = (s?: string) =>
  String(s ?? "")
    .toLowerCase()
    .match(/[gh]\d+/)?.[0] ?? String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* Cached JSON fetch helper */
const fetchJsonCached = (() => {
  const cache = new Map<string, any>();
  return async (url: string) => {
    if (cache.has(url)) return cache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch ${url} failed ${res.status}`);
    const j = await res.json();
    cache.set(url, j);
    return j;
  };
})();

/* -------------------- Dictionary + Audio hooks -------------------- */

const useDictionary = (filePath?: string) => {
  const [entries, setEntries] = useState<DictEntry[] | null>(null);

  useEffect(() => {
    if (!filePath) return;
    let mounted = true;
    fetch(filePath)
      .then((r) => r.json())
      .then((data) => {
        const names = data.dictionary?.name || [];
        const allKeynums: any[] = [];
        names.forEach((group: any) => {
          if (Array.isArray(group.keynum)) allKeynums.push(...group.keynum);
          else if (group.keynum) allKeynums.push(group.keynum);
        });

        const mapped: DictEntry[] = allKeynums.map((k: any) => {
          const strongNumRaw = k.strongNumber || "";
          const strongNum = strongNumRaw.replace(/\.$/, "").toLowerCase();
          let meaningText = "";
          if (k.meaning) {
            meaningText = typeof k.meaning === "object" ? k.meaning.__text ?? "" : k.meaning;
          }
          return {
            strongNumber: strongNum,
            langWord: k.langWord || "",
            phon: k.phon || "",
            meaning: meaningText,
            dictLink: k.dictLink || "",
            dictLinkG: k.dictLinkG || "",
            dictLinkH: k.dictLinkH || "",
            raw: k,
          };
        });

        if (mounted) setEntries(mapped);
      })
      .catch((e) => {
        console.error("dictionary load error", filePath, e);
        if (mounted) setEntries([]);
      });

    return () => {
      mounted = false;
    };
  }, [filePath]);

  return entries;
};

const useAudioMap = (jsonPath = "/HebrewGreekRes/json/audioPronunciation.json") => {
  const [map, setMap] = useState<any>({});
  useEffect(() => {
    let mounted = true;
    fetch(jsonPath)
      .then((r) => r.json())
      .then((m) => {
        if (!mounted) return;
        setMap(m || {});
        if (showDebug) console.log("[AUDIO_MAP] keys:", Object.keys(m || {}));
      })
      .catch((e) => {
        console.warn("audio map load failed", e);
        if (mounted) setMap({});
      });
    return () => {
      mounted = false;
    };
  }, [jsonPath]);
  return map;
};

/* -------------------- Concordance hook (JSON index + per-letter files) -------------------- */
function useConcordanceJson() {
  const INDEX_URL = "/HebrewGreekRes/json/concordanceIndex.json";
  const LETTER_ROOT = "/HebrewGreekRes/json"; // e.g. /.../A.json

  const [index, setIndex] = useState<Record<string, Array<{ letter: string; idx: number }>> | null>(null);
  const [allResults, setAllResults] = useState<ConcordanceItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const letterCache = useRef(new Map<string, ConcordanceItem[]>());
  // NEW: set recoil from here
  const setConcordanceRecoil = useSetRecoilState(condordanceResultAtom);


  useEffect(() => {
    let mounted = true;
    fetchJsonCached(INDEX_URL)
      .then((j) => {
        if (mounted) setIndex(j || {});
      })
      .catch(() => {
        if (mounted) setIndex({});
      });
    return () => {
      mounted = false;
    };
  }, []);

  const loadLetter = async (L: string) => {
    const key = L.toUpperCase();
    if (letterCache.current.has(key)) return letterCache.current.get(key)!;
    try {
      const arr = await fetchJsonCached(`${LETTER_ROOT}/${key}.json`).catch(() => []);
      letterCache.current.set(key, arr || []);
      return arr || [];
    } catch {
      letterCache.current.set(key, []);
      return [];
    }
  };

  const loadByStrong = async (strong: string) => {
    setLoading(true);
    setAllResults([]);
    setVisibleCount(10);
    try {
      const key = normalizeStrong(strong);
      if (!key) {
        setAllResults([]);
        return;
      }
      const positions = (index && index[key]) || [];

      if (positions.length) {
        // group by letter to minimize fetches
        const byLetter: Record<string, number[]> = {};
        positions.forEach((p) => {
          byLetter[p.letter] = byLetter[p.letter] || [];
          byLetter[p.letter].push(p.idx);
        });

        const out: ConcordanceItem[] = [];
        for (const L of Object.keys(byLetter)) {
          const arr = await loadLetter(L);
          for (const idx of byLetter[L]) {
            if (arr[idx]) out.push(arr[idx]);
          }
        }
        setAllResults(out);
      } else {
        // fallback: use letter from strong (G/H)
        const fallback = key[0]?.toUpperCase() ?? "A";
        const arr = await loadLetter(fallback);
        const filtered = (arr || []).filter((it: any) => {
          const t = (it?.trans || it?.transLink || "").toString().toLowerCase();
          return t === key || t.includes(key);
        });
        setAllResults(filtered);
        setConcordanceRecoil(filtered)
      }
    } catch (err) {
      console.error("concordance load error", err);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => setVisibleCount((v) => Math.min(allResults.length, v + 10));
  const reset = () => {
    setAllResults([]);
    setVisibleCount(10);
  };

  return {
    results: allResults.slice(0, visibleCount),
    allResults,
    visibleCount,
    loading,
    loadByStrong,
    loadMore,
    reset,
  };
}

/* -------------------- Main component -------------------- */

export default function StrongDictionaryPopup({
  isOpen,
  position,
  selectedCode,
  title = "Enhanced Strong's Dictionary",
  onClose,
  onConcordanceResults,
}: Props) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const greek = useDictionary("/HebrewGreekRes/json/greekDictionary.json");
  const hebrew = useDictionary("/HebrewGreekRes/json/hebrewDictionary.json");
  const audioMap = useAudioMap("/HebrewGreekRes/json/audioPronunciation.json");
  const [selectedCodeMeaning, setSelectedCodeMeaning] = useRecoilState(selectedStrongsMeaning);

  const [currentEntry, setCurrentEntry] = useState<DictEntry | null>(null);

  // concordance
  const concordance = useConcordanceJson();
  const [showConcordance, setShowConcordance] = useState(false);

  /* Audio playback state */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  const [pushConcordResults, setPushCordResults] = useRecoilState<ConcordanceItem[] | null>(condordanceResultAtom);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
    }
    const audio = audioRef.current;

    const onPlay = () => setIsPlayingAudio(true);
    const onPause = () => setIsPlayingAudio(false);
    const onEnded = () => {
      setIsPlayingAudio(false);
      setIsAudioLoading(false);
      setCurrentAudioSrc(null);
    };
    const onCanPlay = () => setIsAudioLoading(false);
    const onError = () => {
      setIsPlayingAudio(false);
      setIsAudioLoading(false);
      console.warn("Audio error", audio?.src);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, []);

  // pause audio when popup closes
  useEffect(() => {
    if (!isOpen && audioRef.current && !audioRef.current.paused) audioRef.current.pause();
  }, [isOpen]);

  // resolve current entry when selectedCode changes
  useEffect(() => {
    if (!selectedCode) {
      setCurrentEntry(null);
      return;
    }
    const target = normalizeStrong(selectedCode);
    const findIn = (arr?: DictEntry[] | null) =>
      arr?.find(
        (e) =>
          normalizeStrong(e.strongNumber) === target ||
          (e.raw?._id && normalizeStrong(e.raw._id) === target) ||
          (e.dictLink && normalizeStrong(e.dictLink) === target)
      );

    const found = findIn(greek) ?? findIn(hebrew) ?? null;
    if (found) {
      setCurrentEntry(found);
      setSelectedCodeMeaning(found.meaning);
    } else {
      setCurrentEntry({
        strongNumber: target,
        langWord: "..",
        meaning: "Fetching...",
        phon: "..",
        raw: {},
      });
    }

    // reset concordance view
    concordance.reset();
    setShowConcordance(false);
  }, [selectedCode, greek, hebrew, setSelectedCodeMeaning]);

  const audioKey = normalizeStrong(currentEntry?.strongNumber);

  const audioUrlForCurrent = (() => {
    if (!audioMap || !audioKey) return undefined;
    if (audioMap[audioKey]) return audioMap[audioKey];
    if (audioMap.audioPro && typeof audioMap.audioPro === "object") {
      for (const grp of Object.keys(audioMap.audioPro)) {
        const obj = audioMap.audioPro[grp];
        if (obj && obj[audioKey]) return obj[audioKey];
      }
    }
    for (const val of Object.values(audioMap)) {
      // @ts-ignore
      if (val && typeof val === "object" && val[audioKey]) return val[audioKey];
    }
    return undefined;
  })();

  const handlePlayAudio = async () => {
    if (!audioRef.current) return;
    const url = audioUrlForCurrent;
    if (!url) return;
    const audio = audioRef.current;

    if (currentAudioSrc === url && !audio.paused) {
      audio.pause();
      return;
    }

    try {
      setIsAudioLoading(true);
      if (audio.src !== url) {
        audio.src = url;
        setCurrentAudioSrc(url);
        try {
          audio.load();
        } catch { }
      }
      const p = audio.play();
      if (p && p instanceof Promise) await p;
      setIsAudioLoading(false);
      setIsPlayingAudio(true);
    } catch (err) {
      console.warn("Playback failed", err);
      setIsAudioLoading(false);
      setIsPlayingAudio(false);
    }
  };
  const setConcordanceRecoil = useSetRecoilState(condordanceResultAtom);


  /* Concordance search from UI */
  const searchConcordanceForCurrent = async () => {
    if (!currentEntry) return;
    await concordance.loadByStrong(currentEntry.strongNumber);
    setShowConcordance(true);
    setConcordanceRecoil(concordance.allResults) 

    try {
      onConcordanceResults?.(concordance.allResults);
     
    } catch (err) {
      // ignore callback errors
    }
  };

  /* sliding transforms */
  const panelWidth = 340;
  const dictTransform = showConcordance ? `translateX(-${panelWidth}px)` : `translateX(0px)`;
  const conTransform = showConcordance ? `translateX(0px)` : `translateX(${panelWidth}px)`;

  if (!isOpen || !position) return null;

  return (
    <div
      ref={popupRef}
      className="fixed shadow-xl border-solid border-2 w-[340px] max-w-md   z-50 rounded-lg"
      style={{ top: position?.top, left: position?.left }}
    >
      {/* arrow */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0
        border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[var(--ds-blue)]" />

      {/* header */}
      <div className="bg-[var(--ds-blue)] text-white flex justify-between items-center px-4 py-2 rounded-t-lg font-montserrat">
        {showConcordance ?
          (<span className="font-semibold">ROR Bible+ Concordance</span>)
          :
          (<span className="font-semibold">Enhanced Strong's Dictionary</span>)
        }

        <button className="text-white text-lg" onClick={() => onClose()}>
          x
        </button>
      </div>

      {/* container for both panels */}
      <div className="relative bg-white h-[45vh] overflow-hidden ">
        {/* Dictionary panel */}
        <div
          className="absolute inset-0 p-4 pb-0 h-[40vh] flex flex-col justify-between"
          style={{ transform: dictTransform, transition: "transform 300ms ease" }}
        >
          <div className="border-b pb-2 mb-2">
            <p className="text-xl font-bold">{currentEntry?.langWord ?? "—"}</p>
            <p className="text-red-600 font-semibold mb-1 mt-auto">
              STRONG’S NUMBER: {currentEntry?.strongNumber ?? selectedCode}
            </p>
          </div>

          <div className="text-gray-800 text-sm max-h-[30vh] overflow-y-auto">
            <p>
              <strong>{currentEntry?.strongNumber ?? selectedCode}. </strong>
              {currentEntry?.langWord ?? ""}
            </p>

            <p className="flex items-center mt-3">
              <strong>Pronounced as: </strong>
              <span className="italic ml-2">{currentEntry?.phon ?? "—"}</span>

              {audioUrlForCurrent && (
                <button
                  onClick={handlePlayAudio}
                  aria-label="Play pronunciation"
                  title="Play pronunciation"
                  className={`inline-flex items-center gap-2 ml-3 px-2 py-1 rounded-full ds-focus-visible focus:outline-none ${isPlayingAudio && currentAudioSrc ? "text-[var(--ds-blue)] bg-brand-mist" : "text-black bg-transparent"
                    }`}
                >
                  <svg width="18" height="17" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 5L14 0V20L6 15V5ZM0 15H4V5H0V15ZM20.264 1.736L18.767 3.233C20.614 5.016 21.75 7.39 21.75 10C21.75 12.61 20.615 14.984 18.767 16.766L20.265 18.264C22.57 16.111 24 13.209 24 10C24 6.791 22.57 3.89 20.264 1.736ZM19.775 10C19.775 7.916 18.86 6.033 17.391 4.609L15.888 6.112C16.899 7.161 17.525 8.513 17.525 10C17.525 11.488 16.902 12.841 15.891 13.891L17.394 15.394C18.862 13.97 19.775 12.085 19.775 10Z" fill="black" />
                  </svg>

                </button>
              )}
            </p>

            <p className="mt-3">{currentEntry?.meaning}</p>
          </div>

          <div className=" mt-2 flex justify-center">
            <button onClick={searchConcordanceForCurrent} className="bg-[#04557D] text-white px-3 py-1 rounded">
              Search for {currentEntry?.strongNumber ?? selectedCode}
            </button>
          </div>
        </div>

        {/* Concordance panel */}
        <div
          className="absolute z-300 inset-0 bg-white p-3 overflow-hidden"
          style={{ transform: conTransform, transition: "transform 300ms ease" }}
        >
          {/* top bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Back icon */}
              <svg onClick={() => {setShowConcordance(false); setConcordanceRecoil(concordance.allResults) }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.474 5.20903C9.474 5.20903 4.973 9.71403 3.22 11.468C3.073 11.614 3 11.806 3 11.998C3 12.19 3.073 12.382 3.22 12.528C4.972 14.282 9.472 18.785 9.472 18.785C9.617 18.93 9.808 19.002 9.999 19.002C10.19 19.001 10.382 18.928 10.529 18.781C10.822 18.488 10.823 18.015 10.533 17.724L5.557 12.748H20.249C20.663 12.748 20.999 12.412 20.999 11.998C20.999 11.584 20.663 11.248 20.249 11.248H5.557L10.535 6.26903C10.824 5.98003 10.822 5.50803 10.529 5.21503C10.382 5.06803 10.19 4.99403 9.999 4.99403C9.808 4.99303 9.619 5.06503 9.474 5.20903Z" fill="black" />
              </svg>

              <div>
                <div className="text-lg font-bold text-center">{currentEntry?.strongNumber}</div>
              </div>
            </div>
            <div className="text-xs opacity-80">
              {concordance.results.length}/{concordance.allResults.length} shown
            </div>
          </div>

          {/* results */}
          <div className="overflow-auto h-[calc(44vh-120px)] p-1">
            {concordance.loading && <div>Loading...</div>}
            {!concordance.loading && concordance.results.length === 0 && (
              <div className="text-sm text-gray-500">No concordance results found.</div>
            )}
            {concordance.results.map((r, idx) => (
              <div key={idx} className="border-b py-2">
                <div className="text-sm font-semibold">{r.bibleLink ?? r.ref ?? ""}</div>
                <div className="text-sm">{r.snippet ?? (r.raw ? JSON.stringify(r.raw).slice(0, 200) : "")}</div>
              </div>
            ))}
          </div>

          <div className="p-3 flex justify-center gap-2 border-t">
            <button onClick={() => concordance.loadMore()} className="px-3 py-1 bg-[#04557D] text-white rounded mb-0">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
