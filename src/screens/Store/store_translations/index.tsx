import './index.scss';
import React, { useEffect, useState } from 'react';
import BibleIcon from '../../../assets/globe_icon.png'
import { Bible } from 'components/Store_Components';
import { IStoreProduct } from 'interface/storeProducts';
import axios from 'axios';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { ProdSKUAtom, SetNavAtom, storeBackAtom, storeCartAtom } from 'store/atoms/general';
import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';


export interface IStore {

    hidden: boolean

}

const StoreTransalations: React.FunctionComponent<IStore> = ({
    hidden
}) => {

    const [transProducts, setTransProducts] = useState<IStoreProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10; // Number of products to display per page
    const [nav, setNav] = useRecoilState(SetNavAtom);
    const [sku, setSKU] = useRecoilState(ProdSKUAtom);
    const [back, setBack] = useRecoilState(storeBackAtom);
    const [storeCart, setStoreCart] = useRecoilState(storeCartAtom);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response] = await Promise.all([
                    axios.get('https://api.rorbible.plus/prem/rorJSON.php'),

                ]);

                setTransProducts(response.data);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    // Pagination 

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = transProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(transProducts.length / productsPerPage);

    const handleViewDetails = async (prodSKU: any) => {
        setSKU(prodSKU);
        setStoreCart('translation');
        setLoading(true);
        setBack('store_translations');
        console.log('sku', sku);
        // Simulate loading delay (replace with actual navigation logic)
        setTimeout(() => {
            setNav('product');
            setLoading(false);
        }, 1000); // Adjust the delay as needed
    }

    return (
        <div style={{
            display: hidden ? 'none' : 'block',
        }} className='w-full' >
            <SubNav nav={nav} setNav={setNav} className='border-b-[5px] border-[#DFE1D8]' />
            <div style={{
                display: hidden ? 'none' : 'block',
                overflowY: "auto"
            }} className='store_bible' >
                {loading && (
                    <div className="fixed inset-0 flex items-end mb-[3.25rem] !ml-[2rem] justify-center bg-blac bg-opacity-20 z-50">
                        <div className="h-[1.3rem] w-[90%] bg-[#04557D] flex items-center justify-center  !ml-[11.5rem]">
                            <div className="relative  w-[97%] h-[0.4rem] bg-[#2f2f2f] flex items-center  rounded-full  overflow-hidden">
                                {/* <div className="absolute left-[10%] w-[100%] ml-2 h-[0.4rem] bg-[#1567e1] rounded-full animate-loader"></div> */}
                                <div className="absolute left-[10%] w-[100%] ml-2 h-[0.4rem] bg-[#0ba4d0] rounded-full animate-loader"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='store_bible_top' >

                    <img src={BibleIcon} alt='bibleIcon' />
                    <h4>Translations</h4>

                </div>

                <h6 className='store_bible_count'>{`${currentPage} of ${totalPages}`}</h6>

                <div className='store_bible_main'
                    style={{
                        marginTop: '0rem',
                        display: 'flex',
                        flexWrap: "wrap",
                        // justifyContent: "space-evenly",
                    }} >
                    {currentProducts.map((product, i) => (
                        <div key={i} className='bible_list' >

                            <img src={product.Imageurl} onClick={() => { handleViewDetails(product.ProductSKU) }}
                            />
                            <h5>{product.Title.slice(0, 26) + '...'}</h5>
                            <button onClick={() => {
                                handleViewDetails(product.ProductSKU)

                            }}>Read</button>


                        </div>))}
                </div>

                <ul className="pagination flex mr-auto w-full justify-end text-[12px]">
                    <li className='Prev mr-2'>
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            <svg
                                width="11"
                                height="16"
                                viewBox="0 0 11 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={clsx({ 'opacity-25': currentPage === 1 })}
                            >
                                <path
                                    d="M4.26159 8.03067L10.0833 13.8524L8.42032 15.5154L0.935547 8.03067L8.42032 0.545898L10.0833 2.20892L4.26159 8.03067Z"
                                    fill="#151A20"
                                // fillOpacity="0.45"
                                />
                            </svg>
                        </button>
                    </li>
                    {/* {renderPageNumbers()} */}
                    {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, transProducts.length)} of {transProducts.length}

                    <li className='next ml-2'>
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            <svg
                                width="10"
                                height="16"
                                viewBox="0 0 10 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={clsx({ 'opacity-25': currentPage === totalPages })}
                            >
                                <path
                                    d="M6.58518 8.03067L0.763428 2.20892L2.42645 0.545898L9.91122 8.03067L2.42645 15.5154L0.763428 13.8524L6.58518 8.03067Z"
                                    fill="#151A20"
                                />
                            </svg>
                        </button>
                    </li>
                </ul>



            </div>


        </div>

    );
};

export default StoreTransalations;
