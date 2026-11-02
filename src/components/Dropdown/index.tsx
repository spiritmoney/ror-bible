import React, { useEffect, useRef } from 'react';
import style from './styles.module.scss';
// import { random } from 'lodash';
import clsx from 'clsx';
import { useIntersectionObserver } from 'usehooks-ts';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IDropdown {
  children: any;
  content: any
  dropdownClassName?: string
  style?: string
  className?: string
  onOpen?: () => void
  onClose?: () => void
  disabled?: boolean
  position?: 'left' | 'right'
}

const Dropdown: React.FunctionComponent<IDropdown> = ({ children, position = 'left', content, className, dropdownClassName, disabled, onClose, onOpen }) => {
  // const id = String(random(10000));
  const ref = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(ref, {})
  const isVisible = !!entry?.isIntersecting
  const DarkTheme = useRecoilValue(DarkThemeAtom);

  useEffect(() => {
    if(isVisible) {
      onOpen && onOpen()
    } else {
      onClose && onClose()
    }
  }, [isVisible, onClose, onOpen])

  return (
    <div className="flex w-[20%] z-[initial]">
      <div className='w-full'>
        <div className="dropdown relative z-[initial]">
          <div
            className={clsx(className, 'w-full flex items-center')}
            // id={`dropdownMenuButton${id}`}
            data-bs-toggle={!disabled && "dropdown"}
            aria-expanded="false"
          >
            <>{children}</>
          </div>
          {/* dropdown menu */}
          <div
            className={clsx(` 
            dropdown-menu 
            min-w-max 
            absolute 
            text-base 
            list-none 
            font-montserrat 
            justify-center
            bg-white
            text-brand-navy
            text-left 
            shadow-brand-card 
            mt-1 
            hidden 
            m-0 
            rounded-[18px]
            border border-brand-mist
            bg-clip-padding 
            `, 
            { ' Dark bg-[#071723] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true },
            // { ' Dark bg-[#071723] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true },
            { [style['dropdown-right']] : position === 'right'},
            dropdownClassName)}
            // aria-labelledby={`dropdownMenuButton${id}`}
            ref={ref}
          >
            <>{content}</>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
