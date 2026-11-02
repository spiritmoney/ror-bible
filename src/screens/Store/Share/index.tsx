import React, { useState } from 'react';
import './index.scss';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookMessengerShareButton,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import KingsChatIcon from 'assets/kingschatIcon.png';
import { FaRegCopy } from "react-icons/fa";
import { IoIosCopy } from "react-icons/io";



export interface ISharePopup {
  url: string,
  title: string,
  onClose: () => void
}

const SharePopup: React.FunctionComponent<ISharePopup> = ({ url, title, onClose }) => {

  return (
    <div className="popup-overlay ">
      <div className="popup h-[8rem] w-[27rem] justify-between items-center">
        Share this product with your friends & family via:
        <button onClick={onClose} className="close-button">x</button>

        <div className="popupIn h-[8rem] w-[27rem] justify-evenly ">

          <button onClick={() => {
            window.location.href = `kingschat://post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
          }} className="kingschat-button rounded-full">
            <img src={KingsChatIcon} alt="KingsChat" className="kingschat-icon rounded-full" />
          </button>
          <EmailShareButton url={url} subject={title} body="Check this out!">
            <EmailIcon size={32} round />
          </EmailShareButton>
          <WhatsappShareButton url={url} title={title} separator=": ">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <CopyToClipboard text={url} >
            < span className='rounded-full bg-blue-300 h-[32px] flex items-center cursor-pointer'>
              <IoIosCopy className='w-[30px] h-[20px]' color='#ffffff' />
            </span>
          </CopyToClipboard>

        </div>
      </div>
    </div>
  );
};

export default SharePopup;
