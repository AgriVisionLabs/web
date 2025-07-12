import { motion } from "framer-motion";
import { Cpu, Eye, MapPin, Plus, Trash2, Wrench } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import AddNewIrrigationUnitStep1 from "../AddNewIrrigationUnitStep1/AddNewIrrigationUnitStep1";
import { AllContext } from "../../Context/All.context";
import AddNewIrrigationUnitStep2 from "../AddNewIrrigationUnitStep2/AddNewIrrigationUnitStep2";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import TimeOperation from "../TimeOperation/TimeOperation";

const IrrigationUnitsPartInSD = (children) => {
    let { addNewIrrigationUnit, setAddNewIrrigationUnit, setSchedule, baseUrl } = useContext(AllContext);
    let { token } = useContext(userContext);
    let [indexIRRSDS1, setIndexIRRSDS1] = useState(0)
    let [fields, setFields] = useState([]);
    let [IrrigationUnits, setIrrigationUnits] = useState([]);
    // console.log(children.farm.farmId)
    let status = ["Active", "Idle", "Maintenance"]
    // console.log(children.farm)
    async function getFields() {
        if (!token) {
            console.error("No token available for authentication");
            return;
        }
        
        try {
            const options = {
                url: `${baseUrl}/farms/${children.farmId}/Fields`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            let { data } = await axios(options);
            setFields(data);
            children.setField(data)
        } catch (error) {
            console.error("Error fetching fields:", error);
        }
    }
    async function getIrrigationUnits() {
        if (!token) {
            console.error("No token available for authentication");
            return;
        }
        
        try {
            const options = {
                url: `${baseUrl}/farms/${children.farmId}/IrrigationUnits`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            let { data } = await axios(options);
            setIrrigationUnits(data);
        } catch (error) {
            console.error("Error fetching irrigation units:", error);
        }
    }
    async function DeleteIrrigationUnits(farmId, fieldId) {
        if (!token) {
            console.error("No token available for authentication");
            return;
        }
        
        try {
            const options = {
                url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/IrrigationUnits`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            let { data } = await axios(options);
            getIrrigationUnits()
        } catch (error) {
            console.error("Error deleting irrigation units:", error);
        }
    }
    useEffect(() => {
        getFields()
        getIrrigationUnits()
    }, [children.indexedDB]);
    return (
        <>
            <div className="flex justify-between items-center mb-[20px]">
                <p className="text-[17px] font-semibold capitalize">irrigation units
                </p>
                <div className="flex justify-center py-[15px]">
                    <button className="py-[12px] px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" onClick={() => { setAddNewIrrigationUnit("Step1") }}>
                        <div className="flex justify-center items-center space-x-[10px]">
                            <Plus size={19} />
                            <p className="capitalize">Add irrigation units</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[28px] font-manrope">
                {IrrigationUnits ? IrrigationUnits.map((IrrigationUnit, index) => {
                    return <motion.div
                        key={index}
                        initial={{ x: 300, y: -50, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            delay: index * 0.5,
                            duration: 0.8,
                            type: "spring",
                            bounce: 0.4,
                        }}
                        className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                    >
                        <div className="font-manrope">
                            <div className="pt-[24px] px-[24px] mb-[20px] flex justify-between items-center">
                                <div className="flex items-center space-x-[10px]">
                                    <Cpu />
                                    <h3 className="text-[18px] font-semibold capitalize">{IrrigationUnit.name}</h3>
                                </div>
                                <h3 className="border-[1px] border-[#0d121c21] rounded-[15px] px-[12px] py-[4px] text-[14px] font-semibold text-[#2b2b2b] capitalize">{status[IrrigationUnit.status]}</h3>
                            </div>
                            <div className="px-[24px] flex items-center space-x-[8px] text-[16px] text-[#9F9F9F]">
                                <MapPin className="" />
                                <p className="font-semibold capitalize">{children.farmName} - {IrrigationUnit.fieldName}</p>
                            </div>
                            <div className="mt-4 px-[24px] flex flex-col text-[16px] text-[#9F9F9F] font-manrope">
                                <div className="flex space-x-[8px]">
                                    <p className="capitalize font-medium">firmware: </p>
                                    <p className="text-black font-semibold">{IrrigationUnit.firmWareVersion}</p>
                                </div>
                                <div className="col-span-2 flex space-x-[8px] font-medium my-[12px]">
                                    <p className="capitalize font-medium">last operation: </p>
                                    {/* <p className="text-black font-semibold">Zone 3 active for 20 minutes</p> */}
                                    <TimeOperation timeStr={IrrigationUnit.lastOperationDuration} />
                                </div>
                            </div>
                            <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[24px] mt-[24px]">
                                <div className="px-[24px] flex justify-between items-center text-[#0D121C]">
                                    <div className="flex items-center space-x-[12px]">
                                        <Wrench size={25} className='cursor-pointer' onClick={() => { setSchedule("ScheduleMaintenan") }} />
                                        <Eye size={25} className='cursor-pointer' onClick={() => {
                                            children.setFarmID(IrrigationUnit.farmId);
                                            children.setFieldID(IrrigationUnit.fieldId);
                                            children.setIrrigationUnit("step1")
                                        }} />
                                    </div>

                                    <Trash2 size={25} className='cursor-pointer text-[#ea2f2f]' onClick={() => { DeleteIrrigationUnits(IrrigationUnit.farmId, IrrigationUnit.fieldId) }} />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                }) : ""
                }

            </div>
            {addNewIrrigationUnit === "Step1" ? <div className='fixed z-50 inset-0'><AddNewIrrigationUnitStep1 fields={fields} indexIRRSDS1={indexIRRSDS1} setIndexIRRSDS1={setIndexIRRSDS1} /></div> :
                addNewIrrigationUnit === "Step2" ? <div className='fixed z-50 inset-0'><AddNewIrrigationUnitStep2 getIrrigationUnits={getIrrigationUnits} farmId={children.farmId} field={fields[indexIRRSDS1]} /></div> :
                    ""}
        </>
    );
}

export default IrrigationUnitsPartInSD;
