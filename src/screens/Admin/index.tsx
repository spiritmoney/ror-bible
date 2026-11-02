import React from 'react';
import Footer from '../../components/Footer';
import './styles.scss';
import AdminComponent from '../../components/AdminComponent';
import Header from 'components/Header';
import usePermission from 'hooks/usePermission';
import { useNavigate } from 'react-router-dom';
import { DashboardRoute } from 'navigation/routes';
import { useUser } from 'hooks/useUser';

export interface IAdmin {}

const Admin: React.FunctionComponent<IAdmin> = () => {
  const { isSystemsAdmin, isAppManager } = usePermission();
  const { isLoggedIn } = useUser()
  const navigate = useNavigate();

  if (isLoggedIn === 'true' && (!isSystemsAdmin && !isAppManager)) {
    navigate(DashboardRoute);
  }

  return (
    <div className={`admin `}>
      <Header hidden />

      <AdminComponent />

      <Footer />

      {/* <div className={`bg ${bgLight && "show"}`} onClick={handleBgLight}></div>
      <div className={`bg_dark ${bgDark && "show"}`} onClick={handleBgDark}></div> */}
    </div>
  );
};

export default Admin;
