import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { DarkThemeAtom } from 'store/atoms/general';
import { BsJournalText } from "react-icons/bs";
import { LiaBookReaderSolid } from "react-icons/lia";
import { TfiPencil } from "react-icons/tfi";
import { FaCaretDown } from "react-icons/fa";
import { 
  CiTextAlignLeft, CiTextAlignRight, 
  CiTextAlignCenter, CiTextAlignJustify 
} from "react-icons/ci";

interface NotesPaneProps {
  visible: boolean;
}

const NotesPane = ({ visible }: NotesPaneProps) => {
  const darkTheme = useRecoilValue(DarkThemeAtom);
  
  if (!visible) return null;
  
  return (
    <div 
      className={clsx('multi_layout_main_btm Notes !mt-1', { '!h-[25%]': visible }, { '!bg-[#233040] !text-[#5C5B5B]': darkTheme })}
    >
      <div className='multi_layout_main_btm_top'>
        <div className='multi_layout_main_btm_top_left'>
          <button>
            <BsJournalText className='btn_ic' />
            Journal
          </button>
          <button>
            <LiaBookReaderSolid className='btn_ic' />
            Study
          </button>
          <button>
            <TfiPencil className='btn_ic' />
            Topic
          </button>
        </div>

        <div className='multi_layout_main_btm_top_right'>
          <div className='multi_layout_main_btm_top_right_select'>
            <h6>Styles</h6>
            <FaCaretDown className='multi_layout_main_btm_top_right_select_ic' />
          </div>
          <button className='multi_layout_main_btm_top_right_btn'>
            <CiTextAlignLeft className='multi_layout_main_btm_top_right_btn_ic' />
          </button>
          <button className='multi_layout_main_btm_top_right_btn'>
            <CiTextAlignCenter className='multi_layout_main_btm_top_right_btn_ic' />
          </button>
          <button className='multi_layout_main_btm_top_right_btn'>
            <CiTextAlignJustify className='multi_layout_main_btm_top_right_btn_ic' />
          </button>
          <button className='multi_layout_main_btm_top_right_btn'>
            <CiTextAlignRight className='multi_layout_main_btm_top_right_btn_ic' />
          </button>
          <div className='multi_layout_main_btm_top_right_select'>
            <h6>Spacing</h6>
            <FaCaretDown className='multi_layout_main_btm_top_right_select_ic' />
          </div>
          <div className='multi_layout_main_btm_top_right_select' style={{ marginRight: 0 }}>
            <h6>Lists</h6>
            <FaCaretDown className='multi_layout_main_btm_top_right_select_ic' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPane;
