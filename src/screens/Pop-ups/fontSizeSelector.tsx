import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { FontSizeAtom } from "store/atoms/general";

const FontSizeSelector: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
    const [fontSize, setFontSize] = useRecoilState(FontSizeAtom); // Directly updating global font size
  
    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFontSize(`${e.target.value}px`); // Update font size live
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-[#5074ad] text-white p-6 rounded-lg w-80 shadow-lg">
          {/* Header */}
          <div className="flex items-center mb-4">
            <h2 className="text-center flex-grow text-sm mr-2">Font Size</h2>
          </div>
  
          {/* Slider Section */}
          <div className="flex items-center justify-between">
            {/* Small A */}
            <span className="text-gray-400 text-xl">A</span>
  
            {/* Slider */}
            <input
              type="range"
              min="12"
              max="24"
              value={parseInt(fontSize)}
              onChange={handleFontSizeChange}
              className="w-full cursor-pointer appearance-none bg-transparent"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                height: "4px",
                background: `linear-gradient(to right, #9fd8e3 ${((parseInt(fontSize) - 12) / 12) * 100}%, #4F6782 0%)`,
              }}
            />
  
            {/* Large A */}
            <span className="text-gray-300 text-4xl">A</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default FontSizeSelector;
