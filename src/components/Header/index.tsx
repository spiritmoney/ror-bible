import clsx from 'clsx';
import Dropdown from 'components/Dropdown';
import { AdminRoute, DashboardRoute } from 'navigation/routes';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import useGetSize from '../../hooks/useGetSize';
import { headerHeightAtom } from '../../store/atoms/size';
// import { newProjectModalAtom, projectAtom } from 'store/atoms/workspace';
// import style from './styles.module.scss';
import usePermission from 'hooks/usePermission';
import {
  DarkThemeAtom,
  ProdSKUAtom,
  SetNavAtom,
  SideNavAtom,
  layoutViewAtom,
  libraryAtom,
  readModeAtom,
  storeBackAtom,
  storeCartAtom,
} from '../../store/atoms/general';
import {
  editorSelectedAtom,
  editorUserCursorPositionAtom,
} from '../../store/atoms/workspace';
import home from 'assets/headerIcons/home_white.svg';
import read from 'assets/headerIcons/read_White.svg';
import readActive from 'assets/headerIcons/read_dark.svg';
import bookM from 'assets/headerIcons/Bookmark_White.svg';
import note from 'assets/headerIcons/note_White.svg';
import advancedActive from 'assets/headerIcons/Advance_Dark.svg';
import advanced from 'assets/headerIcons/Advance_White.svg';
import logo from '../../assets/website/logo.png';
import { copyTextToClipboard } from 'utils/general';
import { isJSON } from '../../utils/general';
import { IProject } from 'interface/project';
import {
  documentNotFound,
  editorFormats,
  editorModules,
} from '../EditorScreen/config';
import Input from 'components/Input';
import { FaCaretDown } from 'react-icons/fa';
import axios from 'axios';
import { IStoreProduct } from 'interface/storeProducts';
import { FaSearch } from 'react-icons/fa';
import { useUser } from 'hooks/useUser';
import Modal from 'components/Modal';
import Submit from 'components/Submit';
import CollabMode from 'components/CollabPopup';
import ProfileMenu from 'components/ProfileMenu';
import { useNavigate } from 'react-router-dom';
import { useRequireLogin } from 'hooks/useRequireLogin';
import { isElectron } from 'utils/general';

export interface IHeader {
  hidden?: boolean;
  quill?: any;
}

const Header: React.FunctionComponent<IHeader> = ({ hidden, quill }) => {
  const setHeaderHeight = useSetRecoilState(headerHeightAtom);
  const { height, ref } = useGetSize();
  const { user: authUser } = useUser();
  const navigate = useNavigate();
  const { requireLogin } = useRequireLogin();
  const [files, setFiles] = useState(false);
  const [search, setSearch] = useState('');
  const [books] = useState(false);
  const [history] = useState(false);
  const [help, setHelp] = useState(false);
  // const setShowNewProjectModal = useSetRecoilState(newProjectModalAtom);
  const { isSystemsAdmin, isAppManager } = usePermission();
  // const { saveDoc, isProjectInSync } = useProjects();
  const setShowLibrary = useSetRecoilState(libraryAtom);
  const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
  const selectedText = useRecoilValue(editorSelectedAtom);
  const cursorPosition = useRecoilValue(editorUserCursorPositionAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  // const [project, setProject] = useRecoilState<IProject | null>(projectAtom);
  const [readerMode, setReaderMode] = useRecoilState(readModeAtom);
  const [nav, setNav] = useRecoilState(SetNavAtom);
  const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
  const [sku, setSKU] = useRecoilState(ProdSKUAtom);
  const [productdet, setProductdet] = useState<IStoreProduct[]>([]);
  const [back, setBack] = useRecoilState(storeBackAtom);
  const [storeCart, setStoreCart] = useRecoilState(storeCartAtom);
  const [showSubmit, setShowSubmit] = useState(false);

  // local state for responsive top menu
  const [showTopLinksDropdown, setShowTopLinksDropdown] = useState(false);

  // Refs and state for sliding pill (sub-bar)
  const subBarContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  // Refs and state for top-nav underline
  const topNavContainerRef = useRef<HTMLUListElement | null>(null);
  const topItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [topUnderlineStyle, setTopUnderlineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  // state for which top item is active (default to Bible Online index 2)
  const [topActiveIndex, setTopActiveIndex] = useState<number>(2);

  useEffect(() => {
    setHeaderHeight(height);
  }, [height, setHeaderHeight]);

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
    setNav('store');
  };

  const handleReadView = () => {
    setNav('read');
  };

  const handleSubmit = () => {
    setShowSubmit(true);
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const [response] = await Promise.all([
          axios.get(
            `https://api.rorbible.plus/prem/productSearchWildcard.php?keyword=${search}`
          ),
        ]);

        setProductdet(response.data);
        // setStoreCart(search);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [sku, search]);

  const handleViewDetails = async (prodSKU: any) => {
    setSKU(prodSKU);
    setBack('store');
    setNav('product');
  };

  const isActive = (value: string) => nav === value;

  // helper to set sub-bar refs
  const setItemRef = (el: HTMLButtonElement | null, idx: number) => {
    itemRefs.current[idx] = el;
  };

  // helper to set top nav refs
  const setTopItemRef = (el: HTMLLIElement | null, idx: number) => {
    topItemRefs.current[idx] = el;
  };

  // Update pill position/size to match active item (sub-bar) AND update top-nav underline based on topActiveIndex
  const updatePillAndUnderline = () => {
    // --- Sub-bar sliding pill (flush to bottom) ---
    const mapping = ['store', 'read', 'note', 'bookmark', 'multi_layout'];
    const activeIndex = mapping.indexOf(nav);
    const container = subBarContainerRef.current;
    const target = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

    if (!container || !target) {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    } else {
      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const left = tRect.left - cRect.left;
      const containerHeight = container.clientHeight;
      const targetHeight = tRect.height;
      // place pill so its bottom equals container bottom (flush)
      const top = containerHeight - targetHeight;
      const width = tRect.width;
      const heightPx = targetHeight;
      setPillStyle({ left, top, width, height: heightPx, opacity: 1 });
    }

    // --- Top nav underline (follows topActiveIndex which is set on clicks) ---
    const topContainer = topNavContainerRef.current;
    const idx = topActiveIndex;
    if (!topContainer || idx == null) {
      setTopUnderlineStyle({ left: 0, width: 0, opacity: 0 });
    } else {
      const el = topItemRefs.current[idx];
      if (!el) {
        setTopUnderlineStyle({ left: 0, width: 0, opacity: 0 });
      } else {
        const pRect = el.getBoundingClientRect();
        const tcRect = topContainer.getBoundingClientRect();
        const left = pRect.left - tcRect.left;
        const width = pRect.width;
        setTopUnderlineStyle({ left, width, opacity: 1 });
      }
    }
  };

  useEffect(() => {
    // call on mount and whenever nav/topActiveIndex/productdet changes
    updatePillAndUnderline();
    // update on resize
    const onResize = () => {
      updatePillAndUnderline();
    };
    window.addEventListener('resize', onResize);
    // safe update after fonts/images load
    const t = setTimeout(updatePillAndUnderline, 120);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav, topActiveIndex, productdet]);

  return (
    <header ref={ref} className="w-full select-none">
      {/* TOP BAR: dark. Added long thin border line under this bar. */}
      <div className="w-full bg-[var(--ds-blue)] text-white font-montserrat">
        <div className="maxw-[1400px] mx-auto flex items-center px-9 py-3">
          {/* logo left */}
          <div
            className="flex items-center ml-0"
            onClick={() => navigate('/home')}
          >
            <img src={logo} alt="logo" className="w-[10rem] max-w-[160px]" />
          </div>

          {/* center links (hidden on small screens) */}
          <nav className="hidden md:flex flex-1 justify-end mr-10 ">
            <ul
              ref={topNavContainerRef as any}
              className="flex items-center gap-x-8 text-sm font-normal relative pb-2"
              style={{ borderBottom: '0.4px solid var(--ds-cyan)' }}
            >
              <li
                ref={el => setTopItemRef(el, 0)}
                onClick={() => {
                  setTopActiveIndex(0);
                  navigate('/about');
                }}
                className={clsx('hover:opacity-90 cursor-pointer', {
                  'text-white': topActiveIndex !== 0,
                })}
              >
                About
              </li>

              <li
                ref={el => setTopItemRef(el, 1)}
                onClick={() => {
                  setTopActiveIndex(1);
                  navigate('/product');
                }}
                className={clsx(
                  'hover:opacity-90 cursor-pointer flex items-center gap-x-1',
                  { 'text-white': topActiveIndex !== 1 }
                )}
              >
                <span>Products</span>
                {/* <FaCaretDown /> */}
              </li>

              <li
                ref={el => setTopItemRef(el, 2)}
                onClick={() => setTopActiveIndex(2)}
                className={clsx('hover:opacity-90 cursor-pointer relative', {
                  'text-white': topActiveIndex !== 2,
                })}
              >
                <span className="border-b-0">Bible Online</span>
              </li>

              <li
                ref={el => setTopItemRef(el, 3)}
                onClick={() => setTopActiveIndex(3)}
                className={clsx('hover:opacity-90 cursor-pointer', {
                  'text-white': topActiveIndex !== 3,
                })}
              >
                Blog
              </li>
              <li
                ref={el => setTopItemRef(el, 4)}
                onClick={() => {
                  setTopActiveIndex(4);
                  navigate('/partner');
                }}
                className={clsx('hover:opacity-90 cursor-pointer', {
                  'text-white': topActiveIndex !== 4,
                })}
              >
                Partner
              </li>
              <li
                ref={el => setTopItemRef(el, 5)}
                onClick={() => {
                  setTopActiveIndex(5);
                  navigate('/give');
                }}
                className={clsx('hover:opacity-90 cursor-pointer', {
                  'text-white': topActiveIndex !== 5,
                })}
              >
                Give
              </li>
              <li
                ref={el => setTopItemRef(el, 6)}
                onClick={() => setTopActiveIndex(6)}
                className={clsx('hover:opacity-90 cursor-pointer', {
                  'text-white': topActiveIndex !== 6,
                })}
              >
                Contact
              </li>

              {/* top underline */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: topUnderlineStyle.left,
                  bottom: -2,
                  height: 3,
                  width: topUnderlineStyle.width,
                  background: 'var(--ds-cyan)',
                  borderRadius: 2,
                  transition:
                    'left 220ms cubic-bezier(.2,.9,.2,1), width 220ms cubic-bezier(.2,.9,.2,1)',
                  opacity: topUnderlineStyle.opacity,
                }}
              />
            </ul>
          </nav>

          {/* top-right: menu toggler (mobile), search icon, bell, settings */}
          <div className="flex items-center gap-x-3 ml-auto">
            {/* on small screens show a button to toggle center links dropdown */}
            <button
              className="md:hidden px-2 py-1 rounded hover:bg-white/10"
              onClick={() => setShowTopLinksDropdown(prev => !prev)}
              aria-expanded={showTopLinksDropdown}
            >
              {/* simple menu icon */}
              <svg
                width="22"
                height="14"
                viewBox="0 0 22 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="22" height="2" rx="1" fill="#EBECEE" />
                <rect y="6" width="22" height="2" rx="1" fill="#EBECEE" />
                <rect y="12" width="22" height="2" rx="1" fill="#EBECEE" />
              </svg>
            </button>

            {/* search icon (kept simple) */}
            <div className="">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.4373 1.28919C10.1853 1.28919 12.145 2.04044 13.3304 3.23191C13.4757 3.37798 13.6263 3.51188 13.7593 3.66242C14.4289 4.42026 15.014 5.46466 15.265 6.45355C15.3299 6.7094 15.3842 6.87692 15.4229 7.15499C15.5735 8.23412 15.5527 9.01138 15.2729 10.078C15.0153 11.0605 14.5814 11.8592 13.968 12.6402C13.8897 12.7399 13.8546 12.7683 13.7723 12.8743C13.2252 13.5786 12.0492 14.3455 11.278 14.6768C6.56057 16.7033 1.31008 13.3178 1.31008 8.28136C1.31008 7.25382 1.57342 6.13695 1.93961 5.41664C2.04927 5.20099 2.10098 5.03068 2.22617 4.84385C2.3508 4.65791 2.44215 4.47576 2.57773 4.29686C2.7056 4.12812 2.82654 3.95133 2.96234 3.78304C3.08452 3.63183 3.26342 3.47481 3.40793 3.33019C4.5132 2.22482 6.23939 1.28919 8.4373 1.28919ZM7.95374 0.000111785H8.85888C9.41425 0.0295943 9.97297 0.113127 10.5295 0.251829C10.807 0.320957 11.0427 0.401476 11.3041 0.492828C11.9387 0.714729 12.1421 0.844049 12.6832 1.14502C13.7847 1.75778 14.5782 2.55404 15.3238 3.54338C15.7399 4.09539 16.1369 4.88986 16.3721 5.54194C16.4577 5.77958 16.5354 6.06313 16.6016 6.32814C17.2024 8.73722 16.6667 11.0504 15.2965 13.031L14.6874 13.8282C14.8739 14.1068 16.3962 15.5171 16.748 15.8692L18.7589 17.8817C19.0992 18.2184 20 18.8743 20 19.336C20 19.7244 19.7433 19.9659 19.4445 20H19.2972C19.1432 19.9826 18.9874 19.9104 18.857 19.7758C18.7269 19.6413 18.6346 19.5935 18.5052 19.4635L14.3847 15.381C14.2103 15.2066 13.8867 14.8445 13.7108 14.7266C12.6319 15.4491 12.9922 15.3402 11.5514 15.9657C11.1827 16.1257 10.6897 16.2783 10.2705 16.3645C8.52341 16.7238 6.8669 16.615 5.2171 15.9547C4.50092 15.6681 3.56451 15.1259 2.99763 14.6195L1.76338 13.3538C1.68353 13.2469 1.6249 13.1776 1.5398 13.0696C1.44365 12.9475 1.41539 12.8944 1.33555 12.7659C1.26698 12.6555 1.19405 12.5635 1.1343 12.4594C0.284219 10.9798 0 9.83098 0 7.96878C0 6.8356 0.408627 5.50899 0.793801 4.7391C1.02788 4.27117 1.25972 3.86802 1.55678 3.4709L2.47186 2.39389L3.30352 1.70206C4.68753 0.665367 6.29065 0.088336 7.95386 0L7.95374 0.000111785Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* profile avatar — shown once the user is logged in */}
            {authUser?.id ? (
              <ProfileMenu />
            ) : isElectron() ? (
              <button
                type="button"
                onClick={() => requireLogin()}
                className="rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 transition-colors ds-focus-visible font-montserrat"
              >
                Sign in
              </button>
            ) : null}
          </div>
        </div>

        {/* thin long border line under the top nav (spans full width) */}

        {/* small screen top links dropdown content */}
        {showTopLinksDropdown && (
          <div className="md:hidden bg-[var(--ds-teal)] px-4 py-3">
            <ul className="flex flex-col gap-y-2 text-sm text-white">
              <li className="py-1">About</li>
              <li className="py-1">Products</li>
              <li className="py-1 border-b-2 border-[var(--ds-cyan)]">Bible Online</li>
              <li className="py-1">Blog</li>
              <li className="py-1">Partner</li>
              <li className="py-1">Give</li>
              <li className="py-1">Contact</li>
            </ul>
          </div>
        )}
      </div>

      {/* ==============================================================  ============================================================== */}
      {/* SUB BAR (2nd Row) */}

      {/* Submit modal */}
      <Modal
        id={'submit'}
        hasHeader={false}
        content={<Submit />}
        isShown={showSubmit}
        setIsShown={setShowSubmit}
      />
    </header>
  );
};

export default Header;
