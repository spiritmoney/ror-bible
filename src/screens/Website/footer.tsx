import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  WebsiteDownloadRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = (path: string) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  return (
    <footer className="u6971eb">
      <div className="uad67f1" aria-hidden="true">
        <div className="u3e339b" />
        <div className="u1584b2" />
        <div className="u7c48ed" />
      </div>
      <div className="wrap uf37b3e">
        <div className="u1fd187">
          <Link className="lockup u8092d7" to="/home" aria-label="ROR Bible+ home">
            <img className="u2ab49f" src={icon} alt="" />
            <span className="u55f5af">
              <span className="ub6a52a">ROR Bible+</span>
              <span className="u329d23">Premium Bible Reader</span>
            </span>
          </Link>
          <p className="u5fe755">Read. Study. Meditate. Triumph.</p>
          <Link className="u8c9a26" to={`${WebsiteDownloadRoute}#support`}>
            Technical support
          </Link>
          <Link className="u8c9a26" to={`${WebsiteDownloadRoute}#contact`}>
            Contact us
          </Link>
          <Link className="u8c9a26" to="/store" data-allowed="1">
            Store
          </Link>
        </div>
        <div className="uc56752">
          <h3 className="u902935">Products</h3>
          <Link className="u8c9a26" to={WebsiteProductWebRoute}>
            ROR Bible+ Web (Bible Online &amp; Lite)
          </Link>
          <Link className="u8c9a26" to={WebsiteProductMobileRoute}>
            ROR Bible+ Mobile
          </Link>
          <Link className="u8c9a26" to={WebsiteProductDesktopRoute}>
            ROR Bible+ Desktop
          </Link>
          <Link className="u8c9a26" to={WebsiteProductVoiceRoute}>
            ROR Bible+ Voice
          </Link>
          <a className="u8c9a26" href="#" onClick={(e) => e.preventDefault()}>
            @MySpot: Digital Evangelism
          </a>
          <a className="u8c9a26" href="#" onClick={(e) => e.preventDefault()}>
            RORK Bible for Kids
          </a>
          <a className="u8c9a26" href="#" onClick={(e) => e.preventDefault()}>
            Teevo Bible for Teens
          </a>
        </div>
        <div className="uc56752">
          <h3 className="u902935">About ROR Bible+</h3>
          {[
            ['Mission', '/about#mission'],
            ['Stories', '/about#stories'],
            ['Careers', '/about#careers'],
            ['Global Hubs', '/about#hub'],
            ['Bible Translation', '/about#bible'],
            ['Press', '/about#press'],
          ].map(([label, path]) => (
            <a
              key={path}
              className="u8c9a26"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal(path);
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="uc56752">
          <h3 className="u902935">Partners</h3>
          {[
            ['Content Partner', '/partner#content'],
            ['Bible Partner', '/partner#ror_bible_partners'],
            ['Churches', '/partner#churches'],
            ['Volunteers', '/partner#volunteers'],
            ['Give', '/give'],
          ].map(([label, path]) => (
            <a
              key={path}
              className="u8c9a26"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal(path);
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="uc56752">
          <h3 className="u902935">Follow us</h3>
          <a className="u8c9a26" href="https://www.kingchat.online">
            KingsChat
          </a>
          <a className="u8c9a26" href="#" onClick={(e) => e.preventDefault()}>
            CeFlix
          </a>
          <a className="u8c9a26" href="https://blog.rorbible.plus">
            Blog
          </a>
        </div>
      </div>
      <div className="ua95fd4">
        <div className="wrap u94c3c2">
          <span>© 2026 ROR Bible+. All rights reserved.</span>
          <span className="ub77529">
            <a className="uc0e2c3" href="#" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="uc0e2c3" href="#" onClick={(e) => e.preventDefault()}>
              Terms of Use
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
