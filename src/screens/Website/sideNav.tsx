import React, { useEffect, useState } from 'react';
import sideNav from '../../assets/website/sideNav.png';
import about from '../../assets/website/sideMenu/about.png';
import product from '../../assets/website/sideMenu/product.png';
import store from '../../assets/website/sideMenu/store.png';
import blog from '../../assets/website/sideMenu/blog.png';
import partner from '../../assets/website/sideMenu/partner.png';
import give from '../../assets/website/sideMenu/give.png';
import contact from '../../assets/website/sideMenu/contact.png';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  drawerWidth?: number;
  topOffset?: number;
};

export default function SideNav({
  drawerOpen,
  setDrawerOpen,
  drawerWidth = 100,
  topOffset = 56,
}: Props) {
  const top = topOffset;
  const location = useLocation();
  const navigate = useNavigate();
  const openAbout = () =>
    navigate('/about', { state: { backgroundLocation: location } });
  const openProduct = () =>
    navigate('/about', { state: { backgroundLocation: location } });
  const [drawerW, setDrawerW] = useState(drawerWidth);

  // Responsive breakpoints for drawer width
  useEffect(() => {
    const updateDrawerWidth = () => {
      const width = window.innerWidth;
      if (width < 640)
        setDrawerW(50); // sm → small phones
      else if (width < 768)
        setDrawerW(100); // md → tablets
      else if (width < 1024)
        setDrawerW(80); // lg → small laptops
      else setDrawerW(100); // xl+ → large screens
    };

    updateDrawerWidth();
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

  return (
    <aside
      className={` fixed left-0 z-50 transform transition-transform duration-300 ease-in-out ${!drawerOpen && 'hidden'}`}
      style={{
        width: drawerW,
        top: `${top}px`,
        bottom: 0,
        transform: drawerOpen ? 'translateX(0)' : `translateX(-${drawerW}px)`,
      }}
      aria-hidden={!drawerOpen}
    >
      <div className="h-full bg-[#18668D] shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-3">
          <img
            src={sideNav}
            className="w-6 mt-5 ml- md:ml-9 lg:ml-14  cursor-pointer"
            alt="close drawer"
            onClick={() => setDrawerOpen(false)}
          />
        </div>

        <nav className="mt-6 flex flex-col gap-2" aria-label="Side navigation">
          <button className="w-full text-left py-2 px-3" onClick={openAbout}>
            <img
              src={about}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="about"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/product')}
          >
            <img
              src={product}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="product"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/store')}
          >
            <img
              src={store}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="store"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/blog')}
          >
            <img
              src={blog}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="blog"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/partner')}
          >
            <img
              src={partner}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="partner"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/give')}
          >
            <img
              src={give}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="give"
            />
          </button>

          <button
            className="w-full text-left py-2 px-3"
            onClick={() => navigate('/contact')}
          >
            <img
              src={contact}
              className="w-5 ml- md:ml-9 lg:ml-14 cursor-pointer"
              alt="contact"
            />
          </button>
        </nav>
      </div>
    </aside>
  );
}
