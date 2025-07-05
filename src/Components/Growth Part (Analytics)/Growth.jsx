
import {Line as LineDrow} from 'rc-progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sprout,Calendar, Ruler } from 'lucide-react';
const Growth = () => {
    const data = [
    { week: 'Week 1', current: 2.5, historical: 2.1 },
    { week: 'Week 2', current: 3.2, historical: 2.8 },
    { week: 'Week 3', current: 4.1, historical: 3.5 },
    { week: 'Week 4', current: 3.8, historical: 3.7 },
    { week: 'Week 5', current: 4.5, historical: 4.0 },
    { week: 'Week 6', current: 5.2, historical: 4.3 },
    { week: 'Week 7', current: 4.9, historical: 4.6 },
    { week: 'Week 8', current: 5.5, historical: 4.9 },
    ];
    return (
        <section className='mb-[30px]'>
            <div className="grid grid-cols-3 gap-[30px]">
                <div className="col-span-3 md:border-[1px] md:border-[rgba(13,18,28,0.25)] md:rounded-[15px]  md:p-[20px] ">
                    <div className="p-[10px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[10px]">Growth Progress Tracking</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Crop development stages and timeline</p>
                    </div>
                    <div className="">
                        <div className="">
                            <div className="mt-[10px]">
                                <div className="mt-[20px] space-y-[25px] py-[18px] md:p-[0] px-[10px] border-[1px] md:border-[0px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                                    <div className="flex justify-between items-center text-[#0D121C] md:text-[18px] font-medium">
                                        <div className="flex items-center space-x-4">
                                            <Sprout className='text-[#10B982]'/>
                                            <p className="">Corn Field</p>
                                        </div>
                                        <div className="flex justify-center">
                                        <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                            <p className=" capitalize text-[13px] md:text-[15px] text-[#10B982] font-bold ">Tasseling Stage</p>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="space-y-[20px] text-[#616161] text-[12px] md:text-[17px] font-semibold">
                                        <div className=" ">
                                            <LineDrow percent={92} strokeLinecap="round" strokeColor="#10B982" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                        </div>
                                        <div className=" flex justify-between items-center">
                                            <p className="">Planting</p>
                                            <p className="">Emergence</p>
                                            <p className="">Vegetative</p>
                                            <p className="">Tasseling</p>
                                            <p className="">Silking</p>
                                            <p className="">Maturity</p>
                                            <p className="">Harvest</p>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px]  md:text-[16px]">
                                            <div className="space-x-4 flex items-center ">
                                                <Calendar/>
                                                <p className="">Planted: Jun 17, 2025</p>
                                            </div>
                                            <div className="space-x-4 flex items-center">
                                                <Calendar/>
                                                <p className="">Est. Harvest: Feb 17, 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="mt-[20px] space-y-[25px] py-[18px] md:p-[0] px-[10px] border-[1px] md:border-[0px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                                    <div className="flex justify-between items-center text-[#0D121C] md:text-[17px] font-medium">
                                        <div className="flex items-center space-x-4">
                                            <Sprout className='text-[#F49E0B]'/>
                                            <p className="">Apple Field</p>
                                        </div>
                                        <div className="flex justify-center">
                                        <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(205,155,16,0.20)] border-[1px] border-[#F49E0B]">
                                            <p className=" capitalize text-[13px] md:text-[15px] text-[#F49E0B] font-bold ">Handling Stage</p>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="space-y-[15px] text-[#616161] text-[12px] md:text-[17px] font-semibold">
                                        <div className=" ">
                                            <LineDrow percent={92} strokeLinecap="round" strokeColor="#F49E0B" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                        </div>
                                        <div className=" flex justify-between items-center">
                                            <p className="">Planting</p>
                                            <p className="">Emergence</p>
                                            <p className="">Vegetative</p>
                                            <p className="">Tasseling</p>
                                            <p className="">Silking</p>
                                            <p className="">Maturity</p>
                                            <p className="">Harvest</p>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px]  md:text-[16px]">
                                            <div className="space-x-4 flex items-center ">
                                                <Calendar/>
                                                <p className="">Planted: Jun 17, 2025</p>
                                            </div>
                                            <div className="space-x-4 flex items-center">
                                                <Calendar/>
                                                <p className="">Est. Harvest: Feb 17, 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="mt-[20px] space-y-[25px] py-[18px] md:p-[0] px-[10px] border-[1px] md:border-[0px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                                    <div className="flex justify-between items-center text-[#0D121C] md:text-[17px] font-medium">
                                        <div className="flex items-center space-x-4">
                                            <Sprout className='text-[#3B82F6]'/>
                                            <p className="">Corn Field</p>
                                        </div>
                                        <div className="flex justify-center">
                                        <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(8,159,252,0.10)] border-[1px] border-[#3B82F6]">
                                            <p className=" capitalize text-[13px] md:text-[15px] text-[#3B82F6] font-bold ">Tasseling Stage</p>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="space-y-[15px] text-[#616161] text-[12px] md:text-[17px] font-semibold">
                                        <div className=" ">
                                            <LineDrow percent={92} strokeLinecap="round" strokeColor="#3B82F6" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                        </div>
                                        <div className=" flex justify-between items-center">
                                            <p className="">Planting</p>
                                            <p className="">Emergence</p>
                                            <p className="">Vegetative</p>
                                            <p className="">Tasseling</p>
                                            <p className="">Silking</p>
                                            <p className="">Maturity</p>
                                            <p className="">Harvest</p>
                                        </div>
                                        <div className="flex justify-between items-center text-[13px]  md:text-[16px]">
                                            <div className="space-x-4 flex items-center ">
                                                <Calendar/>
                                                <p className="">Planted: Jun 17, 2025</p>
                                            </div>
                                            <div className="space-x-4 flex items-center">
                                                <Calendar/>
                                                <p className="">Est. Harvest: Feb 17, 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-1 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Growth Measurements</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Weekly height and development tracking</p>
                        <div className="">
                            <div className="mt-[30px] space-y-[15px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                    <p className="">Corn </p>
                                    <div className="flex items-center space-x-2">
                                        <Ruler />
                                        <p className="">48cm</p>
                                    </div>
                                </div>
                                <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                <div className="text-[#616161] text-[16px] font-medium flex justify-between items-center">
                                    <p className="">Weekly Growth: +7.2 cm</p>
                                    <p className="">Target: 120 cm</p>
                                </div>
                            </div>
                            <div className="mt-[30px] space-y-[15px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                    <p className="">Apple </p>
                                    <div className="flex items-center space-x-2">
                                        <Ruler />
                                        <p className="">60cm</p>
                                    </div>
                                </div>
                                <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                <div className="text-[#616161] text-[16px] font-medium flex justify-between items-center">
                                    <p className="">Weekly Growth: +5 cm</p>
                                    <p className="">Target: 400 cm</p>
                                </div>
                            </div>
                            <div className="mt-[30px] space-y-[15px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                    <p className="">Grape  </p>
                                    <div className="flex items-center space-x-2">
                                        <Ruler />
                                        <p className="">100cm</p>
                                    </div>
                                </div>
                                <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                                <div className="text-[#616161] text-[16px] font-medium flex justify-between items-center">
                                    <p className="">Weekly Growth: +10 cm</p>
                                    <p className="">Target: 300 cm</p>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="col-span-3 md:col-span-2 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className='mb-[20px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Health Index Trend</h2>
                        <p className="text-[#616161] text-[17px] font-medium">30-day plant health tracking</p>
                    </div>
                    <div className="h-[100%]">
                    <ResponsiveContainer width="100%" height="75%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis  dataKey="week" angle={0} />
                            <YAxis  label={{   value: 'Growth (cm/week)',   angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 18, fill: '#333' }}}/>
                            <Tooltip />
                            <Legend iconSize={20} verticalAlign="top" height={36} iconType="plainline" wrapperStyle={{ fontSize:"17px", fontWeight:"500",top:"0px"}}/>
                            <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} name="Current Season"/>
                            <Line type="monotone" dataKey="historical" stroke="#F49E0B" strokeWidth={2} activeDot={{ r: 8 }} name="Historical Average"/>
                        </LineChart>
                    </ResponsiveContainer>         
        </div>
                </div>
            </div>
        </section>
    );
}

export default Growth;
