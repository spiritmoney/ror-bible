import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { 
  currentChapterAtom, readBookAtom, currentBookAtom, 
  DarkThemeAtom, showReaderSettingsModal, SettingsActiveStateModal, 
  FontSizeAtom, FontTypeAtom, verseDisplayState, referenceStateAtom, 
  showStrongsAtom, currentChapterLengthAtom
} from '../../store/atoms/general';
import { PiSpeakerHigh } from "react-icons/pi";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineChevronRight, MdOutlineChevronLeft } from "react-icons/md";
import Dropdown from '../Dropdown';
import HyperlinkIcon from "../../assets/hyperlink.svg";
import Moon from "../../assets/moon.svg";
import BibleDisplay from 'screens/JsonBibleDisplay/BibleDisplay';
import JsonBibleData from '../../BibleJson/OldKJVPremium.json';
import NewJsonBibleData from '../../BibleJson/NewKJVPremium.json';
import { BibleData } from 'screens/JsonBibleDisplay/BibleTypes';
import FontSizeSelector from '../../screens/Pop-ups/fontSizeSelector';
import FontTypeSelector from '../../screens/Pop-ups/fontTypeSelector';
import WordofChristColor from '../../screens/Pop-ups/wordOfChristSelector';
import VerseDisplaySelector from '../../screens/Pop-ups/verseDisplaySelector';
import HighlightSelector from '../../screens/Pop-ups/highlightSelector';
import ReaderTabs from './ReaderTabs';
import ReaderSettingsDropdown from './ReaderSettingsDropdown';

interface ReaderPaneProps {
  width: string;
  height: string;
}

const ReaderPane = ({ width, height }: ReaderPaneProps) => {
  const [reader, setReader] = useState('bible');
  const [currentBookIndex, setCurrentBookIndex] = useRecoilState<number>(currentBookAtom);
  const [currentChapter, setCurrentChapter] = useRecoilState<number>(currentChapterAtom);
  const [selectTestament, setTestament] = useState(false);
  const book = useRecoilValue(readBookAtom);
  const [darkTheme, setDarkTheme] = useRecoilState(DarkThemeAtom);
  const [showModal, setShowModal] = useRecoilState(showReaderSettingsModal);
  const [activeSetting, setActiveSetting] = useRecoilState(SettingsActiveStateModal);
  const [fontSize, setFontSize] = useRecoilState(FontSizeAtom);
  const [fontType, setFontType] = useRecoilState(FontTypeAtom);
  const [referenceState, setReferenceState] = useRecoilState(referenceStateAtom);
  const [showCodes, setShowCodes] = useRecoilState(showStrongsAtom);
  const currentChapterLength = useRecoilValue<number>(currentChapterLengthAtom);
  const verseDisplay = useRecoilValue(verseDisplayState);
  const isTwoColumn = verseDisplay === "two";

  const handleOptionClick = (type: "size" | "type" | "woc" | "verse" | "highlight") => {
    setActiveSetting(type);
    setShowModal(true);
  };

  const handleSelect = (value: string) => {
    if (activeSetting === "size") {
      setFontSize(value);
    } else if (activeSetting === "type") {
      setFontType(value);
    }
    setShowModal(false);
  };

  const handleNextChapter = () => {
    if (currentChapter + 1 < currentChapterLength) {
      setCurrentChapter((prev) => prev + 1);
    } else if (currentChapter + 1 === currentChapterLength) {
      setCurrentBookIndex((prev) => prev + 1);
      setCurrentChapter(0);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1);
      return;
    }
    if (currentChapter === 0 && currentBookIndex > 0) {
      setCurrentBookIndex((prev) => prev - 1);
      setTimeout(() => {
        setCurrentChapter(currentChapterLength - 1);
      }, 0);
    }
  };

  return (
    <div 
      className={clsx('multi_layout_main_reader', { '!h-[75%]': height === '75%' }, { '!bg-[#233040] !text-white': darkTheme })}
      style={{ width, height }}
    >
      {/* Top tabs */}
      <ReaderTabs activeTab={reader} onTabChange={setReader} />

      {/* Settings Bar */}
      <div className='multi_layout_main_reader_settings'>
        <div className='multi_layout_main_reader_settings_toggles'>
          <h5 className='bible'>Bible</h5>
          <h5>Compare</h5>
          <h5>Parallel</h5>
          <h5>Hamony</h5>
        </div>

        <div className='multi_layout_main_reader_settings_options w-[25%]'>
          <div className='multi_layout_main_reader_settings_options_button'>
            <PiSpeakerHigh className='multi_layout_main_reader_settings_options_button_ic' />
          </div>
          
          {/* Reader Settings Dropdown */}
          <ReaderSettingsDropdown 
            darkTheme={darkTheme}
            showCodes={showCodes}
            referenceState={referenceState}
            setDarkTheme={setDarkTheme}
            setReferenceState={setReferenceState}
            setShowCodes={setShowCodes}
            handleOptionClick={handleOptionClick}
          />

          <div className={clsx('multi_layout_main_reader_settings_options_select !w-[60%] justify-between', { '!text-[#5C5B5B]': darkTheme })}>
            <h6>KJV</h6>
            <FaCaretDown className='multi_layout_main_reader_settings_options_select_ic' />
          </div>
        </div>
      </div>

      {/* Bible Content Area */}
      <div className={clsx('multi_layout_main_reader_main h-[90%]', { '!h-[80%]': height === '75%' }, { '!bg-[#233040] !text-white': darkTheme })}>
        {/* Navigation arrows */}
        <div className={`multi_layout_main_reader_main_left hover:animate-pulse ${currentChapter < 1 ? 'opacity-50 cursor-not-allowed' : 'hover:animate-pulse'}`}>
          <MdOutlineChevronLeft className='multi_layout_main_reader_main_right_ic' onClick={handlePreviousChapter} />
        </div>
        <div className='multi_layout_main_reader_main_right hover:animate-pulse'>
          <MdOutlineChevronRight className='multi_layout_main_reader_main_right_ic' onClick={handleNextChapter} />
        </div>
        
        {/* Bible Content */}
        <div className="items-center p-2 m-1 h-[95%] flex flex-col !text-[1rem]" onClick={() => setShowModal(false)}>
          <span className="font-bold items-center !text-[1.2rem] flex justify-center">{book} {currentChapter + 1}</span>

          {/* Bible display based on column layout */}
          {isTwoColumn ? (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="h-full overflow-y-auto">
                <BibleDisplay
                  data={JsonBibleData as unknown as BibleData}
                  column="left"
                />
              </div>
              <div className="h-full overflow-y-auto">
                <BibleDisplay
                  data={JsonBibleData as unknown as BibleData}
                  column="right"
                />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <BibleDisplay
                data={JsonBibleData as unknown as BibleData}
              />
            </div>
          )}

          {/* Settings Modals */}
          {showModal && activeSetting === "size" && <FontSizeSelector handleClose={() => setShowModal(false)} />}
          {showModal && activeSetting === "type" && <FontTypeSelector handleClose={() => setShowModal(false)} />}
          {showModal && activeSetting === "woc" && <WordofChristColor handleClose={() => setShowModal(false)} />}
          {showModal && activeSetting === "verse" && <VerseDisplaySelector />}
          {showModal && activeSetting === "highlight" && <HighlightSelector />}
        </div>
      </div>
    </div>
  );
};

export default ReaderPane;
