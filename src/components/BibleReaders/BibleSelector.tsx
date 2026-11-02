import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import clsx from 'clsx';
import {
  currentBookAtom,
  currentChapterAtom,
  selectedVerseAtom,
  totalVersesAtom,
  currentChapterLengthAtom,
  DarkThemeAtom,
} from 'store/atoms/general';
import { IBibleOT, IBibleNT } from 'interface/bible_array';

interface BibleSelectorProps {
  visible: boolean;
  height: string;
}

const BibleSelector = ({ visible, height }: BibleSelectorProps) => {
  const [selectTestament, setTestament] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] =
    useRecoilState<number>(currentBookAtom);
  const [currentChapter, setCurrentChapter] =
    useRecoilState<number>(currentChapterAtom);
  const [selectedVerse, setSelectedVerse] = useRecoilState(selectedVerseAtom);
  const currentChapterLength = useRecoilValue<number>(currentChapterLengthAtom);
  const versesLength = useRecoilValue<number>(totalVersesAtom);
  const darkTheme = useRecoilValue(DarkThemeAtom);

  const clampBookIndex = (bookIndex: number, books: string[]) => {
    if (!books.length) return 0;
    const maxIndex = books.length - 1;
    return Math.min(Math.max(bookIndex, 0), maxIndex);
  };

  const handleTestamentChange = (nextTestament: boolean) => {
    const nextBooks = nextTestament ? IBibleNT : IBibleOT;
    const nextBookIndex = clampBookIndex(currentBookIndex, nextBooks);
    setTestament(nextTestament);
    setCurrentBookIndex(nextBookIndex);
    setCurrentChapter(0);
  };

  const chapterNumbers = Array.from(
    { length: currentChapterLength },
    (_, i) => i + 1
  );
  const totalVerses = Array.from({ length: versesLength }, (_, i) => i + 1);

  const handleVerseClick = (index: number) => {
    setSelectedVerse(index + 2);

    // Remove highlight after 1.5 seconds
    setTimeout(() => {
      setSelectedVerse(null);
    }, 1500);
  };

  if (!visible) return null;

  return (
    <div
      className={clsx('multi_layout_main_bible', {
        '!bg-[#233040] !text-white': darkTheme,
      })}
      style={{ height }}
    >
      {/* Testament Selector */}
      <div className="multi_layout_main_bible_top !h-[2rem]">
        <div
          className={`multi_layout_main_bible_top_inactive ${!selectTestament ? 'bg-[#1673A1]' : 'bg-[#233040]'}`}
          onClick={() => handleTestamentChange(false)}
        >
          OT
        </div>
        <div
          className={`multi_layout_main_bible_top_inactive ${selectTestament ? 'bg-[#1673A1]' : 'bg-[#233040]'}`}
          onClick={() => handleTestamentChange(true)}
        >
          NT
        </div>
      </div>

      {/* Labels */}
      <div className="multi_layout_main_bible_title !h-[2.2rem]">
        <h5>Books</h5>
        <h5>Chapter</h5>
        <h5>Verse</h5>
      </div>

      {/* Bible Navigation Section */}
      <div
        className={clsx('multi_layout_main_bible_main', {
          '!bg-[#233040] !text-white': darkTheme,
        })}
        style={{ height: '85%' }}
      >
        {/* Book Selector */}
        <div
          className="multi_layout_main_bible_main_books mb-1"
          style={{ overflowY: 'auto' }}
        >
          {(selectTestament ? IBibleNT : IBibleOT).map((book, index) => {
            const safeIndex = clampBookIndex(
              index,
              selectTestament ? IBibleNT : IBibleOT
            );
            return (
              <h5
                key={index}
                className={clsx('cursor-pointer', {
                  '!text-white dark': darkTheme,
                })}
                onClick={() => {
                  setCurrentBookIndex(safeIndex);
                  setCurrentChapter(0);
                }}
                style={{
                  backgroundColor:
                    index === currentBookIndex ? '#1673A1' : 'transparent',
                  color: index === currentBookIndex ? 'white' : 'black',
                }}
              >
                {book}
              </h5>
            );
          })}
        </div>

        {/* Chapter Selector */}
        <div className="multi_layout_main_bible_main_verses flex-col mb-1">
          {chapterNumbers.map((chapter, index) => (
            <h5
              key={index}
              className={clsx('cursor-pointer', {
                '!text-white dark': darkTheme,
              })}
              onClick={() => setCurrentChapter(index)}
              style={{
                backgroundColor:
                  index === currentChapter ? '#1673A1' : 'transparent',
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
              onClick={() => handleVerseClick(index)}
              style={{
                backgroundColor:
                  selectedVerse === index + 2 ? '#1673A1' : 'transparent',
                color: selectedVerse === index + 2 ? 'white' : 'black',
              }}
            >
              {verse}
            </h5>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BibleSelector;
