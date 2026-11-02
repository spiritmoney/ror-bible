import clsx from 'clsx';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';
import './styles.scss';
// import style from './styles.module.scss';

export interface ITable {
  hiddenColumns?: string[];
  eachHeaderCell?: (data: any) => JSX.Element | string;
  eachCell?: (cell: any, data: any) => JSX.Element | string;
  tableClassName?: string;
  headClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  tableData: any[]
}

const Table: React.FunctionComponent<ITable> = ({
  hiddenColumns,
  eachHeaderCell,
  headClassName,
  headerClassName,
  tableClassName,
  bodyClassName,
  cellClassName,
  rowClassName,
  tableData,
  eachCell,
}) => {
  const [keys, setKeys] = useState<string[]>([]);
  const DarkTheme = useRecoilValue(DarkThemeAtom);



  useEffect(() => {
    if (tableData.length > 0) {
      setKeys(
        Object.keys(tableData[0]).filter(key => !hiddenColumns?.includes(key))
      );
    }
  }, [tableData, hiddenColumns]);

  const handleEachHeaderCell = (value: string) => {
    if (!eachHeaderCell) {
      return startCase(value);
    }
    return eachHeaderCell(value);
  };

  const handleEachCell = (value: string, row: any, key: string) => {
    if (!eachCell) {
      return value;
    }
    return eachCell(key, row);
  };

  return (
    <div className="flex overflow-y-auto max-h-full flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className={clsx('min-w-full', tableClassName)}>
              <thead className={clsx('bg-white border-b', { 'bg-[#0F2230] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true }, headClassName)}>
                <tr>
                  {keys.map((key, i) => {
                    return (
                      <th
                        key={i}
                        scope="col"
                        className={clsx(
                          'text-sm font-medium px-6 py-4 text-left', { 'text-[#EDF1F3]': DarkTheme === true },
                          headerClassName
                        )}
                      >
                        {handleEachHeaderCell(key)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className={bodyClassName}>
                {tableData.map((rowObj, i) => (
                  <tr key={i} className={clsx('bg-gray-100 border-b odd:bg-white', { 'dark !bg-[#0F2230] border-[#0F2230] odd:!bg-[#071723] text-[#EDF1F3]': DarkTheme === true }, rowClassName)}>
                    {keys.map((key, i) => (
                      <td key={i} className={clsx("px-6 py-4 whitespace-nowrap text-sm font-medium ", { 'text-[#EDF1F3]': DarkTheme === true }, cellClassName)}>
                        {handleEachCell(rowObj[key], rowObj, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
