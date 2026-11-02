import React from 'react';
import style from './styles.module.scss';
import { ReactComponent as AnotationsIcon } from '../../assets/annotation.svg';
import { ReactComponent as AnotationsLight } from '../../assets/annotationLight.svg';
import { ReactComponent as Mic } from '../../assets/microphone.svg';
import { ReactComponent as MicLight } from '../../assets/microphoneLight.svg';
import { ReactComponent as Comment } from '../../assets/comment.svg';
import { ReactComponent as CommentLight } from '../../assets/commentLight.svg';
import clsx from 'clsx';
import { IAnnotation, IVoiceNote, IComment } from '../../interface/project';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { annotationObjAtom, addAnnotationModalAtom, addCommentsModalAtom } from '../../store/atoms/workspace';
import {
  voiceNoteObjAtom,
  addVoiceNoteModalAtom,
} from '../../store/atoms/workspace';
import { DarkThemeAtom } from 'store/atoms/general';

interface ISideNoteOptions {
  active?: boolean;
  name: string;
  author: string;
  type: 'anotation' | 'comment' | 'voice';
  data: IAnnotation | IVoiceNote | any;
  quill: any;
  index: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const SideNoteOptions: React.FunctionComponent<ISideNoteOptions> = ({
  active,
  author,
  name,
  type,
  data,
  index,
  quill,
  setActive,
}) => {
  const setVoiceNoteObject = useSetRecoilState(voiceNoteObjAtom);
  const setAnnotationObject = useSetRecoilState(annotationObjAtom);
  const setShowVoiceNoteModal = useSetRecoilState(addVoiceNoteModalAtom);
  const setShowAnnotationModal = useSetRecoilState(addAnnotationModalAtom);
  const setShowCommentModal = useSetRecoilState(addCommentsModalAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);
  
  const handleClick = () => {
    if (!quill) return;
    if(type === 'comment') {
      setShowCommentModal(true);
      return;
    }
    quill.setSelection(data?.selectedText?.index, data?.selectedText?.length);
    const bounds = quill.getBounds(
      data?.selectedText?.index,
      data?.selectedText?.length
    );
    quill.container.scrollTop = bounds.top;
    setActive(index);

    if (type === 'voice') {
      setVoiceNoteObject(data);
      setShowVoiceNoteModal(true);
    }

    if (type === 'anotation') {
      setAnnotationObject(data);
      setShowAnnotationModal(true);
    }

   

  };

  return (
    <div
      className={clsx(
        'flex px-[2.1875rem] justify-between py-2 items-center cursor-pointer ',
        { 'bg-[rgba(36,128,202,0.05)]  ': active }
      )}
      onClick={handleClick}
    >
      <div className={clsx('flex  justify-between items-center w-full max-w-[315px] min-w-[315px]', { '!text-[#EDF1F3] ': DarkTheme === true })}>
        {!DarkTheme ?
          <div className="flex items-center gap-x-[21px]">
            {type === 'anotation' ? (
              <AnotationsIcon
                className={clsx(style.icon, {
                  [style.active]: active,
                })}
              />
            ) : type === 'comment' ? (
              <Comment
                className={clsx(style.icon, {
                  [style.active]: active,
                })}
              />
            ) : (
              <Mic
                className={clsx(style.icon, {
                  [style.active]: active,
                })}
              />
            )}
            <div className="">
              <h5
                className={clsx(' text-[15px]   ', {
                  'text-primary font-semibold': active,
                  'text-[rgba(0,0,0,0.75)] font-medium': !active,
                })}
              >
                {name}
              </h5>
              <p
                className={clsx(' text-sm ', {
                  'text-primary font-normal': active,
                  'text-[rgba(0,0,0,0.63)] font-light': !active,
                })}
              >
                by {author}
              </p>
            </div>
          </div>
          :
          <div className="flex items-center gap-x-[21px]">
            {type === 'anotation' ? (
              <AnotationsLight />
            ) : type === 'comment' ? (
              <CommentLight />
            ) : (
              <MicLight />
            )}
            <div className="">
              <h5
                className={clsx(' text-[15px]   ', {
                  'text-primary font-semibold': active,
                  'text-[rgba(0,0,0,0.75)] font-medium': !active,
                }, { ' !text-[#EDF1F3] ': DarkTheme === true })}
              >
                {name}
              </h5>
              <p
                className={clsx(' text-sm ', {
                  'text-primary font-normal': active,
                  'text-[rgba(0,0,0,0.63)] font-light': !active,
                }, { '!text-[#EDF1F3] opacity-[o.63] ': DarkTheme === true })}
              >
                by {author}
              </p>
            </div>
          </div>
        }

        <span
          className={clsx(
            'rounded-full text-white h-[21px] w-[21px] font-semibold text-[12px] flex items-center justify-center ',
            { 'bg-[#09A350]': data.resolved, 'bg-[#E70000]': !data.resolved }
          )}
        >
          {index}
        </span>
      </div>
    </div>
  );
};

export default SideNoteOptions;
