import React, { useEffect, useState, useRef } from 'react';
import { BibleData } from './BibleTypes.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FontSizeAtom, FontTypeAtom, WordofChristAtom, currentBookAtom, currentChapterAtom, currentChapterLengthAtom, readBookAtom, selectedStrongsAtom, selectedVerseAtom, showStrongsAtom, totalVersesAtom, verseDisplayState } from 'store/atoms/general';

interface BibleDisplayProps {
  data: BibleData;
  column?: "left" | "right"; 
}
const BibleDisplay: React.FC<BibleDisplayProps> = ({ data, column }) => {
  const [currentBookIndex, setCurrentBookIndex] = useRecoilState<number>(currentBookAtom);
  const [currentChapterIndex, setCurrentChapterIndex] = useRecoilState<number>(currentChapterAtom);
  const [currentChapterLength, setcurrentChapterLength] = useRecoilState<number>(currentChapterLengthAtom);
  const [versesLength, setVersesLength] = useRecoilState<number>(totalVersesAtom);
  const [book, setBook] = useRecoilState(readBookAtom);
  const verseRefs = useRef<{ [key: number]: HTMLParagraphElement | null }>({});
  const [selectedVerse, setSelectedVerse] = useRecoilState(selectedVerseAtom);
  const [selectedCode, setSelectedCode] = useRecoilState(selectedStrongsAtom);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showCodes, setShowCodes] = useRecoilState(showStrongsAtom);
  const [fontSize, setFontSize] = useRecoilState(FontSizeAtom);
  const [fontType, setFontType] = useRecoilState(FontTypeAtom);
  const currentBook = data.book.will.name[currentBookIndex];
  const [selectedColor, setSelectedColor] = useRecoilState(WordofChristAtom);
  const verseDisplay = useRecoilValue(verseDisplayState);
  const isTwoColumn = verseDisplay === "two";

  const totalChapters = currentBook?.chapters?.chapter?.length || 0;
  const currentChapter = currentBook?.chapters?.chapter[currentChapterIndex];
  const verses = currentChapter?.verse || [];
  const totalVerses = verses.length;

  const half = Math.ceil(verses.length / 2);
  const firstColumn = verses.slice(0, half);
  const secondColumn = verses.slice(half);
  const versesToShow = column === "left" ? firstColumn : column === "right" ? secondColumn : verses;


  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [arrowDirection, setArrowDirection] = useState<"top" | "bottom">("top");

  const handleStrgClick = (event: React.MouseEvent<HTMLSpanElement>, strongsCode: string) => {
    if (!event.currentTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 200;
    const popupHeight = 100;
    const gap = 10;

    let left = rect.left + rect.width - popupWidth;
    let top = rect.bottom + gap;
    let arrow: "top" | "bottom" = "top";

    if (top + popupHeight > window.innerHeight) {
      top = rect.top - popupHeight - gap;
      arrow = "bottom";
    }

    setPopupPosition({ top, left });
    setArrowDirection(arrow);
    setIsPopupOpen(true);
    setSelectedCode(strongsCode);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedCode(null);
  };

  useEffect(() => {
    if (selectedVerse !== null) {
      verseRefs.current[selectedVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedVerse]);

  useEffect(() => {
    setBook(currentBook._text);
    setcurrentChapterLength(totalChapters);
    setVersesLength(totalVerses);
  }, [currentBook, totalChapters, totalVerses, setBook, setcurrentChapterLength, setVersesLength]);

  return (
    <div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
        {[firstColumn, secondColumn].map((column, columnIndex) => (
          <div key={columnIndex}>
            {column.map((verse, index) => {
              const words = Array.isArray(verse._text) ? verse._text : [verse._text];
              const strongsCodes = verse.st || [];
              const wocWords = verse.woc?._text ? (Array.isArray(verse.woc._text) ? verse.woc._text : [verse.woc._text]) : [];
              const wocCodes = verse.woc?.st || [];

              return (
                <p key={index} ref={(el) => (verseRefs.current[index] = el)} style={{ fontSize, fontFamily: fontType }} className={`p-2 rounded transition-all duration-500 ${selectedVerse === index ? "bg-blue-200 transition-fade" : ""}`}>
                  <strong>{verse.num?._attributes?.id}</strong>{" "}

                  {words.map((word, i) => {
                    const strongsCode = strongsCodes[i]?._text;
                    const isLastWord = i === words.length - 1;

                    return (
                      <span key={i}>
                        {showCodes ? (
                          <>
                            {word}{" "}
                            {strongsCode && (
                              <sup className="text-blue-300 text-[.7rem] mr-2 cursor-pointer hover:underline" onClick={(e) => handleStrgClick(e, strongsCode)}>
                                {strongsCode}
                              </sup>
                            )}
                          </>
                        ) : (
                          <span className={strongsCode && isLastWord ? "text-blue-300 cursor-pointer hover:underline" : ""} onClick={(e) => strongsCode && handleStrgClick(e, strongsCode)}>
                            {word}
                          </span>
                        )}
                        {" "}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibleDisplay;
