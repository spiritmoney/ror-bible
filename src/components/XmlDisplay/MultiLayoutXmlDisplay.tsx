import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { currentChapterAtom, readBookAtom, readChapterAtom } from 'store/atoms/general';
import { MdOutlineChevronRight, MdOutlineChevronLeft } from "react-icons/md";
import { parseString } from 'xml2js';

interface MLXmlDisplayProps {
  xmlContent: string;
}

const MultiLayoutXmlDisplay: React.FC<MLXmlDisplayProps> = ({ xmlContent }) => {
  const [parsedXml, setParsedXml] = useState<any>(null);
  // const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentChapter, setCurrentChapter] = useRecoilState<number>(currentChapterAtom);
  const [book, setBook] = useRecoilState(readBookAtom);
  const [chap, setChap] = useRecoilState(readChapterAtom);


 

  const parseXml = (xmlString: string) => {
    parseString(xmlString, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
      } else {
        setParsedXml(result);
      }
    });
  };
  useEffect(() => {
    parseXml(xmlContent);
  }, [xmlContent]);

  // const handleNextChapter = () => {
  //   setCurrentChapter((prevChapter) => prevChapter + 1);

  // };

  // const handlePreviousChapter = () => {
  //   setCurrentChapter((prevChapter) => Math.max(1, prevChapter - 1));

  // };

  const renderChapter = () => {
    if (!parsedXml) return null;

    const selectedBook = parsedXml.XMLBIBLE.BIBLEBOOK[0];
    const chapters = selectedBook.CHAPTER;
    const chapterIndex = currentChapter - 1;
    setChap(currentChapter);
    setBook(selectedBook.$.bname);

    if (chapterIndex >= chapters.length)
      return null;


    const chapter = chapters[chapterIndex];
    const chapterNumber = chapter.$.cnumber;
    const verses = chapter.VERS.map((verse: any) => (
      <div key={verse.$.vnumber}>
        {/* <span>Chapter {chapterNumber}, Verse {verse.$.vnumber}:</span> {verse._} */}
        <span>{verse.$.vnumber}:</span> {verse._}
      </div>
    ));

    return (
      <div className='flex items-center justify-between h-full overflow-y-auto'>
        {/* <span className='font-semibold cursor-pointer text-[20px] text-grey' onClick={handlePreviousChapter}> {'<'} </span> */}
        <div>
          {/* <h2>{selectedBook.$.bname} Chapter {chapterNumber}</h2>   */}
          <div className='w-[90%] !mb-13 mt-0 ml-auto mr-auto text-[0.7rem] leading-8' style={{ maxHeight: '65%', overflowY: 'auto' }}>{verses}</div>
        </div>
        <MdOutlineChevronRight className='multi_layout_main_reader_main_right_ic' />

        {/* <span className='font-semibold cursor-pointer text-[20px]' onClick={handleNextChapter}> {'>'} </span> */}

      </div>
    );
  };

  return <div>{renderChapter()}</div>;
};

export default MultiLayoutXmlDisplay;
