import { useLayoutEffect, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

const useGetSize = (dep?: any) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const ref = useRef<any>();
  const { width: windowWidth } = useWindowSize();

  useLayoutEffect(() => {
    if (!ref.current) return;
    setHeight(ref.current.offsetHeight);
    setWidth(ref.current.offsetWidth);
  }, [windowWidth, ref, dep]);

  return {
    height,
    width,
    ref,
  };
};

export default useGetSize;
