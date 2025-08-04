import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import Personal from "../../Components/Personal(Settings)/Personal";
import Security from "../../Components/Security(Settings)/Security";
import Notifications from "../../Components/Notifications(Settings)/Notifications";
import SubscriptionPlans from "../../Components/SubscriptionPlans/SubscriptionPlans";
import { Helmet } from "react-helmet";

const Settings = () => {
  let { getPart } = useContext(AllContext);
  let [part, setPart] = useState("Personal");
  return (
    <section className="text-[#0D121C] transition-all duration-500">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <div className="text-center xl:text-start">
        <h1 className="text-lg sm:text-xl xl:text-[22px] font-semibold">Settings</h1>
      </div>
      <div className="mt-5 sm:mt-6 xl:mt-[32px]">
        <div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:justify-between min-h-[38px] sm:min-h-[42px] xl:min-h-[46px] rounded-[8px] bg-[rgba(217,217,217,0.3)] p-2 sm:p-3 xl:p-[8px] text-xs sm:text-sm xl:text-[15px] font-medium mb-5 sm:mb-6 xl:mb-[28px]"
          id="parts"
          onClick={(e) => {
            getPart(e.target);
          }}
        >
          <div
            className={`py-2 px-3 sm:py-[10px] sm:px-[10px] rounded-[8px] cursor-pointer flex items-center justify-center space-x-2 transition-all duration-200 touch-target-44 ${
              part === "Personal" 
                ? "bg-[#FFFFFF] text-mainColor" 
                : "text-[#9F9F9F] hover:bg-white/50"
            }`}
            onClick={() => {
              setPart("Personal");
            }}
          >
            <p className="text-center">Personal</p>
          </div>
          <div
            className={`py-2 px-3 sm:py-[10px] sm:px-[10px] rounded-[8px] cursor-pointer flex items-center justify-center space-x-2 transition-all duration-200 touch-target-44 ${
              part === "Security" 
                ? "bg-[#FFFFFF] text-mainColor" 
                : "text-[#9F9F9F] hover:bg-white/50"
            }`}
            onClick={() => {
              setPart("Security");
            }}
          >
            <p className="text-center">Security</p>
          </div>
          <div
            className={`py-2 px-3 sm:py-[10px] sm:px-[10px] rounded-[8px] cursor-pointer flex items-center justify-center space-x-2 transition-all duration-200 touch-target-44 ${
              part === "Subscription" 
                ? "bg-[#FFFFFF] text-mainColor" 
                : "text-[#9F9F9F] hover:bg-white/50"
            }`}
            onClick={() => {
              setPart("Subscription");
            }}
          >
            <p className="text-center">Subscription</p>
          </div>
          <div
            className={`py-2 px-3 sm:py-[10px] sm:px-[10px] rounded-[8px] cursor-pointer flex items-center justify-center space-x-2 transition-all duration-200 touch-target-44 ${
              part === "Notifications" 
                ? "bg-[#FFFFFF] text-mainColor" 
                : "text-[#9F9F9F] hover:bg-white/50"
            }`}
            onClick={() => {
              setPart("Notifications");
            }}
          >
            <p className="text-center">Notifications</p>
          </div>
        </div>
        <div className="">
          {part === "Personal" ? (
            <Personal />
          ) : part === "Security" ? (
            <Security />
          ) : part === "Subscription" ? (
            <SubscriptionPlans />
          ) : part === "Notifications" ? (
            <Notifications />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Settings;
