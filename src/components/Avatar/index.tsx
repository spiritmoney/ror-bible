import React, { useState } from 'react';
import { randomColor } from 'utils/colors';
import { getInitials } from 'utils/format';
// import style from './styles.module.scss';
import { useEffectOnce } from 'usehooks-ts';
import { useRecoilState } from 'recoil';
import { avatarColorAtom } from '../../store/atoms/general';

interface IAvatar {
  name: string;
  image?: string | null;
  random?: boolean;
  size?: number;
  fontSize?: number;
}

const Avatar: React.FunctionComponent<IAvatar> = ({
  name,
  image,
  random,
  size = 38,
  fontSize = 16,
}) => {
  const [color, setColor] = useRecoilState(avatarColorAtom);
  const [localColor, setLocalColor] = useState('');

  useEffectOnce(() => {
    if (random) {
      setLocalColor(randomColor(true, true));
    }
    if (color) return;
    setColor(randomColor(true, true));
  });

  return (
    <div className="shrink-0 max-w-max">
      {image && (
        <img
          className=" rounded-full bg-cover "
          src={image}
          style={{ width: size, height: size }}
          alt="avatar"
        />
      )}
      {!image && (
        <div
          style={{
            backgroundColor: random ? localColor : color,
            width: size,
            height: size,
            fontSize: fontSize,
          }}
          className=" rounded-full bg-cover font-medium flex items-center justify-center text-white"
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
