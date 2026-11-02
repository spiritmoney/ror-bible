import clsx from 'clsx';
import React from 'react';
import { ISquareSwitchPosition } from '../../interface/squareSwitch';

export interface ISquareSwitch {
  setPosition: React.Dispatch<React.SetStateAction<ISquareSwitchPosition>>;
  position: ISquareSwitchPosition;
}

const SquareSwitch: React.FunctionComponent<ISquareSwitch> = ({
  position,
  setPosition,
}) => {
  const handleSwitch = () => {
    setPosition(prev => (prev === 'left' ? 'right' : 'left'));
  };
  return (
    <div
      className="border rounded border-bf-grey w-[30px] h-[30px] cursor-pointer"
      onClick={handleSwitch}
    >
      <div
        className={clsx(
          'rounded-sm w-[.75rem] h-full bg-bf-grey',
          {
            'translate-x-[134%]': position === 'right',
            'translate-x-[0%]': position === 'left',
          },
          'transition-transform'
        )}
      ></div>
    </div>
  );
};

export default SquareSwitch;
