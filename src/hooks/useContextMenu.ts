import { useEffect, useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  dashboardSizeAtom,
  showUnderReviewAtom,
} from '../store/atoms/workspace';

const useContextMenu = (ref: any) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [sentAnchorPoint, setSentAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const { height, width } = useRecoilValue(dashboardSizeAtom);
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [refInstance, setRefInstance] = useState<any>(null);
  const setShowUnderReview = useSetRecoilState(showUnderReviewAtom);
  const handleShowUnderReview = useCallback(
    (e: any) => {
      e.preventDefault();
      setShowUnderReview(true);
    },
    [setShowUnderReview]
  );
  const handleContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();
      setAnchorPoint({
        x: event.pageX,
        y: event.pageY,
      });
      setShow(true);
    },
    [setShow, setAnchorPoint]
  );

  const handleClick = useCallback(() => (show ? setShow(false) : null), [show]);

 

  useEffect(() => {
    document.addEventListener('click', handleClick);
    // document.addEventListener('mouseEnter', handleClick);
    if (isEditorDisabled && refInstance) {
      refInstance.removeEventListener('contextmenu', handleContextMenu);
      if (showCopyModal) {
        refInstance.addEventListener('contextmenu', handleShowUnderReview);
        refInstance.addEventListener('click', handleShowUnderReview);
      } else {
        refInstance.removeEventListener('contextmenu', handleShowUnderReview);
      }
      return;
    } else if (!isEditorDisabled && refInstance) {
      refInstance.removeEventListener('contextmenu', handleShowUnderReview);
      refInstance.removeEventListener('click', handleShowUnderReview);
      refInstance.addEventListener('contextmenu', handleContextMenu);
      return;
    }
    if (!ref.current) return;
    const element = ref.current;
    setRefInstance(element);

    element.addEventListener('contextmenu', handleContextMenu);
  }, [
    ref,
    handleContextMenu,
    handleClick,
    isEditorDisabled,
    refInstance,
    showCopyModal,
    handleShowUnderReview,
  ]);

  useEffect(() => {
    const positionY = anchorPoint.y + 300;
    const positionX = anchorPoint.x + 300;

    if (positionY > height) {
      setSentAnchorPoint(prev => ({ ...prev, y: anchorPoint.y - 240 }));
    }
    if (positionY < height) {
      setSentAnchorPoint(prev => ({ ...prev, y: anchorPoint.y }));
    }
    if (positionX > width) {
      setSentAnchorPoint(prev => ({ ...prev, x: anchorPoint.x - 200 }));
    }
    if (positionX < width) {
      setSentAnchorPoint(prev => ({ ...prev, x: anchorPoint.x }));
    }
  }, [anchorPoint, height, width]);

  return {
    anchorPoint: sentAnchorPoint,
    show,
    setIsEditorDisabled,
    isEditorDisabled,
    setShowCopyModal,
  };
};

export default useContextMenu;
