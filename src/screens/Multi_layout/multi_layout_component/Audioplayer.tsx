// src/components/AudioPlayer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import bible from 'assets/bible/bible3.png';
import { ReactComponent as Download } from 'assets/download2.svg';
import { ReactComponent as Mute } from 'assets/audioControls/mute.svg';
import { ReactComponent as Prev } from 'assets/audioControls/prev.svg';
import { ReactComponent as Play } from 'assets/audioControls/play.svg';
import { ReactComponent as Pause } from 'assets/audioControls/pause.svg';
import { ReactComponent as Next } from 'assets/audioControls/next.svg';
import { ReactComponent as Mini } from 'assets/audioControls/mini.svg';

const DB_NAME = 'RhapsodyBibleDB';
const STORE_NAME = 'AudioData';
const DB_VERSION = 1;

// ------------------ IndexedDB ------------------
function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const makeKey = (sku: string, title: string) => `${sku}|${title.trim()}`;

// ------------------ Hook ------------------
function useAudioCache(
  sku: string,
  title: string,
  networkUrl: string
): {
  src: string;
  isDownloaded: boolean;
  download: () => void;
} {
  const [src, setSrc] = useState(networkUrl);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const abortCtrl = useRef<AbortController>();

  useEffect(() => {
    let mounted = true;
    openAudioDB()
      .then(
        db =>
          new Promise<Blob | undefined>((res, rej) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(makeKey(sku, title));
            req.onsuccess = () => res(req.result as Blob);
            req.onerror = () => rej(req.error);
          })
      )
      .then(blob => {
        if (mounted && blob instanceof Blob) {
          setSrc(URL.createObjectURL(blob));
          setIsDownloaded(true);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
      abortCtrl.current?.abort();
    };
  }, [sku, title, networkUrl]);

  const download = useCallback(() => {
    const controller = new AbortController();
    abortCtrl.current = controller;

    fetch(networkUrl, { signal: controller.signal })
      .then(resp => {
        if (!resp.ok) throw new Error('Network response was not ok');
        return resp.blob();
      })
      .then(blob =>
        openAudioDB().then(db => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).put(blob, makeKey(sku, title));
          tx.oncomplete = () => {
            setSrc(URL.createObjectURL(blob));
            setIsDownloaded(true);
          };
        })
      )
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Download error:', err);
          alert('Failed to download audio file.');
        }
      });
  }, [sku, title, networkUrl]);

  return { src, isDownloaded, download };
}

// ------------------ Component ------------------
interface AudioPlayerProps {
  sku: string;
  src: string;
  title: string;
  image?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  sku,
  src: networkSrc,
  title,
  image,
  onNext,
  onPrev,
}) => {
  const {
    src: internalSrc,
    isDownloaded,
    download,
  } = useAudioCache(sku, title, networkSrc);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Reset playback state immediately whenever the chapter (title) changes,
  // instead of relying on a `key`-based remount which raced with the async
  // audio URL lookup and made the player appear one chapter behind.
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [title]);

  // --------------- Audio events ---------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onUpdate);
    };
  }, [internalSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleNextChapter = () => {
    onNext?.();
  };

  const handlePreviousChapter = () => {
    onPrev?.();
  };

  // --------------- Dummy waveform bars ---------------
  // --------------- Dummy waveform bars ---------------
  const totalBars = 120; // Adjust for density
  const progressPercent = (currentTime / duration) * 100;
  const filledBars = Math.round((progressPercent / 100) * totalBars);

  // random bar heights (20–100%)
  const heights = useRef<number[]>(
    Array.from({ length: totalBars }, () => Math.random() * 0.8 + 0.2)
  ).current;

  // spacing between bars (in % of container width)
  const gap = 0.4;
  const totalGap = gap * (totalBars - 1);
  const barWidth = (100 - totalGap) / totalBars; // fill exactly 100%

  const bars = Array.from({ length: totalBars }).map((_, i) => (
    <div
      key={i}
      style={{
        height: `${heights[i] * 100}%`,
        width: `${barWidth}%`,
        marginRight: i < totalBars - 1 ? `${gap}%` : '0',
      }}
      className={`rounded-sm transition-colors duration-200 ${
        i < filledBars ? 'bg-[#FF5900]' : 'bg-[#3FACD4]'
      }`}
    />
  ));

  // --------------- Render ---------------
  return (
    <div className="w-full bg-white px-2 flex flex-col gap-1 items-center">
      <div className="flex justify-end w-full mb-1">
        <span className="text-[11px] text-[#8E8D8D] flex items-center">
          tap on icon to download this audio
          {isDownloaded ? (
            <FaCheckCircle className="ml-4 text-green-500" />
          ) : (
            <Download
              className="ml-4 w-5 cursor-pointer text-gray-300 hover:text-gray-500"
              onClick={download}
            />
          )}
        </span>
      </div>

      <div className="flex w-full">
        {image && (
          <img
            src={bible}
            alt="Audio Cover"
            className="w-[5.5rem] mr-6 h-[7rem] object-cover rounded-lg border"
          />
        )}

        <div className="text-sm flex flex-col font-semibold text-[#8E8D8D] mr-5 justify-center">
          <div>ROR Hebrew Greek Version</div>
          <div className="font-normal text-[11px]">
            By Chris Oyakhilome Dsc. D.D.
          </div>
        </div>

        <div className="flex flex-col flex-1">
          {/* --- Dummy waveform --- */}
          <div className="w-full h-[2rem] mb-4 flex items-center justify-evenly overflow-hidden">
            {bars}
          </div>

          {/* --- Controls --- */}
          <div className="flex items-center justify-between mt-5">
            <Mute className="cursor-pointer text-md w-5 text-gray-300" />
            <Prev
              className="cursor-pointer text-md w-5 text-gray-300"
              onClick={handlePreviousChapter}
            />
            <button onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="text-xl w-5 text-[#258ABA]" />
              ) : (
                <Play className="text-xl w-5 text-[#258ABA]" />
              )}
            </button>
            <Next
              className="cursor-pointer text-md w-5 text-gray-300"
              onClick={handleNextChapter}
            />
            <Mini className="cursor-pointer text-md w-5 text-gray-300" />
          </div>

          {/* --- Progress bar --- */}
          <div
            className="relative w-full h-[1px] bg-gray-200 rounded cursor-pointer mt-2"
            onClick={handleSeekClick}
          >
            <div
              className="absolute h-[2px] bg-[#FF5900] rounded transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* --- Timer --- */}
          <div className="text-xs text-[#8E8D8D] flex justify-between mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <audio ref={audioRef} src={internalSrc} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
