import clsx from "clsx";
import Input from "components/Input";
import React, { useEffect, useRef, useState } from "react";
import rowsData from "../../constants/rowsData";
// import CustomInput from "../CustomInput";
import "./styles.scss";

export interface IPaginate {
  noOfRows: string;
  setNoOfRows: React.Dispatch<React.SetStateAction<string>>;
  noOfData: number;
  activePage: number;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  pageArray: number[];
  offset: number;
}

const Paginate: React.FunctionComponent<IPaginate> = ({
  noOfRows,
  setNoOfRows,
  noOfData,
  activePage,
  setActivePage,
  pageArray,
  offset,
}) => {
  const ref = useRef<any>();
  const [startingNo, setStartingNo] = useState(0);
  const [endingNo, setEndingNo] = useState(0);

  useEffect(() => {
    setStartingNo(1 + (offset - Number(noOfRows)));
    if (activePage === pageArray.length) {
      setEndingNo(noOfData);
    } else {
      setEndingNo(Number(noOfRows) * activePage);
    }
  }, [activePage, noOfData, noOfRows, offset, pageArray.length]);

  useEffect(() => {
    setActivePage(0);
  }, [noOfRows, setActivePage]);

  const handleNext = () => {
    setActivePage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setActivePage((prev) => prev - 1);
  };
  return (
    <div className="paginate flex mt-auto justify-between items-center w-full" >
      <div className="row-no flex items-center">
        <div className="set-rows-label text-[0.8125rem]">Show rows per page</div>

        <div className="set-rows-select text-[0.8125rem]">
          <Input
          className={clsx(" justify-between",)}
            type="paginate"
            selectData={rowsData}
            value={noOfRows}
            setValue={setNoOfRows}
            // page
          />
        </div>
      </div>

      <div className="page-info-nav flex text-[0.8125rem] justify-between items-center">
        <div className="page-info ">
          {startingNo}-{endingNo} of {noOfData}
        </div>

        <div className="page-nav  ">
          <button disabled={activePage === 1} className="back" onClick={handlePrevious}>
            <svg
              width="11"
              height="16"
              viewBox="0 0 11 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.26159 8.03067L10.0833 13.8524L8.42032 15.5154L0.935547 8.03067L8.42032 0.545898L10.0833 2.20892L4.26159 8.03067Z"
                fill="#151A20"
                fillOpacity="0.45"
              />
            </svg>
          </button>

          <button disabled={activePage === pageArray.length} className="next" onClick={handleNext}>
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.58518 8.03067L0.763428 2.20892L2.42645 0.545898L9.91122 8.03067L2.42645 15.5154L0.763428 13.8524L6.58518 8.03067Z"
                fill="#151A20"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paginate;
