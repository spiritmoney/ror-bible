import React from 'react';
import { ReactComponent as HyperlinkIcon } from "assets/hyperlink.svg";
import { ReactComponent as Moon } from "assets/moon.svg";
import Dropdown from '../Dropdown';

interface ReaderSettingsDropdownProps {
  darkTheme: boolean;
  showCodes: boolean;
  referenceState: boolean;
  setDarkTheme: (value: React.SetStateAction<boolean>) => void;
  setShowCodes: (value: React.SetStateAction<boolean>) => void;
  setReferenceState: (value: React.SetStateAction<boolean>) => void;
  handleOptionClick: (type: "size" | "type" | "woc" | "verse" | "highlight") => void;
}

const ReaderSettingsDropdown = ({
  darkTheme,
  showCodes,
  referenceState,
  setDarkTheme,
  setShowCodes,
  setReferenceState,
  handleOptionClick
}: ReaderSettingsDropdownProps) => {
  const settingItems = [
    { icon: "AA", label: "Font Size", action: () => handleOptionClick("size") },
    { icon: "A̲A̲", label: "Font Type", action: () => handleOptionClick("type") },
    { icon: "≡", label: "Verse Display", size: "text-4xl", action: () => handleOptionClick("verse") },
    { icon: "Wc", label: "Word of Christ", action: () => handleOptionClick("woc") },
    { 
      icon: <Moon className="w-4 h-4 text-[#0D4A74]" style={{ fill: "#0D4A74" }} />, 
      label: "Night Mode", 
      toggle: true, 
      state: darkTheme, 
      action: () => setDarkTheme(prev => !prev) 
    },
    { 
      icon: <HyperlinkIcon className="w-6 h-6 text-[#0D4A74]" style={{ fill: "#0D4A74" }} />, 
      label: "Reference", 
      toggle: true, 
      state: referenceState, 
      action: () => setReferenceState(prev => !prev) 
    },
    {
      icon: "#",
      label: "Strong's Num",
      toggle: true,
      size: "text-xl",
      state: showCodes,
      action: () => setShowCodes(prev => !prev)
    },
    { icon: "⟳", label: "Allow Rotation", toggle: true, size: "text-xl" },
  ];

  return (
    <Dropdown
      dropdownClassName="border border-dropdown-border font-raleway overflow-auto ml-auto mr-auto bg-white !w-[50%] transition-all duration-500 ease-in-out"
      className="transition-all duration-500 ease-in-out"
      content={
        <div className="bg-[#1673A1] p-6 rounded-lg flex flex-wrap justify-center gap-6 max-w-lg mx-auto">
          {settingItems.map(({ icon, label, toggle, size = "text-[13px]", action, state }, index) => (
            <div key={index} className="flex flex-col items-center w-20 text-white cursor-pointer">
              {/* Icon Circle */}
              <div 
                className={`w-10 h-10 flex items-center justify-center bg-white rounded-full font-semibold ${size} text-[#0D4A74]`}
                onClick={action}
              >
                {icon}
              </div>
              {/* Label */}
              <p className="text-[11px] mt-1">{label}</p>
              {/* Toggle Switch */}
              {toggle && (
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={state}
                    onChange={action}
                  />
                  <div className="w-8 h-4 bg-[#78a2b8] peer-checked:bg-[#2dd1ff] rounded-full relative transition-all">
                    <div
                      className={`w-3 h-3 bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${
                        state ? "left-[calc(100%-15px)]" : "left-[2px]"
                      }`}
                    ></div>
                  </div>
                </label>
              )}
            </div>
          ))}
        </div>
      }
    >
      {/* Settings icon */}
      <div className='multi_layout_main_reader_settings_options_button ml-[1.5rem]'>
        <svg 
          className="multi_layout_main_reader_settings_options_button_ic" 
          width="16" 
          height="16" 
          viewBox="0 0 22 23" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M19.0728 7.59637L18.5022 6.60628C18.0195 5.76852 16.9498 5.47951 16.1109 5.96021C15.7116 6.19545 15.2351 6.26219 14.7865 6.14572C14.3379 6.02924 13.9541 5.73911 13.7196 5.33931C13.5688 5.08519 13.4878 4.79575 13.4847 4.50026C13.4983 4.02651 13.3196 3.56742 12.9892 3.22758C12.6589 2.88774 12.205 2.69609 11.7311 2.69629H10.5816C10.1172 2.69629 9.67206 2.88131 9.34452 3.21042C9.01698 3.53953 8.8341 3.9856 8.83633 4.44991C8.82257 5.40857 8.04146 6.17846 7.08271 6.17836C6.78721 6.1753 6.49777 6.09425 6.24365 5.94343C5.40474 5.46273 4.33504 5.75174 3.85235 6.5895L3.23984 7.59637C2.75773 8.43308 3.0428 9.50211 3.87752 9.98767C4.4201 10.3009 4.75434 10.8798 4.75434 11.5064C4.75434 12.1329 4.4201 12.7118 3.87752 13.025C3.04386 13.5073 2.75848 14.5738 3.23984 15.408L3.81879 16.4064C4.04495 16.8145 4.42441 17.1157 4.8732 17.2432C5.32199 17.3708 5.80311 17.3142 6.21009 17.0861C6.61018 16.8526 7.08694 16.7887 7.53442 16.9084C7.98189 17.0281 8.36299 17.3217 8.593 17.7238C8.74383 17.9779 8.82487 18.2673 8.82794 18.5628C8.82794 19.5313 9.61306 20.3164 10.5816 20.3164H11.7311C12.6963 20.3164 13.4801 19.5364 13.4847 18.5712C13.4824 18.1054 13.6665 17.6581 13.9958 17.3287C14.3252 16.9994 14.7725 16.8153 15.2383 16.8176C15.5331 16.8255 15.8213 16.9062 16.0774 17.0525C16.9141 17.5346 17.9831 17.2495 18.4687 16.4148L19.0728 15.408C19.3066 15.0066 19.3708 14.5286 19.2511 14.0797C19.1314 13.6309 18.8377 13.2483 18.4351 13.0167C18.0325 12.785 17.7388 12.4024 17.6191 11.9536C17.4994 11.5048 17.5636 11.0267 17.7974 10.6254C17.9495 10.3599 18.1696 10.1397 18.4351 9.98767C19.2648 9.50237 19.5492 8.43959 19.0728 7.60476V7.59637Z" 
            stroke="#999999" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M11.1605 13.9228C12.495 13.9228 13.5768 12.8409 13.5768 11.5064C13.5768 10.1719 12.495 9.09009 11.1605 9.09009C9.82597 9.09009 8.74414 10.1719 8.74414 11.5064C8.74414 12.8409 9.82597 13.9228 11.1605 13.9228Z" 
            stroke="#999999" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    </Dropdown>
  );
};

export default ReaderSettingsDropdown;
