import React, { useState } from 'react';
import SideNoteOptions from 'components/SideNoteOptions';
import { IAnnotation, IVoiceNote, IComment } from '../../interface/project';
import clsx from 'clsx';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';

interface ISideNote {
  type: 'anotation' | 'comment' | 'voice';
  data: IAnnotation[] | IVoiceNote[] | IComment[];
  quill: any;
}

const SideNote: React.FunctionComponent<ISideNote> = ({
  type,
  data,
  quill,
}) => {
  const [active, setActive] = useState(0);
  const DarkTheme = useRecoilValue(DarkThemeAtom)
  return (
    <div>
      <h3 className="px-[2.1875rem] font-medium text-[.9375rem] ">
        {type === 'voice'
          ? 'Voice Notes'
          : type === 'anotation'
          ? 'Annotations'
          : 'Comments'}
      </h3>

      <div className={clsx('mt-[1.5625rem] flex flex-col gap-y-1', {' !text-[#EDF1F3] ': DarkTheme === true })}>
        {data.map((el, i) => {
          //@ts-ignore
          const text = el.text
            ? //@ts-ignore
              el.text.substring(0, 24)
            : //@ts-ignore
            el.note
            ? //@ts-ignore
              el.note.substring(0, 24)
            : //@ts-ignore
            el.comment
            ? //@ts-ignore
              el.comment.substring(0, 24)
            : '';
          return (
            <SideNoteOptions
              active={active === i + 1}
              author={el.name}
              name={text}
              type={type}
              key={i}
              index={i + 1}
              data={el}
              quill={quill}
              setActive={setActive}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SideNote;
