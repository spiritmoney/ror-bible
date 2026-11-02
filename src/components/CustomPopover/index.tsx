import React from "react";
import { useEffect, useState, useRef } from "react";
import { Popover } from "@mui/material";
import { useIntersectionObserver, useWindowSize } from "usehooks-ts";
import style from "./style.module.scss";
import clsx from "clsx";

export interface ICustomPopover {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
  isShown?: boolean
  useProp?: boolean
  element?: any
  setIsShown?: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomPopover: React.FunctionComponent<ICustomPopover> = ({
  children,
  className,
  placeholder,
  isShown,
  useProp,
  element,
  setIsShown,
}) => {
  const selectRef = useRef<any>();
  const [popoverWidth, setPopoverWidth] = useState(0);
  const { width } = useWindowSize();
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (!selectRef.current && !element) return;

    if(element) {
      const inputWidth = element.offsetWidth;
      setPopoverWidth(inputWidth);
      return
    }

    const inputWidth = selectRef.current.offsetWidth;
    setPopoverWidth(inputWidth);
  }, [width, isVisible, element]);

  useEffect(() => {
    if(!element) return
    if(isShown) {
      setAnchorEl(element);
    } else {
      setAnchorEl(null);
    }
  }, [element, isShown])

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseStuff = () => {
    setAnchorEl(null);
    setIsShown && setIsShown(false)
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div ref={ref}>
      {isVisible && (
        <>
        {!element && <button
            className={clsx(style["input-check"], className)}
            ref={selectRef}
            onClick={handleClick}
          >
            {placeholder ?? "Filter Monitored Centers"}
          </button>}
          
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseStuff}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div style={{ minWidth: popoverWidth }}>{children}</div>
          </Popover>
        </>
      )}
    </div>
  );
};

export default CustomPopover;
