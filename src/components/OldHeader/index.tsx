import clsx from 'clsx';
import Dropdown from 'components/Dropdown';
import { AdminRoute, DashboardRoute } from 'navigation/routes';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import useGetSize from '../../hooks/useGetSize';
import { headerHeightAtom } from '../../store/atoms/size';
// import { newProjectModalAtom, projectAtom } from 'store/atoms/workspace';
// import style from './styles.module.scss';
import usePermission from 'hooks/usePermission';
import { DarkThemeAtom, ProdSKUAtom, SetNavAtom, SideNavAtom, layoutViewAtom, readModeAtom, storeBackAtom, storeCartAtom } from '../../store/atoms/general';
import {
  editorSelectedAtom,
  editorUserCursorPositionAtom,
} from '../../store/atoms/workspace';
import home from 'assets/Frame-Home.png'
import read from 'assets/Frame-Read.png'
import note from 'assets/Frame-Note.png'
import bookM from 'assets/Frame-BookMark.png'
import advanced from 'assets/Frame-Advance.png'
import logo from "../../assets/website/logo.png";
import { copyTextToClipboard } from 'utils/general';
import { isJSON } from '../../utils/general';
import { IProject } from 'interface/project';
import { documentNotFound, editorFormats, editorModules } from '../EditorScreen/config';
import Input from 'components/Input';
import { FaCaretDown } from "react-icons/fa";
import axios from 'axios';
import { IStoreProduct } from 'interface/storeProducts';
import { FaSearch } from 'react-icons/fa';
import { useUser } from 'hooks/useUser';
import Modal from 'components/Modal';
import Submit from 'components/Submit';
import CollabMode from 'components/CollabPopup';


export interface IHeader {
  hidden?: boolean;
  quill?: any;
}

const Header: React.FunctionComponent<IHeader> = ({ hidden, quill }) => {
  const setHeaderHeight = useSetRecoilState(headerHeightAtom);
  const { height, ref } = useGetSize();
  const { user: authUser } = useUser();
  const [files, setFiles] = useState(false);
  const [search, setSearch] = useState('');
  const [books] = useState(false);
  const [history] = useState(false);
  const [help, setHelp] = useState(false);
  // const setShowNewProjectModal = useSetRecoilState(newProjectModalAtom);
  const { isSystemsAdmin, isAppManager } = usePermission();
  // const { saveDoc, isProjectInSync } = useProjects();
  const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
  const selectedText = useRecoilValue(editorSelectedAtom);
  const cursorPosition = useRecoilValue(editorUserCursorPositionAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom)
  // const [project, setProject] = useRecoilState<IProject | null>(projectAtom);  
  const [readerMode, setReaderMode] = useRecoilState(readModeAtom);
  const [nav, setNav] = useRecoilState(SetNavAtom);
  const [layoutView, setLayoutView] = useRecoilState(layoutViewAtom);
  const [sku, setSKU] = useRecoilState(ProdSKUAtom);
  const [productdet, setProductdet] = useState<IStoreProduct[]>([]);
  const [back, setBack] = useRecoilState(storeBackAtom);
  const [storeCart, setStoreCart] = useRecoilState(storeCartAtom);
  const [showSubmit, setShowSubmit] = useState(false);




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
        const [response,] = await Promise.all([
          axios.get(`https://api.rorbible.plus/prem/productSearchWildcard.php?keyword=${search}`),

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

  return (
    <nav className="flex bg-[#18668D] items-center px-4 py-1 transition-width duration-500 ease-in-out" ref={ref}>
      {/* <Link to={DashboardRoute}>
        <Logo className="mr-16 min-w-max cursor-pointer" />
      </Link> */}
      {/* { !authUser &&( */}
      < div className=" flex items-center mr-auto ">
        <img src={logo} alt="" className=" mr-auto w-[10rem]" />
      </div>
      {/* )} */}


      <div className="flex mr-auto">
        <div className="flex mr-auto items-center border-b-[0.5px] border-[#EBECEE] rounded-lg
       w-[17rem] justify-between " onClick={handleReadMode} >
          <a href="/home" >
            <div className="flex flex-col text-white items-center  hover:animate-bounce ml-4 justify-center cursor-pointer"
            // onClick={handleHome}
            >
              <img src={home} alt="" className="w-5 py-1" />
              <a className="text-[8px] font-light mt-auto" href="/home" >Home</a>

            </div>
          </a>

          <div className="flex flex-col text-white items-center  hover:animate-bounce  justify-center cursor-pointer" onClick={handleReadView} >
            <img src={read} alt="" className="w-6 py-1" />
            <span className="text-[8px] font-light mt-auto">Read</span>

          </div>
          <div className="flex flex-col text-white items-center  hover:animate-bounce  justify-center cursor-pointer">
            <img src={note} alt="" className="w-4 py-1" />
            <span className="text-[8px] font-light mt-auto">Note</span>

          </div>
          <div className="flex flex-col text-white items-center  hover:animate-bounce justify-center cursor-pointer">
            <img src={bookM} alt="" className="w-4 py-1" />
            <span className="text-[8px] font-light mt-auto">Bookmark</span>

          </div>
          <div className="flex flex-col text-white items-center  hover:animate-bounce mr-4 justify-center cursor-pointer"
            onClick={handleMultiView}
          >
            <img src={advanced} alt="" className="w-5 py-1" />
            <span className="text-[8px] font-light mt-auto">Advance View</span>


          </div>

        </div>
        <div className=" Hamburg-toogle ml-10 flex items-center cursor-pointer"
          onClick={handleSideNav}
        >
          <svg width="25" height="20" viewBox="0 0 57 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54.6692 0H2.20997C1.1753 0 0.336426 0.881571 0.336426 1.96889C0.336426 3.05621 1.1753 3.93778 2.20997 3.93778H54.6692C55.7038 3.93778 56.5427 3.05621 56.5427 1.96889C56.5427 0.881571 55.7038 0 54.6692 0Z" fill="#EBECEE" />
            <path d="M54.3327 15.3279H1.87354C0.838879 15.3279 0 16.2095 0 17.2968C0 18.3841 0.838879 19.2657 1.87354 19.2657H54.3327C55.3674 19.2657 56.2063 18.3841 56.2063 17.2968C56.2063 16.2095 55.3674 15.3279 54.3327 15.3279Z" fill="#EBECEE" />
            <path d="M54.3327 30.675H1.87354C0.838879 30.675 0 31.5557 0 32.6439C0 33.7322 0.838879 34.6128 1.87354 34.6128H54.3327C55.3674 34.6128 56.2063 33.7322 56.2063 32.6439C56.2063 31.5557 55.3674 30.675 54.3327 30.675Z" fill="#EBECEE" />
          </svg>
        </div>

      </div>

     

      <div className="flex searchBar ml-auto items-center">
        <div className=''>
          <Dropdown
            dropdownClassName="border border-dropdown-border py-[10px] font-raleway overflow-auto  bg-white max-h-[250px]  min-w-[12rem] w-max"
            className={'h-max'}
            content={
              <ul className="flex flex-col gap-y-[10px]">
                {productdet.length > 0 ? (
                  productdet.map((el,) => {
                    return (
                      <li
                        className={clsx(
                          ' flex items-center gap-x-4 font-normal text-[11px]  cursor-pointer hover:bg-slate-50 px-[.875rem] ',
                          { 'hover:!bg-[#0f2230]': DarkTheme === true }
                        )}
                        onClick={() => handleViewDetails(el.ProductSKU)}
                      >
                        <div className="book-img">

                          <img
                            src={el.Imageurl}
                            alt=""
                            className="w-[20.55px] mr-2"
                          />
                        </div>
                        <span className="flex flex-col">
                          <span className="searchTitle">{el.Title}</span>
                        </span>

                      </li>
                    );
                  })
                ) : (
                  <li className="px-[.875rem] text-sm">No Similar Product</li>
                )}
              </ul>
            }
          >
            {/* <Input
              type={'search'}
              name={'search'}
              placeholder="Search with Keywords..."
              value={search}
              setValue={setSearch}
              autoComplete={'off'}
              className='ml-4 text-white !text-[0.5rem] !placeholder-[#A5C4CB]'
            /> */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 mr-4 text-[#A5C4CB] bg-transparent border-b border-white focus:outline-none placeholder:italic placeholder:text-[0.7rem] text-[0.7rem] focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-[#A5C4CB] w-3" />
              </div>
            </div>
          </Dropdown>


        </div>
        <svg className="bell mr-2" width="23" height="24" viewBox="0 0 18 19" fill="none"
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

        <Dropdown
          dropdownClassName="border border-dropdown-border font-raleway overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
          className={'w-full transition-all duration-500 ease-in-out'}
          content={
            <ul className="flex flex-col gap-y-[2px] w-[100%">

              <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.7rem] " >Edit Profile</li>
              <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.7rem] " onClick={handleSubmit}>Send Notification </li>
              <li className="px-[1.5rem] cursor-pointer hover:text-blue-700 text-[0.7rem] " >Log Out</li>

            </ul>
          }
        >
          <svg className="Settings cursor-pointer" width="21" height="23" viewBox="0 0 22 23" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.0728 7.59637L18.5022 6.60628C18.0195 5.76852 16.9498 5.47951 16.1109 5.96021C15.7116 6.19545 15.2351 6.26219 14.7865 6.14572C14.3379 6.02924 13.9541 5.73911 13.7196 5.33931C13.5688 5.08519 13.4878 4.79575 13.4847 4.50026C13.4983 4.02651 13.3196 3.56742 12.9892 3.22758C12.6589 2.88774 12.205 2.69609 11.7311 2.69629H10.5816C10.1172 2.69629 9.67206 2.88131 9.34452 3.21042C9.01698 3.53953 8.8341 3.9856 8.83633 4.44991C8.82257 5.40857 8.04146 6.17846 7.08271 6.17836C6.78721 6.1753 6.49777 6.09425 6.24365 5.94343C5.40474 5.46273 4.33504 5.75174 3.85235 6.5895L3.23984 7.59637C2.75773 8.43308 3.0428 9.50211 3.87752 9.98767C4.4201 10.3009 4.75434 10.8798 4.75434 11.5064C4.75434 12.1329 4.4201 12.7118 3.87752 13.025C3.04386 13.5073 2.75848 14.5738 3.23984 15.408L3.81879 16.4064C4.04495 16.8145 4.42441 17.1157 4.8732 17.2432C5.32199 17.3708 5.80311 17.3142 6.21009 17.0861C6.61018 16.8526 7.08694 16.7887 7.53442 16.9084C7.98189 17.0281 8.36299 17.3217 8.593 17.7238C8.74383 17.9779 8.82487 18.2673 8.82794 18.5628C8.82794 19.5313 9.61306 20.3164 10.5816 20.3164H11.7311C12.6963 20.3164 13.4801 19.5364 13.4847 18.5712C13.4824 18.1054 13.6665 17.6581 13.9958 17.3287C14.3252 16.9994 14.7725 16.8153 15.2383 16.8176C15.5331 16.8255 15.8213 16.9062 16.0774 17.0525C16.9141 17.5346 17.9831 17.2495 18.4687 16.4148L19.0728 15.408C19.3066 15.0066 19.3708 14.5286 19.2511 14.0797C19.1314 13.6309 18.8377 13.2483 18.4351 13.0167C18.0325 12.785 17.7388 12.4024 17.6191 11.9536C17.4994 11.5048 17.5636 11.0267 17.7974 10.6254C17.9495 10.3599 18.1696 10.1397 18.4351 9.98767C19.2648 9.50237 19.5492 8.43959 19.0728 7.60476V7.59637Z" stroke="#EBECEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.1605 13.9228C12.495 13.9228 13.5768 12.8409 13.5768 11.5064C13.5768 10.1719 12.495 9.09009 11.1605 9.09009C9.82597 9.09009 8.74414 10.1719 8.74414 11.5064C8.74414 12.8409 9.82597 13.9228 11.1605 13.9228Z" stroke="#EBECEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Dropdown>

      </div>


      <Modal
        id={'submit'}
        hasHeader={false}
        content={<Submit />}
        isShown={showSubmit}
        setIsShown={setShowSubmit}
      />

    </nav >
  );
};

export default Header;
