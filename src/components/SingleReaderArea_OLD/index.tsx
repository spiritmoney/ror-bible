import React, { useEffect, useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { footerHeightAtom, headerHeightAtom } from '../../store/atoms/size';
import Anotations from '../Anotations';
import AvailableBooks from '../AvailableBooks';
import Editor from '../EditorScreen';
import WorkspaceHeader from '../WorkspaceHeader';
import UtilityTools from 'components/Utility-Tools';
import clsx from 'clsx';
import useContextMenu from '../../hooks/useContextMenu';
import AdminSideMenu from 'components/AdminSideMenu';
import Bible1 from '../../assets/bible/bible1.png';
import Bible2 from '../../assets/bible/bible2.png';
import Bible3 from '../../assets/bible/bible3.png';
import "./singlereaderarea.scss";
import { SetNavAtom, SideNavAtom, readBookAtom, readChapterAtom, readModeAtom } from 'store/atoms/general';
import lang from 'assets/Frame-Lang.png'
import { ReactComponent as Speaker } from '../../assets/speaker.svg';
import { ReactComponent as ParalStudy } from '../../assets/paralStudy.svg';
import { ReactComponent as FontsSet } from '../../assets/fontsSet.svg';
import { ReactComponent as Toggle } from '../../assets/hamburg.svg';
import { ReactComponent as ToggOn } from '../../assets/hamb.svg';
import { ReactComponent as Navarrow } from '../../assets/navArrow.svg';
import { ReactComponent as NavarrowOut } from '../../assets/navArrowOut.svg';
import HTMLFlipBook from 'react-pageflip';
import XmlDisplay from 'components/XmlDisplay/XmlDisplay';
import { IoIosClose } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';

export interface IReader {
    hidden: boolean
}

type BibleRow = {
    image: string,
    name: string,
}

const ModalSection = ({
    image,
    name
}: BibleRow) => {

    return <li className='bible_version_modal_section_li' >
        <img src={image} alt={name} />
        <div>{name}</div>
    </li>

}

const SingleReader: React.FunctionComponent<IReader> = ({ hidden }) => {
    const footerHeight = useRecoilValue(footerHeightAtom);
    const headerHeight = useRecoilValue(headerHeightAtom);
    const [sideNav, setSideNav] = useRecoilState(SideNavAtom);
    const [readerMode, setReaderMode] = useState(true);
    const [chap, setChap] = useRecoilState(readChapterAtom);
    const [book, setBook] = useRecoilState(readBookAtom);
    const [selectBook, setSelectBook] = useState(false);
    const [selectVersion, setSelectVersion] = useState(false);
    const [nav, setNav] = useRecoilState(SetNavAtom);
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

    const [xmlContent, setXmlContent] = useState<string>('');
    const flipBookRef = useRef<any>(null);

    useEffect(() => {
        // Fetch the XML file once when the component mounts
        fetch('/Bible_English_AMP.xml')
            .then((response) => response.text())
            .then((data) => setXmlContent(data))
            .catch((error) => console.error('Error fetching XML:', error));
    }, []); // empty deps -> only once

    // Fix initial render issue with flipbook: force update on mount and on resize
    useEffect(() => {
        const refreshFlip = () => {
            try {
                if (flipBookRef.current && typeof flipBookRef.current.pageFlip === 'function') {
                    const pf = flipBookRef.current.pageFlip();
                    if (pf && typeof pf.update === 'function') pf.update();
                }
            } catch (e) {
                // swallow any errors during refresh
            }
        };

        // call shortly after mount (allows fonts/images to load)
        const t = setTimeout(refreshFlip, 120);

        window.addEventListener('resize', refreshFlip);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', refreshFlip);
        };
    }, []);

    const handleBooks = () => {
        setSelectBook(!selectBook);
        // ensure only one modal open at a time
        if (!selectBook) setSelectVersion(false);
    };

    const handleVersions = () => {
        setSelectVersion(!selectVersion);
        if (!selectVersion) setSelectBook(false);
    }

    return (
        <div className={clsx('Reader-area w-full ', { '!w-[95%]': sideNav === false })}
            style={{
                minHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
                maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
                display: hidden ? 'none' : 'block'
            }}>

            <SubNav nav={nav} setNav={setNav} className='border-b-[5px] border-[#DFE1D8]' />

            <div className='top-area flex w-full h-[15%] items-center justify-between px-5 mr-5 py-2'>

                <img src={lang} alt="" className='language w-[8rem]  ml-[12%] cursor-pointer' />

                <div className='bookChap border-b-[1.5px] w-[18%] px-2 border-[#919190] flex items-center text-[14px] text-[#0F4262] font-semibold justify-between ml-[3%] relative'>
                    <span onClick={handleBooks} >{book}  {chap}</span>
                    <svg
                        onClick={handleBooks}
                        className="ml-auto w-[4%] mr-[2%] cursor-pointer " width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.49947 0.500207C8.83947 0.334207 15.1795 0.500207 21.4995 1.00021C23.2095 2.13321 23.7095 3.63321 22.9995 5.50021C19.8295 10.6672 16.6695 15.8332 13.4995 21.0002C11.6295 21.7112 10.1295 21.2112 8.99947 19.5002C6.83947 14.5082 4.16947 9.84121 0.999466 5.50021C0.389466 3.50521 0.889466 1.83821 2.49947 0.500207Z" fill="#787878" />
                    </svg>

                    <div className='bible_chapters_modal' style={{
                        display: selectBook ? 'block' : 'none'
                    }} >

                        <div className='bible_chapters_modal_top' >
                            <h4>Old Testament</h4>
                            <h5>New Testament</h5>
                            <IoIosClose className='bible_chapters_modal_top_ic' onClick={() => setSelectBook(false)} />
                        </div>

                        <div className='bible_chapters_modal_section' >
                            <h4>Book</h4>
                            <h4>Chapter</h4>
                            <h4>Verse</h4>
                        </div>

                        <div className='bible_chapters_modal_split' >

                            <div className='bible_chapters_modal_split_books' >
                                <h5>Genesis</h5>
                                <h5>Exodus</h5>
                                <h5>Leviticus</h5>
                                <h5>Numbers</h5>
                                <h5>Deuteronomy</h5>
                            </div>

                            <div className='bible_chapters_modal_split_chapters' >

                                {number.map((numb, index) => {
                                    return <div key={index} >{numb}</div>
                                })}

                            </div>

                            <div className='bible_chapters_modal_split_verse' >
                                {number.map((numb, index) => {
                                    return <div key={index} >{numb}</div>
                                })}
                            </div>

                        </div>

                    </div>

                </div>
                <div className='Version border-b-[1.5px] w-[18%] px-2 border-[#919190] flex items-center text-[14px] text-[#0F4262] relative font-semibold justify-between ml-[3%]'>
                    <span className='cursor-pointer' onClick={handleVersions} >AMPC  </span>
                    <svg onClick={handleVersions} className="ml-auto w-[4%] mr-[2%] cursor-pointer " width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.49947 0.500207C8.83947 0.334207 15.1795 0.500207 21.4995 1.00021C23.2095 2.13321 23.7095 3.63321 22.9995 5.50021C19.8295 10.6672 16.6695 15.8332 13.4995 21.0002C11.6295 21.7112 10.1295 21.2112 8.99947 19.5002C6.83947 14.5082 4.16947 9.84121 0.999466 5.50021C0.389466 3.50521 0.889466 1.83821 2.49947 0.500207Z" fill="#787878" />
                    </svg>
                    <div className='bible_version_modal' style={{
                        display: selectVersion ? 'block' : 'none'
                    }} >
                        <div className='bible_version_modal_top' >
                            <IoIosClose className='bible_version_modal_top_ic' onClick={() => setSelectVersion(false)} />
                            Versions
                        </div>
                        <div className='bible_version_modal_settings' >

                            <h5>Bible Language</h5>

                            <div className='bible_version_modal_settings_split' >
                                <h4>English</h4>
                                <div className='bible_version_modal_settings_split_right' >
                                    <h5>Change Language</h5>
                                    <FaCaretDown className='bible_version_modal_settings_split_right_ic' />
                                </div>
                            </div>

                        </div>
                        <div className='bible_version_modal_section' >
                            <h4>Recently Used</h4>

                            <ModalSection image={Bible1} name='ASV- American Standard Version' />
                            <ModalSection image={Bible2} name='CNB- Good News Bible' />
                            <ModalSection image={Bible3} name='ROR Reference Study Bible' />

                        </div>
                    </div>
                </div>

                <Speaker className='w-[2%] ml-[1%] cursor-pointer' />
                <ParalStudy className='w-[7%] ml-[1%] cursor-pointer' />
                <FontsSet className='w-[3%] ml-[1%] mr-[11%]  cursor-pointer' />
            </div>

            {readerMode === true ?
                // flipbook Mode
                <div className='bible-area w-full h-[80%] mb-2 flex items-start !mt-0 justify-center overflow-hidden'>
                    <HTMLFlipBook
                        ref={flipBookRef}
                        width={900}
                        height={700}
                        className={' flex !w-[80%] bg- [#D8E6F4] items-start !mt-0 leading-6 text-[14px] overflow-hidden h-[100%] justify-center m-1'}
                        style={{ overflow: 'hidden' }}
                        startPage={0}
                        size={'stretch'}
                        minWidth={300}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1200}
                        drawShadow={true}
                        flippingTime={1000}
                        usePortrait={false}
                        startZIndex={0}
                        autoSize={false}
                        maxShadowOpacity={1}
                        showCover={false}
                        mobileScrollSupport={true}
                        clickEventForward={false}
                        useMouseEvents={true}
                        swipeDistance={0}
                        showPageCorners={true}
                        disableFlipByClick={false}
                    >
                        <div className="demoPage p-3 !pt-0">14 You are the children of the Lord your God. Do not cut yourselves or shave the front of your heads for the dead, 2 for you are a people holy to the Lord your God. Out of all the peoples on the face of the earth, the Lord has chosen you to be his treasured possession.

                            3 Do not eat any detestable thing. 4 These are the animals you may eat: the ox, the sheep, the goat, 5 the deer, the gazelle, the roe deer, the wild goat, the ibex, the antelope and the mountain sheep.[a] 6 You may eat any animal that has a divided hoof and that chews the cud. 7 However, of those that chew the cud or that have a divided hoof you may not eat the camel, the rabbit or the hyrax. Although they chew the cud, they do not have a divided hoof; they are ceremonially unclean for you. 8 The pig is also unclean; although it has a divided hoof, it does not chew the cud. You are not to eat their meat or touch their carcasses.

                            9 Of all the creatures living in the water, you may eat any that has fins and scales. 10 But anything that does not have fins and scales you may not eat; for you it is unclean.

                            11 You may eat any clean bird. 12 But these you may not eat: the eagle, the vulture, the black vulture, 13 the red kite, the black kite, any kind of falcon, 14 any kind of raven,
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            15 the horned owl, the screech owl, the gull, any kind of hawk, 16 the little owl, the great owl, the white owl, 17 the desert owl, the osprey, the cormorant, 18 the stork, any kind of heron, the hoopoe and the bat.

                            19 All flying insects are unclean to you; do not eat them. 20 But any winged creature that is clean you may eat.

                            21 Do not eat anything you find already dead. You may give it to the foreigner residing in any of your towns, and they may eat it, or you may sell it to any other foreigner. But you are a people holy to the Lord your God.

                            Do not cook a young goat in its mother’s milk.

                            Tithes
                            22 Be sure to set aside a tenth of all that your fields produce each year. 23 Eat the tithe of your grain, new wine and olive oil, and the firstborn of your herds and flocks in the presence of the Lord your God at the place he will choose as a dwelling for his Name, so that you may learn to revere the Lord your God always. 24 But if that place is too distant and you have been blessed by the Lord your God and cannot carry your tithe (because the place where the Lord will choose to put
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            his Name is so far away), 25 then exchange your tithe for silver, and take the silver with you and go to the place the Lord your God will choose. 26 Use the silver to buy whatever you like: cattle, sheep, wine or other fermented drink, or anything you wish. Then you and your household shall eat there in the presence of the Lord your God and rejoice. 27 And do not neglect the Levites living in your towns, for they have no allotment or inheritance of their own.

                            28 At the end of every three years, bring all the tithes of that year’s produce and store it in your towns, 29 so that the Levites (who have no allotment or inheritance of their own) and the foreigners, the fatherless and the widows who live in your towns may come and eat and be satisfied, and so that the Lord your God may bless you in all the work of your hands.
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            22 Be sure to set aside a tenth of all that your fields produce each year. 23 Eat the tithe of your grain, new wine and olive oil, and the firstborn of your herds and flocks in the presence of the Lord your God at the place he will choose as a dwelling for his Name, so that you may learn to revere the Lord your God always. 24 But if that place is too distant and you have been blessed by the Lord your God and cannot carry your tithe (because the place where the Lord will choose to put his Name is so far away), 25 then exchange your tithe for silver, and take the silver with you and go to the place the Lord your God will choose. 26 Use the silver to buy whatever you like: cattle, sheep, wine or other fermented drink, or anything you wish. Then you and your household shall eat there in the presence of the Lord your God and rejoice. 27 And do not neglect the Levites living in your towns, for they have no allotment or inheritance of their own.

                            28 At the end of every three years, bring all the tithes of that year’s produce and store it in your towns, 29 so that the Levites (who have no allotment or inheritance of their own) and the foreigners, the fatherless and the widows who live in your towns may come and eat and be satisfied, and so that the Lord your God may bless you in all
                        </div>
                        <div className="demoPage p-3 !pt-0">14 You are the children of the Lord your God. Do not cut yourselves or shave the front of your heads for the dead, 2 for you are a people holy to the Lord your God. Out of all the peoples on the face of the earth, the Lord has chosen you to be his treasured possession.

                            3 Do not eat any detestable thing. 4 These are the animals you may eat: the ox, the sheep, the goat, 5 the deer, the gazelle, the roe deer, the wild goat, the ibex, the antelope and the mountain sheep.[a] 6 You may eat any animal that has a divided hoof and that chews the cud. 7 However, of those that chew the cud or that have a divided hoof you may not eat the camel, the rabbit or the hyrax. Although they chew the cud, they do not have a divided hoof; they are ceremonially unclean for you. 8 The pig is also unclean; although it has a divided hoof, it does not chew the cud. You are not to eat their meat or touch their carcasses.

                            9 Of all the creatures living in the water, you may eat any that has fins and scales. 10 But anything that does not have fins and scales you may not eat; for you it is unclean.

                            11 You may eat any clean bird. 12 But these you may not eat: the eagle, the vulture, the black vulture, 13 the red kite, the black kite, any kind of falcon, 14 any kind of raven,
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            15 the horned owl, the screech owl, the gull, any kind of hawk, 16 the little owl, the great owl, the white owl, 17 the desert owl, the osprey, the cormorant, 18 the stork, any kind of heron, the hoopoe and the bat.

                            19 All flying insects are unclean to you; do not eat them. 20 But any winged creature that is clean you may eat.

                            21 Do not eat anything you find already dead. You may give it to the foreigner residing in any of your towns, and they may eat it, or you may sell it to any other foreigner. But you are a people holy to the Lord your God.

                            Do not cook a young goat in its mother’s milk.

                            Tithes
                            22 Be sure to set aside a tenth of all that your fields produce each year. 23 Eat the tithe of your grain, new wine and olive oil, and the firstborn of your herds and flocks in the presence of the Lord your God at the place he will choose as a dwelling for his Name, so that you may learn to revere the Lord your God always. 24 But if that place is too distant and you have been blessed by the Lord your God and cannot carry your tithe (because the place where the Lord will choose to put
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            his Name is so far away), 25 then exchange your tithe for silver, and take the silver with you and go to the place the Lord your God will choose. 26 Use the silver to buy whatever you like: cattle, sheep, wine or other fermented drink, or anything you wish. Then you and your household shall eat there in the presence of the Lord your God and rejoice. 27 And do not neglect the Levites living in your towns, for they have no allotment or inheritance of their own.

                            28 At the end of every three years, bring all the tithes of that year’s produce and store it in your towns, 29 so that the Levites (who have no allotment or inheritance of their own) and the foreigners, the fatherless and the widows who live in your towns may come and eat and be satisfied, and so that the Lord your God may bless you in all the work of your hands.
                        </div>
                        <div className="demoPage p-3 !pt-0">
                            22 Be sure to set aside a tenth of all that your fields produce each year. 23 Eat the tithe of your grain, new wine and olive oil, and the firstborn of your herds and flocks in the presence of the Lord your God at the place he will choose as a dwelling for his Name, so that you may learn to revere the Lord your God always. 24 But if that place is too distant and you have been blessed by the Lord your God and cannot carry your tithe (because the place where the Lord will choose to put his Name is so far away), 25 then exchange your tithe for silver, and take the silver with you and go to the place the Lord your God will choose. 26 Use the silver to buy whatever you like: cattle, sheep, wine or other fermented drink, or anything you wish. Then you and your household shall eat there in the presence of the Lord your God and rejoice. 27 And do not neglect the Levites living in your towns, for they have no allotment or inheritance of their own.

                            28 At the end of every three years, bring all the tithes of that year’s produce and store it in your towns, 29 so that the Levites (who have no allotment or inheritance of their own) and the foreigners, the fatherless and the widows who live in your towns may come and eat and be satisfied, and so that the Lord your God may bless you in all
                        </div>
                    </HTMLFlipBook>
                </div>
                :
                // scroll & Next Chapter mode
                <>
                    {/* reserved area for XmlDisplay or scroll mode */}
                    {/* <XmlDisplay xmlContent={xmlContent} /> */}
                </>
            }

        </div>
    )
};

export default SingleReader;
