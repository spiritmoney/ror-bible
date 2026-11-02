import clsx from 'clsx';
import React from 'react';
// import style from './styles.module.scss';
import { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import { useIntersectionObserver } from 'usehooks-ts';

export interface IUtility {
  scrollable?: boolean;
  children?: any;
  title?: string;
  content?: any;
  onOpen?: () => void;
  onClose?: () => void;
  loadOnOpen?: boolean;
  id?: number | string;
  hasHeader?: boolean;
  isShown?: boolean;
  setIsShown?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Utility: React.FunctionComponent<IUtility> = ({
  children,
  scrollable,
  title,
  content,
  onClose,
  onOpen,
  loadOnOpen,
  id,
  hasHeader = true,
  isShown,
  setIsShown,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const [shh, setshh] = useState<any>();
  const openRef = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);


  // useMemo(() => {
  //   console.log('content')
  //   setshh(content)}, [content])

  useEffect(() => {
    if (isVisible) {
      setshh(content);
      onOpen && onOpen();
    } else {
      setshh(undefined);
      setIsShown && setIsShown(false);
      onClose && onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (isShown) {
      openRef.current.click();
    }
  }, [isShown]);

  return (
    <>
      <div className={clsx({ 'h-0': !children })}>
        <button
          data-bs-toggle="modal"
          ref={openRef}
          data-bs-target={`#exampleModalCenteredScrollable${id}`}
        >
          <>{children}</>
        </button>
      </div>

      <div
        className="modal fixed top-0 left-0 hidden w-full h-full max-h-full outline-none overflow-x-hidden overflow-y-auto"
        id={`exampleModalCenteredScrollable${id}`}
        aria-labelledby={`exampleModalCenteredScrollable${id}`}
        aria-modal="true"
        role="dialog"
        ref={ref}
      >
        <div className="modal-dialog max-w-max modal-dialog-centered modal-dialog-scrollable relative pointer-events-none">
          <div className={clsx('modal-content z-[10000] max-w-[100vw] border-none shadow-lg relative flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current', { '!bg-[#071723] border-[#0F2230] !text-[#EDF1F3]': DarkTheme === true })}>
            {hasHeader && (
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                <h5
                  className="text-xl font-medium leading-normal text-gray-800"
                  id="exampleModalCenteredScrollableLabel"
                >
                  {title ?? 'Modal title'}
                </h5>
                <button
                  type="button"
                  className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            )}
            <div className="overflow-auto">
              {loadOnOpen ? isVisible ? <>{shh}</> : '' : <>{shh}</>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Utility;
