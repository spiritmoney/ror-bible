import clsx from 'clsx';
import { random, startCase } from 'lodash';
import React, { useMemo, useState } from 'react';
import { ReactComponent as HidePassword } from '../../assets/hide-password.svg';
import { ReactComponent as Arrow } from '../../assets/short-arrow.svg';
import { ReactComponent as ShowPassword } from '../../assets/show-password.svg';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import FileUploader from 'components/FileUploader';
import { useRecoilValue } from 'recoil';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IInput {
  value?: any;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  error?: any;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  className?: string;
  selectData?: string[] | { name: string; value: string }[];
  successClassName?: string;
  type?: React.HTMLInputTypeAttribute | 'select' | 'file-uploader' | 'textarea';
  label?: React.ReactNode;
  placeholder?: string;
  inbuiltPasswordValidate?: boolean;
  numInput?: number;
  isInputNum?: boolean;
  ref?: any;
  autoComplete?: 'on' | 'off';
  name?: string;
  accepts?: string;
  required?: boolean;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  countryCode?: string;
  setCountryCode?: React.Dispatch<React.SetStateAction<string>>;
  checkboxValue?: boolean;
  setCheckboxValue?: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles?: React.Dispatch<React.SetStateAction<File | File[] | null>>;
  disabled?: boolean;
  pattern?: string;
  title?: string;
  formNoValidate?: boolean;
  inputClassName?: string;
  readonly?: boolean;
}

const Input = React.forwardRef(
  (
    {
      type = 'text',
      onChange,
      onBlur,
      setValue,
      value,
      name,
      placeholder,
      error,
      label,
      required,
      selectData,
      checkboxValue,
      className,
      accepts,
      setFiles,
      disabled,
      autoComplete = 'on',
      pattern,
      title,
      formNoValidate,
      inputClassName,
      readonly,
    }: IInput,
    ref
  ) => {
    const [passwordType, setPasswordType] =
      useState<React.HTMLInputTypeAttribute>('password');
    const [id, setId] = useState(0);
    const DarkTheme = useRecoilValue(DarkThemeAtom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => setId(id + random(10000)), []);

    return (
      <div className={clsx('w-full font-raleway', className)}>
        <div className="flex items-center gap-x-3">
          {type === 'checkbox' && (
            <input
              type="checkbox"
              className={clsx(
                `w-4 h-4 relative rounded-sm border accent-primary cursor-pointer`
              )}
              name={name}
              onChange={onChange ? onChange : () => { }}
              onBlur={onBlur ? onBlur : () => { }}
              id={`${id}`}
              disabled={disabled}
              checked={checkboxValue}
            />
          )}

          <label
            htmlFor={`${id}`}
            className={clsx(
              'text-base empty:hidden',
              {
                'block mb-3': type !== 'checkbox',
              },
              { 'cursor-pointer select-none': type === 'checkbox' }
            )}
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        </div>

        {type !== 'password' &&
          type !== 'checkbox' &&
          type !== 'select' &&
          type !== 'file' &&
          type !== 'search' &&
          type !== 'annotate' &&
          type !== 'file-uploader' &&
          type !== 'textarea' && (
            <input
              type={type}
              onChange={
                onChange ? onChange : e => setValue && setValue(e.target.value)
              }
              onBlur={onBlur ? onBlur : () => { }}
              ref={ref as any}
              id={`${id}`}
              value={value}
              name={name}
              title={title}
              disabled={disabled}
              autoComplete={autoComplete}
              placeholder={placeholder}
              pattern={pattern}
              formNoValidate={formNoValidate}
              readOnly={readonly}
              className={
                clsx('h-12 outline-none w-full px-8 rounded-lg border border-input-border placeholder:text-input-border', { '!bg-[#071723] !border-[#5a606d] placeholder:!text-[#5a606d] !text-[#EDF1F3]': DarkTheme === true }, inputClassName)
              }
              required={formNoValidate ? !formNoValidate : required}
            />
        )}
        {type === 'annotate' &&
           (
            <input
              type='annotate'
              onChange={
                onChange ? onChange : e => setValue && setValue(e.target.value)
              }
              onBlur={onBlur ? onBlur : () => { }}
              ref={ref as any}
              id={`${id}`}
              value={value}
              name={name}
              disabled={disabled}
              // autoComplete="on"
              placeholder={placeholder}
              className={
                'h-[10rem] outline-none w-full px-8 rounded-lg border border-input-border placeholder:text-input-border'
              }
              required={required}
            />
        )}

        {type === 'password' && (
          <div className="relative">
            <input
              type={passwordType}
              onChange={
                onChange ? onChange : e => setValue && setValue(e.target.value)
              }
              onBlur={onBlur ? onBlur : () => { }}
              ref={ref as any}
              name={name}
              value={value}
              id={`${id}`}
              disabled={disabled}
              pattern={pattern}
              title={title}
              autoComplete={autoComplete}
              placeholder={placeholder}
              className={
                'h-12 outline-none w-full px-8 rounded-lg border border-input-border placeholder:text-input-border'
              }
              required={required}
            />

            {passwordType === 'password' && (
              <HidePassword
                className={
                  'w-6 h-full absolute top-0 right-7 cursor-pointer select-none'
                }
                onClick={() => setPasswordType('text')}
              />
            )}
            {passwordType === 'text' && (
              <ShowPassword
                className={
                  'w-6 h-full absolute top-0 right-7 cursor-pointer select-none'
                }
                onClick={() => setPasswordType('password')}
              />
            )}
          </div>
        )}

        {type === 'select' && (
          <div className="relative">
            <select
              name={name}
              id={`${id}`}
              onChange={
                onChange ? onChange : e => setValue && setValue(e.target.value)
              }
              value={value ? value : ''}
              disabled={disabled}
              title={title}
              onBlur={onBlur ? onBlur : () => {}}
              className="h-12 outline-none w-full px-8 rounded-lg border border-input-border placeholder:text-input-border appearance-none"
            >
              {placeholder && <option value="">{placeholder}</option>}
              {selectData &&
                selectData.map((el, i) => {
                  if (el instanceof Object && !(el instanceof Array)) {
                    return (
                      <option key={i} value={el.value}>
                        {startCase(el.name)}
                      </option>
                    );
                  }
                  return (
                    <option key={i} value={el}>
                      {startCase(el as string)}
                    </option>
                  );
                })}
            </select>
            <Arrow className="rotate-90 absolute top-1/2 -translate-y-1/2 right-7" />
          </div>
        )}

        {type === 'file' && (
          <div className="w-full">
            <input
              required={required}
              className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                font-raleway
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="file"
              accept={accepts ?? 'image/*'}
              onChange={onChange ? onChange : e => { }}
              onBlur={onBlur ? onBlur : e => { }}
              id={`${id}`}
              name={name}
              disabled={disabled}
            />
          </div>
        )}

        {type === 'search' && (
          <div className="relative  mr-4 h-[25px]">
            <input
              type={'search'}
              onChange={
                onChange ? onChange : e => setValue && setValue(e.target.value)
              }
              onBlur={onBlur ? onBlur : () => { }}
              ref={ref as any}
              id={`${id}`}
              value={value}
              name={name}
              title={title}
              disabled={disabled}
              pattern={pattern}
              autoComplete={autoComplete}
              placeholder={placeholder}
              className={`h-[25px] 
                bg-[rgba(181,184,190,0.12)] 
                outline-none 
                px-8 
                rounded-lg 
                border 
                border-[#EBECEE] 
                text-[#EBECEE] 
                placeholder:text-input-border 
                placeholder:font-light 
                !placeholder:text-[#A5C4CB]
                placeholder:text-[0.7rem]
                placeholder:italic
                text-[14px]
                `}
              required={required}
            />
            <SearchIcon className="absolute left-[13px] top-1/2 -translate-y-1/2 " />
          </div>
        )}

        {type === 'file-uploader' && (
          <FileUploader name={name} setFiles={setFiles} onChange={onChange} />
        )}

        {type === 'textarea' && (
          <textarea
            name={name}
            id={`${id}`}
            value={value}
            title={title}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            autoComplete={autoComplete}
            placeholder={placeholder}
            onChange={
              onChange ? onChange : e => setValue && setValue(e.target.value)
            }
            className={clsx
              ('h-32 resize-none outline-none w-full px-8 py-2 rounded-lg border border-input-border placeholder:text-input-border', { '!bg-[#071723] !border-[#5a606d] !text-[#EDF1F3] placeholder:!text-[#5a606d]': DarkTheme === true }, inputClassName)
            }
          />
        )}

        {error && <small className={clsx('text-danger')}>{error}</small>}
      </div>
    );
  }
);

export default Input;
