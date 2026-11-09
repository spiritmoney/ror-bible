import React from 'react';
import { useNavigate } from 'react-router-dom';
import About from 'screens/Website/about';
import Product from 'screens/Website/product';
import Give from 'screens/Website/give';
import Partner from 'screens/Website/partner';
import DownloadPage from 'screens/Website/downloadPage';

type ModalPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const ModalAbout: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return <About isModal onClose={() => navigate(-1)} />;
};

const ModalProduct: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return <Product isModal onClose={() => navigate(-1)} />;
};

const ModalGive: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return <Give isModal onClose={() => navigate(-1)} />;
};

const ModalPartner: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return <Partner isModal onClose={() => navigate(-1)} />;
};

const ModalDownloadContact: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return <DownloadPage isModal onClose={() => navigate(-1)} />;
};

export {
  ModalAbout,
  ModalProduct,
  ModalGive,
  ModalPartner,
  ModalDownloadContact,
};

export type { ModalPageProps };
