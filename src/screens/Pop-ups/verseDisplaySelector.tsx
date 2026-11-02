import { useRecoilState } from "recoil";
import { verseDisplayState } from "store/atoms/general";

const VerseDisplaySelector: React.FC = () => {
    const [selectedDisplay, setSelectedDisplay] = useRecoilState(verseDisplayState);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">

            <div className="bg-[#18658e] text-white p-4 rounded-lg w-[90%] max-w-lg shadow-lg mx-auto">
                {/* Header */}
                <h2 className="text-center text-sm mb-4">Verse display</h2>

                {/* 1-Column Display Option */}
                <div
                    className="flex items-center justify-between p-2 cursor-pointer"
                    onClick={() => setSelectedDisplay("one")}
                >
                    <span className="flex items-center">
                        📖 <span className="ml-2">1-Column Display</span>
                    </span>
                    <input type="checkbox" checked={selectedDisplay === "one"} readOnly />
                </div>

                <hr className="border-gray-400" />

                {/* 2-Column Display Option */}
                <div
                    className="flex items-center justify-between p-2 cursor-pointer"
                    onClick={() => setSelectedDisplay("two")}
                >
                    <span className="flex items-center">
                        📖📖 <span className="ml-2">2-Column Display</span>
                    </span>
                    <input type="checkbox" checked={selectedDisplay === "two"} readOnly />
                </div>
            </div>
        </div>
    );
};

export default VerseDisplaySelector;
