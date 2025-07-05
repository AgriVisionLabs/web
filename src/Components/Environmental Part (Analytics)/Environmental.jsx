
import { Wifi,Battery, TriangleAlert, Clock } from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
const Environmental = () => {
    let data1 = [
    { day: "Mon", corn: 0, apple: 80, grape: 90 },
    { day: "Tue", corn: 60, apple: 65, grape: 45 },
    { day: "Wed", corn: 70, apple: 105, grape: 65 },
    { day: "Thu", corn: 40, apple: 75, grape: 55 },
    { day: "Fri", corn: -5, apple: 80, grape: 30 },
    { day: "Sat", corn: 85, apple: 10, grape: 0 },
    { day: "Sun", corn: 65, apple: 5, grape: 2 }
    ];
    return (
        <section className='mb-[30px]'>
            <div className="grid xl:grid-cols-3 gap-y-[30px] xl:gap-x-[30px]">
                <div className=" col-span-2  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                    <ResponsiveContainer className="relative">
                        <LineChart data={data1} margin={{ top: 100, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="6 6" />
                        <XAxis dataKey="day"   padding={{left: 20, right: 20}}/>
                        
                        <YAxis  label={{ value: "Moisture (%)" , angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 18, fill: '#333' } } }    domain={[-25,125]} tickCount={7} padding={{top: 20, bottom: 20}}/>
                        <Tooltip />
                        <Legend iconSize={20} iconType="plainline" verticalAlign="top" wrapperStyle={{marginTop:"-50px", fontSize:"17px"}}/>
                        <Line type="monotone" dataKey="corn" stroke="#007bff" name="Corn Field" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="apple" stroke="#FFA500" name="Apple Field" strokeWidth={3} />
                        <Line type="monotone" dataKey="grape" stroke="#28a745" name="Grape Field" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className=" grid grid-rows-2 gap-y-[30px] xl:gap-y-[40px]">
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[12px]">Temperature & Humidity</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Daily averages with anomalies</p>
                        <div className="mt-[15px] space-y-[10px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <p className="">Temperature</p>
                                <p className="">40° F</p>
                            </div>
                            <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            <div className="flex justify-between items-center text-[#616161] text-[16px] font-semibold">
                                <p className="">Min: 40° F</p>
                                <p className="">Optimal: 70 - 80° F</p>
                                <p className="">Max: 85° F</p>
                            </div>
                        </div>
                        <div className="mt-[15px] space-y-[10px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <p className="">Humidity</p>
                                <p className="">62%</p>
                            </div>
                            <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            <div className="flex justify-between items-center text-[#616161] text-[16px] font-semibold">
                                <p className="">Min: 40%</p>
                                <p className="">Optimal: 50 - 70 %</p>
                                <p className="">Max: 80%</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Sensor Health</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Status of all field sensors</p>
                        <div className="mt-[20px] space-y-[10px]">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] text-[16px] font-medium">
                                    <Wifi strokeWidth={2.5} className='text-[#25C462]' />
                                    <p className="">Connectivity</p>
                                </div>
                                    <div className="px-[12px] py-[4px] rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">92% online</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] text-[16px] font-medium">
                                    <Battery strokeWidth={2.5} className='text-[#CD9B10]' />
                                    <p className="">Battery Levels</p>
                                </div>
                                    <div className="px-[12px] py-[4px] rounded-[15px] bg-[rgba(205,155,16,0.20)] border-[1px] border-[#CD9B10]">
                                        <p className=" capitalize text-[14px] text-[#CD9B10] font-bold">92% online</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] text-[16px] font-medium">
                                    <Clock strokeWidth={2.5} className='text-[#089FFC]' />
                                    <p className="">Data Freshness</p>
                                </div>
                                    <div className="px-[12px] py-[4px] rounded-[15px] bg-[rgba(8,159,252,0.10)] border-[1px] border-[#089FFC]">
                                        <p className=" capitalize text-[14px] text-[#089FFC] font-bold">92% online</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] text-[16px] font-medium">
                                    <TriangleAlert strokeWidth={2.5} className='text-[#E13939]' />
                                    <p className="">Alerts</p>
                                </div>
                                    <div className="px-[12px] py-[4px] rounded-[15px] bg-[rgba(225,57,57,0.10)] border-[1px] border-[#E13939]">
                                        <p className=" capitalize text-[14px] text-[#E13939] font-bold">92% online</p>
                                    </div>
                                    
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

export default Environmental;
