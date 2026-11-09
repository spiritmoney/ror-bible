// SubNav.tsx — reader second bar (text tabs)
import React from 'react';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DarkThemeAtom, SideNavAtom, layoutViewAtom, readModeAtom } from 'store/atoms/general';
import Dropdown from 'components/Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export type SubNavProps = {
  nav: string;
  setNav: (v: string) => void;
  className?: string;
};

const SubNav: React.FC<SubNavProps> = ({ nav, setNav, className }) => {
  const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  const navigate = useNavigate();

  const handleHome = () => {
    setNav('multi_layout');
    navigate('/bible-online');
  };

  const tabs = [
    { id: 'store', label: 'Home', onClick: handleHome, active: nav === 'store' },
    {
      id: 'read',
      label: 'Read',
      onClick: () => {
        setNav('read');
        navigate('/read');
      },
      active: nav === 'read',
    },
    {
      id: 'multi_layout',
      label: 'Advanced',
      onClick: () => setNav('multi_layout'),
      active: nav === 'multi_layout',
    },
    { id: 'bookmark', label: 'Bookmark', onClick: () => {}, active: nav === 'bookmark' },
    { id: 'note', label: 'Note', onClick: () => {}, active: nav === 'note' },
  ];

  return (
    <div className={clsx('w-full app-subnav-bar', className)}>
      <div className="ds-container maxw-[1400px] mx-auto">
        <div className="app-subnav-inner flex items-center justify-between gap-2 min-h-[44px]">
          <div className="app-subnav-tabs flex items-end flex-wrap gap-0 min-w-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={clsx('app-subnav-tab ds-focus-visible', {
                  'app-subnav-tab--active': tab.active,
                })}
                title={tab.label}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="app-subnav-center flex-1 flex justify-center min-w-0 px-2">
            {nav === 'multi_layout' && (
              <Dropdown
                dropdownClassName="border border-dropdown-border font-montserrat overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
                className={clsx('w-full transition-all duration-500 ease-in-out', {
                  '!bg-[#233040] !text-white': DarkTheme,
                })}
                content={
                  <ul
                    className={clsx('flex flex-col gap-y-[2px] w-[100%', {
                      '!bg-[#233040] !text-white': DarkTheme,
                    })}
                  >
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('A')}>Show all view</li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('B')}>Bible, Commentary, Dictionary </li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('C')}>Bible, Commentary, Editor</li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('D')}>Bible, Dictionary, Editor</li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('E')}>Bible, Commentary </li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('F')}>Bible, Dictionary</li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('G')}>Bible, Editor</li>
                    <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.8125rem]" onClick={() => setLayoutView('H')}>Bible</li>
                  </ul>
                }
              >
                <div
                  className={clsx(
                    'app-subnav-layout-select selectView flex justify-center items-center bg-[#ffffff] cursor-pointer text-[#000000] text-[13px] p-1 rounded w-[100%] min-h-[44px]',
                    { '!bg-[#233040] !text-white': DarkTheme }
                  )}
                >
                  {layoutView === 'A'
                    ? 'Show all view'
                    : layoutView === 'B'
                      ? 'Bible, Commentary, Dictionary'
                      : layoutView === 'C'
                        ? 'Bible, Commentary, Editor'
                        : layoutView === 'D'
                          ? 'Bible, Dictionary, Editor'
                          : layoutView === 'E'
                            ? 'Bible, Commentary'
                            : layoutView === 'F'
                              ? 'Bible, Dictionary'
                              : layoutView === 'G'
                                ? 'Bible, Editor'
                                : layoutView === 'H'
                                  ? 'Bible'
                                  : 'Show all view'}
                  <FaCaretDown className="w-[1rem] h-[1rem] ml-auto animate-bounce" />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNav;
