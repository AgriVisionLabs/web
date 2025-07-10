import { useContext, useEffect, useState } from "react";
import MenuElement from "../../Components/MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import SensorsPartInSD from "../../Components/SensorsPartInS&D/SensorsPartInS&D";
import IrrigationUnitsPartInSD from "../../Components/IrrigationUnitsPartInS&D/IrrigationUnitsPartInS&D";
import ScheduleMaintenanceSD from "../../Components/ScheduleMaintenance(S&D)/ScheduleMaintenance(S&D)";
import LogMaintenanceSD from "../../Components/LogMaintenance(S&D)/LogMaintenance(S&D)";
import ShowSensorUnit from "../../Components/ShowSensorUnit/ShowSensorUnit";
import EditSensorUnit from "../../Components/EditSensorUnit/EditSensorUnit";
import axios from "@axiosInstance";
import { userContext } from "../../Context/User.context";
import ShowSprinklerSystem from "../../Components/ShowSprinklerSystem/ShowSprinklerSystem";
import EditSprinklerSystem from "../../Components/EditSprinklerSystem/EditSprinklerSystem";
import toast from "react-hot-toast";

const SensorsDevices = () => {
  let { onListSenDev, setOnListSenDev, getPart, schedule, baseUrl ,index,setIndex } =
    useContext(AllContext);
  let { token } = useContext(userContext);
  let [irrigationUnit, setIrrigationUnit] = useState();
  let [sensorUnit, setSensorUnit] = useState();
  let [sensorUnitId, setSensorUnitId] = useState();
  // var forms=[4,5,6,7];
  let [partsSenDev, setPartsSenDev] = useState("sensors");
  // let [indexIRRSD, setIndexIRRSD] = useState(0);
  let [fieldID, setFieldID] = useState([]);
  let [farmID, setFarmID] = useState([]);
  let [Farms, setFarms] = useState([]);
  let [ShowIrr, setShowIrr] = useState([]);
  let [ShowIrrMember, setShowIrrMember] = useState([]);
  let [getSensorUnit, setGetSensorUnit] = useState([]);
  let [Field, setField] = useState([]);
  let [allFarms, setAllFarms] = useState([]);
  // let status=["Active","Idle","Maintenance"]
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
      }
    } catch (error) {
      if(error.response.data){
        if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
        else{toast.error("There is an error");}
      }else{console.log(error)}
    }
  }

  useEffect(() => {
    getFarms();
  }, []);
  return Farms.length!=0 ? (
    <div className="transition-all duration-500">
      <div className="mb-[35px] flex items-center space-x-[15px]">
        <p className="text-[23px] text-[#0D121C] font-semibold font-manrope capitalize ">
          sensors & devices
        </p>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-[20px] mb-[44px]">
        <MenuElement
          Items={allFarms}
          nameChange={allFarms[index]}
          setIndex={setIndex}
          index={index}
          width={200 + "px"}
          className={"text-[15px]"}
          onList={onListSenDev}
          setOnList={setOnListSenDev}
        />
        <form action="" className="">
          <input
            type="text"
            placeholder="Search devices by name or serial number ..."
            className=" text-[14px] sm:text-[16px]   text-[#616161] font-[400] font-manrope h-[45px]  py-[8px] px-[22px] rounded-[8px] border-[1px] border-[#D9D9D9] w-[200px] sm:w-[300px] md:w-[400px] focus:outline-mainColor "
          />
        </form>
      </div>
      <div
        className="flex w-fit items-center  h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] md:text-[15px]   font-medium mb-[52px] capitalize"
        id="parts"
        onClick={(e) => {
          getPart(e.target);
        }}
      >
        <p
          className="py-[12px] px-[12px]  rounded-[10px] cursor-pointer bg-[#FFFFFF] text-mainColor"
          onClick={() => {
            setPartsSenDev("sensors");
          }}
        >
          sensors
        </p>
        <p
          className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
          onClick={() => {
            setPartsSenDev("irrigation units");
          }}
        >
          irrigation units
        </p>
      </div>
      <div className="font-manrope">
        {Farms.length > 0 && partsSenDev === "sensors" ? (
          <SensorsPartInSD
            setFarmID={setFarmID}
            setGetSensorUnit={setGetSensorUnit}
            setSensorUnitId={setSensorUnitId}
            setFieldID={setFieldID}
            setField={setField}
            indexedDB={index}
            farmName={Farms[index].name}
            farmId={Farms[index].farmId}
            setSensorUnit={setSensorUnit}
          />
        ) : Farms.length > 0 && partsSenDev === "irrigation units" ? (
          <IrrigationUnitsPartInSD
            setFarmID={setFarmID}
            setFieldID={setFieldID}
            setField={setField}
            indexedDB={index}
            farmName={Farms[index].name}
            farmId={Farms[index].farmId}
            setIrrigationUnit={setIrrigationUnit}
          />
        ) : null}
        {schedule == "ScheduleMaintenan" ? (
          <div className=" fixed z-50 inset-0  ">
            <ScheduleMaintenanceSD />
          </div>
        ) : schedule == "Log Completed" ? (
          <div className=" fixed z-50 inset-0  ">
            <LogMaintenanceSD />
          </div>
        ) : schedule == "ShowSensorUnit" ? (
          <div className=" fixed z-50 inset-0  ">
            <ShowSensorUnit
              setShowIrr={setShowIrr}
              sensorUnitId={sensorUnitId}
              setShowIrrMember={setShowIrrMember}
              setSensorUnit={setSensorUnit}
              fieldID={fieldID}
              farmID={farmID}
            />
          </div>
        ) : schedule == "EditSensorUnit" ? (
          <div className=" fixed z-50 inset-0  ">
            <EditSensorUnit
              Fields={Field}
              getSensorUnit={getSensorUnit}
              ShowIrr={ShowIrr}
              sensorUnitId={sensorUnitId}
              setSensorUnit={setSensorUnit}
              ShowIrrMember={ShowIrrMember}
            />
          </div>
        ) : (
          ""
        )}
        {irrigationUnit == "step1" ? (
          <div className=" fixed z-50 inset-0  ">
            <ShowSprinklerSystem
              setShowIrr={setShowIrr}
              setShowIrrMember={setShowIrrMember}
              setIrrigationUnit={setIrrigationUnit}
              fieldID={fieldID}
              farmID={farmID}
            />
          </div>
        ) : irrigationUnit == "step2" ? (
          <div className=" fixed z-50 inset-0  ">
            <EditSprinklerSystem
              Fields={Field}
              ShowIrr={ShowIrr}
              setIrrigationUnit={setIrrigationUnit}
              ShowIrrMember={ShowIrrMember}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    <div className="h-[80%]  flex justify-center items-center">
        <p className="text-[17px] text-[#333333] w-[480px] text-center font-medium">You don’t have any farms yet</p>
      </div>
  );
};

export default SensorsDevices;
