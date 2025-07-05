import { useContext, useEffect, useState } from "react";
import {
  CircleAlert,
  CircleGauge,
  Hash,
  MapPin,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { AllContext } from "../../Context/All.context";
import AddIrrigationStep1IrrigationPage from "../../Components/AddIrrigationStep1(IrrigationPage)/AddIrrigationStep1(IrrigationPage)";
import AddIrrigationStep2IrrigationPage from "../../Components/AddIrrigationStep2(IrrigationPage)/AddIrrigationStep2(IrrigationPage)";
import MenuElement from "../../Components/MenuElement/MenuElement";
import AutomationRuleStep1IrrigationPage from "../../Components/AutomationRuleStep1(IrrigationPage)/AutomationRuleStep1(IrrigationPage)";
import AutomationRuleStep2IrrigationPage from "../../Components/AutomationRuleStep2(IrrigationPage)/AutomationRuleStep2(IrrigationPage)";
import FilteIrrigationAutomationRules from "../../Components/FilteIrrigation&AutomationRules/FilteIrrigation&AutomationRules";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import { motion } from "framer-motion";
const Irrigation = () => {
  let {
    controlIrrigationPage,
    setControlIrrigationPage,
    irrigationUnit,
    setIrrigationUnit,
    toggleButton,
    baseUrl,
  } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [indexIRR, setIndexIRR] = useState(0);
  let [indexAuto, setIndexAuto] = useState(0);
  let [indexIRRS1, setIndexIRRS1] = useState(0);
  let [fields, setFields] = useState([]);
  let [IrrigationUnits, setIrrigationUnits] = useState([]);
  let [Automation, setAutomation] = useState([]);
  let [Farms, setFarms] = useState([]);
  let [allFarms, setAllFarms] = useState([]);
  let status = ["Active", "Idle", "Maintenance"];
  // let toggleButtonClick=useRef(null)
  async function getFarms() {
    console.log(token);
    try {
      const options = {
        url: `${baseUrl}/Farms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      if (data) {
        setAllFarms(
          data.map((farm) => {
            return farm.name;
          })
        );
        setFarms(data);
        console.log(data);
      }
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  async function getFields() {
    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      console.log("getFields :", data);
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  async function getIrrigationUnits() {
    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/IrrigationUnits`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setIrrigationUnits(data);
      console.log("getIrrigationUnits", data);
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  async function toggleIrrigationUnits(farmId, fieldId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits/toggle`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  async function DeleteIrrigationUnits(farmId, fieldId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      getIrrigationUnits();
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  // function toggleButton(e){
  //     if(e.target==e.currentTarget){ if(e.target.classList.contains('bg-[#5e5e5f21]')){
  //         e.target.classList.replace('bg-[#5e5e5f21]','bg-[#1E6930]')
  //         e.target.firstElementChild.classList.toggle("ms-[19px]")
  //     }
  //     else{
  //         e.target.classList.replace('bg-[#1E6930]','bg-[#5e5e5f21]')
  //         e.target.firstElementChild.classList.toggle("ms-[19px]")
  //     }}
  //     else{ if(e.target.parentElement.classList.contains('bg-[#5e5e5f21]')){
  //         e.target.parentElement.classList.replace('bg-[#5e5e5f21]','bg-[#1E6930]')
  //         e.target.classList.toggle("ms-[19px]")
  //     }
  //     else{
  //         e.target.parentElement.classList.replace('bg-[#1E6930]','bg-[#5e5e5f21]')
  //         e.target.classList.toggle("ms-[19px]")
  //     }}

  // }
  useEffect(() => {
    getFarms();
  }, []);
  useEffect(() => {
    if (Farms) {
      getIrrigationUnits();
      getFields();
    }
  }, [indexIRR, Farms]);
  async function getAutomation() {
    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[indexIRR].farmId}/AutomationRules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setAutomation(data);
      console.log("getAutomation", data);
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  // async function toggleIrrigationUnits(farmId,fieldId){
  //     try {
  //         const options={
  //             url:`${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits/toggle`,
  //             method:"POST",
  //             headers:{
  //                 Authorization:`Bearer ${token}`,
  //             }
  //         }
  //         let {data}=await axios(options);
  //     }catch(error){
  //      toast.error("Incorrect email or password "+error);
  //         console.log(error)
  //     }
  // }
  async function DeleteAutomation(farmId, fieldId, automationRuleId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/AutomationRules/${automationRuleId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      getAutomation();
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  useEffect(() => {
    if (Farms) {
      getAutomation();
      getFields();
    }
  }, [indexIRR, Farms]);

  return (
    <>
      <section className="transition-all duration-500 space-y-10">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start md:justify-between md:items-center px-3 ">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between md:items-center md:gap-x-12">
            <p className="text-[23px] capitalize font-medium">
              Irrigation Control
            </p>
            <MenuElement
              Items={allFarms}
              nameChange={allFarms[indexIRR]}
              setIndex={setIndexIRR}
              onList={irrigationUnit}
              width={200 + "px"}
              className={"py-[6px]"}
              setOnList={setIrrigationUnit}
              Pformat={"text-[#0D121C] font-[400]"}
            />
          </div>
          <button
            className="flex font-medium items-center rounded-lg space-x-2 md:self-end py-[7px]  px-2  text-[16px]  md:text-[16px] border-2 border-[#0d121c21] capitalize    "
            onClick={() => {
              setControlIrrigationPage("Filter");
            }}
          >
            <SlidersHorizontal size={19} /> <p>Filter</p>
          </button>
        </div>
      {IrrigationUnits.length==0? <div className="h-[150px] rounded-md text-[16px] font-medium space-y-1  border-2 border-dashed border-[#0d121c21] mx-3 mt-[40px] flex flex-col justify-center items-center ">
                <TriangleAlert size={40} color='#FFAC33' className='my-2'/>
                <p className="">No irrigation unit</p>
                <p className="text-[#1f1f1f96]">No irrigation units found . Try adding a irrigation unit.</p>
        </div>:
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:justify-between md:items-center px-3">
          <p className="text-[20px] capitalize font-medium text-[#333333d4]">
            Irrigation Units
          </p>
          <button
            className="btn md:self-end py-[12px] w-auto px-2 md:px-[20px] bg-mainColor text-[15px] text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-[500]  "
            onClick={() => {
              setControlIrrigationPage("Step1Irrigation");
            }}
          >
            <i className="fa-solid fa-plus pe-2 font-[200]"></i> add Irrigation
            Unit
          </button>
        </div>
        }
        {IrrigationUnits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4">
            {IrrigationUnits.map((IrrigationUnit, index) => (
              <motion.div
                key={index}
                initial={{ x: 300, y: -50, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.35,
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.4,
                }}
              >
                {" "}
                <div
                  key={index}
                  className=" shadow-md  py-2 rounded-xl border-2  border-[#0d121c21] "
                >
                  <div className="flex justify-between items-center px-3">
                    <p className="text-mainColor font-semibold text-[17px]">
                      {IrrigationUnit.name}
                    </p>
                    <div className="py-[2px] px-3 border-2 text-[14px] font-[500] rounded-2xl border-[#0d121c21] ">
                      {status[IrrigationUnit.status]}
                    </div>
                  </div>
                  <div className="mt-2 px-3 text-[#1f1f1f96]">
                    <p className="font-[400] text-[16px] my-2 flex items-center gap-2">
                      <MapPin strokeWidth={1.75} size={20} />
                      {IrrigationUnit.fieldName}
                    </p>
                    <p className="font-[400] text-[17px] my-2 flex items-center gap-2">
                      {" "}
                      <Hash strokeWidth={1.75} size={20} />{" "}
                      {IrrigationUnit.name}
                    </p>
                  </div>
                  <div className=" border-t-2 border-[#0d121c21] ">
                    <div className="px-3 pt-2 flex justify-between ">
                      <div className="flex space-x-3 ">
                        <SquarePen
                          strokeWidth={1.75}
                          size={22}
                          className="hover:text-mainColor transition-all duration-300"
                        />
                        <Trash2
                          strokeWidth={1.75}
                          size={22}
                          className="hover:text-red-700 transition-all duration-300"
                          onClick={() => {
                            DeleteIrrigationUnits(
                              IrrigationUnit.farmId,
                              IrrigationUnit.fieldId
                            );
                          }}
                        />
                      </div>
                      <div
                        className=" w-[47px] h-[25px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21]  cursor-pointer"
                        onClick={(e) => {
                          toggleIrrigationUnits(
                            IrrigationUnit.farmId,
                            IrrigationUnit.fieldId
                          );
                          toggleButton(e);
                        }}
                      >
                        <div className="h-[20px] w-[20px] bg-white rounded-full  transition-all duration-700  "></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className=" flex flex-col md:flex-row space-y-2 md:space-y-0 md:justify-between md:items-center px-3">
          <p className="text-[20px] capitalize font-medium text-[#333333d4]">
            automation rules
          </p>
          <button
            className="btn md:self-end py-[px] w-auto px-2 md:px-[20px] bg-mainColor text-[15px] font-medium text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor   "
            onClick={() => {
              setControlIrrigationPage("Step1AutomationRule");
            }}
          >
            <i className="fa-solid fa-plus pe-2 font-[200]"></i> add new rule
          </button>
        </div>

        {Automation.length==0?<div className="h-[150px] rounded-md text-[16px] font-medium space-y-1  border-2 border-dashed border-[#0d121c21] mx-3 mt-[40px] flex flex-col justify-center items-center ">
                <TriangleAlert size={40} color='#FFAC33' className='my-2'/>
                <p className="">No Rules Found</p>
                <p className="text-[#1f1f1f96]">No automation rules found . Try adding a new rule or adjusting your filters.</p>
        </div>:
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-2">
          {Automation
            ? Automation.map((automation, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ x: 300, y: -50, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.35,
                      duration: 0.8,
                      type: "spring",
                      bounce: 0.4,
                    }}
                  >
                    <div
                      key={index}
                      className=" shadow-md  py-2 rounded-xl border-2  border-[#0d121c21] "
                    >
                      <div className=" px-3">
                        <p className="text-mainColor font-semibold text-[16px]">
                          {automation.name}
                        </p>
                      </div>
                      {automation.activeDays !== null ? (
                        <div className="mt-2 px-3 text-[#1f1f1f96]">
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            {" "}
                            <CircleAlert  strokeWidth={1.75} size={20} />
                            type :threshold{" "}
                          </p>
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            <MapPin strokeWidth={1.75} size={20} />
                            Field : {automation.fieldName}
                          </p>
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            {" "}
                            <CircleGauge strokeWidth={1.75} size={20} />
                            threshold : {automation.minThresholdValue}-
                            {automation.maxThresholdValue} %
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 px-3 text-[#1f1f1f96]">
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            {" "}
                            <CircleAlert strokeWidth={1.75} size={20} />
                            type : Schedule
                          </p>
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            <MapPin strokeWidth={1.75} size={20} />
                            Field : {automation.fieldName}
                          </p>
                          <p className="font-[400] text-[15px] my-2 flex items-center gap-2 capitalize">
                            {" "}
                            <CircleGauge strokeWidth={1.75} size={20} />
                            Schedule : from {automation.startTime} to{" "}
                            {automation.endTime}{" "}
                          </p>
                        </div>
                      )}
                      <div className=" border-t-2 border-[#0d121c21] ">
                        <div className="px-3 pt-2 flex justify-between ">
                          <div className="flex space-x-3 ">
                            <SquarePen
                              strokeWidth={1.75}
                              size={22}
                              className="hover:text-mainColor transition-all duration-300"
                            />
                            <Trash2
                              strokeWidth={1.75}
                              size={22}
                              className="hover:text-red-700 transition-all duration-300"
                              onClick={() => {
                                DeleteAutomation(
                                  automation.farmId,
                                  automation.fieldId,
                                  automation.id
                                );
                              }}
                            />
                          </div>
                          <div
                            className=" w-[47px] h-[25px] rounded-2xl  flex items-center px-1 transition-all duration-300 bg-[#5e5e5f21] "
                            onClick={(e) => {
                              toggleButton(e);
                            }}
                          >
                            <div className="h-[20px] w-[20px] bg-white rounded-full  transition-all duration-700 "></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            : null}
        </div>}
        {controlIrrigationPage == "Step1Irrigation" ? (
          <div className=" fixed z-50 inset-0  ">
            <AddIrrigationStep1IrrigationPage
              farm={Farms[indexIRR]}
              fields={fields}
              indexIRRS1={indexIRRS1}
              setIndexIRRS1={setIndexIRRS1}
            />
          </div>
        ) : controlIrrigationPage == "Step2Irrigation" ? (
          <div className=" fixed z-50 inset-0  ">
            <AddIrrigationStep2IrrigationPage
              farm={Farms[indexIRR]}
              field={fields[indexIRRS1]}
            />
          </div>
        ) : controlIrrigationPage == "Step1AutomationRule" ? (
          <div className=" fixed z-50 inset-0  ">
            <AutomationRuleStep1IrrigationPage
              farm={Farms[indexIRR]}
              fields={fields}
              indexAuto={indexAuto}
              setIndexAuto={setIndexAuto}
            />
          </div>
        ) : controlIrrigationPage == "Step2AutomationRule" ? (
          <div className=" fixed z-50 inset-0  ">
            <AutomationRuleStep2IrrigationPage
              getAutomation={getAutomation}
              farm={Farms[indexIRR]}
              field={fields[indexAuto]}
            />
          </div>
        ) : controlIrrigationPage == "Filter" ? (
          <div className=" fixed z-50 inset-0  ">
            <FilteIrrigationAutomationRules />
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  ); //Step2AutomationRule
};

export default Irrigation;
