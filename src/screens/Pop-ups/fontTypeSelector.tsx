import React from "react";
import { useRecoilState } from "recoil";
import { FontTypeAtom } from "store/atoms/general";

const fontTypes = ["Raleway", "Arial", "Book Antiqua", "Georgia", "Sans-serif", "Serif", "TransRomanAH", "Trebuchet MS", "Verdana"];

const FontTypeSelector: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [fontType, setFontType] = useRecoilState(FontTypeAtom); // Live font type update

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-[#5074ad] text-white p-6 rounded-lg w-80 shadow-lg">
        {/* Header */}
        <div className="flex items-center mb-2">
          <h2 className="text-center flex-grow text-sm">Font Type</h2>
        </div>

        {/* Font Type List */}
        <ul className="space-y-2">
          {fontTypes.map((type) => (
            <li
              key={type}
              className={`p-2 cursor-pointer rounded-md transition-all text-sm ${
                fontType === type ? "bg-blue-500 text-white" : "hover:bg-gray-700"
              }`}
              style={{ fontFamily: type }} // Apply font type preview
              onClick={() => setFontType(type)} // Live update
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FontTypeSelector;
