import { Droplet, Thermometer, Wind } from "lucide-react";

const SensorItem = ({ sensorUnit, latestReadings }) => {
    // Get the readings for this specific sensor unit
    const sensorReading = latestReadings[sensorUnit.id];
    
    console.log(`📊 Sensor reading for ${sensorUnit.name}:`, sensorReading);

    // Helper function to format moisture percentage
    const formatMoisture = (moisture) => {
        if (moisture === null || moisture === undefined) return '--';
        const value = Math.max(0, parseFloat(moisture)); // Ensure non-negative
        return `${String(value).split(".")[0]}%`;
    };

    // If no readings available, show default values or loading state
    if (!sensorReading || !sensorReading.readings) {
        return (
            <div className="grid grid-cols-3 px-[16px] sm:px-[20px] xl:px-[24px] font-manrope gap-[4px] sm:gap-[6px] xl:gap-[8px] mt-[12px] sm:mt-[14px] xl:mt-[16px]">
                <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(8,159,252,0.1)]">
                    <Droplet size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#089FFC] flex-shrink-0"/>
                    <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">--</p>
                    <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">moisture</p>
                </div>
                <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(209,42,0,0.1)]">
                    <Thermometer size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#D12A00] flex-shrink-0"/>
                    <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">--</p>
                    <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">temp</p>
                </div>
                <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(37,196,98,0.1)]">
                    <Wind size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#25C462] flex-shrink-0"/>
                    <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">--</p>
                    <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">humidity</p>
                </div>
            </div>
        );
    }

    const { readings } = sensorReading;

    return (
        <div className="grid grid-cols-3 px-[16px] sm:px-[20px] xl:px-[24px] font-manrope gap-[4px] sm:gap-[6px] xl:gap-[8px] mt-[12px] sm:mt-[14px] xl:mt-[16px]">
            <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(8,159,252,0.1)]">
                <Droplet size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#089FFC] flex-shrink-0"/>
                <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">
                    {formatMoisture(readings.moisture)}
                </p>
                <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">moisture</p>
            </div>
            <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(209,42,0,0.1)]">
                <Thermometer size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#D12A00] flex-shrink-0"/>
                <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">
                    {readings.temperature ? `${readings.temperature}°C` : '--'}
                </p>
                <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">temp</p>
            </div>
            <div className="flex flex-col items-center justify-around py-[8px] sm:py-[10px] min-w-0 h-[80px] sm:h-[90px] xl:h-[104px] rounded-[10px] sm:rounded-[12px] xl:rounded-[15px] bg-[rgba(37,196,98,0.1)]">
                <Wind size={16} className="sm:w-[18px] sm:h-[18px] xl:w-[20px] xl:h-[20px] text-[#25C462] flex-shrink-0"/>
                <p className="text-[12px] sm:text-[14px] xl:text-[15px] font-semibold">
                    {readings.humidity ? `${readings.humidity}%` : '--'}
                </p>
                <p className="text-[#757575] text-[10px] sm:text-[11px] xl:text-[12px] font-medium capitalize">humidity</p>
            </div>
        </div>
    );
};

export default SensorItem;