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
} from "lucide-react";

const Sidebar = () => {
  const sidebarItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/farms&fields", label: "Farms and fields", icon: MapPin },
    { path: "/tasks", label: "Tasks", icon: SquareCheckBig },
    { path: "/irrigation", label: "Irrigation", icon: Droplet },
    { path: "/disease_detection", label: "Disease Detection", icon: Bug },
    { path: "/sensors&devices", label: "Sensors and devices", icon: Cpu },
    { path: "/inventory", label: "Inventory", icon: Cuboid },
    { path: "/analytics", label: "Analytics", icon: ChartLine },
    { path: "/Settings", label: "Settings", icon: Settings },
  ];

  const { logOut } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-h-[100vh-8px] lg:max-h-[100vh-16px] lg:w-[250px] shadow-md bg-white rounded-xl flex flex-col items-center justify-between z-40 px-1 lg:px-3 py-5">
      <div className="hidden lg:block pb-5 border-b">
        <img src="/public/blackLogo.png" className="w-[50%] mx-auto" />
      </div>
      <div className="space-y-2 mt-5 lg:mt-0">
        {sidebarItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;

          return (
            <div
              key={path}
              onClick={() => navigate(path)}
              className={`flex cursor-pointer items-center rounded-lg p-2 lg:p-3 space-x-3 text-[16px] transition duration-300 hover:text-[#1E6930] ${
                isActive
                  ? "text-mainColor bg-[#F0FDF4] font-[500]"
                  : "text-[#374151]"
              }`}
            >
              <Icon />
              <p className="hidden lg:block">{label}</p>
            </div>
          );
        })}
      </div>
      <div className="py-3 border-t-2 w-full">
        <p
          className="cursor-pointer font-medium text-[16px] flex items-center ml-2 lg:ml-6 lg:mt-3 lg:space-x-3 text-[#374151] transition duration-300 hover:text-[#C15B5B]"
          onClick={() => {
            logOut();
            navigate("/Login");
          }}
        >
          <LogOut />
          <p className="hidden lg:block">Log out</p>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
