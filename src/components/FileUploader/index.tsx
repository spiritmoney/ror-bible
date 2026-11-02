import useDragging from 'hooks/useDragging';
import React, { useRef, useState } from 'react';
import style from './styles.module.scss';
import { ReactComponent as File } from 'assets/file-fill.svg';
import { ReactComponent as Cancel } from 'assets/cancel.svg';
import clsx from 'clsx';
import { isArray } from 'lodash';
import {bytesToMegaBytes} from '../../utils/general';

interface IFileUploader {
  setFiles?: React.Dispatch<React.SetStateAction<File | File[] | null>>;
  name?: string;
  onChange?: (e: any) => void;
  accepts?: string;
}

const FileUploader: React.FunctionComponent<IFileUploader> = ({
  setFiles,
  name,
  onChange,
  accepts,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);
  const [currFiles, setFile] = useState<Array<File> | File | null>(null);
  //   const [error, setError] = useState(false);

  const onDrop = (fileOs: any) => {
    setFiles && setFiles(fileOs);
  };
  const onSelect = (fileOs: any) => {
    setFiles && setFiles(fileOs);
  };

  const handleClick = (ev: any) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChanges = (files: File | Array<File>): boolean => {
    // let checkError = false;
    if (files) {
      //   if (checkError) return false;
      //   if (handleChange) handleChange(files);
      setFile(files);

      setUploaded(true);
      //   setError(false);
      return true;
    }
    return false;
  };

  const handleInputChange = (ev: any) => {
    onChange && onChange(ev)
    const allFiles = ev.target.files;
    // const files = multiple ? allFiles : allFiles[0];
    const files = allFiles[0];
    setFile(files);
    setUploaded(true);
    const success = handleChanges(files);
    if (onSelect && success) onSelect(files);
  };

  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple: false,
    handleChanges,
    onDrop,
  });

  return (
    <label
      ref={labelRef}
      htmlFor={name || 'name'}
      className={clsx(style['file-uploader'])}
    >
      <input
        onClick={handleClick}
        onChange={handleInputChange}
        // accept={acceptedExt(types)}
        ref={inputRef}
        type="file"
        name={name || 'name'}
        key={Date.now()}
        disabled={uploaded}
        className={style['hidden']}
        accept={accepts ?? '.jpg,.png,.bmp' }
      />

      {!uploaded && !currFiles && (
        <>
          <div className={style['file-icon']}>
            <File />
          </div>

          <p className={clsx(style['file-text'])}>
            {dragging ? (
              <>{'Drop Here'}</>
            ) : (
              <>
                Drag and Drop files, or <span>Browse</span>
              </>
            )}
          </p>

          <p className={clsx(style['file-text'], style['light'])}>
            "Support ONLY .jpg, .png. & .bmp file formats.
          </p>
        </>
      )}

      {uploaded && currFiles && !isArray(currFiles) && (
        <>
          <div className={style['file-name']}>
            <File className={style.file} />{' '}
            <div>
              <p>
                {currFiles.name.split('.')[0].substring(0, 40)}
                {currFiles.name.split('.')[0].length > 40 && '...'}.
                {currFiles.name.split('.')[1]}
              </p>
              <p>{bytesToMegaBytes(currFiles.size, 2)}MB</p>
            </div>
          </div>
          <Cancel
            className={style.cancel}
            onClick={() => {
              setFile(null);
              setUploaded(false);
              setFiles && setFiles(null);
            }}
          />
        </>
      )}
    </label>
  );
};

export default FileUploader;
