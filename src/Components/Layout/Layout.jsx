import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { MessageSquareMore } from "lucide-react";
import useNotificationHub from "../../hooks/useNotificationHub";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Initialize global notification hub (includes chat connectivity and message notifications)
  const { chatConnected, notificationPreferences } = useNotificationHub();

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const navigate = useNavigate();

  return (
    <div className="flex h-screen space-x-0 lg:space-x-4 bg-[#F7F7F7] fixed inset-0 p-2 lg:p-4">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        ></div>
        <div
          className={`absolute left-2 top-2 bottom-2 w-64 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={closeMobileSidebar} />
        </div>
      </div>

      <div className="relative flex flex-col flex-1 space-y-4 lg:space-y-4">
        <Navbar
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
        <button
          onClick={() => navigate("/chat")}
          className="absolute right-6 bottom-3 bg-mainColor h-12 w-12 rounded-full flex items-center justify-center"
        >
          <MessageSquareMore className="text-white" />
        </button>
        <main className="flex-1 overflow-y-auto px-2 py-4 lg:p-6 bg-white rounded-xl shadow-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
