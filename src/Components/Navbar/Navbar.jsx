import { useState } from "react";
// import imgLogoIcon from "../../assets/logo/AgrivisionLogo.svg";
// import imgPersonalIcon from "../../assets/images/image 6.png";
// import { AllContext } from "../../Context/All.context";
import { useLocation } from "react-router-dom";

import { AlertCircle, Bell, CheckCircle, Settings, X } from "lucide-react";
const Navbar = () => {
  //   let { OnMenu } = useContext(AllContext);
  let [openNotifications, setOpenNotifications] = useState(false);
  //   function menuResponsive() {
  //     let menuRes = document.querySelector("main");
  //     // if(OnMenu){
  //     //     menuRes.lastElementChild.classList.remove("w-[88%]")
  //     //     menuRes.lastElementChild.classList.add("w-[95%]")

  //     // }else{
  //     //     menuRes.lastElementChild.classList.remove("w-[95%]")
  //     //     menuRes.lastElementChild.classList.add("w-[88%]")

  //     // }
  //   }
  //   function OpenMenuList() {
  //     // let section=document.querySelector("section.Home main section");
  //     let element = document.querySelector(" div.menuList");
  //     let element2 = document.querySelector(" div.menuList div.log-out");
  //     if (!OnMenu) {
  //       setPageSize("w-[92%] ms-auto");
  //       element2.classList.add("border-t-0");
  //       element2.classList.remove("border-t-2");
  //       element.classList.add("w-0");
  //       element.classList.remove("w-[100%]");
  //       setOnmenu(true);
  //     } else {
  //       setPageSize("w-[85%] ms-auto");
  //       element2.classList.add("border-t-2");
  //       element2.classList.remove("border-t-0");
  //       element.classList.add("w-[100%]");
  //       element.classList.remove("w-0");
  //       setOnmenu(false);
  //     }
  //   }

  //   useEffect(() => {
  //     menuResponsive();
  //   }, [OnMenu]);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/farms&fields": "Farms and Fields",
    "/tasks": "Tasks",
    "/irrigation": "Irrigation",
    "/disease_detection": "Disease Detection",
    "/sensors&devices": "Sensors and Devices",
    "/inventory": "Inventory",
    "/analytics": "Analytics",
    "/Settings": "Settings",
  };

  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Page";

  return (
    <nav className="flex justify-between items-center shadow-md rounded-xl bg-white p-2 lg:py-4 lg:px-6 z-10">
      <h2 className="text-lg font-semibold">
        <span className="text-[#374151] mr-1">{currentTitle}</span>
        {">"} overview
      </h2>
      <div className="PersonalِِAccount&notifications flex  items-center space-x-1 lg:space-x-5">
        <i
          className="hover:text-mainColor cursor-pointer"
          onClick={() => {
            setOpenNotifications(true);
          }}
        >
          <Bell
            fill={openNotifications ? "#1E6930" : "#ffffff"}
            size={23}
            className="w-5 h-5 lg:w-7 lg:h-7"
          />
        </i>
        <img src="/profile.svg" className="w-8 lg:w-10" />
      </div>
      {openNotifications ? (
        <div className="w-[380px] h-[450px] bg-[#FFFFFF] rounded-[25px] border-[1px] border-[#9F9F9F] fixed right-[50px] top-[80px] ">
          <div className="flex justify-between items-center pb-[20px] border-b-[1px] border-[#9F9F9F] px-[15px] py-[15px]">
            <div className="flex items-center space-x-2">
              <Bell size={20} />
              <p className="font-semibold text-[18px]">Notification</p>
              <div className="bg-mainColor flex justify-center items-center rounded-full w-[50px] ">
                <p className="text-white text-[14px] ">1 new</p>
              </div>
            </div>
            <X className="hover:text-red-700 transition-all duration-500 cursor-pointer"
              onClick={() => {
                setOpenNotifications(false);
              }}
            />
          </div>
          <div className="h-[315px] overflow-y-auto ">
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px] bg-[#F0FDF4]  px-[15px] py-[5px] border-b-[1px] border-[#9f9f9f5f]">
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
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[15px] py-[5px] border-b-[1px] border-[#9f9f9f5f]">
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
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[15px] py-[5px] border-b-[1px] border-[#9f9f9f5f]">
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
            <div className="text-[#616161] font-[500] text-[13px] flex flex-col space-y-[5px]   px-[15px] py-[5px] border-b-[1px] border-[#9f9f9f5f]">
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
            <button className="px-[20px] py-[5px] bg-[#FFFFFF] border-[1px] border-[#C9C9C9] rounded-[15px] font-medium hover:bg-mainColor hover:text-white transition-all duration-300">
              Mark All Read
            </button>
            <button className="px-[30px] py-[5px] bg-[#FFFFFF] text-[#E13939] border-[1px] border-[#C9C9C9] rounded-[15px] font-medium hover:bg-[#E13939] hover:text-white transition-all duration-300">
              Clear All
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
