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
import appLogoMark from '../../assets/logo.png.png';
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
import {
  openExternalUrl,
} from 'hooks/useOpenAppShellPage';
import {
  APP_TOP_NAV_WEBSITE_ORDER,
  APP_TOP_NAV_WEBSITE_URLS,
} from 'config/appTopNavWebsite';
import { TopBarSearchIcon } from 'components/Workspace/AppSidebarIcons';
import { isAppShell } from 'utils/appShell';

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
  const appShell = isAppShell();
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
  // state for which top item is active (Bible Online = index 0)
  const [topActiveIndex, setTopActiveIndex] = useState<number>(0);

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

  const handleAppSearch = () => {
    setNav('multi_layout');
    navigate('/bible-online');
    window.setTimeout(() => {
      const field = document.querySelector<HTMLInputElement>(
        '.multi_layout_right_top_search input, .multi_layout_right_split_search input'
      );
      field?.focus();
    }, 350);
  };

  const openTopWebsiteLink = (url: string) => {
    openExternalUrl(url);
  };

  const topNavItemClass = (index: number) =>
    clsx('app-top-nav-item ds-focus-visible', {
      'app-top-nav-item--active': topActiveIndex === index,
    });

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
    <header ref={ref} className="w-full select-none app-chrome-header">
      {/* TOP BAR: dark. Added long thin border line under this bar. */}
      <div className="w-full text-white font-montserrat app-top-bar">
        <div className="app-top-bar-inner">
          <div
            className="app-top-bar-logo flex items-center cursor-pointer"
            onClick={() =>
              navigate(appShell ? '/bible-online' : '/home')
            }
          >
            <img
              src={appShell ? appLogoMark : logo}
              alt="Rhapsody Bible"
              className={appShell ? 'app-top-bar-logo-mark' : undefined}
            />
          </div>

          <nav className="app-top-bar-nav hidden lg:flex">
            <ul
              ref={topNavContainerRef as any}
              className="app-top-nav-list relative"
            >
              <li ref={el => setTopItemRef(el, 0)}>
                <button
                  type="button"
                  className={topNavItemClass(0)}
                  onClick={() => {
                    setTopActiveIndex(0);
                    navigate('/bible-online');
                  }}
                >
                  Bible Online
                </button>
              </li>

              {APP_TOP_NAV_WEBSITE_ORDER.map((item, i) => {
                const index = i + 1;
                const open = () =>
                  openTopWebsiteLink(APP_TOP_NAV_WEBSITE_URLS[item.key]());
                return (
                  <li key={item.key} ref={el => setTopItemRef(el, index)}>
                    <button
                      type="button"
                      className={topNavItemClass(index)}
                      onClick={open}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}

            </ul>
          </nav>

          <div className="app-top-bar-actions">
            {/* on small screens show a button to toggle center links dropdown */}
            <button
              type="button"
              className="app-top-mobile-menu-btn ds-focus-visible lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setShowTopLinksDropdown(prev => !prev)}
              aria-expanded={showTopLinksDropdown}
              aria-label="Open navigation menu"
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

            <button
              type="button"
              className="app-top-search-btn ds-focus-visible min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Search in Bible reader"
              onClick={handleAppSearch}
            >
              <TopBarSearchIcon />
            </button>

            {/* profile avatar — shown once the user is logged in */}
            {authUser?.id ? (
              <ProfileMenu />
            ) : appShell && !authUser?.id ? (
              <button
                type="button"
                onClick={() => requireLogin()}
                className="app-top-sign-in ds-focus-visible font-montserrat"
              >
                Sign in
              </button>
            ) : null}
          </div>
        </div>

        {/* thin long border line under the top nav (spans full width) */}

        {/* small screen top links dropdown content */}
        {showTopLinksDropdown && (
          <div className="lg:hidden bg-[var(--ds-teal)] px-4 py-3">
            <ul className="flex flex-col gap-y-2 text-sm text-white">
              <li>
                <button
                  type="button"
                  className="w-full text-left py-1 border-b-2 border-[var(--ds-cyan)]"
                  onClick={() => {
                    setShowTopLinksDropdown(false);
                    setTopActiveIndex(0);
                    navigate('/bible-online');
                  }}
                >
                  Bible Online
                </button>
              </li>
              {APP_TOP_NAV_WEBSITE_ORDER.map(item => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="w-full text-left py-1"
                    onClick={() => {
                      setShowTopLinksDropdown(false);
                      openTopWebsiteLink(APP_TOP_NAV_WEBSITE_URLS[item.key]());
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
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
