import { useState } from "react";

const MenuElementCrop = ({
  Items = [],
  width = "100%",
  name,
  nameChange,
  textColor = "#000",
  className = "",
  Pformat = "",
  setIndex = () => {},
  index: selectedIndex,
}) => {
  const [open, setOpen] = useState(false);

  const toggleList = () => setOpen((prev) => !prev);

  const handleSelect = (i) => {
    setIndex(i);
    setOpen(false);
  };

  return (
    <div className="forms relative cursor-pointer" style={{ width }}>
      {/* Header */}
      <div
        className={`icon flex justify-between items-center rounded-lg border px-5 py-2 mb-[4px] border-[#0d121c21] transition-colors ${className}`}
        onClick={toggleList}
      >
        {nameChange || name ? (
          <>
            <p
              className={`text-[15px] font-[400] capitalize ${Pformat}`}
              style={{ color: textColor }}
            >
              {nameChange ? nameChange : name}
            </p>
            <i
              className={`fa-solid cursor-pointer transition-transform duration-300 ${
                open ? "fa-angle-up" : "fa-angle-down"
              }`}
            ></i>
          </>
        ) : (
          <p className={`text-[15px] font-[400] capitalize ${Pformat}`}>
            Data is not available
          </p>
        )}
      </div>

      {/* List */}
      <div
        className={`absolute left-0 right-0 rounded-lg bg-white z-10 overflow-hidden transition-all duration-300 ease-in-out border border-[#0d121c21] ${
          open ? "max-h-40" : "max-h-0 border-transparent"
        }`}
      >
        <div className="max-h-[160px] flex flex-col space-y-[6px] overflow-y-auto">
          {Items?.map((e, i) => (
            <div
              key={e.id || i}
              className={`flex justify-between items-center px-4 py-[6px] rounded-[6px] hover:text-mainColor hover:bg-slate-200 cursor-pointer ${
                selectedIndex === i ? "text-mainColor" : ""
              }`}
              onClick={() => handleSelect(i)}
            >
              <p className="text-[15px] font-medium">{e.name}</p>
              <div className="flex items-center space-x-1">
                {e.supportsDiseaseDetection ? (
                  <div className="bg-[#25d03c15] h-[20px] px-[10px] flex justify-center items-center rounded-[15px]">
                    <p className="text-mainColor text-[14px] font-medium">
                      Disease Detection
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#26272611] px-[10px] flex justify-center items-center rounded-[15px]">
                    <p className="text-black text-[14px] font-medium">
                      No Detection
                    </p>
                  </div>
                )}
                {e.recommended ? (
                  <div className="bg-[#2a21da11] px-[10px] flex justify-center items-center rounded-[15px]">
                    <p className="text-blue-700 text-[14px] font-medium">
                      Recommended
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuElementCrop;
