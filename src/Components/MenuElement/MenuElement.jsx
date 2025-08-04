/* eslint-disable react/prop-types */
import { useState } from "react";
import Menu from "../Menu/Menu";

// A smoother dropdown component used across the project
const MenuElement = ({
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
  // Track open / close state
  const [open, setOpen] = useState(false);

  // Toggle list visibility
  const toggleList = () => setOpen((prev) => !prev);

  // Close the list after an item is selected
  const handleSelect = (i) => {
    setIndex(i);
    setOpen(false);
  };

  return (
    <div className="forms relative cursor-pointer" style={{ width }}>
      {/* Header */}
      <div
        className={`icon flex justify-between items-center rounded-lg border px-4 py-2 border-[#0d121c21] transition-colors ${className}`}
        onClick={toggleList}
      >
        {nameChange || name ? (
          <>
            <p
              className={Pformat || `text-[17px] font-[400] capitalize`}
              style={{ color: textColor }}
            >
              {nameChange ? nameChange : name}
            </p>
            <i
              className={`fa-solid cursor-pointer transition-transform duration-300 text-sm ${
                open ? "fa-angle-up" : "fa-angle-down"
              }`}
            ></i>
          </>
        ) : (
          <p className={Pformat || `text-[17px] font-[400] capitalize`}>
            Data is not available
          </p>
        )}
      </div>

      {/* Dropdown list with smooth transform animation */}
      <div
        className={`absolute left-0 right-0 rounded-lg bg-white z-10 overflow-hidden transform origin-top transition-transform transition-opacity duration-200 ease-out border border-[#0d121c21] ${
          open
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 border-transparent"
        }`}
      >
        <div className="max-h-[160px] overflow-y-auto">
          {Items?.map((item, i) => (
            <Menu
              key={i}
              index={i}
              item={item}
              setIndex={handleSelect}
              selected={selectedIndex === i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuElement;
