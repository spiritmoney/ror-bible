
import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import clsx from 'clsx';
import { DarkThemeAtom, selectedStrongsAtom } from 'store/atoms/general';
import { FiSearch } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";

interface DictionaryPaneProps {
  visible: boolean;
}

const DictionaryPane = ({ visible }: DictionaryPaneProps) => {
  const darkTheme = useRecoilValue(DarkThemeAtom);
  const [selectedCode] = useRecoilState(selectedStrongsAtom);
  
  if (!visible) return null;
  
  return (
    <div className={clsx('multi_layout_right Dictionary flex-col', { '!bg-[#233040] !text-white': darkTheme })}>
      {/* Top search */}
      <div className='multi_layout_right_top !h-[2rem]'>
        <div className='multi_layout_right_top_search mr-2 !w-[65%] rounded'>
          <FiSearch className='multi_layout_right_top_search_ic1' />
          <input type='text' className='w-[50%]' />
          <IoIosCloseCircleOutline className='multi_layout_right_top_search_ic2' />
        </div>
        <div className='multi_layout_main_side_top_link !w-[30%]'>
          <CiViewList className='multi_layout_main_side_top_link_ic' />
        </div>
      </div>

      {/* Nave selector */}
      <div className='multi_layout_main_side_settings'>
        <div className='multi_layout_main_side_settings_select'>
          <h6>Nave</h6>
          <FaCaretDown className='multi_layout_main_side_settings_select_ic' />
        </div>
      </div>

      {/* Dictionary content */}
      <div className={clsx('multi_layout_right_main overflow-auto', { '!bg-[#233040] !text-white': darkTheme })}>
        <h5 className={clsx('multi_layout_right_main_bP', { '!bg-[#233040] !text-white': darkTheme })}>Aaron</h5>
        <p>linage of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>marraige of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>children of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>decendants of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>Meets moses in the wilderness and is made</p>

        <p>linage of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>marraige of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>children of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>decendants of: <span>Job 26:7; Isa:18; Jer 4:23; nah 2:10</span></p>
        <p>Meets moses in the wilderness and is made</p>
      </div>

      {/* Strong's section */}
      <div className='multi_layout_right_split'>
        <div className='multi_layout_right_split_search'>
          <FiSearch className='multi_layout_right_split_search_ic1' />
          <input type='text' />
          <IoIosCloseCircleOutline className='multi_layout_right_split_search_ic2' />
        </div>
        <div className='multi_layout_right_split_settings_select'>
          <h6>Strong</h6>
          <FaCaretDown className='multi_layout_right_split_settings_select_ic' />
        </div>
      </div>

      {/* Strong's content */}
      <div className={clsx('multi_layout_right_main', { '!bg-[#233040] !text-white': darkTheme })}>
        <h5 className='multi_layout_right_main_bP'>{selectedCode}</h5>
        <p className='justify-center'>Meets moses in the wilderness and is made</p>
      </div>
    </div>
  );
};

export default DictionaryPane;
