import { Calendar, Cpu, Droplet, Hash, MapPin, SquarePen, Thermometer, User, Wifi, Wind, Wrench, X, Zap } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import DateDisplay from '../DateDisplay/DateDisplay';
import TimeOnly from '../TimeOnly/TimeOnly';
import * as signalR from "@microsoft/signalr";

const ShowSensorUnit = (children) => {
    let {setSchedule,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [sensorUnit,setSensorUnit]=useState()
    let [memberRole,setMemberRole]=useState();
    let [latestReading,setLatestReading]=useState(null);
    let [isLoadingReading,setIsLoadingReading]=useState(false);
    let status=["Active","Idle","Maintenance"]
    
    // Helper function to format moisture percentage
    const formatMoisture = (moisture) => {
        if (moisture === null || moisture === undefined) return '--';
        const value = Math.max(0, parseFloat(moisture)); // Ensure non-negative
        return `${String(value).split(".")[0]}%`;
    };
    
    async function getSensorUnit(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmID}/fields/${children.fieldID}/SensorUnits/${children.sensorUnitId}`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            setSensorUnit(data)
            getMember(data.addedById)
            console.log(data)
            children.setShowIrr(data)
        }catch(error){
            console.error("Error fetching sensor unit:", error);
            toast.error("Failed to load sensor unit details");
        }
    }
    
    async function getMember(memberId){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmID}/members/${memberId}`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            setMemberRole(data)
            children.setShowIrrMember(data)
            console.log("getMember: ",data)
        }catch(error){
            console.error("getMember error:", error);
        }
    }
    
    // Fetch latest readings from database
    async function fetchLatestReading() {
        if (!sensorUnit || !token) return;
        
        setIsLoadingReading(true);
        try {
            const options = {
                url: `${baseUrl}/farms/${children.farmID}/fields/${children.fieldID}/SensorUnits/${children.sensorUnitId}/readings/latest`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            
            const { data } = await axios(options);
            console.log(`📊 Latest reading for sensor:`, data);
            
            if (data && data.readings) {
                setLatestReading(data.readings);
            }
        } catch (error) {
            console.error("❌ Error fetching latest reading:", error);
        } finally {
            setIsLoadingReading(false);
        }
    }
    
    // Set up SignalR for real-time updates
    useEffect(() => {
        if (!sensorUnit || !token) return;
        
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/sensors`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveReading", (...args) => {
            console.log("📡 ReceiveReading fired with args:", args);

            if (args.length === 2) {
                const [unitId, data] = args;
                if (unitId === children.sensorUnitId && data && data.readings) {
                    setLatestReading(data.readings);
                }
            } else if (args.length === 1) {
                const payload = args[0];
                if (payload && payload.unitId === children.sensorUnitId && payload.readings) {
                    setLatestReading(payload.readings);
                }
            }
        });

        connection
            .start()
            .then(() => {
                console.log("✅ Connected to SignalR hub");
                return connection.invoke("SubscribeToFarm", children.farmID);
            })
            .then(() => {
                console.log(`🪴 Subscribed to farm ${children.farmID}`);
                // Fetch initial readings after connecting
                fetchLatestReading();
            })
            .catch((err) => {
                console.error("❌ Error during SignalR connection:", err);
            });

        return () => {
            connection.stop();
        };
    }, [sensorUnit, token, children.farmID, children.sensorUnitId]);

    useEffect(()=>{getSensorUnit()},[])
    
    return (
        sensorUnit?<section className='h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute z-50 w-[100%] p-4 sm:p-6' onClick={(e)=>{if(e.target==e.currentTarget){setSchedule(null)}}}>
            <div className="w-full sm:w-[90%] md:w-[700px] lg:w-[800px] max-w-[800px] px-[16px] sm:px-[24px] lg:px-[40px] h-[90vh] sm:h-[85vh] lg:h-[780px] max-h-[90vh] overflow-y-auto border-2 rounded-xl sm:rounded-2xl bg-white p-[16px] sm:p-[20px] text-[#0D121C] font-manrope">
                <div className="">
                    <div className="flex justify-between items-center mb-[16px] sm:mb-[20px]">
                        <div className="flex items-center space-x-[8px] sm:space-x-[11px] flex-1 min-w-0">
                            <Cpu size={20} className="sm:w-[24px] sm:h-[24px] lg:w-[28px] lg:h-[28px] flex-shrink-0"/>
                            <h3 className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#1E6930] capitalize font-semibold truncate">{sensorUnit.name}</h3>
                        </div>
                        <X size={24} className='sm:w-[28px] sm:h-[28px] lg:w-[33px] lg:h-[33px] cursor-pointer hover:text-red-500 transition-all duration-150 flex-shrink-0' onClick={()=>{setSchedule(null)}}/>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-[16px] sm:text-[18px] lg:text-[19px] font-medium text-[#616161] capitalize cursor-pointer">
                        <h4 className="">sensor details</h4>
                        <div className="flex items-center space-x-[8px] sm:space-x-[11px] py-[4px] sm:py-[5px] px-[10px] sm:px-[12px] border-[1px] border-[#9F9F9F] rounded-[5px] text-[14px] sm:text-[16px] lg:text-[17px] w-fit" onClick={()=>{setSchedule("EditSensorUnit")}}>
                            <SquarePen size={18} className="sm:w-[20px] sm:h-[20px] lg:w-[23px] lg:h-[23px]" />
                            <p className="">edit</p>
                        </div>
                    </div>
                    <div className="mt-[10px] sm:mt-[12px] text-[15px] sm:text-[17px] lg:text-[18px] font-medium flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-[8px] sm:space-x-[12px] text-[#0D121C]">
                            <p className="">Status:</p>
                            <h5 className="bg-[#25C462] rounded-[12px] sm:rounded-[15px] px-[8px] sm:px-[10px] py-[2px] flex justify-center items-center text-[12px] sm:text-[14px] font-semibold text-[#FFFFFF] capitalize">{status[sensorUnit.status]}</h5>
                        </div>
                        <p className="capitalize font-semibold">type: <span className="text-[#616161] font-medium">sensor</span></p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 text-[14px] sm:text-[15px] lg:text-[16px] mt-[16px] sm:mt-[20px] gap-y-[12px] sm:gap-y-[15px] gap-x-[16px] sm:gap-x-[20px] font-medium capitalize">
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">field & location</h5>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                    <MapPin size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                    <p className="truncate">{sensorUnit.fieldName}</p>
                                </div>
                                <p className="text-[#616161] ps-[22px] sm:ps-[24px] text-[12px] sm:text-[13px] lg:text-[14px]">full coverage</p>
                            </div>
                        </div>
                                                <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">serial number</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Hash size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <p className="truncate">{sensorUnit.serialNumber}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">installation date</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Calendar size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <DateDisplay dateStr={sensorUnit.installationDate}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">firmware version</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Cpu size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <p className="truncate">{sensorUnit.firmWareVersion}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">IP address</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Wifi size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <p className="truncate">{sensorUnit.ipAddress}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">MAC address</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Wifi size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <p className="truncate">{sensorUnit.macAddress}</p>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">last maintenance</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Wrench size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <DateDisplay dateStr={sensorUnit.lastMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">next maintenance</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <Calendar size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <DateDisplay dateStr={sensorUnit.nextMaintenance}/>
                            </div>
                        </div>
                        <div className="">
                            <h5 className="text-mainColor mb-[4px] sm:mb-[5px] font-semibold text-[13px] sm:text-[14px] lg:text-[15px]">added by</h5>
                            <div className="flex items-center space-x-[6px] sm:space-x-[8px]">
                                <User size={16} className='sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] text-[#616161] flex-shrink-0'/>
                                <p className="truncate">{sensorUnit.addedBy}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="border-t-[1px] border-[#9F9F9F] mt-[16px] sm:mt-[20px] pt-[12px] sm:pt-[15px]">
                    <p className="text-[#616161] text-[15px] sm:text-[17px] lg:text-[18px] font-medium capitalize mb-[12px] sm:mb-[15px] text-center">
                        last reading
                        {isLoadingReading && <span className="text-[#089FFC] ml-2">⟳</span>}
                    </p>
                    <div className="h-auto min-h-[100px] sm:min-h-[120px] lg:min-h-[135px] bg-[#9f9f9f27] rounded-[12px] sm:rounded-[15px] py-[12px] sm:py-[15px] px-[8px] sm:px-[12px]">
                        <div className="grid grid-cols-3 gap-[8px] sm:gap-[12px] mb-[12px] sm:mb-[15px]">
                            <div className="flex flex-col items-center space-y-[4px] sm:space-y-[6px]">
                                <Droplet size={18} className="sm:w-[20px] sm:h-[20px] lg:w-[22px] lg:h-[22px] text-[#089FFC]"/>
                                <p className="text-[12px] sm:text-[13px] lg:text-[14px] font-semibold text-center">
                                    {latestReading ? formatMoisture(latestReading.moisture) : formatMoisture(sensorUnit.moisture)}
                                </p>
                                <p className="text-[#757575] text-[10px] sm:text-[12px] lg:text-[14px] font-medium capitalize">moisture</p>
                            </div>
                            <div className="flex flex-col items-center space-y-[4px] sm:space-y-[6px]">
                                <Thermometer size={18} className="sm:w-[20px] sm:h-[20px] lg:w-[22px] lg:h-[22px] text-[#D12A00]"/>
                                <p className="text-[12px] sm:text-[13px] lg:text-[14px] font-semibold text-center">
                                    {latestReading ? (latestReading.temperature || '--') : (sensorUnit.temperature || '--')}
                                    {(latestReading?.temperature || sensorUnit.temperature) && '°C'}
                                </p>
                                <p className="text-[#757575] text-[10px] sm:text-[12px] lg:text-[14px] font-medium capitalize">temp</p>
                            </div>
                            <div className="flex flex-col items-center space-y-[4px] sm:space-y-[6px]">
                                <Wind size={18} className="sm:w-[20px] sm:h-[20px] lg:w-[22px] lg:h-[22px] text-[#25C462]"/>
                                <p className="text-[12px] sm:text-[13px] lg:text-[14px] font-semibold text-center">
                                    {latestReading ? (latestReading.humidity ? `${latestReading.humidity}%` : '--') : (sensorUnit.humidity ? `${sensorUnit.humidity}%` : '--')}
                                </p>
                                <p className="text-[#757575] text-[10px] sm:text-[12px] lg:text-[14px] font-medium capitalize">humidity</p>
                            </div>
                        </div>
                        <p className="text-[11px] sm:text-[14px] lg:text-[16px] text-[#616161] text-center font-semibold px-2">
                            Last updated: <DateDisplay dateStr={latestReading ? latestReading.readingDate || sensorUnit.lastUpdated || sensorUnit.installationDate : sensorUnit.lastUpdated || sensorUnit.installationDate}/> at <TimeOnly dateStr={latestReading ? latestReading.readingDate || sensorUnit.lastUpdated || sensorUnit.installationDate : sensorUnit.lastUpdated || sensorUnit.installationDate}/>
                            {latestReading && <span className="text-[#25C462] ml-2">●</span>}
                        </p>
                    </div>
                </div>
                    
            </div>
        </section>:null
    );
}

export default ShowSensorUnit;
