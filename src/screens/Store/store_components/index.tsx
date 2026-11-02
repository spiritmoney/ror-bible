import './store.scss';
import HeadsetImg from '../../../assets/headset_icon.png';
import IndibibleImg from '../../../assets/indi_bible.png';
import BibleImg from '../../../assets/bible_icon.png';
import GlobeImg from '../../../assets/globe_icon.png';
import maiBiBle from '../../../assets/main_bible.png';
import FreesBeeImg from '../../../assets/frees_bees_icon.png';
import StoreImgleft from '../../../assets/store_img_left.png';
import StoreImgright from '../../../assets/store_img_right.png';
import StoreImgtop from '../../../assets/store_img_top.png';
import { Link } from 'react-router-dom';
import { StoreItem } from 'components/Store_Components';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { IBanners, IEventBanner, IStoreProduct } from 'interface/storeProducts'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { ProdSKUAtom, SetNavAtom, SideNavAtom, storeBackAtom } from 'store/atoms/general';
import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';
import clsx from 'clsx';


type storeHomeTypes = {
    hidden: boolean,
}

const StoreHomePage = ({
    hidden,
}: storeHomeTypes) => {

    const [bibleProducts, setBibleProducts] = useState<IStoreProduct[]>([]);
    const [audioProducts, setAudioProducts] = useState<IStoreProduct[]>([]);
    const [resourceProducts, setResourceProducts] = useState<IStoreProduct[]>([]);
    const [translationsProducts, setTranslationsProducts] = useState<IStoreProduct[]>([]);
    const [freebiesProducts, setFreebiesProducts] = useState<IStoreProduct[]>([]);
    const [banners, setBanners] = useState<IBanners[]>([]);
    const [event, setEvent] = useState<IEventBanner[]>([]);
    const [nav, setNav] = useRecoilState(SetNavAtom);
    const [sku, setSKU] = useRecoilState(ProdSKUAtom);
    const [back, setBack] = useRecoilState(storeBackAtom);
    const [loading, setLoading] = useState(false);
    const [sideNav, setSideNav] = useRecoilState(SideNavAtom);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2, response3, response4, response5, response6, response7] = await Promise.all([
                    axios.get('https://api.rorbible.plus/prem/bibleJSON.php'),
                    axios.get('https://api.rorbible.plus/prem/audioJSON.php'),
                    axios.get('https://api.rorbible.plus/prem/booksJSON.php'),
                    axios.get('https://api.rorbible.plus/prem/rorJSON.php'),
                    axios.get('https://api.rorbible.plus/prem/freebies.php'),
                    axios.get('https://api.rorbible.plus/prem/coverflow.php'),
                    axios.get('https://api.rorbible.plus/prem/coverflow2.php')
                ]);

                setBibleProducts(response1.data.slice(0, 3));
                setAudioProducts(response2.data.slice(0, 3));
                setResourceProducts(response3.data.slice(0, 3));
                setTranslationsProducts(response4.data.slice(0, 3));
                setFreebiesProducts(response5.data.slice(0, 3));
                setBanners(response6.data);
                setEvent(response7.data.slice(0, 2));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = async (prodSKU: any) => {
        setSKU(prodSKU);
        setBack('store');
        setLoading(true);
        setTimeout(() => {
            setNav('product');
            setLoading(false);
        }, 1500); // Adjust the delay as needed
    };
    function truncateString(input: string, maxLength: number): string {
        if (input.length <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength - 3) + '...';
    }


    return (

        <div className=" w-full" style={{
            display: hidden ? 'none' : 'block'
        }} >
            <SubNav nav={nav} setNav={setNav} className='border-b-[5px] border-[#DFE1D8]' />
            <div className="store_home w-full" style={{
                display: hidden ? 'none' : 'block'
            }} >

                {loading && (

                    <div className={clsx("fixed inset-0 flex items-end mb-[3.3rem] ml-[15.2%] justify-center bg-blac bg-opacity-20 z-50", {'ml-[5.6%]' : sideNav === false})}>

                        <div className="h-[1.3rem] w-full bg-[#04557D] flex items-center justify-center  ">
                            <div className="relative  w-[97%] h-[0.4rem] bg-[#2f2f2f] flex items-center  rounded-full  overflow-hidden">
                                <div className="absolute left-[10%] w-[100%] ml-2 h-[0.4rem] bg-[#0ba4d0] rounded-full animate-loader"></div>
                            </div>
                        </div>


                    </div>
                )}

                {/*Slidder Banner */}
                <Carousel
                    autoPlay={true}
                    showThumbs={false}
                    dynamicHeight={true}
                    infiniteLoop={true}
                    selectedItem={0}
                    key={banners.length}
                >
                    {banners.map((banner, i) => (
                        <div
                            key={banner.ProductSKU}
                            onClick={() => handleViewDetails(banner.ProductSKU)}
                        >
                            <img className='carousel_img' src={banner.Imageurl} />

                        </div>
                    ))}


                    {/* <div>

    <img className='carousel_img' src={StoreImgtop} />
</div>
<div>
    <img className='carousel_img' src={StoreImgtop} />
</div>
<div>
    <img className='carousel_img' src={StoreImgtop} />
</div> */}
                </Carousel>


                <div className='store_home_ad flex' >
                    {event.map((event, i) => (
                        <img src={event.Imageurl} />
                    ))}
                </div>



                {/* Bible Category */}
                <div className='store_home_list' >

                    <div className='store_home_list_top' >

                        <div className='store_home_list_top_left' >
                            <img src={BibleImg} />
                            <h5>Bibles</h5>
                        </div>

                        <Link to={'/store/bible'} onClick={() => setNav('store_bible')}>See All</Link>

                    </div>

                    <div className='store_home_list_btm' >

                        {bibleProducts.map((product, i) => (
                            <StoreItem key={i} onClick={() => handleViewDetails(product.ProductSKU)} image={product.Imageurl} name={product.Title.slice(0, 20) + '...'} version={'$' + product.Price} />
                        ))}
                    </div>

                </div>

                {/* Audio Category */}
                <div className='store_home_list' >

                    <div className='store_home_list_top' >

                        <div className='store_home_list_top_left' >
                            <img src={HeadsetImg} />
                            <h5>Audio</h5>
                        </div>

                        <Link to={'/store/audioBibles'} onClick={() => setNav('store_audio')} >See All</Link>

                    </div>

                    <div className='store_home_list_btm' >
                        {audioProducts.map((product, i) => (

                            <StoreItem key={i} onClick={() => handleViewDetails(product.ProductSKU)} image={product.Imageurl} name={product.Title.slice(0, 20) + '...'} version={'$' + product.Price} />
                        ))}
                    </div>

                </div>

                <div className='store_home_ad' >

                    <img src={StoreImgleft} />
                    <img src={StoreImgright} />

                </div>

                {/* Resources Category */}
                <div className='store_home_list' >

                    <div className='store_home_list_top' >

                        <div className='store_home_list_top_left' >
                            <img src={BibleImg} />
                            <h5>Resources</h5>
                        </div>

                        <Link to={'/store/resources'} onClick={() => setNav('store_resources')} >See All</Link>

                    </div>

                    <div className='store_home_list_btm' >
                        {resourceProducts.map((product, i) => (

                            <StoreItem key={i} onClick={() => handleViewDetails(product.ProductSKU)} image={product.Imageurl} name={product.Title.slice(0, 20) + '...'} version={'$' + product.Price} />
                        ))}
                    </div>

                </div>

                {/* Translations Category */}
                <div className='store_home_list' >

                    <div className='store_home_list_top' >

                        <div className='store_home_list_top_left' >
                            <img src={GlobeImg} />
                            <h5>Translations</h5>
                        </div>

                        <Link to={'/store/translations'} onClick={() => setNav('store_translations')} >See All</Link>

                    </div>

                    <div className='store_home_list_btm' >
                        {translationsProducts.map((product, i) => (

                            <StoreItem key={i} onClick={() => handleViewDetails(product.ProductSKU)} image={product.Imageurl} name={product.Title.slice(0, 20) + '...'} version={'$' + product.Price} />
                        ))}
                    </div>

                </div>

                {/* Freebies Category */}
                <div className='store_home_list' >

                    <div className='store_home_list_top' >

                        <div className='store_home_list_top_left' >
                            <img src={FreesBeeImg} />
                            <h5>Freebies</h5>
                        </div>

                        <Link to={'/store/freesbies'} onClick={() => setNav('store_freesbies')} >See All</Link>

                    </div>

                    <div className='store_home_list_btm' >
                        {freebiesProducts.map((product, i) => (

                            <StoreItem key={i} onClick={() => handleViewDetails(product.ProductSKU)} image={product.Imageurl} name={product.Title.slice(0, 20) + '...'} version={'$' + product.Price} />
                        ))}
                    </div>

                </div>

            </div>



        </div>

    );

}


export default StoreHomePage;