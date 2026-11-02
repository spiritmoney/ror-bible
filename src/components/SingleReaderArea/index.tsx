// src/components/SingleReader.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import clsx from 'clsx';
import {
  SideNavAtom,
  readBookAtom,
  readChapterAtom,
  currentBookAtom,
  currentChapterLengthAtom,
  totalVersesAtom,
  selectedVerseAtom,
  verseDisplayState,
  SetNavAtom,
  DarkThemeAtom,
  currentChapterAtom,
  layoutViewAtom,
  bibleContentAtom,
  selectedStrongsAtom,
  FontSizeAtom,
  FontTypeAtom,
  ProdSKUAtom,
  SettingsActiveStateModal,
  condordanceResultAtom,
  referenceStateAtom,
  selectedStrongsMeaning,
  showAudioPlayer,
  showReaderSettingsModal,
  showStrongsAtom,
} from 'store/atoms/general';
import { footerHeightAtom, headerHeightAtom } from 'store/atoms/size';

import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';
import { IBibleOT, IBibleNT } from 'interface/bible_array';
import BibleDisplay from '../../screens/JsonBibleDisplay/BibleDisplay';
import JsonBibleData from 'BibleJson/OldKJVPremium.json';
import NewJsonBibleData from 'BibleJson/NewKJVPremium.json';

import Bible1 from '../../assets/bible/bible1.png';
import Bible2 from '../../assets/bible/bible2.png';
import Bible3 from '../../assets/bible/bible3.png';
import lang from 'assets/Frame-Lang.png';

import { IoIosClose } from 'react-icons/io';
import { FaCaretDown } from 'react-icons/fa';
import { ReactComponent as Speaker } from '../../assets/speaker.svg';
import { ReactComponent as ParalStudy } from '../../assets/paralStudy.svg';
import { ReactComponent as FontsSet } from '../../assets/fontsSet.svg';

import './singlereaderarea.scss';
import Dropdown from 'components/Dropdown';
import { BsJournalText } from 'react-icons/bs';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import { PiSpeakerHigh } from 'react-icons/pi';
import { BibleData } from 'screens/JsonBibleDisplay/BibleTypes';
import { ConcordanceItem } from 'screens/JsonBibleDisplay/StrongsDictionary';
import FontSizeSelector from 'screens/Pop-ups/fontSizeSelector';
import FontTypeSelector from 'screens/Pop-ups/fontTypeSelector';
import HighlightSelector from 'screens/Pop-ups/highlightSelector';
import VerseDisplaySelector from 'screens/Pop-ups/verseDisplaySelector';
import WordofChristColor from 'screens/Pop-ups/wordOfChristSelector';
import sideNav from 'screens/Website/sideNav';
import { ReactComponent as HyperlinkIcon } from 'assets/hyperlink.svg';
import { ReactComponent as Moon } from 'assets/moon.svg';
import { getBibleData, isValidBibleData } from 'utils/bibleStorage';

interface IReader {
  hidden: boolean;
}

/**
 * Minimal runtime typing for the JSON Bible shape we expect:
 * { "Genesis": { "1": ["verse1 text", "verse2 text", ...], "2": [...] }, "Exodus": {...} }
 */
type BibleDataMap = Record<string, Record<string, string[]>>;

type BibleRow = {
  image: string;
  name: string;
};

const ModalSection = ({ image, name }: BibleRow) => (
  <li className="bible_version_modal_section_li">
    <img src={image} alt={name} />
    <div>{name}</div>
  </li>
);

const SingleReader: React.FC<IReader> = ({ hidden }) => {
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

  const [selectBook, setSelectBook] = useState(false);
  const [selectVersion, setSelectVersion] = useState(false);
  const [isOldTestament, setIsOldTestament] = useState(true);

  const localFallbackBible = isOldTestament ? JsonBibleData : NewJsonBibleData;

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
      ? (isOldTestament
          ? cachedProductData.oldTestament
          : cachedProductData.newTestament) || localFallbackBible
      : localFallbackBible;

  const safePreferredBibleData = isValidBibleData(preferredBibleData)
    ? preferredBibleData
    : localFallbackBible;

  const handleOptionClick = (
    type: 'size' | 'type' | 'woc' | 'verse' | 'highlight'
  ) => {
    setActiveSetting(type);
    setShowModal(true);
  };

  const verseDisplay = useRecoilValue(verseDisplayState);
  const isTwoColumn = verseDisplay === 'two';

  // IMPORTANT: read existing Recoil values to avoid no-op writes
  const currentChapterLengthValue = useRecoilValue(currentChapterLengthAtom);
  const totalVersesValue = useRecoilValue(totalVersesAtom);

  const [, setCurrentChapterLength] = useRecoilState(currentChapterLengthAtom);
  const [, setTotalVerses] = useRecoilState(totalVersesAtom);

  const clampBookIndex = (bookIndex: number, bookList: string[]) => {
    if (!bookList.length) return 0;
    const maxIndex = bookList.length - 1;
    return Math.min(Math.max(bookIndex, 0), maxIndex);
  };

  const handleTestamentChange = (nextIsOT: boolean) => {
    const nextBooks = nextIsOT ? IBibleOT : IBibleNT;
    const nextBookIndex = clampBookIndex(currentBookIndex, nextBooks);
    setIsOldTestament(nextIsOT);
    setTestament(!nextIsOT);
    setCurrentBookIndex(nextBookIndex);
    setCurrentChapter(0);
    setChap(0);
    setBook(nextBooks[nextBookIndex] ?? nextBooks[0]);
  };

  const readerRef = useRef<HTMLDivElement>(null);

  const bibleData = preferredBibleData as unknown as BibleDataMap;
  const bibleList = isOldTestament ? IBibleOT : IBibleNT;

  // Generate arrays for UI lists based on current Recoil values (safe)
  const totalVersesArr = Array.from(
    { length: Math.max(1, totalVersesValue || 1) },
    (_, i) => i + 1
  );

  /**
   * Compute chapter & verse counts when book/chapter/isOT changes.
   * ONLY write to Recoil if the computed value differs from current Recoil value.
   */
  useEffect(() => {
    try {
      const bookKey = book || Object.keys(bibleData)[0];
      if (!bookKey) return;

      const currentBook = bibleData?.[bookKey];
      if (!currentBook) return;

      const chaptersCount = Object.keys(currentBook).length || 1;
      const chapterKey = String(chap + 1);
      const chapterArr = currentBook[chapterKey];
      const versesCount = Array.isArray(chapterArr) ? chapterArr.length : 1;

      setCurrentChapterLength((prev: number) =>
        prev !== chaptersCount ? chaptersCount : prev
      );
      setTotalVerses((prev: number) =>
        prev !== versesCount ? versesCount : prev
      );
    } catch (err) {}
  }, [
    book,
    chap,
    isOldTestament,
    bibleData,
    setCurrentChapterLength,
    setTotalVerses,
  ]);

  // Smooth scroll to selected verse
  useEffect(() => {
    if (!selectedVerse || !readerRef.current) return;
    const verseEl = readerRef.current.querySelector(
      `[data-verse="${selectedVerse}"]`
    ) as HTMLElement | null;
    if (verseEl) {
      verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      verseEl.classList.add('selected-verse-highlight');
      setTimeout(
        () => verseEl.classList.remove('selected-verse-highlight'),
        1400
      );
    }
  }, [selectedVerse]);

  useEffect(() => {
    console.log('selectTestament changed:', selectTestament);
  }, [selectTestament]);

  useEffect(() => {
    console.log('currentBookIndex changed:', currentBookIndex);
  }, [currentBookIndex]);

  // Modal toggles
  const handleBooks = () => {
    setSelectBook(s => !s);
    if (!selectBook) setSelectVersion(false);
  };
  const handleVersions = () => {
    setSelectVersion(s => !s);
    if (!selectVersion) setSelectBook(false);
  };

  const onSelectBook = (bookName: string, index: number) => {
    setCurrentBookIndex(index);
    setBook(bookName);
    setChap(0);
    setSelectBook(false);
  };

  const onSelectChapter = (chapterIndex: number) => {
    setChap(chapterIndex);
    setSelectBook(false);
  };

  const handleVerseClick = (index: number) => {
    setSelectedVerse(index + 2);
    setTimeout(() => setSelectedVerse(null), 1500);
  };

  // Looks up how many chapters a given book actually has directly from the
  // loaded Bible data (instead of relying on the `currentChapterLength`
  // Recoil value, which still reflects the book we are navigating AWAY
  // from until BibleDisplay's effect catches up on the next render).
  const getChapterCountForBook = (bookIndex: number): number => {
    const bookEntry = (safePreferredBibleData as any)?.book?.will?.name?.[
      bookIndex
    ];
    const count = bookEntry?.chapters?.chapter?.length;
    return typeof count === 'number' && count > 0 ? count : 1;
  };

  // Prev / Next chapter
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
      return;
    }
    if (currentChapter === 0 && currentBookIndex > 0) {
      // Move to the previous book and land on its ACTUAL last chapter.
      // (Previously this used the soon-to-be-stale `currentChapterLength`
      // of the book being left, which landed on the wrong chapter whenever
      // the two books didn't have the same chapter count.)
      const previousBookIndex = currentBookIndex - 1;
      const previousBookChapterCount = getChapterCountForBook(previousBookIndex);
      setCurrentBookIndex(previousBookIndex);
      setCurrentChapter(previousBookChapterCount - 1);
    }
  };

  const isAtVeryFirstChapter = currentBookIndex <= 0 && currentChapter <= 0;

  return (
    <div
      className="simple_reader w-full"
      style={{
        display: hidden ? 'none' : 'block',
      }}
    >
      <SubNav
        nav={nav}
        setNav={setNav}
        className="border-b-[5px] border-[#DFE1D8]"
      />

      <div className="simple_reader_shell">
        {/* Book / Chapter / Verse navigator */}
        <aside
          className={clsx('simple_reader_nav', {
            'simple_reader_nav--dark': darkTheme,
          })}
        >
          <div className="simple_reader_nav_testament">
            <button
              type="button"
              className={clsx('simple_reader_nav_testament_btn', {
                'is-active': !selectTestament,
              })}
              onClick={() => handleTestamentChange(true)}
            >
              Old Testament
            </button>
            <button
              type="button"
              className={clsx('simple_reader_nav_testament_btn', {
                'is-active': selectTestament,
              })}
              onClick={() => handleTestamentChange(false)}
            >
              New Testament
            </button>
          </div>

          <div className="simple_reader_nav_columns">
            {/* Book Selector */}
            <div className="simple_reader_nav_col">
              <span className="simple_reader_nav_col_label">Book</span>
              <div className="simple_reader_nav_col_list">
                {(selectTestament === false ? IBibleOT : IBibleNT).map(
                  (bookName, index) => {
                    const safeIndex = clampBookIndex(
                      index,
                      selectTestament === false ? IBibleOT : IBibleNT
                    );
                    return (
                      <button
                        type="button"
                        key={index}
                        className={clsx('simple_reader_nav_item', {
                          'is-active': index === currentBookIndex,
                        })}
                        onClick={() => {
                          setCurrentBookIndex(safeIndex);
                          setCurrentChapter(0);
                          setChap(0);
                          setBook(bookName);
                        }}
                      >
                        {bookName}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Chapter Selector */}
            <div className="simple_reader_nav_col simple_reader_nav_col--narrow">
              <span className="simple_reader_nav_col_label">Ch</span>
              <div className="simple_reader_nav_col_list">
                {chapterNumbers.map((chapter, index) => (
                  <button
                    type="button"
                    key={index}
                    className={clsx('simple_reader_nav_item', {
                      'is-active': index === currentChapter,
                    })}
                    onClick={() => setCurrentChapter(index)}
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            </div>

            {/* Verse Selector */}
            <div className="simple_reader_nav_col simple_reader_nav_col--narrow">
              <span className="simple_reader_nav_col_label">Vs</span>
              <div className="simple_reader_nav_col_list">
                {totalVerses.map((verse, index) => (
                  <button
                    type="button"
                    key={index}
                    className={clsx('simple_reader_nav_item', {
                      'is-active': selectedVerse === index + 2,
                    })}
                    onClick={() => handleVerseClick(index)}
                  >
                    {verse}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Reader */}
        <section
          className={clsx('simple_reader_content', {
            'simple_reader_content--dark': darkTheme,
          })}
        >
          <header className="simple_reader_content_header">
            <h2 className="simple_reader_content_header_title">
              {book} {currentChapter + 1}
            </h2>

            <div className="simple_reader_content_header_actions">
              <button
                type="button"
                className="simple_reader_icon_btn"
                title={isAudioView ? 'Hide audio player' : 'Listen to this chapter'}
                onClick={() => setisAudioView((prev: any) => !prev)}
              >
                {isAudioView ? <BsJournalText /> : <PiSpeakerHigh />}
              </button>

              {/* Reader Settings */}
              <Dropdown
                dropdownClassName="border border-dropdown-border font-raleway overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
                className={'transition-all duration-500 ease-in-out'}
                content={
                  <div className="bg-[#1673A1] p-6 rounded-lg flex flex-wrap justify-center gap-6 max-w-lg mx-auto">
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
                <button
                  type="button"
                  className="simple_reader_icon_btn"
                  title="Reader settings"
                >
                  <svg
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
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.1605 13.9228C12.495 13.9228 13.5768 12.8409 13.5768 11.5064C13.5768 10.1719 12.495 9.09009 11.1605 9.09009C9.82597 9.09009 8.74414 10.1719 8.74414 11.5064C8.74414 12.8409 9.82597 13.9228 11.1605 13.9228Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Dropdown>

              <div className="simple_reader_version_pill">
                <span>KJV</span>
                <FaCaretDown />
              </div>
            </div>
          </header>

          <div className="simple_reader_content_body">
            <button
              type="button"
              className="simple_reader_arrow simple_reader_arrow--left"
              onClick={handlePreviousChapter}
              disabled={isAtVeryFirstChapter}
              aria-label="Previous chapter"
            >
              <MdOutlineChevronLeft />
            </button>

            <div
              className="simple_reader_content_text"
              onClick={() => setShowModal(false)}
            >
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
                  <div className="h-full overflow-y-scroll">
                    <BibleDisplay
                      data={safePreferredBibleData as unknown as BibleData}
                      column="right"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-scroll">
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

            <button
              type="button"
              className="simple_reader_arrow simple_reader_arrow--right"
              onClick={handleNextChapter}
              aria-label="Next chapter"
            >
              <MdOutlineChevronRight />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleReader;

