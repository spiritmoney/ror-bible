import React, { useEffect, useState } from 'react';
import { BibleData } from './BibleTypes.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  DarkThemeAtom,
  FontSizeAtom,
  FontTypeAtom,
  WordofChristAtom,
  currentBookAtom,
  currentChapterAtom,
  currentChapterLengthAtom,
  readBookAtom,
  referenceStateAtom,
  referenceVerseAtom,
  verseInFocusAtom,
  selectedStrongsAtom,
  selectedVerseAtom,
  showStrongsAtom,
  totalVersesAtom,
  verseDisplayState,
  showReaderSettingsModal,
  SettingsActiveStateModal,
  highlightedVersesState,
  bookMarkedVersesAtom,
  SetNavAtom,
} from 'store/atoms/general';
import { useRef } from 'react';
import clsx from 'clsx';
import { ReactComponent as Highlight } from 'assets/highlight_icon.svg';
import { ReactComponent as Notes } from 'assets/notes.svg';
import { ReactComponent as Bookmark } from 'assets/bookmark.svg';
import { ReactComponent as BookmarkFill } from 'assets/bookmark_fill.svg';
import { ReactComponent as Share } from 'assets/share.svg';
import { ReactComponent as Top } from 'assets/tops.svg';
import HighlightSelector from 'screens/Pop-ups/highlightSelector';
import StrongDictionaryPopup from './StrongsDictionary';
import { useRequireAuth } from 'hooks/useRequireAuth';

interface BibleDisplayProps {
  data: BibleData;
  column?: 'left' | 'right';
}
type VerseContent = {
  text: string;
  wocText?: string; // Words of Christ, if applicable
  strongsCodes?: string[]; // Strong's codes, if any
  num?: string;
};

const BibleDisplay: React.FC<BibleDisplayProps> = ({ data, column }) => {
  const [currentBookIndex, setCurrentBookIndex] =
    useRecoilState<number>(currentBookAtom);
  const [currentChapterIndex, setCurrentChapterIndex] =
    useRecoilState<number>(currentChapterAtom);
  const [currentChapterLength, setcurrentChapterLength] =
    useRecoilState<number>(currentChapterLengthAtom);
  const [versesLength, setVersesLength] =
    useRecoilState<number>(totalVersesAtom);
  const [book, setBook] = useRecoilState(readBookAtom);
  const verseRefs = useRef<{ [key: number]: HTMLParagraphElement | null }>({});
  const [selectedVerse, setSelectedVerse] = useRecoilState(selectedVerseAtom);
  const [referenceVerse, setReferenceVerse] =
    useRecoilState(referenceVerseAtom);
  const [verseInFocus, setVerseInFocus] = useRecoilState(verseInFocusAtom);
  const [selectedCode, setSelectedCode] = useRecoilState(selectedStrongsAtom);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showCodes, setShowCodes] = useRecoilState(showStrongsAtom);
  const [fontSize, setFontSize] = useRecoilState(FontSizeAtom);
  const [fontType, setFontType] = useRecoilState(FontTypeAtom);
  const currentBook = data?.book?.will?.name?.[currentBookIndex];
  const [selectedColor, setSelectedColor] = useRecoilState(WordofChristAtom);
  const verseDisplay = useRecoilValue(verseDisplayState);
  const referenceState = useRecoilValue(referenceStateAtom);
  const isTwoColumn = verseDisplay === 'two';
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSetting, setActiveSetting] = useRecoilState(
    SettingsActiveStateModal
  );
  const [highlightedVerses, setHighlightedVerses] = useRecoilState(
    highlightedVersesState
  );
  const [bookMarkedVerses, setbookMarkedVerses] =
    useRecoilState(bookMarkedVersesAtom);
  const [verseContent, setVerseContent] = useState<VerseContent | null>(null);

  // Get the number of chapters in the selected book
  const totalChapters = currentBook?.chapters?.chapter?.length || 0;
  // Generate the list of chapters dynamically
  const chapterNumbers = Array.from({ length: totalChapters }, (_, i) => i + 1);
  const currentChapter = currentBook?.chapters?.chapter?.[currentChapterIndex];
  const verses = currentChapter?.verse || [];
  const totalVerses = verses.length;

  //calculate verse split for 2-column display
  const half = Math.ceil(verses.length / 2);
  const firstColumn = verses.slice(0, half);
  const secondColumn = verses.slice(half);
  const versesToShow =
    column === 'left'
      ? firstColumn
      : column === 'right'
        ? secondColumn
        : verses;

  // calculations for the Pop-up Location
  const [popupPosition, setPopupPosition] = useState<
    { top: number; left: number } | undefined
  >(undefined);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [arrowDirection, setArrowDirection] = useState<'top' | 'bottom'>('top');

  // calculations for the Utility Pop-up Location
  const [utilityPosition, setUtilityPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const utilityRef = useRef<HTMLDivElement | null>(null);
  const [utilityDirection, setUtilityArrowDirection] = useState<
    'top' | 'bottom'
  >('top');
  const [isUtilityPopupOpen, setIsUtilityPopupOpen] = useState(false);
  const [activeNav, setNav] = useRecoilState(SetNavAtom);
  const { requireAuth } = useRequireAuth();

  // Function to open strong's popup when clicked and fetch data using strong number
  const handleStrgClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    strongsCode: string
  ) => {
    if (!event.currentTarget) return; // Prevent null error

    const rect = event.currentTarget.getBoundingClientRect();
    console.log('Bounding Rect:', rect);

    const popupWidth = 200;
    const popupHeight = 100;
    const gap = 10;

    let left = rect.left + rect.width - popupWidth;
    let top = rect.bottom + gap;
    let arrow: 'top' | 'bottom' = 'top';
    // Adjust if off-screen
    if (top + popupHeight > window.innerHeight) {
      top = rect.top - popupHeight - gap;
      arrow = 'bottom';
      console.log('Adjusted Top:', top);
    }

    setPopupPosition({ top, left });
    setArrowDirection(arrow);
    setIsPopupOpen(true);
    setSelectedCode(strongsCode);
  };

  // Function to close strong's popup
  const closePopup = () => {
    setIsPopupOpen(false);
    // setSelectedCode(null);
    setReferenceVerse(null);
    setIsUtilityPopupOpen(false);
  };

  const highlighColorOptions = [
    '#b11902',
    '#000000',
    '#046f57',
    '#05445a',
    '#0c5a8b',
    '#606f10',
    '#6f3104',
    '#7b1579',
    '#056d0f',
  ];

  // using the the selected verse from the control, scroll to the top
  useEffect(() => {
    if (selectedVerse !== null) {
      verseRefs.current[selectedVerse]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedVerse]);

  const handleVerseClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    index: number,
    verse: any
  ) => {
    setReferenceVerse(index);
    // Selected id for the verse in focus (book+chap+verse)
    const VerseinFocus = `${book.slice(0, 3)}${currentChapterIndex}${index}`;
    setVerseInFocus(VerseinFocus as unknown as number);
    // =========================== // =========================== // ===========================
    let content = verse._text;
    let wocText = undefined;
    let num = verse.num?._attributes.id;
    let strongsCodes = verse.st || []; // Strong's codes for this verse

    if (verse.woc?._text) {
      wocText = Array.isArray(verse.woc._text)
        ? verse.woc._text.join(' ')
        : verse.woc._text;
      content += ` ${wocText}`; // Append WOC content to the base verse text
    }

    // Set the complex content structure
    setVerseContent({
      text: content,
      wocText,
      strongsCodes,
      num,
    });

    // =========================== // =========================== // ===========================

    if (!event.currentTarget) return; // Prevent null error

    const rect = event.currentTarget.getBoundingClientRect();
    console.log('Bounding Rect:', rect);

    const popupWidth = 200;
    const popupHeight = 100;
    const gap = 10;

    let left = rect.left + rect.width - popupWidth;
    let top = rect.bottom + gap;
    let arrow: 'top' | 'bottom' = 'top';
    // Adjust if off-screen
    if (top + popupHeight > window.innerHeight) {
      top = rect.top - popupHeight - gap;
      arrow = 'bottom';
      console.log('Adjusted Top:', top);
    }

    setUtilityPosition({ top, left });
    setUtilityArrowDirection(arrow);
    setIsUtilityPopupOpen(true);
    // Close Strongs Popup if open
    setIsPopupOpen(false);

    // Remove highlight after 2 seconds
    // setTimeout(() => {
    //   setReferenceVerse(null);
    // }, 1500);
  };

  const handleBookMarks = () => {
    if (!requireAuth()) return;
    setbookMarkedVerses([...bookMarkedVerses, verseInFocus]);
    setSelectedVerse(null);
    setReferenceVerse(null);
    setIsUtilityPopupOpen(false);

    console.log('bookmarks', bookMarkedVerses);
  };

  const handleTakeTop = () => {
    setSelectedVerse(referenceVerse);
    setIsUtilityPopupOpen(false);
    setReferenceVerse(null);

    // Remove highlight after 2 seconds
    setTimeout(() => {
      setSelectedVerse(null);
    }, 1500);
  };
  const handleCopy = () => {
    let verse = verseContent;
    if (!verse) return; // check if verseContent exists
    let verseText = verse.text;

    // Include Words of Christ (WOC) if they exist
    if (verse.wocText) {
      verseText += ` ${verse.wocText}`;
    }

    const additionalText = ` ${book.trim()} ${currentChapterIndex + 1}:${verse.num}`; // Customize as needed
    verseText = additionalText + '\n' + verseText; // Append the additional text before the verse text

    // // Optionally include Strong's codes if present (you can format them as needed)
    // if (verse.strongsCodes && verse.strongsCodes.length > 0) {
    //   verseText += ` (Strong's: ${verse.strongsCodes.join(", ")})`;
    // }

    // Copy the text to the clipboard
    navigator.clipboard.writeText(verseText);
    setIsUtilityPopupOpen(false);
    setReferenceVerse(null);
  };

  const handleHighlight = () => {
    if (!requireAuth()) return;
    setActiveSetting('highlight');
    setShowModal(true);
    setIsUtilityPopupOpen(false);

    setTimeout(() => {
      setReferenceVerse(null);
    }, 1500);
  };

  useEffect(() => {
    if (!currentBook) return;
    setBook(currentBook._text);
    setcurrentChapterLength(totalChapters);
    setVersesLength(totalVerses);
  }, [currentBook, totalChapters, totalVerses]);

  if (!currentBook) {
    return (
      <div className="p-4 text-sm text-gray-400">
        Bible content is unavailable for this selection.
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        {versesToShow.map((verse, index) => {
          const words = Array.isArray(verse._text)
            ? verse._text
            : [verse._text];
          const strongsCodes = verse.st || []; // Ensure it's an array

          const wocWords = verse.woc?._text
            ? Array.isArray(verse.woc._text)
              ? verse.woc._text
              : [verse.woc._text]
            : [];
          const wocCodes = verse.woc?.st || []; // Strong's codes for words of Christ
          // Generate the special ID for the verse
          const verseId = `${book.slice(0, 3)}${currentChapterIndex}${index}`;

          // Find the highlighted verse for this specific verseId
          const highlightedVerse = highlightedVerses.find(
            (highlight: { id: string }) => highlight.id === verseId
          );
          const isBookmarked = bookMarkedVerses.includes(verseId);
          return (
            <p
              key={index}
              ref={el => (verseRefs.current[index] = el)}
              style={{
                fontSize,
                fontFamily: fontType,
                backgroundColor: highlightedVerse ? highlightedVerse.color : '',
              }}
              className={`p-2 rounded transition-all duration-500
                ${selectedVerse === index ? 'bg-blue-200 transition-fade' : ''}
                ${referenceVerse === index ? 'bg-blue-200 transition-fade' : ''}
              `}
            >
              {/* Reference Verse click to display utility pop-up */}
              {isBookmarked && <BookmarkFill className="!w-3 !h-4" />}

              {verse.num?._attributes.id && referenceState && (
                <strong
                  className="underline mr-1 cursor-pointer text-[#b11902] "
                  onClick={e => index && handleVerseClick(e, index, verse)}
                >
                  {currentChapterIndex + 1}:{verse.num?._attributes?.id}
                </strong>
              )}
              {verse.num?._attributes.id && !referenceState && (
                <strong className=" mr-1 cursor-pointer text-[#000000] ">
                  {verse.num?._attributes?.id}
                </strong>
              )}

              {words.map((word, i) => {
                const strongsCode = strongsCodes[i]?._text;
                const isLastWord = i === words.length - 1;
                return (
                  <span key={i}>
                    {/* Normal words */}
                    {activeNav === 'read' ? (
                      // If nav is "Read", hide Strong's numbers entirely
                      <span>{word} </span>
                    ) : showCodes ? (
                      <>
                        {word}{' '}
                        {strongsCode && (
                          <sup
                            className="text-blue-300 text-[.7rem] mr-2 cursor-pointer hover:underline"
                            onClick={e => handleStrgClick(e, strongsCode)}
                          >
                            {strongsCode}
                          </sup>
                        )}
                      </>
                    ) : (
                      // Hide the Strong's Code but make the word clickable instead
                      <span
                        className={`${
                          strongsCode && isLastWord
                            ? 'text-blue-300 cursor-pointer hover:underline'
                            : ''
                        }`}
                        onClick={e =>
                          strongsCode && handleStrgClick(e, strongsCode)
                        }
                      >
                        {word}
                      </span>
                    )}{' '}
                  </span>
                );
              })}

              {/* Words of Christ (if available) */}
              {wocWords.length > 0 && (
                <span className="" style={{ color: selectedColor }}>
                  {' '}
                  {wocWords.map((wocWord, i) => {
                    const wocCode = wocCodes[i]?._text;
                    return (
                      <span key={`woc-${i}`}>
                        {wocWord}{' '}
                        {showCodes && wocCode && (
                          <sup
                            className="text-blue-300 text-[.7rem] mr-2 cursor-pointer hover:underline"
                            onClick={e => handleStrgClick(e, wocCode)}
                          >
                            {wocCode}
                          </sup>
                        )}
                      </span>
                    );
                  })}
                </span>
              )}
            </p>
          );
        })}

        {/* STRONGS POPUP COMPONENT */}
        {isPopupOpen && (
          <StrongDictionaryPopup
            isOpen={isPopupOpen}
            position={popupPosition}
            selectedCode={selectedCode}
            onClose={closePopup}
          />
        )}

        {showModal && activeSetting === 'highlight' && <HighlightSelector />}

        {/* UTILITY POPUP COMPONENT */}
        {isUtilityPopupOpen && utilityPosition && (
          <div
            ref={popupRef}
            className="fixed shadow-xl w-[340px] z-500 rounded-lg"
            style={{ top: utilityPosition.top, left: utilityPosition.left }}
          >
            {/* Arrow Placement Based on Position */}
            {arrowDirection === 'top' ? (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#1673A1]"></div>
            ) : (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-b-[#1673A1]"></div>
            )}
            {/* Section 2: Sub-header */}
            <div
              className={clsx(
                'flex bg-[#1673A1] absolute rounded top-0 right-[-4.1rem] shadow-[1px_3.52514px_18.9385px_rgba(12,28,49,0.1)]'
              )}
            >
              {/* Copy */}
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Copy"
                onClick={handleCopy}
              >
                <svg
                  width="15"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5956 3.92294H12.6413V2.32294C12.6413 1.80463 12.4354 1.30755 12.0689 0.941049C11.7024 0.57455 11.2053 0.368652 10.687 0.368652H2.14984C1.63153 0.368652 1.13445 0.57455 0.767954 0.941049C0.401454 1.30755 0.195557 1.80463 0.195557 2.32294V10.8601C0.197064 11.3779 0.403446 11.8741 0.769619 12.2403C1.13579 12.6065 1.632 12.8129 2.14984 12.8144H3.74984V14.7687C3.75132 15.1906 3.9188 15.595 4.21607 15.8944C4.51334 16.1938 4.91652 16.3642 5.33841 16.3687H14.5956C15.0194 16.3671 15.4255 16.1981 15.7253 15.8984C16.025 15.5986 16.1941 15.1925 16.1956 14.7687V5.51151C16.1911 5.08961 16.0207 4.68644 15.7213 4.38917C15.4219 4.0919 15.0175 3.92442 14.5956 3.92294ZM2.14984 11.7458C1.91494 11.7458 1.68965 11.6525 1.52355 11.4864C1.35744 11.3203 1.26413 11.095 1.26413 10.8601V2.32294C1.26337 2.20641 1.28576 2.0909 1.33 1.98309C1.37425 1.87529 1.43946 1.77735 1.52186 1.69495C1.60425 1.61255 1.7022 1.54734 1.81 1.5031C1.9178 1.45886 2.03332 1.43646 2.14984 1.43722H10.687C10.9219 1.43722 11.1472 1.53054 11.3133 1.69664C11.4794 1.86275 11.5727 2.08803 11.5727 2.32294V3.92294H5.33841C4.91848 3.9274 4.51701 4.0962 4.22005 4.39315C3.9231 4.6901 3.7543 5.09158 3.74984 5.51151V11.7458H2.14984ZM15.127 14.7687C15.127 14.9096 15.071 15.0448 14.9713 15.1444C14.8717 15.2441 14.7365 15.3001 14.5956 15.3001H5.33841C5.19747 15.3001 5.0623 15.2441 4.96264 15.1444C4.86298 15.0448 4.80699 14.9096 4.80699 14.7687V5.51151C4.80699 5.37057 4.86298 5.2354 4.96264 5.13573C5.0623 5.03607 5.19747 4.98008 5.33841 4.98008H14.5956C14.7365 4.98008 14.8717 5.03607 14.9713 5.13573C15.071 5.2354 15.127 5.37057 15.127 5.51151V14.7687Z"
                    fill="#ffffff"
                  />
                </svg>
              </span>
              {/* Notes */}
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Notes"
              >
                <Notes />
              </span>
              {/* Highlight */}
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Highlight"
                onClick={handleHighlight}
              >
                <Highlight />
              </span>
              {/* Bookmark */}
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Bookmark"
                onClick={handleBookMarks}
              >
                <Bookmark />
              </span>
              {/* Share */}
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Share"
              >
                <Share />
              </span>
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer  p-2.5 '
                )}
                title="Take to the Top"
                onClick={handleTakeTop}
              >
                <Top />
              </span>
              <span
                className={clsx(
                  ' flex items-center text-black[0.7] mb- gap-x-4 font-normal text-[0.75rem] h-8 cursor-pointer text-[#ffffff] p-2.5 '
                )}
                title="Close"
                onClick={closePopup}
              >
                X
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleDisplay;
