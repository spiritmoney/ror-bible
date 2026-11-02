import React from "react";
import { useRecoilState } from "recoil";
import { WordofChristAtom } from "store/atoms/general";

const colorOptions = [
  "#b11902", // Firebrick Red
  "#000000", // Black
  "#046f57", // Sea Green
  "#05445a", // Dark Blue
  "#0c5a8b", // Royal Blue
  "#606f10", // Dark Goldenrod
  "#6f3104", // Saddle Brown
  "#7b1579", // Purple
  "#056d0f", // Dark Green
];
const WordofChristColor: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [selectedColor, setSelectedColor] = useRecoilState(WordofChristAtom);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-[#18658e] text-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg mx-auto">
        {/* Header */}
        <h2 className="text-center text-sm mb-4">Word Of Christ Color</h2>

        {/* Color Selection Grid */}
        <div className="grid grid-cols-3 gap-4">
          {colorOptions.map((color) => (
            <label key={color} className="flex items-center space-x-2 cursor-pointer" onClick={() => setSelectedColor(color)}>
              {/* Radio Button */}
              <input
                type="radio"
                name="textColor"
                value={color}
                checked={selectedColor === color}
                onChange={() => setSelectedColor(color)}
                className="hidden"
              />
              <div
                className={`w-6 h-6 border-2 rounded-full flex items-center justify-center 
                 ${selectedColor === color ? "border-blue-400" : "border-white"}`}
              >
                {selectedColor === color && <div className="w-3 h-3 bg-blue-400 rounded-full"></div>}
              </div>
              {/* Color Preview */}
              <div className="w-16 h-6 rounded-md" style={{ backgroundColor: color }} onClick={() => setSelectedColor(color)}></div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordofChristColor;
