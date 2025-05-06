// import { Droplet, Thermometer, Wind } from 'lucide-react';
// import React from 'react';

// const SensorItem = () => {
//     return (
//         <div className="grid grid-cols-2 px-[24px] sm:grid-cols-3  font-manrope justify-items-center gap-[10px] ">
//                                                 <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(8,159,252,0.1)]">
//                                                     <Droplet className="text-[#089FFC]"/>
//                                                     <p className="text-[16px] font-semibold">ssn%</p>
//                                                     <p className="text-[#757575] text-[16px] font-medium capitalize">moisture</p>
//                                                 </div>
//                                                 <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(209,42,0,0.1)]">
//                                                     <Thermometer className="text-[#D12A00]"/>
//                                                     <p className="text-[16px] font-semibold">wkks°C</p>
//                                                     <p className="text-[#757575] text-[16px] font-medium capitalize">temp</p>
//                                                 </div>
//                                                 <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(37,196,98,0.1)]">
//                                                     <Wind className="text-[#25C462]"/>
//                                                     <p className="text-[16px] font-semibold">sksksk%</p>
//                                                     <p className="text-[#757575] text-[16px] font-medium capitalize">humidity</p>
//                                                 </div>
//                                             </div>
//     );
// }
import { useEffect} from "react";
import * as signalR from "@microsoft/signalr";
const SensorItem  = ({farmId,accessToken,latestReadings,setLatestReadings}) => {
    
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://agrivision.tryasp.net/hubs/sensors", {
            accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

        connection.on("ReceiveReading", (unitId, data) => {
        const payload = {
            unitId,
            readings: data.readings,
        };

        setLatestReadings((prev) => ({
            ...prev,
            [unitId]: payload,
        }));
        });

        connection
        .start()
        .then(() => connection.invoke("SubscribeToFarm", farmId))
        .catch(console.error);

        return () => {
        connection.stop();
        };
    }, []);
        
    return (
        <>
        <div className="grid grid-cols-2 px-6 sm:grid-cols-3 font-manrope justify-items-center gap-4">
  {Object.values(latestReadings).map((sensor, index) => (
    <div key={index} className="flex flex-col items-center justify-around py-2 w-[120px] h-[104px] rounded-[15px] bg-[rgba(8,159,252,0.1)]">
      <p className="text-[#089FFC] text-lg font-semibold">{sensor.readings.moisture}%</p>
      <p className="text-gray-600 text-sm capitalize">Moisture</p>
    </div>
  ))}
</div>
                                                    </>
        
    );
};

export default SensorItem;
