// Multilayout.tsx
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentChapterAtom,
  layoutViewAtom,
  readBookAtom,
  readChapterAtom,
  bibleContentAtom,
  currentBookAtom,
  currentChapterLengthAtom,
  totalVersesAtom,
  selectedVerseAtom,
  selectedStrongsAtom,
  showStrongsAtom,
  FontSizeAtom,
  FontTypeAtom,
  verseDisplayState,
  DarkThemeAtom,
  referenceStateAtom,
  showReaderSettingsModal,
  SettingsActiveStateModal,
  showAudioPlayer,
  ProdSKUAtom,
  selectedStrongsMeaning,
  condordanceResultAtom,
} from 'store/atoms/general';

import { IBibleOT, IBibleNT } from 'interface/bible_array';
import BibleDisplay from '../../JsonBibleDisplay/BibleDisplay';
import AudioPlayer from './Audioplayer';
import Dropdown from 'components/Dropdown';
import FontSizeSelector from 'screens/Pop-ups/fontSizeSelector';
import FontTypeSelector from 'screens/Pop-ups/fontTypeSelector';
import WordofChristColor from 'screens/Pop-ups/wordOfChristSelector';
import VerseDisplaySelector from 'screens/Pop-ups/verseDisplaySelector';
import HighlightSelector from 'screens/Pop-ups/highlightSelector';
import JsonBibleData from 'BibleJson/OldKJVPremium.json';
import NewJsonBibleData from 'BibleJson/NewKJVPremium.json';
import { BibleData } from 'screens/JsonBibleDisplay/BibleTypes';

type Props = { hidden?: boolean };

const Multilayout: React.FC<Props> = ({ hidden = false }) => {
  // local UI state
  const [selectTestament, setTestament] = useState(false);
  const [Reader, setReader] = useState<
    'bible' | 'cross_refs' | 'search' | 'history'
  >('bible');

  // Pane visibility controlled by layoutView, default to your original booleans
  const [dictionaryView, setDictionaryView] = useState(true);
  const [verseToggle, setVerseToggle] = useState(true);
  const [referenceView, setReferenceView] = useState(true);
  const [notesView, setNotesView] = useState(true);

  // recoil atoms (same as your project)
  const [currentChapter, setCurrentChapter] =
    useRecoilState<number>(currentChapterAtom);
  const [book, setBook] = useRecoilState(readBookAtom);
  const [chap, setChap] = useRecoilState(readChapterAtom);
  const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
  const jsonBible = useRecoilValue(bibleContentAtom);
  const [currentBookIndex, setCurrentBookIndex] =
    useRecoilState<number>(currentBookAtom);

  const [currentChapterLength, setcurrentChapterLength] =
    useRecoilState<number>(currentChapterLengthAtom);
  const [versesLength, setVersesLength] =
    useRecoilState<number>(totalVersesAtom);

  // safe arrays
  const chapterNumbers = useMemo(
    () =>
      Array.from(
        { length: Math.max(1, currentChapterLength) },
        (_, i) => i + 1
      ),
    [currentChapterLength]
  );
  const totalVerses = useMemo(
    () => Array.from({ length: Math.max(1, versesLength) }, (_, i) => i + 1),
    [versesLength]
  );

  const [selectedVerse, setSelectedVerse] = useRecoilState<number | null>(
    selectedVerseAtom
  );
  const [selectedCode, setSelectedCode] = useRecoilState(selectedStrongsAtom);
  const [selectedCodeMeaning, setSelectedCodeMeaning] = useRecoilState(
    selectedStrongsMeaning
  );
  const [darkTheme, setDarkTheme] = useRecoilState(DarkThemeAtom);
  const [showCodes, setShowCodes] = useRecoilState(showStrongsAtom);
  const [showModal, setShowModal] = useRecoilState(showReaderSettingsModal);
  const [activeSetting, setActiveSetting] = useRecoilState(
    SettingsActiveStateModal
  );
  const [fontSize, setFontSize] = useRecoilState(FontSizeAtom);
  const [fontType, setFontType] = useRecoilState(FontTypeAtom);
  const [referenceState, setReferenceState] =
    useRecoilState(referenceStateAtom);
  const [isAudioView, setIsAudioView] = useRecoilState(showAudioPlayer);
  const [recoilSKU, setRecoilSKU] = useRecoilState(ProdSKUAtom);
  const [concordance, setGetCordResults] = useRecoilState<any[] | null>(
    condordanceResultAtom
  );

  const verseDisplay = useRecoilValue(verseDisplayState);
  const isTwoColumn = verseDisplay === 'two';

  const [audioSrc, setAudioSrc] = useState<string>('');

  useEffect(() => {
    switch (layoutView) {
      case 'A':
        setReferenceView(true);
        setDictionaryView(true);
        setVerseToggle(true);
        setNotesView(true);
        break;
      case 'B':
        setReferenceView(true);
        setDictionaryView(true);
        setNotesView(false);
        break;
      case 'C':
        setReferenceView(true);
        setDictionaryView(false);
        setNotesView(true);
        break;
      case 'D':
        setReferenceView(false);
        setDictionaryView(true);
        setNotesView(true);
        break;
      case 'E':
        setReferenceView(true);
        setDictionaryView(false);
        setNotesView(false);
        setVerseToggle(true);
        break;
      case 'F':
        setReferenceView(false);
        setDictionaryView(true);
        setNotesView(false);
        break;
      case 'G':
        setReferenceView(false);
        setDictionaryView(false);
        setNotesView(true);
        break;
      default:
        setReferenceView(false);
        setDictionaryView(false);
        setNotesView(false);
        setVerseToggle(true);
        break;
    }
  }, [layoutView]);

  const clampBookIndex = (bookIndex: number, books: string[]) => {
    if (!books.length) return 0;
    const maxIndex = books.length - 1;
    return Math.min(Math.max(bookIndex, 0), maxIndex);
  };

  const handleTestamentChange = (nextTestament: boolean) => {
    const nextBooks = nextTestament ? IBibleNT : IBibleOT;
    const safeIndex = clampBookIndex(currentBookIndex, nextBooks);
    setTestament(nextTestament);
    setCurrentBookIndex(safeIndex);
    setCurrentChapter(0);
    setBook(nextBooks[safeIndex] ?? nextBooks[0]);
    setChap(0);
  };

  const handleVerseClick = (index: number) => {
    setSelectedVerse(index + 2);
    setTimeout(() => setSelectedVerse(null), 1500);
  };

  const handleNextChapter = () => {
    if (currentChapter + 1 < Math.max(1, currentChapterLength)) {
      setCurrentChapter(c => c + 1);
    } else if (currentChapter + 1 === currentChapterLength) {
      setCurrentBookIndex(i => i + 1);
      setCurrentChapter(0);
    }
  };
  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(c => c - 1);
      return;
    }
    if (currentChapter === 0 && currentBookIndex > 0) {
      setCurrentBookIndex(i => i - 1);
      setTimeout(
        () => setCurrentChapter(Math.max(0, currentChapterLength - 1)),
        0
      );
    }
  };

  // Audio lookup (safe)
  useEffect(() => {
    if (!recoilSKU || !book) {
      setAudioSrc('');
      return;
    }
    try {
      const openDB = indexedDB.open('RhapsodyBibleDB');
      openDB.onsuccess = () => {
        const db = openDB.result;
        try {
          const tx = db.transaction('productData', 'readonly');
          const store = tx.objectStore('productData');
          const request = store.get(recoilSKU);
          request.onsuccess = () => {
            const result = request.result;
            const audioBible = result?.bibledata?.audio?.audioBible;
            const key = `${book.trim()} ${currentChapter + 1}`;
            const url = audioBible?.[key];
            if (url) setAudioSrc(url);
            else setAudioSrc('');
          };
        } catch (e) {
          setAudioSrc('');
        }
      };
      openDB.onerror = () => setAudioSrc('');
    } catch (e) {
      setAudioSrc('');
    }
  }, [book, currentChapter, recoilSKU]);

  if (hidden) return null;

  // compute widths similar to your SCSS structure
  // left ~12%, center variable (approx 64%), side ~22%, right ~14.5%
  // We will use flex & explicit styles so proportions match precisely.

  return (
    <div
      className={clsx(
        'w-full p-4',
        { 'bg-black text-white': darkTheme },
        { 'bg-[#DFE1D8]': !darkTheme }
      )}
    >
      {/* fixed outer height to match your SCSS main height */}
      <div className="flex gap-4" style={{ height: '64vh' }}>
        {/* Left selector (books/chapters/verses) */}
        {verseToggle && (
          <aside
            className="hidden md:block"
            style={{
              width: '12%',
              height: notesView ? '72%' : '100%',
            }}
          >
            <div
              className={clsx('rounded-md p-2 h-full overflow-hidden', {
                'bg-[#233040] text-white': darkTheme,
                'bg-white': !darkTheme,
              })}
            >
              <div className="flex mb-2">
                <button
                  className={clsx('flex-1 py-2 rounded text-sm', {
                    'bg-[var(--ds-blue)] text-white': !selectTestament,
                  })}
                  onClick={() => handleTestamentChange(false)}
                >
                  OT
                </button>
                <button
                  className={clsx('flex-1 py-2 rounded text-sm ml-2', {
                    'bg-[var(--ds-blue)] text-white': selectTestament,
                  })}
                  onClick={() => handleTestamentChange(true)}
                >
                  NT
                </button>
              </div>

              <div className="flex justify-between bg-[#D4D4D4] rounded p-2 mb-2 text-xs text-[#5C5B5B]">
                <h5>Books</h5>
                <h5>Chapter</h5>
                <h5>Verse</h5>
              </div>

              <div className="flex gap-2 h-[60%] overflow-hidden">
                <div className="w-1/2 overflow-auto pr-1">
                  {(selectTestament ? IBibleNT : IBibleOT).map((b, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'py-1 text-center rounded mb-1 text-xs cursor-pointer',
                        { 'bg-[var(--ds-blue)] text-white': i === currentBookIndex }
                      )}
                      onClick={() => {
                        const safeIndex = clampBookIndex(
                          i,
                          selectTestament ? IBibleNT : IBibleOT
                        );
                        setCurrentBookIndex(safeIndex);
                        setCurrentChapter(0);
                        setBook(b);
                        setChap(0);
                      }}
                    >
                      {b}
                    </div>
                  ))}
                </div>

                <div className="w-1/4 overflow-auto pr-1">
                  {chapterNumbers.map((c, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        'py-1 text-center rounded mb-1 text-xs cursor-pointer',
                        { 'bg-[var(--ds-blue)] text-white': idx === currentChapter }
                      )}
                      onClick={() => setCurrentChapter(idx)}
                    >
                      {c}
                    </div>
                  ))}
                </div>

                <div className="w-1/4 overflow-auto">
                  {totalVerses.map((v, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        'py-1 text-center rounded mb-1 text-xs cursor-pointer',
                        { 'bg-[var(--ds-blue)] text-white': selectedVerse === idx + 2 }
                      )}
                      onClick={() => handleVerseClick(idx)}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Reader center column */}
        <section
          className={clsx('flex flex-col rounded-md shadow', {
            'bg-[#233040] text-white': darkTheme,
            'bg-white': !darkTheme,
          })}
          style={{
            width:
              referenceView || dictionaryView
                ? dictionaryView
                  ? '60%'
                  : '70%'
                : '100%',
            height: notesView ? '75%' : '100%',
          }}
        >
          {/* Top tabs */}
          <div className="flex bg-[#233040] text-[#a7a7a7]">
            <div
              className={clsx('w-1/4 text-center py-3 cursor-pointer', {
                'bg-[var(--ds-blue)] text-white': Reader === 'bible',
              })}
              onClick={() => setReader('bible')}
            >
              Bible
            </div>
            <div
              className={clsx('w-1/4 text-center py-3 cursor-pointer', {
                'bg-[var(--ds-blue)] text-white': Reader === 'cross_refs',
              })}
              onClick={() => setReader('cross_refs')}
            >
              Bookmarks
            </div>
            <div
              className={clsx('w-1/4 text-center py-3 cursor-pointer', {
                'bg-[var(--ds-blue)] text-white': Reader === 'search',
              })}
              onClick={() => setReader('search')}
            >
              Search
            </div>
            <div
              className={clsx('w-1/4 text-center py-3 cursor-pointer', {
                'bg-[var(--ds-blue)] text-white': Reader === 'history',
              })}
              onClick={() => setReader('history')}
            >
              History
            </div>
          </div>

          {/* Settings bar */}
          <div className="flex items-center justify-between p-3 bg-[#D4D4D4]">
            <div className="flex space-x-4 text-sm text-[#5C5B5B]">
              <div className="px-2 py-1 bg-white rounded">Bible</div>
              <div className="px-2 py-1">Compare</div>
              <div className="px-2 py-1">Parallel</div>
              <div className="px-2 py-1">Hamony</div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="p-2 bg-white rounded"
                onClick={() => setIsAudioView((v: any) => !v)}
              >
                🔊
              </button>
              <div className="p-2 bg-white rounded flex items-center space-x-2">
                <span className="text-sm">KJV</span>
                <span>▾</span>
              </div>
            </div>
          </div>

          {/* Content area (scrolls) */}
          <div className="flex-1 overflow-auto relative p-4">
            {/* Prev/Next buttons positioned similarly to your SCSS */}
            <button
              aria-label="prev"
              className={clsx(
                'hidden md:flex items-center justify-center absolute -left-5 bottom-20 w-10 h-10 rounded-full bg-white shadow',
                currentChapter < 1 && 'opacity-50 cursor-not-allowed'
              )}
              onClick={handlePreviousChapter}
            >
              ‹
            </button>
            <button
              aria-label="next"
              className="hidden md:flex items-center justify-center absolute -right-5 bottom-20 w-10 h-10 rounded-full bg-white shadow"
              onClick={handleNextChapter}
            >
              ›
            </button>

            <div className="text-center font-bold text-lg mb-3">
              {book} {currentChapter + 1}
            </div>

            <div className="h-[60vh] overflow-auto">
              {isTwoColumn ? (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="overflow-auto h-full">
                    <BibleDisplay
                      data={
                        (selectTestament
                          ? NewJsonBibleData
                          : JsonBibleData) as unknown as BibleData
                      }
                      column="left"
                    />
                  </div>
                  <div className="overflow-auto h-full">
                    <BibleDisplay
                      data={
                        (selectTestament
                          ? NewJsonBibleData
                          : JsonBibleData) as unknown as BibleData
                      }
                      column="right"
                    />
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <BibleDisplay
                    data={
                      (selectTestament
                        ? NewJsonBibleData
                        : JsonBibleData) as unknown as BibleData
                    }
                  />
                </div>
              )}
            </div>

            {showModal && activeSetting === 'size' && (
              <FontSizeSelector handleClose={() => setShowModal(false)} />
            )}
            {showModal && activeSetting === 'type' && (
              <FontTypeSelector handleClose={() => setShowModal(false)} />
            )}
            {showModal && activeSetting === 'woc' && (
              <WordofChristColor handleClose={() => setShowModal(false)} />
            )}
            {showModal && activeSetting === 'verse' && <VerseDisplaySelector />}
            {showModal && activeSetting === 'highlight' && (
              <HighlightSelector />
            )}
          </div>
        </section>

        {/* Reference pane */}
        {referenceView && (
          <aside
            className="hidden md:block"
            style={{
              width: '24%',
              height: notesView ? '75%' : '100%',
            }}
          >
            <div
              className={clsx('rounded-md p-2 h-full overflow-auto', {
                'bg-[#233040] text-white': darkTheme,
                'bg-white': !darkTheme,
              })}
            >
              <div className="flex justify-between items-center bg-[#233040] text-[#A4A3A3] p-2 rounded mb-2">
                <h5 className="text-sm">Book</h5>
                <h5 className="text-sm">Chapter</h5>
                <h5 className="text-sm">Verse</h5>
              </div>
              <div className="p-2 bg-[#D4D4D4] rounded mb-2 text-sm">
                TSK Cross References ▾
              </div>
              <div className="overflow-auto h-[46vh] p-1 text-sm">
                <div className="font-semibold mb-2">Genesis 1:2</div>
                <p className="text-xs">
                  without:{' '}
                  <span className="text-[#00908E]">Job 26:7; Isa:18</span>
                </p>
                <p className="text-xs">
                  spirit:{' '}
                  <span className="text-[#00908E]">Job 26:7; Isa:18</span>
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Dictionary pane */}
        {dictionaryView && (
          <aside
            className="hidden lg:block"
            style={{
              width: '14.5%',
              // height: '50vh'
            }}
          >
            <div
              className={clsx('rounded-md p-2 h-full overflow-auto', {
                'bg-[#233040] text-white': darkTheme,
                'bg-white': !darkTheme,
              })}
            >
              <div className="p-2 bg-[#233040] text-white rounded mb-2 flex items-center justify-between">
                <input
                  className="px-2 py-1 rounded text-sm w-full"
                  placeholder="Search"
                />
              </div>

              <div className="overflow-auto h-[60vh] p-1 text-sm">
                <h5 className="font-semibold">{selectedCode || 'Aaron'}</h5>
                <p className="text-xs">
                  {(selectedCodeMeaning || '').slice(0, 300)}
                </p>
                <div className="mt-4">
                  {!concordance || concordance.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No concordance results found.
                    </div>
                  ) : (
                    concordance.map((r, idx) => (
                      <div key={idx} className="border-b py-2">
                        <div className="text-[13px] font-semibold">
                          {r.bibleLink ?? r.ref ?? ''}
                        </div>
                        <div className="text-[13px]">
                          {r.snippet ??
                            (r.raw ? JSON.stringify(r.raw).slice(0, 200) : '')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Notes / Audio area - fixed to visible when notesView true */}
      {notesView && (
        <div
          className={clsx('mt-4 rounded-md p-4 shadow', {
            'bg-[#233040] text-white': darkTheme,
            'bg-white': !darkTheme,
          })}
          style={{ minHeight: '24vh' }}
        >
          {isAudioView ? (
            <AudioPlayer
              key={`${recoilSKU}-${book}-${currentChapter}`}
              sku={recoilSKU}
              src={audioSrc}
              title={`${book} ${currentChapter + 1}`}
              image="assets/bible/bible3.png"
            />
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-[#D4D4D4] rounded">
                  Journal
                </button>
                <button className="px-3 py-2 bg-[#D4D4D4] rounded">
                  Study
                </button>
                <button className="px-3 py-2 bg-[#D4D4D4] rounded">
                  Topic
                </button>
              </div>

              <div className="flex space-x-2 items-center">
                <div className="px-3 py-2 bg-white rounded">Styles ▾</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Multilayout;
