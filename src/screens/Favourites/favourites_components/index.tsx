import './fav.scss';
import HeadsetImg from '../../../assets/headset_icon.png';
import BibleImg from '../../../assets/bible_icon.png';
import GlobeImg from '../../../assets/globe_icon.png';
import FreesBeeImg from '../../../assets/frees_bees_icon.png';
import { Link } from 'react-router-dom';
import { FavItem } from 'components/Store_Components';
import Bible1 from '../../../assets/bible/bible1.png';
import Bible2 from '../../../assets/bible/bible2.png';
import Bible3 from '../../../assets/bible/bible3.png';
import Bible4 from '../../../assets/bible/bible4.png';
import Bible5 from '../../../assets/bible/bible5.png';
import Bible6 from '../../../assets/bible/bible6.png';
import Bible7 from '../../../assets/bible/bible7.png';
import Bible8 from '../../../assets/bible/bible8.png';
import Bible9 from '../../../assets/bible/bible9.png';
import Bible10 from '../../../assets/bible/bible10.png';
import Bible11 from '../../../assets/bible/bible11.png';
import Bible12 from '../../../assets/bible/bible12.png';
import Bible13 from '../../../assets/bible/bible13.png';
import Bible14 from '../../../assets/bible/bible14.png';
import Bible15 from '../../../assets/bible/bible15.png';
import Bible16 from '../../../assets/bible/bible16.png';
import Bible17 from '../../../assets/bible/bible17.png';
import Bible18 from '../../../assets/bible/bible18.png';
import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';
import { useRecoilState } from 'recoil';
import { SetNavAtom } from 'store/atoms/general';



type storeFavouritesTypes = {
    hidden: boolean,
}

const FavouritesHomePage = ({
    hidden,
}: storeFavouritesTypes) => {
    const [nav, setNav] = useRecoilState(SetNavAtom)

    return (

        <div className="w-full" style={{
            display: hidden ? 'none' : 'block'
        }} >
            <SubNav nav={nav} setNav={setNav} className='border-b-[5px] border-[#DFE1D8]' />
            <div className="favourite_home" style={{
                display: hidden ? 'none' : 'block'
            }} >
                {/* Bible */}
                <div className='favourite_home_list' >

                    <div className='favourite_home_list_top' >

                        <div className='favourite_home_list_top_left' >
                            <img src={HeadsetImg} />
                            <h5>Bibles</h5>
                        </div>

                        <Link to={'/store/bible'} >See All</Link>

                    </div>

                    <div className='favourite_home_list_btm' >

                        <FavItem image={Bible4} name='ROR Audio Bible' version='King James Version' />
                        <FavItem image={Bible1} name='ROR Hindi Audio Bible' version='King James Version' />
                        <FavItem image={Bible2} name='ROR Portuguese Audio Bible' version='King James Version' />

                    </div>

                </div>
                {/* Resources */}
                <div className='favourite_home_list' >

                    <div className='favourite_home_list_top' >

                        <div className='favourite_home_list_top_left' >
                            <img src={BibleImg} />
                            <h5>Resources</h5>
                        </div>

                        <Link to={'/store/resources'} >See All</Link>

                    </div>

                    <div className='favourite_home_list_btm' >
                        <FavItem image={Bible3} name='The Enhance Strong Concordance' version='Revised standard version' />
                        <FavItem image={Bible4} name='Loveworld Exhaustive Concordance' version='Revised standard version' />
                        <FavItem image={Bible5} name='The Enhance Strong Dictionary' version='Revised standard version' />
                    </div>

                </div>
                {/* Translation */}
                <div className='favourite_home_list' >

                    <div className='favourite_home_list_top' >

                        <div className='favourite_home_list_top_left' >
                            <img src={GlobeImg} />
                            <h5>Translations</h5>
                        </div>

                        <Link to={'/store/translations'} >See All</Link>

                    </div>

                    <div className='favourite_home_list_btm' >
                        <FavItem image={Bible6} name='ROR Afrikaanas Translation' version='Revised standard version' />
                        <FavItem image={Bible7} name='ROR Albanian Translation' version='Revised standard version' />
                        <FavItem image={Bible2} name='ROR Bengali Translation' version='Revised standard version' />
                    </div>

                </div>
                {/* Freebies */}
                <div className='favourite_home_list' >

                    <div className='favourite_home_list_top' >

                        <div className='favourite_home_list_top_left' >
                            <img src={FreesBeeImg} />
                            <h5>Freebies</h5>
                        </div>

                        <Link to={'/store/freesbies'} >See All</Link>

                    </div>

                    <div className='favourite_home_list_btm' >
                        <FavItem image={Bible1} name='Sponsor' version='Freesbie' />
                        <FavItem image={Bible2} name='#Spread' version='Freesbie' />
                        <FavItem image={Bible3} name='#Study' version='Freesbie' />
                    </div>

                </div>

            </div>
        </div>

    );

}


export default FavouritesHomePage;