// SubNav.tsx
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// If you prefer to import icons from parent, you can accept them as props.
// For convenience I've imported the same assets used in Header.
import home from 'assets/headerIcons/home_white.svg';
import homeActive from 'assets/headerIcons/home_Dark.svg';
import read from 'assets/headerIcons/read_White.svg';
import readActive from 'assets/headerIcons/read_dark.svg';
import bookM from 'assets/headerIcons/Bookmark_White.svg';
import note from 'assets/headerIcons/note_White.svg';
import advancedActive from 'assets/headerIcons/Advance_Dark.svg';
import advanced from 'assets/headerIcons/Advance_White.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DarkThemeAtom, SideNavAtom, layoutViewAtom, readModeAtom } from 'store/atoms/general';
import Dropdown from 'components/Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export type SubNavProps = {
    // current nav value (string) and setter from caller
    nav: string;
    setNav: (v: string) => void;

    // responsive: show/hide on small screens can be handled by caller
    className?: string;
};

const mapping = ['store', 'read', 'multi_layout', 'bookmark', 'note'];

const SubNav: React.FC<SubNavProps> = ({ nav, setNav, className }) => {
    // Refs for container and item buttons
    const subBarContainerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
    const [readerMode, setReaderMode] = useRecoilState(readModeAtom);
    const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
    const DarkTheme = useRecoilValue(DarkThemeAtom)
    const navigate = useNavigate();



    const [pillStyle, setPillStyle] = useState<{ left: number; top: number; width: number; height: number; opacity: number }>({
        left: 0, top: 0, width: 0, height: 0, opacity: 0
    });
    // helper to set item refs (keeps same order as mapping array)
    const setItemRef = (el: HTMLButtonElement | null, idx: number) => {
        itemRefs.current[idx] = el;
    };

    // calculates pill position & size based on current nav
    const updatePill = () => {
        const activeIndex = mapping.indexOf(nav);
        const container = subBarContainerRef.current;
        const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

        if (!container || !target) {
            setPillStyle(prev => ({ ...prev, opacity: 0 }));
            return;
        }

        const cRect = container.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const left = tRect.left - cRect.left;
        const width = tRect.width;

        // Fixed height for the pill
        const fixedHeight = 50; // adjust this value to fit your button height visually

        // Center it vertically inside the container
        // const top = (container.clientHeight - fixedHeight) / 2;
        const top = 0

        setPillStyle({ left, top, width, height: fixedHeight, opacity: 1 });
    };


    useEffect(() => {
        updatePill();
        const onResize = () => updatePill();
        window.addEventListener('resize', onResize);
        const t = setTimeout(updatePill, 120); // safe reflow after fonts/images load
        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(t);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nav]);

    const handleSideNav = () => {
        setSideNav((prev: boolean) => !prev);
    };
    const handleReadMode = () => {
        setReaderMode((prev: boolean) => !prev);
    };

    const handleMultiView = () => {
        setNav('multi_layout');
    };
    const handleHome = () => {
        setNav('multi_layout');
        navigate('/bible-online');
    };

    const handleReadView = () => {
        setNav('read');
    };


    // render
    return (
        <div className={clsx("w-full bg-[var(--ds-blue)]  ", className)}>
            <div className="maxw-[1400px] px-8 bg-[var(--ds-teal)] mx-auto "
                style={
                    {
                        borderTopLeftRadius: 10,
                    }
                }

            >
                <div className="flex items-center justify-between">


                    {/* center nav container */}
                    <div className="flex  justify-start">
                        <div className="relative" ref={subBarContainerRef}>
                            {/* pill */}
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    left: pillStyle.left,
                                    top: pillStyle.top,
                                    width: pillStyle.width,
                                    height: pillStyle.height,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    background: '#DFE1D8',
                                    transform: 'translateZ(0)',
                                    transition: 'left 240ms cubic-bezier(.2,.9,.2,1), width 240ms cubic-bezier(.2,.9,.2,1), top 240ms cubic-bezier(.2,.9,.2,1)',
                                    boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
                                    opacity: pillStyle.opacity,
                                    pointerEvents: 'none',
                                    zIndex: 0
                                }}
                            />

                            <div className="flex items-center justify-start gap-x-2 md:gap-x-4 relative z-10">
                                {/* Home */}
                                <button
                                    ref={(el) => setItemRef(el, 0)}
                                    onClick={() => {
                                        handleHome();
                                    }}
                                    className={clsx("flex flex-col items-center text-[10px] px-3 py-1 rounded transition-all duration-200 focus:outline-none relative", {
                                        "text-[#0f2230]": nav === 'store', "text-white": nav !== 'store'
                                    })}
                                    title="Home"
                                >
                                    <img src={nav === 'store' ? homeActive : home} alt="home" className="w-6" />
                                    <span className="mt-1 text-[10px]">Home</span>
                                </button>

                                {/* Read */}
                                <button
                                    ref={(el) => setItemRef(el, 1)}
                                    onClick={() => { setNav('read'); navigate('/read'); handleReadView && handleReadView(); }}
                                    className={clsx("flex flex-col items-center text-[10px] px-3 py-1 rounded transition-all duration-200 focus:outline-none relative", {
                                        "text-[#0f2230]": nav === 'read', "text-white": nav !== 'read'
                                    })}
                                    title="Read"
                                >
                                    <img src={nav === 'read' ? readActive : read} alt="read" className="w-6" />
                                    <span className="mt-1 text-[10px]">Read</span>
                                </button>

                                {/* Advance */}
                                <button
                                    ref={(el) => setItemRef(el, 2)}
                                    onClick={() => { setNav('multi_layout'); handleMultiView && handleMultiView(); }}
                                    className={clsx("flex flex-col items-center text-[10px] px-3 py-1 rounded transition-all duration-200 focus:outline-none relative", {
                                        "text-[#0f2230]": nav === 'multi_layout', "text-white": nav !== 'multi_layout'
                                    })}
                                    title="Advance View"
                                >
                                    <img src={nav === 'multi_layout' ? advancedActive : advanced} alt="advanced" className="w-5" />
                                    <span className="mt-1 text-[10px]">Advanced</span>
                                </button>



                                {/* Bookmark */}
                                <button
                                    // ref={(el) => setItemRef(el, 3)}
                                    // onClick={() => { setNav('bookmark'); }}
                                    className={clsx("flex flex-col items-center text-[10px] px-3 py-1 rounded transition-all duration-200 focus:outline-none relative", {
                                        "text-[#0f2230]": nav === 'bookmark', "text-white": nav !== 'bookmark'
                                    })}
                                    title="Bookmark"
                                >
                                    <img src={bookM} alt="bookmark" className="w-3" />
                                    <span className="mt-1 text-[10px]">Bookmark</span>
                                </button>

                                {/* Note */}
                                <button
                                    // ref={(el) => setItemRef(el, 2)}
                                    // onClick={() => { setNav('note'); }}
                                    className={clsx("flex flex-col items-center text-[10px] px-3 py-1 rounded transition-all duration-200 focus:outline-none relative", {
                                        "text-[#0f2230]": nav === 'note', "text-white": nav !== 'note'
                                    })}
                                    title="Note"
                                >
                                    <img src={note} alt="note" className="w-4" />
                                    <span className="mt-1 text-[10px]">Note</span>
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className='flex w-full items-center justify-center mr-auto ml-auto '>
                        {nav === 'multi_layout' &&
                            <Dropdown
                                dropdownClassName="border border-dropdown-border font-montserrat overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
                                className={clsx('w-full transition-all duration-500 ease-in-out', { '!bg-[#233040] !text-white': DarkTheme })}
                                content={
                                    <ul className={clsx("flex flex-col gap-y-[2px] w-[100%", { '!bg-[#233040] !text-white': DarkTheme })}>

                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('A')}>Show all view</li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('B')}>Bible, Commentary, Dictionary </li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('C')}>Bible, Commentary, Editor</li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('D')}>Bible, Dictionary, Editor</li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('E')}>Bible, Commentary </li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('F')}>Bible, Dictionary</li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('G')}>Bible, Editor</li>
                                        <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.6rem] " onClick={() => setLayoutView('H')}>Bible</li>

                                    </ul>
                                }
                            >
                                <div className={clsx('selectView flex justify-center ml-auto mr-auto items-center bg-[#ffffff] cursor-pointer  text-[#000000] text-[0.6rem] p-1 rounded w-[100%]', { '!bg-[#233040] !text-white': DarkTheme })}>
                                    {layoutView === 'A' ? 'Show all view' :
                                        layoutView === 'B' ? 'Bible, Commentary, Dictionary' :
                                            layoutView === 'C' ? 'Bible, Commentary, Editor' :
                                                layoutView === 'D' ? 'Bible, Dictionary, Editor' :
                                                    layoutView === 'E' ? 'Bible, Commentary' :
                                                        layoutView === 'F' ? 'Bible, Dictionary' :
                                                            layoutView === 'G' ? 'Bible, Editor' :
                                                                layoutView === 'H' ? 'Bible' :
                                                                    'Show all view'
                                    }
                                    <FaCaretDown className='w-[1rem] h-[1rem] ml-auto animate-bounce' />
                                </div>
                            </Dropdown>
                        }
                    </div>


                    {/* right icons */}
                    {/* Bell and Settings Icon */}
                    <div className="flex items-center ml-auto gap-x-3">
                        <svg className="bell mr-2 hidden md:block" width="18" height="18" viewBox="0 0 18 19" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_400_1096)">
                                <path d="M16.5647 11.6122C16.3057 11.3545 16.1003 11.048 15.9605 10.7105C15.8207 10.3729 15.7492 10.011 15.7502 9.64565V7.35815C15.7502 5.56794 15.039 3.85105 13.7732 2.58518C12.5073 1.31931 10.7904 0.608154 9.00018 0.608154C7.20997 0.608154 5.49308 1.31931 4.22721 2.58518C2.96134 3.85105 2.25018 5.56794 2.25018 7.35815V9.64565C2.25114 10.011 2.17964 10.3729 2.03984 10.7105C1.90003 11.048 1.69469 11.3545 1.43568 11.6122C1.10828 11.9395 0.885321 12.3566 0.794988 12.8107C0.704655 13.2648 0.751009 13.7355 0.92819 14.1632C1.10537 14.5909 1.40542 14.9565 1.79039 15.2137C2.17535 15.4709 2.62795 15.6082 3.09093 15.6082H5.32518C5.49732 16.4559 5.95723 17.218 6.62699 17.7654C7.29675 18.3129 8.13516 18.6119 9.00018 18.6119C9.8652 18.6119 10.7036 18.3129 11.3734 17.7654C12.0431 17.218 12.503 16.4559 12.6752 15.6082H14.9102C15.3732 15.6082 15.8258 15.4709 16.2107 15.2137C16.5957 14.9565 16.8957 14.5909 17.0729 14.1632C17.2501 13.7355 17.2965 13.2648 17.2061 12.8107C17.1158 12.3566 16.8928 11.9395 16.5654 11.6122H16.5647ZM9.00018 17.1082C8.53649 17.1062 8.08471 16.9611 7.70666 16.6926C7.3286 16.4241 7.04274 16.0453 6.88818 15.6082H11.1122C10.9576 16.0453 10.6718 16.4241 10.2937 16.6926C9.91565 16.9611 9.46388 17.1062 9.00018 17.1082ZM14.9094 14.1082H3.09093C2.92457 14.1083 2.76193 14.059 2.62357 13.9666C2.48522 13.8742 2.37738 13.7429 2.31371 13.5892C2.25003 13.4355 2.23338 13.2664 2.26586 13.1032C2.29834 12.9401 2.3785 12.7902 2.49618 12.6727C2.89492 12.276 3.21105 11.8043 3.4263 11.2847C3.64154 10.7652 3.75163 10.208 3.75018 9.64565V7.35815C3.75018 5.96577 4.3033 4.63041 5.28787 3.64584C6.27244 2.66128 7.60779 2.10815 9.00018 2.10815C10.3926 2.10815 11.7279 2.66128 12.7125 3.64584C13.6971 4.63041 14.2502 5.96577 14.2502 7.35815V9.64565C14.2487 10.208 14.3588 10.7652 14.5741 11.2847C14.7893 11.8043 15.1054 12.276 15.5042 12.6727C15.6219 12.7902 15.702 12.9401 15.7345 13.1032C15.767 13.2664 15.7503 13.4355 15.6867 13.5892C15.623 13.7429 15.5151 13.8742 15.3768 13.9666C15.2384 14.059 15.0758 14.1083 14.9094 14.1082Z" fill="#FFFFFF" />
                            </g>
                            <defs>
                                <clipPath id="clip0_400_1096">
                                    <rect width="18" height="18" fill="white" transform="translate(0 0.608154)" />
                                </clipPath>
                            </defs>
                        </svg>

                        <svg className="Settings cursor-pointer" width="21" height="23" viewBox="0 0 22 23" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.0728 7.59637L18.5022 6.60628C18.0195 5.76852 16.9498 5.47951 16.1109 5.96021C15.7116 6.19545 15.2351 6.26219 14.7865 6.14572C14.3379 6.02924 13.9541 5.73911 13.7196 5.33931C13.5688 5.08519 13.4878 4.79575 13.4847 4.50026C13.4983 4.02651 13.3196 3.56742 12.9892 3.22758C12.6589 2.88774 12.205 2.69609 11.7311 2.69629H10.5816C10.1172 2.69629 9.67206 2.88131 9.34452 3.21042C9.01698 3.53953 8.8341 3.9856 8.83633 4.44991C8.82257 5.40857 8.04146 6.17846 7.08271 6.17836C6.78721 6.1753 6.49777 6.09425 6.24365 5.94343C5.40474 5.46273 4.33504 5.75174 3.85235 6.5895L3.23984 7.59637C2.75773 8.43308 3.0428 9.50211 3.87752 9.98767C4.4201 10.3009 4.75434 10.8798 4.75434 11.5064C4.75434 12.1329 4.4201 12.7118 3.87752 13.025C3.04386 13.5073 2.75848 14.5738 3.23984 15.408L3.81879 16.4064C4.04495 16.8145 4.42441 17.1157 4.8732 17.2432C5.32199 17.3708 5.80311 17.3142 6.21009 17.0861C6.61018 16.8526 7.08694 16.7887 7.53442 16.9084C7.98189 17.0281 8.36299 17.3217 8.593 17.7238C8.74383 17.9779 8.82487 18.2673 8.82794 18.5628C8.82794 19.5313 9.61306 20.3164 10.5816 20.3164H11.7311C12.6963 20.3164 13.4801 19.5364 13.4847 18.5712C13.4824 18.1054 13.6665 17.6581 13.9958 17.3287C14.3252 16.9994 14.7725 16.8153 15.2383 16.8176C15.5331 16.8255 15.8213 16.9062 16.0774 17.0525C16.9141 17.5346 17.9831 17.2495 18.4687 16.4148L19.0728 15.408C19.3066 15.0066 19.3708 14.5286 19.2511 14.0797C19.1314 13.6309 18.8377 13.2483 18.4351 13.0167C18.0325 12.785 17.7388 12.4024 17.6191 11.9536C17.4994 11.5048 17.5636 11.0267 17.7974 10.6254C17.9495 10.3599 18.1696 10.1397 18.4351 9.98767C19.2648 9.50237 19.5492 8.43959 19.0728 7.60476V7.59637Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.1605 13.9228C12.495 13.9228 13.5768 12.8409 13.5768 11.5064C13.5768 10.1719 12.495 9.09009 11.1605 9.09009C9.82597 9.09009 8.74414 10.1719 8.74414 11.5064C8.74414 12.8409 9.82597 13.9228 11.1605 13.9228Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubNav;
