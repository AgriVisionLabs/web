/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Menu, User } from "lucide-react";
import NotificationCenter from "../NotificationCenter/NotificationCenter";
import { useContext } from "react";
import { userContext } from "../../Context/User.context";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { profileData } = useContext(userContext);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/farms&fields": "Farms and Fields",
    "/tasks": "Tasks",
    "/irrigation": "Irrigation",
    "/disease_detection": "Disease Detection",
    "/sensors&devices": "Sensors and Devices",
    "/inventory": "Inventory",
    "/analytics": "Analytics",
    "/notifications": "Notification",
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
        <NotificationCenter />
        <div
          onClick={() => navigate("/settings")}
          className="w-8 h-8 cursor-pointer rounded-full overflow-hidden border-2 border-gray-200 hover:border-mainColor transition-colors duration-200"
        >
          {profileData?.pfpImageUrl ? (
            <img
              src={profileData.pfpImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
