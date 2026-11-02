import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { DarkThemeAtom } from 'store/atoms/general';
import { IoMdLink } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";

interface ReferencePaneProps {
  visible: boolean;
  width: string;
  height: string;
}

const ReferencePane = ({ visible, width, height }: ReferencePaneProps) => {
  const darkTheme = useRecoilValue(DarkThemeAtom);
  
  if (!visible) return null;
  
  return (
    <div 
      className='multi_layout_main_side reference !text-[0.6rem]'
      style={{ width, height }}
    >
      <div className='multi_layout_main_side_top'>
        <h5>Book</h5>
        <h5>Chapter</h5>
        <h5>Verse</h5>
        <div className={clsx('multi_layout_main_side_top_link', { '!bg-[#cacaca] !text-[#5C5B5B]': darkTheme })}>
          <IoMdLink className='multi_layout_main_side_top_link_ic' />
        </div>
      </div>

      <div className='multi_layout_main_side_settings'>
        <div className={clsx('multi_layout_main_side_settings_select', { '!bg-[#cacaca] !text-[#5C5B5B]': darkTheme })}>
          <h6>TSK Cross References</h6>
          <FaCaretDown className='multi_layout_main_side_settings_select_ic' />
        </div>
      </div>

      <div className={clsx('multi_layout_main_side_main overflow-auto', { '!h-[90%]': height === '100%' }, { '!bg-[#233040] !text-white': darkTheme })}>
        <h5 className={clsx('multi_layout_main_side_main_bP', { '!bg-[#233040] !text-white': darkTheme })}>Genesis 1:2</h5>
        <p>without: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>spirit: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
      </div>
    </div>
  );
};

export default ReferencePane;