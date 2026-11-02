import './index.scss';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import BibleIcon from '../../../assets/bible_icon.png'
import BibleIcon2 from '../../../assets/bible/bible12.png'
import { Bible, Product } from 'components/Store_Components';
import { IStoreProduct } from 'interface/storeProducts';
import axios from 'axios';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { ProdSKUAtom, SetNavAtom, storeBackAtom, storeCartAtom } from 'store/atoms/general';
import SharePopup from 'screens/Store/Share'

export interface IStore {
    hidden: boolean
}

const ProductDetails: React.FunctionComponent<IStore> = ({
    hidden
}) => {
    const [productdet, setProductdet] = useState<IStoreProduct[]>([]);
    const [otherProd, setOtherProd] = useState<IStoreProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10; // Number of products to display per page
    const [sku, setSKU] = useRecoilState(ProdSKUAtom);
    const [back, setBack] = useRecoilState(storeBackAtom);
    const [nav, setNav] = useRecoilState(SetNavAtom);
    const [storeCart, setStoreCart] = useRecoilState(storeCartAtom);
    const [showPopup, setShowPopup] = useState(false);

    const url = "https://rhapsodybible.web.app/store/product?";
    const title = "Check out this article on the ever-inspiring Rhapsody Bible "; 

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const handleProductRead  = () => {
        setNav( 'multi_layout');
    };

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const [response, response2] = await Promise.all([
                    axios.get(`https://api.rorbible.plus/prem/productSku.php?sku=${sku}`),
                    // axios.get(`https://api.rorbible.plus/prem/productSku.php?sku=rorb29`),
                    axios.get(`https://api.rorbible.plus/prem/productSearchWildcard.php?keyword=${storeCart}`),

                ]);

                setProductdet(response.data);
                setOtherProd(response2.data.slice(0, 4));

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        console.log('sku', sku)
        console.log('productdet', productdet)

        fetchData();
    }, [sku, storeCart]);

    const handleViewDetails = async (prodSKU: any) => {
        setSKU(prodSKU);
        setStoreCart('bible');
        setBack('store_bible');
        setNav('product');
        console.log('sku', sku);
    }

    const handleBack = () => {
        setNav(back);
    }


    return (
        <div style={{
            display: hidden ? 'none' : 'block',
            overflowY: "auto"
        }} className='store_bibleProd' >

            <div className='store_bible_top' >
                <span title='back to store' className='cursor-pointer mr-2 font-bold text-[25px]' onClick={handleBack}>{`←`}</span>
                <img src={BibleIcon} alt='bibleIcon' />
                <h4>Product Details </h4>

            </div>

            {productdet.map((productdet, i) => (

                <div className='store_bible_main items center '
                    style={{
                        marginTop: '2rem',
                        display: 'flex',
                    }} >
                    <div className='product_list flex w-full' >
                        <div className='sec1 flex flex-col'>
                            <img src={productdet.Imageurl} className='cursor-pointer' onClick={ handleProductRead} />
                            <h2>{productdet.Title}</h2>
                            <span className='author font-bold te mt-2 cursor-pointer'>
                                Author:  <span className='font-normal'>  {productdet.Author}</span>
                            </span>

                            <span className='bg-blue-400 hover:bg-blue-700 mt-4 !text-[#ffffff] font-semibold py-0.5 px-3 rounded w-fit '> ${productdet.Price}</span>
                            {/* Share button */}
                            <span className='bg-red-400 hover:bg-red-700 cursor-pointer mt-4 !text-[#ffffff] font-semibold py-0.5 px-3 rounded w-fit '
                                onClick={togglePopup} > Share
                            </span>

                        </div>
                    </div>
                    <div className='product_list 2 flex w-full flex-col justify-between' >
                        <div className='sec2 flex flex-col h-[40%] mb-5'>

                            <span className='desc text-[1rem] mt-4 ml-auto'>
                                {productdet.Description}
                            </span>

                        </div>
                        <span className='font-semibold mt-[3rem]'> Other Related Products</span>
                        <div className='otherProducts flex'>
                            {otherProd.map((product, i) => (
                                <div className='bible_list ml-4 ' onClick={() => {
                                    handleViewDetails(product.ProductSKU)
                                }}
                                >
                                    <img className='w-[2rem] cursor-pointer ' src={product.Imageurl} />
                                    <h5>{product.Title.slice(0, 20) + '...'}</h5>
                                    <button onClick={() => {
                                        handleViewDetails(product.ProductSKU)

                                    }} >view</button>
                                </div>
                            ))}


                        </div>



                    </div>

                    {showPopup && <SharePopup url={url} title={'Check out this article' } onClose={togglePopup} />}


                </div>
            ))}



        </div>

    );
};

export default ProductDetails;
