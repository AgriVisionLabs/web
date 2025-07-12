import { CircleAlert, CircleCheckBig, CircleX } from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
const IrrigationPartAnalytics = () => {
    let data1 = [
    { week: 'Week 1', corn: 240, apple: 230, grape: 40 },
    { week: 'Week 2', corn: 200, apple: 150, grape: 50 },
    { week: 'Week 3', corn: 220, apple: 300, grape: 60 },
    { week: 'Week 4', corn: 180, apple: 220, grape: 55 },
];
    return (
        <section className='mb-[30px]'>
            <div className="grid xl:grid-cols-3 gap-[30px]">
                <div className=" xl:col-span-2  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                    <div className="p-[20px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[12px]">Water Usage History</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Total water used by field over time</p>
                    </div>
                    <div className='h-[60%] xl:h-[70%]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data1} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis label={{value: 'Water Usage (gal)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 18, fill: '#333' }}} domain={[0,300]} tickCount={7} />
                        <Tooltip />
                        <Legend iconSize={20} verticalAlign="top" iconType="plainline" height={36}  wrapperStyle={{marginTop:"-20px", fontSize:"19px"}}/>
                        <Bar barSize={40} dataKey="corn" fill="#007bff" name="Corn Field" />
                        <Bar barSize={40} dataKey="apple" fill="#FFA500" name="Apple Field" />
                        <Bar barSize={40} dataKey="grape" fill="#28a745" name="Grape Field" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between  mx-auto text-[15px] md:text-[17px] p-[20px]">
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">This Period</p>
                            <p className=" font-medium">1243 gal</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Previous Period</p>
                            <p className=" font-medium">1420 gal</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Change</p>
                            <p className="text-[#25C462]  font-medium">-12.5 %</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Efficiency</p>
                            <p className=" font-medium">87%</p>
                        </div>
                    </div>
                </div>
                <div className=" grid grid-rows-2 gap-y-[40px]">
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Irrigation Efficiency</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Water used vs. moisture improvement</p>
                        <div className="mt-[25px] space-y-[15px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[19px] font-medium">
                                <p className="">Corn Field</p>
                                <p className="">92%</p>
                            </div>
                            <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                        <div className="mt-[25px] space-y-[15px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[19px] font-medium">
                                <p className="">Apple Field</p>
                                <p className="">78%</p>
                            </div>
                            <LineDrow percent={78} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                        <div className="mt-[25px] space-y-[15px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[19px] font-medium">
                                <p className="">Grape Field</p>
                                <p className="">85%</p>
                            </div>
                            <LineDrow percent={85} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                    </div>
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Smart Suggestions</h2>
                        <p className="text-[#616161] text-[17px] font-medium">AI recommendation performance</p>
                        <div className="mt-[25px] pb-[15px] space-y-[10px] border-b-[1px] border-[#9F9F9F]">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <CircleCheckBig strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Followed</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">24 Suggestions</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <CircleX strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Ignored</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(225,57,57,0.10)] border-[1px] border-[#E13939]">
                                        <p className=" capitalize text-[14px] text-[#E13939] font-bold">7 Suggestions</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <CircleAlert strokeWidth={2} className='text-[#089FFC]' />
                                    <p className="">Pending</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(8,159,252,0.10)] border-[1px] border-[#089FFC]">
                                        <p className=" capitalize text-[14px] text-[#089FFC] font-bold">3 Suggestions</p>
                                    </div>
                                    
                                
                            </div>
                            
                        </div>
                        <div className=" font-medium pt-[15px]">
                                <div className="flex justify-between items-center text-[18px]">
                                    <p className="mb-[16px]">Success Rate</p>
                                    <p className="text-mainColor">92%</p>
                                </div>
                                <p className="text-[#616161] text-[17px]">
                                    Based on moisture improvement after following suggestions
                                </p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}


export default IrrigationPartAnalytics;
