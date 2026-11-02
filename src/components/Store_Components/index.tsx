import { useRecoilState } from 'recoil'
import './index.scss'
import { SetNavAtom } from 'store/atoms/general'


type IndividualData = {
    image:string,
    name:string,
    version:string
    onClick?: () => void;
}

export const StoreItem = ({ 
    image,
    name,
    version,
    onClick
 }: IndividualData) => {

    return (
        <div className='store_list_btm_div' >

            <img src={image} onClick={onClick} className='cursor-pointer'/>

            <div>
                <h5>{name}</h5>
                <h6>{version}</h6>
                <button onClick={onClick}>VIEW</button>
            </div>

        </div>
    )

}


type FavData = {
    image:string,
    name:string,
    version:string
}


export const FavItem = ({
    image,
    name,
    version
}:FavData) => {

    return (
        <div className='fav_list' >

            <img src={image} />

            <div>
                <h5>{name}</h5>
                <h6>{version}</h6>
                <button>Read</button>
            </div>

        </div>
    )

}

type BibleData = {
    image:string,
    name:string,
}


export const Bible = ({
    image,
    name,
}:BibleData) => {
    const [nav, setNav] = useRecoilState(SetNavAtom);

    return (
        <div className='bible_list'  >

            <img src={image} />
            <h5>{name}</h5>

        </div>
    )

}
export const Audio = ({
    image,
    name,
}:BibleData) => {

    return (
        <div className='bible_list' >

            <img src={image} />
            <h5>{name}</h5>
            <button>Listen</button>

        </div>
    )

}
export const Product = ({
    image,
    name,
}:BibleData) => {

    return (
        <div className='bible_list' >

            <img src={image} />
            <h5>{name}</h5>
            {/* <button>Listen</button> */}

        </div>
    )

}