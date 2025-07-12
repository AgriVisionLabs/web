/* eslint-disable react/prop-types */
import { userContext } from "../../Context/User.context";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  MapPin,
  SquareCheckBig,
  Droplet,
  Bug,
  Cpu,
  Cuboid,
  ChartLine,
  ChevronLeft,
} from "lucide-react";

const Sidebar = ({ onClose }) => {
  const sidebarItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/farms&fields", label: "Farms and fields", icon: MapPin },
    { path: "/tasks", label: "Tasks", icon: SquareCheckBig },
    { path: "/irrigation", label: "Irrigation", icon: Droplet },
    { path: "/disease_detection", label: "Disease Detection", icon: Bug },
    { path: "/sensors&devices", label: "Sensors and devices", icon: Cpu },
    { path: "/inventory", label: "Inventory", icon: Cuboid },
    { path: "/analytics", label: "Analytics", icon: ChartLine },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const { logOut } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-full lg:max-h-[100vh-16px] lg:w-[250px] shadow-md bg-white rounded-xl flex flex-col z-40 px-3 py-3">
      {/* Logo Section */}
      <div className="flex h-16 border-b border-gray-200 mb-4 justify-center items-center relative">
        <img src="/blackLogo.png" className="w-[50%] -mt-1" />
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:hidden"
          >
            <ChevronLeft size={20} className="w-5 h-5 text-[#374151]" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-2">
        {sidebarItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;

          return (
            <div
              key={path}
              onClick={() => {
                navigate(path);
                onClose && onClose(); // Close mobile sidebar when navigating
              }}
              className={`flex cursor-pointer items-center rounded-lg p-2 lg:p-3 space-x-3 text-[16px] transition duration-300 ${
                isActive
                  ? "text-mainColor bg-[#F0FDF4] font-[500]"
                  : "text-[#374151] hover:bg-gray-50"
              }`}
            >
              <Icon />
              <p className="block">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Logout Section */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div
          className="cursor-pointer font-medium text-[16px] flex items-center p-2 lg:p-3 space-x-3 text-[#374151] transition duration-300 hover:text-[#C15B5B] rounded-lg"
          onClick={() => {
            logOut();
            navigate("/login");
            onClose && onClose(); // Close mobile sidebar when logging out
          }}
        >
          <LogOut />
          <p className="block">Log out</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
