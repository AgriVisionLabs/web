import { motion } from 'framer-motion';
import { Cpu, Eye, MapPin, Plus, Trash2, Wrench } from 'lucide-react';
import { Line } from 'rc-progress';
import { useContext, useEffect, useState } from 'react';
import AddNewSensorStep1 from '../AddNewSensorStep1/AddNewSensorStep1';
import { AllContext } from '../../Context/All.context';
import AddNewSensorStep2 from '../AddNewSensorStep2/AddNewSensorStep2';
import axios from 'axios';
import { userContext } from '../../Context/User.context';
import SensorItem from '../SensorItem/sensorItem';

const SensorsPartInSD = (children) => {
    let { addNewSensor, setAddNewSensor, setSchedule, baseUrl } = useContext(AllContext)
    let [fields, setFields] = useState([]);
    let [indexIRRSDS1, setIndexIRRSDS1] = useState(0)
    let { token } = useContext(userContext);
    let [sensorUnits, setSensorUnits] = useState()
    const [latestReadings, setLatestReadings] = useState({});
    // let [sensorUnitId,setSensorUnitId]=useState([])
    let status = ["Active", "Idle", "Maintenance"]
    // const firstReading = Object.values(latestReadings)[0]?.readings;

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
    async function getSensorUnits() {
        if (!token) {
            console.error("No token available for authentication");
            return;
        }
        
        try {
            const options = {
                url: `${baseUrl}/farms/${children.farmId}/SensorUnits`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            let { data } = await axios(options);
            setSensorUnits(data);
        } catch (error) {
            console.error("Error fetching sensor units:", error);
        }
    }
    async function DeleteSensorUnit(farmId, fieldId, sensorUnitId) {
        if (!token) {
            console.error("No token available for authentication");
            return;
        }
        
        try {
            const options = {
                url: `${baseUrl}/farms/${farmId}/fields/${fieldId}/SensorUnits/${sensorUnitId}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            let { data } = await axios(options);
            getSensorUnits()
        } catch (error) {
            console.error("Error deleting sensor unit:", error);
        }
    }
    useEffect(() => {
        children.setGetSensorUnit(getSensorUnits)
        getFields()
        getSensorUnits()
    }, [children.indexedDB]);
    // useEffect(()=>{
    //     console.log("latestReadings",latestReadings[0].unitId)
    // },[latestReadings]);

    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-[20px]">
                    <p className="text-[17px] font-semibold capitalize">Sensors
                    </p>
                    <div className="flex justify-center py-[15px]">
                        <button className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[15px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" onClick={() => { setAddNewSensor("Step1") }}>
                            <div className="flex justify-center items-center space-x-[10px]">
                                <Plus size={19} />
                                <p className="capitalize">add new Sensor</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[28px] font-manrope">
                    {sensorUnits ? sensorUnits.map((sensorUnit, index) => {
                        return <motion.div
                            key={index}
                            initial={{ x: 300, y: 0, opacity: 0 }}
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
                                        <Cpu size={23} />
                                        <h3 className="text-[17px] font-semibold capitalize">{sensorUnit.name}</h3>
                                    </div>
                                    <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[2px] text-[14px] font-semibold text-[#FFFFFF] capitalize">{status[sensorUnit.status]}</h3>
                                </div>
                                <div className="px-[24px] flex items-center space-x-[8px] text-[15px] text-[#9F9F9F]">
                                    <MapPin size={20} />
                                    <p className="font-semibold capitalize">{children.farmName} - {sensorUnit.fieldName}</p>
                                </div>
                                <div className="mt-2 px-[28px] grid lg:grid-cols-3 grid-cols-5 items-center text-[15px] text-[#9F9F9F] font-manrope">
                                    <div className="flex col-span-3 space-x-[8px]">
                                        <p className="capitalize font-medium">firmware: </p>
                                        <p className="text-black font-semibold">{sensorUnit.firmWareVersion}</p>
                                    </div>
                                    <div className="flex col-span-2 justify-between items-center space-x-[2px] font-medium my-[12px]">
                                        <p className="capitalize">battery: </p>
                                        <Line percent={sensorUnit.batteryLevel} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full rounded-lg" />
                                        <p>{sensorUnit.batteryLevel}%</p>
                                    </div>
                                </div>

                                <SensorItem farmId={sensorUnit.farmId} accessToken={token} latestReadings={latestReadings} setLatestReadings={setLatestReadings} />

                                {/* <div className="grid grid-cols-2 px-[24px] sm:grid-cols-3  font-manrope justify-items-center gap-[10px] ">
                                    <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(8,159,252,0.1)]">
                                        <Droplet className="text-[#089FFC]"/>
                                        <p className="text-[16px] font-semibold">{String(sensorUnit.moisture).split(".")[0]}%</p>
                                        <p className="text-[#757575] text-[16px] font-medium capitalize">moisture</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(209,42,0,0.1)]">
                                        <Thermometer className="text-[#D12A00]"/>
                                        <p className="text-[16px] font-semibold">{latestReadings.readings.temperature}°C</p>
                                        <p className="text-[#757575] text-[16px] font-medium capitalize">temp</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(37,196,98,0.1)]">
                                        <Wind className="text-[#25C462]"/>
                                        <p className="text-[16px] font-semibold">{sensorUnit.humidity}%</p>
                                        <p className="text-[#757575] text-[16px] font-medium capitalize">humidity</p>
                                    </div>
                                </div> */}
                                <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[24px] mt-[24px]">
                                    <div className="px-[24px] flex justify-between items-center text-[#0D121C]">
                                        <div className="flex items-center space-x-[12px]">
                                            <Wrench size={25} className='cursor-pointer' onClick={() => { setSchedule("ScheduleMaintenan") }} />
                                            <Eye size={25} className='cursor-pointer' onClick={() => {
                                                children.setFarmID(sensorUnit.farmId);
                                                children.setFieldID(sensorUnit.fieldId);
                                                children.setSensorUnitId(sensorUnit.id);
                                                setSchedule("ShowSensorUnit")
                                            }} />
                                        </div>

                                        <Trash2 size={25} className='cursor-pointer text-[#ea2f2f]' onClick={() => { DeleteSensorUnit(sensorUnit.farmId, sensorUnit.fieldId, sensorUnit.id) }} />
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    }) : null
                    }

                </div>
                {addNewSensor === "Step1" ? <div className='fixed z-50 inset-0'><AddNewSensorStep1 fields={fields} indexIRRSDS1={indexIRRSDS1} setIndexIRRSDS1={setIndexIRRSDS1} /></div> :
                    addNewSensor === "Step2" ? <div className='fixed z-50 inset-0'><AddNewSensorStep2 getSensorUnits={getSensorUnits} farmId={children.farmId} field={fields[indexIRRSDS1]} /></div> : ""}
            </div>
        </>
    );
}

export default SensorsPartInSD;
