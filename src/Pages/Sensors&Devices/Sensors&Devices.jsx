import { useContext, useEffect, useState } from "react";
import MenuElement from "../../Components/MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import SensorsPartInSD from "../../Components/SensorsPartInS&D/SensorsPartInS&D";
import IrrigationUnitsPartInSD from "../../Components/IrrigationUnitsPartInS&D/IrrigationUnitsPartInS&D";
import ScheduleMaintenanceSD from "../../Components/ScheduleMaintenance(S&D)/ScheduleMaintenance(S&D)";
import LogMaintenanceSD from "../../Components/LogMaintenance(S&D)/LogMaintenance(S&D)";
import ShowSensorUnit from "../../Components/ShowSensorUnit/ShowSensorUnit";
import EditSensorUnit from "../../Components/EditSensorUnit/EditSensorUnit";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import ShowSprinklerSystem from "../../Components/ShowSprinklerSystem/ShowSprinklerSystem";
import EditSprinklerSystem from "../../Components/EditSprinklerSystem/EditSprinklerSystem";
import { Helmet } from "react-helmet";

const SensorsDevices = () => {
  let { onListSenDev, setOnListSenDev, getPart, schedule, baseUrl } =
    useContext(AllContext);
  let { token } = useContext(userContext);
  let [irrigationUnit, setIrrigationUnit] = useState();
  let [sensorUnit, setSensorUnit] = useState();
  let [sensorUnitId, setSensorUnitId] = useState();
  // var forms=[4,5,6,7];
  let [partsSenDev, setPartsSenDev] = useState("sensors");
  let [indexIRRSD, setIndexIRRSD] = useState(0);
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
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

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
      console.error("Error fetching farms:", error);
    }
  }

  useEffect(() => {
    getFarms();
  }, []);

  return Farms ? (
    <div className="transition-all duration-500">
      <Helmet>
        <title>Sensors And Devices</title>
      </Helmet>
      <div className="mb-[20px] sm:mb-[28px] xl:mb-[35px] flex items-center space-x-[10px] sm:space-x-[15px]">
        <p className="text-[18px] sm:text-[21px] xl:text-[23px] text-[#0D121C] font-semibold font-manrope capitalize">
          sensors & devices
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-[16px] xl:space-x-[20px] mb-[28px] sm:mb-[36px] xl:mb-[44px]">
        <MenuElement
          Items={allFarms}
          nameChange={allFarms[indexIRRSD]}
          setIndex={setIndexIRRSD}
          index={indexIRRSD}
          width="auto"
          className={"text-[13px] sm:text-[14px] xl:text-[15px] min-w-[160px] sm:min-w-[180px] xl:min-w-[200px]"}
          onList={onListSenDev}
          setOnList={setOnListSenDev}
        />
        <form action="" className="flex-1">
          <input
            type="text"
            placeholder="Search devices by name or serial number ..."
            className="text-[13px] sm:text-[14px] xl:text-[16px] text-[#616161] font-[400] font-manrope h-[40px] sm:h-[42px] xl:h-[45px] py-[6px] sm:py-[8px] px-[16px] sm:px-[20px] xl:px-[22px] rounded-[8px] border-[1px] border-[#D9D9D9] w-full focus:outline-mainColor"
          />
        </form>
      </div>
      <div
        className="flex flex-col sm:flex-row w-full sm:w-fit items-stretch sm:items-center h-auto sm:h-[60px] xl:h-[70px] rounded-[8px] sm:rounded-[10px] bg-[rgba(217,217,217,0.3)] space-y-2 sm:space-y-0 sm:space-x-[12px] xl:space-x-[20px] p-[8px] sm:px-[10px] sm:py-[8px] text-[13px] sm:text-[14px] xl:text-[15px] font-medium mb-[32px] sm:mb-[42px] xl:mb-[52px] capitalize"
        id="parts"
        onClick={(e) => {
          getPart(e.target);
        }}
      >
        <p
          className={`py-[10px] sm:py-[12px] px-[16px] sm:px-[12px] rounded-[8px] sm:rounded-[10px] cursor-pointer text-center transition-all duration-200 ${
            partsSenDev === "sensors" 
              ? "bg-[#FFFFFF] text-mainColor" 
              : "text-[#9F9F9F] hover:bg-white/50"
          }`}
          onClick={() => {
            setPartsSenDev("sensors");
          }}
        >
          sensors
        </p>
        <p
          className={`py-[10px] sm:py-[12px] px-[16px] sm:px-[12px] rounded-[8px] sm:rounded-[10px] cursor-pointer text-center transition-all duration-200 ${
            partsSenDev === "irrigation units" 
              ? "bg-[#FFFFFF] text-mainColor" 
              : "text-[#9F9F9F] hover:bg-white/50"
          }`}
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
            indexedDB={indexIRRSD}
            farmName={Farms[indexIRRSD].name}
            farmId={Farms[indexIRRSD].farmId}
            setSensorUnit={setSensorUnit}
          />
        ) : Farms.length > 0 && partsSenDev === "irrigation units" ? (
          <IrrigationUnitsPartInSD
            setFarmID={setFarmID}
            setFieldID={setFieldID}
            setField={setField}
            setShowIrr={setShowIrr}
            indexedDB={indexIRRSD}
            farmName={Farms[indexIRRSD].name}
            farmId={Farms[indexIRRSD].farmId}
            setIrrigationUnit={setIrrigationUnit}
          />
        ) : null}
        {schedule === "ScheduleMaintenan" ? (
          <div className="fixed z-50 inset-0">
            <ScheduleMaintenanceSD />
          </div>
        ) : schedule === "Log Completed" ? (
          <div className="fixed z-50 inset-0">
            <LogMaintenanceSD />
          </div>
        ) : schedule === "ShowSensorUnit" ? (
          <div className="fixed z-50 inset-0">
            <ShowSensorUnit
              setShowIrr={setShowIrr}
              sensorUnitId={sensorUnitId}
              setShowIrrMember={setShowIrrMember}
              setSensorUnit={setSensorUnit}
              fieldID={fieldID}
              farmID={farmID}
            />
          </div>
        ) : schedule === "EditSensorUnit" ? (
          <div className="fixed z-50 inset-0">
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
        {irrigationUnit === "step1" ? (
          <div className="fixed z-50 inset-0">
            <ShowSprinklerSystem
              ShowIrr={ShowIrr}
              setShowIrr={setShowIrr}
              setShowIrrMember={setShowIrrMember}
              setIrrigationUnit={setIrrigationUnit}
              fieldID={fieldID}
              farmID={farmID}
            />
          </div>
        ) : irrigationUnit === "step2" ? (
          <div className="fixed z-50 inset-0">
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
    ""
  );
};

export default SensorsDevices;
