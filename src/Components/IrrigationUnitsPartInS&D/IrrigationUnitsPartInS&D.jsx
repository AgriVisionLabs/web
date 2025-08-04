import { motion } from "framer-motion";
import { Cpu, Eye, MapPin, Plus, Trash2, Wrench, TriangleAlert } from "lucide-react";
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
    const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 mb-[16px] sm:mb-[20px]">
                <p className="text-[15px] sm:text-[17px] font-semibold capitalize">irrigation units</p>
                <div className="flex justify-center sm:justify-end">
                    <button className="py-[8px] sm:py-[12px] px-[16px] sm:px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[14px] sm:text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto" onClick={() => { setAddNewIrrigationUnit("Step1") }}>
                        <div className="flex justify-center items-center space-x-[8px] sm:space-x-[10px]">
                            <Plus size={16} className="sm:w-[19px] sm:h-[19px]" />
                            <p className="capitalize">Add irrigation units</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[16px] sm:gap-[20px] xl:gap-[28px] font-manrope">
                {isLoading ? (
                    <div className="col-span-full flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading irrigation units...</p>
                        </div>
                    </div>
                ) : IrrigationUnits && IrrigationUnits.length > 0 ? IrrigationUnits.map((IrrigationUnit, index) => {
                    return <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="rounded-[12px] sm:rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                    >
                        <div className="font-manrope">
                            <div className="pt-[16px] sm:pt-[20px] xl:pt-[24px] px-[16px] sm:px-[20px] xl:px-[24px] mb-[12px] sm:mb-[16px] xl:mb-[20px] flex justify-between items-start sm:items-center">
                                <div className="flex items-center space-x-[8px] sm:space-x-[10px] flex-1 min-w-0">
                                    <Cpu size={18} className="sm:w-[20px] sm:h-[20px] xl:w-[23px] xl:h-[23px] flex-shrink-0" />
                                    <h3 className="text-[15px] sm:text-[17px] xl:text-[18px] font-semibold capitalize truncate">{IrrigationUnit.name}</h3>
                                </div>
                                <h3 className="border-[1px] border-[#0d121c21] rounded-[12px] sm:rounded-[15px] px-[8px] sm:px-[10px] xl:px-[12px] py-[2px] sm:py-[3px] xl:py-[4px] text-[11px] sm:text-[12px] xl:text-[14px] font-semibold text-[#2b2b2b] capitalize flex-shrink-0">{status[IrrigationUnit.status]}</h3>
                            </div>
                            <div className="px-[16px] sm:px-[20px] xl:px-[24px] flex items-center space-x-[6px] sm:space-x-[8px] text-[13px] sm:text-[15px] xl:text-[16px] text-[#9F9F9F]">
                                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] flex-shrink-0" />
                                <p className="font-semibold capitalize truncate">{children.farmName} - {IrrigationUnit.fieldName}</p>
                            </div>
                            <div className="mt-3 sm:mt-4 px-[16px] sm:px-[20px] xl:px-[24px] flex flex-col text-[13px] sm:text-[15px] xl:text-[16px] text-[#9F9F9F] font-manrope space-y-2">
                                <div className="flex space-x-[6px] sm:space-x-[8px]">
                                    <p className="capitalize font-medium">firmware:</p>
                                    <p className="text-black font-semibold truncate">{IrrigationUnit.firmWareVersion}</p>
                                </div>
                                <div className="flex space-x-[6px] sm:space-x-[8px] font-medium">
                                    <p className="capitalize font-medium">last operation:</p>
                                    <TimeOperation timeStr={IrrigationUnit.lastOperationDuration} />
                                </div>
                            </div>
                            <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[16px] sm:py-[20px] xl:py-[24px] mt-[16px] sm:mt-[20px] xl:mt-[24px]">
                                <div className="px-[16px] sm:px-[20px] xl:px-[24px] flex justify-between items-center text-[#0D121C]">
                                    <div className="flex items-center space-x-[10px] sm:space-x-[12px]">
                                        <Wrench size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer hover:text-mainColor transition-colors' onClick={() => { setSchedule("ScheduleMaintenan") }} />
                                        <Eye size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer hover:text-mainColor transition-colors' onClick={() => {
                                            children.setFarmID(IrrigationUnit.farmId);
                                            children.setFieldID(IrrigationUnit.fieldId);
                                            children.setShowIrr(IrrigationUnit);
                                            children.setIrrigationUnit("step1")
                                        }} />
                                    </div>

                                    <Trash2 size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer text-[#ea2f2f] hover:text-red-600 transition-colors' onClick={() => { DeleteIrrigationUnits(IrrigationUnit.farmId, IrrigationUnit.fieldId) }} />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                }) : (
                    <div className="col-span-full">
                        <div className="h-[120px] sm:h-[150px] rounded-md text-[14px] sm:text-[16px] font-medium space-y-2 border-2 border-dashed border-[#0d121c21] mx-2 sm:mx-3 flex flex-col justify-center items-center">
                            <TriangleAlert size={28} className="sm:w-[32px] sm:h-[32px] xl:w-[36px] xl:h-[36px] text-yellow-500 mb-1" />
                            <p className="text-[#808080]">You have no irrigation units yet</p>
                            <p className="text-[#1f1f1f96] text-[12px] sm:text-[14px] text-center px-3 sm:px-4">
                                No irrigation units have been added to this farm yet. Click the "Add irrigation units" button to get started with irrigation control.
                            </p>
                        </div>
                    </div>
                )
                }

            </div>
            {addNewIrrigationUnit === "Step1" ? <div className='fixed z-50 inset-0'><AddNewIrrigationUnitStep1 fields={fields} indexIRRSDS1={indexIRRSDS1} setIndexIRRSDS1={setIndexIRRSDS1} /></div> :
                addNewIrrigationUnit === "Step2" ? <div className='fixed z-50 inset-0'><AddNewIrrigationUnitStep2 getIrrigationUnits={getIrrigationUnits} farmId={children.farmId} field={fields[indexIRRSDS1]} /></div> :
                    ""}
        </>
    );
}

export default IrrigationUnitsPartInSD;
