import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import './multi_layout_component.scss';
import { IBibleOT, IBibleNT, Iverses } from 'interface/bible_array';
import { PiSpeakerHigh } from 'react-icons/pi';
import { TiCancel } from 'react-icons/ti';
import { FaCaretDown } from 'react-icons/fa';
import { MdOutlineChevronRight, MdOutlineChevronLeft } from 'react-icons/md';
import { IoMdLink } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import {
  CiViewList,
  CiTextAlignLeft,
  CiTextAlignRight,
  CiTextAlignCenter,
  CiTextAlignJustify,
} from 'react-icons/ci';
import { BsJournalText } from 'react-icons/bs';
import { LiaBookReaderSolid } from 'react-icons/lia';
import { TfiPencil } from 'react-icons/tfi';
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
  SetNavAtom,
} from 'store/atoms/general';
import { height } from '@mui/system';
// import XmlDisplay from 'components/XmlDisplay/XmlDisplay';
import MultiLayoutXmlDisplay from 'components/XmlDisplay/MultiLayoutXmlDisplay';
import clsx from 'clsx';
// Files for the latest bible json
import BibleDisplay from '../../JsonBibleDisplay/BibleDisplay';
import JsonBibleData from 'BibleJson/OldKJVPremium.json';
import NewJsonBibleData from 'BibleJson/NewKJVPremium.json';
import { BibleData } from 'screens/JsonBibleDisplay/BibleTypes';
import Dropdown from 'components/Dropdown';
import { ReactComponent as HyperlinkIcon } from 'assets/hyperlink.svg';
import { ReactComponent as Moon } from 'assets/moon.svg';
import { ReactComponent as Link } from 'assets/dicLink.svg';
import { fontSizeData } from 'utils/selectData';
import FontSizeSelector from 'screens/Pop-ups/fontSizeSelector';
import FontTypeSelector from 'screens/Pop-ups/fontTypeSelector';
import WordofChristColor from 'screens/Pop-ups/wordOfChristSelector';
import VerseDisplaySelector from 'screens/Pop-ups/verseDisplaySelector';
import HighlightSelector from 'screens/Pop-ups/highlightSelector';
import AudioPlayer from './Audioplayer';
import { ReactComponent as Notes } from 'assets/notes.svg';
import { ConcordanceItem } from 'screens/JsonBibleDisplay/StrongsDictionary';
import audioBibleData from 'BibleJson/audioBible.json';
import { getBibleData, isValidBibleData } from 'utils/bibleStorage';
import { isElectron } from 'utils/general';
import SubNav from './subNav';

type storeFavouritesTypes = {
  hidden: boolean;
};

const Multilayout = ({ hidden }: storeFavouritesTypes) => {
  const [selectTestament, setTestament] = useState(false);
  const [Reader, setReader] = useState('bible');
  const [Mreader, setMreader] = useState(true);
  const [dictionaryView, setdictionaryView] = useState(true);
  const [verseToggle, setverseToggle] = useState(true);
  const [referenceView, setreferenceView] = useState(true);
  const [notesView, setnotesView] = useState(true);
  const [currentChapter, setCurrentChapter] =
    useRecoilState<number>(currentChapterAtom);
  const [book, setBook] = useRecoilState(readBookAtom);
  const [chap, setChap] = useRecoilState(readChapterAtom);
  const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
  const [jsonBible, setBibleContent] = useRecoilState(bibleContentAtom);
  const [mlXmlContent, setMLXmlContent] = useState<string>('');
  const [newXml, setNewXml] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] =
    useRecoilState<number>(currentBookAtom);
  const [currentChapterLength, setcurrentChapterLength] =
    useRecoilState<number>(currentChapterLengthAtom);
  const [versesLength, setVersesLength] =
    useRecoilState<number>(totalVersesAtom);
  const chapterNumbers = Array.from(
    { length: currentChapterLength },
    (_, i) => i + 1
  );
  const totalVerses = Array.from({ length: versesLength }, (_, i) => i + 1);
  const [selectedVerse, setSelectedVerse] = useRecoilState(selectedVerseAtom);
  const [selectedCode, setSelectedCode] = useRecoilState(selectedStrongsAtom);
  const [selectedCodeMeaning, setSelectedCodeMeaning] = useRecoilState(
    selectedStrongsMeaning
  );
  const [darkTheme, setdarkTHeme] = useRecoilState(DarkThemeAtom);
  const [showCodes, setShowCodes] = useRecoilState(showStrongsAtom);
  const [showModal, setShowModal] = useRecoilState(showReaderSettingsModal);
  const [activeSetting, setActiveSetting] = useRecoilState(
    SettingsActiveStateModal
  );
  const [fontSize, setFontSize] = useRecoilState(FontSizeAtom);
  const [fontType, setFontType] = useRecoilState(FontTypeAtom);
  const [referenceState, setreferenceState] =
    useRecoilState(referenceStateAtom);
  const [isAudioView, setisAudioView] = useRecoilState(showAudioPlayer);
  const [recoilSKU, setRecoilSKU] = useRecoilState(ProdSKUAtom);
  const [concordance, setGetCordResults] = useRecoilState<
    ConcordanceItem[] | null
  >(condordanceResultAtom);
  const [nav, setNav] = useRecoilState(SetNavAtom);

  const localFallbackBible = selectTestament ? NewJsonBibleData : JsonBibleData;

  useEffect(() => {
    if (!recoilSKU || recoilSKU.toLowerCase() === 'rorb33') return;

    let isMounted = true;
    getBibleData(recoilSKU)
      .then(cached => {
        if (!isMounted || !cached?.bibledata) return;
        setBibleContent((prev: any) => ({
          ...(prev || {}),
          [recoilSKU]: cached.bibledata,
        }));
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [recoilSKU, setBibleContent]);

  const cachedProductData =
    recoilSKU &&
    recoilSKU.toLowerCase() !== 'rorb33' &&
    jsonBible &&
    typeof jsonBible === 'object'
      ? (jsonBible as Record<string, any>)[recoilSKU]
      : null;

  const preferredBibleData =
    cachedProductData?.oldTestament || cachedProductData?.newTestament
      ? (selectTestament
          ? cachedProductData.newTestament
          : cachedProductData.oldTestament) || localFallbackBible
      : localFallbackBible;

  const safePreferredBibleData = isValidBibleData(preferredBibleData)
    ? preferredBibleData
    : localFallbackBible;

  const verseDisplay = useRecoilValue(verseDisplayState);
  const isTwoColumn = verseDisplay === 'two';

  const handleOptionClick = (
    type: 'size' | 'type' | 'woc' | 'verse' | 'highlight'
  ) => {
    setActiveSetting(type);
    setShowModal(true);
  };
  const handleAudio = () => {
    setisAudioView(true);
  };
  // Update Font settings (Size or Type)
  const handleSelect = (value: string) => {
    if (activeSetting === 'size') {
      setFontSize(value);
    } else if (activeSetting === 'type') {
      setFontType(value);
    }
    setShowModal(false);
  };

  const handleVerseClick = (index: number) => {
    setSelectedVerse(index + 2);

    // Remove highlight after 2 seconds
    setTimeout(() => {
      setSelectedVerse(null);
    }, 1500);
  };

  const handleNextChapter = () => {
    if (currentChapter + 1 < currentChapterLength) {
      // Move to next chapter
      setCurrentChapter(prev => prev + 1);
    } else if (currentChapter + 1 === currentChapterLength) {
      // Move to the next book and start at chapter 1
      setCurrentBookIndex(prev => prev + 1);
      setCurrentChapter(0); // Start at chapter 1 (Index `0` if zero-based)
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      // Move to previous chapter
      setCurrentChapter(prev => prev - 1);
      console.log('currentChapter', currentChapter);
      return;
    }
    if (currentChapter === 0 && currentBookIndex > 0) {
      // Move to the previous book and start at its last chapter
      setCurrentBookIndex(prev => prev - 1);
      // Get last chapter index of the new book
      const lastChapter = currentChapterLength - 1;
      setTimeout(() => {
        setCurrentChapter(currentChapterLength - 1); // Move to last chapter of the new book
      }, 0);
    }
  };

  // Select & Update layout view state.
  useEffect(() => {
    if (layoutView === 'A') {
      setreferenceView(true);
      setdictionaryView(true);
      setverseToggle(true);
      setnotesView(true);
    } else if (layoutView === 'B') {
      setreferenceView(true);
      setdictionaryView(true);
      setnotesView(false);
    } else if (layoutView === 'C') {
      setreferenceView(true);
      setdictionaryView(false);
      setnotesView(true);
    } else if (layoutView === 'D') {
      setreferenceView(false);
      setdictionaryView(true);
      setnotesView(true);
    } else if (layoutView === 'E') {
      setreferenceView(true);
      setdictionaryView(false);
      setnotesView(false);
      setverseToggle(true);
    } else if (layoutView === 'F') {
      setreferenceView(false);
      setdictionaryView(true);
      setnotesView(false);
    } else if (layoutView === 'G') {
      setreferenceView(false);
      setdictionaryView(false);
      setnotesView(true);
    } else {
      setreferenceView(false);
      setdictionaryView(false);
      setnotesView(false);
      setverseToggle(true);
    }
  }, [layoutView, referenceView, dictionaryView, notesView, verseToggle]);

  // Fetch & Update xmldisplay with the Bible
  useEffect(() => {
    if (isElectron()) {
      return;
    }
    fetch('/Bible_English_AMP.xml')
      .then(response => response.text())
      .then(data => setMLXmlContent(data))
      .catch(error => console.error('Error fetching XML:', error));
  }, [mlXmlContent]);

  // To get the Audio url from the IndexDB local storage.

  // useEffect(() => {
  //     const openDB = indexedDB.open('RhapsodyBibleDB');

  //     openDB.onsuccess = () => {
  //         const db = openDB.result;
  //         const tx = db.transaction('productData', 'readonly');
  //         const store = tx.objectStore('productData');
  //         const request = store.get(recoilSKU); {/* The active product Sku */ }

  //         request.onsuccess = () => {
  //             const result = request.result;
  //             const audioBible = result?.bibledata?.audio?.audioBible;

  //             const key = `${book.trim()} ${currentChapter + 1}`;
  //             const url = audioBible?.[key];

  //             if (url) {
  //                 setAudioSrc(url);
  //             } else {
  //                 console.error('Audio URL not found for:', key);
  //             }
  //         };
  //     };

  //     openDB.onerror = () => {
  //         console.error('Failed to open IndexedDB');
  //     };
  // }, [book, currentChapter]);
  const audioSrc = useMemo(() => {
    const key = `${(book || '').trim()} ${currentChapter + 1}`;
    const audioUrl = (audioBibleData as any)?.audioBible?.[key];

    if (!audioUrl) {
      console.error('Audio URL not found for:', key);
      return '';
    }
    return audioUrl;
  }, [book, currentChapter]);

  // Build the reader grid (bible selector / reader / reference / notes)
  // dynamically from the currently visible panels so there is never a
  // left-over empty column/row (and therefore never a stray gap) when a
  // panel is toggled off. The reader column always takes the remaining
  // space via `minmax(0, 1fr)`.
  const BIBLE_COLUMN_WIDTH = '170px';
  const SIDE_COLUMN_WIDTH = '250px';

  const mainGridStyle = useMemo(() => {
    const columnAreas: string[] = [];
    const columnSizes: string[] = [];

    if (verseToggle) {
      columnAreas.push('bible');
      columnSizes.push(BIBLE_COLUMN_WIDTH);
    }
    columnAreas.push('reader');
    columnSizes.push('minmax(0, 1fr)');
    if (referenceView) {
      columnAreas.push('side');
      columnSizes.push(SIDE_COLUMN_WIDTH);
    }

    const row1 = columnAreas.join(' ');
    const row2 = columnAreas
      .map(area => (area === 'bible' ? 'bible' : 'notes'))
      .join(' ');

    return {
      gridTemplateColumns: columnSizes.join(' '),
      gridTemplateRows: notesView ? 'minmax(0, 1fr) auto' : '1fr',
      gridTemplateAreas: notesView ? `"${row1}" "${row2}"` : `"${row1}"`,
    };
  }, [verseToggle, referenceView, notesView]);

  return (
    <div
      className="flex flex-col w-full "
      style={{
        display: hidden ? 'none' : 'flex',
      }}
    >
      <SubNav nav={nav} setNav={setNav} />

      <div
        className={clsx('multi_layout', {
          '!bg-[#000000] !text-white': darkTheme,
        })}
      >
        <div className="multi_layout_main" style={mainGridStyle}>
          {/* Bible selector */}
          {verseToggle && (
            <div
              className={clsx('multi_layout_main_bible', {
                '!bg-[#233040] !text-white': darkTheme,
              })}
              style={{ gridArea: 'bible' }}
            >
              <div
                className="multi_layout_main_bible_top !h-[2rem]"
                style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              >
                <div
                  className={`multi_layout_main_bible_top_inactive ${!selectTestament ? 'bg-[var(--ds-blue)]' : 'bg-[var(--ds-cyan)]'}`}
                  onClick={() => {
                    setTestament(false);
                    setCurrentBookIndex(
                      Math.min(
                        Math.max(currentBookIndex, 0),
                        IBibleOT.length - 1
                      )
                    );
                    setCurrentChapter(0);
                  }}
                >
                  OT
                </div>
                <div
                  className={`multi_layout_main_bible_top_inactive2 ${selectTestament ? 'bg-[var(--ds-blue)]' : 'bg-[var(--ds-cyan)]'}`}
                  onClick={() => {
                    setTestament(true);
                    setCurrentBookIndex(
                      Math.min(
                        Math.max(currentBookIndex, 0),
                        IBibleNT.length - 1
                      )
                    );
                    setCurrentChapter(0);
                  }}
                >
                  NT
                </div>
              </div>

              <div className="multi_layout_main_bible_title !h-[2rem]">
                <h5>Bks</h5>
                <h5>Chs</h5>
                <h5>Vrs</h5>
              </div>

              {/* Book & Chapter Selector */}
              <div
                className={clsx('multi_layout_main_bible_main', {
                  '!bg-[#233040] !text-white': darkTheme,
                })}
                style={{
                  height: '85%',
                }}
              >
                {/* Book Selector */}

                <div
                  className="multi_layout_main_bible_main_books "
                  style={{
                    overflowY: 'auto',
                  }}
                >
                  {(selectTestament === false ? IBibleOT : IBibleNT).map(
                    (book, index) => {
                      const safeIndex = Math.min(
                        Math.max(index, 0),
                        (selectTestament === false ? IBibleOT : IBibleNT)
                          .length - 1
                      );
                      return (
                        <h5
                          className={clsx('cursor-pointer', {
                            '!text-white dark': darkTheme,
                          })}
                          key={index}
                          onClick={() => {
                            setCurrentBookIndex(safeIndex);
                            setCurrentChapter(0);
                            setBook(book);
                            setChap(0);
                          }}
                          style={{
                            backgroundColor:
                              index === currentBookIndex
                                ? '#19688B'
                                : 'transparent',
                            color:
                              index === currentBookIndex ? 'white' : 'black',
                          }}
                        >
                          {book}
                        </h5>
                      );
                    }
                  )}
                </div>

                {/* Chapter Selector */}

                <div className="multi_layout_main_bible_main_verses flex-col mb-1">
                  {chapterNumbers.map((chapter, index) => (
                    <h5
                      className={clsx('cursor-pointer', {
                        '!text-white dark': darkTheme,
                      })}
                      key={index}
                      onClick={() => setCurrentChapter(index)}
                      style={{
                        backgroundColor:
                          index === currentChapter ? '#19688B' : 'transparent',
                        color: index === currentChapter ? 'white' : 'black',
                      }}
                    >
                      {chapter}
                    </h5>
                  ))}
                </div>

                {/* Verse Selector */}

                <div className="multi_layout_main_bible_main_verses mb-1">
                  {totalVerses.map((verse, index) => (
                    <h5
                      key={index}
                      className={clsx('cursor-pointer', {
                        '!text-white dark': darkTheme,
                      })}
                      // onClick={() => setSelectedVerse(index+2)}
                      onClick={() => handleVerseClick(index)}
                      style={{
                        backgroundColor:
                          selectedVerse === index + 2
                            ? '#19688B'
                            : 'transparent',
                        color: selectedVerse === index + 2 ? 'white' : 'black',
                      }}
                    >
                      {verse}
                    </h5>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reader */}
          <div
            className={clsx('multi_layout_main_reader', {
              '!bg-[#233040] !text-white': darkTheme,
            })}
            style={{ gridArea: 'reader' }}
          >
            <div className="multi_layout_main_reader_top !h-[2rem]">
              {/* <div> */}
              <div
                className={`multi_layout_main_reader_top_tabs ${Reader === 'bible' ? 'bg-[var(--ds-blue)] !text-[#ffffff]' : ''}`}
                onClick={() => setReader('bible')}
              >
                Bible
              </div>
              <div
                className={`multi_layout_main_reader_top_tabs ${Reader === 'compare' ? 'bg-[var(--ds-blue)] !text-[#ffffff]' : ''}`}
                onClick={() => setReader('compare')}
              >
                Compare
              </div>
              <div
                className={`multi_layout_main_reader_top_tabs ${Reader === 'parallel' ? 'bg-[var(--ds-blue)] !text-[#ffffff]' : ''}`}
                onClick={() => setReader('parallel')}
              >
                Parallel
              </div>

              {/* </div> */}
              {/* SPeaker, Book & Settings */}

              <div className="multi_layout_main_reader_top_settings_options">
                <div className="multi_layout_main_reader_top_settings_options_button">
                  {isAudioView ? (
                    <BsJournalText
                      className="multi_layout_main_reader_top_settings_options_button_i text-grey-300"
                      onClick={() => setisAudioView((prev: any) => !prev)}
                    />
                  ) : (
                    <PiSpeakerHigh
                      className="multi_layout_main_reader_top_settings_options_button_ic"
                      onClick={() => setisAudioView((prev: any) => !prev)}
                    />
                  )}
                </div>
                <span className="block whitespace-nowrap font-normal ml-4 !text-[0.9rem] text-white">
                  {book} {currentChapter + 1}
                </span>

                {/* Reader Settings */}
                <Dropdown
                  dropdownClassName="border border-dropdown-border font-montserrat overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
                  className={' transition-all duration-500 ease-in-out'}
                  content={
                    <div className="bg-[var(--ds-blue)] p-6 rounded-lg flex flex-wrap justify-center gap-6 max-w-lg mx-auto">
                      {/* Setting Items */}
                      {[
                        {
                          icon: 'AA',
                          label: 'Font Size',
                          action: () => handleOptionClick('size'),
                        },
                        {
                          icon: 'A̲A̲',
                          label: 'Font Type',
                          action: () => handleOptionClick('type'),
                        },
                        {
                          icon: '≡',
                          label: 'Verse Display',
                          size: 'text-4xl',
                          action: () => handleOptionClick('verse'),
                        },
                        {
                          icon: 'Wc',
                          label: 'Word of Christ',
                          action: () => handleOptionClick('woc'),
                        },
                        {
                          icon: (
                            <Moon
                              className="w-4 h-4 text-[#0D4A74]"
                              style={{ fill: '#0D4A74' }}
                            />
                          ),
                          label: 'Night Mode',
                          toggle: true,
                          state: darkTheme,
                          action: () => setdarkTHeme((prev: any) => !prev),
                        },
                        {
                          icon: (
                            <HyperlinkIcon
                              className="w-6 h-6 text-[#0D4A74]"
                              style={{ fill: '#0D4A74' }}
                            />
                          ),
                          label: 'Reference',
                          toggle: true,
                          state: referenceState,
                          action: () => setreferenceState((prev: any) => !prev),
                        },
                        {
                          icon: '#',
                          label: "Strong's Num",
                          toggle: true,
                          size: 'text-xl',
                          state: showCodes,
                          action: () => setShowCodes((prev: any) => !prev), // Update the showStrongs recoil state
                        },
                        {
                          icon: '⟳',
                          label: 'Allow Rotation',
                          toggle: true,
                          size: 'text-xl',
                        },
                      ].map(
                        (
                          {
                            icon,
                            label,
                            toggle,
                            size = 'text-[13px]',
                            action,
                            state,
                          },
                          index
                        ) => (
                          <div
                            key={index}
                            className="flex flex-col items-center w-20 text-white cursor-pointer"
                          >
                            {/* Icon Circle */}
                            <div
                              className={`w-10 h-10 flex items-center justify-center bg-white rounded-full font-semibold ${size} text-[#0D4A74]`}
                              onClick={action}
                            >
                              {icon}
                            </div>
                            {/* Label */}
                            <p className="text-[11px] mt-1">{label}</p>
                            {/* Toggle Switch (if applicable) */}
                            {toggle && (
                              <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={state}
                                  onChange={action}
                                />
                                <div className="w-8 h-4 bg-[#78a2b8] peer-checked:bg-[#2dd1ff] rounded-full relative transition-all">
                                  <div
                                    className={`w-3 h-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${
                                      state
                                        ? 'left-[calc(100%-15px)]'
                                        : 'left-[2px]'
                                    }`}
                                  ></div>
                                </div>
                              </label>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  }
                >
                  {/* Settings icon */}
                  <div className="multi_layout_main_reader_settings_options_button ml-[1.5rem]">
                    <svg
                      className="multi_layout_main_reader_settings_options_button_ic"
                      width="16"
                      height="16"
                      viewBox="0 0 22 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.0728 7.59637L18.5022 6.60628C18.0195 5.76852 16.9498 5.47951 16.1109 5.96021C15.7116 6.19545 15.2351 6.26219 14.7865 6.14572C14.3379 6.02924 13.9541 5.73911 13.7196 5.33931C13.5688 5.08519 13.4878 4.79575 13.4847 4.50026C13.4983 4.02651 13.3196 3.56742 12.9892 3.22758C12.6589 2.88774 12.205 2.69609 11.7311 2.69629H10.5816C10.1172 2.69629 9.67206 2.88131 9.34452 3.21042C9.01698 3.53953 8.8341 3.9856 8.83633 4.44991C8.82257 5.40857 8.04146 6.17846 7.08271 6.17836C6.78721 6.1753 6.49777 6.09425 6.24365 5.94343C5.40474 5.46273 4.33504 5.75174 3.85235 6.5895L3.23984 7.59637C2.75773 8.43308 3.0428 9.50211 3.87752 9.98767C4.4201 10.3009 4.75434 10.8798 4.75434 11.5064C4.75434 12.1329 4.4201 12.7118 3.87752 13.025C3.04386 13.5073 2.75848 14.5738 3.23984 15.408L3.81879 16.4064C4.04495 16.8145 4.42441 17.1157 4.8732 17.2432C5.32199 17.3708 5.80311 17.3142 6.21009 17.0861C6.61018 16.8526 7.08694 16.7887 7.53442 16.9084C7.98189 17.0281 8.36299 17.3217 8.593 17.7238C8.74383 17.9779 8.82487 18.2673 8.82794 18.5628C8.82794 19.5313 9.61306 20.3164 10.5816 20.3164H11.7311C12.6963 20.3164 13.4801 19.5364 13.4847 18.5712C13.4824 18.1054 13.6665 17.6581 13.9958 17.3287C14.3252 16.9994 14.7725 16.8153 15.2383 16.8176C15.5331 16.8255 15.8213 16.9062 16.0774 17.0525C16.9141 17.5346 17.9831 17.2495 18.4687 16.4148L19.0728 15.408C19.3066 15.0066 19.3708 14.5286 19.2511 14.0797C19.1314 13.6309 18.8377 13.2483 18.4351 13.0167C18.0325 12.785 17.7388 12.4024 17.6191 11.9536C17.4994 11.5048 17.5636 11.0267 17.7974 10.6254C17.9495 10.3599 18.1696 10.1397 18.4351 9.98767C19.2648 9.50237 19.5492 8.43959 19.0728 7.60476V7.59637Z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.1605 13.9228C12.495 13.9228 13.5768 12.8409 13.5768 11.5064C13.5768 10.1719 12.495 9.09009 11.1605 9.09009C9.82597 9.09009 8.74414 10.1719 8.74414 11.5064C8.74414 12.8409 9.82597 13.9228 11.1605 13.9228Z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Dropdown>

                <div
                  className={clsx(
                    'multi_layout_main_reader_top_settings_options_select !w-[60%] justify-between',
                    { '!text-[#5C5B5B]': darkTheme }
                  )}
                >
                  <h6>KJV</h6>
                  <FaCaretDown className="multi_layout_main_reader_settings_options_select_ic" />
                </div>
              </div>
            </div>

            <div className="multi_layout_main_reader_settings">
              {/* <div className='multi_layout_main_reader_settings_toggles' >
                            <h5 className='bible'>Bible</h5>
                            <h5>Compare</h5>
                            <h5>Parallel</h5>
                            <h5>Hamony</h5>
                        </div> */}
            </div>
            {/* READER AREA  */}

            <div
              className={clsx(
                'multi_layout_main_reader_main h-[90%] ',
                { '!h-[90%]': notesView },
                { '!bg-[#233040] !text-white': darkTheme }
              )}
            >
              <div
                className={`multi_layout_main_reader_main_left hover:animate-pulse${
                  currentChapter < 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:animate-pulse'
                }`}
              >
                <MdOutlineChevronLeft
                  className="multi_layout_main_reader_main_right_ic"
                  onClick={handlePreviousChapter}
                />
              </div>
              <div className="multi_layout_main_reader_main_right hover:animate-pulse">
                <MdOutlineChevronRight
                  className="multi_layout_main_reader_main_right_ic"
                  onClick={handleNextChapter}
                />
              </div>
              {/* Latest XML with ref */}
              <div
                className="items-center p-2 m-1 h-[95%] flex flex-col !text-[1rem]"
                onClick={() => setShowModal(false)}
              >
                <span className="font-bold items-center !text-[1.2rem] flex justify-center">
                  {book} {currentChapter + 1}
                </span>

                {/* If the Verse display is on 2-Column */}
                {isTwoColumn ? (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Left Column (0 - 50%) */}
                    <div className="h-full overflow-y-auto">
                      <BibleDisplay
                        data={safePreferredBibleData as unknown as BibleData}
                        column="left"
                      />
                    </div>

                    {/* Right Column (51% - 100%) */}
                    <div className="h-full overflow-y-auto">
                      <BibleDisplay
                        data={safePreferredBibleData as unknown as BibleData}
                        column="right"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto">
                    <BibleDisplay
                      data={safePreferredBibleData as unknown as BibleData}
                    />
                  </div>
                )}

                {/* Popups */}
                {showModal && activeSetting === 'size' && (
                  <FontSizeSelector handleClose={() => setShowModal(false)} />
                )}
                {showModal && activeSetting === 'type' && (
                  <FontTypeSelector handleClose={() => setShowModal(false)} />
                )}
                {showModal && activeSetting === 'woc' && (
                  <WordofChristColor handleClose={() => setShowModal(false)} />
                )}
                {showModal && activeSetting === 'verse' && (
                  <VerseDisplaySelector />
                )}
                {showModal && activeSetting === 'highlight' && (
                  <HighlightSelector />
                )}
              </div>
            </div>
          </div>

          {/* Reference Pane */}
          {referenceView && (
            <div
              className="multi_layout_main_side reference !text-[0.6rem]"
              style={{ gridArea: 'side' }}
            >
              <div className="multi_layout_main_side_top">
                <div
                  className={clsx('multi_layout_main_side_settings_select', {
                    '!bg-[#cacaca] !text-[#5C5B5B]': darkTheme,
                  })}
                >
                  <span className="block whitespace-nowrap">
                    ROR Cross References
                  </span>
                </div>

                <IoMdLink className="multi_layout_main_side_settings_select_ic" />
              </div>

              <div
                className={clsx(
                  'multi_layout_main_side_main overflow-auto',
                  { '!h-[90%]': !notesView },
                  { '!bg-[#233040] !text-white': darkTheme }
                )}
              >
                <h5
                  className={clsx('multi_layout_main_side_main_bP', {
                    '!bg-[#233040] !text-white': darkTheme,
                  })}
                >
                  Genesis 1:2
                </h5>

                <p>
                  without: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span>
                </p>
                <p>
                  spirit: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span>
                </p>
              </div>
            </div>
          )}

          {/* Notes & Audio Pane */}
          {notesView && (
            <div
              className={clsx('multi_layout_main_btm Notes', {
                '!bg-[#233040] !text-[#5C5B5B]': darkTheme,
              })}
              style={{ gridArea: 'notes' }}
            >
              {/* Conditional Rendering */}
              {isAudioView ? (
                // 🔊 AUDIO PLAYER VIEW
                <div className="w-full h-full px-4 py-2">
                  <AudioPlayer
                    sku={recoilSKU}
                    src={audioSrc}
                    title={`${book} ${currentChapter + 1}`}
                    image="assets/bible/bible3.png"
                    onNext={handleNextChapter}
                    onPrev={handlePreviousChapter}
                  />
                </div>
              ) : (
                // 📝 NOTES VIEW
                <div className="multi_layout_main_btm_top">
                  <div className="multi_layout_main_btm_top_left">
                    <button>
                      <BsJournalText className="btn_ic" />
                      Journal
                    </button>

                    <button>
                      <LiaBookReaderSolid className="btn_ic" />
                      Study
                    </button>

                    <button>
                      <TfiPencil className="btn_ic" />
                      Topic
                    </button>
                  </div>

                  <div className="multi_layout_main_btm_top_right">
                    <div className="multi_layout_main_btm_top_right_select">
                      <h6>Styles</h6>
                      <FaCaretDown className="multi_layout_main_btm_top_right_select_ic" />
                    </div>
                    <button className="multi_layout_main_btm_top_right_btn">
                      <CiTextAlignLeft className="multi_layout_main_btm_top_right_btn_ic" />
                    </button>
                    <button className="multi_layout_main_btm_top_right_btn">
                      <CiTextAlignCenter className="multi_layout_main_btm_top_right_btn_ic" />
                    </button>
                    <button className="multi_layout_main_btm_top_right_btn">
                      <CiTextAlignJustify className="multi_layout_main_btm_top_right_btn_ic" />
                    </button>
                    <button className="multi_layout_main_btm_top_right_btn">
                      <CiTextAlignRight className="multi_layout_main_btm_top_right_btn_ic" />
                    </button>
                    <div className="multi_layout_main_btm_top_right_select">
                      <h6>Spacing</h6>
                      <FaCaretDown className="multi_layout_main_btm_top_right_select_ic" />
                    </div>
                    <div
                      className="multi_layout_main_btm_top_right_select"
                      style={{
                        marginRight: 0,
                      }}
                    >
                      <h6>Lists</h6>
                      <FaCaretDown className="multi_layout_main_btm_top_right_select_ic" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dictionary Pane*/}

        {dictionaryView && (
          <div
            className={clsx('multi_layout_right Dictionary flex-col', {
              '!bg-[#233040] !text-white': darkTheme,
            })}
          >
            <div className="multi_layout_right_top !h-[2rem]">
              <div className="multi_layout_right_top_search mr-2 !w-[65%]">
                <FiSearch className="multi_layout_right_top_search_ic1  " />
                <input
                  type="text"
                  className="w-[70%]"
                  placeholder="Aaron"
                  value={'Aaron'}
                />
                <IoIosCloseCircleOutline className="multi_layout_right_top_search_ic2 " />
              </div>

              <div className="multi_layout_right_top_link !w-[30%]">
                <Link className="multi_layout_main_side_top_link_ic" />
              </div>
            </div>

            <div className="multi_layout_right_count">
              <div className="multi_layout_right_counter">
                <span>Count: 13/141</span>
                {/* <FaCaretDown className='multi_layout_main_side_count_ic' /> */}
              </div>
            </div>

            <div
              className={clsx('multi_layout_right_main overflow-auto', {
                '!bg-[#233040] !text-white': darkTheme,
              })}
            >
              {/* results */}
              <div className="overflow-auto h-[calc(44vh-120px)] p-1">
                {/* {concordance?.loading && <div>Loading...</div>} */}
                {!concordance ||
                  (concordance?.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No concordance results found.
                    </div>
                  ))}
                {concordance?.map((r, idx) => (
                  <div key={idx} className="border-b py-2">
                    <div className="text-[13px] font-semibold">
                      {r.bibleLink ?? r.ref ?? ''}
                    </div>
                    <div className="text-[13px]">
                      {r.snippet ??
                        (r.raw ? JSON.stringify(r.raw).slice(0, 200) : '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="multi_layout_right_split">
              <div className="multi_layout_right_split_search">
                <FiSearch className="multi_layout_right_split_search_ic1" />
                <input type="text" value={selectedCode} />
                <IoIosCloseCircleOutline className="multi_layout_right_split_search_ic2" />
              </div>

              <div className="multi_layout_right_split_settings_select">
                <h6>Strong</h6>
                <FaCaretDown className="multi_layout_right_split_settings_select_ic" />
              </div>
            </div>

            <div
              className={clsx('multi_layout_right_main overflow-y-auto  ', {
                '!bg-[#233040] !text-white': darkTheme,
              })}
            >
              <h5 className="multi_layout_right_main_bP  "> {selectedCode}</h5>
              {/* Meaning of the Selected Strongs as fetched */}
              <p className="justify-center !text-[14px]">
                {selectedCodeMeaning.slice(20)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Multilayout;
