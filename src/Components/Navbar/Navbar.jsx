/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  AlertCircle,
  Bell,
  CheckCircle,
  Menu,
  Settings,
  X,
} from "lucide-react";
const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  let [openNotifications, setOpenNotifications] = useState(false);
  const notificationCount = 1;

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/farms&fields": "Farms and Fields",
    "/tasks": "Tasks",
    "/irrigation": "Irrigation",
    "/disease_detection": "Disease Detection",
    "/sensors&devices": "Sensors and Devices",
    "/inventory": "Inventory",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Page";

  return (
    <nav className="flex justify-between items-center shadow-md rounded-xl bg-white p-2 lg:py-4 lg:px-6 z-10">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <Menu size={24} className="w-6 h-6 text-[#374151]" />
        </button>

        <h2 className="text-base font-normal">
          <span className="text-[#374151] mr-1">{currentTitle}</span>
          {">"} overview
        </h2>
      </div>
      <div className="PersonalِِAccount&notifications flex  items-center space-x-1 lg:space-x-5">
        <div
          className="hover:text-mainColor cursor-pointer p-2 rounded-lg transition duration-300 relative"
          onClick={() => {
            setOpenNotifications(true);
          }}
        >
          <Bell
            fill="none"
            stroke={openNotifications ? "#1E6930" : "#374151"}
            size={24}
            className="w-6 h-6 mt-0.5"
          />
          {notificationCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {notificationCount}
            </div>
          )}
        </div>
        <img
          onClick={() => navigate("/settings")}
          src="/profile.svg"
          className="w-8 h-8 cursor-pointer"
        />
      </div>
      {openNotifications ? (
        <div className="w-[380px] h-[450px] bg-[#FFFFFF] rounded-[25px] border-[1px] border-[#9F9F9F] fixed right-[50px] top-[80px] ">
          <div className="flex justify-between items-center pb-[20px] border-b-[1px] border-[#9F9F9F] px-[15px] py-[15px]">
            <div className="flex items-center space-x-2">
              <Bell size={20} />
              <p className="font-semibold text-[18px]">Notification</p>
              <div className="bg-mainColor flex justify-center items-center rounded-full w-[50px] h-[24px]">
                <p className="text-white text-[14px]">
                  {notificationCount} new
                </p>
              </div>
            </div>
            <X
              className="hover:text-red-700 transition-all duration-500 cursor-pointer"
              onClick={() => {
                setOpenNotifications(false);
              }}
            />
          </div>
          <div className="h-[315px] overflow-y-auto ">
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px] bg-[#F0FDF4]  px-[20px] py-[8px] border-b-[1px] border-[#9f9f9f5f]">
              <div className="flex items-center space-x-3 ">
                <CheckCircle
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#25C462]"
                />
                <p className="font-medium text-[15px] text-black capitalize">
                  Harvest Ready
                </p>
              </div>
              <p className="ps-[30px]">
                Corn Field crop has reached optimal harvest conditions.
              </p>
              <div className="flex justify-between items-center">
                <p className="ps-[30px]">1 hour ago</p>
                <p className="font-medium  text-mainColor">Mark Read</p>
              </div>
            </div>
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[20px] py-[8px] border-b-[1px] border-[#9f9f9f5f]">
              <div className="flex items-center space-x-3 ">
                <AlertCircle
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#EBB212]"
                />
                <p className="font-medium text-[15px] text-black capitalize">
                  Soil Analysis Complete
                </p>
              </div>
              <p className="ps-[30px]">
                Lab results for Tech Farm soil samples are now available for
                review.
              </p>
              <div className="flex justify-between items-center">
                <p className="ps-[30px]">2 hour ago</p>
              </div>
            </div>
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[20px] py-[8px] border-b-[1px] border-[#9f9f9f5f]">
              <div className="flex items-center space-x-3 ">
                <Settings
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#8C60CF]"
                />
                <p className="font-medium text-[15px] text-black">
                  Equipment Maintenance Due
                </p>
              </div>
              <p className="ps-[30px]">
                Tractor #3 scheduled maintenance is overdue by 5 days.
              </p>
              <div className="flex justify-between items-center">
                <p className="ps-[30px]">3 hour ago</p>
              </div>
            </div>
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[20px] py-[8px] border-b-[1px] border-[#9f9f9f5f]">
              <div className="flex items-center space-x-3 ">
                <Settings
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#8C60CF]"
                />
                <p className="font-medium text-[15px] text-black">
                  Equipment Maintenance Due
                </p>
              </div>
              <p className="ps-[30px]">
                Tractor #3 scheduled maintenance is overdue by 5 days.
              </p>
              <div className="flex justify-between items-center">
                <p className="ps-[30px]">3 hour ago</p>
              </div>
            </div>
          </div>
          <div className="text-[14px] flex justify-between items-center px-[15px] border-t-[1px] border-[#9F9F9F] py-[15px] ">
            <button className="px-[20px] py-[5px] bg-[#FFFFFF] text-[#1E6930] border-[1px] border-[#1E6930] rounded-[15px] font-medium hover:bg-[#F0FDF4] transition-all duration-300">
              Mark All Read
            </button>
            <button className="px-[30px] py-[5px] bg-[#FFFFFF] text-[#E13939] border-[1px] border-[#E13939] rounded-[15px] font-medium hover:bg-[#FEF2F2] transition-all duration-300">
              Clear All
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
