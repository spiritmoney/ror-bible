// multilayout.tsx
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { 
  currentChapterAtom, layoutViewAtom, readBookAtom, readChapterAtom, 
  bibleContentAtom, currentBookAtom, currentChapterLengthAtom, totalVersesAtom, 
  selectedVerseAtom, selectedStrongsAtom, showStrongsAtom, FontSizeAtom, 
  FontTypeAtom, verseDisplayState, DarkThemeAtom, referenceStateAtom,
  showReaderSettingsModal, SettingsActiveStateModal
} from 'store/atoms/general';
import BibleSelector from './BibleSelector';
import ReaderPane from './ReaderPane';
import ReferencePane from './ReferencePane';
import NotesPane from './NotesPane';
import DictionaryPane from './DictionaryPane';

type MultilayoutProps = {
  hidden: boolean;
}

const Multilayout = ({ hidden }: MultilayoutProps) => {
  // Layout state
  const [dictionaryView, setDictionaryView] = useState(true);
  const [referenceView, setReferenceView] = useState(true);
  const [notesView, setNotesView] = useState(true);
  const [verseToggle, setVerseToggle] = useState(true);
  const layoutView = useRecoilValue(layoutViewAtom);
  const darkTheme = useRecoilValue(DarkThemeAtom);
  
  // Apply layout view settings
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
    }
  }, [layoutView]);

  // Calculate reader pane width based on visible panels
  const getReaderPaneWidth = () => {
    if (!referenceView && !verseToggle) return '100%';
    if (!referenceView || !verseToggle) return '87%';
    if (!referenceView || !dictionaryView) return '70%';
    if (!dictionaryView) return '100%';
    return '60%';
  };

  return (
    <div 
      className={clsx("multi_layout", { '!bg-[#000000] !text-white': darkTheme })}
      style={{ display: hidden ? 'none' : 'flex' }} 
    >
      <div className="multi_layout_main" style={{ width: dictionaryView ? '84%' : '100%' }}>
        <BibleSelector 
          visible={verseToggle}
          height={!notesView ? '100%' : '72%'}
        />
        
        <ReaderPane 
          width={getReaderPaneWidth()}
          height={!notesView ? '100%' : '75%'} 
        />
        
        <ReferencePane 
          visible={referenceView}
          width={dictionaryView ? '24%' : '15%'}
          height={!notesView ? '100%' : '75%'} 
        />
        
        <NotesPane 
          visible={notesView}
        />
      </div>

      <DictionaryPane 
        visible={dictionaryView}
      />
    </div>
  );
};

export default Multilayout;
