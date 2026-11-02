import React from "react";
import { useRecoilState } from "recoil";
import { SettingsActiveStateModal, highlightColorAtom, highlightedVersesState, verseInFocusAtom } from "store/atoms/general";

const colorOptions = [
  "#ffff83", "#ffffc3", "#eeffc8",
  "#99ffb3", "#c1fed2", "#d3ffdb",
  "#9affff", "#bfffff", "#dcfeff",
  "#ffcff9", "#ffdcfc", "#feebff",
  "#ddcdd0", "#ffdfc0",
];
type HighlightedVerse = {
  id: number; // unique id e.g bookID+chapterID+verseID
  color: string; // hex color code
};
const HighlightSelector: React.FC = () => {
  const [selectedColor, setSelectedColor] = useRecoilState(highlightColorAtom);
  const [activeSetting, setActiveSetting] = useRecoilState(SettingsActiveStateModal);
  const [highlightedVerses, setHighlightedVerses] = useRecoilState(highlightedVersesState);
  const [verseInFocus, setVerseInFocus] = useRecoilState(verseInFocusAtom);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);

    if (verseInFocus) {
      const newHighlight: HighlightedVerse = { id: verseInFocus, color };

      // Check if the verse is already highlighted
      const existingHighlightIndex = highlightedVerses.findIndex(
        (v: HighlightedVerse) => v.id === verseInFocus
      );

      if (existingHighlightIndex !== -1) {
        // Update the color of the existing highlight
        const updatedHighlightedVerses = [...highlightedVerses];
        updatedHighlightedVerses[existingHighlightIndex] = newHighlight;
        setHighlightedVerses(updatedHighlightedVerses);
      } else {
        // Add new highlight if not already present
        setHighlightedVerses([...highlightedVerses, newHighlight]);
      }
    }

    setActiveSetting(null); // to remove this pop-up when a color has been selected.
    setVerseInFocus(null);  // Clear after using
    console.log('Updated highlighted verses:', highlightedVerses);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-[#18658e] text-white p-6 rounded-lg shadow-lg mx-auto">
        <h2 className="text-center text-sm mb-4">Select Highlight Color</h2>

        <div className="w-fit p-4 rounded-3xl grid grid-cols-3 gap-4">

          {colorOptions.map((color, index) => (

            <div
              key={index}
              className="w-8 h-8 rounded-full cursor-pointer "
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
          <div
            className="w-8 h-8 cursor-pointer relative rounded-full border border-white"
            style={{ backgroundColor: "white" }}
            onClick={() => handleColorClick('#ffffff')}
          >
            <div className="absolute w-full h-0.5 bg-red-500 rotate-[-45deg] top-1/2 left-0 translate-y-[-50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightSelector;
