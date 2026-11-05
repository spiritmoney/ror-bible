import clsx from 'clsx';
import React from 'react';
// import style from './styles.module.scss';
import { useRef, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import { useIntersectionObserver } from 'usehooks-ts';

export interface IModal {
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

const Modal: React.FunctionComponent<IModal> = ({
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
  const closeRef = useRef<any>();
  const DarkTheme = useRecoilValue(DarkThemeAtom);



  // useMemo(() => {
  //   console.log('content')
  //   setshh(content)}, [content])

  useEffect(() => {
    if (isVisible) {
      setshh(content);
      onOpen && onOpen();
    } else if (!isShown) {
      setshh(undefined);
      setIsShown && setIsShown(false);
      onClose && onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, isShown]);

  useEffect(() => {
    if (isShown) {
      openRef.current.click();
    } else {
      closeRef.current.click();
    }
  }, [isShown]);

  useEffect(() => {
    if (!isShown || hasHeader) {
      return undefined;
    }
    const modalEl = ref.current;
    if (!modalEl) {
      return undefined;
    }

    const dismiss = () => {
      closeRef.current?.click();
      setIsShown?.(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
      }
    };

    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === modalEl) {
        dismiss();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    modalEl.addEventListener('mousedown', onBackdropClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      modalEl.removeEventListener('mousedown', onBackdropClick);
    };
  }, [hasHeader, isShown, setIsShown]);

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
        className={clsx('modal fade fixed top-0 left-0 hidden w-full h-full max-h-full outline-none overflow-x-hidden overflow-y-auto', )}
        id={`exampleModalCenteredScrollable${id}`}
        aria-labelledby={`exampleModalCenteredScrollable${id}`}
        aria-modal="true"
        role="dialog"
        ref={ref}
      >
        <a
          href="#"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={closeRef}
        ></a>

        <div className="modal-dialog max-w-max modal-dialog-centered modal-dialog-scrollable relative pointer-events-none">
          <div className={clsx('modal-content max-w-[100vw] border border-brand-mist shadow-brand-card relative flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-3xl outline-none text-current font-montserrat', { '!bg-[#071723] !border-[#0F2230] !text-[#EDF1F3]': DarkTheme === true })}>
            {hasHeader && (
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-brand-mist rounded-t-3xl">
                <h5
                  className="text-xl font-bold leading-normal text-brand-blue font-montserrat"
                  id="exampleModalCenteredScrollableLabel"
                >
                  {title ?? 'Modal title'}
                </h5>
                <button
                  type="button"
                  className="btn-close box-content w-4 h-4 p-1 border-none rounded-lg opacity-60 ds-focus-visible hover:opacity-100"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            )}
            {!hasHeader && (
              <button
                type="button"
                className="modal-headerless-close ds-focus-visible"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsShown?.(false)}
              />
            )}
            <div className="overflow-auto">
              {loadOnOpen
                ? isVisible
                  ? <>{shh}</>
                  : ''
                : isShown
                  ? <>{content}</>
                  : <>{shh}</>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
