import clsx from 'clsx';
import useGetSize from 'hooks/useGetSize';
import React, { useEffect, useState } from 'react';
import { DraggableCore } from 'react-draggable';
import { useRecoilValue } from 'recoil';
import { ReactComponent as AnotationsIcon } from '../../assets/annotation.svg';
import { ReactComponent as Mic } from '../../assets/microphone.svg';
import { ReactComponent as Comment } from '../../assets/comment.svg';
import { ReactComponent as Rectangle } from '../../assets/drag-rectangle.svg';
import { ReactComponent as Arrow } from '../../assets/short-arrow.svg';
import { ReactComponent as FilterIcon } from '../../assets/filter.svg';
import { ReactComponent as FilterIconDark } from '../../assets/FilterDark.svg';
import { ISquareSwitchPosition } from '../../interface/squareSwitch';
import {
  footerHeightAtom,
  headerHeightAtom,
  workspaceHeaderHeightAtom,
} from '../../store/atoms/size';
import { annotationSwitchAtom } from '../../store/atoms/workspace';
import Input from 'components/Input';
import Button from 'components/Button';
import SideNote from 'components/SideNote';
import { test } from './test';
// import style from './styles.module.scss';
import useProjects from '../../hooks/useProjects';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IAnotations {
  quill: any;
}

const Anotations: React.FunctionComponent<IAnotations> = ({ quill }) => {
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const workspaceHeaderHeight = useRecoilValue(workspaceHeaderHeightAtom);
  const toggle = useRecoilValue<ISquareSwitchPosition>(annotationSwitchAtom);
  const [x, setX] = useState(0);
  const { ref, width: widthSize } = useGetSize(x);
  const { ref: ref2, height } = useGetSize();
  const { ref: ref3, height: height2 } = useGetSize();
  const [view, setView] = useState<
    'all' | 'annotations' | 'voice-notes' | 'coments'
  >('all');

  const [width, setwidth] = useState(0);
  const { allAnnotations, allComments, allVoiceNotes } = useProjects();
  const DarkTheme = useRecoilValue(DarkThemeAtom);

  useEffect(() => {
    setwidth(widthSize);
  }, [widthSize]);

  useEffect(() => {
    console.log({ width });
  }, [width, x]);

  return (
    <aside
      style={{
        minHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
        maxHeight: `calc(100vh - ${
          footerHeight + headerHeight + workspaceHeaderHeight
        }px)`,
        // transform:  `translateX(${x}px)`,
        width: `${
          toggle === 'left' ? '0px' : width ? `${width - x}px` : '100%'
        }`,
      }}
      ref={ref}
      className={clsx(
        'relative  w-full scroll-auto',
        {
          'w-full scale-100': toggle === 'right',
          'w-0': toggle === 'left',
        },
        {
          '!bg-[#0F2230] !text-[#EDF1F3] !border-[#0F2230]': DarkTheme === true,
        },
        'border rounded-[0px_5px_5px_0px]'
      )}
    >
      <div
        ref={ref2}
        className={clsx(
          'flex items-center gap-x-[30px] px-5 h-[60px] shadow-[0px_2px_8px_rgba(73,95,137,0.1)] rounded-[5px_0px_0px_5px]',
          { 'justify-around': width <= 475 && width > 205 }
        )}
      >
        <div
          className={clsx(
            'flex items-center gap-x-2 cursor-pointer text-base',
            {
              'font-semibold text-primary border-b-2 border-primary':
                view === 'all',
              'font-light': view !== 'all',
            },
            { '!bg-[#0F2230] !text-[#EDF1F3] ': DarkTheme === true }
          )}
          onClick={() => setView('all')}
        >
          All
        </div>
        <div
          className={clsx(
            'flex items-center gap-x-2 cursor-pointer text-base',
            {
              'font-semibold text-primary border-b-2 border-primary':
                view === 'annotations',
              'font-light ': view !== 'annotations',
            }
          )}
          onClick={() => setView('annotations')}
        >
          {width > 475 && 'Annotations'} <AnotationsIcon />
        </div>
        <div
          className={clsx(
            'flex items-center gap-x-2 cursor-pointer text-base shrink-0',
            {
              'font-semibold text-primary border-b-2 border-primary':
                view === 'voice-notes',
              'font-light': view !== 'voice-notes',
            }
          )}
          onClick={() => setView('voice-notes')}
        >
          {width > 475 && 'Voice Notes'} <Mic />
        </div>
        <div
          className={clsx(
            'flex items-center gap-x-2 cursor-pointer text-base ',
            {
              'font-semibold text-primary border-b-2 border-primary':
                view === 'coments',
              'font-light': view !== 'coments',
            }
          )}
          onClick={() => setView('coments')}
        >
          {width > 475 && 'Comments'} <Comment />
        </div>
      </div>

      <div
        ref={ref3}
        className="flex mt-[1.1875rem] mb-[1.6875rem] items-center justify-between gap-x-10 px-[2.1875rem] "
      >
        <Input
          type={'search'}
          placeholder="Search by book name, Date, Name of Author"
        />
        <Button className="px-0 h-fit">
          {!DarkTheme ? <FilterIcon /> : <FilterIconDark />}
        </Button>
      </div>

      <div
        className={clsx('flex flex-col gap-y-8 overflow-y-auto pb-32', {
          ' !text-[#EDF1F3] ': DarkTheme === true,
        })}
        style={{
          minHeight: `calc(100vh - ${
            footerHeight +
            headerHeight +
            workspaceHeaderHeight +
            height +
            height2
          }px)`,
          maxHeight: `calc(100vh - ${
            footerHeight +
            headerHeight +
            workspaceHeaderHeight +
            height +
            height2
          }px)`,
        }}
      >
        {(view === 'all' || view === 'annotations') && (
          <SideNote type="anotation" data={allAnnotations} quill={quill} />
        )}
        {(view === 'all' || view === 'voice-notes') && (
          <SideNote type="voice" data={allVoiceNotes} quill={quill} />
        )}
        {(view === 'all' || view === 'coments') && (
          <SideNote type="comment" data={allComments} quill={quill} />
        )}
      </div>

      <DraggableCore
        ref={ref}
        onDrag={(e, data) => {
          setX(prev => {
            if (prev === data.lastX) {
              return prev;
            } else {
              return prev + data.x;
            }
          });
        }}
      >
        <div className="absolute bg- top-1/2 -translate-y-1/2 -left-[20.4px] cursor-pointer">
          <Rectangle className="bg-blu h-fit" />
          <Arrow className="absolute top-1/2 -translate-y-1/2 right-1" />
        </div>
      </DraggableCore>
    </aside>
  );
};

export default Anotations;
