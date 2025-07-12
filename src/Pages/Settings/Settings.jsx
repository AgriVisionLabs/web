import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import Personal from "../../Components/Personal(Settings)/Personal";
import Security from "../../Components/Security(Settings)/Security";
import Notifications from "../../Components/Notifications(Settings)/Notifications";
import Subscription from "../../Components/Subscription(Settings)/Subscription";
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
        <h1 className="text-[25px] font-semibold">Settings</h1>
      </div>
      <div className="mt-[60px]">
        <div
          className="grid grid-cols-2 gap-[10px] md:flex md:justify-between min-h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] p-[10px] text-[16px] md:text-[17px] font-medium mb-[52px]"
          id="parts"
          onClick={(e) => {
            getPart(e.target);
          }}
        >
          <div
            className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer flex items-center space-x-[4px]"
            onClick={() => {
              setPart("Personal");
            }}
          >
            <p className="mx-8">Personal</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("Security");
            }}
          >
            <p className="mx-8">Security</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("Subscription");
            }}
          >
            <p className="mx-8">Subscription</p>
          </div>
          <div
            className="py-[12px] px-[12px] rounded-[10px] cursor-pointer flex items-center space-x-[4px] text-[#9F9F9F]"
            onClick={() => {
              setPart("Notifications");
            }}
          >
            <p className="mx-8">Notifications</p>
          </div>
        </div>
        <div className="">
          {part === "Personal" ? (
            <Personal />
          ) : part === "Security" ? (
            <Security />
          ) : part === "Subscription" ? (
            <Subscription />
          ) : part === "Notifications" ? (
            <Notifications />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Settings;
