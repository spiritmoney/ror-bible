import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { footerHeightAtom, headerHeightAtom } from '../../store/atoms/size';
import Anotations from '../Anotations';
import AvailableBooks from '../AvailableBooks';
import Editor from '../EditorScreen';
import WorkspaceHeader from '../WorkspaceHeader';
import UtilityTools from 'components/Utility-Tools';
import clsx from 'clsx';
import { useRef } from 'react';
import useContextMenu from '../../hooks/useContextMenu';
import AdminSideMenu from 'components/AdminSideMenu';
// import style from './styles.module.scss';
import './styles.scss';
import {
  SetNavAtom,
  SideNavAtom,
  libraryAtom,
  readModeAtom,
} from 'store/atoms/general';
import { notificationsModalAtom } from 'store/atoms/workspace';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { LoginRoute } from 'navigation/routes';
import { saveAuthReturnPath } from 'utils/authReturnPath';
import {
  SidebarAlertsIcon,
  SidebarDownloadsIcon,
  SidebarFavouritesIcon,
  SidebarLibraryIcon,
  SidebarStoreIcon,
} from './AppSidebarIcons';
import lang from 'assets/Frame-Lang.png';
import { ReactComponent as Speaker } from '../../assets/speaker.svg';
import { ReactComponent as ParalStudy } from '../../assets/paralStudy.svg';
import { ReactComponent as FontsSet } from '../../assets/fontsSet.svg';
import { ReactComponent as Toggle } from '../../assets/hamburg.svg';
import { ReactComponent as ToggOn } from '../../assets/hamb.svg';
import { ReactComponent as Navarrow } from '../../assets/navArrow.svg';
import { ReactComponent as NavarrowOut } from '../../assets/navArrowOut.svg';
import SingleReader from 'components/SingleReaderArea';
import StoreHomePage from 'screens/Store/store_components';
import FavouritesHomePage from 'screens/Favourites/favourites_components';
import StoreBible from 'screens/Store/store_bible';
import StoreAudio from 'screens/Store/store_audio';
import StoreResources from 'screens/Store/store_resources';
import StoreTransalations from 'screens/Store/store_translations';
import Storefreesbiees from 'screens/Store/store_freesbies';
import ProductDetails from 'screens/Store/product_Details';
import Multilayout from 'screens/Multi_layout/multi_layout_component';
// import Multilayout from 'screens/Multi_layout/multi_layout_component/multiLayout2';
import DynamicProductDetails from 'screens/Store/dynamicProduct_Details';
import XmlToJsonConverter from 'screens/Xml2Json';

// Views that require a logged-in KingsChat user (opened via login-on-demand actions).
const PROTECTED_NAVS = [
  'store',
  'store_audio',
  'store_bible',
  'store_resources',
  'store_translations',
  'store_freesbies',
  'product',
  'fav',
];

const AppSidebarRailButton: React.FC<{
  label: string;
  active?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}> = ({ label, active, disabled, comingSoon, onClick, icon }) => (
  <li className="w-full">
    <button
      type="button"
      className={clsx('a-s-opt app-sidebar-item w-full', {
        'app-sidebar-item--active': Boolean(active) && !disabled,
        'app-sidebar-item--disabled': disabled,
        'app-sidebar-item--coming-soon': disabled && comingSoon,
      })}
      disabled={disabled}
      aria-disabled={disabled ? true : undefined}
      aria-label={label}
      title={disabled && comingSoon ? 'Coming soon' : label}
      onClick={disabled ? undefined : onClick}
    >
      <div className="left">
        <div className="a-s-logo app-sidebar-icon-wrap">{icon}</div>
        <div className="a-s-label app-sidebar-menu-label">{label}</div>
      </div>
    </button>
  </li>
);

export interface IWorkspace {
  setQuill?: React.Dispatch<any>;
  quill?: any;
  setSelected?: React.Dispatch<React.SetStateAction<string>>;
  selected?: string;
  setAnchor?: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  setShowContext?: React.Dispatch<React.SetStateAction<boolean>>;
  // nav?: string
}

const Workspace: React.FunctionComponent<IWorkspace> = ({
  quill,
  setQuill,
  selected,
  setSelected,
  setAnchor,
  setShowContext,
  // nav
}) => {
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
  const [nav, setNav] = useRecoilState(SetNavAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useUser();

  /** KingsChat session: use user.id (matches Sign in), not stale localStorage email alone. */
  const redirectToLoginIfNeeded = (): boolean => {
    if (user?.id) {
      return false;
    }
    const returnPath = location.pathname + location.search + location.hash;
    saveAuthReturnPath(returnPath);
    navigate(LoginRoute, { state: { from: returnPath } });
    return true;
  };

  React.useEffect(() => {
    if (PROTECTED_NAVS.includes(nav) && !isAuthenticated) {
      setNav('multi_layout');
    }
  }, [isAuthenticated, nav, setNav]);

  const handleFav = () => {
    if (redirectToLoginIfNeeded()) return;
    setSideNav(true);
    setNav('fav');
  };

  const handleStore = () => {
    if (redirectToLoginIfNeeded()) return;
    setSideNav(true);
    setNav('store');
  };

  const setShowLibrary = useSetRecoilState(libraryAtom);
  const setShowNotificationsModal = useSetRecoilState(notificationsModalAtom);

  const handleLibrary = () => {
    setShowLibrary(true);
  };

  const handleDownloads = () => {
    setShowLibrary(true);
  };

  const handleAlerts = () => {
    setShowNotificationsModal(true);
  };

  //   const handleSideNav = () => {
  //     setSideNav(false);
  // };

  return (
    <section
      style={{
        minHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
        maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
      }}
      className={`overflow-y-auto`}
    >
      <div
        className="flex overflow-hidden h-full relative w-[100%]  transition-all duration-500 ease-in-out"
        style={{
          minHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
          maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
        }}
      >
        <div className="SideNav app-sidebar app-sidebar--rail relative text-[var(--ds-navy)] flex animate-fadein">
          <ul className="app-sidebar-rail-list mt-3 w-full">
            <AppSidebarRailButton
              label="Library"
              onClick={handleLibrary}
              icon={<SidebarLibraryIcon />}
            />

            {/* Favourite */}
            <AppSidebarRailButton
              label="Favourites"
              active={nav === 'fav'}
              onClick={handleFav}
              icon={<SidebarFavouritesIcon />}
            />
            {/* Cascaded Menu for Favourites */}
            <ul
              className={clsx(
                'pl-10 w-full bg-[var(--ds-blue)] transition-all duration-500 ease-in-out',
                { hidden: nav !== 'fav' || sideNav === false }
              )}
            >
              <li className="a-s-opt2  hover:bg-[#DFE1D8] w-full">
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="26"
                      height="30"
                      viewBox="0 0 26 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25.3634 36.1817C24.4987 36.1817 23.795 35.3883 23.795 34.4132C23.795 33.4379 24.4987 32.6445 25.3634 32.6445H25.6008V0H3.16598C1.42028 0 0.000183493 1.60149 0.000183493 3.56994V34.2192H0.00229506C0.0011017 34.2536 0 34.288 0 34.3227V34.5032C0 35.9417 1.03776 37.1119 2.31328 37.1119H25.3634H25.6271V36.1816H25.3634V36.1817ZM0.825162 3.56994C0.825162 2.19588 1.76121 1.06414 2.95191 0.941785V5.64253H3.77689V0.930295H24.7757V31.714H23.8959V31.7142H3.77698V7.32798H2.952V31.7142H2.31328C1.74699 31.7142 1.22769 31.9452 0.825162 32.3276V3.56994ZM23.0064 34.8782C23.0827 35.3715 23.278 35.8189 23.5578 36.1817L2.31328 36.1816C1.49262 36.1816 0.82507 35.4288 0.82507 34.5033V34.3228C0.82507 33.3975 1.49262 32.6445 2.31328 32.6445H23.5579C23.278 33.0074 23.0827 33.4547 23.0064 33.9479H8.57814V34.8782H23.0064Z"
                        fill="#99C0D5"
                      />
                      <path
                        d="M11.3664 27.9541H12.1914V15.0084V15.0079V14.0776H7.91617V11.3997H12.0622V5.22992H14.4378V11.3997H14.4381H16.9411H18.5832V14.0776H14.9962V14.0781H14.4379V27.9542H15.2628V15.0079H16.1161V27.9541H16.9411V15.0079H18.5835V15.0084H21.0868V10.469H18.5835V10.4694H16.9411V4.29983H15.263V4.29952H11.2373V10.4694H7.09119V14.0776V14.5428V15.0085H11.3665V27.9541H11.3664ZM19.4084 11.3992H20.2617V14.078H19.4084V11.3992ZM15.2629 9.91814V5.23023H16.116V10.4694H15.2629L15.2627 9.91814H15.2629Z"
                        fill="#99C0D5"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Bible
                  </div>
                </div>
              </li>
              <li className="a-s-opt2  hover:bg-[#DFE1D8] w-full">
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="36"
                      height="33"
                      viewBox="0 0 36 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 0.09375C8.05725 0.09375 0 7.92746 0 17.5943V25.2508C0 27.0602 1.51397 28.5321 3.375 28.5321H4.91316C5.84241 31.0756 8.31459 32.9062 11.25 32.9062C13.7351 32.9062 15.75 30.9473 15.75 28.5321V19.7818C15.75 17.3646 13.7351 15.4057 11.25 15.4057C9.53831 15.4057 7.99369 16.0445 6.80484 17.0644C7.09509 11.2825 11.9838 6.65543 18 6.65543C24.0162 6.65543 28.9049 11.2825 29.1952 17.0644C28.0063 16.0445 26.4617 15.4057 24.75 15.4057C22.2649 15.4057 20.25 17.3646 20.25 19.7818V28.5321C20.25 30.9473 22.2649 32.9062 24.75 32.9062C27.6857 32.9062 30.1576 31.0756 31.0868 28.5321H32.625C34.486 28.5321 36 27.0602 36 25.2508V17.5943C36 7.92746 27.9428 0.09375 18 0.09375ZM3.375 26.3446C2.75316 26.3446 2.25 25.8554 2.25 25.2508V24.156H3.375C3.99684 24.156 4.5 24.6452 4.5 25.2508V26.3446H3.375ZM11.25 17.5943C12.4914 17.5943 13.5 18.5737 13.5 19.7818V28.5321C13.5 29.7393 12.4914 30.7198 11.25 30.7198C8.76938 30.7198 6.75 28.7563 6.75 26.3446V21.9696C6.75 19.5576 8.76938 17.5943 11.25 17.5943ZM18 4.46902C10.5446 4.46902 4.5 10.3457 4.5 17.5943V21.9696V22.1692C4.14619 22.0475 3.77044 21.9696 3.375 21.9696H2.25V17.5943C2.25 9.15055 9.31584 2.28043 18 2.28043C26.6836 2.28043 33.75 9.15055 33.75 17.5943V21.9696H32.625C32.2296 21.9696 31.8538 22.0475 31.5 22.1692V21.9696V17.5943C31.5 10.3457 25.4554 4.46902 18 4.46902ZM29.25 26.3446C29.25 28.7563 27.2306 30.7198 24.75 30.7198C23.5086 30.7198 22.5 29.7393 22.5 28.5321V19.7818C22.5 18.5737 23.5086 17.5943 24.75 17.5943C27.2306 17.5943 29.25 19.5576 29.25 21.9696V26.3446ZM32.625 26.3446H31.5V25.2508C31.5 24.6452 32.0032 24.156 32.625 24.156H33.75V25.2508C33.75 25.8554 33.2468 26.3446 32.625 26.3446Z"
                        fill="#99C0D5"
                        fillOpacity="0.8"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Audio
                  </div>
                </div>
              </li>
              <li className="a-s-opt2  hover:bg-[#DFE1D8] w-full">
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="49"
                      height="42"
                      viewBox="0 0 49 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M48.2576 27.6395H47.1064C46.1651 25.7736 45.6795 23.7622 45.6795 21.7293C45.6795 19.6964 46.1651 17.685 47.1064 15.8191H48.2576C48.4545 15.8191 48.6433 15.7521 48.7825 15.6327C48.9218 15.5134 49 15.3515 49 15.1827C49 15.0139 48.9218 14.852 48.7825 14.7326C48.6433 14.6132 48.4545 14.5462 48.2576 14.5462H41.9514C42.566 14.0789 43.0581 13.5052 43.3952 12.8629C43.7323 12.2207 43.9067 11.5244 43.9069 10.8201V5.0009C43.9051 3.67537 43.2903 2.40453 42.1972 1.46706C41.1041 0.529589 39.6219 0.00200525 38.0758 0L0.742424 0C0.545521 2.51538e-09 0.356683 0.0670574 0.217451 0.18642C0.0782195 0.305783 1.1063e-08 0.467674 1.1063e-08 0.636478C1.1063e-08 0.805283 0.0782195 0.967174 0.217451 1.08654C0.356683 1.2059 0.545521 1.27296 0.742424 1.27296H1.75221C2.90225 3.3468 3.49895 5.61424 3.49895 7.91052C3.49895 10.2068 2.90225 12.4742 1.75221 14.5481H0.742424C0.552813 14.557 0.374377 14.6278 0.243814 14.746C0.113251 14.8642 0.0404875 15.0208 0.0404875 15.1836C0.0404875 15.3464 0.113251 15.503 0.243814 15.6212C0.374377 15.7394 0.552813 15.8103 0.742424 15.8191H7.0464C6.43042 16.2863 5.93689 16.8601 5.59831 17.5027C5.25973 18.1452 5.08379 18.842 5.08207 19.5471C5.18813 22.0267 4.38163 25.9213 7.04198 27.6413C6.18643 27.5186 5.31009 27.5551 4.47247 27.7484C3.63484 27.9418 2.85556 28.2874 2.18754 28.7618C1.51951 29.2362 0.978401 29.8283 0.600947 30.4978C0.223493 31.1674 0.0185374 31.8988 0 32.6423L0 36.9991C0.00175446 38.325 0.616899 39.5961 1.71048 40.5336C2.80406 41.4711 4.28678 41.9985 5.83333 42H43.1755C43.3724 42 43.5612 41.9329 43.7005 41.8136C43.8397 41.6942 43.9179 41.5323 43.9179 41.3635C43.9179 41.1947 43.8397 41.0328 43.7005 40.9135C43.5612 40.7941 43.3724 40.727 43.1755 40.727H42.0265C41.0842 38.8614 40.5981 36.8499 40.5981 34.8169C40.5981 32.7838 41.0842 30.7724 42.0265 28.9067H48.2576C48.4415 28.8918 48.6124 28.8186 48.7367 28.7014C48.861 28.5842 48.9299 28.4315 48.9299 28.2731C48.9299 28.1147 48.861 27.962 48.7367 27.8448C48.6124 27.7276 48.4415 27.6544 48.2576 27.6395ZM39.4722 1.4889C40.3301 1.73711 41.076 2.20916 41.6054 2.83893C42.1347 3.46871 42.4211 4.22466 42.4242 5.0009V10.8201C42.4217 11.5965 42.1359 12.3527 41.6069 12.9828C41.078 13.6129 40.3323 14.0854 39.4744 14.334C37.5735 10.2075 37.5727 5.61591 39.4722 1.4889ZM3.38952 14.5481C3.97777 13.3719 4.40487 12.1413 4.66225 10.8808H32.5584C32.7553 10.8808 32.9441 10.8137 33.0834 10.6943C33.2226 10.575 33.3008 10.4131 33.3008 10.2443C33.3008 10.0755 33.2226 9.91358 33.0834 9.79421C32.9441 9.67485 32.7553 9.60779 32.5584 9.60779H4.88984C5.02241 8.47913 5.02241 7.34191 4.88984 6.21324H28.5988C28.6996 6.21796 28.8004 6.20502 28.8951 6.17521C28.9898 6.1454 29.0765 6.09936 29.1497 6.03988C29.223 5.9804 29.2814 5.90874 29.3213 5.82928C29.3611 5.74982 29.3817 5.66422 29.3817 5.57771C29.3817 5.4912 29.3611 5.40561 29.3213 5.32614C29.2814 5.24668 29.223 5.17502 29.1497 5.11554C29.0765 5.05607 28.9898 5.01002 28.8951 4.98021C28.8004 4.9504 28.6996 4.93746 28.5988 4.94218H4.66225C4.40488 3.68104 3.97779 2.44974 3.38952 1.27296H37.9852C36.1048 5.55053 36.1048 10.2686 37.9852 14.5462L3.38952 14.5481ZM6.57576 23.9115V19.5547C6.57663 18.7971 6.84699 18.0577 7.35075 17.4353C7.85452 16.8129 8.56772 16.337 9.3952 16.0711C10.312 17.8542 10.7855 19.7816 10.7855 21.7302C10.7855 23.6789 10.312 25.6063 9.3952 27.3894C8.56896 27.1236 7.85666 26.6485 7.35303 26.0273C6.84939 25.406 6.57829 24.6681 6.57576 23.9115ZM4.30208 40.4827C3.47608 40.2174 2.76397 39.7426 2.26066 39.1216C1.75735 38.5006 1.48673 37.7629 1.48485 37.0067V32.6498C1.4869 31.8934 1.75756 31.1555 2.26082 30.5342C2.76408 29.913 3.47608 29.4378 4.30208 29.1719C5.21854 30.9538 5.69186 32.8799 5.69186 34.8273C5.69186 36.7747 5.21854 38.7008 4.30208 40.4827ZM10.9883 33.9758H39.1585C39.1032 34.8246 39.1254 35.6759 39.2247 36.5217H13.958C13.8573 36.517 13.7564 36.53 13.6617 36.5598C13.567 36.5896 13.4803 36.6356 13.4071 36.6951C13.3338 36.7546 13.2754 36.8262 13.2356 36.9057C13.1957 36.9852 13.1751 37.0708 13.1751 37.1573C13.1751 37.2438 13.1957 37.3294 13.2356 37.4088C13.2754 37.4883 13.3338 37.56 13.4071 37.6194C13.4803 37.6789 13.567 37.725 13.6617 37.7548C13.7564 37.7846 13.8573 37.7975 13.958 37.7928H39.4325C39.6505 38.7982 39.9805 39.7833 40.4179 40.7346C40.3693 40.7346 5.82891 40.7346 5.78472 40.7346C6.69806 38.8643 7.16842 36.8568 7.16842 34.8292C7.16842 32.8015 6.69806 30.7941 5.78472 28.9238C5.80682 28.9124 40.3848 28.9238 40.4179 28.9238C39.8627 30.1421 39.4857 31.4146 39.2955 32.7123H10.9883C10.8112 32.7344 10.6493 32.8104 10.5323 32.9264C10.4152 33.0424 10.3507 33.1907 10.3507 33.3441C10.3507 33.4975 10.4152 33.6458 10.5323 33.7618C10.6493 33.8778 10.8112 33.9538 10.9883 33.9758ZM17.9176 20.8807H44.2494C44.1796 22.0152 44.2485 23.1529 44.4549 24.2752H14.9479C14.751 24.2752 14.5622 24.3423 14.4229 24.4616C14.2837 24.581 14.2055 24.7429 14.2055 24.9117C14.2055 25.0805 14.2837 25.2424 14.4229 25.3617C14.5622 25.4811 14.751 25.5482 14.9479 25.5482H44.7554C44.9505 26.2567 45.2023 26.9529 45.5088 27.6319C45.4867 27.6319 10.8999 27.6413 10.8778 27.6319C11.7902 25.761 12.26 23.7533 12.26 21.7255C12.26 19.6977 11.7902 17.6901 10.8778 15.8191C10.8778 15.8191 45.4978 15.8191 45.5088 15.8191C44.9548 17.0377 44.5779 18.3102 44.3864 19.6077H17.9176C17.7207 19.6077 17.5319 19.6748 17.3926 19.7941C17.2534 19.9135 17.1752 20.0754 17.1752 20.2442C17.1752 20.413 17.2534 20.5749 17.3926 20.6942C17.5319 20.8136 17.7207 20.8807 17.9176 20.8807Z"
                        fill="#99C0D5"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Resources
                  </div>
                </div>
              </li>
              <li className="a-s-opt2  hover:bg-[#DFE1D8] w-full">
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 21C16.523 21 21 16.523 21 11C21 5.477 16.523 1 11 1C5.477 1 1 5.477 1 11C1 16.523 5.477 21 11 21Z"
                        stroke="#99C0D5"
                        strokeOpacity="0.8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.5 11.5L7 13.5L6 17L7 20M16 19.5L15.5 17L13 16V12.5L16 11.5L20.5 12M18 4.5L17.5 6L14 6.5V9.5L16.5 8.5H18.5L20.5 9.5M1.5 9.5L4 7.5L6.5 7L8.5 4L7.5 2"
                        stroke="#99C0D5"
                        strokeOpacity="0.8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Translations
                  </div>
                </div>
              </li>
              <li className="a-s-opt2  hover:bg-[#DFE1D8] w-full">
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="43"
                      height="46"
                      viewBox="0 0 43 46"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M37.4458 11.5H30.4583V9.58333C30.4583 4.21667 26.5167 0 21.5 0C16.4833 0 12.5417 4.21667 12.5417 9.58333V19.1667H16.125V15.3333H23.2917V11.5H16.125V9.58333C16.125 6.325 18.4542 3.83333 21.5 3.83333C24.5458 3.83333 26.875 6.325 26.875 9.58333V19.1667H30.4583V15.3333H34.2208L35.8333 42.1667H7.34584L8.77917 15.3333H8.95834V11.5H5.55417L3.40417 46H39.4167L37.4458 11.5Z"
                        fill="#99C0D5"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Freebies
                  </div>
                </div>
              </li>
            </ul>

            {/* Store */}
            <AppSidebarRailButton
              label="Store"
              active={nav === 'store' || nav === 'store_bible'}
              onClick={handleStore}
              icon={<SidebarStoreIcon />}
            />
            {/* Cascaded Menu for Store */}
            <ul
              className={clsx('pl-10 w-full bg-[var(--ds-blue)]', {
                hidden:
                  (nav !== 'store' &&
                    nav !== 'store_bible' &&
                    nav !== 'store_audio' &&
                    nav !== 'store_resources' &&
                    nav !== 'store_translations' &&
                    nav !== 'store_freesbies' &&
                    nav !== 'product') ||
                  sideNav === false,
              })}
            >
              <li
                className={clsx('a-s-opt2 hover:bg-[#DFE1D8] w-full', {
                  'bg-[#DFE1D8] active': nav === 'store_bible',
                })}
                onClick={() => setNav('store_bible')}
              >
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="26"
                      height="30"
                      viewBox="0 0 26 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25.3634 36.1817C24.4987 36.1817 23.795 35.3883 23.795 34.4132C23.795 33.4379 24.4987 32.6445 25.3634 32.6445H25.6008V0H3.16598C1.42028 0 0.000183493 1.60149 0.000183493 3.56994V34.2192H0.00229506C0.0011017 34.2536 0 34.288 0 34.3227V34.5032C0 35.9417 1.03776 37.1119 2.31328 37.1119H25.3634H25.6271V36.1816H25.3634V36.1817ZM0.825162 3.56994C0.825162 2.19588 1.76121 1.06414 2.95191 0.941785V5.64253H3.77689V0.930295H24.7757V31.714H23.8959V31.7142H3.77698V7.32798H2.952V31.7142H2.31328C1.74699 31.7142 1.22769 31.9452 0.825162 32.3276V3.56994ZM23.0064 34.8782C23.0827 35.3715 23.278 35.8189 23.5578 36.1817L2.31328 36.1816C1.49262 36.1816 0.82507 35.4288 0.82507 34.5033V34.3228C0.82507 33.3975 1.49262 32.6445 2.31328 32.6445H23.5579C23.278 33.0074 23.0827 33.4547 23.0064 33.9479H8.57814V34.8782H23.0064Z"
                        fill="#99C0D5"
                      />
                      <path
                        d="M11.3664 27.9541H12.1914V15.0084V15.0079V14.0776H7.91617V11.3997H12.0622V5.22992H14.4378V11.3997H14.4381H16.9411H18.5832V14.0776H14.9962V14.0781H14.4379V27.9542H15.2628V15.0079H16.1161V27.9541H16.9411V15.0079H18.5835V15.0084H21.0868V10.469H18.5835V10.4694H16.9411V4.29983H15.263V4.29952H11.2373V10.4694H7.09119V14.0776V14.5428V15.0085H11.3665V27.9541H11.3664ZM19.4084 11.3992H20.2617V14.078H19.4084V11.3992ZM15.2629 9.91814V5.23023H16.116V10.4694H15.2629L15.2627 9.91814H15.2629Z"
                        fill="#99C0D5"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Bible
                  </div>
                </div>
              </li>
              <li
                className={clsx('a-s-opt2  hover:bg-[#DFE1D8] w-full', {
                  'bg-[#DFE1D8] active': nav === 'store_audio',
                })}
                onClick={() => setNav('store_audio')}
              >
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="36"
                      height="33"
                      viewBox="0 0 36 33"
                      fill="none"
                      xmlns="http://ww&& nav !== 'store_bible'w.w3.org/2000/svg"
                    >
                      <path
                        d="M18 0.09375C8.05725 0.09375 0 7.92746 0 17.5943V25.2508C0 27.0602 1.51397 28.5321 3.375 28.5321H4.91316C5.84241 31.0756 8.31459 32.9062 11.25 32.9062C13.7351 32.9062 15.75 30.9473 15.75 28.5321V19.7818C15.75 17.3646 13.7351 15.4057 11.25 15.4057C9.53831 15.4057 7.99369 16.0445 6.80484 17.0644C7.09509 11.2825 11.9838 6.65543 18 6.65543C24.0162 6.65543 28.9049 11.2825 29.1952 17.0644C28.0063 16.0445 26.4617 15.4057 24.75 15.4057C22.2649 15.4057 20.25 17.3646 20.25 19.7818V28.5321C20.25 30.9473 22.2649 32.9062 24.75 32.9062C27.6857 32.9062 30.1576 31.0756 31.0868 28.5321H32.625C34.486 28.5321 36 27.0602 36 25.2508V17.5943C36 7.92746 27.9428 0.09375 18 0.09375ZM3.375 26.3446C2.75316 26.3446 2.25 25.8554 2.25 25.2508V24.156H3.375C3.99684 24.156 4.5 24.6452 4.5 25.2508V26.3446H3.375ZM11.25 17.5943C12.4914 17.5943 13.5 18.5737 13.5 19.7818V28.5321C13.5 29.7393 12.4914 30.7198 11.25 30.7198C8.76938 30.7198 6.75 28.7563 6.75 26.3446V21.9696C6.75 19.5576 8.76938 17.5943 11.25 17.5943ZM18 4.46902C10.5446 4.46902 4.5 10.3457 4.5 17.5943V21.9696V22.1692C4.14619 22.0475 3.77044 21.9696 3.375 21.9696H2.25V17.5943C2.25 9.15055 9.31584 2.28043 18 2.28043C26.6836 2.28043 33.75 9.15055 33.75 17.5943V21.9696H32.625C32.2296 21.9696 31.8538 22.0475 31.5 22.1692V21.9696V17.5943C31.5 10.3457 25.4554 4.46902 18 4.46902ZM29.25 26.3446C29.25 28.7563 27.2306 30.7198 24.75 30.7198C23.5086 30.7198 22.5 29.7393 22.5 28.5321V19.7818C22.5 18.5737 23.5086 17.5943 24.75 17.5943C27.2306 17.5943 29.25 19.5576 29.25 21.9696V26.3446ZM32.625 26.3446H31.5V25.2508C31.5 24.6452 32.0032 24.156 32.625 24.156H33.75V25.2508C33.75 25.8554 33.2468 26.3446 32.625 26.3446Z"
                        fill="#99C0D5"
                        fillOpacity="0.8"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Audio
                  </div>
                </div>
              </li>
              <li
                className={clsx('a-s-opt2  hover:bg-[#DFE1D8] w-full', {
                  'bg-[#DFE1D8] active': nav === 'store_resources',
                })}
                onClick={() => setNav('store_resources')}
              >
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="49"
                      height="42"
                      viewBox="0 0 49 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M48.2576 27.6395H47.1064C46.1651 25.7736 45.6795 23.7622 45.6795 21.7293C45.6795 19.6964 46.1651 17.685 47.1064 15.8191H48.2576C48.4545 15.8191 48.6433 15.7521 48.7825 15.6327C48.9218 15.5134 49 15.3515 49 15.1827C49 15.0139 48.9218 14.852 48.7825 14.7326C48.6433 14.6132 48.4545 14.5462 48.2576 14.5462H41.9514C42.566 14.0789 43.0581 13.5052 43.3952 12.8629C43.7323 12.2207 43.9067 11.5244 43.9069 10.8201V5.0009C43.9051 3.67537 43.2903 2.40453 42.1972 1.46706C41.1041 0.529589 39.6219 0.00200525 38.0758 0L0.742424 0C0.545521 2.51538e-09 0.356683 0.0670574 0.217451 0.18642C0.0782195 0.305783 1.1063e-08 0.467674 1.1063e-08 0.636478C1.1063e-08 0.805283 0.0782195 0.967174 0.217451 1.08654C0.356683 1.2059 0.545521 1.27296 0.742424 1.27296H1.75221C2.90225 3.3468 3.49895 5.61424 3.49895 7.91052C3.49895 10.2068 2.90225 12.4742 1.75221 14.5481H0.742424C0.552813 14.557 0.374377 14.6278 0.243814 14.746C0.113251 14.8642 0.0404875 15.0208 0.0404875 15.1836C0.0404875 15.3464 0.113251 15.503 0.243814 15.6212C0.374377 15.7394 0.552813 15.8103 0.742424 15.8191H7.0464C6.43042 16.2863 5.93689 16.8601 5.59831 17.5027C5.25973 18.1452 5.08379 18.842 5.08207 19.5471C5.18813 22.0267 4.38163 25.9213 7.04198 27.6413C6.18643 27.5186 5.31009 27.5551 4.47247 27.7484C3.63484 27.9418 2.85556 28.2874 2.18754 28.7618C1.51951 29.2362 0.978401 29.8283 0.600947 30.4978C0.223493 31.1674 0.0185374 31.8988 0 32.6423L0 36.9991C0.00175446 38.325 0.616899 39.5961 1.71048 40.5336C2.80406 41.4711 4.28678 41.9985 5.83333 42H43.1755C43.3724 42 43.5612 41.9329 43.7005 41.8136C43.8397 41.6942 43.9179 41.5323 43.9179 41.3635C43.9179 41.1947 43.8397 41.0328 43.7005 40.9135C43.5612 40.7941 43.3724 40.727 43.1755 40.727H42.0265C41.0842 38.8614 40.5981 36.8499 40.5981 34.8169C40.5981 32.7838 41.0842 30.7724 42.0265 28.9067H48.2576C48.4415 28.8918 48.6124 28.8186 48.7367 28.7014C48.861 28.5842 48.9299 28.4315 48.9299 28.2731C48.9299 28.1147 48.861 27.962 48.7367 27.8448C48.6124 27.7276 48.4415 27.6544 48.2576 27.6395ZM39.4722 1.4889C40.3301 1.73711 41.076 2.20916 41.6054 2.83893C42.1347 3.46871 42.4211 4.22466 42.4242 5.0009V10.8201C42.4217 11.5965 42.1359 12.3527 41.6069 12.9828C41.078 13.6129 40.3323 14.0854 39.4744 14.334C37.5735 10.2075 37.5727 5.61591 39.4722 1.4889ZM3.38952 14.5481C3.97777 13.3719 4.40487 12.1413 4.66225 10.8808H32.5584C32.7553 10.8808 32.9441 10.8137 33.0834 10.6943C33.2226 10.575 33.3008 10.4131 33.3008 10.2443C33.3008 10.0755 33.2226 9.91358 33.0834 9.79421C32.9441 9.67485 32.7553 9.60779 32.5584 9.60779H4.88984C5.02241 8.47913 5.02241 7.34191 4.88984 6.21324H28.5988C28.6996 6.21796 28.8004 6.20502 28.8951 6.17521C28.9898 6.1454 29.0765 6.09936 29.1497 6.03988C29.223 5.9804 29.2814 5.90874 29.3213 5.82928C29.3611 5.74982 29.3817 5.66422 29.3817 5.57771C29.3817 5.4912 29.3611 5.40561 29.3213 5.32614C29.2814 5.24668 29.223 5.17502 29.1497 5.11554C29.0765 5.05607 28.9898 5.01002 28.8951 4.98021C28.8004 4.9504 28.6996 4.93746 28.5988 4.94218H4.66225C4.40488 3.68104 3.97779 2.44974 3.38952 1.27296H37.9852C36.1048 5.55053 36.1048 10.2686 37.9852 14.5462L3.38952 14.5481ZM6.57576 23.9115V19.5547C6.57663 18.7971 6.84699 18.0577 7.35075 17.4353C7.85452 16.8129 8.56772 16.337 9.3952 16.0711C10.312 17.8542 10.7855 19.7816 10.7855 21.7302C10.7855 23.6789 10.312 25.6063 9.3952 27.3894C8.56896 27.1236 7.85666 26.6485 7.35303 26.0273C6.84939 25.406 6.57829 24.6681 6.57576 23.9115ZM4.30208 40.4827C3.47608 40.2174 2.76397 39.7426 2.26066 39.1216C1.75735 38.5006 1.48673 37.7629 1.48485 37.0067V32.6498C1.4869 31.8934 1.75756 31.1555 2.26082 30.5342C2.76408 29.913 3.47608 29.4378 4.30208 29.1719C5.21854 30.9538 5.69186 32.8799 5.69186 34.8273C5.69186 36.7747 5.21854 38.7008 4.30208 40.4827ZM10.9883 33.9758H39.1585C39.1032 34.8246 39.1254 35.6759 39.2247 36.5217H13.958C13.8573 36.517 13.7564 36.53 13.6617 36.5598C13.567 36.5896 13.4803 36.6356 13.4071 36.6951C13.3338 36.7546 13.2754 36.8262 13.2356 36.9057C13.1957 36.9852 13.1751 37.0708 13.1751 37.1573C13.1751 37.2438 13.1957 37.3294 13.2356 37.4088C13.2754 37.4883 13.3338 37.56 13.4071 37.6194C13.4803 37.6789 13.567 37.725 13.6617 37.7548C13.7564 37.7846 13.8573 37.7975 13.958 37.7928H39.4325C39.6505 38.7982 39.9805 39.7833 40.4179 40.7346C40.3693 40.7346 5.82891 40.7346 5.78472 40.7346C6.69806 38.8643 7.16842 36.8568 7.16842 34.8292C7.16842 32.8015 6.69806 30.7941 5.78472 28.9238C5.80682 28.9124 40.3848 28.9238 40.4179 28.9238C39.8627 30.1421 39.4857 31.4146 39.2955 32.7123H10.9883C10.8112 32.7344 10.6493 32.8104 10.5323 32.9264C10.4152 33.0424 10.3507 33.1907 10.3507 33.3441C10.3507 33.4975 10.4152 33.6458 10.5323 33.7618C10.6493 33.8778 10.8112 33.9538 10.9883 33.9758ZM17.9176 20.8807H44.2494C44.1796 22.0152 44.2485 23.1529 44.4549 24.2752H14.9479C14.751 24.2752 14.5622 24.3423 14.4229 24.4616C14.2837 24.581 14.2055 24.7429 14.2055 24.9117C14.2055 25.0805 14.2837 25.2424 14.4229 25.3617C14.5622 25.4811 14.751 25.5482 14.9479 25.5482H44.7554C44.9505 26.2567 45.2023 26.9529 45.5088 27.6319C45.4867 27.6319 10.8999 27.6413 10.8778 27.6319C11.7902 25.761 12.26 23.7533 12.26 21.7255C12.26 19.6977 11.7902 17.6901 10.8778 15.8191C10.8778 15.8191 45.4978 15.8191 45.5088 15.8191C44.9548 17.0377 44.5779 18.3102 44.3864 19.6077H17.9176C17.7207 19.6077 17.5319 19.6748 17.3926 19.7941C17.2534 19.9135 17.1752 20.0754 17.1752 20.2442C17.1752 20.413 17.2534 20.5749 17.3926 20.6942C17.5319 20.8136 17.7207 20.8807 17.9176 20.8807Z"
                        fill="#99C0D5"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Resources
                  </div>
                </div>
              </li>
              <li
                className={clsx('a-s-opt2  hover:bg-[#DFE1D8] w-full', {
                  'bg-[#DFE1D8] active': nav === 'store_translations',
                })}
                onClick={() => setNav('store_translations')}
              >
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 21C16.523 21 21 16.523 21 11C21 5.477 16.523 1 11 1C5.477 1 1 5.477 1 11C1 16.523 5.477 21 11 21Z"
                        stroke="#99C0D5"
                        strokeOpacity="0.8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.5 11.5L7 13.5L6 17L7 20M16 19.5L15.5 17L13 16V12.5L16 11.5L20.5 12M18 4.5L17.5 6L14 6.5V9.5L16.5 8.5H18.5L20.5 9.5M1.5 9.5L4 7.5L6.5 7L8.5 4L7.5 2"
                        stroke="#99C0D5"
                        strokeOpacity="0.8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Translations
                  </div>
                </div>
              </li>
              <li
                className={clsx('a-s-opt2  hover:bg-[#DFE1D8] w-full', {
                  'bg-[#DFE1D8] active': nav === 'store_freesbies',
                })}
                onClick={() => setNav('store_freesbies')}
              >
                <div className="subleft">
                  <div
                    className={clsx('a-s-logo hover:animate-bounce', {
                      show: sideNav === false,
                    })}
                  >
                    <svg
                      width="43"
                      height="46"
                      viewBox="0 0 43 46"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M37.4458 11.5H30.4583V9.58333C30.4583 4.21667 26.5167 0 21.5 0C16.4833 0 12.5417 4.21667 12.5417 9.58333V19.1667H16.125V15.3333H23.2917V11.5H16.125V9.58333C16.125 6.325 18.4542 3.83333 21.5 3.83333C24.5458 3.83333 26.875 6.325 26.875 9.58333V19.1667H30.4583V15.3333H34.2208L35.8333 42.1667H7.34584L8.77917 15.3333H8.95834V11.5H5.55417L3.40417 46H39.4167L37.4458 11.5Z"
                        fill="#99C0D5"
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>
                  <div
                    className={clsx('a-s-label', { hidden: sideNav === false })}
                  >
                    Freebies
                  </div>
                </div>
              </li>
            </ul>

            {/* Download */}
            <AppSidebarRailButton
              label="Downloads"
              onClick={handleDownloads}
              icon={<SidebarDownloadsIcon />}
            />

            {/* Notification */}
            <AppSidebarRailButton
              label="Alerts"
              onClick={handleAlerts}
              icon={<SidebarAlertsIcon />}
            />
          </ul>
        </div>

        <div className="app-workspace-pane flex flex-col">
        <SingleReader hidden={nav !== 'read'} />

        <StoreHomePage hidden={nav !== 'store'} />

        <FavouritesHomePage hidden={nav !== 'fav'} />

        <StoreBible hidden={nav !== 'store_bible'} />

        <StoreAudio hidden={nav !== 'store_audio'} />

        <StoreResources hidden={nav !== 'store_resources'} />

        <StoreTransalations hidden={nav !== 'store_translations'} />

        <Storefreesbiees hidden={nav !== 'store_freesbies'} />

        {/* <ProductDetails hidden={nav !== 'product'} /> */}

        <DynamicProductDetails hidden={nav !== 'product'} />

        <Multilayout hidden={nav !== 'multi_layout'} />

        <XmlToJsonConverter hidden={nav !== 'xml'} />
        </div>
      </div>
    </section>
  );
};

export default Workspace;
