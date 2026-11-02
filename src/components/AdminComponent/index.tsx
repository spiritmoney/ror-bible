import React from 'react';
import AdminSideMenu from '../AdminSideMenu';
import { useRecoilValue } from 'recoil';
import { footerHeightAtom, headerHeightAtom } from '../../store/atoms/size';
import { Outlet } from 'react-router-dom';
import AdminSideMenuShort from 'components/AdminSideMenuShort';
import clsx from 'clsx';
import { DarkThemeAtom } from 'store/atoms/general';

export interface IAdminComponent {}

const AdminComponent: React.FunctionComponent<IAdminComponent> = () => {
  const footerHeight = useRecoilValue(footerHeightAtom);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const DarkTheme = useRecoilValue(DarkThemeAtom);


  return (
    <div
      className={clsx("admin-comp flex overflow-y-auto w-full", { 'bg-[#071723] border-[#0F2230] text-[#EDF1F3]': DarkTheme === true } )}
      style={{
        minHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
        maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
      }}
    >
      <AdminSideMenuShort />
      <AdminSideMenu />
      <Outlet />
    </div>
  );
};

export default AdminComponent;
