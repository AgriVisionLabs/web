import { useContext, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Droplet, Thermometer, Wind } from "lucide-react";
import { AllContext } from "../../Context/All.context";
const SensorItem = ({farmId,accessToken,latestReadings,setLatestReadings }) => {
    let {baseUrl}=useContext(AllContext)
        console.log(farmId,accessToken,latestReadings)
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/sensors`, {
            accessTokenFactory: () => accessToken,
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
            return connection.invoke("SubscribeToFarm", farmId);
        })
        .then(() => {
            console.log(`🪴 Subscribed to farm ${farmId}`);
        })
        .catch((err) => {
            console.error("❌ Error during SignalR connection:", err);
        });

        return () => {
        connection.stop();
        };
    }, [accessToken, farmId, setLatestReadings]);

    return (
        <div className="grid grid-cols-2 px-[24px] sm:grid-cols-3  font-manrope justify-items-center gap-[10px] ">
        {Object.values(latestReadings).map((sensor, index) => ( 
            <>
            <div key={index} className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(8,159,252,0.1)]">
                <Droplet className="text-[#089FFC]"/>
                <p className="text-[15px] font-semibold">{String(sensor.readings.moisture).split(".")[0]}%</p>
                <p className="text-[#757575] text-[15px] font-medium capitalize">moisture</p>
            </div>
            <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(209,42,0,0.1)]">
                <Thermometer className="text-[#D12A00]"/>
                <p className="text-[15px] font-semibold">{sensor.readings.temperature}°C</p>
                <p className="text-[#757575] text-[15px] font-medium capitalize">temp</p>
            </div>
            <div className="flex flex-col items-center justify-around py-[10px] w-[120px] h-[104px] rounded-[15px] bg-[rgba(37,196,98,0.1)]">
                <Wind className="text-[#25C462]"/>
                <p className="text-[15px] font-semibold">{sensor.readings.humidity}%</p>
                <p className="text-[#757575] text-[15px] font-medium capitalize">humidity</p>
            </div>
            </>
        ))}

        </div>
    );
    };
    

export default SensorItem;