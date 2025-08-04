import { motion } from 'framer-motion';
import { Cpu, Eye, MapPin, Plus, Trash2, Wrench, TriangleAlert } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";
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
    const [isLoading, setIsLoading] = useState(true);
    // let [sensorUnitId,setSensorUnitId]=useState([])
    let status = ["Active", "Idle", "Maintenance"]
    // const firstReading = Object.values(latestReadings)[0]?.readings;

    // Initialize readings from sensor unit data
    useEffect(() => {
        if (sensorUnits && sensorUnits.length > 0) {
            console.log("🔄 Initializing readings from sensor unit data...");
            const initialReadings = {};
            
            sensorUnits.forEach(sensorUnit => {
                // Set initial readings from sensor unit data
                initialReadings[sensorUnit.id] = {
                    unitId: sensorUnit.id,
                    readings: {
                        moisture: sensorUnit.moisture,
                        temperature: sensorUnit.temperature,
                        humidity: sensorUnit.humidity
                    }
                };
            });
            
            setLatestReadings(initialReadings);
            console.log("✅ Initial readings set:", initialReadings);
        }
    }, [sensorUnits]);

    // SignalR connection setup
    useEffect(() => {
        if (!token || !children.farmId) return;

        // Set up SignalR for real-time updates
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/sensors`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        // Safe handler that figures out the shape of incoming data
        connection.on("ReceiveReading", (...args) => {
            console.log("📡 ReceiveReading fired with args:", args);

            if (args.length === 2) {
                const [unitId, data] = args;
                console.log("✅ Interpreted as unitId + data:", unitId, data);

                if (data && data.readings) {
                    setLatestReadings((prev) => ({
                        ...prev,
                        [unitId]: {
                            unitId,
                            readings: data.readings,
                        },
                    }));
                } else {
                    console.warn("⚠️ Received data has no 'readings' field:", data);
                }
            } else if (args.length === 1) {
                const payload = args[0];
                console.log("✅ Interpreted as single payload:", payload);

                if (payload && payload.unitId && payload.readings) {
                    setLatestReadings((prev) => ({
                        ...prev,
                        [payload.unitId]: payload,
                    }));
                } else {
                    console.warn("⚠️ Malformed payload:", payload);
                }
            } else {
                console.error("❌ Unexpected arguments received in ReceiveReading");
            }
        });

        connection
            .start()
            .then(() => {
                console.log("✅ Connected to SignalR hub");
                return connection.invoke("SubscribeToFarm", children.farmId);
            })
            .then(() => {
                console.log(`🪴 Subscribed to farm ${children.farmId}`);
            })
            .catch((err) => {
                console.error("❌ Error during SignalR connection:", err);
            });

        return () => {
            connection.stop();
        };
    }, [token, children.farmId, baseUrl]);

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
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
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
            console.log("📊 Sensor units loaded:", data);
        } catch (error) {
            console.error("Error fetching sensor units:", error);
        } finally {
            setIsLoading(false);
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

    return (
        <>
            <div className="">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 mb-[16px] sm:mb-[20px]">
                    <p className="text-[15px] sm:text-[17px] font-semibold capitalize">Sensors</p>
                    <div className="flex justify-center sm:justify-end">
                        <button className="py-[6px] sm:py-[8px] px-[16px] sm:px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[13px] sm:text-[15px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium w-full sm:w-auto" onClick={() => { setAddNewSensor("Step1") }}>
                            <div className="flex justify-center items-center space-x-[8px] sm:space-x-[10px]">
                                <Plus size={16} className="sm:w-[19px] sm:h-[19px]" />
                                <p className="capitalize">add new Sensor</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[16px] sm:gap-[20px] xl:gap-[28px] font-manrope">
                    {isLoading ? (
                        <div className="col-span-full flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading sensors...</p>
                            </div>
                        </div>
                    ) : sensorUnits && sensorUnits.length > 0 ? sensorUnits.map((sensorUnit, index) => {
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
                                        <h3 className="text-[14px] sm:text-[16px] xl:text-[17px] font-semibold capitalize truncate">{sensorUnit.name}</h3>
                                    </div>
                                    <h3 className="bg-[#25C462] rounded-[12px] sm:rounded-[15px] px-[8px] sm:px-[10px] xl:px-[12px] py-[1px] sm:py-[2px] text-[11px] sm:text-[12px] xl:text-[14px] font-semibold text-[#FFFFFF] capitalize flex-shrink-0">{status[sensorUnit.status]}</h3>
                                </div>
                                <div className="px-[16px] sm:px-[20px] xl:px-[24px] flex items-center space-x-[6px] sm:space-x-[8px] text-[12px] sm:text-[14px] xl:text-[15px] text-[#9F9F9F]">
                                    <MapPin size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] flex-shrink-0" />
                                    <p className="font-semibold capitalize truncate">{children.farmName} - {sensorUnit.fieldName}</p>
                                </div>
                                <div className="mt-2 px-[16px] sm:px-[20px] xl:px-[28px] flex space-x-[6px] sm:space-x-[8px] text-[12px] sm:text-[14px] xl:text-[15px] text-[#9F9F9F] font-manrope">
                                    <p className="capitalize font-medium">firmware:</p>
                                    <p className="text-black font-semibold truncate">{sensorUnit.firmWareVersion}</p>
                                </div>

                                <SensorItem sensorUnit={sensorUnit} latestReadings={latestReadings} />

                                <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[16px] sm:py-[20px] xl:py-[24px] mt-[16px] sm:mt-[20px] xl:mt-[24px]">
                                    <div className="px-[16px] sm:px-[20px] xl:px-[24px] flex justify-between items-center text-[#0D121C]">
                                        <div className="flex items-center space-x-[10px] sm:space-x-[12px]">
                                            <Wrench size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer hover:text-mainColor transition-colors' onClick={() => { setSchedule("ScheduleMaintenan") }} />
                                            <Eye size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer hover:text-mainColor transition-colors' onClick={() => {
                                                children.setFarmID(sensorUnit.farmId);
                                                children.setFieldID(sensorUnit.fieldId);
                                                children.setSensorUnitId(sensorUnit.id);
                                                setSchedule("ShowSensorUnit")
                                            }} />
                                        </div>

                                        <Trash2 size={20} className='sm:w-[22px] sm:h-[22px] xl:w-[25px] xl:h-[25px] cursor-pointer text-[#ea2f2f] hover:text-red-600 transition-colors' onClick={() => { DeleteSensorUnit(sensorUnit.farmId, sensorUnit.fieldId, sensorUnit.id) }} />
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    }) : (
                        <div className="col-span-full">
                            <div className="h-[120px] sm:h-[150px] rounded-md text-[14px] sm:text-[16px] font-medium space-y-2 border-2 border-dashed border-[#0d121c21] mx-2 sm:mx-3 flex flex-col justify-center items-center">
                                <TriangleAlert size={28} className="sm:w-[32px] sm:h-[32px] xl:w-[36px] xl:h-[36px] text-yellow-500 mb-1" />
                                <p className="text-[#808080]">You have no sensor yet</p>
                                <p className="text-[#1f1f1f96] text-[12px] sm:text-[14px] text-center px-3 sm:px-4">
                                    No sensors have been added to this farm yet. Click the "Add New Sensor" button to get started with monitoring your fields.
                                </p>
                            </div>
                        </div>
                    )
                    }

                </div>
                {addNewSensor === "Step1" ? <div className='fixed z-50 inset-0'><AddNewSensorStep1 fields={fields} indexIRRSDS1={indexIRRSDS1} setIndexIRRSDS1={setIndexIRRSDS1} /></div> :
                    addNewSensor === "Step2" ? <div className='fixed z-50 inset-0'><AddNewSensorStep2 getSensorUnits={getSensorUnits} farmId={children.farmId} field={fields[indexIRRSDS1]} /></div> : ""}
            </div>
        </>
    );
}

export default SensorsPartInSD;
